import express from "express";
import { getRankings, getUserRankData } from "./controller";

const router = express.Router();

router.get("/user", getUserRankData);
router.get("/", getRankings);

export const rankingRouter = router;
