import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/avalanche-nft-marketplace",
  avalancheRpcUrl: process.env.AVALANCHE_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc",
  chainId: Number(process.env.CHAIN_ID || 43113),
  nftContractAddress: process.env.NFT_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
  marketplaceContractAddress: process.env.MARKETPLACE_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
  ipfsApiKey: process.env.IPFS_API_KEY || "",
  ipfsApiSecret: process.env.IPFS_API_SECRET || "",
  pinataJwt: process.env.PINATA_JWT || "",
};
