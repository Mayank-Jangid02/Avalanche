# Avalanche NFT Marketplace DApp

A complete, modern, production-grade **Decentralized NFT Marketplace DApp** built on the **Avalanche Blockchain** (Fuji Testnet & Mainnet ready).

The application features smart contracts written in Solidity (ERC-721 + Marketplace with ReentrancyGuard), an Express.js + TypeScript + MongoDB backend with a real-time blockchain event indexer, and a Next.js 14 App Router Web3 frontend.

---

## 🌟 Key Features

* **Wallet Integration**: Automatic detection of MetaMask, Coinbase Wallet, WalletConnect, and Fuji Testnet network state with interactive network switcher (`Chain ID: 43113`).
* **NFT Creation / Minting**: Upload artwork to IPFS, generate metadata JSON, and execute ERC-721 `mintNFT()` on Avalanche C-Chain with multi-stage progress tracking.
* **Marketplace Trading**: List NFTs for fixed AVAX price, buy NFTs directly, update listing prices, or cancel active listings with safe transfer checks and ReentrancyGuard.
* **Blockchain Event Indexer**: Real-time server-side event listener (`NFTMinted`, `NFTListed`, `NFTSold`, `NFTListingCancelled`, `NFTPriceUpdated`) synchronizing MongoDB off-chain database while preserving blockchain as source of truth.
* **Personal Portfolio Dashboard**: View owned, created, listed, and sold NFTs with volume metrics and complete transaction activity history logs.
* **Search & Filters**: Search NFTs by title or description, filter by category (Digital Art, Gaming, Collectibles, Music, Photography), and sort by price or recency.

---

## 🏗️ Architecture & Tech Stack

```
                               ┌────────────────────────────────────────┐
                               │           Avalanche C-Chain            │
                               │  (AvalancheNFT & Marketplace Contracts)│
                               └──────────────────┬─────────────────────┘
                                                  │
                                                  │ Real-time Event Listener & RPC
                                                  ▼
┌─────────────────────────┐              ┌─────────────────────────────────────┐
│  Next.js 14 Web3 App    │ ───────────► │  Express.js + TypeScript Backend    │
│  (wagmi, viem, Tailwind)│  REST API    │  (MongoDB, IPFS Service, Indexer)   │
└─────────────────────────┘              └─────────────────────────────────────┘
```

### Stack Breakdown
- **Smart Contracts**: Solidity `0.8.24`, OpenZeppelin 5.x (`ERC721URIStorage`, `ReentrancyGuard`, `Ownable`), Hardhat, Ethers.js v6.
- **Backend API & Indexer**: Node.js, Express.js, TypeScript, MongoDB (Mongoose), Ethers.js RPC provider, Pinata IPFS Service abstraction.
- **Frontend DApp**: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, wagmi v2, viem, Lucide React, Framer Motion.

---

## 📁 Repository Structure

```
avalanche-nft-marketplace/
├── contracts/               # Hardhat project (Solidity contracts, scripts, tests)
│   ├── contracts/
│   │   ├── AvalancheNFT.sol          # ERC-721 URIStorage implementation
│   │   └── AvalancheMarketplace.sol  # Marketplace trading contract
│   ├── scripts/
│   │   └── deploy.ts                 # Fuji/Local deployment script
│   ├── test/
│   │   └── Marketplace.test.ts       # Hardhat test suite (14 test cases)
│   ├── hardhat.config.ts             # Hardhat network & compiler configuration
│   └── package.json
├── backend/                 # Express + TypeScript API Server & Event Indexer
│   ├── src/
│   │   ├── config/          # Environment variables & MongoDB connection
│   │   ├── controllers/     # REST controllers (NFTs, Listings, Users, Activity)
│   │   ├── models/          # Mongoose schemas (User, NFT, Listing, Activity)
│   │   ├── routes/          # Express API route handlers
│   │   ├── services/        # IPFS abstraction, Blockchain reader, Indexer service
│   │   └── server.ts        # Server entry point
│   └── package.json
├── frontend/                # Next.js 14 Web3 Frontend DApp
│   ├── app/                 # Next.js App Router pages (Home, Explore, NFT, Create, Profile, Dashboard)
│   ├── components/          # Reusable UI components & Web3 modals
│   ├── lib/                 # Wagmi config, contract ABIs, API client, IPFS helper
│   └── package.json
├── .env.example             # Centralized environment template
└── README.md
```

