import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  cosineSimilarity,
  computeDiversityScore,
  esAdaptacionMultiplataforma,
  type PiezaCandidata,
  type PiezaHistorica,
} from "../src/diversity/score";

describe("cosineSimilarity", () => {
  test("vectores idénticos -> 1.0", () => {
    const v = [0.2, 0.4, 0.1, 0.8];
    assert.equal(Math.round(cosineSimilarity(v, v) * 1000) / 1000, 1);
  });

  test("vectores ortogonales -> 0.0", () => {
    assert.equal(cosineSimilarity([1, 0, 0], [0, 1, 0]), 0);
  });

  test("vectores casi-duplicados -> por encima del umbral de repetición semántica (0.92)", () => {
    const a = [0.5, 0.48, 0.1, 0.05];
    const b = [0.49, 0.5, 0.11, 0.06];
    assert.ok(cosineSimilarity(a, b) >= 0.92);
  });

  test("arrays vacíos o de distinta longitud -> 0, sin lanzar", () => {
    assert.equal(cosineSimilarity([], []), 0);
    assert.equal(cosineSimilarity([1, 2], [1, 2, 3]), 0);
  });
});

describe("esAdaptacionMultiplataforma", () => {
  test("mismo ideaId -> true", () => {
    const c: PiezaCandidata = { ideaId: "idea-1" };
    const h: PiezaHistorica = { id: "h1", ideaId: "idea-1" };
    assert.equal(esAdaptacionMultiplataforma(c, h), true);
  });

  test("ideaId distinto -> false", () => {
    const c: PiezaCandidata = { ideaId: "idea-1" };
    const h: PiezaHistorica = { id: "h1", ideaId: "idea-2" };
    assert.equal(esAdaptacionMultiplataforma(c, h), false);
  });

  test("sin ideaId en alguno de los dos -> false (no se puede afirmar adaptación sin evidencia)", () => {
    assert.equal(esAdaptacionMultiplataforma({}, { id: "h1", ideaId: "idea-2" }), false);
    assert.equal(esAdaptacionMultiplataforma({ ideaId: "idea-1" }, { id: "h1" }), false);
  });
});

describe("computeDiversityScore — sin historial", () => {
  test("primera pieza -> DIVERSO, score 0", () => {
    const r = computeDiversityScore({ ideaId: "x" }, []);
    assert.equal(r.clasificacion, "DIVERSO");
    assert.equal(r.scoreCompuesto, 0);
  });
});

describe("computeDiversityScore — caso 1: duplicado real", () => {
  // Ejemplo del propio encargo: "Automatizar no significa eliminar personas"
  // vs "La automatización no sustituye al equipo" -- mismo concepto, tema
  // semánticamente casi idéntico (embedding simulado), estructura y CTA
  // también calcados, e ideaId DISTINTO (no es una adaptación, es una idea
  // nueva que en realidad ya se dijo).
  const embeddingBase = [0.5, 0.48, 0.1, 0.05, 0.2];
  const embeddingCasiIgual = [0.49, 0.5, 0.11, 0.06, 0.19];

  const historia: PiezaHistorica[] = [
    {
      id: "video-anterior",
      ideaId: "idea-vieja",
      temaEmbedding: embeddingBase,
      pilar: "IA aplicada",
      tipo: "OPINION",
      estructura: ["title", "uiList", "title", "endcard"],
      audioFamilia: "opinion",
      cta: "¿Automatización o agente? Te ayudamos a elegir.",
      formato: "reel",
    },
  ];

  test("distinto ideaId + todas las dimensiones muy parecidas -> DUPLICADO_PROBABLE", () => {
    const candidata: PiezaCandidata = {
      ideaId: "idea-nueva-pero-es-lo-mismo",
      temaEmbedding: embeddingCasiIgual,
      pilar: "IA aplicada",
      tipo: "OPINION",
      estructura: ["title", "uiList", "title", "endcard"],
      audioFamilia: "opinion",
      cta: "¿Automatización o agente? Te ayudamos a elegir.",
      formato: "reel",
    };
    const r = computeDiversityScore(candidata, historia);
    assert.equal(r.clasificacion, "DUPLICADO_PROBABLE");
    assert.equal(r.piezaMasParecida, "video-anterior");
    assert.ok(r.scoreCompuesto >= 0.8);
  });

  test("no debe clasificar como adaptación multiplataforma solo por parecerse mucho", () => {
    const candidata: PiezaCandidata = {
      ideaId: "idea-nueva-pero-es-lo-mismo",
      temaEmbedding: embeddingCasiIgual,
    };
    const r = computeDiversityScore(candidata, historia);
    assert.notEqual(r.clasificacion, "ADAPTACION_MULTIPLATAFORMA");
  });
});

