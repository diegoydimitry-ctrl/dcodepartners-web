/* ==========================================================================
   D-CODE · LA MÁQUINA
   --------------------------------------------------------------------------
   Una empresa ya tiene todas sus piezas. Lo que le falta es que funcionen
   juntas. Esta escena lo enseña con una máquina de precisión: cientos de
   piezas de metal sueltas que, al deslizar, se montan en un mecanismo que
   marcha solo, lee un documento, lo convierte en cifras y acaba cerrado tras
   una tapa sencilla.

   Capítulos (el scroll es la película; cada uno cambia la escena y lo que significa):
     0 claro           las piezas sueltas, de muy cerca
     1 hoy             cada pieza gira por su cuenta
     2 sistema         todo se monta; lo último, las transmisiones entre áreas
     3 automatizacion  de noche, la máquina sigue marchando
     4 inteligencia    la lupa lee un documento
     5 finance         los datos pasan a los tambores del registro
     6 resultado       baja la tapa: lo complejo queda dentro
     7 demos           la máquina, lejos y atenuada
     8 tuyo            la tapa, de cerca, con tu nombre grabado

   three.js (WebGL2). Todo el texto de la página vive en el HTML, fuera de aquí.
   ========================================================================== */
import { WebGLRenderer, Scene, PerspectiveCamera, Color, FogExp2, DirectionalLight, InstancedMesh, MeshStandardMaterial, MeshPhysicalMaterial, MeshBasicMaterial, Mesh, PlaneGeometry, SphereGeometry, Float32BufferAttribute, BackSide, PMREMGenerator, InstancedBufferAttribute, DynamicDrawUsage, CanvasTexture, SRGBColorSpace, NoColorSpace, Vector3, Quaternion, Euler, PCFShadowMap, DoubleSide, RepeatWrapping, ClampToEdgeWrapping, LinearFilter, LinearMipmapLinearFilter, NoToneMapping, Matrix4 } from "three";
import { trazar, ACABADO, TONO, MODULOS } from "./trazado.js";
import { platina as geoPlatina } from "./piezas.js";
import { crearRevelado } from "./post.js";
import { dibujarFactura, dibujarCifras, dibujarGrabado, dibujarRotulos, CAMPOS } from "./papel.js";

export { CAMPOS, MODULOS };
export const CAPITULOS = ["claro", "hoy", "sistema", "automatizacion", "inteligencia", "finance", "resultado", "demos", "tuyo"];
const TAU = Math.PI * 2;
const fijar = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x), mezcla = (a, b, t) => a + (b - a) * t, suave = (t) => t * t * (3 - 2 * t), cubica = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2), saleCubica = (t) => 1 - Math.pow(1 - t, 3);
const azar = (s) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

const NOMBRES = { es: ["Ventas", "Clientes", "Operaciones", "Finanzas", "Dirección", "Motor"], en: ["Sales", "Clients", "Operations", "Finance", "Management", "Engine"] };
/* Escalonado del montaje: la platina primero, las transmisiones al final. Índices como MODULOS. */
const TURNO = [0.22, 0.34, 0.46, 0.58, 0.7, 0.1, 0.92, 0.0];
/* Cada capítulo: cuánto está montada, si marcha, si es de noche, si la tapa está puesta, y sus cámaras
   (h = pantalla apaisada, v = vertical). p = posición, m = adónde mira, d = desplazamiento del encuadre. */
const CAPS = [
  { montaje: 0, marcha: 0, noche: 0, tapa: 0, doc: 0, expo: 1.0, giro: 1,
    h: { p: [1.4, 0.5, 6.2], m: [0, 0.25, 0], fov: 40, foco: 5.0, ab: 0.55, d: [0, 0] }, v: { p: [0.6, 0.4, 8.6], m: [0, 0.3, 0], fov: 52, foco: 6.8, ab: 0.5, d: [0, 0] } },
  { montaje: 0, marcha: 0, noche: 0, tapa: 0, doc: 0, expo: 1.0, giro: 0.12,
    h: { p: [-3.2, 1.2, 8.4], m: [1.4, 0.1, 0], fov: 36, foco: 7.6, ab: 0.5, d: [0.3, 0] }, v: { p: [-1.5, 1.0, 11.5], m: [0, 0.2, 0], fov: 52, foco: 10.4, ab: 0.45, d: [0, 0.42] } },
  { montaje: 1, marcha: 1, noche: 0, tapa: 0, doc: 0, expo: 1.0, giro: 0,
    h: { p: [-5.5, -7.5, 17.5], m: [0.2, -0.1, 0], fov: 30, foco: 19.5, ab: 0.16, d: [0.34, 0] }, v: { p: [-4, -9, 25], m: [0, 0, 0], fov: 40, foco: 27, ab: 0.12, d: [0, 0.46] } },
  { montaje: 1, marcha: 1, noche: 1, tapa: 0, doc: 0, expo: 0.9, giro: 0,
    h: { p: [-7.4, -0.6, 2.5], m: [-2.4, 1.8, 0.3], fov: 34, foco: 5.3, ab: 0.5, d: [0.3, 0] }, v: { p: [-4.6, -4.6, 3.2], m: [-1.6, 0.4, 0.3], fov: 46, foco: 6.4, ab: 0.45, d: [0, 0.44] } },
  { montaje: 1, marcha: 0.35, noche: 0.25, tapa: 0, doc: 1, expo: 1.0, giro: 0,
    h: { p: [2.6, -5.6, 2.9], m: [0.5, -3.0, 0.35], fov: 32, foco: 3.9, ab: 0.5, d: [0.3, 0] }, v: { p: [5.0, -3.2, 3.4], m: [2.5, -0.6, 0.35], fov: 44, foco: 4.6, ab: 0.45, d: [0, 0.44] } },
  { montaje: 1, marcha: 0.35, noche: 0.25, tapa: 0, doc: 1, expo: 1.0, giro: 0,
    h: { p: [0.5, -4.6, 7.6], m: [0.5, -2.0, 0.3], fov: 30, foco: 8.0, ab: 0.22, d: [0.44, 0] }, v: { p: [2.2, -2.6, 9.6], m: [2.2, -0.2, 0.3], fov: 40, foco: 9.9, ab: 0.2, d: [0, 0.5] } },
  { montaje: 1, marcha: 1, noche: 0, tapa: 1, doc: 0, expo: 1.0, giro: 0,
    h: { p: [3.5, -4.5, 20], m: [0, 0, 0.5], fov: 30, foco: 20.5, ab: 0.1, d: [0.42, 0] }, v: { p: [2, -6, 28], m: [0, 0, 0.5], fov: 40, foco: 28.5, ab: 0.08, d: [0, 0.5] } },
  { montaje: 1, marcha: 1, noche: 0.6, tapa: 1, doc: 0, expo: 0.55, giro: 0,
    h: { p: [0, -2, 30], m: [0, 0, 0.5], fov: 30, foco: 12, ab: 0.5, d: [0, 0] }, v: { p: [0, -3, 40], m: [0, 0, 0.5], fov: 40, foco: 14, ab: 0.5, d: [0, 0] } },
  { montaje: 1, marcha: 1, noche: 0.15, tapa: 1, doc: 0, expo: 1.0, giro: 0,
    h: { p: [-1.6, -3.0, 10.5], m: [0.3, 0, 0.6], fov: 30, foco: 10.6, ab: 0.24, d: [0.36, 0] }, v: { p: [-1.0, -3.4, 13.5], m: [0, 0, 0.6], fov: 42, foco: 13.6, ab: 0.2, d: [0, 0.46] } },
];

