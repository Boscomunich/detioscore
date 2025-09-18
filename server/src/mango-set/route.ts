import express from "express";
import {
  createMangoSet,
  fetchActiveManGoSetCompetition,
  joinManGoSetCompetition,
} from "./controller";

const router = express.Router();

router.post("/create", createMangoSet);
router.get("/active-competition", fetchActiveManGoSetCompetition);
router.post("/join/:competitionId", joinManGoSetCompetition);

export const manGoSetRouter = router;
