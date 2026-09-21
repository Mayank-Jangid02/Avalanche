"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Tag, Eye, ShieldCheck, Flame } from "lucide-react";
import { NFTItem } from "../types";

interface Props {
  nft: NFTItem;
  onBuyClick?: (nft: NFTItem) => void;
}

export const NFTCard: React.FC<Props> = ({ nft, onBuyClick }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 40) + 12);

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const truncate = (addr: string) => {
    if (!addr) return "0x00...0000";
    return `${addr.substring(0, 5)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="group glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between relative border border-border/80 bg-card/60">
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-black/40">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-gray-200 border border-white/10 uppercase tracking-wider flex items-center gap-1">
          <Flame className="w-3 h-3 text-primary" />
          {nft.category || "Digital Art"}
        </div>

        {/* Like Button */}
        <button
          onClick={toggleLike}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all border ${
            isLiked
              ? "bg-red-500/20 border-red-500/40 text-red-400"
              : "bg-black/60 border-white/10 text-gray-300 hover:text-white"
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        {/* Listed Status Pill */}
        {nft.isListed && (
          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-primary to-purple-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-glow flex items-center gap-1">
            <Tag className="w-3 h-3" /> FOR SALE
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-gray-400 mb-1">
            <span className="flex items-center gap-1 text-[11px]">
              Creator: <span className="font-mono text-gray-200 font-semibold">{truncate(nft.creator)}</span>
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <Link href={`/nft/${nft.tokenId}`}>
            <h3 className="font-bold text-base text-white group-hover:text-primary transition line-clamp-1">
              {nft.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Current Price</span>
            <div className="flex items-center gap-1 text-sm font-extrabold text-white">
              <span className="text-primary font-mono">{nft.isListed ? `${nft.price} AVAX` : "Not Listed"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/nft/${nft.tokenId}`}
              className="p-2 rounded-xl bg-surface hover:bg-white/10 text-gray-300 hover:text-white border border-border transition"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Link>

            {nft.isListed && onBuyClick && (
              <button
                onClick={() => onBuyClick(nft)}
                className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow transition"
              >
                Buy Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
