import deployedData from "./deployed-contracts.json";

export const NFT_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS ||
  deployedData?.nftContract ||
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const MARKETPLACE_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS ||
  deployedData?.marketplaceContract ||
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export const AVALANCHE_FUJI_CHAIN_ID = 43113;

export const AvalancheNFT_ABI = [
  "function mintNFT(address recipient, string memory tokenURI) external returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string memory)",
  "function getCreator(uint256 tokenId) view returns (address)",
  "function approve(address to, uint256 tokenId) external",
  "function getApproved(uint256 tokenId) view returns (address)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function setApprovalForAll(address operator, bool approved) external",
  "event NFTMinted(uint256 indexed tokenId, address indexed creator, address indexed owner, string tokenURI)",
] as const;

export const AvalancheMarketplace_ABI = [
  "function createListing(address nftContract, uint256 tokenId, uint256 price) external",
  "function cancelListing(address nftContract, uint256 tokenId) external",
  "function updateListingPrice(address nftContract, uint256 tokenId, uint256 newPrice) external",
  "function buyNFT(address nftContract, uint256 tokenId) external payable",
  "function getListing(address nftContract, uint256 tokenId) view returns (tuple(bytes32 listingId, address seller, address nftContract, uint256 tokenId, uint256 price, bool active))",
  "function getListingId(address nftContract, uint256 tokenId) pure returns (bytes32)",
  "event NFTListed(bytes32 indexed listingId, address indexed nftContract, uint256 indexed tokenId, address seller, uint256 price)",
  "event NFTSold(bytes32 indexed listingId, address indexed nftContract, uint256 indexed tokenId, address seller, address buyer, uint256 price)",
  "event NFTListingCancelled(bytes32 indexed listingId, address indexed nftContract, uint256 indexed tokenId, address seller)",
  "event NFTPriceUpdated(bytes32 indexed listingId, address indexed nftContract, uint256 indexed tokenId, address seller, uint256 oldPrice, uint256 newPrice)",
] as const;
