import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

export const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:db%40interact.ai@db.jueocxhfynultunhwixf.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});
