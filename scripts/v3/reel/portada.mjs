#!/usr/bin/env node
/* Portada (cover) del Reel: un cuadro del rodaje con el titular encima. 1080×1920.
   Uso: node portada.mjs <cuadro.jpg> <salida.jpg>
   Lo importante queda dentro del recorte 4:5 centrado que hace la cuadrícula del perfil de Instagram. */
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
.f { position: absolute; inset: 0; background: url(data:image/jpeg;base64,${b64(cuadro)}) center / cover; filter: contrast(1.12) brightness(.94); }
.v { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,.5) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 44%, rgba(0,0,0,.86) 66%, rgba(0,0,0,.94) 100%); }
.m { position: absolute; left: 30px; top: 112px; display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 15px; letter-spacing: -.02em; }
.m svg { width: 30px; height: 25px; }
.t { position: absolute; left: 30px; right: 30px; top: 372px; display: grid; gap: 14px; justify-items: start; }
.t b { font-weight: 600; font-size: 46px; line-height: .95; letter-spacing: -.05em; }
.t span { display: inline-flex; align-items: center; gap: 9px; font-family: "Martian Mono", monospace; font-stretch: 80%; font-size: 10.5px; letter-spacing: .09em; text-transform: uppercase; color: rgba(255,255,255,.82); }
.t span::before { content: ""; width: 7px; height: 7px; border-radius: 1px; background: #5b8cff; }
</style><body><div class="f"></div><div class="v"></div>
<div class="m"><svg viewBox="0 0 120 100"><g fill="#fff"><rect x="26" y="1" width="16" height="16" rx="2"/><rect x="1" y="27" width="13" height="13" rx="2"/><rect x="35" y="26" width="13" height="13" rx="2"/><rect x="2" y="64" width="12" height="12" rx="2"/><rect x="35" y="64" width="13" height="13" rx="2"/><rect x="26" y="83" width="16" height="16" rx="2"/><path d="M48 1H86A32 32 0 0 1 118 33V38H102V33A16 16 0 0 0 86 17H48Z"/><rect x="102" y="43" width="16" height="16" rx="2"/><path d="M48 99H86A32 32 0 0 0 118 67V63H102V67A16 16 0 0 1 86 83H48Z"/></g><rect x="16" y="45" width="15" height="15" rx="2" fill="#5b8cff"/></svg>D-Code Partners</div>
<div class="t"><b>Esto no es<br>un vídeo.<br>Es una web.</b><span>Mantén pulsado y se ordena</span></div></body></html>`;
const nav = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium" });
const pg = await nav.newPage({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3 });
await pg.setContent(html); await pg.evaluate(() => document.fonts.ready);
await pg.screenshot({ path: salida, type: "jpeg", quality: 93 });
await nav.close(); console.log("portada:", salida);
