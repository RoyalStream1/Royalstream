# RoyalStream Contract Specifications (`royalty_vault`)

The `royalty_vault` contract is written in Rust for the Soroban smart contract environment on Stellar.

## Technical Design & Accounting Model

Instead of pushing revenue to thousands of token holders on every deposit (which risks exceeding gas limits and block limits), `royalty_vault` uses **pull-based cumulative per-share accounting**:

$$\text{CumulativePerShare}_{\text{new}} = \text{CumulativePerShare}_{\text{old}} + \frac{\text{DepositAmount} \times 10^{12}}{\text{TotalShares}}$$

When a holder claims revenue:
$$\text{PayoutOwed} = \frac{\text{Shares} \times (\text{CumulativePerShare} - \text{LastClaimedCumulative})}{\text{ScaleFactor}} + \text{UnclaimedPayout}$$

## Function Specifications & Authorization Model

### `initialize(creator: Address, oracle: Address, asset: Address, total_shares: u32, period_start: u64, period_end: u64)`
- **Auth:** `creator.require_auth()`
- **Behavior:** Initializes storage keys (`Admin`, `Oracle`, `Asset`, `TotalShares`, `SharesMinted`, `CumulativePerShare`). Rejects double initialization.

### `mint_shares(to: Address, amount: u32)`
- **Auth:** `admin.require_auth()` (creator)
- **Behavior:** Mints/assigns shares to a fan/investor. Checkpoints existing holder balance to preserve unclaimed earnings.

### `deposit_revenue(from: Address, amount: i128)`
- **Auth:** `from.require_auth()` (Must be either `Admin` or `Oracle`)
- **Behavior:** Transfers `amount` of standard SAC token into vault contract and updates `CumulativePerShare` and `TotalDeposited`.

### `claim_payout(holder: Address)`
- **Auth:** `holder.require_auth()`
- **Behavior:** Calculates pending payout, updates holder's `LastClaimedCumulative` to current checkpoint, resets `UnclaimedPayout`, and transfers funds to holder.

### `transfer_shares(from: Address, to: Address, amount: u32)`
- **Auth:** `from.require_auth()`
- **Behavior:** Checkpoints `from` and `to` unclaimed payouts and `LastClaimedCumulative` before updating share balances. Prevents new buyer from claiming past revenue and prevents seller from double-claiming.

### `get_holder_balance(holder: Address) -> i128`
- **View function:** Returns unclaimed payout owed to holder.

### `get_vault_info() -> VaultInfo`
- **View function:** Returns creator, oracle, asset, total_shares, shares_minted, period, and total_deposited.
