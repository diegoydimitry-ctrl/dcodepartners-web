/* ==========================================================================
   LA MÁQUINA · el trazado
   --------------------------------------------------------------------------
   Dónde va cada pieza cuando la máquina está montada, y cómo se mueve cuando
   marcha. Seis módulos sobre una platina, uno por área de una empresa más el
   motor, unidos por ruedas de transmisión: esas ruedas son lo que hace D-Code.

     0 Ventas · 1 Clientes · 2 Operaciones · 3 Finanzas · 4 Dirección · 5 Motor
     6 Transmisiones (lo que une los módulos) · 7 Platina y caja

   La cinemática se resuelve una sola vez: se parte del barrilete del motor y
   se recorre el grafo de engranes, de modo que todas las ruedas giran a la
   velocidad y con la fase que les toca y los dientes casan.
   ========================================================================== */
import * as G from "./piezas.js";

const TAU = Math.PI * 2;
export const ACABADO = { pulido: 0, cepillado: 1, circular: 2, arenado: 3, perlado: 4, azulado: 5, negro: 6, ginebra: 7 };
export const TONO = { rodio: [0.80, 0.81, 0.83], acero: [0.56, 0.58, 0.62], rutenio: [0.2, 0.205, 0.22], negro: [0.03, 0.03, 0.034], negro2: [0.1, 0.102, 0.11], azul: [0.035, 0.085, 0.34], latón: [0.7, 0.71, 0.74] };
export const MODULOS = ["ventas", "clientes", "operaciones", "finanzas", "direccion", "motor", "transmision", "platina"];
const Z = { placa: 0.06, a: 0.2, b: 0.335, pin: 0.27, puente: 0.56, alto: 0.62 };
const CELDA = 4.25;

