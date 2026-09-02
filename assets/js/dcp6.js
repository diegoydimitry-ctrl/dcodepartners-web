/* ============================================================================
   D-CODE PARTNERS — LA MATERIA (portada)
   ----------------------------------------------------------------------------
   UNA SOLA MATERIA. NUEVE ESTADOS. CADA UNO SIGNIFICA LO QUE DICE EL TEXTO.

   Tres cosas sostienen esta portada, y ninguna es decorativa:

   1 · MATERIA CONTINUA. Existe un único conjunto de partículas durante todo
       el recorrido. La partícula 412 es la partícula 412 en los nueve
       estados; lo que cambia es la FORMACIÓN hacia la que viaja. Nada
       aparece ni desaparece: se desplaza, se reorganiza, se agrupa, se
       separa, construye, conecta y crece.

   2 · PROFUNDIDAD REAL. Tres estratos. Lo lejano es grande, difuso y lento;
       lo cercano, pequeño, nítido y rápido. Cada estrato se desplaza a
       distinta velocidad con el scroll y el puntero, y se pinta de lejos a
       cerca. Una luz recorre el campo y roza lo que tiene delante. Eso es lo
       que separa una nube de puntos de una materia con cuerpo.

   3 · COMPOSICIÓN POR SECCIÓN. Cada estado ocupa el espacio de otra manera:
       hay un momento monumental, otro íntimo y preciso, una banda
       horizontal, una columna estrecha, una envolvente. Si todas las
       secciones fueran "texto a un lado, animación al otro", el recorrido
       sería predecible a los diez segundos.

   LAS NUEVE FORMACIONES — cada una responde a: si quitas el texto, ¿se
   intuye el concepto?

     0 ANÁLISIS      información dispersa siendo interpretada: un frente de
                     lectura separa la señal del ruido y la señal se alinea
     1 SIN SISTEMA   rutas que se cruzan mal, tres calcadas — lo mismo hecho
                     en tres sitios — y trayectos que mueren sin destino
     2 DETECCIÓN     el mismo patrón exacto aparece en varios puntos, queda
                     acotado y se enciende; lo demás se apaga
     3 PERTENENCIA   lo suelto emigra a partes definidas, y las partes
                     descubren que se conectan entre sí
     4 CONSTRUCCIÓN  base, pilares que suben desde el suelo, vigas que salvan
                     la luz, diagonales que arriostran y la instalación por
                     encima. El momento monumental del recorrido.
     5 AUTOMATIZACIÓN un ciclo cerrado: lo que termina una estación dispara
                     la siguiente. Puesto en marcha, sigue solo.
     6 CAPACIDAD     módulos con puerto; entra uno que faltaba y cada módulo
                     gana una rama. Ahora soporta más que antes.
     7 RÉGIMEN       órbitas que se ciñen vuelta a vuelta: lo mismo, cada vez
                     con menos desperdicio
     8 RESULTADO     todo lo anterior en un solo cuerpo estable y enlazado,
                     rodeando a quien lee
   ========================================================================= */
