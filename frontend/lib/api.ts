import { NFTItem, ListingItem, UserProfile, ActivityItem } from "../types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export class ApiService {
  public static async fetchNFTs(params?: {
    category?: string;
    search?: string;
    isListed?: boolean;
    sortBy?: string;
  }): Promise<NFTItem[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category) query.append("category", params.category);
      if (params?.search) query.append("search", params.search);
      if (params?.isListed !== undefined) query.append("isListed", String(params.isListed));
      if (params?.sortBy) query.append("sortBy", params.sortBy);

      const res = await fetch(`${BACKEND_URL}/api/nfts?${query.toString()}`);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      console.error("API error fetching NFTs:", err);
      return [];
    }
  }

  public static async fetchNFTById(tokenId: number): Promise<NFTItem | null> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/nfts/${tokenId}`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.error(`API error fetching NFT #${tokenId}:`, err);
      return null;
    }
  }

  public static async fetchNFTsByOwner(address: string): Promise<NFTItem[]> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/nfts/owner/${address}`);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      return [];
    }
  }

  public static async fetchNFTsByCreator(address: string): Promise<NFTItem[]> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/nfts/creator/${address}`);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      return [];
    }
  }

  public static async indexNFT(nftData: Partial<NFTItem>): Promise<boolean> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/nfts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nftData),
      });
      const data = await res.json();
      return data.success;
    } catch (err) {
      return false;
    }
  }

  public static async fetchUserProfile(address: string): Promise<UserProfile | null> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/${address}`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      return null;
    }
  }

  public static async updateUserProfile(address: string, profile: Partial<UserProfile>): Promise<boolean> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/${address}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      return data.success;
    } catch (err) {
      return false;
    }
  }

  public static async fetchActivity(params?: { tokenId?: number; address?: string }): Promise<ActivityItem[]> {
    try {
      const query = new URLSearchParams();
      if (params?.tokenId) query.append("tokenId", String(params.tokenId));
      if (params?.address) query.append("address", params.address);

      const res = await fetch(`${BACKEND_URL}/api/activity?${query.toString()}`);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      return [];
    }
  }
}
