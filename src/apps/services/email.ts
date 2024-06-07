import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import createHttpError from "http-errors";
import { getUserByEmail } from "./user";
import dotenv from 'dotenv'; // Import the dotenv package

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.USER_PASS,
  },
});

export const sendEmail = async (mailOptions: Mail.Options): Promise<any> => {
  try {
    return await transporter.sendMail(mailOptions);
  } catch (error: any) {
    createHttpError(500, { message: error.message });
  }
};
const FE_BASE_URL = "http://localhost:3000";
export const resetPasswordEmailTemplate = (token = ""): string => `
<html>
  <body>
    <h3>Welcome to app</h3>
    <p>Click <a href="${FE_BASE_URL}/newUser?token=${token}">here</a> to register yourself</p>
  </body>
</html>`;

export const sendForgotPasswordEmail = async (mailOptions: Mail.Options): Promise<any> => {
  try {
    return await transporter.sendMail(mailOptions);
  } catch (error: any) {
    createHttpError(500, { message: error.message });
  }
};
export const forgotPasswordEmailTemplate = (token = ""): string => `
<html>
  <body>
    <h3>Welcome to app</h3>
    <p>Click <a href="${FE_BASE_URL}/forgot-password?token=${token}">here</a> to register yourself</p>
  </body>
</html>`;
