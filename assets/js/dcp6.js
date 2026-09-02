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

  /* ---------------------------------------------------------- LA PALETA */
  /* El color no decora: dice qué es cada cosa. Un sistema tiene materia en
     bruto, conexiones vivas, inteligencia procesando, decisiones que cambian
     el rumbo, partes que ya funcionan y momentos de energía máxima. Cada una
     de esas cosas tiene su luz, y se reconoce sin que nadie la explique.

       DATO   azul       información, materia en bruto, lo que entra
       FLUJO  cian       conexión viva, sistema en marcha, tráfico
       PROC   violeta    inteligencia, proceso, lo que decide por dentro
       DEC    magenta    anomalía, cambio, lo que rompe el patrón
       OK     turquesa   lo que ya funciona, lo resuelto, lo que se queda
       LUZ    blanco     energía máxima, foco, convergencia
       BRUMA  azul apagado   la materia que solo está ahí, el campo
       MASA   púrpura    volumen y profundidad del campo

     Regla de disciplina: en cada estado hay UN color dominante y, como
     mucho, un acento. El arcoíris aparece una sola vez en toda la portada
     —en Capacidades— y ahí significa algo: son ocho capacidades distintas. */
  var C_DATO = 0, C_FLUJO = 1, C_PROC = 2, C_DEC = 3,
      C_OK = 4, C_LUZ = 5, C_BRUMA = 6, C_MASA = 7;
  var COL = [
    [ 78, 128, 255],   // 0 DATO
    [ 46, 216, 240],   // 1 FLUJO
    [141,  98, 250],   // 2 PROC
    [255,  86, 168],   // 3 DEC
    [ 52, 224, 198],   // 4 OK
    [236, 244, 255],   // 5 LUZ
    [ 96, 122, 186],   // 6 BRUMA
    [178, 138, 255]    // 7 MASA
  ];
  var ACERO = COL[C_BRUMA];
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
          gr.addColorStop(0,    rgba(COL[i], 0.70));
          gr.addColorStop(0.42, rgba(COL[i], 0.38));
          gr.addColorStop(1,    rgba(COL[i], 0));
        } else if (e === 1) {                  // medio
          gr.addColorStop(0,    rgba(COL[i], 0.94));
          gr.addColorStop(0.24, rgba(COL[i], 0.46));
          gr.addColorStop(0.64, rgba(COL[i], 0.11));
          gr.addColorStop(1,    rgba(COL[i], 0));
        } else {                               // cerca: núcleo duro y nítido
          gr.addColorStop(0,    'rgba(255,255,255,0.96)');
          gr.addColorStop(0.10, rgba(COL[i], 0.98));
          gr.addColorStop(0.32, rgba(COL[i], 0.26));
          gr.addColorStop(0.70, rgba(COL[i], 0.05));
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
    /* En vertical no hay banda libre a la derecha: el fenómeno se centra y
       se abre. Es la misma escena, encuadrada para el formato. */
    MARCO[0].x = narrow ? 0.500 : 0.775;
    MARCO[0].w = narrow ? 0.96  : 0.50;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#05070e'; ctx.fillRect(0, 0, W, H);
    build();
  }

  function build() {
    N = small ? 440 : narrow ? 800 : 1360;
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

    grafos();
    sprites();
  }

  /* ------------------------------------------------------- COMPOSICIÓN */
  /* Cada estado ocupa el espacio de otra manera. La escala y la densidad
     forman parte del significado: el campo en bruto es enorme y disperso, la
     anomalía es pequeña y precisa, la red es monumental, el resultado
     envuelve. Si todos ocuparan el mismo sitio, el recorrido sería plano. */
  var MARCO = [
    { x: 0.775, y: 0.50, w: 0.50, h: 1.02, d: 1.00 },  // 0 CONVERGENCIA el hero
    { x: 0.755, y: 0.50, w: 0.44, h: 0.90, d: 0.92 },  // 1 AISLADOS     el problema
    { x: 0.760, y: 0.47, w: 0.40, h: 0.62, d: 0.82 },  // 2 ANÁLISIS     banda de trayectos
    { x: 0.665, y: 0.50, w: 0.48, h: 0.94, d: 1.00 },  // 3 RED          monumental
    { x: 0.700, y: 0.50, w: 0.46, h: 0.86, d: 0.94 },  // 4 ARQUITECTURA vertical
    { x: 0.690, y: 0.50, w: 0.44, h: 0.52, d: 0.88 },  // 5 CADENA       banda
    { x: 0.880, y: 0.50, w: 0.20, h: 0.90, d: 0.92 },  // 6 INVENTARIO   tótem
    { x: 0.745, y: 0.180, w: 0.46, h: 0.32, d: 0.90 }, // 7 SUPERVISIÓN  arriba
    { x: 0.500, y: 0.475, w: 0.98, h: 0.80, d: 1.00 }  // 8 CONVERGENCIA envolvente
  ];
  /* USO recorta el rango de índices que participa en cada estado. Estaba
     pensado como un control de densidad y funcionaba como una AMPUTACIÓN:
     las últimas bandas de cada formación —el frente de lectura de Analizamos,
     el contador de Medimos, el tráfico por encima de la arquitectura— caían
     fuera del corte y no se dibujaban nunca. Se habían escrito y no se veían.
     La variación de densidad la da el encuadre, que para eso está. */
  var USO = [1, 1, 1, 1, 1, 1, 1, 1, 1];

  /* ---------------------------------------------------------- EL GRAFO */
  /* EL LENGUAJE. Todo lo que se ve está hecho de tres cosas, y solo tres:

       NODOS      un componente del sistema — un módulo pequeño y sólido
       ARISTAS    una relación entre dos componentes — la materia que las une
       PAQUETES   algo circulando por esa relación — datos en movimiento

     Con ese vocabulario se puede decir todo lo que hace D-Code sin dibujar
     un solo objeto cotidiano: un campo de datos, una anomalía, una
     arquitectura por capas, una red que se integra, un proceso que se
     dispara solo, una malla que se simplifica, una estructura que escala,
     una capa que supervisa y una convergencia final. Reconocible porque es
     el lenguaje real de los sistemas, no porque sea un dibujo. */

  var TAU = 6.2832;
  var GR = {};

  function nd(x, y, k) { return { x: x, y: y, k: k || 0 }; }
  function mkG(nodos, aristas) {
    var E = [];
    for (var e = 0; e < aristas.length; e++) {
      var A = nodos[aristas[e][0]], B = nodos[aristas[e][1]];
      E.push({ a: A, b: B, i0: aristas[e][0], i1: aristas[e][1],
               d: Math.sqrt((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y)) });
    }
    return { n: nodos, e: E };
  }

  /* Un nodo se dibuja como un módulo pequeño: un cuadrado con su contorno.
     Sólido y con esquina, no una mancha — un componente tiene bordes. */
  function ponNodo(o, x, y, j, t, ar) {
    var p = j * 4, s = p | 0, f = p - s;
    var tx = t * (ar || 1);
    if (s === 0)      { o.nx = x - tx + f * tx * 2; o.ny = y - t; }
    else if (s === 1) { o.nx = x + tx;              o.ny = y - t + f * t * 2; }
    else if (s === 2) { o.nx = x + tx - f * tx * 2; o.ny = y + t; }
    else              { o.nx = x - tx;              o.ny = y + t - f * t * 2; }
  }
  function ponArista(o, E, j) {
    o.nx = E.a.x + (E.b.x - E.a.x) * j;
    o.ny = E.a.y + (E.b.y - E.a.y) * j;
  }

  function grafos() {
    var i, k, j, nodos, ar;

    /* 2 · ARQUITECTURA — cuatro capas con sus módulos, unidas en vertical.
       Es una arquitectura por niveles, que es como se organiza un sistema. */
    nodos = []; ar = [];
    var CAPAS = [3, 4, 4, 2], base = 0;
    var idxCapa = [];
    for (k = 0; k < CAPAS.length; k++) {
      var fila = [], nc = CAPAS[k];
      var y = 0.10 + k * 0.265;
      for (i = 0; i < nc; i++) {
        fila.push(nodos.length);
        nodos.push(nd(0.12 + (i + 0.5) * (0.76 / nc), y, k));
      }
      idxCapa.push(fila);
      if (k > 0) {
        for (i = 0; i < fila.length; i++) {
          var ant = idxCapa[k - 1];
          ar.push([fila[i], ant[i % ant.length]]);
          if (i + 1 < ant.length) ar.push([fila[i], ant[(i + 1) % ant.length]]);
        }
      }
      for (i = 1; i < fila.length; i++) ar.push([fila[i - 1], fila[i]]);
    }
    GR.arq = mkG(nodos, ar);

    /* 3 · RED — cuatro sistemas separados, cada uno con su vida interior, y
       los puentes que acaban uniéndolos en una sola infraestructura. */
    nodos = []; ar = [];
    var CENT = [[0.20, 0.24], [0.78, 0.20], [0.16, 0.78], [0.76, 0.76]];
    var grp = [];
    for (k = 0; k < 4; k++) {
      var g2 = [];
      for (i = 0; i < 5; i++) {
        /* Sin rotación por sistema: los cuatro son exactamente el mismo
           montaje. Es lo que dice el texto —lo mismo, hecho varias veces— y
           se ve antes de leerlo. */
        var an = (i / 5) * TAU;
        g2.push(nodos.length);
        nodos.push(nd(CENT[k][0] + Math.cos(an) * 0.115, CENT[k][1] + Math.sin(an) * 0.115, k));
      }
      grp.push(g2);
      for (i = 0; i < 5; i++) ar.push([g2[i], g2[(i + 1) % 5]]);   // red interna
      ar.push([g2[0], g2[2]]);
    }
    GR.redInt = mkG(nodos, ar);
    /* Los puentes van aparte: aparecen después, y son el momento. */
    var puentes = [[grp[0][1], grp[1][3]], [grp[0][3], grp[2][0]],
                   [grp[1][2], grp[3][0]], [grp[2][1], grp[3][3]],
                   [grp[0][2], grp[3][1]]];
    GR.redPue = mkG(nodos, puentes);

    /* 4 · CADENA — recibe, procesa, DECIDE (se bifurca), dispara, y lo que
       dispara vuelve al principio. Un proceso que ya no necesita a nadie. */
    nodos = [nd(0.06, 0.50, 0), nd(0.28, 0.50, 1), nd(0.50, 0.50, 2),
             nd(0.72, 0.30, 3), nd(0.72, 0.70, 3), nd(0.94, 0.50, 4)];
    ar = [[0, 1], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5]];
    GR.cadena = mkG(nodos, ar);

    /* 6 · ESCALA — una retícula de módulos que se amplía por bloques: lo que
       ya existe no se toca; lo nuevo se engancha a la estructura. */
    nodos = []; ar = [];
    var COLS = 4, FILAS = 5;
    for (k = 0; k < FILAS; k++) {
      for (i = 0; i < COLS; i++) {
        nodos.push(nd(0.10 + i * (0.80 / (COLS - 1)), 0.10 + k * (0.80 / (FILAS - 1)), i + k * COLS));
      }
    }
    for (k = 0; k < FILAS; k++) for (i = 1; i < COLS; i++) ar.push([k * COLS + i - 1, k * COLS + i]);
    for (k = 1; k < FILAS; k++) for (i = 0; i < COLS; i++) ar.push([(k - 1) * COLS + i, k * COLS + i]);
    GR.escala = mkG(nodos, ar);

    /* 6 · CAPACIDADES — una columna doble de módulos, cada uno con su luz, y
       UN HUECO. No es la misma retícula que la arquitectura: allí importaba
       la estructura por capas, aquí importa el inventario y lo que le falta. */
    nodos = []; ar = [];
    var CFIL = 9;                                    // ocho piezas y un hueco
    for (k = 0; k < CFIL; k++) nodos.push(nd(0.50, 0.055 + k * 0.1125, k));
    for (k = 1; k < CFIL; k++) ar.push([k - 1, k]);
    GR.cap = mkG(nodos, ar);

    /* 8 · CONVERGENCIA — el sistema completo. Dos anillos de módulos,
       enlazados entre sí y en anillo, con el trabajo circulando hacia
       dentro. SIN nodo central: ahí va el titular del cierre, y quien lee
       tiene que quedarse dentro del sistema, no detrás de una lámpara. */
    nodos = []; ar = [];
    var arC = (MARCO[8].h * H) / (MARCO[8].w * W);
    var A1 = 8, A2 = 14;
    for (i = 0; i < A1; i++) {
      var a1 = (i / A1) * TAU - 1.5708;
      nodos.push(nd(0.5 + Math.cos(a1) * 0.375 * arC, 0.5 + Math.sin(a1) * 0.375, 1));
    }
    for (i = 0; i < A2; i++) {
      var a2 = (i / A2) * TAU - 1.5708 + 0.22;
      nodos.push(nd(0.5 + Math.cos(a2) * 0.475 * arC, 0.5 + Math.sin(a2) * 0.475, 2));
    }
    for (i = 0; i < A1; i++) ar.push([i, (i + 1) % A1]);                  // anillo interior
    for (i = 0; i < A2; i++) ar.push([A1 + i, A1 + ((i + 1) % A2)]);      // anillo exterior
    for (i = 0; i < A2; i++) ar.push([A1 + i, i % A1]);                   // radios
    GR.conv = mkG(nodos, ar);
  }

  /* ------------------------------------------------------- FORMACIONES */
  /* EL REPARTO. Las partículas se reparten en BANDAS CONTIGUAS por índice:
     un tramo para los nodos, otro para las aristas, otro para los paquetes.
     Es la decisión técnica que hace que todo funcione, y costó descubrirla:
     el enlace une partículas CONSECUTIVAS del mismo grupo, así que si los
     papeles se alternan partícula a partícula, dos consecutivas nunca
     pertenecen a lo mismo, no se une nada y la red entera se ve como una
     nube de manchas. Con bandas contiguas, cada nodo y cada arista los
     dibujan sus propias partículas, en orden. */

  function tramo(u, a, b, n) {
    var t = (u - a) / (b - a) * n;
    var k = t | 0; if (k >= n) k = n - 1; if (k < 0) k = 0;
    return { k: k, j: t - k };
  }

  /* 0 · EL HERO — «Del caos al control».
     Es la declaración de identidad de la empresa, y por eso es lo único de
     toda la portada que no es un diagrama: es un FENÓMENO. Materia dispersa
     entra por el borde izquierdo en corrientes anchas y desordenadas, se
     acelera, se estrecha, y atraviesa un diafragma luminoso. Lo que sale por
     el otro lado ya no es una nube: son trazos regulares, espaciados, con
     dirección. Entra complejidad y sale sistema, ocurriendo delante de ti.

     El color hace el relato: azul mientras es información en bruto, violeta
     mientras se procesa, cian cuando ya circula por un sistema, blanco en el
     instante del foco, turquesa a la salida —lo que ya funciona—. */
  function F0(i, u, g, G, o, tm, ins) {
    var ar = (MARCO[0].h * H) / (MARCO[0].w * W);
    var fx = narrow ? 0.520 : 0.600, fy = narrow ? 0.50 : 0.575;

    if (u < 0.62) {                                   // LAS CORRIENTES
      var CO = 36;
      var q = tramo(u, 0, 0.62, CO);
      var k = q.k, sp = q.j;
      /* Aceleración real: la materia entra despacio y ancha, y en el último
         tercio se lanza. Sin eso la convergencia parece un embudo dibujado. */
      var acc = sp * sp;
      var abre = 1 - acc;
      var yk = fy + (sd(k, 21) - 0.5) * 1.18;
      o.nx = -0.10 + (fx + 0.10) * acc;
      o.ny = fy + (yk - fy) * abre * abre
                + Math.sin(sp * 3.1 + k * 2.3 + tm * 0.00020) * 0.10 * abre
                + Math.sin(sp * 7.7 + k * 1.1) * 0.028 * abre;
      /* Un pulso de luz recorre cada corriente. La geometría no se mueve —si
         se moviera, el filamento repta—; lo que viaja es la energía. */
      var pul = 0.5 + 0.5 * Math.sin(sp * 15.0 - tm * 0.0030 + k * 1.9);
      /* Y nace de la oscuridad, no del borde: la primera cuarta parte del
         recorrido está apagada, así que la corriente no cruza el titular. */
      o.a = (0.20 + 0.62 * acc) * (0.46 + 0.54 * pul) * cl((sp - 0.32) / 0.24);
      /* El recorrido del color ES el relato del hero: entra como información
         en bruto (azul), se procesa (violeta), pasa a circular por un sistema
         (cian) y llega al foco como energía (blanco). Las bandas están
         desplazadas al final del trayecto a propósito: es el tramo que se ve. */
      o.c = sp < 0.62 ? C_DATO : sp < 0.81 ? C_PROC : sp < 0.94 ? C_FLUJO : C_LUZ;
      o.g = 10 + k;
      return;
    }

    if (u < 0.72) {                                   // EL FOCO
      var an0 = sd(i, 31) * TAU;
      var g0 = sd(i, 32);
      var rr = Math.pow(g0, 2.2) * 0.062;
      o.nx = fx + Math.cos(an0) * rr * ar;
      o.ny = fy + Math.sin(an0) * rr;
      o.a = 0.42 + 0.54 * (0.5 + 0.5 * Math.sin(tm * 0.0013 + sd(i, 33) * 6.3));
      /* Blanco en el centro, magenta en la corona: el punto exacto en el que
         la materia deja de ser lo que era. */
      o.c = g0 < 0.62 ? C_LUZ : C_DEC;
      o.g = -1;
      return;
    }

    if (u < 0.86) {                                   // EL DIAFRAGMA
      /* Dos arcos, no un círculo cerrado: un anillo perfecto parece un
         planeta; dos arcos con sus aperturas parecen un instrumento. */
      var q2 = tramo(u, 0.72, 0.86, 2);
      var a2 = (q2.k ? 0.34 : 3.48) + q2.j * 2.60;
      var R2 = 0.168 + 0.008 * Math.sin(tm * 0.0009);
      o.nx = fx + Math.cos(a2) * R2 * ar;
      o.ny = fy + Math.sin(a2) * R2;
      o.a = 0.50 + 0.40 * Math.sin(q2.j * 3.1416);
      o.c = q2.j > 0.42 && q2.j < 0.58 ? C_LUZ : C_FLUJO;
      o.g = 70 + q2.k;
      return;
    }

    if (u < 0.94) {                                   // LO QUE SALE, YA ORDENADO
      var q3 = tramo(u, 0.86, 0.94, 5);
      var t3 = ((tm * 0.00011) + q3.j * 0.85 + sd(q3.k, 35)) % 1;
      o.nx = fx + 0.040 + t3 * 0.150;
      o.ny = fy + (q3.k - 2) * 0.048;
      o.a = 0.62 * Math.sin(t3 * 3.1416);
      o.c = C_OK; o.g = -1;
      return;
    }

    /* El campo en el que ocurre todo: volumen, no vacío negro. */
    o.nx = sd(i, 23); o.ny = sd(i, 24);
    o.a = 0.10 + 0.10 * Math.sin(tm * 0.0006 + sd(i, 25) * 6.3);
    o.c = C_MASA; o.g = -1;
  }

  /* 1 · EL PROBLEMA — «Persigo cobros · se me escapan · lo mismo en tres
     sitios». Cuatro sistemas que por dentro funcionan, cada uno con su vida,
     y ninguno habla con los demás. De cada uno salen flujos que no llegan a
     ningún sitio y se apagan en magenta: es trabajo que se pierde.

     Color: violeta apagado —hay inteligencia dentro de cada isla, pero
     encerrada— y magenta solo en lo que se pierde. Deliberadamente sin cian:
     el cian es conexión, y aquí no hay ninguna. Ese vacío de color es el
     que hace que el estado siguiente, cuando aparece el cian, se sienta. */
  function F1(i, u, g, G, o, tm, ins) {
    var gi = GR.redInt, ar = (MARCO[1].h * H) / (MARCO[1].w * W);
    if (u < 0.26) {                                          // los nodos
      var q = tramo(u, 0, 0.26, gi.n.length);
      var nodo = gi.n[q.k];
      ponNodo(o, nodo.x, nodo.y, q.j, 0.026, ar);
      o.a = 0.78; o.c = C_PROC; o.g = 150 + q.k;
      return;
    }
    if (u < 0.62) {                                          // su red interna
      var q2 = tramo(u, 0.26, 0.62, gi.e.length);
      ponArista(o, gi.e[q2.k], q2.j);
      o.a = 0.46; o.c = C_MASA; o.g = 190 + q2.k;
      return;
    }
    if (u < 0.82) {                                          // lo que se pierde
      var q3 = tramo(u, 0.62, 0.82, gi.n.length);
      var org = gi.n[q3.k];
      var t2 = ((tm * 0.00022) + sd(q3.k, 45) + q3.j * 0.3) % 1;
      var an = sd(q3.k, 46) * TAU;
      o.nx = org.x + Math.cos(an) * t2 * 0.36 * ar;
      o.ny = org.y + Math.sin(an) * t2 * 0.36;
      o.a = 0.86 * (1 - t2) * (1 - t2);
      o.c = t2 > 0.40 ? C_DEC : C_PROC;
      o.g = -1;
      return;
    }
    var q4 = tramo(u, 0.82, 1.0, gi.e.length);                // tráfico interno
    var t = ((tm * 0.00034) + sd(q4.k, 47) + q4.j) % 1;
    ponArista(o, gi.e[q4.k], t);
    o.a = 0.20 + 0.72 * Math.sin(t * 3.1416);
    o.c = C_PROC; o.g = -1;
  }

  /* 2 · ANALIZAMOS — «Miramos lo que ya ocurre. Aparecen los trayectos que
     se repiten y los que no llevan a ninguna parte — eso es lo primero que
     se ve.» Literalmente eso, y nada más que eso.

     El campo se llena de TRAYECTOS: treinta recorridos que cruzan la
     operación. Un frente de lectura los recorre de izquierda a derecha y, a
     su paso, los clasifica:

       · tres trayectos tienen EXACTAMENTE la misma forma a distintas
         alturas —lo mismo hecho en tres sitios— y se encienden en cian
       · otros se cortan a media altura y se apagan en magenta: empiezan y
         no llegan a ningún sitio
       · el resto sigue siendo materia de fondo

     No hace falta explicarlo: el ojo ve tres curvas calcadas y ve cabos
     sueltos. Esa es la lectura, hecha delante de ti. */
  function F2(i, u, g, G, o, tm, ins) {
    var lect = -0.16 + ((tm * 0.00009) % 1.34);
    var TR = 30;

    if (u < 0.90) {
      var q = tramo(u, 0, 0.90, TR);
      var k = q.k, sp = q.j;
      var rep = (k % 10 === 3);                 // los tres calcados
      var muere = (k % 7 === 5);                // los que no llegan
      var sem = rep ? 3 : k;                    // repetidos = misma forma
      var y0 = 0.05 + sd(k, 21) * 0.90;
      var x = 0.02 + sp * 0.96;
      o.nx = x;
      o.ny = y0 + Math.sin(x * 4.2 + sd(sem, 22) * 6.3) * 0.082
                + Math.sin(x * 9.4 + sd(sem, 23) * 6.3) * 0.026;

      var corte = 0.30 + sd(k, 24) * 0.34;
      var leido = cl((lect - x) / 0.09);        // el frente ya ha pasado

      if (muere && sp > corte) {                // el cabo suelto
        var cerca = cl((sp - corte) / 0.06);
        o.a = 0.60 * leido * (1 - cerca);
        o.c = C_DEC;
        o.g = sp < corte + 0.055 ? 200 + k : -1;
        return;
      }
      /* Delante del frente, actividad en bruto. Detrás, ya clasificado. */
      var base = 0.14 + 0.34 * Math.exp(-(x - lect) * (x - lect) * 55);
      if (rep) {
        var lat = 0.5 + 0.5 * Math.sin(tm * 0.0022 + k);
        o.a = base + leido * (0.30 + 0.42 * lat);
        o.c = leido > 0.4 ? C_FLUJO : C_DATO;
      } else {
        o.a = base * (1 - 0.34 * leido);
        o.c = leido > 0.4 ? C_BRUMA : C_DATO;
      }
      o.g = 210 + k;
      return;
    }

    /* El frente de lectura: una línea vertical fina que barre la operación.
       Es lo único de este estado que no es dato — es la mirada. */
    var q2 = tramo(u, 0.90, 1.0, 1);
    o.nx = lect;
    o.ny = 0.02 + q2.j * 0.96;
    o.a = 0.30 + 0.34 * Math.sin(q2.j * 3.1416);
    o.c = C_LUZ; o.g = 260;
  }

  /* 3 · DISEÑAMOS — «Decidimos qué va con qué». Los mismos cuatro sistemas
     del estado anterior, pero ahora se tienden los PUENTES entre ellos y, en
     cuanto existen, el tráfico empieza a cruzarlos. Deja de haber cuatro
     sistemas y pasa a haber una infraestructura. */
  function F3(i, u, g, G, o, tm, ins) {
    var gi = GR.redInt, gp = GR.redPue;
    var ar = (MARCO[3].h * H) / (MARCO[3].w * W);
    var une = ease((ins - 0.10) / 0.42);
    if (u < 0.22) {
      var q = tramo(u, 0, 0.22, gi.n.length), nodo = gi.n[q.k];
      ponNodo(o, nodo.x, nodo.y, q.j, 0.024, ar);
      o.a = 0.46 + 0.30 * une;
      o.c = une > 0.6 ? C_DATO : C_PROC;
      o.g = 400 + q.k;
      return;
    }
    if (u < 0.52) {
      var q2 = tramo(u, 0.22, 0.52, gi.e.length);
      ponArista(o, gi.e[q2.k], q2.j);
      o.a = 0.28; o.c = C_MASA; o.g = 440 + q2.k;
      return;
    }
    if (u < 0.76) {                                          // los puentes
      var q3 = tramo(u, 0.52, 0.76, gp.e.length);
      var av = cl((une - q3.k * 0.09) / 0.42);
      ponArista(o, gp.e[q3.k], q3.j * av);
      o.a = q3.j <= av ? 0.66 : 0;
      o.c = C_FLUJO; o.g = q3.j <= av ? 480 + q3.k : -1;
      return;
    }
    /* El tráfico. Cuando el puente existe, una parte cruza al otro sistema:
       ahí es donde se ve la integración, no en la línea sino en lo que pasa. */
    var q4 = tramo(u, 0.76, 1.0, gi.e.length + gp.e.length);
    var cruza = q4.k >= gi.e.length;
    if (cruza && une < 0.86) { o.a = 0; o.g = -1; o.nx = 0.5; o.ny = 0.5; return; }
    var E = cruza ? gp.e[q4.k - gi.e.length] : gi.e[q4.k];
    var t = ((tm * 0.00040) + sd(q4.k, 41) + q4.j) % 1;
    ponArista(o, E, t);
    o.a = (cruza ? 0.24 : 0.14) + (cruza ? 0.76 : 0.46) * Math.sin(t * 3.1416);
    o.c = cruza ? C_FLUJO : C_DATO; o.g = -1;
  }

  /* 4 · CONSTRUIMOS — «Se levanta la estructura». La información pasa a ser
     ARQUITECTURA: módulos repartidos en capas y unidos entre niveles. Se
     monta de abajo arriba: primero la base, después lo que se apoya en ella. */
  function F4(i, u, g, G, o, tm, ins) {
    var gr = GR.arq, ar = (MARCO[4].h * H) / (MARCO[4].w * W);
    if (u < 0.42) {                                          // los módulos
      var q = tramo(u, 0, 0.42, gr.n.length), nodo = gr.n[q.k];
      var sube = ease((ins - 0.02 - (3 - nodo.k) * 0.085) / 0.19);
      ponNodo(o, nodo.x, nodo.y + (1 - sube) * 0.26, q.j, 0.030, ar);
      /* El destello es el INSTANTE de encajar, no el estado de reposo. Con
         el blanco permanente los módulos se velaban y la arquitectura perdía
         su color; ahora la pieza llega, da un golpe de luz y se asienta. */
      var golpe = Math.max(0, 1 - Math.abs(sube - 0.92) * 14);
      o.a = 0.16 + 0.52 * sube + 0.30 * golpe;
      o.c = C_DATO;
      o.g = 300 + q.k;
      return;
    }
    if (u < 0.86) {                                          // los enlaces
      var q2 = tramo(u, 0.42, 0.86, gr.e.length), E = gr.e[q2.k];
      var kmax = Math.max(E.a.k, E.b.k);
      var une = ease((ins - 0.07 - (3 - kmax) * 0.085) / 0.18);
      ponArista(o, E, q2.j * une);
      o.a = q2.j <= une ? 0.38 : 0;
      o.c = C_MASA; o.g = q2.j <= une ? 340 + q2.k : -1;
      return;
    }
    /* Y por encima empieza a circular lo que la estructura sostiene. */
    var q3 = tramo(u, 0.86, 1.0, gr.e.length);
    var lay = ease((ins - 0.46) / 0.34);
    var t = ((tm * 0.00032) + sd(q3.k, 51) + q3.j) % 1;
    ponArista(o, gr.e[q3.k], t);
    o.a = lay * (0.18 + 0.68 * Math.sin(t * 3.1416));
    o.c = C_FLUJO; o.g = -1;
  }

  /* 5 · MEDIMOS — la cadena: entra algo, se procesa, se DECIDE por dónde
     sigue, se dispara la acción y el resultado vuelve. El nodo activo se
     enciende al paso del trabajo, así que se ve que una cosa dispara la
     siguiente. Y lo que circula se puede contar. */
  function F5(i, u, g, G, o, tm, ins) {
    var gr = GR.cadena, ar = (MARCO[5].h * H) / (MARCO[5].w * W);
    var ciclo = (tm * 0.00020) % 1;
    if (u < 0.34) {                                          // las etapas
      var q = tramo(u, 0, 0.34, gr.n.length), nodo = gr.n[q.k];
      var mio = cl(1 - Math.abs(ciclo * 5 - nodo.k) * 1.5);
      ponNodo(o, nodo.x, nodo.y, q.j, 0.034 + 0.010 * mio, ar);
      o.a = 0.28 + 0.72 * mio;
      o.c = mio > 0.5 ? C_LUZ : (nodo.k === 2 ? C_DEC : C_DATO);
      o.g = 500 + q.k;
      return;
    }
    if (u < 0.64) {                                          // los enlaces
      var q2 = tramo(u, 0.34, 0.64, gr.e.length);
      ponArista(o, gr.e[q2.k], q2.j);
      o.a = 0.28; o.c = C_MASA; o.g = 540 + q2.k;
      return;
    }
    if (u < 0.88) {
    /* Lo que circula. En la bifurcación toma una rama u otra: eso es decidir. */
    var q3 = tramo(u, 0.64, 0.88, 2);
    var ruta = q3.k ? [gr.e[0], gr.e[1], gr.e[3], gr.e[5]]
                    : [gr.e[0], gr.e[1], gr.e[2], gr.e[4]];
    var t2 = ((tm * 0.00020) + q3.j * 0.7 + q3.k * 0.13) % 1;
    var seg = Math.min(3, (t2 * 4) | 0), f2 = t2 * 4 - seg;
    ponArista(o, ruta[seg], f2);
    o.a = 0.24 + 0.74 * Math.sin(t2 * 3.1416);
    o.c = seg === 2 ? C_DEC : (seg > 2 ? C_OK : C_FLUJO); o.g = -1;
    return;
    }

    /* EL CONTADOR. La frase termina en «y lo que circula se puede contar», y
       hasta ahora eso no estaba en ningún sitio. Bajo la salida se apila una
       marca por cada vuelta completa del proceso; cuando la columna se llena,
       empieza otra. Es la única parte de la portada que mide algo, y por eso
       es la única que se lee de abajo arriba. */
    var MARCAS = 8;
    var q4 = tramo(u, 0.88, 1.0, MARCAS);
    var lleno = ((tm * 0.00020) * MARCAS) % (MARCAS + 1.4);
    var esta = cl(lleno - q4.k);
    o.nx = 0.905 + q4.j * 0.070;
    o.ny = 0.615 + q4.k * 0.046;
    o.a = 0.14 + 0.70 * esta;
    o.c = esta > 0.5 ? C_OK : C_MASA;
    o.g = 580 + q4.k;
  }

  /* 6 · CAPACIDADES — «Piezas que ya existen. Y las que falten». La retícula
     no se hincha: se AMPLÍA. Lo que ya está no se toca; los módulos nuevos
     llegan desde fuera y se enganchan a la estructura, columna a columna.
     Crece porque estaba preparada para crecer. */
  /* 6 · CAPACIDADES — «Piezas que ya existen. Y las que falten.»

     Once módulos apilados, cada uno con la luz de una capacidad distinta:
     ese es el inventario, y se ve que son cosas distintas porque tienen
     colores distintos. El duodécimo sitio está VACÍO, dibujado a trazos. Y
     desde fuera del encuadre llega la pieza que falta, se mete en el hueco,
     el contorno se cierra y los travesaños que la unen al resto se encienden.

     Antes esto era la misma retícula que la arquitectura con otra escala. Ni
     decía lo que dice el texto ni se distinguía del estado 03. */
  var CAPCOL = [C_DATO, C_PROC, C_FLUJO, C_DEC, C_MASA, C_DATO, C_PROC, C_FLUJO];
  function F6(i, u, g, G, o, tm, ins) {
    var gr = GR.cap, ar = (MARCO[6].h * H) / (MARCO[6].w * W);
    var HUECO = 8;                                   // el sitio que falta
    var llega = ease((ins - 0.16) / 0.34);            // la pieza que llega
    var hueco = gr.n[HUECO];

    if (u < 0.44) {                                  // los módulos que ya están
      var q = tramo(u, 0, 0.44, HUECO);
      var nodo = gr.n[q.k];
      var sale = ease((ins - 0.02 - q.k * 0.026) / 0.20);
      ponNodo(o, nodo.x, nodo.y, q.j, 0.040, ar);
      /* Se enciende uno cada vez: así se cuentan, y se ve que son once. */
      var turno = cl(1 - Math.abs(((tm * 0.00013) % 1) * HUECO - q.k) * 0.70);
      o.a = (0.20 + 0.54 * sale) + 0.36 * turno * sale;
      o.c = turno > 0.6 ? C_LUZ : CAPCOL[q.k];
      o.g = sale > 0.2 ? 700 + q.k : -1;
      return;
    }

    if (u < 0.72) {                                  // los travesaños
      var q2 = tramo(u, 0.44, 0.72, gr.e.length), E = gr.e[q2.k];
      var toca = (E.i0 === HUECO || E.i1 === HUECO);
      var kmax = Math.max(E.i0, E.i1);
      var une = toca ? llega : ease((ins - 0.05 - kmax * 0.016) / 0.20);
      ponArista(o, E, q2.j * une);
      o.a = q2.j <= une ? (toca ? 0.52 : 0.30) : 0;
      o.c = toca ? C_OK : C_MASA;
      o.g = q2.j <= une ? 740 + q2.k : -1;
      return;
    }

    if (u < 0.88) {                                  // el hueco, a trazos
      var q3 = tramo(u, 0.72, 0.88, 1);
      ponNodo(o, hueco.x, hueco.y, q3.j, 0.040, ar);
      /* A trazos de verdad: uno de cada tres tramos no se dibuja. Un
         contorno continuo pero flojo se lee como un módulo apagado; con
         huecos se lee como un sitio reservado. */
      var seg = (q3.j * 24) % 3;
      o.a = seg < 1.9 ? (0.44 - 0.30 * llega) : 0;
      o.c = C_BRUMA;
      o.g = seg < 1.9 ? 770 : -1;
      return;
    }

    /* La pieza que falta: entra desde fuera y ocupa su sitio. */
    var q4 = tramo(u, 0.88, 1.0, 1);
    var dx = (1 - llega) * 1.30;
    ponNodo(o, hueco.x + dx, hueco.y - (1 - llega) * 0.12, q4.j, 0.040, ar);
    o.a = 0.30 + 0.66 * llega;
    o.c = llega > 0.9 ? C_OK : C_LUZ;
    o.g = 780;
  }

  /* 7 · FINANCE — «Un sistema financiero completo. Recórrelo módulo a
     módulo». Abajo el sistema sigue trabajando con su tráfico; arriba
     aparece OTRO PLANO que lo vigila, con un sensor por módulo y un hilo
     que baja hasta él. Eso es un sistema completo: el que opera y el que
     lo mira. */
  function F7(i, u, g, G, o, tm, ins) {
    var gr = GR.escala, ar = (MARCO[7].h * H) / (MARCO[7].w * W);
    var capa = ease((ins - 0.12) / 0.38);
    var SUP = 7, sub = 0.26, esc = 0.70;
    if (u < 0.16) {                                          // la capa que vigila
      var q = tramo(u, 0, 0.16, SUP);
      var sx = 0.10 + q.k * (0.80 / (SUP - 1));
      var lat = 0.5 + 0.5 * Math.sin(tm * 0.0012 + q.k * 1.3);
      ponNodo(o, sx, 0.06 - (1 - capa) * 0.18, q.j, 0.020, ar);
      o.a = (0.30 + 0.66 * lat) * capa;
      o.c = C_OK; o.g = 800 + q.k;
      return;
    }
    if (u < 0.32) {                                          // los hilos que bajan
      var q2 = tramo(u, 0.16, 0.32, SUP);
      var sx2 = 0.10 + q2.k * (0.80 / (SUP - 1));
      var dst = gr.n[(q2.k * 3) % gr.n.length];
      o.nx = sx2 + (dst.x - sx2) * q2.j;
      o.ny = 0.06 + (dst.y * esc + sub - 0.06) * q2.j;
      o.a = q2.j <= capa ? 0.26 * capa : 0;
      o.c = C_MASA; o.g = q2.j <= capa ? 830 + q2.k : -1;
      return;
    }
    if (u < 0.56) {                                          // el sistema, abajo
      var q3 = tramo(u, 0.32, 0.56, gr.n.length), nodo = gr.n[q3.k];
      ponNodo(o, nodo.x, nodo.y * esc + sub, q3.j, 0.030, ar);
      o.a = 0.42; o.c = C_DATO; o.g = 850 + q3.k;
      return;
    }
    if (u < 0.86) {
      var q4 = tramo(u, 0.56, 0.86, gr.e.length), E = gr.e[q4.k];
      o.nx = E.a.x + (E.b.x - E.a.x) * q4.j;
      o.ny = (E.a.y + (E.b.y - E.a.y) * q4.j) * esc + sub;
      o.a = 0.26; o.c = C_MASA; o.g = 880 + q4.k;
      return;
    }
    var q5 = tramo(u, 0.86, 1.0, gr.e.length), E2 = gr.e[q5.k];
    var t = ((tm * 0.00034) + sd(q5.k, 71) + q5.j) % 1;
    o.nx = E2.a.x + (E2.b.x - E2.a.x) * t;
    o.ny = (E2.a.y + (E2.b.y - E2.a.y) * t) * esc + sub;
    o.a = 0.20 + 0.66 * Math.sin(t * 3.1416);
    o.c = C_FLUJO; o.g = -1;
  }

  /* 8 · RESULTADOS — la convergencia. Un núcleo, dos anillos de módulos y
     todo enlazado con todo, con el trabajo circulando hacia el centro. No es
     una figura: es el mismo sistema de antes, completo y visible de un
     vistazo. Y rodea al lector, que queda dentro de él. */
  function F8(i, u, g, G, o, tm, ins) {
    var gr = GR.conv, ar = (MARCO[8].h * H) / (MARCO[8].w * W);
    if (u < 0.26) {
      var q = tramo(u, 0, 0.26, gr.n.length), nodo = gr.n[q.k];
      var t3 = nodo.k === 1 ? 0.026 : 0.020;
      ponNodo(o, nodo.x, nodo.y, q.j, t3, ar);
      var lat = 0.5 + 0.5 * Math.sin(tm * 0.0009 + q.k * 0.7);
      o.a = 0.44 + 0.34 * lat;
      o.c = nodo.k === 1 ? C_FLUJO : C_DATO;
      o.g = 900 + q.k;
      return;
    }
    if (u < 0.72) {
      var q2 = tramo(u, 0.26, 0.72, gr.e.length);
      ponArista(o, gr.e[q2.k], q2.j);
      o.a = 0.32; o.c = C_MASA; o.g = 940 + q2.k;
      return;
    }
    var q3 = tramo(u, 0.72, 1.0, gr.e.length), E2 = gr.e[q3.k];
    var t = ((tm * 0.00030) + sd(q3.k, 81) + q3.j) % 1;
    var dentro = E2.b.k < E2.a.k;
    ponArista(o, E2, dentro ? t : 1 - t);
    o.a = 0.20 + 0.72 * Math.sin(t * 3.1416);
    /* Lo que va hacia dentro llega blanco: es el resultado reuniéndose. */
    o.c = dentro ? C_LUZ : C_FLUJO; o.g = -1;
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
  var px = new Float32Array(1500), py = new Float32Array(1500);
  var pg = new Int32Array(1500), pa = new Float32Array(1500);
  var pc = new Int32Array(1500);          // el color con el que se enlaza

  /* Al reflejar hay que mover TAMBIÉN el marco al lado libre: invertir solo
     el contenido dejaba la formación encima de la columna de texto. */
  /* Hay formaciones con DIRECCIÓN —la cadena entra por un lado y sale por el
     otro— y reflejarlas invierte el sentido de lectura: el proceso pasa a
     correr de derecha a izquierda y deja de leerse como un proceso. En esas,
     el encuadre se mueve al lado libre pero el contenido no se voltea. */
  var VOLTEA = [1, 1, 1, 1, 1, 0, 1, 1, 1];
  function marco(o, fr, mir, out, vol) {
    var cx = mir ? 1 - fr.x : fr.x;
    var nx = (mir && vol) ? 1 - o.nx : o.nx;
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

      if (enA) { oa.a = 1; oa.g = -1; oa.c = C_BRUMA; FA(i, ua, 0, 0, oa, tm, insA); }
      else     { oa.nx = p.hx; oa.ny = p.hy; oa.a = 0.11; oa.g = -1; oa.c = C_MASA; }
      if (enB) { ob.a = 1; ob.g = -1; ob.c = C_BRUMA; FB(i, ub, 0, 0, ob, tm, insB); }
      else     { ob.nx = p.hx; ob.ny = p.hy; ob.a = 0.11; ob.g = -1; ob.c = C_MASA; }

      marco(oa, frA, MIR[iA], ma, VOLTEA[iA]);
      marco(ob, frB, MIR[iB], mb, VOLTEA[iB]);

      /* Cada partícula sale hacia la formación siguiente en su instante. */
      var t = cl((tw - p.dl) / (1 - p.dl)); t = t * t * (3 - 2 * t);
      var tx = lerp(ma.x, mb.x, t), ty = lerp(ma.y, mb.y, t);
      var al = lerp(oa.a, ob.a, t);
      var dep = lerp(frA.d, frB.d, t);

      /* LA TRANSFORMACIÓN. Esto se ha rehecho entero, porque era el punto
         más débil del recorrido. Antes la materia se DISPERSABA en medio de
         cada transición: un empuje radial que la lanzaba hacia fuera y la
         volvía a reunir. Se veía bien, pero contaba lo contrario de lo que
         queremos contar — que una estructura se rompe y aparece otra sin
         relación con la anterior.

         Ahora la materia no explota: BASCULA. Cada partícula recorre un arco
         perpendicular a su propio trayecto, y el signo del arco depende de
         en qué mitad del campo esté, así que el campo entero pivota y se
         pliega sobre sí mismo en lugar de estallar. Y el cableado no se
         apaga: la estructura de salida sigue dibujada hasta el punto medio y
         a partir de ahí ya está dibujada la de llegada, tirando de la
         materia hacia su sitio. Se ve una configuración convirtiéndose en la
         siguiente, que es exactamente lo que hace un sistema cuando cambia. */
      var bow = Math.sin(tw * 3.1416);
      if (bow > 0.01) {
        var ddx = mb.x - ma.x, ddy = mb.y - ma.y;
        var dd = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
        var sg = p.hx < 0.5 ? -1 : 1;
        var amp = Math.min(dd * 0.30, 200) * bow * (0.30 + p.z * 0.80) * sg;
        tx += (-ddy / dd) * amp;
        ty += ( ddx / dd) * amp;
        al += bow * 0.15;
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
      /* El cableado cambia de bando A LA VEZ para todas las partículas, no
         partícula a partícula: si no, la estructura se deshilacha en vez de
         transformarse. */
      pg[i] = (tw < 0.5) ? oa.g : ob.g;
      pc[i] = (t < 0.5) ? oa.c : ob.c;

      /* La luz roza: no ilumina todo por igual. */
      var ldx = dx - lx, ldy = dy - ly;
      var lq = (ldx * ldx + ldy * ldy) / lr2;
      var luz = 0.42 / (1 + lq * lq);

      var v2 = p.vx * p.vx + p.vy * p.vy;
      var sp = v2 > 30 ? 1.10 : v2 * 0.040;
      var r = (1.05 + p.s * 2.5) * (0.55 + p.z * 1.15) * (1 + sp) * dep;
      var a2 = (al + luz) * (0.40 + p.z * 0.72) * (0.68 + 0.32 * dep);
      if (a2 <= 0.012) continue;
      var spr = SPR[p.e][(t < 0.5 ? oa.c : ob.c)];
      if (a2 > 0.50) {
        /* Halo: solo lo que de verdad brilla lo tiene, y por eso significa
           algo cuando aparece. */
        var rb = r * 3.0;
        ctx.globalAlpha = Math.min(0.22, (a2 - 0.50) * 0.52);
        ctx.drawImage(spr, dx - rb, dy - rb, rb * 2, rb * 2);
      }
      ctx.globalAlpha = Math.min(0.80, a2);
      ctx.drawImage(spr, dx - r, dy - r, r * 2, r * 2);
    }

    /* EL ENLACE, AHORA CON COLOR. Une partículas CONSECUTIVAS DEL MISMO
       GRUPO: la estructura la dibujan ellas, no una línea añadida por
       encima. Y hereda el color de la materia que une, así que un puente
       recién tendido es cian, una capa de arquitectura es azul y un cabo
       suelto es magenta — sin necesidad de una sola leyenda.

       Se pinta en pasadas, una por color. Son ocho recorridos triviales del
       array: cuesta menos que el resto del fotograma y es lo que separa una
       maraña gris de una infraestructura legible. */
    ctx.globalAlpha = 1; ctx.lineWidth = 1;
    var afl = 0.5 - 0.42 * Math.abs(tw - 0.5) * 2;
    for (var c2 = 0; c2 < COL.length; c2++) {
      var hay = false;
      ctx.beginPath();
      for (var k2 = 1; k2 < N; k2++) {
        if (pc[k2] !== c2) continue;
        if (pg[k2] < 0 || pg[k2] !== pg[k2 - 1]) continue;
        var ddx = px[k2] - px[k2 - 1], ddy = py[k2] - py[k2 - 1];
        if (ddx * ddx + ddy * ddy > 30000) continue;
        ctx.moveTo(px[k2 - 1], py[k2 - 1]); ctx.lineTo(px[k2], py[k2]); hay = true;
      }
      if (!hay) continue;
      /* La brumа sostiene, no habla: se pinta bastante más baja que un
         enlace con significado. */
      var op = (c2 === C_BRUMA || c2 === C_MASA) ? 0.075 : 0.20;
      ctx.strokeStyle = rgba(COL[c2], op + 0.10 * afl);
      ctx.stroke();
    }

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
