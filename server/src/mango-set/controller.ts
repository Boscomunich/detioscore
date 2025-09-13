import { NextFunction, Response } from "express";
import Competition from "../models/competition";
import TeamSelection from "../models/teams";
import AppError from "../middleware/error";
import { AuthenticatedRequest } from "../middleware/session";
import { logger } from "../logger";
import { generateRandomString } from "better-auth/crypto";

export async function createMangoSet(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const { name, numberOfTeams, participantCap, stake, visibility } = req.body;
  const invitationCode = generateRandomString(10, "A-Z", "0-9", "a-z");
  try {
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
    });

    competition.participants.push({
      user: req.user?.id,
      status: "joined",
      joinedAt: new Date(),
    });

    await competition.save();
    res.status(201).json(competition);
  } catch (error) {
    logger.error("createTopScore error:", error);
    next(new AppError("Failed to create competition", 500));
  }
}

export async function joinMangoSetCompetition(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const { competitionId } = req.params;
  const { id: userId } = req.user;
  const { teams, starTeam, stakedAmount } = req.body;

  try {
    //Find competition
    const competition = await Competition.findById(competitionId);
    if (!competition || !competition.isActive) {
      throw new AppError("Competition not found or inactive", 404);
    }

    // Prevent creator from joining again
    if (competition.createdBy.toString() === userId.toString()) {
      throw new AppError(
        "The competition creator is already a participant",
        400
      );
    }

    //Check participant cap
    const participantCount = competition.participants.length;
    if (
      competition.participantCap &&
      participantCount >= competition.participantCap
    ) {
      throw new AppError("Competition participant limit reached", 400);
    }

    //Check if user already joined
    let teamSelection = await TeamSelection.findOne({
      competition: competitionId,
      user: userId,
    });

    if (!teamSelection) {
      teamSelection = new TeamSelection({
        competition: competitionId,
        user: userId,
        proofs: [],
        teams: [],
        teamPoints: [],
        totalPoints: 0,
        stepsVerified: false,
      });
    }

    //Handle teams and starTeam if provided
    if (teams && teams.length > 0) {
      if (
        teams.length < competition.minTeams ||
        teams.length > competition.maxTeams
      ) {
        throw new AppError(
          `You must select between ${competition.minTeams} and ${competition.maxTeams} teams`,
          400
        );
      }
      teamSelection.teams = teams;
    }

    if (starTeam) {
      teamSelection.starTeam = starTeam;
    }

    //Handle staked amount
    if (stakedAmount) {
      teamSelection.stakedAmount = stakedAmount;
    }

    //Save TeamSelection
    await teamSelection.save();

    //Add user to competition participants if not already
    competition.participants.push({
      user: userId,
      status: "joined",
      joinedAt: new Date(),
    });

    res.status(200).json({
      message: "Successfully joined the competition",
      teamSelection,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
}

export async function fetchActiveManGoSetCompetition(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const competition = await Competition.find({
      isActive: true,
      type: "ManGoSet",
    });
    res.status(200).json(competition);
  } catch (error) {
    logger.error("createTopScore error:", error);
    next(new AppError("Failed to create competition", 500));
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
