# Oracle & Revenue Attestation Infrastructure 🔮

## Executive Summary

Off-chain streaming revenues generated on platforms like Spotify, Apple Music, and YouTube cannot be natively verified by a blockchain smart contract. RoyalStream solves this revenue-attestation challenge through a **trust-minimized oracle architecture** featuring a pluggable adapter pattern and a 48-hour dispute timelock buffer.

---

## Architecture & Data Flow

```
+-------------------+      1. Submit Statement      +------------------------+
| Creator Dashboard | ────────────────────────────> | Backend API Database   |
+-------------------+                               | (Status: PENDING)      |
                                                    +-----------+------------+
                                                                |
                                                                | 2. 48-Hour Dispute
                                                                |    Window Passes
                                                                v
+-------------------+      3. Execute Deposit       +------------------------+
| Soroban Vault     | <──────────────────────────── | Oracle Ingestion Worker|
| Contract          |                               +------------------------+
+-------------------+
```

---

## The Pluggable `RevenueSourceAdapter` Pattern

All revenue ingestion sources implement the unified TypeScript interface defined in [`apps/oracle-worker/src/adapters/index.ts`](file:///c:/Users/JOTEL/OneDrive/Documentos/Royalstream/apps/oracle-worker/src/adapters/index.ts):

```typescript
export interface RevenueStatement {
  vaultId: string;
  periodStart: number;
  periodEnd: number;
  grossAmountStroops: string;
  statementHash: string;
  sourceType: 'SPOTIFY' | 'DISTROKID' | 'MANUAL';
}

export interface RevenueSourceAdapter {
  fetchLatestRevenue(vaultId: string): Promise<RevenueStatement | null>;
}
```

### Active MVP Adapters

1. **`ManualSubmissionSource` (Active MVP)**:
   - Creator uploads revenue report statement hash and earned amount.
   - Entry is stored with `status: PENDING` and `timelockExpiresAt: Date.now() + 48 hours`.
2. **`SpotifyRevenueSource` (Roadmap Stub)**:
   - Connects to Spotify for Artists API via OAuth 2.0.
3. **`DistroKidRevenueSource` (Roadmap Stub)**:
   - Parses quarterly CSV statement downloads from music aggregators.

---

## The 48-Hour Dispute Window Security Buffer

To prevent dishonest creators from submitting inflated revenue figures:
- Every report enters a **48-hour challenge period**.
- Share holders can review the attached statement hash and audit distributor receipts.
- If a dispute is filed via `POST /api/disputes`, the submission status transitions to `DISPUTED` and automated contract execution is halted pending resolution.
- If no dispute is logged after 48 hours, `apps/oracle-worker` automatically signs and submits `deposit_revenue` to Soroban.

---

## Future Roadmap: Multi-Oracle Consensus Attestation

In Phase 2, RoyalStream will transition from single-key oracle attestation to an $m$-of-$n$ multi-party oracle network (e.g. Chainlink / Band Protocol nodes) that independently fetch streaming statements and co-sign on-chain deposit transactions.
