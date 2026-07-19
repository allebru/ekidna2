# Ekidna Backend

API Express + rendering server-side del sito pubblico, per Ekidna APS.

## Stack

- **Node.js** + **Express 4**
- **MySQL** (`mysql2`) — nessun ORM, query dirette nei model
- **JWT** (`jsonwebtoken` + `bcryptjs`) per l'autenticazione staff
- **Nodemailer** per le email di conferma tesseramento (via Brevo SMTP, vedi [EMAIL_SETUP.md](./EMAIL_SETUP.md))
- **pdf-lib** per generare il PDF della tessera associativa
- **multer** per l'upload immagini dal CMS
- **helmet**, **express-rate-limit**, **express-validator** per la sicurezza

Non serve Docker per eseguire il backend: è un processo Node singolo che si connette a un MySQL già esistente (locale o remoto).

## Struttura

```
backend/
├── src/
│   ├── config/          # connessione MySQL, JWT, email
│   ├── controllers/     # logica delle route (auth, content, seo, subscribers, upload)
│   ├── models/          # StaffUser, Subscriber, ActivityLog, SiteContent, PageSeo
│   ├── routes/          # definizione endpoint, montati in routes/index.js
│   ├── middleware/       # auth JWT, validazione input, error handler
│   ├── services/        # ssr.js (rendering pagine pubbliche), ssrCache.js, emailService, pdfService
│   ├── ssr/              # bundle SSR generato da `website/` — non editare a mano, si rigenera con `npm run build` in website/
│   └── server.js        # entry point Express
├── migrations/
│   ├── init.sql          # schema base (staff_users, subscribers, activity_logs)
│   ├── site_content.sql  # tabella contenuti CMS
│   ├── cms_extensions.sql # tabella page_seo + tipo campo "image"
│   └── run.js            # esegue tutte le migrazioni + seed di default (idempotente)
├── public/
│   ├── site/     # build del sito pubblico (website/), committata in git
│   ├── admin/    # build dell'admin (MVP/), committata in git
│   └── uploads/  # immagini caricate dal CMS, NON in git
└── package.json
```

## Avvio in locale

Richiede un MySQL raggiungibile e un file `.env` **nella root del repository** (non in `backend/` — sia `server.js` che `migrations/run.js` lo leggono da lì). Variabili minime:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=ekidna_db
DB_USER=ekidna_user
DB_PASSWORD=...
JWT_SECRET=...
PORT=3001
SITE_URL=http://localhost:3001
ADMIN_EMAIL=admin@ekidna.org
ADMIN_PASSWORD=admin123
```

```bash
npm install
npm run migrate   # crea/aggiorna schema, seed contenuti default, crea utente admin
npm run dev       # con nodemon (riavvio automatico)
# oppure: npm start
```

`npm run migrate` è **idempotente**: rieseguirlo su un database già popolato non sovrascrive contenuti che lo staff ha già modificato dal CMS (usa `INSERT IGNORE` e aggiornamenti con guardia sul valore precedente).

## Come vengono servite le pagine del sito pubblico

Il sito pubblico non è file statici: ogni richiesta a una pagina nota (`/`, `/eventi`, `/eventi/:slug`, ecc.) passa da `src/services/ssr.js`, che:

1. legge i contenuti correnti dal DB (`site_content`, `page_seo`)
2. chiama il bundle SSR (`src/ssr/entry-server.mjs`, compilato da `website/`) per ottenere l'HTML della pagina
3. assembla titolo, meta description, Open Graph, canonical e JSON-LD (Organization + Event) a partire dai dati reali
4. mette in cache il risultato in memoria (`src/services/ssrCache.js`), invalidata automaticamente ogni volta che lo staff salva una modifica dal CMS

URL non riconosciuti ricevono un **404 reale** (non la home con status 200). La sitemap (`/sitemap.xml`) è generata dinamicamente dalla stessa lista di rotte note + eventi presenti in DB.

## API

Tutte le route sono montate sotto `/api`.

### Pubbliche

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/subscribers` | Nuova richiesta di tesseramento (dal sito) |
| `GET` | `/api/content` | Contenuti CMS di tutte le pagine (usato dal sito in SSR) |
| `GET` | `/api/seo` | Meta SEO di tutte le pagine |
| `POST` | `/api/auth/login` | Login staff, ritorna JWT |

### Autenticate (header `Authorization: Bearer <token>`)

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/api/auth/me` | Utente corrente |
| `POST` | `/api/auth/change-password` | Cambio password |
| `GET` | `/api/content/meta` | Contenuti con metadati (per l'editor admin) |
| `PUT` | `/api/content/:page` | Aggiorna i campi di una pagina (invalida la cache SSR) |
| `PUT` | `/api/seo/:page` | Aggiorna titolo/descrizione/immagine SEO di una pagina |
| `POST` | `/api/upload` | Upload immagine (jpg/png/gif/webp, max 5MB), ritorna un URL relativo `/uploads/...` |
| `DELETE` | `/api/upload/:filename` | Rimuove un'immagine caricata |
| `GET` `PUT` `DELETE` `POST` | `/api/subscribers/*` | CRUD iscritti, statistiche, ripristino (vedi `routes/subscribers.js`) |

## Utente admin di default

Creato al primo `npm run migrate`, da `ADMIN_EMAIL`/`ADMIN_PASSWORD` nel `.env` (default: `admin@ekidna.org` / `admin123`).

⚠️ **Cambia la password subito dopo il primo deploy in produzione.**

## Deploy

Vedi [../DEPLOYMENT_HOSTINGER.md](../DEPLOYMENT_HOSTINGER.md).

## Checklist sicurezza pre-produzione

- [ ] Password admin cambiata
- [ ] `JWT_SECRET` impostato a una stringa lunga e random (non il default di sviluppo)
- [ ] `SITE_URL` impostato al dominio reale
- [ ] Backup del database prima di eseguire `npm run migrate` in produzione
