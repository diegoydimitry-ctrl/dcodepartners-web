/* ==========================================================================
   THE D-CODE SYSTEM — motor WebGL reutilizable (v11)
   ==========================================================================
   UN solo motor para todo el sitio. La portada monta UNA escena fija detrás
   de toda la narrativa y le va pidiendo formas capítulo a capítulo; cada
   página interior monta una escena pequeña en su cabecera con la forma que
   le corresponde. Nunca hay dos implementaciones 3D: hay un conjunto de
   partículas que cambia de forma.

   Técnica (morph en GPU, sin librerías extra):
   - Cada forma es un Float32Array de N posiciones (+ color + grupo).
   - La GPU recibe dos formas a la vez (aFrom / aTo) y un uniforme uT; cada
     partícula arranca con su propio desfase (aFase), así el cambio no es
     un bloque que se desliza sino una bandada que se reorganiza.
   - Al pedir una forma nueva a mitad de un cambio, se fotografía la
     posición actual en CPU (la misma fórmula del shader, sin el ruido) y
     esa foto pasa a ser el origen: nunca hay saltos.
   - El cursor se proyecta al plano z=0 del grupo (sin raycasting) y empuja
     las partículas en el propio shader.
   - Líneas: pares precalculados por forma (vecinos dentro de su grupo),
     se encienden cuando la forma termina de asentarse.

   Garantías: DPR limitado, pausa fuera de pantalla y con la pestaña
   oculta, un único fotograma fijo con prefers-reduced-motion, y quien
   monta decide qué hacer si no hay WebGL (el contenido real vive en HTML).

   Colores: los mismos --k-* de Departamentos — cero paleta nueva.
========================================================================== */

let THREE = null;
let cargaTHREE = null;

export async function cargarMotor() {
  if (!THREE) {
    if (!cargaTHREE) cargaTHREE = import("/assets/vendor/three/three.module.min.js");
    THREE = await cargaTHREE;
  }
  return THREE;
}

const TAU = Math.PI * 2;

/* Seis capas reales del discurso de D-Code, de arriba a abajo. */
export const CAPAS = [
  { nombre: "Personas",         color: 0x35e0a1 },
  { nombre: "Procesos",         color: 0xffb43a },
  { nombre: "Datos",            color: 0x5b8cff },
  { nombre: "Herramientas",     color: 0x8b93ff },
  { nombre: "IA",               color: 0xa78bfa },
  { nombre: "Automatizaciones", color: 0x4dd0e1 },
];

/* Ocho departamentos, en el orden en que la portada los enumera. */
const DEPTOS = [0x4dd0e1, 0xff6b9d, 0x35e0a1, 0xffb43a, 0x5b8cff, 0x2dd4bf, 0x8b93ff, 0xa78bfa];

/** Hash entero (MurmurHash3 fmix): ruido estable por índice. Un hash
 *  trigonométrico sobre índices secuenciales cae en retícula visible. */
