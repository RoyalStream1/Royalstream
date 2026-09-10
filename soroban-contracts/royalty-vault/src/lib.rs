#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, token, Address, Env, Symbol
};

const SCALE_FACTOR: i128 = 1_000_000_000_000; // 1e12 precision multiplier

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    Unauthorized = 3,
    InvalidAmount = 4,
    ExceedsTotalShares = 5,
    InsufficientShares = 6,
    PeriodEnded = 7,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum DataKey {
    Admin,
    Oracle,
    Asset,
    TotalShares,
    SharesMinted,
    PeriodStart,
    PeriodEnd,
    TotalDeposited,
    CumulativePerShare,
    ShareBalance(Address),
    LastClaimedCumulative(Address),
    UnclaimedPayout(Address),
    IsInitialized,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct VaultInfo {
    pub creator: Address,
    pub oracle: Address,
    pub asset: Address,
    pub total_shares: u32,
    pub shares_minted: u32,
    pub period_start: u64,
    pub period_end: u64,
    pub total_deposited: i128,
    pub cumulative_per_share: i128,
}

#[contract]
pub struct RoyaltyVaultContract;

#[contractimpl]
impl RoyaltyVaultContract {
    /// Initializes a new royalty vault for a creator's stream and period.
    ///
    /// # Authorization
    /// `creator` must authorize this call.
    pub fn initialize(
        env: Env,
        creator: Address,
        oracle: Address,
        asset: Address,
        total_shares: u32,
        period_start: u64,
        period_end: u64,
    ) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::IsInitialized) {
            return Err(Error::AlreadyInitialized);
        }

        creator.require_auth();

        if total_shares == 0 {
            return Err(Error::InvalidAmount);
        }

        env.storage().instance().set(&DataKey::Admin, &creator);
        env.storage().instance().set(&DataKey::Oracle, &oracle);
        env.storage().instance().set(&DataKey::Asset, &asset);
        env.storage().instance().set(&DataKey::TotalShares, &total_shares);
        env.storage().instance().set(&DataKey::SharesMinted, &0u32);
        env.storage().instance().set(&DataKey::PeriodStart, &period_start);
        env.storage().instance().set(&DataKey::PeriodEnd, &period_end);
        env.storage().instance().set(&DataKey::TotalDeposited, &0i128);
        env.storage().instance().set(&DataKey::CumulativePerShare, &0i128);
        env.storage().instance().set(&DataKey::IsInitialized, &true);

        env.events().publish(
            (Symbol::new(&env, "initialized"), creator.clone()),
            (asset, total_shares, period_start, period_end),
        );

        Ok(())
    }

    /// Mints/assigns royalty shares to a buyer.
    ///
    /// # Authorization
    /// Creator/Admin only during the initial distribution phase.
    pub fn mint_shares(env: Env, to: Address, amount: u32) -> Result<(), Error> {
        Self::check_initialized(&env)?;
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        if amount == 0 {
            return Err(Error::InvalidAmount);
        }

        let total_shares: u32 = env.storage().instance().get(&DataKey::TotalShares).unwrap();
        let shares_minted: u32 = env.storage().instance().get(&DataKey::SharesMinted).unwrap();

        if shares_minted + amount > total_shares {
            return Err(Error::ExceedsTotalShares);
        }

        let current_cumulative: i128 = env.storage().instance().get(&DataKey::CumulativePerShare).unwrap_or(0);

        // Accrue any existing pending payout before modifying balance
        let existing_balance: u32 = env.storage().instance().get(&DataKey::ShareBalance(to.clone())).unwrap_or(0);
        if existing_balance > 0 {
            let last_claimed: i128 = env.storage().instance().get(&DataKey::LastClaimedCumulative(to.clone())).unwrap_or(0);
            let prev_unclaimed: i128 = env.storage().instance().get(&DataKey::UnclaimedPayout(to.clone())).unwrap_or(0);
            let pending = ((existing_balance as i128) * (current_cumulative - last_claimed)) / SCALE_FACTOR;
            env.storage().instance().set(&DataKey::UnclaimedPayout(to.clone()), &(prev_unclaimed + pending));
        }

        env.storage().instance().set(&DataKey::ShareBalance(to.clone()), &(existing_balance + amount));
        env.storage().instance().set(&DataKey::LastClaimedCumulative(to.clone()), &current_cumulative);
        env.storage().instance().set(&DataKey::SharesMinted, &(shares_minted + amount));

        env.events().publish(
            (Symbol::new(&env, "mint_shares"), to.clone()),
            amount,
        );

        Ok(())
    }

    /// Deposits royalty revenue into the vault for pro-rata distribution.
    ///
    /// # Authorization
    /// Callable by Creator or authorized Oracle address.
    pub fn deposit_revenue(env: Env, from: Address, amount: i128) -> Result<(), Error> {
        Self::check_initialized(&env)?;
        from.require_auth();

        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        let oracle: Address = env.storage().instance().get(&DataKey::Oracle).unwrap();

        if from != admin && from != oracle {
            return Err(Error::Unauthorized);
        }

        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        let total_shares: u32 = env.storage().instance().get(&DataKey::TotalShares).unwrap();
        let asset: Address = env.storage().instance().get(&DataKey::Asset).unwrap();

        // Transfer funds into contract vault
        let client = token::Client::new(&env, &asset);
        client.transfer(&from, &env.current_contract_address(), &amount);

        // Cumulative tracking update
        let current_cumulative: i128 = env.storage().instance().get(&DataKey::CumulativePerShare).unwrap_or(0);
        let addition = (amount * SCALE_FACTOR) / (total_shares as i128);
        let new_cumulative = current_cumulative + addition;

        let total_deposited: i128 = env.storage().instance().get(&DataKey::TotalDeposited).unwrap_or(0);

        env.storage().instance().set(&DataKey::CumulativePerShare, &new_cumulative);
        env.storage().instance().set(&DataKey::TotalDeposited, &(total_deposited + amount));

        env.events().publish(
            (Symbol::new(&env, "deposit_revenue"), from),
            amount,
        );

        Ok(())
    }

    /// Pull-based payout claim for a share holder.
    ///
    /// # Authorization
    /// `holder` must authorize to pull their pro-rata payout.
    pub fn claim_payout(env: Env, holder: Address) -> Result<i128, Error> {
        Self::check_initialized(&env)?;
        holder.require_auth();

        let owed = Self::get_holder_balance(env.clone(), holder.clone());
        if owed <= 0 {
            return Ok(0);
        }

        let current_cumulative: i128 = env.storage().instance().get(&DataKey::CumulativePerShare).unwrap_or(0);
        let asset: Address = env.storage().instance().get(&DataKey::Asset).unwrap();

        // Reset holder accounting checkpoint
        env.storage().instance().set(&DataKey::UnclaimedPayout(holder.clone()), &0i128);
        env.storage().instance().set(&DataKey::LastClaimedCumulative(holder.clone()), &current_cumulative);

        // Transfer owed payout
        let client = token::Client::new(&env, &asset);
        client.transfer(&env.current_contract_address(), &holder, &owed);

        env.events().publish(
            (Symbol::new(&env, "claim_payout"), holder.clone()),
            owed,
        );

        Ok(owed)
    }

    /// View function returning the current unclaimed payout owed to `holder`.
    pub fn get_holder_balance(env: Env, holder: Address) -> i128 {
        let shares: u32 = env.storage().instance().get(&DataKey::ShareBalance(holder.clone())).unwrap_or(0);
        let last_claimed: i128 = env.storage().instance().get(&DataKey::LastClaimedCumulative(holder.clone())).unwrap_or(0);
        let prev_unclaimed: i128 = env.storage().instance().get(&DataKey::UnclaimedPayout(holder.clone())).unwrap_or(0);
        let current_cumulative: i128 = env.storage().instance().get(&DataKey::CumulativePerShare).unwrap_or(0);

        let pending = ((shares as i128) * (current_cumulative - last_claimed)) / SCALE_FACTOR;
        prev_unclaimed + pending
    }

    /// Transfers secondary shares between holders while maintaining fair payout accounting.
    ///
    /// # Authorization
    /// `from` must authorize the transfer.
    pub fn transfer_shares(env: Env, from: Address, to: Address, amount: u32) -> Result<(), Error> {
        Self::check_initialized(&env)?;
        from.require_auth();

        if amount == 0 {
            return Err(Error::InvalidAmount);
        }

        let from_balance: u32 = env.storage().instance().get(&DataKey::ShareBalance(from.clone())).unwrap_or(0);
        if from_balance < amount {
            return Err(Error::InsufficientShares);
        }

        let current_cumulative: i128 = env.storage().instance().get(&DataKey::CumulativePerShare).unwrap_or(0);

        // Checkpoint from's balance and unclaimed payouts
        let from_owed = Self::get_holder_balance(env.clone(), from.clone());
        env.storage().instance().set(&DataKey::UnclaimedPayout(from.clone()), &from_owed);
        env.storage().instance().set(&DataKey::LastClaimedCumulative(from.clone()), &current_cumulative);
        env.storage().instance().set(&DataKey::ShareBalance(from.clone()), &(from_balance - amount));

        // Checkpoint to's balance and unclaimed payouts
        let to_balance: u32 = env.storage().instance().get(&DataKey::ShareBalance(to.clone())).unwrap_or(0);
        let to_owed = Self::get_holder_balance(env.clone(), to.clone());
        env.storage().instance().set(&DataKey::UnclaimedPayout(to.clone()), &to_owed);
        env.storage().instance().set(&DataKey::LastClaimedCumulative(to.clone()), &current_cumulative);
        env.storage().instance().set(&DataKey::ShareBalance(to.clone()), &(to_balance + amount));

        env.events().publish(
            (Symbol::new(&env, "transfer_shares"), from),
            (to, amount),
        );

        Ok(())
    }

    /// View function returning general vault configuration and state.
    pub fn get_vault_info(env: Env) -> Result<VaultInfo, Error> {
        Self::check_initialized(&env)?;

        Ok(VaultInfo {
            creator: env.storage().instance().get(&DataKey::Admin).unwrap(),
            oracle: env.storage().instance().get(&DataKey::Oracle).unwrap(),
            asset: env.storage().instance().get(&DataKey::Asset).unwrap(),
            total_shares: env.storage().instance().get(&DataKey::TotalShares).unwrap(),
            shares_minted: env.storage().instance().get(&DataKey::SharesMinted).unwrap(),
            period_start: env.storage().instance().get(&DataKey::PeriodStart).unwrap(),
            period_end: env.storage().instance().get(&DataKey::PeriodEnd).unwrap(),
            total_deposited: env.storage().instance().get(&DataKey::TotalDeposited).unwrap(),
            cumulative_per_share: env.storage().instance().get(&DataKey::CumulativePerShare).unwrap(),
        })
    }

    fn check_initialized(env: &Env) -> Result<(), Error> {
        if !env.storage().instance().has(&DataKey::IsInitialized) {
            return Err(Error::NotInitialized);
        }
        Ok(())
    }
}

#[cfg(test)]
mod test;
