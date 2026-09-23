#!/usr/bin/env node
/*
 * LOS PRECIOS, EN UN SOLO SITIO
 * ---------------------------------------------------------------------------
 * La web enseña precios «desde» en la portada y en servicios. Escritos a mano
 * en cada página, el día que cambie uno la web dirá dos cosas distintas según
 * dónde mire quien entra — que es exactamente lo que no puede pasar con un
 * precio. Así que viven en precios.json y este script los escribe.
 *
 * Marca en el HTML:  <span data-precio="finance"></span>
 *                    <span data-precio="finance" data-precio-detalle></span>
 *                    <p data-precio-aviso></p>
 * El idioma sale del <html lang>.
 *
 * Uso:  node scripts/build-precios.mjs          (escribe)
 *       node scripts/build-precios.mjs --check  (falla si algo no coincide)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CFG = JSON.parse(fs.readFileSync(path.join(RAIZ, 'precios.json'), 'utf8'));
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

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let escritos = 0, marcas = 0, errores = [];

for (const f of paginas(RAIZ)) {
  const original = fs.readFileSync(f, 'utf8');
  if (!/data-precio/.test(original)) continue;
  const lang = /<html[^>]*\blang="en"/.test(original) ? 'en' : 'es';
  let s = original;

  s = s.replace(/(<([a-z]+)([^>]*\bdata-precio="([a-z]+)"[^>]*)>)([\s\S]*?)(<\/\2>)/g, (m, abre, tag, attrs, clave, dentro, cierra) => {
    const d = CFG.desde[clave];
    if (!d) { errores.push(`${path.relative(RAIZ, f)}: data-precio="${clave}" no existe en precios.json`); return m; }
    const detalle = /data-precio-detalle/.test(attrs);
    const valor = detalle ? d['detalle_' + lang] : d[lang];
    marcas++;
    return abre + esc(valor) + cierra;
  });

  s = s.replace(/(<([a-z]+)([^>]*\bdata-precio-aviso[^>]*)>)([\s\S]*?)(<\/\2>)/g,
    (m, abre, tag, attrs, dentro, cierra) => { marcas++; return abre + esc(CFG.aviso[lang]) + cierra; });

  if (s !== original) {
    if (CHECK) errores.push(`${path.relative(RAIZ, f)}: los precios no coinciden con precios.json`);
    else { fs.writeFileSync(f, s); escritos++; }
  }
}

if (errores.length) {
  console.error('✗ check:precios — ' + errores.length + ' problema(s):');
  errores.forEach((e) => console.error('  ' + e));
  process.exit(1);
}
console.log(CHECK
  ? `✓ check:precios — ${marcas} marcas al día (revisado ${CFG.revisado})`
  : `✓ Precios escritos: ${marcas} marcas en ${escritos} página(s) (revisado ${CFG.revisado})`);
