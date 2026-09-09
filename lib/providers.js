/**
 * Registro de proveedores LLM para el asistente de IA, en modo streaming.
 *
 * AUD-DCP 08/09/2026 — INCIDENTE: el 08/09 Gemini devolvió "503 UNAVAILABLE:
 * This model is currently experiencing high demand" (confirmado en los logs
 * de runtime de Vercel, no una suposición). El endpoint ya no colgaba al
 * visitante — api/chat.js siempre respondía 200 — pero el mensaje de
 * recuperación incluía el texto crudo "estado 503" del proveedor, que es
 * exactamente lo que un visitante ve como "el chat da error 503". Esto
 * reescribe la resiliencia con dos cambios de fondo:
 *
 * 1. CADENA DE PROVEEDORES en vez de reintentar el mismo proveedor caído.
 *    Reintentar Gemini cuando Gemini entero está saturado rara vez ayuda
 *    dentro de un presupuesto de tiempo corto; probar un proveedor
 *    independiente (Anthropic) si está configurado sí lo hace. getProvider()
 *    se sustituye por getProviderChain(): la llama api/chat.js probando cada
 *    proveedor en orden hasta que uno responda con contenido real.
 * 2. STREAMING de verdad: cada proveedor expone stream(), un async
 *    generator que va devolviendo fragmentos de texto según llegan del
 *    modelo, en vez de esperar a la respuesta completa. api/chat.js reenvía
 *    esos fragmentos al navegador tal cual, así que el primer token visible
 *    llega en el momento en que el modelo empieza a responder, no cuando
 *    termina.
 *
 * Sin ninguna clave configurada, getProviderChain() devuelve un array
 * vacío y el endpoint cae en modo recuperación pura (ver api/chat.js). En
 * cuanto se añade una variable de entorno de API key en Vercel, el
 * proveedor correspondiente se activa solo, sin tocar el resto del código
 * ni el frontend — la clave nunca sale del servidor.
 *
 * Orden de la cadena (salvo que AI_PROVIDER fuerce uno): Gemini primero
 * (coste y latencia habitual mejores), Anthropic como red de seguridad si
 * Gemini falla o no está configurado.
 *
 * Para añadir un proveedor nuevo (OpenAI, Mistral, DeepSeek...): crear un
 * objeto { name, stream(systemPrompt, messages) } cuyo stream() sea un
 * async generator que vaya emitiendo fragmentos de texto (o lance si la
 * conexión falla), y añadirlo a ORDER/PROVIDERS/HAS_KEY más abajo.
 */

// Alias "-latest" en vez de una versión fija (p. ej. "gemini-2.5-flash"):
// Google retira versiones concretas de Gemini para claves/proyectos nuevos
// sin previo aviso (fallo real visto en producción: 404 NOT_FOUND,
// "This model models/gemini-2.5-flash is no longer available to new
// users"). El alias apunta siempre al modelo flash recomendado vigente,
// así que no vuelve a quedar obsoleto solo por el paso del tiempo.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';

// La clave de Gemini se configuró en Vercel como GEMINI_API_KEY3 (no el
// nombre "estándar" GEMINI_API_KEY) — se admite cualquiera de las dos para
// que renombrarla en el futuro tampoco rompa nada.
function getGeminiKey() {
  return process.env.GEMINI_API_KEY3 || process.env.GEMINI_API_KEY;
}

// Los modelos flash de Gemini pueden razonar internamente antes de
// responder ("thinking"), y esos tokens de pensamiento consumen del mismo
// presupuesto que maxOutputTokens — con un tope bajo, el modelo puede
// gastarlo entero pensando y devolver texto de respuesta vacío (fallo real
// visto en producción: "Respuesta vacía del proveedor Gemini"). Al no
// poder desactivar el razonamiento de forma fiable entre distintos
// modelos/alias (thinkingConfig probado y retirado: 400 INVALID_ARGUMENT
// con el alias gemini-flash-latest), el margen se cubre con un tope
// generoso en vez de perseguir qué modelo concreto lo admite cada vez.
const MAX_OUTPUT_TOKENS = 2048;

// Tiempo máximo para CONECTAR (recibir cabeceras / primer byte de la
// respuesta), no para generar la respuesta entera. Un 429/503 llega casi
// siempre en menos de 2s; si un proveedor tarda más que esto en arrancar,
// se abandona y se prueba el siguiente de la cadena en vez de seguir
// esperando al mismo. Deliberadamente sin reintento sobre el mismo
// proveedor: probar uno distinto es más rápido y más eficaz que reintentar
// uno que ya está saturado.
const CONNECT_TIMEOUT_MS = 6000;

// Salvaguarda del lado del streaming ya en marcha: si un proveedor se queda
// generando más de esto, se corta la emisión con lo que ya se ha mostrado
// en vez de arriesgar el límite de ejecución de la función serverless.
// MAX_OUTPUT_TOKENS a velocidad de un modelo flash/sonnet normal no debería
// acercarse a este límite nunca; es red de seguridad, no comportamiento
// esperado.
const MAX_STREAM_MS = 25000;

/**
 * fetch con tiempo máximo hasta que lleguen las cabeceras. Si se agota,
 * aborta y lanza. No cubre la lectura del cuerpo/stream: una vez llegan las
 * cabeceras, el tiempo que tarde en generarse el resto de la respuesta no
 * cuenta contra este límite.
 */
