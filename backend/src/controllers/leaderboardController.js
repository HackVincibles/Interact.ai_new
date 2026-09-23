// Upstash Redis Leaderboard Controller
import { LeaderboardService } from '../services/leaderboardService.js';

export const getLeaderboard = async (req, res, next) => {
  try {
    const type = req.query.type || 'college';
    const result = await LeaderboardService.getLeaderboard(type);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
