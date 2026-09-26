/* ==========================================================================
   D-CODE · EL NÚCLEO — motor de realismo (Three.js r180, vendorizado)
   ==========================================================================
   Un objeto físico, no una ilustración: un mecanismo de precisión torneado
   cuyas seis capas son las seis capas de D-Code OS, tal como las nombra la
   web de producción, de abajo arriba:

     Zócalo         Aluminio anodizado negro, canto moleteado, grabado láser.
     Datos          Cerámica técnica blanca, surcos de torneado.
     Automatizac.   Titanio hilado (anisotropía circular) con 8 tomas: los
                    ocho departamentos, cada uno con su luz de estado.
     IA             Vidrio ahumado con refracción y dispersión; dentro, un
                    circuito que se enciende cuando el sistema "piensa".
     Interfaces     Bisel de acero pulido y esfera de vidrio negro con su
                    escala: la interfaz.
     Monitorización Collar de aluminio y cúpula de vidrio: el sensor.
     Mejora contin. Un aro que orbita el conjunto: el ciclo mensual.
     Cables         Fibra con funda de caucho: las integraciones.

   Realismo: HDRI fotográfico de estudio (CC0) como luz y reflejo, PBR
   físico (anisotropía, clearcoat, transmisión, dispersión), mapas de normal
   y rugosidad con uso real (huellas, microarañazos, moleteado, torneado),
   sombra suave sobre un ciclorama continuo, tone mapping Khronos Neutral,
   bloom solo en lo que emite luz y un pase de cine (viñeta + grano).
   ========================================================================== */

import * as THREE from "/assets/vendor/three/three.module.min.js";
import { EXRLoader } from "/assets/vendor/three/addons/loaders/EXRLoader.js";

const TAU = Math.PI * 2;

/* Los ocho departamentos del sitio, en el orden de sus tomas. */
export const DEPARTAMENTOS = [
  { id: "comercial", nombre: "Comercial", color: 0x43e0ff },
  { id: "marketing", nombre: "Marketing", color: 0xff6b9d },
  { id: "clientes", nombre: "Clientes", color: 0x35e0a1 },
  { id: "produccion", nombre: "Producción", color: 0xffb43a },
  { id: "finanzas", nombre: "Finanzas", color: 0x5b8cff },
  { id: "soporte", nombre: "Soporte", color: 0x2dd4bf },
  { id: "administracion", nombre: "Administración", color: 0x8b93ff },
  { id: "direccion", nombre: "Dirección", color: 0xa78bfa },
];
export const CAPAS = ["Datos", "Automatizaciones", "IA", "Interfaces", "Monitorización", "Mejora continua"];

/* ------------------------------------------------------------ ESTADOS */
const E = (o) => Object.assign({ desalineado: 0, explosion: 0, corte: 0, escaneo: 0, medida: 0, ia: 0.6, cables: 1, orbita: 1, cam: "heroe" }, o);
export const ESTADOS = {
  ensamblado:  E({}),
  desalineado: E({ desalineado: 1, cables: 0, ia: 0.1, orbita: 0, cam: "bajo" }),
  escaneo:     E({ desalineado: 0.35, cables: 0.3, escaneo: 1, ia: 0.3, cam: "alto" }),
  anatomia:    E({ explosion: 1, cables: 0, cam: "anatomia" }),
  corte:       E({ corte: 1, cam: "corte" }),
  implantar:   E({ cam: "tres" }),
  medir:       E({ medida: 1, ia: 0.9, cam: "tres" }),
  regimen:     E({ ia: 0.8, cam: "lejos" }),
  macro:       E({ ia: 1, cam: "macro" }),
  cierre:      E({ ia: 1, cam: "cierre" }),
};
/* Cámaras: posición, objetivo, desplazamiento de vista (fracción) y FOV. */
const CAMS = {
  heroe:    { p: [11.6, 7.4, 15.4], t: [0, 1.15, 0], vx: -0.24, fov: 26 },
  bajo:     { p: [11.2, 3.6, 14.6], t: [0, 1.3, 0], vx: -0.24, fov: 28 },
  alto:     { p: [5.5, 16.5, 10.5], t: [0, 1.0, 0], vx: -0.24, fov: 28 },
  anatomia: { p: [17.5, 8.2, 16.5], t: [0, 3.35, 0], vx: -0.22, fov: 30 },
  corte:    { p: [12.5, 6.5, 7.5], t: [0, 1.3, 0], vx: -0.24, fov: 26 },
  tres:     { p: [13, 10, 15.5], t: [0, 1.1, 0], vx: -0.24, fov: 26 },
  lejos:    { p: [15.5, 12, 19.5], t: [0, 1.0, 0], vx: 0, fov: 26 },
  macro:    { p: [2.4, 6.2, 4.8], t: [0, 2.7, 0], vx: 0, fov: 30 },
  cierre:   { p: [12.5, 5.2, 16.5], t: [0, 4.4, 0], vx: 0, fov: 26 },
};

function amort(a, b, dt, v) { return a + (b - a) * (1 - Math.exp(-v * dt)); }
function ruido(i, s) {
  let h = (Math.imul(i ^ s, 0x27d4eb2d) ^ (i + s * 0x9e3779b9)) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b) >>> 0; h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
function lienzo(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }

/* Perfil de un anillo torneado con cantos redondeados (radio b): el canto
   redondeado es lo que atrapa la luz y hace que una pieza parezca mecanizada
   y no modelada. Devuelve puntos (r, y) para LatheGeometry. */
