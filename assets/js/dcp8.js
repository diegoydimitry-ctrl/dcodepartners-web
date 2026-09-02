/* ============================================================================
   D-CODE PARTNERS — INSTRUMENTOS  ·  v8
   ----------------------------------------------------------------------------
   MISMO UNIVERSO, UNA IDEA DISTINTA EN CADA PÁGINA.

   La portada cuenta el nacimiento de un sistema. Copiar ese mismo campo en el
   resto de la web sería exactamente lo contrario de lo que la hace buena. Así
   que cada página importante tiene su propio instrumento: una idea visual que
   solo tiene sentido en ESA página, porque nace de lo que esa página dice.

     automatizacion  La tarea repetida    lo que se repite se captura y pasa a
                                          ser un solo proceso que corre solo
     agentes         La conversación      dos voces que se turnan; la del
                                          visitante manda, la otra responde
     integraciones   El puente            dos sistemas que no se hablaban y el
                                          puente que se construye entre ellos
     finance         El circuito          el dinero recorriendo sus estados
                                          hasta acumularse en lo cobrado
     curso           El pulso             lo que late ya y lo que todavía es
                                          andamio
     metodo          El plano             un plano que se dibuja: guías,
                                          trazos y cotas, en ese orden
     casos           La linterna          una sala oscura donde la evidencia
                                          aparece donde miras
     contacto        La señal             una señal que gana fuerza a medida
                                          que se completa el formulario
     conocenos       Dos mitades          estrategia y arquitectura,
                                          convergiendo en el centro
     servicios       El tejido            tres hilos que se trenzan en uno

   Reglas comunes: nada gira eternamente sin decir nada, prefers-reduced-motion
   recibe una imagen fija, el bucle se detiene si la pestaña no se ve, y el
   texto SIEMPRE va por delante — ninguna página depende del lienzo para
   entenderse.
   ========================================================================= */
