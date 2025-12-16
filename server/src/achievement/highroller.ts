import Rank from "../models/ranking";
import Achievement from "../models/achievement";
import Competition from "../models/competition";
import AppError from "../middleware/error";
import mongoose from "mongoose";

export async function checkForHighRollerAchievement(
  userId: mongoose.Types.ObjectId,
  competitionId: mongoose.Types.ObjectId
) {
  try {
    const rank = await Rank.findOne({ user: userId });
    if (!rank) {
      throw new AppError("Rank not found", 404);
    }

    const competitionData = await Competition.findById(competitionId);
    if (!competitionData) {
      throw new AppError("Competition not found", 404);
    }

    const createdAt = new Date(competitionData.createdAt);
    const startOfDay = new Date(createdAt.setHours(0, 0, 0, 0));
    const endOfDay = new Date(createdAt.setHours(23, 59, 59, 999));

    const competitionsSameDay = await Competition.find({
      createdBy: userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const totalContribution = competitionsSameDay.reduce(
      (sum, comp) => sum + (comp.hostContribution || 0),
      0
    );

    const alreadyHasReward = await Achievement.findOne({
      user: userId,
      name: "HighRoller",
    });

    if (
      totalContribution / Number(process.env.DOLLAR_TO_DC)! >= 100 &&
      !alreadyHasReward
    ) {
      await Achievement.create({
        user: userId,
        name: "HighRoller",
        description: "Contributed over 100 as a competition host in one day",
        points: 40,
      });

      rank.points += 40;
      await rank.save();
    }
    return;
  } catch (error) {
    new AppError("Error checking three win streak achievement", 500);
  }
}
