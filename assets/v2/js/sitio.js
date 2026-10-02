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
  if (document.startViewTransition && !REDUCIDO) { raiz.classList.add("vt-tema"); document.startViewTransition(aplicar).finished.finally(() => raiz.classList.remove("vt-tema")); } else aplicar();
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
/* El asistente no tapa lo que se lee (rev. 28/09): en pantallas estrechas, al bajar leyendo se aparta; al subir,
   arriba del todo o al llegar al final, vuelve (no reaparece sola encima de lo que se está leyendo). Abierto, no se mueve. */
{
  const w = document.getElementById("chat-widget");
  const estrecha = matchMedia("(max-width: 760px)");
  if (w) {
    let y0 = scrollY;
    const abierto = () => w.classList.contains("open") || w.querySelector('[aria-expanded="true"]');
    const mostrar = (si) => w.classList.toggle("is-apartado", !si && !abierto());
    addEventListener("scroll", () => {
      if (!estrecha.matches) return mostrar(true);
      const y = scrollY, fin = innerHeight + y >= document.documentElement.scrollHeight - 40;
      if (Math.abs(y - y0) > 6) { mostrar(y < y0 || fin || y < 80); y0 = y; }
    }, { passive: true });
  }
}
if (!document.getElementById("contact-form") && document.getElementById("chat-widget")) {
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

/* Pie: en el teléfono las cuatro columnas empiezan plegadas; en pantallas grandes no se pliegan (sin JS, abiertas). */
{
  const cols = [...document.querySelectorAll(".pie-col")];
  const estrecho = matchMedia("(max-width: 560px)");
  const aplicar = () => cols.forEach((d) => { if (estrecho.matches) d.removeAttribute("open"); else d.setAttribute("open", ""); });
  if (cols.length) {
    aplicar(); estrecho.addEventListener?.("change", aplicar);
    cols.forEach((d) => d.querySelector("summary").addEventListener("click", (e) => { if (!estrecho.matches) e.preventDefault(); }));
  }
}

/* Capítulos largos en el teléfono (rev. 28/09): una página interior de 20 pantallas no se lee en vertical. En pantallas
   estrechas, el cuerpo de un capítulo que ocupa más de pantalla y media se enseña hasta algo menos de una pantalla, con
   «Seguir leyendo». El texto sigue entero en la página (buscadores, lectores de pantalla y «buscar en la página»:
   al encontrar algo dentro, el capítulo se abre solo). Las páginas de lectura (legales, blog) no se pliegan. */
{
  const estrecho = matchMedia("(max-width: 640px)");
  const EN = document.documentElement.lang === "en";
  if (estrecho.matches && !document.body.classList.contains("es-lectura")) {
    const plegar = () => document.querySelectorAll("main .capitulo .capitulo-cuerpo").forEach((c, i) => {
      if (c.dataset.plegable || c.scrollHeight < innerHeight * 1.5) return;
      c.dataset.plegable = "1"; c.classList.add("is-plegado"); c.style.setProperty("--alto", `${Math.round(innerHeight * 0.78)}px`);
      if (!c.id) c.id = `cuerpo-cap-${i}`;
      const b = document.createElement("button"); b.type = "button"; b.className = "seguir-leyendo"; b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-controls", c.id);
      b.innerHTML = `<span>${EN ? "Keep reading" : "Seguir leyendo"}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`;
      const abrir = () => { c.classList.remove("is-plegado"); b.remove(); };
      b.addEventListener("click", abrir);
      c.addEventListener("beforematch", abrir);
      c.after(b);
    });
    if (document.readyState === "complete") plegar(); else addEventListener("load", plegar, { once: true });
  }
}

/* La sala de la portada en la cabecera de las páginas interiores: se pide cuando la página ya se ha pintado. */
if (document.querySelector(".pag-cab")) (window.requestIdleCallback || ((f) => setTimeout(f, 200)))(() => import("/assets/v2/js/cabecera3d.js?v=eeafc2e89a").catch(() => {}), { timeout: 1500 });
