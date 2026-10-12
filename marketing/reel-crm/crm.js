// Reel «¿Quieres un CRM de este nivel?» · D-Code Partners
// Un CRM inventado (no copia ningún producto) animado de forma determinista: pintaFrame(n) dibuja el fotograma n.
// Cinco paneles de vidrio en un espacio 3D (CSS 3D) + tres escenas WebGL (barras, anillo de salud, icono D-Code).
import * as THREE from './lib/three.module.min.js';
import { RoomEnvironment } from './lib/RoomEnvironment.js';
import { RoundedBoxGeometry } from './lib/RoundedBoxGeometry.js';

const Q = new URLSearchParams(location.search);
const CAPTURA = Q.has('captura'), LIMPIO = Q.has('limpio'), PORTADA = Q.has('portada');
const T = await (await fetch('tiempos.json')).json();
const FPS = T.fps, H = innerHeight, ALTO = H > 1600;
const S = ALTO ? 0.92 : 0.84, CY = ALTO ? 1030 : 742, PILL_Y = ALTO ? 205 : 46;
const DUR = LIMPIO ? T.cta : T.fin;
window.META = { fps: FPS, duracion: DUR, alto: H };

// ── utilidades ──
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const r = (t, a, b) => clamp((t - a) / (b - a));
const eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const eout = (x) => 1 - Math.pow(1 - x, 3);
const eout5 = (x) => 1 - Math.pow(1 - x, 5);
const eback = (x) => { const c1 = 1.9, c3 = c1 + 1; return x <= 0 ? 0 : 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const pulso = (t, t0, d = 0.18) => { const x = (t - t0) / d; return x < 0 || x > 2 ? 0 : x < 1 ? eout(x) : 1 - eio(x - 1); };
const fmt = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const $ = (s) => document.querySelector(s);
const css = (el, o) => { for (const k in o) el.style[k] = o[k]; };
let sem = 7; const azar = () => ((sem = (sem * 16807) % 2147483647) / 2147483647);
function posEn(el, raiz) { let x = 0, y = 0; while (el && el !== raiz) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; } return [x, y]; }

// ── maquetación según formato ──
css($('#escala'), { transformOrigin: `540px ${CY}px`, transform: PORTADA ? `translateY(${ALTO ? 260 : 120}px) scale(${S * (ALTO ? 0.94 : 0.9)})` : `scale(${S})` });
css($('#vista'), { perspectiveOrigin: `540px ${CY}px` });
css($('#mundo'), { top: CY + 'px' });
const aPantalla = (x, y) => [540 + (x - 470) * S, CY + (y - 625) * S];

// fondo aurora
const manchas = [...document.querySelectorAll('#fondo i')];
const grano = $('#grano'); grano.setAttribute('height', H);

// ── P0 · panel principal ──
const p0 = $('#p0'), bloques = [...p0.querySelectorAll('.bloque')];
const explosion = bloques.map((b, i) => ({ x: (azar() - 0.5) * 1300, y: (azar() - 0.5) * 1500, z: -1600 - azar() * 2200, rx: (azar() - 0.5) * 90, ry: (azar() - 0.5) * 110, rz: (azar() - 0.5) * 40, d: i * 0.07 }));
const VENTAS = [62, 71, 68, 84, 79, 93, 88, 104, 121, 128];
const pts = VENTAS.map((v, i) => [i * 784 / 9, 236 - (v - 50) * 2.55]);
function curva(p) { let d = `M${p[0][0]} ${p[0][1]}`; for (let i = 0; i < p.length - 1; i++) { const a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c;
  d += ` C${b[0] + (c[0] - a[0]) / 6} ${b[1] + (c[1] - a[1]) / 6} ${c[0] - (e[0] - b[0]) / 6} ${c[1] - (e[1] - b[1]) / 6} ${c[0]} ${c[1]}`; } return d; }
const dCurva = curva(pts);
$('#trazo').setAttribute('d', dCurva); $('#area').setAttribute('d', dCurva + ` L784 250 L0 250 Z`);
const tip = $('#tip'), b3d = $('#b3d');

