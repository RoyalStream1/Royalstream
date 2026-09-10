'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { RoyaltyVaultClient } from '@royalstream/stellar-sdk';
import { RoyaltyVault } from '@royalstream/types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const mockVaultData: Record<string, RoyaltyVault> = {
  'vault-1': {
    id: 'vault-1',
    contractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMWAXA7K4PXZPD',
    creatorAddress: 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFXYCZW6AIKV7PG34AGTY',
    tokenAsset: 'USDC:GA5ZSEJYB37JRC5AVCI584JL7C4AW7W5825N47',
    totalShares: 10000,
    sharesMinted: 7500,
    sharePriceStroops: '10000000', // 1 USDC
    periodStart: Math.floor(Date.now() / 1000) - 86400 * 30,
    periodEnd: Math.floor(Date.now() / 1000) + 86400 * 335,
    totalDepositedStroops: '15000000000', // 1,500 USDC
    status: 'ACTIVE',
    streamName: 'Synthwave Dreams 2026 Streaming Royalties',
    description: '15% share of Spotify & Apple Music master recording royalties for Aria Vance 2026 releases.',
    genre: 'Electronic',
    projectedAnnualYieldPct: 18.5,
    revenueSourceType: 'SPOTIFY',
    createdAt: new Date().toISOString(),
  },
  'vault-2': {
    id: 'vault-2',
    contractId: 'CBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFXYCZW6AIKV7PG34AGTY',
    creatorAddress: 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCC5E7',
    tokenAsset: 'XLM:NATIVE',
    totalShares: 20000,
    sharesMinted: 12000,
    sharePriceStroops: '50000000', // 5 XLM
    periodStart: Math.floor(Date.now() / 1000) - 86400 * 15,
    periodEnd: Math.floor(Date.now() / 1000) + 86400 * 350,
    totalDepositedStroops: '25000000000', // 2,500 XLM
    status: 'ACTIVE',
    streamName: 'Tech Unfiltered Podcast Ad Pool',
    description: '10% share of quarterly podcast ad network distributions & sponsor revenue.',
    genre: 'Podcast',
    projectedAnnualYieldPct: 22.0,
    revenueSourceType: 'MANUAL',
    createdAt: new Date().toISOString(),
  },
};

const revenueHistoryData = [
  { month: 'Jan', revenue: 450, payoutPerShare: 0.045 },
  { month: 'Feb', revenue: 620, payoutPerShare: 0.062 },
  { month: 'Mar', revenue: 890, payoutPerShare: 0.089 },
  { month: 'Apr', revenue: 1100, payoutPerShare: 0.110 },
  { month: 'May', revenue: 1450, payoutPerShare: 0.145 },
  { month: 'Jun', revenue: 1980, payoutPerShare: 0.198 },
];

export default function VaultDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [vault, setVault] = useState<RoyaltyVault | null>(null);
  const [buyAmount, setBuyAmount] = useState<number>(100);
  const [isBuying, setIsBuying] = useState<boolean>(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>('');

  useEffect(() => {
    const v = mockVaultData[id] || mockVaultData['vault-1'];
    setVault(v);
  }, [id]);

  if (!vault) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  const handleBuyShares = async () => {
    setIsBuying(true);
    try {
      const client = new RoyaltyVaultClient();
      const res = await client.mintShares(
        vault.contractId,
        vault.creatorAddress,
        'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFXYCZW6AIKV7PG34AGTY',
        buyAmount
      );
      setTxHash(res.txHash);
      setPurchaseSuccess(true);
      setVault((prev) => prev ? { ...prev, sharesMinted: prev.sharesMinted + buyAmount } : null);
    } catch (err) {
      console.error('Buy shares error:', err);
    } finally {
      setIsBuying(false);
    }
  };

  const percentSold = Math.round((vault.sharesMinted / vault.totalShares) * 100);
  const unitPrice = parseFloat(vault.sharePriceStroops) / 10000000;
  const totalPrice = (buyAmount * unitPrice).toFixed(2);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Back Link */}
        <div>
          <Link href="/" className="inline-flex items-center text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors">
            ← Back to Marketplace
          </Link>
        </div>

        {/* Header Section */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {vault.genre}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {vault.revenueSourceType} Oracle Verified
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{vault.streamName}</h1>
              <p className="text-sm text-slate-400 mt-2 max-w-2xl">{vault.description}</p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl min-w-[280px]">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Projected Annual APY</div>
              <div className="text-3xl font-extrabold text-emerald-400 mt-1">+{vault.projectedAnnualYieldPct}%</div>
              <div className="text-xs text-slate-500 mt-2">Soroban Contract ID:</div>
              <div className="text-xs font-mono text-purple-400 truncate">{vault.contractId.slice(0, 14)}...{vault.contractId.slice(-6)}</div>
            </div>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Analytics Chart & Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Revenue Analytics Chart */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Revenue Payout History</h2>
                  <p className="text-xs text-slate-400">Monthly royalty deposits & pro-rata distributions</p>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Near-Instant Settlement
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueHistoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `$${val}`} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#revenueColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Holder Statistics & Accounting */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4">Vault Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="text-xs text-slate-400">Total Shares</div>
                  <div className="text-lg font-bold text-white mt-1">{vault.totalShares.toLocaleString()}</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="text-xs text-slate-400">Minted Shares</div>
                  <div className="text-lg font-bold text-purple-400 mt-1">{vault.sharesMinted.toLocaleString()}</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="text-xs text-slate-400">Share Price</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">{unitPrice} {vault.tokenAsset.split(':')[0]}</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="text-xs text-slate-400">Total Distributed</div>
                  <div className="text-lg font-bold text-white mt-1">${(parseFloat(vault.totalDepositedStroops)/10000000).toLocaleString()}</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Buy Shares Action Card */}
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-6">
              <h2 className="text-xl font-bold text-white">Buy Royalty Tokens</h2>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                  <span>Funding Progress</span>
                  <span>{percentSold}% Sold</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500" style={{ width: `${percentSold}%` }}></div>
                </div>
              </div>

              {/* Quantity selector */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Select Number of Shares</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setBuyAmount((prev) => Math.max(10, prev - 50))} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-lg text-white">-</button>
                  <input
                    type="number"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-center font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                  <button onClick={() => setBuyAmount((prev) => prev + 50)} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-lg text-white">+</button>
                </div>
              </div>

              {/* Price summary */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Price per Share:</span>
                  <span className="text-slate-200">{unitPrice} {vault.tokenAsset.split(':')[0]}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Soroban Network Fee:</span>
                  <span className="text-slate-200">0.00001 XLM</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-sm text-white">
                  <span>Total Amount:</span>
                  <span className="text-emerald-400">{totalPrice} {vault.tokenAsset.split(':')[0]}</span>
                </div>
              </div>

              {purchaseSuccess ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-2">
                  <div className="text-emerald-400 font-bold text-sm">🎉 Shares Minted Successfully!</div>
                  <div className="text-xs text-slate-400 font-mono truncate">Tx Hash: {txHash}</div>
                  <Link href="/fan/dashboard" className="block text-xs font-semibold text-purple-400 hover:underline pt-1">
                    Go to Portfolio →
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleBuyShares}
                  disabled={isBuying}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-purple-900/40 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {isBuying ? 'Signing Soroban Transaction...' : `Buy ${buyAmount} Shares (${totalPrice} ${vault.tokenAsset.split(':')[0]})`}
                </button>
              )}

              <p className="text-[11px] text-center text-slate-500">
                Purchases execute directly on Stellar testnet via Soroban vault contract.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
