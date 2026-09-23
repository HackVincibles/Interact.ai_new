// Course Database Model
import { dbPool } from '../config/database.js';

export class CourseModel {
  static async getAllCourses() {
    try {
      const res = await dbPool.query('SELECT * FROM courses ORDER BY created_at DESC');
      return res.rows;
    } catch (err) {
      console.warn('Postgres query fallback (getAllCourses):', err.message);
      return [];
    }
  }
}
