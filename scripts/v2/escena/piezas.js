/* ==========================================================================
   D-CODE · LAS PIEZAS, EN TIEMPO REAL (three.js, WebGL)
   --------------------------------------------------------------------------
   Sustituye a la secuencia de fotogramas de Blender. Por qué:
   - Fluidez: el scroll mueve geometría, no descarga imágenes. Nunca hay un
     fotograma que falte ni fundidos entre fotogramas lejanos.
   - Peso: ~10 piezas de pocos miles de triángulos y un entorno generado en
     el propio navegador (sin HDR que descargar). Todo el 3D pesa menos que
     cuatro fotogramas de la secuencia anterior.
   - Vida: las piezas flotan, responden al puntero y la luz del estudio se
     desliza por la cerámica. Un vídeo no puede hacer eso.
   Realismo: cerámica negra con barniz (MeshPhysicalMaterial + clearcoat),
   reflejos de cajas de luz de estudio (entorno PMREM propio), micro-relieve
   procedural, sombras de contacto suaves que dependen de la altura, AgX.
   Rendimiento: dibuja solo cuando algo cambia; se para fuera de pantalla;
   baja la resolución sola si el aparato no llega a ~50 fps.
   ========================================================================== */
import {
  WebGLRenderer, Scene, PerspectiveCamera, OrthographicCamera, Group, Mesh, Color, Vector3, Euler, Quaternion,
  MeshPhysicalMaterial, MeshBasicMaterial, MeshDepthMaterial, ShaderMaterial, PlaneGeometry, BoxGeometry,
  WebGLRenderTarget, PMREMGenerator, DataTexture, RepeatWrapping, RGBAFormat,
  LinearFilter, CanvasTexture, AgXToneMapping, BufferGeometry, Float32BufferAttribute, SRGBColorSpace, BackSide, DoubleSide, Vector2, MathUtils,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { HorizontalBlurShader } from "three/examples/jsm/shaders/HorizontalBlurShader.js";
import { VerticalBlurShader } from "three/examples/jsm/shaders/VerticalBlurShader.js";

const S = 0.01;        // 1 unidad del SVG del logotipo = 1 cm
const PROF = 0.13;     // grosor
const ALTURA = 0.34;   // el logotipo montado flota sobre el suelo
const suave = (t) => { t = Math.min(1, Math.max(0, t)); return t * t * t * (t * (t * 6 - 15) + 10); };

// Azar con semilla: la dispersión es siempre la misma (diseñada, no casual cada vez)
function azar(semilla) { let a = semilla >>> 0; return () => { a += 0x6d2b79f5; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/* ------------------------------------------------------------ geometría
   El logotipo (viewBox 120×100, y hacia abajo), igual que el SVG de la web. */
const arco = (cx, cy, r, a0, a1, n = 28) => Array.from({ length: n + 1 }, (_, i) => [cx + r * Math.cos(a0 + ((a1 - a0) * i) / n), cy + r * Math.sin(a0 + ((a1 - a0) * i) / n)]);
const CUBOS = [["p1", 26, 1, 16], ["p2", 1, 27, 13], ["p3", 35, 26, 13], ["p4", 2, 64, 12], ["p5", 35, 64, 13], ["p6", 26, 83, 16], ["p7", 102, 43, 16], ["ia", 16, 45, 15]];
const ARCOS = [
  ["arco_sup", [[48, 1], [86, 1], ...arco(86, 33, 32, -Math.PI / 2, 0).slice(1), [118, 38], [102, 38], ...arco(86, 33, 16, 0, -Math.PI / 2).slice(0, -1), [86, 17], [48, 17]]],
  ["arco_inf", [[48, 99], [86, 99], ...arco(86, 67, 32, Math.PI / 2, 0).slice(1), [118, 63], [102, 63], ...arco(86, 67, 16, 0, Math.PI / 2).slice(0, -1), [86, 83], [48, 83]]],
];

/* Los dos arcos se construyen como un BARRIDO: un perfil rectangular de cantos redondeados
   recorre el eje de la pieza (recta → cuarto de círculo → recta). Normales exactas en cada
   punto (nada de facetas ni rayas) y extremos redondeados con el mismo radio que los cubos. */
function barrido(eje, ancho, fondo, rc) {
  // perfil: rectángulo redondeado en (u = radial en el plano, v = profundidad)
  const pr = [], hu = ancho / 2, hv = fondo / 2, SEG = 6;
  for (const [cx, cy, a0] of [[hu - rc, hv - rc, 0], [-hu + rc, hv - rc, Math.PI / 2], [-hu + rc, -hv + rc, Math.PI], [hu - rc, -hv + rc, Math.PI * 1.5]])
    for (let i = 0; i <= SEG; i++) { const a = a0 + (i / SEG) * (Math.PI / 2); pr.push([cx + rc * Math.cos(a), cy + rc * Math.sin(a), Math.cos(a), Math.sin(a)]); }
  const np = pr.length;
  // coordenada de textura a lo largo del perfil, en metros (el micro-relieve no se estira)
  const per = [0]; for (let k = 1; k < np; k++) per.push(per[k - 1] + Math.hypot(pr[k][0] - pr[k - 1][0], pr[k][1] - pr[k - 1][1]));
  // eje con tangentes y longitud acumulada
  const P = eje.map(([x, y]) => new Vector3(x, y, 0)); let L = [0];
  for (let i = 1; i < P.length; i++) L.push(L[i - 1] + P[i].distanceTo(P[i - 1]));
  const T = P.map((p, i) => new Vector3().subVectors(P[Math.min(i + 1, P.length - 1)], P[Math.max(i - 1, 0)]).normalize());
  const pos = [], nor = [], uv = [], idx = [];
  const anillo = (c, t, ins, nT, nP, s) => { // centro, tangente, encogido, peso normal tangente / perfil, coordenada
    const N = new Vector3(-t.y, t.x, 0), B = new Vector3(0, 0, 1);
    pr.forEach(([u, v, nu, nv], k) => {
      const o = new Vector3().addScaledVector(N, u - nu * ins).addScaledVector(B, v - nv * ins).add(c);
      const n = new Vector3().addScaledVector(N, nu * nP).addScaledVector(B, nv * nP).addScaledVector(t, nT).normalize();
      pos.push(o.x, o.y, o.z); nor.push(n.x, n.y, n.z); uv.push(s / 0.3, per[k] / 0.3);
    });
  };
  const RE = 5; let filas = 0;
  const extremo = (i, dir) => { // dir = -1 principio, +1 final
    for (let k = RE; k >= 1; k--) { const th = (k / RE) * (Math.PI / 2); const t = T[i].clone().multiplyScalar(dir);
      anillo(P[i].clone().addScaledVector(t, rc * Math.sin(th)), T[i], rc * (1 - Math.cos(th)), Math.sin(th) * dir, Math.cos(th), L[i] + dir * rc * Math.sin(th)); filas++; }
  };
  // principio redondeado (de la punta al cuerpo) → cuerpo → final redondeado
  extremo(0, -1);
  for (let i = 0; i < P.length; i++) { anillo(P[i], T[i], 0, 0, 1, L[i]); filas++; }
  const fin = P.length - 1; for (let k = 1; k <= RE; k++) { const th = (k / RE) * (Math.PI / 2);
    anillo(P[fin].clone().addScaledVector(T[fin], rc * Math.sin(th)), T[fin], rc * (1 - Math.cos(th)), Math.sin(th), Math.cos(th), L[fin] + rc * Math.sin(th)); filas++; }
  for (let f = 0; f < filas - 1; f++) for (let k = 0; k < np; k++) { const a = f * np + k, b = f * np + ((k + 1) % np), c = a + np, d = b + np; idx.push(a, b, c, b, d, c); }
  // tapas planas en las puntas (lo que queda del perfil tras encogerlo)
  const tapa = (fila, dir) => { const c = pos.length / 3; const base = fila * np; let cx = 0, cy = 0, cz = 0;
    for (let k = 0; k < np; k++) { cx += pos[(base + k) * 3]; cy += pos[(base + k) * 3 + 1]; cz += pos[(base + k) * 3 + 2]; }
    const t = (dir < 0 ? T[0] : T[fin]).clone().multiplyScalar(dir); pos.push(cx / np, cy / np, cz / np); nor.push(t.x, t.y, t.z); uv.push(0, 0);
    for (let k = 0; k < np; k++) dir < 0 ? idx.push(c, base + ((k + 1) % np), base + k) : idx.push(c, base + k, base + ((k + 1) % np)); };
  tapa(0, -1); tapa(filas - 1, 1);
  const g = new BufferGeometry(); g.setAttribute("position", new Float32BufferAttribute(pos, 3)); g.setAttribute("normal", new Float32BufferAttribute(nor, 3)); g.setAttribute("uv", new Float32BufferAttribute(uv, 2)); g.setIndex(idx);
  return g;
}
// Eje de cada arco en coordenadas del SVG (y hacia abajo): tramo recto, cuarto de círculo de
// radio 24 y tramo corto. Las puntas se quedan 2 unidades cortas: el redondeo (rc = 2 cm) las completa.
const EJES = {
  arco_sup: { eje: [...Array.from({ length: 9 }, (_, i) => [50 + (36 * i) / 8, 9]), ...arco(86, 33, 24, -Math.PI / 2, 0, 32).slice(1), [110, 36]], c: [83, 19.5] },
  arco_inf: { eje: [...Array.from({ length: 9 }, (_, i) => [50 + (36 * i) / 8, 91]), ...arco(86, 67, 24, Math.PI / 2, 0, 32).slice(1), [110, 64]], c: [83, 81] },
};
function piezaArco(n) {
  const { eje, c: [cx, cy] } = EJES[n];
  return { geo: barrido(eje.map(([x, y]) => [(x - cx) * S, -(y - cy) * S]), 16 * S, PROF, 0.02), cx, cy };
}

/* --------------------------------------------------- entorno de estudio
   Una caja oscura con cajas de luz: son los reflejos que hacen que la
   cerámica negra parezca un objeto real fotografiado. */
function estudio() {
  const s = new Scene();
  s.add(new Mesh(new BoxGeometry(14, 14, 14), new MeshBasicMaterial({ color: new Color(0.012, 0.012, 0.014), side: BackSide })));
  const caja = (w, h, x, y, z, fuerza) => { const m = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: new Color().setScalar(fuerza), side: DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0.8, 0); s.add(m); };
  caja(4.2, 2.6, -3.6, 4.2, 2.4, 7);    // ventana grande arriba a la izquierda
  caja(2.8, 2.8, 0.4, 5.6, -0.6, 2.4);  // techo
  caja(0.55, 4.6, 4.2, 1.9, -2.8, 9);   // filo por detrás a la derecha
  caja(0.5, 4.2, -4.4, 1.6, -2.6, 5);   // filo por detrás a la izquierda
  caja(7, 0.5, 0.2, -0.3, 5, 1.1);      // rebote frontal bajo
  caja(1.2, 1.2, 3.6, 3.2, 3.4, 2.2);   // brillo pequeño a la derecha
  return s;
}

// Micro-relieve: la cerámica no es un espejo perfecto. Ruido suave → mapa de normales.
function microRelieve(n = 128) {
  const r = azar(11), alt = new Float32Array(n * n);
  for (let o = 0; o < 3; o++) { const paso = 2 ** (4 - o), amp = 1 / (o + 1), rej = []; for (let i = 0; i < (n / paso + 2) ** 2; i++) rej.push(r());
    const m = n / paso + 2; for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const gx = x / paso, gy = y / paso, x0 = gx | 0, y0 = gy | 0, fx = gx - x0, fy = gy - y0; const v = (i, j) => rej[((y0 + j) % (m - 1)) * m + ((x0 + i) % (m - 1))]; const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy); alt[y * n + x] += amp * MathUtils.lerp(MathUtils.lerp(v(0, 0), v(1, 0), sx), MathUtils.lerp(v(0, 1), v(1, 1), sx), sy); } }
  const d = new Uint8Array(n * n * 4);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const h = (i, j) => alt[((y + j + n) % n) * n + ((x + i + n) % n)]; const nx = (h(-1, 0) - h(1, 0)) * 2, ny = (h(0, -1) - h(0, 1)) * 2, v = new Vector3(nx, ny, 1).normalize(); const k = (y * n + x) * 4; d[k] = (v.x * 0.5 + 0.5) * 255; d[k + 1] = (v.y * 0.5 + 0.5) * 255; d[k + 2] = (v.z * 0.5 + 0.5) * 255; d[k + 3] = 255; }
  const t = new DataTexture(d, n, n, RGBAFormat); t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(3, 3); t.magFilter = t.minFilter = LinearFilter; t.needsUpdate = true; return t;
}

