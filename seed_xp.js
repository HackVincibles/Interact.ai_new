import { dbPool } from './backend/src/config/database.js';

async function seedXP() {
  try {
    const res = await dbPool.query('SELECT id FROM users');
    for (let i = 0; i < res.rows.length; i++) {
      const user = res.rows[i];
      const xp = Math.floor(Math.random() * 5000) + 100;
      await dbPool.query('UPDATE users SET points = $1 WHERE id = $2', [xp, user.id]);
    }
    console.log('Seeded XP to users.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding XP:', error);
    process.exit(1);
  }
}

seedXP();
