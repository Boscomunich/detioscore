/**
 * @swagger
 * /notification:
 *   get:
 *     summary: Fetch all notifications for the authenticated user
 *     description: |
 *       Returns a list of notifications for the authenticated user, optionally filtered by status (`read` or `unread`).
 *       Notifications are sorted by most recent first.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [read, unread]
 *         description: Optional filter by notification status
 *     responses:
 *       200:
 *         description: Successfully retrieved notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "6926de5b876996914e77aba1"
 *                   user:
 *                     type: string
 *                     example: "68cab8bf11c56cf1641cae1a"
 *                   type:
 *                     type: string
 *                     example: "message"
 *                   title:
 *                     type: string
 *                     example: "Notification 7"
 *                   message:
 *                     type: string
 *                     example: "This is a detailed message for notification 7..."
 *                   status:
 *                     type: string
 *                     enum: [read, unread]
 *                     example: "unread"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-11-26T11:02:51.391Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-11-26T11:02:51.391Z"
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
 *
 * /notification/count:
 *   get:
 *     summary: Get count of unread notifications
 *     description: |
 *       Returns the number of unread notifications for the authenticated user.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved unread notification count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 unreadCount:
 *                   type: integer
 *                   example: 7
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
 * /notification/{notificationId}:
 *   patch:
 *     summary: Mark a notification as read
 *     description: Updates the status of a specific notification to `read`.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the notification to mark as read
 *     responses:
 *       200:
 *         description: Notification marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "6926de5b876996914e77aba1"
 *                 user:
 *                   type: string
 *                   example: "68cab8bf11c56cf1641cae1a"
 *                 type:
 *                   type: string
 *                   example: "message"
 *                 title:
 *                   type: string
 *                   example: "Notification 7"
 *                 message:
 *                   type: string
 *                   example: "This is a detailed message for notification 7..."
 *                 status:
 *                   type: string
 *                   enum: [read, unread]
 *                   example: "read"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: integer
 *                   example: 0
 *       401:
 *         description: Unauthorized – missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Notification not found
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
 *   delete:
 *     summary: Delete a notification
 *     description: Deletes a specific notification for the authenticated user.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the notification to delete
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notification deleted"
 *       401:
 *         description: Unauthorized – missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Notification not found
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
