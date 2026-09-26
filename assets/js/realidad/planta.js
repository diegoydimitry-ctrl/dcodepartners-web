/* ==========================================================================
   D-CODE · LA PLANTA — motor de realismo (Three.js r180, vendorizado)
   ==========================================================================
   Qué es: la maqueta física del sistema de una empresa. No partículas ni
   formas "tech" decorativas: cada objeto es una cosa que D-Code construye.

     Losa           La empresa: el suelo común sobre el que todo se apoya.
     8 módulos      Los ocho departamentos del sitio (Comercial, Marketing,
                    Clientes, Producción, Finanzas, Soporte, Administración,
                    Dirección). Bloques mecanizados con su pantalla encima;
                    cuatro llevan la captura REAL de las demos de D-Code.
     Núcleo         D-Code OS: la capa que conecta. Cilindro de vidrio sobre
                    zócalo cerámico, con el núcleo de IA dentro.
     Conductos      Integraciones: por ellos viaja el dato (pulsos de luz).
     Fichas ámbar   El trabajo a mano: papeles que saltan de un módulo a
                    otro, copiados y pegados por alguien. Desaparecen cuando
                    el sistema está conectado.
     Haz de escaneo Analizar/diagnosticar: una lámina de luz que recorre la
                    planta y mide.
     Aristas azules Diseñar: el plano técnico antes de construir.
     Columnas       Medir: cada módulo levanta su indicador.

   Realismo: PBR (MeshPhysicalMaterial), iluminación por imagen (RoomEnvironment
   + PMREM, sin descargar HDR), sombras suaves, estudio con ciclorama y niebla,
   tone mapping Neutral (Khronos) + exposición, bloom selectivo solo en lo emisivo, cámara de teleobjetivo
   con viewOffset (encuadre sin deformar la perspectiva) y física de muelle en
   cada módulo (aterrizan con peso, no con una curva de easing).

   Calidad adaptable: ALTA / MEDIA / BAJA según dispositivo y según el tiempo
   de fotograma medido en marcha. Sin WebGL, quien monta decide (póster).
   ========================================================================== */

import * as THREE from "/assets/vendor/three/three.module.min.js";
import { RoomEnvironment } from "/assets/vendor/three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "/assets/vendor/three/addons/geometries/RoundedBoxGeometry.js";

const TAU = Math.PI * 2;

/* ------------------------------------------------------------ CATÁLOGO
   Los ocho departamentos reales del sitio, con su color de marca (--k-*),
   su proporción (Dirección es la torre; Soporte, la pieza baja y ancha) y la
   captura real que llevan en su pantalla cuando existe. */
export const MODULOS = [
  { id: "marketing",      nombre: "Marketing",      color: 0xff6b9d, x: -5.0, z: -2.35, w: 2.1, d: 1.6, h: 0.85, cap: null },
  { id: "comercial",      nombre: "Comercial",      color: 0x4dd0e1, x: -2.05, z: -2.7, w: 2.5, d: 1.7, h: 1.25, cap: "comercial" },
  { id: "direccion",      nombre: "Dirección",      color: 0xa78bfa, x: 1.2,  z: -2.95, w: 1.75, d: 1.5, h: 2.25, cap: "os" },
  { id: "administracion", nombre: "Administración", color: 0x8b93ff, x: 4.35, z: -2.45, w: 2.0, d: 1.6, h: 0.8,  cap: null },
  { id: "clientes",       nombre: "Clientes",       color: 0x35e0a1, x: -4.8, z: 2.45, w: 2.0, d: 1.6, h: 1.0,  cap: null },
  { id: "soporte",        nombre: "Soporte",        color: 0x2dd4bf, x: -1.75, z: 2.8,  w: 2.3, d: 1.45, h: 0.72, cap: "atencion" },
  { id: "finanzas",       nombre: "Finanzas",       color: 0x5b8cff, x: 1.65, z: 2.65, w: 2.7, d: 1.8, h: 1.1,  cap: "finance" },
  { id: "produccion",     nombre: "Producción",     color: 0xffb43a, x: 4.85, z: 2.3,  w: 2.2, d: 1.8, h: 1.4,  cap: "operaciones" },
];

/* ------------------------------------------------------------ ESTADOS
   Cada estado es un conjunto de valores objetivo; la escena los persigue
   amortiguados, así que pasar de uno a otro nunca salta. */
const E = (o) => Object.assign({ disperso: 0, nucleo: 1, conductos: 1, manual: 0, plano: 0, escaneo: 0, medida: 0, calma: 0, cam: "tres" }, o);
export const ESTADOS = {
  desorden:  E({ disperso: 1, nucleo: 0, conductos: 0, manual: 1, cam: "heroe" }),
  problema:  E({ disperso: 1, nucleo: 0, conductos: 0, manual: 1.6, cam: "bajo" }),
  analizar:  E({ disperso: 0.55, nucleo: 0, conductos: 0, manual: 0.6, escaneo: 1, cam: "alto" }),
  disenar:   E({ disperso: 0, nucleo: 0.35, conductos: 0.25, manual: 0, plano: 1, cam: "planta" }),
  conectar:  E({ cam: "tres" }),
  implantar: E({ cam: "frente" }),
  medir:     E({ medida: 1, cam: "tres" }),
  regimen:   E({ medida: 0.6, calma: 1, cam: "lejos" }),
  modulo:    E({ cam: "modulo" }),
};

/* Encuadres: posición de cámara, punto de mira y desplazamiento de vista
   (fracción del ancho) para dejar sitio al texto sin deformar la perspectiva. */
const CAMS = {
  heroe:  { p: [16.5, 11.5, 22], t: [0, 0.4, 0], vx: -0.22, vy: 0 },
  bajo:   { p: [13.5, 4.6, 16.5], t: [0, 0.9, 0], vx: -0.24, vy: 0 },
  alto:   { p: [7, 19, 13],      t: [0, 0, 0.3], vx: -0.24, vy: 0 },
  planta: { p: [0.01, 31, 3.4],   t: [0, 0, 0.2], vx: -0.24, vy: 0 },
  tres:   { p: [15, 11.5, 18.5], t: [0, 0.4, 0], vx: -0.24, vy: 0 },
  frente: { p: [0, 6.5, 23],      t: [0, 0.7, 0], vx: -0.24, vy: 0 },
  lejos:  { p: [19, 15, 25],      t: [0, 0, 0],   vx: 0, vy: 0.06 },
  modulo: { p: [5.6, 4.2, 7.4],   t: [-0.3, 0.45, 0.2], vx: -0.22, vy: 0 },
};

