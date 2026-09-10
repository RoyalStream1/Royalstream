# Changelog

All notable changes to the RoyalStream project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-09-10

### Added
- **Soroban Contract (`royalty_vault`)**:
  - Implemented `initialize`, `mint_shares`, `deposit_revenue`, `claim_payout`, `transfer_shares`, `get_holder_balance`, `get_vault_info`.
  - Added cumulative per-share accounting algorithm using `1e12` precision factor.
  - Added 5 unit tests covering initialization, pre-share deposits, claim cycles, unauthorized deposits, and secondary transfers.
- **Oracle Worker (`apps/oracle-worker`)**:
  - Implemented pluggable `RevenueSourceAdapter` pattern.
  - Added `ManualSubmissionSource` with 48-hour dispute timelock monitoring.
  - Added extension stubs for `SpotifyRevenueSource` and `DistroKidRevenueSource`.
- **Backend API (`apps/backend-api`)**:
  - Added Express REST endpoints for creators, vaults, revenue submissions, and dispute filing.
  - Added Prisma ORM schema definition (`schema.prisma`).
- **Frontend App (`apps/frontend`)**:
  - Built Next.js 15 web interface (Marketplace `/`, Vault Detail `/vaults/[id]`, Creator Onboarding `/onboard`, Creator Dashboard `/creator-dashboard`, Fan Portfolio `/portfolio`).
  - Added Recharts historical revenue performance charts and Zustand global state store.
- **Shared SDK & UI (`packages/`)**:
  - Added `@royalstream/types` shared interfaces.
  - Added `@royalstream/stellar-sdk` Soroban RPC client and Freighter/Lobstr wallet connectors.
  - Added `@royalstream/ui` components (`VaultCard`, `WalletButton`, `StatBadge`).
- **Open-Source Infrastructure**:
  - Production-ready `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `GOVERNANCE.md`, `ROADMAP.md`, `FAQ.md`.
  - Comprehensive technical documentation in `docs/`.
  - GitHub Actions CI workflows for Rust/Soroban (`soroban-ci.yml`) and Turbo workspace (`turbo-ci.yml`).
