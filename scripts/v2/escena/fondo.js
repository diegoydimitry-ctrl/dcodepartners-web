/* ==========================================================================
   D-CODE · EL FONDO VIVO (three.js, WebGL)
   --------------------------------------------------------------------------
   Una sola escena, fija detrás de toda la web. Las mismas piezas de
   cerámica (negras y alguna blanca) toman una forma distinta en cada
   sección mientras bajas con normalidad (sin secciones que se queden
   clavadas ni recorridos largos):

     logo      el logotipo de D-Code, montado con piezas (portada)
     helice    una doble hélice que sube sin parar (cómo trabajamos)
     ola       un campo de piezas que ondula (lo que cambia)
     columnas  torres de piezas que crecen y bajan (lo que instalamos)
     anillo    tres órbitas alrededor de un núcleo de vidrio con el
               píxel azul (la IA, las demos)
     cubo      un cubo hueco que gira (el sistema, el cierre)
     polvo     pocas piezas, quietas y lejos (páginas de lectura)

   Cada sección dice qué forma quiere, a qué lado (para dejar libre la
   columna de texto) y con qué intensidad. El cambio de forma es físico:
   cada pieza persigue su nuevo sitio con su propio muelle.
   El puntero aparta las piezas; un clic en un hueco las dispersa y se
   vuelven a montar solas.
   Rendimiento: una sola llamada de dibujo para todas las piezas, niebla
   en vez de efectos de pantalla, menos píxeles si el aparato no llega,
   y la escena se duerme si la pestaña no se ve.
   ========================================================================== */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, InstancedMesh, Color, Vector3, Vector2, Euler, Quaternion, Matrix4,
  MeshPhysicalMaterial, SphereGeometry, PMREMGenerator, AgXToneMapping, SRGBColorSpace, Raycaster, DynamicDrawUsage, Fog,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { S, PROF, CUBOS, ARCOS, azar, estudio, microRelieve } from "./piezas.js";

const suave = (t) => { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); };
const mezcla = (a, b, t) => a + (b - a) * t;
const XX = new Vector3(1, 0, 0), YY = new Vector3(0, 1, 0);

/* ================================================================ formas
   Cada forma da, para cada pieza i: sitio, tamaño, color (0 negro · 1
   blanco) y cuánto gira suelta. Las formas «vivas» mueven el sitio con
   el tiempo (la ola ondula, la hélice sube, las órbitas giran). */
const nueva = (n) => ({ p: new Float32Array(n * 3), t: new Float32Array(n), c: new Float32Array(n), giro: 0, viva: null, giroGrupo: 0 });
function ordenar(pts, clave) { return pts.map((p, i) => [clave(p), i]).sort((a, b) => a[0] - b[0]).map(([, i]) => pts[i]); }
function volcar(e, pts) { pts.forEach((q, i) => { e.p[i * 3] = q[0]; e.p[i * 3 + 1] = q[1]; e.p[i * 3 + 2] = q[2]; e.t[i] = q[3]; e.c[i] = q[4] || 0; }); }
function ajustar(pts, n, r) {
  const out = pts.slice();
  while (out.length > n) out.splice(Math.floor(r() * out.length), 1);
  while (out.length < n) { const q = pts[Math.floor(r() * pts.length)]; out.push([q[0], q[1], q[2] - 0.01, q[3] * 0.6, q[4]]); }
  return out;
}
const clave = (q) => q[0] + q[1] * 0.35;

