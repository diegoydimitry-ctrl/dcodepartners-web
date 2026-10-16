/* D-Code Partners · v9
   Barra, menú del teléfono, apariciones, el descifrador y el relleno del
   formulario de contacto. Todo funciona sin este script: si falla, el
   contenido se ve igual (las apariciones solo se activan con html.js). */
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

  /* ---------- el descifrador ---------- */
  var form = document.querySelector('[data-dec]');
  var dataEl = document.getElementById('dec-data');
  if (form && dataEl) {
    var data = JSON.parse(dataEl.textContent);
    var cfg = data.cfg, frases = data.frases;
    var sec = form.closest('.dec');
    var out = {
      horas: sec.querySelector('[data-horas]'),
      eq: sec.querySelector('[data-eq]'),
      sis: sec.querySelector('[data-sis]'),
      per: sec.querySelector('[data-per]'),
      cta: sec.querySelector('[data-cta]'),
      dep: sec.querySelector('[data-dep]')
    };
    var fmt = new Intl.NumberFormat(cfg.lang === 'en' ? 'en-GB' : 'es-ES');
    var shown = parseInt(out.horas.textContent.replace(/\D/g, ''), 10) || 0;
    var raf = null;

    var animateTo = function (target) {
      if (raf) cancelAnimationFrame(raf);
      if (reduce) { shown = target; out.horas.textContent = fmt.format(target); return; }
      var from = shown, t0 = performance.now(), dur = 520;
      var step = function (now) {
        var p = Math.min(1, (now - t0) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        shown = Math.round(from + (target - from) * eased);
        out.horas.textContent = fmt.format(shown);
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    var val = function (name) { return parseInt(form.elements[name].value, 10) || 0; };
    var update = function (changedPhrase) {
      var f = frases[form.elements.frase.value];
      if (changedPhrase) {
        form.elements.min.value = f.min;
        form.elements.veces.value = f.veces;
        out.sis.textContent = f.sistema;
        out.per.textContent = f.persona;
        [out.sis, out.per].forEach(function (el) { el.classList.remove('is-tick'); void el.offsetWidth; el.classList.add('is-tick'); });
      }
      ['min', 'veces', 'personas'].forEach(function (n) {
        var o = form.querySelector('[data-v="' + n + '"]');
        if (o) o.textContent = form.elements[n].value;
      });
      var horas = Math.round(val('min') * val('veces') * val('personas') * cfg.semanas / 60);
      animateTo(horas);
      out.eq.textContent = cfg.eq.replace('{j}', fmt.format(Math.round(horas / 8))).replace('{s}', cfg.semanas);
      out.dep.textContent = cfg.dep.replace('{area}', f.area);
      out.dep.setAttribute('href', f.href);
      var q = new URLSearchParams({ tarea: f.frase, horas: String(horas) });
      out.cta.setAttribute('href', cfg.contacto + '?' + q.toString());
    };
    form.elements.frase.addEventListener('change', function () { update(true); });
    ['min', 'veces', 'personas'].forEach(function (n) {
      form.elements[n].addEventListener('input', function () { update(false); });
    });
    form.addEventListener('submit', function (ev) { ev.preventDefault(); });
    update(false);
  }

  /* ---------- contacto: la tarea que llega del descifrador ---------- */
  var msg = document.getElementById('mensaje');
  if (msg && !msg.value) {
    var params = new URLSearchParams(window.location.search);
    var tarea = params.get('tarea'), horas = params.get('horas');
    if (tarea && tarea.length < 120 && /^\d{1,6}$/.test(horas || '')) {
      var en = root.lang === 'en';
      msg.value = en
        ? '«' + tarea + '» Around ' + horas + ' hours a year by my numbers. I would like to look at it.'
        : '«' + tarea + '» Según mis números son unas ' + horas + ' horas al año. Me gustaría verlo.';
    }
  }
})();
