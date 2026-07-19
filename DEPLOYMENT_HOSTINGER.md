# Deploy su Hostinger (hosting condiviso)

Il progetto è **un solo processo Express** che serve sito pubblico, admin e API dallo stesso dominio — niente Docker, niente Nginx/Apache reverse-proxy da configurare a mano: l'app Node.js di Hostinger gestisce lei il routing del dominio verso il processo.

**Il deploy è già automatico**: l'app Hostinger è collegata al repository git e, ad ogni `git push` sul branch di produzione, fa da sola pull del codice e riavvia il processo Node. Con `AUTO_MIGRATE=true` impostato nell'`.env` di produzione, ogni riavvio esegue anche `backend/migrations/run.js` in automatico (è idempotente: sicura da rilanciare ripetutamente, vedi sotto). In pratica: **il flusso quotidiano è "builda in locale, committa, pusha" — nessun passaggio manuale via SSH**. Le sezioni "Database MySQL" e "Avvio" più sotto restano utili solo per il primissimo setup o per un intervento manuale in caso di problemi.

⚠️ **Un'implicazione di `AUTO_MIGRATE=true`**: la migrazione, ad ogni riavvio, riscrive l'utente admin con `ADMIN_EMAIL`/`ADMIN_PASSWORD` letti dall'`.env` in quel momento. Finché quelle variabili nell'`.env` di produzione restano quelle reali già in uso, è innocuo (si riscrive lo stesso valore). Se un giorno cambi la password admin dall'interfaccia e **non** aggiorni anche `ADMIN_PASSWORD` nell'`.env`, il prossimo push/riavvio la resetterebbe al valore vecchio presente nell'`.env`.

## Prerequisiti

- Hostinger Business o Cloud (supporta Node.js da hPanel)
- Database MySQL creato da hPanel
- Accesso SMTP (Brevo, vedi [backend/EMAIL_SETUP.md](./backend/EMAIL_SETUP.md))

---

## 1. Build dei frontend (in locale, prima di caricare)

Il deploy **non compila nulla sul server**: le build di `website/` e `MVP/` vanno generate in locale e committate.

```bash
cd website
npm install
npm run build     # genera backend/public/site/ (client) + backend/src/ssr/ (bundle SSR)

cd ../MVP
npm install
npm run build     # genera backend/public/admin/
```

Verifica che `git status` mostri gli aggiornamenti dentro `backend/public/site`, `backend/public/admin` e `backend/src/ssr`, poi commit e push: **da qui in poi il deploy prosegue da solo** (pull + restart + migrazione automatica, vedi sopra).

