/* ==========================================================================
   D-CODE · MOTOR DE ESCENAS (un renderer, muchas escenas)
   ==========================================================================
   Un único WebGLRenderer sobre un único <canvas> fijo encima de la página
   (pointer-events:none). Cada hueco de la página marcado con
   [data-escena] es una "ventana": en cada fotograma se dibuja, con
   scissor, SOLO la escena de las ventanas que están a la vista, en el
   rectángulo exacto de su hueco. Así:

     - Hay una sola instancia de Three.js y un solo contexto WebGL.
     - Una escena se construye (import dinámico de su módulo) cuando su
       hueco se acerca a la pantalla, y se libera cuando queda lejos.
     - Al entrar solo existe la escena del héroe.
     - Si no hay ninguna ventana a la vista, no se dibuja nada.

   Calidad: alta / media / baja por dispositivo y, en marcha, por tiempo de
   fotograma medido (baja la resolución antes que la experiencia).
   Movimiento reducido: sin bucle; se redibuja solo al hacer scroll.
   ========================================================================== */

import * as THREE from "/assets/vendor/three/three.module.min.js";
import { RoomEnvironment } from "/assets/vendor/three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "/assets/vendor/three/addons/geometries/RoundedBoxGeometry.js";

const TAU = Math.PI * 2;
const V = "?v=036eca1ecf"; // el versionado lo reescribe update-asset-versions

/* ------------------------------------------------------------ CALIDAD */
function detectar() {
  const q = new URLSearchParams(location.search).get("calidad");
  if (q && TIER[q]) return q;
  const mem = navigator.deviceMemory || 8, nuc = navigator.hardwareConcurrency || 8;
  let gpu = "";
  try { const g = document.createElement("canvas").getContext("webgl2"), e = g && g.getExtension("WEBGL_debug_renderer_info"); gpu = e ? String(g.getParameter(e.UNMASKED_RENDERER_WEBGL)) : ""; } catch (e) { /* */ }
  if (/swiftshader|llvmpipe|software|basic render/i.test(gpu)) return "baja";
  if (mem <= 2 || nuc <= 2) return "baja";
  if (matchMedia("(pointer:coarse)").matches || innerWidth < 760 || mem <= 4) return "media";
  return "alta";
}
const TIER = {
  alta:  { dpr: 1.8, vidrio: true,  sombras: true,  seg: 1 },
  media: { dpr: 1.4, vidrio: false, sombras: false, seg: 0.75 },
  baja:  { dpr: 1.0, vidrio: false, sombras: false, seg: 0.5 },
};

/* ------------------------------------------------------------ KIT
   Lo que comparten todas las escenas: materiales físicos, entorno de luz,
   geometrías de base y utilidades. Una sola copia en memoria. */
