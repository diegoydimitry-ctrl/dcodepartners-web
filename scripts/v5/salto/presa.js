/* ==========================================================================
   EL SALTO · la presa
   --------------------------------------------------------------------------
   Una presa de arco sobre el labio del salto. Se construye por bloques (cada
   bloque sube a su ritmo, como en una obra de verdad) y, cuando llega a la
   coronación, se le ponen cinco compuertas, la pasarela, las farolas, la torre
   de toma, las tuberías y la central al pie.
   El cuerpo de la presa se dibuja en coordenadas de arco (ángulo, altura) y es
   el material quien lo coloca: así la altura de obra se cambia sin tocar la malla.
   ========================================================================== */
import { PRESA, COTA, horizonte, eje, ancho, lecho } from "./terreno.js";

export const CZ = PRESA.z0 + PRESA.R;                 // centro del arco
export const BASE = 30, VANO = 111;                    // cota de cimientos y del labio de los aliviaderos
export const grosor = (y) => 7 + 17 * Math.pow(Math.max(0, (COTA.corona - y) / (COTA.corona - 38)), 1.4);
export const arco = (ang, r, y) => [r * Math.sin(ang), y, CZ - r * Math.cos(ang)];
const PASO = 17 / PRESA.R;                             // un bloque: 17 m de arco
export const TOMA = { ang: 0.30, y: 70 };
export const bocaToma = () => { const a = TOMA.ang; return { p: arco(a, PRESA.R + 21.8, TOMA.y), n: [Math.sin(a), 0, -Math.cos(a)] }; };
export const VANOS = [-2, -1, 0, 1, 2].map((i) => i * PASO);   // ángulo del centro de cada compuerta
const MEDIO_VANO = 7 / PRESA.R, PILA = 1.5 / PRESA.R;

/* Tiras: cada una es un prisma en el arco [a0, a1] que sube hasta su cota. */
function tiras() {
  const t = [], lado = (PRESA.medio - 2.5 * PASO) / 3;
  let s = 5; const azar = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < 3; i++) for (const sg of [-1, 1]) { const a = 2.5 * PASO + i * lado, b = a + lado; t.push({ a0: sg > 0 ? a : -b, a1: sg > 0 ? b : -a, corona: COTA.corona, azar: azar() }); }
  for (const c of VANOS) { const z = azar(); t.push({ a0: c - PASO / 2, a1: c - MEDIO_VANO, corona: COTA.corona, azar: z }, { a0: c - MEDIO_VANO, a1: c + MEDIO_VANO, corona: VANO, azar: z }, { a0: c + MEDIO_VANO, a1: c + PASO / 2, corona: COTA.corona, azar: z }); }
  return t;
}

/* Malla de la presa. aArco: [ángulo, altura, cara (0 aguas arriba … 1 aguas abajo)] · aTira: [cota, azar, tipo de cara, tangente del horizonte] */
export function geometriaPresa(mapa) {
  const pos = [], arc = [], tir = [], ind = [];
  const v = (ang, y, rf, T, cara) => { const p = arco(ang, PRESA.R - rf * grosor(y), y); pos.push(p[0], p[1], p[2]); arc.push(ang, y, rf); tir.push(T.corona, T.azar, cara, horizonte(mapa, p[0] + (cara === 1 ? 2.5 * Math.sin(-ang) : 0), Math.min(y, 118) + 1, p[2] + (cara === 1 ? 2.5 : 0), false)); return pos.length / 3 - 1; };
  const cuad = (a, b, c, d) => ind.push(a, b, c, b, d, c);
  for (const T of tiras()) {
    const NA = Math.max(1, Math.round((T.a1 - T.a0) / 0.03)), NY = 26;
    for (const cara of [1, 0]) {   // cara de aguas abajo (1) y de aguas arriba (0)
      const g = [];
      for (let j = 0; j <= NY; j++) for (let i = 0; i <= NA; i++) g.push(v(T.a0 + ((T.a1 - T.a0) * i) / NA, BASE + ((T.corona - BASE) * j) / NY, cara, T, cara));
      for (let j = 0; j < NY; j++) for (let i = 0; i < NA; i++) { const a = g[j * (NA + 1) + i], b = a + 1, c = a + NA + 1, d = c + 1; cara ? cuad(a, b, c, d) : cuad(b, a, d, c); }
    }
    { const g = []; for (let k = 0; k <= 2; k++) for (let i = 0; i <= NA; i++) g.push(v(T.a0 + ((T.a1 - T.a0) * i) / NA, T.corona, k / 2, T, 2));   // la tapa
      for (let k = 0; k < 2; k++) for (let i = 0; i < NA; i++) { const a = g[k * (NA + 1) + i], b = a + 1, c = a + NA + 1, d = c + 1; cuad(a, c, b, d); } }
    for (const [ang, cara] of [[T.a0, 3], [T.a1, 4]]) {   // los costados
      const g = []; for (let j = 0; j <= NY; j++) for (let k = 0; k <= 1; k++) g.push(v(ang, BASE + ((T.corona - BASE) * j) / NY, k, T, cara));
      for (let j = 0; j < NY; j++) { const a = g[j * 2], b = a + 1, c = a + 2, d = c + 1; cara === 3 ? cuad(a, b, c, d) : cuad(b, a, d, c); }
    }
  }
  return { pos: new Float32Array(pos), arc: new Float32Array(arc), tir: new Float32Array(tir), ind: new Uint32Array(ind) };
}

