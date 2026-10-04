/* ==========================================================================
   EL SALTO · el agua
   --------------------------------------------------------------------------
   El río es una cinta que sigue el cauce (y cae con él en el salto); la bruma
   son manchas blandas que suben del pie de la caída y bancos de niebla que se
   quedan en el fondo del valle.
   ========================================================================== */
import { eje, lecho, ancho, labio, horizonte, SOL_AZ } from "./terreno.js";
import { suave, fbm } from "./ruido.js";

export function geometriaRio(mapa) {
  const filas = []; let z = -2500;
  while (z < 3650) { filas.push(z); const dz = z > -62 && z < 4 ? 0.9 : Math.abs(z + 25) < 240 ? 3.2 : Math.abs(z) < 900 ? 9 : 22; z += dz; }
  const C = 16, n = filas.length * (C + 1), pos = new Float32Array(n * 3), rio = new Float32Array(n * 3), hor = new Float32Array(n * 2);
  const largo = new Float32Array(C + 1), yPrev = new Float32Array(C + 1), vuelo = new Float32Array(C + 1);
  for (let j = 0, k = 0; j < filas.length; j++) {
    const zz = filas[j], dz = j ? zz - filas[j - 1] : 1, w = Math.min(ancho(zz) * 0.95, 50 + 26 * suave(300, 1200, zz)), cx = eje(zz);
    for (let i = 0; i <= C; i++, k++) {
      const u = (i / C) * 2 - 1, x = cx + u * w, y0 = lecho(zz - labio(x)), dy = j ? yPrev[i] - y0 : 0; yPrev[i] = y0;
      largo[i] += Math.hypot(dy, dz);
      const cae = suave(0.35, 2.2, dy / dz);
      // en la caída el agua sale despedida y no baja pegada a la roca
      vuelo[i] = Math.max(vuelo[i] * (y0 < 2 ? 0.9 : 1), cae * (6 + 8 * fbm(u * 2.3 + 4, 1.5, 3)));
      pos[k * 3] = x; pos[k * 3 + 1] = y0 + 1.1 - u * u * 0.7 + cae * 1.5; pos[k * 3 + 2] = zz + vuelo[i];
      rio[k * 3] = u; rio[k * 3 + 1] = largo[i]; rio[k * 3 + 2] = cae;
      hor[k * 2] = horizonte(mapa, x, y0 + 2, zz, false, SOL_AZ.A); hor[k * 2 + 1] = horizonte(mapa, x, y0 + 2, zz, true, SOL_AZ.B);
    }
  }
  const ind = new Uint32Array((filas.length - 1) * C * 6);
  for (let j = 0, q = 0; j < filas.length - 1; j++) for (let i = 0; i < C; i++) { const a = j * (C + 1) + i, b = a + 1, c = a + C + 1, d = c + 1; ind[q++] = a; ind[q++] = c; ind[q++] = b; ind[q++] = b; ind[q++] = c; ind[q++] = d; }
  return { pos, rio, hor, ind };
}

/* Rocío del salto: [base x, y, z] y [tamaño, semilla, ritmo, cuánto sube] por mancha. */
export function datosBruma(n = 150) {
  let s = 77; const azar = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const base = new Float32Array(n * 3), dat = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    const grande = i % 5 === 0, x = (azar() * 2 - 1) * 40, z = -20 + azar() * (grande ? 60 : 26);
    base.set([x, -6 + azar() * 8, z], i * 3); dat.set([grande ? 30 + azar() * 36 : 9 + azar() * 16, azar(), 0.05 + azar() * 0.07, grande ? 30 + azar() * 60 : 14 + azar() * 34], i * 4);
  }
  return { base, dat, n };
}
