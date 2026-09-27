import { dbPool } from '../config/database.js';

export const getDashboardMetrics = async (req, res, next) => {
  try {
    const studentsResult = await dbPool.query("SELECT COUNT(*) FROM users WHERE role != 'admin' AND role != 'superadmin'");
    const interviewsResult = await dbPool.query('SELECT COUNT(*) FROM interviews');
    const coursesResult = await dbPool.query('SELECT COUNT(*) FROM courses WHERE is_published = true');
    const jobsResult = await dbPool.query('SELECT COUNT(*) FROM jobs');
    
    const scoreResult = await dbPool.query('SELECT AVG(score) as avg_score FROM interviews WHERE score IS NOT NULL');
    
    res.json({
      success: true,
      metrics: {
        totalStudents: parseInt(studentsResult.rows[0].count),
        interviewsCompleted: parseInt(interviewsResult.rows[0].count),
        activeCourses: parseInt(coursesResult.rows[0].count),
        activeJobs: parseInt(jobsResult.rows[0].count),
        averageScore: Math.round(parseFloat(scoreResult.rows[0].avg_score) || 0)
      }
    });
  } catch (err) {
    next(err);
  }
};
