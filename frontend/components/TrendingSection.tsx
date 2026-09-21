"use client";

import React, { useState } from "react";
import { NFTCard } from "./NFTCard";
import { NFTItem } from "../types";
import { Flame, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  nfts: NFTItem[];
  onBuyClick: (nft: NFTItem) => void;
}

export const TrendingSection: React.FC<Props> = ({ nfts, onBuyClick }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Digital Art", "Gaming", "Collectibles", "Photography"];

  const filtered = selectedCategory === "All"
    ? nfts
    : nfts.filter((item) => item.category === selectedCategory);

  return (
    <section className="py-16 bg-surface/50 border-y border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <Flame className="w-4 h-4 text-primary" /> Hot Drops
            </div>
            <h2 className="text-3xl font-extrabold text-white">Trending NFTs on Avalanche</h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-glow"
                    : "bg-card border border-border text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* NFT Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.slice(0, 4).map((nft) => (
            <NFTCard key={nft.tokenId} nft={nft} onBuyClick={onBuyClick} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-primary transition"
          >
            Explore All Marketplace Collections <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
