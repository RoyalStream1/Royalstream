# RoyalStream Revenue Oracle Design Document

## Trust Problem Definition
Royalty revenue generated on off-chain streaming and ad platforms (Spotify, Apple Music, DistroKid, YouTube, Podcast Ad Networks) occurs outside the blockchain. Attesting off-chain financial data to trigger automated on-chain payouts introduces potential trust and manipulation risks.

## MVP Trust-Minimized Architecture

### 1. Creator Self-Reporting + 48-Hour Dispute Window (Active MVP)
- Creators submit revenue reports via the dashboard with proof metadata (PDF statement link, dashboard screenshot, invoice hash).
- Submissions enter a **48-Hour Timelock Period** (`PENDING_TIMELOCK`).
- Any token holder can inspect the pending submission in the UI and trigger a dispute flag if figures mismatch public streaming estimates.
- If no dispute is raised within 48 hours, the Oracle Worker automatically signs the attestation and triggers `deposit_revenue` on the Soroban contract.

```
[ Creator Submission ] ──> [ 48h Timelock Queue ] ──> [ Dispute Window (Token Holders) ]
                                                                   │
                                                   ┌───────────────┴──────────────┐
                                                   ▼                              ▼
                                           [ No Dispute ]                   [ Disputed ]
                                                   │                              │
                                                   ▼                              ▼
                                      [ Oracle Signs & Deposits ]        [ Paused / Review ]
```

## Future Multi-Oracle & Direct API Roadmap (Non-MVP Roadmap)

### 2. Multi-Oracle Threshold Consensus
- Require $M$-of-$N$ signatures from independent node operators (e.g. 2-of-3 consensus) before submitting revenue attestations on-chain.

### 3. Direct Streaming API Adapters
- `SpotifyRevenueSource`: Direct OAuth 2.0 connection to Spotify for Artists API to fetch stream counts and multiply by verified average rate per stream ($0.0038/stream).
- `DistroKidRevenueSource`: Automated TSV statement parser for monthly digital music distribution statements across Apple Music, Spotify, Amazon, and YouTube Content ID.
