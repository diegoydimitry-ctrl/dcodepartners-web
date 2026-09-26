/* ==========================================================================
   D-CODE PARTNERS — v10 "El sistema, en profundidad"
   ==========================================================================
   Orquesta el motor de assets/js/dcode-system.js: decide QUÉ progreso de
   scroll le pasa a cada montaje, y qué hacer si WebGL no está disponible
   (o si la persona pidió menos movimiento). No dibuja nada él mismo — eso
   vive en el módulo reutilizable, que no sabe nada de esta página.
   ========================================================================== */
(function () {
  "use strict";

  function progresoDeSeccion(el) {
    return function () {
      const r = el.getBoundingClientRect();
      const total = r.height + window.innerHeight;
      const recorrido = window.innerHeight - r.top;
      return Math.max(0, Math.min(1, recorrido / total));
    };
  }

  function marcarSinWebGL(mount) {
    mount.classList.add("d10-sin-webgl");
  }

  /*
   * El "campo" 2D de dcp6.js (`.field`, un único canvas fijo detrás de TODA
   * la página) sigue funcionando exactamente igual en el resto del sitio —
   * no se toca su código ni su lógica de estados. Pero justo en el Hero y
   * en "El sistema completo", donde ahora vive la escena WebGL nueva, las
   * dos capas dibujando encima la una de la otra no se leen como una sola
   * experiencia: se leen como dos sistemas de partículas distintos
   * compitiendo. Se atenúa el campo antiguo SOLO mientras una de estas dos
   * secciones está en pantalla (una clase en <body>, opacity por CSS) — en
   * cuanto se sale de ambas, vuelve exactamente a como estaba.
   */
  function vigilarSolapeConCampo() {
    const secciones = document.querySelectorAll("[data-dcode-progress]");
    if (!secciones.length) return;
    const activas = new Set();
    const io = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) activas.add(e.target); else activas.delete(e.target);
      }
      document.body.classList.toggle("d10-oculta-campo", activas.size > 0);
    }, { threshold: 0.15 });
    secciones.forEach((s) => io.observe(s));
  }

  async function montarTodas() {
    const mounts = document.querySelectorAll("[data-dcode-scene]");
    if (!mounts.length) return;

    let motor = null;
    let hayAlguno = false;
    for (const mount of mounts) {
      const canvas = mount.querySelector("canvas");
      if (!canvas) continue;
      hayAlguno = true;
      // Sondeo real de WebGL en ESTE navegador, no una suposición.
      let ok = false;
      try {
        ok = !!(window.WebGLRenderingContext &&
          (document.createElement("canvas").getContext("webgl2") ||
           document.createElement("canvas").getContext("webgl")));
      } catch (e) { ok = false; }
      if (!ok) { marcarSinWebGL(mount); continue; }

      if (!motor) {
        try {
          motor = await import("/assets/js/dcode-system.js");
        } catch (e) {
          // Fallo de red o de módulo: degradar a la imagen fija, no a una
          // pantalla rota. El contenido real (h1, párrafos) ya está en el
          // HTML, así que nada se pierde salvo la animación.
          console.error("[d10] No se pudo cargar el motor 3D:", e);
          mounts.forEach(marcarSinWebGL);
          return;
        }
      }

      const seccion = mount.closest("[data-dcode-progress]") || mount;
      try {
        await motor.montarEscenaSistema(canvas, { progressSource: progresoDeSeccion(seccion) });
        mount.classList.add("d10-activo");
      } catch (e) {
        console.error("[d10] Fallo montando la escena:", e);
        marcarSinWebGL(mount);
      }
    }
    if (!hayAlguno) return;
  }

  function arrancar() {
    montarTodas();
    vigilarSolapeConCampo();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", arrancar);
  } else {
    arrancar();
  }
})();
