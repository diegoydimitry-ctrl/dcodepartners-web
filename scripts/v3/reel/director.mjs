#!/usr/bin/env node
/* ==========================================================================
   RODAJE DEL REEL · graba la portada «el mundo» cuadro a cuadro (9:16)
   --------------------------------------------------------------------------
   No es una grabación de pantalla: es la propia web, en un navegador sin
   cabeza, dirigida plano a plano. El tiempo es virtual (reloj falso de
   Playwright para el JavaScript; las animaciones CSS se avanzan a mano), así
   que cada cuadro sale completo aunque tarde segundos en pintarse.
   Uso: node scripts/v3/reel/director.mjs <carpeta de salida> [planos] [dpr]
        (necesita un servidor del proyecto en BASE, por defecto :8097)
   ========================================================================== */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE || "http://localhost:8097";
const SAL = process.argv[2] || "reel-cuadros";
const SOLO = (process.argv[3] || "").split(",").filter(Boolean);
const DPR = +(process.argv[4] || 3);
const SALTO = +(process.env.SALTO || 1);          // 1 = todos los cuadros; 5 = uno de cada cinco (animática)
export const FPS = 30, W = 360, H = 640;
const cl = (x) => Math.min(1, Math.max(0, x)), lerp = (a, b, t) => a + (b - a) * t, v3 = (a, b, t) => a.map((x, i) => lerp(x, b[i], t));
const eio = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2), eo = (t) => 1 - Math.pow(1 - t, 3);
const tr = (f, a, b) => cl((f - a) / (b - a));
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/* Los planos. cuadro(f, c) devuelve lo que pasa en ese cuadro; c = datos medidos en la página (posiciones). */
export const PLANOS = [
  { n: "01-tormenta", cuadros: 75, limpio: true, cuadro: (f) => {
      const e = eio(tr(f, 0, 75)), p = [0.5, 3.7, lerp(6.2, 10.8, e)], m = [0, 3.9, 0];
      return { cap: 0, capYa: true, intro: 0.36 * eio(tr(f, 50, 75)), libre: { p, m, fov: 58, foco: lerp(3.2, 7.5, e), ab: 0.85, d: [0, 0] } };
    } },
  { n: "02-claro", cuadros: 105, cuadro: (f) => ({ scroll: 0, intro: lerp(0.36, 1, eo(tr(f, 0, 62))), abierta: 26, libre: null }) },
  { n: "03-hoy", cuadros: 120, vistos: ["inicio"], cuadro: (f, c) => ({ scroll: lerp(0, c.hoy, eio(tr(f, 8, 74))), intro: 1 }) },
  { n: "04-orden", cuadros: 105, limpio: true, cuadro: (f) => ({
      cap: 1, capYa: true, sostener: f >= 20 && f < 80 ? true : f === 80 ? false : undefined, px: 0, py: 0.1,
      dedo: f >= 6 && f < 94 ? { x: lerp(300, 180, eo(tr(f, 6, 18))), y: lerp(700, 288, eo(tr(f, 6, 18))), p: f >= 20 && f < 80 ? 1 : 0, o: tr(f, 6, 12) * (1 - tr(f, 86, 94)) } : null }) },
  { n: "05-sistema", cuadros: 165, vistos: ["inicio", "hoy"], cuadro: (f, c) => ({
      scroll: lerp(c.hoy, c.sistema + 96, eio(tr(f, 4, 80))), click: f === 124 ? '[data-area="3"]' : null,
      dedo: f >= 106 && f < 146 ? { x: lerp(330, c.area.x, eo(tr(f, 106, 120))), y: lerp(660, c.area.y, eo(tr(f, 106, 120))), p: f >= 122 && f < 130 ? 1 : 0, o: tr(f, 106, 112) * (1 - tr(f, 138, 146)) } : null }) },
  { n: "06-inteligencia", cuadros: 105, limpio: true, cuadro: (f) => {
      const e = eio(tr(f, 0, 105)), p = v3([-6.3, 3.0, 4.3], [-4.9, 2.25, 2.9], e), m = [-2.85, 0.45, 0.05];
      return { cap: 3, capYa: true, libre: { p, m, fov: 40, foco: dist(p, m), ab: 0.5, d: [0, -0.12] }, forzar: { vel: 0.85 } };
    } },
  { n: "07-noche", cuadros: 90, limpio: true, cuadro: (f) => {
      const e = tr(f, 0, 90), p = v3([-14.5, 5.0, 2.6], [-10.5, 3.7, 1.5], e), m = [2, 0.2, -0.3];
      return { cap: 4, capYa: true, libre: { p, m, fov: 46, foco: 10.5, ab: 0.24, d: [0, -0.16] }, forzar: { vel: 1.7 } };
    } },
  { n: "08-finance", cuadros: 165, vistos: ["finance"], escena: "finance", cuadro: (f, c) => ({
      scroll: c.financeEsc, click: f === 24 ? "[data-fz-pasar]" : null,
      dedo: f >= 8 && f < 40 ? { x: lerp(300, c.pasar.x, eo(tr(f, 8, 20))), y: lerp(690, c.pasar.y, eo(tr(f, 8, 20))), p: f >= 22 && f < 29 ? 1 : 0, o: tr(f, 8, 13) * (1 - tr(f, 33, 40)) } : null }) },
  { n: "09-resultado", cuadros: 90, limpio: true, cuadro: (f) => {
      const e = eo(tr(f, 0, 90)), p = [lerp(-3, 0, e), lerp(20, 54, e), lerp(3.6, 5.2, e)], m = [lerp(-3, 0, e), 0, lerp(-1, -3.6, e)];
      return { cap: 6, capYa: true, libre: { p, m, fov: 40, ab: 0.02, d: [0, 0.16] } };
    } },
  { n: "10-tuyo", cuadros: 180, limpio: true, cuadro: (f) => {
      const e = eo(tr(f, 0, 180)), p = v3([0, 1.72, 17.2], [0, 1.8, 15.4], e), m = [0, 1.9, 9.5];
      return { cap: 8, capYa: true, libre: { p, m, fov: 40, foco: dist(p, [0, 1.8, 9.5]), ab: 0.4, d: [0, 0.2] } };
    } },
];

