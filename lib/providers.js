/**
 * Registro de proveedores LLM para el asistente de IA.
 *
 * Sin ninguna clave configurada, getProviderChain() devuelve una lista vacía
 * y el endpoint cae en modo recuperación pura (ver api/chat.js). En cuanto
 * se añade una variable de entorno de API key en Vercel, el proveedor
 * correspondiente se activa solo, sin tocar el resto del código ni el
 * frontend — la clave nunca sale del servidor.
 *
 * Resiliencia ante fallos transitorios del proveedor (p. ej. Gemini
 * devolviendo 503 "high demand", visto en producción): cada proveedor
 * reintenta con backoff exponencial + jitter (withRetries) y un timeout por
 * intento (fetchWithTimeout) para no colgarse nunca — un fetch sin límite de
 * tiempo fue precisamente lo que causó, con el código anterior a este
 * cambio, un timeout real de plataforma a los 300s en /api/chat (ver
 * lib/providers.js — REQUEST_TIMEOUT_MS más abajo). Si el proveedor
 * principal agota sus reintentos, api/chat.js pasa al siguiente proveedor de
 * la cadena (getProviderChain()) en vez de fallar directamente.
 *
 * Rendimiento del camino feliz (auditoría 24/08/2026): un 429/cuota
 * agotada en el proveedor principal falla rápido y pasa al respaldo de
 * inmediato, sin gastar los 3 intentos + 2 backoffs completos en una
 * clave que no va a responder en milisegundos (ver isQuotaError/
 * withRetries más abajo) — antes de este cambio, cada petición con
 * Gemini agotado pagaba ese coste completo antes de llegar a Anthropic.
 *
 * Proveedor activo (por defecto, sin forzar nada): el primero cuya clave
 * esté configurada, en este orden — Gemini, luego Anthropic como respaldo.
 * Para fijar uno explícitamente (o para desactivar el respaldo con
 * intención), la variable AI_PROVIDER=gemini|anthropic manda sobre ese
 * orden y limita la cadena a un único proveedor.
 *
 * Para añadir un proveedor nuevo (OpenAI, Mistral, DeepSeek...): crear un
 * objeto { name, generate(systemPrompt, messages, options) } que devuelva
 * una Promise<string> con la respuesta en texto/Markdown, registrarlo en
 * PROVIDERS/HAS_KEY/DEFAULT_ORDER más abajo con su propia variable de
 * entorno de clave, sin tocar api/chat.js.
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
// modelos/alias (ver generate() más abajo), el margen se cubre aquí, con
// un tope generoso.
const MAX_OUTPUT_TOKENS = 2048;

// Cada intento a un proveedor se corta a los 12s: ni Gemini ni Anthropic
// deberían tardar tanto en un caso normal, y dejar un fetch sin límite es
// lo que produjo el timeout real de plataforma a los 300s (Vercel mata la
// función entera sin que el usuario reciba ninguna respuesta, ni siquiera
// un error). Un timeout por intento, corto y predecible, es justo lo que
// permite reintentar o pasar al siguiente proveedor dentro del presupuesto
// total del endpoint (ver DEADLINE_MS en api/chat.js).
const REQUEST_TIMEOUT_MS = 12_000;

// Backoff exponencial con jitter: 400ms, 1200ms de base entre intentos, con
// hasta un 30% de variación aleatoria para no sincronizar reintentos de
// varias peticiones concurrentes en ráfaga contra el mismo proveedor caído.
const RETRY_DELAYS_MS = [400, 1200];
const DEFAULT_MAX_ATTEMPTS = 3;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jitteredDelay(baseMs) {
  return Math.round(baseMs + Math.random() * baseMs * 0.3);
}

/**
 * Envuelve fetch con un timeout propio (AbortController). Si se pasa
 * outerSignal (el límite duro de todo el endpoint, ver api/chat.js), ambas
 * señales se combinan: lo que ocurra primero — el timeout de este intento o
 * el deadline global — aborta la petición. AbortSignal.any está disponible
 * desde Node 20.3, muy por debajo del runtime de Vercel.
 */
