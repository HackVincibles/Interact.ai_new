import { dbPool } from './database.js';
const test = async () => {
  const result = await dbPool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'schedules';
  `);
  console.log(result.rows);
  
  const userResult = await dbPool.query(`SELECT COUNT(*) FROM users;`);
  console.log('Users count:', userResult.rows[0].count);
  process.exit(0);
};
test();
