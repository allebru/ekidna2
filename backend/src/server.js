require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const pool = require('./config/database');
const emailService = require('./services/emailService');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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

// API routes
app.use('/api', routes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Database connection test
async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    console.log('✓ Database connected successfully');

    // Test query
    const result = await client.query('SELECT NOW()');
    console.log('✓ Database query test successful:', result.rows[0].now);

    client.release();
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

  pool.end(() => {
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
