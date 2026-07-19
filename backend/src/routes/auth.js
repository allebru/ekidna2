const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { validateLogin } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', validateLogin, AuthController.login);

// GET /api/auth/me (requires authentication)
router.get('/me', authenticateToken, AuthController.getCurrentUser);

// POST /api/auth/change-password (requires authentication)
router.post('/change-password', authenticateToken, AuthController.changePassword);

module.exports = router;
