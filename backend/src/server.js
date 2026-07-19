// Load .env file only in development (Docker provides env vars in production)
if (process.env.NODE_ENV !== 'production' || !process.env.DB_HOST) {
  require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const pool = require('./config/database');
const emailService = require('./services/emailService');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Dietro il reverse-proxy di Hostinger: fidati del primo proxy per ottenere
// l'IP reale del client (necessario al rate-limit per non contare tutti insieme).
app.set('trust proxy', 1);

// Security middleware
// CSP su misura: i frontend serviti da Express usano asset same-origin,
// Google Fonts (Space Grotesk) e stili inline (Tailwind/React).
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
    },
  },
}));

// CORS configuration — i frontend sono serviti dallo stesso backend (same-origin),
// quindi la CORS serve solo a eventuali client cross-origin. Per le origini non in
// allowlist NON si blocca la richiesta (si omettono solo gli header CORS): così il
// sito si carica anche dal dominio temporaneo Hostinger e l'health check non fallisce.
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // same-origin / curl
    const isLocalhost = /^https?:\/\/localhost(:\d+)?$/.test(origin);
    const allowed = [process.env.FRONTEND_URL, process.env.BACKEND_URL].filter(Boolean);
    if (isLocalhost || allowed.includes(origin)) return callback(null, true);
    return callback(null, false); // origine non consentita: niente header CORS, ma non errore
  },
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Request logging (simple)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve uploaded files as static
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// API routes
app.use('/api', routes);

// ---- Static frontends (produzione): un solo dominio per sito + MVP ----
const websiteDir = path.join(__dirname, '../public/site');
const mvpDir = path.join(__dirname, '../public/admin');

// App gestionale (MVP) sotto /admin
app.use('/admin', express.static(mvpDir));
app.get('/admin/*', (req, res) => res.sendFile(path.join(mvpDir, 'index.html')));

// Sito pubblico alla root
app.use(express.static(websiteDir));

// SPA fallback del sito pubblico: tutto ciò che NON è /api o /uploads → index.html
app.get(/^(?!\/(?:api|uploads)\/).*/, (req, res) => {
  res.sendFile(path.join(websiteDir, 'index.html'));
});

// 404 handler (raggiunto solo da /api/* e /uploads/* non trovati)
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Database connection test
async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT NOW() AS now');
    console.log('✓ Database connected successfully');
    console.log('✓ Database query test successful:', rows[0].now);
    connection.release();
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    return false;
  }
}

// Initialize email service
async function initializeEmailService() {
  const initialized = await emailService.initialize();
  if (initialized) {
    console.log('✓ Email service initialized successfully');
  } else {
    console.warn('⚠ Email service initialization failed - emails will be disabled');
  }
}

// Graceful shutdown
function gracefulShutdown() {
  console.log('\nShutting down gracefully...');

  pool.end().then(() => {
    console.log('✓ Database pool closed');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('✗ Forcing shutdown');
    process.exit(1);
  }, 10000);
}

// Shutdown handlers
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
async function startServer() {
  try {
    console.log('🚀 Starting Ekidna Backend Server...\n');

    // Test database
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      console.error('✗ Cannot start server without database connection');
      process.exit(1);
    }

    // Migrazione automatica (opzionale): se AUTO_MIGRATE=true crea tabelle,
    // utente admin e contenuti di default all'avvio. Operazione idempotente.
    if (process.env.AUTO_MIGRATE === 'true') {
      try {
        console.log('⏳ AUTO_MIGRATE attivo: eseguo le migrazioni...');
        await require('../migrations/run')();
        console.log('✓ Migrazioni completate\n');
      } catch (err) {
        console.error('✗ Migrazioni fallite (l\'app parte comunque):', err.message);
      }
    }

    // Initialize email service (non-blocking)
    await initializeEmailService();

    // Start listening
    app.listen(PORT, () => {
      console.log(`\n✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ API URL: http://localhost:${PORT}/api`);
      console.log(`✓ Health check: http://localhost:${PORT}/api/health\n`);
      console.log('Server is ready to accept requests! 🎉\n');
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;
