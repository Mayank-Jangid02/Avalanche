"use client";

import React, { useEffect, useState } from "react";
import { SearchBar } from "../../components/SearchBar";
import { Filters } from "../../components/Filters";
import { NFTGrid } from "../../components/NFTGrid";
import { BuyModal } from "../../components/BuyModal";
import { ApiService } from "../../lib/api";
import { NFTItem } from "../../types";
import { Compass, Sparkles } from "lucide-react";

export default function ExplorePage() {
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recentlyListed");
  const [isListedOnly, setIsListedOnly] = useState(false);
  const [selectedBuyNft, setSelectedBuyNft] = useState<NFTItem | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    const data = await ApiService.fetchNFTs({
      category: category !== "All" ? category : undefined,
      search: search || undefined,
      isListed: isListedOnly ? true : undefined,
      sortBy,
    });
    setNfts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [category, search, sortBy, isListedOnly]);

  const handleConfirmPurchase = async (nft: NFTItem) => {
    await new Promise((res) => setTimeout(res, 1000));
    setNfts((prev) =>
      prev.map((item) =>
        item.tokenId === nft.tokenId ? { ...item, isListed: false, price: "0" } : item
      )
    );
    return { success: true, txHash: "0x" + Array.from(new Uint8Array(32)).map(() => Math.floor(Math.random() * 16).toString(16)).join("") };
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-bold text-primary">
          <Compass className="w-4 h-4" /> Marketplace Explorer
        </div>
        <h1 className="text-4xl font-extrabold text-white">Explore Avalanche NFTs</h1>
        <p className="text-xs text-gray-400">
          Search and discover verified digital art, gaming assets, and metaverse collectibles on Avalanche Fuji Testnet.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="mb-6 max-w-3xl mx-auto">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* Filter Controls */}
      <Filters
        selectedCategory={category}
        onCategoryChange={setCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        isListedOnly={isListedOnly}
        onListedOnlyChange={setIsListedOnly}
      />

      {/* NFT Grid Container */}
      <NFTGrid nfts={nfts} isLoading={isLoading} onBuyClick={(nft) => setSelectedBuyNft(nft)} />

      {/* Buy Modal */}
      <BuyModal
        isOpen={!!selectedBuyNft}
        nft={selectedBuyNft}
        onClose={() => setSelectedBuyNft(null)}
        onConfirmPurchase={handleConfirmPurchase}
      />
    </div>
  );
}
