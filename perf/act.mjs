import { chromium } from 'playwright';
import { levanta, opcionesNavegador } from '../scripts/qa/servidor.mjs';
const PORT=4207; const srv=await levanta(PORT); const BASE='http://127.0.0.1:'+PORT;
const nav=await chromium.launch(opcionesNavegador());
for (const motion of ['no-preference','reduce']) {
  const ctx=await nav.newContext({viewport:{width:1440,height:1000}, reducedMotion: motion==='reduce'?'reduce':'no-preference'});
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r=>r.abort());
  const pg=await ctx.newPage();
  await pg.goto(BASE+'/contacto',{waitUntil:'networkidle'});
  await pg.waitForTimeout(600);
  const b = pg.locator('.cfg-op').first();
  const caja = await pg.evaluate(()=>{
    const e=document.querySelector('.cfg-op'); const r=e.getBoundingClientRect();
    const mid=document.elementFromPoint(r.left+r.width/2, r.top+r.height/2);
    return { rect:[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)],
             encima: mid ? (mid.className||mid.tagName)+'' : 'nada',
             opac:getComputedStyle(e).opacity, anim:getComputedStyle(e).animationName };
  });
  let ok='OK';
  try { await b.click({timeout:4000}); } catch(e){ ok='TIMEOUT'; }
  console.log(motion, ok, JSON.stringify(caja));
  await ctx.close();
}
await nav.close(); srv.close();
