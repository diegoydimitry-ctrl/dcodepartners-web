// Montaje del reel: une los tres clips (fotogramas JPEG en ../render/<web>/NNNN.jpg) con gancho, rótulos, escaparate de móviles y cierre.
// window.pintaFrame(n) es asíncrona: espera a que las imágenes del fotograma estén decodificadas.
const FPS = 30, DUR = 25.5, CLIP = 6;
const $ = (s) => document.querySelector(s);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), lerp = (a, b, u) => a + (b - a) * u, rango = (t, a, b) => clamp((t - a) / (b - a));
const eout = (u) => 1 - Math.pow(1 - clamp(u), 3), eio = (u) => { u = clamp(u); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
const visible = (t, a, b, f = 0.2) => Math.min(rango(t, a, a + f), 1 - rango(t, b - f, b));
// planos a pantalla completa: [inicio, fin, web, segundo del clip en que empieza]
const PLANOS = [[0, 0.5, 'orien', 4.7], [0.5, 1.0, 'vela', 4.15], [1.0, 1.5, 'norda', 1.85], [1.5, 2.0, 'vela', 2.05],
  [2, 8, 'vela', 0], [8, 14, 'norda', 0], [14, 20, 'orien', 0]];
const ROTULOS = [[2.15, 5.35, 'Se gira con el dedo.'], [5.5, 7.9, 'Zoom hasta el último hilo.'], [8.15, 11.35, 'Cambia el tejido en un toque.'], [11.5, 13.9, 'Con sus medidas reales.'],
  [14.15, 17.3, 'Cada web, con su estilo.'], [17.45, 19.9, 'Detalle de joyería.']];
const T_ESC = 20, T_FIN = 23;
const MOVILES = [['vela', 0.0, -1], ['orien', 0.0, 0], ['norda', 1.2, 1]];      // web, segundo inicial del clip, posición
const E = Object.fromEntries(['plano', 'destello', 'rotulo', 'gancho', 'esc', 'negro', 'firma'].map((k) => [k, $('#' + k)]));
const IM = [0, 1, 2].map((i) => $(`#m${i} img`));
const ruta = (web, n, mini) => `../render/${web}${mini ? '_m' : ''}/${String(clamp(Math.round(n), 0, CLIP * FPS - 1)).padStart(4, '0')}.jpg`;
const pone = async (img, src) => { if (img.dataset.s === src) return; img.dataset.s = src; img.src = src; try { await img.decode(); } catch (e) { console.error('no carga ' + src); } };
let rot = -1;
async function pinta(t) {
  const tareas = [];
  // plano a pantalla completa
  const p = PLANOS.find((x) => t >= x[0] && t < x[1]);
  if (p) { tareas.push(pone(E.plano, ruta(p[2], (p[3] + (t - p[0])) * FPS))); const u = t - p[0], corto = p[1] - p[0] < 1;
    E.plano.style.transform = `scale(${corto ? lerp(1.14, 1.04, eout(u / 0.5)) : lerp(1.1, 1, eout(u / 0.45))})`; E.plano.style.opacity = 1;
    E.destello.style.opacity = (t >= 2 ? 0.5 : 0.28) * (1 - rango(u, 0, 0.14)) * (t < 0.05 ? 0 : 1); }
  else { E.plano.style.opacity = 0; E.destello.style.opacity = 0; }
  // gancho
  const g = E.gancho.children;
  g[0].style.opacity = visible(t, 0.06, 2.0, 0.1); g[0].style.transform = `rotate(-2.5deg) scale(${lerp(1.25, 1, eout(rango(t, 0.06, 0.3)))})`;
  g[1].style.opacity = visible(t, 0.95, 2.0, 0.1); g[1].style.transform = `rotate(-2.5deg) scale(${lerp(1.3, 1, eout(rango(t, 0.95, 1.2)))})`;
  // rótulos
  let ri = -1, rv = 0; ROTULOS.forEach(([a, b], i) => { const o = visible(t, a, b, 0.18); if (o > 0) { ri = i; rv = o; } });
  if (ri >= 0 && ri !== rot) { E.rotulo.lastElementChild.textContent = ROTULOS[ri][2]; rot = ri; }
  E.rotulo.style.opacity = rv; if (ri >= 0) E.rotulo.style.transform = `translateX(-50%) translateY(${lerp(-26, 0, eout(rango(t, ROTULOS[ri][0], ROTULOS[ri][0] + 0.35)))}px) scale(${lerp(0.92, 1, eout(rango(t, ROTULOS[ri][0], ROTULOS[ri][0] + 0.35)))})`;
  // escaparate de móviles
  const ve = t >= T_ESC ? 1 : 0; E.esc.style.opacity = ve;
  if (ve) { const tt = t - T_ESC, sale = eio(rango(t, T_FIN - 0.1, T_FIN + 0.45));
    $('#esc h2').style.opacity = rango(tt, 0.35, 0.7) * (1 - sale); $('#esc h2').style.transform = `translateY(${lerp(40, 0, eout(rango(tt, 0.35, 0.9)))}px)`;
    MOVILES.forEach(([web, t0, pos], i) => { tareas.push(pone(IM[i], ruta(web, (t0 + tt) * FPS, true)));
      const ent = eout(rango(tt, 0.05 + 0.12 * Math.abs(pos) , 0.85 + 0.12 * Math.abs(pos))), deriva = Math.sin(tt * 0.9 + i) * 6;
      const x = pos * 318, z = pos ? -260 : 60, ry = -pos * 26 + deriva * 0.25 * (pos || 0.4), y = lerp(1300, 0, ent) + deriva + (pos ? 40 : 0) - 900 * sale * (1 + 0.2 * Math.abs(pos));
      $(`#m${i}`).style.transform = `translate3d(${x}px,${y}px,${z}px) rotateY(${ry}deg) rotateX(${lerp(14, 2, ent)}deg) scale(${pos ? 1.06 : 1.27})`; $(`#m${i}`).style.opacity = 1 - sale; }); }
  // cierre: sólo logo y nombre
  E.negro.style.opacity = Math.max(rango(t, T_FIN + 0.15, T_FIN + 0.5), 0);
  E.firma.style.opacity = rango(t, T_FIN + 0.45, T_FIN + 0.95); E.firma.style.transform = `scale(${lerp(0.92, 1, eout(rango(t, T_FIN + 0.45, T_FIN + 1.3)))})`;
  await Promise.all(tareas);
}
window.META = { fps: FPS, duracion: DUR, fotogramas: Math.round(DUR * FPS) };
window.pintaFrame = async (n) => { await pinta(n / FPS); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); return true; };
document.fonts.ready.then(async () => { await pinta(0); window.LISTO = true; });
