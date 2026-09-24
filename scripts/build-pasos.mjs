#!/usr/bin/env node
/*
 * LAS CUATRO FORMACIONES DEL MÉTODO, EN IMAGEN.
 *
 * En un ratón, los cuatro pasos de la portada (Analizamos, Diseñamos,
 * Implantamos, Medimos) tienen al lado la formación que les toca del campo de
 * partículas: la lupa, el plano, el motor y la gráfica. En táctil el campo no
 * se monta —cuesta más componerlo que dibujarlo, ver
 * docs/RENDIMIENTO-POR-DISPOSITIVO.md—, y esos cuatro pasos se quedaban con
 * media pantalla vacía.
 *
 * Así que la imagen no se busca fuera ni se inventa: se saca del propio
 * motor. Este script abre la portada con ratón, para en cada paso, espera a
 * que la formación termine de montarse y guarda el lienzo tal cual, con su
 * transparencia. Lo que se ve en un iPad es exactamente lo que dibuja la web
 * en un ordenador, congelado.
 *
 * Uso: node scripts/build-pasos.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const sharp = require('sharp');
const { levanta, opcionesNavegador } = await import('./qa/servidor.mjs');

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = path.join(RAIZ, 'assets/img/pasos');
fs.mkdirSync(SALIDA, { recursive: true });

/* El estado de cada paso y la formación que le corresponde (dcp6.js: FORM). */
const PASOS = [
  { estado: 4, nombre: 'analizamos',  forma: 'la lupa: el frente de lectura que separa la señal del ruido' },
  { estado: 5, nombre: 'disenamos',   forma: 'el plano: las partes definidas y cómo se conectan' },
  { estado: 6, nombre: 'implantamos', forma: 'el motor: el ciclo cerrado que, puesto en marcha, sigue solo' },
  { estado: 7, nombre: 'medimos',     forma: 'la gráfica: lo mismo cada vez con menos desperdicio' },
];

const PORT = 9801;
await levanta(PORT);
const br = await chromium.launch(opcionesNavegador());
/* Ratón y pantalla grande: es la única forma de que el campo se monte con
   toda su densidad (window.DCP). dpr 2 para que la imagen aguante un iPad. */
const ctx = await br.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
const pg = await ctx.newPage();
await pg.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });
await pg.waitForTimeout(2500);

for (const paso of PASOS) {
  /* El mismo cálculo que hace measureStops(): el centro de la sección en el
     centro de la pantalla es el punto de reposo de esa formación. */
  await pg.evaluate((n) => {
    const z = document.querySelector('[data-state="' + n + '"]');
    const r = z.getBoundingClientRect();
    scrollTo({ top: r.top + scrollY + r.height / 2 - innerHeight / 2, behavior: 'instant' });
  }, paso.estado);
  /* El motor tiene una fase de viaje y otra de reposo: la formación no está
     montada hasta bien entrada la segunda. */
  await pg.waitForTimeout(4200);
  const datos = await pg.evaluate(() => {
    const c = document.querySelector('[data-field] canvas');
    return c ? c.toDataURL('image/png') : null;
  });
  if (!datos) throw new Error('no hay lienzo: ¿se ha montado el campo?');
  const crudo = Buffer.from(datos.split(',')[1], 'base64');
  /* Recorte a lo que de verdad tiene tinta, con un margen, y a un tamaño que
     no pese: es un adorno, no una fotografía. */
  const im = sharp(crudo);
  const { width, height } = await im.metadata();
  const { info } = await im.raw().toBuffer({ resolveWithObject: true });
  const px = (await sharp(crudo).ensureAlpha().raw().toBuffer());
  let x0 = width, y0 = height, x1 = 0, y1 = 0;
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      if (px[(y * width + x) * info.channels + 3] > 26) {
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
  }
  if (x1 <= x0 || y1 <= y0) throw new Error('el lienzo del paso ' + paso.estado + ' salió vacío');
  const m = 24;
  x0 = Math.max(0, x0 - m); y0 = Math.max(0, y0 - m);
  x1 = Math.min(width - 1, x1 + m); y1 = Math.min(height - 1, y1 + m);
  /* Dos tamaños. En un teléfono la formación se ve a unos 190 px de ancho:
     descargar y DESCODIFICAR una de 860 px para eso es trabajo tirado justo
     mientras se baja, que es cuando se nota. */
  const medidas = [
    { ancho: 860, sufijo: '' },
    { ancho: 420, sufijo: '-420' },
  ];
  const pesos = [];
  for (const m of medidas) {
    const dest = path.join(SALIDA, `paso-${paso.nombre}${m.sufijo}.webp`);
    await sharp(crudo)
      .extract({ left: x0, top: y0, width: x1 - x0, height: y1 - y0 })
      .resize({ width: Math.min(m.ancho, x1 - x0), withoutEnlargement: true })
      .webp({ quality: 66, alphaQuality: 72, effort: 6 })
      .toFile(dest);
    pesos.push(m.ancho + 'px ' + Math.round(fs.statSync(dest).size / 1024) + ' KB');
  }
  console.log(`✓ paso ${paso.estado} · ${paso.nombre} — ${paso.forma} · ${x1 - x0}×${y1 - y0} → ${pesos.join(' · ')}`);
}
await br.close();
console.log('Formaciones guardadas en assets/img/pasos/');
process.exit(0);
