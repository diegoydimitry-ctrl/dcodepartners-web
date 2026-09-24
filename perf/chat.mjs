import { chromium } from 'playwright';
import { levanta, opcionesNavegador } from '../scripts/qa/servidor.mjs';
const PORT=4203; const srv=await levanta(PORT); const BASE='http://127.0.0.1:'+PORT;
const nav=await chromium.launch(opcionesNavegador());
const ctx=await nav.newContext({viewport:{width:1440,height:940}});
await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r=>r.abort());
const pg=await ctx.newPage();
for (const ruta of ['/','/precios','/que-hacemos','/sistema-financiero','/contacto','/departamentos/finanzas','/cambios-en-proceso','/en/precios']) {
  await pg.goto(BASE+ruta,{waitUntil:'domcontentloaded'});
  const r=await pg.evaluate(()=>({
    hola: document.querySelector('#chat-messages .chat-msg.bot').textContent.trim().slice(0,52),
    q: [...document.querySelectorAll('.chat-quick-question')].map(b=>b.textContent.trim()),
  }));
  console.log(ruta.padEnd(24), '»', r.hola);
  console.log(' '.repeat(26), r.q.join(' · '));
}
await ctx.close(); await nav.close(); srv.close();
