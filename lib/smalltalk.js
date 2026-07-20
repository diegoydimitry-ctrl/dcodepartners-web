/**
 * Capa conversacional ligera: saludos, despedidas, agradecimientos y
 * preguntas de identidad ("¿quién eres?"). Se resuelven aquí, antes de
 * tocar la base de conocimiento, porque no son preguntas sobre la empresa
 * — son la gramática básica de cualquier conversación humana, y una
 * búsqueda léxica sobre contenido de marketing nunca va a "encontrar"
 * un saludo.
 *
 * Solo actúa cuando el mensaje ENTERO es smalltalk (regex ancladas con
 * ^...$). Si el usuario combina saludo + pregunta real ("Hola, ¿qué
 * hacéis?") no hace match aquí y el mensaje sigue su camino normal hacia
 * la recuperación de contenido.
 */

function normalize(s) {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[¡!¿?.,;:]+/g, '')
    .replace(/\s+/g, ' ');
}

const GREETING_RE = /^(hola+|holis|buenas|buenos dias|buenas tardes|buenas noches|hey|ey|hi|hello|que tal|como estas|como andas|un saludo)$/;
const FAREWELL_RE = /^(adios|hasta luego|hasta pronto|nos vemos|chao|bye|hasta la vista|me voy|hasta otra)$/;
const THANKS_RE = /^(gracias|muchas gracias|mil gracias|genial|perfecto|vale|ok|okay|de acuerdo|entendido|guay|estupendo|great|thanks)$/;
const IDENTITY_RE = /^(quien eres|que eres|eres un bot|eres una ia|eres humano|eres real|con quien hablo|eres una persona)$/;

function pick(options) {
  return options[Math.floor(Math.random() * options.length)];
}

const GREETING_REPLIES = [
  '¡Hola! ¿En qué puedo ayudarte? Puedo hablarte de nuestros servicios, del Método D-Code o de cómo dar el primer paso.',
  '¡Hola de nuevo! Cuéntame qué te gustaría saber sobre D-Code Partners.',
  '¡Hola! Dime qué te interesa — automatización, agentes de IA, precios, o cómo empezamos — y vamos al grano.',
];

const FAREWELL_REPLIES = [
  '¡Hasta pronto! Si quieres seguir hablando con el equipo, puedes [reservar una llamada gratuita](/contacto).',
  'Un placer. Aquí estaré si te surge alguna otra duda.',
];

const THANKS_REPLIES = [
  '¡De nada! ¿Hay algo más en lo que pueda ayudarte?',
  'Un placer. Si te surge otra duda, aquí estoy.',
];

const IDENTITY_REPLIES = [
  'Soy el asistente de IA de D-Code Partners. No soy un buscador genérico: estoy aquí para ayudarte a entender cómo automatizamos procesos, cómo funcionan nuestros agentes de IA y cómo podríamos ayudar a tu empresa. ¿Sobre qué te gustaría hablar?',
];

/**
 * @returns {string|null} la respuesta si el mensaje es smalltalk puro, o null.
 */
function detectSmalltalk(message) {
  const n = normalize(message);
  if (!n) return null;
  if (GREETING_RE.test(n)) return pick(GREETING_REPLIES);
  if (FAREWELL_RE.test(n)) return pick(FAREWELL_REPLIES);
  if (THANKS_RE.test(n)) return pick(THANKS_REPLIES);
  if (IDENTITY_RE.test(n)) return pick(IDENTITY_REPLIES);
  return null;
}

module.exports = { detectSmalltalk };
