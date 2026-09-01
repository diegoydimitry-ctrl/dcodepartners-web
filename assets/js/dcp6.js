/* ============================================================================
   D-CODE PARTNERS — CAMPO CONTINUO (portada)
   ----------------------------------------------------------------------------
   UN SOLO SISTEMA PARA TODA LA PÁGINA, con un arco completo.

   No hay un gráfico por sección: hay una única materia detrás de todo cuyo
   estado lo dirige el scroll. Y ese estado cuenta una historia entera:

     CONVERGENCIA  las corrientes entran y se concentran
     CAOS          el orden se deshace — así llega una empresa
     AGRUPACIÓN    lo disperso empieza a juntarse por afinidad
     CONEXIÓN      aparecen las relaciones entre grupos
     ESTRUCTURA    las partículas se colocan SOBRE el cableado: el esqueleto
     SISTEMAS      el esqueleto se diferencia en módulos con identidad propia
     EN MARCHA     los módulos intercambian información: el sistema trabaja
     OPERANDO      el campo se retira y deja sitio al producto
     UN SOLO PUNTO todo converge otra vez: la página cierra como abrió

   Dos decisiones que sostienen todo esto:

   1. LOS ESTADOS SALEN DEL DOM, NO DE NÚMEROS FIJOS. Cada sección declara
      data-state; el motor mide dónde cae y coloca ahí su parada. Si mañana
      cambia el texto, el estado sigue coincidiendo con su sección.

   2. EN CUALQUIER PUNTO SE VEN DOS ESTADOS MEZCLADOS. Nunca hay un corte:
      lo que se ve es siempre la interpolación entre el que se va y el que
      llega, y eso es lo que hace que la página no parezca un collage.

   Brillo: contenido. La luz solo tiene sentido si hay oscuridad alrededor,
   así que las partículas tienen profundidad (las lejanas son más pequeñas y
   más tenues) y el núcleo no se quema nunca a blanco puro.
   ========================================================================= */
