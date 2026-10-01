/* ==========================================================================
   D-CODE FINANCE · DEL PAPEL AL DATO (three.js, WebGL)
   --------------------------------------------------------------------------
   Una factura de proveedor entra en Finance y sale convertida en datos:
     0 llega        la factura, sobre el montón de las de la semana
     1 la IA la lee una línea de luz la recorre y marca cada campo
     2 datos        los campos salen del papel y forman un registro
                    (el IVA viene al 10 % en unos neumáticos: se marca)
     3 registrada   el IVA se corrige al 21 % y el registro entra en el
                    libro de facturas, encima de las demás
   Datos inventados: los de la demo del taller Brío (Neumáticos Sur).
   Blanco, negro y grises; papel mate, cerámica negra con barniz y vidrio.
   ========================================================================== */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Color, Vector3, Vector2, Euler, Quaternion,
  MeshPhysicalMaterial, MeshStandardMaterial, MeshBasicMaterial, PlaneGeometry, BoxGeometry, CanvasTexture,
  PMREMGenerator, AgXToneMapping, SRGBColorSpace, LineSegments, LineBasicMaterial, EdgesGeometry, AdditiveBlending,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { estudio, sombraContacto, azar } from "./piezas.js";

const suave = (t) => { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); };
const mezcla = (a, b, t) => a + (b - a) * t;
const FT = '"Archivo", ui-sans-serif, system-ui, sans-serif', FM = '"Martian Mono", ui-monospace, Menlo, monospace';

/* ------------------------------------------------------------- la factura
   Medidas en metros: A4 a escala (0,62 × 0,877). Los campos que la IA lee
   se dibujan en sitios conocidos (en proporción de la hoja) para marcarlos
   y sacarlos del papel. */
