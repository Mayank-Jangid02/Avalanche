import { Router } from "express";
import { getActivity } from "../controllers/activityController";

const router = Router();

router.get("/", getActivity);

export default router;
