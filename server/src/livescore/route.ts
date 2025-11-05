import express from "express";
import {
  fetchAllCountries,
  fetchCurrentFixtureRounds,
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
  fetchTopAssisters,
  fetchTopRedCards,
  fetchTopScorers,
  fetchTopYellowCards,
} from "./controller";

const router = express.Router();

router.get("/countries", fetchAllCountries);
router.get("/leagues", fetchLeagues);
router.get("/standings", fetchLeagueStandings);
router.get("/rounds", fetchFixturesRounds);
router.get("/rounds/current", fetchCurrentFixtureRounds);
router.get("/fixtures", fetchFixtures);
router.get("/live", fetchLiveFixtures);
router.get("/lineups", fetchLineUps);
router.get("/daily-fixtures", fetchDailyFixtures);
router.get("/fixture-event/:id", fetchFixtureEvents);
router.get("/fixture-h2h", fetchFixtureH2H);
router.get("/fixture-statistics", fetchFixtureStatistics);
router.get("/stats/players/topscorers", fetchTopScorers);
router.get("/stats/players/topassisters", fetchTopAssisters);
router.get("/stats/players/yellowcards", fetchTopYellowCards);
router.get("/stats/players/redcards", fetchTopRedCards);

export const livescoreRouter = router;
