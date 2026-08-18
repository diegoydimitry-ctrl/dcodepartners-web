/**
 * Diversity Score compuesto (DCP-CONTENT-FACTORY-003).
 *
 * Fuente única de verdad de la lógica de puntuación de variedad. El workflow
 * de n8n "CF/Memory + Diversity Gate" usa una copia sincronizada a mano de
 * esta lógica dentro de su nodo Code (los nodos Code de n8n no pueden
 * importar módulos del repositorio) — cualquier cambio aquí debe reflejarse
 * también allí. Ver `docs/cambios-dcode-partners` / informe V3 para el
 * detalle de esa limitación.
 *
 * Combina 5 dimensiones, no solo similitud de tema:
 *   - tema (semántico, vía embedding — cosine similarity)
 *   - estructura (esqueleto de tipos de escena)
 *   - audio (familia musical o silencio)
 *   - CTA (call to action)
 *   - formato (reel / linkedinWide / linkedinSquare / tipoPost)
 *
 * Distingue explícitamente DUPLICADO (mismo concepto reaparece como si fuera
 * nuevo) de ADAPTACIÓN MULTIPLATAFORMA (la misma pieza, a propósito, para
 * otra red — no es repetición, es el comportamiento correcto).
 */

export interface PiezaHistorica {
  id: string; // videoId o postId
  ideaId?: string;
  fecha?: string;
  temaEmbedding?: number[];
  pilar?: string;
  tipo?: string;
  estructura?: string[]; // esqueleto de tipos de escena, ej. ["title","uiList","endcard"]
  audioFamilia?: string | null; // null = silencio intencionado
  cta?: string;
  formato?: string;
  red?: string;
}

export interface PiezaCandidata {
  ideaId?: string;
  temaEmbedding?: number[];
  pilar?: string;
  tipo?: string;
  estructura?: string[];
  audioFamilia?: string | null;
  cta?: string;
  formato?: string;
  red?: string;
}

export type Clasificacion =
  | "ADAPTACION_MULTIPLATAFORMA"
  | "DUPLICADO_PROBABLE"
  | "REPETICION_PARCIAL"
  | "DIVERSO";

export interface ComparacionPieza {
  contraId: string;
  esAdaptacionMultiplataforma: boolean;
  temaSim: number;
  estructuraSim: number;
  audioSim: number;
  ctaSim: number;
  formatoSim: number;
  scorePonderado: number;
  // true cuando el esqueleto de escenas es (casi) idéntico -- señal fuerte
  // por sí sola, independiente del resto de dimensiones (ver UMBRAL_ESTRUCTURA_CLONADA).
  estructuraClonada: boolean;
}

export interface DiversityBreakdown {
  clasificacion: Clasificacion;
  scoreCompuesto: number; // 0..1 — más alto = más repetitivo (peor)
  piezaMasParecida: string | null;
  comparaciones: ComparacionPieza[];
  detalle: string;
}

// Pesos de cada dimensión sobre el score compuesto (suman 1.0). Tema pesa
// más porque una idea semánticamente repetida es el problema principal que
// pedía el encargo — el resto son señales de "se siente igual" aunque el
// tema sea distinto.
const PESOS = {
  tema: 0.45,
  estructura: 0.2,
  audio: 0.15,
  cta: 0.1,
  formato: 0.1,
};

const UMBRAL_DUPLICADO = 0.8;
const UMBRAL_REPETICION_PARCIAL = 0.55;

// Señal fuerte aislada: dos piezas con (casi) el mismo esqueleto de escenas
// son "la misma plantilla con texto nuevo" incluso si hablan de temas
// distintos -- exactamente el patrón que el encargo pedía dejar de repetir.
// Por eso la estructura clonada, por sí sola, ya empuja como mínimo a
// REPETICION_PARCIAL en vez de diluirse en el promedio ponderado (que
// pesa más el tema y podría enmascararla).
const UMBRAL_ESTRUCTURA_CLONADA = 0.9;

export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a?.length || !b?.length || a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function jaccardWords(a?: string, b?: string): number {
  if (!a || !b) return 0;
  const wa = new Set(a.toLowerCase().match(/[a-záéíóúñ]+/g) ?? []);
  const wb = new Set(b.toLowerCase().match(/[a-záéíóúñ]+/g) ?? []);
  if (wa.size === 0 || wb.size === 0) return 0;
  let inter = 0;
  for (const w of wa) if (wb.has(w)) inter++;
  const union = wa.size + wb.size - inter;
  return union === 0 ? 0 : inter / union;
}

/**
 * Similitud de estructura: compara el esqueleto ordenado de tipos de escena.
 * Secuencias idénticas -> 1. Se pondera por solape (Jaccard) y bonus si el
 * orden también coincide, para que "las mismas piezas en otro orden" no
 * puntúe igual que "exactamente la misma plantilla".
 */
function structureSimilarity(a?: string[], b?: string[]): number {
  if (!a?.length || !b?.length) return 0;
  const setA = new Set(a);
  const setB = new Set(b);
  let inter = 0;
  for (const t of setA) if (setB.has(t)) inter++;
  const union = setA.size + setB.size - inter;
  const overlap = union === 0 ? 0 : inter / union;

  const minLen = Math.min(a.length, b.length);
  let sameOrderCount = 0;
  for (let i = 0; i < minLen; i++) if (a[i] === b[i]) sameOrderCount++;
  const orderBonus = minLen === 0 ? 0 : sameOrderCount / minLen;

  return overlap * 0.6 + orderBonus * 0.4;
}

