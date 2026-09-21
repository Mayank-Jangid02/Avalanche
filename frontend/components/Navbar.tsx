"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, Compass, PlusSquare, LayoutDashboard, Menu, X, Flame, ShieldAlert } from "lucide-react";
import { WalletModal } from "./WalletModal";

interface Props {
  account?: string;
  chainId?: number;
  balance?: string;
  onConnectWallet: (walletName: string) => void;
  onDisconnectWallet: () => void;
  onSwitchNetwork: () => void;
}

export const Navbar: React.FC<Props> = ({
  account,
  chainId,
  balance = "0.0",
  onConnectWallet,
  onDisconnectWallet,
  onSwitchNetwork,
}) => {
  const pathname = usePathname();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isFuji = chainId === 43113;

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const navLinks = [
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Create NFT", href: "/create", icon: PlusSquare },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-lg border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary via-purple-600 to-cyan-500 p-0.5 shadow-glow group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
                <Flame className="w-6 h-6 text-primary animate-pulse" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                AVAX <span className="gradient-text-avax">Market</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block -mt-1">
                Avalanche Fuji DApp
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-card/60 p-1.5 rounded-full border border-white/5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-glow"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Network Indicator */}
            {account && (
              <button
                onClick={onSwitchNetwork}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                  isFuji
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : "bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isFuji ? "bg-green-400 animate-ping" : "bg-red-500"}`} />
                {isFuji ? "Avalanche Fuji" : "Wrong Network"}
                {!isFuji && <ShieldAlert className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* Wallet Connect / Account Info */}
            {account ? (
              <div className="flex items-center gap-2 bg-card border border-border p-1.5 rounded-2xl">
                <div className="px-3 py-1 bg-surface rounded-xl text-xs font-bold text-gray-300">
                  {parseFloat(balance).toFixed(2)} AVAX
                </div>
                <Link
                  href={`/profile/${account}`}
                  className="px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-white font-mono text-xs font-bold rounded-xl border border-primary/30 transition flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  {truncateAddress(account)}
                </Link>
                <button
                  onClick={onDisconnectWallet}
                  className="px-2 py-1 text-[11px] text-gray-400 hover:text-red-400 transition"
                  title="Disconnect Wallet"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-primary via-purple-600 to-primary text-white font-bold text-xs rounded-xl shadow-glow hover:opacity-95 transition-all flex items-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-surface border-b border-border p-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-200 hover:bg-white/5"
              >
                <link.icon className="w-5 h-5 text-primary" />
                {link.name}
              </Link>
            ))}

            <div className="pt-3 border-t border-border space-y-2">
              {account ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-4 py-2 bg-card rounded-xl text-xs font-semibold">
                    <span className="text-gray-400">Balance</span>
                    <span className="text-white font-bold">{parseFloat(balance).toFixed(2)} AVAX</span>
                  </div>
                  <Link
                    href={`/profile/${account}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center w-full py-2.5 bg-primary/20 text-white font-mono text-xs font-bold rounded-xl border border-primary/30"
                  >
                    {truncateAddress(account)}
                  </Link>
                  <button
                    onClick={() => {
                      onDisconnectWallet();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-xs text-red-400 hover:underline text-center"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsWalletModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 bg-primary text-white font-bold text-xs rounded-xl shadow-glow flex items-center justify-center gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={onConnectWallet}
      />
    </>
  );
};
