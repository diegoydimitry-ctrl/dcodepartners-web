/* Pone las webs de ejemplo en 3D (scripts/v2/paginas/webs3d.mjs) en las páginas migradas donde antes había cuatro
   capturas: «Qué hacemos» (capítulo 06, Páginas web) y «Páginas web» (capítulo 01, Para verlo), en ES y EN.
   Se ejecuta después de migrar.mjs (npm run build:v2). Idempotente: si ya está puesto, lo rehace igual. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cuerpoWebs, textosWebs } from "./paginas/webs3d.mjs";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
// La hoja de estilos se pide sin bloquear el primer pintado (media="print") y se activa al acercarse a la sección;
// hasta entonces, interior.css reserva su alto (sin saltos). Así sus cinco tipografías tampoco se piden antes de tiempo.
const CARGA = `<script type="module">{const r=document.querySelector("[data-webs3d]");if(r){const hoja=()=>new Promise(ok=>{const l=document.getElementById("w3-css");if(!l)return ok();const act=()=>{l.media="all";requestAnimationFrame(()=>ok())};if(l.sheet)act();else{l.addEventListener("load",act,{once:true});setTimeout(act,5000)}});const cargada=()=>new Promise(ok=>document.readyState==="complete"?ok():addEventListener("load",()=>ok(),{once:true}));const go=()=>cargada().then(hoja).then(()=>import("/assets/v2/js/webs3d.js")).then(m=>m.montarWebs(r)).catch(e=>console.warn("webs3d",e));if("IntersectionObserver"in window){const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io.disconnect();go()}},{rootMargin:"900px 0px"});io.observe(r)}else go()}}</script>`;
const CSS = `<link rel="stylesheet" href="/assets/v2/webs3d.css" media="print" id="w3-css"><noscript><link rel="stylesheet" href="/assets/v2/webs3d.css"></noscript>`;

const PAGINAS = [
  ["que-hacemos.html", "es", /(<h2 class="h2" id="qh-webs">)[^<]*(<\/h2><p class="lead">)[^<]*(<\/p><\/div>\s*<div class="capitulo-cuerpo prosa">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>)/],
  ["en/que-hacemos.html", "en", /(<h2 class="h2" id="qh-webs">)[^<]*(<\/h2><p class="lead">)[^<]*(<\/p><\/div>\s*<div class="capitulo-cuerpo prosa">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>)/],
  ["servicios/paginas-web.html", "es", /(<h2 class="h2">)Cuatro ejemplos, y se pueden bajar(<\/h2><p class="lead">)[^<]*(<\/p><\/div>\s*<div class="capitulo-cuerpo prosa">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>)/],
  ["en/servicios/paginas-web.html", "en", /(<h2 class="h2">)Four examples, and you can scroll them(<\/h2><p class="lead">)[^<]*(<\/p><\/div>\s*<div class="capitulo-cuerpo prosa">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>)/],
];
let n = 0;
for (const [rel, lang, re] of PAGINAS) {
  const f = path.join(RAIZ, rel);
  if (!fs.existsSync(f)) { console.warn("webs3d: no existe", rel); continue; }
  let h = fs.readFileSync(f, "utf8");
  const t = textosWebs(lang);
  if (!re.test(h)) { console.warn("webs3d: no encuentro el capítulo en", rel); continue; }
  h = h.replace(re, (m, a, b, c, d) => `${a}${t.h}${b}${t.lead}${c.replace('class="capitulo-cuerpo prosa"', 'class="capitulo-cuerpo capitulo-cuerpo--ancho"')}${cuerpoWebs(lang)}${d}`);
  if (!h.includes('href="/assets/v2/webs3d.css"')) h = h.replace("</head>", `${CSS}\n</head>`);
  if (!h.includes("montarWebs")) h = h.replace("</body>", `${CARGA}\n</body>`);
  fs.writeFileSync(f, h); n++;
}
console.log(`webs3d: ${n} páginas`);
