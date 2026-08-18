import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { computeDiversityScore, type PiezaHistorica, type PiezaCandidata } from "../src/diversity/score";
import { testBatch } from "../src/storyboards/testBatch";
import type { Storyboard } from "../src/schema/storyboard";

/**
 * Traduce un storyboard real del lote de prueba al formato que consume el
 * Diversity Score. No hay embedding real disponible aquí (eso requiere una
 * llamada a Gemini que este entorno no hace sin autorización) -- se deja
 * temaEmbedding fuera a propósito, así el test mide solo lo que SÍ se puede
 * verificar sin red: estructura, audio, CTA y formato.
 */
function aPieza(s: Storyboard): PiezaHistorica & PiezaCandidata {
  const endcard = s.scenes.find((sc) => sc.type === "endcard");
  return {
    id: s.videoId,
    ideaId: s.videoId.replace(/-(li|ig)$/, ""), // test-pain-002-li / -ig comparten idea
    estructura: s.scenes.map((sc) => sc.type),
    audioFamilia: s.audio.familia,
    cta: endcard ? (endcard.props as any).cta : "",
    formato: s.formato,
  };
}

describe("Diversity Score aplicado al lote de prueba real (5 piezas)", () => {
  const piezas = testBatch.map(aPieza);

  test("test-pain-002-li y test-pain-002-ig comparten ideaId -> se registran como adaptación, no cuentan como duplicado entre sí", () => {
    const candidata = piezas.find((p) => p.id === "test-pain-002-ig")!;
    const historiaSinElla = piezas.filter((p) => p.id !== "test-pain-002-ig");
    const r = computeDiversityScore(candidata, historiaSinElla);
    const comparacionConSuHermana = r.comparaciones.find((c) => c.contraId === "test-pain-002-li");
    assert.equal(comparacionConSuHermana?.esAdaptacionMultiplataforma, true);
    // La clasificación final depende de las piezas NO relacionadas del
    // historial (educativo, opinión, minimalista) -- comparado con esas, la
    // pieza sigue siendo su propia idea, no un duplicado de otra distinta.
    assert.notEqual(r.piezaMasParecida, "test-pain-002-li");
  });

  test("cuando TODO el historial disponible es la misma idea adaptada, clasifica como ADAPTACION_MULTIPLATAFORMA", () => {
    const candidata = piezas.find((p) => p.id === "test-pain-002-ig")!;
    const soloSuHermana = piezas.filter((p) => p.id === "test-pain-002-li");
    const r = computeDiversityScore(candidata, soloSuHermana);
    assert.equal(r.clasificacion, "ADAPTACION_MULTIPLATAFORMA");
  });

  test("hallazgo conocido: test-edu-001 y test-pain-002-li comparten esqueleto de escenas -> se detecta como repetición de estructura, no pasa desapercibido", () => {
    const eduComoHistoria: PiezaHistorica = piezas.find((p) => p.id === "test-edu-001")!;
    const painLiComoCandidata: PiezaCandidata = piezas.find((p) => p.id === "test-pain-002-li")!;
    const r = computeDiversityScore(painLiComoCandidata, [eduComoHistoria]);
    // Sin tema (embedding) para diferenciarlas y con exactamente el mismo
    // esqueleto de escenas, el score de estructura por sí solo ya debe
    // registrar algo de similitud -- no debe salir 0.
    const comparacion = r.comparaciones[0];
    assert.ok(comparacion.estructuraSim > 0.9, `estructuraSim = ${comparacion.estructuraSim}`);
  });

  test("test-minimal-004 (silencio) frente a un histórico también en silencio cuenta como misma familia de audio", () => {
    const candidata: PiezaCandidata = { audioFamilia: null, estructura: ["x"] };
    const historica: PiezaHistorica = { id: "otro-silencioso", audioFamilia: null, estructura: ["y"] };
    const r = computeDiversityScore(candidata, [historica]);
    assert.equal(r.comparaciones[0].audioSim, 1);
  });
});
