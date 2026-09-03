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
const dcp7CssHash = hashFile('assets/css/dcp7.css');
const dcp7JsHash = hashFile('assets/js/dcp7.js');
const dcp8CssHash = hashFile('assets/css/dcp8.css');
const dcp8JsHash = hashFile('assets/js/dcp8.js');
// dcp9 son las composiciones atadas a un bloque concreto del contenido.
const dcp9JsHash = hashFile('assets/js/dcp9.js');
/* La demo de Finance tenia su ?v= escrito a mano ("?v=2") y este script no la
   conocia: al cambiar su CSS, produccion podia seguir sirviendo los bytes
   viejos bajo la misma URL. Es exactamente lo que este script existe para
   evitar, asi que ahora tambien la versiona por el hash de su contenido. */
const finCssHash  = hashFile('assets/css/finance-demo.css');
const finJsHash   = hashFile('assets/js/finance-demo.js');
const finJsEnHash = hashFile('assets/js/finance-demo.en.js');
const finDataHash   = hashFile('assets/js/finance-demo-data.js');
const finDataEnHash = hashFile('assets/js/finance-demo-data.en.js');

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
    .replace(/dcp6\.js\?v=[A-Za-z0-9_-]+/g, `dcp6.js?v=${dcp6JsHash}`)
    .replace(/dcp7\.css\?v=[A-Za-z0-9_-]+/g, `dcp7.css?v=${dcp7CssHash}`)
    .replace(/dcp7\.js\?v=[A-Za-z0-9_-]+/g, `dcp7.js?v=${dcp7JsHash}`)
    .replace(/dcp8\.css\?v=[A-Za-z0-9_-]+/g, `dcp8.css?v=${dcp8CssHash}`)
    .replace(/dcp8\.js\?v=[A-Za-z0-9_-]+/g, `dcp8.js?v=${dcp8JsHash}`)
    .replace(/dcp9\.js\?v=[A-Za-z0-9_-]+/g, `dcp9.js?v=${dcp9JsHash}`)
    .replace(/finance-demo\.css\?v=[A-Za-z0-9_-]+/g, `finance-demo.css?v=${finCssHash}`)
    .replace(/finance-demo\.en\.js\?v=[A-Za-z0-9_-]+/g, `finance-demo.en.js?v=${finJsEnHash}`)
    .replace(/finance-demo-data\.en\.js\?v=[A-Za-z0-9_-]+/g, `finance-demo-data.en.js?v=${finDataEnHash}`)
    .replace(/finance-demo-data\.js\?v=[A-Za-z0-9_-]+/g, `finance-demo-data.js?v=${finDataHash}`)
    .replace(/finance-demo\.js\?v=[A-Za-z0-9_-]+/g, `finance-demo.js?v=${finJsHash}`);
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
console.log(`dcp7.css   -> ?v=${dcp7CssHash}`);
console.log(`dcp7.js    -> ?v=${dcp7JsHash}`);
console.log(`dcp8.css   -> ?v=${dcp8CssHash}`);
console.log(`dcp8.js    -> ?v=${dcp8JsHash}`);
console.log(`dcp9.js    -> ?v=${dcp9JsHash}`);
console.log(`finance-demo.css -> ?v=${finCssHash}`);
console.log(`Archivos .html actualizados: ${changed}/${htmlFiles.length}`);
