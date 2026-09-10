# Local Development Setup & Environment 🛠️

## Prerequisites

1. **Node.js**: `>= 18.0.0`
2. **pnpm**: `>= 8.0.0`
3. **Rust Toolchain**: `stable`
4. **WASM Target**: `rustup target add wasm32-unknown-unknown`
5. **Stellar CLI** (Optional, for manual Soroban RPC interaction): `cargo install --locked soroban-cli`

---

## Step-by-Step Installation

1. **Clone Monorepo**:
   ```bash
   git clone https://github.com/royalstream/royalstream.git
   cd royalstream
   ```

2. **Install Workspace Dependencies**:
   ```bash
   pnpm install
   ```

3. **Compile Soroban Contract**:
   ```bash
   cd soroban-contracts/royalty-vault
   cargo build --target wasm32-unknown-unknown --release
   cd ../..
   ```

4. **Environment Configuration**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

5. **Start Dev Servers**:
   ```bash
   pnpm turbo run dev
   ```
   - **Frontend App**: `http://localhost:3000`
   - **Backend API**: `http://localhost:3001`
