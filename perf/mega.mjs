import { chromium } from 'playwright';
import { levanta, opcionesNavegador } from '../scripts/qa/servidor.mjs';
const PORT=4221; const srv=await levanta(PORT); const BASE='http://127.0.0.1:'+PORT;
const nav=await chromium.launch(opcionesNavegador());
for (const tema of ['dark','light']) {
  const ctx=await nav.newContext({viewport:{width:1440,height:900}});
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r=>r.abort());
  await ctx.addInitScript((t)=>{try{localStorage.setItem('dcp-tema',t)}catch(e){}}, tema);
  const pg=await ctx.newPage();
  await pg.goto(BASE+'/que-hacemos',{waitUntil:'networkidle'});
  await pg.waitForTimeout(700);
  await pg.hover('.mega-trigger');
  await pg.waitForTimeout(500);
  await pg.screenshot({path:`/tmp/mega-${tema}.png`});
  const r=await pg.evaluate(()=>{
    const m=document.querySelector('.mega-menu'); const c=getComputedStyle(m);
    const it=document.querySelectorAll('.mega-item').length;
    return { fondo:c.backgroundColor, items:it,
             texto:getComputedStyle(document.querySelector('.mega-item strong')).color };
  });
  console.log(tema, JSON.stringify(r));
  await ctx.close();
}
await nav.close(); srv.close();
