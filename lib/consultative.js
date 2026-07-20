/**
 * Flujo consultivo ligero: cuando el mensaje muestra intención comercial
 * clara ("quiero automatizar", "uso HubSpot"...), en vez de devolver un
 * fragmento de la base de conocimiento se hacen un par de preguntas de
 * diagnóstico, como haría un consultor real antes de proponer nada.
 * Nunca más de dos preguntas — el objetivo es aportar valor, no interrogar.
 *
 * Al ser una función serverless sin estado, el "en qué punto del flujo
 * estamos" se deduce del propio historial que manda el cliente: si el
 * último mensaje del asistente fue una de nuestras preguntas de
 * diagnóstico, este mensaje del usuario es la respuesta a esa pregunta.
 */

function normalize(s) {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function pick(options) {
  return options[Math.floor(Math.random() * options.length)];
}

const INTENT_PATTERNS = [
  'quiero automatizar', 'quiero ahorrar tiempo', 'quiero un chatbot',
  'quiero integrar', 'quiero conectar', 'quiero un agente', 'quiero agentes',
  'necesito automatizar', 'necesito un agente', 'necesito un chatbot',
  'necesito integrar',
  'uso hubspot', 'uso odoo', 'uso holded', 'uso whatsapp',
  'usamos hubspot', 'usamos odoo', 'usamos holded', 'usamos whatsapp',
];

function detectCommercialIntent(message) {
  const n = normalize(message);
  return INTENT_PATTERNS.some((p) => n.includes(p));
}

const QUESTIONS = [
  '¿A qué se dedica tu empresa?',
  '¿Qué proceso te gustaría automatizar, y qué herramientas usáis ahora mismo para eso?',
];

// Importante: todas las variantes deben terminar EXACTAMENTE en QUESTIONS[0]
// (mismas mayúsculas incluidas) — findAskedIndex() usa endsWith() para saber
// en qué punto del flujo estamos, y una versión en minúsculas rompería esa
// comprobación.
const INTRO_REPLIES = [
  `Perfecto, vamos a verlo. ${QUESTIONS[0]}`,
  `Buena decisión, vamos por partes. ${QUESTIONS[0]}`,
];

const TRANSITIONS = ['Entiendo.', 'Perfecto.', 'Genial, eso ayuda.', 'Tiene sentido.'];

const CLOSING_REPLY =
  'Con eso ya me hago una idea. Lo normal en estos casos es diseñar un sistema a medida — automatización, un agente de IA, o ambos — y probarlo un mes sin coste antes de comprometerte a nada.\n\n' +
  '¿Vemos los detalles en una llamada de 30 minutos? [Resérvala aquí](/contacto).';

// Las preguntas se envuelven en frases naturales ("Perfecto, vamos a
// verlo. ¿A qué se dedica tu empresa?"), así que nunca coinciden por
// igualdad exacta con QUESTIONS[i] — se busca con endsWith, ya que todas
// las variantes se construyen terminando literalmente en esa pregunta.
function findAskedIndex(history) {
  const lastAssistant = [...history].reverse().find((m) => m.role === 'assistant');
  if (!lastAssistant) return -1;
  return QUESTIONS.findIndex((q) => lastAssistant.content.endsWith(q));
}

function isAwaitingConsultativeAnswer(history) {
  return findAskedIndex(history) !== -1;
}

/**
 * @returns {string|null} el mensaje del asistente si toca activar o
 * continuar el flujo consultivo, o null si debe seguir el camino normal.
 */
function handleConsultativeFlow(message, history) {
  const askedIndex = findAskedIndex(history);

  if (askedIndex !== -1) {
    const nextIndex = askedIndex + 1;
    if (nextIndex < QUESTIONS.length) {
      return `${pick(TRANSITIONS)} ${QUESTIONS[nextIndex]}`;
    }
    return CLOSING_REPLY;
  }

  if (detectCommercialIntent(message)) {
    return pick(INTRO_REPLIES);
  }

  return null;
}

module.exports = { handleConsultativeFlow, detectCommercialIntent, isAwaitingConsultativeAnswer };
