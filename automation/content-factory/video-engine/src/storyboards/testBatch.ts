import type { Storyboard } from "../schema/storyboard";
import { colors } from "../brand/tokens";

/**
 * Lote de prueba (Fase 12 del encargo): 3 conceptos distintos + 1 adaptación
 * de red adicional para demostrar que "adaptar a cada red" es real, no un
 * simple cambio de proporción. Ningún dato, cliente, cifra o logo es real —
 * ver Brand Safety. El vídeo 3 lo declara explícitamente como parte del guion.
 */

// ─────────────────────────────────────────────────────────────
// VIDEO 1 — EDUCATIVO — "Automatización vs Agente IA" — Instagram Reels
// ─────────────────────────────────────────────────────────────
export const video1_educational: Storyboard = {
  videoId: "test-edu-001",
  scriptId: "script-edu-001",
  title: "Automatización vs Agente IA",
  pilar: "IA aplicada",
  tipo: "EDUCATIONAL",
  formato: "reel",
  fps: 30,
  scenes: [
    {
      type: "title",
      durationInFrames: 75,
      props: {
        lines: ["La automatización", "y un agente de IA", "no son lo mismo."],
        emphasisIndex: 1,
      },
    },
    {
      type: "uiList",
      durationInFrames: 90,
      soundCue: "blip",
      props: {
        items: [
          { title: "Llega un email de factura", subtitle: "→ Guardar en Finanzas", badgeColor: colors.accentBlue },
          { title: "Se envía el formulario", subtitle: "→ Crear el lead", badgeColor: colors.accentBlue },
          { title: "Pasan 3 días sin respuesta", subtitle: "→ Enviar seguimiento", badgeColor: colors.accentBlue },
        ],
      },
    },
    {
      type: "title",
      durationInFrames: 60,
      props: { lines: ["Eso es automatización:", "reglas fijas."], size: 46 },
    },
    {
      type: "network",
      durationInFrames: 90,
      soundCue: "whoosh",
      props: { nodes: ["EMAIL", "CRM", "CALENDARIO", "DOCUMENTOS"] },
    },
    {
      type: "title",
      durationInFrames: 90,
      props: {
        lines: ["Un agente de IA decide", "qué regla no existía", "todavía."],
        emphasisIndex: 2,
      },
    },
    {
      type: "caption",
      durationInFrames: 75,
      props: { text: "No es magia. Es criterio aplicado a datos reales." },
    },
    {
      type: "endcard",
      durationInFrames: 90,
      props: {
        valueProp: "Automatizamos lo que no debería depender de ti.",
        cta: "¿Automatización o agente? Te ayudamos a elegir.",
      },
    },
  ],
  caption: {
    headline: "Automatización vs Agente IA: la diferencia que nadie te explica",
    body:
      "Automatizar es aplicar una regla fija. Un agente de IA decide qué hacer cuando la regla todavía no existe. Confundir los dos términos es la razón por la que muchos proyectos de \"IA\" en empresas fracasan antes de empezar.",
    hashtags: ["#AutomatizacionIA", "#AgentesIA", "#PYME"],
  },
  // AUDIO — familia A (música + efectos): cama "educational" (ritmo limpio,
  // sin percusión dura) + blip/whoosh sincronizados a los reveals de UI y
  // diagrama. Sin voz — el texto en pantalla ya lleva la carga informativa.
  audio: {
    familia: "educational",
    bedVolume: 0.32,
    voice: null,
  },
};

