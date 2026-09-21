import { Router } from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userController";

const router = Router();

router.get("/:address", getUserProfile);
router.put("/:address", updateUserProfile);

export default router;
