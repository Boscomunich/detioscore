import mongoose, { Document } from "mongoose";

export interface IVerification extends Document {
  id: string;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationSchema = new mongoose.Schema<IVerification>(
  {
    id: { type: String, required: true, unique: true },
    identifier: { type: String, required: true },
    value: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Verification = mongoose.model<IVerification>(
  "Verification",
  VerificationSchema
);
