import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { z } from 'zod';
import { Creator, RoyaltyVault, RevenueSubmission } from '@royalstream/types';

const app: Express = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-Memory Dev Store Fallback
const creatorsStore: Map<string, Creator> = new Map([
  [
    'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFXYCZW6AIKV7PG34AGTY',
    {
      id: 'creator-1',
      walletAddress: 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFXYCZW6AIKV7PG34AGTY',
      name: 'Aria Vance',
      bio: 'Electronic & Synthwave producer from Berlin with 1.2M monthly streams.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      socialLink: 'https://twitter.com/ariavance_music',
      isVerified: true,
      createdAt: new Date().toISOString(),
    },
  ],
]);

const vaultsStore: Map<string, RoyaltyVault> = new Map([
  [
    'vault-1',
    {
      id: 'vault-1',
      contractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMWAXA7K4PXZPD',
      creatorAddress: 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFXYCZW6AIKV7PG34AGTY',
      tokenAsset: 'USDC:GA5ZSEJYB37JRC5AVCI584JL7C4AW7W5825N47',
      totalShares: 10000,
      sharesMinted: 7500,
      sharePriceStroops: '10000000', // 1.00 USDC
      periodStart: Math.floor(Date.now() / 1000) - 86400 * 30,
      periodEnd: Math.floor(Date.now() / 1000) + 86400 * 335,
      totalDepositedStroops: '15000000000',
      status: 'ACTIVE',
      streamName: 'Synthwave Dreams 2026 Streaming Royalties',
      description: '15% share of Spotify & Apple Music master recording royalties for Aria Vance 2026 releases.',
      genre: 'Electronic',
      projectedAnnualYieldPct: 18.5,
      revenueSourceType: 'SPOTIFY',
      createdAt: new Date().toISOString(),
    },
  ],
  [
    'vault-2',
    {
      id: 'vault-2',
      contractId: 'CBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFXYCZW6AIKV7PG34AGTY',
      creatorAddress: 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCC5E7',
      tokenAsset: 'XLM:NATIVE',
      totalShares: 20000,
      sharesMinted: 12000,
      sharePriceStroops: '50000000', // 5.00 XLM
      periodStart: Math.floor(Date.now() / 1000) - 86400 * 15,
      periodEnd: Math.floor(Date.now() / 1000) + 86400 * 350,
      totalDepositedStroops: '25000000000',
      status: 'ACTIVE',
      streamName: 'Tech Unfiltered Podcast Ad Pool',
      description: '10% share of quarterly podcast ad network distributions & sponsor revenue.',
      genre: 'Podcast',
      projectedAnnualYieldPct: 22.0,
      revenueSourceType: 'MANUAL',
      createdAt: new Date().toISOString(),
    },
  ],
]);

const submissionsStore: Map<string, RevenueSubmission> = new Map();

// --- Validation Schemas ---
const CreateCreatorSchema = z.object({
  walletAddress: z.string().min(10),
  name: z.string().min(2),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  socialLink: z.string().url().optional(),
});

const CreateVaultSchema = z.object({
  contractId: z.string().min(10),
  creatorAddress: z.string().min(10),
  tokenAsset: z.string().min(3),
  totalShares: z.number().positive(),
  sharePriceStroops: z.string(),
  periodStart: z.number(),
  periodEnd: z.number(),
  streamName: z.string().min(3),
  description: z.string().min(5),
  genre: z.string(),
  projectedAnnualYieldPct: z.number(),
  revenueSourceType: z.enum(['MANUAL', 'SPOTIFY', 'DISTROKID', 'PODCAST_AD']),
});

const CreateSubmissionSchema = z.object({
  vaultId: z.string(),
  creatorId: z.string(),
  period: z.string(),
  amountStroops: z.string(),
  sourceType: z.string(),
  proofUrl: z.string().url().optional(),
});

// --- Routes ---

app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'RoyalStream Backend API',
    status: 'OK',
    version: '0.1.0',
    endpoints: {
      health: '/api/health',
      creators: '/api/creators',
      vaults: '/api/vaults',
    },
  });
});

app.get(['/health', '/api/health'], (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'royalstream-backend-api', timestamp: new Date().toISOString() });
});

// Creators
app.get(['/creators', '/api/creators'], (req: Request, res: Response) => {
  res.json(Array.from(creatorsStore.values()));
});

app.post(['/creators', '/api/creators'], (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = CreateCreatorSchema.parse(req.body);
    const existing = creatorsStore.get(data.walletAddress);
    const creator: Creator = {
      id: existing ? existing.id : `creator-${Date.now()}`,
      walletAddress: data.walletAddress,
      name: data.name,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      socialLink: data.socialLink,
      isVerified: true, // Auto KYC-light verification mock
      createdAt: existing ? existing.createdAt : new Date().toISOString(),
    };
    creatorsStore.set(data.walletAddress, creator);
    res.status(201).json(creator);
  } catch (err) {
    next(err);
  }
});

// Vaults
app.get(['/vaults', '/api/vaults'], (req: Request, res: Response) => {
  const genre = req.query.genre as string;
  let vaults = Array.from(vaultsStore.values());
  if (genre) {
    vaults = vaults.filter((v) => v.genre.toLowerCase() === genre.toLowerCase());
  }
  res.json(vaults);
});

app.get(['/vaults/:id', '/api/vaults/:id'], (req: Request, res: Response) => {
  const vault = vaultsStore.get(req.params.id);
  if (!vault) {
    return res.status(404).json({ error: 'Vault not found' });
  }
  res.json(vault);
});

app.post(['/vaults', '/api/vaults'], (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = CreateVaultSchema.parse(req.body);
    const newVault: RoyaltyVault = {
      id: `vault-${Date.now()}`,
      ...data,
      sharesMinted: 0,
      totalDepositedStroops: '0',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    vaultsStore.set(newVault.id, newVault);
    res.status(201).json(newVault);
  } catch (err) {
    next(err);
  }
});

// Revenue Submissions
app.post(['/submissions', '/api/submissions'], (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = CreateSubmissionSchema.parse(req.body);
    const delayMs = (parseInt(process.env.ORACLE_SUBMISSION_DELAY_HOURS || '48', 10)) * 3600 * 1000;
    const submission: RevenueSubmission = {
      id: `sub-${Date.now()}`,
      ...data,
      status: 'PENDING_TIMELOCK',
      timelockEndsAt: new Date(Date.now() + delayMs).toISOString(),
      createdAt: new Date().toISOString(),
    };
    submissionsStore.set(submission.id, submission);
    res.status(201).json(submission);
  } catch (err) {
    next(err);
  }
});

app.post(['/submissions/:id/dispute', '/api/submissions/:id/dispute'], (req: Request, res: Response) => {
  const submission = submissionsStore.get(req.params.id);
  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' });
  }
  submission.status = 'DISPUTED';
  submission.disputeReason = req.body.reason || 'Flagged by token holder dispute';
  res.json(submission);
});

// --- Centralized Error Handler ---
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error('[API Error]:', err);
  if (err instanceof z.ZodError) {
    return res.status(400).json({ error: 'Validation failed', details: err.errors });
  }
  res.status(500).json({ error: err.message || 'Internal server error' });
});

if (process.env.NODE_ENV !== 'production' || require.main === module) {
  app.listen(PORT, () => {
    console.log(`[RoyalStream API] Express server running on port ${PORT}`);
  });
}

export default app;
