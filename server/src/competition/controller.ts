import { NextFunction, Response } from "express";
import Competition from "../models/competition";
import { AuthenticatedRequest } from "../middleware/session";
import { logger } from "better-auth";
import AppError from "../middleware/error";
import mongoose from "mongoose";

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

export async function fetchCompetitionWithTeamsAndUserData(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const { competitionId } = req.params;

  try {
    const [competition] = await Competition.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(competitionId) } },

      // Lookup creator with projection
      {
        $lookup: {
          from: "user",
          let: { creatorId: "$createdBy" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$creatorId"] } } },
            { $project: { _id: 1, username: 1, email: 1 } },
          ],
          as: "createdBy",
        },
      },
      { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },

      // Unwind participants
      { $unwind: { path: "$participants", preserveNullAndEmptyArrays: true } },

      // Lookup user for participant with projection
      {
        $lookup: {
          from: "user",
          let: { userId: "$participants.user" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
            { $project: { _id: 1, username: 1, email: 1 } },
          ],
          as: "participantUser",
        },
      },
      {
        $unwind: { path: "$participantUser", preserveNullAndEmptyArrays: true },
      },

      // Lookup teamSelection (ONE object, not array)
      {
        $lookup: {
          from: "teamselections",
          let: { compId: "$_id", userId: "$participants.user" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$competition", "$$compId"] },
                    { $eq: ["$user", "$$userId"] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                stakedAmount: 1,
                teams: 1,
                starTeam: 1,
                teamPoints: 1,
                totalPoints: 1,
                rank: 1,
                stepsVerified: 1,
                proofs: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
          as: "teamSelection",
        },
      },
      { $unwind: { path: "$teamSelection", preserveNullAndEmptyArrays: true } },

      // Rebuild participants array
      {
        $group: {
          _id: "$_id",
          doc: { $first: "$$ROOT" },
          participants: {
            $push: {
              _id: "$participants._id",
              status: "$participants.status",
              joinedAt: "$participants.joinedAt",
              user: {
                _id: "$participantUser._id",
                username: "$participantUser.username",
                email: "$participantUser.email",
              },
              team: "$teamSelection", // 👈 one object, not array
            },
          },
        },
      },

      // Merge back with root doc
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$doc", { participants: "$participants" }],
          },
        },
      },
    ]);

    if (!competition) throw new AppError("Competition not found", 404);

    res.status(200).json(competition);
  } catch (error) {
    console.error("fetchCompetitionWithTeamsAndUserData error:", error);
    next(new AppError("Failed to fetch competition details", 500));
  }
}
