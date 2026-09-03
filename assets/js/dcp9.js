/* ===========================================================================
   dcp9 — COMPOSICIONES LIGADAS A UN BLOQUE

   Los instrumentos de dcp8 son ambiente: uno por pagina, detras de todo. Sirven
   para dar temperatura, no para dar identidad. Una pagina no se distingue de
   otra porque el fondo se mueva distinto; se distingue por como esta compuesto
   lo que dice.

   Esto es lo otro: un lienzo atado a un bloque concreto del contenido, que
   dibuja una idea que sale de lo que ese bloque afirma. Se declara con
   data-comp="nombre" y el lienzo se ajusta solo a la caja del bloque.

   Reglas que se cumplen aqui:
    - Nada se dibuja si el bloque no esta en pantalla.
    - Con prefers-reduced-motion se pinta UN fotograma fijo y se para.
    - El lienzo es aria-hidden y no recibe ningun evento: no hay informacion
      que solo exista en el dibujo.
   =========================================================================== */
(function () {
  'use strict';

  var nodos = document.querySelectorAll('[data-comp]');
  if (!nodos.length) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* La misma paleta y los mismos significados que la portada y que dcp8. */
  var C = {
    cian:   [ 46, 216, 240],
    azul:   [ 78, 128, 255],
    violeta:[141,  98, 250],
    lav:    [178, 138, 255],
    rosa:   [255,  86, 168],
    verde:  [ 52, 224, 198],
    luz:    [236, 244, 255]
  };
  function rgba(h, a) { return 'rgba(' + h[0] + ',' + h[1] + ',' + h[2] + ',' + a + ')'; }
  function clamp(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }
  function ease(t) { t = clamp(t); return t * t * (3 - 2 * t); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  var COMP = {};

  /* ---------------------------------------------------------------- TRENZA
     /servicios dice: "Tres disciplinas. Un sistema. No se venden por separado.
     Se combinan." Y debajo habia tres columnas identicas, separadas, alineadas
     — exactamente lo contrario de lo que la frase promete.

     Esto es lo que la frase dice, dibujado: tres hebras que bajan desde donde
     esta escrito cada servicio, se cruzan de verdad —una pasa por delante y
     otra por detras, con su sombra— y salen por abajo como un solo cable.

     Las hebras arrancan en el centro real de cada columna, leido del DOM, no
     en tercios inventados: si el texto cambia de sitio, la trenza va detras. */
  COMP.trenza = {
    anclas: function (host) {
      var caja = host.getBoundingClientRect();
      var col = host.parentNode.querySelectorAll('.out');
      var xs = [], i;
      for (i = 0; i < col.length; i++) {
        var r = col[i].getBoundingClientRect();
        xs.push((r.left + r.width * 0.5 - caja.left) / Math.max(1, caja.width));
      }
      if (xs.length !== 3) xs = [0.17, 0.5, 0.83];
      return xs;
    },
    dibujar: function (ctx, W, H, tm, host, est) {
      var xs = est.xs || (est.xs = this.anclas(host));
      var TON = [C.cian, C.violeta, C.azul];   // flujo, criterio, dato
      var yc = H * 0.56;
      var x0 = W * 0.015, x1 = W * 0.985, anchoT = x1 - x0;
      var A = Math.min(21, H * 0.19);           // amplitud del tejido
      var VUELTAS = Math.max(2.0, Math.min(3.6, anchoT / 330));
      var t = tm * 0.00016;
      var COL = 190, k, i;

      /* Un tramo = una rebanada vertical del cable. Se calculan las tres
         hebras y su profundidad, y se pintan de atras hacia delante: eso es lo
         que convierte tres senos superpuestos en un tejido de verdad. */
      function hebra(k, u) {
        var f = u * VUELTAS * 6.2832 + k * 2.0944 + t;
        /* El ultimo tramo cierra: las tres dejan de separarse y salen como
           una sola. Es lo que dice la pagina: no se venden por separado. */
        var cierre = ease(clamp((u - 0.86) / 0.14));
        var amp = A * (1 - cierre) * ease(clamp(u / 0.05));
        return { y: yc + Math.sin(f) * amp, d: Math.cos(f) * (1 - cierre) };
      }

      var px = [], py = [], pd = [];
      for (i = 0; i <= COL; i++) {
        var u = i / COL, fx = x0 + anchoT * u, fy = [], fd = [];
        for (k = 0; k < 3; k++) { var p = hebra(k, u); fy.push(p.y); fd.push(p.d); }
        px.push(fx); py.push(fy); pd.push(fd);
      }

      var orden = [0, 1, 2];
      for (i = 0; i < COL; i++) {
        var dd = pd[i];
        orden.sort(function (a, b) { return dd[a] - dd[b]; });
        for (var o = 0; o < 3; o++) {
          k = orden[o];
          var d = (dd[k] + 1) * 0.5;                     // 0 detras, 1 delante
          var an = 1.45 + d * 1.85;
          var al = 0.40 + d * 0.55;
          /* La sombra bajo la hebra de delante: sin ella, un cruce no se lee
             como un cruce sino como dos lineas que se tocan. */
          if (d > 0.60) {
            ctx.strokeStyle = 'rgba(5,7,14,' + (0.80 * (d - 0.60) / 0.40).toFixed(3) + ')';
            ctx.lineWidth = an + 4.5;
            ctx.beginPath(); ctx.moveTo(px[i], py[i][k]); ctx.lineTo(px[i + 1], py[i + 1][k]); ctx.stroke();
          }
          ctx.strokeStyle = rgba(TON[k], al);
          ctx.lineWidth = an;
          ctx.beginPath(); ctx.moveTo(px[i], py[i][k]); ctx.lineTo(px[i + 1], py[i + 1][k]); ctx.stroke();
        }
      }

      /* Cada disciplina entra en el cable por donde esta escrita. La bajada
         termina exactamente sobre SU hebra, no sobre el eje. */
      for (k = 0; k < 3; k++) {
        var ux = clamp((xs[k] * W - x0) / anchoT);
        var ex = x0 + anchoT * ux, ey = hebra(k, ux).y;
        var g = ctx.createLinearGradient(0, 0, 0, ey);
        g.addColorStop(0, rgba(TON[k], 0)); g.addColorStop(1, rgba(TON[k], 0.62));
        ctx.strokeStyle = g; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(ex, 0); ctx.lineTo(ex, ey); ctx.stroke();
        ctx.fillStyle = rgba(TON[k], 0.95);
        ctx.beginPath(); ctx.arc(ex, ey, 2.6, 0, 6.2832); ctx.fill();
      }

      /* Y la salida: un solo cable. */
      var sy = hebra(0, 1).y;
      ctx.strokeStyle = rgba(C.luz, 0.86); ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.moveTo(x1 - 26, sy); ctx.lineTo(x1, sy); ctx.stroke();
      ctx.fillStyle = rgba(C.luz, 0.95);
      ctx.beginPath(); ctx.arc(x1, sy, 3.2, 0, 6.2832); ctx.fill();
    }
  };

  /* ----------------------------------------------------------------- MOTOR */
  function montar(host) {
    var nombre = host.getAttribute('data-comp');
    var comp = COMP[nombre];
    if (!comp) return;

    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
    host.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var W = 0, H = 0, dpr = 1, est = {}, vivo = false, rafId = 0;

    function medir() {
      var r = host.getBoundingClientRect();
      if (!r.width || !r.height) return false;
      W = r.width; H = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      est = {};                       // las anclas se releen tras cada medida
      return true;
    }

    function pintar(tm) {
      ctx.clearRect(0, 0, W, H);
      comp.dibujar(ctx, W, H, tm, host, est);
    }

    function bucle(tm) {
      if (!vivo) return;
      pintar(tm);
      rafId = requestAnimationFrame(bucle);
    }

    function arrancar() {
      if (vivo || !W) return;
      vivo = true; rafId = requestAnimationFrame(bucle);
    }
    function parar() { vivo = false; if (rafId) cancelAnimationFrame(rafId); rafId = 0; }

    if (!medir()) return;

    if (reduced) {
      /* Un solo fotograma, en un instante fijo: la trenza se ve tejida, pero
         no se mueve nada. Y al ser un instante FIJO, dos capturas de la misma
         pagina son identicas, que es lo que permite comparar antes y despues. */
      pintar(0);
      var reMedir = function () { if (medir()) pintar(0); };
      window.addEventListener('resize', reMedir);
      return;
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) arrancar(); else parar();
      }, { rootMargin: '120px 0px' }).observe(host);
    } else { arrancar(); }

    var tmr = 0;
    window.addEventListener('resize', function () {
      clearTimeout(tmr);
      tmr = setTimeout(function () { medir(); }, 140);
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) parar(); else if (W) arrancar();
    });
  }

  for (var i = 0; i < nodos.length; i++) montar(nodos[i]);
})();
