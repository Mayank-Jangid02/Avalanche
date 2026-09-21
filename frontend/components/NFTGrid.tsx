"use client";

import React from "react";
import { NFTCard } from "./NFTCard";
import { NFTSkeleton } from "./NFTSkeleton";
import { NFTItem } from "../types";
import { SearchX } from "lucide-react";

interface Props {
  nfts: NFTItem[];
  isLoading?: boolean;
  onBuyClick?: (nft: NFTItem) => void;
}

export const NFTGrid: React.FC<Props> = ({ nfts, isLoading = false, onBuyClick }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <NFTSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center border border-border/60 max-w-md mx-auto my-12">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No NFTs Found</h3>
        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
          There are currently no digital collectibles matching your search query or selected category filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {nfts.map((nft) => (
        <NFTCard key={`${nft.contractAddress}-${nft.tokenId}`} nft={nft} onBuyClick={onBuyClick} />
      ))}
    </div>
  );
};
