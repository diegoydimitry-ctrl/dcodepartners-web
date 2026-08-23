/**
 * Registro de proveedores LLM para el asistente de IA.
 *
 * Sin ninguna clave configurada, getProviderChain() devuelve [] y el
 * endpoint cae automáticamente en modo recuperación pura (ver
 * api/chat.js). En cuanto se añade una variable de entorno de API key en
 * Vercel, el proveedor correspondiente se activa solo, sin tocar el resto
 * del código ni el frontend — la clave nunca sale del servidor.
 *
 * Orden por defecto (sin forzar nada): Gemini, luego Anthropic como
 * segundo intento automático si Gemini falla — no solo como alternativa a
 * elegir manualmente. Para fijar uno explícitamente como único proveedor
 * (sin intento del otro), la variable AI_PROVIDER=gemini|anthropic manda
 * sobre ese orden y deja el resto fuera de la cadena.
 *
 * Cada llamada a un proveedor reintenta internamente en caso de fallo
 * transitorio (estado 503/429 del proveedor, timeout, error de red) — ver
 * withRetries() — porque ese es el fallo real más frecuente visto en
 * producción ("Gemini API respondió con estado 503... high demand...
 * usually temporary"). Si un proveedor agota sus reintentos, api/chat.js
 * pasa automáticamente al siguiente proveedor de la cadena antes de
 * rendirse y mostrar el mensaje honesto de error.
 *
 * Para añadir un proveedor nuevo (OpenAI, Mistral, DeepSeek...): crear un
 * objeto { name, generate(systemPrompt, messages) } que devuelva una
 * Promise<string> con la respuesta en texto/Markdown, registrarlo en
 * PROVIDERS/HAS_KEY, y añadirlo al orden por defecto en getProviderChain().
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

// Presupuesto de tiempo por intento HTTP individual. Sin este límite, un
// proveedor colgado deja la petición pendiente hasta el límite de la
// función serverless (fallo real visto en producción: una llamada a
// Gemini tardó 52s en fallar) — el usuario ve el indicador de "escribiendo"
// congelado ese tiempo entero antes de cualquier respuesta, lo que se
// percibe como "el chatbot no responde" aunque técnicamente sí acabe
// respondiendo. Con este tope, un intento colgado se corta y, si es
// reintentable, el siguiente intento (u otro proveedor) tiene margen para
// responder dentro de un tiempo total razonable.
const REQUEST_TIMEOUT_MS = 15_000;
const RETRY_DELAYS_MS = [400, 1200];

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Solo se reintenta lo que tiene sentido reintentar: 503 (sobrecarga
// temporal del proveedor — el propio mensaje de Google dice "usually
// temporary"), 429 (límite de tasa, no de cuota total) y fallos de
// red/timeout. Un 400 (petición mal formada) o 404 (modelo inexistente)
// fallarán exactamente igual en el siguiente intento — reintentarlos solo
// alarga la espera del usuario sin ninguna posibilidad real de éxito.
function isRetryableError(error) {
  if (error && error.name === 'AbortError') return true;
  const message = String((error && error.message) || error || '').toLowerCase();
  if (/estado 503/.test(message)) return true;
  if (/estado 429/.test(message)) return true;
  if (/econnreset|econnrefused|enotfound|etimedout|fetch failed|network/.test(message)) return true;
  return false;
}

async function withRetries(attemptFn, { maxAttempts = RETRY_DELAYS_MS.length + 1 } = {}) {
  let lastError;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      return await attemptFn();
    } catch (error) {
      lastError = error;
      const isLastAttempt = attempt === maxAttempts - 1;
      if (isLastAttempt || !isRetryableError(error)) throw error;
      await sleep(RETRY_DELAYS_MS[attempt] || RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1]);
    }
  }
  // Inalcanzable en la práctica (el bucle siempre retorna o lanza), pero
  // TypeScript/linters de otros proyectos esperan un camino de salida
  // explícito — y sirve de red de seguridad real si maxAttempts fuera 0.
  throw lastError;
}

async function callGeminiOnce(systemPrompt, messages) {
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
    }
  );

  if (!response.ok) {
    // El cuerpo del error de Google trae el motivo real (clave inválida,
    // modelo no encontrado, campo mal formado...) — se registra en el
    // log del servidor para poder diagnosticar sin exponerlo al cliente.
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
    // log del servidor y en providerErrorReason sin necesidad de acceder
    // a los logs de Vercel para diagnosticarlo.
    const finishReason = candidate && candidate.finishReason;
    throw new Error(`Respuesta vacía del proveedor Gemini (finishReason: ${finishReason || 'desconocido'})`);
  }
  return text;
}

const geminiProvider = {
  name: 'gemini',
  generate(systemPrompt, messages) {
    return withRetries(() => callGeminiOnce(systemPrompt, messages));
  },
};

async function callAnthropicOnce(systemPrompt, messages) {
  const response = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
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
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`Anthropic API respondió con estado ${response.status}: ${errorBody.slice(0, 500)}`);
  }

  const data = await response.json();
  const text = (data.content || [])
    .map((block) => (block && block.type === 'text' ? block.text : ''))
    .join('')
    .trim();

  if (!text) throw new Error('Respuesta vacía del proveedor Anthropic');
  return text;
}

const anthropicProvider = {
  name: 'anthropic',
  generate(systemPrompt, messages) {
    return withRetries(() => callAnthropicOnce(systemPrompt, messages));
  },
};

const PROVIDERS = { gemini: geminiProvider, anthropic: anthropicProvider };
const HAS_KEY = { gemini: () => !!getGeminiKey(), anthropic: () => !!process.env.ANTHROPIC_API_KEY };
const DEFAULT_ORDER = ['gemini', 'anthropic'];

/**
 * Devuelve la lista ordenada de proveedores disponibles a intentar, en
 * orden. api/chat.js recorre esta lista y pasa al siguiente solo si el
 * anterior agota sus propios reintentos — así un fallo de Gemini (que es
 * quien más tráfico real recibe) no deja al asistente sin respuesta si
 * Anthropic también está configurado.
 *
 * Con AI_PROVIDER forzado a uno concreto, la cadena tiene un único
 * elemento (o ninguno, si esa clave no está configurada) — forzar un
 * proveedor sigue significando "solo este", no "este primero".
 */
function getProviderChain() {
  const forced = (process.env.AI_PROVIDER || '').toLowerCase().trim();
  if (forced) {
    return PROVIDERS[forced] && HAS_KEY[forced]() ? [PROVIDERS[forced]] : [];
  }
  return DEFAULT_ORDER.filter((name) => HAS_KEY[name]()).map((name) => PROVIDERS[name]);
}

/** @deprecated usar getProviderChain(); se mantiene por compatibilidad. */
function getProvider() {
  return getProviderChain()[0] || null;
}

module.exports = { getProvider, getProviderChain };
