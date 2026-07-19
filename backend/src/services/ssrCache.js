// Cache in-memory dell'HTML renderizzato per rotta. Il sito ha poche pagine e
// traffico basso: invalidazione totale ad ogni salvataggio dal CMS è più
// semplice ed è comunque immediata; il TTL è solo una rete di sicurezza nel
// caso un'invalidazione venga persa.
const TTL_MS = 10 * 60 * 1000;

const cache = new Map();

function get(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function set(key, value) {
  cache.set(key, { value, timestamp: Date.now() });
}

function invalidateAll() {
  cache.clear();
}

module.exports = { get, set, invalidateAll };
