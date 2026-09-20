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

  /* EL PUNTERO, EN LAS COORDENADAS DE LA FIGURA.

     Hasta ahora el ratón solo desplazaba el campo entero unos píxeles. Eso es
     paralaje: decorativo. Para que una figura REACCIONE —que la lupa busque
     donde miras, que las ideas se reorganicen alrededor del puntero, que la
     gráfica te enseñe la medida que señalas— la formación necesita saber
     dónde está el puntero EN SU PROPIO SISTEMA DE COORDENADAS, el mismo 0..1
     en el que escribe `o.nx` y `o.ny`. Eso es MFX/MFY, y se calcula una vez
     por fotograma, no una vez por partícula.

     Sin ratón —un teléfono, o movimiento reducido— no se queda quieto: el
     foco recorre solo una trayectoria lenta, así que la figura se explica
     sola. Y un toque en la pantalla lo lleva ahí unos segundos. */
  var MFX = 0.5, MFY = 0.5;
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

  /* ===================================== EL CORREDOR DE LA MARCA (hero) ====
     La marca del hero se DIMENSIONABA con la altura de la ventana y se
     POSICIONABA con la anchura. Las dos cosas iban por su cuenta, y el
     resultado medido era este: el hueco al titular pasaba de 34 px a
     1366x880 —el formato desde el que se vio el problema— a 190 px a
     1920x1080, y por la derecha la pieza se metia entre 27 y 86 px por
     debajo del indice en TODOS los formatos.

     Aqui las dos cosas salen del sitio que realmente hay. Se mide el borde
     pintado del titular (rangos de texto, no la caja del bloque, que es
     mucho mas ancha) y el filo del indice, y la marca se coloca y se escala
     dentro de ese corredor con un hueco minimo garantizado a cada lado.

     La geometria NO se toca: LOGO_LS es un factor de escala uniforme sobre
     la misma forma. Solo se reduce cuando el corredor no da de si, y nunca
     por debajo del 82% de la escala aprobada.

     La relacion, deducida de la propia formacion:
       ancho pintado = 1.1671 * LS * marco.h * H     (no depende de marco.w)
       centro pintado = W * marco.x - 0.014 * LS * marco.h * H
     De ahi se despeja LS a partir del ancho que cabe, y marco.x del centro
     donde debe caer. */
  var LOGO_LS = 0.545;
  var _rgo = null;
  function bordeTitular() {
    var h1 = document.querySelector('.v6-hero h1');
    if (!h1) return 0;
    var sp = h1.querySelectorAll('span'), der = 0;
    if (!_rgo) _rgo = document.createRange();
    for (var i = 0; i < sp.length; i++) {
      _rgo.selectNodeContents(sp[i]);
      var rr = _rgo.getClientRects();
      for (var j = 0; j < rr.length; j++) if (rr[j].right > der) der = rr[j].right;
    }
    return der;
  }
  function encuadreMarca() {
    var fr = MARCO[0];
    var base = narrow ? 0.54 : 0.545;
    LOGO_LS = base;
    if (narrow) return;                       // en vertical no hay corredor
    var der = bordeTitular();
    if (!der || der > W * 0.86) return;       // sin medida fiable, como estaba

    /* El filo del indice. Sobre el hero esta retraido a un trazo de 12 px
       pegado al borde, asi que lo que hay que esquivar es ese trazo, no la
       caja de 108 px que ocupa cuando esta desplegado. */
    var tope = W - 16;
    var idx = document.querySelector('.dcx');
    if (idx && getComputedStyle(idx).display !== 'none') {
      tope = Math.round(idx.getBoundingClientRect().right) - 12;
    }

    var HUECO = Math.max(58, Math.min(112, W * 0.050));   // aire al titular
    var MARGEN = Math.max(26, Math.min(52, W * 0.022));   // aire al filo
    var corredor = tope - der;
    /* El tamano aprobado sale de la ALTURA, y en una ventana mucho mas alta
       que ancha —900x1200, por ejemplo— eso pedia una pieza de 427 px dentro
       de 900 px de ventana: se salia por la derecha y se comia el titular.
       El tope por anchura solo entra en juego en ese caso. */
    var aprob = 1.1671 * base * fr.h * Math.min(H, W * 0.72);
    var cabe = corredor - HUECO - MARGEN;
    var anchoP = Math.max(0.72 * aprob, Math.min(aprob, cabe));
    /* Y pase lo que pase, la pieza no invade: si ni con el suelo cabe, cede
       ella antes que solaparse con el texto o salirse por el filo. */
    if (corredor - anchoP < 40) anchoP = Math.max(60, corredor - 40);

    var sobra = corredor - anchoP, hueco;
    if (sobra >= HUECO + MARGEN) hueco = HUECO + (sobra - HUECO - MARGEN) * 0.62;
    else hueco = sobra * (HUECO / (HUECO + MARGEN));

    LOGO_LS = anchoP / (1.1671 * fr.h * H);
    fr.x = (der + hueco + anchoP / 2 + 0.014 * LOGO_LS * fr.h * H) / W;
  }

  function measure() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    W = root.clientWidth; H = root.clientHeight;
    narrow = W < 900; small = W < 620;
    /* ENCUADRE PARA VERTICAL. Los marcos están pensados para el reparto de
       escritorio —texto a un lado, campo al otro—, y en vertical ese reparto
       no existe: el texto ocupa el ancho entero. Manteniéndolos, cada
       formación quedaba comprimida en una banda de metro y medio de ancho y
       lo que en escritorio era una red se veía como una maraña.

       En vertical los marcos se centran y se abren al ancho completo: la
       figura pasa por detrás del texto —para eso están los velos— pero se
       lee como lo que es. Y el fenómeno de la portada baja al tercio
       inferior, que es la única franja libre de un móvil. */
    for (var mi = 0; mi < MARCO.length; mi++) {
      MARCO[mi].x = narrow ? 0.500 : MARCO_ANCHO[mi].x;
      MARCO[mi].w = narrow ? (mi === 0 ? 0.88 : 0.94) : MARCO_ANCHO[mi].w;
      MARCO[mi].h = narrow
        ? (ALTO_MOVIL[mi] !== 0 ? ALTO_MOVIL[mi] : Math.min(1.02, MARCO_ANCHO[mi].h * 1.12))
        : MARCO_ANCHO[mi].h;
    }
    encuadreMarca();
    sucioReset();                      // el lienzo cambia de tamano: se borra entero
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#05070e'; ctx.fillRect(0, 0, W, H);
    build();
  }

  function build() {
    N = small ? 620 : narrow ? 1080 : 1560;
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
        /* El retardo de cada particula ya no es aleatorio: depende de su
           sitio en la banda, y las bandas van ordenadas por papel —primero
           los nodos, luego las aristas, luego lo que circula—. Asi la
           estructura siguiente SE CONSTRUYE en el orden en que se lee, en
           vez de deslizarse entera de golpe. */
        dl: (i / (small ? 620 : narrow ? 1080 : 1560)) * 0.52,
        vx: 0, vy: 0, x: -1, y: 0,
        hx: sd(i, 4), hy: sd(i, 5)     // sitio en la bruma de fondo
      });
      ORD.push(i);
    }
    /* De lejos a cerca: lo cercano tapa a lo lejano, no al revés. */
    ORD.sort(function (a, b) { return PT[a].z - PT[b].z; });
    buffers(N);

    grafos();
    sprites();
  }

  /* ------------------------------------------------------- COMPOSICIÓN */
  /* Cada estado ocupa el espacio de otra manera. La escala y la densidad
     forman parte del significado: el campo en bruto es enorme y disperso, la
     anomalía es pequeña y precisa, la red es monumental, el resultado
     envuelve. Si todos ocuparan el mismo sitio, el recorrido sería plano. */
  /* EL ORDEN DE LA PORTADA, EN UNA SOLA TABLA.

     Los estados son el orden de lectura de la página: el número de
     `data-state` de cada sección es su sitio aquí. Antes cada formación
     tenía su índice escrito a mano en cinco sitios distintos —encuadre,
     densidad, intensidad, volteo y la propia función— y mover una sección
     significaba encontrarlos todos. Ahora la formación recibe su índice y lo
     usa para leer su encuadre, así que reordenar la portada es reordenar
     esta tabla. */
  var S_MARCA = 0, S_PROBLEMA = 1, S_FINANCE = 2, S_LUPA = 3, S_MENTE = 4,
      S_SISTEMA = 5, S_CURVA = 6, S_PIEZAS = 7, S_CONFIANZA = 8, S_CIERRE = 9;
  var MARCO = [
    /* El hero: el marco ES la caja de la identidad —banda derecha, 34% de
       ancho y 56% de alto— para que la marca entera y su anillo queden
       DENTRO de la ventana y a la derecha del titular. */
    { x: 0.848, y: 0.50,  w: 0.34, h: 0.56, d: 1.06 },  // 0 MARCA      el hero
    { x: 0.720, y: 0.52,  w: 0.54, h: 1.02, d: 0.96 },  // 1 AISLADOS   el problema
    { x: 0.745, y: 0.180, w: 0.46, h: 0.32, d: 0.90 },  // 2 SUPERVISA  Finance
    { x: 0.722, y: 0.50,  w: 0.46, h: 0.80, d: 0.96 },  // 3 LUPA       analizamos
    { x: 0.700, y: 0.50,  w: 0.50, h: 0.88, d: 1.02 },  // 4 MENTE      diseñamos
    { x: 0.684, y: 0.50,  w: 0.56, h: 0.96, d: 1.06 },  // 5 SISTEMA    implantamos
    { x: 0.706, y: 0.50,  w: 0.54, h: 0.72, d: 0.96 },  // 6 CURVA      medimos
    { x: 0.880, y: 0.50,  w: 0.20, h: 0.90, d: 0.92 },  // 7 INVENTARIO tótem
    { x: 0.700, y: 0.50,  w: 0.52, h: 0.62, d: 0.92 },  // 8 CADENA     confianza
    { x: 0.500, y: 0.470, w: 1.04, h: 0.86, d: 1.06 }   // 9 CONVERGE   el cierre
  ];
  /* USO recorta el rango de índices que participa en cada estado. Estaba
     pensado como un control de densidad y funcionaba como una AMPUTACIÓN:
     las últimas bandas de cada formación —el frente de lectura de Analizamos,
     el contador de Medimos, el tráfico por encima de la arquitectura— caían
     fuera del corte y no se dibujaban nunca. Se habían escrito y no se veían.
     La variación de densidad la da el encuadre, que para eso está. */
  /* Copia de los valores de escritorio: measure() reescribe MARCO en vertical
     y sin este original no habría a qué volver al girar el aparato. */
  var MARCO_ANCHO = MARCO.map(function (m) { return { x: m.x, w: m.w, h: m.h }; });

  /* ALTURA EN VERTICAL, FIGURA POR FIGURA.

     En vertical los encuadres se centran y se abren al ancho entero, y la
     altura se subía un 12%. Para una red o un campo eso da igual —ocupan lo
     que les den—, pero una figura con FORMA se deforma: cualquier cosa que
     se dibuje con la corrección de proporción sale circular en píxeles y su
     tamaño es `alto x altura de ventana`, así que en un marco alto se sale
     por los lados del teléfono.

     Medido a 390: el contorno de la mente salía de 675 px de diámetro en una
     ventana de 367 y se cortaba por los dos lados; la gráfica medía 308 de
     ancho por 558 de alto y se leía como una raya vertical, no como algo que
     sube. Aquí va la altura que necesita cada una para caber y seguir
     leyéndose. Un 0 quiere decir «la de siempre». */
  var ALTO_MOVIL = [0.62, 0, 0, 0.84, 0.52, 0.82, 0.38, 0, 0, 0];
  /* USO vuelve, pero ARREGLADO. En su primera versión recortaba el rango de
     índices y eso AMPUTABA las últimas bandas de cada formación —el frente de
     lectura, el contador, el tráfico— que dejaban de dibujarse. Ahora no
     recorta: REESCALA. La formación sigue recorriendo su rango completo de 0
     a 1, solo que con menos partículas repartidas por él.

     Sirve para una cosa concreta: la marca del hero necesita 1.560 partículas
     para rellenarse de verdad, y los otros ocho capítulos estaban bien con
     1.060. Sin esto, subir el total para la marca encarecía todo el recorrido
     y costaba entre 10 y 15 fps en los capítulos densos. Con esto, la
     portada tiene la marca rellena y el resto se dibuja exactamente con las
     mismas partículas que antes. */
  var USO = [1, 0.68, 0.68, 0.72, 0.72, 0.74, 0.70, 0.68, 0.68, 0.68];

  /* RITMO. Un recorrido en el que todo suena igual de fuerte no tiene
     momentos. Estos son los que hay: el hero es un fenomeno, el problema es
     apagado a proposito —es el unico capitulo que no debe gustar—, la red y
     la convergencia son los dos picos, y Finance es contemplativo porque
     el protagonista ahi es el producto, no el campo. */
  /* Los dos picos suben y los valles bajan: el impacto aparece cuando algo
     cambia, no cuando todo está al máximo. El problema es el capítulo más
     apagado del recorrido a propósito, y Finance el más contemplativo porque
     ahí el protagonista es el producto. */
  /* El hero baja de intensidad a propósito: con la marca ya rellena, la suma
     aditiva llegaba a floración en media pieza —coste de relleno y color
     lavado a la vez—. Por debajo del umbral, la marca conserva su color y el
     fotograma cuesta la mitad. */
  /* El orden nuevo tiene otros picos: la lupa entra suave porque es el
     primer paso, la mente es el primer pico, el sistema conectado el
     segundo, y Finance el más apagado de todos a propósito —ahí el
     protagonista es la aplicación, y el campo no debe competir con ella—. */
  var INT = [1.00, 0.82, 0.62, 0.88, 1.16, 1.08, 0.96, 0.92, 0.78, 1.34];

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

    /* LA MENTE — una silueta orgánica y, dentro, las ideas y lo que las une.
       Las posiciones están a mano: una malla regular se lee como una rejilla,
       y una mente no es una rejilla. */
    nodos = [];
    var IDE = [[-0.24,-0.16],[-0.09,-0.25],[ 0.07,-0.22],[ 0.22,-0.12],
               [-0.28, 0.02],[-0.13,-0.05],[ 0.02,-0.04],[ 0.17, 0.05],
               [-0.21, 0.18],[-0.05, 0.14],[ 0.11, 0.19],[ 0.26, 0.15],
               [ 0.00, 0.29]];
    var arM = (MARCO[S_MENTE].h * H) / (MARCO[S_MENTE].w * W);
    for (i = 0; i < IDE.length; i++) nodos.push(nd(0.5 + IDE[i][0] * arM, 0.5 + IDE[i][1], i));
    GR.mente = mkG(nodos, [[0,1],[1,2],[2,3],[0,5],[1,5],[2,6],[3,7],
                           [4,5],[5,6],[6,7],[4,8],[5,9],[6,9],[7,10],[7,11],
                           [8,9],[9,10],[10,11],[9,12],[10,12]]);

    /* EL SISTEMA — seis piezas DISTINTAS entre sí. Que sean distintas es el
       argumento: lo que tiene una empresa no son cuatro copias de lo mismo,
       es un listado, un ciclo, una pareja de cosas que se hablan y un trasto
       con cinco patas. Cada una funciona por dentro; ninguna habla con las
       demás hasta que se tienden los puentes. */
    nodos = []; ar = [];
    var arS = (MARCO[S_SISTEMA].h * H) / (MARCO[S_SISTEMA].w * W);
    var PZ = [[0.155, 0.200], [0.520, 0.105], [0.860, 0.255],
              [0.865, 0.735], [0.500, 0.890], [0.140, 0.705]];
    var pieza = [];
    function pon(px2, py2, k2) { nodos.push(nd(px2, py2, k2)); return nodos.length - 1; }
    for (k = 0; k < 6; k++) {
      var cx2 = PZ[k][0], cy2 = PZ[k][1], lista = [];
      if (k === 0) {                                   // un listado
        for (i = 0; i < 3; i++) lista.push(pon(cx2, cy2 - 0.052 + i * 0.052, k));
        for (i = 1; i < 3; i++) ar.push([lista[i - 1], lista[i]]);
      } else if (k === 1) {                            // un ciclo
        for (i = 0; i < 4; i++) {
          var a4 = (i / 4) * TAU - 0.785;
          lista.push(pon(cx2 + Math.cos(a4) * 0.050 * arS, cy2 + Math.sin(a4) * 0.050, k));
        }
        for (i = 0; i < 4; i++) ar.push([lista[i], lista[(i + 1) % 4]]);
      } else if (k === 2) {                            // tres cosas que se cruzan
        for (i = 0; i < 3; i++) {
          var a3 = (i / 3) * TAU - 1.571;
          lista.push(pon(cx2 + Math.cos(a3) * 0.052 * arS, cy2 + Math.sin(a3) * 0.052, k));
        }
        ar.push([lista[0], lista[1]]); ar.push([lista[1], lista[2]]); ar.push([lista[2], lista[0]]);
      } else if (k === 3) {                            // una fila
        for (i = 0; i < 4; i++) lista.push(pon(cx2 + (i - 1.5) * 0.042 * arS, cy2, k));
        for (i = 1; i < 4; i++) ar.push([lista[i - 1], lista[i]]);
      } else if (k === 4) {                            // un centro con patas
        lista.push(pon(cx2, cy2, k));
        for (i = 0; i < 4; i++) {
          var a5 = (i / 4) * TAU;
          lista.push(pon(cx2 + Math.cos(a5) * 0.054 * arS, cy2 + Math.sin(a5) * 0.054, k));
          ar.push([lista[0], lista[lista.length - 1]]);
        }
      } else {                                         // dos que se hablan
        lista.push(pon(cx2 - 0.034 * arS, cy2, k));
        lista.push(pon(cx2 + 0.034 * arS, cy2, k));
        ar.push([lista[0], lista[1]]);
      }
      pieza.push(lista);
    }
    GR.sis = mkG(nodos, ar);
    /* Los puentes van aparte porque son el momento del capítulo. Cada uno une
       los dos nodos MÁS CERCANOS de las dos piezas: un puente que sale por el
       lado de atrás se lee como un adorno, no como una conexión. */
    function cerca2(A, B) {
      var mj = null, dm = 1e9;
      for (var x = 0; x < pieza[A].length; x++) {
        for (var y = 0; y < pieza[B].length; y++) {
          var na2 = nodos[pieza[A][x]], nb2 = nodos[pieza[B][y]];
          var ddx = (na2.x - nb2.x) / arS, ddy = na2.y - nb2.y;
          var dd2 = ddx * ddx + ddy * ddy;
          if (dd2 < dm) { dm = dd2; mj = [pieza[A][x], pieza[B][y]]; }
        }
      }
      return mj;
    }
    var PAR = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[1,4]];
    var pu = [];
    for (k = 0; k < PAR.length; k++) pu.push(cerca2(PAR[k][0], PAR[k][1]));
    GR.sisPue = mkG(nodos, pu);

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
        /* Islas algo más grandes: repartidas por las esquinas del encuadre y
           con este radio se leían como cuatro constelaciones flojas. Con más
           cuerpo se leen como cuatro SISTEMAS, que es lo que son, tanto en el
           capítulo del problema como en el de la conexión. */
        nodos.push(nd(CENT[k][0] + Math.cos(an) * 0.132, CENT[k][1] + Math.sin(an) * 0.132, k));
      }
      grp.push(g2);
      for (i = 0; i < 5; i++) ar.push([g2[i], g2[(i + 1) % 5]]);   // red interna
      ar.push([g2[0], g2[2]]);
    }
    GR.redInt = mkG(nodos, ar);

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
    var arC = (MARCO[S_CIERRE].h * H) / (MARCO[S_CIERRE].w * W);
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

  /* tramo() se llama una o dos veces por particula y por formacion. Con 1.560
     particulas y dos formaciones vivas eso eran entre 3.000 y 6.000 objetos
     nuevos POR FOTOGRAMA —del orden de un cuarto de millon por segundo— que
     no hacian mas que alimentar al recolector de basura. Ahora se reparten de
     un anillo de dieciseis: ningun resultado sobrevive a su propia iteracion,
     asi que dieciseis sobran de largo. El valor devuelto es el mismo. */
  var _TR = [], _tp = 0;
  for (var _t = 0; _t < 16; _t++) _TR.push({ k: 0, j: 0 });
  function tramo(u, a, b, n) {
    var t = (u - a) / (b - a) * n;
    var k = t | 0; if (k >= n) k = n - 1; if (k < 0) k = 0;
    var o = _TR[_tp = (_tp + 1) & 15];
    o.k = k; o.j = t - k;
    return o;
  }

  /* ================== LA IDENTIDAD, EN COORDENADAS DE MATERIA ==============

     LA MARCA SE RELLENA POR ÁREA, NO SE TRAZA POR EL BORDE.

     Los intentos anteriores dibujaban el RECORRIDO de la forma —hebras
     paralelas siguiendo la línea— y por eso salía o a rayas o demasiado
     fina. Aquí se hace al revés: se recorre la SUPERFICIE.

     La «D» se corta en 140 secciones transversales a lo largo de su
     recorrido, y las partículas de cada sección la cruzan de lado a lado
     del grosor. Como el enlace une partículas consecutivas del mismo grupo,
     cada sección se cierra en un segmento macizo; 140 segmentos separados
     unos 4 px rellenan la pieza entera. Los módulos, igual: 24 columnas por
     módulo, cada una una barra vertical que lo cruza de arriba abajo.

     Resultado: la geometría real del logo —el grosor real, las proporciones
     reales, leídas del asset píxel a píxel— rellena de verdad, sin dejar de
     estar hecha de partículas.

     Y EL COLOR ES EL DEL TITULAR. El degradado de «Construimos su sistema»
     va de cian a azul, violeta y magenta; la marca usa el mismo recorrido,
     mapeado a su altura: cian arriba, magenta abajo. Ya no hay blanco. */
  var LOGO_MOD = [
    [0.288, 0.094], [0.288, 0.926],     // en los brazos de la D
    [0.067, 0.327], [0.067, 0.703],     // exteriores
    [0.338, 0.327], [0.338, 0.703],     // interiores
    [0.196, 0.520]                      // el centro
  ];
  var MOD_W = 0.140, MOD_H = 0.146;     // medidos sobre el asset real
  var D_GRUESO = 0.082;                 // medio grosor del trazo de la «D»

  /* Recorrido del trazo, por longitud de arco: barra, cuenco, barra. `off`
     es la posición A TRAVÉS del grosor, de -0.082 a +0.082. */
  function arcoD(s, off, out) {
    if (s < 0.204) {
      out.x = 0.40 + (s / 0.204) * 0.32;
      out.y = 0.095 + off;
    } else if (s < 0.796) {
      var an = -1.5708 + ((s - 0.204) / 0.592) * 3.1416;
      out.x = 0.72 + Math.cos(an) * (0.184 - off * 0.92);
      out.y = 0.50 + Math.sin(an) * (0.405 - off);
    } else {
      out.x = 0.72 - ((s - 0.796) / 0.204) * 0.32;
      out.y = 0.905 - off;
    }
  }
  /* El degradado del titular, en cuatro paradas, mapeado a la altura. */
  function tonoLogo(ly) {
    return ly < 0.30 ? C_FLUJO : ly < 0.52 ? C_DATO : ly < 0.76 ? C_PROC : C_DEC;
  }
  var _lg = { x: 0, y: 0 }, _le = { x: 0, y: 0 };

  /* 0 · EL HERO. La composición está COMPLETA en el primer fotograma: no hay
     nada que esperar. Lo que ocurre después es vida interior —un pulso de
     luz recorriendo la pieza y las corrientes que la alimentan—, no un
     montaje. */
  function F0(i, u, g, G, o, tm, ins) {
    var ar = (MARCO[g].h * H) / (MARCO[g].w * W);
    var fx = 0.500, fy = 0.500;
    var LS = LOGO_LS;
    var LX = LS * 1.188 * ar;
    var late = 0.5 + 0.5 * Math.sin(tm * 0.0013);
    var pulso = (tm * 0.00026) % 1;

    if (u < 0.10) {                               // LAS CORRIENTES — ambiente
      var CO = 12;
      var q = tramo(u, 0, 0.10, CO);
      var k = q.k, sp = q.j;
      var acc = sp * sp;
      var abre = 1 - acc;
      var fxc = fx - 0.50;
      var yk = fy + (sd(k, 21) - 0.5) * 2.40;
      o.nx = -1.60 + (fxc + 1.60) * acc;
      o.ny = fy + (yk - fy) * abre * abre
                + Math.sin(sp * 3.1 + k * 2.3 + tm * 0.00020) * 0.11 * abre;
      var onda = ((tm * 0.00026) + sd(k, 26) * 0.4) % 1;
      var d = sp - onda;
      o.a = (0.12 + 0.30 * acc) * (0.34 + 0.66 * Math.exp(-d * d * 46))
          * cl((sp - 0.30) / 0.26) * (1 - cl((acc - 0.86) / 0.14));
      o.c = sp < 0.66 ? C_DATO : C_PROC;
      o.r = 0.9;
      o.g = 10 + k;
      return;
    }

    if (u < 0.62) {                               // LA «D», RELLENA
      /* 90 secciones a lo largo y 9 partículas cruzando cada una: con 140
         secciones de 5 partículas la pieza salía rayada, porque a lo ancho
         del grosor quedaban 10 px entre punto y punto. Repartido así, las
         separaciones son de 6 px en los dos sentidos y el relleno cierra. */
      var FILAS = 90;
      var q2 = tramo(u, 0.10, 0.62, FILAS);
      var sD = q2.k / (FILAS - 1);
      arcoD(sD, (q2.j - 0.5) * 2 * D_GRUESO, _lg);
      o.nx = fx + (_lg.x - 0.5) * LX;
      o.ny = fy + (_lg.y - 0.5) * LS;
      /* Un pulso de luz recorre la pieza: es lo único que se mueve. */
      var dp = sD - pulso; if (dp < -0.5) dp += 1; if (dp > 0.5) dp -= 1;
      var punta = Math.exp(-dp * dp * 620);
      /* En el cuenco la sección es RADIAL, así que el borde interior recorre
         menos camino que el exterior y se apelmaza: sin compensarlo, esa
         mitad reventaba en blanco y el cuenco se veía gris al lado de unas
         barras saturadas. */
      /* En el cuenco la sección es RADIAL: el borde interior recorre menos
         camino que el exterior, así que se apelmaza y revienta en blanco
         mientras el exterior queda flojo. Se compensa en los dos sentidos. */
      var dens = (sD > 0.204 && sD < 0.796) ? (1.10 - 0.34 * q2.j) : 1;
      /* Alfa contenida: con la pieza ya rellena, la suma aditiva de las
         secciones superpuestas reventaba los centros en blanco y el color se
         perdía justo donde la forma es más maciza. */
      o.a = (0.44 + 0.11 * late + 0.28 * punta) * dens;
      /* El tono lo decide el EJE de la sección, no cada partícula. Tomándolo
         partícula a partícula, dentro de una misma sección del cuenco —que
         es radial y cruza mucha altura— convivían dos y hasta tres tonos, y
         al sumarse en modo aditivo el cuenco se lavaba a gris mientras las
         barras salían saturadas. Con el eje, cada sección tiene un color y
         el degradado baja limpio de cian a magenta. */
      arcoD(sD, 0, _le);
      o.c = punta > 0.94 ? C_LUZ : tonoLogo(_le.y);
      o.r = 1.05;
      o.g = 20 + q2.k;                            // cada sección, su grupo
      return;
    }

    if (u < 0.965) {                              // LOS MÓDULOS, RELLENOS
      var COLM = 12;
      var q3 = tramo(u, 0.62, 0.965, LOGO_MOD.length);
      var M = LOGO_MOD[q3.k];
      var sub = tramo(q3.j, 0, 1, COLM);
      var lx = M[0] + (sub.k / (COLM - 1) - 0.5) * MOD_W;
      var ly = M[1] + (sub.j - 0.5) * MOD_H;
      o.nx = fx + (lx - 0.5) * LX;
      o.ny = fy + (ly - 0.5) * LS;
      var turno = cl(1 - Math.abs(((tm * 0.00013) % 1) * 7 - q3.k) * 0.80);
      o.a = 0.44 + 0.11 * late + 0.18 * turno;
      /* Cada módulo, un solo tono: el de su centro. */
      o.c = tonoLogo(M[1]);
      o.r = 1.05;
      o.g = 40 + q3.k * 16 + sub.k;               // cada columna, su grupo
      return;
    }

    /* Polvo: volumen, no vacío negro. */
    o.nx = sd(i, 23); o.ny = sd(i, 24);
    o.a = 0.09 + 0.09 * Math.sin(tm * 0.0006 + sd(i, 25) * 6.3);
    o.c = C_MASA; o.r = 0.8; o.g = -1;
  }

  /* 1 · EL PROBLEMA — «Persigo cobros · se me escapan · lo mismo en tres
     sitios». Cuatro sistemas CALCADOS, cada uno funcionando por dentro, y
     ninguno hablando con los demas.

     EN CUATRO ACTOS, conducidos por el scroll:
       1  aparecen las cuatro islas, apagadas
       2  cada una se enciende por dentro: hay trabajo ahi
       3  INTENTAN SALIR — lanzan senales hacia las otras y se apagan a medio
          camino, en magenta. Es el acto que da sentido a todo el capitulo:
          no es que no hagan nada, es que lo que hacen no llega
       4  se quedan asi, latiendo, separadas

     Este es el unico capitulo de la portada que no debe gustar. Por eso es
     el mas apagado del recorrido: el alivio del siguiente depende de que
     este se sienta cerrado. */
  function F1(i, u, g, G, o, tm, ins) {
    var gi = GR.redInt, ar = (MARCO[g].h * H) / (MARCO[g].w * W);
    var a1 = ease(cl(ins / 0.22));                 // aparecen
    var a2 = ease(cl((ins - 0.20) / 0.26));        // vida interior
    var a3 = ease(cl((ins - 0.46) / 0.30));        // intentan salir
    var a4 = ease(cl((ins - 0.78) / 0.22));        // se quedan asi

    if (u < 0.26) {                                          // los nodos
      var q = tramo(u, 0, 0.26, gi.n.length);
      var nodo = gi.n[q.k];
      /* Aparecen isla por isla, no todas de golpe: se cuentan. */
      var mio = ease(cl((a1 * 4.6 - nodo.k) / 1.1));
      ponNodo(o, nodo.x, nodo.y, q.j, 0.026 * (0.4 + 0.6 * mio), ar);
      o.a = 0.80 * mio; o.c = C_PROC; o.g = mio > 0.2 ? 150 + q.k : -1;
      return;
    }
    if (u < 0.62) {                                          // su red interna
      var q2 = tramo(u, 0.26, 0.62, gi.e.length);
      var kk = gi.e[q2.k].a.k;
      var vis = ease(cl((a1 * 4.6 - kk) / 1.1));
      ponArista(o, gi.e[q2.k], q2.j);
      o.a = 0.46 * vis; o.c = C_MASA; o.g = vis > 0.3 ? 190 + q2.k : -1;
      return;
    }
    if (u < 0.82) {                                          // LO QUE SE PIERDE
      var q3 = tramo(u, 0.62, 0.82, gi.n.length);
      var org = gi.n[q3.k];
      /* Las senales salen con el tercer acto y no antes: hasta entonces
         cada isla solo se ocupa de lo suyo. */
      var t2 = ((tm * 0.00026) + sd(q3.k, 45) + q3.j * 0.3) % 1;
      var an = sd(q3.k, 46) * TAU;
      var alc = 0.20 + 0.24 * a3;                  // cada vez llegan mas lejos
      o.nx = org.x + Math.cos(an) * t2 * alc * ar;
      o.ny = org.y + Math.sin(an) * t2 * alc;
      o.a = a3 * 0.95 * (1 - t2) * (1 - t2);
      o.c = t2 > 0.34 ? C_DEC : C_PROC;
      o.g = -1;
      return;
    }
    var q4 = tramo(u, 0.82, 1.0, gi.e.length);                // trafico interno
    var t = ((tm * 0.00034) + sd(q4.k, 47) + q4.j) % 1;
    ponArista(o, gi.e[q4.k], t);
    /* El latido del cuarto acto: siguen vivas, y siguen solas. */
    var lat = 1 + 0.30 * a4 * Math.sin(tm * 0.0011 + gi.e[q4.k].a.k * 1.6);
    o.a = a2 * (0.20 + 0.72 * Math.sin(t * 3.1416)) * lat;
    o.c = C_PROC; o.g = -1;
  }

  /* ─────────────────────── LOS CUATRO PASOS ───────────────────────────

     Estas cuatro figuras tenían un problema que no era de dibujo: eran
     CORRECTAS y no significaban nada. Un campo de trayectorias, una red, una
     arquitectura por capas y una cadena son el vocabulario de los sistemas,
     sí, pero quien entra en la página no viene a leer un vocabulario: viene a
     entender qué hacéis. Y «analizamos» dibujado como una banda de curvas se
     parece igual a «diseñamos» dibujado como una malla.

     Ahora cada paso forma una FIGURA que se reconoce antes de leer el texto,
     y cada una hace una cosa distinta con el puntero, porque una figura que
     responde se mira el triple de tiempo que una que se contempla.

     El coste es el mismo: las mismas partículas, el mismo bucle, el mismo
     número de llamadas de dibujo. Lo que cambia es dónde se ponen. */

  function enc(v, a, b) { return v < a ? a : (v > b ? b : v); }

  /* Cuánto le importa a un punto que el puntero esté donde está. La distancia
     se mide en unidades REDONDAS —la x se lleva al mismo píxel que la y con
     el ancho del encuadre— o en un marco apaisado el radio de influencia
     saldría ovalado. */
  function cercaDe(x, y, ar) {
    var dx = (x - MFX) / (ar || 1), dy = y - MFY;
    var d2 = dx * dx + dy * dy;
    return d2 > 0.16 ? 0 : Math.exp(-d2 * 26);
  }

  /* ══════════════════════ 01 · ANALIZAMOS — LA LUPA ═════════════════════

     La operación de una empresa, dibujada como lo que es cuando nadie la ha
     mirado: doscientos registros iguales, apagados, todos con la misma
     pinta. Encima, una lente.

     LA LENTE AMPLÍA DE VERDAD. No es un círculo con un brillo dentro: lo que
     cae debajo se SEPARA del centro y se alarga, que es lo que hace una lupa,
     y por eso lo de dentro se puede leer y lo de fuera no. Y la llevas tú con
     el ratón. En un teléfono recorre el campo sola.

     Y hay algo que encontrar: uno de los registros no es como los demás. Se
     marca al final del capítulo, y si lo pillas debajo de la lente, responde.
     Eso es exactamente lo que dice el texto de al lado. */
  function F_LUPA(i, u, g, G, o, tm, ins) {
    var ar = (MARCO[g].h * H) / (MARCO[g].w * W);
    var nace  = ease(cl(ins / 0.16));
    var halla = ease(cl((ins - 0.58) / 0.28));

    /* En un teléfono el paseo es más corto y la lente más pequeña: con el
       recorrido de escritorio el aro se salía por el lado y dejaba de leerse
       como una lupa. */
    var vuelo = narrow ? 0.56 : 0.92;
    var lx = enc(0.5 + (MFX - 0.5) * vuelo, narrow ? 0.24 : 0.17, narrow ? 0.76 : 0.83);
    var ly = enc(0.5 + (MFY - 0.5) * vuelo, narrow ? 0.22 : 0.15, narrow ? 0.78 : 0.85);
    var R  = (narrow ? 0.148 : 0.175) * (0.62 + 0.38 * nace);

    var CD = small ? 11 : narrow ? 13 : 16;
    var FD = small ? 8  : narrow ? 10 : 12;
    var KH = ((FD * 0.58) | 0) * CD + ((CD * 0.34) | 0);

    if (u < 0.60) {                                   // EL CAMPO DE REGISTROS
      var q = tramo(u, 0, 0.60, CD * FD), k = q.k;
      var cx = 0.055 + (k % CD + 0.5) * (0.89 / CD) + (sd(k, 31) - 0.5) * 0.013;
      var cy = 0.055 + ((k / CD) | 0) * (0.89 / (FD - 1)) + (sd(k, 32) - 0.5) * 0.011;
      var dx = (cx - lx) / ar, dy = cy - ly;
      var d = Math.sqrt(dx * dx + dy * dy);
      var dentro = d < R ? (1 - (d / R) * (d / R)) : 0;
      var m = 1 + 0.86 * dentro;
      o.nx = lx + dx * m * ar + (q.j - 0.5) * 0.030 * (1 + 1.25 * dentro);
      o.ny = ly + dy * m;
      o.g = 400 + k;
      o.r = 0.9 + 0.55 * dentro;
      if (k === KH) {                                 // el registro que falla
        var pul = 0.5 + 0.5 * Math.sin(tm * 0.0042);
        o.a = 0.10 + 0.46 * dentro + halla * (0.26 + 0.30 * pul);
        o.c = (halla > 0.12 || dentro > 0.30) ? C_DEC : C_DATO;
        return;
      }
      o.a = 0.075 + 0.50 * dentro;
      o.c = dentro > 0.30 ? C_DATO : C_BRUMA;
      return;
    }

    if (u < 0.86) {                                   // EL ARO DE LA LENTE
      var q1 = tramo(u, 0.60, 0.86, 3);
      var rr = R * (0.945 + q1.k * 0.038);
      var th = q1.j * TAU + q1.k * 0.9;
      o.nx = lx + Math.cos(th) * rr * ar;
      o.ny = ly + Math.sin(th) * rr;
      o.a = ease(cl((nace * 1.35 - q1.j) / 0.30)) * (0.26 + 0.16 * Math.sin(th * 3 + tm * 0.0011));
      o.c = C_LUZ; o.g = 460 + q1.k; o.r = 0.85;
      return;
    }

    if (u < 0.93) {                                   // EL MANGO
      var q2 = tramo(u, 0.86, 0.93, 3);
      var an = 0.86, rr2 = R * (1.00 + q2.j * 0.88), off = (q2.k - 1) * 0.013;
      o.nx = lx + Math.cos(an) * rr2 * ar - Math.sin(an) * off * ar;
      o.ny = ly + Math.sin(an) * rr2 + Math.cos(an) * off;
      o.a = nace * (0.30 - 0.09 * Math.abs(q2.k - 1));
      o.c = C_LUZ; o.g = 470 + q2.k; o.r = 0.85;
      return;
    }

    /* LA MARCA sobre lo encontrado. Sigue al registro aunque la lente lo
       haya movido: si se quedara en su sitio original delataría el truco. */
    var q3 = tramo(u, 0.93, 1.0, 1);
    var hx = 0.055 + (KH % CD + 0.5) * (0.89 / CD) + (sd(KH, 31) - 0.5) * 0.013;
    var hy = 0.055 + ((KH / CD) | 0) * (0.89 / (FD - 1)) + (sd(KH, 32) - 0.5) * 0.011;
    var hdx = (hx - lx) / ar, hdy = hy - ly;
    var hd = Math.sqrt(hdx * hdx + hdy * hdy);
    var sob = hd < R ? (1 - (hd / R) * (hd / R)) : 0;
    var m2 = 1 + 0.86 * sob;
    ponNodo(o, lx + hdx * m2 * ar, ly + hdy * m2, q3.j, 0.026 + 0.014 * (1 - halla) + 0.010 * sob, ar);
    o.a = halla * (0.30 + 0.26 * Math.sin(tm * 0.0042)) + sob * 0.34;
    o.c = C_DEC; o.g = 480;
  }

  /* ══════════════════ 02 · DISEÑAMOS — LA ESTRUCTURA VIVA ═══════════════

     Una silueta orgánica —dos lóbulos, los surcos— y dentro trece ideas
     unidas por conexiones que se curvan. No es una rejilla: una rejilla dice
     «software», y este paso no va de software, va de pensar el sistema antes
     de construirlo.

     LAS IDEAS SE REORGANIZAN DONDE MIRAS. Las que están cerca del puntero se
     acercan a él, se encienden y sus conexiones pasan a cian: la zona que
     estás mirando es la que está pensando. Y hay algo recorriendo las
     conexiones todo el rato, porque una idea suelta no es un diseño. */
  var SURCO = [[-0.02, -0.28, 0.17,  0.55, 2.70],
               [-0.16, -0.01, 0.155, -0.95, 1.35],
               [ 0.14,  0.01, 0.155, 1.95, 4.25],
               [-0.05,  0.19, 0.145, 3.55, 5.60]];
  function rMente(th) {
    return 0.355 + 0.058 * Math.sin(th * 2 + 1.15)
                 + 0.038 * Math.sin(th * 3 + 0.30)
                 + 0.021 * Math.sin(th * 5 + 2.10);
  }
  function F_MENTE(i, u, g, G, o, tm, ins) {
    var gr = GR.mente, ar = (MARCO[g].h * H) / (MARCO[g].w * W);
    var dibuja = ease(cl(ins / 0.20));
    var surcos = ease(cl((ins - 0.14) / 0.26));
    var ideas  = ease(cl((ins - 0.30) / 0.32));
    var unidas = ease(cl((ins - 0.52) / 0.32));
    var resp   = 0.5 + 0.5 * Math.sin(tm * 0.0011);

    if (u < 0.26) {                                   // EL CONTORNO
      var q = tramo(u, 0, 0.26, 2);
      var th = q.j * TAU;
      var rr = rMente(th) * (0.985 + q.k * 0.032) * (0.985 + 0.015 * resp);
      o.nx = 0.5 + Math.cos(th) * rr * ar;
      o.ny = 0.5 + Math.sin(th) * rr;
      o.a = ease(cl((dibuja * 1.30 - q.j) / 0.28)) * (0.20 + 0.09 * q.k);
      o.c = C_PROC; o.g = 500 + q.k; o.r = 0.9;
      return;
    }
    if (u < 0.40) {                                   // LOS SURCOS
      var q1 = tramo(u, 0.26, 0.40, SURCO.length), s = SURCO[q1.k];
      var an = s[3] + (s[4] - s[3]) * q1.j;
      o.nx = 0.5 + (s[0] + Math.cos(an) * s[2]) * ar;
      o.ny = 0.5 + s[1] + Math.sin(an) * s[2];
      o.a = surcos * 0.20;
      o.c = C_PROC; o.g = 510 + q1.k; o.r = 0.8;
      return;
    }
    if (u < 0.76) {                                   // LAS IDEAS
      var q2 = tramo(u, 0.40, 0.76, gr.n.length), nodo = gr.n[q2.k];
      var cer = cercaDe(nodo.x, nodo.y, ar);
      var nx = nodo.x + (MFX - nodo.x) * 0.22 * cer + Math.sin(tm * 0.00040 + sd(q2.k, 41) * 6.3) * 0.006;
      var ny = nodo.y + (MFY - nodo.y) * 0.22 * cer + Math.sin(tm * 0.00052 + sd(q2.k, 42) * 6.3) * 0.006;
      var viva = ease(cl((ideas - sd(q2.k, 43) * 0.55) / 0.30));
      var chis = 0.5 + 0.5 * Math.sin(tm * 0.0016 + sd(q2.k, 44) * 6.3);
      ponNodo(o, nx, ny, q2.j, 0.015 + 0.009 * cer, ar);
      o.a = viva * (0.20 + 0.22 * chis + 0.62 * cer);
      o.c = cer > 0.35 ? C_LUZ : (q2.k % 3 === 0 ? C_FLUJO : C_PROC);
      o.g = 520 + q2.k; o.r = 0.95 + 0.55 * cer;
      return;
    }
    if (u < 0.95) {                                   // LAS CONEXIONES
      var q3 = tramo(u, 0.76, 0.95, gr.e.length), E = gr.e[q3.k], j = q3.j;
      var ex = E.b.x - E.a.x, ey = E.b.y - E.a.y;
      var cb = 0.20 * (sd(q3.k, 45) - 0.5);
      var bx = (E.a.x + E.b.x) * 0.5 - ey * cb * ar;
      var by = (E.a.y + E.b.y) * 0.5 + ex * cb / ar;
      var w0 = (1 - j) * (1 - j), w1 = 2 * (1 - j) * j, w2 = j * j;
      o.nx = w0 * E.a.x + w1 * bx + w2 * E.b.x;
      o.ny = w0 * E.a.y + w1 * by + w2 * E.b.y;
      var ca = Math.max(cercaDe(E.a.x, E.a.y, ar), cercaDe(E.b.x, E.b.y, ar));
      o.a = ease(cl((unidas - sd(q3.k, 46) * 0.50) / 0.34)) * (0.085 + 0.34 * ca);
      o.c = ca > 0.30 ? C_FLUJO : C_PROC;
      o.g = 560 + q3.k; o.r = 0.85;
      return;
    }
    /* LO QUE RECORRE: tres ideas viajando a la vez, cada una por su conexión
       y con una estela corta detrás. */
    var q4 = tramo(u, 0.95, 1.0, 3);
    var ciclo = tm * 0.00022 + q4.k * 0.41;
    var vu = ciclo | 0;
    var E2 = gr.e[(vu * 7 + q4.k * 3) % gr.e.length];
    var j2 = (ciclo - vu) - q4.j * 0.12;
    if (j2 < 0) j2 = 0;
    var ex2 = E2.b.x - E2.a.x, ey2 = E2.b.y - E2.a.y;
    var cb2 = 0.20 * (sd((vu * 7 + q4.k * 3) % gr.e.length, 45) - 0.5);
    var bx2 = (E2.a.x + E2.b.x) * 0.5 - ey2 * cb2 * ar;
    var by2 = (E2.a.y + E2.b.y) * 0.5 + ex2 * cb2 / ar;
    var v0 = (1 - j2) * (1 - j2), v1 = 2 * (1 - j2) * j2, v2 = j2 * j2;
    o.nx = v0 * E2.a.x + v1 * bx2 + v2 * E2.b.x;
    o.ny = v0 * E2.a.y + v1 * by2 + v2 * E2.b.y;
    o.a = unidas * (0.20 + 0.60 * Math.sin(j2 * 3.1416)) * (1 - q4.j * 0.7);
    o.c = C_LUZ; o.g = -1; o.r = 1.1;
  }

  /* ═══════════════ 03 · IMPLANTAMOS — SEIS PIEZAS, UN SISTEMA ═══════════

     Aquí no vale una fábrica, ni engranajes, ni un robot: eso dibuja la
     palabra «automatización», no lo que pasa. Lo que pasa es que una empresa
     YA TIENE seis cosas que funcionan —un listado, un ciclo, una fila, un
     trasto con cinco patas— y ninguna se habla con las otras.

     En este capítulo primero lo intentan: sale algo de cada pieza y se pierde
     a mitad de camino. Después se tiende el primer puente, y luego los demás,
     uno a uno. Y en cuanto existe el puente, lo que se perdía CRUZA. Al final
     circula por el conjunto entero sin que nadie empuje.

     El puntero da corriente a la pieza que señalas: se enciende por dentro y
     empuja más tráfico hacia fuera. */
  function F_SISTEMA(i, u, g, G, o, tm, ins) {
    var gi = GR.sis, gp = GR.sisPue, ar = (MARCO[g].h * H) / (MARCO[g].w * W);
    var llegan  = ease(cl(ins / 0.18));
    var trabaja = ease(cl((ins - 0.14) / 0.20));
    var intenta = ease(cl((ins - 0.28) / 0.18));
    var tiende  = ease(cl((ins - 0.44) / 0.34));
    var pleno   = ease(cl((ins - 0.74) / 0.26));
    var NP = gp.e.length;

    if (u < 0.40) {                                   // LAS PIEZAS
      var q = tramo(u, 0, 0.40, gi.n.length), nodo = gi.n[q.k];
      var cer = cercaDe(nodo.x, nodo.y, ar);
      var cae = ease(cl((llegan * 1.5 - nodo.k * 0.18) / 0.5));
      ponNodo(o, nodo.x, nodo.y + (1 - cae) * 0.10, q.j, 0.017 + 0.006 * cer, ar);
      o.a = cae * (0.26 + 0.22 * pleno + 0.55 * cer);
      o.c = cer > 0.35 ? C_LUZ : C_DATO;
      o.g = 600 + q.k; o.r = 0.95 + 0.4 * cer;
      return;
    }
    if (u < 0.58) {                                   // LO QUE YA FUNCIONA DENTRO
      var q1 = tramo(u, 0.40, 0.58, gi.e.length), E = gi.e[q1.k];
      ponArista(o, E, q1.j);
      var ce1 = Math.max(cercaDe(E.a.x, E.a.y, ar), cercaDe(E.b.x, E.b.y, ar));
      o.a = trabaja * (0.12 + 0.10 * pleno + 0.30 * ce1);
      o.c = ce1 > 0.35 ? C_FLUJO : C_DATO;
      o.g = 620 + q1.k; o.r = 0.85;
      return;
    }
    if (u < 0.86) {                                   // LOS PUENTES
      var q2 = tramo(u, 0.58, 0.86, NP), E2 = gp.e[q2.k], j = q2.j;
      var hecho = ease(cl((tiende * (NP + 0.7) - q2.k) / 1.0));
      ponArista(o, E2, j);
      o.g = 640 + q2.k; o.r = 0.9;
      if (j <= hecho) {
        o.a = 0.13 + 0.24 * hecho + 0.14 * pleno;
        o.c = C_FLUJO;
        return;
      }
      /* Lo que sale antes de que exista el puente muere en el borde. Es el
         mismo trayecto: por eso, cuando el puente se tiende, se entiende. */
      var borde = cl((j - hecho) / 0.22);
      o.a = intenta * (1 - hecho) * 0.34 * (1 - borde);
      o.c = C_DEC;
      if (borde > 0.92) o.g = -1;
      return;
    }
    /* EL TRÁFICO. Lo que cruza un puente llega en blanco: es trabajo que
       antes se quedaba dentro de una pieza. */
    var q3 = tramo(u, 0.86, 1.0, NP + gi.e.length);
    var cruza = q3.k < NP;
    var E3 = cruza ? gp.e[q3.k] : gi.e[q3.k - NP];
    var ce3 = Math.max(cercaDe(E3.a.x, E3.a.y, ar), cercaDe(E3.b.x, E3.b.y, ar));
    var t3 = (tm * 0.00034 * (1 + 0.9 * ce3) + sd(q3.k, 55) + q3.j * 0.34) % 1;
    ponArista(o, E3, t3);
    o.a = (cruza ? pleno : trabaja) * (0.10 + 0.52 * Math.sin(t3 * 3.1416)) * (1 + 0.7 * ce3);
    o.c = cruza ? C_LUZ : C_FLUJO;
    o.g = -1; o.r = 1.0;
  }

  /* ═════════════ 04 · MEDIMOS Y MEJORAMOS — LA GRÁFICA QUE SUBE ═════════

     Una gráfica ascendente, sí, pero no la de una bolsa. La diferencia está
     en de qué está hecha y en cómo sube.

     DE QUÉ ESTÁ HECHA: debajo hay una nube de medidas sueltas —lo que el
     sistema va registrando— y desde el eje suben las marcas de cada lectura.
     La línea no está dibujada sobre ellas: sale de ellas.

     CÓMO SUBE: con tres baches. En cada uno algo ha fallado, se marca en
     magenta, y unas lecturas después ya está corregido y en verde. Eso es lo
     que dice el texto: no sube porque sí, sube porque se mide, se ve lo que
     falla y se corrige.

     Y se lee con el dedo: donde pones el puntero se selecciona una lectura,
     se agranda y bajan sus líneas al eje. */
  function alturaCurva(t) {
    var s = t * t * (3 - 2 * t);
    var a = (t - 0.27) / 0.050, b = (t - 0.55) / 0.045, c = (t - 0.79) / 0.040;
    return 0.10 + s * 0.72
         - 0.062 * Math.exp(-a * a) - 0.054 * Math.exp(-b * b) - 0.042 * Math.exp(-c * c);
  }
  function hundida(t) {
    var a = (t - 0.27) / 0.060, b = (t - 0.55) / 0.055, c = (t - 0.79) / 0.050;
    var d = Math.exp(-a * a), e = Math.exp(-b * b), f = Math.exp(-c * c);
    if (e > d) d = e; if (f > d) d = f;
    return d;
  }
  function F_CURVA(i, u, g, G, o, tm, ins) {
    var ar = (MARCO[g].h * H) / (MARCO[g].w * W);
    var NM = small ? 8 : 12;
    var frente = ease(cl(ins / 0.76)) * 1.08;
    var X0 = 0.10, XW = 0.84, Y0 = 0.92;
    var kSel = Math.round(enc((MFX - X0) / XW, 0, 1) * (NM - 1));

    if (u < 0.12) {                                   // LOS EJES
      var q = tramo(u, 0, 0.12, 2);
      if (q.k === 0) { o.nx = X0 + q.j * (XW + 0.05); o.ny = Y0; }
      else           { o.nx = X0; o.ny = Y0 - q.j * 0.84; }
      o.a = 0.085; o.c = C_BRUMA; o.g = -1; o.r = 0.7;
      return;
    }
    if (u < 0.40) {                                   // LA NUBE DE MEDIDAS
      var t1 = sd(i, 61);
      o.nx = X0 + t1 * XW;
      o.ny = Y0 - alturaCurva(t1) * (0.16 + 0.80 * sd(i, 62));
      o.a = t1 < frente ? 0.115 : 0;
      o.c = C_BRUMA; o.g = -1; o.r = 0.75;
      return;
    }
    if (u < 0.56) {                                   // LAS MARCAS DE LECTURA
      var q2 = tramo(u, 0.40, 0.56, NM);
      var tk = q2.k / (NM - 1), sel2 = q2.k === kSel;
      o.nx = X0 + tk * XW;
      o.ny = Y0 - q2.j * alturaCurva(tk);
      o.a = cl((frente - tk) / 0.05) * (0.075 + (sel2 ? 0.26 : 0));
      o.c = sel2 ? C_LUZ : C_BRUMA; o.g = 700 + q2.k; o.r = 0.75;
      return;
    }
    if (u < 0.86) {                                   // LA LÍNEA
      var q3 = tramo(u, 0.56, 0.86, 3), tc = q3.j;
      o.nx = X0 + tc * XW;
      o.ny = Y0 - alturaCurva(tc) + (q3.k - 1) * 0.009;
      var cen = 1 - Math.abs(q3.k - 1);
      var bache = hundida(tc);
      o.a = cl((frente - tc) / 0.04) * (0.17 + 0.26 * cen);
      o.c = bache > 0.45
          ? (cl((frente - tc - 0.09) / 0.10) > 0.5 ? C_OK : C_DEC)
          : C_FLUJO;
      o.g = 710 + q3.k; o.r = 0.9 + 0.5 * cen;
      return;
    }
    if (u < 0.96) {                                   // LOS PUNTOS MEDIDOS
      var q4 = tramo(u, 0.86, 0.96, NM);
      var td = q4.k / (NM - 1), sel3 = q4.k === kSel;
      var vis = ease(cl((frente - td) / 0.05));
      ponNodo(o, X0 + td * XW, Y0 - alturaCurva(td), q4.j, (sel3 ? 0.023 : 0.014) * vis, ar);
      o.a = vis * (0.38 + (sel3 ? 0.42 : 0));
      o.c = sel3 ? C_LUZ : C_OK; o.g = 730 + q4.k; o.r = sel3 ? 1.3 : 1;
      return;
    }
    /* LA LECTURA SEÑALADA: la vertical hasta el eje y la horizontal hasta la
       escala. Es lo que hace cualquiera con el dedo sobre una gráfica. */
    var q5 = tramo(u, 0.96, 1.0, 2);
    var ts = kSel / (NM - 1), vs = alturaCurva(ts);
    if (q5.k === 0) { o.nx = X0 + ts * XW; o.ny = Y0 - vs * (1 - q5.j); }
    else            { o.nx = X0 + q5.j * ts * XW; o.ny = Y0 - vs; }
    o.a = ease(cl(frente - ts)) * (0.13 + 0.09 * Math.sin(tm * 0.003));
    o.c = C_LUZ; o.g = 740 + q5.k; o.r = 0.7;
  }

  /* 5 · MEDIMOS — la cadena: entra algo, se procesa, se DECIDE por dónde
     sigue, se dispara la acción y el resultado vuelve. El nodo activo se
     enciende al paso del trabajo, así que se ve que una cosa dispara la
     siguiente. Y lo que circula se puede contar. */
  function F5(i, u, g, G, o, tm, ins) {
    var gr = GR.cadena, ar = (MARCO[g].h * H) / (MARCO[g].w * W);
    /* EL PROCESO CORRE DE VERDAD. El ciclo avanza con el reloj Y con el
       scroll, así que durante el reposo del capítulo se ven varias vueltas
       completas: entra algo, se procesa, se DECIDE por dónde sigue, se
       dispara la acción y el resultado vuelve. No es una figura que
       represente un proceso: es un proceso ocurriendo. */
    var mont = ease(cl(ins / 0.22));
    var corre = ease(cl((ins - 0.18) / 0.20));
    var ciclo = ((tm * 0.00017) + ins * 2.4) % 1;
    if (u < 0.34) {                                          // las etapas
      var q = tramo(u, 0, 0.34, gr.n.length), nodo = gr.n[q.k];
      var mio = corre * cl(1 - Math.abs(ciclo * 5 - nodo.k) * 1.5);
      var vis = ease(cl((mont * 6.4 - nodo.k) / 1.2));
      ponNodo(o, nodo.x, nodo.y, q.j, 0.034 + 0.012 * mio, ar);
      o.a = (0.28 + 0.72 * mio) * vis;
      o.c = mio > 0.5 ? C_LUZ : (nodo.k === 2 ? C_DEC : C_DATO);
      o.g = 500 + q.k;
      return;
    }
    if (u < 0.64) {                                          // los enlaces
      var q2 = tramo(u, 0.34, 0.64, gr.e.length);
      ponArista(o, gr.e[q2.k], q2.j);
      o.a = 0.30 * mont; o.c = C_MASA; o.g = 540 + q2.k;
      return;
    }
    if (u < 0.88) {
    /* Lo que circula. En la bifurcación toma una rama u otra: eso es decidir. */
    var q3 = tramo(u, 0.64, 0.88, 2);
    var ruta = q3.k ? [gr.e[0], gr.e[1], gr.e[3], gr.e[5]]
                    : [gr.e[0], gr.e[1], gr.e[2], gr.e[4]];
    var t2 = (ciclo + q3.j * 0.7 + q3.k * 0.13) % 1;
    var seg = Math.min(3, (t2 * 4) | 0), f2 = t2 * 4 - seg;
    ponArista(o, ruta[seg], f2);
    o.a = corre * (0.24 + 0.76 * Math.sin(t2 * 3.1416));
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
    /* Sube con las vueltas del proceso, no con un reloj aparte: cada ciclo
       completo deja su marca, y al final del capítulo se ha visto llenarse. */
    var lleno = corre * ins * 9.6;
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
    var gr = GR.cap, ar = (MARCO[g].h * H) / (MARCO[g].w * W);
    var HUECO = 8;                                   // el sitio que falta
    var llega = ease(cl((ins - 0.52) / 0.30));        // la pieza que llega
    var hueco = gr.n[HUECO];

    if (u < 0.44) {                                  // los módulos que ya están
      var q = tramo(u, 0, 0.44, HUECO);
      var nodo = gr.n[q.k];
      var sale = ease(cl((ins - 0.02 - q.k * 0.036) / 0.16));
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
      var une = toca ? llega : ease(cl((ins - 0.06 - kmax * 0.030) / 0.16));
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
    var gr = GR.escala, ar = (MARCO[g].h * H) / (MARCO[g].w * W);
    /* Primero el sistema trabajando abajo; DESPUÉS desciende el plano que
       lo vigila. Si aparecen a la vez no se entiende que uno observa al otro. */
    var abajo = ease(cl(ins / 0.26));
    var capa = ease(cl((ins - 0.30) / 0.34));
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
      o.a = 0.42 * abajo; o.c = C_DATO; o.g = 850 + q3.k;
      return;
    }
    if (u < 0.86) {
      var q4 = tramo(u, 0.56, 0.86, gr.e.length), E = gr.e[q4.k];
      o.nx = E.a.x + (E.b.x - E.a.x) * q4.j;
      o.ny = (E.a.y + (E.b.y - E.a.y) * q4.j) * esc + sub;
      o.a = 0.26 * abajo; o.c = C_MASA; o.g = 880 + q4.k;
      return;
    }
    var q5 = tramo(u, 0.86, 1.0, gr.e.length), E2 = gr.e[q5.k];
    var t = ((tm * 0.00034) + sd(q5.k, 71) + q5.j) % 1;
    o.nx = E2.a.x + (E2.b.x - E2.a.x) * t;
    o.ny = (E2.a.y + (E2.b.y - E2.a.y) * t) * esc + sub;
    o.a = abajo * (0.20 + 0.66 * Math.sin(t * 3.1416));
    o.c = C_FLUJO; o.g = -1;
  }

  /* 8 · RESULTADOS — la convergencia. Un núcleo, dos anillos de módulos y
     todo enlazado con todo, con el trabajo circulando hacia el centro. No es
     una figura: es el mismo sistema de antes, completo y visible de un
     vistazo. Y rodea al lector, que queda dentro de él. */
  function F8(i, u, g, G, o, tm, ins) {
    var gr = GR.conv, ar = (MARCO[g].h * H) / (MARCO[g].w * W);
    /* EL CIERRE, EN CUATRO ACTOS. Los anillos entran girando y se cierran,
       la red se cose de dentro afuera, el trabajo converge hacia el centro y
       al final todo el sistema late A LA VEZ: deja de ser un conjunto de
       piezas y pasa a ser un cuerpo. Es el último pico del recorrido y el
       único que rodea al lector en vez de ponerse a un lado. */
    var cierra = ease(cl(ins / 0.30));
    var enlaza = ease(cl((ins - 0.24) / 0.28));
    var fluye  = ease(cl((ins - 0.50) / 0.28));
    var pleno  = ease(cl((ins - 0.80) / 0.20));

    if (u < 0.26) {
      var q = tramo(u, 0, 0.26, gr.n.length), nodo = gr.n[q.k];
      var t3 = nodo.k === 1 ? 0.026 : 0.020;
      var gir = (1 - cierra) * 0.85;
      var cg = Math.cos(gir), sg = Math.sin(gir);
      var cx = 0.5 + (nodo.x - 0.5) * cg - (nodo.y - 0.5) * sg;
      var cy = 0.5 + (nodo.x - 0.5) * sg + (nodo.y - 0.5) * cg;
      ponNodo(o, cx, cy, q.j, t3, ar);
      var lat = 0.5 + 0.5 * Math.sin(tm * 0.0009 + q.k * 0.7);
      var uni = 0.5 + 0.5 * Math.sin(tm * 0.0011);
      o.a = cierra * (0.40 + 0.34 * lerp(lat, uni, pleno) + 0.24 * pleno);
      o.c = nodo.k === 1 ? C_FLUJO : C_DATO;
      o.g = cierra > 0.2 ? 900 + q.k : -1;
      return;
    }
    if (u < 0.72) {
      var q2 = tramo(u, 0.26, 0.72, gr.e.length), E3 = gr.e[q2.k];
      var orden = (E3.i0 > E3.i1 ? E3.i0 : E3.i1) / gr.n.length;
      var ap = cl((enlaza * 1.5 - orden) / 0.5);
      ponArista(o, E3, q2.j * ap);
      o.a = q2.j <= ap ? 0.36 : 0;
      o.c = C_MASA; o.g = q2.j <= ap ? 940 + q2.k : -1;
      return;
    }
    var q3 = tramo(u, 0.72, 1.0, gr.e.length), E2 = gr.e[q3.k];
    var t = ((tm * 0.00030) + sd(q3.k, 81) + q3.j) % 1;
    var dentro = E2.b.k < E2.a.k;
    ponArista(o, E2, dentro ? t : 1 - t);
    o.a = fluye * (0.20 + 0.72 * Math.sin(t * 3.1416)) * (1 + 0.40 * pleno);
    /* Lo que va hacia dentro llega blanco: es el resultado reuniéndose. */
    o.c = dentro ? C_LUZ : C_FLUJO; o.g = -1;
  }

  var FORM = [F0, F1, F7, F_LUPA, F_MENTE, F_SISTEMA, F_CURVA, F6, F5, F8];

  /* --------------------------------------------------- ESTADOS Y SCROLL */
  var STOPS = [], MIR = [];
  var NST = FORM.length;
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
    /* El ultimo estado no se normaliza a 1 a proposito: por debajo de su
       seccion queda el pie, y ese tramo es el reposo del cierre. Sin el, la
       convergencia final llegaba y se acababa la pagina en el mismo gesto. */
    for (var k = 0; k < STOPS.length; k++) if (STOPS[k] > 1) STOPS[k] = 1;
  }
  /* ===================== LA DRAMATURGIA DEL SCROLL =====================

     ESTE ERA EL PROBLEMA DE FONDO DE LA PORTADA, y no era de dibujo.

     El motor mezclaba dos estados con un peso que iba de 0 a 1 LINEALMENTE a
     lo largo de todo el tramo entre dos secciones. Dicho de otra manera: la
     transformacion ocupaba el 100% del recorrido y no existia un solo
     instante en el que una estructura estuviera quieta, salvo el punto
     matematico en el que se cruzaba su seccion. Por eso, por bien dibujada
     que estuviera cada figura, la sensacion era «aparece, empieza a
     entenderse y ya esta cambiando»: literalmente nunca dejaba de cambiar.

     Ahora cada tramo se parte en dos:

       REPOSO      el estado se sostiene. La mezcla no se mueve (tw = 0) y lo
                   que avanza es el GUION INTERNO del estado: una fase de 0 a
                   1 que cada formacion usa para contar algo en cuatro actos
                   —aparece, funciona, culmina, se sostiene—.
       TRANSFORMA  solo el ultimo tercio. Ahi si se pasa a la siguiente.

     Con REPOSO al 68% y capitulos de mas de una pantalla de alto, cada
     estado tiene cientos de pixeles de scroll en los que esta quieto y
     PASANDO COSAS, y la transformacion llega cuando el concepto ya se ha
     entendido. El scroll deja de cambiar de figura y pasa a conducir una
     narracion. */
  var REPOSO = 0.68;
  var wA = 0, wB = 0, iA = 0, iB = 0, tw = 0, FASE = 0;
  function weights(P) {
    var i = 0;
    while (i < NST - 1 && P > STOPS[i + 1]) i++;
    if (i >= NST - 1) {                       // el cierre: solo reposo
      iA = iB = NST - 1; tw = 0; wA = 1; wB = 0;
      FASE = cl((P - STOPS[NST - 1]) / Math.max(0.0001, 1 - STOPS[NST - 1]));
      return;
    }
    var t = cl((P - STOPS[i]) / Math.max(0.0001, STOPS[i + 1] - STOPS[i]));
    iA = i; iB = i + 1;
    FASE = cl(t / REPOSO);                    // guion del estado que se sostiene
    tw   = cl((t - REPOSO) / (1 - REPOSO));   // y solo despues, la transformacion
    var e = ease(tw); wA = 1 - e; wB = e;
  }
  /* El estado que sale va por su guion; el que entra empieza el suyo de cero
     en cuanto termina de formarse. */
  function inside(n) { return n === iA ? FASE : 0; }

  var mx = 0, my = 0, cmx = 0, cmy = 0;
  /* El puntero en píxeles de ventana. -9 quiere decir que no hay. */
  var ptx = -9, pty = -9, toque = -1e9;
  if (!coarse && !reduced) {
    window.addEventListener('mousemove', function (e) {
      mx = (e.clientX / window.innerWidth - 0.5);
      my = (e.clientY / window.innerHeight - 0.5);
      ptx = e.clientX; pty = e.clientY;
    }, { passive: true });
    /* Si el ratón se va de la ventana, la figura no se queda congelada
       mirando a la esquina por la que salió: vuelve a buscar sola. */
    document.addEventListener('mouseleave', function () { ptx = -9; pty = -9; }, { passive: true });
  }
  /* EL EQUIVALENTE TÁCTIL. En un teléfono la figura se mueve sola, y si
     tocas la pantalla el foco se va a donde has tocado durante unos segundos
     y vuelve después. Es el mismo gesto —señalar— con el dedo. */
  if (!reduced) {
    window.addEventListener('touchstart', function (e) {
      var to = e.touches && e.touches[0];
      if (!to) return;
      ptx = to.clientX; pty = to.clientY; toque = performance.now();
    }, { passive: true });
  }

  /* EL PUNTERO, LLEVADO AL SISTEMA DE COORDENADAS DE LA FIGURA.

     Se calcula UNA VEZ POR FOTOGRAMA, no una vez por partícula, y deshace
     exactamente la misma proyección que aplica marco(): encuadre, lado y
     volteo. Por eso una formación puede comparar MFX con su propio `o.nx`
     sin saber nada de ventanas ni de píxeles.

     Sin puntero —teléfono, ratón fuera, movimiento reducido— recorre una
     trayectoria de Lissajous lenta: dos senos de periodo distinto que no se
     repiten a ojo, así que la figura sigue enseñando lo que hace. */
  function punteroEnMarco(fr, mir, vol, tm) {
    var ox, oy;
    var hayDedo = coarse && (tm - toque) < 2800;
    if ((ptx < -1 || coarse) && !hayDedo) {
      ox = 0.5 + 0.30 * Math.sin(tm * 0.00021);
      oy = 0.5 + 0.24 * Math.sin(tm * 0.00034 + 1.1);
    } else {
      var cx = mir ? 1 - fr.x : fr.x;
      ox = (ptx / W - cx) / fr.w + 0.5;
      if (mir && vol) ox = 1 - ox;
      oy = (pty / H - fr.y) / fr.h + 0.5;
      if (ox < -0.6) ox = -0.6; else if (ox > 1.6) ox = 1.6;
      if (oy < -0.6) oy = -0.6; else if (oy > 1.6) oy = 1.6;
    }
    MFX += (ox - MFX) * 0.11;
    MFY += (oy - MFY) * 0.11;
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
  /* Cada formación puede pedir un TAMAÑO además de una posición. Sin esto,
     una cinta sólida exigía muchísimas partículas —una hebra de cuentas
     separadas por hueco— y con 1.060 en total no salían las cuentas. Con un
     multiplicador de radio, tres hebras de destellos grandes se funden en una
     banda maciza y el polvo de fondo sigue siendo polvo. */
  var oa = { nx: 0, ny: 0, a: 1, g: -1, c: 6, r: 1 },
      ob = { nx: 0, ny: 0, a: 1, g: -1, c: 6, r: 1 };
  /* Estaban fijos en 1.500 y N vale 1.560 en escritorio: las sesenta ultimas
     particulas escribian fuera del array —en silencio, que es lo que hace un
     TypedArray— y al leerlas devolvian undefined. Ahora se dimensionan con N.
     Y `pa` se ha ido: se escribia cada fotograma y no lo leia nadie.
     SEG son las cubetas del enlace, una por color (ver mas abajo). */
  var px, py, pg, pc, SEG = [], SEGN = new Int32Array(8);
  function buffers(n) {
    px = new Float32Array(n); py = new Float32Array(n);
    pg = new Int32Array(n);   pc = new Int32Array(n);
    SEG = [];
    for (var c = 0; c < COL.length; c++) SEG.push(new Float32Array(n * 4));
    SEGN = new Int32Array(COL.length);
  }

  /* Al reflejar hay que mover TAMBIÉN el marco al lado libre: invertir solo
     el contenido dejaba la formación encima de la columna de texto. */
  /* Hay formaciones con DIRECCIÓN —la cadena entra por un lado y sale por el
     otro— y reflejarlas invierte el sentido de lectura: el proceso pasa a
     correr de derecha a izquierda y deja de leerse como un proceso. En esas,
     el encuadre se mueve al lado libre pero el contenido no se voltea. */
  /* Hay figuras con DIRECCIÓN: la cadena entra por un lado y sale por el
     otro, y la gráfica sube de izquierda a derecha. Reflejarlas invierte el
     sentido de lectura. En esas el encuadre se mueve al lado libre pero el
     contenido no se voltea. */
  var VOLTEA = [1, 1, 1, 1, 1, 1, 0, 1, 0, 1];
  function marco(o, fr, mir, out, vol) {
    var cx = mir ? 1 - fr.x : fr.x;
    var nx = (mir && vol) ? 1 - o.nx : o.nx;
    out.x = W * (cx + (nx - 0.5) * fr.w);
    out.y = H * (fr.y + (o.ny - 0.5) * fr.h);
  }
  var ma = { x: 0, y: 0 }, mb = { x: 0, y: 0 };

  /* El anillo de cajas sucias: 40 fotogramas de historia. SUCIO_TODO fuerza un
     borrado completo cuando el lienzo puede tener tinta en cualquier sitio —al
     arrancar y despues de cada cambio de tamano—. */
  var SUC_N = 40, SUC = new Float32Array(SUC_N * 4), SUC_P = 0, SUCIO_TODO = true, SUC_LLENO = 0, SUC_T = 0;
  function sucioReset() { SUC.fill(0); SUC_P = 0; SUCIO_TODO = true; SUC_LLENO = 0; SUC_T = 0; }

  var VEL = 0;
  function draw(tm, noClear) {
    weights(reduced ? P : Pv);
    /* Con capítulos de más de una pantalla la portada es ahora mucho más
       larga, y un barrido rápido mueve la materia muchísimo más por
       fotograma. La floración —que dibuja un halo de tres radios sobre cada
       partícula encendida— se convertía entonces en el coste dominante y
       además emborronaba justo cuando no hay nada que contemplar. Se apaga
       con la velocidad de scroll: cuando estás mirando, está; cuando pasas
       de largo, sobra. */
    VEL += (Math.abs(P - Pv) - VEL) * 0.20;
    var flor = 1 - cl(VEL * 30);
    cmx += (mx - cmx) * 0.045; cmy += (my - cmy) * 0.045;

    /* ================= BORRADO POR REGION SUCIA =========================
       Medido: el borrado a pantalla completa era el 86% de todo el area que
       se pinta en un fotograma de la portada (630.720 px de 730.698 a 1440,
       y eso a dpr 1; a 1,75 son 1,9 millones). Los destellos, todos juntos,
       eran el 8%.

       Pero la tinta solo existe donde se ha dibujado. Fuera de ahi el lienzo
       ya converge al fondo y volver a pintarlo encima no cambia un solo bit.
       Asi que se lleva la cuenta de la caja que ocupa lo dibujado y se borra
       la union de las ultimas 40 —el rastro se apaga con factor 0,70 a 0,83
       por fotograma, y 0,83^40 = 0,0006, muy por debajo de 1/255—.

       No es una aproximacion visible: es no repintar lo que ya es fondo. Si
       la union cubre casi todo, se borra entero y se ahorra la contabilidad. */
    ctx.globalCompositeOperation = 'source-over';
    var trans = Math.sin(tw * 3.1416);
    ctx.fillStyle = noClear ? 'rgba(5,7,14,0.10)'
                            : 'rgba(5,7,14,' + (0.30 - 0.13 * trans).toFixed(3) + ')';
    /* Seguro barato: un borrado completo cada 2 segundos. El fundido a
       rgba(5,7,14,a) sobre un lienzo de 8 bits se ESTANCA —un pixel a 15 con
       fondo 14 y alfa 0,17 baja 0,17, que redondea a cero y ya no se mueve—,
       asi que fuera de la region viva puede quedar un residuo de unas pocas
       unidades sobre el fondo. Invisible, pero se limpia igual: 1 fotograma
       de cada 120 vuelve a costar lo de antes, un 0,8%. */
    if (++SUC_T >= 120) { SUC_T = 0; ctx.fillRect(0, 0, W, H); }
    else if (noClear || SUCIO_TODO) {
      ctx.fillRect(0, 0, W, H);
    } else {
      var ux0 = 1e9, uy0 = 1e9, ux1 = -1e9, uy1 = -1e9;
      for (var rb = 0; rb < SUC_N; rb++) {
        var o4 = rb * 4;
        if (SUC[o4 + 2] <= SUC[o4]) continue;              // caja vacia
        if (SUC[o4]     < ux0) ux0 = SUC[o4];
        if (SUC[o4 + 1] < uy0) uy0 = SUC[o4 + 1];
        if (SUC[o4 + 2] > ux1) ux1 = SUC[o4 + 2];
        if (SUC[o4 + 3] > uy1) uy1 = SUC[o4 + 3];
      }
      if (ux1 <= ux0) { ux0 = 0; uy0 = 0; ux1 = W; uy1 = H; }
      ux0 = ux0 < 0 ? 0 : ux0; uy0 = uy0 < 0 ? 0 : uy0;
      ux1 = ux1 > W ? W : ux1; uy1 = uy1 > H ? H : uy1;
      if ((ux1 - ux0) * (uy1 - uy0) > W * H * 0.88) ctx.fillRect(0, 0, W, H);
      else {
        /* El rectangulo se pinta en pixeles de dispositivo ENTEROS. Con
           coordenadas fraccionarias el navegador suaviza los cuatro bordes y
           el borde recibe una cobertura parcial: un borrado ligeramente mas
           flojo justo en esa linea. Se veia —1.262 px con delta de hasta 9
           frente al borrado completo— y desaparece al cuadrar la caja. */
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        var qx = Math.floor(ux0 * dpr), qy = Math.floor(uy0 * dpr);
        ctx.fillRect(qx, qy, Math.ceil(ux1 * dpr) - qx, Math.ceil(uy1 * dpr) - qy);
        ctx.restore();
      }
    }
    /* La caja de este fotograma se va llenando mientras se dibuja. */
    var bx0 = 1e9, by0 = 1e9, bx1 = -1e9, by1 = -1e9;

    var FA = FORM[iA], FB = FORM[iB];
    var frA = MARCO[iA], frB = MARCO[iB];
    var insA = inside(iA), insB = inside(iB);
    var usoA = USO[iA], usoB = USO[iB];
    /* Todo esto era una busqueda en array o una division POR PARTICULA y no
       cambia dentro del fotograma. Sacarlo del bucle quita unas nueve mil
       operaciones por fotograma sin tocar un solo pixel. */
    /* Con tw exactamente en 0 o en 1, uno de los dos lados de la mezcla no
       aporta nada y no hace falta calcularlo. */
    var soloA = (tw <= 0), soloB = (tw >= 1);
    var invN = 1 / N, invA = 1 / usoA, invB = 1 / usoB;
    var intA = INT[iA], intB = INT[iB], depA = frA.d, depB = frB.d;
    var mirA = MIR[iA], mirB = MIR[iB], volA = VOLTEA[iA], volB = VOLTEA[iB];
    /* EL PUNTERO SE TRADUCE CON EL ENCUADRE DE LA FIGURA QUE SE ESTÁ VIENDO,
       que no siempre es la A. En el centro de cada sección la mezcla ya está
       entera en la B —ahí es donde el capítulo se sostiene— y usar el marco
       de la A ponía el puntero en las coordenadas del capítulo anterior: la
       lupa seguía al ratón en horizontal y se iba al fondo en vertical,
       porque el marco de Finance es una banda de arriba y el suyo no. */
    var dom = tw >= 0.5 ? iB : iA;
    punteroEnMarco(MARCO[dom], MIR[dom], VOLTEA[dom], tm);
    var par = narrow ? 0 : 1;

    /* La luz que recorre el campo y roza lo que tiene delante. */
    var lz = (tm * 0.00007) % 1.6 - 0.3;
    var lx = W * lz, ly = H * (0.42 + 0.16 * Math.sin(tm * 0.00019));
    var lr = Math.max(W, H) * 0.30, lr2 = lr * lr;

    ctx.globalCompositeOperation = 'lighter';

    for (var q = 0; q < N; q++) {
      var i = ORD[q];                       // de lejos a cerca
      var p = PT[i];
      var frac = i * invN;
      var enA = frac < usoA, enB = frac < usoB;
      /* Se reescala, no se recorta: la formación recorre su rango entero. */
      var ua = enA ? (frac * invA) : 0, ub = enB ? (frac * invB) : 0;
      if (ua > 0.99999) ua = 0.99999;
      if (ub > 0.99999) ub = 0.99999;

      /* SOLO SE CALCULA LA FORMACION QUE SE VE.

         El bucle resolvia SIEMPRE las dos formaciones —la que sale y la que
         entra— y despues las mezclaba. Pero durante el REPOSO de cada
         capitulo `tw` vale 0: la mezcla devuelve exactamente la formacion A y
         todo el trabajo de la B se tira. Y el reposo es el 68% del recorrido
         de cada tramo, ademas del estado normal del hero, que es donde mas
         cuesta el fotograma.

         Con `tw` en 0 se salta la B; con `tw` en 1, la A. No es una
         aproximacion: es el mismo resultado, porque la interpolacion con
         t = 0 (o 1) descarta el otro lado entero. */
      if (enA && !soloB) { oa.a = 1; oa.g = -1; oa.c = C_BRUMA; oa.r = 1; FA(i, ua, iA, 0, oa, tm, insA); }
      /* Las que no participan en este capítulo quedan por debajo del umbral
         de descarte: así no cuestan una llamada de dibujo cada fotograma. Es
         lo que permite que la marca del hero tenga 1.560 partículas sin que
         los otros ocho capítulos paguen por ellas. */
      else if (!soloB) { oa.nx = p.hx; oa.ny = p.hy; oa.a = 0.02; oa.g = -1; oa.c = C_MASA; oa.r = 1; }
      if (enB && !soloA) { ob.a = 1; ob.g = -1; ob.c = C_BRUMA; ob.r = 1; FB(i, ub, iB, 0, ob, tm, insB); }
      else if (!soloA) { ob.nx = p.hx; ob.ny = p.hy; ob.a = 0.02; ob.g = -1; ob.c = C_MASA; ob.r = 1; }

      if (!soloB) marco(oa, frA, mirA, ma, volA);
      if (!soloA) marco(ob, frB, mirB, mb, volB);
      if (soloA) { mb.x = ma.x; mb.y = ma.y; ob.a = oa.a; ob.c = oa.c; ob.g = oa.g; ob.r = oa.r; }
      if (soloB) { ma.x = mb.x; ma.y = mb.y; oa.a = ob.a; oa.c = ob.c; oa.g = ob.g; oa.r = ob.r; }

      /* Cada partícula sale hacia la formación siguiente en su instante. */
      var t = cl((tw - p.dl) / (1 - p.dl)); t = t * t * (3 - 2 * t);
      var tx = lerp(ma.x, mb.x, t), ty = lerp(ma.y, mb.y, t);
      var al = lerp(oa.a, ob.a, t) * lerp(intA, intB, t);
      var dep = lerp(depA, depB, t);

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

      px[i] = dx; py[i] = dy;
      /* La caja tiene que cubrir TAMBIEN a las particulas descartadas por
         alfa: no se dibujan, pero SI se enlazan —el trazo une consecutivas del
         mismo grupo sin mirar su brillo— y ese trazo dejaba tinta fuera de la
         region que se borra. Fue justo la fuga que aparecio al comparar con
         reloj determinista: hasta 742 de delta en /portada a mitad de
         recorrido. */
      if (dx - 2 < bx0) bx0 = dx - 2;
      if (dy - 2 < by0) by0 = dy - 2;
      if (dx + 2 > bx1) bx1 = dx + 2;
      if (dy + 2 > by1) by1 = dy + 2;
      /* El cableado cambia de bando A LA VEZ para todas las partículas, no
         partícula a partícula: si no, la estructura se deshilacha en vez de
         transformarse. */
      pg[i] = (tw < 0.5) ? oa.g : ob.g;
      pc[i] = (t < 0.5) ? oa.c : ob.c;

      /* La luz roza: no ilumina todo por igual. */
      var ldx = dx - lx, ldy = dy - ly;
      var lq = (ldx * ldx + ldy * ldy) / lr2;
      var luz = 0.42 / (1 + lq * lq);

      /* EL ESTIRADO POR VELOCIDAD, CONTENIDO. Medido: en los capítulos con
         tráfico la portada dibujaba un megapíxel de relleno aditivo por
         fotograma y caía a 32 fps ESTANDO QUIETA. La causa no era el scroll:
         era que las partículas que transportan datos no paran nunca, así que
         vivían permanentemente estiradas, y el radio entra al cuadrado en el
         área. Con el estirado a menos de la mitad y un tope duro de radio, la
         estela se sigue viendo y el relleno baja a un tercio. */
      var v2 = p.vx * p.vx + p.vy * p.vy;
      var sp = v2 > 16 ? 0.40 : v2 * 0.025;
      var r = (0.98 + p.s * 2.15) * (0.55 + p.z * 1.10) * (1 + sp) * dep
            * lerp(oa.r, ob.r, t);
      if (r > 15) r = 15;
      /* Fuera del lienzo no se pinta nada, pero la llamada de dibujo se paga
         igual —y medido, el dibujo es el 54% del fotograma en la portada y el
         74% en los interiores, casi todo coste de llamada—. El halo llega a
         2,6 radios, asi que ese es el margen. Ni un pixel cambia. */
      var mrg = r * 2.6;
      if (dx < -mrg || dy < -mrg || dx > W + mrg || dy > H + mrg) continue;
      var a2 = (al + luz) * (0.40 + p.z * 0.72) * (0.68 + 0.32 * dep);
      /* Lo que está por debajo de este umbral no se distingue del fondo, y
         cada partícula cuesta una llamada de dibujo aunque no se vea. Subirlo
         retira varios cientos de llamadas por fotograma en los capítulos
         densos sin que se note una sola partícula de menos. */
      if (a2 <= 0.048) continue;
      var spr = SPR[p.e][(t < 0.5 ? oa.c : ob.c)];
      /* FLORACIÓN, SOLO EN EL ESTRATO CERCANO. Medido: quieto en mitad del
         recorrido la portada caía a 25 fps, y no era el scroll —era esto—.
         El halo se dibuja a casi tres radios, así que cada partícula
         florecida cuesta unas treinta veces su propia área; con la subida de
         intensidad de los capítulos, cientos de ellas cruzaban el umbral a
         la vez y el relleno se comía el fotograma.

         Limitarlo al estrato cercano no es un recorte, es lo correcto: lo
         que está lejos y desenfocado no tiene por qué tener un halo duro. Y
         se apaga con la velocidad de scroll, porque al pasar de largo solo
         emborrona. */
      if (p.e === 2 && a2 > 0.56 && flor > 0.06) {
        var rb = r * 2.6;
        ctx.globalAlpha = Math.min(0.26, (a2 - 0.56) * 0.60) * flor;
        ctx.drawImage(spr, dx - rb, dy - rb, rb * 2, rb * 2);
      }
      ctx.globalAlpha = Math.min(0.80, a2);
      ctx.drawImage(spr, dx - r, dy - r, r * 2, r * 2);
      /* Lo que se pinta, se apunta: es lo unico que habra que borrar. */
      var mrg2 = r * 2.7;
      if (dx - mrg2 < bx0) bx0 = dx - mrg2;
      if (dy - mrg2 < by0) by0 = dy - mrg2;
      if (dx + mrg2 > bx1) bx1 = dx + mrg2;
      if (dy + mrg2 > by1) by1 = dy + mrg2;
    }

    /* EL ENLACE, AHORA CON COLOR. Une partículas CONSECUTIVAS DEL MISMO
       GRUPO: la estructura la dibujan ellas, no una línea añadida por
       encima. Y hereda el color de la materia que une, así que un puente
       recién tendido es cian, una capa de arquitectura es azul y un cabo
       suelto es magenta — sin necesidad de una sola leyenda.

       Se pinta en pasadas, una por color. Son ocho recorridos triviales del
       array: cuesta menos que el resto del fotograma y es lo que separa una
       maraña gris de una infraestructura legible. */
    /* UNA SOLA PASADA, NO OCHO. Antes se recorria el array entero una vez por
       color para quedarse con los segmentos de ese color: ocho recorridos de
       1.560 = doce mil quinientas iteraciones por fotograma para dibujar unos
       mil quinientos segmentos. Ahora se recorre UNA vez y cada segmento cae
       en la cubeta de su color; despues se pinta cubeta a cubeta, en el mismo
       orden y con el mismo trazo. El dibujo resultante es identico. */
    ctx.globalAlpha = 1; ctx.lineWidth = 1;
    var afl = 0.5 - 0.42 * Math.abs(tw - 0.5) * 2;
    var NC = COL.length, c2;
    for (c2 = 0; c2 < NC; c2++) SEGN[c2] = 0;
    for (var k2 = 1; k2 < N; k2++) {
      var gk = pg[k2];
      if (gk < 0 || gk !== pg[k2 - 1]) continue;
      var ddx = px[k2] - px[k2 - 1], ddy = py[k2] - py[k2 - 1];
      if (ddx * ddx + ddy * ddy > 30000) continue;
      var cc = pc[k2] === C_MASA ? C_BRUMA : pc[k2];   // la bruma, una sola cubeta
      var sg2 = SEG[cc], n2 = SEGN[cc];
      sg2[n2] = px[k2 - 1]; sg2[n2 + 1] = py[k2 - 1];
      sg2[n2 + 2] = px[k2];  sg2[n2 + 3] = py[k2];
      SEGN[cc] = n2 + 4;
    }
    for (c2 = 0; c2 < NC; c2++) {
      var tot = SEGN[c2];
      if (!tot) continue;
      var sgc = SEG[c2];
      ctx.beginPath();
      for (var m2 = 0; m2 < tot; m2 += 4) {
        ctx.moveTo(sgc[m2], sgc[m2 + 1]); ctx.lineTo(sgc[m2 + 2], sgc[m2 + 3]);
      }
      /* La bruma sostiene, no habla: se pinta bastante más baja que un
         enlace con significado. */
      var op = c2 === C_BRUMA ? 0.085 : 0.20;
      ctx.strokeStyle = rgba(COL[c2], op + 0.10 * afl);
      ctx.stroke();
    }

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    /* Los enlaces se dibujan entre particulas ya contabilizadas, asi que
       caben dentro de la misma caja. Se guarda en el anillo. */
    if (!noClear) {
      var o5 = SUC_P * 4;
      if (bx1 > bx0) { SUC[o5] = bx0; SUC[o5 + 1] = by0; SUC[o5 + 2] = bx1; SUC[o5 + 3] = by1; }
      else           { SUC[o5] = 0; SUC[o5 + 1] = 0; SUC[o5 + 2] = 0; SUC[o5 + 3] = 0; }
      SUC_P = (SUC_P + 1) % SUC_N;
      /* Hasta que el anillo no tiene historia completa se sigue borrando
         entero: si no, quedaria tinta vieja fuera de la union. */
      if (SUC_LLENO < SUC_N) { SUC_LLENO++; if (SUC_LLENO >= SUC_N) SUCIO_TODO = false; }
    }
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
  window.addEventListener('load', function () { encuadreMarca(); measureStops(); readScroll(); });
  /* El corredor se mide sobre el texto PINTADO, asi que hasta que la fuente
     real no esta cargada el borde del titular es el de la fuente de reserva
     y la marca quedaria colocada sobre una medida que ya no es la buena. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { encuadreMarca(); if (reduced) drawStill(); });
  }
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
