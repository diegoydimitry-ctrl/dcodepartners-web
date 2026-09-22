#!/usr/bin/env node
/*
 * EL FONDO: UNA GALAXIA, NO UN PAPEL PINTADO DE ESTRELLAS
 * ---------------------------------------------------------------------------
 * Genera assets/css/galaxia.css. Todo el cielo se pinta con degradados CSS
 * (sin lienzo, sin JavaScript para dibujarlo): está en la primera pintura, se
 * rasteriza UNA vez y a partir de ahí solo se mueven capas ya compuestas con
 * transform y opacity, que no vuelven a pintar nada.
 *
 * Capas, de lejos a cerca:
 *   .gx          fondo del espacio: dos masas de luz muy anchas y el color base
 *   .gx-banda    el disco de la galaxia: una banda diagonal con su neblina,
 *                nudos más densos y estrellas que se agrupan a lo largo de ella
 *   .gx-lejos    polvo: muchas estrellas pequeñas y tenues (mosaico de 520 px)
 *   .gx-medio    estrellas medianas, en grupos y con vacíos (mosaico de 860 px)
 *   .gx-brillo   pocas estrellas con halo, en dos capas que respiran
 *                desfasadas (mosaicos de 1400 y 1700 px)
 *
 * Los colores no están aquí: cada estrella usa una variable (--gx-*) y el tema
 * (oscuro o claro) decide qué es "brillo" en su cielo. En oscuro, luz; en
 * claro, polvo estelar y halos suaves.
 *
 * Es determinista (semilla fija): mismo script, mismo cielo, mismo hash.
 * Uso: node scripts/build-galaxia.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DESTINO = path.join(RAIZ, 'assets/css/galaxia.css');

let s = 20260922;
const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const f = (n, d = 1) => +n.toFixed(d);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

/* Una estrella: núcleo nítido y, si toca, un halo. */
function estrella(x, y, r, col, halo, unidad = 'px') {
  const pos = `${f(x, unidad === '%' ? 2 : 0)}${unidad} ${f(y, unidad === '%' ? 2 : 0)}${unidad}`;
  if (!halo) return `radial-gradient(${f(r, 2)}px ${f(r, 2)}px at ${pos}, var(${col}) 55%, transparent 100%)`;
  const R = halo.r;
  return `radial-gradient(${R}px ${R}px at ${pos}, var(${col}) 0, var(${col}) ${f(r, 1)}px, var(${halo.c}) ${f(r * 1.9, 1)}px, transparent 100%)`;
}

/* Densidad periódica para un mosaico: grupos y vacíos que se repiten sin
   costura con el propio mosaico. */
function densidad(T, grupos) {
  return (x, y) => {
    let d = 0.35;
    for (const g of grupos) {
      let dx = Math.abs(x - g.x); dx = Math.min(dx, T - dx);
      let dy = Math.abs(y - g.y); dy = Math.min(dy, T - dy);
      d += g.p * Math.exp(-(dx * dx + dy * dy) / (2 * g.s * g.s));
    }
    return d;
  };
}
function mosaico(T, n, radio, colores, grupos, opts = {}) {
  const dens = densidad(T, grupos);
  const max = 0.35 + grupos.reduce((a, g) => a + Math.max(0, g.p), 0);
  const out = [];
  let intentos = 0;
  while (out.length < n && intentos++ < n * 200) {
    const x = rnd() * T, y = rnd() * T;
    const d = dens(x, y);
    if (opts.vacios ? rnd() * max > (max - d + 0.2) : rnd() * max > d) continue;
    if (opts.sep && out.some((o) => { let dx = Math.abs(o.x - x); dx = Math.min(dx, T - dx); let dy = Math.abs(o.y - y); dy = Math.min(dy, T - dy); return dx * dx + dy * dy < opts.sep * opts.sep; })) continue;
    const r = radio[0] + Math.pow(rnd(), 2.2) * (radio[1] - radio[0]);
    out.push({ x, y, r, c: pick(colores) });
  }
  return out;
}

/* ---------------------------------------------------------------- capas */
const LEJOS_T = 520, MEDIO_T = 860, BRILLO_A_T = 1400, BRILLO_B_T = 1700;

