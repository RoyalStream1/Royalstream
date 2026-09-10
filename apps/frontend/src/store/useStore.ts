import { create } from 'zustand';
import { RoyaltyVault, HolderPortfolioItem, RevenueSubmission } from '@royalstream/types';
import { connectFreighter, connectLobstr } from '@royalstream/stellar-sdk';

interface AppState {
  walletConnected: boolean;
  publicKey: string | null;
  walletType: 'freighter' | 'lobstr' | null;
  vaults: RoyaltyVault[];
  portfolio: HolderPortfolioItem[];
  submissions: RevenueSubmission[];

  connectWallet: (type?: 'freighter' | 'lobstr') => Promise<void>;
  disconnectWallet: () => void;
  claimPayout: (vaultId: string) => Promise<void>;
  addVault: (vault: RoyaltyVault) => void;
  submitRevenue: (submission: RevenueSubmission) => void;
}

export const useStore = create<AppState>((set, get) => ({
  walletConnected: true,
  publicKey: 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFXYCZW6AIKV7PG34AGTY',
  walletType: 'freighter',

  vaults: [
    {
      id: 'vault-1',
      contractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMWAXA7K4PXZPD',
      creatorAddress: 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFXYCZW6AIKV7PG34AGTY',
      tokenAsset: 'USDC:GA5ZSEJYB37JRC5AVCI584JL7C4AW7W5825N47',
      totalShares: 10000,
      sharesMinted: 7500,
      sharePriceStroops: '10000000',
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
    {
      id: 'vault-2',
      contractId: 'CBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFXYCZW6AIKV7PG34AGTY',
      creatorAddress: 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCC5E7',
      tokenAsset: 'XLM:NATIVE',
      totalShares: 20000,
      sharesMinted: 12000,
      sharePriceStroops: '50000000',
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

  portfolio: [
    {
      vaultId: 'vault-1',
      vault: {
        id: 'vault-1',
        contractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMWAXA7K4PXZPD',
        creatorAddress: 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFXYCZW6AIKV7PG34AGTY',
        tokenAsset: 'USDC:GA5ZSEJYB37JRC5AVCI584JL7C4AW7W5825N47',
        totalShares: 10000,
        sharesMinted: 7500,
        sharePriceStroops: '10000000',
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
      shareBalance: 1500,
      ownershipPercentage: 15,
      unclaimedPayoutStroops: '450000000',
      totalClaimedStroops: '1200000000',
    },
  ],

  submissions: [],

  connectWallet: async (type = 'freighter') => {
    try {
      const res = type === 'freighter' ? await connectFreighter() : await connectLobstr();
      set({ walletConnected: true, publicKey: res.publicKey, walletType: type });
    } catch (err) {
      console.error('Wallet connection failed:', err);
    }
  },

  disconnectWallet: () => {
    set({ walletConnected: false, publicKey: null, walletType: null });
  },

  claimPayout: async (vaultId: string) => {
    const currentPortfolio = get().portfolio;
    const updated = currentPortfolio.map((item) => {
      if (item.vaultId === vaultId) {
        const unclaimed = parseFloat(item.unclaimedPayoutStroops);
        const claimed = parseFloat(item.totalClaimedStroops);
        return {
          ...item,
          unclaimedPayoutStroops: '0',
          totalClaimedStroops: (claimed + unclaimed).toString(),
        };
      }
      return item;
    });
    set({ portfolio: updated });
  },

  addVault: (vault: RoyaltyVault) => {
    set((state) => ({ vaults: [vault, ...state.vaults] }));
  },

  submitRevenue: (submission: RevenueSubmission) => {
    set((state) => ({ submissions: [submission, ...state.submissions] }));
  },
}));
