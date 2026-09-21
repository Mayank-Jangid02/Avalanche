"use client";

import React from "react";
import { X, Wallet, ShieldCheck, Zap } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletName: string) => void;
}

export const WalletModal: React.FC<Props> = ({ isOpen, onClose, onConnect }) => {
  if (!isOpen) return null;

  const wallets = [
    {
      name: "MetaMask",
      description: "Connect using your browser extension",
      icon: "https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg",
      recommended: true,
    },
    {
      name: "Coinbase Wallet",
      description: "Connect using Coinbase self-custody wallet",
      icon: "https://raw.githubusercontent.com/valora-inc/wallet-icons/main/png/coinbase.png",
      recommended: false,
    },
    {
      name: "WalletConnect",
      description: "Scan QR code with any mobile Web3 wallet",
      icon: "https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Blue%20(SVG)/Logo.svg",
      recommended: false,
    },
    {
      name: "Avalanche Fuji Demo Wallet",
      description: "Instant zero-config testnet wallet for testing",
      icon: "https://raw.githubusercontent.com/ava-labs/avalanche-docs/master/static/img/avalanche-logo.svg",
      isDemo: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/20 text-primary rounded-xl">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Connect Wallet</h3>
            <p className="text-xs text-gray-400">Choose your preferred Web3 wallet for Avalanche Fuji</p>
          </div>
        </div>

        <div className="space-y-3">
          {wallets.map((w) => (
            <button
              key={w.name}
              onClick={() => {
                onConnect(w.name);
                onClose();
              }}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                w.isDemo
                  ? "bg-gradient-to-r from-red-950/40 via-surface to-red-950/40 border-primary/50 hover:border-primary shadow-glow"
                  : "bg-card/50 border-border hover:border-primary/40 hover:bg-card"
              }`}
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center p-2 border border-white/5">
                  <img src={w.icon} alt={w.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{w.name}</span>
                    {w.recommended && (
                      <span className="text-[10px] font-bold uppercase bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/30">
                        Popular
                      </span>
                    )}
                    {w.isDemo && (
                      <span className="text-[10px] font-bold uppercase bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Quick Start
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{w.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border/60 text-center">
          <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-green-400" /> Safe & End-to-End Encrypted Web3 Connection
          </p>
        </div>
      </div>
    </div>
  );
};
