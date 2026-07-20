/**
 * Registro de proveedores LLM para el asistente de IA.
 *
 * Sin ninguna clave configurada, getProvider() devuelve null y el endpoint
 * cae automáticamente en modo recuperación pura (ver api/chat.js). En cuanto
 * se añade una variable de entorno de API key en Vercel, el proveedor
 * correspondiente se activa solo, sin tocar el resto del código.
 *
 * Para añadir un proveedor nuevo (OpenAI, Gemini, Mistral, DeepSeek...):
 * crear un objeto { name, generate(systemPrompt, messages) } que devuelva
 * una Promise<string> con la respuesta en texto/Markdown, y registrarlo en
 * getProvider() con su propia variable de entorno de clave.
 */

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';

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
        max_tokens: 700,
        system: systemPrompt,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API respondió con estado ${response.status}`);
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

function getProvider() {
  if (process.env.ANTHROPIC_API_KEY) return anthropicProvider;
  return null;
}

module.exports = { getProvider };
