/* ============================================================================
   D-CODE PARTNERS — INTERACCIÓN v5  ·  "SISTEMA VIVO"
   ----------------------------------------------------------------------------
   Seis comportamientos. Cada uno existe porque comunica algo que, si no,
   habría que escribir en un párrafo:

   1) ESCENA DEL HERO — puntos dispersos que se organizan, se conectan y
      empiezan a mover información. Es literalmente lo que hacemos, ocurriendo
      delante de quien entra. No es decoración: es el argumento.

   2) ATMÓSFERA QUE VIAJA — cada sección tiene su temperatura de luz y el
      fondo transita de una a otra al bajar. Recorrer la web es atravesar algo.

   3) ENTRADAS AL SCROLL — lo que aparece, aparece; no está simplemente ahí.

   4) FOCO DE CURSOR — las superficies responden a dónde apunta la persona.

   5) DIAGRAMA DE PROCESO Y PASOS — el proceso se recorre, no se lee.

   6) VITRINA DE D-CODE FINANCE — el producto se enseña funcionando.

   Sin partículas aleatorias. Sin scroll secuestrado. Sin movimiento perpetuo:
   la escena se estabiliza y se queda quieta salvo por su respiración.
   ========================================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse  = window.matchMedia('(pointer: coarse)').matches;

  /* ======================================================= 1. ESCENA HERO */
  /* Tres columnas: lo que entra disperso, el sistema, lo que sale ordenado.
     El recorrido de la animación es el recorrido del mensaje.              */
  function initStage() {
    var host = document.querySelector('[data-stage]');
    if (!host) return;
    var canvas = document.createElement('canvas');
    host.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var stateEl = document.querySelector('[data-stage-state]');
    var phrases = (host.getAttribute('data-states') || 'Disperso|Conectando|Sistema en marcha').split('|');

    var W = 0, H = 0, dpr = 1;
    // Estructura destino, en coordenadas normalizadas del lienzo.
    // Dos composiciones distintas, no una encogida: en escritorio la escena
    // ocupa la mitad derecha, detrás del titular; en móvil vive en una franja
    // propia bajo los botones, a lo ancho, sin competir con el texto.
    var WIDE = [
      { x: .625, y: .10, r: 3.8, t: 0 }, { x: .600, y: .29, r: 3.8, t: 0 },
      { x: .640, y: .50, r: 3.8, t: 0 }, { x: .600, y: .71, r: 3.8, t: 0 },
      { x: .625, y: .90, r: 3.8, t: 0 },
      { x: .765, y: .50, r: 11, t: 1 },
      { x: .915, y: .22, r: 4.4, t: 2 }, { x: .935, y: .40, r: 4.4, t: 2 },
      { x: .935, y: .60, r: 4.4, t: 2 }, { x: .915, y: .78, r: 4.4, t: 2 }
    ];
    var NARROW = [
      { x: .10, y: .12, r: 3.2, t: 0 }, { x: .07, y: .31, r: 3.2, t: 0 },
      { x: .11, y: .50, r: 3.2, t: 0 }, { x: .07, y: .69, r: 3.2, t: 0 },
      { x: .10, y: .88, r: 3.2, t: 0 },
      { x: .50, y: .50, r: 9, t: 1 },
      { x: .89, y: .18, r: 3.8, t: 2 }, { x: .93, y: .39, r: 3.8, t: 2 },
      { x: .93, y: .61, r: 3.8, t: 2 }, { x: .89, y: .82, r: 3.8, t: 2 }
    ];
    var LAYOUT = WIDE;
    var HUE = ['67,224,255', '155,107,255', '53,224,161'];
    var nodes = LAYOUT.map(function (l, i) {
      return {
        tx: l.x, ty: l.y, r: l.r, t: l.t,
        // Origen: caos. Semilla fija, no aleatoria en cada carga: la portada
        // debe reconocerse igual cada vez que alguien vuelve.
        ox: .50 + ((i * 137) % 47) / 100, oy: .05 + ((i * 71) % 90) / 100,
        x: 0, y: 0, ph: i * 0.83
      };
    });
    var LINKS = [];
    for (var a = 0; a < 5; a++) LINKS.push([a, 5]);
    for (var c = 6; c < 10; c++) LINKS.push([5, c]);
    // Pulsos: información recorriendo el sistema. Pocos y lentos, a propósito.
    var pulses = LINKS.map(function (_, i) { return { i: i, p: -(i * 0.14) - 0.2 }; });

    function size() {
      /* Este lienzo no tenía tope en táctil: en un iPad se creaba a 2x, que
         son 5,6 millones de píxeles que suben a la GPU en cada fotograma. */
      dpr = window.DCP ? window.DCP.dpr(2) : Math.min(window.devicePixelRatio || 1, 2);
      W = host.clientWidth; H = host.clientHeight;
      var L = W < 760 ? NARROW : WIDE;
      if (L !== LAYOUT) {
        LAYOUT = L;
        nodes.forEach(function (n, i) { n.tx = L[i].x; n.ty = L[i].y; n.r = L[i].r; });
      }
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    var ro = window.ResizeObserver ? new ResizeObserver(size) : null;
    if (ro) ro.observe(host); else window.addEventListener('resize', size);

    // Parallax de cursor: 12 px como máximo. Se nota, no marea.
    var mx = 0, my = 0, cx = 0, cy = 0;
    if (!coarse && !reduced) {
      window.addEventListener('mousemove', function (e) {
        mx = (e.clientX / window.innerWidth - .5) * 24;
        my = (e.clientY / window.innerHeight - .5) * 16;
      }, { passive: true });
    }

    var t0 = null, phase = -1, running = true, visible = true;
    function setPhase(n) {
      if (n === phase || !stateEl || !phrases[n]) return;
      phase = n; stateEl.style.opacity = 0;
      setTimeout(function () { stateEl.textContent = phrases[n]; stateEl.style.opacity = 1; }, 220);
    }
    if (stateEl) stateEl.style.transition = 'opacity .22s ease';

    function ease(u) { return u < 0 ? 0 : u > 1 ? 1 : 1 - Math.pow(1 - u, 3); }

    function frame(ts) {
      if (!running) return;
      if (t0 === null) t0 = ts;
      var s = (ts - t0) / 1000;
      if (reduced) s = 99;

      // Orden: cada nodo llega a su sitio con un desfase; el sistema primero.
      cx += (mx - cx) * .06; cy += (my - cy) * .06;
      ctx.clearRect(0, 0, W, H);

      var pos = nodes.map(function (n, i) {
        var u = ease((s - 0.25 - i * 0.07) / 1.5);
        var px = (n.ox + (n.tx - n.ox) * u) * W;
        var py = (n.oy + (n.ty - n.oy) * u) * H;
        var depth = n.t === 1 ? 1.6 : n.t === 2 ? 1 : .55;
        var breathe = (s > 2 && !reduced) ? Math.sin(s * 1.1 + n.ph) * 1.6 : 0;
        return { x: px + cx * depth, y: py + cy * depth + breathe, u: u, r: n.r, t: n.t };
      });

      // Enlaces: se dibujan cuando la estructura ya está formada.
      var lu = ease((s - 1.5) / 1.4);
      if (lu > 0) {
        LINKS.forEach(function (l) {
          var A = pos[l[0]], B = pos[l[1]];
          var g = ctx.createLinearGradient(A.x, A.y, B.x, B.y);
          g.addColorStop(0, 'rgba(' + HUE[nodes[l[0]].t] + ',' + (0.42 * lu) + ')');
          g.addColorStop(1, 'rgba(' + HUE[nodes[l[1]].t] + ',' + (0.42 * lu) + ')');
          ctx.strokeStyle = g; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(A.x, A.y);
          ctx.lineTo(A.x + (B.x - A.x) * lu, A.y + (B.y - A.y) * lu);
          ctx.stroke();
        });
      }

      // Pulsos de información.
      if (lu >= 1 && !reduced) {
        pulses.forEach(function (pl) {
          pl.p += 0.0042;
          if (pl.p > 1.35) pl.p = -0.25;
          if (pl.p < 0 || pl.p > 1) return;
          var l = LINKS[pl.i], A = pos[l[0]], B = pos[l[1]];
          var px = A.x + (B.x - A.x) * pl.p, py = A.y + (B.y - A.y) * pl.p;
          var fade = Math.sin(pl.p * Math.PI);
          ctx.beginPath(); ctx.arc(px, py, 1.9, 0, 6.284);
          ctx.fillStyle = 'rgba(190,215,255,' + (0.85 * fade) + ')';
          ctx.fill();
        });
      }

      // Nodos. El halo crece con el orden: el caos es apagado, el sistema brilla.
      pos.forEach(function (p, i) {
        var hue = HUE[p.t];
        var glow = 0.12 + 0.40 * p.u;
        var rg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 7);
        rg.addColorStop(0, 'rgba(' + hue + ',' + glow + ')');
        rg.addColorStop(1, 'rgba(' + hue + ',0)');
        ctx.fillStyle = rg;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 7, 0, 6.284); ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.284);
        ctx.fillStyle = 'rgba(' + hue + ',' + (0.45 + 0.5 * p.u) + ')';
        ctx.fill();
        if (p.t === 1 && p.u > .9) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + 7 + (reduced ? 0 : Math.sin(s * 1.4) * 2.2), 0, 6.284);
          ctx.strokeStyle = 'rgba(' + hue + ',.34)'; ctx.lineWidth = 1; ctx.stroke();
        }
      });

      if (s < 1.4) setPhase(0); else if (s < 3.0) setPhase(1); else setPhase(2);

      if (visible) requestAnimationFrame(frame); else running = false;
    }
    requestAnimationFrame(frame);

    // No pintar lo que nadie mira: ni fuera de pantalla ni en otra pestaña.
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible && !running) { running = true; requestAnimationFrame(frame); }
      }, { threshold: 0 }).observe(host);
    }
    document.addEventListener('visibilitychange', function () {
      visible = !document.hidden;
      if (visible && !running) { running = true; requestAnimationFrame(frame); }
    });
  }

  /* ============================================= 2. ATMÓSFERA QUE VIAJA */
  var AMB = {
    violeta: ['155,107,255', '67,224,255', '255,107,157'],
    cian:    ['67,224,255', '91,140,255', '155,107,255'],
    rosa:    ['255,107,157', '155,107,255', '67,224,255'],
    verde:   ['53,224,161', '67,224,255', '155,107,255'],
    ambar:   ['255,180,58', '255,107,157', '155,107,255']
  };
  function initAmbient() {
    var zones = document.querySelectorAll('[data-amb]');
    if (!zones.length || !window.IntersectionObserver) return;
    /* Las tres variables se escriben en la CAPA, no en <html>. Escribirlas
       en la raíz invalidaba el estilo de todo el documento en cada cambio de
       sección: medido en iPad, 95 ms de tirón por sección en una página con
       la aplicación de Finance dentro. En la capa, el recálculo es de un
       elemento. */
    var capa = document.createElement('div');
    capa.className = 'amb-aurora';
    capa.setAttribute('aria-hidden', 'true');
    document.body.appendChild(capa);
    document.body.classList.add('amb-propia');
    var ultimo = '';
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var nombre = e.target.getAttribute('data-amb');
        if (nombre === ultimo) return;            // la misma temperatura no se reescribe
        var k = AMB[nombre];
        if (!k) return;
        ultimo = nombre;
        capa.style.setProperty('--amb-1', k[0]);
        capa.style.setProperty('--amb-2', k[1]);
        capa.style.setProperty('--amb-3', k[2]);
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    zones.forEach(function (z) { io.observe(z); });
  }

  /* ============================================== 3. ENTRADAS AL SCROLL */
  function initReveal() {
    var els = document.querySelectorAll('.rise, .rise-l, .rise-s, .track, .out');
    if (!els.length) return;
    if (reduced || !window.IntersectionObserver) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
      /* threshold 0.12 pide que se vea el 12% del AREA del elemento. En una
         tarjeta pequeña son unos pocos pixeles; en un bloque alto son cientos,
         y en una ventana baja puede no ocurrir nunca. Basta con que asome. */
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    /* LO QUE VIVE DENTRO DE UN RAIL HORIZONTAL NO SE OBSERVA SOLO.
       Medido en /servicios/agentes-ia y sus dos hermanas: las tarjetas quinta
       y sexta del rail estan a 1438 y 1752 px de la izquierda, o sea FUERA de
       la ventana en horizontal. El observador nunca las cruza, asi que nunca
       reciben la clase de entrada, asi que se quedan en opacidad 0 para
       siempre: quien desliza el rail se encuentra dos tarjetas en blanco. La
       red de seguridad tampoco las salvaba, porque solo mira si el elemento
       esta a la altura correcta y para cuando saltaba ya habian pasado.

       Un elemento dentro de un contenedor que se desplaza en horizontal se
       revela con SU RAIL, no por su cuenta: cuando el rail asoma, entran
       todas, esten donde esten en el eje X. */
    function railDe(el) {
      for (var n = el.parentNode; n && n.nodeType === 1 && n !== document.body; n = n.parentNode) {
        var ov = getComputedStyle(n).overflowX;
        if ((ov === 'auto' || ov === 'scroll') && n.scrollWidth > n.clientWidth + 4) return n;
      }
      return null;
    }
    var porRail = [], vistos = [];
    var pend = [];
    els.forEach(function (el) {
      var rail = railDe(el);
      if (rail) {
        var k = vistos.indexOf(rail);
        if (k === -1) { vistos.push(rail); porRail.push([rail, [el]]); }
        else porRail[k][1].push(el);
        return;
      }
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) { el.classList.add('in'); return; }
      io.observe(el); pend.push(el);
    });
    porRail.forEach(function (par) {
      var rail = par[0], hijos = par[1];
      var entrar = function () { hijos.forEach(function (h, i) {
        h.style.setProperty('--i', i); h.classList.add('in'); }); };
      var rr = rail.getBoundingClientRect();
      if (rr.top < window.innerHeight && rr.bottom > 0) { entrar(); return; }
      var ior = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { entrar(); ior.disconnect(); }
      }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
      ior.observe(rail);
      pend.push(rail);
      rail.__entrar = entrar;
    });
    /* La misma red de seguridad que en main.js, por la misma razon: el
       observador entrega una vez por fotograma contra la posicion del momento,
       y un arrastre de la barra de scroll salta por encima de bloques enteros
       que se quedan invisibles para siempre. Se retira sola al vaciarse. */
    if (pend.length) {
      var pt = null;
      var barrer = function () {
        for (var i = pend.length - 1; i >= 0; i--) {
          var e2 = pend[i], b = e2.getBoundingClientRect();
          /* Ya no basta con "esta a la altura": si el bloque ha quedado por
             ENCIMA de la ventana porque el salto de scroll paso por delante,
             tambien hay que encenderlo. Invisible para siempre es peor que
             entrar sin animacion. */
          if (b.top < window.innerHeight * 0.92) {
            if (e2.__entrar) e2.__entrar(); else e2.classList.add('in');
            io.unobserve(e2); pend.splice(i, 1);
          }
        }
        if (!pend.length) {
          window.removeEventListener('scroll', tras);
          window.removeEventListener('pageshow', tras);
        }
      };
      var tras = function () { clearTimeout(pt); pt = setTimeout(barrer, 140); };
      window.addEventListener('scroll', tras, { passive: true });
      /* Y lo mismo al volver con el boton de atras: la posicion de scroll se
         restaura despues de esta decision. */
      window.addEventListener('pageshow', tras);
      setTimeout(barrer, 260);
    }
    // Escalonado automático entre hermanos: no hace falta escribir --i a mano.
    document.querySelectorAll('[data-stagger]').forEach(function (g) {
      Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--i', i); });
    });
  }

  /* ================================================= 4. FOCO DE CURSOR */
  function initLift() {
    if (coarse || reduced) return;
    /* La caja del elemento se leia EN CADA movimiento del raton: una lectura
       forzada de geometria por evento, y el raton dispara decenas por segundo.
       Mientras el puntero no cambie de elemento la caja es la misma, asi que
       se guarda; se descarta al cambiar de elemento y al hacer scroll o
       redimensionar, que son las dos cosas que la mueven. */
    var ult = null, caja = null;
    function olvida() { ult = null; caja = null; }
    window.addEventListener('scroll', olvida, { passive: true });
    window.addEventListener('resize', olvida, { passive: true });
    document.addEventListener('mousemove', function (e) {
      var el = e.target.closest ? e.target.closest('.lift') : null;
      if (!el) { olvida(); return; }
      if (el !== ult) { ult = el; caja = el.getBoundingClientRect(); }
      el.style.setProperty('--mx', ((e.clientX - caja.left) / caja.width * 100) + '%');
      el.style.setProperty('--my', ((e.clientY - caja.top) / caja.height * 100) + '%');
    }, { passive: true });
  }

  /* =============================== 5a. DIAGRAMA DE PROCESO (horizontal) */
  /* Cuatro estados de la misma idea, dibujados: disperso, ordenado, conectado
     y medido. El paso activo cambia el panel; el panel no cambia de tamaño. */
  var MINI = [
    // 01 — disperso
    '<circle cx="20" cy="22" r="3.4"/><circle cx="62" cy="14" r="3.4"/><circle cx="96" cy="34" r="3.4"/>' +
    '<circle cx="34" cy="62" r="3.4"/><circle cx="78" cy="72" r="3.4"/><circle cx="16" cy="90" r="3.4"/>' +
    '<circle cx="58" cy="46" r="3.4"/>',
    // 02 — ordenado en columnas
    '<g opacity=".28"><path d="M26 12v80M60 12v80M94 12v80" stroke="currentColor" stroke-width="1" fill="none"/></g>' +
    '<circle cx="26" cy="24" r="3.4"/><circle cx="26" cy="52" r="3.4"/><circle cx="26" cy="80" r="3.4"/>' +
    '<circle cx="60" cy="38" r="3.4"/><circle cx="60" cy="66" r="3.4"/><circle cx="94" cy="52" r="3.4"/>',
    // 03 — conectado
    '<g stroke="currentColor" stroke-width="1" fill="none" opacity=".5">' +
    '<path d="M60 52 20 18M60 52 20 86M60 52 100 26M60 52 100 78"/></g>' +
    '<circle cx="60" cy="52" r="7"/><circle cx="20" cy="18" r="3.4"/><circle cx="20" cy="86" r="3.4"/>' +
    '<circle cx="100" cy="26" r="3.4"/><circle cx="100" cy="78" r="3.4"/>',
    // 04 — medido
    '<g><rect x="14" y="70" width="14" height="24" rx="3"/><rect x="36" y="56" width="14" height="38" rx="3"/>' +
    '<rect x="58" y="40" width="14" height="54" rx="3"/><rect x="80" y="22" width="14" height="72" rx="3"/></g>' +
    '<path d="M14 62 40 48 66 32 92 14" stroke="currentColor" stroke-width="1.6" fill="none" opacity=".55"/>'
  ];
  function initTrack() {
    document.querySelectorAll('[data-track]').forEach(function (track) {
      var steps = Array.prototype.slice.call(track.querySelectorAll('.step'));
      var panel = track.querySelector('[data-track-panel]');
      if (!steps.length || !panel) return;
      var word = track.getAttribute('data-step-word') || 'Paso';
      function open(s) {
        steps.forEach(function (o) { o.setAttribute('aria-expanded', String(o === s)); });
        var i = steps.indexOf(s);
        var t = s.querySelector('.step-t'), d = s.querySelector('.step-d');
        panel.style.setProperty('--k', getComputedStyle(s).getPropertyValue('--k') || 'var(--v-a)');
        panel.innerHTML =
          '<div class="track-panel-in"><span class="micro">' + word + ' 0' + (i + 1) + '</span>' +
          '<h3>' + (t ? t.textContent : '') + '</h3>' +
          '<p>' + (d ? d.textContent : '') + '</p></div>' +
          '<svg class="tmini" viewBox="0 0 120 104" fill="currentColor" aria-hidden="true" ' +
          'style="color:var(--k)">' + MINI[i % MINI.length] + '</svg>';
      }
      steps.forEach(function (s, i) {
        s.addEventListener('click', function () { open(s); });
        s.addEventListener('mouseenter', function () { if (!coarse) open(s); });
        s.addEventListener('focus', function () { open(s); });
      });
      open(steps[0]);
    });
  }

  /* =============================== 5b. PASOS EN VERTICAL (con el scroll) */
  function initVSteps() {
    var blocks = document.querySelectorAll('[data-vsteps]');
    if (!blocks.length) return;
    /* Se consultaba el DOM y se leia la geometria de CADA paso EN CADA
       fotograma de scroll, y encima intercalado: leer caja, escribir altura,
       leer caja, escribir clase... que es la receta exacta del layout
       thrashing —el navegador tiene que rehacer el calculo entre lectura y
       escritura—. Ahora las consultas se hacen una vez, se leen TODAS las
       cajas y despues se escribe TODO. Mismo resultado en pantalla. */
    var list = Array.prototype.slice.call(blocks).map(function (b) {
      return { el: b, fill: b.querySelector('.vsteps-fill'),
               steps: Array.prototype.slice.call(b.querySelectorAll('.vstep')) };
    });
    function paint() {
      var mid = window.innerHeight * 0.58;
      var lect = list.map(function (o) {
        var r = o.el.getBoundingClientRect();
        return { p: Math.max(0, Math.min(1, (mid - r.top) / r.height)),
                 tops: o.steps.map(function (s) { return s.getBoundingClientRect().top; }) };
      });
      list.forEach(function (o, i) {
        var L = lect[i];
        if (o.fill) o.fill.style.height = (L.p * 100) + '%';
        o.steps.forEach(function (s, j) { s.classList.toggle('on', L.tops[j] < mid); });
      });
    }
    var tick = false;
    window.addEventListener('scroll', function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () { paint(); tick = false; });
    }, { passive: true });
    window.addEventListener('resize', paint, { passive: true });
    paint();
  }

  /* ========================================== 6. VITRINA DE D-CODE FINANCE
   * Aqui vivian las lineas que dibujaban una maqueta: cuatro filas de factura
   * escritas a mano, unas barras de altura fija, cinco pestañas que cambiaban
   * un parrafo y una nota al pie diciendo que las cifras eran de ejemplo. La
   * Home y /sistema-financiero enseñaban eso, mientras la demo de verdad
   * estaba construida al lado y solo se llegaba a ella por un boton.
   *
   * Ya no hay maqueta en ninguna de las dos: las dos montan la aplicacion
   * (finance-demo.js sobre finance-demo-data.js, el mismo dataset ficticio
   * que el producto real usa en modo mock). De este apartado solo queda el
   * cargador de mas abajo. El CSS que vestia la maqueta se borra tambien.
   */


  /* ---------------------------------------------------------------
   * LA DEMO DE FINANCE, PEDIDA CUANDO HACE FALTA
   * ---------------------------------------------------------------
   * La Home monta la demo de verdad (la misma que /sistema-financiero/app),
   * y eso son 96 KB entre su hoja y sus dos scripts. Ponerlos en el <head>
   * los cobra a TODO el que abre la portada, incluido quien no baja nunca
   * hasta la ultima seccion. Aqui se piden cuando esa seccion esta a una
   * pantalla de distancia, que en una pagina de 9.700 px de alto es tiempo
   * de sobra para que lleguen antes que el lector.
   *
   * Las URL viven en el HTML, no aqui: `update-asset-versions.js` solo
   * reescribe el `?v=` dentro de los .html, asi que un hash escrito en este
   * fichero se quedaria viejo y serviria bytes cacheados de una version
   * anterior — el defecto exacto que ese script existe para evitar.
   *
   * Si el navegador no tiene IntersectionObserver, se cargan y ya. Diferir
   * no puede significar nunca «no aparece».
   */
  function initFinanceLazy() {
    var hosts = Array.prototype.slice.call(document.querySelectorAll('[data-fdemo-lazy]'));
    if (!hosts.length) return;

    /* EN UN TELÉFONO NO SE MONTA. Ver la nota larga de arriba: un panel
       financiero apretado en 390 px enseña algo peor que no enseñar nada, y
       además cuesta 228 KB de JavaScript en la peor conexión. El bloque de
       sustitución ya está en el HTML; aquí solo se marca el anfitrión. */
    /* MEDIDO (iPad simulado, CPU x4): con la aplicación montada, el
       recorrido y sus animaciones dejaban el fotograma mediano en 117 ms.
       La regla es el ANCHO, no el dedo: en un iPad la aplicación se usa y
       se lee perfectamente, y quitarla era quitar lo mejor que tiene esta
       página. Por debajo de 900 px —el teléfono— se enseña la ficha, que es
       lo que hacen las aplicaciones de gestión con su propia web.
       Quien quiera la aplicación igualmente, tiene el botón. */
    if (window.matchMedia('(max-width: 900px)').matches) {
      hosts.forEach(function (h) {
        h.setAttribute('data-fdemo-movil', '1');
        var caja = h.querySelector('.demo-movil');
        if (!caja || caja.querySelector('[data-fdemo-forzar]')) return;
        /* La aplicación, en una foto de verdad: en el teléfono no se monta,
           pero se ve qué es antes de decidir si merece un ordenador. */
        if (!caja.querySelector('.demo-movil-foto')) {
          var fig = document.createElement('span');
          fig.className = 'demo-movil-foto';
          fig.innerHTML = '<img class="es-oscuro" src="/assets/img/demos/finance-dark-700.webp" srcset="/assets/img/demos/finance-dark-700.webp 700w, /assets/img/demos/finance-dark.webp 1400w" sizes="190vw" width="1400" height="813" loading="lazy" decoding="async" alt="' +
            (document.documentElement.lang === 'en' ? 'D-Code Finance on a computer' : 'D-Code Finance en un ordenador') + '">' +
            '<img class="es-claro" src="/assets/img/demos/finance-light-700.webp" srcset="/assets/img/demos/finance-light-700.webp 700w, /assets/img/demos/finance-light.webp 1400w" sizes="190vw" width="1400" height="813" loading="lazy" decoding="async" alt="">';
          var tras = caja.querySelector('.demo-movil-t');
          if (tras && tras.parentNode) tras.parentNode.insertBefore(fig, tras.nextSibling);
          else caja.insertBefore(fig, caja.firstChild);
        }
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'btn btn-ghost demo-movil-b2'; b.setAttribute('data-fdemo-forzar', '1');
        b.textContent = document.documentElement.lang === 'en' ? 'Open it here anyway' : 'Abrirla aquí igualmente';
        b.addEventListener('click', function () {
          h.removeAttribute('data-fdemo-movil');
          h.classList.add('is-forzada');
          b.remove();
          cargar(h);
        });
        caja.appendChild(b);
      });
      return;
    }

    function cargar(host) {
      if (host.getAttribute('data-fdemo-listo')) return;
      host.setAttribute('data-fdemo-listo', '1');

      var css = host.getAttribute('data-fdemo-css');
      if (css && !document.querySelector('link[href="' + css + '"]')) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = css;
        document.head.appendChild(link);
      }

      // En orden: los datos definen window.FinanceStore, que el motor exige.
      var pendientes = (host.getAttribute('data-fdemo-js') || '').split(',').filter(Boolean);
      (function siguiente() {
        if (!pendientes.length) return;
        var src = pendientes.shift();
        var ya = document.querySelector('script[src="' + src + '"]');
        if (ya) { siguiente(); return; }
        var sc = document.createElement('script');
        sc.src = src;
        sc.onload = siguiente;
        sc.onerror = function () {
          // No se finge que esta: se dice. Ocultarlo dejaria un hueco mudo.
          host.setAttribute('data-fdemo-error', '1');
        };
        document.head.appendChild(sc);
      })();
    }

    if (!('IntersectionObserver' in window)) { hosts.forEach(cargar); return; }
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        cargar(e.target);
      });
    }, { rootMargin: '100% 0px' });
    hosts.forEach(function (h) { obs.observe(h); });

    /* LA DEMO, MONTADA ANTES DE QUE HAGA FALTA.
       MEDIDO (perfil iPad, bajando la portada entera): montarla al acercarse
       costaba una tarea de 274–312 ms —son 287 KB de motor más 129 de datos—
       y caía justo mientras el dedo bajaba, que es cuando más se nota. El
       hueco libre que queda después de cargar la página no lo está usando
       nadie: ahí no se nota, y cuando se llega ya está puesta.
       Si el aparato pide ahorrar datos, se respeta y se espera a que haga
       falta de verdad. */
    var ahorro = false;
    try { ahorro = !!(navigator.connection && navigator.connection.saveData); } catch (e) {}
    if (!ahorro) {
      var enHueco = function () {
        hosts.forEach(function (h) {
          if (h.getAttribute('data-fdemo-listo') || h.getAttribute('data-fdemo-movil')) return;
          obs.unobserve(h);
          cargar(h);
        });
      };
      var arranca = function () {
        window.setTimeout(function () {
          if (window.requestIdleCallback) window.requestIdleCallback(enHueco, { timeout: 5000 });
          else window.setTimeout(enHueco, 1200);
        }, 900);
      };
      if (document.readyState === 'complete') arranca();
      else window.addEventListener('load', arranca);
    }
  }

  /* ═══════════════════════ UNA SEMANA NORMAL ═══════════════════════════
     El bloque del problema de la portada. El párrafo se lee entero y lo que
     no es trabajo se va subrayando; al señalar un subrayado, su explicación
     aparece SIEMPRE en el mismo hueco de debajo. Que el hueco sea fijo es lo
     que permite que el texto no salte al cambiar de una explicación a otra,
     y por eso la altura mínima está en el CSS y no aquí.

     El primero llega ya seleccionado: si el hueco arranca vacío nadie
     descubre que los subrayados responden. */
  function initSemana() {
    var cajas = document.querySelectorAll('[data-semana]');
    if (!cajas.length) return;

    cajas.forEach(function (caja) {
      var marcas = [].slice.call(caja.querySelectorAll('.v7-mk'));
      var hueco = caja.querySelector('[data-semana-nota]');
      if (!marcas.length || !hueco) return;

      function elegir(m) {
        if (!m || m.classList.contains('is-sel')) return;
        marcas.forEach(function (o) {
          o.classList.remove('is-sel');
          o.setAttribute('aria-expanded', 'false');
        });
        m.classList.add('is-sel');
        m.setAttribute('aria-expanded', 'true');
        hueco.textContent = m.getAttribute('data-nota') || '';
      }

      marcas.forEach(function (m) {
        /* En el HTML son <span>: sin JavaScript no hay nada que pulsar y un
           <button> muerto es peor que un texto subrayado. El papel de botón
           se lo pone quien puede cumplirlo. */
        m.setAttribute('role', 'button');
        m.setAttribute('tabindex', '0');
        m.setAttribute('aria-expanded', 'false');
        m.addEventListener('mouseenter', function () { elegir(m); });
        m.addEventListener('focus', function () { elegir(m); });
        m.addEventListener('click', function () { elegir(m); });
        m.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); elegir(m); }
        });
      });
      caja.classList.add('is-ready');
      elegir(marcas[0]);

      if (reduced || !window.IntersectionObserver) {
        marcas.forEach(function (m) { m.classList.add('on'); });
        return;
      }
      /* Se subrayan de uno en uno y en el orden en que se lee la frase. Todos
         a la vez sería un efecto; de uno en uno es alguien marcando el texto
         mientras lo lee, que es lo que se quiere contar. */
      caja.classList.add('is-anim');
      var io2 = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          io2.unobserve(e.target);
          marcas.forEach(function (m, k) {
            setTimeout(function () { m.classList.add('on'); }, 240 + k * 300);
          });
        });
      }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
      io2.observe(caja);
    });
  }


  /* ═══════════════════════════ LA CUENTA ═══════════════════════════════
     El bloque del problema de la portada. Antes era una semana escrita para
     leerla, y en una portada nadie se para a leer: se para a TOCAR. Ahora
     el visitante marca lo que en su empresa se hace a mano, dice cuántas
     personas y cuánto cuesta una hora, y la cuenta sale sola: en horas, en
     euros y en semanas del año, con el año dibujado en 52 cuadros.

     Las cifras son las suyas. Los minutos de cada tarea vienen puestos como
     ejemplo, se pueden cambiar con − y +, y lo que se da por supuesto (46
     semanas de trabajo, jornadas de 40 horas) va escrito debajo del
     resultado: una cuenta que esconde sus supuestos es un anuncio. */
  function initCuenta() {
    var cajas = document.querySelectorAll('[data-cuenta]');
    if (!cajas.length) return;
    cajas.forEach(function (caja) {
      var en = caja.getAttribute('data-lang') === 'en';
      var tareas = [].slice.call(caja.querySelectorAll('.v7-tarea'));
      var rP = caja.querySelector('[data-r="personas"]'), rH = caja.querySelector('[data-r="hora"]');
      var oP = caja.querySelector('[data-o="personas"]'), oH = caja.querySelector('[data-o="hora"]');
      var eH = caja.querySelector('[data-horas]'), eE = caja.querySelector('[data-euros]'), eS = caja.querySelector('[data-semanas]');
      var cuadros = [].slice.call(caja.querySelectorAll('.v7-cuenta-sem i'));
      var semEl = caja.querySelector('.v7-cuenta-sem');
      var visto = false, actual = { h: 0, e: 0, s: 0 }, raf = 0;

      /* Siempre con separador de miles, también en «8.146»: el formato
         español del navegador lo quita en los números de cuatro cifras y un
         importe sin él se lee mal. */
      function miles(n) {
        var t = String(Math.round(n));
        return t.replace(/\B(?=(\d{3})+(?!\d))/g, en ? ',' : '.');
      }
      function euros(n) { return en ? '€' + miles(n) : miles(n) + ' €'; }
      function semanas(n) { return n < 10 ? (Math.round(n * 10) / 10).toString().replace('.', en ? '.' : ',') : miles(n); }

      function calcula() {
        var min = 0;
        tareas.forEach(function (t) { if (t.classList.contains('is-on')) min += Number(t.getAttribute('data-min')); });
        var p = Number(rP.value), h = Number(rH.value);
        var horas = p * min / 60 * 46;
        return { h: horas, e: horas * h, s: horas / 40, p: p, hora: h };
      }
      function pinta(v) {
        eH.textContent = miles(v.h);
        eE.textContent = euros(v.e);
        eS.textContent = semanas(v.s);
      }
      function cuadrosDe(s) {
        var llenos = Math.min(52, Math.round(s));
        cuadros.forEach(function (c, i) {
          c.classList.toggle('on', i < llenos);
          c.style.transitionDelay = (reduced ? 0 : Math.abs(i - llenos) < 26 ? i * 12 : 0) + 'ms';
        });
        semEl.classList.toggle('es-lleno', s > 52);
        semEl.setAttribute('data-mas', s > 52 ? '×' + (Math.round(s / 52 * 10) / 10).toString().replace('.', en ? '.' : ',') : '');
      }
      function actualiza() {
        var v = calcula();
        oP.textContent = v.p;
        oH.textContent = euros(v.hora);
        if (!visto) return;
        cuadrosDe(v.s);
        if (reduced) { actual = v; pinta(v); return; }
        var de = { h: actual.h, e: actual.e, s: actual.s }, t0 = performance.now(), D = 620;
        cancelAnimationFrame(raf);
        (function paso(t) {
          var k = Math.min(1, (t - t0) / D), q = 1 - Math.pow(1 - k, 3);
          actual = { h: de.h + (v.h - de.h) * q, e: de.e + (v.e - de.e) * q, s: de.s + (v.s - de.s) * q };
          pinta(actual);
          if (k < 1) raf = requestAnimationFrame(paso);
        })(t0);
      }

      tareas.forEach(function (t) {
        var sw = t.querySelector('.v7-tarea-sw'), b = t.querySelector('.v7-tarea-m b');
        sw.addEventListener('click', function () {
          var on = !t.classList.contains('is-on');
          t.classList.toggle('is-on', on);
          sw.setAttribute('aria-pressed', on ? 'true' : 'false');
          actualiza();
        });
        [].forEach.call(t.querySelectorAll('.v7-tarea-m button'), function (btn) {
          btn.addEventListener('click', function () {
            var m = Math.max(5, Math.min(240, Number(t.getAttribute('data-min')) + Number(btn.getAttribute('data-d'))));
            t.setAttribute('data-min', m); b.textContent = m;
            /* Cambiar los minutos de una tarea es decir que se hace: se marca. */
            if (!t.classList.contains('is-on')) { t.classList.add('is-on'); sw.setAttribute('aria-pressed', 'true'); }
            actualiza();
          });
        });
      });
      [rP, rH].forEach(function (r) {
        r.addEventListener('input', function () {
          r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min) * 100) + '%');
          actualiza();
        });
        r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min) * 100) + '%');
      });
      actualiza();

      /* La cuenta arranca cuando se ve: el número sube desde cero delante de
         quien mira, que es lo que hace que se pare. */
      if (!window.IntersectionObserver) { visto = true; actualiza(); return; }
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          io.disconnect();
          visto = true;
          setTimeout(actualiza, 250);
        });
      }, { threshold: 0.25 });
      io.observe(caja);
    });
  }

  function boot() {
    initStage(); initAmbient(); initReveal(); initLift();
    initTrack(); initVSteps(); initFinanceLazy(); initSemana(); initCuenta();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
