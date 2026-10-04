/* ==========================================================================
   EL SALTO · el valle
   --------------------------------------------------------------------------
   Un río baja por una garganta de montaña, cae cuarenta y cinco metros en un
   salto y sigue hacia un valle abierto. Todo sale de una función de altura,
   sin ficheros de modelo. Unidades: metros. X cruza el valle, Y sube, Z sigue
   el río (aguas abajo es +Z). El salto está en z ≈ −28.
   ========================================================================== */
import { fbm, erosion, valor, suave, mezcla } from "./ruido.js";

export const COTA = { labio: 45, corona: 120, pie: 0 };          // cota del río arriba del salto, de la coronación de la presa y del pie
export const PRESA = { z0: -72, R: 112, medio: 0.86 };           // arco: cara de aguas arriba en z0 (en x = 0), radio, medio ángulo
/* De dónde viene el sol, en planta. A: de aguas arriba, a contraluz (el salto sin domar). B: de aguas abajo, de frente al muro (con la presa). */
const uni = (x, z) => { const l = Math.hypot(x, z); return [x / l, z / l]; };
export const SOL_AZ = { A: uni(0.42, -0.91), B: uni(0.62, 0.78) };

export const eje = (z) => suave(160, 720, Math.abs(z + 20)) * (74 * Math.sin(z * 0.0019 + 0.7) + 40 * Math.sin(z * 0.0043 + 2.1));
export function lecho(z) {
  const arriba = COTA.labio + Math.max(0, -(z + 30)) * 0.011 + Math.max(0, -1300 - z) * 0.07;
  const abajo = -Math.max(0, z - 70) * 0.007 - 7 * Math.exp(-((z - 8) * (z - 8)) / 900);
  const t = suave(-36, -23, z);
  return arriba + (abajo - arriba) * t;
}
/* El labio del salto no es una línea recta: entra y sale según por dónde ha roto la roca. */
export const labio = (x) => (fbm(x * 0.03 + 1.3, 2.2, 3) - 0.5) * 34 + (fbm(x * 0.11, 7.7, 2) - 0.5) * 9;
export const ancho = (z) => 40 + 250 * suave(110, 1000, -z - 60) + 34 * suave(40, 400, z) + 640 * suave(800, 2500, z);

export function altura(x, z) {
  let d = Math.abs(x - eje(z)) - ancho(z);
  const l = lecho(z - labio(x) * (1 - suave(0, 26, d)));
  const fino = fbm(x * 0.045, z * 0.045, 4);
  if (d <= 0) return l + (fino - 0.5) * (z > 900 ? 3.0 : 1.6) + 0.9 * Math.max(0, 1 + d / 12) * (valor(x * 0.21, z * 0.21) - 0.3);
  const g = 1 - suave(230, 950, Math.abs(z + 25));                 // cuánto de garganta: 1 en el salto, 0 lejos
  // las paredes no son lisas: entran y salen, con contrafuertes y repisas
  const junto = 0.3 + 0.7 * suave(40, 150, Math.abs(z + 62));     // menos donde apoya la presa
  const w = ((fbm(x * 0.012 + 7.3, z * 0.012, 3) - 0.5) * 70 + (fbm(x * 0.05, z * 0.05 + 3.1, 3) - 0.5) * 20) * junto;
  d = Math.max(0, d + w * Math.min(1, d / 16 + 0.25));
  const A = mezcla(58, 122, g), s = mezcla(95, 44, g);
  let h = A * (1 - Math.exp(-d / s)) + d * mezcla(0.34, 0.5, g);
  h += 3.4 * Math.sin(h * 0.21 + fino * 5) * Math.min(1, d / 14) * g;   // estratos: tramos casi verticales y repisas
  h += l + (fino - 0.5) * 11 * Math.min(1, d / 18);
  h += (erosion(x * 0.0062 + 9.2, z * 0.0062 + 4.4, 6) - 0.25) * 80 * Math.min(1, d / 60);   // barrancos en las laderas
  const m = Math.min(1, d / 460);
  h += erosion(x * 0.00125 + 3.1, z * 0.00125 + 1.7, 9) * 1150 * m * m * (0.5 + 0.3 * g + 0.5 * suave(500, 2200, d));
  h += Math.max(0, -1900 - z) * 0.42;                             // el valle se cierra al fondo
  return h;
}
/* Lo que añade la presa a la altura (para saber qué sombra da cuando está construida) */
export function alturaPresa(x, z) {
  const cz = PRESA.z0 + PRESA.R, r = Math.hypot(x, z - cz);
  if (z < cz && r < PRESA.R + 1 && r > PRESA.R - 9 && Math.abs(Math.atan2(x, cz - z)) < PRESA.medio) return COTA.corona + 1.5;
  return -1e9;
}

