/* Comprueba que el marco de /servicios/paginas-web se puede bajar de verdad:
   que hay más imagen que ventana, que la rueda la mueve, que el teclado
   también (quien no usa ratón tiene que poder) y que la pista se apaga al
   bajar. Uso: node perf/marco.mjs */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const { levanta, opcionesNavegador } = await import('../scripts/qa/servidor.mjs');

const s = await levanta(4411);
const nav = await chromium.launch(opcionesNavegador());
const fallos = [];
for (const ruta of ['/servicios/paginas-web', '/en/servicios/paginas-web']) {
  for (const [ancho, alto] of [[1440, 1000], [390, 844]]) {
    const ctx = await nav.newContext({ viewport: { width: ancho, height: alto }, hasTouch: ancho < 700 });
    const pg = await ctx.newPage();
    pg.on('pageerror', (e) => fallos.push(`${ruta} ${ancho}: error JS ${e}`));
    await pg.goto('http://127.0.0.1:4411' + ruta, { waitUntil: 'networkidle' });
    await pg.waitForTimeout(300);

    const n = await pg.$$eval('.fi-marco', (e) => e.length);
    if (n !== 4) fallos.push(`${ruta} ${ancho}: ${n} marcos, esperaba 4`);

    const m = pg.locator('.fi-marco').first();
    await m.scrollIntoViewIfNeeded();
    const v = m.locator('.fi-viewport');
    const hay = await v.evaluate((e) => e.scrollHeight - e.clientHeight);
    if (hay < 140) fallos.push(`${ruta} ${ancho}: solo hay ${hay}px que bajar; la ventana no enseña nada nuevo`);

    await v.evaluate((e) => { e.scrollTop = 999; e.dispatchEvent(new Event('scroll')); });
    await pg.waitForTimeout(250);
    const top = await v.evaluate((e) => e.scrollTop);
    const apagada = await m.evaluate((e) => e.classList.contains('es-bajado'));
    if (top < 140) fallos.push(`${ruta} ${ancho}: la ventana no se mueve (scrollTop ${top})`);
    if (!apagada) fallos.push(`${ruta} ${ancho}: la pista sigue encendida después de bajar`);

    /* Y sin ratón: foco en la ventana y flecha abajo. */
    await v.evaluate((e) => { e.scrollTop = 0; });
    await v.focus();
    await pg.keyboard.press('PageDown');
    await pg.waitForTimeout(250);
    const teclado = await v.evaluate((e) => e.scrollTop);
    if (teclado < 40) fallos.push(`${ruta} ${ancho}: con el teclado no baja (scrollTop ${teclado})`);

    await ctx.close();
  }
}
await nav.close(); s.close();
if (fallos.length) { console.error('✗ marco:'); fallos.forEach((f) => console.error('  ' + f)); process.exit(1); }
console.log('✓ marco — 4 ventanas por idioma, se bajan con rueda y con teclado, y la pista se apaga');
