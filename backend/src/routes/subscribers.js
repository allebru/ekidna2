const express = require('express');
const router = express.Router();
const SubscriberController = require('../controllers/subscriberController');
const { authenticateToken } = require('../middleware/auth');
const {
  validateSubscriber,
  validateUUID,
  validateQueryParams
} = require('../middleware/validation');

// Anti-abuso: limita gli invii pubblici del form (max 8/ora per IP).
// Difensivo: se 'express-rate-limit' non e' installato sul server, NON
// far crashare l'app (degrada a no-op), cosi' il sito resta su.
let createLimiter = (req, res, next) => next();
try {
  const rateLimit = require('express-rate-limit');
  createLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 8,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Troppe richieste di tesseramento da questo indirizzo. Riprova tra un\'ora.' },
  });
} catch (err) {
  console.warn('⚠ express-rate-limit non disponibile: rate-limit disattivato.', err.message);
}

// Honeypot anti-bot: il campo "website" e' nascosto nel form; se valorizzato e' un bot.
// Rispondiamo con un finto successo per non segnalare il blocco.
const honeypot = (req, res, next) => {
  if (req.body && typeof req.body.website === 'string' && req.body.website.trim() !== '') {
    return res.status(200).json({ success: true, message: 'Subscription created successfully' });
  }
  next();
};

// Public route - create subscriber from website form
// POST /api/subscribers
router.post('/', createLimiter, honeypot, validateSubscriber, SubscriberController.create);

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
