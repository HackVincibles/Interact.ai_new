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

export const startReminderWorker = () => {
  console.log("🚀 Reminder Worker started...");
  
  // Run every 1 minute
  setInterval(async () => {
    try {
      // Find UPCOMING schedules that are in the future
      const query = `
        SELECT s.*, u.full_name, u.email 
        FROM schedules s
        JOIN users u ON s.user_id = u.id
        WHERE s.status = 'UPCOMING' 
          AND s.scheduled_at > NOW();
      `;
      const { rows: schedules } = await dbPool.query(query);

      for (const schedule of schedules) {
        if (!schedule.reminder_preferences) continue;
        
        let remindersSent = schedule.reminders_sent || [];
        const nowMs = Date.now();
        const scheduledMs = new Date(schedule.scheduled_at).getTime();
        const diffHours = (scheduledMs - nowMs) / (1000 * 60 * 60);

        let shouldSend24h = schedule.reminder_preferences['24h'] && diffHours <= 24 && diffHours > 1 && !remindersSent.includes('24h');
        let shouldSend1h = schedule.reminder_preferences['1h'] && diffHours <= 1 && diffHours > 0.25 && !remindersSent.includes('1h');
        let shouldSend15m = schedule.reminder_preferences['15m'] && diffHours <= 0.25 && diffHours > 0 && !remindersSent.includes('15m');

        const reminderKey = shouldSend15m ? '15m' : (shouldSend1h ? '1h' : (shouldSend24h ? '24h' : null));

        if (reminderKey) {
          const scheduleDetails = {
            type: schedule.type,
            date: formatDate(schedule.scheduled_at, schedule.timezone),
            time: formatTime(schedule.scheduled_at, schedule.timezone),
            duration: schedule.duration,
            timezone: schedule.timezone
          };
          
          const result = await EmailService.sendScheduleReminderEmail(schedule.email, schedule.full_name || 'Candidate', scheduleDetails);
          
          if (result.success) {
            // Update reminders_sent array
            remindersSent.push(reminderKey);
            // Also push larger timeframes if they were skipped, to prevent them from firing later if somehow diffHours bounces (it shouldn't, but just in case)
            if (reminderKey === '15m') {
              if (!remindersSent.includes('1h')) remindersSent.push('1h');
              if (!remindersSent.includes('24h')) remindersSent.push('24h');
            } else if (reminderKey === '1h') {
              if (!remindersSent.includes('24h')) remindersSent.push('24h');
            }

            await dbPool.query(
              `UPDATE schedules SET reminders_sent = $1::jsonb WHERE id = $2`, 
              [JSON.stringify(remindersSent), schedule.id]
            );
          }
        }
      }
    } catch (err) {
      console.warn("Reminder Worker Notice:", err.message || err);
    }
  }, 60 * 1000); // 1 minute
};
