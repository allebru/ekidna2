# Ekidna APS — Admin/CMS

Pannello staff di Ekidna APS: gestione iscritti e CMS del sito pubblico (contenuti, immagini, eventi, SEO per pagina). React + Vite, SPA client-side, servito dal backend sotto `/admin`.

Per il quadro completo (come si avvia tutto insieme, struttura del progetto, deploy) vedi il [README della root](../README.md).

## Comandi

```bash
npm install
npm run dev     # dev server Vite, utile per iterare sulla grafica
npm run build   # output in ../backend/public/admin
```

Richiede il backend attivo su `:3001` (login, API contenuti/SEO/iscritti). Le credenziali di default (`admin@ekidna.org` / `admin123`) vengono create dalla migrazione del backend (`npm run migrate`).

Il codice originale di questo progetto è disponibile su Figma: https://www.figma.com/design/72UVjHVSKSNY6ZkQIiQKXj/Ekidna-APS-MVP.
