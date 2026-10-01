/* ==========================================================================
   D-CODE · portada
   El sistema: la escena 3D en tiempo real (three.js) en
   /assets/v2/js/sistema3d.js (fuente: scripts/v2/escena/sistema.js).
   - Se pinta primero el texto (LCP) y el 3D llega después, sin bloquear;
     el lienzo aparece con un fundido.
   - El scroll dentro de la sección elige la etapa (personas → procesos →
     datos → herramientas → IA → automatizar → el sistema). Cada etapa se
     sostiene un rato antes de pasar a la siguiente (se lee sin prisa).
   - El raíl de la derecha lleva a cada capa y marca en cuál estás.
   - Movimiento reducido, sin WebGL o si el 3D falla: la imagen del logotipo
     montado, quieta, y las capas una debajo de otra.
   ========================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const EN = document.documentElement.lang === "en";
const REDUCIDO = matchMedia("(prefers-reduced-motion: reduce)").matches;
const ETAPAS = 7; // 0 = entrada … 7 = el sistema

const sec = $("[data-sistema]");
function hayWebGL() { try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch (e) { return false; } }
// progreso del scroll (0…1) → etapa con meseta: cada etapa se queda quieta el primer 30 % de su tramo
const etapaDe = (p) => { const x = Math.min(ETAPAS, Math.max(0, p * ETAPAS)), k = Math.floor(x), f = x - k; const g = Math.min(1, Math.max(0, (f - 0.3) / 0.55)); return Math.min(ETAPAS, k + g * g * (3 - 2 * g)); };
if (sec) {
  const lienzo = $("[data-sistema-lienzo]", sec);
  const capas = $$("[data-capa]", sec), botones = $$("[data-ir]", sec);
  if (REDUCIDO || !hayWebGL()) {
    sec.classList.add("is-quieta");
  } else {
    const movil = matchMedia("(max-width: 760px)").matches;
    let escena = null, etapa = 0, capaActual = -1;
    const leer = () => {
      const r = sec.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
      etapa = etapaDe(p);
      if (escena) escena.etapa(etapa);
      const c = Math.min(ETAPAS, Math.round(etapa));
      if (c !== capaActual) {
        capaActual = c;
        capas.forEach((el) => { const on = +el.dataset.capa === c; el.classList.toggle("is-activa", on); el.toggleAttribute("inert", !on); });
        botones.forEach((b) => b.toggleAttribute("aria-current", +b.dataset.ir === c));
      }
      sec.classList.toggle("is-bajado", p > 0.01);
    };
    addEventListener("scroll", leer, { passive: true }); addEventListener("resize", leer, { passive: true });
    leer();
    // el raíl lleva al centro de la meseta de cada capa
    botones.forEach((b) => b.addEventListener("click", () => {
      const r = sec.getBoundingClientRect(), alto = Math.max(1, r.height - innerHeight), top = scrollY + r.top;
      scrollTo({ top: top + alto * ((+b.dataset.ir + 0.05) / ETAPAS), behavior: "smooth" });
    }));

    // El 3D, cuando el navegador tenga un respiro (el título ya es el LCP).
    const cargar = () => import("/assets/v2/js/sistema3d.js?v=086d3f3726").then(({ montar }) => {
      const raiz = document.documentElement;
      const claro = () => raiz.dataset.theme === "light";
      escena = montar(lienzo, { movil, claro: claro() });
      escena.tema(claro());
      new MutationObserver(() => escena.tema(claro())).observe(raiz, { attributes: true, attributeFilter: ["data-theme"] });
      escena.etapa(etapa, true);
      if (new URLSearchParams(location.search).has("depurar")) window.__sistema = escena;
      requestAnimationFrame(() => requestAnimationFrame(() => sec.classList.add("is-escena")));
    }).catch((e) => { console.warn("sistema", e); sec.classList.add("is-quieta"); });
    (window.requestIdleCallback || ((f) => setTimeout(f, 60)))(cargar, { timeout: 500 });
  }
}

/* ---------------------------------------------------------- visor de demos
   Las demos son aplicaciones enteras: se cargan solo al pedirlas, dentro de
   un diálogo nativo (foco atrapado, Escape cierra). */
const DEMOS = {
  finance: [EN ? "/en/sistema-financiero/app" : "/sistema-financiero/app", "D-Code Finance"],
  comercial: [(EN ? "/en" : "") + "/demos/comercial", EN ? "Sales" : "Comercial"],
  operaciones: [(EN ? "/en" : "") + "/demos/operaciones", EN ? "Operations" : "Operaciones"],
  atencion: [(EN ? "/en" : "") + "/demos/atencion", EN ? "Customer service" : "Atención al cliente"],
  os: [(EN ? "/en" : "") + "/demos/os", "D-Code OS"],
};
const visor = $("[data-visor]");
if (visor) {
  const marco = $("[data-visor-marco]", visor), titulo = $("[data-visor-t]", visor);
  let volver = null;
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-demo-abrir]"); if (!b) return;
    const d = DEMOS[b.dataset.demoAbrir]; if (!d) return;
    e.preventDefault(); volver = b;
    titulo.textContent = d[1] + (EN ? " · demo, invented data" : " · demo, datos inventados");
    if (marco.getAttribute("src") !== d[0]) marco.src = d[0];
    marco.title = d[1];
    visor.showModal(); document.documentElement.classList.add("visor-abierto");
  });
  $("[data-visor-cerrar]", visor).addEventListener("click", () => visor.close());
  visor.addEventListener("click", (e) => { if (e.target === visor) visor.close(); });
  visor.addEventListener("close", () => { document.documentElement.classList.remove("visor-abierto"); volver && volver.focus(); });
  // «Salir de la demo» dentro de la aplicación (en el marco) cierra el visor en vez de abrir la web dentro de él
  addEventListener("message", (e) => { if (e.origin === location.origin && e.data && e.data.dcode === "cerrar-demo" && visor.open) visor.close(); });
}

/* Demos: ni su CSS ni su código bloquean la primera pintura. El CSS se pide
   en cuanto la página está en reposo (la sección queda muy por debajo del
   pliegue); el código, cuando la sección se acerca. Sin JS: <noscript>. */
const demos = $("[data-demos]");
if (demos) {
  let css;
  const cssDemos = () => css || (css = new Promise((ok) => {
    if (document.querySelector('link[href^="/assets/v2/demos.css"]')) return ok(); // ya viene en la página, con su versión
    const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "/assets/v2/demos.css?v=54d9def646"; // siempre con versión: la URL sin versión puede estar en la caché del navegador con la hoja vieja
    l.onload = l.onerror = () => ok(); document.head.appendChild(l);
  }));
  const reposo = window.requestIdleCallback || ((f) => setTimeout(f, 1200));
  addEventListener("load", () => reposo(cssDemos), { once: true });
  const cargarDemos = () => Promise.all([cssDemos(), import("/assets/v2/js/demos.js?v=95968f9ee7")]).then(([, { montarDemos }]) => montarDemos(demos)).catch((e) => console.warn("demos", e));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); cargarDemos(); } }, { rootMargin: "600px 0px" });
    io.observe(demos);
  } else cargarDemos();
}