(function () {
  'use strict';

  var host = document.querySelector('[data-inst]');
  if (!host) return;
  var NAME = host.getAttribute('data-inst');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse  = window.matchMedia('(pointer: coarse)').matches;

  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);
  var ctx = canvas.getContext('2d', { alpha: false });

  var W = 0, H = 0, dpr = 1, narrow = false, small = false;
  var FW = 0, FH = 0, OFFX = 0, OFFY = 0;
  /* Instrumentos que trabajan en una banda propia en vez de a pantalla
     completa: son los de las ocho fichas, donde el texto ocupa casi todo. */
  var BANDED = { comercial:1, marketing:1, clientes:1, produccion:1,
                 finanzas:1, soporte:1, administracion:1, direccion:1 };
  var P = 0, Pv = 0;                       // avance de scroll 0..1
  var mx = 0.5, my = 0.5, cmx = 0.5, cmy = 0.5;
  var inst = null;

  var C = {
    cian:  [ 77, 208, 225], azul: [ 91, 140, 255], violeta: [124, 108, 255],
    lav:   [167, 139, 250], rosa: [255, 107, 157], verde:   [ 53, 224, 161],
    ambar: [255, 180,  58], turq: [ 45, 212, 191]
  };
  function rgba(h, a) { return 'rgba(' + h[0] + ',' + h[1] + ',' + h[2] + ',' + a + ')'; }
  function sd(i, s) { var x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }
  function clamp(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }
  /* Ventana de avance: 0 antes de `a`, 1 después de `b`. Con esto cada
     instrumento decide en qué tramo de la página ocurre cada cosa. */
  function win(a, b) { return ease((Pv - a) / Math.max(0.0001, b - a)); }

  function measure() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    FW = host.clientWidth; FH = host.clientHeight;
    canvas.width = Math.round(FW * dpr); canvas.height = Math.round(FH * dpr);
    canvas.style.width = FW + 'px'; canvas.style.height = FH + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (BANDED[NAME] && FW >= 900) {
      OFFX = FW * 0.44; OFFY = FH * 0.26;
      W = FW * 0.55; H = FH * 0.70;
    } else if (BANDED[NAME]) {
      OFFX = 0; OFFY = FH * 0.42;
      W = FW; H = FH * 0.56;
    } else { OFFX = 0; OFFY = 0; W = FW; H = FH; }
    narrow = W < 900; small = W < 620;
    if (inst && inst.build) inst.build();
  }

  /* ------------------------------------------------- MATERIA COMPARTIDA */
  /* La portada demostró que una nube de partículas que se reorganiza dice
     mucho más que una figura dibujada encima de la página. Los instrumentos
     usan LA MISMA materia: lo que cambia de una página a otra es la forma
     que se le pide, no de qué está hecha. Eso es lo que mantiene un solo
     universo mientras cada sección conserva su idea propia. */
  var ACERO = [150, 178, 226];
  var CI = { cian:0, azul:1, violeta:2, lav:3, rosa:4, verde:5,
             ambar:6, turq:7, acero:8, blanco:9 };
  var NUB = [], NSPR = [], NPX = null, NPY = null, NPA = null, NPG = null, NPC = null;
  var o1 = { x: 0, y: 0, a: 1, g: -1, c: 8 };

  function chispas() {
    NSPR = [];
    var todos = [C.cian, C.azul, C.violeta, C.lav, C.rosa, C.verde,
                 C.ambar, C.turq, ACERO, [226, 240, 255]];
    for (var i = 0; i < todos.length; i++) {
      var cv = document.createElement('canvas'), R = 28;
      cv.width = cv.height = R * 2;
      var g = cv.getContext('2d');
      var gr = g.createRadialGradient(R, R, 0, R, R, R);
      gr.addColorStop(0,    rgba(todos[i], 1));
      gr.addColorStop(0.22, rgba(todos[i], 0.52));
      gr.addColorStop(0.55, rgba(todos[i], 0.12));
      gr.addColorStop(1,    rgba(todos[i], 0));
      g.fillStyle = gr; g.fillRect(0, 0, R * 2, R * 2);
      NSPR.push(cv);
    }
  }

  function nube(n) {
    NUB = [];
    for (var i = 0; i < n; i++) {
      NUB.push({ z: 0.40 + sd(i, 1) * 0.60, s: 0.70 + sd(i, 2) * 0.90,
                 vx: 0, vy: 0, x: -1, y: 0 });
    }
    NPX = new Float32Array(n); NPY = new Float32Array(n);
    NPA = new Float32Array(n); NPG = new Int32Array(n); NPC = new Int32Array(n);
    chispas();
  }

  /* fn(i, u, o, tm) escribe el destino de cada partícula. Nadie salta: cada
     una PERSIGUE su objetivo, y por eso se ve viajar de una forma a otra. */
  function materia(fn, tm) {
    for (var i = 0; i < NUB.length; i++) {
      var p = NUB[i];
      o1.a = 1; o1.g = -1; o1.c = CI.acero;
      fn(i, i / NUB.length, o1, tm);
      if (p.x < 0) { p.x = o1.x; p.y = o1.y; }
      p.vx += (o1.x - p.x) * 0.11; p.vy += (o1.y - p.y) * 0.11;
      p.vx *= 0.74; p.vy *= 0.74;
      p.x += p.vx; p.y += p.vy;
      NPX[i] = p.x; NPY[i] = p.y; NPA[i] = o1.a;
      NPG[i] = o1.g; NPC[i] = o1.c;
    }
  }

  /* El enlace une partículas CONSECUTIVAS DEL MISMO GRUPO: así la estructura
     la dibujan ellas y no una línea añadida por encima. */
  function pinta(enl) {
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < NUB.length; i++) {
      var p = NUB[i], a = NPA[i] * (0.42 + p.z * 0.66);
      if (a <= 0.012) continue;
      var sp = Math.min(1.1, Math.sqrt(p.vx * p.vx + p.vy * p.vy) * 0.22);
      var r = (1.7 + p.s * 2.8) * p.z * (1 + sp);
      ctx.globalAlpha = Math.min(0.72, a);
      ctx.drawImage(NSPR[NPC[i]], NPX[i] - r, NPY[i] - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;
    if (enl) {
      ctx.lineWidth = 1; ctx.beginPath();
      for (var k = 1; k < NUB.length; k++) {
        if (NPG[k] < 0 || NPG[k] !== NPG[k - 1]) continue;
        var dx = NPX[k] - NPX[k - 1], dy = NPY[k] - NPY[k - 1];
        if (dx * dx + dy * dy > 24000) continue;
        ctx.moveTo(NPX[k - 1], NPY[k - 1]); ctx.lineTo(NPX[k], NPY[k]);
      }
      ctx.strokeStyle = rgba(ACERO, enl); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function clear(alpha) {
    // Se limpia el lienzo ENTERO aunque el instrumento trabaje en su banda:
    // si no, la estela quedaría recortada en un rectángulo visible.
    ctx.save(); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = reduced ? '#05070e' : 'rgba(5,7,14,' + (alpha || 0.24) + ')';
    ctx.fillRect(0, 0, FW, FH);
    ctx.restore();
    ctx.globalCompositeOperation = 'lighter';
  }

  /* ==================================================================== */
  /* 1 · AUTOMATIZACIÓN — "La tarea repetida"                             */
  /* Una columna de marcas idénticas cayendo sin fin. Una línea de captura */
  /* barre la pantalla y cada repetición atrapada se funde en un único     */
  /* proceso que cruza y sale por la derecha. Lo repetitivo deja de serlo. */
  /* ==================================================================== */
  var INSTR = {};

  INSTR.automatizacion = (function () {
    var marks = [], tokens = [], sweep = 0;
    return {
      build: function () {
        marks.length = 0;
        var n = small ? 26 : 46;
        for (var i = 0; i < n; i++) {
          marks.push({ i: i, y: sd(i, 3), x: 0.10 + sd(i, 5) * 0.12, w: 10 + sd(i, 7) * 26, taken: 0 });
        }
        tokens.length = 0;
      },
      draw: function (tm) {
        clear(0.30);
        var lane = narrow ? H * 0.62 : H * 0.5;
        var open = win(0.02, 0.42);           // la captura empieza al bajar

        // Marcas repetidas: siempre iguales, siempre bajando.
        for (var i = 0; i < marks.length; i++) {
          var m = marks[i];
          var y = ((m.y + tm * 0.000035 * (0.7 + sd(i, 9) * 0.6)) % 1) * H;
          var x = m.x * W;
          var caught = open > 0.15 && Math.abs(y - lane) < 26;
          if (caught && m.taken < 1) {
            m.taken = 1;
            tokens.push({ x: x, y: lane, v: 0.5 + sd(i + tm, 2) * 0.5, hue: C.cian, life: 1 });
          }
          if (y > lane + 40) m.taken = 0;
          var a = caught ? 0.5 : 0.16 + sd(i, 11) * 0.10;
          ctx.fillStyle = rgba(caught ? C.azul : [140, 156, 190], a);
          ctx.fillRect(x, y, m.w, 1.4);
        }

        // La línea de captura.
        if (open > 0.05) {
          var g = ctx.createLinearGradient(0, lane, W, lane);
          g.addColorStop(0, rgba(C.cian, 0));
          g.addColorStop(0.16, rgba(C.cian, 0.30 * open));
          g.addColorStop(0.5, rgba(C.violeta, 0.20 * open));
          g.addColorStop(1, rgba(C.rosa, 0));
          ctx.strokeStyle = g; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(0, lane); ctx.lineTo(W, lane); ctx.stroke();
        }

        // Un solo proceso corriendo hacia la derecha, con estela.
        for (var t = tokens.length - 1; t >= 0; t--) {
          var k = tokens[t];
          k.x += k.v * (1.6 + open * 3.4);
          k.life -= 0.0016;
          if (k.x > W + 40 || k.life <= 0) { tokens.splice(t, 1); continue; }
          ctx.strokeStyle = rgba(C.cian, 0.26 * k.life); ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(k.x - 90, k.y); ctx.lineTo(k.x, k.y); ctx.stroke();
          ctx.beginPath(); ctx.arc(k.x, k.y, 2.1, 0, 6.2832);
          ctx.fillStyle = rgba([206, 232, 255], 0.7 * k.life); ctx.fill();
        }
        sweep = open;
      }
    };
  })();

  /* ==================================================================== */
  /* 2 · AGENTES DE IA — "La conversación"                                */
  /* Dos envolventes de voz que se turnan. La de arriba sigue al puntero   */
  /* (habla el visitante); la de abajo responde después, en otro tono.     */
  /* ==================================================================== */
  INSTR.agentes = (function () {
    var phase = 0, answering = 0, lastMove = 0;
    return {
      build: function () {},
      draw: function (tm) {
        clear(0.26);
        var midY = H * 0.5, amp = (narrow ? H * 0.10 : H * 0.13);
        var speak = coarse ? (0.5 + Math.sin(tm * 0.0011) * 0.5) : (1 - Math.min(1, (tm - lastMove) / 900));
        answering += ((1 - speak) - answering) * 0.04;

        function envelope(yBase, hue, energy, seedOff, dir) {
          ctx.beginPath();
          var step = small ? 10 : 6;
          for (var x = 0; x <= W; x += step) {
            var u = x / W;
            // Sobre de voz: fuerte en el centro, apagado en los extremos.
            var env = Math.pow(Math.sin(u * Math.PI), 1.4);
            var n = Math.sin(u * 13 + tm * 0.0026 + seedOff) * 0.5
                  + Math.sin(u * 31 + tm * 0.0041 + seedOff * 2) * 0.3
                  + Math.sin(u * 61 + tm * 0.0067 + seedOff * 3) * 0.2;
            var y = yBase + n * amp * env * energy * dir;
            if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = rgba(hue, 0.10 + 0.42 * energy);
          ctx.lineWidth = 1.4; ctx.stroke();
        }

        // Quien pregunta.
        envelope(midY - amp * 0.55, C.cian, 0.22 + speak * 0.78, 0, 1);
        // Quien responde, un instante después y hacia el otro lado.
        envelope(midY + amp * 0.55, C.violeta, 0.16 + answering * 0.84, 2.2, -1);

        // La línea de turno entre las dos voces.
        var g = ctx.createLinearGradient(0, midY, W, midY);
        g.addColorStop(0, rgba(C.cian, 0));
        g.addColorStop(0.5, rgba([150, 174, 245], 0.12));
        g.addColorStop(1, rgba(C.rosa, 0));
        ctx.strokeStyle = g; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(W, midY); ctx.stroke();

        // Un punto marca de quién es el turno.
        var tx = W * (0.5 + (speak > 0.5 ? -0.22 : 0.22));
        ctx.beginPath(); ctx.arc(tx, midY, 3, 0, 6.2832);
        ctx.fillStyle = rgba(speak > 0.5 ? C.cian : C.violeta, 0.6); ctx.fill();
      },
      move: function () { lastMove = performance.now(); }
    };
  })();

  /* ==================================================================== */
  /* 3 · INTEGRACIONES — "El puente"                                      */
  /* Dos constelaciones que no se tocan. Al bajar, se tiende un puente y   */
  /* la información empieza a cruzar en los dos sentidos.                 */
  /* ==================================================================== */
  INSTR.integraciones = (function () {
    var A = [], B = [];
    return {
      build: function () {
        A.length = 0; B.length = 0;
        var n = small ? 10 : 16;
        for (var i = 0; i < n; i++) {
          A.push({ x: W * (0.05 + sd(i, 2) * 0.26), y: H * (0.16 + sd(i, 3) * 0.68), r: 1 + sd(i, 4) * 1.6 });
          B.push({ x: W * (0.69 + sd(i, 5) * 0.26), y: H * (0.16 + sd(i, 6) * 0.68), r: 1 + sd(i, 7) * 1.6 });
        }
      },
      draw: function (tm) {
        clear(0.26);
        var built = win(0.06, 0.52);
        function island(pts, hue) {
          for (var i = 0; i < pts.length; i++) {
            for (var j = i + 1; j < pts.length; j++) {
              var dx = pts[j].x - pts[i].x, dy = pts[j].y - pts[i].y;
              var d = Math.sqrt(dx * dx + dy * dy);
              if (d > W * 0.16) continue;
              ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
              ctx.strokeStyle = rgba(hue, 0.10 * (1 - d / (W * 0.16))); ctx.lineWidth = 1; ctx.stroke();
            }
            var b = 0.30 + Math.sin(tm * 0.0013 + i) * 0.12;
            ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, pts[i].r, 0, 6.2832);
            ctx.fillStyle = rgba(hue, b); ctx.fill();
          }
        }
        island(A, C.cian); island(B, C.rosa);

        // El puente: se tiende desde los dos lados a la vez.
        var ax = W * 0.31, bx = W * 0.69, y = H * 0.5;
        var reach = built;
        ctx.lineWidth = 1.2;
        var g = ctx.createLinearGradient(ax, y, bx, y);
        g.addColorStop(0, rgba(C.cian, 0.42 * reach));
        g.addColorStop(0.5, rgba([210, 232, 255], 0.5 * reach));
        g.addColorStop(1, rgba(C.rosa, 0.42 * reach));
        ctx.strokeStyle = g;
        ctx.beginPath();
        ctx.moveTo(lerp(ax, bx, 0.5 - reach * 0.5), y);
        ctx.lineTo(lerp(ax, bx, 0.5 + reach * 0.5), y);
        ctx.stroke();

        // Tirantes hacia cada isla.
        if (reach > 0.35) {
          for (var k = 0; k < A.length; k += 3) {
            ctx.beginPath(); ctx.moveTo(A[k].x, A[k].y); ctx.lineTo(ax, y);
            ctx.strokeStyle = rgba(C.cian, 0.08 * reach); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(B[k].x, B[k].y); ctx.lineTo(bx, y);
            ctx.strokeStyle = rgba(C.rosa, 0.08 * reach); ctx.stroke();
          }
        }
        // Y el dato cruzando, en los dos sentidos.
        if (reach > 0.6) {
          for (var t = 0; t < 5; t++) {
            var f = ((tm * 0.00022) + t * 0.2) % 1;
            var go = t % 2 === 0;
            var px = go ? lerp(ax, bx, f) : lerp(bx, ax, f);
            ctx.beginPath(); ctx.arc(px, y, 2, 0, 6.2832);
            ctx.fillStyle = rgba(go ? C.cian : C.rosa, 0.65 * Math.sin(f * Math.PI) * reach);
            ctx.fill();
          }
        }
      }
    };
  })();

  /* ==================================================================== */
  /* 4 · D-CODE FINANCE — "El circuito"                                   */
  /* El dinero recorriendo sus estados y acumulándose en lo cobrado. Es    */
  /* una representación del circuito, no de ninguna cuenta real.          */
  /* ==================================================================== */
  INSTR.finance = (function () {
    var toks = [], basin = 0;
    var GATES = [0.18, 0.40, 0.62, 0.84];
    return {
      build: function () { toks.length = 0; basin = 0; },
      draw: function (tm) {
        clear(0.34);
        var y0 = H * 0.30, y1 = H * 0.72;
        var live = win(0.02, 0.35);

        // Carriles y compuertas: emitido → enviado → vencido → cobrado.
        for (var g = 0; g < GATES.length; g++) {
          var gx = W * GATES[g];
          ctx.beginPath(); ctx.moveTo(gx, y0); ctx.lineTo(gx, y1);
          ctx.strokeStyle = rgba(g === GATES.length - 1 ? C.verde : [150, 174, 245], 0.20);
          ctx.lineWidth = 1; ctx.stroke();
        }
        if (toks.length < (small ? 18 : 34) && Math.random() < 0.16 * (0.35 + live)) {
          toks.push({ x: W * 0.04, y: lerp(y0, y1, Math.random()), v: 0.5 + Math.random() * 1.1,
                      hue: C.azul, st: 0, hold: 0 });
        }
        for (var i = toks.length - 1; i >= 0; i--) {
          var k = toks[i];
          if (k.hold > 0) { k.hold--; }
          else {
            k.x += k.v * (0.5 + live * 1.9);
            for (var q = 0; q < GATES.length; q++) {
              var gx2 = W * GATES[q];
              if (k.st === q && k.x >= gx2) {
                k.st = q + 1;
                k.hold = q === 2 ? 40 + Math.random() * 60 : 8 + Math.random() * 16;
                k.hue = q === 0 ? C.cian : q === 1 ? C.ambar : C.verde;
              }
            }
          }
          if (k.x > W * 0.90) { basin = Math.min(1, basin + 0.012); toks.splice(i, 1); continue; }
          var a = k.hold > 0 ? 0.42 : 0.85;
          ctx.beginPath(); ctx.moveTo(k.x - 12, k.y); ctx.lineTo(k.x, k.y);
          ctx.strokeStyle = rgba(k.hue, a * 0.6); ctx.lineWidth = 1.5; ctx.stroke();
          ctx.beginPath(); ctx.arc(k.x, k.y, 2.2, 0, 6.2832);
          ctx.fillStyle = rgba(k.hue, a); ctx.fill();
        }

        // La cuenca de lo cobrado: se llena y se sostiene.
        basin *= 0.9985;
        var bx = W * 0.93, bh = (y1 - y0) * Math.min(1, basin);
        var bg = ctx.createLinearGradient(bx, y1, bx, y1 - bh);
        bg.addColorStop(0, rgba(C.verde, 0.46));
        bg.addColorStop(1, rgba(C.verde, 0.06));
        ctx.fillStyle = bg;
        ctx.fillRect(bx, y1 - bh, Math.max(2, W * 0.035), bh);
      }
    };
  })();

  /* ==================================================================== */
  /* 5 · CAMBIOS EN PROCESO — "El pulso"                                  */
  /* Lo que ya está activo late con ritmo propio. Lo que está en obra se   */
  /* dibuja como andamio: trazo discontinuo que todavía no cierra.        */
  /* ==================================================================== */
  INSTR.curso = (function () {
    return {
      build: function () {},
      draw: function (tm) {
        clear(0.30);
        var rows = small ? 4 : 7;
        for (var r = 0; r < rows; r++) {
          var y = H * (0.16 + (r / (rows - 1)) * 0.68);
          var wip = r < 2;                       // dos frentes en obra
          var hue = wip ? C.ambar : C.verde;
          ctx.beginPath();
          var step = small ? 14 : 11;
          for (var x = 0; x <= W; x += step) {
            var u = x / W;
            var beat;
            if (wip) {
              // Andamio: trazo que se interrumpe. Todavía no es una línea.
              beat = (Math.sin(u * 40 + r) > 0.2 ? 1 : 0) * Math.sin(u * 9 + tm * 0.0012 + r) * 4;
            } else {
              // Latido: reposo largo y un pico limpio, como un monitor.
              var t = (u * 3 + tm * 0.00016 + r * 0.31) % 1;
              var dd = (t - 0.5) * 34; var pk = dd * dd > 30 ? 0 : Math.exp(-dd * dd);
              beat = -pk * (narrow ? 16 : 26) + Math.sin(u * 60 + tm * 0.002) * 0.7;
            }
            var yy = y + beat;
            if (x === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
          }
          ctx.strokeStyle = rgba(hue, wip ? 0.20 : 0.30);
          ctx.lineWidth = 1.2; ctx.stroke();
        }
      }
    };
  })();

  /* ==================================================================== */
  /* 6 · MÉTODO — "El plano"                                              */
  /* Un plano dibujándose en el orden en que se dibuja de verdad: primero  */
  /* las guías, luego el trazo firme, y al final las cotas.                */
  /* ==================================================================== */
  INSTR.metodo = (function () {
    var pts = [];
    return {
      build: function () {
        pts.length = 0;
        var n = 7;
        for (var i = 0; i < n; i++) {
          pts.push({ x: W * (0.14 + sd(i, 12) * 0.72), y: H * (0.16 + (i / (n - 1)) * 0.68) });
        }
      },
      draw: function (tm) {
        clear(0.34);
        var guides = win(0.00, 0.22), firm = win(0.20, 0.60), dims = win(0.55, 0.88);

        // Guías: retícula de construcción, tenue y ortogonal.
        if (guides > 0.02) {
          ctx.lineWidth = 1;
          ctx.strokeStyle = rgba([150, 174, 245], 0.055 * guides);
          for (var i = 0; i < pts.length; i++) {
            ctx.beginPath(); ctx.moveTo(0, pts[i].y); ctx.lineTo(W * guides, pts[i].y); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(pts[i].x, 0); ctx.lineTo(pts[i].x, H * guides); ctx.stroke();
          }
        }
        // Trazo firme: la polilínea que une los puntos, dibujándose.
        if (firm > 0.01) {
          var upto = firm * (pts.length - 1);
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (var k = 1; k < pts.length; k++) {
            var f = Math.max(0, Math.min(1, upto - (k - 1)));
            if (f <= 0) break;
            ctx.lineTo(lerp(pts[k - 1].x, pts[k].x, f), lerp(pts[k - 1].y, pts[k].y, f));
          }
          ctx.strokeStyle = rgba(C.cian, 0.42); ctx.lineWidth = 1.5; ctx.stroke();
          for (var m = 0; m < pts.length; m++) {
            if (upto < m - 0.02) break;
            ctx.beginPath(); ctx.arc(pts[m].x, pts[m].y, 3, 0, 6.2832);
            ctx.strokeStyle = rgba(C.cian, 0.55); ctx.lineWidth = 1; ctx.stroke();
          }
        }
        // Cotas: lo último que se añade a un plano.
        if (dims > 0.02) {
          ctx.setLineDash([3, 5]);
          ctx.strokeStyle = rgba(C.lav, 0.24 * dims); ctx.lineWidth = 1;
          for (var d = 1; d < pts.length; d++) {
            ctx.beginPath();
            ctx.moveTo(pts[d - 1].x, pts[d - 1].y); ctx.lineTo(pts[d].x, pts[d - 1].y);
            ctx.lineTo(pts[d].x, pts[d].y); ctx.stroke();
          }
          ctx.setLineDash([]);
        }
      }
    };
  })();

  /* ==================================================================== */
  /* 7 · CASOS — "La linterna"                                            */
  /* Una sala a oscuras con evidencia sobre la mesa. Solo se ve donde se   */
  /* mira: examinar es una acción, no una lectura.                        */
  /* ==================================================================== */
  INSTR.casos = (function () {
    var marks = [];
    return {
      build: function () {
        marks.length = 0;
        var cols = small ? 6 : 14, rows = small ? 10 : 12;
        for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
          marks.push({
            x: W * ((c + 0.5) / cols), y: H * ((r + 0.5) / rows),
            w: 6 + sd(r * cols + c, 3) * 26,
            bad: sd(r * cols + c, 8) > 0.93          // una hipótesis tachada
          });
        }
      },
      draw: function (tm) {
        clear(0.5);
        var lx = coarse ? W * (0.5 + Math.sin(tm * 0.0004) * 0.3) : cmx * W;
        var ly = coarse ? H * (0.5 + Math.cos(tm * 0.00031) * 0.3) : cmy * H;
        var R = narrow ? W * 0.42 : W * 0.24;

        var g = ctx.createRadialGradient(lx, ly, 0, lx, ly, R);
        g.addColorStop(0, 'rgba(120,150,220,0.10)');
        g.addColorStop(1, 'rgba(9,12,26,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(lx, ly, R, 0, 6.2832); ctx.fill();

        for (var i = 0; i < marks.length; i++) {
          var m = marks[i];
          var d = Math.sqrt((m.x - lx) * (m.x - lx) + (m.y - ly) * (m.y - ly));
          if (d > R) continue;
          var a = (1 - d / R);
          ctx.strokeStyle = rgba(m.bad ? C.rosa : [176, 196, 232], 0.42 * a * a);
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(m.x - m.w / 2, m.y); ctx.lineTo(m.x + m.w / 2, m.y); ctx.stroke();
          if (m.bad) {   // lo que resultó no ser cierto, tachado
            ctx.beginPath();
            ctx.moveTo(m.x - m.w / 2, m.y - 4); ctx.lineTo(m.x + m.w / 2, m.y + 4); ctx.stroke();
          }
        }
      }
    };
  })();

  /* ==================================================================== */
  /* 8 · CONTACTO — "La señal"                                            */
  /* Una señal que gana fuerza a medida que se completa el formulario y    */
  /* alcanza el nodo del otro extremo cuando ya se puede enviar.           */
  /* ==================================================================== */
  INSTR.contacto = (function () {
    var strength = 0;
    /* El formulario se mira cuando cambia, no sesenta veces por segundo:
       consultarlo en cada fotograma costaba la mitad de la tasa de refresco. */
    var cachedReq = null, cachedVal = 0.35;
    function recompute() {
      var f = document.getElementById('contact-form');
      if (!f) return;
      if (!cachedReq) cachedReq = f.querySelectorAll('input[required], textarea[required]');
      if (!cachedReq.length) return;
      var ok = 0;
      Array.prototype.forEach.call(cachedReq, function (el) {
        if (el.type === 'checkbox') { if (el.checked) ok++; }
        else if (String(el.value || '').trim().length > 1) ok++;
      });
      cachedVal = ok / cachedReq.length;
    }
    ['input', 'change'].forEach(function (ev) {
      document.addEventListener(ev, recompute, true);
    });
    setTimeout(recompute, 400);
    function formProgress() { return cachedVal; }
    return {
      build: function () {},
      draw: function (tm) {
        clear(0.28);
        strength += (formProgress() - strength) * 0.06;
        var ax = W * 0.10, bx = W * 0.90, y = H * 0.5;

        // Anillos del emisor: cuanta más señal, más lejos llegan.
        for (var r = 0; r < 4; r++) {
          var t = ((tm * 0.00035) + r * 0.25) % 1;
          var rad = t * (W * 0.16) * (0.4 + strength);
          ctx.beginPath(); ctx.arc(ax, y, rad, 0, 6.2832);
          ctx.strokeStyle = rgba(C.cian, 0.24 * (1 - t) * (0.3 + strength)); ctx.lineWidth = 1;
          ctx.stroke();
        }
        // El trayecto, que solo se completa cuando el formulario está listo.
        var reach = ease(strength);
        var g = ctx.createLinearGradient(ax, y, bx, y);
        g.addColorStop(0, rgba(C.cian, 0.42));
        g.addColorStop(Math.max(0.02, reach), rgba(C.violeta, 0.30));
        g.addColorStop(Math.min(1, reach + 0.02), rgba(C.violeta, 0));
        ctx.strokeStyle = g; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(ax, y); ctx.lineTo(lerp(ax, bx, reach), y); ctx.stroke();

        // Paquetes en camino.
        for (var k = 0; k < 3; k++) {
          var f = ((tm * 0.0004) + k * 0.33) % 1;
          if (f > reach) continue;
          ctx.beginPath(); ctx.arc(lerp(ax, bx, f), y, 2, 0, 6.2832);
          ctx.fillStyle = rgba([214, 236, 255], 0.7 * (0.3 + strength)); ctx.fill();
        }
        // El nodo receptor: se enciende cuando la señal llega.
        var on = reach > 0.96 ? 1 : reach * 0.4;
        ctx.beginPath(); ctx.arc(bx, y, 4 + on * 3, 0, 6.2832);
        ctx.fillStyle = rgba(C.verde, 0.28 + on * 0.5); ctx.fill();
        ctx.beginPath(); ctx.arc(bx, y, 12 + on * 10, 0, 6.2832);
        ctx.strokeStyle = rgba(C.verde, 0.16 + on * 0.28); ctx.lineWidth = 1; ctx.stroke();
      }
    };
  })();

  /* ==================================================================== */
  /* 9 · CONÓCENOS — "Dos mitades"                                        */
  /* Una mitad ortogonal (arquitectura) y otra curva (estrategia) que se   */
  /* encuentran en el centro. Dos formas de pensar, un mismo sistema.      */
  /* ==================================================================== */
  INSTR.conocenos = (function () {
    return {
      build: function () {},
      draw: function (tm) {
        clear(0.28);
        var mid = W * 0.5, join = win(0.05, 0.55);
        var n = small ? 8 : 13;
        // Izquierda: trazos rectos, ángulos, orden.
        for (var i = 0; i < n; i++) {
          var y = H * (0.12 + (i / (n - 1)) * 0.76);
          var ext = mid * (0.30 + 0.70 * join) * (0.5 + sd(i, 4) * 0.5);
          ctx.beginPath();
          ctx.moveTo(mid - ext, y);
          ctx.lineTo(mid - ext * 0.4, y);
          ctx.lineTo(mid - ext * 0.4, y + (sd(i, 6) - 0.5) * 40);
          ctx.lineTo(mid - 6, y + (sd(i, 6) - 0.5) * 40);
          ctx.strokeStyle = rgba(C.azul, 0.16 + 0.18 * join); ctx.lineWidth = 1; ctx.stroke();
        }
        // Derecha: curvas, continuidad, dirección.
        for (var j = 0; j < n; j++) {
          var y2 = H * (0.12 + (j / (n - 1)) * 0.76);
          var ext2 = (W - mid) * (0.30 + 0.70 * join) * (0.5 + sd(j, 9) * 0.5);
          ctx.beginPath();
          ctx.moveTo(mid + 6, y2);
          ctx.bezierCurveTo(mid + ext2 * 0.4, y2 + Math.sin(tm * 0.0006 + j) * 26,
                            mid + ext2 * 0.7, y2 - Math.cos(tm * 0.0005 + j) * 26,
                            mid + ext2, y2);
          ctx.strokeStyle = rgba(C.rosa, 0.14 + 0.18 * join); ctx.lineWidth = 1; ctx.stroke();
        }
        // La costura donde se juntan.
        var g = ctx.createLinearGradient(mid, 0, mid, H);
        g.addColorStop(0, rgba([150, 174, 245], 0));
        g.addColorStop(0.5, rgba([190, 214, 255], 0.16 + 0.2 * join));
        g.addColorStop(1, rgba([150, 174, 245], 0));
        ctx.strokeStyle = g; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(mid, 0); ctx.lineTo(mid, H); ctx.stroke();
      }
    };
  })();

  /* ==================================================================== */
  /* 10 · SERVICIOS — "El tejido"                                         */
  /* Tres hilos de distinto color que bajan por la página y se trenzan     */
  /* hasta salir como uno solo. No se venden por separado.                 */
  /* ==================================================================== */
  INSTR.servicios = (function () {
    /* El cable, hecho de partículas. Un cable reúne a la vez las seis cosas
       que esta página tiene que transmitir — profundidad, cruce, unión,
       tensión, continuidad y dependencia — y ahora se ve DE QUÉ está hecho:
       cada hebra es una fila de partículas que se sostienen entre sí. */
    var HUE = [CI.cian, CI.violeta, CI.rosa];
    return {
      build: function () { nube(small ? 300 : narrow ? 520 : 840); },
      draw: function (tm) {
        clear(0.30);
        var cx = W * (narrow ? 0.5 : 0.80);
        var spread = W * (narrow ? 0.17 : 0.085);
        var tense = win(0.04, 0.72);
        var cyc = (tm * 0.00013) % 1;
        var flojo = Math.floor(cyc * 3), cede = Math.sin(((cyc * 3) % 1) * Math.PI);
        var per = NUB.length / 3;

        materia(function (i, u, o) {
          var si = Math.min(2, (i / per) | 0);
          var uu = ((i - si * per) / per) * 1.24 - 0.12;   // sale del encuadre
          var fase = uu * 7.4 + si * 2.0944 + tm * 0.00022;
          var s2 = si === flojo ? 1 + 0.42 * cede : 1 - 0.16 * cede;
          var rad = spread * (1 - 0.62 * ease(uu) * tense);
          o.x = cx + Math.cos(fase) * rad * s2;
          o.y = uu * H;
          var frente = Math.sin(fase) > 0;              // pasa por delante
          var carga = si === flojo ? 0 : cede;
          o.a = (frente ? 0.62 : 0.16) + 0.20 * tense + 0.26 * carga
              - (si === flojo ? 0.26 * cede : 0);
          o.c = HUE[si];
          o.g = si;
        }, tm);
        pinta(0.10);

        /* Las ataduras: lo que convierte tres hebras en un solo cable. */
        var paso = 0.145;
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineWidth = 1;
        for (var b = paso; b < 1.1; b += paso) {
          var ap = ease((tense - (b - 0.1) * 0.5) / 0.35);
          if (ap <= 0) continue;
          var yb = b * H;
          var izq = cx - spread * 1.25, der = cx + spread * 1.25;
          ctx.strokeStyle = rgba([214, 236, 255], 0.07 * ap);
          for (var k = 0; k < 3; k++) {
            ctx.beginPath();
            ctx.moveTo(izq, yb + (k - 1) * 3); ctx.lineTo(der, yb + (k - 1) * 3);
            ctx.stroke();
          }
        }
        ctx.globalCompositeOperation = 'source-over';
      }
    };
  })();


  /* ==================================================================== */
  /* 11 · GARANTÍAS — "Lo que está escrito"                               */
  /* Cada compromiso se escribe de izquierda a derecha y, una vez escrito, */
  /* se queda. Nada parpadea: lo escrito no se retira.                    */
  /* ==================================================================== */
  INSTR.garantias = (function () {
    var lines = [];
    return {
      build: function () {
        lines.length = 0;
        var n = small ? 7 : 11;
        for (var i = 0; i < n; i++) {
          lines.push({
            y: H * (0.12 + (i / (n - 1)) * 0.76),
            x0: W * (0.06 + sd(i, 3) * 0.10),
            len: W * (0.30 + sd(i, 5) * 0.52),
            at: i / n
          });
        }
      },
      draw: function (tm) {
        clear(0.34);
        for (var i = 0; i < lines.length; i++) {
          var L = lines[i];
          var w = ease((Pv - L.at * 0.55) / 0.22);      // se escribe al llegar
          if (w <= 0) continue;
          var g = ctx.createLinearGradient(L.x0, L.y, L.x0 + L.len, L.y);
          g.addColorStop(0, rgba(C.cian, 0.30));
          g.addColorStop(1, rgba(C.violeta, 0.18));
          ctx.strokeStyle = g; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(L.x0, L.y); ctx.lineTo(L.x0 + L.len * w, L.y); ctx.stroke();
          // La punta que está escribiendo, solo mientras escribe.
          if (w < 0.995) {
            ctx.beginPath(); ctx.arc(L.x0 + L.len * w, L.y, 1.8, 0, 6.2832);
            ctx.fillStyle = rgba([214, 236, 255], 0.6); ctx.fill();
          } else {
            // Y la marca de cerrado al final de cada línea escrita.
            ctx.beginPath();
            ctx.moveTo(L.x0 + L.len + 8, L.y - 3); ctx.lineTo(L.x0 + L.len + 12, L.y + 2);
            ctx.lineTo(L.x0 + L.len + 20, L.y - 7);
            ctx.strokeStyle = rgba(C.verde, 0.34); ctx.lineWidth = 1.3; ctx.stroke();
          }
        }
      }
    };
  })();

  /* ==================================================================== */
  /* 12 · CÓMO FUNCIONA — "El dato que viaja"                             */
  /* Un solo dato recorre las áreas y va dejando registro en cada una. Se  */
  /* escribe una vez y lo leen todas: eso es un sistema operativo.        */
  /* ==================================================================== */
  INSTR.dato = (function () {
    var stops = [], trail = [];
    return {
      build: function () {
        stops.length = 0; trail.length = 0;
        var n = small ? 4 : 6;
        for (var i = 0; i < n; i++) {
          stops.push({
            x: W * (0.12 + (i / (n - 1)) * 0.76),
            y: H * (0.34 + Math.sin(i * 1.7) * 0.20),
            hue: [C.cian, C.rosa, C.verde, C.ambar, C.azul, C.lav][i % 6],
            written: 0
          });
        }
      },
      draw: function (tm) {
        clear(0.28);
        var t = ((tm * 0.00007) % 1);
        var seg = t * (stops.length - 1);
        var si = Math.floor(seg), sf = seg - si;
        var a = stops[Math.min(si, stops.length - 1)];
        var b = stops[Math.min(si + 1, stops.length - 1)];
        var px = lerp(a.x, b.x, ease(sf)), py = lerp(a.y, b.y, ease(sf));

        // El camino entre áreas.
        ctx.beginPath();
        for (var i = 0; i < stops.length; i++) {
          if (i === 0) ctx.moveTo(stops[i].x, stops[i].y); else ctx.lineTo(stops[i].x, stops[i].y);
        }
        ctx.strokeStyle = rgba([150, 174, 245], 0.10); ctx.lineWidth = 1; ctx.stroke();

        // Cada área guarda su registro cuando el dato pasa por ella.
        for (var k = 0; k < stops.length; k++) {
          var s2 = stops[k];
          if (Math.abs(px - s2.x) < 14 && Math.abs(py - s2.y) < 14) s2.written = 1;
          s2.written *= 0.9992;
          ctx.beginPath(); ctx.arc(s2.x, s2.y, 4, 0, 6.2832);
          ctx.strokeStyle = rgba(s2.hue, 0.24 + s2.written * 0.5); ctx.lineWidth = 1; ctx.stroke();
          for (var r = 0; r < 3; r++) {
            var ry = s2.y + 16 + r * 7;
            ctx.beginPath(); ctx.moveTo(s2.x - 14, ry); ctx.lineTo(s2.x - 14 + 28 * s2.written, ry);
            ctx.strokeStyle = rgba(s2.hue, 0.30 * s2.written); ctx.lineWidth = 1; ctx.stroke();
          }
        }

        // El dato, con su estela.
        trail.push({ x: px, y: py });
        if (trail.length > 30) trail.shift();
        for (var q = 1; q < trail.length; q++) {
          ctx.beginPath(); ctx.moveTo(trail[q - 1].x, trail[q - 1].y); ctx.lineTo(trail[q].x, trail[q].y);
          ctx.strokeStyle = rgba(C.cian, 0.30 * (q / trail.length)); ctx.lineWidth = 1.4; ctx.stroke();
        }
        ctx.beginPath(); ctx.arc(px, py, 2.6, 0, 6.2832);
        ctx.fillStyle = rgba([220, 240, 255], 0.8); ctx.fill();
      }
    };
  })();


  /* ==================================================================== */
  /* 13 · CAPACIDADES (hub) — "El encaje"                                 */
  /* Piezas sueltas que giran a la deriva y, al bajar, se enderezan y      */
  /* encajan unas con otras hasta formar un cuerpo único. Es exactamente   */
  /* lo que dice la página: no se elige un pack, se combinan piezas que    */
  /* adquieren sentido juntas. Ninguna otra sección usa formas sólidas.    */
  /* ==================================================================== */
  INSTR.encaje = (function () {
    /* EL ENCAJE, llevado al límite. Las piezas no van derechas a su hueco:
       llegan girando, SE RESISTEN, sobrepasan y se asientan. Y una vez
       dentro, ceden materia a la vecina — se ve la unión hacerse — y el
       conjunto entero se re-tensa. Cada pieza que entra cambia el todo. */
    var pz = [], K = 8;
    return {
      build: function () {
        pz.length = 0;
        var cols = narrow ? 2 : 4, rows = narrow ? 4 : 2;
        var gw = narrow ? W * 0.78 : W * 0.58, gh = narrow ? H * 0.46 : H * 0.40;
        var ox = (W - gw) / 2, oy = (H - gh) / 2;
        var cw = gw / cols, ch = gh / rows;
        var HU = [CI.cian, CI.rosa, CI.verde, CI.ambar,
                  CI.azul, CI.turq, CI.violeta, CI.lav];
        for (var i = 0; i < K; i++) {
          var c = i % cols, r = (i / cols) | 0;
          var ang = sd(i, 7) * 6.2832;
          pz.push({
            tx: ox + c * cw + cw / 2, ty: oy + r * ch + ch / 2,
            w: cw * 0.80, h: ch * 0.74,
            sx: ox + gw / 2 + Math.cos(ang) * W * 0.46,
            sy: oy + gh / 2 + Math.sin(ang) * H * 0.52,
            rot: (sd(i, 8) - 0.5) * 2.6, hu: HU[i], d: sd(i, 9)
          });
        }
        nube(small ? 300 : narrow ? 520 : 880);
      },
      draw: function (tm) {
        clear(0.30);
        var fit = win(0.06, 0.62);
        var per = NUB.length / K;

        materia(function (i, u, o) {
          var k = Math.min(K - 1, (i / per) | 0);
          var t = pz[k];
          var j = (i - k * per) / per;                 // recorrido del contorno

          var raw = Math.max(0, Math.min(1, (fit - k * 0.052) / 0.46));
          /* Resistencia: sobrepasa el hueco y vuelve. Encajar cuesta. */
          var f = raw < 1
            ? ease(raw) + Math.sin(raw * Math.PI) * 0.11 * Math.sin(raw * 11 + k)
            : 1;
          /* Y gira hasta el último momento: no se alinea hasta que entra. */
          var rot = lerp(t.rot, 0, ease(Math.pow(raw, 1.7)))
                  + (1 - raw) * Math.sin(tm * 0.0007 + k) * 0.20;
          var cx = lerp(t.sx, t.tx, f), cy = lerp(t.sy, t.ty, f);

          /* La pieza es su CONTORNO, dibujado por sus propias partículas. */
          var pp = j * 4, e = pp | 0, ff = pp - e;
          var lx, ly, hw = t.w / 2, hh = t.h / 2;
          if (e === 0)      { lx = -hw + ff * t.w; ly = -hh; }
          else if (e === 1) { lx =  hw;            ly = -hh + ff * t.h; }
          else if (e === 2) { lx =  hw - ff * t.w; ly =  hh; }
          else              { lx = -hw;            ly =  hh - ff * t.h; }

          /* Las muescas: se ven ANTES de llegar, para saber por dónde une. */
          var mu = Math.abs(Math.sin(j * 12.566));
          if (raw > 0.16 && mu > 0.86) lx += (lx > 0 ? 1 : -1) * 7 * raw;

          var co = Math.cos(rot), si = Math.sin(rot);
          o.x = cx + lx * co - ly * si;
          o.y = cy + lx * si + ly * co;
          /* Presencia contenida: es estructura de fondo y la página tiene
             mucho texto encima. La materia se lee sin competir con él. */
          o.a = 0.13 + 0.26 * raw + 0.11 * mu;
          o.c = t.hu;
          o.g = raw > 0.10 ? 900 + k : -1;
        }, tm);
        pinta(0.05);

        /* Cuando dos vecinas ya están dentro, se ve pasar materia de una a
           otra: la conexión no se declara, se hace. */
        var seam = ease((fit - 0.62) / 0.30);
        if (seam > 0) {
          ctx.globalCompositeOperation = 'lighter';
          for (var k2 = 0; k2 + 1 < K; k2++) {
            var a = pz[k2], b2 = pz[k2 + 1];
            ctx.strokeStyle = rgba(ACERO, 0.09 * seam);
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.tx, a.ty); ctx.lineTo(b2.tx, b2.ty); ctx.stroke();
            for (var q = 0; q < 3; q++) {
              var pt = ((tm * 0.00045) + k2 * 0.2 + q * 0.33) % 1;
              ctx.beginPath();
              ctx.arc(lerp(a.tx, b2.tx, pt), lerp(a.ty, b2.ty, pt), 2.0, 0, 6.2832);
              ctx.fillStyle = rgba([214, 236, 255], 0.30 * seam); ctx.fill();
            }
          }
          ctx.globalCompositeOperation = 'source-over';
        }
      }
    };
  })();


  /* ====================================================================== */
  /*  LAS OCHO CAPACIDADES                                                  */
  /*  Una identidad, ocho instrumentos. Cada uno se apoya en una estructura  */
  /*  reconocible de lo que ESA capacidad hace, no en geometría decorativa.  */
  /* ====================================================================== */

  /* ====================================================================== */
  /*  Las ocho, con la misma materia que el resto del sitio. Cada una        */
  /*  conserva su idea; lo que cambia es que ahora se ve DE QUÉ está hecha.  */
  /* ====================================================================== */

  /* COMERCIAL — "El barrido". Un barrido recorre el campo; lo que encuentra
     deja de ser ruido y sale despedido como una trayectoria con destino. */
  INSTR.comercial = {
    build: function () { nube(small ? 200 : 420); },
    draw: function (tm) {
      clear(0.30);
      var sw = ((tm * 0.00013) % 1.35) - 0.18;
      materia(function (i, u, o) {
        var sem = sd(i, 21), sy = sd(i, 22);
        var bx = W * (0.05 + sem * 0.90), by = H * (0.10 + sy * 0.80);
        var d = (bx / W) - sw;
        var visto = clamp(-d / 0.16);                 // ya barrido
        var val = sd(i, 23) > 0.72;                   // y además, vale
        if (val && visto > 0.5) {
          /* Lo que vale sale disparado hacia el destino, no se queda. */
          var vv = ease((visto - 0.5) / 0.5);
          o.x = lerp(bx, W * 1.02, vv);
          o.y = lerp(by, H * (0.30 + sd(i, 24) * 0.36), vv);
          o.a = 0.50 * (1 - vv * 0.35); o.c = CI.cian; o.g = -1;
        } else {
          o.x = bx; o.y = by;
          o.a = 0.09 + 0.48 * Math.exp(-d * d * 120);
          o.c = CI.acero; o.g = -1;
        }
      }, tm);
      pinta(0);
      /* El frente del barrido: se ve por dónde va mirando. */
      ctx.globalCompositeOperation = 'lighter';
      var fx = (sw + 0.18) % 1.35 - 0.18;
      var g = ctx.createLinearGradient(fx * W - 40, 0, fx * W + 8, 0);
      g.addColorStop(0, rgba(C.cian, 0)); g.addColorStop(1, rgba(C.cian, 0.18));
      ctx.fillStyle = g; ctx.fillRect(fx * W - 40, 0, 48, H);
      ctx.globalCompositeOperation = 'source-over';
    }
  };

  /* MARKETING — "La propagación". Frentes que salen de unos emisores y
     encienden a quien alcanzan. Lo alcanzado ya no vuelve a apagarse. */
  INSTR.marketing = {
    build: function () { nube(small ? 200 : 440); },
    draw: function (tm) {
      clear(0.30);
      var EM = [[W * 0.16, H * 0.30], [W * 0.10, H * 0.72], [W * 0.30, H * 0.52]];
      var ondas = [];
      for (var e = 0; e < EM.length; e++) {
        ondas.push(((tm * 0.00016 + e * 0.33) % 1) * Math.max(W, H) * 1.15);
      }
      materia(function (i, u, o) {
        var bx = W * (0.06 + sd(i, 31) * 0.90), by = H * (0.08 + sd(i, 32) * 0.86);
        o.x = bx + Math.sin(tm * 0.0004 + i) * 1.4;
        o.y = by + Math.cos(tm * 0.0004 + i) * 1.4;
        var mejor = 0, tocado = 0;
        for (var k = 0; k < EM.length; k++) {
          var dx = bx - EM[k][0], dy = by - EM[k][1];
          var dist = Math.sqrt(dx * dx + dy * dy);
          var df = Math.abs(dist - ondas[k]);
          if (df < 26) mejor = Math.max(mejor, 1 - df / 26);
          if (dist < ondas[k]) tocado = 1;             // alcanzado: se queda
        }
        o.a = 0.08 + 0.30 * tocado + 0.62 * mejor;
        o.c = tocado ? CI.rosa : CI.acero;
        o.g = -1;
      }, tm);
      pinta(0);
    }
  };

  /* CLIENTES — "La continuidad". Cada cliente es una línea que no se corta,
     con sus hitos, y el sistema no olvida ninguno de los anteriores. */
  INSTR.clientes = {
    build: function () { nube(small ? 220 : 460); },
    draw: function (tm) {
      clear(0.30);
      var L = small ? 4 : 6, per = 0;
      materia(function (i, u, o) {
        per = NUB.length / L;
        var l = Math.min(L - 1, (i / per) | 0);
        var j = (i - l * per) / per;
        var ly = H * (0.16 + (l / (L - 1)) * 0.68);
        var av = ((tm * 0.00006) + l * 0.13) % 1;      // hasta dónde ha llegado
        o.x = W * (0.05 + j * 0.90);
        o.y = ly + Math.sin(j * 9 + l) * 3;
        var vivo = j <= av;
        /* Los hitos: momentos que quedan marcados y ya no se apagan. */
        var hito = Math.abs(Math.sin(j * 15.7 + l * 2)) > 0.985;
        o.a = vivo ? (hito ? 0.92 : 0.42) : 0.07;
        o.c = hito && vivo ? CI.verde : CI.turq;
        o.g = vivo ? 300 + l : -1;
      }, tm);
      pinta(0.12);
    }
  };

  /* PRODUCCIÓN — "El ensamblaje". Las piezas llegan por la cinta como nubes;
     al llegar a la estación no se posan enteras: sus partículas se desprenden
     y vuelan a la unidad que se monta, capa sobre capa. Y sale terminada. */
  INSTR.produccion = (function () {
    var CAPAS = 4;
    return {
      build: function () { nube(small ? 240 : narrow ? 420 : 640); },
      draw: function (tm) {
        clear(0.30);
        var beltY = H * 0.74, bx0 = W * 0.05, bx1 = W * 0.95;
        var est = bx0 + (bx1 - bx0) * 0.62;
        var ciclo = (tm * 0.00011) % 1;
        var per = NUB.length / (CAPAS + 1);

        materia(function (i, u, o) {
          var k = Math.min(CAPAS, (i / per) | 0);
          var j = (i - k * per) / per;

          if (k === CAPAS) {
            /* La pieza que todavía viaja hacia la estación. */
            var uu = (ciclo * 1.6 + j * 0.09) % 1.6;
            var w0 = (small ? 40 : 66);
            var px2 = bx0 + uu * (est - bx0);
            var pp = j * 4, e = pp | 0, f2 = pp - e, hw = w0 / 2, hh = 7;
            var lx, ly;
            if (e === 0)      { lx = -hw + f2 * w0; ly = -hh; }
            else if (e === 1) { lx =  hw;           ly = -hh + f2 * hh * 2; }
            else if (e === 2) { lx =  hw - f2 * w0; ly =  hh; }
            else              { lx = -hw;           ly =  hh - f2 * hh * 2; }
            o.x = px2 + lx; o.y = beltY - 12 + ly;
            o.a = uu < 1 ? 0.62 : 0;
            o.c = CI.ambar; o.g = uu < 1 ? 1200 : -1;
            return;
          }

          var apar = ease((ciclo - k * 0.17) / 0.15);
          var w2 = (small ? 46 : 78) - k * 7;
          var yk = beltY - 24 - k * 15;
          var pp2 = j * 4, e2 = pp2 | 0, f3 = pp2 - e2, hw2 = w2 / 2, hh2 = 6;
          var lx2, ly2;
          if (e2 === 0)      { lx2 = -hw2 + f3 * w2; ly2 = -hh2; }
          else if (e2 === 1) { lx2 =  hw2;           ly2 = -hh2 + f3 * hh2 * 2; }
          else if (e2 === 2) { lx2 =  hw2 - f3 * w2; ly2 =  hh2; }
          else               { lx2 = -hw2;           ly2 =  hh2 - f3 * hh2 * 2; }

          /* Antes de que le toque, esa materia todavía está en la cinta. */
          var vx = bx0 + (0.25 + j * 0.5) * (est - bx0), vy = beltY - 12;
          var sal = ease((ciclo - 0.86) / 0.14);
          o.x = lerp(lerp(vx, est + lx2, apar), est + lx2 + (bx1 + 80 - est) * sal, sal);
          o.y = lerp(vy, yk + ly2, apar);
          o.a = (0.20 + 0.62 * apar) * (1 - sal * 0.85);
          o.c = sal > 0.05 ? CI.verde : (apar > 0.98 ? CI.ambar : CI.blanco);
          o.g = apar > 0.35 ? 1100 + k : -1;
        }, tm);
        pinta(0.11);

        /* La cinta y la marca de la estación: la referencia fija. */
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = rgba(ACERO, 0.20); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(bx0, beltY); ctx.lineTo(bx1, beltY); ctx.stroke();
        for (var t = 0; t < 22; t++) {
          var tx = bx0 + (((t / 22) + (tm * 0.00008)) % 1) * (bx1 - bx0);
          ctx.beginPath(); ctx.moveTo(tx, beltY); ctx.lineTo(tx, beltY + 5);
          ctx.strokeStyle = rgba(ACERO, 0.13); ctx.stroke();
        }
        ctx.strokeStyle = rgba(C.ambar, 0.24);
        ctx.beginPath(); ctx.moveTo(est, beltY + 8); ctx.lineTo(est, beltY - 96); ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      }
    };
  })();

  /* FINANZAS — "El equilibrio". Lo que entra y lo que sale, en sentidos
     opuestos, y un fiel que busca su punto. */
  INSTR.finanzas = (function () {
    var nivel = 0.5;
    return {
      build: function () { nube(small ? 200 : 420); },
      draw: function (tm) {
        clear(0.30);
        var midY = H * 0.5;
        var ent = 0.5 + 0.5 * Math.sin(tm * 0.00035);
        var sal = 0.5 + 0.5 * Math.sin(tm * 0.00035 + 2.1);
        nivel += ((0.5 + (ent - sal) * 0.30) - nivel) * 0.02;
        materia(function (i, u, o) {
          var arriba = (i % 2) === 0;
          var j = sd(i, 41);
          var t = ((tm * (arriba ? 0.00022 : 0.00019)) + j) % 1;
          o.x = W * (arriba ? (0.06 + t * 0.88) : (0.94 - t * 0.88));
          o.y = midY + (arriba ? -1 : 1) * (24 + (i % 4) * 9);
          o.a = 0.16 + 0.62 * (arriba ? ent : sal) * Math.sin(t * 3.1416);
          o.c = arriba ? CI.verde : CI.rosa;
          o.g = -1;
        }, tm);
        pinta(0);
        /* El fiel: sube y baja buscando su punto, y la referencia fija. */
        ctx.globalCompositeOperation = 'lighter';
        var ly = midY + (nivel - 0.5) * H * 0.22;
        var g = ctx.createLinearGradient(W * 0.07, ly, W * 0.93, ly);
        g.addColorStop(0, rgba(C.azul, 0)); g.addColorStop(0.5, rgba(C.azul, 0.5));
        g.addColorStop(1, rgba(C.azul, 0));
        ctx.strokeStyle = g; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(W * 0.07, ly); ctx.lineTo(W * 0.93, ly); ctx.stroke();
        ctx.setLineDash([2, 6]);
        ctx.strokeStyle = rgba(ACERO, 0.13); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(W * 0.07, midY); ctx.lineTo(W * 0.93, midY); ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalCompositeOperation = 'source-over';
      }
    };
  })();

  /* SOPORTE — "La reparación". El servicio se rompe por algún punto y una
     pasada lo cierra. Lo reparado vuelve a ser continuo. */
  INSTR.soporte = {
    build: function () { nube(small ? 220 : 460); },
    draw: function (tm) {
      clear(0.30);
      var L = small ? 4 : 5;
      var pasada = ((tm * 0.00011) % 1.3) - 0.15;
      materia(function (i, u, o) {
        var per = NUB.length / L;
        var l = Math.min(L - 1, (i / per) | 0);
        var j = (i - l * per) / per;
        var ly = H * (0.18 + (l / (L - 1)) * 0.64);
        /* Las roturas: puntos concretos donde el servicio se corta. */
        var r1 = sd(l, 51), r2 = sd(l, 52);
        var roto = (Math.abs(j - r1) < 0.055) || (Math.abs(j - r2) < 0.045);
        var arreglado = j < pasada;                    // la pasada ya cerró aquí
        o.x = W * (0.05 + j * 0.90);
        o.y = ly + (roto && !arreglado ? (sd(i, 53) - 0.5) * 26 : 0);
        o.a = roto && !arreglado ? 0.22 : (arreglado ? 0.66 : 0.34);
        o.c = roto && !arreglado ? CI.rosa : (arreglado ? CI.verde : CI.acero);
        o.g = (roto && !arreglado) ? -1 : 400 + l;
      }, tm);
      pinta(0.13);
      /* El frente de la pasada, para que se vea reparar. */
      if (pasada > 0 && pasada < 1) {
        ctx.globalCompositeOperation = 'lighter';
        var g = ctx.createLinearGradient(W * (0.05 + pasada * 0.90) - 30, 0,
                                         W * (0.05 + pasada * 0.90), 0);
        g.addColorStop(0, rgba(C.verde, 0)); g.addColorStop(1, rgba(C.verde, 0.22));
        ctx.fillStyle = g;
        ctx.fillRect(W * (0.05 + pasada * 0.90) - 30, 0, 32, H);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
  };

  /* ADMINISTRACIÓN — "El archivo". Lo que llega cae, encuentra su casilla
     indexada y queda sellado. Orden y permanencia, no actividad. */
  INSTR.administracion = {
    build: function () { nube(small ? 200 : 420); },
    draw: function (tm) {
      clear(0.30);
      var cols = small ? 4 : 7, rows = 5, S = cols * rows;
      var gw = W * 0.84, gh = H * 0.64, ox = W * 0.08, oy = H * 0.18;
      var cw = gw / cols, ch = gh / rows;
      materia(function (i, u, o) {
        var k = i % S;
        var c = k % cols, r = (k / cols) | 0;
        var tx = ox + (c + 0.5) * cw, ty = oy + (r + 0.5) * ch;
        /* Cada casilla se archiva por turno y ya no se mueve más. */
        var turno = ((tm * 0.00008) % 1) * S;
        var arch = clamp((turno - k) / 2.2);
        var caida = ease(arch);
        o.x = tx + ((i / S) | 0) % 3 * 5 - 5;
        o.y = lerp(oy - H * 0.22, ty, caida) + (((i / S) | 0) % 3) * 4 - 4;
        o.a = 0.10 + 0.56 * caida;
        o.c = arch >= 1 ? CI.lav : CI.acero;
        o.g = -1;
      }, tm);
      pinta(0);
      /* Las casillas del archivo: la estructura que da el orden. */
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = rgba(ACERO, 0.10); ctx.lineWidth = 1;
      for (var c2 = 0; c2 <= cols; c2++) {
        ctx.beginPath(); ctx.moveTo(ox + c2 * cw, oy); ctx.lineTo(ox + c2 * cw, oy + gh); ctx.stroke();
      }
      for (var r2 = 0; r2 <= rows; r2++) {
        ctx.beginPath(); ctx.moveTo(ox, oy + r2 * ch); ctx.lineTo(ox + gw, oy + r2 * ch); ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
  };

  /* DIRECCIÓN — "La lectura del conjunto". Todo el sistema en miniatura y un
     retículo que se posa sobre una parte y la lee. Ver el todo y decidir. */
  INSTR.direccion = {
    build: function () { nube(small ? 220 : 480); },
    draw: function (tm) {
      clear(0.30);
      var cols = small ? 2 : 4, rows = small ? 3 : 3, S = cols * rows;
      var gw = W * 0.86, gh = H * 0.68, ox = W * 0.07, oy = H * 0.16;
      var pw = gw / cols, ph = gh / rows;
      var foco = Math.floor(((tm * 0.00013) % 1) * S);
      materia(function (i, u, o) {
        var k = i % S;
        var c = k % cols, r = (k / cols) | 0;
        var px2 = ox + c * pw, py2 = oy + r * ph;
        var j = ((i / S) | 0) / Math.max(1, (NUB.length / S));
        /* Cada panel tiene su propia actividad: una lectura, no un adorno. */
        var v = 0.5 + 0.5 * Math.sin(j * 9 + k * 2 + tm * 0.0006);
        o.x = px2 + pw * (0.12 + j * 0.76);
        o.y = py2 + ph * (0.74 - v * 0.48);
        var mira = (k === foco);
        o.a = mira ? 0.86 : 0.20;
        o.c = mira ? CI.cian : CI.acero;
        o.g = 500 + k;
      }, tm);
      pinta(0.10);
      /* El retículo: se posa sobre una parte cada vez. */
      ctx.globalCompositeOperation = 'lighter';
      var fc = foco % cols, fr = (foco / cols) | 0;
      var fx2 = ox + fc * pw, fy2 = oy + fr * ph;
      ctx.strokeStyle = rgba(C.cian, 0.42); ctx.lineWidth = 1.2;
      var m = 10;
      [[0,0,1,0],[0,0,0,1],[1,0,-1,0],[1,0,0,1],
       [0,1,1,0],[0,1,0,-1],[1,1,-1,0],[1,1,0,-1]].forEach(function (q) {
        var X = fx2 + q[0] * pw, Y = fy2 + q[1] * ph;
        ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(X + q[2] * m, Y + q[3] * m); ctx.stroke();
      });
      ctx.globalCompositeOperation = 'source-over';
    }
  };

  /* ------------------------------------------------------------ ARRANQUE */
  inst = INSTR[NAME];
  if (!inst) return;

  function readScroll() {
    var d = document.documentElement;
    var max = Math.max(1, d.scrollHeight - window.innerHeight);
    P = Math.max(0, Math.min(1, window.scrollY / max));
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { readScroll(); ticking = false; if (reduced) still(); });
  }, { passive: true });

  if (!coarse) {
    window.addEventListener('mousemove', function (e) {
      mx = (e.clientX - OFFX) / Math.max(1, W); my = (e.clientY - OFFY) / Math.max(1, H);
      if (inst.move) inst.move();
    }, { passive: true });
  }

  measure(); readScroll(); Pv = P;

  /* Movimiento reducido: una sola imagen, y tomada en un instante que
     REPRESENTE al instrumento. Dibujarla en el instante cero dejaba en
     blanco a los que tienen un ciclo (el ensamblaje, el archivo, la
     reparación): todavía no había ocurrido nada que enseñar. */
  function still() {
    Pv = P;
    ctx.save(); ctx.translate(OFFX, OFFY); inst.draw(6000); ctx.restore();
    ctx.save(); ctx.translate(OFFX, OFFY); inst.draw(6120); ctx.restore();
  }

  var running = false, visible = true;
  function loop(tm) {
    if (!running) return;
    Pv += (P - Pv) * 0.08;
    cmx += (mx - cmx) * 0.08; cmy += (my - cmy) * 0.08;
    ctx.save(); ctx.translate(OFFX, OFFY);
    inst.draw(tm);
    ctx.restore();
    if (visible) requestAnimationFrame(loop); else running = false;
  }
  function start() { if (!running && !reduced) { running = true; requestAnimationFrame(loop); } }
  if (reduced) still(); else start();

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { measure(); readScroll(); if (reduced) still(); }, 180);
  }, { passive: true });
  document.addEventListener('visibilitychange', function () {
    visible = !document.hidden; if (visible) start();
  });
})();
