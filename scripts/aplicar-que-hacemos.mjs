#!/usr/bin/env node
/*
 * SERVICIOS Y QUÉ CONSTRUIMOS PASAN A SER UNA SOLA ENTRADA.
 *
 * En el menú había dos puertas a lo mismo: «Qué construimos» (las ocho áreas)
 * y «Servicios» (las tres disciplinas). Ahora hay una, «Qué hacemos», que
 * conserva el desplegable de áreas —eso es información a demanda, que es
 * justo lo que sí debe quedarse— y lleva a la página unida.
 *
 * Idempotente: se puede pasar las veces que haga falta.
 *
 * Uso:  node scripts/aplicar-que-hacemos.mjs
 *       node scripts/aplicar-que-hacemos.mjs --check
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');

function paginas(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) paginas(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const errores = [];
let tocadas = 0;

for (const f of paginas(RAIZ)) {
  const original = fs.readFileSync(f, 'utf8');
  if (!/<nav class="main-nav"/.test(original)) continue;
  const en = /<html[^>]*\blang="en"/.test(original);
  const base = en ? '/en' : '';
  const rotulo = en ? 'What we do' : 'Qué hacemos';
  const verTodo = en ? 'See everything we build →' : 'Ver todo lo que construimos →';
  let s = original;

  /* 1 · el disparador del desplegable deja de llamarse «Qué construimos» */
  s = s.replace(
    new RegExp(`<a href="${base}/departamentos" class="nav-link-btn mega-trigger"([^>]*)>[^<]*`),
    `<a href="${base}/que-hacemos" class="nav-link-btn mega-trigger"$1>${rotulo} `);

  /* 2 · el último del desplegable ya no lleva al índice viejo */
  s = s.replace(
    new RegExp(`<a class="mega-item wide" href="${base}/departamentos"([^>]*)>[^<]*`),
    `<a class="mega-item wide" href="${base}/que-hacemos"$1>${verTodo}`);

  /* 3 · fuera la entrada suelta de Servicios: ya está dentro */
  s = s.replace(new RegExp(`\\s*<li><a href="${base}/servicios"[^>]*>[^<]*</a></li>`), '');

  /* 4 · en el pie, la columna de áreas encabeza con la página unida */
  s = s.replace(
    new RegExp(`(<h2>)(Qué construimos|What we build)(</h2> <ul> )(?!<li><a href="${base}/que-hacemos")`),
    `$1${rotulo}$3<li><a href="${base}/que-hacemos">${en ? 'Everything we do' : 'Todo lo que hacemos'}</a></li> `);

  /* 5 · «estás aquí»: lo llevan la propia página y sus hijas */
  const ruta = '/' + path.relative(RAIZ, f).replace(/\\/g, '/').replace(/\.html$/, '').replace(/\/index$/, '');
  const suyo = new RegExp(`^${base}/(que-hacemos|servicios|departamentos)(/|$)`).test(ruta);
  s = s.replace(new RegExp(`(<a href="${base}/que-hacemos" class="nav-link-btn mega-trigger")\\s+aria-current="page"`), '$1');
  if (suyo) {
    s = s.replace(new RegExp(`(<a href="${base}/que-hacemos" class="nav-link-btn mega-trigger")(>)`), '$1 aria-current="page"$2');
  }
  /* y una hija de Servicios ya no marca dos veces */
  s = s.replace(new RegExp(`(<li><a href="${base}/[a-z/-]+")\\s+aria-current="page"(>)(?![^<]*</a></li>\\s*</ul>)`), (m) => m);

  if (s !== original) {
    if (CHECK) errores.push(path.relative(RAIZ, f));
    else { fs.writeFileSync(f, s); tocadas++; }
  }
}

if (errores.length) {
  console.error(`✗ check:que-hacemos — ${errores.length} página(s) con el menú viejo:`);
  errores.slice(0, 10).forEach((e) => console.error('  ' + e));
  console.error('  Se arregla con:  node scripts/aplicar-que-hacemos.mjs');
  process.exit(1);
}
console.log(CHECK
  ? '✓ check:que-hacemos — el menú lleva una sola entrada en todas las páginas'
  : `✓ Menú unido en ${tocadas} página(s)`);
