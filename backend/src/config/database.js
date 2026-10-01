import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import dns from 'node:dns';

// Enable verbatim DNS result order so Node can resolve Supabase IPv6 database hostnames (fixes EAI_AGAIN errors)
try {
  dns.setDefaultResultOrder('verbatim');
} catch (e) {}

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Please configure it in your backend/.env file.");
}

export const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

