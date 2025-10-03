/**
 * @swagger
 * tags:
 *   name: ManGoSet
 *   description: ManGoSet competition management
 */

/**
 * @swagger
 * /man-go-set/create:
 *   post:
 *     summary: Create a new ManGoSet competition
 *     tags: [ManGoSet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - numberOfTeams
 *               - participantCap
 *               - stake
 *               - visibility
 *             properties:
 *               name:
 *                 type: string
 *                 example: Champions Cup
 *               numberOfTeams:
 *                 type: integer
 *                 example: 5
 *               participantCap:
 *                 type: integer
 *                 example: 100
 *               stake:
 *                 type: number
 *                 example: 50
 *               visibility:
 *                 type: string
 *                 enum: [public, private]
 *                 example: public
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-01T10:00:00Z
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-31T18:00:00Z
 *     responses:
 *       201:
 *         description: Competition created successfully
 *       400:
 *         description: Invalid request data
 */

/**
 * @swagger
 * /man-go-set/join/{competitionId}:
 *   post:
 *     summary: Join an existing ManGoSet competition
 *     tags: [ManGoSet]
 *     parameters:
 *       - in: path
 *         name: competitionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Competition ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 teamId:
 *                   type: string
 *                   example: 64b0c7e5f7d89f08fbd9f999
 *                 teamName:
 *                   type: string
 *                   example: Real Madrid
 *                 teamLogo:
 *                   type: string
 *                   example: https://example.com/logo.png
 *                 isStarred:
 *                   type: boolean
 *                   example: true
 *     responses:
 *       200:
 *         description: Successfully joined the competition
 *       400:
 *         description: Invalid team selection or participant limit reached
 *       404:
 *         description: Competition not found
 */

/**
 * @swagger
 * /man-go-set/active:
 *   get:
 *     summary: Fetch all active ManGoSet competitions
 *     tags: [ManGoSet]
 *     responses:
 *       200:
 *         description: List of active competitions
 */
