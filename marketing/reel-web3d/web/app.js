// ÓRBITA UNO — web 3D de demostración (marca y coche ficticios). Three.js + glTF PBR + entornos HDR.
// En vivo: el scroll recorre la línea de tiempo. Para el vídeo: ?captura → window.pintaFrame(n) pinta el fotograma n.
// Modelo «Car Concept» © Khronos Group, CC-BY 4.0 (logos retirados). HDR: Poly Haven, CC0.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js';
import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js';

const DUR = 32.5, FPS = 30;
const Q = new URLSearchParams(location.search), CAPTURA = Q.has('captura');
// en captura (render por software) se quita lo más caro; en vivo, con GPU, va todo activado
const OPT = { msaa: +(Q.get('msaa') ?? (CAPTURA ? 0 : 4)), trans: +(Q.get('trans') ?? (CAPTURA ? 0 : 1)), refl: +(Q.get('refl') ?? 0.5), bloom: +(Q.get('bloom') ?? 1), esc: +(Q.get('esc') ?? 0.75), fxaa: +(Q.get('fxaa') ?? (CAPTURA ? 1 : 0)) };
const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, u) => a + (b - a) * u;
const ss = (u) => { u = clamp(u); return u * u * (3 - 2 * u); };
const eio = (u) => { u = clamp(u); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
const eout = (u) => 1 - Math.pow(1 - clamp(u), 3);
const rango = (t, a, b) => clamp((t - a) / (b - a));
const visible = (t, a, b, f = 0.3) => Math.min(rango(t, a, a + f), 1 - rango(t, b - f, b));
const D2R = Math.PI / 180;

// ───────────────────────── render ─────────────────────────
const canvas = $('#gl');
let W = innerWidth, H = innerHeight;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: CAPTURA, powerPreference: 'high-performance' });
renderer.setPixelRatio(CAPTURA ? OPT.esc : Math.min(devicePixelRatio, 2)); renderer.setSize(W, H, false);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(42, W / H, 0.05, 400);
const SUELO_Y = -0.158;

// ── entornos ──
const pmrem = new THREE.PMREMGenerator(renderer);
function entornoEstudio() {       // plató de coche: gran softbox cenital y tiras laterales
  const s = new THREE.Scene(); s.background = new THREE.Color(0x020203);
  const luz = (w, h, p, I, c = 0xffffff) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(I), side: THREE.DoubleSide }));
    m.position.set(...p); m.lookAt(0, 0.4, 0); s.add(m); return m; };
  for (const x of [-2.2, 0, 2.2]) luz(0.55, 13, [x, 6.5, 0.5], 13);       // tres tiras cenitales largas: los reflejos «de anuncio»
  luz(7, 9, [0, 9, 0], 0.55);                                               // techo suave de relleno
  luz(11, 0.5, [-9, 1.7, 1], 9); luz(11, 0.5, [9, 1.7, 1], 9);              // tiras laterales
  luz(5, 1.6, [0, 3.0, -11], 4, 0xbcd4ff);                                  // contra trasero frío
  luz(6, 1.0, [0, 1.2, 12], 1.6, 0xffe2bd);                                 // relleno frontal cálido
  return pmrem.fromScene(s, 0.035).texture;
}
const hdr = async (f) => { const t = await new RGBELoader().loadAsync('assets/' + f); t.mapping = THREE.EquirectangularReflectionMapping; return t; };
const hdrNoche = await hdr('dikhololo_night_1k.hdr');
const hdrTarde = await new UltraHDRLoader().setDataType(THREE.HalfFloatType).loadAsync('assets/spruit_sunrise_4k.hdr.jpg'); hdrTarde.mapping = THREE.EquirectangularReflectionMapping;
// exterior de día: el HDR se proyecta sobre el suelo (GroundedSkybox) para que el coche pise el terreno real de la foto
const cielo = new GroundedSkybox(hdrTarde, +(Q.get('alt') ?? 3.2), 120, 96); cielo.position.y = +(Q.get('alt') ?? 3.2) + SUELO_Y - 0.004; cielo.visible = false; scene.add(cielo);
const ENT = [
  { env: entornoEstudio(), bg: new THREE.Color(0x07080a), suelo: 0x07080a, I: 1.0, bgI: 1, exp: 1.0, rot: 0, velo: 0.88 },
  { env: hdrTarde, bg: new THREE.Color(0x000000), suelo: 0x14110f, I: 1.15, bgI: 1, exp: 0.9, rot: +(Q.get('rot') ?? 2.6), velo: 0.9, cielo: 1 },
  { env: hdrNoche, bg: hdrNoche, suelo: 0x030406, I: +(Q.get('nI') ?? 3.2), bgI: +(Q.get('nbg') ?? 1.3), exp: 1.0, rot: +(Q.get('nrot') ?? 0.4), velo: 0.8 },
];
scene.backgroundBlurriness = 0.16;

