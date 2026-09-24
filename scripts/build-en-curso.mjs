#!/usr/bin/env node
/*
 * EL TABLERO DE «EN CURSO», DESDE UNA SOLA LISTA.
 *
 * La columna de lo que está listo se escribía a mano en las dos páginas, con
 * su recuento y su nota al pie escritos aparte: tres sitios donde el mismo
 * número podía decir cosas distintas. Ahora sale de scripts/contenido/en-curso.mjs.
 *
 * La otra columna —lo que NO está— no se toca aquí: la escribe build:estado
 * contra estado-producto.json, que exige prueba de cada paso. Eso se queda
 * como está a propósito.
 *
 * Uso:  node scripts/build-en-curso.mjs
 *       node scripts/build-en-curso.mjs --check
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const { LISTOS, ROTULOS } = await import('./contenido/en-curso.mjs');

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* La frase de VERI*FACTU es de build:estado, que la escribe contra la
   evidencia. Aquí NO se decide qué dice: se lee la que haya en la página y se
   vuelve a poner tal cual. Escribirla a mano aquí ponía a los dos generadores
   a pisarse el uno al otro en cada pasada. */
const REGION_VF = /<!--estado:vf-frase-->[\s\S]*?<!--\/estado:vf-frase-->/;
const vfDe = (pagina, lang) => (pagina.match(REGION_VF) || [
  lang === 'en'
    ? '<!--estado:vf-frase-->tax record ready for VERI*FACTU<!--/estado:vf-frase-->'
    : '<!--estado:vf-frase-->registro fiscal preparado para VERI*FACTU<!--/estado:vf-frase-->',
])[0];

const hechas = [];
for (const [pagina, lang] of [['cambios-en-proceso.html', 'es'], ['en/cambios-en-proceso.html', 'en']]) {
  const ruta = path.join(RAIZ, pagina);
  const original = fs.readFileSync(ruta, 'utf8');
  const r = ROTULOS[lang];
  const n = LISTOS.length;
  const vf = vfDe(original, lang);

  const filas = LISTOS.map((s) => {
    const [nombre, que] = s[lang];
    const cuerpo = s.vf ? esc(que).replace('§', vf) : esc(que);
    return `<div class="board-row" data-etapa="3" style="--k:var(--${s.k})"> <span class="board-dot"></span> <div>
<h2 class="board-name">${esc(nombre)}</h2>
<p class="board-what">${cuerpo}</p>
</div> <span class="board-tag">${esc(r.tag)}</span> </div>`;
  }).join(' ');

  const bloque = `<!--listos:filas--><div class="board"> <div class="board-head"> <span class="board-state board-state--live">${esc(r.estado)}</span> <span class="board-count">${esc(r.cuenta(n))}</span> </div> ${filas} </div><!--/listos:filas-->`;

  let s = original;
  const i = s.indexOf('<!--listos:filas-->');
  if (i >= 0) {
    const j = s.indexOf('<!--/listos:filas-->') + '<!--/listos:filas-->'.length;
    s = s.slice(0, i) + bloque + s.slice(j);
  } else {
    /* Primera vez: se sustituye el segundo tablero, el de lo que ya corre. */
    const a = s.indexOf('<div class="board">', s.indexOf('board-state--live') - 400);
    const b = s.indexOf('</div> </section>', a);
    if (a < 0 || b < 0) { console.error(`✗ ${pagina}: no encuentro el tablero de lo que está listo`); process.exit(1); }
    s = s.slice(0, a) + bloque + ' ' + s.slice(b + '</div> '.length);
  }

  /* La nota del pie lleva el recuento dentro. */
  s = s.replace(/<p class="board-note">[\s\S]*?<\/p>/, `<p class="board-note">${esc(r.nota(n))}</p>`);

  if (s !== original) {
    if (CHECK) { console.error(`✗ check:en-curso — ${pagina} no coincide con scripts/contenido/en-curso.mjs`); process.exit(1); }
    fs.writeFileSync(ruta, s);
    hechas.push(pagina);
  }
}

console.log(CHECK
  ? `✓ check:en-curso — los ${LISTOS.length} sistemas listos cuadran en las dos páginas`
  : `✓ build:en-curso — ${LISTOS.length} sistemas listos${hechas.length ? ' · reescritas: ' + hechas.join(', ') : ' · nada que cambiar'}`);
