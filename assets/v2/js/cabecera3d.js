/* ==========================================================================
   D-CODE · la máquina de la portada, en la cabecera de las páginas interiores
   --------------------------------------------------------------------------
   Cada página abre con la parte de la máquina que le corresponde: el motor de
   noche para las automatizaciones, la lupa sobre la factura para los agentes
   de IA, las ruedas azules para las integraciones, los tambores del registro
   para Finance, el módulo de cada área para su departamento, la tapa grabada
   para contacto y páginas web, las piezas sueltas para el blog.
   Es el mismo motor (/assets/v2/js/maquina.js), a menos resolución; solo pinta
   mientras la cabecera se ve. No se monta en el teléfono (la cabecera no tiene
   sitio libre y taparía el título), con el tema claro, con movimiento
   reducido, con ahorro de datos ni sin WebGL2: ahí (salvo con el tema claro)
   la cabecera lleva una foto fija de ese mismo capítulo, que no cuesta nada.
   ========================================================================== */
const cab = document.querySelector(".pag-cab");
const ruta = (location.pathname.replace(/^\/en(?=\/|$)/, "").replace(/\.html$/, "").replace(/\/$/, "")) || "/";
// [ruta, capítulo, área (módulo que se mira de cerca) o cámara propia {p, m, fov, foco, ab}]
const MAPA = [
  [/^\/servicios\/automatizaciones$/, 3, { p: [-3.4, -0.6, 3.4], m: [-0.6, 2.2, 0.3], fov: 34, foco: 4.6, ab: 0.4 }],
  [/^\/servicios\/agentes-de-ia$/, 4, { p: [2.4, -5.4, 3.0], m: [0.45, -3.0, 0.35], fov: 32, foco: 3.9, ab: 0.45 }],
  [/^\/servicios\/integraciones$/, 2, { p: [-3.6, -2.6, 4.2], m: [-2.1, 0.2, 0.3], fov: 34, foco: 5.0, ab: 0.4 }],
  [/^\/servicios\/sistemas-a-medida$/, 2, { p: [-5, -8, 15], m: [0, 0, 0], fov: 30, foco: 17.5, ab: 0.14 }],
  [/^\/servicios\/paginas-web$/, 8, null], [/^\/contacto$/, 8, null],
  [/^\/sistema-financiero$/, 5, { p: [0.6, -5.2, 5.4], m: [0.5, -2.2, 0.3], fov: 30, foco: 6.2, ab: 0.3 }],
  [/^\/que-hacemos$/, 2, { p: [-5, -8, 15], m: [0, 0, 0], fov: 30, foco: 17.5, ab: 0.14 }],
  [/^\/departamentos\/(comercial|marketing)$/, 2, "ventas"], [/^\/departamentos\/(clientes|soporte)$/, 2, "clientes"], [/^\/departamentos\/produccion$/, 2, "operaciones"], [/^\/departamentos\/(finanzas|administracion)$/, 2, "finanzas"], [/^\/departamentos\/direccion$/, 2, "direccion"],
  [/^\/(precios|metodo|garantias|casos-exito|conocenos|cambios-en-proceso|faq)$/, 6, null], [/^\/blog(\/|$)/, 1, { p: [-2.4, 0.8, 9.5], m: [1.6, 0.2, 0], fov: 36, foco: 8.6, ab: 0.5 }],
];
const plan = MAPA.find(([re]) => re.test(ruta));
const raiz = document.documentElement;
const puede = () => raiz.dataset.theme !== "light" && !matchMedia("(max-width: 860px)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches && !(navigator.connection && navigator.connection.saveData);

if (cab && plan) {
  let maq = null, lienzo = null, visible = false, pedido = false, foto = null;
  // la foto fija del capítulo, para quien no va a ver la escena
  const FOTOS = ["claro", "hoy", "sistema", "automatizacion", "inteligencia", "finance", "resultado", "resultado", "tuyo"];
  const ponerFoto = (si) => {
    if (si && !foto) { foto = document.createElement("div"); foto.className = "cab-foto"; foto.setAttribute("aria-hidden", "true"); foto.style.backgroundImage = `url("/assets/v2/img/maquina/${FOTOS[plan[1]]}-${matchMedia("(max-width: 860px)").matches ? "v" : "h"}.webp")`; cab.prepend(foto); }
    if (foto) foto.hidden = !si;
  };
  const sinEscena = () => raiz.dataset.theme !== "light" && !puede();
  const marcha = () => { ponerFoto(sinEscena()); if (!maq) return; const si = visible && puede() && !document.hidden; if (si && !maq.vivo) maq.iniciar(); else if (!si && maq.vivo) maq.parar(); if (lienzo) lienzo.hidden = !puede(); };
  const montar = () => {
    if (pedido || !puede()) return; pedido = true;
    import("/assets/v2/js/maquina.js?v=dd7bde5a98").then(({ crearMaquina, hayWebGL2 }) => {
      if (!hayWebGL2()) { if (raiz.dataset.theme !== "light") ponerFoto(true); return; }
      lienzo = document.createElement("canvas"); lienzo.className = "cab3d"; lienzo.setAttribute("aria-hidden", "true"); cab.prepend(lienzo);
      maq = crearMaquina(lienzo, { intro: false, pixeles: 1.0e6, tomas: 20, muestras: 0, mapaSombra: 1024, idioma: raiz.lang === "en" ? "en" : "es" });
      if (!maq) { lienzo.remove(); lienzo = null; if (raiz.dataset.theme !== "light") ponerFoto(true); return; }
      const [, cap, vista] = plan;
      maq.capitulo(cap, true);
      if (typeof vista === "string") { maq.area(vista); maq.est.selMezcla = 1; const mo = maq.info.modulos[vista]; maq.est.selX = mo.x; maq.est.selY = mo.y; maq.rodaje({ d: [0, 0] }); }
      else maq.rodaje(vista ? { ...vista, d: [0, 0] } : { d: [0, 0] });
      if (cap === 4 || cap === 5) maq.lectura(0.45, 1);
      if (cap === 5) maq.registro(150040);
      if (cap === 8) { const e = (new URLSearchParams(location.search).get("empresa") || "").trim().slice(0, 28); if (e) maq.grabar({ nombre: e.toUpperCase() }); }
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => maq.redibujar());
      addEventListener("pointermove", (e) => { const r = cab.getBoundingClientRect(); if (e.clientY < r.bottom) maq.puntero((e.clientX / innerWidth) * 2 - 1, 1 - ((e.clientY - r.top) / r.height) * 2, true); }, { passive: true });
      let ancho = innerWidth; addEventListener("resize", () => { if (innerWidth !== ancho) { ancho = innerWidth; maq.medir(); } });
      document.addEventListener("visibilitychange", marcha);
      new MutationObserver(marcha).observe(raiz, { attributes: true, attributeFilter: ["data-theme"] });
      marcha(); requestAnimationFrame(() => requestAnimationFrame(() => lienzo.classList.add("is-viva")));
      // si el aparato no llega, primero se baja la calidad
      let n = 0, suma = 0, ultimo = 0, nivel = 0;
      maq.alCuadro(() => { const t = performance.now(); if (ultimo) { suma += t - ultimo; n++; } ultimo = t; if (n === 60) { const ms = suma / n; n = 0; suma = 0; if (ms > 30 && nivel < 3) maq.calidad(++nivel); } });
    }).catch(() => {});
  };
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) montar(); marcha(); }).observe(cab);
  new MutationObserver(() => { if (puede()) montar(); marcha(); }).observe(raiz, { attributes: true, attributeFilter: ["data-theme"] });
  marcha();
}

/* Contacto: si se llega desde el cierre de la portada, el formulario ya trae el nombre y lo que no encaja. */
if (ruta === "/contacto") {
  const p = new URLSearchParams(location.search), f = document.getElementById("contact-form");
  if (f && (p.get("empresa") || p.get("areas"))) {
    const empresa = f.querySelector('[name="empresa"]'), mensaje = f.querySelector('[name="mensaje"]'), en = raiz.lang === "en";
    if (empresa && p.get("empresa") && !empresa.value) empresa.value = p.get("empresa").slice(0, 80);
    if (mensaje && p.get("areas") && !mensaje.value) mensaje.value = (en ? "What does not fit today: " : "Lo que hoy no encaja: ") + p.get("areas").slice(0, 200) + ".";
  }
}
