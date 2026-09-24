import { chromium } from 'playwright';
import { levanta, opcionesNavegador } from '../scripts/qa/servidor.mjs';
const PORT=4209; const srv=await levanta(PORT); const BASE='http://127.0.0.1:'+PORT;
const nav=await chromium.launch(opcionesNavegador());
const ctx=await nav.newContext({viewport:{width:1440,height:1000}});
await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r=>r.abort());
const pg=await ctx.newPage();
await pg.goto(BASE+'/contacto',{waitUntil:'networkidle'});
await pg.waitForTimeout(600);
await pg.screenshot({path:'/tmp/cfg-1.png'});
await pg.click('#configurador .cfg-op >> nth=2');
await pg.waitForTimeout(620);
await pg.screenshot({path:'/tmp/cfg-2.png'});   // con las piezas en el aire
await pg.click('.cfg-seguir'); await pg.waitForTimeout(250);
await pg.click('#configurador .cfg-chip >> nth=0'); await pg.click('#configurador .cfg-chip >> nth=2');
await pg.waitForTimeout(150); await pg.screenshot({path:'/tmp/cfg-3.png'});
await pg.click('.cfg-seguir'); await pg.waitForTimeout(200);
await pg.click('#configurador .cfg-op >> nth=1'); await pg.click('.cfg-seguir'); await pg.waitForTimeout(200);
await pg.click('#configurador .cfg-op >> nth=0'); await pg.click('#configurador .cfg-op >> nth=2'); await pg.click('.cfg-seguir'); await pg.waitForTimeout(200);
await pg.click('#configurador .cfg-op >> nth=1'); await pg.click('.cfg-seguir'); await pg.waitForTimeout(500);
await pg.screenshot({path:'/tmp/cfg-4.png'});   // el resumen
await pg.click('.cfg-enviar'); await pg.waitForTimeout(900);
await pg.screenshot({path:'/tmp/cfg-5.png'});   // el formulario que aparece
await nav.close(); srv.close();
console.log('fotos hechas');
