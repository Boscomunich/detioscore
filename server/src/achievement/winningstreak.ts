import Rank from "../models/ranking";
import Achievement from "../models/achievement";
import AppError from "../middleware/error";
import mongoose from "mongoose";

export async function checkForThreeWinStreakAchievement(
  userId: mongoose.Types.ObjectId
) {
  try {
    const alreadyHasReward = await Achievement.findOne({
      user: userId,
      name: "Three Win Streak",
    });

    if (alreadyHasReward) {
      return;
    }

    const rank = await Rank.findOne({ user: userId });
    if (!rank) {
      throw new AppError("Rank not found", 404);
    }

    if (rank.winningStreak >= 3) {
      const threeWinStreakAchievement = new Achievement({
        user: userId,
        name: "Three Win Streak",
        description:
          "Amazing! You've achieved a three-game winning streak and earned +30 bonus points. Keep the streak alive!",
        points: 50,
      });
      await threeWinStreakAchievement.save();
      rank.points += 50;
      await rank.save();
    }
    return;
  } catch (error) {
    new AppError("Error checking three win streak achievement", 500);
  }
}
