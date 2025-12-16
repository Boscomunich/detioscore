import mongoose from "mongoose";
import EventEmitter from "node:events";
import { checkFirstWinAchievement } from "../achievement/firstwin";
import { checkForOddMasterAchievement } from "../achievement/oddmaster";
import { checkForThreeWinStreakAchievement } from "../achievement/winningstreak";
import { topPredictorAchievement } from "../achievement/toppredictor";
import { checkForHighRollerAchievement } from "../achievement/highroller";
import { checkForRiskTaker } from "../achievement/risktaker";
import { checkRookieAchievement } from "../achievement/rookie";
import { logger } from "../logger";
import Wallet from "../models/wallet";

export const rewardEmitter = new EventEmitter();
rewardEmitter.setMaxListeners(1);

rewardEmitter.on(
  "winning-competition-achievement",
  async (winners: mongoose.Types.ObjectId[], competition) => {
    for (const winner of winners) {
      try {
        const tasks = [
          checkFirstWinAchievement(winner),
          checkForOddMasterAchievement(winner, competition._id),
          checkForThreeWinStreakAchievement(winner),
        ];
        if (competition.type === "League") {
          tasks.push(topPredictorAchievement(winner, competition._id));
        }
        await Promise.all(tasks);
      } catch (err) {
        logger.error(`Error rewarding winner ${winner}:`, err);
      }
    }
  }
);

rewardEmitter.on(
  "creating-competition-achievement",
  async (
    userId: mongoose.Types.ObjectId,
    competitionId: mongoose.Types.ObjectId
  ) => {
    try {
      const wallet = await Wallet.findOne({ user: userId });
      if (!wallet) {
        logger.error(`Wallet not found for user ${userId}`);
        return;
      }
      const tasks = [
        checkForHighRollerAchievement(userId, competitionId),
        checkForRiskTaker(userId, competitionId),
        checkRookieAchievement(userId, wallet?._id),
      ];
      await Promise.all(tasks);
    } catch (err) {
      logger.error(`Error rewarding user ${userId}:`, err);
    }
  }
);
