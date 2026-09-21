"use client";

import React, { useState } from "react";
import { X, Tag, RefreshCw, CheckCircle2, ShieldCheck } from "lucide-react";
import { NFTItem } from "../types";

interface Props {
  isOpen: boolean;
  nft: NFTItem | null;
  onClose: () => void;
  onConfirmListing: (nft: NFTItem, price: string) => Promise<{ success: boolean; txHash?: string; error?: string }>;
}

export const ListModal: React.FC<Props> = ({ isOpen, nft, onClose, onConfirmListing }) => {
  const [price, setPrice] = useState("1.5");
  const [step, setStep] = useState<"form" | "approving" | "listing" | "success" | "error">("form");
  const [txHash, setTxHash] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen || !nft) return null;

  const handleList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!price || parseFloat(price) <= 0) return;

    setStep("approving");
    try {
      // Simulate contract approval step transition
      setTimeout(async () => {
        setStep("listing");
        const res = await onConfirmListing(nft, price);
        if (res.success) {
          setTxHash(res.txHash || "0x78a...b12c");
          setStep("success");
        } else {
          setStep("error");
          setErrorMsg(res.error || "Listing transaction failed on chain.");
        }
      }, 1500);
    } catch (err: any) {
      setStep("error");
      setErrorMsg(err.message || "An error occurred during listing creation.");
    }
  };

  const resetAndClose = () => {
    setStep("form");
    setPrice("1.5");
    setErrorMsg("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {step === "success" ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto border border-green-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">NFT Listed for Sale!</h3>
            <p className="text-xs text-gray-300">
              <span className="text-primary font-bold">{nft.name}</span> is now active on the Avalanche Marketplace for{" "}
              <span className="font-mono text-white font-bold">{price} AVAX</span>.
            </p>
            <button
              onClick={resetAndClose}
              className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-glow transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleList}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">List NFT for Sale</h3>
                <p className="text-xs text-gray-400">Set your fixed price in AVAX</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-card rounded-xl border border-border mb-6">
              <img src={nft.image} alt={nft.name} className="w-14 h-14 rounded-lg object-cover" />
              <div>
                <h4 className="font-bold text-white text-sm line-clamp-1">{nft.name}</h4>
                <p className="text-xs text-gray-400">Token ID: #{nft.tokenId}</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-xs font-bold uppercase text-gray-300 block">Listing Price (AVAX)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.001"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-black/40 border border-border rounded-xl px-4 py-3 text-white font-mono font-bold focus:outline-none focus:border-primary text-base"
                  placeholder="e.g. 2.5"
                />
                <span className="absolute right-4 top-3 text-xs font-bold text-primary font-mono">AVAX</span>
              </div>
            </div>

            {step === "approving" && (
              <div className="p-3 mb-6 bg-purple-500/10 border border-purple-500/30 rounded-xl text-xs text-purple-300 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                <span>Step 1/2: Approving Marketplace contract access...</span>
              </div>
            )}

            {step === "listing" && (
              <div className="p-3 mb-6 bg-primary/10 border border-primary/30 rounded-xl text-xs text-primary flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                <span>Step 2/2: Confirming listing on Avalanche Fuji...</span>
              </div>
            )}

            {step === "error" && (
              <div className="p-3 mb-6 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={resetAndClose}
                className="w-1/3 py-3 bg-surface hover:bg-card text-gray-300 text-xs font-bold rounded-xl border border-border"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={step === "approving" || step === "listing"}
                className="w-2/3 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-purple-glow transition flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> Approve & List
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
