/* ==========================================================================
   EL SALTO · ruido
   --------------------------------------------------------------------------
   Ruido de valor con semilla fija (el mundo sale igual en todos los aparatos):
   suma de octavas, crestas para las montañas y una textura repetible que los
   materiales leen en vez de calcular ruido en cada punto de la pantalla.
   ========================================================================== */
const P = new Uint8Array(512);
{ let s = 20261004; const azar = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); const a = Array.from({ length: 256 }, (_, i) => i); for (let i = 255; i > 0; i--) { const j = (azar() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } for (let i = 0; i < 512; i++) P[i] = a[i & 255]; }
const red = (ix, iz) => P[(P[ix & 255] + iz) & 255] / 255;
const q5 = (t) => t * t * t * (t * (t * 6 - 15) + 10);

export function valor(x, z) {
  const ix = Math.floor(x), iz = Math.floor(z), fx = q5(x - ix), fz = q5(z - iz);
  const a = red(ix, iz), b = red(ix + 1, iz), c = red(ix, iz + 1), d = red(ix + 1, iz + 1);
  return a + (b - a) * fx + (c - a) * fz + (a - b - c + d) * fx * fz;
}
export function fbm(x, z, oct = 5) { let s = 0, a = 0.5, n = 0; for (let i = 0; i < oct; i++) { s += a * valor(x, z); n += a; a *= 0.5; const t = x * 1.6 - z * 1.2; z = x * 1.2 + z * 1.6; x = t; } return s / n; }
/* Crestas: montañas con aristas. Cada octava pesa más donde la anterior ya era alta. */
export function crestas(x, z, oct = 6) {
  let s = 0, a = 0.5, peso = 1, n = 0;
  for (let i = 0; i < oct; i++) { let v = 1 - Math.abs(valor(x, z) * 2 - 1); v *= v; s += v * a * peso; n += a; peso = Math.min(1, v * 1.8 + 0.15); a *= 0.5; const t = x * 1.6 - z * 1.2; z = x * 1.2 + z * 1.6; x = t; }
  return s / n;
}
/* Ruido con su pendiente, y la suma «erosionada»: donde el terreno ya tiene pendiente, las octavas finas pesan menos. Da laderas con barrancos en vez de dunas. */
const D = [0, 0, 0];
function valorD(x, z) {
  const ix = Math.floor(x), iz = Math.floor(z), tx = x - ix, tz = z - iz, u = q5(tx), w = q5(tz), du = 30 * tx * tx * (tx - 1) * (tx - 1), dw = 30 * tz * tz * (tz - 1) * (tz - 1);
  const a = red(ix, iz), b = red(ix + 1, iz), c = red(ix, iz + 1), d = red(ix + 1, iz + 1), k1 = b - a, k2 = c - a, k4 = a - b - c + d;
  D[0] = a + k1 * u + k2 * w + k4 * u * w; D[1] = du * (k1 + k4 * w); D[2] = dw * (k2 + k4 * u);
}
export function erosion(x, z, oct = 8) {
  let s = 0, b = 1, dx = 0, dz = 0, n = 0;
  for (let i = 0; i < oct; i++) { valorD(x, z); dx += D[1]; dz += D[2]; s += (b * D[0]) / (1 + dx * dx + dz * dz); n += b; b *= 0.5; const t = x * 1.6 - z * 1.2; z = x * 1.2 + z * 1.6; x = t; }
  return s / n;
}
export const suave = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
export const mezcla = (a, b, t) => a + (b - a) * t;

/* Textura de ruido repetible, 256 × 256. R: nubes de 5 octavas · G, B: su pendiente (para dar relieve sin calcularlo) · A: otra nube, más menuda. */
export function datosRuido(n = 256) {
  const per = (x, z, p) => { const ix = Math.floor(x), iz = Math.floor(z), fx = q5(x - ix), fz = q5(z - iz), m = (v) => ((v % p) + p) % p; const a = red(m(ix), m(iz) + 7 * p), b = red(m(ix + 1), m(iz) + 7 * p), c = red(m(ix), m(iz + 1) + 7 * p), d = red(m(ix + 1), m(iz + 1) + 7 * p); return a + (b - a) * fx + (c - a) * fz + (a - b - c + d) * fx * fz; };
  const nube = (u, v, p0, oct) => { let s = 0, a = 0.5, t = 0, p = p0; for (let i = 0; i < oct; i++) { s += a * per(u * p, v * p, p); t += a; a *= 0.5; p *= 2; } return s / t; };
  const f = new Float32Array(n * n), g = new Float32Array(n * n);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { f[j * n + i] = nube(i / n, j / n, 4, 6); g[j * n + i] = nube(i / n + 0.37, j / n + 0.11, 8, 5); }
  const d = new Uint8Array(n * n * 4), c8 = (v) => Math.max(0, Math.min(255, Math.round(v * 255)));
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const k = j * n + i, dx = f[j * n + ((i + 1) % n)] - f[j * n + ((i + n - 1) % n)], dz = f[((j + 1) % n) * n + i] - f[((j + n - 1) % n) * n + i];
    d[k * 4] = c8((f[k] - 0.5) * 1.9 + 0.5); d[k * 4 + 1] = c8(dx * 14 + 0.5); d[k * 4 + 2] = c8(dz * 14 + 0.5); d[k * 4 + 3] = c8((g[k] - 0.5) * 2.1 + 0.5);
  }
  return d;
}
