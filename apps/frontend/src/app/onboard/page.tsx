'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../store/useStore';
import { RoyaltyVault } from '@royalstream/types';

export default function OnboardPage() {
  const router = useRouter();
  const { publicKey, walletConnected, addVault } = useStore();

  const [creatorName, setCreatorName] = useState('');
  const [socialLink, setSocialLink] = useState('');
  const [streamName, setStreamName] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('Electronic');
  const [revenueSourceType, setRevenueSourceType] = useState<'MANUAL' | 'SPOTIFY' | 'DISTROKID' | 'PODCAST_AD'>('MANUAL');
  const [totalShares, setTotalShares] = useState(10000);
  const [projectedApy, setProjectedApy] = useState(18.5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletConnected || !publicKey) {
      alert('Please connect your Stellar wallet first.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate Soroban initialize contract deployment transaction
      const mockContractId = `C${Array.from({ length: 55 }, () => Math.floor(Math.random() * 36).toString(36)).join('').toUpperCase()}`;

      const newVault: RoyaltyVault = {
        id: `vault-${Date.now()}`,
        contractId: mockContractId,
        creatorAddress: publicKey,
        tokenAsset: 'USDC:GA5ZSEJYB37JRC5AVCI584JL7C4AW7W5825N47',
        totalShares: Number(totalShares),
        sharesMinted: 0,
        sharePriceStroops: '10000000', // 1.00 USDC
        periodStart: Math.floor(Date.now() / 1000),
        periodEnd: Math.floor(Date.now() / 1000) + 86400 * 365,
        totalDepositedStroops: '0',
        status: 'ACTIVE',
        streamName,
        description,
        genre,
        projectedAnnualYieldPct: Number(projectedApy),
        revenueSourceType,
        createdAt: new Date().toISOString(),
      };

      addVault(newVault);
      alert(`Success! Royalty Vault created on Soroban. Contract ID: ${mockContractId}`);
      router.push(`/vaults/${newVault.id}`);
    } catch (err: any) {
      alert('Failed to deploy vault: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Tokenize Your Royalty Stream</h1>
        <p className="text-sm text-slate-400 mt-1">
          Create a Soroban Royalty Vault contract to tokenize future streaming & ad earnings into tradable fractional tokens.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-6 border border-slate-800">
        {/* Step 1: Creator Verification */}
        <div className="space-y-4 pb-6 border-b border-slate-800">
          <h2 className="text-lg font-bold text-purple-300 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-400 text-xs flex items-center justify-center border border-purple-500/40">1</span>
            Creator Identity & Verification (KYC-Light)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Creator / Band Name</label>
              <input
                type="text"
                required
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="e.g. Aria Vance"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Social / Streaming Link</label>
              <input
                type="url"
                required
                value={socialLink}
                onChange={(e) => setSocialLink(e.target.value)}
                placeholder="https://open.spotify.com/artist/..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Stream Definition */}
        <div className="space-y-4 pb-6 border-b border-slate-800">
          <h2 className="text-lg font-bold text-purple-300 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-400 text-xs flex items-center justify-center border border-purple-500/40">2</span>
            Royalty Vault Terms
          </h2>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Vault / Stream Title</label>
            <input
              type="text"
              required
              value={streamName}
              onChange={(e) => setStreamName(e.target.value)}
              placeholder="e.g. Synthwave Dreams 2026 Master Royalties"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Stream Description</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the exact percentage and period (e.g., 15% share of master recording royalties for all 2026 releases)."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
              >
                <option value="Electronic">Electronic</option>
                <option value="Podcast">Podcast</option>
                <option value="Pop">Pop</option>
                <option value="Hip Hop">Hip Hop</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total Shares (Units)</label>
              <input
                type="number"
                min={100}
                max={100000}
                value={totalShares}
                onChange={(e) => setTotalShares(parseInt(e.target.value, 10))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Projected Annual Yield (%)</label>
              <input
                type="number"
                step="0.5"
                value={projectedApy}
                onChange={(e) => setProjectedApy(parseFloat(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Oracle Integration */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-purple-300 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-400 text-xs flex items-center justify-center border border-purple-500/40">3</span>
            Revenue Ingestion Source
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {(['MANUAL', 'SPOTIFY', 'DISTROKID', 'PODCAST_AD'] as const).map((source) => (
              <div
                key={source}
                onClick={() => setRevenueSourceType(source)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  revenueSourceType === source
                    ? 'bg-purple-900/40 border-purple-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold uppercase">{source}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {source === 'MANUAL' ? 'Self-reported with 48h dispute timelock' : `Automated ${source} API Attestation`}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-900/40 transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'Deploying Soroban Vault...' : 'Deploy Soroban Royalty Vault'}
        </button>
      </form>
    </div>
  );
}
