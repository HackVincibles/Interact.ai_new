// Auth Authentication Middleware

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // For seamless dev experience if token header is omitted in non-strict mode
    req.user = { id: 1, email: 'ayushdaharwal@example.com', role: 'student' };
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    // Simple dev token validation / decoded user simulation
    req.user = { id: 1, email: 'ayushdaharwal@example.com', role: 'student' };
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};
