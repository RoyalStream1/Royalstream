# Security Policy & Vulnerability Disclosure 🛡️

The RoyalStream project handles real economic value through Soroban smart contracts on the Stellar blockchain. We treat security as a first-class requirement.

---

## Reporting Vulnerabilities

If you discover a security vulnerability in RoyalStream, **do NOT open a public GitHub issue**.

Please report vulnerabilities privately via email to:
👉 **security@royalstream.io**

Include the following information in your submission:
- Description of the flaw and potential impact.
- Affected component (`soroban-contracts/royalty-vault`, `apps/oracle-worker`, `apps/backend-api`, `packages/stellar-sdk`, or `apps/frontend`).
- Step-by-step proof-of-concept (PoC) or reproduction steps.

We will acknowledge your report within **24 hours** and provide regular progress updates.

---

## Security Domains & Threat Models

RoyalStream operates across two distinct security domains:

### 1. Smart Contract Domain (`soroban-contracts/royalty-vault`)
- **Threat Surface**: Arithmetic overflows, authorization bypasses, re-entrancy risks, rounding errors in cumulative per-share accounting, state corruption during secondary transfers.
- **Contract Guarantees**:
  - `deposit_revenue` requires authorized `creator` or `oracle` signature.
  - `claim_payout` strictly transfers pro-rata accumulated yield based on $O(1)$ math.
  - `transfer_shares` checkpoints unclaimed payouts before modifying balances.
- **Reporting Severity**: Critical / High.

### 2. Oracle & Revenue Attestation Domain (`apps/oracle-worker`)
- **Threat Surface**: Misreported streaming income statements, compromised creator credentials, fake distributor receipts.
- **Trust Boundary**:
  - Off-chain streaming income relies on attestation.
  - The protocol enforces a **48-hour dispute window** before executing on-chain contract deposits.
  - Token holders and auditors can challenge unverified reports within the window.
- **Reporting Severity**: Medium / High (handled by oracle risk operations).

---

## Disclosure Policy

- Maintainers will investigate and patch verified vulnerabilities within **7 days** for critical issues and **30 days** for medium issues.
- Coordinated public disclosure will take place after patches are deployed to testnet/mainnet.
- Responsible reporters will be credited in our `CHANGELOG.md` and release notes.