const lejos = mosaico(LEJOS_T, 78, [0.7, 1.15],
  ['--gx-w3', '--gx-w3', '--gx-w3', '--gx-w2', '--gx-c2', '--gx-v2'],
  [{ x: 90, y: 140, s: 90, p: 1.1 }, { x: 380, y: 330, s: 70, p: 0.9 }, { x: 250, y: 470, s: 60, p: -0.25 }]);

const medio = mosaico(MEDIO_T, 56, [0.95, 1.65],
  ['--gx-w2', '--gx-w2', '--gx-w1', '--gx-c2', '--gx-v2', '--gx-c1', '--gx-p2'],
  [{ x: 180, y: 620, s: 95, p: 1.6 }, { x: 640, y: 210, s: 120, p: 1.1 }, { x: 470, y: 470, s: 80, p: -0.3 }]);

/* Las estrellas con halo buscan los huecos: donde hay menos, brillan más. */
function brillantes(T, n, gruposVacios) {
  const est = mosaico(T, n, [1.1, 1.9], ['--gx-w1', '--gx-w1', '--gx-c1', '--gx-v1'], gruposVacios, { vacios: true, sep: T / 5 });
  return est.map((e, i) => ({ ...e, halo: { r: Math.round(9 + rnd() * 11), c: pick(['--gx-h1', '--gx-h1', '--gx-h2', '--gx-h3']) } }));
}
const brilloA = brillantes(BRILLO_A_T, 9, [{ x: 300, y: 900, s: 220, p: 1.2 }, { x: 1100, y: 350, s: 260, p: 0.9 }]);
const brilloB = brillantes(BRILLO_B_T, 8, [{ x: 800, y: 700, s: 300, p: 1.0 }, { x: 200, y: 200, s: 240, p: 0.8 }]);

/* La banda: diagonal que baja de derecha a izquierda, en % del viewport, así
   se adapta sola a cualquier pantalla. */
const banda = [];
const eje = (t) => ({ x: -6 + t * 112, y: 84 - t * 70 });   // de (-6,84) a (106,14)
for (let i = 0; i < 104; i++) {
  const t = rnd();
  const p = eje(t);
  // perpendicular a la banda (dirección (70,112) normalizada)
  const n = gauss() * (i < 30 ? 3.2 : 7.5);
  const x = p.x + n * 0.53, y = p.y + n * 0.85;
  if (x < -1 || x > 101 || y < -1 || y > 101) { i--; continue; }
  const r = 0.7 + Math.pow(rnd(), 2.6) * 1.1;
  banda.push({ x, y, r, c: pick(['--gx-w2', '--gx-w3', '--gx-w3', '--gx-c2', '--gx-v2', '--gx-w1']) });
}
// nudos: cúmulos pequeños y densos en tres puntos de la banda
for (const t of [0.22, 0.57, 0.83]) {
  const p = eje(t);
  for (let k = 0; k < 7; k++) {
    const x = p.x + gauss() * 1.1, y = p.y + gauss() * 1.4;
    banda.push({ x, y, r: 0.7 + rnd() * 0.7, c: pick(['--gx-w1', '--gx-w2', '--gx-c1']) });
  }
}

const neblinaBanda = [
  // la neblina del disco, en tres tramos que se solapan
  'radial-gradient(38% 13% at 22% 70%, var(--gx-n1), transparent 70%)',
  'radial-gradient(40% 12% at 52% 49%, var(--gx-n2), transparent 70%)',
  'radial-gradient(34% 11% at 82% 28%, var(--gx-n3), transparent 72%)',
  'radial-gradient(18% 8% at 57% 46%, var(--gx-n4), transparent 70%)',
];

const lista = (arr, unidad) => arr.map((e) => estrella(e.x, e.y, e.r, e.c, e.halo, unidad)).join(',\n    ');

