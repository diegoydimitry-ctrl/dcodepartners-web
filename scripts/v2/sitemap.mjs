#!/usr/bin/env node
/* SITEMAP desde las páginas reales: solo URLs canónicas e indexables.
   Fuera: demos (marcos de aplicación), la app de Finance, 404 y todo lo que
   lleve noindex. Cada URL con su pareja de idioma (hreflang).
   Uso: node scripts/v2/sitemap.mjs */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SITIO = "https://dcodepartners.com";
const IGNORA = /^(docs|perf|marketing|scripts|node_modules|dev|demos|en\/demos|sistema-financiero\/(app|demo)|en\/sistema-financiero\/(app|demo))\b|(^|\/)404\.html$/;
function html(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".") || e.name === "node_modules") continue;
    const p = path.join(dir, e.name), rel = path.relative(RAIZ, p);
    if (e.isDirectory()) html(p, out); else if (e.name.endsWith(".html") && !IGNORA.test(rel)) out.push(rel);
  }
  return out;
}
const ruta = (rel) => "/" + rel.replace(/(^|\/)index\.html$/, "").replace(/\.html$/, "");
const url = (r) => SITIO + (r === "/" ? "/" : r.replace(/\/$/, ""));
const paginas = html(RAIZ).filter((rel) => {
  const s = fs.readFileSync(path.join(RAIZ, rel), "utf8");
  return !/<meta name="robots" content="[^"]*noindex/.test(s);
});
const es = paginas.filter((r) => !r.startsWith("en/"));
const prioridad = (r) => (r === "/" ? "1.0" : /^\/(precios|contacto|sistema-financiero|que-hacemos|servicios\/|diagnostico)/.test(r) ? "0.9" : /^\/(departamentos|metodo|casos|garantias|blog)/.test(r) ? "0.7" : "0.4");
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
let n = 0;
for (const rel of es.sort()) {
  const r = ruta(rel), enRel = "en/" + rel, tieneEn = paginas.includes(enRel);
  const rEn = r === "/" ? "/en" : "/en" + r;
  const alt = tieneEn ? `\n    <xhtml:link rel="alternate" hreflang="es" href="${url(r)}"/>\n    <xhtml:link rel="alternate" hreflang="en" href="${url(rEn)}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${url(r)}"/>` : "";
  xml += `  <url>\n    <loc>${url(r)}</loc>${alt}\n    <priority>${prioridad(r)}</priority>\n  </url>\n`; n++;
  if (tieneEn) { xml += `  <url>\n    <loc>${url(rEn)}</loc>${alt}\n    <priority>${prioridad(r)}</priority>\n  </url>\n`; n++; }
}
xml += `</urlset>\n`;
fs.writeFileSync(path.join(RAIZ, "sitemap.xml"), xml);
console.log(`sitemap.xml: ${n} URLs`);
