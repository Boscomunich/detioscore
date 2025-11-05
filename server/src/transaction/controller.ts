import { Response, NextFunction } from "express";
import Transaction from "../models/transaction";
import { AuthenticatedRequest } from "../middleware/session";
import { createTransaction } from "./utils";

export async function fetchUserTransactionHistory(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.user.id;
  try {
    const transaction = await Transaction.find({ user: userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
}

export async function createInvoice(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const { amount, paymentMethod } = req.body;
  const userId = req.user.id;
  try {
    const transaction = await createTransaction(
      userId,
      "topup",
      amount,
      paymentMethod,
      "pending"
    );
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
}

export async function createWithdrawal(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const { amount, paymentMethod } = req.body;
  const userId = req.user.id;
  try {
    const transaction = await createTransaction(
      userId,
      "withdrawal",
      amount,
      paymentMethod,
      "pending"
    );
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
}
