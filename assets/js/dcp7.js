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
  /* EN LA PORTADA, EL INDICE SE RETIRA MIENTRAS EL HERO LLENA LA VENTANA.
     Ahi se cruzaba por encima de la marca —la parte mas importante de la
     primera pantalla— y ademas no tenia nada que decir: estas en la primera
     seccion de nueve y todavia no has empezado a recorrer nada. Se retrae a
     sus trazos minimos (el estilo esta en dcp7.css) y vuelve entero en cuanto
     el hero deja de ocupar la ventana. Sigue siendo accesible con raton y con
     teclado sin salir del hero. */
  var hero = document.body.classList.contains('v6')
    ? document.querySelector('.v6-hero') : null;
  var fuera = false, heroFin = 0;

  /* GEOMETRIA EN CACHE. Antes cada fotograma de scroll preguntaba al navegador
     por la caja de CADA seccion del indice —hasta nueve lecturas forzadas de
     geometria por fotograma, en las 72 paginas— y por la del hero. Ninguna de
     esas cajas se mueve al hacer scroll: lo que cambia es scrollY. Se miden
     una vez, al cargar y al redimensionar, y se vuelven a medir solas si la
     altura del documento cambia (imagenes, fuentes, un panel que se abre). */
  var TOP = [], docH = -1;
  function medir() {
    var sy = window.scrollY;
    for (var i = 0; i < items.length; i++) TOP[i] = items[i].el.getBoundingClientRect().top + sy;
    if (hero) heroFin = hero.getBoundingClientRect().bottom + sy;
    docH = document.documentElement.scrollHeight;
  }
  function retirada(sy) {
    if (!rail || !hero) return;
    var q = (heroFin - sy) > window.innerHeight * 0.62;
    if (q !== fuera) { fuera = q; rail.classList.toggle('dcx--fuera', q); }
  }

  var active = -1, ticking = false;
  function paint() {
    var d = document.documentElement;
    if (d.scrollHeight !== docH) medir();      // el documento ha cambiado de alto
    var max = Math.max(1, d.scrollHeight - window.innerHeight);
    var sy = window.scrollY;
    var p = Math.max(0, Math.min(1, sy / max));
    barFill.style.width = (p * 100) + '%';
    if (!rail) return;
    retirada(sy);

    // Activa: la última sección cuyo inicio ya ha pasado la línea de lectura.
    var line = sy + window.innerHeight * 0.34;
    var idx = 0;
    for (var i = 0; i < items.length; i++) {
      if (TOP[i] <= line) idx = i;
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
  /* ------------------------------------------- QUÉ SECCIÓN ESTÁ HABLANDO
     El indice dice donde estas en el recorrido; esto dice donde estas en la
     PAGINA. La seccion que ocupa la banda de lectura se marca, y su señal
     —la marca del antetitulo, la costura de su filo— se alarga y se enciende
     en su color; las demas se apartan sin apagarse.

     Solo toca mobiliario: rayas, costuras y nodos. Ningun texto cambia de
     color ni de contraste, asi que no hay nada que romper en accesibilidad.
     Y no cuesta nada por fotograma: lo resuelve el navegador con un
     IntersectionObserver, no el scroll. */
  (function () {
    var zonas = document.querySelectorAll('[data-amb]');
    if (!zonas.length || !window.IntersectionObserver) return;
    var io = new IntersectionObserver(function (es) {
      for (var i = 0; i < es.length; i++) es[i].target.classList.toggle('sec-on', es[i].isIntersecting);
    }, { rootMargin: '-32% 0px -42% 0px' });
    for (var j = 0; j < zonas.length; j++) io.observe(zonas[j]);
  })();

  window.addEventListener('resize', function () { medir(); paint(); }, { passive: true });
  window.addEventListener('load', function () { medir(); paint(); });
  medir(); paint();
})();
