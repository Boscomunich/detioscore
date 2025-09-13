import mongoose from "mongoose";

const CompetitionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["TopScore", "ManGoSet", "League"],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Teams selection
    requiredTeams: { type: Number, required: true },
    minTeams: { type: Number, default: 3 },
    maxTeams: { type: Number, default: 20 },

    // Entry fee for ManGoSet
    entryFee: { type: Number, default: 0 },

    // Participant cap for ManGoSet
    participantCap: { type: Number, default: 100 },
    minParticipants: { type: Number, default: 2 },

    // League configuration
    leagueConfig: {
      type: {
        matchRequirement: { type: Number, default: 7 },
        minMatchRequirement: { type: Number, default: 3 },
        maxMatchRequirement: { type: Number, default: 15 },

        durationDays: { type: Number, default: 30 },
        minDurationDays: { type: Number, default: 7 },
        maxDurationDays: { type: Number, default: 60 },

        maxExtensionDays: { type: Number, default: 30 },
      },
      default: null,
    },

    // Rules with optional step verification
    rules: {
      type: [
        {
          step: { type: Number, required: true },
          description: { type: String, required: true },
          stepVerification: { type: Boolean, default: false },
        },
      ],
      default: undefined,
    },

    prizePool: { type: Number, default: 0 },
    hostContribution: { type: Number, default: 0 },
    invitationCode: { type: String, required: true, unique: true },

    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "joined"],
          default: "pending",
        },
        joinedAt: { type: Date, default: null },
      },
    ],
    isActive: { type: Boolean, default: true },
    isPublic: { type: Boolean, default: true },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Competition", CompetitionSchema);
