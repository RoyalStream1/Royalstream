# `@royalstream/frontend`

Next.js 15 App Router web application for RoyalStream creator onboarding, marketplace browsing, and fan portfolio management.

## Tech Stack
- Next.js 15 (App Router, Server Components)
- React 18, TypeScript
- Tailwind CSS with modern dark mode aesthetic & glassmorphism
- Recharts for royalty payout analytics
- Freighter & Lobstr wallet connectors via `@royalstream/stellar-sdk`

## Routes
- `/` - Marketplace & active royalty vaults list with yield filtering
- `/vaults/[id]` - Vault details, interactive revenue chart, share purchase flow
- `/creator/onboarding` - Creator wallet verification & vault creation
- `/creator/dashboard` - Creator vault metrics, revenue submission form
- `/fan/dashboard` - Fan token portfolio, unclaimed payouts, claim actions
