#!/usr/bin/env node
/**
 * QA de la demo de D-Code Finance EN FUNCIONAMIENTO (check:demo solo mira
 * cómo se monta). Pulsa las 25 pantallas, en español y en inglés, dentro de
 * la portada y de /sistema-financiero (1440 y 1024 px) y en la aplicación a
 * pantalla completa en el móvil (390 y 320 px), y en cada una comprueba:
 *   · que tenga contenido de verdad (nada de pantallas vacías ni «Sin datos»);
 *   · que no haya texto pisado ni recortado dentro de la aplicación;
 *   · que la versión inglesa no enseñe nada en español —fechas «ago»,
 *     importes «1.200,00 €», estados «Pendiente»— ni la española en inglés;
 *   · que no haya errores de JavaScript.
 * Con --recorrido, además deja correr el recorrido automático una vuelta
 * entera (unos 80 s por caso) y comprueba que salen todos sus pasos, en orden.
 *
 * Uso:  npm run qa:demo
 *       npm run qa:demo -- --recorrido
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { levanta, opcionesNavegador, soloLocal, ROOT } from './qa/servidor.mjs';

const PORT = 9213;
const CASOS = [['/sistema-financiero', 1440], ['/en/sistema-financiero', 1440], ['/', 1024], ['/en/', 1024], ['/sistema-financiero/app', 390], ['/en/sistema-financiero/app', 390], ['/sistema-financiero/app', 320], ['/en/sistema-financiero/app', 320]];

function inspecciona() {
  const raiz = document.querySelector('[data-fdemo-mount] .fdemo-main, [data-fdemo-mount] main, [data-fdemo-mount]');
  const t = (raiz.innerText || '').replace(/\s+/g, ' ');
  const sinDatos = (t.match(/Sin datos|No data|No hay datos|Nothing yet|Aún no hay/gi) || []).length;
  const en = document.documentElement.lang === 'en';
  const otro = en
    ? (t.match(/\d,\d{2}\s?€|\b\d{1,2} (ene|abr|ago|sept|dic)\.? \d{4}|\b(Pendiente|Cobrad[oa]|Enviada|Borrador|Factura|Gasto|Cliente|Proveedor|días|semana)\b/g) || [])
    : (t.match(/€\d|\b\d{1,2} (Aug|Jan|Dec)\b|\b(Pending|Collected|Invoice|Expense|Supplier|Overdue|days ago)\b/g) || []);
  const lineas = []; const tw = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT); let n;
  while ((n = tw.nextNode())) {
    if (!n.textContent.trim()) continue;
    const el = n.parentElement; if (!el || el.closest('[aria-hidden="true"],.fdemo-cursor,.fdemo-tour,svg')) continue;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity < 0.05) continue;
    const fsz = parseFloat(cs.fontSize) || 14; let cx1 = -1e9, cx2 = 1e9, cy1 = -1e9, cy2 = 1e9;
    for (let e = el; e && e !== raiz.parentElement; e = e.parentElement) { const c = getComputedStyle(e); if (c.overflowX !== 'visible') { const b = e.getBoundingClientRect(); cx1 = Math.max(cx1, b.left); cx2 = Math.min(cx2, b.right); } if (c.overflowY !== 'visible') { const b = e.getBoundingClientRect(); cy1 = Math.max(cy1, b.top); cy2 = Math.min(cy2, b.bottom); } }
    const rg = document.createRange(); rg.selectNodeContents(n);
    for (const r of rg.getClientRects()) { if (r.width <= 1) continue; const cy = (r.top + r.bottom) / 2; const L = { el, x1: Math.max(r.left, cx1), x2: Math.min(r.right, cx2), y1: Math.max(cy - 0.42 * fsz, cy1), y2: Math.min(cy + 0.42 * fsz, cy2), t: n.textContent.trim().slice(0, 30) }; if (L.x2 - L.x1 > 1 && L.y2 - L.y1 > 1) lineas.push(L); }
  }
  lineas.sort((a, b) => a.y1 - b.y1); const sol = [];
  for (let i = 0; i < lineas.length; i++) for (let j = i + 1; j < lineas.length && lineas[j].y1 < lineas[i].y2; j++) { const a = lineas[i], b = lineas[j]; if (a.el === b.el) continue; if (Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > 3 && Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > 2) sol.push(`«${a.t}»/«${b.t}»`); }
  let cort = 0; for (const el of raiz.querySelectorAll('*')) { const cs = getComputedStyle(el); if (cs.overflowX === 'hidden' && cs.textOverflow !== 'ellipsis' && el.scrollWidth > el.clientWidth + 2 && el.innerText && el.innerText.trim() && !el.querySelector('canvas,svg')) cort++; }
  return { len: t.length, sinDatos, otro: [...new Set(otro)].slice(0, 5), sol: [...new Set(sol)].slice(0, 3), cort };
}

const server = await levanta(PORT);
const br = await chromium.launch(opcionesNavegador());
let fallos = 0;
for (const [url, w] of CASOS) {
  const ctx = await br.newContext({ viewport: { width: w, height: 950 } }); await soloLocal(ctx);
  const pg = await ctx.newPage(); const errs = [];
  pg.on('pageerror', (e) => errs.push(e.message)); pg.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED|ERR_BLOCKED/.test(m.text())) errs.push(m.text().slice(0, 140)); });
  await pg.goto(`http://127.0.0.1:${PORT}${url}`, { waitUntil: 'networkidle' });
  await pg.locator('[data-fdemo-mount]').first().scrollIntoViewIfNeeded(); await pg.waitForTimeout(3000);
  await pg.mouse.move(w / 2, 500); await pg.mouse.wheel(0, 1); await pg.waitForTimeout(300);   // quien toca, manda: se para el recorrido
  const vistas = await pg.$$eval('[data-role="nav"][data-view]', (a) => [...new Set(a.map((x) => x.getAttribute('data-view')))]);
  const malas = [];
  for (const v of vistas) {
    const item = pg.locator(`[data-role="nav"][data-view="${v}"]`).first();
    const bb = await item.boundingBox();
    if (!bb || bb.x < 0) { await pg.locator('.fdemo-topbar-menu-btn').first().click().catch(() => {}); await pg.waitForTimeout(450); }
    await item.click({ timeout: 5000 }).catch(() => errs.push('no se puede abrir ' + v));
    await pg.waitForTimeout(600);
    const r = await pg.evaluate(inspecciona);
    if (r.len < 400 || r.sinDatos || r.otro.length || r.sol.length || r.cort) malas.push(`${v}: ${r.len < 400 ? 'casi vacía · ' : ''}${r.sinDatos ? 'sin datos · ' : ''}${r.otro.length ? 'otro idioma ' + r.otro.join(' | ') + ' · ' : ''}${r.sol.length ? 'solapes ' + r.sol.join(' ') + ' · ' : ''}${r.cort ? r.cort + ' recortes' : ''}`);
  }
  const mal = malas.length || errs.length || vistas.length < 25;
  if (mal) fallos++;
  console.log(`${mal ? '✗' : '✓'} ${url} @${w}: ${vistas.length} pantallas${malas.length ? '\n   ' + malas.join('\n   ') : ''}${errs.length ? '\n   errores: ' + [...new Set(errs)].slice(0, 3).join(' | ') : ''}`);
  await ctx.close();
}

if (process.argv.includes('--recorrido')) {
  const pasos = (f) => { const s = fs.readFileSync(path.join(ROOT, f), 'utf8'); const i = s.indexOf('var TOUR = ['); const j = s.indexOf('\n    ];', i); return [...s.slice(i, j).matchAll(/dice: '((?:[^'\\]|\\.)*)'/g)].map((m) => m[1].replace(/\\'/g, "'")).filter((x, k, a) => k === 0 || x !== a[k - 1]); };
  for (const [url, f] of [['/sistema-financiero', 'assets/js/finance-demo.js'], ['/en/sistema-financiero', 'assets/js/finance-demo.en.js']]) {
    const esp = pasos(f);
    const ctx = await br.newContext({ viewport: { width: 1440, height: 950 } }); await soloLocal(ctx);
    const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', (e) => errs.push(e.message));
    await pg.goto(`http://127.0.0.1:${PORT}${url}`, { waitUntil: 'networkidle' });
    await pg.locator('[data-fdemo-mount]').first().scrollIntoViewIfNeeded();
    const vistos = []; const t0 = Date.now();
    while (Date.now() - t0 < 240000) {
      const t = await pg.evaluate(() => { const e = document.querySelector('[data-role="tour-txt"]'); return e ? e.textContent.trim() : ''; });
      if (t && vistos[vistos.length - 1] !== t) vistos.push(t);
      if (vistos.filter((x) => x === esp[0]).length >= 2) break;
      await pg.waitForTimeout(250);
    }
    let k = 0; for (const x of vistos) { if (x === esp[k]) k++; if (k === esp.length) break; }
    const bien = k === esp.length && !errs.length;
    if (!bien) fallos++;
    console.log(`${bien ? '✓' : '✗'} recorrido ${url}: ${k}/${esp.length} pasos en orden · ${Math.round((Date.now() - t0) / 1000)} s · errores ${errs.length}`);
    await ctx.close();
  }
}
await br.close(); server.close();
console.log(fallos ? `\n✗ qa:demo — ${fallos} caso(s) con incidencias` : '\n✓ qa:demo — sin incidencias');
process.exit(fallos ? 1 : 0);
