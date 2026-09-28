import { dbPool } from './database.js';

const migrate = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS schedules (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(255) NOT NULL,
        reference_id VARCHAR(255),
        scheduled_at TIMESTAMPTZ NOT NULL,
        duration INTEGER NOT NULL,
        timezone VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'UPCOMING',
        reminder_preferences JSONB,
        reminders_sent JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await dbPool.query(query);
    console.log("Migration successful: schedules table created (or already exists).");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    process.exit(0);
  }
};

migrate();