const CSS = `
  html { scroll-behavior: auto !important; }
  .chat-widget, .mundo-indice, #cookieyes, .cky-consent-container { display: none !important; }
  .mundo-lienzo { opacity: 1 !important; transition: none !important; }
  .mundo .acto-texto > *, .claro-texto > *, .claro-pista { transition: none !important; }
  .reel-limpio .cab, .reel-limpio .mundo > :not(.mundo-escena), .reel-limpio .pie { visibility: hidden !important; }
  .reel-finance #finance .acto-n, .reel-finance #finance .h2, .reel-finance #finance .lead, .reel-finance #finance .nota, .reel-finance #finance .acto-mas { display: none !important; }
  .reel-finance #finance { padding-top: 47svh; }
  .reel-finance .acto--finance::before { background: linear-gradient(180deg, rgba(3,3,3,0) 34%, rgba(3,3,3,.82) 52%, rgba(3,3,3,.94) 100%) !important; }
  #reel-dedo { position: fixed; left: 0; top: 0; z-index: 99; width: 46px; height: 46px; margin: -23px 0 0 -23px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,.85); background: rgba(255,255,255,.16); box-shadow: 0 0 0 0 rgba(255,255,255,.25); pointer-events: none; opacity: 0; }
`;

/* Lo que corre dentro de la página en cada cuadro. */
function enPagina() {
  const raiz = document.querySelector("[data-mundo]"), vistos = new WeakSet(), llegada = new Map();
  const dedo = document.createElement("div"); dedo.id = "reel-dedo"; document.body.appendChild(dedo);
  const eo = (t) => 1 - Math.pow(1 - t, 3), cl = (x) => Math.min(1, Math.max(0, x));
  window.__reel = {
    cuadro(P, f, DT) {
      const m = window.__mundo;
      if (P.scroll != null) { scrollTo({ top: P.scroll, behavior: "instant" }); dispatchEvent(new Event("scroll")); }
      if (P.cap != null) m.capitulo(P.cap, !!P.capYa); else if (f === 0) m.capitulo(m.est.capObj, true);
      if (P.intro != null) m.intro(P.intro);
      if ("libre" in P) m.rodaje(P.libre, P.forzar || null);
      if (P.sostener !== undefined) { m.puntero(P.px || 0, P.py === undefined ? 0.3 : P.py, P.sostener); m.sostener(P.sostener); raiz.classList.toggle("is-sosteniendo", P.sostener); }
      if (P.click) document.querySelector(P.click).click();
      if (P.dedo) { dedo.style.opacity = P.dedo.o; dedo.style.transform = `translate(${P.dedo.x}px, ${P.dedo.y}px) scale(${P.dedo.p ? 0.78 : 1})`; dedo.style.background = P.dedo.p ? "rgba(255,255,255,.34)" : "rgba(255,255,255,.16)"; } else dedo.style.opacity = 0;
      // los textos de cada acto entran cuando llega su sección (en tiempo de vídeo, no de reloj)
      for (const a of raiz.querySelectorAll(".acto")) {
        const t = a.querySelector(".acto-texto"); if (!t) continue;
        if (!llegada.has(a) && a.getBoundingClientRect().top < innerHeight * 0.74) llegada.set(a, P.vistos && P.vistos.includes(a.id) ? -999 : f);
        const f0 = llegada.get(a);
        [...t.children].forEach((h, i) => { const e = f0 === undefined ? 0 : eo(cl((f - f0 - i * 2.4) / 17)); h.style.opacity = e; h.style.transform = e < 1 ? `translateY(${(1 - e) * 18}px)` : "none"; });
      }
      if (P.abierta !== undefined) document.querySelectorAll(".claro-texto > :not(.display), .claro-pista").forEach((h, i) => { const e = eo(cl((f - P.abierta - i * 4) / 22)); h.style.opacity = e; h.style.transform = h.classList.contains("claro-pista") ? `translate(-50%, ${(1 - e) * 12}px)` : `translateY(${(1 - e) * 12}px)`; });
      else document.querySelectorAll(".claro-texto > :not(.display), .claro-pista").forEach((h) => { h.style.opacity = 1; h.style.transform = h.classList.contains("claro-pista") ? "translateX(-50%)" : "none"; });
      // animaciones CSS y WAAPI, en tiempo de vídeo
      for (const an of document.getAnimations()) {
        if (an.timeline && !(an.timeline instanceof DocumentTimeline)) continue;   // las ligadas al scroll se mueven solas
        if (!vistos.has(an)) { vistos.add(an); an.pause(); an.currentTime = 0; continue; }
        const fin = an.effect ? an.effect.getComputedTiming().endTime : Infinity;
        const t = (Number(an.currentTime) || 0) + DT * 1000;
        if (isFinite(fin) && t >= fin) { try { an.finish(); } catch (e) {} } else an.currentTime = t;
      }
      m.paso(DT);
      if (P.dedo && P.dedo.medir === "pregunta") { const b = document.querySelector('[data-fz-q="0"]'); if (b && b.offsetParent) return { preguntaY: b.getBoundingClientRect().top + 20 }; }
      return null;
    },
  };
}

