import express from "express";
import {
  getUsers,
  suspendUser,
  unsuspendUser,
  banUser,
  unbanUser,
} from "./users";
import {
  getAllpendingTransaction,
  getUserTransaction,
  manualUpdteUserTransaction,
} from "./transactions";
import { createLeague } from "./league";
import {
  disqualifyTeam,
  getCompetitionParticipant,
  requalifyTeam,
  validateWinner,
  verifyUserTasks,
} from "./competition";

const router = express.Router();

router.get("/", getUsers);
router.patch("/:id/suspend", suspendUser);
router.patch("/:id/unsuspend", unsuspendUser);
router.patch("/:id/ban", banUser);
router.patch("/:id/unban", unbanUser);
router.get("/transaction", getAllpendingTransaction);
router.get("/transaction/:userId", getUserTransaction);
router.patch("/transaction/:userId", manualUpdteUserTransaction);
router.post("/league", createLeague);
router.get("/competition/:competitionId", getCompetitionParticipant);
router.patch("/participant/task", verifyUserTasks);
router.patch("/participant/disqualify", disqualifyTeam);
router.patch("/participant/requalify", requalifyTeam);
router.patch("/competition/winner", validateWinner);

export const adminRouter = router;