function nube(n, r) {
  const e = nueva(n); e.giro = 1; const pts = [];
  for (let i = 0; i < n; i++) { const th = r() * 6.283, ph = Math.acos(2 * r() - 1), w = Math.cbrt(r()); pts.push([Math.sin(ph) * Math.cos(th) * 2.4 * w, Math.cos(ph) * 1.5 * w, Math.sin(ph) * Math.sin(th) * 1.4 * w, 0.03 + r() * 0.04, r() < 0.14 ? 1 : 0]); }
  volcar(e, ordenar(pts, clave)); return e;
}
function polvo(n, r) {
  const e = nueva(n); e.giro = 0.8; const pts = [];
  for (let i = 0; i < n; i++) pts.push([(r() - 0.5) * 6, (r() - 0.5) * 3.6, -1.5 - r() * 2.5, 0.018 + r() * 0.025, r() < 0.1 ? 1 : 0]);
  volcar(e, ordenar(pts, clave)); return e;
}
// El logotipo relleno de piezas (dos capas), centrado; el píxel de la IA es una pieza azul aparte.
function dentro(pol, x, y) { let d = false; for (let i = 0, j = pol.length - 1; i < pol.length; j = i++) { const [xi, yi] = pol[i], [xj, yj] = pol[j]; if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) d = !d; } return d; }
const enLogo = (x, y) => CUBOS.some(([nm, cx, cy, l]) => nm !== "ia" && x >= cx && x <= cx + l && y >= cy && y <= cy + l) || ARCOS.some(([, pol]) => dentro(pol, x, y));
const ESC_LOGO = 1.75;
const aLogo = (x, y) => [(x - 60) * S * ESC_LOGO, (50 - y) * S * ESC_LOGO];
function logo(n, r) {
  const e = nueva(n); e.giroGrupo = 0;
  let paso = 2, celdas = [];
  for (let k = 0; k < 60; k++) { celdas = []; for (let y = paso / 2; y < 100; y += paso) for (let x = paso / 2; x < 120; x += paso) if (enLogo(x, y)) celdas.push([x, y]); if (celdas.length * 2 <= n) break; paso *= 1.03; }
  const lado = paso * S * ESC_LOGO * 0.985, pts = [];
  for (const dz of [-PROF * ESC_LOGO / 4, PROF * ESC_LOGO / 4]) for (const [x, y] of celdas) { const [wx, wy] = aLogo(x, y); pts.push([wx, wy, dz, lado, 0]); }
  volcar(e, ordenar(ajustar(pts, n, r), clave)); return e;
}
const IA_LOGO = (() => { const [, x, y, l] = CUBOS.find(([nm]) => nm === "ia"); const [wx, wy] = aLogo(x + l / 2, y + l / 2); return { p: new Vector3(wx, wy, 0), l: l * S * ESC_LOGO }; })();

