/**
 * Endpoint del asistente de IA de D-Code Partners.
 *
 * Modo por defecto (sin ANTHROPIC_API_KEY en las variables de entorno):
 * recuperación pura sobre la base de conocimiento generada a partir del
 * propio sitio (ver scripts/build-knowledge-base.js). Sin LLM, sin coste,
 * sin posibilidad de alucinar porque solo se devuelve contenido real ya
 * publicado. En cuanto se configura una clave de proveedor, este mismo
 * endpoint empieza a generar respuestas con RAG sin cambiar el contrato de
 * la API ni el frontend.
 */
const { loadIndex, search, detectBuyingIntent } = require('../lib/retrieval');
const { getProvider } = require('../lib/providers');

const MAX_MESSAGE_LENGTH = 600;
const MAX_HISTORY_TURNS = 6;
const MIN_RELEVANT_SCORE = 1.4;
const TOP_K = 8;
const MAX_RESULTS_IN_ANSWER = 3;
// Un fragmento secundario solo se añade si está realmente a la altura del
// mejor resultado (no solo por encima del umbral mínimo). Evita mezclar en
// la misma respuesta contenido claramente relevante con coincidencias
// débiles de otras páginas — respuestas más limpias, más de "consultor
// senior" y menos de "lista de resultados de buscador".
const SECONDARY_RESULT_RATIO = 0.92;

const FALLBACK_MESSAGE =
  'No dispongo de información suficiente para responder con precisión a esa pregunta. ' +
  'Si lo deseas, puedes contactar directamente con nuestro equipo y estaremos encantados de ayudarte.';

const CONTACT_CTA =
  '\n\n¿Quieres que lo hablemos directamente? Puedes [reservar una llamada gratuita](/contacto) y lo vemos juntos.';

// Rate limiting best-effort en memoria del proceso. No persiste entre
// instancias serverless frías ni entre regiones (no hay almacén compartido
// provisionado), pero frena abuso básico dentro de una misma instancia
// caliente sin añadir infraestructura nueva.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const requestLog = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  if (requestLog.size > 5000) requestLog.clear(); // salvaguarda anti fuga de memoria
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

function sanitizeMessage(raw) {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, MAX_MESSAGE_LENGTH);
}

function sanitizeHistory(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (m) => m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'assistant')
    )
    .slice(-MAX_HISTORY_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) }));
}

/**
 * Filtra los resultados brutos del scorer a los que de verdad merece la pena
 * mostrar: el mejor resultado (si supera el umbral mínimo) más, como mucho,
 * dos secundarios que estén realmente cerca de su puntuación. Cuando hay
 * intención de contacto/compra, además garantiza que el contenido real de
 * la página de contacto aparezca, aunque el ranking léxico no la sitúe
 * arriba para esa formulación concreta de la pregunta.
 */
function selectResults(rawResults, intent, index) {
  const candidates = rawResults.filter((r) => r.score >= MIN_RELEVANT_SCORE);
  // Fragmentos muy cortos (kickers/eyebrows sueltos, p. ej. "Agenda tu
  // llamada") rara vez son una respuesta completa por sí solos, aunque el
  // BM25 los puntúe alto por su longitud corta: se despriorizan frente a
  // fragmentos con contenido real, siempre que existan.
  const substantial = candidates.filter((r) => r.text.length >= 20);
  let relevant = substantial.length ? substantial : candidates;
  if (relevant.length) {
    const topScore = relevant[0].score;
    relevant = relevant.filter(
      (r, i) => i === 0 || r.score >= topScore * SECONDARY_RESULT_RATIO
    );
  }
  // El mismo contenido a veces vive en dos páginas (p. ej. una pregunta del
  // Método D-Code repetida en la FAQ): no tiene sentido mostrarlo dos veces.
  const seenText = new Set();
  relevant = relevant.filter((r) => {
    if (seenText.has(r.text)) return false;
    seenText.add(r.text);
    return true;
  });

  relevant = relevant.slice(0, MAX_RESULTS_IN_ANSWER);

  if (intent && !relevant.some((r) => r.pageUrl === '/contacto')) {
    const contactCandidates = search('contacto teléfono email llamada disponibilidad', index, 4)
      .concat(rawResults.filter((r) => r.pageUrl === '/contacto'));
    const contactChunk =
      contactCandidates.find((r) => r.pageUrl === '/contacto' && r.text.length >= 20) ||
      contactCandidates.find((r) => r.pageUrl === '/contacto');
    if (contactChunk) relevant = [contactChunk, ...relevant].slice(0, MAX_RESULTS_IN_ANSWER);
  }

  return relevant;
}

