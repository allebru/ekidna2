const express = require('express');
const router = express.Router();
const SubscriberController = require('../controllers/subscriberController');
const { authenticateToken } = require('../middleware/auth');
const {
  validateSubscriber,
  validateUUID,
  validateQueryParams
} = require('../middleware/validation');

// Public route - create subscriber from website form
// POST /api/subscribers
router.post('/', validateSubscriber, SubscriberController.create);

// Protected routes (require authentication)
// GET /api/subscribers - get all subscribers with pagination
router.get('/', authenticateToken, validateQueryParams, SubscriberController.getAll);

// GET /api/subscribers/stats - get statistics
router.get('/stats', authenticateToken, SubscriberController.getStats);

// GET /api/subscribers/year/:year - get subscribers by year
router.get('/year/:year', authenticateToken, SubscriberController.getByYear);

// GET /api/subscribers/:id - get subscriber by ID
router.get('/:id', authenticateToken, validateUUID, SubscriberController.getById);

// PUT /api/subscribers/:id - update subscriber
router.put('/:id', authenticateToken, validateUUID, validateSubscriber, SubscriberController.update);

// DELETE /api/subscribers/:id - soft delete subscriber
router.delete('/:id', authenticateToken, validateUUID, SubscriberController.softDelete);

// POST /api/subscribers/:id/restore - restore deleted subscriber
router.post('/:id/restore', authenticateToken, validateUUID, SubscriberController.restore);

module.exports = router;
