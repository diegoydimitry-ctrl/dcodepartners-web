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

/* Desde el rediseño «el banco de trabajo» (octubre de 2026) la portada es una
   escena fotografiada que se recorre con el scroll. Lo que tiene que llevar,
   en los dos idiomas: los nueve actos, el lienzo de la escena con sus dos
   planos de HTML (la pantalla del portátil y la placa), la factura de Finance
   que se puede probar, el nombre de la empresa y las demos. */
const EXIGE = [
  ['el lienzo de la escena', /<canvas class="maq-lienzo" data-maq-lienzo>/],
  ['el registro de Finance sobre la pantalla del portátil', /data-sobre="pantalla"/],
  ['la placa con el nombre de la empresa', /data-sobre="chapa"/],
  ['la factura que se puede pasar por Finance', /data-fz-pasar/],
  ['el campo del nombre de la empresa', /data-tuyo-nombre/],
  ['las demos', /id="tocalo"/],
  ['la hoja de estilos de la escena', /\/assets\/v2\/escena\.css\?v=[0-9a-f]{10}/],
];
const FUERA = [
  ['una hoja de estilos de una portada anterior', /\/assets\/v2\/(mundo|maquina|salto|sistema)\.css/],
];

const es = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
const en = fs.readFileSync(path.join(RAIZ, 'en/index.html'), 'utf8');
for (const [p, h] of [['index.html', es], ['en/index.html', en]]) {
  for (const [que, re] of EXIGE) if (!re.test(h)) errores.push(`${p}: falta ${que}`);
  for (const [que, re] of FUERA) if (re.test(h)) errores.push(`${p}: sigue enlazada ${que}`);
  const actos = [...h.matchAll(/data-acto="(\d)"/g)].map((m) => m[1]).join('');
  if (actos !== '012345678') errores.push(`${p}: los actos no son los nueve del recorrido (${actos})`);
}

/* Las imágenes que la página va a pedir tienen que existir de verdad. */
const datos = JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts/v7/datos.json'), 'utf8'));
const dir = path.join(RAIZ, 'assets/v2/img/escena');
const pide = [];
for (const [s, fija, viaje] of [['h', 'h', 't'], ['v', 'v', 'u']]) {
  for (const i of [0, 1, 2, 3, 4, 5, 6, 8]) pide.push(`${fija}-${i}.webp`);
  for (const [c0, n] of datos.tr[s]) for (let k = 1; k < n; k++) pide.push(`${viaje}-${c0}-${String(k).padStart(2, '0')}.webp`);
}
for (const f of pide) if (!fs.existsSync(path.join(dir, f))) errores.push(`assets/v2/img/escena/${f} no existe`);

if (errores.length) {
  console.error(`✗ check:portada — ${errores.length} problema(s):`);
  errores.forEach((e) => console.error('  ' + e));
  process.exit(1);
}
console.log(`✓ check:portada — las dos portadas llevan los nueve actos, la escena y sus ${pide.length} imágenes`);
