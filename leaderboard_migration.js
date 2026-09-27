import { dbPool } from './backend/src/config/database.js';

async function migrate() {
  try {
    console.log('Running leaderboard schema migrations...');
    
    // Add points and avatar_id to users
    await dbPool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS points INT DEFAULT 0;`);
    await dbPool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_id VARCHAR(50);`);
    
    // Create xp_events table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS xp_events (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        source VARCHAR(100),
        amount INT,
        reference_id VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create challenges table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS career_challenges (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        career_path_id INT,
        creator_id INT REFERENCES users(id) ON DELETE SET NULL,
        invite_code VARCHAR(50) UNIQUE,
        duration_days INT DEFAULT 30,
        end_date TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create challenge_participants table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS challenge_participants (
        id SERIAL PRIMARY KEY,
        challenge_id INT REFERENCES career_challenges(id) ON DELETE CASCADE,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(challenge_id, user_id)
      );
    `);

    console.log('Migrations completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