async function fetchConTimeout(url, opciones, timeoutMs) {
  const abortador = new AbortController();
  const temporizador = setTimeout(() => abortador.abort(), timeoutMs);
  try {
    return await fetch(url, Object.assign({}, opciones, { signal: abortador.signal }));
  } catch (err) {
    throw new Error(
      err && err.name === 'AbortError'
        ? `La conexión superó ${timeoutMs} ms y se abortó`
        : `Fallo de red: ${err && err.message ? err.message : err}`
    );
  } finally {
    clearTimeout(temporizador);
  }
}

/**
 * Parser mínimo de Server-Sent Events: lee el cuerpo de la respuesta por
 * trozos, reconstruye líneas completas (un chunk de red no respeta los
 * saltos de línea del SSE) y entrega a `extract` cada payload JSON de las
 * líneas "data: ...". `extract` decide qué significa ese payload para cada
 * proveedor (Gemini y Anthropic tienen formas distintas) y devuelve el
 * fragmento de texto que aporta, o cadena vacía si no aporta texto visible
 * (p. ej. eventos de control de Anthropic como message_start).
 */
async function* streamSSE(response, extract) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let salto;
      while ((salto = buffer.indexOf('\n')) >= 0) {
        const linea = buffer.slice(0, salto).replace(/\r$/, '');
        buffer = buffer.slice(salto + 1);
        if (!linea.startsWith('data:')) continue;
        const payload = linea.slice(5).trim();
        if (!payload || payload === '[DONE]') continue;
        let obj;
        try {
          obj = JSON.parse(payload);
        } catch (e) {
          continue; // línea de datos incompleta/malformada: se ignora, no se aborta el stream por ello
        }
        const texto = extract(obj);
        if (texto) yield texto;
      }
    }
  } finally {
    try {
      reader.releaseLock();
    } catch (e) {
      /* ya liberado o el stream terminó de forma anómala; no hay nada más que hacer */
    }
  }
}

function extractGeminiDelta(obj) {
  const candidato = obj.candidates && obj.candidates[0];
  const partes = candidato && candidato.content && candidato.content.parts;
  if (!partes) return '';
  return partes.map((p) => p.text || '').join('');
}

function extractAnthropicDelta(obj) {
  if (obj.type === 'content_block_delta' && obj.delta && obj.delta.type === 'text_delta') {
    return obj.delta.text || '';
  }
  return '';
}

const geminiProvider = {
  name: 'gemini',
  async *stream(systemPrompt, messages) {
    // Gemini usa 'model' donde el resto de proveedores usan 'assistant', y
    // exige que el primer turno sea 'user' (nuestro historial ya empieza
    // siempre así, ver sanitizeHistory en api/chat.js).
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // alt=sse: la API REST de Gemini solo emite streaming en formato
    // Server-Sent Events cuando se pide explícitamente por query param.
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse`;

    const response = await fetchConTimeout(
      url,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          // Cabecera, no query param: así la clave nunca queda en una URL
          // que pueda acabar en logs de acceso o cabeceras de referrer.
          'x-goog-api-key': getGeminiKey(),
        },
        body: JSON.stringify({
          // camelCase: la API REST de Gemini mapea los campos del proto a
          // camelCase en JSON — "system_instruction" en snake_case no es un
          // campo válido y la petición se rechaza.
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            maxOutputTokens: MAX_OUTPUT_TOKENS,
            temperature: 0.6,
          },
        }),
      },
      CONNECT_TIMEOUT_MS
    );

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`Gemini API respondió con estado ${response.status}: ${errorBody.slice(0, 300)}`);
    }

    yield* streamSSE(response, extractGeminiDelta);
  },
};

const anthropicProvider = {
  name: 'anthropic',
  async *stream(systemPrompt, messages) {
    const response = await fetchConTimeout(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: MAX_OUTPUT_TOKENS,
          system: systemPrompt,
          stream: true,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      },
      CONNECT_TIMEOUT_MS
    );

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`Anthropic API respondió con estado ${response.status}: ${errorBody.slice(0, 300)}`);
    }

    yield* streamSSE(response, extractAnthropicDelta);
  },
};

const ORDER = ['gemini', 'anthropic'];
const PROVIDERS = { gemini: geminiProvider, anthropic: anthropicProvider };
const HAS_KEY = { gemini: () => !!getGeminiKey(), anthropic: () => !!process.env.ANTHROPIC_API_KEY };

/**
 * Cadena de proveedores a probar en orden, ya filtrada a los que tienen
 * clave configurada. api/chat.js prueba cada uno hasta que alguno entregue
 * contenido real; si la lista está vacía, no hay ningún proveedor
 * configurado en este entorno.
 *
 * AI_PROVIDER=gemini|anthropic fuerza cuál va primero (para fijar uno
 * explícitamente durante una migración o una prueba), pero no excluye al
 * otro de la cadena: sigue disponible como red de seguridad si el forzado
 * falla y el otro tiene clave.
 */
function getProviderChain() {
  const forced = (process.env.AI_PROVIDER || '').toLowerCase().trim();
  const order = ORDER.slice();
  if (forced && order.includes(forced)) {
    order.splice(order.indexOf(forced), 1);
    order.unshift(forced);
  }
  return order.filter((name) => HAS_KEY[name]()).map((name) => PROVIDERS[name]);
}

// anthropicProvider y HAS_KEY se exportan además de getProviderChain SOLO
// para un diagnóstico puntual y reversible del proveedor de respaldo, de
// forma aislada (sin tocar /api/chat ni el comportamiento para visitantes
// reales). AUD-DCP 09/09/2026. Añadido puro: cero cambio de comportamiento
// para quien ya importaba getProviderChain/MAX_STREAM_MS.
module.exports = { getProviderChain, MAX_STREAM_MS, anthropicProvider, HAS_KEY };
