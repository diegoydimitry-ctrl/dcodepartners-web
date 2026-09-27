#!/usr/bin/env node
/* ==========================================================================
   AUDITORÍA SEO AUTOMÁTICA · escribe SEO_AUDIT.md y sale con error si hay
   algún fallo bloqueante. Mide sobre los ficheros que se despliegan.
   Uso: node scripts/v2/seo-audit.mjs
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "node-html-parser";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SITIO = "https://dcodepartners.com";
const FUERA = /^(docs|perf|marketing|scripts|node_modules|dev)\//;
function html(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".") || e.name === "node_modules") continue;
    const p = path.join(dir, e.name), rel = path.relative(RAIZ, p);
    if (e.isDirectory()) { if (!FUERA.test(rel + "/")) html(p, out); } else if (e.name.endsWith(".html")) out.push(rel);
  }
  return out;
}
const ruta = (rel) => "/" + rel.replace(/(^|\/)index\.html$/, "").replace(/\.html$/, "");
const existe = (href) => {
  const r = href.split("#")[0].split("?")[0];
  if (!r || r === "/") return true;
  const f = r.replace(/^\//, "").replace(/\/$/, "");
  return [f, f + ".html", f + "/index.html"].some((x) => fs.existsSync(path.join(RAIZ, x)));
};
const redir = JSON.parse(fs.readFileSync(path.join(RAIZ, "vercel.json"), "utf8")).redirects?.map((r) => r.source) || [];

const filas = [], fallos = [], avisos = [];
const titulos = new Map(), descs = new Map();
for (const rel of html(RAIZ).sort()) {
  const s = fs.readFileSync(path.join(RAIZ, rel), "utf8");
  const d = parse(s);
  const r = ruta(rel);
  const q = (sel, a = "content") => d.querySelector(sel)?.getAttribute(a) || "";
  const titulo = d.querySelector("title")?.text.trim() || "";
  const desc = q('meta[name="description"]');
  const canon = q('link[rel="canonical"]', "href");
  const robots = q('meta[name="robots"]');
  const noindex = /noindex/.test(robots);
  const lang = d.querySelector("html")?.getAttribute("lang") || "";
  const h1 = d.querySelectorAll("h1");
  const og = ["og:title", "og:description", "og:image", "og:url"].filter((k) => !q(`meta[property="${k}"]`));
  const imgs = d.querySelectorAll("img").filter((i) => i.getAttribute("alt") === undefined);
  const heads = d.querySelectorAll("h1,h2,h3,h4").map((h) => +h.rawTagName[1]);
  let salto = null; for (let i = 1; i < heads.length; i++) if (heads[i] > heads[i - 1] + 1) { salto = `h${heads[i - 1]}→h${heads[i]}`; break; }
  let ld = 0, ldMal = 0; d.querySelectorAll('script[type="application/ld+json"]').forEach((x) => { try { JSON.parse(x.text); ld++; } catch { ldMal++; } });
  const rotos = [...new Set(d.querySelectorAll("a[href]").map((a) => a.getAttribute("href")).filter((h) => h.startsWith("/") && !h.startsWith("//") && !existe(h) && !redir.includes(h.split("#")[0])))];
  const esperado = SITIO + (r === "/" ? "/" : r);
  const esApp = /^(en\/)?(demos|sistema-financiero\/(app|demo))/.test(rel) || /404/.test(rel);
  const f = [];
  if (!titulo) f.push("sin title");
  if (!desc && !esApp) f.push("sin description");
  if (!canon) f.push("sin canonical"); else if (!esApp && canon !== esperado) f.push(`canonical ${canon} ≠ ${esperado}`);
  if (!lang) f.push("sin lang");
  if (h1.length !== 1 && !esApp) f.push(`${h1.length} h1`);
  if (ldMal) f.push(`${ldMal} JSON-LD inválido`);
  if (rotos.length) f.push(`enlaces rotos: ${rotos.join(", ")}`);
  if (imgs.length) f.push(`${imgs.length} img sin alt`);
  const a = [];
  if (og.length && !esApp) a.push("OG falta: " + og.join(","));
  if (salto) a.push("salto " + salto);
  if (titulo.length > 65) a.push(`title ${titulo.length} car.`);
  if (desc && (desc.length < 70 || desc.length > 170)) a.push(`description ${desc.length} car.`);
  if (!noindex && !esApp) { (titulos.get(titulo) || titulos.set(titulo, []).get(titulo)).push(rel); (descs.get(desc) || descs.set(desc, []).get(desc)).push(rel); }
  if (noindex && !esApp) a.push("noindex");
  filas.push({ rel, titulo, desc: desc.length, h1: h1.length, ld, f, a });
  f.forEach((x) => fallos.push(`${rel}: ${x}`)); a.forEach((x) => avisos.push(`${rel}: ${x}`));
}
for (const [t, rs] of titulos) if (rs.length > 1) fallos.push(`title duplicado «${t}»: ${rs.join(", ")}`);
for (const [t, rs] of descs) if (rs.length > 1 && t) fallos.push(`description duplicada: ${rs.join(", ")}`);

// sitemap y robots
const sm = fs.readFileSync(path.join(RAIZ, "sitemap.xml"), "utf8");
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
locs.forEach((u) => { const r = u.replace(SITIO, "") || "/"; if (!existe(r)) fallos.push(`sitemap: ${u} no existe`); });
const robots = fs.readFileSync(path.join(RAIZ, "robots.txt"), "utf8");
if (!/Sitemap:\s*https:\/\/dcodepartners\.com\/sitemap\.xml/.test(robots)) fallos.push("robots.txt no apunta al sitemap");
if (/Disallow:\s*\/assets/.test(robots)) fallos.push("robots.txt bloquea /assets (CSS/JS)");

const md = `# SEO_AUDIT — dcodepartners.com (rama web/dcp-cowork4)

Generado por \`node scripts/v2/seo-audit.mjs\` el ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC sobre los ficheros que se despliegan.

| | |
|---|---|
| Páginas HTML revisadas | ${filas.length} |
| URLs en sitemap.xml | ${locs.length} |
| Fallos bloqueantes | **${fallos.length}** |
| Avisos | ${avisos.length} |

## Fallos
${fallos.length ? fallos.map((x) => "- " + x).join("\n") : "Ninguno."}

## Avisos
${avisos.length ? avisos.map((x) => "- " + x).join("\n") : "Ninguno."}

## Página a página
| Página | title | desc. (car.) | h1 | JSON-LD |
|---|---|---|---|---|
${filas.map((f) => `| ${f.rel} | ${f.titulo.replace(/\|/g, "\\|")} | ${f.desc} | ${f.h1} | ${f.ld} |`).join("\n")}

## Qué se comprueba
title presente y único · description presente y única · canonical igual a la URL limpia · lang · un solo h1 · saltos de jerarquía · JSON-LD que se puede leer · alt en todas las imágenes · enlaces internos que existen (o redirecciones declaradas en vercel.json) · Open Graph · noindex accidental · sitemap solo con URLs que existen · robots con el sitemap y sin bloquear CSS/JS.
`;
fs.writeFileSync(path.join(RAIZ, "SEO_AUDIT.md"), md);
console.log(`SEO: ${filas.length} páginas · ${fallos.length} fallos · ${avisos.length} avisos`);
fallos.slice(0, 60).forEach((x) => console.log("  ✗ " + x));
process.exitCode = fallos.length ? 1 : 0;
