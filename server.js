// Entry file per il deploy Hostinger (Express): avvia il backend, che serve
// anche i frontend gia' compilati (sito pubblico alla root, MVP su /admin).
// Il backend usa percorsi basati su __dirname, quindi funziona da qualsiasi cwd.
require('./backend/src/server.js');