function buildExtractiveAnswer(results) {
  if (results.length === 1) return results[0].text;
  return results.map((r) => `- ${r.text}`).join('\n');
}

function sourcesFootnote(results) {
  const seen = new Set();
  const links = [];
  for (const r of results) {
    if (seen.has(r.pageUrl)) continue;
    seen.add(r.pageUrl);
    links.push(`[${r.pageTitle}](${r.pageUrl})`);
  }
  return links.length ? `\n\n*Más detalles: ${links.join(' · ')}*` : '';
}

function buildSystemPrompt(context, intent) {
  return `Eres el asistente de IA oficial de D-Code Partners, una consultora que diseña e implementa sistemas de automatización e inteligencia artificial para empresas.

Tu tono: profesional, cercano, claro y tecnológico, como un consultor senior de la empresa — nunca como un chatbot genérico. Respuestas breves y bien estructuradas en Markdown (listas o negritas cuando ayuden a la claridad), nunca bloques de texto enormes.

Responde ÚNICAMENTE con información contenida en el siguiente contexto, extraído del sitio web real de D-Code Partners. Si el contexto no contiene la respuesta, dilo con honestidad y no inventes nada: sugiere contactar con el equipo.

Contexto relevante:
${context}
${
  intent
    ? '\nEl usuario muestra interés en contratar o agendar una llamada: invita a reservar una llamada gratuita en /contacto de forma natural y no agresiva.'
    : ''
}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Método no permitido' });
  }

  try {
    const forwardedFor = req.headers['x-forwarded-for'];
    const ip =
      (typeof forwardedFor === 'string' && forwardedFor.split(',')[0].trim()) ||
      req.socket?.remoteAddress ||
      'unknown';

    if (isRateLimited(ip)) {
      return res
        .status(429)
        .json({ success: false, error: 'Demasiadas solicitudes. Inténtalo de nuevo en un minuto.' });
    }

    const message = sanitizeMessage(req.body && req.body.message);
    if (!message) {
      return res.status(400).json({ success: false, error: 'El mensaje es obligatorio.' });
    }
    const history = sanitizeHistory(req.body && req.body.history);

    const index = loadIndex();
    const intent = detectBuyingIntent(message);
    const results = selectResults(search(message, index, TOP_K), intent, index);
    const provider = getProvider();

    if (!results.length && !provider) {
      return res.status(200).json({ success: true, reply: FALLBACK_MESSAGE, mode: 'retrieval', intent });
    }

    if (provider) {
      const context = results
        .map(
          (r, i) =>
            `[${i + 1}] (${r.pageTitle} — ${r.pageUrl})\n${r.heading ? r.heading + '\n' : ''}${r.text}`
        )
        .join('\n\n');

      const reply = await provider.generate(buildSystemPrompt(context, intent), [
        ...history,
        { role: 'user', content: message },
      ]);
      return res.status(200).json({ success: true, reply, mode: 'generated', intent });
    }

    // Modo recuperación pura: la respuesta se compone solo con contenido
    // real ya publicado en el sitio, sin inventar nada.
    let reply = buildExtractiveAnswer(results) + sourcesFootnote(results);
    if (intent) reply += CONTACT_CTA;

    return res.status(200).json({ success: true, reply, mode: 'retrieval', intent });
  } catch (error) {
    console.error('Error en /api/chat:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Ha ocurrido un error. Inténtalo de nuevo en unos segundos.' });
  }
};
