#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Centinela de enlaces internos, idiomas y datos estructurados
//
//   npm run check:enlaces
//
// Sin red y sin navegador: lee los .html versionados y comprueba, con la misma
// resolución de URLs que Vercel aplica aquí (cleanUrls: /x → x.html o x/index.html):
//   1. todo href/src interno apunta a una página o un fichero que existe;
//   2. las anclas (#id y /pagina#id) existen en la página de destino;
//   3. canonical = URL propia de la página; hreflang es/en/x-default apuntan a
//      páginas reales y son recíprocos entre ES y EN;
//   4. el selector de idioma enlaza con la página espejo;
//   5. sitemap.xml ↔ páginas reales (nada huérfano ni roto en ninguno de los dos);
//   6. cada <script type="application/ld+json"> es JSON válido.
// Sale con código 1 si hay errores. Los avisos no hacen fallar.
// ─────────────────────────────────────────────────────────────────────────────
import { execSync } from 'node:child_process';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const ORIGIN = 'https://dcodepartners.com';

const tracked = execSync('git ls-files -z', { cwd: ROOT }).toString().split('\0').filter(Boolean);
const pages = tracked.filter((f) => f.endsWith('.html') && !/^(docs|scripts|automation|\.github|node_modules)\//.test(f) && existsSync(join(ROOT, f)));

const urlOf = (file) => {
  const u = '/' + file.replace(/\.html$/, '').replace(/(^|\/)index$/, '');
  return u.length > 1 ? u.replace(/\/$/, '') : '/';
};
const byUrl = new Map(pages.map((f) => [urlOf(f), f]));

// Resolución de una ruta interna a fichero (cleanUrls + trailingSlash:false).
function resolve(pathname) {
  const p = decodeURIComponent(pathname).replace(/\/$/, '') || '/';
  if (byUrl.has(p)) return { kind: 'page', file: byUrl.get(p) };
  const f = join(ROOT, p);
  if (existsSync(f) && statSync(f).isFile()) return { kind: 'file', file: p.slice(1) };
  return null;
}

const errors = [];
const warnings = [];
const idsCache = new Map();
const idsOf = (file) => {
  if (!idsCache.has(file)) {
    const html = readFileSync(join(ROOT, file), 'utf8');
    idsCache.set(file, new Set([...html.matchAll(/\s(?:id|name)="([^"]+)"/g)].map((m) => m[1])));
  }
  return idsCache.get(file);
};

const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];
let linksChecked = 0;
let jsonLdChecked = 0;

for (const file of pages) {
  const html = readFileSync(join(ROOT, file), 'utf8');
  const self = urlOf(file);
  const isEn = self === '/en' || self.startsWith('/en/');
  const noindex = /<meta name="robots" content="[^"]*noindex/i.test(html);
  const is404 = /(^|\/)404\.html$/.test(file);

  // Sin <script>/<style> ni comentarios, para no leer URLs dentro de código.
  const markup = html.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '').replace(/<!--[\s\S]*?-->/g, '');

  // 1 y 2 · href / src internos y anclas
  for (const m of markup.matchAll(/<(a|link|img|script|source|iframe|use)\b[^>]*>/gi)) {
    const tag = m[0];
    for (const name of ['href', 'src']) {
      let v = attr(tag, name);
      if (v === undefined || v === '') continue;
      if (/^(mailto:|tel:|javascript:|data:|https?:\/\/(?!dcodepartners\.com))/i.test(v)) continue;
      if (/^\/\//.test(v)) continue;
      v = v.replace(/^https?:\/\/dcodepartners\.com/i, '') || '/';
      const [beforeHash, hash] = v.split('#');
      const pathname = beforeHash.split('?')[0];
      linksChecked++;
      if (pathname === '') {
        if (hash === undefined || hash === '') { errors.push(`${file}: enlace vacío «${v}» en <${m[1]}>`); continue; }
        if (!idsOf(file).has(hash)) warnings.push(`${file}: ancla #${hash} sin id en la propia página (puede crearla JS)`);
        continue;
      }
      const abs = pathname.startsWith('/') ? pathname : new URL(pathname, `${ORIGIN}${self.endsWith('/') ? self : self.replace(/[^/]*$/, '')}`).pathname;
      if (abs.startsWith('/lib/')) { errors.push(`${file}: enlace a /lib (cortado por redirección): ${v}`); continue; }
      const r = resolve(abs);
      if (!r) { errors.push(`${file}: ROTO ${name}="${v}"`); continue; }
      if (hash && r.kind === 'page' && !idsOf(r.file).has(hash)) warnings.push(`${file}: ancla ${v} sin id en ${r.file} (puede crearla JS)`);
    }
  }

  // 3 · canonical y hreflang
  const canonical = attr((html.match(/<link rel="canonical"[^>]*>/) || [''])[0], 'href');
  const alternates = Object.fromEntries([...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]));
  if (!is404 && !noindex) {
    if (!canonical) errors.push(`${file}: sin canonical`);
    else if (canonical.replace(ORIGIN, '').replace(/\/$/, '') !== self.replace(/\/$/, '')) errors.push(`${file}: canonical ${canonical} ≠ ${ORIGIN}${self}`);
    for (const lang of ['es', 'en', 'x-default']) {
      const href = alternates[lang];
      if (!href) { errors.push(`${file}: falta hreflang="${lang}"`); continue; }
      if (!resolve(href.replace(ORIGIN, '') || '/')) errors.push(`${file}: hreflang ${lang} a página inexistente ${href}`);
    }
    const esUrl = isEn ? self.replace(/^\/en/, '') || '/' : self;
    const enUrl = isEn ? self : self === '/' ? '/en' : `/en${self}`;
    if (alternates.es && alternates.es.replace(ORIGIN, '') !== esUrl) errors.push(`${file}: hreflang es=${alternates.es}, esperado ${ORIGIN}${esUrl}`);
    if (alternates.en && alternates.en.replace(ORIGIN, '') !== enUrl) errors.push(`${file}: hreflang en=${alternates.en}, esperado ${ORIGIN}${enUrl}`);
  }

  // 4 · selector de idioma
  const sw = html.match(/<div class="lang-switch"[\s\S]*?<\/div>/);
  if (sw) {
    const es = attr((sw[0].match(/<a [^>]*data-lang="es"[^>]*>/) || [''])[0], 'href');
    const en = attr((sw[0].match(/<a [^>]*data-lang="en"[^>]*>/) || [''])[0], 'href');
    const esUrl = is404 ? '/' : isEn ? self.replace(/^\/en/, '') || '/' : self;
    const enUrl = is404 ? '/en' : isEn ? self : self === '/' ? '/en' : `/en${self}`;
    if (es !== esUrl) errors.push(`${file}: selector ES → ${es}, esperado ${esUrl}`);
    if (en !== enUrl) errors.push(`${file}: selector EN → ${en}, esperado ${enUrl}`);
    if (!resolve(esUrl) || !resolve(enUrl)) errors.push(`${file}: la página espejo no existe (${esUrl} / ${enUrl})`);
  } else if (/<header id="site-header">/.test(html)) {
    errors.push(`${file}: cabecera sin selector de idioma`);
  }

  // 6 · JSON-LD
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    jsonLdChecked++;
    try {
      const data = JSON.parse(m[1]);
      const items = Array.isArray(data) ? data : data['@graph'] || [data];
      for (const it of items) if (!it['@type']) errors.push(`${file}: JSON-LD sin @type`);
    } catch (e) {
      errors.push(`${file}: JSON-LD inválido (${e.message})`);
    }
  }
}

