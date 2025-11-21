import Rank from "../models/ranking";
import User from "../models/user";
import { AuthenticatedRequest } from "../middleware/session";
import { NextFunction, Response } from "express";
import AppError from "../middleware/error";

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
      return next(new AppError("Invalid type", 400));
    }

    if (!["world", "country"].includes(scope)) {
      return next(new AppError("Invalid scope", 400));
    }

    const userRank = await Rank.findOne({ user: userId }).lean();
    const userCountry =
      userRank?.topScoreRank?.countryRank?.country ||
      userRank?.manGoSetRank?.countryRank?.country ||
      userRank?.leagueRank?.countryRank?.country ||
      userRank?.countryRank?.country ||
      null;

    const filter: Record<string, any> = {};
    let sortField = "worldRank.position";

    const map: Record<string, string> = {
      topscore: "topScoreRank",
      league: "leagueRank",
      mangoset: "manGoSetRank",
    };

    if (type === "all") {
      if (scope === "country") {
        if (!userCountry)
          return next(new AppError("User country not found", 400));
        filter["countryRank.country"] = userCountry;
        sortField = "countryRank.position";
      }
    } else {
      const key = map[type];

      if (scope === "country") {
        if (!userCountry)
          return next(new AppError("User country not found", 400));
        filter[`${key}.countryRank.country`] = userCountry;
        sortField = `${key}.countryRank.position`;
      } else {
        sortField = `${key}.worldRank.position`;
      }
    }

    const total = await Rank.countDocuments(filter);

    // ✔ NOTHING is modified here
    // ✔ trend remains exactly as stored in MongoDB
    const ranks = await Rank.find(filter)
      .populate("user", "_id username name image country")
      .sort({ [sortField]: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

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
      data: ranks,
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