// Doble hélice que sube sin parar; cada tres vueltas, un peldaño blanco entre las dos hebras
function helice(n, r) {
  const e = nueva(n); e.giro = 0.15; const par = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const hebra = i % 5 === 4 ? 2 : i % 2; par[i * 3] = hebra; par[i * 3 + 1] = (i / n); par[i * 3 + 2] = r(); e.t[i] = hebra === 2 ? 0.03 : 0.045; e.c[i] = hebra === 2 ? 1 : 0; }
  e.viva = (i, t, o) => {
    const u = (par[i * 3 + 1] + t * 0.018) % 1, y = (u - 0.5) * 3.2, a = u * Math.PI * 7 + t * 0.25, hebra = par[i * 3];
    if (hebra === 2) { const k = par[i * 3 + 2] * 2 - 1; o[0] = Math.cos(a) * 0.62 * k; o[1] = y; o[2] = Math.sin(a) * 0.62 * k; return; }
    const ph = a + hebra * Math.PI; o[0] = Math.cos(ph) * 0.62; o[1] = y; o[2] = Math.sin(ph) * 0.62;
  };
  return e;
}
// Un campo de piezas que ondula, visto un poco desde arriba
function ola(n, r) {
  const e = nueva(n); e.giro = 0; const cols = Math.round(Math.sqrt(n * 1.5)), filas = Math.ceil(n / cols), paso = 0.11;
  const par = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) { const a = i % cols, b = Math.floor(i / cols); par[i * 2] = (a - (cols - 1) / 2) * paso; par[i * 2 + 1] = (b - (filas - 1) / 2) * paso; e.t[i] = 0.06; e.c[i] = 0; }
  e.viva = (i, t, o) => {
    const x = par[i * 2], z = par[i * 2 + 1], h = Math.sin(x * 1.6 + t * 0.7) * Math.cos(z * 2.1 - t * 0.5) * 0.22 + Math.sin((x + z) * 3.1 + t * 1.1) * 0.05;
    o[0] = x; o[1] = h - 0.4; o[2] = z;
    e.c[i] = h > 0.17 ? 1 : 0;
  };
  return e;
}
// Torres de piezas (2×2 por planta) que respiran: suben y bajan despacio
function columnas(n, r) {
  const e = nueva(n); e.giroGrupo = 0.06; const C = 6, F = 4, sep = 0.36, lado = 0.075, pts = [];
  const torres = []; for (let a = 0; a < C; a++) for (let b = 0; b < F; b++) torres.push({ x: (a - (C - 1) / 2) * sep, z: (b - (F - 1) / 2) * sep, h: 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(a * 1.7 + b * 2.3)) });
  const suma = torres.reduce((s, t) => s + t.h, 0); let dados = 0;
  torres.forEach((t, k) => { t.n = k === torres.length - 1 ? n - dados : Math.max(4, Math.round((t.h / suma) * n / 4) * 4); dados += t.n; });
  const par = new Float32Array(n * 4); let i = 0;
  torres.forEach((t, k) => { for (let j = 0; j < t.n && i < n; j++, i++) { const planta = Math.floor(j / 4), q = j % 4; par[i * 4] = t.x + ((q % 2) - 0.5) * lado * 1.05; par[i * 4 + 1] = planta; par[i * 4 + 2] = t.z + (Math.floor(q / 2) - 0.5) * lado * 1.05; par[i * 4 + 3] = k; e.t[i] = lado * 0.96; } });
  const alto = torres.map((t) => Math.ceil(t.n / 4));
  e.viva = (k, tt, o) => {
    const torre = par[k * 4 + 3], planta = par[k * 4 + 1], h = alto[torre], vivo = 0.7 + 0.3 * Math.sin(tt * 0.5 + torre * 1.3);
    o[0] = par[k * 4]; o[2] = par[k * 4 + 2]; o[1] = -0.9 + (planta < h * vivo ? planta : h * vivo - 0.5) * lado * 1.04;
    e.c[k] = Math.abs(planta - Math.floor(h * vivo) + 1) < 0.5 ? 1 : 0;
  };
  return e;
}
// Tres órbitas inclinadas alrededor del núcleo de vidrio
const ORBITAS = [{ r: 0.72, inc: 0.4, rot: 0.2, vel: 0.3 }, { r: 0.98, inc: -0.65, rot: 1.3, vel: -0.2 }, { r: 1.25, inc: 1.15, rot: 2.3, vel: 0.13 }];
function anillo(n, r) {
  const e = nueva(n); e.giro = 0.35; const par = new Float32Array(n * 3); const tot = ORBITAS.reduce((s, a) => s + a.r, 0); let k = 0;
  ORBITAS.forEach((a, j) => { const m = j === 2 ? n - k : Math.round((n * a.r) / tot); for (let i = 0; i < m; i++, k++) { par[k * 3] = j; par[k * 3 + 1] = (i / m) * Math.PI * 2; par[k * 3 + 2] = (r() - 0.5) * 0.04; e.t[k] = 0.034; e.c[k] = i % 13 === 0 ? 1 : 0; } });
  const q = new Vector3();
  e.viva = (i, t, o) => { const a = ORBITAS[par[i * 3]], th = par[i * 3 + 1] + t * a.vel, rad = a.r + par[i * 3 + 2]; q.set(Math.cos(th) * rad, par[i * 3 + 2], Math.sin(th) * rad).applyAxisAngle(XX, a.inc).applyAxisAngle(YY, a.rot); o[0] = q.x; o[1] = q.y; o[2] = q.z; };
  e.nucleo = true; return e;
}
// Un cubo hueco: las doce aristas llenas de piezas y algunas en las caras
function cubo(n, r) {
  const e = nueva(n); e.giroGrupo = 0.12; const L = 1.5, h = L / 2, pts = [];
  const V = [[-h, -h, -h], [h, -h, -h], [h, h, -h], [-h, h, -h], [-h, -h, h], [h, -h, h], [h, h, h], [-h, h, h]];
  const A = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  const enAristas = Math.round(n * 0.78), porArista = Math.floor(enAristas / 12);
  A.forEach(([a, b]) => { for (let i = 0; i < porArista; i++) { const t = i / (porArista - 1); for (let ax = 0; ax < 1; ax++) pts.push([mezcla(V[a][0], V[b][0], t), mezcla(V[a][1], V[b][1], t), mezcla(V[a][2], V[b][2], t), 0.07, i === 0 || i === porArista - 1 ? 1 : 0]); } });
  while (pts.length < n) { const cara = Math.floor(r() * 6), u = (r() - 0.5) * L * 0.86, v = (r() - 0.5) * L * 0.86, s = cara % 2 ? h : -h; const p = cara < 2 ? [s, u, v] : cara < 4 ? [u, s, v] : [u, v, s]; pts.push([p[0], p[1], p[2], 0.022, r() < 0.12 ? 1 : 0]); }
  volcar(e, ordenar(ajustar(pts, n, r), clave)); return e;
}
const FORMAS = { nube, polvo, logo, helice, ola, columnas, anillo, cubo };