/* ---------------------------------------------------- sombra de contacto
   Una cámara mira las piezas desde el suelo hacia arriba; su silueta (más
   oscura cuanto más cerca del suelo) se difumina dos veces y se pinta en un
   plano. Mismo principio que las sombras de las fotos de producto. */
function sombraContacto(renderer, escena, res) {
  const W = 4.4, H = 3.2, ALTO = 1.9;
  const rt = new WebGLRenderTarget(res, res), rtB = new WebGLRenderTarget(res, res); rt.texture.generateMipmaps = rtB.texture.generateMipmaps = false;
  const plano = new Mesh(new PlaneGeometry(W, H).rotateX(Math.PI / 2), new MeshBasicMaterial({ map: rt.texture, transparent: true, depthWrite: false, opacity: 1, color: 0x000000 }));
  plano.material.onBeforeCompile = (sh) => { sh.fragmentShader = sh.fragmentShader.replace("#include <map_fragment>", "vec4 sm = texture2D( map, vMapUv ); diffuseColor = vec4( vec3(0.0), sm.a * opacity );"); };
  plano.renderOrder = 1; plano.scale.y = -1; plano.position.y = 0.001;
  const borrosa = new Mesh(new PlaneGeometry(W, H).rotateX(Math.PI / 2)); borrosa.visible = false;
  const grupo = new Group(); grupo.add(plano, borrosa); escena.add(grupo);
  const cam = new OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 0, ALTO); cam.rotation.x = Math.PI / 2; grupo.add(cam);
  const prof = new MeshDepthMaterial(); prof.userData.oscuro = { value: 1.25 };
  prof.onBeforeCompile = (sh) => { sh.uniforms.oscuro = prof.userData.oscuro; sh.fragmentShader = "uniform float oscuro;\n" + sh.fragmentShader.replace("gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );", "float c = 1.0 - fragCoordZ; gl_FragColor = vec4( vec3( 0.0 ), c * c * oscuro );"); };
  prof.depthTest = prof.depthWrite = false;
  const hB = new ShaderMaterial(HorizontalBlurShader), vB = new ShaderMaterial(VerticalBlurShader); hB.depthTest = vB.depthTest = false;
  const difuminar = (cant) => {
    borrosa.visible = true;
    borrosa.material = hB; hB.uniforms.tDiffuse.value = rt.texture; hB.uniforms.h.value = cant / 256; renderer.setRenderTarget(rtB); renderer.render(borrosa, cam);
    borrosa.material = vB; vB.uniforms.tDiffuse.value = rtB.texture; vB.uniforms.v.value = cant / 256; renderer.setRenderTarget(rt); renderer.render(borrosa, cam);
    borrosa.visible = false;
  };
  return {
    plano,
    set opacidad(o) { plano.material.opacity = o; },
    pintar() {
      const fondo = escena.background, env = escena.environment; escena.background = null; escena.environment = null;
      plano.visible = false; const ocultos = []; escena.traverse((o) => { if (o.userData.sinSombra && o.visible) { o.visible = false; ocultos.push(o); } }); escena.overrideMaterial = prof;
      const alfa = renderer.getClearAlpha(); renderer.setClearAlpha(0);
      renderer.setRenderTarget(rt); renderer.clear(); renderer.render(escena, cam);
      escena.overrideMaterial = null; plano.visible = true; ocultos.forEach((o) => (o.visible = true));
      difuminar(2.2); difuminar(0.9);
      renderer.setRenderTarget(null); renderer.setClearAlpha(alfa);
      escena.background = fondo; escena.environment = env;
    },
  };
}

