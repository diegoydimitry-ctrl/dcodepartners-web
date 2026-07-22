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

// gemini-2.5-flash tiene el "razonamiento" (thinking) activado por defecto,
// y esos tokens de pensamiento internos consumen del mismo presupuesto que
// maxOutputTokens — con un tope bajo, el modelo puede gastarlo entero en
// razonar y devolver texto de respuesta vacío (justo el fallo que se vio en
// producción: "Respuesta vacía del proveedor Gemini"). thinkingBudget: 0
// desactiva ese razonamiento oculto (soportado en gemini-2.5-flash), así
// que este tope ya solo tiene que cubrir la respuesta visible.
const MAX_OUTPUT_TOKENS = 1024;

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
            // Desactiva el razonamiento oculto de gemini-2.5-flash: sin
            // esto, el modelo puede gastar el presupuesto de tokens
            // pensando y devolver texto de respuesta vacío (el fallo real
            // visto en producción). thinkingBudget: 0 está soportado en
            // gemini-2.5-flash y gemini-2.5-flash-lite (no en -pro, que
            // exige un mínimo) — si en el futuro se cambia GEMINI_MODEL a
            // un modelo -pro, este campo habría que ajustarlo o quitarlo.
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

    if (!text) {
      // finishReason (SAFETY, MAX_TOKENS, RECITATION...) es la pista real de
      // por qué no hay texto — se incluye en el error para que quede en el
      // log del servidor y en providerErrorReason sin necesidad de acceder
      // a los logs de Vercel para diagnosticarlo.
      const finishReason = candidate && candidate.finishReason;
      throw new Error(`Respuesta vacía del proveedor Gemini (finishReason: ${finishReason || 'desconocido'})`);
    }
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
