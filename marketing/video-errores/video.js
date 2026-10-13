// «Los errores que no avisan» · vídeo divulgativo de D-Code Partners.
// Animación determinista: pintaFrame(n) dibuja el fotograma n. Los tiempos salen de la locución (voz.json).
const Q = new URLSearchParams(location.search);
const CAPTURA = Q.has('captura'), PORTADA = Q.has('portada');
const V = await (await fetch('voz.json')).json();
const F = V.frases, SUBS = V.subs, FPS = 30;
const T_LOGO = F[18].t1 + 0.35, FIN = T_LOGO + 2.5;
window.META = { fps: FPS, duracion: FIN };

// ── utilidades ──
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const r = (t, a, b) => clamp((t - a) / (b - a));
const eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const eout = (x) => 1 - Math.pow(1 - x, 3);
const eback = (x) => { const c1 = 1.7, c3 = c1 + 1; return x <= 0 ? 0 : 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const $ = (s) => document.querySelector(s);
const css = (el, o) => { for (const k in o) el.style[k] = o[k]; };
const miles = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const hash = (a, b = 0) => { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

// ── escenas (cortes) ──
const E = {
  gancho: 0, excel: F[2].t0 - 0.05, demo: F[3].t0 - 0.3, estudio: F[6].t0 - 0.15, renombre: F[8].t0 - 0.2,
  filas: F[9].t0 - 0.25, vacio: F[11].t0, calma: F[12].t0 - 0.25, leccion: F[15].t0 - 0.15, truco: F[17].t0 - 0.2,
  cierre: F[18].t0 - 0.2, logo: T_LOGO, fin: FIN,
};
const ORDEN = Object.keys(E);
const escenaEn = (t) => { let e = 'gancho'; for (const k of ORDEN) if (k !== 'fin' && t >= E[k]) e = k; return e; };

// ── hoja de cálculo genérica (no es ningún producto concreto) ──
const lienzo = $('#hoja'), g = lienzo.getContext('2d');
const W = 1600, H = 2600, CW = 250, RH = 66, HW = 108, HH = 56;
const PAPEL = '#F4F4F1', TINTA = '#141414', ROJO = '#E5484D', LINEA = '#DADBD5', CAB = '#EAEAE6';
const letra = (c) => String.fromCharCode(65 + c);
function hoja(cam, celda, op = {}) {
  const { x, y, s } = cam, cols = op.cols ?? 26, filas = op.filas ?? 1e7, f0 = op.f0 ?? 0;
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1;
  g.fillStyle = op.fondo || PAPEL; g.fillRect(0, 0, W, H);
  const X = (wx) => (wx - x) * s + W / 2, Y = (wy) => (wy - y) * s + H / 2;
  const wx0 = x - W / 2 / s, wx1 = x + W / 2 / s, wy0 = y - H / 2 / s, wy1 = y + H / 2 / s;
  const c0 = Math.max(0, Math.floor(wx0 / CW)), c1 = Math.min(cols, Math.ceil(wx1 / CW));
  const r0 = Math.max(0, Math.floor(wy0 / RH)), r1 = Math.min(filas, Math.ceil(wy1 / RH));
  const fondoX1 = Math.min(X(cols * CW), W), fondoY1 = Math.min(Y(filas * RH), H);
  g.fillStyle = '#fff'; g.fillRect(Math.max(0, X(-HW)), Math.max(0, Y(-HH)), fondoX1 - Math.max(0, X(-HW)), fondoY1 - Math.max(0, Y(-HH)));
  // celdas
  for (let rr = r0; rr < r1; rr++) for (let c = c0; c < c1; c++) {
    const d = celda(c, rr); if (!d) continue;
    if (d.bg) { g.fillStyle = d.bg; g.fillRect(X(c * CW), Y(rr * RH), CW * s, RH * s); }
  }
  // rejilla
  g.strokeStyle = LINEA; g.lineWidth = Math.max(1, Math.min(2.2, s * 1.2)); g.beginPath();
  for (let c = c0; c <= c1; c++) { const px = Math.round(X(c * CW)) + 0.5; g.moveTo(px, Math.max(0, Y(0))); g.lineTo(px, fondoY1); }
  for (let rr = r0; rr <= r1; rr++) { const py = Math.round(Y(rr * RH)) + 0.5; g.moveTo(Math.max(0, X(0)), py); g.lineTo(fondoX1, py); }
  g.stroke();
  // textos
  g.textBaseline = 'middle';
  for (let rr = r0; rr < r1; rr++) for (let c = c0; c < c1; c++) {
    const d = celda(c, rr); if (!d || !d.t) continue;
    const tam = (d.tam || 30) * s; if (tam < 5) continue;
    g.globalAlpha = d.a ?? 1; g.fillStyle = d.col || TINTA; g.font = `${d.peso || 500} ${tam}px ${d.fuente || 'GeistMono'}`;
    g.textAlign = d.al === 'der' ? 'right' : 'left';
    g.fillText(d.t, d.al === 'der' ? X((c + 1) * CW - 16) : X(c * CW + 16), Y(rr * RH + RH / 2 + 1));
    if (d.caret) { const w = g.measureText(d.t).width; g.fillStyle = TINTA; g.fillRect(X(c * CW + 16) + w + 3 * s, Y(rr * RH + 14), 3 * s, (RH - 28) * s); }
    g.globalAlpha = 1;
  }
  // cabeceras
  const tamCab = 26 * s;
  if (Y(0) > 0) { g.fillStyle = CAB; g.fillRect(Math.max(0, X(-HW)), Math.max(0, Y(-HH)), fondoX1 - Math.max(0, X(-HW)), Y(0) - Math.max(0, Y(-HH)));
    if (tamCab > 5) { g.fillStyle = '#6E6F6A'; g.font = `500 ${tamCab}px Geist`; g.textAlign = 'center';
      for (let c = c0; c < c1; c++) { if (op.colSel === c) { g.fillStyle = TINTA; g.fillRect(X(c * CW), Y(-HH), CW * s, HH * s); g.fillStyle = '#fff'; } else g.fillStyle = '#6E6F6A'; g.fillText(letra(c), X(c * CW + CW / 2), Y(-HH / 2)); } } }
  if (X(0) > 0) { g.fillStyle = CAB; g.fillRect(Math.max(0, X(-HW)), Math.max(0, Y(-HH)), X(0) - Math.max(0, X(-HW)), fondoY1 - Math.max(0, Y(-HH)));
    if (tamCab > 5) { g.textAlign = 'center'; g.font = `500 ${(op.tamFila || 26) * s}px GeistMono`;
      for (let rr = r0; rr < r1; rr++) { g.fillStyle = op.filaCol?.(rr) || '#6E6F6A'; g.fillText(miles(rr + 1 + f0), X(-HW / 2), Y(rr * RH + RH / 2 + 1)); } } }
  if (X(0) > 0 && Y(0) > 0) { g.fillStyle = '#E2E2DD'; g.fillRect(X(-HW), Y(-HH), HW * s, HH * s); }
  g.strokeStyle = '#CFCFC9'; g.lineWidth = 1.5; g.beginPath();
  if (Y(0) > 0) { g.moveTo(0, Y(0)); g.lineTo(fondoX1, Y(0)); }
  if (X(0) > 0) { g.moveTo(X(0), 0); g.lineTo(X(0), fondoY1); }
  g.stroke();
  // selección
  for (const sel of op.sel || []) { g.strokeStyle = sel.col || TINTA; g.lineWidth = sel.w || 5; g.globalAlpha = sel.a ?? 1;
    const pad = sel.pad || 0; g.strokeRect(X(sel.c * CW) - pad, Y(sel.r * RH) - pad, (sel.n || 1) * CW * s + 2 * pad, (sel.m || 1) * RH * s + 2 * pad); g.globalAlpha = 1; }
  return { X, Y };
}
const inclina = (rx, rz = 0, esc = 1, op = 1) => css(lienzo, { transform: `rotateX(${rx}deg) rotateZ(${rz}deg) scale(${esc})`, opacity: op });
// ancla: coordenadas del mundo que quedan en un punto de la pantalla (sin inclinación)
const camEn = (wx, wy, s, sx, sy) => ({ x: wx - (sx - 540) / s, y: wy - (sy - 960) / s, s });

// ── datos ──
const GENES = [...Array.from({ length: 14 }, (_, i) => 'SEPT' + (i + 1)), ...Array.from({ length: 11 }, (_, i) => 'MARCH' + (i + 1))];
const aFecha = (gname) => { const m = gname.match(/^(SEPT|MARCH)(\d+)$/); return m ? `${m[2]}-${m[1] === 'SEPT' ? 'Sep' : 'Mar'}` : gname; };
const num = (c, rr, d = 2) => (hash(c, rr) * (c === 2 ? 0.05 : 3)).toFixed(c === 2 ? 3 : d);

// ── referencias DOM ──
const subEl = $('#sub'), subTxt = $('#subtxt');
const CLAVE = /(2020|27 genes|Excel|MARCH1|fecha|2016|3\.600|cinco|16\.000|filas|falló|no dan error|no avisan|Texto|nunca avisa|nadie)/g;
const lastSub = { t: '' };
function pintaSub(t, oculto) {
  const s = SUBS.find((x) => t >= x.t0 - 0.04 && t < x.t1 + 0.12);
  const k = s ? Math.min(r(t, s.t0 - 0.04, s.t0 + 0.08), 1 - r(t, s.t1 + 0.02, s.t1 + 0.12)) : 0;
  if (s && s.texto !== lastSub.t) { subTxt.innerHTML = s.texto.replace(CLAVE, '<em>$1</em>'); lastSub.t = s.texto; }
  css(subEl, { opacity: oculto ? 0 : k, transform: `translateY(${(1 - eout(r(t, s?.t0 - 0.04, s?.t0 + 0.12))) * 14}px)` });
}
const fuente = $('#fuente');
function ponFuente(html, t, a, b) { const k = Math.min(r(t, a, a + 0.3), 1 - r(t, b - 0.25, b)); if (k > 0) fuente.innerHTML = html; fuente.style.opacity = k; }

// ── pinta un instante ──
function pinta(t) {
  const esc = escenaEn(t);
  // estado por defecto de las capas
  for (const id of ['#fx', '#recre', '#menu', '#excel', '#cifra', '#cifraSub', '#quinto', '#renombre', '#positivos', '#positivosSub', '#contador', '#fr1', '#fr2', '#marca']) $(id).style.opacity = 0;
  $('#negro').style.opacity = 0; $('#sombraSup').style.opacity = 0; fuente.style.opacity = 0; inclina(0);
  let subOculto = false, oscuro = false;

  if (esc === 'gancho') {
    const tEnt = 0.95, tip = 'MARCH1', nT = Math.max(1, Math.ceil(tip.length * r(t, 0.0, 0.7)));
    const conv = (rr) => { if (rr === 15) return t >= tEnt; return t >= 1.55 + Math.abs(rr - 15) * 0.085; };
    const celda = (c, rr) => {
      if (rr === 0) return { t: ['Gen', 'Muestra A', 'Muestra B', 'p-valor', 'Ratio'][c] || '', peso: 650, fuente: 'Geist', col: '#3a3a3a' };
      if (rr > 25) return null;
      const gname = GENES[rr - 1];
      if (c === 0) {
        if (rr === 15 && t < tEnt) return { t: tip.slice(0, nT), caret: Math.floor(t * 4) % 2 === 0 || t < 0.75, peso: 600 };
        const cv = conv(rr), fl = cv ? 1 - r(t, (rr === 15 ? tEnt : 1.55 + Math.abs(rr - 15) * 0.085), (rr === 15 ? tEnt : 1.55 + Math.abs(rr - 15) * 0.085) + 0.5) : 0;
        return { t: cv ? aFecha(gname) : gname, al: cv ? 'der' : 'izq', peso: 600, col: cv ? TINTA : '#3a3a3a', bg: fl > 0 ? `rgba(229,72,77,${0.22 * fl})` : null };
      }
      if (c <= 4) return { t: num(c, rr), al: 'der', col: '#55564f' };
      return null;
    };
    const k = eio(r(t, 1.15, 4.3)), deriva = r(t, 4.3, E.excel);
    const s = lerp(4.4, 1.05, k) * (1 - 0.06 * deriva);
    const ancla = [lerp(CW * 0.5, CW * 1.9, k), lerp(15.5 * RH, 13 * RH, k) + deriva * 60];
    const cam = camEn(ancla[0], ancla[1], s, lerp(560, 540, k), lerp(900, 930, k));
    hoja(cam, celda, { cols: 8, filas: 40, sel: [{ c: 0, r: t < tEnt ? 15 : 16, w: 6 }] });
    inclina(lerp(0, 34, k) + deriva * 4, lerp(0, -7, k) - deriva * 2, lerp(1, 1.06, k));
  }

  if (esc === 'excel') {
    const cam = { x: CW * 2, y: RH * 12, s: 0.9 };
    hoja(cam, (c, rr) => (rr > 0 && rr < 26 && c === 0 ? { t: aFecha(GENES[rr - 1]), al: 'der', peso: 600 } : null), { cols: 8, filas: 40 });
    inclina(34, -7, 1.06, 0.25);
    const k = eout(r(t, E.excel, E.excel + 0.25));
    css($('#excel'), { opacity: k, transform: `scale(${lerp(1.12, 1, k)})` }); subOculto = true;
  }

  if (esc === 'demo') {
    const tEsc = F[3].t0 + 0.5, tEnter = F[4].t0 + 0.3, tip = 'MARCH1';
    const nT = Math.round(tip.length * r(t, tEsc, tEsc + 0.75));
    const hecho = t >= tEnter;
    const s = lerp(2.0, 2.2, r(t, E.demo, E.estudio));
    const cam = camEn(-HW, -HH, s, 60, 520);
    const pulso = hecho ? 1 - r(t, tEnter + 0.1, tEnter + 1.4) : 0;
    hoja(cam, (c, rr) => { if (c === 0 && rr === 0) return hecho ? { t: '1-Mar', al: 'der', peso: 600, bg: `rgba(229,72,77,${0.18 * pulso})` } : { t: tip.slice(0, nT), caret: nT > 0, peso: 600 }; return null; },
      { cols: 8, filas: 40, sel: [{ c: 0, r: 0, w: 6 }, ...(pulso > 0 ? [{ c: 0, r: 0, col: ROJO, w: 6, pad: 10 + 14 * (1 - pulso), a: pulso }] : [])] });
    const kf = eout(r(t, E.demo, E.demo + 0.35));
    css($('#fx'), { opacity: kf, transform: `translateY(${(1 - kf) * -20}px)` }); $('#recre').style.opacity = kf;
    $('#fxtxt').textContent = hecho ? '3/1/2026' : tip.slice(0, nT); $('#fxref').textContent = 'A1';
    $('#fxcaret').style.display = !hecho && Math.floor(t * 4) % 2 === 0 ? 'inline-block' : 'none';
  }

  if (esc === 'estudio') {
    const N = 3597, CO = 72, FI = 50, P = 14, X0 = 540 - (CO * P) / 2 + 260, Y0 = 560 + 340;
    const tIn = E.estudio, kz = eout(r(t, tIn, tIn + 0.7));
    const nVis = Math.round(N * eout(r(t, tIn + 0.15, F[6].t1 - 0.4)));
    const tRojo = F[7].t0 + 0.05;
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = PAPEL; g.fillRect(0, 0, W, H);
    const zoom = lerp(9, 1, kz), cx = X0 + (CO * P) / 2, cy = Y0 + (FI * P) / 2;
    g.translate(cx, cy); g.scale(zoom, zoom); g.translate(-cx, -cy);
    for (let i = 0; i < N; i++) {
      const c = i % CO, rr = Math.floor(i / CO), x = X0 + c * P, y = Y0 + rr * P;
      const rojo = hash(i, 7) < 0.2 && t > tRojo + hash(i, 3) * 0.9;
      g.fillStyle = i < nVis ? (rojo ? ROJO : '#2B2B2A') : '#E3E3DE';
      g.fillRect(x, y, P - 3, P - 3);
    }
    const kq = r(t, F[7].t0 - 0.1, F[7].t0 + 0.25);
    $('#cifra').textContent = miles(nVis);
    css($('#cifra'), { opacity: 1 - kq }); css($('#cifraSub'), { opacity: r(t, tIn + 0.3, tIn + 0.6) * (1 - kq) });
    css($('#quinto'), { opacity: kq, transform: `scale(${lerp(1.15, 1, eout(kq))})` });
    ponFuente('Fuente: <b>Ziemann, Eren y El-Osta</b> · Genome Biology, 2016', t, tIn + 0.4, E.renombre);
  }

  if (esc === 'renombre') {
    const cam = { x: CW * 2, y: RH * 8, s: 2.6 };
    hoja(cam, (c, rr) => (rr > 0 && c < 4 ? { t: c === 0 ? GENES[(rr * 3) % 25] : '', a: 0.5 } : null), { cols: 8, filas: 40 });
    inclina(0, 0, 1, 0.35);
    const t0 = F[8].t0, k = eout(r(t, E.renombre, E.renombre + 0.3));
    css($('#renombre'), { opacity: k, transform: `translateY(${(1 - k) * 30}px)` });
    $('#v1').style.setProperty('--k', eout(r(t, t0 + 0.25, t0 + 0.55))); $('#v2').style.setProperty('--k', eout(r(t, t0 + 1.25, t0 + 1.55)));
    const n1 = 'MARCHF1', n2 = 'SEPTIN1';
    $('#n1').textContent = n1.slice(0, Math.round(n1.length * r(t, t0 + 0.55, t0 + 1.1)));
    $('#n2').textContent = n2.slice(0, Math.round(n2.length * r(t, t0 + 1.55, t0 + 2.1)));
    $('#c1').style.opacity = t > t0 + 0.5 && t < t0 + 1.25 ? 1 : 0; $('#c2').style.opacity = t > t0 + 1.5 && (t < t0 + 2.3 || Math.floor(t * 3) % 2 === 0) ? 1 : 0;
    ponFuente('Fuente: <b>HGNC</b> · Bruford et al., Nature Genetics, 2020', t, E.renombre + 0.3, E.filas);
  }

  if (esc === 'filas' || esc === 'vacio') {
    const ULT = 65536, tA = E.filas + 0.2, tB = F[10].t1 + 0.05;
    const k = eio(r(t, tA, tB)), fila = esc === 'vacio' ? ULT : Math.max(1, Math.round(Math.exp(Math.log(ULT) * k)));
    const fecha = (rr) => ['25/09', '26/09', '27/09', '28/09', '29/09', '30/09', '01/10', '02/10'][Math.floor(rr / 8192) % 8];
    const celda = (c, rr) => {
      if (rr === 0) return { t: ['ID prueba', 'Fecha', 'Resultado', 'Área'][c] || '', fuente: 'Geist', peso: 650, col: '#3a3a3a' };
      const p = hash(rr, c) < 0.32;
      if (c === 0) return { t: 'T' + (1000000 + ((rr * 7919) % 8999999)), col: '#55564f' };
      if (c === 1) return { t: fecha(rr), al: 'der', col: '#55564f' };
      if (c === 2) return { t: p ? 'Positivo' : 'Negativo', fuente: 'Geist', peso: p ? 650 : 450, col: p ? ROJO : '#77786f' };
      if (c === 3) return { t: 'E0' + (6000000 + ((rr * 104729) % 999999)), col: '#55564f' };
      return null;
    };
    const tV = E.vacio, kv = esc === 'vacio' ? eio(r(t, tV, tV + 1.2)) : 0;
    const cam = esc === 'vacio' ? camEn(318, ULT * RH, 0.92, 540, lerp(1150, 760, kv)) : camEn(318, (fila - 0.5) * RH, 0.92, 540, 1150);
    const { X, Y } = hoja(cam, celda, { cols: 4, filas: ULT, fondo: '#141414', tamFila: 30, filaCol: (rr) => (rr === ULT - 1 && esc === 'vacio' ? ROJO : '#6E6F6A') });
    if (esc === 'vacio') {
      // filas nuevas que ya no caben: caen al vacío
      g.save();
      for (let j = 0; j < 9; j++) {
        const ts = tV + 0.1 + j * 0.2, dt = t - ts; if (dt < 0) continue;
        const caida = 0.5 * 2600 * dt * dt, rot = (hash(j, 1) - 0.5) * 0.5 * dt, a = clamp(1 - dt / 1.3);
        const y0 = Y(ULT * RH) + 10 + caida, x0 = X(-HW);
        g.globalAlpha = a; g.translate(x0 + (CW * 4 + HW) * 1.05 / 2, y0 + RH * 0.5); g.rotate(rot); g.translate(-(x0 + (CW * 4 + HW) * 1.05 / 2), -(y0 + RH * 0.5));
        g.fillStyle = '#fff'; g.fillRect(x0, y0, (CW * 4 + HW) * 1.05, RH * 1.05 - 2);
        g.fillStyle = '#9a9b95'; g.font = '500 23px GeistMono'; g.textAlign = 'center'; g.fillText(miles(ULT + 1 + j), x0 + HW * 0.52, y0 + RH * 0.53);
        g.textAlign = 'left'; g.fillStyle = ROJO; g.font = '650 31px Geist'; g.fillText('Positivo', x0 + (HW + 2 * CW + 16) * 1.05, y0 + RH * 0.53);
        g.setTransform(1, 0, 0, 1, 0, 0);
      }
      g.restore();
      // borde final de la hoja
      g.fillStyle = 'rgba(229,72,77,.9)'; g.fillRect(X(-HW), Y(ULT * RH) - 3, (CW * 4 + HW) * 1.05, 6);
    }
    $('#sombraSup').style.opacity = 1;
    inclina(lerp(46, 30, kv), -3, 1.0);
    css($('#contador'), { opacity: r(t, E.filas + 0.1, E.filas + 0.4) }); $('#nfila').textContent = miles(fila);
    $('#nfila').style.color = fila === ULT ? ROJO : '#fff';
    const kp = r(t, SUBS[13].t0 - 0.1, SUBS[13].t0 + 0.25) * (1 - r(t, F[10].t0 - 0.2, F[10].t0 + 0.1));
    css($('#positivos'), { opacity: kp, transform: `scale(${lerp(1.1, 1, eout(kp))})` }); css($('#positivosSub'), { opacity: kp });
    $('#contador').style.opacity = Math.min(r(t, E.filas + 0.1, E.filas + 0.4), 1 - kp);
    ponFuente('Fuente: <b>Public Health England</b> (oct. 2020), vía BBC y The Register', t, E.filas + 0.4, E.calma);
    oscuro = true;
  }

  if (esc === 'calma') {
    const tc = E.calma, tf = E.leccion, k = eio(r(t, tc + 1.2, tf - 0.3));
    const celda = (c, rr) => {
      if (rr === 0) return { t: ['Gen', 'Fecha', 'Valor', 'Ratio', 'Código', 'Lote', 'Valor', 'Ratio'][c % 8], fuente: 'Geist', peso: 650, col: '#3a3a3a' };
      if (c === 1 && rr === 9) return { t: '1-Mar', al: 'der', peso: 600 };
      if (c % 4 === 0) return { t: GENES[(rr * 7 + c) % 25].replace(/^(SEPT|MARCH)/, (m) => (hash(rr, c) < 0.5 ? m : 'GEN')), col: '#55564f' };
      if (c % 4 === 1) return { t: `${1 + Math.floor(hash(rr, c) * 28)}-${['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'][Math.floor(hash(c, rr) * 6)].replace('Ene', 'Jan').replace('Abr', 'Apr')}`, al: 'der', col: '#55564f' };
      return { t: num(c % 5, rr), al: 'der', col: '#55564f' };
    };
    const s = lerp(2.3, 0.3, k);
    const cam = camEn(CW * 1.5, RH * 9.5, s, 540, 860);
    const anillo = 1 - r(t, tc + 0.6, tc + 1.6);
    hoja(cam, celda, { cols: 30, filas: 120, sel: anillo > 0 ? [{ c: 1, r: 9, col: ROJO, w: 6, pad: 8, a: anillo }] : [] });
    inclina(lerp(0, 22, k), lerp(0, -5, k), 1.04);
  }

  if (esc === 'leccion') {
    $('#negro').style.opacity = 1; subOculto = true;
    const k1 = eout(r(t, F[15].t0 - 0.05, F[15].t0 + 0.4)), k2 = eout(r(t, F[16].t0 - 0.05, F[16].t0 + 0.4));
    css($('#fr1'), { opacity: k1, transform: `translateY(${(1 - k1) * 40}px)` }); css($('#fr2'), { opacity: k2, transform: `translateY(${(1 - k2) * 40}px)` });
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#0F0F10'; g.fillRect(0, 0, W, H);
  }

  if (esc === 'truco') {
    const t0 = F[17].t0, tSel = t0 + 0.15, tMenu = t0 + 0.7, tTexto = t0 + 1.35, tCierra = t0 + 1.9, tPega = SUBS[23].t0 + 1.0;
    const pegado = t >= tPega, ok = r(t, tPega + 0.3, tPega + 0.6);
    const cam = camEn(-HW, -HH, 2.0, 60, 520);
    const PEG = ['MARCH1', 'SEPT2', 'MARCH5', 'SEPT9'];
    hoja(cam, (c, rr) => (c === 0 && rr < 4 && pegado ? { t: PEG[rr], peso: 600, bg: t > tSel ? 'rgba(20,20,20,.05)' : null } : c === 0 && t > tSel ? { bg: 'rgba(20,20,20,.05)' } : null),
      { cols: 8, filas: 40, colSel: t > tSel ? 0 : -1, sel: t > tSel ? [{ c: 0, r: 0, w: 5, m: 40 }] : [] });
    if (ok > 0) { // marca de verificación junto a los valores
      const { X, Y } = { X: (wx) => (wx - cam.x) * cam.s + W / 2, Y: (wy) => (wy - cam.y) * cam.s + H / 2 };
      g.globalAlpha = ok; g.strokeStyle = '#1F8A4C'; g.lineWidth = 9; g.lineCap = 'round'; g.lineJoin = 'round';
      for (let rr = 0; rr < 4; rr++) { const cx = X(CW + 40), cy = Y(rr * RH + RH / 2); g.beginPath(); g.moveTo(cx - 14, cy + 1); g.lineTo(cx - 3, cy + 12); g.lineTo(cx + 17, cy - 12); g.stroke(); }
      g.globalAlpha = 1;
    }
    const kf = eout(r(t, E.truco, E.truco + 0.35));
    css($('#fx'), { opacity: kf }); $('#recre').style.opacity = kf; $('#recre').textContent = 'Recreación';
    $('#fxref').textContent = 'A1'; $('#fxtxt').textContent = pegado ? 'MARCH1' : ''; $('#fxcaret').style.display = 'none';
    const km = eback(r(t, tMenu, tMenu + 0.3)) * (1 - r(t, tCierra, tCierra + 0.15));
    css($('#menu'), { opacity: clamp(km), transform: `scale(${0.9 + 0.1 * clamp(km)})`, transformOrigin: '0 0' });
    $('#mTexto').classList.toggle('on', t > tTexto);
  } else $('#recre').textContent = 'Recreación · Excel en inglés';

  if (esc === 'cierre' || esc === 'logo') {
    const tc = E.cierre, kl = eio(r(t, E.logo, E.logo + 0.8));
    const s = lerp(2.3, 2.7, r(t, tc, E.logo)) * lerp(1, 0.7, kl);
    const cam = camEn(CW * 2.5, RH * 6.5, s, 540, 900);
    const caret = Math.floor((t - tc) * 2.2) % 2 === 0 && esc === 'cierre';
    hoja(cam, (c, rr) => (c === 2 && rr === 6 ? { t: '', caret } : null), { cols: 8, filas: 40, sel: esc === 'cierre' ? [{ c: 2, r: 6, w: 4 }] : [] });
    if (caret) { const X = (wx) => (wx - cam.x) * cam.s + W / 2, Y = (wy) => (wy - cam.y) * cam.s + H / 2; g.fillStyle = TINTA; g.fillRect(X(2 * CW + 16), Y(6 * RH + 14), 3 * s, (RH - 28) * s); }
    inclina(0, 0, 1, 1 - kl * 0.85);
    if (esc === 'logo') { const km = eout(r(t, E.logo + 0.25, E.logo + 0.9)); css($('#marca'), { opacity: km, transform: `translateY(${(1 - km) * 24}px)` }); }
  }

  pintaSub(t, subOculto || PORTADA);
  if (PORTADA) $('#portada').style.display = 'block';
}

await Promise.all(['500 30px GeistMono', '600 30px GeistMono', '700 30px GeistMono', '500 30px Geist', '650 30px Geist', '700 60px Bricolage'].map((f) => document.fonts.load(f)));
await document.fonts.ready;
window.pintaFrame = (n) => pinta(PORTADA ? Number(Q.get('t') || 1.2) : n / FPS);
if (PORTADA) pinta(Number(Q.get('t') || 1.2));
else if (!CAPTURA) { const t0 = performance.now() - Number(Q.get('t') || 0) * 1000; const bucle = () => { pinta(((performance.now() - t0) / 1000) % FIN); requestAnimationFrame(bucle); }; bucle(); }
else pinta(0);
window.LISTO = true;
