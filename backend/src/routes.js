const express = require('express');
const router = express.Router();
const db = require('./config/db');

router.get('/health', async (req, res, next) => {
  try {
    await db.raw('SELECT 1');
    return res.status(200).json({
      success: true,
      data: {
        status: 'ok',
        db: 'connected'
      }
    });
  } catch (error) {
    return next({
      status: 503,
      message: 'Database connection failed: ' + error.message,
      code: 'DB_UNAVAILABLE'
    });
  }
});

module.exports = router;
