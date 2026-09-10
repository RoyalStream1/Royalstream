# Architectural & Design Decisions (ADRs) 🏛️

---

## ADR 001: Native Stellar Asset / Token Contract Choice for Vault Assets

### Context
When initializing a royalty vault, creators require receiving payouts in established, stable assets (e.g. `USDC` or `XLM`).

### Decision
RoyalStream accepts standard Stellar Token contracts (SEP-41 / SAC compliant tokens like `USDC`) for deposits and payouts. The vault itself maintains share records (`ShareBalance(Address)`) internally in contract instance storage.

### Rationale
Using established stable assets avoids volatile payout risks for investors, while keeping internal share ledger logic isolated within the contract for gas efficiency.

---

## ADR 002: Pull-Based Cumulative Accounting vs Push Distribution

### Context
Distributing royalty payouts to hundreds of token holders upon revenue deposit.

### Decision
Adopt a pull-based master-chef cumulative accounting design using `cumulative_per_share` scaled by `1e12`.

### Rationale
Push distribution requires looping over holder accounts in a single transaction, causing contract execution to exceed Soroban gas limits as holder count grows. Pull-based accounting provides constant-time $O(1)$ deposits and claims.

---

## ADR 003: Manual Revenue Attestation + 48-Hour Dispute Window for MVP

### Context
Verifying off-chain streaming statements for early protocol launch.

### Decision
Implement a `ManualSubmissionSource` adapter coupled with a 48-hour dispute window, rather than forcing unverified external API dependencies prior to mainnet launch.

### Rationale
Full automated API ingestion requires complex corporate OAuth credentials and multi-oracle setup. A dispute window provides a transparent, auditable MVP security model while allowing pluggable extension adapters for future oracle node integration.
