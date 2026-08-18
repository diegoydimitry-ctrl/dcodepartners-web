import type { Post } from "../schema/post";

/**
 * Lote de prueba del Post Engine: 3 piezas LinkedIn + 3 piezas Instagram
 * (Fases 26/37 del encargo). Mismo principio de Brand Safety que los vídeos:
 * ningún dato, cliente o resultado inventado.
 */

// ─────────────────────────────────────────────────────────────
// LINKEDIN — 1/3 — EDUCATIVO
// ─────────────────────────────────────────────────────────────
export const li_educational: Post = {
  postId: "post-li-edu-001",
  ideaId: "idea-li-edu-001",
  red: "LinkedIn",
  tipoPost: "framework",
  texto: `La mayoría de proyectos de "IA" en empresas fracasan antes de empezar. No por la tecnología. Por confundir dos cosas distintas:

Automatización → aplica una regla que ya conocemos. "Si llega esto, haz aquello." Rápida, barata, predecible.

Agente → decide qué hacer cuando la regla todavía no existe. Más caro, más lento de construir, y solo tiene sentido si el problema es realmente ambiguo.

El error más común que veo: empezar por un agente cuando el 80% del problema se resuelve con reglas simples.

Antes de escribir un solo prompt, tres preguntas:

1. ¿Puedo describir el proceso en 5 pasos fijos? → automatización.
2. ¿Cambia según el contexto de cada caso? → ahí empieza a tener sentido un agente.
3. ¿Nadie en el equipo sabe explicar por qué se hace así? → ese no es un problema técnico. Es un problema de proceso, y hay que resolverlo antes de automatizar nada.

No hace falta un agente de IA para automatizar. Hace falta claridad sobre qué se está automatizando.`,
  hashtags: ["#AutomatizacionIA", "#AgentesIA", "#Estrategia"],
  cta: "¿Cuál de las tres preguntas te cuesta más responder hoy?",
};

// ─────────────────────────────────────────────────────────────
// LINKEDIN — 2/3 — OPINIÓN
// ─────────────────────────────────────────────────────────────
export const li_opinion: Post = {
  postId: "post-li-opinion-002",
  ideaId: "idea-li-opinion-002",
  red: "LinkedIn",
  tipoPost: "opinion",
  texto: `Automatizar una mala operación no la arregla. La hace fallar más rápido, con menos testigos, y más difícil de depurar.

Lo he visto repetirse: un proceso que ya generaba fricción, quejas, o errores manuales se convierte en el primer candidato a "automatizar" — como si la velocidad fuera el problema.

No lo es. El problema es que nadie se ha sentado a rediseñar el proceso. Automatizarlo tal cual solo cambia quién comete el error: antes lo cometía una persona que podía darse cuenta a media tarea. Ahora lo comete un sistema que no se detiene hasta el final.

Antes de automatizar, hay una fase que casi nadie quiere pagar: diseñar → validar → estabilizar. Solo después, automatizar.

Es menos vistoso que enseñar un dashboard el primer mes. Pero es la diferencia entre un sistema que dura años y uno que hay que desmontar a los tres meses porque "algo no cuadra" y nadie sabe por qué.`,
  hashtags: ["#Automatizacion", "#GestionDeProcesos"],
  cta: "¿Estás automatizando un proceso, o solo acelerando un problema?",
};

// ─────────────────────────────────────────────────────────────
// LINKEDIN — 3/3 — STORYTELLING
// ─────────────────────────────────────────────────────────────
export const li_storytelling: Post = {
  postId: "post-li-story-003",
  ideaId: "idea-li-story-003",
  red: "LinkedIn",
  tipoPost: "storytelling",
  texto: `Una empresa (no la nombro, no hace falta) tenía el dato del cliente en tres sitios distintos: la hoja de cálculo del comercial, el correo de facturación, y las notas del chat interno.

Ningún sitio mentía a propósito. Simplemente, cada uno reflejaba el momento en que alguien lo había escrito. El comercial actualizaba su hoja los lunes. Facturación solo tocaba su correo cuando emitía la factura. El chat se llenaba de "oye, ¿al final quedamos en...?" que nadie volvía a consultar.

El síntoma visible era: "se nos escapan cosas." La causa real era otra: no había una sola fuente de verdad, así que técnicamente no se le escapaba nada a nadie — cada uno tenía razón con la información que tenía delante.

La solución no fue una herramienta nueva. Fue decidir, por escrito, cuál de los tres sitios manda. Todo lo demás pasó a ser una copia, no una fuente.

Meses después, la pregunta "¿al final quedamos en...?" seguía apareciendo. Pero ya no hacía falta reconstruir la respuesta desde cero — solo mirar el sitio que manda.`,
  hashtags: ["#GestionDeDatos", "#Operaciones"],
  cta: "¿Cuál es hoy el sitio que manda en tu equipo? ¿Lo sabe todo el mundo?",
};

