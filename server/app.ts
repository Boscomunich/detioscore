import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import { livescoreRouter } from "./src/livescore/route";
import { connectToDatabase } from "./src/database";
import globalErrorHandler from "./src/middleware/error-handler";
import { toNodeHandler } from "better-auth/node";
import { auth, connectAuthClient } from "./utils/auth";
// import { blockBlacklistedIP } from "./utils/blocked-ip";
import cookieParser from "cookie-parser";
import { topScoreRouter } from "./src/top-score/route";
import { sessionMiddleware } from "./src/middleware/session";
import { manGoSetRouter } from "./src/mango-set/route";
import { competitionRouter } from "./src/competition/route";
dotenv.config();

const port: number = parseInt(process.env.PORT || "6000", 10);
const allowedOrigins: string[] = [
  process.env.LOCAL_CLIENT!,
  process.env.PROD_CLIENT!,
  process.env.PROD_CLIENT_2ND!,
];

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

connectToDatabase();
connectAuthClient();

// app.use(blockBlacklistedIP);

app.use(cookieParser());

// Handle preflight OPTIONS requests for Better Auth
app.options(
  "/api/auth/{*any}",
  cors({ origin: allowedOrigins, credentials: true })
);
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.get("/", (req: Request, res: Response) => {
  res.json("Welcome to detio score API");
});

app.use(express.json());

app.use("/livescore", livescoreRouter);

app.use("/top-score", sessionMiddleware, topScoreRouter);

app.use("/man-go-set", sessionMiddleware, manGoSetRouter);

app.use("/competition", sessionMiddleware, competitionRouter);

app.use(globalErrorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
