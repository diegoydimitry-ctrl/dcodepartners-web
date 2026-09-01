/* ============================================================================
   D-CODE PARTNERS — CAMPO CONTINUO v6
   ----------------------------------------------------------------------------
   UN SOLO SISTEMA PARA TODA LA PÁGINA.

   No hay un gráfico por sección. Hay un único campo de partículas y corrientes
   que ocupa la pantalla entera, detrás de todo, y cuyo ESTADO lo dirige el
   scroll. Al bajar, el mismo campo se transforma:

     CONVERGENCIA   las corrientes entran y se concentran en un núcleo
     DISPERSIÓN     el orden se deshace — así llega una empresa
     CONEXIÓN       las partículas encuentran sus anclas
     ESTRUCTURA     se ordenan en una retícula con perspectiva
     EN MARCHA      la retícula late y mueve información
     PRODUCTO       el campo se retira a los márgenes y deja sitio
     CONVERGENCIA   todo vuelve a un solo punto — la página cierra como abrió

   Por eso una sección no "termina" y empieza otra: es la misma materia
   cambiando de estado. En cualquier punto del scroll lo que se ve es una
   interpolación entre dos estados, nunca un corte.

   Reglas que no se rompen:
   · Nada gira eternamente sin decir nada. Cada estado significa algo.
   · prefers-reduced-motion recibe UNA imagen fija del estado, no una página rota.
   · El móvil no es lo mismo con menos partículas: cambia la composición.
   · Si el campo no puede pintarse, la página se lee igual.
   ========================================================================= */
