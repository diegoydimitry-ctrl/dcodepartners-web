/**
 * Endpoint del asistente de IA de D-Code Partners.
 *
 * Arquitectura, deliberadamente simple: Frontend → este endpoint → Gemini →
 * respuesta. No hay capas de reglas, FAQs ni respuestas preescritas: cada
 * mensaje se envía siempre al modelo (lib/providers.js), con el contenido
 * real del sitio (assets/data/knowledge-base.json) como contexto en el
 * system prompt. Si el modelo no puede responder (sin proveedor
 * configurado, error de conexión, cuota agotada, API caída), se devuelve un
 * mensaje honesto explicando el motivo — nunca una respuesta de repuesto
 * que aparente venir del modelo.
 */
const { getProvider } = require('../lib/providers');

const MAX_MESSAGE_LENGTH = 600;
const MAX_HISTORY_TURNS = 6;

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

let cachedSiteContext = null;

/**
 * Carga el contenido real del sitio (generado por
 * scripts/build-knowledge-base.js a partir del HTML publicado) y lo
 * concatena entero como contexto. El sitio es pequeño (~7.500 tokens en
 * total): cabe sin problema en una sola petición, así que no hace falta
 * recuperación selectiva — Gemini ve todo el contenido real y decide qué
 * es relevante para cada pregunta, en vez de depender de que un ranking
 * léxico haya elegido el fragmento correcto de antemano.
 */
function loadSiteContext() {
  if (cachedSiteContext) return cachedSiteContext;
  // eslint-disable-next-line global-require
  const kb = require('../assets/data/knowledge-base.json');
  cachedSiteContext = (kb.pages || [])
    .map((page) => {
      const body = (page.chunks || [])
        .map((chunk) => (chunk.heading ? `${chunk.heading}\n${chunk.text}` : chunk.text))
        .join('\n\n');
      return `### ${page.title} (${page.url})\n${body}`;
    })
    .join('\n\n---\n\n');
  return cachedSiteContext;
}

function buildSystemPrompt(siteContext) {
  return `Eres el asistente de IA de D-Code Partners, una consultora que diseña e implementa sistemas de automatización e inteligencia artificial para empresas. Hablas como lo haría un consultor senior de la empresa en una llamada real: cercano, directo y útil — nunca como un buscador que copia párrafos ni como un vendedor.

## Estilo
- Máximo 4-5 líneas por respuesta, en frases cortas. Si hace falta una lista, que sea breve. Solo te extiendes si el usuario te pide explícitamente más detalle.
- Nada de tono de marketing ni de folleto. Habla como una persona: "Entiendo", "Buena pregunta", "Eso tiene sentido" — con naturalidad, no en cada mensaje.
- Markdown ligero (negrita, listas) solo si aporta claridad. Nunca bloques largos.
- Mantén el hilo de la conversación: usa lo que el usuario ya ha contado antes en vez de tratar cada mensaje como si empezara de cero.
- Saludos, despedidas, agradecimientos y preguntas sobre quién eres respóndelos tú mismo de forma natural y breve, sin necesitar el contexto de abajo. Si te preguntan algo personal que no puedes saber de verdad (tu edad, dónde vives...), dilo con humor breve y sin inventar un dato.

## Qué sabes y de dónde
- Sobre D-Code Partners (servicios, método, garantías, precios, proceso): usa el contexto de abajo como fuente de verdad para hechos concretos del negocio. Si no cubre lo que preguntan, dilo con honestidad en una frase — algo como "no tengo confirmación de ese dato concreto, pero puedo explicarte cómo solemos hacerlo o ponerte en contacto con el equipo" — y nunca inventes cifras, plazos ni promesas que no estén en el contexto.
- Sobre tecnología y negocio en general (qué es un agente de IA, automatización vs. chatbot, n8n, Make, Zapier, HubSpot y otros CRM, WhatsApp Business API, RAG, MCP, LLMs, APIs, cómo reducir costes con IA, cómo automatizar un despacho o una clínica, y cualquier tema similar): responde con tu propio conocimiento igual que haría un consultor experto del sector — NO te limites al contexto de abajo para esto, ese contexto es solo sobre D-Code Partners. Combínalo con lo de D-Code cuando tenga sentido (p. ej. mencionar cómo lo abordaría D-Code).
- El contexto de abajo es una ayuda, no una orden ciega: si no encaja con lo que se pregunta en este momento de la conversación, ignóralo y responde según el hilo real de la charla en vez de forzar una respuesta que no viene a cuento.
- Fuera de negocio, automatización, IA y tecnología (trivia, cultura general sin relación, temas personales ajenos a ti): dilo en una frase breve y amable, sin forzar una conexión artificial con el contexto, y redirige hacia en qué sí puedes ayudar.

## Cómo conducir la conversación
- Si el usuario describe un problema concreto ("pierdo tiempo con WhatsApp", "se me acumulan los leads"), propón primero una solución realista y luego haz una pregunta de seguimiento — no le devuelvas un folleto.
- Si muestra intención de contratar o automatizar algo pero sin detalle (p. ej. "quiero automatizar mi empresa"), no le vendas nada todavía: pregúntale primero a qué se dedica su empresa y qué proceso quiere automatizar, como haría un consultor antes de proponer nada. Nunca hagas más de una o dos preguntas de diagnóstico seguidas.
- El objetivo no es solo responder preguntas: es entender qué necesita la persona y, cuando tenga sentido, invitarla de forma natural (nunca forzada) a reservar una llamada gratuita en /contacto. Aporta valor primero.

Contenido real publicado en el sitio de D-Code Partners (todas las páginas — úsalo como fuente de verdad para hechos del negocio, ignóralo si no viene a cuento):
${siteContext}`;
}

