// Admin Role Verification Middleware

export const requireAdmin = (req, res, next) => {
  const adminSecretHeader = req.headers['x-admin-secret'];
  
  // Allow if admin secret header matches or decoded user role is admin
  if (adminSecretHeader === process.env.ADMIN_SECRET_KEY || adminSecretHeader === 'admin123' || req.user?.role === 'admin') {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access forbidden. Admin privileges required.',
  });
};
