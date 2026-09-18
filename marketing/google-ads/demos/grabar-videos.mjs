#!/usr/bin/env node
// Graba el vídeo de cada demo a partir del MISMO reproductor animado de la
// landing (modo ?record=1), en 1280x720, con los subtítulos incrustados en
// la imagen y además en un fichero .vtt. No es una grabación del sistema
// real: es el recorrido de demostración con datos inventados, y así lo
// dice el propio vídeo en su primer plano y en su marca permanente.
//
//   PORT=4173 node tests/ads/servidor-local.mjs &   (en otra terminal)
//   node marketing/google-ads/demos/grabar-videos.mjs
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const DEMOS = require(path.join(RAIZ, 'assets/ads/demos.js'));
const BASE = process.env.BASE_URL || 'http://localhost:4173';
const OUT = path.join(RAIZ, 'assets/ads/video');
const TMP = path.join(RAIZ, '.video-tmp');
const PAGINA = { procesos: 'automatizacion-procesos', comercial: 'automatizacion-seguimiento-comercial', atencion: 'automatizacion-atencion-clientes' };
const EXEC = process.env.CHROMIUM_PATH || undefined;
const FFMPEG = process.env.FFMPEG || 'ffmpeg';

const hms = (s) => {
  const ms = Math.round((s % 1) * 1000);
  const t = Math.floor(s);
  return `${String(Math.floor(t / 3600)).padStart(2, '0')}:${String(Math.floor(t / 60) % 60).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
};

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch(EXEC ? { executablePath: EXEC } : {});
for (const [id, demo] of Object.entries(DEMOS)) {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: TMP, size: { width: 1280, height: 720 } } });
  const page = await ctx.newPage();
  const t0 = Date.now();
  await page.goto(`${BASE}/${PAGINA[id]}?record=1`, { waitUntil: 'load' });
  // El reproductor arranca 600 ms después de cargar.
  await page.waitForFunction(() => document.querySelector('.demo.reproduciendo'), null, { timeout: 5000 });
  const offset = (Date.now() - t0) / 1000;
  await page.waitForTimeout((demo.duracion + 1.5) * 1000);
  await ctx.close();
  const webm = readdirSync(TMP).find((f) => f.endsWith('.webm'));
  const mp4 = path.join(OUT, `demo-${id}.mp4`);
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-ss', offset.toFixed(2), '-i', path.join(TMP, webm),
    '-t', String(demo.duracion + 1), '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '30', '-pix_fmt', 'yuv420p',
    '-r', '25', '-movflags', '+faststart', mp4]);
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-ss', '3', '-i', mp4, '-frames:v', '1', '-q:v', '5', path.join(OUT, `demo-${id}.jpg`)]);
  const vtt = ['WEBVTT', ''];
  demo.pasos.forEach((p, i) => {
    const fin = i + 1 < demo.pasos.length ? demo.pasos[i + 1].t : demo.duracion;
    vtt.push(String(i + 1), `${hms(p.t)} --> ${hms(fin)}`, p.c, '');
  });
  writeFileSync(path.join(OUT, `demo-${id}.vtt`), vtt.join('\n'));
  console.log(`✓ demo-${id}.mp4 (${demo.duracion} s)`);
}
await browser.close();
rmSync(TMP, { recursive: true, force: true });
