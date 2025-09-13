import express from "express";
import {
  fetchAllCountries,
  fetchDailyFixtures,
  fetchFixtureEvents,
  fetchFixtureH2H,
  fetchFixtures,
  fetchFixturesRounds,
  fetchFixtureStatistics,
  fetchLeagues,
  fetchLeagueStandings,
  fetchLineUps,
  fetchLiveFixtures,
} from "./controller";

const router = express.Router();

router.get("/get-countries", fetchAllCountries);
router.get("/get-leagues", fetchLeagues);
router.get("/get-standings", fetchLeagueStandings);
router.get("/get-rounds", fetchFixturesRounds);
router.get("/get-fixtures", fetchFixtures);
router.get("/get-live", fetchLiveFixtures);
router.get("/get-lineups", fetchLineUps);
router.get("/get-daily-fixtures", fetchDailyFixtures);
router.get("/get-fixture-event/:id", fetchFixtureEvents);
router.get("/get-fixture-h2h", fetchFixtureH2H);
router.get("/get-fixture-statistics", fetchFixtureStatistics);

export const livescoreRouter = router;
