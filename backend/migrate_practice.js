import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    await pool.query("ALTER TABLE interviews ADD COLUMN IF NOT EXISTS practice_mode VARCHAR(50) DEFAULT 'full'");
    await pool.query("ALTER TABLE interviews ADD COLUMN IF NOT EXISTS round_type VARCHAR(50)");
    console.log('Migration successful.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    pool.end();
  }
}
run();
