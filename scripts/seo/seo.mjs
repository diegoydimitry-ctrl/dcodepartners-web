#!/usr/bin/env node
/* ==========================================================================
   SEO de dcodepartners.com · aplica scripts/seo/datos.mjs a las páginas
   --------------------------------------------------------------------------
   Las páginas publicadas son HTML ya construido, así que el SEO se aplica
   sobre ese HTML. El script es idempotente: se puede ejecutar las veces que
   haga falta (y en cualquier rama) y deja siempre el mismo resultado.

   Qué hace en cada página indexable
     1. title, meta description y sus copias en Open Graph y Twitter
     2. h1 (una frase completa que dice de qué va la página)
     3. Open Graph: og:image:alt, y en los artículos og:type=article con fechas
     4. datos estructurados: un solo bloque JSON-LD con @graph
        (Organization, WebSite, WebPage, BreadcrumbList y, según la página,
        Service, SoftwareApplication, Blog, BlogPosting o ItemList).
        FAQPage y OfferCatalog los generan sus propios scripts y no se tocan.
     5. bloque «cuándo tiene sentido» en los servicios, enlaces dentro de los
        artículos y enlace al diagnóstico en el pie
   Cuando cambia un texto en español, actualiza también su par en
   scripts/v2/textos/*.json para que `npm run check:textos` siga cuadrando.

   Uso:  node scripts/seo/seo.mjs           aplica
         node scripts/seo/seo.mjs --check   no escribe; falla si algo está sin aplicar
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITIO, EMPRESA, PAGINAS, CUANDO, ENLACES, PIE } from "./datos.mjs";
import { fechaDe } from "./lastmod.mjs";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const soloComprobar = process.argv.includes("--check");
const PUBLICAS = ["en", "blog", "departamentos", "servicios", "sistema-financiero", "demos"];
function paginas() {
  const out = fs.readdirSync(RAIZ).filter((f) => f.endsWith(".html"));
  const rec = (dir) => { for (const e of fs.readdirSync(path.join(RAIZ, dir), { withFileTypes: true })) { const rel = dir + "/" + e.name; if (e.isDirectory()) rec(rel); else if (e.name.endsWith(".html")) out.push(rel); } };
  PUBLICAS.filter((d) => fs.existsSync(path.join(RAIZ, d))).forEach(rec);
  return out.sort();
}
const esc = (t) => t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const desesc = (t) => t.replace(/&quot;/g, '"').replace(/&#39;|&#x27;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const sinEtiquetas = (t) => desesc(t.replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
const problemas = [];

// —— Pares de scripts/v2/textos: si cambia un texto en español, su par se actualiza
const DIR_TEXTOS = path.join(RAIZ, "scripts/v2/textos");
const crudo = new Map(fs.readdirSync(DIR_TEXTOS).filter((f) => f.endsWith(".json")).map((f) => [f, fs.readFileSync(path.join(DIR_TEXTOS, f), "utf8")]));
const textos = new Map([...crudo].map(([f, t]) => [f, JSON.parse(t)]));
const textosTocados = new Set();
function actualizarPar(rel, antes, despues) {
  if (rel.startsWith("en/") || antes === despues || !antes) return;
  for (const [f, def] of textos) {
    const destino = [].concat(def.archivos || def.archivo || []);
    if (!(destino.length === 1 && destino[0] === rel)) continue; // los pares comunes a varias páginas no se tocan
    for (const par of def.cambios || []) if (par[1].includes(antes)) {
      const nuevo = par[1].split(antes).join(despues);
      // se sustituye en el texto del archivo, para respetar su formato (un par por línea)
      const t = crudo.get(f), viejoJson = JSON.stringify(par[1]);
      let i = -1, hecho = false;
      while ((i = t.indexOf(viejoJson, i + 1)) >= 0) if (/^\s*\]/.test(t.slice(i + viejoJson.length, i + viejoJson.length + 40))) { crudo.set(f, t.slice(0, i) + JSON.stringify(nuevo) + t.slice(i + viejoJson.length)); hecho = true; break; }
      if (!hecho) { problemas.push(`${f}: no encuentro el par de «${antes.slice(0, 50)}» para actualizarlo`); continue; }
      par[1] = nuevo; textosTocados.add(f);
    }
  }
}

const url = (r) => SITIO + (r === "/" ? "/" : r);
const ORG = SITIO + "/#organizacion", WEB = SITIO + "/#web";

function organizacion(lang, completa) {
  const o = { "@type": "Organization", "@id": ORG, name: EMPRESA.nombre, url: SITIO + "/", logo: { "@type": "ImageObject", url: SITIO + EMPRESA.logo, width: 512, height: 512 } };
  if (!completa) return o;
  return {
    ...o, alternateName: EMPRESA.alias, description: EMPRESA.descripcion[lang], image: SITIO + (lang === "en" ? "/assets/og-image-en.png" : "/assets/og-image.png"), email: EMPRESA.email, sameAs: EMPRESA.redes,
    address: { "@type": "PostalAddress", addressLocality: EMPRESA.localidad, addressCountry: EMPRESA.pais },
    areaServed: { "@type": "Country", name: lang === "en" ? "Spain" : "España" },
    founder: EMPRESA.fundadores.map((f) => ({ "@type": "Person", name: f.nombre, ...(f.enlace ? { sameAs: f.enlace } : {}) })),
    knowsAbout: EMPRESA.sabeDe[lang],
    contactPoint: { "@type": "ContactPoint", contactType: lang === "en" ? "sales" : "ventas", email: EMPRESA.email, url: url(lang === "en" ? "/en/contacto" : "/contacto"), availableLanguage: ["es", "en"] },
  };
}

const estado = new Map(); // rel → html en curso
const leer = (rel) => { if (!estado.has(rel)) estado.set(rel, fs.readFileSync(path.join(RAIZ, rel), "utf8")); return estado.get(rel); };
const meta = (s, re) => desesc(s.match(re)?.[1] ?? "");
const info = (rel) => {
  const s = leer(rel);
  return {
    titulo: meta(s, /<title>([^<]*)<\/title>/), desc: meta(s, /<meta name="description" content="([^"]*)">/),
    h1: sinEtiquetas(s.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? ""),
    noindex: /<meta name="robots" content="[^"]*noindex/.test(s),
  };
};

const todas = paginas();
let cambiadas = 0;
for (const rel of todas) {
  const original = leer(rel);
  let s = original;
  if (/<meta name="robots" content="[^"]*noindex/.test(s)) continue; // demos, app y 404: no se tocan
  const en = rel.startsWith("en/"), lang = en ? "en" : "es";
  const r = ("/" + rel.replace(/(^|\/)index\.html$/, "").replace(/\.html$/, "").replace(/\/$/, "")) || "/";
  const clave = (en ? r.replace(/^\/en/, "") : r) || "/";
  const conf = PAGINAS[clave];
  if (!conf) { problemas.push(`${rel}: no está en scripts/seo/datos.mjs (añádela a PAGINAS)`); continue; }
  const c = conf[lang] || {};
  const pref = en ? "/en" : "";
  const cambia = (re, nuevoValor, etiqueta) => {
    const m = s.match(re);
    if (!m) { problemas.push(`${rel}: no se encuentra ${etiqueta}`); return; }
    if (m[2] === nuevoValor) return;
    actualizarPar(rel, m[2], nuevoValor);
    s = s.replace(re, (_, a, __, z) => a + nuevoValor + z);
  };

  // 1 · title y description (y sus copias sociales)
  if (c.title) for (const [re, n] of [[/(<title>)([^<]*)(<\/title>)/, "title"], [/(<meta property="og:title" content=")([^"]*)(">)/, "og:title"], [/(<meta name="twitter:title" content=")([^"]*)(">)/, "twitter:title"]]) cambia(re, esc(c.title), n);
  if (c.description) for (const [re, n] of [[/(<meta name="description" content=")([^"]*)(">)/, "description"], [/(<meta property="og:description" content=")([^"]*)(">)/, "og:description"], [/(<meta name="twitter:description" content=")([^"]*)(">)/, "twitter:description"]]) cambia(re, esc(c.description), n);

  // 2 · h1
  if (c.h1) cambia(/(<h1\b[^>]*>)([\s\S]*?)(<\/h1>)/, c.h1, "h1");

  // 5 · contenido y enlaces (antes de los datos estructurados, que usan la fecha de modificación)
  const cuando = CUANDO[clave]?.[lang];
  if (cuando) {
    const bloque = `<section class="capitulo" data-seo="cuando">
  <div class="marco capitulo-in">
    <div class="capitulo-cab"><p class="cap-num" aria-hidden="true">00</p><p class="etiqueta">${cuando.etiqueta}</p><h2 class="h2">${cuando.h2}</h2></div>
    <div class="capitulo-cuerpo prosa"><ul class="puntos-l">${cuando.puntos.map(([t, d]) => `<li><p class="pl-t">${t}</p><p class="pl-d">${d}</p></li>`).join("")}</ul>
<p>${cuando.cierre}</p></div>
  </div>
</section>`;
    const ya = /<section class="capitulo" data-seo="cuando">[\s\S]*?<\/section>/;
    if (ya.test(s)) s = s.replace(ya, () => bloque);
    else {
      const cab = s.indexOf("</header>", s.indexOf("<main")), fin = s.indexOf("</section>", cab);
      if (cab < 0 || fin < 0) problemas.push(`${rel}: no sé dónde poner el bloque «cuándo»`);
      else s = s.slice(0, fin + 10) + "\n" + bloque + s.slice(fin + 10);
    }
    // los capítulos numerados se renumeran en orden
    const i0 = s.indexOf("<main"), i1 = s.indexOf("</main>");
    let n = 0;
    s = s.slice(0, i0) + s.slice(i0, i1).replace(/(<p class="cap-num" aria-hidden="true">)\d+(<\/p>)/g, (_, x, z) => x + String(++n).padStart(2, "0") + z) + s.slice(i1);
  }
  for (const [antes, despues] of ENLACES[rel] || []) {
    if (s.includes(despues)) continue;
    if (!s.includes(antes)) { problemas.push(`${rel}: no se encuentra «${antes.slice(0, 60)}» para enlazarlo`); continue; }
    actualizarPar(rel, antes, despues);
    s = s.replace(antes, () => despues);
  }
  const pie = PIE[lang];
  if (!s.includes(pie.nuevo) && s.includes(pie.antes) && s.includes('<footer class="pie">')) {
    const i = s.indexOf('<footer class="pie">'), j = s.indexOf(pie.antes, i);
    if (j > 0) s = s.slice(0, j) + pie.nuevo + s.slice(j);
  }
  if (en && clave.startsWith("/blog")) s = s.replace(/(<span class="fe-d">)[\w-]+\.md\s+(\w+)\s{2,}/g, "$1$2 · "); // se colaba el nombre del fichero de origen

  // 3 · Open Graph
  estado.set(rel, s);
  const ahora = info(rel);
  const modificado = fechaDe(rel, s);
  const esArticulo = conf.tipo === "articulo";
  s = s.replace(/<meta property="(?:article:[a-z_]+|og:image:alt)" content="[^"]*">\n?/g, "").replace(/<meta name="twitter:image:alt" content="[^"]*">\n?/g, "");
  s = s.replace(/(<meta property="og:type" content=")[^"]*(">)/, `$1${esArticulo ? "article" : "website"}$2`);
  s = s.replace(/(<meta property="og:image:height" content="[^"]*">\n?)/, `$1<meta property="og:image:alt" content="${esc(EMPRESA.altImagen[lang])}">\n`);
  s = s.replace(/(<meta name="twitter:image" content="[^"]*">\n?)/, `$1<meta name="twitter:image:alt" content="${esc(EMPRESA.altImagen[lang])}">\n`);
  if (esArticulo) s = s.replace(/(<meta property="og:type" content="article">\n?)/, `$1<meta property="article:published_time" content="${conf.publicado}">\n<meta property="article:modified_time" content="${modificado > conf.publicado ? modificado : conf.publicado}">\n<meta property="article:section" content="${esc(c.seccion)}">\n<meta property="article:publisher" content="${EMPRESA.redes[1]}">\n`);

  // 4 · datos estructurados
  const U = url(r), idPag = U + "#pagina", idMigas = U + "#migas";
  const nombre = c.nombre || ahora.h1; // artículos y páginas legales: su propio h1
  const imagen = SITIO + (en ? "/assets/og-image-en.png" : "/assets/og-image.png");
  const inicio = { nombre: PAGINAS["/"][lang].nombre, u: url(en ? "/en" : "/") };
  const padre = /^\/(servicios|departamentos)\//.test(clave) ? { nombre: PAGINAS["/que-hacemos"][lang].nombre, u: url(pref + "/que-hacemos") } : esArticulo ? { nombre: "Blog", u: url(pref + "/blog") } : null;
  const migas = clave === "/" ? null : [inicio, ...(padre ? [padre] : []), { nombre, u: U }];
  const tipoPagina = { contacto: "ContactPage", quienes: "AboutPage", blog: "CollectionPage", servicios: "CollectionPage" }[conf.tipo] || "WebPage";
  const grafo = [organizacion(lang, ["inicio", "contacto", "quienes"].includes(conf.tipo))];
  grafo.push({ "@type": "WebSite", "@id": WEB, url: SITIO + "/", name: EMPRESA.nombre, inLanguage: ["es", "en"], publisher: { "@id": ORG } });
  grafo.push({
    "@type": tipoPagina, "@id": idPag, url: U, name: ahora.titulo, description: ahora.desc, inLanguage: lang, isPartOf: { "@id": WEB },
    ...(clave === "/" ? { about: { "@id": ORG } } : { breadcrumb: { "@id": idMigas } }),
    primaryImageOfPage: { "@type": "ImageObject", url: imagen, width: 1200, height: 630 }, dateModified: modificado,
  });
  if (migas) grafo.push({ "@type": "BreadcrumbList", "@id": idMigas, itemListElement: migas.map((m, i) => ({ "@type": "ListItem", position: i + 1, name: m.nombre, item: m.u })) });
  if (conf.tipo === "servicio") grafo.push({
    "@type": "Service", "@id": U + "#servicio", name: c.servicio, serviceType: c.servicio, description: ahora.desc, url: U, provider: { "@id": ORG },
    areaServed: { "@type": "Country", name: en ? "Spain" : "España" }, availableLanguage: ["es", "en"], mainEntityOfPage: { "@id": idPag },
  });
  if (conf.tipo === "software") grafo.push({
    "@type": "SoftwareApplication", "@id": U + "#software", name: "D-Code Finance", applicationCategory: "BusinessApplication", applicationSubCategory: en ? "Invoicing and finance software" : "Programa de facturación y finanzas", operatingSystem: "Web",
    description: ahora.desc, url: U, inLanguage: ["es", "en"], publisher: { "@id": ORG }, mainEntityOfPage: { "@id": idPag },
  });
  if (conf.tipo === "articulo") grafo.push({
    "@type": "BlogPosting", "@id": U + "#articulo", headline: ahora.h1, description: ahora.desc, articleSection: c.seccion, inLanguage: lang,
    datePublished: conf.publicado, dateModified: modificado > conf.publicado ? modificado : conf.publicado,
    author: { "@type": "Organization", "@id": ORG, name: EMPRESA.nombre, url: SITIO + "/" }, publisher: { "@id": ORG },
    image: { "@type": "ImageObject", url: imagen, width: 1200, height: 630 }, mainEntityOfPage: { "@id": idPag }, isPartOf: { "@id": url(pref + "/blog") + "#blog" },
    wordCount: sinEtiquetas((s.match(/<main[\s\S]*?<\/main>/) || [""])[0].split('<p class="etiqueta">Sigue leyendo')[0].split('<p class="etiqueta">Keep reading')[0]).split(" ").length,
  });
  const fichasDe = (claves) => claves.map((k) => ({ k, p: info((en ? "en" : "") + (en ? k : k.slice(1)) + ".html"), u: url(pref + k) }));
  if (conf.tipo === "blog") {
    const arts = Object.entries(PAGINAS).filter(([, v]) => v.tipo === "articulo").sort((x, y) => (x[1].publicado < y[1].publicado ? 1 : -1)).map(([k]) => k);
    grafo.push({ "@type": "Blog", "@id": U + "#blog", name: ahora.titulo, description: ahora.desc, url: U, inLanguage: lang, publisher: { "@id": ORG }, blogPost: fichasDe(arts).map(({ k, p, u }) => ({ "@type": "BlogPosting", headline: p.h1, url: u, datePublished: PAGINAS[k].publicado })) });
  }
  if (conf.tipo === "servicios") {
    const serv = Object.entries(PAGINAS).filter(([k, v]) => v.tipo === "servicio" && k.startsWith("/servicios/")).map(([k]) => k);
    grafo.push({ "@type": "ItemList", "@id": U + "#servicios", name: en ? "What D-Code Partners builds" : "Qué construye D-Code Partners", itemListElement: serv.map((k, i) => ({ "@type": "ListItem", position: i + 1, name: PAGINAS[k][lang].servicio, url: url(pref + k) })) });
  }
  const gestionados = /^(Organization|WebSite|WebPage|ContactPage|AboutPage|CollectionPage|BreadcrumbList|Service|Article|BlogPosting|SoftwareApplication|Blog|ItemList)$/;
  s = s.replace(/<script type="application\/ld\+json"([^>]*)>([\s\S]*?)<\/script>\n?/g, (todo, attrs, json) => {
    let j; try { j = JSON.parse(json); } catch { return todo; }
    const nodos = Array.isArray(j) ? j : j["@graph"] || [j];
    return nodos.every((o) => gestionados.test([].concat(o["@type"] || [])[0] || "")) ? "" : todo;
  });
  const bloqueLd = `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": grafo }).replace(/</g, "\\u003c")}</script>\n`;
  s = s.replace("</head>", () => bloqueLd + "</head>");

  estado.set(rel, s);
  if (s !== original) { cambiadas++; if (soloComprobar) problemas.push(`${rel}: SEO sin aplicar (ejecuta npm run seo)`); }
}

if (!soloComprobar) {
  for (const [rel, s] of estado) if (s !== fs.readFileSync(path.join(RAIZ, rel), "utf8")) fs.writeFileSync(path.join(RAIZ, rel), s);
  for (const f of textosTocados) fs.writeFileSync(path.join(DIR_TEXTOS, f), crudo.get(f));
}
console.log(`seo: ${todas.length} páginas · ${cambiadas} ${soloComprobar ? "pendientes" : "escritas"}${textosTocados.size ? ` · ${textosTocados.size} archivos de textos actualizados` : ""} · ${problemas.length} problemas`);
problemas.forEach((p) => console.log("  ✗ " + p));
process.exit(problemas.length ? 1 : 0);
