/* ==========================================================================
   D-CODE · «EL SISTEMA» · la escena de la portada
   --------------------------------------------------------------------------
   Un plató blanco y muy pocas cosas. El píxel azul de la marca es una unidad
   de trabajo (un pedido, una factura, un mensaje). Al principio está solo en
   un tramo de carril que no lleva a ninguna parte. Alrededor hay cuatro
   piezas de aluminio, cada una por su lado: personas, procesos, datos y
   herramientas. Al avanzar, las piezas llegan desde distintas profundidades,
   se alinean, los carriles se unen y el píxel las atraviesa; después pasan
   muchos, solos; una lente los lee; Finance los registra; y el carril se
   cierra en un circuito al que se suma una pieza con el nombre de tu empresa.
   three.js con materiales físicos, un plató de luz propio y sombras suaves.
   ========================================================================== */
import { WebGLRenderer, Scene, Group, PerspectiveCamera, Mesh, InstancedMesh, Color, Vector3, Matrix4, Quaternion, Euler, PlaneGeometry, BoxGeometry, CylinderGeometry, TorusGeometry, SphereGeometry, ExtrudeGeometry, Shape, Path, MeshStandardMaterial, MeshPhysicalMaterial, MeshBasicMaterial, DirectionalLight, PMREMGenerator, CanvasTexture, RepeatWrapping, SRGBColorSpace, NoToneMapping, VSMShadowMap, BackSide, DoubleSide, Float32BufferAttribute, LinearFilter, DynamicDrawUsage } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { crearRevelado } from "./revelado.js";

