import { AuthenticatedRequest } from "../middleware/session";
import { Response, NextFunction } from "express";
import Wallet from "../models/wallet";
import Achievement from "../models/achievement";
import AppError from "../middleware/error";

export async function getWallet(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user.id;

    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      throw new AppError("Wallet not found", 404);
    }

    res.status(200).json({
      message: "successful",
      wallet,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAchievements(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user.id;

    const achievements = await Achievement.find({ user: userId });

    res.status(200).json({
      message: "successful",
      achievements,
    });
  } catch (error) {
    next(error);
  }
}