// ── suelo: espejo atenuado + sombra de contacto ──
const espejo = new Reflector(new THREE.PlaneGeometry(400, 400), { textureWidth: Math.round(W * OPT.refl * OPT.esc), textureHeight: Math.round(H * OPT.refl * OPT.esc), color: 0x8a8a8a, clipBias: 0.003, multisample: 0 });
espejo.rotation.x = -Math.PI / 2; espejo.position.y = SUELO_Y; scene.add(espejo);
const velo = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshBasicMaterial({ color: 0x07080a, transparent: true, opacity: 0.66, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -8 }));
velo.rotation.x = -Math.PI / 2; velo.position.y = SUELO_Y + 0.002; velo.renderOrder = 1; scene.add(velo);
{ const c = document.createElement('canvas'); c.width = 512; c.height = 512; const x = c.getContext('2d');
  x.filter = 'blur(26px)'; x.fillStyle = 'rgba(0,0,0,.92)'; x.beginPath(); x.roundRect(168, 96, 176, 320, 50); x.fill();
  x.filter = 'blur(10px)'; x.fillStyle = 'rgba(0,0,0,.85)'; for (const [px, py] of [[176, 150], [336, 150], [182, 372], [330, 372]]) { x.beginPath(); x.ellipse(px, py, 22, 44, 0, 0, 7); x.fill(); }
  const t = new THREE.CanvasTexture(c); const m = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -8, polygonOffsetUnits: -16 }));
  m.rotation.x = -Math.PI / 2; m.rotation.z = Math.PI; m.position.set(0, SUELO_Y + 0.004, 0.24); m.renderOrder = 2; scene.add(m); }

// ── coche ──
const gltf = await new GLTFLoader().loadAsync('assets/car.glb');
const coche = gltf.scene; scene.add(coche); coche.updateMatrixWorld(true);
const porNombre = {}; coche.traverse((o) => { if (o.name) porNombre[o.name] = o; });
for (const n of ['License_Plate', 'InteriorSteeringEmblem']) if (porNombre[n]) porNombre[n].visible = false;
// variantes de pintura (KHR_materials_variants): se precargan las tres
const VAR = [], mallasVar = [];
{ const tareas = [];
  coche.traverse((o) => { const map = o.isMesh && o.userData.gltfExtensions?.KHR_materials_variants?.mappings; if (!map) return;
    o.userData.var = []; mallasVar.push(o);
    for (const m of map) for (const v of m.variants) tareas.push(gltf.parser.getDependency('material', m.material).then((mat) => { o.userData.var[v] = mat; })); });
  await Promise.all(tareas); }
function pintura(i) { for (const o of mallasVar) if (o.userData.var[i]) { o.material = o.userData.var[i]; gltf.parser.assignFinalMaterial(o); } }
const MAT = {}; const recoge = (m) => { if (m && m.name) (MAT[m.name] ||= new Set()).add(m); };
coche.traverse((o) => { if (o.isMesh) { recoge(o.material); (o.userData.var || []).forEach(recoge); } });
for (const s of Object.values(MAT)) for (const m of s) { m.userData.e0 = m.emissiveIntensity; }
const emis = (nombre, k) => { for (const m of MAT[nombre] || []) m.emissiveIntensity = m.userData.e0 * k; };
if (!OPT.trans) for (const s of Object.values(MAT)) for (const m of s) if (m.transmission > 0) {     // cristal sin pase de transmisión (mucho más rápido)
  m.transmission = 0; m.transparent = true; m.opacity = 0.3; m.depthWrite = false; m.color.set(0x020304); m.roughness = 0.0; m.metalness = 0; m.envMapIntensity = 3.2; m.needsUpdate = true; }
