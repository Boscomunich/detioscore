import { NextFunction, Response } from "express";
import Competition from "../models/competition";
import { AuthenticatedRequest } from "../middleware/session";
import { logger } from "better-auth";
import AppError from "../middleware/error";

export async function fetchAllActiveCompetition(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const competition = await Competition.find({
      isActive: true,
    }).sort({ createdAt: -1 });
    res.status(200).json(competition);
  } catch (error) {
    logger.error("createTopScore error:", error);
    next(new AppError("Failed to create competition", 500));
  }
}
