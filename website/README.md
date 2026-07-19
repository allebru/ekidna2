# Ekidna — Sito pubblico

Sito pubblico di Ekidna APS. React + Vite, con **SSR reale**: le pagine non sono servite come SPA statica, ma renderizzate lato server dal backend Express (vedi [../backend/src/services/ssr.js](../backend/src/services/ssr.js)) leggendo i contenuti dal CMS in tempo reale.

Per il quadro completo (come si avvia tutto insieme, struttura del progetto, deploy) vedi il [README della root](../README.md).

## Comandi

```bash
npm install
npm run dev          # dev server Vite (http://localhost:3000), senza SSR — utile per iterare sulla grafica
npm run build         # build completa: client + bundle SSR, output in ../backend/public/site e ../backend/src/ssr
npm run build:client  # solo il bundle client
npm run build:ssr     # solo il bundle SSR
```

`npm run dev` richiede il backend attivo su `:3001` (proxy automatico per `/api`, configurato in `vite.config.mts`). Per vedere il sito esattamente come in produzione (con SSR, meta tag e JSON-LD reali) serve passare dal backend: `npm run build` poi avviare il backend, non `npm run dev`.

Il codice originale di questo progetto è disponibile su Figma: https://www.figma.com/design/Duhv7Wube4OUg8ivN4T29c/Multi-Page-Responsive-Website.