/* El mapa de alturas: una rejilla uniforme que se consulta con interpolación (sombras, orilla del agua, niebla). */
export const MAPA = { x0: -2100, x1: 2100, z0: -2700, z1: 3700, nx: 600, nz: 914 };
export function crearMapa() {
  const { x0, x1, z0, z1, nx, nz } = MAPA, d = new Float32Array(nx * nz), kx = (x1 - x0) / (nx - 1), kz = (z1 - z0) / (nz - 1);
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) d[j * nx + i] = altura(x0 + i * kx, z0 + j * kz);
  const leer = (x, z) => {
    let u = (x - x0) / kx, v = (z - z0) / kz; u = u < 0 ? 0 : u > nx - 1.001 ? nx - 1.001 : u; v = v < 0 ? 0 : v > nz - 1.001 ? nz - 1.001 : v;
    const i = u | 0, j = v | 0, fu = u - i, fv = v - j, k = j * nx + i;
    return (d[k] * (1 - fu) + d[k + 1] * fu) * (1 - fv) + (d[k + nx] * (1 - fu) + d[k + nx + 1] * fu) * fv;
  };
  return { datos: d, leer };
}
/* Lo que el material necesita saber de cada punto del terreno, en una textura: la normal (R, G), cuánto cielo ve (B) y la tangente del horizonte hacia el sol (A). */
export function datosTerreno(mapa) {
  const { x0, x1, z0, z1, nx, nz } = MAPA, h = mapa.datos, kx = (x1 - x0) / (nx - 1), kz = (z1 - z0) / (nz - 1), t = new Uint8Array(nx * nz * 4), c8 = (v) => (v < 0 ? 0 : v > 1 ? 255 : (v * 255 + 0.5) | 0);
  for (let j = 0, k = 0; j < nz; j++) for (let i = 0; i < nx; i++, k++) {
    const a = h[j * nx + Math.max(0, i - 1)], b = h[j * nx + Math.min(nx - 1, i + 1)], c = h[Math.max(0, j - 1) * nx + i], e = h[Math.min(nz - 1, j + 1) * nx + i];
    let px = (a - b) / (2 * kx), pz = (c - e) / (2 * kz); const l = Math.hypot(px, 1, pz); px /= l; pz /= l;
    const x = x0 + i * kx, z = z0 + j * kz, y = h[k];
    let s = 0; for (let q = 0; q < 8; q++) { const cq = Math.cos(q * 0.7854), sq = Math.sin(q * 0.7854); s += Math.max(0, mapa.leer(x + cq * 26, z + sq * 26) - y) / 26 + Math.max(0, mapa.leer(x + cq * 95, z + sq * 95) - y) / 95; }
    t[k * 4] = c8(px * 0.5 + 0.5); t[k * 4 + 1] = c8(pz * 0.5 + 0.5); t[k * 4 + 2] = c8(Math.max(0.2, 1 - s * 0.08)); t[k * 4 + 3] = c8((horizonte(mapa, x, y + 1.5, z, true, SOL_AZ.B) + 0.25) / 1.75);
  }
  return t;
}
/* Tangente del ángulo mínimo al que el sol alcanza un punto (lo que tapan las montañas hacia el sol) */
export function horizonte(mapa, x, y, z, conPresa, az = SOL_AZ.B) {
  let t = -1;
  for (let i = 0, dist = 5; i < 24; i++, dist *= 1.31) {
    const px = x + az[0] * dist, pz = z + az[1] * dist;
    let h = mapa.leer(px, pz); if (conPresa) { const hp = alturaPresa(px, pz); if (hp > h) h = hp; }
    const v = (h - y) / dist; if (v > t) t = v;
  }
  return t;
}
const curva = (u) => Math.sign(u) * (0.17 * Math.abs(u) + 0.83 * Math.pow(Math.abs(u), 2.7));

/* La malla del terreno: fina junto al salto, cada vez más abierta hacia las montañas. */
export function geometriaTerreno(mapa, nx = 320, nz = 440) {
  const n = (nx + 1) * (nz + 1), pos = new Float32Array(n * 3), hor = new Float32Array(n * 2);
  for (let j = 0, k = 0; j <= nz; j++) {
    const v = (j / nz) * 2 - 1, z = -20 + (v < 0 ? 2640 : 3680) * curva(v);
    for (let i = 0; i <= nx; i++, k++) {
      const u = (i / nx) * 2 - 1, x = 2060 * curva(u), y = altura(x, z);
      pos[k * 3] = x; pos[k * 3 + 1] = y; pos[k * 3 + 2] = z;
      hor[k * 2] = horizonte(mapa, x, y + 1.2, z, false, SOL_AZ.A); hor[k * 2 + 1] = horizonte(mapa, x, y + 1.2, z, true, SOL_AZ.B);
    }
  }
  const ind = new Uint32Array(nx * nz * 6);
  for (let j = 0, q = 0; j < nz; j++) for (let i = 0; i < nx; i++) { const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1; ind[q++] = a; ind[q++] = c; ind[q++] = b; ind[q++] = b; ind[q++] = c; ind[q++] = d; }
  return { pos, hor, ind };
}
