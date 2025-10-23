const { createTransporter, emailTemplates } = require('../config/email');
const pool = require('../config/database');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  async initialize() {
    try {
      this.transporter = createTransporter();
      // Verify connection
      await this.transporter.verify();
      console.log('Email service initialized successfully');
      return true;
    } catch (error) {
      console.error('Email service initialization failed:', error.message);
      console.warn('Email functionality will be disabled');
      return false;
    }
  }

  async sendSubscriptionConfirmation(subscriber) {
    if (!this.transporter) {
      console.warn('Email transporter not initialized. Skipping email.');
      return { success: false, message: 'Email service not configured' };
    }

    if (!subscriber.email) {
      console.warn('Subscriber has no email address. Skipping email.');
      return { success: false, message: 'No email address provided' };
    }

    try {
      const template = emailTemplates.subscriptionConfirmation(subscriber);

      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@ekidna.org',
        to: subscriber.email,
        subject: template.subject,
        text: template.text,
        html: template.html
      });

      console.log('Confirmation email sent:', info.messageId);

      // Update database to mark email as sent
      await pool.query(
        `UPDATE subscribers
         SET email_confirmed = true,
             email_confirmation_sent_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [subscriber.id]
      );

      return {
        success: true,
        messageId: info.messageId,
        message: 'Confirmation email sent successfully'
      };
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
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
