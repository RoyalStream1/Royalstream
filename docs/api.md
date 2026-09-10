# REST API Documentation 🔌

The `backend-api` app provides RESTful HTTP endpoints for off-chain metadata, creator profiles, vault listings, and dispute submissions.

- **Base URL**: `http://localhost:3001`
- **Implementation**: Node.js, Express, TypeScript, Zod, Prisma ORM
- **Source File**: [`apps/backend-api/src/index.ts`](file:///c:/Users/JOTEL/OneDrive/Documentos/Royalstream/apps/backend-api/src/index.ts)

---

## Endpoints

### 1. Health Check
`GET /health`

**Response (`200 OK`)**:
```json
{
  "status": "OK",
  "timestamp": "2026-09-10T15:00:00.000Z"
}
```

---

### 2. List Creator Profiles
`GET /api/creators`

**Response (`200 OK`)**:
```json
[
  {
    "id": "creator-1",
    "address": "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFXYCZW6AIKV7PG34AGTY",
    "name": "Aria Vance",
    "bio": "Electronic music producer & synthwave artist."
  }
]
```

---

### 3. List Active Royalty Vaults
`GET /api/vaults`

**Response (`200 OK`)**:
```json
[
  {
    "id": "vault-1",
    "contractId": "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMWAXA7K4PXZPD",
    "creatorAddress": "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFXYCZW6AIKV7PG34AGTY",
    "totalShares": 10000,
    "sharesMinted": 7500,
    "status": "ACTIVE"
  }
]
```

---

### 4. Create New Royalty Vault Metadata
`POST /api/vaults`

**Request Body**:
```json
{
  "contractId": "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMWAXA7K4PXZPD",
  "creatorAddress": "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFXYCZW6AIKV7PG34AGTY",
  "tokenAsset": "USDC:GA5ZSEJYB37JRC5AVCI584JL7C4AW7W5825N47",
  "totalShares": 10000,
  "sharePriceStroops": "10000000",
  "streamName": "Synthwave Royalty Stream 2026",
  "genre": "Electronic"
}
```

---

### 5. Submit Revenue Report
`POST /api/submissions`

**Request Body**:
```json
{
  "vaultId": "vault-1",
  "grossAmountStroops": "10000000000",
  "statementHash": "0x4a8b...9c0d",
  "sourceType": "MANUAL"
}
```

---

### 6. Query Pending Submissions
`GET /api/submissions/pending`

---

### 7. File Submission Dispute
`POST /api/disputes`

**Request Body**:
```json
{
  "submissionId": "sub-1",
  "disputerAddress": "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCC5E7",
  "reason": "Royalty statement hash mismatch on distributor invoice."
}
```
