"use client";

import React from "react";
import { Wallet, Sparkles, Tag, ShieldCheck } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Connect Wallet",
      description: "Connect your Web3 crypto wallet (MetaMask or WalletConnect) to Avalanche Fuji Testnet.",
      icon: Wallet,
      color: "from-red-500/20 to-primary/20 text-primary border-primary/30",
    },
    {
      num: "02",
      title: "Create or Discover",
      description: "Mint your unique digital artwork with IPFS metadata storage or browse trending collections.",
      icon: Sparkles,
      color: "from-purple-500/20 to-purple-600/20 text-purple-400 border-purple-500/30",
    },
    {
      num: "03",
      title: "Buy or List NFT",
      description: "List your NFT for fixed AVAX price or buy listed items directly with sub-second finality.",
      icon: Tag,
      color: "from-cyan-500/20 to-cyan-600/20 text-cyan-400 border-cyan-500/30",
    },
    {
      num: "04",
      title: "Own & Trade",
      description: "Manage portfolio items on your personal dashboard with fully verified on-chain ownership.",
      icon: ShieldCheck,
      color: "from-green-500/20 to-emerald-600/20 text-green-400 border-green-500/30",
    },
  ];

  return (
    <section className="py-20 bg-surface/30 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">Getting Started</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How It Works</h2>
          <p className="text-xs text-gray-400 mt-2">Start your Web3 NFT journey on Avalanche in four simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="glass-card rounded-2xl p-6 border border-border/80 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} border flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black font-mono text-gray-600 opacity-40">{step.num}</span>
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
