const { createTransporter, emailTemplates: smtpEmailTemplates } = require('../config/email');
const { BrevoEmailClient, emailTemplates } = require('../config/email-api');
const pool = require('../config/database');

class EmailService {
  constructor() {
    this.transporter = null;
    this.useHttpApi = false;
    this.brevoClient = null;
  }

  async initialize() {
    try {
      console.log('🔧 Initializing email service...');

      // Prefer Brevo HTTP API if available (works better in proxy environments)
      if (process.env.BREVO_API_KEY) {
        console.log('📧 Found BREVO_API_KEY - using HTTP API');
        this.brevoClient = new BrevoEmailClient();

        try {
          await this.brevoClient.verify();
          this.useHttpApi = true;
          console.log('✅ Email service initialized successfully (HTTP API)');
          console.log('📮 Ready to send emails via Brevo HTTP API');
          return true;
        } catch (error) {
          console.error('❌ Brevo HTTP API initialization failed:', error.message);
          console.log('💡 Falling back to SMTP if available...');
        }
      }

      // Fall back to SMTP
      if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.warn('⚠️  Email configuration incomplete - skipping email service initialization');
        console.log('💡 To enable emails, set either:');
        console.log('   - BREVO_API_KEY (recommended, works in proxy environments)');
        console.log('   - EMAIL_HOST, EMAIL_USER, and EMAIL_PASSWORD (SMTP)');
        return false;
      }

      console.log('📧 Email configuration (SMTP):', {
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
      this.useHttpApi = false;
      console.log('✅ Email service initialized successfully (SMTP)');
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
      } else if (error.code === 'ESOCKET' || error.code === 'ECONNECTION' || error.code === 'EDNS') {
        console.log('🔧 CONNECTION ERROR - Cannot reach SMTP server!');
        console.log('   This often happens when SMTP ports are blocked by firewall/proxy.');
        console.log('   ');
        console.log('   RECOMMENDED SOLUTION: Use Brevo HTTP API instead');
        console.log('   1. Go to: https://app.brevo.com/settings/keys/api');
        console.log('   2. Create a new API key');
        console.log('   3. Add to .env: BREVO_API_KEY=your-api-key-here');
        console.log('   4. Restart the server');
        console.log('   ');
        console.log('   HTTP API works through proxies and firewalls!');
      } else if (error.code === 'ETIMEDOUT') {
        console.log('🔧 TIMEOUT ERROR - SMTP server not responding!');
        console.log('   Check your internet connection and firewall settings');
        console.log('   Or use BREVO_API_KEY for HTTP API instead');
      }

      console.log();
      console.log('💡 The server will continue to run, but emails will not be sent.');
      console.log('💡 Run "node test-smtp.js" from the backend directory to diagnose issues.');
      console.log();

      return false;
    }
  }

  async sendSubscriptionConfirmation(subscriber, attachments = []) {
    console.log('📧 Attempting to send confirmation email to:', subscriber.email);

    if (!this.transporter && !this.brevoClient) {
      console.error('❌ Email service not initialized. Skipping email.');
      return { success: false, message: 'Email service not configured' };
    }

    if (!subscriber.email) {
      console.warn('⚠️  Subscriber has no email address. Skipping email.');
      return { success: false, message: 'No email address provided' };
    }

    try {
      const template = emailTemplates.subscriptionConfirmation(subscriber);

      let info;
      if (this.useHttpApi && this.brevoClient) {
        console.log('📤 Sending email via Brevo HTTP API...');

        // Format attachments for Brevo HTTP API
        const brevoAttachments = attachments.map(att => ({
          name: att.filename,
          content: att.content.toString('base64')
        }));

        info = await this.brevoClient.sendMail({
          to: subscriber.email,
          subject: template.subject,
          text: template.text,
          html: template.html,
          attachments: brevoAttachments.length > 0 ? brevoAttachments : undefined
        });
      } else if (this.transporter) {
        console.log('📤 Sending email via SMTP...');

        // Format attachments for Nodemailer SMTP
        const smtpAttachments = attachments.map(att => ({
          filename: att.filename,
          content: att.content,
          contentType: att.contentType || 'application/pdf'
        }));

        info = await this.transporter.sendMail({
          from: process.env.EMAIL_FROM || 'noreply@ekidna.org',
          to: subscriber.email,
          subject: template.subject,
          text: template.text,
          html: template.html,
          attachments: smtpAttachments.length > 0 ? smtpAttachments : undefined
        });
      } else {
        throw new Error('No email transport available');
      }

      console.log('✅ Confirmation email sent successfully!');
      console.log('📬 Message ID:', info.messageId);
      console.log('👤 Sent to:', subscriber.email);
      if (attachments.length > 0) {
        console.log('📎 Attachments:', attachments.map(a => a.filename).join(', '));
      }

      // Update database to mark email as sent
      await pool.query(
        `UPDATE subscribers
         SET email_confirmed = true,
             email_confirmation_sent_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [subscriber.id]
      );

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
    if (!this.transporter && !this.brevoClient) {
      console.warn('Email service not initialized. Skipping staff notification.');
      return { success: false, message: 'Email service not configured' };
    }

    try {
      // Get admin/staff emails
      const result = await pool.query(
        'SELECT email FROM staff_users WHERE is_active = true AND role IN ($1, $2)',
        ['admin', 'staff']
      );

      if (result.rows.length === 0) {
        console.warn('No staff emails found for notification');
        return { success: false, message: 'No staff emails configured' };
      }

      const staffEmails = result.rows.map(row => row.email);
      const template = emailTemplates.staffNotification(subscriber);

      let info;
      if (this.useHttpApi && this.brevoClient) {
        info = await this.brevoClient.sendMail({
          to: staffEmails.join(','),
          subject: template.subject,
          text: template.text,
          html: template.html
        });
      } else if (this.transporter) {
        info = await this.transporter.sendMail({
          from: process.env.EMAIL_FROM || 'noreply@ekidna.org',
          to: staffEmails.join(','),
          subject: template.subject,
          text: template.text,
          html: template.html
        });
      } else {
        throw new Error('No email transport available');
      }

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
