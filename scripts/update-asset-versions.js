#!/usr/bin/env node
// Recalcula el ?v= de /assets/css/styles.css y /assets/js/main.js a partir
// del hash real de su contenido y lo reescribe en TODOS los .html del repo.
//
// Por qué existe: antes de esto, el ?v= era una cadena escrita a mano
// (ej. "dir028-20260817") que dependía de que cada DIR se acordara de
// subirla al tocar styles.css o main.js. En la práctica no ocurrió durante
// varios ciclos (DIR-052/053/054/055 modificaron ambos archivos sin tocar
// el ?v=), lo que deja a Production expuesta a servir bytes cacheados
// desactualizados bajo la MISMA URL mientras Preview (dominio nuevo, sin
// caché previa) enseña el contenido correcto. Este script hace que el
// ?v= sea una función determinista del contenido: si el archivo no
// cambió, el hash no cambia; si cambió aunque sea un byte, el hash
// cambia y la URL completa cambia, invalidando cualquier caché de forma
// automática, sin depender de que nadie se acuerde de nada.
//
// Uso: node scripts/update-asset-versions.js
// Se ejecuta a mano antes de cada commit que toque styles.css o main.js
// (no hay build step configurado en Vercel para este proyecto, así que
// no puede engancharse a un build remoto: debe correr en el repo antes
// del commit). Ver README / CLAUDE.md para el recordatorio del proceso.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const HASH_LEN = 10;

function hashFile(relPath) {
  const abs = path.join(ROOT, relPath);
  const buf = fs.readFileSync(abs);
  return crypto.createHash('sha256').update(buf).digest('hex').slice(0, HASH_LEN);
}

function findHtmlFiles(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.git')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findHtmlFiles(full, out);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

const cssHash = hashFile('assets/css/styles.css');
const jsHash = hashFile('assets/js/main.js');
// La v5 añade su propia hoja y su propio script: sin esto conservaban el ?v=
// del fichero anterior y un visitante recurrente habría recibido el diseño
// viejo desde su caché.
const dcpCssHash = hashFile('assets/css/dcp5.css');
const dcpJsHash = hashFile('assets/js/dcp5.js');
const dcp6CssHash = hashFile('assets/css/dcp6.css');
const dcp6JsHash = hashFile('assets/js/dcp6.js');

const htmlFiles = findHtmlFiles(ROOT, []);
let changed = 0;

for (const file of htmlFiles) {
  const original = fs.readFileSync(file, 'utf8');
  const updated = original
    .replace(/styles\.css\?v=[A-Za-z0-9_-]+/g, `styles.css?v=${cssHash}`)
    .replace(/main\.js\?v=[A-Za-z0-9_-]+/g, `main.js?v=${jsHash}`)
    .replace(/dcp5\.css\?v=[A-Za-z0-9_-]+/g, `dcp5.css?v=${dcpCssHash}`)
    .replace(/dcp5\.js\?v=[A-Za-z0-9_-]+/g, `dcp5.js?v=${dcpJsHash}`)
    .replace(/dcp6\.css\?v=[A-Za-z0-9_-]+/g, `dcp6.css?v=${dcp6CssHash}`)
    .replace(/dcp6\.js\?v=[A-Za-z0-9_-]+/g, `dcp6.js?v=${dcp6JsHash}`);
  if (updated !== original) {
    fs.writeFileSync(file, updated, 'utf8');
    changed++;
  }
}

console.log(`styles.css -> ?v=${cssHash}`);
console.log(`main.js    -> ?v=${jsHash}`);
console.log(`dcp5.css   -> ?v=${dcpCssHash}`);
console.log(`dcp5.js    -> ?v=${dcpJsHash}`);
console.log(`dcp6.css   -> ?v=${dcp6CssHash}`);
console.log(`dcp6.js    -> ?v=${dcp6JsHash}`);
console.log(`Archivos .html actualizados: ${changed}/${htmlFiles.length}`);
