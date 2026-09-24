import { chromium } from 'playwright';
import { levanta, opcionesNavegador } from '../scripts/qa/servidor.mjs';
const PORT=4205; const srv=await levanta(PORT); const BASE='http://127.0.0.1:'+PORT;
const nav=await chromium.launch(opcionesNavegador());
for (const [n,o,ruta] of [['pc',{viewport:{width:1440,height:1000}},'/contacto'],['movil',{viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true},'/contacto'],['en',{viewport:{width:1440,height:1000}},'/en/contacto']]) {
  const ctx=await nav.newContext(o);
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r=>r.abort());
  const pg=await ctx.newPage();
  const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,120)));
  await pg.goto(BASE+ruta,{waitUntil:'networkidle'});
  await pg.waitForTimeout(700);
  const ini = await pg.evaluate(()=>({
    cfg: !!document.querySelector('.cfg-op, .cfg-chip'),
    formOculto: !!document.querySelector('.form-card.es-espera'),
    pasos: document.querySelectorAll('#contact-form > .form-step').length,
    puntos: document.querySelectorAll('.form-progress-dot').length,
  }));
  console.log(' ini', n, JSON.stringify(ini), 'ops=', await pg.locator('.cfg-op, .cfg-chip').count());
  // recorrer los 5 pasos
  let chispasVistas = 0;
  for (let i=0;i<5;i++){
    const nOps = await pg.locator('.cfg-op, .cfg-chip').count();
    if (!nOps) { console.log('   paso', i, 'sin opciones · caja:', (await pg.locator('.cfg-caja').innerHTML()).slice(0,140)); break; }
    await pg.locator('.cfg-op, .cfg-chip').first().click({timeout:5000});
    if (i===0) { await pg.waitForTimeout(90); chispasVistas = await pg.evaluate(()=>document.querySelectorAll('.cfg-chispa').length); }
    await pg.waitForTimeout(120);
    const seguir = pg.locator('.cfg-seguir');
    if (await seguir.isVisible() && await seguir.isEnabled()) await seguir.click({timeout:5000});
    await pg.waitForTimeout(160);
  }
  await pg.waitForTimeout(500);
  const fin = await pg.evaluate(()=>{
    const est=document.querySelector('.cfg-estim, .cfg-resumen, .cfg-total');
    return {
      resumen: !!document.querySelector('.cfg-caja')?.textContent.trim(),
      formVisible: !!document.querySelector('.form-card') && !document.querySelector('.form-card.es-espera'),
      mensaje: (document.getElementById('mensaje')||{}).value?.slice(0,42) || '',
      conf: !!document.querySelector('input[name="configuracion"]'),
      extra: !!document.querySelector('.form-extra'),
    };
  });
  console.log(n, JSON.stringify(ini), '| chispas:', chispasVistas, '|', JSON.stringify(fin), errs.length?('ERR '+errs.join(' | ')):'');
  await ctx.close();
}
await nav.close(); srv.close();
