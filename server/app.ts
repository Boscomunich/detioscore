import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import { connectToDatabase } from "./src/database";

import { livescoreRouter } from "./src/livescore/route";
import { topScoreRouter } from "./src/top-score/route";
import { manGoSetRouter } from "./src/mango-set/route";
import { competitionRouter } from "./src/competition/route";
import globalErrorHandler from "./src/middleware/error-handler";
import { createAuth } from "./utils/auth";
import { transactionRouter } from "./src/transaction/route";
import { notificationRouter } from "./src/notification/route";
import { userRouter } from "./src/user/route";
import { adminRouter } from "./src/admin/route";
import {
  scheduleDailyAwardPoints,
  scheduleDailyFixtureIndexer,
  scheduleDailyFixtureUpdate,
} from "./src/cron-jobs";
import { rankingRouter } from "./src/ranks/route";
import {
  adminTokenAuthMiddleware,
  tokenAuthMiddleware,
} from "./src/middleware/auth";

const port = parseInt(process.env.PORT || "6000", 10);
const allowedOrigins = [
  process.env.LOCAL_CLIENT!,
  process.env.PROD_CLIENT!,
  process.env.PROD_CLIENT_2ND!,
];

async function startServer() {
  await connectToDatabase();

  const auth = createAuth();

  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Ditio Score API",
        version: "1.0.0",
        description: "API documentation for Ditio Score",
      },
      servers: [
        {
          url: "http://localhost:5000",
          description: "Local server",
        },
        {
          url: "https://server.ditioscore.com",
          description: "dev server",
        },
      ],
      components: {},
      security: [],
    },
    apis: ["./src/mango-set/docs.ts"], // Path to your API routes
  };

  const specs = swaggerJsdoc(options);

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
  app.use("/top-score", tokenAuthMiddleware(auth), topScoreRouter);
  app.use("/man-go-set", tokenAuthMiddleware(auth), manGoSetRouter);
  app.use("/competition", tokenAuthMiddleware(auth), competitionRouter);
  app.use("/transaction", tokenAuthMiddleware(auth), transactionRouter);
  app.use("/notification", tokenAuthMiddleware(auth), notificationRouter);
  app.use("/user", tokenAuthMiddleware(auth), userRouter);
  app.use("/admin", adminTokenAuthMiddleware(auth), adminRouter);
  app.use("/rankings", tokenAuthMiddleware(auth), rankingRouter);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

  app.use(globalErrorHandler);

  scheduleDailyFixtureIndexer();
  scheduleDailyFixtureUpdate();
  scheduleDailyAwardPoints();

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
