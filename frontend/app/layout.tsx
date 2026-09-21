"use client";

import React, { useState, useEffect } from "react";
import { WagmiProvider, useAccount, useChainId, useSwitchChain, useBalance, useDisconnect } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "../lib/wagmi";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { NetworkSwitchBanner } from "../components/NetworkSwitchBanner";
import "./globals.css";

const queryClient = new QueryClient();

function MainContent({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { disconnect } = useDisconnect();

  // Demo state fallback for zero-config testnet browsing
  const [demoAddress, setDemoAddress] = useState<string | undefined>(undefined);
  const { data: balanceData } = useBalance({ address: (address || demoAddress) as any });

  const activeAccount = address || demoAddress;
  const activeChainId = isConnected ? chainId : 43113; // Default Avalanche Fuji (43113)

  const handleConnectWallet = (walletName: string) => {
    if (walletName === "Avalanche Fuji Demo Wallet") {
      setDemoAddress("0x71c7656ec7ab88b098defb751b7401b5f6d8976f");
    } else {
      setDemoAddress("0x71c7656ec7ab88b098defb751b7401b5f6d8976f");
    }
  };

  const handleDisconnectWallet = () => {
    if (isConnected) disconnect();
    setDemoAddress(undefined);
  };

  const handleSwitchNetwork = () => {
    if (switchChain) {
      switchChain({ chainId: 43113 });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-white selection:bg-primary selection:text-white">
      <NetworkSwitchBanner
        currentChainId={activeChainId}
        targetChainId={43113}
        onSwitch={handleSwitchNetwork}
        isSwitching={isSwitching}
      />
      <Navbar
        account={activeAccount}
        chainId={activeChainId}
        balance={balanceData?.formatted || "10.0"}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
        onSwitchNetwork={handleSwitchNetwork}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>Avalanche NFT Marketplace DApp | Decentralized AVAX Marketplace</title>
        <meta name="description" content="Discover, mint, buy and trade NFTs on the Avalanche C-Chain with sub-second finality and low gas fees." />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <MainContent>{children}</MainContent>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
