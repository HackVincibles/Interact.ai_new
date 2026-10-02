// Interview Database Model
import { dbPool } from '../config/database.js';

export class InterviewModel {
  static async saveInterviewSession(interviewData) {
    const { userId, domain, targetRole, questions, score, feedback, practiceMode, roundType } = interviewData;
    try {
      const result = await dbPool.query(
        `INSERT INTO interviews (user_id, domain, target_role, questions, score, feedback, practice_mode, round_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [userId || null, domain, targetRole, JSON.stringify(questions), score || 0, feedback || '', practiceMode || 'full', roundType || null]
      );
      return result.rows[0];
    } catch (err) {
      console.warn('Postgres query fallback (saveInterviewSession):', err.message);
      return { id: Date.now(), domain, target_role: targetRole, score };
    }
  }

  // Memory cache for fast session recovery across restarts/refreshes
  static codingSessionCache = new Map();

  static async saveCodingSessionState(sessionId, codingState) {
    const sessionData = {
      ...codingState,
      updatedAt: new Date().toISOString()
    };
    this.codingSessionCache.set(String(sessionId), sessionData);

    try {
      // Store in DB feedback / session column if postgres is active
      const res = await dbPool.query(
        'UPDATE interviews SET questions = $1 WHERE id = $2 RETURNING *',
        [JSON.stringify(sessionData), sessionId]
      );
      return res.rows[0] || sessionData;
    } catch (err) {
      console.warn('Postgres query fallback (saveCodingSessionState):', err.message);
      return sessionData;
    }
  }

  static async getCodingSessionState(sessionId) {
    const cached = this.codingSessionCache.get(String(sessionId));
    if (cached) return cached;

    try {
      const res = await dbPool.query('SELECT questions FROM interviews WHERE id = $1', [sessionId]);
      if (res.rows[0]?.questions) {
        const parsed = typeof res.rows[0].questions === 'string' ? JSON.parse(res.rows[0].questions) : res.rows[0].questions;
        return parsed;
      }
    } catch (err) {
      console.warn('Postgres query fallback (getCodingSessionState):', err.message);
    }
    return null;
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
