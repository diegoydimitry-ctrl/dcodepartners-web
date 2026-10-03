#!/usr/bin/env node
/* ==========================================================================
   RODAJE DEL REEL · graba la portada «la máquina» cuadro a cuadro (9:16)
   --------------------------------------------------------------------------
   No es una grabación de pantalla: es la propia web, en un navegador sin
   cabeza, dirigida plano a plano como un tráiler. El tiempo es virtual (reloj
   falso de Playwright para el JavaScript; las animaciones CSS se avanzan a
   mano), así que cada cuadro sale completo aunque tarde segundos en pintarse.

   Uso: node scripts/v4/reel/director.mjs <carpeta de salida> [planos] [escala de la escena: 3 → 1080×1920]
        (necesita el sitio servido en BASE, por defecto http://localhost:8097)
        SALTO=6  → uno de cada seis cuadros (animática)   TOMAS=40 → calidad del desenfoque
        SOLO_UI=1 → rehace solo la capa de la interfaz de los planos que la tienen (no vuelve a pintar la escena)
   ========================================================================== */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE || "http://localhost:8097";
const SAL = process.argv[2] || "reel-cuadros";
const SOLO = (process.argv[3] || "").split(",").filter(Boolean);
const DPR = +(process.argv[4] || 3);
const SOLO_UI = !!process.env.SOLO_UI, SALTO = +(process.env.SALTO || 1), TOMAS = +(process.env.TOMAS || 28), UI = +(process.env.UI || 3);   // UI: escala de la capa de interfaz (3 → 1080×1920)
export const FPS = 30, W = 360, H = 640;
const cl = (x) => Math.min(1, Math.max(0, x)), lerp = (a, b, t) => a + (b - a) * t, v3 = (a, b, t) => a.map((x, i) => lerp(x, b[i], t));
const eio = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2), eo = (t) => 1 - Math.pow(1 - t, 3), ei = (t) => t * t * t;
const tr = (f, a, b) => cl((f - a) / (b - a));
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const toma = (p, m, fov, ab, d = [0, 0], foco) => ({ p, m, fov, foco: foco ?? dist(p, m), ab, d });
export const NOMBRE = "Talleres Luna";

/* Los planos, en orden. cuadro(f, c) dice lo que pasa en ese cuadro; c = posiciones medidas en la página.
   «limpio» = solo la escena, sin la interfaz. Las coordenadas son las de la máquina en vertical (móvil). */
