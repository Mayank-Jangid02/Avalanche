"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, UserCheck, Flame } from "lucide-react";

export const FeaturedCreators: React.FC = () => {
  const creators = [
    {
      address: "0x71c7656ec7ab88b098defb751b7401b5f6d8976f",
      username: "GlacierArtisan",
      volume: "142.5 AVAX",
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
      itemsCount: 18,
    },
    {
      address: "0x3c44cdedd6a362e12057242905b5259473427546",
      username: "CyberAvaxLabs",
      volume: "98.2 AVAX",
      avatar: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=400&q=80",
      itemsCount: 12,
    },
    {
      address: "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
      username: "AvalancheCitadel",
      volume: "64.0 AVAX",
      avatar: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=400&q=80",
      itemsCount: 9,
    },
    {
      address: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
      username: "SubZeroVisions",
      volume: "51.8 AVAX",
      avatar: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80",
      itemsCount: 15,
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
            <UserCheck className="w-4 h-4 text-purple-400" /> Verified Artists
          </div>
          <h2 className="text-3xl font-extrabold text-white">Top Avalanche Creators</h2>
          <p className="text-xs text-gray-400 mt-2">
            Meet the digital visionaries shaping the future of Web3 art and gaming on Avalanche Fuji Testnet.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {creators.map((c, idx) => (
            <Link
              key={c.address}
              href={`/profile/${c.address}`}
              className="glass-card glass-card-hover rounded-2xl p-6 border border-border/80 text-center relative group"
            >
              <div className="absolute top-4 left-4 text-xs font-extrabold text-gray-500 font-mono">
                #{idx + 1}
              </div>
              <div className="relative w-20 h-20 mx-auto mb-4">
                <img src={c.avatar} alt={c.username} className="w-full h-full rounded-full object-cover border-2 border-primary/40 group-hover:border-primary transition" />
                <div className="absolute bottom-0 right-0 p-1 bg-cyan-500 text-black rounded-full border border-background">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-primary transition flex items-center justify-center gap-1">
                {c.username}
              </h3>
              <p className="text-[11px] font-mono text-gray-400 mb-4">{c.address.substring(0, 6)}...{c.address.substring(c.address.length - 4)}</p>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Volume</span>
                  <span className="font-mono text-primary font-bold">{c.volume}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Items</span>
                  <span className="font-mono text-white font-bold">{c.itemsCount}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
