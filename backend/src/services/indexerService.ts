import { ethers } from "ethers";
import { config } from "../config/env";
import { BlockchainService } from "./blockchain";
import { NFT } from "../models/NFT";
import { Listing } from "../models/Listing";
import { Activity } from "../models/Activity";
import { User } from "../models/User";
import { isDbConnected } from "../config/db";

const AvalancheNFT_ABI = [
  "event NFTMinted(uint256 indexed tokenId, address indexed creator, address indexed owner, string tokenURI)",
];

const AvalancheMarketplace_ABI = [
  "event NFTListed(bytes32 indexed listingId, address indexed nftContract, uint256 indexed tokenId, address seller, uint256 price)",
  "event NFTSold(bytes32 indexed listingId, address indexed nftContract, uint256 indexed tokenId, address seller, address buyer, uint256 price)",
  "event NFTListingCancelled(bytes32 indexed listingId, address indexed nftContract, uint256 indexed tokenId, address seller)",
  "event NFTPriceUpdated(bytes32 indexed listingId, address indexed nftContract, uint256 indexed tokenId, address seller, uint256 oldPrice, uint256 newPrice)",
];

export class IndexerService {
  private static isListening = false;

  public static async startIndexing(): Promise<void> {
    if (this.isListening) return;

    const nftAddress = config.nftContractAddress;
    const marketplaceAddress = config.marketplaceContractAddress;

    if (
      nftAddress === "0x0000000000000000000000000000000000000000" ||
      marketplaceAddress === "0x0000000000000000000000000000000000000000"
    ) {
      console.log("Indexer: Contract addresses not set in environment. Waiting for deployment sync.");
      return;
    }

    try {
      const provider = BlockchainService.getProvider();

      const nftContract = new ethers.Contract(nftAddress, AvalancheNFT_ABI, provider);
      const marketplaceContract = new ethers.Contract(marketplaceAddress, AvalancheMarketplace_ABI, provider);

      // Listen for NFTMinted
      nftContract.on("NFTMinted", async (tokenId, creator, owner, tokenURI, event) => {
        console.log(`[Indexer] Event NFTMinted: Token #${tokenId} by ${creator}`);
        await this.handleNFTMinted(
          Number(tokenId),
          nftAddress.toLowerCase(),
          creator.toLowerCase(),
          owner.toLowerCase(),
          tokenURI,
          event?.log?.transactionHash || ""
        );
      });

      // Listen for NFTListed
      marketplaceContract.on("NFTListed", async (listingId, nftContractAddr, tokenId, seller, price, event) => {
        console.log(`[Indexer] Event NFTListed: Token #${tokenId} listed for ${ethers.formatEther(price)} AVAX`);
        await this.handleNFTListed(
          listingId,
          nftContractAddr.toLowerCase(),
          Number(tokenId),
          seller.toLowerCase(),
          ethers.formatEther(price),
          event?.log?.transactionHash || ""
        );
      });

      // Listen for NFTSold
      marketplaceContract.on("NFTSold", async (listingId, nftContractAddr, tokenId, seller, buyer, price, event) => {
        console.log(`[Indexer] Event NFTSold: Token #${tokenId} bought by ${buyer}`);
        await this.handleNFTSold(
          listingId,
          nftContractAddr.toLowerCase(),
          Number(tokenId),
          seller.toLowerCase(),
          buyer.toLowerCase(),
          ethers.formatEther(price),
          event?.log?.transactionHash || ""
        );
      });

      // Listen for NFTListingCancelled
      marketplaceContract.on("NFTListingCancelled", async (listingId, nftContractAddr, tokenId, seller, event) => {
        console.log(`[Indexer] Event NFTListingCancelled: Token #${tokenId}`);
        await this.handleNFTListingCancelled(
          listingId,
          nftContractAddr.toLowerCase(),
          Number(tokenId),
          event?.log?.transactionHash || ""
        );
      });

      // Listen for NFTPriceUpdated
      marketplaceContract.on("NFTPriceUpdated", async (listingId, nftContractAddr, tokenId, seller, oldPrice, newPrice, event) => {
        console.log(`[Indexer] Event NFTPriceUpdated: Token #${tokenId} updated to ${ethers.formatEther(newPrice)} AVAX`);
        await this.handleNFTPriceUpdated(
          listingId,
          nftContractAddr.toLowerCase(),
          Number(tokenId),
          ethers.formatEther(newPrice),
          event?.log?.transactionHash || ""
        );
      });

      this.isListening = true;
      console.log("Blockchain Event Indexer successfully connected to Avalanche RPC.");
    } catch (err) {
      console.error("Failed to start blockchain indexer service:", err);
    }
  }

