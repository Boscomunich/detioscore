import express from "express";
import { getWallet } from "./controller";

const router = express.Router();

router.get("/wallet", getWallet);

export const userRouter = router;