/* Obra fija: cajas y cilindros sueltos. aMat: 0 hormigón · 1 acero oscuro · 2 ventana (se enciende de noche) · 3 tubería */
export function crearObra(mapa) {
  const pos = [], nor = [], mat = [], ind = [];
  const caja = (c, t, giro = 0, m = 0) => {
    const [cx, cy, cz] = c, [sx, sy, sz] = t, co = Math.cos(giro), si = Math.sin(giro), base = pos.length / 3;
    const C = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
    C.forEach((n, f) => {
      const u = [n[1], n[2], n[0]], w = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
      for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        const lx = (n[0] + u[0] * a + w[0] * b) * sx * 0.5, ly = (n[1] + u[1] * a + w[1] * b) * sy * 0.5, lz = (n[2] + u[2] * a + w[2] * b) * sz * 0.5;
        pos.push(cx + lx * co + lz * si, cy + ly, cz - lx * si + lz * co); nor.push(n[0] * co + n[2] * si, n[1], -n[0] * si + n[2] * co); mat.push(m);
      }
      const o = base + f * 4; ind.push(o, o + 1, o + 2, o, o + 2, o + 3);
    });
  };
  /* tubo entre dos puntos */
  const tubo = (a, b, r, m = 3, lados = 10) => {
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], l = Math.hypot(...d), e = d.map((x) => x / l), aux = Math.abs(e[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0];
    let u = [e[1] * aux[2] - e[2] * aux[1], e[2] * aux[0] - e[0] * aux[2], e[0] * aux[1] - e[1] * aux[0]]; const lu = Math.hypot(...u); u = u.map((x) => x / lu);
    const w = [e[1] * u[2] - e[2] * u[1], e[2] * u[0] - e[0] * u[2], e[0] * u[1] - e[1] * u[0]], base = pos.length / 3;
    for (let i = 0; i <= lados; i++) { const q = (i / lados) * Math.PI * 2, c = Math.cos(q), s = Math.sin(q), n = [u[0] * c + w[0] * s, u[1] * c + w[1] * s, u[2] * c + w[2] * s]; for (const p of [a, b]) { pos.push(p[0] + n[0] * r, p[1] + n[1] * r, p[2] + n[2] * r); nor.push(...n); mat.push(m); } }
    for (let i = 0; i < lados; i++) { const o = base + i * 2; ind.push(o, o + 2, o + 1, o + 1, o + 2, o + 3); }
  };
  const R = PRESA.R, Y = COTA.corona, faroles = [];
  // pretiles a los dos lados de la coronación, tramo a tramo, y una farola cada 13 m
  const N = 64;
  for (let i = 0; i < N; i++) {
    const a = -PRESA.medio + ((i + 0.5) / N) * PRESA.medio * 2, largo = (PRESA.medio * 2 * R) / N + 0.1;
    for (const r of [R - 0.25, R - 6.75]) { const p = arco(a, r, Y + 0.6); caja(p, [largo, 1.2, 0.4], -a, 0); }
    const p = arco(a, R - 3.5, Y + 0.12); caja(p, [largo, 0.24, 6.3], -a, 0);          // la calzada
    if (i % 4 === 1) { const f = arco(a, R - 6.5, Y + 4.1); caja(f, [0.22, 7, 0.22], -a, 1); const b = arco(a, R - 5.6, Y + 7.5); caja(b, [0.2, 0.16, 2.0], -a, 1); faroles.push(arco(a, R - 4.9, Y + 7.3)); }
  }
  // sobre cada compuerta: pórtico del mecanismo y la hoja de acero (la hoja se mueve aparte)
  for (const c of VANOS) {
    for (const sg of [-1, 1]) { const p = arco(c + sg * (MEDIO_VANO + PILA * 0.5), R - 2.2, Y + 5.4); caja(p, [1.4, 10.8, 3.2], -c, 0); }
    caja(arco(c, R - 2.2, Y + 11.4), [17.4, 1.6, 3.6], -c, 0);
    caja(arco(c, R - 2.2, Y + 12.9), [6, 1.5, 2.6], -c, 1);
  }
  // torre de toma, aguas arriba, con su pasarela; abajo, la boca por donde entra el agua, con su reja
  { const a = TOMA.ang, p = arco(a, R + 16, 86); caja(p, [11, 104, 11], -a, 0); caja(arco(a, R + 16, 141), [13.5, 6, 13.5], -a, 0); caja(arco(a, R + 16, 141.2), [13.7, 2.2, 13.7], -a, 2); caja(arco(a, R + 16, 145), [14.5, 1.2, 14.5], -a, 0);
    caja(arco(a, R + 5.6, Y + 0.4), [3.2, 0.8, 11.6], -a, 0); for (const sg of [-1, 1]) caja(arco(a + sg * 0.0125, R + 5.6, Y + 1.3), [0.12, 1.1, 11.6], -a, 1);
    faroles.push(arco(a, R + 16, 147.5));
    caja(arco(a, R + 21.6, TOMA.y), [8.4, 12.4, 0.9], -a, 0); caja(arco(a, R + 21.75, TOMA.y), [6.4, 10.4, 0.9], -a, 4);
    for (let i = -3; i <= 3; i++) caja(arco(a + (i * 0.86) / (R + 22.4), R + 22.4, TOMA.y), [0.16, 10.4, 0.3], -a, 1);
    for (const dy of [-3.4, 0, 3.4]) caja(arco(a, R + 22.45, TOMA.y + dy), [6.4, 0.16, 0.3], -a, 1); }
  // la central, al pie, y sus dos tuberías bajando por la roca
  const CEN = { x: 27, z: 128, y: 9 };
  caja([CEN.x, CEN.y, CEN.z], [26, 24, 74], 0, 0); caja([CEN.x, CEN.y + 12.6, CEN.z], [28, 1.4, 76], 0, 0);
  for (let i = 0; i < 9; i++) caja([CEN.x - 13.05, CEN.y + 2.5, CEN.z - 30 + i * 7.5], [0.3, 11, 3.2], 0, 2);
  caja([CEN.x - 13.1, CEN.y - 7.5, CEN.z], [0.5, 6, 60], 0, 1);
  for (const dx of [-6, 6]) { const x = CEN.x + dx; tubo([x, 48, -47], [x, 46, -33], 2.3); tubo([x, 46, -33], [x, 3.5, -12], 2.3); tubo([x, 3.5, -12], [x, 3.5, 92], 2.3); for (const z of [-40, -22.5, 20, 50, 80]) { const y = z < -30 ? 44 : z < -12 ? 24.75 : 0.5; caja([x, y, z], [6.2, z < -12 && z > -30 ? 5 : 6, 3], 0, 0); } }
  faroles.push([CEN.x - 14, CEN.y + 9, CEN.z - 30], [CEN.x - 14, CEN.y + 9, CEN.z], [CEN.x - 14, CEN.y + 9, CEN.z + 30]);
  // la línea: torres de celosía por la margen derecha y tres cables de torre a torre
  const torres = [];
  for (let z = 215; z < 3300; z += 235) { const x = eje(z) + Math.min(ancho(z) - 14, 46 + 70 * Math.min(1, (z - 215) / 900)); torres.push([x, mapa ? mapa.leer(x, z) : lecho(z), z]); }
  torres.forEach(([x, y, z], i) => {
    const H = 44; for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) tubo([x + sx * 4.2, y - 1, z + sz * 4.2], [x + sx * 0.7, y + H, z + sz * 0.7], 0.22, 1, 4);
    for (let k = 1; k < 6; k++) { const yy = y + (H * k) / 6, a = 4.2 - (3.5 * k) / 6; for (const [p, q] of [[[-a, -a], [a, -a]], [[a, -a], [a, a]], [[a, a], [-a, a]], [[-a, a], [-a, -a]]]) tubo([x + p[0], yy, z + p[1]], [x + q[0], yy + (k % 2 ? 3 : -3), z + q[1]], 0.1, 1, 3); }
    for (const [h, l] of [[H - 3, 9], [H - 10, 12]]) caja([x, y + h, z], [l * 2, 0.5, 0.5], 0, 1);
    if (i) { const [x0, y0, z0] = torres[i - 1]; for (const [h, l] of [[H - 3.6, 8.6], [H - 3.6, -8.6], [H - 10.6, 11.6], [H - 10.6, -11.6]]) for (let k = 0; k < 6; k++) { const t0 = k / 6, t1 = (k + 1) / 6, c = (t) => 14 * (4 * t * (1 - t)); tubo([x0 + l + (x - x0) * t0, y0 + h + (y - y0) * t0 - c(t0), z0 + (z - z0) * t0], [x0 + l + (x - x0) * t1, y0 + h + (y - y0) * t1 - c(t1), z0 + (z - z0) * t1], 0.07, 1, 3); } }
  });
  return { pos: new Float32Array(pos), nor: new Float32Array(nor), mat: new Float32Array(mat), ind: new Uint32Array(ind), faroles, central: CEN };
}