/**
 * Traduce un fallo de proveedor en un mensaje honesto para el usuario, sin
 * disfrazarlo de respuesta generada. Estas categorías son exactamente las
 * únicas excepciones en las que el asistente no responde con Gemini:
 * error de conexión, límite de cuota, o la API caída/rechazando la
 * petición por otro motivo.
 */
function classifyError(error) {
  const raw = String((error && error.message) || error || '');
  const lower = raw.toLowerCase();

  if (/estado 429|resource_exhausted|quota|rate limit/.test(lower)) {
    return {
      category: 'quota',
      reply:
        'Ahora mismo se ha alcanzado el límite de uso del asistente de IA. Prueba de nuevo en unos minutos, o ' +
        '[contacta directamente con el equipo](/contacto) si lo necesitas ya.',
    };
  }

  if (/econnrefused|enotfound|etimedout|fetch failed|network|abort/.test(lower)) {
    return {
      category: 'connection',
      reply:
        'No he podido conectar con el servicio de IA en este momento. Puede ser un problema de red puntual — ' +
        'inténtalo de nuevo en unos segundos, o [contacta con el equipo](/contacto) si el problema continúa.',
    };
  }

  if (/estado 5\d\d/.test(lower)) {
    return {
      category: 'provider_down',
      reply:
        'El servicio de IA no está respondiendo correctamente ahora mismo (parece un problema en su extremo, no en el tuyo). ' +
        'Inténtalo de nuevo en unos minutos, o [contacta con el equipo](/contacto) si lo necesitas ya.',
    };
  }

  return {
    category: 'unknown',
    reply:
      'Ha ocurrido un problema técnico al generar la respuesta. Inténtalo de nuevo en unos segundos, o ' +
      '[contacta con el equipo](/contacto) si el problema continúa.',
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Método no permitido' });
  }

  const requestStart = Date.now();

  try {
    const forwardedFor = req.headers['x-forwarded-for'];
    const ip =
      (typeof forwardedFor === 'string' && forwardedFor.split(',')[0].trim()) ||
      req.socket?.remoteAddress ||
      'unknown';

    if (isRateLimited(ip)) {
      console.warn(`[chat] Rate limit alcanzado para ${ip}`);
      return res
        .status(429)
        .json({ success: false, error: 'Demasiadas solicitudes. Inténtalo de nuevo en un minuto.' });
    }

    const message = sanitizeMessage(req.body && req.body.message);
    if (!message) {
      return res.status(400).json({ success: false, error: 'El mensaje es obligatorio.' });
    }
    const history = sanitizeHistory(req.body && req.body.history);

    console.log(
      `[chat] Petición recibida — ip=${ip} longitudMensaje=${message.length} turnosHistorial=${history.length}`
    );

    const provider = getProvider();

    if (!provider) {
      // Sin GEMINI_API_KEY3/GEMINI_API_KEY ni ANTHROPIC_API_KEY configuradas
      // en Vercel: no hay nada que pueda generar una respuesta real. Se
      // informa con honestidad en vez de simular una respuesta.
      console.error('[chat] Sin proveedor LLM configurado — faltan las variables de entorno de la API key');
      return res.status(200).json({
        success: true,
        reply:
          'El asistente de IA no está configurado en este momento (falta la clave de API en el servidor). ' +
          '[Contacta con el equipo](/contacto) mientras tanto.',
        mode: 'error',
        providerErrorReason: 'no_provider_configured',
      });
    }

    console.log(`[chat] Proveedor seleccionado: ${provider.name}`);

    const siteContext = loadSiteContext();
    const systemPrompt = buildSystemPrompt(siteContext);

    try {
      console.log(`[chat] Llamando a ${provider.name}...`);
      const callStart = Date.now();
      const reply = await provider.generate(systemPrompt, [
        ...history,
        { role: 'user', content: message },
      ]);
      console.log(
        `[chat] Respuesta de ${provider.name} recibida en ${Date.now() - callStart}ms ` +
          `(total petición: ${Date.now() - requestStart}ms)`
      );
      return res.status(200).json({ success: true, reply, mode: 'generated' });
    } catch (providerError) {
      const { category, reply } = classifyError(providerError);
      console.error(
        `[chat] Error del proveedor ${provider.name} (categoría: ${category}) tras ${Date.now() - requestStart}ms:`,
        providerError
      );
      return res.status(200).json({
        success: true,
        reply,
        mode: 'error',
        providerErrorReason: String((providerError && providerError.message) || providerError).slice(0, 300),
      });
    }
  } catch (error) {
    console.error('[chat] Error inesperado en /api/chat:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Ha ocurrido un error. Inténtalo de nuevo en unos segundos.' });
  }
};
