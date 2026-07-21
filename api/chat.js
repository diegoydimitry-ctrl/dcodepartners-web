/**
 * Endpoint del asistente de IA de D-Code Partners.
 *
 * Modo por defecto (sin ninguna clave de proveedor configurada):
 * recuperación pura sobre la base de conocimiento generada a partir del
 * propio sitio (ver scripts/build-knowledge-base.js). Sin LLM, sin coste,
 * sin posibilidad de alucinar porque solo se devuelve contenido real ya
 * publicado. En cuanto se configura GEMINI_API_KEY (proveedor principal
 * actual) o ANTHROPIC_API_KEY en Vercel, este mismo endpoint empieza a
 * generar respuestas con RAG sin cambiar el contrato de la API ni el
 * frontend — ver lib/providers.js para el registro de proveedores.
 */
const { loadIndex, search, detectBuyingIntent, detectContactIntent } = require('../lib/retrieval');
const { getProvider } = require('../lib/providers');
const { detectSmalltalk } = require('../lib/smalltalk');
const { handleConsultativeFlow, isAwaitingConsultativeAnswer } = require('../lib/consultative');
const { matchProblemStatement } = require('../lib/solutions');

const MAX_MESSAGE_LENGTH = 600;
const MAX_HISTORY_TURNS = 6;
const MIN_RELEVANT_SCORE = 1.1;
const TOP_K = 8;
// Una sola respuesta enfocada por defecto — no un batiburrillo de 2-3
// fragmentos a modo de resultados de buscador. "Máximo 4-5 líneas, ampliar
// solo si lo piden": mejor un fragmento corto y claro que varios.
const MAX_RESULTS_IN_ANSWER = 1;
// Un fragmento secundario solo se añade si está realmente a la altura del
// mejor resultado (no solo por encima del umbral mínimo). Evita mezclar en
// la misma respuesta contenido claramente relevante con coincidencias
// débiles de otras páginas — respuestas más limpias, más de "consultor
// senior" y menos de "lista de resultados de buscador".
const SECONDARY_RESULT_RATIO = 0.92;
// Cada fragmento se recorta a 1-2 frases: una respuesta de chat no debe
// leerse como un párrafo copiado de la web.
const SNIPPET_MAX_CHARS = 200;
const SNIPPET_MIN_CHARS = 60;

const FALLBACK_MESSAGE =
  'No tengo confirmación de ese dato concreto, pero puedo explicarte cómo solemos hacerlo o ' +
  'ponerte en contacto con el equipo para que te lo confirmen ellos.';

// Se anteponen de vez en cuando (nunca siempre, para no sonar a plantilla)
// a una respuesta basada en contenido real, para que suene a alguien
// pensando la respuesta y no a una base de datos escupiendo un resultado.
const NATURAL_LEAD_INS = ['', '', '', 'Buena pregunta. ', 'Claro. ', 'Te lo explico. '];

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
 * dos secundarios que estén realmente cerca de su puntuación. Cuando el
 * usuario pide específicamente contactar (no solo muestra interés
 * comercial genérico como "¿cuánto cuesta?", que tiene su propia buena
 * respuesta), además garantiza que el contenido real de la página de
 * contacto aparezca, aunque el ranking léxico no la sitúe arriba para esa
 * formulación concreta de la pregunta.
 */
function selectResults(rawResults, contactIntent, index) {
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

  if (contactIntent && !relevant.some((r) => r.pageUrl === '/contacto')) {
    const contactCandidates = search('contacto teléfono email llamada disponibilidad', index, 4)
      .concat(rawResults.filter((r) => r.pageUrl === '/contacto'));
    const contactChunk =
      contactCandidates.find((r) => r.pageUrl === '/contacto' && r.text.length >= 20) ||
      contactCandidates.find((r) => r.pageUrl === '/contacto');
    if (contactChunk) relevant = [contactChunk, ...relevant].slice(0, MAX_RESULTS_IN_ANSWER);
  }

  return relevant;
}

