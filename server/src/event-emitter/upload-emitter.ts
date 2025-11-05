// events/proofEvents.ts
import EventEmitter from "node:events";
import { uploadToS3 } from "../file-upload";
import competition from "../models/competition";
import TeamSelection from "../models/teams";

const proofEmitter = new EventEmitter();
proofEmitter.setMaxListeners(1);

// Handle upload job
proofEmitter.on(
  "upload-proof",
  async (payload: {
    competitionId: string;
    userId: string;
    files: Express.Multer.File[];
    steps: { id: string; description: string; imageCount: number }[];
  }) => {
    try {
      const { competitionId, userId, files, steps } = payload;

      // Find or create the user's team selection
      let teamSelection = await TeamSelection.findOne({
        competition: competitionId,
        user: userId,
      });

      if (!teamSelection) {
        teamSelection = new TeamSelection({
          competition: competitionId,
          user: userId,
          proofs: [],
        });
      }

      // Upload each file to S3
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) continue;
        const stepId = steps[i]!.id;

        const fileUrl = await uploadToS3(
          file,
          `competitions/${competitionId}/proofs`
        );

        teamSelection.proofs.push({
          step: stepId,
          url: fileUrl,
          verified: false,
        });
      }

      // Update participant array in competition
      await competition.findByIdAndUpdate(
        competitionId,
        { $push: { participants: { user: userId, status: "pending" } } },
        { new: true }
      );

      await teamSelection.save();
      console.log(
        `Proofs uploaded for user ${userId} in competition ${competitionId}`
      );
    } catch (err) {
      console.error("Upload proof failed:", err);
    }
  }
);

export default proofEmitter;
