import mongoose, { Schema, Document } from "mongoose";

export interface IActivity extends Document {
  type: "MINTED" | "LISTED" | "SOLD" | "CANCELLED" | "PRICE_UPDATED" | "TRANSFER";
  nftContract: string;
  tokenId: number;
  from?: string;
  to?: string;
  price?: string;
  transactionHash?: string;
  blockNumber?: number;
  timestamp: Date;
}

const ActivitySchema: Schema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["MINTED", "LISTED", "SOLD", "CANCELLED", "PRICE_UPDATED", "TRANSFER"],
      index: true,
    },
    nftContract: { type: String, required: true, lowercase: true, index: true },
    tokenId: { type: Number, required: true, index: true },
    from: { type: String, lowercase: true, default: "", index: true },
    to: { type: String, lowercase: true, default: "", index: true },
    price: { type: String, default: "0" },
    transactionHash: { type: String, default: "" },
    blockNumber: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export const Activity = mongoose.model<IActivity>("Activity", ActivitySchema);
