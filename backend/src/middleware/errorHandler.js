// Centralized Express Error Handling Middleware

const HTTP_MESSAGES = {
  400: 'Bad Request',
  401: 'Unauthorized — authentication required',
  403: 'Forbidden — you do not have permission',
  404: 'Resource not found',
  409: 'Conflict — resource already exists',
  422: 'Unprocessable Entity — validation failed',
  429: 'Too Many Requests — please slow down',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || HTTP_MESSAGES[statusCode] || 'An unexpected error occurred';

  // Only log 5xx errors as real errors; 4xx are expected client mistakes
  if (statusCode >= 500) {
    console.error(`[ERROR] ${statusCode} ${req.method} ${req.originalUrl}:`, err.message);
    if (process.env.NODE_ENV !== 'production') console.error(err.stack);
  } else {
    console.warn(`[WARN] ${statusCode} ${req.method} ${req.originalUrl}: ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    code: statusCode,
    path: req.originalUrl,
    ...(process.env.NODE_ENV === 'development' && statusCode >= 500 ? { stack: err.stack } : {}),
  });
};

// 404 handler for unmatched API routes
export const notFoundHandler = (req, res) => {
  console.warn(`[404] ${req.method} ${req.originalUrl} — no matching route`);
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
    code: 404,
    hint: 'Check the API documentation for valid endpoints.',
  });
};
