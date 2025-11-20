import mongoose, { Document, Types } from "mongoose";
import { cascadeDeletePlugin } from "./cascade-delete";

export interface IUserIP {
  ip?: string | null;
  lastUsed: Date;
}

export interface IUser {
  username: string;
  email: string;
  password?: string;
  googleId?: string;
  emailVerified: boolean;
  role: "user" | "admin" | "super_admin";
  country: string;
  ipAddresses: IUserIP[];
  lastLogin?: Date;
  deviceInfo?: string;
  banned: boolean;
  suspended: boolean;
  suspensionReason?: string | null;
  banReason?: string | null;
  banExpires?: Date | null;
}

export interface IUserDocument extends IUser, Document {
  ipAddresses: Types.DocumentArray<IUserIP>;
}

const UserSchema = new mongoose.Schema<IUserDocument>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    emailVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
    country: { type: String, required: true },
    ipAddresses: {
      type: [
        {
          ip: { type: String },
          lastUsed: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    lastLogin: { type: Date },
    deviceInfo: { type: String },
    banned: { type: Boolean, required: true, default: false },
    banReason: { type: String, default: null },
    banExpires: { type: Date, default: null },
    suspended: { type: Boolean, required: true, default: false },
    suspensionReason: { type: String, default: null },
  },
  { timestamps: true, collection: "user" }
);

UserSchema.plugin(cascadeDeletePlugin, {
  related: [
    { model: "Achievement", field: "user", importPath: "./Achievement" },
    { model: "Wallet", field: "user", importPath: "./Wallet" },
    { model: "Transaction", field: "user", importPath: "./Transaction" },
    { model: "TeamSelection", field: "user", importPath: "./TeamSelection" },
    { model: "Competition", field: "createdBy", importPath: "./Competition" },
    { model: "Account", field: "userId", importPath: "./Account" },
    { model: "Notification", field: "user", importPath: "./Notification" },
    { model: "Rank", field: "user", importPath: "./Rank" },
    { model: "Session", field: "userId", importPath: "./Session" },
  ],
});

const User = mongoose.model<IUserDocument>("User", UserSchema);

export default User;