function ruido(i, salt) {
  let h = (Math.imul(i ^ salt, 0x27d4eb2d) ^ (i + salt * 0x9e3779b9)) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0;
  h = (h ^ (h >>> 16)) >>> 0;
  return h / 4294967295;
}
function gauss(i, s) { // aproximación suma-de-uniformes, centrada en 0
  return (ruido(i, s) + ruido(i, s + 101) + ruido(i, s + 202) - 1.5) / 1.5;
}
function rgb(hex) { return [((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255]; }
function mezcla(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }

const GRIS = rgb(0x7d8699);
const LUZ = rgb(0xe6eeff);
const AZUL = rgb(0x5b8cff);

/* ---------------------------------------------------------------- FORMAS
   Cada una devuelve { pos, col, grupo, lineas: (pos, grupo) => pares }.
   El color base de cada partícula es el de su capa (i % 6): así, cuando una
   forma no impone color propio, se sigue leyendo "seis capas mezcladas". */
function colorCapa(i) { return rgb(CAPAS[i % CAPAS.length].color); }

const FORMAS = {
  /* Polvo: el estado previo a todo — disperso, sin centro. */
  polvo(n) {
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), grupo = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const r = 7 + ruido(i, 1) * 7;
      const th = ruido(i, 2) * TAU, ph = Math.acos(2 * ruido(i, 3) - 1);
      pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th) * 0.7, r * Math.cos(ph) * 0.8 - 2], i * 3);
      col.set(mezcla(colorCapa(i), GRIS, 0.55), i * 3);
      grupo[i] = -1;
    }
    return { pos, col, grupo };
  },

  /* Núcleo (Hero): una esfera de nodos con un corazón denso y una órbita.
     El sistema, visto desde fuera, antes de abrirlo. */
  nucleo(n) {
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), grupo = new Float32Array(n);
    const ga = Math.PI * (3 - Math.sqrt(5));
    const nCasc = Math.floor(n * 0.58), nCore = Math.floor(n * 0.24);
    for (let i = 0; i < n; i++) {
      let x, y, z, c;
      if (i < nCasc) {
        const yy = 1 - (i / (nCasc - 1)) * 2, rr = Math.sqrt(1 - yy * yy), th = ga * i;
        const R = 2.55 + gauss(i, 7) * 0.05;
        x = Math.cos(th) * rr * R; y = yy * R; z = Math.sin(th) * rr * R;
        c = mezcla(colorCapa(i), LUZ, 0.25); grupo[i] = 0;
      } else if (i < nCasc + nCore) {
        const r = Math.cbrt(ruido(i, 8)) * 1.15;
        const th = ruido(i, 9) * TAU, ph = Math.acos(2 * ruido(i, 10) - 1);
        x = r * Math.sin(ph) * Math.cos(th); y = r * Math.sin(ph) * Math.sin(th); z = r * Math.cos(ph);
        c = mezcla(AZUL, LUZ, 0.35 + ruido(i, 11) * 0.4); grupo[i] = 1;
      } else {
        const th = ruido(i, 12) * TAU, R = 3.55 + gauss(i, 13) * 0.08;
        x = Math.cos(th) * R; z = Math.sin(th) * R; y = gauss(i, 14) * 0.05;
        const inc = 0.42; const y2 = y * Math.cos(inc) - z * Math.sin(inc); z = y * Math.sin(inc) + z * Math.cos(inc); y = y2;
        c = mezcla(colorCapa(i), LUZ, 0.1); grupo[i] = 2;
      }
      pos.set([x, y, z], i * 3); col.set(c, i * 3);
    }
    return { pos, col, grupo, lineas: (p, g) => vecinos(p, g, n, { soloGrupo: 0, muestra: 520, maxD: 0.62, tope: 520 }) };
  },

  /* Fragmentos (El problema): tres bloques rotos, sin nada entre ellos más
     que restos sueltos. Cobros, oportunidades, datos repetidos. */
  fragmentos(n) {
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), grupo = new Float32Array(n);
    const C = [[-3.4, 1.3, -0.4], [3.1, 0.9, -1.2], [0.2, -2.1, 0.5]];
    const tonos = [0x5b8cff, 0x4dd0e1, 0x8b93ff];
    for (let i = 0; i < n; i++) {
      const suelto = ruido(i, 20) < 0.12;
      if (suelto) {
        pos.set([gauss(i, 21) * 6, gauss(i, 22) * 3.6, gauss(i, 23) * 3 - 1], i * 3);
        col.set(mezcla(GRIS, LUZ, 0.1), i * 3); grupo[i] = -1; continue;
      }
      const k = i % 3, c = C[k];
      // Bloque "roto": caja con una cara arrancada (u > 0.8 se desplaza).
      let u = ruido(i, 24) * 2 - 1, v = ruido(i, 25) * 2 - 1, w = ruido(i, 26) * 2 - 1;
      const cara = Math.floor(ruido(i, 27) * 3);
      if (cara === 0) u = Math.sign(u) || 1; else if (cara === 1) v = Math.sign(v) || 1; else w = Math.sign(w) || 1;
      const s = 1.05;
      let x = u * s, y = v * s * 0.85, z = w * s;
      if (x > 0.6 && y > 0.1) { x += 0.55 + ruido(i, 28) * 0.4; y += 0.35; z += gauss(i, 29) * 0.3; }
      // Rotación distinta por bloque: no encajan entre sí.
      const a = [0.5, -0.7, 0.25][k], b = [0.3, 0.6, -0.5][k];
      const x1 = x * Math.cos(a) - z * Math.sin(a), z1 = x * Math.sin(a) + z * Math.cos(a);
      const y2 = y * Math.cos(b) - z1 * Math.sin(b), z2 = y * Math.sin(b) + z1 * Math.cos(b);
      pos.set([c[0] + x1, c[1] + y2, c[2] + z2], i * 3);
      col.set(mezcla(rgb(tonos[k]), GRIS, 0.5), i * 3); grupo[i] = k;
    }
    return { pos, col, grupo, lineas: (p, g) => vecinos(p, g, n, { muestra: 480, maxD: 0.5, tope: 300, soloMismoGrupo: true }) };
  },

  /* Red (La conexión): siete nodos y los filamentos que los unen. Lo que
     estaba roto, ahora tiene un camino entre sus partes. */
  red(n) {
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), grupo = new Float32Array(n);
    const H = [[-4.2, 1.6, -0.5], [-1.4, 2.6, 0.6], [1.9, 2.1, -0.8], [4.3, 0.4, 0.2], [2.4, -2.1, 0.7], [-1.1, -2.4, -0.4], [-3.6, -0.9, 0.9]];
    const E = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [1, 5], [2, 4], [0, 3], [6, 2]];
    const nHub = Math.floor(n * 0.2);
    for (let i = 0; i < n; i++) {
      let x, y, z, c;
      if (i < nHub) {
        const h = H[i % H.length], r = Math.cbrt(ruido(i, 30)) * 0.42;
        const th = ruido(i, 31) * TAU, ph = Math.acos(2 * ruido(i, 32) - 1);
        x = h[0] + r * Math.sin(ph) * Math.cos(th); y = h[1] + r * Math.sin(ph) * Math.sin(th); z = h[2] + r * Math.cos(ph);
        c = mezcla(rgb(CAPAS[i % 6].color), LUZ, 0.35); grupo[i] = 100 + (i % H.length);
      } else {
        const e = E[i % E.length], a = H[e[0]], b = H[e[1]], t = ruido(i, 33);
        const arco = Math.sin(t * Math.PI) * 0.55;
        // Perpendicular aproximada en el plano XY para curvar el filamento.
        const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
        x = a[0] + dx * t - (dy / L) * arco + gauss(i, 34) * 0.05;
        y = a[1] + dy * t + (dx / L) * arco + gauss(i, 35) * 0.05;
        z = a[2] + (b[2] - a[2]) * t + Math.sin(t * Math.PI) * 0.35 + gauss(i, 36) * 0.05;
        c = mezcla(AZUL, LUZ, 0.2 + t * 0.2); grupo[i] = i % E.length;
      }
      pos.set([x, y, z], i * 3); col.set(c, i * 3);
    }
    return { pos, col, grupo, lineas: (p, g) => vecinos(p, g, n, { muestra: 900, maxD: 0.36, tope: 700, soloMismoGrupo: true }) };
  },

  /* Capas (El sistema): seis platos apilados, de Personas (arriba) a
     Automatizaciones (abajo), y cada plato unido al de al lado. */
  capas(n) {
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), grupo = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const k = i % CAPAS.length;
      const th = ruido(i, 40) * TAU;
      const R = Math.sqrt(ruido(i, 41)) * 2.9 + 0.35;
      pos.set([R * Math.cos(th), (2.5 - k) * 0.92 + gauss(i, 42) * 0.03, R * Math.sin(th)], i * 3);
      col.set(rgb(CAPAS[k].color), i * 3); grupo[i] = k;
    }
    return { pos, col, grupo, lineas: (p, g) => vecinos(p, g, n, { muestra: 1100, maxD: 0.62, tope: 900, capaVecina: true }) };
  },

  /* Retícula (Lo que D-Code construye): ocho módulos — los ocho
     departamentos — como bloques sobre una misma planta. */
  reticula(n) {
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), grupo = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const k = i % 8, cx = ((k % 4) - 1.5) * 2.35, cy = (k < 4 ? 1 : -1) * 1.25;
      let u = ruido(i, 50) * 2 - 1, v = ruido(i, 51) * 2 - 1, w = ruido(i, 52) * 2 - 1;
      // Aristas del cubo con más densidad que las caras: se lee como plano.
      const arista = ruido(i, 53) < 0.55;
      if (arista) {
        const eje = Math.floor(ruido(i, 54) * 3);
        const s1 = ruido(i, 55) < 0.5 ? -1 : 1, s2 = ruido(i, 56) < 0.5 ? -1 : 1;
        if (eje === 0) { v = s1; w = s2; } else if (eje === 1) { u = s1; w = s2; } else { u = s1; v = s2; }
      } else {
        const cara = Math.floor(ruido(i, 57) * 3), s = ruido(i, 58) < 0.5 ? -1 : 1;
        if (cara === 0) u = s; else if (cara === 1) v = s; else w = s;
      }
      const h = 0.62;
      pos.set([cx + u * h, cy + v * h * 0.8, w * h], i * 3);
      col.set(mezcla(rgb(DEPTOS[k]), LUZ, arista ? 0.15 : 0), i * 3); grupo[i] = k;
    }
    return { pos, col, grupo, lineas: () => aristasCubos() };
  },

  /* Horizonte: el sistema en régimen, en segundo plano — un suelo que
     respira mientras se leen demos, casos y precios. */
  horizonte(n) {
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), grupo = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = (ruido(i, 60) * 2 - 1) * 15, z = -12 + ruido(i, 61) * 15;
      pos.set([x, -3.1 + Math.sin(x * 0.5) * Math.cos(z * 0.4) * 0.35, z], i * 3);
      col.set(mezcla(AZUL, colorCapa(i), 0.3), i * 3); grupo[i] = -1;
    }
    return { pos, col, grupo };
  },

  /* Punto: todo vuelve a un solo punto de luz. Cierre del recorrido. */
  punto(n) {
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), grupo = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      if (ruido(i, 70) < 0.72) {
        const r = Math.pow(ruido(i, 71), 2.2) * 0.9;
        const th = ruido(i, 72) * TAU, ph = Math.acos(2 * ruido(i, 73) - 1);
        pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph)], i * 3);
        col.set(mezcla(AZUL, LUZ, 0.5 + ruido(i, 74) * 0.5), i * 3);
      } else {
        const th = ruido(i, 75) * TAU, R = 2.1 + gauss(i, 76) * 0.12;
        pos.set([Math.cos(th) * R, Math.sin(th) * R * 0.34, Math.sin(th) * R * 0.5], i * 3);
        col.set(mezcla(colorCapa(i), LUZ, 0.2), i * 3);
      }
      grupo[i] = -1;
    }
    return { pos, col, grupo };
  },
};

