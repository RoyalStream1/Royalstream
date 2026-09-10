'use client';

import './globals.css';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletButton } from '@royalstream/ui';
import { useStore } from '../store/useStore';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { walletConnected, publicKey, connectWallet, disconnectWallet } = useStore();

  const navLinks = [
    { href: '/', label: 'Marketplace' },
    { href: '/portfolio', label: 'My Portfolio' },
    { href: '/creator-dashboard', label: 'Creator Hub' },
    { href: '/onboard', label: 'Tokenize Stream' },
  ];

  return (
    <html lang="en">
      <head>
        <title>RoyalStream | Decentralized Creator Royalty Vaults on Stellar</title>
        <meta name="description" content="Tokenize future streaming and ad royalties into tradable fractional assets on Soroban smart contracts." />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased">
        <header className="sticky top-0 z-50 glass-nav border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-black text-xl shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
                👑
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent">
                  RoyalStream
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-purple-400 font-semibold -mt-1">
                  Stellar Soroban
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/60 backdrop-blur-md">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-4">
              <WalletButton
                isConnected={walletConnected}
                publicKey={publicKey}
                onConnect={() => connectWallet('freighter')}
                onDisconnect={disconnectWallet}
              />
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">{children}</main>

        <footer className="border-t border-slate-800/80 bg-slate-950 py-8 mt-12 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>© 2026 RoyalStream Protocol. Powered by Soroban Smart Contracts on Stellar.</div>
            <div className="flex gap-6 font-medium">
              <Link href="/docs/ARCHITECTURE.md" className="hover:text-purple-400 transition-colors">
                Architecture
              </Link>
              <Link href="/docs/ORACLE_DESIGN.md" className="hover:text-purple-400 transition-colors">
                Oracle Design
              </Link>
              <Link href="/docs/CONTRACTS.md" className="hover:text-purple-400 transition-colors">
                Contract Specs
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
