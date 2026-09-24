#!/usr/bin/env node
/*
 * QUÉ SE PIDE, CUÁNDO Y EN QUÉ APARATO.
 *
 * Nació de una queja concreta: «en el iPad y el teléfono da tirones al entrar
 * y las demos tardan en cargar». La causa medida era que el HTML pedía siete
 * ficheros con «defer» —330 KB— que se compilan seguidos en cuanto termina de
 * leerse el HTML, y que 218 de esos KB (dcp6/dcp8, el campo de partículas) no
 * hacen absolutamente nada en un aparato táctil.
 *
 * Esta prueba vigila el arreglo, que es de reparto y por eso se puede
 * comprobar sin cronómetro:
 *   · en táctil, el campo de partículas NO SE DESCARGA;
 *   · con ratón sí, y su lienzo se monta;
 *   · lo de más abajo (dcp10, dcode-os, main-b) no va con «defer»: llega
 *     después, en un hueco, pero llega SIEMPRE —aunque nadie baje—;
 *   · y la página queda entera: DCP, el cielo donde toca, la galería, el
 *     centro operativo y el asistente.
 *
 * Uso: node scripts/qa-carga.mjs
 */
import { chromium } from 'playwright';
import { levanta, opcionesNavegador } from './qa/servidor.mjs';

const APARATOS = [
  ['PC 1440',   { viewport:{width:1440,height:900},  deviceScaleFactor:1 }, true],
  ['iPad',      { viewport:{width:1024,height:1366}, deviceScaleFactor:2, isMobile:true, hasTouch:true }, false],
  ['Móvil 393', { viewport:{width:393,height:852},   deviceScaleFactor:3, isMobile:true, hasTouch:true }, false],
];
/* fichero → en qué páginas tiene que estar (y en cuáles no se mira) */
const DIFERIDOS = ['dcp10.js', 'dcode-os.js', 'main-b.js'];

const PORT = 9690; await levanta(PORT);
const br = await chromium.launch(opcionesNavegador());
const fallos = [];

for (const [nombre, op, conRaton] of APARATOS) {
  for (const ruta of ['/', '/que-hacemos']) {
    const donde = `${nombre} · ${ruta}`;
    const ctx = await br.newContext(op);
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    const pg = await ctx.newPage();
    const pedidos = [];
    pg.on('request', (r) => {
      const u = r.url().split('/').pop().split('?')[0];
      if (/\.js$/.test(u)) pedidos.push(u);
    });
    await pg.goto(`http://127.0.0.1:${PORT}${ruta}`, { waitUntil: 'load' });
    /* Tiempo de sobra para el hueco libre, sin tocar la página: si hiciera
       falta bajar para que llegue, no valdría. */
    await pg.waitForTimeout(6500);

    const campo = ruta === '/' ? 'dcp6.js' : 'dcp8.js';
    const pedido = pedidos.includes(campo);
    if (conRaton && !pedido) fallos.push(`${donde}: con ratón tiene que pedirse ${campo}`);
    if (!conRaton && pedido) fallos.push(`${donde}: en táctil NO puede pedirse ${campo} (son 154 KB que no hacen nada)`);

    const estado = await pg.evaluate(() => ({
      dcp: !!(window.DCP && window.DCP.campoVivo),
      quieto: document.documentElement.classList.contains('cielo-quieto'),
      lienzo: document.querySelectorAll('.field canvas').length,
      conDefer: [].slice.call(document.querySelectorAll('script[defer][src]'))
        .map((s) => s.src.split('/').pop().split('?')[0]),
      marcas: [].slice.call(document.querySelectorAll('script[type^="dcp/"]')).length,
      galeria: !!document.querySelector('[data-gal] .gal-tab'),
      os: !!document.getElementById('dcode-os'),
    }));
    if (!estado.dcp) fallos.push(`${donde}: no hay window.DCP`);
    if (estado.quieto === conRaton) fallos.push(`${donde}: html.cielo-quieto está ${estado.quieto ? 'puesto' : 'sin poner'} y no debería`);
    if (conRaton && !estado.lienzo) fallos.push(`${donde}: con ratón falta el lienzo del campo`);
    if (!conRaton && estado.lienzo) fallos.push(`${donde}: en táctil no puede haber lienzo del campo`);
    for (const f of DIFERIDOS) {
      if (estado.conDefer.includes(f)) fallos.push(`${donde}: ${f} sigue con «defer»; tiene que ir con type="dcp/cerca"`);
    }
    /* Y llegan, sin bajar ni un píxel. */
    for (const f of DIFERIDOS) {
      const suyo = f === 'dcode-os.js' ? estado.os : f === 'dcp10.js' ? (estado.galeria || ruta === '/') : true;
      if (suyo && ruta === '/' && !pedidos.includes(f)) fallos.push(`${donde}: ${f} no llegó nunca (tiene que cargarse en el primer hueco, aunque nadie baje)`);
    }
    await pg.close();
    await ctx.close();
  }
}
await br.close();
if (fallos.length) { console.error(fallos.map((f) => '✗ ' + f).join('\n')); console.error(`\n${fallos.length} problema(s).`); process.exit(1); }
console.log('✓ qa:carga — el campo de partículas solo viaja con ratón; lo de más abajo llega en un hueco y llega siempre; la página queda entera en los tres aparatos');
process.exit(0);
