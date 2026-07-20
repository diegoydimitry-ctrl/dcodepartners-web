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
// Preguntas personales dirigidas al asistente como si fuera una persona: no
// tienen respuesta real (un modelo no tiene edad ni ciudad de origen) y,
// sin este filtro, palabras sueltas como "años" o "vienes" pueden coincidir
// por casualidad con contenido real de la web (p. ej. "veinte años de
// trayectoria") y devolver una respuesta con pinta de correcta pero absurda.
const PERSONAL_RE =
  /^(cuantos anos tienes|que edad tienes|cuantos anos tenes|de donde eres|de donde vienes|donde vives|donde naciste|como te llamas|cual es tu nombre|tienes nombre|tienes novia|tienes novio|tienes pareja|eres casado|eres soltero|tienes familia|cual es tu color favorito|tienes sentimientos|me quieres|te gusto)$/;

function pick(options) {
  return options[Math.floor(Math.random() * options.length)];
}

const GREETING_REPLIES = [
  '¡Hola! Encantado de ayudarte.\n\n¿Quieres automatizar algún proceso, montar un agente de IA, o tienes alguna duda?',
  '¡Hola! ¿En qué puedo ayudarte hoy? Puedo hablarte de automatización, agentes de IA, o resolver dudas sobre D-Code.',
  '¡Hola! Cuéntame qué tienes en mente — automatizar algo, un agente de IA, o simplemente curiosidad.',
];

const FAREWELL_REPLIES = [
  '¡Hasta pronto! Si te animas, puedes [reservar una llamada gratuita](/contacto) cuando quieras.',
  'Un placer. Aquí estaré si te surge alguna otra duda.',
];

const THANKS_REPLIES = [
  '¡De nada! ¿Hay algo más en lo que pueda ayudarte?',
  'Un placer. Si te surge otra duda, aquí estoy.',
];

const IDENTITY_REPLIES = [
  'Soy el asistente de D-Code Partners — estoy aquí para ayudarte con automatización, agentes de IA, o cualquier duda sobre cómo trabajamos. ¿Qué tienes en mente?',
];

const PERSONAL_REPLIES = [
  'Soy una IA, así que no tengo edad ni ciudad de origen — pero sí puedo ayudarte con dudas sobre automatización o D-Code Partners. ¿Qué te gustaría saber?',
  'Ja, buena pregunta, pero soy un asistente virtual — sin años ni dirección postal. ¿En qué te puedo ayudar de verdad?',
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
  if (PERSONAL_RE.test(n)) return pick(PERSONAL_REPLIES);
  if (IDENTITY_RE.test(n)) return pick(IDENTITY_REPLIES);
  return null;
}

module.exports = { detectSmalltalk };