function perfilAnillo(rIn, rOut, h, b, n = 3) {
  const P = [];
  const arco = (cx, cy, a0, a1) => { for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * (i / n); P.push(new THREE.Vector2(cx + Math.cos(a) * b, cy + Math.sin(a) * b)); } };
  if (rIn > 0.001) {
    P.push(new THREE.Vector2(rIn, b));
    arco(rIn + b, b, Math.PI, 1.5 * Math.PI);          // interior abajo
  } else P.push(new THREE.Vector2(0.0001, 0));
  arco(rOut - b, b, 1.5 * Math.PI, 2 * Math.PI);        // exterior abajo
  arco(rOut - b, h - b, 0, 0.5 * Math.PI);              // exterior arriba
  if (rIn > 0.001) {
    arco(rIn + b, h - b, 0.5 * Math.PI, Math.PI);        // interior arriba
    P.push(new THREE.Vector2(rIn, b));
  } else P.push(new THREE.Vector2(0.0001, h));
  return P;
}

/* ------------------------------------------------------------ CALIDAD */
export function detectarCalidad() {
  const q = new URLSearchParams(location.search).get("calidad");
  if (q && PERFIL[q]) return q;
  const tactil = window.matchMedia("(pointer: coarse)").matches;
  const estrecho = window.matchMedia("(max-width: 760px)").matches;
  const mem = navigator.deviceMemory || 8, nucleos = navigator.hardwareConcurrency || 8;
  let gpu = "";
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    const ext = gl && gl.getExtension("WEBGL_debug_renderer_info");
    gpu = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
  } catch (e) { /* sin datos */ }
  if (/swiftshader|llvmpipe|software|basic render/i.test(gpu)) return "estatica";
  if (mem <= 2 || nucleos <= 2) return "baja";
  if (tactil || estrecho || mem <= 4) return "media";
  return "alta";
}
const PERFIL = {
  alta:     { dpr: 1.75, sombra: 2048, post: true,  vidrio: true,  segs: 160 },
  media:    { dpr: 1.4,  sombra: 1024, post: true,  vidrio: false, segs: 112 },
  baja:     { dpr: 1.0,  sombra: 512,  post: false, vidrio: false, segs: 80 },
  estatica: { dpr: 1.0,  sombra: 1024, post: true,  vidrio: false, segs: 112 },
  foto:     { dpr: 2.0,  sombra: 2048, post: true,  vidrio: true,  segs: 192 },
};

/* ------------------------------------------------------------ TEXTURAS */
const TEX = "/assets/img/nucleo/tex/";
function cargarTex(url, color, rep) {
  const t = new THREE.TextureLoader().load(url);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  if (rep) t.repeat.set(rep[0], rep[1]);
  t.anisotropy = 8;
  return t;
}

/* La esfera de la capa Interfaces: escala de 120 marcas y los nombres de
   las seis capas grabados alrededor, como el bisel de un instrumento. */
function texturaEsfera() {
  const S = 1024, c = lienzo(S, S), x = c.getContext("2d");
  x.fillStyle = "#050608"; x.fillRect(0, 0, S, S);
  x.translate(S / 2, S / 2);
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * TAU, largo = i % 10 === 0 ? 34 : i % 5 === 0 ? 22 : 12;
    x.strokeStyle = i % 10 === 0 ? "rgba(236,232,225,.95)" : "rgba(236,232,225,.55)";
    x.lineWidth = i % 10 === 0 ? 3 : 1.6;
    x.beginPath(); x.moveTo(Math.cos(a) * 470, Math.sin(a) * 470); x.lineTo(Math.cos(a) * (470 - largo), Math.sin(a) * (470 - largo)); x.stroke();
  }
  x.fillStyle = "rgba(236,232,225,.82)"; x.font = "500 26px 'JetBrains Mono', monospace"; x.textAlign = "center";
  CAPAS.forEach((n, i) => {
    const a = (i / CAPAS.length) * TAU - Math.PI / 2;
    x.save(); x.rotate(a + Math.PI / 2); x.fillText(n.toUpperCase(), 0, -392); x.restore();
  });
  x.strokeStyle = "rgba(76,125,255,.9)"; x.lineWidth = 2; x.beginPath(); x.arc(0, 0, 330, 0, TAU); x.stroke();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}
/* Grabado láser del zócalo: se nota como diferencia de rugosidad (el metal
   grabado es mate), no como pintura. */