/* ================================================================ montar */
export function montar(lienzo, { movil = false, claro = false } = {}) {
  const renderer = new WebGLRenderer({ canvas: lienzo, alpha: true, antialias: (devicePixelRatio || 1) < 2, powerPreference: "high-performance", premultipliedAlpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = AgXToneMapping; renderer.outputColorSpace = SRGBColorSpace;
  const escena = new Scene();
  const pm = new PMREMGenerator(renderer); escena.environment = pm.fromScene(estudio(), 0.03).texture; pm.dispose();

  const cam = new PerspectiveCamera(30, 1, 0.1, 40);
  const relieve = microRelieve();
  const ceramica = new MeshPhysicalMaterial({ color: 0x0c0c0e, roughness: 0.3, metalness: 0, clearcoat: 0.65, clearcoatRoughness: 0.09, normalMap: relieve, normalScale: new Vector2(0.035, 0.035), envMapIntensity: 1.05 });
  const azul = new MeshPhysicalMaterial({ color: 0x1d4fe8, roughness: 0.2, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04, emissive: 0x2f64ff, emissiveIntensity: 0, envMapIntensity: 1.1 });

  // piezas
  const r = azar(7), logo = new Group(); escena.add(logo);
  const piezas = [];
  const alta = (cx, cy) => new Vector3((cx - 60) * S, (100 - cy) * S + ALTURA, 0);
  for (const [n, x, y, l] of CUBOS) {
    const g = new RoundedBoxGeometry(l * S, l * S, PROF, 4, 0.022);
    piezas.push({ n, m: new Mesh(g, n === "ia" ? azul : ceramica), fin: alta(x + l / 2, y + l / 2) });
  }
  for (const [n] of ARCOS) { const { geo, cx, cy } = piezaArco(n); piezas.push({ n, m: new Mesh(geo, ceramica), fin: alta(cx, cy) }); }
  // Dispersión: sueltas por el aire, delante y detrás, cada una a su aire (con semilla).
  const SUELTAS = { p1: [-0.62, 1.12, 0.35], p2: [-0.92, 0.56, -0.25], p3: [-0.35, 0.34, 0.5], p4: [-0.78, 0.18, -0.55], p5: [0.02, 0.2, 0.2], p6: [0.34, 0.12, 0.62], p7: [0.84, 0.46, -0.1], ia: [0.62, 0.92, 0.42], arco_sup: [0.28, 1.2, -0.45], arco_inf: [-0.08, 0.66, -0.7] };
  for (const p of piezas) {
    const [x, y, z] = SUELTAS[p.n];
    p.ini = new Vector3(x * 0.84 + 0.06, y, z);
    p.rot0 = new Euler((r() - 0.5) * 2.4, (r() - 0.5) * 4.2, (r() - 0.5) * 2.4);
    p.q0 = new Quaternion().setFromEuler(p.rot0);
    p.retraso = p.n === "ia" ? 0.2 : r() * 0.2;
    p.fase = r() * Math.PI * 2;
    logo.add(p.m);
  }

  // Modo oscuro: un charco de luz de foco en el suelo (degradado radial), donde se posa la sombra.
  const cv = document.createElement("canvas"); cv.width = cv.height = 256; const cx2 = cv.getContext("2d");
  const gr = cx2.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.45, "rgba(255,255,255,.35)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  cx2.fillStyle = gr; cx2.fillRect(0, 0, 256, 256);
  const tl = new CanvasTexture(cv); tl.colorSpace = SRGBColorSpace;
  const charco = new Mesh(new PlaneGeometry(4.2, 2.6).rotateX(-Math.PI / 2), new MeshBasicMaterial({ map: tl, transparent: true, depthWrite: false, opacity: claro ? 0 : 0.13, toneMapped: false }));
  charco.position.set(0.1, 0, 0.1); charco.renderOrder = 0; charco.userData.sinSombra = true; escena.add(charco);
  const sombra = sombraContacto(renderer, escena, movil ? 256 : 512);
  sombra.opacidad = claro ? 0.92 : 0.85;

  /* -------------------------------------------- encuadre y estado */
  let zoomBase = 1, W = 1, H = 1, dpr = Math.min(devicePixelRatio || 1, movil ? 1.75 : 2);
  const medir = () => {
    const b = lienzo.getBoundingClientRect(); W = Math.max(1, b.width); H = Math.max(1, b.height);
    renderer.setPixelRatio(dpr); renderer.setSize(W, H, false);
    cam.aspect = W / H;
    // Tamaño del logotipo: en ancho, a la derecha y grande; en móvil, arriba.
    const ancho = W >= 1100 && W / H > 1; // lado a lado solo si caben texto y logotipo; si no, apilado
    // «lado» = alto en píxeles del logotipo montado. A distancia ~3 y 30° de campo, el
    // logotipo (1 m) ocupa ~0,55 del alto con zoom 1.
    const lado = ancho ? Math.min(H * 0.52, W * 0.34) : Math.min(W * 0.5, H * (W > H ? 0.36 : 0.28)); // el logotipo es 1,2 veces más ancho que alto
    zoomBase = lado / H / 0.55;
    // Desplazamiento del centro óptico (no se mueve la cámara, se mueve el encuadre)
    if (ancho) cam.setViewOffset(W, H, -W * 0.2, 0, W, H); else cam.setViewOffset(W, H, W * 0.05, H * 0.2, W, H);
    cam.updateProjectionMatrix(); pedir();
  };

  let objetivo = 0, u = 0, vel = 0, puntero = new Vector2(), punteroS = new Vector2(), visible = true, raf = 0, ultimo = performance.now();
  const q = new Quaternion(), qI = new Quaternion();
  let medias = [], calidad = 0;

  const colocar = (t) => {
    const g = Math.min(1, u / 0.94);
    for (const p of piezas) {
      const k = suave((g - 0.16 - p.retraso) / 0.44);
      const flota = (1 - k) * 0.035 * Math.sin(t * 0.0009 + p.fase);
      p.m.position.lerpVectors(p.ini, p.fin, k); p.m.position.y += flota;
      // giro lento mientras están sueltas: nunca del todo quietas
      q.copy(p.q0); if (k < 1) { const e = new Euler(Math.sin(t * 0.0003 + p.fase) * 0.12 * (1 - k), Math.cos(t * 0.00025 + p.fase) * 0.16 * (1 - k), 0); q.multiply(qI.setFromEuler(e)); }
      p.m.quaternion.slerpQuaternions(q, qI.identity(), k);
    }
    azul.emissiveIntensity = 0.38 * suave((g - 0.8) / 0.14);
    // cámara: se acerca y rodea al unirse
    const c = suave(g);
    cam.position.set(-0.2 + 1.2 * c + punteroS.x * 0.12, 1.05 - 0.06 * c - punteroS.y * 0.08, 3.4 - 0.45 * c);
    cam.lookAt(0, 0.84, 0);
    const z = zoomBase * (movil ? 0.86 + 0.14 * c : 0.9 + 0.1 * c); if (Math.abs(cam.zoom - z) > 1e-4) { cam.zoom = z; cam.updateProjectionMatrix(); }
    // la luz del estudio se desliza por la cerámica con el scroll y el puntero
    escena.environmentRotation.y = -0.5 + 0.9 * c + punteroS.x * 0.35;
    logo.rotation.y = punteroS.x * 0.1 * c; logo.rotation.x = -punteroS.y * 0.05 * c;
    return g < 0.8; // sueltas → siguen flotando
  };

  const bucle = (t) => {
    raf = 0; if (!visible) return;
    const dt = Math.min(0.05, (t - ultimo) / 1000); ultimo = t;
    const k = 90, c = 2 * Math.sqrt(k); vel += ((objetivo - u) * k - vel * c) * dt; u += vel * dt;
    if (Math.abs(objetivo - u) < 0.0003 && Math.abs(vel) < 0.001) { u = objetivo; vel = 0; }
    punteroS.lerp(puntero, 1 - Math.exp(-dt * 5));
    const flotando = colocar(t);
    sombra.pintar(); renderer.render(escena, cam);
    // calidad adaptativa: si el aparato no llega a ~50 fps, baja la resolución
    if (dt > 0) { medias.push(dt); if (medias.length === 40) { const m = medias.reduce((a, b) => a + b) / 40; medias = []; if (m > 0.021 && dpr > 1) { dpr = Math.max(1, dpr - 0.25); calidad++; medir(); } } }
    const mueve = u !== objetivo || punteroS.distanceTo(puntero) > 0.0005;
    if (mueve || flotando) pedir();
  };
  function pedir() { if (!raf && visible) raf = requestAnimationFrame(bucle); }

  new ResizeObserver(medir).observe(lienzo);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { ultimo = performance.now(); pedir(); } }); io.observe(lienzo);
  document.addEventListener("visibilitychange", () => { visible = !document.hidden; if (visible) { ultimo = performance.now(); pedir(); } });
  if (!movil) addEventListener("pointermove", (e) => { puntero.set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1); pedir(); }, { passive: true });
  medir();

  return {
    progreso(p, inmediato) { objetivo = p; if (inmediato) { u = p; vel = 0; } pedir(); },
    tema(esClaro) { sombra.opacidad = esClaro ? 0.92 : 0.85; charco.material.opacity = esClaro ? 0 : 0.13; ceramica.envMapIntensity = esClaro ? 1.05 : 1.55; azul.envMapIntensity = esClaro ? 1.1 : 1.4; renderer.toneMappingExposure = esClaro ? 1 : 1.12; pedir(); },
    get calidad() { return { dpr, bajadas: calidad }; },
    pintarYa() { ultimo = performance.now(); colocar(ultimo); sombra.pintar(); renderer.render(escena, cam); },
  };
}
