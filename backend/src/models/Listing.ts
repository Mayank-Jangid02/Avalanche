import mongoose, { Schema, Document } from "mongoose";

export interface IListing extends Document {
  listingId: string;
  nftContract: string;
  tokenId: number;
  seller: string;
  price: string; // Price in AVAX wei or ether representation
  transactionHash?: string;
  status: "ACTIVE" | "SOLD" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema: Schema = new Schema(
  {
    listingId: { type: String, required: true, unique: true, index: true },
    nftContract: { type: String, required: true, lowercase: true, index: true },
    tokenId: { type: Number, required: true, index: true },
    seller: { type: String, required: true, lowercase: true, index: true },
    price: { type: String, required: true },
    transactionHash: { type: String, default: "" },
    status: {
      type: String,
      enum: ["ACTIVE", "SOLD", "CANCELLED"],
      default: "ACTIVE",
      index: true,
    },
  },
  { timestamps: true }
);

export const Listing = mongoose.model<IListing>("Listing", ListingSchema);
