/**
 * @swagger
 * /top-score/create:
 *   post:
 *     summary: Create a new TopScore competition
 *     description: |
 *       Creates a new TopScore competition.
 *       The authenticated user will be automatically added as a participant with "pending" status.
 *       The user's DitioCoin balance will be reduced by the specified price (host contribution).
 *     tags:
 *       - TopScore
 *     security:
 *       - bearerAuth: []
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
 *               - price
 *               - visibility
 *               - rules
 *               - startDate
 *               - endDate
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the competition
 *                 example: "Champions Cup Matchday 5"
 *               numberOfTeams:
 *                 type: integer
 *                 description: Number of teams required for each participant
 *                 minimum: 1
 *                 example: 3
 *               participantCap:
 *                 type: integer
 *                 description: Maximum number of participants allowed
 *                 minimum: 1
 *                 example: 60
 *               price:
 *                 type: number
 *                 description: Host contribution amount (DitioCoins)
 *                 minimum: 0
 *                 example: 100
 *               visibility:
 *                 type: string
 *                 description: Visibility of the competition
 *                 enum: [public, private]
 *                 example: "public"
 *               rules:
 *                 type: array
 *                 description: Array of competition rules
 *                 items:
 *                   $ref: '#/components/schemas/Rule'
 *                 example:
 *                   - step: 1
 *                     description: "Follow real_soccer on Instagram"
 *                     stepVerification: true
 *                   - step: 2
 *                     description: "Share competition link"
 *                     stepVerification: false
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Competition start date (will be converted to UTC 00:00:00.000)
 *                 example: "2025-11-26T00:00:00.000Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Competition end date (will be converted to UTC 23:59:59.999)
 *                 example: "2025-11-26T23:59:59.999Z"
 *     responses:
 *       201:
 *         description: Competition created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BasicCompetition'
 *       400:
 *         description: Bad request - Missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingField:
 *                 value:
 *                   error: "Missing required field: name"
 *               insufficientBalance:
 *                 value:
 *                   error: "Insufficient DitioCoin balance"
 *               invalidDate:
 *                 value:
 *                   error: "End date must be after start date"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Invalid or expired token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 *             example:
 *               error: "DatabaseError"
 *               message: "Failed to save competition"
 */

/**
 * @swagger
 * /top-score/upload-proof/{competitionId}:
 *   post:
 *     summary: Upload proof images for competition verification
 *     description: |
 *       Upload images as proof for competition rule verification steps.
 *       This endpoint accepts multiple images and associates them with specific verification steps.
 *       The processing is asynchronous - files are queued for background processing.
 *     tags:
 *       - TopScore
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: competitionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the competition
 *         example: "68fa25fb7bd950c837c8fd9d"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of image files for proof upload
 *               steps:
 *                 type: string
 *                 description: |
 *                   JSON string array of step objects.
 *                   Each object must contain id, description, and imageCount properties.
 *                   Required if steps are being verified.
 *                 example: '[{"id": "step1", "description": "Instagram follow proof", "imageCount": 1}, {"id": "step2", "description": "Twitter share proof", "imageCount": 1}]'
 *     responses:
 *       202:
 *         description: Proof upload accepted and queued for processing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Proof upload queued successfullyS"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               noFiles:
 *                 value:
 *                   error: "No files uploaded"
 *               invalidSteps:
 *                 value:
 *                   error: "Invalid steps format"
 *               stepFileMismatch:
 *                 value:
 *                   error: "Number of steps must match number of files"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Invalid or expired token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 *             example:
 *               error: "UploadError"
 *               message: "Failed to process proof upload"
 */

/**
 * @swagger
 * /top-score/active-competition:
 *   get:
 *     summary: Get active topscore competitions
 *     description: Retrieve a paginated list of all active competitions. Requires authentication.
 *     tags:
 *       - TopScore
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
