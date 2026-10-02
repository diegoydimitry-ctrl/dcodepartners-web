/* ==========================================================================
   LA MÁQUINA · fotos fijas
   --------------------------------------------------------------------------
   Para quien pide menos movimiento, ahorra datos o no tiene WebGL2, la portada
   enseña una foto de cada capítulo en vez de la escena. Las fotos salen del
   mismo motor (scripts/v4/maquina/banco.html), no de un programa de diseño.

     node scripts/v4/fotos.mjs            # todas (apaisadas y verticales)
     node scripts/v4/fotos.mjs sistema    # solo las que se nombren

   Necesita el sitio servido en BASE (por defecto http://localhost:8097) y un
   Chromium (CHROMIUM o el de Playwright). Sin GPU tarda: cada foto se calcula
   por software.
   ========================================================================== */
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", ".."), SAL = join(RAIZ, "assets/v2/img/maquina"), BASE = process.env.BASE || "http://localhost:8097";
const FOTOS = [["claro", "cap=0"], ["hoy", "cap=1"], ["sistema", "cap=2"], ["automatizacion", "cap=3"], ["inteligencia", "cap=4&lectura=0.45"], ["finance", "cap=5&lectura=0.55&registro=150040"], ["resultado", "cap=6"], ["tuyo", "cap=8"]];
const pedir = process.argv.slice(2).filter((a) => !a.startsWith("-")), rehacer = process.argv.includes("--rehacer");
mkdirSync(SAL, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
for (const [nombre, q] of FOTOS) {
  if (pedir.length && !pedir.includes(nombre)) continue;
  for (const [suf, w, h, movil] of [["h", 1600, 1000, ""], ["v", 800, 1500, "&movil"]]) {
    const destino = join(SAL, `${nombre}-${suf}.webp`); if (!rehacer && !pedir.length && existsSync(destino) && statSync(destino).size > 4000) continue;
    const pg = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await pg.goto(`${BASE}/scripts/v4/maquina/banco.html?${q}${movil}&pasos=3&sinrotulo`, { waitUntil: "load" });
    await pg.waitForFunction("window.listo === true", null, { timeout: 0 });
    const png = destino.replace(/\.webp$/, ".png"); await pg.screenshot({ path: png, timeout: 0 }); await pg.close();
    execFileSync("python3", ["-c", `from PIL import Image; import os; Image.open(${JSON.stringify(png)}).convert("RGB").save(${JSON.stringify(destino)}, "WEBP", quality=80, method=6); os.remove(${JSON.stringify(png)})`]);
    console.log(`${nombre}-${suf}.webp`, Math.round(statSync(destino).size / 1024) + " KB");
  }
}
await b.close();
