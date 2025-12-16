/**
 * @swagger
 * /api/auth/update-user:
 *   patch:
 *     summary: Update user profile
 *     description: Update user information such as name or other profile fields. At least one field must be provided for update.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *       400:
 *         description: No fields provided for update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized - Authentication required or current password incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change user password
 *     description: Updates the current user's password. Requires authentication and current password verification. Optionally revokes other active sessions.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *               - currentPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password to set
 *                 minLength: 8
 *                 maxLength: 128
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: The current user password for verification
 *               revokeOtherSessions:
 *                 type: boolean
 *                 description: When set to true, all other active sessions for this user will be invalidated
 *                 default: false
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully"
 *       400:
 *         description: Invalid request - password requirements not met
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "INVALID_PASSWORD"
 *                 message:
 *                   type: string
 *                   example: "Password must be at least 8 characters long"
 *       401:
 *         description: Unauthorized - Authentication required or current password incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "INVALID_CREDENTIALS"
 *                 message:
 *                   type: string
 *                   example: "Current password is incorrect"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /user/wallet:
 *   get:
 *     summary: Get authenticated user's wallet
 *     description: |
 *       Retrieves the wallet information for the authenticated user.
 *       Includes balance, first deposit status, and payout details if available.
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "successful"
 *                 wallet:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: string
 *                       example: "68cab8bf11c56cf1641cae1a"
 *                     balance:
 *                       type: number
 *                       example: 5000
 *                     madeFirstDeposit:
 *                       type: boolean
 *                       example: true
 *                     payoutDetails:
 *                       type: object
 *                       properties:
 *                         bank:
 *                           type: object
 *                           properties:
 *                             accountName:
 *                               type: string
 *                               example: "John Doe"
 *                             accountNumber:
 *                               type: string
 *                               example: "1234567890"
 *                             bankName:
 *                               type: string
 *                               example: "Example Bank"
 *                             routingNumber:
 *                               type: string
 *                               example: "00112233"
 *       401:
 *         description: Unauthorized – missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Wallet not found
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
 * /user/achievements:
 *   get:
 *     summary: Get authenticated user's achievements
 *     description: |
 *       Retrieves all achievements earned by the authenticated user.
 *       Each achievement includes name, description, points, icon URL, and timestamps.
 *     tags:
 *       - Achievements
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Achievements retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "successful"
 *                 achievements:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6926de5b876996914e77aba1"
 *                       user:
 *                         type: string
 *                         example: "68cab8bf11c56cf1641cae1a"
 *                       name:
 *                         type: string
 *                         example: "First Win"
 *                       description:
 *                         type: string
 *                         example: "Awarded for winning your first game"
 *                       points:
 *                         type: number
 *                         example: 10
 *                       iconUrl:
 *                         type: string
 *                         example: "https://example.com/icons/first_win.png"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-11-26T11:02:51.391Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-11-26T11:02:51.391Z"
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
