#!/usr/bin/env node
/* ==========================================================================
   TEXTOS DE LA WEB EN ESPAÑOL (revisión de voz, 29/09/2026)
   --------------------------------------------------------------------------
   Los textos de la web se reescribieron para que suenen escritos por una
   persona: frases completas que se entienden solas, sin titulares a medias.
   Cada archivo de scripts/v2/textos/*.json guarda los cambios de una página
   (o de todas, con "archivos": "*") como pares [texto anterior, texto nuevo],
   tal como aparecen en el HTML.

   Se aplican al final de la construcción (build:v2 y sync-content), después
   de los scripts que generan las páginas desde sus fuentes antiguas, así que
   una reconstrucción no devuelve los textos viejos.

   Uso:
     node scripts/v2/textos.mjs            aplica todos los cambios
     node scripts/v2/textos.mjs --check    solo comprueba (sale con error si
                                           algún texto nuevo no está en su página)
     node scripts/v2/textos.mjs x.json     aplica o comprueba solo ese archivo
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DIR = path.join(RAIZ, "scripts/v2/textos");
const args = process.argv.slice(2);
const soloComprobar = args.includes("--check");
const probar = args.includes("--probar"); // antes de aplicar: ¿se encuentra cada texto anterior?
const elegidos = args.filter((a) => a.endsWith(".json")).map((a) => path.basename(a));

// Todas las páginas en español que se publican (las de /en tienen su propio texto).
function paginasES() {
  const fuera = new Set(["node_modules", "en", "dev", "perf", "docs", "assets", "scripts", "api", ".git", ".vercel"]);
  const lista = [];
  (function recorrer(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) { if (!(dir === RAIZ && fuera.has(e.name))) recorrer(path.join(dir, e.name)); continue; }
      if (e.name.endsWith(".html")) lista.push(path.relative(RAIZ, path.join(dir, e.name)));
    }
  })(RAIZ);
  return lista.sort();
}

// Las páginas en inglés solo se recorren para actualizar el ?v= de los scripts compartidos (su texto no se toca).
paginasES.en = () => { const lista = []; (function r(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (e.isDirectory()) r(path.join(d, e.name)); else if (e.name.endsWith(".html")) lista.push(path.relative(RAIZ, path.join(d, e.name))); } })(path.join(RAIZ, "en")); return lista; };

const archivos = fs.readdirSync(DIR).filter((f) => f.endsWith(".json") && (!elegidos.length || elegidos.includes(f))).sort();
let fallos = 0, aplicados = 0, yaEstaban = 0;
const cache = new Map();
const leer = (rel) => { if (!cache.has(rel)) cache.set(rel, fs.readFileSync(path.join(RAIZ, rel), "utf8")); return cache.get(rel); };
const tocados = new Set();

for (const nombre of archivos) {
  const def = JSON.parse(fs.readFileSync(path.join(DIR, nombre), "utf8"));
  const destino = def.archivos === "*" ? paginasES() : [].concat(def.archivos || def.archivo);
  for (const [i, par] of (def.cambios || []).entries()) {
    const [antes, despues] = par;
    if (typeof antes !== "string" || typeof despues !== "string" || !antes) { console.error(`✗ ${nombre} #${i}: par mal formado`); fallos++; continue; }
    if (despues.includes(antes)) { console.error(`✗ ${nombre} #${i}: el texto nuevo contiene el viejo (se aplicaría dos veces)`); fallos++; continue; }
    let algunaVez = false, estaNuevo = false;
    for (const rel of destino) {
      if (!fs.existsSync(path.join(RAIZ, rel))) { console.error(`✗ ${nombre}: no existe ${rel}`); fallos++; continue; }
      const html = leer(rel);
      if (html.includes(antes)) {
        algunaVez = true;
        if (!soloComprobar && !probar) { cache.set(rel, html.split(antes).join(despues)); tocados.add(rel); aplicados++; }
      } else if (html.includes(despues)) { estaNuevo = true; }
    }
    if (probar) { if (!algunaVez && !estaNuevo) { console.error(`✗ ${nombre} #${i}: no se encuentra «${antes.slice(0, 80)}»`); fallos++; } continue; }
    if (algunaVez && soloComprobar) { console.error(`· ${nombre} #${i}: pendiente de aplicar «${antes.slice(0, 60)}»`); fallos++; }
    else if (!algunaVez && estaNuevo) yaEstaban++;
    else if (!algunaVez) { console.error(`✗ ${nombre} #${i}: no se encuentra «${antes.slice(0, 80)}»`); fallos++; }
  }
}
if (!soloComprobar && !probar) for (const rel of tocados) fs.writeFileSync(path.join(RAIZ, rel), cache.get(rel));

// Si se ha cambiado un script de /assets/v2 (p. ej. los textos de las demos en demos.js), su ?v= por contenido
// (sha256, 10 caracteres) cambia, y con él el de los scripts que lo importan: se recalcula hasta que no cambie nada.
if (!soloComprobar && !probar && [...tocados].some((r) => r.startsWith("assets/v2/"))) {
  const lista = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? lista(path.join(dir, e.name)) : [path.join(dir, e.name)]);
  const activos = lista(path.join(RAIZ, "assets/v2")).filter((f) => /\.(js|css)$/.test(f)).map((f) => path.relative(RAIZ, f));
  const destinos = [...paginasES(), ...paginasES.en(), ...activos.filter((a) => a.endsWith(".js"))];
  for (let vuelta = 0; vuelta < 5; vuelta++) {
    const hash = Object.fromEntries(activos.map((a) => [a, crypto.createHash("sha256").update(fs.readFileSync(path.join(RAIZ, a))).digest("hex").slice(0, 10)]));
    let cambio = false;
    for (const rel of destinos) {
      const f = path.join(RAIZ, rel), antes = fs.readFileSync(f, "utf8");
      let txt = antes;
      for (const [a, h] of Object.entries(hash)) txt = txt.split(`/${a}?v=`).map((trozo, i) => (i ? trozo.replace(/^[0-9a-f]{10}/, h) : trozo)).join(`/${a}?v=`);
      if (txt !== antes) { fs.writeFileSync(f, txt); cambio = true; }
    }
    if (!cambio) break;
  }
}
console.log(`textos: ${archivos.length} archivos · ${aplicados} cambios aplicados · ${yaEstaban} ya estaban · ${fallos} problemas${tocados.size ? ` · ${tocados.size} páginas escritas` : ""}`);
process.exit(fallos ? 1 : 0);