export const PLANOS = [
  // 0,0 s · GANCHO: dentro de la máquina en marcha, pegado al muelle real; al segundo salta en piezas hacia la cámara
  { n: "01-dentro", cuadros: 75, limpio: true, cuadro: (f) => ({ cap: 0, capYa: true, libre: null, forzar: { vel: 2.4 }, intro: f < 30 ? lerp(0.0, 0.34, f / 30) : lerp(0.34, 0.8, eo(tr(f, 30, 75))) }) },
  // 2,5 s · «Esto es una web»: la misma escena, ahora con la página alrededor; al final, un dedo empieza a deslizar
  { n: "02-web", cuadros: 75, clase: "reel-claro", cuadro: (f, c) => ({ scroll: lerp(0, c.hoy * 0.5, ei(tr(f, 54, 75))), libre: null, intro: lerp(0.8, 1, eo(tr(f, 0, 40))), abierta: 3,
      dedo: f >= 44 ? { x: 262, y: lerp(470, 250, eio(tr(f, 50, 75))), p: f >= 50 ? 1 : 0, o: tr(f, 44, 49) } : null }) },
  // 5,0 s · RECORRIDO: se monta
  { n: "03-monta", cuadros: 60, limpio: true, cuadro: (f) => { const e = eio(tr(f, 0, 60)), p = v3([-3.2, -9.5, 24], [-1.6, -7.5, 19.5], e), m = [0, -0.2, 0];
      return { cap: 1, capYa: true, intro: 1, libre: toma(p, m, 44, 0.08), forzar: { montaje: lerp(0.08, 0.8, eio(tr(f, 0, 56))), marcha: 0, noche: 0, tapa: 0, doc: 0, expo: 1 } }; } },
  // las transmisiones azules (lo que D-Code construye) entran y engranan
  { n: "04-azul", cuadros: 30, limpio: true, cuadro: (f) => { const e = eo(tr(f, 0, 30)), m = [0.14, 0.62, 0.3], p = v3([1.3, -2.0, 3.7], [0.9, -1.5, 3.0], e);
      return { cap: 1, capYa: true, intro: 1, libre: toma(p, m, 38, 0.45), forzar: { montaje: lerp(0.6, 1, eio(tr(f, 0, 18))), marcha: eio(tr(f, 16, 26)), noche: 0, tapa: 0, doc: 0, expo: 0.9, vel: 1.6 } }; } },
  // en marcha, desde arriba
  { n: "05-marcha", cuadros: 45, limpio: true, cuadro: (f) => { const e = tr(f, 0, 45), a = lerp(0.45, 0.95, e), r = lerp(13, 11, e), p = [Math.sin(a) * r, -Math.cos(a) * r, lerp(15, 12.5, e)], m = [0, 0.2, 0];
      return { cap: 2, capYa: true, intro: 1, libre: toma(p, m, 44, 0.14), forzar: { vel: 1.8 } }; } },
  // la leva, el seguidor y la cremallera: detalle
  { n: "06-leva", cuadros: 30, limpio: true, cuadro: (f) => { const e = tr(f, 0, 30), m = [-2.5, -4.5, 0.35], p = v3([-0.4, -7.2, 2.3], [-0.9, -7.0, 2.0], e);
      return { cap: 2, capYa: true, intro: 1, libre: toma(p, m, 38, 0.5), forzar: { vel: 1.4 } }; } },
  // la noche: la luz se va y la máquina sigue
  { n: "07-noche", cuadros: 60, limpio: true, cuadro: (f) => { const e = tr(f, 0, 60), m = [0, 0.3, 0.2], p = v3([5.6, -8.8, 4.8], [3.8, -10.2, 6.2], e);
      return { cap: 2, capYa: true, intro: 1, libre: toma(p, m, 44, 0.3, [0, 0], 11.2), forzar: { noche: eio(tr(f, 2, 20)), expo: 0.9, vel: 1.5 } }; } },
  // 12,5 s · NO ES SOLO DISEÑO: Finance, tocando
  { n: "08-finance", cuadros: 150, clase: "reel-finance", vistos: ["finance"], cuadro: (f, c) => ({
      ancla: "finance", click: f === 22 ? "[data-fz-pasar]" : null, libre: toma([2.95, -3.7, 6.5], [2.55, -0.92, 0.13], 40, 0.22, [0, 0.42]),
      dedo: f >= 6 && f < 40 ? { x: lerp(300, c.pasar.x, eo(tr(f, 6, 18))), y: lerp(600, c.pasar.y, eo(tr(f, 6, 18))), p: f >= 20 && f < 27 ? 1 : 0, o: tr(f, 6, 11) * (1 - tr(f, 32, 40)) } : null }) },
  // el registro: las cifras giran hasta el total
  { n: "09-registro", cuadros: 30, limpio: true, cuadro: (f) => { const e = eo(tr(f, 0, 30)), m = [2.57, 0.9, 0.45], p = v3([2.45, -1.5, 5.9], [2.57, -1.15, 5.0], e);
      return { cap: 5, capYa: true, intro: 1, lectura: 1, registro: f === 1 ? 150040 : null, rodar: f === 1 ? 4 : null, libre: toma(p, m, 38, 0.3) }; } },
  // el aviso: el martillo da en la campana
  { n: "10-golpe", cuadros: 30, limpio: true, cuadro: (f) => { const e = tr(f, 0, 30), m = [2.7, 5.0, 0.3], p = v3([3.5, 3.0, 2.9], [3.3, 3.3, 2.5], e);
      return { cap: 2, capYa: true, intro: 1, golpe: f === 4, libre: toma(p, m, 38, 0.45), forzar: { vel: 1.2 } }; } },
  // 19,5 s · PICO: la tapa baja
  { n: "11-tapa", cuadros: 75, limpio: true, cuadro: (f) => { const e = eio(tr(f, 0, 75)), m = [0, 0.2, 0.8], p = v3([7.5, -12.5, 8.5], [5.8, -13.8, 11.2], e);
      return { cap: 6, capYa: true, intro: 1, libre: toma(p, m, 44, 0.1), forzar: { tapa: tr(f, -8, 60), vel: 1.3 } }; } },
  // y lleva el nombre de quien la mira
  { n: "12-tuyo", cuadros: 135, clase: "reel-tuyo", vistos: ["hablemos"], cuadro: (f, c) => ({ ancla: "hablemos", libre: toma(v3([-1.6, -1.2, 16.6], [-1.0, -0.6, 15.9], tr(f, 0, 135)), [0, 4.0, 0.7], 42, 0.14, [0, 0.34]),
      teclear: f >= 24 && (f - 24) % 5 === 0 && (f - 24) / 5 < NOMBRE.length ? NOMBRE.slice(0, (f - 24) / 5 + 1) : null,
      dedo: f >= 4 && f < 30 ? { x: lerp(300, c.nombre.x, eo(tr(f, 4, 16))), y: lerp(600, c.nombre.y, eo(tr(f, 4, 16))), p: f >= 17 && f < 23 ? 1 : 0, o: tr(f, 4, 9) * (1 - tr(f, 23, 30)) } : null }) },
  // 26,5 s · CIERRE: la tapa entera, y la llamada
  { n: "13-cierre", cuadros: 165, limpio: true, cuadro: (f) => { const e = tr(f, 0, 165), a = lerp(-0.62, -0.2, eo(e)), r = lerp(11.5, 15.5, eo(e)), p = [Math.sin(a) * r, -Math.cos(a) * r, lerp(9.5, 13.5, eo(e))], m = [0, 0.4, 0.7];
      return { cap: 8, capYa: true, intro: 1, grabar: f === 0 ? "" : null, libre: toma(p, m, 44, 0.1), forzar: { expo: lerp(1, 0.66, tr(f, 22, 60)), vel: 1.3 } }; } },
];
export const TOTAL = PLANOS.reduce((s, p) => s + p.cuadros, 0);

