import fs from 'node:fs';
import { chromium } from 'playwright';
import { levanta, opcionesNavegador } from '../scripts/qa/servidor.mjs';
const AXE = fs.readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const PORT = 4191; const srv = await levanta(PORT); const BASE = 'http://127.0.0.1:' + PORT;
const nav = await chromium.launch(opcionesNavegador());
const RUTAS = ['/precios', '/en/precios', '/contacto', '/en/contacto', '/que-hacemos', '/en/que-hacemos', '/cambios-en-proceso',
  '/servicios/sistemas-a-medida', '/servicios/automatizaciones', '/servicios/agentes-de-ia',
  '/servicios/integraciones', '/servicios/paginas-web',
  '/en/servicios/agentes-de-ia', '/en/servicios/paginas-web'];
const APA = [['raton', { viewport:{width:1440,height:940} }], ['tactil', { viewport:{width:393,height:852}, deviceScaleFactor:3, isMobile:true, hasTouch:true }]];
let total = 0;
for (const [ap, op] of APA) for (const tema of ['dark','light']) for (const ruta of RUTAS) {
  const ctx = await nav.newContext(op);
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
  const pg = await ctx.newPage();
  await pg.goto(BASE + ruta, { waitUntil:'networkidle' });
  await pg.evaluate(t => { document.documentElement.setAttribute('data-theme', t); }, tema);
  await pg.waitForTimeout(900);
  // abre lo plegado para que axe lo vea
  await pg.evaluate(() => { document.querySelectorAll('details').forEach(d => { d.open = true; }); });
  await pg.waitForTimeout(600);
  await pg.addScriptTag({ content: AXE });
  const r = await pg.evaluate(async () => (await window.axe.run(document, { runOnly:{ type:'tag', values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'] } })).violations
    .map(v => ({ id:v.id, impacto:v.impact, n:v.nodes.length, donde:v.nodes.slice(0,2).map(x=>x.target.join(' ')) })));
  if (r.length) { total += r.length; console.log('✗', ap, tema, ruta, JSON.stringify(r)); }
  await ctx.close();
}
console.log(total ? `✗ ${total} incumplimiento(s)` : `✓ axe WCAG 2.2 AA — ${RUTAS.length} rutas × 2 aparatos × 2 temas, sin incumplimientos`);
await nav.close(); srv.close();
