/**
 * Registro de proveedores LLM para el asistente de IA.
 *
 * Sin ninguna clave configurada, getProvider() devuelve null y el endpoint
 * cae automáticamente en modo recuperación pura (ver api/chat.js). En cuanto
 * se añade una variable de entorno de API key en Vercel, el proveedor
 * correspondiente se activa solo, sin tocar el resto del código ni el
 * frontend — la clave nunca sale del servidor.
 *
 * Proveedor activo (por defecto, sin forzar nada): el primero cuya clave
 * esté configurada, en este orden — Gemini, luego Anthropic. Para fijar uno
 * explícitamente (o cuando hay varias claves a la vez y se quiere control
 * total), la variable AI_PROVIDER=gemini|anthropic manda sobre ese orden.
 *
 * Para añadir un proveedor nuevo (OpenAI, Mistral, DeepSeek...): crear un
 * objeto { name, generate(systemPrompt, messages) } que devuelva una
 * Promise<string> con la respuesta en texto/Markdown, y registrarlo en
 * getProvider() con su propia variable de entorno de clave.
 */

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';

// La clave de Gemini se configuró en Vercel como GEMINI_API_KEY3 (no el
// nombre "estándar" GEMINI_API_KEY) — se admite cualquiera de las dos para
// que renombrarla en el futuro tampoco rompa nada.
function getGeminiKey() {
  return process.env.GEMINI_API_KEY3 || process.env.GEMINI_API_KEY;
}

// Tope de tokens de salida bajo a propósito: el system prompt ya exige
// respuestas de 4-5 líneas, así que no hace falta presupuesto para
// respuestas largas — esto ahorra coste y latencia en cada mensaje.
const MAX_OUTPUT_TOKENS = 350;

const geminiProvider = {
  name: 'gemini',
  async generate(systemPrompt, messages) {
    // Gemini usa 'model' donde el resto de proveedores usan 'assistant', y
    // exige que el primer turno sea 'user' (nuestro historial ya empieza
    // siempre así, ver sanitizeHistory en api/chat.js).
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
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
            // Sin "thinking": para respuestas cortas de 4-5 líneas no hace
            // falta razonamiento extendido, y desactivarlo ahorra tokens
            // (y coste) en cada mensaje sin perder calidad perceptible.
            thinkingConfig: { thinkingBudget: 0 },
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

    if (!text) throw new Error('Respuesta vacía del proveedor Gemini');
    return text;
  },
};

const anthropicProvider = {
  name: 'anthropic',
  async generate(systemPrompt, messages) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
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
  },
};

const PROVIDERS = { gemini: geminiProvider, anthropic: anthropicProvider };
const HAS_KEY = { gemini: () => !!getGeminiKey(), anthropic: () => !!process.env.ANTHROPIC_API_KEY };

function getProvider() {
  const forced = (process.env.AI_PROVIDER || '').toLowerCase().trim();
  if (forced && PROVIDERS[forced] && HAS_KEY[forced]()) return PROVIDERS[forced];

  // Sin forzar un proveedor: Gemini es el principal actual, con Anthropic
  // como alternativa si algún día se prefiere cambiar sin tocar código.
  if (HAS_KEY.gemini()) return geminiProvider;
  if (HAS_KEY.anthropic()) return anthropicProvider;
  return null;
}

module.exports = { getProvider };
