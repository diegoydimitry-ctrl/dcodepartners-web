/* ==========================================================================
   D-CODE · «EL SALTO» · el mundo de la portada
   --------------------------------------------------------------------------
   Un río de montaña cae en un salto y su fuerza se pierde. Se construye una
   presa, el agua se remansa, las compuertas se abren solas, el agua entra por
   la toma, baja por la tubería y mueve la central; al caer la noche el valle
   se enciende. Es el recorrido que hace el trabajo de una empresa cuando se
   le pone un sistema, y el scroll lo recorre con el agua.
   Todo es procedural (three.js + GLSL propios): no hay modelos ni fotografías.
   ========================================================================== */
import { WebGLRenderer, Scene, Group, PerspectiveCamera, Mesh, BufferGeometry, BufferAttribute, Float32BufferAttribute, InstancedBufferGeometry, InstancedBufferAttribute, IcosahedronGeometry, PlaneGeometry, DataTexture, CanvasTexture, RGBAFormat, UnsignedByteType, RepeatWrapping, LinearFilter, LinearMipmapLinearFilter, Vector3, NoToneMapping } from "three";
import { crearRevelado } from "./revelado.js";
import { suave, mezcla } from "./ruido.js";
import { MAPA, SOL_AZ, COTA, PRESA } from "./terreno.js";
import { fabricar } from "./fabrica.js";
import { matCielo, matTerreno, matRio, matBruma, matPresa, matObra, matHojas, matChorros, matEmbalse, matFaroles, matRayos, matMotas, matNave, matHaces } from "./materia.js";
import { bocaToma, arco, VANOS } from "./presa.js";
import { NAVE } from "./nave.js";

export const CAPITULOS = ["inicio", "hoy", "sistema", "automatizacion", "inteligencia", "finance", "resultado", "demos", "tuyo"];
export const AREAS = ["ventas", "clientes", "operaciones", "finanzas", "direccion"];
export const hayWebGL2 = () => { try { return !!document.createElement("canvas").getContext("webgl2"); } catch (e) { return false; } };

/* La luz de cada momento. Colores en lineal; el revelado pone la curva. az: de qué lado está el sol (A, a contraluz del salto; B, de frente al muro). */
const LUZ = {
  madrugada: { az: "A", el: -3.5, sol: [1.25, 0.72, 0.44], alto: [0.036, 0.050, 0.078], bajo: [0.205, 0.190, 0.190], amb: [0.078, 0.090, 0.112], suelo: [0.020, 0.021, 0.024], niebla: [0.125, 0.132, 0.150], dens: 0.00062, alt: 150, halo: 1.25, nubes: 0.50, estrellas: 0.35, expo: 1.7, sat: 0.62, bancos: 0.7 },
  alba:      { az: "A", el: 6,    sol: [2.6, 1.75, 1.18],  alto: [0.085, 0.125, 0.200], bajo: [0.52, 0.47, 0.43],    amb: [0.150, 0.170, 0.210], suelo: [0.040, 0.040, 0.040], niebla: [0.27, 0.275, 0.29],   dens: 0.00048, alt: 170, halo: 1.0, nubes: 0.48, estrellas: 0.0, expo: 1.22, sat: 0.60, bancos: 0.55 },
  manana:    { el: 32, sol: [2.5, 2.38, 2.2],   alto: [0.215, 0.275, 0.370], bajo: [0.66, 0.69, 0.72],    amb: [0.300, 0.335, 0.385], suelo: [0.090, 0.090, 0.085], niebla: [0.58, 0.61, 0.65],    dens: 0.00016, alt: 320, halo: 0.6, nubes: 0.42, estrellas: 0.0, expo: 0.9,  sat: 0.55, bancos: 0.1 },
  tarde:     { el: 24, sol: [2.7, 2.3, 1.85],   alto: [0.170, 0.215, 0.300], bajo: [0.66, 0.62, 0.57],    amb: [0.250, 0.270, 0.310], suelo: [0.080, 0.075, 0.068], niebla: [0.56, 0.55, 0.54],    dens: 0.00022, alt: 280, halo: 0.9, nubes: 0.46, estrellas: 0.0, expo: 0.98, sat: 0.58, bancos: 0.15 },
  anochecer: { el: -5, sol: [0.9, 0.42, 0.22],  alto: [0.022, 0.032, 0.058], bajo: [0.175, 0.135, 0.125], amb: [0.045, 0.054, 0.074], suelo: [0.012, 0.012, 0.014], niebla: [0.082, 0.082, 0.098], dens: 0.00042, alt: 200, halo: 1.0, nubes: 0.40, estrellas: 0.8, expo: 1.9,  sat: 0.70, bancos: 0.3 },
  noche:     { el: -16, sol: [0.2, 0.2, 0.3],   alto: [0.008, 0.011, 0.020], bajo: [0.030, 0.034, 0.048], amb: [0.020, 0.025, 0.036], suelo: [0.006, 0.006, 0.008], niebla: [0.026, 0.030, 0.042], dens: 0.00045, alt: 200, halo: 0.2, nubes: 0.34, estrellas: 1.0, expo: 2.3,  sat: 0.75, bancos: 0.3 },
  nave:      { el: 30, sol: [1, 1, 1],          alto: [0.1, 0.1, 0.1],       bajo: [0.3, 0.3, 0.3],       amb: [0.1, 0.1, 0.1],       suelo: [0.02, 0.02, 0.02],    niebla: [0.05, 0.05, 0.055],   dens: 0.0003, alt: 300, halo: 0, nubes: 0.3, estrellas: 0, expo: 1.0, sat: 0.8, bancos: 0 },
  amanecer:  { el: 17, sol: [3.2, 2.35, 1.6],   alto: [0.110, 0.155, 0.235], bajo: [0.62, 0.55, 0.48],    amb: [0.185, 0.205, 0.245], suelo: [0.055, 0.052, 0.048], niebla: [0.46, 0.44, 0.43],    dens: 0.00040, alt: 210, halo: 1.0, nubes: 0.44, estrellas: 0.0, expo: 1.08, sat: 0.62, bancos: 0.35 },
};
const CLAVES_LUZ = ["el", "dens", "alt", "halo", "nubes", "estrellas", "expo", "sat", "bancos"], COLORES_LUZ = ["sol", "alto", "bajo", "amb", "suelo", "niebla"];
const AGUA = { niebla: [0.030, 0.066, 0.070], dens: 0.021 };

