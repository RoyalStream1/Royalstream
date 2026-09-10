# Production & Testnet Deployment Guide 🚀

## Soroban Contract Deployment (Stellar Testnet)

1. **Configure Soroban Identity & Network**:
   ```bash
   soroban config network add --rpc-url https://soroban-testnet.stellar.org --network-passphrase "Test SDF Network ; September 2015" testnet
   soroban config identity generate deployer
   soroban config identity fund deployer --network testnet
   ```

2. **Optimize WASM Binary**:
   ```bash
   cd soroban-contracts/royalty-vault
   cargo build --target wasm32-unknown-unknown --release
   soroban contract optimize --wasm target/wasm32-unknown-unknown/release/royalty_vault.wasm
   ```

3. **Deploy to Testnet**:
   ```bash
   soroban contract deploy \
     --wasm target/wasm32-unknown-unknown/release/royalty_vault.optimized.wasm \
     --source deployer \
     --network testnet
   ```

---

## App & Worker Deployment

- **Frontend (`apps/frontend`)**: Deploy to Vercel or Netlify. Set `NEXT_PUBLIC_SOROBAN_RPC_URL` environment variable.
- **Backend API (`apps/backend-api`)**: Deploy to Railway, Fly.io, or Docker container.
- **Oracle Worker (`apps/oracle-worker`)**: Deploy as a persistent background process on Railway or AWS ECS.
