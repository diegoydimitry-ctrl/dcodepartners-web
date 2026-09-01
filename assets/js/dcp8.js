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
    // Un cable trenzado bajo carga, no tres líneas decorativas.
    // Un cable real es lo único que reúne a la vez las seis cosas que
    // tiene que transmitir esta página: profundidad (unas hebras pasan
    // por detrás de otras), cruce (se trenzan de verdad), unión (entran
    // tres y sale uno), tensión (el conjunto tira), continuidad (el cable
    // viene de antes del encuadre y sigue después) y — la importante —
    // dependencia: cuando una hebra afloja, las otras toman su carga.
    var HUES = [], LAY = 0;
    return {
      build: function () {
        HUES = [C.cian, C.violeta, C.rosa];
        LAY = 7.4;                       // paso de cableado
      },
      draw: function (tm) {
        clear(0.26);
        // El cable vive en su propia banda: no cruza la columna de texto.
        var cx = W * (narrow ? 0.5 : 0.80);
        var spread = W * (narrow ? 0.17 : 0.085);
        var step = small ? 0.020 : 0.010;
        var tense = win(0.04, 0.72);     // el cable se tensa al recorrer

        // Turno de carga: una hebra afloja y las otras dos la sostienen.
        var cyc = (tm * 0.00013) % 1;
        var flojo = Math.floor(cyc * 3);
        var cede = Math.sin(((cyc * 3) % 1) * Math.PI);

        function radio(u) { return spread * (1 - 0.62 * ease(u) * tense); }
        function fase(u, si) { return u * LAY + si * 2.0944 + tm * 0.00022; }
        function equis(u, si) {
          var s2 = si === flojo ? 1 + 0.42 * cede : 1 - 0.16 * cede;
          return cx + Math.cos(fase(u, si)) * radio(u) * s2;
        }

        // El cable entra por encima del encuadre y sale por debajo: no
        // empieza aquí ni termina aquí.
        for (var si = 0; si < 3; si++) {
          var suelta = si === flojo ? cede : 0;
          var carga  = si === flojo ? 0 : cede;   // las que sostienen
          for (var u = -0.12; u <= 1.12; u += step) {
            var u2 = u + step;
            var x1 = equis(u, si), x2 = equis(u2, si);
            var y1 = u * H, y2 = u2 * H;
            var d = Math.sin(fase(u, si));        // >0 pasa por delante
            var frente = d > 0;
            var a = (frente ? 0.22 : 0.06) + 0.08 * tense
                  + 0.10 * carga - 0.09 * suelta;
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
            ctx.strokeStyle = rgba(HUES[si], Math.max(0.04, a));
            ctx.lineWidth = (frente ? 1.8 : 1.0) + 0.4 * carga;
            ctx.stroke();
          }
        }

        // Las ataduras: cada cierto tramo el haz queda ceñido. Es lo que
        // convierte tres hebras sueltas en un solo cable.
        var paso = 0.145;
        for (var b = paso; b < 1.1; b += paso) {
          var ap = ease((tense - (b - 0.1) * 0.5) / 0.35);
          if (ap <= 0) continue;
          var xs = [equis(b, 0), equis(b, 1), equis(b, 2)];
          var izq = Math.min(xs[0], xs[1], xs[2]) - 4;
          var der = Math.max(xs[0], xs[1], xs[2]) + 4;
          var yb = b * H;
          ctx.strokeStyle = rgba([214, 236, 255], 0.09 * ap);
          ctx.lineWidth = 1;
          for (var k = 0; k < 3; k++) {
            var yy = yb + (k - 1) * 3;
            ctx.beginPath(); ctx.moveTo(izq, yy); ctx.lineTo(der, yy); ctx.stroke();
          }
        }

        // La carga que recorre el cable de arriba abajo: se ve que tira.
        var lp = ((tm * 0.00019) % 1) * 1.2 - 0.1;
        for (var si2 = 0; si2 < 3; si2++) {
          if (si2 === flojo) continue;               // la floja no transmite
          var xg = equis(lp, si2), yg = lp * H;
          if (Math.sin(fase(lp, si2)) <= 0) continue; // solo si va por delante
          var g = ctx.createLinearGradient(xg, yg - 26, xg, yg + 26);
          g.addColorStop(0, rgba(HUES[si2], 0));
          g.addColorStop(0.5, rgba(HUES[si2], 0.26 * tense));
          g.addColorStop(1, rgba(HUES[si2], 0));
          ctx.strokeStyle = g; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(xg, yg - 26); ctx.lineTo(xg, yg + 26); ctx.stroke();
        }
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
    var tiles = [];
    return {
      build: function () {
        tiles.length = 0;
        // Ocho piezas: una retícula 4x2 (o 2x4 en vertical) como destino.
        var cols = narrow ? 2 : 4, rows = narrow ? 4 : 2;
        var gw = (narrow ? W * 0.78 : W * 0.56), gh = (narrow ? H * 0.46 : H * 0.40);
        var ox = (W - gw) / 2, oy = (H - gh) / 2;
        var cw = gw / cols, ch = gh / rows;
        for (var i = 0; i < cols * rows; i++) {
          var c = i % cols, r = Math.floor(i / cols);
          tiles.push({
            i: i,
            tx: ox + c * cw + cw / 2, ty: oy + r * ch + ch / 2,
            w: cw, h: ch,
            // Origen: dispersas, giradas y a distinta escala.
            sx: W * (0.06 + sd(i, 2) * 0.88), sy: H * (0.08 + sd(i, 3) * 0.84),
            rot: (sd(i, 4) - 0.5) * 2.2, sc: 0.45 + sd(i, 5) * 0.5,
            hue: [C.cian, C.rosa, C.verde, C.ambar, C.azul, C.turq, C.lav, C.violeta][i % 8]
          });
        }
      },
      draw: function (tm) {
        clear(0.30);
        var fit = win(0.02, 0.58);                 // el encaje ocurre al bajar
        var e = ease(fit);
        for (var i = 0; i < tiles.length; i++) {
          var t = tiles[i];
          // Cada pieza encaja con un pequeño desfase: se ve el ensamblaje.
          var raw = Math.max(0, Math.min(1, (fit - i * 0.045) / 0.5));
          // Rebote de asentamiento: la pieza sobrepasa su hueco y vuelve.
          // Encajar cuesta; si entra sin resistencia no se percibe el encaje.
          var f = raw < 1
            ? ease(raw) + Math.sin(raw * Math.PI) * 0.10 * Math.sin(raw * 12 + i)
            : 1;
          var x = lerp(t.sx, t.tx, f), y = lerp(t.sy, t.ty, f);
          // Y gira hasta el último momento, resistiéndose a alinearse.
          var rot = lerp(t.rot, 0, ease(Math.pow(raw, 1.6)))
                  + (1 - raw) * Math.sin(tm * 0.0006 + i) * 0.16;
          var sc = lerp(t.sc, 1, f);
          var w = t.w * sc, h = t.h * sc;

          ctx.save();
          ctx.translate(x, y); ctx.rotate(rot);
          // Cuerpo: apenas un tinte, para que manden los filos.
          var g = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
          g.addColorStop(0, rgba(t.hue, 0.030 + 0.034 * f));
          g.addColorStop(1, rgba(t.hue, 0.008));
          ctx.fillStyle = g;
          ctx.fillRect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6);
          // Filo: nítido cuando la pieza ya está en su sitio.
          ctx.strokeStyle = rgba(t.hue, 0.16 + 0.30 * f);
          ctx.lineWidth = 1;
          ctx.strokeRect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6);
          // Muescas de encaje: aparecen ANTES de que la pieza llegue, para
          // que se vea por dónde va a unirse.
          if (raw > 0.18) {
            ctx.strokeStyle = rgba(t.hue, 0.12 + 0.26 * raw);
            ctx.beginPath();
            ctx.moveTo(w / 2 - 3, -9); ctx.lineTo(w / 2 - 3 + 8 * raw, 0); ctx.lineTo(w / 2 - 3, 9);
            ctx.moveTo(-w / 2 + 3, -9); ctx.lineTo(-w / 2 + 3 + 8 * raw, 0); ctx.lineTo(-w / 2 + 3, 9);
            ctx.stroke();
          }
          ctx.restore();
        }
        // Las costuras: solo existen cuando las piezas ya se tocan.
        if (e > 0.72) {
          var seam = (e - 0.72) / 0.28;
          for (var k = 0; k < tiles.length; k++) {
            for (var j = k + 1; j < tiles.length; j++) {
              var a = tiles[k], b2 = tiles[j];
              var dx = Math.abs(a.tx - b2.tx), dy = Math.abs(a.ty - b2.ty);
              var vecina = (dx < a.w * 1.1 && dy < 2) || (dy < a.h * 1.1 && dx < 2);
              if (!vecina) continue;
              ctx.beginPath();
              ctx.moveTo(a.tx, a.ty); ctx.lineTo(b2.tx, b2.ty);
              ctx.strokeStyle = rgba([200, 224, 255], 0.22 * seam);
              ctx.lineWidth = 1; ctx.stroke();
              var pt = ((tm * 0.0004) + k * 0.2) % 1;
              ctx.beginPath();
              ctx.arc(lerp(a.tx, b2.tx, pt), lerp(a.ty, b2.ty, pt), 1.8, 0, 6.2832);
              ctx.fillStyle = rgba([214, 236, 255], 0.6 * seam); ctx.fill();
            }
          }
        }
      }
    };
  })();


  /* ====================================================================== */
  /*  LAS OCHO CAPACIDADES                                                  */
  /*  Una identidad, ocho instrumentos. Cada uno se apoya en una estructura  */
  /*  reconocible de lo que ESA capacidad hace, no en geometría decorativa.  */
  /* ====================================================================== */

  /* COMERCIAL — "El barrido". Un barrido recorre el campo; lo que encuentra
     queda acotado y sale convertido en una trayectoria. Detectar y convertir. */
  INSTR.comercial = (function () {
    var marks = [], shots = [];
    return {
      build: function () {
        marks.length = 0; shots.length = 0;
        var n = small ? 16 : 40;
        for (var i = 0; i < n; i++) {
          marks.push({ x: W * (0.06 + sd(i, 2) * 0.60), y: H * (0.10 + sd(i, 3) * 0.80),
                       hot: sd(i, 4) > 0.76, seen: 0 });
        }
      },
      draw: function (tm) {
        clear(0.30);
        var sweep = ((tm * 0.00011) % 1) * W * 0.72;
        // El barrido.
        var g = ctx.createLinearGradient(sweep - 90, 0, sweep, 0);
        g.addColorStop(0, rgba(C.cian, 0)); g.addColorStop(1, rgba(C.cian, 0.40));
        ctx.strokeStyle = g; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(sweep, H * 0.06); ctx.lineTo(sweep, H * 0.94); ctx.stroke();

        for (var i = 0; i < marks.length; i++) {
          var m = marks[i];
          if (m.seen < 1 && Math.abs(m.x - sweep) < 4) {
            m.seen = 1;
            if (m.hot) shots.push({ x: m.x, y: m.y, u: 0, ty: H * (0.3 + sd(i, 9) * 0.4) });
          }
          if (sweep < m.x - 20) m.seen = 0;
          ctx.beginPath(); ctx.arc(m.x, m.y, m.hot ? 2.2 : 1.4, 0, 6.2832);
          ctx.fillStyle = rgba(m.hot ? C.cian : [130, 150, 190], m.hot ? 0.72 : 0.34); ctx.fill();
          // Lo que importa queda acotado entre marcas: se ha encontrado algo.
          if (m.hot && m.seen) {
            ctx.strokeStyle = rgba(C.cian, 0.52); ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(m.x - 9, m.y - 5); ctx.lineTo(m.x - 9, m.y + 5);
            ctx.moveTo(m.x + 9, m.y - 5); ctx.lineTo(m.x + 9, m.y + 5); ctx.stroke();
          }
        }
        // Y sale convertido en una conversación.
        for (var k = shots.length - 1; k >= 0; k--) {
          var sh = shots[k]; sh.u += 0.006;
          if (sh.u > 1) { shots.splice(k, 1); continue; }
          var x = lerp(sh.x, W * 0.94, ease(sh.u)), y = lerp(sh.y, sh.ty, ease(sh.u));
          ctx.beginPath(); ctx.moveTo(lerp(sh.x, W * 0.94, ease(Math.max(0, sh.u - 0.08))),
                                      lerp(sh.y, sh.ty, ease(Math.max(0, sh.u - 0.08))));
          ctx.lineTo(x, y);
          ctx.strokeStyle = rgba(C.violeta, 0.5 * (1 - sh.u)); ctx.lineWidth = 1.6; ctx.stroke();
          ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 6.2832);
          ctx.fillStyle = rgba([220, 240, 255], 0.7 * (1 - sh.u)); ctx.fill();
        }
      }
    };
  })();

  /* MARKETING — "La propagación". Frentes de onda que salen de unos emisores
     y encienden a quien alcanzan. Lo alcanzado ya no se apaga. */
  INSTR.marketing = (function () {
    var rx = [], em = [];
    return {
      build: function () {
        rx.length = 0; em.length = 0;
        var n = small ? 40 : 130;
        for (var i = 0; i < n; i++) rx.push({ x: W * sd(i, 2), y: H * sd(i, 3), lit: 0 });
        em.push({ x: W * 0.18, y: H * 0.30, t: 0.0 });
        em.push({ x: W * 0.30, y: H * 0.72, t: 0.4 });
        if (!small) em.push({ x: W * 0.12, y: H * 0.55, t: 0.75 });
      },
      draw: function (tm) {
        clear(0.26);
        var R = Math.max(W, H) * 1.2;
        for (var e = 0; e < em.length; e++) {
          var E = em[e];
          for (var w2 = 0; w2 < 3; w2++) {
            var u = (((tm * 0.00009) + E.t + w2 * 0.33) % 1);
            var rad = u * R;
            ctx.beginPath(); ctx.arc(E.x, E.y, rad, 0, 6.2832);
            ctx.strokeStyle = rgba(C.rosa, 0.26 * (1 - u)); ctx.lineWidth = 1.4; ctx.stroke();
            for (var i2 = 0; i2 < rx.length; i2++) {
              var p2 = rx[i2];
              var d = Math.hypot(p2.x - E.x, p2.y - E.y);
              if (Math.abs(d - rad) < 7) p2.lit = 1;
            }
          }
          ctx.beginPath(); ctx.arc(E.x, E.y, 3, 0, 6.2832);
          ctx.fillStyle = rgba(C.rosa, 0.7); ctx.fill();
        }
        for (var i3 = 0; i3 < rx.length; i3++) {
          var p3 = rx[i3];
          p3.lit *= 0.9975;                       // el alcance se mantiene
          ctx.beginPath(); ctx.arc(p3.x, p3.y, 1.3 + p3.lit * 1.1, 0, 6.2832);
          ctx.fillStyle = rgba(p3.lit > 0.15 ? C.rosa : [122, 140, 178], 0.26 + p3.lit * 0.55);
          ctx.fill();
        }
      }
    };
  })();

  /* CLIENTES — "La continuidad". Hilos que no se cortan: cada cliente es una
     línea de tiempo con sus hitos, y el sistema recuerda todos los anteriores. */
  INSTR.clientes = (function () {
    var lines = [];
    return {
      build: function () {
        lines.length = 0;
        var n = small ? 5 : 9;
        for (var i = 0; i < n; i++) {
          var ev = [];
          for (var k = 0; k < 6; k++) ev.push(0.08 + sd(i * 7 + k, 5) * 0.84);
          ev.sort();
          lines.push({ y: H * (0.12 + (i / (n - 1)) * 0.76), ev: ev, hue: [C.verde, C.turq, C.cian][i % 3] });
        }
      },
      draw: function (tm) {
        clear(0.28);
        var now = ((tm * 0.00007) % 1);
        for (var i = 0; i < lines.length; i++) {
          var L = lines[i];
          // La línea completa existe siempre: la relación no empieza de cero.
          ctx.beginPath(); ctx.moveTo(W * 0.05, L.y); ctx.lineTo(W * 0.95, L.y);
          ctx.strokeStyle = rgba(L.hue, 0.24); ctx.lineWidth = 1.2; ctx.stroke();
          // Lo ya vivido queda marcado, con más peso cuanto más reciente.
          ctx.beginPath(); ctx.moveTo(W * 0.05, L.y); ctx.lineTo(lerp(W * 0.05, W * 0.95, now), L.y);
          ctx.strokeStyle = rgba(L.hue, 0.58); ctx.lineWidth = 1.9; ctx.stroke();
          for (var k2 = 0; k2 < L.ev.length; k2++) {
            var ex = lerp(W * 0.05, W * 0.95, L.ev[k2]);
            var past = L.ev[k2] <= now;
            ctx.beginPath(); ctx.arc(ex, L.y, past ? 3 : 2, 0, 6.2832);
            ctx.fillStyle = rgba(L.hue, past ? 0.78 : 0.24); ctx.fill();
            if (past) {   // memoria: cada hito deja su marca hacia atrás
              ctx.beginPath(); ctx.moveTo(ex, L.y - 6); ctx.lineTo(ex, L.y + 6);
              ctx.strokeStyle = rgba(L.hue, 0.20); ctx.lineWidth = 1; ctx.stroke();
            }
          }
          var hx = lerp(W * 0.05, W * 0.95, now);
          ctx.beginPath(); ctx.arc(hx, L.y, 2.4, 0, 6.2832);
          ctx.fillStyle = rgba([220, 245, 255], 0.75); ctx.fill();
        }
      }
    };
  })();

  /* PRODUCCIÓN — "El ensamblaje". Piezas que entran por la cinta y se montan
     una sobre otra hasta que la unidad sale terminada. Y vuelta a empezar. */
  INSTR.produccion = (function () {
    var cycle = 0;
    return {
      build: function () {},
      draw: function (tm) {
        clear(0.30);
        var beltY = H * 0.80, bx0 = W * 0.06, bx1 = W * 0.94;
        // La cinta.
        ctx.strokeStyle = rgba([140, 162, 205], 0.26); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(bx0, beltY); ctx.lineTo(bx1, beltY); ctx.stroke();
        for (var t = 0; t < 26; t++) {
          var tx = bx0 + ((t / 26 + (tm * 0.00013)) % 1) * (bx1 - bx0);
          ctx.beginPath(); ctx.moveTo(tx, beltY); ctx.lineTo(tx, beltY + 6);
          ctx.strokeStyle = rgba([140, 162, 205], 0.20); ctx.stroke();
        }
        var u = ((tm * 0.00011) % 1);
        var station = W * 0.55;
        var PARTS = small ? 4 : 6;
        // Piezas entrando y apilándose en la estación de montaje.
        for (var i = 0; i < PARTS; i++) {
          var pu = (u * PARTS - i);
          if (pu < 0) continue;
          var w2 = (small ? 46 : 76) - i * 6, h2 = 12;
          if (pu < 1) {
            var px = lerp(bx0, station, ease(pu));
            ctx.strokeStyle = rgba(C.ambar, 0.58); ctx.lineWidth = 1.3;
            ctx.strokeRect(px - w2 / 2, beltY - h2 - 3, w2, h2);
          } else {
            var stackY = beltY - 15 - i * (h2 + 4);
            ctx.fillStyle = rgba(C.ambar, 0.09); ctx.fillRect(station - w2 / 2, stackY, w2, h2);
            ctx.strokeStyle = rgba(C.ambar, 0.56); ctx.lineWidth = 1.3;
            ctx.strokeRect(station - w2 / 2, stackY, w2, h2);
            // El punto de unión de cada pieza con la anterior.
            if (i > 0) { ctx.beginPath(); ctx.arc(station, stackY + h2, 1.8, 0, 6.2832);
              ctx.fillStyle = rgba([235, 245, 255], 0.6); ctx.fill(); }
          }
        }
        // La unidad terminada sale por la derecha.
        if (u > 0.86) {
          var ou = (u - 0.86) / 0.14;
          var ox2 = lerp(station, bx1 + 60, ease(ou));
          ctx.globalAlpha = 1 - ou;
          for (var j = 0; j < PARTS; j++) {
            var jw = (small ? 46 : 76) - j * 6;
            ctx.strokeStyle = rgba(C.verde, 0.5); ctx.lineWidth = 1.2;
            ctx.strokeRect(ox2 - jw / 2, beltY - 15 - j * 16, jw, 12);
          }
          ctx.globalAlpha = 1;
        }
      }
    };
  })();

  /* FINANZAS — "El equilibrio". Lo que entra y lo que sale, en sentidos
     opuestos, y un nivel que busca su punto de equilibrio. */
  INSTR.finanzas = (function () {
    var level = 0.5;
    return {
      build: function () {},
      draw: function (tm) {
        clear(0.28);
        var midY = H * 0.5, span = W * 0.86, x0 = W * 0.07;
        var inFlow = 0.5 + 0.5 * Math.sin(tm * 0.00035);
        var outFlow = 0.5 + 0.5 * Math.sin(tm * 0.00035 + 2.1);
        level += ((0.5 + (inFlow - outFlow) * 0.3) - level) * 0.02;

        // Entradas: hacia la derecha, por arriba.
        for (var i = 0; i < (small ? 10 : 22); i++) {
          var u = ((tm * 0.00022) + i / 22) % 1;
          var y = midY - 26 - (i % 3) * 9;
          ctx.beginPath(); ctx.moveTo(x0 + u * span - 14, y); ctx.lineTo(x0 + u * span, y);
          ctx.strokeStyle = rgba(C.verde, 0.48 * inFlow); ctx.lineWidth = 1.5; ctx.stroke();
        }
        // Salidas: hacia la izquierda, por abajo.
        for (var k = 0; k < (small ? 10 : 22); k++) {
          var u2 = ((tm * 0.00019) + k / 22) % 1;
          var y2 = midY + 26 + (k % 3) * 9;
          ctx.beginPath(); ctx.moveTo(x0 + span - u2 * span + 14, y2); ctx.lineTo(x0 + span - u2 * span, y2);
          ctx.strokeStyle = rgba(C.rosa, 0.44 * outFlow); ctx.lineWidth = 1.5; ctx.stroke();
        }
        // El fiel de la balanza.
        var ly = midY + (level - 0.5) * H * 0.22;
        var g = ctx.createLinearGradient(x0, ly, x0 + span, ly);
        g.addColorStop(0, rgba(C.azul, 0)); g.addColorStop(0.5, rgba(C.azul, 0.5)); g.addColorStop(1, rgba(C.azul, 0));
        ctx.strokeStyle = g; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x0, ly); ctx.lineTo(x0 + span, ly); ctx.stroke();
        ctx.setLineDash([2, 6]);
        ctx.strokeStyle = rgba([150, 174, 245], 0.14); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x0, midY); ctx.lineTo(x0 + span, midY); ctx.stroke();
        ctx.setLineDash([]);
      }
    };
  })();

  /* SOPORTE — "La reparación". Aparecen roturas en el servicio y una pasada
     las cierra. Lo reparado vuelve a ser continuo. */
  INSTR.soporte = (function () {
    var lines2 = [];
    return {
      build: function () {
        lines2.length = 0;
        var n = small ? 7 : 13;
        for (var i = 0; i < n; i++) {
          lines2.push({ y: H * (0.10 + (i / (n - 1)) * 0.80),
                        brk: sd(i, 3) * 0.7 + 0.15, w: 0.05 + sd(i, 4) * 0.10,
                        fix: 0, next: sd(i, 5) });
        }
      },
      draw: function (tm) {
        clear(0.30);
        var pass = ((tm * 0.00013) % 1);
        for (var i = 0; i < lines2.length; i++) {
          var L = lines2[i];
          var a = W * 0.06, b = W * 0.94;
          var b0 = lerp(a, b, L.brk), b1 = lerp(a, b, L.brk + L.w);
          // La pasada de reparación va cerrando lo que encuentra roto.
          if (Math.abs(pass - L.brk) < 0.02) L.fix = 1;
          if (pass < 0.03) L.fix *= 0.0;
          var closed = L.fix;
          ctx.strokeStyle = rgba(closed > 0.5 ? C.verde : [150, 170, 210], closed > 0.5 ? 0.44 : 0.28);
          ctx.lineWidth = 1.3;
          if (closed > 0.5) {
            ctx.beginPath(); ctx.moveTo(a, L.y); ctx.lineTo(b, L.y); ctx.stroke();
            ctx.beginPath(); ctx.arc((b0 + b1) / 2, L.y, 3.2, 0, 6.2832);
            ctx.strokeStyle = rgba(C.verde, 0.42); ctx.stroke();
          } else {
            ctx.beginPath(); ctx.moveTo(a, L.y); ctx.lineTo(b0, L.y); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(b1, L.y); ctx.lineTo(b, L.y); ctx.stroke();
            ctx.strokeStyle = rgba([255, 120, 140], 0.42); ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(b0, L.y - 5); ctx.lineTo(b0 + 5, L.y + 5);
            ctx.moveTo(b1, L.y - 5); ctx.lineTo(b1 - 5, L.y + 5); ctx.stroke();
          }
        }
        var px = lerp(W * 0.06, W * 0.94, pass);
        var g = ctx.createLinearGradient(px, 0, px + 40, 0);
        g.addColorStop(0, rgba(C.turq, 0.34)); g.addColorStop(1, rgba(C.turq, 0));
        ctx.strokeStyle = g; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(px, H * 0.06); ctx.lineTo(px, H * 0.94); ctx.stroke();
      }
    };
  })();

  /* ADMINISTRACIÓN — "El archivo". Lo que llega cae, se coloca en su casilla
     indexada y queda sellado. Orden y permanencia. */
  INSTR.administracion = (function () {
    var slots = [], drops = [];
    return {
      build: function () {
        slots.length = 0; drops.length = 0;
        var cols = small ? 4 : 9, rows = small ? 7 : 6;
        var gw = W * 0.80, gh = H * 0.56, ox = (W - gw) / 2, oy = H * 0.30;
        for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
          slots.push({ x: ox + (c + 0.5) * (gw / cols), y: oy + (r + 0.5) * (gh / rows),
                       w: gw / cols - 6, h: gh / rows - 5, full: 0 });
        }
      },
      draw: function (tm) {
        clear(0.32);
        if (drops.length < 5 && Math.random() < 0.05) {
          var free = [];
          for (var i = 0; i < slots.length; i++) if (!slots[i].full) free.push(i);
          if (free.length) drops.push({ s: free[Math.floor(Math.random() * free.length)],
                                        x: W * (0.1 + Math.random() * 0.8), y: -20, u: 0 });
        }
        for (var k = 0; k < slots.length; k++) {
          var s2 = slots[k];
          ctx.strokeStyle = rgba([140, 164, 210], s2.full ? 0.38 : 0.19); ctx.lineWidth = 1;
          ctx.strokeRect(s2.x - s2.w / 2, s2.y - s2.h / 2, s2.w, s2.h);
          if (s2.full) {
            ctx.fillStyle = rgba(C.lav, 0.10); ctx.fillRect(s2.x - s2.w / 2, s2.y - s2.h / 2, s2.w, s2.h);
            // Sello: lo archivado queda cerrado.
            ctx.strokeStyle = rgba(C.lav, 0.50); ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(s2.x - 4, s2.y); ctx.lineTo(s2.x - 1, s2.y + 3); ctx.lineTo(s2.x + 5, s2.y - 3);
            ctx.stroke();
          }
        }
        for (var d = drops.length - 1; d >= 0; d--) {
          var D = drops[d], S = slots[D.s];
          D.u += 0.016;
          if (D.u >= 1) { S.full = 1; drops.splice(d, 1); continue; }
          var x = lerp(D.x, S.x, ease(D.u)), y = lerp(-20, S.y, ease(D.u));
          ctx.strokeStyle = rgba(C.lav, 0.55); ctx.lineWidth = 1.2;
          ctx.strokeRect(x - 7, y - 5, 14, 10);
        }
      }
    };
  })();

  /* DIRECCIÓN — "La lectura del conjunto". Todo el sistema en miniatura y un
     retículo que se posa sobre una parte y la lee. Ver el todo y decidir. */
  INSTR.direccion = (function () {
    var cells = [], focus = 0, hold = 0;
    return {
      build: function () {
        cells.length = 0;
        var cols = small ? 3 : 6, rows = small ? 4 : 3;
        var gw = W * 0.78, gh = H * 0.56, ox = (W - gw) / 2, oy = H * 0.24;
        for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
          cells.push({ x: ox + (c + 0.5) * (gw / cols), y: oy + (r + 0.5) * (gh / rows),
                       w: gw / cols * 0.82, h: gh / rows * 0.72,
                       hue: [C.cian, C.rosa, C.verde, C.ambar, C.azul, C.turq][(r * cols + c) % 6],
                       k: sd(r * cols + c, 3) });
        }
        focus = 0; hold = 0;
      },
      draw: function (tm) {
        clear(0.30);
        hold++;
        if (hold > 150) { hold = 0; focus = (focus + 1) % Math.max(1, cells.length); }
        for (var i = 0; i < cells.length; i++) {
          var c = cells[i], on = i === focus;
          ctx.strokeStyle = rgba(c.hue, on ? 0.50 : 0.20); ctx.lineWidth = 1;
          ctx.strokeRect(c.x - c.w / 2, c.y - c.h / 2, c.w, c.h);
          // Cada parte muestra su propia actividad en pequeño.
          var bars = 5;
          for (var b = 0; b < bars; b++) {
            var v = 0.2 + 0.8 * Math.abs(Math.sin(tm * 0.0008 + i * 1.3 + b));
            var bh = (c.h - 12) * v * 0.5;
            ctx.fillStyle = rgba(c.hue, on ? 0.48 : 0.22);
            ctx.fillRect(c.x - c.w / 2 + 7 + b * ((c.w - 14) / bars),
                         c.y + c.h / 2 - 6 - bh, Math.max(2, (c.w - 14) / bars - 3), bh);
          }
        }
        // El retículo: mirar es elegir dónde mirar.
        var f = cells[focus]; if (!f) return;
        var e = ease(Math.min(1, hold / 24));
        ctx.strokeStyle = rgba([210, 232, 255], 0.42 * e); ctx.lineWidth = 1;
        var R = 14;
        ctx.beginPath();
        ctx.moveTo(f.x - f.w / 2 - 6, f.y - f.h / 2 - 6 + R); ctx.lineTo(f.x - f.w / 2 - 6, f.y - f.h / 2 - 6); ctx.lineTo(f.x - f.w / 2 - 6 + R, f.y - f.h / 2 - 6);
        ctx.moveTo(f.x + f.w / 2 + 6 - R, f.y - f.h / 2 - 6); ctx.lineTo(f.x + f.w / 2 + 6, f.y - f.h / 2 - 6); ctx.lineTo(f.x + f.w / 2 + 6, f.y - f.h / 2 - 6 + R);
        ctx.moveTo(f.x - f.w / 2 - 6, f.y + f.h / 2 + 6 - R); ctx.lineTo(f.x - f.w / 2 - 6, f.y + f.h / 2 + 6); ctx.lineTo(f.x - f.w / 2 - 6 + R, f.y + f.h / 2 + 6);
        ctx.moveTo(f.x + f.w / 2 + 6 - R, f.y + f.h / 2 + 6); ctx.lineTo(f.x + f.w / 2 + 6, f.y + f.h / 2 + 6); ctx.lineTo(f.x + f.w / 2 + 6, f.y + f.h / 2 + 6 - R);
        ctx.stroke();
      }
    };
  })();

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

  function still() {
    Pv = P;
    for (var i = 0; i < 6; i++) {
      ctx.save(); ctx.translate(OFFX, OFFY); inst.draw(i * 260); ctx.restore();
    }
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
