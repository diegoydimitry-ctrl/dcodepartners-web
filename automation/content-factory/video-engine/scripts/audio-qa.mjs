#!/usr/bin/env node
/**
 * Audio QA — nivel automático. Comprueba lo que el encargo pide para la
 * puerta de Audio QA: presencia de pista, ausencia de clipping, que no esté
 * en silencio total salvo que el storyboard lo pida a propósito (audio
 * "familia: null" sin ningún soundCue), y duración de audio acorde al vídeo.
 *
 * Uso: node scripts/audio-qa.mjs out/mi-video.mp4 [--expect-silent]
 */
import { execFileSync, spawnSync } from "node:child_process";

const file = process.argv[2];
const expectSilent = process.argv.includes("--expect-silent");
if (!file) {
  console.error("Uso: node scripts/audio-qa.mjs <archivo.mp4> [--expect-silent]");
  process.exit(1);
}

function ffprobe(args) {
  return execFileSync("ffprobe", ["-v", "error", ...args, file]).toString().trim();
}

function volumedetect() {
  // ffmpeg escribe el resultado de volumedetect en stderr, no en stdout.
  const result = spawnSync("ffmpeg", [
    "-i", file, "-af", "volumedetect", "-f", "null", "-",
  ], { encoding: "utf8" });
  return `${result.stdout || ""}\n${result.stderr || ""}`;
}

const results = [];
const check = (name, pass, detail) => results.push({ name, pass, detail });

try {
  const hasAudio = ffprobe(["-select_streams", "a", "-show_entries", "stream=codec_name", "-of", "csv=p=0"]);
  check("Tiene pista de audio", hasAudio.length > 0, hasAudio || "(ninguna)");

  const vDur = parseFloat(ffprobe(["-select_streams", "v:0", "-show_entries", "stream=duration", "-of", "csv=p=0"]));
  const aDur = parseFloat(ffprobe(["-select_streams", "a:0", "-show_entries", "stream=duration", "-of", "csv=p=0"]));
  const durOk = !Number.isNaN(aDur) && Math.abs(vDur - aDur) < 1.5;
  check("Duración de audio ≈ duración de vídeo (±1.5s)", durOk, `vídeo ${vDur?.toFixed(2)}s / audio ${aDur?.toFixed(2)}s`);

  let maxVol = NaN, meanVol = NaN;
  try {
    const out = volumedetect();
    const maxMatch = out.match(/max_volume:\s*(-?[\d.]+|-inf)\s*dB/);
    const meanMatch = out.match(/mean_volume:\s*(-?[\d.]+|-inf)\s*dB/);
    maxVol = maxMatch ? parseFloat(maxMatch[1]) : NaN;
    meanVol = meanMatch ? parseFloat(meanMatch[1]) : NaN;
  } catch (e) {
    // volumedetect puede fallar si no hay pista de audio; ya se reportó arriba
  }

  check("Sin clipping (max_volume ≤ -0.1 dB)", Number.isNaN(maxVol) || maxVol <= -0.1, `${maxVol} dB`);

  if (expectSilent) {
    check("Silencio intencionado real (no relleno con volumen audible)", meanVol < -35 || Number.isNaN(meanVol), `${meanVol} dB (esperado: muy bajo salvo SFX puntuales)`);
  } else {
    check("No está en silencio (mean_volume > -45 dB)", meanVol > -45, `${meanVol} dB`);
  }
} catch (e) {
  check("ffprobe/ffmpeg se ejecutaron correctamente", false, String(e.message || e));
}

const allPass = results.every((r) => r.pass);
console.log(`\nAudio QA — ${file}${expectSilent ? " (silencio intencionado esperado)" : ""}\n`);
for (const r of results) {
  console.log(`${r.pass ? "OK  " : "FAIL"}  ${r.name}  (${r.detail})`);
}
console.log(`\nResultado: ${allPass ? "PASA Audio QA" : "FALLA Audio QA — no marcar READY"}\n`);
process.exit(allPass ? 0 : 1);
