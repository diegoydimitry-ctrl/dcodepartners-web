/* ==========================================================================
   D-CODE · EL SISTEMA, EN TIEMPO REAL (three.js, WebGL)
   --------------------------------------------------------------------------
   Una sola población de piezas de cerámica (negras y alguna blanca) cuenta
   cómo trabaja D-Code al bajar por la portada:

     0 entrada        piezas sueltas, flotando; se apartan del puntero
     1 personas       se agrupan en siete personas (cabeza blanca)
     2 procesos       las personas pasan a ser nudos unidos por caminos
     3 datos          los caminos se convierten en un campo de datos
     4 herramientas   los datos se ordenan en cinco pantallas conectadas
     5 IA             aparece un núcleo de vidrio con el píxel azul dentro
     6 automatizar    las piezas giran solas en un bucle continuo
     7 el sistema     todo se monta en el logotipo de D-Code

   Física: cada pieza persigue su sitio con un muelle propio (rigidez y
   retraso distintos), así que los cambios de forma son orgánicos y nunca
   un fundido. El puntero empuja las piezas cercanas; arrastrar gira la
   escena entera y vuelve sola a su sitio.
   Color: blanco, negro y grises. El único color es el píxel azul del
   logotipo, que se enciende cuando entra la IA.
   Rendimiento: una sola llamada de dibujo para todas las piezas; dibuja
   solo mientras algo se mueve; se para fuera de pantalla; baja la
   resolución sola si el aparato no llega a ~50 fps.
   ========================================================================== */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, InstancedMesh, Color, Vector3, Euler, Quaternion, Matrix4,
  MeshPhysicalMaterial, MeshBasicMaterial, PlaneGeometry, SphereGeometry, BufferGeometry, Float32BufferAttribute,
  LineSegments, LineBasicMaterial, PMREMGenerator, CanvasTexture, AgXToneMapping, SRGBColorSpace, Vector2, Raycaster, DynamicDrawUsage,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { S, PROF, CUBOS, ARCOS, azar, estudio, microRelieve, sombraContacto } from "./piezas.js";

const ETAPAS = 8;                       // 0 … 7
const CENTRO = new Vector3(0, 0.9, 0);  // corazón de la escena (a la altura del logotipo)
const LOGO_Y = 0.34;                    // el logotipo flota sobre el suelo, como antes
const suave = (t) => { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); };
const mezcla = (a, b, t) => a + (b - a) * t;
const campana = (s, a, b, c, d) => (s <= a || s >= d ? 0 : s < b ? suave((s - a) / (b - a)) : s <= c ? 1 : 1 - suave((s - c) / (d - c)));

/* ================================================================ formas
   Cada etapa da a cada pieza i un sitio (x, y, z), un tamaño, un color
   (0 negro · 1 blanco), un giro libre (0 quieta · 1 da vueltas) y, si hace
   falta, una orientación. Las etapas «vivas» (IA, automatizar) mueven su
   sitio con el tiempo. */
function etapaVacia(n) { return { p: new Float32Array(n * 3), t: new Float32Array(n), c: new Float32Array(n), giro: 0, yaw: null, viva: null }; }

// Ordena los sitios por una clave espacial: las piezas viajan a zonas parecidas (sin cruzarse de punta a punta).
function ordenar(puntos, clave) { return puntos.map((p, i) => [clave(p), i]).sort((a, b) => a[0] - b[0]).map(([, i]) => puntos[i]); }
function volcar(e, puntos) { puntos.forEach((q, i) => { e.p[i * 3] = q[0]; e.p[i * 3 + 1] = q[1]; e.p[i * 3 + 2] = q[2]; e.t[i] = q[3]; e.c[i] = q[4] || 0; if (e.yaw) e.yaw[i] = q[5] || 0; }); }
// Completa (o recorta) una lista de puntos hasta n: las que sobran se esconden dentro de otras, más pequeñas.
function ajustar(puntos, n, r) {
  if (puntos.length > n) { const out = puntos.slice(); while (out.length > n) out.splice(Math.floor(r() * out.length), 1); return out; }
  const out = puntos.slice(); while (out.length < n) { const q = puntos[Math.floor(r() * puntos.length)]; out.push([q[0] + (r() - 0.5) * 0.004, q[1] + (r() - 0.5) * 0.004, q[2] - 0.012, q[3] * 0.7, q[4], q[5]]); }
  return out;
}

// 0 · entrada: una nube suelta, más densa en el centro
function nube(n, r) {
  const e = etapaVacia(n); e.giro = 1; const pts = [];
  for (let i = 0; i < n; i++) {
    const u = r(), v = r(), w = Math.cbrt(r()) ** 1.4;
    const th = u * Math.PI * 2, ph = Math.acos(2 * v - 1);
    pts.push([0.6 + Math.sin(ph) * Math.cos(th) * 1.6 * w, CENTRO.y + 0.12 + Math.cos(ph) * 0.95 * w, Math.sin(ph) * Math.sin(th) * 1.2 * w, 0.022 + r() * 0.03 * (1.2 - w * 0.5), r() < 0.14 ? 1 : 0]);
  }
  volcar(e, ordenar(pts, (q) => q[0] + q[1] * 0.3));
  return e;
}

