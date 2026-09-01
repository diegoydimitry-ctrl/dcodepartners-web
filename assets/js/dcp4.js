/* ============================================================================
   D-CODE PARTNERS — INTERACCIÓN v4
   ----------------------------------------------------------------------------
   Sólo dos comportamientos, ambos con una razón:

   1) ESCENA DEL HERO — nodos que respiran sobre una malla en perspectiva. Es
      atmósfera de fondo: vive detrás del texto y no responde al puntero, para
      que nada compita con la lectura de la primera pantalla.

   2) VITRINA DE D-CODE FINANCE — pestañas de módulo. El visitante recorre el
      producto (Panel, Facturas, Cobros, Gastos, Análisis) y percibe su
      amplitud real en vez de una miniatura. Las pantallas se generan desde
      datos declarados aquí, siempre etiquetados como ejemplo.

   No hay partículas, ni parallax, ni scroll secuestrado.
   ========================================================================= */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------- 1. NODOS DEL HERO */
  function initHeroNodes() {
    var scene = document.querySelector('[data-hero-scene]');
    if (!scene) return;
    // Posiciones fijas y elegidas a mano: un aleatorio distinto en cada carga
    // hace que la portada no se vea nunca igual dos veces, que es justo lo
    // contrario de una identidad reconocible.
    var pts = [
      [62, 24, 'var(--k-comercial)'], [78, 38, 'var(--k-direccion)'],
      [70, 58, 'var(--k-finanzas)'],  [88, 62, 'var(--k-clientes)'],
      [56, 72, 'var(--k-marketing)'], [92, 28, 'var(--k-soporte)'],
      [66, 44, 'var(--k-produccion)']
    ];
    var frag = document.createDocumentFragment();
    pts.forEach(function (p, i) {
      var n = document.createElement('span');
      n.className = 'hero4-node';
      n.style.left = p[0] + '%';
      n.style.top = p[1] + '%';
      n.style.setProperty('--k', p[2]);
      n.style.setProperty('--d', (i * 0.7) + 's');
      frag.appendChild(n);
    });
    scene.appendChild(frag);
  }

  /* --------------------------------------------- 2. VITRINA DE D-CODE FINANCE */
  var MODULES = {
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

  var MOCKS = {
    kpis:
      '<div class="mock-kpis">' +
      '<div class="mock-kpi"><b>128.400 €</b><span>FACTURADO</span></div>' +
      '<div class="mock-kpi"><b>96.150 €</b><span>COBRADO</span></div>' +
      '<div class="mock-kpi"><b>32.250 €</b><span>PENDIENTE</span></div></div>' +
      '<div class="mock-bars">' +
      ['38','54','46','70','62','84','76','92'].map(function (h) {
        return '<i style="height:' + h + '%"></i>';
      }).join('') + '</div>',
    'rows-fact':
      '<div class="mock-rows">' +
      [['F-2026-0148', '4.850,00 €', 'PAGADA', 'var(--k-clientes)'],
       ['F-2026-0147', '2.310,00 €', 'ENVIADA', 'var(--k-finanzas)'],
       ['F-2026-0146', '7.900,00 €', 'VENCIDA', 'var(--k-marketing)'],
       ['F-2026-0145', '1.180,00 €', 'PAGADA', 'var(--k-clientes)']].map(row) .join('') + '</div>',
    'rows-cobro':
      '<div class="mock-rows">' +
      [['Vence en 5 días', '2.310,00 €', 'AVISADO', 'var(--k-finanzas)'],
       ['Vencido 12 días', '7.900,00 €', '2.º AVISO', 'var(--k-produccion)'],
       ['Vencido 34 días', '3.400,00 €', 'ESCALADO', 'var(--k-marketing)'],
       ['Cobro parcial', '1.500,00 €', 'PARCIAL', 'var(--k-soporte)']].map(row).join('') + '</div>',
    'rows-gasto':
      '<div class="mock-rows">' +
      [['Infraestructura cloud', '412,90 €', 'APROBADO', 'var(--k-clientes)'],
       ['Licencias de software', '289,00 €', 'REVISIÓN', 'var(--k-produccion)'],
       ['Asesoría', '650,00 €', 'APROBADO', 'var(--k-clientes)'],
       ['Suministros', '128,40 €', 'APROBADO', 'var(--k-clientes)']].map(row).join('') + '</div>',
    bars:
      '<div class="mock-kpis">' +
      '<div class="mock-kpi"><b>34,2 %</b><span>MARGEN MEDIO</span></div>' +
      '<div class="mock-kpi"><b>6</b><span>PROYECTOS</span></div>' +
      '<div class="mock-kpi"><b>2</b><span>ANOMALÍAS</span></div></div>' +
      '<div class="mock-bars">' +
      ['64','48','82','36','70','58'].map(function (h) {
        return '<i style="height:' + h + '%"></i>';
      }).join('') + '</div>'
  };

  function row(r) {
    return '<div class="mock-row"><span>' + r[0] + '</span>' +
           '<span class="mock-amt">' + r[1] + '</span>' +
           '<span class="mock-pill" style="--st:' + r[3] + '">' + r[2] + '</span></div>';
  }

  function initProduct() {
    var root = document.querySelector('[data-product]');
    if (!root) return;
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
        '<p class="mock-note">Cifras de ejemplo para ilustrar la interfaz</p></div>';
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

  function boot() { initHeroNodes(); initProduct(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
