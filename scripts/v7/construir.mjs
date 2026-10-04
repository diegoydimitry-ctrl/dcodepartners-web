#!/usr/bin/env node
/* Construye la portada «el banco de trabajo»: mete en assets/v2/js/portada.js lo que hay que saber de las imágenes (scripts/v7/datos.json y una
   versión por contenido de assets/v2/img/escena), genera el <main> de las dos portadas, pone a cada referencia de /assets/v2 su ?v= por contenido
   y vuelve a aplicar el SEO y el sitemap. Las imágenes se pintan con scripts/v7/escena.py y se pasan a WebP con scripts/v7/imagenes.py.
   Uso: node scripts/v7/construir.mjs */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const nodo = (...a) => execFileSync("node", a, { cwd: RAIZ, stdio: "inherit" });
const sha = (b) => crypto.createHash("sha256").update(b).digest("hex").slice(0, 10);

// lo que la página sabe de las imágenes
const dir = path.join(RAIZ, "assets/v2/img/escena"), fotos = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".webp")).sort() : [];
const v = sha(fotos.map((f) => f + fs.statSync(path.join(dir, f)).size).join("|"));
const datos = { v, fondo: "rgb(233, 233, 232)", ...JSON.parse(fs.readFileSync(path.join(RAIZ, "scripts/v7/datos.json"), "utf8")) };
const js = path.join(RAIZ, "assets/v2/js/portada.js");
fs.writeFileSync(js, fs.readFileSync(js, "utf8").replace(/\/\*DATOS\*\/[\s\S]*?\/\*FIN\*\//, () => `/*DATOS*/${JSON.stringify(datos)}/*FIN*/`));
const cabJs = path.join(RAIZ, "assets/v2/js/cabecera3d.js");
fs.writeFileSync(cabJs, fs.readFileSync(cabJs, "utf8").replace(/const V = "[0-9a-f]{10}"/, `const V = "${v}"`));
console.log(`imágenes: ${fotos.length} · ${(fotos.reduce((t, f) => t + fs.statSync(path.join(dir, f)).size, 0) / 1024).toFixed(0)} KB · versión ${v}`);

nodo("scripts/v7/portada.mjs");
for (const rel of ["index.html", "en/index.html"]) { const f = path.join(RAIZ, rel); fs.writeFileSync(f, fs.readFileSync(f, "utf8").replace(/(\/assets\/v2\/img\/escena\/[a-z]-\d\.webp\?v=)[0-9a-f]{10}/g, `$1${v}`)); }
const lista = (d, f) => fs.readdirSync(path.join(RAIZ, d), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? (["node_modules", ".git", "dev", "docs", "scripts", "perf", "api"].includes(e.name) ? [] : lista(d + "/" + e.name, f)) : f(e.name) ? [(d + "/" + e.name).replace(/^\.\//, "")] : []));
const activos = lista("assets/v2", (n) => /\.(js|css)$/.test(n));
const destinos = [...lista(".", (n) => n.endsWith(".html")), ...activos.filter((a) => a.endsWith(".js"))];
for (let vuelta = 0; vuelta < 6; vuelta++) {
  const hash = Object.fromEntries(activos.map((a) => [a, sha(fs.readFileSync(path.join(RAIZ, a)))]));
  let cambio = false;
  for (const rel of destinos) { const f = path.join(RAIZ, rel), antes = fs.readFileSync(f, "utf8"); let txt = antes; for (const [a, h] of Object.entries(hash)) txt = txt.split(`/${a}?v=`).map((t, i) => (i ? t.replace(/^[0-9a-f]{10}/, h) : t)).join(`/${a}?v=`); if (txt !== antes) { fs.writeFileSync(f, txt); cambio = true; } }
  if (!cambio) break;
}
nodo("scripts/seo/seo.mjs"); nodo("scripts/v2/sitemap.mjs");
