import express from "express";
import {
  fetchAllActiveCompetition,
  fetchCompetitionWithTeamsAndUserData,
} from "./controller";

const router = express.Router();

router.get("/active-competition", fetchAllActiveCompetition);
router.get("/:competitionId", fetchCompetitionWithTeamsAndUserData);

export const competitionRouter = router;