const CSS = `
  html { scroll-behavior: auto !important; }
  .chat-widget, .maq-tira, .maq-pulso, .maq-carga, #cookieyes, .cky-consent-container, .fz-ficha-no { display: none !important; }
  .maq-lienzo { opacity: 1 !important; transition: none !important; }
  .maq .acto-texto > *, .claro-texto > *, .claro-pista, .claro-texto .display .linea > span { transition: none !important; }
  .reel-limpio .cab, .reel-limpio .maq > :not(.maq-escena), .reel-limpio .pie, .reel-limpio body > :not(main):not(script):not(style) { display: none !important; }
  * { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
  /* la portada, con el texto dentro de la zona que Instagram no tapa */
  .reel-claro .acto--claro { padding-bottom: 27svh !important; }
  .reel-claro .acto--claro::before { opacity: 1 !important; background: linear-gradient(180deg, rgba(4,4,5,0) 22%, rgba(4,4,5,.66) 40%, rgba(4,4,5,.72) 72%, rgba(4,4,5,0) 92%) !important; }
  .reel-claro .claro-texto .acc, .reel-claro .claro-pista { display: none !important; }
  .reel-claro .claro-texto .etiqueta { visibility: hidden !important; }
  .reel-claro .claro-texto .display { font-size: 2.9rem !important; }
  .reel-claro .acto .marco { padding-right: 40px !important; }
  /* Finance: el botón y el registro, compactos */
  .reel-finance #finance .acto-n, .reel-finance #finance .h2, .reel-finance #finance .lead, .reel-finance #finance .nota, .reel-finance #finance .acto-mas, .reel-finance #finance .fz-importe, .reel-finance #finance .fz-ayuda, .reel-finance #finance .fz-preguntas, .reel-finance #finance [data-fz-otra], .reel-finance #finance .fz-vacio { display: none !important; }
  .reel-finance #finance { padding-top: 41svh !important; }
  .reel-finance #finance .marco { padding-right: 50px !important; }
  .reel-finance #finance .fz { display: grid; gap: 10px; }
  .reel-finance #finance .fz-acc { min-height: 0; }
  .reel-finance #finance .fz-acc .boton { min-height: 44px; }
  .reel-finance #finance .fz-registro { padding: 10px 12px 9px; gap: 4px; background: rgba(6,6,6,.86); }
  .reel-finance #finance .fz-campos { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 0 14px !important; }
  .reel-finance #finance .fz-campos > div { grid-template-columns: auto minmax(0, 1fr) !important; padding: 4px 0 !important; min-height: 24px !important; border-top: 1px solid var(--linea) !important; }
  .reel-finance #finance .fz-campos > div:first-child { border-top: 0 !important; }
  .reel-finance #finance .fz-campos [data-fz-campo="prov"], .reel-finance #finance .fz-campos [data-fz-campo="base"], .reel-finance #finance .fz-campos [data-fz-campo="iva"], .reel-finance #finance .fz-campos [data-fz-campo="total"], .reel-finance #finance .fz-campos [data-fz-campo="vence"] { grid-column: 1 / -1; }
  .reel-finance #finance .fz-campos dt { font-size: .7rem; white-space: nowrap; }
  .reel-finance #finance .fz-campos dd { font-size: .74rem; white-space: nowrap; }
  .reel-finance #finance .fz-campos [data-fz-campo="total"] dd { font-size: .95rem; }
  .reel-finance #finance .fz-hecho { font-size: .8rem; padding-top: 5px; }
  .reel-finance .acto--finance::before { background: linear-gradient(180deg, rgba(4,4,5,0) 28%, rgba(4,4,5,.84) 40%, rgba(4,4,5,.94) 100%) !important; }
  /* el cierre: solo el nombre que se escribe; lo demás lo dice la tapa */
  .reel-tuyo #hablemos .acto-n, .reel-tuyo #hablemos .display, .reel-tuyo #hablemos .lead, .reel-tuyo #hablemos .tuyo-piezas, .reel-tuyo #hablemos .acc, .reel-tuyo #hablemos .tuyo-privado, .reel-tuyo #hablemos .fin-mas, .reel-tuyo #hablemos .tuyo-web { display: none !important; }
  .reel-tuyo #hablemos { padding-top: 49svh !important; min-height: 100svh; align-items: start !important; }
  .reel-tuyo #hablemos .marco { padding-right: 50px !important; }
  .reel-tuyo #hablemos .tuyo-nombre input { font-size: 2rem !important; height: 64px !important; }
  .reel-tuyo .acto--tuyo::before { background: linear-gradient(180deg, rgba(4,4,5,0) 38%, rgba(4,4,5,.8) 50%, rgba(4,4,5,.92) 100%) !important; }
  .reel-tuyo .pie { visibility: hidden !important; }
  #reel-dedo { position: fixed; left: 0; top: 0; z-index: 99; width: 46px; height: 46px; margin: -23px 0 0 -23px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,.85); background: rgba(255,255,255,.16); pointer-events: none; opacity: 0; }
`;

