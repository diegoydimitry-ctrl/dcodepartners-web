/* ==========================================================================
   THE D-CODE SYSTEM — motor WebGL reutilizable
   ==========================================================================
   Una sola escena, dos usos: el Hero (arranca en caos, se detiene a medio
   camino) y la sección "Cómo trabajamos" (retoma desde ahí y llega a
   sistema estable). Nunca son dos escenas: es la MISMA estructura de nodos,
   con setProgress(p) recorriendo 0..1. Por eso vive en un solo módulo y se
   monta más de una vez con distintos rangos de scroll — no se duplica
   código 3D entre secciones (DIR-CINE-01, sección 26 del encargo).

   QUÉ REPRESENTA, Y POR QUÉ ES ESTO Y NO OTRA COSA.
   Seis capas — Personas, Procesos, Datos, Herramientas, IA,
   Automatizaciones — son las seis capas reales que D-Code describe en su
   propio material (no una metáfora decorativa inventada aquí). En caos,
   los nodos de las seis capas están mezclados y dispersos: no hay grieta
   que sea "el problema", hay ruido. En progreso 1, cada nodo ha encontrado
   su capa (ordenadas en profundidad, Personas más cerca de cámara,
   Automatizaciones más lejos) y las líneas conectan cada nodo con su
   vecino más próximo DENTRO de su capa y con un nodo de la capa
   adyacente: así se lee "cada capa se organiza, y las capas se hablan
   entre sí", que es literalmente la frase que el sitio ya usa en /conocenos
   y en el propio pie de esta página.

   Colores: los mismos ocho tonos de --k-* que ya usan las páginas de
   Departamentos (dcp4.css/dcp5.css) — cero paleta nueva.
========================================================================== */

let THREE = null;
let cargaTHREE = null; // promesa compartida: dos montajes a la vez no deben
                        // disparar dos peticiones de red del mismo módulo.

const CAPAS = [
  { nombre: "Personas",         color: 0x35e0a1 }, // --k-clientes
  { nombre: "Procesos",         color: 0xffb43a }, // --k-produccion
  { nombre: "Datos",            color: 0x5b8cff }, // --k-finanzas
  { nombre: "Herramientas",     color: 0x8b93ff }, // --k-administracion
  { nombre: "IA",               color: 0xa78bfa }, // --k-direccion
  { nombre: "Automatizaciones", color: 0x4dd0e1 }, // --k-comercial
];

function pistaMovil() {
  return window.matchMedia("(max-width: 760px)").matches;
}

function prefiereQuietud() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Textura de partícula: un círculo suave generado en canvas, no un PNG
 *  cargado — cero peticiones de red adicionales (regla del encargo,
 *  sección 33: "genera assets propios"). */
function texturaParticula() {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,.85)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

/** Aleatoriedad estable por índice — mismo caos en cada carga, para que
 *  Hero y Sistema (dos instancias) generen exactamente la misma nube. */
/**
 * Hash entero (variante de MurmurHash3), no `fract(sin(x)*A)`.
 *
 * El hash trigonométrico clásico de shader (`sin(i*12.9898+salt*78.233)
 * *43758.5453`) es el que se ve en cualquier tutorial de GLSL, pero para
 * un ÍNDICE SECUENCIAL (0,1,2,3…) no decorrela bien entre "canales" (sus
 * llamadas con salt=1 y salt=2, usadas aquí como X e Y, quedan
 * correlacionadas) y el resultado, en vez de disperso, cae en una
 * retícula regular — que es exactamente lo que apareció al comprobarlo
 * con capturas reales: no ruido, un tejido de puntos en rejilla.
 * Encontrado, no supuesto: mirando el zoom del render.
 */
function ruido(i, salt) {
  let h = (Math.imul(i ^ salt, 0x27d4eb2d) ^ (i + salt * 0x9e3779b9)) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0;
  h = (h ^ (h >>> 16)) >>> 0;
  return h / 4294967295;
}

