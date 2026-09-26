/* ==========================================================================
   D-CODE · arranque de las escenas y del sistema de interfaz
   ==========================================================================
   1. El HTML pinta primero (titular, texto, póster de cada escena).
   2. En el primer hueco libre tras DOMContentLoaded se pide el motor
      (Three.js + motor.js) — una sola vez — y solo si hay alguna escena en
      la página y el navegador tiene WebGL.
   3. El motor monta cada escena cuando su hueco se acerca a la pantalla.
   Además: cabecera que se retira al bajar y selector de tema dentro de la
   navegación. Sin este fichero la web se lee entera (con los pósters).
   ========================================================================== */
(function () {
  "use strict";
  var D = document, R = D.documentElement;
  var MOTOR = "/assets/js/escenas/motor.js?v=d5a42a54c3";
  var quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function claro() { return R.getAttribute("data-theme") === "light"; }
  function webgl() { try { var c = D.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch (e) { return false; } }

  function cabecera() {
    var h = D.getElementById("site-header"); if (!h) return;
    // El selector de tema, pequeño y dentro de la navegación.
    var t = D.querySelector("[data-tema-btn]"), nr = h.querySelector(".nav-right");
    if (t && nr && t.parentNode !== nr) { nr.insertBefore(t, nr.firstChild); t.classList.add("tema-en-nav"); }
    if (quieto) return;
    var y0 = scrollY, pend = false;
    addEventListener("scroll", function () {
      if (pend) return; pend = true;
      requestAnimationFrame(function () { pend = false; var y = scrollY, d = y - y0; if (Math.abs(d) > 6) { h.classList.toggle("ds-oculta", d > 0 && y > 260); y0 = y; } });
    }, { passive: true });
    h.addEventListener("focusin", function () { h.classList.remove("ds-oculta"); });
  }

  function escenas() {
    var huecos = D.querySelectorAll("[data-escena]");
    if (!huecos.length) return;
    // El póster de cada escena se pide cuando su hueco se acerca.
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("cerca"); io.unobserve(e.target); } }); }, { rootMargin: "120% 0px" });
      huecos.forEach(function (h) { io.observe(h); });
    } else huecos.forEach(function (h) { h.classList.add("cerca"); });
    if (!webgl()) { R.classList.add("sin-webgl"); return; }
    var go = function () {
      performance.mark && performance.mark("escenas-inicio");
      var cv = D.createElement("canvas");
      cv.className = "esc-lienzo"; cv.setAttribute("aria-hidden", "true");
      D.body.appendChild(cv);
      import(MOTOR).then(function (m) {
        var motor = m.crearMotor(cv, { claro: claro(), alPrimer: function () { R.classList.add("esc-listas"); performance.mark && performance.mark("escenas-primer-fotograma"); } });
        window.__motor = motor;
        new MutationObserver(function () { motor.setTema(claro()); }).observe(R, { attributes: true, attributeFilter: ["data-theme"] });
      }).catch(function (e) { console.error("[escenas] motor no disponible:", e); R.classList.add("sin-webgl"); cv.remove(); });
    };
    // Primer hueco libre: el titular y el póster ya están pintados.
    if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 700 }); else setTimeout(go, 200);
  }

  /* El estudio del héroe: módulos y áreas enfocan la pieza y rellenan la
     ficha; los mandos la giran y la acercan. Sin WebGL, la ficha funciona. */
  function estudio() {
    var st = D.querySelector("[data-st]"); if (!st) return;
    var lienzo = st.querySelector("[data-escena]"), t = st.querySelector("[data-info-t]"), d = st.querySelector("[data-info-d]"), l = st.querySelector("[data-info-l]");
    var t0 = t.textContent, d0 = d.textContent, botones = st.querySelectorAll("[data-foco]");
    botones.forEach(function (b) {
      b.addEventListener("click", function () {
        var on = b.getAttribute("aria-pressed") !== "true";
        botones.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", on ? "true" : "false");
        if (on) { lienzo.dataset.foco = b.dataset.foco; t.textContent = b.dataset.t; d.textContent = b.dataset.d; l.href = b.dataset.h; l.textContent = b.dataset.l; l.hidden = false; }
        else { delete lienzo.dataset.foco; t.textContent = t0; d.textContent = d0; l.hidden = true; }
        window.__motor && window.__motor.pedir();
      });
    });
    st.querySelectorAll("[data-mando]").forEach(function (b) {
      b.addEventListener("click", function () { lienzo.dispatchEvent(new CustomEvent("escena:mando", { detail: b.dataset.mando })); window.__motor && window.__motor.pedir(); });
    });
  }

  /* Los nueve pasos: el que cruza la línea de lectura es el activo y la
     pieza cambia a su estado. */
  function pasos() {
    var sx = D.querySelector("[data-sx]"); if (!sx) return;
    var lienzo = sx.querySelector("[data-escena]"), items = [].slice.call(sx.querySelectorAll(".sx-paso"));
    sx.classList.add("is-vivo");
    var actual = 0, pend = false;
    function medir() {
      pend = false;
      var linea = innerHeight * (innerWidth < 901 ? 0.74 : 0.5), mejor = 1, dist = 1e9;
      items.forEach(function (li, i) { var r = li.getBoundingClientRect(), c = r.top + r.height / 2, dd = Math.abs(c - linea); if (dd < dist) { dist = dd; mejor = i + 1; } });
      if (mejor !== actual) {
        actual = mejor; lienzo.dataset.paso = String(mejor);
        items.forEach(function (li, i) { li.classList.toggle("is-on", i + 1 === mejor); });
        window.__motor && window.__motor.pedir();
      }
    }
    addEventListener("scroll", function () { if (!pend) { pend = true; requestAnimationFrame(medir); } }, { passive: true });
    addEventListener("resize", medir);
    medir();
  }

  function arranque() { cabecera(); estudio(); pasos(); escenas(); }
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", arranque); else arranque();
})();
