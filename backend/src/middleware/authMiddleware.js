// Auth Authentication Middleware

import { supabase } from '../config/supabase.js';
import { dbPool } from '../config/database.js';

export const requireAuth = async (req, res, next) => {
  console.log(`[AUTH] ${req.method} ${req.originalUrl} request received`);
  const authHeader = req.headers.authorization;
  
  console.log(`[AUTH] Authorization header present: ${!!authHeader}`);
  
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  console.log(`[AUTH] Bearer token present: ${!!token}`);
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    console.log(`[AUTH] Supabase user verified: ${!!user && !error}`);
    
    if (error || !user) {
      console.log(`[AUTH] error details:`, error?.message);
      return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
    }

    // Ensure the application user row exists for this authenticated user
    const email = user.email;
    const fullName = user.user_metadata?.full_name || email.split('@')[0];

    // Check if user exists in the local 'users' table
    let userResult = await dbPool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      // Create user if not exists (sync from Supabase Auth)
      userResult = await dbPool.query(
        'INSERT INTO users (full_name, email, role) VALUES ($1, $2, $3) RETURNING *',
        [fullName, email, 'student']
      );
    }

    const appUser = userResult.rows[0];

    console.log(`[AUTH] authenticated user id: ${user.id}`);

    req.user = { 
      id: appUser.id, 
      email: appUser.email, 
      role: appUser.role,
      auth_id: user.id // The Supabase UUID
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during authentication.' });
  }
};
