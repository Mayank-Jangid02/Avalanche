export interface Attribute {
  trait_type: string;
  value: string | number;
}

export interface NFTItem {
  tokenId: number;
  contractAddress: string;
  name: string;
  description: string;
  image: string;
  metadataURI: string;
  creator: string;
  currentOwner: string;
  blockchain: string;
  category: string;
  attributes: Attribute[];
  isListed: boolean;
  price?: string;
  createdAt?: string;
}

export interface ListingItem {
  listingId: string;
  nftContract: string;
  tokenId: number;
  seller: string;
  price: string;
  transactionHash?: string;
  status: "ACTIVE" | "SOLD" | "CANCELLED";
  createdAt?: string;
}

export interface UserProfile {
  walletAddress: string;
  username: string;
  bio?: string;
  profileImage?: string;
  bannerImage?: string;
  createdAt?: string;
}

export interface ActivityItem {
  type: "MINTED" | "LISTED" | "SOLD" | "CANCELLED" | "PRICE_UPDATED" | "TRANSFER";
  nftContract: string;
  tokenId: number;
  from?: string;
  to?: string;
  price?: string;
  transactionHash?: string;
  timestamp: string;
}
