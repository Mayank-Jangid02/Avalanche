import { expect } from "chai";
import { ethers } from "hardhat";
import { AvalancheNFT, AvalancheMarketplace } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Avalanche NFT Marketplace Contracts", function () {
  let nftContract: AvalancheNFT;
  let marketplaceContract: AvalancheMarketplace;
  let owner: SignerWithAddress;
  let seller: SignerWithAddress;
  let buyer: SignerWithAddress;
  let stranger: SignerWithAddress;

  const sampleTokenURI = "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/metadata.json";
  const listingPrice = ethers.parseEther("2.5"); // 2.5 AVAX

  beforeEach(async function () {
    [owner, seller, buyer, stranger] = await ethers.getSigners();

    // Deploy NFT contract
    const NFTFactory = await ethers.getContractFactory("AvalancheNFT");
    nftContract = (await NFTFactory.deploy()) as AvalancheNFT;
    await nftContract.waitForDeployment();

    // Deploy Marketplace contract
    const MarketplaceFactory = await ethers.getContractFactory("AvalancheMarketplace");
    marketplaceContract = (await MarketplaceFactory.deploy()) as AvalancheMarketplace;
    await marketplaceContract.waitForDeployment();
  });

  describe("NFT Minting", function () {
    it("Should mint an NFT and assign correct owner, tokenURI, and creator", async function () {
      const tx = await nftContract.connect(seller).mintNFT(seller.address, sampleTokenURI);
      await tx.wait();

      expect(await nftContract.ownerOf(1)).to.equal(seller.address);
      expect(await nftContract.tokenURI(1)).to.equal(sampleTokenURI);
      expect(await nftContract.getCreator(1)).to.equal(seller.address);
      expect(await nftContract.getTotalMinted()).to.equal(1);
    });

    it("Should fail minting with an empty tokenURI", async function () {
      await expect(
        nftContract.connect(seller).mintNFT(seller.address, "")
      ).to.be.revertedWith("Token URI cannot be empty");
    });
  });

  describe("Marketplace Listing", function () {
    beforeEach(async function () {
      await nftContract.connect(seller).mintNFT(seller.address, sampleTokenURI);
    });

    it("Should list an NFT successfully when approved", async function () {
      await nftContract.connect(seller).approve(await marketplaceContract.getAddress(), 1);

      await expect(
        marketplaceContract.connect(seller).createListing(await nftContract.getAddress(), 1, listingPrice)
      )
        .to.emit(marketplaceContract, "NFTListed")
        .withArgs(
          await marketplaceContract.getListingId(await nftContract.getAddress(), 1),
          await nftContract.getAddress(),
          1,
          seller.address,
          listingPrice
        );

      const listing = await marketplaceContract.getListing(await nftContract.getAddress(), 1);
      expect(listing.seller).to.equal(seller.address);
      expect(listing.price).to.equal(listingPrice);
      expect(listing.active).to.be.true;
    });

    it("Should fail to list if marketplace is not approved", async function () {
      await expect(
        marketplaceContract.connect(seller).createListing(await nftContract.getAddress(), 1, listingPrice)
      ).to.be.revertedWith("Marketplace contract not approved to transfer NFT");
    });

    it("Should fail to list if price is zero", async function () {
      await nftContract.connect(seller).approve(await marketplaceContract.getAddress(), 1);
      await expect(
        marketplaceContract.connect(seller).createListing(await nftContract.getAddress(), 1, 0)
      ).to.be.revertedWith("Price must be greater than zero");
    });

    it("Should fail if non-owner attempts to list", async function () {
      await nftContract.connect(seller).approve(await marketplaceContract.getAddress(), 1);
      await expect(
        marketplaceContract.connect(stranger).createListing(await nftContract.getAddress(), 1, listingPrice)
      ).to.be.revertedWith("Only NFT owner can list item");
    });
  });

  describe("Listing Management (Update & Cancel)", function () {
    beforeEach(async function () {
      await nftContract.connect(seller).mintNFT(seller.address, sampleTokenURI);
      await nftContract.connect(seller).approve(await marketplaceContract.getAddress(), 1);
      await marketplaceContract.connect(seller).createListing(await nftContract.getAddress(), 1, listingPrice);
    });

    it("Should allow seller to update listing price", async function () {
      const newPrice = ethers.parseEther("3.0");
      await expect(
        marketplaceContract.connect(seller).updateListingPrice(await nftContract.getAddress(), 1, newPrice)
      )
        .to.emit(marketplaceContract, "NFTPriceUpdated")
        .withArgs(
          await marketplaceContract.getListingId(await nftContract.getAddress(), 1),
          await nftContract.getAddress(),
          1,
          seller.address,
          listingPrice,
          newPrice
        );

      const listing = await marketplaceContract.getListing(await nftContract.getAddress(), 1);
      expect(listing.price).to.equal(newPrice);
    });

    it("Should fail to update price if caller is not seller", async function () {
      await expect(
        marketplaceContract.connect(stranger).updateListingPrice(await nftContract.getAddress(), 1, ethers.parseEther("3.0"))
      ).to.be.revertedWith("Only seller can update price");
    });

    it("Should allow seller to cancel listing", async function () {
      await expect(
        marketplaceContract.connect(seller).cancelListing(await nftContract.getAddress(), 1)
      )
        .to.emit(marketplaceContract, "NFTListingCancelled")
        .withArgs(
          await marketplaceContract.getListingId(await nftContract.getAddress(), 1),
          await nftContract.getAddress(),
          1,
          seller.address
        );

      const listing = await marketplaceContract.getListing(await nftContract.getAddress(), 1);
      expect(listing.active).to.be.false;
    });

    it("Should fail to cancel listing if non-seller calls it", async function () {
      await expect(
        marketplaceContract.connect(stranger).cancelListing(await nftContract.getAddress(), 1)
      ).to.be.revertedWith("Only seller can cancel listing");
    });
  });

  describe("Buying NFTs", function () {
    beforeEach(async function () {
      await nftContract.connect(seller).mintNFT(seller.address, sampleTokenURI);
      await nftContract.connect(seller).approve(await marketplaceContract.getAddress(), 1);
      await marketplaceContract.connect(seller).createListing(await nftContract.getAddress(), 1, listingPrice);
    });

    it("Should successfully buy NFT and transfer payment + ownership", async function () {
      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);

      await expect(
        marketplaceContract.connect(buyer).buyNFT(await nftContract.getAddress(), 1, {
          value: listingPrice,
        })
      )
        .to.emit(marketplaceContract, "NFTSold")
        .withArgs(
          await marketplaceContract.getListingId(await nftContract.getAddress(), 1),
          await nftContract.getAddress(),
          1,
          seller.address,
          buyer.address,
          listingPrice
        );

      // Verify buyer now owns NFT
      expect(await nftContract.ownerOf(1)).to.equal(buyer.address);

      // Verify listing is inactive
      const listing = await marketplaceContract.getListing(await nftContract.getAddress(), 1);
      expect(listing.active).to.be.false;

      // Verify seller received payout (minus 2.5% fee)
      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
      const fee = (listingPrice * 250n) / 10000n; // 2.5%
      const expectedPayout = listingPrice - fee;
      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(expectedPayout);
    });

    it("Should fail buying if insufficient AVAX sent", async function () {
      await expect(
        marketplaceContract.connect(buyer).buyNFT(await nftContract.getAddress(), 1, {
          value: ethers.parseEther("1.0"),
        })
      ).to.be.revertedWith("Insufficient AVAX sent for purchase");
    });

    it("Should fail if seller attempts to buy their own NFT", async function () {
      await expect(
        marketplaceContract.connect(seller).buyNFT(await nftContract.getAddress(), 1, {
          value: listingPrice,
        })
      ).to.be.revertedWith("Seller cannot buy their own NFT");
    });

    it("Should fail if trying to buy an already sold / inactive listing", async function () {
      // First purchase
      await marketplaceContract.connect(buyer).buyNFT(await nftContract.getAddress(), 1, {
        value: listingPrice,
      });

      // Second attempt
      await expect(
        marketplaceContract.connect(stranger).buyNFT(await nftContract.getAddress(), 1, {
          value: listingPrice,
        })
      ).to.be.revertedWith("Listing is no longer active");
    });
  });
});
