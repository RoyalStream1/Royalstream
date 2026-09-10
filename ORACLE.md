# `@royalstream/oracle-worker`

Background worker service responsible for revenue ingestion, timelock verification, and submitting on-chain attestation transactions to Soroban royalty vaults.

## Architecture
- **Pluggable Adapter Interface**: `RevenueSourceAdapter`
- **Active MVP Adapter**: `ManualSubmissionSource` (creator dashboard reports with 48h dispute window)
- **Extension Stubs**: `SpotifyRevenueSource`, `DistroKidRevenueSource`
- **Scheduler**: `node-cron` job processing pending timelocked submissions
