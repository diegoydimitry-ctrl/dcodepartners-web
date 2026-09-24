#!/usr/bin/env node
/*
 * LA WEB ENTERA, EN TODOS LOS APARATOS.
 *
 * Las otras pruebas miran anchos de ventana; esta mira APARATOS: ratón contra
 * dedo, que desde que el campo de partículas se apaga en táctil ya no es lo
 * mismo. Recorre 13 páginas en cinco aparatos y los dos temas y comprueba, en
 * cada carga:
 *   · que no hay desborde horizontal;
 *   · que hay texto visible (una página en blanco pesa lo mismo que una llena);
 *   · que NINGÚN campo de formulario del paso activo está apagado —el fallo
 *     que dejó el formulario de contacto sin poder escribirse en un iPad—;
 *   · que no hay imágenes rotas;
 *   · que el cielo quieto está donde toca y solo donde toca (en táctil sí y
 *     sin lienzos, con ratón no);
 *   · y que no salta ningún error de JavaScript propio.
 *
 * Uso: node scripts/qa-dispositivos.mjs
 */
import { chromium } from 'playwright';
import { levanta, opcionesNavegador } from './qa/servidor.mjs';
const PORT=9670; await levanta(PORT);
const APARATOS=[
  ['pc',{viewport:{width:1440,height:900},deviceScaleFactor:1}],
  ['ipad',{viewport:{width:1024,height:1366},deviceScaleFactor:2,isMobile:true,hasTouch:true}],
  ['ipadh',{viewport:{width:1112,height:834},deviceScaleFactor:2,isMobile:true,hasTouch:true}],
  ['movil',{viewport:{width:393,height:852},deviceScaleFactor:3,isMobile:true,hasTouch:true}],
  ['movil320',{viewport:{width:320,height:680},deviceScaleFactor:2,isMobile:true,hasTouch:true}],
];
const RUTAS=['/','/metodo','/que-hacemos','/servicios/paginas-web','/servicios/sistemas-a-medida','/precios','/sistema-financiero','/contacto','/faq','/conocenos','/blog','/garantias','/en/','/en/que-hacemos','/en/servicios/paginas-web','/en/contacto'];
const br=await chromium.launch(opcionesNavegador());
const malos=[];
let n=0;
for(const [nom,op] of APARATOS){
  for(const tema of ['dark','light']){
    const ctx=await br.newContext(op);
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());
    await ctx.addInitScript(t=>{try{localStorage.setItem('dcp-tema',t)}catch(e){}},tema);
    for(const ruta of RUTAS){
      const p=await ctx.newPage();
      const errores=[];
      p.on('pageerror',e=>errores.push(String(e).slice(0,120)));
      p.on('console',m=>{ if(m.type()==='error') errores.push('console: '+m.text().slice(0,120)); });
      const resp=await p.goto('http://127.0.0.1:'+PORT+ruta,{waitUntil:'networkidle'}).catch(()=>null);
      if(!resp||!resp.ok()){ malos.push(`${nom}/${tema}${ruta}: no carga`); await p.close(); continue; }
      await p.waitForTimeout(900);

      /* En /contacto el formulario ya no se ve al entrar: lo abre el
         configurador, o el enlace de «prefiero escribiros». Se abre aquí
         igual que lo abre quien entra, porque lo que esta prueba vigila es
         que los campos SE VEAN cuando toca —fue una prueba de este archivo
         la que cazó aquel «.field{display:none}» que apagó el formulario
         entero— y no que estén puestos antes de tiempo. */
      await p.evaluate(()=>{ const a=document.querySelector('.cfg-saltar a'); if(a) a.click();
        const d=document.querySelector('.form-extra'); if(d) d.open=true; });
      await p.waitForTimeout(340);

      await p.evaluate(async()=>{const h=document.documentElement.scrollHeight;
        for(let y=0;y<h;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,45));} scrollTo(0,0);});
      await p.waitForTimeout(500);
      const d=await p.evaluate(()=>{
        const H=document.documentElement;
        const vis=e=>{const c=getComputedStyle(e),r=e.getBoundingClientRect();
          return c.display!=='none'&&c.visibility!=='hidden'&&+c.opacity>0.05&&r.width>0&&r.height>0;};
        // texto visible mínimo
        const textos=[...document.querySelectorAll('h1,h2,p,li,label,dd')].filter(vis).length;
        // campos de formulario apagados
        const campos=[...document.querySelectorAll('form .field')];
        const camposOcultos=campos.filter(e=>!vis(e)&&!e.closest('.form-step:not(.is-active)')).length;
        // imágenes rotas
        const rotas=[...document.querySelectorAll('img')].filter(i=>i.complete&&i.naturalWidth===0).length;
        return {desborde:H.scrollWidth>H.clientWidth?H.scrollWidth-H.clientWidth:0, textos, campos:campos.length, camposOcultos, rotas,
          quieto:H.classList.contains('cielo-quieto'), lienzos:document.querySelectorAll('.field canvas').length};
      });
      if(d.desborde>1) malos.push(`${nom}/${tema}${ruta}: desborde horizontal ${d.desborde}px`);
      if(d.textos<4) malos.push(`${nom}/${tema}${ruta}: solo ${d.textos} textos visibles`);
      if(d.camposOcultos>0) malos.push(`${nom}/${tema}${ruta}: ${d.camposOcultos} campos de formulario ocultos`);
      if(d.rotas>0) malos.push(`${nom}/${tema}${ruta}: ${d.rotas} imágenes rotas`);
      const esTactil = nom!=='pc';
      if(esTactil && !d.quieto) malos.push(`${nom}/${tema}${ruta}: en táctil debería estar el cielo quieto`);
      if(!esTactil && d.quieto) malos.push(`${nom}/${tema}${ruta}: en ratón NO debería estar el cielo quieto`);
      if(esTactil && d.lienzos>0) malos.push(`${nom}/${tema}${ruta}: ${d.lienzos} lienzos de campo en táctil`);
      const graves=errores.filter(e=>!/net::ERR|Failed to (load|fetch)|ERR_FAILED|turnstile|cal\.com/i.test(e));
      if(graves.length) malos.push(`${nom}/${tema}${ruta}: ${graves.length} error(es) JS — ${graves[0]}`);
      n++;
      await p.close();
    }
    await ctx.close();
  }
}
await br.close();
console.log(malos.length?malos.map(m=>'✗ '+m).join('\n'):'');
console.log(`${n} cargas (5 aparatos × 2 temas × ${RUTAS.length} páginas) · con incidencias: ${malos.length}`);
process.exit(malos.length?1:0);
