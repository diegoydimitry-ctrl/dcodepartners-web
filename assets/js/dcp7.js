/* ============================================================================
   D-CODE PARTNERS — ORIENTACIÓN  ·  v7
   ----------------------------------------------------------------------------
   El índice de secciones, en todas las páginas.

   Ganar espectáculo perdiendo orientación es un mal negocio: si el visitante
   no sabe dónde está ni cuánto queda, la experiencia se vuelve un laberinto.
   Este índice no desaparece nunca.

   · Si la página declara data-idx en sus secciones, se usan esas etiquetas.
   · Si no, se deduce del propio documento: cada sección con encabezado aporta
     su antetítulo (o las primeras palabras de su titular). Así funciona en
     las 72 páginas sin tener que tocarlas una a una.

   En pantalla ancha es un rail a la derecha con la sección activa marcada.
   En estrecha se reduce a una barra de avance de dos píxeles y una pastilla
   con el nombre de la sección: la misma información sin robar sitio.
   ========================================================================= */
(function () {
  'use strict';

  var main = document.getElementById('main-content');
  if (!main) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------- QUÉ SECCIONES HAY */
  function shorten(t) {
    t = (t || '').replace(/\s+/g, ' ').trim();
    if (t.length <= 22) return t;
    var w = t.split(' '), out = '';
    for (var i = 0; i < w.length; i++) {
      if ((out + ' ' + w[i]).trim().length > 22) break;
      out = (out + ' ' + w[i]).trim();
    }
    return out || t.slice(0, 22);
  }

  var marked = Array.prototype.slice.call(main.querySelectorAll('[data-idx]'));
  var items = [];

  if (marked.length >= 2) {
    items = marked.map(function (el) { return { el: el, label: el.getAttribute('data-idx') }; });
  } else {
    var secs = Array.prototype.slice.call(main.querySelectorAll('section'));
    secs.forEach(function (el) {
      if (el.getBoundingClientRect().height < 140) return;
      var kick = el.querySelector('.eyebrow, .v6-kicker, .section-head .eyebrow');
      var head = el.querySelector('h1, h2, .h-title');
      var lab = shorten((kick && kick.textContent) || (head && head.textContent) || '');
      if (!lab) return;
      items.push({ el: el, label: lab });
    });
    // Sin encabezados suficientes no hay nada útil que indexar.
    if (items.length < 2) items = [];
    if (items.length > 8) {
      var step = items.length / 8, keep = [];
      for (var k = 0; k < 8; k++) keep.push(items[Math.floor(k * step)]);
      items = keep;
    }
  }

  /* ------------------------------------------------------------ PINTADO */
  var bar = document.createElement('div');
  bar.className = 'dcx-bar'; bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = '<i></i>';
  document.body.appendChild(bar);
  var barFill = bar.firstChild;

  var rail = null, links = [], now = null;

  if (items.length >= 2) {
    rail = document.createElement('nav');
    rail.className = 'dcx';
    rail.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Sections' : 'Secciones');
    var html = '';
    items.forEach(function (it, i) {
      if (!it.el.id) it.el.id = 'sec-' + (i + 1);
      html += '<a href="#' + it.el.id + '"><span class="dcx-lab">' + it.label +
              '</span><span class="dcx-dot" aria-hidden="true"></span></a>';
    });
    rail.innerHTML = html;
    document.body.appendChild(rail);
    links = Array.prototype.slice.call(rail.querySelectorAll('a'));

    now = document.createElement('div');
    now.className = 'dcx-now';
    now.setAttribute('aria-hidden', 'true');
    now.textContent = items[0].label;
    document.body.appendChild(now);

    links.forEach(function (a, i) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var top = items[i].el.getBoundingClientRect().top + window.scrollY - 78;
        window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
      });
    });
  }

  /* ------------------------------------------------------------- ESTADO */
  var active = -1, ticking = false;
  function paint() {
    var d = document.documentElement;
    var max = Math.max(1, d.scrollHeight - window.innerHeight);
    var p = Math.max(0, Math.min(1, window.scrollY / max));
    barFill.style.width = (p * 100) + '%';
    if (!rail) return;

    // Activa: la última sección cuyo inicio ya ha pasado la línea de lectura.
    var line = window.scrollY + window.innerHeight * 0.34;
    var idx = 0;
    for (var i = 0; i < items.length; i++) {
      var t = items[i].el.getBoundingClientRect().top + window.scrollY;
      if (t <= line) idx = i;
    }
    if (idx !== active) {
      active = idx;
      links.forEach(function (a, i) {
        a.classList.toggle('on', i === idx);
        // Lo ya recorrido queda encendido: el avance lo llevan las marcas,
        // no una barra al lado.
        a.classList.toggle('done', i < idx);
        if (i === idx) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      if (now) now.textContent = items[idx].label;
    }
  }
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { paint(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', paint, { passive: true });
  window.addEventListener('load', paint);
  paint();
})();