// Puntos repartidos sobre una esfera (Fibonacci)
function esfera(k, rad, c) { const out = []; for (let i = 0; i < k; i++) { const y = 1 - (2 * (i + 0.5)) / k, rr = Math.sqrt(1 - y * y), a = i * 2.39996; out.push([c[0] + Math.cos(a) * rr * rad, c[1] + y * rad, c[2] + Math.sin(a) * rr * rad]); } return out; }

// 1 · personas: siete figuras en un arco suave, cabeza blanca y cuerpo negro
const FIGURAS = Array.from({ length: 7 }, (_, k) => { const x = -1.2 + k * 0.4; return { x, z: 0.32 * (x / 1.2) ** 2 - 0.12, h: [1, 0.94, 1.04, 0.97, 1.02, 0.92, 1][k] }; });
function personas(n, r) {
  const e = etapaVacia(n); e.giro = 0.08; const pts = [];
  const por = Math.floor(n / 7);
  FIGURAS.forEach((f, k) => {
    const m = k === 6 ? n - por * 6 : por, cab = Math.round(m * 0.26), cue = m - cab, h = f.h;
    for (const q of esfera(cab, 0.075 * h, [f.x, 0.6 * h, f.z])) pts.push([...q, 0.026, 1]);
    // cuerpo: tronco que se estrecha hacia abajo y hombros redondeados
    const filas = Math.max(6, Math.round(Math.sqrt(cue / 2.6))), cols = Math.ceil(cue / filas);
    let hechos = 0;
    for (let a = 0; a < filas && hechos < cue; a++) {
      const t = a / (filas - 1), y = (0.05 + t * 0.4) * h;
      // silueta: cintura estrecha, hombros anchos y redondeados
      const perfil = t < 0.55 ? 0.072 + 0.012 * t : 0.079 + 0.06 * Math.sin(((t - 0.55) / 0.45) * Math.PI * 0.5);
      const rad = perfil * h * (t > 0.88 ? Math.sqrt(Math.max(0, 1 - ((t - 0.88) / 0.13) ** 2)) : 1);
      for (let b = 0; b < cols && hechos < cue; b++, hechos++) { const an = (b / cols) * Math.PI * 2 + a * 0.4; pts.push([f.x + Math.cos(an) * rad, y, f.z + Math.sin(an) * rad, 0.028, 0]); }
    }
  });
  volcar(e, ordenar(ajustar(pts, n, r), (q) => q[0] + q[1] * 0.3));
  return e;
}

// 2 · procesos: las personas se convierten en nudos y aparecen los caminos entre ellas
const ARISTAS = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [0, 3], [3, 6], [1, 5], [2, 4], [0, 2], [4, 6]];
const nudo = (k) => new Vector3(FIGURAS[k].x, 0.18, FIGURAS[k].z);
function curva(a, b, t, out = new Vector3()) {
  const A = nudo(a), B = nudo(b), L = A.distanceTo(B), M = A.clone().lerp(B, 0.5); M.y += 0.22 + L * 0.32; M.z -= L * 0.12;
  const u = 1 - t; return out.set(u * u * A.x + 2 * u * t * M.x + t * t * B.x, u * u * A.y + 2 * u * t * M.y + t * t * B.y, u * u * A.z + 2 * u * t * M.z + t * t * B.z);
}
function procesos(n, r) {
  const e = etapaVacia(n); e.giro = 0.25; const pts = [];
  const enNudos = Math.round(n * 0.3), porNudo = Math.floor(enNudos / 7);
  FIGURAS.forEach((f, k) => { for (let i = 0; i < porNudo; i++) { const a = (i / porNudo) * Math.PI * 2, rad = 0.07 + (i % 3) * 0.035; pts.push([f.x + Math.cos(a) * rad, 0.18 + (i % 2) * 0.03, f.z + Math.sin(a) * rad, 0.026, 1]); } });
  const resto = n - pts.length, largos = ARISTAS.map(([a, b]) => nudo(a).distanceTo(nudo(b)) + 0.3), total = largos.reduce((x, y) => x + y);
  let dados = 0; const v = new Vector3();
  ARISTAS.forEach(([a, b], k) => {
    const m = k === ARISTAS.length - 1 ? resto - dados : Math.round((resto * largos[k]) / total); dados += m;
    for (let i = 0; i < m; i++) { const t = (i + 0.5) / m; curva(a, b, t, v); pts.push([v.x + (r() - 0.5) * 0.02, v.y + (r() - 0.5) * 0.02, v.z + (r() - 0.5) * 0.02, 0.02, 0]); }
  });
  volcar(e, ordenar(ajustar(pts, n, r), (q) => q[0] + q[1] * 0.3));
  return e;
}

// 3 · datos: un campo de columnas (como un gráfico de barras en 3D); la pieza más alta de cada columna, blanca
const CAMPO = { cols: 24, filas: 14, paso: 0.13, lado: 0.082 };
const alturaDato = (x, z) => 0.5 + 0.5 * (0.55 * Math.sin(x * 2.1 + 0.6) * Math.cos(z * 2.6 - 0.4) + 0.3 * Math.sin(x * 4.3 - z * 3.1) + 0.15 * Math.cos(x * 7.7 + z * 5.3));
function datos(n, r) {
  const e = etapaVacia(n); e.giro = 0; const { cols, filas, paso, lado } = CAMPO; const celdas = [];
  for (let a = 0; a < cols; a++) for (let b = 0; b < filas; b++) { const x = (a - (cols - 1) / 2) * paso, z = (b - (filas - 1) / 2) * paso - 0.05; celdas.push({ x, z, h: alturaDato(x, z) ** 1.6 }); }
  const suma = celdas.reduce((s, c) => s + c.h, 0); let dados = 0;
  celdas.forEach((c) => { c.k = Math.max(1, Math.floor((c.h / suma) * n)); dados += c.k; });
  const porAltura = celdas.slice().sort((a, b) => b.h - a.h); for (let i = 0; dados < n; i++, dados++) porAltura[i % porAltura.length].k++;
  for (let i = porAltura.length - 1; dados > n; i--) if (porAltura[i].k > 1) { porAltura[i].k--; dados--; }
  const pts = [];
  for (const c of celdas) for (let j = 0; j < c.k; j++) pts.push([c.x, lado / 2 + j * (lado * 1.04), c.z, lado * 0.94, j === c.k - 1 ? 1 : 0]);
  volcar(e, ordenar(pts, (q) => q[0] + q[1] * 0.3));
  return e;
}

