// SendGrid Email & OTP Service Configuration
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.SENDGRID_API_KEY || '';
sgMail.setApiKey(apiKey);

export const sendgridService = sgMail;
export const senderEmail = process.env.SENDER_EMAIL || 'support@interact.ai';
