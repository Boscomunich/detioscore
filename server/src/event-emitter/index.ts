import EventEmitter from "node:events";
import { createWallet } from "../transaction/controller";
export const eventEmitter = new EventEmitter();

eventEmitter.on("create-wallet", async (userId: string) => {
  console.log("called 3");
  await createWallet(userId);
});
