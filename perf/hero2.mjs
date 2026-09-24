import { chromium } from 'playwright';
import { levanta, opcionesNavegador } from '../scripts/qa/servidor.mjs';
const PORT=4231; const srv=await levanta(PORT); const BASE='http://127.0.0.1:'+PORT;
const nav=await chromium.launch(opcionesNavegador());
for (const w of [1280, 1440, 1920]) {
  const ctx=await nav.newContext({viewport:{width:w,height:900}});
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r=>r.abort());
  const pg=await ctx.newPage();
  await pg.goto(BASE+'/',{waitUntil:'networkidle'});
  await pg.waitForTimeout(800);
  await pg.screenshot({path:`/tmp/hp-${w}.png`});
  const r=await pg.evaluate(()=>{
    const p=document.querySelector('.v6-panel').getBoundingClientRect();
    /* El <h1> es un bloque que ocupa todo el ancho; lo que importa es hasta
       dónde llegan las LETRAS. Se mide con un Range sobre cada línea. */
    let der = 0;
    for (const sp of document.querySelectorAll('.v6-hero h1 span')) {
      const r = document.createRange(); r.selectNodeContents(sp);
      for (const q of r.getClientRects()) der = Math.max(der, q.right);
    }
    const h1 = { right: der };
    const sub=document.querySelector('.v6-sub').getBoundingClientRect();
    const pr=document.querySelector('.v6-panel').getBoundingClientRect();
    /* ¿alguna letra del titular cae encima del panel? */
    let choca=false;
    for (const sp of document.querySelectorAll('.v6-hero h1 span, .v6-sub, .v6-acts a, .v6-prueba li')) {
      const r=document.createRange(); r.selectNodeContents(sp);
      for (const q of r.getClientRects()) {
        if (q.right > pr.left + 4 && q.left < pr.right && q.bottom > pr.top + 4 && q.top < pr.bottom) {
          choca = true; if (!window.__q) window.__q = []; window.__q.push([sp.className||sp.tagName, Math.round(q.left), Math.round(q.top), Math.round(q.right), Math.round(q.bottom)]);
        }
      }
    }
    return { panel:[Math.round(pr.left),Math.round(pr.top),Math.round(pr.right),Math.round(pr.bottom)], choca, quien:(window.__q||[]).slice(0,4) };
  });
  console.log(w, JSON.stringify(r));
  await ctx.close();
}
await nav.close(); srv.close();
