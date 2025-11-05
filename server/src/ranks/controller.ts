import Rank from "../models/ranking";
import { AuthenticatedRequest } from "../middleware/session";
import { NextFunction, Response } from "express";
import AppError from "../middleware/error";

/**
 * Unified Ranking Endpoint
 * Query params:
 *  - type: "all" | "topscore" | "league" | "mangoset"
 *  - scope: "world" | "country" (default "world")
 *  - page, limit
 */
export async function getRankings(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;
    const type = (req.query.type as string)?.toLowerCase() || "all";
    const scope = (req.query.scope as string)?.toLowerCase() || "world";
    const limit = parseInt(req.query.limit as string) || 25;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    if (!["all", "topscore", "league", "mangoset"].includes(type)) {
      return next(
        new AppError(
          "Invalid type. Use 'all', 'topscore', 'league', or 'mangoset'.",
          400
        )
      );
    }
    if (!["world", "country"].includes(scope)) {
      return next(
        new AppError("Invalid scope. Use 'world' or 'country'.", 400)
      );
    }

    // Determine user's country
    const userRank = await Rank.findOne({ user: userId }).lean();
    const userCountry =
      userRank?.topScoreRank?.countryRank?.country ||
      userRank?.manGoSetRank?.countryRank?.country ||
      userRank?.leagueRank?.countryRank?.country ||
      userRank?.countryRank?.country;

    const userLookupStage = {
      $lookup: {
        from: "user",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          { $project: { _id: 1, username: 1, name: 1, image: 1, country: 1 } },
        ],
      },
    };

    const unwindStage = {
      $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
    };

    // Build query filter and sort
    const filter: Record<string, any> = {};
    let sortField = "worldRank.position";
    let projection: Record<string, any> = { _id: 1, user: 1 };

    // Define rank type mapping
    const rankTypeMap: Record<string, string> = {
      topscore: "topScoreRank",
      league: "leagueRank",
      mangoset: "manGoSetRank",
    };

    if (type === "all") {
      // Overall global or country leaderboard
      if (scope === "country") {
        if (!userCountry)
          return next(
            new AppError("User country not found in rank data.", 400)
          );
        filter["countryRank.country"] = userCountry;
        sortField = "countryRank.position";
      } else {
        sortField = "worldRank.position";
      }

      projection = {
        ...projection,
        countryRank: 1,
        worldRank: 1,
        totalWins: 1,
        winningStreak: 1,
      };
    } else {
      // Category-based leaderboard
      const rankKey = rankTypeMap[type];
      if (scope === "country") {
        if (!userCountry)
          return next(
            new AppError("User country not found in rank data.", 400)
          );
        filter[`${rankKey}.countryRank.country`] = userCountry;
        sortField = `${rankKey}.countryRank.position`;
      } else {
        sortField = `${rankKey}.worldRank.position`;
      }

      projection = {
        ...projection,
        [`${rankKey}.countryRank`]: 1,
        [`${rankKey}.worldRank`]: 1,
      };
    }

    const total = await Rank.countDocuments(filter);
    const ranks = await Rank.aggregate([
      { $match: filter },
      userLookupStage,
      unwindStage,
      { $sort: { [sortField]: 1, createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $project: projection },
    ]);

    // Normalize structure
    const normalized = ranks.map((r: any) => {
      const data =
        type === "all"
          ? r
          : r.topScoreRank || r.manGoSetRank || r.leagueRank || {};

      return {
        user: r.user,
        countryRank: data.countryRank
          ? {
              country: data.countryRank.country || null,
              position: data.countryRank.position || null,
              points: data.countryRank.points || 0,
            }
          : r.countryRank
          ? {
              country: r.countryRank.country || null,
              position: r.countryRank.position || null,
              points: r.countryRank.points || 0,
            }
          : null,
        worldRank: data.worldRank
          ? {
              position: data.worldRank.position || null,
              points: data.worldRank.points || 0,
            }
          : r.worldRank
          ? {
              position: r.worldRank.position || null,
              points: r.worldRank.points || 0,
            }
          : null,
      };
    });

    // Response
    return res.status(200).json({
      success: true,
      context: {
        type,
        scope,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        userCountry,
      },
      data: normalized,
    });
  } catch (err) {
    next(err);
  }
}

export async function getUserRankData(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const user = req.user?.id;
  try {
    const rankData = await Rank.findOne({ user });
    res.status(200).json(rankData);
  } catch (error) {
    next(error);
  }
}
