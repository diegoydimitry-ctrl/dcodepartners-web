/**
 * Endpoint del asistente de IA de D-Code Partners.
 *
 * Arquitectura: Frontend → este endpoint → cadena de proveedores LLM
 * (lib/providers.js: Gemini primero, Anthropic como respaldo si hay clave)
 * → respuesta. No hay capas de reglas, FAQs ni respuestas preescritas: cada
 * mensaje se envía siempre al modelo, con el contenido real del sitio
 * (assets/data/knowledge-base.json) como contexto en el system prompt.
 *
 * Resiliencia ante fallos del proveedor (visto en producción: Gemini
 * devolviendo 503 "high demand" durante picos puntuales): el proveedor
 * principal reintenta con backoff+jitter dentro de lib/providers.js; si
 * agota los reintentos, se prueba el siguiente proveedor de la cadena (un
 * único intento, para no agotar el presupuesto de la petición); si todos
 * fallan, se devuelve un mensaje honesto y amable — nunca el error técnico
 * real (estado HTTP, nombre del proveedor, JSON de la API) llega al
 * usuario. Ese detalle vive solo en los logs del servidor.
 *
 * Límite duro de tiempo (DEADLINE_MS): toda la cadena de proveedores corre
 * bajo un único AbortController con un plazo máximo. Antes de este cambio,
 * ninguna llamada al proveedor tenía timeout — un fallo real de producción
 * quedó registrado como "Vercel Runtime Timeout Error: Task timed out
 * after 300 seconds" en /api/chat, con la función colgada sin devolver
 * nada al usuario. El deadline aquí garantiza que, pase lo que pase, el
 * endpoint responde (con éxito o con el mensaje de error amable) muy por
 * debajo de cualquier límite de la plataforma.
 */
const { getProviderChain } = require('../lib/providers');

const MAX_MESSAGE_LENGTH = 600;
const MAX_HISTORY_TURNS = 6;

// Presupuesto total de la petición: primario con reintentos completos
// (hasta 3 intentos x 12s + backoff ≈ 38s en el peor caso) + respaldo con
// un único intento (12s más) ≈ 50s, con margen bajo maxDuration=60s.
const DEADLINE_MS = 52_000;

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
  const turns = raw
    .filter(
      (m) => m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'assistant')
    )
    .slice(-MAX_HISTORY_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) }));
  // Gemini exige que el primer turno enviado sea 'user' — si el recorte de
  // MAX_HISTORY_TURNS deja un 'assistant' suelto al principio, se descarta
  // para no romper la petición.
  const firstUserIndex = turns.findIndex((t) => t.role === 'user');
  return firstUserIndex === -1 ? [] : turns.slice(firstUserIndex);
}

let cachedSiteContext = null;

