# Ekidna2 — sito, tesseramento e CMS per Ekidna APS

Sito pubblico, gestione iscritti e CMS interno per l'Associazione Ekidna APS (Carpi, MO).

## Cos'è

Un unico backend Express serve tre cose sullo stesso dominio:

1. **Sito pubblico** (`website/`) — home, chi siamo, eventi (con pagina singola per evento), galleria, dove siamo, contatti, tesseramento. Renderizzato **server-side** ad ogni richiesta (non è una SPA statica): ogni pagina arriva già con titolo, meta description, Open Graph e dati strutturati (JSON-LD) corretti, letti in tempo reale dal database.
2. **Admin/CMS** (`MVP/`, servito sotto `/admin`) — pannello per lo staff: gestione iscritti, editing dei contenuti del sito (testi, immagini, eventi, galleria) senza toccare il codice, e un editor SEO per pagina con punteggio e consigli.
3. **API** (`backend/`) — REST API che alimenta sia il sito (in SSR) che l'admin.

Le modifiche fatte dallo staff nell'admin sono **immediatamente visibili** sul sito pubblico: non serve nessun rebuild o redeploy per cambiare un testo, un'immagine o i meta SEO di una pagina.

## Struttura del progetto

```
ekidna2/
├── backend/              # Express + MySQL — API, SSR, invio email, PDF tessera
│   ├── src/
│   │   ├── config/       # connessione DB, JWT, email
│   │   ├── controllers/  # handler delle route
│   │   ├── models/       # accesso al DB (classi con metodi statici)
│   │   ├── routes/       # definizione degli endpoint /api/*
│   │   ├── middleware/   # auth JWT, validazione, error handling
│   │   ├── services/     # ssr.js (rendering pagine), ssrCache.js, email, pdf
│   │   ├── ssr/           # bundle SSR compilato da website/ (generato, non editare a mano)
│   │   └── server.js     # entry point Express
│   ├── migrations/       # schema DB + seed iniziale
│   └── public/
│       ├── site/         # build compilata di website/ (committata in git)
│       ├── admin/        # build compilata di MVP/ (committata in git)
│       └── uploads/      # immagini caricate dallo staff (NON in git)
│
├── website/              # Sito pubblico — React + Vite, SSR con react-dom/server
│   └── src/
│       ├── components/    # pagine e componenti
│       ├── context/       # SiteContentContext (dati CMS lato client)
│       ├── entry-client.tsx  # hydration nel browser
│       └── entry-server.tsx  # rendering lato server (bundle separato)
│
├── MVP/                  # Admin/CMS — React + Vite, SPA client-side
│   └── src/
│       ├── pages/         # ContentPage (editor contenuti), SeoEditor, SubscribersPage
│       └── components/
│
└── server.js             # entry point di deploy: avvia backend/src/server.js
```

## Stack tecnico

- **Backend:** Node.js, Express, MySQL (`mysql2`), JWT, Nodemailer, `pdf-lib` (generazione tessera)
- **Sito pubblico:** React 18, React Router 7, Vite, Tailwind CSS — con SSR reale (`react-dom/server`, niente browser headless)
- **Admin:** React 18, Vite, Tailwind CSS, componenti shadcn/ui
- **Database:** MySQL — tabelle principali: `site_content` (testi/immagini per pagina), `page_seo` (meta SEO per pagina), `subscribers`, `staff_users`, `activity_logs`

## Avvio in locale

Serve un database MySQL raggiungibile (locale, o un container Docker usa-e-getta). Esempio rapido con Docker:

```bash
docker run --rm -d --name ekidna-db \
  -e MYSQL_ROOT_PASSWORD=rootpass -e MYSQL_DATABASE=ekidna_db \
  -e MYSQL_USER=ekidna_user -e MYSQL_PASSWORD=ekidna_pass \
  -p 3307:3306 mysql:8.0 --default-authentication-plugin=mysql_native_password
```

Poi, dalla **root del repository** (non in `backend/`: le variabili d'ambiente vengono lette da lì):

```bash
cat > .env <<'EOF'
DB_HOST=127.0.0.1
DB_PORT=3307
DB_NAME=ekidna_db
DB_USER=ekidna_user
DB_PASSWORD=ekidna_pass
NODE_ENV=development
PORT=3001
JWT_SECRET=cambia-questa-stringa
FRONTEND_URL=http://localhost:3001
SITE_URL=http://localhost:3001
ADMIN_EMAIL=admin@ekidna.org
ADMIN_PASSWORD=admin123
EOF

cd backend
npm install
npm run migrate      # crea schema + utente admin + contenuti di default
npm start             # backend + sito + admin, tutto su http://localhost:3001
```

Poi apri:
- **Sito pubblico:** http://localhost:3001
- **Admin:** http://localhost:3001/admin (login: `admin@ekidna.org` / `admin123`, da cambiare al primo accesso)

### Sviluppare sul sito o sull'admin (con hot-reload)

Il sito pubblico e l'admin, quando si edita la UI, si possono lanciare anche con il dev server Vite (più comodo per iterare sulla grafica, ma senza SSR):

```bash
cd website && npm run dev     # http://localhost:3000, proxy /api verso :3001
cd MVP && npm run dev         # dev server dell'admin, stesso proxy
```

Il backend (`npm start` in `backend/`, o l'app completa da root) deve restare attivo per le chiamate API.

### Ricompilare dopo una modifica al codice del sito o dell'admin

I frontend sono **committati già compilati** in `backend/public/site` e `backend/public/admin` (il deploy non fa build, serve solo `npm install` sul backend). Dopo una modifica va rigenerata la build:

```bash
cd website && npm run build   # build client + bundle SSR in un colpo
cd MVP && npm run build
```

## Deploy

Vedi [DEPLOYMENT_HOSTINGER.md](./DEPLOYMENT_HOSTINGER.md) — il target di produzione è Hostinger hosting condiviso (Node via hPanel), un solo processo Express per tutto, niente Docker/VPS in produzione. Il deploy è **automatico**: l'app è collegata al repository git, un push fa pull + riavvio da sola, e con `AUTO_MIGRATE=true` nell'`.env` di produzione anche la migrazione del database parte da sola ad ogni riavvio.

## Documentazione correlata

- [backend/README.md](./backend/README.md) — API, modelli dati, comandi di sviluppo del backend
- [backend/EMAIL_SETUP.md](./backend/EMAIL_SETUP.md) — configurazione SMTP (Brevo) per le email di conferma tesseramento
- [DEPLOYMENT_HOSTINGER.md](./DEPLOYMENT_HOSTINGER.md) — procedura di deploy in produzione

## Sicurezza — prima di andare in produzione

- [ ] `ADMIN_PASSWORD` e `JWT_SECRET` nel `.env` di produzione sono già i valori reali in uso (non i default di sviluppo) — con `AUTO_MIGRATE=true` vengono riapplicati ad ogni riavvio, quindi devono restare sempre aggiornati se cambi la password dall'interfaccia
- [ ] `SITE_URL` nel `.env` di produzione è il dominio reale (`https://ekidnacarpi.it`) — viene usato per sitemap, canonical e Open Graph
