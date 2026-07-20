/**
 * Reconoce quejas/problemas habituales ("pierdo mucho tiempo respondiendo
 * WhatsApp") y responde con una solución concreta + una pregunta de
 * seguimiento, en vez de limitarse a buscar un fragmento de la web. Cada
 * patrón exige una palabra de "dolor" (pierdo tiempo, no doy abasto...)
 * junto a una palabra de tema (WhatsApp, facturas...), para no disparar
 * con cualquier mención suelta del tema.
 */

function normalize(s) {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

// Regex en vez de subcadenas literales: "pierdo MUCHO tiempo" o "perdemos
// DEMASIADO tiempo" son tan habituales como la forma sin intensificador, y
// un simple .includes('pierdo tiempo') no las reconoce.
const PAIN_PATTERNS = [
  /pierdo (mucho |demasiado |bastante )?tiempo/, /perdemos (mucho |demasiado |bastante )?tiempo/,
  /no doy abasto/, /no damos abasto/,
  /se (me )?acumulan/, /se (me )?escapan/, /se (nos )?pierden/,
  /\ba mano\b/, /manualmente/, /no llego/, /no llegamos/, /satura/,
  /tardamos/, /tardo (mucho|demasiado)/, /nos cuesta/, /me cuesta/, /es un caos/,
  /un lio/, /un follon/, /repetitiv[oa]s?/,
];

function hasPain(n) {
  return PAIN_PATTERNS.some((p) => p.test(n));
}

const PATTERNS = [
  {
    topics: ['whatsapp', 'wasap', 'watsap'],
    solution:
      'Eso suele resolverse con un agente IA conectado a WhatsApp Business que responde automáticamente, cualifica clientes y deriva solo las conversaciones importantes.',
    followUp: '¿Actualmente utilizáis WhatsApp Business?',
  },
  {
    topics: ['email', 'correo', 'correos', 'bandeja de entrada', 'gmail', 'outlook'],
    solution:
      'Eso normalmente se automatiza con un sistema que clasifica y responde los correos repetitivos solo, y te deja únicamente los que de verdad necesitan tu criterio.',
    followUp: '¿Qué tipo de correos son los que más se acumulan — consultas de clientes, facturas, algo distinto?',
  },
  {
    topics: ['leads', 'clientes potenciales', 'contactos nuevos'],
    solution:
      'Eso suele pasar cuando el seguimiento depende de que alguien se acuerde de hacerlo a mano. Automatizando la captura y el seguimiento en tu CRM, cada lead avanza solo y no se escapa nadie.',
    followUp: '¿Ahora mismo usáis algún CRM, o lo lleváis en hojas de cálculo?',
  },
  {
    topics: ['facturas', 'documentos', 'excel', 'hojas de calculo', 'albaranes'],
    solution:
      'Ese tipo de trabajo con documentos se puede automatizar por completo: extracción de datos, clasificación y archivado sin que nadie lo teclee a mano.',
    followUp: '¿Qué documentos son los que más tiempo os quitan?',
  },
  {
    topics: ['atencion al cliente', 'soporte', 'consultas de clientes'],
    solution:
      'Eso es justo lo que resuelve un agente de IA: responde al instante, resuelve lo repetitivo por sí solo y solo pasa a una persona lo que de verdad lo necesita.',
    followUp: '¿Por qué canal os llegan más consultas — web, WhatsApp, email?',
  },
  {
    topics: ['reporting', 'informes', 'reportes'],
    solution:
      'Ese tipo de reporting se puede automatizar para que se genere solo, con los datos ya actualizados, en vez de montarlo a mano cada vez.',
    followUp: '¿Con qué frecuencia necesitáis ese informe?',
  },
];

/**
 * @returns {string|null} la respuesta si el mensaje describe un problema
 * reconocible, o null si no aplica.
 */
function matchProblemStatement(message) {
  const n = normalize(message);
  if (!hasPain(n)) return null;
  const pattern = PATTERNS.find((p) => p.topics.some((t) => n.includes(t)));
  if (!pattern) return null;
  return `${pattern.solution}\n\n${pattern.followUp}`;
}

module.exports = { matchProblemStatement };