/**
 * Recorta un fragmento a su primera(s) frase(s), no al párrafo entero: una
 * respuesta de chat útil dice lo esencial en un par de líneas, no copia el
 * bloque completo de la web de la que salió.
 */
function trimToSentences(text, maxChars, minChars) {
  // Se busca cada límite de frase real (.!? seguido de espacio o fin de
  // texto, vía lookahead) con exec() en bucle en vez de String.match(/g),
  // que en un texto como "Email: alguien@dominio.com. Teléfono: ..." puede
  // saltarse por completo el primer tramo cuando un punto interno (el de
  // ".com") no cierra frase — match(/g) descarta silenciosamente cualquier
  // intento de coincidencia fallido en vez de conservarlo.
  const boundary = /[.!?]+(?=\s|$)/g;
  let out = '';
  let lastEnd = 0;
  let match;
  while ((match = boundary.exec(text)) !== null) {
    const end = match.index + match[0].length;
    const sentence = text.slice(lastEnd, end);
    if (out.length >= minChars && out.length + sentence.length > maxChars) break;
    out += sentence;
    lastEnd = end;
    if (out.length >= maxChars) break;
  }
  out = out.trim();
  if (!out) return text.slice(0, maxChars).trim();
  return out;
}

function buildExtractiveAnswer(results) {
  const snippets = results.map((r) => trimToSentences(r.text, SNIPPET_MAX_CHARS, SNIPPET_MIN_CHARS));
  const leadIn = NATURAL_LEAD_INS[Math.floor(Math.random() * NATURAL_LEAD_INS.length)];
  if (snippets.length === 1) return leadIn + snippets[0];
  return leadIn + snippets.map((s) => `- ${s}`).join('\n');
}

/**
 * Un único enlace natural a la página de origen, solo cuando de verdad
 * añade algo — nada de una lista de enlaces al estilo resultados de buscador.
 */
function sourceHint(results) {
  const top = results[0];
  // pageUrl es null para el conocimiento técnico general (lib/general-knowledge.js):
  // no hay una página real de D-Code que enlazar.
  if (!top || !top.pageUrl) return '';
  return `\n\nMás detalles en [${top.pageTitle.split('—')[0].trim()}](${top.pageUrl}).`;
}