// ── P1 · barras 3D ──
const MESES = 8, LINEAS = 4, COLORES = [0x2A6BFF, 0x9D8CFF, 0x7CC4FF, 0xB7E04A], CUOTA = [0.42, 0.27, 0.19, 0.12];
const R3 = new THREE.WebGLRenderer({ canvas: $('#lienzo3d'), antialias: true, alpha: true, preserveDrawingBuffer: true });
R3.setPixelRatio(1); R3.setSize(940, 760, false); R3.outputColorSpace = THREE.SRGBColorSpace;
R3.toneMapping = THREE.NeutralToneMapping; R3.toneMappingExposure = 1.0;
R3.shadowMap.enabled = true; R3.shadowMap.type = THREE.PCFSoftShadowMap; R3.localClippingEnabled = true;
const esc1 = new THREE.Scene();
esc1.environment = new THREE.PMREMGenerator(R3).fromScene(new RoomEnvironment(), 0.04).texture;
const cam1 = new THREE.PerspectiveCamera(30, 940 / 760, 0.1, 100);
const sol = new THREE.DirectionalLight(0xffffff, 1.4); sol.position.set(-6, 12, 7); sol.castShadow = true;
sol.shadow.mapSize.set(2048, 2048); Object.assign(sol.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 40 }); sol.shadow.radius = 6; sol.shadow.bias = -0.0005;
esc1.add(sol, new THREE.HemisphereLight(0xffffff, 0xdfe3f0, 0.6));
const suelo = new THREE.Mesh(new RoundedBoxGeometry(10.6, 0.36, 6.2, 6, 0.18), new THREE.MeshPhysicalMaterial({ color: 0xf7f8fc, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.2 }));
suelo.position.y = -0.18; suelo.receiveShadow = true; esc1.add(suelo);
const corte = [new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.0)];
const VAL_MES = [68, 84, 79, 93, 88, 104, 121, 128];
const barras = [];
for (let m = 0; m < MESES; m++) for (let l = 0; l < LINEAS; l++) {
  const v = VAL_MES[m] * CUOTA[l] * (1 + 0.16 * Math.sin(m * 1.9 + l * 2.3)), h = Math.max(0.25, v * 0.081);
  const mat = new THREE.MeshPhysicalMaterial({ color: COLORES[l], roughness: 0.26, clearcoat: 1, clearcoatRoughness: 0.1, clippingPlanes: corte, envMapIntensity: 0.9 });
  const b = new THREE.Mesh(new RoundedBoxGeometry(0.82, h, 0.82, 4, 0.16), mat);
  b.castShadow = true; b.receiveShadow = true;
  b.userData = { h, m, l, x: (m - (MESES - 1) / 2) * 1.16, z: (l - (LINEAS - 1) / 2) * 1.22 };
  b.position.set(b.userData.x, -h / 2, b.userData.z); esc1.add(b); barras.push(b);
}
const tag = $('#tag'), p1 = $('#p1');

// ── P2 · oportunidades ──
const cols = $('#cols');
const COLS = [['Contacto', 26300], ['Propuesta', 73700], ['Ganado', 86500]];
const OPS = [
  [0, 'Taller Ribera', 'Automoción', 8400, 'TR', 'g2', 0.3], [0, 'Estudio Velasco', 'Arquitectura', 12000, 'EV', 'g5', 0.25], [0, 'Ópticas Lumbre', 'Retail', 5900, 'OL', 'g3', 0.2],
  [1, 'Clínica Arce', 'Salud', 24000, 'CA', 'g1', 0.7], [1, 'Grupo Nácar', 'Hostelería', 31500, 'GN', 'g3', 0.55], [1, 'Hotel Cierzo', 'Turismo', 18200, 'HC', 'g2', 0.5],
  [2, 'Viveros Almenara', 'Paisajismo', 42000, 'VA', 'g4', 1], [2, 'Bodegas Rumor', 'Vinos', 27300, 'BR', 'g5', 1], [2, 'Academia Faro', 'Formación', 17200, 'AF', 'g6', 1]];
const CX = (c) => c * 290, SLOT = (i) => 104 + i * 184;
const cabs = COLS.map(([n, v], c) => { const d = document.createElement('div'); d.className = 'colcab'; d.style.left = CX(c) + 'px';
  d.innerHTML = `<b>${n} <i>3</i></b><span>${fmt(v)} €</span>`; cols.appendChild(d);
  const f = document.createElement('div'); f.className = 'colfondo'; f.style.left = CX(c) + 'px'; cols.appendChild(f); return d; });
