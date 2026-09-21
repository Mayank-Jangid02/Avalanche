import { Request, Response } from "express";
import { NFT } from "../models/NFT";
import { BlockchainService } from "../services/blockchain";
import { isDbConnected } from "../config/db";
import { config } from "../config/env";

// In-Memory fallback store for environments without live MongoDB daemon
const mockNFTs = [
  {
    tokenId: 1,
    contractAddress: config.nftContractAddress.toLowerCase(),
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
    createdAt: new Date(),
  },
  {
    tokenId: 2,
    contractAddress: config.nftContractAddress.toLowerCase(),
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
    createdAt: new Date(),
  },
  {
    tokenId: 3,
    contractAddress: config.nftContractAddress.toLowerCase(),
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
    createdAt: new Date(),
  },
  {
    tokenId: 4,
    contractAddress: config.nftContractAddress.toLowerCase(),
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
    createdAt: new Date(),
  },
];

export const getNFTs = async (req: Request, res: Response) => {
  try {
    const { category, search, minPrice, maxPrice, isListed, sortBy } = req.query;

    if (isDbConnected) {
      const query: any = {};
      if (category && category !== "All") query.category = category;
      if (isListed === "true") query.isListed = true;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      let sortOption: any = { createdAt: -1 };
      if (sortBy === "priceLowToHigh") sortOption = { price: 1 };
      if (sortBy === "priceHighToLow") sortOption = { price: -1 };
      if (sortBy === "recentlyListed") sortOption = { updatedAt: -1 };

      const nfts = await NFT.find(query).sort(sortOption);
      return res.json({ success: true, count: nfts.length, data: nfts });
    }

    // Fallback filter logic
    let result = [...mockNFTs];
    if (category && category !== "All") {
      result = result.filter((item) => item.category === category);
    }
    if (isListed === "true") {
      result = result.filter((item) => item.isListed);
    }
    if (search) {
      const s = String(search).toLowerCase();
      result = result.filter(
        (item) => item.name.toLowerCase().includes(s) || item.description.toLowerCase().includes(s)
      );
    }
    if (sortBy === "priceLowToHigh") {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === "priceHighToLow") {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    return res.json({ success: true, count: result.length, data: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getNFTById = async (req: Request, res: Response) => {
  try {
    const tokenId = Number(req.params.tokenId);

    if (isDbConnected) {
      const nft = await NFT.findOne({ tokenId });
      if (nft) {
        // Verify current owner directly from Avalanche blockchain
        const onChainOwner = await BlockchainService.verifyOwnerOnChain(nft.contractAddress, tokenId);
        if (onChainOwner && onChainOwner !== nft.currentOwner) {
          nft.currentOwner = onChainOwner;
          await nft.save();
        }
        return res.json({ success: true, data: nft });
      }
    }

    const mockItem = mockNFTs.find((item) => item.tokenId === tokenId);
    if (mockItem) {
      return res.json({ success: true, data: mockItem });
    }

    return res.status(404).json({ success: false, message: `NFT with tokenId ${tokenId} not found` });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getNFTsByOwner = async (req: Request, res: Response) => {
  try {
    const address = req.params.address.toLowerCase();

    if (isDbConnected) {
      const nfts = await NFT.find({ currentOwner: address });
      return res.json({ success: true, count: nfts.length, data: nfts });
    }

    const result = mockNFTs.filter((item) => item.currentOwner.toLowerCase() === address);
    return res.json({ success: true, count: result.length, data: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getNFTsByCreator = async (req: Request, res: Response) => {
  try {
    const address = req.params.address.toLowerCase();

    if (isDbConnected) {
      const nfts = await NFT.find({ creator: address });
      return res.json({ success: true, count: nfts.length, data: nfts });
    }

    const result = mockNFTs.filter((item) => item.creator.toLowerCase() === address);
    return res.json({ success: true, count: result.length, data: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createNFTIndex = async (req: Request, res: Response) => {
  try {
    const { tokenId, contractAddress, name, description, image, metadataURI, creator, category, attributes } = req.body;

    if (!tokenId || !contractAddress || !name || !image || !metadataURI || !creator) {
      return res.status(400).json({ success: false, message: "Missing required fields for NFT creation" });
    }

    const newNFT = {
      tokenId: Number(tokenId),
      contractAddress: contractAddress.toLowerCase(),
      name,
      description: description || "",
      image,
      metadataURI,
      creator: creator.toLowerCase(),
      currentOwner: creator.toLowerCase(),
      blockchain: "Avalanche Fuji Testnet",
      category: category || "Digital Art",
      attributes: attributes || [],
      isListed: false,
      price: "0",
    };

    if (isDbConnected) {
      const created = await NFT.create(newNFT);
      return res.status(201).json({ success: true, data: created });
    }

    mockNFTs.push({ ...newNFT, createdAt: new Date() } as any);
    return res.status(201).json({ success: true, data: newNFT });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
