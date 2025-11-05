import { logger } from "../logger";
import Ranks from "../models/ranking";
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
  console.log("updating country to", userId, newCountry);
  try {
    let rank = await Ranks.findOne({ user: userId });
    console.log("rank found", rank);
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
