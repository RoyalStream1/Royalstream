# `@royalstream/backend-api`

Express.js REST API providing off-chain metadata, creator profile verification, vault metadata indexing, and revenue submission timelock management.

## Endpoints
- `GET /api/health` - Service health status
- `GET /api/creators` - List creators
- `POST /api/creators` - Creator onboarding & verification
- `GET /api/vaults` - Query vaults (supports `?genre=` filter)
- `GET /api/vaults/:id` - Detailed vault info
- `POST /api/vaults` - Register deployed vault
- `POST /api/submissions` - Creator self-reports revenue for timelocked attestation
- `POST /api/submissions/:id/dispute` - Flag submission dispute
