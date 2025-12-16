import Rank from "../models/ranking";
import Achievement from "../models/achievement";
import Competition from "../models/competition";
import AppError from "../middleware/error";
import mongoose from "mongoose";

export async function checkForOddMasterAchievement(
  userId: mongoose.Types.ObjectId,
  competitionId: mongoose.Types.ObjectId
) {
  try {
    const alreadyHasReward = await Achievement.findOne({
      user: userId,
      name: "Odd Master",
    });

    if (alreadyHasReward) {
      return;
    }

    const rank = await Rank.findOne({ user: userId });
    if (!rank) {
      throw new AppError("Rank not found", 404);
    }

    const competitionData = await Competition.findById(competitionId);
    if (!competitionData) {
      throw new AppError("Competition not found", 404);
    }

    if (
      competitionData.winner.includes(userId) &&
      competitionData.winner.length === 1 &&
      competitionData.participants.length >= 5
    ) {
      await Achievement.create({
        user: userId,
        name: "Odd Master",
        description: "Won a competition with at least 5 participants",
        points: 60,
      });

      rank.points += 60;
      await rank.save();
    }
    return;
  } catch (error) {
    new AppError("Error checking Odd Master achievement", 500);
  }
}
