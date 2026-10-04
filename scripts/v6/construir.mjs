#!/usr/bin/env node
/* Construye la portada «el sistema»: empaqueta la escena (scripts/v6/sistema + three.js → assets/v2/js/sistema.js), genera el <main> de las dos portadas,
   pone a cada referencia de /assets/v2 su ?v= por contenido y vuelve a aplicar el SEO y el sitemap. Uso: node scripts/v6/construir.mjs [--motor] */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import zlib from "node:zlib";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const nodo = (...a) => execFileSync("node", a, { cwd: RAIZ, stdio: "inherit" });
const salida = path.join(RAIZ, "assets/v2/js/sistema.js");
await build({ entryPoints: [path.join(RAIZ, "scripts/v6/sistema/sistema.js")], bundle: true, minify: true, format: "esm", target: "es2020", legalComments: "none", outfile: salida, banner: { js: "/* D-Code · «El sistema», la escena de la portada. Fuente: scripts/v6/sistema/ · incluye three.js (MIT, © three.js authors) */" } });
console.log(`sistema.js: ${(fs.statSync(salida).size / 1024).toFixed(0)} KB · ${(zlib.gzipSync(fs.readFileSync(salida), { level: 9 }).length / 1024).toFixed(0)} KB comprimido`);
if (process.argv.includes("--motor")) process.exit(0);
nodo("scripts/v6/portada.mjs");
const lista = (dir, f) => fs.readdirSync(path.join(RAIZ, dir), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? (["node_modules", ".git", "dev", "docs", "scripts", "perf", "api"].includes(e.name) ? [] : lista(dir + "/" + e.name, f)) : f(e.name) ? [(dir + "/" + e.name).replace(/^\.\//, "")] : []));
const activos = lista("assets/v2", (n) => /\.(js|css)$/.test(n));
const destinos = [...lista(".", (n) => n.endsWith(".html")), ...activos.filter((a) => a.endsWith(".js"))];
for (let vuelta = 0; vuelta < 6; vuelta++) {
  const hash = Object.fromEntries(activos.map((a) => [a, crypto.createHash("sha256").update(fs.readFileSync(path.join(RAIZ, a))).digest("hex").slice(0, 10)]));
  let cambio = false;
  for (const rel of destinos) { const f = path.join(RAIZ, rel), antes = fs.readFileSync(f, "utf8"); let txt = antes; for (const [a, h] of Object.entries(hash)) txt = txt.split(`/${a}?v=`).map((t, i) => (i ? t.replace(/^[0-9a-f]{10}/, h) : t)).join(`/${a}?v=`); if (txt !== antes) { fs.writeFileSync(f, txt); cambio = true; } }
  if (!cambio) break;
}
nodo("scripts/seo/seo.mjs"); nodo("scripts/v2/sitemap.mjs");
