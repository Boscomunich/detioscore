/**
 * @swagger
 * /transaction/history:
 *   get:
 *     summary: Get authenticated user's transaction history
 *     description: |
 *       Returns a list of all transactions belonging to the authenticated user.
 *       Transactions are sorted by **most recent first**.
 *
 *       Authentication is required.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved transaction history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "69270072fcc47bca6b7c521f"
 *                   user:
 *                     type: string
 *                     example: "68cab8bf11c56cf1641cae1a"
 *                   type:
 *                     type: string
 *                     enum: [topup, withdrawal]
 *                     example: "topup"
 *                   amount:
 *                     type: number
 *                     example: 10000
 *                   paymentMethod:
 *                     type: string
 *                     enum: [card, transfer, googlepay, crypto]
 *                     example: "transfer"
 *                   status:
 *                     type: string
 *                     enum: [pending, completed, failed]
 *                     example: "completed"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-11-26T13:28:18.491Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-11-26T13:28:32.530Z"
 *                   __v:
 *                     type: integer
 *                     example: 0
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
 * /transaction/create-invoice:
 *   post:
 *     summary: Create a top-up invoice
 *     description: |
 *       Creates a pending top-up transaction for the authenticated user.
 *
 *       Authentication is required.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - paymentMethod
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 10000
 *               paymentMethod:
 *                 type: string
 *                 enum: [card, transfer, googlepay, crypto]
 *                 example: "transfer"
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "69270072fcc47bca6b7c521f"
 *                 user:
 *                   type: string
 *                   example: "68cab8bf11c56cf1641cae1a"
 *                 type:
 *                   type: string
 *                   enum: [topup]
 *                   example: "topup"
 *                 amount:
 *                   type: number
 *                   example: 10000
 *                 paymentMethod:
 *                   type: string
 *                   enum: [card, transfer, googlepay, crypto]
 *                   example: "transfer"
 *                 status:
 *                   type: string
 *                   enum: [pending, completed, failed]
 *                   example: "pending"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-26T13:28:18.491Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-26T13:28:32.530Z"
 *                 __v:
 *                   type: integer
 *                   example: 0
 *       400:
 *         description: Invalid request payload
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
 * /transaction/create-withdrawal:
 *   post:
 *     summary: Create a withdrawal request
 *     description: |
 *       Creates a pending withdrawal transaction for the authenticated user.
 *
 *       Authentication is required.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - paymentMethod
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *               paymentMethod:
 *                 type: string
 *                 enum: [transfer, crypto]
 *                 example: "transfer"
 *     responses:
 *       201:
 *         description: Withdrawal request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "68d6a4915f25181a171ad9e0"
 *                 user:
 *                   type: string
 *                   example: "68cab8bf11c56cf1641cae1a"
 *                 type:
 *                   type: string
 *                   enum: [withdrawal]
 *                   example: "withdrawal"
 *                 amount:
 *                   type: number
 *                   example: 1000
 *                 paymentMethod:
 *                   type: string
 *                   enum: [transfer, crypto]
 *                   example: "transfer"
 *                 status:
 *                   type: string
 *                   enum: [pending, completed, failed]
 *                   example: "pending"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-26T14:34:57.810Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-26T14:34:57.810Z"
 *                 __v:
 *                   type: integer
 *                   example: 0
 *       400:
 *         description: Invalid request payload
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
