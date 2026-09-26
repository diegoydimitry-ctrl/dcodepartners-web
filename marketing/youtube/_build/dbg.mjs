import { chromium } from "playwright";
import { resolve, dirname } from "node:path"; import { fileURLToPath } from "node:url";
const AQUI = dirname(fileURLToPath(import.meta.url));
const nav = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await (await nav.newContext({ viewport:{width:3840,height:2160} })).newPage();
p.on("pageerror", e=>console.error("ERR:",String(e).slice(0,200)));
await p.goto("file://"+resolve(AQUI,"escena.html"), { waitUntil:"load" });
await p.waitForFunction(()=>window.LISTO===true,null,{timeout:60000});
const r = await p.evaluate(()=>{
  const out=[];
  for (const s of [0.25,0.75,1.25,1.8,2.4,3.2]) {
    window.pintaFrame(Math.round(s*30));
    out.push({s, camx:+cam.x.toFixed(0), camz:+cam.z.toFixed(2), f:+faseBucle(s).f.toFixed(3), n:faseBucle(s).n});
  }
  return out;
});
console.table(r);
await nav.close();
