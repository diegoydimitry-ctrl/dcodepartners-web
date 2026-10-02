#!/usr/bin/env node
/* Fotografías fijas de cada capítulo del mundo (assets/v2/img/mundo/*.webp).
   Son lo que se ve con movimiento reducido, ahorro de datos o sin WebGL2.
   Necesita un servidor local de la carpeta del proyecto y Chromium (Playwright).
   Uso: node scripts/v3/fotos.mjs http://localhost:8097 */
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const base = process.argv[2] || "http://localhost:8097";
const NOMBRES = ["claro", "hoy", "sistema", "inteligencia", "automatizacion", "finance", "resultado", null, "tuyo"];
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
for (const [suf, w, h] of [["h", 1600, 1000], ["v", 800, 1400]]) {
  const pg = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  for (const [c, n] of NOMBRES.entries()) {
    if (!n) continue;
    await pg.goto(`${base}/scripts/v3/mundo/banco.html?cap=${c}&pasos=3${w < h ? "&movil" : ""}`, { waitUntil: "load" });
    await pg.waitForFunction("window.listo === true", null, { timeout: 180000 });
    const png = path.join(RAIZ, `assets/v2/img/mundo/${n}-${suf}.png`), webp = png.replace(".png", ".webp");
    await pg.screenshot({ path: png, clip: { x: 0, y: 0, width: w, height: h } });
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", png, "-c:v", "libwebp", "-quality", "68", webp]); fs.unlinkSync(png);
    console.log(path.basename(webp), (fs.statSync(webp).size / 1024).toFixed(0) + " KB");
  }
  await pg.close();
}
await b.close();
