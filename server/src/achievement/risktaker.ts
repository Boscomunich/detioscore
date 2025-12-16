import Rank from "../models/ranking";
import Achievement from "../models/achievement";
import Competition from "../models/competition";
import AppError from "../middleware/error";
import mongoose from "mongoose";
import { getWeekRange } from "../../utils/date-range";

export async function checkForRiskTaker(
  userId: mongoose.Types.ObjectId,
  competitionId: mongoose.Types.ObjectId
) {
  try {
    const alreadyHasReward = await Achievement.findOne({
      user: userId,
      name: "Risk Taker",
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

    const { start, end } = getWeekRange(competitionData.createdAt);

    const competitionsThisWeek = await Competition.find({
      createdBy: userId,
      createdAt: { $gte: start, $lte: end },
    });

    if (competitionsThisWeek.length >= 5) {
      await Achievement.create({
        user: userId,
        name: "Risk Taker",
        description: "Placed 5 competitions in a week",
        points: 30,
        competition: competitionId,
      });
      rank.points += 30;
      await rank.save();
    }
    return;
  } catch (error) {
    new AppError("Error checking risktaker achievement", 500);
  }
}
