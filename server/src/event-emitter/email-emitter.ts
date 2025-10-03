import EventEmitter from "node:events";
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mail-services/mail";
export const emailEmitter = new EventEmitter();

emailEmitter.on(
  "send-welcome-email",
  async (email: string, username: string) => {
    await sendWelcomeEmail(email, username);
  }
);

emailEmitter.on(
  "send-verification-email",
  async (email: string, username: string, url: string, token: string) => {
    await sendVerificationEmail(email, username, url, token);
  }
);

emailEmitter.on(
  "send-password-reset-email",
  async (email: string, username: string, url: string, token: string) => {
    await sendResetPasswordEmail(email, username, url, token);
  }
);
