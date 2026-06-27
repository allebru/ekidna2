require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const DEFAULT_CONTENT = [
  // home
  { page: 'home', key: 'hero_sottotitolo',  type: 'text',     label: 'Hero — Sottotitolo',        value: 'Spazio autogestito, culturale e indipendente dal 1998', order: 1 },
  { page: 'home', key: 'cta_titolo',        type: 'text',     label: 'CTA — Titolo',              value: 'Diventa socio/a/ə di Ekidna', order: 2 },
  { page: 'home', key: 'cta_testo',         type: 'textarea', label: 'CTA — Testo',               value: "L'Associazione Ekidna è uno spazio autogestito, culturale e indipendente. Per partecipare alle nostre attività, ai concerti, ai nostri eventi e frequentare i nostri spazi è necessario tesserarsi. La tessera associativa è completamente gratuita, ha validità per l'anno in corso e l'adesione comporta l'accettazione dello Statuto dell'Associazione.", order: 3 },
  // chi_siamo
  { page: 'chi_siamo', key: 'storia_testo', type: 'textarea', label: 'La Nostra Storia',          value: 'Ekidna nasce nel 1998 da alcune persone che, volendo accomunare i loro interessi per la musica e i valori della cultura underground, hanno creato un\'associazione non a scopo di lucro dove chi vuole può incontrarsi liberamente per condividere gli ideali di antifascismo, transfemminismo, ecologia, DIY e promozione dell\'arte a livello locale (musica, teatro, arti figurative…).', order: 1 },
  { page: 'chi_siamo', key: 'sede_testo',   type: 'textarea', label: 'La Sede — Testo',           value: 'Dapprima in maniera errante spostandosi nella bassa modenese, Ekidna si stabilisce nell\'ex scuola elementare di San Martino sulla Secchia, concessa in comodato d\'uso gratuito dal Comune di Carpi. L\'edificio diroccato viene quindi ristrutturato dalle volontari3 e riconvertito in una struttura funzionante capace di ospitare eventi e laboratori (serigrafia e fotografia).', order: 2 },
  // eventi
  { page: 'eventi', key: 'lista_eventi',    type: 'json',     label: 'Lista eventi',              value: JSON.stringify([
    { id: 1, title: 'Metal Night', date: '2025-10-25', time: '21:00', genre: 'Metal', description: 'Una serata dedicata al metal con band locali e internazionali' },
    { id: 2, title: 'Punk & Hardcore Fest', date: '2025-11-08', time: '20:00', genre: 'Punk', description: 'Festival punk con diverse band dalla scena underground italiana' },
    { id: 3, title: 'Tekno Sound System', date: '2025-11-22', time: '22:00', genre: 'Tekno', description: 'Notte di musica tekno con sound system e DJ set' },
  ]), order: 1 },
  // galleria
  { page: 'galleria', key: 'gallery_items', type: 'json',     label: 'Immagini galleria',         value: JSON.stringify([
    { id: 1, url: 'https://images.unsplash.com/photo-1540039155733-5bb30b4201de?w=800', alt: 'Concert crowd at festival' },
    { id: 2, url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800', alt: 'Metal music concert' },
    { id: 3, url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', alt: 'Underground punk concert' },
  ]), order: 1 },
  // dove_siamo
  { page: 'dove_siamo', key: 'indirizzo',   type: 'text',     label: 'Indirizzo',                 value: 'Ex scuola elementare di San Martino sulla Secchia, Carpi (MO)', order: 1 },
  { page: 'dove_siamo', key: 'maps_url',    type: 'url',      label: 'Google Maps embed URL',     value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2832.0!2d10.9!3d44.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDQ4JzAwLjAiTiAxMMKwNTQnMDAuMCJF!5e0!3m2!1sit!2sit!4v1234567890', order: 2 },
  { page: 'dove_siamo', key: 'come_arrivare', type: 'textarea', label: 'Indicazioni per arrivare', value: 'San Martino sulla Secchia si trova a circa 10km da Carpi. Provenendo da Carpi, prendere la SP413 in direzione Mirandola, poi seguire le indicazioni per San Martino sulla Secchia. Ekidna si trova nell\'ex scuola elementare del paese.', order: 3 },
  // contatti
  { page: 'contatti', key: 'intro_testo',   type: 'textarea', label: 'Testo introduttivo',        value: 'Ekidna è uno spazio aperto ad ogni proposta, se hai una band e ti piacerebbe suonare da noi, se sei un\'agenzia e vuoi proporci il tuo roster, se hai un\'idea che vorresti realizzare in Ekidna, scrivici! Cerchiamo di rispondere a tutt3 e di dare spazio a tutt3.', order: 1 },
  { page: 'contatti', key: 'email',         type: 'email',    label: 'Email',                     value: 'ekidnacarpi@gmail.com', order: 2 },
  { page: 'contatti', key: 'telefono',      type: 'phone',    label: 'Telefono / WhatsApp',       value: '+39 371 630 7881', order: 3 },
  { page: 'contatti', key: 'facebook_url',  type: 'url',      label: 'URL Facebook',              value: 'https://www.facebook.com/associazioneekidna', order: 4 },
  { page: 'contatti', key: 'instagram_url', type: 'url',      label: 'URL Instagram',             value: 'https://www.instagram.com/associazione_ekidna/', order: 5 },
];

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    database: process.env.DB_NAME || 'ekidna_db',
    user: process.env.DB_USER || 'ekidna_user',
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
    charset: 'utf8mb4',
  });

  try {
    console.log('🚀 Running database migration...');

    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await connection.query(sql);
    console.log('✓ Schema created/verified');

    // site_content table
    const contentSql = fs.readFileSync(path.join(__dirname, 'site_content.sql'), 'utf8');
    await connection.query(contentSql);
    console.log('✓ site_content table created/verified');

    // Seed admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ekidna.org';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hash = await bcrypt.hash(adminPassword, 10);
    const [rows] = await connection.query('SELECT id FROM staff_users WHERE role = ?', ['admin']);
    if (rows.length === 0) {
      await connection.query(
        `INSERT INTO staff_users (email, password_hash, name, role) VALUES (?, ?, ?, 'admin')`,
        [adminEmail, hash, 'Administrator']
      );
      console.log(`✓ Default admin created: ${adminEmail}`);
    } else {
      await connection.query(
        `UPDATE staff_users SET email = ?, password_hash = ? WHERE role = 'admin'`,
        [adminEmail, hash]
      );
      console.log(`✓ Admin updated: ${adminEmail}`);
    }

    // Seed default site content
    for (const row of DEFAULT_CONTENT) {
      await connection.query(
        `INSERT IGNORE INTO site_content (page, section_key, content_type, label, value, sort_order)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [row.page, row.key, row.type, row.label, row.value, row.order ?? 0]
      );
    }
    console.log('✓ Default site content seeded');

    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

// Eseguito direttamente (`npm run migrate`) → lancia subito.
// Importato (es. da server.js con AUTO_MIGRATE) → esporta solo la funzione.
if (require.main === module) {
  run();
}

module.exports = run;
