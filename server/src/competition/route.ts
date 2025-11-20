import express from "express";
import {
  fetchAllActiveCompetition,
  fetchAllInActiveCompetition,
  fetchCompetitionsByUser,
  fetchCompetitionWithTeamsAndUserData,
  getCompetitionById,
  joinCompetition,
} from "./controller";

const router = express.Router();

router.get("/active-competition", fetchAllActiveCompetition);
router.get("/inactive-competition", fetchAllInActiveCompetition);
router.get("/user", fetchCompetitionsByUser);
router.get("/:competitionId", fetchCompetitionWithTeamsAndUserData);
router.patch("/join/:competitionId", joinCompetition);
router.get("/single/:competitionId", getCompetitionById);

export const competitionRouter = router;