function construirNodos(n) {
  const capaDe = new Int32Array(n);
  const posCaos = new Float32Array(n * 3);
  const posSistema = new Float32Array(n * 3);
  const color = new Float32Array(n * 3);
  const fase = new Float32Array(n); // desfase de asentamiento, para que no se muevan en bloque
  const three = THREE;
  const colorObj = new three.Color();

  const porCapa = Math.floor(n / CAPAS.length);
  for (let i = 0; i < n; i++) {
    const capaIdx = Math.min(CAPAS.length - 1, Math.floor(i / porCapa));
    capaDe[i] = capaIdx;

    // Caos: esfera dispersa grande, sin orden de capa.
    const r = 5.5 + ruido(i, 1) * 3.2;
    const th = ruido(i, 2) * Math.PI * 2;
    const ph = Math.acos(2 * ruido(i, 3) - 1);
    posCaos[i * 3 + 0] = r * Math.sin(ph) * Math.cos(th);
    posCaos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    posCaos[i * 3 + 2] = r * Math.cos(ph) * 0.6;

    // Sistema: anillo por capa, apilado en Z — la "pila" de capas del
    // encargo (sección 7), literalmente construida en profundidad.
    //
    // El ángulo NO puede depender del índice dentro de la capa (`i -
    // capaIdx*porCapa`, un paso constante tipo 0, 0.31, 0.62…): con un paso
    // regular, dos capas contiguas colocan sus nodos casi en el mismo
    // ángulo, y "conectar cada nodo con su vecino más próximo en la capa de
    // al lado" (construirConexiones) dibuja entonces cientos de líneas
    // CASI PARALELAS igual de espaciadas — una tela de rayas verticales,
    // no una red. Visto y corregido: el ángulo es ruido puro, sin término
    // periódico.
    const anillo = ruido(i, 4) * Math.PI * 2;
    const radioCapa = 1.5 + ruido(i, 5) * 1.7;
    posSistema[i * 3 + 0] = radioCapa * Math.cos(anillo);
    posSistema[i * 3 + 1] = radioCapa * Math.sin(anillo) * 0.62;
    posSistema[i * 3 + 2] = (capaIdx - (CAPAS.length - 1) / 2) * 1.35;

    fase[i] = ruido(i, 6);

    colorObj.setHex(CAPAS[capaIdx].color);
    color[i * 3 + 0] = colorObj.r;
    color[i * 3 + 1] = colorObj.g;
    color[i * 3 + 2] = colorObj.b;
  }
  return { capaDe, posCaos, posSistema, color, fase };
}

/** Conexiones: vecino más próximo en SISTEMA dentro de la misma capa (1),
 *  más un enlace a la capa contigua (1) — no se calcula en caos, no tiene
 *  sentido ahí. Tope de conexiones para no reventar el presupuesto de
 *  líneas en móvil. */
function construirConexiones(nodos, n, tope) {
  const pares = [];
  const step = n > tope * 2 ? Math.ceil(n / tope) : 1;
  for (let i = 0; i < n; i += step) {
    const capaI = nodos.capaDe[i];
    let mejor = -1, mejorD = Infinity;
    let mejorAdj = -1, mejorAdjD = Infinity;
    for (let j = 0; j < n; j += step) {
      if (j === i) continue;
      const dx = nodos.posSistema[i * 3] - nodos.posSistema[j * 3];
      const dy = nodos.posSistema[i * 3 + 1] - nodos.posSistema[j * 3 + 1];
      const dz = nodos.posSistema[i * 3 + 2] - nodos.posSistema[j * 3 + 2];
      const d = dx * dx + dy * dy + dz * dz;
      // Tope de distancia: "el más próximo" sigue siendo el más próximo
      // aunque esté lejos, y una línea larga cruzando media escena no lee
      // como conexión, lee como ruido. Si nada cae dentro del radio, ese
      // nodo sencillamente no conecta esta vez — no todo tiene que estar
      // unido a la fuerza.
      if (d > 2.6) continue;
      const capaJ = nodos.capaDe[j];
      if (capaJ === capaI) {
        if (d < mejorD) { mejorD = d; mejor = j; }
      } else if (Math.abs(capaJ - capaI) === 1) {
        if (d < mejorAdjD) { mejorAdjD = d; mejorAdj = j; }
      }
    }
    if (mejor >= 0) pares.push([i, mejor]);
    if (mejorAdj >= 0) pares.push([i, mejorAdj]);
    if (pares.length >= tope) break;
  }
  return pares;
}