/* ---------------------------------------------------- el plató: de él salen los reflejos */
function plato(renderer) {
  const s = new Scene(); s.background = new Color(0x000000);
  // una cúpula con degradado: los planos del metal no reflejan ni blanco ni negro, sino una luz que cae
  const cupula = new SphereGeometry(60, 32, 16), col = new Float32Array(cupula.attributes.position.count * 3), pos = cupula.attributes.position;
  for (let i = 0; i < pos.count; i++) { const y = pos.getY(i) / 60, z = pos.getZ(i) / 60, v = 0.02 + 0.3 * Math.pow(Math.max(0, y * 0.7 + z * 0.5 + 0.2), 1.5); col[i * 3] = v; col[i * 3 + 1] = v; col[i * 3 + 2] = v * 1.04; }
  cupula.setAttribute("color", new Float32BufferAttribute(col, 3)); s.add(new Mesh(cupula, new MeshBasicMaterial({ vertexColors: true, side: BackSide })));
  const caja = (w, h, x, y, z, i, t = 1) => { const m = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: new Color(i, i * t, i * t * t), side: DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m); };
  caja(20, 7, 2, 17, 9, 3.4);             // la caja de luz, alta
  caja(2.4, 15, -16, 2, 7, 7.5);          // tira a la izquierda: el filo brillante de los biseles
  caja(1.8, 12, 15, -3, 5, 3.2, 0.985);   // tira a la derecha, más fría
  caja(14, 2.5, 0, -12, 8, 0.7);          // relleno bajo
  caja(10, 4, 0, 9, -12, 1.8);            // contraluz
  caja(1.3, 1.3, 7, 6, 14, 11);           // un punto duro para los destellos
  caja(26, 14, 3, 4, 26, 0.75);           // un velo ancho de frente: de cara, los planos no se quedan negros
  const pm = new PMREMGenerator(renderer), t = pm.fromScene(s, 0.025, 0.1, 100).texture; pm.dispose();
  s.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
  return t;
}

/* ------------------------------------------- los acabados del metal, dentro del sombreador */
const GLSL_COMUN = /* glsl */ `
varying vec4 vFin; varying vec3 vObj; varying vec3 vObjN; varying vec3 vEjeU; varying vec3 vEjeV;
uniform float uSel, uAtenua, uNoche, uOclusion, uPulso; uniform sampler2D tRotulos;
float h11(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float n1(float x) { float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(h11(i), h11(i + 1.0), f); }
float h31(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
// estrías a tres escalas; cada una se apaga cuando ya no cabe en un píxel (si no, centellea)
float estrias(float u) {
  float a = fwidth(u);
  return n1(u * 300.0) * clamp(1.0 - a * 300.0 * 1.4, 0.0, 1.0) + n1(u * 86.0 + 7.3) * 1.7 * clamp(1.0 - a * 86.0 * 1.4, 0.0, 1.0) + n1(u * 23.0 + 3.1) * 2.6 * clamp(1.0 - a * 23.0 * 1.4, 0.0, 1.0);
}
float alturaAcabado(float fin, vec3 p, out float rug) {
  rug = 0.12; float h = 0.0;
  if (fin < 0.5) { rug = 0.09; }
  else if (fin < 1.5) { h = estrias(p.y); rug = 0.3; }
  else if (fin < 2.5) { h = estrias(length(p.xy)); rug = 0.25; }
  else if (fin < 3.5) { vec3 q = p * 260.0; float a = fwidth(q.x) + fwidth(q.y); h = h31(floor(q)) * 1.6 * clamp(1.0 - a * 0.9, 0.0, 1.0); rug = 0.52; }
  else if (fin < 4.5) { vec2 c = p.xy / 0.34, l1 = fract(c) - 0.5, l2 = fract(c + 0.5) - 0.5; float d = min(length(l1), length(l2)) * 0.34; h = estrias(d * 1.6) * 0.9; rug = 0.3; }
  else if (fin < 5.5) { rug = 0.15; }
  else if (fin < 6.5) { rug = 0.17; }
  else { float b = dot(p.xy, vec2(0.7071, 0.7071)) / 0.3, par = mod(floor(b), 2.0); vec2 dir = par < 0.5 ? vec2(0.8, -0.6) : vec2(0.6, -0.8); h = estrias(dot(p.xy, dir)) + smoothstep(0.4, 0.5, abs(fract(b) - 0.5)) * 1.2; rug = 0.27; }
  return h;
}
vec3 perturbar(vec3 pos, vec3 n, vec2 dH, float cara) {
  vec3 sx = dFdx(pos), sy = dFdy(pos), r1 = cross(sy, n), r2 = cross(n, sx); float det = dot(sx, r1) * cara;
  vec3 g = sign(det) * (dH.x * r1 + dH.y * r2); return normalize(abs(det) * n - g);
}
// hacia dónde van las estrías de cada acabado (en el plano de la pieza); cero si no las tiene
vec2 grano(float fin, vec3 p) {
  if (fin > 0.5 && fin < 1.5) return vec2(1.0, 0.0);
  if (fin > 1.5 && fin < 2.5) return normalize(vec2(-p.y, p.x) + 1e-5);
  if (fin > 3.5 && fin < 4.5) { vec2 c = p.xy / 0.34, l1 = fract(c) - 0.5, l2 = fract(c + 0.5) - 0.5, l = dot(l1, l1) < dot(l2, l2) ? l1 : l2; return normalize(vec2(-l.y, l.x) + 1e-5); }
  if (fin > 6.5) { float b = dot(p.xy, vec2(0.7071, 0.7071)) / 0.3, par = mod(floor(b), 2.0); return par < 0.5 ? vec2(0.6, 0.8) : vec2(0.8, 0.6); }
  return vec2(0.0);
}
// un metal estriado refleja como un haz de cilindros: se dobla la normal hacia ese cilindro
vec3 doblar(vec3 n, vec3 B, vec3 v, float cuanto) { vec3 c = cross(cross(B, v), B); float l = length(c); return l > 1e-4 ? normalize(mix(n, c / l, cuanto)) : n; }`;
function acabar(mat, U) {
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute vec4 aFin; varying vec4 vFin; varying vec3 vObj; varying vec3 vObjN; varying vec3 vEjeU; varying vec3 vEjeV;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvFin = aFin; vObj = position; vObjN = normal;\n#ifdef USE_INSTANCING\nmat3 mInst = mat3(instanceMatrix);\n#else\nmat3 mInst = mat3(1.0);\n#endif\nvEjeU = normalize(normalMatrix * (mInst * vec3(1.0, 0.0, 0.0))); vEjeV = normalize(normalMatrix * (mInst * vec3(0.0, 1.0, 0.0)));");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\n" + GLSL_COMUN)
      .replace("#include <shadowmap_pars_fragment>", "#include <shadowmap_pars_fragment>\n#include <shadowmask_pars_fragment>")
      .replace("#include <color_fragment>", /* glsl */ `#include <color_fragment>
        float rugA; float hA = alturaAcabado(vFin.x, vObj, rugA);
        float plano = pow(abs(normalize(vObjN).z), 8.0);
        if (vFin.w > 0.5) { vec2 ru = (vObj.xy - vec2(-1.74, -1.88)) / vec2(1.76, 0.22); if (ru.x > 0.0 && ru.x < 1.0 && ru.y > 0.0 && ru.y < 1.0) { float gr = texture2D(tRotulos, vec2(ru.x, 1.0 - (floor(vFin.w - 0.5) + 1.0 - ru.y) / 6.0)).r * plano * step(0.0, vObjN.z); hA -= gr * 30.0; rugA = mix(rugA, 0.22, gr); diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.74, 0.76, 0.8), gr * 0.9); } }
        if (vFin.x > 4.5 && vFin.x < 5.5) { float f = pow(1.0 - abs(dot(normalize(vViewPosition), normalize(vNormal))), 2.0); diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.2, 0.05, 0.32), f * 0.55); }
        float elegido = uSel < -0.5 ? 1.0 : (abs(vFin.y - uSel) < 0.5 || vFin.y > 6.5 ? 1.0 : uAtenua);
        diffuseColor.rgb *= elegido;
        if (abs(vFin.y - 6.0) < 0.5) diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.55, 0.75, 1.5) + vec3(0.0, 0.01, 0.05), uPulso);`)
      .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor = mix(0.1, rugA, plano);")
      .replace("#include <normal_fragment_maps>", "#include <normal_fragment_maps>\nnormal = perturbar(-vViewPosition, normal, vec2(dFdx(hA), dFdy(hA)) * 0.0005 * plano, faceDirection);\nvec2 gr2 = grano(vFin.x, vObj); if (dot(gr2, gr2) > 0.5) normal = doblar(normal, normalize(vEjeU * gr2.x + vEjeV * gr2.y), normalize(vViewPosition), (vFin.x > 6.5 ? 0.5 : 0.78) * plano);")
      .replace("#include <lights_fragment_end>", /* glsl */ `#include <lights_fragment_end>
        #ifdef USE_SHADOWMAP
          float som = mix(uOclusion, 1.0, getShadowMask()); reflectedLight.indirectSpecular *= som; reflectedLight.indirectDiffuse *= som;
        #endif`)
      .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\nif (vFin.x > 4.5 && vFin.x < 5.5) totalEmissiveRadiance += vec3(0.05, 0.14, 0.7) * uNoche * 0.12; totalEmissiveRadiance += vec3(0.1, 0.3, 1.0) * uPulso * 0.12 * step(abs(vFin.y - 6.0), 0.5);");
  };
  return mat;
}

