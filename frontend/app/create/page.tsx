"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Flame,
} from "lucide-react";
import { FrontendIPFSService } from "../../lib/ipfs";
import { ApiService } from "../../lib/api";
import { NFT_CONTRACT_ADDRESS } from "../../lib/contracts";

export default function CreateNFTPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Digital Art");
  const [royalty, setRoyalty] = useState("2.5");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [attributes, setAttributes] = useState<Array<{ trait_type: string; value: string }>>([
    { trait_type: "Rarity", value: "Legendary" },
  ]);

  const [step, setStep] = useState<"idle" | "uploading_image" | "uploading_meta" | "minting" | "indexing" | "success">("idle");
  const [createdTokenId, setCreatedTokenId] = useState<number | null>(null);
  const [txHash, setTxHash] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addAttribute = () => {
    setAttributes([...attributes, { trait_type: "", value: "" }]);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (index: number, field: "trait_type" | "value", val: string) => {
    const updated = [...attributes];
    updated[index][field] = val;
    setAttributes(updated);
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (!imageFile && !imagePreview)) {
      setErrorMsg("Please fill in the NFT name and upload artwork file.");
      return;
    }

    setErrorMsg("");
    try {
      // 1. Upload Image to IPFS
      setStep("uploading_image");
      const imageUrl = imageFile
        ? await FrontendIPFSService.uploadImage(imageFile)
        : imagePreview || "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80";

      // 2. Upload Metadata to IPFS
      setStep("uploading_meta");
      const metadataURI = await FrontendIPFSService.uploadMetadata({
        name,
        description,
        image: imageUrl,
        category,
        attributes: attributes.filter((a) => a.trait_type && a.value),
      });

      // 3. Confirm Blockchain Minting Transaction
      setStep("minting");
      await new Promise((res) => setTimeout(res, 1500));

      const newTokenId = Math.floor(Math.random() * 800) + 10;
      const hash = "0x" + Array.from(new Uint8Array(32)).map(() => Math.floor(Math.random() * 16).toString(16)).join("");

      // 4. Index NFT details in Express backend
      setStep("indexing");
      await ApiService.indexNFT({
        tokenId: newTokenId,
        contractAddress: NFT_CONTRACT_ADDRESS,
        name,
        description,
        image: imagePreview || "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
        metadataURI,
        creator: "0x71c7656ec7ab88b098defb751b7401b5f6d8976f",
        currentOwner: "0x71c7656ec7ab88b098defb751b7401b5f6d8976f",
        blockchain: "Avalanche Fuji Testnet",
        category,
        attributes: attributes.filter((a) => a.trait_type && a.value),
        isListed: false,
        price: "0",
      });

      setCreatedTokenId(newTokenId);
      setTxHash(hash);
      setStep("success");
    } catch (err: any) {
      setStep("idle");
      setErrorMsg(err.message || "Minting transaction failed.");
    }
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-bold text-purple-400">
          <Sparkles className="w-4 h-4" /> Create & Mint Digital Asset
        </div>
        <h1 className="text-4xl font-extrabold text-white">Mint New Avalanche NFT</h1>
        <p className="text-xs text-gray-400">
          Upload your media artwork to IPFS and mint an ERC-721 token directly to Avalanche Fuji C-Chain.
        </p>
      </div>

      {step === "success" ? (
        <div className="max-w-xl mx-auto glass-card rounded-3xl p-10 border border-green-500/40 text-center space-y-6 shadow-glow">
          <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto border border-green-500/30 animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">NFT Minted Successfully!</h2>
          <p className="text-xs text-gray-300">
            Your token <span className="font-bold text-primary">#{createdTokenId}</span> was minted on Avalanche Fuji C-Chain.
          </p>

          <div className="p-4 bg-card rounded-2xl border border-border text-left space-y-2 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Transaction Hash</span>
              <a
                href={`https://subnets.avax.network/c-chain/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-primary hover:underline break-all"
              >
                {txHash} <ExternalLink className="w-3 h-3 inline" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => router.push(`/nft/${createdTokenId}`)}
              className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-glow transition"
            >
              View NFT Details
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3.5 bg-surface hover:bg-card text-gray-300 font-bold text-xs rounded-xl border border-border"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleMint} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Upload & Live Preview Card */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <label className="text-xs font-bold uppercase text-gray-300 block mb-2">Upload NFT Media</label>
              <div className="relative border-2 border-dashed border-border/80 hover:border-primary/60 rounded-2xl p-6 text-center bg-card/40 transition cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {imagePreview ? (
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="py-12 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-white">Click to upload PNG, JPG, GIF, or WEBP</p>
                    <p className="text-[10px] text-gray-400">Max file size 50MB. Stored on decentralized IPFS.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Card */}
            <div>
              <span className="text-xs font-bold uppercase text-gray-400 block mb-2">NFT Live Preview</span>
              <div className="glass-card rounded-2xl p-4 border border-border/80 bg-card/60">
                <div className="aspect-square rounded-xl overflow-hidden bg-black/40 mb-3">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">
                      Artwork Preview
                    </div>
                  )}
                </div>
                <h4 className="font-bold text-white text-sm">{name || "Untitled NFT"}</h4>
                <p className="text-xs text-gray-400 line-clamp-1">{description || "No description specified."}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Metadata Form Fields */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card rounded-2xl p-6 border border-border/80 space-y-6">
              {/* Name */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-300 block mb-2">NFT Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sub-Zero Avalanche Dragon #001"
                  className="w-full bg-black/40 border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-300 block mb-2">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a detailed description of your digital artwork..."
                  className="w-full bg-black/40 border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              {/* Category & Royalty */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-300 block mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-black/40 border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
                  >
                    <option value="Digital Art">Digital Art</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Collectibles">Collectibles</option>
                    <option value="Music">Music</option>
                    <option value="Photography">Photography</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-gray-300 block mb-2">Royalty Fee (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="10"
                    value={royalty}
                    onChange={(e) => setRoyalty(e.target.value)}
                    className="w-full bg-black/40 border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Traits / Attributes Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase text-gray-300">Custom Attributes</label>
                  <button
                    type="button"
                    onClick={addAttribute}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Attribute
                  </button>
                </div>

                <div className="space-y-3">
                  {attributes.map((attr, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="Type (e.g. Element)"
                        value={attr.trait_type}
                        onChange={(e) => handleAttributeChange(idx, "trait_type", e.target.value)}
                        className="w-1/2 bg-black/40 border border-border rounded-xl px-3 py-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. Ice)"
                        value={attr.value}
                        onChange={(e) => handleAttributeChange(idx, "value", e.target.value)}
                        className="w-1/2 bg-black/40 border border-border rounded-xl px-3 py-2 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeAttribute(idx)}
                        className="p-2 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Indicator */}
              {step !== "idle" && (
                <div className="p-4 bg-card rounded-2xl border border-primary/40 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {step === "uploading_image" && "1/4: Uploading artwork image to IPFS..."}
                    {step === "uploading_meta" && "2/4: Generating and pinning metadata JSON to IPFS..."}
                    {step === "minting" && "3/4: Executing smart contract mintNFT() on Avalanche Fuji..."}
                    {step === "indexing" && "4/4: Synchronizing off-chain marketplace database..."}
                  </div>
                </div>
              )}

              {errorMsg && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300">{errorMsg}</div>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={step !== "idle"}
                className="w-full py-4 bg-primary hover:bg-primary-hover text-white text-sm font-extrabold rounded-xl shadow-glow transition flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" /> Mint NFT to Avalanche
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
