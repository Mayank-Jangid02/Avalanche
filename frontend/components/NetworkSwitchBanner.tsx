"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  currentChainId?: number;
  targetChainId: number;
  onSwitch: () => void;
  isSwitching?: boolean;
}

export const NetworkSwitchBanner: React.FC<Props> = ({
  currentChainId,
  targetChainId,
  onSwitch,
  isSwitching = false,
}) => {
  if (!currentChainId || currentChainId === targetChainId) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-950/80 via-red-900/90 to-red-950/80 border-b border-red-500/40 text-white px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/20 rounded-full text-red-400 animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">Unsupported Network Detected</p>
            <p className="text-xs text-red-200">
              Please switch to <span className="font-bold text-white">Avalanche Fuji Testnet</span> (Chain ID: {targetChainId}) to mint, buy, and trade NFTs.
            </p>
          </div>
        </div>
        <button
          onClick={onSwitch}
          disabled={isSwitching}
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-glow transition-all flex items-center gap-2 whitespace-nowrap"
        >
          {isSwitching ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Switching Network...
            </>
          ) : (
            "Switch to Avalanche Fuji Testnet"
          )}
        </button>
      </div>
    </div>
  );
};
