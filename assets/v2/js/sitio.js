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
/* Asistente: una cabecera que dice quién responde y con qué, y tres preguntas rápidas que dependen de la página en
   la que estás (en Finance, sobre Finance; en Precios, sobre precios…). Todo pasa por el mismo /api/chat: el script del
   asistente (main-b.js) lee el texto de cada botón al pulsarlo, así que basta con cambiar el texto antes de que cargue. */
{
  const ventana = document.querySelector("#chat-widget .chat-window"), rapidas = [...document.querySelectorAll("#chat-quick-replies .chat-quick-question")];
  const EN = document.documentElement.lang === "en", ruta = location.pathname.replace(/^\/en(?=\/|$)/, "").replace(/\.html$/, "") || "/";
  if (ventana && !ventana.querySelector(".chat-cab")) {
    const cab = document.createElement("div"); cab.className = "chat-cab";
    cab.innerHTML = `<span class="chat-cab-marca" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span><b>${EN ? "D-Code assistant" : "Asistente de D-Code"}</b><span>${EN ? "Answers with the information on this website." : "Responde con la información de esta web."}</span></span>`;
    ventana.prepend(cab);
  }
  const P = EN ? {
    "/sistema-financiero": ["How much does Finance cost?", "Can it read PDF invoices?", "Is it VERI*FACTU ready?"],
    "/precios": ["What does the setup include?", "Is there a minimum term?", "I want a quote"],
    "/servicios/agentes-de-ia": ["Does the agent make things up?", "Does it work on WhatsApp?", "How much does an agent cost?"],
    "/departamentos": ["What would you build for my team?", "How much does it cost to start?", "I want to see a demo"],
  } : {
    "/sistema-financiero": ["¿Cuánto cuesta Finance?", "¿Lee las facturas en PDF?", "¿Está preparado para VERI*FACTU?"],
    "/precios": ["¿Qué incluye la puesta en marcha?", "¿Hay permanencia?", "Quiero un presupuesto"],
    "/servicios/agentes-de-ia": ["¿El agente se inventa respuestas?", "¿Funciona por WhatsApp?", "¿Cuánto cuesta un agente?"],
    "/departamentos": ["¿Qué haríais en mi área?", "¿Cuánto cuesta empezar?", "Quiero ver una demo"],
  };
  const clave = Object.keys(P).find((k) => ruta === k || ruta.startsWith(k + "/"));
  if (clave && rapidas.length === 3) rapidas.forEach((b, i) => { b.textContent = P[clave][i]; });
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

/* ------------------------------------------------------------ el fondo vivo
   Una escena 3D fija detrás de toda la web (assets/v2/js/fondo3d.js, fuente
   scripts/v2/escena/fondo.js). Cada sección pide una forma (data-escena), un
   lado (data-lado: der · izq · centro · abajo) y una intensidad (data-intensidad);
   las que no dicen nada reciben una según su tipo (los capítulos de las páginas
   interiores, «al fondo»: lejos y apagada, porque su texto ocupa todo el ancho). Manda la sección que cruza el
   centro de la pantalla. Se carga cuando el navegador tiene un respiro (el texto
   es lo primero). Sin WebGL, con movimiento reducido, con ahorro de datos o en
   aparatos con muy poca memoria, no hay fondo: la web se lee igual. */
{
  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ahorro = navigator.connection && navigator.connection.saveData;
  const poca = (navigator.deviceMemory || 8) <= 2;
  const webgl = (() => { try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch (e) { return false; } })();
  const main = document.querySelector("main");
  if (main && !reducido && !ahorro && !poca && webgl && !document.body.classList.contains("sin-fondo")) {
    const lectura = document.body.classList.contains("es-lectura");
    const CICLO = ["helice", "ola", "columnas", "anillo", "cubo"];
    let n = 0;
    const secciones = [...main.querySelectorAll(":scope > header, :scope > section, :scope > div > section, :scope > article")].map((el) => {
      const d = el.dataset;
      let forma = d.escena, lado = d.lado || "der", intensidad = d.intensidad != null ? +d.intensidad : 1;
      if (!forma) {
        if (el.matches(".papel, .fin-demo") || el.querySelector("[data-demos], iframe, .webs3d, [data-webs3d]")) { forma = "polvo"; intensidad = 0.25; }
        else if (lectura) { forma = "polvo"; intensidad = 0.55; }
        else if (el.matches("header, .pag-cab")) { forma = "cubo"; intensidad = 0.9; }
        else { forma = CICLO[n++ % CICLO.length]; lado = d.lado || "fondo"; intensidad = 0.6; }
      }
      return { el, forma, lado, intensidad };
    });
    if (secciones.length) {
      const lienzo = document.createElement("canvas"); lienzo.className = "fondo-3d"; lienzo.setAttribute("aria-hidden", "true");
      document.body.prepend(lienzo);
      let escena = null, activa = null; const estrecho = matchMedia("(max-width: 900px)");
      const elegir = () => {
        const y = innerHeight * 0.5; let s = secciones[0];
        for (const x of secciones) { const r = x.el.getBoundingClientRect(); if (r.top <= y && r.bottom > y) { s = x; break; } if (r.top > y) break; s = x; }
        if (s === activa) return; activa = s;
        // en el teléfono el texto ocupa todo el ancho: fuera de la primera pantalla, el fondo va a media luz
        lienzo.style.opacity = String(estrecho.matches && s !== secciones[0] ? Math.min(s.intensidad, 0.45) : s.intensidad);
        if (escena) escena.ir(s.forma, s.lado);
      };
      let pend = 0; addEventListener("scroll", () => { if (!pend) pend = requestAnimationFrame(() => { pend = 0; elegir(); }); }, { passive: true });
      addEventListener("resize", elegir, { passive: true });
      const cargar = () => import("/assets/v2/js/fondo3d.js?v=5dcb9a912b").then(({ montar }) => {
        const raiz = document.documentElement, claro = () => raiz.dataset.theme === "light";
        escena = montar(lienzo, { movil: matchMedia("(max-width: 760px)").matches || (navigator.deviceMemory || 8) <= 4 });
        escena.tema(claro()); new MutationObserver(() => escena.tema(claro())).observe(raiz, { attributes: true, attributeFilter: ["data-theme"] });
        activa = null; elegir();
        if (new URLSearchParams(location.search).has("depurar")) window.__fondo = escena;
        requestAnimationFrame(() => lienzo.classList.add("is-lista"));
        // un clic en un hueco (no en un enlace, un botón, un campo ni una demo) dispersa las piezas cercanas
        addEventListener("pointerdown", (e) => {
          if (e.button !== 0 || !activa || activa.intensidad < 0.5) return;
          if (e.target.closest("a, button, input, textarea, select, summary, label, iframe, dialog, [role=button], [role=tab], [contenteditable], .chat-widget, .cab, .hoja, p, h1, h2, h3, li")) return;
          escena.dispersar(e.clientX, e.clientY);
        });
      }).catch((e) => { console.warn("fondo", e); lienzo.remove(); });
      elegir();
      addEventListener("load", () => (window.requestIdleCallback || ((f) => setTimeout(f, 200)))(cargar, { timeout: 1500 }), { once: true });
    }
  }
}