// ─────────────────────────────────────────────────────────────
// VIDEO 2 — PROBLEMA EMPRESARIAL — "FINAL_definitivo.xlsx" — LinkedIn 16:9
// (versión larga, contextual, "pensamiento/autoridad")
// ─────────────────────────────────────────────────────────────
export const video2_painpoint_linkedin: Storyboard = {
  videoId: "test-pain-002-li",
  scriptId: "script-pain-002",
  title: "El problema no es el archivo",
  pilar: "Procesos manuales",
  tipo: "OPINION",
  formato: "linkedinWide",
  fps: 30,
  scenes: [
    {
      type: "title",
      durationInFrames: 90,
      props: {
        lines: ['¿Cuántas veces has abierto', 'un archivo llamado', '"FINAL_definitivo_v3"?'],
      },
    },
    {
      type: "uiList",
      durationInFrames: 105,
      props: {
        items: [
          { title: "presupuesto_FINAL.xlsx", meta: "hace 3 meses" },
          { title: "presupuesto_FINAL_v2.xlsx", meta: "hace 6 semanas" },
          { title: "presupuesto_FINAL_AHORA_SI.xlsx", meta: "ayer" },
          { title: "presupuesto_FINAL_AHORA_SI_bueno.xlsx", meta: "hace 4 min" },
        ],
      },
    },
    {
      type: "title",
      durationInFrames: 90,
      soundCue: "impact",
      props: {
        lines: ["El problema no es el archivo.", "Es que nadie sabe cuál es la verdad."],
        emphasisIndex: 1,
        size: 48,
      },
    },
    {
      type: "network",
      durationInFrames: 75,
      soundCue: "whoosh",
      props: { nodes: ["EXCEL", "EMAIL", "WHATSAPP", "DRIVE"] },
    },
    {
      type: "title",
      durationInFrames: 90,
      props: { lines: ["Cuando un dato vive en 4 sitios,", "no vive en ninguno."], size: 46 },
    },
    {
      type: "caption",
      durationInFrames: 90,
      props: {
        text: "Esto no se arregla con más disciplina. Se arregla con un solo sitio que manda.",
      },
    },
    {
      type: "endcard",
      durationInFrames: 90,
      props: {
        valueProp: "Centralizamos el dato antes de automatizar el proceso.",
        cta: "¿Dónde vive hoy la verdad en tu empresa?",
      },
    },
  ],
  caption: {
    headline: 'El archivo "FINAL_definitivo_v3.xlsx" no es el problema',
    body:
      "Cuando un mismo dato vive en Excel, en el correo y en un chat de WhatsApp a la vez, ya no es un problema de orden — es un problema de que nadie puede confiar en el número que tiene delante. Antes de automatizar nada, hay que decidir cuál es la fuente de verdad.",
    hashtags: ["#GestionDatos", "#PYME", "#Operaciones"],
  },
  // AUDIO — familia A (música + efectos), cama "problem" (tensión sutil) +
  // impact en el reveal del problema real + whoosh en el diagrama de
  // sistemas dispersos. Distinta familia sonora que el vídeo educativo
  // — nunca la misma música para conceptos distintos.
  audio: {
    familia: "problem",
    bedVolume: 0.3,
    voice: null,
  },
};

// Misma idea, cortada para Instagram: hook más rápido, sin el diagrama de
// sistemas (exige más lectura de la que un scroll de Reels perdona), cierre
// antes. Esto es lo que el encargo pide como "adaptación real", no un simple
// cambio de proporción.
export const video2_painpoint_reel: Storyboard = {
  ...video2_painpoint_linkedin,
  videoId: "test-pain-002-ig",
  formato: "reel",
  scenes: [
    {
      type: "title",
      durationInFrames: 60,
      props: { lines: ['"FINAL_definitivo_v3.xlsx"'], size: 50 },
    },
    {
      type: "uiList",
      durationInFrames: 75,
      props: {
        items: [
          { title: "presupuesto_FINAL.xlsx", meta: "hace 3 meses" },
          { title: "presupuesto_FINAL_v2.xlsx", meta: "hace 6 sem" },
          { title: "..._AHORA_SI_bueno.xlsx", meta: "hace 4 min" },
        ],
      },
    },
    {
      type: "title",
      durationInFrames: 75,
      soundCue: "impact",
      props: {
        lines: ["El problema no es el archivo.", "Es que nadie sabe cuál manda."],
        emphasisIndex: 1,
        size: 44,
      },
    },
    {
      type: "caption",
      durationInFrames: 75,
      props: { text: "Un dato en 4 sitios no vive en ninguno." },
    },
    {
      type: "endcard",
      durationInFrames: 90,
      props: {
        valueProp: "Centralizamos el dato antes de automatizar el proceso.",
        cta: "¿Dónde vive hoy la verdad en tu empresa?",
      },
    },
  ],
  caption: {
    headline: "¿Tienes un archivo \"FINAL_definitivo\"? Ese no es el problema.",
    body:
      "El problema es que nadie sabe cuál manda. Antes de automatizar, hay que decidir la fuente de verdad.",
    hashtags: ["#PYME", "#Automatizacion"],
  },
};

