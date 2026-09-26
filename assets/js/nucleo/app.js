/* ==========================================================================
   D-CODE · orquestación del sistema nuevo
   ==========================================================================
   Global (todas las páginas): cabecera que se retira al bajar.
   Portada: El Núcleo como escenario fijo; cada capítulo real de la portada
   pide su plano (estado + encuadre + visibilidad). En «Anatomía», la vista
   explosionada lleva cotas HTML que siguen a cada capa. En el diagnóstico,
   las áreas marcadas encienden su toma. Delante de las demos y de D-Code OS
   el estudio se apaga (y deja de renderizar): el producto manda.
   Todo el contenido está en HTML; sin este fichero la web se lee entera.
   ========================================================================== */
(function () {
  "use strict";
  var D = document, R = D.documentElement;
  R.classList.add("ds-js");
  var EN = (R.getAttribute("lang") || "es").slice(0, 2) === "en";
  var P = EN ? "/en" : "";
  var MOTOR = "/assets/js/nucleo/nucleo.js?v=c6835a03a0";
  var quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function webgl() { try { var c = D.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch (e) { return false; } }
  function claro() { return R.getAttribute("data-theme") !== "dark"; }

  /* Cabecera: se retira al bajar, vuelve al subir. */
  function cabecera() {
    var h = D.getElementById("site-header"); if (!h || quieto) return;
    var y0 = scrollY, pend = false;
    addEventListener("scroll", function () {
      if (pend) return; pend = true;
      requestAnimationFrame(function () { pend = false; var y = scrollY, d = y - y0; if (Math.abs(d) > 6) { h.classList.toggle("ds-oculta", d > 0 && y > 240 && !D.body.classList.contains("nav-open")); y0 = y; } });
    }, { passive: true });
    h.addEventListener("focusin", function () { h.classList.remove("ds-oculta"); });
  }

  /* ------------------------------------------------------------ PORTADA */
  var MAPA = [
    ["#inicio", "ensamblado", 1, "izq"],
    ["#problema", "desalineado", 1, "izq"],
    ["#diagnostico", "escaneo", 0.3, "izq"],
    ["#que-hacemos", "implantar", 0, "izq"],
    ["#anatomia", "anatomia", 1, "izq"],
    ["#sistemas", "implantar", 0, "izq"],
    ["#dcode-os", "implantar", 0, "izq"],
    ["#proceso", "escaneo", 1, "izq"],
    ["[aria-labelledby='paso-01']", "escaneo", 1, "izq"],
    ["[aria-labelledby='paso-02']", "anatomia", 1, "der"],
    ["[aria-labelledby='paso-03']", "implantar", 1, "izq"],
    ["[aria-labelledby='paso-04']", "medir", 1, "der"],
    ["#confianza", "regimen", 0.28, "izq"],
    ["#que-puedes-tener", "regimen", 0, "izq"],
    ["#contacto", "cierre", 1, "centro"],
  ];

  function portada(esc) {
    var tramos = MAPA.map(function (m) { return { el: D.querySelector(m[0]), estado: m[1], vis: m[2], lado: m[3] }; }).filter(function (t) { return t.el; })
      .sort(function (a, b) { return a.el.compareDocumentPosition(b.el) & 4 ? -1 : 1; }); // orden real del documento
    var estadoTxt = D.querySelector("[data-field-state]");
    var nombres = estadoTxt ? (estadoTxt.getAttribute("data-names") || "").split("|") : [];
    var anat = D.getElementById("anatomia");
    var capasLi = anat ? anat.querySelectorAll(".ds-capas li") : [];
    var cotas = D.querySelector(".ds-cotas");
    var n = null, actual = null, capaOn = -1;

    function activo() {
      var l = innerHeight * 0.45, t = tramos[0];
      for (var i = 0; i < tramos.length; i++) if (tramos[i].el.getBoundingClientRect().top <= l) t = tramos[i];
      return t;
    }
    function progAnat() {
      if (!anat) return 0;
      var r = anat.getBoundingClientRect(), tot = r.height - innerHeight;
      return tot > 0 ? Math.max(0, Math.min(1, -r.top / tot)) : 0;
    }
    function aplicar() {
      var t = activo();
      if (t !== actual) {
        actual = t;
        esc.style.setProperty("--nv", t.vis);
        esc.classList.toggle("apagado", t.vis === 0);
        if (estadoTxt) { var k = t.el.getAttribute("data-state"); if (k != null && nombres[+k]) estadoTxt.textContent = nombres[+k]; }
        if (cotas) cotas.classList.toggle("on", t.estado === "anatomia" && t.el === anat);
        if (n) {
          n.irA(t.estado);
          n.setEncuadre(t.lado === "der" ? 0.2 : t.lado === "centro" ? 0 : null);
          n.visible = t.vis > 0; if (n.visible) n.arrancar(); else n.parar();
        }
      }
      if (t.el === anat) {
        var p = progAnat(), idx = Math.min(capasLi.length - 1, Math.floor(p * capasLi.length * 1.05));
        if (idx !== capaOn) { capaOn = idx; capasLi.forEach(function (li, i) { li.classList.toggle("on", i === idx); }); }
        if (n) { n.vgiro = 0; n.giro = 0.4 + p * 1.8; if (n.quieto) n.saltar(); }
      }
    }
    var pend = false;
    addEventListener("scroll", function () { if (pend) return; pend = true; requestAnimationFrame(function () { pend = false; aplicar(); }); }, { passive: true });
    addEventListener("resize", aplicar);
    aplicar();

    if (!webgl()) return;
    var canvas = esc.querySelector("canvas");
    var cargado = D.readyState === "complete" ? Promise.resolve() : new Promise(function (r) { addEventListener("load", r, { once: true }); });
    cargado.then(function () { return import(MOTOR); }).then(function (m) {
      return m.montarNucleo(canvas, {
        estado: actual ? actual.estado : "ensamblado", claro: claro(), observar: false,
        alPintar: pintarCotas,
        alCargar: function () { esc.classList.add("vivo"); },
      });
    }).then(function (x) {
      n = x; window.__nucleo = x;
      window.__nucleoSync = function () { actual = null; aplicar(); x.saltar(); pintarCotas(x); };
      actual = null; aplicar();
      new MutationObserver(function () { x.setTema(claro()); }).observe(R, { attributes: true, attributeFilter: ["data-theme"] });
      interaccion(x, esc);
      diagnostico(x);
      if (x.quieto) pintarCotas(x);
    }).catch(function (e) { console.error("[nucleo] no disponible:", e); });

    /* Cotas: cada capa, su etiqueta, siguiendo la pieza en pantalla. */
    var els = null;
    function pintarCotas(x) {
      if (!cotas || !cotas.classList.contains("on")) return;
      if (!els) els = cotas.querySelectorAll(".ds-cota");
      var a = x.anclas();
      for (var i = 0; i < els.length && i < a.length; i++) {
        els[i].style.transform = "translate(" + Math.round(a[i].x) + "px," + Math.round(a[i].y - 5) + "px)";
        els[i].style.opacity = i === capaOn ? 1 : 0.45;
      }
    }
  }

  /* Cursor: la pieza tiene inercia; las tomas se señalan y llevan a su
     departamento. Nunca roba un clic a un texto o un control. */
  function interaccion(n, esc) {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var px = 0;
    addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      var x = (e.clientX / innerWidth) * 2 - 1, y = (e.clientY / innerHeight) * 2 - 1;
      n.empujar((x - px) * 0.9); px = x;
      n.puntero_(x, y);
    }, { passive: true });
  }

  function diagnostico(n) {
    var b = D.querySelectorAll("#diagnostico .dx-area[data-area]"); if (!b.length) return;
    var A = { operaciones: "produccion" };
    function leer() { var ids = []; b.forEach(function (x) { if (x.getAttribute("aria-pressed") === "true") { var a = x.getAttribute("data-area"); ids.push(A[a] || a); } }); n.setFocos(ids); }
    var mo = new MutationObserver(leer); b.forEach(function (x) { mo.observe(x, { attributes: true, attributeFilter: ["aria-pressed"] }); }); leer();
  }

  function arranque() {
    cabecera();
    var esc = D.querySelector("[data-nucleo='portada']");
    if (esc) portada(esc);
  }
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", arranque); else arranque();
})();
