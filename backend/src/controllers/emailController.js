// SendGrid Email & OTP Controller
import { EmailService } from '../services/emailService.js';

export const sendOtpEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await EmailService.sendOtpEmail(email);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
