/**
 * @swagger
 * components:
 *   schemas:
 *     LivescorePaging:
 *       type: object
 *       properties:
 *         current:
 *           type: integer
 *         total:
 *           type: integer
 *
 *     LivescoreMeta:
 *       type: object
 *       properties:
 *         get:
 *           type: string
 *         parameters:
 *           type: object
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *         results:
 *           type: integer
 *         paging:
 *           $ref: "#/components/schemas/LivescorePaging"
 *
 *     # --- Country Schemas ---
 *     Country:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         code:
 *           type: string
 *         flag:
 *           type: string
 *           format: uri
 *
 *     LivescoreCountriesResponse:
 *       allOf:
 *         - $ref: "#/components/schemas/LivescoreMeta"
 *         - type: object
 *           properties:
 *             response:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Country"
 *
 *     # --- League Schemas ---
 *     LeagueCoverageFixtures:
 *       type: object
 *       properties:
 *         events:
 *           type: boolean
 *         lineups:
 *           type: boolean
 *         statistics_fixtures:
 *           type: boolean
 *         statistics_players:
 *           type: boolean
 *
 *     LeagueCoverage:
 *       type: object
 *       properties:
 *         fixtures:
 *           $ref: "#/components/schemas/LeagueCoverageFixtures"
 *         standings:
 *           type: boolean
 *         players:
 *           type: boolean
 *         top_scorers:
 *           type: boolean
 *         top_assists:
 *           type: boolean
 *         top_cards:
 *           type: boolean
 *         injuries:
 *           type: boolean
 *         predictions:
 *           type: boolean
 *         odds:
 *           type: boolean
 *
 *     LeagueSeason:
 *       type: object
 *       properties:
 *         year:
 *           type: integer
 *         start:
 *           type: string
 *           format: date
 *         end:
 *           type: string
 *           format: date
 *         current:
 *           type: boolean
 *         coverage:
 *           $ref: "#/components/schemas/LeagueCoverage"
 *
 *     LeagueInfo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         type:
 *           type: string
 *         logo:
 *           type: string
 *           format: uri
 *
 *     LeagueCountry:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         code:
 *           type: string
 *         flag:
 *           type: string
 *           format: uri
 *
 *     LeagueResponseItem:
 *       type: object
 *       properties:
 *         league:
 *           $ref: "#/components/schemas/LeagueInfo"
 *         country:
 *           $ref: "#/components/schemas/LeagueCountry"
 *         seasons:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/LeagueSeason"
 *
 *     LivescoreLeaguesResponse:
 *       allOf:
 *         - $ref: "#/components/schemas/LivescoreMeta"
 *         - type: object
 *           properties:
 *             response:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/LeagueResponseItem"
 *
 *     # --- Fixtures Schemas ---
 *     FixtureStatus:
 *       type: object
 *       properties:
 *         long:
 *           type: string
 *         short:
 *           type: string
 *         elapsed:
 *           type: integer
 *           nullable: true
 *
 *     FixtureTeamDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         logo:
 *           type: string
 *           format: uri
 *         winner:
 *           type: boolean
 *           nullable: true
 *
 *     FixtureTeams:
 *       type: object
 *       properties:
 *         home:
 *           $ref: "#/components/schemas/FixtureTeamDetail"
 *         away:
 *           $ref: "#/components/schemas/FixtureTeamDetail"
 *
 *     FixtureGoals:
 *       type: object
 *       properties:
 *         home:
 *           type: integer
 *           nullable: true
 *         away:
 *           type: integer
 *           nullable: true
 *
 *     FixtureLeague:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         country:
 *           type: string
 *         logo:
 *           type: string
 *           format: uri
 *         flag:
 *           type: string
 *           format: uri
 *         season:
 *           type: integer
 *         round:
 *           type: string
 *
 *     FixtureItem:
 *       type: object
 *       properties:
 *         fixture:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             referee:
 *               type: string
 *               nullable: true
 *             timezone:
 *               type: string
 *             date:
 *               type: string
 *               format: date-time
 *             timestamp:
 *               type: integer
 *             status:
 *               $ref: "#/components/schemas/FixtureStatus"
 *         league:
 *           $ref: "#/components/schemas/FixtureLeague"
 *         teams:
 *           $ref: "#/components/schemas/FixtureTeams"
 *         goals:
 *           $ref: "#/components/schemas/FixtureGoals"
 *         score:
 *           type: object
 *           additionalProperties: true
 *
 *     # --- Standings Schemas ---
 *     StandingsTeam:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         logo:
 *           type: string
 *           format: uri
 *
 *     StandingsAllStats:
 *       type: object
 *       properties:
 *         played:
 *           type: integer
 *         win:
 *           type: integer
 *         draw:
 *           type: integer
 *         lose:
 *           type: integer
 *         goals:
 *           type: object
 *           properties:
 *             for:
 *               type: integer
 *             against:
 *               type: integer
 *
 *     StandingsRow:
 *       type: object
 *       properties:
 *         rank:
 *           type: integer
 *         team:
 *           $ref: "#/components/schemas/StandingsTeam"
 *         points:
 *           type: integer
 *         goalsDiff:
 *           type: integer
 *         group:
 *           type: string
 *         form:
 *           type: string
 *         status:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         all:
 *           $ref: "#/components/schemas/StandingsAllStats"
 *         home:
 *           $ref: "#/components/schemas/StandingsAllStats"
 *         away:
 *           $ref: "#/components/schemas/StandingsAllStats"
 *         update:
 *           type: string
 *           format: date-time
 *
 *     StandingsLeague:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         country:
 *           type: string
 *         logo:
 *           type: string
 *           format: uri
 *         flag:
 *           type: string
 *           format: uri
 *         season:
 *           type: integer
 *         standings:
 *           type: array
 *           items:
 *             type: array
 *             items:
 *               $ref: "#/components/schemas/StandingsRow"
 *
 *     # --- Rounds Schema ---
 *     RoundItem:
 *       type: string
 *
 *     # --- Player Stats Schemas ---
 *     PlayerItem:
 *       type: object
 *       properties:
 *         player:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             firstname:
 *               type: string
 *             lastname:
 *               type: string
 *             age:
 *               type: integer
 *             birth:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   format: date
 *                 place:
 *                   type: string
 *                 country:
 *                   type: string
 *             nationality:
 *               type: string
 *             height:
 *               type: string
 *             weight:
 *               type: string
 *             injured:
 *               type: boolean
 *             photo:
 *               type: string
 *               format: uri
 *         statistics:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               team:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   logo:
 *                     type: string
 *                     format: uri
 *               league:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   country:
 *                     type: string
 *                   logo:
 *                     type: string
 *                     format: uri
 *                   flag:
 *                     type: string
 *                     format: uri
 *                   season:
 *                     type: integer
 *               games:
 *                 type: object
 *                 properties:
 *                   minutes:
 *                     type: integer
 *                   number:
 *                     type: integer
 *                   position:
 *                     type: string
 *                   rating:
 *                     type: string
 *                   captain:
 *                     type: boolean
 *               substitutes:
 *                 type: object
 *               shots:
 *                 type: object
 *               goals:
 *                 type: object
 *               passes:
 *                 type: object
 *               tackles:
 *                 type: object
 *               duels:
 *                 type: object
 *               dribbles:
 *                 type: object
 *               fouls:
 *                 type: object
 *               cards:
 *                 type: object
 *               penalty:
 *                 type: object
 *
 *     # --- Lineups & Events Schemas ---
 *     LineupPlayer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         number:
 *           type: integer
 *         pos:
 *           type: string
 *         grid:
 *           type: string
 *           nullable: true
 *
 *     LineupTeam:
 *       type: object
 *       properties:
 *         team:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             logo:
 *               type: string
 *               format: uri
 *             colors:
 *               type: object
 *               additionalProperties: true
 *         coach:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             photo:
 *               type: string
 *               format: uri
 *         formation:
 *           type: string
 *         startXI:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               player:
 *                 $ref: "#/components/schemas/LineupPlayer"
 *         substitutes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               player:
 *                 $ref: "#/components/schemas/LineupPlayer"
 *
 *     FixtureEvent:
 *       type: object
 *       properties:
 *         time:
 *           type: object
 *           properties:
 *             elapsed:
 *               type: integer
 *             extra:
 *               type: integer
 *               nullable: true
 *         team:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             logo:
 *               type: string
 *               format: uri
 *         player:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         assist:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               nullable: true
 *             name:
 *               type: string
 *               nullable: true
 *         type:
 *           type: string
 *         detail:
 *           type: string
 *         comments:
 *           type: string
 *           nullable: true
 *
 *     FixtureStatistic:
 *       type: object
 *       properties:
 *         team:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             logo:
 *               type: string
 *               format: uri
 *         statistics:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               value:
 *                 oneOf:
 *                   - type: integer
 *                   - type: string
 *                   - type: null
 *
 *     # --- Response Schemas for each endpoint ---
 *     LivescoreFixturesResponse:
 *       allOf:
 *         - $ref: "#/components/schemas/LivescoreMeta"
 *         - type: object
 *           properties:
 *             response:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/FixtureItem"
 *
 *     LivescoreStandingsResponse:
 *       allOf:
 *         - $ref: "#/components/schemas/LivescoreMeta"
 *         - type: object
 *           properties:
 *             response:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/StandingsLeague"
 *
 *     LivescoreRoundsResponse:
 *       allOf:
 *         - $ref: "#/components/schemas/LivescoreMeta"
 *         - type: object
 *           properties:
 *             response:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/RoundItem"
 *
 *     LivescoreLineupsResponse:
 *       allOf:
 *         - $ref: "#/components/schemas/LivescoreMeta"
 *         - type: object
 *           properties:
 *             response:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/LineupTeam"
 *
 *     LivescoreEventsResponse:
 *       allOf:
 *         - $ref: "#/components/schemas/LivescoreMeta"
 *         - type: object
 *           properties:
 *             response:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/FixtureEvent"
 *
 *     LivescoreStatisticsResponse:
 *       allOf:
 *         - $ref: "#/components/schemas/LivescoreMeta"
 *         - type: object
 *           properties:
 *             response:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/FixtureStatistic"
 *
 *     LivescorePlayersStatsResponse:
 *       allOf:
 *         - $ref: "#/components/schemas/LivescoreMeta"
 *         - type: object
 *           properties:
 *             response:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/PlayerItem"
 */
