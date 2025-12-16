import { NextFunction, Response } from "express";
import Competition from "../../models/competition";
import { AuthenticatedRequest } from "../../middleware/session";

export async function createLeague(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const {
    name,
    numberOfTeams,
    participantCap,
    prizePool,
    entryFee,
    startDate,
    endDate,
    leagueConfig,
  } = req.body;
  try {
    const competition = new Competition({
      name,
      type: "League",
      createdBy: req.user?.id,
      requiredTeams: numberOfTeams,
      participantCap,
      prizePool,
      entryFee,
      startDate,
      endDate,
      leagueConfig,
    });

    await competition.save();
    res.status(201).json(competition);
  } catch (error) {
    next(error);
  }
}
