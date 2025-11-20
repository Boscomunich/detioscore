import { AuthenticatedRequest } from "../middleware/session";
import { Response, NextFunction } from "express";
import Wallet from "../models/wallet";

export async function getWallet(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user.id;

    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return res.status(404).json({
        message: "Wallet not found",
      });
    }

    res.status(200).json({
      message: "successful",
      wallet,
    });
  } catch (error) {
    next(error);
  }
}
