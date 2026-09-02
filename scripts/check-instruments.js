#!/usr/bin/env node
/* Comprueba que cada página que declara data-inst="x" tenga su INSTR.x
   definido en dcp8.js.

   Por qué existe: al reescribir bloques grandes de instrumentos se perdieron
   dos definiciones (produccion y servicios) sin que nada fallara a la vista.
   El script sale limpiamente por `if (!inst) return` DESPUÉS de haber
   insertado el lienzo, así que la página carga sin un solo error en consola
   y con un canvas de 300x150 en blanco. Se detectó de casualidad, por el
   test de movimiento reducido. Esto lo convierte en un fallo ruidoso. */
'use strict';
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const js = fs.readFileSync(path.join(raiz, 'assets/js/dcp8.js'), 'utf8');

const definidos = new Set();
for (const m of js.matchAll(/INSTR\.([a-zA-Z0-9_]+)\s*=/g)) definidos.add(m[1]);

function paginas(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) paginas(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const fallos = [];
let usados = 0;
for (const f of paginas(raiz)) {
  const html = fs.readFileSync(f, 'utf8');
  for (const m of html.matchAll(/data-inst="([a-zA-Z0-9_]+)"/g)) {
    usados++;
    if (!definidos.has(m[1])) {
      fallos.push(path.relative(raiz, f) + ' → INSTR.' + m[1] + ' no existe');
    }
  }
}

console.log(usados + ' referencias a instrumentos · ' + definidos.size + ' definidos');
if (fallos.length) {
  console.error('\nINSTRUMENTOS QUE FALTAN:');
  for (const x of fallos) console.error('  ' + x);
  process.exit(1);
}
console.log('SIN INCIDENCIAS');
