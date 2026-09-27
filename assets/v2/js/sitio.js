/* ==========================================================================
   D-CODE · comportamiento común (cabecera, menú, tema, apariciones)
   Sin dependencias. Todo funciona con teclado y respeta el movimiento reducido.
   ========================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const raiz = document.documentElement;
const REDUCIDO = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------------------------------------------------------- tema */
$$("[data-tema]").forEach((b) => b.addEventListener("click", () => {
  const claro = raiz.dataset.theme !== "light";
  const aplicar = () => { raiz.dataset.theme = claro ? "light" : "dark"; try { localStorage.setItem("dcp-tema", claro ? "light" : "dark"); } catch (e) { /* sin almacenamiento */ } };
  // El cambio de tema como cambio de luz: un fundido corto de toda la vista.
  if (document.startViewTransition && !REDUCIDO) document.startViewTransition(aplicar); else aplicar();
}));

/* ------------------------------------------------------------ cabecera */
const cab = $("[data-cab]");
if (cab) {
  let ultimo = scrollY, pendiente = false;
  const mirar = () => {
    pendiente = false;
    const y = scrollY, abierto = cab.querySelector(".plano.is-abierto");
    cab.classList.toggle("is-solida", y > 24);
    if (!abierto) cab.classList.toggle("is-oculta", y > 480 && y > ultimo + 2);
    if (y < ultimo - 2) cab.classList.remove("is-oculta");
    ultimo = y;
  };
  addEventListener("scroll", () => { if (!pendiente) { pendiente = true; requestAnimationFrame(mirar); } }, { passive: true });
  cab.addEventListener("focusin", () => cab.classList.remove("is-oculta"));
  mirar();
}

/* --------------------------------------------- «Qué hacemos» (plano) */
const pb = $("[data-plano-b]"), plano = $("[data-plano]");
if (pb && plano) {
  const abrir = (si) => { pb.setAttribute("aria-expanded", si ? "true" : "false"); plano.classList.toggle("is-abierto", si); if (si) cab.classList.add("is-solida"); };
  pb.addEventListener("click", () => abrir(pb.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && pb.getAttribute("aria-expanded") === "true") { abrir(false); pb.focus(); } });
  document.addEventListener("click", (e) => { if (!cab.contains(e.target)) abrir(false); });
  plano.addEventListener("focusout", (e) => { if (!cab.contains(e.relatedTarget)) abrir(false); });
}

/* ------------------------------------------------------- menú móvil */
const hoja = $("[data-hoja]"), mb = $("[data-menu]");
if (hoja && mb) {
  let volver = null;
  const abrir = (si) => {
    mb.setAttribute("aria-expanded", si ? "true" : "false");
    if (si) { volver = document.activeElement; hoja.hidden = false; requestAnimationFrame(() => hoja.classList.add("is-abierta")); raiz.style.overflow = "hidden"; $("a, button", hoja).focus(); }
    else { hoja.classList.remove("is-abierta"); raiz.style.overflow = ""; setTimeout(() => { hoja.hidden = true; }, 260); volver && volver.focus(); }
  };
  mb.addEventListener("click", () => abrir(true));
  $("[data-menu-cerrar]", hoja).addEventListener("click", () => abrir(false));
  hoja.addEventListener("keydown", (e) => {
    if (e.key === "Escape") abrir(false);
    if (e.key === "Tab") { // el foco no sale de la hoja
      const f = $$("a, button", hoja).filter((x) => x.offsetParent);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
    }
  });
  $$("a", hoja).forEach((a) => a.addEventListener("click", () => abrir(false)));
}

/* ---------------------------------------------------------- apariciones
   Solo en lo que entra por primera vez: título, texto y pieza. Una vez. */
const vistos = $$(".aparece");
if (vistos.length) {
  if (REDUCIDO || !("IntersectionObserver" in window)) vistos.forEach((el) => el.classList.add("is-visto"));
  else {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visto"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });
    vistos.forEach((el) => io.observe(el));
  }
}

/* ------------------------------------------- asistente y formulario
   main-b.js (el de producción, sin tocar): el formulario de contacto por
   pasos y el asistente. Nadie lo necesita en el primer segundo; en
   /contacto se pide enseguida porque el formulario se ve al entrar. */
const MAINB = "/assets/js/main-b.js";
const cargarB = () => { if (document.querySelector(`script[src^="${MAINB}"]`)) return; const s = document.createElement("script"); s.src = MAINB; s.defer = true; s.onload = () => { window.__mainB = true; }; document.head.appendChild(s); };
if (document.getElementById("contact-form")) cargarB();
else if (document.getElementById("chat-widget")) {
  const ric = window.requestIdleCallback || ((f) => setTimeout(f, 1200));
  addEventListener("load", () => ric(cargarB, { timeout: 3000 }), { once: true });
  const burbuja = document.getElementById("chat-bubble");
  burbuja?.addEventListener("pointerenter", cargarB, { once: true });
  // si se pulsa antes de que llegue el script, se carga y se repite el clic
  burbuja?.addEventListener("click", function primero(e) {
    if (window.__mainB) return;
    e.stopImmediatePropagation(); burbuja.removeEventListener("click", primero);
    cargarB(); document.querySelector(`script[src^="${MAINB}"]`).addEventListener("load", () => burbuja.click(), { once: true });
  });
}
