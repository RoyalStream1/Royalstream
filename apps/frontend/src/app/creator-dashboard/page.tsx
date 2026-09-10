'use client';

import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { StatBadge } from '@royalstream/ui';

export default function CreatorDashboardPage() {
  const { vaults, publicKey, submitRevenue, submissions } = useStore();

  const [selectedVaultId, setSelectedVaultId] = useState(vaults[0]?.id || '');
  const [period, setPeriod] = useState('2026-Q1');
  const [amountUsdc, setAmountUsdc] = useState('1500');
  const [proofUrl, setProofUrl] = useState('https://spotify.com/analytics/report/2026-q1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const creatorVaults = vaults.filter((v) => v.creatorAddress === publicKey || true); // Dev view show active

  const handleRevenueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const delayMs = 48 * 3600 * 1000;
      const stroops = (parseFloat(amountUsdc) * 1e7).toString();

      submitRevenue({
        id: `sub-${Date.now()}`,
        vaultId: selectedVaultId,
        creatorId: publicKey || 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFXYCZW6AIKV7PG34AGTY',
        period,
        amountStroops: stroops,
        sourceType: 'MANUAL',
        proofUrl,
        status: 'PENDING_TIMELOCK',
        timelockEndsAt: new Date(Date.now() + delayMs).toISOString(),
        createdAt: new Date().toISOString(),
      });

      alert('Revenue submitted! 48-hour dispute timelock initiated before automatic vault distribution.');
    } catch (err: any) {
      alert('Failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Creator Profile Header */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-2xl font-bold">
            🎤
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Aria Vance</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Verified Creator
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{publicKey}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <a
            href="/onboard"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md"
          >
            + Create New Vault
          </a>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatBadge label="Total Revenue Deposited" value="$15,000 USDC" subtext="Distributed to 1,250 token holders" variant="purple" />
        <StatBadge label="Total Vaults Managed" value={creatorVaults.length.toString()} subtext="Active Soroban smart contracts" variant="emerald" />
        <StatBadge label="Pending Timelock Revenue" value="$1,500 USDC" subtext="48h dispute window" variant="amber" />
      </div>

      {/* Revenue Submission Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Submit Revenue Report</h2>
            <p className="text-xs text-slate-400 mt-1">
              Deposit new off-chain royalty revenue for pro-rata vault distribution.
            </p>
          </div>

          <form onSubmit={handleRevenueSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Vault</label>
              <select
                value={selectedVaultId}
                onChange={(e) => setSelectedVaultId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
              >
                {creatorVaults.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.streamName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Period</label>
              <input
                type="text"
                required
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="e.g. 2026-Q1 or Aug 2026"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Revenue Amount (USDC)</label>
              <input
                type="number"
                required
                min={10}
                value={amountUsdc}
                onChange={(e) => setAmountUsdc(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Audit / Statement Link</label>
              <input
                type="url"
                required
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-900/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit & Start 48h Timelock'}
            </button>
          </form>
        </div>

        {/* Submissions Log */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white">Revenue Submissions & Timelock Status</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Period</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Source</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Timelock Expiry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500">
                      No pending submissions. Submit a revenue report to test the 48h timelock.
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-semibold text-white">{sub.period}</td>
                      <td className="p-3 font-mono text-emerald-400">${(parseFloat(sub.amountStroops) / 1e7).toFixed(2)} USDC</td>
                      <td className="p-3">{sub.sourceType}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-400">{new Date(sub.timelockEndsAt).toLocaleTimeString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
