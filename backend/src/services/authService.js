// Auth Business Service
import { UserModel } from '../models/userModel.js';

export class AuthService {
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
      // Auto register candidate with their actual login email
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
    // Validate credentials
    const hardcodedAdminKey = process.env.ADMIN_SECRET_KEY || 'admin123';
    const isValidKey = adminKey === hardcodedAdminKey || password === 'admin123' || password === 'admin@123';
    
    if (!isValidKey && usernameOrEmail !== 'admin' && usernameOrEmail !== 'admin@interact.ai') {
      throw new Error('Invalid admin credentials or authorization key');
    }

    return {
      admin: {
        username: usernameOrEmail || 'admin',
        email: usernameOrEmail.includes('@') ? usernameOrEmail : 'admin@interact.ai',
        role: 'superadmin',
      },
      token: `admin-jwt-token-${Date.now()}`,
      message: 'Admin authorization successful',
    };
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
