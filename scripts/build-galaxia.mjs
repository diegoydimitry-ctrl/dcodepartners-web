#!/usr/bin/env node
/*
 * EL FONDO: UNA GALAXIA, NO UN PAPEL PINTADO DE ESTRELLAS
 * ---------------------------------------------------------------------------
 * Genera assets/css/galaxia.css y los mosaicos PNG de assets/img/gx/.
 *
 * Las estrellas se pintan AQUÍ, una vez, en mosaicos PNG (a 2x, uno por tema):
 * antes eran ~260 degradados radiales CSS sobre capas enormes y el navegador
 * tardaba en rasterizarlos (medido: primer fotograma a ~3,2 s sin GPU, frente
 * a ~0,3 s sin el cielo; y otra vez al cambiar de tema, porque cambian las
 * variables). Una imagen se dibuja; un degradado se calcula píxel a píxel.
 * Las posiciones son las mismas de siempre: misma semilla, mismo cielo.
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
import zlib from 'node:zlib';
import crypto from 'node:crypto';
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


/* ------------------------------------------------ raster propio y PNG
   Sin dependencias: cada estrella se pinta solo en su caja, con el mismo
   perfil que tenía su degradado CSS (núcleo, halo, desvanecido), en color
   premultiplicado y con envoltura en los bordes del mosaico. */
const TEMA_CSS = fs.readFileSync(path.join(RAIZ, 'assets/css/tema.css'), 'utf8');
function colores(bloque) {
  const out = {};
  for (const m of bloque.matchAll(/(--gx-[a-z0-9]+):\s*rgba\(([^)]+)\)/g)) out[m[1]] = m[2].split(',').map(Number);
  return out;
}
const iOsc = TEMA_CSS.indexOf(':root{'), iCla = TEMA_CSS.indexOf('html[data-theme="light"]{');
const PALETAS = {
  oscuro: colores(TEMA_CSS.slice(iOsc, TEMA_CSS.indexOf('}', iOsc))),
  claro: colores(TEMA_CSS.slice(iCla, TEMA_CSS.indexOf('}', iCla))),
};
let ESC = 2; // polvo a 2x (nítido en retina); halos y banda a 1x (son suaves)
function lienzo(w, h) { return { w, h, px: new Float32Array(w * h * 4) }; }
function perfil(e) { // devuelve [radioMax, f(d) -> [colorVar, alfaRelativo] mezclado]
  if (!e.halo) return [e.r, (d) => d <= e.r * 0.55 ? [[e.c, 1]] : d >= e.r ? [] : [[e.c, 1 - (d - e.r * 0.55) / (e.r * 0.45)]]];
  const R = e.halo.r, r = e.r, r2 = e.r * 1.9;
  return [R, (d) => {
    if (d <= r) return [[e.c, 1]];
    if (d <= r2) { const t = (d - r) / (r2 - r); return [[e.c, 1 - t], [e.halo.c, t]]; }
    if (d >= R) return [];
    return [[e.halo.c, 1 - (d - r2) / (R - r2)]];
  }];
}
function pinta(L, e, pal, envolver) {
  const [Rmax, f] = perfil(e);
  const cx = e.x * ESC, cy = e.y * ESC, R = Rmax * ESC + 1;
  for (let y = Math.floor(cy - R); y <= Math.ceil(cy + R); y++) for (let x = Math.floor(cx - R); x <= Math.ceil(cx + R); x++) {
    const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy) / ESC;
    const capas = f(d); if (!capas.length) continue;
    let pr = 0, pg = 0, pb = 0, pa = 0;
    for (const [v, w] of capas) { const c = pal[v]; if (!c) continue; const a = c[3] * w; pr += c[0] / 255 * a; pg += c[1] / 255 * a; pb += c[2] / 255 * a; pa += a; }
    if (pa <= 0) continue;
    let X = x, Y = y;
    if (envolver) { X = ((x % L.w) + L.w) % L.w; Y = ((y % L.h) + L.h) % L.h; } else if (x < 0 || y < 0 || x >= L.w || y >= L.h) continue;
    const i = (Y * L.w + X) * 4, P = L.px, k = 1 - pa;
    P[i] = pr + P[i] * k; P[i + 1] = pg + P[i + 1] * k; P[i + 2] = pb + P[i + 2] * k; P[i + 3] = pa + P[i + 3] * k;
  }
}
const CRC = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc32 = (b) => { let c = -1; for (const x of b) c = CRC[(c ^ x) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
function trozo(tipo, datos) { const l = Buffer.alloc(4); l.writeUInt32BE(datos.length); const td = Buffer.concat([Buffer.from(tipo), datos]); const c = Buffer.alloc(4); c.writeUInt32BE(crc32(td)); return Buffer.concat([l, td, c]); }
function png(L) {
  const fila = L.w * 4 + 1, raw = Buffer.alloc(fila * L.h);
  for (let y = 0; y < L.h; y++) for (let x = 0; x < L.w; x++) {
    const i = (y * L.w + x) * 4, o = y * fila + 1 + x * 4, a = Math.min(1, L.px[i + 3]);
    if (a <= 0.002) continue;
    raw[o] = Math.round(Math.min(1, L.px[i] / a) * 255); raw[o + 1] = Math.round(Math.min(1, L.px[i + 1] / a) * 255);
    raw[o + 2] = Math.round(Math.min(1, L.px[i + 2] / a) * 255); raw[o + 3] = Math.round(a * 255);
  }
  const ih = Buffer.alloc(13); ih.writeUInt32BE(L.w, 0); ih.writeUInt32BE(L.h, 4); ih[8] = 8; ih[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), trozo('IHDR', ih), trozo('IDAT', zlib.deflateSync(raw, { level: 9 })), trozo('IEND', Buffer.alloc(0))]);
}
const DIR_IMG = path.join(RAIZ, 'assets/img/gx');
const ficheros = {}; // nombre lógico -> { tema -> ruta pública }
function mosaicoPNG(nombre, T, estrellas, alto = T, esc = 2) {
  ESC = esc;
  ficheros[nombre] = {};
  for (const tema of Object.keys(PALETAS)) {
    const L = lienzo(T * ESC, alto * ESC);
    for (const e of estrellas) pinta(L, e, PALETAS[tema], true);
    const buf = png(L), h = crypto.createHash('sha1').update(buf).digest('hex').slice(0, 10);
    const nom = `${nombre}-${tema}.${h}.png`;
    ficheros[nombre][tema] = { nom, buf, pub: `/assets/img/gx/${nom}` };
  }
}
/* La banda estaba en % del viewport: se pinta en un lienzo de 1600×1000 y se
   dibuja con cover (sin deformar). */
