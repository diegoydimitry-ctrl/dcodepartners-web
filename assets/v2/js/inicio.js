/* ==========================================================================
   D-CODE · portada
   El 3D de la portada es el fondo vivo común a toda la web (sitio.js →
   /assets/v2/js/fondo3d.js): aquí solo quedan el visor de las demos y la
   carga diferida de sus escenas.
   ========================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const EN = document.documentElement.lang === "en";

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
