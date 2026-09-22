/* ============================================================================
   D-CODE PARTNERS — TEMA  ·  oscuro ↔ claro, con cambio de dimensión
   ----------------------------------------------------------------------------
   1. El tema vive en <html data-theme="dark|light">. Lo pone un script de
      tres líneas en el <head> ANTES de pintar (sin destello) leyendo
      localStorage('dcp-tema'). Sin elección guardada, oscuro: es la identidad
      de la marca. Este fichero solo gestiona el botón y el cambio.
   2. El cambio no es un fundido. La página actual se va absorbida hacia la
      IZQUIERDA y la nueva entra desde la DERECHA, con una costura de luz que
      las separa. Se hace con View Transitions: el navegador hace dos fotos
      (antes y después) y las anima en la GPU; no se mueve el DOM real, así
      que no hay reflujo ni coste por elemento.
   3. Sin View Transitions, un barrido de espacio cubre la pantalla, el tema
      cambia debajo y el barrido sigue hacia la izquierda. Con movimiento
      reducido, cambio inmediato.
   4. Parallax del cielo (galaxia.css): cada capa se desplaza con el scroll a
      su propia velocidad. Solo transform, en un rAF, y nada si el usuario
      pide movimiento reducido.
   5. Cielo ligero: tras la carga se miden ~1,2 s de fotogramas con la página
      a la vista. Si el equipo no sostiene el cielo animado (uno de cada
      cuatro fotogramas o más tarda más de 22 ms: típico sin aceleración
      gráfica), el cielo se queda quieto (html.gx-ligero): mismas estrellas,
      sin deriva ni parallax, y en claro el campo de partículas deja de
      multiplicarse con el cielo. Medidas en el informe de rendimiento.
   ========================================================================= */
