import express from "express";
import {
  createInvoice,
  createWithdrawal,
  fetchUserTransactionHistory,
} from "./controller";

const router = express.Router();

router.post("/create-invoice", createInvoice);
router.post("/create-withdrawal", createWithdrawal);
router.get("/history", fetchUserTransactionHistory);

export const transactionRouter = router;
