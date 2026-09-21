"use client";

import React, { useState } from "react";
import { X, ShoppingBag, ShieldCheck, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { NFTItem } from "../types";

interface Props {
  isOpen: boolean;
  nft: NFTItem | null;
  onClose: () => void;
  onConfirmPurchase: (nft: NFTItem) => Promise<{ success: boolean; txHash?: string; error?: string }>;
}

export const BuyModal: React.FC<Props> = ({ isOpen, nft, onClose, onConfirmPurchase }) => {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  if (!isOpen || !nft) return null;

  const priceNum = parseFloat(nft.price || "0");
  const marketplaceFee = (priceNum * 0.025).toFixed(4); // 2.5%
  const totalAmount = priceNum.toFixed(4);

  const handleBuy = async () => {
    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await onConfirmPurchase(nft);
      if (res.success) {
        setStatus("success");
        setTxHash(res.txHash || "0x98f...fbc4");
      } else {
        setStatus("error");
        setErrorMessage(res.error || "Transaction was rejected or failed on chain.");
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred during purchase.");
    }
  };

  const resetAndClose = () => {
    setStatus("idle");
    setTxHash("");
    setErrorMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {status === "success" ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto border border-green-500/30 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">Purchase Successful!</h3>
            <p className="text-xs text-gray-300 max-w-xs mx-auto">
              You are now the official owner of <span className="text-primary font-bold">{nft.name}</span> on Avalanche Fuji Testnet.
            </p>

            {txHash && (
              <div className="p-3 bg-card rounded-xl border border-border text-left">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Transaction Hash</span>
                <a
                  href={`https://subnets.avax.network/c-chain/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs text-primary hover:underline break-all"
                >
                  {txHash}
                </a>
              </div>
            )}

            <button
              onClick={resetAndClose}
              className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-glow transition"
            >
              View in My Dashboard
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/20 text-primary rounded-xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Confirm NFT Purchase</h3>
                <p className="text-xs text-gray-400">Review item details before sending AVAX transaction</p>
              </div>
            </div>

            {/* Item Card Overview */}
            <div className="flex items-center gap-4 p-3 bg-card rounded-xl border border-border/80 mb-6">
              <img src={nft.image} alt={nft.name} className="w-16 h-16 rounded-lg object-cover border border-white/10" />
              <div>
                <h4 className="font-bold text-white text-sm line-clamp-1">{nft.name}</h4>
                <p className="text-xs text-gray-400 mt-0.5">Token ID: #{nft.tokenId}</p>
                <span className="text-[10px] text-cyan-400 font-mono">Avalanche Fuji C-Chain</span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 p-4 bg-black/40 rounded-xl border border-border/60 text-xs mb-6">
              <div className="flex justify-between text-gray-300">
                <span>NFT Item Price</span>
                <span className="font-mono font-bold text-white">{priceNum} AVAX</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Marketplace Platform Fee (2.5%)</span>
                <span className="font-mono text-gray-300">{marketplaceFee} AVAX</span>
              </div>
              <div className="pt-2 border-t border-border flex justify-between text-sm font-bold">
                <span className="text-white">Total Amount</span>
                <span className="font-mono text-primary text-base">{totalAmount} AVAX</span>
              </div>
            </div>

            {status === "error" && (
              <div className="p-3 mb-6 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Transaction Failed</p>
                  <p className="text-[11px] text-red-200 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={resetAndClose}
                disabled={status === "submitting"}
                className="w-1/3 py-3 bg-surface hover:bg-card text-gray-300 text-xs font-bold rounded-xl border border-border transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBuy}
                disabled={status === "submitting"}
                className="w-2/3 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-glow transition flex items-center justify-center gap-2"
              >
                {status === "submitting" ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Confirming on Avalanche...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" /> Confirm & Pay {totalAmount} AVAX
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