// 4 · herramientas: cinco pantallas (aplicaciones) en arco, con su barra, su menú lateral y líneas de contenido
const PANTALLAS = Array.from({ length: 5 }, (_, k) => { const a = (k - 2) * 0.42; return { x: Math.sin(a) * 1.55, z: -Math.cos(a) * 1.55 + 1.25, y: CENTRO.y + (k % 2 ? 0.16 : -0.06), yaw: -a }; });
function herramientas(n, r) {
  const e = etapaVacia(n); e.giro = 0; e.yaw = new Float32Array(n); const pts = [];
  const C = 18, F = 12, p = 0.034, por = Math.floor(n / 5);
  PANTALLAS.forEach((s, k) => {
    const m = k === 4 ? n - por * 4 : por, cy = Math.cos(s.yaw), sy = Math.sin(s.yaw);
    const sitio = (i, j, dz) => { const lx = (i - (C - 1) / 2) * p, ly = ((F - 1) / 2 - j) * p; return [s.x + lx * cy + dz * sy, s.y + ly, s.z - lx * sy + dz * cy]; };
    const fondo = [], frente = [];
    for (let j = 0; j < F; j++) for (let i = 0; i < C; i++) fondo.push([...sitio(i, j, 0), p * 0.92, 0, s.yaw]);
    // contenido, por orden de importancia: barra superior, menú lateral, líneas de texto y una tarjeta
    const lleno = (i, j) => j === 0 || (i <= 3 && j >= 2 && j % 2 === 0) || (i >= 6 && j >= 2 && j <= 9 && j % 2 === 0 && i <= 6 + ((j * 5 + k * 3) % 9)) || (i >= 6 && i <= 16 && j === 11);
    for (let j = 0; j < F; j++) for (let i = 0; i < C; i++) if (lleno(i, j)) frente.push([...sitio(i, j, 0.026), p * 0.86, 1, s.yaw]);
    let lista = fondo.concat(frente); lista = ajustar(lista, m, r); pts.push(...lista);
  });
  volcar(e, pts.length === n ? pts : ajustar(pts, n, r));
  return e;
}

// 5 · IA: tres anillos inclinados orbitan un núcleo de vidrio (el píxel azul, dentro)
const ANILLOS = [{ r: 0.44, inc: 0.35, rot: 0.2, vel: 0.32 }, { r: 0.6, inc: -0.6, rot: 1.3, vel: -0.22 }, { r: 0.78, inc: 1.1, rot: 2.3, vel: 0.15 }];
function ia(n, r) {
  const e = etapaVacia(n); e.giro = 0.4;
  const par = new Float32Array(n * 3); const tot = ANILLOS.reduce((s, a) => s + a.r, 0); let k = 0;
  ANILLOS.forEach((a, j) => { const m = j === 2 ? n - k : Math.round((n * a.r) / tot); for (let i = 0; i < m; i++, k++) { par[k * 3] = j; par[k * 3 + 1] = (i / m) * Math.PI * 2; par[k * 3 + 2] = (r() - 0.5) * 0.028; e.t[k] = 0.022; e.c[k] = i % 14 === 0 ? 1 : 0; } });
  const q = new Vector3();
  e.viva = (i, tiempo, out) => {
    const a = ANILLOS[par[i * 3]], th = par[i * 3 + 1] + tiempo * a.vel, rad = a.r + par[i * 3 + 2];
    q.set(Math.cos(th) * rad, par[i * 3 + 2] * 0.5, Math.sin(th) * rad);
    q.applyAxisAngle(XX, a.inc).applyAxisAngle(YY, a.rot);
    out[0] = CENTRO.x + q.x; out[1] = CENTRO.y + q.y; out[2] = CENTRO.z + q.z;
  };
  return e;
}
const XX = new Vector3(1, 0, 0), YY = new Vector3(0, 1, 0);

// 6 · automatizar: un bucle continuo (nudo 2·3) por el que las piezas corren solas
const bucleEn = (u, out) => { const th = u * Math.PI * 2, rad = 0.62 + 0.2 * Math.cos(3 * th); out[0] = CENTRO.x + rad * Math.cos(2 * th); out[1] = CENTRO.y + 0.26 * Math.sin(3 * th); out[2] = CENTRO.z + rad * Math.sin(2 * th) * 0.8; return out; };
function automatizar(n, r) {
  const e = etapaVacia(n); e.giro = 0.5; const par = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { par[i * 3] = i / n; const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 0.032; par[i * 3 + 1] = Math.cos(a) * d; par[i * 3 + 2] = Math.sin(a) * d; e.t[i] = 0.016 + r() * 0.008; e.c[i] = r() < 0.16 ? 1 : 0; }
  const o = [0, 0, 0];
  e.viva = (i, tiempo, out) => { bucleEn((par[i * 3] + tiempo * 0.035) % 1, o); out[0] = o[0] + par[i * 3 + 1]; out[1] = o[1] + par[i * 3 + 2]; out[2] = o[2] + par[i * 3 + 1] * 0.6; };
  return e;
}

