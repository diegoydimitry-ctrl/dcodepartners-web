/* ==========================================================================
   D-CODE PARTNERS — v11 · orquestación
   ==========================================================================
   No dibuja nada 3D: eso vive en assets/js/dcode-system.js (un solo motor).
   Aquí se decide QUÉ forma pide cada capítulo o página, y se monta todo lo
   que la reconstrucción añade alrededor:

     1. Índice a pantalla completa + cabecera que se retira al bajar.
     2. Aparición de bloques al entrar en pantalla.
     3. Portada: una escena fija que cambia de forma por capítulo, raíl de
        capítulos, capas encendidas por scroll, módulos encendidos al pasar
        el cursor, laboratorio con pestañas.
     4. Interiores: la forma de cada página en su héroe.
     5. Botones "pregúntale" que hablan con el asistente real del sitio.

   Todo lo importante existe en HTML; si esto no carga, la web se lee igual.
   ========================================================================== */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.add("d11-js");
  var EN = (doc.getAttribute("lang") || "es").slice(0, 2) === "en";
  var P = EN ? "/en" : "";
  var quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function webgl() {
    try {
      var c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
    } catch (e) { return false; }
  }

  var motorP = null;
  function motor() {
    if (!motorP) motorP = import("/assets/js/dcode-system.js?v=64c567107a");
    return motorP;
  }

  /* ------------------------------------------------------------ 1. ÍNDICE */
  var MAPA = EN ? {
    titulo: "Index", cerrar: "Close", abrir: "Index",
    prin: [["Method", "/metodo"], ["Capabilities", "/departamentos"], ["What we build", "/servicios"], ["D-Code Finance", "/sistema-financiero"], ["Internal cases", "/casos-exito"], ["About us", "/conocenos"], ["Contact", "/contacto"]],
    grupos: [
      ["Departments", [["Sales", "/departamentos/comercial", "--k-comercial"], ["Marketing", "/departamentos/marketing", "--k-marketing"], ["Customer", "/departamentos/clientes", "--k-clientes"], ["Delivery", "/departamentos/produccion", "--k-produccion"], ["Finance", "/departamentos/finanzas", "--k-finanzas"], ["Support", "/departamentos/soporte", "--k-soporte"], ["Operations", "/departamentos/administracion", "--k-administracion"], ["Leadership", "/departamentos/direccion", "--k-direccion"]]],
      ["Disciplines", [["Process automation", "/servicios/automatizacion-ia"], ["AI agents", "/servicios/agentes-ia"], ["Integrations", "/servicios/integraciones"]]],
      ["Resources", [["How it works", "/como-funciona"], ["Guarantees", "/garantias"], ["In progress", "/cambios-en-proceso"], ["Blog", "/blog"], ["FAQ", "/faq"]]],
    ],
    pie: "Madrid, Spain · We reply within 24h",
  } : {
    titulo: "Índice", cerrar: "Cerrar", abrir: "Índice",
    prin: [["Método", "/metodo"], ["Capacidades", "/departamentos"], ["Qué construimos", "/servicios"], ["D-Code Finance", "/sistema-financiero"], ["Casos internos", "/casos-exito"], ["Conócenos", "/conocenos"], ["Contacto", "/contacto"]],
    grupos: [
      ["Departamentos", [["Comercial", "/departamentos/comercial", "--k-comercial"], ["Marketing", "/departamentos/marketing", "--k-marketing"], ["Clientes", "/departamentos/clientes", "--k-clientes"], ["Producción", "/departamentos/produccion", "--k-produccion"], ["Finanzas", "/departamentos/finanzas", "--k-finanzas"], ["Soporte", "/departamentos/soporte", "--k-soporte"], ["Administración", "/departamentos/administracion", "--k-administracion"], ["Dirección", "/departamentos/direccion", "--k-direccion"]]],
      ["Disciplinas", [["Automatización de procesos", "/servicios/automatizacion-ia"], ["Agentes de IA", "/servicios/agentes-ia"], ["Integraciones", "/servicios/integraciones"]]],
      ["Recursos", [["Cómo funciona", "/como-funciona"], ["Garantías", "/garantias"], ["Cambios en proceso", "/cambios-en-proceso"], ["Blog", "/blog"], ["Preguntas frecuentes", "/faq"]]],
    ],
    pie: "Madrid, España · Respondemos en menos de 24h",
  };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function montarIndice() {
    var header = document.getElementById("site-header");
    var derecha = header && header.querySelector(".nav-right");
    if (!derecha || document.querySelector(".d11-indice")) return;
    var aqui = location.pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "d11-menu-btn";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "d11-indice");
    btn.innerHTML = "<i aria-hidden=\"true\"></i><span>" + MAPA.abrir + "</span>";
    derecha.appendChild(btn);

    var n = 0;
    var html = "<div class=\"d11-indice-top\"><p>D-Code Partners — " + MAPA.titulo + "</p>" +
      "<button type=\"button\" class=\"d11-menu-btn\" data-cerrar><span>" + MAPA.cerrar + "</span></button></div>" +
      "<div class=\"d11-indice-cuerpo\"><nav aria-label=\"" + MAPA.titulo + "\"><ol class=\"d11-indice-prin\">";
    MAPA.prin.forEach(function (l) {
      var href = P + l[1];
      var cur = (href === aqui) ? " aria-current=\"page\"" : "";
      html += "<li class=\"d11-anim\" style=\"--i:" + (n++) + "\"><a href=\"" + href + "\"" + cur + ">" + esc(l[0]) + "</a></li>";
    });
    html += "</ol></nav><div class=\"d11-indice-sec\">";
    MAPA.grupos.forEach(function (g) {
      html += "<div class=\"d11-anim\" style=\"--i:" + (n++) + "\"><h2>" + esc(g[0]) + "</h2><ul>";
      g[1].forEach(function (l) {
        html += "<li><a href=\"" + P + l[1] + "\"" + (l[2] ? " style=\"--k:var(" + l[2] + ")\"" : "") + ">" + (l[2] ? "<i aria-hidden=\"true\"></i>" : "") + esc(l[0]) + "</a></li>";
      });
      html += "</ul></div>";
    });
    html += "</div></div><div class=\"d11-indice-pie\"><span>" + MAPA.pie + "</span><a href=\"mailto:dcodedepartment@gmail.com\">dcodedepartment@gmail.com</a></div>";

    var ov = document.createElement("div");
    ov.className = "d11-indice";
    ov.id = "d11-indice";
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-modal", "true");
    ov.setAttribute("aria-label", MAPA.titulo);
    ov.innerHTML = html;
    document.body.appendChild(ov);

    var ultimoFoco = null;
    function abrir() {
      ultimoFoco = document.activeElement;
      ov.classList.add("abierto");
      document.body.classList.add("d11-menu-abierto");
      btn.setAttribute("aria-expanded", "true");
      setTimeout(function () { var a = ov.querySelector(".d11-indice-prin a"); a && a.focus(); }, quieto ? 0 : 320);
    }
    function cerrar() {
      ov.classList.remove("abierto");
      document.body.classList.remove("d11-menu-abierto");
      btn.setAttribute("aria-expanded", "false");
      (ultimoFoco || btn).focus();
    }
    btn.addEventListener("click", abrir);
    ov.querySelector("[data-cerrar]").addEventListener("click", cerrar);
    ov.addEventListener("click", function (e) { if (e.target.closest("a")) cerrar(); });
    document.addEventListener("keydown", function (e) {
      if (!ov.classList.contains("abierto")) return;
      if (e.key === "Escape") { e.preventDefault(); cerrar(); return; }
      if (e.key === "Tab") { // foco atrapado dentro del índice
        var f = ov.querySelectorAll("a, button");
        var a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
  }

  /* Cabecera que se retira al bajar y vuelve al subir. */
  function cabeceraRetirable() {
    var h = document.getElementById("site-header");
    if (!h || quieto) return;
    var y0 = window.scrollY, pend = false;
    window.addEventListener("scroll", function () {
      if (pend) return; pend = true;
      requestAnimationFrame(function () {
        pend = false;
        var y = window.scrollY, dy = y - y0;
        if (Math.abs(dy) > 6) { h.classList.toggle("d11-escondida", dy > 0 && y > 220); y0 = y; }
      });
    }, { passive: true });
    h.addEventListener("focusin", function () { h.classList.remove("d11-escondida"); });
  }

  /* ------------------------------------------------------- 2. APARICIÓN */
  function apariciones() {
    var els = document.querySelectorAll("[data-d11-rev]");
    if (!els.length) return;
    // Escalonado dentro de cada grupo de hermanos.
    els.forEach(function (el) {
      var hermanos = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.hasAttribute("data-d11-rev"); });
      el.style.setProperty("--d", Math.min(6, hermanos.indexOf(el)));
    });
    if (quieto || !("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("d11-visto"); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("d11-visto"); io.unobserve(x.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ------------------------------------------------------- 3. PORTADA */
  function portada() {
    var caps = Array.prototype.slice.call(document.querySelectorAll(".d11-cap[data-forma]"));
    if (!caps.length) return;
    var lienzo = document.querySelector("[data-dcode-scene='home']");
    var rail = {};
    document.querySelectorAll(".d11-rail a[data-cap]").forEach(function (a) { rail[a.getAttribute("data-cap")] = a; });
    var capasLi = document.querySelectorAll(".d11-capas li");
    var sistema = document.getElementById("sistema");
    var escena = null;
    var actual = null;

    // Atenuación por capítulo: donde se lee mucho, la escena baja la voz.
    var estrecho = window.matchMedia("(max-width: 900px)");
    var DIM = { nucleo: 1, fragmentos: 0.9, red: 0.95, capas: 1, reticula: 0.95, horizonte: 0.55, punto: 0.62 };

    function capituloActivo() {
      var linea = window.innerHeight * 0.5, elegido = caps[0];
      for (var i = 0; i < caps.length; i++) {
        var r = caps[i].getBoundingClientRect();
        if (r.top <= linea) elegido = caps[i];
      }
      return elegido;
    }

    function progresoSistema() {
      if (!sistema) return 0;
      var r = sistema.getBoundingClientRect();
      var total = r.height - window.innerHeight;
      if (total <= 0) return 0;
      return Math.max(0, Math.min(1, -r.top / total));
    }

    var capaActiva = -2;
    function actualizar() {
      var cap = capituloActivo();
      var id = cap.id;
      if (cap !== actual) {
        actual = cap;
        for (var k in rail) rail[k].classList.toggle("activo", k === id);
        document.body.classList.toggle("d11-en-entrada", id === "inicio");
        if (escena) {
          escena.irA(cap.getAttribute("data-forma"));
          escena.setDim((DIM[cap.getAttribute("data-forma")] || 1) * (estrecho.matches ? 0.6 : 1));
          escena.setFoco(null);
        }
      }
      // Capas encendidas por scroll dentro del capítulo anclado.
      if (id === "sistema" && capasLi.length) {
        var p = progresoSistema();
        var idx = Math.min(capasLi.length - 1, Math.floor(p * (capasLi.length + 0.6)));
        if (idx !== capaActiva) {
          capaActiva = idx;
          capasLi.forEach(function (li, i) { li.classList.toggle("activa", i === idx); });
          escena && escena.setFoco(idx);
        }
        escena && escena.setExtra({ ry: p * 0.9 - 0.2 });
      } else if (capaActiva !== -2) {
        capaActiva = -2;
        capasLi.forEach(function (li) { li.classList.remove("activa"); });
        escena && escena.setExtra({ ry: 0 });
        escena && escena.setFoco(null);
      }
      if (id === "inicio" && escena) {
        var h = cap.getBoundingClientRect();
        escena.setExtra({ z: Math.min(3, Math.max(0, -h.top / window.innerHeight) * 3) });
      } else if (escena) escena.setExtra({ z: 0 });
    }

    var yPrev = window.scrollY, pend = false;
    window.addEventListener("scroll", function () {
      if (escena) { var v = (window.scrollY - yPrev) / 60; escena.setAgita(v); }
      yPrev = window.scrollY;
      if (pend) return; pend = true;
      requestAnimationFrame(function () { pend = false; actualizar(); });
    }, { passive: true });
    window.addEventListener("resize", actualizar);
    actualizar();

    // Módulos: al pasar por una fila, se enciende su bloque.
    document.querySelectorAll(".d11-deptos a[data-foco]").forEach(function (a) {
      var i = +a.getAttribute("data-foco");
      var on = function () { escena && escena.setFoco(i); };
      var off = function () { escena && escena.setFoco(null); };
      a.addEventListener("mouseenter", on); a.addEventListener("focus", on);
      a.addEventListener("mouseleave", off); a.addEventListener("blur", off);
    });

    if (!lienzo) return;
    if (!webgl()) { lienzo.classList.add("d10-sin-webgl"); return; }
    var canvas = lienzo.querySelector("canvas");
    motor().then(function (m) {
      return m.montarEscena(canvas, {
        desde: "polvo", forma: (actual && actual.getAttribute("data-forma")) || "nucleo",
        observar: false, durInicial: 3.2,
      });
    }).then(function (c) {
      escena = c;
      lienzo.classList.add("d10-activo");
      actual = null; // fuerza a reaplicar forma/foco con la escena ya viva
      actualizar();
      window.addEventListener("pointermove", function (e) { if (e.pointerType === "mouse") escena.setCursor(e.clientX, e.clientY); }, { passive: true });
      document.addEventListener("pointerleave", function () { escena.soltarCursor(); });
    }).catch(function (e) {
      console.error("[d11] escena de portada no disponible:", e);
      lienzo.classList.add("d10-sin-webgl");
    });
  }

  /* Laboratorio: pestañas accesibles (flechas, Inicio/Fin). */
  function laboratorio() {
    document.querySelectorAll("[data-d11-lab]").forEach(function (lab) {
      var tabs = Array.prototype.slice.call(lab.querySelectorAll(".d11-banco-lista [role='tab']"));
      function ir(t, foco) {
        tabs.forEach(function (x) {
          var on = x === t;
          x.setAttribute("aria-selected", on ? "true" : "false");
          x.tabIndex = on ? 0 : -1;
          var p = document.getElementById(x.getAttribute("aria-controls"));
          if (p) p.hidden = !on;
        });
        if (foco) t.focus();
      }
      tabs.forEach(function (t, i) {
        t.addEventListener("click", function () { ir(t); });
        t.addEventListener("keydown", function (e) {
          var j = null;
          if (e.key === "ArrowDown" || e.key === "ArrowRight") j = (i + 1) % tabs.length;
          if (e.key === "ArrowUp" || e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
          if (e.key === "Home") j = 0;
          if (e.key === "End") j = tabs.length - 1;
          if (j != null) { e.preventDefault(); ir(tabs[j], true); }
        });
      });
    });
  }

  /* Preguntas que van al asistente real (api/chat.js vía main.js). */
  function preguntas() {
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-preguntar]");
      if (!b) return;
      var bubble = document.getElementById("chat-bubble");
      var form = document.getElementById("chat-form");
      var input = document.getElementById("chat-input");
      if (!bubble || !form || !input) { location.href = P + "/contacto"; return; }
      if (bubble.getAttribute("aria-expanded") !== "true") bubble.click();
      input.value = b.getAttribute("data-preguntar");
      if (form.requestSubmit) form.requestSubmit(); else form.dispatchEvent(new Event("submit", { cancelable: true }));
    });
  }

  /* ------------------------------------------------------- 4. INTERIORES */
  var TONOS = { comercial: "#4dd0e1", marketing: "#ff6b9d", clientes: "#35e0a1", produccion: "#ffb43a", finanzas: "#5b8cff", soporte: "#2dd4bf", administracion: "#8b93ff", direccion: "#a78bfa" };
  var SIN_ESCENA = /(privacidad|aviso-legal|cookies|condiciones-contratacion|acuerdo-encargado-tratamiento|seguridad|404)$/;

  function formaDePagina(ruta) {
    if (/\/departamentos\/?$/.test(ruta)) return "reticula";
    if (/\/departamentos\//.test(ruta)) return "capas";
    if (/\/servicios/.test(ruta)) return "red";
    if (/\/(metodo|como-funciona|garantias)$/.test(ruta)) return "capas";
    if (/\/casos-exito$/.test(ruta)) return "fragmentos";
    if (/\/sistema-financiero$/.test(ruta)) return "capas";
    if (/\/conocenos$/.test(ruta)) return "nucleo";
    if (/\/contacto$/.test(ruta)) return "punto";
    if (/\/cambios-en-proceso$/.test(ruta)) return "reticula";
    return "red";
  }

  function interior() {
    if (!document.body.classList.contains("d11-int")) return;
    var hero = document.querySelector(".page-hero");
    var ruta = location.pathname.replace(/\.html$/, "").replace(/\/$/, "");
    if (!hero || SIN_ESCENA.test(ruta)) return;

    var dept = (document.body.className.match(/dept-([a-z]+)/) || [])[1];
    var tono = dept && TONOS[dept];
    if (tono) hero.style.setProperty("--d11-tono", tono);

    var mount = document.createElement("div");
    mount.className = "d10-escena";
    mount.setAttribute("aria-hidden", "true");
    mount.innerHTML = "<canvas></canvas>";
    hero.insertBefore(mount, hero.firstChild);
    hero.classList.add("d11-con-escena");

    // El campo 2D de la página (dcp8) se aparta mientras el héroe está a la vista.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        document.body.classList.toggle("d10-oculta-campo", en[0].isIntersecting);
      }, { threshold: 0.2 }).observe(hero);
    }

    if (!webgl()) { mount.classList.add("d10-sin-webgl"); return; }
    var arrancar = function () {
      motor().then(function (m) {
        return m.montarEscena(mount.querySelector("canvas"), {
          desde: "polvo", forma: formaDePagina(ruta), n: 1900, desplazar: false,
          tinte: tono ? parseInt(tono.slice(1), 16) : null, tinteMix: 0.72, size: 5.2,
        });
      }).then(function (c) {
        mount.classList.add("d10-activo");
        hero.addEventListener("pointermove", function (e) { if (e.pointerType === "mouse") c.setCursor(e.clientX, e.clientY); });
        hero.addEventListener("pointerleave", function () { c.soltarCursor(); });
      }).catch(function (e) {
        console.error("[d11] escena interior no disponible:", e);
        mount.classList.add("d10-sin-webgl");
      });
    };
    // Tras el primer pintado: el texto del héroe nunca espera al 3D.
    if ("requestIdleCallback" in window) requestIdleCallback(arrancar, { timeout: 900 }); else setTimeout(arrancar, 200);
  }

  /* Pie: la marca como cierre tipográfico (decorativa). */
  function marcaPie() {
    var ft = document.querySelector("footer .container");
    if (!ft || ft.querySelector(".d11-marca")) return;
    if (!document.body.classList.contains("d11") && !document.body.classList.contains("d11-int")) return;
    var m = document.createElement("p");
    m.className = "d11-marca";
    m.setAttribute("aria-hidden", "true");
    m.textContent = "D-Code Partners";
    ft.insertBefore(m, ft.firstChild);
  }

  function arranque() {
    var b = document.body;
    if (!b.classList.contains("d11") && !b.classList.contains("d11-int")) return;
    montarIndice();
    cabeceraRetirable();
    apariciones();
    portada();
    laboratorio();
    preguntas();
    interior();
    marcaPie();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arranque);
  else arranque();
})();
