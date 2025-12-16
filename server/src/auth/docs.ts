/**
 * @swagger
 * /api/auth/sign-up/email:
 *   post:
 *     summary: Register a new user with email
 *     description: Creates a new user account using email, username, and password. Returns user details upon successful registration.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *               - country
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               country:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   nullable: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     emailVerified:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       409:
 *         description: Email already registered
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
 */

/**
 * @swagger
 * /api/auth/sign-in/email:
 *   post:
 *     summary: Sign in with email
 *     description: Authenticate user with email and password. Returns authentication token and user details.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 redirect:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     name:
 *                       type: string
 *                     emailVerified:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *       403:
 *         description: Email not verified
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
 */

/**
 * @swagger
 * /api/auth/sign-in/social:
 *   post:
 *     summary: Sign in with Google OAuth
 *     description: Initiates OAuth authentication flow with Google. Redirects user to Google's authorization page for authentication.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - provider
 *             properties:
 *               provider:
 *                 type: string
 *                 enum: [google]
 *                 description: The social provider ID
 *               callbackURL:
 *                 type: string
 *                 description: A URL to redirect after the user authenticates with the provider
 *                 default: "/"
 *               errorCallbackURL:
 *                 type: string
 *                 description: A URL to redirect if an error occurs during the sign in process
 *               newUserCallbackURL:
 *                 type: string
 *                 description: A URL to redirect to after login if the user is new
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth authorization URL
 *         headers:
 *           Location:
 *             description: Google OAuth authorization URL
 *             schema:
 *               type: string
 *       400:
 *         description: Invalid provider or missing required parameters
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
 */

/**
 * @swagger
 * /api/auth/callback/google:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handles the OAuth callback from Google after user authentication. Creates or signs in user and establishes session.
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code from Google
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: State parameter for CSRF protection
 *     responses:
 *       302:
 *         description: Redirect to callback URL with authentication success
 *         headers:
 *           Location:
 *             description: Callback URL specified during sign-in initiation
 *             schema:
 *               type: string
 *           Set-Cookie:
 *             description: Session cookies for authenticated user
 *             schema:
 *               type: string
 *       400:
 *         description: Invalid authorization code or state
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
 *         description: Internal server error during OAuth processing
 */

/**
 * @swagger
 * /api/auth/request-password-reset:
 *   post:
 *     summary: Request password reset
 *     description: Sends a password reset email to the user if the email exists. Triggers the sendResetPassword function configured in the auth setup.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user to send a password reset email to
 *               redirectTo:
 *                 type: string
 *                 description: The URL to redirect the user to reset their password. If the token isn't valid or expired, it'll be redirected with a query parameter ?error=INVALID_TOKEN. If the token is valid, it'll be redirected with a query parameter ?token=VALID_TOKEN
 *     responses:
 *       200:
 *         description: Password reset email sent (always returns success for security)
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
 *                   example: "Password reset email sent if account exists"
 *       400:
 *         description: Invalid email format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "INVALID_EMAIL"
 *                 message:
 *                   type: string
 *                   example: "Invalid email format"
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
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     description: Resets the user's password using a valid reset token received via email. The token must be provided and valid.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *               - token
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password to set
 *                 minLength: 8
 *                 maxLength: 128
 *               token:
 *                 type: string
 *                 description: The token to reset the password
 *     responses:
 *       200:
 *         description: Password reset successfully
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
 *                   example: "Password reset successfully"
 *       400:
 *         description: Invalid token or password requirements not met
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "INVALID_TOKEN"
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired reset token"
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