/* ------------------------------------------------------------ UTILIDADES */
function ruido(i, s) {
  let h = (Math.imul(i ^ s, 0x27d4eb2d) ^ (i + s * 0x9e3779b9)) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
function amort(actual, objetivo, dt, vel) { return actual + (objetivo - actual) * (1 - Math.exp(-vel * dt)); }
function lienzo(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }

/* Textura de rugosidad "mecanizada": vetas horizontales finas + grano. Es lo
   que hace que el reflejo del entorno se rompa como en el aluminio real en
   lugar de ser un espejo de plástico. Se genera una vez (256², ~0 ms). */
function texturaCepillado(base, amp) {
  const c = lienzo(256, 256), x = c.getContext("2d");
  const img = x.createImageData(256, 256);
  for (let j = 0; j < 256; j++) {
    const veta = (ruido(j, 3) - 0.5) * amp * 1.6;
    for (let i = 0; i < 256; i++) {
      const g = (ruido(j * 256 + i, 7) - 0.5) * amp;
      const v = Math.max(0, Math.min(255, (base + veta + g) * 255));
      const k = (j * 256 + i) * 4;
      img.data[k] = img.data[k + 1] = img.data[k + 2] = v; img.data[k + 3] = 255;
    }
  }
  x.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.NoColorSpace;
  return t;
}

/* Rejilla grabada en la losa: la retícula de un plano de planta. */
function texturaRejilla(claro) {
  const c = lienzo(1024, 640), x = c.getContext("2d");
  x.fillStyle = "rgba(0,0,0,0)"; x.fillRect(0, 0, 1024, 640);
  x.strokeStyle = claro ? "rgba(40,60,110,.16)" : "rgba(150,180,255,.12)";
  x.lineWidth = 1;
  for (let i = 0; i <= 1024; i += 32) { x.beginPath(); x.moveTo(i + 0.5, 0); x.lineTo(i + 0.5, 640); x.stroke(); }
  for (let j = 0; j <= 640; j += 32) { x.beginPath(); x.moveTo(0, j + 0.5); x.lineTo(1024, j + 0.5); x.stroke(); }
  x.strokeStyle = claro ? "rgba(40,60,110,.28)" : "rgba(150,180,255,.22)";
  for (let i = 0; i <= 1024; i += 128) { x.beginPath(); x.moveTo(i + 0.5, 0); x.lineTo(i + 0.5, 640); x.stroke(); }
  for (let j = 0; j <= 640; j += 128) { x.beginPath(); x.moveTo(0, j + 0.5); x.lineTo(1024, j + 0.5); x.stroke(); }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/* Pantalla procedimental para los módulos sin captura real: una interfaz
   sobria (cabecera, filas, una gráfica) en el color del departamento. */
function texturaPantalla(m, claro) {
  const c = lienzo(512, 320), x = c.getContext("2d");
  const col = "#" + m.color.toString(16).padStart(6, "0");
  x.fillStyle = claro ? "#f4f6fa" : "#0b1020"; x.fillRect(0, 0, 512, 320);
  x.fillStyle = claro ? "#e3e8f1" : "#131a2e"; x.fillRect(0, 0, 512, 44);
  x.fillStyle = col; x.fillRect(18, 17, 10, 10);
  x.fillStyle = claro ? "#2a3350" : "#c9d4ee"; x.font = "600 18px monospace"; x.fillText(m.nombre.toUpperCase(), 38, 29);
  for (let r = 0; r < 5; r++) {
    const y = 70 + r * 34;
    x.fillStyle = claro ? "#dfe5ef" : "#18203a"; x.fillRect(18, y, 290, 22);
    x.fillStyle = col; x.globalAlpha = 0.85; x.fillRect(18, y, 40 + ruido(r, m.x * 10) * 200, 22); x.globalAlpha = 1;
  }
  x.strokeStyle = col; x.lineWidth = 3; x.beginPath();
  for (let i = 0; i <= 10; i++) { const px = 330 + i * 16, py = 250 - ruido(i, m.z * 10) * 150 - i * 6; i ? x.lineTo(px, py) : x.moveTo(px, py); }
  x.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/* Rótulo grabado en el frente del módulo. */
function texturaRotulo(texto, color, claro) {
  const c = lienzo(512, 64), x = c.getContext("2d");
  x.clearRect(0, 0, 512, 64);
  x.fillStyle = "#" + color.toString(16).padStart(6, "0"); x.fillRect(8, 26, 12, 12);
  x.fillStyle = claro ? "rgba(20,28,48,.85)" : "rgba(230,238,255,.9)";
  x.font = "600 30px monospace"; x.fillText(texto.toUpperCase(), 34, 42);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ------------------------------------------------------------ CALIDAD */
export function detectarCalidad() {
  const forzada = new URLSearchParams(location.search).get("calidad");
  if (forzada && PERFIL[forzada]) return forzada; // QA: ?calidad=alta|media|baja
  const tactil = window.matchMedia("(pointer: coarse)").matches;
  const estrecho = window.matchMedia("(max-width: 760px)").matches;
  const mem = navigator.deviceMemory || 8, nucleos = navigator.hardwareConcurrency || 8;
  let gpu = "";
  try {
    const gl = document.createElement("canvas").getContext("webgl2") || document.createElement("canvas").getContext("webgl");
    const ext = gl && gl.getExtension("WEBGL_debug_renderer_info");
    gpu = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
  } catch (e) { /* sin información: se decide por el resto */ }
  const software = /swiftshader|llvmpipe|software|basic render/i.test(gpu);
  if (software) return "estatica"; // sin aceleración gráfica: cada fotograma bloquearía el hilo principal
  if (mem <= 2 || nucleos <= 2) return "baja";
  if (tactil || estrecho || mem <= 4) return "media";
  return "alta";
}
const PERFIL = {
  alta:  { dpr: 1.75, sombra: 2048, bloom: true,  vidrio: true,  pulsos: 7, fichas: 26 },
  media: { dpr: 1.35, sombra: 1024, bloom: true,  vidrio: false, pulsos: 5, fichas: 18 },
  baja:  { dpr: 1.0,  sombra: 0,    bloom: false, vidrio: false, pulsos: 3, fichas: 10 },
  // Estática: la misma escena, pintada solo cuando cambia de estado (como con
  // movimiento reducido). Para equipos sin GPU real.
  estatica: { dpr: 1.0, sombra: 0, bloom: false, vidrio: false, pulsos: 3, fichas: 10 },
};

/* ------------------------------------------------------------ LA ESCENA */
export class Planta {
  constructor(canvas, o = {}) {
    this.canvas = canvas;
    this.o = o;
    this.calidad = o.calidad || detectarCalidad();
    this.quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches || this.calidad === "estatica";
    this.perfil = Object.assign({}, PERFIL[this.calidad]);
    this.claro = o.claro || false;
    this.solo = o.solo || null; // un solo módulo (páginas interiores)
    this.transparente = !!o.transparente; // interiores: sin estudio, sobre el fondo de la página
    if (this.transparente) this.perfil.bloom = false;

    const r = this.renderer = new THREE.WebGLRenderer({
      canvas, antialias: this.calidad !== "baja" && !this.perfil.bloom, alpha: this.transparente, premultipliedAlpha: true,
      powerPreference: "high-performance", stencil: false,
    });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.perfil.dpr));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.NeutralToneMapping; // Khronos PBR Neutral: respeta el color real del material
    r.toneMappingExposure = 1.0;
    r.shadowMap.enabled = this.perfil.sombra > 0;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    if (this.calidad !== "alta" && "transmissionResolutionScale" in r) r.transmissionResolutionScale = 0.5;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.5, 120);

    // Iluminación por imagen: una sala de estudio procedimental prefiltrada
    // (PMREM). Da reflejos y luz ambiente físicamente coherentes sin bajar
    // ni un byte de HDR.
    const pm = new THREE.PMREMGenerator(r);
    this.entorno = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    pm.dispose();
    this.scene.environment = this.entorno;
    this.scene.environmentIntensity = 0.62;

    this._m4 = new THREE.Matrix4(); this._q = new THREE.Quaternion(); this._e = new THREE.Euler(); this._v = new THREE.Vector3(); this._s = new THREE.Vector3();
    this._estudio();
    this._luces();
    this._construir();

    this.estado = Object.assign({}, ESTADOS[o.estado || "desorden"]);
    this.objetivo = Object.assign({}, this.estado);
    const c0 = CAMS[this.estado.cam];
    this.cam = { p: new THREE.Vector3(...c0.p), t: new THREE.Vector3(...c0.t), vx: c0.vx, vy: c0.vy };
    this.puntero = { x: 0, y: 0, sx: 0, sy: 0 };
    this.hover = -1;
    this.foco = -1;
    this.focos = new Set();
    this.tiempo = 0;
    this.visible = true;
    this.oculta = false;
    this.raf = null;
    this.fotogramas = [];
    this.encuadre = { vx: 0, vy: 0 }; // override del encuadre (móvil)
    // Entrada: los módulos llegan desde arriba y se asientan por su propio
    // peso (el muelle hace el resto) mientras la cámara se acerca.
    if (!this.quieto && !this.solo) {
      this.modulos.forEach((mo, i) => { mo.pos.y = 9 + i * 0.7; mo.vel.y = -2; });
      this.cam.p.multiplyScalar(1.35);
    }
    this._resize();
  }

  /* Estudio: suelo que recibe sombra y un ciclorama que funde con la niebla.
     Es la diferencia entre "un objeto sobre negro" y "un objeto en un sitio". */
  _estudio() {
    if (this.transparente) {
      // Sin ciclorama: el suelo solo recoge la sombra, la página se ve detrás.
      this.renderer.setClearColor(0x000000, 0);
      const suelo = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: this.claro ? 0.18 : 0.45 }));
      suelo.rotation.x = -Math.PI / 2; suelo.position.y = -0.34; suelo.receiveShadow = true;
      this.scene.add(suelo); this.suelo = suelo;
      return;
    }
    const fondo = new THREE.Color(this.claro ? 0xe9edf3 : 0x070a11);
    this.scene.background = fondo;
    this.scene.fog = new THREE.Fog(fondo, 26, 62);
    const suelo = new THREE.Mesh(
      new THREE.PlaneGeometry(240, 240),
      new THREE.MeshStandardMaterial({ color: this.claro ? 0xdfe4ec : 0x0b0f18, roughness: 0.92, metalness: 0 })
    );
    suelo.rotation.x = -Math.PI / 2;
    suelo.position.y = -0.36;
    suelo.receiveShadow = true;
    this.scene.add(suelo);
    this.suelo = suelo;
  }

  _luces() {
    const clave = this.clave = new THREE.DirectionalLight(0xfff4e8, this.claro ? 1.5 : 1.75);
    clave.position.set(-8, 16, 9);
    if (this.perfil.sombra) {
      clave.castShadow = true;
      clave.shadow.mapSize.set(this.perfil.sombra, this.perfil.sombra);
      const s = clave.shadow.camera; s.left = -11; s.right = 11; s.top = 9; s.bottom = -9; s.near = 2; s.far = 45;
      clave.shadow.bias = -0.0004; clave.shadow.normalBias = 0.025; clave.shadow.radius = 4;
    }
    this.scene.add(clave);
    const contra = this.contra = new THREE.DirectionalLight(0x8fb2ff, this.claro ? 0.5 : 1.3);
    contra.position.set(10, 6, -14);
    this.scene.add(contra);
    this.scene.add(new THREE.HemisphereLight(this.claro ? 0xffffff : 0x9fb6ff, this.claro ? 0xcfd6e2 : 0x0a0d14, this.claro ? 0.35 : 0.25));
  }

  _materiales() {
    const cep = texturaCepillado(0.34, 0.16); cep.repeat.set(2, 2);
    const cepLosa = texturaCepillado(0.55, 0.12); cepLosa.repeat.set(4, 3);
    const M = this.M = {
      aluminio: new THREE.MeshPhysicalMaterial({
        color: this.claro ? 0xb9bfca : 0x7d8696, metalness: 0.9, roughness: 0.4, roughnessMap: cep,
        clearcoat: 0.35, clearcoatRoughness: 0.28,
      }),
      grafito: new THREE.MeshPhysicalMaterial({
        color: this.claro ? 0xcfd4dd : 0x171b24, metalness: this.claro ? 0.1 : 0.55, roughness: 0.62, roughnessMap: cepLosa,
        clearcoat: 0.18, clearcoatRoughness: 0.5,
      }),
      ceramica: new THREE.MeshPhysicalMaterial({ color: 0xe4e7ee, metalness: 0, roughness: 0.55, clearcoat: 0.6, clearcoatRoughness: 0.35 }),
      funda: new THREE.MeshPhysicalMaterial({ color: this.claro ? 0x2a3140 : 0x1a1f2b, metalness: 0.7, roughness: 0.4 }),
    };
    M.vidrio = this.perfil.vidrio
      ? new THREE.MeshPhysicalMaterial({
          color: 0xdfe9ff, metalness: 0, roughness: 0.06, transmission: 1, thickness: 0.9, ior: 1.46,
          attenuationColor: new THREE.Color(0x6f95ff), attenuationDistance: 3.2, clearcoat: 1, clearcoatRoughness: 0.05,
          specularIntensity: 1, envMapIntensity: 1.2,
        })
      : new THREE.MeshPhysicalMaterial({
          color: 0xbcd0ff, metalness: 0.1, roughness: 0.08, transparent: true, opacity: 0.32,
          clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.6, depthWrite: false,
        });
    return M;
  }

  _construir() {
    const M = this._materiales();
    const planta = this.planta = new THREE.Group();
    this.scene.add(planta);

    /* Losa */
    const anchoLosa = this.solo ? 4.4 : 15, fondoLosa = this.solo ? 3.4 : 9.4;
    const losa = new THREE.Mesh(new RoundedBoxGeometry(anchoLosa, 0.34, fondoLosa, 4, 0.12), M.grafito);
    losa.position.y = -0.17; losa.receiveShadow = true; losa.castShadow = true;
    planta.add(losa);
    const rej = new THREE.Mesh(new THREE.PlaneGeometry(anchoLosa - 0.4, fondoLosa - 0.4),
      new THREE.MeshBasicMaterial({ map: texturaRejilla(this.claro), transparent: true, depthWrite: false }));
    rej.rotation.x = -Math.PI / 2; rej.position.y = 0.002;
    planta.add(rej);

    /* Módulos */
    const lista = this.solo ? MODULOS.filter((m) => m.id === this.solo) : MODULOS;
    this.modulos = lista.map((m, i) => this._modulo(m, i));

    /* Núcleo, conductos, fichas, escaneo */
    if (!this.solo) {
      this._nucleo();
      this._conductos();
      this._fichas();
    } else {
      this._conductoSolo();
    }
    this._escaneo(anchoLosa, fondoLosa);
  }

  _modulo(m, i) {
    const M = this.M;
    const g = new THREE.Group();
    const bx = this.solo ? 0 : m.x, bz = this.solo ? 0 : m.z;
    g.position.set(bx, 0, bz);

    const cuerpo = new THREE.Mesh(new RoundedBoxGeometry(m.w, m.h, m.d, 4, 0.07), M.aluminio);
    cuerpo.position.y = m.h / 2; cuerpo.castShadow = true; cuerpo.receiveShadow = true;
    cuerpo.userData.indice = i;
    g.add(cuerpo);

    // Pantalla embutida arriba: la interfaz del departamento.
    // Una pantalla emite su propia luz: material sin iluminar, con el brillo
    // por debajo del umbral del bloom (no florece: se lee).
    const pantallaMat = new THREE.MeshBasicMaterial({ color: 0xd8dde8 });
    const tex = texturaPantalla(m, this.claro);
    pantallaMat.map = tex;
    const pw = m.w - 0.26, pd = m.d - 0.26;
    const pantalla = new THREE.Mesh(new THREE.PlaneGeometry(pw, pd), pantallaMat);
    pantalla.rotation.x = -Math.PI / 2; pantalla.position.y = m.h + 0.013;
    g.add(pantalla);
    // Marco oscuro de la pantalla (el bisel que la hace "embutida").
    const marco = new THREE.Mesh(new RoundedBoxGeometry(pw + 0.08, 0.02, pd + 0.08, 2, 0.01), M.funda);
    marco.position.y = m.h - 0.004;
    g.add(marco);
    if (m.cap) this._cargarCaptura(m.cap, pantallaMat, pw / pd);

    // Rótulo del frente.
    const rot = new THREE.Mesh(new THREE.PlaneGeometry(Math.min(m.w - 0.2, 1.9), 0.24),
      new THREE.MeshBasicMaterial({ map: texturaRotulo(m.nombre, m.color, this.claro), transparent: true, depthWrite: false }));
    rot.position.set(-m.w / 2 + Math.min(m.w - 0.2, 1.9) / 2 + 0.1, 0.24, m.d / 2 + 0.003);
    g.add(rot);

    // Franja de estado en la base: el color del departamento, emisivo.
    const franjaMat = new THREE.MeshBasicMaterial({ color: m.color, toneMapped: false });
    const franja = new THREE.Mesh(new THREE.BoxGeometry(m.w + 0.05, 0.035, m.d + 0.05), franjaMat);
    franja.position.y = 0.03;
    g.add(franja);

    // Aristas de plano (Diseñar).
    const aristas = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(m.w + 0.12, m.h + 0.12, m.d + 0.12)),
      new THREE.LineBasicMaterial({ color: 0x7aa2ff, transparent: true, opacity: 0, toneMapped: false }));
    aristas.position.y = m.h / 2;
    g.add(aristas);

    // Columna de medida (Medir): vidrio con luz dentro.
    const colMat = new THREE.MeshBasicMaterial({ color: m.color, transparent: true, opacity: 0.85, toneMapped: false });
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1, 0.12), colMat);
    col.position.set(m.w / 2 - 0.2, m.h, -m.d / 2 + 0.2);
    col.scale.y = 0.0001;
    g.add(col);

    // Sin mapa de sombras (calidad baja): sombra de contacto horneada, un
    // degradado bajo el módulo. Barato y mantiene el objeto "apoyado".
    if (!this.perfil.sombra) {
      if (!this._texSombra) {
        const c = lienzo(128, 128), x = c.getContext("2d"), gr = x.createRadialGradient(64, 64, 8, 64, 64, 64);
        gr.addColorStop(0, "rgba(0,0,0,.55)"); gr.addColorStop(1, "rgba(0,0,0,0)");
        x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
        this._texSombra = new THREE.CanvasTexture(c);
      }
      const sm = new THREE.Mesh(new THREE.PlaneGeometry(m.w * 1.7, m.d * 1.7), new THREE.MeshBasicMaterial({ map: this._texSombra, transparent: true, depthWrite: false }));
      sm.rotation.x = -Math.PI / 2; sm.position.y = 0.004;
      g.add(sm);
    }
    this.planta.add(g);
    // Desorden estable por módulo: dónde flota cuando nada está conectado.
    const dis = {
      x: (ruido(i, 11) - 0.5) * 2.6, z: (ruido(i, 12) - 0.5) * 2.2, y: 0.7 + ruido(i, 13) * 1.5,
      ry: (ruido(i, 14) - 0.5) * 0.9, rx: (ruido(i, 15) - 0.5) * 0.22, rz: (ruido(i, 16) - 0.5) * 0.22,
    };
    return {
      m, g, cuerpo, pantallaMat, franjaMat, aristas, col, colMat, bx, bz, dis,
      // física de muelle por eje
      pos: new THREE.Vector3(bx, 0, bz), vel: new THREE.Vector3(), rot: new THREE.Vector3(), vrot: new THREE.Vector3(),
      alzado: 0, valor: 0.35 + ruido(i, 17) * 0.6,
    };
  }

  _cargarCaptura(nombre, mat, aspecto) {
    const url = `/assets/img/demos/${nombre}-${this.claro ? "light" : "dark"}-700.webp`;
    new THREE.TextureLoader().load(url, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      // Recorte tipo "cover": la captura (≈1,72:1) llena la pantalla sin deformarse.
      const ia = t.image.width / t.image.height;
      if (ia > aspecto) { t.repeat.set(aspecto / ia, 1); t.offset.set((1 - aspecto / ia) / 2, 0); }
      else { t.repeat.set(1, ia / aspecto); t.offset.set(0, (1 - ia / aspecto) / 2); }
      const vieja = mat.map;
      mat.map = t; mat.needsUpdate = true;
      vieja && vieja.dispose();
      this._pintarSiQuieto();
    });
  }

  _nucleo() {
    const M = this.M;
    const n = this.nucleo = new THREE.Group();
    const zocalo = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.35, 0.3, 64), M.ceramica);
    zocalo.position.y = 0.15; zocalo.castShadow = true; zocalo.receiveShadow = true;
    n.add(zocalo);
    const cuerpo = new THREE.Group(); // lo que sube desde la losa
    n.add(cuerpo); this.nucleoCuerpo = cuerpo;
    const vidrio = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 1.9, 96, 1, false), M.vidrio);
    vidrio.position.y = 0.3 + 0.95; vidrio.castShadow = false;
    cuerpo.add(vidrio);
    for (const y of [0.32, 2.18]) {
      const aro = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.045, 16, 96), M.aluminio);
      aro.rotation.x = Math.PI / 2; aro.position.y = y; aro.castShadow = true;
      cuerpo.add(aro);
    }
    const tapa = new THREE.Mesh(new THREE.CylinderGeometry(1.04, 1.04, 0.08, 96), M.aluminio);
    tapa.position.y = 2.24; tapa.castShadow = true;
    cuerpo.add(tapa);
    // Rótulo en la tapa.
    const rotulo = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.19),
      new THREE.MeshBasicMaterial({ map: texturaRotulo("D-Code OS", 0x5b8cff, this.claro), transparent: true, depthWrite: false }));
    rotulo.rotation.x = -Math.PI / 2; rotulo.position.set(0.08, 2.285, 0.1);
    cuerpo.add(rotulo);
    // El núcleo de IA: una red que lee (icosaedro de aristas) alrededor de
    // una luz que late. Emisivo sin tone mapping: lo único que el bloom toca.
    const ia = this.ia = new THREE.Group();
    ia.position.y = 1.25;
    const red = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.52, 1)),
      new THREE.LineBasicMaterial({ color: 0x9dbbff, toneMapped: false, transparent: true, opacity: 0.9 }));
    ia.add(red);
    const luz = this.iaLuz = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 16), new THREE.MeshBasicMaterial({ color: 0xa9c4ff, toneMapped: false }));
    ia.add(luz);
    const puntual = this.iaPuntual = new THREE.PointLight(0x7fa6ff, 0, 3.2, 2);
    ia.add(puntual);
    cuerpo.add(ia);
    this.planta.add(n);
  }

  /* Rutas de los conductos: salen de la cara del módulo que mira al núcleo,
     corren por la losa en ortogonal (como una instalación real, no como un
     cable tirado) y entran en el zócalo. */
  _ruta(m) {
    const y = 0.075;
    const sz = Math.sign(m.z) || 1;
    const p0 = new THREE.Vector3(m.x, y, m.z - sz * (m.d / 2));
    const zMedio = sz * 1.55;
    const pts = [p0, new THREE.Vector3(m.x, y, zMedio + sz * 0.3), new THREE.Vector3(m.x, y, zMedio)];
    const xEntrada = Math.max(-0.9, Math.min(0.9, m.x * 0.22));
    pts.push(new THREE.Vector3(m.x * 0.6 + xEntrada * 0.4, y, zMedio));
    pts.push(new THREE.Vector3(xEntrada, y, zMedio));
    pts.push(new THREE.Vector3(xEntrada, y, sz * 1.25));
    return new THREE.CatmullRomCurve3(pts, false, "centripetal", 0.05);
  }

  _conductos() {
    this.conductos = [];
    const uniforms = this.uConducto = { uT: { value: 0 }, uRevela: { value: 0 }, uFlujo: { value: 0 } };
    for (let i = 0; i < MODULOS.length; i++) {
      const m = MODULOS[i];
      const curva = this._ruta(m);
      const funda = new THREE.Mesh(new THREE.TubeGeometry(curva, 96, 0.075, 10), this.M.funda);
      funda.castShadow = true; funda.receiveShadow = true;
      const col = new THREE.Color(m.color);
      const luzMat = new THREE.ShaderMaterial({
        uniforms: Object.assign({ uCol: { value: new THREE.Vector3(col.r, col.g, col.b) }, uFase: { value: ruido(i, 21) } }, uniforms),
        vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
        fragmentShader: `
          uniform float uT, uRevela, uFlujo, uFase; uniform vec3 uCol; varying vec2 vUv;
          void main(){
            if (vUv.x > uRevela) discard;
            float s = fract(vUv.x * 5.0 - uT * 0.55 - uFase);
            float pulso = smoothstep(0.0, 0.05, s) * (1.0 - smoothstep(0.05, 0.2, s));
            vec3 c = mix(vec3(0.07,0.09,0.14), uCol * 0.35, uFlujo) + mix(uCol, vec3(1.0), 0.35) * pulso * 3.2 * uFlujo;
            gl_FragColor = vec4(c, 1.0);
          }`,
        toneMapped: false,
      });
      // El hilo de luz va DENTRO de la funda, asomando por una ranura: se
      // dibuja algo más gordo en la parte superior para que se vea desde arriba.
      const luz = new THREE.Mesh(new THREE.TubeGeometry(curva, 96, 0.032, 6), luzMat);
      luz.position.y = 0.058; // el hilo de luz corre por encima de la funda
      const grupo = new THREE.Group();
      grupo.add(funda); grupo.add(luz);
      funda.visible = false; luz.visible = false;
      this.planta.add(grupo);
      this.conductos.push({ curva, funda, luz });
    }
  }

  _revelarFundas(cd) {
    const f = Math.min(1, cd * 1.15);
    for (const co of this.conductos) {
      const g = co.funda.geometry;
      if (!co.total) co.total = g.index.count;
      g.setDrawRange(0, Math.floor(co.total * f / 6) * 6);
    }
  }

  _conductoSolo() {
    // En una página interior el módulo sale por un conducto hacia el resto del
    // sistema, fuera de cuadro: es una parte, no una pieza suelta.
    const m = this.modulos[0].m;
    const curva = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-m.w / 2, 0.075, 0), new THREE.Vector3(-1.6, 0.075, 0), new THREE.Vector3(-1.9, 0.075, 0.35),
      new THREE.Vector3(-1.9, 0.075, 1.2), new THREE.Vector3(-1.9, 0.075, 2.4),
    ], false, "centripetal", 0.05);
    const uniforms = this.uConducto = { uT: { value: 0 }, uRevela: { value: 1 }, uFlujo: { value: 1 } };
    const col = new THREE.Color(m.color);
    const luzMat = new THREE.ShaderMaterial({
      uniforms: Object.assign({ uCol: { value: new THREE.Vector3(col.r, col.g, col.b) }, uFase: { value: 0 } }, uniforms),
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: `uniform float uT, uFase; uniform vec3 uCol; varying vec2 vUv;
        void main(){ float s = fract(vUv.x * 4.0 - uT * 0.55); float p = smoothstep(0.0,0.05,s)*(1.0-smoothstep(0.05,0.2,s));
        gl_FragColor = vec4(uCol*0.35 + mix(uCol, vec3(1.0), 0.35)*p*3.2, 1.0); }`,
      toneMapped: false,
    });
    this.planta.add(new THREE.Mesh(new THREE.TubeGeometry(curva, 64, 0.075, 10), this.M.funda));
    const hilo = new THREE.Mesh(new THREE.TubeGeometry(curva, 64, 0.032, 6), luzMat); hilo.position.y = 0.058; this.planta.add(hilo);
    this.conductos = [];
  }

  /* Fichas: el trabajo a mano. Papeles que alguien copia de un sitio a otro.
     InstancedMesh: una sola llamada de dibujo para todas. */
  _fichas() {
    const n = this.perfil.fichas;
    const geo = new RoundedBoxGeometry(0.34, 0.018, 0.25, 1, 0.006);
    const mat = new THREE.MeshPhysicalMaterial({ color: 0xffd08a, roughness: 0.7, metalness: 0, emissive: 0xffb43a, emissiveIntensity: 0.35, transparent: true, opacity: 1 });
    const im = this.fichas = new THREE.InstancedMesh(geo, mat, n);
    im.castShadow = true;
    im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.fichaDatos = [];
    for (let i = 0; i < n; i++) {
      const a = Math.floor(ruido(i, 31) * MODULOS.length);
      let b = Math.floor(ruido(i, 32) * MODULOS.length); if (b === a) b = (a + 3) % MODULOS.length;
      this.fichaDatos.push({ a, b, t: ruido(i, 33), v: 0.25 + ruido(i, 34) * 0.3, alto: 1.2 + ruido(i, 35) * 1.4, gira: (ruido(i, 36) - 0.5) * 6 });
    }
    this.planta.add(im);
  }

  /* Haz de escaneo: lámina de luz vertical que recorre la planta. */
  _escaneo(ancho, fondo) {
    const mat = new THREE.ShaderMaterial({
      uniforms: { uA: { value: 0 } },
      vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
      fragmentShader: `uniform float uA; varying vec2 vUv;
        void main(){ float e = pow(1.0 - vUv.y, 2.2); float borde = smoothstep(0.0,0.08,vUv.x)*smoothstep(1.0,0.92,vUv.x);
        gl_FragColor = vec4(vec3(0.45,0.65,1.0) * e * borde * uA * 1.6, e * borde * uA * 0.5); }`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false,
    });
    const haz = this.haz = new THREE.Mesh(new THREE.PlaneGeometry(fondo, 3.2), mat);
    haz.rotation.y = Math.PI / 2; haz.position.y = 1.6;
    this.hazAncho = ancho;
    const linea = this.hazLinea = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.01, fondo - 0.3), new THREE.MeshBasicMaterial({ color: 0x9dbbff, toneMapped: false, transparent: true }));
    linea.position.y = 0.01;
    this.planta.add(haz); this.planta.add(linea);
  }

  /* ------------------------------------------------------------ POSTPROCESO
     Bloom selectivo "barato": el umbral alto hace que solo lo emisivo sin
     tone mapping (conductos, franjas, núcleo) supere la luminancia 1 y
     florezca; los metales y la cerámica no. Se carga bajo demanda. */
  async activarPost() {
    if (!this.perfil.bloom || this.composer) return;
    try {
      const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }] = await Promise.all([
        import("/assets/vendor/three/addons/postprocessing/EffectComposer.js"),
        import("/assets/vendor/three/addons/postprocessing/RenderPass.js"),
        import("/assets/vendor/three/addons/postprocessing/UnrealBloomPass.js"),
        import("/assets/vendor/three/addons/postprocessing/OutputPass.js"),
      ]);
      const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
      const rt = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: this.calidad === "alta" ? 4 : 2 });
      const c = new EffectComposer(this.renderer, rt);
      c.addPass(new RenderPass(this.scene, this.camera));
      const escala = this.calidad === "alta" ? 0.5 : 0.35;
      const bloom = this.bloom = new UnrealBloomPass(new THREE.Vector2(size.x * escala, size.y * escala), this.claro ? 0.22 : 0.42, 0.5, 1.35);
      c.addPass(bloom);
      c.addPass(new OutputPass());
      this.composer = c;
      this._resize();
    } catch (e) {
      console.warn("[planta] postproceso no disponible, se sigue sin él:", e);
      this.perfil.bloom = false;
    }
  }

  /* ------------------------------------------------------------ API */
  irA(nombre) {
    const e = ESTADOS[nombre];
    if (!e) return;
    this.objetivo = Object.assign({}, e);
    this.nombreEstado = nombre;
    const c = CAMS[e.cam];
    this.camObj = c;
    if (this.quieto) { this.estado = Object.assign({}, e); this.cam.p.set(...c.p); this.cam.t.set(...c.t); this.cam.vx = c.vx; this.cam.vy = c.vy; this._paso(0.016, true); this._render(); }
    else this.arrancar();
  }
  /** QA: salta al estado objetivo sin transición (capturas en GPU por software). */
  saltar() { this._paso(0.016, true); for (let i = 0; i < 40; i++) this._paso(0.05); this._render(); }

  setFoco(i) { this.foco = i == null ? -1 : i; this._pintarSiQuieto(); }
  /** Varios módulos a la vez, por id de departamento (p. ej. las áreas marcadas en el diagnóstico). */
  setFocos(ids) { this.focos = new Set(this.modulos.map((mo, i) => (ids.indexOf(mo.m.id) >= 0 ? i : -1)).filter((i) => i >= 0)); if (!this.quieto) this.arrancar(); this._pintarSiQuieto(); }
  setEncuadre(vx, vy) { this.encuadre = { vx, vy }; this._resize(); }
  setTema(claro) {
    if (claro === this.claro) return;
    // Cambiar de tema reconstruye materiales y texturas dependientes: es un
    // evento raro (un clic) y así cada tema tiene sus valores exactos.
    this.claro = claro;
    if (!this.transparente) {
      const fondo = new THREE.Color(claro ? 0xe9edf3 : 0x070a11);
      this.scene.background = fondo; this.scene.fog.color = fondo;
      this.suelo.material.color.set(claro ? 0xdfe4ec : 0x0b0f18);
    } else this.suelo.material.opacity = claro ? 0.18 : 0.45;
    this.M.grafito.color.set(claro ? 0xcfd4dd : 0x171b24); this.M.grafito.metalness = claro ? 0.1 : 0.55;
    this.M.aluminio.color.set(claro ? 0xb9bfca : 0x7d8696);
    this.clave.intensity = claro ? 1.5 : 1.75; this.contra.intensity = claro ? 0.5 : 1.3;
    for (const mo of this.modulos) {
      const t = texturaPantalla(mo.m, claro);
      mo.pantallaMat.map = t; mo.pantallaMat.needsUpdate = true;
      if (mo.m.cap) { const pw = mo.m.w - 0.26, pd = mo.m.d - 0.26; this._cargarCaptura(mo.m.cap, mo.pantallaMat, pw / pd); }
    }
    if (this.bloom) this.bloom.strength = claro ? 0.22 : 0.42;
    this._pintarSiQuieto();
  }
  puntero_(x, y) { this.puntero.x = x; this.puntero.y = y; if (!this.quieto) this.arrancar(); }

  /* Módulo bajo el cursor (raycast solo contra 8 cuerpos: coste despreciable). */
  elegir(clientX, clientY) {
    const r = this.canvas.getBoundingClientRect();
    if (!this._ray) { this._ray = new THREE.Raycaster(); this._nd = new THREE.Vector2(); }
    this._nd.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    this._ray.setFromCamera(this._nd, this.camera);
    const hits = this._ray.intersectObjects(this.modulos.map((m) => m.cuerpo), false);
    const i = hits.length ? hits[0].object.userData.indice : -1;
    this.hover = i;
    return i >= 0 ? this.modulos[i].m : null;
  }

  _resize() {
    const c = this.canvas;
    const w = c.clientWidth || c.parentElement.clientWidth, h = c.clientHeight || c.parentElement.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.ancho = w; this.alto = h;
    this.estrecho = w / h < 0.9;
    this.camera.updateProjectionMatrix();
    if (this.composer) {
      this.composer.setPixelRatio(this.renderer.getPixelRatio());
      this.composer.setSize(w, h);
    }
    this._pintarSiQuieto();
  }

  _paso(dt, forzado) {
    const S = this.estado, O = this.objetivo;
    const v = forzado ? 1e3 : 2.2;
    for (const k of ["disperso", "nucleo", "conductos", "manual", "plano", "escaneo", "medida", "calma"]) S[k] = amort(S[k], O[k], dt, k === "conductos" ? 1.4 : v);
    this.tiempo += dt;
    const t = this.tiempo;

    // Cámara: amortiguada hacia el encuadre, con deriva lenta y parallax del puntero.
    const c = this.camObj || CAMS[S.cam];
    const vc = forzado ? 1e3 : 1.6;
    this.cam.p.x = amort(this.cam.p.x, c.p[0], dt, vc); this.cam.p.y = amort(this.cam.p.y, c.p[1], dt, vc); this.cam.p.z = amort(this.cam.p.z, c.p[2], dt, vc);
    this.cam.t.x = amort(this.cam.t.x, c.t[0], dt, vc); this.cam.t.y = amort(this.cam.t.y, c.t[1], dt, vc); this.cam.t.z = amort(this.cam.t.z, c.t[2], dt, vc);
    const ex = this.estrecho ? 0 : (this.encuadre.vx || c.vx), ey = this.estrecho ? (this.solo || this.transparente ? 0 : -0.2) : (this.encuadre.vy || c.vy);
    this.cam.vx = amort(this.cam.vx, ex, dt, vc); this.cam.vy = amort(this.cam.vy, ey, dt, vc);
    this.puntero.sx = amort(this.puntero.sx, this.puntero.x, dt, 3); this.puntero.sy = amort(this.puntero.sy, this.puntero.y, dt, 3);
    const deriva = this.quieto ? 0 : 1;
    const ang = Math.sin(t * 0.07) * 0.08 * deriva + this.puntero.sx * 0.12;
    const lejos = this.estrecho ? 1.3 : 1;
    const p = this._v2 || (this._v2 = new THREE.Vector3());
    p.copy(this.cam.t).lerp(this.cam.p, lejos);
    const cs = Math.cos(ang), sn = Math.sin(ang);
    this.camera.position.set(p.x * cs - p.z * sn, p.y + this.puntero.sy * -0.9 + Math.sin(t * 0.11) * 0.15 * deriva, p.x * sn + p.z * cs);
    this.camera.lookAt(this.cam.t);
    if (this.ancho) this.camera.setViewOffset(this.ancho, this.alto, this.cam.vx * this.ancho, -this.cam.vy * this.alto, this.ancho, this.alto);

    // La luz clave sigue un poco al puntero: el reflejo se mueve por el metal.
    this.clave.position.set(-8 + this.puntero.sx * 5, 16, 9 + this.puntero.sy * 4);

    // Módulos: muelle críticamente amortiguado hacia su sitio (o hacia su
    // posición "suelta" cuando no hay sistema). Tienen peso: aterrizan.
    const dis = S.disperso;
    const k = 38, amortig = 9.5;
    this.modulos.forEach((mo, i) => {
      const d = mo.dis;
      const flota = dis * (d.y + Math.sin(t * 0.6 + i) * 0.12 * deriva);
      const marcado = i === this.hover || i === this.foco || this.focos.has(i);
      const alz = marcado ? 0.14 : 0;
      mo.alzado = amort(mo.alzado, alz, dt, 8);
      const obj = this._v.set(mo.bx + d.x * dis, flota + mo.alzado, mo.bz + d.z * dis);
      if (forzado) { mo.pos.copy(obj); mo.vel.set(0, 0, 0); }
      else {
        const ax = (obj.x - mo.pos.x) * k - mo.vel.x * amortig, ay = (obj.y - mo.pos.y) * k - mo.vel.y * amortig, az = (obj.z - mo.pos.z) * k - mo.vel.z * amortig;
        mo.vel.x += ax * dt; mo.vel.y += ay * dt; mo.vel.z += az * dt;
        mo.pos.addScaledVector(mo.vel, dt);
      }
      mo.g.position.copy(mo.pos);
      mo.g.rotation.set(d.rx * dis, d.ry * dis + (this.solo ? Math.sin(t * 0.25) * 0.12 * deriva : 0), d.rz * dis);
      // Franja: apagada y ámbar cuando está suelto; su color cuando conecta.
      const on = 0.25 + 0.75 * (1 - dis);
      const destaca = marcado ? 1.6 : 1;
      mo.franjaMat.color.set(mo.m.color).multiplyScalar(on * destaca * (this.claro ? 1.1 : 1.9));
      mo.pantallaMat.color.setScalar((this.claro ? 0.92 : 0.62) * (0.6 + 0.4 * (1 - dis)) * (destaca > 1 ? 1.25 : 1));
      mo.aristas.material.opacity = S.plano * 0.9;
      const alto = S.medida * (0.6 + mo.valor * 1.6) * (0.85 + 0.15 * Math.sin(t * 0.8 + i));
      mo.col.scale.y = Math.max(0.0001, alto);
      mo.col.position.y = mo.m.h + alto / 2;
      mo.colMat.opacity = Math.min(1, S.medida * 1.2) * 0.85;
    });

    // Núcleo: sube desde dentro de la losa.
    if (this.nucleo) {
      const nu = S.nucleo;
      this.nucleoCuerpo.position.y = -2.4 * (1 - nu);
      this.nucleoCuerpo.visible = nu > 0.02;
      this.ia.rotation.y = t * 0.35; this.ia.rotation.x = t * 0.15;
      const late = 0.75 + 0.25 * Math.sin(t * 2.1);
      this.iaLuz.scale.setScalar(0.8 + 0.25 * late * nu);
      this.iaPuntual.intensity = 2.2 * nu * late;
    }
    // Conductos: se tienden (uRevela) y luego empiezan a llevar dato (uFlujo).
    if (this.uConducto && this.conductos.length) {
      const cd = S.conductos;
      this.uConducto.uRevela.value = Math.min(1, cd * 1.15);
      this.uConducto.uFlujo.value = Math.max(0, Math.min(1, (cd - 0.55) / 0.45));
      const vis = cd > 0.01;
      for (const co of this.conductos) { co.luz.visible = vis; co.funda.visible = vis; co.funda.scale.set(1, 1, 1); }
      this._revelarFundas(cd);
    }
    if (this.uConducto) this.uConducto.uT.value = t;

    // Fichas: saltan de un módulo a otro en arco, como un papel que alguien lleva.
    if (this.fichas) {
      const man = S.manual;
      const n = this.fichaDatos.length, vis = Math.round(n * Math.min(1, man / 1.6 + (man > 0.05 ? 0.35 : 0)));
      for (let i = 0; i < n; i++) {
        const f = this.fichaDatos[i];
        f.t += dt * f.v * (0.6 + man * 0.5) * deriva;
        if (f.t > 1) { f.t -= 1; f.a = f.b; f.b = Math.floor(ruido(i + Math.floor(t * 10), 37) * MODULOS.length); if (f.b === f.a) f.b = (f.a + 1) % MODULOS.length; }
        const A = this.modulos[f.a], B = this.modulos[f.b];
        const u = f.t, ya = A.pos.y + A.m.h + 0.1, yb = B.pos.y + B.m.h + 0.1;
        const x = A.pos.x + (B.pos.x - A.pos.x) * u, z = A.pos.z + (B.pos.z - A.pos.z) * u;
        const y = ya + (yb - ya) * u + Math.sin(u * Math.PI) * f.alto;
        const s = i < vis ? Math.min(1, man * 1.5) : 0;
        this._e.set(Math.sin(u * 6 + i) * 0.4, u * f.gira, Math.cos(u * 5 + i) * 0.3);
        this._q.setFromEuler(this._e);
        this._s.setScalar(Math.max(0.0001, s));
        this._m4.compose(this._v.set(x, y, z), this._q, this._s);
        this.fichas.setMatrixAt(i, this._m4);
      }
      this.fichas.instanceMatrix.needsUpdate = true;
      this.fichas.visible = man > 0.02;
    }

    // Haz de escaneo.
    if (this.haz) {
      const a = S.escaneo;
      const x = ((t * 0.18) % 1.3 - 0.15) * this.hazAncho - this.hazAncho / 2;
      this.haz.position.x = x; this.hazLinea.position.x = x;
      this.haz.material.uniforms.uA.value = a;
      this.hazLinea.material.opacity = a;
      this.haz.visible = this.hazLinea.visible = a > 0.02;
    }
  }

  _render() {
    // Con postproceso, info se reiniciaría en cada pase: se cuenta el fotograma entero.
    const inf = this.renderer.info; inf.autoReset = false; inf.reset();
    if (this.composer) this.composer.render(); else this.renderer.render(this.scene, this.camera);
  }
  _pintarSiQuieto() { if (this.quieto) { this._paso(0.016, true); this._render(); } }

  _tick(ahora) {
    this.raf = null;
    if (!this.visible || this.oculta) return;
    const dt = Math.min(0.05, (ahora - (this.ultimo || ahora)) / 1000);
    this.ultimo = ahora;
    this._paso(dt || 0.016);
    this._render();
    this._medir(dt);
    this.raf = requestAnimationFrame((t) => this._tick(t));
  }

  /* Calidad adaptable en marcha: si 90 fotogramas seguidos van lentos
     (mediana > 26 ms), se baja un escalón. Nunca se sube: la estabilidad
     vale más que el último detalle. */
  _medir(dt) {
    if (!dt) return;
    this.fotogramas.push(dt * 1000);
    if (this.fotogramas.length < 90) return;
    const f = this.fotogramas.sort((a, b) => a - b), med = f[45];
    this.fotogramas = [];
    this.ultimaMediana = med;
    if (med > 26) this.bajar();
  }
  // Si ni en baja sostiene el ritmo (mediana > 45 ms), pasa a estática.
  _aEstatica() { this.parar(); this.quieto = true; this.calidad = "estatica"; this.saltar(); }
  bajar() {
    if (this.bajado === "baja") { if ((this.ultimaMediana || 0) > 45) this._aEstatica(); return; }
    if (this.composer && this.calidad !== "baja") {
      this.composer = null; this.perfil.bloom = false;
    } else {
      this.renderer.shadowMap.enabled = false;
      this.scene.traverse((o) => { if (o.material) o.material.needsUpdate = true; });
      this.renderer.setPixelRatio(1);
      this.bajado = "baja";
    }
    this.calidad = this.bajado || "media";
    this._resize();
  }

  arrancar() {
    if (this.quieto) { this._pintarSiQuieto(); return; }
    if (this.raf == null && this.visible && !this.oculta) this.raf = requestAnimationFrame((t) => { this.ultimo = t; this._tick(t); });
  }
  parar() { if (this.raf != null) { cancelAnimationFrame(this.raf); this.raf = null; } }

  info() {
    const i = this.renderer.info;
    return { calidad: this.calidad, llamadas: i.render.calls, triangulos: i.render.triangles, geometrias: i.memory.geometries, texturas: i.memory.textures, mediana: this.ultimaMediana || null, bloom: !!this.composer };
  }
}

/** Monta la planta en un <canvas>. Devuelve la instancia (API arriba). */
export async function montarPlanta(canvas, o = {}) {
  const p = new Planta(canvas, o);
  const ro = new ResizeObserver(() => p._resize());
  ro.observe(canvas.parentElement || canvas);
  document.addEventListener("visibilitychange", () => { p.oculta = document.hidden; if (p.oculta) p.parar(); else p.arrancar(); });
  if (o.observar !== false && "IntersectionObserver" in window) {
    new IntersectionObserver((en) => { p.visible = en[0].isIntersecting; if (p.visible) p.arrancar(); else p.parar(); }).observe(canvas);
  }
  p.irA(o.estado || "desorden");
  await p.activarPost();
  p._pintarSiQuieto();
  p.arrancar();
  return p;
}