for (const m of MAT['Tireside'] || []) { m.map = null; m.color.set(0x0c0c0d); m.needsUpdate = true; }     // sin rótulos de marca en el neumático
// puertas de tijera
const body = coche.children[0];
function puerta(nombre, lado) {
  const o = porNombre[nombre]; if (!o) return null; const p = new THREE.Group();
  p.position.copy(body.worldToLocal(new THREE.Vector3(1.03 * lado, 0.42, 0.93))); body.add(p); p.attach(o); p.userData.lado = lado; return p;
}
const puertas = [puerta('BodyDoorLColor1', 1), puerta('BodyDoorRColor1', -1)].filter(Boolean);
function abrePuertas(u) { for (const p of puertas) { p.rotation.set(u * 62 * D2R, 0, -p.userData.lado * u * 13 * D2R); p.position.x = p.userData.x0 ??= p.position.x; p.position.x = p.userData.x0 + p.userData.lado * 0.05 * u; } }
// ruedas
const giros = [];
for (const n of ['WheelFrontL', 'WheelFrontR', 'WheelRearL', 'WheelRearR']) {
  const w = porNombre[n]; if (!w) continue; const partes = w.children.filter((c) => !/BrakePad/.test(c.name)); const neum = w.children.find((c) => !/Rim|Brake/.test(c.name)) || partes[0];
  const b = new THREE.Box3().setFromObject(neum), c = b.getCenter(new THREE.Vector3()), sz = b.getSize(new THREE.Vector3());
  const ejeM = sz.x <= sz.y && sz.x <= sz.z ? new THREE.Vector3(1, 0, 0) : (sz.y <= sz.z ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(0, 0, 1));
  const eje = ejeM.applyQuaternion(w.getWorldQuaternion(new THREE.Quaternion()).invert()).normalize();
  const g = new THREE.Group(); g.position.copy(w.worldToLocal(c.clone())); w.add(g); g.updateMatrixWorld(true); partes.forEach((p) => g.attach(p)); giros.push({ g, eje });
}
function ruedas(ang) { for (const { g, eje } of giros) g.quaternion.setFromAxisAngle(eje, ang); }

// ── velocidad: trazos de luz y líneas de carril ──
const N = 150, trazos = new THREE.InstancedMesh(new THREE.BoxGeometry(0.035, 0.035, 1), new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 1, 1) }), N);
const semilla = (i) => { const x = Math.sin(i * 127.1) * 43758.5453; return x - Math.floor(x); };
const TR = [...Array(N)].map((_, i) => { const lado = semilla(i) < .5 ? -1 : 1; return { x: lado * (2.4 + semilla(i + 9) * 9), y: 0.15 + semilla(i + 3) ** 1.5 * 5, z0: semilla(i + 5) * 90, L: 2 + semilla(i + 7) * 7, c: semilla(i + 11) }; });
trazos.frustumCulled = false; scene.add(trazos);
const carril = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.16, 3.2), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.6, 1.6), polygonOffset: true, polygonOffsetFactor: -12, polygonOffsetUnits: -24 }), 24); carril.frustumCulled = false; scene.add(carril);
const M4 = new THREE.Matrix4(), Qd = new THREE.Quaternion(), Qplano = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)), Vp = new THREE.Vector3(), Vs = new THREE.Vector3(), Cc = new THREE.Color();
function velocidad(k, dist) {   // k: 0..1 intensidad · dist: metros recorridos
  trazos.visible = carril.visible = k > 0.001 && !Q.has('sintrazos');
  if (!trazos.visible) return;
  TR.forEach((d, i) => { const z = 45 - ((d.z0 + dist) % 90); M4.compose(Vp.set(d.x, d.y, z), Qd, Vs.set(1, 1, d.L * (0.3 + k)));
    trazos.setMatrixAt(i, M4); const e = (1.1 + d.c * 2.0) * k; trazos.setColorAt(i, d.c > 0.72 ? Cc.setRGB(e, e * 0.62, e * 0.2) : Cc.setRGB(e * 0.8, e * 0.9, e)); });
  trazos.instanceMatrix.needsUpdate = true; trazos.instanceColor.needsUpdate = true;
  for (let i = 0; i < 24; i++) { const z = 42 - ((i * 7 + dist) % 84); M4.compose(Vp.set(i % 2 ? 2.7 : -2.7, SUELO_Y + 0.006, z), Qplano, Vs.set(1, 1, 1)); carril.setMatrixAt(i, M4); }
  carril.instanceMatrix.needsUpdate = true; carril.material.color.setScalar(0.55 * k);
}

