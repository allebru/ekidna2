const { createTransporter, emailTemplates } = require('../config/email');
const pool = require('../config/database');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  async initialize() {
    try {
      console.log('🔧 Initializing email service...');

      // Check if email configuration is present
      if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.warn('⚠️  Email configuration incomplete - skipping email service initialization');
        console.log('💡 To enable emails, set EMAIL_HOST, EMAIL_USER, and EMAIL_PASSWORD in .env');
        return false;
      }

      console.log('📧 Email configuration:', {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        from: process.env.EMAIL_FROM,
        hasPassword: !!process.env.EMAIL_PASSWORD,
        passwordLength: process.env.EMAIL_PASSWORD?.length || 0
      });

      this.transporter = createTransporter();

      // Verify connection
      console.log('🔍 Verifying SMTP connection...');
      await this.transporter.verify();
      console.log('✅ Email service initialized successfully');
      console.log('📮 Ready to send emails via:', process.env.EMAIL_HOST);
      return true;
    } catch (error) {
      console.error('❌ Email service initialization failed:', error.message);
      console.error('📋 Error code:', error.code || 'UNKNOWN');
      console.error('📋 Response code:', error.responseCode || 'N/A');
      console.error('📋 Response:', error.response || 'N/A');
      console.warn('⚠️  Email functionality will be disabled');
      console.log();

      // Provide specific troubleshooting advice
      if (error.code === 'EAUTH' || error.responseCode === 535) {
        console.log('🔧 AUTHENTICATION ERROR - Your credentials are incorrect!');
        console.log('   For Brevo SMTP:');
        console.log('   1. Go to: https://app.brevo.com/settings/keys/smtp');
        console.log('   2. Generate a NEW SMTP key');
        console.log('   3. Update EMAIL_PASSWORD in .env with the new key');
        console.log('   4. Run: node test-smtp.js (to test independently)');
        console.log('   5. Restart the server');
      } else if (error.code === 'ESOCKET' || error.code === 'ECONNECTION') {
        console.log('🔧 CONNECTION ERROR - Cannot reach SMTP server!');
        console.log('   Check: EMAIL_HOST and EMAIL_PORT in .env');
        console.log('   For Brevo: HOST=smtp-relay.brevo.com, PORT=587');
      } else if (error.code === 'ETIMEDOUT') {
        console.log('🔧 TIMEOUT ERROR - SMTP server not responding!');
        console.log('   Check your internet connection and firewall settings');
      }

      console.log();
      console.log('💡 The server will continue to run, but emails will not be sent.');
      console.log('💡 Run "node test-smtp.js" from the backend directory to diagnose issues.');
      console.log();

      return false;
    }
  }

  async sendSubscriptionConfirmation(subscriber) {
    console.log('📧 Attempting to send confirmation email to:', subscriber.email);

    if (!this.transporter) {
      console.error('❌ Email transporter not initialized. Skipping email.');
      return { success: false, message: 'Email service not configured' };
    }

    if (!subscriber.email) {
      console.warn('⚠️  Subscriber has no email address. Skipping email.');
      return { success: false, message: 'No email address provided' };
    }

    try {
      const template = emailTemplates.subscriptionConfirmation(subscriber);

      // Genera la tessera PDF e allegala (best-effort: se fallisce, manda comunque l'email)
      const attachments = [];
      try {
        if (subscriber.card_number) {
          const { generateTessera } = require('./pdfService');
          const pdfPath = await generateTessera({
            cardNumber: subscriber.card_number,
            name: subscriber.name,
            year: subscriber.subscription_year,
          });
          attachments.push({ filename: `Tessera_Ekidna_${subscriber.card_number}.pdf`, path: pdfPath });
          console.log('🪪 Tessera PDF generata:', pdfPath);
        }
      } catch (pdfErr) {
        console.warn('⚠️  Tessera PDF non generata (email inviata senza allegato):', pdfErr.message);
      }

      console.log('📤 Sending email via SMTP...');
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@ekidna.org',
        to: subscriber.email,
        subject: template.subject,
        text: template.text,
        html: template.html,
        attachments,
      });

      console.log('✅ Confirmation email sent successfully!');
      console.log('📬 Message ID:', info.messageId);
      console.log('👤 Sent to:', subscriber.email);

      // Segna l'email come inviata (MySQL: colonna email_sent)
      await pool.query('UPDATE subscribers SET email_sent = 1 WHERE id = ?', [subscriber.id]);

      console.log('✅ Database updated - email confirmed');

      return {
        success: true,
        messageId: info.messageId,
        message: 'Confirmation email sent successfully'
      };
    } catch (error) {
      console.error('❌ Failed to send confirmation email:', error.message);
      console.error('📋 Full error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send confirmation email'
      };
    }
  }

  async sendStaffNotification(subscriber) {
    if (!this.transporter) {
      console.warn('Email transporter not initialized. Skipping staff notification.');
      return { success: false, message: 'Email service not configured' };
    }

    try {
      // Get admin/staff emails (MySQL: ? placeholders, [rows] destructuring)
      const [rows] = await pool.query(
        'SELECT email FROM staff_users WHERE is_active = 1 AND role IN (?, ?)',
        ['admin', 'staff']
      );

      if (!rows || rows.length === 0) {
        console.warn('No staff emails found for notification');
        return { success: false, message: 'No staff emails configured' };
      }

      const staffEmails = rows.map(row => row.email);
      const template = emailTemplates.staffNotification(subscriber);

      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@ekidna.org',
        to: staffEmails.join(','),
        subject: template.subject,
        text: template.text,
        html: template.html
      });

      console.log('Staff notification email sent:', info.messageId);

      return {
        success: true,
        messageId: info.messageId,
        message: 'Staff notification sent successfully'
      };
    } catch (error) {
      console.error('Failed to send staff notification:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send staff notification'
      };
    }
  }

  async sendBulkEmails(subscribers, template) {
    const results = [];

    for (const subscriber of subscribers) {
      if (subscriber.email) {
        try {
          const result = await this.sendSubscriptionConfirmation(subscriber);
          results.push({ subscriber: subscriber.email, ...result });
        } catch (error) {
          results.push({ subscriber: subscriber.email, success: false, error: error.message });
        }
      }
    }

    return results;
  }
}

// Singleton instance
const emailService = new EmailService();

module.exports = emailService;
