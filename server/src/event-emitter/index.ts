import EventEmitter from "node:events";
import { createWallet } from "../transaction/utils";
import { createNotification } from "../notification/controller";
export const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(1);

eventEmitter.on("create-wallet", async (userId: string) => {
  await createWallet(userId);
});
eventEmitter.on("create-notification", async (payload) => {
  await createNotification(
    payload.recipientId,
    payload.type,
    payload.title,
    payload.message,
    payload.link
  );
});
