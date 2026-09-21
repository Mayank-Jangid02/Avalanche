import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  walletAddress: string;
  username: string;
  bio?: string;
  profileImage?: string;
  bannerImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      default: function (this: any) {
        if (this && this.walletAddress) {
          return `User_${this.walletAddress.substring(2, 8)}`;
        }
        return `AvaxUser_${Math.floor(Math.random() * 10000)}`;
      },
    },
    bio: {
      type: String,
      default: "NFT collector & digital art creator on Avalanche.",
    },
    profileImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
    },
    bannerImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
