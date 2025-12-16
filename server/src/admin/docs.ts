/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Get all users with filtering and pagination
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageQueryParam'
 *       - $ref: '#/components/parameters/sortByQueryParam'
 *       - $ref: '#/components/parameters/sortOrderQueryParam'
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: Filter by username (case-insensitive)
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by email (case-insensitive)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, admin, super_admin]
 *         description: Filter by role
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country
 *       - in: query
 *         name: banned
 *         schema:
 *           type: boolean
 *         description: Filter by banned status
 *       - in: query
 *         name: suspended
 *         schema:
 *           type: boolean
 *         description: Filter by suspended status
 *     responses:
 *       200:
 *         description: List of users with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersListResponse'
 *       401:
 *         description: Unauthorized – missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/user:
 *   get:
 *     summary: Get user by ID or email
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID or email address
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Query parameter is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized – missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/{id}/suspend:
 *   patch:
 *     summary: Suspend a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/userIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SuspendBanRequest'
 *     responses:
 *       200:
 *         description: User suspended successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized – missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/{id}/unsuspend:
 *   patch:
 *     summary: Unsuspend a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/userIdParam'
 *     responses:
 *       200:
 *         description: User unsuspended successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized – missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/{id}/ban:
 *   patch:
 *     summary: Ban a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/userIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SuspendBanRequest'
 *     responses:
 *       200:
 *         description: User banned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized – missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/{id}/unban:
 *   patch:
 *     summary: Unban a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/userIdParam'
 *     responses:
 *       200:
 *         description: User unbanned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized – missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/userIdParam'
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized – missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/role/{id}:
 *   patch:
 *     summary: Change user role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/userIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeRoleRequest'
 *     responses:
 *       200:
 *         description: User role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Role is require
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized – missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/transaction:
 *   get:
 *     summary: Get all pending transactions
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all transactions with status 'pending' with pagination
 *     parameters:
 *       - $ref: '#/components/parameters/pageQueryParam'
 *     responses:
 *       200:
 *         description: List of pending transactions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionsListResponse'
 *             example:
 *               transactions:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   user: 507f1f77bcf86cd799439012
 *                   type: topup
 *                   amount: 100.50
 *                   paymentMethod: card
 *                   status: pending
 *                   createdAt: 2024-01-01T00:00:00.000Z
 *                   updatedAt: 2024-01-01T00:00:00.000Z
 *                 - _id: 507f1f77bcf86cd799439013
 *                   user: 507f1f77bcf86cd799439014
 *                   type: withdrawal
 *                   amount: 50.00
 *                   paymentMethod: transfer
 *                   status: pending
 *                   createdAt: 2024-01-02T00:00:00.000Z
 *                   updatedAt: 2024-01-02T00:00:00.000Z
 *               pagination:
 *                 totalTransactions: 2
 *                 totalPages: 1
 *                 currentPage: 1
 *                 hasNextPage: false
 *                 hasPrevPage: false
 *       401:
 *         description: Unauthorized – missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/transaction/{userId}:
 *   get:
 *     summary: Get all transactions for a specific user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all transactions for a specific user with pagination
 *     parameters:
 *       - $ref: '#/components/parameters/userIdPathParam'
 *       - $ref: '#/components/parameters/pageQueryParam'
 *     responses:
 *       200:
 *         description: List of user transactions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionsListResponse'
 *             example:
 *               transactions:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   user: 507f1f77bcf86cd799439012
 *                   type: stake
 *                   amount: 25.00
 *                   paymentMethod: system
 *                   status: completed
 *                   createdAt: 2024-01-01T00:00:00.000Z
 *                   updatedAt: 2024-01-01T00:00:00.000Z
 *                 - _id: 507f1f77bcf86cd799439013
 *                   user: 507f1f77bcf86cd799439012
 *                   type: topup
 *                   amount: 100.00
 *                   paymentMethod: card
 *                   status: pending
 *                   createdAt: 2024-01-02T00:00:00.000Z
 *                   updatedAt: 2024-01-02T00:00:00.000Z
 *               pagination:
 *                 totalTransactions: 2
 *                 totalPages: 1
 *                 currentPage: 1
 *                 hasNextPage: false
 *                 hasPrevPage: false
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized – missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/transaction/{userId}:
 *   patch:
 *     summary: Manually update a user transaction
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: Update transaction status and automatically add DitioCoins if status changes to 'completed'
 *     parameters:
 *       - $ref: '#/components/parameters/userIdPathParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionUpdateRequest'
 *           example:
 *             status: completed
 *             txnId: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionUpdateResponse'
 *             example:
 *               message: transaction has been updated successfully
 *               transaction:
 *                 _id: 507f1f77bcf86cd799439011
 *                 user: 507f1f77bcf86cd799439012
 *                 type: topup
 *                 amount: 100.50
 *                 paymentMethod: card
 *                 status: completed
 *                 createdAt: 2024-01-01T00:00:00.000Z
 *                 updatedAt: 2024-01-01T01:00:00.000Z
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized – missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 */

