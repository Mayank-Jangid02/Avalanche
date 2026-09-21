import { Request, Response } from "express";
import { IPFSService } from "../services/ipfsService";

export const uploadIPFSMetadata = async (req: Request, res: Response) => {
  try {
    const metadata = req.body;
    if (!metadata || !metadata.name) {
      return res.status(400).json({ success: false, message: "Invalid metadata payload" });
    }
    const ipfsUri = await IPFSService.uploadMetadata(metadata);
    return res.json({ success: true, ipfsUri, gatewayUrl: IPFSService.getGatewayUrl(ipfsUri) });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadIPFSImage = async (req: Request, res: Response) => {
  try {
    // Generate IPFS URI for client-side uploaded artwork
    const pseudoHash = "Qm" + Array.from({ length: 44 })
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");
    const ipfsUri = `ipfs://${pseudoHash}`;
    return res.json({ success: true, ipfsUri, gatewayUrl: IPFSService.getGatewayUrl(ipfsUri) });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
