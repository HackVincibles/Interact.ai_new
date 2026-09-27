import { dbPool } from './backend/src/config/database.js';
import crypto from 'crypto';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
}

async function seedAdmin() {
  try {
    const defaultPassword = process.env.INITIAL_ADMIN_PASSWORD || 'interact_secure_2026';
    const hash = hashPassword(defaultPassword);
    
    await dbPool.query(
      `INSERT INTO admins (username, email, password_hash, role) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      ['admin', 'admin@interact.ai', hash, 'superadmin']
    );
    console.log('Seeded admin securely. Password:', defaultPassword);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedAdmin();