const CAPA_T = 1;   // capa de lo transparente (cristales, velos del suelo, espejo): no entra en el reflejo del suelo
coche.traverse((o) => { if (o.isMesh && (o.material.transparent || o.material.transmission > 0)) o.layers.set(CAPA_T); });
for (const o of [espejo, velo]) o.layers.set(CAPA_T); scene.traverse((o) => { if (o.isMesh && o.renderOrder === 2) o.layers.set(CAPA_T); });
cam.layers.enable(CAPA_T);

// ── postproceso ──
const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: OPT.msaa });
const composer = new EffectComposer(renderer, rt); composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(W, H);
composer.addPass(new RenderPass(scene, cam));
const bloom = new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), 0.22, 0.6, 1.6); if (OPT.bloom) composer.addPass(bloom); composer.addPass(new OutputPass());
if (OPT.fxaa) { const fx = new ShaderPass(FXAAShader); const pr = renderer.getPixelRatio(); fx.material.uniforms.resolution.value.set(1 / (W * pr), 1 / (H * pr)); composer.addPass(fx); }

// ───────────────────────── cámara ─────────────────────────
const orb = (az, el, r, tg) => new THREE.Vector3(tg[0] + r * Math.sin(az * D2R) * Math.cos(el * D2R), tg[1] + r * Math.sin(el * D2R), tg[2] + r * Math.cos(az * D2R) * Math.cos(el * D2R));
const v3 = (a) => new THREE.Vector3(...a);
const curvaP = new THREE.CatmullRomCurve3([[4.6, 2.5, -5.2], [4.4, 1.7, -2.2], [3.1, 1.25, 0.2], [1.75, 1.08, 0.55], [0.75, 1.0, 0.35], [0.0, 0.95, 0.22]].map(v3), false, 'centripetal');
const curvaT = new THREE.CatmullRomCurve3([[0.3, 0.6, -0.2], [0.5, 0.7, 0.2], [0.3, 0.75, 0.5], [0.0, 0.78, 0.9], [0.0, 0.72, 1.3], [0.0, 0.68, 1.6]].map(v3), false, 'centripetal');
const PLANOS = [
  { a: 0, b: 2.6, f: (u) => ({ p: orb(0, 4, lerp(7.6, 6.9, u), [0, 0.45, 1.2]), t: [0, 0.45, 1.2], fov: 34 }) },
  { a: 2.6, b: 7.5, f: (u) => { const e = ss(u); return { p: orb(lerp(24, -16, e), lerp(26, 15, e), lerp(8.9, 7.4, e), [0, 0.42, 0.45]), t: [0, lerp(0.75, 0.42, e), 0.45], fov: 42 }; } },
  { a: 7.5, b: 13.0, f: (u) => ({ p: orb(lerp(-42, -24, ss(u)), lerp(9, 13, u), lerp(6.4, 5.9, u), [0.1, 0.5, 0.9]), t: [0.1, 0.62, 0.9], fov: 42 }) },
  { a: 13.0, b: 18.5, f: (u) => { const e = eio(rango(u, 0.1, 0.97)); return { p: curvaP.getPoint(e), t: curvaT.getPoint(e).toArray(), fov: lerp(42, 62, ss(rango(e, 0.45, 1))) }; } },
  { a: 18.5, b: 23.5, f: (u) => ({ p: orb(lerp(204, 152, ss(u)), lerp(13, 9, u), lerp(7.9, 7.2, u), [0, 0.5, -0.5]), t: [0, 0.62, -0.5], fov: 42 }) },
  { a: 23.5, b: 25.9, f: (u) => ({ p: orb(lerp(-30, -22, u), 3.5, lerp(6.0, 5.4, u), [0, 0.45, 1.1]), t: [0, 0.5, 1.1], fov: 50, tiembla: 1 }) },
  { a: 25.9, b: 28.6, f: (u) => ({ p: orb(lerp(197, 186, u), lerp(7, 11, u), lerp(5.6, 7.4, eout(u)), [0, 0.45, -0.8]), t: [0, 0.55, -0.8], fov: 50, tiembla: 1 }) },
  { a: 28.6, b: DUR, f: () => ({ p: orb(0, 20, 9, [0, 0.4, 0]), t: [0, 0.4, 0], fov: 42 }) },
];
const CLIC_COLOR = [[8.7, 1], [10.3, 2], [11.9, 0]], CLIC_PUERTAS = 13.6, CLIC_MUNDO = [[19.5, 1], [21.4, 2]];

