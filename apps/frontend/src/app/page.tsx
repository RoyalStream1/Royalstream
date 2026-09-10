'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VaultCard, StatBadge } from '@royalstream/ui';
import { useStore } from '../store/useStore';

export default function MarketplacePage() {
  const router = useRouter();
  const { vaults } = useStore();
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  const genres = ['All', 'Electronic', 'Podcast', 'Pop', 'Hip Hop'];

  const filteredVaults = selectedGenre === 'All'
    ? vaults
    : vaults.filter((v) => v.genre.toLowerCase() === selectedGenre.toLowerCase());

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/60 via-slate-900 to-indigo-950/40 border border-purple-800/30 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
            Decentralized Royalty Tokenization on Stellar
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Invest in Creator Royalties.{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300 bg-clip-text text-transparent">
              Earn Instant Payouts.
            </span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed font-normal">
            Independent musicians, streamers, and podcasters tokenize fractional percentages of future streaming & ad revenue. Hold royalty tokens on Soroban and receive automatic pro-rata payouts.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => router.push('/onboard')}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-900/40 transition-all hover:scale-105"
            >
              Launch a Vault (Creators)
            </button>
            <a
              href="#vaults"
              className="px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm transition-all"
            >
              Explore Vaults
            </a>
          </div>
        </div>
      </section>

      {/* Protocol Metrics Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBadge label="Total Revenue Distributed" value="$40,000 USDC" subtext="Near-instant Soroban settlement" variant="purple" />
        <StatBadge label="Active Royalty Vaults" value={vaults.length.toString()} subtext="Verified creator streams" variant="emerald" />
        <StatBadge label="Avg Projected APY" value="20.25%" subtext="Pro-rata holder yield" variant="amber" />
        <StatBadge label="Stellar Network" value="Soroban Testnet" subtext="Sub-second finality" variant="blue" />
      </section>

      {/* Vault Marketplace */}
      <section id="vaults" className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Active Royalty Vaults</h2>
            <p className="text-xs text-slate-400 mt-1">Browse fractionalized revenue streams available for investment</p>
          </div>

          <div className="flex flex-wrap gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedGenre === genre
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVaults.map((vault) => (
            <VaultCard
              key={vault.id}
              vault={vault}
              onSelect={(v) => router.push(`/vaults/${v.id}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
