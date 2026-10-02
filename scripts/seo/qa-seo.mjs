#!/usr/bin/env node
/* ==========================================================================
   QA SEO · npm run qa:seo
   --------------------------------------------------------------------------
   Simula el rastreo de la web sobre los ficheros que se despliegan y comprueba
   lo que Google necesita para rastrear, entender e indexar cada página.
   Sale con error si hay algún fallo. No inventa nada: solo mide.

   Qué mira
     · por página: title, description, canonical, robots, lang, hreflang
       (con reciprocidad), un solo h1, jerarquía de títulos, Open Graph,
       Twitter, JSON-LD (que se lea, que sus URLs existan, que las preguntas
       de FAQPage estén visibles), imágenes (alt, dimensiones, que existan),
       enlaces internos (rotos, a redirecciones, páginas huérfanas)
     · del sitio: sitemap.xml (solo URLs canónicas e indexables, todas ellas,
       con lastmod), robots.txt, redirecciones de vercel.json sin cadenas,
       versiones ?v= de /assets/v2 iguales al contenido del fichero

   Uso
     node scripts/seo/qa-seo.mjs                 comprueba los ficheros
     node scripts/seo/qa-seo.mjs --mapa          además escribe docs/seo/MAPA-RASTREO.md
     node scripts/seo/qa-seo.mjs --json          resumen en JSON (para comparar antes/después)
     node scripts/seo/qa-seo.mjs --online [url]  además pide cada URL a la web publicada
                                                 (por defecto https://dcodepartners.com) y
                                                 compara estado HTTP, canonical y robots
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { parse } from "node-html-parser";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SITIO = "https://dcodepartners.com";
const args = process.argv.slice(2);
const conMapa = args.includes("--mapa");
const enJson = args.includes("--json");
const online = args.includes("--online");
const baseOnline = (args[args.indexOf("--online") + 1] || "").startsWith("http") ? args[args.indexOf("--online") + 1].replace(/\/$/, "") : SITIO;

// Lo que se publica (misma lista que .vercelignore): HTML de la raíz y estas carpetas.
const PUBLICAS = ["en", "blog", "departamentos", "servicios", "sistema-financiero", "demos"];
function paginas() {
  const out = fs.readdirSync(RAIZ).filter((f) => f.endsWith(".html"));
  const rec = (dir) => { for (const e of fs.readdirSync(path.join(RAIZ, dir), { withFileTypes: true })) { const rel = dir + "/" + e.name; if (e.isDirectory()) rec(rel); else if (e.name.endsWith(".html")) out.push(rel); } };
  PUBLICAS.filter((d) => fs.existsSync(path.join(RAIZ, d))).forEach(rec);
  return out.sort();
}
const ruta = (rel) => "/" + rel.replace(/(^|\/)index\.html$/, "").replace(/\.html$/, "").replace(/\/$/, "");
const limpia = (href) => { let h = href.split("#")[0].split("?")[0]; if (h.length > 1) h = h.replace(/\/$/, ""); return h || "/"; };
const existeFichero = (r) => { const f = r.replace(/^\//, ""); return fs.existsSync(path.join(RAIZ, f)) && fs.statSync(path.join(RAIZ, f)).isFile(); };
const vercel = JSON.parse(fs.readFileSync(path.join(RAIZ, "vercel.json"), "utf8"));
const redirs = new Map((vercel.redirects || []).map((r) => [r.source, r.destination]));

const fallos = [], avisos = [];
const F = (donde, que) => fallos.push(`${donde}: ${que}`);
const A = (donde, que) => avisos.push(`${donde}: ${que}`);

// ───────────── 1. Leer cada página
const P = new Map(); // ruta → datos
for (const rel of paginas()) {
  const html = fs.readFileSync(path.join(RAIZ, rel), "utf8");
  const d = parse(html, { comment: false });
  const q = (sel, a = "content") => d.querySelector(sel)?.getAttribute(a) ?? "";
  const r = ruta(rel) || "/";
  const ld = [];
  let ldMal = 0;
  for (const x of d.querySelectorAll('script[type="application/ld+json"]')) {
    try { const j = JSON.parse(x.text); ld.push(...(Array.isArray(j) ? j : j["@graph"] || [j])); } catch { ldMal++; }
  }
  const main = d.querySelector("main") || d.querySelector("body") || d;
  const robots = q('meta[name="robots"]');
  P.set(r === "" ? "/" : r, {
    rel, r, html, d, ld, ldMal,
    titulo: d.querySelector("title")?.text.trim() || "",
    desc: q('meta[name="description"]'),
    canon: q('link[rel="canonical"]', "href"),
    robots, noindex: /noindex/.test(robots),
    lang: d.querySelector("html")?.getAttribute("lang") || "",
    hreflang: Object.fromEntries(d.querySelectorAll('link[rel="alternate"][hreflang]').map((l) => [l.getAttribute("hreflang"), l.getAttribute("href")])),
    h1: d.querySelectorAll("h1").map((h) => h.text.replace(/\s+/g, " ").trim()),
    niveles: d.querySelectorAll("h1,h2,h3,h4,h5").map((h) => +h.rawTagName[1]),
    og: Object.fromEntries(d.querySelectorAll('meta[property^="og:"],meta[property^="article:"]').map((m) => [m.getAttribute("property"), m.getAttribute("content")])),
    tw: Object.fromEntries(d.querySelectorAll('meta[name^="twitter:"]').map((m) => [m.getAttribute("name"), m.getAttribute("content")])),
    imgs: d.querySelectorAll("img"),
    enlaces: d.querySelectorAll("a[href]").map((a) => a.getAttribute("href")).filter((h) => h.startsWith("/") && !h.startsWith("//")),
    texto: main.text.replace(/\s+/g, " ").trim(),
    palabras: main.text.replace(/\s+/g, " ").trim().split(" ").length,
  });
}
const esApp = (p) => /^\/(en\/)?(demos\/|sistema-financiero\/(app|demo)$)/.test(p.r) || /\/404$/.test(p.r);
const indexables = [...P.values()].filter((p) => !p.noindex);
const resuelve = (h) => { const r = limpia(h); if (P.has(r)) return { tipo: "pagina", r }; if (redirs.has(r)) return { tipo: "redir", r, a: redirs.get(r) }; if (existeFichero(r)) return { tipo: "fichero", r }; return { tipo: "roto", r }; };

// ───────────── 2. Enlaces internos y páginas huérfanas
const entrantes = new Map([...P.keys()].map((r) => [r, new Set()]));
for (const p of P.values()) {
  const rotos = new Set(), aRedir = new Set();
  for (const h of p.enlaces) {
    const x = resuelve(h);
    if (x.tipo === "roto") rotos.add(x.r);
    else if (x.tipo === "redir") aRedir.add(x.r);
    else if (x.tipo === "pagina" && x.r !== p.r) entrantes.get(x.r).add(p.r);
  }
  if (rotos.size) F(p.rel, `enlaces internos rotos: ${[...rotos].join(", ")}`);
  if (aRedir.size) A(p.rel, `enlaza a una redirección (mejor al destino): ${[...aRedir].join(", ")}`);
}

// ───────────── 3. Comprobaciones por página
const titulos = new Map(), descs = new Map();
const tipos = (p) => p.ld.map((o) => [].concat(o["@type"] || []).join("/"));
for (const p of P.values()) {
  const w = p.rel;
  if (!p.titulo) F(w, "sin <title>");
  if (!p.lang) F(w, "sin lang en <html>");
  else if (p.r.startsWith("/en") !== (p.lang.slice(0, 2) === "en")) F(w, `lang="${p.lang}" no corresponde a la sección`);
  if (p.ldMal) F(w, `${p.ldMal} bloque(s) JSON-LD que no se pueden leer`);
  for (const i of p.imgs) {
    const src = i.getAttribute("src") || "";
    if (i.getAttribute("alt") === undefined) F(w, `imagen sin atributo alt: ${src}`);
    if (src.startsWith("/") && !existeFichero(limpia(src))) F(w, `imagen que no existe: ${src}`);
    if (!esApp(p) && (!i.getAttribute("width") || !i.getAttribute("height"))) A(w, `imagen sin width/height (puede mover el contenido al cargar): ${src}`);
  }
  if (p.noindex) { if (!esApp(p)) A(w, "lleva noindex y no es una demo ni la app"); continue; }

  // — solo páginas indexables a partir de aquí
  const esperado = SITIO + (p.r === "/" ? "/" : p.r);
  if (p.titulo.length > 65) A(w, `title de ${p.titulo.length} caracteres (Google suele cortar a partir de ~60-65)`);
  if (p.titulo.length < 25) A(w, `title de solo ${p.titulo.length} caracteres`);
  (titulos.get(p.titulo) || titulos.set(p.titulo, []).get(p.titulo)).push(w);
  if (!p.desc) F(w, "sin meta description");
  else {
    if (p.desc.length > 165) A(w, `description de ${p.desc.length} caracteres (se corta)`);
    if (p.desc.length < 70) A(w, `description de solo ${p.desc.length} caracteres`);
    if (/…$|\.\.\.$/.test(p.desc)) A(w, "la description termina cortada con puntos suspensivos");
    (descs.get(p.desc) || descs.set(p.desc, []).get(p.desc)).push(w);
  }
  if (p.canon !== esperado) F(w, `canonical «${p.canon}» ≠ ${esperado}`);
  if (p.h1.length !== 1) F(w, `${p.h1.length} h1 (debe haber exactamente uno)`);
  for (let i = 1; i < p.niveles.length; i++) if (p.niveles[i] > p.niveles[i - 1] + 1) { A(w, `salto de jerarquía h${p.niveles[i - 1]}→h${p.niveles[i]}`); break; }

  // hreflang: es + en + x-default, a URLs indexables, y recíproco
  const hl = p.hreflang;
  for (const k of ["es", "en", "x-default"]) if (!hl[k]) F(w, `falta hreflang="${k}"`);
  for (const [k, u] of Object.entries(hl)) {
    const r = limpia(u.replace(SITIO, "")) || "/";
    const dest = P.get(r);
    if (!u.startsWith(SITIO)) F(w, `hreflang ${k} no es absoluto: ${u}`);
    else if (!dest) F(w, `hreflang ${k} apunta a una URL que no existe: ${u}`);
    else if (dest.noindex) F(w, `hreflang ${k} apunta a una página noindex: ${u}`);
    else if (k !== "x-default" && Object.values(dest.hreflang).indexOf(esperado) === -1) F(w, `hreflang ${k} no es recíproco: ${u} no devuelve el enlace`);
  }
  const propio = p.r.startsWith("/en") ? "en" : "es";
  if (hl[propio] && hl[propio] !== esperado) F(w, `hreflang ${propio} debería ser la propia página`);

  // Open Graph y Twitter
  for (const k of ["og:title", "og:description", "og:url", "og:image", "og:type", "og:site_name", "og:locale"]) if (!p.og[k]) (k === "og:locale" ? A : F)(w, `falta ${k}`);
  if (p.og["og:url"] && p.og["og:url"] !== esperado) F(w, `og:url «${p.og["og:url"]}» ≠ canonical`);
  if (p.og["og:image"]) {
    if (!p.og["og:image"].startsWith(SITIO)) F(w, "og:image no es una URL absoluta del sitio");
    else if (!existeFichero(limpia(p.og["og:image"].replace(SITIO, "")))) F(w, `og:image no existe: ${p.og["og:image"]}`);
    if (!p.og["og:image:alt"]) A(w, "falta og:image:alt");
  }
  if (p.tw["twitter:card"] !== "summary_large_image") F(w, "falta twitter:card=summary_large_image");
  for (const k of ["twitter:title", "twitter:description", "twitter:image"]) if (!p.tw[k]) A(w, `falta ${k}`);

  // datos estructurados
  const t = tipos(p);
  const esArticulo = /^\/(en\/)?blog\/.+/.test(p.r);
  if (!t.length) A(w, "sin datos estructurados");
  if (p.r !== "/" && p.r !== "/en" && !t.includes("BreadcrumbList")) A(w, "sin BreadcrumbList");
  for (const o of p.ld) {
    const tipo = [].concat(o["@type"] || []).join("/");
    if (tipo === "BreadcrumbList") {
      const its = o.itemListElement || [];
      const ult = its[its.length - 1];
      if (ult?.item && ult.item !== esperado) F(w, `BreadcrumbList: el último elemento (${ult.item}) no es la propia página`);
      its.forEach((it, i) => { if (it.position !== i + 1) F(w, "BreadcrumbList: posiciones desordenadas"); if (!it.name) F(w, "BreadcrumbList: elemento sin nombre"); });
    }
    if (/^(Article|BlogPosting)$/.test(tipo)) for (const k of ["headline", "datePublished", "dateModified", "author", "image", "publisher", "mainEntityOfPage"]) if (!o[k]) F(w, `${tipo} sin ${k}`);
    if (tipo === "FAQPage") for (const pr of o.mainEntity || []) {
      if (!pr.acceptedAnswer?.text) F(w, `FAQPage: pregunta sin respuesta («${pr.name}»)`);
      if (!p.texto.includes(pr.name.replace(/\s+/g, " ").trim())) F(w, `FAQPage: la pregunta «${pr.name.slice(0, 60)}» no está visible en la página`);
    }
    if (/Review|AggregateRating/.test(JSON.stringify(o))) F(w, "datos estructurados con reseñas o valoraciones (no las tenemos: no se pueden declarar)");
  }
  // toda URL del sitio citada en los datos estructurados debe existir
  for (const u of new Set(JSON.stringify(p.ld).match(/https:\/\/dcodepartners\.com[^"\\]*/g) || [])) {
    const x = resuelve(u.replace(SITIO, "") || "/");
    if (x.tipo === "roto") F(w, `JSON-LD cita una URL que no existe: ${u}`);
    if (x.tipo === "redir") A(w, `JSON-LD cita una URL que redirige: ${u}`);
  }
  if (esArticulo) {
    if (p.og["og:type"] !== "article") F(w, `og:type «${p.og["og:type"]}» (un artículo debe ser «article»)`);
    if (!p.og["article:published_time"]) F(w, "artículo sin article:published_time");
    if (!t.some((x) => /^(Article|BlogPosting)$/.test(x))) F(w, "artículo sin datos estructurados Article/BlogPosting");
  }
  const n = entrantes.get(p.r).size;
  if (n === 0 && p.r !== "/") F(w, "página huérfana: ninguna otra página la enlaza");
  else if (n < 5 && p.r !== "/") A(w, `solo ${n} página(s) la enlazan`);
}
for (const [t, rs] of titulos) if (rs.length > 1) F("títulos", `title duplicado «${t}» en ${rs.join(", ")}`);
for (const [, rs] of descs) if (rs.length > 1) F("descripciones", `description duplicada en ${rs.join(", ")}`);

