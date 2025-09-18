import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, bearer, jwt } from "better-auth/plugins";
import mongoose from "../src/database";

export const createAuth = () => {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error(
      "Mongoose not connected yet — call connectToDatabase() first"
    );
  }

  return betterAuth({
    database: mongodbAdapter(db),
    plugins: [
      jwt({
        jwt: {
          expirationTime: "1h",
          definePayload: ({ user }) => ({
            id: user.id,
            email: user.email,
            role: user.role,
          }),
        },
      }),
      admin({ adminRoles: ["ADMIN", "SUPER_ADMIN"] }),
      bearer(),
    ],
    user: {
      modelName: "user",
      fields: { name: "username" },
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "USER",
          input: false,
        },
      },
    },
    emailAndPassword: { enabled: true },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: { enabled: true, maxAge: 15 * 60 },
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        accessType: "offline",
        prompt: "select_account consent",
      },
    },
    trustedOrigins: [
      process.env.LOCAL_CLIENT!,
      process.env.PROD_CLIENT!,
      process.env.PROD_CLIENT_2ND!,
    ],
  });
};
