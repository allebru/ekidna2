const nodemailer = require('nodemailer');

// Verify nodemailer is loaded correctly
if (!nodemailer || typeof nodemailer.createTransport !== 'function') {
  console.error('❌ CRITICAL: nodemailer module not loaded correctly!');
  console.error('nodemailer type:', typeof nodemailer);
  console.error('nodemailer object:', nodemailer);
  throw new Error('nodemailer.createTransport is not available. Run: npm install nodemailer');
}

console.log('✅ nodemailer module loaded successfully');

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Email templates
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
  createTransporter,
  emailTemplates
};
