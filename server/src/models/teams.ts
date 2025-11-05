import mongoose, { Schema, Document, model } from "mongoose";

export interface ISelectedTeam {
  teamId: number;
  name: string;
  logo?: string;
}

export interface ITeamEntry {
  fixtureId: string;
  selectedTeam: ISelectedTeam;
  opponentTeam: ISelectedTeam;
  matchVenue?: string;
}

export interface ITeamPoints {
  fixtureId: number;
  score: {
    home: number;
    away: number;
  };
  points: number;
  isLive: boolean;
  isFT: boolean;
}

export interface IProof {
  step: string;
  url: string;
  verified: boolean;
}

export interface ITeamSelection extends Document {
  competition: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  stakedAmount: number;
  teams: ITeamEntry[];
  starTeam?: string | null;
  teamPoints: ITeamPoints[];
  totalPoints: number;
  rank?: number | null;
  stepsVerified: boolean;
  isDisqualified: boolean;
  proofs: IProof[];
  createdAt: Date;
  updatedAt: Date;
}

const TeamSelectionSchema: Schema<ITeamSelection> = new Schema(
  {
    competition: {
      type: Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    stakedAmount: { type: Number, default: 0 },

    teams: {
      type: [
        {
          fixtureId: { type: String, required: true },
          selectedTeam: {
            teamId: { type: Number, required: true },
            name: { type: String, required: true },
            logo: { type: String, default: "" },
          },
          opponentTeam: {
            teamId: { type: Number, required: true },
            name: { type: String, required: true },
            logo: { type: String, default: "" },
          },
          matchVenue: { type: String },
        },
      ],
      default: [],
    },

    starTeam: {
      type: String,
      default: null,
      validate: {
        validator: function (value: string) {
          const doc = this as ITeamSelection;
          if (!value) return true;
          return doc.teams?.some((t) => String(t.fixtureId) === String(value));
        },
        message: "Star team must be one of the selected teams",
      },
    },

    teamPoints: {
      type: [
        {
          fixtureId: { type: Number, required: true },
          score: {
            type: {
              home: { type: Number, required: true },
              away: { type: Number, required: true },
            },
            required: true,
          },
          points: { type: Number, default: 0 },
          isLive: { type: Boolean, default: false },
          isFT: { type: Boolean, default: false },
        },
      ],
      default: [],
    },

    totalPoints: { type: Number, default: 0 },
    rank: { type: Number, default: null },

    proofs: {
      type: [
        {
          step: { type: String, required: true },
          url: { type: String, required: true },
          verified: { type: Boolean, default: false },
        },
      ],
      default: [],
    },

    stepsVerified: { type: Boolean, default: false },
    isDisqualified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

//Ensure one TeamSelection per (competition, user)
TeamSelectionSchema.index({ competition: 1, user: 1 }, { unique: true });

//Handle duplicate key errors nicely
TeamSelectionSchema.post("save", function (error: any, doc: any, next: any) {
  if (error.code === 11000) {
    if (error.keyPattern?.competition && error.keyPattern?.starTeam) {
      return next(
        new Error("That star team is already taken in this competition.")
      );
    }
    if (error.keyPattern?.competition && error.keyPattern?.user) {
      return next(new Error("You have already joined this competition."));
    }
  }
  next(error);
});

export default model<ITeamSelection>("TeamSelection", TeamSelectionSchema);
