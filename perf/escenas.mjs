/* La respuesta al clic: que al elegir una opción el bloque tiemble y lo
 * cruce un brillo, que no queden restos y que no haya vuelto nada de lo de
 * antes —ni bichos con patas, ni personajes, ni objetos cruzando la
 * pantalla—. Uso: node perf/escenas.mjs */
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
await pg.evaluate(() => { document.querySelector('.cfg-op').scrollIntoView({ block: 'center' }); });
await pg.waitForTimeout(600);

const fallos = [];
const n = await pg.$$eval('.cfg-op', (e) => e.length);
for (let i = 0; i < Math.min(n, 6); i++) {
  await pg.evaluate((i) => { document.querySelectorAll('.cfg-op')[i].click(); }, i);
  await pg.waitForTimeout(120);
  const x = await pg.evaluate(() => {
    const c = document.querySelector('.cfg-esc');
    return {
      clon: !!c,
      tiembla: !!c && c.classList.contains('es-tiembla'),
      brillo: document.querySelectorAll('.cfg-brillo').length,
      viejo: document.querySelectorAll('.cfg-bicho, .cfg-bicho2, .cfg-pies, .cfg-pz, .cfg-astilla, .cfg-polvo').length,
    };
  });
  if (!x.clon) fallos.push(`opción ${i}: al elegir no pasa nada`);
  if (!x.tiembla) fallos.push(`opción ${i}: el bloque no tiembla`);
  if (!x.brillo) fallos.push(`opción ${i}: el bloque no se enciende`);
  if (x.viejo) fallos.push(`opción ${i}: ha vuelto algo de las figuras (${x.viejo} elemento(s))`);
  await pg.waitForTimeout(900);
  const queda = await pg.evaluate(() => document.querySelectorAll('.cfg-esc, .cfg-brillo').length);
  if (queda) fallos.push(`opción ${i}: quedan ${queda} resto(s) a los 1,0 s`);
  await pg.evaluate(() => { const b = document.querySelector('.cfg-atras'); if (b) b.click(); });
  await pg.waitForTimeout(220);
}
await nav.close(); s.close();
if (errs.length) fallos.push('errores JS: ' + errs.join(' | '));
if (fallos.length) { console.error('✗ respuesta al clic:'); fallos.forEach((f) => console.error('  ' + f)); process.exit(1); }
console.log('✓ respuesta al clic — el bloque tiembla y se enciende al elegir, sin figuras y sin restos');
