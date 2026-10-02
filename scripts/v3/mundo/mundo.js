/* ==========================================================================
   EL MUNDO DE D-CODE · una sala, un material (el papel) y una idea:
   el trabajo de una empresa pasa del desorden a un sistema.
   --------------------------------------------------------------------------
   WebGL2 a mano, sin librerías: unas pocas llamadas de dibujo por cuadro.
     · Cada hoja es una instancia. Su posición sale de mezclar dónde estaría en
       la tormenta (función del tiempo) con dónde está en el sistema (carril o
       pila), según el capítulo y un retraso propio: así el orden llega como
       una ola.
     · La profundidad de campo no es un filtro de pantalla: cada hoja se
       desenfoca sola (se agranda, se difumina el borde y se lee una versión
       más pequeña de su textura). Cuesta lo mismo en un teléfono.
     · Las sombras se proyectan desde el foco sobre el suelo, sin mapas.
   API: crearMundo(lienzo, opciones) → { capitulo, puntero, sostener, … }
   ========================================================================== */
import { M4, perspectiva, mirar, mul, invertir, qEje, qMul, qMezcla, fijar, mezcla, suave, cubica, azar } from "./mat.js";
import { crearAtlas, COLS, FILAS } from "./atlas.js";
import { HOJA_V, HOJA_F, SOMBRA_V, SOMBRA_F, SUELO_V, SUELO_F, CAJA_V, CAJA_F, BRUMA_V, BRUMA_F } from "./sombras.js";

export function hayWebGL2() { try { return !!document.createElement("canvas").getContext("webgl2"); } catch (e) { return false; } }

const TW = 0.5, TH = 0.7;                       // la hoja
const ZC = (l) => (l - 2) * 2.6;                // los cinco carriles
const X0 = -9, X1 = 9, XG1 = -3, XG2 = 3;       // un carril: entrada, lectura, clasificación, salida
const TIPOS_CARRIL = [[1, 2, 8], [3, 2, 11], [13, 6, 5], [0, 10, 7], [4, 12, 14]];
export const DESTACADAS = [0, 3, 1, 4];         // presupuesto, factura, conversación, hoja de cálculo
export const FACTURA = 3;
const G = Math.PI / 180;

/* Los capítulos. h: cámara en apaisado · v: en vertical. Todo se interpola. */
const CAPS = [
  { n: "claro", h: { p: [0, 3.0, 11.8], m: [0, 3.15, 0], fov: 34, foco: 11.6, ab: 0.5, d: [0, 0] }, v: { p: [0, 3.7, 15.5], m: [0, 3.9, 0], fov: 50, foco: 15, ab: 0.5, d: [0, 0] },
    luz: { p: [3.5, 15, 5], m: [0, 2.4, 0], ang: 31, i: 2.6, amb: 0.04 }, dens: 0.014, ts: 1, ojo: 1, obra: 0, noche: 0, bruma: 0.75, vel: 0.5, sombra: 0.5 },
  { n: "hoy", h: { p: [-2.6, 2.7, 7.4], m: [1.5, 2.95, 0], fov: 38, foco: 5.6, ab: 0.95, d: [0, 0] }, v: { p: [0, 3.2, 9.2], m: [0, 3.6, 0], fov: 52, foco: 4.9, ab: 0.8, d: [0, 0] },
    luz: { p: [-1, 9, 9], m: [1.6, 2.7, 2.6], ang: 26, i: 1.5, amb: 0.03 }, dens: 0.04, ts: 0.1, ojo: 0, obra: 0, noche: 0, bruma: 0.5, vel: 0.5, sombra: 0.5 },
  { n: "sistema", h: { p: [-12.5, 7.6, 13.5], m: [0.6, 0.1, -1.8], fov: 31, foco: 19, ab: 0.2, d: [0.36, 0.06] }, v: { p: [-13, 12.5, 19], m: [0.2, 0, -1.6], fov: 43, foco: 26, ab: 0.16, d: [0, 0.32] },
    luz: { p: [-3, 17, 6], m: [0, 0, -1.5], ang: 43, i: 2.3, amb: 0.05 }, dens: 0.015, ts: 1, ojo: 0, obra: 1, noche: 0, bruma: 0.7, vel: 0.5, sombra: 0.7 },
  { n: "inteligencia", h: { p: [-5.0, 2.5, 2.9], m: [-2.75, 0.42, 0.05], fov: 33, foco: 4.0, ab: 0.5, d: [0.34, -0.02] }, v: { p: [-5.2, 3.1, 3.4], m: [-2.8, 0.42, 0], fov: 44, foco: 4.5, ab: 0.5, d: [0, 0.34] },
    luz: { p: [-3.6, 5.5, 2.2], m: [-2.8, 0.4, 0], ang: 32, i: 2.1, amb: 0.035 }, dens: 0.03, ts: 1, ojo: 0, obra: 1, noche: 0.2, bruma: 0.8, vel: 0.2, sombra: 0.75 },
  { n: "automatizacion", h: { p: [-12.2, 3.1, 2.2], m: [3, 0.2, -0.6], fov: 38, foco: 9, ab: 0.3, d: [0.2, 0.06] }, v: { p: [-13, 4.6, 1.6], m: [3, 0.2, 0], fov: 50, foco: 10.5, ab: 0.26, d: [0, 0.34] },
    luz: { p: [9, 12, -8], m: [-3, 0, 0], ang: 46, i: 0.75, amb: 0.03 }, dens: 0.026, ts: 1, ojo: 0, obra: 1, noche: 1, bruma: 1.2, vel: 1.25, sombra: 0.5 },
  { n: "finance", h: { p: [-0.2, 1.72, 13.6], m: [-0.2, 1.72, 9.5], fov: 30, foco: 4.1, ab: 0.34, d: [0.42, 0] }, v: { p: [0, 1.72, 14.4], m: [0, 1.72, 9.5], fov: 44, foco: 4.9, ab: 0.3, d: [0, 0.42] },
    luz: { p: [2.6, 4.6, 15.5], m: [0, 1.7, 9.5], ang: 17, i: 2.0, amb: 0.025 }, dens: 0.03, ts: 1, ojo: 0, obra: 1, noche: 0.35, bruma: 0.9, vel: 0.3, sombra: 0.75 },
  { n: "resultado", h: { p: [0, 40, 5.5], m: [0, 0, -3.4], fov: 30, foco: 41, ab: 0.02, d: [0.46, 0] }, v: { p: [0, 46, 5], m: [0, 0, -3.4], fov: 40, foco: 46, ab: 0.02, d: [0, 0.3] },
    luz: { p: [0, 42, 2], m: [0, 0, -3], ang: 34, i: 1.9, amb: 0.14 }, dens: 0.003, ts: 1, ojo: 0, obra: 1, noche: 0, bruma: 0.1, vel: 0.5, sombra: 0.85 },
  { n: "demos", h: { p: [3, 34, 9], m: [1, 0, -3.4], fov: 30, foco: 35, ab: 0.02, d: [0, 0] }, v: { p: [0, 44, 8], m: [0, 0, -3.4], fov: 40, foco: 44, ab: 0.02, d: [0, 0] },
    luz: { p: [0, 42, 2], m: [0, 0, -3], ang: 34, i: 0.9, amb: 0.08 }, dens: 0.003, ts: 1, ojo: 0, obra: 1, noche: 0.2, bruma: 0.08, vel: 0.4, sombra: 0.8 },
  { n: "tuyo", h: { p: [0, 1.6, 14.6], m: [0, 1.75, 0], fov: 32, foco: 5.1, ab: 0.4, d: [0.36, 0] }, v: { p: [0, 1.6, 16], m: [0, 1.9, 0], fov: 44, foco: 6.5, ab: 0.34, d: [0, 0.36] },
    luz: { p: [2.2, 6.5, 15.5], m: [0, 1.5, 9.5], ang: 15, i: 2.3, amb: 0.03 }, dens: 0.03, ts: 1, ojo: 0, obra: 1, noche: 0.25, bruma: 1.6, vel: 0.4, sombra: 0.8 },
];
export const CAPITULOS = CAPS.map((c) => c.n);

