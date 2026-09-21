"use client";

import React from "react";

export const NFTSkeleton: React.FC = () => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card/40 animate-pulse">
      <div className="aspect-square w-full bg-slate-800/60" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/2 bg-slate-800/80 rounded" />
        <div className="h-5 w-3/4 bg-slate-800 rounded" />
        <div className="pt-3 border-t border-border/40 flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-2 w-12 bg-slate-800/60 rounded" />
            <div className="h-4 w-16 bg-slate-800 rounded" />
          </div>
          <div className="h-8 w-20 bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
