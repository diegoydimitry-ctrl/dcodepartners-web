/* ==========================================================================
   D-CODE · la sala de la portada, en la cabecera de las páginas interiores
   --------------------------------------------------------------------------
   Cada página abre con el rincón de la sala que le corresponde: los carriles
   para las áreas y las integraciones, el pórtico que lee para los agentes de
   IA, la noche para las automatizaciones, la factura para Finance, la planta
   para precios y método, la hoja en blanco para contacto y páginas web.
   Es el mismo motor (/assets/v2/js/mundo.js), con menos hojas y a menos
   resolución; solo pinta mientras la cabecera se ve. No se monta en el
   teléfono (la cabecera no tiene sitio libre y taparía el título), con el tema
   claro, con movimiento reducido, con ahorro de datos ni sin WebGL2.
   ========================================================================== */
const cab = document.querySelector(".pag-cab");
const ruta = (location.pathname.replace(/^\/en(?=\/|$)/, "").replace(/\.html$/, "").replace(/\/$/, "")) || "/";
const MAPA = [
  [/^\/servicios\/automatizaciones$/, 4], [/^\/servicios\/agentes-de-ia$/, 3], [/^\/servicios\/integraciones$/, 2], [/^\/servicios\/sistemas-a-medida$/, 6], [/^\/servicios\/paginas-web$/, 8],
  [/^\/sistema-financiero$/, 5], [/^\/que-hacemos$/, 2],
  [/^\/departamentos\/(comercial|marketing)$/, 2, 0], [/^\/departamentos\/(clientes|soporte)$/, 2, 1], [/^\/departamentos\/produccion$/, 2, 2], [/^\/departamentos\/(finanzas|administracion)$/, 2, 3], [/^\/departamentos\/direccion$/, 2, 4],
  [/^\/(precios|metodo|garantias|casos-exito|conocenos|cambios-en-proceso|faq)$/, 6], [/^\/blog(\/|$)/, 0], [/^\/contacto$/, 8],
];
const plan = MAPA.find(([re]) => re.test(ruta));
// el encuadre de cada rincón dentro de la ventana de la cabecera (la portada los desplaza para dejar sitio a su texto; aquí van centrados)
const ENCUADRE = { 0: { d: [0, 0] }, 2: { d: [0, 0], fov: 36 }, 3: { d: [0.08, 0] }, 4: { d: [0, 0] }, 5: { d: [0, 0] }, 6: { d: [0.3, -0.16], fov: 28 }, 8: { d: [0, 0] } };
const raiz = document.documentElement;
const puede = () => raiz.dataset.theme !== "light" && !matchMedia("(max-width: 860px)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches && !(navigator.connection && navigator.connection.saveData);

if (cab && plan) {
  let mundo = null, lienzo = null, visible = false, pedido = false;
  const marcha = () => { if (!mundo) return; const si = visible && puede() && !document.hidden; if (si && !mundo.vivo) mundo.iniciar(); else if (!si && mundo.vivo) mundo.parar(); if (lienzo) lienzo.hidden = !puede(); };
  const montar = () => {
    if (pedido || !puede()) return; pedido = true;
    import("/assets/v2/js/mundo.js?v=24812e9ff9").then(({ crearMundo, hayWebGL2 }) => {
      if (!hayWebGL2()) return;
            lienzo = document.createElement("canvas"); lienzo.className = "cab3d"; lienzo.setAttribute("aria-hidden", "true"); cab.prepend(lienzo);
      mundo = crearMundo(lienzo, { hojas: 760, reflejo: false, intro: false, pixeles: 9e5, pasosBruma: 10, idioma: raiz.lang === "en" ? "en" : "es" });
      if (!mundo) { lienzo.remove(); return; }
      mundo.capitulo(plan[1], true); mundo.rodaje(ENCUADRE[plan[1]] || null); if (plan[2] !== undefined) mundo.carril(plan[2]);
      addEventListener("pointermove", (e) => { const r = cab.getBoundingClientRect(); if (e.clientY < r.bottom) mundo.puntero((e.clientX / innerWidth) * 2 - 1, 1 - ((e.clientY - r.top) / r.height) * 2, true); }, { passive: true });
      let ancho = innerWidth; addEventListener("resize", () => { if (innerWidth !== ancho) { ancho = innerWidth; mundo.medir(); } });
      document.addEventListener("visibilitychange", marcha);
      new MutationObserver(marcha).observe(raiz, { attributes: true, attributeFilter: ["data-theme"] });
      marcha(); requestAnimationFrame(() => requestAnimationFrame(() => lienzo.classList.add("is-viva")));
      // si el aparato no llega, primero se baja la resolución
      let n = 0, suma = 0, ultimo = 0, nivel = 0;
      mundo.alCuadro(() => { const t = performance.now(); if (ultimo) { suma += t - ultimo; n++; } ultimo = t; if (n === 60) { const ms = suma / n; n = 0; suma = 0; if (ms > 30 && nivel < 3) mundo.calidad(++nivel); } });
    }).catch(() => {});
  };
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) montar(); marcha(); }).observe(cab);
  new MutationObserver(() => { if (puede()) montar(); }).observe(raiz, { attributes: true, attributeFilter: ["data-theme"] });
}