function crearKit(renderer, calidad) {
  const T = TIER[calidad];
  const carga = new THREE.TextureLoader();
  const tex = (u, rep, color) => { const t = carga.load(u); t.wrapS = t.wrapT = THREE.RepeatWrapping; if (rep) t.repeat.set(rep[0], rep[1]); t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace; t.anisotropy = 8; return t; };
  const TX = "/assets/img/escenas/tex/";
  const uso = tex(TX + "uso-r.webp", [5, 5]), torno = tex(TX + "torneado-n.webp", [1, 4]), molet = tex(TX + "moleteado-n.webp", [4, 1]);

  /* Entorno: un estudio de fotografía de producto, construido (no
     descargado) y prefiltrado con PMREM: fondo casi negro y cuatro
     ventanas de luz (cenital, dos tiras laterales y un rebote). Los metales
     reflejan eso: filos brillantes sobre masas oscuras, que es lo que hace
     que un metal parezca metal. En claro, la misma sala, en gris cálido. */
  function estudio(claro) {
    const sc = new THREE.Scene();
    const fondo = new THREE.Mesh(new THREE.SphereGeometry(20, 32, 16), new THREE.MeshBasicMaterial({ color: claro ? 0x7d7a75 : 0x040405, side: THREE.BackSide }));
    sc.add(fondo);
    const caja = (w, h, x, y, z, k, col = 0xffffff) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); sc.add(m);
    };
    caja(10, 4, 0, 9, 2, claro ? 3 : 4.5);            // cenital
    caja(1.4, 9, -9, 1, 3, claro ? 2 : 3.2);          // tira izquierda
    caja(1.4, 9, 9, 1, -2, claro ? 1.6 : 2.4);        // tira derecha
    caja(12, 2, 0, -3, 9, claro ? 1.2 : 0.5);         // rebote frontal bajo
    caja(12, 4, -2, 5, 11, claro ? 2.2 : 2.4);        // ventana tras la cámara: da forma a las caras frontales
    caja(3, 1.2, 6, 5, 8, claro ? 0.6 : 1.4, 0x7f9dff); // acento azul D-Code
    const pm = new THREE.PMREMGenerator(renderer);
    const t = pm.fromScene(sc, 0.02).texture; pm.dispose();
    sc.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    return t;
  }
  const envs = {};
  const envDe = (c) => envs[c ? "c" : "o"] || (envs[c ? "c" : "o"] = estudio(c));
  let env = envDe(false);

  const M = {
    aluminio: new THREE.MeshPhysicalMaterial({ color: 0xc4c8ce, metalness: 1, roughness: 0.24, normalMap: torno, normalScale: new THREE.Vector2(0.18, 0.18), anisotropy: 0.6 }),
    acero: new THREE.MeshPhysicalMaterial({ color: 0xd6d9de, metalness: 1, roughness: 0.1, roughnessMap: uso, clearcoat: 0.6, clearcoatRoughness: 0.06 }),
    grafito: new THREE.MeshPhysicalMaterial({ color: 0x1c1e22, metalness: 0.8, roughness: 0.38, roughnessMap: uso, clearcoat: 0.3, clearcoatRoughness: 0.3 }),
    moleteado: new THREE.MeshPhysicalMaterial({ color: 0x22252a, metalness: 0.9, roughness: 0.35, normalMap: molet, normalScale: new THREE.Vector2(0.8, 0.8) }),
    ceramica: new THREE.MeshPhysicalMaterial({ color: 0xe9e7e2, metalness: 0, roughness: 0.48, clearcoat: 0.5, clearcoatRoughness: 0.35, sheen: 0.25, sheenRoughness: 0.8 }),
    plastico: new THREE.MeshPhysicalMaterial({ color: 0x2a2d33, metalness: 0, roughness: 0.46, clearcoat: 0.15, clearcoatRoughness: 0.5 }),
    silicio: new THREE.MeshPhysicalMaterial({ color: 0x2c2f3b, metalness: 0.75, roughness: 0.16, iridescence: 1, iridescenceIOR: 1.7, iridescenceThicknessRange: [180, 620], clearcoat: 0.8, clearcoatRoughness: 0.04 }),
    goma: new THREE.MeshPhysicalMaterial({ color: 0x121315, metalness: 0, roughness: 0.68, clearcoat: 0.15, clearcoatRoughness: 0.6 }),
    laton: new THREE.MeshPhysicalMaterial({ color: 0xc8a36a, metalness: 1, roughness: 0.26, roughnessMap: uso }),
  };
  M.vidrio = T.vidrio
    ? new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.04, transmission: 1, thickness: 0.8, ior: 1.5, attenuationColor: new THREE.Color(0x9fb6e6), attenuationDistance: 3, specularIntensity: 1, clearcoat: 1, clearcoatRoughness: 0.02 })
    : new THREE.MeshPhysicalMaterial({ color: 0x9aa9c4, metalness: 0.1, roughness: 0.04, transparent: true, opacity: 0.32, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.8, depthWrite: false });
  M.vidrioAzul = T.vidrio
    ? new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transmission: 1, thickness: 1.2, ior: 1.5, attenuationColor: new THREE.Color(0x2f5cff), attenuationDistance: 0.7, clearcoat: 1, clearcoatRoughness: 0.02 })
    : new THREE.MeshPhysicalMaterial({ color: 0x2f5cff, metalness: 0.2, roughness: 0.05, transparent: true, opacity: 0.55, clearcoat: 1, envMapIntensity: 2, depthWrite: false });
  const emisivos = new Map();
  M.luz = (hex, k = 1) => {
    const key = hex + ":" + k;
    if (!emisivos.has(key)) emisivos.set(key, new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(k), toneMapped: false }));
    return emisivos.get(key);
  };

  /* Geometrías de base, compartidas. */
  const G = {};
  const seg = (n) => Math.max(8, Math.round(n * T.seg));
  const com = (g) => { g.userData.compartida = true; return g; };
  G.redondo = (w, h, d, r) => { const k = `rb${w}|${h}|${d}|${r}`; return G[k] || (G[k] = com(new RoundedBoxGeometry(w, h, d, 3, r))); };
  G.esfera = com(new THREE.SphereGeometry(1, seg(48), seg(24)));
  G.esferaP = com(new THREE.SphereGeometry(1, 12, 8));
  G.cilindro = (rt, rb, h, n = 64) => { const k = `cy${rt}|${rb}|${h}|${n}`; return G[k] || (G[k] = com(new THREE.CylinderGeometry(rt, rb, h, seg(n)))); };
  /* Pieza "squircle" con bisel real (extrusión): una ficha, un icono de
     aplicación, un chip. Los cantos redondeados atrapan la luz. */
  G.ficha = (w, h, d, r) => {
    const k = `fi${w}|${h}|${d}|${r}`; if (G[k]) return G[k];
    const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    const b = Math.min(0.04, d * 0.3);
    const g = new THREE.ExtrudeGeometry(s, { depth: d - b * 2, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 3, curveSegments: 10 });
    g.translate(0, 0, -(d - b * 2) / 2); g.computeVertexNormals();
    return (G[k] = com(g));
  };

  /* Sombra de contacto: penumbra ancha + contacto oscuro. */
  const cSombra = (() => {
    const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d"), g = x.createRadialGradient(64, 64, 2, 64, 64, 64);
    g.addColorStop(0, "rgba(0,0,0,1)"); g.addColorStop(0.35, "rgba(0,0,0,.55)"); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  const sombras = [];
  const sombra = (w, d, op = 1) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: cSombra, transparent: true, depthWrite: false, opacity: op }));
    m.rotation.x = -Math.PI / 2; m.userData.op = op; sombras.push(m); return m;
  };

  /* Iconos grabados (canvas → textura): el lenguaje de las herramientas. */
  const iconos = {};
  const icono = (nombre) => {
    if (iconos[nombre]) return iconos[nombre];
    const S = 256, c = document.createElement("canvas"); c.width = c.height = S; const x = c.getContext("2d");
    x.strokeStyle = x.fillStyle = "#fff"; x.lineWidth = 12; x.lineCap = x.lineJoin = "round";
    const r = (a, b, w, h) => x.strokeRect(a, b, w, h);
    x.translate(S / 2, S / 2);
    switch (nombre) {
      case "hoja": r(-70, -70, 140, 140); for (const k of [-23, 23]) { x.beginPath(); x.moveTo(k, -70); x.lineTo(k, 70); x.stroke(); x.beginPath(); x.moveTo(-70, k); x.lineTo(70, k); x.stroke(); } break;
      case "correo": r(-80, -55, 160, 110); x.beginPath(); x.moveTo(-80, -55); x.lineTo(0, 10); x.lineTo(80, -55); x.stroke(); break;
      case "chat": x.beginPath(); x.moveTo(-70, -50); x.lineTo(70, -50); x.quadraticCurveTo(80, -50, 80, -40); x.lineTo(80, 30); x.quadraticCurveTo(80, 40, 70, 40); x.lineTo(-20, 40); x.lineTo(-50, 70); x.lineTo(-50, 40); x.lineTo(-70, 40); x.quadraticCurveTo(-80, 40, -80, 30); x.lineTo(-80, -40); x.quadraticCurveTo(-80, -50, -70, -50); x.stroke(); break;
      case "factura": x.beginPath(); x.moveTo(-55, -80); x.lineTo(55, -80); x.lineTo(55, 80); x.lineTo(-55, 80); x.closePath(); x.stroke(); x.font = "700 90px sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("€", 0, 8); break;
      case "agenda": r(-70, -60, 140, 130); x.beginPath(); x.moveTo(-70, -20); x.lineTo(70, -20); x.stroke(); for (const k of [-35, 35]) { x.beginPath(); x.moveTo(k, -80); x.lineTo(k, -45); x.stroke(); } break;
      case "carpeta": x.beginPath(); x.moveTo(-80, -50); x.lineTo(-25, -50); x.lineTo(-10, -30); x.lineTo(80, -30); x.lineTo(80, 60); x.lineTo(-80, 60); x.closePath(); x.stroke(); break;
      case "web": x.beginPath(); x.arc(0, 0, 75, 0, TAU); x.stroke(); x.beginPath(); x.ellipse(0, 0, 32, 75, 0, 0, TAU); x.stroke(); x.beginPath(); x.moveTo(-75, 0); x.lineTo(75, 0); x.stroke(); break;
      default: x.beginPath(); x.arc(0, 0, 60, 0, TAU); x.stroke();
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    return (iconos[nombre] = t);
  };

  /* Rótulo grabado (texto mono sobre transparente). */
  const rotulo = (texto, color = "#e9ecf2") => {
    const c = document.createElement("canvas"); c.width = 512; c.height = 96; const x = c.getContext("2d");
    x.fillStyle = color; x.font = "600 44px 'JetBrains Mono', ui-monospace, monospace"; x.textAlign = "center"; x.textBaseline = "middle";
    x.fillText(texto.toUpperCase(), 256, 50);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  };

  /* Pulsos de datos a lo largo de curvas: una sola InstancedMesh. */
  const pulsos = (curvas, porCurva, color, radio = 0.045) => {
    const n = curvas.length * porCurva;
    const im = new THREE.InstancedMesh(G.esferaP, M.luz(color, 2.2), n);
    im.frustumCulled = false;
    const m4 = new THREE.Matrix4(), v = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3();
    const fase = Array.from({ length: n }, (_, i) => (i % porCurva) / porCurva + ((i * 0.618) % 1) * 0.08);
    im.userData.mover = (t, vel = 0.25, activo = 1) => {
      for (let i = 0; i < n; i++) {
        const c = curvas[Math.floor(i / porCurva)], u = (((fase[i] + t * vel) % 1) + 1) % 1;
        c.getPointAt(u, v);
        const k = activo * Math.sin(u * Math.PI) * radio;
        s.setScalar(Math.max(1e-4, k)); m4.compose(v, q, s); im.setMatrixAt(i, m4);
      }
      im.instanceMatrix.needsUpdate = true;
    };
    return im;
  };

  /* Luces de una escena, registradas para el cambio de tema. */
  const escenasLuz = [];
  let claro = false;
  const luces = (scene, o = {}) => {
    scene.environment = envDe(claro);
    const key = new THREE.DirectionalLight(0xffffff, 1);
    key.position.set(...(o.key || [-5, 9, 6]));
    const rim = new THREE.DirectionalLight(0x9fb8ff, 1);
    rim.position.set(...(o.rim || [7, 4, -8]));
    scene.add(key, rim);
    if (T.sombras && o.sombra) {
      key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02; key.shadow.radius = 5;
      const c = key.shadow.camera, e = o.sombra; c.left = -e; c.right = e; c.top = e; c.bottom = -e; c.near = 1; c.far = 40;
    }
    const L = { scene, key, rim };
    escenasLuz.push(L); aplicarTema(L);
    return L;
  };
  function aplicarTema(L) {
    // Oscuro: pocas fuentes, contraste alto y un filo frío que dibuja el
    // canto de cada pieza. Claro: luz de estudio envolvente y cálida.
    L.scene.environment = envDe(claro);
    L.scene.environmentIntensity = claro ? 0.9 : 1.25;
    L.key.intensity = claro ? 1.1 : 1.15; L.key.color.set(claro ? 0xfff6ec : 0xffffff);
    L.rim.intensity = claro ? 0.3 : 1.1; L.rim.color.set(claro ? 0xdfe7ff : 0x8fb0ff);
  }
  const setTema = (c) => {
    claro = c; escenasLuz.forEach(aplicarTema);
    sombras.forEach((m) => { m.material.opacity = m.userData.op * (c ? 0.28 : 0.85); });
    M.grafito.color.set(c ? 0x24262b : 0x1c1e22);
  };
  const soltar = (L) => { const i = escenasLuz.indexOf(L); if (i >= 0) escenasLuz.splice(i, 1); };

  return { THREE, M, G, T, tex, sombra, icono, rotulo, pulsos, luces, soltar, setTema, get claro() { return claro; }, calidad, TAU };
}

