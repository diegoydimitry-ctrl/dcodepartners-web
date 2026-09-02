/* ============================================================================
   D-CODE PARTNERS — LA MISMA MATERIA (portada)
   ----------------------------------------------------------------------------
   UNA SOLA NUBE DE PARTÍCULAS DURANTE TODO EL RECORRIDO.

   No hay escenas. No hay un gráfico por sección. Existe un único conjunto de
   partículas — las mismas, con la misma identidad — y lo que cambia es la
   FORMACIÓN hacia la que cada una viaja. La partícula 412 es la partícula 412
   en los nueve estados: la ves desplazarse de una estructura a la siguiente.

   Cada formación sale de lo que dice el texto que la acompaña, no al revés:

     0 TERRENO    «Miramos cómo trabajas de verdad» — curvas de nivel sobre el
                  terreno y un barrido de atención que las va leyendo.
     1 SIN SISTEMA «Persigo cobros · se me escapan · lo mismo en tres sitios» —
                  trayectos que se cruzan mal, tres de ellos calcados con
                  desfase, y otros que se apagan sin llegar a ninguna parte.
     2 REPETICIÓN «Aparecen los trayectos que se repiten» — el mismo motivo
                  exacto aparece en varios puntos del campo. Lo que se repite
                  se ve porque es idéntico; lo que no llevaba a nada se apaga.
     3 PERTENENCIA «Cada cosa deja de estar suelta y pasa a pertenecer a una
                  parte» — las partículas emigran y se recogen dentro de una
                  región cerrada. Ya no se enlazan con todo: solo con los suyos.
     4 ARMAZÓN    «Se levanta la estructura y se tiende la instalación por
                  encima» — las partículas se ALINEAN sobre montantes, vigas y
                  diagonales: la celosía está hecha de ellas. Se monta de abajo
                  arriba, y solo después se tiende por encima lo que circula.
     5 CIRCULACIÓN «Circula con origen y destino, hace cola donde toca y sale.
                  Y lo que circula se puede contar» — avanzan por carriles, se
                  acumulan en la estación, salen, y el recuento sube.
     6 MÓDULOS    «Piezas que ya existen. Y las que falten» — se agrupan en
                  módulos con conectores, y un hueco queda vacío hasta que se
                  puebla: la pieza que falta se construye.
     7 RÉGIMEN    «Un sistema financiero completo» — anillos concéntricos con
                  paso constante. Ya no se construye: opera, y se lee.
     8 UN SISTEMA «Empecemos» — todo converge en un solo cuerpo enlazado.

   La transición nunca corta: se mezcla siempre entre dos formaciones vecinas,
   y cada partícula sale hacia la siguiente en un instante ligeramente distinto,
   de modo que la reorganización se percibe como una ola y no como un salto.
   ========================================================================= */
