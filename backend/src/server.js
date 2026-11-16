const app = require('./app');
const env = require('./config/env');
const db = require('./config/db');
const logger = require('./utils/logger');

let currentPort = Number(env.PORT) || 5001;

async function checkDatabaseConnection() {
  try {
    await db.raw('SELECT 1');
    logger.info(
      `[DATABASE CONNECTED] Successfully connected to MySQL at ${env.DB_HOST}:${env.DB_PORT} (Database: ${env.DB_NAME})`
    );
  } catch (error) {
    logger.error(
      `[DATABASE ERROR] Failed to connect to MySQL at ${env.DB_HOST}:${env.DB_PORT}: ${error.message}`
    );
  }
}

function startServer(port) {
  const server = app.listen(port, async () => {
    logger.info(
      `PrimeRoute backend server listening on port ${port} in ${env.NODE_ENV} mode`
    );
    // Explicitly verify and log live database connection on startup
    await checkDatabaseConnection();
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.warn(`Port ${port} is currently in use. Automatically trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      logger.error({ err }, 'Fatal server error');
      process.exit(1);
    }
  });

  const handleShutdown = (signal) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));

  return server;
}

const server = startServer(currentPort);

module.exports = server;
