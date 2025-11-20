import { Request, Response, NextFunction } from "express";
import Competition from "../../models/competition";
import TeamSelection from "../../models/teams";
import User from "../../models/user";
import AppError from "../../middleware/error";

export async function getCompetitionParticipant(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { competitionId } = req.params;

    const competition = await Competition.findById(competitionId)
      .populate({
        path: "participants.user",
        model: "User",
        select: "username email role",
      })
      .populate({
        path: "createdBy",
        model: "User",
        select: "username email role",
      })
      .populate({
        path: "winner",
        model: "User",
        select: "username email role",
      });

    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    // Fetch TeamSelection for participants, safely handling null users
    const participantsWithTeams = await Promise.all(
      competition.participants.map(async (participant: any) => {
        // Skip participants whose user was deleted
        if (!participant.user) return null;

        const teamData = await TeamSelection.findOne({
          competition: competitionId,
          user: participant.user._id,
        }).select("-__v -updatedAt");

        return {
          user: participant.user,
          status: participant.status,
          joinedAt: participant.joinedAt,
          teamData: teamData || null,
        };
      })
    );

    // Filter out null participants
    const filteredParticipants = participantsWithTeams.filter(Boolean);

    return res.status(200).json({
      competition,
      participants: filteredParticipants,
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyUserTasks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { teamId, verified, proofs } = req.body;

    if (!teamId) {
      throw new AppError("Team not found", 404);
    }

    const team = await TeamSelection.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    // ✅ Case 1: Admin provided updated proofs array — verify individually
    if (Array.isArray(proofs) && proofs.length > 0) {
      team.proofs = team.proofs.map((existingProof) => {
        const updated = proofs.find((p) => p.step === existingProof.step);
        if (updated) {
          return {
            ...existingProof,
            verified:
              typeof updated.verified === "boolean"
                ? updated.verified
                : existingProof.verified,
            url: updated.url || existingProof.url,
          };
        }
        return existingProof;
      });
    }

    //No array provided — apply one verified flag to all
    else if (typeof verified === "boolean") {
      team.proofs = team.proofs.map((proof) => ({
        ...proof,
        verified,
      }));
    }

    //After updating proofs, recalculate if all are verified
    const allVerified =
      team.proofs.length > 0 && team.proofs.every((p) => p.verified === true);

    team.stepsVerified = allVerified;

    await team.save();

    return res.status(200).json({
      message: allVerified
        ? "All proofs verified successfully."
        : "Some proofs remain unverified.",
      stepsVerified: team.stepsVerified,
      proofs: team.proofs,
    });
  } catch (error) {
    console.error("Error verifying user tasks:", error);
    next(error);
  }
}

export async function disqualifyTeam(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { teamId } = req.body;

    const team = await TeamSelection.findById(teamId);
    if (!team) {
      throw new AppError("Team not found", 404);
    }

    // ✅ Disqualify if any proof is unverified or missing
    const allVerified =
      team.proofs.length > 0 && team.proofs.every((p) => p.verified === true);

    if (!allVerified) {
      team.isDisqualified = true;
      await team.save();
      return res.status(200).json({
        message: "Team has been disqualified due to unverified proofs.",
        isDisqualified: true,
      });
    }

    // If all verified, ensure disqualified flag is false
    team.isDisqualified = false;
    await team.save();

    return res.status(200).json({
      message: "Team verified successfully and not disqualified.",
      isDisqualified: false,
    });
  } catch (error) {
    console.error("Error disqualifying team:", error);
    next(error);
  }
}

export async function requalifyTeam(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { teamId } = req.body;

    const team = await TeamSelection.findById(teamId);
    if (!team) {
      throw new AppError("Team not found", 404);
    }

    // ✅ Check if all proofs are verified before requalifying
    const allVerified =
      team.proofs.length > 0 && team.proofs.every((p) => p.verified === true);

    if (!allVerified) {
      return res.status(400).json({
        message: "Cannot requalify team — not all proofs are verified.",
      });
    }

    team.isDisqualified = false;
    team.stepsVerified = true;

    await team.save();

    return res.status(200).json({
      message: "Team successfully requalified.",
      team,
    });
  } catch (error) {
    console.error("Error requalifying team:", error);
    next(error);
  }
}

export async function validateWinner(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { competitionId, userId } = req.body;

  try {
    const competition = await Competition.findById(competitionId);
    if (!competition) throw new AppError("Competition not found.", 404);

    //check that the user is a participant
    const isParticipant = competition.participants.some(
      (p) => p.user.toString() === userId
    );

    if (!isParticipant)
      throw new AppError(
        "This user is not a participant in the competition.",
        404
      );

    competition.winner = userId;
    await competition.save();

    return res.status(200).json({
      message: "Winner updated successfully.",
      competition: {
        id: competition._id,
        name: competition.name,
        winner: competition.winner,
      },
    });
  } catch (error) {
    console.error("Error validating winner:", error);
    next(error);
  }
}

export async function deactivateCompetition(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { competitionId } = req.body;
  try {
    const competition = await Competition.findById(competitionId);
    if (!competition) throw new AppError("Competition not found.", 404);
    competition.isActive = false;
    await competition.save();

    return res.status(200).json({
      message: "Competition deactivated successfully.",
    });
  } catch (error) {
    next(error);
  }
}
