import mongoose, { Schema, Document, model } from "mongoose";

interface ITeam {
  name: string;
  logo?: string;
  id: string;
}

interface ITeamPoints {
  team: string;
  points: number;
}

interface IProof {
  step: string; // changed from number to string
  url: string;
  verified: boolean;
}

export interface ITeamSelection extends Document {
  competition: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  stakedAmount: number;
  teams?: ITeam[];
  starTeam?: string;
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
          name: { type: String },
          logo: { type: String, default: "" },
          id: { type: String },
        },
      ],
      default: [],
    },

    starTeam: {
      type: String,
      default: "",
      validate: {
        validator: function (value: string) {
          const doc = this as ITeamSelection;
          if (!value) return true;
          return doc.teams?.some((team) => team.id === value);
        },
        message: "Star team must be one of the selected teams",
      },
    },

    teamPoints: {
      type: [
        {
          team: { type: String },
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
          step: { type: String, required: true }, // changed to string
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

// Partial unique index
TeamSelectionSchema.index(
  { competition: 1, starTeam: 1 },
  {
    unique: true,
    partialFilterExpression: { starTeam: { $exists: true, $ne: "" } },
  }
);

// Handle duplicate starTeam errors
TeamSelectionSchema.post("save", function (error: any, doc: any, next: any) {
  if (error.code === 11000) {
    next(
      new Error(
        "This star team has already been selected for this competition."
      )
    );
  } else {
    next(error);
  }
});

export default model<ITeamSelection>("TeamSelection", TeamSelectionSchema);
