import { ethers } from "ethers";
import { config } from "../config/env";

export class BlockchainService {
  private static provider: ethers.JsonRpcProvider;

  public static getProvider(): ethers.JsonRpcProvider {
    if (!this.provider) {
      this.provider = new ethers.JsonRpcProvider(config.avalancheRpcUrl);
    }
    return this.provider;
  }

  /**
   * Verify token owner directly from Avalanche blockchain
   */
  public static async verifyOwnerOnChain(
    nftContractAddress: string,
    tokenId: number
  ): Promise<string | null> {
    try {
      const provider = this.getProvider();
      const abi = ["function ownerOf(uint256 tokenId) view returns (address)"];
      const contract = new ethers.Contract(nftContractAddress, abi, provider);
      const owner: string = await contract.ownerOf(tokenId);
      return owner.toLowerCase();
    } catch (err) {
      console.error(`Error verifying owner on chain for token ${tokenId}:`, err);
      return null;
    }
  }

  /**
   * Fetch current AVAX balance of wallet address
   */
  public static async getAvaxBalance(address: string): Promise<string> {
    try {
      const provider = this.getProvider();
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (err) {
      return "0.0";
    }
  }
}
