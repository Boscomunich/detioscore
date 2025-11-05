import cron from "node-cron";
import {
  awardPoints,
  indexFixtures,
  updateTodayFixtureChunks,
} from "../background-tasks/award-points";

export function scheduleDailyFixtureIndexer() {
  // Run every 30 minutes
  cron.schedule("*/40 * * * *", () => {
    const now = new Date();
    const hourUTC = now.getUTCHours();
    const minuteUTC = now.getUTCMinutes();

    if (true) {
      console.log(
        `Running indexFixtures at ${hourUTC}:${minuteUTC
          .toString()
          .padStart(2, "0")} UTC`
      );

      indexFixtures();
    }
  });
}

export function scheduleDailyFixtureUpdate() {
  cron.schedule("*/50 * * * *", () => {
    updateTodayFixtureChunks();
  });
}

export function scheduleDailyAwardPoints() {
  cron.schedule("*/50 * * * *", () => {
    awardPoints();
  });
}
