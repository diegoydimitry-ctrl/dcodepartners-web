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
    W = host.clientWidth; H = host.clientHeight;
    narrow = W < 900; small = W < 620;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (inst && inst.build) inst.build();
  }
  function clear(alpha) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = reduced ? '#05070e' : 'rgba(5,7,14,' + (alpha || 0.24) + ')';
    ctx.fillRect(0, 0, W, H);
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
    var HUES = [];
    return {
      build: function () { HUES = [C.cian, C.violeta, C.rosa]; },
      draw: function (tm) {
        clear(0.26);
        var braid = win(0.04, 0.72);
        var cx = W * (narrow ? 0.5 : 0.62);
        var spread = W * (narrow ? 0.20 : 0.15);
        for (var s = 0; s < 3; s++) {
          ctx.beginPath();
          var step = small ? 12 : 7;
          for (var y = -20; y <= H + 20; y += step) {
            var u = y / H;
            var tw = Math.sin(u * 7 + s * 2.09 + tm * 0.00035) * spread;
            // Cuanto más abajo, más se cierran los tres hilos en uno.
            var close = 1 - braid * ease(u);
            var x = cx + (tw * close) + (s - 1) * spread * 0.9 * close;
            if (y <= -20) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = rgba(HUES[s], 0.20 + 0.16 * braid);
          ctx.lineWidth = 1.4; ctx.stroke();
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
      mx = e.clientX / window.innerWidth; my = e.clientY / window.innerHeight;
      if (inst.move) inst.move();
    }, { passive: true });
  }

  measure(); readScroll(); Pv = P;

  function still() { Pv = P; for (var i = 0; i < 6; i++) inst.draw(i * 260); }

  var running = false, visible = true;
  function loop(tm) {
    if (!running) return;
    Pv += (P - Pv) * 0.08;
    cmx += (mx - cmx) * 0.08; cmy += (my - cmy) * 0.08;
    inst.draw(tm);
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
