import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";

import { connectToDatabase } from "./src/database";

import { livescoreRouter } from "./src/livescore/route";
import { topScoreRouter } from "./src/top-score/route";
import { manGoSetRouter } from "./src/mango-set/route";
import { competitionRouter } from "./src/competition/route";
import globalErrorHandler from "./src/middleware/error-handler";
import { sessionMiddleware } from "./src/middleware/session";
import { createAuth } from "./utils/auth";

dotenv.config();

const port = parseInt(process.env.PORT || "6000", 10);
const allowedOrigins = [
  process.env.LOCAL_CLIENT!,
  process.env.PROD_CLIENT!,
  process.env.PROD_CLIENT_2ND!,
];

async function startServer() {
  await connectToDatabase();

  const auth = createAuth();

  const app = express();
  app.use(morgan("dev"));
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
  app.use(
    cors({
      origin: allowedOrigins,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
      allowedHeaders: "Content-Type, Authorization",
    })
  );
  app.use(cookieParser());

  // Better Auth endpoints
  app.options(
    "/api/auth/{*any}",
    cors({ origin: allowedOrigins, credentials: true })
  );
  app.all("/api/auth/{*any}", toNodeHandler(auth));

  app.get("/", (req, res) => res.json("Welcome to detio score API"));
  app.use(express.json());

  app.use("/livescore", livescoreRouter);
  app.use("/top-score", sessionMiddleware(auth), topScoreRouter);
  app.use("/man-go-set", sessionMiddleware(auth), manGoSetRouter);
  app.use("/competition", sessionMiddleware(auth), competitionRouter);

  app.use(globalErrorHandler);

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