function audioSimilarity(a?: string | null, b?: string | null): number {
  // Ambas null (silencio intencionado en las dos) también cuenta como "misma
  // familia" a efectos de repetición -- dos vídeos mudos seguidos también es
  // una repetición de diseño de audio, no una excepción.
  if (a === undefined || b === undefined) return 0;
  return a === b ? 1 : 0;
}

function formatoSimilarity(a?: string, b?: string): number {
  if (!a || !b) return 0;
  return a === b ? 1 : 0;
}

export function esAdaptacionMultiplataforma(
  candidata: PiezaCandidata,
  historica: PiezaHistorica
): boolean {
  return (
    !!candidata.ideaId &&
    !!historica.ideaId &&
    candidata.ideaId === historica.ideaId
  );
}

function compararUna(
  candidata: PiezaCandidata,
  historica: PiezaHistorica
): ComparacionPieza {
  const adaptacion = esAdaptacionMultiplataforma(candidata, historica);
  const temaSim = cosineSimilarity(
    candidata.temaEmbedding ?? [],
    historica.temaEmbedding ?? []
  );
  const estructuraSim = structureSimilarity(
    candidata.estructura,
    historica.estructura
  );
  const audioSim = audioSimilarity(candidata.audioFamilia, historica.audioFamilia);
  const ctaSim = jaccardWords(candidata.cta, historica.cta);
  const formatoSim = formatoSimilarity(candidata.formato, historica.formato);

  const scorePonderado =
    temaSim * PESOS.tema +
    estructuraSim * PESOS.estructura +
    audioSim * PESOS.audio +
    ctaSim * PESOS.cta +
    formatoSim * PESOS.formato;

  return {
    contraId: historica.id,
    esAdaptacionMultiplataforma: adaptacion,
    temaSim,
    estructuraSim,
    audioSim,
    ctaSim,
    formatoSim,
    scorePonderado,
    estructuraClonada: estructuraSim >= UMBRAL_ESTRUCTURA_CLONADA,
  };
}

// "Severidad efectiva" para elegir la peor coincidencia y clasificar: el
// score ponderado normal, salvo que la estructura esté clonada, en cuyo caso
// se garantiza al menos el umbral de repetición parcial (ver comentario de
// UMBRAL_ESTRUCTURA_CLONADA más arriba).
function severidadEfectiva(c: ComparacionPieza): number {
  return c.estructuraClonada
    ? Math.max(c.scorePonderado, UMBRAL_REPETICION_PARCIAL)
    : c.scorePonderado;
}

/**
 * Calcula el Diversity Score compuesto de una pieza candidata frente a su
 * historial. Las comparaciones marcadas como adaptación multiplataforma
 * (mismo ideaId) se registran pero NO cuentan para elegir "la pieza más
 * parecida" que decide la clasificación -- una adaptación a propósito nunca
 * debe leerse como un duplicado accidental.
 */
export function computeDiversityScore(
  candidata: PiezaCandidata,
  historia: PiezaHistorica[]
): DiversityBreakdown {
  if (!historia.length) {
    return {
      clasificacion: "DIVERSO",
      scoreCompuesto: 0,
      piezaMasParecida: null,
      comparaciones: [],
      detalle: "Sin historial todavía -- primera pieza, diversidad máxima por definición.",
    };
  }

  const comparaciones = historia.map((h) => compararUna(candidata, h));

  const comparacionesNoAdaptacion = comparaciones.filter(
    (c) => !c.esAdaptacionMultiplataforma
  );

  // Si TODO el historial comparado son adaptaciones de la misma idea (caso
  // extremo: primera vez que esta idea se adapta a una segunda red), es
  // adaptación legítima, no hay señal de duplicado real que evaluar.
  if (!comparacionesNoAdaptacion.length) {
    return {
      clasificacion: "ADAPTACION_MULTIPLATAFORMA",
      scoreCompuesto: Math.max(...comparaciones.map((c) => c.scorePonderado)),
      piezaMasParecida: comparaciones[0]?.contraId ?? null,
      comparaciones,
      detalle:
        "Todas las coincidencias son de la misma idea (mismo ideaId) -- adaptación multiplataforma esperada, no una repetición accidental.",
    };
  }

  const peor = comparacionesNoAdaptacion.reduce((max, c) =>
    severidadEfectiva(c) > severidadEfectiva(max) ? c : max
  );
  const severidad = severidadEfectiva(peor);

  let clasificacion: Clasificacion;
  if (severidad >= UMBRAL_DUPLICADO) {
    clasificacion = "DUPLICADO_PROBABLE";
  } else if (severidad >= UMBRAL_REPETICION_PARCIAL) {
    clasificacion = "REPETICION_PARCIAL";
  } else {
    clasificacion = "DIVERSO";
  }

  const notaEstructura = peor.estructuraClonada
    ? " [estructura clonada -- mismo esqueleto de escenas, penalizado independientemente del tema]"
    : "";

  return {
    clasificacion,
    scoreCompuesto: severidad,
    piezaMasParecida: peor.contraId,
    comparaciones,
    detalle: `Peor coincidencia (no-adaptación): ${peor.contraId} con score ${peor.scorePonderado.toFixed(3)} (tema ${peor.temaSim.toFixed(2)}, estructura ${peor.estructuraSim.toFixed(2)}, audio ${peor.audioSim.toFixed(2)}, cta ${peor.ctaSim.toFixed(2)}, formato ${peor.formatoSim.toFixed(2)}).${notaEstructura}`,
  };
}
