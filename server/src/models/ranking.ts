import mongoose, { Schema, Document, model } from "mongoose";

interface CountryRank {
  position: number;
  country: string;
  trend: "up" | "down" | "stable";
}

interface WorldRank {
  position: number;
  country: string;
  trend: "up" | "down" | "stable";
}

interface TopScoreRank {
  worldRank: WorldRank;
  countryRank: CountryRank;
  points: number;
}

interface ManGoSetRank {
  worldRank: WorldRank;
  countryRank: CountryRank;
  points: number;
}

interface LeagueRank {
  worldRank: WorldRank;
  countryRank: CountryRank;
  points: number;
}

export interface IRank extends Document {
  user: mongoose.Types.ObjectId;
  name:
    | "Beginner"
    | "Bronze"
    | "Silver"
    | "Gold"
    | "Platinum"
    | "Diamond"
    | "Legend";
  countryRank: CountryRank;
  worldRank: WorldRank;
  topScoreRank: TopScoreRank;
  manGoSetRank: ManGoSetRank;
  leagueRank: LeagueRank;
  points: number;
  manGoSetWin: number;
  topScoreWin: number;
  leagueWin: number;
  firstWin: boolean;
  manGoSetWinningStreak: number;
  topScoreWinningStreak: number;
  leagueWinningStreak: number;
  winningStreak: number;
  totalWins: number;
  createdAt: Date;
  updatedAt: Date;
}

const RankingSchema: Schema<IRank> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    name: {
      type: String,
      enum: [
        "Beginner",
        "Bronze",
        "Silver",
        "Gold",
        "Platinum",
        "Diamond",
        "Legend",
      ],
      default: "Beginner",
    },

    countryRank: {
      position: { type: Number, required: true, default: 0 },
      country: { type: String, required: true },
      trend: {
        type: String,
        enum: ["up", "down", "stable"],
        default: "stable",
      },
    },
    worldRank: {
      position: { type: Number, required: true, default: 0 },
      country: { type: String, required: true },
      trend: {
        type: String,
        enum: ["up", "down", "stable"],
        default: "stable",
      },
    },

    topScoreRank: {
      worldRank: {
        position: { type: Number, required: true, default: 0 },
        country: { type: String, required: true },
        trend: {
          type: String,
          enum: ["up", "down", "stable"],
          default: "stable",
        },
      },
      countryRank: {
        position: { type: Number, required: true, default: 0 },
        country: { type: String, required: true },
        trend: {
          type: String,
          enum: ["up", "down", "stable"],
          default: "stable",
        },
      },
      points: { type: Number, required: true, default: 0 },
    },

    manGoSetRank: {
      worldRank: {
        position: { type: Number, required: true, default: 0 },
        country: { type: String, required: true },
        trend: {
          type: String,
          enum: ["up", "down", "stable"],
          default: "stable",
        },
      },
      countryRank: {
        position: { type: Number, required: true, default: 0 },
        country: { type: String, required: true },
        trend: {
          type: String,
          enum: ["up", "down", "stable"],
          default: "stable",
        },
      },
      points: { type: Number, required: true, default: 0 },
    },

    leagueRank: {
      worldRank: {
        position: { type: Number, required: true, default: 0 },
        country: { type: String, required: true },
        trend: {
          type: String,
          enum: ["up", "down", "stable"],
          default: "stable",
        },
      },
      countryRank: {
        position: { type: Number, required: true, default: 0 },
        country: { type: String, required: true },
        trend: {
          type: String,
          enum: ["up", "down", "stable"],
          default: "stable",
        },
      },
      points: { type: Number, required: true, default: 0 },
    },

    points: { type: Number, required: true, default: 0, min: 0 },
    manGoSetWin: { type: Number, required: true, default: 0, min: 0 },
    topScoreWin: { type: Number, required: true, default: 0, min: 0 },
    leagueWin: { type: Number, required: true, default: 0, min: 0 },
    firstWin: { type: Boolean, default: false },
    manGoSetWinningStreak: { type: Number, required: true, default: 0, min: 0 },
    topScoreWinningStreak: { type: Number, required: true, default: 0, min: 0 },
    leagueWinningStreak: { type: Number, required: true, default: 0, min: 0 },
    winningStreak: { type: Number, required: true, default: 0, min: 0 },
    totalWins: { type: Number, required: true, default: 0, min: 0 },
  },
  {
    timestamps: true,
  }
);

RankingSchema.index({ "worldRank.position": 1 });
RankingSchema.index({ "countryRank.country": 1, "countryRank.position": 1 });
RankingSchema.index({ "topScoreRank.worldRank.position": 1 });
RankingSchema.index({ "manGoSetRank.worldRank.position": 1 });
RankingSchema.index({ "leagueRank.worldRank.position": 1 });

const RankModel = model<IRank>("Rank", RankingSchema);

export default RankModel;
