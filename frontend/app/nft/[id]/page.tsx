"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Tag,
  ShieldCheck,
  ExternalLink,
  Layers,
  History,
  User,
  ShoppingBag,
  Sparkles,
  ArrowLeft,
  XCircle,
} from "lucide-react";
import { ApiService } from "../../../lib/api";
import { FrontendIPFSService } from "../../../lib/ipfs";
import { NFTItem, ActivityItem } from "../../../types";
import { BuyModal } from "../../../components/BuyModal";
import { ListModal } from "../../../components/ListModal";
import { NFT_CONTRACT_ADDRESS } from "../../../lib/contracts";

export default function NFTDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tokenId = Number(params.id);

  const [nft, setNft] = useState<NFTItem | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  // Mock current user address for testing action states
  const currentUserAddress = "0x71c7656ec7ab88b098defb751b7401b5f6d8976f";

  useEffect(() => {
    if (!tokenId) return;

    setIsLoading(true);
    Promise.all([
      ApiService.fetchNFTById(tokenId),
      ApiService.fetchActivity({ tokenId }),
    ]).then(([nftData, actData]) => {
      setNft(nftData);
      setActivities(actData);
      setIsLoading(false);
    });
  }, [tokenId]);

  const handleConfirmPurchase = async (boughtNft: NFTItem) => {
    await new Promise((res) => setTimeout(res, 1000));
    setNft((prev) => (prev ? { ...prev, currentOwner: currentUserAddress, isListed: false, price: "0" } : null));
    return { success: true, txHash: "0x" + Array.from(new Uint8Array(32)).map(() => Math.floor(Math.random() * 16).toString(16)).join("") };
  };

  const handleConfirmListing = async (listedNft: NFTItem, newPrice: string) => {
    await new Promise((res) => setTimeout(res, 1000));
    setNft((prev) => (prev ? { ...prev, isListed: true, price: newPrice } : null));
    return { success: true, txHash: "0x" + Array.from(new Uint8Array(32)).map(() => Math.floor(Math.random() * 16).toString(16)).join("") };
  };

  const handleCancelListing = async () => {
    if (!nft) return;
    setNft({ ...nft, isListed: false, price: "0" });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
        Loading NFT details from Avalanche Fuji...
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">NFT Not Found</h2>
        <p className="text-xs text-gray-400">The requested NFT token ID #{tokenId} does not exist.</p>
        <button
          onClick={() => router.push("/explore")}
          className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  const isOwner = nft.currentOwner.toLowerCase() === currentUserAddress.toLowerCase();
  const isSeller = isOwner && nft.isListed;

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white mb-8 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Explore
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Media & Attributes */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-2xl overflow-hidden border border-border/80 bg-black/40 relative aspect-square p-2">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-full object-cover rounded-xl shadow-2xl"
            />
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/10 flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-primary" /> Token #{nft.tokenId}
            </div>
          </div>

          {/* Traits / Attributes */}
          <div className="glass-card rounded-2xl p-6 border border-border/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> Item Attributes
            </h3>
            {nft.attributes && nft.attributes.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {nft.attributes.map((attr, idx) => (
                  <div key={idx} className="p-3 bg-card rounded-xl border border-border/60 text-center">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">{attr.trait_type}</span>
                    <span className="text-xs font-bold text-primary font-mono mt-0.5 block">{attr.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No custom attributes provided for this item.</p>
            )}
          </div>
        </div>

        {/* Right Column: Title, Owners, Price & Action Buttons */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase rounded-full border border-purple-500/30">
                {nft.category || "Digital Art"}
              </span>
              <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Avalanche Fuji Testnet
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">{nft.name}</h1>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{nft.description}</p>
          </div>

          {/* Creator & Owner Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              href={`/profile/${nft.creator}`}
              className="p-4 glass-card rounded-2xl border border-border/80 flex items-center gap-3 hover:border-primary/40 transition"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Creator</span>
                <span className="font-mono text-xs text-white font-bold">
                  {nft.creator.substring(0, 6)}...{nft.creator.substring(nft.creator.length - 4)}
                </span>
              </div>
            </Link>

            <Link
              href={`/profile/${nft.currentOwner}`}
              className="p-4 glass-card rounded-2xl border border-border/80 flex items-center gap-3 hover:border-purple-500/40 transition"
            >
              <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Current Owner</span>
                <span className="font-mono text-xs text-white font-bold">
                  {nft.currentOwner.substring(0, 6)}...{nft.currentOwner.substring(nft.currentOwner.length - 4)}
                </span>
              </div>
            </Link>
          </div>

          {/* Price Box & Action Buttons */}
          <div className="glass-card rounded-2xl p-6 border border-border/80 bg-gradient-to-r from-card to-surface space-y-6">
            <div>
              <span className="text-xs uppercase font-bold text-gray-400 block mb-1">Marketplace Status</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-white font-mono">
                  {nft.isListed ? `${nft.price} AVAX` : "Not Listed for Sale"}
                </span>
                {nft.isListed && (
                  <span className="text-xs text-gray-400 font-mono">
                    (~${(parseFloat(nft.price || "0") * 35).toFixed(2)} USD)
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {nft.isListed && !isOwner && (
                <button
                  onClick={() => setIsBuyModalOpen(true)}
                  className="px-8 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold rounded-xl shadow-glow transition flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Buy Now
                </button>
              )}

              {isOwner && !nft.isListed && (
                <button
                  onClick={() => setIsListModalOpen(true)}
                  className="px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold rounded-xl shadow-purple-glow transition flex items-center gap-2"
                >
                  <Tag className="w-4 h-4" /> List for Sale
                </button>
              )}

              {isSeller && (
                <button
                  onClick={handleCancelListing}
                  className="px-6 py-3.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-extrabold rounded-xl transition flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Cancel Listing
                </button>
              )}

              <button
                onClick={() => alert("Make Offer architecture ready for future bidding implementation.")}
                className="px-6 py-3.5 bg-surface hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl border border-border transition"
              >
                Make Offer
              </button>
            </div>
          </div>

          {/* Details Metadata Section */}
          <div className="glass-card rounded-2xl p-6 border border-border/80 space-y-3 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Contract Details</h3>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-gray-400">Contract Address</span>
              <a
                href={`https://subnets.avax.network/c-chain/address/${NFT_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-primary hover:underline flex items-center gap-1"
              >
                {NFT_CONTRACT_ADDRESS.substring(0, 8)}...{NFT_CONTRACT_ADDRESS.substring(NFT_CONTRACT_ADDRESS.length - 6)}{" "}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-gray-400">Token ID</span>
              <span className="font-mono text-white font-bold">#{nft.tokenId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-gray-400">Token Standard</span>
              <span className="font-mono text-white">ERC-721</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Metadata IPFS</span>
              <a
                href={FrontendIPFSService.resolveIPFSUrl(nft.metadataURI)}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-cyan-400 hover:underline flex items-center gap-1"
              >
                View Metadata JSON <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Item Activity Log */}
          <div className="glass-card rounded-2xl p-6 border border-border/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-primary" /> Item Activity History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-gray-400 uppercase font-bold text-[10px]">
                    <th className="pb-2">Event</th>
                    <th className="pb-2">Price</th>
                    <th className="pb-2">From</th>
                    <th className="pb-2">To</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {activities.map((act, idx) => (
                    <tr key={idx} className="hover:bg-white/5">
                      <td className="py-2.5 font-bold text-primary">{act.type}</td>
                      <td className="py-2.5 font-mono text-white">{act.price ? `${act.price} AVAX` : "-"}</td>
                      <td className="py-2.5 font-mono text-gray-400">{act.from ? `${act.from.substring(0, 6)}...` : "-"}</td>
                      <td className="py-2.5 font-mono text-gray-400">{act.to ? `${act.to.substring(0, 6)}...` : "-"}</td>
                      <td className="py-2.5 text-gray-500">{new Date(act.timestamp).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Action Modals */}
      <BuyModal
        isOpen={isBuyModalOpen}
        nft={nft}
        onClose={() => setIsBuyModalOpen(false)}
        onConfirmPurchase={handleConfirmPurchase}
      />

      <ListModal
        isOpen={isListModalOpen}
        nft={nft}
        onClose={() => setIsListModalOpen(false)}
        onConfirmListing={handleConfirmListing}
      />
    </div>
  );
}