/* Las cinco hojas de compuerta: una caja de acero por vano. aHoja: índice del vano. */
export function geometriaHojas() {
  const pos = [], nor = [], hoja = [], ind = [];
  VANOS.forEach((c, k) => {
    const N = 6;
    for (let i = 0; i <= N; i++) { const a = c - MEDIO_VANO + (i / N) * 2 * MEDIO_VANO; for (const y of [VANO - 0.5, COTA.corona - 0.6]) for (const r of [PRESA.R - 1.2, PRESA.R - 1.9]) { const p = arco(a, r, y); pos.push(...p); nor.push(Math.sin(a) * (r > PRESA.R - 1.5 ? 1 : -1), 0, -Math.cos(a) * (r > PRESA.R - 1.5 ? 1 : -1)); hoja.push(k); } }
    const o = (pos.length / 3) - (N + 1) * 4;
    for (let i = 0; i < N; i++) { const a = o + i * 4, b = a + 4; ind.push(a, b, a + 2, b, b + 2, a + 2, a + 1, a + 3, b + 1, b + 1, a + 3, b + 3, a + 2, b + 2, a + 3, b + 2, b + 3, a + 3); }
  });
  return { pos: new Float32Array(pos), nor: new Float32Array(nor), hoja: new Float32Array(hoja), ind: new Uint32Array(ind) };
}

