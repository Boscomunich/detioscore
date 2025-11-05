import { NextFunction, Request, Response } from "express";
import Transaction from "../../models/transaction";
import AppError from "../../middleware/error";
import { addDitioCoin } from "../../transaction/utils";

export async function getAllpendingTransaction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 50;
  const skip = (page - 1) * limit;
  try {
    const [transactions, totalTransactions] = await Promise.all([
      Transaction.find({ status: "pending" })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Transaction.countDocuments({ status: "pending" }),
    ]);

    const totalPages = Math.ceil(totalTransactions / limit);

    res.status(200).json({
      transactions,
      pagination: {
        totalTransactions,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserTransaction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 50;
    const skip = (page - 1) * limit;

    const [transactions, totalTransactions] = await Promise.all([
      Transaction.find({ user: userId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Transaction.countDocuments({ user: userId }),
    ]);

    const totalPages = Math.ceil(totalTransactions / limit);

    res.status(200).json({
      transactions,
      pagination: {
        totalTransactions,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function manualUpdteUserTransaction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.params;
  const { status, txnId } = req.body;
  try {
    const transaction = await Transaction.findOne({ user: userId, _id: txnId });
    if (!transaction) throw new AppError("no transaction was found", 404);
    transaction.status = status;
    if (status === "completed") {
      const DC =
        transaction.amount * parseInt(process.env.DOLLAR_TO_DC as string);
      await addDitioCoin(DC, userId!);
    }
    await transaction.save();
    return res.status(200).json({
      message: "transaction has been updated succesfully",
      transaction,
    });
  } catch (error) {
    next(error);
  }
}