const BANDA_W = 1600, BANDA_H = 1000;
mosaicoPNG('lejos', LEJOS_T, lejos);
mosaicoPNG('medio', MEDIO_T, medio);
mosaicoPNG('brillo-a', BRILLO_A_T, brilloA, BRILLO_A_T, 1);
mosaicoPNG('brillo-b', BRILLO_B_T, brilloB, BRILLO_B_T, 1);
mosaicoPNG('banda', BANDA_W, banda.map((e) => ({ ...e, x: e.x / 100 * BANDA_W, y: e.y / 100 * BANDA_H, r: e.r })), BANDA_H, 1);
const url = (n, t) => `url("${ficheros[n][t].pub}")`;
const lista = (arr, unidad) => arr.map((e) => estrella(e.x, e.y, e.r, e.c, e.halo, unidad)).join(',\n    ');

const capa = (n, extra = '') => `  background-image:${url(n, 'oscuro')};${extra}`;
const claro = (sel, n) => `html[data-theme="light"] ${sel}{ background-image:${url(n, 'claro')}; }`;
const css = `/* ============================================================================
   GALAXIA — GENERADO por scripts/build-galaxia.mjs. No editar a mano.
   Las estrellas son mosaicos PNG pre-pintados (assets/img/gx/, uno por tema);
   las luces grandes del fondo y la neblina, degradados (pocos y baratos).
   Los colores de fondo (--gx-*) los pone el tema en assets/css/tema.css.
   ========================================================================= */
.gx{
  position:fixed; inset:0; z-index:-1; pointer-events:none; overflow:hidden;
  contain:strict;
  background:
    ${neblinaBanda.join(',\n    ')},
    radial-gradient(70% 55% at 12% 0%, var(--gx-fondo-1), transparent 70%),
    radial-gradient(60% 55% at 100% 100%, var(--gx-fondo-2), transparent 70%),
    radial-gradient(45% 35% at 78% 22%, var(--gx-fondo-3), transparent 70%),
    var(--gx-base);
}
.gx > i{ position:absolute; display:block; background-repeat:repeat; }
/* Solo dos capas se mueven (y se componen aparte): el polvo lejano y el medio.
   El disco y las estrellas con halo son fijos y se pintan UNA vez dentro de
   la capa del cielo, por debajo de las que se mueven. El brillo que respira
   lo ponen unas pocas estrellas pequeñas (.gx-t), casi gratis. */
.gx-lejos, .gx-medio{ z-index:1; will-change:transform; backface-visibility:hidden; }

/* El disco: estrellas a lo largo de la banda (la neblina va en .gx) */
.gx-banda{ inset:0; background-repeat:no-repeat; background-size:cover; background-position:50% 50%;
${capa('banda')} }
/* Polvo lejano */
.gx-lejos{
  left:-40px; right:-40px; top:-${LEJOS_T + 40}px; height:calc(100% + ${LEJOS_T * 2 + 80}px);
  background-size:${LEJOS_T}px ${LEJOS_T}px;
${capa('lejos')}
  animation:gx-deriva-1 90s ease-in-out infinite alternate;
}
/* Estrellas medias, en grupos */
.gx-medio{
  left:-40px; right:-40px; top:-${MEDIO_T + 40}px; height:calc(100% + ${MEDIO_T * 2 + 80}px);
  background-size:${MEDIO_T}px ${MEDIO_T}px;
${capa('medio')}
  animation:gx-deriva-2 60s ease-in-out infinite alternate;
}
/* Las que brillan, con halo */
.gx-brillo{ inset:-40px; opacity:.9; }
.gx-brillo-a{ background-size:${BRILLO_A_T}px ${BRILLO_A_T}px;
${capa('brillo-a')} }
.gx-brillo-b{ background-size:${BRILLO_B_T}px ${BRILLO_B_T}px; background-position:37% 61%;
${capa('brillo-b')} }
${claro('.gx-banda', 'banda')}
${claro('.gx-lejos', 'lejos')}
${claro('.gx-medio', 'medio')}
${claro('.gx-brillo-a', 'brillo-a')}
${claro('.gx-brillo-b', 'brillo-b')}
@keyframes gx-deriva-1{ from{ translate:-14px 10px; } to{ translate:14px -10px; } }
@keyframes gx-deriva-2{ from{ translate:22px -16px; } to{ translate:-22px 16px; } }
/* Estrellas que titilan: pocas, diminutas, cada una en su capa mínima. */
.gx-t{ position:absolute; z-index:2; width:3px; height:3px; margin:-1.5px 0 0 -1.5px; border-radius:50%;
  background:var(--gx-w1); box-shadow:0 0 6px 2px var(--gx-h1), 0 0 14px 4px var(--gx-h3);
  opacity:.25; animation:gx-titila var(--d, 5s) ease-in-out var(--dl, 0s) infinite alternate; will-change:opacity; }
.gx-t.is-c{ background:var(--gx-c1); box-shadow:0 0 6px 2px var(--gx-h2), 0 0 14px 4px var(--gx-h2); }
@keyframes gx-titila{ 0%, 35%{ opacity:.2; } 100%{ opacity:1; } }

/* Móvil: menos capas y menos trabajo. El cielo sigue ahí; la segunda capa de
   brillo, no. */
@media (max-width:768px){
  .gx-medio{ background-size:${Math.round(MEDIO_T * 0.8)}px ${Math.round(MEDIO_T * 0.8)}px; }
  .gx-brillo-b{ display:none; }
}
@media (max-width:420px){
  .gx-lejos{ opacity:.8; }
}
/* Movimiento reducido: el mismo cielo, quieto. */
@media (prefers-reduced-motion: reduce){
  .gx > i, .gx-t{ animation:none !important; }
  .gx-t{ opacity:.7; }
}
`;
const todos = Object.values(ficheros).flatMap((o) => Object.values(o));
if (process.argv.includes('--check')) {
  const actual = fs.existsSync(DESTINO) ? fs.readFileSync(DESTINO, 'utf8') : '';
  if (actual !== css) { console.error('✗ galaxia.css no está al día: ejecuta node scripts/build-galaxia.mjs'); process.exit(1); }
  for (const f of todos) if (!fs.existsSync(path.join(DIR_IMG, f.nom))) { console.error(`✗ falta assets/img/gx/${f.nom}: ejecuta node scripts/build-galaxia.mjs`); process.exit(1); }
  console.log('✓ galaxia.css y mosaicos al día'); process.exit(0);
}
fs.mkdirSync(DIR_IMG, { recursive: true });
const vivos = new Set(todos.map((f) => f.nom));
for (const f of fs.readdirSync(DIR_IMG)) if (f.endsWith('.png') && !vivos.has(f)) fs.unlinkSync(path.join(DIR_IMG, f));
for (const f of todos) fs.writeFileSync(path.join(DIR_IMG, f.nom), f.buf);
fs.writeFileSync(DESTINO, css);
console.log(`galaxia.css ${(css.length / 1024).toFixed(1)} KB · mosaicos: ${todos.map((f) => f.nom.split('.')[0] + ' ' + (f.buf.length / 1024).toFixed(0) + ' KB').join(' · ')}`);
