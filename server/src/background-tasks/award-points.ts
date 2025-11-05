import { Fixture } from "../livescore/types";
import { logger } from "../logger";
import FixtureChunk from "../models/result-tracker";
import {
  fetchFixtures,
  getFormatedFixturesId,
  getOngoingCompetitionFixtureIds,
} from "./utils";
import Competition from "../models/competition";
import TeamSelection from "../models/teams";

export async function indexFixtures(): Promise<void> {
  try {
    const fixtureIdArray = await getOngoingCompetitionFixtureIds();

    if (!fixtureIdArray.length) {
      logger.info("No fixtures to index — no ongoing competitions");
      return;
    }

    //Step 2: Check what’s already indexed today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayChunks = await FixtureChunk.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const alreadyIndexedIds = new Set(
      todayChunks.flatMap((chunk) =>
        chunk.fixtures.map((f) => String(f.fixtureId))
      )
    );

    //Step 3: Only keep new IDs
    const newFixtureIds = fixtureIdArray.filter(
      (id) => !alreadyIndexedIds.has(id)
    );

    if (!newFixtureIds.length) {
      logger.info("All fixtures already indexed for today.");
      return;
    }

    const formattedIds = getFormatedFixturesId(newFixtureIds);

    //Step 4: Fetch and save new chunks
    for (const ids of formattedIds) {
      try {
        const scoresData = await fetchFixtures(ids);
        const fixtures = scoresData.response;

        const mappedFixtures = fixtures.map((f: Fixture) => ({
          fixtureId: f.fixture.id,
          date: new Date(f.fixture.date),
          status: {
            short: f.fixture.status.short,
            long: f.fixture.status.long,
            elapsed: f.fixture.status.elapsed ?? null,
          },
          teams: {
            home: {
              id: f.teams.home.id,
              name: f.teams.home.name,
              logo: f.teams.home.logo,
              winner: f.teams.home.winner ?? null,
            },
            away: {
              id: f.teams.away.id,
              name: f.teams.away.name,
              logo: f.teams.away.logo,
              winner: f.teams.away.winner ?? null,
            },
          },
          score: {
            halftime: {
              home: f.score.halftime.home ?? null,
              away: f.score.halftime.away ?? null,
            },
            fulltime: {
              home: f.score.fulltime.home ?? null,
              away: f.score.fulltime.away ?? null,
            },
          },
        }));

        await FixtureChunk.create({
          fixtureIds: ids,
          fixtures: mappedFixtures,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        logger.info(`Indexed ${fixtures.length} new fixtures [${ids}]`);
      } catch (err) {
        logger.error(`Failed to index fixtures [${ids}]`, err);
      }
    }

    logger.info("indexFixtures completed successfully");
  } catch (err) {
    logger.error("indexFixtures failed:", err);
  }
}

export async function updateTodayFixtureChunks() {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Find all FixtureChunks created today
    const todayChunks = await FixtureChunk.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!todayChunks.length) {
      console.log("No fixture chunks created today.");
      return;
    }

    logger.info(`Updating ${todayChunks.length} fixture chunks from today...`);

    //Loop through each chunk and update it
    for (const chunk of todayChunks) {
      try {
        // Fetch latest data for this chunk
        const scoresData = await fetchFixtures(chunk.fixtureIds);
        const fixtures = scoresData.response;

        // Map API fixtures into schema-compatible format
        const mappedFixtures = fixtures.map((f: Fixture) => ({
          fixtureId: f.fixture.id,
          date: new Date(f.fixture.date),
          status: {
            short: f.fixture.status.short,
            long: f.fixture.status.long,
            elapsed: f.fixture.status.elapsed ?? null,
          },
          teams: {
            home: {
              id: f.teams.home.id,
              name: f.teams.home.name,
              logo: f.teams.home.logo,
              winner: f.teams.home.winner ?? null,
            },
            away: {
              id: f.teams.away.id,
              name: f.teams.away.name,
              logo: f.teams.away.logo,
              winner: f.teams.away.winner ?? null,
            },
          },
          score: {
            halftime: {
              home: f.score.halftime.home ?? null,
              away: f.score.halftime.away ?? null,
            },
            fulltime: {
              home: (f.goals.home || f.score.fulltime.home) ?? null,
              away: (f.goals.away || f.score.fulltime.away) ?? null,
            },
          },
        }));

        //Update the chunk document
        chunk.fixtures = mappedFixtures;
        await chunk.save();

        logger.info(`Updated fixture chunk for IDs: ${chunk.fixtureIds}`);
      } catch (err) {
        logger.error(`Failed to update chunk ${chunk.fixtureIds}`, err);
      }
    }

    logger.info("Finished updating all today's fixture chunks.");
  } catch (error) {
    logger.error("Error in updateTodayFixtureChunks:", error);
  }
}

