// Auth & Student Profile Controller
import { AuthService } from '../services/authService.js';

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
