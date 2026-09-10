# Project Governance 👑

RoyalStream is an open-source decentralized finance protocol. This document details the governance structure and decision-making processes for maintaining the repository.

---

## Maintainers & Codeowners

The project is maintained by core open-source engineers and technical steering group members:
- **Smart Contract Maintainers**: Responsible for `soroban-contracts/` code reviews, audit verification, and contract releases.
- **Frontend & App Maintainers**: Responsible for `apps/frontend`, `apps/backend-api`, `apps/oracle-worker`, and `packages/ui`.
- **SDK Maintainers**: Responsible for `packages/stellar-sdk` and `@royalstream/types`.

See [`.github/CODEOWNERS`](.github/CODEOWNERS) for explicit directory-level reviewer assignments.

---

## Decision-Making Process

1. **Minor Fixes & Refactoring**: Approved by 1 maintainer via standard Pull Request review.
2. **Architecture & Contract Changes**: Requires a formal proposal in [GitHub Discussions](https://github.com/royalstream/royalstream/discussions) and approval from at least 2 core contract maintainers.
3. **Emergency Security Hotfixes**: Executed directly by core maintainers with immediate post-deployment notification in `SECURITY.md` and release notes.

---

## Proposal Process (RFCs)

For major architectural enhancements (e.g. multi-oracle consensus, automated Spotify OAuth connectors, on-chain dispute slashing):
1. Create a markdown proposal under `docs/rfcs/000X-proposal-title.md`.
2. Open a Pull Request for discussion.
3. Allow a 14-day community review period prior to voting and merging.
