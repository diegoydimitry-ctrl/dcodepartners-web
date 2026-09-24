import { chromium } from 'playwright';
import { levanta, opcionesNavegador } from '../scripts/qa/servidor.mjs';
const PORT=4241; const srv=await levanta(PORT); const BASE='http://127.0.0.1:'+PORT;
const nav=await chromium.launch(opcionesNavegador());
const ctx=await nav.newContext({viewport:{width:1440,height:940}});
await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r=>r.abort());
const pg=await ctx.newPage();
const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,160)));
await pg.goto(BASE+'/contacto',{waitUntil:'networkidle'});
await pg.waitForTimeout(700);
await pg.locator('#configurador .cfg-op').nth(2).scrollIntoViewIfNeeded();
await pg.waitForTimeout(250);
await pg.click('#configurador .cfg-op >> nth=2');
const marcas=[];
for (const t of [120, 420, 780, 1150, 1700, 2400, 3200]) {
  await pg.waitForTimeout(t - (marcas.length ? [120,420,780,1150,1700,2400,3200][marcas.length-1] : 0));
  const e = await pg.evaluate(()=>{
    const b=document.querySelector('.cfg-bicho');
    const o=document.querySelector('.cfg-ojo');
    const r=b?b.getBoundingClientRect():null;
    return { bicho:!!b, escondite:!!o, clases:b?b.className:'',
             pos:r?[Math.round(r.left),Math.round(r.top)]:null,
             polvo:document.querySelectorAll('.cfg-polvo').length,
             tapa:!!document.querySelector('.cfg-tapa') };
  });
  marcas.push(e);
  await pg.screenshot({path:`/tmp/bi-${t}.png`});
}
marcas.forEach((m,i)=>console.log([120,420,780,1150,1700,2400,3200][i]+'ms', JSON.stringify(m)));
console.log(errs.length?('ERR '+errs.join(' | ')):'sin errores de JS');
await nav.close(); srv.close();
