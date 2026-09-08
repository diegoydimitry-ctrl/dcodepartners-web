/**
 * Endpoint del asistente de IA de D-Code Partners.
 *
 * Arquitectura: Frontend → este endpoint → cadena de proveedores LLM
 * (lib/providers.js) → texto en streaming. No hay capas de reglas, FAQs ni
 * respuestas preescritas: cada mensaje se envía siempre al modelo, con el
 * contenido real del sitio (assets/data/knowledge-base.json) como contexto
 * en el system prompt.
 *
 * CONTRATO DE RESPUESTA — texto plano en streaming, no JSON.
 * AUD-DCP 08/09/2026. El contrato anterior era `{success, reply, mode,
 * providerErrorReason}` en un único JSON al final de la petición. Se
 * sustituye por `Content-Type: text/plain` con el cuerpo emitido en
 * fragmentos según se genera: el frontend ya no tiene que esperar a que
 * termine toda la respuesta para empezar a mostrarla, y no necesita
 * distinguir formatos — cualquier respuesta de este endpoint (una
 * generación real, un aviso de límite de uso, un error de configuración)
 * es directamente el texto que hay que enseñar en el chat. Sin excepción:
 * el estado HTTP no cambia ese hecho, así que un 429/500 sigue llevando un
 * cuerpo legible por si algo fuera de este código llega a inspeccionarlo.
 *
 * RESILIENCIA — cadena de proveedores, no reintento del mismo proveedor.
 * Si el proveedor principal no responde con contenido real (falla al
 * conectar, o conecta pero no emite ningún texto), se prueba el siguiente
 * de la cadena antes de darse por vencido. Solo se escribe algo al
 * navegador en cuanto hay contenido real que enseñar — así una caída del
 * proveedor principal nunca se ve como una respuesta a medias ni como un
 * error crudo, salvo que fallen TODOS los proveedores configurados.
 */
const { getProviderChain, MAX_STREAM_MS } = require('../lib/providers');

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
 * recuperación selectiva — el modelo ve todo el contenido real y decide
 * qué es relevante para cada pregunta, en vez de depender de que un
 * ranking léxico haya elegido el fragmento correcto de antemano.
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
- El objetivo no es solo responder preguntas: es entender qué necesita la persona y, cuando tenga sentido, invitarla de forma natural (nunca forzada) a reservar una llamada en /contacto. Aporta valor primero.

Contenido real publicado en el sitio de D-Code Partners (todas las páginas — úsalo como fuente de verdad para hechos del negocio, ignóralo si no viene a cuento):
${siteContext}`;
}

function sendPlainText(res, statusCode, text) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.status(statusCode);
  res.end(text);
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const requestStart = Date.now();
  let committed = false; // true en cuanto se ha escrito contenido real al navegador

  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return sendPlainText(res, 405, 'Método no permitido.');
    }

    const forwardedFor = req.headers['x-forwarded-for'];
    const ip =
      (typeof forwardedFor === 'string' && forwardedFor.split(',')[0].trim()) ||
      req.socket?.remoteAddress ||
      'unknown';

    if (isRateLimited(ip)) {
      console.warn(`[chat] Rate limit alcanzado para ${ip}`);
      return sendPlainText(res, 429, 'Demasiadas solicitudes. Inténtalo de nuevo en un minuto.');
    }

    const message = sanitizeMessage(req.body && req.body.message);
    if (!message) {
      return sendPlainText(res, 400, 'El mensaje es obligatorio.');
    }
    const history = sanitizeHistory(req.body && req.body.history);

    console.log(
      `[chat] Petición recibida — ip=${ip} longitudMensaje=${message.length} turnosHistorial=${history.length}`
    );

    const chain = getProviderChain();
    if (chain.length === 0) {
      // Sin GEMINI_API_KEY3/GEMINI_API_KEY ni ANTHROPIC_API_KEY configuradas
      // en Vercel: no hay nada que pueda generar una respuesta real.
      console.error('[chat] Sin proveedor LLM configurado — faltan las variables de entorno de la API key');
      return sendPlainText(
        res,
        200,
        'El asistente de IA no está configurado en este momento. Contacta con el equipo en /contacto mientras tanto.'
      );
    }

    const siteContext = loadSiteContext();
    const systemPrompt = buildSystemPrompt(siteContext);
    const fullMessages = [...history, { role: 'user', content: message }];

    for (const provider of chain) {
      const providerStart = Date.now();
      try {
        const iterator = provider.stream(systemPrompt, fullMessages);

        // Se consume el primer fragmento ANTES de tocar la respuesta HTTP.
        // Si el proveedor falla al conectar (lanza) o conecta pero no
        // entrega ningún texto (p. ej. bloqueo de seguridad del modelo),
        // esto se resuelve aquí sin que el navegador haya recibido nada
        // todavía — así se puede pasar limpiamente al siguiente proveedor
        // de la cadena en cualquiera de los dos casos.
        const primero = await iterator.next();
        if (primero.done || !primero.value) {
          console.warn(
            `[chat] ${provider.name} no entregó contenido tras ${Date.now() - providerStart}ms, probando siguiente proveedor`
          );
          continue;
        }

        committed = true;
        console.log(`[chat] Streaming con ${provider.name} (primer fragmento a los ${Date.now() - requestStart}ms)`);
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.status(200);
        res.write(primero.value);
        let totalCaracteres = primero.value.length;

        const limiteEmision = requestStart + MAX_STREAM_MS;
        for (;;) {
          if (Date.now() > limiteEmision) {
            console.warn('[chat] Límite de tiempo de streaming alcanzado; se cierra con lo generado hasta ahora');
            break;
          }
          const siguiente = await iterator.next();
          if (siguiente.done) break;
          res.write(siguiente.value);
          totalCaracteres += siguiente.value.length;
        }

        console.log(
          `[chat] Respuesta de ${provider.name} completada en ${Date.now() - requestStart}ms (${totalCaracteres} caracteres)`
        );
        return res.end();
      } catch (err) {
        console.warn(
          `[chat] ${provider.name} falló al conectar tras ${Date.now() - providerStart}ms: ` +
            String((err && err.message) || err).slice(0, 300)
        );
        // Se prueba el siguiente proveedor de la cadena. No se reintenta
        // este mismo: probar uno independiente es más rápido y más eficaz
        // que insistir con el que acaba de fallar.
      }
    }

    // Han fallado todos los proveedores configurados sin llegar a emitir
    // ningún contenido real.
    console.error(`[chat] Todos los proveedores de la cadena fallaron tras ${Date.now() - requestStart}ms`);
    return sendPlainText(
      res,
      200,
      'El asistente de IA no está respondiendo con normalidad ahora mismo. Inténtalo de nuevo en unos segundos, ' +
        'o contáctanos directamente en /contacto.'
    );
  } catch (error) {
    console.error('[chat] Error inesperado en /api/chat:', error);
    if (committed) {
      try {
        res.end();
      } catch (e) {
        /* la conexión ya se cerró por su cuenta */
      }
      return;
    }
    try {
      sendPlainText(res, 500, 'Ha ocurrido un error. Inténtalo de nuevo en unos segundos.');
    } catch (e) {
      /* las cabeceras ya se habían enviado por otra vía */
    }
  }
};
