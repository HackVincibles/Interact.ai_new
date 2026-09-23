// Upstash Redis & Supabase Database Leaderboard Service
import { dbPool } from '../config/database.js';
import { redis } from '../config/redis.js';

export class LeaderboardService {
  static async getLeaderboard(type = 'college') {
    let redisData = null;
    try {
      redisData = await redis.get(`leaderboard:${type}`);
    } catch (e) {
      console.warn('Upstash Redis fallback:', e.message);
    }

    if (redisData) {
      return { source: 'redis-cache', leaderboard: redisData };
    }

    // Real database query for registered users
    try {
      const res = await dbPool.query(
        `SELECT id, full_name as name, email, college_name as college, branch, COALESCE(points, 0) as points, cgpa
         FROM users 
         ORDER BY COALESCE(points, 0) DESC, created_at ASC 
         LIMIT 100`
      );

      const dbUsers = res.rows.map((row, index) => ({
        rank: index + 1,
        id: row.id,
        name: row.name || row.email?.split('@')[0] || 'Registered Student',
        email: row.email,
        points: Number(row.points).toLocaleString('en-US'),
        college: row.college || 'Unspecified Campus',
        branch: row.branch || 'General Engineering',
        cgpa: row.cgpa || 'N/A',
      }));

      return {
        source: 'database',
        leaderboard: dbUsers,
        totalUsers: dbUsers.length,
      };
    } catch (err) {
      console.warn('Postgres query leaderboard error:', err.message);
      return {
        source: 'database',
        leaderboard: [],
        totalUsers: 0,
      };
    }
  }
}

