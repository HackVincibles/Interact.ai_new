// User Database Model
import { dbPool } from '../config/database.js';

export class UserModel {
  static async findByEmail(email) {
    try {
      const res = await dbPool.query('SELECT * FROM users WHERE email = $1', [email]);
      return res.rows[0] || null;
    } catch (err) {
      console.warn('Postgres query fallback (findByEmail):', err.message);
      return null;
    }
  }

  static async createOrUpdate(userData) {
    const { fullName, email, collegeName, branch, enrollmentNo, gradYear, role = 'student' } = userData;
    try {
      const result = await dbPool.query(
        `INSERT INTO users (full_name, email, college_name, branch, enrollment_no, grad_year, role) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         ON CONFLICT (email) DO UPDATE SET 
           full_name = EXCLUDED.full_name,
           college_name = COALESCE(EXCLUDED.college_name, users.college_name),
           branch = COALESCE(EXCLUDED.branch, users.branch),
           updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [fullName, email, collegeName, branch, enrollmentNo, gradYear, role]
      );
      return result.rows[0];
    } catch (err) {
      console.warn('Postgres query fallback (createOrUpdate):', err.message);
      return {
        id: Date.now(),
        full_name: fullName || email?.split('@')[0] || 'Registered Candidate',
        email: email,
        college_name: collegeName || '',
        branch: branch || '',
        role: role
      };
    }
  }

  static async findAdminByUsernameOrEmail(identifier) {
    try {
      const res = await dbPool.query(
        'SELECT * FROM admins WHERE username = $1 OR email = $1',
        [identifier]
      );
      return res.rows[0] || null;
    } catch (err) {
      console.warn('Postgres query fallback (findAdminByUsernameOrEmail):', err.message);
      return null;
    }
  }
}