  // --- Handlers ---

  public static async handleNFTMinted(
    tokenId: number,
    contractAddress: string,
    creator: string,
    owner: string,
    metadataURI: string,
    transactionHash: string
  ) {
    if (!isDbConnected) return;
    try {
      // Ensure user records exist
      await User.updateOne({ walletAddress: creator }, { walletAddress: creator }, { upsert: true });
      await User.updateOne({ walletAddress: owner }, { walletAddress: owner }, { upsert: true });

      // Upsert NFT document
      await NFT.findOneAndUpdate(
        { contractAddress, tokenId },
        {
          tokenId,
          contractAddress,
          name: `Avalanche NFT #${tokenId}`,
          description: "Unique digital collectible minted on Avalanche Fuji Testnet.",
          image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
          metadataURI,
          creator,
          currentOwner: owner,
          blockchain: "Avalanche Fuji Testnet",
          category: "Digital Art",
          isListed: false,
          price: "0",
        },
        { upsert: true, new: true }
      );

      // Record Activity
      await Activity.create({
        type: "MINTED",
        nftContract: contractAddress,
        tokenId,
        from: creator,
        to: owner,
        price: "0",
        transactionHash,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error("Error indexing NFTMinted:", err);
    }
  }

  public static async handleNFTListed(
    listingId: string,
    contractAddress: string,
    tokenId: number,
    seller: string,
    price: string,
    transactionHash: string
  ) {
    if (!isDbConnected) return;
    try {
      await Listing.findOneAndUpdate(
        { listingId },
        {
          listingId,
          nftContract: contractAddress,
          tokenId,
          seller,
          price,
          status: "ACTIVE",
          transactionHash,
        },
        { upsert: true }
      );

      await NFT.findOneAndUpdate(
        { contractAddress, tokenId },
        { isListed: true, price }
      );

      await Activity.create({
        type: "LISTED",
        nftContract: contractAddress,
        tokenId,
        from: seller,
        price,
        transactionHash,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error("Error indexing NFTListed:", err);
    }
  }

  public static async handleNFTSold(
    listingId: string,
    contractAddress: string,
    tokenId: number,
    seller: string,
    buyer: string,
    price: string,
    transactionHash: string
  ) {
    if (!isDbConnected) return;
    try {
      await Listing.findOneAndUpdate(
        { listingId },
        { status: "SOLD", transactionHash }
      );

      await NFT.findOneAndUpdate(
        { contractAddress, tokenId },
        { currentOwner: buyer, isListed: false, price: "0" }
      );

      await Activity.create({
        type: "SOLD",
        nftContract: contractAddress,
        tokenId,
        from: seller,
        to: buyer,
        price,
        transactionHash,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error("Error indexing NFTSold:", err);
    }
  }

  public static async handleNFTListingCancelled(
    listingId: string,
    contractAddress: string,
    tokenId: number,
    transactionHash: string
  ) {
    if (!isDbConnected) return;
    try {
      await Listing.findOneAndUpdate(
        { listingId },
        { status: "CANCELLED", transactionHash }
      );

      await NFT.findOneAndUpdate(
        { contractAddress, tokenId },
        { isListed: false, price: "0" }
      );

      await Activity.create({
        type: "CANCELLED",
        nftContract: contractAddress,
        tokenId,
        transactionHash,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error("Error indexing NFTListingCancelled:", err);
    }
  }

  public static async handleNFTPriceUpdated(
    listingId: string,
    contractAddress: string,
    tokenId: number,
    newPrice: string,
    transactionHash: string
  ) {
    if (!isDbConnected) return;
    try {
      await Listing.findOneAndUpdate(
        { listingId },
        { price: newPrice, transactionHash }
      );

      await NFT.findOneAndUpdate(
        { contractAddress, tokenId },
        { price: newPrice }
      );

      await Activity.create({
        type: "PRICE_UPDATED",
        nftContract: contractAddress,
        tokenId,
        price: newPrice,
        transactionHash,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error("Error indexing NFTPriceUpdated:", err);
    }
  }
}
