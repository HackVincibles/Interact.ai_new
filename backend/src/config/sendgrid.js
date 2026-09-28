// Brevo Email Service Configuration
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const smtpUser = process.env.BREVO_SMTP_USER || '';
const smtpKey = process.env.BREVO_SMTP_KEY || '';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: smtpUser,
    pass: smtpKey,
  },
});

export const sendgridService = {
  send: async (msg) => {
    return transporter.sendMail(msg);
  }
};
export const senderEmail = process.env.SENDER_EMAIL || 'support@interact.ai';