/* Los planos. h: pantalla apaisada · v: pantalla de pie. p: cámara · m: adónde mira · fov · d: cuánto se desplaza el encuadre (para dejar sitio al texto) · via: por dónde pasa la cámara camino del plano siguiente.
   natural: caudal del salto sin domar · obra: presa construida · lleno: embalse · puertas: apertura de las compuertas · luces: farolas y valle · grabado: el nombre en el muro · foco/ab: desenfoque */
const PLANOS = [
  { luz: "madrugada", h: { p: [-66, 104, 150], m: [4, 26, -26], fov: 42, d: [0.21, 0.0], via: [-40, 150, -30] }, v: { p: [-26, 124, 196], m: [0, 34, -30], fov: 54, d: [0, 0.17], via: [-30, 170, -30] }, natural: 1, obra: 0, lleno: 0, puertas: 0, luces: 0, grabado: 0 },
  { luz: "alba",      h: { p: [10, 72, -175], m: [0, 18, 70], fov: 46, d: [0.2, 0.0], via: [-50, 172, -40] }, v: { p: [0, 84, -196], m: [0, 10, 60], fov: 60, d: [0, 0.14], via: [-40, 190, -40] }, natural: 1, obra: 0, lleno: 0, puertas: 0, luces: 0, grabado: 0 },
  { luz: "manana",    h: { p: [-30, 100, 235], m: [0, 78, -55], fov: 38, d: [0.2, 0.0] }, v: { p: [-14, 92, 336], m: [0, 72, -50], fov: 54, d: [0, 0.17] }, natural: 0, obra: 1, lleno: 1, puertas: 0, luces: 0, grabado: 0 },
  { luz: "noche",     h: { p: [-8, 20, 124], m: [0, 72, -60], fov: 56, d: [0.2, 0.0], via: [70, 262, -40] }, v: { p: [0, 14, 172], m: [0, 68, -60], fov: 64, d: [0, 0.16], via: [60, 270, -30] }, natural: 0, obra: 1, lleno: 1, puertas: 1, luces: 0.34, grabado: 0 },
  { luz: "tarde",     h: { p: [31.5, 74, -136], m: [39.5, 70, -87.6], fov: 46, d: [0.2, 0.0] }, v: { p: [33, 73, -142], m: [39.5, 71, -87.6], fov: 62, d: [0, 0.14] }, natural: 0, obra: 1, lleno: 1, puertas: 0.3, luces: 0, grabado: 0 },
  { luz: "nave", nave: true, h: { p: [6.5, 6.8, 5], m: [-1.5, 8.8, 99], fov: 36, d: [0.21, 0.0] }, v: { p: [2.5, 7.4, 3], m: [-0.5, 9.2, 99], fov: 58, d: [0, 0.13] }, natural: 0, obra: 1, lleno: 1, puertas: 0.5, luces: 0, grabado: 0 },
  { luz: "anochecer", h: { p: [-30, 215, -250], m: [40, 20, 900], fov: 40, d: [0.14, -0.06] }, v: { p: [0, 250, -320], m: [20, 20, 900], fov: 58, d: [0, 0.12] }, natural: 0, obra: 1, lleno: 1, puertas: 0.5, luces: 1, grabado: 0 },
  { luz: "noche",     h: { p: [-30, 330, -420], m: [40, 20, 900], fov: 40, d: [0, 0] }, v: { p: [0, 350, -480], m: [20, 20, 900], fov: 58, d: [0, 0] }, natural: 0, obra: 1, lleno: 1, puertas: 0.5, luces: 1, grabado: 0.5 },
  { luz: "amanecer",  h: { p: [14, 66, 128], m: [0, 80, -60], fov: 40, d: [0.24, 0.0] }, v: { p: [0, 58, 196], m: [0, 82, -60], fov: 52, d: [0, 0.2] }, natural: 0, obra: 1, lleno: 1, puertas: 0, luces: 0.12, grabado: 1 },
];
const ENTRADA = { h: { p: [-6, 30, 34], m: [2, 40, -30], fov: 52 }, v: { p: [-4, 34, 44], m: [0, 44, -30], fov: 60 } };   // la película empieza dentro de la bruma del salto

