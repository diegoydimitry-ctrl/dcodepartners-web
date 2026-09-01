/* ============================================================================
   D-CODE PARTNERS — EL SISTEMA QUE SE CONSTRUYE  (portada)
   ----------------------------------------------------------------------------
   LAS FORMAS NO SON INVENTADAS.

   Un campo de puntos puede representar cualquier cosa, y por eso no
   representa nada. Aquí cada estado se apoya en una estructura reconocible
   del mundo real, llevada a la abstracción — nunca al dibujo literal:

     1 DESORDEN     rutas que se cruzan mal, trabajo duplicado y trayectos
                    que acaban en nada. No es ausencia de empresa: es una
                    empresa funcionando sin sistema.
     2 PATRONES     las rutas que se repiten quedan acotadas entre marcas de
                    medida y se superponen: ahí está lo que no se veía.
     3 AGRUPACIÓN   lo acotado se archiva dentro de bastidores: cada cosa
                    empieza a saber a qué parte pertenece.
     4 CONSTRUCCIÓN una celosía se monta pieza a pieza, de abajo arriba, con
                    sus cartelas en los nudos, sus líneas de replanteo y el
                    punto de soldadura de cada unión. Dos planos a distinta
                    profundidad: es una estructura, no un diagrama.
     5 CANALIZACIÓN sobre esa estructura se tienden canalizaciones en
                    ortogonal con quiebros a 45°, cajas de registro en los
                    nudos y dos profundidades de bandeja. Es infraestructura.
     6 PROCESOS     por esas canalizaciones circula trabajo CON DIRECCIÓN:
                    origen, recorrido y destino, con colas que se forman y
                    se vacían en los nudos.
     7 MÓDULOS      la estructura se resuelve en ocho módulos con conector,
                    cada uno con su actividad interna. Componentes capaces de
                    conectarse, no un catálogo.
     8 RÉGIMEN      todo se retira a los márgenes y sigue funcionando con
                    ritmo constante. Ya no se construye: opera.

   Y el arco lo abre y lo cierra el mismo gesto: una convergencia de
   corrientes en un núcleo, y al final un solo punto.
   ========================================================================= */