// ─────────────────────────────────────────────────────────────
// VIDEO 3 — OPINIÓN / STORYTELLING — Brand safety como argumento — Reels
// ─────────────────────────────────────────────────────────────
export const video3_opinion: Storyboard = {
  videoId: "test-opinion-003",
  scriptId: "script-opinion-003",
  title: "La mayoría del contenido de IA sobre negocios es mentira",
  pilar: "Mitos sobre IA",
  tipo: "OPINION",
  formato: "reel",
  fps: 30,
  scenes: [
    {
      type: "title",
      durationInFrames: 90,
      props: {
        lines: ["La mayoría del contenido", "de IA sobre negocios...", "es mentira."],
        emphasisIndex: 2,
      },
    },
    {
      type: "stat",
      durationInFrames: 75,
      props: { value: "0", label: "clientes inventados en este vídeo", tone: "positive" },
    },
    {
      type: "stat",
      durationInFrames: 75,
      props: { value: "0", label: "cifras que no podamos demostrar", tone: "positive" },
    },
    {
      type: "title",
      durationInFrames: 75,
      soundCue: "riser",
      props: { lines: ["No es una promesa vacía.", "Es una regla de diseño."], size: 48 },
    },
    {
      type: "uiList",
      durationInFrames: 90,
      props: {
        items: [
          { title: "¿Se puede verificar?", checked: true },
          { title: "¿El ejemplo está marcado como ejemplo?", checked: true },
          { title: "¿Inventa un resultado?", checked: false },
        ],
      },
    },
    {
      type: "title",
      durationInFrames: 75,
      props: { lines: ["Si no pasa esto,", "no lo publicamos."], emphasisIndex: 1, size: 50 },
    },
    {
      type: "endcard",
      durationInFrames: 90,
      soundCue: "soft-close",
      props: {
        valueProp: "Preferimos un vídeo honesto a diez vídeos que prometen de más.",
        cta: "Así construimos, dentro y fuera.",
      },
    },
  ],
  caption: {
    headline: "Por qué no vas a ver testimonios falsos en nuestro contenido",
    body:
      "Antes de publicar cualquier pieza nos hacemos 3 preguntas: ¿se puede verificar?, ¿el ejemplo está marcado como ejemplo?, ¿inventa un resultado? Si falla una, no sale. Así tratamos el contenido — y así construimos los sistemas.",
    hashtags: ["#IAResponsable", "#BrandSafety"],
  },
  // AUDIO — familia B (voz + música): cama "opinion" (sonido contenido, deja
  // espacio) a volumen bajo + locución TTS (espeak-ng, calidad robótica
  // reconocida — ver scripts/generate-tts.sh) leyendo el hook y el cierre
  // conceptual. Se elige voz aquí porque la pieza ES un argumento hablado
  // ("regla de diseño"), no porque toque por turno.
  audio: {
    familia: "opinion",
    bedVolume: 0.16,
    voice: {
      texto:
        "La mayoria del contenido de inteligencia artificial sobre negocios es mentira. No es una promesa vacia. Es una regla de diseno.",
      archivo: "audio/voice/test-opinion-003.wav",
    },
  },
};

// ─────────────────────────────────────────────────────────────
// VIDEO 4 — CONTRASTE / MINIMALISTA — audio familia C (efectos + silencios)
// ─────────────────────────────────────────────────────────────
export const video4_minimalist: Storyboard = {
  videoId: "test-minimal-004",
  scriptId: "script-minimal-004",
  title: "40 pestañas para responder a un cliente",
  pilar: "Contrastes antes/después",
  tipo: "EDUCATIONAL",
  formato: "reel",
  fps: 30,
  scenes: [
    {
      type: "title",
      durationInFrames: 75,
      props: {
        lines: ["Antes:", "revisar 12 pestañas", "para responder a un cliente."],
        emphasisIndex: 1,
      },
    },
    {
      type: "caption",
      durationInFrames: 60,
      soundCue: "whoosh",
      props: { text: "Ahora: una sola pantalla." },
    },
    {
      type: "uiList",
      durationInFrames: 90,
      soundCue: "blip",
      props: {
        items: [
          { title: "Historial del cliente", checked: true },
          { title: "Última factura", checked: true },
          { title: "Estado del proyecto", checked: true },
        ],
      },
    },
    {
      type: "title",
      durationInFrames: 90,
      props: {
        lines: ["La diferencia no es la tecnología.", "Es dejar de repetir el mismo clic 40 veces."],
        size: 44,
      },
    },
    {
      type: "endcard",
      durationInFrames: 90,
      soundCue: "soft-close",
      props: {
        valueProp: "Menos pestañas. La misma respuesta, en un sitio.",
        cta: "¿Cuántas pestañas abres tú para responder a un cliente?",
      },
    },
  ],
  caption: {
    headline: "¿Cuántas pestañas abres para responder a un cliente?",
    body:
      "El coste real no es la falta de tecnología — es repetir el mismo clic decenas de veces al día. Centralizar la información del cliente en una pantalla es, muchas veces, la mejora con más ROI y menos complejidad.",
    hashtags: ["#Productividad", "#PYME"],
  },
  // AUDIO — familia C (minimalista: efectos + silencios intencionados). Sin
  // cama musical — el contraste "antes ruidoso / ahora simple" se refuerza
  // dejando la mitad del vídeo en silencio real, no de relleno.
  audio: {
    familia: null,
    bedVolume: 0,
    voice: null,
  },
};

export const testBatch = [
  video1_educational,
  video2_painpoint_linkedin,
  video2_painpoint_reel,
  video3_opinion,
  video4_minimalist,
];
