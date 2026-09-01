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
    var HUE = ['77,208,225', '124,108,255', '53,224,161'];
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
      dpr = Math.min(window.devicePixelRatio || 1, 2);
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
    violeta: ['124,108,255', '77,208,225', '255,107,157'],
    cian:    ['77,208,225', '91,140,255', '124,108,255'],
    rosa:    ['255,107,157', '124,108,255', '77,208,225'],
    verde:   ['53,224,161', '77,208,225', '124,108,255'],
    ambar:   ['255,180,58', '255,107,157', '124,108,255']
  };
  function initAmbient() {
    var zones = document.querySelectorAll('[data-amb]');
    if (!zones.length || !window.IntersectionObserver) return;
    var root = document.documentElement;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var k = AMB[e.target.getAttribute('data-amb')];
        if (!k) return;
        root.style.setProperty('--amb-1', k[0]);
        root.style.setProperty('--amb-2', k[1]);
        root.style.setProperty('--amb-3', k[2]);
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
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
    // Escalonado automático entre hermanos: no hace falta escribir --i a mano.
    document.querySelectorAll('[data-stagger]').forEach(function (g) {
      Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--i', i); });
    });
  }

  /* ================================================= 4. FOCO DE CURSOR */
  function initLift() {
    if (coarse || reduced) return;
    document.addEventListener('mousemove', function (e) {
      var el = e.target.closest ? e.target.closest('.lift') : null;
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
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
    var list = Array.prototype.slice.call(blocks);
    function paint() {
      list.forEach(function (b) {
        var fill = b.querySelector('.vsteps-fill');
        var steps = b.querySelectorAll('.vstep');
        var r = b.getBoundingClientRect();
        var mid = window.innerHeight * 0.58;
        var p = (mid - r.top) / r.height;
        p = p < 0 ? 0 : p > 1 ? 1 : p;
        if (fill) fill.style.height = (p * 100) + '%';
        steps.forEach(function (s) {
          var sr = s.getBoundingClientRect();
          s.classList.toggle('on', sr.top < mid);
        });
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

  /* ========================================== 6. VITRINA DE D-CODE FINANCE */
  var ES = {
    panel: {
      title: 'Panel financiero',
      text: 'Toda la salud financiera en una pantalla: lo facturado, lo cobrado, lo que está por vencer y la previsión del periodo.',
      points: ['Cifras del periodo con comparación', 'Previsión de cobro a 30 días', 'Alertas con su base de cálculo'],
      mock: 'kpis'
    },
    facturas: {
      title: 'Facturación',
      text: 'Emisión desde presupuesto aceptado o desde proyecto, con series, numeración correlativa y PDF generado por el sistema.',
      points: ['Series y numeración correlativa', 'Rectificativas enlazadas al original', 'PDF y envío al cliente'],
      mock: 'rows-fact'
    },
    cobros: {
      title: 'Cobros',
      text: 'Seguimiento del dinero pendiente con recordatorios que escalan solos y registro de cobros parciales.',
      points: ['Antigüedad de la deuda por tramos', 'Recordatorios escalados', 'Cobros parciales sobre una factura'],
      mock: 'rows-cobro'
    },
    gastos: {
      title: 'Gastos y proveedores',
      text: 'Registro de gasto con revisión humana, clasificación asistida y control de presupuesto por categoría.',
      points: ['Alta desde documento con revisión', 'Categorías y proveedores', 'Cuentas por pagar y vencimientos'],
      mock: 'rows-gasto'
    },
    analisis: {
      title: 'Análisis y consulta',
      text: 'Rentabilidad real por proyecto y consulta en lenguaje natural sobre los datos, citando siempre de dónde sale cada cifra.',
      points: ['Rentabilidad devengada y de caja', 'Detección de anomalías explicables', 'Consulta con origen del dato'],
      mock: 'bars'
    }
  };
  var EN = {
    panel: {
      title: 'Financial dashboard',
      text: 'The whole financial picture on one screen: invoiced, collected, falling due, and the forecast for the period.',
      points: ['Period figures with comparison', '30-day collection forecast', 'Alerts that show their arithmetic'],
      mock: 'kpis'
    },
    facturas: {
      title: 'Invoicing',
      text: 'Issued from an accepted quote or from a project, with series, sequential numbering and a PDF the system generates.',
      points: ['Series and sequential numbering', 'Credit notes linked to the original', 'PDF and delivery to the client'],
      mock: 'rows-fact'
    },
    cobros: {
      title: 'Collections',
      text: 'Outstanding money tracked, with reminders that escalate on their own and partial payments recorded against an invoice.',
      points: ['Debt ageing by bracket', 'Escalating reminders', 'Partial payments on one invoice'],
      mock: 'rows-cobro'
    },
    gastos: {
      title: 'Expenses and suppliers',
      text: 'Expenses captured with human review, assisted classification and budget control by category.',
      points: ['Captured from a document, reviewed by a person', 'Categories and suppliers', 'Payables and due dates'],
      mock: 'rows-gasto'
    },
    analisis: {
      title: 'Analysis and questions',
      text: 'Real profitability per project, and plain-language questions about the data that always cite where each figure comes from.',
      points: ['Accrual and cash profitability', 'Explainable anomaly detection', 'Answers that cite their source'],
      mock: 'bars'
    }
  };
  var LABELS = {
    es: { fact: ['PAGADA', 'ENVIADA', 'VENCIDA', 'PAGADA'], note: 'Cifras de ejemplo para ilustrar la interfaz',
          kpi: ['FACTURADO', 'COBRADO', 'PENDIENTE'], kpi2: ['MARGEN MEDIO', 'PROYECTOS', 'ANOMALÍAS'],
          cob: [['Vence en 5 días', 'AVISADO'], ['Vencido 12 días', '2.º AVISO'], ['Vencido 34 días', 'ESCALADO'], ['Cobro parcial', 'PARCIAL']],
          gas: [['Infraestructura cloud', 'APROBADO'], ['Licencias de software', 'REVISIÓN'], ['Asesoría', 'APROBADO'], ['Suministros', 'APROBADO']] },
    en: { fact: ['PAID', 'SENT', 'OVERDUE', 'PAID'], note: 'Sample figures, shown to illustrate the interface',
          kpi: ['INVOICED', 'COLLECTED', 'OUTSTANDING'], kpi2: ['AVG MARGIN', 'PROJECTS', 'ANOMALIES'],
          cob: [['Due in 5 days', 'REMINDED'], ['12 days overdue', '2ND NOTICE'], ['34 days overdue', 'ESCALATED'], ['Partial payment', 'PARTIAL']],
          gas: [['Cloud infrastructure', 'APPROVED'], ['Software licences', 'REVIEW'], ['Advisory', 'APPROVED'], ['Utilities', 'APPROVED']] }
  };

  function row(r, i) {
    return '<div class="mock-row" style="--i:' + i + '"><span>' + r[0] + '</span>' +
           '<span class="mock-amt">' + r[1] + '</span>' +
           '<span class="mock-pill" style="--st:' + r[3] + '">' + r[2] + '</span></div>';
  }
  function bars(hs) {
    return '<div class="mock-bars">' + hs.map(function (h, i) {
      return '<i style="height:' + h + '%;--i:' + i + '"></i>';
    }).join('') + '</div>';
  }
  function mocks(L) {
    var ST = ['var(--k-clientes)', 'var(--k-finanzas)', 'var(--k-marketing)', 'var(--k-clientes)'];
    var STC = ['var(--k-finanzas)', 'var(--k-produccion)', 'var(--k-marketing)', 'var(--k-soporte)'];
    var STG = ['var(--k-clientes)', 'var(--k-produccion)', 'var(--k-clientes)', 'var(--k-clientes)'];
    var amt = ['4.850,00 €', '2.310,00 €', '7.900,00 €', '1.180,00 €'];
    var amtC = ['2.310,00 €', '7.900,00 €', '3.400,00 €', '1.500,00 €'];
    var amtG = ['412,90 €', '289,00 €', '650,00 €', '128,40 €'];
    var num = ['F-2026-0148', 'F-2026-0147', 'F-2026-0146', 'F-2026-0145'];
    function kpi(vals, names) {
      return '<div class="mock-kpis">' + vals.map(function (v, i) {
        return '<div class="mock-kpi"><b>' + v + '</b><span>' + names[i] + '</span></div>';
      }).join('') + '</div>';
    }
    return {
      kpis: kpi(['128.400 €', '96.150 €', '32.250 €'], L.kpi) + bars(['38', '54', '46', '70', '62', '84', '76', '92']),
      'rows-fact': '<div class="mock-rows">' + num.map(function (n, i) {
        return row([n, amt[i], L.fact[i], ST[i]], i);
      }).join('') + '</div>',
      'rows-cobro': '<div class="mock-rows">' + L.cob.map(function (c, i) {
        return row([c[0], amtC[i], c[1], STC[i]], i);
      }).join('') + '</div>',
      'rows-gasto': '<div class="mock-rows">' + L.gas.map(function (g, i) {
        return row([g[0], amtG[i], g[1], STG[i]], i);
      }).join('') + '</div>',
      bars: kpi(['34,2 %', '6', '2'], L.kpi2) + bars(['64', '48', '82', '36', '70', '58'])
    };
  }

  function initProduct() {
    var root = document.querySelector('[data-product]');
    if (!root) return;
    var en = document.documentElement.lang === 'en';
    var MODULES = en ? EN : ES;
    var L = en ? LABELS.en : LABELS.es;
    var MOCKS = mocks(L);
    var tabs = Array.prototype.slice.call(root.querySelectorAll('.prod-tab'));
    var out = root.querySelector('[data-product-screen]');
    if (!tabs.length || !out) return;

    function render(key) {
      var m = MODULES[key];
      if (!m) return;
      out.innerHTML =
        '<div class="prod-copy"><h3>' + m.title + '</h3><p>' + m.text + '</p>' +
        '<ul class="prod-list">' + m.points.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul></div>' +
        '<div class="mock"><div class="mock-top"><span class="mock-dots"><i></i><i></i><i></i></span>' +
        '<span class="mock-name">d-code finance · ' + key + '</span></div>' +
        '<div class="mock-in">' + MOCKS[m.mock] + '</div>' +
        '<p class="mock-note">' + L.note + '</p></div>';
      out.classList.remove('swap'); void out.offsetWidth; out.classList.add('swap');
    }
    function select(tab) {
      tabs.forEach(function (t) {
        t.setAttribute('aria-selected', String(t === tab));
        t.tabIndex = t === tab ? 0 : -1;
      });
      render(tab.getAttribute('data-module'));
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (n) { e.preventDefault(); select(n); n.focus(); }
      });
    });
    select(tabs[0]);
  }

  function boot() {
    initStage(); initAmbient(); initReveal(); initLift();
    initTrack(); initVSteps(); initProduct();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