/* ================================================================ montar */
export function montar(lienzo, { movil = false } = {}) {
  const N = movil ? 520 : 1200;
  const renderer = new WebGLRenderer({ canvas: lienzo, alpha: true, antialias: (devicePixelRatio || 1) < 2, powerPreference: movil ? "low-power" : "high-performance" });
  renderer.setClearColor(0x000000, 0); renderer.toneMapping = AgXToneMapping; renderer.outputColorSpace = SRGBColorSpace;
  const escena = new Scene(); escena.fog = new Fog(0x000000, 5.4, 12);
  const pm = new PMREMGenerator(renderer); escena.environment = pm.fromScene(estudio(), 0.03).texture; pm.dispose();
  const cam = new PerspectiveCamera(35, 1, 0.1, 40); cam.position.set(0, 0, 6);
  const grupo = new Group(); escena.add(grupo);

  const r = azar(41);
  const cache = {}; const forma = (k) => cache[k] || (cache[k] = FORMAS[k](N, r));
  const ceramica = new MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.1, normalMap: microRelieve(), normalScale: new Vector2(0.03, 0.03), envMapIntensity: 1.4 });
  const piezas = new InstancedMesh(new RoundedBoxGeometry(1, 1, 1, 2, 0.14), ceramica, N);
  piezas.instanceMatrix.setUsage(DynamicDrawUsage); piezas.frustumCulled = false; grupo.add(piezas);
  const NEGRO = new Color(0x0d0d0f), BLANCO = new Color(0xe8e8e4), col = new Color();
  for (let i = 0; i < N; i++) piezas.setColorAt(i, NEGRO);

  const vidrio = new Mesh(new SphereGeometry(0.36, 48, 36), new MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.06, transmission: movil ? 0 : 1, transparent: movil, opacity: movil ? 0.35 : 1, thickness: 0.3, ior: 1.3, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.3 }));
  vidrio.scale.setScalar(0.001); grupo.add(vidrio);
  const azul = new MeshPhysicalMaterial({ color: 0x1d4fe8, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.04, emissive: 0x2f64ff, emissiveIntensity: 0, envMapIntensity: 1.2 });
  const pixel = new Mesh(new RoundedBoxGeometry(IA_LOGO.l, IA_LOGO.l, PROF * ESC_LOGO, 4, 0.03), azul); pixel.scale.setScalar(0.001); grupo.add(pixel);

  // estado de cada pieza
  const P = new Float32Array(N * 3), V = new Float32Array(N * 3), rig = new Float32Array(N), fase = new Float32Array(N * 3), esc = new Float32Array(N), blanco = new Float32Array(N), ret = new Float32Array(N);
  for (let i = 0; i < N; i++) { rig[i] = 0.7 + r() * 0.6; ret[i] = r(); fase[i * 3] = r() * 6.28; fase[i * 3 + 1] = r() * 6.28; fase[i * 3 + 2] = r() * 6.28; }
  let actual = forma("nube"), previa = actual, cambio = 1; // cambio: 0 → 1 desde que se pide una forma nueva
  for (let i = 0; i < N * 3; i++) P[i] = actual.p[i] * 1.6;
  for (let i = 0; i < N; i++) { esc[i] = actual.t[i]; blanco[i] = actual.c[i]; }

  // lugar en pantalla: a la derecha (deja libre el texto), a la izquierda, al centro o abajo
  // «fondo»: detrás del texto, lejos y apagada por la niebla (secciones donde el texto ocupa todo el ancho)
  const LADOS = { der: [1.55, 0, 0], izq: [-1.55, 0, 0], centro: [0, 0, 0], abajo: [0.4, -1.15, 0], fondo: [0.6, -0.2, -3.2] };
  let lado = "der", grupoX = 1.55, grupoY = 0, grupoZ = 0, objX = 1.55, objY = 0, objZ = 0, escala = 1, objEscala = 1;

  /* ----------------------------------------------------------- encuadre */
  let W = 1, H = 1, dpr = Math.min(devicePixelRatio || 1, movil ? 1.5 : 1.75);
  const medir = () => { W = innerWidth; H = innerHeight; renderer.setPixelRatio(dpr); renderer.setSize(W, H, false); cam.aspect = W / H; cam.updateProjectionMatrix(); colocar(); pedir(); };
  const estrecha = () => W / H < 1.2 || W < 900;
  function colocar() {
    const [x, y, z] = estrecha() ? [0, lado === "abajo" ? -1.4 : 0.55, lado === "fondo" ? -2.6 : 0] : LADOS[lado] || LADOS.der;
    objZ = z;
    const ancho = Math.tan((cam.fov / 2) * Math.PI / 180) * 6 * cam.aspect; // medio ancho visible a la distancia del centro
    objX = estrecha() ? 0 : Math.sign(x) * Math.min(Math.abs(x), ancho * 0.52); objY = y;
    objEscala = estrecha() ? Math.min(1, ancho / 1.7) * 0.85 : 1;
  }

  /* -------------------------------------------------------------- bucle */
  let visible = !document.hidden, raf = 0, ultimo = performance.now(), reloj = 0, giroG = 0, giroScroll = 0, yAnt = scrollY;
  const puntero = new Vector2(9, 9), punteroS = new Vector2(9, 9), parallax = new Vector2(), parallaxS = new Vector2();
  let hayPuntero = false, impulso = null, quieto = 0;
  const ray = new Raycaster(), O = new Vector3(), D = new Vector3(), M = new Matrix4(), inv = new Matrix4(), q = new Quaternion(), eu = new Euler(), pos = new Vector3(), sv = new Vector3();
  const tA = [0, 0, 0], tB = [0, 0, 0];
  const objetivo = (e, i, o) => { if (e.viva) e.viva(i, reloj, o); else { o[0] = e.p[i * 3]; o[1] = e.p[i * 3 + 1]; o[2] = e.p[i * 3 + 2]; } };

  function paso(dt) {
    reloj += dt; cambio = Math.min(1, cambio + dt / 1.6);
    grupoX += (objX - grupoX) * (1 - Math.exp(-dt * 2.2)); grupoY += (objY - grupoY) * (1 - Math.exp(-dt * 2.2)); grupoZ += (objZ - grupoZ) * (1 - Math.exp(-dt * 2.2)); escala += (objEscala - escala) * (1 - Math.exp(-dt * 2.2));
    // el grupo gira despacio (formas que se ven mejor girando) y un poco con el scroll
    giroG += dt * mezcla(previa.giroGrupo, actual.giroGrupo, cambio); giroScroll *= Math.exp(-dt * 1.5);
    grupo.position.set(grupoX + parallaxS.x * 0.12, grupoY - parallaxS.y * 0.08, grupoZ); grupo.scale.setScalar(escala);
    grupo.rotation.set(0.12 + parallaxS.y * 0.05, giroG + giroScroll + parallaxS.x * 0.12, 0);
    grupo.updateMatrixWorld();
    let conRayo = false;
    if (hayPuntero && punteroS.x < 2) { ray.setFromCamera(punteroS, cam); inv.copy(grupo.matrixWorld).invert(); O.copy(ray.ray.origin).applyMatrix4(inv); D.copy(ray.ray.direction).transformDirection(inv); conRayo = true; }
    const suelto = mezcla(previa.giro, actual.giro, cambio), K = 22, am = 2 * Math.sqrt(K) * 0.7, radio = 0.38 / escala;
    let colorSucio = false;
    for (let i = 0; i < N; i++) {
      const k = suave(cambio * 1.5 - ret[i] * 0.5); const j = i * 3;
      objetivo(previa, i, tA); objetivo(actual, i, tB);
      const der = 0.04 * mezcla(previa.giro, actual.giro, k), ph = fase[j];
      const tx = mezcla(tA[0], tB[0], k) + Math.sin(reloj * 0.5 + ph) * der, ty = mezcla(tA[1], tB[1], k) + Math.sin(reloj * 0.43 + fase[j + 1]) * der, tz = mezcla(tA[2], tB[2], k) + Math.cos(reloj * 0.37 + fase[j + 2]) * der;
      let fx = (tx - P[j]) * K * rig[i] - V[j] * am, fy = (ty - P[j + 1]) * K * rig[i] - V[j + 1] * am, fz = (tz - P[j + 2]) * K * rig[i] - V[j + 2] * am;
      if (conRayo) {
        const px = P[j] - O.x, py = P[j + 1] - O.y, pz = P[j + 2] - O.z, d = px * D.x + py * D.y + pz * D.z, rx = px - D.x * d, ry = py - D.y * d, rz = pz - D.z * d, dist = Math.hypot(rx, ry, rz);
        if (dist < radio && dist > 1e-4) { const f = (1 - dist / radio) ** 2 * (40 + 60 * suelto) / dist; fx += rx * f; fy += ry * f; fz += rz * f; }
      }
      if (impulso) { // clic en un hueco: las piezas cercanas salen despedidas
        const px = P[j] - impulso.O.x, py = P[j + 1] - impulso.O.y, pz = P[j + 2] - impulso.O.z, d = px * impulso.D.x + py * impulso.D.y + pz * impulso.D.z, rx = px - impulso.D.x * d, ry = py - impulso.D.y * d, rz = pz - impulso.D.z * d, dist = Math.hypot(rx, ry, rz) + 0.05;
        if (dist < 1.4) { const f = (1 - dist / 1.4) * 9 / dist; V[j] += rx * f + (r() - 0.5) * 0.6; V[j + 1] += ry * f + (r() - 0.5) * 0.6; V[j + 2] += rz * f + 1.2 * (1 - dist / 1.4); }
      }
      V[j] += fx * dt; V[j + 1] += fy * dt; V[j + 2] += fz * dt; P[j] += V[j] * dt; P[j + 1] += V[j + 1] * dt; P[j + 2] += V[j + 2] * dt;
      esc[i] = mezcla(previa.t[i], actual.t[i], k);
      const bl = mezcla(previa.c[i], actual.c[i], k); if (Math.abs(bl - blanco[i]) > 0.02) { blanco[i] = bl; colorSucio = true; }
      const g = suelto + Math.min(0.8, Math.hypot(V[j], V[j + 1], V[j + 2]) * 0.35);
      eu.set(Math.sin(reloj * 0.31 + ph) * 2.2 * g, Math.sin(reloj * 0.27 + fase[j + 1]) * 2.6 * g, Math.cos(reloj * 0.23 + fase[j + 2]) * 1.8 * g);
      q.setFromEuler(eu); pos.set(P[j], P[j + 1], P[j + 2]); sv.setScalar(esc[i]); M.compose(pos, q, sv); piezas.setMatrixAt(i, M);
    }
    impulso = null;
    piezas.instanceMatrix.needsUpdate = true;
    if (colorSucio) { for (let i = 0; i < N; i++) piezas.setColorAt(i, col.copy(NEGRO).lerp(BLANCO, blanco[i])); piezas.instanceColor.needsUpdate = true; }
    // núcleo de vidrio (órbitas) y píxel azul (logotipo y órbitas)
    const vN = mezcla(previa.nucleo ? 1 : 0, actual.nucleo ? 1 : 0, suave(cambio * 1.3));
    vidrio.visible = vN > 0.01; vidrio.scale.setScalar(Math.max(0.001, vN));
    const enLogoA = previa === cache.logo ? 1 : 0, enLogoB = actual === cache.logo ? 1 : 0, vL = mezcla(enLogoA, enLogoB, suave(cambio * 1.2 - 0.2));
    const vP = Math.max(vN, vL);
    pixel.visible = vP > 0.01; pixel.scale.setScalar(Math.max(0.001, vP) * mezcla(0.55, 1, vL));
    pixel.position.lerpVectors(pos.set(0, 0, 0), IA_LOGO.p, vL);
    eu.set((1 - vL) * (0.5 + reloj * 0.4), (1 - vL) * reloj * 0.6, (1 - vL) * 0.6); pixel.quaternion.setFromEuler(eu);
    azul.emissiveIntensity = mezcla(1.1 + Math.sin(reloj * 2) * 0.15, 0.35, vL);
    escena.environmentRotation.y = -0.4 + parallaxS.x * 0.3 + giroScroll * 0.3;
  }

  let medias = [], tiempoReciente = 0;
  const bucle = (t) => {
    raf = 0; if (!visible) return;
    const dt = Math.min(0.04, (t - ultimo) / 1000); ultimo = t;
    // en reposo (sin puntero ni scroll ni cambio de forma) basta con 30 fotogramas por segundo
    quieto += dt; tiempoReciente += dt;
    if (quieto > 3 && cambio >= 1 && tiempoReciente < 1 / 31) { pedir(); return; }
    const d = tiempoReciente; tiempoReciente = 0;
    punteroS.lerp(puntero, 1 - Math.exp(-d * 9)); parallaxS.lerp(parallax, 1 - Math.exp(-d * 2.5));
    paso(Math.min(0.04, d)); renderer.render(escena, cam);
    medias.push(d); if (medias.length === 60) { const m = medias.reduce((a, b) => a + b) / 60; medias = []; if (m > 0.022 && quieto < 3 && dpr > 0.85) { dpr = Math.max(0.85, dpr - 0.2); medir(); } }
    pedir();
  };
  function pedir() { if (!raf && visible) raf = requestAnimationFrame(bucle); }
  document.addEventListener("visibilitychange", () => { visible = !document.hidden; if (visible) { ultimo = performance.now(); pedir(); } });
  addEventListener("resize", medir, { passive: true });
  const fino = matchMedia("(pointer: fine)").matches;
  if (fino) addEventListener("pointermove", (e) => { puntero.set((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1)); parallax.set(puntero.x, -puntero.y); hayPuntero = true; quieto = 0; }, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => { hayPuntero = false; puntero.set(9, 9); });
  addEventListener("scroll", () => { const y = scrollY; giroScroll += (y - yAnt) * 0.0006; yAnt = y; quieto = 0; }, { passive: true });
  medir();

  return {
    /** forma: nube · polvo · logo · helice · ola · columnas · anillo · cubo; lado: der · izq · centro · abajo · fondo */
    ir(nombre, ladoNuevo = "der") {
      const f = FORMAS[nombre] ? forma(nombre) : forma("polvo");
      if (ladoNuevo !== lado) { lado = ladoNuevo; colocar(); }
      if (f === actual) return;
      previa = actual; actual = f; cambio = 0; quieto = 0; pedir();
    },
    /** un clic en un hueco: las piezas cercanas al punto salen despedidas y se vuelven a montar */
    dispersar(clientX, clientY) {
      const v = new Vector2((clientX / innerWidth) * 2 - 1, -((clientY / innerHeight) * 2 - 1)); grupo.updateMatrixWorld(); ray.setFromCamera(v, cam);
      inv.copy(grupo.matrixWorld).invert(); impulso = { O: ray.ray.origin.clone().applyMatrix4(inv), D: ray.ray.direction.clone().transformDirection(inv) }; quieto = 0; pedir();
    },
    tema(claro) { escena.fog.color.set(claro ? 0xffffff : 0x000000); ceramica.envMapIntensity = claro ? 1.1 : 1.45; renderer.toneMappingExposure = claro ? 1 : 1.12; pedir(); },
    get calidad() { return { dpr, piezas: N }; },
    forzar(n = 60) { for (let i = 0; i < n; i++) { punteroS.copy(puntero); parallaxS.copy(parallax); paso(1 / 60); } renderer.render(escena, cam); },
  };
}
