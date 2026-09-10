export interface Creator {
  id: string;
  walletAddress: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  socialLink?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface RoyaltyVault {
  id: string;
  contractId: string;
  creatorAddress: string;
  tokenAsset: string;
  totalShares: number;
  sharesMinted: number;
  sharePriceStroops: string;
  periodStart: number;
  periodEnd: number;
  totalDepositedStroops: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  streamName: string;
  description: string;
  genre: string;
  projectedAnnualYieldPct: number;
  revenueSourceType: 'MANUAL' | 'SPOTIFY' | 'DISTROKID' | 'PODCAST_AD';
  createdAt: string;
}

export interface RevenueSubmission {
  id: string;
  vaultId: string;
  creatorId: string;
  period: string;
  amountStroops: string;
  sourceType: string;
  proofUrl?: string;
  status: 'PENDING_TIMELOCK' | 'DISTRIBUTED' | 'DISPUTED';
  disputeReason?: string;
  attestationSignature?: string;
  timelockEndsAt: string;
  createdAt: string;
}

export interface PayoutEvent {
  id: string;
  vaultId: string;
  holderAddress: string;
  amountStroops: string;
  txHash: string;
  timestamp: number;
}

export interface HolderPortfolioItem {
  vaultId: string;
  vault: RoyaltyVault;
  shareBalance: number;
  ownershipPercentage: number;
  unclaimedPayoutStroops: string;
  totalClaimedStroops: string;
}

export interface VaultInfo {
  creator: string;
  oracle: string;
  asset: string;
  totalShares: number;
  sharesMinted: number;
  periodStart: number;
  periodEnd: number;
  totalDeposited: string;
  cumulativePerShare: string;
}

export interface RevenueFetchResult {
  amountStroops: string;
  period: string;
  metadata?: Record<string, any>;
}

export interface RevenueSourceAdapter {
  sourceType: 'MANUAL' | 'SPOTIFY' | 'DISTROKID' | 'PODCAST_AD';
  fetchRevenue(creatorId: string, period: string): Promise<RevenueFetchResult>;
}