// ───────────────────────── interfaz ─────────────────────────
const UI = $('#ui');
function encajaUI() { const k = Math.min(W / 1080, H / 1920); UI.style.transform = `translate(-50%,-50%) scale(${k})`; }
encajaUI();
const centro = (el) => { const r = el.getBoundingClientRect(), u = UI.getBoundingClientRect(), k = u.width / 1080; return [(r.left + r.width / 2 - u.left) / k, (r.top + r.height / 2 - u.top) / k]; };
const pon = (el, o, tr = '') => { el.style.opacity = o.toFixed(3); if (tr !== null) el.style.transform = tr; };
const E = Object.fromEntries(['nav', 'hero', 'scrollhint', 'progreso', 'pintura', 'puertas', 'mundo', 'hud', 'cursor', 'rotulo', 'gancho', 'cierre', 'negro'].map((k) => [k, $('#' + k)]));
// posiciones del cursor (se miden con los paneles visibles)
for (const k of ['pintura', 'puertas', 'mundo']) E[k].style.opacity = 1;
const P_M = $$('#pintura .m').map(centro), P_B = centro(E.puertas), P_S = $$('#mundo .seg span').map(centro);
for (const k of ['pintura', 'puertas', 'mundo']) E[k].style.opacity = 0;
const RUTA = [[7.6, 900, 1700], [8.5, ...P_M[1]], [9.6, ...P_M[1]], [10.15, ...P_M[2]], [11.2, ...P_M[2]], [11.75, ...P_M[0]], [12.7, ...P_M[0]], [13.45, ...P_B], [15.0, P_B[0] + 60, P_B[1] + 40],
  [18.6, 760, 1640], [19.35, ...P_S[1]], [20.6, ...P_S[1]], [21.25, ...P_S[2]], [23.2, P_S[2][0] + 40, P_S[2][1] + 60]].map(([t, x, y]) => [t, x + 8, y + 10]);
