"use client";

import React from "react";
import Link from "next/link";
import { Flame, Shield, Globe, Github, Twitter, Layers } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-border/80 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <Flame className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white">AVAX Market</span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              The high-performance, decentralized NFT marketplace powered by the sub-second finality of Avalanche C-Chain.
            </p>
            <div className="flex items-center gap-3 text-gray-400">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-primary transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-primary transition">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://avax.network" target="_blank" rel="noreferrer" className="hover:text-primary transition">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link href="/explore" className="hover:text-white transition">All NFTs</Link></li>
              <li><Link href="/explore?category=Digital+Art" className="hover:text-white transition">Digital Art</Link></li>
              <li><Link href="/explore?category=Gaming" className="hover:text-white transition">Gaming Assets</Link></li>
              <li><Link href="/explore?category=Photography" className="hover:text-white transition">Photography</Link></li>
              <li><Link href="/create" className="hover:text-white transition">Mint NFT</Link></li>
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-4">Avalanche Network</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><a href="https://subnets.avax.network/c-chain" target="_blank" rel="noreferrer" className="hover:text-white transition">C-Chain Explorer</a></li>
              <li><a href="https://core.app/tools/testnet-faucet/?subnet=c&token=c" target="_blank" rel="noreferrer" className="hover:text-white transition">Fuji Testnet Faucet</a></li>
              <li><a href="https://docs.avax.network" target="_blank" rel="noreferrer" className="hover:text-white transition">Avalanche Docs</a></li>
              <li><a href="https://snowtrace.io" target="_blank" rel="noreferrer" className="hover:text-white transition">Snowtrace Explorer</a></li>
            </ul>
          </div>

          {/* Status & Network Badge */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-4">System Status</h4>
            <div className="p-4 bg-card rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-primary" /> Target Chain</span>
                <span className="font-mono text-white font-semibold">Avalanche Fuji</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-green-400" /> Smart Contracts</span>
                <span className="text-green-400 font-semibold">Verified</span>
              </div>
              <div className="pt-2 border-t border-white/5 text-[10px] text-gray-400 text-center">
                Sub-Second Finality Enabled
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Avalanche NFT Marketplace DApp. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
