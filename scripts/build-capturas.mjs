#!/usr/bin/env node
/*
 * LAS CAPTURAS DE LOS SISTEMAS, A LA RESOLUCIÓN QUE TOCA.
 *
 * Estaban hechas a 1400 px de ancho. En la portada el panel ocupa unos 870
 * px de CSS, y en una pantalla de las de ahora —dos píxeles físicos por cada
 * uno de CSS— eso son 1740 píxeles de verdad: el navegador estaba estirando
 * una imagen de 1400 hasta 1740 y por eso se veía blanda. Un texto de 11 px
 * estirado un 24 % deja de ser texto.
 *
 * Ahora se fotografía a 2× —2800 px— y se emiten tres tamaños, así que cada
 * pantalla se lleva el que le corresponde y ninguna estira nada.
 *
 * Uso:  node scripts/build-capturas.mjs
 *       node scripts/build-capturas.mjs --check
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');
const { chromium } = require('playwright');
const { levanta, opcionesNavegador } = await import('./qa/servidor.mjs');

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = path.join(RAIZ, 'assets/img/demos');
const CHECK = process.argv.includes('--check');

/* Qué se fotografía y de dónde. El ancho es el del encuadre en CSS; el
   fichero sale al doble. */
const TOMAS = [
  { id: 'finance', ruta: '/sistema-financiero/app', w: 1400, h: 813 },
];
const ANCHOS = [700, 1400, 2800];

if (CHECK) {
  const faltan = [];
  for (const t of TOMAS) for (const tema of ['dark', 'light']) for (const a of ANCHOS) {
    const n = `${t.id}-${tema}${a === 1400 ? '' : '-' + a}.webp`;
    const f = path.join(SALIDA, n);
    if (!fs.existsSync(f)) { faltan.push(n); continue; }
    /* Y que midan lo que dicen: una captura de 1400 renombrada a 2800 se ve
       igual de mal y no se nota hasta que alguien mira de cerca. */
  }
  if (faltan.length) {
    console.error('✗ check:capturas — faltan ' + faltan.length + ':');
    faltan.forEach((f) => console.error('  ' + f));
    console.error('  Se regeneran con:  node scripts/build-capturas.mjs');
    process.exit(1);
  }
  let mal = 0;
  for (const t of TOMAS) for (const tema of ['dark', 'light']) for (const a of ANCHOS) {
    const n = `${t.id}-${tema}${a === 1400 ? '' : '-' + a}.webp`;
    const m = await sharp(path.join(SALIDA, n)).metadata();
    if (m.width !== a) { console.error(`✗ ${n} mide ${m.width} px y dice ser de ${a}`); mal++; }
  }
  if (mal) process.exit(1);
  console.log(`✓ check:capturas — ${TOMAS.length * 2 * ANCHOS.length} ficheros, cada uno a su ancho`);
  process.exit(0);
}

const srv = await levanta(4599);
const nav = await chromium.launch(opcionesNavegador());
const hechas = [];

for (const t of TOMAS) {
  for (const tema of ['dark', 'light']) {
    const ctx = await nav.newContext({
      viewport: { width: t.w, height: t.h },
      deviceScaleFactor: 2,            // <- lo que faltaba
    });
    /* En esta web data-theme="light" pinta la superficie OSCURA y al revés;
       el conmutador guarda su elección en dcp-tema. Se fija antes de que
       cargue nada para que no haya un fotograma con el tema que no es. */
    await ctx.addInitScript((v) => { try { localStorage.setItem('dcp-tema', v); } catch (e) {} },
      tema === 'dark' ? 'dark' : 'light');
    const pg = await ctx.newPage();
    await pg.goto('http://127.0.0.1:4599' + t.ruta, { waitUntil: 'networkidle' });
    await pg.evaluate(() => document.fonts.ready);
    /* Sin animaciones: una barra a medio crecer en una foto fija se lee como
       un fallo de pintado. */
    await pg.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
    await pg.waitForTimeout(900);

    const png = await pg.screenshot({ type: 'png' });
    for (const a of ANCHOS) {
      const n = `${t.id}-${tema}${a === 1400 ? '' : '-' + a}.webp`;
      await sharp(png).resize(a, null, { kernel: 'lanczos3' })
        .webp({ quality: a >= 2800 ? 88 : 90, effort: 6 })
        .toFile(path.join(SALIDA, n));
      hechas.push(`${n} (${Math.round(fs.statSync(path.join(SALIDA, n)).size / 1024)} KB)`);
    }
    await ctx.close();
  }
}

await nav.close(); srv.close();
console.log('✓ capturas: ' + hechas.join(', '));
