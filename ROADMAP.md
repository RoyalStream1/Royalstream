# RoyalStream Product Roadmap 🚀

This roadmap outlines the development milestones for RoyalStream from the MVP release to future protocol upgrades.

---

## Phase 1: Core Protocol MVP (Completed ✅)

- [x] **Soroban `royalty_vault` Contract**:
  - Gas-efficient cumulative per-share accounting ($O(1)$ state updates).
  - Minting, deposit, pro-rata pull claims, secondary transfers, view methods.
  - Comprehensive unit test suite (`5/5 passed`).
- [x] **Pluggable Oracle Ingestion**:
  - `RevenueSourceAdapter` interface.
  - `ManualSubmissionSource` with 48-hour dispute timelock worker.
- [x] **Web Frontend & Shared SDK**:
  - Next.js 15 web marketplace, creator dashboard, fan portfolio, vault details.
  - `@royalstream/stellar-sdk` Soroban client with Freighter/Lobstr wallet drivers.
  - `@royalstream/types` and `@royalstream/ui` shared monorepo packages.

---

## Phase 2: Oracle & Attestation Hardening (Q4 2026 ⏳)

- [ ] **Direct API Connectors**:
  - Implement full OAuth & statement parsing for Spotify for Artists (`SpotifyRevenueSource`).
  - Implement DistroKid API integration (`DistroKidRevenueSource`).
- [ ] **Multi-Oracle Consensus**:
  - Transition from single-oracle attestation to $m$-of-$n$ multi-party oracle signatures.
- [ ] **On-Chain Dispute Arbitration**:
  - Stake-backed dispute submissions with automated slashing for invalid attestation reports.

---

## Phase 3: Secondary Market & Token Standards (Q1 2027 ⏳)

- [ ] **Stellar Asset Contract (SAC) Integration**:
  - Wrap royalty shares as standard SEP-41 Soroban tokens for DEX liquidity (e.g. StellarX, Phoenix).
- [ ] **Automated Secondary Transfer Royalties**:
  - Enforce creator secondary fee cuts on share transfers.

---

## Phase 4: Ecosystem & Mobile (Q2 2027 ⏳)

- [ ] **Native Mobile Application**:
  - iOS and Android mobile apps for creators to track earnings on the go.
- [ ] **Automated Compliance & Identity**:
  - Optional zero-knowledge / lightweight KYC integrations for accredited investor tiers.
- [ ] **Cross-Chain Bridge Extensions**:
  - Bridges for cross-chain USDC funding from Ethereum / Polygon into Soroban vaults.
