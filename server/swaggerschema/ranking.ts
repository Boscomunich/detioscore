/**
 * @swagger
 * components:
 *   schemas:
 *     RankUser:
 *       type: object
 *       nullable: true
 *       properties:
 *         _id:
 *           type: string
 *           example: "68cab8bf11c56cf1641cae1a"
 *         username:
 *           type: string
 *           example: "300"
 *         name:
 *           type: string
 *           nullable: true
 *         image:
 *           type: string
 *           nullable: true
 *         country:
 *           type: string
 *           example: "Nigeria"
 *
 *     BasicRank:
 *       type: object
 *       properties:
 *         position:
 *           type: integer
 *           example: 1
 *         country:
 *           type: string
 *           example: "Nigeria"
 *         trend:
 *           type: string
 *           enum: [up, down, stable]
 *           example: "up"
 *
 *     GameRank:
 *       type: object
 *       properties:
 *         worldRank:
 *           $ref: '#/components/schemas/BasicRank'
 *         countryRank:
 *           $ref: '#/components/schemas/BasicRank'
 *         points:
 *           type: integer
 *           example: 10
 *
 *     Rank:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "690b130a9261c3283b98e6e5"
 *         user:
 *           $ref: '#/components/schemas/RankUser'
 *         name:
 *           type: string
 *           example: "Beginner"
 *         points:
 *           type: integer
 *           example: 40
 *         totalWins:
 *           type: integer
 *           example: 1
 *         winningStreak:
 *           type: integer
 *           example: 1
 *         firstWin:
 *           type: boolean
 *           example: true
 *         manGoSetWin:
 *           type: integer
 *           example: 0
 *         topScoreWin:
 *           type: integer
 *           example: 1
 *         leagueWin:
 *           type: integer
 *           example: 0
 *         manGoSetWinningStreak:
 *           type: integer
 *           example: 0
 *         topScoreWinningStreak:
 *           type: integer
 *           example: 1
 *         leagueWinningStreak:
 *           type: integer
 *           example: 0
 *         countryRank:
 *           $ref: '#/components/schemas/BasicRank'
 *         worldRank:
 *           $ref: '#/components/schemas/BasicRank'
 *         topScoreRank:
 *           $ref: '#/components/schemas/GameRank'
 *         manGoSetRank:
 *           $ref: '#/components/schemas/GameRank'
 *         leagueRank:
 *           $ref: '#/components/schemas/GameRank'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-05T09:04:10.389Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-26T13:34:07.579Z"
 *
 *     UserRank:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "690b130a9261c3283b98e6e5"
 *         user:
 *           type: string
 *           example: "68cab8bf11c56cf1641cae1a"
 *         name:
 *           type: string
 *           example: "Beginner"
 *         points:
 *           type: integer
 *           example: 40
 *         totalWins:
 *           type: integer
 *           example: 1
 *         winningStreak:
 *           type: integer
 *           example: 1
 *         firstWin:
 *           type: boolean
 *           example: true
 *         manGoSetWin:
 *           type: integer
 *           example: 0
 *         topScoreWin:
 *           type: integer
 *           example: 1
 *         leagueWin:
 *           type: integer
 *           example: 0
 *         manGoSetWinningStreak:
 *           type: integer
 *           example: 0
 *         topScoreWinningStreak:
 *           type: integer
 *           example: 1
 *         leagueWinningStreak:
 *           type: integer
 *           example: 0
 *         countryRank:
 *           $ref: '#/components/schemas/BasicRank'
 *         worldRank:
 *           $ref: '#/components/schemas/BasicRank'
 *         topScoreRank:
 *           $ref: '#/components/schemas/GameRank'
 *         manGoSetRank:
 *           $ref: '#/components/schemas/GameRank'
 *         leagueRank:
 *           $ref: '#/components/schemas/GameRank'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-05T09:04:10.389Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-26T13:34:07.579Z"
 *         __v:
 *           type: integer
 *           example: 0
 *
 *     RankingContext:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [all, topscore, league, mangoset]
 *           example: "all"
 *         scope:
 *           type: string
 *           enum: [world, country]
 *           example: "world"
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 25
 *         total:
 *           type: integer
 *           example: 8
 *         totalPages:
 *           type: integer
 *           example: 1
 *         userCountry:
 *           type: string
 *           nullable: true
 *           example: "Nigeria"
 *
 *     RankingsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         context:
 *           $ref: '#/components/schemas/RankingContext'
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Rank'
 */
