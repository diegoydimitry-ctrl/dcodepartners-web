/* ============================================================================
   D-CODE PARTNERS — INTERACCIÓN v2
   ----------------------------------------------------------------------------
   Complemento de main.js, no sustituto: main.js sigue gobernando el menú, el
   burger, el chat y las clases .reveal. Aquí solo vive lo nuevo del rediseño.

   Reglas que se respetan en todo el fichero:
   - Nada se ejecuta si el usuario pide movimiento reducido.
   - Nada se ejecuta si el elemento no existe (todas las páginas cargan este
     fichero, pero solo la Home tiene constelación).
   - El puntero se lee con rAF y solo cuando el elemento está en pantalla:
     un mousemove sin acotar es la forma más rápida de arruinar el scroll.
   ========================================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------ 1. PARALAJE DE PUNTERO */
  /* La constelación se inclina levemente siguiendo el cursor. Es lo que hace
     que el sistema parezca un objeto y no una imagen. Muy sutil a propósito:
     pasado cierto punto marea y estorba la lectura. */
  function initOrbitParallax() {
    var orbit = document.querySelector('[data-orbit]');
    if (!orbit || reduced) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var visible = false, ticking = false, tx = 0, ty = 0;

    var io = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    io.observe(orbit);

    function apply() {
      ticking = false;
      orbit.style.transform = 'perspective(1100px) rotateX(' + (-ty * 5).toFixed(2) +
                              'deg) rotateY(' + (tx * 5).toFixed(2) + 'deg)';
    }

    window.addEventListener('mousemove', function (e) {
      if (!visible) return;
      tx = (e.clientX / window.innerWidth) - 0.5;
      ty = (e.clientY / window.innerHeight) - 0.5;
      if (!ticking) { ticking = true; requestAnimationFrame(apply); }
    }, { passive: true });
  }

  /* ------------------------------------------------------- 2. CONTADORES */
  /* Las cifras de telemetría suben al entrar en pantalla. Solo se anima la
     parte numérica: "30 días" anima el 30 y conserva el sufijo, y un valor
     sin número (24/7) se deja intacto en vez de romperlo. */
  function initCounters() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    if (reduced) return; // el valor final ya está en el HTML

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);

        var raw = el.getAttribute('data-count');
        var target = parseFloat(raw);
        if (!isFinite(target)) return;

        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';
        var dur = 900, start = null;

        function step(ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });

    els.forEach(function (el) { io.observe(el); });
  }

  /* --------------------------------------- 3. RESALTADO CRUZADO DE HUE */
  /* Al pasar por una tarjeta de Departamento se enciende su nodo homólogo en
     la constelación. Refuerza que el color identifica a la entidad: la
     tarjeta y el nodo son la misma cosa vista dos veces. */
  function initCrossHighlight() {
    var cards = document.querySelectorAll('.v2-dept[href]');
    if (!cards.length) return;

    cards.forEach(function (card) {
      var href = card.getAttribute('href');
      var node = document.querySelector('.v2-node[href="' + href + '"]');
      if (!node) return;
      var plate = node.querySelector('.v2-node-plate');
      var name = node.querySelector('.v2-node-name');
      if (!plate) return;

      function on() {
        plate.style.transform = 'scale(1.22)';
        plate.style.boxShadow = '0 0 0 7px color-mix(in srgb, var(--hue) 20%, transparent),' +
                                '0 16px 44px -8px color-mix(in srgb, var(--hue) 90%, transparent)';
        if (name) name.style.color = 'var(--hue)';
      }
      function off() {
        plate.style.transform = '';
        plate.style.boxShadow = '';
        if (name) name.style.color = '';
      }
      card.addEventListener('mouseenter', on);
      card.addEventListener('mouseleave', off);
      card.addEventListener('focus', on);
      card.addEventListener('blur', off);
    });
  }

  function boot() {
    initOrbitParallax();
    initCounters();
    initCrossHighlight();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
