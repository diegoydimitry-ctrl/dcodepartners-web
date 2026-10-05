// Tres webs 3D de demostración sobre un mismo motor (marcas ficticias): ?s=vela (zapatillas) · ?s=norda (mobiliario) · ?s=orien (relojería).
// En vivo funcionan de verdad: arrastrar para girar, rueda/doble clic para acercar, color, opciones y cesta.
// Para el vídeo: ?captura → window.pintaFrame(n) pinta el fotograma n del guion de esa web. ?auto lo reproduce en vivo.
// Modelos de glTF Sample Assets (Khronos), CC-BY 4.0: Shopify (zapatilla), Wayfair (sofá), Darmstadt Graphics Group (reloj, marcas retiradas). HDR: Poly Haven, CC0.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/addons/shaders/VerticalBlurShader.js';

const FPS = 30;
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

// ───────────────────────── las tres webs ─────────────────────────
// Todos los modelos se normalizan a ~0,30 de tamaño para compartir cámara. Guion: tiempos en segundos (pulso de 0,5 s).
const SITIOS = {
  vela: {
    tema: 't-vela', marca: 'VELA', palabra: 'UNO', palabraOp: 0.5, titulo: 'Vela Uno', sub: 'Malla transpirable', precio: 129, eti1: 'Color', eti2: 'Talla',
    opciones: ['39', '40', '41', '42', '43', '44'], opcionSel: 3, cta: 'Añadir a la cesta', ctaOk: 'Añadido ✓', confianza: ['Envío gratis', 'Devolución 30 días', 'Pago seguro'],
    modelo: 'zapatilla.glb', tam: 0.298, alt: 0.036, bob: 0.006, centroY: 0.074, macro: [0, 0.118, 0], D0: 1.26, DM: 0.5, hero: -0.55, el0: 12,
    sombra: { w: 0.86, alt: 0.34, op: 0.5, blur: 4.2 }, luz: 1.4, exp: 1.12, envRot: 0.6,
    variantes: [
      { gltf: 'beach', nombre: 'Rosa palo', muestra: '#b98087', fondo: ['#eef4f5', '#c3dae0'] },
      { gltf: 'midnight', nombre: 'Azul océano', muestra: '#1c7ea8', fondo: ['#f3f1ec', '#ddd5c6'] },
      { gltf: 'street', nombre: 'Negro coral', muestra: '#1b1c20', fondo: ['#f7f0ec', '#e9d3c8'] }],
    guion: { DUR: 6, giro: TAU, tGiro: 0.85,
      ROT: [[0, -0.55], [0.2, -0.5], [1.3, 2.6], [1.9, TAU - 0.55, eout], [3.9, TAU - 0.55], [4.7, TAU - 1.15], [5.2, TAU - 0.55, eio]],
      EL: [[0, 12], [3.5, 12], [4.1, 30, eio], [4.7, 40], [5.2, 12, eio]], AZ: [[0, 0], [3.5, 0], [4.1, 28, eio], [4.7, 14], [5.2, 0, eio]],
      ZOOM: [3.5, 4.1, 4.75, 5.2], TC: [[2.0, 1], [2.75, 2]], T_CTA: 5.4,
      ARR: [[0.2, 1.3, 230, 900, 860, 850, 1], [3.5, 4.0, 500, 800, 300, 560, 1], [3.5, 4.0, 590, 900, 800, 1150, 2]] },
  },
  norda: {
    tema: 't-norda', marca: 'norda', palabra: 'Alba', palabraOp: 0.6, titulo: 'Sofá Alba', sub: 'Terciopelo', precio: 1490, eti1: 'Tejido', eti2: 'Ver',
    opciones: ['Medidas', 'En tu salón'], opcionSel: -1, cta: 'Añadir a la cesta', ctaOk: 'Añadido ✓', confianza: ['Entrega y montaje', 'Hecho a medida', '5 años de garantía'],
    modelo: 'sofa.glb', tam: 2.188, alt: 0, bob: 0, centroY: 0.058, macro: [-0.02, 0.085, 0.02], D0: 1.3, DM: 0.42, hero: 0.5, el0: 13,
    sombra: { w: 0.62, alt: 0.2, op: 0.62, blur: 2.6 }, luz: 1.1, exp: 1.08, envRot: 0.6, medidas: [219, 102, 79],
    variantes: [
      { gltf: 'Pale Pink', nombre: 'Rosa empolvado', muestra: '#e3bcc0', fondo: ['#f6f1ea', '#e3d9cb'] },
      { gltf: 'Navy', nombre: 'Azul noche', muestra: '#1f3a78', fondo: ['#f3f1ec', '#d6d5cf'] },
      { gltf: 'Champagne', nombre: 'Champán', muestra: '#8a7458', fondo: ['#f6f1e8', '#e2d6c2'] },
      { gltf: 'Gray', nombre: 'Gris perla', muestra: '#9a9c9d', fondo: ['#f2f1ee', '#d9d7d1'] },
      { gltf: 'Black', nombre: 'Carbón', muestra: '#2a2a2c', fondo: ['#f4f0ea', '#dccfc0'] }],
    guion: { DUR: 6, giro: 0.5, tGiro: 0.45,
      ROT: [[0, 0.5], [0.2, 0.52], [1.2, -0.9], [1.7, -0.62, eout], [3.4, -0.62], [4.0, 0.42, eio], [4.9, 0.5], [5.5, 0.9, eio], [6, 1.0]],
      EL: [[0, 13], [3.4, 13], [4.0, 20, eio], [4.9, 20], [5.5, 34, eio]], AZ: [[0, 0], [6, 0]],
      ZOOM: [4.95, 5.6, 9, 9], TC: [[1.5, 1], [2.0, 2], [2.5, 3], [3.0, 4]], T_OPC: [3.5, 0], T_OPC_FIN: 4.85,
      ARR: [[0.2, 1.2, 840, 880, 260, 900, 1], [4.95, 5.5, 500, 800, 310, 580, 1], [4.95, 5.5, 590, 900, 790, 1130, 2]] },
  },
  orien: {
    tema: 't-orien', marca: 'ORIEN', palabra: 'Chrono', palabraOp: 0.09, titulo: 'Chrono 44', sub: 'Titanio', precio: 2450, eti1: 'Color', eti2: 'Caja',
    opciones: ['40 mm', '44 mm', 'Correa de carbono'], opcionSel: 1, cta: 'Reservar', ctaOk: 'Reservado ✓', confianza: ['Envío asegurado', 'Certificado', 'Garantía 5 años'],
    modelo: 'reloj.glb', tam: 5.816, alt: 0.03, bob: 0.004, centroY: 0.152, macro: [0, 0.152, 0.05], D0: 1.22, DM: 0.6, hero: -0.42, el0: 8, pivoteZ: 0.3,
    sombra: { w: 0.8, alt: 0.3, op: 0.55, blur: 4 }, luz: 2.0, exp: 1.15, envRot: 1.2, oscuro: true, reloj: true,
    variantes: [
      { gltf: 'Midnight Gold', nombre: 'Oro medianoche', muestra: '#c9a45c', fondo: ['#2b2a22', '#090a09'] },
      { gltf: 'Commerce Green', nombre: 'Verde bosque', muestra: '#2f6b46', fondo: ['#1f2b24', '#070a08'] },
      { gltf: 'Khronos Red', nombre: 'Rojo racing', muestra: '#b8262b', fondo: ['#2e2222', '#0a0808'] },
      { gltf: 'Surgical White', nombre: 'Blanco ártico', muestra: '#e9e9e6', fondo: ['#2a2d30', '#08090a'] }],
    guion: { DUR: 6, giro: 0.7, tGiro: 0.45,
      ROT: [[0, -0.42], [0.2, -0.4], [1.3, 0.62], [1.8, 0.4, eout], [3.4, 0.4], [4.1, -0.3, eio], [6, 0.22]],
      EL: [[0, 8], [3.4, 8], [4.1, 16, eio], [6, 10]], AZ: [[0, 0], [3.4, 0], [4.1, -8, eio], [6, 8]],
      ZOOM: [3.4, 4.1, 9, 9], TC: [[2.0, 1], [2.5, 2], [3.0, 0]], ENV: [[0, 1.2], [3.4, 1.6], [6, 4.4]],
      ARR: [[0.2, 1.3, 280, 760, 800, 720, 1], [3.4, 4.0, 500, 640, 300, 420, 1], [3.4, 4.0, 590, 740, 800, 980, 2], [4.5, 5.7, 720, 900, 420, 1000, 1]] },
  },
};
const ID = SITIOS[Q.get('s')] ? Q.get('s') : 'vela', C = SITIOS[ID], G = C.guion, VARIANTES = C.variantes;
document.body.classList.add(C.tema);