function texturaGrabado() {
  const S = 1024, c = lienzo(S, S), x = c.getContext("2d");
  x.fillStyle = "#b8b8b8"; x.fillRect(0, 0, S, S); // rugosidad base ~0.72
  x.translate(S / 2, S / 2);
  x.fillStyle = "#ffffff"; x.font = "600 30px 'JetBrains Mono', monospace"; x.textAlign = "center";
  const txt = "D-CODE PARTNERS  ·  SISTEMA OPERATIVO EMPRESARIAL  ·  MADRID  ·  ";
  for (let i = 0; i < txt.length; i++) {
    x.save(); x.rotate((i / txt.length) * TAU); x.fillText(txt[i], 0, -470); x.restore();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.NoColorSpace;
  return t;
}

/* ------------------------------------------------------------ LA PIEZA */
export class Nucleo {
  constructor(canvas, o = {}) {
    this.canvas = canvas;
    this.o = o;
    this.calidad = o.calidad || detectarCalidad();
    this.perfil = Object.assign({}, PERFIL[this.calidad]);
    this.quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches || this.calidad === "estatica" || this.calidad === "foto";
    this.claro = !!o.claro;

    const r = this.renderer = new THREE.WebGLRenderer({ canvas, antialias: !this.perfil.post, alpha: true, premultipliedAlpha: true, powerPreference: "high-performance", preserveDrawingBuffer: this.calidad === "foto" });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.perfil.dpr));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.NeutralToneMapping;
    r.toneMappingExposure = 1.0;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFShadowMap;
    r.localClippingEnabled = true;
    if ("transmissionResolutionScale" in r && this.calidad !== "alta" && this.calidad !== "foto") r.transmissionResolutionScale = 0.5;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(26, 1, 0.3, 200);
    this._v = new THREE.Vector3(); this._v2 = new THREE.Vector3();
    this.corte = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 60); // lejos = sin corte

    this._estudio();
    this._luces();
    this._materiales();
    this._pieza();

    this.estado = Object.assign({}, ESTADOS[o.estado || "ensamblado"]);
    this.objetivo = Object.assign({}, this.estado);
    const c = CAMS[this.estado.cam];
    this.cam = { p: new THREE.Vector3(...c.p), t: new THREE.Vector3(...c.t), vx: c.vx, fov: c.fov };
    this.camObj = c;
    this.encuadre = null;
    this.puntero = { x: 0, y: 0, sx: 0, sy: 0 };
    this.giro = 0.6; this.vgiro = 0;
    this.tiempo = 0;
    this.visible = true; this.oculta = false; this.raf = null;
    this.fotogramas = [];
    this.focos = new Set();
    if (!this.quieto && !o.sinEntrada) this._entrada = 1; // la pieza se monta al llegar
    this._resize();
  }

  _estudio() {
    // Ciclorama: el suelo y el fondo son del mismo tono, así la pieza se
    // apoya en un estudio infinito, como en una fotografía de producto.
    // Lienzo transparente: el fondo es la propia página (sin costura de
    // color); el suelo solo recoge la sombra de la pieza.
    const fondo = this.fondo = new THREE.Color(this.claro ? 0xeeebe5 : 0x0d0e11);
    this.scene.background = null;
    this.renderer.setClearColor(0x000000, 0);
    const suelo = this.suelo = new THREE.Mesh(new THREE.CircleGeometry(40, 64), new THREE.ShadowMaterial({ opacity: this.claro ? 0.22 : 0.5 }));
    suelo.rotation.x = -Math.PI / 2; suelo.receiveShadow = true;
    this.scene.add(suelo);
    // Sombra de contacto: el HDRI ilumina desde todas partes y la sombra de
    // la direccional sola queda tenue. En fotografía de producto la pieza se
    // "sienta" con una penumbra ancha y un contacto oscuro y estrecho.
    const grad = (a0, a1) => {
      const c = lienzo(256, 256), x = c.getContext("2d"), g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
      g.addColorStop(0, `rgba(0,0,0,${a0})`); g.addColorStop(0.55, `rgba(0,0,0,${a1})`); g.addColorStop(1, "rgba(0,0,0,0)");
      x.fillStyle = g; x.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c);
    };
    const sombra = (r, tex, op) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: op, depthWrite: false }));
      m.rotation.x = -Math.PI / 2; m.position.y = 0.004; this.scene.add(m); return m;
    };
    this.sombraAncha = sombra(6.2, grad(0.55, 0.22), this.claro ? 0.55 : 0.8);
    this.sombraContacto = sombra(3.75, grad(0.95, 0.85), this.claro ? 0.7 : 0.9);
  }

  _luces() {
    // La luz de verdad la da el HDRI; la direccional solo proyecta la sombra
    // (y aporta un poco de modelado desde arriba a la izquierda).
    const k = this.clave = new THREE.DirectionalLight(0xffffff, this.claro ? 1.4 : 1.1);
    k.position.set(-7, 14, 6);
    k.castShadow = true;
    k.shadow.mapSize.set(this.perfil.sombra, this.perfil.sombra);
    const s = k.shadow.camera; s.left = -7; s.right = 7; s.top = 7; s.bottom = -7; s.near = 4; s.far = 36;
    k.shadow.bias = -0.0003; k.shadow.normalBias = 0.02; k.shadow.radius = this.calidad === "foto" ? 10 : 6; k.shadow.blurSamples = 16;
    this.scene.add(k);
    const recorte = this.recorte = new THREE.DirectionalLight(0xdfe7ff, this.claro ? 0.5 : 0.9);
    recorte.position.set(9, 5, -10);
    this.scene.add(recorte);
    new EXRLoader().load("/assets/hdri/studio.exr", (tex) => {
      tex.mapping = THREE.EquirectangularReflectionMapping;
      const pm = new THREE.PMREMGenerator(this.renderer);
      this.scene.environment = pm.fromEquirectangular(tex).texture;
      pm.dispose(); tex.dispose();
      this.scene.environmentIntensity = this.claro ? 0.95 : 0.8;
      this.scene.environmentRotation.set(0, 1.1, 0);
      this.listo = true;
      this._pintarSiQuieto();
      this.o.alCargar && this.o.alCargar();
    });
  }

  _materiales() {
    const uso = cargarTex(TEX + "uso-r.webp", false, [2, 2]);
    const torno = cargarTex(TEX + "torneado-n.webp", false, [1, 6]);
    const molet = cargarTex(TEX + "moleteado-n.webp", false, [6, 1]);
    const plano = [this.corte];
    this.M = {
      anodizado: new THREE.MeshPhysicalMaterial({ color: 0x16171a, metalness: 0.85, roughness: 0.42, roughnessMap: uso, clearcoat: 0.25, clearcoatRoughness: 0.35, clippingPlanes: plano, side: THREE.DoubleSide }),
      moleteado: new THREE.MeshPhysicalMaterial({ color: 0x1c1d21, metalness: 0.9, roughness: 0.38, normalMap: molet, normalScale: new THREE.Vector2(0.9, 0.9), clippingPlanes: plano, side: THREE.DoubleSide }),
      ceramica: new THREE.MeshPhysicalMaterial({ color: 0xe9e6df, metalness: 0, roughness: 0.52, normalMap: torno, normalScale: new THREE.Vector2(0.25, 0.25), clearcoat: 0.45, clearcoatRoughness: 0.4, sheen: 0.2, sheenRoughness: 0.8, clippingPlanes: plano, side: THREE.DoubleSide }),
      titanio: new THREE.MeshPhysicalMaterial({ color: 0xb9bcc1, metalness: 1, roughness: 0.3, roughnessMap: uso, normalMap: torno, normalScale: new THREE.Vector2(0.35, 0.35), anisotropy: 0.75, anisotropyRotation: 0, clippingPlanes: plano, side: THREE.DoubleSide }),
      acero: new THREE.MeshPhysicalMaterial({ color: 0xdadde2, metalness: 1, roughness: 0.12, roughnessMap: uso, clearcoat: 0.6, clearcoatRoughness: 0.08, clippingPlanes: plano, side: THREE.DoubleSide }),
      aluminio: new THREE.MeshPhysicalMaterial({ color: 0xc7cace, metalness: 1, roughness: 0.26, normalMap: torno, normalScale: new THREE.Vector2(0.4, 0.4), anisotropy: 0.6, clippingPlanes: plano, side: THREE.DoubleSide }),
      caucho: new THREE.MeshPhysicalMaterial({ color: 0x121315, metalness: 0, roughness: 0.62, clearcoat: 0.2, clearcoatRoughness: 0.6 }),
      laton: new THREE.MeshPhysicalMaterial({ color: 0xc9a46a, metalness: 1, roughness: 0.28, roughnessMap: uso, clippingPlanes: plano }),
    };
    this.M.vidrio = this.perfil.vidrio
      ? new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.04, transmission: 1, thickness: 1.2, ior: 1.5, dispersion: 0.35,
          attenuationColor: new THREE.Color(0x2b3e66), attenuationDistance: 2.2, specularIntensity: 1, clearcoat: 1, clearcoatRoughness: 0.03, clippingPlanes: plano, side: THREE.DoubleSide })
      : new THREE.MeshPhysicalMaterial({ color: 0x1b2433, metalness: 0.15, roughness: 0.05, transparent: true, opacity: 0.55, clearcoat: 1, clearcoatRoughness: 0.03,
          envMapIntensity: 1.6, depthWrite: false, clippingPlanes: plano, side: THREE.DoubleSide });
    this.M.cupula = this.perfil.vidrio
      ? new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.02, transmission: 1, thickness: 0.5, ior: 1.52, clearcoat: 1, clippingPlanes: plano })
      : new THREE.MeshPhysicalMaterial({ color: 0x0d1016, roughness: 0.03, metalness: 0.2, transparent: true, opacity: 0.65, clearcoat: 1, envMapIntensity: 1.8, clippingPlanes: plano });
    this.M.esfera = new THREE.MeshPhysicalMaterial({ map: texturaEsfera(), emissiveMap: null, color: 0xffffff, roughness: 0.08, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.02, clippingPlanes: plano });
    this.M.zocaloTapa = new THREE.MeshPhysicalMaterial({ color: 0x17181b, metalness: 0.88, roughness: 1, roughnessMap: texturaGrabado(), clearcoat: 0.2, clippingPlanes: plano });
  }

  _lathe(perfil, mat, y) {
    const g = new THREE.LatheGeometry(perfil, this.perfil.segs);
    const m = new THREE.Mesh(g, mat);
    m.position.y = y; m.castShadow = true; m.receiveShadow = true;
    return m;
  }

  _pieza() {
    const M = this.M;
    const raiz = this.raiz = new THREE.Group();
    this.scene.add(raiz);
    const capa = (y) => { const g = new THREE.Group(); g.userData.y0 = y; g.position.y = y; raiz.add(g); return g; };

    /* Zócalo (y 0 → 0.46): cuerpo anodizado + banda moleteada + tapa grabada. */
    const z = this.zocalo = capa(0);
    z.add(this._lathe(perfilAnillo(0, 3.3, 0.46, 0.06), M.anodizado, 0));
    const banda = new THREE.Mesh(new THREE.CylinderGeometry(3.302, 3.302, 0.2, this.perfil.segs, 1, true), M.moleteado);
    banda.position.y = 0.2; banda.castShadow = true; z.add(banda);
    const tapa = new THREE.Mesh(new THREE.CircleGeometry(3.24, this.perfil.segs), M.zocaloTapa);
    tapa.rotation.x = -Math.PI / 2; tapa.position.y = 0.461; tapa.receiveShadow = true; z.add(tapa);

    /* Datos (0.46 → 0.78): cerámica. */
    const d = capa(0.46); this.capas = [];
    d.add(this._lathe(perfilAnillo(0.95, 3.02, 0.32, 0.05), M.ceramica, 0));
    this.capas.push({ g: d, nombre: CAPAS[0], r: 3.02, h: 0.32 });

    /* Automatizaciones (0.78 → 1.14): titanio hilado con las 8 tomas. */
    const a = capa(0.78);
    a.add(this._lathe(perfilAnillo(1.05, 3.16, 0.36, 0.06), M.titanio, 0));
    this.tomas = [];
    DEPARTAMENTOS.forEach((dep, i) => {
      const ang = (i / DEPARTAMENTOS.length) * TAU + 0.2;
      const t = new THREE.Group();
      t.position.set(Math.cos(ang) * 3.16, 0.18, Math.sin(ang) * 3.16);
      t.lookAt(Math.cos(ang) * 10, 0.18, Math.sin(ang) * 10);
      const aro = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.022, 12, 32), M.laton); aro.castShadow = true;
      const hueco = new THREE.Mesh(new THREE.CircleGeometry(0.09, 24), new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.9 }));
      hueco.position.z = -0.005;
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 8), new THREE.MeshBasicMaterial({ color: dep.color, toneMapped: false }));
      led.position.set(0.17, 0.0, 0.0);
      t.add(aro, hueco, led);
      a.add(t);
      this.tomas.push({ g: t, led, dep, ang });
    });
    this.capas.push({ g: a, nombre: CAPAS[1], r: 3.16, h: 0.36 });

    /* IA (1.14 → 1.66): disco de vidrio con el circuito dentro. */
    const ia = capa(1.14);
    ia.add(this._lathe(perfilAnillo(0, 2.72, 0.52, 0.08), M.vidrio, 0));
    const circ = this.circuito = new THREE.Group(); circ.position.y = 0.26;
    const lineaMat = this.iaMat = new THREE.MeshBasicMaterial({ color: 0x4c7dff, toneMapped: false, transparent: true, opacity: 0.9 });
    for (let k = 0; k < 3; k++) {
      const tor = new THREE.Mesh(new THREE.TorusGeometry(0.8 + k * 0.62, 0.008, 6, 160), lineaMat);
      tor.rotation.x = Math.PI / 2; circ.add(tor);
    }
    for (let k = 0; k < 24; k++) {
      const ang = (k / 24) * TAU, r0 = 0.8 + (k % 3) * 0.3, r1 = 2.05 + (k % 2) * 0.35;
      const g = new THREE.CylinderGeometry(0.006, 0.006, r1 - r0, 4); g.rotateZ(Math.PI / 2); g.translate((r0 + r1) / 2, 0, 0);
      const l = new THREE.Mesh(g, lineaMat); l.rotation.y = ang; circ.add(l);
      const nodo = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), lineaMat); nodo.position.set(Math.cos(ang) * r1, 0, -Math.sin(ang) * r1); circ.add(nodo);
    }
    ia.add(circ);
    this.capas.push({ g: ia, nombre: CAPAS[2], r: 2.72, h: 0.52 });

    /* Interfaces (1.66 → 1.84): bisel de acero + esfera de vidrio negro. */
    const it = capa(1.66);
    it.add(this._lathe(perfilAnillo(1.95, 2.58, 0.18, 0.05), M.acero, 0));
    const esfera = new THREE.Mesh(new THREE.CircleGeometry(1.96, this.perfil.segs), M.esfera);
    esfera.rotation.x = -Math.PI / 2; esfera.position.y = 0.11; it.add(esfera);
    this.esfera = esfera;
    this.capas.push({ g: it, nombre: CAPAS[3], r: 2.58, h: 0.18 });

    /* Monitorización (1.84 → 2.7): collar + cúpula con el sensor. */
    const mo = capa(1.84);
    mo.add(this._lathe(perfilAnillo(0.62, 0.95, 0.42, 0.05), M.aluminio, 0));
    const cup = new THREE.Mesh(new THREE.SphereGeometry(0.66, 64, 32, 0, TAU, 0, Math.PI / 2), M.cupula);
    cup.position.y = 0.42; mo.add(cup);
    const sensor = this.sensor = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 16), new THREE.MeshBasicMaterial({ color: 0x9fb8ff, toneMapped: false }));
    sensor.position.y = 0.52; mo.add(sensor);
    const luzSensor = this.luzSensor = new THREE.PointLight(0x7a9dff, 0, 3, 2); luzSensor.position.y = 0.55; mo.add(luzSensor);
    this.capas.push({ g: mo, nombre: CAPAS[4], r: 0.95, h: 0.9 });

    /* Mejora continua: el aro que orbita. */
    const orb = this.orbita = new THREE.Group(); orb.position.y = 1.3; raiz.add(orb);
    const aroO = new THREE.Mesh(new THREE.TorusGeometry(3.95, 0.028, 16, 256), M.acero); aroO.castShadow = true;
    orb.add(aroO);
    const carro = new THREE.Mesh(new THREE.SphereGeometry(0.075, 20, 12), M.laton); carro.position.x = 3.95; orb.add(carro);
    orb.rotation.set(1.2, 0, 0.18);
    this.capas.push({ g: orb, nombre: CAPAS[5], r: 3.95, h: 0.1, orbita: true });

    /* Escaneo: un aro de luz que recorre la pila. */
    const esc = this.escaner = new THREE.Mesh(new THREE.TorusGeometry(3.45, 0.012, 8, 256), new THREE.MeshBasicMaterial({ color: 0x8fb0ff, toneMapped: false, transparent: true }));
    esc.rotation.x = Math.PI / 2; raiz.add(esc);

    /* Cables: fibra con funda de caucho, de tres tomas hacia fuera de cuadro. */
    this.cables = [];
    [0, 3, 5].forEach((i, k) => {
      const tm = this.tomas[i], ang = tm.ang;
      const p0 = new THREE.Vector3(Math.cos(ang) * 3.3, 0.96, Math.sin(ang) * 3.3);
      const dir = new THREE.Vector3(Math.cos(ang), 0, Math.sin(ang));
      // El cable sale de la toma, cae al suelo y muere junto a la base: se queda
      // dentro del encuadre de la pieza, nunca cruza el texto.
      const pts = [p0, p0.clone().addScaledVector(dir, 0.55).setY(0.62), p0.clone().addScaledVector(dir, 1.1).setY(0.07), p0.clone().addScaledVector(dir, 2.1).setY(0.06 + k * 0.01)];
      const curva = new THREE.CatmullRomCurve3(pts, false, "centripetal");
      const tubo = new THREE.Mesh(new THREE.TubeGeometry(curva, 120, 0.055, 14), M.caucho); tubo.castShadow = true; tubo.receiveShadow = true;
      const punta = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.18, 24), M.aluminio);
      punta.position.copy(p0.clone().addScaledVector(dir, 0.06)); punta.lookAt(p0.clone().addScaledVector(dir, 3)); punta.rotateX(Math.PI / 2);
      const grupo = new THREE.Group(); grupo.add(tubo, punta); raiz.add(grupo);
      this.cables.push({ grupo, dir, toma: i });
    });

    // Desalineación estable por capa (cuando "nada se habla").
    this.capas.forEach((c, i) => { c.dx = (ruido(i, 3) - 0.5) * 1.6; c.dz = (ruido(i, 4) - 0.5) * 1.6; c.rx = (ruido(i, 5) - 0.5) * 0.35; c.rz = (ruido(i, 6) - 0.5) * 0.35; c.dy = ruido(i, 7) * 0.5; c.vy = 0; c.oy = 0; });
  }

  /* ------------------------------------------------------------ POST */
  async activarPost() {
    if (!this.perfil.post || this.composer) return;
    try {
      const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }, { ShaderPass }] = await Promise.all([
        import("/assets/vendor/three/addons/postprocessing/EffectComposer.js"),
        import("/assets/vendor/three/addons/postprocessing/RenderPass.js"),
        import("/assets/vendor/three/addons/postprocessing/UnrealBloomPass.js"),
        import("/assets/vendor/three/addons/postprocessing/OutputPass.js"),
        import("/assets/vendor/three/addons/postprocessing/ShaderPass.js"),
      ]);
      const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
      const rt = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, format: THREE.RGBAFormat, samples: this.calidad === "media" ? 2 : 4 });
      const c = new EffectComposer(this.renderer, rt);
      c.addPass(new RenderPass(this.scene, this.camera));
      this.bloom = new UnrealBloomPass(new THREE.Vector2(size.x / 2, size.y / 2), this.claro ? 0 : 0.18, 0.35, 3.0);
      this.bloom.enabled = !this.claro;
      c.addPass(this.bloom);
      c.addPass(new OutputPass());
      // Pase de cine: viñeta y grano, lo que separa un render de una foto.
      this.cine = new ShaderPass({
        uniforms: { tDiffuse: { value: null }, uT: { value: 0 }, uGrano: { value: this.claro ? 0.028 : 0.04 }, uVin: { value: this.claro ? 0.12 : 0.22 } },
        vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
        fragmentShader: `uniform sampler2D tDiffuse; uniform float uT, uGrano, uVin; varying vec2 vUv;
          float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + uT) * 43758.5453); }
          void main(){ vec4 c = texture2D(tDiffuse, vUv); vec2 d = vUv - 0.5; float v = 1.0 - uVin * dot(d,d) * 2.2;
            c.rgb *= mix(1.0, v, c.a); c.rgb += (h(vUv * 1000.0) - 0.5) * uGrano * c.a; gl_FragColor = c; }`,
      });
      c.addPass(this.cine);
      this.composer = c;
      this._resize();
    } catch (e) { console.warn("[nucleo] sin postproceso:", e); this.perfil.post = false; }
  }

  /* ------------------------------------------------------------ API */
  irA(nombre) {
    const e = ESTADOS[nombre]; if (!e) return;
    this.nombreEstado = nombre;
    this.objetivo = Object.assign({}, e);
    this.camObj = CAMS[e.cam];
    if (this.quieto) this.saltar(); else this.arrancar();
  }
  /** Plano dirigido (fotografía y capítulos): cámara, objetivo y focal. */
  fijarCamara(p, t, fov, vx) { this.camObj = { p, t, fov: fov || 26, vx: vx || 0 }; if (this.quieto) this.saltar(); else this.arrancar(); }
  setEncuadre(vx) { this.encuadre = vx; if (this.quieto) this.saltar(); }
  setFocos(ids) { this.focos = new Set(ids); this._pintarSiQuieto(); }
  setTema(claro) {
    if (claro === this.claro) return;
    this.claro = claro;
    this.fondo.set(claro ? 0xeeebe5 : 0x0d0e11);
    this.suelo.material.opacity = claro ? 0.22 : 0.5;
    this.clave.intensity = claro ? 1.4 : 1.1; this.recorte.intensity = claro ? 0.5 : 0.9;
    this.scene.environmentIntensity = claro ? 0.95 : 0.8;
    if (this.bloom) { this.bloom.enabled = !claro; this.bloom.strength = claro ? 0 : 0.18; }
    if (this.cine) { this.cine.uniforms.uGrano.value = claro ? 0.028 : 0.04; this.cine.uniforms.uVin.value = claro ? 0.12 : 0.22; }
    this._pintarSiQuieto();
  }
  puntero_(x, y) { this.puntero.x = x; this.puntero.y = y; if (!this.quieto) this.arrancar(); }
  empujar(v) { this.vgiro += v; if (!this.quieto) this.arrancar(); }

  /** Puntos de anclaje de cada capa en pantalla (para las cotas en HTML). */
  anclas() {
    const r = this.canvas.getBoundingClientRect();
    return this.capas.map((c) => {
      const g = c.g;
      const lado = c.orbita ? this._v.set(3.95, 0, 0).applyMatrix4(g.matrixWorld) : this._v.set(0, 0, 0).applyMatrix4(g.matrixWorld).add(this._v2.set(c.r * 0.72, c.h / 2, c.r * 0.7));
      const p = lado.clone().project(this.camera);
      return { nombre: c.nombre, x: r.left + (p.x * 0.5 + 0.5) * r.width, y: r.top + (-p.y * 0.5 + 0.5) * r.height, visible: p.z < 1 };
    });
  }

  saltar() { this._paso(0.016, true); this._render(); }
  _pintarSiQuieto() { if (this.quieto) this.saltar(); }

  _resize() {
    const c = this.canvas, w = c.clientWidth || c.parentElement.clientWidth, h = c.clientHeight || c.parentElement.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.ancho = w; this.alto = h; this.estrecho = w / h < 0.9;
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    if (this.composer) { this.composer.setPixelRatio(this.renderer.getPixelRatio()); this.composer.setSize(w, h); }
    this._pintarSiQuieto();
  }

  _paso(dt, forzado) {
    const S = this.estado, O = this.objetivo, v = forzado ? 1e4 : 2.0;
    for (const k of ["desalineado", "explosion", "corte", "escaneo", "medida", "ia", "cables", "orbita"]) S[k] = amort(S[k], O[k], dt, v);
    this.tiempo += dt; const t = this.tiempo;
    const deriva = this.quieto ? 0 : 1;

    // Cámara: dolly amortiguado hacia el plano, con respiración y parallax.
    const c = this.camObj, vc = forzado ? 1e4 : 1.5;
    this.cam.p.x = amort(this.cam.p.x, c.p[0], dt, vc); this.cam.p.y = amort(this.cam.p.y, c.p[1], dt, vc); this.cam.p.z = amort(this.cam.p.z, c.p[2], dt, vc);
    this.cam.t.x = amort(this.cam.t.x, c.t[0], dt, vc); this.cam.t.y = amort(this.cam.t.y, c.t[1], dt, vc); this.cam.t.z = amort(this.cam.t.z, c.t[2], dt, vc);
    this.cam.fov = amort(this.cam.fov, c.fov, dt, vc);
    const vxObj = this.estrecho ? 0 : (this.encuadre != null ? this.encuadre : c.vx);
    this.cam.vx = amort(this.cam.vx, vxObj, dt, vc);
    this.puntero.sx = amort(this.puntero.sx, this.puntero.x, dt, 2.5); this.puntero.sy = amort(this.puntero.sy, this.puntero.y, dt, 2.5);
    const lejos = this.estrecho ? 1.45 : 1;
    const p = this._v.copy(this.cam.t).lerp(this.cam.p, lejos);
    const ang = Math.sin(t * 0.08) * 0.05 * deriva + this.puntero.sx * 0.1, cs = Math.cos(ang), sn = Math.sin(ang);
    this.camera.position.set(p.x * cs - p.z * sn, p.y - this.puntero.sy * 0.7 + Math.sin(t * 0.13) * 0.08 * deriva, p.x * sn + p.z * cs);
    this.camera.fov = this.cam.fov; this.camera.lookAt(this.cam.t);
    if (this.ancho) this.camera.setViewOffset(this.ancho, this.alto, this.cam.vx * this.ancho, this.estrecho ? 0.2 * this.alto : 0, this.ancho, this.alto);
    else this.camera.updateProjectionMatrix();

    // La pieza gira sola despacio; el cursor le da inercia.
    this.vgiro *= Math.exp(-2.2 * dt);
    this.giro += (0.06 * deriva * (1 - S.corte) + this.vgiro) * dt;
    this.raiz.rotation.y = this.giro;

    // Entrada: las capas bajan en cascada y se asientan (muelle).
    if (forzado) this._entrada = 0;
    const ent = this._entrada || 0;
    if (ent) { this._entrada = Math.max(0, ent - dt * 0.55); }

    // Capas: explosión vertical, desalineación y asiento con muelle.
    this.capas.forEach((cp, i) => {
      if (cp.orbita) return;
      const yObj = cp.g.userData.y0 + S.explosion * (i + 1) * 0.95 + S.desalineado * cp.dy + (ent ? Math.pow(ent, 2) * (3 + i * 1.6) : 0);
      if (forzado) { cp.oy = yObj; cp.vy = 0; }
      else { const ay = (yObj - cp.oy) * 55 - cp.vy * 11; cp.vy += ay * dt; cp.oy += cp.vy * dt; }
      cp.g.position.set(cp.dx * S.desalineado, cp.oy, cp.dz * S.desalineado);
      cp.g.rotation.set(cp.rx * S.desalineado, (i % 2 ? -1 : 1) * S.desalineado * 0.3, cp.rz * S.desalineado);
    });
    this.zocalo.position.y = 0;
    if (this.sombraContacto) this.sombraContacto.material.opacity = (this.claro ? 0.7 : 0.9) * (1 - 0.35 * S.desalineado);

    // Mejora continua: el aro orbita (se para si el sistema no se habla).
    this.orbita.rotation.y += dt * 0.35 * S.orbita * deriva;
    this.orbita.position.y = 1.3 + S.explosion * 3.2;

    // IA: el circuito se enciende según el estado; late suave.
    const late = 0.85 + 0.15 * Math.sin(t * 1.8);
    this.iaMat.opacity = Math.min(1, S.ia * late);
    this.iaMat.color.setRGB(0.3 * (1 + S.ia * 1.6), 0.49 * (1 + S.ia * 1.6), 1.0 * (1 + S.ia * 1.6));
    this.circuito.rotation.y = -t * 0.05 * deriva;
    this.sensor.material.color.setRGB(0.25 + 0.5 * S.ia * late, 0.42 + 0.7 * S.ia * late, 1 + 1.4 * S.ia * late);
    this.luzSensor.intensity = 1.8 * S.ia;

    // Tomas: su color cuando el sistema está conectado; ámbar parpadeante
    // cuando no (trabajo a mano). Las marcadas en el diagnóstico, más vivas.
    const amb = S.desalineado;
    this.tomas.forEach((tm, i) => {
      const parp = amb > 0.5 ? (Math.sin(t * 5 + i * 1.7) > 0.2 ? 1 : 0.25) : 1;
      const marcada = this.focos.has(tm.dep.id) ? 2.4 : 1;
      const base = new THREE.Color(tm.dep.color).lerp(new THREE.Color(0xffa22e), amb);
      const med = S.medida > 0.05 ? 0.6 + 0.8 * S.medida * (0.5 + 0.5 * Math.sin(t * 2 + i)) : 1;
      tm.led.material.color.copy(base).multiplyScalar(1.6 * parp * marcada * med);
      tm.led.scale.setScalar(marcada > 1 ? 1.6 : 1);
    });

    // Cables: se desenchufan cuando no hay sistema.
    this.cables.forEach((cb, k) => {
      const suelto = 1 - S.cables;
      cb.grupo.position.copy(cb.dir).multiplyScalar(suelto * 1.6);
      cb.grupo.position.y = -suelto * 0.2;
      cb.grupo.visible = S.cables > -0.5;
    });

    // Escaneo.
    const ea = S.escaneo;
    this.escaner.visible = ea > 0.02;
    this.escaner.position.y = 0.2 + ((t * 0.35) % 1) * 2.6;
    this.escaner.material.opacity = ea;
    this.escaner.material.color.setRGB(0.56 * (1 + ea), 0.69 * (1 + ea), 1.4 * (1 + ea));

    // Corte: el plano de recorte entra y abre la pieza por la mitad.
    this.corte.constant = amort(this.corte.constant, S.corte > 0.02 ? 0.02 : 60, dt, forzado ? 1e4 : 3);

    // Esfera: la escala de la interfaz se "llena" al medir (rotación leve).
    this.esfera.rotation.z = -t * 0.02 * deriva - S.medida * 0.8;
  }

  _render() {
    const i = this.renderer.info; i.autoReset = false; i.reset();
    if (this.cine) this.cine.uniforms.uT.value = (this.tiempo * 60) % 1000;
    if (this.composer) this.composer.render(); else this.renderer.render(this.scene, this.camera);
  }

  _tick(ahora) {
    this.raf = null;
    if (!this.visible || this.oculta) return;
    const dt = Math.min(0.05, (ahora - (this.ultimo || ahora)) / 1000); this.ultimo = ahora;
    this._paso(dt || 0.016); this._render(); this._medir(dt);
    this.o.alPintar && this.o.alPintar(this);
    this.raf = requestAnimationFrame((x) => this._tick(x));
  }
  _medir(dt) {
    if (!dt) return;
    this.fotogramas.push(dt * 1000);
    if (this.fotogramas.length < 90) return;
    const f = this.fotogramas.sort((a, b) => a - b), med = f[45]; this.fotogramas = []; this.mediana = med;
    if (med > 45 && this.bajado) { this.parar(); this.quieto = true; this.calidad = "estatica"; this.saltar(); return; }
    if (med > 26) { this.bajado = true; if (this.composer) { this.composer = null; this.cine = null; } this.renderer.setPixelRatio(1); this._resize(); }
  }
  arrancar() { if (this.quieto) { this._pintarSiQuieto(); return; } if (this.raf == null && this.visible && !this.oculta) this.raf = requestAnimationFrame((t) => { this.ultimo = t; this._tick(t); }); }
  parar() { if (this.raf != null) { cancelAnimationFrame(this.raf); this.raf = null; } }
  info() { const i = this.renderer.info; return { calidad: this.calidad, llamadas: i.render.calls, triangulos: i.render.triangles, geometrias: i.memory.geometries, texturas: i.memory.textures, post: !!this.composer, mediana: this.mediana || null }; }
}

export async function montarNucleo(canvas, o = {}) {
  const n = new Nucleo(canvas, o);
  const ro = new ResizeObserver(() => n._resize()); ro.observe(canvas.parentElement || canvas);
  document.addEventListener("visibilitychange", () => { n.oculta = document.hidden; if (n.oculta) n.parar(); else n.arrancar(); });
  if (o.observar !== false && "IntersectionObserver" in window) new IntersectionObserver((e) => { n.visible = e[0].isIntersecting; if (n.visible) n.arrancar(); else n.parar(); }).observe(canvas);
  n.irA(o.estado || "ensamblado");
  await n.activarPost();
  n.arrancar(); n._pintarSiQuieto();
  return n;
}
