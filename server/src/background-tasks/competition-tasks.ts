import mongoose from "mongoose";
import Competition from "../models/competition";
import Wallet from "../models/wallet";
import AppError from "../middleware/error";
import Rank from "../models/ranking";

export async function payCompetitionWinners(id: mongoose.Types.ObjectId) {
  // Implementation for paying competition winners
  const competition = await Competition.findById(id);
  if (!competition) {
    throw new AppError("Competition not found", 404);
  }
  try {
    // Logic to process payments to winners
    if (competition.winner && competition.winner.length > 0) {
      const pay = competition.prizePool / competition.winner.length;
      for (const winner of competition.winner) {
        const wallet = await Wallet.findOne({ user: winner._id });
        if (!wallet) continue;
        wallet.balance += pay;
        await wallet.save();
      }
    }
  } catch (error) {
    throw new AppError(
      `Error processing payments to ${competition.name} ${competition.type} winners. competitionId: ${competition._id}`,
      500
    );
  }
}

export async function updateParticipantStreak(id: mongoose.Types.ObjectId) {
  const competition = await Competition.findById(id);
  if (!competition) {
    throw new AppError("Competition not found", 404);
  }

  const participants = competition.participants || [];
  const winners = competition.winner || [];

  if (participants.length === 0) return;

  try {
    const bulkOps: any[] = [];

    for (const participant of participants) {
      const userIdStr = participant.user.toString();
      const isWinner = winners.some(
        (w: mongoose.Types.ObjectId) => w.toString() === userIdStr
      );

      let update: any;

      if (isWinner) {
        // Winner update
        update = {
          $inc: {
            winningStreak: 1,
            totalWins: 1,
            points: 10,
          },
        };

        // Game-type specific fields
        if (competition.type === "ManGoSet") {
          update.$inc.manGoSetWin = 1;
          update.$inc.manGoSetWinningStreak = 1;
          update.$inc["manGoSetRank.points"] = 10;
        } else if (competition.type === "TopScore") {
          update.$inc.topScoreWin = 1;
          update.$inc.topScoreWinningStreak = 1;
          update.$inc["topScoreRank.points"] = 10;
        } else if (competition.type === "League") {
          update.$inc.leagueWin = 1;
          update.$inc.leagueWinningStreak = 1;
          update.$inc["leagueRank.points"] = 10;
        }
      } else {
        // Loser update
        update = {
          $set: { winningStreak: 0 },
          $inc: { points: 1 },
        };

        // Reset game-type streaks
        if (competition.type === "ManGoSet") {
          update.$set.manGoSetWinningStreak = 0;
          update.$inc["manGoSetRank.points"] = 1;
        } else if (competition.type === "TopScore") {
          update.$set.topScoreWinningStreak = 0;
          update.$inc["topScoreRank.points"] = 1;
        } else if (competition.type === "League") {
          update.$set.leagueWinningStreak = 0;
          update.$inc["leagueRank.points"] = 1;
        }
      }

      // Push to bulk operations
      bulkOps.push({
        updateOne: {
          filter: { user: participant.user },
          update,
        },
      });
    }

    // Execute bulk write
    if (bulkOps.length > 0) {
      await Rank.bulkWrite(bulkOps);
    }
  } catch (error) {
    console.error(error);
    throw new AppError(
      `Error updating streak for competition "${competition.name}" (${competition.type}). ID: ${competition._id}`,
      500
    );
  }
}

// export async function updateParticipantStreak(id: mongoose.Types.ObjectId) {
//   const competition = await Competition.findById(id);
//   if (!competition) {
//     throw new AppError("Competition not found", 404);
//   }
//   try {
//     if ((competition.participants && competition.participants.length > 0) && (competition.winner && competition.winner.length > 0)) {
//       for (const participant of competition.participants) {
//           if (competition.winner.includes(participant.user)) {
//             const rank = await Rank.findOne({ user: participant.user });
//             if (rank) {
//               rank.winningStreak += 1;
//               rank.totalWins += 1;
//               rank.points += 10;
//               if(competition.type === "ManGoSet") {
//                 rank.manGoSetWin += 1;
//                 rank.manGoSetWinningStreak += 1;
//                 rank.manGoSetRank.points += 10;
//               } else if(competition.type === "TopScore") {
//                 rank.topScoreWin += 1;
//                 rank.topScoreWinningStreak += 1;
//                 rank.topScoreRank.points += 10;
//               } else if(competition.type === "League") {
//                 rank.leagueWin += 1;
//                 rank.leagueWinningStreak += 1;
//                 rank.leagueRank.points += 10;
//               }
//               await rank.save();
//             }
//           } else {
//             const rank = await Rank.findOne({ user: participant.user });
//             if (rank) {
//               rank.winningStreak = 0;
//               rank.points += 1;
//               if(competition.type === "ManGoSet") {
//                 rank.manGoSetWinningStreak = 0;
//                 rank.manGoSetRank.points += 1;
//               } else if(competition.type === "TopScore") {
//                 rank.topScoreWinningStreak = 0;
//                 rank.topScoreRank.points += 1;
//               } else if(competition.type === "League") {
//                 rank.leagueWinningStreak = 0;
//                 rank.leagueRank.points += 1;
//               }
//               await rank.save();
//             }
//           }
//       }
//     }
//   } catch (error) {
//     throw new AppError(
//       `Error updating streak for ${competition.name} ${competition.type} winners. competitionId: ${competition._id}`,
//       500
//     );
//   }
// }
