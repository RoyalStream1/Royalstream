import { RevenueSourceAdapter, RevenueFetchResult } from '@royalstream/types';

/**
 * ManualSubmissionSource (MVP Active Adapter)
 * Wraps manual self-reported revenue submissions from creator dashboards.
 */
export class ManualSubmissionSource implements RevenueSourceAdapter {
  sourceType: 'MANUAL' = 'MANUAL';
  private manualDataStore: Map<string, string> = new Map();

  constructor(initialRecords?: Record<string, string>) {
    if (initialRecords) {
      Object.entries(initialRecords).forEach(([key, val]) => this.manualDataStore.set(key, val));
    }
  }

  public registerManualReport(creatorId: string, period: string, amountStroops: string) {
    this.manualDataStore.set(`${creatorId}:${period}`, amountStroops);
  }

  async fetchRevenue(creatorId: string, period: string): Promise<RevenueFetchResult> {
    const key = `${creatorId}:${period}`;
    const amountStroops = this.manualDataStore.get(key) || '1000000000'; // Default 1,000 USDC mock
    return {
      amountStroops,
      period,
      metadata: {
        submittedBy: creatorId,
        verifiedVia: 'Creator Dashboard Manual Attestation',
      },
    };
  }
}

/**
 * SpotifyRevenueSource (Future Extension Stub)
 * Will integrate with Spotify for Artists API via OAuth 2.0 & Partner Analytics endpoints.
 */
export class SpotifyRevenueSource implements RevenueSourceAdapter {
  sourceType: 'SPOTIFY' = 'SPOTIFY';

  async fetchRevenue(creatorId: string, period: string): Promise<RevenueFetchResult> {
    // STUB IMPLEMENTATION
    // Future work: Query https://api.spotify.com/v1/artists/{id}/analytics
    // Calculate total streams * average payout per stream (~$0.0038)
    console.log(`[SpotifyAdapter Stub] Querying Spotify API for creator ${creatorId}, period ${period}...`);
    return {
      amountStroops: '2500000000', // 2,500 USDC
      period,
      metadata: {
        totalStreams: 657890,
        avgPayoutPerStreamUSD: 0.0038,
        spotifyArtistId: 'sp_artist_492019',
      },
    };
  }
}

/**
 * DistroKidRevenueSource (Future Extension Stub)
 * Will parse automated TSV/CSV monthly reporting exports from DistroKid royalty accounts.
 */
export class DistroKidRevenueSource implements RevenueSourceAdapter {
  sourceType: 'DISTROKID' = 'DISTROKID';

  async fetchRevenue(creatorId: string, period: string): Promise<RevenueFetchResult> {
    // STUB IMPLEMENTATION
    // Future work: Fetch bank export statement via webhook or DistroKid OAuth integration
    console.log(`[DistroKidAdapter Stub] Parsing DistroKid statement for creator ${creatorId}, period ${period}...`);
    return {
      amountStroops: '4200000000', // 4,200 USDC
      period,
      metadata: {
        statementId: 'dk_stmt_2026_08',
        storeBreakdown: {
          appleMusic: 1800000000,
          spotify: 2000000000,
          amazon: 400000000,
        },
      },
    };
  }
}
