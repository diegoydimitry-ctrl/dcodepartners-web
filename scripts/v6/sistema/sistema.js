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
import { WebGLRenderer, Scene, Group, PerspectiveCamera, Mesh, InstancedMesh, Color, Vector3, Matrix4, Quaternion, Euler, PlaneGeometry, BoxGeometry, CylinderGeometry, TorusGeometry, SphereGeometry, ExtrudeGeometry, Shape, Path, MeshStandardMaterial, MeshPhysicalMaterial, MeshBasicMaterial, DirectionalLight, PMREMGenerator, CanvasTexture, RepeatWrapping, SRGBColorSpace, NoToneMapping, VSMShadowMap, BackSide, DoubleSide, Float32BufferAttribute, LinearFilter, LinearMipmapLinearFilter, HalfFloatType, WebGLRenderTarget, Plane, DynamicDrawUsage } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { crearRevelado } from "./revelado.js";

export const CAPITULOS = ["inicio", "hoy", "sistema", "automatizacion", "inteligencia", "finance", "resultado", "demos", "tuyo"];
export const PIEZAS = ["personas", "procesos", "datos", "herramientas"];
export const hayWebGL2 = () => { try { return !!document.createElement("canvas").getContext("webgl2"); } catch (e) { return false; } };
const fijar = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v), mezcla = (a, b, t) => a + (b - a) * t, suave = (a, b, x) => { const t = fijar((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const sale = (t) => 1 - Math.pow(1 - t, 3), TAU = Math.PI * 2;

const FONDO = 0xf3f2ef, ALTO = 0.62;          // color del plató · altura a la que va el trabajo
const PASO = 2.9;                              // de pieza a pieza
const X0 = -2.5, X = { personas: 0, procesos: PASO, datos: PASO * 2, herramientas: PASO * 3, lente: PASO * 4.1, finance: PASO * 5.2 };
const FIN_RECTA = PASO * 6.05, RADIO = 2.3;    // donde el recorrido gira para volver
const R_BRAZO = 0.46, R_PLATO = 0.62;           // el relevo de «personas» y el plato de «procesos»
const TUYO = { x: PASO * 1.2, z: -RADIO * 2 };

/* El recorrido. Es un circuito: recta de ida con dos pasos especiales (el relevo, que levanta el trabajo en arco sobre un hueco, y el plato, que lo lleva en
   media vuelta), media vuelta al fondo, recta de vuelta y otra media vuelta. Cada tramo sabe colocar un punto: o = { x, y, z, a (giro), k (tramo) }. */
const TRAMOS = [];
{ const recta = (x0, x1, z, a) => ({ largo: Math.abs(x1 - x0), en: (u, o) => { o.x = x0 + (x1 - x0) * u; o.y = ALTO; o.z = z; o.a = a; } });
  const giro = (cx, cz, a0) => ({ largo: Math.PI * RADIO, en: (u, o) => { const a = a0 + u * Math.PI; o.x = cx + Math.sin(a) * RADIO; o.y = ALTO; o.z = cz + Math.cos(a) * RADIO; o.a = a; } });
  TRAMOS.push(recta(X0, X.personas - R_BRAZO, 0, 0));
  TRAMOS.push({ largo: Math.PI * R_BRAZO, relevo: true, en: (u, o) => { const f = Math.PI * (1 - u); o.x = X.personas + Math.cos(f) * R_BRAZO; o.y = ALTO + Math.sin(f) * R_BRAZO; o.z = 0; o.a = 0; } });
  TRAMOS.push(recta(X.personas + R_BRAZO, X.procesos - R_PLATO, 0, 0));
  TRAMOS.push({ largo: Math.PI * R_PLATO, plato: true, en: (u, o) => { const f = Math.PI * (1 - u); o.x = X.procesos + Math.cos(f) * R_PLATO; o.y = ALTO; o.z = Math.sin(f) * R_PLATO; o.a = f - Math.PI; } });
  TRAMOS.push(recta(X.procesos + R_PLATO, FIN_RECTA, 0, 0));
  TRAMOS.push(giro(FIN_RECTA, -RADIO, 0)); TRAMOS.push(recta(FIN_RECTA, X0, -RADIO * 2, Math.PI)); TRAMOS.push(giro(X0, -RADIO, Math.PI));
  let s = 0; for (const t of TRAMOS) { t.s0 = s; s += t.largo; } }
const L_TOTAL = TRAMOS.reduce((a, t) => a + t.largo, 0);
function enCarril(s, o) {
  s = ((s % L_TOTAL) + L_TOTAL) % L_TOTAL;
  for (let k = 0; k < TRAMOS.length; k++) { const t = TRAMOS[k]; if (s <= t.s0 + t.largo || k === TRAMOS.length - 1) { t.en(fijar((s - t.s0) / t.largo), o); o.k = k; return o; } }
  return o;
}
/* a qué distancia del principio está cada cosa */
const S = { finPrimero: TRAMOS[0].largo, personas: TRAMOS[1].s0 + TRAMOS[1].largo / 2, procesos: TRAMOS[3].s0 + TRAMOS[3].largo / 2 };
for (const k of ["datos", "herramientas", "lente", "finance"]) S[k] = TRAMOS[4].s0 + (X[k] - (X.procesos + R_PLATO));
S.finRecta = TRAMOS[5].s0; S.tuyo = TRAMOS[6].s0 + (FIN_RECTA - TUYO.x);
/* hasta dónde puede llegar el trabajo según cuántas piezas hay unidas: se para donde termina su tramo */
const TOPES = [S.finPrimero - 0.13, TRAMOS[2].s0 + TRAMOS[2].largo - 0.13, S.datos - PASO / 2 - 0.13 + 0.0, S.herramientas - PASO / 2 - 0.13, S.herramientas + PASO / 2 - 0.13];

/* Los planos. p: cámara · m: adónde mira · fov · d: desplazamiento del encuadre · ab: desenfoque.
   unido: cuántas piezas están en su sitio (0…4) · ritmo: trabajos por segundo · lente, finance, circuito, tuyo: 0…1 · lejos: las piezas sueltas a la vista */
const PLANOS = [
  { h: { p: [1.7, 1.12, 3.1], m: [-0.95, 0.63, 0], fov: 20, d: [0.2, 0.0], ab: 0.9 }, v: { p: [0.9, 1.3, 4.6], m: [-0.9, 0.7, 0], fov: 30, d: [0, 0.22], ab: 0.7 }, unido: 0, ritmo: 0, lente: 0, finance: 0, circuito: 0, tuyo: 0, lejos: 0 },
  { h: { p: [-4.6, 4.2, 13.5], m: [4.3, 1.1, -0.6], fov: 30, d: [0.2, 0], ab: 0.14 }, v: { p: [1.5, 6.5, 19], m: [4.3, 1.7, -0.5], fov: 44, d: [0, 0.2], ab: 0.1 }, unido: 0, ritmo: 0, lente: 0, finance: 0, circuito: 0, tuyo: 0, lejos: 1 },
  { h: { p: [-2.6, 2.6, 11.6], m: [4.3, 0.7, 0], fov: 30, d: [0.21, 0.02], ab: 0.18 }, v: { p: [4.3, 4.6, 17.5], m: [4.3, 1.0, 0], fov: 44, d: [0, 0.22], ab: 0.1 }, unido: 4, ritmo: 0.42, lente: 0, finance: 0, circuito: 0, tuyo: 0, lejos: 1 },
  { h: { p: [12.6, 1.5, 6.6], m: [4.6, 0.66, 0], fov: 24, d: [0.22, 0], ab: 0.5 }, v: { p: [11.5, 2.2, 8.6], m: [5.2, 0.8, 0], fov: 40, d: [0, 0.2], ab: 0.3 }, unido: 4, ritmo: 1.5, lente: 0, finance: 0, circuito: 0, tuyo: 0, lejos: 1 },
  { h: { p: [X.lente + 4.0, 1.7, 6.2], m: [X.lente - 0.3, 0.72, 0], fov: 22, d: [0.24, 0.0], ab: 0.6 }, v: { p: [X.lente + 1.0, 2.3, 8.2], m: [X.lente, 0.85, 0], fov: 36, d: [0, 0.2], ab: 0.4 }, unido: 4, ritmo: 0.7, lente: 1, finance: 0, circuito: 0, tuyo: 0, lejos: 1 },
  { h: { p: [X.finance - 6.2, 1.9, 4.9], m: [X.finance, 0.78, 0], fov: 22, d: [0.25, 0.0], ab: 0.5 }, v: { p: [X.finance - 7.6, 2.6, 3.6], m: [X.finance, 0.95, 0], fov: 34, d: [0, 0.2], ab: 0.35 }, unido: 4, ritmo: 0, lente: 1, finance: 1, circuito: 0, tuyo: 0, lejos: 1 },
  { h: { p: [3.2, 17.5, 7.6], m: [8.4, 0, -2.5], fov: 34, d: [0.17, 0], ab: 0.04 }, v: { p: [8.4, 30, 3.5], m: [8.4, 0, -2.3], fov: 44, d: [0, 0.18], ab: 0.03 }, unido: 4, ritmo: 1.3, lente: 1, finance: 1, circuito: 1, tuyo: 0, lejos: 1 },
  { h: { p: [3.2, 21, 8.6], m: [8.4, 0, -2.5], fov: 34, d: [0, 0], ab: 0.04 }, v: { p: [8.4, 34, 4], m: [8.4, 0, -2.3], fov: 44, d: [0, 0], ab: 0.03 }, unido: 4, ritmo: 1.3, lente: 1, finance: 1, circuito: 1, tuyo: 0, lejos: 1 },
  { h: { p: [TUYO.x - 6.2, 1.9, TUYO.z - 4.9], m: [TUYO.x, 0.78, TUYO.z], fov: 22, d: [0.25, 0.0], ab: 0.45 }, v: { p: [TUYO.x - 7.6, 2.6, TUYO.z - 3.6], m: [TUYO.x, 0.95, TUYO.z], fov: 34, d: [0, 0.2], ab: 0.3 }, unido: 4, ritmo: 0.9, lente: 1, finance: 1, circuito: 1, tuyo: 1, lejos: 1 },
];
/* Dónde espera cada pieza antes de unirse: cada una llega desde un sitio y una profundidad distintos. */
const SUELTAS = { personas: { p: [1.3, 2.7, -4.6], r: [0.3, -0.8, 0.5] }, procesos: { p: [3.4, 0.0, 4.4], r: [0, 1.3, 0] }, datos: { p: [7.4, 3.3, -6.0], r: [-0.5, 0.6, -0.3] }, herramientas: { p: [10.9, 0.0, 3.0], r: [0, -0.9, 0] } };

/* ------------------------------------------------- el plató: de él salen los reflejos */
function plato(renderer) {
  const s = new Scene();
  const cupula = new SphereGeometry(50, 32, 16), col = new Float32Array(cupula.attributes.position.count * 3), pos = cupula.attributes.position;
  for (let i = 0; i < pos.count; i++) { const y = pos.getY(i) / 50, v = 0.10 + 0.22 * Math.pow(Math.max(0, y), 0.7) + 0.55 * Math.max(0, -y); /* abajo, el suelo blanco también se refleja */ col[i * 3] = v; col[i * 3 + 1] = v * 0.995; col[i * 3 + 2] = v * 0.985; }
  cupula.setAttribute("color", new Float32BufferAttribute(col, 3)); s.add(new Mesh(cupula, new MeshBasicMaterial({ vertexColors: true, side: BackSide })));
  const caja = (w, h, x, y, z, i) => { const m = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: new Color(i, i, i), side: DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m); };
  caja(22, 9, -2, 22, 7, 5.0);          // la gran caja de luz, arriba
  caja(4, 20, -22, 7, 8, 8);            // tira a la izquierda: el filo brillante de los cantos
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
  const movil = !!op.movil, en = op.idioma === "en", fino = !movil && op.fino !== false;   // fino: vidrio de verdad y reflejo en el suelo
  renderer.setPixelRatio(1); renderer.toneMapping = NoToneMapping; renderer.shadowMap.enabled = true; renderer.shadowMap.type = VSMShadowMap;
  const fondo = new Color(FONDO).convertSRGBToLinear();
  renderer.setClearColor(fondo, 1);
  const escena = new Scene(); escena.background = fondo; escena.environment = plato(renderer); escena.environmentIntensity = 1.0;
  const camara = new PerspectiveCamera(28, 1, 0.2, 120);
  const revelado = crearRevelado(renderer, { muestras: op.muestras ?? (movil ? 0 : 4), tomas: op.tomas ?? (movil ? 12 : 30), nivelesHalo: 4 });
  revelado.U.uHalo.value = 0.14; revelado.U.uVineta.value = 0.0; revelado.U.uGrano.value = 0.012; revelado.U.uExposicion.value = 1; revelado.U.uSat.value = 1; revelado.U.uMaxDesenfoque.value = movil ? 10 : 16;

  // luz: un sol de plató alto, de lado, con sombra blanda; el resto lo pone el plató
  const sol = new DirectionalLight(0xffffff, 2.9); sol.castShadow = true; sol.shadow.mapSize.set(op.mapaSombra || (movil ? 1024 : 2048), op.mapaSombra || (movil ? 1024 : 2048)); sol.shadow.radius = 9; sol.shadow.blurSamples = 16; sol.shadow.bias = -0.0002; sol.shadow.normalBias = 0.03;
  const cs = sol.shadow.camera; cs.near = 1; cs.far = 60; escena.add(sol, sol.target);

  /* ------------------------------------------------------------ materiales */
  const tCep = texturaCepillado();
  const alu = new MeshPhysicalMaterial({ color: 0xb4b6ba, metalness: 1, roughness: 0.46, roughnessMap: tCep, bumpMap: tCep, bumpScale: 0.5, anisotropy: 0.5 });
  const aluLiso = new MeshPhysicalMaterial({ color: 0xcfd0d3, metalness: 1, roughness: 0.24, anisotropy: 0.3 });
  const acero = new MeshStandardMaterial({ color: 0xdfe0e3, metalness: 1, roughness: 0.1 });
  const oscuro = new MeshStandardMaterial({ color: 0x1b1c1f, metalness: 0.6, roughness: 0.42 });
  const vidrio = fino ? new MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.04, transmission: 1, thickness: 0.6, ior: 1.5, attenuationColor: new Color(0xd6e6f2), attenuationDistance: 2.2, clearcoat: 1, clearcoatRoughness: 0.03 })
    : new MeshPhysicalMaterial({ color: 0xcfe0f4, metalness: 0, roughness: 0.03, transparent: true, opacity: 0.3, envMapIntensity: 1.6, clearcoat: 1, side: DoubleSide, depthWrite: false });
  // el píxel: un cubo de vidrio azul macizo
  const azul = fino ? new MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.03, transmission: 1, thickness: 0.34, ior: 1.52, attenuationColor: new Color(0x5a82ff), attenuationDistance: 0.3, specularIntensity: 1, clearcoat: 1, clearcoatRoughness: 0.02 })
    : new MeshPhysicalMaterial({ color: 0x1c4cf0, metalness: 0, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.04, emissive: 0x0a25c8, emissiveIntensity: 0.3 });
  const mate = new MeshStandardMaterial({ color: 0xb9bbc0, metalness: 0, roughness: 0.75 });   // lo que aún no se ha leído
  const azulFijo = new MeshPhysicalMaterial({ color: 0x1746e0, emissive: 0x0b2bd6, emissiveIntensity: 0.5, metalness: 0, roughness: 0.14, clearcoat: 1 });
  const U = { tReflejo: { value: null }, uMatriz: { value: new Matrix4() }, uReflejo: { value: fino ? 0.3 : 0 } };
  const matSuelo = new MeshStandardMaterial({ color: 0xcdccc9, metalness: 0, roughness: 0.92, envMapIntensity: 0.3 });
  // el suelo devuelve un reflejo borroso de lo que tiene encima y se funde con el fondo a lo lejos: no hay horizonte
  matSuelo.onBeforeCompile = (sh) => { Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vMundo; varying vec4 vRef; uniform mat4 uMatriz;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvMundo = (modelMatrix * vec4(position, 1.0)).xyz; vRef = uMatriz * vec4(vMundo, 1.0);");
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vMundo; varying vec4 vRef; uniform sampler2D tReflejo; uniform float uReflejo;").replace("#include <dithering_fragment>", `#include <dithering_fragment>
      float lej = smoothstep(9.0, 30.0, length(vMundo - cameraPosition));
      if (uReflejo > 0.0) { vec2 ru = vRef.xy / vRef.w; vec3 r = textureLod(tReflejo, ru, 2.2).rgb * 0.5 + textureLod(tReflejo, ru, 3.4).rgb * 0.5; gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * min(r, vec3(1.2)) / vec3(${fondo.r.toFixed(4)}, ${fondo.g.toFixed(4)}, ${fondo.b.toFixed(4)}), uReflejo * (1.0 - lej)); }
      gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(${fondo.r.toFixed(4)}, ${fondo.g.toFixed(4)}, ${fondo.b.toFixed(4)}), lej);`); };
  const suelo = new Mesh(new PlaneGeometry(400, 400), matSuelo); suelo.rotation.x = -Math.PI / 2; suelo.receiveShadow = true; escena.add(suelo);
  // el reflejo: la misma escena vista desde debajo del suelo, a media resolución
  const reflejo = fino ? { rt: new WebGLRenderTarget(4, 4, { type: HalfFloatType, minFilter: LinearMipmapLinearFilter, magFilter: LinearFilter, generateMipmaps: true }), cam: new PerspectiveCamera(), plano: [new Plane(new Vector3(0, 1, 0), -0.002)] } : null;
  if (reflejo) U.tReflejo.value = reflejo.rt.texture;

  const hacer = (geo, mat, padre, p = [0, 0, 0], r = [0, 0, 0]) => { const m = new Mesh(geo, mat); m.position.set(p[0], p[1], p[2]); m.rotation.set(r[0], r[1], r[2]); m.castShadow = true; m.receiveShadow = true; padre.add(m); return m; };
  const caja = (w, h, d, r = 0.02) => new RoundedBoxGeometry(w, h, d, 3, r);
  /* Un bloque con una ranura por la que pasa el trabajo, mirando a lo largo del recorrido (para Finance y para la pieza de tu empresa) */
  function bloque(w, h, fondoX, bisel = 0.035) {
    const r = 0.12, sh = new Shape(), x = -w / 2;
    sh.moveTo(x + r, 0); sh.lineTo(x + w - r, 0); sh.quadraticCurveTo(x + w, 0, x + w, r); sh.lineTo(x + w, h - r); sh.quadraticCurveTo(x + w, h, x + w - r, h); sh.lineTo(x + r, h); sh.quadraticCurveTo(x, h, x, h - r); sh.lineTo(x, r); sh.quadraticCurveTo(x, 0, x + r, 0);
    const a = new Path(), hw = 0.2, y0 = ALTO - 0.16, y1 = ALTO + 0.2, q = 0.04; a.moveTo(-hw + q, y0); a.quadraticCurveTo(-hw, y0, -hw, y0 + q); a.lineTo(-hw, y1 - q); a.quadraticCurveTo(-hw, y1, -hw + q, y1); a.lineTo(hw - q, y1); a.quadraticCurveTo(hw, y1, hw, y1 - q); a.lineTo(hw, y0 + q); a.quadraticCurveTo(hw, y0, hw - q, y0); a.lineTo(-hw + q, y0); sh.holes.push(a);
    const g = new ExtrudeGeometry(sh, { depth: fondoX - bisel * 2, bevelEnabled: true, bevelThickness: bisel, bevelSize: bisel, bevelSegments: 4, curveSegments: 24 });
    g.translate(0, 0, -(fondoX - bisel * 2) / 2); g.rotateY(Math.PI / 2); return g;
  }
  /* un tramo de carril entre x0 y x1 (en las coordenadas de quien lo lleva), con sus pies */
  const tramo = (x0, x1, padre, z = 0, giro = 0) => { const largo = Math.abs(x1 - x0), g = new Group(); g.position.set((x0 + x1) / 2, 0, z); g.rotation.y = giro; padre.add(g);
    hacer(caja(largo, 0.045, 0.085, 0.012), acero, g, [0, ALTO - 0.125, 0]); const n = Math.max(1, Math.round(largo / 1.5));
    for (let i = 0; i < n; i++) hacer(new CylinderGeometry(0.03, 0.045, ALTO - 0.15, 16), aluLiso, g, [-largo / 2 + (i + 0.5) * (largo / n), (ALTO - 0.15) / 2, 0]); return g; };
  /* una chapita grabada con el nombre de la pieza */
  const rotular = (texto, padre, p, r = [-Math.PI / 2, 0, 0], ancho = 0.72) => { const c = document.createElement("canvas"); c.width = 512; c.height = 96; const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 4;
    const pinta = () => { const g = c.getContext("2d"); g.clearRect(0, 0, 512, 96); g.fillStyle = "#17181b"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = `600 44px Archivo, "Helvetica Neue", Arial, sans-serif`; if ("letterSpacing" in g) g.letterSpacing = "12px"; g.fillText(texto, 262, 50); t.needsUpdate = true; };
    pinta(); const m = hacer(new PlaneGeometry(ancho, ancho * 96 / 512), new MeshStandardMaterial({ map: t, transparent: true, metalness: 0.9, roughness: 0.5 }), padre, p, r); m.castShadow = false; rotulos.push(pinta); return m; };
  const rotulos = [], NOMBRES = en ? ["PEOPLE", "PROCESSES", "DATA", "TOOLS"] : ["PERSONAS", "PROCESOS", "DATOS", "HERRAMIENTAS"];

  // el primer tramo: siempre está, y no lleva a ninguna parte
  const primero = new Group(); escena.add(primero); tramo(X0, X.personas - R_BRAZO, primero);

  /* --------------------------------------------------------- las cuatro piezas */
  const piezas = {};
  { // personas: el relevo. Un brazo coge el trabajo donde termina un tramo y lo deja en el siguiente.
    const g = new Group(); tramo(R_BRAZO, PASO / 2, g);
    hacer(caja(0.5, 0.1, 0.62, 0.03), alu, g, [0, 0.05, 0]); rotular(NOMBRES[0], g, [0, 0.101, 0.2], [-Math.PI / 2, 0, 0], 0.4);
    for (const z of [-0.2, 0.2]) hacer(caja(0.16, ALTO + 0.06, 0.07, 0.02), alu, g, [0, (ALTO + 0.06) / 2, z]);
    hacer(new CylinderGeometry(0.045, 0.045, 0.56, 24), acero, g, [0, ALTO, 0], [Math.PI / 2, 0, 0]);
    const brazo = new Group(); brazo.position.set(0, ALTO, 0); g.add(brazo);
    hacer(caja(R_BRAZO + 0.06, 0.05, 0.3, 0.02), aluLiso, brazo, [-(R_BRAZO - 0.06) / 2 - 0.06, -0.16, 0]);                       // el brazo, por debajo del trabajo
    const cuna = new Group(); cuna.position.set(-R_BRAZO, 0, 0); brazo.add(cuna);                                              // la cuna se mantiene horizontal
    hacer(caja(0.3, 0.035, 0.3, 0.012), aluLiso, cuna, [0, -0.125, 0]); for (const z of [-0.135, 0.135]) hacer(caja(0.3, 0.1, 0.03, 0.01), aluLiso, cuna, [0, -0.08, z]);
    piezas.personas = { g, brazo, cuna, x: X.personas };
  }
  { // procesos: el plato. Seis puestos; el trabajo entra en uno y el plato lo lleva, paso a paso, hasta la salida.
    const g = new Group(); tramo(-PASO / 2, -R_PLATO - 0.14, g); tramo(R_PLATO + 0.14, PASO / 2, g);
    hacer(new CylinderGeometry(0.42, 0.5, 0.2, 64), alu, g, [0, 0.1, 0]); hacer(new CylinderGeometry(0.07, 0.07, ALTO - 0.32, 24), acero, g, [0, 0.2 + (ALTO - 0.32) / 2, 0]);
    const plato2 = new Group(); plato2.position.y = ALTO - 0.12; g.add(plato2); hacer(new CylinderGeometry(R_PLATO + 0.16, R_PLATO + 0.16, 0.03, 96), alu, plato2, [0, -0.015, 0]);
    hacer(new CylinderGeometry(0.16, 0.16, 0.06, 48), aluLiso, plato2, [0, 0.03, 0]);
    for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU; hacer(caja(0.26, 0.012, 0.26, 0.005), i === 0 ? azulFijo : aluLiso, plato2, [Math.cos(a) * R_PLATO, 0.006, Math.sin(a) * R_PLATO], [0, -a, 0]); }
    rotular(NOMBRES[1], g, [0, 0.201, 0.33], [-Math.PI / 2, 0, 0], 0.42);
    piezas.procesos = { g, plato: plato2, x: X.procesos };
  }
  { // datos: un bloque de vidrio. Cada trabajo que pasa deja dentro su registro, una lámina azul.
    const g = new Group(); tramo(-PASO / 2, PASO / 2, g);
    hacer(caja(1.02, 0.14, 0.84, 0.03), alu, g, [0, 0.07, 0]); rotular(NOMBRES[2], g, [0, 0.141, 0.34], [-Math.PI / 2, 0, 0], 0.4);
    const v = hacer(caja(0.9, 1.26, 0.7, 0.05), vidrio, g, [0, 0.14 + 0.63, 0]); v.castShadow = false; v.renderOrder = 5;
    hacer(caja(1.02, 0.06, 0.84, 0.025), alu, g, [0, 1.43, 0]);
    const laminas = []; for (let i = 0; i < 8; i++) { const m = hacer(new BoxGeometry(0.62, 0.02, 0.46), azulFijo, g, [0, 0.93 + i * 0.052, 0]); m.castShadow = false; m.scale.setScalar(0.001); laminas.push(m); }
    piezas.datos = { g, laminas, x: X.datos };
  }
  { // herramientas: del recorrido salen tres ramales hacia los programas que ya usas; a cada uno le llega su copia.
    const g = new Group(); tramo(-PASO / 2, PASO / 2, g);
    hacer(caja(0.56, 0.12, 0.46, 0.03), alu, g, [0, 0.06, 0]); hacer(caja(0.3, 0.3, 0.2, 0.03), alu, g, [0, ALTO - 0.3, 0]); rotular(NOMBRES[3], g, [0, 0.121, 0.18], [-Math.PI / 2, 0, 0], 0.5);
    const destinos = [[-0.82, -1.25], [0, -1.5], [0.82, -1.25]], topes = [];
    destinos.forEach(([x, z], k) => { const l = Math.hypot(x, z) - 0.3, a = Math.atan2(-z, x); const r = hacer(caja(l, 0.022, 0.04, 0.008), acero, g, [x / 2, ALTO - 0.33, z / 2 - 0.02], [0, a, 0]); r.castShadow = true;
      const base = k === 0 ? hacer(new CylinderGeometry(0.2, 0.2, ALTO - 0.33, 48), alu, g, [x, (ALTO - 0.33) / 2, z]) : k === 1 ? hacer(caja(0.36, ALTO - 0.33, 0.36, 0.04), alu, g, [x, (ALTO - 0.33) / 2, z]) : hacer(caja(0.5, ALTO - 0.33, 0.24, 0.04), alu, g, [x, (ALTO - 0.33) / 2, z], [0, 0.5, 0]);
      const luz = hacer(caja(0.11, 0.014, 0.11, 0.004), azulFijo, g, [x, ALTO - 0.322, z]); luz.castShadow = false; luz.scale.setScalar(0.001); topes.push({ x, z, luz, v: 0 }); });
    piezas.herramientas = { g, destinos: topes, x: X.herramientas };
  }
  for (const k of PIEZAS) escena.add(piezas[k].g);

  /* ------------------------------------- lo que viene después: la lente, Finance y el circuito */
  const lente = new Group(); lente.position.set(X.lente, 0, 0); escena.add(lente); tramo(-PASO * 0.62, PASO * 0.55, lente);
  hacer(caja(0.2, 0.1, 1.3, 0.03), alu, lente, [0, 0.05, 0]); for (const z of [-0.58, 0.58]) hacer(caja(0.08, ALTO + 0.14, 0.08, 0.02), alu, lente, [0, (ALTO + 0.14) / 2, z]);
  hacer(new TorusGeometry(0.56, 0.035, 20, 96), acero, lente, [0, ALTO + 0.02, 0], [0, Math.PI / 2, 0]);
  { const l = hacer(new SphereGeometry(0.53, 64, 40), vidrio, lente, [0, ALTO + 0.02, 0]); l.scale.set(0.24, 1, 1); l.castShadow = false; l.renderOrder = 5; }
  const finance = new Group(); finance.position.set(X.finance, 0, 0); escena.add(finance); tramo(-PASO * 0.55, PASO * 0.85, finance);
  hacer(bloque(1.7, 1.5, 0.9), alu, finance);
  // la placa de Finance: el total registrado, grabado en la pieza
  const lonaF = document.createElement("canvas"); lonaF.width = 1024; lonaF.height = 320; const tFin = new CanvasTexture(lonaF); tFin.colorSpace = SRGBColorSpace; tFin.minFilter = LinearFilter; tFin.generateMipmaps = false;
  const placaF = hacer(new PlaneGeometry(1.42, 0.444), new MeshStandardMaterial({ map: tFin, metalness: 0.9, roughness: 0.45, transparent: true }), finance, [-0.452, 1.2, 0], [0, -Math.PI / 2, 0]); placaF.castShadow = false;
  // el resto del circuito: la media vuelta, la recta de vuelta y la otra media vuelta
  const circuito = new Group(); escena.add(circuito);
  { const curva = (cx, cz, a0) => { for (let i = 0; i < 16; i++) { const a = a0 + ((i + 0.5) / 16) * Math.PI, l = (Math.PI * RADIO) / 16 + 0.02; hacer(new BoxGeometry(l, 0.045, 0.085), acero, circuito, [cx + Math.sin(a) * RADIO, ALTO - 0.125, cz + Math.cos(a) * RADIO], [0, a, 0]); if (i % 4 === 1) hacer(new CylinderGeometry(0.03, 0.045, ALTO - 0.15, 12), aluLiso, circuito, [cx + Math.sin(a) * RADIO, (ALTO - 0.15) / 2, cz + Math.cos(a) * RADIO]); } };
    curva(FIN_RECTA, -RADIO, 0); curva(X0, -RADIO, Math.PI); tramo(X0, FIN_RECTA, circuito, -RADIO * 2); tramo(X.finance + PASO * 0.85, FIN_RECTA, circuito); }
  // la pieza de tu empresa: un bloque con el nombre grabado, que llega y se queda en la recta de vuelta
  const tuyo = new Group(); escena.add(tuyo); hacer(bloque(1.9, 1.5, 0.8), alu, tuyo);
  const lonaT = document.createElement("canvas"); lonaT.width = 1024; lonaT.height = 330; const tTuyo = new CanvasTexture(lonaT); tTuyo.minFilter = LinearFilter; tTuyo.generateMipmaps = false; tTuyo.colorSpace = SRGBColorSpace;
  const placaT = hacer(new PlaneGeometry(1.6, 0.516), new MeshStandardMaterial({ map: tTuyo, transparent: true, metalness: 0.9, roughness: 0.45 }), tuyo, [-0.402, 1.2, 0], [0, -Math.PI / 2, 0]); placaT.castShadow = false;

  /* -------------------------------------------------------------- los píxeles */
  const N = movil ? 26 : 40, gPix = caja(0.2, 0.2, 0.2, 0.024);
  const pix = new InstancedMesh(gPix, azul, N), gris = new InstancedMesh(gPix, mate, N), minis = new InstancedMesh(caja(0.085, 0.085, 0.085, 0.012), azulFijo, 9);
  for (const m of [pix, gris, minis]) { m.castShadow = true; m.instanceMatrix.setUsage(DynamicDrawUsage); m.frustumCulled = false; escena.add(m); }
  const cola = Array.from({ length: N }, () => ({ s: -1, vivo: false, leido: 1, copia: false })), copias = Array.from({ length: 9 }, () => ({ t: 1, k: 0 }));

  const fuente = (px, peso = 700) => `${peso} ${px}px Archivo, "Helvetica Neue", Arial, sans-serif`;
  const dinero = (c) => { const t = (c / 100).toLocaleString(en ? "en-GB" : "es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true }); return en ? "€" + t : t.replace(/^(\d)(\d{3},)/, "$1.$2") + " €"; };
  const contador = { valor: 0, meta: 0, desde: 0, t: 1, pintado: -1 }, grabado = { rotulo: en ? "BUILT FOR" : "CONECTADO PARA", nombre: en ? "YOUR COMPANY" : "TU EMPRESA" };
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
  const est = { cap: 0, meta: 0, T: 0, dt: 0.016, px: 0, py: 0, ppx: 0, ppy: 0, giro: 0, intro: op.intro === false ? 1 : 0, mano: 0, sosteniendo: false, sel: -1, selM: 0, selK: 0, escalaPx: 1, calidad: 0, rodaje: null, forzar: {}, emitir: 0, registros: 0, lectura: 0, brazo: Math.PI, plato: 0, turno: 0 };
  const mz = { unido: 0, ritmo: 0, lente: 0, finance: 0, circuito: 0, tuyo: 0, lejos: 0 };
  const cam = { p: [0, 0, 0], m: [0, 0, 0], fov: 28, d: [0, 0], ab: 0.3 }, cuadro = [];
  let W = 0, H = 0, vertical = false;
  function medir() {
    const r = lienzo.getBoundingClientRect(), w0 = Math.max(2, r.width), h0 = Math.max(2, r.height), dpr = op.dpr || Math.min(window.devicePixelRatio || 1, 2);
    let w = w0 * dpr, h = h0 * dpr; const tope = (op.pixeles || (movil ? 1.5e6 : 3.4e6)) * est.escalaPx; if (w * h > tope) { const k = Math.sqrt(tope / (w * h)); w *= k; h *= k; }
    W = Math.max(2, Math.round(w)); H = Math.max(2, Math.round(h)); vertical = h0 > w0 * 1.02; renderer.setSize(W, H, false); revelado.medir(W, H); camara.aspect = W / H;
    if (reflejo) reflejo.rt.setSize(Math.max(2, W >> 1), Math.max(2, H >> 1));
  }
  const plano = (i) => { const c = PLANOS[fijar(i, 0, PLANOS.length - 1)]; return vertical ? c.v : c.h; };
  function mezclar() {
    const c = fijar(est.cap, 0, PLANOS.length - 1), i = Math.min(PLANOS.length - 2, Math.floor(c)), f = c - i, t = suave(0.06, 0.94, f), A = PLANOS[i], B = PLANOS[i + 1], a = plano(i), b = plano(i + 1);
    for (const k in mz) mz[k] = est.forzar[k] !== undefined ? est.forzar[k] : mezcla(A[k], B[k], t);
    for (let j = 0; j < 3; j++) { cam.p[j] = mezcla(a.p[j], b.p[j], t); cam.m[j] = mezcla(a.m[j], b.m[j], t); }
    // entre dos planos la cámara se retira un poco, como una grúa, en vez de ir en línea recta
    const dist = Math.hypot(a.p[0] - b.p[0], a.p[1] - b.p[1], a.p[2] - b.p[2]), arco = Math.sin(Math.PI * t) * Math.min(3.2, dist * 0.14); cam.p[1] += arco * 0.6; cam.p[2] += arco * (a.p[2] + b.p[2] < cam.m[2] * 2 ? -1 : 1);
    cam.fov = mezcla(a.fov, b.fov, t); cam.ab = mezcla(a.ab, b.ab, t); cam.d[0] = mezcla(a.d[0], b.d[0], t); cam.d[1] = mezcla(a.d[1], b.d[1], t);
    mz.unido = Math.max(mz.unido, est.mano * 4 * suave(2.2, 1.5, c)); if (est.mano > 0.02) mz.lejos = Math.max(mz.lejos, suave(0, 0.2, est.mano));
    // una pieza elegida: la cámara se acerca a ella
    const w = est.selM * fijar(1 - Math.abs(c - 2) * 1.6);
    if (w > 0.001) { const x = X[PIEZAS[est.selK]], tp = vertical ? [x + 0.6, 2.4, 6.8] : [x + 2.7, 1.7, 4.6], tm = [x - 0.05, 0.68, -0.15]; for (let j = 0; j < 3; j++) { cam.p[j] = mezcla(cam.p[j], tp[j], w); cam.m[j] = mezcla(cam.m[j], tm[j], w); } cam.fov = mezcla(cam.fov, vertical ? 36 : 24, w); cam.ab = mezcla(cam.ab, 0.55, w); }
    // la entrada: la cámara llega desde más cerca y de frente
    if (est.intro < 1) { const k = 1 - sale(est.intro); cam.p[0] -= 1.1 * k; cam.p[1] -= 0.3 * k; cam.p[2] -= 0.9 * k; cam.ab += 0.5 * k; }
    if (est.rodaje) { const r = est.rodaje; for (const k of ["p", "m", "d"]) if (r[k]) cam[k] = r[k].slice(); if (r.fov) cam.fov = r.fov; if (r.ab !== undefined) cam.ab = r.ab; }
  }
  const V = new Vector3(), V2 = new Vector3(), M = new Matrix4(), Q = new Quaternion(), E = new Euler(), o = { x: 0, y: 0, z: 0, a: 0, k: 0 }, CERO = new Matrix4().makeScale(0, 0, 0);
  function encuadrar() {
    camara.fov = cam.fov; camara.position.set(cam.p[0], cam.p[1], cam.p[2]); camara.up.set(0, 1, 0);
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
    let unidas = 0;
    PIEZAS.forEach((nombre, k) => {
      const P = piezas[nombre], S0 = SUELTAS[nombre], u = union(k), e = sale(u), flota = (1 - e) * mz.lejos; if (u > 0.985) unidas = k + 1;
      // suelta: flota despacio en su sitio; al unirse viene en arco y se posa
      P.g.position.set(mezcla(S0.p[0], P.x, e) + Math.sin(t * 0.31 + k * 2.1) * 0.12 * flota, mezcla(S0.p[1], 0, e) + Math.sin(e * Math.PI) * 0.45 + Math.sin(t * 0.42 + k) * 0.1 * flota * (S0.p[1] > 0.1 ? 1 : 0), mezcla(S0.p[2], 0, e));
      P.g.rotation.set(S0.r[0] * (1 - e) + Math.sin(t * 0.27 + k) * 0.04 * flota, S0.r[1] * (1 - e), S0.r[2] * (1 - e));
      const ver = suave(0, 0.5, mz.lejos); P.g.visible = ver > 0.01; P.g.scale.setScalar(Math.max(0.001, ver));
    });
    // el resto del sistema aparece subiendo del suelo cuando le toca
    const sube = (g, v, y0 = -1.9) => { g.visible = v > 0.004; g.position.y = mezcla(y0, 0, sale(fijar(v))); };
    sube(lente, mz.lente); sube(finance, mz.finance); sube(circuito, mz.circuito, -0.9);
    { const e = sale(fijar(mz.tuyo)); tuyo.visible = mz.tuyo > 0.004; tuyo.position.set(TUYO.x + (1 - e) * 1.2, (1 - e) * 2.6, TUYO.z - (1 - e) * 4.5); tuyo.rotation.set((1 - e) * 0.5, (1 - e) * -0.9, 0); }

    // ---- hasta dónde llega el recorrido: donde termina el último tramo unido
    const bucle = mz.circuito > 0.5;
    let tope = TOPES[unidas]; if (unidas === 4) { if (mz.lente > 0.9) tope = S.lente + PASO * 0.55 - 0.13; if (mz.finance > 0.9) tope = S.finance + PASO * 0.85 - 0.13; }
    const vel = 1.25 + mz.ritmo * 0.45;
    if (mz.ritmo > 0.01) { est.emitir += dt * mz.ritmo; if (est.emitir >= 1) { est.emitir = 0; const libre = cola.find((p, i) => i > 0 && !p.vivo); if (libre) { libre.vivo = true; libre.s = 0.02; libre.copia = false; libre.leido = mz.lente > 0.5 ? 0 : 1; } } }
    const cerca = { personas: 9, procesos: 9 }; let enBrazo = -1, enPlato = [];
    for (let i = 0; i < N; i++) {
      const p = cola[i]; let visible = p.vivo, s = p.s, escala = 1;
      if (i === 0) {
        visible = mz.ritmo < 0.25 && !bucle; escala = fijar(1 - mz.ritmo * 4);
        if (mz.finance > 0.5) s = mezcla(S.finance - 1.3, S.finance + 1.5, suave(0.05, 0.8, est.lectura));   // en Finance: espera a la entrada y pasa cuando se le pide
        else { const ciclo = (t * (tope > 6 ? 0.07 : 0.16)) % 1, ir = ciclo < 0.5 ? suave(0, 1, ciclo / 0.44) : 1 - suave(0, 1, (ciclo - 0.5) / 0.44); s = mezcla(0.5, tope, ir); }   // va hasta donde puede, se asoma al final, y vuelve
        p.leido = 1;
      } else if (p.vivo) {
        p.s += vel * dt; s = p.s;
        if (!bucle && s > tope - 0.1) { escala = fijar((tope - s + 0.3) / 0.4); if (s > tope + 0.3) p.vivo = false; }
        if (bucle && s > L_TOTAL) { p.s -= L_TOTAL; p.copia = false; p.registrado = false; if (mz.lente > 0.5) p.leido = 0; }
        if (s > S.lente && p.leido < 1) p.leido = Math.min(1, p.leido + dt * 4);
        if (s < 0.45) escala *= fijar(s / 0.4);
        // al pasar por datos deja su registro; al pasar por herramientas, una copia a un programa
        if (!p.registrado && s > S.datos && unidas > 2) { p.registrado = true; est.registros++; }
        if (!p.copia && s > S.herramientas && unidas > 3) { p.copia = true; const c = copias.find((q) => q.t >= 1); if (c) { c.t = 0; c.k = est.turno++ % 3; } }
      }
      if (!visible || escala <= 0.001) { pix.setMatrixAt(i, CERO); gris.setMatrixAt(i, CERO); continue; }
      enCarril(s, o);
      if (TRAMOS[o.k].relevo) enBrazo = (s - TRAMOS[1].s0) / TRAMOS[1].largo; if (TRAMOS[o.k].plato) enPlato.push((s - TRAMOS[3].s0) / TRAMOS[3].largo);
      E.set(0, -o.a, 0); Q.setFromEuler(E); V.set(o.x, o.y, o.z);
      V2.setScalar(escala * fijar(p.leido * 1.6 - 0.3)); M.compose(V, Q, V2); pix.setMatrixAt(i, M);
      V2.setScalar(escala * fijar(1 - p.leido * 1.6)); M.compose(V, Q, V2); gris.setMatrixAt(i, M);
    }
    pix.instanceMatrix.needsUpdate = true; gris.instanceMatrix.needsUpdate = true;
    // ---- el relevo: el brazo acompaña al trabajo de un tramo al otro y vuelve a por el siguiente
    const metaB = enBrazo >= 0 ? Math.PI * (1 - enBrazo) : Math.PI; est.brazo += (metaB - est.brazo) * Math.min(1, dt * (enBrazo >= 0 ? 30 : 5));
    piezas.personas.brazo.rotation.z = Math.PI - est.brazo; piezas.personas.cuna.rotation.z = -(Math.PI - est.brazo);
    // ---- el plato: gira con el trabajo que lleva; sin trabajo, se queda en su paso
    if (enPlato.length) est.plato = -Math.PI * enPlato[0]; else est.plato += (Math.round(est.plato / (TAU / 6)) * (TAU / 6) - est.plato) * Math.min(1, dt * 6);
    piezas.procesos.plato.rotation.y = est.plato;
    // ---- los registros se apilan dentro del vidrio
    piezas.datos.laminas.forEach((m, k) => { const n = est.registros % 9, on = k < n ? 1 : 0; m.scale.setScalar(Math.max(0.001, m.scale.x + (on - m.scale.x) * Math.min(1, dt * 8))); });
    // ---- las copias viajan por su ramal hasta el programa
    const H = piezas.herramientas; H.g.updateMatrixWorld();
    copias.forEach((c, i) => {
      if (c.t >= 1) { minis.setMatrixAt(i, CERO); return; } c.t = Math.min(1, c.t + dt * 1.5); const d = H.destinos[c.k], e = suave(0, 1, c.t);
      V.set(d.x * e, ALTO - 0.27 + (1 - e) * 0.0, d.z * e).applyMatrix4(H.g.matrixWorld); V2.setScalar(suave(0, 0.15, c.t) * (1 - suave(0.88, 1, c.t))); Q.identity(); M.compose(V, Q, V2); minis.setMatrixAt(i, M); if (c.t >= 1) d.v = 1;
    });
    minis.instanceMatrix.needsUpdate = true;
    H.destinos.forEach((d) => { d.v = Math.max(0, d.v - dt * 0.35); d.luz.scale.setScalar(Math.max(0.001, suave(0, 0.3, d.v))); });
    if (contador.t < 1) { contador.t = Math.min(1, contador.t + dt / 0.9); contador.valor = contador.desde + (contador.meta - contador.desde) * sale(contador.t); }
    if (contador.pintado !== contador.valor) pintarContador();
  }
  const RM = new Matrix4();
  function pintar() {
    mezclar(); simular(est.dt); encuadrar();
    if (reflejo && U.uReflejo.value > 0) {
      // la escena desde debajo del suelo, sin el suelo y solo con lo que queda por encima
      const c = reflejo.cam; c.position.set(camara.position.x, -camara.position.y, camara.position.z); c.up.set(0, -1, 0); c.lookAt(cam.m[0], -cam.m[1], cam.m[2]); c.updateMatrixWorld(); c.projectionMatrix.copy(camara.projectionMatrix); c.projectionMatrixInverse.copy(camara.projectionMatrixInverse);
      U.uMatriz.value.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1).multiply(c.projectionMatrix).multiply(c.matrixWorldInverse);
      suelo.visible = false; renderer.clippingPlanes = reflejo.plano; renderer.setRenderTarget(reflejo.rt); renderer.render(escena, c);
      suelo.visible = true; renderer.clippingPlanes = [];
      renderer.setRenderTarget(revelado.destino); renderer.render(escena, camara);
    } else { renderer.setRenderTarget(revelado.destino); renderer.render(escena, camara); }
    revelado.revelar(camara, est.T);
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
  const bucleR = (ahora) => { raf = requestAnimationFrame(bucleR); const dt = Math.min(0.05, (ahora - previo) / 1000 || 0.016); previo = ahora; avanzar(dt); };
  const proyectar = (x, y, z, q) => { V.set(x, y, z).project(camara); const r = lienzo.getBoundingClientRect(); q.x = r.left + (V.x * 0.5 + 0.5) * r.width; q.y = r.top + (-V.y * 0.5 + 0.5) * r.height; q.visible = V.z < 1 && Math.abs(V.x) < 1.05 && Math.abs(V.y) < 1.05; return q; };
  const ALTOS = { personas: 1.3, procesos: 1.05, datos: 1.72, herramientas: 1.0 };

  const api = {
    est, mz, info: { piezas: PIEZAS }, listo: null, get vivo() { return !!raf; },
    capitulo(c, ya) { est.meta = c; if (ya) est.cap = c; },
    intro(t) { est.intro = fijar(t); },
    puntero(x, y) { est.px = x; est.py = y; },
    arrastrar(dx) { est.giro = fijar(est.giro - dx * 0.0005, -0.18, 0.18); },
    sostener(si) { est.sosteniendo = !!si; },
    area(nombre) { const k = PIEZAS.indexOf(nombre); est.sel = k; if (k >= 0) est.selK = k; },
    modulo(nombre, q) { const P = piezas[nombre]; P.g.getWorldPosition(V2); return proyectar(V2.x, V2.y + ALTOS[nombre], V2.z, q); },
    unida(nombre) { return union(PIEZAS.indexOf(nombre)); },
    lectura(v) { est.lectura = fijar(v); },
    registro(c, ya) { contador.desde = contador.valor; contador.meta = c; contador.t = ya ? 1 : 0; if (ya) contador.valor = c; },
    puntoContador(q) { return proyectar(X.finance - 0.46, 1.16, 0, q); },
    grabar(q = {}) { if (q.rotulo !== undefined) grabado.rotulo = q.rotulo; if (q.nombre !== undefined) grabado.nombre = String(q.nombre).slice(0, 26) || grabado.nombre; grabar(); },
    redibujar() { grabar(); pintarContador(); rotulos.forEach((f) => f()); },
    rodaje(r) { est.rodaje = r; }, forzar(k, v) { if (v === undefined || v === null) delete est.forzar[k]; else est.forzar[k] = v; },
    alCuadro(f) { cuadro.push(f); }, medir, paso(dt = 0.033) { avanzar(dt); },
    /* avanza el tiempo sin pintar (para llegar a un momento de la escena) */
    correr(seg) { est.cap = est.meta; for (let i = 0, n = Math.round(seg * 30); i < n; i++) { est.T += 1 / 30; mezclar(); simular(1 / 30); } },
    iniciar() { if (!raf) { previo = performance.now(); raf = requestAnimationFrame(bucleR); } }, parar() { cancelAnimationFrame(raf); raf = 0; },
    calidad(n) { est.calidad = n; est.escalaPx = [1, 0.72, 0.5, 0.36][Math.min(3, n)]; if (n >= 1) U.uReflejo.value = 0; if (n >= 2) revelado.tomas(8); if (n >= 3) renderer.shadowMap.enabled = false; medir(); },
    liberar() { api.parar(); revelado.liberar(); renderer.dispose(); },
  };
  api.listo = Promise.resolve(api);
  medir(); mezclar();
  return api;
}