class EscenaSistema {
  constructor(canvas) {
    const three = THREE;
    this.movil = pistaMovil();
    this.quieto = prefiereQuietud();
    this.n = this.movil ? 900 : 2700;
    this.topeLineas = this.movil ? 260 : 900;

    this.renderer = new three.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.movil ? 1.3 : 1.75));
    this.renderer.setClearColor(0x000000, 0);

    this.scene = new three.Scene();
    this.camera = new three.PerspectiveCamera(42, 1, 0.1, 100);
    this.camera.position.set(0, 0, 11);

    const nodos = construirNodos(this.n);
    this.nodos = nodos;

    const geo = new three.BufferGeometry();
    this.posActual = new Float32Array(nodos.posCaos);
    geo.setAttribute("position", new three.BufferAttribute(this.posActual, 3));
    geo.setAttribute("color", new three.BufferAttribute(nodos.color, 3));
    const mat = new three.PointsMaterial({
      size: this.movil ? 0.075 : 0.062,
      map: texturaParticula(),
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      blending: three.AdditiveBlending,
      sizeAttenuation: true,
    });
    this.puntos = new three.Points(geo, mat);
    this.scene.add(this.puntos);

    const pares = construirConexiones(nodos, this.n, this.topeLineas);
    this.pares = pares;
    const lineGeo = new three.BufferGeometry();
    this.posLineas = new Float32Array(pares.length * 2 * 3);
    lineGeo.setAttribute("position", new three.BufferAttribute(this.posLineas, 3));
    lineGeo.setDrawRange(0, 0);
    const lineMat = new three.LineBasicMaterial({
      color: 0x8ea0c4, transparent: true, opacity: 0.16, depthWrite: false,
      blending: three.AdditiveBlending,
    });
    this.lineas = new three.LineSegments(lineGeo, lineMat);
    this.scene.add(this.lineas);

    // Orden de revelado de líneas: barajado estable (mismo fase[] de los
    // nodos), para que no aparezcan en el mismo orden en que se calcularon.
    this.ordenLineas = pares.map((_, i) => i)
      .sort((a, b) => nodos.fase[pares[a][0]] - nodos.fase[pares[b][0]]);

    this.progreso = 0;
    this.rafId = null;
    this.visible = true;
    this._resize();
  }

  _resize() {
    const c = this.renderer.domElement;
    const w = c.clientWidth || c.parentElement.clientWidth;
    const h = c.clientHeight || c.parentElement.clientHeight;
    if (w === 0 || h === 0) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  setProgress(p) {
    this.progreso = Math.max(0, Math.min(1, p));
    if (this.quieto) this._pintarEstatico();
  }

  _pintarEstatico() {
    this._actualizarPosiciones(0);
    this._resize();
    this.renderer.render(this.scene, this.camera);
  }

  _actualizarPosiciones(tiempoS) {
    const { posCaos, posSistema, fase, capaDe } = this.nodos;
    const p = this.progreso;
    for (let i = 0; i < this.n; i++) {
      // Cada nodo empieza a moverse en un punto distinto del recorrido de
      // scroll (fase[i]) y con una curva ease — no se mueven en bloque.
      const local = Math.max(0, Math.min(1, (p - fase[i] * 0.35) / (1 - fase[i] * 0.35)));
      const eased = local * local * (3 - 2 * local);
      const cx = posCaos[i * 3], cy = posCaos[i * 3 + 1], cz = posCaos[i * 3 + 2];
      const sx = posSistema[i * 3], sy = posSistema[i * 3 + 1], sz = posSistema[i * 3 + 2];
      let x = cx + (sx - cx) * eased;
      let y = cy + (sy - cy) * eased;
      let z = cz + (sz - cz) * eased;
      if (!this.quieto && tiempoS != null) {
        // Respiración muy leve, solo cuando el movimiento está permitido.
        const capa = capaDe[i];
        x += Math.sin(tiempoS * 0.18 + i) * 0.02 * (1 - eased * 0.7);
        y += Math.cos(tiempoS * 0.15 + i * 1.3) * 0.02 * (1 - eased * 0.7);
        void capa;
      }
      this.posActual[i * 3] = x;
      this.posActual[i * 3 + 1] = y;
      this.posActual[i * 3 + 2] = z;
    }
    this.puntos.geometry.attributes.position.needsUpdate = true;

    // Líneas: solo entran en juego a partir de un progreso alto (la
    // estructura ya casi asentada) y se revelan en cascada, no de golpe.
    const p2 = Math.max(0, (p - 0.55) / 0.45);
    const visibles = Math.floor(p2 * this.pares.length);
    for (let k = 0; k < visibles; k++) {
      const idx = this.ordenLineas[k];
      const [a, b] = this.pares[idx];
      this.posLineas[k * 6 + 0] = this.posActual[a * 3];
      this.posLineas[k * 6 + 1] = this.posActual[a * 3 + 1];
      this.posLineas[k * 6 + 2] = this.posActual[a * 3 + 2];
      this.posLineas[k * 6 + 3] = this.posActual[b * 3];
      this.posLineas[k * 6 + 4] = this.posActual[b * 3 + 1];
      this.posLineas[k * 6 + 5] = this.posActual[b * 3 + 2];
    }
    this.lineas.geometry.setDrawRange(0, visibles * 2);
    this.lineas.geometry.attributes.position.needsUpdate = true;
    this.lineas.material.opacity = 0.16 * p2;

    this.camera.position.z = 11 - eased_z(p) * 3.4;
    this.scene.rotation.y = (p) * 0.55;
  }

  _tick(t) {
    if (!this.visible || this.quieto) return;
    this._actualizarPosiciones(t / 1000);
    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame((tt) => this._tick(tt));
  }

  arrancar() {
    if (this.quieto) { this._pintarEstatico(); return; }
    if (this.rafId != null) return;
    this.rafId = requestAnimationFrame((t) => this._tick(t));
  }

  parar() {
    if (this.rafId != null) { cancelAnimationFrame(this.rafId); this.rafId = null; }
  }

  destruir() {
    this.parar();
    this.puntos.geometry.dispose();
    this.puntos.material.map && this.puntos.material.map.dispose();
    this.puntos.material.dispose();
    this.lineas.geometry.dispose();
    this.lineas.material.dispose();
    this.renderer.dispose();
  }
}