---

## ⚙️ Prerequisites & Setup

### 1. Prerequisites
* **Node.js**: `v18.x` or `v20.x`
* **npm**: `v9.x` or `v10.x`
* **MongoDB**: Local MongoDB daemon (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI (Note: The backend includes fallback logic so it runs cleanly out of the box even without an active local MongoDB instance).
* **MetaMask Wallet**: Installed in your web browser.

### 2. Configure Avalanche Fuji Testnet in MetaMask
If Fuji Testnet is not already in your wallet, add a custom network with:
* **Network Name**: Avalanche Fuji Testnet
* **RPC URL**: `https://api.avax-test.network/ext/bc/C/rpc`
* **Chain ID**: `43113`
* **Currency Symbol**: `AVAX`
* **Block Explorer**: `https://subnets.avax.network/c-chain`

### 3. Obtain Free Testnet AVAX
Get free Fuji testnet AVAX from the official Avalanche Faucet:
* Visit [Avalanche Faucet](https://core.app/tools/testnet-faucet/?subnet=c&token=c)
* Paste your wallet address and request testnet AVAX.

---

## 🚀 Quick Start Guide (Windows PowerShell Commands)

### Step 1: Clone & Configure Environment Variables
Copy `.env.example` to create your local `.env` file:

```powershell
# In project root
Copy-Item .env.example .env
```

### Step 2: Compile & Test Smart Contracts
Navigate to `contracts/`, install dependencies, run unit tests, and execute local deployment:

```powershell
# Open terminal for contracts
cd contracts
npm install
npm test
npx hardhat run scripts/deploy.ts
cd ..
```

### Step 3: Start Backend API & Indexer Service
In a new terminal window, start the Express backend server:

```powershell
# Open terminal for backend
cd backend
npm install
npm run dev
```
The API server will run on `http://localhost:5000`.

### Step 4: Start Frontend Next.js Web3 DApp
In a new terminal window, start the Next.js development server:

```powershell
# Open terminal for frontend
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 🧪 Testing NFT Minting & Buying Flow

1. **Connect Wallet**: Click **Connect Wallet** in the top right header. Select MetaMask or the Avalanche Fuji Demo Wallet.
2. **Switch Network**: If prompted with the red network banner, click **Switch to Avalanche Fuji Testnet**.
3. **Mint an NFT**:
   * Navigate to `/create` (Create NFT).
   * Upload an artwork image and enter a title, description, and attributes.
   * Click **Mint NFT to Avalanche**.
   * Observe progress stages (Uploading image -> Uploading metadata -> Confirming wallet transaction -> Minting token).
4. **List NFT for Sale**:
   * Open your newly created NFT detail page or go to `/dashboard`.
   * Click **List for Sale**, set a price in AVAX (e.g. `2.5 AVAX`), and approve the listing.
5. **Buy an NFT**:
   * Switch to another wallet address or explore active listings.
   * Click **Buy Now** on any active NFT card to open the purchase modal with price & fee breakdown.
   * Confirm purchase to transfer AVAX to seller and transfer NFT ownership to buyer.

---

## 🌐 Switching from Fuji Testnet to Avalanche Mainnet

To deploy and run on Avalanche Mainnet:
1. Update `contracts/hardhat.config.ts` network configuration with your Mainnet private key.
2. Deploy contracts to Avalanche Mainnet:
   ```powershell
   cd contracts
   npx hardhat run scripts/deploy.ts --network mainnet
   ```
3. Update `.env` variables with deployed contract addresses and set:
   ```env
   NEXT_PUBLIC_CHAIN_ID=43114
   NEXT_PUBLIC_AVALANCHE_RPC_URL=https://api.avax.network/ext/bc/C/rpc
   ```

---

## 🔒 Security Best Practices

* **ReentrancyGuard**: Marketplace smart contracts inherit OpenZeppelin `ReentrancyGuard` and follow the Checks-Effects-Interactions pattern.
* **Access Controls**: Only verified NFT owners can approve, list, or update item prices.
* **On-Chain Truth**: Off-chain MongoDB database caches metadata, search indexes, and activity logs, but ownership verification is always evaluated live against Avalanche RPC (`ownerOf()`).
* **Secret Protection**: Private keys are strictly confined to server-side deployment scripts and never exposed in frontend code.

---

## 📜 License
MIT License. Free for development, extension, and deployment on Avalanche C-Chain.
