import mongoose from "mongoose";
import { config } from "./env";
import { NFT } from "../models/NFT";
import { Listing } from "../models/Listing";
import { Activity } from "../models/Activity";
import { User } from "../models/User";

export let isDbConnected = false;

const initialSeedNFTs = [
  {
    tokenId: 1,
    contractAddress: (process.env.NFT_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3").toLowerCase(),
    name: "Sub-Zero Avalanche Dragon",
    description: "A legendary dragon forged in the sub-zero peaks of the Avalanche C-Chain network.",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
    metadataURI: "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/1.json",
    creator: "0x71c7656ec7ab88b098defb751b7401b5f6d8976f",
    currentOwner: "0x71c7656ec7ab88b098defb751b7401b5f6d8976f",
    blockchain: "Avalanche Fuji Testnet",
    category: "Digital Art",
    attributes: [
      { trait_type: "Rarity", value: "Legendary" },
      { trait_type: "Element", value: "Glacier Ice" },
      { trait_type: "Speed", value: "98/100" },
    ],
    isListed: true,
    price: "4.5",
  },
  {
    tokenId: 2,
    contractAddress: (process.env.NFT_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3").toLowerCase(),
    name: "Cybernetic AVAX Warrior",
    description: "Futuristic android operating with sub-second finality on Avalanche consensus.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    metadataURI: "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/2.json",
    creator: "0x3c44cdedd6a362e12057242905b5259473427546",
    currentOwner: "0x3c44cdedd6a362e12057242905b5259473427546",
    blockchain: "Avalanche Fuji Testnet",
    category: "Gaming",
    attributes: [
      { trait_type: "Armor", value: "Titanium" },
      { trait_type: "Class", value: "Cyberpunk" },
    ],
    isListed: true,
    price: "8.2",
  },
  {
    tokenId: 3,
    contractAddress: (process.env.NFT_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3").toLowerCase(),
    name: "Red Peak Crystal Citadel",
    description: "Abstract architectural masterpiece celebrating the peaks of the Avalanche ecosystem.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
    metadataURI: "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/3.json",
    creator: "0x71c7656ec7ab88b098defb751b7401b5f6d8976f",
    currentOwner: "0x71c7656ec7ab88b098defb751b7401b5f6d8976f",
    blockchain: "Avalanche Fuji Testnet",
    category: "Photography",
    attributes: [
      { trait_type: "Biome", value: "Red Mountain" },
      { trait_type: "Resolution", value: "8K Ultra" },
    ],
    isListed: true,
    price: "2.0",
  },
  {
    tokenId: 4,
    contractAddress: (process.env.NFT_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3").toLowerCase(),
    name: "Genesis Avalanche Cube",
    description: "Interactive 3D geometry representing block verification on Avalanche.",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80",
    metadataURI: "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/4.json",
    creator: "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
    currentOwner: "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
    blockchain: "Avalanche Fuji Testnet",
    category: "Collectibles",
    attributes: [
      { trait_type: "Edition", value: "Genesis #001" },
    ],
    isListed: false,
    price: "0",
  },
];

export const seedDatabase = async () => {
  try {
    const nftCount = await NFT.countDocuments();
    if (nftCount === 0) {
      console.log("Seeding initial Avalanche NFT collection into MongoDB...");
      await NFT.insertMany(initialSeedNFTs);

      await Listing.create({
        listingId: "0x1111111111111111111111111111111111111111111111111111111111111111",
        nftContract: initialSeedNFTs[0].contractAddress,
        tokenId: 1,
        seller: initialSeedNFTs[0].creator,
        price: "4.5",
        status: "ACTIVE",
      });

      await Listing.create({
        listingId: "0x2222222222222222222222222222222222222222222222222222222222222222",
        nftContract: initialSeedNFTs[1].contractAddress,
        tokenId: 2,
        seller: initialSeedNFTs[1].creator,
        price: "8.2",
        status: "ACTIVE",
      });

      await Activity.create({
        type: "MINTED",
        nftContract: initialSeedNFTs[0].contractAddress,
        tokenId: 1,
        from: initialSeedNFTs[0].creator,
        to: initialSeedNFTs[0].creator,
        price: "0",
        timestamp: new Date(),
      });

      await Activity.create({
        type: "LISTED",
        nftContract: initialSeedNFTs[0].contractAddress,
        tokenId: 1,
        from: initialSeedNFTs[0].creator,
        price: "4.5",
        timestamp: new Date(),
      });

      console.log("Database seeded successfully with initial NFTs and listings.");
    }
  } catch (err: any) {
    console.error("Error seeding database:", err.message);
  }
};

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isDbConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedDatabase();
  } catch (error: any) {
    console.warn(`MongoDB Connection Warning: ${error.message}`);
    console.warn("Operating in hybrid memory-resilient mode for local development.");
    isDbConnected = false;
  }
};
