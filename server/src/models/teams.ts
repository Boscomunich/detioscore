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
  teamId: number;
  points: number;
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
  starTeam?: number | null;
  teamPoints: ITeamPoints[];
  totalPoints: number;
  rank?: number | null;
  stepsVerified: boolean;
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
          matchVenue: { type: String, required: false },
        },
      ],
      default: [],
    },

    starTeam: {
      type: Number,
      default: null,
      validate: {
        validator: function (value: number) {
          const doc = this as ITeamSelection;
          if (!value) return true;
          return doc.teams?.some((t) => t.selectedTeam.teamId === value);
        },
        message: "Star team must be one of the selected teams",
      },
    },

    teamPoints: {
      type: [
        {
          teamId: { type: Number, required: true },
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
  },
  { timestamps: true }
);

// Ensure one TeamSelection per (competition, user)
TeamSelectionSchema.index({ competition: 1, user: 1 }, { unique: true });

// Ensure unique starTeam per competition (ignores null)
TeamSelectionSchema.index(
  { competition: 1, starTeam: 1 },
  {
    unique: true,
    partialFilterExpression: { starTeam: { $type: "number" } },
  }
);

// Handle duplicate entries nicely
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