function buildSystemPrompt(context, intent) {
  return `Eres el asistente de IA de D-Code Partners, una consultora que diseña e implementa sistemas de automatización e inteligencia artificial para empresas. Hablas como lo haría un consultor senior de la empresa en una llamada real: cercano, directo y útil — nunca como un buscador que copia párrafos ni como un vendedor.

## Estilo
- Máximo 4-5 líneas por respuesta, en frases cortas. Si hace falta una lista, que sea breve. Solo te extiendes si el usuario te pide explícitamente más detalle.
- Nada de tono de marketing ni de folleto. Habla como una persona: "Entiendo", "Buena pregunta", "Eso tiene sentido", "Déjame explicarlo" — con naturalidad, no en cada mensaje.
- Markdown ligero (negrita, listas) solo si aporta claridad. Nunca bloques largos.
- Mantén el hilo de la conversación: usa lo que el usuario ya ha contado antes en vez de tratar cada mensaje como si empezara de cero.

## Qué sabes
- Sobre D-Code Partners (servicios, método, garantías, precios, proceso): responde ÚNICAMENTE con lo que dice el contexto de abajo, extraído del sitio real. Si el contexto no cubre lo que preguntan, dilo con honestidad en una frase — algo como "no tengo confirmación de ese dato concreto, pero puedo explicarte cómo solemos hacerlo o ponerte en contacto con el equipo" — y nunca inventes cifras, plazos ni promesas.
- Sobre tecnología en general (IA, agentes, automatización, ChatGPT, Claude, Gemini, Copilot, n8n, Make, Zapier, CRM, ERP, WhatsApp Business, RAG, MCP, LLMs, APIs, etc.): puedes usar tu conocimiento general con normalidad, como haría un consultor experto del sector. Combínalo con lo de D-Code cuando tenga sentido.

## Cómo conducir la conversación
- Si el usuario describe un problema concreto ("pierdo tiempo con WhatsApp", "se me acumulan los leads"), propón primero una solución realista y luego haz una pregunta de seguimiento — no le devuelvas un folleto.
- Si muestra intención de contratar o automatizar algo pero sin detalle (p. ej. "quiero automatizar mi empresa"), no le vendas nada todavía: pregúntale primero a qué se dedica su empresa y qué proceso quiere automatizar, como haría un consultor antes de proponer nada.
- El objetivo no es solo responder preguntas: es entender qué necesita la persona y, cuando tenga sentido, invitarla de forma natural (nunca forzada) a reservar una llamada gratuita en /contacto. Aporta valor primero.

Contexto relevante extraído del sitio de D-Code Partners:
${context || '(sin fragmentos relevantes para este mensaje — usa tu conocimiento general si aplica, y sé honesto si la pregunta es específicamente sobre D-Code y no tienes el dato)'}
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
    const provider = getProvider();

    // Sin proveedor LLM configurado: capa de reglas (saludos, flujo
    // consultivo, soluciones ante problemas descritos) antes de caer a
    // recuperación pura. En cuanto hay un proveedor configurado, es el
    // propio modelo quien se encarga de todo esto —mejor, y con contexto
    // real— guiado por el system prompt: las reglas se saltan para no
    // interponerse en su razonamiento.
    if (!provider) {
      const smalltalkReply = detectSmalltalk(message);
      if (smalltalkReply) {
        return res.status(200).json({ success: true, reply: smalltalkReply, mode: 'smalltalk', intent: false });
      }

      // Si ya estamos a mitad de una pregunta de diagnóstico, esa
      // continuación manda siempre. Si no, un problema descrito con detalle
      // ("pierdo tiempo con WhatsApp") tiene prioridad sobre arrancar el
      // flujo genérico desde cero, porque ya podemos responder algo
      // concreto y útil.
      const midFlow = isAwaitingConsultativeAnswer(history);
      const solutionReply = midFlow ? null : matchProblemStatement(message);
      const consultativeReply = solutionReply ? null : handleConsultativeFlow(message, history);
      if (consultativeReply) {
        return res.status(200).json({ success: true, reply: consultativeReply, mode: 'consultative', intent: false });
      }
      if (solutionReply) {
        return res.status(200).json({ success: true, reply: solutionReply, mode: 'solution', intent: false });
      }
    }

    const index = loadIndex();
    const intent = detectBuyingIntent(message);
    const contactIntent = detectContactIntent(message);
    let results = selectResults(search(message, index, TOP_K), contactIntent, index);

    // Pregunta de seguimiento corta ("¿y el precio?", "cuéntame más") que por
    // sí sola no tiene términos suficientes para encontrar nada: se reintenta
    // combinándola con el último mensaje del usuario, para heredar el tema de
    // la conversación en vez de rendirse directamente.
    if (!results.length) {
      const lastUserMessage = [...history].reverse().find((m) => m.role === 'user');
      if (lastUserMessage) {
        const combinedQuery = `${lastUserMessage.content} ${message}`;
        results = selectResults(search(combinedQuery, index, TOP_K), contactIntent, index);
      }
    }

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
    // real ya publicado en el sitio, sin inventar nada, recortado a lo
    // esencial para que se lea como una respuesta y no como una cita.
    let reply = buildExtractiveAnswer(results);
    if (!intent) reply += sourceHint(results);
    if (intent) reply += CONTACT_CTA;

    return res.status(200).json({ success: true, reply, mode: 'retrieval', intent });
  } catch (error) {
    console.error('Error en /api/chat:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Ha ocurrido un error. Inténtalo de nuevo en unos segundos.' });
  }
};