const ops = OPS.map(([c, n, s, v, ini, g, p]) => { const d = document.createElement('div'); d.className = 'op' + (c === 2 ? ' gan' : '');
  d.innerHTML = `<b>${n}</b><small>${s}</small><div class="av ${g}">${ini}</div><div class="val">${fmt(v)} €</div><div class="prob"><i style="width:${p * 100}%"></i></div>
  <svg class="ok" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#C9F25B"/><path d="M12 20.5l5.5 5.5L28.5 15" fill="none" stroke="#1d2a00" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  cols.appendChild(d); return { el: d, c, prob: d.querySelector('.prob i'), ok: d.querySelector('.ok') }; });
const arce = ops[3];
const chispas = Array.from({ length: 18 }, (_, i) => { const d = document.createElement('div'); d.className = 'chispa';
  d.style.background = ['#C9F25B', '#2A6BFF', '#9D8CFF', '#7CC4FF'][i % 4]; cols.appendChild(d);
  const a = (i / 18) * Math.PI * 2 + azar() * 0.3; return { el: d, a, v: 260 + azar() * 260, rot: azar() * 360 }; });

// ── P3 · cliente: anillo 3D de salud ──
const R4 = new THREE.WebGLRenderer({ canvas: $('#lienzoDona'), antialias: true, alpha: true, preserveDrawingBuffer: true });
R4.setPixelRatio(1); R4.setSize(440, 440, false); R4.outputColorSpace = THREE.SRGBColorSpace; R4.toneMapping = THREE.NeutralToneMapping;
const esc2 = new THREE.Scene(); esc2.environment = new THREE.PMREMGenerator(R4).fromScene(new RoomEnvironment(), 0.04).texture;
const cam2 = new THREE.PerspectiveCamera(30, 1, 0.1, 50); cam2.position.set(0, 0, 9.2); cam2.lookAt(0, 0, 0);
esc2.add(new THREE.DirectionalLight(0xffffff, 1.2).translateX(-3).translateY(5).translateZ(6));
const grupoDona = new THREE.Group(); esc2.add(grupoDona);
const pista = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.2, 32, 160), new THREE.MeshPhysicalMaterial({ color: 0xe6e8f0, roughness: 0.5, clearcoat: 0.6 }));
grupoDona.add(pista);
const matDona = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08 });
const tapaA = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 16), new THREE.MeshPhysicalMaterial({ color: 0x7CC4FF, roughness: 0.22, clearcoat: 1 }));
const tapaB = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 16), new THREE.MeshPhysicalMaterial({ color: 0x9D8CFF, roughness: 0.22, clearcoat: 1 }));
grupoDona.add(tapaA, tapaB);
let dona = null, arcoPrevio = -1;
const cA = new THREE.Color(0x2A6BFF), cB = new THREE.Color(0x9D8CFF), cC = new THREE.Color(0x7CC4FF);
function hazDona(frac) {
  const arco = Math.max(0.02, frac * Math.PI * 2);
  if (Math.abs(arco - arcoPrevio) < 1e-4) return; arcoPrevio = arco;
  if (dona) { grupoDona.remove(dona); dona.geometry.dispose(); }
  const g = new THREE.TorusGeometry(1.55, 0.3, 32, 220, arco), p = g.attributes.position, col = new Float32Array(p.count * 3), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) { let a = Math.atan2(p.getY(i), p.getX(i)); if (a < -1e-3) a += Math.PI * 2; const k = a / (Math.PI * 2);
    c.copy(cC).lerp(cA, clamp(k * 2.2)).lerp(cB, clamp((k - 0.45) * 1.9)); col.set([c.r, c.g, c.b], i * 3); }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  dona = new THREE.Mesh(g, matDona); grupoDona.add(dona);
  tapaA.position.set(1.55, 0, 0); tapaB.position.set(Math.cos(arco) * 1.55, Math.sin(arco) * 1.55, 0);
  const kk = arco / (Math.PI * 2); tapaB.material.color.copy(cC).lerp(cA, clamp(kk * 2.2)).lerp(cB, clamp((kk - 0.45) * 1.9));
}
const acts = [...document.querySelectorAll('#p3 .act')], bArr = $('#bArranque');

// ── P4 · agenda ──
const sem4 = $('#semana'), X0 = 80, CW = (844 - 80) / 5, Y0 = 96, HH = 176;
['L', 'M', 'X', 'J', 'V'].forEach((d, i) => { const e = document.createElement('div'); e.className = 'dia' + (i === 0 ? ' hoyd' : ''); css(e, { left: X0 + i * CW + 'px', width: CW + 'px' });
  e.innerHTML = `<span>${d}</span><b>${12 + i}</b>`; sem4.appendChild(e); });
const horas = document.createElement('div'); horas.className = 'horas'; sem4.appendChild(horas);
for (let h = 0; h <= 5; h++) { const e = document.createElement('div'); e.textContent = `${9 + h}:00`; e.style.top = h * HH - 12 + 'px'; horas.appendChild(e);
  const l = document.createElement('div'); l.className = 'rej'; l.style.top = Y0 + h * HH + 'px'; sem4.appendChild(l); }
const ahora = document.createElement('div'); ahora.id = 'ahora'; css(ahora, { left: X0 + 4 + 'px', width: CW - 8 + 'px', top: Y0 + 2.33 * HH + 'px' }); sem4.appendChild(ahora);
const EVS = [[0, 9.5, 1, 'Llamada', 'Taller Ribera', 'cielo'], [2, 9, 1, 'Equipo comercial', 'Sala 2', 'melo'], [1, 12, 1, 'Demo', 'Grupo Nácar', 'lila'],
  [4, 11, 1.5, 'Visita', 'Hotel Cierzo', 'cielo'], [0, 12.5, 1, 'Propuesta', 'Ópticas Lumbre', 'melo'], [3, 10, 1.5, 'Arranque', 'Clínica Arce', 'azul']];
const evs = EVS.map(([d, h, dur, a, b, c]) => { const e = document.createElement('div'); e.className = 'ev ' + c;
  css(e, { left: X0 + d * CW + 5 + 'px', top: Y0 + (h - 9) * HH + 4 + 'px', width: CW - 10 + 'px', height: dur * HH - 8 + 'px' });
  e.innerHTML = `${a}<small>${b}</small>`; sem4.appendChild(e); return e; });
const demo = evs[2], nuevo = evs[5];

// ── capas de pantalla ──
const pill = $('#pill'), pillTxt = $('#pilltxt'), punto = pill.querySelector('.punto'), caret = pill.querySelector('.caret');
const FRASE = '¿Quieres un CRM de este nivel?';
const cursor = $('#cursor'), onda = $('#onda'), toast = $('#toast'), todo = $('#todo');
const icono = $('#icono'), sombraI = $('#sombraIcono'), marcaD = $('#marcaD'), lema = $('#lema');
const cta = ['#c1', '#c2', '#c3', '#c4'].map($);
if (LIMPIO) { pill.style.display = 'none'; todo.style.display = 'none'; $('#cta').style.display = 'none'; }

// icono D-Code 3D
const R5 = new THREE.WebGLRenderer({ canvas: icono, antialias: true, alpha: true, preserveDrawingBuffer: true });
R5.setPixelRatio(1); R5.setSize(640, 640, false); R5.outputColorSpace = THREE.SRGBColorSpace; R5.toneMapping = THREE.NeutralToneMapping;
const esc3 = new THREE.Scene(); esc3.environment = new THREE.PMREMGenerator(R5).fromScene(new RoomEnvironment(), 0.04).texture;
const cam3 = new THREE.PerspectiveCamera(26, 1, 0.1, 50); cam3.position.set(0, 0, 10); cam3.lookAt(0, 0, 0);
const tile = new THREE.Group(); esc3.add(tile);
tile.add(new THREE.Mesh(new RoundedBoxGeometry(2.6, 2.6, 0.5, 8, 0.5), new THREE.MeshPhysicalMaterial({ color: 0x0b0e16, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.3 })));
const texM = await new THREE.TextureLoader().loadAsync('assets/marca.png'); texM.colorSpace = THREE.SRGBColorSpace; texM.anisotropy = 8;
const cara = new THREE.Mesh(new THREE.PlaneGeometry(2.05, 2.05), new THREE.MeshBasicMaterial({ map: texM, transparent: true, toneMapped: false })); cara.position.z = 0.252; tile.add(cara);

// ── cámara: arco de paneles alrededor del espectador y vista de conjunto ──
const paneles = [0, 1, 2, 3, 4].map((i) => $('#p' + i));
const ANG = [50, 25, 0, -25, -50], RAD = 2600, RX = Math.PI / 180;
// pose de conjunto: mesa inclinada con dos columnas escalonadas
const GAL = [[-515, -1240], [515, -620], [-515, 0], [515, 620], [-515, 1240]];
function poseArco(a, yaw, back) { const d = (a - yaw) * RX; return { x: -RAD * Math.sin(d), y: 0, z: RAD * (1 - Math.cos(d)) - back, rx: 0, ry: (a - yaw), rz: 0 }; }
function poseGal(i, k2) { const th = 40 * RX, [u, v] = GAL[i]; const y0 = ALTO ? -400 : -140, z0 = ALTO ? -2750 : -3500;
  return { x: u, y: y0 + v * Math.cos(th), z: z0 + v * Math.sin(th) - k2, rx: 40, ry: 0, rz: 0 }; }
const yawEn = (t) => { const pans = [[T.pan1, 50, 25], [T.pan2, 25, 0], [T.pan3, 0, -25], [T.pan4, -25, -50]]; let y = 50;
  for (const [[a, b], y0, y1] of pans) if (t >= a) y = lerp(y0, y1, eio(r(t, a, b))); return y; };

// ── cursor ──
const RUTAS = [ // [t, x, y] en coordenadas del panel enfocado
  [[2.85, 1000, 1180], [3.7, 0, 0, 'sep'], [4.25, 0, 0, 'sep2'], [4.9, 0, 0, 'b3d'], [5.4, 0, 0, 'b3d']],
  [[7.55, 980, 980], [7.95, 260, 640], [8.85, 700, 600], [9.15, 760, 640]],
  [[9.85, 900, 1180], [10.42, 476, 414], [10.6, 476, 414], [11.5, 766, 414], [12.2, 766, 420], [12.45, 760, 438], [12.85, 760, 438]],
  [[14.35, 940, 1000], [15.0, 560, 1142], [15.5, 560, 1142]],
  [[17.1, 960, 1100], [17.62, 356, 864], [17.78, 356, 864], [18.3, 509, 862], [19.0, 560, 930], [19.35, 600, 980]]];
const PULSA = [[T.clic3d, 0.12], [7.95, 0.9], [T.coge, 1.05], [T.abre, 0.12], [T.clicArranque, 0.12], [T.coge2, 0.65]];
function puntoRuta(t) {
  for (const ruta of RUTAS) { if (t < ruta[0][0] - 0.01 || t > ruta[ruta.length - 1][0]) continue;
    for (let i = 0; i < ruta.length - 1; i++) { const [ta, ...a] = ruta[i], [tb, ...b] = ruta[i + 1]; if (t > tb) continue;
      const pa = resuelve(a), pb = resuelve(b), k = eio(r(t, ta, tb)), dx = pb[0] - pa[0], dy = pb[1] - pa[1], arco = Math.sin(Math.PI * k) * 0.12;
      const vis = Math.min(r(t, ruta[0][0], ruta[0][0] + 0.25), 1 - r(t, ruta[ruta.length - 1][0] - 0.25, ruta[ruta.length - 1][0]));
      return { x: pa[0] + dx * k - dy * arco, y: pa[1] + dy * k + dx * arco, vis }; } }
  return null;
}
let refs = {};
function resuelve([x, y, n]) { return n ? refs[n] : [x, y]; }

// ── pinta un instante ──
function pinta(t) {
  // fondo aurora
  const ph = t * 0.35;
  [[200, 300, 1.0], [880, 700, 1.3], [300, 1400, 0.8], [900, 1650, 1.1]].forEach(([x, y, f], i) => {
    const mx = x + Math.sin(ph * f + i * 1.7) * 160 - 750, my = y * H / 1920 + Math.cos(ph * f * 0.8 + i) * 140 - 750;
    manchas[i].style.transform = `translate(${mx}px,${my}px)`; });

  // cámara y paneles
  const yaw = yawEn(t);
  let back = 0;
  for (const [a, b] of [T.pan1, T.pan2, T.pan3, T.pan4]) back += Math.sin(Math.PI * r(t, a, b)) * 420;
  back += lerp(900, 0, eio(r(t, 0, 2.2)));               // gancho: llegamos desde atrás
  const [ta, tb] = T.todo;
  const kBack = eio(r(t, ta, ta + 1.2)), kGal = eio(r(t, ta + 0.7, tb)), kFuera = eio(r(t, T.logo - 0.3, T.logo + 0.6));
  const yawF = lerp(yaw, 0, kBack); back += kBack * 3200;
  paneles.forEach((p, i) => {
    const A = poseArco(ANG[i], yawF, back), G = poseGal(i, kFuera * 1800), P = {};
    for (const k in A) P[k] = lerp(A[k], G[k], kGal);
    P.y += Math.sin(t * 1.1 + i) * 6; // flota
    const oculto = P.z > 1200;
    let op = 1;
    if (i > 0 && t < T.pan1[0]) op = r(t, T.pan1[0] - 0.3, T.pan1[0]);
    op *= 1 - kFuera;
    css(p, { transform: `translate3d(${P.x}px,${P.y}px,${P.z}px) rotateX(${P.rx}deg) rotateY(${P.ry}deg) rotateZ(${P.rz}deg)`, opacity: op, visibility: oculto || op < 0.01 ? 'hidden' : 'visible' });
  });

  // P0 · ensamblaje del gancho
  bloques.forEach((b, i) => { const e = explosion[i], k = 1 - eout5(r(t, 0.05 + e.d, 1.6 + e.d * 0.6));
    css(b, { transform: k < 1e-4 ? 'none' : `translate3d(${e.x * k}px,${e.y * k}px,${e.z * k}px) rotateX(${e.rx * k}deg) rotateY(${e.ry * k}deg) rotateZ(${e.rz * k}deg)`, opacity: r(t, 0.05 + e.d, 0.45 + e.d) }); });
  css(p0.querySelector('.vidrio'), { opacity: r(t, 1.0, 1.7), transform: `scale(${lerp(1.08, 1, eout(r(t, 1.0, 1.9)))})` });
  const kc = eout(r(t, T.cuenta[0], T.cuenta[1]));
  $('#k1').textContent = fmt(128400 * kc) + ' €'; $('#k2').textContent = fmt(342 * kc); $('#k3').textContent = Math.round(38 * kc) + '%';
  $('#anillo').setAttribute('stroke-dashoffset', 188.5 * (1 - 0.38 * kc));
  $('#clipR').setAttribute('width', 800 * eio(r(t, T.linea[0], T.linea[1])));
  const kt = r(t, T.tip - 0.05, T.tip + 0.3), sep = pts[8];
  for (const id of ['#punto', '#halo']) { $(id).setAttribute('cx', sep[0]); $(id).setAttribute('cy', sep[1]); }
  $('#punto').setAttribute('opacity', kt > 0 ? 1 : 0); $('#punto').setAttribute('r', 11 * eback(kt));
  const hk = t > T.tip ? ((t - T.tip) % 1.1) / 1.1 : 0; $('#halo').setAttribute('r', 11 + 26 * eout(hk)); $('#halo').setAttribute('opacity', t > T.tip ? 0.3 * (1 - hk) : 0);
  const guia = $('#guia'); guia.setAttribute('x1', sep[0]); guia.setAttribute('x2', sep[0]); guia.setAttribute('opacity', kt);
  css(tip, { opacity: kt, transform: `translate(${refs.tipX}px,${refs.tipY}px) scale(${0.6 + 0.4 * eback(kt)})`, transformOrigin: '100% 50%' });
  css(b3d, { transform: `scale(${1 - 0.08 * pulso(t, T.clic3d, 0.1) + 0.04 * pulso(t, T.clic3d + 0.2, 0.2)})`, background: t > T.clic3d ? '#2A6BFF' : '#101218' });

  // P1 · barras 3D
  if (t > T.pan1[0] - 0.4 && t < T.logo + 0.7) {
    barras.forEach((b) => { const { h, m, l, x, z } = b.userData, k = eout(r(t, T.barras[0] + m * 0.13 + l * 0.05, T.barras[0] + 0.75 + m * 0.13 + l * 0.05));
      const rebote = k > 0 && k < 1 ? 0 : 0; b.position.y = -h / 2 + h * k + rebote; b.visible = k > 0.001; });
    const arr = eio(r(t, 7.95, 8.85)) * 0.95, inercia = eout(r(t, 8.85, 9.6)) * 0.12;
    const ang = -1.05 + r(t, 5.6, 9.6) * 0.38 + arr + inercia, elev = lerp(0.42, 0.62, eio(r(t, 5.6, 9.4)));
    const dist = lerp(19.5, 17.2, eout(r(t, 5.6, 8)));
    cam1.position.set(Math.sin(ang) * Math.cos(elev) * dist, Math.sin(elev) * dist + 0.4, Math.cos(ang) * Math.cos(elev) * dist); cam1.lookAt(0, 1.2, 0);
    R3.render(esc1, cam1);
    const top = barras[7 * LINEAS], v = new THREE.Vector3(top.userData.x, top.position.y + top.userData.h / 2 + 0.2, top.userData.z).project(cam1);
    const kg = eback(r(t, T.etiqueta, T.etiqueta + 0.4));
    css(tag, { left: (v.x * 0.5 + 0.5) * 940 + 'px', top: 220 + (-v.y * 0.5 + 0.5) * 760 + 'px', opacity: r(t, T.etiqueta, T.etiqueta + 0.2), transform: `translate(-50%,calc(-100% - 18px)) scale(${0.5 + 0.5 * kg})`, transformOrigin: '50% 100%' });
    const ks = eout(r(t, 6.4, 7.6)); $('#s1').textContent = fmt(898000 * ks) + ' €'; $('#s3').textContent = fmt(1120000 * ks) + ' €';
  }

  // P2 · oportunidades
  const kSube = eio(r(t, 10.7, 11.1)), kBaja = eio(r(t, 11.0, 11.45)), kSuelta = r(t, T.suelta - 0.05, T.suelta + 0.25);
  ops.forEach((o, i) => { let x = CX(o.c) + 8, y = SLOT(i % 3), esc = 1, rot = 0, z = 1, sombra = '';
    if (o.c === 1 && i > 3) y -= 184 * kSube;
    if (o.c === 2) y += 184 * kBaja;
    if (o === arce) {
      const pr = puntoRuta(t), cogido = t > T.coge && t < T.suelta;
      if (t >= T.coge) { const tx = pr && t < T.suelta ? pr.x - 130 - 48 : CX(2) + 8, ty = pr && t < T.suelta ? pr.y - 60 - 250 : SLOT(0); x = tx; y = ty; }
      const lev = eout(r(t, T.coge, T.coge + 0.15)) * (1 - eout(r(t, T.suelta, T.suelta + 0.2)));
      const vx = t > T.arrastra[0] && t < T.arrastra[1] ? Math.sin(Math.PI * r(t, T.arrastra[0], T.arrastra[1])) : 0;
      esc = 1 + 0.06 * lev + 0.05 * pulso(t, T.suelta + 0.05, 0.12) - 0.04 * pulso(t, T.abre, 0.1); rot = -5 * lev * (0.4 + vx); z = cogido ? 5 : 1;
      sombra = `0 ${12 + 40 * lev}px ${30 + 50 * lev}px -16px rgba(30,34,70,${0.3 + 0.2 * lev}),0 0 0 ${1.5 + 3 * pulso(t, T.gana, 0.3)}px rgba(${t > T.gana ? '150,210,40' : '16,18,24'},${t > T.gana ? 0.9 * (1 - r(t, T.gana + 0.6, T.gana + 1.4)) + 0.04 : 0.04})`;
      o.prob.style.width = lerp(70, 100, eout(r(t, T.gana, T.gana + 0.5))) + '%';
      if (t > T.gana) o.el.classList.add('gan'); else o.el.classList.remove('gan');
      css(o.ok, { opacity: r(t, T.gana, T.gana + 0.1), transform: `scale(${eback(r(t, T.gana, T.gana + 0.35))})` });
    }
    css(o.el, { left: x + 'px', top: y + 'px', transform: `scale(${esc}) rotate(${rot}deg)`, zIndex: z, boxShadow: sombra }); });
  const kg2 = eout(r(t, T.gana, T.gana + 0.6));
  cabs[1].querySelector('i').textContent = t > T.suelta ? 2 : 3; cabs[2].querySelector('i').textContent = t > T.suelta ? 4 : 3;
  cabs[1].querySelector('span').textContent = fmt(73700 - 24000 * kg2) + ' €'; cabs[2].querySelector('span').textContent = fmt(86500 + 24000 * kg2) + ' €';
  cabs[2].querySelector('span').style.color = t > T.gana && t < T.gana + 1.4 ? '#4a7d00' : '';
  $('#prevBar').style.width = lerp(46, 59, kg2) + '%'; $('#prevPct').textContent = Math.round(lerp(46, 59, kg2)) + '%';
  chispas.forEach((c) => { const k = r(t, T.gana, T.gana + 0.75), d = c.v * eout(k);
    css(c.el, { left: CX(2) + 8 + 124 + Math.cos(c.a) * d * 0.9 + 'px', top: SLOT(0) + 85 + Math.sin(c.a) * d * 0.6 + 260 * k * k + 'px', opacity: k > 0 && k < 1 ? 1 - k * k : 0, transform: `rotate(${c.rot + k * 300}deg) scale(${1 - k * 0.5})` }); });

  // P3 · cliente
  if (t > T.pan3[0] - 0.4 && t < T.logo + 0.7) {
    const kd = eout(r(t, T.dona[0], T.dona[1]));
    hazDona(0.92 * kd); $('#dval').textContent = Math.round(92 * kd);
    grupoDona.rotation.set(-0.3 + Math.sin(t * 0.8) * 0.06, 0.22 + Math.sin(t * 0.6) * 0.08, Math.PI / 2 + 0.4 - kd * 0.4);
    R4.render(esc2, cam2);
  }
  acts.forEach((a, i) => { const k = eout(r(t, T.items[i], T.items[i] + 0.35)); css(a, { opacity: k, transform: `translateY(${(1 - k) * 26}px)` });
    if (i === 0) a.style.background = `rgba(201,242,91,${0.35 * (1 - r(t, T.items[0] + 0.8, T.items[0] + 2.2))})`, a.style.borderRadius = '20px', a.style.margin = '4px -12px 0', a.style.padding = '0 12px'; });
  css($('#tagGanado'), { transform: `scale(${eback(r(t, T.pan3[1] - 0.1, T.pan3[1] + 0.3))})` });
  css(bArr, { transform: `scale(${1 - 0.05 * pulso(t, T.clicArranque, 0.1)})`, background: t > T.clicArranque ? '#1E55D8' : '#2A6BFF' });

  // P4 · agenda
  evs.forEach((e, i) => { if (e === nuevo) return; const k = eback(r(t, T.eventos[Math.min(i, 4)], T.eventos[Math.min(i, 4)] + 0.35));
    if (e === demo) { const lev = eout(r(t, T.coge2, T.coge2 + 0.12)) * (1 - eout(r(t, T.suelta2, T.suelta2 + 0.18))), kx = eio(r(t, T.arrastra2[0], T.arrastra2[1]));
      css(e, { opacity: r(t, T.eventos[2], T.eventos[2] + 0.15), transform: `translate(${kx * CW}px,${-4 * lev}px) scale(${k * (1 + 0.06 * lev)}) rotate(${-3 * lev}deg)`, boxShadow: `0 ${20 * lev}px ${40 * lev}px -10px rgba(46,35,128,${0.35 * lev})`, zIndex: lev > 0 ? 5 : 1 });
    } else css(e, { opacity: r(t, T.eventos[Math.min(i, 4)], T.eventos[Math.min(i, 4)] + 0.15), transform: `scale(${k})` }); });
  { const k = eout(r(t, T.nuevo, T.nuevo + 0.3)), brillo = pulso(t, T.nuevo + 0.3, 0.25);
    css(nuevo, { opacity: r(t, T.nuevo, T.nuevo + 0.12), transform: `translateY(${(1 - k) * -90}px) scale(${lerp(1.25, 1, k) + 0.04 * brillo})`, boxShadow: `0 18px 36px -14px rgba(42,107,255,.7),0 0 0 ${10 * brillo}px rgba(42,107,255,${0.25 * brillo})` }); }

  // pill superior
  const kp = eback(r(t, T.pill, T.pill + 0.35)), fueraP = eio(r(t, T.logo - 0.2, T.logo + 0.25));
  const nLetras = Math.round(FRASE.length * r(t, T.tecleo[0], T.tecleo[1]));
  pillTxt.textContent = FRASE.slice(0, nLetras);
  caret.style.opacity = t < T.tecleo[1] + 0.3 || Math.floor(t * 2) % 2 === 0 ? (t < T.tecleo[1] + 1.2 ? 1 : 0) : 0;
  css(pill, { top: PILL_Y + 'px', opacity: r(t, T.pill, T.pill + 0.15) * (1 - fueraP), transform: `translateX(-50%) translateY(${-30 * fueraP}px) scale(${0.4 + 0.6 * kp})` });
  const pk = (t % 1.4) / 1.4; punto.style.setProperty('--s', 1 + pk * 0.9); punto.style.setProperty('--o', 0.6 * (1 - pk));

  // cursor
  const pr = puntoRuta(t);
  let prensa = 0; for (const [t0, d] of PULSA) if (t > t0 - 0.06 && t < t0 + d) prensa = Math.max(prensa, eout(r(t, t0 - 0.06, t0 + 0.02)) * (1 - eout(r(t, t0 + d - 0.05, t0 + d + 0.08))));
  if (pr && pr.vis > 0) { const [sx, sy] = aPantalla(pr.x, pr.y); css(cursor, { display: 'block', opacity: pr.vis, transform: `translate(${sx - 8}px,${sy - 6}px) scale(${(1 - 0.14 * prensa) * 1.05})` }); }
  else cursor.style.display = 'none';
  let ondaK = -1, ondaP = null; for (const [t0] of PULSA) { const k = r(t, t0, t0 + 0.45); if (k > 0 && k < 1) { ondaK = k; ondaP = pr; } }
  if (ondaK >= 0 && ondaP) { const [sx, sy] = aPantalla(ondaP.x, ondaP.y); css(onda, { left: sx + 'px', top: sy + 'px', opacity: 1 - ondaK, transform: `scale(${0.3 + eout(ondaK) * 0.9})` }); } else onda.style.opacity = 0;

  // aviso
  const kT = eout(r(t, T.aviso, T.aviso + 0.4)) * (1 - eio(r(t, 19.3, 19.65)));
  css(toast, { top: PILL_Y + (ALTO ? 128 : 112) + 'px', opacity: kT, transform: `translateX(-50%) translateY(${(1 - kT) * -40}px) scale(${0.9 + 0.1 * kT})` });

  // frase de conjunto
  const kF = eout(r(t, T.frase, T.frase + 0.5)) * (1 - eio(r(t, T.logo - 0.3, T.logo)));
  css(todo, { top: (ALTO ? 1610 : 1200) + 'px', opacity: kF, transform: `translateY(${(1 - kF) * 30}px)` });

  // final: icono D-Code 3D, nombre y CTA
  const kL = r(t, T.logo, T.logo + 1.0), kCta = eio(r(t, T.cta, T.cta + 0.6));
  const icY = lerp(H * (ALTO ? 0.40 : 0.36), H * (ALTO ? 0.79 : 0.83), kCta), icS = lerp(1, ALTO ? 0.42 : 0.34, kCta);
  if (t > T.logo - 0.1) {
    const e = eout5(kL);
    tile.rotation.set(-0.12 + Math.sin(t * 1.3) * 0.05 + (1 - e) * 0.5, (1 - e) * -Math.PI * 2.2 + Math.sin(t * 0.9) * 0.22, Math.sin(t * 0.7) * 0.03);
    tile.position.y = (1 - e) * -1.2 + Math.sin(t * 1.6) * 0.06; tile.scale.setScalar(lerp(0.4, 1, eback(clamp(kL * 1.4))));
    R5.render(esc3, cam3);
  }
  css(icono, { top: icY - 320 + 'px', opacity: r(t, T.logo, T.logo + 0.15), transform: `scale(${icS})` });
  css(sombraI, { top: icY + 230 * icS + 'px', opacity: r(t, T.logo + 0.2, T.logo + 0.8) * 0.9, transform: `scale(${icS * (1 - Math.sin(t * 1.6) * 0.05)})`, left: 290 + 'px' });
  const kN = eout(r(t, T.nombre, T.nombre + 0.5)) * (1 - kCta), kM = eout(r(t, T.lema, T.lema + 0.5)) * (1 - kCta);
  css(marcaD, { top: icY + (ALTO ? 300 : 260) + 'px', opacity: kN, transform: `translateY(${(1 - kN) * 30}px)` });
  css(lema, { top: icY + (ALTO ? 420 : 370) + 'px', opacity: kM, transform: `translateY(${(1 - kM) * 30}px)` });
  const posC = ALTO ? [430, 640, 700, 1040] : [150, 330, 380, 700];
  [[T.c1, 0], [T.c2, 1], [T.c3, 2], [T.c4, 3]].forEach(([t0, i]) => { const k = i === 2 ? eback(r(t, t0, t0 + 0.4)) : eout(r(t, t0, t0 + 0.45));
    css(cta[i], { top: posC[i] + 'px', opacity: r(t, t0, t0 + 0.15), transform: i === 2 ? `scale(${lerp(1.5, 1, k)})` : `translateY(${(1 - k) * 40}px)` }); });

  if (PORTADA) { const pt = $('#portadaTit'); css(pt, { display: 'block', top: (ALTO ? 250 : 60) + 'px' }); pill.style.display = 'none'; todo.style.display = 'none'; cursor.style.display = 'none'; toast.style.opacity = 0; }
}

// referencias de maquetación (no dependen de transformaciones)
function medirRefs() { const gr = p0.querySelector('.grafica'), [gx, gy] = posEn(gr, p0), sep = pts[8];
  refs.tipX = 30 + sep[0] - tip.offsetWidth - 34; refs.tipY = 96 + sep[1] - tip.offsetHeight / 2 + 4; css(tip, { left: '0px', top: '0px' });
  refs.sep = [gx + 30 + sep[0] + 4, gy + 96 + sep[1] + 6]; refs.sep2 = [refs.sep[0] - 14, refs.sep[1] + 10];
  const [bx, by] = posEn(b3d, p0); refs.b3d = [bx + b3d.offsetWidth * 0.55, by + b3d.offsetHeight * 0.6]; }

await Promise.all(['600 30px Geist', '500 20px GeistMono', '600 60px Bricolage', '800 300px Bricolage'].map((f) => document.fonts.load(f)));
await document.fonts.ready; medirRefs();
const T_PORTADA = Number(Q.get('t') || 21.6);
window.pintaFrame = (n) => pinta(PORTADA ? T_PORTADA : n / FPS);
if (PORTADA) pinta(T_PORTADA);
else if (!CAPTURA) { const t0 = performance.now() - Number(Q.get('t') || 0) * 1000; const bucle = () => { pinta(((performance.now() - t0) / 1000) % DUR); requestAnimationFrame(bucle); }; bucle(); }
else pinta(0);
window.LISTO = true;
