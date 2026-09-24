import { chromium } from 'playwright';
import { levanta, opcionesNavegador } from '../scripts/qa/servidor.mjs';
const PORT=4206; const srv=await levanta(PORT); const BASE='http://127.0.0.1:'+PORT;
const nav=await chromium.launch(opcionesNavegador());
const ctx=await nav.newContext({viewport:{width:1440,height:1000}});
await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r=>r.abort());
const pg=await ctx.newPage();
pg.on('pageerror',e=>console.log('PAGEERROR:',String(e).slice(0,300)));
pg.on('console',m=>{ if(m.type()==='error') console.log('CONSOLE:',m.text().slice(0,200)); });
pg.on('requestfailed',r=>{ if(/configurador|catalogo/.test(r.url())) console.log('FALLO:',r.url()); });
await pg.goto(BASE+'/contacto',{waitUntil:'networkidle'});
await pg.waitForTimeout(900);
console.log(await pg.evaluate(()=>({
  host: !!document.getElementById('configurador'),
  hijos: document.getElementById('configurador')?.children.length,
  cat: typeof window.DCP_CATALOGO,
  guiones: [...document.scripts].map(s=>s.src.split('/').pop()).filter(Boolean),
  ops: document.querySelectorAll('.cfg-op').length,
  caja: (document.querySelector('.cfg-caja')||{}).innerHTML?.slice(0,200),
  visible: !!document.querySelector('.cfg-op') && getComputedStyle(document.querySelector('.cfg-op')).display,
})));
await nav.close(); srv.close();
