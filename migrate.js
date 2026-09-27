import { dbPool } from './backend/src/config/database.js';
import fs from 'fs';

async function initDB() {
  try {
    console.log('Running schema migrations...');
    const schemaSql = fs.readFileSync('./backend/src/config/schema.sql', 'utf8');
    
    // Split by semicolons or just run it all if the pg driver supports multiple statements
    await dbPool.query(schemaSql);
    
    // Add additional alterations if missing from schema.sql
    const alterations = `
CREATE TABLE IF NOT EXISTS interview_questions (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    category VARCHAR(100),
    difficulty VARCHAR(50),
    interview_type VARCHAR(100),
    expected_skills TEXT,
    evaluation_criteria TEXT,
    ideal_answer TEXT,
    time_limit INT DEFAULT 180,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS career_paths (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    required_skills TEXT,
    recommended_courses TEXT,
    recommended_interview_type VARCHAR(100),
    resources TEXT,
    difficulty VARCHAR(50),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resources (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    url TEXT NOT NULL,
    thumbnail TEXT,
    author VARCHAR(255),
    tags TEXT,
    is_published BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cta_text VARCHAR(100),
    cta_url TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    is_published BOOLEAN DEFAULT true,
    priority INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id SERIAL PRIMARY KEY,
    admin_id INT,
    admin_username VARCHAR(100),
    action VARCHAR(255) NOT NULL,
    entity VARCHAR(100),
    entity_id VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS thumbnail TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS external_url TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS difficulty VARCHAR(50);
`;
    await dbPool.query(alterations);

    console.log('Migrations complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

initDB();