const CLICS = [...CLIC_COLOR.map((c) => c[0]), CLIC_PUERTAS, ...CLIC_MUNDO.map((c) => c[0])];
const ROTULOS = [[7.6, 12.8, 'Cambia el <em>color.</em><br>En directo.'], [13.2, 18.2, 'Abre. Entra.<br><em>Mira dentro.</em>'], [18.7, 23.3, 'Cambia el <em>mundo</em><br>con un clic.'], [23.7, 27.9, 'Y todo corre<br>en un <em>navegador.</em>']];
let rotuloActual = -1;
function interfaz(t) {
  pon(E.gancho.children[0], visible(t, 0.12, 1.45, 0.12), `scale(${lerp(1.06, 1, eout(rango(t, 0.12, 0.6)))})`);
  pon(E.gancho.children[1], visible(t, 1.5, 2.85, 0.14), `scale(${lerp(1.1, 1, eout(rango(t, 1.5, 1.9)))})`);
  pon(E.nav, visible(t, 2.8, 27.9, 0.4), `translateY(${lerp(-30, 0, eout(rango(t, 2.8, 3.4)))}px)`);
  pon(E.hero, visible(t, 3.0, 7.2, 0.45), `translateY(${lerp(40, 0, eout(rango(t, 3.0, 3.8))) - 120 * ss(rango(t, 6.4, 7.2))}px)`);
  pon(E.scrollhint, visible(t, 4.0, 7.0, 0.4)); $('.raton i').style.transform = `translateY(${((t * 1.4) % 1) * 26}px)`; $('.raton i').style.opacity = 1 - ((t * 1.4) % 1);
  pon(E.progreso, visible(t, 2.8, 27.9, 0.4)); E.progreso.firstElementChild.style.height = (100 * rango(t, 2.6, 28)).toFixed(2) + '%';
  pon(E.pintura, visible(t, 7.5, 12.95, 0.35), `translateY(${lerp(60, 0, eout(rango(t, 7.5, 8.1)))}px)`);
  let v = 0; for (const [tc, i] of CLIC_COLOR) if (t >= tc) v = i; $$('#pintura .m').forEach((m, i) => m.classList.toggle('sel', i === v));
  pon(E.puertas, visible(t, 13.05, 15.2, 0.3), `translateY(${lerp(50, 0, eout(rango(t, 13.05, 13.5)))}px) scale(${t > CLIC_PUERTAS && t < CLIC_PUERTAS + 0.18 ? 0.95 : 1})`);
  E.puertas.lastChild.textContent = t > CLIC_PUERTAS ? 'Puertas abiertas' : 'Abrir puertas';
  pon(E.mundo, visible(t, 18.6, 23.35, 0.35), `translateY(${lerp(60, 0, eout(rango(t, 18.6, 19.1)))}px)`);
  let e = 0, te = 0; for (const [tc, i] of CLIC_MUNDO) if (t >= tc) { e = i; te = tc; } const de = e ? lerp(e - 1, e, eout(rango(t, te, te + 0.3))) : 0;
  $('#mundo .seg i').style.transform = `translateX(${de * 100}%)`; $$('#mundo .seg span').forEach((s, i) => s.classList.toggle('sel', i === Math.round(de)));
  pon(E.hud, visible(t, 23.6, 27.9, 0.3)); const kv = eout(rango(t, 23.6, 27.6)); $('#hud .vel b').textContent = Math.round(312 * kv); $('#hud .barra i').style.width = (100 * kv).toFixed(1) + '%';
  // cursor
  let cx = RUTA[0][1], cy = RUTA[0][2]; for (let i = 0; i < RUTA.length - 1; i++) { const [ta, xa, ya] = RUTA[i], [tb, xb, yb] = RUTA[i + 1]; if (t >= ta) { const u = eio(rango(t, ta, tb)); cx = lerp(xa, xb, u); cy = lerp(ya, yb, u); } }
  pon(E.cursor, Math.max(visible(t, 7.6, 15.2, 0.3), visible(t, 18.6, 23.2, 0.3)), `translate(${cx}px,${cy}px)`);
  let ro = 0, rs = 0.3; for (const tc of CLICS) if (t >= tc && t < tc + 0.45) { const u = (t - tc) / 0.45; ro = 1 - u; rs = 0.3 + u; }
  const anillo = E.cursor.lastElementChild; anillo.style.opacity = ro; anillo.style.transform = `scale(${rs})`;
  // rótulos
  let ri = -1, rv = 0; ROTULOS.forEach(([a, b], i) => { const o = visible(t, a, b, 0.25); if (o > 0) { ri = i; rv = o; } });
  if (ri !== rotuloActual && ri >= 0) { E.rotulo.innerHTML = ROTULOS[ri][2]; rotuloActual = ri; }
  pon(E.rotulo, rv, ri >= 0 ? `translateY(${lerp(24, 0, eout(rango(t, ROTULOS[ri][0], ROTULOS[ri][0] + 0.4)))}px)` : '');
  // cierre
  pon(E.negro, Math.max(rango(t, 27.9, 28.6), 1 - rango(t, 0.0, 0.25)), null);
  pon(E.cierre.children[0], visible(t, 28.6, 30.35, 0.3), `scale(${lerp(1.05, 1, eout(rango(t, 28.6, 29.2)))})`);
  pon(E.cierre.children[1], rango(t, 30.5, 31.1), `scale(${lerp(0.94, 1, eout(rango(t, 30.5, 31.4)))})`);
}

// ───────────────────────── estado por instante ─────────────────────────
let entActual = -1, varActual = -1;
function entorno(i) { if (i === entActual) return; entActual = i; const e = ENT[i]; scene.environment = e.env; scene.background = e.bg; scene.backgroundIntensity = e.bgI;
  velo.material.color.set(e.suelo); velo.material.opacity = e.velo; scene.backgroundRotation.y = e.rot;
  cielo.visible = !!e.cielo; espejo.visible = velo.visible = !e.cielo; cielo.rotation.y = e.rot; }
