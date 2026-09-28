// SendGrid Email Service
import { sendgridService, senderEmail } from '../config/sendgrid.js';

export class EmailService {
  static async sendOtpEmail(email, otpCode) {
    const otp = otpCode || Math.floor(100000 + Math.random() * 900000).toString();
    const targetEmail = email || 'ayushdaharwal@example.com';

    const msg = {
      to: targetEmail,
      from: senderEmail,
      subject: 'Interact.ai - Your Verification OTP Code',
      text: `Your verification OTP for Interact.ai is ${otp}. Valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #635bff;">Interact.ai Verification</h2>
          <p>Your OTP code is:</p>
          <h1 style="font-size: 32px; letter-spacing: 4px; color: #0f172a;">${otp}</h1>
          <p style="color: #64748b;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
        </div>
      `,
    };

    try {
      await sendgridService.send(msg);
    } catch (e) {
      console.warn('SendGrid API send notice:', e.message);
    }

    return {
      email: targetEmail,
      otpSent: true,
      message: 'SendGrid OTP email dispatched successfully',
    };
  }

  static async sendScheduleConfirmationEmail(email, candidateName, scheduleDetails) {
    const targetEmail = email || 'ayushdaharwal@example.com';
    const msg = {
      to: targetEmail,
      from: senderEmail,
      subject: 'Interact.ai - Your Interview is Scheduled',
      text: `Hi ${candidateName}, Your ${scheduleDetails.type} has been successfully scheduled for ${scheduleDetails.date} at ${scheduleDetails.time} (${scheduleDetails.timezone}). Duration: ${scheduleDetails.duration} mins.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #635bff;">Your InteractAI Interview is Scheduled</h2>
          <p>Hi ${candidateName},</p>
          <p>Your interview has been successfully scheduled.</p>
          <ul style="list-style-type: none; padding: 0;">
            <li><strong>Interview:</strong> ${scheduleDetails.type}</li>
            <li><strong>Date:</strong> ${scheduleDetails.date}</li>
            <li><strong>Time:</strong> ${scheduleDetails.time}</li>
            <li><strong>Duration:</strong> ${scheduleDetails.duration} minutes</li>
            <li><strong>Timezone:</strong> ${scheduleDetails.timezone}</li>
          </ul>
          <p>We'll remind you before your scheduled interview.</p>
          <p>Regards,<br>InteractAI Team</p>
        </div>
      `,
    };

    try {
      await sendgridService.send(msg);
      return { success: true };
    } catch (e) {
      console.warn('SendGrid API send confirmation notice:', e.message);
      return { success: false, error: e.message };
    }
  }

  static async sendScheduleReminderEmail(email, candidateName, scheduleDetails) {
    const targetEmail = email || 'ayushdaharwal@example.com';
    const msg = {
      to: targetEmail,
      from: senderEmail,
      subject: 'Interact.ai Reminder - Your Upcoming Interview',
      text: `Hi ${candidateName}, This is a reminder for your upcoming ${scheduleDetails.type} scheduled for ${scheduleDetails.date} at ${scheduleDetails.time} (${scheduleDetails.timezone}).`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #635bff;">Reminder: Upcoming Interview</h2>
          <p>Hi ${candidateName},</p>
          <p>This is a reminder that you have an upcoming interview.</p>
          <ul style="list-style-type: none; padding: 0;">
            <li><strong>Interview:</strong> ${scheduleDetails.type}</li>
            <li><strong>Date:</strong> ${scheduleDetails.date}</li>
            <li><strong>Time:</strong> ${scheduleDetails.time}</li>
            <li><strong>Duration:</strong> ${scheduleDetails.duration} minutes</li>
            <li><strong>Timezone:</strong> ${scheduleDetails.timezone}</li>
          </ul>
          <p>Please log in to InteractAI on time to join your session.</p>
          <p>Regards,<br>InteractAI Team</p>
        </div>
      `,
    };

    try {
      await sendgridService.send(msg);
      return { success: true };
    } catch (e) {
      console.warn('SendGrid API send reminder notice:', e.message);
      return { success: false, error: e.message };
    }
  }
}