/**
 * Carga el contenido real del sitio (generado por
 * scripts/build-knowledge-base.js a partir del HTML publicado) y lo
 * concatena entero como contexto. El sitio es pequeño: cabe sin problema en
 * una sola petición, así que no hace falta recuperación selectiva — el
 * modelo ve todo el contenido real y decide qué es relevante para cada
 * pregunta, en vez de depender de que un ranking léxico haya elegido el
 * fragmento correcto de antemano.
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
- Sobre D-Code Partners (servicios, método, garantías, precios, proceso): usa el contexto de abajo como fuente de verdad para hechos concretos del negocio. Si no cubre lo que preguntan, dilo con honestidad en una frase — algo como "no tengo confirmación de ese dato concreto, pero puedo explicarte cómo solemos hacerlo o ponerte en contacto con el equipo" — y nunca inventes cifras, plazos, clientes ni promesas que no estén en el contexto.
- Sobre tecnología y negocio en general (qué es un agente de IA, automatización vs. chatbot, n8n, Make, Zapier, HubSpot y otros CRM, WhatsApp Business API, RAG, MCP, LLMs, APIs, cómo reducir costes con IA, cómo automatizar un despacho o una clínica, y cualquier tema similar): responde con tu propio conocimiento igual que haría un consultor experto del sector — NO te limites al contexto de abajo para esto, ese contexto es solo sobre D-Code Partners. Combínalo con lo de D-Code cuando tenga sentido (p. ej. mencionar cómo lo abordaría D-Code).
- El contexto de abajo es una ayuda, no una orden ciega: si no encaja con lo que se pregunta en este momento de la conversación, ignóralo y responde según el hilo real de la charla en vez de forzar una respuesta que no viene a cuento.
- Fuera de negocio, automatización, IA y tecnología (trivia, cultura general sin relación, temas personales ajenos a ti): dilo en una frase breve y amable, sin forzar una conexión artificial con el contexto, y redirige hacia en qué sí puedes ayudar.

## Cómo conducir la conversación
- Si el usuario describe un problema concreto ("pierdo tiempo con WhatsApp", "se me acumulan los leads"), propón primero una solución realista y luego haz una pregunta de seguimiento — no le devuelvas un folleto.
- Si muestra intención de contratar o automatizar algo pero sin detalle (p. ej. "quiero automatizar mi empresa"), no le vendas nada todavía: pregúntale primero a qué se dedica su empresa y qué proceso quiere automatizar, como haría un consultor antes de proponer nada. Nunca hagas más de una o dos preguntas de diagnóstico seguidas.
- El objetivo no es solo responder preguntas: es entender qué necesita la persona y, cuando haya una oportunidad clara (problema concreto ya diagnosticado, o intención de contratar explícita), invitarla de forma natural — nunca forzada ni en cada mensaje — a reservar una llamada gratuita en /contacto. Aporta valor primero; nunca dos CTA seguidos en la misma conversación si el usuario no ha respondido al primero.

Contenido real publicado en el sitio de D-Code Partners (todas las páginas — úsalo como fuente de verdad para hechos del negocio, ignóralo si no viene a cuento):
${siteContext}`;
}

/**
 * Traduce un fallo de proveedor en un mensaje honesto y amable para el
 * usuario — nunca el error técnico real. El usuario no debe ver jamás un
 * código de estado HTTP, el nombre del proveedor (Gemini/Anthropic), la
 * palabra "UNAVAILABLE", ni ningún fragmento de un JSON de error: todo eso
 * se registra en el log del servidor (ver caller) para poder diagnosticar,
 * pero el texto que llega al chat siempre es en lenguaje natural.
 */