describe("computeDiversityScore — caso 2: adaptación multiplataforma legítima", () => {
  test("mismo ideaId, misma estructura/audio/CTA (por diseño), distinta red -> ADAPTACION_MULTIPLATAFORMA, no penalizado", () => {
    const embedding = [0.5, 0.48, 0.1, 0.05, 0.2];
    const historia: PiezaHistorica[] = [
      {
        id: "video-2-linkedin",
        ideaId: "idea-pain-002",
        temaEmbedding: embedding,
        estructura: ["title", "uiList", "title", "network", "title", "caption", "endcard"],
        audioFamilia: "problem",
        cta: "¿Dónde vive hoy la verdad en tu empresa?",
        formato: "linkedinWide",
        red: "LinkedIn",
      },
    ];
    const candidata: PiezaCandidata = {
      ideaId: "idea-pain-002", // misma idea, adaptada
      temaEmbedding: embedding,
      estructura: ["title", "uiList", "title", "caption", "endcard"],
      audioFamilia: "problem",
      cta: "¿Dónde vive hoy la verdad en tu empresa?",
      formato: "reel",
      red: "Instagram",
    };
    const r = computeDiversityScore(candidata, historia);
    assert.equal(r.clasificacion, "ADAPTACION_MULTIPLATAFORMA");
  });

  test("mezcla: una pieza es adaptación (mismo ideaId) y otra es duplicado real (distinto ideaId) -> clasifica por la que NO es adaptación", () => {
    const embeddingCandidata = [0.5, 0.48, 0.1, 0.05, 0.2];
    const historia: PiezaHistorica[] = [
      {
        id: "adaptacion-hermana",
        ideaId: "idea-actual",
        temaEmbedding: embeddingCandidata,
        estructura: ["title", "endcard"],
        audioFamilia: "tech",
        cta: "cta distinta",
        formato: "reel",
      },
      {
        id: "duplicado-real",
        ideaId: "idea-totalmente-distinta",
        temaEmbedding: [0.49, 0.5, 0.11, 0.06, 0.19],
        estructura: ["title", "uiList", "title", "endcard"],
        audioFamilia: "opinion",
        cta: "cta parecida",
        formato: "reel",
      },
    ];
    const candidata: PiezaCandidata = {
      ideaId: "idea-actual",
      temaEmbedding: embeddingCandidata,
      estructura: ["title", "uiList", "title", "endcard"],
      audioFamilia: "opinion",
      cta: "cta parecida",
      formato: "reel",
    };
    const r = computeDiversityScore(candidata, historia);
    assert.equal(r.piezaMasParecida, "duplicado-real");
    assert.notEqual(r.clasificacion, "ADAPTACION_MULTIPLATAFORMA");
  });
});

describe("computeDiversityScore — caso 3: pieza claramente distinta", () => {
  test("tema, estructura, audio, CTA y formato todos distintos -> DIVERSO", () => {
    const historia: PiezaHistorica[] = [
      {
        id: "video-1",
        ideaId: "idea-1",
        temaEmbedding: [1, 0, 0, 0, 0],
        estructura: ["title", "uiList", "endcard"],
        audioFamilia: "educational",
        cta: "¿Automatización o agente? Te ayudamos a elegir.",
        formato: "reel",
      },
    ];
    const candidata: PiezaCandidata = {
      ideaId: "idea-nueva",
      temaEmbedding: [0, 0, 0, 0, 1],
      estructura: ["stat", "stat", "caption"],
      audioFamilia: "experimental",
      cta: "Guarda esto para la próxima reunión de equipo.",
      formato: "linkedinWide",
    };
    const r = computeDiversityScore(candidata, historia);
    assert.equal(r.clasificacion, "DIVERSO");
  });
});

describe("computeDiversityScore — caso 4: repetición parcial (no total)", () => {
  test("misma estructura y audio, tema distinto -> REPETICION_PARCIAL, no DUPLICADO_PROBABLE", () => {
    const historia: PiezaHistorica[] = [
      {
        id: "video-1",
        ideaId: "idea-1",
        temaEmbedding: [1, 0, 0, 0],
        estructura: ["title", "uiList", "title", "endcard"],
        audioFamilia: "tech",
        cta: "cta A",
        formato: "reel",
      },
    ];
    const candidata: PiezaCandidata = {
      ideaId: "idea-2",
      temaEmbedding: [0, 1, 0, 0], // ortogonal: tema realmente distinto
      estructura: ["title", "uiList", "title", "endcard"], // misma plantilla
      audioFamilia: "tech", // misma familia
      cta: "cta B totalmente distinta en contenido",
      formato: "linkedinWide",
    };
    const r = computeDiversityScore(candidata, historia);
    assert.equal(r.clasificacion, "REPETICION_PARCIAL");
    assert.ok(r.scoreCompuesto < 0.8);
    assert.ok(r.scoreCompuesto >= 0.55);
  });
});
