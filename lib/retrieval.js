/**
 * Motor de recuperación (BM25-lite) sobre assets/data/knowledge-base.json.
 * Sin dependencias externas ni base de datos vectorial: el sitio es lo
 * bastante pequeño como para que un ranking léxico clásico sea preciso,
 * rápido y gratis. Si el contenido crece mucho, este módulo es el único
 * punto a sustituir por un índice vectorial real.
 */
const K1 = 1.5;
const B = 0.75;

const STOPWORDS = new Set([
  'de', 'la', 'el', 'en', 'y', 'a', 'los', 'del', 'se', 'las', 'por', 'un',
  'para', 'con', 'no', 'una', 'su', 'al', 'lo', 'como', 'mas', 'pero', 'sus',
  'le', 'ya', 'o', 'este', 'si', 'porque', 'esta', 'entre', 'cuando', 'muy',
  'sin', 'sobre', 'tambien', 'me', 'hasta', 'hay', 'donde', 'quien', 'desde',
  'todo', 'nos', 'durante', 'todos', 'uno', 'les', 'ni', 'contra', 'otros',
  'ese', 'eso', 'ante', 'ellos', 'e', 'esto', 'mi', 'antes', 'algunos', 'que',
  'unos', 'yo', 'otro', 'otras', 'otra', 'el', 'tanto', 'esa', 'estos',
  'mucho', 'quienes', 'nada', 'muchos', 'cual', 'poco', 'ella', 'estar',
  'estas', 'algunas', 'algo', 'nosotros', 'mis', 'tu', 'te', 'ti', 'tus',
  'ellas', 'nosotras', 'vosotros', 'vosotras', 'os', 'esos', 'esas', 'es',
  'son', 'ser', 'esta', 'estan', 'del', 'las', 'los',
]);

function normalize(s) {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

// Sufijos derivativos/flexivos comunes del español, de más largos a más
// cortos, para que formas relacionadas (contactar/contacto, integrar/
// integración/integraciones) compartan raíz en el índice.
const SUFFIXES = [
  'amiento', 'imiento', 'aciones', 'idades', 'ancias', 'encias', 'amente',
  'ciones', 'ativo', 'ativa', 'iendo', 'adora', 'antes', 'ancia', 'encia',
  'acion', 'idad', 'dades', 'ando', 'ador', 'cion', 'dad', 'ar', 'er', 'ir',
  'es', 's',
].sort((a, b) => b.length - a.length);

function stem(wordIn) {
  let word = wordIn;
  if (word.length > 4) {
    for (const suf of SUFFIXES) {
      if (word.length - suf.length >= 3 && word.endsWith(suf)) {
        word = word.slice(0, -suf.length);
        break;
      }
    }
  }
  if (word.length > 5 && /[oae]$/.test(word)) {
    word = word.slice(0, -1);
  }
  return word;
}

function tokenize(text) {
  const norm = normalize(text);
  const raw = norm.match(/[a-z0-9]+/g) || [];
  return raw.filter((t) => t.length > 1 && !STOPWORDS.has(t)).map(stem);
}

function buildIndex(kb) {
  const docs = [];
  for (const page of kb.pages || []) {
    const titleTokens = tokenize(page.title);
    for (const chunk of page.chunks || []) {
      const headingTokens = tokenize(chunk.heading);
      const bodyTokens = tokenize(chunk.text);
      // Los términos del encabezado cuentan doble (refuerzan la relevancia
      // temática del fragmento); los del título de página cuentan una vez,
      // para que una consulta sobre el tema general de la página ("contacto",
      // "garantías") también encuentre sus fragmentos aunque no repitan la
      // palabra exacta en el cuerpo del texto.
      const tokens = headingTokens.concat(headingTokens, titleTokens, bodyTokens);
      docs.push({
        id: chunk.id,
        pageUrl: page.url,
        pageTitle: page.title,
        heading: chunk.heading,
        text: chunk.text,
        tokens,
      });
    }
  }

  const N = docs.length;
  const tf = docs.map((d) => {
    const m = new Map();
    for (const t of d.tokens) m.set(t, (m.get(t) || 0) + 1);
    return m;
  });

  const df = new Map();
  tf.forEach((m) => {
    for (const term of m.keys()) df.set(term, (df.get(term) || 0) + 1);
  });

  const idf = new Map();
  for (const [term, freq] of df.entries()) {
    idf.set(term, Math.log((N - freq + 0.5) / (freq + 0.5) + 1));
  }

  const docLengths = docs.map((d) => d.tokens.length);
  const avgDocLength = docLengths.reduce((a, b) => a + b, 0) / (N || 1);

  return { docs, tf, idf, docLengths, avgDocLength, N };
}

function search(query, index, topK = 5) {
  if (!index || !index.N) return [];
  const qTokens = Array.from(new Set(tokenize(query)));
  if (!qTokens.length) return [];

  const scored = index.docs.map((doc, i) => {
    const termFreqs = index.tf[i];
    const docLen = index.docLengths[i];
    let score = 0;
    for (const term of qTokens) {
      const freq = termFreqs.get(term);
      if (!freq) continue;
      const idf = index.idf.get(term) || 0;
      const denom = freq + K1 * (1 - B + (B * docLen) / (index.avgDocLength || 1));
      score += (idf * (freq * (K1 + 1))) / denom;
    }
    return { doc, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((s) => ({ ...s.doc, score: s.score }));
}

const INTENT_KEYWORDS = [
  'precio', 'precios', 'coste', 'costes', 'cuesta', 'presupuesto', 'tarifa',
  'contratar', 'contratacion', 'empezar', 'comenzar', 'reunion', 'llamada',
  'agendar', 'cita', 'demo', 'prueba gratis', 'quiero', 'necesito',
  'interesado', 'interesa', 'hablar con', 'contactar', 'contacto',
  'presupuestame', 'me gustaria empezar', 'como contrato', 'cuanto cuesta',
];

function detectBuyingIntent(query) {
  const norm = normalize(query);
  return INTENT_KEYWORDS.some((kw) => norm.includes(kw));
}

let cachedIndex = null;

/** Carga y cachea el índice BM25 en memoria del proceso (se reutiliza entre
 * invocaciones "calientes" de la función serverless). */
function loadIndex() {
  if (cachedIndex) return cachedIndex;
  // eslint-disable-next-line global-require
  const kb = require('../assets/data/knowledge-base.json');
  cachedIndex = buildIndex(kb);
  return cachedIndex;
}

module.exports = { tokenize, buildIndex, search, detectBuyingIntent, loadIndex };
