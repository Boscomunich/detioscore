import { NextFunction, Response } from "express";
import Competition from "../models/competition";
import TeamSelection from "../models/teams";
import AppError from "../middleware/error";
import { AuthenticatedRequest } from "../middleware/session";
import { logger } from "../logger";
import { generateRandomString } from "better-auth/crypto";
import { uploadToS3 } from "../file-upload";

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
      startDate,
      endDate,
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

export async function joinTopScoreCompetition(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const { competitionId } = req.params;
  const { id: userId } = req.user;
  const teams = req.body;

  try {
    // Find competition
    const competition = await Competition.findById(competitionId);
    if (!competition || !competition.isActive) {
      throw new AppError("Competition not found or inactive", 404);
    }

    // Check participant cap
    const participantCount = competition.participants.length;
    if (
      competition.participantCap &&
      participantCount >= competition.participantCap
    ) {
      throw new AppError("Competition participant limit reached", 400);
    }

    // Check if user already joined
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

    // Handle teams from frontend
    if (!teams || teams.length === 0) {
      throw new AppError("You must select at least one team", 400);
    }

    if (
      teams.length < competition.minTeams ||
      teams.length > competition.maxTeams
    ) {
      throw new AppError(
        `You must select between ${competition.minTeams} and ${competition.maxTeams} teams`,
        400
      );
    }

    const formattedTeams = teams.map((t: any) => ({
      teamId: t.teamId,
      name: t.teamName, // schema expects "name"
      logo: t.teamLogo,
    }));

    // Extract single star team
    const starredTeams = teams.filter((t: any) => t.isStarred);
    if (starredTeams.length > 1) {
      throw new AppError("You can only star one team", 400);
    }

    if (starredTeams.length < 1) {
      throw new AppError("you must select at least one start team");
    }

    const starTeamId =
      starredTeams.length === 1 ? starredTeams[0].teamId : null;

    teamSelection.teams = formattedTeams;
    teamSelection.starTeam = starTeamId;

    await teamSelection.save();

    await teamSelection.save();

    // Add user to competition participants if not already
    const existingParticipant = competition.participants.find(
      (p) => p.user.toString() === userId.toString()
    );

    if (existingParticipant) {
      existingParticipant.status = "joined";
      existingParticipant.joinedAt = new Date();
    } else {
      competition.participants.push({
        user: userId,
        status: "joined",
        joinedAt: new Date(),
      });
    }

    await competition.save();

    res.status(200).json({
      message: "Successfully joined the competition",
      teamSelection,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function uploadValidationProof(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const { competitionId } = req.params;
  const { id: userId } = req.user;

  console.log(req.body);

  try {
    // Ensure files are provided
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Parse steps array sent from frontend
    let stepsArray: { id: string; description: string; imageCount: number }[] =
      [];
    if (req.body.steps) {
      try {
        stepsArray = JSON.parse(req.body.steps);
      } catch (err) {
        return res.status(400).json({ message: "Invalid steps format" });
      }
    }

    if (stepsArray.length !== req.files.length) {
      return res
        .status(400)
        .json({ message: "Number of steps must match number of files" });
    }

    // Find or create the user's team selection
    let teamSelection = await TeamSelection.findOne({
      competition: competitionId,
      user: userId,
    });

    if (!teamSelection) {
      teamSelection = new TeamSelection({
        competition: competitionId,
        user: userId,
        proofs: [],
      });
    }

    // Upload each file to S3 and add to proofs array
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i] as Express.Multer.File;
      const stepId = stepsArray[i]!.id;

      const fileUrl = await uploadToS3(
        file,
        `competitions/${competitionId}/proofs`
      );

      teamSelection.proofs.push({
        step: stepId,
        url: fileUrl,
        verified: false,
      });
    }

    // update participant array in the competition
    await Competition.findByIdAndUpdate(
      competitionId,
      { $push: { participants: { user: userId, status: "pending" } } },
      { new: true }
    );

    // Save the document
    await teamSelection.save();

    res.status(200).json({
      message: "Proofs uploaded successfully",
      proofs: teamSelection.proofs,
    });
  } catch (error) {
    console.log(error);
    logger.error(error);
    next(error);
  }
}

export async function fetchActiveTopScoreCompetition(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const competition = await Competition.find({
      isActive: true,
      type: "TopScore",
    });
    res.status(200).json(competition);
  } catch (error) {
    logger.error("createTopScore error:", error);
    next(new AppError("Failed to create competition", 500));
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
