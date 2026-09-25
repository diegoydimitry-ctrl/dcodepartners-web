/* ============================================================================
   D-CODE PARTNERS — PRECIOS · filtrar sin recargar
   ----------------------------------------------------------------------------
   Tres filtros que se combinan: categoría, sector y necesidad. Cada ficha
   lleva sus etiquetas en el HTML (data-cat, data-sectores, data-necesidad),
   así que esto solo enseña y esconde: sin red, sin plantillas, sin estado que
   se pueda desincronizar de lo que se ve.

   Lo que se filtra se refleja en la URL (?cat=…&sector=…) para que un enlace
   a «los agentes para una clínica» se pueda mandar por WhatsApp y llegue
   igual. Y al volver atrás, el navegador devuelve el filtro donde estaba.

   Accesible: los chips son <button> de verdad, el grupo se anuncia con
   aria-pressed y el resultado del filtro se dice en voz alta una sola vez
   (aria-live discreto), no en cada pulsación.
   ========================================================================= */
(function () {
  'use strict';

  var raiz = document.querySelector('.pr-filtros');
  if (!raiz) return;

  var chips = [].slice.call(raiz.querySelectorAll('.pr-chip'));
  var fichas = [].slice.call(document.querySelectorAll('.pr-grupo .pr-card'));
  var grupos = [].slice.call(document.querySelectorAll('.pr-grupo'));
  var vacio = document.querySelector('.pr-vacio');
  if (!fichas.length) return;

  var estado = { cat: '', sector: 'todos', necesidad: '' };

  /* Una región discreta que cuenta cuántas quedan: quien navega con lector de
     pantalla no ve desaparecer tarjetas, así que hay que decírselo. */
  var voz = document.createElement('p');
  voz.className = 'sr-only';
  voz.setAttribute('aria-live', 'polite');
  raiz.appendChild(voz);
  var EN = (document.documentElement.lang || 'es').slice(0, 2) === 'en';

  function tiene(el, attr, val) {
    if (!val) return true;
    var v = (el.getAttribute(attr) || '').split(/\s+/);
    return v.indexOf(val) >= 0;
  }

  function pintar() {
    var n = 0;
    fichas.forEach(function (f) {
      var ok = (!estado.cat || f.getAttribute('data-cat') === estado.cat) &&
        (estado.sector === 'todos' || tiene(f, 'data-sectores', 'todos') || tiene(f, 'data-sectores', estado.sector)) &&
        tiene(f, 'data-necesidad', estado.necesidad);
      f.hidden = !ok;
      if (ok) n++;
    });
    grupos.forEach(function (g) {
      var vivas = [].slice.call(g.querySelectorAll('.pr-card')).some(function (f) { return !f.hidden; });
      g.hidden = !vivas;
    });
    if (vacio) vacio.hidden = n > 0;
    voz.textContent = EN
      ? (n === 1 ? '1 option matches' : n + ' options match')
      : (n === 1 ? 'Queda 1 opción' : 'Quedan ' + n + ' opciones');
    chips.forEach(function (c) {
      var k = c.getAttribute('data-filtro');
      var on = estado[k] === c.getAttribute('data-val');
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function guardar(empujar) {
    var p = new URLSearchParams();
    if (estado.cat) p.set('cat', estado.cat);
    if (estado.sector && estado.sector !== 'todos') p.set('sector', estado.sector);
    if (estado.necesidad) p.set('necesidad', estado.necesidad);
    var url = location.pathname + (p.toString() ? '?' + p : '') + '#pr-cat-t';
    try { empujar ? history.pushState(estado, '', url) : history.replaceState(estado, '', url); } catch (e) {}
  }

  function leerUrl() {
    var p = new URLSearchParams(location.search);
    estado.cat = p.get('cat') || '';
    estado.sector = p.get('sector') || 'todos';
    estado.necesidad = p.get('necesidad') || '';
  }

  chips.forEach(function (c) {
    c.setAttribute('aria-pressed', c.classList.contains('is-on') ? 'true' : 'false');
    c.addEventListener('click', function () {
      var k = c.getAttribute('data-filtro'), v = c.getAttribute('data-val');
      /* Volver a pulsar el que está puesto lo quita: es lo que espera
         cualquiera y evita tener que buscar un «ver todo» por cada fila. */
      if (estado[k] === v && v) estado[k] = (k === 'sector' ? 'todos' : '');
      else estado[k] = v;
      pintar();
      guardar(true);
    });
  });

  window.addEventListener('popstate', function () { leerUrl(); pintar(); });

  leerUrl();
  pintar();
  guardar(false);
})();


/* ═══════ EN EL TELÉFONO, EL CATÁLOGO SE PLIEGA ═══════
   Medido: /precios eran 15.170 px en una pantalla de 320 px. Los filtros ya
   existían —categoría, sector y necesidad— pero al entrar se abren los siete
   grupos a la vez y dieciocho fichas seguidas no se recorren: se abandonan.
   Aquí cada grupo se pliega, con su recuento a la vista para que se sepa qué
   hay dentro antes de abrirlo. El primero queda abierto para que se entienda
   de qué va la pantalla sin tocar nada.

   Solo por debajo de 767 px. En tableta y en ordenador el catálogo entero a
   la vista es una ventaja, no un problema, y ahí no se toca nada. Y si un
   filtro deja un grupo con fichas, se abre solo: plegado + filtrado a la vez
   escondería justo lo que el visitante acaba de pedir. */
(function () {
  var M = window.matchMedia('(max-width:767px)');
  var grupos = [].slice.call(document.querySelectorAll('.pr-grupo'));
  if (!grupos.length) return;
  var montado = false;

  function cuenta(g) {
    return g.querySelectorAll('.pr-card:not([hidden]):not(.es-fuera)').length;
  }
  function pinta(g) {
    var b = g.querySelector('.pr-plg');
    if (!b) return;
    var n = cuenta(g);
    b.querySelector('.pr-plg-n').textContent = n;
    b.setAttribute('aria-expanded', g.classList.contains('es-abierto') ? 'true' : 'false');
    g.hidden = n === 0;
  }
  function montar() {
    if (montado) return;
    montado = true;
    grupos.forEach(function (g, i) {
      var h = g.querySelector('.pr-grupo-h');
      var t = h && h.querySelector('h3');
      if (!h || !t) return;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pr-plg';
      b.innerHTML = '<span class="pr-plg-n"></span><span class="pr-plg-i" aria-hidden="true"></span>';
      b.setAttribute('aria-controls', g.id || (g.id = 'pr-g-' + i));
      b.addEventListener('click', function () {
        g.classList.toggle('es-abierto');
        pinta(g);
      });
      h.appendChild(b);
      if (i === 0) g.classList.add('es-abierto');
      pinta(g);
    });
    document.documentElement.classList.add('pr-plegado');
  }
  function desmontar() {
    if (!montado) return;
    montado = false;
    grupos.forEach(function (g) {
      var b = g.querySelector('.pr-plg');
      if (b) b.parentNode.removeChild(b);
      g.classList.remove('es-abierto');
      g.hidden = false;
    });
    document.documentElement.classList.remove('pr-plegado');
  }
  function aplicar() { if (M.matches) montar(); else desmontar(); }
  aplicar();
  try { M.addEventListener('change', aplicar); } catch (e) {}

  /* Al filtrar, abrir los grupos que siguen teniendo algo. */
  document.addEventListener('click', function (e) {
    if (!montado || !e.target.closest('.pr-chip')) return;
    window.setTimeout(function () {
      grupos.forEach(function (g) {
        if (cuenta(g) > 0) g.classList.add('es-abierto');
        pinta(g);
      });
    }, 30);
  });
})();
