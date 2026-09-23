#!/usr/bin/env node
/*
 * Pone en cada página con cabecera lo que el tema necesita, y nada más:
 *   · en <head>: el script que fija data-theme ANTES de pintar (sin destello)
 *     y las tres hojas del tema, al final, para que manden;
 *   · nada más abrir <body>: el cielo (.gx) y la línea del cambio de sección;
 *   · justo después del enlace "Saltar al contenido": el botón de tema, para
 *     que sea lo segundo que se alcanza con el tabulador;
 *   · antes de </body>: tema.js.
 * Es idempotente: si la página ya lo tiene, no lo duplica.
 * Uso: node scripts/aplicar-tema.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const paginas = execSync('git ls-files "*.html"', { cwd: RAIZ }).toString().split('\n').filter(Boolean)
  .filter((f) => fs.readFileSync(path.join(RAIZ, f), 'utf8').includes('id="site-header"'));

export const HEAD = `<script>(function(){var t;try{t=localStorage.getItem('dcp-tema')}catch(e){}document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark')})();</script>`;
export const CSS = '<link rel="stylesheet" href="/assets/css/galaxia.css?v=0">\n<link rel="stylesheet" href="/assets/css/tema-claro.css?v=0">\n<link rel="stylesheet" href="/assets/css/tema.css?v=0">\n<link rel="stylesheet" href="/assets/css/superficies.css?v=0">';
/* La línea de montaje del cambio de sección. Tiene que estar en el HTML, no
   crearla al vuelo: «pagereveal» avisa antes de que corran los scripts con
   defer, así que un elemento creado desde tema.js llega tarde a la foto de
   la página nueva y no sale (medido: no aparecía en ningún fotograma con las
   animaciones a 1/30 de velocidad). Aquí está siempre, oculta, y el CSS solo
   la enseña mientras dura la transición. */
export const CORTE = '<div class="nav-corte" aria-hidden="true"></div>';
export const CIELO = '<div class="gx" aria-hidden="true"><i class="gx-polvo"></i><i class="gx-banda"></i><i class="gx-lejos"></i><i class="gx-medio"></i><i class="gx-brillo gx-brillo-a"></i><i class="gx-brillo gx-brillo-b"></i></div>';
const LUNA = '<svg class="t-luna" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.4 14.6A8.6 8.6 0 0 1 9.4 3.6a.5.5 0 0 0-.66-.6A9.4 9.4 0 1 0 21 15.26a.5.5 0 0 0-.6-.66Z" fill="currentColor"/><circle cx="17.2" cy="5.6" r="1.1" fill="currentColor" opacity=".7"/><circle cx="20.2" cy="9.4" r=".7" fill="currentColor" opacity=".55"/></svg>';
const SOL = '<svg class="t-sol" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4.3" fill="currentColor"/><path d="M12 2.6v2.3M12 19.1v2.3M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.6 12h2.3M19.1 12h2.3M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" fill="none"/></svg>';
export const boton = (en) => `<button type="button" class="tema-btn" data-tema-btn><span class="tema-btn-i" aria-hidden="true">${LUNA}${SOL}</span><span class="tema-btn-t"><span class="t-a-claro">${en ? 'Light mode' : 'Modo claro'}</span><span class="t-a-oscuro">${en ? 'Dark mode' : 'Modo oscuro'}</span></span></button>`;
export const JS = '<script src="/assets/js/tema.js?v=0" defer></script>';

let n = 0;
for (const f of paginas) {
  const ruta = path.join(RAIZ, f);
  let h = fs.readFileSync(ruta, 'utf8');
  const antes = h;
  const en = f.startsWith('en/');
  if (!h.includes("getItem('dcp-tema')")) h = h.replace(/(<meta name="viewport"[^>]*>)/, `$1\n${HEAD}`);
  if (!h.includes('/assets/css/tema.css')) {
    const cierre = h.indexOf('</head>');
    const cab = h.slice(0, cierre);
    const ult = cab.lastIndexOf('<link rel="stylesheet"');
    const finUlt = cab.indexOf('>', ult) + 1;
    h = h.slice(0, finUlt) + '\n' + CSS + h.slice(finUlt);
  }
  if (!h.includes('class="gx"')) h = h.replace(/(<body[^>]*>)/, `$1\n${CIELO}`);
  if (!h.includes('class="nav-corte"')) h = h.replace(/(<div class="gx"[^>]*>.*?<\/div>)/, `$1\n${CORTE}`);
  if (!h.includes('data-tema-btn')) h = h.replace(/(<a class="skip-link"[^>]*>[^<]*<\/a>)/, `$1 ${boton(en)}`);
  if (!h.includes('/assets/js/tema.js')) h = h.replace(/(\s*<\/body>)/, ` ${JS}$1`);
  if (h !== antes) { fs.writeFileSync(ruta, h); n++; }
}
console.log(`Tema aplicado en ${n} de ${paginas.length} páginas con cabecera.`);
