#!/usr/bin/env node
/**
 * QA visual: lo que qa:ds no mira.
 *
 * En las 72 páginas y a 320, 360, 390, 393, 430, 768, 834, 1024, 1280 y 1440 px:
 *   · SOLAPES de texto: dos líneas de elementos distintos que se pisan. Se
 *     mide la banda donde están los glifos (±0,42 em del centro de la línea),
 *     no la caja de la fuente, y se recorta a lo que un antepasado deja ver
 *     (una elipsis no es un solape).
 *   · TEXTO CORTADO por un contenedor que recorta (overflow hidden/clip).
 *   · BOTONES PEGADOS a un texto: menos de 6 px encima o debajo.
 *   · SCROLL HORIZONTAL de la página.
 *   · SECCIONES VACÍAS de más de 260 px sin texto ni imagen.
 *   · ERRORES de JavaScript.
 * Antes de medir, todo lo que aparece al hacer scroll se da por aparecido: si
 * no, lo que sigue invisible no se mide (así se escapó un solape real).
 *
 * Se prueba a sí mismo con una página con un defecto de cada tipo, y con un
 * caso que NO es defecto (una elipsis): si el detector no los distingue, falla.
 *
 * Uso:  npm run qa:solapes                  (todo)
 *       npm run qa:solapes -- /faq /blog/   (algunas páginas)
 *       ABIERTOS=1 npm run qa:solapes       (con todos los desplegables abiertos)
 */
import { chromium } from 'playwright';
import { levanta, paginas, opcionesNavegador, soloLocal } from './qa/servidor.mjs';