export async function awardPoints(): Promise<void> {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    console.log("Fetching fixture chunks for today...");
    const todayChunks = await FixtureChunk.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!todayChunks.length) {
      console.log("No fixture chunks found for today.");
      return;
    }

    const allFixtures = todayChunks.flatMap((c) => c.fixtures);
    const fixtureMap = new Map<number, any>(
      allFixtures.map((f) => [Number(f.fixtureId), f])
    );

    const FINISHED_STATUSES = new Set(["FT", "AET", "PEN"]);
    const LIVE_STATUSES = new Set(["1H", "2H", "HT", "ET", "LIVE"]);

    const competitions = await Competition.find({
      startDate: { $lte: endOfDay },
      endDate: { $gte: startOfDay },
      isActive: true,
    });

    if (!competitions.length) {
      console.log("No active competitions found today.");
      return;
    }

    for (const comp of competitions) {
      const selections = await TeamSelection.find({ competition: comp._id });
      if (!selections.length) continue;

      const bulkOps: any[] = [];

      for (const sel of selections) {
        let teamPoints = sel.teamPoints || [];

        // ✅ Initialize if missing
        if (!teamPoints.length && Array.isArray(sel.teams)) {
          teamPoints = sel.teams.map((t) => ({
            fixtureId: Number(t.fixtureId),
            score: { home: 0, away: 0 },
            points: 0,
            isLive: false,
            isFT: false,
          }));
        }

        // ✅ Update points from fixture data
        const updatedTeamPoints = teamPoints.map((tp) => {
          const fixture = fixtureMap.get(Number(tp.fixtureId));
          if (!fixture) return tp;

          const halftime = fixture?.score?.halftime ?? {};
          const fulltime = fixture?.score?.fulltime ?? {};

          const homeGoals =
            fulltime.home !== undefined && fulltime.home !== null
              ? Number(fulltime.home)
              : Number(halftime.home ?? 0);
          const awayGoals =
            fulltime.away !== undefined && fulltime.away !== null
              ? Number(fulltime.away)
              : Number(halftime.away ?? 0);

          const statusShort: string = fixture.status?.short ?? "";
          const isFT = FINISHED_STATUSES.has(statusShort);
          const isLive = LIVE_STATUSES.has(statusShort);
          const points = (homeGoals ?? 0) + (awayGoals ?? 0);

          return {
            fixtureId: Number(tp.fixtureId),
            score: { home: homeGoals, away: awayGoals },
            points,
            isLive,
            isFT,
          };
        });

        const totalPoints = updatedTeamPoints.reduce(
          (sum, tp) => sum + (tp.points || 0),
          0
        );

        //Replace entire teamPoints array for reliability
        bulkOps.push({
          updateOne: {
            filter: { _id: sel._id },
            update: {
              $set: {
                teamPoints: updatedTeamPoints,
                totalPoints,
                updatedAt: new Date(),
              },
            },
          },
        });
      }

      //Execute all updates
      if (bulkOps.length) {
        const result = await TeamSelection.bulkWrite(bulkOps, {
          ordered: false,
        });
        console.log(
          `🏆 Updated ${result.modifiedCount} selections for ${comp.name}`
        );
      }

      //Recalculate ranks
      const rankedSelections = await TeamSelection.find({
        competition: comp._id,
      })
        .sort({ totalPoints: -1 })
        .select("_id totalPoints");

      if (rankedSelections.length) {
        const rankOps = rankedSelections.map((sel, i) => ({
          updateOne: {
            filter: { _id: sel._id },
            update: { $set: { rank: i + 1 } },
          },
        }));

        await TeamSelection.bulkWrite(rankOps, { ordered: false });
        console.log(`🏁 Updated ranks for ${comp.name}`);
      }
    }

    console.log("Points, scores, and ranks updated successfully!");
  } catch (err) {
    console.error("Error updating competition points:", err);
  }
}