/* Cámara/encuadre por forma: rotación del grupo, distancia y desplazamiento.
   `x` se expresa en unidades de mundo y la portada lo usa para dejar hueco
   al texto (la escena vive a la derecha en escritorio). */
const ENCUADRE = {
  polvo:      { z: 12,  rx: 0,    ry: 0,     x: 0 },
  nucleo:     { z: 10.2, rx: 0.1,  ry: 0,     x: 3.1 },
  fragmentos: { z: 11,  rx: 0.05, ry: -0.15, x: 1.2 },
  red:        { z: 11,  rx: 0.1,  ry: 0.1,   x: 1.4 },
  capas:      { z: 13.5,rx: 0.36, ry: 0.3,   x: 3.3 },
  reticula:   { z: 16,  rx: 0.3,  ry: -0.3,  x: 5.2 },
  horizonte:  { z: 10,  rx: 0.05, ry: 0,     x: 0 },
  punto:      { z: 13,  rx: 0.2,  ry: 0,     x: 0 },
};

/* Vecinos más próximos sobre una muestra de índices — O(m²) con m acotado. */
function vecinos(pos, grupo, n, o) {
  const m = Math.min(n, o.muestra || 600), paso = n / m, idx = [];
  for (let k = 0; k < m; k++) idx.push(Math.floor(k * paso));
  const pares = [], maxD2 = o.maxD * o.maxD;
  for (let a = 0; a < idx.length && pares.length < o.tope; a++) {
    const i = idx[a];
    if (o.soloGrupo != null && grupo[i] !== o.soloGrupo) continue;
    let best = -1, bd = maxD2, bestV = -1, bdV = maxD2 * 1.6;
    for (let b = 0; b < idx.length; b++) {
      if (a === b) continue;
      const j = idx[b];
      if (o.soloGrupo != null && grupo[j] !== o.soloGrupo) continue;
      const dx = pos[i * 3] - pos[j * 3], dy = pos[i * 3 + 1] - pos[j * 3 + 1], dz = pos[i * 3 + 2] - pos[j * 3 + 2];
      const d = dx * dx + dy * dy + dz * dz;
      const mismo = grupo[i] === grupo[j];
      if ((o.soloMismoGrupo || o.capaVecina) && !mismo) {
        if (o.capaVecina && Math.abs(grupo[i] - grupo[j]) === 1 && d < bdV && a % 5 === 0) { bdV = d; bestV = j; }
        continue;
      }
      if (d < bd) { bd = d; best = j; }
    }
    if (best >= 0) pares.push(i, best);
    if (bestV >= 0) pares.push(i, bestV);
  }
  return pares;
}

