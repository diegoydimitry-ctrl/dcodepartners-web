/* D-Code Finance · página mínima (29/09/2026): la demo de Finance ahí mismo (su CSS y su código solo cuando la
   sección se acerca), el visor de la aplicación completa y los detalles plegados que se abren si se enlazan. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const EN = document.documentElement.lang === "en";

/* «Así entra una factura en Finance»: escena 3D (assets/v2/js/factura3d.js, fuente scripts/v2/escena/factura.js)
   que se reproduce sola cuando la sección está a la vista (sin recorridos largos de scroll): llega la factura, la
   IA la lee, sus campos salen como datos y queda registrada. Al terminar, «Ver otra vez». Movimiento reducido,
   sin WebGL o con ahorro de datos: los cuatro pasos en texto, quietos. */
const papel = $("[data-papel]");
if (papel) {
  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches, ahorro = navigator.connection && navigator.connection.saveData;
  const webgl = (() => { try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch (e) { return false; } })();
  if (reducido || ahorro || !webgl) papel.classList.add("is-quieta");
  else {
    const pasos = $$("[data-paso]", papel);
    const otra = document.createElement("button"); otra.type = "button"; otra.className = "boton papel-otra"; otra.hidden = true; otra.textContent = EN ? "Watch it again" : "Ver otra vez";
    $(".papel-pasos", papel).after(otra);
    // guion: [segundo en que empieza, etapa]; entre dos marcas la etapa avanza en 0,8 s
    const GUION = [[0, 0], [1.6, 1], [5.4, 2], [9.4, 3]], FIN = 13;
    let escena = null, t0 = null, raf = 0, visto = false, actual = -1;
    const etapaEn = (t) => { let e = 0; for (const [s, k] of GUION) { if (t >= s) e = Math.min(k, (k - 1) + Math.min(1, (t - s) / 0.8)); } return Math.max(0, e); };
    const marcar = (e) => { const c = Math.round(e); if (c === actual) return; actual = c; pasos.forEach((el) => el.classList.toggle("is-activa", +el.dataset.paso === c)); };
    const tic = (ahora) => {
      raf = 0; if (t0 == null) t0 = ahora;
      const t = (ahora - t0) / 1000, e = etapaEn(t); marcar(e); if (escena) escena.etapa(e);
      if (t < FIN) raf = requestAnimationFrame(tic); else otra.hidden = false;
    };
    const reproducir = () => { t0 = null; otra.hidden = true; if (!raf) raf = requestAnimationFrame(tic); };
    otra.addEventListener("click", () => { if (escena) escena.etapa(0, true); reproducir(); });
    const montar = () => import("/assets/v2/js/factura3d.js?v=e058a1c90d").then(async ({ montar }) => {
      const raiz = document.documentElement, claro = () => raiz.dataset.theme === "light";
      escena = await montar($("[data-papel-lienzo]", papel), { movil: matchMedia("(max-width: 760px)").matches, en: EN });
      escena.tema(claro()); new MutationObserver(() => escena.tema(claro())).observe(raiz, { attributes: true, attributeFilter: ["data-theme"] });
      escena.etapa(0, true);
      if (new URLSearchParams(location.search).has("depurar")) window.__factura = escena;
      requestAnimationFrame(() => requestAnimationFrame(() => papel.classList.add("is-escena")));
    }).catch((e) => { console.warn("factura", e); papel.classList.add("is-quieta"); });
    // se carga al acercarse y empieza cuando se ve más de la mitad (y solo la primera vez sola)
    if ("IntersectionObserver" in window) {
      let pedida = false;
      new IntersectionObserver((es) => { for (const e of es) { if (e.isIntersecting && !pedida) { pedida = true; montar(); } } }, { rootMargin: "400px 0px" }).observe(papel);
      new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting && !visto) { visto = true; const empezar = () => (escena ? reproducir() : setTimeout(empezar, 150)); empezar(); } }, { threshold: 0.55 }).observe($(".papel-fijo", papel));
    } else { montar().then(reproducir); }
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
