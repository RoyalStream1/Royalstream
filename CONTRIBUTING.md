# Contributing to RoyalStream 👑⚡

Thank you for your interest in contributing to RoyalStream! We welcome contributions from developers, technical writers, security auditors, and community members.

This document outlines the workflow and standards for contributing to the RoyalStream open-source monorepo.

---

## Code of Conduct

All contributors are expected to adhere to our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Please read it to understand expected behaviors and community standards.

---

## Getting Started

### Prerequisites
- **Node.js**: `>= 18.0.0`
- **pnpm**: `>= 8.0.0`
- **Rust Toolchain**: `stable` with target `wasm32-unknown-unknown`
- **Git**

### Setting Up Your Workspace
1. Fork the repository on GitHub.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/royalstream.git
   cd royalstream
   ```
3. Install dependencies across the monorepo:
   ```bash
   pnpm install
   ```
4. Build the workspace packages and smart contract:
   ```bash
   cd soroban-contracts/royalty-vault
   cargo build --target wasm32-unknown-unknown --release
   cd ../..
   pnpm turbo run build
   ```

---

## Development Workflow

### Branch Strategy
- `main` — Production branch (always stable and passing build/test suites).
- `feature/description` — New features.
- `fix/description` — Bug fixes.
- `docs/description` — Documentation improvements.

### Making Changes
1. Create a descriptive branch off `main`:
   ```bash
   git checkout -b feature/add-oracle-consensus
   ```
2. Make your edits following our coding standards.
3. Run tests locally before opening a pull request:
   ```bash
   # Test smart contracts
   cd soroban-contracts/royalty-vault && cargo test && cd ../..

   # Test TS monorepo build
   pnpm turbo run build
   ```

---

## Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat(vault): add secondary share transfer fee logic`
- `fix(oracle): resolve timelock parsing bug in worker`
- `docs(api): document dispute submission endpoint`
- `test(contract): add edge case test for zero share minting`
- `refactor(ui): update StatBadge component styling`

---

## Submitting Pull Requests

1. Push your branch to your GitHub fork.
2. Open a Pull Request against `royalstream/royalstream` `main` branch.
3. Fill out the PR template completely:
   - Summary of changes
   - Related issue numbers
   - Verification steps performed
4. Ensure all CI checks pass (Rust unit tests, Turbo workspace build).
5. A maintainer will review your PR and provide feedback.

---

## Reporting Issues

- **Bug Reports**: Use the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md).
- **Feature Requests**: Use the [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md).
- **Security Vulnerabilities**: Do **NOT** post security flaws in public issues. Follow [SECURITY.md](SECURITY.md).

Thank you for helping build the future of creator financing on Stellar! 🚀
