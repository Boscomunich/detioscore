import express from "express";
import { fetchAllActiveCompetition } from "./controller";

const router = express.Router();

router.get("/active-competition", fetchAllActiveCompetition);

export const competitionRouter = router;