// 7 · el sistema: el logotipo, relleno de piezas (dos capas), sin el píxel de la IA (ese es la pieza azul)
function dentro(pol, x, y) { let d = false; for (let i = 0, j = pol.length - 1; i < pol.length; j = i++) { const [xi, yi] = pol[i], [xj, yj] = pol[j]; if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) d = !d; } return d; }
const enLogo = (x, y) => CUBOS.some(([nm, cx, cy, l]) => nm !== "ia" && x >= cx && x <= cx + l && y >= cy && y <= cy + l) || ARCOS.some(([, pol]) => dentro(pol, x, y));
const aMundo = (x, y) => [(x - 60) * S, (100 - y) * S + LOGO_Y];
function logo(n, r) {
  const e = etapaVacia(n); e.giro = 0;
  // el paso de la rejilla se elige para que dos capas quepan en n piezas
  let paso = 2, celdas = [];
  for (let k = 0; k < 40; k++) { celdas = []; for (let y = paso / 2; y < 100; y += paso) for (let x = paso / 2; x < 120; x += paso) if (enLogo(x, y)) celdas.push([x, y]); if (celdas.length * 2 <= n) break; paso *= 1.03; }
  const lado = paso * S * 0.985, pts = [];
  for (const dz of [-PROF / 4, PROF / 4]) for (const [x, y] of celdas) { const [wx, wy] = aMundo(x, y); pts.push([wx, wy, dz, lado, 0]); }
  volcar(e, ordenar(ajustar(pts, n, r), (q) => q[0] + q[1] * 0.3));
  return e;
}
const IA_LOGO = (() => { const [, x, y, l] = CUBOS.find(([nm]) => nm === "ia"); const [wx, wy] = aMundo(x + l / 2, y + l / 2); return { p: new Vector3(wx, wy, 0), l: l * S }; })();

/* ======================================================== cámara por etapa
   ojo, mirada y apertura. Entre etapas la cámara vuela por una curva suave. */
const CAMARA = [
  { ojo: [0, 1.15, 4.4], mira: [0, 0.95, 0], fov: 32 },
  { ojo: [0.15, 1.0, 4.4], mira: [0, 0.4, 0], fov: 30 },
  { ojo: [0.1, 2.6, 2.9], mira: [0, 0.3, 0], fov: 30 },
  { ojo: [2.0, 1.7, 2.7], mira: [0, 0.22, 0], fov: 30 },
  { ojo: [0, 1.1, 4.0], mira: [0, 0.95, 0.2], fov: 30 },
  { ojo: [0, 1.05, 3.6], mira: [0, 0.92, 0], fov: 30 },
  { ojo: [-0.7, 1.65, 3.4], mira: [0, 0.9, 0], fov: 30 },
  { ojo: [0.6, 1.0, 3.2], mira: [0, 0.84, 0], fov: 30 },
];

/* ======================================================== paquetes de datos
   Pequeñas piezas brillantes que viajan por los caminos de cada etapa. */
function paquete(etapa, j, M, tiempo, out) {
  const u = (j / M + tiempo * 0.09 * (1 + (j % 3) * 0.25)) % 1;
  if (etapa === 2 || etapa === 3) {
    const [a, b] = ARISTAS[j % ARISTAS.length]; const v = curva(a, b, j % 2 ? u : 1 - u);
    if (etapa === 3) { // por encima del campo de datos
      const x = -1.5 + u * 3, z = ((j % 7) - 3) * 0.26; out[0] = x; out[1] = alturaDato(x, z) ** 1.6 * 0.42 + 0.22; out[2] = z; return true;
    }
    out[0] = v.x; out[1] = v.y; out[2] = v.z; return true;
  }
  if (etapa === 4) { const k = j % 4, A = PANTALLAS[k], B = PANTALLAS[k + 1]; out[0] = mezcla(A.x, B.x, u); out[1] = mezcla(A.y, B.y, u) + Math.sin(u * Math.PI) * 0.22; out[2] = mezcla(A.z, B.z, u) + Math.sin(u * Math.PI) * 0.18; return true; }
  if (etapa === 5) { const a = ANILLOS[j % 3], th = u * Math.PI * 2 * 1.6; const q = new Vector3(Math.cos(th) * a.r, 0, Math.sin(th) * a.r).applyAxisAngle(XX, a.inc).applyAxisAngle(YY, a.rot); out[0] = CENTRO.x + q.x; out[1] = CENTRO.y + q.y; out[2] = CENTRO.z + q.z; return true; }
  if (etapa === 6) { bucleEn((u * 1.0 + tiempo * 0.04) % 1, out); return true; }
  return false;
}

