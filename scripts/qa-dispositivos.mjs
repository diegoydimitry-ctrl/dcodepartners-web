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
/* El tope de alto en el teléfono. La portada —la que era la más larga— quedó
   en 9.029 px tras quitar las escenas; 11.000 deja sitio para crecer sin
   volver a las diecisiete pantallas de antes. Si una página lo pasa, o ha
   entrado una escena de escritorio, o hay que partirla.

   DOS PÁGINAS ESTÁN POR ENCIMA Y NO LAS TOCO TODAVÍA. Lo que las alarga no
   son demos: es información que alguien puede querer leer en el móvil —las
   dieciocho fichas de precio con su qué es y su cuánto cuesta, y las catorce
   piezas de Finance—. Recortarlas es decidir qué deja de contarse, y eso no
   lo invento yo. Quedan ancladas a su alto de hoy: no se arreglan, pero
   tampoco pueden crecer mientras se decide. Medido a 320 px, que es el peor
   caso. */
/* El tope sube de 11.000 a 11.500, y conviene decir por qué y no disimularlo:
   la portada ha ganado una sección entera —«El problema»— que antes no
   existía, y que es el punto de partida de toda la narrativa. Son 1.089 px en
   una pantalla de 320. El tope existe para que no vuelvan las diecisiete
   pantallas de antes (15.671 px), no para congelar la web: a 11.123 px sigue
   a 4.500 px de aquello. Si alguna vez hace falta subirlo otra vez, la
   pregunta correcta es qué sobra, no cuánto se sube. */
const TOPE_TEL = 11500;
/* /precios ya está resuelto: el catálogo se pliega en el teléfono y pasó de
   15.170 a 8.361 px a 320 px. Queda solo /sistema-financiero, cuyo largo son
   las catorce piezas de Finance —información, no demos—. */
const PENDIENTES = { '/sistema-financiero': 15800 };
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
        const d=document.querySelector('.form-extra'); if(d) d.open=true;
        /* El globo del asistente sale solo cada 22 s, así que en una prueba
           nunca aparece: se enciende a mano, con la frase más larga de las
           diez que rota. Se salía 116 px de una pantalla de 375 y nadie lo
           vio hasta mirar el Preview con los ojos, porque está recortado
           —no empuja la página— y el desborde horizontal daba 0. */
        const g=document.querySelector('.chat-aviso');
        if(g){ g.textContent='¿Necesitas que te lo enseñemos en una demo?'; g.classList.add('es-visto'); } });
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
        /* NINGUNA ESCENA DE DEMO EN EL TELÉFONO, Y NADA DE PÁGINAS
           INTERMINABLES. Son aplicaciones de escritorio y diagramas de tres
           columnas: apretados en 390 px no se leen y alargaban la portada
           hasta 15.671 px —diecisiete pantallas—. En tableta sí se usan, así
           que esto solo mira el teléfono. */
        const escenas=[...document.querySelectorAll('[data-arq],[data-dx],[data-gal],#dcode-os .os-conv')].filter(vis).length;
        const altoPagina=Math.round(H.scrollHeight);
        // el globo del asistente, entero dentro de la pantalla
        const g=document.querySelector('.chat-aviso'); let globo=0;
        if(g&&vis(g)){ const b=g.getBoundingClientRect();
          globo=Math.round(Math.max(0, b.right-H.clientWidth, -b.left)); }
        return {escenas, altoPagina, globo, desborde:H.scrollWidth>H.clientWidth?H.scrollWidth-H.clientWidth:0, textos, campos:campos.length, camposOcultos, rotas,
          quieto:H.classList.contains('cielo-quieto'), lienzos:document.querySelectorAll('.field canvas').length};
      });
      if(d.desborde>1) malos.push(`${nom}/${tema}${ruta}: desborde horizontal ${d.desborde}px`);
      if(d.globo>1) malos.push(`${nom}/${tema}${ruta}: el globo del asistente se sale ${d.globo}px de la pantalla`);
      const esTelefono = nom==='movil' || nom==='movil320';
      if(esTelefono && d.escenas>0) malos.push(`${nom}/${tema}${ruta}: ${d.escenas} escena(s) de demo montadas en el teléfono`);
      const tope = PENDIENTES[ruta] || TOPE_TEL;
      if(esTelefono && d.altoPagina>tope) malos.push(`${nom}/${tema}${ruta}: ${d.altoPagina}px de alto en el teléfono (el tope son ${tope}px${PENDIENTES[ruta]?', y esta página está a la espera de qué se recorta':''})`);
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
