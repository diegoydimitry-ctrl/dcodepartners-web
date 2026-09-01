/**
 * Genera el PDF de la propuesta y ejecuta comprobaciones de maquetación.
 *
 *   node propuestas/el-patio/build.mjs
 *
 * Salida: propuestas/el-patio/Propuesta-El-Patio-DCode-Partners.pdf
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(dir, 'propuesta-el-patio.html');
const out = path.join(dir, 'Propuesta-El-Patio-DCode-Partners.pdf');

// El entorno trae Chromium preinstalado; la versión no coincide siempre con
// la que espera Playwright, así que apuntamos al binario directamente.
import fs from 'node:fs';
const CANDIDATES = [
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  '/opt/pw-browsers/chromium/chrome-linux/chrome',
];
const executablePath = CANDIDATES.find((p) => fs.existsSync(p));

const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 1700 } });
await page.goto('file://' + src, { waitUntil: 'networkidle' });
await page.emulateMedia({ media: 'print' });
await page.evaluate(() => document.fonts.ready);

/* ---------- QA automático de maquetación ---------- */
const report = await page.evaluate(() => {
  const problems = [];
  const pages = [...document.querySelectorAll('.page')];

  pages.forEach((pg, i) => {
    const n = i + 1;
    const box = pg.getBoundingClientRect();

    // 1. contenido que se sale de la página (texto cortado)
    const container = pg.querySelector('.sheet, .cover-inner');
    if (container && container.scrollHeight > container.clientHeight + 1) {
      problems.push(`p${n}: contenido desbordado ${container.scrollHeight} > ${container.clientHeight}`);
    }

    // 2. cualquier elemento fuera de los límites físicos de la hoja
    const nodes = [...pg.querySelectorAll('*')].filter(
      (el) => el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0
    );
    for (const el of nodes) {
      const r = el.getBoundingClientRect();
      if (el.closest('.arch')) continue; // decorativo, sangra a propósito
      if (r.left < box.left - 0.5 || r.right > box.right + 0.5 ||
          r.top < box.top - 0.5 || r.bottom > box.bottom + 0.5) {
        problems.push(`p${n}: "${(el.textContent || el.tagName).trim().slice(0, 40)}" fuera de la hoja`);
      }
    }

    // 3. solapamiento entre bloques de texto hermanos
    const textBlocks = nodes.filter((el) => {
      const kids = [...el.children];
      const hasOwnText = [...el.childNodes].some(
        (c) => c.nodeType === 3 && c.textContent.trim().length > 0
      );
      return hasOwnText && kids.every((k) => !k.textContent.trim());
    });
    for (let a = 0; a < textBlocks.length; a++) {
      for (let b = a + 1; b < textBlocks.length; b++) {
        const A = textBlocks[a], B = textBlocks[b];
        if (A.contains(B) || B.contains(A)) continue;
        const ra = A.getBoundingClientRect(), rb = B.getBoundingClientRect();
        const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
        const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
        if (ox > 1 && oy > 1) {
          problems.push(
            `p${n}: solape "${A.textContent.trim().slice(0, 26)}" / "${B.textContent.trim().slice(0, 26)}"`
          );
        }
      }
    }

    // 4. contenido recortado dentro de un contenedor con overflow:hidden
    //    (mockups: barra del navegador, tarjetas, plan de precios…)
    const clippers = nodes.filter((el) => {
      if (el.classList.contains('page')) return false;
      const cs = getComputedStyle(el);
      return cs.overflow === 'hidden' || cs.overflowX === 'hidden';
    });
    for (const box of clippers) {
      const rb = box.getBoundingClientRect();
      for (const el of box.querySelectorAll('*')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.right > rb.right + 0.5 || r.left < rb.left - 0.5) {
          problems.push(
            `p${n}: "${(el.textContent || el.tagName).trim().slice(0, 30)}" recortado por ${
              box.className || box.tagName
            }`
          );
        }
      }
    }

    // 5. texto demasiado pequeño para imprimir
    for (const el of nodes) {
      if (!el.textContent.trim()) continue;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs > 0 && fs < 6.4) {
        problems.push(`p${n}: fuente ${fs.toFixed(1)}px en "${el.textContent.trim().slice(0, 30)}"`);
      }
    }
  });

  return { pages: pages.length, problems };
});

console.log(`Páginas: ${report.pages}`);
if (report.problems.length) {
  console.log('PROBLEMAS DETECTADOS:');
  for (const p of report.problems) console.log('  · ' + p);
} else {
  console.log('QA de maquetación: sin incidencias.');
}

await page.pdf({
  path: out,
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
});

await browser.close();
console.log('PDF →', out);
