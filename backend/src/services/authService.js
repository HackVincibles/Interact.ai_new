// Auth Business Service
import { UserModel } from '../models/userModel.js';
import { dbPool } from '../config/database.js';
import { redis } from '../config/redis.js';
import crypto from 'crypto';

function verifyPassword(password, hashStr) {
  if (!hashStr || !hashStr.includes(':')) return false;
  const [salt, key] = hashStr.split(':');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return key === derivedKey;
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
}

export class AuthService {
  static async forgotPassword(email) {
    if (!email) throw new Error('Email is required');
    const user = await UserModel.findByEmail(email);
    if (!user) throw new Error('User not found');
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(`reset_otp:${email}`, otp, { ex: 600 }); // 10 minutes
    
    return otp;
  }

  static async verifyOtp(email, otp) {
    if (!email || !otp) throw new Error('Email and OTP are required');
    const savedOtp = await redis.get(`reset_otp:${email}`);
    if (!savedOtp || savedOtp !== otp) {
      throw new Error('Invalid or expired OTP');
    }
    
    const token = crypto.randomBytes(32).toString('hex');
    await redis.set(`reset_token:${email}`, token, { ex: 900 }); // 15 mins
    return token;
  }

  static async resetPassword(email, token, newPassword) {
    if (!email || !token || !newPassword) throw new Error('Missing parameters');
    const savedToken = await redis.get(`reset_token:${email}`);
    if (!savedToken || savedToken !== token) {
      throw new Error('Invalid or expired reset session');
    }
    
    const hashStr = hashPassword(newPassword);
    await dbPool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hashStr, email]);
    
    await redis.del(`reset_otp:${email}`);
    await redis.del(`reset_token:${email}`);
    
    return true;
  }
  static async registerUser(data) {
    if (!data.email) {
      throw new Error('Email address is required for user registration');
    }
    const user = await UserModel.createOrUpdate(data);
    return {
      user,
      token: `fake-jwt-token-${Date.now()}`,
      message: 'Student profile registered successfully',
    };
  }

  static async loginUser(email, password) {
    if (!email) {
      throw new Error('Email address is required');
    }
    let user = await UserModel.findByEmail(email);
    if (!user) {
      user = await UserModel.createOrUpdate({
        fullName: email.split('@')[0],
        email: email,
        collegeName: '',
        branch: '',
      });
    }

    return {
      user: {
        id: user.id || Date.now(),
        fullName: user.full_name || email.split('@')[0],
        email: user.email,
        collegeName: user.college_name || '',
        branch: user.branch || '',
        cgpa: user.cgpa || '',
      },
      token: `auth-token-${Date.now()}`,
      message: 'Login successful',
    };
  }

  static async adminLogin(usernameOrEmail, password, adminKey) {
    // Check Database
    const res = await dbPool.query(
      'SELECT * FROM admins WHERE username = $1 OR email = $1',
      [usernameOrEmail]
    );
    const adminRec = res.rows[0];

    if (!adminRec) {
      throw new Error('Invalid admin credentials');
    }

    const isValid = verifyPassword(password, adminRec.password_hash);
    if (!isValid) {
      throw new Error('Invalid admin credentials');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const adminUser = {
      id: adminRec.id,
      username: adminRec.username,
      email: adminRec.email,
      role: adminRec.role,
    };
    
    // Store session in Redis, expires in 24h
    await redis.set(`admin_session:${token}`, JSON.stringify(adminUser), { ex: 86400 });

    return {
      admin: adminUser,
      token,
      message: 'Admin authorization successful',
    };
  }

  static async verifyAdminToken(token) {
    const data = await redis.get(`admin_session:${token}`);
    if (data) {
      return typeof data === 'string' ? JSON.parse(data) : data;
    }
    return null;
  }

  static async getUserProfile(email) {
    if (!email) return null;
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      return {
        fullName: existing.full_name || email.split('@')[0],
        email: existing.email,
        collegeName: existing.college_name || '',
        branch: existing.branch || '',
        collegeRank: existing.college_rank || 'Unranked',
        globalRank: existing.global_rank || 'Unranked',
        cgpa: existing.cgpa || '',
      };
    }
    return null;
  }
}