export function trazar(vertical = false) {
  const piezas = [], geos = new Map(), ruedas = [], aristas = [], avisos = [];
  const geo = (clave, f) => { if (!geos.has(clave)) geos.set(clave, f()); return clave; };
  let mod = 0, ox = 0, oy = 0;
  const P = (g, o = {}) => { const p = { g, mat: o.mat || "metal", fin: o.fin ?? ACABADO.pulido, tono: o.tono || TONO.acero, mod: o.mod ?? mod, ord: o.ord ?? 0.5, x: ox + (o.x || 0), y: oy + (o.y || 0), z: o.z || 0, rx: o.rx || 0, ry: o.ry || 0, rz: o.rz || 0, k: o.k || 0, fase: o.fase || 0, tipo: o.tipo || "", dato: o.dato || null, e: o.e || 1 }; piezas.push(p); return p; };

  /* ---- ruedas: se colocan aquí, giran según resuelva la cinemática ---- */
  const R = (N, o = {}) => {
    let x, y, coaxial = -1;
    if (o.de !== undefined) { const a = ruedas[o.de]; if (o.coaxial) { x = a.x; y = a.y; coaxial = o.de; } else { const d = a.r + G.radio(N) + 0.004; x = a.x + Math.cos(o.ang) * d; y = a.y + Math.sin(o.ang) * d; } }
    else { x = ox + o.x; y = oy + o.y; }
    const i = ruedas.length, pin = !!o.pin, z = o.z ?? (pin ? Z.pin : Z.a);
    const clave = o.geo || (pin ? `pinon${N}` : `rueda${N}${o.sierra ? "s" : ""}`);
    geo(clave, () => (o.hacer ? o.hacer() : pin ? G.pinon(N, 0.22) : G.rueda(N, { sierra: o.sierra })));
    const pieza = P(clave, { fin: pin ? ACABADO.pulido : ACABADO.circular, tono: o.tono || (pin ? TONO.acero : TONO.rodio), z, ord: o.ord ?? (pin ? 0.34 : 0.3 + (z > Z.a ? 0.08 : 0)), tipo: "rueda" });
    pieza.x = x; pieza.y = y;
    ruedas.push({ i, N, x, y, z, r: G.radio(N), k: null, fase: 0, pieza, mod: pieza.mod, pin, libre: !!o.libre });
    if (o.de !== undefined) aristas.push([o.de, i, coaxial >= 0 ? "coaxial" : "engrana"]);
    // el cubo de la rueda: un disco pulido con su pivote
    if (!pin && N >= 26 && !o.sinCubo) { const c = P(geo("cubo", () => G.disco(0.085, 0.03)), { z: z + 0.052, fin: ACABADO.pulido, tono: TONO.acero, ord: (o.ord ?? 0.38) + 0.03, tipo: "conRueda", dato: { rueda: i } }); c.x = x; c.y = y; }
    return i;
  };
  /* ---- cuelga una rueda más de otra, buscando un ángulo en el que no pise nada ---- */
  let zonas = [];
  const colgar = (de, N, z, desde = 0) => {
    const a = ruedas[de], r = G.radio(N), d = a.r + r + 0.004;
    for (let k = 0; k < 40; k++) {
      const ang = desde + (k % 2 ? -1 : 1) * Math.ceil(k / 2) * 0.16, x = a.x + Math.cos(ang) * d, y = a.y + Math.sin(ang) * d;
      if (Math.abs(x - ox) > 1.92 - r * 0.75 || Math.abs(y - oy) > 1.92 - r * 0.75) continue;
      if (ruedas.some((q) => q.i !== de && q.mod === mod && Math.abs(q.z - z) < 0.12 && Math.hypot(q.x - x, q.y - y) < q.r + r + 0.07)) continue;
      if (ruedas.some((q) => q.mod === mod && Math.hypot(q.x - x, q.y - y) < 0.2)) continue;                 // no sobre otro eje
      if (zonas.some((q) => Math.hypot(q[0] - x, q[1] - y) < q[2] + r)) continue;
      return R(N, { de, ang, z });
    }
    return -1;
  };
  const extras = (lista) => { const hechos = []; for (const [de, N, z, desde] of lista) { const padre = de < 0 ? hechos[-de - 1] : de; if (padre === undefined) continue; const i = colgar(padre, N, z, desde || 0); if (i >= 0) hechos.push(i); } return hechos; };
  /* ---- huecos libres del módulo, para apoyar pilares y tornillos sin pisar ruedas ---- */
  const libre = (x, y, margen = 0.15) => ruedas.every((r) => r.mod !== mod || Math.hypot(r.x - x, r.y - y) > r.r + margen + 0.07) && zonas.every((q) => Math.hypot(q[0] - x, q[1] - y) > q[2] * 0.8 + 0.1);
  const apoyo = (cerca, lejos = null, lim = 1.74) => {
    let mejor = null, md = 1e9;
    for (let gx = -lim; gx <= lim; gx += 0.12) for (let gy = -lim; gy <= lim; gy += 0.12) {
      const x = ox + gx, y = oy + gy; if (!libre(x, y)) continue; if (ocupados.some((q) => Math.hypot(q[0] - x, q[1] - y) < 0.44)) continue; if (lejos && Math.hypot(lejos[0] - x, lejos[1] - y) < 0.95) continue;
      const d = Math.hypot(cerca[0] - x, cerca[1] - y); if (d < md) { md = d; mejor = [x, y]; }
    }
    if (!mejor) { avisos.push(`sin apoyo en módulo ${mod}`); mejor = [cerca[0], cerca[1]]; }
    ocupados.push(mejor); return mejor;
  };
  let ocupados = [];
  const tornilloEn = (x, y, z, ord = 0.92, e = 1) => P(geo("tornillo", () => G.tornillo()), { x: x - ox, y: y - oy, z, fin: ACABADO.azulado, tono: TONO.azul, ord, tipo: "tornillo", rz: (x * 7.3 + y * 3.1) % TAU, e });
  const zafiroEn = (x, y, z, ord = 0.86) => { P(geo("engaste", G.engaste), { x: x - ox, y: y - oy, z, fin: ACABADO.pulido, tono: TONO.rodio, ord }); P(geo("zafiro", G.zafiro), { x: x - ox, y: y - oy, z: z + 0.004, mat: "joya", ord: ord + 0.02 }); };
  const pilarEn = (x, y, h = Z.puente - 0.05 - Z.placa) => P(geo(`pilar${h.toFixed(2)}`, () => G.pilar(h)), { x: x - ox, y: y - oy, z: Z.placa, fin: ACABADO.pulido, tono: TONO.acero, ord: 0.16 });
  /* Un puente sobre varias ruedas: dos pies atornillados y un zafiro encima de cada eje. */
  let nPuente = 0;
  const puenteSobre = (idx, o = {}) => {
    const ejes = idx.map((i) => ruedas[i]), pies = [];
    pies.push(apoyo([ejes[0].x + (o.dx0 || 0), ejes[0].y + (o.dy0 || 0)]));
    if (!o.unPie) pies.push(apoyo([ejes[ejes.length - 1].x + (o.dx1 || 0), ejes[ejes.length - 1].y + (o.dy1 || 0)], pies[0]));
    const cx = ejes.reduce((s, e) => s + e.x, pies.reduce((s, p) => s + p[0], 0)) / (ejes.length + pies.length), cy = ejes.reduce((s, e) => s + e.y, pies.reduce((s, p) => s + p[1], 0)) / (ejes.length + pies.length);
    const circ = [...ejes.map((e) => [e.x - cx, e.y - cy, 0.14]), ...pies.map((p) => [p[0] - cx, p[1] - cy, 0.115])];
    const tal = [...ejes.map((e) => [e.x - cx, e.y - cy, 0.062]), ...pies.map((p) => [p[0] - cx, p[1] - cy, 0.034])];
    const clave = `puente${nPuente++}${vertical ? "v" : "h"}`; geo(clave, () => G.puente(circ, tal, 0.1, 0.022));
    P(clave, { x: cx - ox, y: cy - oy, z: Z.puente, fin: o.fin ?? ACABADO.ginebra, tono: o.tono || TONO.acero, ord: 0.7 });
    for (const e of ejes) { zafiroEn(e.x, e.y, Z.puente + 0.022); P(geo("eje", () => G.eje(Z.puente - Z.placa + 0.02)), { x: e.x - ox, y: e.y - oy, z: Z.placa, tono: TONO.acero, ord: 0.22, tipo: "eje", dato: { rueda: e.i } }); }
    for (const p of pies) { pilarEn(p[0], p[1]); tornilloEn(p[0], p[1], Z.puente + 0.05); }
  };
  const subplaca = (o = {}) => { const c = `placa${o.w || 3.9}x${o.h || 3.9}`; geo(c, () => G.platina(o.w || 3.9, o.h || 3.9, 0.42, 0.06)); P(c, { z: 0.03, fin: ACABADO.arenado, tono: TONO.rutenio, ord: 0.06 }).texto = mod + 1; for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) tornilloEn(ox + sx * 1.72, oy + sy * 1.72, Z.placa + 0.012, 0.12, 0.8); };

  /* ---- dónde cae cada módulo ---- */
  const C = CELDA, sitio = vertical
    ? { ventas: [-C / 2, C], clientes: [C / 2, C], motor: [-C / 2, 0], finanzas: [C / 2, 0], operaciones: [-C / 2, -C], direccion: [C / 2, -C] }
    : { ventas: [-C, C / 2], motor: [0, C / 2], clientes: [C, C / 2], operaciones: [-C, -C / 2], finanzas: [0, -C / 2], direccion: [C, -C / 2] };
  const en = (nombre) => { mod = MODULOS.indexOf(nombre); [ox, oy] = sitio[nombre]; ocupados = []; zonas = []; };
  const zona = (x, y, r) => zonas.push([ox + x, oy + y, r]);
  const info = { vertical, modulos: {}, tambores: [], campos: null };
  const cierra = (nombre) => { info.modulos[nombre] = { x: ox, y: oy, r: 2.1 }; };

  /* ---------------------------------------------------------- platina */
  mod = 7; ox = 0; oy = 0;
  const PW = vertical ? C * 2 + 0.55 : C * 3 + 0.55, PH = vertical ? C * 3 + 0.55 : C * 2 + 0.55;
  P(geo("platina", () => G.platina(PW, PH, 0.7, 0.26)), { z: -0.13, fin: ACABADO.perlado, tono: TONO.negro2, ord: 0 });
  info.platina = { w: PW, h: PH };
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) tornilloEn(sx * (PW / 2 - 0.34), sy * (PH / 2 - 0.34), 0.012, 0.05, 1.5);
  P(geo("corona", G.corona), { x: PW / 2 + 0.14, y: PH * 0.24, z: Z.a, ry: Math.PI / 2, fin: ACABADO.pulido, tono: TONO.acero, ord: 0.8, tipo: "corona" });

  /* ------------------------------------------------------------ motor */
  en("motor"); subplaca();
  const barr = R(62, { x: -0.55, y: 0.3, z: Z.a + 0.02, geo: "barrilete", hacer: () => G.barrilete(62), tono: TONO.rodio, ord: 0.26 });
  P(geo("muelleReal", () => G.muelleReal(0.2, 0.98, 6.5)), { x: -0.55, y: 0.3, z: Z.a + 0.14, fin: ACABADO.azulado, tono: TONO.azul, ord: 0.5, tipo: "muelle" });
  P(geo("aroBarrilete", () => G.anillo(1.12, 1.0, 0.05)), { x: -0.55, y: 0.3, z: Z.a + 0.15, fin: ACABADO.cepillado, tono: TONO.rodio, ord: 0.52, tipo: "conRueda", dato: { rueda: barr } });
  P(geo("pixel", () => G.tuerca(0.24)), { x: -0.55, y: 0.3, z: Z.a + 0.2, fin: ACABADO.azulado, tono: TONO.azul, ord: 0.96, tipo: "pixel" });
  P(geo("ejeGordo", () => G.eje(Z.a + 0.2, 0.07)), { x: -0.55, y: 0.3, z: Z.placa, ord: 0.2 });
  const m1 = R(14, { de: barr, ang: -0.32, pin: true }), m2 = R(40, { de: m1, coaxial: true, z: Z.b });
  const m3 = R(12, { de: m2, ang: -2.05, pin: true }), esc = R(20, { de: m3, coaxial: true, z: Z.a, sierra: true, tono: TONO.acero });
  // el volante oscila: no engrana, lo mueve el escape
  const vx = -0.62, vy = -1.32;
  P(geo("volante", () => G.volante(0.5)), { x: vx, y: vy, z: Z.b + 0.1, fin: ACABADO.pulido, tono: TONO.rodio, ord: 0.6, tipo: "volante" });
  P(geo("espiral", () => G.espiral(0.05, 0.3, 9, 0.006)), { x: vx, y: vy, z: Z.b + 0.17, fin: ACABADO.azulado, tono: TONO.azul, ord: 0.64, tipo: "volante", dato: { amp: 0.35 } });
  P(geo("ancora", () => G.palanca([[0, 0, 0.06], [0.42, 0.1, 0.035], [0.42, -0.1, 0.035], [-0.3, 0, 0.03]], [[0, 0, 0.022]], 0.05)), { x: ruedas[esc].x - 0.62, y: ruedas[esc].y + 0.12, z: Z.b - 0.02, rz: 0.2, fin: ACABADO.pulido, tono: TONO.acero, ord: 0.58, tipo: "ancora" });
  P(geo("gallo", () => G.puente([[0, 0, 0.16], [0.95, 0.42, 0.13]], [[0, 0, 0.062], [0.95, 0.42, 0.034]], 0.1, 0.022)), { x: vx, y: vy, z: Z.alto + 0.04, fin: ACABADO.ginebra, tono: TONO.acero, ord: 0.72 });
  zafiroEn(ox + vx, oy + vy, Z.alto + 0.062); tornilloEn(ox + vx + 0.95, oy + vy + 0.42, Z.alto + 0.09); pilarEn(ox + vx + 0.95, oy + vy + 0.42, Z.alto - 0.01 - Z.placa);
  ocupados.push([ox + vx + 0.95, oy + vy + 0.42]);
  zona(vx, vy, 0.62);
  const mx = extras([[m2, 24, Z.b, 0.9], [-1, 30, Z.b, 1.2], [barr, 22, Z.a + 0.02, 2.4], [-3, 34, Z.a + 0.02, 2.0]]);
  puenteSobre([m1, m3], { dx0: 0.5, dy0: 0.5, dx1: 0.4, dy1: -0.5 }); if (mx.length > 1) puenteSobre(mx.slice(0, 2), { dx0: 0.4, dy0: 0.6, dx1: 0.5, dy1: 0.5 }); if (mx.length > 3) puenteSobre(mx.slice(2, 4), { dx0: -0.5, dy0: 0.5, dx1: -0.5, dy1: -0.5 });
  cierra("motor");

  /* ----------------------------------------------------------- ventas */
  en("ventas"); subplaca();
  const v0 = R(58, { x: -0.5, y: 0.45 }), v1 = R(14, { de: v0, coaxial: true, pin: true });
  const v2 = R(44, { de: v1, ang: -0.62, z: Z.b }), v3 = R(12, { de: v2, coaxial: true, pin: true });
  const v4 = R(30, { de: v3, ang: -2.2, z: Z.a });
  const v5 = R(36, { de: v0, coaxial: true, z: Z.b + 0.1, sierra: true, tono: TONO.acero, ord: 0.5 });       // trinquete: lo que avanza no vuelve atrás
  P(geo("trinquete", () => G.palanca([[0, 0, 0.07], [0.5, 0.06, 0.03], [0.44, -0.12, 0.02]], [[0, 0, 0.025]], 0.05)), { x: ruedas[v5].x + 1.02 - ox, y: ruedas[v5].y + 0.86 - oy, z: Z.b + 0.1, rz: -2.5, fin: ACABADO.pulido, tono: TONO.acero, ord: 0.62, tipo: "trinquete", dato: { N: 36, rueda: v5 } });
  tornilloEn(ruedas[v5].x + 1.02, ruedas[v5].y + 0.86, Z.b + 0.15, 0.9, 0.7);
  const vxs = extras([[v4, 24, Z.a, 0.3], [-1, 34, Z.a, 0.9], [v2, 22, Z.b, 0.6], [-3, 28, Z.b, 1.2], [v0, 22, Z.a, 2.6]]);
  puenteSobre([v0], { dx0: -1.2, dy0: 1.2, unPie: true }); puenteSobre([v2, v4], { dx0: 1.0, dy0: 0.6, dx1: -1.0, dy1: -0.6 }); if (vxs.length > 1) puenteSobre(vxs.slice(0, 2), { dx0: 0.5, dy0: -0.5, dx1: 0.6, dy1: 0.4 }); if (vxs.length > 3) puenteSobre(vxs.slice(2, 4), { dx0: 0.5, dy0: 0.5, dx1: 0.5, dy1: 0.6 });
  cierra("ventas");

  /* --------------------------------------------------------- clientes */
  en("clientes"); subplaca();
  const c0 = R(46, { x: -0.75, y: -0.75 }), c1 = R(14, { de: c0, coaxial: true, pin: true });
  const c2 = R(34, { de: c1, ang: 0.15, z: Z.b }), c3 = R(24, { de: c2, ang: -1.1, z: Z.b });
  P(geo("estrella", () => G.estrella(8, 0.4)), { x: ruedas[c0].x - ox, y: ruedas[c0].y - oy, z: Z.b + 0.12, fin: ACABADO.pulido, tono: TONO.acero, ord: 0.5, tipo: "conRueda", dato: { rueda: c0 } });
  const bx = 0.85, by = 0.75;
  P(geo("campana", () => G.campana(0.52)), { x: bx, y: by, z: Z.a - 0.05, fin: ACABADO.pulido, tono: TONO.rodio, ord: 0.55 });
  tornilloEn(ox + bx, oy + by, Z.a + 0.15, 0.9, 1.1);
  const px = -0.95, py = 0.95, largo = Math.hypot(bx - 0.56 - px, by - 0.1 - py), angM = Math.atan2(by - 0.1 - py, bx - 0.56 - px);
  P(geo("martillo", () => G.palanca([[0, 0, 0.08], [largo, 0, 0.045], [-0.34, -0.2, 0.035]], [[0, 0, 0.026]], 0.06)), { x: px, y: py, z: Z.b + 0.12, rz: angM, fin: ACABADO.cepillado, tono: TONO.acero, ord: 0.6, tipo: "martillo", dato: { largo, rueda: c0 } });
  P(geo("cabezaMartillo", G.cabezaMartillo), { x: px, y: py, z: Z.b + 0.12, rz: angM, fin: ACABADO.pulido, tono: TONO.rodio, ord: 0.62, tipo: "martillo", dato: { largo, cabeza: true, rueda: c0 } });
  tornilloEn(ox + px, oy + py, Z.b + 0.17, 0.9, 0.8); ocupados.push([ox + px, oy + py]);
  zona(bx, by, 0.62); zona(px, py, 0.2); zona((px + bx) / 2, (py + by) / 2, 0.3);
  const cxs = extras([[c3, 30, Z.a, -0.4], [-1, 22, Z.a, 0.6], [c0, 24, Z.a, 2.2], [-3, 28, Z.a, 1.6]]);
  puenteSobre([c0], { dx0: -0.9, dy0: -0.9, unPie: true }); puenteSobre([c2, c3], { dx0: 0.9, dy0: 0.5, dx1: 0.8, dy1: -0.8 }); if (cxs.length > 1) puenteSobre(cxs.slice(0, 2), { dx0: 0.5, dy0: -0.5, dx1: 0.5, dy1: 0.5 }); if (cxs.length > 3) puenteSobre(cxs.slice(2, 4), { dx0: -0.5, dy0: 0.5, dx1: -0.5, dy1: -0.5 });
  cierra("clientes");

  /* ------------------------------------------------------ operaciones */
  // Una leva de caracol empuja un seguidor; el seguidor mueve una cremallera y la cremallera, un piñón.
  en("operaciones"); subplaca();
  const o0 = R(52, { x: -0.72, y: 0.62 }), o1 = R(14, { de: o0, coaxial: true, pin: true });
  const o2 = R(36, { de: o1, ang: 0.42, z: Z.b }), o3 = R(24, { de: o2, ang: -0.9, z: Z.b });
  const lx = ruedas[o0].x - ox, ly = ruedas[o0].y - oy, zl = Z.b + 0.13, angC = -1.35;
  P(geo("leva", () => G.leva(0.3, 0.68)), { x: lx, y: ly, z: zl, fin: ACABADO.cepillado, tono: TONO.acero, ord: 0.5, tipo: "conRueda", dato: { rueda: o0 } });
  const leva = { rueda: o0, ang: angC, r0: 0.3, r1: 0.68 };
  const sx0 = lx + Math.cos(angC) * 0.3, sy0 = ly + Math.sin(angC) * 0.3, fx = sx0 + 1.5, fy = sy0 - 0.25;      // punta del seguidor (leva en su radio menor) y su pivote
  P(geo("seguidor", () => G.palanca([[0, 0, 0.08], [-Math.hypot(1.5, 0.25), 0, 0.05]], [[0, 0, 0.026]], 0.06)), { x: fx, y: fy, z: zl, rz: Math.atan2(0.25, 1.5) * -1 + 0, fin: ACABADO.cepillado, tono: TONO.rodio, ord: 0.6, tipo: "seguidor", dato: { leva, largo: Math.hypot(1.5, 0.25) } });
  tornilloEn(ox + fx, oy + fy, zl + 0.05, 0.9, 0.8); ocupados.push([ox + fx, oy + fy]);
  const cy = -1.2, pl = R(22, { x: 0.55, y: cy + G.radio(22) + 0.012, z: Z.a, libre: true, tono: TONO.rodio });
  ruedas[pl].k = 0; ruedas[pl].pieza.tipo = "pinonLibre"; ruedas[pl].pieza.dato = { leva, r: G.radio(22) };
  P(geo("cremallera", () => G.cremallera(2.3)), { x: 0.05, y: cy, z: Z.a, fin: ACABADO.cepillado, tono: TONO.rodio, ord: 0.45, tipo: "cremallera", dato: { leva } });
  for (const sx of [-0.6, 0.7]) { P(geo("guia", () => G.disco(0.035, 0.16)), { x: sx, y: cy - 0.1, z: Z.a + 0.03, tono: TONO.acero, ord: 0.5 }); P(geo("arandela", () => G.arandela(0.09)), { x: sx, y: cy - 0.1, z: Z.a + 0.05, tono: TONO.acero, ord: 0.52 }); ocupados.push([ox + sx, oy + cy - 0.1]); }
  for (const zx of [-0.95, -0.35, 0.25, 0.85, 1.3]) zona(zx, cy - 0.02, 0.36); zona(fx, fy, 0.25); zona((fx + sx0) / 2, (fy + sy0) / 2, 0.3);
  const oxs = extras([[o3, 30, Z.a, 0.2], [-1, 22, Z.a, 1.0], [o0, 24, Z.a, 3.0], [-3, 30, Z.a, 3.6]]);
  puenteSobre([o0], { dx0: -1.0, dy0: 1.0, unPie: true }); puenteSobre([o2, o3], { dx0: 0.6, dy0: 0.9, dx1: 1.0, dy1: -0.2 }); if (oxs.length > 1) puenteSobre(oxs.slice(0, 2), { dx0: 0.5, dy0: 0.5, dx1: 0.5, dy1: -0.5 }); if (oxs.length > 3) puenteSobre(oxs.slice(2, 4), { dx0: -0.5, dy0: 0.5, dx1: -0.5, dy1: -0.5 });
  cierra("operaciones");

  /* --------------------------------------------------------- finanzas */
  en("finanzas"); subplaca();
  const f0 = R(40, { x: -1.15, y: 1.0 }), f1 = R(12, { de: f0, coaxial: true, pin: true }), f2 = R(28, { de: f1, ang: -1.45, z: Z.b });
  // el registro: seis tambores de cifras en un mismo eje
  const ty = 0.95, tr = 0.3, ta = 0.3, tz = Z.placa + tr + 0.09;
  for (let k = 0; k < 6; k++) {
    const tx = -0.42 + k * (ta + 0.045);
    info.tambores.push(P(geo("tambor", () => G.tambor(tr, ta)), { x: tx, y: ty, z: tz, mat: "tambor", ord: 0.55 + k * 0.012, tipo: "tambor", dato: { k } }));
    P(geo("tapaTambor", () => G.tapaTambor(tr, ta)), { x: tx, y: ty, z: tz, fin: ACABADO.cepillado, tono: TONO.rodio, ord: 0.54 + k * 0.012, tipo: "tambor", dato: { k, tapa: true } });
  }
  for (const sx of [-0.68, 1.6]) { P(geo("soporte", () => G.puente([[0.3, 0, 0.12], [-0.3, 0, 0.12]], [[-0.1, 0, 0.034]], 0.08, 0.018)), { x: sx, y: ty, z: tz - 0.1, ry: Math.PI / 2, fin: ACABADO.cepillado, tono: TONO.rutenio, ord: 0.5 }); }
  P(geo("ejeTambor", () => { const g = G.eje(2.44, 0.03); g.rotateY(Math.PI / 2); return g; }), { x: -0.76, y: ty, z: tz, tono: TONO.acero, ord: 0.48 });
  // la bandeja del documento y la lupa que lo lee
  const dx = 0.42, dy = -0.92;
  P(geo("bandeja", () => G.platina(1.24, 1.66, 0.1, 0.05)), { x: dx, y: dy, z: Z.placa + 0.03, fin: ACABADO.negro, tono: TONO.negro, ord: 0.3 });
  info.documento = { x: ox + dx, y: oy + dy, z: Z.placa + 0.066, w: 1.06, h: 1.06 * 544 / 384 };
  info.lupa = P(geo("lupa", () => G.lupa(0.46)), { x: dx, y: dy, z: Z.puente - 0.05, fin: ACABADO.pulido, tono: TONO.rodio, ord: 0.8, tipo: "lupa" });
  info.lente = P(geo("lente", () => G.lente(0.4)), { x: dx, y: dy, z: Z.puente - 0.03, mat: "cristal", ord: 0.82, tipo: "lupa" });
  P(geo("brazoLupa", () => G.palanca([[0, 0, 0.08], [1.25, 0, 0.05]], [[0, 0, 0.03]], 0.06)), { x: dx - 1.25 - 0.46, y: dy, z: Z.puente - 0.02, fin: ACABADO.cepillado, tono: TONO.acero, ord: 0.78, tipo: "lupa", dato: { brazo: true } });
  ocupados.push([ox + dx, oy + dy], [ox + dx - 0.5, oy + dy - 0.6], [ox + dx + 0.5, oy + dy + 0.6], [ox + dx - 0.5, oy + dy + 0.6], [ox + dx + 0.5, oy + dy - 0.6]);
  for (let k = 0; k < 7; k++) zona(-0.6 + k * 0.36, ty, 0.42); zona(dx, dy, 0.98); zona(dx - 1.0, dy, 0.3);
  const fxs = extras([[f2, 22, Z.a, -1.6], [-1, 30, Z.a, -1.2], [-2, 22, Z.b, -1.0], [f0, 22, Z.b, 2.6]]);
  puenteSobre([f0, f2], { dx0: -0.6, dy0: 0.7, dx1: -0.6, dy1: -1.0 }); if (fxs.length > 1) puenteSobre(fxs.slice(0, 2), { dx0: -0.5, dy0: -0.5, dx1: 0.3, dy1: -0.6 });
  cierra("finanzas");

  /* -------------------------------------------------------- dirección */
  en("direccion"); subplaca();
  const d0 = R(36, { x: -1.0, y: 1.05 }), d1 = R(12, { de: d0, coaxial: true, pin: true }), d2 = R(30, { de: d1, ang: -0.1, z: Z.b }), d3 = R(22, { de: d2, ang: 0.2, z: Z.b });
  const gx = 0, gy = -1.15;
  P(geo("sector", () => G.sector(1.02, 1.36, 0.42, 2.72)), { x: gx, y: gy, z: Z.placa + 0.04, fin: ACABADO.arenado, tono: TONO.negro, ord: 0.3 });
  for (let k = 0; k <= 20; k++) { const a = 0.5 + (k / 20) * 2.14, l = k % 5 === 0; P(geo(l ? "marcaL" : "marca", () => G.marca(l ? 0.2 : 0.11, l ? 0.014 : 0.008)), { x: gx + Math.cos(a) * (l ? 1.09 : 1.15), y: gy + Math.sin(a) * (l ? 1.09 : 1.15), z: Z.placa + 0.07, rz: a - Math.PI / 2, tono: TONO.rodio, ord: 0.4 + k * 0.004 }); }
  info.aguja = P(geo("aguja", () => G.aguja(1.22)), { x: gx, y: gy, z: Z.a + 0.1, rz: 2.64, fin: ACABADO.azulado, tono: TONO.azul, ord: 0.85, tipo: "aguja" });
  P(geo("ejeAguja", () => G.eje(Z.a + 0.14, 0.035)), { x: gx, y: gy, z: Z.placa, ord: 0.3 }); zafiroEn(ox + gx, oy + gy, Z.a + 0.12, 0.9);
  for (const sx of [-1.35, 1.35]) { P(geo("subesfera", () => G.anillo(0.36, 0.3, 0.04)), { x: sx, y: gy + 0.1, z: Z.placa + 0.04, fin: ACABADO.cepillado, tono: TONO.rodio, ord: 0.35 }); P(geo("agujita", () => G.aguja(0.27)), { x: sx, y: gy + 0.1, z: Z.placa + 0.1, k: sx < 0 ? 1.6 : -0.9, tono: TONO.rodio, ord: 0.86, tipo: "giro" }); ocupados.push([ox + sx, oy + gy + 0.1]); }
  ocupados.push([ox + gx, oy + gy]);
  zona(gx, gy, 1.45); zona(-1.35, gy + 0.1, 0.42); zona(1.35, gy + 0.1, 0.42);
  const dxs = extras([[d3, 28, Z.a, 0.3], [-1, 22, Z.a, 0.9], [d0, 24, Z.a, 1.6], [d2, 22, Z.a, 1.5]]);
  puenteSobre([d0, d2, d3], { dx0: -0.4, dy0: -0.7, dx1: 0.5, dy1: -0.6 }); if (dxs.length > 1) puenteSobre(dxs.slice(0, 2), { dx0: 0.5, dy0: 0.5, dx1: 0.5, dy1: -0.4 });
  cierra("direccion");

  /* ----------------------------------------------------- transmisiones */
  // De cada módulo al siguiente: se busca la pareja de ruedas más cercana y se tiende entre ellas una o dos ruedas locas.
  mod = 6; ox = 0; oy = 0;
  const arbol = vertical ? [["motor", "ventas"], ["motor", "finanzas"], ["motor", "operaciones"], ["ventas", "clientes"], ["finanzas", "direccion"]] : [["motor", "ventas"], ["motor", "clientes"], ["motor", "finanzas"], ["ventas", "operaciones"], ["clientes", "direccion"]];
  info.transmisiones = [];
  for (const [a, b] of arbol) {
    const A = ruedas.filter((r) => r.mod === MODULOS.indexOf(a) && !r.pin && r.z <= Z.b + 0.01), B = ruedas.filter((r) => r.mod === MODULOS.indexOf(b) && !r.pin && r.z <= Z.b + 0.01);
    let par = null, mh = 1e9;
    for (const p of A) for (const q of B) { const h = Math.hypot(p.x - q.x, p.y - q.y) - p.r - q.r; if (h > 0.8 && h < mh) { mh = h; par = [p, q]; } }
    const [p, q] = par, n = mh > 2.1 ? 2 : 1, rc = mh / (2 * n), N = Math.max(14, Math.round((2 * rc) / G.MOD)), ux = (q.x - p.x) / Math.hypot(q.x - p.x, q.y - p.y), uy = (q.y - p.y) / Math.hypot(q.x - p.x, q.y - p.y);
    let previo = p.i; const locas = [];
    for (let j = 0; j < n; j++) {
      const d = p.r + rc + j * 2 * rc, x = p.x + ux * d, y = p.y + uy * d;
      const i = R(N, { x, y, z: (j % 2 ? q.z : p.z), tono: TONO.azul, ord: 0.4 + j * 0.05 }); ruedas[i].pieza.fin = ACABADO.azulado; aristas.push([previo, i, "engrana"]); previo = i; locas.push(i);
      P(geo("puenteLoca", () => G.puente([[0, 0, 0.2], [0.42, 0.3, 0.14], [-0.42, -0.3, 0.14]], [[0, 0, 0.062], [0.42, 0.3, 0.034], [-0.42, -0.3, 0.034]], 0.09, 0.022)), { x, y, z: Z.puente + 0.04, rz: Math.atan2(uy, ux) + 0.9, fin: ACABADO.pulido, tono: TONO.negro, ord: 0.75 });
      zafiroEn(x, y, Z.puente + 0.058, 0.9); P(geo("eje", () => G.eje(Z.puente - Z.placa + 0.02)), { x, y, z: Z.placa, ord: 0.3 });
      const ca = Math.cos(Math.atan2(uy, ux) + 0.9), sa = Math.sin(Math.atan2(uy, ux) + 0.9);
      for (const s of [1, -1]) tornilloEn(x + s * (0.42 * ca - 0.3 * sa), y + s * (0.42 * sa + 0.3 * ca), Z.puente + 0.085, 0.95, 0.85);
    }
    aristas.push([previo, q.i, "engrana"]);
    info.transmisiones.push({ de: a, a: b, x: (p.x + q.x) / 2, y: (p.y + q.y) / 2, locas });
  }

  /* ------------------------------------------------------- cinemática */
  const fijar = (i, k, fase) => { ruedas[i].k = k; ruedas[i].fase = fase; };
  fijar(barr, 1, 0);
  const cola = [barr];
  while (cola.length) {
    const i = cola.shift(), a = ruedas[i];
    for (const [u, v, t] of aristas) {
      const j = u === i ? v : v === i ? u : -1; if (j < 0 || ruedas[j].k !== null) continue;
      const b = ruedas[j];
      if (t === "coaxial") fijar(j, a.k, a.fase);
      else { const ang = Math.atan2(b.y - a.y, b.x - a.x), pa = TAU / a.N, pb = TAU / b.N, fa = ((((ang - a.fase) % pa) + pa) % pa) / pa; fijar(j, (-a.k * a.N) / b.N, ang + Math.PI - (0.5 - fa) * pb); }
      cola.push(j);
    }
  }
  for (const r of ruedas) { if (r.k === null && !r.libre) { avisos.push(`rueda suelta ${r.i} (módulo ${r.mod})`); } r.k = r.k || 0; r.pieza.k = r.k; r.pieza.fase = r.fase; }
  for (const p of piezas) if (p.dato && p.dato.rueda !== undefined) { const r = ruedas[p.dato.rueda]; p.k = r.k; if (p.tipo !== "trinquete" && p.tipo !== "martillo") p.fase = r.fase; p.dato.kr = r.k; p.dato.fr = r.fase; p.dato.N = p.dato.N || r.N; p.dato.rr = r.r; }
  for (const p of piezas) if (p.dato && p.dato.leva) { const r = ruedas[p.dato.leva.rueda]; p.dato.leva.k0 = r.k; p.dato.leva.f0 = r.fase; }

  info.ruedas = ruedas.map((r) => ({ x: r.x, y: r.y, z: r.z, r: r.r, N: r.N, k: r.k, mod: r.mod }));
  info.z = Z; info.avisos = avisos; info.celda = C;
  return { piezas, geos, info };
}
