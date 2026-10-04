// VELA · Vela Uno — tienda 3D de demostración (marca ficticia). Three.js + glTF PBR + entorno HDR de estudio.
// En vivo es una ficha de producto real: se gira arrastrando, se cambia color y talla, se añade a la cesta y se paga (simulado).
// Para el vídeo: ?captura → window.pintaFrame(n) pinta el fotograma n de la línea de tiempo. ?auto la reproduce en vivo.
// Modelo «Materials Variants Shoe» © Shopify, CC-BY 4.0 (glTF Sample Assets). HDR: Poly Haven, CC0.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/addons/shaders/VerticalBlurShader.js';

const DUR = 28.4, FPS = 30;
const Q = new URLSearchParams(location.search), CAPTURA = Q.has('captura'), AUTO = Q.has('auto');
const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, u) => a + (b - a) * u;
const ss = (u) => { u = clamp(u); return u * u * (3 - 2 * u); };
const eio = (u) => { u = clamp(u); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
const eout = (u) => 1 - Math.pow(1 - clamp(u), 3);
const rango = (t, a, b) => clamp((t - a) / (b - a));
const visible = (t, a, b, f = 0.3) => Math.min(rango(t, a, a + f), 1 - rango(t, b - f, b));
const D2R = Math.PI / 180, TAU = Math.PI * 2;

// ───────────────────────── producto ─────────────────────────
const VARIANTES = [       // orden de la interfaz → variante del glTF, nombre, muestra y fondo (claro, oscuro)
  { gltf: 'beach', nombre: 'Rosa palo', muestra: '#b98087', fondo: ['#eef4f5', '#c3dae0'] },
  { gltf: 'midnight', nombre: 'Azul océano', muestra: '#1c7ea8', fondo: ['#f3f1ec', '#ddd5c6'] },
  { gltf: 'street', nombre: 'Negro coral', muestra: '#1b1c20', fondo: ['#f7f0ec', '#e9d3c8'] },
];
const PRECIO = 129;

// ───────────────────────── render ─────────────────────────
const UI = $('#ui'), canvas = $('#gl');
let K = 1;
function encaja() { K = Math.min(innerWidth / 1080, innerHeight / 1920); UI.style.transform = `translate(-50%,-50%) scale(${K})`; }
encaja();
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: CAPTURA, powerPreference: 'high-performance' });
const ajustaRender = () => { renderer.setPixelRatio(CAPTURA ? +(Q.get('esc') ?? 1) : Math.min(K * devicePixelRatio, 2)); renderer.setSize(1080, 1920, false); };
ajustaRender();
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = +(Q.get('exp') ?? 1.12); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.setClearColor(0x000000, 0);
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(30, 1080 / 1920, 0.02, 20);
const env = await new RGBELoader().loadAsync('assets/estudio.hdr'); env.mapping = THREE.EquirectangularReflectionMapping;
scene.environment = env; scene.environmentIntensity = +(Q.get('envI') ?? 1.0); scene.environmentRotation.y = +(Q.get('envR') ?? 0.6);
const clave = new THREE.DirectionalLight(0xfff4e8, +(Q.get('luz') ?? 1.4)); clave.position.set(-1.2, 2.4, 1.6); scene.add(clave);

