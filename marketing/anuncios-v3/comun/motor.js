// Motor mínimo de animación, común a las dos escenas. Todo es función del tiempo: pintar(t) dibuja el fotograma
// exacto del instante t, sin estado entre fotogramas. Así el render es determinista y se puede repetir un solo plano.
"use strict";
const M = {};

// ─── curvas ───
M.clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
M.lerp = (a, b, k) => a + (b - a) * k;
M.prog = (t, t0, t1) => M.clamp((t - t0) / (t1 - t0));
M.eOut = (k) => 1 - Math.pow(1 - k, 3);
M.eOut5 = (k) => 1 - Math.pow(1 - k, 5);
M.eIn = (k) => k * k * k;
M.eIO = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
M.eExpo = (k) => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * k));
M.eBack = (k, s = 1.7) => 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2);
// muelle amortiguado: entra pasándose un poco y se asienta (para golpes tipográficos)
M.muelle = (k, f = 3.2, d = 5.5) => (k <= 0 ? 0 : k >= 1 ? 1 : 1 - Math.exp(-d * k) * Math.cos(f * Math.PI * k));
// ventana: 0 → 1 (entrada) … 1 → 0 (salida)
M.ventana = (t, t0, t1, ent = 0.2, sal = 0.2, fe = M.eOut, fs = M.eIn) =>
  t < t0 || t > t1 ? 0 : Math.min(fe(M.prog(t, t0, t0 + ent)), 1 - fs(M.prog(t, t1 - sal, t1)));

// ─── azar con semilla (cada plano tiene su propio ruido, idéntico en cada render) ───
M.rng = (s) => () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
M.hash = (n) => { let x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ─── dibujo ───
M.rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); };
M.fuente = (peso, px, fam = "Inter Tight") => `${peso} ${px}px "${fam}"`;

// Texto con interletraje, alineación y registro de su caja (para el control de zonas seguras y tamaños).
M.CAJAS = [];
M.texto = (c, s, x, y, o = {}) => {
  const { f = M.fuente(600, 48), color = "#fff", al = "left", base = "alphabetic", track = 0, alpha = 1, registrar = true } = o;
  c.save(); c.font = f; c.fillStyle = color; c.globalAlpha *= alpha; c.textBaseline = base;
  c.letterSpacing = `${track}px`;
  const w = c.measureText(s).width;
  const x0 = al === "center" ? x - w / 2 : al === "right" ? x - w : x;
  c.textAlign = "left"; c.fillText(s, x0, y);
  if (registrar && alpha > 0.35) {
    const m = c.measureText(s); const tr = c.getTransform();
    const px = parseFloat(/(\d+(?:\.\d+)?)px/.exec(c.font)[1]);
    const p0 = tr.transformPoint(new DOMPoint(x0, y - m.actualBoundingBoxAscent));
    const p1 = tr.transformPoint(new DOMPoint(x0 + w, y + m.actualBoundingBoxDescent));
    M.CAJAS.push({ s, x0: Math.min(p0.x, p1.x), y0: Math.min(p0.y, p1.y), x1: Math.max(p0.x, p1.x), y1: Math.max(p0.y, p1.y),
                   px: px * Math.hypot(tr.a, tr.b) });
  }
  c.restore(); return w;
};
M.ancho = (c, s, f, track = 0) => { c.save(); c.font = f; c.letterSpacing = `${track}px`; const w = c.measureText(s).width; c.restore(); return w; };

// Logotipo oficial de D-Code (geometría del SVG de la web). `k` 0→1 construye la marca pieza a pieza.
M.LOGO = {
  rects: [[26, 1, 16, 16], [1, 27, 13, 13], [35, 26, 13, 13], [2, 64, 12, 12], [35, 64, 13, 13], [26, 83, 16, 16], [102, 43, 16, 16]],
  arcos: ["M48 1H86A32 32 0 0 1 118 33V38H102V33A16 16 0 0 0 86 17H48Z", "M48 99H86A32 32 0 0 0 118 67V63H102V67A16 16 0 0 1 86 83H48Z"],
  pixel: [16, 45, 15, 15], w: 120, h: 100,
};
M.logo = (c, x, y, alto, tinta, azul, k = 1, kPixel = 1) => {
  const s = alto / 100; c.save(); c.translate(x, y); c.scale(s, s);
  const piezas = [...M.LOGO.rects.map((r) => ["r", r]), ...M.LOGO.arcos.map((p) => ["p", p])];
  piezas.forEach(([tipo, d], i) => {
    const ki = M.eOut(M.clamp(k * piezas.length - i * 0.8));
    if (ki <= 0) return;
    c.save(); c.globalAlpha *= ki; c.fillStyle = tinta;
    if (tipo === "r") { const [a, b, w, h] = d; const e = 0.6 + 0.4 * ki; c.translate(a + w / 2, b + h / 2); c.scale(e, e); c.fillRect(-w / 2, -h / 2, w, h); }
    else { c.translate(0, (1 - ki) * 6); c.fill(new Path2D(d)); }
    c.restore();
  });
  if (kPixel > 0) { const [a, b, w, h] = M.LOGO.pixel; c.globalAlpha *= kPixel; c.fillStyle = azul; c.fillRect(a, b, w, h); }
  c.restore();
};

// Grano de película: una textura de ruido precalculada, desplazada a cada fotograma (quita el aspecto «vectorial limpio»).
M.grano = (() => {
  let tex = null;
  return (c, W, H, n, fuerza = 0.06) => {
    if (!tex) {
      tex = document.createElement("canvas"); tex.width = tex.height = 512;
      const g = tex.getContext("2d"); const im = g.createImageData(512, 512); const r = M.rng(7);
      for (let i = 0; i < im.data.length; i += 4) { const v = (r() * 255) | 0; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
      g.putImageData(im, 0, 0);
    }
    c.save(); c.globalAlpha = fuerza; c.globalCompositeOperation = "overlay";
    const ox = (M.hash(n) * 512) | 0, oy = (M.hash(n + 99) * 512) | 0;
    for (let x = -ox; x < W; x += 512) for (let y = -oy; y < H; y += 512) c.drawImage(tex, x, y);
    c.restore();
  };
})();

// Viñeta suave
M.vineta = (c, W, H, fuerza = 0.5, color = "0,0,0") => {
  const g = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.75);
  g.addColorStop(0, `rgba(${color},0)`); g.addColorStop(1, `rgba(${color},${fuerza})`);
  c.fillStyle = g; c.fillRect(0, 0, W, H);
};

// Carga de fuentes e imágenes antes de pintar nada
M.cargar = async (fuentes, imagenes = {}) => {
  await Promise.all(fuentes.map(async ([fam, url, desc]) => { const ff = new FontFace(fam, `url(${url})`, desc || {}); await ff.load(); document.fonts.add(ff); }));
  const out = {};
  await Promise.all(Object.entries(imagenes).map(([k, url]) => new Promise((ok, ko) => { const im = new Image(); im.onload = () => ok((out[k] = im)); im.onerror = () => ko(new Error("no carga " + url)); im.src = url; })));
  await document.fonts.ready; return out;
};
window.M = M;
