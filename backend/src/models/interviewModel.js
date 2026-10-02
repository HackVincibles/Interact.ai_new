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

  static async saveCodingSessionState(sessionId, codingState, userId = null) {
    const key = String(sessionId);
    const existing = this.codingSessionCache.get(key);

    // Ownership check on cached record
    if (existing && existing.userId && userId && Number(existing.userId) !== Number(userId)) {
      console.warn(`[AUTH IDOR BLOCKED] saveCodingSessionState user mismatch: requester=${userId}, owner=${existing.userId}`);
      return null;
    }

    // Version Ordering Protection (Phase 4): Ignore stale out-of-order updates
    const incomingVersion = Number(codingState?.version || 0);
    const existingVersion = Number(existing?.version || 0);
    if (existing && incomingVersion > 0 && incomingVersion < existingVersion) {
      console.log(`[AUTOSAVE STALE IGNORED] key=${key} incomingVersion=${incomingVersion} < existingVersion=${existingVersion}`);
      return existing;
    }

    const sessionData = {
      ...codingState,
      userId: userId || existing?.userId || null,
      version: Math.max(incomingVersion, existingVersion),
      updatedAt: new Date().toISOString()
    };

    this.codingSessionCache.set(key, sessionData);

    try {
      if (!isNaN(Number(sessionId))) {
        const checkRes = await dbPool.query('SELECT user_id FROM interviews WHERE id = $1', [sessionId]);
        if (checkRes.rows.length > 0) {
          const rowUserId = checkRes.rows[0].user_id;
          if (rowUserId && userId && Number(rowUserId) !== Number(userId)) {
            console.warn(`[AUTH IDOR BLOCKED] Postgres save user mismatch: requester=${userId}, owner=${rowUserId}`);
            return null;
          }
          const res = await dbPool.query(
            'UPDATE interviews SET questions = $1 WHERE id = $2 RETURNING *',
            [JSON.stringify(sessionData), sessionId]
          );
          return res.rows[0] ? sessionData : null;
        }
      }
      return sessionData;
    } catch (err) {
      console.warn('Postgres query fallback (saveCodingSessionState):', err.message);
      return sessionData;
    }
  }

  static async getCodingSessionState(sessionId, userId = null) {
    const key = String(sessionId);
    const cached = this.codingSessionCache.get(key);
    if (cached) {
      if (cached.userId && userId && Number(cached.userId) !== Number(userId)) {
        console.warn(`[AUTH IDOR BLOCKED] getCodingSessionState cached mismatch: requester=${userId}, owner=${cached.userId}`);
        return null;
      }
      return cached;
    }

    try {
      if (!isNaN(Number(sessionId))) {
        const res = await dbPool.query('SELECT user_id, questions FROM interviews WHERE id = $1', [sessionId]);
        if (res.rows[0]) {
          const rowUserId = res.rows[0].user_id;
          if (rowUserId && userId && Number(rowUserId) !== Number(userId)) {
            console.warn(`[AUTH IDOR BLOCKED] Postgres restore user mismatch: requester=${userId}, owner=${rowUserId}`);
            return null;
          }
          if (res.rows[0].questions) {
            const parsed = typeof res.rows[0].questions === 'string' ? JSON.parse(res.rows[0].questions) : res.rows[0].questions;
            this.codingSessionCache.set(key, parsed);
            return parsed;
          }
        }
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
