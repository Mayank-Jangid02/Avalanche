"use client";

import React from "react";
import Link from "next/link";
import { Compass, PlusSquare, Zap, Shield, Sparkles, TrendingUp } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      {/* Dynamic Background Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-primary/30 via-purple-600/20 to-cyan-500/20 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-primary/30 text-xs font-bold text-primary shadow-glow">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Powered by Avalanche C-Chain
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Discover, Collect & Trade <span className="gradient-text-avax">Digital Assets</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Trade verified digital collectibles with instant sub-second finality, ultra-low gas fees, and complete decentralized ownership on the Avalanche blockchain.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/explore"
                className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-white font-extrabold text-sm rounded-xl shadow-glow transition-all flex items-center justify-center gap-2 group"
              >
                <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                Explore NFTs
              </Link>

              <Link
                href="/create"
                className="w-full sm:w-auto px-8 py-4 bg-surface hover:bg-card text-white font-extrabold text-sm rounded-xl border border-border/80 transition-all flex items-center justify-center gap-2"
              >
                <PlusSquare className="w-5 h-5 text-purple-400" />
                Create NFT
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-8 border-t border-border/40 grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0">
              <div>
                <span className="text-2xl font-extrabold text-white block">10K+</span>
                <span className="text-[11px] text-gray-400 font-medium">NFT Items</span>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-white block">4.5K+</span>
                <span className="text-[11px] text-gray-400 font-medium">Creators</span>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-primary block">&lt; 1s</span>
                <span className="text-[11px] text-gray-400 font-medium">Finality</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Cards */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Floating Featured Card */}
              <div className="glass-card rounded-2xl p-4 border border-border shadow-2xl animate-float">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80"
                    alt="Featured NFT"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold text-primary border border-primary/30 uppercase">
                    Featured
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base">Sub-Zero Dragon #001</h3>
                    <p className="text-xs text-gray-400">By AvaxCreator</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Current Price</span>
                    <span className="font-mono font-extrabold text-primary text-sm">4.5 AVAX</span>
                  </div>
                </div>
              </div>

              {/* Decorative Secondary Card Offset */}
              <div className="absolute -bottom-6 -right-6 w-3/4 glass-card rounded-2xl p-3 border border-purple-500/30 opacity-75 hidden sm:block -z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/50">
                    <img
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80"
                      alt="Cyber Warrior"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Cybernetic Warrior</h4>
                    <span className="text-[10px] text-purple-400 font-mono">8.2 AVAX</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
