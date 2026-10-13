// «Una cita contigo» · vídeo divulgativo de D-Code Partners sobre las intenciones de implementación.
// Animación determinista: pintaFrame(n) dibuja el fotograma n. Los tiempos salen de la locución (voz.json).
const Q = new URLSearchParams(location.search);
const CAPTURA = Q.has('captura'), PORTADA = Q.has('portada');
const V = await (await fetch('voz.json')).json();
const F = V.frases, SUBS = V.subs, FPS = 30;
const T_LOGO = F[17].t1 + 0.3, FIN = T_LOGO + 2.3;
window.META = { fps: FPS, duracion: FIN };

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const r = (t, a, b) => clamp((t - a) / (b - a));
const eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const eout = (x) => 1 - Math.pow(1 - x, 3);
const eback = (x) => { const c1 = 1.8, c3 = c1 + 1; return x <= 0 ? 0 : 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const $ = (s) => document.querySelector(s);
const css = (el, o) => { for (const k in o) el.style[k] = o[k]; };
const hash = (a, b = 0) => { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const sub = (i) => SUBS[i];
const subIdx = (texto) => SUBS.findIndex((s) => s.texto.startsWith(texto));

// ── escenas ──
const E = { gancho: 0, personas: F[1].t0 - 0.2, grupos: F[3].t0 - 0.1, frase: F[6].t0 - 0.15, resultado: F[7].t0 - 0.25, noventa: F[9].t0 - 0.1,
  ganas: F[11].t0 - 0.2, estudios: F[13].t0 - 0.2, tu: F[14].t0 - 0.2, final: F[16].t0 - 0.2, logo: T_LOGO };
const ORDEN = Object.keys(E);
const escenaEn = (t) => { let e = 'gancho'; for (const k of ORDEN) if (t >= E[k]) e = k; return e; };

// ── 248 personas ──
const cv = $('#puntos'), g = cv.getContext('2d');
const N = 248, GR = (i) => (i < 83 ? 0 : i < 166 ? 1 : 2), IDX = (i) => (i < 83 ? i : i < 166 ? i - 83 : i - 166);
const posA = (i) => { const c = i % 16, f = Math.floor(i / 16); return [540 + (c - 7.5) * 52, 700 + f * 52]; };
const posB = (i) => { const gr = GR(i), k = IDX(i), c = k % 6, f = Math.floor(k / 6); return [[210, 540, 870][gr] + (c - 2.5) * 42, 730 + f * 23.5 * 1.4]; };
// quién entrena cada semana (determinista): ~37 % del grupo 1, ~35 % del grupo 2, 91 % del grupo 3
const orden = Array.from({ length: N }, (_, i) => i).sort((a, b) => hash(a, 3) - hash(b, 3));
const entrena = new Array(N).fill(false), cupo = [31, 29, 75], cuenta = [0, 0, 0];
for (const i of orden) { const gr = GR(i); if (cuenta[gr] < cupo[gr]) { entrena[i] = true; cuenta[gr]++; } }
function persona(x, y, s, col, a) {
  g.globalAlpha = a; g.fillStyle = col;
  g.beginPath(); g.arc(x, y - 7 * s, 6.2 * s, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.roundRect(x - 8.5 * s, y + 0.5 * s, 17 * s, 12 * s, [8 * s, 8 * s, 3 * s, 3 * s]); g.fill();
}

// ── rejilla de 94 pruebas ──
const rej = $('#rejilla'); for (let i = 0; i < 94; i++) rej.appendChild(document.createElement('i'));
const celdas = [...rej.children];

// ── subtítulos ──
const subEl = $('#sub'), subTxt = $('#subtxt');
const CLAVE = /(una sola frase|triplicó|248|tres grupos|una frase|uno de cada tres|no cambió nada|91 %|cuándo|dónde|cien estudios|el día, la hora|el lugar|aplazando)/g;
let ultimo = '';
function pintaSub(t, oculto) {
  const s = SUBS.find((x) => t >= x.t0 - 0.04 && t < x.t1 + 0.12);
  const k = s ? Math.min(r(t, s.t0 - 0.04, s.t0 + 0.08), 1 - r(t, s.t1 + 0.02, s.t1 + 0.12)) : 0;
  if (s && s.texto !== ultimo) { subTxt.innerHTML = s.texto.replace(CLAVE, '<em>$1</em>'); ultimo = s.texto; }
  css(subEl, { opacity: oculto ? 0 : k, transform: `translateY(${s ? (1 - eout(r(t, s.t0 - 0.04, s.t0 + 0.12))) * 14 : 0}px)` });
}
const fuente = $('#fuente');
const ponFuente = (html, t, a, b, claro) => { const k = Math.min(r(t, a, a + 0.3), 1 - r(t, b - 0.25, b)); if (k > 0) { fuente.innerHTML = html; fuente.classList.toggle('claro', !!claro); } fuente.style.opacity = k; };
const aparece = (el, t, a, d = 0.4, dy = 40, fuera = 1e9) => { const k = eout(r(t, a, a + d)) * (1 - r(t, fuera, fuera + 0.25)); css(el, { opacity: k, transform: `translateY(${(1 - k) * dy}px)` }); return k; };
const escribe = (el, txt, t, a, b) => { el.textContent = txt.slice(0, Math.round(txt.length * r(t, a, b))); };

function pinta(t) {
  const esc = escenaEn(t);
  for (const el of document.querySelectorAll('.t,.etq,.pct,#tarjeta,#trazo,#rejilla,#plan,#marca')) el.style.opacity = 0;
  fuente.style.opacity = 0;
  let subOculto = false;
  // fondo: noche → amanecer → día
  const kAm = r(t, F[10].t0 - 0.1, F[10].t0 + 0.9), kDia = r(t, F[12].t0 - 0.2, F[12].t0 + 0.35);
  $('#amanecer').style.opacity = kAm; $('#dia').style.opacity = kDia;

  // ── personas ──
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, 1080, 1920);
  const vis = t >= E.personas && t < E.ganas + 0.4;
  if (vis) {
    const kB = eio(r(t, F[2].t0, F[2].t0 + 0.9));
    const fueraFrase = r(t, E.frase, E.frase + 0.3) * (1 - r(t, E.resultado, E.resultado + 0.35));
    const fueraGanas = r(t, E.ganas, E.ganas + 0.4);
    const activo = t < F[3].t0 - 0.05 ? -1 : t < F[4].t0 - 0.05 ? 0 : t < F[5].t0 - 0.05 ? 1 : t < F[5].t1 + 0.2 ? 2 : -1;
    const tLuz12 = SUBS[subIdx('solo uno de cada tres')].t0, tLuz3 = F[10].t0;
    for (let i = 0; i < N; i++) {
      const [ax, ay] = posA(i), [bx, by] = posB(i), d = hash(i, 9) * 0.25;
      const k = eio(r(t, F[2].t0 + d * 0.6, F[2].t0 + 0.75 + d * 0.6));
      let x = lerp(ax, bx, k), y = lerp(ay, by, k);
      const pop = eback(r(t, F[1].t0 + 0.05 + (i / N) * 1.1, F[1].t0 + 0.35 + (i / N) * 1.1));
      const gr = GR(i);
      let a = 0.32 * pop;
      if (activo >= 0) a *= gr === activo ? 2.2 : 0.55;
      const t0 = gr < 2 ? tLuz12 + hash(i, 4) * 0.5 : tLuz3 + hash(i, 5) * 0.55;
      const luz = entrena[i] ? eout(r(t, t0, t0 + 0.25)) : 0;
      let col = '#FFFFFF';
      if (luz > 0) { col = '#FFC93C'; a = lerp(a, 1, luz); }
      if (t > F[8].t0 && t < F[9].t0 && gr === 1) y += Math.sin((t - F[8].t0) * 30) * 2 * (1 - r(t, F[8].t0, F[8].t0 + 0.5));
      a *= (1 - fueraFrase * 0.88) * (1 - fueraGanas);
      const s = lerp(1.25, 1.05, kB) * (1 + 0.25 * (luz > 0 && luz < 1 ? Math.sin(Math.PI * luz) : 0));
      if (luz > 0 && a > 0.3) { g.globalAlpha = 0.25 * luz * a; g.fillStyle = '#FFC93C'; g.beginPath(); g.arc(x, y, 22 * s, 0, Math.PI * 2); g.fill(); }
      persona(x, y, s, col, clamp(a));
    }
    g.globalAlpha = 1;
    const kEt = (1 - fueraFrase) * (1 - fueraGanas);
    ['#e1', '#e2', '#e3'].forEach((id, j) => { const el = $(id), k = eout(r(t, F[2].t0 + 0.5 + j * 0.12, F[2].t0 + 0.9 + j * 0.12));
      css(el, { left: [210, 540, 870][j] - 150 + 'px', opacity: k * kEt * (activo >= 0 && activo !== j ? 0.45 : 1), transform: `translateY(${(1 - k) * 20}px) scale(${activo === j ? 1.08 : 1})` }); });
    [['#p1', 0, tLuz12 + 0.3], ['#p2', 1, tLuz12 + 0.45], ['#p3', 2, tLuz3 + 0.4]].forEach(([id, j, t0]) => {
      const el = $(id), k = eback(r(t, t0, t0 + 0.4)); css(el, { left: [210, 540, 870][j] - 150 + 'px', opacity: clamp(k) * kEt, transform: `scale(${clamp(k)})`, color: j === 2 ? '#fff' : '#FFC93C' }); });
    ponFuente('Milne, Orbell y Sheeran · <b>British Journal of Health Psychology</b>, 2002', t, F[1].t0 + 0.3, E.ganas);
  }
  if (esc === 'gancho') {
    aparece($('#hook1'), t, 0.0, 0.35, 30);
    const kt = eio(r(t, 0.35, 1.35)); css($('#trazo'), { opacity: kt > 0 ? 1 : 0 }); $('#trazoP').style.strokeDasharray = 800; $('#trazoP').style.strokeDashoffset = 800 * (1 - kt);
    const k2 = eback(r(t, SUBS[1].t0 - 0.05, SUBS[1].t0 + 0.4)); css($('#hook2'), { opacity: clamp(k2 * 2), transform: `scale(${lerp(0.6, 1, clamp(k2))})` });
    subOculto = t < SUBS[1].t0 - 0.05;
  }
  if (esc === 'personas') {
    aparece($('#lugar'), t, F[1].t0, 0.4, 20, F[2].t0 - 0.1);
    const kn = aparece($('#n248'), t, SUBS[subIdx('248')].t0 - 0.1, 0.4, 20, F[2].t0 - 0.1);
    $('#n248').textContent = Math.round(248 * eout(r(t, SUBS[subIdx('248')].t0 - 0.1, SUBS[subIdx('248')].t0 + 0.9)));
  }
  if (esc === 'grupos' || (esc === 'personas' && t > F[2].t0 - 0.1)) {
    const fases = [[F[2].t0 - 0.1, '3 grupos'], [F[3].t0 - 0.05, 'Grupo 1:<br><span style="color:#FFC93C">solo apunta</span>'], [F[4].t0 - 0.05, 'Grupo 2:<br><span style="color:#FFC93C">motivación</span>'], [F[5].t0 - 0.05, 'Grupo 3:<br><span style="color:#FFC93C">motivación + 1 frase</span>']];
    let i = 0; for (let j = 0; j < fases.length; j++) if (t >= fases[j][0]) i = j;
    const el = $('#gtit'); if (el.dataset.i !== String(i)) { el.innerHTML = fases[i][1]; el.dataset.i = i; }
    const k = eout(r(t, fases[i][0], fases[i][0] + 0.3)) * (1 - r(t, E.frase - 0.2, E.frase));
    css(el, { opacity: k, transform: `translateY(${(1 - k) * 24}px)` });
  }
  if (esc === 'frase') {
    const k = aparece($('#tarjeta'), t, E.frase, 0.45, 60, E.resultado - 0.05);
    $('#tarjeta').style.transform += ` rotate(${lerp(-4, -1.5, k)}deg)`;
    const s2 = SUBS[subIdx('el día tal')];
    escribe($('#h1'), 'martes', t, s2.t0 + 0.05, s2.t0 + 0.45); escribe($('#h2'), '7:30', t, s2.t0 + 0.75, s2.t0 + 1.05); escribe($('#h3'), 'el parque', t, s2.t0 + 1.35, s2.t0 + 1.85);
    ['#h1', '#h2', '#h3'].forEach((id) => $(id).classList.toggle('lleno', $(id).textContent.length > 0));
  }
  if (esc === 'noventa') {
    const k = eback(r(t, F[10].t0 - 0.05, F[10].t0 + 0.45));
    css($('#n91'), { opacity: clamp(k), transform: `scale(${lerp(0.7, 1, clamp(k))})` });
    $('#n91').textContent = Math.round(91 * eout(r(t, F[10].t0 - 0.05, F[10].t0 + 0.8))) + '%';
  }
  if (esc === 'ganas') {
    subOculto = true;
    aparece($('#ganas1'), t, F[11].t0 - 0.1, 0.4, 40);
    $('#ganas1').style.color = kDia > 0.5 ? '#16161D' : '#fff';
    aparece($('#ganas2'), t, F[12].t0 - 0.1, 0.45, 50);
  }
  if (esc === 'estudios') {
    const k = aparece($('#n94'), t, E.estudios, 0.4, 20); $('#n94').textContent = Math.round(94 * eout(r(t, E.estudios, F[13].t1)));
    aparece($('#n94sub'), t, E.estudios + 0.2, 0.4, 20); aparece($('#rejilla'), t, E.estudios + 0.1, 0.4, 30);
    celdas.forEach((c, i) => c.classList.toggle('ok', t > E.estudios + 0.2 + i * ((F[13].t1 - E.estudios - 0.3) / 94)));
    ponFuente('Gollwitzer y Sheeran · <b>Advances in Experimental Social Psychology</b>, 2006', t, E.estudios + 0.3, E.tu, true);
  }
  if (esc === 'tu') {
    const k = aparece($('#plan'), t, E.tu, 0.45, 60);
    const sQ = SUBS[subIdx('Así que elige')], sD = SUBS[subIdx('y escribe ahora')], sL = SUBS[subIdx('y el lugar')];
    const campos = [['#q1', 'Leer 20 minutos', sQ.t0 + 0.5, sQ.t1 + 0.6], ['#q2', 'Domingo', sD.t0 + 0.75, sD.t0 + 1.1], ['#q3', '9:00', sD.t0 + 1.35, sD.t0 + 1.6], ['#q4', 'La terraza', sL.t0 + 0.05, sL.t1 + 0.3]];
    let activoC = null;
    for (const [id, txt, a, b] of campos) { escribe($(id), txt, t, a, b); if (t >= a - 0.4) activoC = id; }
    for (const [id] of campos) { const el = $(id); if (el.querySelector('.caret')) el.querySelector('.caret').remove(); }
    if (activoC && Math.floor(t * 2.5) % 2 === 0) { const c = document.createElement('span'); c.className = 'caret'; $(activoC).appendChild(c); }
  }
  if (esc === 'final' || esc === 'logo') {
    subOculto = true;
    const kl = r(t, E.logo + 0.2, E.logo + 0.7), kf1 = r(t, E.logo - 0.1, E.logo + 0.2);
    const k1 = aparece($('#fin1'), t, F[16].t0 - 0.1, 0.4, 40); $('#fin1').style.opacity = k1 * (1 - kf1);
    const k2 = aparece($('#fin2'), t, F[17].t0 - 0.1, 0.45, 50); $('#fin2').style.transform += ` translateY(${-260 * eio(kl)}px)`;
    if (esc === 'logo') aparece($('#marca'), t, E.logo + 0.5, 0.5, 30);
  }
  pintaSub(t, subOculto || PORTADA);
  if (PORTADA) { for (const el of document.querySelectorAll('#sub,#fuente')) el.style.opacity = 0; }
}

await Promise.all(['500 30px Geist', '600 30px Geist', '700 30px Geist', '700 30px GeistMono', '800 30px GeistMono', '700 60px Bricolage', '800 60px Bricolage'].map((f) => document.fonts.load(f)));
await document.fonts.ready;
const tPortada = Number(Q.get('t') || 0);
window.pintaFrame = (n) => pinta(PORTADA ? tPortada : n / FPS);
if (!CAPTURA) { const t0 = performance.now() - tPortada * 1000; const bucle = () => { pinta(((performance.now() - t0) / 1000) % FIN); requestAnimationFrame(bucle); }; bucle(); }
else pinta(PORTADA ? tPortada : 0);
window.LISTO = true;