export function crearSalto(lienzo, op = {}) {
  let renderer;
  try { renderer = new WebGLRenderer({ canvas: lienzo, antialias: false, alpha: false, powerPreference: "high-performance", stencil: false, depth: false }); } catch (e) { return null; }
  if (!renderer.capabilities.isWebGL2) { renderer.dispose(); return null; }
  renderer.setPixelRatio(1); renderer.toneMapping = NoToneMapping; renderer.setClearColor(0x020203, 1);
  const movil = !!op.movil, en = op.idioma === "en";
  const revelado = crearRevelado(renderer, { muestras: op.muestras ?? 4, tomas: op.tomas ?? 12 });

  const u = (value) => ({ value });
  const U = { uSol: u(new Vector3(0, 1, 0)), uSolCol: u(new Vector3()), uCieloAlto: u(new Vector3()), uCieloBajo: u(new Vector3()), uAmbCielo: u(new Vector3()), uAmbSuelo: u(new Vector3()), uNieblaCol: u(new Vector3()), uNieblaDens: u(0.001), uNieblaAlt: u(200), uTiempo: u(0), uNubes: u(0.4), uEstrellas: u(0), uHaloSol: u(1), uNivel: u(COTA.labio), uObra: u(0), uInterior: u(0), uBancos: u(0.5), uSolB: u(0), uBajoAgua: u(0), tRuido: u(null) };

  const escena = new Scene(), fuera = new Group(), dentro = new Group(), camara = new PerspectiveCamera(36, 1, 1.2, 14000);
  escena.add(fuera, dentro); escena.matrixAutoUpdate = false; fuera.matrixAutoUpdate = false; dentro.matrixAutoUpdate = false;
  const malla = (geo, material, orden = 0, grupo = fuera) => { const m = new Mesh(geo, material); m.frustumCulled = false; m.matrixAutoUpdate = false; m.renderOrder = orden; grupo.add(m); return m; };
  const geoDe = (attrs, ind) => { const g = new BufferGeometry(); for (const [n, [a, t]] of Object.entries(attrs)) g.setAttribute(n, new BufferAttribute(a, t)); if (ind) g.setIndex(new BufferAttribute(ind, 1)); return g; };
  const manchas = (base, dat, tamDat, nombres) => { const g = new InstancedBufferGeometry(); g.setAttribute("position", new Float32BufferAttribute([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0], 3)); g.setIndex([0, 1, 2, 0, 2, 3]); g.setAttribute(nombres[0], new InstancedBufferAttribute(base, 3)); g.setAttribute(nombres[1], new InstancedBufferAttribute(dat, tamDat)); g.instanceCount = base.length / 3; return g; };
  const textura = (datos, n, m = n, repetir = true) => { const t = new DataTexture(datos, n, m, RGBAFormat, UnsignedByteType); if (repetir) { t.wrapS = t.wrapT = RepeatWrapping; t.minFilter = LinearMipmapLinearFilter; t.generateMipmaps = true; } else t.minFilter = LinearFilter; t.magFilter = LinearFilter; t.needsUpdate = true; return t; };

  const uTerr = { tRoca: u(null), tTerreno: u(null), uMapa: u([MAPA.x0, MAPA.z0, 1 / (MAPA.x1 - MAPA.x0), 1 / (MAPA.z1 - MAPA.z0)]) };
  const uRio = { uNatural: u(1), uCaudal: u(0) }, uBruma = { uRocio: u(1), uHorRocio: u(0.5) };
  const uPresa = { uObraY: u(24), uPuertas: u([0, 0, 0, 0, 0]), uLuces: u(0), uFuerza: u(1), uGrabado: u(0), tGrabado: u(null), uPlaca: u([-36, 60, 72, 28.1]), uColorLuz: u(new Vector3(1.0, 0.66, 0.36)) };
  const uValle = { uLuces: u(0), uObraY: u(9999), uFuerza: u(0.24), uColorLuz: u(new Vector3(1.0, 0.70, 0.40)) };
  const boca = bocaToma();
  const uAgua = { uBoca: u(new Vector3(...boca.p)), uBocaN: u(new Vector3(...boca.n)) };

  /* El mundo se monta cuando llegan sus datos (los calcula otro hilo). */
  let montado = false;
  function montar(d) {
    U.tRuido.value = textura(d.ruido, 256); uTerr.tRoca.value = textura(d.roca, 512); uTerr.tRoca.value.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); uTerr.tTerreno.value = textura(d.datosTerreno, MAPA.nx, MAPA.nz, false);
    malla(new IcosahedronGeometry(1, 3), matCielo(U), -10);
    malla(geoDe({ position: [d.terreno.pos, 3], normal: [d.terreno.nor, 3], aHor: [d.terreno.hor, 2] }, d.terreno.ind), matTerreno(U, { uniforms: uTerr }), 0);
    malla(geoDe({ position: [d.rio.pos, 3], aRio: [d.rio.rio, 3], aHor: [d.rio.hor, 2] }, d.rio.ind), matRio(U, { uniforms: uRio }), 5);
    malla(manchas(d.bruma.base, d.bruma.dat, 4, ["aBase", "aDatos"]), matBruma(U, { uniforms: uBruma }), 20);
    malla(geoDe({ position: [d.presa.pos, 3], aArco: [d.presa.arc, 3], aTira: [d.presa.tir, 4] }, d.presa.ind), matPresa(U, { uniforms: uPresa }), 1);
    malla(geoDe({ position: [d.obra.pos, 3], normal: [d.obra.nor, 3], aMat: [d.obra.mat, 1], aHor: [d.obra.hor, 1] }, d.obra.ind), matObra(U, { uniforms: uPresa }), 1);
    malla(geoDe({ position: [d.hojas.pos, 3], normal: [d.hojas.nor, 3], aHoja: [d.hojas.hoja, 1] }, d.hojas.ind), matHojas(U, { uniforms: uPresa }), 1);
    { const g = new PlaneGeometry(1, 1, 1, 1); g.rotateX(-Math.PI / 2); g.scale(2400, 1, 2700); g.translate(0, 0, -1380); malla(g, matEmbalse(U, { uniforms: uTerr }), 2); }
    malla(geoDe({ position: [d.chorros.pos, 3], aChorro: [d.chorros.cho, 3], aHor: [d.chorros.hor, 1] }, d.chorros.ind), matChorros(U, { uniforms: uPresa }), 6);
    malla(manchas(d.faroles.base, d.faroles.dat, 2, ["aBase", "aFarol"]), matFaroles(U, { uniforms: uPresa }), 30);
    malla(manchas(d.valle.base, d.valle.dat, 2, ["aBase", "aFarol"]), matFaroles(U, { uniforms: uValle }), 30);
    malla(manchas(d.rayos.base, d.rayos.dat, 2, ["aBase", "aRayo"]), matRayos(U, { uniforms: uAgua }), 25);
    malla(manchas(d.motas.base, d.motas.dat, 2, ["aBase", "aMota"]), matMotas(U, { uniforms: uAgua }), 26);
    malla(geoDe({ position: [d.nave.pos, 3], normal: [d.nave.nor, 3], aDat: [d.nave.dat, 2] }, d.nave.ind), matNave(U, { uniforms: uNave }), 0, dentro);
    malla(geoDe({ position: [d.haces.pos, 3], aHaz: [d.haces.haz, 3] }, d.haces.ind), matHaces(U, { uniforms: uNave }), 10, dentro);
    montado = true;
  }

  /* ----------------------------------------------------------------- la nave */
  const lonaC = document.createElement("canvas"); lonaC.width = 1024; lonaC.height = 228; const tContador = new CanvasTexture(lonaC); tContador.minFilter = LinearFilter; tContador.generateMipmaps = false;
  const lonaR = document.createElement("canvas"); lonaR.width = 1024; lonaR.height = 102; const tRotulo = new CanvasTexture(lonaR); tRotulo.minFilter = LinearFilter; tRotulo.generateMipmaps = false;
  const uNave = { uOrigen: u(new Vector3(...NAVE.origen)), uGiro: u(0), uOnda: u(0), uActivo: u(0.2), tContador: u(tContador), tRotulo: u(tRotulo) };
  const fuente = (px, peso = 800) => `${peso} ${px}px Archivo, "Helvetica Neue", Arial, sans-serif`;
  const dinero = (c) => { const s = (c / 100).toLocaleString(en ? "en-GB" : "es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true }); return en ? "€" + s : s.replace(/^(\d)(\d{3},)/, "$1.$2") + " €"; };
  const contador = { valor: 0, meta: 0, desde: 0, t: 1, pintado: -1 };
  function pintarContador() {
    const g = lonaC.getContext("2d"), W0 = lonaC.width, H0 = lonaC.height; g.fillStyle = "#000"; g.fillRect(0, 0, W0, H0); g.fillStyle = "#fff";
    g.textBaseline = "alphabetic"; g.textAlign = "left"; g.font = fuente(25, 600); if ("letterSpacing" in g) g.letterSpacing = "7px"; g.globalAlpha = 0.62; g.fillText(en ? "TOTAL RECORDED" : "TOTAL REGISTRADO", 46, 54); g.globalAlpha = 1;
    g.textAlign = "right"; g.font = fuente(146, 700); if ("letterSpacing" in g) g.letterSpacing = "2px"; g.fillText(dinero(Math.round(contador.valor)), W0 - 44, 196);
    tContador.needsUpdate = true; contador.pintado = contador.valor;
  }
  function pintarRotulo() { const g = lonaR.getContext("2d"); g.fillStyle = "#000"; g.fillRect(0, 0, 1024, 102); g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = fuente(58, 700); if ("letterSpacing" in g) g.letterSpacing = "22px"; g.fillText("D-CODE FINANCE", 523, 54); tRotulo.needsUpdate = true; }

  /* ------------------------------------------------------ el nombre en el muro */
  const lona = document.createElement("canvas"); lona.width = 1024; lona.height = 400; const tGrabado = new CanvasTexture(lona); tGrabado.minFilter = LinearFilter; tGrabado.generateMipmaps = false; uPresa.tGrabado.value = tGrabado;
  const grabado = { rotulo: en ? "BUILT FOR" : "CONSTRUIDO PARA", nombre: en ? "YOUR COMPANY" : "TU EMPRESA" };
  function grabar() {
    const g = lona.getContext("2d"), W0 = lona.width, H0 = lona.height; g.fillStyle = "#000"; g.fillRect(0, 0, W0, H0); g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "alphabetic";
    g.filter = "blur(1.6px)";
    g.font = fuente(46, 600); if ("letterSpacing" in g) g.letterSpacing = "14px"; g.fillText(grabado.rotulo, W0 / 2 + 7, 116);
    let px = 168; g.font = fuente(px); if ("letterSpacing" in g) g.letterSpacing = "6px"; const w = g.measureText(grabado.nombre).width; if (w > W0 - 70) { px = Math.max(52, Math.floor((px * (W0 - 70)) / w)); g.font = fuente(px); }
    g.fillText(grabado.nombre, W0 / 2 + 3, 196 + px * 0.62 + (168 - px) * 0.25);
    g.fillRect(W0 / 2 - 60, 344, 120, 6);
    g.filter = "none"; tGrabado.needsUpdate = true;
  }
  grabar(); pintarContador(); pintarRotulo();

  /* ------------------------------------------------------------------ estado */
  const est = { cap: 0, meta: 0, T: 0, px: 0, py: 0, ppx: 0, ppy: 0, hay: 0, escalaPx: 1, calidad: 0, giro: 0, intro: 1, mano: 0, sosteniendo: false, area: -1, areaM: 0, areaK: 2, onda: 0, activo: 0.2, avance: 0, rodaje: null, luz: null, forzar: {}, fundido: 1, bajoAgua: 0, enNave: false };
  const cuadro = [];
  let W = 0, H = 0, vertical = false;

  function medir() {
    const r = lienzo.getBoundingClientRect(), w0 = Math.max(2, r.width), h0 = Math.max(2, r.height), dpr = op.dpr || Math.min(window.devicePixelRatio || 1, movil ? 2 : 1.75);
    let w = w0 * dpr, h = h0 * dpr; const tope = (op.pixeles || 3.2e6) * est.escalaPx; if (w * h > tope) { const k = Math.sqrt(tope / (w * h)); w *= k; h *= k; }
    W = Math.max(2, Math.round(w)); H = Math.max(2, Math.round(h)); vertical = h0 > w0 * 1.02;
    renderer.setSize(W, H, false); revelado.medir(W, H); camara.aspect = W / H;
  }

  const V3 = new Vector3(), V3b = new Vector3(), luz = {};
  function ponerLuz(a, b, t) {
    const A = LUZ[a], B = LUZ[b] || A;
    for (const k of CLAVES_LUZ) luz[k] = mezcla(A[k], B[k], t);
    for (const k of COLORES_LUZ) luz[k] = [0, 1, 2].map((i) => mezcla(A[k][i], B[k][i], t));
    if (est.luz) Object.assign(luz, est.luz);
    // el sol no gira de un lado al otro: se apaga tras las nubes, cambia y vuelve a salir
    let az = A.az || "B"; if ((B.az || "B") !== az) { const k = Math.abs(t * 2 - 1); luz.sol = luz.sol.map((v) => v * k * k); luz.nubes += 0.12 * (1 - k); if (t > 0.5) az = B.az || "B"; }
    U.uSolB.value = az === "B" ? 1 : 0; uBruma.uHorRocio.value = az === "B" ? 0.35 : 0.5;
    const el = (luz.el * Math.PI) / 180, c = Math.cos(el);
    U.uSol.value.set(SOL_AZ[az][0] * c, Math.sin(el), SOL_AZ[az][1] * c);
  }
  function aplicarLuz() {
    // bajo el agua todo se vuelve denso, verdoso y cercano
    const k = est.bajoAgua;
    if (k > 0.001) { luz.niebla = luz.niebla.map((v, i) => mezcla(v, AGUA.niebla[i] * (0.6 + luz.amb[1] * 3), k)); luz.dens = mezcla(luz.dens, AGUA.dens, k); luz.alt = mezcla(luz.alt, 1e5, k); luz.bancos *= 1 - k; luz.sol = luz.sol.map((v) => v * (1 - 0.75 * k)); luz.expo *= 1 + 0.5 * k; }
    U.uSolCol.value.fromArray(luz.sol); U.uCieloAlto.value.fromArray(luz.alto); U.uCieloBajo.value.fromArray(luz.bajo); U.uAmbCielo.value.fromArray(luz.amb); U.uAmbSuelo.value.fromArray(luz.suelo); U.uNieblaCol.value.fromArray(luz.niebla);
    U.uNieblaDens.value = luz.dens; U.uNieblaAlt.value = luz.alt; U.uHaloSol.value = luz.halo; U.uNubes.value = luz.nubes; U.uEstrellas.value = luz.estrellas; U.uBancos.value = luz.bancos; U.uBajoAgua.value = k;
    revelado.U.uExposicion.value = luz.expo; revelado.U.uSat.value = luz.sat;
  }

  const P = { p: [0, 0, 0], m: [0, 0, 0], fov: 36, d: [0, 0] }, O = NAVE.origen;
  const facil = (t) => t * t * (3 - 2 * t), de3 = (o, a, b, t) => { o[0] = a[0] + (b[0] - a[0]) * t; o[1] = a[1] + (b[1] - a[1]) * t; o[2] = a[2] + (b[2] - a[2]) * t; };
  const plano = (i) => { const c = PLANOS[Math.max(0, Math.min(PLANOS.length - 1, i))]; return vertical ? c.v : c.h; };
  const BOCA_P = [boca.p[0] - boca.n[0] * 5, boca.p[1], boca.p[2] - boca.n[2] * 5], BOCA_M = [boca.p[0] - boca.n[0] * 40, boca.p[1], boca.p[2] - boca.n[2] * 40];
  function mezclar() {
    const c = Math.max(0, Math.min(PLANOS.length - 1, est.cap)), i = Math.min(PLANOS.length - 2, Math.floor(c)), f = c - i, t = facil(f);
    const A = PLANOS[i], B = PLANOS[i + 1], a = plano(i), b = plano(i + 1);
    let fund = 1, luzT = t, nave = false;
    P.d[0] = mezcla(a.d[0], b.d[0], t); P.d[1] = mezcla(a.d[1], b.d[1], t);
    if (i === 4) {
      // de la toma a la central: la cámara entra por la boca, baja por la tubería y sale a la nave
      if (f < 0.42) { const k = facil(f / 0.42); de3(P.p, a.p, BOCA_P, k * k); de3(P.m, a.m, BOCA_M, k); P.fov = mezcla(a.fov, 64, k); fund = 1 - suave(0.27, 0.42, f); luzT = 0; }
      else { const k = (f - 0.42) / 0.58, e = 1 - Math.pow(1 - k, 2.4), z = mezcla(-208, b.p[2], e), w = suave(-6, b.p[2], z);
        P.p[0] = b.p[0] * w; P.p[1] = mezcla(9, b.p[1], w); P.p[2] = z; P.m[0] = b.m[0] * w; P.m[1] = mezcla(9, b.m[1], w); P.m[2] = mezcla(z + 60, b.m[2], w); P.fov = mezcla(74, b.fov, suave(-60, b.p[2], z));
        for (let k2 = 0; k2 < 3; k2++) { P.p[k2] += O[k2]; P.m[k2] += O[k2]; } fund = suave(0.42, 0.5, f); luzT = 1; nave = true; }
    } else if (i === 5) {
      if (f < 0.5) { const k = f / 0.5; P.p[0] = a.p[0] + O[0]; P.p[1] = a.p[1] + 1.5 * k + O[1]; P.p[2] = a.p[2] + 22 * k * k + O[2]; P.m[0] = a.m[0] + O[0]; P.m[1] = a.m[1] + O[1]; P.m[2] = a.m[2] + O[2]; P.fov = a.fov; fund = 1 - suave(0.26, 0.5, f); luzT = 0; nave = true; }
      else { const k = facil((f - 0.5) / 0.5); P.p[0] = b.p[0]; P.p[1] = b.p[1] - 46 * (1 - k); P.p[2] = b.p[2] - 60 * (1 - k); P.m[0] = b.m[0]; P.m[1] = b.m[1]; P.m[2] = b.m[2]; P.fov = b.fov; fund = suave(0.5, 0.7, f); luzT = 1; }
    } else {
      if (a.via) { const q = 1 - t; for (let k = 0; k < 3; k++) P.p[k] = q * q * a.p[k] + 2 * q * t * a.via[k] + t * t * b.p[k]; } else de3(P.p, a.p, b.p, t);
      de3(P.m, a.m, b.m, t); P.fov = mezcla(a.fov, b.fov, t);
      if (A.nave) { const av = est.avance * (1 - f) * (vertical ? 46 : 38); P.p[2] += av; P.p[0] -= av * 0.1; P.p[1] += av * 0.03; for (let k = 0; k < 3; k++) { P.p[k] += O[k]; P.m[k] += O[k]; } nave = true; }
    }
    // el área elegida: la cámara se acerca a su compuerta
    const F = est.forzar, de = (k) => (F[k] !== undefined ? F[k] : mezcla(A[k], B[k], t));
    const pesoArea = est.areaM * Math.max(0, 1 - Math.abs(c - 2) * 1.6);
    if (pesoArea > 0.001) { const ang = VANOS[est.areaK], q = arco(ang, PRESA.R - 2, 112), cam = arco(ang * 0.55, PRESA.R - (vertical ? 132 : 104), 116); de3(P.p, P.p, cam, pesoArea); de3(P.m, P.m, q, pesoArea); P.fov = mezcla(P.fov, vertical ? 50 : 36, pesoArea); }
    // la entrada: desde dentro de la bruma hasta el plano de inicio
    if (est.intro < 1) { const k = 1 - Math.pow(1 - est.intro, 2.6), e = vertical ? ENTRADA.v : ENTRADA.h; de3(P.p, e.p, P.p, k); de3(P.m, e.m, P.m, k); P.fov = mezcla(e.fov, P.fov, k); fund *= suave(0, 0.22, est.intro); }
    if (est.rodaje) { const r = est.rodaje; if (r.p) P.p = r.p.slice(); if (r.m) P.m = r.m.slice(); if (r.fov) P.fov = r.fov; if (r.d) P.d = r.d.slice(); if (r.fundido !== undefined) fund = r.fundido; nave = P.p[1] < -1500; }
    est.enNave = nave; est.fundido = fund;
    ponerLuz(luzT === t ? A.luz : luzT ? B.luz : A.luz, luzT === t ? B.luz : luzT ? B.luz : A.luz, luzT === t ? t : 0);
    // el estado del mundo
    const obraV = Math.max(de("obra"), est.mano * suave(2.2, 1.6, c)), puertas = de("puertas"), natural = de("natural") * (1 - suave(0.1, 0.45, obraV));
    U.uObra.value = obraV; uPresa.uObraY.value = mezcla(24, 128, obraV);
    U.uNivel.value = mezcla(COTA.labio, 115, Math.min(Math.max(de("lleno"), est.mano), suave(0.25, 1, obraV)));
    let caudal = 0; for (let k = 0; k < 5; k++) { const ab = mezcla(puertas, k === est.areaK ? 1 : 0, pesoArea); uPresa.uPuertas.value[k] = ab; caudal += ab / 5; }
    uRio.uNatural.value = natural; uRio.uCaudal.value = Math.max(caudal, 0.12 * suave(0.3, 0.6, obraV)); uBruma.uRocio.value = Math.max(natural, caudal);
    const luces = de("luces"); uPresa.uLuces.value = Math.min(1, luces * 3); uPresa.uFuerza.value = Math.min(1, luces * 3); uValle.uLuces.value = suave(0.25, 1, luces); uPresa.uGrabado.value = de("grabado");
  }
  function encuadrar() {
    camara.fov = P.fov; camara.position.set(P.p[0], P.p[1], P.p[2]);
    // el puntero mueve un poco la cámara alrededor de lo que mira; arrastrar la gira
    V3.set(P.m[0] - P.p[0], P.m[1] - P.p[1], P.m[2] - P.p[2]); const dist = Math.min(V3.length(), 420), k = est.enNave ? 0.012 : 0.03;
    V3b.set(V3.z, 0, -V3.x).normalize();
    camara.position.addScaledVector(V3b, -(est.ppx * k + est.giro) * dist); camara.position.y += est.ppy * k * 0.6 * dist;
    camara.lookAt(P.m[0], P.m[1], P.m[2]); camara.updateProjectionMatrix(); camara.updateMatrixWorld();
    camara.projectionMatrix.elements[8] -= P.d[0] * 2; camara.projectionMatrix.elements[9] -= P.d[1] * 2; camara.projectionMatrixInverse.copy(camara.projectionMatrix).invert();
    // ¿bajo el embalse?
    const y = camara.position.y, x = camara.position.x, z = camara.position.z;
    est.bajoAgua = !est.enNave && U.uNivel.value > 47 && z < -40 && Math.hypot(x, z - 40) > PRESA.R - 2 ? suave(U.uNivel.value + 0.25, U.uNivel.value - 1.1, y) : 0;
  }
  function pintar() {
    if (!montado) return;
    mezclar(); encuadrar(); aplicarLuz(); U.uTiempo.value = est.T;
    fuera.visible = !est.enNave; dentro.visible = est.enNave;
    uNave.uOnda.value = est.onda; uNave.uActivo.value = est.activo; revelado.U.uFundido.value = est.fundido;
    renderer.setRenderTarget(revelado.destino); renderer.render(escena, camara); revelado.revelar(camara, est.T);
    for (const f of cuadro) f();
  }
  function avanzar(dt) {
    est.T += dt;
    const lejos = Math.abs(est.meta - est.cap); est.cap += (est.meta - est.cap) * Math.min(1, dt * (lejos > 1.5 ? 6 : 3.4)); if (lejos < 0.0004) est.cap = est.meta;
    est.ppx += (est.px - est.ppx) * Math.min(1, dt * 3.5); est.ppy += (est.py - est.ppy) * Math.min(1, dt * 3.5);
    est.giro *= Math.exp(-dt * 0.7);
    est.mano += ((est.sosteniendo ? 1 : 0) - est.mano) * Math.min(1, dt * (est.sosteniendo ? 0.9 : 2.2));
    est.areaM += ((est.area >= 0 ? 1 : 0) - est.areaM) * Math.min(1, dt * 3);
    const actMeta = est.onda > 0.98 ? 1 : 0.2 + est.onda * 0.4; est.activo += (actMeta - est.activo) * Math.min(1, dt * 2.5);
    uNave.uGiro.value += dt * (0.5 + 2.2 * est.activo); est.avance += ((est.onda > 0.02 ? 1 : 0) - est.avance) * Math.min(1, dt * 1.1);
    if (contador.t < 1) { contador.t = Math.min(1, contador.t + dt / 0.95); const e = 1 - Math.pow(1 - contador.t, 3); contador.valor = contador.desde + (contador.meta - contador.desde) * e; }
    if (contador.pintado !== contador.valor) pintarContador();
    pintar();
  }
  let raf = 0, previo = 0;
  const bucle = (ahora) => { raf = requestAnimationFrame(bucle); const dt = Math.min(0.05, (ahora - previo) / 1000 || 0.016); previo = ahora; avanzar(dt); };
  const proyectar = (x, y, z, o) => { V3.set(x, y, z).project(camara); const r = lienzo.getBoundingClientRect(); o.x = r.left + (V3.x * 0.5 + 0.5) * r.width; o.y = r.top + (-V3.y * 0.5 + 0.5) * r.height; o.visible = V3.z < 1 && Math.abs(V3.x) < 1.1 && Math.abs(V3.y) < 1.1; return o; };

  const api = {
    est, info: { areas: AREAS }, get vivo() { return !!raf; },
    capitulo(c, ya) { est.meta = c; if (ya) est.cap = c; },
    intro(t) { est.intro = Math.max(0, Math.min(1, t)); },
    puntero(x, y) { est.px = x; est.py = y; },
    arrastrar(dx) { est.giro = Math.max(-0.16, Math.min(0.16, est.giro - dx * 0.00045)); },
    sostener(si) { est.sosteniendo = !!si; },
    area(nombre) { const k = AREAS.indexOf(nombre); est.area = k; if (k >= 0) est.areaK = k; },
    modulo(nombre, o) { const k = AREAS.indexOf(nombre), q = arco(VANOS[k], PRESA.R - 2.2, COTA.corona + 16); return proyectar(q[0], q[1], q[2], o); },
    lectura(v) { est.onda = Math.max(0, Math.min(1, v)); },
    registro(centimos, ya) { contador.desde = contador.valor; contador.meta = centimos; contador.t = ya ? 1 : 0; if (ya) contador.valor = centimos; },
    puntoContador(o) { return proyectar(O[0], O[1] + NAVE.contador.y, O[2] + NAVE.largo, o); },
    grabar(o = {}) { if (o.rotulo !== undefined) grabado.rotulo = o.rotulo; if (o.nombre !== undefined) grabado.nombre = String(o.nombre).slice(0, 26) || grabado.nombre; grabar(); },
    redibujar() { grabar(); pintarContador(); pintarRotulo(); },
    rodaje(r) { est.rodaje = r; }, luz(l) { est.luz = l; }, forzar(k, v) { if (v === undefined || v === null) delete est.forzar[k]; else est.forzar[k] = v; },
    alCuadro(f) { cuadro.push(f); },
    medir, paso(dt = 0.033) { avanzar(dt); },
    iniciar() { if (!raf) { previo = performance.now(); raf = requestAnimationFrame(bucle); } }, parar() { cancelAnimationFrame(raf); raf = 0; },
    calidad(n) { est.calidad = n; est.escalaPx = [1, 0.72, 0.5, 0.36][Math.min(3, n)]; medir(); },
    liberar() { api.parar(); revelado.liberar(); renderer.dispose(); },
  };
  revelado.U.uApertura.value = 0; revelado.U.uHalo.value = 0.42; revelado.U.uVineta.value = 0.42; revelado.U.uGrano.value = 0.03;
  medir();
  api.listo = new Promise((hecho) => {
    const aqui = () => { montar(fabricar({ movil })); hecho(api); };
    if (op.obrero === false || typeof Worker === "undefined") return aqui();
    try {
      const w = new Worker(op.obrero || "/assets/v2/js/salto-obra.js?v=0000000000");
      w.onmessage = (e) => { montar(e.data); w.terminate(); hecho(api); };
      w.onerror = () => { w.terminate(); if (!montado) aqui(); };
      w.postMessage({ movil });
    } catch (e) { aqui(); }
  });
  return api;
}
