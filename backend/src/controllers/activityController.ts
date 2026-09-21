import { Request, Response } from "express";
import { Activity } from "../models/Activity";
import { isDbConnected } from "../config/db";
import { config } from "../config/env";

const mockActivities = [
  {
    type: "SOLD",
    nftContract: config.nftContractAddress.toLowerCase(),
    tokenId: 1,
    from: "0x71c7656ec7ab88b098defb751b7401b5f6d8976f",
    to: "0x3c44cdedd6a362e12057242905b5259473427546",
    price: "4.5",
    transactionHash: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    type: "LISTED",
    nftContract: config.nftContractAddress.toLowerCase(),
    tokenId: 2,
    from: "0x3c44cdedd6a362e12057242905b5259473427546",
    price: "8.2",
    transactionHash: "0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3",
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    type: "MINTED",
    nftContract: config.nftContractAddress.toLowerCase(),
    tokenId: 3,
    from: "0x71c7656ec7ab88b098defb751b7401b5f6d8976f",
    to: "0x71c7656ec7ab88b098defb751b7401b5f6d8976f",
    price: "0",
    transactionHash: "0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4",
    timestamp: new Date(Date.now() - 14400000),
  },
];

export const getActivity = async (req: Request, res: Response) => {
  try {
    const { tokenId, address } = req.query;

    if (isDbConnected) {
      const query: any = {};
      if (tokenId) query.tokenId = Number(tokenId);
      if (address) {
        const addr = String(address).toLowerCase();
        query.$or = [{ from: addr }, { to: addr }];
      }

      const activities = await Activity.find(query).sort({ timestamp: -1 }).limit(50);
      return res.json({ success: true, count: activities.length, data: activities });
    }

    let result = [...mockActivities];
    if (tokenId) {
      result = result.filter((a) => a.tokenId === Number(tokenId));
    }
    if (address) {
      const addr = String(address).toLowerCase();
      result = result.filter((a) => a.from === addr || a.to === addr);
    }

    return res.json({ success: true, count: result.length, data: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
