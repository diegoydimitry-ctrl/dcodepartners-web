#!/usr/bin/env node
/* Portada (cover) del Reel: un cuadro del rodaje con el titular encima. 1080×1920.
   Uso: node scripts/v4/reel/portada.mjs <cuadro.jpg> <salida.jpg>
   Lo importante queda dentro del recorte 3:4 centrado (1080×1440) que hace la cuadrícula del perfil de Instagram. */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const [cuadro, salida] = process.argv.slice(2);
const b64 = (f) => fs.readFileSync(f).toString("base64");
const html = `<!doctype html><html lang="es"><meta charset="utf-8"><style>
@font-face { font-family: "Archivo"; src: url(data:font/woff2;base64,${b64(path.join(RAIZ, "assets/v2/fonts/archivo.woff2"))}) format("woff2"); font-weight: 100 900; font-stretch: 62% 125%; }
@font-face { font-family: "Martian Mono"; src: url(data:font/woff2;base64,${b64(path.join(RAIZ, "assets/v2/fonts/martian-mono.woff2"))}) format("woff2"); font-weight: 100 800; font-stretch: 75% 112.5%; }
html, body { margin: 0; width: 360px; height: 640px; overflow: hidden; background: #000; color: #fff; font-family: "Archivo", sans-serif; }
.f { position: absolute; inset: 0; background: url(data:image/jpeg;base64,${b64(cuadro)}) center / cover; filter: contrast(1.08) brightness(.96); }
.v { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 46%, rgba(0,0,0,.82) 68%, rgba(0,0,0,.9) 100%); }
.t { position: absolute; left: 30px; right: 30px; top: 392px; display: grid; gap: 14px; justify-items: start; }
.t b { font-weight: 600; font-size: 50px; line-height: .94; letter-spacing: -.05em; }
.t span { display: inline-flex; align-items: center; gap: 9px; font-family: "Martian Mono", monospace; font-stretch: 80%; font-size: 10.5px; letter-spacing: .09em; text-transform: uppercase; color: rgba(255,255,255,.85); }
.t span::before { content: ""; width: 7px; height: 7px; border-radius: 1px; background: #5b8cff; }
</style><body><div class="f"></div><div class="v"></div>
<div class="t"><b>Esto es<br>una web.</b><span>D-Code Partners · hecha con código</span></div></body></html>`;
const nav = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium" });
const pg = await nav.newPage({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3 });
await pg.setContent(html); await pg.evaluate(() => document.fonts.ready);
await pg.screenshot({ path: salida, type: "jpeg", quality: 93 });
await nav.close(); console.log("portada:", salida);
