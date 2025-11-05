import { NextFunction, Response } from "express";
import Competition from "../models/competition";
import AppError from "../middleware/error";
import { AuthenticatedRequest } from "../middleware/session";
import { logger } from "../logger";
import { generateRandomString } from "better-auth/crypto";

export async function createMangoSet(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const {
    name,
    numberOfTeams,
    participantCap,
    stake,
    visibility,
    startDate,
    endDate,
  } = req.body;
  const invitationCode = generateRandomString(10, "A-Z", "0-9", "a-z");
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Force full-day UTC range
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(23, 59, 59, 999);

    const competition = new Competition({
      name,
      type: "ManGoSet",
      createdBy: req.user?.id,
      requiredTeams: numberOfTeams,
      participantCap,
      prizePool: stake,
      entryFee: stake,
      invitationCode,
      hostContribution: stake,
      isPublic: visibility === "public",
      startDate: start,
      endDate: end,
    });

    competition.participants.push({
      user: req.user?.id,
      status: "pending",
      joinedAt: new Date(),
    });

    await competition.save();
    res.status(201).json(competition);
  } catch (error) {
    logger.error("createTopScore error:", error);
    next(new AppError("Failed to create competition", 500));
  }
}

export async function fetchActiveManGoSetCompetition(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const skip = (page - 1) * limit;

  try {
    const [competitions, totalCompetitions] = await Promise.all([
      Competition.find({ isActive: true, type: "ManGoSet" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Competition.countDocuments({ isActive: true, type: "ManGoSet" }),
    ]);

    const totalPages = Math.ceil(totalCompetitions / limit);

    res.status(200).json({
      competitions,
      pagination: {
        totalCompetitions,
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

export async function fetchAllManGoSetCompetitionByUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;

    const competitions = await Competition.find({
      "participants.user": userId,
      type: "ManGoSet",
    }).sort({ createdAt: -1 });

    res.status(200).json(competitions);
  } catch (error) {
    logger.error("fetchAllManGoSetCompetitionByUser error:", error);
    next(new AppError("Failed to fetch competitions", 500));
  }
}

export async function fetchAllManGoSetCompetitionByHost(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;

    const competitions = await Competition.find({
      createdBy: userId,
      type: "ManGoSet",
    }).sort({ createdAt: -1 });

    res.status(200).json(competitions);
  } catch (error) {
    logger.error("fetchAllManGoSetCompetitionByUser error:", error);
    next(new AppError("Failed to fetch competitions", 500));
  }
}
