// Capturas reales de las demos de la web (rama experience/dcp-web-cierre servida en local), tema oscuro, a 2x.
import { createRequire } from "module"; const require = createRequire(import.meta.url);
const { chromium } = require("/home/claude/.npm-global/lib/node_modules/playwright/index.js");
const OUT = "/home/claude/anuncios-v3/marketing/reel-ruptura/assets/demos/"; (await import("fs")).mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: "dark" });
const p = await ctx.newPage(); p.on("pageerror", e => console.log("ERR", e.message));
await p.goto("http://localhost:8765/index.html", { waitUntil: "networkidle" });
for (const d of ["comercial", "operaciones", "atencion", "finance"]) {
  await p.click(`#gal-t-${d}`); await p.waitForTimeout(1200);
  const el = await p.$(`#gal-p-${d}`); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
  const tiempos = d === "finance" ? [0, 4] : [0, 3.5, 7, 10.5, 14, 17.5];
  let t0 = Date.now();
  for (const [i, t] of tiempos.entries()) {
    const esp = t * 1000 - (Date.now() - t0); if (esp > 0) await p.waitForTimeout(esp);
    await el.screenshot({ path: `${OUT}${d}-${i}.png` }); console.log(d, i);
  }
}
await b.close();
