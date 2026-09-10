# Soroban Contracts (`royalty_vault`)

Soroban Rust smart contract implementing creator royalty vault state, fractional share assignment, and pull-based cumulative revenue distributions.

## Build Commands
```bash
# Compile to WebAssembly target
cargo build --target wasm32-unknown-unknown --release

# Run unit tests
cargo test
```

## Unit Test Suite Overview
1. `test_initialize_and_vault_info`: Validates vault initialization and state parameters.
2. `test_deposit_before_shares_minted`: Verifies deposits occurring prior to share distribution.
3. `test_cumulative_deposit_claim_cycle`: Multi-period pro-rata payout accuracy test ($60\%/40\%$ split across round 1 and round 2 deposits).
4. `test_share_transfer_mid_period`: Secondary market share transfer accounting test, preventing retroactive payout leakage or seller double-claiming.
5. `test_unauthorized_deposit_fails`: Ensures non-creator / non-oracle deposits panic.
