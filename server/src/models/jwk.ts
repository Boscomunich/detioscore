import mongoose, { Schema, Document } from "mongoose";

export interface IJwk extends Document {
  id: string;
  publicKey: string;
  privateKey: string;
  createdAt: Date;
}

const JwkSchema = new Schema<IJwk>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  publicKey: {
    type: String,
    required: true,
  },
  privateKey: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const JwkModel =
  mongoose.models.Jwk || mongoose.model<IJwk>("Jwk", JwkSchema);