async function fetchWithTimeout(url, options, outerSignal) {
  const perAttempt = new AbortController();
  const timer = setTimeout(() => perAttempt.abort(), REQUEST_TIMEOUT_MS);
  const signal = outerSignal ? AbortSignal.any([perAttempt.signal, outerSignal]) : perAttempt.signal;
  try {
    return await fetch(url, { ...options, signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Solo se reintenta lo que tiene sentido reintentar: fallos transitorios
 * (5xx, 429, timeout/abort, errores de red). Un 400/401/403/404 es un fallo
 * permanente de esta petición — reintentarlo solo quema tiempo del
 * presupuesto total sin cambiar el resultado, así que se falla rápido y se
 * pasa al siguiente proveedor de la cadena (o al mensaje de error final).
 */
function isRetryableError(error) {
  if (error && error.name === 'AbortError') return true;
  const message = String((error && error.message) || error || '').toLowerCase();
  if (/estado 5\d\d/.test(message)) return true;
  if (/estado 429/.test(message)) return true;
  if (/econnrefused|enotfound|etimedout|fetch failed|network|abort/.test(message)) return true;
  return false;
}

// Mismo patrón que classifyError() en api/chat.js (que reutiliza esta
// función en vez de duplicar el regex): una cuota agotada (429,
// RESOURCE_EXHAUSTED) no es un fallo transitorio del servidor — es la
// clave la que está limitada, y ese límite no se levanta en los
// 400-1600ms de un backoff. Se distingue de un 5xx genérico porque la
// respuesta correcta es distinta: un 5xx puede merecer un reintento
// corto; un 429 debe pasar de inmediato al siguiente proveedor.
function isQuotaError(error) {
  const message = String((error && error.message) || error || '').toLowerCase();
  return /estado 429|resource_exhausted|quota|rate limit/.test(message);
}

/**
 * options.onAttempt(record), si se pasa, se llama tras cada intento
 * (éxito o fallo) con { attempt, durationMs, ok, errorMessage? } — permite
 * a api/chat.js registrar en el log del servidor el desglose real de cada
 * fase sin depender del panel de Vercel (auditoría de rendimiento,
 * 24/08/2026: sin logs de Vercel accesibles desde la sesión que investigó
 * la latencia, esto fue la única vía real de medir dónde se iba el tiempo).
 * Nunca se envía al cliente — solo alimenta console.log en api/chat.js.
 */
async function withRetries(attemptFn, options) {
  const maxAttempts = (options && options.maxAttempts) || DEFAULT_MAX_ATTEMPTS;
  const onAttempt = options && options.onAttempt;
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const attemptStart = Date.now();
    try {
      const result = await attemptFn();
      if (onAttempt) onAttempt({ attempt, durationMs: Date.now() - attemptStart, ok: true });
      return result;
    } catch (error) {
      const durationMs = Date.now() - attemptStart;
      lastError = error;
      if (onAttempt) {
        onAttempt({ attempt, durationMs, ok: false, errorMessage: String((error && error.message) || error).slice(0, 200) });
      }
      const outerAborted = options && options.outerSignal && options.outerSignal.aborted;
      const isLastAttempt = attempt === maxAttempts;
      // Fallo rápido en cuota agotada: reintentar la MISMA clave no puede
      // tener éxito en milisegundos, así que reintentarla solo resta
      // presupuesto de tiempo al siguiente proveedor de la cadena (ver
      // isQuotaError arriba). Evidencia real (auditoría de rendimiento):
      // con Gemini agotado, el patrón medido en producción antes de este
      // cambio ya mostraba fallos de cuota casi instantáneos por intento
      // (decenas-cientos de ms) — el coste real estaba en gastar los 3
      // intentos + 2 backoffs (hasta ~2s) en una clave que no iba a
      // responder, antes de llegar siquiera a probar el respaldo.
      const isQuota = isQuotaError(error);
      if (outerAborted || isLastAttempt || isQuota || !isRetryableError(error)) throw error;
      await sleep(jitteredDelay(RETRY_DELAYS_MS[Math.min(attempt - 1, RETRY_DELAYS_MS.length - 1)]));
    }
  }
  throw lastError;
}

const geminiProvider = {
  name: 'gemini',
  generate(systemPrompt, messages, options) {
    return withRetries(() => callGeminiOnce(systemPrompt, messages, options && options.outerSignal), options);
  },
};

async function callGeminiOnce(systemPrompt, messages, outerSignal) {
  // Gemini usa 'model' donde el resto de proveedores usan 'assistant', y
  // exige que el primer turno sea 'user' (nuestro historial ya empieza
  // siempre así, ver sanitizeHistory en api/chat.js).
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const response = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
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
        // camelCase en JSON (igual que generationConfig/maxOutputTokens
        // más abajo) — "system_instruction" en snake_case no es un campo
        // válido y la petición se rechaza.
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          temperature: 0.6,
          // thinkingConfig (desactivar el razonamiento oculto) se probó y
          // se quitó definitivamente: con GEMINI_MODEL apuntando al alias
          // "gemini-flash-latest", Google devolvía 400 INVALID_ARGUMENT
          // en cada petición — el modelo real detrás del alias no admite
          // ese campo tal cual, o no en ese rango. En vez de perseguir
          // qué modelo concreto lo soporta cada vez que Google cambia el
          // alias, se prioriza fiabilidad: sin thinkingConfig, y con
          // MAX_OUTPUT_TOKENS con margen de sobra para que, aunque el
          // modelo razone internamente, quede presupuesto para la
          // respuesta visible.
        },
      }),
    },
    outerSignal
  );

  if (!response.ok) {
    // El cuerpo del error de Google trae el motivo real (clave inválida,
    // modelo no encontrado, campo mal formado, sobrecarga...) — se
    // registra en el log del servidor para poder diagnosticar sin
    // exponerlo nunca al usuario final.
    const errorBody = await response.text().catch(() => '');
    throw new Error(`Gemini API respondió con estado ${response.status}: ${errorBody.slice(0, 500)}`);
  }

  const data = await response.json();
  const candidate = data.candidates && data.candidates[0];
  const parts = candidate && candidate.content && candidate.content.parts;
  const text = (parts || [])
    .map((p) => p.text || '')
    .join('')
    .trim();

  if (!text) {
    // finishReason (SAFETY, MAX_TOKENS, RECITATION...) es la pista real de
    // por qué no hay texto — se incluye en el error para que quede en el
    // log del servidor sin necesidad de acceder a los logs de Vercel para
    // diagnosticarlo.
    const finishReason = candidate && candidate.finishReason;
    throw new Error(`Respuesta vacía del proveedor Gemini (finishReason: ${finishReason || 'desconocido'})`);
  }
  return text;
}

