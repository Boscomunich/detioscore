import Rank from "../models/ranking";
import Achievement from "../models/achievement";
import AppError from "../middleware/error";
import mongoose from "mongoose";

export async function communityStarAchievement(
  userId: mongoose.Types.ObjectId,
  description: string
) {
  try {
    const rank = await Rank.findOne({ user: userId });
    if (!rank) {
      throw new AppError("Rank not found", 404);
    }

    const communityStarAchievement = new Achievement({
      user: userId,
      name: "Community Star",
      description: description,
      points: 30,
    });
    await communityStarAchievement.save();
    rank.points += 20;
    await rank.save();
    return;
  } catch (error) {
    new AppError("Error checking community star achievement", 500);
  }
}
