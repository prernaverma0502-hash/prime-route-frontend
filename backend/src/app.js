const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const pinoHttp = require('pino-http');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const logger = require('./utils/logger');
const apiRoutes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Security Headers
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);

// HTTP Parameter Pollution Protection
app.use(hpp());

// Body Parsers with 1MB payload limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Cookie Parser
app.use(cookieParser());

// Request Logging
app.use(
  pinoHttp({
    logger,
    autoLogging: env.NODE_ENV !== 'test'
  })
);

// Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many requests, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  }
});
app.use(globalLimiter);

// Mount API v1 Routes
app.use('/api/v1', apiRoutes);

// Catch-all 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Cannot ${req.method} ${req.originalUrl}`,
      code: 'NOT_FOUND'
    }
  });
});

// Central Error Handler Middleware
app.use(errorHandler);

module.exports = app;
