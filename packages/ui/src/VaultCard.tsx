import React from 'react';
import { RoyaltyVault } from '@royalstream/types';

export interface VaultCardProps {
  vault: RoyaltyVault;
  onSelect?: (vault: RoyaltyVault) => void;
}

export const VaultCard: React.FC<VaultCardProps> = ({ vault, onSelect }) => {
  const percentSold = Math.round((vault.sharesMinted / vault.totalShares) * 100);

  return (
    <div
      onClick={() => onSelect?.(vault)}
      className="group relative bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer overflow-hidden backdrop-blur-xl"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-2">
            {vault.genre}
          </span>
          <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
            {vault.streamName}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">By {vault.creatorAddress.slice(0, 6)}...{vault.creatorAddress.slice(-4)}</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Est. APY</div>
          <div className="text-lg font-extrabold text-emerald-400">+{vault.projectedAnnualYieldPct}%</div>
        </div>
      </div>

      <p className="text-sm text-slate-300 line-clamp-2 mb-6 font-normal">
        {vault.description}
      </p>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium text-slate-400">
          <span>Shares Distributed</span>
          <span>{percentSold}% ({vault.sharesMinted.toLocaleString()} / {vault.totalShares.toLocaleString()})</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentSold}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/80 flex justify-between items-center text-xs">
        <div className="text-slate-400">
          Source: <span className="text-slate-200 font-semibold">{vault.revenueSourceType}</span>
        </div>
        <button className="px-4 py-2 rounded-lg bg-purple-600 group-hover:bg-purple-500 text-white font-medium text-xs transition-all shadow-md">
          View Vault
        </button>
      </div>
    </div>
  );
};
