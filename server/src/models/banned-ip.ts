import mongoose from "mongoose";

const BannedIPSchema = new mongoose.Schema(
  {
    ipAddress: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reason: { type: String, default: "Repeated offenses" },
    banDate: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("BannedIP", BannedIPSchema);
