/* ============================================================================
   D-CODE PARTNERS — dcp10 · EL SISTEMA, EL DIAGNÓSTICO Y LA GALERÍA
   ----------------------------------------------------------------------------
   Tres piezas y ninguna depende de las otras: cada una se busca en la página
   y, si no está, no hace nada.

     arquitectura()   [data-arq]        el sistema en nueve etapas
     diagnostico()    [data-dx]         tres toques y la cuenta sale sola
     galeria()        [data-gal]        Finance y los sistemas a medida

   Movimiento con significado y solo cuando se ve: todo lo que se anima se
   para fuera de la pantalla, con la pestaña oculta y con
   prefers-reduced-motion.
   ========================================================================= */
(function () {
  'use strict';

  var REDUCIDO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EN = (document.documentElement.lang || 'es').slice(0, 2) === 'en';

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function visible(el, cb, margen) {
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    new IntersectionObserver(function (es) { es.forEach(function (e) { cb(e.isIntersecting); }); },
      { rootMargin: margen || '0px', threshold: 0.12 }).observe(el);
  }

  /* ======================================================================
     1 · ARQUITECTURA
     El HTML trae las nueve etapas escritas (se leen sin JS). Aquí se
     enciende el esquema, se dibujan los cables midiendo dónde han caído las
     cajas —así sirve igual a 1440 que a 320— y se lleva el recorrido.
     ==================================================================== */
  function arquitectura(root) {
    var mapa = $('.arq-mapa', root);
    var svg = $('.arq-cables', root);
    var botones = $$('.arq-e', root);
    var tNum = $('.arq-num b', root), tTit = $('.arq-t', root), tDes = $('.arq-d', root);
    var texto = $('.arq-texto', root);
    var btnPlay = $('[data-arq-play]', root);
    var btnSig = $('[data-arq-sig]', root);
    var scan = $('.arq-scan', root);
    var reglas = $$('.arq-auto .arq-mod-l li', root);
    if (!mapa || !svg || botones.length !== 9) return;

    root.classList.add('is-vivo');
    var N = botones.length;
    var DUR = [2700, 3000, 3200, 2800, 2800, 3600, 3300, 3200, 4200];   // el recorrido va más ligero: cada etapa se lee y pasa
    var etapa = 1, enPantalla = false, pausaUsuario = REDUCIDO, encima = false;
    var t0 = 0, acumulado = 0, raf = 0, pulsos = [], rutas = [], reglaI = 0, reglaT = 0;
    var NS = 'http://www.w3.org/2000/svg';

    function el(tag, attrs, padre) {
      var n = document.createElementNS(NS, tag);
      for (var k in attrs) n.setAttribute(k, attrs[k]);
      if (padre) padre.appendChild(n);
      return n;
    }

    /* ---------------------------------------------------------- CABLES */
    function caja(n) {
      var r = n.getBoundingClientRect(), m = mapa.getBoundingClientRect();
      return { x: r.left - m.left, y: r.top - m.top, w: r.width, h: r.height,
        cx: r.left - m.left + r.width / 2, cy: r.top - m.top + r.height / 2,
        r: r.right - m.left, b: r.bottom - m.top };
    }
    function dibujar() {
      var m = mapa.getBoundingClientRect();
      if (!m.width) return;
      svg.setAttribute('viewBox', '0 0 ' + m.width + ' ' + m.height);
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var defs = el('defs', {}, svg);
      var g = el('linearGradient', { id: 'arqGrad', gradientUnits: 'userSpaceOnUse', x1: '0', y1: '0', x2: String(m.width), y2: String(m.height * 0.35) }, defs);
      el('stop', { offset: '0', 'stop-color': '#43e0ff', 'stop-opacity': '.75' }, g);
      el('stop', { offset: '.55', 'stop-color': '#5b8cff', 'stop-opacity': '.9' }, g);
      el('stop', { offset: '1', 'stop-color': '#9b6bff', 'stop-opacity': '.8' }, g);
      var mk = el('marker', { id: 'arqFlecha', viewBox: '0 0 10 10', refX: '6', refY: '5', markerWidth: '7', markerHeight: '7', orient: 'auto-start-reverse' }, defs);
      el('path', { d: 'M1 1 L8 5 L1 9', fill: 'none', stroke: 'rgba(169,194,255,.8)', 'stroke-width': '1.4' }, mk);

      var areas = $$('.arq-area', root).map(caja);
      var nucleo = caja($('.arq-nucleo', root));
      var panel = caja($('.arq-panel', root));
      var colAreas = caja($('.arq-areas', root));
      var movil = window.matchMedia('(max-width:760px)').matches;
      rutas = [];

      // Roto: el trabajo que salta de un área a la siguiente y se cae.
      for (var i = 0; i < areas.length - 1; i++) {
        var a = areas[i], b = areas[i + 1], d, px, py;
        if (movil) {
          if (i % 2 === 1) continue;                      // en rejilla, entre las dos de una fila
          d = 'M' + a.r + ' ' + a.cy + ' L' + b.x + ' ' + b.cy;
          px = (a.r + b.x) / 2; py = (a.cy + b.cy) / 2;
        } else {
          var sal = a.x - 14;
          d = 'M' + a.x + ' ' + a.cy + ' C' + sal + ' ' + a.cy + ' ' + sal + ' ' + b.cy + ' ' + b.x + ' ' + b.cy;
          px = sal + 3.5; py = (a.cy + b.cy) / 2;
        }
        el('path', { d: d, class: 'arq-c-roto' }, svg);
        el('path', { d: 'M' + (px - 3.5) + ' ' + (py - 3.5) + ' L' + (px + 3.5) + ' ' + (py + 3.5) + ' M' + (px + 3.5) + ' ' + (py - 3.5) + ' L' + (px - 3.5) + ' ' + (py + 3.5), class: 'arq-x' }, svg);
      }

      // Plan y vivo: cada área con el núcleo, y el núcleo con el panel.
      function cable(d, conPulso) {
        el('path', { d: d, class: 'arq-c-plan' }, svg);
        var p = el('path', { d: d, class: 'arq-c-vivo' }, svg);
        if (conPulso) rutas.push(p);
      }
      if (movil) {
        var tx = colAreas.cx;
        cable('M' + tx + ' ' + colAreas.b + ' L' + tx + ' ' + nucleo.y, true);
        cable('M' + nucleo.cx + ' ' + $$('.arq-mid .arq-mod', root).map(caja).reduce(function (mx, c) { return Math.max(mx, c.b); }, 0) + ' L' + panel.cx + ' ' + panel.y, true);
      } else {
        areas.forEach(function (a) {
          var x1 = a.r, y1 = a.cy, x2 = nucleo.x, y2 = nucleo.cy + (a.cy - nucleo.cy) * 0.18;
          var k = (x2 - x1) * 0.55;
          cable('M' + x1 + ' ' + y1 + ' C' + (x1 + k) + ' ' + y1 + ' ' + (x2 - k) + ' ' + y2 + ' ' + x2 + ' ' + y2, true);
        });
        var k2 = (panel.x - nucleo.r) * 0.5;
        cable('M' + nucleo.r + ' ' + nucleo.cy + ' C' + (nucleo.r + k2) + ' ' + nucleo.cy + ' ' + (panel.x - k2) + ' ' + panel.cy + ' ' + panel.x + ' ' + panel.cy, true);
      }

      // Bucle: lo medido vuelve al principio.
      var fondo = Math.max(panel.b, colAreas.b, nucleo.b) + (movil ? 14 : 22);
      var dB;
      if (movil) {
        var izq = 6;
        dB = 'M' + panel.x + ' ' + panel.cy + ' C' + izq + ' ' + panel.cy + ' ' + izq + ' ' + panel.cy + ' ' + izq + ' ' + (panel.cy - 40) +
             ' L' + izq + ' ' + (colAreas.y + 30) + ' C' + izq + ' ' + (colAreas.y + 12) + ' ' + izq + ' ' + (colAreas.y + 12) + ' ' + (colAreas.x + 14) + ' ' + (colAreas.y + 12);
      } else {
        dB = 'M' + panel.cx + ' ' + panel.b + ' C' + panel.cx + ' ' + fondo + ' ' + panel.cx + ' ' + fondo + ' ' + (panel.cx - 30) + ' ' + fondo +
             ' L' + (colAreas.cx + 30) + ' ' + fondo + ' C' + colAreas.cx + ' ' + fondo + ' ' + colAreas.cx + ' ' + fondo + ' ' + colAreas.cx + ' ' + (colAreas.b + 6);
      }
      el('path', { d: dB, class: 'arq-c-bucle', 'marker-end': 'url(#arqFlecha)' }, svg);

      // Pulsos: puntos precalculados por ruta, así el fotograma no mide nada.
      pulsos = rutas.map(function (p, i) {
        var L = p.getTotalLength(), pts = [];
        for (var s = 0; s <= 48; s++) { var q = p.getPointAtLength(L * s / 48); pts.push([q.x, q.y]); }
        var c = el('circle', { r: movil ? 2.6 : 2.4, class: 'arq-pulso' }, svg);
        return { c: c, pts: pts, fase: (i * 0.137) % 1, vel: 0.00042 + (i % 3) * 0.00006 };
      });
      if (scan) root.style.setProperty('--scan-h', Math.max(40, colAreas.b - 4) + 'px');
    }

    /* --------------------------------------------------------- ETAPAS */
    function poner(n, porUsuario) {
      etapa = n;
      root.setAttribute('data-e', String(n));
      botones.forEach(function (b, i) {
        var on = i === n - 1;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
        b.classList.toggle('is-hecha', i < n - 1);
        b.style.setProperty('--p', on ? (pausaUsuario ? '1' : '0') : '');
      });
      var b = botones[n - 1];
      tNum.textContent = (n < 10 ? '0' : '') + n;
      tTit.textContent = $('.arq-e-t', b).textContent;
      tDes.textContent = $('.arq-e-d', b).textContent;
      texto.setAttribute('aria-live', porUsuario ? 'polite' : 'off');
      texto.classList.remove('is-cambio'); void texto.offsetWidth; texto.classList.add('is-cambio');
      acumulado = 0; t0 = performance.now();
      reglaI = 0; reglaT = t0;
      reglas.forEach(function (r) { r.classList.remove('is-on'); });
      if (scan && n === 3) { scan.style.animation = 'none'; void scan.offsetWidth; scan.style.animation = ''; }
      despertar();
    }
    function avanzar() { poner(etapa >= N ? 1 : etapa + 1, false); }

    function corriendo() { return enPantalla && !pausaUsuario && !encima && !document.hidden; }
    function pintarPlay() {
      if (!btnPlay) return;
      var parado = pausaUsuario;
      btnPlay.setAttribute('aria-pressed', parado ? 'false' : 'true');
      btnPlay.setAttribute('aria-label', parado ? (EN ? 'Play the walkthrough' : 'Reproducir el recorrido') : (EN ? 'Pause the walkthrough' : 'Pausar el recorrido'));
      $('.arq-ico-pausa', btnPlay).style.display = parado ? 'none' : '';
      $('.arq-ico-play', btnPlay).style.display = parado ? '' : 'none';
    }

    /* ----------------------------------------------------- EL FOTOGRAMA */
    var ultimo = 0;
    function frame(ts) {
      raf = 0;
      if (!enPantalla || document.hidden) return;
      var dt = ultimo ? Math.min(64, ts - ultimo) : 16; ultimo = ts;
      if (corriendo()) {
        acumulado += dt;
        var p = Math.min(1, acumulado / DUR[etapa - 1]);
        botones[etapa - 1].style.setProperty('--p', p.toFixed(3));
        if (p >= 1) { avanzar(); }
      }
      // Automatización: las reglas se encienden por turno.
      if (etapa === 6 && reglas.length && ts - reglaT > 1100) {
        reglas.forEach(function (r, i) { r.classList.toggle('is-on', i <= reglaI); });
        reglaI = Math.min(reglas.length - 1, reglaI + 1); reglaT = ts;
      } else if (etapa > 6 && reglas.length) {
        reglas.forEach(function (r) { r.classList.add('is-on'); });
      }
      // Pulsos: solo cuando hay algo que circula.
      var vivos = etapa >= 6 && !REDUCIDO;
      for (var i = 0; i < pulsos.length; i++) {
        var q = pulsos[i];
        if (!vivos) { q.c.style.opacity = '0'; continue; }
        q.fase = (q.fase + dt * q.vel) % 1;
        var f = q.fase * (q.pts.length - 1), a = Math.floor(f), t = f - a, A = q.pts[a], B = q.pts[Math.min(a + 1, q.pts.length - 1)];
        q.c.setAttribute('cx', (A[0] + (B[0] - A[0]) * t).toFixed(1));
        q.c.setAttribute('cy', (A[1] + (B[1] - A[1]) * t).toFixed(1));
        q.c.style.opacity = (Math.sin(q.fase * Math.PI) * 0.95).toFixed(2);
      }
      if (corriendo() || vivos || etapa === 6) raf = requestAnimationFrame(frame);
    }
    function despertar() { if (!raf && enPantalla) { ultimo = 0; raf = requestAnimationFrame(frame); } }

    /* ------------------------------------------------------ CONTROLES */
    botones.forEach(function (b, i) {
      b.addEventListener('click', function () {
        pausaUsuario = true; pintarPlay(); poner(i + 1, true);
      });
      b.addEventListener('keydown', function (e) {
        var k = e.key, n = null;
        if (k === 'ArrowRight' || k === 'ArrowDown') n = i + 1 >= N ? 0 : i + 1;
        else if (k === 'ArrowLeft' || k === 'ArrowUp') n = i - 1 < 0 ? N - 1 : i - 1;
        else if (k === 'Home') n = 0; else if (k === 'End') n = N - 1;
        if (n === null) return;
        e.preventDefault(); pausaUsuario = true; pintarPlay(); poner(n + 1, true); botones[n].focus();
      });
    });
    if (btnPlay) btnPlay.addEventListener('click', function () {
      pausaUsuario = !pausaUsuario; pintarPlay();
      if (!pausaUsuario && etapa === N) poner(1, false);
      acumulado = acumulado || 0; despertar();
    });
    if (btnSig) btnSig.addEventListener('click', function () {
      pausaUsuario = true; pintarPlay(); poner(etapa >= N ? 1 : etapa + 1, true);
    });
    // Pasar el ratón por encima NO para el recorrido; solo pulsar (o el foco
    // de teclado) lo detiene.
    root.addEventListener('focusin', function () { encima = true; });
    root.addEventListener('focusout', function () { encima = false; despertar(); });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) despertar(); });

    var espera = 0;
    function remedir() { clearTimeout(espera); espera = setTimeout(function () { dibujar(); despertar(); }, 120); }
    if ('ResizeObserver' in window) new ResizeObserver(remedir).observe(mapa);
    else window.addEventListener('resize', remedir);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(remedir);

    visible(root, function (si) { enPantalla = si; if (si) despertar(); });
    dibujar();
    pintarPlay();
    poner(REDUCIDO ? 1 : 1, false);
  }

  $$('[data-arq]').forEach(arquitectura);

  /* ======================================================================
     2 · DIAGNÓSTICO
     Los textos y los supuestos vienen en el JSON de la propia página: el JS
     no tiene su copia. Cuatro pasos; el cuarto es el resultado.
     ==================================================================== */
  function num(n, dec) {
    // Siempre con los miles agrupados (1.150, no 1150): la norma de la casa.
    var s = (dec ? n.toFixed(dec) : Math.round(n).toString());
    var p = s.split('.'), ent = p[0], neg = ent.charAt(0) === '-';
    if (neg) ent = ent.slice(1);
    var sep = EN ? ',' : '.', out = '';
    while (ent.length > 3) { out = sep + ent.slice(-3) + out; ent = ent.slice(0, -3); }
    out = (neg ? '-' : '') + ent + out;
    if (p[1]) out += (EN ? '.' : ',') + p[1];
    return out;
  }
  function euros(n) { return EN ? '€' + num(n) : num(n) + ' €'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ABAJO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function diagnostico(root) {
    var D;
    try { D = JSON.parse($('script[type="application/json"]', root).textContent); } catch (e) { return; }
    root.classList.add('is-vivo');
    var ORDEN = Object.keys(D.areas);
    var sel = [], horas = {}, tarifa = 25, paso = 1;
    var pasos = $$('.dx-paso', root), marcas = $$('.dx-pasos li', root);
    var tiles = $$('.dx-area', root), selTxt = $('.dx-sel', root), sig1 = $('[data-dx-ir="2"]', root);
    var filas = $('.dx-filas', root), res = $('.dx-res', root);

    function ir(n, foco) {
      if (n === 2) pintarFilas();
      if (n === 4) pintarResultado();
      paso = n;
      pasos.forEach(function (p) { p.hidden = +p.getAttribute('data-paso') !== n; });
      marcas.forEach(function (m, i) { m.classList.toggle('is-on', i === n - 1); m.classList.toggle('is-hecho', i < n - 1); });
      if (foco !== false) {
        var h = $('.dx-q', pasos[n - 1]);
        if (h) h.focus({ preventScroll: true });
        // Si la pregunta nueva se ha quedado por encima de la vista, se sube a ella.
        var r = root.getBoundingClientRect();
        if (r.top < 0) root.scrollIntoView({ behavior: REDUCIDO ? 'auto' : 'smooth', block: 'start' });
      }
    }

    function contar() {
      var n = sel.length, f = D.elegidas.split('|');
      selTxt.innerHTML = n ? '<b>' + esc((n === 1 ? f[0] : f[1]).replace('{n}', n)) + '</b>' : esc(D.ninguna);
      sig1.disabled = !n;
    }
    tiles.forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-area'), on = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (on) { if (sel.indexOf(k) < 0) sel.push(k); } else sel = sel.filter(function (x) { return x !== k; });
        sel.sort(function (a, c) { return ORDEN.indexOf(a) - ORDEN.indexOf(c); });
        contar();
      });
    });

    function pintarFilas() {
      filas.innerHTML = sel.map(function (k) {
        var a = D.areas[k], v = horas[k] || D.niveles[0][2];
        return '<fieldset class="dx-fila" style="--c:var(' + a.c + ')"><legend class="sr-only">' + esc(a.n) + '</legend><div class="dx-fila-in"><span class="dx-fila-l" aria-hidden="true"><i></i>' + esc(a.n) + '</span><div class="dx-opts">' +
          D.niveles.map(function (nv) {
            return '<label class="dx-opt"><input type="radio" name="dx-h-' + k + '" value="' + nv[2] + '"' + (nv[2] === v ? ' checked' : '') + '><span>' + esc(nv[0]) + ' <small>' + esc(nv[1]) + '</small></span></label>';
          }).join('') + '</div></div></fieldset>';
      }).join('');
      sel.forEach(function (k) { if (!horas[k]) horas[k] = D.niveles[0][2]; });
      $$('input', filas).forEach(function (i) {
        i.addEventListener('change', function () { horas[i.name.slice(5)] = +i.value; });
      });
    }
    /* EL COSTE DE LA HORA LO PONE ÉL. Los cuatro botones son atajos —18, 25,
       35 y 50— pero una hora de trabajo no vale siempre uno de esos cuatro
       números, y el resultado entero cuelga de esta cifra. Así que al lado va
       un campo donde se escribe la suya. Mandan el último que se haya tocado:
       si escribe, se apagan los botones; si pulsa un botón, se vacía el campo.
       Un valor imposible —cero, en blanco, letras— no se acepta: se vuelve al
       botón marcado, para que nunca salga un cálculo con una tarifa absurda. */
    var radios = $$('input[name="dx-tarifa"]', root);
    var libre = $('.dx-libre', root);
    function tarifaDeBotones() {
      for (var i = 0; i < radios.length; i++) if (radios[i].checked) return +radios[i].value;
      return 25;
    }
    radios.forEach(function (i) {
      i.addEventListener('change', function () {
        tarifa = +i.value;
        if (libre) { libre.value = ''; libre.classList.remove('es-puesta'); }
      });
    });
    if (libre) {
      libre.addEventListener('input', function () {
        var v = parseFloat(libre.value);
        if (isFinite(v) && v >= 1 && v <= 500) {
          tarifa = v;
          libre.classList.add('es-puesta');
          radios.forEach(function (r) { r.checked = false; });
        } else {
          libre.classList.remove('es-puesta');
          if (libre.value === '') { radios.forEach(function (r) { if (+r.value === 25) r.checked = true; }); tarifa = tarifaDeBotones(); }
        }
      });
      /* Al salir del campo con algo que no vale, se limpia y vuelve el botón. */
      libre.addEventListener('blur', function () {
        var v = parseFloat(libre.value);
        if (libre.value !== '' && !(isFinite(v) && v >= 1 && v <= 500)) {
          libre.value = ''; libre.classList.remove('es-puesta');
          radios.forEach(function (r) { if (+r.value === 25) r.checked = true; });
          tarifa = tarifaDeBotones();
        }
      });
    }

    function calculo() {
      var H = 0, Hr = 0;
      sel.forEach(function (k) { H += horas[k]; Hr += horas[k] * D.areas[k].rep; });
      var Y = H * 46, R = H ? Hr / H : 0;
      return { H: H, Y: Y, C: Y * tarifa, R: R, A: Y * R, F: Hr, FTE: Y / 1840 };
    }

    function pintarResultado() {
      var c = calculo(), R = D.res, tf = D.tarifa_fmt.replace('{n}', tarifa);
      var hoy = sel.map(function (k) { return '<i style="--c:var(' + D.areas[k].c + ');width:' + (horas[k] / c.H * 100).toFixed(2) + '%"></i>'; }).join('');
      var despues = sel.map(function (k) { return '<i style="--c:var(' + D.areas[k].c + ');width:' + (horas[k] * (1 - D.areas[k].rep) / c.H * 100).toFixed(2) + '%"></i>'; }).join('') +
        '<i class="dx-hueco" style="width:' + (c.R * 100).toFixed(2) + '%"></i>';
      var sis = sel.map(function (k) {
        var a = D.areas[k];
        var destino = a.demo
          ? '<a class="dx-sis-l" href="#sistemas" data-demo="' + a.demo + '">' + esc(R.mira) + ' ' + ABAJO + '</a>'
          : '<a class="dx-sis-l" href="' + esc(a.link) + '">' + esc(R.vea) + ' ' + FLECHA + '</a>';
        return '<li class="dx-sis-i" style="--c:var(' + a.c + ')"><div class="dx-sis-c"><p class="dx-sis-n"><i aria-hidden="true"></i>' + esc(a.n) + ' · ' + esc(a.sis) + '</p>' + destino + '</div>' +
          '<ul class="dx-sis-t">' + a.t.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></li>';
      }).join('');
      var primera = null;
      for (var i = 0; i < sel.length; i++) if (D.areas[sel[i]].demo) { primera = D.areas[sel[i]].demo; break; }
      res.innerHTML =
        '<div class="dx-res-cab"><span class="dx-est"><i aria-hidden="true"></i>' + esc(R.est) + '</span></div>' +
        '<h3 class="dx-q dx-res-t" id="dx-q4" tabindex="-1">' + R.titulo.replace('{h}', num(c.H)).replace('{a}', num(c.A)) + '</h3>' +
        '<div class="dx-res-g"><div>' +
          '<div class="dx-kpis">' +
            kpi(R.k1, c.Y, R.k1u, R.k1d.replace('{h}', num(c.H)), '') +
            kpi(R.k2, c.C, R.k2u, R.k2d.replace('{t}', tf), 'dx-kpi--mal', true) +
            kpi(R.k3, Math.round(c.R * 100), R.k3u, R.k3d, 'dx-kpi--bien') +
            kpi(R.k4, c.FTE, R.k4u, R.k4d, '', false, 1) +
          '</div>' +
          '<div class="dx-barras"><p class="dx-barras-k">' + esc(R.bk) + '</p>' +
            '<div class="dx-barra"><span class="dx-barra-n">' + esc(R.hoy) + '</span><span class="dx-pista" aria-hidden="true">' + hoy + '</span><span class="dx-barra-v">' + num(c.H) + ' ' + esc(R.hs) + '</span></div>' +
            '<div class="dx-barra"><span class="dx-barra-n">' + esc(R.con) + '</span><span class="dx-pista" aria-hidden="true">' + despues + '</span><span class="dx-barra-v">' + num(c.H - c.F) + ' ' + esc(R.hs) + '</span></div>' +
            '<p class="dx-libera"><i aria-hidden="true"></i><span>' + R.libera.replace('{f}', num(c.F, c.F % 1 ? 1 : 0)) + '</span></p>' +
          '</div>' +
        '</div><div><p class="dx-sis-k">' + esc(R.sk) + '</p><ul class="dx-sis">' + sis + '</ul></div></div>' +
        '<details class="dx-como"><summary>' + esc(R.como) + '</summary><p>' + esc(R.como_t) + '</p><p>' + esc(R.como_t2) + '</p></details>' +
        '<div class="dx-fin">' +
          (primera ? '<a class="btn btn-primary" href="#sistemas" data-demo="' + primera + '">' + esc(R.cta1) + '</a>' : '') +
          '<a class="btn btn-ghost" href="' + esc(D.contacto) + '?desde=diagnostico" data-dx-contacto>' + esc(R.cta2) + '</a>' +
          '<button type="button" class="dx-atras" data-dx-ir="3">' + esc(D.atras) + '</button>' +
          '<button type="button" class="dx-otra" data-dx-reinicio>' + esc(R.otra) + '</button>' +
        '</div>';
      res.classList.remove('is-lleno');
      requestAnimationFrame(function () { requestAnimationFrame(function () { res.classList.add('is-lleno'); }); });
      contarHasta();
      $('[data-dx-contacto]', res).addEventListener('click', function () {
        var nombres = sel.map(function (k) { return D.areas[k].n; }).join(', ');
        var msg = R.msg.replace('{areas}', nombres).replace('{h}', num(c.H)).replace('{y}', num(c.Y)).replace('{c}', euros(c.C)).replace('{t}', tf);
        try { sessionStorage.setItem('dcp-diagnostico', msg); } catch (e) { /* sin almacenamiento: se llega igual */ }
      });
    }
    function kpi(k, v, u, d, cls, esEuro, dec) {
      return '<div class="dx-kpi ' + cls + '"><p class="dx-kpi-k">' + esc(k) + '</p><p class="dx-kpi-n" data-v="' + v + '" data-dec="' + (dec || 0) + '" data-eur="' + (esEuro ? 1 : 0) + '">' +
        (esEuro ? euros(v) : num(v, dec || 0)) + (u ? '<small>' + esc(u) + '</small>' : '') + '</p><p class="dx-kpi-d">' + esc(d) + '</p></div>';
    }
    function contarHasta() {
      if (REDUCIDO) return;
      $$('.dx-kpi-n', res).forEach(function (n) {
        var v = +n.getAttribute('data-v'), dec = +n.getAttribute('data-dec'), eur = n.getAttribute('data-eur') === '1';
        var small = $('small', n), suf = small ? small.outerHTML : '', t0 = performance.now(), T = 900;
        (function f(ts) {
          var p = Math.min(1, (ts - t0) / T), e = 1 - Math.pow(1 - p, 3), x = v * e;
          n.innerHTML = (eur ? euros(x) : num(x, dec)) + suf;
          if (p < 1) requestAnimationFrame(f);
        })(t0);
      });
    }

    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-dx-ir]');
      if (b && root.contains(b) && !b.disabled) { ir(+b.getAttribute('data-dx-ir')); return; }
      if (e.target.closest('[data-dx-reinicio]')) {
        sel = []; horas = {}; tiles.forEach(function (t) { t.setAttribute('aria-pressed', 'false'); }); contar(); ir(1);
      }
    });
    contar();
    ir(1, false);
  }
  $$('[data-dx]').forEach(diagnostico);

  /* ======================================================================
     3 · GALERÍA DE SISTEMAS
     Pestañas accesibles (flechas, Inicio, Fin). Los ficheros de cada demo
     se piden cuando la galería se acerca a la pantalla y solo los de la
     pestaña abierta; el resto, cuando se abren. Finance lo sigue cargando
     su propio cargador (dcp5), que ya espera a que su hueco sea visible.
     ==================================================================== */
  var cargados = {};
  function cargarCss(href) {
    if (!href || cargados[href] || document.querySelector('link[href="' + href + '"]')) return;
    cargados[href] = 1;
    var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; document.head.appendChild(l);
  }
  function cargarJs(src) {
    if (cargados[src]) return cargados[src];
    cargados[src] = new Promise(function (ok, mal) {
      var s = document.createElement('script'); s.src = src; s.async = false;
      s.onload = ok; s.onerror = mal; document.head.appendChild(s);
    });
    return cargados[src];
  }
  /* EN EL TELÉFONO LA APLICACIÓN NO SE MONTA (en tableta sí: ahí se usa).
     Estas demos son aplicaciones de escritorio: bandeja, menú lateral,
     fichas de ocho columnas. Apretadas en 390 px enseñan algo peor que no
     enseñar nada, y montarlas cuesta lo que más se nota en un móvil —un
     árbol grande, sus animaciones y su recorrido— justo mientras se está
     desplazando. En su lugar se lee la ficha: qué problema resuelve, qué
     hace y qué pasa solo. Quien quiera la aplicación, la abre con el botón. */
  var SIN_APP = window.matchMedia('(max-width: 900px)').matches;
  function galeria(root) {
    var tabs = $$('.gal-tab', root), paneles = $$('.gal-panel', root);
    var motorCss = root.getAttribute('data-css'), motorJs = root.getAttribute('data-js');
    var cerca = false, actual = null, forzados = {};
    function panel(id) { for (var i = 0; i < paneles.length; i++) if (paneles[i].getAttribute('data-demo') === id) return paneles[i]; return null; }
    function ficha(p, id) {
      p.classList.add('es-sin-app');
      if ($('.gal-movil', p)) return;
      var nombre = '', tab = null;
      for (var i = 0; i < tabs.length; i++) if (tabs[i].getAttribute('data-demo') === id) tab = tabs[i];
      if (tab) { var n = $('.gal-tab-n', tab); nombre = n ? n.textContent.trim() : ''; }
      var caja = document.createElement('div');
      caja.className = 'gal-movil';
      /* UNA FOTO DE LA APLICACIÓN DE VERDAD. Contar lo que hace un sistema
         sin enseñarlo es pedir un acto de fe. Son capturas de esta misma
         demo, tomadas en los dos temas; pesan 30-58 KB y se cargan solo
         cuando hacen falta. */
      var foto = /^(finance|comercial|operaciones|atencion)$/.test(id)
        ? '<span class="gal-movil-foto">' +
            '<img class="es-oscuro" src="/assets/img/demos/' + id + '-dark-700.webp" srcset="/assets/img/demos/' + id + '-dark-700.webp 700w, /assets/img/demos/' + id + '-dark.webp 1400w" sizes="190vw" width="1400" height="793" loading="lazy" decoding="async" alt="' +
              (EN ? 'The ' : 'La aplicación de ') + esc(nombre) + (EN ? ' application, on a computer' : ', en un ordenador') + '">' +
            '<img class="es-claro" src="/assets/img/demos/' + id + '-light-700.webp" srcset="/assets/img/demos/' + id + '-light-700.webp 700w, /assets/img/demos/' + id + '-light.webp 1400w" sizes="190vw" width="1400" height="793" loading="lazy" decoding="async" alt="">' +
          '</span>'
        : '';
      caja.innerHTML =
        foto +
        '<p class="gal-movil-k">' + (EN ? 'On a small screen' : 'En pantalla pequeña') + '</p>' +
        '<h4 class="gal-movil-t">' + (EN
          ? 'Here you read it; to use it, a computer.'
          : 'Aquí se lee; para usarlo, un ordenador.') + '</h4>' +
        '<p class="gal-movil-p">' + (EN
          ? (nombre || 'This system') + ' is a working application: an inbox, a side menu and records with a dozen fields. Squeezed into a phone it looks worse than it is, so we tell it instead — the four steps above are what it does, in order.'
          : (nombre || 'Este sistema') + ' es una aplicación de trabajo: una bandeja, un menú lateral y fichas de doce campos. Apretada en un teléfono se ve peor de lo que es, así que te la contamos: los cuatro pasos de arriba son lo que hace, en orden.') + '</p>' +
        '<button type="button" class="gal-movil-b" data-gal-forzar>' +
          (EN ? 'Open it here anyway' : 'Abrirlo aquí igualmente') + '</button>';
      caja.querySelector('[data-gal-forzar]').addEventListener('click', function () {
        forzados[id] = 1; p.classList.remove('es-sin-app'); caja.remove(); preparar(id);
      });
      var app = $('.gal-app', p);
      if (app && app.parentNode) app.parentNode.insertBefore(caja, app);
      else p.appendChild(caja);
    }
    function preparar(id) {
      var p = panel(id); if (!p || !cerca) return;
      var host = $('.sd-host', p), js = p.getAttribute('data-js');
      if (!host || !js) return;                 // Finance: lo carga dcp5
      if (SIN_APP && !forzados[id]) { ficha(p, id); return; }
      cargarCss(motorCss);
      cargarJs(motorJs).then(function () { return cargarJs(js); }).then(function () {
        if (window.SD && window.SD.montar) window.SD.montar(host);
      }).catch(function () { host.setAttribute('data-error', '1'); });
    }
    function elegir(id, foco) {
      if (!panel(id)) return;
      actual = id;
      tabs.forEach(function (t) {
        var on = t.getAttribute('data-demo') === id;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        if (on && foco) t.focus();
      });
      paneles.forEach(function (p) { p.hidden = p.getAttribute('data-demo') !== id; });
      preparar(id);
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { elegir(t.getAttribute('data-demo')); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = tabs.length - 1;
        if (n === null) return;
        e.preventDefault(); elegir(tabs[n].getAttribute('data-demo'), true);
      });
    });
    $$('[data-gal-sig]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        elegir(b.getAttribute('data-gal-sig'));
        var r = root.getBoundingClientRect();
        if (r.top < 0) root.scrollIntoView({ behavior: REDUCIDO ? 'auto' : 'smooth', block: 'start' });
      });
    });
    document.addEventListener('dcp:demo', function (e) { elegir(e.detail.id); });
    window.addEventListener('hashchange', function () {
      var m = (location.hash || '').match(/^#sistemas-([a-z]+)$/);
      if (m && panel(m[1])) { elegir(m[1]); root.scrollIntoView({ behavior: REDUCIDO ? 'auto' : 'smooth', block: 'start' }); }
    });
    var h = (location.hash || '').match(/^#sistemas-([a-z]+)$/);
    elegir(h && panel(h[1]) ? h[1] : tabs[0].getAttribute('data-demo'));
    if (h) setTimeout(function () { root.scrollIntoView({ block: 'start' }); }, 60);
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting) { cerca = true; preparar(actual); io.disconnect(); } });
      }, { rootMargin: '700px 0px' });
      io.observe(root);
    } else { cerca = true; preparar(actual); }
  }
  $$('[data-gal]').forEach(galeria);

  /* Cualquier enlace con data-demo lleva a la galería con ese sistema abierto
     (lo escucha la galería; si no hay galería en la página, es un ancla). */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-demo]');
    if (!a) return;
    var id = a.getAttribute('data-demo');
    var gal = document.querySelector('[data-gal]');
    if (!gal) return;
    e.preventDefault();
    document.dispatchEvent(new CustomEvent('dcp:demo', { detail: { id: id, desde: a } }));
    gal.scrollIntoView({ behavior: REDUCIDO ? 'auto' : 'smooth', block: 'start' });
  });

  window.DCP10 = window.DCP10 || {};
})();
