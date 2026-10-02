/* ==========================================================================
   LA MÁQUINA · el papel y las cifras
   --------------------------------------------------------------------------
   Lo único que no es metal: el documento que entra en la máquina y las cifras
   de los tambores del registro. Se dibujan con Canvas 2D; no hay imágenes.
   ========================================================================== */
const TXT = {
  es: { factura: "FACTURA", total: "TOTAL", base: "Base imponible", iva: "IVA 21 %", num: "N.º F-2026/0412", vence: "Vence 28/10/2026", concepto: "Concepto", imp: "Importe" },
  en: { factura: "INVOICE", total: "TOTAL", base: "Net amount", iva: "VAT 21%", num: "No. F-2026/0412", vence: "Due 28/10/2026", concepto: "Item", imp: "Amount" },
};
export const PROVEEDOR = "Suministros Arce, S.L.";
/* Dónde está cada dato en la hoja (u, v con el origen abajo a la izquierda). */
export const CAMPOS = { num: [0.742, 0.912], fecha: [0.802, 0.879], prov: [0.336, 0.79], base: [0.802, 0.324], iva: [0.82, 0.279], total: [0.76, 0.2], vence: [0.247, 0.197] };

export function dibujarFactura(idioma = "es", escala = 2, datos = {}, previo = null) {
  const W = Math.round(384 * escala), H = Math.round(544 * escala), T = TXT[idioma] || TXT.es;
  const D = { base: idioma === "en" ? "€1,240.00" : "1.240,00 €", iva: idioma === "en" ? "€260.40" : "260,40 €", total: idioma === "en" ? "€1,500.40" : "1.500,40 €", lineas: ["212,00", "486,50", "318,00", "223,50"], ...datos };
  const c = previo ? previo.lienzo : document.createElement("canvas"); c.width = W; c.height = H;
  const m = previo ? previo.mascara : document.createElement("canvas"); m.width = Math.round(W / 2); m.height = Math.round(H / 2);
  const g = c.getContext("2d"), gm = m.getContext("2d"); gm.fillStyle = "#000"; gm.fillRect(0, 0, m.width, m.height);
  const S = (v) => v * escala, M = 34, R = 384 - M;
  const fuente = (px, peso = 500, mono = false) => `${peso} ${px * escala}px ${mono ? '"Martian Mono", ui-monospace, Menlo, monospace' : '"Archivo", system-ui, -apple-system, "Segoe UI", sans-serif'}`;
  g.fillStyle = "#f1f0ec"; g.fillRect(0, 0, W, H);
  const tinta = (a = 1) => `rgba(20,20,22,${a})`;
  const barra = (x, y, w, h, a = 0.55) => { g.fillStyle = tinta(a); g.fillRect(S(x), S(y), S(w), S(h)); };
  const linea = (x, y, w, a = 0.25) => { g.fillStyle = tinta(a); g.fillRect(S(x), S(y), S(w), Math.max(1, S(1))); };
  const texto = (s, x, y, px, peso, a = 0.92, mono = false, al = "left") => { g.font = fuente(px, peso, mono); g.fillStyle = tinta(a); g.textAlign = al; g.textBaseline = "alphabetic"; g.fillText(s, S(x), S(y)); };
  const campo = (x, y, w, h) => { gm.fillStyle = "#fff"; gm.fillRect((x * escala) / 2, (y * escala) / 2, (w * escala) / 2, (h * escala) / 2); };
  barra(M, 38, 34, 34, 0.9); texto(T.factura, M + 46, 64, 26, 800);
  texto(T.num, R, 52, 11, 500, 0.8, true, "right"); texto("28/09/2026", R, 70, 11, 500, 0.8, true, "right"); campo(R - 132, 40, 134, 16); campo(R - 86, 58, 88, 16);
  texto(PROVEEDOR, M, 118, 15, 700); campo(M - 3, 102, 196, 22); barra(M, 130, 150, 5, 0.35); barra(M, 141, 96, 5, 0.35);
  linea(M, 176, 316, 0.6); texto(T.concepto, M, 196, 10, 600, 0.6, true); texto(T.imp, R, 196, 10, 600, 0.6, true, "right"); linea(M, 206, 316, 0.3);
  [[D.lineas[0], 150], [D.lineas[1], 190], [D.lineas[2], 170], [D.lineas[3], 120]].forEach(([v, w], k) => { barra(M, 222 + k * 30, w, 6, 0.45); texto(v, R, 230 + k * 30, 11, 500, 0.75, true, "right"); linea(M, 240 + k * 30, 316, 0.14); });
  texto(T.base, 172, 372, 11, 500, 0.7); texto(D.base, R, 372, 12, 500, 0.85, true, "right"); campo(264, 359, 88, 18);
  texto(T.iva, 172, 396, 11, 500, 0.7); texto(D.iva, R, 396, 12, 500, 0.85, true, "right"); campo(278, 383, 74, 18);
  barra(162, 410, 188, 2, 0.9); texto(T.total, 166, 440, 14, 800); texto(D.total, R, 441, 17, 800, 0.95, true, "right"); campo(232, 422, 120, 26);
  texto(T.vence, M, 440, 10, 500, 0.6, true); campo(M - 3, 428, 128, 17); barra(M, 478, 316, 5, 0.25); barra(M, 489, 170, 5, 0.25);
  return { lienzo: c, mascara: m };
}

