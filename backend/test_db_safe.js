import pg from 'pg';
import dotenv from 'dotenv';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
dotenv.config();

async function testConnection() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log('DATABASE_URL is missing');
    return;
  }

  // Obfuscate password for logging
  const parsed = new URL(url);
  console.log(`Database host: ${parsed.hostname}`);
  console.log(`Database port: ${parsed.port}`);
  console.log(`Database user: ${parsed.username}`);
  
  const pool = new pg.Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log('TCP connection: PASS');
    console.log('PostgreSQL authentication: PASS');
    
    const res = await client.query('SELECT 1 as val');
    if (res.rows[0].val === 1) {
      console.log('SELECT 1: PASS');
    } else {
      console.log('SELECT 1: FAIL');
    }
    client.release();
  } catch (err) {
    console.log(`TCP/Auth Error: ${err.message}`);
    console.log('PostgreSQL authentication: FAIL');
  } finally {
    await pool.end();
  }
}

testConnection();
