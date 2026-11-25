#!/usr/bin/env node
/*
 * QUÉ JAVASCRIPT SE ENVÍA, Y QUE NO ESTORBE.
 *
 * DE DÓNDE VIENE ESTA PRUEBA. Nació de una queja concreta: «en el iPad y el
 * teléfono da tirones al entrar». La causa medida era que el HTML pedía siete
 * ficheros con «defer» —330 KB— y que 218 de esos KB (dcp6/dcp8, el campo de
 * partículas) no hacían absolutamente nada en un aparato táctil.
 *
 * POR QUÉ ESTÁ REESCRITA (25/11/2026). Aquel problema se resolvió de la forma
 * más radical posible: el rediseño v2 se llevó por delante el campo de
 * partículas y todo su reparto. dcp6.js, dcp8.js, dcp10.js y main-b.js ya no
 * los carga ningún HTML, y `window.DCP` no existe.
 *
 * Pero la prueba se quedó vigilándolos. Decía cosas como «con ratón tiene que
 * pedirse dcp6.js» de un fichero que nadie pide, y daba 20 fallos fijos de
 * páginas que están bien. Una alarma que suena siempre es una alarma apagada:
 * cuando de verdad entre un script que bloquee el pintado, nadie lo va a ver
 * entre el ruido.
 *
 * LA INTENCIÓN SIGUE VALIENDO, así que se comprueba lo que hoy importa:
 *   · que ningún JavaScript dé 404 (un módulo que no llega rompe en silencio
 *     la parte de la página que dependía de él);
 *   · que nada BLOQUEE el pintado: todo <script src> del <head> va con
 *     `type="module"`, `defer` o `async`;
 *   · que el peso de JavaScript por página no se dispare;
 *   · y que la página no deje errores en la consola.
 *
 * Uso: node scripts/qa-carga.mjs
 */
import { chromium } from 'playwright';
import { levanta, opcionesNavegador } from './qa/servidor.mjs';

const APARATOS = [
  ['PC 1440',   { viewport:{width:1440,height:900},  deviceScaleFactor:1 }],
  ['iPad',      { viewport:{width:1024,height:1366}, deviceScaleFactor:2, isMobile:true, hasTouch:true }],
  ['Móvil 393', { viewport:{width:393,height:852},   deviceScaleFactor:3, isMobile:true, hasTouch:true }],
];
const RUTAS = ['/', '/que-hacemos', '/precios', '/sistema-financiero', '/contacto'];

/* Techo de JavaScript por página, sin comprimir. El sitio de hoy anda muy por
   debajo; está puesto para que una librería nueva se note el día que entre, no
   seis meses después. */
const TOPE_JS_KB = 260;

const PORT = 9690; await levanta(PORT);
const br = await chromium.launch(opcionesNavegador());
const fallos = [];
let cargas = 0;

for (const [nombre, op] of APARATOS) {
  for (const ruta of RUTAS) {
    const donde = `${nombre} · ${ruta}`;
    const ctx = await br.newContext(op);
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    const pg = await ctx.newPage();

    const errores = [];
    const js = [];
    pg.on('pageerror', (e) => errores.push(String(e.message).slice(0, 140)));
    pg.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED|ERR_BLOCKED|turnstile|cal\.com/i.test(m.text())) errores.push(m.text().slice(0, 140)); });
    pg.on('response', async (r) => {
      const u = new URL(r.url()).pathname;
      if (!/\.m?js$/.test(u)) return;
      const largo = Number(r.headers()['content-length'] || 0);
      js.push({ u, estado: r.status(), bytes: largo });
    });

    await pg.goto(`http://127.0.0.1:${PORT}${ruta}`, { waitUntil: 'load' });
    await pg.waitForTimeout(2500);   // deja llegar lo que carga en el primer hueco
    cargas++;

    for (const f of js.filter((x) => x.estado >= 400)) fallos.push(`${donde}: ${f.u} devuelve ${f.estado}`);

    /* Lo que bloquea el pintado se ve en el HTML, no en la red: un <script
       src> en el <head> sin module/defer/async para el navegador en seco. */
    const bloqueantes = await pg.$$eval('head script[src]', (ss) => ss
      .filter((s) => !s.defer && !s.async && s.type !== 'module')
      .map((s) => new URL(s.src).pathname));
    for (const b of bloqueantes) fallos.push(`${donde}: ${b} bloquea el pintado (ponlo con type="module", defer o async)`);

    const kb = Math.round(js.filter((x) => x.estado < 400).reduce((a, b) => a + b.bytes, 0) / 1024);
    if (kb > TOPE_JS_KB) fallos.push(`${donde}: ${kb} KB de JavaScript (el tope son ${TOPE_JS_KB} KB)`);

    if (errores.length) fallos.push(`${donde}: error de JavaScript — ${[...new Set(errores)][0]}`);

    await ctx.close();
  }
}
await br.close();

if (fallos.length) {
  console.error(fallos.map((f) => '✗ ' + f).join('\n'));
  console.error(`\n${fallos.length} problema(s) en ${cargas} cargas.`);
  process.exit(1);
}
console.log(`✓ qa:carga — ${cargas} cargas (${APARATOS.length} aparatos × ${RUTAS.length} páginas): ningún JavaScript roto, ninguno bloqueando el pintado, ninguno pasándose de ${TOPE_JS_KB} KB`);
process.exit(0);