// 5 · sitemap
const sitemap = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
const inSitemap = new Set();
for (const loc of locs) {
  const p = loc.replace(ORIGIN, '').replace(/\/$/, '') || '/';
  inSitemap.add(p);
  if (!byUrl.has(p)) errors.push(`sitemap.xml: ${loc} no corresponde a ninguna página`);
}
for (const m of sitemap.matchAll(/hreflang="[^"]+" href="([^"]+)"/g)) {
  const p = m[1].replace(ORIGIN, '').replace(/\/$/, '') || '/';
  if (!byUrl.has(p)) errors.push(`sitemap.xml: alternate ${m[1]} no corresponde a ninguna página`);
}
for (const [u, f] of byUrl) {
  const html = readFileSync(join(ROOT, f), 'utf8');
  const noindex = /<meta name="robots" content="[^"]*noindex/i.test(html);
  if (!noindex && !inSitemap.has(u)) errors.push(`sitemap.xml: falta ${ORIGIN}${u} (${f}, indexable)`);
  if (noindex && inSitemap.has(u)) errors.push(`sitemap.xml: incluye ${u}, que es noindex`);
}

console.log(`Páginas: ${pages.length} · enlaces/recursos internos: ${linksChecked} · JSON-LD: ${jsonLdChecked} · URLs en sitemap: ${locs.length}`);
if (warnings.length) console.log(`Avisos (${warnings.length}):\n` + [...new Set(warnings)].map((w) => `  · ${w}`).join('\n'));
if (errors.length) {
  console.error(`Errores (${errors.length}):\n` + errors.map((e) => `  ✗ ${e}`).join('\n'));
  process.exit(1);
}
console.log('✓ Enlaces internos, idiomas, sitemap y JSON-LD correctos.');