function classifyError(error) {
  const raw = String((error && error.message) || error || '');
  const lower = raw.toLowerCase();

  if (/estado 429|resource_exhausted|quota|rate limit/.test(lower)) {
    return {
      category: 'quota',
      reply:
        'Ahora mismo el asistente está recibiendo muchas solicitudes. Puedes reintentarlo en un momento, o ' +
        '[contactar directamente con el equipo](/contacto) si lo necesitas ya.',
    };
  }

  return {
    category: /estado 5\d\d/.test(lower)
      ? 'provider_down'
      : /econnrefused|enotfound|etimedout|fetch failed|network|abort/.test(lower)
        ? 'connection'
        : 'unknown',
    reply:
      'Parece que el asistente no está disponible temporalmente. Puedes intentarlo de nuevo en unos minutos, o ' +
      '[contactar con el equipo](/contacto) si lo necesitas ya.',
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Método no permitido' });
  }

  const requestStart = Date.now();
  // Identificador corto solo para correlacionar líneas de log de la misma
  // petición — nunca se envía al cliente ni identifica a la persona.
  const requestId = Math.random().toString(36).slice(2, 10);

  try {
    const forwardedFor = req.headers['x-forwarded-for'];
    const ip =
      (typeof forwardedFor === 'string' && forwardedFor.split(',')[0].trim()) ||
      req.socket?.remoteAddress ||
      'unknown';

    if (isRateLimited(ip)) {
      console.warn(`[chat:${requestId}] Rate limit alcanzado para ip=${ip}`);
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
      `[chat:${requestId}] Petición recibida — ip=${ip} longitudMensaje=${message.length} turnosHistorial=${history.length}`
    );

    const providerChain = getProviderChain();

    if (providerChain.length === 0) {
      // Sin GEMINI_API_KEY3/GEMINI_API_KEY ni ANTHROPIC_API_KEY configuradas
      // en Vercel: no hay nada que pueda generar una respuesta real. Se
      // informa con honestidad en vez de simular una respuesta.
      console.error(`[chat:${requestId}] Sin proveedor LLM configurado — faltan las variables de entorno de la API key`);
      return res.status(200).json({
        success: true,
        reply:
          'El asistente de IA no está configurado en este momento. ' +
          '[Contacta con el equipo](/contacto) mientras tanto.',
        mode: 'error',
        providerErrorReason: 'no_provider_configured',
      });
    }

    const siteContext = loadSiteContext();
    const systemPrompt = buildSystemPrompt(siteContext);
    const messages = [...history, { role: 'user', content: message }];

    // Deadline duro compartido por toda la cadena de proveedores: cuando
    // salta, aborta cualquier fetch en curso (ver lib/providers.js) en vez
    // de dejar la función colgada hasta que la plataforma la mate sin dar
    // ninguna respuesta al usuario.
    const deadlineController = new AbortController();
    const deadlineTimer = setTimeout(() => deadlineController.abort(), DEADLINE_MS);

    let lastError = null;
    let lastProviderName = null;

    try {
      for (let i = 0; i < providerChain.length; i += 1) {
        const provider = providerChain[i];
        const isPrimary = i === 0;
        lastProviderName = provider.name;
        console.log(`[chat:${requestId}] Probando proveedor ${provider.name} (${isPrimary ? 'principal' : 'respaldo'})`);
        const callStart = Date.now();
        try {
          const reply = await provider.generate(systemPrompt, messages, {
            maxAttempts: isPrimary ? undefined : 1,
            outerSignal: deadlineController.signal,
          });
          console.log(
            `[chat:${requestId}] Respuesta de ${provider.name} recibida en ${Date.now() - callStart}ms ` +
              `(total petición: ${Date.now() - requestStart}ms)`
          );
          return res.status(200).json({ success: true, reply, mode: 'generated' });
        } catch (providerError) {
          lastError = providerError;
          console.error(
            `[chat:${requestId}] Fallo del proveedor ${provider.name} tras ${Date.now() - callStart}ms ` +
              `(${i + 1}/${providerChain.length} en la cadena):`,
            providerError
          );
          if (deadlineController.signal.aborted) break; // sin tiempo para probar el siguiente
        }
      }
    } finally {
      clearTimeout(deadlineTimer);
    }

    // Toda la cadena de proveedores falló (o se agotó el deadline). El
    // usuario recibe siempre el mismo tipo de mensaje amable, en
    // lenguaje natural — el motivo técnico real (categoría, proveedor,
    // mensaje de error) queda solo en el log del servidor y en
    // providerErrorReason (un campo interno, no se renderiza en el chat).
    const { category, reply } = classifyError(lastError);
    const reason = String((lastError && lastError.message) || lastError || 'desconocido').slice(0, 300);
    console.error(
      `[chat:${requestId}] Cadena de proveedores agotada (último: ${lastProviderName}, categoría: ${category}) ` +
        `tras ${Date.now() - requestStart}ms: ${reason}`
    );
    return res.status(200).json({
      success: true,
      reply,
      mode: 'error',
      providerErrorReason: category,
    });
  } catch (error) {
    console.error(`[chat:${requestId}] Error inesperado en /api/chat:`, error);
    return res
      .status(500)
      .json({ success: false, error: 'Ha ocurrido un error. Inténtalo de nuevo en unos segundos.' });
  }
};

module.exports.config = {
  // Presupuesto total de la petición (ver DEADLINE_MS arriba, ~52s en el
  // peor caso con reintentos + respaldo): 60s deja margen suficiente sin
  // acercarse al límite real de la plataforma. Antes de este cambio no
  // había ningún maxDuration explícito ni timeout por fetch, lo que
  // permitió que una petición real colgara hasta el límite por defecto de
  // la plataforma (300s) sin devolver nunca respuesta al usuario.
  maxDuration: 60,
};
