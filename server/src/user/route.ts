import express from "express";
import { getAchievements, getWallet } from "./controller";

const router = express.Router();

router.get("/wallet", getWallet);
router.get("/achievements", getAchievements);

export const userRouter = router;
