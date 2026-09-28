import { dbPool } from '../config/database.js';
import { EmailService } from '../services/emailService.js';

const formatDate = (dateString, timezone) => {
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: timezone });
};

const formatTime = (dateString, timezone) => {
  const d = new Date(dateString);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: timezone });
};

export const createSchedule = async (req, res, next) => {
  try {
    const { type, referenceId, scheduledAt, duration, timezone, reminderPreferences } = req.body;
    const userId = req.user?.id; // Assuming authenticateToken middleware populates req.user

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!scheduledAt || new Date(scheduledAt) < new Date()) {
      return res.status(400).json({ error: 'Valid future date and time are required.' });
    }

    const query = `
      INSERT INTO schedules (user_id, type, reference_id, scheduled_at, duration, timezone, reminder_preferences)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [userId, type, referenceId, scheduledAt, duration, timezone, reminderPreferences];
    
    const result = await dbPool.query(query, values);
    const schedule = result.rows[0];

    // Fetch user details for email
    const userRes = await dbPool.query('SELECT full_name, email FROM users WHERE id = $1', [userId]);
    const user = userRes.rows[0];

    if (user && user.email) {
      const scheduleDetails = {
        type: schedule.type,
        date: formatDate(schedule.scheduled_at, schedule.timezone),
        time: formatTime(schedule.scheduled_at, schedule.timezone),
        duration: schedule.duration,
        timezone: schedule.timezone
      };
      await EmailService.sendScheduleConfirmationEmail(user.email, user.full_name || 'Candidate', scheduleDetails);
    }

    res.status(201).json({ success: true, schedule });
  } catch (error) {
    next(error);
  }
};

export const getUserSchedules = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const query = `
      SELECT * FROM schedules 
      WHERE user_id = $1 AND status != 'CANCELLED'
      ORDER BY scheduled_at ASC;
    `;
    const result = await dbPool.query(query, [userId]);
    
    res.json({ success: true, schedules: result.rows });
  } catch (error) {
    next(error);
  }
};

export const reschedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { scheduledAt, timezone, reminderPreferences } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    if (!scheduledAt || new Date(scheduledAt) < new Date()) {
      return res.status(400).json({ error: 'Valid future date and time are required.' });
    }

    // Verify ownership
    const checkRes = await dbPool.query('SELECT id FROM schedules WHERE id = $1 AND user_id = $2', [id, userId]);
    if (checkRes.rows.length === 0) return res.status(404).json({ error: 'Schedule not found or unauthorized' });

    const query = `
      UPDATE schedules 
      SET scheduled_at = $1, timezone = $2, reminder_preferences = $3, reminders_sent = '[]'::jsonb, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4 AND user_id = $5
      RETURNING *;
    `;
    const values = [scheduledAt, timezone, reminderPreferences, id, userId];
    
    const result = await dbPool.query(query, values);
    const schedule = result.rows[0];

    // Fetch user details for email
    const userRes = await dbPool.query('SELECT full_name, email FROM users WHERE id = $1', [userId]);
    const user = userRes.rows[0];

    if (user && user.email) {
      const scheduleDetails = {
        type: schedule.type,
        date: formatDate(schedule.scheduled_at, schedule.timezone),
        time: formatTime(schedule.scheduled_at, schedule.timezone),
        duration: schedule.duration,
        timezone: schedule.timezone
      };
      await EmailService.sendScheduleConfirmationEmail(user.email, user.full_name || 'Candidate', scheduleDetails);
    }

    res.json({ success: true, schedule });
  } catch (error) {
    next(error);
  }
};

export const cancelSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const query = `
      UPDATE schedules 
      SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;
    
    const result = await dbPool.query(query, [id, userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Schedule not found or unauthorized' });

    res.json({ success: true, schedule: result.rows[0] });
  } catch (error) {
    next(error);
  }
};
