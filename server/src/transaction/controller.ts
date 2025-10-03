import { Response, Request, NextFunction } from "express";
import Transaction from "../models/transaction";
import Wallet from "../models/wallet";
import AppError from "../middleware/error";
import { logger } from "../logger";
import { AuthenticatedRequest } from "../middleware/session";

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
    const transaction = new Transaction({
      user: userId,
      type: "topup",
      amount,
      paymentMethod,
      status: "pending",
    });
    await transaction.save();
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
    const transaction = new Transaction({
      user: userId,
      type: "withdrawal",
      amount,
      paymentMethod,
      status: "pending",
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
}

export async function createWallet(userId: string) {
  try {
    const existingWallet = await Wallet.findOne({ createdBy: userId });
    if (existingWallet) {
      logger.info("Wallet already exists for this user");
      return;
    }
    const wallet = new Wallet({
      createdBy: userId,
      balance: 0,
    });
    await wallet.save();
  } catch (error) {
    console.log(error);
    logger.error("Error creating wallet:", error);
    return;
  }
}

export async function createTransaction(
  user: string,
  type: string,
  amount: number,
  paymentMethod?: string,
  status?: string
) {
  const transaction = new Transaction({
    user,
    type,
    amount,
    paymentMethod: paymentMethod,
    status: status,
  });
  await transaction.save();
  return transaction;
}

export async function updateTransactionStatus(
  transactionId: string,
  status: "pending" | "completed" | "failed"
) {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }
  transaction.status = status;
  await transaction.save();
  return transaction;
}

export async function removeDitioCoin(
  amount: number,
  userId: string,
  type: string
) {
  if (amount <= 0) {
    throw new AppError("Amount must be greater than zero", 400);
  }
  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  const wallet = await Wallet.findOne({ createdBy: userId });
  if (!wallet || wallet.balance < amount) {
    throw new AppError(
      "your coin balance is not sufficient to perform this action",
      400
    );
  }

  wallet.balance -= amount;
  await wallet.save();

  const transaction = await createTransaction(
    userId,
    type,
    amount,
    "completed"
  );
  return transaction;
}

export async function addDitioCoin(
  amount: number,
  userId: string,
  type: string
) {
  if (amount <= 0) {
    throw new AppError("Amount must be greater than zero", 400);
  }
  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  const wallet = await Wallet.findOne({ createdBy: userId });
  if (!wallet) {
    throw new AppError(
      "you need to create a wallet before performing this action",
      400
    );
  }

  wallet.balance -= amount;
  await wallet.save();

  const transaction = new Transaction({
    user: userId,
    type,
    amount,
    status: "completed",
  });
  await transaction.save();
  return transaction;
}
