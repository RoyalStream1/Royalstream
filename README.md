# RoyalStream 👑⚡

**Decentralized Royalty Tokenization & Instant Revenue Settlement Platform on Stellar / Soroban**

[![Soroban CI](https://github.com/royalstream/royalstream/actions/workflows/soroban-ci.yml/badge.svg)](https://github.com/royalstream/royalstream/actions/workflows/soroban-ci.yml)
[![Monorepo CI](https://github.com/royalstream/royalstream/actions/workflows/turbo-ci.yml/badge.svg)](https://github.com/royalstream/royalstream/actions/workflows/turbo-ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Stellar Network](https://img.shields.io/badge/Stellar-Testnet-purple.svg)](https://stellar.org)

RoyalStream is an open-source decentralized finance (DeFi) protocol built on the Stellar blockchain and Soroban smart contracts. It enables independent creators (musicians, podcasters, streamers, digital artists) to tokenize a fraction of their future stream or ad revenue into tradable royalty shares. Fans and investors purchase shares upfront, providing creators with non-debt capital. When royalty income arrives, a Soroban smart contract automatically distributes payouts pro-rata to share holders using a gas-efficient, pull-based cumulative accounting model.

---

## Table of Contents

- [Why RoyalStream Exists](#why-royalstream-exists)
- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [Architecture Overview](#architecture-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Soroban Smart Contracts (`royalty_vault`)](#soroban-smart-contracts-royalty_vault)
- [Oracle & Revenue Attestation Infrastructure](#oracle--revenue-attestation-infrastructure)
- [API Overview](#api-overview)
- [Frontend Application](#frontend-application)
- [Installation](#installation)
- [Local Development](#local-development)
- [Running Tests](#running-tests)
- [Repository Structure](#repository-structure)
- [Documentation Links](#documentation-links)
- [Security](#security)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [Frequently Asked Questions](#frequently-asked-questions)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Why RoyalStream Exists

Independent creators generate billions of dollars annually in streaming royalties and ad revenues across Spotify, Apple Music, YouTube, and podcast platforms. However, creators face severe financial hurdles:
- **Capital Starvation**: Creators must wait 3 to 9 months for royalty payouts from distributors.
- **Predatory Advance Deals**: Traditional label advance deals demand massive royalty percentage cuts and ownership of master rights.
- **Disconnected Fan Economy**: Fans have no simple, transparent mechanism to back creators early and share directly in their economic success.

RoyalStream solves this by turning future revenue streams into liquid, on-chain fractional shares governed by Soroban smart contracts on Stellar.

---

## Problem Statement

Existing royalty financing platforms are either centralized web2 intermediaries with high fees, or blockchain projects that attempt pushing payouts to token holders in loops—causing contract execution to exceed block gas limits when token holder counts grow. Furthermore, existing protocols often suffer from revenue-attestation trust bottlenecks or claim features that fail to reflect actual repository capabilities.

---

## Solution Overview

RoyalStream addresses these challenges with three core pillars:
1. **Fractional Royalty Vaults**: Creators mint fixed-supply royalty shares representing a fixed percentage of revenues over a defined streaming period.
2. **Gas-Efficient Cumulative Accounting**: A pull-based payout contract algorithm ($O(1)$ state update per deposit) allows infinite share holders to claim pro-rata earnings without looping over accounts.
3. **Trust-Minimized Revenue Oracle**: A pluggable revenue adapter architecture with a 48-hour dispute window that bridges off-chain streaming statements into on-chain contract deposits.

---

## Architecture Overview

```
+-----------------------------------------------------------------------------------+
|                                   ROYALSTREAM                                     |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|   +---------------------+       +-----------------------+                         |
|   |  Next.js 15 Web App | <---> |  Backend REST API     |                         |
|   |  (Marketplace,      |       |  (Express + Prisma)   |                         |
|   |   Dashboard, Vault) |       |  (Off-chain metadata) |                         |
|   +----------+----------+       +-----------+-----------+                         |
|              |                              |                                     |
|              v                              v                                     |
|   +-----------------------------------------------------+                         |
|   |             @royalstream/stellar-sdk                |                         |
|   |    (Soroban RPC Client & Freighter Wallet Driver)   |                         |
|   +--------------------------+--------------------------+                         |
|                              |                                                    |
|                              v                                                    |
|   +-----------------------------------------------------+                         |
|   |        Soroban Contract: `royalty_vault`            |                         |
|   |   (Cumulative Accounting, Mint, Deposit, Claim)     |                         |
|   +--------------------------^--------------------------+                         |
|                              |                                                    |
|                              | Attests & Deposits                                 |
|   +--------------------------+--------------------------+                         |
|   |                Oracle Revenue Worker                |                         |
|   | (Pluggable RevenueSource Adapters + Timelock Guard) |                         |
|   +-----------------------------------------------------+                         |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## Key Features

- **Soroban Smart Contract Vaults**: On-chain minting, deposit, pro-rata claim, and secondary share transfers.
- **$O(1)$ Cumulative Payout Algorithm**: Scalable pull-based reward distribution powered by a `1e12` scale factor multiplier.
- **Pluggable Revenue Adapters**: Ingestion pipeline supporting `ManualSubmissionSource` with extension stubs for `SpotifyRevenueSource` and `DistroKidRevenueSource`.
- **48-Hour Oracle Dispute Window**: Security buffer allowing share holders to audit submitted earnings before automated smart contract deposits.
- **Stellar Wallet Integration**: Native support for Freighter and Lobstr browser wallets with automated testnet fallback mechanisms.
- **Modern Next.js 15 Web App**: Responsive dark-mode interface with glassmorphic cards, Recharts revenue historical charts, and Zustand state management.

---

## Technology Stack

- **Smart Contracts**: Rust, Soroban SDK (`v20.0.0` / pinned host compatibility), WASM target (`wasm32-unknown-unknown`).
- **Blockchain**: Stellar Network (Testnet / Future Mainnet).
- **Monorepo Manager**: TurboRepo + `pnpm` workspaces.
- **Frontend App**: Next.js 15 (App Router), React 18, Tailwind CSS, Zustand, Recharts, Lucide Icons.
- **Backend API**: Node.js, Express, TypeScript, Zod, Prisma ORM.
- **Oracle Ingestion**: TypeScript cron worker, pluggable adapter architecture.
- **Shared Packages**: `@royalstream/types`, `@royalstream/stellar-sdk`, `@royalstream/ui`.

---

## Soroban Smart Contracts (`royalty_vault`)

The core Soroban contract lives in [`soroban-contracts/royalty-vault`](file:///c:/Users/JOTEL/OneDrive/Documentos/Royalstream/soroban-contracts/royalty-vault/src/lib.rs).

### Public Entry Points

| Function | Parameters | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `initialize` | `creator`, `oracle`, `asset`, `total_shares`, `period_start`, `period_end` | `creator` | Initializes a new royalty vault with configuration. |
| `mint_shares` | `to`, `amount` | `admin` (creator) | Mints/assigns initial fractional shares to a buyer. |
| `deposit_revenue` | `from`, `amount` | `creator` or `oracle` | Transfers asset funds to vault & increments `cumulative_per_share`. |
| `claim_payout` | `holder` | `holder` | Transfers accumulated pro-rata earnings to `holder`. |
| `transfer_shares` | `from`, `to`, `amount` | `from` | Transfers secondary shares while preserving earned checkpoints. |
| `get_holder_balance` | `holder` | None (View) | Returns current unclaimed payout owed to `holder`. |
| `get_vault_info` | None | None (View) | Returns general vault parameters and current state. |

### Cumulative Accounting Model

Instead of iterating over share holders during `deposit_revenue`, the contract maintains a global multiplier:
$$\text{cumulative\_per\_share}_{new} = \text{cumulative\_per\_share}_{old} + \frac{\text{amount} \times 10^{12}}{\text{total\_shares}}$$

When a holder claims earnings or transfers shares:
$$\text{owed} = \frac{\text{shares} \times (\text{cumulative\_per\_share}_{current} - \text{last\_claimed\_cumulative})}{10^{12}} + \text{unclaimed\_payout}$$

---

## Oracle & Revenue Attestation Infrastructure

RoyalStream relies on a **trust-minimized revenue attestation model**:
- **MVP Attestation Flow**: Creators submit streaming income reports (`ManualSubmissionSource`) attached to distributor statement hashes.
- **48-Hour Timelock Dispute Window**: Submissions enter a pending state. Investors and auditors have 48 hours to review proof documentation before the oracle worker executes `deposit_revenue` on-chain.
- **Pluggable Architecture**: Built on the `RevenueSourceAdapter` interface (`apps/oracle-worker/src/adapters/index.ts`), enabling future integrations with Spotify, DistroKid, and accounting APIs.

---

## API Overview

The backend REST service (`apps/backend-api`) exposes off-chain data endpoints:
- `GET /health` — Service health check.
- `GET /api/creators` — List creator profiles.
- `GET /api/vaults` — Query active and completed vaults.
- `POST /api/vaults` — Register a newly deployed vault.
- `POST /api/submissions` — Submit a revenue report for attestation.
- `GET /api/submissions/pending` — Fetch pending timelocked submissions.
- `POST /api/disputes` — File a dispute against a pending submission.

---

## Frontend Application

The frontend (`apps/frontend`) is a Next.js 15 web application with 5 core views:
1. **Marketplace (`/`)**: Browse available royalty vaults with genre filtering and APY metrics.
2. **Vault Detail (`/vaults/[id]`)**: Deep dive into vault contracts, share pricing, Recharts yield history, and share acquisition.
3. **Creator Onboarding (`/onboard`)**: Step-by-step form to parameterize and deploy a new Soroban vault.
4. **Creator Dashboard (`/creator-dashboard`)**: Manage active vaults and submit quarterly revenue reports.
5. **Fan Portfolio (`/portfolio`)**: Track owned shares, total yield earned, and execute one-click payout claims.

*(Note: Native mobile apps are listed on the project roadmap).*

---

## Installation

### Prerequisites
- Node.js `>= 18.0.0`
- `pnpm` `>= 8.0.0`
- Rust toolchain & `wasm32-unknown-unknown` target (for contract development)

### Clone & Install Workspace
```bash
git clone https://github.com/royalstream/royalstream.git
cd royalstream
pnpm install
```

---

## Local Development

### 1. Compile Soroban Smart Contract
```bash
cd soroban-contracts/royalty-vault
cargo build --target wasm32-unknown-unknown --release
```

### 2. Run Local Web App & Services
From the workspace root:
```bash
pnpm turbo run dev
```
The Next.js frontend will be available at [http://localhost:3000](http://localhost:3000).

---

## Running Tests

### Soroban Contract Unit Tests
```bash
cd soroban-contracts/royalty-vault
cargo test
```

### Workspace Build Verification
```bash
pnpm turbo run build
```

---

## Repository Structure

```
royalstream/
├── apps/
│   ├── backend-api/       # Express REST API (Metadata & Disputes)
│   ├── frontend/          # Next.js 15 Web Application
│   └── oracle-worker/     # Revenue Ingestion & Timelock Worker
├── packages/
│   ├── stellar-sdk/       # Soroban RPC Client & Wallet Drivers
│   ├── types/             # Shared TypeScript Interfaces
│   └── ui/                # Shared React Components
├── soroban-contracts/
│   └── royalty-vault/     # Rust Soroban Smart Contract & Unit Tests
├── docs/                  # In-depth Technical Documentation
├── scripts/               # Developer Utility & Walkthrough Scripts
├── turbo.json             # TurboRepo Pipeline Config
└── pnpm-workspace.yaml    # Workspace Package Definitions
```

---

## Documentation Links

- 📐 [Architecture Guide](docs/architecture.md)
- 📜 [Smart Contracts Specification](docs/smart-contracts.md)
- 🔮 [Oracle & Revenue Architecture](docs/oracle-architecture.md)
- 🔌 [REST API Documentation](docs/api.md)
- 🖥️ [Frontend Application Guide](docs/frontend.md)
- 🛠️ [Development Setup](docs/development.md)
- 🚀 [Deployment Guide](docs/deployment.md)
- 🧪 [Testing Guide](docs/testing.md)
- 🛡️ [Security Policy](SECURITY.md)
- 🤝 [Contributing Guidelines](CONTRIBUTING.md)

---

## Security

Security is a paramount priority. Smart contracts manage investor funds and royalty payouts.

- **Vulnerability Reporting**: Please report smart contract vulnerabilities according to our [SECURITY.md](SECURITY.md) protocol.
- **Oracle Trust Model**: The 48-hour dispute timelock isolates smart contract execution from off-chain revenue reporting errors.

---

## Contributing

We welcome contributions from developers, designers, and web3 enthusiasts! Please review [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before submitting pull requests.

---

## Roadmap

- [x] Soroban `royalty_vault` Contract with Cumulative Accounting
- [x] Pluggable Revenue Adapter & 48h Timelock Worker
- [x] Next.js 15 Web Marketplace & Fan Portfolio
- [ ] On-Chain Multi-Oracle Consensus Attestation
- [ ] Automated Spotify & DistroKid API Connectors
- [ ] On-Chain Dispute Arbitration & Stake Slashing
- [ ] Native Mobile App (React Native / iOS & Android)

---

## Frequently Asked Questions

See our full [FAQ.md](FAQ.md) for questions on share pricing, payout calculation, wallet compatibility, and mainnet deployment plans.

---

## License

RoyalStream is released under the [MIT License](LICENSE).

---

## Acknowledgements

Built with ❤️ for independent creators using [Stellar](https://stellar.org) and [Soroban](https://soroban.stellar.org).
