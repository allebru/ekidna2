# Deploy su Hostinger (hosting condiviso)

## Prerequisiti
- Hostinger Business o Cloud (supporta Node.js)
- MySQL database creato da hPanel
- Accesso SMTP (Brevo o email Hostinger)

---

## 1. Database MySQL

1. In **hPanel → Database → MySQL Databases**, crea un nuovo DB (es. `u123456_ekidna`)
2. Annota: host, nome DB, utente, password
3. Lancia la migrazione da terminale locale (puntando al DB remoto):
   ```bash
   cd backend
   DB_HOST=mysql.hostinger.it DB_NAME=u123456_ekidna \
   DB_USER=u123456_ekidna DB_PASSWORD=XXX npm run migrate
   ```

---

## 2. Backend Node.js

### Carica i file
```
backend/src/
backend/migrations/
backend/assets/          ← copia manuale: TESSERA_ONLINE.pdf + BethEllen-Regular.ttf
backend/package.json
backend/.env             ← NON committare, crea direttamente su server
```

### Crea `.env` sul server (via File Manager o SSH)
```env
NODE_ENV=production
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_NAME=u123456_ekidna
DB_USER=u123456_ekidna
DB_PASSWORD=password_del_db

JWT_SECRET=una_stringa_random_di_almeno_32_caratteri
JWT_EXPIRES_IN=7d

EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=tua@email.com
EMAIL_PASSWORD=xsmtpsib-NUOVA_CHIAVE_BREVO
EMAIL_FROM=info@ekidna.org

FRONTEND_URL=https://ekidna.org

ADMIN_EMAIL=admin@ekidna.org
ADMIN_PASSWORD=CambiaMiSubito123!
```

### Configura Node.js in hPanel
- **hPanel → Node.js → Create Application**
  - Startup file: `backend/src/server.js`
  - Porta: `3001`
  - Esegui `npm install --production` dall'interfaccia

### Prima avvio
```bash
# Nel terminale SSH (o hPanel terminal):
cd backend && npm run migrate
# poi avvia l'app da hPanel
```

---

## 3. Frontend statici

### Website pubblico
```bash
cd website
VITE_API_BASE_URL=https://ekidna.org/api npm run build
```
Carica il contenuto di `website/build/` nella **root pubblica** del dominio (`public_html/`).

### Dashboard staff (MVP)
```bash
cd MVP
VITE_API_BASE_URL=https://ekidna.org/api npm run build
```
Carica il contenuto di `MVP/build/` in `public_html/admin/` (o un sottodominio dedicato).

---

## 4. Reverse proxy — `.htaccess`

Hostinger usa Apache. Crea `public_html/.htaccess` per girare `/api/` al backend Node:

```apache
RewriteEngine On

# Proxy /api/ → backend Node.js porta 3001
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]

# SPA: tutte le altre richieste → index.html del sito
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

Se il piano Hostinger non supporta `mod_proxy` (hosting condiviso base):
- usa un sottodominio `api.ekidna.org` con la Node app separata
- aggiorna `VITE_API_BASE_URL=https://api.ekidna.org/api` e ricostruisci i frontend

---

## 5. Sicurezza post-deploy

- [ ] Cambia la password admin (login in `/admin`, poi Profilo → Cambia Password)
- [ ] Ruota JWT_SECRET (invalida tutti i token esistenti)
- [ ] Verifica sender email in Brevo (il dominio `ekidna.org` deve essere verificato)
- [ ] Abilita HTTPS (certificato SSL da hPanel → SSL)
- [ ] Aggiorna `FRONTEND_URL` nel `.env` con l'URL definitivo

---

## Struttura finale su server
```
public_html/
├── index.html          ← website build
├── assets/             ← website assets
├── admin/
│   ├── index.html      ← MVP build
│   └── assets/
└── .htaccess

backend/
├── src/
├── assets/
│   ├── TESSERA_ONLINE.pdf
│   └── BethEllen-Regular.ttf
├── migrations/
├── package.json
├── .env                ← creato manualmente sul server, NON in git
└── tmp/                ← tessere generate (autocreata)
```