/**
 * @swagger
 * /admin/competition/{competitionId}:
 *   get:
 *     summary: Get competition with participants and their teams
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: competitionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Competition ID
 *     responses:
 *       200:
 *         description: Competition details with participants and their teams
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 competition:
 *                   $ref: '#/components/schemas/Competition'
 *                 participants:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user:
 *                         $ref: '#/components/schemas/User'
 *                       status:
 *                         type: string
 *                         enum: [pending, joined]
 *                       joinedAt:
 *                         type: string
 *                         format: date-time
 *                       teamData:
 *                         type: object
 *                         nullable: true
 *       404:
 *         description: Competition not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
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
 * /admin/participant/task:
 *   patch:
 *     summary: Verify user task proofs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamId
 *             properties:
 *               teamId:
 *                 type: string
 *                 example: "68fa267d7bd950c837c8fdc1"
 *               verified:
 *                 type: boolean
 *                 description: Apply this verification status to all proofs
 *                 example: true
 *               proofs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     step:
 *                       type: integer
 *                       example: 1
 *                     verified:
 *                       type: boolean
 *                       example: true
 *                     url:
 *                       type: string
 *                       example: "https://example.com/proof.jpg"
 *     responses:
 *       200:
 *         description: Proofs verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All proofs verified successfully."
 *                 stepsVerified:
 *                   type: boolean
 *                   example: true
 *                 proofs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       step:
 *                         type: integer
 *                       verified:
 *                         type: boolean
 *                       url:
 *                         type: string
 *       404:
 *         description: Team not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
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
 * /admin/participant/disqualify:
 *   patch:
 *     summary: Disqualify a team
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamId
 *             properties:
 *               teamId:
 *                 type: string
 *                 example: "68fa267d7bd950c837c8fdc1"
 *     responses:
 *       200:
 *         description: Team disqualified or verification status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Team has been disqualified due to unverified proofs."
 *                 isDisqualified:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Team not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
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
 * /admin/participant/requalify:
 *   patch:
 *     summary: Re-qualify a team
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamId
 *             properties:
 *               teamId:
 *                 type: string
 *                 example: "68fa267d7bd950c837c8fdc1"
 *     responses:
 *       200:
 *         description: Team re-qualified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Team successfully requalified."
 *                 team:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     isDisqualified:
 *                       type: boolean
 *                     stepsVerified:
 *                       type: boolean
 *       400:
 *         description: Cannot requalify - not all proofs verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Team not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
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
 * /admin/competition/winner:
 *   patch:
 *     summary: Validate and set competition winner(s)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - competitionId
 *               - userId
 *             properties:
 *               competitionId:
 *                 type: string
 *                 example: "68fa25fb7bd950c837c8fd9d"
 *               userId:
 *                 oneOf:
 *                   - type: string
 *                     example: "68cab8bf11c56cf1641cae1a"
 *                   - type: array
 *                     items:
 *                       type: string
 *                     example: ["68cab8bf11c56cf1641cae1a", "68dab8cf12c67df1642cae2b"]
 *     responses:
 *       200:
 *         description: Winner(s) updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Winner(s) updated successfully."
 *                 competition:
 *                   $ref: '#/components/schemas/Competition'
 *       404:
 *         description: Competition not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
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
 * /admin/competition/deactivate/{competitionId}:
 *   patch:
 *     summary: Deactivate competition and process winners
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: Deactivates competition, pays winners, updates participant streaks, and recalculates ranks
 *     parameters:
 *       - in: path
 *         name: competitionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Competition ID
 *     responses:
 *       200:
 *         description: Competition deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Competition deactivated successfully."
 *       404:
 *         description: Competition not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
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
 * /admin/league:
 *   post:
 *     summary: Create a new league competition
 *     tags: [Admin-Competitions]
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
 *               - prizePool
 *               - entryFee
 *               - startDate
 *               - endDate
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Premier League Season 1"
 *                 description: Name of the league competition
 *               numberOfTeams:
 *                 type: integer
 *                 example: 5
 *                 description: Number of teams required for each participant
 *               participantCap:
 *                 type: integer
 *                 example: 20
 *                 description: Maximum number of participants allowed
 *               prizePool:
 *                 type: number
 *                 example: 1000
 *                 description: Total prize pool for the competition
 *               entryFee:
 *                 type: number
 *                 example: 50
 *                 description: Entry fee for each participant
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-01T00:00:00.000Z"
 *                 description: Start date and time of the competition
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-31T23:59:59.999Z"
 *                 description: End date and time of the competition
 *               leagueConfig:
 *                 type: object
 *                 description: Additional league configuration settings
 *                 example:
 *                   season: "2025"
 *                   rounds: 2
 *                   pointsPerWin: 3
 *                   pointsPerDraw: 1
 *     responses:
 *       201:
 *         description: League competition created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Competition'
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - missing or invalid authentication token
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
 * /admin/metric:
 *   get:
 *     summary: Get platform metrics and analytics
 *     tags: [Admin]
 *     description: Retrieve volume and user growth metrics with daily, weekly, and monthly comparisons
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalVolume:
 *                   type: number
 *                   example: 12500.75
 *                   description: Total transaction volume
 *                 monthlyVolume:
 *                   type: number
 *                   example: 3500.25
 *                   description: Current month transaction volume
 *                 monthlyChange:
 *                   type: number
 *                   nullable: true
 *                   example: 15.5
 *                   description: Percentage change compared to previous month (null if no previous data)
 *                 weeklyVolume:
 *                   type: number
 *                   example: 850.50
 *                   description: Current week transaction volume
 *                 weeklyChange:
 *                   type: number
 *                   nullable: true
 *                   example: -2.3
 *                   description: Percentage change compared to previous week
 *                 dailyVolume:
 *                   type: number
 *                   example: 125.75
 *                   description: Today's transaction volume
 *                 dailyChange:
 *                   type: number
 *                   nullable: true
 *                   example: 8.2
 *                   description: Percentage change compared to yesterday
 *                 totalUsers:
 *                   type: integer
 *                   example: 1250
 *                   description: Total number of users
 *                 monthlyNewUsers:
 *                   type: integer
 *                   example: 150
 *                   description: New users this month
 *                 monthlyUserChange:
 *                   type: number
 *                   nullable: true
 *                   example: 25.0
 *                   description: Percentage change in new users compared to previous month
 *                 weeklyNewUsers:
 *                   type: integer
 *                   example: 35
 *                   description: New users this week
 *                 weeklyUserChange:
 *                   type: number
 *                   nullable: true
 *                   example: 12.5
 *                   description: Percentage change in new users compared to previous week
 *                 dailyNewUsers:
 *                   type: integer
 *                   example: 5
 *                   description: New users today
 *                 dailyUserChange:
 *                   type: number
 *                   nullable: true
 *                   example: -10.0
 *                   description: Percentage change in new users compared to yesterday
 *               example:
 *                 totalVolume: 12500.75
 *                 monthlyVolume: 3500.25
 *                 monthlyChange: 15.5
 *                 weeklyVolume: 850.50
 *                 weeklyChange: -2.3
 *                 dailyVolume: 125.75
 *                 dailyChange: 8.2
 *                 totalUsers: 1250
 *                 monthlyNewUsers: 150
 *                 monthlyUserChange: 25.0
 *                 weeklyNewUsers: 35
 *                 weeklyUserChange: 12.5
 *                 dailyNewUsers: 5
 *                 dailyUserChange: -10.0
 *       401:
 *         description: Unauthorized - missing or invalid authentication token
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
