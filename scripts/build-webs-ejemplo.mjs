#!/usr/bin/env node
/*
 * LAS CUATRO WEBS DE EJEMPLO, EN IMAGEN.
 *
 * Se abren en el navegador las cuatro maquetas de scripts/webs/maquetas.mjs
 * —webs completas, con su tipografía y su paleta— y se fotografían. Dos
 * tamaños: el grande para un ratón y uno a la mitad para el teléfono, que es
 * donde de verdad importa el peso.
 *
 * Y una tercera: la página entera, con lo que hay debajo del pliegue, para
 * el marco que se puede bajar. Esa se hace con la maqueta y su `mas`
 * pegados, quitándole al body el alto fijo y el overflow, que son los que
 * la recortaban a una pantalla.
 *
 * Uso:  node scripts/build-webs-ejemplo.mjs
 *       node scripts/build-webs-ejemplo.mjs --check   (falla si falta alguna)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');
const { chromium } = require('playwright');
const { opcionesNavegador } = await import('./qa/servidor.mjs');
const { MAQUETAS } = await import('./contenido/maquetas.mjs');

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = path.join(RAIZ, 'assets/img/webs');
const FUENTES = path.join(RAIZ, 'assets/fonts');
const CHECK = process.argv.includes('--check');

if (CHECK) {
  const faltan = [];
  for (const m of MAQUETAS) for (const s of ['', '-600', '-largo']) {
    const f = path.join(SALIDA, `${m.id}${s}.webp`);
    if (!fs.existsSync(f)) faltan.push(path.relative(RAIZ, f));
  }
  if (faltan.length) {
    console.error('✗ check:webs — faltan ' + faltan.length + ' imagen(es):');
    faltan.forEach((f) => console.error('  ' + f));
    console.error('  Se regeneran con:  node scripts/build-webs-ejemplo.mjs');
    process.exit(1);
  }
  console.log(`✓ check:webs — ${MAQUETAS.length} webs de ejemplo en sus tres tamaños`);
  process.exit(0);
}

fs.mkdirSync(SALIDA, { recursive: true });
const fuente = (f, familia, peso) =>
  `@font-face{font-family:'${familia}';src:url('data:font/woff2;base64,${fs.readFileSync(path.join(FUENTES, f)).toString('base64')}') format('woff2');font-weight:${peso};font-display:block}`;
const CARAS = fuente('inter-variable.woff2', 'Inter', '100 900');

const nav = await chromium.launch(opcionesNavegador());
const ctx = await nav.newContext({ viewport: { width: 1200, height: 820 }, deviceScaleFactor: 2 });
await ctx.route(/^https?:/, (r) => r.abort());
const pg = await ctx.newPage();
const hechas = [];

for (const m of MAQUETAS) {
  await pg.setContent(`<!doctype html><html lang="es"><meta charset="utf-8"><style>${CARAS}</style>${m.html}`,
    { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForTimeout(120);
  const png = await pg.screenshot({ type: 'png' });
  await sharp(png).resize(1200).webp({ quality: 82 }).toFile(path.join(SALIDA, `${m.id}.webp`));
  await sharp(png).resize(600).webp({ quality: 80 }).toFile(path.join(SALIDA, `${m.id}-600.webp`));

  /* La larga: la misma maqueta con lo de debajo pegado y sin el recorte a
     una pantalla. Va al final para no ensuciar la foto de arriba. */
  await pg.setContent(`<!doctype html><html lang="es"><meta charset="utf-8"><style>${CARAS}</style>${m.html}${m.mas || ''}<style>html,body{height:auto;overflow:visible}</style>`,
    { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForTimeout(120);
  const alto = await pg.evaluate(() => document.documentElement.scrollHeight);
  if (alto < 1100) {
    console.error(`✗ ${m.id}: la página larga mide ${alto}px. Sin nada debajo del pliegue el marco no se puede bajar; le falta su \`mas\` en scripts/contenido/maquetas.mjs.`);
    process.exit(1);
  }
  const largo = await pg.screenshot({ type: 'png', fullPage: true });
  await sharp(largo).resize(1000).webp({ quality: 78 }).toFile(path.join(SALIDA, `${m.id}-largo.webp`));

  const kb = (n) => Math.round(fs.statSync(path.join(SALIDA, n)).size / 1024);
  hechas.push(`${m.id} (${kb(m.id + '.webp')} KB · ${kb(m.id + '-600.webp')} KB · ${alto}px ${kb(m.id + '-largo.webp')} KB)`);
}

await ctx.close();
await nav.close();
console.log(`✓ webs de ejemplo: ${hechas.join(', ')}`);
