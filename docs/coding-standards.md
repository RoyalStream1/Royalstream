# Coding Standards & Style Guidelines 📏

## Rust & Soroban Guidelines
- **Formatting**: Format code with `cargo fmt`.
- **Clippy**: Code must pass `cargo clippy --all-targets` without warnings.
- **Safety**: No `#![allow(warnings)]`. All functions must specify explicit authorization checks (`require_auth()`).

---

## TypeScript Guidelines
- **Strict Mode**: `strict: true` must be enabled across all workspace `tsconfig.json` configs.
- **Imports**: Use workspace aliases (`@royalstream/types`, `@royalstream/stellar-sdk`, `@royalstream/ui`).
- **Naming**: `CamelCase` for components, `camelCase` for variables and functions.
