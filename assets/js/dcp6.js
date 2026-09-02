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
  var N = 0, PT = [], ORD = [], SPR = [], MEM = [], VIG = [];

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

    /* La celosía del estado 4, en coordenadas normalizadas 0..1. */
    MEM = []; VIG = [];
    var bays = narrow ? 3 : 4, lv = 3;
    var x0 = 0.06, x1 = 0.94, yb = 0.94, yt = 0.10;
    var bw = (x1 - x0) / bays, lh = (yb - yt) / lv;
    var c, l;
    MEM.push({ ax: x0, ay: yb, bx: x1, by: yb, t: -0.12, k: 'base' });   // el suelo
    for (c = 0; c <= bays; c++) {                                        // pilares
      MEM.push({ ax: x0 + c * bw, ay: yb, bx: x0 + c * bw, by: yt, t: 0.04, k: 'pil' });
    }
    for (l = 1; l <= lv; l++) {                                          // vigas
      VIG.push(MEM.length);
      MEM.push({ ax: x0, ay: yb - l * lh, bx: x1, by: yb - l * lh, t: 0.14 + (l / lv) * 0.46, k: 'vig' });
    }
    for (l = 0; l < lv; l++) {                                           // diagonales
      for (c = 0; c < bays; c++) {
        var d0 = yb - l * lh, d1 = yb - (l + 1) * lh;
        var f = (l + c) % 2 === 0;
        MEM.push({ ax: x0 + c * bw, ay: f ? d0 : d1,
                   bx: x0 + (c + 1) * bw, by: f ? d1 : d0,
                   t: 0.20 + (l / lv) * 0.46, k: 'dia' });
      }
    }
    sprites();
  }

  /* ------------------------------------------------------- COMPOSICIÓN */
  /* Cada estado ocupa el espacio a su manera. Esto es lo que rompe la
     monotonía de "texto a un lado, animación al otro". */
  var MARCO = [
    { x: 0.50, y: 0.48, w: 1.00, h: 1.00, d: 1.00 },  // 0 a pantalla completa
    { x: 0.56, y: 0.50, w: 1.00, h: 0.94, d: 0.88 },  // 1 disperso y ancho
    { x: 0.775, y: 0.44, w: 0.34, h: 0.40, d: 0.62 }, // 2 íntimo y preciso
    { x: 0.735, y: 0.50, w: 0.46, h: 0.60, d: 0.80 }, // 3 medio
    { x: 0.635, y: 0.52, w: 0.70, h: 1.02, d: 1.00 }, // 4 MONUMENTAL
    { x: 0.700, y: 0.50, w: 0.34, h: 0.52, d: 0.78 },  // 5 circuito compacto
    { x: 0.895, y: 0.50, w: 0.15, h: 0.84, d: 0.66 }, // 6 columna estrecha
    { x: 0.760, y: 0.47, w: 0.38, h: 0.56, d: 0.86 }, // 7 instrumento denso
    { x: 0.500, y: 0.47, w: 0.86, h: 0.84, d: 1.00 }  // 8 envolvente
  ];
  /* Cuánta de la materia participa; el resto queda como bruma de fondo. Así
     la densidad cambia de una sección a otra en vez de ser siempre la misma. */
  var USO = [1.00, 0.90, 0.46, 0.68, 1.00, 0.55, 0.50, 0.62, 1.00];

  /* ------------------------------------------------------- FORMACIONES */
  /* Todas escriben en o.nx, o.ny (0..1 dentro del marco), o.a, o.g, o.c. */
  var TAU = 6.2832;
  var o1 = { nx: 0, ny: 0, a: 1, g: -1, c: 6 };

  /* LA PRUEBA DE LOS DOS SEGUNDOS. Cada formación tiene que entenderse
     mirándola dos segundos, sin leer el texto. Por eso ninguna es geometría
     abstracta: todas se apoyan en un arquetipo que cualquiera reconoce —un
     embudo, una celosía, un circuito, un archivo con un hueco, un anillo de
     componentes—. Si una forma necesita explicación técnica, está mal. */

  /* 0 · ANÁLISIS — una máquina de analizar, de arriba abajo: cae un
     revoltijo → se aprieta en una GARGANTA → y se posa abajo como barras de
     distinta altura, un resultado ya clasificado. Va en vertical, en la banda
     libre de la derecha: el titular ocupa la izquierda y la máquina tiene que
     verse entera, no medio tapada. El resto del encuadre queda como
     atmósfera profunda, que es lo que hace grande a la portada. */
  function F0(i, u, g, G, o, tm, ins) {
    var X0 = 0.63, X1 = 0.99, AN = X1 - X0;           // la banda de la máquina
    var maq = sd(i, 10) > 0.34;                       // el resto es atmósfera

    if (!maq) {
      var hx = sd(i, 16), hy = sd(i, 17);
      o.nx = hx * 0.62 + Math.sin(tm * 0.00012 + i) * 0.006;
      o.ny = hy + Math.cos(tm * 0.00010 + i) * 0.008;
      o.a = 0.10 + 0.14 * sd(i, 18);
      o.c = 6; o.g = -1;
      return;
    }

    var col   = Math.floor(sd(i, 12) * 8);            // su columna de salida
    var alto  = 0.20 + sd(col + 1, 13) * 0.52;        // cada una mide distinto
    var t = (sd(i, 14) + tm * 0.00009) % 1;
    var y = -0.08 + t * 1.20;

    var xEnt = X0 + sd(i, 11) * AN;                   // entra desordenado
    var xCol = X0 + (col + 0.5) * (AN / 8);           // sale en su columna
    var kG = cl((y - 0.16) / 0.24);                   // la garganta aprieta
    var kS = cl((y - 0.46) / 0.08);                   // y suelta ya clasificado
    var x = lerp(lerp(xEnt, X0 + AN * 0.5, kG * kG), xCol, kS);

    /* La barra termina donde le toca: por eso es un resultado y no una raya. */
    var fin = 0.54 + alto * 0.44;
    var pasado = cl((y - fin) / 0.05);
    o.nx = x;
    o.ny = Math.min(y, fin + 0.010);
    o.a = (0.26 + 0.34 * kG + 0.50 * kS) * (1 - pasado);
    o.c = kS > 0.6 ? (col < 3 ? 0 : 1) : 6;
    o.g = (kS > 0.75 && pasado < 0.5) ? 100 + col : (y < 0.16 ? 60 + (col % 5) : -1);
    /* La garganta: el punto más brillante del recorrido, donde se decide. */
    var dg = y - 0.46;
    o.a += 0.95 * Math.exp(-dg * dg * 1100) * (1 - Math.abs(x - (X0 + AN * 0.5)) * 5.0);
  }

  /* 1 · SIN SISTEMA — actividad real, pero sin sistema. Se ve lo que dice el
     texto: rutas que se cruzan mal, TRES CALCADAS una al lado de otra —lo
     mismo hecho en tres sitios— y trayectos que se paran a medio camino y
     amontonan ahí lo que llevaban. */
  function F1(i, u, g, G, o, tm, ins) {
    var dup = (g % 9) < 3;                            // el trío calcado
    var src = dup ? 2 : g;
    var off = dup ? ((g % 9) - 1) * 0.055 : 0;        // separadas y paralelas
    var sx = 0.04 + sd(src, 21) * 0.90, sy = 0.07 + sd(src, 22) * 0.86;
    var ex = 0.04 + sd(src, 23) * 0.90, ey = 0.07 + sd(src, 24) * 0.86;
    var cx = (sx + ex) / 2 + Math.cos(sd(src, 25) * TAU) * 0.32;
    var cy = (sy + ey) / 2 + Math.sin(sd(src, 26) * TAU) * 0.32;
    var muere = (src % 4) === 1;
    /* El que muere no llega: se para y lo que llevaba se apila en el corte. */
    var corte = 0.46 + sd(src, 27) * 0.16;
    var uu = muere ? Math.min(u, corte + (u - corte) * 0.04) : u;
    var m = 1 - uu;
    o.nx = m * m * sx + 2 * m * uu * cx + uu * uu * ex + off;
    o.ny = m * m * sy + 2 * m * uu * cy + uu * uu * ey + off * 0.35;
    if (muere && u > corte) {
      o.a = 0.30 + 0.34 * Math.sin(tm * 0.0016 + i);  // parpadea, atascado
      o.c = 4;                                        // el rosa: lo que falla
      o.g = -1;
    } else {
      o.a = 0.34 + 0.22 * Math.sin(u * 9 + tm * 0.0011 + g);
      o.c = dup ? 3 : 6;
      o.g = g;
    }
  }

  /* 2 · DETECCIÓN — el MISMO motivo, exacto, en tres puntos del campo. Se
     acota entre marcas y se enciende; todo lo demás se apaga de golpe. */
  function F2(i, u, g, G, o, tm, ins) {
    var R = 3;
    var k = g % (R + 2);
    var hallado = ease((ins - 0.14) / 0.30);
    if (k < R) {
      var sy2 = 0.15 + k * 0.33;
      var mo = Math.sin(u * TAU * 1.5), mv = Math.sin(u * TAU * 0.5);
      o.nx = 0.11 + u * 0.78;
      o.ny = sy2 + mo * 0.082 + mv * 0.028;
      o.a = 0.14 + 0.86 * hallado;
      o.c = hallado > 0.5 ? 0 : 6;
      o.g = 200 + k;
    } else {
      /* Las marcas que acotan cada hallazgo: cuatro esquinas por motivo. */
      var q = g % 4, kk = (g / 4 | 0) % R;
      var ex2 = q < 2 ? 0.08 : 0.83, ey2 = 0.15 + kk * 0.33 + (q % 2 ? 0.09 : -0.09);
      if (sd(i, 30) > 0.55) {
        o.nx = ex2 + (u - 0.5) * 0.05; o.ny = ey2;
        o.a = 0.70 * hallado; o.c = 7; o.g = -1;
        return;
      }
      o.nx = sd(i, 31); o.ny = sd(i, 32);
      o.a = 0.22 * (1 - hallado * 0.90);
      o.c = 6; o.g = -1;
    }
  }

  /* 3 · PERTENENCIA — lo suelto sube en columnas hacia su parte, se coloca
     dentro, y cuando las partes ya están llenas se enlazan ENTRE ELLAS: se
     decide qué va con qué. */
  function F3(i, u, g, G, o, tm, ins) {
    var K = narrow ? 3 : 4;
    var per = N / K;
    var k = Math.min(K - 1, (i / per) | 0);
    var j = i - k * per;
    var cols = 6, rows = Math.ceil(per / cols);
    var bx = 0.07 + k * (0.90 / K), bw = (0.90 / K) * 0.70;
    var lleg = ease((ins - 0.04 - (j / per) * 0.42) / 0.28);
    var tx = bx + ((j % cols) + 0.5) * (bw / cols);
    var ty = 0.10 + ((((j / cols) | 0) % rows) + 0.5) * (0.66 / rows);

    /* El enlace entre partes: unos pocos viajan de una parte a la vecina. */
    var puente = (g % 23) === 7 && k < K - 1;
    var pu = ease((ins - 0.62) / 0.30);
    if (puente && pu > 0) {
      var bx2 = 0.07 + (k + 1) * (0.90 / K);
      var pt = ((tm * 0.00035) + k * 0.3) % 1;
      o.nx = lerp(bx + bw, bx2, pt);
      o.ny = 0.83 - Math.sin(pt * 3.1416) * 0.10;
      o.a = 0.80 * pu; o.c = 5; o.g = -1;
      return;
    }
    /* Antes de pertenecer, sube desde abajo en columna: se ve llegar. */
    o.nx = lerp(tx + (sd(i, 33) - 0.5) * 0.05, tx, lleg);
    o.ny = lerp(1.10 + sd(i, 34) * 0.30, ty, lleg);
    o.a = 0.14 + 0.54 * lleg;
    o.c = lleg > 0.7 ? (k % 2 ? 2 : 1) : 6;
    o.g = lleg > 0.6 ? 300 + k : -1;
  }

  /* 4 · CONSTRUCCIÓN — el momento grande. Base, pilares que suben del suelo,
     vigas que salvan la luz, diagonales que arriostran y la instalación por
     encima. Las piezas ENTRAN desde fuera del encuadre y encajan. */
  function F4(i, u, g, G, o, tm, ins) {
    var tend = (g % 11) === 5;
    if (tend && VIG.length) {
      var vg = MEM[VIG[g % VIG.length]];
      var lay = ease((ins - 0.62) / 0.32);
      o.nx = lerp(vg.ax, vg.bx, u);
      o.ny = vg.ay - 0.035 - 0.015 * lay;
      o.a = 0.70 * lay;
      o.c = lay > 0.5 ? 0 : 6;
      o.g = lay > 0.2 ? 400 + (g % VIG.length) : -1;
      return;
    }
    var m = MEM[g % MEM.length];
    var sube = ease((ins - 0.06 - m.t * 0.62) / 0.24);
    var tx = lerp(m.ax, m.bx, u), ty = lerp(m.ay, m.by, u);
    var ex = tx + (tx - 0.5) * 1.9 + (sd(i, 41) - 0.5) * 0.5;
    var ey = ty - 0.85 - sd(i, 42) * 0.5;
    o.nx = lerp(ex, tx, sube);
    o.ny = lerp(ey, ty, sube);
    o.a = 0.10 + 0.82 * sube;
    if (sube > 0.55 && sube < 0.98) o.a += 0.55 * Math.sin((sube - 0.55) / 0.43 * 3.1416);
    o.c = m.k === 'base' ? 6 : (sube > 0.96 ? 1 : 7);
    /* Solo enlaza cuando ya está casi asentada: si no, el enlace dibuja el
       viaje y la estructura se ve sucia mientras se monta. */
    o.g = sube > 0.62 ? 500 + (g % MEM.length) : -1;
  }

  /* 5 · AUTOMATIZACIÓN — un circuito cerrado con estaciones: lo que termina
     en una dispara la siguiente. Puesto en marcha, vuelve al principio. */
  function F5(i, u, g, G, o, tm, ins) {
    var EST = 5;
    var ciclo = (tm * 0.00012) % 1;
    var act = Math.floor(ciclo * EST);
    var esEst = (g % 3) === 0;
    if (esEst) {
      var k = g % EST;
      var ang = (k / EST) * TAU - 1.5708;
      var pulso = (k === act) ? 1 : 0;
      var rr = 0.34 + pulso * 0.035;
      o.nx = 0.5 + Math.cos(ang) * rr * 0.72 + Math.cos(u * TAU) * 0.024;
      o.ny = 0.5 + Math.sin(ang) * rr + Math.sin(u * TAU) * 0.058;
      o.a = 0.16 + 0.80 * pulso;
      o.c = pulso ? 5 : 6;
      o.g = 600 + k;
    } else {
      var t = (u * 0.5 + ciclo) % 1;
      var a2 = t * TAU - 1.5708;
      o.nx = 0.5 + Math.cos(a2) * 0.34 * 0.72;
      o.ny = 0.5 + Math.sin(a2) * 0.34;
      var cerca = Math.abs(((t * EST) % 1) - 0.5) * 2;
      o.a = 0.12 + 0.62 * (1 - cerca);
      o.c = 0; o.g = -1;
    }
  }

  /* 6 · CAPACIDAD — «Piezas que ya existen. Y las que falten.» Una columna de
     módulos llenos y UN HUECO VACÍO, marcado a trazos. Después llega la pieza
     que falta desde fuera, se instala, y el hueco deja de estar vacío. */
  function F6(i, u, g, G, o, tm, ins) {
    var M = 6, k = g % M;
    var falta = (k === 3);
    var llega = ease((ins - 0.34) / 0.30);            // la pieza que faltaba
    var my = 0.05 + k * 0.160, mh = 0.112;

    var p = u * 4, e = p | 0, f = p - e, lx, ly;
    if (e === 0)      { lx = f;       ly = 0; }
    else if (e === 1) { lx = 1;       ly = f; }
    else if (e === 2) { lx = 1 - f;   ly = 1; }
    else              { lx = 0;       ly = 1 - f; }

    if (falta) {
      /* El hueco: a trazos y apagado mientras está vacío; la pieza entra
         desde la derecha y al llegar el contorno se cierra y se enciende. */
      var trazo = Math.abs(Math.sin(u * 25.0)) > 0.45 ? 1 : 0;
      o.nx = lerp(1.9, lx, llega);
      o.ny = my + ly * mh;
      o.a = llega < 0.5 ? 0.30 * trazo : lerp(0.30 * trazo, 0.80, (llega - 0.5) * 2);
      o.c = llega > 0.7 ? 5 : 6;
      o.g = llega > 0.6 ? 700 + k : -1;
      return;
    }
    /* Los módulos que ya existen, con su puerto de conexión a la derecha. */
    var puerto = (g % 17) === 4;
    if (puerto) {
      o.nx = 1 + u * 0.55; o.ny = my + mh * 0.5;
      o.a = 0.44; o.c = 6; o.g = -1;
      return;
    }
    o.nx = lx; o.ny = my + ly * mh;
    o.a = 0.20 + 0.58 * Math.abs(Math.sin(u * 3 + k));
    o.c = 6;
    o.g = 700 + k;
  }

  /* 7 · FINANCE — esta sección ya se explica sola con el panel del producto,
     así que la materia no compite: hace lo que dice el texto. Todo lo que el
     sistema produce ENTRA por la derecha y converge en el panel. */
  function F7(i, u, g, G, o, tm, ins) {
    var L = 7, l = g % L;
    var t = ((sd(i, 71) + tm * 0.00013) % 1);
    var x = 1.10 - t * 1.24;                          // viaja hacia el panel
    var yl = 0.10 + l * 0.132;
    var conv = cl((0.85 - x) / 0.75);                 // y converge al llegar
    o.nx = x;
    o.ny = lerp(yl, 0.50, conv * conv);
    /* Se enciende según se acerca: llega, no solo pasa. */
    o.a = 0.10 + 0.74 * conv;
    o.c = conv > 0.72 ? 5 : (conv > 0.4 ? 0 : 6);
    o.g = 800 + l;
  }

  /* 8 · RESULTADO — no una esfera: un ANILLO DE COMPONENTES conectados que
     rodea al titular. Cada nodo es una pieza del sistema, el anillo los une y
     un pulso los recorre. Estás dentro de algo que funciona. */
  function F8(i, u, g, G, o, tm, ins) {
    var NODOS = narrow ? 8 : 12;
    var esNodo = (g % 5) < 2;
    var giro = tm * 0.000022;
    if (esNodo) {
      /* Los componentes: pequeños módulos repartidos por el anillo. */
      var k = g % NODOS;
      var ang = (k / NODOS) * TAU + giro;
      var cx = 0.5 + Math.cos(ang) * 0.46, cy = 0.5 + Math.sin(ang) * 0.46;
      var p = u * 4, e = p | 0, f = p - e, s2 = 0.034;
      var lx2, ly2;
      if (e === 0)      { lx2 = -s2 + f * s2 * 2; ly2 = -s2; }
      else if (e === 1) { lx2 =  s2;              ly2 = -s2 + f * s2 * 2; }
      else if (e === 2) { lx2 =  s2 - f * s2 * 2; ly2 =  s2; }
      else              { lx2 = -s2;              ly2 =  s2 - f * s2 * 2; }
      /* El pulso que recorre el sistema, nodo a nodo. */
      var vivo = Math.abs(((tm * 0.00016) % 1) * NODOS - k) < 0.9 ? 1 : 0;
      o.nx = cx + lx2 * 0.86; o.ny = cy + ly2;
      o.a = 0.34 + 0.56 * vivo;
      o.c = vivo ? 0 : 1;
      o.g = 900 + k;
    } else {
      /* El anillo que los une: continuo, sin cortes. */
      var a3 = u * TAU + giro;
      o.nx = 0.5 + Math.cos(a3) * 0.46 * 0.86;
      o.ny = 0.5 + Math.sin(a3) * 0.46;
      var frente = Math.abs(((a3 - giro) / TAU % 1) - ((tm * 0.00016) % 1));
      o.a = 0.13 + 0.52 * Math.exp(-frente * frente * 120);
      o.c = 6;
      o.g = 950;
    }
  }

  var FORM = [F0, F1, F2, F3, F4, F5, F6, F7, F8];
  var GRP  = [1, 26, 22, 1, 0, 24, 22, 20, 22];   // 0 = usar MEM.length, 1 = por partícula

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
    var GA = GRP[iA] || MEM.length, GB = GRP[iB] || MEM.length;
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
      var ga = GA === 1 ? i : (i * GA / N) | 0, ua = GA === 1 ? sd(i, 61) : (i * GA / N) - ga;
      var gb = GB === 1 ? i : (i * GB / N) | 0, ub = GB === 1 ? sd(i, 61) : (i * GB / N) - gb;

      var frac = i / N;
      var enA = frac < usoA, enB = frac < usoB;

      if (enA) { oa.a = 1; oa.g = -1; oa.c = 6; FA(i, ua, ga, GA, oa, tm, insA); }
      else     { oa.nx = p.hx; oa.ny = p.hy; oa.a = 0.10; oa.g = -1; oa.c = 6; }
      if (enB) { ob.a = 1; ob.g = -1; ob.c = 6; FB(i, ub, gb, GB, ob, tm, insB); }
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
