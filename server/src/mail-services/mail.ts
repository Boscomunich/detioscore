import nodemailer from "nodemailer";
import { verificationTemplate } from "./templates/verification";
import { welcomeTemplate } from "./templates/welcome";
import { passwordResetTemplate } from "./templates/password-reset";
import { logger } from "../logger";

const transporter = nodemailer.createTransport({
  host: "ditioscore.com",
  port: 465,
  secure: true,
  auth: {
    user: "team@ditioscore.com",
    pass: process.env.EMAIL_PASSWORD!,
  },
});

export async function sendWelcomeEmail(email: string, username: string) {
  const options = {
    from: "team@ditioscore.com",
    to: email,
    subject: "Welcome!",
    html: welcomeTemplate(username),
  };
  try {
    await transporter.sendMail(options);
    logger.info("welcome email sent to", email);
  } catch (error) {
    console.log(error);
  }
}

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationUrl: string,
  token: string
) {
  console.log("sending reset email to", email);
  const options = {
    from: "team@ditioscore.com",
    to: email,
    subject: "Verify your email",
    html: verificationTemplate(username, verificationUrl, token),
  };
  try {
    const sent = await transporter.sendMail(options);
    logger.info("verification email sent to", email);
    console.log(sent);
  } catch (error) {
    logger.error(error);
    console.log(error);
  }
}

export async function sendResetPasswordEmail(
  email: string,
  username: string,
  resetUrl: string,
  token: string
) {
  console.log("sending reset email to", email);
  const options = {
    from: "team@ditioscore.com",
    to: email,
    subject: "Reset Password",
    html: passwordResetTemplate(username, resetUrl, token),
  };
  try {
    const sent = await transporter.sendMail(options);
    logger.info("password reset email sent to", email);
    console.log(sent);
  } catch (error) {
    logger.error(error);
    console.log(error);
  }
}
