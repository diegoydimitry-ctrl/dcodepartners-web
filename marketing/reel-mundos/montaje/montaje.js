// Montaje del reel: clips (JPEG en ../render/<escena>/NNNN.jpg) + rótulos + muro de ventanas + cierre.
// ?limpio → sin textos (hasta el logo) · ?portada → un único fotograma de portada
const FPS = 30, Q = new URLSearchParams(location.search), LIMPIO = Q.has('limpio'), PORTADA = Q.has('portada');
const $ = (s) => document.querySelector(s);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), lerp = (a, b, u) => a + (b - a) * u, rango = (t, a, b) => clamp((t - a) / (b - a));
const eout = (u) => 1 - Math.pow(1 - clamp(u), 3), eio = (u) => { u = clamp(u); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
const visible = (t, a, b, f = 0.2) => Math.min(rango(t, a, a + f), 1 - rango(t, b - f, b));
// escena, duración, etiqueta
const CLIPS = [['reloj', 2.6, 'Relojería'], ['coche', 2.7, 'Automoción'], ['casa', 3.2, 'Arquitectura'], ['ajedrez', 2.8, 'Mundo 3D'], ['bolas', 2.8, 'Física en vivo'], ['dragon', 3.0, 'Materiales'], ['particulas', 3.6, 'Datos vivos']];
let acc = 0; const PL = CLIPS.map(([e, d, n], i) => { const p = { e, d, n, a: acc, b: acc + d, i }; acc += d; return p; });
const T_MURO = acc, T_LIM = T_MURO + 1.25, T_DCODE = T_MURO + 2.9, T_CTA = T_DCODE + 2.5, DUR = LIMPIO ? T_CTA : T_CTA + 4.0;
const FRASES = [[PL[2].a + 0.5, PL[2].b - 0.25, 'Esto también<br>puede ser una web.'], [PL[3].a + 0.3, PL[3].b - 0.2, 'No estás viendo<br>una película.']];
const E = Object.fromEntries(['plano', 'destello', 'chip', 'frase', 'sombra', 'muro', 'velo', 'lim', 'negro', 'firma', 'cta', 'vin', 'grano'].map((k) => [k, $('#' + k)]));
const ruta = (p, n, mini) => `../render/${p.e}${mini ? '_m' : ''}/${String(clamp(Math.round(n), 0, Math.round(p.d * FPS) - 1)).padStart(4, '0')}.jpg`;
const pone = async (img, src) => { if (img.dataset.s === src) return; img.dataset.s = src; img.src = src; try { await img.decode(); } catch (e) { console.error('no carga ' + src); } };
// muro: 3 columnas × 2 filas + la ventana de partículas en el centro (de ella sale el plano)
const POS = [[30, 400], [375, 60], [720, 400], [30, 1085], [720, 1085], [375, 1430], [375, 745]], ORD = [0, 1, 2, 3, 4, 5, 6];
const V = PL.map((p, k) => { const d = document.createElement('div'); d.className = 'v'; d.style.left = POS[k][0] + 'px'; d.style.top = POS[k][1] + 'px';
  d.innerHTML = `<div class="barra"><s></s><s></s><s></s><u>${p.n.toLowerCase()}</u></div><img alt="">`; E.muro.appendChild(d); return { p, img: d.lastChild, d }; });
const FOCO = V[6], FX = POS[6][0], FY = POS[6][1] + 44, ESC0 = 1080 / 330;
let chipAct = -1, fraseAct = -1;
async function pinta(t) {
  const tareas = [], p = PL.find((x) => t >= x.a && t < x.b);
  if (p) { tareas.push(pone(E.plano, ruta(p, (t - p.a) * FPS))); const u = t - p.a;
    E.plano.style.opacity = 1; E.plano.style.transform = `scale(${p.i ? lerp(1.07, 1, eout(u / 0.4)) : 1})`;
    E.destello.style.opacity = p.i ? 0.55 * (1 - rango(u, 0, 0.13)) : 1 - rango(t, 0, 0.12); }
  else { E.plano.style.opacity = 0; E.destello.style.opacity = t >= T_DCODE ? 0.5 * (1 - rango(t, T_DCODE, T_DCODE + 0.25)) : 0; }
  E.vin.style.opacity = E.grano.style.opacity = t < T_DCODE ? '' : 0;
  // etiqueta y frases
  const pc = !LIMPIO && p && t - p.a > 0.25 && p.b - t > 0.12 ? p : null;
  if (pc && pc.i !== chipAct) { E.chip.children[1].textContent = 'Web ' + String(pc.i + 1).padStart(2, '0'); E.chip.children[2].textContent = pc.n; chipAct = pc.i; }
  E.chip.style.opacity = pc ? Math.min(rango(t, pc.a + 0.25, pc.a + 0.45), 1) : 0;
  let fi = -1, fv = 0; if (!LIMPIO) FRASES.forEach(([a, b], i) => { const o = visible(t, a, b, 0.22); if (o > 0) { fi = i; fv = o; } });
  if (fi >= 0 && fi !== fraseAct) { E.frase.innerHTML = FRASES[fi][2]; fraseAct = fi; }
  E.frase.style.opacity = fv; E.sombra.style.opacity = fv; if (fi >= 0) E.frase.style.transform = `translateY(${lerp(30, 0, eout(rango(t, FRASES[fi][0], FRASES[fi][0] + 0.5)))}px)`;
  // muro
  const vm = t >= T_MURO && t < T_DCODE + 0.5; E.muro.style.opacity = vm ? 1 : 0;
  if (vm) { const tm = t - T_MURO, k = eio(rango(tm, 0.0, 1.15)), s = lerp(ESC0, 1, k), sale = eio(rango(t, T_DCODE - 0.15, T_DCODE + 0.35));
    E.muro.style.transform = `translate(${lerp(-FX * ESC0, 0, k)}px,${lerp(-FY * ESC0, 0, k)}px) scale(${s * (1 - 0.25 * sale)})`; E.muro.style.transformOrigin = sale > 0 ? '50% 50%' : '0 0';
    V.forEach((v, i) => { const fin = Math.round(v.p.d * FPS) - 1; let n = ((tm + i * 0.37) * FPS) % (fin + 1); if (v === FOCO) n = fin - 14 + Math.abs(((tm * FPS) % 28) - 14);      // la de partículas sigue «viva» con la frase formada
      tareas.push(pone(v.img, ruta(v.p, n, tm > 0.9 || v !== FOCO))); v.d.style.opacity = v === FOCO ? 1 : rango(tm, 0.05, 0.5); }); }
  E.velo.style.opacity = LIMPIO ? 0 : 0.72 * rango(t, T_LIM - 0.1, T_LIM + 0.3) * (t < T_DCODE + 0.5 ? 1 : 0);
  const l = E.lim.children; l[0].style.opacity = LIMPIO ? 0 : visible(t, T_LIM, T_DCODE - 0.05, 0.2); l[0].style.transform = `translateY(${lerp(34, 0, eout(rango(t, T_LIM, T_LIM + 0.45)))}px)`;
  l[1].style.opacity = LIMPIO ? 0 : visible(t, T_LIM + 0.75, T_DCODE - 0.05, 0.2); l[1].style.transform = `translateY(${lerp(34, 0, eout(rango(t, T_LIM + 0.75, T_LIM + 1.2)))}px)`;
  // D-Code y CTA
  E.negro.style.opacity = rango(t, T_DCODE - 0.05, T_DCODE + 0.3);
  E.firma.style.opacity = rango(t, T_DCODE + 0.25, T_DCODE + 0.6) * (1 - rango(t, T_CTA - 0.3, T_CTA - 0.05)); E.firma.style.transform = `scale(${lerp(0.9, 1, eout(rango(t, T_DCODE + 0.25, T_DCODE + 1.2)))})`;
  const c = (id, a, s0 = 1.0) => { const el = $(id); el.style.opacity = rango(t, a, a + 0.22); el.style.transform = `translateY(${lerp(30, 0, eout(rango(t, a, a + 0.5)))}px) scale(${lerp(s0, 1, eout(rango(t, a, a + 0.45)))})`; };
  c('#c1', T_CTA + 0.05); c('#c2', T_CTA + 0.95); c('#c3', T_CTA + 1.05, 1.5); c('#c4', T_CTA + 2.0); c('#c5', T_CTA + 2.5);
  await Promise.all(tareas);
}
window.META = { fps: FPS, duracion: DUR, fotogramas: Math.round(DUR * FPS), marcas: { clips: PL.map((p) => [p.e, +p.a.toFixed(2)]), muro: T_MURO, limite: T_LIM, dcode: T_DCODE, cta: T_CTA } };
window.pintaFrame = async (n) => { await pinta(n / FPS); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); return true; };
document.fonts.ready.then(async () => { await pinta(0); window.LISTO = true; });