/* Lo que corre dentro de la página en cada cuadro. */
function enPagina() {
  const raiz = document.querySelector("[data-maq]"), vistos = new WeakSet(), llegada = new Map();
  const dedo = document.createElement("div"); dedo.id = "reel-dedo"; document.body.appendChild(dedo);
  const eo = (t) => 1 - Math.pow(1 - t, 3), cl = (x) => Math.min(1, Math.max(0, x));
  window.__reel = {
    cuadro(P, f, DT) {
      const m = window.__maquina;
      if (P.ancla) { const e = document.getElementById(P.ancla); scrollTo({ top: Math.round(e.getBoundingClientRect().top + scrollY), behavior: "instant" }); dispatchEvent(new Event("scroll")); }   // la sección, arriba del todo (se mide en cada cuadro: la página puede cambiar de alto)
      else if (P.scroll != null) { scrollTo({ top: P.scroll, behavior: "instant" }); dispatchEvent(new Event("scroll")); }
      if (P.cap != null) m.capitulo(P.cap, !!P.capYa); else if (f === 0) m.capitulo(m.est.capObj, true);
      if (P.intro != null) m.intro(P.intro);
      if ("libre" in P) m.rodaje(P.libre, P.forzar || null);
      if (P.lectura != null) m.lectura(P.lectura, 1);
      if (P.registro != null) m.registro(P.registro);
      if (P.rodar != null) for (let k = 0; k < 6; k++) m.est.digitos[k] = m.est.digObj[k] - P.rodar - k * 0.5;   // las cifras llegan en lo que dura el plano
      if (P.golpe) m.golpe();
      if (P.grabar != null) m.grabar({ nombre: (P.grabar || document.querySelector("[data-tuyo-nombre]").placeholder).toUpperCase() });
      if (P.click) document.querySelector(P.click).click();
      if (P.teclear != null) { const i = document.querySelector("[data-tuyo-nombre]"); i.value = P.teclear; i.dispatchEvent(new Event("input", { bubbles: true })); }
      if (P.dedo) { dedo.style.opacity = P.dedo.o; dedo.style.transform = `translate(${P.dedo.x}px, ${P.dedo.y}px) scale(${P.dedo.p ? 0.78 : 1})`; dedo.style.background = P.dedo.p ? "rgba(255,255,255,.34)" : "rgba(255,255,255,.16)"; } else dedo.style.opacity = 0;
      if (P.limpio) { m.paso(DT); return null; }   // solo la escena: no se toca la página (cada cambio en ella cuesta una composición entera)
      // los textos de cada acto entran cuando llega su sección (en tiempo de vídeo, no de reloj)
      for (const a of raiz.querySelectorAll(".acto")) {
        const t = a.querySelector(".acto-texto"); if (!t) continue;
        if (!llegada.has(a) && a.getBoundingClientRect().top < innerHeight * 0.74) llegada.set(a, P.vistos && P.vistos.includes(a.id) ? -999 : f);
        const f0 = llegada.get(a);
        [...t.children].forEach((h, i) => { const e = f0 === undefined ? 0 : eo(cl((f - f0 - i * 2.4) / 17)); h.style.opacity = e; h.style.transform = e < 1 ? `translateY(${(1 - e) * 18}px)` : "none"; });
      }
      // el título de la portada: sus dos líneas suben desde detrás de su máscara
      if (P.abierta !== undefined) {
        document.querySelectorAll(".claro-texto .display .linea > span").forEach((h, i) => { const e = eo(cl((f - P.abierta - i * 4) / 26)); h.style.transform = `translateY(${(1 - e) * 108}%)`; });
        document.querySelectorAll(".claro-texto > :not(.display)").forEach((h, i) => { const e = eo(cl((f - P.abierta - 10 - i * 5) / 22)); h.style.opacity = e; h.style.transform = `translateY(${(1 - e) * 12}px)`; });
      }
      // animaciones CSS y WAAPI, en tiempo de vídeo
      for (const an of document.getAnimations()) {
        if (an.timeline && !(an.timeline instanceof DocumentTimeline)) continue;
        if (!vistos.has(an)) { vistos.add(an); an.pause(); an.currentTime = 0; continue; }
        const fin = an.effect ? an.effect.getComputedTiming().endTime : Infinity;
        const t = (Number(an.currentTime) || 0) + DT * 1000;
        if (isFinite(fin) && t >= fin) { try { an.finish(); } catch (e) {} } else an.currentTime = t;
      }
      m.paso(DT);
      return null;
    },
  };
}

