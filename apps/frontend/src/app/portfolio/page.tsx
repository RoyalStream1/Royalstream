'use client';

import React from 'react';
import { useStore } from '../../store/useStore';
import { StatBadge } from '@royalstream/ui';
import Link from 'next/link';

export default function PortfolioPage() {
  const { portfolio, claimPayout, walletConnected, publicKey } = useStore();

  const totalUnclaimedStroops = portfolio.reduce(
    (acc, item) => acc + parseFloat(item.unclaimedPayoutStroops),
    0
  );

  const totalClaimedStroops = portfolio.reduce(
    (acc, item) => acc + parseFloat(item.totalClaimedStroops),
    0
  );

  const formatUsdc = (stroops: number) => (stroops / 1e7).toFixed(2);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Investor Portfolio</h1>
        <p className="text-sm text-slate-400 mt-1">
          Your fractional royalty token holdings across Soroban vaults on Stellar.
        </p>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatBadge
          label="Unclaimed Royalty Payouts"
          value={`$${formatUsdc(totalUnclaimedStroops)} USDC`}
          subtext="Available for 1-click Soroban pull claim"
          variant="emerald"
        />
        <StatBadge
          label="Total Historical Payouts Claimed"
          value={`$${formatUsdc(totalClaimedStroops)} USDC`}
          subtext="Directly settled to your Stellar wallet"
          variant="purple"
        />
        <StatBadge
          label="Active Token Positions"
          value={portfolio.length.toString()}
          subtext="Fractional royalty vaults"
          variant="blue"
        />
      </div>

      {/* Holdings Table */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Royalty Share Positions</h2>
          {totalUnclaimedStroops > 0 && (
            <button
              onClick={() => portfolio.forEach((item) => claimPayout(item.vaultId))}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all hover:scale-105"
            >
              ⚡ Claim All (${formatUsdc(totalUnclaimedStroops)} USDC)
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Vault Name</th>
                <th className="p-4">Shares Held</th>
                <th className="p-4">Ownership %</th>
                <th className="p-4">Total Claimed</th>
                <th className="p-4">Unclaimed Balance</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {portfolio.map((item) => {
                const unclaimed = parseFloat(item.unclaimedPayoutStroops);
                return (
                  <tr key={item.vaultId} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-bold text-white">
                      <Link href={`/vaults/${item.vaultId}`} className="hover:text-purple-400 transition-colors">
                        {item.vault.streamName}
                      </Link>
                    </td>
                    <td className="p-4 font-mono font-medium">{item.shareBalance.toLocaleString()} shares</td>
                    <td className="p-4 font-mono text-purple-300">{item.ownershipPercentage}%</td>
                    <td className="p-4 font-mono text-slate-400">${formatUsdc(parseFloat(item.totalClaimedStroops))} USDC</td>
                    <td className="p-4 font-mono text-emerald-400 font-bold text-sm">
                      ${formatUsdc(unclaimed)} USDC
                    </td>
                    <td className="p-4 text-right">
                      <button
                        disabled={unclaimed === 0}
                        onClick={() => claimPayout(item.vaultId)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          unclaimed > 0
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {unclaimed > 0 ? 'Claim Payout' : 'Claimed'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
