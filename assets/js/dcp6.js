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
  /* Lienzo TRANSPARENTE: el campo se compone sobre el cielo sin mezcla
     (mix-blend-mode sobre un cielo animado costaba medio fotograma). El
     rastro se apaga con destination-out en vez de pintar fondo oscuro. */
  var ctx = canvas.getContext('2d');

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
      MARCO[mi].y = MARCO_ANCHO[mi].y;
    }
    /* LA GRÁFICA EN UN TELÉFONO VA DEBAJO DEL TEXTO, NO DETRÁS. Con barras
       sólidas, en 3D, detrás de un párrafo, el párrafo se lee peor y la
       gráfica tampoco se ve: medido a 390, la columna de texto anclada acaba
       hacia el 60 % de la pantalla, y de ahí para abajo está libre. */
    if (narrow) { MARCO[S_CURVA].y = 0.80; MARCO[S_CURVA].h = 0.34; }
    encuadreMarca();
    sucioReset();                      // el lienzo cambia de tamano: se borra entero
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    build();
  }

  function build() {
    N = small ? 660 : narrow ? 1180 : 2100;
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
        dl: (i / N) * 0.52,
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
  /* 21-09-2026 · La portada se reordena: después del hero van «Qué hacemos»
     (el esquema del sistema), el diagnóstico y la galería de sistemas. Los
     tres derivan, porque encima hay una interfaz de verdad y el campo no debe
     competir con ella. El tótem de las ocho capacidades se va con el
     catálogo de departamentos que ilustraba. */
  var S_MARCA = 0, S_QUE = 1, S_DIAG = 2, S_SISTEMAS = 3, S_LUPA = 4, S_MENTE = 5,
      S_SISTEMA = 6, S_CURVA = 7, S_CONFIANZA = 8, S_CIERRE = 9;
  var MARCO = [
    /* El hero: el marco ES la caja de la identidad —banda derecha, 34% de
       ancho y 56% de alto— para que la marca entera y su anillo queden
       DENTRO de la ventana y a la derecha del titular. */
    { x: 0.848, y: 0.50,  w: 0.34, h: 0.56, d: 1.06 },  // 0 MARCA      el hero
    /* Los dos capítulos anteriores al proceso no dibujan: derivan. Su
       encuadre es la ventana entera porque la deriva no es una figura
       dentro de un marco, es materia por toda la pantalla. */
    { x: 0.500, y: 0.50,  w: 1.00, h: 1.00, d: 0.88 },  // 1 DERIVA     qué hacemos
    { x: 0.500, y: 0.50,  w: 1.00, h: 1.00, d: 0.85 },  // 2 DERIVA     el diagnóstico
    { x: 0.500, y: 0.50,  w: 1.00, h: 1.00, d: 0.82 },  // 3 DERIVA     los sistemas
    { x: 0.722, y: 0.50,  w: 0.46, h: 0.80, d: 0.96 },  // 4 LUPA       analizamos
    { x: 0.700, y: 0.50,  w: 0.50, h: 0.88, d: 1.02 },  // 5 MENTE      diseñamos
    { x: 0.684, y: 0.50,  w: 0.56, h: 0.96, d: 1.06 },  // 6 SISTEMA    implantamos
    /* MEDIDO mirando la pantalla entera: la gráfica ocupaba media ventana de
       alto y se quedaba DEBAJO del texto de la sección siguiente mientras
       esta subía. Una gráfica a pantalla completa detrás de un titular y
       cuatro tarjetas no se lee como una gráfica: se lee como ruido de
       fondo. Compacta y arriba, se lee como lo que es. */
    { x: 0.718, y: 0.315, w: 0.44, h: 0.40, d: 0.96 },  // 7 CURVA      medimos
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
  var MARCO_ANCHO = MARCO.map(function (m) { return { x: m.x, y: m.y, w: m.w, h: m.h }; });

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
  /* El plano cabe algo más alto que la lupa; el acople es circular y su
     diámetro es «alto × altura de ventana», así que se queda corto para no
     salirse por los lados; la gráfica quiere ser más ancha que alta, que es
     como se lee una gráfica. */
  var ALTO_MOVIL = [0.62, 0, 0, 0, 0.84, 0.62, 0.58, 0.54, 0, 0];
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
  /* La deriva las usa TODAS: lo que se ve es la cantidad de materia, no una
     estructura, así que reservar un tercio no ahorraría nada visible y
     dejaría el campo medio vacío justo donde tiene que parecer lleno. */
  var USO = [1, 1, 1, 1, 0.72, 0.72, 0.80, 0.78, 0.68, 0.68];

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
  /* Los dos capítulos que derivan van MUY bajos: en el del problema manda el
     texto subrayado y en el de Finance manda la aplicación. Un campo
     brillante detrás de una pantalla blanca es ruido puro. */
  var INT = [1.00, 0.52, 0.40, 0.36, 0.88, 1.16, 1.10, 1.00, 0.78, 1.34];

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

    /* EL PLANO — lo que se dibuja cuando se diseña un sistema: las piezas,
       con su sitio y su tamaño, y por dónde va cada conexión. Las rutas son
       ortogonales a propósito: una línea recta entre dos cajas es un grafo;
       una línea que gira en ángulo recto es un plano. */
    var PLANO_M = [
      [0.06, 0.08, 0.25, 0.13], [0.38, 0.05, 0.21, 0.10], [0.68, 0.09, 0.25, 0.17],
      [0.07, 0.30, 0.20, 0.15], [0.36, 0.27, 0.30, 0.21], [0.74, 0.38, 0.19, 0.13],
      [0.12, 0.57, 0.23, 0.14], [0.46, 0.61, 0.28, 0.16], [0.80, 0.62, 0.14, 0.13]
    ];
    var PLANO_R = [[0,4],[1,4],[2,5],[3,4],[4,5],[4,7],[6,4],[6,7],[7,8],[5,8]];
    var mods = PLANO_M.map(function (m) {
      return { x: m[0], y: m[1], w: m[2], h: m[3], cx: m[0] + m[2] / 2, cy: m[1] + m[3] / 2 };
    });
    var rutas = PLANO_R.map(function (par) {
      var A = mods[par[0]], B = mods[par[1]];
      var mx = A.cx + (B.cx - A.cx) * 0.5;
      var pts = [[A.cx, A.cy], [mx, A.cy], [mx, B.cy], [B.cx, B.cy]];
      var tot = 0, segs = [];
      for (i = 1; i < pts.length; i++) {
        var d = Math.abs(pts[i][0] - pts[i-1][0]) + Math.abs(pts[i][1] - pts[i-1][1]);
        segs.push(d); tot += d;
      }
      return { p: pts, s: segs, L: tot || 1, a: par[0], b: par[1] };
    });
    GR.plano = { m: mods, r: rutas };

    /* EL ACOPLE — un núcleo que ya está, seis huecos alrededor y seis piezas
       que llegan de fuera y encajan. Implantar es esto: no aparece un sistema
       nuevo, se mete lo que falta en lo que ya hay. */
    var arA = (MARCO[S_SISTEMA].h * H) / (MARCO[S_SISTEMA].w * W);
    var acople = [];
    for (k = 0; k < 6; k++) {
      var an = (k / 6) * TAU - 1.5708;
      acople.push({
        an: an,
        x: 0.5 + Math.cos(an) * 0.335 * arA, y: 0.5 + Math.sin(an) * 0.335,
        fx: 0.5 + Math.cos(an) * 0.98 * arA, fy: 0.5 + Math.sin(an) * 0.98,
        bx: 0.5 + Math.cos(an) * 0.155 * arA, by: 0.5 + Math.sin(an) * 0.155,
        w: 0.105 * arA, h: 0.072
      });
    }
    GR.acople = { n: acople, ar: arA };

    /* 3 · RED — cuatro sistemas separados, cada uno con su vida interior.
       Es la figura del capítulo del problema: lo mismo, hecho varias veces y
       sin hablarse. */
    nodos = []; ar = [];
    var CENT = [[0.20, 0.24], [0.78, 0.20], [0.16, 0.78], [0.76, 0.76]];
    for (k = 0; k < 4; k++) {
      var g2 = [];
      for (i = 0; i < 5; i++) {
        /* Sin rotación por sistema: los cuatro son exactamente el mismo
           montaje. Es lo que dice el texto —lo mismo, hecho varias veces— y
           se ve antes de leerlo. */
        var an2 = (i / 5) * TAU;
        g2.push(nodos.length);
        nodos.push(nd(CENT[k][0] + Math.cos(an2) * 0.132, CENT[k][1] + Math.sin(an2) * 0.132, k));
      }
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


  /* ══════════════ LOS NUEVE OBJETOS ══════════════

     Contornos, en coordenadas 0..1 con la y hacia abajo. Cada entrada es una
     lista de TRAZOS y cada trazo una polilínea: la materia los recorre en
     orden y el enlace los cierra. Están dibujados con los trazos justos —los
     de una servilleta— porque un icono con detalle, hecho de partículas y a
     media pantalla, se convierte en una mancha.

     El reparto de partículas es proporcional a la longitud de cada trazo: si
     no, el trazo largo sale despoblado y el corto, apelmazado. */
  /* ══════════════ LAS NUEVE FIGURAS ══════════════
     La primera versión eran polilíneas de seis y siete puntos, y con seis
     puntos no sale un camión: sale un polígono. Aquí cada figura se declara
     con TRAZOS —rectas, arcos y curvas— y se muestrea a muchos puntos al
     cargar, una sola vez. Lo que dibuja la materia después es exactamente lo
     mismo que antes; lo que cambia es que ahora hay curva donde tiene que
     haberla, y por eso se reconoce lo que es. */
  function arco(cx, cy, rx, ry, a0, a1, n) {
    var p = [], N = n || 30;
    for (var i = 0; i <= N; i++) {
      var a = a0 + (a1 - a0) * (i / N);
      p.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
    }
    return p;
  }
  function curva(p0, p1, p2, p3, n) {
    var p = [], N = n || 22;
    for (var i = 0; i <= N; i++) {
      var t = i / N, u = 1 - t;
      p.push([u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0],
              u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1]]);
    }
    return p;
  }
  /* Une varios tramos en un trazo continuo, sin repetir el punto de unión. */
  function une() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) {
      var t = arguments[i];
      for (var j = (out.length ? 1 : 0); j < t.length; j++) out.push(t[j]);
    }
    return out;
  }
  function caja(x, y, w, h) {
    return [[x,y],[x+w,y],[x+w,y+h],[x,y+h],[x,y]];
  }
  function cajaRed(x, y, w, h, r) {
    return une(
      [[x+r,y]], [[x+r,y],[x+w-r,y]],
      arco(x+w-r, y+r, r, r, -Math.PI/2, 0, 8),
      [[x+w,y+r],[x+w,y+h-r]],
      arco(x+w-r, y+h-r, r, r, 0, Math.PI/2, 8),
      [[x+w-r,y+h],[x+r,y+h]],
      arco(x+r, y+h-r, r, r, Math.PI/2, Math.PI, 8),
      [[x,y+h-r],[x,y+r]],
      arco(x+r, y+r, r, r, Math.PI, Math.PI*1.5, 8)
    );
  }
  var TAU = Math.PI * 2;

  var OBJ = {
    /* VENTAS: tres barras que suben y una flecha que las remata. Lo que se
       reconoce de una venta no es un icono de dinero: es que sube. */
    ventas: { et: 'VENTAS', en: 'SALES', tr: [
      [[0.08,0.92],[0.94,0.92]],
      caja(0.14, 0.66, 0.15, 0.26),
      caja(0.36, 0.50, 0.15, 0.42),
      caja(0.58, 0.30, 0.15, 0.62),
      une([[0.14,0.58]], curva([0.14,0.58],[0.34,0.52],[0.48,0.34],[0.80,0.14])),
      [[0.80,0.14],[0.62,0.16]],
      [[0.80,0.14],[0.79,0.32]]
    ]},

    /* PRESUPUESTOS: una hoja con la esquina doblada, sus renglones y un
       importe subrayado abajo. La esquina doblada es lo que la hace papel. */
    presupuestos: { et: 'PRESUPUESTOS', en: 'QUOTES', tr: [
      [[0.24,0.06],[0.62,0.06],[0.78,0.22],[0.78,0.94],[0.24,0.94],[0.24,0.06]],
      [[0.62,0.06],[0.62,0.22],[0.78,0.22]],
      [[0.32,0.34],[0.68,0.34]],
      [[0.32,0.44],[0.68,0.44]],
      [[0.32,0.54],[0.56,0.54]],
      [[0.32,0.72],[0.68,0.72]],
      [[0.46,0.80],[0.68,0.80]],
      une(arco(0.385, 0.805, 0.055, 0.055, Math.PI*0.35, Math.PI*1.65, 16))
    ]},

    /* PROYECTOS: un tablero con tres carriles y sus tarjetas, que es como se
       ve un proyecto cuando alguien lo está llevando. */
    proyectos: { et: 'PROYECTOS', en: 'PROJECTS', tr: [
      cajaRed(0.06, 0.16, 0.88, 0.76, 0.05),
      [[0.06,0.30],[0.94,0.30]],
      [[0.35,0.30],[0.35,0.92]],
      [[0.65,0.30],[0.65,0.92]],
      cajaRed(0.11, 0.38, 0.19, 0.13, 0.03),
      cajaRed(0.11, 0.56, 0.19, 0.13, 0.03),
      cajaRed(0.40, 0.38, 0.19, 0.13, 0.03),
      cajaRed(0.69, 0.38, 0.19, 0.13, 0.03),
      cajaRed(0.69, 0.56, 0.19, 0.13, 0.03)
    ]},

    /* CLIENTES: dos personas, una delante y otra detrás. Con una sola
       cabeza y un arco no hay «clientes», hay «un usuario». */
    clientes: { et: 'CLIENTES', en: 'CLIENTS', tr: [
      arco(0.40, 0.30, 0.135, 0.135, 0, TAU, 34),
      une(arco(0.40, 0.86, 0.26, 0.30, Math.PI, TAU, 28)),
      arco(0.70, 0.26, 0.10, 0.10, -Math.PI*0.72, Math.PI*0.62, 24),
      une(arco(0.72, 0.86, 0.20, 0.26, Math.PI*1.08, Math.PI*1.94, 20))
    ]},

    /* TU EMPRESA: un edificio con sus ventanas y su puerta. */
    empresa: { et: 'TU EMPRESA', en: 'YOUR COMPANY', tr: [
      [[0.14,0.94],[0.14,0.30],[0.50,0.08],[0.86,0.30],[0.86,0.94],[0.14,0.94]],
      [[0.06,0.94],[0.94,0.94]],
      caja(0.25, 0.40, 0.13, 0.13),
      caja(0.62, 0.40, 0.13, 0.13),
      caja(0.25, 0.60, 0.13, 0.13),
      une([[0.44,0.94],[0.44,0.68]], arco(0.50, 0.68, 0.06, 0.06, Math.PI, TAU, 12), [[0.56,0.68],[0.56,0.94]])
    ]},

    /* PROVEEDORES: un camión de reparto. Caja, cabina, dos ruedas. */
    proveedores: { et: 'PROVEEDORES', en: 'SUPPLIERS', tr: [
      [[0.06,0.74],[0.06,0.30],[0.56,0.30],[0.56,0.74]],
      [[0.56,0.44],[0.74,0.44],[0.88,0.58],[0.88,0.74],[0.56,0.74]],
      [[0.04,0.74],[0.94,0.74]],
      arco(0.22, 0.80, 0.075, 0.075, 0, TAU, 20),
      arco(0.72, 0.80, 0.075, 0.075, 0, TAU, 20),
      [[0.16,0.44],[0.46,0.44]],
      [[0.16,0.56],[0.36,0.56]]
    ]},

    /* FACTURACIÓN: la hoja con su sello redondo y el importe. */
    facturacion: { et: 'FACTURACIÓN', en: 'INVOICING', tr: [
      [[0.20,0.06],[0.80,0.06],[0.80,0.86],[0.70,0.94],[0.60,0.86],[0.50,0.94],[0.40,0.86],[0.30,0.94],[0.20,0.86],[0.20,0.06]],
      [[0.30,0.24],[0.70,0.24]],
      [[0.30,0.36],[0.56,0.36]],
      [[0.30,0.62],[0.70,0.62]],
      arco(0.62, 0.48, 0.10, 0.10, 0, TAU, 24),
      une(arco(0.62, 0.48, 0.05, 0.055, Math.PI*0.30, Math.PI*1.70, 14)),
      [[0.555,0.455],[0.655,0.455]]
    ]},

    /* COBROS: un billete con su euro y una flecha que ENTRA. Lo que hay que
       leer aquí es la dirección del dinero. */
    cobros: { et: 'COBROS', en: 'COLLECTIONS', tr: [
      cajaRed(0.10, 0.34, 0.80, 0.40, 0.05),
      arco(0.50, 0.54, 0.105, 0.105, 0, TAU, 24),
      une(arco(0.50, 0.54, 0.05, 0.055, Math.PI*0.30, Math.PI*1.70, 14)),
      [[0.435,0.515],[0.535,0.515]],
      [[0.435,0.565],[0.525,0.565]],
      [[0.18,0.42],[0.24,0.42]],
      [[0.76,0.66],[0.82,0.66]],
      [[0.50,0.06],[0.50,0.26]],
      [[0.50,0.26],[0.43,0.18]],
      [[0.50,0.26],[0.57,0.18]]
    ]},

    /* AVISOS: una campana. Un triángulo con una admiración es una señal de
       tráfico; una campana es un aviso. */
    avisos: { et: 'AVISOS', en: 'ALERTS', tr: [
      une(
        [[0.24,0.70]],
        curva([0.24,0.70],[0.24,0.44],[0.30,0.22],[0.50,0.20]),
        curva([0.50,0.20],[0.70,0.22],[0.76,0.44],[0.76,0.70])
      ),
      [[0.16,0.70],[0.84,0.70]],
      [[0.50,0.20],[0.50,0.10]],
      arco(0.50, 0.085, 0.045, 0.045, 0, TAU, 14),
      une(arco(0.50, 0.70, 0.085, 0.10, 0, Math.PI, 16))
    ]}
  };

  var OBJ_ORDEN = ['ventas','presupuestos','proyectos','clientes','empresa','proveedores','facturacion','cobros','avisos'];

  /* Qué caja está elegida y desde cuándo. Se vuelve sola a los siete
     segundos: lo bastante para mirarla, no tanto como para que parezca que
     la figura se ha quedado colgada. */
  var SEL = { k: -1, t0: -1e9 };
  var SEL_MS = 7000;
  function selViva(tm) { return SEL.k >= 0 && (tm - SEL.t0) < SEL_MS; }

  /* La longitud de cada trazo, precalculada: hace falta para repartir la
     materia en proporción y se calcula una vez, no sesenta veces por segundo. */
  (function () {
    for (var k in OBJ) {
      var o = OBJ[k], L = [], tot = 0;
      for (var i = 0; i < o.tr.length; i++) {
        var p = o.tr[i], d = 0;
        for (var j = 1; j < p.length; j++) {
          d += Math.sqrt(Math.pow(p[j][0] - p[j-1][0], 2) + Math.pow(p[j][1] - p[j-1][1], 2));
        }
        L.push(d); tot += d;
      }
      o.L = L; o.tot = tot || 1;
    }
  })();

  /* Dibuja un objeto: recorre sus trazos repartiendo la materia por longitud
     y devuelve el punto en 0..1. `u` es la posición de la partícula en el
     recorrido completo. */
  function puntoObjeto(o, u) {
    var meta = u * o.tot, acc = 0;
    for (var i = 0; i < o.tr.length; i++) {
      if (acc + o.L[i] >= meta || i === o.tr.length - 1) {
        var d = meta - acc, p = o.tr[i], r = 0;
        for (var j = 1; j < p.length; j++) {
          var s = Math.sqrt(Math.pow(p[j][0] - p[j-1][0], 2) + Math.pow(p[j][1] - p[j-1][1], 2));
          if (r + s >= d || j === p.length - 1) {
            var f = s > 0 ? Math.min(1, (d - r) / s) : 0;
            return { x: p[j-1][0] + (p[j][0] - p[j-1][0]) * f,
                     y: p[j-1][1] + (p[j][1] - p[j-1][1]) * f, g: i };
          }
          r += s;
        }
      }
      acc += o.L[i];
    }
    return { x: 0.5, y: 0.5, g: 0 };
  }

  /* El objeto ocupa la figura entera, centrado y con un margen: es lo único
     que hay en pantalla mientras dura, así que no tiene por qué encogerse
     dentro de la caja de la que ha salido. */
  var OBJ_G = S_MENTE;
  function F_OBJETO(i, u, g, G, o, tm, ins) {
    var frO = MARCO[OBJ_G];
    var ar = (frO.h * H) / (frO.w * W);
    var ob = OBJ[OBJ_ORDEN[SEL.k]];
    if (!ob) { o.a = 0; o.g = -1; return; }
    var vida = (tm - SEL.t0) / SEL_MS;
    var entra = ease(cl(vida / 0.10));
    var sale = 1 - ease(cl((vida - 0.88) / 0.12));
    var p = puntoObjeto(ob, u);
    var esc = 0.66;
    o.nx = 0.5 + (p.x - 0.5) * esc * ar;
    o.ny = 0.5 + (p.y - 0.5) * esc;
    o.a = entra * sale * (0.26 + 0.09 * Math.sin(tm * 0.0012 + u * 6));
    o.c = C_FLUJO;
    /* EL CONTORNO, COMO TRAZO ANCHO Y NO COMO SEGMENTOS SUELTOS.
       MEDIDO mirando una figura grande: unir particula con particula con la
       linea fina de un pixel deja un peine. Cada particula esta en un
       estrato distinto y cae a un radio distinto, asi que el segmento que va
       de una a la siguiente cruza en diagonal y se lee como una pua. En una
       nube da igual; en un contorno cerrado lo estropea entero.

       El mecanismo de trazo ancho que ya usa la grafica encadena los
       segmentos de un mismo grupo en UNA polilinea con su grosor y su color.
       La figura pasa por ahi: las particulas siguen siendo las que la
       dibujan, pero el contorno sale limpio. */
    var gi = GRU_BASE + (p.g % GRU_N);
    o.g = gi;
    GRUW[p.g % GRU_N] = 2.1 * entra * sale * (narrow ? 0.8 : 1);
    GRUC[p.g % GRU_N] = C_FLUJO;
    o.r = 0.86;
  }

  /* ══════════════ LA DERIVA — materia sin figura ══════════════

     No dibuja nada, y ese es el encargo. Cada partícula se queda cerca del
     sitio que le tocó en la bruma de fondo y respira despacio, con dos senos
     de periodos primos entre sí para que el conjunto no lata a la vez —si
     late a la vez se lee como una figura, que es justo lo que no queremos—.

     Lo único que responde es el puntero: la materia cercana se aviva un
     poco. Basta para que el campo no parezca un fondo muerto, y no llega a
     formar nada. */
  function F_DERIVA(i, u, g, G, o, tm, ins) {
    var p = PT[i];
    var f1 = tm * 0.000085 + p.hx * 7.1;
    var f2 = tm * 0.000061 + p.hy * 5.3;
    var x = p.hx + Math.sin(f1) * 0.026 + Math.sin(f2 * 1.7) * 0.014;
    var y = p.hy + Math.cos(f2) * 0.030 + Math.cos(f1 * 1.3) * 0.011;
    o.nx = x; o.ny = y;
    /* El puntero está en coordenadas del encuadre y el encuadre es la
       ventana: se comparan directamente. */
    var dx = (x - MFX) * 1.4, dy = y - MFY;
    var d2 = dx * dx + dy * dy;
    var cerca = d2 < 0.045 ? (1 - d2 / 0.045) : 0;
    o.a = 0.16 + 0.10 * Math.sin(f1 * 2.3) + 0.42 * cerca * cerca;
    o.c = cerca > 0.45 ? C_DATO : C_BRUMA;
    o.g = -1;                       // sin enlace: enlazar es dibujar
    o.r = 0.85 + 0.45 * cerca;
  }

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
    var R  = (narrow ? 0.165 : 0.200) * (0.62 + 0.38 * nace);

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

  /* ═══════════════ 02 · DISEÑAMOS — EL PLANO DIBUJÁNDOSE ═══════════════

     Aquí había un cerebro con ideas dentro. Estaba bien dibujado y no decía
     nada: un cerebro es un cerebro, no un diseño. Diseñar un sistema es
     dibujar el plano —qué piezas hay, qué tamaño tiene cada una y por dónde
     va cada conexión—, y eso es lo que se ve ocurrir: aparece la retícula,
     caen las piezas una a una, se acotan, y después se trazan las rutas, en
     ángulo recto, que es como se dibuja una instalación y no un grafo.

     Y se puede señalar: la pieza más cercana al puntero se selecciona, se
     encienden sus cotas y se encienden las rutas que salen de ella. Eso es
     lo que hace cualquiera delante de un plano. */
  function F_PLANO(i, u, g, G, o, tm, ins) {
    /* Si hay una caja elegida, el plano se aparta: la materia entera se
       va a formar el objeto de esa caja. No conviven los dos porque un
       plano detrás de un icono es ruido detrás de un mensaje. */
    if (selViva(tm)) return F_OBJETO(i, u, g, G, o, tm, ins);
    var gr = GR.plano, ar = (MARCO[g].h * H) / (MARCO[g].w * W);
    var papel = ease(cl(ins / 0.14));
    var caen  = ease(cl((ins - 0.10) / 0.34));
    var cotas = ease(cl((ins - 0.40) / 0.22));
    var traza = ease(cl((ins - 0.54) / 0.34));
    var pleno = ease(cl((ins - 0.84) / 0.16));

    /* Qué pieza estás señalando. Se mide en unidades redondas para que el
       radio de atención no salga ovalado en un encuadre apaisado. */
    var sel = -1, mejor = 1e9;
    for (var s = 0; s < gr.m.length; s++) {
      var mm = gr.m[s];
      var ddx = (mm.cx - MFX) / ar, ddy = mm.cy - MFY;
      var dd = ddx * ddx + ddy * ddy;
      if (dd < mejor) { mejor = dd; sel = s; }
    }
    if (mejor > 0.05) sel = -1;

    if (u < 0.18) {                                   // LA RETÍCULA
      var q = tramo(u, 0, 0.18, 14);
      var vert = q.k < 7;
      var kk = vert ? q.k : q.k - 7;
      var p = 0.06 + kk * (0.88 / 6);
      if (vert) { o.nx = p; o.ny = 0.03 + q.j * 0.94; }
      else      { o.nx = 0.03 + q.j * 0.94; o.ny = p; }
      o.a = papel * 0.055; o.c = C_BRUMA; o.g = -1; o.r = 0.65;
      return;
    }

    if (u < 0.56) {                                   // LAS PIEZAS
      var q1 = tramo(u, 0.18, 0.56, gr.m.length);
      var m = gr.m[q1.k];
      var cae = ease(cl((caen * (gr.m.length + 1.4) - q1.k) / 1.6));
      /* El perímetro del rectángulo, recorrido de una pieza: ancho, alto,
         ancho, alto. Un módulo tiene esquinas; una mancha no. */
      var per = 2 * (m.w + m.h), d = q1.j * per;
      var x, y;
      if (d < m.w) { x = m.x + d; y = m.y; }
      else if (d < m.w + m.h) { x = m.x + m.w; y = m.y + (d - m.w); }
      else if (d < 2 * m.w + m.h) { x = m.x + m.w - (d - m.w - m.h); y = m.y + m.h; }
      else { x = m.x; y = m.y + m.h - (d - 2 * m.w - m.h); }
      o.nx = x; o.ny = y + (1 - cae) * 0.14;
      var es = (q1.k === sel);
      o.a = cae * (0.17 + 0.12 * pleno + (es ? 0.26 : 0));
      o.c = es ? C_LUZ : (q1.k === 4 ? C_FLUJO : C_DATO);
      o.g = 800 + q1.k; o.r = 0.9 + (es ? 0.22 : 0);
      return;
    }

    if (u < 0.70) {                                   // LAS COTAS
      var q2 = tramo(u, 0.56, 0.70, gr.m.length);
      var m2 = gr.m[q2.k], es2 = (q2.k === sel);
      /* Cota de ancho, por debajo de la pieza, con sus dos remates. */
      var yy = m2.y + m2.h + 0.028;
      if (q2.j < 0.12)      { o.nx = m2.x;          o.ny = m2.y + m2.h + 0.012 + (q2.j / 0.12) * 0.032; }
      else if (q2.j > 0.88) { o.nx = m2.x + m2.w;   o.ny = m2.y + m2.h + 0.012 + ((1 - q2.j) / 0.12) * 0.032; }
      else                  { o.nx = m2.x + ((q2.j - 0.12) / 0.76) * m2.w; o.ny = yy; }
      o.a = cotas * (0.115 + (es2 ? 0.26 : 0));
      o.c = es2 ? C_OK : C_BRUMA; o.g = 820 + q2.k; o.r = 0.7;
      return;
    }

    if (u < 0.94) {                                   // LAS RUTAS
      var q3 = tramo(u, 0.70, 0.94, gr.r.length);
      var r = gr.r[q3.k];
      var hecho = ease(cl((traza * (gr.r.length + 1.2) - q3.k) / 1.5));
      var d3 = q3.j * r.L, acc = 0, seg = 0;
      while (seg < r.s.length - 1 && acc + r.s[seg] < d3) { acc += r.s[seg]; seg++; }
      var tt = r.s[seg] ? (d3 - acc) / r.s[seg] : 0;
      o.nx = r.p[seg][0] + (r.p[seg + 1][0] - r.p[seg][0]) * tt;
      o.ny = r.p[seg][1] + (r.p[seg + 1][1] - r.p[seg][1]) * tt;
      var mia = (sel >= 0 && (r.a === sel || r.b === sel));
      o.a = hecho * (q3.j <= hecho ? 1 : 0) * (0.09 + 0.06 * pleno + (mia ? 0.30 : 0));
      o.c = mia ? C_FLUJO : C_DATO; o.g = 840 + q3.k; o.r = 0.8;
      return;
    }

    /* EL CAJETÍN. Un plano lleva marco y esquina rotulada: sin eso son cajas
       sueltas sobre un fondo, con eso es un documento. */
    var q4 = tramo(u, 0.94, 1.0, 2);
    if (q4.k === 0) {
      var per2 = 2 * (0.96 + 0.96), d4 = q4.j * per2;
      if (d4 < 0.96) { o.nx = 0.02 + d4; o.ny = 0.02; }
      else if (d4 < 1.92) { o.nx = 0.98; o.ny = 0.02 + (d4 - 0.96); }
      else if (d4 < 2.88) { o.nx = 0.98 - (d4 - 1.92); o.ny = 0.98; }
      else { o.nx = 0.02; o.ny = 0.98 - (d4 - 2.88); }
    } else {
      o.nx = 0.70 + q4.j * 0.28; o.ny = 0.905;
      if (q4.j > 0.96) { o.nx = 0.70; o.ny = 0.905 + (q4.j - 0.96) * 1.8; }
    }
    o.a = papel * (0.10 + 0.08 * pleno); o.c = C_BRUMA; o.g = 880 + q4.k; o.r = 0.7;
  }

  /* ═══════════ 03 · IMPLANTAMOS — LAS PIEZAS ENCAJAN Y ARRANCA ══════════

     Implantar no es tener una red. Es que lo diseñado LLEGUE a la empresa,
     encaje en lo que ya hay y empiece a funcionar. Así que aquí hay un
     núcleo que ya está, seis huecos vacíos dibujados a trazos, y seis piezas
     que entran desde fuera del encuadre y se meten en su hueco. Cuando una
     encaja, se enciende el conector que la une al núcleo. Cuando están
     todas, arranca el tráfico y el conjunto respira.

     Señalar una pieza le da corriente: su conector se enciende y su tráfico
     acelera. Señalar el centro los enciende todos. */
  /* Los tres ejes del tren, en unidades de altura y como desplazamientos
     desde el centro del encuadre. Se calculan una vez: son constantes. */
  var G_T = [16, 10, 8];                       // dientes
  var G_R = [0.185, 0.185 * 10 / 16, 0.185 * 8 / 16];
  var G_AB = -0.70, G_AC = 0.76;               // dónde se apoyan B y C sobre A
  var G_CX = [-0.112, 0, 0], G_CY = [0.040, 0, 0];
  G_CX[1] = G_CX[0] + Math.cos(G_AB) * (G_R[0] + G_R[1]);
  G_CY[1] = G_CY[0] + Math.sin(G_AB) * (G_R[0] + G_R[1]);
  G_CX[2] = G_CX[0] + Math.cos(G_AC) * (G_R[0] + G_R[2]);
  G_CY[2] = G_CY[0] + Math.sin(G_AC) * (G_R[0] + G_R[2]);

  /* El perfil de un diente, recorrido de 0 a 1: meseta, flanco de bajada,
     valle y flanco de subida. Los flancos importan — con un escalón seco la
     rueda parece una sierra circular y no un engranaje. */
  function diente(u) {
    /* Meseta larga, flanco corto, valle largo. Con el flanco largo la rueda
       sale ondulada en vez de dentada, que es lo que pasaba antes. */
    if (u < 0.36) return 1;
    if (u < 0.44) return 1 - (u - 0.36) / 0.08;
    if (u < 0.92) return 0;
    return (u - 0.92) / 0.08;
  }

  function F_MOTOR(i, u, g, G, o, tm, ins) {
    var ar = (MARCO[g].h * H) / (MARCO[g].w * W);
    var monta  = ease(cl(ins / 0.20));            // aparecen las dos primeras
    var llega  = ease(cl((ins - 0.26) / 0.30));   // la tercera entra
    var gira   = ease(cl((ins - 0.54) / 0.28));   // el tren arranca
    var pleno  = ease(cl((ins - 0.80) / 0.20));

    /* La velocidad sube un poco con el puntero dentro: tocar una máquina y
       que responda es la mitad de la sensación de que está viva. */
    var dentro = cercaDe(0.5 + G_CX[0] * ar, 0.5 + G_CY[0], ar);
    var faseA = tm * 0.00034 * gira * (1 + 0.55 * dentro);

    /* La fase de las conducidas sale de la línea de centros. Es la cuenta
       que hace que los dientes encajen en vez de cruzarse. */
    function fase(k) {
      if (k === 0) return faseA;
      var al = k === 1 ? G_AB : G_AC;
      return al + 3.14159265 + 3.14159265 / G_T[k] - (G_T[0] / G_T[k]) * (faseA - al);
    }

    /* Cuánto está puesta cada rueda. La tercera viaja desde fuera por la
       prolongación de su propia línea de centros: entra por donde va a
       quedarse, que es como se mete una pieza en una máquina. */
    function puesta(k) { return k < 2 ? monta : llega; }
    function cx(k) {
      if (k < 2) return G_CX[k];
      return G_CX[0] + Math.cos(G_AC) * ((G_R[0] + G_R[2]) + (1 - llega) * 0.62);
    }
    function cy(k) {
      if (k < 2) return G_CY[k];
      return G_CY[0] + Math.sin(G_AC) * ((G_R[0] + G_R[2]) + (1 - llega) * 0.62);
    }

    /* ── LAS TRES CORONAS ───────────────────────────────────────────── */
    if (u < 0.62) {
      var q = tramo(u, 0, 0.62, 3);
      var k = q.k, r = G_R[k], T = G_T[k], ph = fase(k), pu = puesta(k);
      var s = q.j, th = s * TAU + ph;
      var rr = r * (0.775 + 0.225 * diente((s * T) % 1));
      var X = cx(k) + Math.cos(th) * rr, Y = cy(k) + Math.sin(th) * rr;
      o.nx = 0.5 + X * ar; o.ny = 0.5 + Y;
      var cer = cercaDe(0.5 + cx(k) * ar, 0.5 + cy(k), ar);
      /* La rueda que llega entra encendida y se calma al encajar: se ve
         cuál es la pieza nueva sin que nadie lo diga. */
      var nueva = k === 2 ? (1 - llega) : 0;
      o.a = pu * (0.15 + 0.07 * pleno + 0.20 * cer + 0.20 * nueva);
      o.c = cer > 0.34 ? C_LUZ : (nueva > 0.25 ? C_FLUJO : C_DATO);
      o.g = 900 + k;                    // una corona, un solo trazo cerrado
      o.r = 0.85 + 0.20 * cer;
      return;
    }

    /* ── EL CUBO Y LOS RADIOS ───────────────────────────────────────── */
    if (u < 0.86) {
      var q1 = tramo(u, 0.62, 0.86, 12);        // 3 ruedas × 4 radios
      var k1 = (q1.k / 4) | 0, ra = q1.k % 4;
      var r1 = G_R[k1], ph1 = fase(k1), pu1 = puesta(k1);
      /* Cada radio va del cubo al arranque de la corona. Girando con su
         rueda: sin radios visibles, un círculo dentado no parece rodar. */
      var an = ph1 + (ra / 4) * TAU;
      var d0 = r1 * 0.20, d1 = r1 * 0.80;
      var dd = d0 + (d1 - d0) * q1.j;
      var X1 = cx(k1) + Math.cos(an) * dd, Y1 = cy(k1) + Math.sin(an) * dd;
      o.nx = 0.5 + X1 * ar; o.ny = 0.5 + Y1;
      var cer1 = cercaDe(0.5 + cx(k1) * ar, 0.5 + cy(k1), ar);
      o.a = pu1 * (0.11 + 0.07 * pleno + 0.20 * cer1);
      o.c = cer1 > 0.34 ? C_LUZ : C_DATO;
      o.g = 910 + q1.k; o.r = 0.8;
      return;
    }

    /* ── LOS EJES Y EL PUNTO DE ENGRANE ─────────────────────────────── */
    var q2 = tramo(u, 0.86, 1.0, 6);
    if (q2.k < 3) {                              // el eje de cada rueda
      var k2 = q2.k, pu2 = puesta(k2);
      var th2 = q2.j * TAU;
      o.nx = 0.5 + (cx(k2) + Math.cos(th2) * G_R[k2] * 0.17) * ar;
      o.ny = 0.5 + (cy(k2) + Math.sin(th2) * G_R[k2] * 0.17);
      o.a = pu2 * (0.16 + 0.10 * pleno);
      o.c = C_DATO; o.g = 930 + k2; o.r = 0.9;
      return;
    }
    /* Donde dos ruedas se tocan se enciende un destello al paso de cada
       diente. Es el detalle que convence de que están engranando y no
       simplemente girando una al lado de otra. */
    var par = q2.k - 3;                          // 0: A-B · 1: A-C · 2: reposo
    if (par > 1) { o.a = 0; o.g = -1; return; }
    var alp = par === 0 ? G_AB : G_AC;
    var px2 = G_CX[0] + Math.cos(alp) * G_R[0], py2 = G_CY[0] + Math.sin(alp) * G_R[0];
    var ta = (faseA * G_T[0] / TAU) % 1;
    var chispa = Math.pow(Math.max(0, Math.sin(ta * 3.14159265)), 6);
    var sp = q2.j * TAU;
    var rad = 0.014 * (0.4 + 0.6 * chispa);
    o.nx = 0.5 + (px2 + Math.cos(sp) * rad) * ar;
    o.ny = 0.5 + (py2 + Math.sin(sp) * rad);
    o.a = (par === 1 ? llega : monta) * gira * (0.10 + 0.40 * chispa);
    o.c = C_LUZ; o.g = -1; o.r = 1.1;
  }

  /* ═══════════ 04 · MEDIMOS Y MEJORAMOS — UNA GRÁFICA DE VERDAD ═════════

     La anterior era una línea ondulada que parecía una serpiente aplastada.
     El concepto era bueno —se mide, se corrige, se sube— y la forma lo
     estropeaba. Una gráfica de negocio tiene ejes, rejilla y barras por
     periodo; eso es lo que la hace reconocible antes de leer nada.

     Así que ahora hay barras, hay rejilla, y encima va la línea de tendencia
     con sus tres correcciones: donde algo ha fallado la línea se marca en
     magenta, y unas lecturas después ya está corregida y en verde. Los
     baches siguen estando; lo que no está es la serpiente.

     Señalar una columna la selecciona: se ilumina y baja su línea al eje. */
  function alturaBarra(k, n) {
    var t = n > 1 ? k / (n - 1) : 0;
    var s = t * t * (3 - 2 * t);
    /* Hasta 0,70 del alto: la escala llega a 0,74 (40 k€) y ninguna barra
       puede salirse por encima de la pared de fondo. */
    var v = 0.10 + s * 0.60;
    /* Tres periodos flojos. No son ruido: son los que después se corrigen. */
    var a = (t - 0.27) / 0.055, b = (t - 0.55) / 0.050, c = (t - 0.80) / 0.045;
    /* Tres periodos flojos y ni uno más. El temblor aleatorio que había aquí
       antes es justo lo que hacía que la línea de tendencia se leyera como
       una culebra en vez de como una tendencia. */
    v -= 0.064 * Math.exp(-a * a) + 0.053 * Math.exp(-b * b) + 0.040 * Math.exp(-c * c);
    return v;
  }
  /* LA GRÁFICA SE CONSTRUYE CON EL RELOJ, NO SOLO CON EL SCROLL. Antes las
     barras subían a medida que se bajaba por la sección: quien se paraba a
     leer el texto veía una gráfica a medio hacer, con dos barras y un suelo
     vacío. Ahora, en cuanto la sección manda, la gráfica se levanta sola en
     un par de segundos (y si se sigue bajando, el scroll la adelanta). */
  var G3 = { t0: -1 };
  function g3Reloj(tm) { return G3.t0 < 0 ? 0 : (tm - G3.t0) / 1000; }
  function g3Ejes(ins, tm)  { return Math.max(ease(cl(ins / 0.13)), ease(cl(g3Reloj(tm) / 0.5))); }
  function g3Sube(ins, tm)  { return Math.max(ease(cl((ins - 0.08) / 0.52)), ease(cl((g3Reloj(tm) - 0.25) / 1.7))); }
  function g3Linea(ins, tm) { return Math.max(ease(cl((ins - 0.44) / 0.34)), ease(cl((g3Reloj(tm) - 1.5) / 1.3))); }
  function F_GRAFICA(i, u, g, G, o, tm, ins) {
    var fr = MARCO[g], ar = (fr.h * H) / (fr.w * W);
    var NB = small ? 5 : narrow ? 6 : 7;
    var X0 = 0.115, XW = 0.845, Y0 = 0.855, PASO = XW / NB;
    var ejes  = g3Ejes(ins, tm);
    var sube  = g3Sube(ins, tm);
    var linea = g3Linea(ins, tm);
    var pleno = ease(cl((ins - 0.80) / 0.20));
    var kSel = Math.max(0, Math.min(NB - 1, Math.round((MFX - X0) / PASO - 0.5)));
    var hay = MFX > X0 - 0.05 && MFX < X0 + XW + 0.05 && MFY > 0.04 && MFY < 0.98;

    /* El ancho de la barra en PÍXELES, que es lo que quiere el trazo. Una
       unidad de `nx` vale `W * fr.w` píxeles: el mismo factor con el que
       `marco()` proyecta después. */
    var ANCHO = PASO * 0.56, pxAncho = ANCHO * fr.w * W;

    if (u < 0.13) {                                   // EJES, MARCO Y REJILLA
      var q = tramo(u, 0, 0.13, 7);
      if (q.k === 6) {
        /* EL MARCO DEL ÁREA DE DIBUJO. Sin él, unas barras sueltas sobre el
           fondo estrellado no se leen como una gráfica: se leen como unas
           barras. Con él hay un dentro y un fuera, que es lo que convierte
           un dibujo en una lectura. */
        var pm = q.j * 4, lado = pm | 0, ff = pm - lado;
        var x0 = X0 - 0.055, x1 = X0 + XW + 0.035, y0 = Y0 - 0.865, y1 = Y0 + 0.055;
        if (lado === 0)      { o.nx = x0 + ff * (x1 - x0); o.ny = y0; }
        else if (lado === 1) { o.nx = x1; o.ny = y0 + ff * (y1 - y0); }
        else if (lado === 2) { o.nx = x1 - ff * (x1 - x0); o.ny = y1; }
        else                 { o.nx = x0; o.ny = y1 - ff * (y1 - y0); }
        /* El marco plano sobra: la gráfica tiene ahora suelo y pared de
           fondo de verdad (grafica3D). Las partículas siguen aquí, sin
           tinta, porque son las que marcan la zona que se borra cada
           fotograma. */
        o.a = 0; o.c = C_BRUMA; o.g = -1; o.r = 0.58;
        return;
      }
      if (q.k === 0)      { o.nx = X0 - 0.02 + q.j * (XW + 0.05); o.ny = Y0; o.a = ejes * 0.30; }
      else if (q.k === 1) { o.nx = X0 - 0.02; o.ny = Y0 - q.j * 0.80; o.a = ejes * 0.20; }
      else {
        /* Cuatro rejillas punteadas. Son la escala: se tienen que poder
           ignorar mientras se mira la forma, y estar cuando se mira un valor. */
        o.nx = X0 - 0.02 + q.j * (XW + 0.04);
        o.ny = Y0 - (q.k - 1) * 0.185;
        o.a = ejes * (q.j % 0.050 < 0.026 ? 0.075 : 0);
      }
      o.a *= 0.0;                                   // ejes y rejilla: los pinta grafica3D, en perspectiva
      o.c = C_BRUMA; o.g = -1; o.r = 0.62;
      return;
    }

    if (u < 0.70) {                                   // LAS BARRAS
      var q1 = tramo(u, 0.13, 0.70, NB);
      var k = q1.k, hb = alturaBarra(k, NB);
      var cx = X0 + (k + 0.5) * PASO;
      var ent = ease(cl((sube - k / NB) / 0.09));
      var h = hb * ent;
      /* UNA sola hebra vertical por barra, de la base al techo, pintada con
         el ancho de la barra. El relleno lo pone el trazo; las partículas
         solo le dan grano y marcan el borde superior. */
      /* LA BARRA LA DIBUJA grafica3D, con sus tres caras. Las partículas se
         quedan en la arista delantera derecha, como grano de luz que sube por
         el filo: es lo que hace que la barra sea de la misma materia que el
         resto de la portada y no una pegatina encima. */
      o.nx = cx + ANCHO * 0.5; o.ny = Y0 - q1.j * h;
      var es = hay && k === kSel;
      o.g = -1;
      var techo = q1.j > 0.965 ? 1 : 0;
      o.a = ent * (0.05 + 0.05 * pleno + (es ? 0.08 : 0) + techo * 0.18);
      o.c = es ? C_LUZ : C_DATO;
      o.r = 0.8;
      return;
    }

    if (u < 0.90) {                                   // LA TENDENCIA
      /* UNA hebra, fina y de un color. Antes eran tres separadas y cambiando
         de magenta a verde en cada bache: eso es lo que se leía como un
         gusano. Los baches están en los datos y se ven en la forma. */
      var q2 = tramo(u, 0.70, 0.90, 1);
      var tl = q2.j, kf = tl * (NB - 1), k0 = Math.min(NB - 2, kf | 0), fr2 = kf - k0;
      var h0 = alturaBarra(k0, NB), h1 = alturaBarra(k0 + 1, NB);
      var sm = fr2 * fr2 * (3 - 2 * fr2);
      o.nx = X0 + (0.5 + kf) * PASO;
      o.ny = Y0 - (h0 + (h1 - h0) * sm) - 0.022;
      var pas = cl((sube * 1.04 - tl) / 0.05);
      o.a = 0 * pas;                                 // la línea va en 3D, sobre los techos
      o.c = C_OK; o.g = -1; o.r = 0.72;
      return;
    }

    if (u < 0.965) {                                  // LOS PUNTOS MEDIDOS
      var q3 = tramo(u, 0.90, 0.965, NB);
      var k3 = q3.k, h3 = alturaBarra(k3, NB);
      var es3 = hay && k3 === kSel;
      var vis = ease(cl((sube * 1.04 - k3 / NB) / 0.05));
      ponNodo(o, X0 + (k3 + 0.5) * PASO, Y0 - h3 - 0.022, q3.j, (es3 ? 0.016 : 0.0085) * vis, ar);
      o.a = 0 * vis;
      o.c = es3 ? C_LUZ : C_OK; o.g = -1; o.r = es3 ? 1.15 : 0.95;
      return;
    }

    /* LA LECTURA SEÑALADA: la horizontal desde la columna hasta la escala,
       que es lo que hace cualquiera con el dedo encima de una gráfica. */
    var q4 = tramo(u, 0.965, 1.0, 1);
    var xs = X0 + (kSel + 0.5) * PASO, hs = alturaBarra(kSel, NB);
    o.nx = X0 - 0.02 + q4.j * (xs - X0 + 0.02); o.ny = Y0 - hs;
    o.a = 0 * linea;
    o.c = C_LUZ; o.g = -1; o.r = 0.65;
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

  var FORM = [F0, F_DERIVA, F_DERIVA, F_DERIVA, F_LUPA, F_PLANO, F_MOTOR, F_GRAFICA, F5, F8];

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
    /* EN VERTICAL EL GUION CORRE ANTES.

       Las paradas están en el centro de cada sección, así que el guion de un
       capítulo ocupa desde su centro hasta el 68% del camino al siguiente. En
       un escritorio eso cae dentro de la propia sección. En un teléfono las
       secciones miden casi el doble que la ventana, y medido a 390 px el
       punto álgido de la gráfica caía 10.680 px abajo —con el texto del
       capítulo siguiente ocupando la pantalla entera—. O sea: la figura
       terminaba de contar lo suyo cuando ya no estaba el texto que explicaba
       qué estaba contando.

       En vertical el guion se comprime al primer tercio del tramo. La
       transformación no se toca: sigue empezando donde empezaba. */
    FASE = cl(t / (narrow ? 0.30 : REPOSO));
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
  /* Cuánto se sale el puntero del encuadre antes de que la figura lo suelte.
     Un poco de margen es bueno: rozar el borde no debería cortar la
     interacción de golpe. Mucho margen es malo: con el ratón a media pantalla
     de distancia la figura seguía apuntando hacia allí. */
  var MARGEN_FIGURA = 0.16;
  function punteroEnMarco(fr, mir, vol, tm) {
    var ox, oy, vuelve = false;
    var hayDedo = coarse && (tm - toque) < 2800;
    if (coarse && !hayDedo) {
      /* Sin puntero, el reposo no es quieto: el foco recorre una trayectoria
         lenta y la figura sigue enseñando lo que hace. */
      ox = 0.5 + 0.30 * Math.sin(tm * 0.00021);
      oy = 0.5 + 0.24 * Math.sin(tm * 0.00034 + 1.1);
    } else if (ptx < -1) {
      ox = 0.5; oy = 0.5; vuelve = true;          // el ratón se ha ido de la ventana
    } else {
      var cx = mir ? 1 - fr.x : fr.x;
      ox = (ptx / W - cx) / fr.w + 0.5;
      if (mir && vol) ox = 1 - ox;
      oy = (pty / H - fr.y) / fr.h + 0.5;
      if (ox < -MARGEN_FIGURA || ox > 1 + MARGEN_FIGURA ||
          oy < -MARGEN_FIGURA || oy > 1 + MARGEN_FIGURA) {
        /* EL PUNTERO ESTÁ FUERA DE LA FIGURA. Antes esto se recortaba al
           borde y la figura se quedaba mirando a una esquina para siempre.
           Ahora vuelve al centro, que es su sitio. */
        ox = 0.5; oy = 0.5; vuelve = true;
      }
    }
    /* Volver es más lento que seguir: seguir al ratón tiene que sentirse
       inmediato, y volver tiene que sentirse como soltar algo. */
    var k = vuelve ? 0.055 : 0.12;
    MFX += (ox - MFX) * k;
    MFY += (oy - MFY) * k;
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
  /* EL TRAZO ANCHO. Dieciséis grupos reservados —9000 a 9015— que se pintan
     con el grosor y el color que pida la formación en vez de con el hilo de
     1 px de todos los demás. Existe porque una barra de una gráfica es un
     trazo ancho y no hay forma honesta de fingir uno con puntos: con el
     presupuesto de partículas de un capítulo, rellenar una columna a base de
     hebras da un rayado, no una barra. */
  var GRU_BASE = 9000, GRU_N = 16, GRU_CAP = 4 * 420;
  var GRUW = new Float32Array(GRU_N), GRUC = new Int32Array(GRU_N);
  var GRUS = [], GRUSN = new Int32Array(GRU_N);
  for (var _gi = 0; _gi < GRU_N; _gi++) GRUS.push(new Float32Array(GRU_CAP));
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
  var VOLTEA = [1, 1, 1, 1, 1, 0, 1, 0, 0, 1];
  /* EL PARALAJE, POR CAPÍTULO.
     Mover cada partícula en proporción a su profundidad da volumen a una
     nebulosa y ARRUINA una recta: las partículas de una misma columna tienen
     profundidades distintas, así que la columna se dobla en zigzag en cuanto
     el ratón se mueve. Medido en la gráfica: con el ratón a media pantalla,
     una barra recta salía con doce píxeles de serpenteo. Donde la figura es
     un dibujo técnico —el plano, el motor, la gráfica— el paralaje baja casi
     a cero; donde es materia, se queda entero. */
  var PARAL = [1, 1, 1, 1, 0.50, 0.26, 0.34, 0.16, 0.9, 1];
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
    ctx.globalCompositeOperation = 'destination-out';
    var trans = Math.sin(tw * 3.1416);
    ctx.fillStyle = noClear ? 'rgba(0,0,0,0.10)'
                            : 'rgba(0,0,0,' + (0.30 - 0.13 * trans).toFixed(3) + ')';
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
    ctx.globalCompositeOperation = 'source-over';
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
    /* MEDIDO mirando una figura a tamano grande: salia «peluda», con una
       pua por particula. No era vibracion ni ruido: es el PARALAJE. Cada
       particula esta en un estrato distinto, asi que recibe un desplazamiento
       distinto, y el trazo que une dos consecutivas cruza de un estrato al
       otro. En una nube de puntos no se ve; en un contorno cerrado se ve
       como un peine. Mientras hay una figura puesta, el paralaje se apaga:
       la figura es una sola lamina, no un campo con profundidad. */
    var figura = selViva(tm);
    var parA = (narrow || figura) ? 0 : PARAL[iA], parB = (narrow || figura) ? 0 : PARAL[iB];
    /* MEDIDO, y era esto: con la figura puesta EN MITAD de una transición,
       el lado A y el lado B la calculaban cada uno con SU encuadre y su
       proporción, y después se mezclaban con un retardo distinto por
       partícula. Resultado: la mitad de la materia en un sitio y la otra
       mitad cincuenta píxeles más allá, unidas por un trazo. Eso eran las
       púas. Una figura no es una transición: es una lámina, y se calcula
       con UN encuadre, el que manda. */
    if (figura) {
      OBJ_G = tw >= 0.5 ? iB : iA;
      frA = frB = MARCO[OBJ_G]; mirA = mirB = MIR[OBJ_G]; volA = volB = VOLTEA[OBJ_G];
      depA = depB = frA.d;
      /* Y el MISMO REPARTO. Cada capítulo usa una fracción distinta de la
         materia, así que el lado A colocaba la partícula en un punto del
         recorrido y el lado B en otro: con el retardo por partícula, cada
         una acababa en un sitio intermedio distinto. Con la figura puesta
         los dos lados reparten igual, y entonces los dos dan el mismo punto
         y da igual por dónde vaya la mezcla. */
      usoA = usoB = USO[OBJ_G];
      invA = invB = 1 / usoA;
      /* Y UN SOLO LADO. Aunque los dos lados calculen lo mismo, la mezcla
         los combina con un retardo distinto por particula, y el objeto
         `ob` se queda con datos viejos cuando a una particula no le toca
         el lado B. Con la figura puesta se resuelve un unico lado —el que
         manda— y la mezcla deja de existir: la figura sale igual de limpia
         tanto en reposo como a mitad de un cambio de capitulo. */
      if (tw >= 0.5) { soloB = true; soloA = false; }
      else { soloA = true; soloB = false; }
    }

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
      var pf = (0.30 + p.z * 1.10) * lerp(parA, parB, t);
      var dx = p.x + cmx * 34 * pf;
      var dy = p.y + cmy * 22 * pf;

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
    var NC = COL.length, c2, gg;
    for (c2 = 0; c2 < NC; c2++) SEGN[c2] = 0;
    for (gg = 0; gg < GRU_N; gg++) GRUSN[gg] = 0;
    for (var k2 = 1; k2 < N; k2++) {
      var gk = pg[k2];
      if (gk < 0 || gk !== pg[k2 - 1]) continue;
      var ddx = px[k2] - px[k2 - 1], ddy = py[k2] - py[k2 - 1];
      if (ddx * ddx + ddy * ddy > 30000) continue;
      if (gk >= GRU_BASE && gk < GRU_BASE + GRU_N) {
        var gi2 = gk - GRU_BASE, ng = GRUSN[gi2];
        if (ng < GRU_CAP - 4) {
          var sgt = GRUS[gi2];
          sgt[ng] = px[k2 - 1]; sgt[ng + 1] = py[k2 - 1];
          sgt[ng + 2] = px[k2];  sgt[ng + 3] = py[k2];
          GRUSN[gi2] = ng + 4;
        }
        continue;
      }
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

    /* Y los trazos anchos, uno por grupo, con su propio grosor. Van
       DESPUÉS de los finos para que la línea de tendencia no quede enterrada
       bajo las barras: en una gráfica la tendencia va encima. */
    /* Extremo a escuadra: una barra termina donde termina el dato, no medio
       trazo más arriba. Las costuras que obligaban a redondear ya no están:
       esto es una polilínea, no noventa segmentos sueltos. */
    ctx.lineCap = 'butt'; ctx.lineJoin = 'round';
    for (gg = 0; gg < GRU_N; gg++) {
      var tg = GRUSN[gg];
      if (!tg || GRUW[gg] <= 0) continue;
      var sgg = GRUS[gg];
      ctx.beginPath();
      /* UNA polilínea, no noventa segmentos. Con el extremo a escuadra cada
         junta dejaba una costura y la columna salía rayada en horizontal;
         encadenando los que comparten extremo queda un solo trazo. */
      var ax = NaN, ay = NaN;
      for (var mg = 0; mg < tg; mg += 4) {
        if (sgg[mg] !== ax || sgg[mg + 1] !== ay) ctx.moveTo(sgg[mg], sgg[mg + 1]);
        ctx.lineTo(sgg[mg + 2], sgg[mg + 3]);
        ax = sgg[mg + 2]; ay = sgg[mg + 3];
      }
      ctx.lineWidth = GRUW[gg];
      ctx.strokeStyle = rgba(COL[GRUC[gg]], 0.150);
      ctx.stroke();
      GRUW[gg] = 0;                       // cada fotograma lo vuelve a pedir
    }
    ctx.lineWidth = 1; ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    var caja3 = grafica3D(tm);
    if (caja3) {
      if (caja3[0] < bx0) bx0 = caja3[0]; if (caja3[1] < by0) by0 = caja3[1];
      if (caja3[2] > bx1) bx1 = caja3[2]; if (caja3[3] > by1) by1 = caja3[3];
    }
    rotulos(tm);

    /* Los rótulos se pintan DENTRO del encuadre de su figura, y el encuadre
       está cubierto de sobra por la caja de las partículas que lo dibujan:
       no hace falta ampliarla. Los enlaces, igual: van entre partículas ya
       contabilizadas, asi que
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


  /* ══════════════════════ LOS RÓTULOS ══════════════════════

     Texto de verdad sobre el campo. Dos sitios y solo dos:

       · el plano, donde cada caja lleva el nombre de lo que es;
       · la lupa, donde hay apuntes escondidos que solo se leen ampliados.

     Se dibujan aquí y no como partículas porque una palabra de veinte
     partículas no es una palabra: es una mancha con forma de palabra. Y van
     después del campo, en `source-over`, para que el texto salga limpio y no
     sumado sobre lo que tenga detrás.

     La página en inglés usa este mismo archivo, así que los textos van en
     los dos idiomas y se elige por el `lang` del documento. */
  var EN = (document.documentElement.getAttribute('lang') || 'es').slice(0, 2) === 'en';

  /* Las ocho áreas y, en el centro, la empresa. El orden es el de PLANO_M. */
  var PLANO_ET = EN
    ? ['SALES', 'QUOTES', 'PROJECTS', 'CLIENTS', 'YOUR COMPANY', 'SUPPLIERS', 'INVOICING', 'PAYMENTS', 'ALERTS']
    : ['VENTAS', 'PRESUPUESTOS', 'PROYECTOS', 'CLIENTES', 'TU EMPRESA', 'PROVEEDORES', 'FACTURACIÓN', 'COBROS', 'AVISOS'];

  /* Lo que la lente encuentra. Cada apunte va en una celda concreta del
     campo de registros —fila y columna— y dice una cosa de las que se
     apuntan mirando cómo trabaja una empresa de verdad: qué se hace a mano,
     cuántas veces, y qué cuesta. */
  var LUPA_AP = EN ? [
    { c: 0.16, f: 0.12, a: 'ORDER 4812', b: '22 times a month' },
    { c: 0.62, f: 0.10, a: 'MONDAY, 09:10', b: 'the report \u00b7 4 h/month' },
    { c: 0.86, f: 0.30, a: 'INVOICE 2026-014', b: 'overdue 47 days' },
    { c: 0.40, f: 0.44, a: 'A CLIENT ASKS', b: '3 screens \u00b7 11 min' },
    { c: 0.10, f: 0.62, a: 'QUOTE 311', b: 'no follow-up' },
    { c: 0.70, f: 0.70, a: 'EXPENSE 8821', b: 'not in the books' },
    { c: 0.34, f: 0.88, a: 'FRIDAY, 18:40', b: 'figure sent by chat' }
  ] : [
    { c: 0.16, f: 0.12, a: 'PEDIDO 4812', b: '22 veces al mes' },
    { c: 0.62, f: 0.10, a: 'LUNES, 09:10', b: 'el informe \u00b7 4 h/mes' },
    { c: 0.86, f: 0.30, a: 'FACTURA 2026-014', b: 'vencida 47 d\u00edas' },
    { c: 0.40, f: 0.44, a: 'PREGUNTA UN CLIENTE', b: '3 pantallas \u00b7 11 min' },
    { c: 0.10, f: 0.62, a: 'PRESUPUESTO 311', b: 'sin seguimiento' },
    { c: 0.70, f: 0.70, a: 'GASTO 8821', b: 'sin contabilizar' },
    { c: 0.34, f: 0.88, a: 'VIERNES, 18:40', b: 'el dato, por chat' }
  ];



  var _rt = { x: 0, y: 0 }, _ro = { nx: 0, ny: 0 };
  function aPantalla(nx, ny, fr, mir, vol) {
    _ro.nx = nx; _ro.ny = ny;
    marco(_ro, fr, mir, _rt, vol);
    return _rt;
  }


  /* ═════════════════ LA GRÁFICA, EN TRES DIMENSIONES ═════════════════

     «Tiene que parecer una gráfica real en 3D». Con partículas no se puede:
     una barra hecha de puntos es un dibujo de una barra. Así que la gráfica
     se construye como se construye una de verdad —suelo, pared de fondo con
     su escala, y barras con cara delantera, lateral y techo, cada una con
     su luz— y las partículas se quedan como grano en las aristas.

     Proyección oblicua: la profundidad va hacia arriba a la derecha, que es
     como se lee una gráfica 3D de toda la vida. Las caras se sombrean con
     una sola fuente de luz arriba a la izquierda —techo claro, frente medio,
     lateral oscuro— y así el volumen se entiende sin pensar.

     La línea de tendencia pasa por el CENTRO de cada techo, no por el borde
     de delante: si pasara por delante flotaría por fuera de las barras.
     Señalar una columna la ilumina y dice su valor. Devuelve la caja que ha
     pintado, para que el borrado por región la cubra. */
  var G3_VAL = EN ? ' k' : ' k';
  function grafica3D(tm) {
    var d = tw >= 0.5 ? iB : iA;
    if (d !== S_CURVA) { G3.t0 = -1; return null; }
    if (G3.t0 < 0) G3.t0 = tm;
    var quieto = 1 - Math.sin(tw * 3.14159265);
    if (quieto < 0.04) return null;
    var ins = inside(d);
    var fr = MARCO[d], mir = MIR[d], vol = VOLTEA[d];
    var NB = small ? 5 : narrow ? 6 : 7;
    var X0 = 0.115, XW = 0.845, Y0 = 0.855, PASO = XW / NB, TOPE_NY = 0.74, TOPE = 40;
    var ejes = g3Ejes(ins, tm), sube = g3Sube(ins, tm), linea = g3Linea(ins, tm);
    var al = quieto * ejes;
    if (al < 0.03) return null;
    var kSel = Math.max(0, Math.min(NB - 1, Math.round((MFX - X0) / PASO - 0.5)));
    var hay = MFX > X0 - 0.05 && MFX < X0 + XW + 0.05 && MFY > 0.04 && MFY < 0.98;

    function P(nx, ny) { var q = aPantalla(nx, ny, fr, mir, vol); return { x: q.x, y: q.y }; }
    var sgn = (mir && !vol) ? -1 : 1;
    var wpx = PASO * 0.56 * fr.w * W;
    var DX = sgn * wpx * 0.60, DY = -wpx * 0.42;
    var esc = Math.min(fr.w * W, fr.h * H);
    var A = P(X0 - 0.02, Y0), B = P(X0 + XW + 0.02, Y0);
    var yTop = P(X0, Y0 - TOPE_NY - 0.02).y;
    var bx0 = Math.min(A.x, B.x) - 60, bx1 = Math.max(A.x, B.x) + Math.abs(DX) + 40;
    var by0 = yTop + DY - 40, by1 = A.y + 40;

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    function poly(pts) { ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y); for (var z = 1; z < pts.length; z++) ctx.lineTo(pts[z].x, pts[z].y); ctx.closePath(); }
    function mas(p, f) { return { x: p.x + DX * (f == null ? 1 : f), y: p.y + DY * (f == null ? 1 : f) }; }

    /* ── la pared de fondo y el suelo ── */
    var TL = { x: A.x, y: yTop }, TR = { x: B.x, y: yTop };
    poly([mas(A), mas(B), mas(TR), mas(TL)]);
    var gp = ctx.createLinearGradient(0, yTop + DY, 0, A.y + DY);
    gp.addColorStop(0, 'rgba(30,44,92,' + (0.20 * al).toFixed(3) + ')');
    gp.addColorStop(1, 'rgba(18,26,58,' + (0.34 * al).toFixed(3) + ')');
    ctx.fillStyle = gp; ctx.fill();
    // pared izquierda
    poly([A, mas(A), mas(TL), TL]);
    ctx.fillStyle = 'rgba(14,20,44,' + (0.34 * al).toFixed(3) + ')'; ctx.fill();
    // suelo
    poly([A, B, mas(B), mas(A)]);
    var gs = ctx.createLinearGradient(0, A.y, 0, A.y + DY);
    gs.addColorStop(0, 'rgba(60,92,190,' + (0.30 * al).toFixed(3) + ')');
    gs.addColorStop(1, 'rgba(40,60,130,' + (0.14 * al).toFixed(3) + ')');
    ctx.fillStyle = gs; ctx.fill();
    // la escala: líneas en la pared de fondo y su pliegue por la izquierda
    ctx.lineWidth = 1;
    for (var e = 0; e <= 4; e++) {
      var yy = P(X0, Y0 - e * (TOPE_NY / 4)).y;
      var a0 = { x: A.x, y: yy }, a1 = { x: B.x, y: yy };
      ctx.strokeStyle = 'rgba(150,174,245,' + ((e === 0 ? 0.40 : 0.16) * al).toFixed(3) + ')';
      ctx.beginPath(); ctx.moveTo(a0.x, a0.y); ctx.lineTo(mas(a0).x, mas(a0).y); ctx.lineTo(mas(a1).x, mas(a1).y); ctx.stroke();
    }
    // divisiones del suelo por periodo
    for (var kk = 0; kk <= NB; kk++) {
      var fx = P(X0 + kk * PASO, Y0);
      ctx.strokeStyle = 'rgba(150,174,245,' + (0.12 * al).toFixed(3) + ')';
      ctx.beginPath(); ctx.moveTo(fx.x, fx.y); ctx.lineTo(mas(fx).x, mas(fx).y); ctx.stroke();
    }
    // el filo del suelo, delante
    ctx.strokeStyle = 'rgba(190,206,255,' + (0.46 * al).toFixed(3) + ')';
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();

    /* ── las barras ── */
    var tops = [];
    var tamV = Math.max(10, Math.round(esc * 0.026));
    for (var k = 0; k < NB; k++) {
      var hb = alturaBarra(k, NB);
      var ent = ease(cl((sube - k / NB) / 0.09));
      if (ent <= 0.001) { tops.push(null); continue; }
      var cx = X0 + (k + 0.5) * PASO;
      var L = P(cx - PASO * 0.28, Y0), R = P(cx + PASO * 0.28, Y0);
      var yt = P(cx, Y0 - hb * ent).y;
      var Lt = { x: L.x, y: yt }, Rt = { x: R.x, y: yt };
      var es = hay && k === kSel, ult = k === NB - 1;
      var c = es ? [70, 226, 250] : ult ? [118, 150, 255] : [78, 128, 255];
      var o2 = al * (0.92 + 0.08 * ent);
      function tono(m, a) { return 'rgba(' + Math.round(Math.min(255, c[0] * m)) + ',' + Math.round(Math.min(255, c[1] * m)) + ',' + Math.round(Math.min(255, c[2] * m)) + ',' + (a * o2).toFixed(3) + ')'; }
      // sombra en el suelo, hacia atrás
      poly([R, mas(R, 1), { x: mas(R, 1).x + wpx * 0.35, y: mas(R, 1).y }, { x: R.x + wpx * 0.35, y: R.y }]);
      ctx.fillStyle = 'rgba(0,0,0,' + (0.22 * al * ent).toFixed(3) + ')'; ctx.fill();
      // cara lateral
      poly([R, mas(R), mas(Rt), Rt]);
      var gl = ctx.createLinearGradient(R.x, 0, R.x + DX, 0);
      gl.addColorStop(0, tono(0.46, 0.96)); gl.addColorStop(1, tono(0.30, 0.96));
      ctx.fillStyle = gl; ctx.fill();
      // cara delantera
      poly([L, R, Rt, Lt]);
      var gf = ctx.createLinearGradient(0, yt, 0, L.y);
      gf.addColorStop(0, tono(1.10, 0.97)); gf.addColorStop(1, tono(0.62, 0.95));
      ctx.fillStyle = gf; ctx.fill();
      // brillo vertical, como en un material satinado
      poly([{ x: L.x + wpx * 0.10, y: yt + 3 }, { x: L.x + wpx * 0.22, y: yt + 3 }, { x: L.x + wpx * 0.22, y: L.y - 2 }, { x: L.x + wpx * 0.10, y: L.y - 2 }]);
      var gb = ctx.createLinearGradient(0, yt, 0, L.y);
      gb.addColorStop(0, 'rgba(255,255,255,' + (0.20 * o2).toFixed(3) + ')'); gb.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gb; ctx.fill();
      // techo
      poly([Lt, Rt, mas(Rt), mas(Lt)]);
      ctx.fillStyle = tono(1.45, 0.98); ctx.fill();
      // aristas
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(235,242,255,' + (0.55 * o2).toFixed(3) + ')';
      ctx.beginPath(); ctx.moveTo(Lt.x, Lt.y); ctx.lineTo(Rt.x, Rt.y); ctx.lineTo(mas(Rt).x, mas(Rt).y); ctx.stroke();
      ctx.strokeStyle = 'rgba(235,242,255,' + (0.18 * o2).toFixed(3) + ')';
      ctx.beginPath(); ctx.moveTo(Rt.x, Rt.y); ctx.lineTo(R.x, R.y); ctx.stroke();
      if (es) {
        ctx.shadowColor = 'rgba(70,226,250,0.55)'; ctx.shadowBlur = 24;
        poly([L, R, Rt, Lt]); ctx.strokeStyle = 'rgba(160,240,255,' + (0.8 * al).toFixed(3) + ')'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.shadowBlur = 0;
      }
      // el valor, encima del techo
      var val = Math.round(hb * TOPE / TOPE_NY * 10) / 10;
      var cT = mas({ x: (Lt.x + Rt.x) / 2, y: yt }, 0.5);
      tops.push({ x: cT.x, y: cT.y, v: val, k: k });
      var alV = al * cl((ent - 0.85) / 0.15) * (es ? 1 : 0.78);
      if (alV > 0.02 && !(narrow && !es && !ult && k % 2)) {
        ctx.font = (es ? '600 ' : '500 ') + tamV + 'px "JetBrains Mono", ui-monospace, monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
        var txt = String(val).replace('.', EN ? '.' : ',') + G3_VAL;
        ctx.fillStyle = 'rgba(5,7,14,' + (0.7 * alV).toFixed(3) + ')';
        var anV = ctx.measureText(txt).width;
        var yL = Math.min(cT.y, Lt.y) - 16;
        ctx.fillRect(cT.x - anV / 2 - 5, yL - tamV - 3, anV + 10, tamV + 8);
        ctx.fillStyle = es ? 'rgba(160,240,255,' + alV.toFixed(3) + ')' : 'rgba(226,234,255,' + alV.toFixed(3) + ')';
        ctx.fillText(txt, cT.x, yL);
      }
    }

    /* ── la tendencia: una línea que se dibuja sobre los techos ── */
    var pts = tops.filter(function (t) { return t; });
    if (pts.length > 1 && linea > 0.01) {
      var nT = (pts.length - 1) * linea, lleno = Math.floor(nT), frac = nT - lleno;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y - 3);
      for (var t = 1; t <= lleno && t < pts.length; t++) ctx.lineTo(pts[t].x, pts[t].y - 3);
      if (lleno + 1 < pts.length && frac > 0) {
        var pa = pts[lleno], pb = pts[lleno + 1];
        ctx.lineTo(pa.x + (pb.x - pa.x) * frac, pa.y - 3 + (pb.y - pa.y) * frac);
      }
      ctx.strokeStyle = 'rgba(52,224,198,' + (0.20 * al).toFixed(3) + ')'; ctx.lineWidth = 7; ctx.stroke();
      ctx.strokeStyle = 'rgba(92,245,214,' + (0.95 * al).toFixed(3) + ')'; ctx.lineWidth = 2.2; ctx.stroke();
      for (var n = 0; n <= lleno && n < pts.length; n++) {
        var pn = pts[n], pul = 0.5 + 0.5 * Math.sin(tm * 0.004 + n);
        var rg = ctx.createRadialGradient(pn.x, pn.y - 3, 0, pn.x, pn.y - 3, 14);
        rg.addColorStop(0, 'rgba(92,245,214,' + (0.55 * al * (0.6 + 0.4 * pul)).toFixed(3) + ')');
        rg.addColorStop(1, 'rgba(92,245,214,0)');
        ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(pn.x, pn.y - 3, 14, 0, 6.2832); ctx.fill();
        ctx.fillStyle = 'rgba(236,255,250,' + al.toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(pn.x, pn.y - 3, 3.4, 0, 6.2832); ctx.fill();
      }
    }

    /* ── la lectura señalada: del techo a la escala ── */
    if (hay && tops[kSel]) {
      var ts = tops[kSel];
      var yv = ts.y - DY * 0.5;
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(160,240,255,' + (0.55 * al).toFixed(3) + ')'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ts.x - DX * 0.5, yv); ctx.lineTo(A.x, yv); ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();
    return [bx0, by0, bx1, by1];
  }

  function rotulos(tm) {
    /* Solo en el capítulo que manda, y solo cuando está asentado: un rótulo
       nítido sobre una figura a medio formar delata que son dos capas. */
    var d = tw >= 0.5 ? iB : iA;
    if (d !== S_MENTE && d !== S_LUPA && d !== S_CURVA) return;
    var quieto = 1 - Math.sin(tw * 3.14159265);
    var ins = inside(d);
    if (quieto < 0.04) return;

    var fr = MARCO[d], mir = MIR[d], vol = VOLTEA[d];
    var ar = (fr.h * H) / (fr.w * W);
    var esc = Math.min(fr.w * W, fr.h * H);     // los rótulos escalan con la figura
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

    if (d === S_MENTE) {
      /* CON UNA CAJA ELEGIDA no hay plano: hay un objeto, y su nombre debajo.
         Un icono sin nombre obliga a adivinar, y adivinar no es leer. */
      if (selViva(tm)) {
        var ob = OBJ[OBJ_ORDEN[SEL.k]];
        if (ob) {
          var vida = (tm - SEL.t0) / SEL_MS;
          var alO = ease(cl(vida / 0.10)) * (1 - ease(cl((vida - 0.88) / 0.12)));
          /* ARRIBA, NO DEBAJO. Debajo de la figura no hay sitio: ahí
             empieza el título del capítulo siguiente, y el rótulo se le
             montaba encima. Encima de la figura el lienzo está vacío. */
          var cO = aPantalla(0.5, 0.095, fr, mir, vol);
          var tamO = Math.max(11, Math.round(esc * 0.040));
          var nomO = EN ? ob.en : ob.et;
          var pista = EN ? 'tap anywhere to go back' : 'pulsa fuera para volver al plano';
          ctx.font = '500 ' + tamO + 'px "JetBrains Mono", ui-monospace, monospace';
          var anO = ctx.measureText(nomO).width;
          ctx.font = '400 ' + Math.max(9, Math.round(tamO * 0.62)) + 'px "JetBrains Mono", ui-monospace, monospace';
          var anP = ctx.measureText(pista).width;
          var anchoO = Math.max(anO, anP);
          /* La plaquita cubre las DOS líneas de una vez: dos rectángulos
             pegados dejan una costura visible entre ellos. */
          ctx.fillStyle = 'rgba(5,7,14,' + (quieto * alO * 0.92).toFixed(3) + ')';
          ctx.fillRect(cO.x - anchoO / 2 - 10, cO.y - tamO * 0.85, anchoO + 20, tamO * 2.55);
          ctx.font = '500 ' + tamO + 'px "JetBrains Mono", ui-monospace, monospace';
          ctx.fillStyle = rgba(COL[C_LUZ], (quieto * alO * 0.92).toFixed(3));
          ctx.fillText(nomO, cO.x, cO.y);
          ctx.font = '400 ' + Math.max(9, Math.round(tamO * 0.62)) + 'px "JetBrains Mono", ui-monospace, monospace';
          ctx.fillStyle = rgba(COL[C_BRUMA], (quieto * alO * 0.62).toFixed(3));
          ctx.fillText(pista, cO.x, cO.y + tamO * 1.35);
        }
        return;
      }
      var gr = GR.plano, caen = ease(cl((ins - 0.10) / 0.34));
      var selP = -1, mejorP = 1e9;
      for (var mi = 0; mi < gr.m.length; mi++) {
        var mm = gr.m[mi];
        var ddx = (mm.cx - MFX) / ar, ddy = mm.cy - MFY;
        var dd2 = ddx * ddx + ddy * ddy;
        if (dd2 < mejorP) { mejorP = dd2; selP = mi; }
      }
      for (var k = 0; k < gr.m.length; k++) {
        var m = gr.m[k];
        var lleg = ease(cl((caen * (gr.m.length + 1.4) - k) / 1.6));
        if (lleg < 0.05) continue;
        var centro = k === 4;
        if (narrow && !centro) continue;      // ver la nota de arriba
        var sel = k === selP;
        var px2 = aPantalla(m.cx, m.cy, fr, mir, vol);
        var tam = Math.max(9, Math.round(esc * (centro ? (narrow ? 0.052 : 0.036) : 0.0225)));
        /* Si el nombre no cabe dentro de su caja, no se escribe: un rótulo
           que se sale de la pieza que nombra es peor que ninguno. */
        ctx.font = (centro ? '600 ' : '400 ') + tam + 'px "JetBrains Mono", ui-monospace, monospace';
        var anchoCaja = m.w * fr.w * W * 0.88;
        if (ctx.measureText(PLANO_ET[k]).width > anchoCaja) continue;
        /* Una plaquita del color del fondo debajo del texto. Las rutas del
           plano pasan por el centro de cada caja —que es donde va el
           nombre— y sin ella el rótulo sale tachado. En un plano de verdad
           el texto también interrumpe la línea que cruza por debajo. */
        var anT = ctx.measureText(PLANO_ET[k]).width;
        ctx.fillStyle = 'rgba(5,7,14,' + (quieto * lleg * 0.80).toFixed(3) + ')';
        ctx.fillRect(px2.x - anT / 2 - 5, px2.y - tam * 0.72, anT + 10, tam * 1.44);
        ctx.fillStyle = rgba(COL[centro ? C_LUZ : (sel ? C_LUZ : C_BRUMA)],
                             (quieto * lleg * (centro ? 0.92 : (sel ? 0.82 : 0.48))).toFixed(3));
        ctx.fillText(PLANO_ET[k], px2.x, px2.y);
        /* Sin pista de «pulsa un recuadro»: pulsar ya no abre nada. */
      }
      return;
    }

    if (d === S_CURVA) {
      /* LOS RÓTULOS DE LA GRÁFICA. La escala en el eje, los periodos debajo,
         la leyenda y el título. Es lo que separa unos palotes de una gráfica:
         sin cifras en el eje, un dibujo de barras no informa de nada. */
      var ejes = g3Ejes(ins, tm), al = quieto * ejes;
      if (al < 0.05) return;
      var NB = small ? 5 : narrow ? 6 : 7;
      var X0 = 0.115, XW = 0.845, Y0 = 0.855, PASO = XW / NB;
      var tamE = Math.max(9, Math.round(esc * 0.017));
      ctx.font = '400 ' + tamE + 'px "JetBrains Mono", ui-monospace, monospace';

      /* LA ESCALA. El tope es redondo a propósito: una escala que acaba en
         «47,3 k» delata que la ha puesto una máquina. */
      var TOPE = 40;
      ctx.textAlign = 'right';
      ctx.fillStyle = rgba(COL[C_BRUMA], (al * 0.62).toFixed(3));
      for (var e = 0; e <= 4; e++) {
        var pe = aPantalla(X0 - 0.035, Y0 - e * 0.185, fr, mir, vol);
        ctx.fillText(Math.round((TOPE / 4) * e) + (e === 4 ? ' k€' : ''), pe.x, pe.y);
      }

      /* LOS PERIODOS. Doce meses no caben en un móvil: se pintan los que
         hay barras, que son cinco, seis o siete según el ancho. */
      var MESES_ET = EN ? ['Q1','Q2','Q3','Q4','Q1','Q2','Q3']
                        : ['1T','2T','3T','4T','1T','2T','3T'];
      var ANYO = EN ? ['25','25','25','25','26','26','26'] : ['25','25','25','25','26','26','26'];
      ctx.textAlign = 'center';
      for (var k = 0; k < NB; k++) {
        var pk = aPantalla(X0 + (k + 0.5) * PASO, Y0 + 0.055, fr, mir, vol);
        ctx.fillStyle = rgba(COL[C_BRUMA], (al * 0.62).toFixed(3));
        ctx.fillText(MESES_ET[k] + ' ' + ANYO[k], pk.x, pk.y);
      }

      /* LA LEYENDA y el título de la serie. */
      var pt = aPantalla(X0 - 0.035, 0.055, fr, mir, vol);
      ctx.textAlign = 'left';
      ctx.font = '500 ' + Math.round(tamE * 1.15) + 'px "JetBrains Mono", ui-monospace, monospace';
      ctx.fillStyle = rgba(COL[C_LUZ], (al * 0.80).toFixed(3));
      var tit = EN ? 'WHAT THE SYSTEM HANDLES' : 'LO QUE PASA POR EL SISTEMA';
      ctx.fillText(tit, pt.x, pt.y);
      var anT = ctx.measureText(tit).width;
      /* La leyenda, a la derecha del título y en su misma línea. Debajo caía
         justo en la marca de arriba de la escala y se montaban las dos. */
      ctx.font = '400 ' + tamE + 'px "JetBrains Mono", ui-monospace, monospace';
      var lv = EN ? '\u25a0 volume' : '\u25a0 volumen';
      var lt = EN ? '\u2014 trend' : '\u2014 tendencia';
      ctx.fillStyle = rgba(COL[C_DATO], (al * 0.78).toFixed(3));
      ctx.fillText(lv, pt.x + anT + 22, pt.y);
      ctx.fillStyle = rgba(COL[C_OK], (al * 0.78).toFixed(3));
      ctx.fillText(lt, pt.x + anT + 22 + ctx.measureText(lv).width + 16, pt.y);
      ctx.textAlign = 'center';
      return;
    }

    /* LA LUPA. La lente se recalcula con la misma fórmula que la formación
       —no se guarda en ningún sitio compartido: es una función pura del
       puntero— y los apuntes se amplían igual que se amplían los registros,
       con el mismo factor y alrededor del mismo centro. Si se ampliaran de
       otra forma se notaría que el texto no pertenece al campo. */
    var nace = ease(cl(ins / 0.16));
    var vuelo = narrow ? 0.56 : 0.92;
    var lx = enc(0.5 + (MFX - 0.5) * vuelo, narrow ? 0.24 : 0.17, narrow ? 0.76 : 0.83);
    var ly = enc(0.5 + (MFY - 0.5) * vuelo, narrow ? 0.22 : 0.15, narrow ? 0.78 : 0.85);
    var R = (narrow ? 0.165 : 0.200) * (0.62 + 0.38 * nace);

    /* RECORTADO AL CRISTAL. Un apunte que se sale del aro delataría que el
       texto está pintado encima y no visto a través de la lente. Con el
       recorte, acercar la lente a un apunte lo va descubriendo por el borde,
       que es lo que hace una lupa. */
    var cen = aPantalla(lx, ly, fr, mir, vol);
    var cxp = cen.x, cyp = cen.y, rp = R * fr.h * H;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cxp, cyp, rp * 0.97, 0, 6.2831853);
    ctx.clip();

    for (var j = 0; j < LUPA_AP.length; j++) {
      var ap = LUPA_AP[j];
      var ax = 0.055 + ap.c * 0.89, ay = 0.055 + ap.f * 0.89;
      var dx = (ax - lx) / ar, dy = ay - ly;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > R * 1.35) continue;
      /* La AMPLIACIÓN usa la misma fórmula que los registros —si no, el
         texto viajaría distinto que las rayas que tiene al lado y se vería
         que está pintado encima—. La VISIBILIDAD, en cambio, tiene un
         alcance algo mayor: así el apunte ya asoma por el borde del cristal
         cuando la lente se acerca, en vez de aparecer de golpe. El recorte
         al aro se encarga de que nada se salga. */
      var dentro = dist < R ? 1 - (dist / R) * (dist / R) : 0;
      var mg = 1 + 0.86 * dentro;
      var p2 = aPantalla(lx + dx * mg * ar, ly + dy * mg, fr, mir, vol);
      var vis = cl(1 - dist / (R * 1.18));
      var al = quieto * nace * vis;
      if (al < 0.04) continue;
      var t1 = Math.max(10, Math.round(esc * (narrow ? 0.034 : 0.020) * (0.80 + 0.20 * dentro)));
      ctx.font = '500 ' + t1 + 'px "JetBrains Mono", ui-monospace, monospace';
      var an1 = ctx.measureText(ap.a).width;
      ctx.font = '400 ' + Math.max(8, Math.round(t1 * 0.80)) + 'px "JetBrains Mono", ui-monospace, monospace';
      var an2 = ctx.measureText(ap.b).width;
      var anMax = Math.max(an1, an2);
      /* LA CUERDA DEL CÍRCULO a la altura del apunte. Un texto centrado en el
         registro y recortado al aro se corta por la mitad cuando el registro
         está cerca del borde; midiendo la cuerda se sabe cuánto hay de
         cristal a esa altura y se empuja el texto hacia dentro. */
      var yA = p2.y - t1 * 0.62, yB = p2.y + t1 * 0.70;
      var dA = Math.abs(yA - cyp), dB = Math.abs(yB - cyp);
      var peor = Math.max(dA, dB);
      var semicuerda = peor < rp ? Math.sqrt(rp * rp - peor * peor) : 0;
      if (anMax > semicuerda * 2 - 28) continue;   // no cabe: mejor nada que media frase
      var xT = Math.max(cxp - semicuerda + anMax / 2 + 14,
                        Math.min(cxp + semicuerda - anMax / 2 - 14, p2.x));
      ctx.font = '500 ' + t1 + 'px "JetBrains Mono", ui-monospace, monospace';
      ctx.fillStyle = rgba(COL[C_LUZ], (al * 0.95).toFixed(3));
      ctx.fillText(ap.a, xT, yA);
      ctx.font = '400 ' + Math.max(8, Math.round(t1 * 0.80)) + 'px "JetBrains Mono", ui-monospace, monospace';
      ctx.fillStyle = rgba(COL[C_DEC], (al * 0.85).toFixed(3));
      ctx.fillText(ap.b, xT, yB);
    }
    ctx.restore();
  }


  /* ══════════════ PULSAR UNA CAJA DEL PLANO ══════════════
     El lienzo no recibe eventos: es un fondo detrás del texto, y hacerlo
     pulsable robaría los clics de los enlaces que tiene encima. Así que se
     escucha en la ventana y se filtra por dos condiciones: que el capítulo
     que manda sea el del plano, y que el clic caiga dentro del encuadre de
     la figura. Cualquier otra cosa sigue su camino. */
  function cajaEn(px, py) {
    var fr = MARCO[S_MENTE], mir = MIR[S_MENTE], vol = VOLTEA[S_MENTE];
    var cx = mir ? 1 - fr.x : fr.x;
    var nx = (px / W - cx) / fr.w + 0.5;
    if (mir && vol) nx = 1 - nx;
    var ny = (py / H - fr.y) / fr.h + 0.5;
    if (nx < -0.04 || nx > 1.04 || ny < -0.04 || ny > 1.04) return -1;
    var gr = GR.plano, mejor = -1, dist = 1e9;
    for (var i = 0; i < gr.m.length; i++) {
      var m = gr.m[i];
      /* Dentro de la caja gana siempre; si no, la más cercana, para que un
         clic entre dos cajas no se pierda. */
      if (nx >= m.x && nx <= m.x + m.w && ny >= m.y && ny <= m.y + m.h) return i;
      var dx = nx - m.cx, dy = ny - m.cy, d = dx * dx + dy * dy;
      if (d < dist) { dist = d; mejor = i; }
    }
    return dist < 0.04 ? mejor : -1;
  }
  /* El nombre de la figura elegida, legible desde fuera: lo usan las
     pruebas automaticas para comprobar que cada caja abre la suya. */
  function pulsaPlano(px, py) {
    var dom = tw >= 0.5 ? iB : iA;
    if (dom !== S_MENTE) return;
    var tm = performance.now();
    var k = cajaEn(px, py);
    if (k < 0) {
      /* MEDIDO en su navegador: al pulsar FUERA la figura se quedaba puesta
         hasta que se cansaba de esperar. Pulsar fuera es la forma universal
         de decir «ya está», y ahora vuelve al plano en el momento. */
      if (selViva(tm)) { SEL = { k: -1, t0: -1e9 }; window.__figura = null; }
      return;
    }
    /* Pulsar la misma otra vez la cierra: es lo que espera cualquiera. */
    SEL = (SEL.k === k && selViva(tm)) ? { k: -1, t0: -1e9 } : { k: k, t0: tm };
    window.__figura = SEL.k >= 0 ? OBJ_ORDEN[SEL.k] : null;
  }
  /* PULSAR YA NO ABRE NADA. Cada caja del plano abría una figura nueva a
     pantalla de la sección, y eso es lo que se ha pedido quitar: el plano se
     queda interactivo —la caja que tienes debajo del puntero se enciende y
     su nombre se aclara, y el resto sigue al ratón— pero no cambia de
     dibujo al pulsar. `pulsaPlano` se conserva por si se quiere volver a
     encender; no está conectado a nada. */
  window.__figura = null;
  /* Y con el teclado, como cualquier otra cosa que se abre. */
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && selViva(performance.now())) SEL = { k: -1, t0: -1e9 };
  }, { passive: true });

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