// ───────────────────────── render ─────────────────────────
const UI = $('#ui'), canvas = $('#gl');
let K = 1;
function encaja() { K = Math.min(innerWidth / 1080, innerHeight / 1920); UI.style.transform = `translate(-50%,-50%) scale(${K})`; }
encaja();
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: CAPTURA, powerPreference: 'high-performance' });
const ajustaRender = () => { renderer.setPixelRatio(CAPTURA ? +(Q.get('esc') ?? 1) : Math.min(K * devicePixelRatio, 2)); renderer.setSize(1080, 1920, false); };
ajustaRender();
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = +(Q.get('exp') ?? C.exp); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.setClearColor(0x000000, 0);
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(30, 1080 / 1920, 0.02, 20);
const env = await new RGBELoader().loadAsync('assets/estudio.hdr'); env.mapping = THREE.EquirectangularReflectionMapping;
scene.environment = env; scene.environmentIntensity = +(Q.get('envI') ?? 1.0); scene.environmentRotation.y = C.envRot;
const clave = new THREE.DirectionalLight(0xfff4e8, +(Q.get('luz') ?? C.luz)); clave.position.set(-1.2, 2.4, 1.6); scene.add(clave);

const gltf = await new GLTFLoader().loadAsync('assets/' + C.modelo);
const zap = new THREE.Group(); scene.add(zap);
{ const b = new THREE.Box3().setFromObject(gltf.scene), c = b.getCenter(new THREE.Vector3()), k = 0.298 / C.tam; const caja = new THREE.Group();
  gltf.scene.position.set(-c.x, -b.min.y, -(C.pivoteZ ?? c.z)); caja.add(gltf.scene); caja.scale.setScalar(k); zap.add(caja);
  C.caja = { x: (b.max.x - b.min.x) * k / 2, y: (b.max.y - b.min.y) * k, z0: (b.min.z - (C.pivoteZ ?? c.z)) * k, z1: (b.max.z - (C.pivoteZ ?? c.z)) * k }; }
