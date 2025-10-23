const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

// Test email sending (for debugging)
router.post('/send-email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email address is required',
        usage: 'POST /api/test/send-email with body: { "email": "test@example.com" }'
      });
    }

    // Check if email service is initialized
    if (!emailService.transporter) {
      return res.status(503).json({
        success: false,
        error: 'Email service not initialized',
        hint: 'Check backend logs for initialization errors'
      });
    }

    console.log('🧪 Test email requested for:', email);

    // Create a test subscriber object
    const testSubscriber = {
      id: 'test-' + Date.now(),
      name: 'Test User',
      email: email,
      phone: '+39 123 456 7890',
      address: 'Via Test 123, Milano, 20100 MI',
      subscription_year: new Date().getFullYear(),
      created_at: new Date()
    };

    // Try to send the email
    const result = await emailService.sendSubscriptionConfirmation(testSubscriber);

    if (result.success) {
      return res.json({
        success: true,
        message: 'Test email sent successfully!',
        messageId: result.messageId,
        sentTo: email,
        hint: 'Check your inbox (and spam folder)'
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.message,
        details: result.error,
        hint: 'Check backend logs for more details'
      });
    }
  } catch (error) {
    console.error('❌ Test email failed:', error);
    return res.status(500).json({
      success: false,
      error: 'Test email failed',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Email service status
router.get('/email-status', (req, res) => {
  const isInitialized = !!emailService.transporter;

  res.json({
    success: true,
    emailService: {
      initialized: isInitialized,
      status: isInitialized ? 'ready' : 'not configured',
      config: {
        host: process.env.EMAIL_HOST || 'not set',
        port: process.env.EMAIL_PORT || 'not set',
        user: process.env.EMAIL_USER || 'not set',
        from: process.env.EMAIL_FROM || 'not set',
        hasPassword: !!process.env.EMAIL_PASSWORD
      }
    },
    hint: isInitialized ? 'Email service is ready to send emails' : 'Email service needs to be configured'
  });
});

module.exports = router;
