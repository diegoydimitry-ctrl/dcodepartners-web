/**
 * QA del D-Code Design System sobre la web estática.
 *
 * Levanta el sitio tal y como se sirve en Vercel y comprueba, en las 72
 * páginas y a 1440, 1280, 1024, 768 y 390 px:
 *   · que ninguna página tenga scroll horizontal;
 *   · que el fondo sea siempre el mismo token de noche;
 *   · que ningún elemento clicable esté pintado en cian (en el DS el cian
 *     es el color del dato y nunca es clicable);
 *   · que no haya texto por debajo de 12 px que no sea una etiqueta en
 *     mayúsculas;
 *   · que ningún importe se escriba sin agrupar los miles («1200 €» junto a
 *     «28.442,50 €» rompe la lectura por longitud);
 *   · que en táctil todo objetivo pulsable llegue a 44 px —midiendo el
 *     área real, no la caja visible—;
 *   · que todo campo de formulario tenga nombre accesible;
 *   · que no haya errores de consola.
 *
 * Uso: npm run qa:ds            (todas las páginas)
 *      npm run qa:ds -- /faq    (solo algunas)
 */
import { chromium } from 'playwright';
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

import { fileURLToPath } from 'node:url';
import { readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 9211;
const MIME = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.ico':'image/x-icon','.xml':'application/xml','.txt':'text/plain'};

const server = http.createServer(async (req,res)=>{
  let p = decodeURIComponent(req.url.split('?')[0]);
  let f = path.join(ROOT, p);
  try{
    let st = await stat(f).catch(()=>null);
    if ((!st || st.isDirectory()) && !p.endsWith('/')) {
      const alt = f + '.html'; const ast = await stat(alt).catch(()=>null);
      if (ast) { f = alt; st = ast; }
    }
    if (st && st.isDirectory()) { f = path.join(f,'index.html'); st = await stat(f).catch(()=>null); }
    if (!st) { res.writeHead(404); return res.end('404'); }
    const body = await readFile(f);
    res.writeHead(200,{'Content-Type': MIME[path.extname(f)] || 'application/octet-stream'});
    res.end(body);
  }catch(e){ res.writeHead(500); res.end(String(e)); }
});
await new Promise(r=>server.listen(PORT,r));

async function todasLasPaginas(dir = ROOT, base = '') {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'scripts' || e.name === 'docs' || e.name === 'lib' || e.name === 'api' || e.name === 'assets') continue;
    const rel = base + '/' + e.name;
    if (e.isDirectory()) out.push(...await todasLasPaginas(path.join(dir, e.name), rel));
    else if (e.name.endsWith('.html')) out.push(rel.replace(/index\.html$/, '').replace(/\.html$/, '') || '/');
  }
  return out;
}

