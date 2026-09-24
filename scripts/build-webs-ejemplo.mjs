#!/usr/bin/env node
/*
 * LAS CUATRO WEBS DE EJEMPLO, EN IMAGEN.
 *
 * Se abren en el navegador las cuatro maquetas de scripts/webs/maquetas.mjs
 * —webs completas, con su tipografía y su paleta— y se fotografían. Dos
 * tamaños: el grande para un ratón y uno a la mitad para el teléfono, que es
 * donde de verdad importa el peso.
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
const { MAQUETAS } = await import('./webs/maquetas.mjs');

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = path.join(RAIZ, 'assets/img/webs');
const FUENTES = path.join(RAIZ, 'assets/fonts');
const CHECK = process.argv.includes('--check');

if (CHECK) {
  const faltan = [];
  for (const m of MAQUETAS) for (const s of ['', '-600']) {
    const f = path.join(SALIDA, `${m.id}${s}.webp`);
    if (!fs.existsSync(f)) faltan.push(path.relative(RAIZ, f));
  }
  if (faltan.length) {
    console.error('✗ check:webs — faltan ' + faltan.length + ' imagen(es):');
    faltan.forEach((f) => console.error('  ' + f));
    console.error('  Se regeneran con:  node scripts/build-webs-ejemplo.mjs');
    process.exit(1);
  }
  console.log(`✓ check:webs — ${MAQUETAS.length} webs de ejemplo en sus dos tamaños`);
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
  const kb = (n) => Math.round(fs.statSync(path.join(SALIDA, n)).size / 1024);
  hechas.push(`${m.id} (${kb(m.id + '.webp')} KB · ${kb(m.id + '-600.webp')} KB)`);
}

await ctx.close();
await nav.close();
console.log(`✓ webs de ejemplo: ${hechas.join(', ')}`);