/* Las 12 aristas de cada uno de los 8 módulos, como pares de puntos
   explícitos (no índices): la retícula se dibuja como un plano técnico. */
function aristasCubos() {
  const out = [];
  const h = 0.62, hy = h * 0.8;
  for (let k = 0; k < 8; k++) {
    const cx = ((k % 4) - 1.5) * 2.35, cy = (k < 4 ? 1 : -1) * 1.25;
    const v = [];
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) v.push([cx + sx * h, cy + sy * hy, sz * h]);
    const E = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
    for (const [a, b] of E) out.push({ a: v[a], b: v[b], k });
  }
  return { explicitas: out };
}

/* ---------------------------------------------------------------- SHADERS */
const VERT = /* glsl */`
uniform float uT, uTime, uPx, uSize, uAgita, uFoco, uOla, uDim, uTinteMix, uMouseF;
uniform vec3 uMouse, uTinte;
attribute vec3 aFrom, aTo, aColFrom, aColTo;
attribute float aFase, aSize, aGrupo;
varying vec3 vCol;
varying float vA;
void main(){
  float k = clamp((uT - aFase * 0.45) / 0.55, 0.0, 1.0);
  float e = k * k * (3.0 - 2.0 * k);
  vec3 p = mix(aFrom, aTo, e);
  float vuelo = sin(e * 3.14159);
  vec3 turb = vec3(sin(aFase * 41.0 + uTime * 0.55), cos(aFase * 29.0 + uTime * 0.47), sin(aFase * 23.0 + uTime * 0.39));
  p += turb * (0.035 + vuelo * 0.85 + uAgita * 0.22);
  p.y += uOla * e * sin(p.x * 0.55 + uTime * 0.45) * cos(p.z * 0.5 + uTime * 0.3) * 0.32;
  vec2 d = p.xy - uMouse.xy;
  float f = smoothstep(1.6, 0.0, length(d)) * uMouseF;
  p.xy += normalize(d + 1e-4) * f * 0.85;
  p.z += f * 0.7;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float foco = uFoco < -0.5 ? 1.0 : (abs(aGrupo - uFoco) < 0.5 ? 1.75 : 0.32);
  gl_PointSize = uSize * aSize * uPx * (1.0 / -mv.z) * (1.0 + f * 0.8) * (foco > 1.0 ? 1.25 : 1.0);
  vec3 c = mix(aColFrom, aColTo, e);
  c = mix(c, uTinte, uTinteMix);
  vCol = c * foco;
  vA = uDim * (0.5 + 0.5 * aSize);
}`;

