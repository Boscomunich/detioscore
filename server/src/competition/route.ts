import express from "express";
import {
  fetchAllActiveCompetition,
  fetchCompetitionsByUser,
  fetchCompetitionWithTeamsAndUserData,
} from "./controller";

const router = express.Router();

router.get("/active-competition", fetchAllActiveCompetition);
router.get("/user", fetchCompetitionsByUser);
router.get("/:competitionId", fetchCompetitionWithTeamsAndUserData);

export const competitionRouter = router;
