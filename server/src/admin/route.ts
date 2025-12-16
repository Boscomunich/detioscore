import express from "express";
import {
  getUsers,
  suspendUser,
  unsuspendUser,
  banUser,
  unbanUser,
  deleteUser,
  changeUserRole,
  getUserByIdOrEmail,
} from "./users";
import {
  getAllpendingTransaction,
  getUserTransaction,
  manualUpdteUserTransaction,
} from "./transactions";
import { createLeague } from "./league";
import {
  confirmChangesAndDeactivateCompetition,
  disqualifyTeam,
  getCompetitionParticipant,
  requalifyTeam,
  validateWinner,
  verifyUserTasks,
} from "./competition";
import { getMetrics } from "./metrics";

const router = express.Router();

router.get("/", getUsers);
router.get("/user", getUserByIdOrEmail);
router.patch("/:id/suspend", suspendUser);
router.patch("/:id/unsuspend", unsuspendUser);
router.patch("/:id/ban", banUser);
router.patch("/:id/unban", unbanUser);
router.delete("/:id", deleteUser);
router.get("/transaction", getAllpendingTransaction);
router.get("/transaction/:userId", getUserTransaction);
router.patch("/transaction/:userId", manualUpdteUserTransaction);
router.post("/league", createLeague);
router.get("/competition/:competitionId", getCompetitionParticipant);
router.patch("/participant/task", verifyUserTasks);
router.patch("/participant/disqualify", disqualifyTeam);
router.patch("/participant/requalify", requalifyTeam);
router.patch("/competition/winner", validateWinner);
router.patch(
  "/competition/deactivate/:competitionId",
  confirmChangesAndDeactivateCompetition
);
router.get("/metric", getMetrics);
router.patch("/role/:id", changeUserRole);

export const adminRouter = router;