// ───────────── 4. sitemap.xml
const sm = fs.readFileSync(path.join(RAIZ, "sitemap.xml"), "utf8");
const urls = [...sm.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({ loc: m[1].match(/<loc>([^<]+)<\/loc>/)?.[1], lastmod: m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1], alt: Object.fromEntries([...m[1].matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map((x) => [x[1], x[2]])) }));
const enSitemap = new Set();
const hoy = new Date().toISOString().slice(0, 10);
for (const u of urls) {
  const r = limpia((u.loc || "").replace(SITIO, "")) || "/";
  enSitemap.add(r);
  const p = P.get(r);
  if (!u.loc?.startsWith(SITIO)) F("sitemap", `URL fuera del dominio canónico: ${u.loc}`);
  else if (!p) F("sitemap", `${u.loc} no existe`);
  else if (p.noindex) F("sitemap", `${u.loc} lleva noindex`);
  else if (p.canon !== u.loc) F("sitemap", `${u.loc} no coincide con su canonical (${p.canon})`);
  if (!u.lastmod) F("sitemap", `${u.loc} sin <lastmod>`);
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(u.lastmod) || u.lastmod > hoy) F("sitemap", `${u.loc} con lastmod inválido o futuro (${u.lastmod})`);
  if (p && JSON.stringify(Object.entries(u.alt).sort()) !== JSON.stringify(Object.entries(p.hreflang).sort())) F("sitemap", `${u.loc}: los hreflang del sitemap no coinciden con los de la página`);
}
for (const p of indexables) if (!enSitemap.has(p.r)) F("sitemap", `falta ${p.r} (es indexable)`);
if (urls.length !== enSitemap.size) F("sitemap", "hay URLs repetidas");

