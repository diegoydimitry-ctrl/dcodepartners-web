/* ==========================================================================
   D-CODE · portada
   Las piezas: el logotipo en 3D en tiempo real (three.js), en
   /assets/v2/js/piezas3d.js (fuente: scripts/v2/escena/piezas.js).
   - Se pinta primero el texto (LCP) y el 3D llega después, sin bloquear
     (modulepreload a baja prioridad); el lienzo aparece con un fundido.
   - El scroll dentro de la sección fija el progreso; el 3D lo sigue con un
     muelle críticamente amortiguado (sin rebote, sin saltos).
   - Movimiento reducido, sin WebGL o si el 3D falla: la imagen del logotipo
     montado (render de Blender), quieta. Solo entonces se descarga.
   ========================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const EN = document.documentElement.lang === "en";
const REDUCIDO = matchMedia("(prefers-reduced-motion: reduce)").matches;

const sec = $("[data-piezas]");
function hayWebGL() { try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch (e) { return false; } }
if (sec) {
  const lienzo = $("[data-piezas-lienzo]", sec);
  const caps = $$("[data-cap]", sec);
  if (REDUCIDO || !hayWebGL()) {
    sec.classList.add("is-quieta");
  } else {
    const movil = matchMedia("(max-width: 760px)").matches;
    let escena = null;
    let objetivo = 0, actual = 0, vel = 0, ultimo = performance.now(), pendiente = false;
    const leer = () => {
      const r = sec.getBoundingClientRect();
      objetivo = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
      if (escena) escena.progreso(objetivo);
    };
    const cap = (p) => (p < 0.1 ? 0 : p < 0.38 ? 1 : p < 0.7 ? 2 : 3);
    let capActual = 0;
    const pintarCap = (p) => {
      const c = cap(p); if (c === capActual) return; capActual = c;
      caps.forEach((el) => el.classList.toggle("is-activo", +el.dataset.cap === c));
    };
    // Los capítulos siguen el mismo muelle que el 3D (mismas constantes): texto y escena van juntos.
    const bucle = (ahora) => {
      pendiente = false;
      const dt = Math.min(0.05, (ahora - ultimo) / 1000); ultimo = ahora;
      const k = 90, c = 2 * Math.sqrt(k);
      vel += ((objetivo - actual) * k - vel * c) * dt; actual += vel * dt;
      if (Math.abs(objetivo - actual) < 0.0004 && Math.abs(vel) < 0.001) { actual = objetivo; vel = 0; }
      pintarCap(actual); sec.classList.toggle("is-bajado", actual > 0.02);
      if (actual !== objetivo) pedir();
    };
    function pedir() { if (!pendiente) { pendiente = true; ultimo = performance.now(); requestAnimationFrame(bucle); } }
    addEventListener("scroll", () => { leer(); pedir(); }, { passive: true });
    leer(); actual = objetivo; pintarCap(actual);

    // El 3D, cuando el navegador tenga un respiro (el póster ya es el LCP).
    const cargar = () => import("/assets/v2/js/piezas3d.js?v=57444ef6c6").then(({ montar }) => {
      const raiz = document.documentElement;
      const claro = () => raiz.dataset.theme === "light";
      escena = montar(lienzo, { movil, claro: claro() });
      escena.tema(claro());
      new MutationObserver(() => escena.tema(claro())).observe(raiz, { attributes: true, attributeFilter: ["data-theme"] });
      escena.progreso(objetivo, true);
      requestAnimationFrame(() => requestAnimationFrame(() => sec.classList.add("is-escena")));
    }).catch(() => sec.classList.add("is-quieta"));
    // En cuanto el hilo principal tenga un respiro tras el primer pintado (el título es el LCP).
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
  const cargarDemos = () => Promise.all([cssDemos(), import("/assets/v2/js/demos.js?v=4ca7f54240")]).then(([, { montarDemos }]) => montarDemos(demos)).catch((e) => console.warn("demos", e));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); cargarDemos(); } }, { rootMargin: "600px 0px" });
    io.observe(demos);
  } else cargarDemos();
}
