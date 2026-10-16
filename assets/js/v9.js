/* D-Code Partners · v9 (versión mínima)
   Barra, menú del teléfono y apariciones. Todo funciona sin este script:
   si falla, el contenido se ve igual (las apariciones solo se activan con html.js). */
(function () {
  'use strict';
  window.__v9 = true;
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- barra: estado al hacer scroll ---------- */
  var bar = document.querySelector('[data-bar]');
  if (bar) {
    var onScroll = function () { bar.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- menú del teléfono ---------- */
  var toggle = document.querySelector('[data-toggle]');
  if (toggle) {
    var setOpen = function (open) {
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && document.body.classList.contains('menu-open')) { setOpen(false); toggle.focus(); }
    });
    document.querySelectorAll('#menu-principal a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1080) setOpen(false); });
  }

  /* ---------- apariciones escalonadas por sección ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-r]'));
  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    // Retardo escalonado dentro de cada sección: título, texto, imagen.
    var groups = new Map();
    items.forEach(function (el) {
      var sec = el.closest('section, footer') || document.body;
      var n = groups.get(sec) || 0;
      el.style.setProperty('--d', Math.min(n, 8) * 75 + 'ms');
      groups.set(sec, n + 1);
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
    // Red de seguridad: nada se queda oculto si el observador no llega a dispararse.
    window.addEventListener('load', function () {
      setTimeout(function () {
        items.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
        });
      }, 1200);
    });
  }
})();
