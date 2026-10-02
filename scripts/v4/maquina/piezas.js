/* ==========================================================================
   LA MÁQUINA · las piezas
   --------------------------------------------------------------------------
   Toda la geometría se genera aquí, por código: no hay modelos que descargar.
   Ruedas dentadas con sus radios calados, puentes, platinas, tornillos con su
   ranura, zafiros en su engaste, pilares, levas, palancas, muelles, tambores
   de cifras, una campana, una lupa. Los cantos van biselados: es el bisel el
   que recoge la luz y hace que el metal parezca metal.
   Unidades: 1 = unos 10 mm. El plano de la máquina es XY; Z mira al espectador.
   ========================================================================== */
import { Shape, Path, ExtrudeGeometry, LatheGeometry, TubeGeometry, CatmullRomCurve3, CylinderGeometry, PlaneGeometry, Vector2, Vector3 } from "three";
import { mergeGeometries, toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const TAU = Math.PI * 2;
export const MOD = 0.046;                                  // módulo de los dientes
export const radio = (N, m = MOD) => (N * m) / 2;          // radio primitivo de una rueda de N dientes

const extruir = (formas, grosor, bisel = 0.012, curvas = 10, pliegue = 0.6) => {
  bisel = Math.min(bisel, grosor * 0.38);
  const g = new ExtrudeGeometry(formas, { depth: Math.max(0.001, grosor - bisel * 2), bevelEnabled: bisel > 0, bevelThickness: bisel, bevelSize: bisel, bevelOffset: -bisel, bevelSegments: 1, curveSegments: curvas, steps: 1 });
  g.translate(0, 0, -(grosor - bisel * 2) / 2);
  return pliegue ? toCreasedNormals(g, pliegue) : g;
};
const torno = (pts, seg = 28) => { const g = new LatheGeometry(pts.map(([r, z]) => new Vector2(Math.max(r, 0.0001), z)), seg); g.rotateX(Math.PI / 2); return g.toNonIndexed(); };
const unir = (gs) => mergeGeometries(gs.map((g) => { const n = g.index ? g.toNonIndexed() : g; for (const k of Object.keys(n.attributes)) if (!["position", "normal", "uv"].includes(k)) n.deleteAttribute(k); return n; }), false);
const circulo = (r, x = 0, y = 0, horario = true) => { const p = new Path(); p.absarc(x, y, r, 0, TAU, horario); return p; };

/* Envolvente convexa de varios círculos: la forma de un puente o de una palanca. */
function envolvente(circ, n = 28) {
  const pts = [];
  for (const [x, y, r] of circ) for (let i = 0; i < n; i++) { const a = (i / n) * TAU; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
  pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cruz = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const inf = [], sup = [];
  for (const p of pts) { while (inf.length >= 2 && cruz(inf[inf.length - 2], inf[inf.length - 1], p) <= 0) inf.pop(); inf.push(p); }
  for (const p of pts.slice().reverse()) { while (sup.length >= 2 && cruz(sup[sup.length - 2], sup[sup.length - 1], p) <= 0) sup.pop(); sup.push(p); }
  const h = inf.slice(0, -1).concat(sup.slice(0, -1));
  const s = new Shape(); h.forEach((p, i) => (i ? s.lineTo(p[0], p[1]) : s.moveTo(p[0], p[1]))); s.closePath();
  return s;
}

/* -------------------------------------------------------------- ruedas */
function contornoRueda(N, m, sierra = false) {
  const r = (N * m) / 2, rr = r - 1.2 * m, ro = r + 0.95 * m, paso = TAU / N, s = new Shape();
  const perfil = sierra ? [[rr, -0.46], [ro, 0.34], [rr, 0.44]] : [[rr, -0.31], [r, -0.245], [ro, -0.12], [ro, 0.12], [r, 0.245], [rr, 0.31]];
  for (let k = 0; k < N; k++) for (const [rad, f] of perfil) { const a = (k + f) * paso, x = Math.cos(a) * rad, y = Math.sin(a) * rad; if (k === 0 && f === perfil[0][1]) s.moveTo(x, y); else s.lineTo(x, y); }
  s.closePath();
  return { s, r, rr, ro };
}
function calados(s, n, rExt, rInt, ancho) {
  if (rExt - rInt < 0.1 || n < 2) return;
  const dO = Math.asin(Math.min(0.9, ancho / rExt)), dI = Math.asin(Math.min(0.9, ancho / rInt));
  for (let k = 0; k < n; k++) {
    const a0 = (k / n) * TAU, a1 = ((k + 1) / n) * TAU;
    if (a1 - a0 - 2 * dI < 0.12) return;
    const p = new Path(); p.absarc(0, 0, rExt, a0 + dO, a1 - dO, false); p.absarc(0, 0, rInt, a1 - dI, a0 + dI, true); p.closePath(); s.holes.push(p);
  }
}
export function rueda(N, { m = MOD, grosor = 0.075, eje = 0.04, radios = -1, sierra = false, bisel = 0.009 } = {}) {
  const { s, r, rr } = contornoRueda(N, m, sierra);
  const n = radios >= 0 ? radios : N < 26 ? 0 : N < 34 ? 4 : N < 60 ? 5 : 6;
  calados(s, n, rr - Math.max(0.06, r * 0.1), Math.max(0.1, r * 0.2), 0.03 + r * 0.03);
  s.holes.push(circulo(eje));
  return extruir(s, grosor, bisel, 8, 0.5);
}
/* Piñón macizo y alto (el que engrana con la rueda siguiente). */
export const pinon = (N, alto = 0.16) => rueda(N, { grosor: alto, radios: 0, eje: 0.028, bisel: 0.006 });
/* Volante: llanta fina con tres brazos. */
export function volante(r = 0.52) {
  const s = new Shape(); s.absarc(0, 0, r, 0, TAU, false);
  calados(s, 3, r - 0.075, 0.09, 0.035); s.holes.push(circulo(0.03));
  const g = extruir(s, 0.07, 0.01, 40, 0.7);
  const pesos = []; for (let k = 0; k < 12; k++) { const a = (k / 12) * TAU + 0.26, t = torno([[0, -0.02], [0.022, -0.02], [0.026, 0], [0.022, 0.02], [0, 0.02]], 10); t.rotateX(Math.PI / 2); t.rotateZ(a - Math.PI / 2); t.translate(Math.cos(a) * (r + 0.012), Math.sin(a) * (r + 0.012), 0); pesos.push(t); }
  return unir([g, ...pesos]);
}
/* Rueda de estrella (la leva que levanta el martillo). */
export function estrella(n = 8, r = 0.42) {
  const s = new Shape();
  for (let k = 0; k < n; k++) { const a = (k / n) * TAU, b = ((k + 0.5) / n) * TAU; const p = [Math.cos(a) * r, Math.sin(a) * r], q = [Math.cos(b) * r * 0.58, Math.sin(b) * r * 0.58]; if (!k) s.moveTo(p[0], p[1]); else s.lineTo(p[0], p[1]); s.lineTo(q[0], q[1]); }
  s.closePath(); s.holes.push(circulo(0.045));
  return extruir(s, 0.08, 0.01, 6, 0.4);
}
/* Leva de caracol. */
export function leva(r0 = 0.34, r1 = 0.78) {
  const s = new Shape(), n = 72;
  for (let i = 0; i <= n; i++) { const t = i / n, a = t * TAU, r = r0 + (r1 - r0) * t; const x = Math.cos(a) * r, y = Math.sin(a) * r; if (!i) s.moveTo(x, y); else s.lineTo(x, y); }
  s.closePath(); s.holes.push(circulo(0.05)); s.holes.push(circulo(0.07, r0 * 0.55, 0)); s.holes.push(circulo(0.09, -r0 * 0.2, r0 * 0.75));
  return extruir(s, 0.1, 0.012, 8, 0.7);
}
/* Cremallera: una regla dentada. */
export function cremallera(L = 2.2, m = MOD * 1.3) {
  const s = new Shape(), paso = Math.PI * m, n = Math.floor(L / paso), a = 0.2;
  s.moveTo(-L / 2, -a); s.lineTo(L / 2, -a); s.lineTo(L / 2, 0);
  for (let k = n - 1; k >= 0; k--) { const x = -L / 2 + (k + 0.5) * paso + (L - n * paso) / 2; s.lineTo(x + paso * 0.31, 0); s.lineTo(x + paso * 0.12, m * 2.1); s.lineTo(x - paso * 0.12, m * 2.1); s.lineTo(x - paso * 0.31, 0); }
  s.lineTo(-L / 2, 0); s.closePath();
  const ranura = new Path(); ranura.absarc(-L * 0.28, -a * 0.5, 0.035, Math.PI / 2, Math.PI * 1.5, false); ranura.absarc(L * 0.28, -a * 0.5, 0.035, -Math.PI / 2, Math.PI / 2, false); ranura.closePath(); s.holes.push(ranura);
  return extruir(s, 0.09, 0.011, 6, 0.4);
}

/* ------------------------------------------------------ puentes y platinas */
/* Un puente: la envolvente de sus apoyos, con taladros para zafiros y tornillos. */
export function puente(apoyos, taladros = [], grosor = 0.1, bisel = 0.02) {
  const s = envolvente(apoyos);
  for (const [x, y, r] of taladros) s.holes.push(circulo(r, x, y));
  return extruir(s, grosor, bisel, 12, 0.75);
}
/* Un puente calado: en vez de una chapa, brazos que van de apoyo en apoyo (pie, ejes, pie). Deja ver las ruedas. */
export function puenteBrazos(apoyos, taladros = [], grosor = 0.1, bisel = 0.02) {
  if (apoyos.length < 2) return puente(apoyos, taladros, grosor, bisel);
  const gs = [];
  for (let i = 0; i < apoyos.length - 1; i++) {
    const s = envolvente([apoyos[i], apoyos[i + 1]], 36);
    for (const k of [i, i + 1]) if (taladros[k]) s.holes.push(circulo(taladros[k][2], taladros[k][0], taladros[k][1]));
    gs.push(extruir(s, grosor, bisel, 12, 0.75));
  }
  return unir(gs);
}
export function platina(w, h, r = 0.5, grosor = 0.2, taladros = [], rects = []) {
  const s = new Shape(), x = w / 2, y = h / 2;
  s.moveTo(-x + r, -y); s.lineTo(x - r, -y); s.absarc(x - r, -y + r, r, -Math.PI / 2, 0, false); s.lineTo(x, y - r); s.absarc(x - r, y - r, r, 0, Math.PI / 2, false); s.lineTo(-x + r, y); s.absarc(-x + r, y - r, r, Math.PI / 2, Math.PI, false); s.lineTo(-x, -y + r); s.absarc(-x + r, -y + r, r, Math.PI, Math.PI * 1.5, false);
  for (const [tx, ty, tr] of taladros) s.holes.push(circulo(tr, tx, ty));
  for (const [rx, ry, rw, rh, rr = 0.1] of rects) { const p = new Path(), a = rw / 2, b = rh / 2; p.moveTo(rx - a + rr, ry - b); p.absarc(rx - a + rr, ry - b + rr, rr, -Math.PI / 2, Math.PI, true); p.lineTo(rx - a, ry + b - rr); p.absarc(rx - a + rr, ry + b - rr, rr, Math.PI, Math.PI / 2, true); p.lineTo(rx + a - rr, ry + b); p.absarc(rx + a - rr, ry + b - rr, rr, Math.PI / 2, 0, true); p.lineTo(rx + a, ry - b + rr); p.absarc(rx + a - rr, ry - b + rr, rr, 0, -Math.PI / 2, true); p.closePath(); s.holes.push(p); }
  return extruir(s, grosor, 0.03, 14, 0.75);
}
export const palanca = (circ, taladros = [], grosor = 0.07) => puente(circ, taladros, grosor, 0.012);
export const disco = (r, grosor = 0.05, eje = 0) => { const s = new Shape(); s.absarc(0, 0, r, 0, TAU, false); if (eje) s.holes.push(circulo(eje)); return extruir(s, grosor, Math.min(0.012, grosor * 0.3), 40, 0.75); };
export const anillo = (rExt, rInt, grosor = 0.05) => disco(rExt, grosor, rInt);
export const marca = (l = 0.14, a = 0.022) => { const s = new Shape(); s.moveTo(-a, 0); s.lineTo(a, 0); s.lineTo(a, l); s.lineTo(-a, l); s.closePath(); return extruir(s, 0.02, 0.004, 2, 0); };
/* Sector graduado del indicador. */
export function sector(r0 = 0.95, r1 = 1.25, a0 = 0.5, a1 = 2.64) {
  const s = new Shape(); s.absarc(0, 0, r1, a0, a1, false); s.absarc(0, 0, r0, a1, a0, true); s.closePath();
  return extruir(s, 0.045, 0.008, 40, 0.75);
}
/* Aguja: contrapeso, eje y punta larga. */
export const aguja = (l = 1.15) => palanca([[0, 0, 0.055], [-0.2, 0, 0.04], [l, 0, 0.008]], [[0, 0, 0.02]], 0.035);

/* --------------------------------------------------------- piezas de torno */
export const pilar = (h = 0.5, r = 0.06) => torno([[0, 0], [r * 1.35, 0], [r * 1.35, 0.03], [r, 0.05], [r, h - 0.05], [r * 1.35, h - 0.03], [r * 1.35, h], [0, h]], 20);
export const eje = (h = 0.6, r = 0.028) => torno([[0, 0], [r * 0.6, 0], [r, 0.03], [r, h - 0.03], [r * 0.6, h], [0, h]], 12);
export const engaste = () => torno([[0.058, 0], [0.108, 0], [0.112, 0.012], [0.1, 0.03], [0.07, 0.034], [0.058, 0.026]], 26);
export const zafiro = () => torno([[0.012, 0.022], [0.03, 0.03], [0.05, 0.031], [0.062, 0.02], [0.062, 0], [0, 0]], 22);
export const arandela = (r = 0.1) => torno([[r * 0.42, 0], [r, 0], [r, 0.02], [r * 0.42, 0.02]], 22);
export function tornillo(r = 0.075) {
  const g = r * 0.16, a = Math.asin(g / r), mitad = (signo) => { const s = new Shape(); s.absarc(0, 0, r, signo > 0 ? a : Math.PI + a, signo > 0 ? Math.PI - a : TAU - a, false); s.closePath(); return s; };
  const cabeza = extruir([mitad(1), mitad(-1)], 0.045, 0.009, 14, 0.75); cabeza.translate(0, 0, 0.032);
  const base = torno([[0, -0.012], [r * 0.985, -0.012], [r * 0.985, 0.012], [0, 0.012]], 24);
  const cana = torno([[0, -0.2], [r * 0.4, -0.2], [r * 0.4, -0.012], [0, -0.012]], 10);
  return unir([cabeza, base, cana]);
}
/* Tuerca cuadrada: en azul, es el píxel de la marca. */
export const tuerca = (l = 0.2) => { const s = new Shape(); const h = l / 2; s.moveTo(-h, -h); s.lineTo(h, -h); s.lineTo(h, h); s.lineTo(-h, h); s.closePath(); return extruir(s, 0.07, 0.014, 2, 0.3); };
export const campana = (r = 0.42) => torno([[0.03, 0.2], [r * 0.3, 0.195], [r * 0.62, 0.17], [r * 0.86, 0.11], [r, 0.02], [r * 0.99, 0], [r * 0.93, 0.004], [r * 0.82, 0.085], [r * 0.6, 0.14], [r * 0.3, 0.165], [0.03, 0.17]], 48);
export const cabezaMartillo = () => torno([[0, -0.06], [0.07, -0.06], [0.085, -0.04], [0.085, 0.04], [0.07, 0.06], [0, 0.06]], 20);
export const lupa = (r = 0.62) => torno([[r - 0.06, 0], [r + 0.045, 0], [r + 0.06, 0.03], [r + 0.045, 0.085], [r - 0.045, 0.085], [r - 0.06, 0.05]], 56);
export const lente = (r = 0.585) => torno([[0, 0.05], [r * 0.5, 0.043], [r * 0.85, 0.026], [r, 0.008], [r, 0], [0, 0]], 48);
export const corona = () => unir([rueda(30, { m: 0.03, grosor: 0.3, radios: 0, eje: 0.0001, bisel: 0.01 }), torno([[0, -0.75], [0.045, -0.75], [0.045, -0.15], [0, -0.15]], 12)]);
/* Barrilete: el tambor dentado que guarda el muelle. */
export const barrilete = (N = 46) => rueda(N, { grosor: 0.2, radios: 4, eje: 0.07, bisel: 0.014 });

/* ----------------------------------------------------------------- muelles */
export function espiral(r0 = 0.08, r1 = 0.4, vueltas = 9, hilo = 0.007, alto = 0.0) {
  const pts = [], n = Math.ceil(vueltas * 28);
  for (let i = 0; i <= n; i++) { const t = i / n, a = t * vueltas * TAU, r = r0 + (r1 - r0) * t; pts.push(new Vector3(Math.cos(a) * r, Math.sin(a) * r, alto * t)); }
  return new TubeGeometry(new CatmullRomCurve3(pts), n * 2, hilo, 5, false).toNonIndexed();
}
/* Muelle real del barrilete: una cinta ancha enrollada. */
export function muelleReal(r0 = 0.16, r1 = 1.2, vueltas = 7) {
  const g = espiral(r0, r1, vueltas, 0.02); g.scale(1, 1, 3.2); return g;
}

/* ------------------------------------------------------- tambores y papel */
/* Tambor de cifras: la textura (0–9) da la vuelta al cilindro. El eje del tambor es X. */
export function tambor(r = 0.3, ancho = 0.3) {
  const c = new CylinderGeometry(r, r, ancho, 48, 1, true); c.rotateZ(Math.PI / 2);
  return c.toNonIndexed();
}
export const tapaTambor = (r = 0.3, ancho = 0.3) => { const g = torno([[0.035, 0], [r * 0.96, 0], [r + 0.012, 0.012], [r + 0.012, 0.03], [r * 0.9, 0.034], [0.035, 0.03]], 40); g.rotateY(Math.PI / 2); const h = g.clone(); h.rotateY(Math.PI); g.translate(ancho / 2, 0, 0); h.translate(-ancho / 2, 0, 0); return unir([g, h]); };
export const hoja = (w = 1, h = 1.4167) => new PlaneGeometry(w, h, 1, 1).toNonIndexed();
