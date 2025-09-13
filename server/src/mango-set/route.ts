import express from "express";
import { createMangoSet, fetchActiveManGoSetCompetition } from "./controller";

const router = express.Router();

router.post("/create", createMangoSet);
router.get("/active-competition", fetchActiveManGoSetCompetition);

export const manGoSetRouter = router;