/* ================================================================ montar */
export function montar(lienzo, { movil = false, claro = false } = {}) {
  const N = movil ? 760 : 1500, M = movil ? 28 : 56;
  const renderer = new WebGLRenderer({ canvas: lienzo, alpha: true, antialias: (devicePixelRatio || 1) < 2, powerPreference: "high-performance", premultipliedAlpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = AgXToneMapping; renderer.outputColorSpace = SRGBColorSpace;
  const escena = new Scene();
  const pm = new PMREMGenerator(renderer); escena.environment = pm.fromScene(estudio(), 0.03).texture; pm.dispose();
  const cam = new PerspectiveCamera(32, 1, 0.05, 60);
  const mundo = new Group(); escena.add(mundo);

  // ---- las formas de cada etapa (con semilla: siempre iguales, diseñadas)
  const r = azar(23);
  const E = [nube(N, r), personas(N, r), procesos(N, r), datos(N, r), herramientas(N, r), ia(N, r), automatizar(N, r), logo(N, r)];

  // ---- las piezas: una sola malla instanciada
  const relieve = microRelieve();
  const ceramica = new MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.32, metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.1, normalMap: relieve, normalScale: new Vector2(0.03, 0.03), envMapIntensity: 1.1 });
  const piezas = new InstancedMesh(new RoundedBoxGeometry(1, 1, 1, 2, 0.14), ceramica, N);
  piezas.instanceMatrix.setUsage(DynamicDrawUsage); piezas.frustumCulled = false; mundo.add(piezas);
  const NEGRO = new Color(0x0d0d0f), BLANCO = new Color(0xe8e8e4), col = new Color();
  for (let i = 0; i < N; i++) piezas.setColorAt(i, NEGRO);

  // estado físico de cada pieza
  const P = new Float32Array(N * 3), V = new Float32Array(N * 3), rig = new Float32Array(N), ret = new Float32Array(N), fase = new Float32Array(N * 3), escala = new Float32Array(N), blanco = new Float32Array(N);
  for (let i = 0; i < N; i++) { rig[i] = 0.75 + r() * 0.55; ret[i] = r(); fase[i * 3] = r() * 6.28; fase[i * 3 + 1] = r() * 6.28; fase[i * 3 + 2] = r() * 6.28; }
  for (let i = 0; i < N * 3; i++) P[i] = E[0].p[i];
  for (let i = 0; i < N; i++) { escala[i] = E[0].t[i]; blanco[i] = E[0].c[i]; }

  // ---- el núcleo de vidrio (IA) y el píxel azul del logotipo
  const vidrio = new Mesh(new SphereGeometry(0.21, 64, 48), new MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.06, metalness: 0, transmission: 1, thickness: 0.22, ior: 1.3, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.2, attenuationColor: new Color(0xdcdcdc), attenuationDistance: 1.2 }));
  vidrio.position.copy(CENTRO); vidrio.scale.setScalar(0.001); vidrio.visible = false; vidrio.userData.sinSombra = true; mundo.add(vidrio);
  const azul = new MeshPhysicalMaterial({ color: 0x1d4fe8, roughness: 0.2, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04, emissive: 0x2f64ff, emissiveIntensity: 0, envMapIntensity: 1.1 });
  const pixel = new Mesh(new RoundedBoxGeometry(IA_LOGO.l, IA_LOGO.l, PROF, 4, 0.022), azul); pixel.visible = false; mundo.add(pixel);

  // ---- caminos (procesos) y enlaces (herramientas): líneas finas
  const lineaMat = (o) => new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, toneMapped: false, ...o });
  const caminos = (() => { const v = [], a = new Vector3(), b = new Vector3(); for (const [x, y] of ARISTAS) for (let i = 0; i < 32; i++) { curva(x, y, i / 32, a); curva(x, y, (i + 1) / 32, b); v.push(a.x, a.y, a.z, b.x, b.y, b.z); } const g = new BufferGeometry(); g.setAttribute("position", new Float32BufferAttribute(v, 3)); const l = new LineSegments(g, lineaMat()); l.userData.sinSombra = true; mundo.add(l); return l; })();
  const enlaces = (() => { const v = []; for (let k = 0; k < 4; k++) { const A = PANTALLAS[k], B = PANTALLAS[k + 1]; for (let i = 0; i < 24; i++) { const pt = (u) => [mezcla(A.x, B.x, u), mezcla(A.y, B.y, u) + Math.sin(u * Math.PI) * 0.22, mezcla(A.z, B.z, u) + Math.sin(u * Math.PI) * 0.18]; v.push(...pt(i / 24), ...pt((i + 1) / 24)); } } const g = new BufferGeometry(); g.setAttribute("position", new Float32BufferAttribute(v, 3)); const l = new LineSegments(g, lineaMat()); l.userData.sinSombra = true; mundo.add(l); return l; })();

  // ---- paquetes de datos
  const paqMat = new MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  const paquetes = new InstancedMesh(new RoundedBoxGeometry(1, 1, 1, 1, 0.2), paqMat, M); paquetes.instanceMatrix.setUsage(DynamicDrawUsage); paquetes.frustumCulled = false; paquetes.userData.sinSombra = true; mundo.add(paquetes);

  // ---- suelo: charco de luz (modo oscuro) y sombra de contacto
  const cv = document.createElement("canvas"); cv.width = cv.height = 256; const g2 = cv.getContext("2d");
  const gr = g2.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.45, "rgba(255,255,255,.32)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g2.fillStyle = gr; g2.fillRect(0, 0, 256, 256);
  const tl = new CanvasTexture(cv); tl.colorSpace = SRGBColorSpace;
  const charco = new Mesh(new PlaneGeometry(6.4, 4).rotateX(-Math.PI / 2), new MeshBasicMaterial({ map: tl, transparent: true, depthWrite: false, opacity: 0.12, toneMapped: false }));
  charco.position.set(0, 0, 0.2); charco.userData.sinSombra = true; mundo.add(charco);
  const sombra = sombraContacto(renderer, escena, movil ? 256 : 512, 6.4, 4.6, 2.2);

  /* ----------------------------------------------------------- encuadre */
  let W = 1, H = 1, dpr = Math.min(devicePixelRatio || 1, movil ? 1.6 : 1.85), lado = true;
  const medir = () => {
    const b = lienzo.getBoundingClientRect(); W = Math.max(1, b.width); H = Math.max(1, b.height);
    renderer.setPixelRatio(dpr); renderer.setSize(W, H, false); cam.aspect = W / H;
    lado = W >= 1100 && W / H > 1; // texto a la izquierda y escena a la derecha; si no, escena arriba y texto abajo
    if (lado) cam.setViewOffset(W, H, -W * 0.16, 0, W, H); else cam.setViewOffset(W, H, 0, H * (W / H < 0.8 ? 0.2 : 0.14), W, H);
    cam.updateProjectionMatrix(); pedir();
  };

  /* ------------------------------------------------------------- estado */
  let objetivo = 0, s = 0, vel = 0, visible = true, raf = 0, ultimo = performance.now(), reloj = 0;
  const puntero = new Vector2(9, 9), punteroS = new Vector2(9, 9), parallax = new Vector2(), parallaxS = new Vector2();
  let hayPuntero = false, giro = 0, giroV = 0, arrastrando = false, xAnt = 0;
  const ray = new Raycaster(), O = new Vector3(), D = new Vector3(), mat = new Matrix4(), q = new Quaternion(), eu = new Euler(), esc = new Vector3(), pos = new Vector3();
  const tA = [0, 0, 0], tB = [0, 0, 0], o3 = [0, 0, 0];
  const ojo = new Vector3(), mira = new Vector3(), ojoA = new Vector3(), ojoB = new Vector3(), miraA = new Vector3(), miraB = new Vector3();
  let medias = [], bajadas = 0, primero = true, colorSucio = true;

  const objetivoDe = (e, i, out) => { if (e.viva) e.viva(i, reloj, out); else { out[0] = e.p[i * 3]; out[1] = e.p[i * 3 + 1]; out[2] = e.p[i * 3 + 2]; } };

  function paso(dt) {
    reloj += dt;
    const a = Math.min(ETAPAS - 1, Math.floor(s)), b = Math.min(ETAPAS - 1, a + 1), f = s - a;
    const EA = E[a], EB = E[b];
    const suelto = mezcla(EA.giro, EB.giro, f);
    // cursor → rayo en el espacio del mundo (la escena puede estar girada)
    let conRayo = false;
    if (hayPuntero && punteroS.x < 2) {
      ray.setFromCamera(punteroS, cam); O.copy(ray.ray.origin); D.copy(ray.ray.direction);
      mundo.updateMatrixWorld(); const inv = mat.copy(mundo.matrixWorld).invert(); O.applyMatrix4(inv); D.transformDirection(inv); conRayo = true;
    }
    const fuerzaCursor = 0.55 + 1.6 * suelto, radio = 0.3, K = 30, amort = 2 * Math.sqrt(K) * 0.72;
    for (let i = 0; i < N; i++) {
      // cada pieza empieza su cambio con un pequeño retraso propio: la forma se deshace y se rehace en ola
      const k = suave((f * 1.5 - ret[i] * 0.5));
      objetivoDe(EA, i, tA); if (b !== a) objetivoDe(EB, i, tB); else { tB[0] = tA[0]; tB[1] = tA[1]; tB[2] = tA[2]; }
      // las piezas sueltas nunca están del todo quietas
      const deriva = 0.05 * mezcla(EA.giro, EB.giro, k), ph = fase[i * 3];
      const tx = mezcla(tA[0], tB[0], k) + Math.sin(reloj * 0.5 + ph) * deriva, ty = mezcla(tA[1], tB[1], k) + Math.sin(reloj * 0.42 + fase[i * 3 + 1]) * deriva, tz = mezcla(tA[2], tB[2], k) + Math.cos(reloj * 0.37 + fase[i * 3 + 2]) * deriva;
      const j = i * 3; let fx = (tx - P[j]) * K * rig[i] - V[j] * amort, fy = (ty - P[j + 1]) * K * rig[i] - V[j + 1] * amort, fz = (tz - P[j + 2]) * K * rig[i] - V[j + 2] * amort;
      if (conRayo) { // distancia de la pieza al rayo del puntero: si está cerca, se aparta
        const px = P[j] - O.x, py = P[j + 1] - O.y, pz = P[j + 2] - O.z, d = px * D.x + py * D.y + pz * D.z;
        const rx = px - D.x * d, ry = py - D.y * d, rz = pz - D.z * d, dist = Math.hypot(rx, ry, rz);
        if (dist < radio && dist > 1e-4) { const em = (1 - dist / radio) ** 2 * fuerzaCursor * 60 / dist; fx += rx * em; fy += ry * em; fz += rz * em; }
      }
      V[j] += fx * dt; V[j + 1] += fy * dt; V[j + 2] += fz * dt;
      P[j] += V[j] * dt; P[j + 1] += V[j + 1] * dt; P[j + 2] += V[j + 2] * dt;
      if (P[j + 1] < escala[i] * 0.5) { P[j + 1] = escala[i] * 0.5; V[j + 1] *= -0.3; } // el suelo existe
      escala[i] = mezcla(EA.t[i], EB.t[i], k);
      const bl = mezcla(EA.c[i], EB.c[i], k); if (Math.abs(bl - blanco[i]) > 0.01) { blanco[i] = bl; colorSucio = true; }
      // giro: libre cuando está suelta, alineada cuando forma parte de algo
      const g = mezcla(EA.giro, EB.giro, k) + Math.min(0.6, Math.hypot(V[j], V[j + 1], V[j + 2]) * 0.4);
      const yaw = mezcla(EA.yaw ? EA.yaw[i] : 0, EB.yaw ? EB.yaw[i] : 0, k);
      eu.set(Math.sin(reloj * 0.31 + ph) * 2.2 * g, yaw + Math.sin(reloj * 0.27 + fase[i * 3 + 1]) * 2.6 * g, Math.cos(reloj * 0.23 + fase[i * 3 + 2]) * 1.8 * g);
      q.setFromEuler(eu); pos.set(P[j], P[j + 1], P[j + 2]); esc.setScalar(escala[i]);
      mat.compose(pos, q, esc); piezas.setMatrixAt(i, mat);
    }
    piezas.instanceMatrix.needsUpdate = true;
    if (colorSucio) { for (let i = 0; i < N; i++) piezas.setColorAt(i, col.copy(NEGRO).lerp(BLANCO, blanco[i])); piezas.instanceColor.needsUpdate = true; colorSucio = false; }

    // núcleo de vidrio y píxel azul
    const vV = campana(s, 4.15, 4.85, 6.0, 6.75);
    vidrio.visible = vV > 0.002; vidrio.scale.setScalar(Math.max(0.001, vV) * (1 + Math.sin(reloj * 1.3) * 0.015));
    const pIA = suave((s - 4.3) / 0.6), pLogo = suave((s - 6.2) / 0.7);
    pixel.visible = pIA > 0.002;
    pixel.position.lerpVectors(CENTRO, IA_LOGO.p, pLogo);
    pixel.scale.setScalar(Math.max(0.001, pIA) * mezcla(0.62, 1, pLogo));
    eu.set(mezcla(0.5 + reloj * 0.4, 0, pLogo), mezcla(reloj * 0.6, 0, pLogo), mezcla(0.6, 0, pLogo)); pixel.quaternion.setFromEuler(eu);
    azul.emissiveIntensity = mezcla(1.1 + Math.sin(reloj * 2) * 0.15, 0.38, pLogo) * pIA;

    // líneas y paquetes
    caminos.material.opacity = 0.32 * campana(s, 1.45, 1.95, 2.35, 2.85);
    enlaces.material.opacity = 0.38 * campana(s, 3.45, 3.95, 4.3, 4.8);
    const vP = campana(s, 1.6, 2.1, 6.2, 6.7);
    for (let j = 0; j < M; j++) {
      const okA = paquete(a, j, M, reloj, tA), okB = paquete(b, j, M, reloj, tB);
      const t = suave(f * 1.4 - 0.2);
      let x, y, z, vis;
      if (okA && okB) { x = mezcla(tA[0], tB[0], t); y = mezcla(tA[1], tB[1], t); z = mezcla(tA[2], tB[2], t); vis = 1; }
      else if (okA) { x = tA[0]; y = tA[1]; z = tA[2]; vis = 1 - t; }
      else if (okB) { x = tB[0]; y = tB[1]; z = tB[2]; vis = t; }
      else { x = CENTRO.x; y = CENTRO.y; z = CENTRO.z; vis = 0; }
      pos.set(x, y, z); esc.setScalar(Math.max(0.0001, 0.026 * vis * vP)); mat.compose(pos, q.identity(), esc); paquetes.setMatrixAt(j, mat);
    }
    paquetes.instanceMatrix.needsUpdate = true;

    // cámara: vuela entre los encuadres de cada etapa; el puntero la desplaza un poco
    const ca = CAMARA[a], cb = CAMARA[b], cf = suave(f);
    ojoA.fromArray(ca.ojo); ojoB.fromArray(cb.ojo); miraA.fromArray(ca.mira); miraB.fromArray(cb.mira);
    ojo.lerpVectors(ojoA, ojoB, cf); mira.lerpVectors(miraA, miraB, cf);
    // arco: a mitad de camino la cámara se aleja un poco (vuelo, no zoom plano)
    const d0 = ojo.clone().sub(mira); ojo.addScaledVector(d0.normalize(), Math.sin(cf * Math.PI) * 0.35);
    if (!lado) ojo.sub(mira).multiplyScalar(0.84).add(mira); // en vertical, un poco más cerca
    ojo.x += parallaxS.x * 0.22; ojo.y += -parallaxS.y * 0.12;
    cam.position.copy(ojo); cam.lookAt(mira);
    // En vertical, el mismo encuadre necesita más ángulo: se conserva el campo horizontal de una pantalla 16:10.
    let fov = mezcla(ca.fov, cb.fov, cf);
    const asp = W / H; if (asp < 1.45) { const RAD = Math.PI / 180, hf = 2 * Math.atan(Math.tan((fov / 2) * RAD) * 1.12); fov = Math.min(72, (2 * Math.atan(Math.tan(hf / 2) / asp)) / RAD); }
    if (Math.abs(cam.fov - fov) > 0.01) { cam.fov = fov; cam.updateProjectionMatrix(); }
    escena.environmentRotation.y = -0.4 + s * 0.22 + parallaxS.x * 0.3;
    mundo.rotation.y = giro;
    return vP > 0 || suelto > 0.05 || Math.abs(objetivo - s) > 1e-4;
  }

  const bucle = (t) => {
    raf = 0; if (!visible) return;
    const dt = Math.min(0.04, (t - ultimo) / 1000); ultimo = t;
    // muelle críticamente amortiguado sobre la etapa (sin rebote)
    const k = 26, c = 2 * Math.sqrt(k); vel += ((objetivo - s) * k - vel * c) * dt; s += vel * dt;
    if (Math.abs(objetivo - s) < 0.0004 && Math.abs(vel) < 0.002) { s = objetivo; vel = 0; }
    punteroS.lerp(puntero, primero ? 1 : 1 - Math.exp(-dt * 10)); parallaxS.lerp(parallax, 1 - Math.exp(-dt * 3));
    if (!arrastrando) { giroV += (-giro * 2.2 - giroV * 2.4) * dt; giro += giroV * dt; }
    paso(primero ? 1 / 60 : dt); primero = false;
    sombra.pintar(); renderer.render(escena, cam);
    if (dt > 0) { medias.push(dt); if (medias.length === 45) { const m = medias.reduce((x, y) => x + y) / 45; medias = []; if (m > 0.021 && dpr > 1) { dpr = Math.max(1, dpr - 0.25); bajadas++; medir(); } } }
    pedir(); // las piezas siempre respiran mientras la escena está a la vista
  };
  function pedir() { if (!raf && visible) raf = requestAnimationFrame(bucle); }

  new ResizeObserver(medir).observe(lienzo);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting && !document.hidden; if (visible) { ultimo = performance.now(); pedir(); } }); io.observe(lienzo);
  document.addEventListener("visibilitychange", () => { visible = !document.hidden; if (visible) { ultimo = performance.now(); pedir(); } });
  const finoPuntero = matchMedia("(pointer: fine)").matches;
  if (finoPuntero) addEventListener("pointermove", (e) => {
    const b = lienzo.getBoundingClientRect(); const x = ((e.clientX - b.left) / b.width) * 2 - 1, y = -(((e.clientY - b.top) / b.height) * 2 - 1);
    puntero.set(x, y); parallax.set(x, -y); hayPuntero = true;
    if (arrastrando) { const dx = e.clientX - xAnt; xAnt = e.clientX; giro += dx * 0.006; giroV = dx * 0.35; }
  }, { passive: true });
  // arrastrar (ratón o dedo, en horizontal) gira el sistema entero; al soltar vuelve solo a su sitio
  lienzo.addEventListener("pointerdown", (e) => { arrastrando = true; xAnt = e.clientX; lienzo.setPointerCapture(e.pointerId); lienzo.classList.add("is-arrastrando"); });
  if (!finoPuntero) lienzo.addEventListener("pointermove", (e) => { if (!arrastrando) return; const dx = e.clientX - xAnt; xAnt = e.clientX; giro += dx * 0.008; giroV = dx * 0.4; }, { passive: true });
  const soltar = () => { arrastrando = false; lienzo.classList.remove("is-arrastrando"); };
  lienzo.addEventListener("pointerup", soltar); lienzo.addEventListener("pointercancel", soltar);
  addEventListener("blur", () => { hayPuntero = false; puntero.set(9, 9); });
  document.addEventListener("pointerleave", () => { hayPuntero = false; puntero.set(9, 9); });
  medir();

  return {
    /** etapa: 0 … 7 (puede tener decimales: a medio camino entre dos) */
    etapa(v, inmediato) { objetivo = Math.min(ETAPAS - 1, Math.max(0, v)); if (inmediato) { s = objetivo; vel = 0; for (let i = 0; i < N; i++) { const a = Math.min(7, Math.round(s)); objetivoDe(E[a], i, o3); P[i * 3] = o3[0]; P[i * 3 + 1] = o3[1]; P[i * 3 + 2] = o3[2]; escala[i] = E[a].t[i]; blanco[i] = E[a].c[i]; } colorSucio = true; } pedir(); },
    tema(esClaro) {
      sombra.opacidad = esClaro ? 0.9 : 0.85; charco.material.opacity = esClaro ? 0 : 0.12;
      ceramica.envMapIntensity = esClaro ? 1.05 : 1.5; azul.envMapIntensity = esClaro ? 1.1 : 1.4; renderer.toneMappingExposure = esClaro ? 1 : 1.12;
      const tinta = esClaro ? 0x111111 : 0xffffff; caminos.material.color.set(tinta); enlaces.material.color.set(tinta); paqMat.color.set(tinta);
      pedir();
    },
    get calidad() { return { dpr, bajadas, piezas: N }; },
    /** pruebas y capturas: avanza n fotogramas sin esperar a requestAnimationFrame */
    forzar(n = 90) { for (let i = 0; i < n; i++) { const dt = 1 / 60; const k = 26, c = 2 * Math.sqrt(k); vel += ((objetivo - s) * k - vel * c) * dt; s += vel * dt; punteroS.copy(puntero); paso(dt); } sombra.pintar(); renderer.render(escena, cam); },
  };
}