Il resto di questa sezione (setup DB, variabili d'ambiente, struttura file) serve solo al primo setup dell'app su hPanel o per interventi manuali — non fa parte del flusso di ogni giorno.

---

## 2. Database MySQL (solo al primo setup)

1. hPanel → **Database → MySQL Databases** → crea un DB (es. `u123456_ekidna`)
2. Annota host, nome DB, utente, password
3. Se serve lanciare la migrazione a mano (es. prima di attivare `AUTO_MIGRATE`, o per debug), puntando al DB remoto:
   ```bash
   cd backend
   DB_HOST=<host_mysql_hostinger> DB_NAME=u123456_ekidna \
   DB_USER=u123456_ekidna DB_PASSWORD=XXX npm run migrate
   ```
   È idempotente: si può rilanciare in sicurezza, senza perdere contenuti già modificati dallo staff (vedi l'avvertenza su `ADMIN_PASSWORD` in cima al documento).

---

## 3. Caricare il codice (solo al primo setup)

Con l'app già collegata al repository, il codice si aggiorna da solo ad ogni push. Per il primo collegamento, struttura minima necessaria a runtime:

```
server.js                 ← entry point (require di backend/src/server.js)
package.json              ← root, usato da hPanel per npm install
backend/
├── src/                  ← incluso src/ssr/ (bundle SSR compilato)
├── migrations/
├── public/
│   ├── site/              ← build website
│   └── admin/             ← build MVP
├── assets/                ← TESSERA_ONLINE.pdf + font per il PDF tessera
└── package.json
.env                       ← creato manualmente sul server, NON committato
```

## 4. Configurare l'app Node.js in hPanel (solo al primo setup)

**hPanel → Node.js → Create Application**
- Startup file: `server.js` (nella root del progetto)
- Application root: la cartella dove hai caricato il repository
- Collega il dominio/sottodominio all'app
- Collega il repository git e attiva il deploy automatico su push (così il resto di questa guida diventa storia passata: da quel momento basta pushare)
- Esegui **npm install** dall'interfaccia (esegue `postinstall`/`build` di `package.json`, che installa le dipendenze del backend)

### Variabili d'ambiente

Da hPanel → Node.js → la tua app → **Environment variables** (oppure creando un file `.env` nella root del progetto sul server — `dotenv` lo legge da lì, non da `backend/.env`):

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
EMAIL_PASSWORD=xsmtpsib-...
EMAIL_FROM=info@ekidnacarpi.it

FRONTEND_URL=https://ekidnacarpi.it
SITE_URL=https://ekidnacarpi.it

ADMIN_EMAIL=admin@ekidna.org
ADMIN_PASSWORD=CambiaMiSubito123!
```

`SITE_URL` è importante: viene usato per generare la sitemap e gli URL assoluti nei meta tag (canonical, Open Graph, JSON-LD) — deve essere il dominio reale, non `localhost`. Aggiungi anche `AUTO_MIGRATE=true` per abilitare la migrazione automatica ad ogni riavvio (vedi avvertenza in cima al documento).

### Primo avvio

Dal terminale SSH/hPanel:
```bash
cd backend && npm run migrate
```
Poi avvia l'app da hPanel (startup file `server.js`). Da qui in avanti, con `AUTO_MIGRATE=true` e il deploy automatico configurato, i push successivi non richiedono più questo passaggio manuale.

---

## 5. Sicurezza post-deploy

- [ ] Cambia la password admin (login su `/admin`, poi Profilo → Cambia Password)
- [ ] Verifica che `JWT_SECRET` sia una stringa random forte, diversa da qualsiasi valore usato in sviluppo
- [ ] Verifica il sender email in Brevo (il dominio deve essere verificato)
- [ ] Abilita HTTPS (certificato SSL da hPanel → SSL) — `SITE_URL` deve iniziare con `https://`
- [ ] Conferma che `backend/public/uploads/` sia scrivibile dal processo Node (le immagini caricate dal CMS finiscono lì e **non sono in git**: vanno backuppate separatamente)

---

## Aggiornare un deploy esistente

Con il deploy automatico configurato, è tutto qui:

```bash
# in locale
cd website && npm run build
cd ../MVP && npm run build
git add -A && git commit -m "..."
git push
```

Hostinger fa pull, riavvia il processo Node e (con `AUTO_MIGRATE=true`) esegue la migrazione da solo. Nessun passaggio manuale sul server per il caso normale.

Se per qualche motivo il deploy automatico non fosse attivo su un'app, i passaggi manuali sono: caricare il codice aggiornato, poi `cd backend && npm run migrate` (solo se la modifica tocca lo schema DB), poi riavviare l'app da hPanel.

## Struttura finale sul server

```
server.js
package.json
.env                       ← creato manualmente, non in git
backend/
├── src/
│   └── ssr/                ← bundle SSR, committato
├── migrations/
├── assets/
│   ├── TESSERA_ONLINE.pdf
│   └── BethEllen-Regular.ttf
├── public/
│   ├── site/                ← build website, committata
│   ├── admin/                ← build MVP, committata
│   └── uploads/              ← immagini caricate dal CMS, NON committate
└── package.json
```
