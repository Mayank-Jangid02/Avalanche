"use client";

import React, { useEffect, useState } from "react";
import { NFTItem, ActivityItem } from "../../types";
import { ApiService } from "../../lib/api";
import { NFTGrid } from "../../components/NFTGrid";
import { BuyModal } from "../../components/BuyModal";
import {
  LayoutDashboard,
  Layers,
  UserCheck,
  Tag,
  TrendingUp,
  History,
  ShieldCheck,
  Database,
  Link as LinkIcon,
} from "lucide-react";

export default function DashboardPage() {
  const accountAddress = "0x71c7656ec7ab88b098defb751b7401b5f6d8976f"; // Connected user wallet address

  const [ownedNfts, setOwnedNfts] = useState<NFTItem[]>([]);
  const [createdNfts, setCreatedNfts] = useState<NFTItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activeTab, setActiveTab] = useState<"owned" | "created" | "listed" | "activity">("owned");
  const [selectedBuyNft, setSelectedBuyNft] = useState<NFTItem | null>(null);

  useEffect(() => {
    Promise.all([
      ApiService.fetchNFTsByOwner(accountAddress),
      ApiService.fetchNFTsByCreator(accountAddress),
      ApiService.fetchActivity({ address: accountAddress }),
    ]).then(([ownerData, creatorData, actData]) => {
      setOwnedNfts(ownerData);
      setCreatedNfts(creatorData);
      setActivities(actData);
    });
  }, []);

  const listedNfts = ownedNfts.filter((n) => n.isListed);
  const totalVolume = ownedNfts.reduce((acc, curr) => acc + parseFloat(curr.price || "0"), 0).toFixed(2);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-400">
          <LayoutDashboard className="w-4 h-4" /> Personal Portfolio Dashboard
        </div>
        <h1 className="text-4xl font-extrabold text-white">Marketplace Dashboard</h1>
        <p className="text-xs text-gray-400 font-mono">
          Connected Wallet: <span className="text-primary font-bold">{accountAddress}</span>
        </p>
      </div>

      {/* Statistics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Metric 1 */}
        <div className="glass-card rounded-2xl p-6 border border-border/80 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase text-gray-400">NFTs Owned</span>
            <div className="p-2 rounded-xl bg-primary/20 text-primary">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{ownedNfts.length}</span>
            <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified On-Chain
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card rounded-2xl p-6 border border-border/80 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase text-gray-400">NFTs Created</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{createdNfts.length}</span>
            <span className="text-[10px] text-purple-400 font-semibold flex items-center gap-1">
              <LinkIcon className="w-3 h-3" /> ERC-721 Contract
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card rounded-2xl p-6 border border-border/80 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase text-gray-400">Active Listings</span>
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{listedNfts.length}</span>
            <span className="text-[10px] text-cyan-400 font-semibold flex items-center gap-1">
              <Database className="w-3 h-3" /> Indexed DB
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-card rounded-2xl p-6 border border-border/80 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase text-gray-400">Total Portfolio Value</span>
            <div className="p-2 rounded-xl bg-green-500/20 text-green-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{totalVolume} AVAX</span>
            <span className="text-[10px] text-gray-400">Fuji Testnet</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-4 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab("owned")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "owned" ? "bg-primary text-white shadow-glow" : "bg-surface text-gray-400 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" /> My NFTs ({ownedNfts.length})
        </button>
        <button
          onClick={() => setActiveTab("created")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "created" ? "bg-purple-600 text-white shadow-purple-glow" : "bg-surface text-gray-400 hover:text-white"
          }`}
        >
          <UserCheck className="w-4 h-4" /> Created ({createdNfts.length})
        </button>
        <button
          onClick={() => setActiveTab("listed")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "listed" ? "bg-cyan-600 text-white shadow-cyan-glow" : "bg-surface text-gray-400 hover:text-white"
          }`}
        >
          <Tag className="w-4 h-4" /> Listed ({listedNfts.length})
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "activity" ? "bg-gray-700 text-white" : "bg-surface text-gray-400 hover:text-white"
          }`}
        >
          <History className="w-4 h-4" /> Personal Activity Log ({activities.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === "owned" && <NFTGrid nfts={ownedNfts} onBuyClick={(nft) => setSelectedBuyNft(nft)} />}
      {activeTab === "created" && <NFTGrid nfts={createdNfts} onBuyClick={(nft) => setSelectedBuyNft(nft)} />}
      {activeTab === "listed" && <NFTGrid nfts={listedNfts} onBuyClick={(nft) => setSelectedBuyNft(nft)} />}

      {activeTab === "activity" && (
        <div className="glass-card rounded-2xl p-6 border border-border/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-gray-400 uppercase font-bold text-[10px]">
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Token ID</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">From</th>
                  <th className="pb-3">To</th>
                  <th className="pb-3">Transaction Hash</th>
                  <th className="pb-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {activities.map((act, idx) => (
                  <tr key={idx} className="hover:bg-white/5">
                    <td className="py-3 font-bold text-primary">{act.type}</td>
                    <td className="py-3 font-mono text-white">#{act.tokenId}</td>
                    <td className="py-3 font-mono text-white">{act.price ? `${act.price} AVAX` : "-"}</td>
                    <td className="py-3 font-mono text-gray-400">{act.from ? `${act.from.substring(0, 6)}...` : "-"}</td>
                    <td className="py-3 font-mono text-gray-400">{act.to ? `${act.to.substring(0, 6)}...` : "-"}</td>
                    <td className="py-3 font-mono text-cyan-400">
                      {act.transactionHash ? `${act.transactionHash.substring(0, 10)}...` : "-"}
                    </td>
                    <td className="py-3 text-gray-400">{new Date(act.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <BuyModal
        isOpen={!!selectedBuyNft}
        nft={selectedBuyNft}
        onClose={() => setSelectedBuyNft(null)}
        onConfirmPurchase={async () => ({ success: true })}
      />
    </div>
  );
}
