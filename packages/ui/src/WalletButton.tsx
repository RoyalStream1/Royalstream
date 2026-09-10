import React from 'react';

export interface WalletButtonProps {
  isConnected: boolean;
  publicKey: string | null;
  onConnect: () => void;
  onDisconnect?: () => void;
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  isConnected,
  publicKey,
  onConnect,
  onDisconnect,
}) => {
  if (isConnected && publicKey) {
    return (
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-200">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>{publicKey.slice(0, 4)}...{publicKey.slice(-4)}</span>
        {onDisconnect && (
          <button
            onClick={onDisconnect}
            className="ml-2 text-slate-400 hover:text-red-400 transition-colors text-sm"
            title="Disconnect Wallet"
          >
            ×
          </button>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-purple-900/30 transition-all hover:scale-105 active:scale-95"
    >
      Connect Wallet
    </button>
  );
};
