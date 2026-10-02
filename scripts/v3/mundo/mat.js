/* Matemáticas mínimas del mundo (columnas, como WebGL). Sin dependencias. */
export const M4 = () => new Float32Array(16);
export function perspectiva(o, fovY, aspecto, cerca, lejos) {
  const f = 1 / Math.tan(fovY / 2), n = 1 / (cerca - lejos);
  o.fill(0); o[0] = f / aspecto; o[5] = f; o[10] = (lejos + cerca) * n; o[11] = -1; o[14] = 2 * lejos * cerca * n; return o;
}
export function mirar(o, ex, ey, ez, cx, cy, cz, ux, uy, uz) {
  let zx = ex - cx, zy = ey - cy, zz = ez - cz, l = Math.hypot(zx, zy, zz) || 1; zx /= l; zy /= l; zz /= l;
  let xx = uy * zz - uz * zy, xy = uz * zx - ux * zz, xz = ux * zy - uy * zx; l = Math.hypot(xx, xy, xz) || 1; xx /= l; xy /= l; xz /= l;
  const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
  o[0] = xx; o[1] = yx; o[2] = zx; o[3] = 0; o[4] = xy; o[5] = yy; o[6] = zy; o[7] = 0; o[8] = xz; o[9] = yz; o[10] = zz; o[11] = 0;
  o[12] = -(xx * ex + xy * ey + xz * ez); o[13] = -(yx * ex + yy * ey + yz * ez); o[14] = -(zx * ex + zy * ey + zz * ez); o[15] = 1; return o;
}
export function mul(o, a, b) {
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
  return o;
}
export function invertir(o, m) {
  const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3], a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7], a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11], a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];
  const b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12;
  const b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
  let d = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06; if (!d) return null; d = 1 / d;
  o[0] = (a11 * b11 - a12 * b10 + a13 * b09) * d; o[1] = (a02 * b10 - a01 * b11 - a03 * b09) * d; o[2] = (a31 * b05 - a32 * b04 + a33 * b03) * d; o[3] = (a22 * b04 - a21 * b05 - a23 * b03) * d;
  o[4] = (a12 * b08 - a10 * b11 - a13 * b07) * d; o[5] = (a00 * b11 - a02 * b08 + a03 * b07) * d; o[6] = (a32 * b02 - a30 * b05 - a33 * b01) * d; o[7] = (a20 * b05 - a22 * b02 + a23 * b01) * d;
  o[8] = (a10 * b10 - a11 * b08 + a13 * b06) * d; o[9] = (a01 * b08 - a00 * b10 - a03 * b06) * d; o[10] = (a30 * b04 - a31 * b02 + a33 * b00) * d; o[11] = (a21 * b02 - a20 * b04 - a23 * b00) * d;
  o[12] = (a11 * b07 - a10 * b09 - a12 * b06) * d; o[13] = (a00 * b09 - a01 * b07 + a02 * b06) * d; o[14] = (a31 * b01 - a30 * b03 - a32 * b00) * d; o[15] = (a20 * b03 - a21 * b01 + a22 * b00) * d; return o;
}
// cuaterniones [x, y, z, w] escritos en un array a partir de `k`
export function qEje(o, k, ax, ay, az, ang) { const s = Math.sin(ang / 2); o[k] = ax * s; o[k + 1] = ay * s; o[k + 2] = az * s; o[k + 3] = Math.cos(ang / 2); }
export function qMul(o, k, a, ka, b, kb) {
  const ax = a[ka], ay = a[ka + 1], az = a[ka + 2], aw = a[ka + 3], bx = b[kb], by = b[kb + 1], bz = b[kb + 2], bw = b[kb + 3];
  o[k] = aw * bx + ax * bw + ay * bz - az * by; o[k + 1] = aw * by - ax * bz + ay * bw + az * bx; o[k + 2] = aw * bz + ax * by - ay * bx + az * bw; o[k + 3] = aw * bw - ax * bx - ay * by - az * bz;
}
// mezcla normalizada (nlerp) por el camino corto
export function qMezcla(o, k, a, ka, b, kb, t) {
  let bx = b[kb], by = b[kb + 1], bz = b[kb + 2], bw = b[kb + 3];
  if (a[ka] * bx + a[ka + 1] * by + a[ka + 2] * bz + a[ka + 3] * bw < 0) { bx = -bx; by = -by; bz = -bz; bw = -bw; }
  const x = a[ka] + (bx - a[ka]) * t, y = a[ka + 1] + (by - a[ka + 1]) * t, z = a[ka + 2] + (bz - a[ka + 2]) * t, w = a[ka + 3] + (bw - a[ka + 3]) * t, l = 1 / (Math.hypot(x, y, z, w) || 1);
  o[k] = x * l; o[k + 1] = y * l; o[k + 2] = z * l; o[k + 3] = w * l;
}
export const fijar = (x, a, b) => (x < a ? a : x > b ? b : x);
export const mezcla = (a, b, t) => a + (b - a) * t;
export const suave = (a, b, x) => { const t = fijar((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
export const cubica = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export function azar(semilla) { let a = semilla >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
