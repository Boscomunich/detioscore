import mongoose, { Schema, Document, model } from "mongoose";

interface ITeam {
  teamId: number;
  name: string;
  logo?: string;
}

interface ITeamPoints {
  teamId: number;
  points: number;
}

interface IProof {
  step: string;
  url: string;
  verified: boolean;
}

export interface ITeamSelection extends Document {
  competition: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  stakedAmount: number;
  teams: ITeam[];
  starTeam?: number | null;
  teamPoints: ITeamPoints[];
  totalPoints: number;
  rank?: number;
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
          teamId: { type: Number, required: true },
          name: { type: String, required: true },
          logo: { type: String, default: "" },
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
          return doc.teams?.some((team) => team.teamId === value);
        },
        message: "Star team must be one of the selected teams",
      },
    },

    teamPoints: {
      type: [
        {
          teamId: { type: Number, required: true },
          points: { type: Number, default: 0 },
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

//Ensure one TeamSelection per (competition, user)
TeamSelectionSchema.index({ competition: 1, user: 1 }, { unique: true });

// Handle duplicate entries
TeamSelectionSchema.post("save", function (error: any, doc: any, next: any) {
  if (error.code === 11000) {
    next(new Error("You have already joined this competition."));
  } else {
    next(error);
  }
});

export default model<ITeamSelection>("TeamSelection", TeamSelectionSchema);