/* ------------------------------------------------------------ MOTOR */
export function crearMotor(canvas, o = {}) {
  const calidad = detectar();
  const T = TIER[calidad];
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const t0 = performance.now();
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: calidad !== "baja", powerPreference: "high-performance", premultipliedAlpha: true });
  let dpr = Math.min(devicePixelRatio || 1, T.dpr);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = T.sombras;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setScissorTest(true);
  const K = crearKit(renderer, calidad);
  K.setTema(!!o.claro);

  const vistas = new Map(); // el → { mod, esc, visible, lista }
  const puntero = { x: 0, y: 0, sx: 0, sy: 0 };
  let raf = null, ultimo = 0, reloj = 0, frames = [], primerFrame = null;
  const info = { calidad, iniMs: 0, primerFotogramaMs: 0, escenasVivas: 0, llamadas: 0, triangulos: 0, dpr };

  function tam() { renderer.setSize(innerWidth, innerHeight, false); }
  tam();
  addEventListener("resize", () => { tam(); pedir(); });
  addEventListener("scroll", () => pedir(), { passive: true });
  addEventListener("pointermove", (e) => { puntero.x = (e.clientX / innerWidth) * 2 - 1; puntero.y = (e.clientY / innerHeight) * 2 - 1; if (!quieto) pedir(); }, { passive: true });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) pedir(); });

  /* Construcción perezosa: cerca de la pantalla se importa y se monta;
     lejos, se libera (geometría propia, luces y memoria de GPU). */
  const cerca = new IntersectionObserver((en) => en.forEach((e) => { const v = vistas.get(e.target); if (!v) return; if (e.isIntersecting) montar(e.target, v); }), { rootMargin: "70% 0px" });
  const lejos = new IntersectionObserver((en) => en.forEach((e) => { const v = vistas.get(e.target); if (v && !e.isIntersecting && v.esc) desmontar(e.target, v); }), { rootMargin: "300% 0px" });
  const visto = new IntersectionObserver((en) => en.forEach((e) => { const v = vistas.get(e.target); if (!v) return; v.visible = e.isIntersecting; if (v.visible) pedir(); }), { rootMargin: "0px" });

  async function montar(el, v) {
    if (v.esc || v.cargando) return;
    v.cargando = true;
    try {
      const mod = await import(`/assets/js/escenas/e-${v.nombre}.js${V}`);
      if (!vistas.has(el)) return;
      const esc = mod.default(K, { modo: el.getAttribute("data-modo") || "", el, quieto });
      encuadrar(esc.camera, Math.max(0.2, el.clientWidth / Math.max(1, el.clientHeight)));
      if (renderer.compileAsync) await renderer.compileAsync(esc.scene, esc.camera);
      if (!vistas.has(el)) return;
      v.t0 = reloj; v.esc = esc;
      el.classList.add("esc-viva");
      info.escenasVivas++;
      pedir();
    } catch (err) { console.error("[escenas] no se pudo montar", v.nombre, err); el.classList.add("esc-error"); }
    v.cargando = false;
  }
  function desmontar(el, v) {
    try { v.esc.dispose && v.esc.dispose(); } catch (e) { /* */ }
    v.esc.scene.traverse((o) => { if (o.geometry && !o.geometry.userData.compartida) o.geometry.dispose(); });
    if (v.esc.luces) K.soltar(v.esc.luces);
    v.esc = null; info.escenasVivas--; el.classList.remove("esc-viva");
  }

  /* En un hueco más estrecho que 5:4 se conserva el campo horizontal: la
     escena entera cabe (más pequeña) en vez de salirse por los lados. */
  function encuadrar(c, asp) {
    if (c.userData.fov0 == null) c.userData.fov0 = c.fov;
    const REF = c.userData.ref || 1.25, f0 = c.userData.fov0;
    c.aspect = asp;
    c.fov = asp >= REF ? f0 : 2 * Math.atan(Math.tan((f0 * Math.PI) / 360) * REF / asp) * 180 / Math.PI;
    c.updateProjectionMatrix();
  }

  function registrar(el) {
    if (vistas.has(el)) return;
    vistas.set(el, { nombre: el.getAttribute("data-escena"), esc: null, visible: false });
    cerca.observe(el); lejos.observe(el); visto.observe(el);
  }
  document.querySelectorAll("[data-escena]").forEach(registrar);

  function pedir() { if (raf == null && !document.hidden) raf = requestAnimationFrame(fotograma); }

  function fotograma(ahora) {
    raf = null;
    const dt = Math.min(0.05, (ahora - (ultimo || ahora)) / 1000); ultimo = ahora;
    if (!quieto) reloj += dt;
    puntero.sx += (puntero.x - puntero.sx) * (1 - Math.exp(-4 * dt)); puntero.sy += (puntero.y - puntero.sy) * (1 - Math.exp(-4 * dt));
    renderer.setScissor(0, 0, innerWidth, innerHeight); renderer.setViewport(0, 0, innerWidth, innerHeight); renderer.clear();
    const inf = renderer.info; inf.autoReset = false; inf.reset();
    let dibujadas = 0, animando = false;
    const H = innerHeight;
    for (const [el, v] of vistas) {
      if (!v.visible || !v.esc) continue;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > H || r.width < 2 || r.height < 2) continue;
      const c = v.esc.camera, asp = r.width / r.height;
      if (Math.abs(c.aspect - asp) > 1e-3) encuadrar(c, asp);
      const p = Math.max(0, Math.min(1, (H - r.top) / (H + r.height)));
      const sigue = v.esc.update(reloj - v.t0, dt, p, puntero, reloj);
      if (sigue !== false) animando = true;
      renderer.setViewport(r.left, H - r.bottom, r.width, r.height);
      renderer.setScissor(r.left, H - r.bottom, r.width, r.height);
      renderer.render(v.esc.scene, c);
      dibujadas++;
    }
    info.llamadas = inf.render.calls; info.triangulos = inf.render.triangles;
    if (dibujadas && primerFrame == null) { primerFrame = performance.now(); info.primerFotogramaMs = Math.round(primerFrame - t0); o.alPrimer && o.alPrimer(); }
    if (dibujadas && !quieto) {
      medir(dt);
      if (animando) pedir();
    }
  }

  /* Calidad en marcha: si 60 fotogramas seguidos van lentos, se baja la
     resolución por escalones; nunca se quita la escena. */
  function medir(dt) {
    frames.push(dt * 1000); if (frames.length < 60) return;
    frames.sort((a, b) => a - b); const med = frames[30]; frames = []; info.medianaMs = Math.round(med);
    if (med > 24 && dpr > 1) { dpr = Math.max(1, dpr - 0.3); renderer.setPixelRatio(dpr); tam(); info.dpr = dpr; }
    else if (med > 30 && renderer.shadowMap.enabled) { renderer.shadowMap.enabled = false; }
  }

  /* QA: adelanta el reloj de las escenas (capturas sin GPU real). */
  function avanzar(seg) {
    for (const [el, v] of vistas) { if (!v.esc) continue; const r = el.getBoundingClientRect(), H = innerHeight, p = Math.max(0, Math.min(1, (H - r.top) / (H + r.height)));
      for (let t = 0; t < seg; t += 1 / 30) { reloj += 1 / 30; v.esc.update(reloj - v.t0, 1 / 30, p, puntero, reloj); } }
    pedir();
  }
  info.iniMs = Math.round(performance.now() - t0);
  return {
    info, registrar, avanzar,
    setTema(c) { K.setTema(c); for (const v of vistas.values()) if (v.esc && v.esc.tema) v.esc.tema(c); pedir(); },
    pedir,
  };
}
