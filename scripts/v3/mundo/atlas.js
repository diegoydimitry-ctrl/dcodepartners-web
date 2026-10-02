/* El papel de una empresa: 16 documentos dibujados con Canvas 2D en un atlas.
   No hay imágenes que descargar. Son documentos inventados, reconocibles de
   lejos (factura, presupuesto, correo, conversación, hoja de cálculo…) y
   legibles de cerca. Canal R: lo impreso. Canal G: los campos que lee la IA. */
import { azar } from "./mat.js";

export const TIPOS = ["factura", "presupuesto", "correo", "chat", "hoja", "calendario", "albaran", "contrato", "ficha", "nota", "extracto", "formulario", "grafico", "pedido", "informe", "blanco"];
export const COLS = 4, FILAS = 4;

const TXT = {
  es: { factura: "FACTURA", presupuesto: "PRESUPUESTO", correo: "Asunto", chat: "Clientes", hoja: "Hoja 1", calendario: "OCTUBRE", albaran: "ALBARÁN", contrato: "CONTRATO", ficha: "CLIENTE", nota: "Llamar!", extracto: "EXTRACTO", formulario: "SOLICITUD", grafico: "VENTAS", pedido: "PEDIDO", informe: "INFORME", total: "TOTAL", base: "Base imponible", iva: "IVA 21 %", prov: "Suministros Arce, S.L.", num: "N.º F-2026/0412", fecha: "28/09/2026", vence: "Vence 28/10/2026", para: "Para:", de: "De:", pte: "PENDIENTE", firma: "Firma", concepto: "Concepto", imp: "Importe" },
  en: { factura: "INVOICE", presupuesto: "QUOTE", correo: "Subject", chat: "Clients", hoja: "Sheet 1", calendario: "OCTOBER", albaran: "DELIVERY NOTE", contrato: "CONTRACT", ficha: "CLIENT", nota: "Call back!", extracto: "STATEMENT", formulario: "REQUEST", grafico: "SALES", pedido: "ORDER", informe: "REPORT", total: "TOTAL", base: "Net amount", iva: "VAT 21%", prov: "Suministros Arce, S.L.", num: "No. F-2026/0412", fecha: "28/09/2026", vence: "Due 28/10/2026", para: "To:", de: "From:", pte: "PENDING", firma: "Signature", concepto: "Item", imp: "Amount" },
};

