/* D-CODE · DIAGNÓSTICO (portada). Lógica de producción sin cambios (misma
   fórmula, mismos supuestos en el JSON de la página); solo cambian las clases
   de los botones y que «Míralo funcionando» abre la demo en el visor. */
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var EN = document.documentElement.lang === 'en';
var REDUCIDO = matchMedia('(prefers-reduced-motion: reduce)').matches;
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
          ? '<a class="dx-sis-l" href="' + (EN ? '/en' : '') + '/#tocalo">' + esc(R.mira) + ' ' + ABAJO + '</a>'
          : '<a class="dx-sis-l" href="' + esc(a.link) + '">' + esc(R.vea) + ' ' + FLECHA + '</a>';
        return '<li class="dx-sis-i" style="--c:var(' + a.c + ')"><div class="dx-sis-c"><p class="dx-sis-n"><i aria-hidden="true"></i>' + esc(a.n) + ' · ' + esc(a.sis) + '</p>' + destino + '</div>' +
          '<ul class="dx-sis-t">' + a.t.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></li>';
      }).join('');
      var primera = null;
      for (var i = 0; i < sel.length; i++) if (D.areas[sel[i]].demo) { primera = D.areas[sel[i]].demo; break; }
      res.innerHTML =
        '<div class="dx-res-cab"><span class="dx-est"><i aria-hidden="true"></i>' + esc(R.est) + '</span></div>' +
        '<h2 class="dx-q dx-res-t" id="dx-q4" tabindex="-1">' + R.titulo.replace('{h}', num(c.H)).replace('{a}', num(c.A)) + '</h2>' +
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
          (primera ? '<a class="boton boton--principal" href="' + (EN ? '/en' : '') + '/#tocalo">' + esc(R.cta1) + '</a>' : '') +
          '<a class="boton" href="' + esc(D.contacto) + '?desde=diagnostico" data-dx-contacto>' + esc(R.cta2) + '</a>' +
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
