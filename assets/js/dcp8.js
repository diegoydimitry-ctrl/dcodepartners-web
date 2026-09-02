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

  /* LA MISMA PALETA QUE LA PORTADA, con los mismos significados. El interior
     tenía sus propios valores —otro azul, otro cian, otro rosa— y por eso,
     aunque compartiera el motor, parecía otro sitio. Ahora una arista cian
     significa lo mismo en la portada que en Integraciones. */
  var C = {
    cian:  [ 46, 216, 240],   // conexión viva
    azul:  [ 78, 128, 255],   // información, dato
    violeta:[141, 98, 250],   // proceso, inteligencia
    lav:   [178, 138, 255],   // volumen, campo
    rosa:  [255,  86, 168],   // anomalía, decisión, lo que falla
    verde: [ 52, 224, 198],   // resuelto
    ambar: [255, 180,  58],   // aviso (solo donde hay un aviso real)
    turq:  [ 52, 224, 198]    // lo que ya funciona
  };
  function rgba(h, a) { return 'rgba(' + h[0] + ',' + h[1] + ',' + h[2] + ',' + a + ')'; }
  function sd(i, s) { var x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }
  function clamp(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }
  /* Ventana de avance: 0 antes de `a`, 1 después de `b`. Con esto cada
     instrumento decide en qué tramo de la página ocurre cada cosa. */
  function win(a, b) { return ease((Pv - a) / Math.max(0.0001, b - a)); }

  /* BANDAS CONTIGUAS. Esta es la corrección de fondo de todo el interior.
     Los papeles se repartían con `i % N`, así que dos partículas
     consecutivas NUNCA pertenecían a la misma pieza. Y como el enlace une
     partículas consecutivas del mismo grupo, no se dibujaba una sola línea:
     los instrumentos tenían escrita una estructura —dos sistemas y un
     puente, un plano con guías y cotas, un dato que llega a siete destinos—
     y en pantalla salía una nube de puntos sueltos que no decía nada.

     Con bandas contiguas cada pieza la dibujan SUS partículas, en orden, y
     la estructura aparece. Es el mismo hallazgo que hizo funcionar la
     portada, aplicado aquí. */
  /* Como tramo() en la portada: se llamaba una o dos veces por particula y por
     fotograma —del orden de cien mil objetos nuevos por segundo con 1.340
     particulas— solo para devolver dos numeros. Ahora se reparten de un anillo
     de dieciseis. Ningun resultado sobrevive a su iteracion. */
  var _BD = [], _bp = 0;
  for (var _b = 0; _b < 16; _b++) _BD.push({ k: 0, j: 0 });
  function banda(u, a, b, n) {
    var t = (u - a) / (b - a) * n;
    var k = t | 0; if (k >= n) k = n - 1; if (k < 0) k = 0;
    var o = _BD[_bp = (_bp + 1) & 15];
    o.k = k; o.j = t - k;
    return o;
  }

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
  var ACERO = [ 96, 122, 186];
  var CI = { cian:0, azul:1, violeta:2, lav:3, rosa:4, verde:5,
             ambar:6, turq:7, acero:8, blanco:9 };
  var NUB = [], NORD = [], NSPR = [], NPX = null, NPY = null, NPA = null, NPG = null, NPC = null;
  var NSEG = [], NSEGN = null;
  var o1 = { x: 0, y: 0, a: 1, g: -1, c: 8 };

  /* Un destello por color Y POR ESTRATO: lo lejano es ancho y sin núcleo —así
     se ve lo desenfocado—, lo cercano tiene núcleo duro. Es lo que da cuerpo
     a la materia en lugar de dejarla en una nube plana de puntos. */
  var NCOL = null;
  function chispas() {
    NSPR = [];
    NCOL = [C.cian, C.azul, C.violeta, C.lav, C.rosa, C.verde,
            C.ambar, C.turq, ACERO, [226, 240, 255]];
    var todos = NCOL;
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
    /* Despues de chispas(), que es quien define la paleta. Una cubeta de
       segmentos por color; se llenan en una sola pasada y se pintan una vez. */
    NSEG = []; for (var c = 0; c < NSPR[0].length; c++) NSEG.push(new Float32Array(n * 4));
    NSEGN = new Int32Array(NSPR[0].length);
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
      var a = (NPA[i] + luz) * (0.40 + p.z * 0.70);
      /* Por debajo de este umbral no se distingue del fondo y cada partícula
         cuesta una llamada de dibujo aunque no se vea. */
      if (a <= 0.045) continue;
      /* Mismo hallazgo que en la portada, aplicado aquí: las partículas que
         transportan datos no paran nunca, así que viven permanentemente
         estiradas por velocidad, y el radio entra al cuadrado en el área. Con
         el estirado contenido y un tope duro, /como-funciona sube de 46 a
         60 fps sin que se note una estela de menos. */
      var v2 = p.vx * p.vx + p.vy * p.vy;
      var sp = v2 > 16 ? 0.40 : v2 * 0.025;
      var r = (1.05 + p.s * 2.25) * (0.58 + p.z * 1.02) * (1 + sp);
      if (r > 8.6) r = 8.6;
      /* Fuera del lienzo no se pinta nada y la llamada se paga igual. El
         instrumento trabaja en coordenadas trasladadas (OFFX/OFFY), asi que
         la ventana visible en ESAS coordenadas es la de abajo. El halo llega
         a 2,6 radios. Ni un pixel cambia; en /servicios son 261 llamadas
         menos por fotograma de 1.434. */
      var mg = r * 2.6;
      if (NPX[i] < -OFFX - mg || NPY[i] < -OFFY - mg ||
          NPX[i] > FW - OFFX + mg || NPY[i] > FH - OFFY + mg) continue;
      var spr = NSPR[p.e][NPC[i]];
      /* Floración SOLO en el estrato cercano: lo que está lejos y desenfocado
         no tiene por qué tener un halo duro, y el halo se dibuja a tres
         radios, así que cada partícula florecida cuesta treinta veces su
         propia área. */
      if (p.e === 2 && a > 0.54) {
        var rb = r * 2.6;
        ctx.globalAlpha = Math.min(0.24, (a - 0.54) * 0.56);
        ctx.drawImage(spr, NPX[i] - rb, NPY[i] - rb, rb * 2, rb * 2);
      }
      ctx.globalAlpha = Math.min(0.78, a);
      ctx.drawImage(spr, NPX[i] - r, NPY[i] - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;
    if (enl) {
      /* El enlace hereda el color de la materia que une, como en la portada:
         un puente cian se ve cian, un cabo suelto se ve magenta. Una pasada
         por color; son diez recorridos triviales del array. */
      /* UNA SOLA PASADA, NO DIEZ. Antes se recorria el array entero una vez
         por color: diez recorridos de 1.340 = trece mil cuatrocientas
         iteraciones por fotograma para dibujar unos mil segmentos. Ahora se
         recorre UNA vez y cada segmento cae en la cubeta de su color. Mismo
         orden, mismo trazo, dibujo identico. */
      ctx.lineWidth = 1;
      var NCC = NSPR[0].length, c;
      for (c = 0; c < NCC; c++) NSEGN[c] = 0;
      for (var k = 1; k < NUB.length; k++) {
        var gk = NPG[k];
        if (gk < 0 || gk !== NPG[k - 1]) continue;
        var dx = NPX[k] - NPX[k - 1], dy = NPY[k] - NPY[k - 1];
        if (dx * dx + dy * dy > 24000) continue;
        var ck = NPC[k], sk = NSEG[ck], nk = NSEGN[ck];
        sk[nk] = NPX[k - 1]; sk[nk + 1] = NPY[k - 1];
        sk[nk + 2] = NPX[k];  sk[nk + 3] = NPY[k];
        NSEGN[ck] = nk + 4;
      }
      for (c = 0; c < NCC; c++) {
        var tot = NSEGN[c];
        if (!tot) continue;
        var sc = NSEG[c];
        ctx.beginPath();
        for (var m = 0; m < tot; m += 4) {
          ctx.moveTo(sc[m], sc[m + 1]); ctx.lineTo(sc[m + 2], sc[m + 3]);
        }
        var col = c === CI.acero ? ACERO : (c === CI.blanco ? [226, 240, 255] : NCOL[c]);
        ctx.strokeStyle = rgba(col, c === CI.acero ? enl * 0.85 : enl * 2.1);
        ctx.stroke();
      }
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
      build: function () { nube(small ? 480 : narrow ? 830 : 1340); },
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
    build: function () { nube(small ? 410 : 830); },
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

  /* AGENTES — "La conversación". Dos voces que se turnan, dibujadas como lo
     que realmente son en un sistema de agentes: DOS SEÑALES. La de arriba es
     la del visitante; la de abajo, la del agente. Cuando a una le toca, su
     onda se abre y recorre la banda de un extremo al otro; la otra se queda
     plana esperando. Nunca hablan a la vez, y eso —que una calle mientras la
     otra habla— es lo único que hace falta para que se lea como un diálogo.

     Antes eran dos nubes de puntos avanzando hacia el centro de la pantalla,
     que es justo donde va el texto: no se veía ninguna de las dos. */
  INSTR.agentes = {
    build: function () { nube(small ? 380 : 740); },
    draw: function (tm) {
      clear(0.30);
      var ciclo = (tm * 0.00016) % 2;
      var turno = ciclo | 0;                            // de quién es el turno
      var fase = ciclo - turno;
      var YB = [0.735, 0.875];
      materia(function (i, u, o) {
        var q = banda(u, 0, 1, 2);
        var voz = q.k, j = q.j;
        var activo = voz === turno;
        var y = H * YB[voz];
        o.x = W * (0.05 + j * 0.90);
        if (activo) {
          /* La onda se abre por delante del frente de habla y se cierra
             detrás: se ve la frase avanzar, no un adorno oscilando. */
          var frente = ease(fase / 0.86);
          var dentro = clamp((frente - j) * 9);
          var amp = dentro * (1 - clamp((frente - j - 0.30) * 3.2));
          o.y = y + Math.sin(j * 64 + voz * 2.1) * H * 0.052 * amp
                  + Math.sin(j * 23) * H * 0.016 * amp;
          o.a = 0.16 + 0.70 * amp;
          o.c = voz ? CI.violeta : CI.cian;
        } else {
          o.y = y;
          o.a = 0.16;
          o.c = CI.acero;
        }
        o.g = 200 + voz;
      }, tm);
      pinta(0.16, tm);
    }
  };

  /* INTEGRACIONES — "El puente". Dos sistemas que no se hablaban, y el puente
     que se construye entre ellos hasta que el dato cruza. */
  INSTR.integraciones = {
    build: function () { nube(small ? 410 : 830); },
    draw: function (tm) {
      clear(0.30);
      var puente = win(0.08, 0.58);
      var xa = W * 0.16, xb = W * 0.84, my = H * 0.5;
      materia(function (i, u, o) {
        if (u < 0.46) {
          /* Los dos sistemas. Cada uno es una espiral apretada dibujada por
             sus propias partículas en orden: un cuerpo cerrado, con vueltas,
             que se lee como algo que ya funciona por dentro. Antes eran
             dieciséis puntos sueltos sobre un círculo imaginario. */
          var q = banda(u, 0, 0.46, 2);
          var lado = q.k, cx = lado ? xb : xa;
          var an = q.j * 18.85 + tm * 0.00010 * (lado ? -1 : 1);
          var rad = 0.30 + 0.70 * q.j;
          o.x = cx + Math.cos(an) * W * 0.088 * rad;
          o.y = my + Math.sin(an) * H * 0.21 * rad;
          o.a = 0.30 + 0.26 * q.j;
          o.c = lado ? CI.violeta : CI.azul;
          o.g = 300 + lado;
          return;
        }
        if (u < 0.74) {
          /* El puente: se tiende de un lado al otro, y hasta que no está
             tendido no cruza nada. */
          var q2 = banda(u, 0.46, 0.74, 1);
          var j = q2.j;
          var av = Math.min(j, puente);
          o.x = lerp(xa, xb, av);
          o.y = my + Math.sin(av * 3.1416) * -H * 0.11;
          o.a = j <= puente ? 0.52 : 0;
          o.c = CI.cian; o.g = j <= puente ? 310 : -1;
          return;
        }
        /* Y el dato cruzando, una vez que el puente existe. */
        var t = ((tm * 0.00035) + sd(i, 61)) % 1;
        if (puente < 0.94) { o.x = xa; o.y = my; o.a = 0; o.g = -1; return; }
        o.x = lerp(xa, xb, t);
        o.y = my + Math.sin(t * 3.1416) * -H * 0.11;
        o.a = 0.86 * Math.sin(t * 3.1416);
        o.c = CI.verde; o.g = -1;
      }, tm);
      pinta(0.13, tm);
    }
  };

  /* FINANCE — "El circuito". El dinero baja por sus estados —emitido,
     enviado, vencido, cobrado— y lo cobrado se acumula abajo y se queda.
     Va en vertical y en la banda libre: esta página es de dos columnas de
     texto y el circuito no puede cruzarlas. */
  INSTR.finance = {
    build: function () { nube(small ? 380 : 760); },
    draw: function (tm) {
      clear(0.30);
      var X0 = narrow ? 0.06 : 0.70, X1 = narrow ? 0.94 : 0.97;
      var EST = 4;
      var xs = [0.18, 0.44, 0.68, 0.86];                 // los cuatro estados
      materia(function (i, u, o) {
        var t = ((tm * 0.00009) + sd(i, 71)) % 1;
        if (u < 0.20) {
          /* Lo cobrado: se posa abajo y ya no se mueve. Es el resultado, y
             es lo único de este instrumento que se queda quieto. */
          var qa = banda(u, 0, 0.20, small ? 8 : 12);
          var cols = small ? 8 : 12;
          o.x = W * (X0 + (qa.k + 0.5) * ((X1 - X0) / cols));
          o.y = H * (0.935 - ((qa.j * 4) | 0) * 0.026);
          o.a = 0.34; o.c = CI.verde; o.g = -1;
          return;
        }
        var e = Math.min(EST - 1, (t * EST) | 0);
        var f = (t * EST) - e;
        /* Baja de estado en estado, y en cada uno se desplaza un poco. */
        o.x = W * lerp(X0 + xs[e] * (X1 - X0), X0 + xs[Math.min(EST - 1, e + 1)] * (X1 - X0), ease(f));
        o.y = H * (0.10 + t * 0.74);
        o.a = 0.14 + 0.48 * Math.abs(Math.sin(t * 12.566));
        /* El color dice el estado: azul mientras es sólo un apunte, magenta
           cuando ya está vencido y hay que hacer algo. */
        o.c = e >= 2 ? CI.rosa : CI.azul;
        o.g = -1;
      }, tm);
      pinta(0.09, tm);
    }
  };

  /* CURSO — "El pulso". Lo que ya late está encendido y tiene ritmo; lo que
     todavía es andamio está ahí, pero apagado y a trazos. */
  INSTR.curso = {
    build: function () { nube(small ? 380 : 760); },
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
    build: function () { nube(small ? 410 : 830); },
    draw: function (tm) {
      clear(0.30);
      var g1 = win(0.02, 0.24), g2 = win(0.18, 0.56), g3 = win(0.50, 0.86);
      materia(function (i, u, o) {
        if (u < 0.34) {                                   // las guías
          var q = banda(u, 0, 0.34, 9);
          var vert = q.k % 2 === 0;
          o.x = vert ? W * (0.10 + (q.k / 9) * 0.82) : W * (0.06 + q.j * 0.88);
          o.y = vert ? H * (0.10 + q.j * 0.80) : H * (0.14 + (q.k / 9) * 0.72);
          o.a = 0.20 * g1 * (Math.abs(Math.sin(q.j * 60)) > 0.5 ? 1 : 0.2);
          o.c = CI.acero; o.g = 590 + q.k;
          return;
        }
        if (u < 0.74) {                                   // los trazos
          var q2 = banda(u, 0.34, 0.74, 5);
          var m = q2.k, j2 = q2.j;
          var ax = 0.14 + sd(m, 81) * 0.30, ay = 0.20 + sd(m, 82) * 0.56;
          var bx = 0.52 + sd(m, 83) * 0.34, by = 0.20 + sd(m, 84) * 0.56;
          var av = clamp((g2 - m * 0.14) / 0.30);
          o.x = W * lerp(ax, bx, Math.min(j2, av));
          o.y = H * lerp(ay, by, Math.min(j2, av));
          o.a = j2 <= av ? 0.62 : 0;
          o.c = CI.cian; o.g = j2 <= av ? 600 + m : -1;
          return;
        }
        var q3 = banda(u, 0.74, 1, 4);                    // las cotas
        o.x = W * (0.12 + q3.j * (0.30 + q3.k * 0.14));
        o.y = H * (0.86 - q3.k * 0.055);
        o.a = 0.52 * g3 * (Math.abs(Math.sin(q3.j * 30)) > 0.35 ? 1 : 0.25);
        o.c = CI.violeta; o.g = 650 + q3.k;
      }, tm);
      pinta(0.09, tm);
    }
  };

  /* CASOS — "La linterna". Una sala a oscuras: la evidencia solo aparece
     donde se está mirando. Lo demás sigue ahí, pero no se ve. */
  INSTR.casos = {
    build: function () { nube(small ? 380 : 760); },
    draw: function (tm) {
      clear(0.30);
      var lx = cmx * W, ly = cmy * H;
      if (coarse) { lx = W * (0.5 + Math.cos(tm * 0.00016) * 0.28); ly = H * (0.5 + Math.sin(tm * 0.00021) * 0.24); }
      var r2 = Math.pow(Math.min(W, H) * 0.30, 2);
      materia(function (i, u, o) {
        var q = banda(u, 0, 1, 40);
        var k = q.k, j = q.j;
        var cx = W * (0.08 + sd(k, 91) * 0.84), cy = H * (0.10 + sd(k, 92) * 0.80);
        o.x = cx + Math.cos(j * 6.2832) * W * 0.030;
        o.y = cy + Math.sin(j * 6.2832) * H * 0.045;
        var dx = o.x - lx, dy = o.y - ly;
        var luz = Math.exp(-(dx * dx + dy * dy) / r2);
        o.a = 0.05 + 0.80 * luz;
        o.c = luz > 0.5 ? CI.cian : CI.acero;
        o.g = luz > 0.28 ? 700 + k : -1;
      }, tm);
      pinta(0.12, tm);
    }
  };

  /* CONTACTO — "La señal". Empieza débil y gana fuerza a medida que se
     completa el formulario: se ve que el mensaje va a llegar. */
  /* PREGUNTAS FRECUENTES — «la consulta». Era una de las cuatro paginas sin
     instrumento: una pagina negra con cajas encima, la que mas parecia de
     cualquier agencia. Y no le hacia falta una figura bonita, le hacia falta
     decir lo que hace la pagina: SE PREGUNTA Y SE ENCUENTRA.

     Tres cosas ocurren a la vez. Por la izquierda entran consultas —hilos
     cortos de materia que avanzan hacia un frente de lectura vertical—. El
     frente las recibe y, cada pocos segundos, UNA de ellas es la que encaja:
     se enciende, cruza el frente y sale por la derecha ya resuelta, en
     turquesa. Las demas siguen circulando: no toda pregunta se responde a la
     vez.

     Y el frente responde a lo que hace el visitante: si hay algo escrito en el
     buscador, se estrecha y se aviva —el sistema esta buscando—. */
  INSTR.consulta = (function () {
    var caja = null, busca = 0, foco = 0, obj = 0, tic = 0;
    return {
      build: function () { nube(small ? 420 : narrow ? 700 : 1080); caja = null; },
      draw: function (tm) {
        clear(0.30);
        if (caja === null) caja = document.getElementById('faq-search-input') || false;
        var hay = caja && caja.value && caja.value.trim().length ? 1 : 0;
        busca += (hay - busca) * 0.06;
        /* Cuantas respuestas hay abiertas: el sistema tiene mas encendido. Se
           consulta cada veinte fotogramas, no en cada uno: preguntarle al DOM
           sesenta veces por segundo por algo que cambia cuando alguien pulsa
           es exactamente el trabajo por fotograma que no hay que hacer. */
        if ((tic++ % 20) === 0) obj = Math.min(1, document.querySelectorAll('.accordion-item.open').length / 3);
        foco += (obj - foco) * 0.05;

        var fx = W * (narrow ? 0.50 : 0.72);          // el frente de lectura
        var ancho = W * (0.30 - 0.10 * busca);
        var elegida = Math.floor((tm * 0.00007) % 1 * 9);

        materia(function (i, u, o) {
          if (u < 0.20) {                              // EL FRENTE DE LECTURA
            var qf = banda(u, 0, 0.20, 1);
            var yy = qf.j;
            o.x = fx + Math.sin(yy * 9.4 + tm * 0.0004) * (5 + 9 * busca);
            o.y = H * (0.10 + yy * 0.80);
            o.a = 0.16 + 0.30 * busca + 0.12 * Math.sin(yy * 22 + tm * 0.0011);
            o.c = busca > 0.4 ? CI.cian : CI.acero;
            o.g = 700;                                  // una sola linea continua
            return;
          }
          /* LAS CONSULTAS: nueve hilos que entran, llegan al frente y esperan. */
          var q = banda(u, 0.20, 1, 9);
          var hilo = q.k, j = q.j;
          var fase = ((tm * 0.00016) + hilo * 0.111) % 1;
          var esta = (hilo === elegida);
          /* Avance del hilo: entra, toca el frente y —si es la elegida— sigue. */
          var av = fase < 0.62 ? (fase / 0.62) : 1;
          var pasa = esta ? clamp((fase - 0.62) / 0.30) : 0;
          var x0 = -W * 0.12, xF = fx - ancho * 0.06;
          var x = x0 + (xF - x0) * ease(av) + (W * 0.30) * ease(pasa);
          var yBase = H * (0.13 + hilo * 0.093);
          o.x = x - (1 - j) * (W * 0.055);              // el hilo tiene longitud
          o.y = yBase + Math.sin(j * 3.1 + hilo + tm * 0.00035) * H * 0.014;
          var cerca = 1 - Math.min(1, Math.abs(o.x - fx) / (W * 0.10));
          o.a = (0.10 + 0.34 * av) * (0.45 + 0.55 * j) * (1 + 0.9 * cerca * (esta ? 1 : 0.25))
              * (1 - 0.55 * pasa * pasa) * (0.72 + 0.5 * foco);
          o.c = pasa > 0.05 ? CI.turq : (esta && cerca > 0.5 ? CI.blanco : (av > 0.9 ? CI.violeta : CI.azul));
          o.g = 710 + hilo;
        }, tm);
        pinta(0.11 + 0.06 * busca, tm);
      }
    };
  })();

  /* BLOG — «lo que se ordena». La otra pagina sin instrumento, y la que mas
     parecia una plantilla: tres tarjetas iguales sobre negro.

     Aqui la materia hace lo que hace un articulo: DESORDEN QUE SE VUELVE
     LEGIBLE. Las particulas empiezan repartidas al azar y se van asentando en
     renglones —lineas de texto, vistas de muy lejos— de arriba abajo, con
     calma. Cuando el ultimo renglon cuaja, la pieza respira y vuelve a
     empezar. No hay prisa: es una pagina para leer, no para impresionar. */
  INSTR.saber = (function () {
    var REN = 11;
    return {
      build: function () { nube(small ? 380 : narrow ? 650 : 980); },
      draw: function (tm) {
        clear(0.26);
        var ciclo = (tm * 0.000042) % 1;                 // 24 s por vuelta
        materia(function (i, u, o) {
          var q = banda(u, 0, 1, REN);
          var ren = q.k, j = q.j;
          /* Cada renglon cuaja en su turno, de arriba abajo. */
          var turno = ren / REN;
          var cuaja = ease(clamp((ciclo - turno * 0.66) / 0.30));
          /* Y se deshace al final de la vuelta, para volver a empezar. */
          var suelta = ease(clamp((ciclo - 0.86) / 0.14));
          var orden = cuaja * (1 - suelta);

          var rx = sd(i, 41), ry = sd(i, 42);
          /* Sitio en el renglon: margen izquierdo comun, largo desigual —como
             un parrafo de verdad, no como una rejilla. */
          var largo = 0.34 + 0.42 * sd(ren, 43);
          var xr = 0.10 + j * largo;
          var yr = 0.13 + ren * (0.74 / (REN - 1));
          o.x = W * (rx * 1.02 - 0.01 + (xr - rx) * orden);
          o.y = H * (ry + (yr - ry) * orden);
          o.a = (0.07 + 0.30 * orden) * (0.6 + 0.4 * Math.sin(j * 3.1416));
          o.c = orden > 0.72 ? (ren % 3 === 0 ? CI.cian : CI.lav)
              : (orden > 0.3 ? CI.azul : CI.acero);
          o.g = orden > 0.5 ? (760 + ren) : -1;          // el renglon se enlaza al cuajar
        }, tm);
        pinta(0.09, tm);
      }
    };
  })();

  INSTR.contacto = (function () {
    var campos = null, fuerza = 0;
    return {
      build: function () { nube(small ? 380 : 730); campos = null; },
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
          var q = banda(u, 0, 1, 7);
          var anillo = q.k, j = q.j;
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
    build: function () { nube(small ? 380 : 760); },
    draw: function (tm) {
      clear(0.30);
      var junta = win(0.06, 0.56);
      materia(function (i, u, o) {
        var q = banda(u, 0, 1, 2);
        var lado = q.k;
        var q2 = banda(q.j, 0, 1, 14);
        var fil = q2.k, j = q2.j;
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
    build: function () { nube(small ? 350 : 700); },
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
        /* Se escribe en azul —es un compromiso que se está redactando— y en
           cuanto la línea llega al final se queda en turquesa: cerrado. Antes
           todo era acero a 0,30 y no se veía escribirse nada. */
        var cerrado = esc > 0.98;
        o.a = j <= esc ? (cerrado ? 0.52 : 0.44) : 0;
        if (j > esc - 0.05 && j <= esc && !cerrado) { o.a = 0.80; o.c = CI.blanco; }
        else o.c = cerrado ? CI.verde : CI.azul;
        o.g = j <= esc ? 1000 + l : -1;
      }, tm);
      pinta(0.10, tm);
    }
  };

  /* DATO — "El dato que se escribe una vez". Entra por un sitio y llega a
     todos los demás sin que nadie lo vuelva a teclear. */
  INSTR.dato = {
    build: function () { nube(small ? 380 : 760); },
    draw: function (tm) {
      clear(0.30);
      var D = small ? 5 : 7;
      /* En su banda: esta página tiene dos columnas de texto y el dato no
         puede atravesarlas para llegar a sus destinos. */
      var X0 = narrow ? 0.08 : 0.62, X1 = narrow ? 0.94 : 0.97;
      var ox = W * X0, oy = H * 0.5;
      materia(function (i, u, o) {
        if (u < 0.40) {
          /* Los destinos: cada uno es un recuadro cerrado que dibujan sus
             propias partículas, no una mancha. Se ve que son sitios. */
          var q = banda(u, 0, 0.40, D);
          var k = q.k;
          var an = q.j * 6.2832;
          o.x = W * (X0 + (X1 - X0) * 0.82) + Math.cos(an) * W * 0.026;
          o.y = H * (0.14 + (k / (D - 1)) * 0.72) + Math.sin(an) * H * 0.032;
          o.a = 0.42; o.c = CI.azul; o.g = 1100 + k;
          return;
        }
        /* El dato viajando: se escribe una vez y va a todos. */
        var q3 = banda(u, 0.40, 1, D);
        var t = ((tm * 0.00028) + sd(i, 96)) % 1;
        var dy = H * (0.14 + (q3.k / (D - 1)) * 0.72);
        o.x = lerp(ox, W * (X0 + (X1 - X0) * 0.82), t);
        o.y = lerp(oy, dy, ease(t));
        o.a = 0.16 + 0.72 * Math.sin(t * 3.1416);
        o.c = t > 0.88 ? CI.verde : CI.cian;
        o.g = -1;
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
        nube(small ? 480 : narrow ? 830 : 1400);
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
    build: function () { nube(small ? 320 : 670); },
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
    build: function () { nube(small ? 320 : 700); },
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
    build: function () { nube(small ? 350 : 730); },
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
      build: function () { nube(small ? 380 : narrow ? 670 : 1020); },
      draw: function (tm) {
        clear(0.30);
        /* La cinta sube a la parte alta de la banda y arranca más a la
           derecha: abajo va la tarjeta ancha de la página y el montaje
           entero quedaba detrás de ella, invisible. */
        var beltY = H * 0.19, bx0 = W * 0.26, bx1 = W * 0.98;
        var est = bx0 + (bx1 - bx0) * 0.62;
        var ciclo = (tm * 0.000065) % 1;
        var per = NUB.length / (CAPAS + 1);

        materia(function (i, u, o) {
          var k = Math.min(CAPAS, (i / per) | 0);
          var j = (i - k * per) / per;

          if (k === CAPAS) {
            /* La pieza que todavía viaja hacia la estación. */
            var uu = (ciclo * 1.6 + j * 0.05) % 1.6;
            var w0 = (small ? 56 : 104);
            var px2 = bx0 + uu * (est - bx0);
            var pp = j * 4, e = pp | 0, f2 = pp - e, hw = w0 / 2, hh = 7;
            var lx, ly;
            if (e === 0)      { lx = -hw + f2 * w0; ly = -hh; }
            else if (e === 1) { lx =  hw;           ly = -hh + f2 * hh * 2; }
            else if (e === 2) { lx =  hw - f2 * w0; ly =  hh; }
            else              { lx = -hw;           ly =  hh - f2 * hh * 2; }
            o.x = px2 + lx; o.y = beltY - 12 + ly;
            o.a = uu < 1 ? 0.74 : 0;
            /* Lo que todavía viaja es material en bruto: azul. */
            o.c = CI.azul; o.g = uu < 1 ? 1200 : -1;
            return;
          }

          var apar = ease((ciclo - k * 0.17) / 0.15);
          var w2 = (small ? 64 : 118) - k * 11;
          var yk = beltY - 32 - k * 22;
          var pp2 = j * 4, e2 = pp2 | 0, f3 = pp2 - e2, hw2 = w2 / 2, hh2 = 9;
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
          /* Bajada de brillo: con el blanco y el ámbar permanentes las
             piezas se velaban unas con otras y el montaje salía como una
             mancha luminosa en vez de como piezas apiladas. Cada capa lleva
             ahora su propia luz —un proyecto se monta con partes distintas—
             y el blanco queda solo para el instante de asentarse. */
          o.a = (0.16 + 0.46 * apar) * (1 - sal * 0.85);
          var CAPACOL = [CI.azul, CI.violeta, CI.cian, CI.lav];
          var golpe = Math.abs(apar - 0.92) < 0.06;
          o.c = sal > 0.05 ? CI.verde : (golpe ? CI.blanco : CAPACOL[k % 4]);
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
        ctx.strokeStyle = rgba(C.cian, 0.26);
        ctx.beginPath(); ctx.moveTo(est, beltY + 8); ctx.lineTo(est, beltY - 108); ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      }
    };
  })();

  /* FINANZAS — "El equilibrio". Lo que entra y lo que sale, en sentidos
     opuestos, y un fiel que busca su punto. */
  INSTR.finanzas = (function () {
    var nivel = 0.5;
    return {
      build: function () { nube(small ? 320 : 670); },
      draw: function (tm) {
        clear(0.30);
        var midY = H * 0.5;
        var ent = 0.5 + 0.5 * Math.sin(tm * 0.00035);
        var sal = 0.5 + 0.5 * Math.sin(tm * 0.00035 + 2.1);
        nivel += ((0.5 + (ent - sal) * 0.30) - nivel) * 0.02;
        materia(function (i, u, o) {
          var q = banda(u, 0, 1, 2);
          var arriba = q.k === 0;
          var carril = banda(q.j, 0, 1, 6);
          var t = ((tm * (arriba ? 0.00022 : 0.00019)) + carril.j) % 1;
          o.x = W * (arriba ? (0.06 + t * 0.88) : (0.94 - t * 0.88));
          o.y = midY + (arriba ? -1 : 1) * (30 + carril.k * 13);
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
    build: function () { nube(small ? 350 : 730); },
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
    build: function () { nube(small ? 320 : 670); },
    draw: function (tm) {
      clear(0.30);
      var cols = small ? 4 : 7, rows = 5, S = cols * rows;
      var gw = W * 0.84, gh = H * 0.64, ox = W * 0.08, oy = H * 0.18;
      var cw = gw / cols, ch = gh / rows;
      materia(function (i, u, o) {
        var q = banda(u, 0, 1, S);
        var k = q.k;
        var c = k % cols, r = (k / cols) | 0;
        var tx = ox + (c + 0.5) * cw, ty = oy + (r + 0.5) * ch;
        /* Cada casilla se archiva por turno y ya no se mueve más. */
        var turno = ((tm * 0.00008) % 1) * S;
        var arch = clamp((turno - k) / 2.2);
        var caida = ease(arch);
        /* Cada expediente es un pequeño recuadro dentro de su casilla: se
           ve archivado, no amontonado. */
        var an2 = q.j * 6.2832;
        o.x = tx + Math.cos(an2) * cw * 0.24;
        o.y = lerp(oy - H * 0.22, ty, caida) + Math.sin(an2) * ch * 0.22;
        o.a = 0.12 + 0.64 * caida;
        o.c = arch >= 1 ? CI.lav : CI.acero;
        o.g = arch > 0.3 ? 1200 + k : -1;
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
    build: function () { nube(small ? 350 : 760); },
    draw: function (tm) {
      clear(0.30);
      var cols = small ? 2 : 4, rows = small ? 3 : 3, S = cols * rows;
      var gw = W * 0.86, gh = H * 0.68, ox = W * 0.07, oy = H * 0.16;
      var pw = gw / cols, ph = gh / rows;
      var foco = Math.floor(((tm * 0.00013) % 1) * S);
      materia(function (i, u, o) {
        var q = banda(u, 0, 1, S);
        var k = q.k, j = q.j;
        var c = k % cols, r = (k / cols) | 0;
        var px2 = ox + c * pw, py2 = oy + r * ph;
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
