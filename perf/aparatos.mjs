/* Cuánto cuesta la web en un aparato que no es un ordenador.
 * Se emula el aparato Y se frena la CPU (los móviles de gama media van
 * entre 4 y 6 veces más lentos que este portátil), y se mide lo que se
 * nota: cuándo aparece algo, cuánto tiempo el hilo principal está
 * bloqueado, y qué sigue moviéndose después.
 * Uso: node perf/aparatos.mjs [--frena 4]
 */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium, devices } = require('playwright');
const { levanta, opcionesNavegador } = await import('../scripts/qa/servidor.mjs');

const FRENO = +(process.argv.find((a) => a.startsWith('--frena='))?.split('=')[1] || 4);
const APARATOS = [
  ['iPhone 12', devices['iPhone 12']],
  ['iPad (gen 7)', devices['iPad (gen 7)']],
  ['Galaxy S9+', devices['Galaxy S9+']],
];
const RUTAS = ['/', '/contacto', '/precios', '/que-hacemos'];

const s = await levanta(4560);
const nav = await chromium.launch(opcionesNavegador());
const filas = [];

for (const [nombre, ap] of APARATOS) {
  for (const ruta of RUTAS) {
    const ctx = await nav.newContext({ ...ap });
    const pg = await ctx.newPage();
    const cdp = await ctx.newCDPSession(pg);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: FRENO });

    const t0 = Date.now();
    await pg.goto('http://127.0.0.1:4560' + ruta, { waitUntil: 'domcontentloaded' });
    /* Tareas largas: lo que bloquea el dedo. */
    await pg.evaluate(() => {
      window.__largas = [];
      try {
        new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__largas.push(Math.round(e.duration)); })
          .observe({ entryTypes: ['longtask'] });
      } catch (e) {}
    });
    await pg.waitForLoadState('networkidle').catch(() => {});
    await pg.waitForTimeout(2500);

    const m = await pg.evaluate(() => {
      const pin = performance.getEntriesByType('paint').find((p) => p.name === 'first-contentful-paint');
      const largas = window.__largas || [];
      const bloqueo = largas.reduce((a, d) => a + Math.max(0, d - 50), 0);
      const rec = performance.getEntriesByType('resource');
      const bytes = rec.reduce((a, r) => a + (r.transferSize || 0), 0);
      /* Qué sigue moviéndose cuando ya está todo cargado: cada animación en
         marcha es trabajo por fotograma, para siempre. */
      let animando = 0;
      try { animando = document.getAnimations().filter((a) => a.playState === 'running').length; } catch (e) {}
      const lienzos = document.querySelectorAll('canvas').length;
      const desenfoques = [...document.querySelectorAll('body *')].filter((e) => {
        const c = getComputedStyle(e);
        return (c.backdropFilter && c.backdropFilter !== 'none') || (c.filter && c.filter.includes('blur'));
      }).length;
      return {
        fcp: pin ? Math.round(pin.startTime) : null,
        largas: largas.length, bloqueo: Math.round(bloqueo), peor: largas.length ? Math.max(...largas) : 0,
        kb: Math.round(bytes / 1024), animando, lienzos, desenfoques,
        clase: document.documentElement.className.trim() || '—',
      };
    });
    filas.push({ aparato: nombre, ruta, ...m, 'total ms': Date.now() - t0 });
    await ctx.close();
  }
}
await nav.close(); s.close();
console.log(`CPU frenada ×${FRENO}`);
console.table(filas);
