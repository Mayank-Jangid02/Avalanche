import mongoose, { Schema, Document } from "mongoose";

export interface IAttribute {
  trait_type: string;
  value: string | number;
}

export interface INFT extends Document {
  tokenId: number;
  contractAddress: string;
  name: string;
  description: string;
  image: string;
  metadataURI: string;
  creator: string;
  currentOwner: string;
  blockchain: string;
  category: string;
  attributes: IAttribute[];
  isListed: boolean;
  price?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttributeSchema = new Schema({
  trait_type: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true },
});

const NFTSchema: Schema = new Schema(
  {
    tokenId: { type: Number, required: true, index: true },
    contractAddress: { type: String, required: true, lowercase: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, default: "" },
    image: { type: String, required: true },
    metadataURI: { type: String, required: true },
    creator: { type: String, required: true, lowercase: true, index: true },
    currentOwner: { type: String, required: true, lowercase: true, index: true },
    blockchain: { type: String, default: "Avalanche Fuji Testnet" },
    category: {
      type: String,
      default: "Digital Art",
      enum: ["Digital Art", "Gaming", "Collectibles", "Music", "Photography", "Virtual Worlds"],
    },
    attributes: [AttributeSchema],
    isListed: { type: Boolean, default: false, index: true },
    price: { type: String, default: "0" },
  },
  { timestamps: true }
);

// Compound index for unique token identification per contract
NFTSchema.index({ contractAddress: 1, tokenId: 1 }, { unique: true });

export const NFT = mongoose.model<INFT>("NFT", NFTSchema);
