#!/usr/bin/env node
/**
 * QA Engine — nivel 1 (automático). Comprueba lo que SÍ se puede verificar
 * sin ojos humanos: duración dentro de rango, resolución/formato correctos,
 * códec compatible, tamaño de archivo razonable. Lo que requiere criterio
 * humano (¿el hook funciona? ¿hay algo visualmente absurdo? ¿parece
 * realmente D-Code?) queda en QA_CHECKLIST.md como Content Review / Visual
 * Review — el Final Gate solo pasa si automático + ambas revisiones humanas
 * aprueban.
 *
 * Uso: node scripts/qa-check.mjs out/mi-video.mp4
 */
import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("Uso: node scripts/qa-check.mjs <archivo.mp4>");
  process.exit(1);
}

function ffprobe(args) {
  return execFileSync("ffprobe", ["-v", "error", ...args, file]).toString().trim();
}

const results = [];
const check = (name, pass, detail) => results.push({ name, pass, detail });

try {
  const duration = parseFloat(
    ffprobe(["-show_entries", "format=duration", "-of", "csv=p=0"])
  );
  check(
    "Duración entre 6s y 60s (formato corto)",
    duration >= 6 && duration <= 60,
    `${duration.toFixed(2)}s`
  );

  const [w, h] = ffprobe([
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height",
    "-of", "csv=p=0",
  ]).split(",").map(Number);
  const validDims = [
    [1080, 1920], // reel
    [1080, 1080], // linkedin cuadrado
    [1280, 720], // linkedin 16:9
  ];
  const dimsOk = validDims.some(([vw, vh]) => vw === w && vh === h);
  check("Resolución es uno de los formatos de marca soportados", dimsOk, `${w}x${h}`);
  check("Dimensiones pares (requisito de códec h264)", w % 2 === 0 && h % 2 === 0, `${w}x${h}`);

  const codec = ffprobe(["-select_streams", "v:0", "-show_entries", "stream=codec_name", "-of", "csv=p=0"]).replace(/,$/, "");
  check("Códec de vídeo h264 (compatible con IG/LinkedIn)", codec === "h264", codec);

  const sizeBytes = statSync(file).size;
  const sizeMB = sizeBytes / (1024 * 1024);
  check("Tamaño de archivo razonable (0.2 - 60 MB)", sizeMB > 0.2 && sizeMB < 60, `${sizeMB.toFixed(2)} MB`);
} catch (e) {
  check("ffprobe se ejecutó correctamente", false, String(e.message || e));
}

const allPass = results.every((r) => r.pass);
console.log(`\nQA automático — ${file}\n`);
for (const r of results) {
  console.log(`${r.pass ? "OK  " : "FAIL"}  ${r.name}  (${r.detail})`);
}
console.log(`\nResultado: ${allPass ? "PASA nivel automático" : "FALLA nivel automático — no marcar READY"}`);
console.log("Recuerda: esto NO sustituye el Content Review ni el Visual Review humanos — ver QA_CHECKLIST.md.\n");

process.exit(allPass ? 0 : 1);
