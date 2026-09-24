#!/usr/bin/env node
/*
 * «PRECIOS» EN LA NAVEGACIÓN.
 *
 * Pone el enlace en la barra de todas las páginas con cabecera, justo después
 * de Servicios, y en la columna «Recursos» del pie. Idempotente: si ya está,
 * no lo duplica. En la propia página de precios marca aria-current.
 *
 * Uso: node scripts/aplicar-precios.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const paginas = execSync('git ls-files "*.html"', { cwd: RAIZ }).toString().split('\n').filter(Boolean);

let n = 0;
for (const f of paginas) {
  const ruta = path.join(RAIZ, f);
  let h = fs.readFileSync(ruta, 'utf8');
  if (!h.includes('id="site-header"')) continue;
  const antes = h;
  const en = f.startsWith('en/');
  const href = en ? '/en/precios' : '/precios';
  const texto = en ? 'Pricing' : 'Precios';
  const esta = f === (en ? 'en/precios.html' : 'precios.html');
  const li = `<li><a href="${href}"${esta ? ' aria-current="page"' : ''}>${texto}</a></li>`;

  if (!h.includes(`href="${href}"`)) {
    /* En la barra, detrás de «Qué hacemos»: es donde lo busca quien ya sabe
       qué hacemos y quiere saber cuánto cuesta. Esa entrada es el desplegable
       de áreas, así que el ancla es el cierre de su <li>, no un enlace suelto
       —lo era hasta que Servicios y Qué construimos se juntaron—. */
    const re = new RegExp(`(<a href="${en ? '/en' : ''}/que-hacemos" class="nav-link-btn mega-trigger"[\\s\\S]*?</div> </li>)`);
    if (re.test(h)) h = h.replace(re, `$1 ${li}`);
  } else if (esta && !h.includes(`href="${href}" aria-current`)) {
    h = h.replace(new RegExp(`<li><a href="${href}">`), `<li><a href="${href}" aria-current="page">`);
  }

  /* Y en el pie, con los recursos. */
  const pieRe = en
    ? /(<li><a href="\/en\/faq">[^<]*<\/a><\/li>)/
    : /(<li><a href="\/faq">[^<]*<\/a><\/li>)/;
  if (!h.includes(`<li><a href="${href}">${texto}</a></li>`) || (h.match(new RegExp(`href="${href}"`, 'g')) || []).length < 2) {
    if (pieRe.test(h) && (h.match(new RegExp(`href="${href}"`, 'g')) || []).length < 2) {
      h = h.replace(pieRe, `<li><a href="${href}">${texto}</a></li> $1`);
    }
  }

  if (h !== antes) { fs.writeFileSync(ruta, h); n++; }
}
console.log(`«Precios» en la navegación de ${n} páginas.`);