const gltf = await new GLTFLoader().loadAsync('assets/zapatilla.glb');
const zap = new THREE.Group(); scene.add(zap);
{ const b = new THREE.Box3().setFromObject(gltf.scene), c = b.getCenter(new THREE.Vector3()); gltf.scene.position.set(-c.x, -b.min.y, -c.z); zap.add(gltf.scene); }   // centrada y apoyada en y=0
const nombresVar = (gltf.userData.gltfExtensions?.KHR_materials_variants?.variants || []).map((v) => v.name);
const mallasVar = [];
{ const tareas = [];
  gltf.scene.traverse((o) => { const map = o.isMesh && o.userData.gltfExtensions?.KHR_materials_variants?.mappings; if (!map) return;
    o.userData.var = []; mallasVar.push(o);
    for (const m of map) for (const v of m.variants) tareas.push(gltf.parser.getDependency('material', m.material).then((mat) => { o.userData.var[v] = mat; })); });
  await Promise.all(tareas);
  const maxA = renderer.capabilities.getMaxAnisotropy();
  gltf.scene.traverse((o) => { if (!o.isMesh) return; for (const m of [o.material, ...(o.userData.var || [])]) if (m) for (const k of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap']) if (m[k]) m[k].anisotropy = maxA; }); }
let varActual = -1;
function variante(i) { if (i === varActual) return; varActual = i; const g = nombresVar.indexOf(VARIANTES[i].gltf);
  for (const o of mallasVar) if (o.userData.var[g]) { o.material = o.userData.var[g]; gltf.parser.assignFinalMaterial(o); } }

// ── sombra de contacto: profundidad vista desde abajo y desenfocada (se recalcula en cada fotograma) ──
const SUELO = -0.012, SW = 0.86, SH = 0.86, SALT = 0.34;
const sg = new THREE.Group(); sg.position.y = SUELO; scene.add(sg);
const rtS = new THREE.WebGLRenderTarget(512, 512); rtS.texture.generateMipmaps = false; const rtB = rtS.clone();
const pg = new THREE.PlaneGeometry(SW, SH).rotateX(Math.PI / 2);
const planoS = new THREE.Mesh(pg, new THREE.MeshBasicMaterial({ map: rtS.texture, opacity: 0.5, transparent: true, depthWrite: false, toneMapped: false })); planoS.renderOrder = 1; planoS.scale.y = -1; sg.add(planoS);
const planoB = new THREE.Mesh(pg); planoB.visible = false; sg.add(planoB);
const camS = new THREE.OrthographicCamera(-SW / 2, SW / 2, SH / 2, -SH / 2, 0, SALT); camS.rotation.x = Math.PI / 2; sg.add(camS);
const matD = new THREE.MeshDepthMaterial(); matD.userData.darkness = { value: 1.25 }; matD.depthTest = false; matD.depthWrite = false;
matD.onBeforeCompile = (sh) => { sh.uniforms.darkness = matD.userData.darkness;
  sh.fragmentShader = 'uniform float darkness;\n' + sh.fragmentShader.replace('gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );', 'gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );'); };
const matH = new THREE.ShaderMaterial(HorizontalBlurShader), matV = new THREE.ShaderMaterial(VerticalBlurShader); matH.depthTest = matV.depthTest = false;
function desenfoca(a) { planoB.visible = true;
  planoB.material = matH; matH.uniforms.tDiffuse.value = rtS.texture; matH.uniforms.h.value = a / 256; renderer.setRenderTarget(rtB); renderer.render(planoB, camS);
  planoB.material = matV; matV.uniforms.tDiffuse.value = rtB.texture; matV.uniforms.v.value = a / 256; renderer.setRenderTarget(rtS); renderer.render(planoB, camS); planoB.visible = false; }
function sombra() { planoS.visible = false; scene.overrideMaterial = matD; renderer.setRenderTarget(rtS); renderer.clear(); renderer.render(scene, camS); scene.overrideMaterial = null;
  desenfoca(4.2); desenfoca(1.7); renderer.setRenderTarget(null); planoS.visible = true; }

// ── estado → imagen ──
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mezcla = (a, b, u) => { const A = hex(a), B = hex(b); return `rgb(${A.map((x, i) => Math.round(lerp(x, B[i], u))).join(',')})`; };
const E = Object.fromEntries(['fondo', 'palabra', 'nav', 'gira', 'panel', 'vuela', 'velo', 'hoja', 'paso', 'gancho', 'dedo1', 'dedo2', 'negro', 'cierre', 'cta', 'pagar', 'globo', 'colornombre', 'itemdet', 'cantn', 'itemp', 'total', 'mini'].map((k) => [k, $('#' + (k === 'mini' ? 'mini' : k))]));
const ALT = 0.036, CENTRO = new THREE.Vector3(0, ALT + 0.074, 0), MACRO = new THREE.Vector3(+(Q.get('mx') ?? 0.0), ALT + +(Q.get('my') ?? 0.118), +(Q.get('mz') ?? 0.0));
const D0 = +(Q.get('d0') ?? 1.26), DM = +(Q.get('dm') ?? 0.5);
const tg = new THREE.Vector3();
// st: { rot, el (°), az (°), zoom 0..1, v, vAnt, vMix, pop, bob, off (px de 1920), sombra 0..1 }
function dibuja(st) {
  variante(st.v);
  zap.rotation.y = st.rot; zap.position.y = ALT + st.bob; zap.scale.setScalar(st.pop);
  tg.lerpVectors(CENTRO, MACRO, st.zoom); const d = lerp(D0 * (st.cerca ?? 1), DM, st.zoom), el = st.el * D2R, az = st.az * D2R;
  cam.position.set(tg.x + d * Math.sin(az) * Math.cos(el), tg.y + d * Math.sin(el), tg.z + d * Math.cos(az) * Math.cos(el)); cam.lookAt(tg);
  cam.setViewOffset(1080, 1920, 0, st.off, 1080, 1920);
  planoS.material.opacity = 0.5 * (1 - 0.75 * st.zoom);
  sombra(); renderer.render(scene, cam);
  const a = VARIANTES[st.vAnt].fondo, b = VARIANTES[st.v].fondo, u = st.vMix, cy = (960 - st.off) / 19.2;
  E.fondo.style.background = `radial-gradient(95% 52% at 50% ${cy.toFixed(1)}%, ${mezcla(a[0], b[0], u)} 0%, ${mezcla(a[0], b[0], u)} 22%, ${mezcla(a[1], b[1], u)} 100%)`;
}

// miniaturas de la cesta (una por color), sacadas del propio render
const MINI = [];
{ const c2 = document.createElement('canvas'); c2.width = c2.height = 460; const x = c2.getContext('2d');
  for (let i = 0; i < VARIANTES.length; i++) { dibuja({ rot: -0.55, el: 16, az: 0, zoom: 0, v: i, vAnt: i, vMix: 1, pop: 1, bob: 0, off: 0 });
    const w = canvas.width, h = canvas.height, lado = w * 0.92; x.clearRect(0, 0, 460, 460); x.drawImage(canvas, (w - lado) / 2, h / 2 - lado * 0.47, lado, lado, 0, 0, 460, 460); MINI.push(c2.toDataURL('image/png')); } }

// ───────────────────────── interfaz común ─────────────────────────
const euros = (n) => n.toLocaleString('es-ES') + ' €';
const btnColor = $$('#colores button'), btnTalla = $$('#tallas button');
btnColor.forEach((b, i) => b.style.setProperty('--c', VARIANTES[i].muestra));
function ui({ v, talla, cant, anadido, pagado }) {
  btnColor.forEach((b, i) => b.classList.toggle('sel', i === v)); btnTalla.forEach((b) => b.classList.toggle('sel', b.textContent === String(talla)));
  E.colornombre.textContent = VARIANTES[v].nombre; E.itemdet.textContent = `${VARIANTES[v].nombre} · Talla ${talla || 42}`;
  E.cantn.textContent = cant; E.itemp.textContent = euros(PRECIO * cant); E.total.textContent = euros(PRECIO * cant); E.globo.textContent = cant;
  if (E.mini.dataset.v !== String(v)) { E.mini.src = E.vuela.src = MINI[v]; E.mini.dataset.v = v; E.mini.parentElement.style.background = VARIANTES[v].fondo[1]; }
  E.cta.classList.toggle('ok', !!anadido); E.cta.firstChild.textContent = anadido ? 'Añadido ✓' : 'Añadir a la cesta';
  E.pagar.classList.toggle('ok', pagado === 2); E.pagar.firstChild.textContent = pagado === 2 ? 'Pedido confirmado ✓' : pagado === 1 ? 'Procesando…' : `Pagar ${euros(PRECIO * cant)}`;
}
const pon = (el, o, tr) => { el.style.opacity = o.toFixed(3); if (tr !== undefined) el.style.transform = tr; };
const centro = (el) => { const r = el.getBoundingClientRect(), u = UI.getBoundingClientRect(); return [(r.left + r.width / 2 - u.left) / K, (r.top + r.height / 2 - u.top) / K]; };

// ───────────────────────── línea de tiempo (vídeo) ─────────────────────────
const HERO = -0.55;
const T_UI = 2.4, TC = [[8.2, 1], [9.9, 2]], Z0 = 11.9, Z1 = 15.2, T_TALLA = 17.0, T_CTA = 18.0, T_CESTA = 19.7, T_MAS = 21.0, T_PAGAR = 22.2, T_NEGRO = 23.5, T_FRASE = 24.2, T_FIRMA = 26.1;
const PASOS = [[3.0, 7.3, '01', 'Gíralo con el dedo'], [7.6, 11.5, '02', 'Cambia el color'], [11.8, 16.2, '03', 'Acércate al detalle'], [16.5, 19.2, '04', 'Tu talla, a la cesta'], [19.5, 23.4, '05', 'Y paga en dos toques']];
const claves = (K_, t, f = ss) => { if (t <= K_[0][0]) return K_[0][1]; for (let i = 0; i < K_.length - 1; i++) { const [ta, va] = K_[i], [tb, vb, fb] = K_[i + 1]; if (t <= tb) return lerp(va, vb, (fb || f)(rango(t, ta, tb))); } return K_[K_.length - 1][1]; };
const K_ROT = [[0, HERO - 0.12], [1.25, HERO], [2.3, 0.95], [3.0, 1.3, eout], [3.3, 1.32], [4.6, 4.05], [4.9, 4.28, eout], [6.3, 5.45], [7.3, TAU + HERO, eio], [13.4, TAU + HERO], [14.9, TAU + HERO - 0.75], [15.3, TAU + HERO - 0.75], [16.2, TAU + HERO, eio]];
const K_EL = [[0, 9], [4.9, 9], [6.3, 40], [6.5, 40], [7.3, 12, eio], [Z0, 12], [13.1, 30, eio], [13.4, 30], [14.9, 42], [Z1, 42], [16.2, 12, eio]];
const K_AZ = [[0, 0], [Z0, 0], [13.1, 28, eio], [13.4, 28], [14.9, 12], [Z1, 12], [16.2, 0, eio]];
function estadoT(t) {
  let rot = claves(K_ROT, t), v = 0, vAnt = 0, tv = -9, pop = 1;
  for (const [tc, i] of TC) { const u = rango(t, tc, tc + 0.95); rot += TAU * eio(u); if (u > 0 && u < 1) pop = 1 + 0.06 * Math.sin(Math.PI * u); if (t >= tc + 0.47) { vAnt = v; v = i; tv = tc + 0.47; } }
  const zoom = eio(rango(t, Z0, 13.1)) * (1 - eio(rango(t, Z1, 16.2)));
  const off = lerp(lerp(150, 330, eio(rango(t, T_UI - 0.2, T_UI + 0.7))), 90, zoom);
  return { rot, el: claves(K_EL, t), az: claves(K_AZ, t), zoom, v, vAnt, vMix: ss(rango(t, tv, tv + 0.45)), pop, bob: 0.006 * Math.sin(t * 1.9) * (1 - zoom), off, cerca: lerp(0.8, 1, eio(rango(t, T_UI - 0.2, T_UI + 0.7))) };
}
// dedos: arrastres [t0, t1, x0, y0, x1, y1, dedo] y toques [t, x, y]
let ARR = [], TOQ = [];
function mideGuion() {
  for (const el of [E.hoja]) el.style.transform = 'none';
  const cT = centro(btnTalla[3]), cC = btnColor.map(centro), cCta = centro(E.cta), cIco = centro($('#cesta-ico')), cMas = centro($('#mas')), cPag = centro(E.pagar);
  E.hoja.style.transform = '';
  ARR = [[1.25, 2.3, 250, 1010, 830, 960, 1], [3.3, 4.6, 200, 900, 880, 850, 1], [4.9, 6.3, 330, 640, 720, 960, 1],
    [Z0, 12.8, 500, 800, 300, 560, 1], [Z0, 12.8, 590, 900, 800, 1150, 2], [13.4, 14.9, 760, 1080, 400, 1240, 1], [Z1, 15.95, 290, 600, 500, 830, 1], [Z1, 15.95, 810, 1160, 600, 930, 2]];
  TOQ = [[TC[0][0], ...cC[1]], [TC[1][0], ...cC[2]], [T_TALLA, ...cT], [T_CTA, ...cCta], [T_CESTA, ...cIco], [T_MAS, ...cMas], [T_PAGAR, ...cPag]];
  return { cIco };
}
let GUION = null;
function dedos(t) {
  const d = [{ o: 0, x: 0, y: 0, s: 1 }, { o: 0, x: 0, y: 0, s: 1 }];
  for (const [a, b, x0, y0, x1, y1, n] of ARR) { const o = Math.min(rango(t, a - 0.18, a - 0.02), 1 - rango(t, b + 0.02, b + 0.2)); if (o <= 0) continue; const u = ss(rango(t, a, b));
    d[n - 1] = { o, x: lerp(x0, x1, u), y: lerp(y0, y1, u), s: lerp(1.28, 1, eout(rango(t, a - 0.18, a))) + 0.25 * rango(t, b, b + 0.2) }; }
  for (const [tt, x, y] of TOQ) { const o = Math.min(rango(t, tt - 0.42, tt - 0.2), 1 - rango(t, tt + 0.2, tt + 0.42)); if (o <= 0) continue; const ent = eout(rango(t, tt - 0.42, tt - 0.05));
    d[0] = { o, x: x + 60 * (1 - ent), y: y + 90 * (1 - ent), s: t < tt ? lerp(1.3, 1, ent) : lerp(0.8, 1.15, rango(t, tt, tt + 0.3)) }; }
  [E.dedo1, E.dedo2].forEach((el, i) => pon(el, d[i].o, `translate(${d[i].x.toFixed(1)}px,${d[i].y.toFixed(1)}px) scale(${d[i].s.toFixed(3)})`));
}
let pasoActual = -1;
function interfazT(t, st) {
  let v = 0; for (const [tc, i] of TC) if (t >= tc) v = i;
  const cant = t >= T_MAS ? 2 : 1, anadido = t >= T_CTA + 0.05;
  ui({ v, talla: t >= T_TALLA ? 42 : 0, cant, anadido, pagado: t >= T_PAGAR + 0.75 ? 2 : t >= T_PAGAR + 0.05 ? 1 : 0 });
  // gancho
  pon(E.gancho.children[0], visible(t, 0.1, 1.2, 0.14), `translateY(${lerp(26, 0, eout(rango(t, 0.1, 0.55)))}px)`);
  pon(E.gancho.children[1], visible(t, 1.25, 2.45, 0.16), `translateY(${lerp(26, 0, eout(rango(t, 1.25, 1.7)))}px)`);
  // la web aparece
  const ent = eout(rango(t, T_UI, T_UI + 0.8)), fuera = st.zoom;
  pon(E.nav, rango(t, T_UI, T_UI + 0.5), `translateY(${lerp(-40, 0, ent)}px)`);
  pon(E.palabra, 0.5 * rango(t, T_UI, T_UI + 0.8) * (1 - fuera), `translateY(${lerp(60, 0, ent)}px) scale(${1 + 0.25 * fuera})`);
  pon(E.panel, 1, `translateY(${lerp(820, 0, ent) + 820 * eio(fuera)}px)`);
  pon(E.gira, visible(t, T_UI + 0.4, 7.3, 0.4), `translateX(-50%) translateY(${lerp(30, 0, eout(rango(t, T_UI + 0.4, T_UI + 1)))}px)`);
  // pasos
  let pi = -1, pv = 0; PASOS.forEach(([a, b], i) => { const o = visible(t, a, b, 0.25); if (o > 0) { pi = i; pv = o; } });
  if (pi >= 0 && pi !== pasoActual) { E.paso.firstElementChild.textContent = PASOS[pi][2]; E.paso.lastElementChild.textContent = PASOS[pi][3]; pasoActual = pi; }
  pon(E.paso, pv, `translateX(-50%) translateY(${pi >= 0 ? lerp(-22, 0, eout(rango(t, PASOS[pi][0], PASOS[pi][0] + 0.4))) : 0}px)`);
  // pulsaciones
  E.cta.style.transform = `scale(${t > T_CTA && t < T_CTA + 0.16 ? 0.97 : 1})`; E.pagar.style.transform = `scale(${t > T_PAGAR && t < T_PAGAR + 0.16 ? 0.97 : 1})`;
  // a la cesta: la miniatura vuela al icono
  const uv = rango(t, T_CTA + 0.1, T_CTA + 0.78), [ix, iy] = GUION.cIco, e = eio(uv);
  pon(E.vuela, uv > 0 && uv < 1 ? Math.min(1, uv * 6) * (1 - rango(uv, 0.86, 1)) : 0, `translate(${lerp(540, ix, e) - 130}px,${lerp(700, iy, e) - 130 - 180 * Math.sin(Math.PI * e)}px) scale(${lerp(2.2, 0.22, e)})`);
  const tg1 = T_CTA + 0.74, ug = rango(t, tg1, tg1 + 0.4), um = rango(t, T_MAS, T_MAS + 0.3);
  E.globo.style.transform = `scale(${t < tg1 ? 0 : (1 + 0.5 * Math.sin(Math.PI * ug) * (1 - ug)) * (1 + 0.35 * Math.sin(Math.PI * um))})`;
  // cesta
  const hc = eout(rango(t, T_CESTA + 0.08, T_CESTA + 0.68));
  pon(E.velo, 0.42 * hc); E.hoja.style.transform = `translateY(${lerp(1100, 0, hc)}px)`;
  E.cantn.style.transform = E.total.style.transform = `scale(${1 + 0.22 * Math.sin(Math.PI * um)})`;
  dedos(t);
  // cierre
  pon(E.negro, Math.max(rango(t, T_NEGRO, T_NEGRO + 0.55), 1 - rango(t, 0, 0.3)));
  pon(E.cierre.children[0], visible(t, T_FRASE, T_FIRMA - 0.15, 0.3), `scale(${lerp(1.05, 1, eout(rango(t, T_FRASE, T_FRASE + 0.6)))})`);
  pon(E.cierre.children[1], rango(t, T_FIRMA, T_FIRMA + 0.6), `scale(${lerp(0.94, 1, eout(rango(t, T_FIRMA, T_FIRMA + 0.9)))})`);
}
function pintaT(t) { const st = estadoT(t); if (t < T_NEGRO + 0.6) dibuja(st); interfazT(t, st); }

// ───────────────────────── arranque ─────────────────────────
for (let i = VARIANTES.length - 1; i >= 0; i--) { variante(i); renderer.compile(scene, cam); }
window.META = { fps: FPS, duracion: DUR, fotogramas: Math.round(DUR * FPS) };
if (CAPTURA || AUTO) {
  GUION = mideGuion();
  window.pintaFrame = (n) => { pintaT(n / FPS); renderer.getContext().finish(); return true; };
  window.pintaT = (t) => { pintaT(t); renderer.getContext().finish(); return true; };
  if (AUTO) { addEventListener('resize', () => { encaja(); ajustaRender(); }); const t0 = performance.now(); const bucle = () => { pintaT(((performance.now() - t0) / 1000) % DUR); requestAnimationFrame(bucle); }; bucle(); } else pintaT(0);
} else {
  // ── modo en vivo: la tienda funciona de verdad ──
  const L = { rot: HERO, rotV: 0, el: 12, zoom: 0, zoomObj: 0, v: 0, vAnt: 0, tv: -9, giro: 0, tg: -9, talla: 0, cant: 1, anadido: false, pagado: 0, abierta: false };
  E.hoja.style.transition = 'transform .45s cubic-bezier(.2,.8,.2,1)'; E.velo.style.transition = 'opacity .35s'; E.globo.style.transition = 'transform .3s cubic-bezier(.3,1.6,.5,1)';
  const refresca = () => { ui(L); E.globo.style.transform = `scale(${L.anadido ? 1 : 0})`; E.hoja.style.transform = `translateY(${L.abierta ? 0 : 1100}px)`; E.velo.style.opacity = L.abierta ? 0.42 : 0; E.velo.style.pointerEvents = L.abierta ? 'auto' : 'none'; };
  let arr = null;
  canvas.addEventListener('pointerdown', (e) => { arr = { x: e.clientX, y: e.clientY }; canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing'; });
  canvas.addEventListener('pointermove', (e) => { if (!arr) return; const dx = (e.clientX - arr.x) / K, dy = (e.clientY - arr.y) / K; arr = { x: e.clientX, y: e.clientY }; L.rotV = dx * 0.0062; L.rot += L.rotV; L.el = clamp(L.el + dy * 0.09, -4, 62); });
  const suelta = () => { arr = null; canvas.style.cursor = 'grab'; }; canvas.addEventListener('pointerup', suelta); canvas.addEventListener('pointercancel', suelta);
  canvas.addEventListener('wheel', (e) => { e.preventDefault(); L.zoomObj = clamp(L.zoomObj - e.deltaY * 0.0015); }, { passive: false });
  canvas.addEventListener('dblclick', () => { L.zoomObj = L.zoomObj > 0.5 ? 0 : 1; });
  btnColor.forEach((b, i) => b.addEventListener('click', () => { if (i === L.v) return; L.vAnt = L.v; L.v = i; L.tv = L.tg = performance.now() / 1000; refresca(); }));
  btnTalla.forEach((b) => b.addEventListener('click', () => { L.talla = +b.textContent; refresca(); }));
  E.cta.addEventListener('click', () => { if (!L.talla) L.talla = 42; L.anadido = true; refresca(); });
  $('#cesta-ico').addEventListener('click', () => { if (L.anadido) { L.abierta = true; refresca(); } });
  for (const el of [$('#cierra'), E.velo]) el.addEventListener('click', () => { L.abierta = false; refresca(); });
  $('#mas').addEventListener('click', () => { L.cant = Math.min(9, L.cant + 1); L.pagado = 0; refresca(); });
  $('#menos').addEventListener('click', () => { L.cant = Math.max(1, L.cant - 1); L.pagado = 0; refresca(); });
  E.pagar.addEventListener('click', () => { if (L.pagado) return; L.pagado = 1; refresca(); setTimeout(() => { L.pagado = 2; refresca(); }, 800); });
  addEventListener('resize', () => { encaja(); ajustaRender(); });
  for (const k of ['nav', 'panel', 'gira']) E[k].style.opacity = 1; E.palabra.style.opacity = 0.5;
  refresca();
  const bucle = () => { const t = performance.now() / 1000;
    if (!arr) { L.rot += L.rotV; L.rotV *= 0.94; }
    L.zoom += (L.zoomObj - L.zoom) * 0.12; const ug = rango(t, L.tg, L.tg + 0.95);
    const cambiado = t >= L.tv + 0.47;
    dibuja({ rot: L.rot + TAU * eio(ug), el: L.el, az: 0, zoom: L.zoom, v: cambiado ? L.v : L.vAnt, vAnt: cambiado ? L.vAnt : L.v, vMix: cambiado ? ss(rango(t, L.tv + 0.47, L.tv + 0.92)) : 1, pop: 1 + 0.06 * Math.sin(Math.PI * ug) * (ug < 1 ? 1 : 0), bob: 0.006 * Math.sin(t * 1.9) * (1 - L.zoom), off: lerp(330, 90, L.zoom) });
    E.panel.style.transform = `translateY(${820 * eio(L.zoom)}px)`;
    requestAnimationFrame(bucle); };
  bucle();
}
window.LISTO = true;
