/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The user ID
 *         username:
 *           type: string
 *           description: The user's username
 *         email:
 *           type: string
 *           description: The user's email
 *         emailVerified:
 *           type: boolean
 *           description: Whether email is verified
 *         role:
 *           type: string
 *           enum: [user, admin, super_admin]
 *           description: User role
 *         country:
 *           type: string
 *           description: User's country
 *         ipAddresses:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               ip:
 *                 type: string
 *               lastUsed:
 *                 type: string
 *                 format: date-time
 *         lastLogin:
 *           type: string
 *           format: date-time
 *         deviceInfo:
 *           type: string
 *         banned:
 *           type: boolean
 *           description: Whether user is banned
 *         banReason:
 *           type: string
 *         banExpires:
 *           type: string
 *           format: date-time
 *         suspended:
 *           type: boolean
 *           description: Whether user is suspended
 *         suspensionReason:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 507f1f77bcf86cd799439011
 *         username: johndoe
 *         email: john@example.com
 *         emailVerified: true
 *         role: user
 *         country: US
 *         banned: false
 *         suspended: false
 *         createdAt: 2024-01-01T00:00:00.000Z
 *         updatedAt: 2024-01-01T00:00:00.000Z
 *
 *     Transaction:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Transaction ID
 *         user:
 *           type: string
 *           description: User ID associated with transaction
 *         type:
 *           type: string
 *           enum: [stake, payout, withdrawal, topup]
 *           description: Type of transaction
 *         amount:
 *           type: number
 *           format: float
 *           description: Transaction amount
 *         paymentMethod:
 *           type: string
 *           enum: [card, transfer, system]
 *           description: Payment method used
 *         status:
 *           type: string
 *           enum: [pending, completed, failed]
 *           description: Transaction status
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 507f1f77bcf86cd799439011
 *         user: 507f1f77bcf86cd799439012
 *         type: topup
 *         amount: 100.50
 *         paymentMethod: card
 *         status: pending
 *         createdAt: 2024-01-01T00:00:00.000Z
 *         updatedAt: 2024-01-01T00:00:00.000Z
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *
 *     UsersListResponse:
 *       type: object
 *       properties:
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         pagination:
 *           type: object
 *           properties:
 *             totalUsers:
 *               type: integer
 *             totalPages:
 *               type: integer
 *             currentPage:
 *               type: integer
 *             hasNextPage:
 *               type: boolean
 *             hasPrevPage:
 *               type: boolean
 *
 *     TransactionResponse:
 *       type: object
 *       properties:
 *         transaction:
 *           $ref: '#/components/schemas/Transaction'
 *
 *     TransactionsListResponse:
 *       type: object
 *       properties:
 *         transactions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Transaction'
 *         pagination:
 *           type: object
 *           properties:
 *             totalTransactions:
 *               type: integer
 *             totalPages:
 *               type: integer
 *             currentPage:
 *               type: integer
 *             hasNextPage:
 *               type: boolean
 *             hasPrevPage:
 *               type: boolean
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 *
 *     SuspendBanRequest:
 *       type: object
 *       required:
 *         - reason
 *       properties:
 *         reason:
 *           type: string
 *           description: Reason for suspension/ban
 *         expires:
 *           type: string
 *           format: date-time
 *           description: Expiration date for ban
 *       example:
 *         reason: Violating terms of service
 *         expires: 2024-12-31T23:59:59.999Z
 *
 *     ChangeRoleRequest:
 *       type: object
 *       required:
 *         - role
 *       properties:
 *         role:
 *           type: string
 *           enum: [user, admin, super_admin]
 *           description: New role for user
 *       example:
 *         role: admin
 *
 *     TransactionUpdateRequest:
 *       type: object
 *       required:
 *         - status
 *         - txnId
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, completed, failed]
 *           description: New status for transaction
 *         txnId:
 *           type: string
 *           description: Transaction ID to update
 *       example:
 *         status: completed
 *         txnId: 507f1f77bcf86cd799439011
 *
 *     TransactionUpdateResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         transaction:
 *           $ref: '#/components/schemas/Transaction'
 *
 *   parameters:
 *     userIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: User ID
 *     userIdPathParam:
 *       in: path
 *       name: userId
 *       required: true
 *       schema:
 *         type: string
 *       description: User ID
 *     pageQueryParam:
 *       in: query
 *       name: page
 *       schema:
 *         type: integer
 *         default: 1
 *       description: Page number
 *     sortByQueryParam:
 *       in: query
 *       name: sortBy
 *       schema:
 *         type: string
 *         enum: [createdAt, username, email, role]
 *         default: createdAt
 *       description: Field to sort by
 *     sortOrderQueryParam:
 *       in: query
 *       name: sortOrder
 *       schema:
 *         type: string
 *         enum: [asc, desc]
 *         default: desc
 *       description: Sort order
 */
