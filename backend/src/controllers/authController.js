// Auth & Student Profile Controller
import { AuthService } from '../services/authService.js';
import { EmailService } from '../services/emailService.js';

export const registerUser = async (req, res, next) => {
  try {
    const result = await AuthService.registerUser(req.body);
    res.json({
      success: true,
      user: result.user,
      token: result.token,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.loginUser(email, password);
    res.json({
      success: true,
      user: result.user,
      token: result.token,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { username, password, adminKey } = req.body;
    const result = await AuthService.adminLogin(username, password, adminKey);
    res.json({
      success: true,
      admin: result.admin,
      token: result.token,
      message: result.message,
    });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const email = req.params.email || req.query.email;
    const profile = await AuthService.getUserProfile(email);
    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const otp = await AuthService.forgotPassword(email);
    await EmailService.sendOtpEmail(email, otp);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const token = await AuthService.verifyOtp(email, otp);
    res.json({ success: true, token, message: 'OTP verified' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body;
    await AuthService.resetPassword(email, token, newPassword);
    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