/* Las cifras de un tambor: del 0 al 9 dando la vuelta. La tira se enrolla alrededor del eje,
   así que cada cifra se dibuja tumbada. */
export function dibujarCifras() {
  const n = 10, a = 96, c = document.createElement("canvas"); c.width = a * n; c.height = a;
  const g = c.getContext("2d"); g.fillStyle = "#0c0c0d"; g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = "#e9e9ea"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = `600 ${a * 0.74}px "Martian Mono", ui-monospace, Menlo, monospace`;
  for (let k = 0; k < n; k++) { g.save(); g.translate(a * (k + 0.5), a / 2); g.rotate(-Math.PI / 2); g.fillText(String(k), 0, a * 0.04); g.restore(); g.fillStyle = "rgba(255,255,255,.16)"; g.fillRect(a * k, 0, 1, a); g.fillStyle = "#e9e9ea"; }
  return c;
}

/* El grabado de la tapa: el nombre que escribe el visitante. Blanco = grabado. */
export function dibujarGrabado(c, lineas, { ancho = 1024, alto = 512 } = {}) {
  if (!c) { c = document.createElement("canvas"); c.width = ancho; c.height = alto; }
  const g = c.getContext("2d"); g.fillStyle = "#000"; g.fillRect(0, 0, c.width, c.height); g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle";
  lineas.forEach(({ t, y, px, mono, peso = 600, esp = 0 }) => {
    let tam = px; g.font = `${peso} ${tam}px ${mono ? '"Martian Mono", ui-monospace, monospace' : '"Archivo", system-ui, sans-serif'}`;
    if ("letterSpacing" in g) g.letterSpacing = esp + "px";
    while (g.measureText(t).width > c.width * 0.9 && tam > 12) { tam -= 2; g.font = g.font.replace(/\d+px/, tam + "px"); }
    g.fillText(t, c.width / 2, y);
  });
  // los cantos del grabado, suavizados: si no, el relieve sale a escalones
  try { const t = document.createElement("canvas"); t.width = c.width; t.height = c.height; const gt = t.getContext("2d"); gt.filter = "blur(1.6px)"; gt.drawImage(c, 0, 0); g.drawImage(t, 0, 0); } catch (e) {}
  return c;
}

/* Los nombres de las áreas, grabados en la placa de cada módulo. Una fila por módulo. */
export function dibujarRotulos(nombres, c = null) {
  const a = 512, h = 64; if (!c) { c = document.createElement("canvas"); c.width = a; c.height = h * nombres.length; }
  const g = c.getContext("2d"); g.fillStyle = "#000"; g.fillRect(0, 0, c.width, c.height); g.fillStyle = "#fff"; g.textAlign = "left"; g.textBaseline = "middle";
  g.font = `500 34px "Martian Mono", ui-monospace, Menlo, monospace`; if ("letterSpacing" in g) g.letterSpacing = "7px";
  nombres.forEach((n, k) => g.fillText(n.toUpperCase(), 6, h * (k + 0.5) + 2));
  return c;
}
