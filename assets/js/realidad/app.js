/* ==========================================================================
   D-CODE · LA PLANTA — orquestación en la web
   ==========================================================================
   No dibuja: decide. Qué estado de la planta corresponde a lo que se está
   leyendo, dónde se encuadra para dejar sitio al texto, cuándo se esconde
   (detrás de las demos y del panel de D-Code OS no compite: se apaga y deja
   de renderizar), y qué pasa con el cursor, el tema y la calidad.

   Todo el contenido vive en HTML. Si esto no carga, la página es la misma de
   siempre con el póster de la planta detrás del titular.
   ========================================================================== */
(function () {
  "use strict";
  var D = document, R = D.documentElement;
  var EN = (R.getAttribute("lang") || "es").slice(0, 2) === "en";
  var P = EN ? "/en" : "";
  var MOTOR = "/assets/js/realidad/planta.js?v=60746502a5";

  function webgl() {
    try { var c = D.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"))); }
    catch (e) { return false; }
  }
  function claro() { return R.getAttribute("data-theme") === "light"; }
  function vigilarTema(cb) {
    new MutationObserver(function () { cb(claro()); }).observe(R, { attributes: true, attributeFilter: ["data-theme"] });
  }

  /* ------------------------------------------------------------ PORTADA
     Qué significa cada capítulo de la portada real, en la planta. */
  var MAPA_PORTADA = [
    // [selector, estado, visible, lado del texto]
    ["#inicio", "desorden", 1, "izq"],
    ["#problema", "problema", 1, "izq"],
    ["#diagnostico", "analizar", 0.5, "izq"],
    ["#que-hacemos", "conectar", 0.22, "izq"],
    ["#sistemas", "conectar", 0, "izq"],
    ["#dcode-os", "conectar", 0, "izq"],
    ["#proceso", "analizar", 1, "izq"],
    ["[aria-labelledby='paso-01']", "analizar", 1, "izq"],
    ["[aria-labelledby='paso-02']", "disenar", 1, "der"],
    ["[aria-labelledby='paso-03']", "implantar", 1, "izq"],
    ["[aria-labelledby='paso-04']", "medir", 1, "der"],
    ["#confianza", "regimen", 0.35, "izq"],
    ["#que-puedes-tener", "regimen", 0.2, "izq"],
    ["#contacto", "regimen", 1, "centro"],
  ];

  function portada(escenario) {
    var tramos = MAPA_PORTADA.map(function (m) { return { el: D.querySelector(m[0]), estado: m[1], vis: m[2], lado: m[3] }; })
      .filter(function (t) { return t.el; });
    if (!tramos.length) return;
    var estadoTxt = D.querySelector("[data-field-state]");
    var nombres = estadoTxt ? (estadoTxt.getAttribute("data-names") || "").split("|") : [];
    var planta = null, actual = null;

    function activo() {
      var linea = window.innerHeight * 0.45, el = tramos[0];
      for (var i = 0; i < tramos.length; i++) if (tramos[i].el.getBoundingClientRect().top <= linea) el = tramos[i];
      return el;
    }
    function aplicar() {
      var t = activo();
      if (t === actual) return;
      actual = t;
      escenario.style.setProperty("--planta-vis", t.vis);
      escenario.classList.toggle("planta-apagada", t.vis === 0);
      if (estadoTxt) {
        var n = t.el.getAttribute("data-state");
        if (n != null && nombres[+n]) estadoTxt.textContent = nombres[+n];
      }
      if (!planta) return;
      planta.irA(t.estado);
      planta.setEncuadre(t.lado === "der" ? 0.2 : t.lado === "centro" ? 0.0001 : 0, 0);
      // Apagada (opacidad 0): se deja de renderizar del todo.
      planta.visible = t.vis > 0; if (planta.visible) planta.arrancar(); else planta.parar();
    }
    var pend = false;
    window.addEventListener("scroll", function () {
      if (pend) return; pend = true;
      requestAnimationFrame(function () { pend = false; aplicar(); });
    }, { passive: true });
    aplicar();

    if (!webgl()) { escenario.classList.add("planta-sin-webgl"); return; }
    var canvas = escenario.querySelector("canvas");
    // El motor (≈170 KB comprimido) se pide después de `load`: el titular,
    // las demos y las métricas de carga no esperan al 3D.
    var cargado = D.readyState === "complete" ? Promise.resolve() : new Promise(function (r) { window.addEventListener("load", r, { once: true }); });
    cargado.then(function () { return import(MOTOR); }).then(function (m) {
      return m.montarPlanta(canvas, { estado: actual ? actual.estado : "desorden", claro: claro(), observar: false });
    }).then(function (p) {
      planta = p;
      window.__planta = p; // inspección en QA (info(), calidad)
      window.__plantaSync = function () { actual = null; aplicar(); p.saltar(); };
      escenario.classList.add("planta-viva");
      actual = null; aplicar();
      vigilarTema(function (c) { p.setTema(c); });
      interaccion(p, escenario);
      diagnostico(p);
    }).catch(function (e) {
      console.error("[planta] no disponible:", e);
      escenario.classList.add("planta-sin-webgl");
    });
  }

  /* Diagnóstico: las áreas que marca la persona se encienden en la planta.
     Se observa el aria-pressed que ya gestiona dcp10 (no se toca su lógica). */
  function diagnostico(p) {
    var botones = D.querySelectorAll("#diagnostico .dx-area[data-area]");
    if (!botones.length) return;
    var ALIAS = { operaciones: "produccion" };
    function leer() {
      var ids = [];
      botones.forEach(function (b) { if (b.getAttribute("aria-pressed") === "true") { var a = b.getAttribute("data-area"); ids.push(ALIAS[a] || a); } });
      p.setFocos(ids);
    }
    var mo = new MutationObserver(leer);
    botones.forEach(function (b) { mo.observe(b, { attributes: true, attributeFilter: ["aria-pressed"] }); });
    leer();
  }

  /* Cursor: parallax de cámara y luz, y los módulos se pueden señalar.
     Clic en un módulo = su página de departamento. Solo con ratón y fuera de
     textos/controles: nunca roba un clic a la página. */
  function interaccion(p, escenario) {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var eti = D.createElement("div");
    eti.className = "planta-etiqueta";
    eti.setAttribute("aria-hidden", "true");
    D.body.appendChild(eti);
    var sobre = null;
    function libre(t) { return !t.closest("a, button, input, select, textarea, label, p, h1, h2, h3, li, [role='tab'], .v6-veil, .v6-lede"); }
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      p.puntero_((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      if (!p.visible || escenario.classList.contains("planta-apagada") || !libre(e.target)) { sobre = null; p.hover = -1; eti.classList.remove("on"); D.body.classList.remove("planta-mano"); return; }
      sobre = p.elegir(e.clientX, e.clientY);
      D.body.classList.toggle("planta-mano", !!sobre);
      if (sobre) {
        eti.innerHTML = "<b>" + sobre.nombre + "</b><span>" + (EN ? "Open department →" : "Ver el departamento →") + "</span>";
        eti.style.transform = "translate(" + (e.clientX + 18) + "px," + (e.clientY + 14) + "px)";
        eti.classList.add("on");
      } else eti.classList.remove("on");
    }, { passive: true });
    D.addEventListener("click", function (e) {
      if (!sobre || !libre(e.target)) return;
      location.href = P + "/departamentos/" + sobre.id;
    });
  }

  /* ------------------------------------------------------------ INTERIORES
     Cada página muestra la parte del sistema que le corresponde. */
  var DEPTS = ["comercial", "marketing", "clientes", "produccion", "finanzas", "soporte", "administracion", "direccion"];
  function interior() {
    var hero = D.querySelector(".page-hero");
    if (!hero || D.body.classList.contains("planta-portada")) return;
    var ruta = location.pathname.replace(/\.html$/, "").replace(/\/$/, "").replace(/^\/en/, "");
    var o = null, m;
    if ((m = ruta.match(/^\/departamentos\/([a-z]+)$/)) && DEPTS.indexOf(m[1]) >= 0) o = { solo: m[1], estado: "modulo" };
    else if (ruta === "/servicios/paginas-web") o = { solo: "marketing", estado: "modulo" };
    else if (ruta === "/servicios/sistemas-a-medida") o = { estado: "disenar" };
    else if (ruta === "/servicios/automatizaciones" || ruta === "/servicios/integraciones" || ruta === "/servicios/agentes-de-ia" || ruta === "/que-hacemos" || ruta === "/departamentos") o = { estado: "conectar" };
    else if (ruta === "/metodo") o = { estado: "analizar" };
    if (!o) return;

    var esc = D.createElement("div");
    esc.className = "planta-escenario planta-escenario--interior";
    esc.setAttribute("aria-hidden", "true");
    esc.innerHTML = "<canvas></canvas>";
    hero.classList.add("planta-hero");
    D.body.classList.add("planta-interior");
    hero.insertBefore(esc, hero.firstChild);
    if (!webgl()) { esc.classList.add("planta-sin-webgl"); return; }
    var go = function () {
      import(MOTOR).then(function (mm) {
        return mm.montarPlanta(esc.querySelector("canvas"), { solo: o.solo || null, estado: o.estado, claro: claro(), transparente: true });
      }).then(function (p) {
        esc.classList.add("planta-viva");
        p.setEncuadre(0.0001, o.solo ? 0.2 : 0.04);
        vigilarTema(function (c) { p.setTema(c); });
        hero.addEventListener("pointermove", function (e) {
          if (e.pointerType === "mouse") p.puntero_((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
        });
      }).catch(function (e) { console.error("[planta] interior no disponible:", e); esc.classList.add("planta-sin-webgl"); });
    };
    // El titular pinta primero; el 3D llega en el primer hueco libre.
    if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 1200 }); else setTimeout(go, 300);
  }

  function arranque() {
    var esc = D.querySelector("[data-planta='portada']");
    if (esc) { D.body.classList.add("planta-portada"); portada(esc); }
    else interior();
  }
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", arranque); else arranque();
})();
