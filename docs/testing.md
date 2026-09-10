# Testing Strategy & Edge Cases 🧪

## Overview

Quality assurance for RoyalStream is structured around smart contract accounting safety, monorepo type checking, and end-to-end integration flows.

---

## 1. Smart Contract Tests (`soroban-contracts/royalty-vault`)

Run Rust unit tests:
```bash
cd soroban-contracts/royalty-vault
cargo test
```

### Critical Edge Cases Covered

1. `test_initialize_and_vault_info`: Verifies initial parameters, admin role, and initial `cumulative_per_share = 0`.
2. `test_deposit_before_shares_minted`: Verifies revenue deposits behave correctly when total shares are defined but no shares have been minted yet.
3. `test_cumulative_deposit_claim_cycle`: Verifies multiple sequential deposits and claims across multiple buyers over time.
4. `test_share_transfer_mid_period`: Verifies secondary share transfers (`transfer_shares`) correctly checkpoint seller pending yield so no yield is lost or retroactively leaked to buyer.
5. `test_unauthorized_deposit_fails`: Ensures non-admin, non-oracle callers cannot deposit revenue.

---

## 2. Monorepo Build Verification

Verify all 6 workspace packages compile and type-check:
```bash
pnpm turbo run build
```