export const CAPITULOS = ["inicio", "hoy", "sistema", "automatizacion", "inteligencia", "finance", "resultado", "demos", "tuyo"];
export const PIEZAS = ["personas", "procesos", "datos", "herramientas"];
export const hayWebGL2 = () => { try { return !!document.createElement("canvas").getContext("webgl2"); } catch (e) { return false; } };
const fijar = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v), mezcla = (a, b, t) => a + (b - a) * t, suave = (a, b, x) => { const t = fijar((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const sale = (t) => 1 - Math.pow(1 - t, 3), TAU = Math.PI * 2;

const FONDO = 0xf3f2ef, ALTO = 0.62;          // color del plató · altura del carril
const PASO = 2.7;                              // de pieza a pieza
const X = { personas: 0, procesos: PASO, datos: PASO * 2, herramientas: PASO * 3, lente: PASO * 4.15, finance: PASO * 5.3 };
const FIN_RECTA = PASO * 6.2, RADIO = 2.3;     // donde el carril gira para volver
const TUYO = { x: PASO * 2.6, z: -RADIO * 2 };

/* El carril es un circuito: recta de ida (z = 0), media vuelta, recta de vuelta (z = −2R) y otra media vuelta. s: metros desde el principio. */
const X0 = -1.35, L_RECTA = FIN_RECTA - X0, L_CURVA = Math.PI * RADIO, L_TOTAL = L_RECTA * 2 + L_CURVA * 2;
function enCarril(s, o) {
  s = ((s % L_TOTAL) + L_TOTAL) % L_TOTAL;
  if (s < L_RECTA) { o.x = X0 + s; o.z = 0; o.a = 0; }
  else if (s < L_RECTA + L_CURVA) { const a = (s - L_RECTA) / RADIO; o.x = FIN_RECTA + Math.sin(a) * RADIO; o.z = -RADIO + Math.cos(a) * RADIO; o.a = a; }
  else if (s < L_RECTA * 2 + L_CURVA) { o.x = FIN_RECTA - (s - L_RECTA - L_CURVA); o.z = -RADIO * 2; o.a = Math.PI; }
  else { const a = (s - L_RECTA * 2 - L_CURVA) / RADIO; o.x = X0 - Math.sin(a) * RADIO; o.z = -RADIO - Math.cos(a) * RADIO; o.a = Math.PI + a; }
  return o;
}
const sDe = (x) => x - X0;

/* Los planos. p: cámara · m: adónde mira · fov · d: desplazamiento del encuadre · foco/ab: desenfoque.
   unido: cuántas piezas están en su sitio (0…4) · carril: hasta dónde llega el carril construido (m) · ritmo: píxeles por segundo · lente, finance, circuito, tuyo: 0…1 */
const PLANOS = [
  { h: { p: [4.6, 2.3, 7.4], m: [0.3, 0.62, 0], fov: 22, d: [0.24, 0.0], ab: 0.5 }, v: { p: [-1.6, 2.0, 6.4], m: [0, 0.75, 0], fov: 34, d: [0, 0.2], ab: 0.4 }, unido: 0, carril: 0, ritmo: 0, lente: 0, finance: 0, circuito: 0, tuyo: 0, lejos: 0 },
  { h: { p: [-4.2, 4.4, 12.5], m: [4.1, 0.9, -0.4], fov: 30, d: [0.19, 0], ab: 0.16 }, v: { p: [1.5, 6.5, 17.5], m: [4.1, 1.6, -0.5], fov: 44, d: [0, 0.2], ab: 0.1 }, unido: 0, carril: 0, ritmo: 0, lente: 0, finance: 0, circuito: 0, tuyo: 0, lejos: 1 },
  { h: { p: [-1.6, 2.5, 10.6], m: [4.15, 0.75, 0], fov: 30, d: [0.2, 0.02], ab: 0.2 }, v: { p: [4.1, 4.4, 16], m: [4.1, 1.0, 0], fov: 44, d: [0, 0.22], ab: 0.1 }, unido: 4, carril: sDe(X.herramientas) + 1.5, ritmo: 0.42, lente: 0, finance: 0, circuito: 0, tuyo: 0, lejos: 1 },
  { h: { p: [12.4, 1.7, 7.6], m: [4.6, 0.66, 0], fov: 24, d: [0.22, 0], ab: 0.42 }, v: { p: [10.2, 2.0, 7.4], m: [5.0, 0.8, 0], fov: 40, d: [0, 0.2], ab: 0.3 }, unido: 4, carril: sDe(X.herramientas) + 1.5, ritmo: 1.7, lente: 0, finance: 0, circuito: 0, tuyo: 0, lejos: 1 },
  { h: { p: [X.lente + 4.4, 2.0, 7.0], m: [X.lente - 0.3, 0.7, 0], fov: 22, d: [0.24, 0.0], ab: 0.5 }, v: { p: [X.lente - 0.6, 2.3, 7.6], m: [X.lente, 0.85, 0], fov: 36, d: [0, 0.2], ab: 0.35 }, unido: 4, carril: sDe(X.lente) + 1.5, ritmo: 0.8, lente: 1, finance: 0, circuito: 0, tuyo: 0, lejos: 1 },
  { h: { p: [X.finance - 2.2, 1.9, 8.2], m: [X.finance + 0.1, 0.78, 0], fov: 22, d: [0.25, 0.0], ab: 0.5 }, v: { p: [X.finance - 0.8, 2.2, 6.6], m: [X.finance, 0.9, 0], fov: 36, d: [0, 0.2], ab: 0.35 }, unido: 4, carril: sDe(X.finance) + 1.5, ritmo: 0, lente: 1, finance: 1, circuito: 0, tuyo: 0, lejos: 1 },
  { h: { p: [4.0, 15.5, 7.2], m: [8.0, 0, -2.5], fov: 34, d: [0.17, 0], ab: 0.05 }, v: { p: [8.0, 26, 3.5], m: [8.0, 0, -2.3], fov: 44, d: [0, 0.18], ab: 0.03 }, unido: 4, carril: L_TOTAL, ritmo: 1.4, lente: 1, finance: 1, circuito: 1, tuyo: 0, lejos: 1 },
  { h: { p: [4.0, 19, 8.2], m: [8.0, 0, -2.5], fov: 34, d: [0, 0], ab: 0.05 }, v: { p: [8.0, 30, 4], m: [8.0, 0, -2.3], fov: 44, d: [0, 0], ab: 0.03 }, unido: 4, carril: L_TOTAL, ritmo: 1.4, lente: 1, finance: 1, circuito: 1, tuyo: 0, lejos: 1 },
  { h: { p: [TUYO.x - 2.2, 1.9, TUYO.z + 8.2], m: [TUYO.x + 0.1, 0.78, TUYO.z], fov: 22, d: [0.25, 0.0], ab: 0.45 }, v: { p: [TUYO.x - 0.6, 2.2, TUYO.z + 6.8], m: [TUYO.x, 0.9, TUYO.z], fov: 36, d: [0, 0.2], ab: 0.3 }, unido: 4, carril: L_TOTAL, ritmo: 1.0, lente: 1, finance: 1, circuito: 1, tuyo: 1, lejos: 1 },
];
/* Dónde espera cada pieza antes de unirse: lejos, alta, girada. Cada una llega desde un sitio distinto. */
const SUELTAS = { personas: { p: [0, 0, 0], r: [0, 0, 0] }, procesos: { p: [2.2, 2.3, -5.5], r: [0.5, -0.9, 0.35] }, datos: { p: [6.6, 0.0, 3.4], r: [0, 1.1, 0] }, herramientas: { p: [10.4, 3.4, -3.2], r: [-0.6, 0.7, -0.5] } };

/* ------------------------------------------------- el plató: de él salen los reflejos */
function plato(renderer) {
  const s = new Scene();
  const cupula = new SphereGeometry(50, 32, 16), col = new Float32Array(cupula.attributes.position.count * 3), pos = cupula.attributes.position;
  for (let i = 0; i < pos.count; i++) { const y = pos.getY(i) / 50, v = 0.16 + 0.34 * Math.pow(Math.max(0, y), 0.7) + 0.5 * Math.max(0, -y); /* abajo, el suelo blanco también se refleja */ col[i * 3] = v; col[i * 3 + 1] = v * 0.995; col[i * 3 + 2] = v * 0.985; }
  cupula.setAttribute("color", new Float32BufferAttribute(col, 3)); s.add(new Mesh(cupula, new MeshBasicMaterial({ vertexColors: true, side: BackSide })));
  const caja = (w, h, x, y, z, i) => { const m = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: new Color(i, i, i), side: DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m); };
  caja(30, 12, 0, 22, 6, 7.5);          // la gran caja de luz, arriba
  caja(5, 20, -22, 7, 8, 9);            // tira a la izquierda: el filo brillante de los cantos
  caja(4, 16, 22, 5, 2, 5);           // tira a la derecha
  caja(8, 8, 6, 3, 24, 0.05);           // una bandera negra de frente: da contraste al metal
  caja(30, 3, 0, -1, 20, 0.08);         // y otra baja: el canto inferior de las piezas se oscurece
  caja(12, 5, -6, 10, -22, 2.4);        // contraluz
  const pm = new PMREMGenerator(renderer), t = pm.fromScene(s, 0.02, 0.1, 120).texture; pm.dispose();
  s.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
  return t;
}
/* Aluminio cepillado: una textura de vetas finas que varía la rugosidad y da relieve */
function texturaCepillado() {
  const c = document.createElement("canvas"); c.width = 512; c.height = 512; const g = c.getContext("2d"); g.fillStyle = "#808080"; g.fillRect(0, 0, 512, 512);
  let s = 7; const azar = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < 2600; i++) { const y = azar() * 512, v = 96 + azar() * 70, a = 0.10 + azar() * 0.22; g.strokeStyle = `rgba(${v},${v},${v},${a})`; g.lineWidth = 0.4 + azar() * 1.1; g.beginPath(); const x = azar() * 512, l = 140 + azar() * 520; g.moveTo(x, y); g.lineTo(x + l, y); g.moveTo(x - 512, y); g.lineTo(x + l - 512, y); g.stroke(); }
  const t = new CanvasTexture(c); t.wrapS = t.wrapT = RepeatWrapping; t.anisotropy = 8; return t;
}

export function crearSistema(lienzo, op = {}) {
  let renderer;
  try { renderer = new WebGLRenderer({ canvas: lienzo, antialias: false, alpha: false, powerPreference: "high-performance", stencil: false }); } catch (e) { return null; }
  if (!renderer.capabilities.isWebGL2) { renderer.dispose(); return null; }
  const movil = !!op.movil, en = op.idioma === "en";
  renderer.setPixelRatio(1); renderer.toneMapping = NoToneMapping; renderer.shadowMap.enabled = true; renderer.shadowMap.type = VSMShadowMap;
  const fondo = new Color(FONDO).convertSRGBToLinear();
  renderer.setClearColor(fondo, 1);
  const escena = new Scene(); escena.background = fondo; escena.environment = plato(renderer); escena.environmentIntensity = 1.0;
  const camara = new PerspectiveCamera(28, 1, 0.2, 120);
  const revelado = crearRevelado(renderer, { muestras: op.muestras ?? (movil ? 0 : 4), tomas: op.tomas ?? (movil ? 12 : 30), nivelesHalo: 4 });
  revelado.U.uHalo.value = 0.16; revelado.U.uVineta.value = 0.0; revelado.U.uGrano.value = 0.012; revelado.U.uExposicion.value = 1; revelado.U.uSat.value = 1; revelado.U.uMaxDesenfoque.value = movil ? 10 : 16;

  // luz: un sol de plató alto, de lado, con sombra blanda; el resto lo pone el plató
  const sol = new DirectionalLight(0xffffff, 3.4); sol.castShadow = true; sol.shadow.mapSize.set(op.mapaSombra || (movil ? 1024 : 2048), op.mapaSombra || (movil ? 1024 : 2048)); sol.shadow.radius = 9; sol.shadow.blurSamples = 16; sol.shadow.bias = -0.0002; sol.shadow.normalBias = 0.03;
  const cs = sol.shadow.camera; cs.near = 1; cs.far = 60; escena.add(sol, sol.target);

  /* ------------------------------------------------------------ materiales */
  const tCep = texturaCepillado();
  const alu = new MeshStandardMaterial({ color: 0xc9cbcf, metalness: 1, roughness: 0.42, roughnessMap: tCep, bumpMap: tCep, bumpScale: 0.6 });
  const aluLiso = new MeshStandardMaterial({ color: 0xe6e7e9, metalness: 1, roughness: 0.2 });
  const acero = new MeshStandardMaterial({ color: 0xf2f3f5, metalness: 1, roughness: 0.08 });
  const oscuro = new MeshStandardMaterial({ color: 0x1b1c1f, metalness: 0.6, roughness: 0.42 });
  const blanco = new MeshStandardMaterial({ color: 0xf6f5f2, metalness: 0, roughness: 0.55 });
  const vidrio = new MeshPhysicalMaterial({ color: 0xcfe0f4, metalness: 0, roughness: 0.03, transparent: true, opacity: 0.3, envMapIntensity: 1.6, clearcoat: 1, clearcoatRoughness: 0.02, side: DoubleSide, depthWrite: false });
  const azul = new MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.2 });
  const azulFijo = new MeshPhysicalMaterial({ color: 0x1746e0, emissive: 0x0b2bd6, emissiveIntensity: 0.55, metalness: 0, roughness: 0.14, clearcoat: 1, transparent: true, opacity: 0.9 });
  const matSuelo = new MeshStandardMaterial({ color: 0xcfcecb, metalness: 0, roughness: 0.92, envMapIntensity: 0.25 });
  // el suelo se funde con el fondo a lo lejos: no hay horizonte
  matSuelo.onBeforeCompile = (sh) => { sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vMundo;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvMundo = (modelMatrix * vec4(position, 1.0)).xyz;"); sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vMundo;").replace("#include <dithering_fragment>", `#include <dithering_fragment>\n float lej = smoothstep(9.0, 30.0, length(vMundo - cameraPosition)); gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(${fondo.r.toFixed(4)}, ${fondo.g.toFixed(4)}, ${fondo.b.toFixed(4)}), lej);`); };
  const suelo = new Mesh(new PlaneGeometry(400, 400), matSuelo); suelo.rotation.x = -Math.PI / 2; suelo.receiveShadow = true; escena.add(suelo);

  const hacer = (geo, mat, padre, p = [0, 0, 0], r = [0, 0, 0]) => { const m = new Mesh(geo, mat); m.position.set(p[0], p[1], p[2]); m.rotation.set(r[0], r[1], r[2]); m.castShadow = true; m.receiveShadow = true; padre.add(m); return m; };
  /* Un marco: placa de cantos redondeados con un hueco (redondo o rectangular), con bisel. Mira hacia +X (el carril lo atraviesa). */
  function marco(w, h, fondoZ, hueco, bisel = 0.035) {
    const r = 0.14, s = new Shape(), x = -w / 2, y = 0;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    const a = new Path(); if (hueco.r) a.absarc(0, hueco.y, hueco.r, 0, TAU, true); else { const hw = hueco.w / 2, hh = hueco.h / 2, q = 0.06, cy = hueco.y; a.moveTo(-hw + q, cy - hh); a.quadraticCurveTo(-hw, cy - hh, -hw, cy - hh + q); a.lineTo(-hw, cy + hh - q); a.quadraticCurveTo(-hw, cy + hh, -hw + q, cy + hh); a.lineTo(hw - q, cy + hh); a.quadraticCurveTo(hw, cy + hh, hw, cy + hh - q); a.lineTo(hw, cy - hh + q); a.quadraticCurveTo(hw, cy - hh, hw - q, cy - hh); a.lineTo(-hw + q, cy - hh); }
    s.holes.push(a);
    const g = new ExtrudeGeometry(s, { depth: fondoZ - bisel * 2, bevelEnabled: true, bevelThickness: bisel, bevelSize: bisel, bevelSegments: 4, curveSegments: 40 });
    g.translate(0, 0, -(fondoZ - bisel * 2) / 2); g.rotateY(Math.PI / 2);   // el hueco queda mirando a lo largo del carril
    return g;
  }
  const tramo = (largo, padre, x = 0) => { hacer(new RoundedBoxGeometry(largo, 0.05, 0.1, 2, 0.012), acero, padre, [x, ALTO - 0.14, 0]); const n = Math.max(1, Math.round(largo / 1.35)); for (let i = 0; i < n; i++) hacer(new CylinderGeometry(0.035, 0.05, ALTO - 0.165, 16), aluLiso, padre, [x - largo / 2 + (i + 0.5) * (largo / n), (ALTO - 0.165) / 2, 0]); };

  /* --------------------------------------------------------- las cuatro piezas */
  const piezas = {};
  { // personas: un marco con dos hojas que se abren cuando llega el trabajo
    const g = new Group(); hacer(marco(1.5, 1.42, 0.5, { w: 0.62, h: 0.62, y: ALTO }), alu, g); tramo(PASO, g);
    const hojaA = hacer(new RoundedBoxGeometry(0.06, 0.6, 0.31, 2, 0.012), aluLiso, g, [0, ALTO, 0.155]), hojaB = hacer(new RoundedBoxGeometry(0.06, 0.6, 0.31, 2, 0.012), aluLiso, g, [0, ALTO, -0.155]);
    piezas.personas = { g, hojaA, hojaB, x: X.personas };
  }
  { // procesos: un bloque con un aro pulido que da un paso cada vez
    const g = new Group(); hacer(marco(1.5, 1.42, 0.62, { r: 0.44, y: ALTO }), alu, g); tramo(PASO, g);
    const aro = new Group(); aro.position.set(0, ALTO, 0); g.add(aro); const t = hacer(new TorusGeometry(0.4, 0.035, 20, 72), acero, aro, [0, 0, 0], [0, Math.PI / 2, 0]);
    for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU; hacer(new CylinderGeometry(0.022, 0.022, 0.1, 10), i === 0 ? azulFijo : oscuro, aro, [0, Math.cos(a) * 0.4, Math.sin(a) * 0.4], [0, 0, Math.PI / 2]); }
    piezas.procesos = { g, aro, x: X.procesos };
  }
  { // datos: un bloque de vidrio donde cada trabajo deja su registro, una lámina azul
    const g = new Group(); hacer(new RoundedBoxGeometry(1.04, 0.16, 0.86, 3, 0.03), alu, g, [0, 0.08, 0]); tramo(PASO, g);
    const caja = hacer(new RoundedBoxGeometry(0.92, 1.22, 0.74, 4, 0.05), vidrio, g, [0, 0.16 + 0.61, 0]); caja.castShadow = false; caja.renderOrder = 5;
    hacer(new RoundedBoxGeometry(1.04, 0.07, 0.86, 3, 0.025), alu, g, [0, 1.41, 0]);
    const laminas = []; for (let i = 0; i < 9; i++) { const m = hacer(new BoxGeometry(0.66, 0.022, 0.5), azulFijo, g, [0, 0.9 + i * 0.05, 0]); m.castShadow = false; m.visible = false; laminas.push(m); }
    piezas.datos = { g, laminas, x: X.datos };
  }
  { // herramientas: un plato giratorio que encamina el trabajo
    const g = new Group(); hacer(new CylinderGeometry(0.72, 0.76, 0.2, 72), alu, g, [0, 0.1, 0]); tramo(PASO, g);
    const plato2 = new Group(); plato2.position.y = 0.2; g.add(plato2); hacer(new CylinderGeometry(0.6, 0.6, 0.12, 72), aluLiso, plato2, [0, 0.06, 0]);
    for (const z of [-0.33, 0.33]) hacer(new RoundedBoxGeometry(0.2, 0.74, 0.1, 2, 0.02), alu, plato2, [0, 0.49, z]);
    hacer(new RoundedBoxGeometry(0.2, 0.1, 0.76, 2, 0.02), alu, plato2, [0, 0.9, 0]);
    hacer(new CylinderGeometry(0.03, 0.03, 0.03, 16), azulFijo, plato2, [0.42, 0.135, 0]);
    piezas.herramientas = { g, plato: plato2, x: X.herramientas };
  }
  for (const k of PIEZAS) escena.add(piezas[k].g);

  /* ------------------------------------- lo que viene después: la lente, Finance y el circuito */
  const lente = new Group(); lente.position.set(X.lente, 0, 0); escena.add(lente);
  hacer(marco(1.5, 1.5, 0.3, { r: 0.5, y: ALTO }), alu, lente); tramo(PASO * 1.15, lente, -0.2);
  { const l = hacer(new SphereGeometry(0.5, 48, 32), vidrio, lente, [0, ALTO, 0]); l.scale.set(0.34, 1, 1); l.castShadow = false; l.renderOrder = 5; }
  const finance = new Group(); finance.position.set(X.finance, 0, 0); escena.add(finance);
  hacer(marco(1.7, 1.5, 0.9, { w: 0.6, h: 0.6, y: ALTO }), alu, finance); tramo(PASO * 1.2, finance, 0.1);
  // la placa de Finance: el total registrado, grabado y encendido
  const lonaF = document.createElement("canvas"); lonaF.width = 1024; lonaF.height = 320; const tFin = new CanvasTexture(lonaF); tFin.colorSpace = SRGBColorSpace; tFin.minFilter = LinearFilter; tFin.generateMipmaps = false;
  const placaF = hacer(new PlaneGeometry(1.48, 0.46), new MeshStandardMaterial({ map: tFin, emissiveMap: tFin, emissive: 0xffffff, emissiveIntensity: 0.25, metalness: 0.2, roughness: 0.3, transparent: true }), finance, [0, 1.16, 0.851]); placaF.castShadow = false;
  // el resto del circuito: la media vuelta, la recta de vuelta y la otra media vuelta
  const circuito = new Group(); escena.add(circuito);
  { const curva = (cx, cz, a0) => { for (let i = 0; i < 14; i++) { const a = a0 + ((i + 0.5) / 14) * Math.PI, l = (Math.PI * RADIO) / 14 + 0.02; hacer(new BoxGeometry(l, 0.05, 0.1), acero, circuito, [cx + Math.sin(a) * RADIO, ALTO - 0.14, cz + Math.cos(a) * RADIO], [0, a, 0]); if (i % 3 === 1) hacer(new CylinderGeometry(0.035, 0.05, ALTO - 0.165, 12), aluLiso, circuito, [cx + Math.sin(a) * RADIO, (ALTO - 0.165) / 2, cz + Math.cos(a) * RADIO]); } };
    curva(FIN_RECTA, -RADIO, 0); curva(X0, -RADIO, Math.PI);
    const vuelta = new Group(); vuelta.position.set((X0 + FIN_RECTA) / 2, 0, -RADIO * 2); circuito.add(vuelta); tramo(FIN_RECTA - X0, vuelta);
    const cola = new Group(); cola.position.set((X.finance + PASO * 0.7 + FIN_RECTA) / 2, 0, 0); circuito.add(cola); tramo(FIN_RECTA - X.finance - PASO * 0.7, cola);
    const cabeza = new Group(); cabeza.position.set((X0 + -PASO / 2) / 2, 0, 0); circuito.add(cabeza); }
  // la pieza de tu empresa: un bloque con el nombre grabado, que llega y se queda en la recta de vuelta
  const tuyo = new Group(); escena.add(tuyo);
  hacer(marco(1.9, 1.5, 0.8, { w: 0.6, h: 0.6, y: ALTO }), alu, tuyo);
  const lonaT = document.createElement("canvas"); lonaT.width = 1024; lonaT.height = 330; const tTuyo = new CanvasTexture(lonaT); tTuyo.minFilter = LinearFilter; tTuyo.generateMipmaps = false; tTuyo.colorSpace = SRGBColorSpace;
  const placaT = hacer(new PlaneGeometry(1.7, 0.55), new MeshStandardMaterial({ map: tTuyo, transparent: true, metalness: 0.9, roughness: 0.45 }), tuyo, [0, 1.17, 0.801]); placaT.castShadow = false;

  /* -------------------------------------------------------------- los píxeles */
  const N = movil ? 30 : 44, pix = new InstancedMesh(new RoundedBoxGeometry(0.2, 0.2, 0.2, 3, 0.022), azul, N); pix.castShadow = true; pix.instanceMatrix.setUsage(DynamicDrawUsage); pix.frustumCulled = false; escena.add(pix);
  const AZUL = new Color(0x1c4cf0), GRIS = new Color(0x9a9da3), C = new Color();
  const cola = Array.from({ length: N }, () => ({ s: -1, vivo: false, leido: 1 }));
  for (let i = 0; i < N; i++) pix.setColorAt(i, AZUL);

  const fuente = (px, peso = 700) => `${peso} ${px}px Archivo, "Helvetica Neue", Arial, sans-serif`;
  const dinero = (c) => { const s = (c / 100).toLocaleString(en ? "en-GB" : "es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true }); return en ? "€" + s : s.replace(/^(\d)(\d{3},)/, "$1.$2") + " €"; };
  const contador = { valor: 0, meta: 0, desde: 0, t: 1, pintado: -1 }, grabado = { rotulo: en ? "BUILT FOR" : "CONSTRUIDO PARA", nombre: en ? "YOUR COMPANY" : "TU EMPRESA" };
  function pintarContador() {
    const g = lonaF.getContext("2d"); g.clearRect(0, 0, 1024, 320); g.fillStyle = "#101114"; g.textBaseline = "alphabetic";
    g.textAlign = "left"; g.font = fuente(40, 600); if ("letterSpacing" in g) g.letterSpacing = "9px"; g.fillText("D-CODE FINANCE", 8, 60);
    g.font = fuente(150, 700); if ("letterSpacing" in g) g.letterSpacing = "0px"; g.fillText(dinero(Math.round(contador.valor)), 2, 240);
    tFin.needsUpdate = true; contador.pintado = contador.valor;
  }
  function grabar() {
    const g = lonaT.getContext("2d"); g.clearRect(0, 0, 1024, 330); g.fillStyle = "#1a1b1e"; g.textAlign = "left"; g.textBaseline = "alphabetic";
    g.font = fuente(38, 600); if ("letterSpacing" in g) g.letterSpacing = "10px"; g.fillText(grabado.rotulo, 8, 66);
    let px = 150; g.font = fuente(px, 800); if ("letterSpacing" in g) g.letterSpacing = "1px"; const w = g.measureText(grabado.nombre).width; if (w > 1000) { px = Math.max(44, Math.floor((px * 1000) / w)); g.font = fuente(px, 800); }
    g.fillText(grabado.nombre, 4, 120 + px * 0.86); tTuyo.needsUpdate = true;
  }
  pintarContador(); grabar();

  /* ------------------------------------------------------------------ estado */
  const est = { cap: 0, meta: 0, T: 0, px: 0, py: 0, ppx: 0, ppy: 0, giro: 0, intro: op.intro === false ? 1 : 0, mano: 0, sosteniendo: false, sel: -1, selM: 0, selK: 0, escalaPx: 1, calidad: 0, rodaje: null, forzar: {}, emitir: 0, paso: 0, registros: 0, pulsoF: 0, lectura: 0 };
  const mz = { unido: 0, carril: 0, ritmo: 0, lente: 0, finance: 0, circuito: 0, tuyo: 0, lejos: 0 };
  const cam = { p: [0, 0, 0], m: [0, 0, 0], fov: 28, d: [0, 0], ab: 0.3 }, cuadro = [];
  let W = 0, H = 0, vertical = false;
  function medir() {
    const r = lienzo.getBoundingClientRect(), w0 = Math.max(2, r.width), h0 = Math.max(2, r.height), dpr = op.dpr || Math.min(window.devicePixelRatio || 1, 2);
    let w = w0 * dpr, h = h0 * dpr; const tope = (op.pixeles || (movil ? 1.5e6 : 3.4e6)) * est.escalaPx; if (w * h > tope) { const k = Math.sqrt(tope / (w * h)); w *= k; h *= k; }
    W = Math.max(2, Math.round(w)); H = Math.max(2, Math.round(h)); vertical = h0 > w0 * 1.02; renderer.setSize(W, H, false); revelado.medir(W, H); camara.aspect = W / H;
  }
  const plano = (i) => { const c = PLANOS[fijar(i, 0, PLANOS.length - 1)]; return vertical ? c.v : c.h; };
  function mezclar() {
    const c = fijar(est.cap, 0, PLANOS.length - 1), i = Math.min(PLANOS.length - 2, Math.floor(c)), f = c - i, t = suave(0.06, 0.94, f), A = PLANOS[i], B = PLANOS[i + 1], a = plano(i), b = plano(i + 1);
    for (const k in mz) mz[k] = est.forzar[k] !== undefined ? est.forzar[k] : mezcla(A[k], B[k], t);
    for (let j = 0; j < 3; j++) { cam.p[j] = mezcla(a.p[j], b.p[j], t); cam.m[j] = mezcla(a.m[j], b.m[j], t); }
    // entre dos planos la cámara se retira un poco, como una grúa, en vez de ir en línea recta
    const dist = Math.hypot(a.p[0] - b.p[0], a.p[1] - b.p[1], a.p[2] - b.p[2]), arco = Math.sin(Math.PI * t) * Math.min(3.2, dist * 0.14); cam.p[1] += arco * 0.6; cam.p[2] += arco;
    cam.fov = mezcla(a.fov, b.fov, t); cam.ab = mezcla(a.ab, b.ab, t); cam.d[0] = mezcla(a.d[0], b.d[0], t); cam.d[1] = mezcla(a.d[1], b.d[1], t);
    mz.unido = Math.max(mz.unido, est.mano * 4 * suave(2.2, 1.5, c));
    // una pieza elegida: la cámara se acerca a ella
    const w = est.selM * fijar(1 - Math.abs(c - 2) * 1.6);
    if (w > 0.001) { const x = X[PIEZAS[est.selK]], tp = vertical ? [x - 0.5, 2.2, 6.4] : [x - 2.3, 1.5, 4.4], tm = [x + 0.05, 0.72, 0]; for (let j = 0; j < 3; j++) { cam.p[j] = mezcla(cam.p[j], tp[j], w); cam.m[j] = mezcla(cam.m[j], tm[j], w); } cam.fov = mezcla(cam.fov, vertical ? 36 : 26, w); cam.ab = mezcla(cam.ab, 0.5, w); }
    if (est.intro < 1) { const k = 1 - sale(est.intro); cam.p[0] += 1.3 * k; cam.p[1] -= 0.55 * k; cam.p[2] -= 2.0 * k; cam.fov += 6 * k; }
    if (est.rodaje) { const r = est.rodaje; for (const k of ["p", "m", "d"]) if (r[k]) cam[k] = r[k].slice(); if (r.fov) cam.fov = r.fov; if (r.ab !== undefined) cam.ab = r.ab; }
  }
  const V = new Vector3(), V2 = new Vector3(), M = new Matrix4(), Q = new Quaternion(), E = new Euler(), UNO = new Vector3(1, 1, 1), o = { x: 0, z: 0, a: 0 };
  function encuadrar() {
    camara.fov = cam.fov; camara.position.set(cam.p[0], cam.p[1], cam.p[2]);
    V.set(cam.m[0] - cam.p[0], cam.m[1] - cam.p[1], cam.m[2] - cam.p[2]); const dist = V.length(); V2.set(V.z, 0, -V.x).normalize();
    camara.position.addScaledVector(V2, -(est.ppx * 0.05 + est.giro) * dist); camara.position.y += est.ppy * 0.03 * dist; if (camara.position.y < 0.25) camara.position.y = 0.25;
    camara.lookAt(cam.m[0], cam.m[1], cam.m[2]); camara.updateProjectionMatrix(); camara.updateMatrixWorld();
    camara.projectionMatrix.elements[8] -= cam.d[0] * 2; camara.projectionMatrix.elements[9] -= cam.d[1] * 2; camara.projectionMatrixInverse.copy(camara.projectionMatrix).invert();
    revelado.U.uFoco.value = dist; revelado.U.uApertura.value = cam.ab * (movil ? 0.6 : 1) * 0.05;
    // la sombra sigue a lo que se mira
    const r = Math.max(5, dist * 0.62); sol.target.position.set(cam.m[0], 0, cam.m[2]); sol.position.set(cam.m[0] - 7, 14, cam.m[2] + 6); cs.left = -r; cs.right = r; cs.top = r; cs.bottom = -r; cs.updateProjectionMatrix(); sol.target.updateMatrixWorld();
  }

  /* Cuánto de unida está cada pieza: llegan una detrás de otra, cada una desde su sitio */
  const union = (k) => fijar(mz.unido - k);
  function simular(dt) {
    const t = est.T;
    PIEZAS.forEach((nombre, k) => {
      const P = piezas[nombre], S = SUELTAS[nombre], u = k === 0 ? 1 : union(k), e = sale(u), flota = (1 - e) * mz.lejos;
      // suelta: flota despacio en su sitio; al unirse viene en arco y se posa
      const fx = Math.sin(t * 0.31 + k * 2.1) * 0.12 * flota, fy = Math.sin(t * 0.42 + k) * 0.1 * flota;
      P.g.position.set(mezcla(S.p[0], P.x, e) + fx, mezcla(S.p[1], 0, e) + Math.sin(e * Math.PI) * 0.5 + fy + (k ? (1 - e) * 0.0 : 0), mezcla(S.p[2], 0, e));
      P.g.rotation.set(S.r[0] * (1 - e) + Math.sin(t * 0.27 + k) * 0.04 * flota, S.r[1] * (1 - e), S.r[2] * (1 - e));
      P.g.visible = k === 0 || mz.lejos > 0.01; if (k) P.g.scale.setScalar(mezcla(0.001, 1, suave(0, 0.5, mz.lejos)));
    });
    // el resto del sistema aparece subiendo del suelo cuando le toca
    const sube = (g, v, y0 = -1.9) => { g.visible = v > 0.004; g.position.y = mezcla(y0, 0, sale(fijar(v))); };
    sube(lente, mz.lente); sube(finance, mz.finance); sube(circuito, mz.circuito, -0.9);
    { const e = sale(fijar(mz.tuyo)); tuyo.visible = mz.tuyo > 0.004; tuyo.position.set(TUYO.x + (1 - e) * 1.2, (1 - e) * 2.6, TUYO.z - (1 - e) * 4.5); tuyo.rotation.set((1 - e) * 0.5, (1 - e) * -0.9, 0); }

    // ---- los píxeles: salen del principio y recorren el carril construido
    const fin = mz.carril, vel = 1.5 + mz.ritmo * 0.5, bucle = mz.circuito > 0.5;
    if (mz.ritmo > 0.01) { est.emitir += dt * mz.ritmo; if (est.emitir >= 1) { est.emitir = 0; const libre = cola.find((p) => !p.vivo); if (libre) { libre.vivo = true; libre.s = 0.05; libre.leido = mz.lente > 0.5 && Math.random() < 0.6 ? 0 : 1; } } }
    let cerca = [9, 9, 9, 9], cercaL = 9, cercaF = 9;
    // el primero: va y viene en su tramo mientras no hay carril por delante
    const solo = fijar(1 - fin / 1.2) * (mz.ritmo < 0.01 ? 1 : fijar(1 - mz.ritmo * 3));
    const hasta = Math.max(sDe(X.personas) + PASO * 0.42, fin);
    for (let i = 0; i < N; i++) {
      const p = cola[i]; let visible = p.vivo, s = p.s, alto = ALTO, escala = 1;
      if (i === 0 && mz.ritmo < 0.01 && mz.finance < 0.5) {
        // el píxel del principio: llega al final de su tramo, se asoma, y vuelve
        const ciclo = (t * 0.17) % 1, ir = ciclo < 0.5 ? suave(0, 1, ciclo / 0.42) : 1 - suave(0, 1, (ciclo - 0.5) / 0.42); s = mezcla(0.28, hasta - 0.14, ir); visible = true; p.vivo = false; p.leido = 1;
        if (mz.unido > 0.3 && mz.carril > 2) { s = (t * 1.3) % Math.max(1.5, fin); }
      } else if (i === 0 && mz.finance > 0.5 && mz.ritmo < 0.01) {
        // en Finance: espera a la entrada y pasa cuando se le pide
        s = mezcla(sDe(X.finance) - 1.25, sDe(X.finance) + 1.3, suave(0.05, 0.75, est.lectura)); visible = true;
      } else if (p.vivo) {
        p.s += vel * dt; s = p.s;
        if (!bucle && s > fin - 0.15) { escala = fijar((fin - s + 0.25) / 0.4); if (s > fin + 0.2) p.vivo = false; }
        if (bucle && s > L_TOTAL) p.s -= L_TOTAL;
        if (s > sDe(X.lente) && p.leido < 1) p.leido = Math.min(1, p.leido + dt * 3);
      }
      if (!visible || escala <= 0.001) { M.makeScale(0, 0, 0); pix.setMatrixAt(i, M); continue; }
      enCarril(s, o);
      for (let k = 0; k < 4; k++) if (union(k) > 0.9 || k === 0) cerca[k] = Math.min(cerca[k], Math.abs(s - sDe(X[PIEZAS[k]])));
      cercaL = Math.min(cercaL, Math.abs(s - sDe(X.lente))); cercaF = Math.min(cercaF, Math.abs(s - sDe(X.finance)));
      // nace creciendo
      if (p.vivo && p.s < 0.5) escala *= fijar(p.s / 0.45);
      E.set(0, -o.a, 0); Q.setFromEuler(E); V.set(o.x, alto, o.z); V2.setScalar(escala); M.compose(V, Q, V2); pix.setMatrixAt(i, M);
      C.copy(GRIS).lerp(AZUL, p.leido); pix.setColorAt(i, C);
    }
    pix.instanceMatrix.needsUpdate = true; if (pix.instanceColor) pix.instanceColor.needsUpdate = true;
    // ---- cada pieza hace lo suyo cuando le llega el trabajo
    const ab = suave(0.75, 0.2, cerca[0]); piezas.personas.hojaA.position.z = 0.155 + ab * 0.3; piezas.personas.hojaB.position.z = -0.155 - ab * 0.3;
    if (cerca[1] < 0.12 && !est.enAro) { est.enAro = true; est.paso++; } else if (cerca[1] > 0.3) est.enAro = false;
    piezas.procesos.aro.rotation.x += ((est.paso * TAU) / 8 - piezas.procesos.aro.rotation.x) * Math.min(1, dt * 7);
    if (cerca[2] < 0.12 && !est.enDatos) { est.enDatos = true; est.registros++; } else if (cerca[2] > 0.3) est.enDatos = false;
    piezas.datos.laminas.forEach((m, k) => { const n = est.registros % 10; m.visible = union(2) > 0.9 && k < n; });
    piezas.herramientas.plato.rotation.y += (Math.round(t * mz.ritmo * 0.0 + est.paso) * (Math.PI) - piezas.herramientas.plato.rotation.y) * Math.min(1, dt * 5);
    est.pulsoF += ((cercaF < 0.5 ? 1 : 0) - est.pulsoF) * Math.min(1, dt * 5); placaF.material.emissiveIntensity = 0.0 + 0.0 * est.pulsoF;
    if (contador.t < 1) { contador.t = Math.min(1, contador.t + dt / 0.9); contador.valor = contador.desde + (contador.meta - contador.desde) * sale(contador.t); }
    if (contador.pintado !== contador.valor) pintarContador();
  }
  function pintar() {
    mezclar(); simular(est.dt || 0.016); encuadrar();
    renderer.setRenderTarget(revelado.destino); renderer.render(escena, camara); revelado.revelar(camara, est.T);
    for (const f of cuadro) f();
  }
  function avanzar(dt) {
    est.T += dt; est.dt = dt;
    const lejos = Math.abs(est.meta - est.cap); est.cap += (est.meta - est.cap) * Math.min(1, dt * (lejos > 1.5 ? 6 : 3.2)); if (lejos < 0.0004) est.cap = est.meta;
    est.ppx += (est.px - est.ppx) * Math.min(1, dt * 3.5); est.ppy += (est.py - est.ppy) * Math.min(1, dt * 3.5); est.giro *= Math.exp(-dt * 0.7);
    est.mano += ((est.sosteniendo ? 1 : 0) - est.mano) * Math.min(1, dt * (est.sosteniendo ? 0.8 : 2.4));
    est.selM += ((est.sel >= 0 ? 1 : 0) - est.selM) * Math.min(1, dt * 3);
    pintar();
  }
  let raf = 0, previo = 0;
  const bucle = (ahora) => { raf = requestAnimationFrame(bucle); const dt = Math.min(0.05, (ahora - previo) / 1000 || 0.016); previo = ahora; avanzar(dt); };
  const proyectar = (x, y, z, s) => { V.set(x, y, z).project(camara); const r = lienzo.getBoundingClientRect(); s.x = r.left + (V.x * 0.5 + 0.5) * r.width; s.y = r.top + (-V.y * 0.5 + 0.5) * r.height; s.visible = V.z < 1 && Math.abs(V.x) < 1.05 && Math.abs(V.y) < 1.05; return s; };

  const api = {
    est, mz, info: { piezas: PIEZAS }, listo: null, get vivo() { return !!raf; },
    capitulo(c, ya) { est.meta = c; if (ya) est.cap = c; },
    intro(t) { est.intro = fijar(t); },
    puntero(x, y) { est.px = x; est.py = y; },
    arrastrar(dx) { est.giro = fijar(est.giro - dx * 0.0005, -0.18, 0.18); },
    sostener(si) { est.sosteniendo = !!si; },
    area(nombre) { const k = PIEZAS.indexOf(nombre); est.sel = k; if (k >= 0) est.selK = k; },
    modulo(nombre, s) { const P = piezas[nombre]; P.g.getWorldPosition(V2); return proyectar(V2.x, V2.y + 1.72, V2.z, s); },
    unida(nombre) { const k = PIEZAS.indexOf(nombre); return k === 0 ? 1 : union(k); },
    lectura(v) { est.lectura = fijar(v); },
    registro(c, ya) { contador.desde = contador.valor; contador.meta = c; contador.t = ya ? 1 : 0; if (ya) contador.valor = c; },
    puntoContador(s) { return proyectar(X.finance, 1.16, 0.86, s); },
    grabar(q = {}) { if (q.rotulo !== undefined) grabado.rotulo = q.rotulo; if (q.nombre !== undefined) grabado.nombre = String(q.nombre).slice(0, 26) || grabado.nombre; grabar(); },
    redibujar() { grabar(); pintarContador(); },
    rodaje(r) { est.rodaje = r; }, forzar(k, v) { if (v === undefined || v === null) delete est.forzar[k]; else est.forzar[k] = v; },
    alCuadro(f) { cuadro.push(f); }, medir, paso(dt = 0.033) { avanzar(dt); },
    /* avanza el tiempo sin pintar (para llegar a un momento de la escena) */
    correr(seg) { est.cap = est.meta; for (let i = 0, n = Math.round(seg * 30); i < n; i++) { est.T += 1 / 30; mezclar(); simular(1 / 30); } },
    iniciar() { if (!raf) { previo = performance.now(); raf = requestAnimationFrame(bucle); } }, parar() { cancelAnimationFrame(raf); raf = 0; },
    calidad(n) { est.calidad = n; est.escalaPx = [1, 0.72, 0.5, 0.36][Math.min(3, n)]; if (n >= 2) revelado.tomas(8); if (n >= 3) renderer.shadowMap.enabled = false; medir(); },
    liberar() { api.parar(); revelado.liberar(); renderer.dispose(); },
  };
  api.listo = Promise.resolve(api);
  medir(); mezclar();
  return api;
}
