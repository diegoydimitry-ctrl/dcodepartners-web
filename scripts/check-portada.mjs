#!/usr/bin/env node
/*
 * LA PORTADA LLEVA LO QUE TIENE QUE LLEVAR.
 *
 * Esto existe por un fallo concreto: el panel de Finance se puso en las dos
 * portadas y luego, deshaciendo una meta-prueba con «git checkout
 * index.html», se borró de la española. La inglesa lo tenía, las pruebas de
 * navegador habían pasado ANTES de ese checkout, y así llegó al Preview:
 * media portada con el panel y media sin él.
 *
 * La lección no es «ten cuidado con checkout»: es que lo que se ve en la
 * portada tiene que estar vigilado igual que los precios o el estado. Esto
 * mira las dos portadas y exige lo mismo en las dos.
 *
 * Uso:  node scripts/check-portada.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errores = [];

const EXIGE = [
  ['el panel de Finance', /<div class="v6-panel"/],
  ['la captura para tema oscuro', /class="es-oscuro"[^>]*finance-dark\.webp/],
  ['la captura para tema claro', /class="es-claro"[^>]*finance-light\.webp/],
  /* El pie va fuera de la figura a propósito: dentro lo borraba la máscara
     del panel. Si alguien lo devuelve a un <figcaption>, esto lo caza. */
  ['el pie del panel, fuera de la figura', /<p class="v6-panel-pie"><span class="v6-panel-k">/],
];
const PROHIBE = [
  ['la marca de partículas como formación del hero', /var FORM = \[F0,/],
];

for (const p of ['index.html', 'en/index.html']) {
  const h = fs.readFileSync(path.join(RAIZ, p), 'utf8');
  for (const [que, re] of EXIGE) if (!re.test(h)) errores.push(`${p}: falta ${que}`);
  /* Y la imagen que promete tiene que existir de verdad. */
  for (const m of h.matchAll(/src="(\/assets\/img\/[^"]+)"/g)) {
    if (!fs.existsSync(path.join(RAIZ, m[1].slice(1)))) errores.push(`${p}: ${m[1]} no existe`);
  }
}

const js = fs.readFileSync(path.join(RAIZ, 'assets/js/dcp6.js'), 'utf8');
for (const [que, re] of PROHIBE) if (re.test(js)) errores.push(`assets/js/dcp6.js: vuelve a dibujarse ${que}`);

/* Las dos portadas tienen que decir lo mismo, no una cosa cada una. */
const es = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
const en = fs.readFileSync(path.join(RAIZ, 'en/index.html'), 'utf8');
const cuenta = (h, re) => (h.match(re) || []).length;
for (const [que, re] of [['imágenes del panel', /class="es-(oscuro|claro)"/g],
                         ['secciones', /<section class="v6-/g]]) {
  if (cuenta(es, re) !== cuenta(en, re)) {
    errores.push(`las dos portadas no llevan las mismas ${que}: ES ${cuenta(es, re)}, EN ${cuenta(en, re)}`);
  }
}

if (errores.length) {
  console.error(`✗ check:portada — ${errores.length} problema(s):`);
  errores.forEach((e) => console.error('  ' + e));
  process.exit(1);
}
console.log('✓ check:portada — el panel de Finance está en las dos portadas, con sus dos capturas, y el hero ya no dibuja la marca');
