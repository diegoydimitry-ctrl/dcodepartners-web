#!/usr/bin/env node
/*
 * CUÁNDO SE PIDE CADA FICHERO.
 *
 * Convierte los <script defer> de los módulos que no hacen falta al entrar en
 * marcas que resuelve main.js (ver «CARGA A SU DEBIDO TIEMPO» allí):
 *
 *   dcp6.js, dcp8.js   el campo de partículas. En táctil no se monta, así que
 *                      no se descarga: type="dcp/raton". Al lado va un
 *                      <link rel=preload media="(pointer:fine)"> para que en
 *                      un ratón la descarga empiece cuando empezaba antes.
 *   dcp10.js           el sistema, el diagnóstico y la galería: todo muy por
 *                      debajo del primer pantallazo.
 *   dcode-os.js        el centro operativo, lo mismo.
 *   dcp9.js            las composiciones [data-comp], lo mismo.
 *
 * Idempotente: si la página ya está convertida, no la toca.
 * Uso: node scripts/aplicar-carga.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const paginas = execSync('git ls-files "*.html"', { cwd: RAIZ }).toString().split('\n').filter(Boolean);

/* Y main-b.js, que no tiene etiqueta propia en el HTML: se añade detrás de
   main.js, con la marca de «cuando haya un hueco» (o enseguida si en esa
   página se ve el formulario de contacto). */
const SEGUNDA_PARTE = 'main-b.js';

/* fichero → cuándo. `null` = solo con ratón. */
const CUANDO = {
  'dcp6.js': null,
  'dcp8.js': null,
  'dcp10.js': '[data-arq],[data-dx],[data-gal]',
  'dcode-os.js': '#dcode-os',
  'dcp9.js': '[data-comp]',
};

let n = 0;
for (const f of paginas) {
  const ruta = path.join(RAIZ, f);
  let h = fs.readFileSync(ruta, 'utf8');
  const antes = h;
  for (const [fichero, cuando] of Object.entries(CUANDO)) {
    const re = new RegExp('<script src="(/assets/js/' + fichero.replace('.', '\\.') + '(?:\\?v=[A-Za-z0-9_-]+)?)"\\s+defer><\\/script>', 'g');
    h = h.replace(re, (_, src) => (cuando === null
      ? `<link rel="preload" as="script" href="${src}" media="(pointer:fine)"><script type="dcp/raton" data-src="${src}"></script>`
      : `<script type="dcp/cerca" data-src="${src}" data-cuando="${cuando}"></script>`));
  }
  if (!h.includes('main-b.js')) {
    h = h.replace(/(<script src="\/assets\/js\/main\.js(?:\?v=[A-Za-z0-9_-]+)?"\s+defer><\/script>)/,
      `$1\n<script type="dcp/cerca" data-src="/assets/js/${SEGUNDA_PARTE}?v=0" data-cuando="#contact-form"></script>`);
  }
  if (h !== antes) { fs.writeFileSync(ruta, h); n++; }
}
console.log(`Carga diferida aplicada en ${n} de ${paginas.length} páginas.`);