function estado(t) {
  // plano y cámara
  const pl = PLANOS.find((p) => t >= p.a && t < p.b) || PLANOS[PLANOS.length - 1]; const k = pl.f((t - pl.a) / (pl.b - pl.a));
  cam.position.copy(k.p); const tg = new THREE.Vector3(...k.t);
  if (k.tiembla) { cam.position.x += Math.sin(t * 31) * 0.012 + Math.sin(t * 17.3) * 0.01; cam.position.y += Math.abs(Math.sin(t * 23.7)) * 0.012; tg.y += Math.sin(t * 27.1) * 0.006; }
  cam.fov = k.fov; cam.updateProjectionMatrix(); cam.lookAt(tg);
  // entorno y exposición
  let e = 0, te = -9; for (const [tc, i] of CLIC_MUNDO) if (t >= tc + 0.12) { e = i; te = tc + 0.12; }
  if (t >= 28.6) e = 0; entorno(e);
  let exp = ENT[e].exp; for (const [tc] of CLIC_MUNDO) exp *= clamp(Math.abs(t - (tc + 0.12)) / 0.16, 0.04, 1);
  const enc = t < 1.5 ? 0.012 : lerp(0.012, 1, eout(rango(t, 1.5, 1.85)));           // el plató se enciende en «ES UNA WEB»
  scene.environmentIntensity = ENT[e].I * enc; renderer.toneMappingExposure = exp * lerp(1, 2.1, ss(rango(t, 15.4, 17.6)) * (t < 18.5 ? 1 : 0));
  // barrido de reflejos en cada cambio de color y deriva lenta
  let rot = ENT[e].rot + (e === 1 ? 0 : t * 0.02); for (const [tc] of CLIC_COLOR) rot += Math.PI * 2 * eio(rango(t, tc, tc + 0.7));
  if (t >= 23.5) rot += (t - 23.5) * 0.25;
  scene.environmentRotation.y = rot;
  let v = 0; for (const [tc, i] of CLIC_COLOR) if (t >= tc + 0.3) v = i; if (v !== varActual) { pintura(v); varActual = v; }
  // faros: parpadeo de arranque, luz diurna y noche
  const parp = t < 0.45 ? 0 : t < 0.55 ? 1 : t < 0.68 ? 0.1 : t < 0.8 ? 1 : t < 0.9 ? 0.3 : 1;
  const noche = e === 2 ? 1 : 0; emis('Headlight', parp * (1 + 1.2 * noche + (t < 2.4 ? 1.5 : 0))); emis('Brakelight', (t < 1.5 ? 0 : 1) * (1 + 1.0 * noche)); emis('Signallight', t < 1.5 ? 0 : 1);
  bloom.strength = lerp(0.22, 0.3, noche) + (t < 2 ? 0.25 : 0);
  // puertas, ruedas, velocidad
  abrePuertas(eio(rango(t, CLIC_PUERTAS + 0.1, CLIC_PUERTAS + 1.5)) * (t < 18.5 ? 1 : 0));
  const kv = eout(rango(t, 23.5, 25.2)) * (t < 28.6 ? 1 : 0), dist = t < 23.5 ? 0 : 42 * (t - 23.5) * (0.4 + 0.6 * kv);
  ruedas(dist / 0.34); velocidad(kv, dist);
  coche.position.y = kv * Math.sin(t * 40) * 0.0025;
  interfaz(t);
}
function pinta(t) { estado(t); composer.render(); }

// ───────────────────────── arranque ─────────────────────────
pintura(0); for (let i = 0; i < 3; i++) { pintura(i); entorno(i); renderer.compile(scene, cam); } pintura(0); varActual = 0; entorno(0);
window.META = { fps: FPS, duracion: DUR, fotogramas: Math.round(DUR * FPS) };
window.pintaFrame = (n) => { pinta(n / FPS); renderer.getContext().finish(); return true; };
window.pintaT = (t) => { pinta(t); renderer.getContext().finish(); return true; };
if (!CAPTURA) {
  const sp = document.createElement('div'); sp.style.height = '1400vh'; document.body.appendChild(sp);       // el scroll es la línea de tiempo
  addEventListener('resize', () => { W = innerWidth; H = innerHeight; renderer.setSize(W, H, false); composer.setSize(W, H); cam.aspect = W / H; encajaUI(); });
  const auto = Q.has('auto'), t0 = performance.now();
  const bucle = () => { const t = auto ? ((performance.now() - t0) / 1000) % DUR : (scrollY / (document.documentElement.scrollHeight - innerHeight)) * (DUR - 4.2); pinta(t); requestAnimationFrame(bucle); };
  bucle();
} else pinta(0);
window.DBG = { scene, espejo, coche, composer, renderer, cam, bloom, trazos, velo, THREE };
window.LISTO = true;
