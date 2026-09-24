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