const anthropicProvider = {
  name: 'anthropic',
  generate(systemPrompt, messages, options) {
    return withRetries(() => callAnthropicOnce(systemPrompt, messages, options && options.outerSignal), options);
  },
};

async function callAnthropicOnce(systemPrompt, messages, outerSignal) {
  const response = await fetchWithTimeout(
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
        // Como proveedor de respaldo, cada segundo cuenta dentro del
        // presupuesto total del endpoint: desactivar el razonamiento
        // extendido evita gastar tiempo/tokens pensando quando solo se
        // necesita la respuesta directa. cache_control marca el system
        // prompt (que incluye todo el contenido del sitio) como cacheable
        // entre peticiones — reduce coste y latencia si Anthropic ya lo
        // vio recientemente en otra petición.
        thinking: { type: 'disabled' },
        system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    },
    outerSignal
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`Anthropic API respondió con estado ${response.status}: ${errorBody.slice(0, 500)}`);
  }

  const data = await response.json();
  const text = (data.content || [])
    .map((block) => (block && block.type === 'text' ? block.text : ''))
    .join('')
    .trim();

  if (!text) {
    throw new Error(`Respuesta vacía del proveedor Anthropic (stop_reason: ${data.stop_reason || 'desconocido'})`);
  }
  return text;
}

const PROVIDERS = { gemini: geminiProvider, anthropic: anthropicProvider };
const HAS_KEY = { gemini: () => !!getGeminiKey(), anthropic: () => !!process.env.ANTHROPIC_API_KEY };
const DEFAULT_ORDER = ['gemini', 'anthropic'];

/**
 * Devuelve la cadena ordenada de proveedores realmente disponibles (con
 * clave configurada). api/chat.js prueba cada uno en orden, con reintentos
 * completos solo en el primero — los siguientes son respaldo de un solo
 * intento, para no agotar el presupuesto total de la petición (ver
 * DEADLINE_MS en api/chat.js). Si ANTHROPIC_API_KEY no está configurada en
 * Vercel, la cadena tiene un único elemento (Gemini) y el respaldo
 * simplemente no se activa — la arquitectura queda lista para cuando se
 * añada la clave, sin tocar código.
 */
function getProviderChain() {
  const forced = (process.env.AI_PROVIDER || '').toLowerCase().trim();
  if (forced && PROVIDERS[forced]) {
    return HAS_KEY[forced]() ? [PROVIDERS[forced]] : [];
  }
  return DEFAULT_ORDER.filter((name) => HAS_KEY[name]()).map((name) => PROVIDERS[name]);
}

// Shim de compatibilidad: algún código o test antiguo puede seguir
// esperando un único proveedor. Nuevo código debe usar getProviderChain().
function getProvider() {
  return getProviderChain()[0] || null;
}

module.exports = { getProvider, getProviderChain, isRetryableError, isQuotaError, REQUEST_TIMEOUT_MS };
