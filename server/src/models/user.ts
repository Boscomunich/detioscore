import mongoose, { Document, Types } from "mongoose";

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
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
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
      enum: ["USER", "ADMIN", "SUPER_ADMIN"],
      default: "USER",
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

const User = mongoose.model<IUserDocument>("User", UserSchema);

export default User;
