const axios = require('axios');

/**
 * Brevo HTTP API Email Configuration
 *
 * This configuration uses Brevo's HTTP API instead of SMTP to send emails.
 * This is necessary when SMTP ports are blocked but HTTP/HTTPS traffic is allowed.
 *
 * Required environment variables:
 * - BREVO_API_KEY: Your Brevo API key (get from https://app.brevo.com/settings/keys/api)
 * - EMAIL_FROM: Verified sender email address
 */

class BrevoEmailClient {
  constructor() {
    this.apiKey = process.env.BREVO_API_KEY;
    this.baseURL = 'https://api.brevo.com/v3';
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@ekidna.org';
    this.fromName = process.env.EMAIL_FROM_NAME || 'Ekidna APS';

    if (!this.apiKey) {
      console.warn('⚠️  BREVO_API_KEY not set - email service will not work');
    }
  }

  /**
   * Verify the API connection and credentials
   */
  async verify() {
    if (!this.apiKey) {
      throw new Error('BREVO_API_KEY not configured');
    }

    try {
      const response = await axios.get(`${this.baseURL}/account`, {
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Brevo API connection verified');
      console.log('📊 Account info:', {
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        companyName: response.data.companyName
      });

      return true;
    } catch (error) {
      if (error.response) {
        console.error('❌ Brevo API Error:', error.response.status, error.response.data);
        throw new Error(`Brevo API authentication failed: ${error.response.data.message || error.response.statusText}`);
      } else {
        console.error('❌ Network Error:', error.message);
        throw error;
      }
    }
  }

  /**
   * Send an email using Brevo API
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email address
   * @param {string} options.subject - Email subject
   * @param {string} options.html - HTML content
   * @param {string} options.text - Plain text content
   * @param {string} options.from - Sender email (optional, uses default)
   * @returns {Promise<Object>} - Result with messageId
   */
  async sendMail(options) {
    if (!this.apiKey) {
      throw new Error('BREVO_API_KEY not configured');
    }

    // Parse recipient email if it's in "Name <email>" format
    let toEmail = options.to;
    let toName = '';

    if (typeof options.to === 'string' && options.to.includes('<')) {
      const match = options.to.match(/(.+)\s*<(.+)>/);
      if (match) {
        toName = match[1].trim();
        toEmail = match[2].trim();
      }
    }

    // Prepare the email payload for Brevo API
    const payload = {
      sender: {
        name: this.fromName,
        email: options.from || this.fromEmail
      },
      to: [{
        email: toEmail,
        name: toName || toEmail.split('@')[0]
      }],
      subject: options.subject,
      htmlContent: options.html,
      textContent: options.text
    };

    try {
      console.log('📤 Sending email via Brevo API...');
      console.log('  To:', toEmail);
      console.log('  Subject:', options.subject);

      const response = await axios.post(`${this.baseURL}/smtp/email`, payload, {
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Email sent successfully via Brevo API');
      console.log('📬 Message ID:', response.data.messageId);

      return {
        messageId: response.data.messageId,
        accepted: [toEmail],
        response: 'OK'
      };
    } catch (error) {
      if (error.response) {
        console.error('❌ Brevo API Error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });

        // Provide specific error messages
        if (error.response.status === 401) {
          throw new Error('Brevo API authentication failed. Check your BREVO_API_KEY.');
        } else if (error.response.status === 400) {
          throw new Error(`Invalid email request: ${error.response.data.message || 'Check sender/recipient addresses'}`);
        } else {
          throw new Error(`Brevo API error: ${error.response.data.message || error.response.statusText}`);
        }
      } else if (error.request) {
        console.error('❌ No response from Brevo API');
        throw new Error('Network error: Unable to reach Brevo API');
      } else {
        console.error('❌ Error:', error.message);
        throw error;
      }
    }
  }
}

// Email templates (same as before)
const emailTemplates = {
  subscriptionConfirmation: (subscriber) => ({
    subject: 'Conferma della tua iscrizione a Ekidna APS',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #FDB813; color: #000; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; }
          .footer { background-color: #333; color: #fff; padding: 15px; text-align: center; font-size: 12px; }
          .button { background-color: #FDB813; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Benvenuto in Ekidna APS!</h1>
          </div>
          <div class="content">
            <h2>Ciao ${subscriber.name},</h2>
            <p>Grazie per esserti iscritto a Ekidna APS per l'anno ${subscriber.subscription_year}!</p>
            <p>Abbiamo ricevuto la tua richiesta di iscrizione con i seguenti dati:</p>
            <ul>
              <li><strong>Nome:</strong> ${subscriber.name}</li>
              ${subscriber.email ? `<li><strong>Email:</strong> ${subscriber.email}</li>` : ''}
              ${subscriber.phone ? `<li><strong>Telefono:</strong> ${subscriber.phone}</li>` : ''}
              ${subscriber.address ? `<li><strong>Indirizzo:</strong> ${subscriber.address}</li>` : ''}
              <li><strong>Anno di iscrizione:</strong> ${subscriber.subscription_year}</li>
            </ul>
            <p>La tua iscrizione è ora attiva. Riceverai presto ulteriori informazioni sulle nostre attività ed eventi.</p>
            <p>Se hai domande o necessiti di assistenza, non esitare a contattarci.</p>
            <p>Grazie per il tuo supporto!</p>
            <p><strong>Il Team di Ekidna APS</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Ekidna APS. Tutti i diritti riservati.</p>
            <p>Questa email è stata inviata automaticamente. Per favore non rispondere a questa email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Benvenuto in Ekidna APS!

      Ciao ${subscriber.name},

      Grazie per esserti iscritto a Ekidna APS per l'anno ${subscriber.subscription_year}!

      Abbiamo ricevuto la tua richiesta di iscrizione con i seguenti dati:
      - Nome: ${subscriber.name}
      ${subscriber.email ? `- Email: ${subscriber.email}` : ''}
      ${subscriber.phone ? `- Telefono: ${subscriber.phone}` : ''}
      ${subscriber.address ? `- Indirizzo: ${subscriber.address}` : ''}
      - Anno di iscrizione: ${subscriber.subscription_year}

      La tua iscrizione è ora attiva. Riceverai presto ulteriori informazioni sulle nostre attività ed eventi.

      Grazie per il tuo supporto!
      Il Team di Ekidna APS

      © ${new Date().getFullYear()} Ekidna APS. Tutti i diritti riservati.
    `
  }),

  staffNotification: (subscriber) => ({
    subject: `Nuova iscrizione: ${subscriber.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #333; color: #FDB813; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 8px; border-bottom: 1px solid #ddd; }
          .label { font-weight: bold; width: 150px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Nuova Iscrizione Ricevuta</h2>
          </div>
          <div class="content">
            <p>È stata registrata una nuova iscrizione:</p>
            <table>
              <tr><td class="label">Nome:</td><td>${subscriber.name}</td></tr>
              <tr><td class="label">Email:</td><td>${subscriber.email || 'Non fornita'}</td></tr>
              <tr><td class="label">Telefono:</td><td>${subscriber.phone || 'Non fornito'}</td></tr>
              <tr><td class="label">Indirizzo:</td><td>${subscriber.address || 'Non fornito'}</td></tr>
              <tr><td class="label">Anno:</td><td>${subscriber.subscription_year}</td></tr>
              <tr><td class="label">Data:</td><td>${new Date(subscriber.created_at).toLocaleString('it-IT')}</td></tr>
            </table>
            <p>Accedi al pannello di gestione per visualizzare tutti i dettagli.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Nuova Iscrizione Ricevuta

      È stata registrata una nuova iscrizione:

      Nome: ${subscriber.name}
      Email: ${subscriber.email || 'Non fornita'}
      Telefono: ${subscriber.phone || 'Non fornito'}
      Indirizzo: ${subscriber.address || 'Non fornito'}
      Anno: ${subscriber.subscription_year}
      Data: ${new Date(subscriber.created_at).toLocaleString('it-IT')}

      Accedi al pannello di gestione per visualizzare tutti i dettagli.
    `
  })
};

module.exports = {
  BrevoEmailClient,
  emailTemplates
};
