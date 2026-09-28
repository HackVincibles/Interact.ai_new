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
        `SELECT id, full_name as name, email, college_name as college, branch, COALESCE(points, 0) as points, cgpa, avatar_id
         FROM users 
         ORDER BY COALESCE(points, 0) DESC, created_at ASC 
         LIMIT 100`
      );

      let dbUsers = res.rows.map((row, index) => ({
        id: row.id,
        name: row.name || row.email?.split('@')[0] || 'Registered Student',
        email: row.email,
        points: Number(row.points) || 0,
        college: row.college || 'Unspecified Campus',
        branch: row.branch || 'General Engineering',
        cgpa: row.cgpa || 'N/A',
        avatar: row.avatar_id || null,
        isDemo: false
      }));

      // Add demo data if leaderboard looks empty (less than 5 real users)
      if (dbUsers.length < 5) {
        const demoCandidates = [
          { id: 'demo-1', name: 'Aarav Sharma', email: 'aarav.demo@interact.ai', points: 87, college: 'IIT Bombay', branch: 'Computer Science', isDemo: true, avatar: null },
          { id: 'demo-2', name: 'Priya Nair', email: 'priya.demo@interact.ai', points: 84, college: 'NIT Trichy', branch: 'Information Technology', isDemo: true, avatar: null },
          { id: 'demo-3', name: 'Rohan Verma', email: 'rohan.demo@interact.ai', points: 81, college: 'BITS Pilani', branch: 'Software Engineering', isDemo: true, avatar: null },
          { id: 'demo-4', name: 'Ananya Iyer', email: 'ananya.demo@interact.ai', points: 79, college: 'VIT Vellore', branch: 'Computer Science', isDemo: true, avatar: null },
          { id: 'demo-5', name: 'Aditya Mehta', email: 'aditya.demo@interact.ai', points: 76, college: 'Delhi Tech', branch: 'Data Science', isDemo: true, avatar: null },
          { id: 'demo-6', name: 'Sneha Kulkarni', email: 'sneha.demo@interact.ai', points: 74, college: 'COEP', branch: 'Computer Engineering', isDemo: true, avatar: null },
          { id: 'demo-7', name: 'Arjun Patel', email: 'arjun.demo@interact.ai', points: 71, college: 'NIT Surathkal', branch: 'Information Systems', isDemo: true, avatar: null },
          { id: 'demo-8', name: 'Kavya Singh', email: 'kavya.demo@interact.ai', points: 68, college: 'IIIT Hyderabad', branch: 'Computer Science', isDemo: true, avatar: null }
        ];

        // Filter out demo candidates if their email somehow conflicts (unlikely but safe)
        const existingEmails = new Set(dbUsers.map(u => u.email));
        const filteredDemos = demoCandidates.filter(d => !existingEmails.has(d.email));
        
        dbUsers = [...dbUsers, ...filteredDemos];
      }

      // Re-sort in case demo users are mixed with real users, then assign rank
      dbUsers.sort((a, b) => b.points - a.points);
      
      const rankedUsers = dbUsers.map((user, index) => ({
        ...user,
        rank: index + 1,
        points: user.points.toLocaleString('en-US') // formatting
      }));

      return {
        source: 'database',
        leaderboard: rankedUsers,
        totalUsers: rankedUsers.length,
      };
    } catch (err) {
      console.warn('Postgres query leaderboard error:', err.message);
      
      // Fallback to purely demo data if DB completely fails
      const fallbackDemo = [
        { rank: 1, id: 'demo-1', name: 'Aarav Sharma', email: 'aarav.demo@interact.ai', points: '87', college: 'IIT Bombay', branch: 'Computer Science', isDemo: true, avatar: null },
        { rank: 2, id: 'demo-2', name: 'Priya Nair', email: 'priya.demo@interact.ai', points: '84', college: 'NIT Trichy', branch: 'Information Technology', isDemo: true, avatar: null },
        { rank: 3, id: 'demo-3', name: 'Rohan Verma', email: 'rohan.demo@interact.ai', points: '81', college: 'BITS Pilani', branch: 'Software Engineering', isDemo: true, avatar: null },
        { rank: 4, id: 'demo-4', name: 'Ananya Iyer', email: 'ananya.demo@interact.ai', points: '79', college: 'VIT Vellore', branch: 'Computer Science', isDemo: true, avatar: null },
        { rank: 5, id: 'demo-5', name: 'Aditya Mehta', email: 'aditya.demo@interact.ai', points: '76', college: 'Delhi Tech', branch: 'Data Science', isDemo: true, avatar: null },
        { rank: 6, id: 'demo-6', name: 'Sneha Kulkarni', email: 'sneha.demo@interact.ai', points: '74', college: 'COEP', branch: 'Computer Engineering', isDemo: true, avatar: null },
        { rank: 7, id: 'demo-7', name: 'Arjun Patel', email: 'arjun.demo@interact.ai', points: '71', college: 'NIT Surathkal', branch: 'Information Systems', isDemo: true, avatar: null },
        { rank: 8, id: 'demo-8', name: 'Kavya Singh', email: 'kavya.demo@interact.ai', points: '68', college: 'IIIT Hyderabad', branch: 'Computer Science', isDemo: true, avatar: null }
      ];

      return {
        source: 'database-fallback-demo',
        leaderboard: fallbackDemo,
        totalUsers: fallbackDemo.length,
      };
    }
  }
}

