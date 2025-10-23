const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const subscriberRoutes = require('./subscribers');

// API Routes
router.use('/auth', authRoutes);
router.use('/subscribers', subscriberRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info
router.get('/', (req, res) => {
  res.json({
    name: 'Ekidna API',
    version: '1.0.0',
    description: 'Backend API for Ekidna APS subscription management',
    endpoints: {
      health: '/api/health',
      auth: {
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        changePassword: 'POST /api/auth/change-password'
      },
      subscribers: {
        create: 'POST /api/subscribers',
        getAll: 'GET /api/subscribers',
        getById: 'GET /api/subscribers/:id',
        update: 'PUT /api/subscribers/:id',
        delete: 'DELETE /api/subscribers/:id',
        restore: 'POST /api/subscribers/:id/restore',
        stats: 'GET /api/subscribers/stats',
        byYear: 'GET /api/subscribers/year/:year'
      }
    }
  });
});

module.exports = router;
