/* LO QUE NO SE DESCARGA.
 *
 * Tres cosas que costaban ancho de banda y CPU sin pintar un solo píxel, y
 * que es facilísimo volver a romper sin enterarse —basta tocar el <picture>
 * del panel, la hoja del modo claro o la precarga del cielo—:
 *
 *   1. Las capturas del panel financiero. El panel está en display:none por
 *      debajo de 1101 px, así que en el teléfono y en la tableta no debe
 *      viajar ni un byte de ellas.
 *   2. La captura del tema que NO se está viendo. Son ~208 KB de una imagen
 *      que nadie mira; viven apagadas en data-srcset y se encienden solas al
 *      cambiar de tema.
 *   3. tema-claro.css en modo oscuro. Son ~52 KB cuyas reglas TODAS cuelgan
 *      de html[data-theme="light"]: se sigue descargando (para que el cambio
 *      de tema sea instantáneo) pero con media="not all", o sea sin bloquear
 *      el primer pintado ni cotejar un selector.
 *   4. El cielo del otro tema, que en táctil ya no se adelanta.
 *
 * Uso: node perf/peso-aparatos.mjs
 */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium, devices } = require('playwright');
const { levanta, opcionesNavegador } = await import('../scripts/qa/servidor.mjs');

const s = await levanta(4562);
const nav = await chromium.launch(opcionesNavegador());
const mal = [];
const bien = [];

async function abre(ap, ruta, tema) {
  const ctx = await nav.newContext({ ...ap });
  const pg = await ctx.newPage();
  if (tema) await pg.addInitScript((t) => { try { localStorage.setItem('dcp-tema', t); } catch (e) {} }, tema);
  await pg.goto(`http://127.0.0.1:4562${ruta}`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(3200); // la precarga del cielo va en requestIdleCallback
  return { ctx, pg };
}
const bajadas = (pg, re) => pg.evaluate((r) => performance.getEntriesByType('resource')
  .map((x) => x.name.split('/').pop()).filter((n) => new RegExp(r).test(n)), re.source);

for (const [nombre, ap] of [['iPhone 12', devices['iPhone 12']], ['iPad (gen 7)', devices['iPad (gen 7)']]]) {
  const { ctx, pg } = await abre(ap, '/', 'dark');
  const caps = await bajadas(pg, /finance-(dark|light)/);
  if (caps.length) mal.push(`${nombre}: se baja ${caps.length} captura(s) del panel, que ahí ni se ve — ${caps.join(', ')}`);
  else bien.push(`${nombre}: 0 capturas del panel`);

  const claras = await bajadas(pg, /-claro\.[0-9a-f]+\.png/);
  if (claras.length) mal.push(`${nombre}: adelanta el cielo del otro tema (${claras.length} PNG) para un botón que ahí casi nadie toca`);
  else bien.push(`${nombre}: 0 PNG del cielo claro`);

  const m = await pg.evaluate(() => (document.querySelector('link[data-claro]') || {}).media);
  if (m !== 'not all') mal.push(`${nombre}: tema-claro.css entra con media="${m}" en oscuro; tiene que ser "not all"`);
  else bien.push(`${nombre}: tema-claro.css fuera del camino crítico`);
  await ctx.close();
}

/* Escritorio: una sola captura, la del tema que se ve. Y al cambiar de tema,
   la otra tiene que aparecer —si no, el ahorro sería un panel en blanco. */
{
  const { ctx, pg } = await abre({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }, '/', 'dark');
  const caps = await bajadas(pg, /finance-(dark|light)/);
  if (caps.some((n) => n.includes('light'))) mal.push(`escritorio en oscuro: se baja también la captura clara (${caps.join(', ')})`);
  else if (!caps.some((n) => n.includes('dark'))) mal.push('escritorio en oscuro: no se baja NINGUNA captura; el panel se ve vacío');
  else bien.push(`escritorio: solo la captura del tema visible (${caps.join(', ')})`);

  await pg.evaluate(() => window.dcpCap && window.dcpCap('claro'));
  await pg.waitForTimeout(1200);
  const src = await pg.evaluate(() => (document.querySelector('.v6-cap .es-claro') || {}).currentSrc || '');
  if (!/finance-light/.test(src)) mal.push(`escritorio: al encender el tema claro la captura no llega (currentSrc = ${src.split('/').pop() || 'nada'})`);
  else bien.push('escritorio: la captura clara se enciende al cambiar de tema');
  await ctx.close();
}

await nav.close(); s.close();
if (mal.length) { console.error('✗ peso:aparatos\n  - ' + mal.join('\n  - ')); process.exit(1); }
console.log('✓ peso:aparatos — ' + bien.join('; '));
