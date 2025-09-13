import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const client = createClient({
  url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}`,
});

client.on("error", (err: Error) => console.error("Redis Error:", err));

export async function connectRedis() {
  await client.connect();
  console.log("Redis connected");
}

const cleanup = async () => {
  console.log("Closing Redis connection...");
  try {
    await client.quit();
  } catch (err) {
    console.error("Error closing Redis", err);
  }
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("beforeExit", cleanup);

export default client;
