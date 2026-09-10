# Soroban Smart Contract Specification (`royalty_vault`) 📜

## Overview

The `royalty_vault` contract is a production-grade Soroban Rust contract that governs creator royalty vaults on the Stellar blockchain.

- **Source Code**: [`soroban-contracts/royalty-vault/src/lib.rs`](file:///c:/Users/JOTEL/OneDrive/Documentos/Royalstream/soroban-contracts/royalty-vault/src/lib.rs)
- **Target Target**: `wasm32-unknown-unknown`
- **Soroban SDK Version**: `v20.0.0` (pinned host compatibility)

---

## Architectural Choice: Pull-Based vs Push-Based Distribution

### Why Push-Based Looping Fails
In traditional naive smart contract designs, depositing revenue causes the contract to loop over an array of all token holder addresses and send payout transfers directly (`for holder in holders { send(holder, share) }`).

- **Fatal Flaw**: As the number of fractional share holders grows (e.g. 5,000 fans), the transaction exceeds Soroban CPU/RAM and ledger entry gas limits, rendering the contract permanently un-callable and freezing all funds.

### Pull-Based Cumulative Accounting Solution ($O(1)$)
RoyalStream utilizes a pull-based master-chef cumulative accounting design:
1. When revenue is deposited, the contract updates a single global state counter `cumulative_per_share`:
   $$\Delta = \frac{\text{amount} \times 10^{12}}{\text{total\_shares}}$$
2. Each share holder's balance and unclaimed earnings are checkpointed upon minting or secondary share transfer.
3. Holders pull their owed pro-rata yield independently by calling `claim_payout`.
4. Execution time and gas cost remain constant ($O(1)$) regardless of whether the vault has 1 or 1,000,000 share holders.

---

## Contract State Schema

```rust
pub enum DataKey {
    Admin,                          // Address: Creator / Vault Administrator
    Oracle,                         // Address: Authorized Oracle Attestation Signer
    Asset,                          // Address: Stellar Token Asset (e.g. USDC)
    TotalShares,                    // u32: Total share capacity (e.g. 10,000)
    SharesMinted,                   // u32: Currently minted shares
    PeriodStart,                    // u64: Unix timestamp period start
    PeriodEnd,                      // u64: Unix timestamp period end
    TotalDeposited,                 // i128: Total accumulated deposits (stroops)
    CumulativePerShare,             // i128: Global multiplier (scaled by 1e12)
    ShareBalance(Address),          // u32: Shares held by Address
    LastClaimedCumulative(Address), // i128: Snapshot of cumulative_per_share at last claim
    UnclaimedPayout(Address),       // i128: Accrued unclaimed yield checkpoint
    IsInitialized,                  // bool: Initialization flag
}
```

---

## Function Interface Specification

### `initialize`
```rust
pub fn initialize(
    env: Env,
    creator: Address,
    oracle: Address,
    asset: Address,
    total_shares: u32,
    period_start: u64,
    period_end: u64,
) -> Result<(), Error>
```
- **Authorization**: `creator.require_auth()`
- **Errors**: `AlreadyInitialized`, `InvalidAmount`
- **Description**: Sets up initial vault configuration, assigns `Admin` to `creator`, and stores contract parameters.

---

### `mint_shares`
```rust
pub fn mint_shares(env: Env, to: Address, amount: u32) -> Result<(), Error>
```
- **Authorization**: `admin.require_auth()`
- **Errors**: `NotInitialized`, `Unauthorized`, `InvalidAmount`, `ExceedsTotalShares`
- **Description**: Mints `amount` fractional shares to `to`. Automatically checkpoints existing pending yield before modifying `ShareBalance(to)`.

---

### `deposit_revenue`
```rust
pub fn deposit_revenue(env: Env, from: Address, amount: i128) -> Result<(), Error>
```
- **Authorization**: `from.require_auth()`. `from` MUST match `Admin` or `Oracle`.
- **Errors**: `NotInitialized`, `Unauthorized`, `InvalidAmount`
- **Description**: Transfers `amount` token assets from `from` into contract vault address via Stellar Token Client and increments `CumulativePerShare`.

---

### `claim_payout`
```rust
pub fn claim_payout(env: Env, holder: Address) -> Result<i128, Error>
```
- **Authorization**: `holder.require_auth()`
- **Errors**: `NotInitialized`
- **Description**: Calculates owed yield using `get_holder_balance`, transfers tokens to `holder`, and resets `UnclaimedPayout(holder)` to 0.

---

### `transfer_shares`
```rust
pub fn transfer_shares(env: Env, from: Address, to: Address, amount: u32) -> Result<(), Error>
```
- **Authorization**: `from.require_auth()`
- **Errors**: `NotInitialized`, `InvalidAmount`, `InsufficientShares`
- **Description**: Transfers secondary shares from `from` to `to`. Checkpoints unclaimed payout balances for both seller and buyer before updating share balances.

---

### View Functions

- `get_holder_balance(env: Env, holder: Address) -> i128`: Returns current unclaimed payout owed to `holder`.
- `get_vault_info(env: Env) -> Result<VaultInfo, Error>`: Returns complete vault state parameters.
