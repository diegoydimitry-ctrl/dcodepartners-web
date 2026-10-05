/* ==========================================================================
   D-CODE · la escena de la portada, en la cabecera de las páginas interiores
   --------------------------------------------------------------------------
   Cada página abre con la fotografía de la portada que le corresponde: los
   cabos sueltos para el blog y el diagnóstico, el cable trenzado para lo que
   hacemos, las integraciones y los sistemas a medida, la fila que cae sola
   para las automatizaciones y los departamentos, el líquido que toma forma
   para los agentes de IA, la llave para Finance y el cable entero para
   precios, método, garantías y contacto.
   Son las mismas imágenes de la portada (/assets/v2/img/escena/), así que
   quien viene de ella ya las tiene. Solo las del plató blanco y solo con el
   tema claro (sobre fondo oscuro serían un recuadro), y no en el teléfono,
   donde la cabecera no tiene sitio libre y quedaría bajo el título.
   ========================================================================== */
const cab = document.querySelector(".pag-cab");
const ruta = (location.pathname.replace(/^\/en(?=\/|$)/, "").replace(/\.html$/, "").replace(/\/$/, "")) || "/";
const MAPA = [
  [/^\/servicios\/automatizaciones$/, 3], [/^\/servicios\/agentes-de-ia$/, 4], [/^\/servicios\/integraciones$/, 2], [/^\/servicios\/sistemas-a-medida$/, 2],
  [/^\/servicios\/paginas-web$/, 2], [/^\/contacto$/, 2], [/^\/diagnostico$/, 1], [/^\/sistema-financiero$/, 5], [/^\/que-hacemos$/, 2],
  [/^\/departamentos\//, 3], [/^\/(precios|metodo|garantias|casos-exito|conocenos|cambios-en-proceso|faq)$/, 2], [/^\/blog(\/|$)/, 1],
];
const plan = MAPA.find(([re]) => re.test(ruta));
if (cab && plan && !cab.querySelector(".cab-foto") && !matchMedia("(max-width: 860px)").matches) {
  const V = "5a637c8e4b";
  const foto = document.createElement("div"); foto.className = "cab-foto"; foto.setAttribute("aria-hidden", "true");
  const im = new Image();
  const POS = { 4: "20% 50%", 5: "10% 50%" };   // el líquido y la cerradura están en el centro de su fotografía: se encuadran hacia la derecha para no quedar bajo el título
  im.onload = () => { foto.style.backgroundImage = `url("${im.src}")`; if (POS[plan[1]]) foto.style.backgroundPosition = POS[plan[1]]; cab.prepend(foto); requestAnimationFrame(() => foto.classList.add("is-vista")); };
  im.src = `/assets/v2/img/escena/h-${plan[1]}.webp?v=${V}`;
}
