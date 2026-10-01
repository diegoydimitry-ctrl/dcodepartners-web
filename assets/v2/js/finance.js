/* D-Code Finance · página mínima (29/09/2026): la demo de Finance ahí mismo (su CSS y su código solo cuando la
   sección se acerca), el visor de la aplicación completa y los detalles plegados que se abren si se enlazan. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const EN = document.documentElement.lang === "en";

/* «Así entra una factura en Finance»: escena 3D (assets/v2/js/factura3d.js, fuente scripts/v2/escena/factura.js)
   ligada al scroll; cada paso se sostiene un rato antes del siguiente. Movimiento reducido, sin WebGL o con
   ahorro de datos: los cuatro pasos en texto, quietos. */
const papel = $("[data-papel]");
if (papel) {
  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches, ahorro = navigator.connection && navigator.connection.saveData;
  const webgl = (() => { try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch (e) { return false; } })();
  if (reducido || ahorro || !webgl) papel.classList.add("is-quieta");
  else {
    const pasos = $$("[data-paso]", papel), N = 3;
    let escena = null, etapa = 0, actual = 0;
    const leer = () => {
      const r = papel.getBoundingClientRect(), p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
      const x = p * N, k = Math.floor(x), f = x - k, g = Math.min(1, Math.max(0, (f - 0.3) / 0.55));
      etapa = Math.min(N, k + g * g * (3 - 2 * g)); if (escena) escena.etapa(etapa);
      const c = Math.min(N, Math.round(etapa)); if (c !== actual) { actual = c; pasos.forEach((el) => el.classList.toggle("is-activa", +el.dataset.paso === c)); }
    };
    addEventListener("scroll", leer, { passive: true }); addEventListener("resize", leer, { passive: true }); leer();
    const montar = () => import("/assets/v2/js/factura3d.js?v=e81b2ec209").then(async ({ montar }) => {
      const raiz = document.documentElement, claro = () => raiz.dataset.theme === "light";
      escena = await montar($("[data-papel-lienzo]", papel), { movil: matchMedia("(max-width: 760px)").matches, en: EN });
      escena.tema(claro()); new MutationObserver(() => escena.tema(claro())).observe(raiz, { attributes: true, attributeFilter: ["data-theme"] });
      escena.etapa(etapa, true);
      if (new URLSearchParams(location.search).has("depurar")) window.__factura = escena;
      requestAnimationFrame(() => requestAnimationFrame(() => papel.classList.add("is-escena")));
    }).catch((e) => { console.warn("factura", e); papel.classList.add("is-quieta"); });
    // la escena se pide cuando la sección se acerca (está justo debajo del título: casi siempre al empezar)
    if ("IntersectionObserver" in window) { const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); (window.requestIdleCallback || ((f) => setTimeout(f, 80)))(montar, { timeout: 700 }); } }, { rootMargin: "300px 0px" }); io.observe(papel); } else montar();
  }
}

const demos = $("[data-demos]");
if (demos) {
  let css;
  const cssDemos = () => css || (css = new Promise((ok) => {
    if (document.querySelector('link[href^="/assets/v2/demos.css"]')) return ok(); // ya viene en la página, con su versión
    const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "/assets/v2/demos.css?v=54d9def646"; // siempre con versión: la URL sin versión puede estar en la caché del navegador con la hoja vieja
    l.onload = l.onerror = () => ok(); document.head.appendChild(l);
  }));
  const cargar = () => Promise.all([cssDemos(), import("/assets/v2/js/demos.js?v=95968f9ee7")]).then(([, { montarDemos }]) => montarDemos(demos)).catch((e) => console.warn("demo", e));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); cargar(); } }, { rootMargin: "700px 0px" });
    io.observe(demos);
  } else cargar();
}

const visor = $("[data-visor]");
if (visor) {
  const marco = $("[data-visor-marco]", visor), titulo = $("[data-visor-t]", visor);
  const APP = [EN ? "/en/sistema-financiero/app" : "/sistema-financiero/app", "D-Code Finance"];
  let volver = null;
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-demo-abrir]"); if (!b) return;
    e.preventDefault(); volver = b;
    titulo.textContent = APP[1] + (EN ? " · demo, invented data" : " · demo, datos inventados");
    if (marco.getAttribute("src") !== APP[0]) marco.src = APP[0];
    marco.title = APP[1]; visor.showModal(); document.documentElement.classList.add("visor-abierto");
  });
  $("[data-visor-cerrar]", visor).addEventListener("click", () => visor.close());
  visor.addEventListener("click", (e) => { if (e.target === visor) visor.close(); });
  visor.addEventListener("close", () => { document.documentElement.classList.remove("visor-abierto"); volver && volver.focus(); });
  // «Salir de la demo» dentro de la aplicación (en el marco) cierra el visor en vez de abrir la web dentro de él
  addEventListener("message", (e) => { if (e.origin === location.origin && e.data && e.data.dcode === "cerrar-demo" && visor.open) visor.close(); });
}

// Enlaces a #planes, #verifactu, #conciliacion…: el detalle plegado se abre y se baja a él
function abrirAncla() {
  const id = decodeURIComponent(location.hash.slice(1)); if (!id) return;
  const t = document.getElementById(id); const d = t && t.closest("details");
  if (d && !d.open) { d.open = true; requestAnimationFrame(() => t.scrollIntoView({ block: "start" })); }
}
addEventListener("hashchange", abrirAncla); abrirAncla();
