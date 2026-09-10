# Frontend Application Documentation 🖥️

The RoyalStream web frontend is built using Next.js 15 (App Router), React 18, Tailwind CSS, Zustand, and Recharts.

- **Directory**: [`apps/frontend`](file:///c:/Users/JOTEL/OneDrive/Documentos/Royalstream/apps/frontend)
- **Port**: `3000`

---

## Screen Architecture

```
apps/frontend/src/app/
├── page.tsx                  # 1. Marketplace / Home Page
├── onboard/
│   └── page.tsx              # 2. Creator Onboarding Form
├── creator-dashboard/
│   └── page.tsx              # 3. Creator Management Dashboard
├── portfolio/
│   └── page.tsx              # 4. Fan / Investor Portfolio
└── vaults/
    └── [id]/
        └── page.tsx          # 5. Vault Detail & Share Acquisition
```

---

## Detailed Views

### 1. Marketplace (`/`)
- Browse active creator vaults.
- Filter by music genre (`Electronic`, `Rock`, `Hip-Hop`, `Podcast`).
- View projected annual yield percentages (APY) and total deposited funds.

### 2. Creator Onboarding (`/onboard`)
- Step-by-step form to parameterize a new royalty stream.
- Configures total shares, share price, asset token address, and stream duration.
- Executes `initialize` call on Soroban via `@royalstream/stellar-sdk`.

### 3. Creator Dashboard (`/creator-dashboard`)
- Manage created vaults.
- Submit quarterly streaming income reports with attached distributor statement hashes.
- Track pending 48-hour dispute timelocks.

### 4. Fan Portfolio (`/portfolio`)
- View owned fractional shares across all vaults.
- Displays total unclaimed payout earnings in real-time.
- One-click **Claim Payout** button executing `claim_payout` via Freighter wallet.

### 5. Vault Detail (`/vaults/[id]`)
- Recharts interactive historical revenue graph.
- Detailed stream description and master rights terms.
- Modal dialog to purchase shares directly from creator during initial distribution.