(function () {
  'use strict';

  var root = document.querySelector('[data-field]');
  if (!root) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse  = window.matchMedia('(pointer: coarse)').matches;

  /* ---------------------------------------------------------------- PALETA */
  var HUE = [
    [ 77, 208, 225], [ 91, 140, 255], [124, 108, 255],
    [167, 139, 250], [255, 107, 157], [ 45, 212, 191]
  ];
  /* Tonos de módulo: los mismos que identifican cada capacidad en la web. */
  var MOD_HUE = [
    [ 77, 208, 225], [255, 107, 157], [ 53, 224, 161], [255, 180,  58],
    [ 91, 140, 255], [ 45, 212, 191], [139, 147, 255], [167, 139, 250]
  ];
  function rgba(h, a) { return 'rgba(' + h[0] + ',' + h[1] + ',' + h[2] + ',' + a + ')'; }

  /* ------------------------------------------------------------- ESCENARIO */
  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  root.appendChild(canvas);
  var ctx = canvas.getContext('2d', { alpha: false });

  var W = 0, H = 0, dpr = 1, narrow = false;
  var core = { x: 0, y: 0 };
  var N = 0, STREAMS = 0;
  var parts = [], streams = [], clusters = [], modules = [], spines = [];

  function seeded(i, salt) {
    var x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  function measure() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    W = root.clientWidth; H = root.clientHeight;
    narrow = W < 900;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    core.x = narrow ? W * 0.52 : W * 0.755;
    core.y = narrow ? H * 0.86 : H * 0.44;
    var target = Math.round((W * H) / 1500);
    N = Math.max(240, Math.min(reduced ? 420 : 950, target));
    STREAMS = narrow ? 13 : 26;
    build();
  }

  function build() {
    /* --- Agrupación: seis núcleos de afinidad repartidos sin simetría. */
    clusters.length = 0;
    var CN = narrow ? 4 : 6;
    for (var c = 0; c < CN; c++) {
      clusters.push({
        x: W * (0.16 + 0.68 * seeded(c, 21)),
        y: H * (0.20 + 0.58 * seeded(c, 22)),
        hue: HUE[c % HUE.length]
      });
    }

    /* --- Arquitectura por capas: entradas, proceso, decisión, salida.
       No es un suelo cuadriculado: es un sistema con jerarquía. */
    modules.length = 0; spines.length = 0;
    var TIERS = narrow ? [[2, .18], [2, .40], [2, .62], [1, .82]]
                       : [[3, .20], [2, .42], [2, .62], [1, .80]];
    var idx = 0, tierStart = [];
    for (var t = 0; t < TIERS.length; t++) {
      tierStart.push(idx);
      var n = TIERS[t][0], fy = TIERS[t][1];
      var span = narrow ? 0.74 : 0.62;
      for (var q = 0; q < n; q++) {
        var fx = n === 1 ? 0.5 : 0.5 + (q / (n - 1) - 0.5) * span;
        modules.push({
          x: W * fx, y: H * fy,
          rx: (narrow ? W * 0.15 : W * 0.075), ry: H * 0.055,
          hue: MOD_HUE[idx % MOD_HUE.length], tier: t
        });
        idx++;
      }
    }
    for (var t2 = 0; t2 < TIERS.length - 1; t2++) {
      var a0 = tierStart[t2], a1 = tierStart[t2] + TIERS[t2][0];
      var b0 = tierStart[t2 + 1], b1 = tierStart[t2 + 1] + TIERS[t2 + 1][0];
      for (var i2 = a0; i2 < a1; i2++) for (var j2 = b0; j2 < b1; j2++) spines.push([i2, j2]);
    }

    /* --- Partículas. z es profundidad: las lejanas son menores y más tenues,
       y eso es lo que hace que el campo tenga fondo en vez de ser un plano. */
    parts.length = 0;
    for (var i = 0; i < N; i++) {
      var a = seeded(i, 1), b = seeded(i, 2), cc = seeded(i, 3), d = seeded(i, 4);
      var z = 0.34 + cc * 0.66;
      parts.push({
        i: i, hue: HUE[i % HUE.length], z: z,
        r: (0.5 + d * 1.15) * z,
        lane: (i % STREAMS) / STREAMS, u: a, sp: (0.0015 + b * 0.0026) * (0.6 + z * 0.6),
        dx: a, dy: b, dr: cc, dq: d,
        cl: i % Math.max(1, clusters.length),
        mo: i % Math.max(1, modules.length),
        sp2: i % Math.max(1, spines.length),
        along: d,
        x: 0, y: 0, px: 0, py: 0, born: false
      });
    }

    streams.length = 0;
    for (var s = 0; s < STREAMS; s++) {
      streams.push({
        hue: HUE[s % HUE.length], f: s / (STREAMS - 1) - 0.5,
        off: seeded(s, 11), w: 0.45 + seeded(s, 13) * 0.9
      });
    }
  }

  function streamPoint(st, u) {
    var e = u * u * (3 - 2 * u);
    if (narrow) {
      return bez(W * (0.5 + st.f * 1.5), -H * 0.06,
                 W * (0.5 + st.f * 0.9), H * 0.34,
                 core.x - st.f * W * 0.10, core.y - H * 0.10, core.x, core.y, e);
    }
    return bez(-W * 0.12, core.y + st.f * H * 1.5,
               W * 0.24, core.y + st.f * H * 1.05,
               W * 0.52, core.y + st.f * H * 0.30, core.x, core.y, e);
  }
  function bez(x0, y0, x1, y1, x2, y2, x3, y3, t) {
    var m = 1 - t, a = m * m * m, b = 3 * m * m * t, c = 3 * m * t * t, d = t * t * t;
    return { x: a * x0 + b * x1 + c * x2 + d * x3, y: a * y0 + b * y1 + c * y2 + d * y3 };
  }

  /* ============================= LOS NUEVE ESTADOS ======================= */

  function sConverge(p, tm) {                   // 0 · convergencia
    p.u += p.sp; if (p.u > 1) p.u -= 1;
    var q = streamPoint(streams[p.i % streams.length], p.u);
    if (p.u > 0.82) {
      var g = (p.u - 0.82) / 0.18;
      var ang = narrow ? seeded(p.i, 5) * 6.2832 : (seeded(p.i, 5) - 0.5) * 1.9;
      var rad = g * g * (narrow ? H * 0.20 : W * 0.20);
      q.x = core.x + Math.cos(ang) * rad;
      q.y = core.y + Math.sin(ang) * rad * (narrow ? 0.8 : 1.05);
    }
    return q;
  }

  function sChaos(p, tm) {                      // 1 · caos
    var k = 0.4 + p.dr * 0.6;
    return {
      x: W * (0.05 + p.dx * 0.90) + Math.sin(tm * 0.00022 + p.i) * 30 * k,
      y: H * (0.07 + p.dy * 0.86) + Math.cos(tm * 0.00018 + p.i * 1.7) * 26 * k
    };
  }

  function sCluster(p, tm) {                    // 2 · agrupación
    var c = clusters[p.cl];
    var ang = p.dx * 6.2832 + tm * 0.00022 * (0.5 + p.dq);
    var rad = 26 + p.dr * 104;                  // nube ancha, todavía sin orden
    return { x: c.x + Math.cos(ang) * rad, y: c.y + Math.sin(ang) * rad * 0.78 };
  }

  function sGraph(p, tm) {                      // 3 · conexión
    var c = clusters[p.cl];
    var ang = p.dx * 6.2832 + tm * 0.00034 * (0.5 + p.dq);
    var rad = 16 + p.dr * 46;                   // los grupos se cierran
    return { x: c.x + Math.cos(ang) * rad, y: c.y + Math.sin(ang) * rad * 0.8 };
  }

  function sSkeleton(p, tm) {                   // 4 · estructura
    /* Las partículas se colocan SOBRE el cableado: se ve el esqueleto del
       sistema antes de que existan las partes. */
    var e = spines[p.sp2 % spines.length];
    var a = modules[e[0]], b = modules[e[1]];
    var t = (p.along + tm * 0.00004 * (0.4 + p.dq)) % 1;
    return {
      x: a.x + (b.x - a.x) * t + Math.sin(tm * 0.0007 + p.i) * 4,
      y: a.y + (b.y - a.y) * t + Math.cos(tm * 0.0007 + p.i) * 4
    };
  }

  function sModules(p, tm) {                    // 5 · sistemas
    /* El esqueleto se diferencia: cada parte se convierte en un módulo con
       su propio tono. Es el momento en que aparecen los departamentos. */
    var m = modules[p.mo];
    var ang = p.dx * 6.2832 + tm * 0.00042 * (0.4 + p.dq);
    var rad = 0.30 + p.dr * 0.70;
    return { x: m.x + Math.cos(ang) * m.rx * rad, y: m.y + Math.sin(ang) * m.ry * rad };
  }

  function sRunning(p, tm) {                    // 6 · en marcha
    var m = modules[p.mo];
    var ang = p.dx * 6.2832 + tm * 0.0011 * (0.5 + p.dq);
    var rad = 0.24 + p.dr * 0.52 + Math.sin(tm * 0.0016 + p.i) * 0.10;
    return { x: m.x + Math.cos(ang) * m.rx * rad, y: m.y + Math.sin(ang) * m.ry * rad };
  }

  function sMargins(p, tm) {                    // 7 · operando (sitio al producto)
    var left = (p.i % 2) === 0;
    var edge = left ? W * (0.015 + p.dx * 0.115) : W * (0.87 + p.dx * 0.115);
    return {
      x: edge + Math.sin(tm * 0.0003 + p.i) * 12,
      y: H * (0.04 + p.dy * 0.92) + Math.cos(tm * 0.00025 + p.i) * 14
    };
  }

  function sCollapse(p, tm) {                   // 8 · un solo punto
    var ang = p.dx * 6.2832, rad = 4 + p.dy * 24;
    return {
      x: W * 0.5 + Math.cos(ang + tm * 0.0005) * rad,
      y: H * 0.21 + Math.sin(ang + tm * 0.0005) * rad * 0.85
    };
  }

  var STATES = [sConverge, sChaos, sCluster, sGraph, sSkeleton, sModules, sRunning, sMargins, sCollapse];

  /* Las paradas se miden en el DOM: cada sección declara a qué estado
     pertenece y el motor coloca ahí su parada. Si el contenido cambia, el
     estado sigue cayendo donde le toca. */
  var STOPS = [];
  function measureStops() {
    var zones = document.querySelectorAll('[data-state]');
    var d = document.documentElement;
    var max = Math.max(1, d.scrollHeight - window.innerHeight);
    var found = [];
    zones.forEach(function (z) {
      var n = parseInt(z.getAttribute('data-state'), 10);
      if (isNaN(n)) return;
      var r = z.getBoundingClientRect();
      var mid = r.top + window.scrollY + r.height / 2 - window.innerHeight / 2;
      found[n] = Math.max(0, Math.min(1, mid / max));
    });
    STOPS = [];
    for (var i = 0; i < STATES.length; i++) {
      STOPS[i] = (found[i] !== undefined) ? found[i] : (i / (STATES.length - 1));
    }
    // Monótona creciente: una sección nunca puede empezar antes que la anterior.
    for (var j = 1; j < STOPS.length; j++) if (STOPS[j] <= STOPS[j - 1]) STOPS[j] = STOPS[j - 1] + 0.004;
    var last = STOPS[STOPS.length - 1];
    if (last > 1) for (var k = 0; k < STOPS.length; k++) STOPS[k] /= last;
  }

  var wA = 0, wB = 0, iA = 0, iB = 0;
  function weights(P) {
    var i = 0;
    while (i < STOPS.length - 2 && P > STOPS[i + 1]) i++;
    var t = (P - STOPS[i]) / Math.max(0.0001, STOPS[i + 1] - STOPS[i]);
    t = Math.max(0, Math.min(1, t));
    t = t * t * (3 - 2 * t);
    iA = i; iB = i + 1; wA = 1 - t; wB = t;
  }
  function weightOf(n) { return (iA === n ? wA : 0) + (iB === n ? wB : 0); }

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
    var ox = cmx * (narrow ? 6 : 20), oy = cmy * (narrow ? 4 : 13);

    if (!noClear) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = reduced ? '#05070e' : 'rgba(5,7,14,0.26)';
      ctx.fillRect(0, 0, W, H);
    }
    ctx.globalCompositeOperation = 'lighter';

    var acc = noClear ? 0.12 : 1;
    var A = STATES[iA], B = STATES[iB];

    var conv  = weightOf(0);
    var group = weightOf(2) + weightOf(3);
    var skel  = weightOf(4);
    var mods  = weightOf(5) + weightOf(6);
    var run   = weightOf(6);
    var coll  = weightOf(8);
    // Definición creciente: del caos al sistema en marcha, el campo gana
    // presencia. Es el mismo mensaje que cuenta el texto.
    var order = weightOf(4) + weightOf(5) + weightOf(6);

    /* Núcleo. Nunca blanco puro: azul muy claro con halo largo. */
    var glow = Math.max(conv, coll);
    if (glow > 0.02 && !noClear) {
      var gx = coll > conv ? W * 0.5 : core.x + ox * 0.6;
      var gy = coll > conv ? H * 0.21 : core.y + oy * 0.6;
      var R = (coll > conv ? (narrow ? H * 0.20 : W * 0.13) : (narrow ? H * 0.27 : W * 0.18)) * (0.72 + glow * 0.42);
      var g = ctx.createRadialGradient(gx, gy, 0, gx, gy, R);
      g.addColorStop(0.00, 'rgba(198,222,255,' + (0.30 * glow) + ')');
      g.addColorStop(0.09, 'rgba(140,180,255,' + (0.21 * glow) + ')');
      g.addColorStop(0.26, 'rgba(118,104,240,' + (0.13 * glow) + ')');
      g.addColorStop(1.00, 'rgba(9,12,26,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(gx, gy, R, 0, 6.2832); ctx.fill();
    }

    /* Corrientes de entrada. */
    if (conv > 0.02) {
      for (var s = 0; s < streams.length; s++) {
        var st = streams[s];
        ctx.beginPath();
        for (var k = 0; k <= 26; k++) {
          var q = streamPoint(st, k / 26);
          if (k === 0) ctx.moveTo(q.x + ox, q.y + oy); else ctx.lineTo(q.x + ox, q.y + oy);
        }
        ctx.strokeStyle = rgba(st.hue, 0.052 * conv * acc);
        ctx.lineWidth = st.w; ctx.stroke();

        var head = ((tm * 0.00013) + st.off) % 1;
        ctx.beginPath();
        for (var m = 0; m <= 8; m++) {
          var u = head - 0.10 + (m / 8) * 0.10;
          if (u < 0 || u > 1) continue;
          var w2 = streamPoint(st, u);
          if (m === 0) ctx.moveTo(w2.x + ox, w2.y + oy); else ctx.lineTo(w2.x + ox, w2.y + oy);
        }
        ctx.strokeStyle = rgba(st.hue, 0.24 * conv * acc);
        ctx.lineWidth = st.w * 1.6; ctx.stroke();
      }
    }

    /* Relaciones entre grupos: las conexiones que aparecen antes de que
       exista una estructura. */
    if (group > 0.04 && !(narrow && W < 560)) {
      ctx.lineWidth = 1;
      for (var a1 = 0; a1 < clusters.length; a1++) {
        for (var b1 = a1 + 1; b1 < clusters.length; b1++) {
          var ca = clusters[a1], cb = clusters[b1];
          var dx1 = cb.x - ca.x, dy1 = cb.y - ca.y;
          if (Math.sqrt(dx1 * dx1 + dy1 * dy1) > W * 0.52) continue;
          ctx.beginPath();
          ctx.moveTo(ca.x + ox, ca.y + oy); ctx.lineTo(cb.x + ox, cb.y + oy);
          ctx.strokeStyle = 'rgba(150,180,255,' + (0.055 * group * acc) + ')';
          ctx.stroke();
        }
      }
    }

    /* Cableado de la arquitectura. */
    var wire = skel + mods;
    if (wire > 0.04) {
      ctx.lineWidth = 1;
      for (var e = 0; e < spines.length; e++) {
        var ma = modules[spines[e][0]], mb = modules[spines[e][1]];
        ctx.beginPath();
        ctx.moveTo(ma.x + ox, ma.y + oy); ctx.lineTo(mb.x + ox, mb.y + oy);
        ctx.strokeStyle = 'rgba(146,176,255,' + (0.085 * wire * acc) + ')';
        ctx.stroke();
      }
    }

    /* Los módulos, cuando ya tienen identidad. Un halo tenue y su filo. */
    if (mods > 0.05) {
      for (var mi = 0; mi < modules.length; mi++) {
        var mo = modules[mi];
        var mgx = mo.x + ox, mgy = mo.y + oy;
        var rg = ctx.createRadialGradient(mgx, mgy, 0, mgx, mgy, mo.rx * 1.7);
        rg.addColorStop(0, rgba(mo.hue, 0.075 * mods * acc));
        rg.addColorStop(1, rgba(mo.hue, 0));
        ctx.fillStyle = rg;
        ctx.beginPath(); ctx.ellipse(mgx, mgy, mo.rx * 1.7, mo.ry * 1.9, 0, 0, 6.2832); ctx.fill();
        ctx.beginPath(); ctx.ellipse(mgx, mgy, mo.rx, mo.ry, 0, 0, 6.2832);
        ctx.strokeStyle = rgba(mo.hue, 0.16 * mods * acc); ctx.lineWidth = 1; ctx.stroke();
      }
    }

    /* Información viajando entre módulos: el sistema trabajando. */
    if (run > 0.06) {
      for (var e2 = 0; e2 < spines.length; e2++) {
        var sa = modules[spines[e2][0]], sb = modules[spines[e2][1]];
        for (var pk = 0; pk < 2; pk++) {
          var t2 = ((tm * 0.00028) + e2 * 0.13 + pk * 0.5) % 1;
          var px2 = sa.x + (sb.x - sa.x) * t2 + ox;
          var py2 = sa.y + (sb.y - sa.y) * t2 + oy;
          var fade = Math.sin(t2 * Math.PI);
          ctx.beginPath(); ctx.arc(px2, py2, 1.5, 0, 6.2832);
          ctx.fillStyle = rgba(sb.hue, 0.62 * run * fade * acc); ctx.fill();
        }
      }
    }

    /* Partículas, con profundidad. */
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      var qa = A(p, tm), qb = B(p, tm);
      var x = (qa.x * wA + qb.x * wB) + ox * p.z;
      var y = (qa.y * wA + qb.y * wB) + oy * p.z;
      if (!p.born) { p.px = x; p.py = y; p.born = true; }

      // Dentro de un módulo la partícula toma el color del módulo: la
      // diferenciación se ve, no se explica.
      var hue = p.hue;
      if (mods > 0.5) hue = modules[p.mo].hue;

      var dxx = x - p.px, dyy = y - p.py;
      var d2 = dxx * dxx + dyy * dyy;
      var al = (0.19 + p.dr * 0.30) * p.z * (1 + order * 0.85) * acc;

      if (d2 > 1.2 && d2 < 9000) {
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(x, y);
        ctx.strokeStyle = rgba(hue, al * 0.5);
        ctx.lineWidth = p.r * 0.9; ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(x, y, p.r, 0, 6.2832);
      ctx.fillStyle = rgba(hue, al); ctx.fill();

      p.px = x; p.py = y;
    }

    /* Enlace de cada partícula con su grupo, mientras se están agrupando. */
    if (group > 0.05 && !(narrow && W < 560)) {
      ctx.lineWidth = 1;
      for (var j = 0; j < parts.length; j += 2) {
        var pp = parts[j], cl = clusters[pp.cl];
        var ddx = pp.px - (cl.x + ox), ddy = pp.py - (cl.y + oy);
        var dd = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dd > 130) continue;
        ctx.beginPath();
        ctx.moveTo(pp.px, pp.py); ctx.lineTo(cl.x + ox, cl.y + oy);
        ctx.strokeStyle = rgba(pp.hue, (1 - dd / 130) * 0.10 * group * acc);
        ctx.stroke();
      }
    }
  }

  /* ---------------------------------------------------------------- BUCLE */
  var running = false, visible = true;
  function loop(tm) {
    if (!running) return;
    Pv += (P - Pv) * 0.075;
    draw(tm);
    if (visible) requestAnimationFrame(loop); else running = false;
  }
  function start() { if (!running && !reduced) { running = true; requestAnimationFrame(loop); } }

  /* Movimiento reducido: exposición larga, quieta y rica. */
  function drawStill() {
    draw(0, false);
    for (var i = 1; i < 40; i++) draw(i * 110, true);
  }

  measure(); measureStops(); readScroll(); Pv = P;
  if (reduced) drawStill(); else start();

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      measure(); measureStops(); readScroll(); if (reduced) drawStill();
    }, 180);
  }, { passive: true });
  window.addEventListener('load', function () { measureStops(); readScroll(); });

  document.addEventListener('visibilitychange', function () {
    visible = !document.hidden; if (visible) start();
  });
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting; if (visible) start();
    }, { threshold: 0 }).observe(root);
  }

  /* ------------------------------- EL ESTADO, EN PALABRAS ---------------- */
  var label = document.querySelector('[data-field-state]');
  if (label) {
    var NAMES = (label.getAttribute('data-names') || '').split('|');
    var last = -1;
    label.style.transition = 'opacity .22s ease';
    (function sync() {
      var Pn = reduced ? P : Pv, idx = 0;
      for (var i = 0; i < STOPS.length; i++) if (Pn >= STOPS[i]) idx = i;
      if (idx !== last && NAMES[idx]) {
        last = idx;
        label.style.opacity = 0;
        setTimeout(function () { label.textContent = NAMES[idx]; label.style.opacity = 1; }, 200);
      }
      requestAnimationFrame(sync);
    })();
  }
})();
