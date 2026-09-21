import { Router } from "express";
import { uploadIPFSMetadata, uploadIPFSImage } from "../controllers/ipfsController";

const router = Router();

router.post("/metadata", uploadIPFSMetadata);
router.post("/upload", uploadIPFSImage);

export default router;
