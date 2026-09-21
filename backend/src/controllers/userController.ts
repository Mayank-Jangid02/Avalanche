import { Request, Response } from "express";
import { User } from "../models/User";
import { isDbConnected } from "../config/db";

const mockUsers: Record<string, any> = {};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const address = req.params.address.toLowerCase();

    if (isDbConnected) {
      let user = await User.findOne({ walletAddress: address });
      if (!user) {
        user = await User.create({
          walletAddress: address,
          username: `User_${address.substring(2, 8)}`,
        });
      }
      return res.json({ success: true, data: user });
    }

    if (!mockUsers[address]) {
      mockUsers[address] = {
        walletAddress: address,
        username: `AvaxUser_${address.substring(2, 8)}`,
        bio: "Avalanche NFT enthusiast and creator.",
        profileImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
        bannerImage: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
        createdAt: new Date(),
      };
    }

    return res.json({ success: true, data: mockUsers[address] });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const address = req.params.address.toLowerCase();
    const { username, bio, profileImage, bannerImage } = req.body;

    if (isDbConnected) {
      let user = await User.findOne({ walletAddress: address });
      if (!user) {
        user = new User({ walletAddress: address });
      }

      if (username) user.username = username;
      if (bio !== undefined) user.bio = bio;
      if (profileImage) user.profileImage = profileImage;
      if (bannerImage) user.bannerImage = bannerImage;

      await user.save();
      return res.json({ success: true, data: user });
    }

    mockUsers[address] = {
      ...(mockUsers[address] || {}),
      walletAddress: address,
      username: username || mockUsers[address]?.username || `User_${address.substring(2, 8)}`,
      bio: bio !== undefined ? bio : mockUsers[address]?.bio,
      profileImage: profileImage || mockUsers[address]?.profileImage,
      bannerImage: bannerImage || mockUsers[address]?.bannerImage,
      updatedAt: new Date(),
    };

    return res.json({ success: true, data: mockUsers[address] });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
