/**
 * @swagger
 * /competition/active-competition:
 *   get:
 *     summary: Get active competitions
 *     description: Retrieve a paginated list of all active competitions. Requires authentication.
 *     tags: [Competitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved active competitions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActiveCompetitionsResponse'
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 */

/**
 * @swagger
 * /competition/inactive-competition:
 *   get:
 *     summary: Get inactive competitions
 *     description: Retrieve a paginated list of all inactive competitions. Requires authentication.
 *     tags: [Competitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved inactive competitions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActiveCompetitionsResponse'
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 */

/**
 * @swagger
 * /competition/user:
 *   get:
 *     summary: Get user's competitions
 *     description: Retrieve a paginated list of competitions for the authenticated user
 *     tags: [Competitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, all]
 *           default: all
 *         description: Filter competitions by status
 *     responses:
 *       200:
 *         description: Successfully retrieved user's competitions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActiveCompetitionsResponse'
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 */

/**
 * @swagger
 * /competition/{competitionId}:
 *   get:
 *     summary: Get competition details by ID
 *     description: Retrieve detailed information about a specific competition including participants with their teams and scores
 *     tags: [Competitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: competitionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the competition to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved competition details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompetitionDetailResponse'
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Competition not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Competition not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 */

/**
 * @swagger
 * /competition/join/{competitionId}:
 *   patch:
 *     summary: Join a competition
 *     description: Join an active competition by submitting team selections. For ManGoSet competitions, entry fee will be deducted.
 *     tags: [Competitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: competitionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the competition to join
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - fixtureId
 *                 - team
 *                 - opponent
 *               properties:
 *                 fixtureId:
 *                   type: string
 *                   example: "1440822"
 *                 team:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1045
 *                     name:
 *                       type: string
 *                       example: "Tanta SC"
 *                     logo:
 *                       type: string
 *                       format: uri
 *                       example: "https://media.api-sports.io/football/teams/1045.png"
 *                 opponent:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1048
 *                     name:
 *                       type: string
 *                       example: "Aswan Sc"
 *                     logo:
 *                       type: string
 *                       format: uri
 *                       example: "https://media.api-sports.io/football/teams/1048.png"
 *                 matchVenue:
 *                   type: string
 *                   example: "Tanta Stadium"
 *                 isStarred:
 *                   type: boolean
 *                   example: true
 *             minItems: 1
 *           example:
 *             - fixtureId: "1440822"
 *               team:
 *                 id: 1045
 *                 name: "Tanta SC"
 *                 logo: "https://media.api-sports.io/football/teams/1045.png"
 *               opponent:
 *                 id: 1048
 *                 name: "Aswan Sc"
 *                 logo: "https://media.api-sports.io/football/teams/1048.png"
 *               matchVenue: "Tanta Stadium"
 *               isStarred: true
 *             - fixtureId: "1440823"
 *               team:
 *                 id: 18021
 *                 name: "Asyut Petrol"
 *                 logo: "https://media.api-sports.io/football/teams/18021.png"
 *               opponent:
 *                 id: 20461
 *                 name: "Proxy"
 *                 logo: "https://media.api-sports.io/football/teams/20461.png"
 *               matchVenue: "Asyut University Stadium"
 *               isStarred: false
 *     responses:
 *       200:
 *         description: Successfully joined the competition
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully joined the competition"
 *                 teamSelection:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     competition:
 *                       type: string
 *                     user:
 *                       type: string
 *                     teams:
 *                       type: array
 *                     starTeam:
 *                       type: string
 *                     totalPoints:
 *                       type: number
 *                     stepsVerified:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "fail"
 *                 message:
 *                   type: string
 *             examples:
 *               entryFeeDeductionFailed:
 *                 value:
 *                   status: "fail"
 *                   message: "Insufficient DitioCoin balance"
 *               participantLimitReached:
 *                 value:
 *                   status: "fail"
 *                   message: "Competition participant limit reached"
 *               invalidTeamSelection:
 *                 value:
 *                   status: "fail"
 *                   message: "You must select between 3 and 20 teams"
 *               multipleStarFixtures:
 *                 value:
 *                   status: "fail"
 *                   message: "You can only star one fixture"
 *               noStarFixture:
 *                 value:
 *                   status: "fail"
 *                   message: "You must select one star fixture"
 *               starFixtureTaken:
 *                 value:
 *                   status: "fail"
 *                   message: "That starred fixture has already been taken by another participant in this competition."
 *       404:
 *         description: Competition not found or inactive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "fail"
 *                 message:
 *                   type: string
 *             example:
 *               status: "fail"
 *               message: "Competition not found or inactive"
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 */

/**
 * @swagger
 * /competition/single/{competitionId}:
 *   get:
 *     summary: Get competition by ID
 *     description: Retrievecompetion by id
 *     tags: [Competitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: competitionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the competition to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved competition details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BasicCompetition'
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Competition not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   example: "Competition not found"
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 */
