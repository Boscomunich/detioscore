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

  // Deduplicate before returning
  return [...new Set(allFixtureIds)];
}

export async function getFormatedFixturesId(): Promise<string[]> {
  const idArray = await getOngoingCompetitionFixtureIds();

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

// export async function fetchFixtures(ids: string) {
//   const query: Record<string, string> = {
//     ids,
//   };
//   const response = await fetchFootballData("fixtures", query);
//   return response.data;
// }