const HOJA = { w: 0.62, h: 0.877 };
const CAMPOS = (en) => [
  { k: "proveedor", et: en ? "Supplier" : "Proveedor", v: "Neumáticos Sur, S.L.", r: [0.08, 0.06, 0.6, 0.075] },
  { k: "fecha", et: en ? "Date" : "Fecha", v: "12/09/2026", r: [0.62, 0.2, 0.3, 0.045] },
  { k: "concepto", et: en ? "Item" : "Concepto", v: "225/45 R17 ×4", r: [0.08, 0.42, 0.84, 0.05] },
  { k: "base", et: en ? "Base" : "Base imponible", v: "465,45 €", r: [0.52, 0.72, 0.4, 0.04] },
  { k: "iva", et: en ? "VAT" : "IVA", v: "10 % · 46,55 €", r: [0.52, 0.77, 0.4, 0.04], mal: true, bien: "21 % · 97,75 €" },
  { k: "total", et: "Total", v: "512,00 €", r: [0.52, 0.83, 0.4, 0.06], bien: "563,20 €" },
];
function lienzo(w, h, pintar) { const c = document.createElement("canvas"); c.width = w; c.height = h; pintar(c.getContext("2d"), w, h); const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 8; return t; }
function texturaFactura(en, campos, vacia = false, sem = 1) {
  return lienzo(1240, 1754, (g, W, H) => {
    g.fillStyle = "#f4f4f1"; g.fillRect(0, 0, W, H);
    const r = azar(sem), linea = (x, y, w, alto = 10, tono = "#c9c9c4") => { g.fillStyle = tono; g.fillRect(x * W, y * H, w * W, alto); };
    if (vacia) { linea(0.08, 0.07, 0.4, 34, "#2a2a2a"); for (let i = 0; i < 16; i++) linea(0.08, 0.2 + i * 0.04, 0.3 + r() * 0.5); linea(0.52, 0.83, 0.4, 40, "#2a2a2a"); return; }
    g.fillStyle = "#111"; g.textBaseline = "top";
    const c = Object.fromEntries(campos.map((x) => [x.k, x]));
    g.font = `650 64px ${FT}`; g.fillText(c.proveedor.v, 0.08 * W, 0.065 * H);
    g.font = `400 26px ${FM}`; g.fillStyle = "#555"; g.fillText("B-00000000 · Leganés (Madrid)", 0.08 * W, 0.115 * H);
    g.fillText(en ? "INVOICE NS-2026-0915" : "FACTURA NS-2026-0915", 0.08 * W, 0.205 * H);
    g.fillStyle = "#111"; g.font = `500 34px ${FM}`; g.fillText(c.fecha.v, 0.62 * W, 0.205 * H);
    g.fillStyle = "#555"; g.font = `400 26px ${FM}`; g.fillText(en ? "BILL TO" : "FACTURAR A", 0.08 * W, 0.28 * H);
    g.fillStyle = "#111"; g.font = `500 36px ${FT}`; g.fillText("Taller Brío", 0.08 * W, 0.305 * H);
    linea(0.08, 0.39, 0.84, 3, "#111");
    g.font = `500 40px ${FT}`; g.fillText(c.concepto.v, 0.08 * W, 0.43 * H); g.textAlign = "right"; g.fillText(c.base.v, 0.92 * W, 0.43 * H); g.textAlign = "left";
    for (let i = 0; i < 5; i++) linea(0.08, 0.52 + i * 0.035, 0.25 + r() * 0.35, 9);
    linea(0.52, 0.7, 0.4, 3, "#111");
    g.font = `400 30px ${FM}`; g.fillStyle = "#555"; g.fillText(c.base.et.toUpperCase(), 0.52 * W, 0.725 * H); g.fillText(c.iva.et.toUpperCase(), 0.52 * W, 0.775 * H);
    g.fillStyle = "#111"; g.textAlign = "right"; g.font = `500 34px ${FM}`; g.fillText(c.base.v, 0.92 * W, 0.722 * H); g.fillText(c.iva.v, 0.92 * W, 0.772 * H);
    g.font = `700 56px ${FT}`; g.fillText(c.total.v, 0.92 * W, 0.832 * H); g.textAlign = "left"; g.font = `600 34px ${FT}`; g.fillText("TOTAL", 0.52 * W, 0.84 * H);
    g.fillStyle = "#777"; g.font = `400 22px ${FM}`; g.fillText(en ? "Invented data · demo" : "Datos inventados · demo", 0.08 * W, 0.94 * H);
  });
}
// Ficha de un campo extraído: etiqueta en gris (mono) y valor en blanco, sobre cerámica negra
function texturaFicha(et, v, aviso) {
  return lienzo(1200, 200, (g, W, H) => {
    g.clearRect(0, 0, W, H); g.textBaseline = "middle";
    g.fillStyle = "#9a9a9a"; g.font = `500 40px ${FM}`; g.fillText(et.toUpperCase(), 48, H / 2);
    g.fillStyle = "#f2f2f2"; g.font = `600 64px ${FT}`; g.textAlign = "right"; g.fillText(v, W - 48 - (aviso ? 70 : 0), H / 2 + 2);
    if (aviso) { g.strokeStyle = "#f2f2f2"; g.lineWidth = 6; g.beginPath(); g.arc(W - 64, H / 2, 26, 0, Math.PI * 2); g.stroke(); g.fillStyle = "#f2f2f2"; g.font = `700 40px ${FT}`; g.textAlign = "center"; g.fillText("!", W - 64, H / 2 + 2); }
  });
}
function texturaFila(a, b, c) {
  return lienzo(1600, 140, (g, W, H) => {
    g.clearRect(0, 0, W, H); g.textBaseline = "middle";
    g.fillStyle = "#ececec"; g.font = `560 50px ${FT}`; g.fillText(a, 40, H / 2);
    g.fillStyle = "#8f8f8f"; g.font = `400 36px ${FM}`; g.fillText(b, W * 0.45, H / 2);
    g.fillStyle = "#ececec"; g.font = `560 50px ${FM}`; g.textAlign = "right"; g.fillText(c, W - 40, H / 2);
  });
}
const LIBRO = [["Recambios Sur", "Baterías ×5", "480,00 €"], ["Grúas Leganés", "Remolque ×3", "285,00 €"], ["Lubricantes Centro", "Aceite 5W-30", "1.290,50 €"], ["Recambios Sur", "Filtros ×40", "412,80 €"], ["Herramientas Ruiz", "Llave dinamométrica", "189,90 €"], ["Pinturas Oeste", "Pintura y barniz", "356,40 €"], ["Seguros Castilla", "Cuota trimestral", "1.120,00 €"]];

