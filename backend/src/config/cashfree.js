// Cashfree Payment Gateway Configuration
import dotenv from 'dotenv';
dotenv.config();

export const cashfreeConfig = {
  appId: process.env.CASHFREE_APP_ID || '',
  secretKey: process.env.CASHFREE_SECRET_KEY || '',
  apiUrl: process.env.CASHFREE_API_URL || 'https://sandbox.cashfree.com/pg',
  apiVersion: '2023-08-01',
};