const nombresVar = (gltf.userData.gltfExtensions?.KHR_materials_variants?.variants || []).map((v) => v.name);
const mallasVar = [], porNombre = {}; gltf.scene.traverse((o) => { if (o.name) porNombre[o.name] = o; });
{ const tareas = [];
  gltf.scene.traverse((o) => { const map = o.isMesh && o.userData.gltfExtensions?.KHR_materials_variants?.mappings; if (!map) return;
    o.userData.var = []; mallasVar.push(o);
    for (const m of map) for (const v of m.variants) tareas.push(gltf.parser.getDependency('material', m.material).then((mat) => { o.userData.var[v] = mat; })); });
  await Promise.all(tareas);
  const maxA = renderer.capabilities.getMaxAnisotropy(), mats = new Set();
  gltf.scene.traverse((o) => { if (!o.isMesh) return; for (const m of [o.material, ...(o.userData.var || [])]) if (m) { mats.add(m); for (const k of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap']) if (m[k]) m[k].anisotropy = maxA; } });
  if (C.reloj) {      // esfera sin marcas de terceros; tapa y cierre sin logotipos
    const img = await new THREE.ImageLoader().loadAsync('assets/esfera.png');
    const orm = await new THREE.ImageLoader().loadAsync('assets/esfera-orm.png');
    for (const m of mats) { if (m.name === 'Watch Face' && m.map) { const t = m.map.clone(); t.image = img; t.needsUpdate = true; m.map = t;
        const t2 = m.roughnessMap.clone(); t2.image = orm; t2.needsUpdate = true; m.roughnessMap = m.metalnessMap = t2; if (m.aoMap) m.aoMap = t2; }
      if (m.transmission > 0) { m.transmission = 0; m.transparent = true; m.opacity = 0.1; m.depthWrite = false; m.color.set(0xffffff); m.roughness = 0.02; m.metalness = 0; m.envMapIntensity = 1.6; m.needsUpdate = true; }
      if (/Backplate|Clasp/.test(m.name)) { m.map = null; m.color.set(0x1a1b1d); m.metalness = 1; m.roughness = 0.35; m.needsUpdate = true; } } } }
let varActual = -1;
function variante(i) { if (i === varActual) return; varActual = i; const g = nombresVar.indexOf(VARIANTES[i].gltf);
  for (const o of mallasVar) if (o.userData.var[g]) { o.material = o.userData.var[g]; gltf.parser.assignFinalMaterial(o); } }
// agujas del reloj: el segundero avanza de verdad
const AGUJAS = C.reloj ? ['Hand Hours', 'Hand Minutes', 'Hand Seconds'].map((n) => porNombre[n.replace(/ /g, '_')] || porNombre[n]).map((o) => o && { o, q0: o.quaternion.clone() }) : [];
const qA = new THREE.Quaternion(), EJE_Z = new THREE.Vector3(0, 0, 1);
function agujas(t) { if (!AGUJAS[2]) return; const paso = Math.floor(t * 2) / 2 + eout(((t * 2) % 1) * 3) / 2;      // tic cada medio segundo
  AGUJAS[2].o.quaternion.copy(qA.setFromAxisAngle(EJE_Z, -paso * 6 * D2R)).multiply(AGUJAS[2].q0); }

// ── sombra de contacto ──
const S = C.sombra, SUELO = C.alt ? -0.012 : -0.0008;
const sg = new THREE.Group(); sg.position.y = SUELO; scene.add(sg);
const rtS = new THREE.WebGLRenderTarget(512, 512); rtS.texture.generateMipmaps = false; const rtB = rtS.clone();
const pg = new THREE.PlaneGeometry(S.w, S.w).rotateX(Math.PI / 2);
const planoS = new THREE.Mesh(pg, new THREE.MeshBasicMaterial({ map: rtS.texture, opacity: S.op, transparent: true, depthWrite: false, toneMapped: false })); planoS.renderOrder = 1; planoS.scale.y = -1; sg.add(planoS);
const planoB = new THREE.Mesh(pg); planoB.visible = false; sg.add(planoB);
const camS = new THREE.OrthographicCamera(-S.w / 2, S.w / 2, S.w / 2, -S.w / 2, 0, S.alt); camS.rotation.x = Math.PI / 2; sg.add(camS);
const matD = new THREE.MeshDepthMaterial(); matD.userData.darkness = { value: 1.25 }; matD.depthTest = false; matD.depthWrite = false;
matD.onBeforeCompile = (sh) => { sh.uniforms.darkness = matD.userData.darkness;
  sh.fragmentShader = 'uniform float darkness;\n' + sh.fragmentShader.replace('gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );', 'gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );'); };
const matH = new THREE.ShaderMaterial(HorizontalBlurShader), matV = new THREE.ShaderMaterial(VerticalBlurShader); matH.depthTest = matV.depthTest = false;
function desenfoca(a) { planoB.visible = true;
  planoB.material = matH; matH.uniforms.tDiffuse.value = rtS.texture; matH.uniforms.h.value = a / 256; renderer.setRenderTarget(rtB); renderer.render(planoB, camS);
  planoB.material = matV; matV.uniforms.tDiffuse.value = rtB.texture; matV.uniforms.v.value = a / 256; renderer.setRenderTarget(rtS); renderer.render(planoB, camS); planoB.visible = false; }
function sombra() { planoS.visible = false; scene.overrideMaterial = matD; renderer.setRenderTarget(rtS); renderer.clear(); renderer.render(scene, camS); scene.overrideMaterial = null;
  desenfoca(S.blur); desenfoca(S.blur * 0.4); renderer.setRenderTarget(null); planoS.visible = true; }

// ── estado → imagen ──
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mezcla = (a, b, u) => { const A = hex(a), B = hex(b); return `rgb(${A.map((x, i) => Math.round(lerp(x, B[i], u))).join(',')})`; };
const E = Object.fromEntries(['fondo', 'palabra', 'nav', 'gira', 'panel', 'vuela', 'dedo1', 'dedo2', 'cta', 'globo', 'colornombre', 'medidas'].map((k) => [k, $('#' + k)]));
const CENTRO = new THREE.Vector3(0, C.alt + C.centroY, 0), MACRO = new THREE.Vector3(C.macro[0], C.alt + C.macro[1], C.macro[2]);
const tg = new THREE.Vector3(), OFF = 330, OFFM = 90;
// st: { rot, el (°), az (°), zoom 0..1, v, vAnt, vMix, pop, bob, off, env?, med 0..1, t }
function dibuja(st) {
  variante(st.v);
  zap.rotation.y = st.rot; zap.position.y = C.alt + st.bob; zap.scale.setScalar(st.pop);
  if (st.env !== undefined) scene.environmentRotation.y = st.env;
  agujas(st.t ?? 0);
  tg.lerpVectors(CENTRO, MACRO, st.zoom); const d = lerp(C.D0, C.DM, st.zoom) * (1 + 0.13 * ss(st.med || 0)), el = st.el * D2R, az = st.az * D2R;
  cam.position.set(tg.x + d * Math.sin(az) * Math.cos(el), tg.y + d * Math.sin(el), tg.z + d * Math.cos(az) * Math.cos(el)); cam.lookAt(tg);
  cam.setViewOffset(1080, 1920, 0, st.off, 1080, 1920); cam.updateMatrixWorld();
  planoS.material.opacity = S.op * (1 - 0.75 * st.zoom);
  sombra(); renderer.render(scene, cam);
  const a = VARIANTES[st.vAnt].fondo, b = VARIANTES[st.v].fondo, u = st.vMix, cy = (960 - st.off) / 19.2;
  E.fondo.style.background = `radial-gradient(95% 52% at 50% ${cy.toFixed(1)}%, ${mezcla(a[0], b[0], u)} 0%, ${mezcla(a[0], b[0], u)} ${C.oscuro ? 0 : 22}%, ${mezcla(a[1], b[1], u)} 100%)`;
  if (C.medidas) medidas(st.med || 0);
}
// cotas del sofá: líneas 3D proyectadas a pantalla
const NS = 'http://www.w3.org/2000/svg', pv = new THREE.Vector3();
const proy = (x, y, z) => { pv.set(x, y, z).applyMatrix4(zap.matrixWorld).project(cam); return [(pv.x * 0.5 + 0.5) * 1080, (-pv.y * 0.5 + 0.5) * 1920]; };
let COTAS = null;
function medidas(u) {
  if (!COTAS) { COTAS = [0, 1, 2].map(() => { const g = document.createElementNS(NS, 'g'); g.innerHTML = '<line/><circle r="7"/><circle r="7"/><rect rx="26" height="52"/><text></text>'; E.medidas.appendChild(g); return g; }); }
  zap.updateMatrixWorld(); const { x, y, z0, z1 } = C.caja, m = 0.03;
  const L = [[[-x, 0, z1 + m], [x, 0, z1 + m]], [[x + m, 0, z0], [x + m, 0, z1]], [[-x - m, 0, z0 + 0.02], [-x - m, y, z0 + 0.02]]];
  COTAS.forEach((g, i) => { const k = eout(rango(u, i * 0.22, i * 0.22 + 0.5)); g.style.opacity = k > 0 ? 1 : 0; if (k <= 0) return;
    const A = proy(...L[i][0]), B0 = proy(...L[i][1]), B = [lerp(A[0], B0[0], k), lerp(A[1], B0[1], k)], [ln, c1, c2, r, tx] = g.children;
    ln.setAttribute('x1', A[0]); ln.setAttribute('y1', A[1]); ln.setAttribute('x2', B[0]); ln.setAttribute('y2', B[1]);
    c1.setAttribute('cx', A[0]); c1.setAttribute('cy', A[1]); c2.setAttribute('cx', B[0]); c2.setAttribute('cy', B[1]);
    const mx = (A[0] + B0[0]) / 2, my = (A[1] + B0[1]) / 2, o = rango(k, 0.55, 1), w = 168; tx.textContent = C.medidas[i] + ' cm';
    r.setAttribute('x', mx - w / 2); r.setAttribute('y', my - 26); r.setAttribute('width', w); tx.setAttribute('x', mx); tx.setAttribute('y', my + 1); r.style.opacity = tx.style.opacity = o; });
}

// miniatura para «a la cesta»
const MINI = [];
if (G.T_CTA !== undefined || !CAPTURA) { const c2 = document.createElement('canvas'); c2.width = c2.height = 460; const x = c2.getContext('2d');
  for (let i = 0; i < VARIANTES.length; i++) { dibuja({ rot: C.hero, el: 16, az: 0, zoom: 0, v: i, vAnt: i, vMix: 1, pop: 1, bob: 0, off: 0 });
    const w = canvas.width, h = canvas.height, lado = w * 0.92; x.clearRect(0, 0, 460, 460); x.drawImage(canvas, (w - lado) / 2, h / 2 - lado * 0.47, lado, lado, 0, 0, 460, 460); MINI.push(c2.toDataURL('image/png')); } }

// ───────────────────────── interfaz ─────────────────────────
const euros = (n) => n.toLocaleString('es-ES', { useGrouping: 'always' }) + ' €';
$('.marca').textContent = C.marca; E.palabra.textContent = C.palabra; $('h1').textContent = C.titulo; $('#subfijo').textContent = C.sub; $('.precio').textContent = euros(C.precio);
$('#eti1').textContent = C.eti1; $('#eti2').textContent = C.eti2; $('.confianza').innerHTML = C.confianza.map((x) => `<span>${x}</span>`).join('<i></i>');
$('#colores').innerHTML = VARIANTES.map((v) => `<button style="--c:${v.muestra}"></button>`).join(''); $('#opciones').innerHTML = C.opciones.map((o) => `<button>${o}</button>`).join('');
const btnColor = $$('#colores button'), btnOpc = $$('#opciones button');
function ui({ v, opc, anadido }) {
  btnColor.forEach((b, i) => b.classList.toggle('sel', i === v)); btnOpc.forEach((b, i) => b.classList.toggle('sel', i === opc));
  E.colornombre.textContent = VARIANTES[v].nombre; if (MINI[v] && E.vuela.dataset.v !== String(v)) { E.vuela.src = MINI[v]; E.vuela.dataset.v = v; }
  E.cta.classList.toggle('ok', !!anadido); E.cta.firstChild.textContent = anadido ? C.ctaOk : C.cta;
}
const pon = (el, o, tr) => { el.style.opacity = o.toFixed(3); if (tr !== undefined) el.style.transform = tr; };
const centro = (el) => { const r = el.getBoundingClientRect(), u = UI.getBoundingClientRect(); return [(r.left + r.width / 2 - u.left) / K, (r.top + r.height / 2 - u.top) / K]; };

// ───────────────────────── guion (vídeo) ─────────────────────────
const claves = (K_, t, f = ss) => { if (t <= K_[0][0]) return K_[0][1]; for (let i = 0; i < K_.length - 1; i++) { const [ta, va] = K_[i], [tb, vb, fb] = K_[i + 1]; if (t <= tb) return lerp(va, vb, (fb || f)(rango(t, ta, tb))); } return K_[K_.length - 1][1]; };
const TC = G.TC || [], T_CTA = G.T_CTA ?? 99, T_OPC = G.T_OPC || [99, -1], T_OPC_FIN = G.T_OPC_FIN ?? 99, Z = G.ZOOM;
function estadoT(t) {
  let rot = claves(G.ROT, t), v = 0, vAnt = 0, tv = -9, pop = 1;
  for (const [tc, i] of TC) { const u = rango(t, tc, tc + G.tGiro), sw = tc + G.tGiro * 0.42; if (G.giro === TAU) rot += TAU * eio(u); else if (u > 0 && u < 1) rot += G.giro * Math.sin(Math.PI * u) * (1 - u);
    if (u > 0 && u < 1) pop = 1 + 0.05 * Math.sin(Math.PI * u); if (t >= sw) { vAnt = v; v = i; tv = sw; } }
  const zoom = eio(rango(t, Z[0], Z[1])) * (1 - eio(rango(t, Z[2], Z[3])));
  const med = t >= T_OPC[0] && T_OPC_FIN < 99 ? rango(t, T_OPC[0] + 0.05, T_OPC[0] + 1.0) * (1 - rango(t, T_OPC_FIN, T_OPC_FIN + 0.12)) : 0;
  return { rot, el: claves(G.EL, t), az: claves(G.AZ, t), zoom, v, vAnt, vMix: ss(rango(t, tv, tv + 0.35)), pop, bob: C.bob * Math.sin(t * 1.9 + 1) * (1 - zoom), off: lerp(OFF, OFFM, zoom), env: G.ENV ? claves(G.ENV, t) : undefined, med, t };
}
let ARR = [], TOQ = [], P_ICO = [994, 108];
function mideGuion() { ARR = G.ARR || []; P_ICO = centro($('#cesta-ico'));
  TOQ = [...TC.map(([t, i]) => [t, ...centro(btnColor[i])]), ...(T_CTA < 99 ? [[T_CTA, ...centro(E.cta)]] : []), ...(T_OPC[0] < 99 ? [[T_OPC[0], ...centro(btnOpc[T_OPC[1]])]] : [])]; }
function dedos(t) {
  const d = [{ o: 0, x: 0, y: 0, s: 1 }, { o: 0, x: 0, y: 0, s: 1 }];
  for (const [a, b, x0, y0, x1, y1, n] of ARR) { const o = Math.min(rango(t, a - 0.16, a - 0.02), 1 - rango(t, b + 0.02, b + 0.18)); if (o <= 0) continue; const u = ss(rango(t, a, b));
    d[n - 1] = { o, x: lerp(x0, x1, u), y: lerp(y0, y1, u), s: lerp(1.28, 1, eout(rango(t, a - 0.16, a))) + 0.25 * rango(t, b, b + 0.18) }; }
  for (const [tt, x, y] of TOQ) { const o = Math.min(rango(t, tt - 0.3, tt - 0.14), 1 - rango(t, tt + 0.12, tt + 0.3)); if (o <= 0) continue; const ent = eout(rango(t, tt - 0.3, tt - 0.03));
    d[0] = { o, x: x + 50 * (1 - ent), y: y + 70 * (1 - ent), s: t < tt ? lerp(1.3, 1, ent) : lerp(0.8, 1.15, rango(t, tt, tt + 0.25)) }; }
  [E.dedo1, E.dedo2].forEach((el, i) => pon(el, d[i].o, `translate(${d[i].x.toFixed(1)}px,${d[i].y.toFixed(1)}px) scale(${d[i].s.toFixed(3)})`));
}
function interfazT(t, st) {
  let v = 0; for (const [tc, i] of TC) if (t >= tc) v = i;
  ui({ v, opc: t >= T_OPC[0] && t < T_OPC_FIN ? T_OPC[1] : C.opcionSel, anadido: t >= T_CTA + 0.05 });
  const fuera = st.zoom;
  pon(E.nav, 1); pon(E.palabra, C.palabraOp * (1 - fuera) * (1 - 0.7 * (st.med > 0 ? 1 : 0)), `scale(${1 + 0.25 * fuera})`);
  pon(E.panel, 1, `translateY(${820 * eio(fuera)}px)`); pon(E.gira, visible(t, -1, 1.6, 0.3) , 'translateX(-50%)');
  E.cta.style.transform = `scale(${t > T_CTA && t < T_CTA + 0.14 ? 0.97 : 1})`;
  const uv = rango(t, T_CTA + 0.08, T_CTA + 0.52), [ix, iy] = P_ICO, e = eio(uv);
  pon(E.vuela, uv > 0 && uv < 1 ? Math.min(1, uv * 6) * (1 - rango(uv, 0.86, 1)) : 0, `translate(${lerp(540, ix, e) - 130}px,${lerp(700, iy, e) - 130 - 180 * Math.sin(Math.PI * e)}px) scale(${lerp(2.2, 0.22, e)})`);
  const tg1 = T_CTA + 0.5, ug = rango(t, tg1, tg1 + 0.35); E.globo.style.transform = `scale(${t < tg1 ? 0 : 1 + 0.5 * Math.sin(Math.PI * ug) * (1 - ug)})`;
  dedos(t);
}
function pintaT(t) { const st = estadoT(t); dibuja(st); interfazT(t, st); }

// ───────────────────────── arranque ─────────────────────────
for (let i = VARIANTES.length - 1; i >= 0; i--) { variante(i); renderer.compile(scene, cam); }
window.META = { fps: FPS, duracion: G.DUR, fotogramas: Math.round(G.DUR * FPS), sitio: ID };
if (CAPTURA || AUTO) {
  mideGuion();
  window.pintaFrame = (n) => { pintaT(n / FPS); renderer.getContext().finish(); return true; };
  window.pintaT = (t) => { pintaT(t); renderer.getContext().finish(); return true; };
  if (AUTO) { addEventListener('resize', () => { encaja(); ajustaRender(); }); const t0 = performance.now(); const bucle = () => { pintaT(((performance.now() - t0) / 1000) % G.DUR); requestAnimationFrame(bucle); }; bucle(); } else pintaT(0);
} else {
  // ── en vivo ──
  const L = { rot: C.hero, rotV: 0, el: C.el0, zoom: 0, zoomObj: 0, v: 0, vAnt: 0, tv: -9, opc: C.opcionSel, anadido: false, med: 0 };
  E.globo.style.transition = 'transform .3s cubic-bezier(.3,1.6,.5,1)';
  const refresca = () => { ui(L); E.globo.style.transform = `scale(${L.anadido ? 1 : 0})`; };
  let arr = null;
  canvas.addEventListener('pointerdown', (e) => { arr = { x: e.clientX, y: e.clientY }; canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing'; });
  canvas.addEventListener('pointermove', (e) => { if (!arr) return; const dx = (e.clientX - arr.x) / K, dy = (e.clientY - arr.y) / K; arr = { x: e.clientX, y: e.clientY }; L.rotV = dx * 0.0062; L.rot += L.rotV; L.el = clamp(L.el + dy * 0.09, -4, 62); });
  const suelta = () => { arr = null; canvas.style.cursor = 'grab'; }; canvas.addEventListener('pointerup', suelta); canvas.addEventListener('pointercancel', suelta);
  canvas.addEventListener('wheel', (e) => { e.preventDefault(); L.zoomObj = clamp(L.zoomObj - e.deltaY * 0.0015); }, { passive: false });
  canvas.addEventListener('dblclick', () => { L.zoomObj = L.zoomObj > 0.5 ? 0 : 1; });
  btnColor.forEach((b, i) => b.addEventListener('click', () => { if (i === L.v) return; L.vAnt = L.v; L.v = i; L.tv = performance.now() / 1000; refresca(); }));
  btnOpc.forEach((b, i) => b.addEventListener('click', () => { L.opc = C.medidas && L.opc === i ? -1 : i; refresca(); }));
  E.cta.addEventListener('click', () => { L.anadido = !L.anadido; refresca(); });
  addEventListener('resize', () => { encaja(); ajustaRender(); });
  E.palabra.style.opacity = C.palabraOp; refresca();
  const bucle = () => { const t = performance.now() / 1000;
    if (!arr) { L.rot += L.rotV; L.rotV *= 0.94; }
    L.zoom += (L.zoomObj - L.zoom) * 0.12; L.med += ((C.medidas && L.opc === 0 ? 1 : 0) - L.med) * 0.08;
    const u = rango(t, L.tv, L.tv + G.tGiro), cambiado = t >= L.tv + G.tGiro * 0.42;
    dibuja({ rot: L.rot + (G.giro === TAU ? TAU * eio(u) : (u < 1 ? G.giro * Math.sin(Math.PI * u) * (1 - u) : 0)), el: L.el, az: 0, zoom: L.zoom, v: cambiado ? L.v : L.vAnt, vAnt: cambiado ? L.vAnt : L.v,
      vMix: cambiado ? ss(rango(t, L.tv + G.tGiro * 0.42, L.tv + G.tGiro * 0.42 + 0.4)) : 1, pop: 1 + 0.05 * Math.sin(Math.PI * u) * (u < 1 ? 1 : 0), bob: C.bob * Math.sin(t * 1.9) * (1 - L.zoom), off: lerp(OFF, OFFM, L.zoom), med: L.med, t });
    E.panel.style.transform = `translateY(${820 * eio(L.zoom)}px)`;
    requestAnimationFrame(bucle); };
  bucle();
}
window.LISTO = true;
