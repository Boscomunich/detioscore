import EventEmitter from "node:events";
import { createRankForUser, updateUserCountryAndRanks } from "../user/utils";

export const userEmitter = new EventEmitter();
userEmitter.setMaxListeners(1);

userEmitter.on("init-rank", async (userId: string) => {
  await createRankForUser(userId);
});

userEmitter.on("reinit-rank", async (userId: string, country: string) => {
  const some = await updateUserCountryAndRanks(userId, country);
  console.log("rank", some);
});
