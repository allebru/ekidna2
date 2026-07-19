const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { authenticateToken } = require('../middleware/auth');

// Public — website fetches this
router.get('/', contentController.getAll);

// Auth-only — dashboard reads field metadata
router.get('/meta', authenticateToken, contentController.getMeta);

// Auth-only — staff updates a page
router.put('/:page', authenticateToken, contentController.updatePage);

module.exports = router;
