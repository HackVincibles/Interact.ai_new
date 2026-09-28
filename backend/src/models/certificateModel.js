import { dbPool } from '../config/database.js';

export class CertificateModel {
  static async createCertificate(certData) {
    const { userId, certificateType, title, description, achievement, score, sourceSessionId, verificationId } = certData;
    
    // Using ON CONFLICT DO NOTHING relies on the UNIQUE constraint (user_id, source_session_id, certificate_type)
    // to prevent duplicates.
    try {
      const result = await dbPool.query(
        `INSERT INTO certificates (user_id, certificate_type, title, description, achievement, score, source_session_id, verification_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (user_id, source_session_id, certificate_type) DO NOTHING
         RETURNING *`,
        [userId, certificateType, title, description, achievement, score, sourceSessionId, verificationId]
      );
      
      // If it returned 0 rows, it means conflict was hit and it already exists. We can just fetch it.
      if (result.rows.length === 0) {
         const existing = await dbPool.query(
             `SELECT * FROM certificates WHERE user_id = $1 AND source_session_id = $2 AND certificate_type = $3`,
             [userId, sourceSessionId, certificateType]
         );
         return existing.rows[0];
      }
      
      return result.rows[0];
    } catch (err) {
      console.warn('Postgres query fallback (createCertificate):', err.message);
      throw err;
    }
  }

  static async getCertificatesByUserId(userId) {
    try {
      const res = await dbPool.query(
        'SELECT * FROM certificates WHERE user_id = $1 ORDER BY issued_at DESC',
        [userId]
      );
      return res.rows;
    } catch (err) {
      console.warn('Postgres query fallback (getCertificatesByUserId):', err.message);
      return [];
    }
  }

  static async getCertificateByVerificationId(verificationId) {
    try {
      // Need a JOIN with users to get recipient name publicly
      const res = await dbPool.query(
        `SELECT c.*, u.full_name as recipient_name 
         FROM certificates c
         JOIN users u ON c.user_id = u.id
         WHERE c.verification_id = $1`,
        [verificationId]
      );
      return res.rows[0];
    } catch (err) {
      console.warn('Postgres query fallback (getCertificateByVerificationId):', err.message);
      return null;
    }
  }
}