const FRAG = /* glsl */`
varying vec3 vCol;
varying float vA;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.0, d);
  a *= a;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vCol * a * vA, a * vA);
}`;

/* ---------------------------------------------------------------- ESCENA */
function movil() { return window.matchMedia("(max-width: 760px)").matches; }
function quietud() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

class Escena {
  constructor(canvas, o) {
    const T = THREE;
    this.canvas = canvas;
    this.movil = movil();
    this.quieto = quietud();
    this.n = o.n || (this.movil ? 1600 : 4200);
    if (this.movil && o.n) this.n = Math.round(o.n * 0.45);
    this.cursor = o.cursor !== false && !this.quieto && window.matchMedia("(hover:hover)").matches;
    this.desplazar = o.desplazar !== false; // x del encuadre (hueco para texto)

    this.renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
    this.dpr = Math.min(window.devicePixelRatio || 1, this.movil ? 1.3 : 1.75);
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setClearColor(0x000000, 0);
    this.scene = new T.Scene();
    this.camera = new T.PerspectiveCamera(40, 1, 0.1, 100);
    this.camera.position.set(0, 0, 12);
    this.grupo = new T.Group();
    this.scene.add(this.grupo);

    const n = this.n;
    this.cache = {};
    const geo = new T.BufferGeometry();
    const inicio = this._forma(o.desde || "polvo");
    this.aFrom = new Float32Array(inicio.pos); this.aTo = new Float32Array(inicio.pos);
    this.aColFrom = new Float32Array(inicio.col); this.aColTo = new Float32Array(inicio.col);
    this.aGrupo = new Float32Array(inicio.grupo);
    const fase = new Float32Array(n), size = new Float32Array(n);
    for (let i = 0; i < n; i++) { fase[i] = ruido(i, 90); size[i] = 0.55 + ruido(i, 91) * 0.9 + (ruido(i, 92) > 0.985 ? 1.4 : 0); }
    this.fase = fase;
    geo.setAttribute("position", new T.BufferAttribute(new Float32Array(n * 3), 3)); // requerido por three; no se usa
    this.atr = {
      aFrom: new T.BufferAttribute(this.aFrom, 3), aTo: new T.BufferAttribute(this.aTo, 3),
      aColFrom: new T.BufferAttribute(this.aColFrom, 3), aColTo: new T.BufferAttribute(this.aColTo, 3),
      aGrupo: new T.BufferAttribute(this.aGrupo, 1),
    };
    for (const k in this.atr) geo.setAttribute(k, this.atr[k]);
    geo.setAttribute("aFase", new T.BufferAttribute(fase, 1));
    geo.setAttribute("aSize", new T.BufferAttribute(size, 1));
    geo.boundingSphere = new T.Sphere(new T.Vector3(), 30);

    const tinte = o.tinte != null ? new T.Color(o.tinte) : new T.Color(0x5b8cff);
    this.u = {
      uT: { value: 1 }, uTime: { value: 0 }, uPx: { value: 1 }, uSize: { value: o.size || (this.movil ? 5.6 : 4.6) },
      uAgita: { value: 0 }, uFoco: { value: -1 }, uOla: { value: 0 }, uDim: { value: o.dim != null ? o.dim : 1 },
      uTinte: { value: new T.Vector3(tinte.r, tinte.g, tinte.b) }, uTinteMix: { value: o.tinte != null ? (o.tinteMix || 0.45) : 0 },
      uMouse: { value: new T.Vector3(99, 99, 0) }, uMouseF: { value: 0 },
    };
    const mat = new T.ShaderMaterial({
      uniforms: this.u, vertexShader: VERT, fragmentShader: FRAG,
      transparent: true, depthWrite: false, blending: T.AdditiveBlending,
    });
    this.puntos = new T.Points(geo, mat);
    this.puntos.frustumCulled = false;
    this.grupo.add(this.puntos);

    const lg = new T.BufferGeometry();
    this.lineaPos = new Float32Array(2400 * 3);
    this.lineaCol = new Float32Array(2400 * 3);
    lg.setAttribute("position", new T.BufferAttribute(this.lineaPos, 3));
    lg.setAttribute("color", new T.BufferAttribute(this.lineaCol, 3));
    lg.setDrawRange(0, 0);
    this.lineas = new T.LineSegments(lg, new T.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending,
    }));
    this.lineas.frustumCulled = false;
    this.grupo.add(this.lineas);
    this.lineaAlfa = 0;

    this.actual = o.desde || "polvo";
    this.cam = Object.assign({}, ENCUADRE[this.actual]);
    this.camObj = Object.assign({}, this.cam);
    this.extra = { ry: 0, rx: 0, z: 0 };
    this.giro = 0;
    this.morph = { t0: 0, dur: 1, activo: false };
    this.mouse = { x: 99, y: 99, obj: 0, f: 0 };
    this.visible = true;
    this.oculta = false;
    this.rafId = null;
    this.ultimo = 0;
    this._resize();
  }

  _forma(nombre) {
    if (!this.cache[nombre]) {
      const gen = FORMAS[nombre] || FORMAS.polvo;
      this.cache[nombre] = gen(this.n);
      this.cache[nombre].nombre = nombre;
    }
    return this.cache[nombre];
  }

  _resize() {
    const c = this.canvas;
    const w = c.clientWidth || (c.parentElement && c.parentElement.clientWidth) || 0;
    const h = c.clientHeight || (c.parentElement && c.parentElement.clientHeight) || 0;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.u.uPx.value = h * this.dpr * 0.5 / Math.tan((this.camera.fov * Math.PI) / 360) * 0.02;
    this.estrecho = w / h < 1.05;
    if (this.quieto) this.pintar();
  }

  /* Fotografía la posición actual (misma fórmula que el shader, sin ruido). */
  _foto() {
    const t = this.u.uT.value, n = this.n;
    for (let i = 0; i < n; i++) {
      let k = (t - this.fase[i] * 0.45) / 0.55; k = k < 0 ? 0 : k > 1 ? 1 : k;
      const e = k * k * (3 - 2 * k);
      for (let c = 0; c < 3; c++) {
        const j = i * 3 + c;
        this.aFrom[j] = this.aFrom[j] + (this.aTo[j] - this.aFrom[j]) * e;
        this.aColFrom[j] = this.aColFrom[j] + (this.aColTo[j] - this.aColFrom[j]) * e;
      }
    }
  }

  irA(nombre, dur) {
    if (nombre === this.actual && (this.morph.activo || this.u.uT.value >= 1)) return;
    const f = this._forma(nombre);
    this._foto();
    this.aTo.set(f.pos); this.aColTo.set(f.col); this.aGrupo.set(f.grupo);
    for (const k in this.atr) this.atr[k].needsUpdate = true;
    this.actual = nombre;
    this.camObj = Object.assign({}, ENCUADRE[nombre] || ENCUADRE.polvo);
    this.u.uOla.value = nombre === "horizonte" ? 1 : 0;
    this._lineasDe(f);
    this.lineaAlfa = 0;
    if (this.quieto) {
      this.u.uT.value = 1; this.cam = Object.assign({}, this.camObj); this.lineaAlfa = 1;
      this.pintar();
      return;
    }
    this.u.uT.value = 0;
    this.morph = { t0: performance.now(), dur: (dur || 1.9) * 1000, activo: true };
    this.arrancar();
  }

  _lineasDe(f) {
    if (!f.lineas) { this.nLineas = 0; this.lineas.geometry.setDrawRange(0, 0); return; }
    if (!f._pares) f._pares = f.lineas(f.pos, f.grupo);
    const pr = f._pares;
    let k = 0;
    const max = this.lineaPos.length / 6;
    if (pr.explicitas) {
      for (const s of pr.explicitas) {
        if (k >= max) break;
        const c = rgb(DEPTOS[s.k]);
        this.lineaPos.set(s.a, k * 6); this.lineaPos.set(s.b, k * 6 + 3);
        this.lineaCol.set(c, k * 6); this.lineaCol.set(c, k * 6 + 3);
        k++;
      }
    } else {
      for (let q = 0; q < pr.length && k < max; q += 2, k++) {
        const a = pr[q], b = pr[q + 1];
        this.lineaPos.set([f.pos[a * 3], f.pos[a * 3 + 1], f.pos[a * 3 + 2]], k * 6);
        this.lineaPos.set([f.pos[b * 3], f.pos[b * 3 + 1], f.pos[b * 3 + 2]], k * 6 + 3);
        this.lineaCol.set([f.col[a * 3], f.col[a * 3 + 1], f.col[a * 3 + 2]], k * 6);
        this.lineaCol.set([f.col[b * 3], f.col[b * 3 + 1], f.col[b * 3 + 2]], k * 6 + 3);
      }
    }
    this.nLineas = k;
    const g = this.lineas.geometry;
    g.setDrawRange(0, k * 2);
    g.attributes.position.needsUpdate = true;
    g.attributes.color.needsUpdate = true;
  }

  setFoco(i) { this.u.uFoco.value = i == null ? -1 : i; if (this.quieto) this.pintar(); }
  setExtra(e) { Object.assign(this.extra, e); if (this.quieto) this.pintar(); }
  setDim(d) { this.u.uDim.value = d; if (this.quieto) this.pintar(); }
  setAgita(a) { this.u.uAgita.value = Math.min(1, Math.abs(a)); }

  setCursor(clientX, clientY) {
    if (!this.cursor) return;
    const r = this.canvas.getBoundingClientRect();
    if (!r.width) return;
    const T = THREE;
    const nx = ((clientX - r.left) / r.width) * 2 - 1, ny = -((clientY - r.top) / r.height) * 2 + 1;
    const v = new T.Vector3(nx, ny, 0.5).unproject(this.camera);
    const dir = v.sub(this.camera.position).normalize();
    // Intersección con el plano z=0 del GRUPO (rotado): se lleva el rayo a
    // espacio local y se corta allí.
    const inv = new T.Matrix4().copy(this.grupo.matrixWorld).invert();
    const o = this.camera.position.clone().applyMatrix4(inv);
    const d = dir.transformDirection(inv);
    if (Math.abs(d.z) < 1e-4) return;
    const t = -o.z / d.z;
    this.mouse.x = o.x + d.x * t; this.mouse.y = o.y + d.y * t;
    this.mouse.obj = 1;
    this.arrancar();
  }
  soltarCursor() { this.mouse.obj = 0; }

  _paso(ahora) {
    const dt = Math.min(0.05, (ahora - (this.ultimo || ahora)) / 1000);
    this.ultimo = ahora;
    this.u.uTime.value = ahora / 1000;
    if (this.morph.activo) {
      const t = (ahora - this.morph.t0) / this.morph.dur;
      this.u.uT.value = Math.min(1, t);
      if (t >= 1) this.morph.activo = false;
    }
    const s = 1 - Math.pow(0.0025, dt); // amortiguación independiente de fps
    const objX = this.desplazar && !this.estrecho ? this.camObj.x : 0;
    this.cam.z += (this.camObj.z - this.cam.z) * s;
    this.cam.rx += (this.camObj.rx - this.cam.rx) * s;
    this.cam.ry += (this.camObj.ry - this.cam.ry) * s;
    this.cam.x += (objX - this.cam.x) * s;
    this.giro += dt * (this.actual === "nucleo" || this.actual === "punto" ? 0.09 : 0.025);
    this.mouse.f += (this.mouse.obj - this.mouse.f) * s;
    this.u.uMouse.value.set(this.mouse.x, this.mouse.y, 0);
    this.u.uMouseF.value = this.mouse.f;
    this.u.uAgita.value *= 0.92;
    const done = this.u.uT.value >= 1 ? 1 : 0;
    this.lineaAlfa += ((done ? 1 : 0) - this.lineaAlfa) * (1 - Math.pow(0.05, dt));
    this._aplicarCamara();
  }

  _aplicarCamara() {
    this.camera.position.set(0, 0, this.cam.z + this.extra.z);
    this.grupo.position.x = this.cam.x;
    this.grupo.rotation.x = this.cam.rx + this.extra.rx;
    this.grupo.rotation.y = this.cam.ry + this.extra.ry + (this.quieto ? 0 : this.giro);
    this.lineas.material.opacity = 0.2 * this.lineaAlfa * this.u.uDim.value;
    this.grupo.updateMatrixWorld();
  }

  pintar() {
    if (this.quieto) { this.cam = Object.assign({}, this.camObj); if (!this.desplazar || this.estrecho) this.cam.x = 0; this.lineaAlfa = 1; this._aplicarCamara(); }
    this.renderer.render(this.scene, this.camera);
  }

  _tick(ahora) {
    this.rafId = null;
    if (!this.visible || this.oculta || this.quieto) return;
    this._paso(ahora);
    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame((t) => this._tick(t));
  }

  arrancar() {
    if (this.quieto) { this.pintar(); return; }
    if (this.rafId == null && this.visible && !this.oculta) this.rafId = requestAnimationFrame((t) => this._tick(t));
  }
  parar() { if (this.rafId != null) { cancelAnimationFrame(this.rafId); this.rafId = null; } }

  destruir() {
    this.parar();
    this.puntos.geometry.dispose(); this.puntos.material.dispose();
    this.lineas.geometry.dispose(); this.lineas.material.dispose();
    this.renderer.dispose();
  }
}

