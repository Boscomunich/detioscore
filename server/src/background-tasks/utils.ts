import { Fixture, FootballApiResponse } from "../livescore/types";
import { fetchFootballData } from "../livescore/utils";
import Competition from "../models/competition";
import TeamSelection from "../models/teams";

export async function getOngoingCompetitionFixtureIds(): Promise<string[]> {
  const today = new Date();

  // Get competitions that are ongoing
  const competitions = await Competition.find({
    startDate: { $lte: today },
    endDate: { $gte: today },
  });

  if (!competitions.length) {
    console.log("No ongoing competitions");
    return [];
  }

  const allFixtureIds: string[] = [];

  for (const competition of competitions) {
    const teamSelections = await TeamSelection.find({
      competition: competition._id,
    });

    const fixtureIds = teamSelections.flatMap((ts) =>
      ts.teams.map((t) => t.fixtureId)
    );

    allFixtureIds.push(...fixtureIds);
  }

  //remove Deduplicate before returning
  return [...new Set(allFixtureIds)];
}

export function getFormatedFixturesId(idArray: string[]) {
  if (!idArray.length) return [];

  const chunkSize = 20;
  const result: string[] = [];

  for (let i = 0; i < idArray.length; i += chunkSize) {
    const chunk = idArray.slice(i, i + chunkSize);
    const joined = chunk.join("-");
    result.push(joined);
  }

  return result;
}

export async function fetchFixtures(
  ids: string
): Promise<FootballApiResponse<Fixture>> {
  const query: Record<string, string> = { ids };
  const { data } = await fetchFootballData<Fixture>("fixtures", query);
  return data;
}
