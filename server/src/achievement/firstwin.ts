import Rank from "../models/ranking";
import Achievement from "../models/achievement";
import AppError from "../middleware/error";
import mongoose from "mongoose";

export async function checkFirstWinAchievement(
  userId: mongoose.Types.ObjectId
) {
  try {
    const rank = await Rank.findOne({ user: userId });
    if (!rank) {
      throw new AppError("Rank not found", 404);
    }

    if (!rank.firstWin) {
      const firstWinAchievement = new Achievement({
        user: userId,
        name: "First Win",
        description:
          "Congratulations on your first win! You've earned +20 bonus points. Keep up the great work!",
        points: 20,
      });
      await firstWinAchievement.save();
      rank.firstWin = true;
      rank.points += 20;
      await rank.save();
    }
    return;
  } catch (error) {
    new AppError("Error checking first win achievement", 500);
  }
}
