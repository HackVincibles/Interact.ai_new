// Job Database Model
import { dbPool } from '../config/database.js';

export class JobModel {
  static async getAllJobs() {
    try {
      const res = await dbPool.query('SELECT * FROM jobs ORDER BY created_at DESC');
      return res.rows;
    } catch (err) {
      console.warn('Postgres query fallback (getAllJobs):', err.message);
      return [];
    }
  }
}
