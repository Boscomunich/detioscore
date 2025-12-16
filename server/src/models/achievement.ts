import mongoose from "mongoose";
import { Schema, Document, model } from "mongoose";

export interface IAchievement extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  description: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
  iconUrl?: string;
}

const AchievementSchema: Schema<IAchievement> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    points: { type: Number, required: true },
    iconUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const Achievement = model<IAchievement>("Achievement", AchievementSchema);
export default Achievement;
