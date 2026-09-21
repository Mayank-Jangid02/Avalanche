"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { UserProfile, NFTItem } from "../../../types";
import { ApiService } from "../../../lib/api";
import { NFTGrid } from "../../../components/NFTGrid";
import { BuyModal } from "../../../components/BuyModal";
import { UserCheck, ShieldCheck, Edit3, Save, Layers, Tag, CheckCircle2 } from "lucide-react";

export default function UserProfilePage() {
  const params = useParams();
  const address = String(params.address || "").toLowerCase();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [createdNfts, setCreatedNfts] = useState<NFTItem[]>([]);
  const [ownedNfts, setOwnedNfts] = useState<NFTItem[]>([]);
  const [activeTab, setActiveTab] = useState<"owned" | "created" | "listed">("owned");

  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [selectedBuyNft, setSelectedBuyNft] = useState<NFTItem | null>(null);

  useEffect(() => {
    if (!address) return;

    Promise.all([
      ApiService.fetchUserProfile(address),
      ApiService.fetchNFTsByOwner(address),
      ApiService.fetchNFTsByCreator(address),
    ]).then(([userData, ownerData, creatorData]) => {
      setProfile(userData);
      if (userData) {
        setEditUsername(userData.username);
        setEditBio(userData.bio || "");
      }
      setOwnedNfts(ownerData);
      setCreatedNfts(creatorData);
    });
  }, [address]);

  const handleSaveProfile = async () => {
    if (!address) return;
    await ApiService.updateUserProfile(address, {
      username: editUsername,
      bio: editBio,
    });
    setProfile((prev) => (prev ? { ...prev, username: editUsername, bio: editBio } : null));
    setIsEditing(false);
  };

  const listedNfts = ownedNfts.filter((n) => n.isListed);

  return (
    <div>
      {/* Banner */}
      <div className="h-64 w-full bg-gradient-to-r from-red-900 via-purple-950 to-cyan-950 relative overflow-hidden">
        <img
          src={profile?.bannerImage || "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80"}
          alt="Banner"
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      {/* Profile Info Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-20 mb-12">
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border/80 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
            <div className="w-28 h-28 rounded-full border-4 border-background overflow-hidden shadow-glow bg-black/60 shrink-0">
              <img
                src={profile?.profileImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {profile?.username || `User_${address.substring(2, 8)}`}
                </h1>
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
              <p className="font-mono text-xs text-gray-400 mb-2">{address}</p>
              <p className="text-xs text-gray-300 max-w-lg">{profile?.bio || "Avalanche NFT collector & digital creator."}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-5 py-2.5 bg-surface hover:bg-card text-white text-xs font-bold rounded-xl border border-border transition flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4 text-primary" /> Edit Profile
          </button>
        </div>

        {/* Profile Edit Drawer */}
        {isEditing && (
          <div className="mt-4 glass-card rounded-2xl p-6 border border-primary/40 space-y-4">
            <h3 className="text-sm font-bold text-white">Edit Off-Chain User Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Username</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full bg-black/40 border border-border rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Bio</label>
                <input
                  type="text"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-black/40 border border-border rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
            <button
              onClick={handleSaveProfile}
              className="px-5 py-2 bg-primary text-white font-bold text-xs rounded-xl shadow-glow flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Profile Details
            </button>
          </div>
        )}
      </div>

      {/* Portfolio Tabs & Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 border-b border-border/80 pb-4 mb-8">
          <button
            onClick={() => setActiveTab("owned")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "owned"
                ? "bg-primary text-white shadow-glow"
                : "bg-surface text-gray-400 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" /> Owned ({ownedNfts.length})
          </button>
          <button
            onClick={() => setActiveTab("created")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "created"
                ? "bg-purple-600 text-white shadow-purple-glow"
                : "bg-surface text-gray-400 hover:text-white"
            }`}
          >
            <UserCheck className="w-4 h-4" /> Created ({createdNfts.length})
          </button>
          <button
            onClick={() => setActiveTab("listed")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "listed"
                ? "bg-cyan-600 text-white shadow-cyan-glow"
                : "bg-surface text-gray-400 hover:text-white"
            }`}
          >
            <Tag className="w-4 h-4" /> Active Listings ({listedNfts.length})
          </button>
        </div>

        {activeTab === "owned" && <NFTGrid nfts={ownedNfts} onBuyClick={(nft) => setSelectedBuyNft(nft)} />}
        {activeTab === "created" && <NFTGrid nfts={createdNfts} onBuyClick={(nft) => setSelectedBuyNft(nft)} />}
        {activeTab === "listed" && <NFTGrid nfts={listedNfts} onBuyClick={(nft) => setSelectedBuyNft(nft)} />}
      </div>

      <BuyModal
        isOpen={!!selectedBuyNft}
        nft={selectedBuyNft}
        onClose={() => setSelectedBuyNft(null)}
        onConfirmPurchase={async () => ({ success: true })}
      />
    </div>
  );
}
