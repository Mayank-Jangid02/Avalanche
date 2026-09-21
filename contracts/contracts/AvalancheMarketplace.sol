// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AvalancheMarketplace
 * @dev Decentralized NFT Marketplace contract for Avalanche Blockchain
 */
contract AvalancheMarketplace is ReentrancyGuard, Ownable {
    struct Listing {
        bytes32 listingId;
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool active;
    }

    // Mapping from (nftContract => tokenId) => Listing
    mapping(address => mapping(uint256 => Listing)) private _listings;

    // Array of all listing IDs for enumeration
    bytes32[] private _allListingIds;

    // Marketplace fee percentage (e.g. 250 = 2.5%, base 10000)
    uint256 public marketplaceFeeBps = 250; 

    // Events
    event NFTListed(
        bytes32 indexed listingId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        uint256 price
    );

    event NFTSold(
        bytes32 indexed listingId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address buyer,
        uint256 price
    );

    event NFTListingCancelled(
        bytes32 indexed listingId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller
    );

    event NFTPriceUpdated(
        bytes32 indexed listingId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        uint256 oldPrice,
        uint256 newPrice
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Generate unique listing ID
     */
    function getListingId(address nftContract, uint256 tokenId) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(nftContract, tokenId));
    }

    /**
     * @dev Create a new marketplace listing for an NFT
     * @param nftContract Address of the ERC721 contract
     * @param tokenId ID of the token to list
     * @param price Price in AVAX (in wei)
     */
    function createListing(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external nonReentrant {
        require(price > 0, "Price must be greater than zero");
        IERC721 nft = IERC721(nftContract);

        require(nft.ownerOf(tokenId) == msg.sender, "Only NFT owner can list item");
        require(
            nft.getApproved(tokenId) == address(this) || nft.isApprovedForAll(msg.sender, address(this)),
            "Marketplace contract not approved to transfer NFT"
        );

        bytes32 listingId = getListingId(nftContract, tokenId);

        _listings[nftContract][tokenId] = Listing({
            listingId: listingId,
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            price: price,
            active: true
        });

        _allListingIds.push(listingId);

        emit NFTListed(listingId, nftContract, tokenId, msg.sender, price);
    }

    /**
     * @dev Cancel an active NFT listing
     */
    function cancelListing(address nftContract, uint256 tokenId) external nonReentrant {
        Listing storage listing = _listings[nftContract][tokenId];
        require(listing.active, "Listing does not exist or is inactive");
        require(listing.seller == msg.sender, "Only seller can cancel listing");

        listing.active = false;

        emit NFTListingCancelled(listing.listingId, nftContract, tokenId, msg.sender);
    }

    /**
     * @dev Update listing price
     */
    function updateListingPrice(
        address nftContract,
        uint256 tokenId,
        uint256 newPrice
    ) external nonReentrant {
        require(newPrice > 0, "Price must be greater than zero");
        Listing storage listing = _listings[nftContract][tokenId];

        require(listing.active, "Listing does not exist or is inactive");
        require(listing.seller == msg.sender, "Only seller can update price");
        require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "Seller no longer owns NFT");

        uint256 oldPrice = listing.price;
        listing.price = newPrice;

        emit NFTPriceUpdated(listing.listingId, nftContract, tokenId, msg.sender, oldPrice, newPrice);
    }

    /**
     * @dev Buy a listed NFT using AVAX
     */
    function buyNFT(address nftContract, uint256 tokenId) external payable nonReentrant {
        Listing storage listing = _listings[nftContract][tokenId];

        require(listing.active, "Listing is no longer active");
        require(listing.seller != msg.sender, "Seller cannot buy their own NFT");
        require(msg.value >= listing.price, "Insufficient AVAX sent for purchase");

        address seller = listing.seller;
        uint256 price = listing.price;
        bytes32 listingId = listing.listingId;

        // Verify seller still owns NFT
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == seller, "Seller no longer owns this NFT");

        // Checks-Effects-Interactions pattern: set inactive before transferring
        listing.active = false;

        // Calculate fee & payout
        uint256 feeAmount = (price * marketplaceFeeBps) / 10000;
        uint256 sellerPayout = price - feeAmount;

        // Transfer NFT to buyer
        nft.safeTransferFrom(seller, msg.sender, tokenId);

        // Transfer funds to seller
        (bool successSeller, ) = payable(seller).call{value: sellerPayout}("");
        require(successSeller, "Failed to send AVAX to seller");

        // Transfer marketplace fee to contract owner
        if (feeAmount > 0) {
            (bool successOwner, ) = payable(owner()).call{value: feeAmount}("");
            require(successOwner, "Failed to send fee to owner");
        }

        // Refund excess AVAX if any
        if (msg.value > price) {
            uint256 refund = msg.value - price;
            (bool successRefund, ) = payable(msg.sender).call{value: refund}("");
            require(successRefund, "Failed to refund excess AVAX");
        }

        emit NFTSold(listingId, nftContract, tokenId, seller, msg.sender, price);
    }

    /**
     * @dev Fetch listing details for a specific NFT
     */
    function getListing(address nftContract, uint256 tokenId) external view returns (Listing memory) {
        return _listings[nftContract][tokenId];
    }

    /**
     * @dev Update marketplace fee percentage (only owner)
     */
    function setMarketplaceFeeBps(uint256 _bps) external onlyOwner {
        require(_bps <= 1000, "Fee cannot exceed 10%");
        marketplaceFeeBps = _bps;
    }
}
