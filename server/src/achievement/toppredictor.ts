import Rank from "../models/ranking";
import competition from "../models/competition";
import Achievement from "../models/achievement";
import AppError from "../middleware/error";
import mongoose from "mongoose";

export async function topPredictorAchievement(
  userId: mongoose.Types.ObjectId,
  competitionId: mongoose.Types.ObjectId
) {
  try {
    const alreadyHasReward = await Achievement.findOne({
      user: userId,
      name: "Top Predictor",
    });

    if (alreadyHasReward) {
      return;
    }

    const rank = await Rank.findOne({ user: userId });
    if (!rank) {
      throw new AppError("Rank not found", 404);
    }

    const competitionData = await competition.findById(competitionId);
    if (!competitionData) {
      throw new AppError("Competition not found", 404);
    }

    if (competitionData.name === "League") {
      const topPredictorAchievement = new Achievement({
        user: userId,
        name: "Top Predictor",
        description:
          "Outstanding! You've been recognized as a Top Predictor for your exceptional forecasting skills",
        points: 80,
      });
      await topPredictorAchievement.save();
      rank.points += 80;
      await rank.save();
    }
    return;
  } catch (error) {
    new AppError("Error checking top predictor achievement", 500);
  }
}
