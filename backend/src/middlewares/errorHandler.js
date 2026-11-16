const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_ERROR';

  if (statusCode >= 500) {
    logger.error({ err, url: req.originalUrl }, 'Unhandled server error');
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code
    }
  });
}

module.exports = errorHandler;
