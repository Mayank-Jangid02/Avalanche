"use client";

import React, { useEffect, useState } from "react";
import { HeroSection } from "../components/HeroSection";
import { TrendingSection } from "../components/TrendingSection";
import { FeaturedCreators } from "../components/FeaturedCreators";
import { HowItWorks } from "../components/HowItWorks";
import { AvalancheSection } from "../components/AvalancheSection";
import { BuyModal } from "../components/BuyModal";
import { ApiService } from "../lib/api";
import { NFTItem } from "../types";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [selectedBuyNft, setSelectedBuyNft] = useState<NFTItem | null>(null);

  useEffect(() => {
    ApiService.fetchNFTs({ isListed: true }).then((data) => {
      setNfts(data);
    });
  }, []);

  const handleConfirmPurchase = async (nft: NFTItem) => {
    // Execute purchase API & on-chain sync
    await new Promise((res) => setTimeout(res, 1200));
    setNfts((prev) => prev.filter((item) => item.tokenId !== nft.tokenId));
    return { success: true, txHash: "0x" + Array.from(new Uint8Array(32)).map(() => Math.floor(Math.random() * 16).toString(16)).join("") };
  };

  return (
    <div>
      {/* 1. Hero Landing Section */}
      <HeroSection />

      {/* 2. Trending NFTs Section */}
      <TrendingSection nfts={nfts} onBuyClick={(nft) => setSelectedBuyNft(nft)} />

      {/* 3. Featured Creators Section */}
      <FeaturedCreators />

      {/* 4. How It Works Section */}
      <HowItWorks />

      {/* 5. Avalanche Ecosystem Section */}
      <AvalancheSection />

      {/* 6. Call To Action Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 glass-card rounded-3xl p-12 border border-primary/40 shadow-glow bg-gradient-to-r from-red-950/40 via-surface to-purple-950/40">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">Start Your NFT Journey Today</h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Mint your artwork to IPFS and list on the sub-second finality of Avalanche Fuji Testnet.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/create"
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-white font-extrabold text-sm rounded-xl shadow-glow transition flex items-center justify-center gap-2"
            >
              Mint NFT Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/explore"
              className="w-full sm:w-auto px-8 py-4 bg-surface hover:bg-card text-white font-extrabold text-sm rounded-xl border border-border transition"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Buy Confirmation Modal */}
      <BuyModal
        isOpen={!!selectedBuyNft}
        nft={selectedBuyNft}
        onClose={() => setSelectedBuyNft(null)}
        onConfirmPurchase={handleConfirmPurchase}
      />
    </div>
  );
}