(function () {
  'use strict';

  var root = document.querySelector('[data-field]');
  if (!root) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse  = window.matchMedia('(pointer: coarse)').matches;

  /* ---------------------------------------------------------------- PALETA */
  /* Los mismos tonos que identifican cada capacidad en el resto de la web.
     Aquí no decoran: marcan de dónde viene cada corriente. */
  var HUE = [
    [ 77, 208, 225],   // cian
    [ 91, 140, 255],   // azul
    [124, 108, 255],   // violeta
    [167, 139, 250],   // lavanda
    [255, 107, 157],   // magenta
    [ 45, 212, 191]    // turquesa
  ];
  function rgba(h, a) { return 'rgba(' + h[0] + ',' + h[1] + ',' + h[2] + ',' + a + ')'; }

  /* ------------------------------------------------------------- ESCENARIO */
  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  root.appendChild(canvas);
  var ctx = canvas.getContext('2d', { alpha: false });

  var W = 0, H = 0, dpr = 1, narrow = false;
  var core = { x: 0, y: 0 };          // núcleo de convergencia
  var N = 0, STREAMS = 0;
  var parts = [], streams = [], anchors = [], lattice = [], edges = [];

  function seeded(i, salt) {          // aleatorio estable: la portada se
    var x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;  // reconoce igual
    return x - Math.floor(x);                                  // en cada visita
  }

  function measure() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    W = root.clientWidth; H = root.clientHeight;
    narrow = W < 900;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // En pantallas estrechas el núcleo no compite con el titular: baja y se
    // centra, y el campo ocupa la mitad inferior. Composición propia, no la
    // de escritorio encogida.
    core.x = narrow ? W * 0.52 : W * 0.755;
    core.y = narrow ? H * 0.86 : H * 0.44;

    var target = Math.round((W * H) / 1500);
    N = Math.max(240, Math.min(reduced ? 420 : 950, target));
    STREAMS = narrow ? 13 : 26;
    build();
  }

  /* Construye las geometrías de todos los estados una sola vez por tamaño. */
  function build() {
    parts.length = 0;
    for (var i = 0; i < N; i++) {
      var a = seeded(i, 1), b = seeded(i, 2), c = seeded(i, 3);
      parts.push({
        i: i,
        hue: HUE[i % HUE.length],
        r: 0.5 + c * 1.3,
        // corriente: a qué carril entra y a qué velocidad lo recorre
        lane: (i % STREAMS) / STREAMS,
        u: a,                        // avance en la corriente 0..1
        sp: 0.0016 + b * 0.0028,
        // dispersión estable
        dx: a, dy: b, dr: c,
        // ancla y nodo de retícula
        an: i % Math.max(1, anchorsCount()),
        x: 0, y: 0, px: 0, py: 0, born: false
      });
    }

    // Anclas: los puntos a los que las partículas encuentran camino.
    anchors.length = 0;
    var AC = anchorsCount();
    for (var k = 0; k < AC; k++) {
      var t = (k + 0.5) / AC;
      anchors.push({
        x: W * (0.10 + 0.80 * (t * 1.0)),
        y: H * (0.26 + 0.48 * seeded(k, 7)),
        hue: HUE[k % HUE.length]
      });
    }

    // Retícula en perspectiva: el estado "estructura".
    lattice.length = 0; edges.length = 0;
    var cols = narrow ? 5 : 9, rows = narrow ? 6 : 5;
    for (var r = 0; r < rows; r++) {
      for (var q = 0; q < cols; q++) {
        var fy = r / (rows - 1);                     // 0 arriba, 1 abajo
        var persp = 0.46 + fy * 0.54;                // se abre hacia abajo
        var cx = W * 0.5 + (q / (cols - 1) - 0.5) * W * 0.86 * persp;
        var cy = H * (0.20 + fy * 0.60);
        lattice.push({ x: cx, y: cy, hue: HUE[(q + r) % HUE.length] });
        if (q > 0) edges.push([r * cols + q - 1, r * cols + q]);
        if (r > 0) edges.push([(r - 1) * cols + q, r * cols + q]);
      }
    }
    for (var j = 0; j < parts.length; j++) {
      parts[j].node = j % lattice.length;
      parts[j].an = j % anchors.length;
    }

    // Corrientes del hero: curvas que entran por el borde y convergen.
    streams.length = 0;
    for (var s = 0; s < STREAMS; s++) {
      var f = s / (STREAMS - 1) - 0.5;              // -0.5 .. 0.5
      streams.push({
        hue: HUE[s % HUE.length],
        f: f,
        off: seeded(s, 11),
        w: 0.5 + seeded(s, 13) * 1.1
      });
    }
  }
  function anchorsCount() { return narrow ? 9 : 14; }

  /* Punto de una corriente: entra por el borde opuesto al núcleo y se curva
     hacia él. En vertical entra por arriba. Devuelve {x,y}. */
  function streamPoint(st, u) {
    var e = u * u * (3 - 2 * u);                     // suavizado
    if (narrow) {
      var x0 = W * (0.5 + st.f * 1.5), y0 = -H * 0.06;
      var cx1 = W * (0.5 + st.f * 0.9), cy1 = H * 0.34;
      return bez(x0, y0, cx1, cy1, core.x - st.f * W * 0.10, core.y - H * 0.10, core.x, core.y, e);
    }
    var sx = -W * 0.12, sy = core.y + st.f * H * 1.5;
    var c1x = W * 0.24, c1y = core.y + st.f * H * 1.05;
    var c2x = W * 0.52, c2y = core.y + st.f * H * 0.30;
    return bez(sx, sy, c1x, c1y, c2x, c2y, core.x, core.y, e);
  }
  function bez(x0, y0, x1, y1, x2, y2, x3, y3, t) {
    var m = 1 - t, a = m * m * m, b = 3 * m * m * t, c = 3 * m * t * t, d = t * t * t;
    return { x: a * x0 + b * x1 + c * x2 + d * x3, y: a * y0 + b * y1 + c * y2 + d * y3 };
  }

  /* ------------------------------------------------- ESTADOS DEL CAMPO */
  /* Cada función coloca UNA partícula. El render mezcla las dos activas, así
     que el campo nunca "salta" de un estado a otro: siempre está en medio. */

  function sConverge(p, tm) {                        // 0 · convergencia
    p.u += p.sp; if (p.u > 1) p.u -= 1;
    var st = streams[p.i % streams.length];
    var q = streamPoint(st, p.u);
    // Ráfaga: al salir del núcleo, las partículas se abren hacia el lado libre
    if (p.u > 0.82) {
      var g = (p.u - 0.82) / 0.18;
      var ang = narrow ? seeded(p.i, 5) * 6.2832
                       : (seeded(p.i, 5) - 0.5) * 1.9;
      var rad = g * g * (narrow ? H * 0.20 : W * 0.20);
      q.x = core.x + Math.cos(ang) * rad;
      q.y = core.y + Math.sin(ang) * rad * (narrow ? 0.8 : 1.05);
    }
    return q;
  }
  function sScatter(p, tm) {                         // 1 · dispersión
    var dr = 0.4 + p.dr * 0.6;
    return {
      x: W * (0.06 + p.dx * 0.88) + Math.sin(tm * 0.00021 + p.i) * 26 * dr,
      y: H * (0.08 + p.dy * 0.84) + Math.cos(tm * 0.00017 + p.i * 1.7) * 22 * dr
    };
  }
  function sConnect(p, tm) {                          // 2 · conexión
    var a = anchors[p.an];
    var sw = 34 + p.dr * 26;
    return {
      x: a.x + Math.sin(tm * 0.0006 + p.i * 2.1) * sw,
      y: a.y + Math.cos(tm * 0.0005 + p.i * 1.3) * sw * 0.7
    };
  }
  function sLattice(p, tm) {                          // 3 · estructura
    var n = lattice[p.node];
    return {
      x: n.x + Math.sin(tm * 0.0008 + p.i) * 5,
      y: n.y + Math.cos(tm * 0.0009 + p.i) * 5
    };
  }
  function sRunning(p, tm) {                          // 4 · en marcha
    var n = lattice[p.node];
    var o = tm * 0.0011 + p.i * 0.9;
    var rr = 9 + p.dr * 9;
    return { x: n.x + Math.cos(o) * rr, y: n.y + Math.sin(o) * rr * 0.6 };
  }
  function sMargins(p, tm) {                          // 5 · producto
    var left = (p.i % 2) === 0;
    var edge = left ? W * (0.02 + p.dx * 0.13) : W * (0.85 + p.dx * 0.13);
    return {
      x: edge + Math.sin(tm * 0.0003 + p.i) * 14,
      y: H * (0.05 + p.dy * 0.90) + Math.cos(tm * 0.00025 + p.i) * 16
    };
  }
  function sCollapse(p, tm) {                         // 6 · convergencia final
    // El punto vive POR ENCIMA del titular de cierre: si cae detrás, el velo
    // que hace legible el texto se come el final de la historia.
    var ang = p.dx * 6.2832, rad = 5 + p.dy * 26;
    return {
      x: W * 0.5 + Math.cos(ang + tm * 0.0005) * rad,
      y: H * 0.21 + Math.sin(ang + tm * 0.0005) * rad * 0.85
    };
  }
  var STATES = [sConverge, sScatter, sConnect, sLattice, sRunning, sMargins, sCollapse];
  var STOPS  = [0.000, 0.135, 0.300, 0.400, 0.500, 0.680, 0.900];

  /* Peso de cada estado según el avance de scroll. Solo dos son distintos de
     cero a la vez, y su suma es 1: por eso la transición es continua. */
  var wA = 0, wB = 0, iA = 0, iB = 0;
  function weights(P) {
    var i = 0;
    while (i < STOPS.length - 2 && P > STOPS[i + 1]) i++;
    var t = (P - STOPS[i]) / Math.max(0.0001, STOPS[i + 1] - STOPS[i]);
    t = Math.max(0, Math.min(1, t));
    t = t * t * (3 - 2 * t);
    iA = i; iB = i + 1; wA = 1 - t; wB = t;
  }

  /* ------------------------------------------------------------- PUNTERO */
  var mx = 0, my = 0, cmx = 0, cmy = 0;
  if (!coarse && !reduced) {
    window.addEventListener('mousemove', function (e) {
      mx = (e.clientX / window.innerWidth - 0.5);
      my = (e.clientY / window.innerHeight - 0.5);
    }, { passive: true });
  }

  /* --------------------------------------------------------------- SCROLL */
  var P = 0, Pv = 0, ticking = false;
  function readScroll() {
    var d = document.documentElement;
    var max = Math.max(1, d.scrollHeight - window.innerHeight);
    P = Math.max(0, Math.min(1, window.scrollY / max));
  }
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { readScroll(); ticking = false; if (reduced) drawStill(); });
  }, { passive: true });

  /* ---------------------------------------------------------------- PINTA */
  function draw(tm, noClear) {
    weights(reduced ? P : Pv);
    cmx += (mx - cmx) * 0.05; cmy += (my - cmy) * 0.05;
    var ox = cmx * (narrow ? 6 : 22), oy = cmy * (narrow ? 4 : 14);

    // Estela: en vez de borrar, se oscurece. Eso deja el rastro de las
    // corrientes sin dibujar una sola línea de más.
    if (!noClear) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = reduced ? '#05070e' : 'rgba(5,7,14,0.20)';
      ctx.fillRect(0, 0, W, H);
    }
    ctx.globalCompositeOperation = 'lighter';

    // Intensidad de la pasada: 1 en la primera, una fracción en las que se
    // acumulan encima para componer la exposición larga.
    var acc = noClear ? 0.12 : 1;

    var A = STATES[iA], B = STATES[iB];
    var conv = wA * (iA === 0 ? 1 : 0) + wB * (iB === 0 ? 1 : 0);
    var link = (iA >= 2 && iA <= 4 ? wA : 0) + (iB >= 2 && iB <= 4 ? wB : 0);
    var lat  = (iA === 3 || iA === 4 ? wA : 0) + (iB === 3 || iB === 4 ? wB : 0);
    var coll = (iA === 6 ? wA : 0) + (iB === 6 ? wB : 0);

    // Núcleo: brilla al principio y al final. La página abre y cierra igual.
    var glow = Math.max(conv, coll);
    if (glow > 0.02 && !noClear) {
      var gx = coll > conv ? W * 0.5 : core.x + ox * 0.6;
      var gy = coll > conv ? H * 0.21 : core.y + oy * 0.6;
      var R = (coll > conv ? (narrow ? H * 0.22 : W * 0.15) : (narrow ? H * 0.30 : W * 0.20)) * (0.7 + glow * 0.5);
      var g = ctx.createRadialGradient(gx, gy, 0, gx, gy, R);
      g.addColorStop(0.00, 'rgba(226,240,255,' + (0.42 * glow) + ')');
      g.addColorStop(0.10, 'rgba(150,190,255,' + (0.30 * glow) + ')');
      g.addColorStop(0.24, 'rgba(124,108,255,' + (0.22 * glow) + ')');
      g.addColorStop(0.42, 'rgba(77,150,225,' + (0.11 * glow) + ')');
      g.addColorStop(1.00, 'rgba(9,12,26,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(gx, gy, R, 0, 6.2832); ctx.fill();
    }

    // Corrientes: las curvas que entran y convergen. Solo en el estado 0.
    if (conv > 0.02) {
      for (var s = 0; s < streams.length; s++) {
        var st = streams[s];
        ctx.beginPath();
        for (var k = 0; k <= 26; k++) {
          var q = streamPoint(st, k / 26);
          if (k === 0) ctx.moveTo(q.x + ox, q.y + oy); else ctx.lineTo(q.x + ox, q.y + oy);
        }
        ctx.strokeStyle = rgba(st.hue, 0.085 * conv * acc);
        ctx.lineWidth = st.w; ctx.stroke();

        // Ventana luminosa recorriendo la curva: la información viajando.
        var head = ((tm * 0.00013) + st.off) % 1;
        ctx.beginPath();
        for (var m = 0; m <= 8; m++) {
          var u = head - 0.10 + (m / 8) * 0.10;
          if (u < 0 || u > 1) continue;
          var w2 = streamPoint(st, u);
          if (m === 0) ctx.moveTo(w2.x + ox, w2.y + oy); else ctx.lineTo(w2.x + ox, w2.y + oy);
        }
        ctx.strokeStyle = rgba(st.hue, 0.42 * conv * acc);
        ctx.lineWidth = st.w * 1.7; ctx.stroke();
      }
    }

    // Aristas de la retícula: la estructura cuando ya existe.
    if (lat > 0.03 && !(narrow && W < 560)) {
      ctx.lineWidth = 1;
      for (var e = 0; e < edges.length; e++) {
        var a1 = lattice[edges[e][0]], b1 = lattice[edges[e][1]];
        ctx.beginPath();
        ctx.moveTo(a1.x + ox, a1.y + oy); ctx.lineTo(b1.x + ox, b1.y + oy);
        ctx.strokeStyle = 'rgba(150,180,255,' + (0.062 * lat * acc) + ')';
        ctx.stroke();
      }
      // Pulsos que recorren las aristas: el sistema trabajando.
      var run = (iA === 4 ? wA : 0) + (iB === 4 ? wB : 0);
      if (run > 0.05) {
        for (var e2 = 0; e2 < edges.length; e2 += 2) {
          var a2 = lattice[edges[e2][0]], b2 = lattice[edges[e2][1]];
          var t2 = ((tm * 0.00035) + e2 * 0.07) % 1;
          var px2 = a2.x + (b2.x - a2.x) * t2 + ox;
          var py2 = a2.y + (b2.y - a2.y) * t2 + oy;
          ctx.beginPath(); ctx.arc(px2, py2, 1.7, 0, 6.2832);
          ctx.fillStyle = 'rgba(206,226,255,' + (0.75 * run * acc) + ')'; ctx.fill();
        }
      }
    }

    // Partículas. Se pinta el trazo entre su posición anterior y la nueva:
    // eso es lo que convierte un punto en una corriente de luz.
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      var qa = A(p, tm), qb = B(p, tm);
      var x = (qa.x * wA + qb.x * wB) + ox;
      var y = (qa.y * wA + qb.y * wB) + oy;
      if (!p.born) { p.px = x; p.py = y; p.born = true; }

      var dxx = x - p.px, dyy = y - p.py;
      var d2 = dxx * dxx + dyy * dyy;
      var al = (0.34 + p.dr * 0.48) * acc;

      if (d2 > 1.2 && d2 < 9000) {
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(x, y);
        ctx.strokeStyle = rgba(p.hue, al * 0.55);
        ctx.lineWidth = p.r * 0.9; ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(x, y, p.r, 0, 6.2832);
      ctx.fillStyle = rgba(p.hue, al); ctx.fill();

      p.px = x; p.py = y;
    }

    // Enlaces partícula → ancla: el momento en que algo encuentra su sitio.
    if (link > 0.04 && !(narrow && W < 560)) {
      ctx.lineWidth = 1;
      for (var j = 0; j < parts.length; j += 2) {
        var pp = parts[j], an = anchors[pp.an];
        var ddx = pp.px - (an.x + ox), ddy = pp.py - (an.y + oy);
        var dd = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dd > 150) continue;
        ctx.beginPath();
        ctx.moveTo(pp.px, pp.py); ctx.lineTo(an.x + ox, an.y + oy);
        ctx.strokeStyle = rgba(pp.hue, (1 - dd / 150) * 0.16 * link * acc);
        ctx.stroke();
      }
    }
  }

  /* ---------------------------------------------------------------- BUCLE */
  var running = false, visible = true;
  function loop(tm) {
    if (!running) return;
    Pv += (P - Pv) * 0.075;            // el campo llega un poco después que
    draw(tm);                          // el scroll: se siente material
    if (visible) requestAnimationFrame(loop); else running = false;
  }
  function start() { if (!running && !reduced) { running = true; requestAnimationFrame(loop); } }

  /* Movimiento reducido: en vez de un solo fotograma pobre, se compone una
     exposición larga — el mismo campo dibujado muchas veces sin borrar. Queda
     una imagen rica y completamente quieta. Quien pide menos movimiento no
     merece una página apagada. */
  function drawStill() {
    draw(0, false);
    for (var i = 1; i < 40; i++) draw(i * 110, true);
  }

  measure(); readScroll(); Pv = P;
  if (reduced) { drawStill(); }
  else { start(); }

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { measure(); readScroll(); if (reduced) drawStill(); }, 180);
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    visible = !document.hidden; if (visible) start();
  });
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting; if (visible) start();
    }, { threshold: 0 }).observe(root);
  }

  /* ============================== ESTADO EN PALABRAS =======================
     Un único indicador dice en qué estado está el sistema. Es la misma idea
     del campo, escrita: nadie tiene que adivinar qué está viendo. */
  var label = document.querySelector('[data-field-state]');
  if (label) {
    var NAMES = (label.getAttribute('data-names') || '').split('|');
    var last = -1;
    function syncLabel() {
      var idx = 0;
      var Pn = reduced ? P : Pv;
      for (var i = 0; i < STOPS.length - 1; i++) if (Pn >= STOPS[i]) idx = i;
      if (idx !== last && NAMES[idx]) {
        last = idx;
        label.style.opacity = 0;
        setTimeout(function () { label.textContent = NAMES[idx]; label.style.opacity = 1; }, 200);
      }
      requestAnimationFrame(syncLabel);
    }
    label.style.transition = 'opacity .2s ease';
    requestAnimationFrame(syncLabel);
  }
})();
