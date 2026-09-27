// Interview Database Model
import { dbPool } from '../config/database.js';

export class InterviewModel {
  static async saveInterviewSession(interviewData) {
    const { userId, domain, targetRole, questions, score, feedback } = interviewData;
    try {
      const result = await dbPool.query(
        `INSERT INTO interviews (user_id, domain, target_role, questions, score, feedback)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [userId || null, domain, targetRole, JSON.stringify(questions), score || 0, feedback || '']
      );
      return result.rows[0];
    } catch (err) {
      console.warn('Postgres query fallback (saveInterviewSession):', err.message);
      return { id: Date.now(), domain, target_role: targetRole, score };
    }
  }

  static async getHistoryByUserId(userId) {
    try {
      const res = await dbPool.query(
        'SELECT * FROM interviews WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return res.rows;
    } catch (err) {
      console.warn('Postgres query fallback (getHistoryByUserId):', err.message);
      return [];
    }
  }

  static async getInterviewById(id) {
    try {
      const res = await dbPool.query('SELECT * FROM interviews WHERE id = $1', [id]);
      return res.rows[0];
    } catch (err) {
      console.warn('Postgres query fallback (getInterviewById):', err.message);
      return null;
    }
  }

  static async updateInterviewReport(id, reportObj) {
    try {
      const score = reportObj.overallScore || 0;
      const feedbackJson = JSON.stringify(reportObj);
      const res = await dbPool.query(
        'UPDATE interviews SET score = $1, feedback = $2 WHERE id = $3 RETURNING *',
        [score, feedbackJson, id]
      );
      return res.rows[0];
    } catch (err) {
      console.warn('Postgres query fallback (updateInterviewReport):', err.message);
      return null;
    }
  }
}
