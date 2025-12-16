/**
 * @swagger
 * /livescore/countries:
 *   get:
 *     summary: Get all football countries
 *     description: Retrieves all football countries from the Livescore API.
 *     tags: [Livescore]
 *     responses:
 *       200:
 *         description: Countries fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LivescoreCountriesResponse"
 *       500:
 *         description: Failed to fetch countries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /livescore/leagues:
 *   get:
 *     summary: Fetch leagues by country
 *     description: Retrieves active football leagues for a given country.
 *     tags: [Livescore]
 *     parameters:
 *       - in: query
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leagues fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LivescoreLeaguesResponse"
 *       400:
 *         description: Missing required query parameter
 *       500:
 *         description: Failed to fetch leagues
 */

/**
 * @swagger
 * /livescore/standings:
 *   get:
 *     summary: Fetch league standings
 *     description: Retrieves standings for a specific league and season.
 *     tags: [Livescore]
 *     parameters:
 *       - in: query
 *         name: leagueId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: season
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Standings fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LivescoreStandingsResponse"
 *       500:
 *         description: Failed to fetch standings
 */

/**
 * @swagger
 * /livescore/rounds:
 *   get:
 *     summary: Fetch fixture rounds
 *     description: Retrieves all fixture rounds for a league and season.
 *     tags: [Livescore]
 *     parameters:
 *       - in: query
 *         name: leagueId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: season
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fixture rounds fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LivescoreRoundsResponse"
 *       500:
 *         description: Failed to fetch fixture rounds
 */

/**
 * @swagger
 * /livescore/rounds/current:
 *   get:
 *     summary: Fetch current fixture round
 *     description: Retrieves the current round for a league and season.
 *     tags: [Livescore]
 *     parameters:
 *       - in: query
 *         name: leagueId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: season
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Current fixture round fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LivescoreRoundsResponse"
 *       500:
 *         description: Failed to fetch fixture rounds
 */

/**
 * @swagger
 * /livescore/fixtures:
 *   get:
 *     summary: Fetch fixtures
 *     description: Retrieves fixtures by league, season, and optional filters.
 *     tags: [Livescore]
 *     parameters:
 *       - in: query
 *         name: leagueId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: season
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: round
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Fixtures fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LivescoreFixturesResponse"
 *       500:
 *         description: Failed to fetch fixtures
 */

/**
 * @swagger
 * /livescore/live:
 *   get:
 *     summary: Fetch live fixtures
 *     description: Retrieves all currently live fixtures, optionally filtered by league and season.
 *     tags: [Livescore]
 *     parameters:
 *       - in: query
 *         name: leagueId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: season
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Live fixtures fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LivescoreFixturesResponse"
 *       500:
 *         description: Failed to fetch live fixtures
 */

/**
 * @swagger
 * /livescore/daily-fixtures:
 *   get:
 *     summary: Fetch daily fixtures
 *     description: Retrieves fixtures scheduled for a specific date.
 *     tags: [Livescore]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: timezone
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: leagueId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: season
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Daily fixtures fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LivescoreFixturesResponse"
 *       500:
 *         description: Failed to fetch daily fixtures
 */

/**
 * @swagger
 * /livescore/lineups:
 *   get:
 *     summary: Fetch fixture lineups
 *     tags: [Livescore]
 *     parameters:
 *       - in: query
 *         name: fixtureId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lineups fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LivescoreLineupsResponse"
 *       500:
 *         description: Failed to fetch lineups
 */

/**
 * @swagger
 * /livescore/fixture-event/{id}:
 *   get:
 *     summary: Fetch fixture events
 *     tags: [Livescore]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fixture events fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LivescoreEventsResponse"
 *       500:
 *         description: Failed to fetch fixture events
 */

/**
 * @swagger
 * /livescore/fixture-h2h:
 *   get:
 *     summary: Fetch head-to-head fixtures
 *     tags: [Livescore]
 *     parameters:
 *       - in: query
 *         name: homeId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: awayId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Head-to-head data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LivescoreFixturesResponse"
 *       500:
 *         description: Failed to fetch head-to-head data
 */

/**
 * @swagger
 * /livescore/fixture-statistics:
 *   get:
 *     summary: Fetch fixture statistics
 *     tags: [Livescore]
 *     parameters:
 *       - in: query
 *         name: fixtureId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fixture statistics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LivescoreStatisticsResponse"
 *       500:
 *         description: Failed to fetch fixture statistics
 */

/**
 * @swagger
 * /livescore/stats/players/topscorers:
 *   get:
 *     summary: Fetch top scorers
 *     tags: [Livescore]
 *     parameters:
 *       - in: query
 *         name: leagueId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: season
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Top scorers fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LivescorePlayersStatsResponse"
 *       500:
 *         description: Failed to fetch top scorers
 */

/**
 * @swagger
 * /livescore/stats/players/topassisters:
 *   get:
 *     summary: Fetch top assisters
 *     tags: [Livescore]
 *     parameters:
 *       - in: query
 *         name: leagueId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: season
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Top assisters fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LivescorePlayersStatsResponse"
 *       500:
 *         description: Failed to fetch top assisters
 */

/**
 * @swagger
 * /livescore/stats/players/yellowcards:
 *   get:
 *     summary: Fetch top yellow carded players
 *     tags: [Livescore]
 *     parameters:
 *       - in: query
 *         name: leagueId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: season
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Top yellow carded players fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LivescorePlayersStatsResponse"
 *       500:
 *         description: Failed to fetch top yellow carded players
 */

/**
 * @swagger
 * /livescore/stats/players/redcards:
 *   get:
 *     summary: Fetch top red carded players
 *     tags: [Livescore]
 *     parameters:
 *       - in: query
 *         name: leagueId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: season
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Top red carded players fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LivescorePlayersStatsResponse"
 *       500:
 *         description: Failed to fetch top red carded players
 */