const pages = process.argv.length > 2 ? process.argv.slice(2) : (await todasLasPaginas()).sort();
const WIDTHS = [1440,1280,1024,768,390];
// En este entorno Chromium vive en /opt/pw-browsers; en CI, donde lo deja
// `npx playwright install` (con la ruta fija, el trabajo de CI no arrancaba).
const browser = await chromium.launch(existsSync('/opt/pw-browsers/chromium') ? { executablePath:'/opt/pw-browsers/chromium' } : {});
const issues = [];
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport:{width:w,height:w<=768?844:900}, hasTouch:w<=768, isMobile:w<=768, deviceScaleFactor:1 });
  await ctx.route('**/*', r => { const u = r.request().url(); if (u.startsWith('http://127.0.0.1:')) return r.continue(); return r.abort(); });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e=>errs.push(String(e).slice(0,120)));
  page.on('console', m=>{ if(m.type()==='error') errs.push(m.text().slice(0,120)); });
  for (const p of pages) {
    errs.length = 0;
    await page.goto(`http://127.0.0.1:${PORT}${p}`, { waitUntil:'domcontentloaded' });
    await page.waitForTimeout(160);
    const r = await page.evaluate((w)=>{
      const out = { ov: document.documentElement.scrollWidth - w, bg: getComputedStyle(document.body).backgroundColor, cyanClick: [], tiny: [], touch: [], noLabel: [], importes: [] };
      /*
        AGRUPACIÓN DE MILES SIEMPRE (regla del DS). Un importe de cuatro
        cifras sin punto —«1200,00 €»— junto a otro de cinco —«28.442,50 €»—
        rompe la lectura por longitud, que es como se leen las cifras de un
        vistazo. Se busca sobre el texto pintado, no sobre el código: así
        también caza lo que escribe el JavaScript en tiempo de ejecución.
      */
      for (const [, cifra] of (document.body.innerText || '').matchAll(/(?<![\d.,])(\d{4,})(?:,\d{2})?\s*€/g)) {
        out.importes.push(cifra + '… €');
      }
      const cyan = /rgb\(67,\s*224,\s*255\)/;
      for (const el of document.querySelectorAll('a,button,[role=button],summary')) {
        const b = el.getBoundingClientRect(); if (!b.width || !b.height) continue;
        const cs = getComputedStyle(el);
        if (cyan.test(cs.color) || cyan.test(cs.backgroundColor)) out.cyanClick.push((el.textContent||'').trim().slice(0,24)+'|'+(el.className+'').trim().split(/\s+/)[0]);
        const enLinea = getComputedStyle(el).display === 'inline';
        if (w <= 768 && b.height < 44 && !el.closest('p,li') && !enLinea) {
          el.scrollIntoView({ block:'center' });
          const bb = el.getBoundingClientRect();
          if (bb.top < 30 || bb.bottom > innerHeight - 30) continue;
          const cx = Math.round(bb.left + bb.width/2); let up=0,dn=0;
          for(let i=1;i<=24;i++){const t=document.elementFromPoint(cx, Math.round(bb.top)-i); if(t&&(t===el||el.contains(t)))up=i; else break;}
          for(let i=1;i<=24;i++){const t=document.elementFromPoint(cx, Math.round(bb.bottom)+i); if(t&&(t===el||el.contains(t)))dn=i; else break;}
          if (Math.round(bb.height)+up+dn < 44) out.touch.push(((el.textContent||'').trim().slice(0,20)||'?')+':'+(Math.round(bb.height)+up+dn)+'|'+(el.className+'').trim().split(/\s+/)[0]);
        }
      }
      for (const el of document.body.querySelectorAll('*')) {
        if (el.children.length || !el.textContent.trim()) continue;
        const cs = getComputedStyle(el); const fs = parseFloat(cs.fontSize);
        const txt = el.textContent.trim();
        const esEtiqueta = cs.textTransform === 'uppercase' || (txt === txt.toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(txt));
        if (fs > 0 && fs < 12 && !esEtiqueta) out.tiny.push(txt.slice(0,18)+':'+fs);
      }
      for (const el of document.querySelectorAll('input,select,textarea')) {
        if (el.type === 'hidden') continue;
        if (!(el.labels && el.labels.length) && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !el.getAttribute('title')) out.noLabel.push((el.name||el.type)+'');
      }
      return out;
    }, w);
    const bad = {};
    if (r.ov > 0) bad.overflow = r.ov;
    if (r.bg !== 'rgb(6, 8, 13)' && r.bg !== 'rgba(0, 0, 0, 0)') bad.bg = r.bg;
    if (r.cyanClick.length) bad.cyanClick = [...new Set(r.cyanClick)].slice(0,4);
    if (r.tiny.length) bad.tiny = [...new Set(r.tiny)].slice(0,4);
    if (r.touch.length) bad.touch = [...new Set(r.touch)].slice(0,4);
    if (r.noLabel.length) bad.noLabel = [...new Set(r.noLabel)].slice(0,4);
    if (r.importes.length) bad.importes = [...new Set(r.importes)].slice(0,4);
    const errsReales = [...new Set(errs)].filter(e => !/ERR_FAILED|ERR_BLOCKED|net::ERR_ABORTED/.test(e));
    if (errsReales.length) bad.errs = errsReales.slice(0,3);
    if (Object.keys(bad).length) issues.push({ p, w, ...bad });
  }
  await ctx.close();
}
await browser.close(); server.close();
console.log(JSON.stringify(issues, null, 1));
console.log('TOTAL incidencias:', issues.length, '· páginas:', pages.length, '· anchos:', WIDTHS.length);
