/* EL PANEL DE LA PORTADA, IMPOLUTO.
 *
 * Tres veces se coló una capa oscura encima de la pantalla de Finance, y las
 * tres veces era un velo de legibilidad de OTRO bloque que sangraba por
 * fuera de su caja. Esto lo caza sin mirar: recorre todo lo que se solapa
 * con el panel y falla si algo que no es el panel pinta ahí.
 *
 * Uso: node perf/panel-limpio.mjs
 */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const { levanta, opcionesNavegador } = await import('../scripts/qa/servidor.mjs');

const s = await levanta(4415);
const nav = await chromium.launch(opcionesNavegador());
const fallos = [];

for (const ruta of ['/', '/en/']) {
  for (const [ancho, alto] of [[1280, 900], [1440, 940], [1680, 960], [1920, 1000]]) {
    for (const tema of ['dark', 'light']) {
      const ctx = await nav.newContext({ viewport: { width: ancho, height: alto } });
      await ctx.addInitScript((t) => { try { localStorage.setItem('dcp-tema', t); } catch (e) {} }, tema);
      const pg = await ctx.newPage();
      await pg.goto('http://127.0.0.1:4415' + ruta, { waitUntil: 'networkidle' });
      await pg.waitForTimeout(700);

      const malos = await pg.evaluate(() => {
        const panel = document.querySelector('.v6-panel');
        if (!panel || getComputedStyle(panel).display === 'none') return [];
        const P = panel.getBoundingClientRect();
        const fuera = [];
        const pinta = (cs) =>
          cs.backgroundImage !== 'none' ||
          (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent');
        /* Lo que es del panel no cuenta: el canto y el brillo son suyos. Ni
           el cielo, que va por detrás de todo con z-index negativo. Ni el
           asistente, que es una ventana del usuario, no una capa. */
        const suyo = (e) => e.closest('.v6-panel') || e.closest('.gx') ||
                            e.closest('#chat-widget') || e.closest('#site-header');
        document.querySelectorAll('body *').forEach((e) => {
          if (suyo(e)) return;
          const b = e.getBoundingClientRect();
          if (b.width < 10 || b.height < 10) return;
          if (b.right < P.left || b.left > P.right || b.bottom < P.top || b.top > P.bottom) return;
          const cs = getComputedStyle(e);
          if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') return;
          const nombre = e.tagName.toLowerCase() + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/).join('.') : '');
          if (pinta(cs) && cs.position !== 'static') fuera.push(nombre + ' (fondo propio)');
          for (const ps of ['::before', '::after']) {
            const p = getComputedStyle(e, ps);
            if (p.content === 'none' || p.display === 'none' || p.opacity === '0') continue;
            if (!pinta(p)) continue;
            /* Las rayitas decorativas no son velos: una cejilla lleva un
               guion de 30×1 px delante y eso no tapa nada. Solo cuenta lo
               que es grande en las dos dimensiones, que es lo que sangra. */
            const anc = parseFloat(p.width), altu = parseFloat(p.height);
            if (anc < 80 || altu < 40) continue;
            fuera.push(nombre + ps + ` (${Math.round(anc)}×${Math.round(altu)})`);
          }
        });
        return fuera;
      });
      if (malos.length) fallos.push(`${ruta} @${ancho} ${tema}: ${[...new Set(malos)].join(', ')}`);
      await ctx.close();
    }
  }
}

await nav.close(); s.close();
if (fallos.length) {
  console.error('✗ hay capas pintando encima del panel:');
  fallos.forEach((f) => console.error('  ' + f));
  process.exit(1);
}
console.log('✓ panel limpio — nada pinta sobre la pantalla de Finance en 4 anchos × 2 temas × 2 idiomas');
