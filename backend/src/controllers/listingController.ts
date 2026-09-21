import { Request, Response } from "express";
import { Listing } from "../models/Listing";
import { isDbConnected } from "../config/db";
import { config } from "../config/env";

const mockListings = [
  {
    listingId: "0x1111111111111111111111111111111111111111111111111111111111111111",
    nftContract: config.nftContractAddress.toLowerCase(),
    tokenId: 1,
    seller: "0x71c7656ec7ab88b098defb751b7401b5f6d8976f",
    price: "4.5",
    status: "ACTIVE",
    createdAt: new Date(),
  },
  {
    listingId: "0x2222222222222222222222222222222222222222222222222222222222222222",
    nftContract: config.nftContractAddress.toLowerCase(),
    tokenId: 2,
    seller: "0x3c44cdedd6a362e12057242905b5259473427546",
    price: "8.2",
    status: "ACTIVE",
    createdAt: new Date(),
  },
  {
    listingId: "0x3333333333333333333333333333333333333333333333333333333333333333",
    nftContract: config.nftContractAddress.toLowerCase(),
    tokenId: 3,
    seller: "0x71c7656ec7ab88b098defb751b7401b5f6d8976f",
    price: "2.0",
    status: "ACTIVE",
    createdAt: new Date(),
  },
];

export const getListings = async (req: Request, res: Response) => {
  try {
    const { status = "ACTIVE" } = req.query;

    if (isDbConnected) {
      const listings = await Listing.find({ status: String(status) }).sort({ createdAt: -1 });
      return res.json({ success: true, count: listings.length, data: listings });
    }

    const result = mockListings.filter((l) => l.status === status);
    return res.json({ success: true, count: result.length, data: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getListingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isDbConnected) {
      const listing = await Listing.findOne({ listingId: id });
      if (listing) return res.json({ success: true, data: listing });
    }

    const mockItem = mockListings.find((l) => l.listingId === id);
    if (mockItem) return res.json({ success: true, data: mockItem });

    return res.status(404).json({ success: false, message: "Listing not found" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