/* Los chorros: una lámina por compuerta que sale del labio y cae en parábola hasta el pie. aChorro: [a lo ancho −1…1, avance 0…1, vano] */
export function geometriaChorros(mapa) {
  const pos = [], cho = [], hor = [], ind = [], F = 30, C = 6, v0 = 12.5, caida = VANO - 2 - (-5), T = Math.sqrt((2 * caida) / 9.8);
  VANOS.forEach((c, k) => {
    const o = pos.length / 3, r0 = PRESA.R - grosor(VANO) - 0.5;
    for (let j = 0; j <= F; j++) {
      const t = Math.pow(j / F, 0.8) * T, avance = v0 * t, y = VANO - 1.2 - 0.5 * 9.8 * t * t;
      for (let i = 0; i <= C; i++) { const u = (i / C) * 2 - 1, medio = (6.6 + 2.2 * (j / F)) / (r0 - avance), p = arco(c + u * medio, r0 - avance, y); pos.push(...p); cho.push(u, j / F, k); hor.push(horizonte(mapa, p[0], Math.max(p[1], 2), p[2], true)); }
    }
    for (let j = 0; j < F; j++) for (let i = 0; i < C; i++) { const a = o + j * (C + 1) + i, b = a + 1, d = a + C + 1, e = d + 1; ind.push(a, d, b, b, d, e); }
  });
  return { pos: new Float32Array(pos), cho: new Float32Array(cho), hor: new Float32Array(hor), ind: new Uint32Array(ind) };
}

/* Las luces del valle: pueblos y caminos aguas abajo. [x, y, z] y [tamaño, orden de encendido 0…1] */
export function lucesValle(mapa, n = 1500) {
  let s = 9; const azar = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const base = new Float32Array(n * 3), dat = new Float32Array(n * 2), pueblos = [];
  for (let i = 0; i < 16; i++) { const z = 520 + Math.pow(azar(), 0.8) * 2950, lado = azar() < 0.5 ? -1 : 1, w = ancho(z); pueblos.push([eje(z) + lado * (62 + azar() * Math.max(0, w - 90)), z, 34 + azar() * 110, 0.35 + azar()]); }
  const total = pueblos.reduce((a, p) => a + p[3], 0);
  for (let i = 0; i < n; i++) {
    let x, z;
    if (i % 4 === 0) { z = 260 + azar() * 3300; x = eje(z) + (i % 8 === 0 ? -1 : 1) * (58 + 2 * Math.sin(z * 0.01)); }   // el camino que sigue al río
    else { let r = azar() * total, k = 0; while (k < pueblos.length - 1 && r > pueblos[k][3]) { r -= pueblos[k][3]; k++; } const P = pueblos[k], a = azar() * 6.283, d = Math.pow(azar(), 0.6) * P[2]; x = P[0] + Math.cos(a) * d; z = P[1] + Math.sin(a) * d * 1.5; if (Math.abs(x - eje(z)) < 54) x = eje(z) + Math.sign(x - eje(z) || 1) * (54 + azar() * 20); }
    base.set([x, mapa.leer(x, z) + 3.5, z], i * 3); dat.set([i % 4 === 0 ? 5 : 6 + azar() * 7, Math.min(0.97, Math.max(0.03, (z - 240) / 3350 + (azar() - 0.5) * 0.1))], i * 2);
  }
  return { base, dat, n };
}
