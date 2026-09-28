import { dbPool } from './src/config/database.js';

async function run() {
  try {
    const resCount = await dbPool.query('SELECT COUNT(*) FROM jobs;');
    console.log('COUNT:', resCount.rows[0].count);

    console.log('Testing INSERT...');
    const insertRes = await dbPool.query(`
      INSERT INTO jobs (title, company, logo, location, category, stipend, duration, eligible_batch, experience_required, deadline, posted, match_score, is_govt, skills, description, official_apply_url, source_provider)
      VALUES ('Test Title', 'Test Company', 'logo', 'location', 'internship', 'stipend', 'duration', 'batch', '0', NULL, 'posted', 'score', false, '[]', 'desc', 'test_url_unique', 'test_provider')
      RETURNING id;
    `);
    const id = insertRes.rows[0].id;
    console.log('INSERT successful. ID:', id);

    console.log('Testing SELECT...');
    const selectRes = await dbPool.query('SELECT * FROM jobs WHERE id = $1', [id]);
    console.log('SELECT successful. Title:', selectRes.rows[0].title);

    console.log('Testing UPDATE...');
    await dbPool.query("UPDATE jobs SET title = 'Updated Title' WHERE id = $1", [id]);
    const updateSelectRes = await dbPool.query('SELECT title FROM jobs WHERE id = $1', [id]);
    console.log('UPDATE successful. New Title:', updateSelectRes.rows[0].title);

    console.log('Cleaning up...');
    await dbPool.query('DELETE FROM jobs WHERE id = $1', [id]);
    console.log('DELETE successful. Test complete.');
  } catch (err) {
    console.error('DB Test Error:', err);
  } finally {
    process.exit(0);
  }
}
run();
