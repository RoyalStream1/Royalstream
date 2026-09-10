# Troubleshooting Guide 🔧

Common developer issues and resolution steps.

---

### Issue 1: `Cargo build` fails with `ed25519-dalek` trait error
- **Cause**: Soroban SDK dependency conflict with `ed25519-dalek 3.0.0` trait changes.
- **Resolution**: Ensure `soroban-sdk = "20.0.0"` is pinned in `Cargo.toml`. Cargo.lock uses `ed25519-dalek 2.2.0` for `soroban-env-host`.

---

### Issue 2: `Cannot find name 'window'` during `oracle-worker` build
- **Cause**: TypeScript checking browser wallet file in Node.js environment without `dom` library.
- **Resolution**: `packages/stellar-sdk/src/wallet.ts` includes `declare const window: any;` guard at the top of the file.

---

### Issue 3: Next.js route `/vault/vault-1` returns 404
- **Cause**: Route folder naming mismatch (`vault` vs `vaults`).
- **Resolution**: App routes are mapped under `/vaults/[id]`. Links use `/vaults/${id}`.