const css = `/* ============================================================================
   GALAXIA — GENERADO por scripts/build-galaxia.mjs. No editar a mano.
   Los colores (--gx-*) los pone el tema en assets/css/tema.css.
   ========================================================================= */
.gx{
  position:fixed; inset:0; z-index:-1; pointer-events:none; overflow:hidden;
  contain:strict;
  background:
    radial-gradient(70% 55% at 12% 0%, var(--gx-fondo-1), transparent 70%),
    radial-gradient(60% 55% at 100% 100%, var(--gx-fondo-2), transparent 70%),
    radial-gradient(45% 35% at 78% 22%, var(--gx-fondo-3), transparent 70%),
    var(--gx-base);
  transition:opacity .6s ease;
}
.gx > i{ position:absolute; display:block; will-change:transform; backface-visibility:hidden; }

/* El disco */
.gx-banda{
  inset:-3%;
  background:
    ${lista(banda, '%')},
    ${neblinaBanda.join(',\n    ')};
  animation:gx-flota 70s ease-in-out infinite alternate;
}
/* Polvo lejano */
.gx-lejos{
  left:-40px; right:-40px; top:-${LEJOS_T + 40}px; height:calc(100% + ${LEJOS_T * 2 + 80}px);
  background-size:${LEJOS_T}px ${LEJOS_T}px;
  background-image:
    ${lista(lejos)};
  animation:gx-deriva-1 90s ease-in-out infinite alternate;
}
/* Estrellas medias, en grupos */
.gx-medio{
  left:-40px; right:-40px; top:-${MEDIO_T + 40}px; height:calc(100% + ${MEDIO_T * 2 + 80}px);
  background-size:${MEDIO_T}px ${MEDIO_T}px;
  background-image:
    ${lista(medio)};
  animation:gx-deriva-2 60s ease-in-out infinite alternate;
}
/* Las que brillan, en dos capas que respiran a destiempo */
.gx-brillo{ inset:-40px; opacity:.9; }
.gx-brillo-a{
  background-size:${BRILLO_A_T}px ${BRILLO_A_T}px;
  background-image:
    ${lista(brilloA)};
  animation:gx-respira 7.5s ease-in-out infinite alternate, gx-deriva-3 80s ease-in-out infinite alternate;
}
.gx-brillo-b{
  background-size:${BRILLO_B_T}px ${BRILLO_B_T}px; background-position:37% 61%;
  background-image:
    ${lista(brilloB)};
  animation:gx-respira 11s ease-in-out -4s infinite alternate, gx-deriva-2 95s ease-in-out infinite alternate-reverse;
}
@keyframes gx-flota{ from{ translate:-0.8% 0.6%; } to{ translate:0.8% -0.6%; } }
@keyframes gx-deriva-1{ from{ translate:-14px 10px; } to{ translate:14px -10px; } }
@keyframes gx-deriva-2{ from{ translate:22px -16px; } to{ translate:-22px 16px; } }
@keyframes gx-deriva-3{ from{ translate:-18px -12px; } to{ translate:18px 12px; } }
@keyframes gx-respira{ from{ opacity:.55; } to{ opacity:1; } }

/* Móvil: menos capas y menos trabajo. El cielo sigue ahí; el polvo medio y la
   segunda capa de brillo, no. */
@media (max-width:768px){
  .gx-medio{ background-size:${Math.round(MEDIO_T * 0.8)}px ${Math.round(MEDIO_T * 0.8)}px; }
  .gx-brillo-b{ display:none; }
  .gx-banda{ animation:none; }
}
@media (max-width:420px){
  .gx-lejos{ opacity:.8; }
}
/* Movimiento reducido: el mismo cielo, quieto. */
@media (prefers-reduced-motion: reduce){
  .gx > i{ animation:none !important; }
}
`;
if (process.argv.includes('--check')) {
  const actual = fs.existsSync(DESTINO) ? fs.readFileSync(DESTINO, 'utf8') : '';
  if (actual !== css) { console.error('✗ galaxia.css no está al día: ejecuta node scripts/build-galaxia.mjs'); process.exit(1); }
  console.log('✓ galaxia.css al día'); process.exit(0);
}
fs.writeFileSync(DESTINO, css);
console.log(`galaxia.css: banda ${banda.length} · lejos ${lejos.length} · medio ${medio.length} · brillo ${brilloA.length}+${brilloB.length} → ${(css.length / 1024).toFixed(1)} KB`);