function eased_z(p) { return p * p * (3 - 2 * p); }

/**
 * Monta una escena en un <canvas>. Perezoso de verdad: el módulo de
 * Three.js (vendorizado, sin CDN externo — sección 33 del encargo) solo se
 * importa la PRIMERA vez que una escena entra en viewport; páginas sin
 * ninguna sección de este tipo no pagan ni un byte de este coste.
 *
 * `opts.progressSource`: función () => number en [0,1]. Quien monta decide
 * cómo se calcula (from/to de scroll de SU sección) — este módulo no sabe
 * nada de layout de página, sólo dibuja lo que le dicen.
 */
export async function montarEscenaSistema(canvas, opts = {}) {
  if (!THREE) {
    if (!cargaTHREE) cargaTHREE = import("/assets/vendor/three/three.module.min.js");
    THREE = await cargaTHREE;
  }
  const escena = new EscenaSistema(canvas);

  const ro = new ResizeObserver(() => escena._resize());
  ro.observe(canvas.parentElement || canvas);

  const io = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      escena.visible = e.isIntersecting;
      if (e.isIntersecting) escena.arrancar(); else escena.parar();
    }
  }, { threshold: 0.02 });
  io.observe(canvas);

  const onScroll = () => {
    if (!opts.progressSource) return;
    escena.setProgress(opts.progressSource());
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  return {
    setProgress: (p) => escena.setProgress(p),
    destruir() {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      escena.destruir();
    },
  };
}

export function webglDisponible() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch (e) {
    return false;
  }
}
