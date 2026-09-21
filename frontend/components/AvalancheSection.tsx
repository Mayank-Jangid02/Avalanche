"use client";

import React from "react";
import { Zap, Shield, Cpu, Layers } from "lucide-react";

export const AvalancheSection: React.FC = () => {
  const features = [
    {
      title: "Sub-Second Finality",
      description: "Transactions achieve immutable confirmation in under 1 second without waiting for block confirmations.",
      icon: Zap,
    },
    {
      title: "Low Eco-Friendly Fees",
      description: "Mint and trade NFTs at a fraction of standard L1 gas costs with eco-sustainable Proof-of-Stake.",
      icon: Shield,
    },
    {
      title: "4,500+ TPS Capacity",
      description: "High-throughput execution powered by Avalanche's revolutionary Snow consensus protocol.",
      icon: Cpu,
    },
    {
      title: "Seamless Mainnet Migration",
      description: "Built for Fuji Testnet development with instant environment configuration for Mainnet deployment.",
      icon: Layers,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-surface/40 via-background to-surface/40 border-y border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-xs font-bold text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              Powered by Avalanche
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Built for Speed, Scale & Security on <span className="gradient-text-avax">Avalanche C-Chain</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Avalanche is the fastest smart contracts platform in the blockchain industry. Our NFT marketplace leverages C-Chain EVM compatibility to deliver seamless Web3 trading experiences.
            </p>

            <div className="pt-4 flex items-center gap-4">
              <a
                href="https://core.app/tools/testnet-faucet/?subnet=c&token=c"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold rounded-xl border border-red-500/40 transition"
              >
                Get Free Fuji Testnet AVAX
              </a>
              <a
                href="https://snowtrace.io"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 bg-card hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl border border-border transition"
              >
                View C-Chain Explorer
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="glass-card rounded-2xl p-6 border border-border/80">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
