/* ==========================================================================
   D-CODE · la escena de la portada, en la cabecera de las páginas interiores
   --------------------------------------------------------------------------
   Cada página abre con la fotografía del momento de la portada que le
   corresponde: las cosas sueltas para el blog, el sistema conectado para lo
   que hacemos y las integraciones, las tareas hechas solas para las
   automatizaciones y los departamentos, la factura que se lee para los
   agentes de IA y para Finance, el conjunto terminado para precios, método,
   garantías y contacto.
   Son las mismas imágenes de la portada (/assets/v2/img/escena/), así que
   quien viene de ella ya las tiene. Solo con el tema claro (la fotografía es
   de un plató blanco y sobre fondo oscuro sería un recuadro) y no en el
   teléfono, donde la cabecera no tiene sitio libre y quedaría bajo el título.
   ========================================================================== */
const cab = document.querySelector(".pag-cab");
const ruta = (location.pathname.replace(/^\/en(?=\/|$)/, "").replace(/\.html$/, "").replace(/\/$/, "")) || "/";
const MAPA = [
  [/^\/servicios\/automatizaciones$/, 3], [/^\/servicios\/agentes-de-ia$/, 4], [/^\/servicios\/integraciones$/, 2], [/^\/servicios\/sistemas-a-medida$/, 2],
  [/^\/servicios\/paginas-web$/, 6], [/^\/contacto$/, 6], [/^\/diagnostico$/, 1], [/^\/sistema-financiero$/, 4], [/^\/que-hacemos$/, 2],
  [/^\/departamentos\//, 3], [/^\/(precios|metodo|garantias|casos-exito|conocenos|cambios-en-proceso|faq)$/, 6], [/^\/blog(\/|$)/, 1],
];
const plan = MAPA.find(([re]) => re.test(ruta));
if (cab && plan && !cab.querySelector(".cab-foto") && !matchMedia("(max-width: 860px)").matches) {
  const V = "3d5b4e25b0";
  const foto = document.createElement("div"); foto.className = "cab-foto"; foto.setAttribute("aria-hidden", "true");
  const im = new Image();
  im.onload = () => { foto.style.backgroundImage = `url("${im.src}")`; cab.prepend(foto); requestAnimationFrame(() => foto.classList.add("is-vista")); };
  im.src = `/assets/v2/img/escena/h-${plan[1]}.webp?v=${V}`;
}