/**
 * Monta una escena en un <canvas>.
 * opts: { forma, desde, n, tinte, tinteMix, dim, cursor, desplazar, observar }
 * Devuelve un control: irA(forma), setFoco(i|null), setExtra({rx,ry,z}),
 * setDim(d), setAgita(v), setCursor(x,y), soltarCursor(), destruir().
 */
export async function montarEscena(canvas, opts = {}) {
  await cargarMotor();
  const e = new Escena(canvas, opts);
  const ro = new ResizeObserver(() => e._resize());
  ro.observe(canvas.parentElement || canvas);
  let io = null;
  if (opts.observar !== false) {
    io = new IntersectionObserver((en) => {
      for (const x of en) { e.visible = x.isIntersecting; if (x.isIntersecting) e.arrancar(); else e.parar(); }
    }, { threshold: 0 });
    io.observe(canvas);
  }
  const vis = () => { e.oculta = document.hidden; if (!e.oculta) e.arrancar(); else e.parar(); };
  document.addEventListener("visibilitychange", vis);
  if (opts.forma) e.irA(opts.forma, opts.durInicial || 2.6); else e.pintar();
  return {
    irA: (f, d) => e.irA(f, d),
    setFoco: (i) => e.setFoco(i),
    setExtra: (x) => e.setExtra(x),
    setDim: (d) => e.setDim(d),
    setAgita: (v) => e.setAgita(v),
    setCursor: (x, y) => e.setCursor(x, y),
    soltarCursor: () => e.soltarCursor(),
    get forma() { return e.actual; },
    destruir() {
      ro.disconnect(); io && io.disconnect();
      document.removeEventListener("visibilitychange", vis);
      e.destruir();
    },
  };
}

/** Compatibilidad con la v10: escena de capas guiada por progreso. */
export async function montarEscenaSistema(canvas, opts = {}) {
  const c = await montarEscena(canvas, { forma: "capas", desde: "polvo" });
  const on = () => opts.progressSource && c.setExtra({ ry: opts.progressSource() * 0.6 });
  window.addEventListener("scroll", on, { passive: true });
  return { setProgress: (p) => c.setExtra({ ry: p * 0.6 }), destruir() { window.removeEventListener("scroll", on); c.destruir(); } };
}

export function webglDisponible() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch (e) {
    return false;
  }
}