(function () {
  'use strict';

  var root = document.querySelector('[data-field]');
  if (!root) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse  = window.matchMedia('(pointer: coarse)').matches;

  /* Acero frío para la estructura; el color solo marca lo que significa algo. */
  var STEEL = [150, 178, 226];
  var HUE = [
    [ 77, 208, 225], [ 91, 140, 255], [124, 108, 255],
    [167, 139, 250], [255, 107, 157], [ 45, 212, 191]
  ];
  var MOD_HUE = [
    [ 77, 208, 225], [255, 107, 157], [ 53, 224, 161], [255, 180,  58],
    [ 91, 140, 255], [ 45, 212, 191], [139, 147, 255], [167, 139, 250]
  ];
  function rgba(h, a) { return 'rgba(' + h[0] + ',' + h[1] + ',' + h[2] + ',' + a + ')'; }
  function sd(i, s) { var x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }

  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  root.appendChild(canvas);
  var ctx = canvas.getContext('2d', { alpha: false });

  var W = 0, H = 0, dpr = 1, narrow = false, small = false;
  var core = { x: 0, y: 0 };
  var streams = [], routes = [], joints = [], members = [], guides = [],
      trays = [], mods = [], packets = [];
  var LV = 4, PO = 5;

  function measure() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    W = root.clientWidth; H = root.clientHeight;
    narrow = W < 900; small = W < 620;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    core.x = narrow ? W * 0.52 : W * 0.755;
    core.y = narrow ? H * 0.86 : H * 0.44;
    build();
  }

  /* ------------------------------------------------------------ GEOMETRÍAS */
  function build() {
    LV = narrow ? 3 : 4;
    PO = narrow ? 3 : 5;

    /* Corrientes del hero. */
    var SN = narrow ? 13 : 26;
    streams.length = 0;
    for (var s = 0; s < SN; s++) {
      streams.push({ hue: HUE[s % HUE.length], f: s / (SN - 1) - 0.5,
                     off: sd(s, 11), w: 0.45 + sd(s, 13) * 0.9 });
    }

    /* DESORDEN — rutas reales de una empresa sin sistema: algunas se duplican
       (dos personas haciendo lo mismo por su cuenta) y otras mueren sin
       destino (trabajo que no llega a ninguna parte). */
    routes.length = 0;
    var RN = small ? 7 : 12;
    for (var r = 0; r < RN; r++) {
      var pts = [], n = 3 + Math.floor(sd(r, 2) * 3);
      for (var k = 0; k < n; k++) {
        pts.push({ x: W * (0.08 + sd(r * 9 + k, 3) * 0.84),
                   y: H * (0.10 + sd(r * 9 + k, 4) * 0.80) });
      }
      routes.push({
        pts: pts, hue: HUE[r % HUE.length],
        // Una de cada tres es copia casi exacta de la anterior: duplicidad.
        dup: r > 0 && r % 3 === 0,
        // Una de cada cuatro no llega a ningún sitio.
        dead: r % 4 === 1,
        ph: sd(r, 7)
      });
      if (routes[r].dup) {
        var prev = routes[r - 1];
        routes[r].pts = prev.pts.map(function (p, i2) {
          return { x: p.x + 26 + sd(r + i2, 5) * 16, y: p.y + 18 + sd(r + i2, 6) * 14 };
        });
        routes[r].hue = prev.hue;
        routes[r].twin = r - 1;
      }
    }

    /* CELOSÍA — nudos, miembros y líneas de replanteo, en DOS planos a
       distinta profundidad para que sea un cuerpo y no un dibujo plano. */
    joints.length = 0; members.length = 0; guides.length = 0;
    var x0 = W * (narrow ? 0.10 : 0.30), x1 = W * (narrow ? 0.90 : 0.97);
    var y0 = H * 0.17, y1 = H * 0.83;
    var dx = narrow ? W * 0.030 : W * 0.045, dy = -H * 0.055;   // desplazamiento del plano de fondo
    for (var pl = 0; pl < 2; pl++) {
      for (var lv = 0; lv < LV; lv++) {
        for (var po = 0; po < PO; po++) {
          var fx = PO === 1 ? 0.5 : po / (PO - 1), fy = LV === 1 ? 0.5 : lv / (LV - 1);
          joints.push({
            x: lerp(x0, x1, fx) + (pl ? dx : 0),
            y: lerp(y0, y1, fy) + (pl ? dy : 0),
            pl: pl, lv: lv, po: po, id: joints.length
          });
        }
      }
    }
    function J(pl, lv, po) { return joints[pl * LV * PO + lv * PO + po]; }
    function push(a, b, kind) {
      // El orden de montaje es el real: de abajo arriba.
      members.push({ a: a, b: b, kind: kind, t: 1 - (Math.max(a.y, b.y) - y0) / (y1 - y0 + dy) });
    }
    for (var pl2 = 0; pl2 < 2; pl2++) {
      for (var lv2 = 0; lv2 < LV; lv2++)
        for (var po2 = 0; po2 < PO - 1; po2++) push(J(pl2, lv2, po2), J(pl2, lv2, po2 + 1), 'beam');
      for (var lv3 = 0; lv3 < LV - 1; lv3++)
        for (var po3 = 0; po3 < PO; po3++) push(J(pl2, lv3, po3), J(pl2, lv3 + 1, po3), 'post');
      for (var lv4 = 0; lv4 < LV - 1; lv4++)
        for (var po4 = 0; po4 < PO - 1; po4++) {
          var up = (lv4 + po4) % 2 === 0;
          push(J(pl2, lv4, up ? po4 : po4 + 1), J(pl2, lv4 + 1, up ? po4 + 1 : po4), 'brace');
        }
    }
    // Riostras entre planos: lo que convierte dos celosías en un volumen.
    for (var lv5 = 0; lv5 < LV; lv5 += (LV > 3 ? 1 : 1))
      for (var po5 = 0; po5 < PO; po5 += 2) push(J(0, lv5, po5), J(1, lv5, po5), 'tie');
    members.sort(function (m1, m2) { return m1.t - m2.t; });
    members.forEach(function (m, i) { m.t = i / members.length; });

    // Líneas de replanteo: se trazan antes que nada, y sobresalen.
    for (var lv6 = 0; lv6 < LV; lv6++) {
      var ja = J(0, lv6, 0), jb = J(0, lv6, PO - 1);
      guides.push({ ax: ja.x - 46, ay: ja.y, bx: jb.x + 46, by: jb.y });
    }

    /* CANALIZACIÓN — bandejas ortogonales con quiebro a 45°, dos alturas. */
    trays.length = 0;
    var TN = small ? 5 : 10;
    for (var t2 = 0; t2 < TN; t2++) {
      var la = Math.floor(sd(t2, 21) * (LV - 1));
      var pa = Math.floor(sd(t2, 22) * (PO - 1));
      var pb = Math.min(PO - 1, pa + 1 + Math.floor(sd(t2, 23) * 2));
      var A = J(0, la, pa), B = J(0, Math.min(LV - 1, la + 1), pb);
      var off = (sd(t2, 24) - 0.5) * 16;
      trays.push({
        A: A, B: B, off: off, deep: sd(t2, 25) > 0.55,
        hue: MOD_HUE[t2 % MOD_HUE.length]
      });
    }

    /* MÓDULOS — ocho componentes con conector, colocados en los vanos. */
    mods.length = 0;
    var cols = narrow ? 2 : 4, rows = narrow ? 4 : 2;
    var mw = (x1 - x0) / cols * 0.74, mh = (y1 - y0) / rows * 0.52;
    for (var i3 = 0; i3 < 8; i3++) {
      var c = i3 % cols, rr = Math.floor(i3 / cols);
      mods.push({
        x: lerp(x0, x1, cols === 1 ? 0.5 : (c + 0.5) / cols),
        y: lerp(y0, y1, rows === 1 ? 0.5 : (rr + 0.5) / rows),
        w: mw, h: mh, hue: MOD_HUE[i3 % 8], i: i3
      });
    }

    /* PAQUETES — el trabajo que circula. Pocos y con destino. */
    packets.length = 0;
    var PN = small ? 26 : 64;
    for (var q = 0; q < PN; q++) {
      packets.push({ i: q, tr: q % Math.max(1, trays.length), u: sd(q, 31),
                     sp: 0.0016 + sd(q, 32) * 0.0026, hue: HUE[q % HUE.length],
                     wait: 0, dx: sd(q, 33), dy: sd(q, 34) });
    }
  }

  /* ------------------------------------------------------------- PRIMITIVAS */
  function streamPoint(st, u) {
    var e = u * u * (3 - 2 * u);
    if (narrow) {
      return bez(W * (0.5 + st.f * 1.5), -H * 0.06, W * (0.5 + st.f * 0.9), H * 0.34,
                 core.x - st.f * W * 0.10, core.y - H * 0.10, core.x, core.y, e);
    }
    return bez(-W * 0.12, core.y + st.f * H * 1.5, W * 0.24, core.y + st.f * H * 1.05,
               W * 0.52, core.y + st.f * H * 0.30, core.x, core.y, e);
  }
  function bez(x0, y0, x1, y1, x2, y2, x3, y3, t) {
    var m = 1 - t, a = m * m * m, b = 3 * m * m * t, c = 3 * m * t * t, d = t * t * t;
    return { x: a * x0 + b * x1 + c * x2 + d * x3, y: a * y0 + b * y1 + c * y2 + d * y3 };
  }
  /* Cartela de nudo: la plaquita que une los miembros en una celosía real. */
  function plate(j, a, hue) {
    ctx.save(); ctx.translate(j.x, j.y); ctx.rotate(0.7854);
    var r = j.pl ? 2.6 : 3.4;
    ctx.strokeStyle = rgba(hue || STEEL, a); ctx.lineWidth = 1;
    ctx.strokeRect(-r, -r, r * 2, r * 2);
    ctx.restore();
  }
  /* Recorrido de una bandeja: ortogonal con el quiebro a 45° del final. */
  function trayPath(t) {
    var ax = t.A.x, ay = t.A.y + t.off, bx = t.B.x, by = t.B.y + t.off;
    var mx = bx - Math.sign(bx - ax) * 26;
    return [{ x: ax, y: ay }, { x: mx, y: ay }, { x: bx, y: by }];
  }
  function pointOn(path, u) {
    var total = 0, segs = [];
    for (var i = 1; i < path.length; i++) {
      var d = Math.hypot(path[i].x - path[i - 1].x, path[i].y - path[i - 1].y);
      segs.push(d); total += d;
    }
    var want = u * total, acc = 0;
    for (var k = 1; k < path.length; k++) {
      if (acc + segs[k - 1] >= want) {
        var f = (want - acc) / (segs[k - 1] || 1);
        return { x: lerp(path[k - 1].x, path[k].x, f), y: lerp(path[k - 1].y, path[k].y, f),
                 ax: path[k].x - path[k - 1].x, ay: path[k].y - path[k - 1].y };
      }
      acc += segs[k - 1];
    }
    var last = path[path.length - 1];
    return { x: last.x, y: last.y, ax: 1, ay: 0 };
  }

  /* ------------------------------------------------ ESTADOS (por índice) */
  var STOPS = [];
  var NST = 9;   // convergencia · desorden · patrones · agrupación ·
                 // construcción · procesos · módulos · régimen · cierre
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
    for (var i = 0; i < NST; i++) STOPS[i] = (found[i] !== undefined) ? found[i] : (i / (NST - 1));
    for (var j = 1; j < STOPS.length; j++) if (STOPS[j] <= STOPS[j - 1]) STOPS[j] = STOPS[j - 1] + 0.004;
    var last = STOPS[STOPS.length - 1];
    if (last > 1) for (var k = 0; k < STOPS.length; k++) STOPS[k] /= last;
  }
  var wA = 0, wB = 0, iA = 0, iB = 0;
  function weights(P) {
    var i = 0;
    while (i < STOPS.length - 2 && P > STOPS[i + 1]) i++;
    var t = (P - STOPS[i]) / Math.max(0.0001, STOPS[i + 1] - STOPS[i]);
    t = Math.max(0, Math.min(1, t)); t = t * t * (3 - 2 * t);
    iA = i; iB = i + 1; wA = 1 - t; wB = t;
  }
  function w(n) { return (iA === n ? wA : 0) + (iB === n ? wB : 0); }
  /* Progreso DENTRO de un estado: 0 al entrar, 1 al salir. Es lo que permite
     que algo se construya mientras lees la sección, y no de golpe. */
  function inside(n) {
    var a = STOPS[Math.max(0, n - 1)], b = STOPS[Math.min(NST - 1, n + 1)];
    return ease((Pv - a) / Math.max(0.0001, b - a));
  }

  /* ------------------------------------------------------------- PUNTERO */
  var mx = 0, my = 0, cmx = 0, cmy = 0;
  if (!coarse && !reduced) {
    window.addEventListener('mousemove', function (e) {
      mx = (e.clientX / window.innerWidth - 0.5);
      my = (e.clientY / window.innerHeight - 0.5);
    }, { passive: true });
  }

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
    var ox = cmx * (narrow ? 6 : 18), oy = cmy * (narrow ? 4 : 12);

    if (!noClear) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = reduced ? '#05070e' : 'rgba(5,7,14,0.30)';
      ctx.fillRect(0, 0, W, H);
    }
    ctx.globalCompositeOperation = 'lighter';
    var acc = noClear ? 0.12 : 1;
    ctx.save(); ctx.translate(ox, oy);

    var conv = w(0), mess = w(1), patt = w(2), grp = w(3),
        cons = w(4), proc = w(5), modu = w(6), oper = w(7);
    // Dentro de "Construimos": primero se monta el acero, después se tiende
    // la instalación. Dos mitades del mismo momento.
    var insC = inside(4);
    var raise = ease(Math.min(1, insC / 0.58));          // el acero, primero
    var lay   = ease(Math.max(0, (insC - 0.46) / 0.48));  // la instalación, después
    var coll = 0;
    // El cierre es el último tramo del estado 8: la estructura se va y queda
    // un punto. Así la página cierra con el mismo gesto con que abrió.
    if (iA === NST - 2 && iB === NST - 1) coll = 0;
    if (iA === NST - 1 || (iB === NST - 1 && wB > 0.55)) coll = Math.max(0, (Pv - STOPS[NST - 1]) / Math.max(0.001, 1 - STOPS[NST - 1]));

    /* ---- NÚCLEO (apertura y cierre) ---- */
    var glow = Math.max(conv, coll);
    if (glow > 0.02 && !noClear) {
      var gx = coll > conv ? W * 0.5 : core.x, gy = coll > conv ? H * 0.21 : core.y;
      var R = (coll > conv ? (narrow ? H * 0.20 : W * 0.13) : (narrow ? H * 0.27 : W * 0.18)) * (0.72 + glow * 0.42);
      var g = ctx.createRadialGradient(gx, gy, 0, gx, gy, R);
      g.addColorStop(0.00, 'rgba(198,222,255,' + (0.30 * glow) + ')');
      g.addColorStop(0.09, 'rgba(140,180,255,' + (0.21 * glow) + ')');
      g.addColorStop(0.26, 'rgba(118,104,240,' + (0.13 * glow) + ')');
      g.addColorStop(1.00, 'rgba(9,12,26,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(gx, gy, R, 0, 6.2832); ctx.fill();
    }
    if (conv > 0.02) {
      for (var s = 0; s < streams.length; s++) {
        var st = streams[s];
        ctx.beginPath();
        for (var k = 0; k <= 26; k++) { var q = streamPoint(st, k / 26);
          if (k === 0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y); }
        ctx.strokeStyle = rgba(st.hue, 0.050 * conv * acc); ctx.lineWidth = st.w; ctx.stroke();
        var head = ((tm * 0.00013) + st.off) % 1;
        ctx.beginPath();
        for (var m = 0; m <= 8; m++) { var u = head - 0.10 + (m / 8) * 0.10;
          if (u < 0 || u > 1) continue; var w2 = streamPoint(st, u);
          if (m === 0) ctx.moveTo(w2.x, w2.y); else ctx.lineTo(w2.x, w2.y); }
        ctx.strokeStyle = rgba(st.hue, 0.23 * conv * acc); ctx.lineWidth = st.w * 1.6; ctx.stroke();
      }
    }

    /* ---- 1 DESORDEN + 2 PATRONES + 3 AGRUPACIÓN ---- */
    var live = mess + patt + grp;
    if (live > 0.02) {
      var pull = grp;                           // hacia dónde se archiva
      for (var r = 0; r < routes.length; r++) {
        var ro = routes[r];
        // En agrupación cada ruta se recoge dentro de su bastidor.
        var m0 = mods[r % mods.length];
        ctx.beginPath();
        for (var pi = 0; pi < ro.pts.length; pi++) {
          var pt = ro.pts[pi];
          var tx = m0.x + (sd(r * 5 + pi, 41) - 0.5) * m0.w * 0.6;
          var ty = m0.y + (sd(r * 5 + pi, 42) - 0.5) * m0.h * 0.6;
          var X = lerp(pt.x, tx, ease(pull)), Y = lerp(pt.y, ty, ease(pull));
          if (pi === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
        }
        var dim = ro.dead ? 0.55 : 1;
        // Lo duplicado se enciende en PATRONES: es justo lo que se descubre.
        var hot = ro.dup ? patt : 0;
        ctx.strokeStyle = rgba(ro.hue, (0.10 * dim * live + 0.30 * hot) * acc);
        ctx.lineWidth = 1 + hot * 0.8; ctx.stroke();

        // El trabajo que muere sin destino: una cruz al final del trayecto.
        if (ro.dead && mess > 0.2 && pull < 0.4) {
          var e2 = ro.pts[ro.pts.length - 1];
          ctx.strokeStyle = rgba([255, 120, 140], 0.32 * mess * acc); ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(e2.x - 4, e2.y - 4); ctx.lineTo(e2.x + 4, e2.y + 4);
          ctx.moveTo(e2.x + 4, e2.y - 4); ctx.lineTo(e2.x - 4, e2.y + 4); ctx.stroke();
        }
        // Marca de medida sobre el par duplicado: acotar es lo que hace ver.
        if (ro.dup && patt > 0.12 && pull < 0.5) {
          var xs = ro.pts.map(function (p) { return p.x; }), ys = ro.pts.map(function (p) { return p.y; });
          var bx0 = Math.min.apply(null, xs) - 10, bx1 = Math.max.apply(null, xs) + 10;
          var by0 = Math.min.apply(null, ys) - 10, by1 = Math.max.apply(null, ys) + 10;
          var aa = 0.30 * patt * acc;
          ctx.strokeStyle = rgba([190, 214, 255], aa); ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(bx0 + 7, by0); ctx.lineTo(bx0, by0); ctx.lineTo(bx0, by0 + 7);
          ctx.moveTo(bx1 - 7, by0); ctx.lineTo(bx1, by0); ctx.lineTo(bx1, by0 + 7);
          ctx.moveTo(bx0 + 7, by1); ctx.lineTo(bx0, by1); ctx.lineTo(bx0, by1 - 7);
          ctx.moveTo(bx1 - 7, by1); ctx.lineTo(bx1, by1); ctx.lineTo(bx1, by1 - 7);
          ctx.stroke();
          // Y el gemelo se superpone: se ve que son la misma forma.
          var tw = routes[ro.twin];
          ctx.beginPath();
          for (var gi = 0; gi < tw.pts.length; gi++) {
            var gp = tw.pts[gi], sp = ro.pts[Math.min(gi, ro.pts.length - 1)];
            var GX = lerp(gp.x, sp.x, ease(patt)), GY = lerp(gp.y, sp.y, ease(patt));
            if (gi === 0) ctx.moveTo(GX, GY); else ctx.lineTo(GX, GY);
          }
          ctx.strokeStyle = rgba([214, 236, 255], 0.20 * patt * acc);
          ctx.setLineDash([3, 4]); ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
        }
      }
      // Bastidores del archivado.
      if (grp > 0.08) {
        for (var mi = 0; mi < mods.length; mi++) {
          var mm = mods[mi];
          ctx.strokeStyle = rgba(mm.hue, 0.18 * grp * acc); ctx.lineWidth = 1;
          ctx.strokeRect(mm.x - mm.w / 2, mm.y - mm.h / 2, mm.w, mm.h);
        }
      }
    }

    /* ---- 4 CONSTRUCCIÓN: la celosía se monta pieza a pieza ---- */
    var frame = cons + proc + modu + oper * 0.4;
    if (frame > 0.02) {
      var built = cons > 0 ? raise : 1;                // avance del montaje
      if (proc + modu > 0) built = 1;

      // Replanteo: lo primero que se traza en una obra.
      if (cons > 0.05) {
        ctx.setLineDash([2, 6]);
        ctx.strokeStyle = rgba(STEEL, 0.10 * cons * acc); ctx.lineWidth = 1;
        for (var gi2 = 0; gi2 < guides.length; gi2++) {
          var gg = guides[gi2];
          ctx.beginPath(); ctx.moveTo(gg.ax, gg.ay); ctx.lineTo(gg.bx, gg.by); ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      var placedIdx = -1;
      for (var mi2 = 0; mi2 < members.length; mi2++) {
        var me = members[mi2];
        var f = Math.max(0, Math.min(1, (built - me.t) / 0.10));
        if (f <= 0) continue;
        if (f < 1) placedIdx = mi2;
        var deep = me.a.pl === 1 || me.b.pl === 1;
        var base = deep ? 0.13 : 0.26;
        if (me.kind === 'tie') base = 0.09;
        ctx.beginPath();
        ctx.moveTo(me.a.x, me.a.y);
        ctx.lineTo(lerp(me.a.x, me.b.x, f), lerp(me.a.y, me.b.y, f));
        ctx.strokeStyle = rgba(STEEL, base * frame * acc);
        ctx.lineWidth = deep ? 1 : (me.kind === 'brace' ? 1 : 1.5);
        ctx.stroke();
        // Punto de soldadura: solo mientras esa pieza se está colocando.
        if (f < 1 && f > 0.02) {
          var wx = lerp(me.a.x, me.b.x, f), wy = lerp(me.a.y, me.b.y, f);
          ctx.beginPath(); ctx.arc(wx, wy, 2.4, 0, 6.2832);
          ctx.fillStyle = rgba([230, 244, 255], 0.85 * acc); ctx.fill();
          ctx.beginPath(); ctx.arc(wx, wy, 7, 0, 6.2832);
          ctx.strokeStyle = rgba([160, 200, 255], 0.30 * acc); ctx.lineWidth = 1; ctx.stroke();
        }
      }
      // Cartelas en los nudos ya montados.
      for (var ji = 0; ji < joints.length; ji++) {
        var jj = joints[ji];
        var jf = (built - (1 - (jj.lv / Math.max(1, LV - 1))) * 0.9);
        if (jf <= 0) continue;
        plate(jj, (jj.pl ? 0.10 : 0.22) * frame * acc);
      }
    }

    /* ---- 5 CANALIZACIÓN: bandejas sobre la estructura ---- */
    var wired = cons * lay + proc + modu;
    if (wired > 0.03) {
      if (proc + modu > 0) lay = 1;
      for (var ti = 0; ti < trays.length; ti++) {
        var tr = trays[ti], path = trayPath(tr);
        var fw = Math.max(0, Math.min(1, (lay - ti / trays.length * 0.8) / 0.25));
        if (fw <= 0) continue;
        ctx.beginPath();
        var drawn = pointOn(path, fw);
        ctx.moveTo(path[0].x, path[0].y);
        for (var pj = 1; pj < path.length; pj++) {
          var seg = pointOn(path, Math.min(1, fw));
          ctx.lineTo(pj === path.length - 1 ? seg.x : path[pj].x, pj === path.length - 1 ? seg.y : path[pj].y);
          if (pj === path.length - 1) break;
        }
        ctx.strokeStyle = rgba(tr.hue, (tr.deep ? 0.10 : 0.22) * wired * acc);
        ctx.lineWidth = tr.deep ? 1 : 1.8; ctx.stroke();
        // Caja de registro en el nudo de llegada.
        if (fw > 0.9) {
          ctx.strokeStyle = rgba(tr.hue, 0.26 * wired * acc); ctx.lineWidth = 1;
          ctx.strokeRect(path[path.length - 1].x - 4, path[path.length - 1].y - 4, 8, 8);
        }
      }
    }

    /* ---- 6 PROCESOS: trabajo con origen, recorrido y destino ---- */
    if (proc > 0.05 || (modu > 0.05)) {
      var flowA = Math.max(proc, modu * 0.7);
      for (var qi = 0; qi < packets.length; qi++) {
        var pk = packets[qi];
        if (!trays.length) break;
        var tr2 = trays[pk.tr % trays.length], path2 = trayPath(tr2);
        // Cola en el nudo: el trabajo espera y luego sale. Un sistema real
        // no mueve todo a la vez.
        if (pk.wait > 0) { pk.wait--; }
        else {
          pk.u += pk.sp * (0.5 + flowA);
          if (pk.u > 0.62 && pk.u - pk.sp <= 0.62 && sd(qi, 51) > 0.55) pk.wait = 20 + sd(qi, 52) * 40;
          if (pk.u > 1) { pk.u = 0; pk.tr = (pk.tr + 1) % trays.length; }
        }
        var pp = pointOn(path2, pk.u);
        var a2 = (pk.wait > 0 ? 0.34 : 0.80) * flowA * acc;
        ctx.beginPath(); ctx.arc(pp.x, pp.y, 1.9, 0, 6.2832);
        ctx.fillStyle = rgba(pk.hue, a2); ctx.fill();
        // Galón de dirección: se ve HACIA DÓNDE va, no solo que se mueve.
        if (pk.wait === 0) {
          var L = Math.hypot(pp.ax, pp.ay) || 1, ux = pp.ax / L, uy = pp.ay / L;
          ctx.beginPath();
          ctx.moveTo(pp.x - ux * 6 - uy * 3, pp.y - uy * 6 + ux * 3);
          ctx.lineTo(pp.x, pp.y);
          ctx.lineTo(pp.x - ux * 6 + uy * 3, pp.y - uy * 6 - ux * 3);
          ctx.strokeStyle = rgba(pk.hue, a2 * 0.6); ctx.lineWidth = 1; ctx.stroke();
        }
      }
    }

    /* ---- 7 MÓDULOS: componentes con conector y actividad propia ---- */
    if (modu > 0.05) {
      for (var mk = 0; mk < mods.length; mk++) {
        var mo = mods[mk];
        var x = mo.x - mo.w / 2, y = mo.y - mo.h / 2;
        var gg2 = ctx.createLinearGradient(x, y, x, y + mo.h);
        gg2.addColorStop(0, rgba(mo.hue, 0.055 * modu * acc));
        gg2.addColorStop(1, rgba(mo.hue, 0.012 * modu * acc));
        ctx.fillStyle = gg2; ctx.fillRect(x, y, mo.w, mo.h);
        ctx.strokeStyle = rgba(mo.hue, 0.30 * modu * acc); ctx.lineWidth = 1;
        ctx.strokeRect(x, y, mo.w, mo.h);
        // Conectores: por aquí se une con los demás. No es una tarjeta.
        ctx.beginPath();
        ctx.moveTo(x + mo.w, mo.y - 7); ctx.lineTo(x + mo.w + 7, mo.y); ctx.lineTo(x + mo.w, mo.y + 7);
        ctx.moveTo(x, mo.y - 7); ctx.lineTo(x + 7, mo.y); ctx.lineTo(x, mo.y + 7);
        ctx.strokeStyle = rgba(mo.hue, 0.34 * modu * acc); ctx.stroke();
        // Actividad interna: barras que laten a su propio ritmo.
        for (var bi = 0; bi < 4; bi++) {
          var bw = (0.25 + 0.6 * Math.abs(Math.sin(tm * 0.0011 + mk + bi))) * (mo.w * 0.5);
          ctx.fillStyle = rgba(mo.hue, 0.16 * modu * acc);
          ctx.fillRect(x + 10, y + 10 + bi * 7, bw, 2);
        }
      }
    }

    /* ---- 8 RÉGIMEN: se retira a los márgenes y sigue funcionando ---- */
    if (oper > 0.05 && coll < 0.5) {
      var bandsY = 10, o2 = oper * (1 - coll);
      for (var side = 0; side < 2; side++) {
        var bx2 = side ? W * 0.955 : W * 0.045;
        ctx.strokeStyle = rgba(STEEL, 0.12 * o2 * acc); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(bx2, H * 0.10); ctx.lineTo(bx2, H * 0.90); ctx.stroke();
        for (var bb = 0; bb < bandsY; bb++) {
          var by2 = lerp(H * 0.12, H * 0.88, bb / (bandsY - 1));
          var amp = 8 + 12 * Math.abs(Math.sin(tm * 0.0009 + bb * 0.8 + side * 1.7));
          ctx.strokeStyle = rgba(MOD_HUE[(bb + side * 3) % 8], 0.30 * o2 * acc);
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(bx2 - (side ? amp : 0), by2); ctx.lineTo(bx2 + (side ? 0 : amp), by2); ctx.stroke();
        }
      }
    }

    /* ---- CIERRE: un solo punto ---- */
    if (coll > 0.04) {
      for (var ci = 0; ci < packets.length; ci += 2) {
        var cp = packets[ci];
        var ang = cp.dx * 6.2832, rad = (4 + cp.dy * 24) * (1 + (1 - coll) * 6);
        ctx.beginPath();
        ctx.arc(W * 0.5 + Math.cos(ang + tm * 0.0005) * rad,
                H * 0.21 + Math.sin(ang + tm * 0.0005) * rad * 0.85, 1.6, 0, 6.2832);
        ctx.fillStyle = rgba(cp.hue, 0.55 * coll * acc); ctx.fill();
      }
    }

    ctx.restore();
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
  function drawStill() { draw(0, false); for (var i = 1; i < 34; i++) draw(i * 130, true); }

  measure(); measureStops(); readScroll(); Pv = P;
  if (reduced) drawStill(); else start();

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { measure(); measureStops(); readScroll(); if (reduced) drawStill(); }, 180);
  }, { passive: true });
  window.addEventListener('load', function () { measureStops(); readScroll(); });
  document.addEventListener('visibilitychange', function () {
    visible = !document.hidden; if (visible) start();
  });
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) start(); },
                             { threshold: 0 }).observe(root);
  }

  /* --------------------------------- EL ESTADO, EN PALABRAS -------------- */
  var label = document.querySelector('[data-field-state]');
  if (label) {
    var NAMES = (label.getAttribute('data-names') || '').split('|');
    var last = -1;
    label.style.transition = 'opacity .22s ease';
    (function sync() {
      var idx = (wB >= wA) ? iB : iA;
      if (idx !== last && NAMES[idx]) {
        last = idx;
        label.style.opacity = 0;
        setTimeout(function () { label.textContent = NAMES[idx]; label.style.opacity = 1; }, 200);
      }
      requestAnimationFrame(sync);
    })();
  }
})();
