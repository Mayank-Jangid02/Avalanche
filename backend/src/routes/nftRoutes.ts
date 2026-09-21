import { Router } from "express";
import {
  getNFTs,
  getNFTById,
  getNFTsByOwner,
  getNFTsByCreator,
  createNFTIndex,
} from "../controllers/nftController";

const router = Router();

router.get("/", getNFTs);
router.post("/", createNFTIndex);
router.get("/owner/:address", getNFTsByOwner);
router.get("/creator/:address", getNFTsByCreator);
router.get("/:tokenId", getNFTById);

export default router;
