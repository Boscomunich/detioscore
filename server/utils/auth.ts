import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import dotenv from "dotenv";
import { admin, bearer, jwt } from "better-auth/plugins";
dotenv.config();

const authClient = new MongoClient(process.env.MONGODB_URI!);

export const connectAuthClient = async () => {
  try {
    await authClient.connect();
    console.log("✅ Connected to MongoDB for Better-Auth");
  } catch (error) {
    console.error("❌ Error connecting Better-Auth MongoDB:", error);
    process.exit(1);
  }
};

const db = authClient.db("ditioscoreDB");

export const auth = betterAuth({
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
    admin({
      adminRoles: ["ADMIN", "SUPER_ADMIN"],
    }),
    bearer(),
  ],
  user: {
    modelName: "user",
    fields: {
      name: "username",
    },
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 15 * 60,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: process.env.PROD_CLIENT!,
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
