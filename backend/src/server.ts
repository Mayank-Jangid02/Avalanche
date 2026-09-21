import express, { Request, Response } from "express";
import cors from "cors";
import { config } from "./config/env";
import { connectDB } from "./config/db";
import { IndexerService } from "./services/indexerService";
import nftRoutes from "./routes/nftRoutes";
import listingRoutes from "./routes/listingRoutes";
import userRoutes from "./routes/userRoutes";
import activityRoutes from "./routes/activityRoutes";
import ipfsRoutes from "./routes/ipfsRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// API Routes
app.use("/api/nfts", nftRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/ipfs", ipfsRoutes);

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    network: "Avalanche Fuji Testnet",
    chainId: config.chainId,
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler
app.use(errorHandler);

const startServer = async () => {
  // Connect MongoDB
  await connectDB();

  // Start Blockchain Event Indexer
  IndexerService.startIndexing();

  app.listen(config.port, () => {
    console.log(`====================================================`);
    console.log(`Avalanche NFT Marketplace API running on port ${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`RPC Provider: ${config.avalancheRpcUrl}`);
    console.log(`====================================================`);
  });
};

startServer();
