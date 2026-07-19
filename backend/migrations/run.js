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
    { id: 1, url: '/img/ekidna-luogo.jpg', alt: 'La sede di Associazione Ekidna a San Martino sulla Secchia (Carpi)' },
    { id: 2, url: '/img/gallery/g1.jpg', alt: 'Associazione Ekidna — evento' },
    { id: 3, url: '/img/gallery/g2.jpg', alt: 'Associazione Ekidna — concerto' },
    { id: 4, url: '/img/gallery/g3.jpg', alt: 'Associazione Ekidna — serata underground' },
    { id: 5, url: '/img/gallery/g4.jpg', alt: 'Associazione Ekidna — live' },
    { id: 6, url: '/img/gallery/g5.jpg', alt: 'Associazione Ekidna — pubblico' },
    { id: 7, url: '/img/gallery/g6.jpg', alt: 'Associazione Ekidna — festival' },
    { id: 8, url: '/img/gallery/g7.jpg', alt: 'Associazione Ekidna — spazio e attività' },
    { id: 9, url: '/img/gallery/g8.jpg', alt: 'Associazione Ekidna — momenti dal circolo' },
    { id: 10, url: '/img/gallery/g9.jpg', alt: 'Associazione Ekidna — il palco' },
  ]), order: 1 },
  // dove_siamo
  { page: 'dove_siamo', key: 'indirizzo',   type: 'text',     label: 'Indirizzo',                 value: 'Via Livorno 9, 41012 Carpi (MO)', order: 1 },
  { page: 'dove_siamo', key: 'maps_url',    type: 'url',      label: 'Google Maps embed URL',     value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2832.0!2d10.9!3d44.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDQ4JzAwLjAiTiAxMMKwNTQnMDAuMCJF!5e0!3m2!1sit!2sit!4v1234567890', order: 2 },
  { page: 'dove_siamo', key: 'come_arrivare', type: 'textarea', label: 'Indicazioni per arrivare (intro)', value: "L'associazione Ekidna è un bel posto e lo abbiamo già detto nella recensione. Tuttavia, può non essere scontato come raggiungerla, specie quando c'è la nebbia o quando si vive in Costa d'Avorio: ecco dunque che Sessuolo.org offre una specie di guida Lonely Planet con i dieci migliori metodi per arrivare all'Ekidna di Carpi, diligentemente scelti per Voi dalla Redazione! Vai col televoto.", order: 3 },
  // contatti
  { page: 'contatti', key: 'intro_testo',   type: 'textarea', label: 'Testo introduttivo',        value: 'Ekidna è uno spazio aperto ad ogni proposta, se hai una band e ti piacerebbe suonare da noi, se sei un\'agenzia e vuoi proporci il tuo roster, se hai un\'idea che vorresti realizzare in Ekidna, scrivici! Cerchiamo di rispondere a tutt3 e di dare spazio a tutt3.', order: 1 },
  { page: 'contatti', key: 'email',         type: 'email',    label: 'Email',                     value: 'ekidnacarpi@gmail.com', order: 2 },
  { page: 'contatti', key: 'telefono',      type: 'phone',    label: 'Telefono / WhatsApp',       value: '+39 371 630 7881', order: 3 },
  { page: 'contatti', key: 'facebook_url',  type: 'url',      label: 'URL Facebook',              value: 'https://www.facebook.com/associazioneekidna', order: 4 },
  { page: 'contatti', key: 'instagram_url', type: 'url',      label: 'URL Instagram',             value: 'https://www.instagram.com/associazione_ekidna/', order: 5 },
  // immagini editabili (upload) — path attuali come default
  { page: 'home',       key: 'hero_immagine', type: 'image', label: 'Foto Hero (home)',        value: '/img/home-hero.jpg', order: 4 },
  { page: 'home',       key: 'cta_immagine',  type: 'image', label: 'Sfondo sezione tesseramento', value: '/img/tesseramento-bg.jpg', order: 5 },
  { page: 'chi_siamo',  key: 'sede_immagine', type: 'image', label: 'Foto della sede',         value: '/img/ekidna-luogo.jpg', order: 3 },
  { page: 'dove_siamo', key: 'sede_immagine', type: 'image', label: 'Foto della sede',         value: '/img/ekidna-luogo.jpg', order: 4 },
];

// Contenuto reale degli eventi (sostituisce i placeholder "Metal Night" ecc. seedati sopra,
// ma SOLO se il campo non è già stato modificato da uno staff — vedi guardia nella UPDATE sotto).
const OLD_PLACEHOLDER_EVENTS = JSON.stringify([
  { id: 1, title: 'Metal Night', date: '2025-10-25', time: '21:00', genre: 'Metal', description: 'Una serata dedicata al metal con band locali e internazionali' },
  { id: 2, title: 'Punk & Hardcore Fest', date: '2025-11-08', time: '20:00', genre: 'Punk', description: 'Festival punk con diverse band dalla scena underground italiana' },
  { id: 3, title: 'Tekno Sound System', date: '2025-11-22', time: '22:00', genre: 'Tekno', description: 'Notte di musica tekno con sound system e DJ set' },
]);

