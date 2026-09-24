import { chromium } from 'playwright';
import { levanta, opcionesNavegador } from '../scripts/qa/servidor.mjs';
const PORT=4201; const srv=await levanta(PORT); const BASE='http://127.0.0.1:'+PORT;
const nav=await chromium.launch(opcionesNavegador());
const rutas = process.argv.slice(2).length ? process.argv.slice(2) : ['/que-hacemos'];
for (const ruta of rutas) {
  for (const [n,o] of [['pc',{viewport:{width:1440,height:940}}],['movil',{viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true}]]) {
    const ctx=await nav.newContext(o);
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r=>r.abort());
    const pg=await ctx.newPage();
    const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,110)));
    await pg.goto(BASE+ruta,{waitUntil:'networkidle'});
    await pg.waitForTimeout(700);
    const nom = ruta.replace(/\//g,'_')||'_home';
    await pg.screenshot({path:`/tmp/v${nom}-${n}.png`, fullPage:n==='pc'});
    const info = await pg.evaluate(()=>({
      alto: Math.round(document.body.scrollHeight),
      desborda: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      imgs: [...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.currentSrc||i.src),
    }));
    console.log(ruta, n, JSON.stringify(info), errs.length?('ERR '+errs.join(' | ')):'');
    await ctx.close();
  }
}
await nav.close(); srv.close();
