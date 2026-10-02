#!/usr/bin/env node
/* Graba los rótulos del Reel (scripts/v3/reel/capas.html) como PNG con transparencia, uno por cuadro. */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
const BASE = process.env.BASE || "http://localhost:8097", SAL = process.argv[2] || "reel-capas", TOTAL = +(process.argv[3] || 1200);
fs.mkdirSync(SAL, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium" });
const pg = await b.newPage({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3 });
await pg.goto(BASE + "/scripts/v3/reel/capas.html", { waitUntil: "load" }); await pg.evaluate("window.listo");
let vacio = null;
for (let f = 0; f < TOTAL; f++) {
  const hay = await pg.evaluate((f) => window.cuadro(f), f), dest = path.join(SAL, `c${String(f).padStart(4, "0")}.png`);
  if (!hay && vacio) { fs.copyFileSync(vacio, dest); continue; }
  await pg.screenshot({ path: dest, omitBackground: true }); if (!hay) vacio = dest;
}
await b.close(); console.log("rótulos:", TOTAL);