/* Cada cuadro se guarda en dos capas: la escena (leída del propio lienzo WebGL, sin pasar por la captura de pantalla,
   que por software cuesta segundos) y, en los planos con interfaz, la página sin la escena y con transparencia.
   El montaje las junta. Si un cuadro ya está en disco no se repite: el rodaje se puede reanudar. */
async function rodar(b, plano) {
  const dir = path.join(SAL, plano.n); fs.mkdirSync(dir, { recursive: true });
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: UI, isMobile: true, hasTouch: true });
  const pg = await ctx.newPage();
  pg.on("pageerror", (e) => console.log(`[${plano.n}] error de página:`, e.message.slice(0, 300)));
  await pg.clock.install({ time: new Date("2026-10-02T10:00:00") });
  await pg.goto(`${BASE}/?captura&reel&dpr=${DPR}&pixeles=${Math.round(W * H * DPR * DPR * 1.01)}&tomas=${TOMAS}`, { waitUntil: "load" });
  for (let i = 0; i < 60 && !(await pg.evaluate("window.__listo === true")); i++) await pg.clock.runFor(200);
  await pg.addStyleTag({ content: CSS + ".maq-escena { visibility: hidden !important; } html, body, .maq { background: transparent !important; }" });
  await pg.evaluate(`document.documentElement.classList.toggle("reel-limpio", ${!!plano.limpio}); ${plano.clase ? `document.documentElement.classList.add("${plano.clase}");` : ""}`);
  await pg.evaluate(enPagina);
  await pg.evaluate(() => { for (const an of document.getAnimations()) if (an.constructor && an.constructor.name === "CSSTransition") { try { an.finish(); } catch (e) {} } });
  await pg.clock.pauseAt(new Date("2026-10-02T10:30:00"));
  const c = await pg.evaluate(() => {
    const top = (id) => Math.round(document.getElementById(id).getBoundingClientRect().top + scrollY), centro = (s) => { const e = document.querySelector(s); if (!e) return { x: 180, y: 500 }; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
    const o = { hoy: top("hoy"), sistema: top("sistema"), finance: top("finance"), hablemos: top("hablemos") };
    scrollTo({ top: o.finance, behavior: "instant" }); o.pasar = centro("[data-fz-pasar]");
    scrollTo({ top: o.hablemos, behavior: "instant" }); o.nombre = centro("[data-tuyo-nombre]"); o.nombre.x = Math.min(o.nombre.x, 120);
    scrollTo({ top: 0, behavior: "instant" }); return o;
  });
  const t0 = Date.now(); let hechos = 0;
  for (let f = 0; f < plano.cuadros; f++) {
    await pg.clock.runFor(1000 / FPS);
    const P = plano.cuadro(f, c); P.vistos = plano.vistos || []; P.limpio = !!plano.limpio; if (process.env.SIN_DEDO) P.dedo = null;
    const nombre = `f${String(f).padStart(4, "0")}.jpg`, capa = `u${String(f).padStart(4, "0")}.png`, toca = f % SALTO === 0 || f === plano.cuadros - 1;
    const graba = toca && !SOLO_UI && !(fs.existsSync(path.join(dir, nombre)) && (plano.limpio || fs.existsSync(path.join(dir, capa))));
    if (f === 0) await pg.evaluate(([P, f]) => { const m = window.__maquina, pintar = m.renderer.render; m.renderer.render = () => {}; try { window.__reel.cuadro(P, f, 0); } finally { m.renderer.render = pintar; } }, [{ ...P, click: null, golpe: false, teclear: null }, 0]);   // un cuadro de más, sin tiempo: el primero sale con la cámara ya en su sitio
    const tB = Date.now();
    if (!graba) { await pg.evaluate(([P, f, DT]) => { const m = window.__maquina, pintar = m.renderer.render; m.renderer.render = () => {}; try { window.__reel.cuadro(P, f, DT); } finally { m.renderer.render = pintar; } }, [P, f, 1 / FPS]); if (SOLO_UI && toca && !plano.limpio) { await pg.screenshot({ path: path.join(dir, capa), omitBackground: true, timeout: 0 }); hechos++; } continue; }
    const datos = await pg.evaluate(([P, f, DT]) => { window.__reel.cuadro(P, f, DT); return document.querySelector("[data-maq-lienzo]").toDataURL("image/jpeg", 0.96); }, [P, f, 1 / FPS]);
    fs.writeFileSync(path.join(dir, nombre + ".tmp"), Buffer.from(datos.split(",")[1], "base64")); fs.renameSync(path.join(dir, nombre + ".tmp"), path.join(dir, nombre));
    if (!plano.limpio) await pg.screenshot({ path: path.join(dir, capa), omitBackground: true, timeout: 0 });
    if (process.env.TRAZA) console.log(f, 'cuadro grabado en', Date.now() - tB);
    hechos++;
  }
  console.log(`${plano.n}: ${hechos} de ${plano.cuadros} cuadros en ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  await ctx.close();
}

if (process.argv[1] && process.argv[1].endsWith("director.mjs")) {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  for (const p of PLANOS) if ((!SOLO.length || SOLO.some((s) => p.n.startsWith(s))) && !(SOLO_UI && p.limpio)) await rodar(b, p);
  await b.close();
}
