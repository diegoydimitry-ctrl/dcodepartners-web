/* Las cinco microescenas, comprobadas una a una: que al pulsar pase algo,
   que no sea lo mismo para todas y que a los dos segundos no quede nada.
   Uso: node perf/escenas.mjs */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const { levanta, opcionesNavegador } = await import('../scripts/qa/servidor.mjs');
const s = await levanta(4420);
const nav = await chromium.launch(opcionesNavegador());
const ctx = await nav.newContext({ viewport: { width: 1280, height: 940 } });
const pg = await ctx.newPage();
const errs = [];
pg.on('pageerror', (e) => errs.push(String(e)));
await pg.goto('http://127.0.0.1:4420/contacto', { waitUntil: 'networkidle' });
await pg.waitForTimeout(600);

const vistas = new Set();
const vistos = new Set();
const fallos = [];
const n = await pg.$$eval('.cfg-op', (e) => e.length);
for (let i = 0; i < Math.min(n, 6); i++) {
  await pg.evaluate((i) => { document.querySelectorAll('.cfg-op')[i].click(); }, i);
  await pg.waitForTimeout(140);
  const x = await pg.evaluate(() => ({
    escena: document.querySelector('.cfg-pista') && document.querySelector('.cfg-pista').getAttribute('data-escena'),
    clones: document.querySelectorAll('.cfg-esc').length,
    piezas: document.querySelectorAll('.cfg-luz, .cfg-astilla, .cfg-golpe, .cfg-onda, .cfg-polvo').length,
    personaje: (document.querySelector('.cfg-bicho2') || { className: '' }).className,
    patas: document.querySelectorAll('.cfg-bicho, .cfg-pies').length,
  }));
  if (!x.escena) fallos.push(`opción ${i}: no arranca ninguna escena`);
  if (!x.clones) fallos.push(`opción ${i} (${x.escena}): no hay clon del bloque`);
  if (x.patas) fallos.push(`opción ${i}: sigue habiendo iconos con patas`);
  if (!x.personaje) fallos.push(`opción ${i} (${x.escena}): no entra ningún personaje`);
  else vistos.add(x.personaje.replace('cfg-bicho2 ', ''));
  vistas.add(x.escena);
  await pg.waitForTimeout(1900);
  const queda = await pg.evaluate(() => document.querySelectorAll('.cfg-esc, .cfg-astilla, .cfg-onda, .cfg-bicho2').length);
  if (queda) fallos.push(`opción ${i} (${x.escena}): quedan ${queda} restos a los 1,6 s`);
  /* volver atrás para poder pulsar otra del mismo paso */
  await pg.evaluate(() => { const b = document.querySelector('.cfg-atras'); if (b) b.click(); });
  await pg.waitForTimeout(220);
}
await nav.close(); s.close();
if (errs.length) fallos.push('errores JS: ' + errs.join(' | '));
if (vistas.size < 2) fallos.push(`todas las opciones hacen lo mismo (${[...vistas]})`);
if (fallos.length) { console.error('✗ escenas:'); fallos.forEach((f) => console.error('  ' + f)); process.exit(1); }
if (vistos.size < 2) fallos.push(`todas las escenas traen el mismo personaje (${[...vistos]})`);
if (fallos.length) { console.error('✗ escenas:'); fallos.forEach((f) => console.error('  ' + f)); process.exit(1); }
console.log(`✓ escenas — ${vistas.size} reacciones con ${vistos.size} personaje(s) distintos (${[...vistos].join(', ')}), sin iconos con patas y sin restos`);
