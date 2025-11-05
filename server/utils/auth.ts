import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, createAuthMiddleware, jwt } from "better-auth/plugins";
import mongoose from "../src/database";
import { emailEmitter } from "../src/event-emitter/email-emitter";
import { eventEmitter } from "../src/event-emitter";
import { userEmitter } from "../src/event-emitter/user-emitter";

export const createAuth = () => {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error(
      "Mongoose not connected yet — call connectToDatabase() first"
    );
  }

  return betterAuth({
    database: mongodbAdapter(db),
    hooks: {
      after: createAuthMiddleware(async (ctx) => {
        if (ctx.path.startsWith("/sign-up")) {
          const user = (ctx.context.returned as { user?: { id: string } })
            ?.user;
          if (user) {
            eventEmitter.emit("create-wallet", user.id);
            userEmitter.emit("init-rank", user.id);
          }
        }

        if (ctx.path.startsWith("/update-user")) {
          const user = ctx?.context?.newSession?.user;

          console.log("Updated user:", user);
          if (user?.country && user.country !== "Unknown") {
            console.log("i was called");
            eventEmitter.emit("create-wallet", user.id);
            userEmitter.emit("init-rank", user.id);
          }
        }
      }),
      // after: updateUser(async (ctx) => {})
    },

    plugins: [
      admin({ adminRoles: ["ADMIN", "SUPER_ADMIN"] }),
      jwt({
        jwt: {
          definePayload: ({ user }) => {
            return {
              id: user.id,
              email: user.email,
              role: user.role,
            };
          },
        },
      }),
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
        country: {
          type: "string",
          required: false,
          defaultValue: "Unknown",
          input: true,
        },
      },
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url, token }) => {
        const frontendUrl = `${process.env.PROD_CLIENT}/verify-email`;
        emailEmitter.emit(
          "send-verification-email",
          user.email,
          user.name,
          frontendUrl,
          token
        );
      },
      sendOnSignIn: true,
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      expiresIn: 3600,
    },
    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      requireEmailVerification: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      autoSignIn: true,
      sendResetPassword: async ({ user, url, token }) => {
        emailEmitter.emit(
          "send-password-reset-email",
          user.email,
          user.name,
          url,
          token
        );
      },
      resetPasswordTokenExpiresIn: 3600, // 1 hour
    },
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
        redirectURI: `https://server.ditioscore.com/api/auth/callback/google`,
      },
    },
    trustedOrigins: [
      process.env.LOCAL_CLIENT!,
      process.env.PROD_CLIENT!,
      process.env.PROD_CLIENT_2ND!,
    ],
  });
};
