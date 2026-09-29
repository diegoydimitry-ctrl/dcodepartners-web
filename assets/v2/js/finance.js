/* D-Code Finance · página mínima (29/09/2026): la demo de Finance ahí mismo (su CSS y su código solo cuando la
   sección se acerca), el visor de la aplicación completa y los detalles plegados que se abren si se enlazan. */
const $ = (s, r = document) => r.querySelector(s);
const EN = document.documentElement.lang === "en";

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
