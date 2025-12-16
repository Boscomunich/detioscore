/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "68cab8bf11c56cf1641cae1a"
 *         username:
 *           type: string
 *           example: "300"
 *         email:
 *           type: string
 *           format: email
 *           example: "obuegbechidera@gmail.com"
 *         role:
 *           type: string
 *           example: "admin"
 *
 *     TeamInfo:
 *       type: object
 *       properties:
 *         teamId:
 *           type: integer
 *           example: 1045
 *         name:
 *           type: string
 *           example: "Tanta SC"
 *         logo:
 *           type: string
 *           format: uri
 *           example: "https://media.api-sports.io/football/teams/1045.png"
 *
 *     FixtureTeam:
 *       type: object
 *       properties:
 *         fixtureId:
 *           type: string
 *           example: "1440822"
 *         selectedTeam:
 *           $ref: '#/components/schemas/TeamInfo'
 *         opponentTeam:
 *           $ref: '#/components/schemas/TeamInfo'
 *         matchVenue:
 *           type: string
 *           example: "Tanta Stadium"
 *         _id:
 *           type: string
 *           example: "68fa267d7bd950c837c8fdc3"
 *
 *     Score:
 *       type: object
 *       properties:
 *         home:
 *           type: integer
 *           example: 0
 *         away:
 *           type: integer
 *           example: 1
 *         _id:
 *           type: string
 *           example: "68fa3faa8d55fdf736ad80b0"
 *
 *     TeamPoints:
 *       type: object
 *       properties:
 *         fixtureId:
 *           type: integer
 *           example: 1440822
 *         score:
 *           $ref: '#/components/schemas/Score'
 *         points:
 *           type: integer
 *           example: 1
 *         isLive:
 *           type: boolean
 *           example: false
 *         isFT:
 *           type: boolean
 *           example: true
 *         _id:
 *           type: string
 *           example: "68fa3faa8d55fdf736ad80af"
 *
 *     Team:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "68fa267d7bd950c837c8fdc1"
 *         stakedAmount:
 *           type: number
 *           example: 0
 *         teams:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FixtureTeam'
 *         starTeam:
 *           type: string
 *           example: "1440823"
 *         teamPoints:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TeamPoints'
 *         totalPoints:
 *           type: integer
 *           example: 2
 *         rank:
 *           type: integer
 *           example: 2
 *         proofs:
 *           type: array
 *           items:
 *             type: string
 *         stepsVerified:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-23T12:58:37.814Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-23T22:00:01.561Z"
 *
 *     Rule:
 *       type: object
 *       properties:
 *         step:
 *           type: integer
 *           example: 1
 *         description:
 *           type: string
 *           example: "follow real_soccer on instagram"
 *         stepVerification:
 *           type: boolean
 *           example: true
 *         _id:
 *           type: string
 *           example: "68df96d8352bc5f63f2e5728"
 *
 *     BasicParticipant:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           example: "68cab8bf11c56cf1641cae1a"
 *         status:
 *           type: string
 *           enum: [pending, joined]
 *           example: "pending"
 *         joinedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-26T13:34:06.737Z"
 *         _id:
 *           type: string
 *           example: "692701ce624a06fffdbb0c59"
 *
 *     Participant:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "68fa25fb7bd950c837c8fd9e"
 *         status:
 *           type: string
 *           enum: [pending, joined]
 *           example: "joined"
 *         joinedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-23T12:58:38.016Z"
 *         user:
 *           $ref: '#/components/schemas/User'
 *         team:
 *           $ref: '#/components/schemas/Team'
 *
 *     BasicCompetition:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "692701ce624a06fffdbb0c58"
 *         name:
 *           type: string
 *           example: "champoins cup matchday 5"
 *         type:
 *           type: string
 *           enum: [TopScore, ManGoSet]
 *           example: "TopScore"
 *         createdBy:
 *           type: string
 *           example: "68cab8bf11c56cf1641cae1a"
 *         requiredTeams:
 *           type: integer
 *           example: 3
 *         minTeams:
 *           type: integer
 *           example: 3
 *         maxTeams:
 *           type: integer
 *           example: 20
 *         entryFee:
 *           type: number
 *           example: 0
 *         participantCap:
 *           type: integer
 *           example: 60
 *         minParticipants:
 *           type: integer
 *           example: 2
 *         leagueConfig:
 *           type: object
 *           nullable: true
 *         rules:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Rule'
 *         prizePool:
 *           type: number
 *           example: 100
 *         hostContribution:
 *           type: number
 *           example: 100
 *         invitationCode:
 *           type: string
 *           example: "nNTCwsoRka"
 *         isActive:
 *           type: boolean
 *           example: true
 *         isPublic:
 *           type: boolean
 *           example: true
 *         winner:
 *           type: array
 *           items:
 *             type: string
 *           example: []
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: "2025-11-26T00:00:00.000Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: "2025-11-26T23:59:59.999Z"
 *         participants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BasicParticipant'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-26T13:34:06.740Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-26T13:34:06.740Z"
 *         __v:
 *           type: integer
 *           example: 0
 *
 *     Competition:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "68fa25fb7bd950c837c8fd9d"
 *         name:
 *           type: string
 *           example: "new comp"
 *         type:
 *           type: string
 *           enum: [TopScore, ManGoSet]
 *           example: "TopScore"
 *         createdBy:
 *           $ref: '#/components/schemas/User'
 *         requiredTeams:
 *           type: integer
 *           example: 3
 *         minTeams:
 *           type: integer
 *           example: 3
 *         maxTeams:
 *           type: integer
 *           example: 20
 *         entryFee:
 *           type: number
 *           example: 0
 *         participantCap:
 *           type: integer
 *           example: 20
 *         minParticipants:
 *           type: integer
 *           example: 2
 *         leagueConfig:
 *           type: object
 *           nullable: true
 *         rules:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Rule'
 *         prizePool:
 *           type: number
 *           example: 100
 *         hostContribution:
 *           type: number
 *           example: 100
 *         invitationCode:
 *           type: string
 *           example: "VrkN3gnmYP"
 *         isActive:
 *           type: boolean
 *           example: false
 *         isPublic:
 *           type: boolean
 *           example: true
 *         winner:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *           nullable: true
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: "2025-10-23T00:00:00.000Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: "2025-10-23T23:59:59.999Z"
 *         participants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Participant'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-23T12:56:27.372Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-26T09:15:15.625Z"
 *         __v:
 *           type: integer
 *           example: 2
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         totalCompetitions:
 *           type: integer
 *           example: 8
 *         totalPages:
 *           type: integer
 *           example: 1
 *         currentPage:
 *           type: integer
 *           example: 1
 *         hasNextPage:
 *           type: boolean
 *           example: false
 *         hasPrevPage:
 *           type: boolean
 *           example: false
 *         limit:
 *           type: integer
 *           example: 20
 *
 *     ActiveCompetitionsResponse:
 *       type: object
 *       properties:
 *         competitions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Competition'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     CompetitionDetailResponse:
 *       type: object
 *       properties:
 *         competition:
 *           $ref: '#/components/schemas/Competition'
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "error"
 *         message:
 *           type: string
 *           example: "User not found"
 *         statusCode:
 *           type: integer
 *           example: 404
 *       example:
 *         status: "error"
 *         message: "string"
 *         statusCode: 404
 *
 *     ServerErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "error"
 *         message:
 *           type: string
 *           example: "Something went wrong"
 *         statusCode:
 *           type: integer
 *           example: 500
 *       example:
 *         status: "error"
 *         message: "Something went wrong"
 *         statusCode: 500
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: "JWT Bearer token. Format: `Bearer <token>`"
 */