/* ================================================================ montar */
export async function montar(lienzoEl, { movil = false, en = false } = {}) {
  try { await Promise.all([document.fonts.load(`600 40px ${FT}`), document.fonts.load(`500 40px ${FM}`)]); } catch (e) { /* sin fuentes: las del sistema */ }
  const renderer = new WebGLRenderer({ canvas: lienzoEl, alpha: true, antialias: (devicePixelRatio || 1) < 2, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0); renderer.toneMapping = AgXToneMapping; renderer.outputColorSpace = SRGBColorSpace;
  const escena = new Scene();
  const pm = new PMREMGenerator(renderer); escena.environment = pm.fromScene(estudio(), 0.03).texture; pm.dispose();
  const cam = new PerspectiveCamera(30, 1, 0.05, 40);
  const mundo = new Group(); escena.add(mundo);
  const campos = CAMPOS(en);

  // ---- el montón de facturas de la semana y la que entra
  const papel = (map) => new MeshStandardMaterial({ map, roughness: 0.82, metalness: 0, envMapIntensity: 0.9 });
  const canto = new MeshStandardMaterial({ color: 0xe6e6e1, roughness: 0.9 });
  const hojaGeo = new BoxGeometry(HOJA.w, HOJA.h, 0.003);
  const monton = new Group(); mundo.add(monton);
  const r = azar(5);
  for (let i = 0; i < 7; i++) {
    const m = new Mesh(hojaGeo, [canto, canto, canto, canto, papel(texturaFactura(en, campos, true, i + 2)), canto]);
    m.rotation.set(-Math.PI / 2, 0, (r() - 0.5) * 0.5); m.position.set(-0.5 + (r() - 0.5) * 0.06, 0.004 + i * 0.006, -0.1 + (r() - 0.5) * 0.06); monton.add(m);
  }
  const texF = texturaFactura(en, campos);
  const factura = new Mesh(hojaGeo, [canto, canto, canto, canto, papel(texF), canto]); mundo.add(factura);

  // ---- el lector: un cristal y una línea de luz que recorre la hoja
  const cristal = new Mesh(new RoundedBoxGeometry(HOJA.w + 0.1, HOJA.h + 0.1, 0.018, 3, 0.012), movil
    ? new MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.1, transparent: true, opacity: 0.12, envMapIntensity: 1.2 })
    : new MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transmission: 1, thickness: 0.05, ior: 1.4, clearcoat: 1, envMapIntensity: 1.1 }));
  mundo.add(cristal);
  const brillo = lienzo(8, 128, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.5, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  const luz = new Mesh(new PlaneGeometry(HOJA.w + 0.12, 0.09), new MeshBasicMaterial({ map: brillo, transparent: true, blending: AdditiveBlending, depthWrite: false, toneMapped: false, opacity: 0 }));
  const filo = new Mesh(new PlaneGeometry(HOJA.w + 0.12, 0.0035), new MeshBasicMaterial({ color: 0xffffff, transparent: true, depthWrite: false, toneMapped: false, opacity: 0 }));
  const lector = new Group(); lector.add(luz, filo); mundo.add(lector);

  // ---- los recuadros de los campos sobre la hoja (se encienden al pasar la luz)
  const marcos = campos.map((c) => {
    const [x, y, w, h] = c.r, g = new EdgesGeometry(new PlaneGeometry(w * HOJA.w + 0.016, h * HOJA.h + 0.014));
    const l = new LineSegments(g, new LineBasicMaterial({ color: 0x111111, transparent: true, opacity: 0, toneMapped: false }));
    l.userData.local = new Vector3((x + w / 2 - 0.5) * HOJA.w, (0.5 - (y + h / 2)) * HOJA.h, 0.003); l.userData.y = y + h / 2; factura.add(l); l.position.copy(l.userData.local); return l;
  });

  // ---- las fichas: cada campo, fuera del papel, como un dato
  const ceramica = new MeshPhysicalMaterial({ color: 0x0d0d0f, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.1, envMapIntensity: 1.3 });
  const fichaGeo = new RoundedBoxGeometry(0.66, 0.098, 0.022, 3, 0.01);
  const fichas = campos.map((c, i) => {
    const g = new Group(); const cuerpo = new Mesh(fichaGeo, ceramica); g.add(cuerpo);
    const tex = texturaFicha(c.et, c.v, c.mal), texB = c.bien ? texturaFicha(c.et, c.bien, false) : null;
    const cara = new Mesh(new PlaneGeometry(0.64, 0.64 / 6), new MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false })); cara.position.z = 0.0115; g.add(cara);
    let aro = null; if (c.mal) { aro = new LineSegments(new EdgesGeometry(new PlaneGeometry(0.69, 0.125)), new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, toneMapped: false })); aro.position.z = 0.012; g.add(aro); }
    g.userData = { c, i, cara, tex, texB, aro, corregida: false }; g.visible = false; mundo.add(g); return g;
  });

  // ---- el libro de facturas: filas ya registradas, y la nueva arriba
  const filaGeo = new RoundedBoxGeometry(1.02, 0.07, 0.03, 3, 0.01);
  const libro = new Group(); mundo.add(libro);
  const filas = LIBRO.map(([a, b, c], i) => { const g = new Group(); g.add(new Mesh(filaGeo, ceramica)); const cara = new Mesh(new PlaneGeometry(1.0, 1.0 / 11.4), new MeshBasicMaterial({ map: texturaFila(a, b, c), transparent: true, toneMapped: false })); cara.position.z = 0.0155; g.add(cara); g.position.set(0, -i * 0.088, 0); libro.add(g); return g; });
  const nueva = (() => { const g = new Group(); g.add(new Mesh(filaGeo, ceramica)); const cara = new Mesh(new PlaneGeometry(1.0, 1.0 / 11.4), new MeshBasicMaterial({ map: texturaFila("Neumáticos Sur", "225/45 R17 ×4", "563,20 €"), transparent: true, toneMapped: false })); cara.position.z = 0.0155; g.add(cara); libro.add(g); return g; })();

  const sombra = sombraContacto(renderer, escena, movil ? 256 : 512, 4.2, 3, 1.6); sombra.opacidad = 0.8;

  /* ----------------------------------------------------------- encuadre */
  let W = 1, H = 1, lado = true, dpr = Math.min(devicePixelRatio || 1, movil ? 1.6 : 1.85);
  const medir = () => {
    const b = lienzoEl.getBoundingClientRect(); W = Math.max(1, b.width); H = Math.max(1, b.height);
    renderer.setPixelRatio(dpr); renderer.setSize(W, H, false); cam.aspect = W / H; lado = W >= 1000 && W / H > 1;
    if (lado) cam.setViewOffset(W, H, -W * 0.12, 0, W, H); else cam.setViewOffset(W, H, 0, H * 0.18, W, H);
    cam.fov = lado ? 30 : Math.min(62, (2 * Math.atan(Math.tan((15 * Math.PI) / 180) * 1.25 / (W / H)) * 180) / Math.PI);
    cam.updateProjectionMatrix(); pedir();
  };

  /* ------------------------------------------------------------- estado */
  let objetivo = 0, s = 0, vel = 0, visible = true, raf = 0, ultimo = performance.now(), reloj = 0;
  const punt = new Vector2(), puntS = new Vector2(); let giro = 0, giroV = 0, arrastra = false, xAnt = 0;
  const q = new Quaternion(), qa = new Quaternion(), qb = new Quaternion(), eu = new Euler(), va = new Vector3(), vb = new Vector3();
  // la factura: tres posturas (sobre el montón · frente al lector · apartada)
  const POSE = [
    { p: [-0.12, 0.55, 0.15], r: [-0.95, 0.35, 0.18] },
    { p: [0.02, 0.9, 0.1], r: [0, 0.12, 0] },
    { p: [-0.42, 0.88, -0.25], r: [0, 0.38, 0] },
    { p: [-0.55, 0.85, -0.45], r: [0, 0.45, 0] },
  ];
  const REG = (i) => new Vector3(0.36, 1.16 - i * 0.118, 0.12); // columna del registro
  const LIBRO_P = new Vector3(0.32, 0.98, -0.05);

  function pintar(dt) {
    reloj += dt;
    // postura de la factura entre etapas
    const a = Math.min(3, Math.floor(s)), b = Math.min(3, a + 1), f = suave(s - a);
    va.fromArray(POSE[a].p).lerp(vb.fromArray(POSE[b].p), f);
    factura.position.copy(va); factura.position.y += Math.sin(reloj * 0.8) * 0.008 * (1 - suave(s));
    qa.setFromEuler(eu.set(...POSE[a].r)); qb.setFromEuler(eu.set(...POSE[b].r)); q.slerpQuaternions(qa, qb, f);
    // la hoja responde al puntero (se inclina hacia él) y al arrastre
    qa.setFromEuler(eu.set(-puntS.y * 0.12, puntS.x * 0.16 + giro, 0)); factura.quaternion.copy(q).multiply(qa);
    const tenue = suave((s - 1.6) / 0.8); factura.material[4].color.setScalar(1 - tenue * 0.55);

    // el lector: aparece frente a la hoja en la etapa 1; la luz baja una y otra vez mientras lee
    const vL = Math.min(suave((s - 0.45) / 0.45), 1 - suave((s - 1.55) / 0.4));
    cristal.visible = vL > 0.01; cristal.position.copy(factura.position).add(va.set(0, 0, 0.06).applyQuaternion(factura.quaternion)); cristal.quaternion.copy(factura.quaternion); cristal.scale.setScalar(0.9 + 0.1 * vL);
    if (cristal.material.transmission) cristal.material.opacity = vL; else cristal.material.opacity = 0.12 * vL;
    const barrido = (reloj * 0.42) % 1, yH = (0.5 - barrido) * HOJA.h;
    lector.position.copy(factura.position).add(va.set(0, yH, 0.03).applyQuaternion(factura.quaternion)); lector.quaternion.copy(factura.quaternion);
    luz.material.opacity = 0.55 * vL; filo.material.opacity = 0.95 * vL;
    // cada recuadro se enciende cuando la luz pasa por él y se queda encendido hasta que el campo sale
    marcos.forEach((m, i) => { const leido = vL > 0.5 && (barrido > m.userData.y || s > 1.2); const o = (s < 0.6 ? 0 : leido ? 1 : m.material.opacity * 0.96) * (1 - suave((s - 1.5) / 0.5)); m.material.opacity = Math.max(0, Math.min(1, o)); m.material.color.setScalar(i === 4 && s > 1.1 ? 0 : 0.07); });

    // las fichas: salen de su recuadro y forman el registro; con la etapa 3 entran en el libro
    const salir = suave((s - 1.35) / 0.65), entrar = suave((s - 2.55) / 0.45);
    fichas.forEach((g) => {
      const { i, c, aro } = g.userData; const k = suave((s - 1.35 - i * 0.06) / 0.6);
      g.visible = salir > 0.001 && entrar < 0.999;
      const desde = g.userData.desde || (g.userData.desde = new Vector3());
      desde.copy(marcos[i].userData.local).applyQuaternion(factura.quaternion).add(factura.position);
      const hasta = REG(i), alLibro = va.copy(LIBRO_P).add(vb.set(0, 0.088, 0.02));
      g.position.lerpVectors(desde, hasta, k); g.position.z += Math.sin(k * Math.PI) * 0.22;
      g.position.lerp(alLibro, entrar);
      g.scale.set(mezcla(0.3, 1, k) * mezcla(1, 1.5, entrar), mezcla(0.3, 1, k) * mezcla(1, 0.7, entrar), 1);
      qb.setFromEuler(eu.set(0, mezcla(0.12, -0.18, k) + puntS.x * 0.06, Math.sin(k * Math.PI) * (i % 2 ? 0.25 : -0.25))); g.quaternion.copy(factura.quaternion).slerp(qb, k);
      // el IVA mal puesto: se marca al llegar y se corrige al 21 % antes de registrar
      if (c.mal && aro) aro.material.opacity = Math.max(0, Math.min(1, suave((s - 1.9) / 0.2) * (1 - suave((s - 2.3) / 0.15)) * (0.65 + 0.35 * Math.sin(reloj * 6))));
      const corregir = s > 2.3; if (g.userData.texB && corregir !== g.userData.corregida) { g.userData.corregida = corregir; g.userData.cara.material.map = corregir ? g.userData.texB : g.userData.tex; }
    });

    // el libro: llega por la derecha; la fila nueva cae encima y las demás bajan un hueco
    const vLibro = suave((s - 2.2) / 0.5);
    libro.visible = vLibro > 0.001; libro.position.copy(LIBRO_P).add(va.set((1 - vLibro) * 0.6, 0, 0)); libro.rotation.set(0, -0.2 + puntS.x * 0.05, 0); libro.scale.setScalar(0.86);
    filas.forEach((g, i) => { g.position.y = -(i + entrar) * 0.088; g.children.forEach((m) => { if (m.material.opacity !== undefined && m.material.transparent) m.material.opacity = vLibro * (1 - (i + entrar) / 10); }); g.visible = vLibro > 0.01; });
    nueva.visible = entrar > 0.01; nueva.position.y = 0.088 * (1 - entrar) * 2; nueva.scale.setScalar(Math.max(0.001, entrar));

    // cámara
    const d = mezcla(3.3, 3.0, suave(s / 2)) - suave((s - 2) / 1) * 0.1;
    cam.position.set(0.05 + puntS.x * 0.18, 1.15 - puntS.y * 0.08 + (1 - suave(s)) * 0.25, d); cam.lookAt(0, 0.85 - (1 - suave(s)) * 0.12, 0);
    escena.environmentRotation.y = -0.3 + s * 0.2 + puntS.x * 0.25;
  }

  const bucle = (t) => {
    raf = 0; if (!visible) return;
    const dt = Math.min(0.04, (t - ultimo) / 1000); ultimo = t;
    const k = 30, c = 2 * Math.sqrt(k); vel += ((objetivo - s) * k - vel * c) * dt; s += vel * dt;
    if (Math.abs(objetivo - s) < 0.0004 && Math.abs(vel) < 0.002) { s = objetivo; vel = 0; }
    puntS.lerp(punt, 1 - Math.exp(-dt * 6));
    if (!arrastra) { giroV += (-giro * 3 - giroV * 3) * dt; giro += giroV * dt; }
    pintar(dt); sombra.pintar(); renderer.render(escena, cam);
    pedir();
  };
  function pedir() { if (!raf && visible) raf = requestAnimationFrame(bucle); }
  new ResizeObserver(medir).observe(lienzoEl);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting && !document.hidden; if (visible) { ultimo = performance.now(); pedir(); } }).observe(lienzoEl);
  document.addEventListener("visibilitychange", () => { visible = !document.hidden; if (visible) { ultimo = performance.now(); pedir(); } });
  if (matchMedia("(pointer: fine)").matches) addEventListener("pointermove", (e) => { const b = lienzoEl.getBoundingClientRect(); punt.set(((e.clientX - b.left) / b.width) * 2 - 1, ((e.clientY - b.top) / b.height) * 2 - 1); if (arrastra) { const dx = e.clientX - xAnt; xAnt = e.clientX; giro += dx * 0.006; } }, { passive: true });
  lienzoEl.addEventListener("pointerdown", (e) => { arrastra = true; xAnt = e.clientX; lienzoEl.setPointerCapture(e.pointerId); });
  lienzoEl.addEventListener("pointermove", (e) => { if (!arrastra || matchMedia("(pointer: fine)").matches) return; const dx = e.clientX - xAnt; xAnt = e.clientX; giro += dx * 0.008; }, { passive: true });
  const soltar = () => { arrastra = false; }; lienzoEl.addEventListener("pointerup", soltar); lienzoEl.addEventListener("pointercancel", soltar);
  medir();
  return {
    etapa(v, inmediato) { objetivo = Math.min(3, Math.max(0, v)); if (inmediato) { s = objetivo; vel = 0; } pedir(); },
    tema(claro) { sombra.opacidad = claro ? 0.85 : 0.8; ceramica.envMapIntensity = claro ? 1.1 : 1.4; renderer.toneMappingExposure = claro ? 1 : 1.1; marcos.forEach((m) => m.material.color.setScalar(0.07)); pedir(); },
    forzar(n = 90) { for (let i = 0; i < n; i++) { const dt = 1 / 60, k = 30, c = 2 * Math.sqrt(k); vel += ((objetivo - s) * k - vel * c) * dt; s += vel * dt; puntS.copy(punt); pintar(dt); } sombra.pintar(); renderer.render(escena, cam); },
  };
}
