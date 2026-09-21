// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AvalancheNFT
 * @dev ERC-721 NFT collection contract for Avalanche NFT Marketplace
 */
contract AvalancheNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    // Mapping from tokenId to original creator
    mapping(uint256 => address) private _creators;

    // Events
    event NFTMinted(
        uint256 indexed tokenId,
        address indexed creator,
        address indexed owner,
        string tokenURI
    );

    constructor() ERC721("Avalanche NFT Collection", "AVAXNFT") Ownable(msg.sender) {}

    /**
     * @dev Mint a new NFT with metadata tokenURI
     * @param recipient The wallet address receiving the minted NFT
     * @param _tokenURI The IPFS metadata URI for the NFT
     * @return uint256 The newly created tokenId
     */
    function mintNFT(address recipient, string memory _tokenURI)
        external
        returns (uint256)
    {
        require(bytes(_tokenURI).length > 0, "Token URI cannot be empty");
        require(recipient != address(0), "Invalid recipient address");

        _tokenIds++;
        uint256 newItemId = _tokenIds;

        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        _creators[newItemId] = msg.sender;

        emit NFTMinted(newItemId, msg.sender, recipient, _tokenURI);

        return newItemId;
    }

    /**
     * @dev Get creator of a given tokenId
     * @param tokenId The NFT token ID
     */
    function getCreator(uint256 tokenId) external view returns (address) {
        require(tokenId > 0 && tokenId <= _tokenIds, "Token ID does not exist");
        return _creators[tokenId];
    }

    /**
     * @dev Get total minted count
     */
    function getTotalMinted() external view returns (uint256) {
        return _tokenIds;
    }
}