(function () {
  'use strict';
  var D = document, R = D.documentElement, W = window;
  var CLAVE = 'dcp-tema';
  var EN = (R.getAttribute('lang') || '').slice(0, 2) === 'en';
  var TXT = EN
    ? { aClaro: 'Switch to light mode', aOscuro: 'Switch to dark mode' }
    : { aClaro: 'Cambiar a modo claro', aOscuro: 'Cambiar a modo oscuro' };
  var mqReducido = W.matchMedia('(prefers-reduced-motion: reduce)');

  function actual() { return R.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
  function guardar(t) { try { W.localStorage.setItem(CLAVE, t); } catch (e) { /* modo privado: solo esta página */ } }

  var boton = D.querySelector('[data-tema-btn]');
  function pintarBoton() {
    if (!boton) return;
    var t = actual();
    boton.setAttribute('aria-label', t === 'dark' ? TXT.aClaro : TXT.aOscuro);
  }
  function metaColor() {
    var m = D.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', actual() === 'light' ? '#f3f5fb' : '#06080d');
  }
  function aplicar(t) {
    // Sin transiciones de color durante el cambio: cientos de elementos
    // animando su color a la vez ensucian la foto nueva y cuestan CPU.
    R.classList.add('tema-cambiando');
    R.setAttribute('data-theme', t);
    W.requestAnimationFrame(function () { W.requestAnimationFrame(function () { if (!enCurso) R.classList.remove('tema-cambiando'); }); });
    guardar(t);
    pintarBoton();
    metaColor();
    try { D.dispatchEvent(new CustomEvent('dcp:tema', { detail: { tema: t } })); } catch (e) {}
  }

  /* ---------------------------------------------------- la transición */
  var enCurso = false;
  function portal() {
    var p = D.createElement('div');
    p.className = 'tema-portal';
    p.setAttribute('aria-hidden', 'true');
    D.body.appendChild(p);
    return p;
  }
  function barrido(nuevo, fin) {
    // Plan B sin View Transitions: una franja de espacio cruza de derecha a
    // izquierda; el tema cambia cuando cubre la pantalla.
    var b = D.createElement('div');
    b.className = 'tema-barrido';
    b.setAttribute('aria-hidden', 'true');
    D.body.appendChild(b);
    b.getBoundingClientRect();
    b.classList.add('is-entra');
    setTimeout(function () {
      aplicar(nuevo);
      b.classList.add('is-sale');
      setTimeout(function () { b.remove(); fin(); }, 460);
    }, 380);
  }
  /* LAS PIEZAS. Lo que se ve en pantalla se parte en piezas (bloques
     medianos: párrafos, botones, tarjetas, paneles; y los titulares, línea
     a línea). Cada una recibe un view-transition-name y el navegador hace
     dos fotos suyas —antes y después—; se animan con la Web Animations API,
     solo transform y opacity. Nada del DOM real se mueve. */
  var NO = /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|BR|WBR)$/;
  function partir() {
    var vw = W.innerWidth, vh = W.innerHeight, max = vw < 768 ? 26 : 44, maxArea = vw * vh * (vw < 768 ? 0.42 : 0.3);
    var piezas = [], palabras = [];
    function visible(r) { return r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw && r.width > 3 && r.height > 3; }
    function titular(h) {
      // Un titular se parte por sus líneas (los span que ya tiene): sin tocar
      // el DOM, así que su maquetación no cambia. Si mezcla texto suelto con
      // spans, o una línea ocupa dos renglones, va entero.
      var hijos = [].slice.call(h.children), suelto = false;
      for (var n = h.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && n.nodeValue.trim()) suelto = true;
      if (!suelto && hijos.length > 1 && hijos.every(function (x) { return x.getClientRects().length === 1 && getComputedStyle(x).display !== 'inline'; })) {
        hijos.forEach(function (x) { palabras.push(x); });
      } else piezas.push(h);
    }
    function recorrer(e) {
      for (var c = e.firstElementChild; c; c = c.nextElementSibling) {
        if (NO.test(c.tagName) || c.classList.contains('gx') || c.classList.contains('field') || c.classList.contains('tema-portal')) continue;
        var cs = getComputedStyle(c);
        if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) continue;
        if (cs.display === 'contents') { recorrer(c); continue; }
        var r = c.getBoundingClientRect();
        if (!visible(r)) { if (!r.width || !r.height) recorrer(c); continue; }
        var area = r.width * r.height;
        if (/^H[12]$/.test(c.tagName) && area < maxArea && (c.textContent || '').split(/\s+/).length <= 14) { titular(c); continue; }
        if (area > maxArea || (cs.display === 'inline' && c.getClientRects().length > 1)) { recorrer(c); continue; }
        if (cs.display === 'inline') continue;
        if (area >= 240) piezas.push(c);
      }
    }
    recorrer(D.body);
    var todas = palabras.map(function (w) { return { el: w, r: w.getBoundingClientRect() }; })
      .concat(piezas.map(function (p) { return { el: p, r: p.getBoundingClientRect() }; }));
    if (todas.length > max) {
      // se quedan las palabras y las piezas más grandes; el resto viaja con el fondo
      var pal = todas.slice(0, palabras.length).slice(0, Math.min(palabras.length, 16));
      var res = todas.slice(palabras.length).sort(function (a, b) { return b.r.width * b.r.height - a.r.width * a.r.height; }).slice(0, max - pal.length);
      todas = pal.concat(res);
    }
    todas.forEach(function (p, k) { p.el.style.viewTransitionName = 'tp-' + k; p.n = 'tp-' + k; });
    return { piezas: todas, palabras: palabras, vw: vw, vh: vh };
  }
  function recomponer(P) {
    P.piezas.forEach(function (p) { p.el.style.viewTransitionName = ''; });
  }
  function animarPiezas(P) {
    var vw = P.vw, vh = P.vh, sem = 11;
    var rnd = function () { sem = (sem * 16807) % 2147483647; return sem / 2147483647; };
    var el = D.documentElement;
    P.piezas.forEach(function (p) {
      var r = p.r, cx = r.left + r.width / 2, cy = r.top + r.height / 2, fx = Math.max(0, Math.min(1, r.left / vw));
      var giro = (rnd() - 0.5) * 50, caida = 18 + rnd() * 26;
      // la vieja: se desprende (cae y gira un poco) y es aspirada a la izquierda
      el.animate([
        { transform: 'none', opacity: 1, offset: 0 },
        { transform: 'translate(' + (-6 - rnd() * 10).toFixed(0) + 'px,' + caida.toFixed(0) + 'px) rotate(' + (giro * 0.25).toFixed(1) + 'deg)', opacity: 1, offset: 0.22 },
        { transform: 'translate(' + (-(cx + r.width / 2 + 60 + rnd() * 140)).toFixed(0) + 'px,' + ((vh / 2 - cy) * 0.55 + caida * 2).toFixed(0) + 'px) rotate(' + giro.toFixed(1) + 'deg) scale(.3)', opacity: 0, offset: 1 }
      ], { pseudoElement: '::view-transition-old(' + p.n + ')', duration: 560, delay: fx * 170 + rnd() * 70, easing: 'cubic-bezier(.5,0,.85,.4)', fill: 'both' });
      // la nueva: llega desde la derecha y se monta en su sitio
      el.animate([
        { transform: 'translate(' + (vw - r.left + 40 + rnd() * 160).toFixed(0) + 'px,' + ((rnd() - 0.5) * 70).toFixed(0) + 'px) rotate(' + (-giro * 0.4).toFixed(1) + 'deg) scale(.86)', opacity: 0 },
        { opacity: 1, offset: 0.35 },
        { transform: 'none', opacity: 1 }
      ], { pseudoElement: '::view-transition-new(' + p.n + ')', duration: 520, delay: 230 + fx * 150 + rnd() * 60, easing: 'cubic-bezier(.16,.8,.24,1)', fill: 'both' });
    });
  }
  function cambiar() {
    if (enCurso) return;
    var nuevo = actual() === 'dark' ? 'light' : 'dark';
    if (mqReducido.matches) { aplicar(nuevo); return; }
    enCurso = true;
    var P = null;
    var terminar = function () { enCurso = false; if (P) recomponer(P); R.classList.remove('tema-vt', 'tema-cambiando', 'tema-a-claro', 'tema-a-oscuro'); };
    if (typeof D.startViewTransition !== 'function') { barrido(nuevo, terminar); return; }
    R.classList.add('tema-vt', 'tema-cambiando', nuevo === 'light' ? 'tema-a-claro' : 'tema-a-oscuro');
    try { P = partir(); } catch (e) { P = null; }
    var p = null, vt;
    try {
      vt = D.startViewTransition(function () { aplicar(nuevo); p = portal(); });
    } catch (e) { aplicar(nuevo); terminar(); return; }
    if (P && vt.ready) vt.ready.then(function () { try { animarPiezas(P); } catch (e) {} }, function () {});
    vt.finished.then(function () { if (p) p.remove(); terminar(); }, function () { if (p) p.remove(); terminar(); });
  }
  if (boton) {
    boton.addEventListener('click', cambiar);
    pintarBoton();
  }
  metaColor();
  // Otra pestaña cambió el tema: esta se pone igual, sin animación.
  W.addEventListener('storage', function (e) {
    if (e.key === CLAVE && (e.newValue === 'light' || e.newValue === 'dark') && e.newValue !== actual()) {
      R.setAttribute('data-theme', e.newValue); pintarBoton(); metaColor();
    }
  });

  /* El cielo del otro tema, precargado cuando la página ya está quieta: así
     el cambio de tema no espera a descargar sus estrellas (5 PNG, ~65 KB). */
  function precargarCielo() {
    try {
      [].forEach.call(D.styleSheets, function (h) {
        if (!h.href || h.href.indexOf('galaxia.css') < 0) return;
        [].forEach.call(h.cssRules, function (r) {
          var m = (r.cssText || '').match(/url\("?([^")]+)"?\)/);
          if (m) { var im = new Image(); im.decoding = 'async'; im.src = m[1]; }
        });
      });
    } catch (e) {}
  }
  W.addEventListener('load', function () { (W.requestIdleCallback || function (f) { W.setTimeout(f, 2500); })(precargarCielo, { timeout: 4000 }); });

  /* ------------------------------------- estrellas que titilan (.gx-t) */
  (function () {
    var gx = D.querySelector('.gx');
    if (!gx || gx.querySelector('.gx-t')) return;
    var ligero = R.classList.contains('gx-ligero');
    var n = ligero ? 8 : (W.innerWidth <= 768 ? 14 : 30), sem = 7, frag = D.createDocumentFragment();
    var rnd = function () { sem = (sem * 16807) % 2147483647; return sem / 2147483647; };
    for (var i = 0; i < n; i++) {
      var b = D.createElement('b');
      /* Tres de cada diez sacan rayos: las que hacen que el cielo brille de
         verdad. El resto son puntos que respiran. */
      b.className = 'gx-t' + (i % 4 === 1 ? ' is-c' : '') + (i % 10 === 3 || i % 10 === 7 ? ' is-x' : '');
      var t = (1.8 + Math.pow(rnd(), 2) * 3.4).toFixed(1);
      b.style.cssText = 'left:' + (3 + rnd() * 94).toFixed(1) + '%;top:' + (3 + rnd() * 92).toFixed(1) + '%;' +
        '--t:' + t + 'px;--r:' + (8 + rnd() * 12).toFixed(0) + 'px;' +
        '--d:' + (2.6 + rnd() * 4.5).toFixed(1) + 's;--dl:-' + (rnd() * 7).toFixed(1) + 's';
      frag.appendChild(b);
    }
    gx.appendChild(frag);
  })();

  /* ------------------------------------------------ parallax del cielo */
  var capas = [
    { el: D.querySelector('.gx-lejos'), k: 0.035, T: 520 },
    { el: D.querySelector('.gx-medio'), k: 0.07, T: 860 }
  ].filter(function (c) { return c.el; });
  if (capas.length && !mqReducido.matches) {
    var pendiente = false;
    var mover = function () {
      pendiente = false;
      if (R.classList.contains('gx-ligero')) return;
      var y = W.scrollY || W.pageYOffset || 0;
      for (var i = 0; i < capas.length; i++) {
        var c = capas[i];
        var T = c.T * (W.innerWidth <= 768 && c.T === 860 ? 0.8 : 1);
        c.el.style.transform = 'translate3d(0,' + (-((y * c.k) % T)).toFixed(1) + 'px,0)';
      }
    };
    W.addEventListener('scroll', function () { if (!pendiente) { pendiente = true; W.requestAnimationFrame(mover); } }, { passive: true });
    mover();
  }

  /* --------------------------------------- cielo ligero si no da para más */
  var medido = false, forzado = null;
  try { forzado = W.localStorage.getItem('dcp-cielo'); } catch (e) {}
  // Para pruebas y revisión visual: 'completo' nunca aligera, 'ligero' siempre.
  if (forzado === 'ligero') R.classList.add('gx-ligero');
  function medirCielo() {
    if (medido || forzado === 'completo' || forzado === 'ligero' || !D.querySelector('.gx') || mqReducido.matches) return;
    if (D.visibilityState !== 'visible') return; // se mide al volver a la vista
    medido = true;
    var t = [];
    var paso = function (ts) {
      t.push(ts);
      if (ts - t[0] < 1200 && D.visibilityState === 'visible') { W.requestAnimationFrame(paso); return; }
      if (D.visibilityState !== 'visible' || t.length < 8) { medido = false; return; }
      var d = [];
      for (var i = 1; i < t.length; i++) d.push(t[i] - t[i - 1]);
      d.sort(function (a, b) { return a - b; });
      if (d[Math.floor(d.length * 0.75)] > 22) R.classList.add('gx-ligero');
    };
    W.requestAnimationFrame(paso);
  }
  var alCargar = function () { W.setTimeout(medirCielo, 1500); };
  if (D.readyState === 'complete') alCargar(); else W.addEventListener('load', alCargar);
  D.addEventListener('visibilitychange', function () { if (D.visibilityState === 'visible') W.setTimeout(medirCielo, 600); });
})();