(function () {
  'use strict';

  var root = document.querySelector('[data-field]');
  if (!root) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse  = window.matchMedia('(pointer: coarse)').matches;

  var ACERO = [150, 178, 226];
  var COL = [
    [128, 222, 234],  // 0 cian
    [ 91, 140, 255],  // 1 azul eléctrico
    [124, 108, 255],  // 2 violeta
    [167, 139, 250],  // 3 lavanda
    [255, 107, 157],  // 4 rosa   (solo para lo que falla)
    [ 45, 212, 191],  // 5 turquesa (solo para lo que ya funciona)
    ACERO,            // 6 acero: la mayoría
    [226, 240, 255]   // 7 blanco: el destello
  ];
  function rgba(h, a) { return 'rgba(' + h[0] + ',' + h[1] + ',' + h[2] + ',' + a + ')'; }
  function sd(i, s) { var x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }
  function cl(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }

  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  root.appendChild(canvas);
  var ctx = canvas.getContext('2d', { alpha: false });

  var W = 0, H = 0, dpr = 1, narrow = false, small = false;
  var N = 0, PT = [], ORD = [], SPR = [];

  /* Un destello por color Y POR ESTRATO. El lejano es ancho y sin núcleo —
     así es como se ve algo desenfocado —; el cercano tiene núcleo duro. */
  function sprites() {
    SPR = [];
    for (var e = 0; e < 3; e++) {
      var fila = [];
      for (var i = 0; i < COL.length; i++) {
        var cv = document.createElement('canvas'), R = 32;
        cv.width = cv.height = R * 2;
        var g = cv.getContext('2d');
        var gr = g.createRadialGradient(R, R, 0, R, R, R);
        if (e === 0) {                         // lejos: difuso, sin núcleo
          gr.addColorStop(0,    rgba(COL[i], 0.64));
          gr.addColorStop(0.42, rgba(COL[i], 0.34));
          gr.addColorStop(1,    rgba(COL[i], 0));
        } else if (e === 1) {                  // medio
          gr.addColorStop(0,    rgba(COL[i], 0.86));
          gr.addColorStop(0.26, rgba(COL[i], 0.40));
          gr.addColorStop(0.66, rgba(COL[i], 0.09));
          gr.addColorStop(1,    rgba(COL[i], 0));
        } else {                               // cerca: núcleo duro y nítido
          gr.addColorStop(0,    rgba(COL[i], 1));
          gr.addColorStop(0.13, rgba(COL[i], 0.80));
          gr.addColorStop(0.34, rgba(COL[i], 0.22));
          gr.addColorStop(0.72, rgba(COL[i], 0.04));
          gr.addColorStop(1,    rgba(COL[i], 0));
        }
        g.fillStyle = gr; g.fillRect(0, 0, R * 2, R * 2);
        fila.push(cv);
      }
      SPR.push(fila);
    }
  }

  function measure() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    W = root.clientWidth; H = root.clientHeight;
    narrow = W < 900; small = W < 620;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#05070e'; ctx.fillRect(0, 0, W, H);
    build();
  }

  function build() {
    N = small ? 420 : narrow ? 760 : 1250;
    PT = []; ORD = [];
    for (var i = 0; i < N; i++) {
      var r = sd(i, 1), r2 = sd(i, 2), r3 = sd(i, 3);
      /* Tres estratos con reparto desigual: más lejos que cerca, como en
         cualquier profundidad real. */
      var e = r < 0.42 ? 0 : (r < 0.78 ? 1 : 2);
      var z = e === 0 ? 0.22 + r * 0.30 : (e === 1 ? 0.52 + r2 * 0.26 : 0.80 + r2 * 0.32);
      PT.push({
        e: e, z: z,
        s: 0.62 + r2 * 0.86,
        c: 6,
        dl: r2 * 0.30,                 // la reorganización es una ola
        vx: 0, vy: 0, x: -1, y: 0,
        hx: sd(i, 4), hy: sd(i, 5)     // sitio en la bruma de fondo
      });
      ORD.push(i);
    }
    /* De lejos a cerca: lo cercano tapa a lo lejano, no al revés. */
    ORD.sort(function (a, b) { return PT[a].z - PT[b].z; });

    figuras();
    sprites();
  }

  /* ------------------------------------------------------- COMPOSICIÓN */
  /* Cada estado ocupa el espacio a su manera: monumental, íntimo, ancho,
     envolvente. La escala forma parte del significado. */
  var MARCO = [
    { x: 0.795, y: 0.50, w: 0.34, h: 0.94, d: 1.00 },  // 0 FARO      vertical
    { x: 0.755, y: 0.50, w: 0.40, h: 0.76, d: 0.88 },  // 1 MARAÑA    el nudo
    { x: 0.770, y: 0.46, w: 0.30, h: 0.62, d: 0.72 },  // 2 LUPA      íntima
    { x: 0.730, y: 0.52, w: 0.46, h: 0.52, d: 0.84 },  // 3 PUENTE    horizontal
    { x: 0.640, y: 0.505, w: 0.64, h: 0.94, d: 1.00 }, // 4 GRÚA      MONUMENTAL
    { x: 0.720, y: 0.50, w: 0.34, h: 0.56, d: 0.82 },  // 5 ENGRANAJES
    { x: 0.830, y: 0.545, w: 0.36, h: 0.76, d: 0.86 }, // 6 ÁRBOL
    { x: 0.775, y: 0.185, w: 0.30, h: 0.32, d: 0.84 }, // 7 BALANZA  (arriba)
    { x: 0.500, y: 0.58, w: 1.00, h: 0.72, d: 1.00 }   // 8 CIUDAD    envolvente
  ];
  /* Cuánta materia participa en la figura; el resto es atmósfera de fondo. */
  var USO = [0.88, 0.86, 0.72, 0.80, 1.00, 0.74, 0.82, 0.70, 1.00];

  /* ---------------------------------------------------------- FIGURAS */
  /* LA REGLA: las partículas forman SILUETAS RECONOCIBLES, no geometría.
     Cada figura es un conjunto de trazos reales; se muestrea su contorno a
     una tabla y cada partícula ocupa un punto de ese contorno. Como el
     enlace une partículas consecutivas del mismo trazo, la silueta la
     dibujan ellas: un faro es un faro, una grúa es una grúa.

     Nueve objetos, uno por estado, elegidos para que en dos segundos y sin
     leer una palabra se entienda de qué se está hablando:

       FARO        miramos · MARAÑA     el lío de partida
       LUPA        encontramos · PUENTE   decidimos qué va con qué
       GRÚA        construimos · ENGRANAJES  funciona solo
       ÁRBOL       crece · BALANZA      control · CIUDAD  el resultado   */

  var TAU = 6.2832;
  function pt(x, y) { return [x, y]; }
  function arco(cx, cy, r, a0, a1, n, ar) {
    var p = [];
    for (var i = 0; i <= n; i++) {
      var a = a0 + (a1 - a0) * (i / n);
      p.push([cx + Math.cos(a) * r * (ar || 1), cy + Math.sin(a) * r]);
    }
    return p;
  }
  function caja(x0, y0, x1, y1) {
    return [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]];
  }

  /* Muestreo del contorno a una tabla: buscar el punto es entonces un
     acceso a un índice, no un recorrido. Con 1250 partículas y dos figuras
     activas por fotograma, esa diferencia es la que permite 60 fps. */
  function prep(trazos) {
    var M = 1600;
    var LX = new Float32Array(M), LY = new Float32Array(M), LG = new Int16Array(M);
    var segs = [], total = 0, si, k;
    for (si = 0; si < trazos.length; si++) {
      var q = trazos[si];
      for (k = 1; k < q.length; k++) {
        var dx = q[k][0] - q[k - 1][0], dy = q[k][1] - q[k - 1][1];
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d <= 0) continue;
        segs.push({ a: q[k - 1], b: q[k], d: d, acc: total, g: si });
        total += d;
      }
    }
    if (!total) total = 1;
    var j = 0;
    for (var m = 0; m < M; m++) {
      var dist = (m / M) * total;
      while (j < segs.length - 1 && dist > segs[j].acc + segs[j].d) j++;
      var sg = segs[j];
      var f = sg.d > 0 ? (dist - sg.acc) / sg.d : 0;
      f = f < 0 ? 0 : f > 1 ? 1 : f;
      LX[m] = sg.a[0] + (sg.b[0] - sg.a[0]) * f;
      LY[m] = sg.a[1] + (sg.b[1] - sg.a[1]) * f;
      LG[m] = sg.g;
    }
    return { X: LX, Y: LY, G: LG, M: M, n: trazos.length };
  }
  function enFig(fig, t, o, gb) {
    var m = (t * fig.M) | 0;
    if (m < 0) m = 0; else if (m >= fig.M) m = fig.M - 1;
    o.nx = fig.X[m]; o.ny = fig.Y[m]; o.g = gb + fig.G[m];
  }

  var FG = {}, CIU_ALT = [], CIU_BW = 0.1;
  function figuras() {
    var i, k, t;

    /* FARO — miramos cómo trabajas de verdad. Torre, linterna, tejado y la
       roca sobre la que se levanta. El haz se dibuja aparte, porque barre. */
    var faro = [];
    faro.push([[0.20, 0.90], [0.335, 0.90], [0.425, 0.33]]);          // fuste izq.
    faro.push([[0.80, 0.90], [0.665, 0.90], [0.575, 0.33]]);          // fuste der.
    faro.push([[0.405, 0.33], [0.595, 0.33]]);                        // galería
    faro.push(caja(0.435, 0.32, 0.565, 0.21));                        // linterna
    faro.push([[0.395, 0.21], [0.50, 0.10], [0.605, 0.21]]);          // tejado
    faro.push([[0.50, 0.10], [0.50, 0.045]]);                         // remate
    faro.push([[0.365, 0.57], [0.635, 0.57]]);                        // anillos
    faro.push([[0.31, 0.75], [0.69, 0.75]]);
    faro.push([[0.06, 0.955], [0.28, 0.90], [0.50, 0.925], [0.72, 0.90], [0.96, 0.955]]);  // roca
    FG.faro = prep(faro);

    /* MARAÑA — casi siempre empieza igual: hilos que se enredan, se cruzan
       y no llevan a ninguna parte. Es un nudo, y se reconoce como un nudo. */
    /* Un NUDO, no hilos sueltos: bucles apretados que se cruzan una y otra
       vez sobre el mismo sitio. Repartidos por la pantalla no dicen nada;
       enmarañados sí. */
    var mar = [];
    for (k = 0; k < 9; k++) {
      var q = [];
      var f0 = 2.4 + sd(k, 41) * 3.2, f1 = 3.1 + sd(k, 42) * 3.6;
      var ph0 = sd(k, 43) * 6.2832, ph1 = sd(k, 44) * 6.2832;
      for (i = 0; i <= 60; i++) {
        t = (i / 60) * 6.2832;
        q.push([0.50 + Math.sin(t * f0 * 0.34 + ph0) * 0.30 + Math.cos(t + ph1) * 0.13,
                0.50 + Math.cos(t * f1 * 0.34 + ph1) * 0.28 + Math.sin(t + ph0) * 0.12]);
      }
      mar.push(q);
    }
    FG.marana = prep(mar);

    /* LUPA — el sistema encuentra lo que se repite. Lente, aro y mango. */
    var ar2 = (MARCO[2].h * H) / (MARCO[2].w * W);
    var lupa = [];
    lupa.push(arco(0.40, 0.30, 0.215, 0, TAU, 44, ar2));         // aro exterior
    lupa.push(arco(0.40, 0.30, 0.185, 0, TAU, 38, ar2));         // aro interior
    /* El mango: sin él una lupa es un círculo y no significa nada. Va grueso
       —tres trazos paralelos— porque tiene que verse a la primera. */
    var ha = 0.83;
    var hx = 0.40 + Math.cos(ha) * 0.20 * ar2, hy = 0.30 + Math.sin(ha) * 0.20;
    var dx2 = Math.cos(ha) * 0.40 * ar2, dy2 = Math.sin(ha) * 0.40;
    for (var q = -1; q <= 1; q++) {
      var ox2 = -Math.sin(ha) * q * 0.020 * ar2, oy2 = Math.cos(ha) * q * 0.020;
      lupa.push([[hx + ox2, hy + oy2], [hx + dx2 + ox2, hy + dy2 + oy2]]);
    }
    lupa.push([[hx + dx2 - Math.sin(ha) * 0.022 * ar2, hy + dy2 + Math.cos(ha) * 0.022],
               [hx + dx2 + Math.sin(ha) * 0.022 * ar2, hy + dy2 - Math.cos(ha) * 0.022]]);
    FG.lupa = prep(lupa);

    /* PUENTE — decidimos qué va con qué: dos orillas y lo que las une. */
    var pu = [];
    pu.push([[0.00, 0.34], [1.00, 0.34]]);                 // tablero
    pu.push([[0.00, 0.40], [1.00, 0.40]]);
    for (k = 0; k < 3; k++) {
      var cx2 = 0.20 + k * 0.30;
      pu.push(arco(cx2, 0.40, 0.145, 0, 3.1416, 22, 1.0));   // el arco sostiene
      pu.push([[cx2 - 0.145, 0.40], [cx2 - 0.145, 0.86]]);
      pu.push([[cx2 + 0.145, 0.40], [cx2 + 0.145, 0.86]]);
    }
    pu.push([[0.00, 0.86], [1.00, 0.86]]);                 // suelo
    FG.puente = prep(pu);

    /* GRÚA — se levanta la estructura. Torre arriostrada, pluma, contrapluma,
       tirantes, cable y gancho. Y el edificio que va subiendo debajo. */
    var gr = [];
    gr.push([[0.30, 0.98], [0.30, 0.16]]);                 // torre
    gr.push([[0.40, 0.98], [0.40, 0.16]]);
    for (k = 0; k < 9; k++) {                              // celosía de la torre
      var y0 = 0.98 - k * 0.091, y1 = 0.98 - (k + 1) * 0.091;
      gr.push(k % 2 ? [[0.30, y0], [0.40, y1]] : [[0.40, y0], [0.30, y1]]);
      gr.push([[0.30, y1], [0.40, y1]]);
    }
    gr.push([[0.06, 0.16], [0.96, 0.16]]);                 // pluma
    gr.push([[0.06, 0.205], [0.96, 0.205]]);
    gr.push([[0.35, 0.16], [0.35, 0.04], [0.35, 0.16]]);   // mástil
    gr.push([[0.35, 0.04], [0.94, 0.16]]);                 // tirantes
    gr.push([[0.35, 0.04], [0.08, 0.16]]);
    gr.push([[0.74, 0.205], [0.74, 0.56]]);                // cable
    gr.push(caja(0.68, 0.56, 0.80, 0.62));                 // carga colgando
    gr.push([[0.00, 0.98], [1.00, 0.98]]);                 // suelo
    FG.grua = prep(gr);

    /* La obra: la estructura que la grúa está levantando. Aparte, porque
       crece con el avance. */
    var ob = [];
    for (k = 0; k < 4; k++) {
      var oy = 0.92 - k * 0.115;
      ob.push([[0.52, oy], [0.96, oy]]);
    }
    for (k = 0; k < 4; k++) {
      var ox = 0.52 + k * 0.1466;
      ob.push([[ox, 0.92], [ox, 0.575]]);
    }
    FG.obra = prep(ob);

    /* ENGRANAJES — el trabajo circula solo. Dos ruedas dentadas engranadas.
       Se generan al vuelo porque giran, pero el perfil es de engranaje. */

    /* ÁRBOL — piezas que ya existen, y las que falten. Tronco y ramas; una
       de ellas todavía está creciendo. */
    /* El marco es más alto que ancho, así que la componente horizontal de
       cada rama se corrige: sin esto el árbol sale aplastado y parece un
       palo. Cuatro niveles de bifurcación: una copa, no dos ramitas. */
    var ar6 = (MARCO[6].h * H) / (MARCO[6].w * W);
    var arb = [];
    arb.push([[0.435, 0.99], [0.462, 0.62]]);              // tronco
    arb.push([[0.565, 0.99], [0.538, 0.62]]);
    arb.push([[0.30, 0.99], [0.70, 0.99]]);                // suelo
    function rama(x, y, an, len, prof, out) {
      var x2 = x + Math.cos(an) * len * ar6, y2 = y + Math.sin(an) * len;
      out.push([[x, y], [x2, y2]]);
      if (prof <= 0) return;
      rama(x2, y2, an - 0.46 - prof * 0.04, len * 0.72, prof - 1, out);
      rama(x2, y2, an + 0.44 + prof * 0.04, len * 0.70, prof - 1, out);
    }
    rama(0.50, 0.62, -1.5708, 0.165, 5, arb);
    FG.arbol = prep(arb);

    /* BALANZA — un sistema financiero completo: lo que entra, lo que sale, y
       el fiel buscando su punto. */
    var ar7 = (MARCO[7].h * H) / (MARCO[7].w * W);
    var bal = [];
    bal.push([[0.50, 0.92], [0.50, 0.22]]);                // columna
    bal.push([[0.30, 0.96], [0.70, 0.96]]);                // base
    bal.push([[0.38, 0.92], [0.62, 0.92]]);
    bal.push(arco(0.50, 0.19, 0.045, 0, TAU, 14, ar7));    // el fiel
    FG.balanza = prep(bal);

    /* CIUDAD — el resultado: todo lo anterior, construido y funcionando. */
    var ciu = [];
    var alturas = narrow ? [0.34, 0.52, 0.40, 0.62, 0.46, 0.58, 0.36]
                         : [0.30, 0.46, 0.36, 0.58, 0.42, 0.66, 0.38, 0.54, 0.32, 0.48, 0.40];
    var nb = alturas.length, bw2 = 0.92 / nb;
    CIU_ALT = alturas; CIU_BW = bw2;
    for (k = 0; k < nb; k++) {
      var bx = 0.04 + k * bw2, by = 0.98 - alturas[k];
      ciu.push([[bx + 0.008, 0.98], [bx + 0.008, by], [bx + bw2 - 0.008, by], [bx + bw2 - 0.008, 0.98]]);
      if (k % 3 === 1) ciu.push([[bx + bw2 * 0.5, by], [bx + bw2 * 0.5, by - 0.07]]);  // antena
    }
    ciu.push([[0.00, 0.98], [1.00, 0.98]]);
    FG.ciudad = prep(ciu);
  }

  /* ------------------------------------------------------- FORMACIONES */
  var o1 = { nx: 0, ny: 0, a: 1, g: -1, c: 6 };

  /* 0 · FARO — «Miramos cómo trabajas de verdad». Un faro sobre la roca y su
     haz barriendo la oscuridad. Observación: se entiende sin leer nada. */
  function F0(i, u, g, G, o, tm, ins) {
    /* El haz barre la oscuridad. Es lo que convierte una torre en un faro y
       lo que dice, sin una palabra, que aquí se está MIRANDO. */
    var haz = (i % 5) < 2;
    var barr = Math.sin(tm * 0.00011) * 0.62;
    if (haz) {
      var k = ((i / 5) | 0);
      var j = (k / Math.max(1, N / 5)) % 1;                 // avance por el haz
      var w2 = ((k * 0.618) % 1) - 0.5;                      // ancho del cono
      var an = barr + w2 * 0.34;
      var lar = 0.22 + j * 4.6;                              // sale del encuadre
      o.nx = 0.50 - Math.sin(an) * lar;
      o.ny = 0.265 - Math.cos(an) * lar * 0.055 - j * 0.02;
      /* Se abre y se apaga con la distancia, como la luz de verdad. */
      o.a = 0.62 * (1 - j * 0.86) * (1 - j * 0.86) * (1 - Math.abs(w2) * 1.2);
      o.c = 0; o.g = -1;
      return;
    }
    enFig(FG.faro, u, o, 100);
    var lat = 0.5 + 0.5 * Math.sin(tm * 0.0016);
    var esLuz = o.ny < 0.33 && o.ny > 0.20;
    o.a = 0.44 + (esLuz ? 0.50 * lat : 0.12 * Math.sin(u * 11 + tm * 0.0006));
    o.c = esLuz ? 7 : 6;
  }

  /* 1 · MARAÑA — «Casi siempre empieza igual». Un nudo de hilos que se
     cruzan, se repiten y no llegan a ninguna parte. */
  function F1(i, u, g, G, o, tm, ins) {
    enFig(FG.marana, u, o, 200);
    o.nx += Math.sin(tm * 0.0004 + i) * 0.004;
    o.ny += Math.cos(tm * 0.0004 + i) * 0.004;
    /* Uno de los hilos está atascado y parpadea: no llega. */
    var atasco = (o.g % 7) === 3;
    o.a = atasco ? 0.28 + 0.34 * Math.abs(Math.sin(tm * 0.0016 + i)) : 0.46;
    o.c = atasco ? 4 : 6;
  }

  /* 2 · LUPA — «El sistema encuentra lo que se repite». Una lupa, y dentro
     el patrón hallado, encendido. Fuera, lo que no importa se apaga. */
  function F2(i, u, g, G, o, tm, ins) {
    var hallado = ease((ins - 0.12) / 0.34);
    var dentro = (i % 7) < 2;
    if (dentro) {
      /* El patrón encontrado: el mismo motivo, tres veces, dentro del cristal. */
      var k = ((i / 7) | 0) % 3;
      var j = (((i / 7) | 0) / Math.max(1, N / 7)) % 1;
      var ar2 = (MARCO[2].h * H) / (MARCO[2].w * W);
      o.nx = 0.40 + (j - 0.5) * 0.25 * ar2;
      o.ny = 0.30 + (k - 1) * 0.072 + Math.sin(j * 12.566) * 0.024;
      o.a = 0.16 + 0.80 * hallado;
      o.c = hallado > 0.5 ? 0 : 6;
      o.g = 300 + k;
      return;
    }
    enFig(FG.lupa, u, o, 320);
    o.a = 0.30 + 0.36 * hallado;
    o.c = 6;
  }

  /* 3 · PUENTE — «Decidimos qué va con qué». Dos orillas y lo que las une.
     Se construye de una orilla a la otra según se avanza. */
  function F3(i, u, g, G, o, tm, ins) {
    var cruza = (i % 9) === 4;
    var tendido = ease((ins - 0.04) / 0.52);
    if (cruza && tendido > 0.92) {
      /* Y una vez unido, algo cruza: el puente sirve para algo. */
      var t = ((tm * 0.00030) + sd(i, 54)) % 1;
      o.nx = t; o.ny = 0.315;
      o.a = 0.80 * Math.sin(t * 3.1416);
      o.c = 5; o.g = -1;
      return;
    }
    enFig(FG.puente, u, o, 400);
    /* Se tiende de izquierda a derecha: no aparece hecho. */
    var puesto = o.nx <= tendido * 1.06;
    o.a = puesto ? 0.44 : 0.04;
    o.c = 6;
    if (!puesto) o.g = -1;
  }

  /* 4 · GRÚA — «Se levanta la estructura». El momento monumental: una grúa
     torre con su pluma, sus tirantes y su carga colgando, y debajo la obra
     que va subiendo planta a planta. */
  function F4(i, u, g, G, o, tm, ins) {
    var enObra = (i % 5) < 2;
    if (enObra) {
      enFig(FG.obra, u, o, 500);
      /* La obra sube de abajo arriba con el avance. */
      var alto = 0.92 - ease(ins) * 0.40;
      var puesto = o.ny >= alto;
      o.a = puesto ? 0.52 : 0.03;
      o.c = puesto ? 1 : 6;
      if (!puesto) o.g = -1;
      return;
    }
    enFig(FG.grua, u, o, 520);
    /* La carga baja y sube: la grúa está trabajando ahora mismo. */
    var vaiven = Math.sin(tm * 0.00045) * 0.5 + 0.5;
    if (o.ny > 0.54 && o.ny < 0.64) { o.ny += vaiven * 0.16; o.c = 7; }
    else if (o.nx > 0.735 && o.nx < 0.745 && o.ny > 0.20) { o.ny += 0; o.c = 6; }
    else o.c = 6;
    var monta = ease((ins - 0.02) / 0.34);
    o.a = 0.16 + 0.62 * monta;
  }

  /* 5 · ENGRANAJES — «El trabajo circula». Dos ruedas dentadas engranadas:
     una mueve a la otra y no para. Si funciona, se ve que funciona. */
  function F5(i, u, g, G, o, tm, ins) {
    var ar5 = (MARCO[5].h * H) / (MARCO[5].w * W);
    var gir = tm * 0.00028;
    var chica = (i % 5) < 2;
    var cx = chica ? 0.665 : 0.335, cy = chica ? 0.605 : 0.375;
    var R = chica ? 0.17 : 0.26, D = chica ? 8 : 12;
    var sent = chica ? -1 : 1;
    var brazo = (i % 17) === 3;
    var j = sd(i, 58);
    if (brazo) {
      /* Los radios: sin ellos una rueda dentada es solo un círculo. */
      var b = ((i / 17) | 0) % D;
      var ab = (b / D) * TAU + gir * sent;
      var rr = j * R * 0.82;
      o.nx = cx + Math.cos(ab) * rr * ar5;
      o.ny = cy + Math.sin(ab) * rr;
      o.a = 0.26; o.c = 6; o.g = 600 + (chica ? 40 : 0) + b;
      return;
    }
    /* El perfil dentado. */
    var n = D * 4;
    var m = Math.floor(j * n), f = j * n - m;
    var a0 = ((m + f) / n) * TAU + gir * sent;
    var dd = (m % 4 < 2) ? R : R * 0.74;
    o.nx = cx + Math.cos(a0) * dd * ar5;
    o.ny = cy + Math.sin(a0) * dd;
    o.a = 0.44 + 0.24 * Math.abs(Math.sin(a0 * 3));
    o.c = chica ? 5 : 6;
    o.g = (chica ? 660 : 610) + (m % 4 < 2 ? 0 : 1);
  }

  /* 6 · ÁRBOL — «Piezas que ya existen. Y las que falten». Un árbol cuyas
     ramas son las capacidades; una de ellas todavía está creciendo. */
  function F6(i, u, g, G, o, tm, ins) {
    enFig(FG.arbol, u, o, 700);
    var nueva = (o.g % 11) === 6;                    // la rama que falta
    var crece = ease((ins - 0.34) / 0.40);
    if (nueva) {
      /* Crece desde su nacimiento, no aparece hecha. */
      o.nx = lerp(0.50, o.nx, crece);
      o.ny = lerp(0.62, o.ny, crece);
      o.a = 0.70 * crece; o.c = 5;
      if (crece < 0.2) o.g = -1;
      return;
    }
    o.a = 0.42 + 0.26 * Math.abs(Math.sin(u * 7 + o.g));
    o.c = o.ny < 0.55 ? 0 : 6;
  }

  /* 7 · BALANZA — «Un sistema financiero completo». Los platillos se mueven
     con lo que entra y lo que sale, y el fiel busca su punto. */
  function F7(i, u, g, G, o, tm, ins) {
    var ar7 = (MARCO[7].h * H) / (MARCO[7].w * W);
    var incl = Math.sin(tm * 0.00022) * 0.055 * (1 - ease(ins) * 0.72);
    var brazo = (i % 4) < 2;
    if (brazo) {
      /* El brazo y los dos platillos, que suben y bajan. */
      var j = sd(i, 61);
      var lado = ((i / 4) | 0) % 2;
      if (j < 0.5) {                                  // el brazo
        o.nx = 0.14 + (j / 0.5) * 0.72;
        o.ny = 0.22 + (o.nx - 0.50) * incl / 0.36 * 0.36;
        o.a = 0.46; o.c = 6; o.g = 800;
        return;
      }
      var px2 = lado ? 0.86 : 0.14;
      var py2 = 0.22 + (px2 - 0.50) * incl / 0.36 * 0.36;
      var jj = (j - 0.5) / 0.5;
      if (jj < 0.36) { o.nx = px2; o.ny = py2 + jj / 0.36 * 0.20; o.a = 0.34; }
      else {
        var aa = 3.1416 * ((jj - 0.36) / 0.64);
        o.nx = px2 + Math.cos(aa) * 0.11 * ar7;
        o.ny = py2 + 0.20 + Math.sin(aa) * 0.055;
        o.a = 0.52;
      }
      o.c = lado ? 5 : 0; o.g = 810 + lado;
      return;
    }
    enFig(FG.balanza, u, o, 830);
    o.a = 0.40; o.c = 6;
  }

  /* 8 · CIUDAD — «Empecemos». Todo lo anterior, construido: una ciudad de
     luz. Las ventanas se van encendiendo. Es el final del viaje. */
  function F8(i, u, g, G, o, tm, ins) {
    var vent = (i % 3) < 1;
    if (vent) {
      /* Las ventanas: la ciudad está habitada, no es una maqueta. */
      var k = (i / 3) | 0;
      var nb2 = CIU_ALT.length;
      var b = k % nb2;                                   // a qué edificio va
      var m2 = (k / nb2) | 0;
      var cols2 = 3, fil = (m2 / cols2 | 0) % 9, col = m2 % cols2;
      var bx2 = 0.04 + b * CIU_BW;
      o.nx = bx2 + CIU_BW * (0.24 + col * 0.26);
      o.ny = 0.93 - fil * 0.055;
      var techo = 0.98 - CIU_ALT[b];
      var dentro = o.ny > techo + 0.03;                  // solo dentro del suyo
      var ence = ((tm * 0.00007) + sd(i, 64)) % 1;
      o.a = dentro ? (ence < 0.62 ? 0.66 : 0.09) : 0;
      o.c = ence < 0.30 ? 6 : (ence < 0.5 ? 0 : 1);
      o.g = -1;
      return;
    }
    enFig(FG.ciudad, u, o, 900);
    o.a = 0.58 + 0.16 * Math.sin(u * 5 + o.g);
    o.c = 6;
  }

  var FORM = [F0, F1, F2, F3, F4, F5, F6, F7, F8];

  /* --------------------------------------------------- ESTADOS Y SCROLL */
  var STOPS = [], MIR = [];
  var NST = 9;
  function measureStops() {
    var zones = document.querySelectorAll('[data-state]');
    var d = document.documentElement;
    var max = Math.max(1, d.scrollHeight - window.innerHeight);
    var found = [];
    zones.forEach(function (z) {
      var n = parseInt(z.getAttribute('data-state'), 10);
      if (isNaN(n)) return;
      var r = z.getBoundingClientRect();
      found[n] = Math.max(0, Math.min(1, (r.top + window.scrollY + r.height / 2 - window.innerHeight / 2) / max));
      MIR[n] = z.classList.contains('v6-step--r');
    });
    STOPS = [];
    for (var i = 0; i < NST; i++) STOPS[i] = (found[i] !== undefined) ? found[i] : (i / (NST - 1));
    for (var j = 1; j < STOPS.length; j++) if (STOPS[j] <= STOPS[j - 1]) STOPS[j] = STOPS[j - 1] + 0.004;
    var last = STOPS[STOPS.length - 1];
    if (last > 1) for (var k = 0; k < STOPS.length; k++) STOPS[k] /= last;
  }
  var wA = 0, wB = 0, iA = 0, iB = 0, tw = 0;
  function weights(P) {
    var i = 0;
    while (i < STOPS.length - 2 && P > STOPS[i + 1]) i++;
    var t = cl((P - STOPS[i]) / Math.max(0.0001, STOPS[i + 1] - STOPS[i]));
    iA = i; iB = i + 1; tw = t;
    var e = ease(t); wA = 1 - e; wB = e;
  }
  function inside(n) {
    var a = STOPS[Math.max(0, n - 1)], b = STOPS[Math.min(NST - 1, n + 1)];
    return ease((Pv - a) / Math.max(0.0001, b - a));
  }

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
    P = cl(window.scrollY / Math.max(1, d.scrollHeight - window.innerHeight));
  }
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { readScroll(); ticking = false; if (reduced) drawStill(); });
  }, { passive: true });

  /* ------------------------------------------------------------- PINTA */
  var oa = { nx: 0, ny: 0, a: 1, g: -1, c: 6 }, ob = { nx: 0, ny: 0, a: 1, g: -1, c: 6 };
  var px = new Float32Array(1400), py = new Float32Array(1400);
  var pg = new Int32Array(1400), pa = new Float32Array(1400);

  /* Al reflejar hay que mover TAMBIÉN el marco al lado libre: invertir solo
     el contenido dejaba la formación encima de la columna de texto. */
  function marco(o, fr, mir, out) {
    var cx = mir ? 1 - fr.x : fr.x;
    var nx = mir ? 1 - o.nx : o.nx;
    out.x = W * (cx + (nx - 0.5) * fr.w);
    out.y = H * (fr.y + (o.ny - 0.5) * fr.h);
  }
  var ma = { x: 0, y: 0 }, mb = { x: 0, y: 0 };

  function draw(tm, noClear) {
    weights(reduced ? P : Pv);
    cmx += (mx - cmx) * 0.045; cmy += (my - cmy) * 0.045;

    ctx.globalCompositeOperation = 'source-over';
    var trans = Math.sin(tw * 3.1416);
    ctx.fillStyle = noClear ? 'rgba(5,7,14,0.10)'
                            : 'rgba(5,7,14,' + (0.30 - 0.13 * trans).toFixed(3) + ')';
    ctx.fillRect(0, 0, W, H);

    var FA = FORM[iA], FB = FORM[iB];
    var frA = MARCO[iA], frB = MARCO[iB];
    var insA = inside(iA), insB = inside(iB);
    var usoA = USO[iA], usoB = USO[iB];
    var par = narrow ? 0 : 1;

    /* La luz que recorre el campo y roza lo que tiene delante. */
    var lz = (tm * 0.00007) % 1.6 - 0.3;
    var lx = W * lz, ly = H * (0.42 + 0.16 * Math.sin(tm * 0.00019));
    var lr = Math.max(W, H) * 0.30, lr2 = lr * lr;

    ctx.globalCompositeOperation = 'lighter';

    for (var q = 0; q < N; q++) {
      var i = ORD[q];                       // de lejos a cerca
      var p = PT[i];
      var ua = i / N, ub = i / N;

      var frac = i / N;
      var enA = frac < usoA, enB = frac < usoB;

      if (enA) { oa.a = 1; oa.g = -1; oa.c = 6; FA(i, ua, 0, 0, oa, tm, insA); }
      else     { oa.nx = p.hx; oa.ny = p.hy; oa.a = 0.10; oa.g = -1; oa.c = 6; }
      if (enB) { ob.a = 1; ob.g = -1; ob.c = 6; FB(i, ub, 0, 0, ob, tm, insB); }
      else     { ob.nx = p.hx; ob.ny = p.hy; ob.a = 0.10; ob.g = -1; ob.c = 6; }

      marco(oa, frA, MIR[iA], ma);
      marco(ob, frB, MIR[iB], mb);

      /* Cada partícula sale hacia la formación siguiente en su instante. */
      var t = cl((tw - p.dl) / (1 - p.dl)); t = t * t * (3 - 2 * t);
      var tx = lerp(ma.x, mb.x, t), ty = lerp(ma.y, mb.y, t);
      var al = lerp(oa.a, ob.a, t);
      var dep = lerp(frA.d, frB.d, t);

      /* LA TRANSFORMACIÓN. Entre dos secciones la materia no se desliza: se
         SUELTA y se vuelve a reunir. A mitad de camino recibe un empuje
         radial y gana luz, así que se ve romperse y rehacerse en la forma
         siguiente. Es lo que convierte el scroll en una transformación y no
         en un cambio de diapositiva. */
      var disp = Math.sin(tw * 3.1416);
      if (disp > 0.01) {
        var adx = tx - W * 0.5, ady = ty - H * 0.5;
        var ad = Math.sqrt(adx * adx + ady * ady) || 1;
        var emp = disp * disp * (0.35 + p.z * 0.85);
        tx += (adx / ad) * emp * 62;
        ty += (ady / ad) * emp * 40;
        al += disp * 0.26;
      }

      if (p.x < 0) { p.x = tx; p.y = ty; }
      p.vx += (tx - p.x) * 0.10; p.vy += (ty - p.y) * 0.10;
      p.vx *= 0.75; p.vy *= 0.75;
      p.x += p.vx; p.y += p.vy;

      /* Paralaje por estrato: lo cercano se mueve más que lo lejano. */
      var pf = 0.30 + p.z * 1.10;
      var dx = p.x + cmx * 34 * pf * par;
      var dy = p.y + cmy * 22 * pf * par;

      px[i] = dx; py[i] = dy; pa[i] = al;
      pg[i] = (t < 0.5) ? oa.g : ob.g;

      /* La luz roza: no ilumina todo por igual. */
      var ldx = dx - lx, ldy = dy - ly;
      var luz = Math.exp(-(ldx * ldx + ldy * ldy) / lr2) * 0.42;

      var sp = Math.min(1.10, Math.sqrt(p.vx * p.vx + p.vy * p.vy) * 0.20);
      var r = (1.05 + p.s * 2.5) * (0.55 + p.z * 1.15) * (1 + sp) * dep;
      var a2 = (al + luz) * (0.40 + p.z * 0.72) * (0.68 + 0.32 * dep);
      if (a2 <= 0.012) continue;
      var spr = SPR[p.e][(t < 0.5 ? oa.c : ob.c)];
      if (a2 > 0.40) {
        /* Halo: solo lo que de verdad brilla lo tiene, y por eso significa
           algo cuando aparece. */
        var rb = r * 3.0;
        ctx.globalAlpha = Math.min(0.20, (a2 - 0.40) * 0.42);
        ctx.drawImage(spr, dx - rb, dy - rb, rb * 2, rb * 2);
      }
      ctx.globalAlpha = Math.min(0.80, a2);
      ctx.drawImage(spr, dx - r, dy - r, r * 2, r * 2);
    }

    /* El enlace une partículas CONSECUTIVAS DEL MISMO GRUPO: la estructura
       la dibujan ellas, no una línea añadida por encima. */
    ctx.globalAlpha = 1; ctx.lineWidth = 1;
    var afl = 0.5 - 0.42 * Math.abs(tw - 0.5) * 2;
    ctx.beginPath();
    for (var k2 = 1; k2 < N; k2++) {
      if (pg[k2] < 0 || pg[k2] !== pg[k2 - 1]) continue;
      var ddx = px[k2] - px[k2 - 1], ddy = py[k2] - py[k2 - 1];
      if (ddx * ddx + ddy * ddy > 30000) continue;
      ctx.moveTo(px[k2 - 1], py[k2 - 1]); ctx.lineTo(px[k2], py[k2]);
    }
    ctx.strokeStyle = rgba(ACERO, 0.045 + 0.14 * afl);
    ctx.stroke();

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  /* ------------------------------------------------------------- BUCLE */
  var running = false, visible = true;
  function loop(tm) {
    if (!running) return;
    Pv += (P - Pv) * 0.075;
    draw(tm);
    if (visible) requestAnimationFrame(loop); else running = false;
  }
  function start() { if (!running && !reduced) { running = true; requestAnimationFrame(loop); } }
  /* Movimiento reducido: una exposición larga, quieta, tomada en un instante
     en el que cada formación ya tiene algo que enseñar. */
  function drawStill() {
    for (var i = 0; i < N; i++) PT[i].x = -1;
    draw(7000, false);
    for (var j = 1; j < 42; j++) draw(7000 + j * 110, true);
  }

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

  /* --------------------------------- EL ESTADO, EN PALABRAS ------------- */
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