export const hayWebGL2 = () => { try { const c = document.createElement("canvas"); return !!c.getContext("webgl2"); } catch (e) { return false; } };

export function crearMaquina(lienzo, op = {}) {
  const movil = !!op.movil, vertical = op.vertical !== undefined ? !!op.vertical : movil;
  const renderer = new WebGLRenderer({ canvas: lienzo, antialias: false, alpha: false, powerPreference: "high-performance", preserveDrawingBuffer: !!op.captura, stencil: false });
  renderer.setPixelRatio(1); renderer.toneMapping = NoToneMapping; renderer.shadowMap.enabled = op.sombras !== false; renderer.shadowMap.type = PCFShadowMap; renderer.setClearColor(0x040405, 1);
  const escena = new Scene(); escena.background = new Color(0x040405); escena.fog = new FogExp2(0x040405, 0.02);
  escena.environment = plato(renderer); escena.environmentIntensity = 1;
  const camara = new PerspectiveCamera(32, 1, 0.3, 90);
  const sol = new DirectionalLight(0xffffff, 1.7); sol.position.set(-7, 10, 13); sol.castShadow = op.sombras !== false;
  const sm = sol.shadow; sm.mapSize.set(op.mapaSombra || (movil ? 1024 : 2048), op.mapaSombra || (movil ? 1024 : 2048)); sm.camera.left = -9.5; sm.camera.right = 9.5; sm.camera.top = 9.5; sm.camera.bottom = -9.5; sm.camera.near = 4; sm.camera.far = 40; sm.bias = -0.0006; sm.normalBias = 0.012; sm.radius = 2.2;
  escena.add(sol, sol.target);

  /* ----------------------------------------------------------- piezas */
  const { piezas, geos, info } = trazar(vertical);
  const idioma = op.idioma === "en" ? "en" : "es", lienzoRotulos = dibujarRotulos(NOMBRES[idioma]), texRotulos = new CanvasTexture(lienzoRotulos); texRotulos.colorSpace = NoColorSpace; texRotulos.anisotropy = 4;
  const U = { uSel: { value: -1 }, uAtenua: { value: 0.22 }, uNoche: { value: 0 }, uOclusion: { value: 0.3 }, uPulso: { value: 0 }, tRotulos: { value: texRotulos } };
  const cifras = new CanvasTexture(dibujarCifras()); cifras.colorSpace = SRGBColorSpace; cifras.anisotropy = 4; cifras.wrapS = RepeatWrapping; cifras.wrapT = RepeatWrapping; cifras.repeat.set(1, -1); cifras.offset.set(0, 1);
  const factura = dibujarFactura(idioma, movil ? 1.5 : 2.5), texFactura = new CanvasTexture(factura.lienzo), texMascara = new CanvasTexture(factura.mascara); texFactura.colorSpace = SRGBColorSpace; texFactura.anisotropy = 8;
  const UP = { uLectura: { value: 0 }, uCampos: { value: 0 }, tMascara: { value: texMascara } };
  const mats = {
    metal: acabar(new MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.25 }), U),
    joya: new MeshPhysicalMaterial({ color: new Color(0.012, 0.06, 0.42), metalness: 0, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.03, emissive: new Color(0.02, 0.1, 0.7), emissiveIntensity: 0.25, envMapIntensity: 1.6 }),
    tambor: new MeshStandardMaterial({ map: cifras, metalness: 0.55, roughness: 0.34 }),
    cristal: new MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.0, transparent: true, opacity: 0.14, envMapIntensity: 2.2, depthWrite: false }),
  };
  const QT = new Quaternion(), ET = new Euler(), V = new Vector3();
  const grupos = new Map();
  piezas.forEach((p, i) => { p.i = i; const c = p.g + "|" + p.mat; if (!grupos.has(c)) grupos.set(c, []); grupos.get(c).push(p); });
  const N = piezas.length, mallas = [];
  // estado de cada pieza: su sitio en la máquina y su deriva cuando está suelta
  const hx = new Float32Array(N), hy = new Float32Array(N), hz = new Float32Array(N), hq = new Float32Array(N * 4), esc = new Float32Array(N), kk = new Float32Array(N), fase = new Float32Array(N), ord = new Float32Array(N), modu = new Uint8Array(N);
  const cx = new Float32Array(N), cy = new Float32Array(N), cz = new Float32Array(N), ejeC = new Float32Array(N * 3), velC = new Float32Array(N), fC = new Float32Array(N * 3), q0 = new Float32Array(N * 4), alza = new Float32Array(N), vx = new Float32Array(N), vy = new Float32Array(N), vz = new Float32Array(N), tam = new Float32Array(N);
  const r = azar(op.semilla || 11);
  for (const p of piezas) {
    const i = p.i; hx[i] = p.x; hy[i] = p.y; hz[i] = p.z; esc[i] = p.e; kk[i] = p.k; fase[i] = p.fase; ord[i] = p.ord; modu[i] = p.mod;
    ET.set(p.rx, p.ry, p.rz, "ZYX"); QT.setFromEuler(ET); hq[i * 4] = QT.x; hq[i * 4 + 1] = QT.y; hq[i * 4 + 2] = QT.z; hq[i * 4 + 3] = QT.w;
    const g = geos.get(p.g); if (!g.boundingSphere) g.computeBoundingSphere(); tam[i] = g.boundingSphere.radius * p.e;
    // suelta: sale despedida hacia fuera de su sitio y queda flotando. Las piezas grandes, al fondo.
    const grande = tam[i] > 1.15, a = r() * TAU, el = (r() - 0.5) * 2.2, R = grande ? 3 + r() * 3 : 1.6 + Math.pow(r(), 0.7) * 6.2;
    cx[i] = p.x * (grande ? 0.5 : 0.82) + Math.cos(a) * Math.cos(el) * R * 1.25; cy[i] = p.y * (grande ? 0.4 : 0.8) + Math.sin(el) * R * 0.8; cz[i] = (grande ? -5.5 - r() * 5 : (r() - 0.42) * 9.5) + Math.sin(a) * 1.5;
    let ax = r() - 0.5, ay = r() - 0.5, az = r() - 0.5; const l = Math.hypot(ax, ay, az) || 1; ejeC[i * 3] = ax / l; ejeC[i * 3 + 1] = ay / l; ejeC[i * 3 + 2] = az / l;
    velC[i] = (grande ? 0.04 : 0.12 + r() * 0.5) * (r() < 0.5 ? -1 : 1) / Math.max(0.5, Math.sqrt(tam[i] * 3)); fC[i * 3] = r() * TAU; fC[i * 3 + 1] = 0.1 + r() * 0.22; fC[i * 3 + 2] = r() * TAU;
    QT.setFromAxisAngle(V.set(r() - 0.5, r() - 0.5, r() - 0.5).normalize(), r() * TAU); q0[i * 4] = QT.x; q0[i * 4 + 1] = QT.y; q0[i * 4 + 2] = QT.z; q0[i * 4 + 3] = QT.w;
    alza[i] = 0.7 + r() * 1.6;
  }
  info.destacadas = [info.tambores[0], info.lupa, piezas.find((p) => p.g === "campana"), piezas.find((p) => p.g === "volante")].map((p) => p.i);
  (vertical ? [[-1.3, 3.0, 2.6], [1.3, 2.1, 3.6], [-0.9, 1.0, 4.2], [1.2, -0.1, 2.8]] : [[0.7, 1.7, 2.4], [3.3, 0.5, 3.3], [0.9, -1.2, 3.8], [3.6, -1.5, 1.4]]).forEach((c, k) => { const i = info.destacadas[k]; cx[i] = c[0]; cy[i] = c[1]; cz[i] = c[2]; velC[i] = 0.05 * (k % 2 ? -1 : 1); QT.setFromEuler(ET.set(0.25 - k * 0.12, -0.3 + k * 0.2, 0.2 * k, "XYZ")); q0[i * 4] = QT.x; q0[i * 4 + 1] = QT.y; q0[i * 4 + 2] = QT.z; q0[i * 4 + 3] = QT.w; fC[i * 3 + 1] = 0.08; });
  for (const [clave, lista] of grupos) {
    const [g, m] = clave.split("|"), geo = geos.get(g), malla = new InstancedMesh(geo, mats[m], lista.length);
    malla.instanceMatrix.setUsage(DynamicDrawUsage); malla.castShadow = m !== "cristal"; malla.receiveShadow = m !== "cristal"; malla.frustumCulled = false;
    if (m === "metal") { const a = new Float32Array(lista.length * 4), c = new Color(); lista.forEach((p, j) => { a[j * 4] = p.fin; a[j * 4 + 1] = p.mod; a[j * 4 + 2] = (p.i * 0.618) % 1; a[j * 4 + 3] = p.texto || 0; c.setRGB(p.tono[0], p.tono[1], p.tono[2]); malla.setColorAt(j, c); }); geo.setAttribute("aFin", new InstancedBufferAttribute(a, 4)); malla.instanceColor.needsUpdate = true; }
    if (m === "cristal") malla.renderOrder = 5;
    lista.forEach((p, j) => { p.malla = malla; p.j = j; });
    escena.add(malla); mallas.push(malla);
  }
  // el documento
  const d = info.documento, papel = new Mesh(new PlaneGeometry(d.w, d.h), new MeshStandardMaterial({ map: texFactura, metalness: 0, roughness: 0.82 }));
  papel.material.onBeforeCompile = (sh) => { Object.assign(sh.uniforms, UP); sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nuniform float uLectura, uCampos; uniform sampler2D tMascara;").replace("#include <emissivemap_fragment>", /* glsl */ `#include <emissivemap_fragment>
    float campo = texture2D(tMascara, vMapUv).r, leido = step(1.0 - vMapUv.y, uLectura) * uCampos;
    diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.45, 0.62, 1.0), campo * leido * 0.85);
    totalEmissiveRadiance += vec3(0.1, 0.3, 1.0) * campo * leido * 0.25;`); };
  papel.position.set(d.x, d.y, d.z); papel.receiveShadow = true; papel.castShadow = true; papel.visible = false; escena.add(papel);
  // la tapa: una platina con ventanas, y el grabado
  const pl = info.platina, zT = info.z.alto + 0.52, mod = (n) => info.modulos[n];
  const ventanas = [[mod("motor").x - 0.62, mod("motor").y - 1.32, 0.78], [mod("direccion").x, mod("direccion").y - 0.05, 1.5], [mod("finanzas").x + 0.6, mod("finanzas").y + 0.95, 0.0]];
  const lienzoGrabado = dibujarGrabado(null, [{ t: "D-CODE", y: 256, px: 120, peso: 700, esp: 8 }]), texGrabado = new CanvasTexture(lienzoGrabado); texGrabado.colorSpace = NoColorSpace; texGrabado.anisotropy = 8;
  const geoTapa = geoPlatina(pl.w + 0.3, pl.h + 0.3, 0.8, 0.12, ventanas.filter((v) => v[2] > 0));
  const UT = { tGrabado: { value: texGrabado }, uCaja: { value: [0, 0, 1, 1] } };
  const matTapa = new MeshStandardMaterial({ color: new Color(0.13, 0.135, 0.145), metalness: 1, roughness: 0.3 });
  matTapa.onBeforeCompile = (sh) => { Object.assign(sh.uniforms, UT); sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vObj; varying vec3 vObjN;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvObj = position; vObjN = normal;");
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", /* glsl */ `#include <common>
      varying vec3 vObj; varying vec3 vObjN; uniform sampler2D tGrabado; uniform vec4 uCaja;
      float h11(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
      float n1(float x) { float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(h11(i), h11(i + 1.0), f); }
      float grab(vec2 p) { vec2 uv = (p - uCaja.xy) / uCaja.zw + 0.5; return (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) ? 0.0 : texture2D(tGrabado, uv).r; }
      vec3 perturbar(vec3 pos, vec3 n, vec2 dH, float cara) { vec3 sx = dFdx(pos), sy = dFdy(pos), r1 = cross(sy, n), r2 = cross(n, sx); float det = dot(sx, r1) * cara; vec3 g = sign(det) * (dH.x * r1 + dH.y * r2); return normalize(abs(det) * n - g); }`)
      .replace("#include <color_fragment>", /* glsl */ `#include <color_fragment>
        float plano = pow(abs(normalize(vObjN).z), 8.0), gr = grab(vObj.xy) * plano;
        float u = atan(vObj.y, vObj.x), au = fwidth(u);
        float hT = (n1(u * 520.0) * clamp(1.0 - au * 700.0, 0.0, 1.0) + n1(u * 140.0) * 1.8 * clamp(1.0 - au * 190.0, 0.0, 1.0) + n1(u * 36.0) * 2.4) * length(vObj.xy) * 0.25 - gr * 26.0;
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.78, 0.8, 0.84), gr * 0.9);`)
      .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor = mix(0.12, mix(0.3, 0.42, gr), plano);")
      .replace("#include <normal_fragment_maps>", "#include <normal_fragment_maps>\nnormal = perturbar(-vViewPosition, normal, vec2(dFdx(hT), dFdy(hT)) * 0.0006 * plano, faceDirection);"); };
  const tapa = new Mesh(geoTapa, matTapa); tapa.castShadow = true; tapa.receiveShadow = true; tapa.visible = false; escena.add(tapa);
  info.grabado = vertical ? { x: mod("ventas").x + info.celda / 2, y: mod("ventas").y - info.celda * 0.1, w: 6.6, h: 3.3 } : { x: mod("ventas").x + 0.4, y: mod("ventas").y - 0.2, w: 6.6, h: 3.3 };
  UT.uCaja.value = [info.grabado.x, info.grabado.y, info.grabado.w, info.grabado.h];

  const revelado = crearRevelado(renderer, { muestras: op.muestras ?? (movil ? 0 : 4), tomas: op.tomas ?? (movil ? 14 : 36), nivelesHalo: movil ? 4 : 5 });

  /* ----------------------------------------------------------- estado */
  const est = { cap: 0, capObj: 0, T: 0, theta: 0, intro: op.intro === false ? 1 : 0, mano: 0, manoObj: 0, px: 0, py: 0, hayPuntero: false, vertical, ancho: 1, alto: 1, dpr: 1, lectura: 0, campos: 0, sel: -1, selMezcla: 0, selX: 0, selY: 0, golpe: -1, orbX: 0, orbY: 0, orbVX: 0, orbVY: 0, aguja: 0.35, agujaV: 0, agujaObj: 0.35, digitos: [0, 0, 0, 0, 0, 0], digObj: [0, 0, 0, 0, 0, 0], libre: null, forzar: null, escalaPx: 1, calidad: 0 };
  const mz = { montaje: 0, marcha: 0, noche: 0, tapa: 0, doc: 0, expo: 1, giro: 1, montajeTotal: 0, marchaTotal: 0 };
  const cam = { p: [0, 0, 10], m: [0, 0, 0], fov: 32, foco: 10, ab: 0.3, d: [0, 0], e: [0, 0, 10] };
  const A = new Float32Array(8);
  let escuchas = [];

  function medir() {
    const dpr = Math.min(op.dpr || window.devicePixelRatio || 1, movil ? 2 : 2), w = lienzo.clientWidth || 1, h = lienzo.clientHeight || 1;
    let W = Math.round(w * dpr), H = Math.round(h * dpr); const tope = (op.pixeles || (movil ? 1.5e6 : 3.2e6)) * est.escalaPx;
    if (W * H > tope) { const k = Math.sqrt(tope / (W * H)); W = Math.round(W * k); H = Math.round(H * k); }
    est.ancho = W; est.alto = H; est.dpr = W / w; est.vertical = vertical;
    renderer.setSize(W, H, false); revelado.medir(W, H); camara.aspect = W / H;
  }

  function mezclar() {
    const c = fijar(est.cap, 0, CAPS.length - 1), a = Math.min(CAPS.length - 2, Math.floor(c)), f = c - a, t = cubica(fijar((f - 0.12) / 0.76));
    const X = CAPS[a], Y = CAPS[a + 1], cx_ = vertical ? "v" : "h", P = X[cx_], Q = Y[cx_];
    for (const k in X) if (typeof X[k] === "number") mz[k] = mezcla(X[k], Y[k], t);
    for (let j = 0; j < 3; j++) { cam.p[j] = mezcla(P.p[j], Q.p[j], t); cam.m[j] = mezcla(P.m[j], Q.m[j], t); }
    // entre dos capítulos la cámara no va en línea recta: se aparta un poco, como una grúa
    const arco = Math.sin(Math.PI * t) * Math.min(4, Math.hypot(P.p[0] - Q.p[0], P.p[1] - Q.p[1], P.p[2] - Q.p[2]) * 0.16); cam.p[2] += arco;
    cam.fov = mezcla(P.fov, Q.fov, t); cam.foco = mezcla(P.foco, Q.foco, t) + arco * 0.8; cam.ab = mezcla(P.ab, Q.ab, t); cam.d[0] = mezcla(P.d[0], Q.d[0], t); cam.d[1] = mezcla(P.d[1], Q.d[1], t);
    // un área elegida: la cámara se acerca a su módulo
    if (est.selMezcla > 0.002) { const w = est.selMezcla * fijar(1 - Math.abs(est.cap - 2) * 1.7), tp = vertical ? [est.selX - 1.0, est.selY - 3.6, 10.5] : [est.selX - 2.4, est.selY - 3.4, 8.4], tm = [est.selX, est.selY, 0.3];
      for (let j = 0; j < 3; j++) { cam.p[j] = mezcla(cam.p[j], tp[j], w); cam.m[j] = mezcla(cam.m[j], tm[j], w); } cam.foco = mezcla(cam.foco, Math.hypot(tp[0] - tm[0], tp[1] - tm[1], tp[2] - tm[2]), w); cam.ab = mezcla(cam.ab, 0.32, w); cam.d[0] = mezcla(cam.d[0], vertical ? 0 : 0.3, w); }
    if (est.libre) { const L = est.libre; for (const k of ["p", "m", "d"]) if (L[k]) for (let j = 0; j < L[k].length; j++) cam[k][j] = L[k][j]; for (const k of ["fov", "foco", "ab"]) if (L[k] !== undefined) cam[k] = L[k]; }
    if (est.forzar) for (const k in est.forzar) mz[k] = est.forzar[k];
    // el estallido del principio y el «mantén pulsado»
    const montaje = Math.max(mz.montaje, est.mano, est.cap < 1 ? 1 - saleCubica(fijar(est.intro)) : 0);
    for (let m = 0; m < 8; m++) A[m] = fijar(montaje * 1.94 - TURNO[m]);
    mz.montajeTotal = montaje; mz.marchaTotal = Math.max(mz.marcha, est.mano > 0.98 ? 1 : 0);
  }

  const M = new Matrix4(), me = M.elements, qa = [0, 0, 0, 1], qb = [0, 0, 0, 1];
  const qEje = (o, x, y, z, a) => { const s = Math.sin(a / 2); o[0] = x * s; o[1] = y * s; o[2] = z * s; o[3] = Math.cos(a / 2); };
  const qMul = (o, a, ai, b) => { const ax = a[ai], ay = a[ai + 1], az = a[ai + 2], aw = a[ai + 3], bx = b[0], by = b[1], bz = b[2], bw = b[3]; o[0] = aw * bx + ax * bw + ay * bz - az * by; o[1] = aw * by - ax * bz + ay * bw + az * bx; o[2] = aw * bz + ax * by - ay * bx + az * bw; o[3] = aw * bw - ax * bx - ay * by - az * bz; };
  const qT = [0, 0, 0, 1], qH = [0, 0, 0, 1], qC = [0, 0, 0, 1];
  const rayo = { o: [0, 0, 0], d: [0, 0, -1] };
  function rayoPuntero() { V.set(est.px, est.py, 0.5).unproject(camara); rayo.o[0] = camara.position.x; rayo.o[1] = camara.position.y; rayo.o[2] = camara.position.z; V.sub(camara.position).normalize(); rayo.d[0] = V.x; rayo.d[1] = V.y; rayo.d[2] = V.z; }
  const posPieza = new Float32Array(N * 3);

  function simular(dt) {
    const t = est.T, th = est.theta, marcha = mz.marchaTotal, viento = est.hayPuntero && mz.montajeTotal < 0.6;
    if (viento) rayoPuntero();
    const osc = Math.sin(t * TAU * 1.6) * marcha;
    for (const p of piezas) {
      const i = p.i, a = A[modu[i]];
      // dónde está su sitio (y cómo gira en él si la máquina marcha)
      let x = hx[i], y = hy[i], z = hz[i], giro = 0, ejeX = false;
      switch (p.tipo) {
        case "rueda": case "conRueda": case "eje": case "giro": case "muelle": giro = fase[i] + kk[i] * th; break;
        case "volante": giro = (p.dato ? p.dato.amp : 2.3) * osc; break;
        case "ancora": giro = 0.13 * Math.tanh(Math.sin(t * TAU * 1.6) * 5) * marcha; break;
        case "trinquete": { const s = (((fase[i] + kk[i] * th) * p.dato.N / TAU) % 1 + 1) % 1; giro = 0.075 * (kk[i] > 0 ? s : 1 - s); break; }
        case "martillo": { const s = ((((p.dato.fr || 0) + (p.dato.kr || 0) * th) * 8 / TAU) % 1 + 1) % 1, lev = (p.dato.kr > 0 ? s : 1 - s); giro = 0.2 * (lev < 0.92 ? lev / 0.92 : (1 - lev) / 0.08) * marcha * (mz.doc > 0.5 ? 0 : 1) + 0.03; if (est.golpe >= 0) { const g = est.golpe / 0.5; giro = 0.03 + 0.34 * (g < 0.62 ? Math.sin((g / 0.62) * Math.PI / 2) : Math.max(0, 1 - (g - 0.62) / 0.1)); }
          if (p.dato.cabeza) { const ang = p.rz + giro; x += Math.cos(ang) * p.dato.largo; y += Math.sin(ang) * p.dato.largo; } break; }
        case "seguidor": case "cremallera": case "pinonLibre": { const L = p.dato.leva, s = ((((L.ang - (L.f0 + L.k0 * th)) / TAU) % 1) + 1) % 1, v = (L.k0 > 0 ? 1 - s : s) * (L.r1 - L.r0);
          if (p.tipo === "seguidor") giro = -Math.atan(v / p.dato.largo) * 1.0; else if (p.tipo === "cremallera") x += v * 0.9; else giro = -(v * 0.9) / p.dato.r; break; }
        case "tambor": giro = est.digitos[p.dato.k] * (TAU / 10); ejeX = true; break;
        case "lupa": y += (0.5 - est.lectura) * 1.05 * mz.doc; break;
        case "aguja": giro = -est.aguja * 2.14; break;
        case "corona": giro = th * 0.6; break;
        case "pixel": break;
      }
      if (ejeX) qEje(qT, 1, 0, 0, giro); else qEje(qT, 0, 0, 1, giro);
      qMul(qH, hq, i * 4, qT);
      let X = x, Y = y, Zp = z, qx = qH[0], qy = qH[1], qz = qH[2], qw = qH[3];
      if (a < 0.9995) {
        // suelta: flota, gira despacio, y el puntero la aparta
        const e = cubica(fijar((a - ord[i] * 0.62) / 0.38));
        const g = mz.giro, w = t * (0.25 + 0.75 * g);
        let sx = cx[i] + Math.sin(w * fC[i * 3 + 1] + fC[i * 3]) * 0.35, sy = cy[i] + Math.sin(w * fC[i * 3 + 1] * 0.8 + fC[i * 3 + 2]) * 0.3, sz = cz[i] + Math.cos(w * fC[i * 3 + 1] * 0.6 + fC[i * 3]) * 0.3;
        if (viento && tam[i] < 1.15) { const wx = sx - rayo.o[0], wy = sy - rayo.o[1], wz = sz - rayo.o[2], s = wx * rayo.d[0] + wy * rayo.d[1] + wz * rayo.d[2], ex = wx - rayo.d[0] * s, ey = wy - rayo.d[1] * s, ez = wz - rayo.d[2] * s, dd = Math.hypot(ex, ey, ez) || 0.001, f = dd < 1.5 ? ((1 - dd / 1.5) ** 2 * 1.1) / dd : 0; vx[i] += (ex * f - vx[i]) * 0.08; vy[i] += (ey * f - vy[i]) * 0.08; vz[i] += (ez * f - vz[i]) * 0.08; } else { vx[i] *= 0.95; vy[i] *= 0.95; vz[i] *= 0.95; }
        sx += vx[i]; sy += vy[i]; sz += vz[i];
        qEje(qT, ejeC[i * 3], ejeC[i * 3 + 1], ejeC[i * 3 + 2], velC[i] * w * 2.2 + (p.tipo === "tornillo" ? 0 : 0)); qMul(qC, q0, i * 4, qT);
        if (e <= 0.0005) { X = sx; Y = sy; Zp = sz; qx = qC[0]; qy = qC[1]; qz = qC[2]; qw = qC[3]; }
        else {
          const arco = 4 * e * (1 - e) * alza[i] + (1 - e) * (1 - e) * 0.0;
          X = sx + (x - sx) * e; Y = sy + (y - sy) * e; Zp = sz + (z - sz) * e + arco;
          // los tornillos entran girando
          if (p.tipo === "tornillo") { qEje(qT, 0, 0, 1, (1 - e) * 14); qa[0] = qH[0]; qa[1] = qH[1]; qa[2] = qH[2]; qa[3] = qH[3]; qMul(qH, qa, 0, qT); Zp += (1 - e) * 0.25; }
          let dot = qC[0] * qH[0] + qC[1] * qH[1] + qC[2] * qH[2] + qC[3] * qH[3]; const sg = dot < 0 ? -1 : 1; dot = Math.abs(dot);
          const ang = Math.acos(Math.min(1, dot)), sn = Math.sin(ang); let fa = 1 - e, fb = e; if (sn > 1e-4) { fa = Math.sin((1 - e) * ang) / sn; fb = Math.sin(e * ang) / sn; } fb *= sg;
          qx = qC[0] * fa + qH[0] * fb; qy = qC[1] * fa + qH[1] * fb; qz = qC[2] * fa + qH[2] * fb; qw = qC[3] * fa + qH[3] * fb;
        }
      }
      posPieza[i * 3] = X; posPieza[i * 3 + 1] = Y; posPieza[i * 3 + 2] = Zp;
      const s = esc[i], x2 = qx + qx, y2 = qy + qy, z2 = qz + qz, xx = qx * x2, xy = qx * y2, xz = qx * z2, yy = qy * y2, yz = qy * z2, zz = qz * z2, wx = qw * x2, wy = qw * y2, wz = qw * z2;
      const o = p.malla.instanceMatrix.array, b = p.j * 16;
      o[b] = (1 - (yy + zz)) * s; o[b + 1] = (xy + wz) * s; o[b + 2] = (xz - wy) * s; o[b + 3] = 0; o[b + 4] = (xy - wz) * s; o[b + 5] = (1 - (xx + zz)) * s; o[b + 6] = (yz + wx) * s; o[b + 7] = 0; o[b + 8] = (xz + wy) * s; o[b + 9] = (yz - wx) * s; o[b + 10] = (1 - (xx + yy)) * s; o[b + 11] = 0; o[b + 12] = X; o[b + 13] = Y; o[b + 14] = Zp; o[b + 15] = 1;
    }
    for (const m of mallas) m.instanceMatrix.needsUpdate = true;
  }

  function encuadrar() {
    const pv = est.hayPuntero ? 1 : 0, cerca = fijar(Math.hypot(cam.p[0] - cam.m[0], cam.p[1] - cam.m[1], cam.p[2] - cam.m[2]) / 9, 0.25, 1.6);
    // órbita con inercia: se arrastra y vuelve sola
    est.orbX += est.orbVX; est.orbY += est.orbVY; est.orbVX *= 0.9; est.orbVY *= 0.9; est.orbX *= 0.985; est.orbY *= 0.985;
    const ox_ = cam.p[0] - cam.m[0], oy_ = cam.p[1] - cam.m[1], oz_ = cam.p[2] - cam.m[2], rad = Math.hypot(ox_, oy_, oz_);
    let az = Math.atan2(ox_, oz_) + est.orbX + (Math.sin(est.T * 0.21) * 0.012 + est.px * 0.05 * pv), el = Math.asin(oy_ / rad) + est.orbY + (Math.sin(est.T * 0.27 + 1) * 0.008 + est.py * 0.03 * pv); el = fijar(el, -1.35, 1.35);
    const intro = est.cap < 1 ? (1 - saleCubica(fijar(est.intro))) * (1 - est.cap) : 0, R = rad * (1 + intro * 0.9);
    cam.e[0] = cam.m[0] + Math.sin(az) * Math.cos(el) * R; cam.e[1] = cam.m[1] + Math.sin(el) * R; cam.e[2] = cam.m[2] + Math.cos(az) * Math.cos(el) * R;
    camara.position.set(cam.e[0], cam.e[1], cam.e[2]); camara.up.set(0, 1, 0); camara.lookAt(cam.m[0], cam.m[1], cam.m[2]);
    camara.fov = cam.fov; camara.near = Math.max(0.2, R * 0.04); camara.far = R + 60; camara.updateProjectionMatrix();
    camara.projectionMatrix.elements[8] = -cam.d[0]; camara.projectionMatrix.elements[9] = -cam.d[1]; camara.projectionMatrixInverse.copy(camara.projectionMatrix).invert();
    camara.updateMatrixWorld(true);
    void cerca;
  }

  function pintar(dt) {
    mezclar(); encuadrar(); simular(dt);
    // luz, noche, tapa, documento
    const noche = mz.noche; escena.environmentIntensity = mezcla(1, 0.16, noche) * mz.expo; sol.intensity = mezcla(1.7, 0.9, noche); sol.color.setRGB(mezcla(1, 0.72, noche), mezcla(1, 0.8, noche), 1);
    U.uNoche.value = noche; mats.joya.emissiveIntensity = mezcla(0.2, 1.1, noche); U.uSel.value = est.selMezcla > 0.02 ? est.sel : -1; U.uAtenua.value = mezcla(1, 0.2, est.selMezcla);
    U.uPulso.value = fijar(1 - Math.abs(A[6] - 0.55) / 0.5) * (1 - fijar((mz.montajeTotal - 0.97) / 0.03)) * 0.9;
    papel.visible = mz.doc > 0.01; if (papel.visible) { const dd = info.documento; papel.position.set(dd.x, dd.y - (1 - saleCubica(mz.doc)) * 2.4, dd.z + (1 - mz.doc) * 0.5); UP.uLectura.value = est.lectura; UP.uCampos.value = est.campos; }
    tapa.visible = mz.tapa > 0.004; if (tapa.visible) { const e = cubica(fijar(mz.tapa)); tapa.position.set((1 - e) * -1.5, (1 - e) * 1.0, zT + (1 - e) * 9); tapa.rotation.set((1 - e) * 0.5, (1 - e) * -0.35, 0); }
    const R = revelado.U, alto = est.alto; R.uFoco.value = cam.foco; R.uApertura.value = cam.ab * (est.forzar && est.forzar.ab !== undefined ? 1 : 1); R.uMaxDesenfoque.value = Math.max(4, alto * 0.024); R.uExposicion.value = mz.expo * 0.8; R.uHalo.value = mezcla(0.22, 0.6, noche); R.uVineta.value = 0.55; R.uGrano.value = 0.03;
    renderer.setRenderTarget(revelado.destino); renderer.render(escena, camara); revelado.revelar(camara, est.T);
  }

  let vivo = false, raf = 0, previo = 0; const alCuadro = [];
  function avanzar(dt) {
    est.T += dt;
    est.cap += (est.capObj - est.cap) * (1 - Math.exp(-dt * (op.captura ? 60 : 5.5)));
    est.mano += (est.manoObj - est.mano) * (1 - Math.exp(-dt * (est.manoObj > est.mano ? 2.4 : 3.2)));
    est.selMezcla += ((est.sel >= 0 ? 1 : 0) - est.selMezcla) * (1 - Math.exp(-dt * 4));
    if (est.sel >= 0) { const mo = info.modulos[MODULOS[est.sel]], k = est.selMezcla < 0.05 ? 1 : 1 - Math.exp(-dt * 4); est.selX += (mo.x - est.selX) * k; est.selY += (mo.y - est.selY) * k; }
    if (est.golpe >= 0) { est.golpe += dt; if (est.golpe > 0.7) est.golpe = -1; }
    est.theta += dt * 0.55 * mz.marchaTotal * (mz.vel || 1);
    // la aguja: un muelle; las cifras: giran hasta su valor
    est.agujaV += ((est.agujaObj - est.aguja) * 40 - est.agujaV * 6.5) * dt; est.aguja += est.agujaV * dt;
    for (let k = 0; k < 6; k++) est.digitos[k] += (est.digObj[k] - est.digitos[k]) * (1 - Math.exp(-dt * (3.2 + k * 0.5)));
    pintar(dt); for (const f of alCuadro) f(dt);
  }
  function bucle(ahora) { raf = requestAnimationFrame(bucle); const dt = Math.min(0.05, (ahora - previo) / 1000 || 0.016); previo = ahora; avanzar(dt); }

  medir();

  const api = {
    N, est, cam, info, capitulos: CAPITULOS, renderer, escena, camara,
    capitulo(c, ya) { est.capObj = fijar(c, 0, CAPS.length - 1); if (ya) est.cap = est.capObj; },
    puntero(nx, ny, hay) { est.px = nx; est.py = ny; est.hayPuntero = !!hay; },
    arrastrar(dx, dy) { est.orbVX += -dx * 0.0016; est.orbVY += dy * 0.0012; },
    sostener(si) { est.manoObj = si ? 1 : 0; },
    intro(v) { est.intro = v; },
    area(m) { est.sel = m === null || m === undefined || m === "" ? -1 : typeof m === "number" ? m : MODULOS.indexOf(m); },
    golpe() { est.golpe = 0; },
    factura(datos) { dibujarFactura(idioma, movil ? 1.5 : 2.5, datos, factura); texFactura.needsUpdate = true; texMascara.needsUpdate = true; },
    redibujar() { dibujarRotulos(NOMBRES[idioma], lienzoRotulos); texRotulos.needsUpdate = true; cifras.image = dibujarCifras(); cifras.needsUpdate = true; },
    lectura(v, campos) { est.lectura = v; if (campos !== undefined) est.campos = campos; },
    registro(n) { const s = String(Math.round(n)).padStart(6, "0").slice(-6); for (let k = 0; k < 6; k++) est.digObj[k] = Math.ceil(est.digitos[k] / 10 - 0.001) * 10 + +s[k] + 10 * (1 + (k % 2)); },
    indicador(v) { est.agujaObj = fijar(v); },
    grabar(lineas) { dibujarGrabado(lienzoGrabado, lineas); texGrabado.needsUpdate = true; },
    rodaje(libre, forzar) { est.libre = libre || null; est.forzar = forzar || null; },
    proyectar(x, y, z, o = {}) { V.set(x, y, z).project(camara); o.x = (V.x * 0.5 + 0.5) * lienzo.clientWidth; o.y = (1 - (V.y * 0.5 + 0.5)) * lienzo.clientHeight; o.visible = V.z < 1 && Math.abs(V.x) < 1.2 && Math.abs(V.y) < 1.2; return o; },
    pieza(i, o = {}) { return api.proyectar(posPieza[i * 3], posPieza[i * 3 + 1], posPieza[i * 3 + 2], o); },
    campo(u, v, o = {}) { const dd = info.documento; return api.proyectar(dd.x + (u - 0.5) * dd.w, dd.y + (v - 0.5) * dd.h, dd.z, o); },
    tambor(k, o = {}) { const p = info.tambores[k]; return api.proyectar(p.x, p.y, p.z + 0.3, o); },
    modulo(nombre, o = {}) { const m = info.modulos[nombre]; return api.proyectar(m.x, m.y, 0.5, o); },
    alCuadro(f) { alCuadro.push(f); }, medir,
    paso(dt = 1 / 60) { avanzar(dt); },
    calidad(n) { est.calidad = n; est.escalaPx = [1, 0.72, 0.5, 0.36][Math.min(3, n)]; if (n >= 2) { revelado.tomas(movil ? 8 : 16); } if (n >= 3) renderer.shadowMap.enabled = false; medir(); },
    iniciar() { if (vivo) return; vivo = true; previo = performance.now(); raf = requestAnimationFrame(bucle); },
    parar() { vivo = false; cancelAnimationFrame(raf); },
    get vivo() { return vivo; },
    liberar() { api.parar(); revelado.liberar(); renderer.dispose(); escuchas.forEach((f) => f()); },
  };
  return api;
}
