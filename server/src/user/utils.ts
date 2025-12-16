import { logger } from "../logger";
import Ranks, { IRank } from "../models/ranking";
import User from "../models/user";

/**
 * Creates a new rank document for a given user.
 * Initializes all world and country ranks to the last position.
 */
export const createRankForUser = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return null;
    }

    // Prevent duplicate initialization
    const existingRank = await Ranks.findOne({ user: userId });
    if (existingRank) {
      return existingRank;
    }

    // Count total ranks for world and country
    const totalWorld = await Ranks.countDocuments();
    const totalCountry = await Ranks.countDocuments({
      "countryRank.country": user.country,
    });

    const baseWorldRank = {
      position: totalWorld + 1,
      country: "World",
    };
    const baseCountryRank = {
      position: totalCountry + 1,
      country: user.country || "Unknown",
    };

    // Create the new rank record
    const newRank = await Ranks.create({
      user: userId,
      countryRank: baseCountryRank,
      worldRank: baseWorldRank,
      topScoreRank: {
        worldRank: baseWorldRank,
        countryRank: baseCountryRank,
        points: 0,
      },
      manGoSetRank: {
        worldRank: baseWorldRank,
        countryRank: baseCountryRank,
        points: 0,
      },
      leagueRank: {
        worldRank: baseWorldRank,
        countryRank: baseCountryRank,
        points: 0,
      },
      points: 0,
      manGoSetWin: 0,
      topScoreWin: 0,
      leagueWin: 0,
      firstWin: false,
      winningStreak: 0,
      totalWins: 0,
    });

    logger.info(`Rank initialized for user ${userId}: ${newRank._id}`);
    return newRank;
  } catch (error) {
    logger.error("Error creating rank:", error);
    return null;
  }
};

/**
 * Updates a user's country and adjusts their rank record accordingly.
 * If the user updates their country from "Unknown" to a real one,
 * their country rank and related fields will be recalculated.
 */
export const updateUserCountryAndRanks = async (
  userId: string,
  newCountry: string
) => {
  try {
    let rank = await Ranks.findOne({ user: userId });
    if (!rank) {
      return;
    }

    //Count existing ranks in new country
    const totalCountryRanks = await Ranks.countDocuments({
      "countryRank.country": newCountry,
    });

    rank.countryRank.country = newCountry;
    rank.countryRank.position = totalCountryRanks + 1;
    rank.topScoreRank.countryRank.country = newCountry;
    rank.manGoSetRank.countryRank.country = newCountry;
    rank.leagueRank.countryRank.country = newCountry;

    await rank.save();

    logger.info(`Updated country for user ${userId}, rank adjusted.`);

    return rank;
  } catch (error) {
    logger.error("Error updating user country and ranks:", error);
    throw error;
  }
};

/**
 * Recalculates all world and country ranks for every rank document
 * and updates the trend (up, down, stable) for all rank fields.
 */
export const recalculateAllRanks = async () => {
  try {
    const allRanks = await Ranks.find().lean();
    if (!allRanks || allRanks.length === 0) return;

    const bulkOps: any[] = [];

    //World rank for overall points
    const worldSorted = [...allRanks].sort((a, b) => b.points - a.points);
    for (let i = 0; i < worldSorted.length; i++) {
      const rank = worldSorted[i];
      if (!rank) continue;
      const newPosition = i + 1;
      const trend =
        newPosition < rank.worldRank.position
          ? "up"
          : newPosition > rank.worldRank.position
          ? "down"
          : "stable";

      bulkOps.push({
        updateOne: {
          filter: { _id: rank._id },
          update: {
            $set: {
              "worldRank.position": newPosition,
              "worldRank.trend": trend,
            },
          },
        },
      });
    }

    //Country rank for overall points
    const countryMap: Record<string, IRank[]> = {};
    allRanks.forEach((r) => {
      const country = r.countryRank.country || "Unknown";
      if (!countryMap[country]) countryMap[country] = [];
      countryMap[country].push(r);
    });

    for (const [country, ranks] of Object.entries(countryMap)) {
      const sortedCountry = [...ranks].sort((a, b) => b.points - a.points);
      for (let i = 0; i < sortedCountry.length; i++) {
        const rank = sortedCountry[i];
        if (!rank) continue;
        const newPosition = i + 1;
        const trend =
          newPosition < rank.countryRank.position
            ? "up"
            : newPosition > rank.countryRank.position
            ? "down"
            : "stable";

        bulkOps.push({
          updateOne: {
            filter: { _id: rank._id },
            update: {
              $set: {
                "countryRank.position": newPosition,
                "countryRank.trend": trend,
              },
            },
          },
        });
      }
    }

    //Game-specific ranks
    const gameFields: ("topScoreRank" | "manGoSetRank" | "leagueRank")[] = [
      "topScoreRank",
      "manGoSetRank",
      "leagueRank",
    ];

    for (const field of gameFields) {
      // Sort by points in that game
      const sortedByGame = [...allRanks].sort(
        (a, b) => b[field].points - a[field].points
      );

      // Calculate world rank and trend for this game
      for (let i = 0; i < sortedByGame.length; i++) {
        const rank = sortedByGame[i];
        if (!rank) continue;
        const newWorldPos = i + 1;
        const worldTrend =
          newWorldPos < rank[field].worldRank.position
            ? "up"
            : newWorldPos > rank[field].worldRank.position
            ? "down"
            : "stable";

        bulkOps.push({
          updateOne: {
            filter: { _id: rank._id },
            update: {
              $set: {
                [`${field}.worldRank.position`]: newWorldPos,
                [`${field}.worldRank.trend`]: worldTrend,
              },
            },
          },
        });
      }

      // Calculate country rank and trend for this game
      const countryGroups: Record<string, IRank[]> = {};
      allRanks.forEach((r) => {
        const country = r[field].countryRank.country || "Unknown";
        if (!countryGroups[country]) countryGroups[country] = [];
        countryGroups[country].push(r);
      });

      for (const [country, ranks] of Object.entries(countryGroups)) {
        const sortedCountry = [...ranks].sort(
          (a, b) => b[field].points - a[field].points
        );
        for (let i = 0; i < sortedCountry.length; i++) {
          const rank = sortedCountry[i];
          if (!rank) continue;
          const newCountryPos = i + 1;
          const countryTrend =
            newCountryPos < rank[field].countryRank.position
              ? "up"
              : newCountryPos > rank[field].countryRank.position
              ? "down"
              : "stable";

          bulkOps.push({
            updateOne: {
              filter: { _id: rank._id },
              update: {
                $set: {
                  [`${field}.countryRank.position`]: newCountryPos,
                  [`${field}.countryRank.trend`]: countryTrend,
                },
              },
            },
          });
        }
      }
    }

    if (bulkOps.length > 0) {
      const result = await Ranks.bulkWrite(bulkOps);
      logger.info(
        `Recalculated ranks & trends for all users. Modified: ${result.modifiedCount}`
      );
    }
  } catch (error) {
    logger.error("Error recalculating ranks:", error);
  }
};
