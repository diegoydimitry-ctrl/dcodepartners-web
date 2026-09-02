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
  var NUB = [], NORD = [], NSPR = [], NPX = null, NPY = null, NPA = null, NPG = null, NPC = null;
  var o1 = { x: 0, y: 0, a: 1, g: -1, c: 8 };

  /* Un destello por color Y POR ESTRATO: lo lejano es ancho y sin núcleo —así
     se ve lo desenfocado—, lo cercano tiene núcleo duro. Es lo que da cuerpo
     a la materia en lugar de dejarla en una nube plana de puntos. */
  function chispas() {
    NSPR = [];
    var todos = [C.cian, C.azul, C.violeta, C.lav, C.rosa, C.verde,
                 C.ambar, C.turq, ACERO, [226, 240, 255]];
    for (var e = 0; e < 3; e++) {
      var fila = [];
      for (var i = 0; i < todos.length; i++) {
        var cv = document.createElement('canvas'), R = 28;
        cv.width = cv.height = R * 2;
        var g = cv.getContext('2d');
        var gr = g.createRadialGradient(R, R, 0, R, R, R);
        if (e === 0) {
          gr.addColorStop(0,    rgba(todos[i], 0.60));
          gr.addColorStop(0.44, rgba(todos[i], 0.30));
          gr.addColorStop(1,    rgba(todos[i], 0));
        } else if (e === 1) {
          gr.addColorStop(0,    rgba(todos[i], 0.88));
          gr.addColorStop(0.26, rgba(todos[i], 0.42));
          gr.addColorStop(0.66, rgba(todos[i], 0.10));
          gr.addColorStop(1,    rgba(todos[i], 0));
        } else {
          gr.addColorStop(0,    rgba(todos[i], 1));
          gr.addColorStop(0.13, rgba(todos[i], 0.82));
          gr.addColorStop(0.34, rgba(todos[i], 0.22));
          gr.addColorStop(1,    rgba(todos[i], 0));
        }
        g.fillStyle = gr; g.fillRect(0, 0, R * 2, R * 2);
        fila.push(cv);
      }
      NSPR.push(fila);
    }
  }

  function nube(n) {
    NUB = []; NORD = [];
    for (var i = 0; i < n; i++) {
      var r = sd(i, 1), r2 = sd(i, 2);
      var e = r < 0.40 ? 0 : (r < 0.76 ? 1 : 2);
      NUB.push({ e: e,
                 z: e === 0 ? 0.24 + r * 0.28 : (e === 1 ? 0.52 + r2 * 0.26 : 0.80 + r2 * 0.30),
                 s: 0.62 + r2 * 0.88, vx: 0, vy: 0, x: -1, y: 0 });
      NORD.push(i);
    }
    /* De lejos a cerca: lo cercano tapa a lo lejano, no al revés. */
    NORD.sort(function (a, b) { return NUB[a].z - NUB[b].z; });
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
  function pinta(enl, tm) {
    ctx.globalCompositeOperation = 'lighter';
    /* Una luz recorre el instrumento y roza lo que tiene delante: sin ella
       todo se ilumina por igual y la materia se aplana. */
    var lz = ((tm || 0) * 0.00007) % 1.6 - 0.3;
    var lx = W * lz, ly = H * 0.48, lr2 = Math.pow(Math.max(W, H) * 0.32, 2);
    for (var q = 0; q < NORD.length; q++) {
      var i = NORD[q];
      var p = NUB[i];
      var ldx = NPX[i] - lx, ldy = NPY[i] - ly;
      var luz = Math.exp(-(ldx * ldx + ldy * ldy) / lr2) * 0.34;
      var a = (NPA[i] + luz) * (0.34 + p.z * 0.58);
      if (a <= 0.012) continue;
      var sp = Math.min(1.1, Math.sqrt(p.vx * p.vx + p.vy * p.vy) * 0.22);
      var r = (1.2 + p.s * 2.6) * (0.58 + p.z * 1.05) * (1 + sp);
      var spr = NSPR[p.e][NPC[i]];
      /* Floración: lo que de verdad brilla deja halo. Es lo que separa un
         punto encendido de una fuente de luz. */
      if (a > 0.46) {
        var rb = r * 2.7;
        ctx.globalAlpha = Math.min(0.13, (a - 0.46) * 0.32);
        ctx.drawImage(spr, NPX[i] - rb, NPY[i] - rb, rb * 2, rb * 2);
      }
      ctx.globalAlpha = Math.min(0.62, a);
      ctx.drawImage(spr, NPX[i] - r, NPY[i] - r, r * 2, r * 2);
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

  /* Cada página tiene su instrumento; todos comparten la misma materia. */
  var INSTR = {};

  /* Los once que quedaban en geometría dibujada pasan a la MISMA materia que
     el resto del sitio. Cada uno conserva su idea; lo que cambia es que ahora
     está hecho de lo mismo que la portada, y por eso todo pertenece al mismo
     universo en lugar de parecer once piezas de once sitios distintos. */

  /* SERVICIOS — "El cable". Tres hebras cableadas en hélice, hechas de
     partículas: se ve DE QUÉ está hecho. Unas pasan por delante y otras por
     detrás, el haz se ciñe al recorrer la página, entra y sale del encuadre,
     y por turnos una hebra afloja mientras las otras dos toman su carga. */
  INSTR.servicios = (function () {
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
          o.a = (frente ? 0.52 : 0.14) + 0.16 * tense + 0.22 * carga
              - (si === flojo ? 0.22 * cede : 0);
          o.c = HUE[si];
          o.g = si;
        }, tm);
        pinta(0.10, tm);

        /* Las ataduras: lo que convierte tres hebras en un solo cable. */
        var paso = 0.145;
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineWidth = 1;
        for (var b2 = paso; b2 < 1.1; b2 += paso) {
          var ap = ease((tense - (b2 - 0.1) * 0.5) / 0.35);
          if (ap <= 0) continue;
          var yb = b2 * H;
          var izq = cx - spread * 1.25, der = cx + spread * 1.25;
          ctx.strokeStyle = rgba([214, 236, 255], 0.06 * ap);
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

  /* AUTOMATIZACIÓN — "La tarea repetida". Lo mismo, una y otra vez, a mano.
     Hasta que se captura: entonces deja de repetirse y pasa a correr solo. */
  INSTR.automatizacion = {
    build: function () { nube(small ? 260 : 520); },
    draw: function (tm) {
      clear(0.30);
      var capt = win(0.06, 0.52);
      var FIL = small ? 4 : 6, per = 0;
      materia(function (i, u, o) {
        per = NUB.length / FIL;
        var f = Math.min(FIL - 1, (i / per) | 0);
        var j = (i - f * per) / per;
        var fy = H * (0.16 + f / (FIL - 1) * 0.66);
        /* Antes: cada fila repite el mismo gesto, desalineada y a destiempo. */
        var manual = H * 0.055 * Math.sin(j * 12.566 + f * 1.1);
        /* Después: una sola línea limpia, y lo que circula por ella es continuo. */
        var auto = Math.sin(j * 6.28 + tm * 0.0009) * 2;
        var cerr = ease((capt - f / FIL * 0.4) / 0.42);
        o.x = W * (0.06 + j * 0.88);
        o.y = lerp(fy + manual, H * 0.5 + (f - (FIL - 1) / 2) * 7 + auto, cerr);
        o.a = (0.20 + 0.34 * Math.abs(Math.sin(j * 12.566 + f))) * (1 - cerr * 0.4)
            + 0.44 * cerr * (Math.abs(((j + tm * 0.00028) % 1) - 0.5) < 0.16 ? 1 : 0.25);
        o.c = cerr > 0.6 ? CI.verde : CI.acero;
        o.g = 100 + f;
      }, tm);
      pinta(0.10, tm);
    }
  };

  /* AGENTES — "La conversación". Dos voces que se turnan: la del visitante
     manda y la otra responde. Nunca hablan a la vez. */
  INSTR.agentes = {
    build: function () { nube(small ? 240 : 460); },
    draw: function (tm) {
      clear(0.30);
      var turno = ((tm * 0.00018) % 2) | 0;              // de quién es el turno
      var fase = (tm * 0.00018) % 1;
      materia(function (i, u, o) {
        var lado = i % 2;
        var j = ((i / 2) | 0) / (NUB.length / 2);
        var activo = lado === turno;
        var y = H * (0.20 + j * 0.60);
        /* Quien habla avanza hacia el centro; quien escucha se retira. */
        var av = activo ? ease(fase / 0.8) : 0;
        var x0 = lado ? W * 0.94 : W * 0.06;
        o.x = lerp(x0, W * 0.5, av * (0.4 + 0.5 * Math.sin(j * 3.14)));
        o.y = y + Math.sin(j * 9 + tm * 0.0006) * 5;
        o.a = activo ? 0.22 + 0.56 * Math.sin(av * 3.1416) : 0.12;
        o.c = lado ? CI.cian : CI.violeta;
        o.g = 200 + lado;
      }, tm);
      pinta(0.12, tm);
    }
  };

  /* INTEGRACIONES — "El puente". Dos sistemas que no se hablaban, y el puente
     que se construye entre ellos hasta que el dato cruza. */
  INSTR.integraciones = {
    build: function () { nube(small ? 260 : 520); },
    draw: function (tm) {
      clear(0.30);
      var puente = win(0.08, 0.58);
      var xa = W * 0.16, xb = W * 0.84, my = H * 0.5;
      materia(function (i, u, o) {
        var rol = i % 5;
        if (rol < 2) {
          /* Los dos sistemas: dos cuerpos con su propia estructura. */
          var lado = rol, cx = lado ? xb : xa;
          var k = ((i / 5) | 0) % 16;
          var an = (k / 16) * 6.2832 + tm * 0.00008 * (lado ? -1 : 1);
          o.x = cx + Math.cos(an) * W * 0.085;
          o.y = my + Math.sin(an) * H * 0.20;
          o.a = 0.34; o.c = lado ? CI.violeta : CI.cian; o.g = 300 + lado;
        } else if (rol === 2) {
          /* El puente: se tiende de un lado al otro. */
          var j = ((i / 5) | 0) / (NUB.length / 5);
          var lleg = clamp(j / Math.max(0.01, puente));
          o.x = lerp(xa, xb, Math.min(j, puente));
          o.y = my + Math.sin(Math.min(j, puente) * 3.1416) * -H * 0.10;
          o.a = j <= puente ? 0.44 : 0;
          o.c = CI.acero; o.g = 310;
        } else {
          /* Y el dato cruzando, una vez que el puente existe. */
          var t = ((tm * 0.00035) + sd(i, 61)) % 1;
          if (puente < 0.94) { o.x = xa; o.y = my; o.a = 0; o.g = -1; return; }
          o.x = lerp(xa, xb, t);
          o.y = my + Math.sin(t * 3.1416) * -H * 0.10;
          o.a = 0.70 * Math.sin(t * 3.1416);
          o.c = CI.verde; o.g = -1;
        }
      }, tm);
      pinta(0.11, tm);
    }
  };

  /* FINANCE — "El circuito". El dinero baja por sus estados —emitido,
     enviado, vencido, cobrado— y lo cobrado se acumula abajo y se queda.
     Va en vertical y en la banda libre: esta página es de dos columnas de
     texto y el circuito no puede cruzarlas. */
  INSTR.finance = {
    build: function () { nube(small ? 240 : 480); },
    draw: function (tm) {
      clear(0.30);
      var X0 = narrow ? 0.06 : 0.70, X1 = narrow ? 0.94 : 0.97;
      var EST = 4;
      var xs = [0.18, 0.44, 0.68, 0.86];                 // los cuatro estados
      materia(function (i, u, o) {
        var acum = (i % 6) === 0;
        var t = ((tm * 0.00009) + sd(i, 71)) % 1;
        if (acum) {
          /* Lo cobrado: se posa abajo y ya no se mueve. Es el resultado. */
          var k = (i / 6) | 0, cols = small ? 8 : 12;
          o.x = W * (X0 + ((k % cols) + 0.5) * ((X1 - X0) / cols));
          o.y = H * (0.93 - (((k / cols) | 0) % 4) * 0.028);
          o.a = 0.26; o.c = CI.verde; o.g = -1;
          return;
        }
        var e = Math.min(EST - 1, (t * EST) | 0);
        var f = (t * EST) - e;
        /* Baja de estado en estado, y en cada uno se desplaza un poco. */
        o.x = W * lerp(X0 + xs[e] * (X1 - X0), X0 + xs[Math.min(EST - 1, e + 1)] * (X1 - X0), ease(f));
        o.y = H * (0.10 + t * 0.74);
        o.a = 0.12 + 0.40 * Math.abs(Math.sin(t * 12.566));
        o.c = e >= 2 ? CI.ambar : CI.cian;
        o.g = 400 + e;
      }, tm);
      pinta(0.09, tm);
    }
  };

  /* CURSO — "El pulso". Lo que ya late está encendido y tiene ritmo; lo que
     todavía es andamio está ahí, pero apagado y a trazos. */
  INSTR.curso = {
    build: function () { nube(small ? 240 : 480); },
    draw: function (tm) {
      clear(0.30);
      var L = small ? 5 : 8;
      materia(function (i, u, o) {
        var per = NUB.length / L;
        var l = Math.min(L - 1, (i / per) | 0);
        var j = (i - l * per) / per;
        var vivo = l < Math.ceil(L * 0.55);
        var y = H * (0.14 + l / (L - 1) * 0.70);
        if (vivo) {
          /* Late: un pulso recorre la línea a ritmo constante. */
          var p2 = ((tm * 0.00022) + l * 0.14) % 1;
          var d = Math.abs(j - p2);
          o.x = W * (0.06 + j * 0.88);
          o.y = y + (d < 0.03 ? -Math.cos(d / 0.03 * 1.57) * 16 : 0);
          o.a = 0.20 + 0.66 * Math.exp(-d * d * 1400);
          o.c = CI.verde; o.g = 500 + l;
        } else {
          /* Andamio: presente, pero todavía no funciona. */
          var trazo = Math.abs(Math.sin(j * 40)) > 0.5 ? 1 : 0;
          o.x = W * (0.06 + j * 0.88); o.y = y;
          o.a = 0.16 * trazo; o.c = CI.acero; o.g = -1;
        }
      }, tm);
      pinta(0.10, tm);
    }
  };

  /* MÉTODO — "El plano". Se dibuja como se dibuja un plano: primero las
     guías, después los trazos, y al final las cotas. En ese orden. */
  INSTR.metodo = {
    build: function () { nube(small ? 260 : 520); },
    draw: function (tm) {
      clear(0.30);
      var g1 = win(0.02, 0.24), g2 = win(0.18, 0.56), g3 = win(0.50, 0.86);
      materia(function (i, u, o) {
        var rol = i % 3;
        var j = ((i / 3) | 0) / (NUB.length / 3);
        if (rol === 0) {                                  // guías
          var k = ((i / 3) | 0) % 9;
          var vert = k % 2 === 0;
          o.x = vert ? W * (0.10 + (k / 9) * 0.82) : W * (0.06 + j * 0.88);
          o.y = vert ? H * (0.10 + j * 0.80) : H * (0.14 + (k / 9) * 0.72);
          o.a = 0.13 * g1 * (Math.abs(Math.sin(j * 60)) > 0.5 ? 1 : 0.2);
          o.c = CI.acero; o.g = -1;
        } else if (rol === 1) {                           // trazos
          var m = ((i / 3) | 0) % 5;
          var ax = 0.14 + sd(m, 81) * 0.30, ay = 0.20 + sd(m, 82) * 0.56;
          var bx = 0.52 + sd(m, 83) * 0.34, by = 0.20 + sd(m, 84) * 0.56;
          var av = clamp((g2 - m * 0.14) / 0.30);
          o.x = W * lerp(ax, bx, Math.min(j, av));
          o.y = H * lerp(ay, by, Math.min(j, av));
          o.a = j <= av ? 0.50 : 0;
          o.c = CI.cian; o.g = 600 + m;
        } else {                                          // cotas
          var c2 = ((i / 3) | 0) % 4;
          var cy = H * (0.86 - c2 * 0.055);
          o.x = W * (0.12 + j * (0.30 + c2 * 0.14));
          o.y = cy;
          o.a = 0.40 * g3 * (Math.abs(Math.sin(j * 30)) > 0.35 ? 1 : 0.25);
          o.c = CI.ambar; o.g = 650 + c2;
        }
      }, tm);
      pinta(0.09, tm);
    }
  };

  /* CASOS — "La linterna". Una sala a oscuras: la evidencia solo aparece
     donde se está mirando. Lo demás sigue ahí, pero no se ve. */
  INSTR.casos = {
    build: function () { nube(small ? 240 : 480); },
    draw: function (tm) {
      clear(0.30);
      var lx = cmx * W, ly = cmy * H;
      if (coarse) { lx = W * (0.5 + Math.cos(tm * 0.00016) * 0.28); ly = H * (0.5 + Math.sin(tm * 0.00021) * 0.24); }
      var r2 = Math.pow(Math.min(W, H) * 0.30, 2);
      materia(function (i, u, o) {
        var k = i % 40;
        var cx = W * (0.08 + sd(k, 91) * 0.84), cy = H * (0.10 + sd(k, 92) * 0.80);
        var j = ((i / 40) | 0) / Math.max(1, NUB.length / 40);
        o.x = cx + Math.cos(j * 6.2832) * W * 0.030;
        o.y = cy + Math.sin(j * 6.2832) * H * 0.045;
        var dx = o.x - lx, dy = o.y - ly;
        var luz = Math.exp(-(dx * dx + dy * dy) / r2);
        o.a = 0.05 + 0.80 * luz;
        o.c = luz > 0.5 ? CI.ambar : CI.acero;
        o.g = luz > 0.28 ? 700 + k : -1;
      }, tm);
      pinta(0.12, tm);
    }
  };

  /* CONTACTO — "La señal". Empieza débil y gana fuerza a medida que se
     completa el formulario: se ve que el mensaje va a llegar. */
  INSTR.contacto = (function () {
    var campos = null, fuerza = 0;
    return {
      build: function () { nube(small ? 240 : 460); campos = null; },
      draw: function (tm) {
        clear(0.30);
        if (campos === null) {
          var f = document.querySelectorAll('#contact-form [required], .form-card [required]');
          campos = f.length ? f : [];
        }
        var hechos = 0;
        for (var q = 0; q < campos.length; q++) if (campos[q].value && campos[q].value.trim()) hechos++;
        var obj = campos.length ? hechos / campos.length : 0.42;
        fuerza += (obj - fuerza) * 0.05;
        var cx = W * 0.5, cy = H * 0.52;
        materia(function (i, u, o) {
          var anillo = i % 7;
          var j = ((i / 7) | 0) / Math.max(1, NUB.length / 7);
          var t = ((tm * 0.00020) + anillo * 0.14) % 1;
          var rad = t * Math.min(W, H) * (0.12 + 0.24 * fuerza);
          var an = j * 6.2832;
          o.x = cx + Math.cos(an) * rad * 1.5;
          o.y = cy + Math.sin(an) * rad;
          /* La señal sale del lado libre, no desde el centro del texto. */
          o.x += W * (narrow ? 0 : 0.22);
          o.a = (0.08 + 0.42 * fuerza) * Math.sin(t * 3.1416);
          o.c = fuerza > 0.7 ? CI.verde : (fuerza > 0.35 ? CI.cian : CI.acero);
          o.g = 800 + anillo;
        }, tm);
        pinta(0.10, tm);
      }
    };
  })();

  /* CONÓCENOS — "Dos mitades". Estrategia y arquitectura: dos materias que
     vienen de lados opuestos y se traban en el centro. */
  INSTR.conocenos = {
    build: function () { nube(small ? 240 : 480); },
    draw: function (tm) {
      clear(0.30);
      var junta = win(0.06, 0.56);
      materia(function (i, u, o) {
        var lado = i % 2;
        var j = ((i / 2) | 0) / (NUB.length / 2);
        var fil = ((i / 2) | 0) % 14;
        var y = H * (0.14 + (fil / 13) * 0.70);
        var x0 = lado ? 1.06 : -0.06;
        var x1 = lado ? 0.505 + (fil % 2) * 0.012 : 0.495 - (fil % 2) * 0.012;
        o.x = W * lerp(x0, x1, ease(junta) * (0.55 + 0.45 * j));
        o.y = y + Math.sin(j * 6 + fil) * 3;
        o.a = 0.12 + 0.34 * junta;
        o.c = lado ? CI.violeta : CI.cian;
        o.g = 900 + lado * 20 + fil;
      }, tm);
      pinta(0.12, tm);
    }
  };

  /* GARANTÍAS — "Lo que está escrito". Cada compromiso se escribe de
     izquierda a derecha y, una vez escrito, se queda. Nada parpadea. */
  INSTR.garantias = {
    build: function () { nube(small ? 220 : 440); },
    draw: function (tm) {
      clear(0.30);
      var L = small ? 6 : 10;
      materia(function (i, u, o) {
        var per = NUB.length / L;
        var l = Math.min(L - 1, (i / per) | 0);
        var j = (i - l * per) / per;
        var largo = 0.30 + sd(l, 95) * 0.52;
        var esc = ease((Pv - l / L * 0.55) / 0.22);
        var fin = largo * esc;
        o.x = W * (0.06 + j * largo * 0.90);
        o.y = H * (0.12 + (l / (L - 1)) * 0.74);
        o.a = j <= esc ? 0.30 : 0;
        /* La marca de cerrado, al final de lo ya escrito. */
        if (j > esc - 0.04 && j <= esc && esc > 0.96) { o.a = 0.58; o.c = CI.verde; }
        else o.c = CI.acero;
        o.g = j <= esc ? 1000 + l : -1;
      }, tm);
      pinta(0.10, tm);
    }
  };

  /* DATO — "El dato que se escribe una vez". Entra por un sitio y llega a
     todos los demás sin que nadie lo vuelva a teclear. */
  INSTR.dato = {
    build: function () { nube(small ? 240 : 480); },
    draw: function (tm) {
      clear(0.30);
      var D = small ? 5 : 7;
      /* En su banda: esta página tiene dos columnas de texto y el dato no
         puede atravesarlas para llegar a sus destinos. */
      var X0 = narrow ? 0.08 : 0.62, X1 = narrow ? 0.94 : 0.97;
      var ox = W * X0, oy = H * 0.5;
      materia(function (i, u, o) {
        var rol = i % 4;
        if (rol === 0) {
          /* Los destinos: donde el dato tiene que llegar. */
          var k = ((i / 4) | 0) % D;
          var an = (k / D) * 3.1416 - 1.5708;
          var j2 = ((i / 4) | 0) / Math.max(1, NUB.length / 4);
          o.x = W * (X0 + (X1 - X0) * 0.82) + Math.cos(j2 * 6.2832) * W * 0.022;
          o.y = H * (0.14 + (k / (D - 1)) * 0.72) + Math.sin(j2 * 6.2832) * H * 0.026;
          o.a = 0.34; o.c = CI.acero; o.g = 1100 + k;
        } else {
          /* El dato viajando: se escribe una vez y va a todos. */
          var k2 = i % D;
          var t = ((tm * 0.00028) + sd(i, 96)) % 1;
          var dy = H * (0.14 + (k2 / (D - 1)) * 0.72);
          o.x = lerp(ox, W * (X0 + (X1 - X0) * 0.82), t);
          o.y = lerp(oy, dy, ease(t));
          o.a = 0.14 + 0.60 * Math.sin(t * 3.1416);
          o.c = t > 0.9 ? CI.verde : CI.cian;
          o.g = -1;
        }
      }, tm);
      pinta(0.10, tm);
    }
  };

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
        pinta(0.05, tm);

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
      pinta(0, tm);
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
      pinta(0, tm);
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
        o.a = vivo ? (hito ? 0.62 : 0.30) : 0.06;
        o.c = hito && vivo ? CI.verde : CI.turq;
        o.g = vivo ? 300 + l : -1;
      }, tm);
      pinta(0.12, tm);
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
        pinta(0.11, tm);

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
          o.y = midY + (arriba ? -1 : 1) * (30 + (i % 6) * 13);
          o.a = 0.10 + 0.34 * (arriba ? ent : sal) * Math.sin(t * 3.1416);
          o.c = arriba ? CI.verde : CI.rosa;
          o.g = -1;
        }, tm);
        pinta(0, tm);
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
      pinta(0.13, tm);
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
      pinta(0, tm);
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
      pinta(0.10, tm);
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
