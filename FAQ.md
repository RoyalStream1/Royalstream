# Frequently Asked Questions (FAQ) ❓

---

### What is RoyalStream?
RoyalStream is an open-source decentralized platform built on Stellar and Soroban. It allows creators to sell fractional shares of their future streaming royalties or ad revenues to raise upfront capital, while providing fans and investors pro-rata payout distributions directly on-chain.

---

### How does the Soroban `royalty_vault` contract handle payouts without running out of gas?
The contract uses a **pull-based cumulative accounting model** ($O(1)$ state complexity per deposit). When revenue is deposited, the contract updates a single global variable (`cumulative_per_share`). Token holders claim their owed pro-rata earnings whenever they choose without requiring the contract to iterate over hundreds or thousands of investor accounts.

---

### What assets can be deposited into a vault?
Any standard token on Stellar (e.g. `USDC`, `XLM`, or custom SEP-41 assets). When initializing a vault, the creator specifies the asset address.

---

### How does RoyalStream verify off-chain streaming revenue?
For the MVP release, revenue attestation uses a **48-hour dispute window model**:
1. Creators submit earnings reports (`ManualSubmissionSource`) with attached statement hashes.
2. Reports enter a 48-hour pending timelock.
3. Investors and auditors review the proof. If unchallenged after 48 hours, the Oracle Worker executes the on-chain deposit.

Future roadmap updates will introduce automated Spotify/DistroKid API connectors and multi-oracle consensus.

---

### What wallets are supported?
The frontend integrates with **Freighter Wallet** and **Lobstr Wallet**. In local development mode without an extension installed, the app automatically provides a Stellar testnet developer wallet fallback (`GBRP...AGTY`).

---

### How do secondary share transfers work?
Share holders can transfer secondary shares using `transfer_shares`. The contract automatically checkpoints the seller's accumulated unclaimed payout before updating balances, ensuring no payout yield is leaked or lost.

---

### Can I run RoyalStream locally?
Yes! Follow the steps in [README.md](README.md) or [docs/development.md](docs/development.md):
```bash
pnpm install
cd soroban-contracts/royalty-vault && cargo test
pnpm turbo run dev
```
The web app will run at `http://localhost:3000`.