function programa(gl, v, f) {
  const p = gl.createProgram();
  for (const [t, s] of [[gl.VERTEX_SHADER, v], [gl.FRAGMENT_SHADER, f]]) { const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh); if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh)); gl.attachShader(p, sh); }
  gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const u = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) { const a = gl.getActiveUniform(p, i); u[a.name] = gl.getUniformLocation(p, a.name); }
  return { p, u };
}

export function crearMundo(lienzo, op = {}) {
  const movil = !!op.movil;
  const N = op.hojas || (movil ? 900 : 2400);
  const gl = lienzo.getContext("webgl2", { alpha: false, antialias: false, depth: true, stencil: false, powerPreference: "high-performance", preserveDrawingBuffer: !!op.captura });
  if (!gl) return null;
  let reflejar = op.reflejo !== undefined ? op.reflejo : !movil, escalaPx = 1;
  const pasosBruma = op.pasosBruma || (movil ? 10 : 20);

  /* ------------------------------------------------------------ programas */
  const pHoja = programa(gl, HOJA_V, HOJA_F), pSombra = programa(gl, SOMBRA_V, SOMBRA_F), pSuelo = programa(gl, SUELO_V, SUELO_F), pCaja = programa(gl, CAJA_V, CAJA_F), pBruma = programa(gl, BRUMA_V, BRUMA_F(pasosBruma));

  /* ---------------------------------------------------------------- atlas */
  const atlas = crearAtlas(op.idioma || "es", movil ? 0.5 : 1);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas.lienzo);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const anis = gl.getExtension("EXT_texture_filter_anisotropic"); if (anis && !op.sinAnis) gl.texParameterf(gl.TEXTURE_2D, anis.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, gl.getParameter(anis.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
  const pxCelda = atlas.lienzo.width / COLS;

  /* ------------------------------------------------------------ geometría */
  // la hoja: una rejilla de 3×6 para que pueda doblarse
  const NX = 3, NY = 6, vh = [], ih = [];
  for (let y = 0; y <= NY; y++) for (let x = 0; x <= NX; x++) vh.push(x / NX - 0.5, y / NY - 0.5);
  for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) { const a = y * (NX + 1) + x, b = a + 1, c = a + NX + 1, d = c + 1; ih.push(a, b, c, b, d, c); }
  const bufHoja = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bufHoja); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vh), gl.STATIC_DRAW);
  const idxHoja = gl.createBuffer();
  const datos = new Float32Array(N * 16), bufInst = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufInst); gl.bufferData(gl.ARRAY_BUFFER, datos.byteLength, gl.DYNAMIC_DRAW);
  const vaoHoja = gl.createVertexArray(); gl.bindVertexArray(vaoHoja);
  gl.bindBuffer(gl.ARRAY_BUFFER, bufHoja); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxHoja); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ih), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, bufInst);
  for (let a = 0; a < 4; a++) { gl.enableVertexAttribArray(1 + a); gl.vertexAttribPointer(1 + a, 4, gl.FLOAT, false, 64, a * 16); gl.vertexAttribDivisor(1 + a, 1); }
  // un cuadrado (suelo y bruma)
  const vaoCuad = gl.createVertexArray(); gl.bindVertexArray(vaoCuad);
  const bufCuad = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bufCuad); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  // un cubo (mesas, pórticos, haces)
  const cv = []; const caras = [[0, 0, 1, 1, 0, 0, 0, 1, 0], [0, 0, -1, -1, 0, 0, 0, 1, 0], [1, 0, 0, 0, 0, -1, 0, 1, 0], [-1, 0, 0, 0, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 0, 0, 0, -1], [0, -1, 0, 1, 0, 0, 0, 0, 1]];
  for (const [nx, ny, nz, ux, uy, uz, wx, wy, wz] of caras) for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, -1], [1, 1], [-1, 1]]) cv.push((nx + ux * a + wx * b) / 2, (ny + uy * a + wy * b) / 2, (nz + uz * a + wz * b) / 2, nx, ny, nz);
  const vaoCaja = gl.createVertexArray(); gl.bindVertexArray(vaoCaja);
  const bufCubo = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bufCubo); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cv), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0); gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
  const cajas = []; // [x, y, z, sx, sy, sz, tipo, crece: 0 = en x, 1 = en y]
  for (let l = 0; l < 5; l++) {
    const z = ZC(l);
    cajas.push([(X0 + XG2) / 2, 0.385, z, XG2 - X0, 0.03, 0.82, 0, 0]);
    for (let x = X0 + 0.6; x < XG2; x += 2.6) cajas.push([x, 0.185, z, 0.05, 0.37, 0.66, 0, 1]);
    for (let s = -1; s <= 1; s++) { cajas.push([(XG2 + X1) / 2, 0.385, z + s * 0.86, X1 - XG2, 0.03, 0.66, 0, 0]); for (let x = XG2 + 0.9; x < X1; x += 2.4) cajas.push([x, 0.185, z + s * 0.86, 0.05, 0.37, 0.5, 0, 1]); }
    for (const s of [-1, 1]) cajas.push([XG1, 0.66, z + s * 0.56, 0.04, 1.32, 0.04, 0, 1]);
    cajas.push([XG1, 1.34, z, 0.04, 0.04, 1.16, 0, 1]);
    cajas.push([XG1, 0.86, z, 0.012, 0.92, 1.08, 1, 1]);                       // el haz que lee
    for (const s of [-1, 1]) cajas.push([XG2, 0.5, z + s * 1.24, 0.04, 1.0, 0.04, 0, 1]);
    cajas.push([XG2, 1.02, z, 0.04, 0.04, 2.52, 0, 1]);
  }
  const datosCaja = new Float32Array(cajas.length * 7), bufCaja = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufCaja); gl.bufferData(gl.ARRAY_BUFFER, datosCaja.byteLength, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 28, 0); gl.vertexAttribDivisor(2, 1);
  gl.enableVertexAttribArray(3); gl.vertexAttribPointer(3, 4, gl.FLOAT, false, 28, 12); gl.vertexAttribDivisor(3, 1);
  gl.bindVertexArray(null);
  let obraPintada = -1;
  function levantar(b) {
    if (Math.abs(b - obraPintada) < 0.0015) return; obraPintada = b;
    cajas.forEach((c, k) => {
      const retraso = (c[0] - X0) / (X1 - X0) * 0.5, e = cubica(fijar((b - retraso * 0.6) / 0.7, 0, 1)), o = k * 7;
      const sx = c[7] ? c[3] : c[3] * e, sy = c[7] ? c[4] * e : c[4];
      datosCaja[o] = c[7] ? c[0] : c[0] - (c[3] - sx) / 2; datosCaja[o + 1] = c[7] ? c[1] - (c[4] - sy) / 2 : c[1]; datosCaja[o + 2] = c[2];
      datosCaja[o + 3] = sx; datosCaja[o + 4] = sy; datosCaja[o + 5] = c[5] * (e > 0 ? 1 : 0); datosCaja[o + 6] = c[6];
    });
    gl.bindBuffer(gl.ARRAY_BUFFER, bufCaja); gl.bufferSubData(gl.ARRAY_BUFFER, 0, datosCaja);
  }

  /* ---------------------------------------------------------------- hojas */
  const r = azar(op.semilla || 20261002);
  const NPC = 40, NL = NPC * 5;                               // hojas por carril · en carriles
  const colsP = movil ? 10 : 18, capP = Math.ceil((N - NL) / (colsP * (movil ? 3 : 4)));
  const sem = new Float32Array(N), sem2 = new Float32Array(N), tipo = new Float32Array(N), retraso = new Float32Array(N);
  const tr0 = new Float32Array(N), tth = new Float32Array(N), ty0 = new Float32Array(N), tw = new Float32Array(N), tf1 = new Float32Array(N), tf2 = new Float32Array(N), tp1 = new Float32Array(N), tp2 = new Float32Array(N);
  const eje = new Float32Array(N * 3), giro = new Float32Array(N), pila = new Float32Array(N * 4), muro = new Float32Array(N * 2);
  const vx = new Float32Array(N), vy = new Float32Array(N), vz = new Float32Array(N), sost = new Float32Array(N);
  const act = new Float32Array(N * 3);                         // posición actual (para anclar rótulos)
  const baraja = Array.from({ length: N }, (_, i) => i); for (let i = N - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [baraja[i], baraja[j]] = [baraja[j], baraja[i]]; }
  const colsM = movil ? 30 : 64;
  for (let i = 0; i < N; i++) {
    sem[i] = r(); sem2[i] = r();
    tr0[i] = 1.4 + Math.sqrt(r()) * (movil ? 7.5 : 10.4); tth[i] = r() * Math.PI * 2; ty0[i] = 0.8 + r() * 6.6;
    tw[i] = (0.1 + 0.2 * r()) * (7 / (tr0[i] + 3)); tf1[i] = 0.2 + r() * 0.5; tf2[i] = 0.25 + r() * 0.6; tp1[i] = r() * 6.28; tp2[i] = r() * 6.28;
    let ax = r() - 0.5, ay = r() - 0.5, az = r() - 0.5; const l = Math.hypot(ax, ay, az) || 1; eje[i * 3] = ax / l; eje[i * 3 + 1] = ay / l; eje[i * 3 + 2] = az / l; giro[i] = (0.35 + r() * 1.2) * (r() < 0.5 ? -1 : 1);
    muro[i * 2] = (baraja[i] % colsM) - (colsM - 1) / 2; muro[i * 2 + 1] = Math.floor(baraja[i] / colsM) - Math.floor(N / colsM) / 2;
    if (i < NL) {
      const l2 = i % 5, k = Math.floor(i / 5); tipo[i] = TIPOS_CARRIL[l2][k % 3]; retraso[i] = 0.05 + (k / NPC) * 0.3 + l2 * 0.02;
    } else {
      const j = i - NL, p = Math.floor(j / capP), nivel = j % capP, col = p % colsP, fila = Math.floor(p / colsP);
      pila[i * 4] = (col - (colsP - 1) / 2) * (movil ? 1.25 : 1.0) + (r() - 0.5) * 0.012; pila[i * 4 + 1] = 0.012 + nivel * 0.0135; pila[i * 4 + 2] = -8.4 - fila * 1.2 + (r() - 0.5) * 0.012; pila[i * 4 + 3] = (r() - 0.5) * 0.07;
      tipo[i] = p % 15; retraso[i] = Math.min(1, 0.3 + (col / colsP) * 0.3 + fila * 0.06 + (nivel / capP) * 0.2);
    }
  }
  const BLANCA = N - 1; tipo[BLANCA] = 15;
  // en la tormenta, las destacadas pasan cerca del centro
  DESTACADAS.forEach((i, k) => { tr0[i] = 2.2 + k * 0.5; ty0[i] = 2.4 + k * 0.5; });

  /* -------------------------------------------------------------- estado */
  const est = { cap: 0, capObj: 0, capVel: 0, T: 0, tc: 0, tl: 0, intro: op.intro === false ? 1 : 0, lectura: 0, campos: 0, carril: -1, mano: 0, manoObj: 0, px: 0, py: 0, hayPuntero: false, vertical: false, ancho: 1, alto: 1, dpr: 1 };
  const P = M4(), V = M4(), VP = M4(), INV = M4();
  const cam = { p: [0, 0, 0], m: [0, 0, 0], dir: [0, 0, -1], fov: 34, foco: 10, ab: 0.5, d: [0, 0] };
  const luz = { p: [0, 0, 0], dir: [0, -1, 0], ci: 0.9, ce: 0.8, i: 1, amb: 0.05 };
  const mz = { dens: 0.016, ts: 1, ojo: 1, obra: 0, noche: 0, bruma: 1, vel: 0.5, sombra: 0.5 };
  const rayo = { o: [0, 0, 0], d: [0, 0, -1] };
  const A = new Float32Array(14), B = new Float32Array(14), Q = new Float32Array(8);
  const claves = new Float32Array(N), orden = new Uint32Array(N).map((_, i) => i);
  const posCam = (c) => (est.vertical ? c.v : c.h);
  const QP = new Float32Array(4); qEje(QP, 0, 1, 0, 0, -Math.PI / 2);       // tumbada: la cara hacia arriba

  const QT = new Float32Array(8);
  function plana(o, k, guinada) { qEje(QT, 4, 0, 1, 0, guinada); qMul(o, k, QT, 4, QP, 0); }

  // dónde está la hoja i en el capítulo s → o[0..13] = pos, giro, orden, escala, alfa, sello, lectura, luz, campos
  function destino(i, s, o) {
    o[7] = 0; o[8] = 1; o[9] = 1; o[10] = 0; o[11] = 0; o[12] = 0; o[13] = 0;
    if (s === 0) return;
    if (s === 1) {
      const k = DESTACADAS.indexOf(i); if (k < 0) return;
      // las cuatro, en un mismo plano frente a la cámara de este capítulo: todas a foco
      const v = est.vertical, t = est.T, c = v ? CAPS[1].v : CAPS[1].h;
      let fx = c.m[0] - c.p[0], fy = c.m[1] - c.p[1], fz = c.m[2] - c.p[2]; const fl = Math.hypot(fx, fy, fz); fx /= fl; fy /= fl; fz /= fl;
      let rx = -fz, rz = fx; const rl = Math.hypot(rx, rz); rx /= rl; rz /= rl;                 // derecha
      const ux = -rz * fy, uy = rz * fx - rx * fz, uz = rx * fy;                                     // arriba
      const L = v ? [[-0.72, 1.35], [0.74, 0.62], [-0.7, -0.28], [0.72, -1.02]] : [[0.25, 1.02], [2.25, 0.5], [0.72, -0.98], [2.75, -1.12]], D = v ? 5.4 : 6.0;
      const a = L[k][0], b2 = L[k][1] + Math.sin(t * 0.5 + k * 1.7) * 0.04;
      o[0] = c.p[0] + fx * D + rx * a + ux * b2; o[1] = c.p[1] + fy * D + uy * b2; o[2] = c.p[2] + fz * D + rz * a + uz * b2;
      qEje(o, 3, 0, 1, 0, Math.atan2(-fx, -fz) + (k % 2 ? 0.14 : -0.12)); qEje(QT, 0, 0, 0, 1, (k - 1.5) * 0.06); qMul(o, 3, o, 3, QT, 0);
      o[7] = 1; o[8] = v ? 1.45 : 2.0; o[12] = 0.2; return;
    }
    if (s === 5 && i === FACTURA) { o[0] = 0; o[1] = 1.72 + Math.sin(est.T * 0.6) * 0.012; o[2] = 9.5; qEje(o, 3, 0, 1, 0, Math.sin(est.T * 0.4) * 0.03); o[7] = 1; o[8] = est.vertical ? 2.2 : 2.45; o[10] = suave(0.9, 1, est.lectura); o[11] = est.lectura; o[13] = est.campos; o[12] = 0.06; return; }
    if (s === 8 && i === BLANCA) { o[0] = 0; o[1] = 1.8 + Math.sin(est.T * 0.7) * 0.05; o[2] = 9.5; qEje(o, 3, 0, 1, 0, Math.sin(est.T * 0.45) * 0.22); qEje(QT, 0, 1, 0, 0, -0.1); qMul(o, 3, o, 3, QT, 0); o[7] = 1; o[8] = est.vertical ? 1.9 : 2.2; o[10] = 1; o[12] = 0.04; return; }
    o[7] = 1;
    if (i < NL) {
      const l = i % 5, k = Math.floor(i / 5), u = (k / NPC + est.tl / (NPC * 0.75)) % 1;
      const x = u < 0.4 ? X0 + (u / 0.4) * (XG2 - X0) : XG2 + ((u - 0.4) / 0.6) * (X1 - XG2);
      const des = 1 - suave(XG1 - 0.95, XG1 - 0.1, x), sub = (k % 3) - 1;
      o[0] = x; o[1] = 0.412 + des * (0.1 + 0.07 * Math.sin(est.T * 1.4 + sem[i] * 30)); o[2] = ZC(l) + sub * 0.86 * suave(XG2 + 0.1, XG2 + 1.5, x) + des * (sem2[i] - 0.5) * 0.5;
      plana(o, 3, des * (sem[i] - 0.5) * 1.5);
      if (des > 0) { qEje(QT, 0, 0, 0, 1, des * (sem2[i] - 0.5) * 0.5); qMul(o, 3, o, 3, QT, 0); }
      o[9] = suave(X0, X0 + 0.8, x) * (1 - suave(X1 - 0.8, X1, x));
      o[10] = suave(XG1 - 0.12, XG1 + 0.3, x); o[11] = fijar((x - (XG1 - 0.5)) / 0.95, 0, 1); o[13] = (x > XG1 - 0.5 ? 1 : 0) * (1 - suave(XG1 + 0.6, XG1 + 2.2, x));
      if (est.carril >= 0) o[12] = l === est.carril ? 0.16 : -0.0;
    } else { o[0] = pila[i * 4]; o[1] = pila[i * 4 + 1]; o[2] = pila[i * 4 + 2]; plana(o, 3, pila[i * 4 + 3]); o[10] = 1; }
  }

  /* --------------------------------------------------------------- cámara */
  function mezclarCapitulos() {
    const c = fijar(est.cap, 0, CAPS.length - 1), a = Math.min(CAPS.length - 2, Math.floor(c)), p = suave(0.18, 0.82, c - a), ca = CAPS[a], cb = CAPS[a + 1], ha = posCam(ca), hb = posCam(cb);
    for (let k = 0; k < 3; k++) { cam.p[k] = mezcla(ha.p[k], hb.p[k], p); cam.m[k] = mezcla(ha.m[k], hb.m[k], p); luz.p[k] = mezcla(ca.luz.p[k], cb.luz.p[k], p); }
    cam.fov = mezcla(ha.fov, hb.fov, p); cam.foco = mezcla(ha.foco, hb.foco, p); cam.ab = mezcla(ha.ab, hb.ab, p); cam.d[0] = mezcla(ha.d[0], hb.d[0], p); cam.d[1] = mezcla(ha.d[1], hb.d[1], p);
    let dx = mezcla(ca.luz.m[0], cb.luz.m[0], p) - luz.p[0], dy = mezcla(ca.luz.m[1], cb.luz.m[1], p) - luz.p[1], dz = mezcla(ca.luz.m[2], cb.luz.m[2], p) - luz.p[2]; const l = Math.hypot(dx, dy, dz) || 1; luz.dir[0] = dx / l; luz.dir[1] = dy / l; luz.dir[2] = dz / l;
    const ang = mezcla(ca.luz.ang, cb.luz.ang, p) * G; luz.ce = Math.cos(ang); luz.ci = Math.cos(ang * 0.62); luz.i = mezcla(ca.luz.i, cb.luz.i, p); luz.amb = mezcla(ca.luz.amb, cb.luz.amb, p);
    for (const k in mz) mz[k] = mezcla(ca[k], cb[k], p);
    return { a, p };
  }
  function camara() {
    // el pulso de quien sostiene la cámara, y el puntero mueve un poco el punto de vista
    const t = est.T, pv = est.hayPuntero ? 1 : 0, cerca = Math.min(1, Math.hypot(cam.p[0] - cam.m[0], cam.p[1] - cam.m[1], cam.p[2] - cam.m[2]) / 12);
    const ex = cam.p[0] + (Math.sin(t * 0.23) * 0.1 + est.px * 0.35 * pv) * cerca, ey = cam.p[1] + (Math.sin(t * 0.31 + 1) * 0.06 + est.py * 0.2 * pv) * cerca, ez = cam.p[2] + (1 - est.intro) * (est.vertical ? 2.2 : 1.6) * (est.cap < 1 ? 1 - est.cap : 0);
    const arriba = Math.abs(cam.p[1] - cam.m[1]) > 20 ? [0, 0, -1] : [0, 1, 0];
    mirar(V, ex, ey, ez, cam.m[0], cam.m[1], cam.m[2], arriba[0], arriba[1], arriba[2]);
    perspectiva(P, cam.fov * G, est.ancho / est.alto, 0.2, 160); P[8] = -cam.d[0]; P[9] = -cam.d[1];
    mul(VP, P, V); invertir(INV, VP);
    cam.e = [ex, ey, ez]; cam.dir[0] = -V[2]; cam.dir[1] = -V[6]; cam.dir[2] = -V[10];
    const prof = (i) => (act[i * 3] - ex) * cam.dir[0] + (act[i * 3 + 1] - ey) * cam.dir[1] + (act[i * 3 + 2] - ez) * cam.dir[2];
    const peso = (n) => Math.max(0, 1 - Math.abs(est.cap - n) * 2.2);
    let f = cam.foco, w;
    if ((w = peso(1)) > 0) f = mezcla(f, (prof(DESTACADAS[0]) + prof(DESTACADAS[1]) + prof(DESTACADAS[2]) + prof(DESTACADAS[3])) / 4, w);
    if ((w = peso(5)) > 0) f = mezcla(f, prof(FACTURA), w);
    if ((w = peso(8)) > 0) f = mezcla(f, prof(BLANCA), w);
    cam.focoReal = f;
  }
  function proyectar(x, y, z, o = {}) {
    const w = VP[3] * x + VP[7] * y + VP[11] * z + VP[15];
    o.x = ((VP[0] * x + VP[4] * y + VP[8] * z + VP[12]) / w * 0.5 + 0.5) * est.ancho / est.dpr; o.y = (1 - ((VP[1] * x + VP[5] * y + VP[9] * z + VP[13]) / w * 0.5 + 0.5)) * est.alto / est.dpr; o.visible = w > 0.2; return o;
  }
  function rayoPuntero() {
    const nx = est.px + cam.d[0] * 0, ny = est.py;
    const a = [INV[0] * nx + INV[4] * ny - INV[8] + INV[12], INV[1] * nx + INV[5] * ny - INV[9] + INV[13], INV[2] * nx + INV[6] * ny - INV[10] + INV[14], INV[3] * nx + INV[7] * ny - INV[11] + INV[15]];
    const b = [INV[0] * nx + INV[4] * ny + INV[8] + INV[12], INV[1] * nx + INV[5] * ny + INV[9] + INV[13], INV[2] * nx + INV[6] * ny + INV[10] + INV[14], INV[3] * nx + INV[7] * ny + INV[11] + INV[15]];
    for (let k = 0; k < 3; k++) { rayo.o[k] = a[k] / a[3]; rayo.d[k] = b[k] / b[3] - rayo.o[k]; }
    const l = Math.hypot(rayo.d[0], rayo.d[1], rayo.d[2]) || 1; rayo.d[0] /= l; rayo.d[1] /= l; rayo.d[2] /= l;
  }

  /* ----------------------------------------------------------- simulación */
  function simular(dt, mix) {
    const { a, p } = mix, sA = a, sB = a + 1, t = est.tc, e = cam.e;
    const ojo = mz.ojo * cubica(fijar(est.intro, 0, 1));
    // el claro: un volumen en calma entre el centro de la sala y la cámara
    const ox = 0, oy = est.vertical ? 3.9 : 3.15, oz = 0, ax = e[0] - ox, ay = e[1] - oy, az = e[2] - oz, al = Math.hypot(ax, ay, az), ux = ax / al, uy = ay / al, uz = az / al;
    const R0 = est.vertical ? 2.7 : 3.8;
    // el muro del «mantén pulsado»: un plano frente a la cámara donde cada hoja tiene su casilla
    const mano = est.mano, hayMano = mano > 0.002;
    let mxh = 0, myh = 0; const mc = [0.7, 3.0, 0.2]; let rx = 1, rz = 0;
    if (hayMano || est.hayPuntero) {
      rayoPuntero();
      const dxm = e[0] - mc[0], dzm = e[2] - mc[2], lm = Math.hypot(dxm, dzm) || 1; rx = dzm / lm; rz = -dxm / lm;                    // derecha del muro
      const nx = dxm / lm, nz = dzm / lm, den = rayo.d[0] * nx + rayo.d[2] * nz, tt = den ? ((mc[0] - rayo.o[0]) * nx + (mc[2] - rayo.o[2]) * nz) / den : 0;
      const hx = rayo.o[0] + rayo.d[0] * tt, hy = rayo.o[1] + rayo.d[1] * tt, hz = rayo.o[2] + rayo.d[2] * tt;
      mxh = (hx - mc[0]) * rx + (hz - mc[2]) * rz; myh = hy - mc[1];
    }
    const yawMuro = Math.atan2(e[0] - mc[0], e[2] - mc[2]);
    const viento = est.hayPuntero && mz.ts > 0.02 ? 1 : 0;

    for (let i = 0; i < N; i++) {
      // tormenta: una función del tiempo, no una integración (se puede ir hacia atrás con el scroll)
      const th = tth[i] + tw[i] * t, rr = tr0[i] + 0.8 * Math.sin(t * tf1[i] + tp1[i]);
      let cx = Math.cos(th) * rr, cy = ty0[i] + 0.9 * Math.sin(t * tf2[i] + tp2[i]) + 0.3 * Math.sin(t * 0.9 + tp1[i] * 2), cz = Math.sin(th) * rr * 0.86;
      if (ojo > 0.001) {
        // un cono con vértice en la cámara: en pantalla es un círculo limpio alrededor del título
        const wx = cx - ox, wy = cy - oy, wz = cz - oz, s = fijar(wx * ux + wy * uy + wz * uz, -16, al - 0.6), qx = wx - ux * s, qy = wy - uy * s, qz = wz - uz * s, d = Math.hypot(qx, qy, qz) || 0.001;
        const R = Math.max(0.35, R0 * (al - s) / al) * ojo;
        if (d < R) { const k = (R - d) / d * (0.6 + 0.4 * d / R); cx += qx * k; cy += qy * k; cz += qz * k; }
      }
      if (viento) {
        const wx = cx - rayo.o[0], wy = cy - rayo.o[1], wz = cz - rayo.o[2], s = wx * rayo.d[0] + wy * rayo.d[1] + wz * rayo.d[2], qx = wx - rayo.d[0] * s, qy = wy - rayo.d[1] * s, qz = wz - rayo.d[2] * s, d = Math.hypot(qx, qy, qz) || 0.001, f = d < 1.7 ? (1 - d / 1.7) ** 2 * 1.3 / d : 0;
        vx[i] += (qx * f - vx[i]) * 0.07; vy[i] += (qy * f - vy[i]) * 0.07; vz[i] += (qz * f - vz[i]) * 0.07;
      } else { vx[i] *= 0.94; vy[i] *= 0.94; vz[i] *= 0.94; }
      cx += vx[i]; cy += vy[i]; cz += vz[i];
      qEje(Q, 0, eje[i * 3], eje[i * 3 + 1], eje[i * 3 + 2], giro[i] * t + tp2[i]);

      destino(i, sA, A);
      let ord = A[7], tx = A[0], ty = A[1], tz = A[2], esc = A[8], alfa = A[9], sello = A[10], lect = A[11], lp = A[12], campos = A[13], usarB = false;
      if (p > 0.0005) {
        destino(i, sB, B);
        const pe = cubica(fijar((p - retraso[i] * 0.5) / 0.5, 0, 1));
        if (A[7] > 0 && B[7] > 0) { tx = mezcla(tx, B[0], pe); ty = mezcla(ty, B[1], pe) + Math.sin(pe * Math.PI) * 0.6 * Math.min(1, Math.hypot(B[0] - A[0], B[2] - A[2]) / 4); tz = mezcla(tz, B[2], pe); qMezcla(A, 3, A, 3, B, 3, pe); }
        else if (B[7] > 0) { tx = B[0]; ty = B[1]; tz = B[2]; usarB = true; }
        ord = mezcla(ord, B[7], pe); esc = mezcla(esc, B[8], pe); alfa = mezcla(alfa, B[9], pe); sello = mezcla(sello, B[10], pe); lect = mezcla(lect, B[11], pe); lp = mezcla(lp, B[12], pe); campos = mezcla(campos, B[13], pe);
      }
      const k = cubica(ord), o = i * 3;
      let x = mezcla(cx, tx, k), y = mezcla(cy, ty, k) + Math.sin(k * Math.PI) * 0.5, z = mezcla(cz, tz, k), doblez = 1 - k;
      if (k > 0) qMezcla(Q, 0, Q, 0, usarB ? B : A, 3, k);
      esc = mezcla(1, esc, k); alfa = mezcla(1, alfa, k); sello *= k; lp *= k;
      if (k < 0.5) { lect = 0; campos = 0; }
      // mantener pulsado pone orden alrededor del puntero
      if (hayMano || sost[i] > 0.002) {
        const gx = muro[i * 2] * 0.58, gy = muro[i * 2 + 1] * 0.8, d = Math.hypot(gx - mxh, gy - myh), obj = hayMano && k < 0.5 ? mano * (1 - suave(2.2, 3.4, d)) : 0;
        sost[i] += (obj - sost[i]) * (obj > sost[i] ? 0.16 : 0.07);
        const h = cubica(fijar(sost[i], 0, 1));
        if (h > 0.001) { x = mezcla(x, mc[0] + rx * gx, h); y = mezcla(y, mc[1] + gy, h); z = mezcla(z, mc[2] + rz * gx, h); qEje(Q, 4, 0, 1, 0, yawMuro); qMezcla(Q, 0, Q, 0, Q, 4, h); doblez *= 1 - h; sello = Math.max(sello, suave(0.7, 1, h)); lp += h * 0.05; }
      }
      act[o] = x; act[o + 1] = y; act[o + 2] = z;
      claves[i] = (x - e[0]) * cam.dir[0] + (y - e[1]) * cam.dir[1] + (z - e[2]) * cam.dir[2];
      // se guarda sin ordenar en un búfer intermedio (se reordena al subirlo)
      const w = i * 16; tmp[w] = x; tmp[w + 1] = y; tmp[w + 2] = z; tmp[w + 3] = esc; tmp[w + 4] = Q[0]; tmp[w + 5] = Q[1]; tmp[w + 6] = Q[2]; tmp[w + 7] = Q[3];
      tmp[w + 8] = tipo[i]; tmp[w + 9] = doblez; tmp[w + 10] = sello; tmp[w + 11] = alfa; tmp[w + 12] = lect; tmp[w + 13] = lp; tmp[w + 14] = sem[i]; tmp[w + 15] = campos;
    }
    orden.sort((x, y) => claves[y] - claves[x]);
    for (let j = 0; j < N; j++) datos.set(tmp.subarray(orden[j] * 16, orden[j] * 16 + 16), j * 16);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufInst); gl.bufferSubData(gl.ARRAY_BUFFER, 0, datos);
  }
  const tmp = new Float32Array(N * 16);

  /* --------------------------------------------------------------- pintar */
  const NIEBLA = [0.012, 0.012, 0.013], TINTE = [1.0, 0.985, 0.955], TINTE_NOCHE = [0.74, 0.84, 1.0];
  const tinte = [1, 1, 1];
  function comunes(pr) {
    const u = pr.u;
    if (u.uVP) gl.uniformMatrix4fv(u.uVP, false, VP);
    if (u.uCam) gl.uniform3fv(u.uCam, cam.e); if (u.uDir) gl.uniform3fv(u.uDir, cam.dir);
    if (u.uLuzPos) gl.uniform3fv(u.uLuzPos, luz.p); if (u.uLuzDir) gl.uniform3fv(u.uLuzDir, luz.dir);
    if (u.uCosInt) gl.uniform1f(u.uCosInt, luz.ci); if (u.uCosExt) gl.uniform1f(u.uCosExt, luz.ce); if (u.uLuzI) gl.uniform1f(u.uLuzI, luz.i); if (u.uAmb) gl.uniform1f(u.uAmb, luz.amb);
    if (u.uNiebla) gl.uniform3fv(u.uNiebla, NIEBLA); if (u.uDens) gl.uniform1f(u.uDens, mz.dens); if (u.uTinte) gl.uniform3fv(u.uTinte, tinte); if (u.uNoche) gl.uniform1f(u.uNoche, mz.noche);
  }
  function pintar() {
    for (let k = 0; k < 3; k++) tinte[k] = mezcla(TINTE[k], TINTE_NOCHE[k], mz.noche);
    gl.viewport(0, 0, est.ancho, est.alto);
    gl.clearColor(NIEBLA[0], NIEBLA[1], NIEBLA[2], 1); gl.depthMask(true); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.disable(gl.CULL_FACE); gl.enable(gl.BLEND); gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const hojas = (espejo, reflejo) => {
      gl.useProgram(pHoja.p); comunes(pHoja); const u = pHoja.u;
      gl.uniform2f(u.uTam, TW, TH); gl.uniform1f(u.uFoco, cam.focoReal); gl.uniform1f(u.uAbertura, cam.ab); gl.uniform1f(u.uCocMax, 1.1); gl.uniform1f(u.uT, est.tc * 1.0 + est.T * 0.15);
      gl.uniform1f(u.uEspejo, espejo); gl.uniform1f(u.uReflejo, reflejo); gl.uniform2f(u.uCelda, 1 / COLS, 1 / FILAS); gl.uniform1f(u.uPxCelda, pxCelda);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex); gl.uniform1i(u.uAtlas, 0);
      gl.bindVertexArray(vaoHoja); gl.drawElementsInstanced(gl.TRIANGLES, ih.length, gl.UNSIGNED_SHORT, 0, N);
    };
    if (reflejar) { gl.disable(gl.DEPTH_TEST); hojas(-1, 0.3); }
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
    gl.useProgram(pSuelo.p); comunes(pSuelo); gl.uniform1f(pSuelo.u.uSueloAlfa, reflejar ? 0.86 : 1); gl.uniform1f(pSuelo.u.uAlbedo, 0.062);
    gl.bindVertexArray(vaoCuad); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.depthMask(false);
    gl.useProgram(pSombra.p); comunes(pSombra); gl.uniform2f(pSombra.u.uTam, TW, TH); gl.uniform1f(pSombra.u.uSombra, mz.sombra);
    gl.enable(gl.POLYGON_OFFSET_FILL); gl.polygonOffset(-2, -2); gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_ALPHA); gl.bindVertexArray(vaoHoja); gl.drawElementsInstanced(gl.TRIANGLES, ih.length, gl.UNSIGNED_SHORT, 0, N);
    gl.disable(gl.POLYGON_OFFSET_FILL); gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    if (mz.obra > 0.002) {
      levantar(mz.obra);
      gl.depthMask(true); gl.disable(gl.BLEND); gl.useProgram(pCaja.p); comunes(pCaja); gl.uniform1f(pCaja.u.uPase, 0); gl.uniform1f(pCaja.u.uAlbedo, 0.055);
      gl.bindVertexArray(vaoCaja); gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, cajas.length); gl.enable(gl.BLEND); gl.depthMask(false);
    }
    hojas(1, 1);
    gl.blendFunc(gl.ONE, gl.ONE);
    if (mz.obra > 0.5) { gl.useProgram(pCaja.p); comunes(pCaja); gl.uniform1f(pCaja.u.uPase, 1); gl.uniform1f(pCaja.u.uHaz, (0.42 + 0.3 * mz.noche + 0.05 * Math.sin(est.T * 3.1)) * (mz.obra - 0.5) * 2); gl.bindVertexArray(vaoCaja); gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, cajas.length); }
    if (mz.bruma > 0.01) {
      gl.disable(gl.DEPTH_TEST); gl.useProgram(pBruma.p); comunes(pBruma); gl.uniformMatrix4fv(pBruma.u.uInv, false, INV); gl.uniform1f(pBruma.u.uBruma, mz.bruma * 0.02); gl.uniform1f(pBruma.u.uLargo, 34);
      gl.bindVertexArray(vaoCuad); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    gl.bindVertexArray(null); gl.depthMask(true);
  }

  /* --------------------------------------------------------------- cuadro */
  const oyentes = [];
  function paso(dt) {
    dt = Math.min(dt, 0.05);
    // el capítulo sigue al scroll con un muelle críticamente amortiguado
    const kq = 26, cq = 2 * Math.sqrt(kq);
    est.capVel += ((est.capObj - est.cap) * kq - est.capVel * cq) * dt; est.cap += est.capVel * dt;
    est.mano += (est.manoObj - est.mano) * Math.min(1, dt * 7);
    const mix = mezclarCapitulos();
    est.T += dt; est.tc += dt * mz.ts * mezcla(2.6, 1, cubica(fijar(est.intro * 1.6, 0, 1))); est.tl += dt * mz.vel;
    camara(); simular(dt, mix); pintar();
    for (const f of oyentes) f(api);
  }
  let rafId = 0, ultimo = 0, vivo = false;
  function bucle(ahora) { rafId = requestAnimationFrame(bucle); const dt = ultimo ? (ahora - ultimo) / 1000 : 0.016; ultimo = ahora; paso(dt); }
  function medir() {
    const cw = lienzo.clientWidth || innerWidth, ch = lienzo.clientHeight || innerHeight;
    let dpr = Math.min(op.dpr || window.devicePixelRatio || 1, movil ? 2 : 2);
    const tope = (op.pixeles || (movil ? 1.5e6 : 3.2e6)) * escalaPx; if (cw * ch * dpr * dpr > tope) dpr = Math.sqrt(tope / (cw * ch));
    est.dpr = dpr; est.ancho = Math.max(2, Math.round(cw * dpr)); est.alto = Math.max(2, Math.round(ch * dpr)); est.vertical = ch > cw * 1.05;
    if (lienzo.width !== est.ancho || lienzo.height !== est.alto) { lienzo.width = est.ancho; lienzo.height = est.alto; }
  }
  medir();

  const api = {
    N, est, cam, capitulos: CAPITULOS,
    capitulo(c, ya) { est.capObj = fijar(c, 0, CAPS.length - 1); if (ya) { est.cap = est.capObj; est.capVel = 0; } },
    puntero(nx, ny, hay) { est.px = nx; est.py = ny; est.hayPuntero = hay; },
    sostener(si) { est.manoObj = si ? 1 : 0; },
    intro(v) { est.intro = v; }, lectura(v, campos) { est.lectura = v; if (campos !== undefined) est.campos = campos; }, carril(l) { est.carril = l; },
    proyectar, hoja(i, o = {}) { return proyectar(act[i * 3], act[i * 3 + 1], act[i * 3 + 2], o); },
    campo(i, u, v, o = {}) { const k = orden.indexOf(i) * 16, e = datos[k + 3]; return proyectar(datos[k] + (u - 0.5) * TW * e, datos[k + 1] + (v - 0.5) * TH * e, datos[k + 2], o); },
    carrilEn(l, x, o = {}) { return proyectar(x, 0.45, ZC(l), o); },
    alCuadro(f) { oyentes.push(f); }, medir, paso,
    calidad(nivel) { escalaPx = [1, 0.7, 0.5, 0.36][nivel] || 0.36; if (nivel >= 2) reflejar = false; medir(); },
    iniciar() { if (vivo) return; vivo = true; ultimo = 0; rafId = requestAnimationFrame(bucle); }, parar() { vivo = false; cancelAnimationFrame(rafId); },
    get vivo() { return vivo; },
  };
  return api;
}
