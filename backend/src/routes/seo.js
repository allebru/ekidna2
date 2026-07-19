const express = require('express');
const router = express.Router();
const seoController = require('../controllers/seoController');
const { authenticateToken } = require('../middleware/auth');

// Public — SSR e website leggono qui
router.get('/', seoController.getAll);

// Auth-only — staff aggiorna i meta di una pagina
router.put('/:page', authenticateToken, seoController.updatePage);

module.exports = router;
