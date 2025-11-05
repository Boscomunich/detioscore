import { NextFunction, Response } from "express";
import Competition from "../models/competition";
import AppError from "../middleware/error";
import { AuthenticatedRequest } from "../middleware/session";
import { logger } from "../logger";
import { generateRandomString } from "better-auth/crypto";
import proofEmitter from "../event-emitter/upload-emitter";

export async function createTopScore(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const {
    name,
    numberOfTeams,
    participantCap,
    price,
    visibility,
    rules,
    startDate,
    endDate,
  } = req.body;
  const invitationCode = generateRandomString(10, "A-Z", "0-9", "a-z");
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Force full-day UTC range
  start.setUTCHours(0, 0, 0, 0);
  end.setUTCHours(23, 59, 59, 999);

  try {
    const competition = new Competition({
      name,
      type: "TopScore",
      createdBy: req.user?.id,
      requiredTeams: numberOfTeams,
      participantCap,
      prizePool: price,
      invitationCode,
      hostContribution: price,
      isPublic: visibility === "public",
      rules,
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

export async function uploadValidationProof(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const { competitionId } = req.params;
  const { id: userId } = req.user;

  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    let stepsArray: { id: string; description: string; imageCount: number }[] =
      [];
    if (req.body.steps) {
      try {
        stepsArray = JSON.parse(req.body.steps);
      } catch {
        return res.status(400).json({ message: "Invalid steps format" });
      }
    }

    if (stepsArray.length !== req.files.length) {
      return res
        .status(400)
        .json({ message: "Number of steps must match number of files" });
    }

    //Emit job immediately
    proofEmitter.emit("upload-proof", {
      competitionId,
      userId,
      files: req.files as Express.Multer.File[],
      steps: stepsArray,
    });

    res.status(202).json({
      message: "Proof upload queued successfully (delayed response)",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function fetchActiveTopScoreCompetition(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  try {
    const [competitions, totalCompetitions] = await Promise.all([
      Competition.find({ isActive: true, type: "TopScore" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Competition.countDocuments({ isActive: true, type: "TopScore" }),
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

export async function fetchAllTopScoreCompetitionByUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;

    const competitions = await Competition.find({
      participants: userId,
      type: "TopScore",
    }).sort({ createdAt: -1 });

    res.status(200).json(competitions);
  } catch (error) {
    logger.error("fetchAllTopScoreCompetitionByUser error:", error);
    next(new AppError("Failed to fetch competitions", 500));
  }
}

export async function fetchAllTopScoreCompetitionByHost(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;

    const competitions = await Competition.find({
      createdBy: userId,
      type: "TopScore",
    }).sort({ createdAt: -1 });

    res.status(200).json(competitions);
  } catch (error) {
    logger.error("fetchAllTopScoreCompetitionByUser error:", error);
    next(new AppError("Failed to fetch competitions", 500));
  }
}
