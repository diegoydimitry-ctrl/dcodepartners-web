#!/usr/bin/env node
/* Construye la portada «el salto»:
   1. empaqueta el mundo 3D (scripts/v5/salto + three.js → assets/v2/js/salto.js)
   2. genera el <main> de las dos portadas (scripts/v5/portada.mjs)
   3. pone a cada referencia de /assets/v2 su ?v= por contenido
   4. vuelve a aplicar el SEO y el sitemap
   Uso: node scripts/v5/construir.mjs [--motor]   (--motor: solo el paso 1) */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import zlib from "node:zlib";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const nodo = (...a) => execFileSync("node", a, { cwd: RAIZ, stdio: "inherit" });
const salida = path.join(RAIZ, "assets/v2/js/salto.js");
await build({ entryPoints: [path.join(RAIZ, "scripts/v5/salto/salto.js")], bundle: true, minify: true, format: "esm", target: "es2020", legalComments: "none", outfile: salida, banner: { js: "/* D-Code · «El salto», el mundo de la portada. Fuente: scripts/v5/salto/ · incluye three.js (MIT, © three.js authors) */" } });
await build({ entryPoints: [path.join(RAIZ, "scripts/v5/salto/obrero.js")], bundle: true, minify: true, format: "iife", target: "es2020", legalComments: "none", outfile: path.join(RAIZ, "assets/v2/js/salto-obra.js"), banner: { js: "/* D-Code · «El salto»: el hilo que calcula el valle. Fuente: scripts/v5/salto/ */" } });
console.log(`salto.js: ${(fs.statSync(salida).size / 1024).toFixed(0)} KB · ${(zlib.gzipSync(fs.readFileSync(salida), { level: 9 }).length / 1024).toFixed(0)} KB comprimido`);
if (process.argv.includes("--motor")) process.exit(0);
nodo("scripts/v5/portada.mjs");

const lista = (dir, f) => fs.readdirSync(path.join(RAIZ, dir), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? (["node_modules", ".git", "dev", "docs", "scripts", "perf", "api"].includes(e.name) ? [] : lista(dir + "/" + e.name, f)) : f(e.name) ? [(dir + "/" + e.name).replace(/^\.\//, "")] : []));
const activos = lista("assets/v2", (n) => /\.(js|css)$/.test(n));
const destinos = [...lista(".", (n) => n.endsWith(".html")), ...activos.filter((a) => a.endsWith(".js"))];
for (let vuelta = 0; vuelta < 6; vuelta++) {
  const hash = Object.fromEntries(activos.map((a) => [a, crypto.createHash("sha256").update(fs.readFileSync(path.join(RAIZ, a))).digest("hex").slice(0, 10)]));
  let cambio = false;
  for (const rel of destinos) {
    const f = path.join(RAIZ, rel), antes = fs.readFileSync(f, "utf8"); let txt = antes;
    for (const [a, h] of Object.entries(hash)) txt = txt.split(`/${a}?v=`).map((t, i) => (i ? t.replace(/^[0-9a-f]{10}/, h) : t)).join(`/${a}?v=`);
    if (txt !== antes) { fs.writeFileSync(f, txt); cambio = true; }
  }
  if (!cambio) break;
}
nodo("scripts/seo/seo.mjs"); nodo("scripts/v2/sitemap.mjs");
