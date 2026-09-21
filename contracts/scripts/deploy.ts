import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Starting deployment of Avalanche NFT Marketplace contracts...");

  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Account balance: ${ethers.formatEther(balance)} AVAX`);

  // 1. Deploy AvalancheNFT contract
  console.log("Deploying AvalancheNFT...");
  const AvalancheNFTFactory = await ethers.getContractFactory("AvalancheNFT");
  const nftContract = await AvalancheNFTFactory.deploy();
  await nftContract.waitForDeployment();
  const nftAddress = await nftContract.getAddress();
  console.log(`AvalancheNFT deployed to: ${nftAddress}`);

  // 2. Deploy AvalancheMarketplace contract
  console.log("Deploying AvalancheMarketplace...");
  const AvalancheMarketplaceFactory = await ethers.getContractFactory("AvalancheMarketplace");
  const marketplaceContract = await AvalancheMarketplaceFactory.deploy();
  await marketplaceContract.waitForDeployment();
  const marketplaceAddress = await marketplaceContract.getAddress();
  console.log(`AvalancheMarketplace deployed to: ${marketplaceAddress}`);

  // Save deployed addresses to JSON artifact
  const deploymentData = {
    network: "Avalanche Fuji Testnet",
    chainId: 43113,
    nftContract: nftAddress,
    marketplaceContract: marketplaceAddress,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
  };

  const artifactPath = path.join(__dirname, "../deployed-contracts.json");
  fs.writeFileSync(artifactPath, JSON.stringify(deploymentData, null, 2));
  console.log(`Deployment configuration saved to ${artifactPath}`);

  // Update backend config/contracts.json if directory exists
  const backendConfigDir = path.join(__dirname, "../../backend/src/config");
  if (fs.existsSync(backendConfigDir)) {
    fs.writeFileSync(
      path.join(backendConfigDir, "deployed-contracts.json"),
      JSON.stringify(deploymentData, null, 2)
    );
    console.log("Synced deployment address to backend configuration.");
  }

  // Update frontend config if directory exists
  const frontendConfigDir = path.join(__dirname, "../../frontend/lib");
  if (fs.existsSync(frontendConfigDir)) {
    fs.writeFileSync(
      path.join(frontendConfigDir, "deployed-contracts.json"),
      JSON.stringify(deploymentData, null, 2)
    );
    console.log("Synced deployment address to frontend configuration.");
  }

  console.log("\nDeployment completed successfully!");
}

main().catch((error) => {
  console.error("Error during deployment:", error);
  process.exitCode = 1;
});
