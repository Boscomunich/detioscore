import mongoose, { Document } from "mongoose";

export interface IAccount extends Document {
  id: string;
  userId: mongoose.Types.ObjectId; // FK -> User._id
  accountId: string;
  providerId: string;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
  scope?: string;
  idToken?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new mongoose.Schema<IAccount>(
  {
    id: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountId: { type: String, required: true },
    providerId: { type: String, required: true },
    accessToken: { type: String },
    refreshToken: { type: String },
    accessTokenExpiresAt: { type: Date },
    refreshTokenExpiresAt: { type: Date },
    scope: { type: String },
    idToken: { type: String },
    password: { type: String },
  },
  { timestamps: true }
);

export const Account = mongoose.model<IAccount>("Account", AccountSchema);
