#!/usr/bin/env node
/**
 * Genera assets/data/knowledge-base.json a partir del contenido real de las
 * páginas HTML públicas del sitio. Fuente única de verdad: nadie escribe
 * respuestas a mano, el asistente indexa lo que ya existe en la web.
 *
 * Se ejecuta automáticamente en cada `npm run build` (ver vercel.json), así
 * que cualquier cambio de contenido en una página se refleja solo en el
 * conocimiento del asistente en el siguiente despliegue.
 */
const fs = require('fs');
const path = require('path');
const { parse } = require('node-html-parser');

const ROOT = path.join(__dirname, '..');
const OUT_PATH = path.join(ROOT, 'assets/data/knowledge-base.json');

// Directorios/archivos que nunca deben indexarse como contenido público.
const EXCLUDED_FILES = new Set(['404.html']);
const EXCLUDED_DIRS = new Set(['node_modules', '.git', 'api', 'scripts', 'assets']);

const EXCLUDED_CLASSES = new Set(['window-bar', 'breadcrumbs', 'faq-search', 'chat-widget', 'side-index']);
const HEADING_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6']);
const TEXT_TAGS = new Set(['P', 'LI', 'BLOCKQUOTE', 'TD', 'TH']);
// Controles de formulario y botones: chrome de UI, no contenido informativo
// (p. ej. "Nombre completo", "Solicitar mi Mes Gratuito").
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'SVG', 'LABEL', 'INPUT', 'TEXTAREA', 'BUTTON']);

function cleanText(s) {
  return (s || '').replace(/\s+/g, ' ').trim();
}

function hasClass(el, cls) {
  const c = (el.getAttribute && el.getAttribute('class')) || '';
  return c.split(/\s+/).includes(cls);
}

function isExcluded(el) {
  const c = (el.getAttribute && el.getAttribute('class')) || '';
  return c.split(/\s+/).some((cls) => EXCLUDED_CLASSES.has(cls));
}

/** Un .accordion-item (Método D-Code / FAQ) se convierte en un chunk propio:
 *  la pregunta o el paso es el encabezado, la respuesta es el cuerpo. */
function extractAccordionItem(el, push) {
  const headingEl = el.querySelector('.accordion-heading');
  const titleEl = el.querySelector('.accordion-title');
  const panelEl = el.querySelector('.accordion-panel');

  let heading = '';
  if (headingEl) heading = cleanText(headingEl.text);
  if (titleEl) {
    const t = cleanText(titleEl.text);
    heading = heading ? `${heading} — ${t}` : t;
  }
  const body = panelEl ? cleanText(panelEl.text) : '';
  if (heading && body) push({ heading, text: body });
}

/**
 * Recorre el árbol dentro de <main>, agrupando texto bajo el encabezado real
 * (h1-h6) más cercano. Cada .accordion-item se extrae aparte (ver arriba).
 */
function walkMain(main, push) {
  let current = { heading: '', parts: [] };
  const flush = () => {
    if (current.parts.length) push({ heading: current.heading, text: current.parts.join(' ') });
  };

  const visit = (node) => {
    for (const child of node.childNodes) {
      if (child.nodeType === 3) {
        // Nodo de texto suelto (p. ej. <div class="value">dato@empresa.com</div>
        // o un <a>/<strong> sin envoltorio de párrafo): se captura igualmente,
        // no solo el texto dentro de <p>/<li>.
        const t = cleanText(child.rawText);
        if (t) current.parts.push(t);
        continue;
      }
      if (child.nodeType !== 1) continue; // ni elemento ni texto (comentarios, etc.)
      const tag = child.tagName;

      if (isExcluded(child) || SKIP_TAGS.has(tag)) continue;

      if (hasClass(child, 'accordion-item')) {
        extractAccordionItem(child, push);
        continue; // no recursar: ya extraído como chunk propio
      }

      if (hasClass(child, 'contact-row')) {
        const labelEl = child.querySelector('.label');
        const valueEl = child.querySelector('.value');
        const l = labelEl ? cleanText(labelEl.text) : '';
        const v = valueEl ? cleanText(valueEl.text) : '';
        if (l && v) current.parts.push(`${l}: ${v}.`);
        continue; // no recursar: ya combinado como "Etiqueta: valor."
      }

      if (hasClass(child, 'counter')) {
        // Contador animado por JS: el texto estático en el HTML es "0"
        // (arranca la animación ahí); el valor real vive en data-count.
        const dataCount = child.getAttribute && child.getAttribute('data-count');
        if (dataCount) current.parts.push(dataCount);
        continue;
      }

      if (HEADING_TAGS.has(tag)) {
        flush();
        current = { heading: cleanText(child.text), parts: [] };
        continue;
      }

      if (TEXT_TAGS.has(tag)) {
        const t = cleanText(child.text);
        if (t) current.parts.push(t);
        continue; // no recursar: el texto ya se ha capturado completo
      }

      visit(child); // contenedor genérico (div, section, span de layout...)
    }
  };

  visit(main);
  flush();
}

function findHtmlFiles(dir, base = dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      findHtmlFiles(path.join(dir, entry.name), base, out);
    } else if (entry.isFile() && entry.name.endsWith('.html') && !EXCLUDED_FILES.has(entry.name)) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

function fileToUrl(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel.slice(0, -'.html'.length);
}

function buildPage(filePath) {
  const html = fs.readFileSync(filePath, 'utf-8');
  const root = parse(html);
  const main = root.querySelector('main');
  if (!main) return null;

  const titleEl = root.querySelector('title');
  const title = titleEl ? cleanText(titleEl.text) : fileToUrl(filePath);
  const url = fileToUrl(filePath);

  const rawChunks = [];
  walkMain(main, (c) => rawChunks.push(c));

  const chunks = rawChunks
    .filter((c) => c.text && c.text.length > 3)
    .map((c, i) => ({
      id: `${url}#c${i}`,
      heading: c.heading,
      text: c.text,
    }));

  if (!chunks.length) return null;
  return { url, title, chunks };
}

function main() {
  const files = findHtmlFiles(ROOT).sort();
  const pages = files.map(buildPage).filter(Boolean);

  const totalChunks = pages.reduce((n, p) => n + p.chunks.length, 0);
  const kb = {
    generatedAt: new Date().toISOString(),
    pageCount: pages.length,
    chunkCount: totalChunks,
    pages,
  };

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(kb, null, 2));
  console.log(`Base de conocimiento generada: ${pages.length} páginas, ${totalChunks} fragmentos -> ${path.relative(ROOT, OUT_PATH)}`);
}

main();