const PORT = 9212;
const ANCHOS = (process.env.ANCHOS || '320,360,390,393,430,768,834,1024,1280,1440').split(',').map(Number);
const META = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body><main>
<section style="position:relative;height:300px"><p style="position:absolute;top:10px;left:10px;font-size:20px">Texto que se pisa con otro</p><p style="position:absolute;top:18px;left:40px;font-size:20px">Otro texto encima</p></section>
<section><div style="width:120px;height:20px;overflow:hidden"><p style="width:400px;margin:0">Este texto no cabe en su caja y queda cortado</p></div></section>
<section><p style="margin:0">Un párrafo justo encima</p><a class="btn" href="#" style="display:inline-block">Botón pegado</a></section>
<section><div style="display:flex;width:200px"><div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0">Texto largo con elipsis que no es un solape</div><span>Etiqueta</span></div></section>
<section style="height:400px"></section><script>throw new Error('error de prueba')</script></main></body></html>`;

function mide() {
  const out = { ov: document.documentElement.scrollWidth - innerWidth, solapes: [], cortes: [], pegados: [], vacias: [] };
  const excl = (el) => el.closest('.demo-host,[data-fdemo-mount],[aria-hidden="true"],.chat-widget,#site-header,.skip-link,.sr-only,noscript,script,style,svg,.field,canvas,.cookie-banner,.dcx,.dcx-now');
  const visible = (el) => {
    if (el.checkVisibility && !el.checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true })) return false;
    for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05 || cs.position === 'fixed') return false; }
    return true;
  };
  const conElipsis = (e) => { for (let x = e; x && x !== document.body; x = x.parentElement) if (getComputedStyle(x).textOverflow === 'ellipsis') return true; return false; };
  const lineas = []; const sy = scrollY;
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  while ((n = tw.nextNode())) {
    if (!n.textContent.trim()) continue;
    const el = n.parentElement; if (!el || excl(el) || !visible(el)) continue;
    const fsz = parseFloat(getComputedStyle(el).fontSize) || 16;
    let cx1 = -1e9, cx2 = 1e9, cy1 = -1e9, cy2 = 1e9;
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const c = getComputedStyle(e); if (c.overflowX === 'visible' && c.overflowY === 'visible') continue;
      const b = e.getBoundingClientRect();
      if (c.overflowX !== 'visible') { cx1 = Math.max(cx1, b.left); cx2 = Math.min(cx2, b.right); }
      if (c.overflowY !== 'visible') { cy1 = Math.max(cy1, b.top + sy); cy2 = Math.min(cy2, b.bottom + sy); }
    }
    const rg = document.createRange(); rg.selectNodeContents(n);
    for (const r of rg.getClientRects()) {
      if (r.width <= 1 || r.height <= 1) continue;
      const cy = (r.top + r.bottom) / 2 + sy;
      const L = { el, t: n.textContent.trim().slice(0, 40), x1: Math.max(r.left, cx1), x2: Math.min(r.right, cx2), y1: Math.max(cy - 0.42 * fsz, cy1), y2: Math.min(cy + 0.42 * fsz, cy2), rx1: r.left, rx2: r.right, ry1: r.top + sy, ry2: r.bottom + sy };
      L.oculto = !(L.x2 - L.x1 > 1 && L.y2 - L.y1 > 1);
      lineas.push(L);
    }
  }
  const vis = lineas.filter((l) => !l.oculto).sort((a, b) => a.y1 - b.y1);
  const vistos = new Set();
  for (let i = 0; i < vis.length; i++) for (let j = i + 1; j < vis.length && vis[j].y1 < vis[i].y2; j++) {
    const a = vis[i], b = vis[j]; if (a.el === b.el) continue;
    const ox = Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1), oy = Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1);
    if (ox > 3 && oy > 2) { const k = a.t + '|' + b.t; if (!vistos.has(k)) { vistos.add(k); out.solapes.push(`«${a.t}» / «${b.t}» (${Math.round(ox)}×${Math.round(oy)})`); } }
  }
  const cort = new Set();
  for (const l of lineas) {
    if (conElipsis(l.el)) continue;
    for (let e = l.el; e && e !== document.body; e = e.parentElement) {
      const cs = getComputedStyle(e); const oxh = cs.overflowX !== 'visible', oyh = cs.overflowY !== 'visible';
      if (!oxh && !oyh) continue;
      if (['auto', 'scroll'].includes(cs.overflowX) || ['auto', 'scroll'].includes(cs.overflowY)) break;
      const b = e.getBoundingClientRect(); const top = b.top + scrollY, bot = b.bottom + scrollY; const h = l.ry2 - l.ry1;
      const fuera = (oxh && (l.rx1 < b.left - 2 || l.rx2 > b.right + 2)) || (oyh && (l.ry1 + h * 0.2 < top - 2 || l.ry2 - h * 0.2 > bot + 2));
      if (fuera && b.width > 2 && b.height > 2 && !cort.has(l.t)) { cort.add(l.t); out.cortes.push(`«${l.t}» en <${e.tagName.toLowerCase()}.${(e.className + '').split(' ')[0]}>`); }
      break;
    }
  }
  for (const btn of document.querySelectorAll('a.btn,button.btn,.btn,summary')) {
    if (excl(btn) || !visible(btn)) continue;
    const b = btn.getBoundingClientRect(); if (b.width < 2) continue;
    if (btn.tagName === 'SUMMARY' && b.height > 80) continue;   // la cabecera de un desplegable no es un botón
    const bt = b.top + scrollY, bb = b.bottom + scrollY;
    for (const l of vis) {
      if (btn.contains(l.el)) continue;
      if (Math.min(l.x2, b.right) - Math.max(l.x1, b.left) < 4) continue;
      const abajo = bt - l.ry2, arriba = l.ry1 - bb;
      if ((abajo >= -1 && abajo < 6) || (arriba >= -1 && arriba < 6)) { out.pegados.push(`[${(btn.textContent || '').trim().slice(0, 24)}] ↔ «${l.t}»`); break; }
    }
  }
  for (const s of document.querySelectorAll('main section, main > div')) {
    const b = s.getBoundingClientRect(); if (b.height < 260 || excl(s)) continue;
    if (!s.innerText.trim() && !s.querySelector('img,canvas,svg,.demo-host,video,iframe')) out.vacias.push(`<${s.tagName.toLowerCase()}.${(s.className + '').split(' ')[0]}> ${Math.round(b.height)} px`);
  }
  out.solapes = out.solapes.slice(0, 6); out.cortes = out.cortes.slice(0, 6); out.pegados = [...new Set(out.pegados)].slice(0, 6);
  return out;
}

async function audita(ctx, url, w) {
  const pg = await ctx.newPage();
  await pg.setViewportSize({ width: w, height: w < 500 ? 800 : 900 });
  const errs = [];
  pg.on('pageerror', (e) => errs.push(e.message.slice(0, 140)));
  pg.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED|ERR_BLOCKED|net::ERR_ABORTED/.test(m.text())) errs.push(m.text().slice(0, 140)); });
  try { await pg.goto(`http://127.0.0.1:${PORT}${url}`, { waitUntil: 'networkidle', timeout: 45000 }); } catch (e) { errs.push('carga: ' + e.message.slice(0, 80)); }
  await pg.evaluate(async () => { const h = document.body.scrollHeight; for (let y = 0; y < h; y += Math.round(innerHeight * 0.7)) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
  await pg.evaluate((abiertos) => {
    document.querySelectorAll('.rise,.rise-s,.rise-l').forEach((e) => e.classList.add('in'));
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.reveal-up,.reveal-blur').forEach((e) => e.classList.add('is-visible'));
    document.querySelectorAll('.motion-journey').forEach((e) => e.classList.add('is-settled'));
    if (abiertos) { window.__dcpImprimiendo = true; document.querySelectorAll('details').forEach((d) => (d.open = true)); document.querySelectorAll('.accordion-item').forEach((i) => i.classList.add('open')); }
  }, !!process.env.ABIERTOS);
  await pg.waitForTimeout(1300);
  const r = await pg.evaluate(mide);
  r.errs = [...new Set(errs)].slice(0, 4);
  await pg.close();
  return r;
}

const server = await levanta(PORT, { '/__meta-solapes': META });
const br = await chromium.launch(opcionesNavegador());

// 1. Meta-prueba
{
  const ctx = await br.newContext(); await soloLocal(ctx);
  const m = await audita(ctx, '/__meta-solapes', 390); await ctx.close();
  const bien = m.solapes.length === 1 && m.cortes.length === 1 && m.pegados.length === 1 && m.vacias.length === 1 && m.errs.some((e) => /error de prueba/.test(e));
  if (!bien) { console.error('✗ meta-prueba: el detector no distingue los defectos plantados', JSON.stringify(m)); await br.close(); server.close(); process.exit(1); }
  console.log('✓ meta-prueba: caza el solape, el corte, el botón pegado, la sección vacía y el error, y deja pasar la elipsis');
}

// 2. Todas las páginas
const lista = process.argv.slice(2).length ? process.argv.slice(2) : paginas();
const tareas = []; for (const w of ANCHOS) for (const u of lista) tareas.push([u, w]);
const malos = []; let i = 0;
async function obrero() {
  const ctx = await br.newContext(); await soloLocal(ctx);
  while (i < tareas.length) { const [u, w] = tareas[i++]; const r = await audita(ctx, u, w); if (r.ov > 0 || r.solapes.length || r.cortes.length || r.pegados.length || r.vacias.length || r.errs.length) malos.push({ u, w, ...r }); }
  await ctx.close();
}
await Promise.all(Array.from({ length: +(process.env.PAR || 4) }, obrero));
await br.close(); server.close();

for (const m of malos) {
  console.log(`✗ ${m.u} @${m.w}` + (m.ov > 0 ? ` · scroll horizontal ${m.ov} px` : ''));
  for (const k of ['solapes', 'cortes', 'pegados', 'vacias', 'errs']) for (const v of m[k]) console.log(`   ${k}: ${v}`);
}
console.log(`\n${lista.length} páginas × ${ANCHOS.length} anchos = ${tareas.length} cargas · con incidencias: ${malos.length}`);
process.exit(malos.length ? 1 : 0);
