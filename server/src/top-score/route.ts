import express from "express";
import {
  createTopScore,
  fetchActiveTopScoreCompetition,
  uploadValidationProof,
} from "./controller";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post(
  "/upload-proof/:competitionId",
  upload.array("images"),
  uploadValidationProof
);
router.post("/create", createTopScore);
router.get("/active-competition", fetchActiveTopScoreCompetition);

export const topScoreRouter = router;
