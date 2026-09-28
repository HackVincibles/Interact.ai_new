import { WebIntelligenceService } from './src/services/webIntelligenceService.js';
import { JobModel } from './src/models/jobModel.js';
import { dbPool } from './src/config/database.js';

const mockHtml = `
<html><body>
<h1>Software Engineer Intern</h1>
<h2>Google</h2>
<p>Join Google as a Software Engineering Intern in Bangalore. You will work on C++, Java, and Python.</p>
<p>Stipend: 1,00,000 INR per month. Duration: 6 months.</p>
<a href="https://careers.google.com/test-apply">Apply Here</a>
</body></html>
`;

async function run() {
  try {
    const extracted = await WebIntelligenceService.extractStructuredJobData(mockHtml, 'https://careers.google.com');
    console.log('Gemini Extraction:', extracted);

    const dbRes = await dbPool.query(
      `INSERT INTO jobs (title, company, logo, location, category, stipend, duration, eligible_batch, experience_required, deadline, posted, match_score, is_govt, skills, description, official_apply_url, source_provider)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       RETURNING id`,
      [
        extracted.title, extracted.company, 'logo.png', extracted.location.join(', '), 'internship',
        extracted.salary.min ? extracted.salary.min.toString() : null, '6 months', '2026', '0',
        null, 'now', '100%', false,
        JSON.stringify(extracted.skills), extracted.description, extracted.applyUrl, 'Test'
      ]
    );
    console.log('DB Insert ID:', dbRes.rows[0].id);

    const allJobs = await JobModel.getAllJobs();
    console.log('All DB Jobs count:', allJobs.length);
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
run();