const OLD_PLACEHOLDER_GALLERY = JSON.stringify([
  { id: 1, url: 'https://images.unsplash.com/photo-1540039155733-5bb30b4201de?w=800', alt: 'Concert crowd at festival' },
  { id: 2, url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800', alt: 'Metal music concert' },
  { id: 3, url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', alt: 'Underground punk concert' },
]);

const REAL_GALLERY = JSON.stringify([
  { id: 1, url: '/img/ekidna-luogo.jpg', alt: 'La sede di Associazione Ekidna a San Martino sulla Secchia (Carpi)' },
  { id: 2, url: '/img/gallery/g1.jpg', alt: 'Associazione Ekidna — evento' },
  { id: 3, url: '/img/gallery/g2.jpg', alt: 'Associazione Ekidna — concerto' },
  { id: 4, url: '/img/gallery/g3.jpg', alt: 'Associazione Ekidna — serata underground' },
  { id: 5, url: '/img/gallery/g4.jpg', alt: 'Associazione Ekidna — live' },
  { id: 6, url: '/img/gallery/g5.jpg', alt: 'Associazione Ekidna — pubblico' },
  { id: 7, url: '/img/gallery/g6.jpg', alt: 'Associazione Ekidna — festival' },
  { id: 8, url: '/img/gallery/g7.jpg', alt: 'Associazione Ekidna — spazio e attività' },
  { id: 9, url: '/img/gallery/g8.jpg', alt: 'Associazione Ekidna — momenti dal circolo' },
  { id: 10, url: '/img/gallery/g9.jpg', alt: 'Associazione Ekidna — il palco' },
]);

const REAL_EVENTS = JSON.stringify([
  {
    id: 1,
    slug: 'rottura-del-silenzio-27',
    title: 'Rottura del Silenzio — Ed. 27',
    date: '2026-06-25',
    endDate: '2026-06-28',
    dateLabel: '25 – 28 Giugno 2026',
    genre: 'Festival',
    image: '/img/eventi/rottura-del-silenzio-27.jpg',
    description: "27 anni di rumore, indipendenza e voglia di stare insieme. Rottura del Silenzio torna nel giardino di Associazione Ekidna: quattro giorni di concerti, zone distro, proiezioni e installazioni.",
    lineup: [
      'GIO 25/06 (free entry) — Warm Up: docufilm “Uzeda – Do It Yourself” di Maria Arena',
      'VEN 26/06 — Sick Tamburo · Tense-Up · Adriana',
      'SAB 27/06 — Kaos & Egreen · Cigno · Browbeat · Give Vent · H-Strychnine · Nube · 4Tracks',
      'DOM 28/06 — Uzeda · Three Second Kiss · The Jackson Pollock · Bruuno · Fosca · To Die On Ice · Requiem for Paola P.',
    ],
    info: [
      'Dove: Via Livorno 9, Carpi (MO) — Associazione Ekidna',
      'Ingresso: 15€ al giorno (giovedì gratuito)',
      'Biglietti disponibili solo in cassa (no prevendite online)',
      'Cena, food & drinks, stage esterno e zona distro per tutta la durata del festival',
    ],
    link: 'https://www.facebook.com/events/1001945245623495',
  },
  {
    id: 2,
    slug: 'the-end-of-impact-fest',
    title: 'The End of Impact Fest',
    date: '2026-07-10',
    endDate: '2026-07-12',
    dateLabel: '10 – 12 Luglio 2026',
    genre: 'Festival',
    image: '/img/eventi/end-of-impact-fest.jpg',
    description: "L'ultima edizione di Impact Fest. Tre giorni, due palchi, distro & zine area, talk & market, free camping, vegan food, zones of silence, awareness team e workshop. See you at Associazione Ekidna.",
    lineup: [
      'VEN 10/07 — Emma Goldman · L’Idylle · Put Pùrana · Older Friends · Ineptitude · Uragano · Casamatta · Ghostboycoma',
      'SAB 11/07 — Ostraca · Kokeshi · Powerplant · Vibora · Shizune · Oakhands · Calathea · Shooting Daggers · Cady · Emes · Plastic Bags For Helmets · Dagerman · Kadreka · Foscø · Laurie Bird · Nubifragio · Ghostboycoma',
      'DOM 12/07 — Moshimoshi · Nivra · Verogna · Falesia · Hatsu No Hado · Marcovaldo · Nirano · Legni Vecchi · Vote For Pedro · Flâneur · Yarostan · Lumière',
    ],
    info: [
      'Dove: Via Livorno 9, Carpi (MO) — Associazione Ekidna',
      '2 live stages / distro & zine area / talk & market / free camping / vegan food',
      'Full pass ticket disponibile online',
    ],
    link: 'https://www.facebook.com/events/1346447074184921',
  },
]);

const DEFAULT_SEO = [
  { page: 'home',       title: 'Ekidna APS — Spazio autogestito, culturale e indipendente | Carpi', description: 'Associazione Ekidna (Carpi, MO): spazio autogestito e indipendente dal 1998. Concerti, eventi e cultura underground. Tesseramento gratuito.' },
  { page: 'chi_siamo',  title: 'Chi Siamo — Ekidna APS', description: 'La storia di Ekidna dal 1998: spazio underground a San Martino sulla Secchia (Carpi), tra antifascismo, transfemminismo, ecologia e DIY.' },
  { page: 'eventi',     title: 'Eventi e Concerti — Ekidna APS', description: "Prossimi concerti e festival underground all'Associazione Ekidna di Carpi: punk, hardcore, metal e molto altro." },
  { page: 'galleria',   title: 'Galleria — Ekidna APS', description: "Foto dei concerti, eventi e festival dell'Associazione Ekidna di Carpi." },
  { page: 'dove_siamo', title: 'Dove Siamo — Ekidna APS', description: 'Come raggiungere Ekidna: Via Livorno 9, 41012 Carpi (MO), ex scuola di San Martino sulla Secchia.' },
  { page: 'contatti',   title: 'Contatti — Ekidna APS', description: 'Contatta Ekidna APS per collaborazioni, proposte di eventi o per partecipare alle riunioni.' },
  { page: 'iscriviti',  title: 'Tesseramento gratuito — Diventa socio/a di Ekidna APS', description: 'Tesserati gratuitamente ad Ekidna APS: compila il modulo e diventa socio/a per partecipare a eventi, concerti e attività.' },
  { page: 'privacy',    title: 'Privacy & Cookie Policy — Ekidna APS', description: 'Informativa sulla privacy e sui cookie del sito di Ekidna APS.' },
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

    // CMS extensions: content_type 'image' + page_seo table
    const cmsExtSql = fs.readFileSync(path.join(__dirname, 'cms_extensions.sql'), 'utf8');
    await connection.query(cmsExtSql);
    console.log('✓ CMS extensions applied (content_type image, page_seo table)');

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

    // Aggiorna gli eventi placeholder con i contenuti reali — SOLO se il campo
    // è ancora tal quale al seed originale (nessuna modifica manuale da CMS nel frattempo).
    const [eventsUpdateResult] = await connection.query(
      `UPDATE site_content SET value = ?, updated_at = NOW()
       WHERE page = 'eventi' AND section_key = 'lista_eventi' AND value = ?`,
      [REAL_EVENTS, OLD_PLACEHOLDER_EVENTS]
    );
    if (eventsUpdateResult.affectedRows > 0) {
      console.log('✓ Eventi placeholder aggiornati con i contenuti reali');
    }

    // Stessa guardia per l'indirizzo (il vecchio default era la descrizione
    // della sede, non l'indirizzo stradale usato dalla pagina Dove Siamo).
    await connection.query(
      `UPDATE site_content SET value = ?, updated_at = NOW()
       WHERE page = 'dove_siamo' AND section_key = 'indirizzo'
         AND value = 'Ex scuola elementare di San Martino sulla Secchia, Carpi (MO)'`,
      ['Via Livorno 9, 41012 Carpi (MO)']
    );
    await connection.query(
      `UPDATE site_content SET value = ?, updated_at = NOW()
       WHERE page = 'dove_siamo' AND section_key = 'come_arrivare'
         AND value = 'San Martino sulla Secchia si trova a circa 10km da Carpi. Provenendo da Carpi, prendere la SP413 in direzione Mirandola, poi seguire le indicazioni per San Martino sulla Secchia. Ekidna si trova nell\\'ex scuola elementare del paese.'`,
      ["L'associazione Ekidna è un bel posto e lo abbiamo già detto nella recensione. Tuttavia, può non essere scontato come raggiungerla, specie quando c'è la nebbia o quando si vive in Costa d'Avorio: ecco dunque che Sessuolo.org offre una specie di guida Lonely Planet con i dieci migliori metodi per arrivare all'Ekidna di Carpi, diligentemente scelti per Voi dalla Redazione! Vai col televoto."]
    );
    await connection.query(
      `UPDATE site_content SET value = ?, updated_at = NOW()
       WHERE page = 'galleria' AND section_key = 'gallery_items' AND value = ?`,
      [REAL_GALLERY, OLD_PLACEHOLDER_GALLERY]
    );

    // Seed meta SEO per pagina (solo se non già presenti)
    for (const row of DEFAULT_SEO) {
      await connection.query(
        `INSERT IGNORE INTO page_seo (page, meta_title, meta_description) VALUES (?, ?, ?)`,
        [row.page, row.title, row.description]
      );
    }
    console.log('✓ Meta SEO di default seedati');

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
