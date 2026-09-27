#!/usr/bin/env node
/* ==========================================================================
   DEMOS A PANTALLA COMPLETA (/demos/*, /en/demos/*)
   Las aplicaciones de ejemplo (Comercial, Operaciones, Atención) y la capa
   D-Code OS vivían dentro de la portada anterior. Ahora cada una tiene su
   página propia, que la portada abre en un visor solo cuando se pide: la
   portada no descarga ni un byte de las demos hasta entonces.
   Son marcos de aplicación: noindex y fuera del sitemap.
   Uso: node scripts/v2/demos.mjs
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
// Las demos se toman tal cual estaban en producción (commit de partida de la rama).
const BASE = "8ff5f5b";
const viejo = (f) => execSync(`git -C "${RAIZ}" show ${BASE}:${f}`, { encoding: "utf8", maxBuffer: 1 << 26 });
const version = (f) => { try { return "?v=" + execSync(`git -C "${RAIZ}" hash-object "${path.join(RAIZ, f)}"`, { encoding: "utf8" }).trim().slice(0, 10); } catch { return ""; } };

const FUENTES = `<style>
@font-face{font-family:'Inter';src:url('/assets/fonts/inter-variable.woff2') format('woff2');font-weight:100 900;font-display:swap}
@font-face{font-family:'Space Grotesk';src:url('/assets/fonts/spacegrotesk-variable.woff2') format('woff2');font-weight:300 700;font-display:swap}
@font-face{font-family:'JetBrains Mono';src:url('/assets/fonts/jetbrainsmono-variable.woff2') format('woff2');font-weight:100 800;font-display:swap}
html,body{margin:0;background:#f4f4f1;min-height:100%}
body{font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.sd-host{min-height:100vh}
</style>`;

const TXT = {
  es: { comercial: "Comercial", operaciones: "Operaciones", atencion: "Atención al cliente", os: "D-Code OS", sufijo: "demo con datos inventados · D-Code Partners", desc: "Demostración con datos inventados de un sistema construido por D-Code Partners." },
  en: { comercial: "Sales", operaciones: "Operations", atencion: "Customer service", os: "D-Code OS", sufijo: "demo with invented data · D-Code Partners", desc: "Demo with invented data of a system built by D-Code Partners." },
};

function cabeza(lang, id, ruta, extra) {
  const t = TXT[lang];
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t[id]} · ${t.sufijo}</title>
<meta name="description" content="${t.desc}">
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="https://dcodepartners.com${ruta}">
<link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon-96x96.png">
${FUENTES}
${extra}
</head>`;
}

const escribir = (rel, html) => { const f = path.join(RAIZ, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); console.log("  " + rel); };

for (const lang of ["es", "en"]) {
  const pre = lang === "en" ? "/en" : "";
  const antigua = viejo(lang === "en" ? "en/index.html" : "index.html");
  // 1 · las tres aplicaciones de ejemplo
  for (const id of ["comercial", "operaciones", "atencion"]) {
    const ruta = `${pre}/demos/${id}`;
    const js = `/assets/js/demo-${id}.js${version(`assets/js/demo-${id}.js`)}`;
    escribir(`${lang === "en" ? "en/" : ""}demos/${id}.html`, `${cabeza(lang, id, ruta, `<link rel="stylesheet" href="/assets/css/demo-sistemas.css${version("assets/css/demo-sistemas.css")}">`)}
<body>
<main><h1 style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">${TXT[lang][id]} · ${TXT[lang].sufijo}</h1><div class="sd-host" data-sd="${id}" data-sd-auto></div></main>
<script src="/assets/js/demo-sistemas.js${version("assets/js/demo-sistemas.js")}"></script>
<script src="${js}"></script>
</body>
</html>
`);
  }
  // 2 · D-Code OS: la sección tal cual, con sus hojas y su script
  const a = antigua.lastIndexOf("<section", antigua.indexOf('id="dcode-os"'));
  const b = antigua.lastIndexOf("<section", antigua.indexOf('id="proceso"'));
  const seccion = antigua.slice(a, b);
  const hojas = ["styles.css", "dcp5.css", "dcp6.css", "dcode-os.css", "dcode-ds.css", "superficies.css"].map((h) => `<link rel="stylesheet" href="/assets/css/${h}${version("assets/css/" + h)}">`).join("\n");
  escribir(`${lang === "en" ? "en/" : ""}demos/os.html`, `${cabeza(lang, "os", `${pre}/demos/os`, hojas + `<style>.os-cab{display:none!important}body{background:#07080a}.v6-block{padding:32px 0!important;min-height:auto!important}</style>`)}
<body data-theme="dark">
<main>${seccion}</main>
<script src="/assets/js/dcode-os.js${version("assets/js/dcode-os.js")}"></script>
</body>
</html>
`);
}