// ───────────── 5. robots.txt y redirecciones
const robots = fs.readFileSync(path.join(RAIZ, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${SITIO}/sitemap.xml`)) F("robots.txt", "no declara el sitemap");
const vetos = [...robots.matchAll(/^Disallow:\s*(\S+)/gm)].map((m) => m[1]);
for (const v of vetos) {
  if (/^\/assets/.test(v)) F("robots.txt", `bloquea ${v}: Google necesita el CSS y el JS para ver la página`);
  for (const p of P.values()) if (p.r.startsWith(v.replace(/\*$/, ""))) (p.noindex ? F : F)("robots.txt", `bloquea ${p.r}${p.noindex ? " (lleva noindex: si se bloquea el rastreo, Google no llega a leer el noindex)" : ""}`);
}
for (const [de, a] of redirs) {
  if (redirs.has(a)) F("vercel.json", `cadena de redirecciones: ${de} → ${a} → ${redirs.get(a)}`);
  if (!P.has(a)) F("vercel.json", `redirección a una página que no existe: ${de} → ${a}`);
  if (P.has(de)) F("vercel.json", `${de} redirige, pero también existe como página`);
}

// ───────────── 6. Versiones ?v= de /assets/v2 (se sirven con caché larga: el hash debe ser el del fichero)
const hash = (f) => crypto.createHash("sha256").update(fs.readFileSync(path.join(RAIZ, f))).digest("hex").slice(0, 10);
const lista = (dir) => fs.readdirSync(path.join(RAIZ, dir), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? lista(dir + "/" + e.name) : [dir + "/" + e.name]));
const conVersion = [...[...P.values()].map((p) => [p.rel, p.html]), ...lista("assets/v2").filter((f) => f.endsWith(".js")).map((f) => [f, fs.readFileSync(path.join(RAIZ, f), "utf8")])];
let versiones = 0, sinVersion = new Set();
for (const [quien, txt] of conVersion) {
  for (const m of txt.matchAll(/\/(assets\/v2\/[\w./-]+\.(?:js|css))(\?v=([0-9a-f]+))?/g)) {
    if (!fs.existsSync(path.join(RAIZ, m[1]))) continue;
    if (!m[3]) { sinVersion.add(`${quien} → /${m[1]}`); continue; }
    versiones++;
    if (m[3] !== hash(m[1])) F(quien, `/${m[1]}?v=${m[3]} no corresponde al contenido (${hash(m[1])}): se serviría una versión antigua desde caché`);
  }
}
for (const s of [...sinVersion].filter((x) => x.includes(".html →"))) A("versiones", `referencia sin ?v= (no se beneficia de la caché larga): ${s}`);

// ───────────── 7. Mapa de rastreo
const filas = [...P.values()].map((p) => ({
  url: p.r, estado: 200, indexable: !p.noindex, canonical: p.canon.replace(SITIO, "") || "/", sitemap: enSitemap.has(p.r), entrantes: entrantes.get(p.r).size,
  title: p.titulo.length, desc: p.desc.length, h1: p.h1[0] || "", palabras: p.palabras, ld: tipos(p).join(" + ") || "—",
}));
const filasRedir = [...redirs].map(([de, a]) => ({ url: de, estado: 308, indexable: false, canonical: "→ " + a, sitemap: enSitemap.has(de), entrantes: 0 }));

// ───────────── 8. Contra la web publicada (opcional)
if (online) {
  console.log(`Comprobando ${filas.length + filasRedir.length} URLs en ${baseOnline} …`);
  const pedir = async (u) => { try { const r = await fetch(u, { redirect: "manual", headers: { "user-agent": "dcode-qa-seo" } }); return { estado: r.status, a: r.headers.get("location"), xrobots: r.headers.get("x-robots-tag"), html: r.status === 200 ? await r.text() : "" }; } catch (e) { return { estado: 0, error: e.message }; } };
  for (const f of [...filas, ...filasRedir]) {
    const r = await pedir(baseOnline + (f.url === "/" ? "/" : f.url));
    f.online = r.estado;
    if (r.estado === 0) { F("online", `${f.url}: no se pudo pedir (${r.error})`); continue; }
    if (r.estado !== f.estado) F("online", `${f.url}: responde ${r.estado}, se esperaba ${f.estado}`);
    if (r.estado === 200) {
      const c = r.html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] || "";
      const p = P.get(f.url);
      if (c !== p.canon) F("online", `${f.url}: canonical publicado «${c}» ≠ el del repositorio`);
      if (/noindex/.test(r.xrobots || "") && f.indexable) F("online", `${f.url}: la cabecera X-Robots-Tag lleva noindex (en un Preview de Vercel es lo normal; en producción no)`);
      const t = r.html.match(/<title>([^<]*)<\/title>/)?.[1] || "";
      if (t !== p.d.querySelector("title")?.innerHTML) A("online", `${f.url}: el title publicado no es el del repositorio (¿falta desplegar?)`);
    }
  }
  for (const u of ["/esta-pagina-no-existe-qa-seo", "/servicios/automatizaciones/", "/index.html"]) { const r = await pedir(baseOnline + u); console.log(`  ${u} → ${r.estado}${r.a ? " → " + r.a : ""}`); if (u.includes("no-existe") && r.estado !== 404) F("online", `una URL inexistente responde ${r.estado} en vez de 404`); }
}

if (conMapa) {
  const si = (b) => (b ? "sí" : "no");
  const md = `# Mapa de rastreo — dcodepartners.com

Generado por \`npm run qa:seo -- --mapa\` el ${hoy} sobre los ficheros que se despliegan${online ? ` y contra ${baseOnline}` : ""}.
El estado es el que da Vercel con \`cleanUrls\`: 200 si el fichero existe, 308 si hay redirección en \`vercel.json\`.

| | |
|---|---|
| Páginas HTML | ${P.size} |
| Indexables | ${indexables.length} |
| No indexables (demos, app, 404) | ${P.size - indexables.length} |
| URLs en sitemap.xml | ${urls.length} |
| Redirecciones 308 | ${redirs.size} |
| Fallos | **${fallos.length}** |
| Avisos | ${avisos.length} |

## URL → estado → indexable → canonical → sitemap → enlaces internos

| URL | Estado | Indexable | Canonical | Sitemap | Páginas que la enlazan | title | desc. | Palabras | Datos estructurados |
|---|---|---|---|---|---|---|---|---|---|
${filas.map((f) => `| ${f.url} | ${f.online ?? f.estado} | ${si(f.indexable)} | ${f.canonical === f.url ? "propia" : f.canonical} | ${si(f.sitemap)} | ${f.entrantes} | ${f.title} | ${f.desc} | ${f.palabras} | ${f.ld} |`).join("\n")}
${filasRedir.map((f) => `| ${f.url} | ${f.online ?? f.estado} | no | ${f.canonical} | ${si(f.sitemap)} | — | — | — | — | — |`).join("\n")}

## H1 de cada página indexable

| URL | H1 |
|---|---|
${filas.filter((f) => f.indexable).map((f) => `| ${f.url} | ${f.h1.replace(/\|/g, "\\|")} |`).join("\n")}

## Fallos
${fallos.length ? fallos.map((x) => "- " + x).join("\n") : "Ninguno."}

## Avisos
${avisos.length ? avisos.map((x) => "- " + x).join("\n") : "Ninguno."}
`;
  fs.mkdirSync(path.join(RAIZ, "docs/seo"), { recursive: true });
  fs.writeFileSync(path.join(RAIZ, "docs/seo/MAPA-RASTREO.md"), md);
}

const resumen = { paginas: P.size, indexables: indexables.length, sitemap: urls.length, conLastmod: urls.filter((u) => u.lastmod).length, redirecciones: redirs.size, versionesComprobadas: versiones, fallos: fallos.length, avisos: avisos.length };
if (enJson) console.log(JSON.stringify({ ...resumen, listaFallos: fallos, listaAvisos: avisos }, null, 1));
else {
  console.log(`qa:seo · ${P.size} páginas (${indexables.length} indexables) · sitemap ${urls.length} URLs · ${versiones} versiones ?v= · ${fallos.length} fallos · ${avisos.length} avisos`);
  fallos.forEach((x) => console.log("  ✗ " + x));
  if (args.includes("--avisos") || !fallos.length) avisos.slice(0, args.includes("--avisos") ? 999 : 15).forEach((x) => console.log("  · " + x));
}
process.exit(fallos.length ? 1 : 0);
