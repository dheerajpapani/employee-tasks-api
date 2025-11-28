// src/utils/errors.js

class ApiError extends Error {
  constructor(statusCode = 500, message = 'Internal Server Error') {
    super(message);
    this.statusCode = statusCode;
  }
}

// Express error middleware
function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.error('[error]', message, err.stack ? err.stack : '');
  res.status(status).json({ error: { message, status } });
}

module.exports = {
  ApiError,
  errorHandler
};
