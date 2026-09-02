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
    { x: 0.54, y: 0.50, w: 1.02, h: 0.94, d: 0.72 },  // 1 disperso y ancho
    { x: 0.775, y: 0.44, w: 0.34, h: 0.40, d: 0.62 }, // 2 íntimo y preciso
    { x: 0.735, y: 0.50, w: 0.46, h: 0.60, d: 0.80 }, // 3 medio
    { x: 0.635, y: 0.52, w: 0.70, h: 1.02, d: 1.00 }, // 4 MONUMENTAL
    { x: 0.700, y: 0.50, w: 0.34, h: 0.52, d: 0.78 },  // 5 circuito compacto
    { x: 0.895, y: 0.50, w: 0.15, h: 0.84, d: 0.66 }, // 6 columna estrecha
    { x: 0.760, y: 0.47, w: 0.38, h: 0.56, d: 0.86 }, // 7 instrumento denso
    { x: 0.500, y: 0.46, w: 1.06, h: 1.06, d: 1.00 }  // 8 envolvente
  ];
  /* Cuánta de la materia participa; el resto queda como bruma de fondo. Así
     la densidad cambia de una sección a otra en vez de ser siempre la misma. */
  var USO = [1.00, 0.72, 0.46, 0.68, 1.00, 0.55, 0.50, 0.62, 1.00];

  /* ------------------------------------------------------- FORMACIONES */
  /* Todas escriben en o.nx, o.ny (0..1 dentro del marco), o.a, o.g, o.c. */
  var TAU = 6.2832;
  var o1 = { nx: 0, ny: 0, a: 1, g: -1, c: 6 };

  /* 0 · ANÁLISIS — información dispersa que está siendo interpretada. Un
     frente de lectura la recorre: a su paso, lo que es SEÑAL se alinea en
     filas y viaja al punto de análisis; lo que es RUIDO se dispersa y baja.
     Si quitas el texto: algo está leyendo mucha información y separando lo
     que importa de lo que no. */
  function F0(i, u, g, G, o, tm, ins) {
    /* La información NO está suelta: llega en trayectorias. Las partículas de
       una misma trayectoria son CONSECUTIVAS, así que el enlace las dibuja y
       se ven como recorridos, no como puntos sueltos. Un frente de lectura
       las recorre y separa la señal del ruido: la señal abandona su
       trayectoria, se alinea en filas y converge en el punto de análisis; el
       ruido se abre y baja de nivel. */
    var TR = narrow ? 16 : 26;
    var per = N / TR;
    var tr = Math.min(TR - 1, (i / per) | 0);
    var j = (i - tr * per) / per;
    var a0 = sd(tr, 11), a1 = sd(tr, 12), a2 = sd(tr, 13);

    var bx = -0.08 + j * 1.18;
    var by = 0.05 + a0 * 0.90
           + Math.sin(j * 3.1 + a1 * 6.28) * 0.10
           + Math.sin(j * 7.4 + a2 * 6.28) * 0.032;

    var frente = ((tm * 0.000062) % 1.46) - 0.26;
    var d = bx - frente;
    var leido = cl(-d / 0.16);
    var senal = sd(i, 14) > 0.68;

    if (senal) {
      var fila = Math.floor(sd(i, 15) * 7);
      var fy = 0.20 + fila * 0.100;
      var conv = cl((-d - 0.24) / 0.38);
      o.nx = lerp(bx, lerp(bx, 0.965, conv * conv), leido);
      o.ny = lerp(by, lerp(fy, 0.50, conv * conv), leido);
      o.a = 0.30 + 0.44 * leido + 0.50 * conv;
      o.c = conv > 0.55 ? 1 : (leido > 0.4 ? 0 : 6);
      /* Mientras es señal alineada forma fila; al converger deja de enlazar. */
      o.g = (leido > 0.65 && conv < 0.45) ? 100 + fila : -1;
    } else {
      o.nx = bx + leido * 0.045;
      o.ny = by + leido * (by - 0.5) * 0.55;
      o.a = 0.40 - 0.30 * leido;
      o.c = 6;
      /* Antes de ser leída, la trayectoria se ve entera. */
      o.g = leido < 0.30 ? 60 + tr : -1;
    }
    /* El frente de lectura: la banda más brillante de toda la portada. */
    o.a += 1.05 * Math.exp(-d * d * 120);
  }

  /* 1 · SIN SISTEMA — una empresa funcionando, pero sin sistema: rutas que
     se cruzan mal, TRES CALCADAS (lo mismo hecho en tres sitios) y trayectos
     que se apagan sin llegar a ninguna parte. */
  function F1(i, u, g, G, o, tm, ins) {
    var dup = (g % 8) < 3;                       // tres rutas idénticas
    var src = dup ? 2 : g;
    var off = dup ? (g % 8) * 0.035 : 0;
    var sx = 0.04 + sd(src, 21) * 0.92, sy = 0.06 + sd(src, 22) * 0.88;
    var ex = 0.04 + sd(src, 23) * 0.92, ey = 0.06 + sd(src, 24) * 0.88;
    var cx = (sx + ex) / 2 + Math.cos(sd(src, 25) * TAU) * 0.30;
    var cy = (sy + ey) / 2 + Math.sin(sd(src, 26) * TAU) * 0.30;
    var muere = (src % 5) === 2;                 // no lleva a ninguna parte
    var uu = muere ? Math.min(u, 0.54) : u;
    var m = 1 - uu;
    o.nx = m * m * sx + 2 * m * uu * cx + uu * uu * ex + off;
    o.ny = m * m * sy + 2 * m * uu * cy + uu * uu * ey + off * 0.4;
    o.a = muere && u > 0.54 ? 0.04 : 0.34 + 0.20 * Math.sin(u * 9 + tm * 0.0011 + g);
    o.c = muere ? (u > 0.5 ? 4 : 6) : (dup ? 3 : 6);
    o.g = muere && u > 0.54 ? -1 : g;
  }

  /* 2 · DETECCIÓN — el MISMO patrón, exacto, aparece en varios puntos del
     campo. Queda acotado entre marcas y se enciende; lo demás se apaga.
     Si quitas el texto: algo escondido acaba de ser encontrado. */
  function F2(i, u, g, G, o, tm, ins) {
    var R = 3;                                   // tres repeticiones
    var k = g % (R + 2);
    var hallado = ease((ins - 0.14) / 0.34);
    if (k < R) {
      var sy2 = 0.16 + k * 0.32;
      /* motivo idéntico en los tres: por eso se reconoce como patrón */
      var mo = Math.sin(u * TAU * 1.5), mv = Math.sin(u * TAU * 0.5);
      o.nx = 0.10 + u * 0.80;
      o.ny = sy2 + mo * 0.085 + mv * 0.030;
      o.a = 0.16 + 0.80 * hallado;
      o.c = hallado > 0.5 ? 0 : 6;
      o.g = 200 + k;
    } else {
      /* Lo que no es el patrón se retira. */
      o.nx = sd(i, 31); o.ny = sd(i, 32);
      o.a = 0.20 * (1 - hallado * 0.86);
      o.c = 6; o.g = -1;
    }
  }

  /* 3 · PERTENENCIA Y CONEXIÓN — lo suelto emigra a partes definidas; y
     cuando ya pertenece, las partes descubren que se conectan entre sí.
     Antes eran cosas separadas; ahora son un sistema. */
  function F3(i, u, g, G, o, tm, ins) {
    var K = narrow ? 3 : 4;
    var per = N / K;
    var k = Math.min(K - 1, (i / per) | 0);
    var j = i - k * per;
    var cols = 6, rows = Math.ceil(per / cols);
    var bx = 0.06 + k * (0.92 / K), bw = (0.92 / K) * 0.74;
    var lleg = ease((ins - 0.06 - (j / per) * 0.40) / 0.30);
    var tx = bx + ((j % cols) + 0.5) * (bw / cols);
    var ty = 0.10 + ((((j / cols) | 0) % rows) + 0.5) * (0.80 / rows);
    o.nx = lerp(0.5 + Math.cos(i * 2.4) * 0.42, tx, lleg);
    o.ny = lerp(0.5 + Math.sin(i * 3.1) * 0.46, ty, lleg);
    o.a = 0.16 + 0.50 * lleg;
    o.c = lleg > 0.7 ? (k % 2 ? 2 : 1) : 6;
    o.g = lleg > 0.6 ? 300 + k : -1;
  }

  /* 4 · CONSTRUCCIÓN — el momento grande. Se establece una base, suben los
     pilares desde el suelo, las vigas salvan la luz, las diagonales
     arriostran y por encima se tiende la instalación. Las piezas ENTRAN
     desde fuera del encuadre y encajan: no aparecen, llegan. */
  function F4(i, u, g, G, o, tm, ins) {
    var tend = (g % 11) === 5;                   // la instalación, por encima
    if (tend && VIG.length) {
      var vg = MEM[VIG[g % VIG.length]];
      var lay = ease((ins - 0.62) / 0.32);
      o.nx = lerp(vg.ax, vg.bx, u);
      o.ny = vg.ay - 0.035 - 0.015 * lay;
      o.a = 0.66 * lay;
      o.c = lay > 0.5 ? 0 : 6;
      o.g = lay > 0.2 ? 400 + (g % VIG.length) : -1;
      return;
    }
    var m = MEM[g % MEM.length];
    var sube = ease((ins - 0.06 - m.t * 0.62) / 0.24);
    var tx = lerp(m.ax, m.bx, u), ty = lerp(m.ay, m.by, u);
    /* Antes de encajar, la pieza viene de fuera del encuadre. */
    var ex = tx + (tx - 0.5) * 1.9 + (sd(i, 41) - 0.5) * 0.5;
    var ey = ty - 0.85 - sd(i, 42) * 0.5;
    o.nx = lerp(ex, tx, sube);
    o.ny = lerp(ey, ty, sube);
    o.a = 0.10 + 0.78 * sube;
    /* La soldadura: un destello solo mientras la pieza está entrando. */
    if (sube > 0.55 && sube < 0.98) o.a += 0.5 * Math.sin((sube - 0.55) / 0.43 * 3.1416);
    o.c = m.k === 'base' ? 6 : (sube > 0.96 ? 1 : 7);
    o.g = sube > 0.30 ? 500 + (g % MEM.length) : -1;
  }

  /* 5 · AUTOMATIZACIÓN — un ciclo cerrado. Lo que termina en una estación
     dispara la siguiente. Puesto en marcha, sigue funcionando solo. */
  function F5(i, u, g, G, o, tm, ins) {
    var EST = 5;
    var ciclo = (tm * 0.00012) % 1;
    var act = Math.floor(ciclo * EST);           // la estación activa ahora
    var esEst = (g % 3) === 0;
    if (esEst) {
      /* Las estaciones: puntos fijos del circuito, que se encienden por turno. */
      var k = g % EST;
      var ang = (k / EST) * TAU - 1.5708;
      var pulso = (k === act) ? 1 : 0;
      var rr = 0.34 + pulso * 0.03;
      o.nx = 0.5 + Math.cos(ang) * rr * 0.72;
      o.ny = 0.5 + Math.sin(ang) * rr;
      o.nx += Math.cos(u * TAU) * 0.022;
      o.ny += Math.sin(u * TAU) * 0.055;
      o.a = 0.18 + 0.72 * pulso;
      o.c = pulso ? 5 : 6;
      o.g = 600 + k;
    } else {
      /* Lo que circula: recorre el ciclo y llega justo a la que se enciende. */
      var t = (u * 0.5 + ciclo) % 1;
      var a2 = t * TAU - 1.5708;
      o.nx = 0.5 + Math.cos(a2) * 0.34 * 0.72;
      o.ny = 0.5 + Math.sin(a2) * 0.34;
      var cerca = Math.abs(((t * EST) % 1) - 0.5) * 2;
      o.a = 0.14 + 0.56 * (1 - cerca);
      o.c = 0; o.g = -1;
    }
  }

  /* 6 · CAPACIDAD — módulos con puerto, en columna. Uno de los huecos se
     puebla (la pieza que faltaba) y cada módulo saca una rama nueva: la
     estructura pasa a soportar más de lo que soportaba. */
  function F6(i, u, g, G, o, tm, ins) {
    var M = 6, k = g % M;
    var falta = (k === M - 2);
    var lleno = falta ? ease((ins - 0.42) / 0.34) : 1;
    var rama = ease((ins - 0.58) / 0.36);
    var my = 0.06 + k * 0.158, mh = 0.108;
    if ((g % 5) === 3 && !falta) {
      /* La rama nueva: sale del módulo hacia fuera. */
      o.nx = 0.5 + (u - 0.5) * 2.4 * rama;
      o.ny = my + mh * 0.5;
      o.a = 0.52 * rama;
      o.c = 5; o.g = -1;
      return;
    }
    var p = u * 4, e = p | 0, f = p - e;
    if (e === 0)      { o.nx = f;       o.ny = my; }
    else if (e === 1) { o.nx = 1;       o.ny = my + f * mh; }
    else if (e === 2) { o.nx = 1 - f;   o.ny = my + mh; }
    else              { o.nx = 0;       o.ny = my + mh - f * mh; }
    o.a = (0.16 + 0.56 * Math.abs(Math.sin(u * 3 + k))) * lleno;
    o.c = falta ? (lleno > 0.6 ? 5 : 6) : 6;
    o.g = lleno > 0.3 ? 700 + k : -1;
  }

  /* 7 · RÉGIMEN — órbitas que se CIÑEN vuelta a vuelta y se reparten mejor:
     el sistema hace lo mismo cada vez con menos desperdicio. */
  function F7(i, u, g, G, o, tm, ins) {
    var R = 5, r = g % R;
    var afina = ease((ins - 0.10) / 0.66);        // la mejora, al recorrer
    var rad = (0.16 + r * 0.088) * (1 - 0.14 * afina);
    var disp = (1 - afina) * 0.055 * (sd(i, 71) - 0.5);
    var sp = (r % 2 ? -1 : 1) * (0.00011 + r * 0.00002);
    var a = u * TAU + tm * sp + r;
    o.nx = 0.5 + Math.cos(a) * (rad + disp) * 1.45;
    o.ny = 0.5 + Math.sin(a) * (rad + disp);
    o.a = 0.16 + 0.44 * (0.5 + 0.5 * Math.sin(a * 3)) + 0.20 * afina;
    o.c = afina > 0.7 ? 0 : 6;
    o.g = 800 + r;
  }

  /* 8 · RESULTADO — todo lo anterior en un solo cuerpo: una envolvente
     estable, enlazada, que rodea a quien lee. El centro queda despejado
     porque ahí va el texto: estás DENTRO del sistema, no delante. */
  function F8(i, u, g, G, o, tm, ins) {
    var ph = Math.acos(1 - 2 * ((i + 0.5) / N));
    var th = 3.8833 * (i + 0.5) + tm * 0.00005;
    var sx = Math.sin(ph) * Math.cos(th), sy = Math.cos(ph);
    var sz = Math.sin(ph) * Math.sin(th);
    o.nx = 0.5 + sx * 0.5;
    o.ny = 0.5 + sy * 0.5;
    var canto = sx * sx + sy * sy;                // el contorno del cuerpo
    o.a = (0.05 + 0.86 * Math.pow(canto, 2.6)) * (0.56 + 0.44 * (0.5 + sz * 0.5));
    o.c = canto > 0.86 ? 1 : 6;
    o.g = canto > 0.55 ? 900 + (g % 14) : -1;
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
    ctx.fillStyle = noClear ? 'rgba(5,7,14,0.10)' : 'rgba(5,7,14,0.28)';
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
      ctx.globalAlpha = Math.min(0.80, a2);
      ctx.drawImage(SPR[p.e][(t < 0.5 ? oa.c : ob.c)], dx - r, dy - r, r * 2, r * 2);
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
