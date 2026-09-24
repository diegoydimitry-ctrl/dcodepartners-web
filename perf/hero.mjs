import { chromium } from 'playwright';
import { levanta, opcionesNavegador } from '../scripts/qa/servidor.mjs';
const PORT=4211; const srv=await levanta(PORT); const BASE='http://127.0.0.1:'+PORT;
const nav=await chromium.launch(opcionesNavegador());
for (const [n,w,tema] of [['claro',1440,'light'],['1280',1280,'dark'],['1100',1100,'dark'],['tablet',1024,'dark']]) {
  const ctx=await nav.newContext({viewport:{width:w,height:900}, ...(w<1100?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})});
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r=>r.abort());
  await ctx.addInitScript((t)=>{try{localStorage.setItem('dcp-tema',t)}catch(e){}}, tema);
  const pg=await ctx.newPage();
  await pg.goto(BASE+'/',{waitUntil:'networkidle'});
  await pg.waitForTimeout(900);
  await pg.screenshot({path:`/tmp/hero-${n}.png`});
  const r=await pg.evaluate(()=>{
    const p=document.querySelector('.v6-panel');
    const h1=document.querySelector('.v6-hero h1');
    const rp=p?p.getBoundingClientRect():null, rh=h1.getBoundingClientRect();
    return { panel: p?getComputedStyle(p).display:'sin panel',
             solapa: rp && rp.left < rh.right && rp.top < rh.bottom && rp.bottom > rh.top,
             desborda: document.documentElement.scrollWidth > document.documentElement.clientWidth };
  });
  console.log(n, w, tema, JSON.stringify(r));
  await ctx.close();
}
await nav.close(); srv.close();