export function crearAtlas(idioma = "es", escala = 1) {
  const W = Math.round(384 * escala), H = Math.round(544 * escala);
  const c = document.createElement("canvas"); c.width = W * COLS; c.height = H * FILAS;
  const m = document.createElement("canvas"); m.width = c.width; m.height = c.height;
  const g = c.getContext("2d"), gm = m.getContext("2d");
  gm.fillStyle = "#000"; gm.fillRect(0, 0, m.width, m.height);
  const T = TXT[idioma] || TXT.es, r = azar(7);
  const fuente = (px, peso = 500, mono = false) => `${peso} ${px * escala}px ${mono ? '"Martian Mono", ui-monospace, Menlo, monospace' : '"Archivo", system-ui, -apple-system, "Segoe UI", sans-serif'}`;

  TIPOS.forEach((tipo, i) => {
    const ox = (i % COLS) * W, oy = Math.floor(i / COLS) * H;
    g.save(); g.translate(ox, oy); gm.save(); gm.translate(ox, oy);
    const S = (v) => v * escala;
    const papel = tipo === "nota" ? 222 : tipo === "blanco" ? 250 : 240 + Math.floor(r() * 10);
    g.fillStyle = `rgb(${papel},${papel},${papel})`; g.fillRect(0, 0, W, H);
    const tinta = (a = 1) => `rgba(22,22,24,${a})`;
    const barra = (x, y, w, h, a = 0.55) => { g.fillStyle = tinta(a); g.fillRect(S(x), S(y), S(w), S(h)); };
    const linea = (x, y, w, a = 0.25) => { g.fillStyle = tinta(a); g.fillRect(S(x), S(y), S(w), Math.max(1, S(1))); };
    const texto = (s, x, y, px, peso, a = 0.92, mono = false, al = "left") => { g.font = fuente(px, peso, mono); g.fillStyle = tinta(a); g.textAlign = al; g.textBaseline = "alphabetic"; g.fillText(s, S(x), S(y)); };
    const parrafo = (x, y, w, n, alto = 13, a = 0.42) => { for (let k = 0; k < n; k++) barra(x, y + k * alto, k === n - 1 ? w * (0.35 + r() * 0.4) : w * (0.86 + r() * 0.14), 5, a); };
    const campo = (x, y, w, h) => { gm.fillStyle = "#fff"; gm.fillRect(S(x), S(y), S(w), S(h)); };
    const caja = (x, y, w, h, a = 0.5) => { g.strokeStyle = tinta(a); g.lineWidth = Math.max(1, S(1.2)); g.strokeRect(S(x), S(y), S(w), S(h)); };
    const M = 34;

    if (tipo === "factura") {
      barra(M, 38, 34, 34, 0.9); texto(T.factura, M + 46, 64, 26, 800);
      texto(T.num, W / escala - M, 52, 11, 500, 0.8, true, "right"); texto(T.fecha, W / escala - M, 70, 11, 500, 0.8, true, "right");
      campo(W / escala - M - 132, 40, 134, 16); campo(W / escala - M - 86, 58, 88, 16);
      texto(T.prov, M, 118, 15, 700); campo(M - 3, 102, 196, 22); parrafo(M, 130, 150, 2, 11, 0.35);
      linea(M, 176, 316, 0.6); texto(T.concepto, M, 196, 10, 600, 0.6, true); texto(T.imp, W / escala - M, 196, 10, 600, 0.6, true, "right"); linea(M, 206, 316, 0.3);
      [["212,00", 150], ["486,50", 190], ["318,00", 170], ["223,50", 120]].forEach(([v, w], k) => { barra(M, 222 + k * 30, w, 6, 0.45); texto(v, W / escala - M, 230 + k * 30, 11, 500, 0.75, true, "right"); linea(M, 240 + k * 30, 316, 0.14); });
      texto(T.base, 190, 372, 11, 500, 0.7); texto("1.240,00 €", W / escala - M, 372, 12, 500, 0.85, true, "right"); campo(264, 359, 88, 18);
      texto(T.iva, 190, 396, 11, 500, 0.7); texto("260,40 €", W / escala - M, 396, 12, 500, 0.85, true, "right"); campo(278, 383, 74, 18);
      barra(186, 410, 164, 2, 0.9); texto(T.total, 190, 440, 14, 800); texto("1.500,40 €", W / escala - M, 441, 17, 800, 0.95, true, "right"); campo(232, 422, 120, 26);
      texto(T.vence, M, 440, 10, 500, 0.6, true); campo(M - 3, 428, 128, 17); parrafo(M, 478, 316, 2, 11, 0.25);
    } else if (tipo === "presupuesto") {
      texto(T.presupuesto, M, 66, 22, 800); texto("P-118", W / escala - M, 64, 12, 500, 0.75, true, "right"); campo(W / escala - M - 46, 50, 48, 18);
      parrafo(M, 96, 170, 3, 12, 0.4); linea(M, 152, 316, 0.6);
      for (let k = 0; k < 6; k++) { barra(M, 172 + k * 34, 120 + r() * 90, 6, 0.45); barra(300, 172 + k * 34, 50, 6, 0.6); linea(M, 192 + k * 34, 316, 0.14); }
      barra(214, 392, 136, 2, 0.9); texto(T.total, 214, 422, 13, 800); texto("4.870 €", W / escala - M, 423, 16, 800, 0.95, true, "right"); campo(266, 404, 86, 26);
      caja(M, 452, 132, 50, 0.35); texto(T.pte, M + 12, 483, 12, 700, 0.55, true); campo(M, 452, 132, 50);
    } else if (tipo === "correo") {
      texto(T.de, M, 58, 11, 600, 0.55); barra(M + 34, 50, 130, 7, 0.6); campo(M + 30, 44, 140, 18);
      texto(T.para, M, 82, 11, 600, 0.55); barra(M + 40, 74, 100, 7, 0.45);
      texto(T.correo + ":", M, 112, 11, 600, 0.55); barra(M + 58, 103, 200, 9, 0.8); campo(M + 54, 97, 210, 20); linea(M, 130, 316, 0.5);
      parrafo(M, 156, 316, 5, 15, 0.42); parrafo(M, 252, 316, 4, 15, 0.42); parrafo(M, 332, 316, 3, 15, 0.42);
      barra(M, 410, 90, 7, 0.6); parrafo(M, 428, 130, 2, 12, 0.3);
    } else if (tipo === "chat") {
      g.fillStyle = tinta(0.08); g.fillRect(0, 0, W, S(72)); g.beginPath(); g.fillStyle = tinta(0.5); g.arc(S(M + 16), S(38), S(16), 0, 7); g.fill(); texto(T.chat, M + 44, 44, 15, 700);
      const burb = (x, y, w, h, propia) => { g.fillStyle = propia ? tinta(0.82) : tinta(0.12); g.beginPath(); g.roundRect(S(x), S(y), S(w), S(h), S(12)); g.fill(); g.fillStyle = propia ? "rgba(255,255,255,.7)" : tinta(0.5); for (let k = 0; k * 13 + 22 < h; k++) g.fillRect(S(x + 14), S(y + 13 + k * 13), S((w - 28) * (k * 13 + 35 < h ? 1 : 0.55)), S(5)); };
      burb(M, 96, 210, 62, false); campo(M, 96, 210, 62); burb(M, 168, 150, 36, false); burb(140, 226, 210, 50, true); burb(M, 298, 230, 76, false); campo(M, 298, 230, 76); burb(M, 384, 120, 36, false);
      texto("22:15", W / escala - M, 446, 10, 500, 0.5, true, "right"); caja(M, 470, 316, 40, 0.3);
    } else if (tipo === "hoja") {
      texto(T.hoja, M, 50, 12, 600, 0.6, true);
      const cw = 52.6, ch = 22; for (let x = 0; x <= 6; x++) { g.fillStyle = tinta(0.28); g.fillRect(S(M + x * cw), S(66), Math.max(1, S(1)), S(ch * 20)); } for (let y = 0; y <= 20; y++) linea(M, 66 + y * ch, cw * 6, 0.28);
      g.fillStyle = tinta(0.12); g.fillRect(S(M), S(66), S(cw * 6), S(ch));
      for (let y = 0; y < 20; y++) for (let x = 0; x < 6; x++) if (r() < 0.62) barra(M + x * cw + 6, 66 + y * ch + 8, (cw - 12) * (0.4 + r() * 0.6), 5, y === 0 ? 0.8 : x === 0 ? 0.6 : 0.38);
      campo(M + cw * 4, 66 + ch * 6, cw * 2, ch * 3);
    } else if (tipo === "calendario") {
      texto(T.calendario, M, 62, 20, 800); const cw = 45.1, ch = 62;
      for (let y = 0; y < 6; y++) for (let x = 0; x < 7; x++) { caja(M + x * cw, 90 + y * ch, cw, ch, 0.22); const d = y * 7 + x - 2; if (d > 0 && d <= 31) { texto(String(d), M + x * cw + 6, 106 + y * ch, 10, 500, 0.6, true); if (r() < 0.38) barra(M + x * cw + 5, 116 + y * ch, cw - 10, 8, 0.5 + r() * 0.3); if (r() < 0.2) barra(M + x * cw + 5, 130 + y * ch, cw - 16, 8, 0.3); } }
      campo(M + cw * 3, 90 + ch * 2, cw * 2, ch);
    } else if (tipo === "albaran") {
      texto(T.albaran, M, 64, 22, 800); texto("A-0731", W / escala - M, 62, 12, 500, 0.75, true, "right"); campo(W / escala - M - 58, 48, 60, 18);
      caja(M, 92, 150, 70, 0.3); parrafo(M + 10, 106, 120, 4, 12, 0.4); caja(200, 92, 150, 70, 0.3); parrafo(210, 106, 120, 4, 12, 0.4);
      linea(M, 190, 316, 0.6); for (let k = 0; k < 7; k++) { caja(M, 204 + k * 30, 14, 14, 0.5); if (r() < 0.7) { g.strokeStyle = tinta(0.85); g.lineWidth = S(2); g.beginPath(); g.moveTo(S(M + 3), S(211 + k * 30)); g.lineTo(S(M + 6), S(215 + k * 30)); g.lineTo(S(M + 12), S(206 + k * 30)); g.stroke(); } barra(M + 26, 208 + k * 30, 130 + r() * 110, 6, 0.45); barra(318, 208 + k * 30, 32, 6, 0.6); }
      linea(M, 440, 150, 0.6); texto(T.firma, M, 456, 10, 500, 0.5); g.strokeStyle = tinta(0.8); g.lineWidth = S(1.6); g.beginPath(); g.moveTo(S(M + 8), S(432)); g.bezierCurveTo(S(M + 30), S(396), S(M + 50), S(450), S(M + 74), S(418)); g.bezierCurveTo(S(M + 90), S(402), S(M + 100), S(440), S(M + 132), S(424)); g.stroke();
    } else if (tipo === "contrato") {
      texto(T.contrato, W / escala / 2, 66, 18, 800, 0.92, false, "center"); linea(150, 78, 84, 0.6);
      for (let p = 0; p < 4; p++) { barra(M, 108 + p * 86, 60 + r() * 60, 7, 0.75); parrafo(M, 124 + p * 86, 316, 4, 13, 0.4); }
      linea(M, 474, 130, 0.6); linea(220, 474, 130, 0.6); texto(T.firma, M, 490, 10, 500, 0.5); texto(T.firma, 220, 490, 10, 500, 0.5);
      g.strokeStyle = tinta(0.8); g.lineWidth = S(1.6); g.beginPath(); g.moveTo(S(228), S(468)); g.bezierCurveTo(S(250), S(430), S(262), S(486), S(290), S(452)); g.bezierCurveTo(S(304), S(440), S(318), S(470), S(344), S(458)); g.stroke(); campo(220, 440, 130, 40);
    } else if (tipo === "ficha") {
      g.beginPath(); g.fillStyle = tinta(0.5); g.arc(S(M + 30), S(72), S(30), 0, 7); g.fill(); texto(T.ficha, M + 76, 62, 11, 600, 0.55, true); barra(M + 76, 74, 150, 11, 0.85); campo(M + 72, 68, 160, 22);
      linea(M, 124, 316, 0.5); for (let k = 0; k < 6; k++) { barra(M, 146 + k * 36, 60, 6, 0.35); barra(M + 96, 144 + k * 36, 100 + r() * 110, 9, 0.6); linea(M, 166 + k * 36, 316, 0.14); }
      campo(M + 92, 138, 220, 20); campo(M + 92, 174, 220, 20);
      for (let k = 0; k < 3; k++) { g.fillStyle = tinta(0.12); g.beginPath(); g.roundRect(S(M + k * 108), S(380), S(98), S(26), S(13)); g.fill(); barra(M + 16 + k * 108, 390, 60, 6, 0.55); }
      parrafo(M, 436, 316, 4, 14, 0.36);
    } else if (tipo === "nota") {
      g.font = fuente(46, 700); g.fillStyle = tinta(0.86); g.textAlign = "left"; g.save(); g.translate(S(M + 6), S(150)); g.rotate(-0.06); g.fillText(T.nota, 0, 0); g.restore();
      g.strokeStyle = tinta(0.75); g.lineWidth = S(3); g.lineCap = "round"; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(S(M + 8), S(214 + k * 46)); for (let x = 0; x < 6; x++) g.quadraticCurveTo(S(M + 30 + x * 44), S(200 + k * 46 + (x % 2 ? 22 : -4)), S(M + 52 + x * 44), S(214 + k * 46)); g.stroke(); if (k === 2) break; }
      g.beginPath(); g.arc(S(280), S(420), S(54), 0, 7); g.stroke(); texto("?", 266, 440, 60, 800, 0.8); campo(M, 100, 300, 70);
    } else if (tipo === "extracto") {
      texto(T.extracto, M, 62, 20, 800); parrafo(M, 82, 160, 2, 12, 0.4); linea(M, 118, 316, 0.6);
      for (let k = 0; k < 14; k++) { barra(M, 134 + k * 26, 44, 6, 0.4); barra(M + 58, 134 + k * 26, 110 + r() * 70, 6, 0.45); const neg = r() < 0.6; texto((neg ? "−" : "+") + (40 + Math.floor(r() * 900)) + "," + (10 + Math.floor(r() * 89)), W / escala - M, 141 + k * 26, 10, neg ? 500 : 700, neg ? 0.6 : 0.9, true, "right"); linea(M, 150 + k * 26, 316, 0.12); }
      campo(270, 134 + 4 * 26 - 6, 82, 18); campo(270, 134 + 9 * 26 - 6, 82, 18);
    } else if (tipo === "formulario") {
      texto(T.formulario, M, 64, 20, 800); parrafo(M, 86, 250, 2, 12, 0.38);
      for (let k = 0; k < 5; k++) { barra(M, 132 + k * 58, 70 + r() * 50, 6, 0.55); caja(M, 144 + k * 58, 316, 30, 0.35); if (r() < 0.7) barra(M + 10, 156 + k * 58, 90 + r() * 150, 7, 0.7); }
      campo(M, 144, 316, 30); campo(M, 144 + 58, 316, 30);
      for (let k = 0; k < 3; k++) { caja(M + k * 104, 440, 14, 14, 0.55); if (k === 1) barra(M + k * 104 + 3, 443, 8, 8, 0.85); barra(M + 22 + k * 104, 444, 56, 6, 0.4); }
      g.fillStyle = tinta(0.86); g.beginPath(); g.roundRect(S(M), S(478), S(120), S(32), S(16)); g.fill();
    } else if (tipo === "grafico") {
      texto(T.grafico, M, 62, 20, 800); barra(M, 78, 110, 6, 0.4);
      linea(M, 330, 316, 0.6); const hs = [70, 104, 86, 140, 122, 178, 160, 214]; hs.forEach((h, k) => barra(M + 8 + k * 39, 330 - h, 26, h, k === 7 ? 0.9 : 0.42 + k * 0.03)); campo(M + 8 + 7 * 39 - 3, 330 - 214 - 3, 32, 217);
      for (let k = 0; k < 3; k++) { caja(M + k * 108, 360, 100, 66, 0.3); barra(M + 12 + k * 108, 376, 50, 6, 0.4); texto(["+18 %", "312", "9,4 d"][k], M + 12 + k * 108, 412, 17, 800, 0.9, true); }
      parrafo(M, 452, 316, 3, 14, 0.36);
    } else if (tipo === "pedido") {
      texto(T.pedido, M, 64, 22, 800); texto("#2291", W / escala - M, 62, 12, 500, 0.75, true, "right"); campo(W / escala - M - 46, 48, 48, 18);
      for (let k = 0; k < 5; k++) { caja(M, 92 + k * 62, 46, 46, 0.3); barra(M + 8, 100 + k * 62, 30, 30, 0.18); barra(M + 60, 100 + k * 62, 130 + r() * 80, 7, 0.6); barra(M + 60, 116 + k * 62, 80, 5, 0.35); texto("×" + (1 + Math.floor(r() * 9)), W / escala - M, 118 + k * 62, 12, 600, 0.8, true, "right"); }
      barra(M, 420, 316, 2, 0.8); barra(M, 440, 90, 8, 0.6); barra(M, 462, 140, 6, 0.35); g.fillStyle = tinta(0.86); g.beginPath(); g.roundRect(S(238), S(436), S(112), S(34), S(17)); g.fill();
    } else if (tipo === "informe") {
      barra(M, 40, 316, 3, 0.9); texto(T.informe, M, 78, 22, 800); barra(M, 92, 150, 6, 0.4);
      parrafo(M, 124, 150, 9, 13, 0.4); parrafo(200, 124, 150, 9, 13, 0.4);
      g.strokeStyle = tinta(0.8); g.lineWidth = S(2); g.beginPath(); let yy = 330; g.moveTo(S(M), S(yy)); for (let x = 1; x <= 12; x++) { yy += (r() - 0.62) * 26; g.lineTo(S(M + x * 26.3), S(yy)); } g.stroke(); linea(M, 350, 316, 0.5); campo(M, 260, 316, 92);
      parrafo(M, 380, 316, 5, 14, 0.38); texto("3 / 12", W / escala - M, 506, 9, 500, 0.5, true, "right");
    } // «blanco»: papel limpio, lo que queda por construir
    g.restore(); gm.restore();
  });

  // un canal para lo impreso (R) y otro para los campos (G)
  const img = g.getImageData(0, 0, c.width, c.height), mk = gm.getImageData(0, 0, c.width, c.height), d = img.data, e = mk.data;
  for (let i = 0; i < d.length; i += 4) { d[i + 1] = e[i]; d[i + 2] = d[i]; d[i + 3] = 255; }
  g.putImageData(img, 0, 0);
  return { lienzo: c, cols: COLS, filas: FILAS };
}