async function rodar(b, plano) {
  const dir = path.join(SAL, plano.n); fs.mkdirSync(dir, { recursive: true });
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DPR, isMobile: true, hasTouch: true });
  const pg = await ctx.newPage();
  pg.on("pageerror", (e) => console.log(`[${plano.n}] error de página:`, e.message.slice(0, 300)));
  await pg.clock.install({ time: new Date("2026-10-02T10:00:00") });
  await pg.goto(`${BASE}/?captura&reel&dpr=${DPR}&pixeles=${Math.round(W * H * DPR * DPR * 1.01)}&hojas=${process.env.HOJAS || 2200}`, { waitUntil: "load" });
  for (let i = 0; i < 40 && !(await pg.evaluate("window.__listo === true")); i++) await pg.clock.runFor(200);
  await pg.addStyleTag({ content: CSS });
  await pg.evaluate(`document.documentElement.classList.toggle("reel-limpio", ${!!plano.limpio}); document.documentElement.classList.toggle("reel-finance", ${plano.escena === "finance"});`);
  await pg.evaluate(enPagina);
  await pg.clock.pauseAt(new Date("2026-10-02T10:30:00"));
  const c = await pg.evaluate(() => {
    const top = (id) => Math.round(document.getElementById(id).getBoundingClientRect().top + scrollY), centro = (s) => { const e = document.querySelector(s); if (!e) return { x: 180, y: 500 }; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
    const o = { hoy: top("hoy"), sistema: top("sistema"), finance: top("finance") };
    scrollTo({ top: o.hoy, behavior: "instant" }); o.mano = centro("[data-mano]");
    scrollTo({ top: o.sistema + 96, behavior: "instant" }); o.area = centro('[data-area="3"]');
    o.financeEsc = o.finance; scrollTo({ top: o.financeEsc, behavior: "instant" }); o.pasar = centro("[data-fz-pasar]");
    scrollTo({ top: 0, behavior: "instant" }); return o;
  });
  const t0 = Date.now();
  for (let f = 0; f < plano.cuadros; f++) {
    await pg.clock.runFor(1000 / FPS);
    const P = plano.cuadro(f, c); P.vistos = plano.vistos || []; if (process.env.SIN_DEDO) P.dedo = null;   // SIN_DEDO=1: el mismo plano sin el dedo (para la portada del Reel)
    if (f === 0) await pg.evaluate(([P, f, DT]) => window.__reel.cuadro(P, f, DT), [{ ...P, click: null }, 0, 1 / FPS]);   // un cuadro de más al empezar: el primero sale con el foco y la cámara aún sin asentar
    const r = await pg.evaluate(([P, f, DT]) => window.__reel.cuadro(P, f, DT), [P, f, 1 / FPS]);
    if (r) Object.assign(c, r);
    if (f % SALTO === 0 || f === plano.cuadros - 1) await pg.screenshot({ path: path.join(dir, `f${String(f).padStart(4, "0")}.jpg`), type: "jpeg", quality: 94, timeout: 0 });   // sin límite: con SALTO > 1 la captura espera a que la tarjeta acabe los cuadros intermedios
  }
  console.log(`${plano.n}: ${plano.cuadros} cuadros en ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  await ctx.close();
}

if (process.argv[1] && process.argv[1].endsWith("director.mjs")) {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  for (const p of PLANOS) if (!SOLO.length || SOLO.some((s) => p.n.startsWith(s))) await rodar(b, p);
  await b.close();
}