// ─────────────────────────────────────────────────────────────
// INSTAGRAM — 1/3 — CARRUSEL
// ─────────────────────────────────────────────────────────────
export const ig_carousel: Post = {
  postId: "post-ig-carousel-001",
  ideaId: "idea-ig-carousel-001",
  red: "Instagram",
  tipoPost: "carrusel",
  texto:
    "4 preguntas que casi nadie se hace antes de automatizar un proceso. Guárdalo para la próxima vez que alguien diga \"vamos a automatizar esto\".",
  hashtags: ["#Automatizacion", "#PYME", "#Productividad"],
  cta: "Guarda este carrusel",
  slides: [
    {
      kicker: "ANTES DE AUTOMATIZAR",
      headline: "4 preguntas que casi nadie se hace",
      footerCta: "Desliza →",
    },
    {
      kicker: "1",
      headline: "¿El proceso funciona hoy sin la automatización?",
      body: "Si la respuesta es no, automatizar solo hace el fallo más rápido.",
    },
    {
      kicker: "2",
      headline: "¿Quién es el dueño del proceso?",
      body: "Sin una persona responsable, ninguna automatización sobrevive al primer cambio.",
    },
    {
      kicker: "3",
      headline: "¿Qué pasa si falla en silencio?",
      body: "Si nadie se entera, no está resuelto — solo está escondido.",
      tone: "danger",
    },
    {
      kicker: "4",
      headline: "¿Se puede revertir?",
      body: "La reversibilidad no es un extra. Es la base de automatizar con seguridad.",
      footerCta: "dcodepartners.com",
      tone: "positive",
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// INSTAGRAM — 2/3 — CAPTION (post visual único)
// ─────────────────────────────────────────────────────────────
export const ig_caption: Post = {
  postId: "post-ig-caption-002",
  ideaId: "idea-ig-caption-002",
  red: "Instagram",
  tipoPost: "caption",
  texto:
    "El proceso importa más que la herramienta.\n\nSe puede tener la IA más avanzada del mercado apuntando a un proceso mal diseñado — y lo único que se consigue es un error más rápido y más difícil de rastrear.\n\nPrimero el proceso. Después la herramienta.",
  hashtags: ["#Automatizacion", "#IA"],
  cta: "Comenta qué proceso te gustaría rediseñar antes de automatizar",
  slides: [
    {
      kicker: "OPINIÓN",
      headline: "El proceso importa más que la herramienta.",
      footerCta: "dcodepartners.com",
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// INSTAGRAM — 3/3 — POST CONCEPTUAL (microcontenido)
// ─────────────────────────────────────────────────────────────
export const ig_conceptual: Post = {
  postId: "post-ig-conceptual-003",
  ideaId: "idea-ig-conceptual-003",
  red: "Instagram",
  tipoPost: "post_visual",
  texto:
    "Automatizar no es eliminar personas. Es eliminar la parte del trabajo que nunca debió depender de una persona.",
  hashtags: ["#AutomatizacionIA"],
  cta: "Guarda si tu equipo necesita leer esto",
  slides: [
    {
      kicker: "MICROCONTENIDO",
      headline: "Automatizar no es eliminar personas.",
      body: "Es eliminar la parte del trabajo que nunca debió depender de una persona.",
      tone: "positive",
    },
  ],
};

export const testPosts: Post[] = [
  li_educational,
  li_opinion,
  li_storytelling,
  ig_carousel,
  ig_caption,
  ig_conceptual,
];