(function () {
  'use strict';

  var root = document.querySelector('[data-field]');
  if (!root) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse  = window.matchMedia('(pointer: coarse)').matches;

  var STEEL = [150, 178, 226];
  var HUE = [
    [128, 222, 234], [ 91, 140, 255], [124, 108, 255],
    [167, 139, 250], [255, 107, 157], [ 45, 212, 191]
  ];
  function rgba(h, a) { return 'rgba(' + h[0] + ',' + h[1] + ',' + h[2] + ',' + a + ')'; }
  function sd(i, s) { var x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }
  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }

  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  root.appendChild(canvas);
  var ctx = canvas.getContext('2d', { alpha: false });

  var W = 0, H = 0, dpr = 1, narrow = false, small = false;
  var N = 0, PT = [], MEM = [], BEAMS = [], SPR = [];

  /* Un destello pre-dibujado por color. Crear un gradiente por partícula y por
     fotograma cuesta el doble de lo que cuesta pintarlas todas. */
  function sprites() {
    SPR = [];
    var all = HUE.concat([STEEL, [226, 240, 255]]);
    for (var i = 0; i < all.length; i++) {
      var s = document.createElement('canvas'), R = 32;
      s.width = s.height = R * 2;
      var g = s.getContext('2d');
      var gr = g.createRadialGradient(R, R, 0, R, R, R);
      gr.addColorStop(0,    rgba(all[i], 1));
      gr.addColorStop(0.22, rgba(all[i], 0.55));
      gr.addColorStop(0.55, rgba(all[i], 0.13));
      gr.addColorStop(1,    rgba(all[i], 0));
      g.fillStyle = gr; g.fillRect(0, 0, R * 2, R * 2);
      SPR.push(s);
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
    N = small ? 360 : narrow ? 620 : 1000;
    PT = [];
    for (var i = 0; i < N; i++) {
      var r = sd(i, 1), r2 = sd(i, 2), r3 = sd(i, 3);
      /* El acero domina; el color es minoría y por eso significa algo. */
      var hi = r3 < 0.62 ? 6 : (r3 < 0.72 ? 0 : (r3 < 0.80 ? 1 : (r3 < 0.87 ? 2 :
               (r3 < 0.93 ? 3 : (r3 < 0.975 ? 5 : 4)))));
      PT.push({
        h: hi,                       // índice en SPR
        z: 0.35 + r * 0.65,          // profundidad
        s: 0.7 + r2 * 0.9,           // tamaño base
        ph: r * 6.2832,              // fase propia
        dl: r2 * 0.34,               // retardo: la reorganización es una ola
        vx: 0, vy: 0, x: -1, y: 0
      });
    }
    /* La celosía del estado 4: montantes, vigas y diagonales reales. */
    MEM = []; BEAMS = [];
    var x0 = narrow ? W * 0.10 : W * 0.50, x1 = narrow ? W * 0.90 : W * 0.93;
    var yb = H * 0.86, yt = H * 0.20, bays = narrow ? 3 : 4, lv = 3;
    var bw = (x1 - x0) / bays, lh = (yb - yt) / lv;
    var c, l;
    for (c = 0; c <= bays; c++) {                     // montantes
      var mx0 = x0 + c * bw;
      MEM.push({ ax: mx0, ay: yb, bx: mx0, by: yt, t: 0 });
    }
    for (l = 0; l <= lv; l++) {                       // vigas
      var my = yb - l * lh;
      BEAMS.push(MEM.length);
      MEM.push({ ax: x0, ay: my, bx: x1, by: my, t: l / lv });
    }
    for (l = 0; l < lv; l++) {                        // diagonales
      for (c = 0; c < bays; c++) {
        var dy0 = yb - l * lh, dy1 = yb - (l + 1) * lh;
        var f = (l + c) % 2 === 0;
        MEM.push({ ax: x0 + c * bw, ay: f ? dy0 : dy1,
                   bx: x0 + (c + 1) * bw, by: f ? dy1 : dy0, t: l / lv });
      }
    }
    sprites();
  }

  /* --------------------------------------------------------- FORMACIONES */
  /* Cada una escribe en o.x, o.y, o.a (presencia) y o.g (grupo, para el
     enlace). El grupo es lo que hace que la estructura EMANE de las propias
     partículas: dos partículas consecutivas del mismo grupo se unen. */

  var TAU = 6.2832;

  function F0(i, u, g, G, o, tm, ins) {              // TERRENO
    /* «Analizamos tu empresa. Construimos su sistema.» El titular dice dos
       cosas, así que la portada hace las dos: un barrido recorre el terreno
       y, justo a su paso, la materia se ORDENA en retícula un instante antes
       de volver a relajarse. Se ve analizar y se ve construir. */
    var y = H * (0.14 + (g / (G - 1)) * 0.74);
    var x = W * (0.02 + u * 0.96);
    var ty = y + Math.sin(u * 5.2 + g * 0.8) * H * 0.048
               + Math.sin(u * 11.0 + g * 1.7) * H * 0.015;

    var sw = ((tm * 0.00010) % 1.5) - 0.26;
    var d = u - sw;                          // >0 sin leer todavía
    var tras  = clamp01(-d / 0.20);          // justo detrás del barrido
    var suelt = clamp01((-d - 0.20) / 0.34); // y después se suelta otra vez
    var orden = tras * (1 - suelt);

    var cel = W * 0.052;
    o.x = lerp(x,  Math.round(x  / cel) * cel, orden);
    o.y = lerp(ty, Math.round(ty / (cel * 0.62)) * (cel * 0.62), orden);
    /* El frente del barrido es lo más brillante del recorrido. */
    o.a = 0.30 + 0.70 * Math.exp(-d * d * 42) + 0.46 * orden
              + 0.12 * Math.sin(u * 7 + g);
    o.g = g;
  }

  function F1(i, u, g, G, o, tm, ins) {              // SIN SISTEMA
    /* Tres trayectos calcados con desfase: «lo mismo, en tres sitios». */
    var dup = (g % 7 === 3);
    var src = dup ? 3 : g;
    var off = dup ? ((g / 7) | 0) * 16 : 0;
    var a1 = sd(src, 11) * TAU, a2 = sd(src, 12) * TAU;
    var sx = W * (0.05 + sd(src, 13) * 0.9), sy = H * (0.10 + sd(src, 14) * 0.8);
    var ex = W * (0.05 + sd(src, 15) * 0.9), ey = H * (0.10 + sd(src, 16) * 0.8);
    var cx = (sx + ex) / 2 + Math.cos(a1) * W * 0.26;
    var cy = (sy + ey) / 2 + Math.sin(a2) * H * 0.26;
    /* Los que no llevan a ninguna parte se detienen y se apagan. */
    var dead = (src % 5 === 2);
    var uu = dead ? Math.min(u, 0.52) : u;
    var m = 1 - uu;
    o.x = m * m * sx + 2 * m * uu * cx + uu * uu * ex + off;
    o.y = m * m * sy + 2 * m * uu * cy + uu * uu * ey + off * 0.5;
    o.a = dead ? (u > 0.52 ? 0.05 : 0.50) : 0.46 + 0.24 * Math.sin(u * 9 + tm * 0.0012 + g);
    o.g = g;
  }

  function F2(i, u, g, G, o, tm, ins) {              // REPETICIÓN
    /* El MISMO motivo, exacto, en varios puntos: eso es el patrón. */
    var cols = narrow ? 2 : 3, rows = 2;
    var slot = g % (cols * rows);
    var cxx = W * (narrow ? 0.10 : 0.50) + (slot % cols) * W * (narrow ? 0.40 : 0.155);
    var cyy = H * 0.26 + ((slot / cols) | 0) * H * 0.34;
    var sw = W * (narrow ? 0.32 : 0.125), sh = H * 0.20;
    /* motivo idéntico para todos los repetidos */
    var mo = Math.sin(u * TAU * 1.5), mv = Math.sin(u * TAU * 0.5);
    var rep = g < G * 0.72;
    if (rep) {
      o.x = cxx + u * sw;
      o.y = cyy + mo * sh * 0.30 + mv * sh * 0.10;
      /* Los repetidos se afirman a la vez: ahí está. */
      o.a = 0.30 + 0.62 * ease((ins - 0.15) / 0.5);
      o.g = 100 + slot;
    } else {
      /* Los que no llevaban a nada siguen sueltos y se apagan. */
      F1(i, u, g, G, o, tm, ins);
      o.a *= 0.22 * (1 - ease(ins));
      o.g = -1;
    }
  }

  function F3(i, u, g, G, o, tm, ins) {              // PERTENENCIA
    /* Los bloques son CONTIGUOS por índice: cada parte es un cuerpo, no
       partículas alternas. Si el grupo salta, nada parece pertenecer a nada. */
    var K = narrow ? 3 : 4;
    var per = N / K;
    var k = Math.min(K - 1, (i / per) | 0);
    var j = i - k * per;                       // posición dentro de su parte
    var cols = narrow ? 6 : 7, rows = Math.ceil(per / cols);
    var bw = W * (narrow ? 0.25 : 0.098), bh = H * 0.42;
    var bx = W * (narrow ? 0.11 : 0.50) + k * W * (narrow ? 0.27 : 0.112);
    var by = H * 0.27;
    /* Emigran una a una: las últimas de cada parte todavía están llegando. */
    var arr = ease((ins - 0.10 - (j / per) * 0.42) / 0.30);
    var cx2 = bx + bw / 2, cy2 = by + bh / 2;
    var tx2 = bx + ((j % cols) + 0.5) * (bw / cols);
    var ty2 = by + ((((j / cols) | 0) % rows) + 0.5) * (bh / rows);
    o.x = lerp(cx2 + Math.cos(i * 2.4) * W * 0.16, tx2, arr)
        + Math.sin(tm * 0.0006 + i) * 1.1;
    o.y = lerp(cy2 + Math.sin(i * 3.1) * H * 0.22, ty2, arr)
        + Math.cos(tm * 0.0006 + i) * 1.1;
    o.a = 0.30 + 0.52 * arr;
    o.g = arr > 0.6 ? 200 + k : -1;            // solo enlaza cuando ya pertenece
  }

  function F4(i, u, g, G, o, tm, ins) {              // ARMAZÓN
    var m = MEM[g % MEM.length];
    /* Se monta de abajo arriba: cada pieza aparece cuando le toca. */
    var raise = ease((ins - m.t * 0.42) / 0.34);
    var x = lerp(m.ax, m.bx, u), y = lerp(m.ay, m.by, u);
    /* La instalación se tiende DESPUÉS, y por encima del acero. */
    var over = (g % 9 === 4);
    if (over) {
      /* El tendido va por encima de las vigas, en horizontal. Una instalación
         no serpentea: sigue el recorrido que le deja la estructura. */
      var bm = MEM[BEAMS[g % BEAMS.length]];
      var lay = ease((ins - 0.52) / 0.40);
      o.x = lerp(bm.ax, bm.bx, u);
      o.y = bm.ay - 9 - 4 * lay;
      o.a = 0.66 * lay;
      o.g = 400 + (g % BEAMS.length);
    } else {
      /* Antes de asentar, la partícula todavía flota cerca de su sitio. */
      var w2 = 1 - raise;
      o.x = x + Math.sin(i * 1.7 + tm * 0.0008) * 26 * w2;
      o.y = y + Math.cos(i * 2.3 + tm * 0.0008) * 26 * w2;
      o.a = 0.24 + 0.66 * raise;
      o.g = 300 + (g % MEM.length);
    }
  }

  function F5(i, u, g, G, o, tm, ins) {              // CIRCULACIÓN
    var L = narrow ? 3 : 4;
    var lane = g % L;
    var ly = H * (0.28 + lane * (narrow ? 0.16 : 0.13));
    var x0 = W * (narrow ? 0.06 : 0.46), x1 = W * 0.96;
    var st = x0 + (x1 - x0) * 0.52;                 // la estación
    /* Avanza con el tiempo, hace cola en la estación y sale. */
    var t = (u + tm * 0.000045 + lane * 0.13) % 1;
    var x, hold = 0.30;
    if (t < 0.46) x = lerp(x0, st, t / 0.46);
    else if (t < 0.46 + hold) {                      // la cola: se acumula
      var q = (t - 0.46) / hold;
      x = st - (1 - q) * 26 * ((i % 7) + 1) * 0.5;
    } else x = lerp(st, x1, (t - 0.46 - hold) / (1 - 0.46 - hold));
    o.x = x;
    o.y = ly + Math.sin(t * TAU + i) * 3.0;
    /* Solo va encendido lo que está circulando de verdad. */
    o.a = 0.16 + 0.74 * Math.pow(Math.abs(Math.sin(u * 9.0 + lane)), 3);
    o.g = -1;                                        // aquí no se enlaza: circula
  }

  function F6(i, u, g, G, o, tm, ins) {              // MÓDULOS
    /* Esta sección lleva una lista larga de capacidades: el instrumento se
       retira a su propia columna en vez de pisarla. */
    var cols = narrow ? 3 : 1, rows = narrow ? 4 : 6, S = cols * rows;
    var k = g % S;
    var mw = W * (narrow ? 0.26 : 0.088), mh = H * (narrow ? 0.15 : 0.108);
    var gx = W * (narrow ? 0.08 : 0.876) + (k % cols) * W * (narrow ? 0.29 : 0);
    var gy = H * (narrow ? 0.20 : 0.13) + ((k / cols) | 0) * H * (narrow ? 0.21 : 0.140);
    /* El hueco que falta: se puebla al final. «Y las que falten.» */
    var missing = (k === S - 2);
    var fill = missing ? ease((ins - 0.55) / 0.4) : 1;
    /* Perímetro del módulo + dos conectores: son piezas conectables. */
    var p = u * 4;
    var e = p | 0, f = p - e;
    var px, py;
    if (e === 0)      { px = gx + f * mw;       py = gy; }
    else if (e === 1) { px = gx + mw;           py = gy + f * mh; }
    else if (e === 2) { px = gx + (1 - f) * mw; py = gy + mh; }
    else              { px = gx;                py = gy + (1 - f) * mh; }
    o.x = px; o.y = py;
    o.a = (0.24 + 0.60 * Math.abs(Math.sin(u * 3 + tm * 0.0007 + k))) * fill;
    o.g = 500 + k;
  }

  function F7(i, u, g, G, o, tm, ins) {              // RÉGIMEN
    var R = 5, ring = g % R;
    var cx = narrow ? W * 0.5 : W * 0.72, cy = narrow ? H * 0.44 : H * 0.48;
    var rad = Math.min(W, H) * (0.10 + ring * 0.055);
    /* Paso constante y sentidos alternos: precisión, no agitación. */
    var sp = (ring % 2 ? -1 : 1) * (0.00010 + ring * 0.000018);
    var a = u * TAU + tm * sp + ring;
    o.x = cx + Math.cos(a) * rad;
    o.y = cy + Math.sin(a) * rad * 0.82;
    o.a = 0.34 + 0.44 * (0.5 + 0.5 * Math.sin(a * 3));
    o.g = 600 + ring;
  }

  function F8(i, u, g, G, o, tm, ins) {              // UN SISTEMA
    /* El cierre va centrado, así que la envolvente lo rodea: el titular
       queda DENTRO del sistema, no encima de él. */
    var cx = W * 0.5, cy = H * 0.46;
    var rr = Math.min(W, H) * (narrow ? 0.46 : 0.58);
    /* Una esfera de puntos: el conjunto, por fin, es un solo cuerpo. */
    var ph = Math.acos(1 - 2 * ((i + 0.5) / N));
    var th = 3.8833 * (i + 0.5);
    var sp2 = tm * 0.00006;
    var sx = Math.sin(ph) * Math.cos(th + sp2), sy = Math.cos(ph);
    var sz = Math.sin(ph) * Math.sin(th + sp2);
    o.x = cx + sx * rr;
    o.y = cy + sy * rr * 0.9;
    /* Una envolvente, no una bola maciza: el brillo se concentra en el canto
       del cuerpo y el centro queda despejado — que es justo donde va el
       titular del cierre. Un sistema se reconoce por su contorno. */
    var canto = sx * sx + sy * sy;
    o.a = (0.06 + 0.92 * Math.pow(canto, 2.6)) * (0.55 + 0.45 * (0.5 + sz * 0.5));
    o.g = canto > 0.55 ? 700 + (g % 12) : -1;
  }

  var FORM = [F0, F1, F2, F3, F4, F5, F6, F7, F8];
  var GRPS = [22, 28, 24, 24, 0, 24, 24, 20, 24];   // 0 = usar MEM.length

  /* ------------------------------------------------ ESTADOS (por índice) */
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
      var mid = r.top + window.scrollY + r.height / 2 - window.innerHeight / 2;
      found[n] = Math.max(0, Math.min(1, mid / max));
      /* Si el texto va a la derecha, la formación se refleja a la izquierda. */
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
    var t = (P - STOPS[i]) / Math.max(0.0001, STOPS[i + 1] - STOPS[i]);
    t = Math.max(0, Math.min(1, t));
    iA = i; iB = i + 1; tw = t;
    var e = ease(t); wA = 1 - e; wB = e;
  }
  function inside(n) {
    var a = STOPS[Math.max(0, n - 1)], b = STOPS[Math.min(NST - 1, n + 1)];
    return ease((Pv - a) / Math.max(0.0001, b - a));
  }

  /* ------------------------------------------------------------- PUNTERO */
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
    var max = Math.max(1, d.scrollHeight - window.innerHeight);
    P = Math.max(0, Math.min(1, window.scrollY / max));
  }
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { readScroll(); ticking = false; if (reduced) drawStill(); });
  }, { passive: true });

  /* ---------------------------------------------------------------- PINTA */
  var oa = { x: 0, y: 0, a: 1, g: -1 }, ob = { x: 0, y: 0, a: 1, g: -1 };
  var px = new Float32Array(4000), py = new Float32Array(4000);
  var pg = new Int32Array(4000), pa = new Float32Array(4000);

  function draw(tm, noClear) {
    weights(reduced ? P : Pv);
    cmx += (mx - cmx) * 0.05; cmy += (my - cmy) * 0.05;

    /* Estela corta: la materia deja rastro, y por eso parece viva. */
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = noClear ? 'rgba(5,7,14,0.10)' : 'rgba(5,7,14,0.36)';
    ctx.fillRect(0, 0, W, H);

    var FA = FORM[iA], FB = FORM[iB];
    var GA = GRPS[iA] || MEM.length, GB = GRPS[iB] || MEM.length;
    var insA = inside(iA), insB = inside(iB);
    var par = narrow ? 0 : 1;

    ctx.globalCompositeOperation = 'lighter';

    for (var i = 0; i < N; i++) {
      var p = PT[i];
      var ga = (i * GA / N) | 0, ua = (i * GA / N) - ga;
      var gb = (i * GB / N) | 0, ub = (i * GB / N) - gb;
      FA(i, ua, ga, GA, oa, tm, insA);
      FB(i, ub, gb, GB, ob, tm, insB);
      if (MIR[iA]) oa.x = W - oa.x;
      if (MIR[iB]) ob.x = W - ob.x;

      /* La ola: cada partícula sale hacia la formación siguiente en su
         propio instante. Sin esto la transición es un salto colectivo. */
      var t = clamp01((tw - p.dl) / (1 - p.dl));
      t = t * t * (3 - 2 * t);

      var tx = lerp(oa.x, ob.x, t), ty = lerp(oa.y, ob.y, t);
      var al = lerp(oa.a, ob.a, t);

      /* Inercia: la partícula persigue su objetivo, no se teletransporta. */
      if (p.x < 0) { p.x = tx; p.y = ty; }
      p.vx += (tx - p.x) * 0.10; p.vy += (ty - p.y) * 0.10;
      p.vx *= 0.74; p.vy *= 0.74;
      p.x += p.vx; p.y += p.vy;

      var dx = p.x + cmx * 26 * p.z * par;
      var dy = p.y + cmy * 18 * p.z * par;
      px[i] = dx; py[i] = dy; pa[i] = al;
      pg[i] = (t < 0.5) ? oa.g : ob.g;

      /* Velocidad = estiramiento. Lo que viaja rápido se ve viajar. */
      var sp = Math.min(1.15, Math.sqrt(p.vx * p.vx + p.vy * p.vy) * 0.22);
      var r = (1.9 + p.s * 3.1) * p.z * (1 + sp);
      var a2 = al * (0.42 + p.z * 0.66);
      if (a2 <= 0.012) continue;
      ctx.globalAlpha = Math.min(0.72, a2);
      ctx.drawImage(SPR[p.h], dx - r, dy - r, r * 2, r * 2);
    }

    /* El enlace no es decoración: une partículas del MISMO grupo, así que la
       estructura la dibujan ellas. Un carril en circulación no se enlaza. */
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;
    var link = 0.5 - 0.42 * Math.abs(tw - 0.5) * 2;   // se afloja al transitar
    ctx.beginPath();
    for (var k = 1; k < N; k++) {
      if (pg[k] < 0 || pg[k] !== pg[k - 1]) continue;
      var ddx = px[k] - px[k - 1], ddy = py[k] - py[k - 1];
      if (ddx * ddx + ddy * ddy > 26000) continue;
      ctx.moveTo(px[k - 1], py[k - 1]); ctx.lineTo(px[k], py[k]);
    }
    ctx.strokeStyle = rgba(STEEL, 0.05 + 0.15 * link);
    ctx.stroke();

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  /* ---------------------------------------------------------------- BUCLE */
  var running = false, visible = true;
  function loop(tm) {
    if (!running) return;
    Pv += (P - Pv) * 0.075;
    draw(tm);
    if (visible) requestAnimationFrame(loop); else running = false;
  }
  function start() { if (!running && !reduced) { running = true; requestAnimationFrame(loop); } }
  /* Movimiento reducido: una exposición larga, quieta. */
  function drawStill() {
    for (var i = 0; i < N; i++) PT[i].x = -1;
    draw(0, false);
    for (var j = 1; j < 46; j++) draw(j * 120, true);
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

  /* --------------------------------- EL ESTADO, EN PALABRAS -------------- */
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
