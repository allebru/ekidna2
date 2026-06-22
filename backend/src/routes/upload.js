const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const ALLOWED_TYPES = /jpeg|jpg|png|gif|webp/;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const mimeOk = ALLOWED_TYPES.test(file.mimetype);
    const extOk  = ALLOWED_TYPES.test(path.extname(file.originalname).toLowerCase().slice(1));
    if (mimeOk && extOk) return cb(null, true);
    cb(new Error('Formato non supportato. Usa JPG, PNG, GIF o WebP.'));
  },
});

// POST /api/upload — single image, auth required
router.post('/', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nessun file ricevuto' });

  const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
  const url = `${baseUrl}/uploads/${req.file.filename}`;
  res.json({ success: true, url, filename: req.file.filename });
});

// DELETE /api/upload/:filename — auth required
router.delete('/:filename', authenticateToken, (req, res) => {
  const filename = path.basename(req.params.filename); // prevent path traversal
  const filepath = path.join(UPLOADS_DIR, filename);
  if (!fs.existsSync(filepath)) return res.status(404).json({ error: 'File non trovato' });
  fs.unlinkSync(filepath);
  res.json({ success: true });
});

module.exports = router;
