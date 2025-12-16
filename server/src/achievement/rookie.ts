import Wallet from "../models/wallet";
import Rank from "../models/ranking";
import Achievement from "../models/achievement";
import AppError from "../middleware/error";
import mongoose from "mongoose";

export async function checkRookieAchievement(
  userId: mongoose.Types.ObjectId,
  walletId: mongoose.Types.ObjectId
) {
  try {
    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      throw new AppError("Wallet not found", 404);
    }

    if (!wallet.madeFirstDeposit) {
      const rookieAchievement = new Achievement({
        user: userId,
        name: "Rookie Achiever",
        description:
          "Congrats! By joining and topping up your wallet, you’ve earned +10 bonus points. Keep the momentum going!",
        points: 10,
      });
      await rookieAchievement.save();
      wallet.madeFirstDeposit = true;
      await wallet.save();
      const rank = await Rank.findOne({ user: userId });
      if (rank) {
        rank.points += 10;
        await rank.save();
      }
    }
    return;
  } catch (error) {
    new AppError("Error checking rookie achievement", 500);
  }
}
