#!/usr/bin/env node
/*
 * EL SALUDO DEL ASISTENTE, PÁGINA A PÁGINA.
 *
 * Se escribe en el HTML, no en el navegador: así el saludo correcto ya está
 * puesto antes de que cargue ningún guion y no hay un parpadeo en el que se
 * lea el genérico. Las regiones son cerradas, como las de estado: si alguien
 * borra una, el centinela lo dice.
 *
 * Uso:  node scripts/build-chat.mjs
 *       node scripts/build-chat.mjs --check
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const { contextoDe, CONTEXTOS } = await import('./contenido/chat.mjs');

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

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
let tocadas = 0, vistas = 0;

for (const f of paginas(RAIZ)) {
  const original = fs.readFileSync(f, 'utf8');
  if (!/id="chat-messages"/.test(original)) continue;
  vistas++;
  const lang = /<html[^>]*\blang="en"/.test(original) ? 'en' : 'es';
  const rel = '/' + path.relative(RAIZ, f).replace(/\\/g, '/').replace(/\.html$/, '').replace(/\/index$/, '');
  const ruta = lang === 'en' ? (rel.replace(/^\/en/, '') || '/') : rel;
  const c = contextoDe(ruta)[lang];

  const saludo = `<div class="chat-msg bot">${esc(c.hola)}</div>`;
  const rapidas = c.rapidas.map((q) => `<button type="button" class="chat-quick-question">${esc(q)}</button>`).join(' ');

  let s = original;
  /* Dos páginas guardan el widget con saltos de línea y el resto en una sola
     línea: el espacio entre etiquetas no puede formar parte del patrón. */
  s = s.replace(/(<div class="chat-messages"[^>]*>)[\s\S]*?(<\/div>\s*<div class="chat-quick-replies")/,
    `$1 ${saludo} $2`);
  s = s.replace(/(<div class="chat-quick-replies" id="chat-quick-replies">)[\s\S]*?(<\/div>\s*<form class="chat-input-row")/,
    `$1 ${rapidas} $2`);

  if (!s.includes(saludo)) { errores.push(`${path.relative(RAIZ, f)}: no encuentro dónde va el saludo`); continue; }
  if (s !== original) {
    if (CHECK) errores.push(path.relative(RAIZ, f));
    else { fs.writeFileSync(f, s); tocadas++; }
  }
}

if (errores.length) {
  console.error(`✗ check:chat — ${errores.length} página(s) con el saludo que no toca:`);
  errores.slice(0, 8).forEach((e) => console.error('  ' + e));
  console.error('  Se arregla con:  node scripts/build-chat.mjs');
  process.exit(1);
}
console.log(CHECK
  ? `✓ check:chat — el asistente saluda según la sección en ${vistas} páginas (${CONTEXTOS.length} contextos)`
  : `✓ build:chat — saludo por sección en ${tocadas} de ${vistas} páginas (${CONTEXTOS.length} contextos)`);
