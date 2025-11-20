import { NextFunction, Response } from "express";
import Competition from "../models/competition";
import { AuthenticatedRequest } from "../middleware/session";
import AppError from "../middleware/error";
import mongoose from "mongoose";
import TeamSelection from "../models/teams";
import User from "../models/user";

export async function fetchAllActiveCompetition(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  try {
    const [competitions, totalCompetitions] = await Promise.all([
      Competition.find({ isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Competition.countDocuments({ isActive: true }),
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

export async function fetchAllInActiveCompetition(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  try {
    const [competitions, totalCompetitions] = await Promise.all([
      Competition.find({ isActive: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Competition.countDocuments({ isActive: false }),
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

export async function fetchCompetitionWithTeamsAndUserData(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const { competitionId } = req.params;

  try {
    const competition = await Competition.findById(competitionId)
      .populate({
        path: "createdBy",
        model: "User",
        select: "_id username email role",
      })
      .populate({
        path: "winner",
        model: "User",
        select: "_id username email role",
      })
      .populate({
        path: "participants.user",
        model: "User",
        select: "_id username email role",
      })
      .lean(); // optional: returns plain JS objects

    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    // Fetch TeamSelection for each participant
    const participantsWithTeams = await Promise.all(
      (competition.participants || []).map(async (participant: any) => {
        if (!participant.user) return null; // skip deleted users

        const teamData = await TeamSelection.findOne({
          competition: competition._id,
          user: participant.user._id,
        })
          .select(
            "_id stakedAmount teams starTeam teamPoints totalPoints rank stepsVerified proofs createdAt updatedAt"
          )
          .lean();

        return {
          _id: participant._id,
          status: participant.status,
          joinedAt: participant.joinedAt,
          user: participant.user,
          team: teamData || null,
        };
      })
    );

    // Filter out participants with deleted users
    const filteredParticipants = participantsWithTeams.filter(Boolean);

    res.status(200).json({
      ...competition,
      participants: filteredParticipants,
    });
  } catch (error) {
    console.error("fetchCompetitionWithTeamsAndUserData error:", error);
    next(new AppError("Failed to fetch competition details", 500));
  }
}

export async function fetchCompetitionsByUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError("Unauthorized: user not found", 401));
    }

    const { status } = req.query;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    let isActive: boolean | undefined;
    if (status === "active") isActive = true;
    else if (status === "inactive") isActive = false;

    const query: Record<string, any> = { "participants.user": userId };
    if (typeof isActive === "boolean") query.isActive = isActive;

    const [competitions, totalCompetitions] = await Promise.all([
      Competition.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Competition.countDocuments(query),
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
    console.error("fetchCompetitionsByUser error:", error);
    next(new AppError("Failed to fetch competitions", 500));
  }
}

export async function joinCompetition(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const { competitionId } = req.params;
  const { id: userId } = req.user;
  const incomingTeams = req.body;

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

    // Find or create TeamSelection
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

    // Validate incoming teams
    if (!incomingTeams || incomingTeams.length === 0) {
      throw new AppError("You must select at least one team", 400);
    }

    if (
      incomingTeams.length < competition.minTeams ||
      incomingTeams.length > competition.maxTeams
    ) {
      throw new AppError(
        `You must select between ${competition.minTeams} and ${competition.maxTeams} teams`,
        400
      );
    }

    // ✅ Format teams for DB
    const formattedTeams = incomingTeams.map((t: any) => ({
      fixtureId: String(t.fixtureId),
      selectedTeam: {
        teamId: t.team.id,
        name: t.team.name,
        logo: t.team.logo,
      },
      opponentTeam: {
        teamId: t.opponent.id,
        name: t.opponent.name,
        logo: t.opponent.logo,
      },
      matchVenue: t.matchVenue ?? "",
    }));

    // ✅ Find starred fixture
    const starredFixtures = incomingTeams.filter((t: any) => t.isStarred);
    if (starredFixtures.length > 1) {
      throw new AppError("You can only star one fixture", 400);
    }

    if (starredFixtures.length < 1) {
      throw new AppError("You must select one star fixture", 400);
    }

    // ✅ Get starred fixture ID (string)
    const starFixtureId =
      starredFixtures.length === 1
        ? String(starredFixtures[0].fixtureId)
        : null;

    // ✅ Ensure star fixture is unique per competition
    const conflict = await TeamSelection.findOne({
      competition: competitionId,
      starTeam: starFixtureId, // note: using same DB field name for backward compat
      user: { $ne: userId },
    });

    if (conflict) {
      throw new AppError(
        "That starred fixture has already been taken by another participant in this competition.",
        400
      );
    }

    teamSelection.teams = formattedTeams;
    teamSelection.starTeam = starFixtureId;

    await teamSelection.save();

    // ✅ Update participants
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

export async function getCompetitionById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const { competitionId } = req.params;
  try {
    const competition = await Competition.findById(competitionId);
    res.status(200).json(competition);
  } catch (error) {
    next(error);
  }
}
