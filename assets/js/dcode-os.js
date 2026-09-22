/* ============================================================================
   D-CODE OS — portada
   ----------------------------------------------------------------------------
   1. Los cables: de cada miniatura al nodo y del nodo a la aplicación. Se
      calculan con las posiciones reales, así que se adaptan a cualquier
      ancho (4 en fila, 2×2) sin desbordar. Un ResizeObserver los redibuja.
   2. La aplicación: los módulos del lateral cambian la vista. El flujo del
      negocio avanza solo —un cliente ficticio pasa del contacto al cobro—
      mientras la sección se ve. En cuanto alguien pulsa, se para y manda él;
      si deja de tocar 12 s y está en Inicio, sigue.
   3. Movimiento reducido: el flujo se queda quieto, con todos los pasos a la
      vista, y los cables no llevan pulsos.
   ========================================================================= */
(function () {
  'use strict';
  var sec = document.getElementById('dcode-os');
  if (!sec) return;
  var NS = 'http://www.w3.org/2000/svg';
  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------- 1. cables */
  var svg = sec.querySelector('.os-cables');
  var cont = svg && svg.parentElement;
  var mods = [].slice.call(sec.querySelectorAll('.os-mod'));
  var nodo = sec.querySelector('.os-nodo');
  var app = sec.querySelector('[data-os]');
  function color(el) {
    var v = getComputedStyle(el).getPropertyValue('--c').trim();
    var m = v.match(/var\((--[\w-]+)\)/);
    return m ? getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim() : (v || '#5b8cff');
  }
  function el(tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
  function dibujar() {
    if (!svg || !nodo) return;
    var R = cont.getBoundingClientRect();
    if (!R.width) return;
    var N = nodo.getBoundingClientRect();
    var nx = N.left + N.width / 2 - R.left, ny = N.top + N.height / 2 - R.top;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute('viewBox', '0 0 ' + Math.round(R.width) + ' ' + Math.round(R.height));
    var defs = el('defs', {}); svg.appendChild(defs);
    var cables = [];
    mods.forEach(function (m, i) {
      var r = m.getBoundingClientRect();
      var sx = r.left + r.width / 2 - R.left, sy = r.bottom - R.top - 2;
      var dy = ny - sy;
      var d = 'M' + sx.toFixed(1) + ' ' + sy.toFixed(1) +
        ' C' + sx.toFixed(1) + ' ' + (sy + dy * 0.55).toFixed(1) + ' ' +
        (nx + (sx - nx) * 0.12).toFixed(1) + ' ' + (ny - dy * 0.42).toFixed(1) + ' ' +
        nx.toFixed(1) + ' ' + (ny - N.height / 2 + 4).toFixed(1);
      cables.push({ d: d, c: color(m.parentElement), x1: sx, y1: sy, x2: nx, y2: ny, i: i });
    });
    if (app) {
      var A = app.getBoundingClientRect();
      var ay = A.top - R.top;
      cables.push({ d: 'M' + nx.toFixed(1) + ' ' + (ny + N.height / 2 - 4).toFixed(1) + ' L' + nx.toFixed(1) + ' ' + (ay + 1).toFixed(1), c: '#7aa2ff', x1: nx, y1: ny, x2: nx, y2: ay, i: 4, tronco: true });
    }
    cables.forEach(function (c) {
      var gid = 'os-g-' + c.i;
      var g = el('linearGradient', { id: gid, gradientUnits: 'userSpaceOnUse', x1: c.x1, y1: c.y1, x2: c.x2, y2: c.y2 });
      g.appendChild(el('stop', { offset: '0', 'stop-color': c.c, 'stop-opacity': c.tronco ? '.9' : '.95' }));
      g.appendChild(el('stop', { offset: '1', 'stop-color': c.tronco ? '#b69bff' : '#9fbcff', 'stop-opacity': '.9' }));
      defs.appendChild(g);
      svg.appendChild(el('path', { d: c.d, class: 'os-cable-luz', stroke: 'url(#' + gid + ')' }));
      svg.appendChild(el('path', { d: c.d, class: 'os-cable', stroke: 'url(#' + gid + ')' }));
      if (!reducido) {
        var p = el('path', { d: c.d, class: 'os-pulso', stroke: c.tronco ? '#dfe8ff' : c.c });
        svg.appendChild(p);
        var len = 600;
        try { len = Math.ceil(p.getTotalLength()); } catch (e) {}
        p.style.setProperty('--len', len);
        p.style.setProperty('--d', (c.tronco ? 1.4 : c.i * 0.35) + 's');
      }
    });
  }
  var pendiente = false;
  function pedirDibujo() { if (pendiente) return; pendiente = true; requestAnimationFrame(function () { pendiente = false; dibujar(); }); }
  if (window.ResizeObserver) new ResizeObserver(pedirDibujo).observe(cont);
  window.addEventListener('resize', pedirDibujo);
  document.addEventListener('dcp:tema', pedirDibujo);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(pedirDibujo);
  pedirDibujo();

  /* ------------------------------------------------------- 2. aplicación */
  if (!app) return;
  var botones = [].slice.call(app.querySelectorAll('.os-nav-b'));
  var vistas = [].slice.call(app.querySelectorAll('[data-os-vista]'));
  function ir(id) {
    botones.forEach(function (b) {
      if (b.getAttribute('data-os-ir') === id) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
    vistas.forEach(function (v) { v.hidden = v.getAttribute('data-os-vista') !== id; });
  }
  var datos = { pasos: [], quien: '' };
  try { datos = JSON.parse(app.querySelector('[data-os-datos]').textContent); } catch (e) {}
  var pasos = [].slice.call(app.querySelectorAll('.os-flujo > li'));
  var que = app.querySelector('[data-os-que]');
  var actual = 0;
  function marcar(n) {
    actual = n;
    pasos.forEach(function (li, k) {
      li.classList.toggle('is-paso-activo', k === n);
      li.classList.toggle('is-paso-hecho', k < n);
    });
    if (que && datos.pasos[n]) que.textContent = datos.pasos[n];
  }

  var timer = null, espera = null, visible = false, mandaUsuario = false;
  function parar() { if (timer) { clearInterval(timer); timer = null; } }
  function arrancar() {
    if (reducido || timer || mandaUsuario || !visible) return;
    timer = setInterval(function () { marcar((actual + 1) % pasos.length); }, 2200);
  }
  function tomaControl() {
    mandaUsuario = true; parar();
    clearTimeout(espera);
    espera = setTimeout(function () {
      var enInicio = !app.querySelector('[data-os-vista="inicio"]').hidden;
      mandaUsuario = false;
      if (enInicio) arrancar();
    }, 12000);
  }
  botones.forEach(function (b) {
    b.addEventListener('click', function () { tomaControl(); ir(b.getAttribute('data-os-ir')); });
  });
  pasos.forEach(function (li, k) {
    var b = li.querySelector('.os-paso');
    b.addEventListener('click', function () { tomaControl(); marcar(k); ir(b.getAttribute('data-os-ir')); });
  });
  app.addEventListener('keydown', function (e) { if (e.key !== 'Tab') tomaControl(); });

  if (reducido) {
    marcar(pasos.length - 1);
  } else {
    marcar(0);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        visible = e.isIntersecting;
        sec.classList.toggle('is-vivo', visible);
        if (visible) { pedirDibujo(); arrancar(); } else parar();
      });
    }, { rootMargin: '120px 0px' }).observe(sec);
  } else { visible = true; sec.classList.add('is-vivo'); arrancar(); }
})();
