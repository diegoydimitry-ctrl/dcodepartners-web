/*
 * D-Code Finance — demo app shell (router + render).
 *
 * Aplicación de una sola página, enrutada por hash (#dashboard,
 * #facturas...), que lee TODO su contenido a través de FinanceStore
 * (finance-demo-data.js). No hay build step, no hay framework: DOM
 * generado con template strings y un único listener delegado por
 * vista, siguiendo el mismo patrón vanilla-JS que ya usa el resto del
 * sitio en main.js. Cero llamadas de red, cero escritura de datos:
 * todo lo que el visitante "hace" (filtrar, abrir un detalle, hacer
 * una pregunta) es una operación de lectura/lectura sobre el mock,
 * nunca una mutación real.
 */
(function () {
  'use strict';

  var FS = window.FinanceStore;
  var EUR = window.FinanceFmt.eur;

  var root = document.getElementById('fdemo-main-content');
  var sidebarNav = document.getElementById('fdemo-sidebar-nav');
  var tabbarNav = document.getElementById('fdemo-tabbar-nav');
  var drawerEl = document.getElementById('fdemo-drawer');
  var drawerOverlay = document.getElementById('fdemo-drawer-overlay');
  var titleEl = document.getElementById('fdemo-view-title-tag');

  if (!root) return;

  var ICONS = {
    dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
    facturas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 3h10a1 1 0 011 1v16l-3-2-2 2-2-2-2 2-3-2V4a1 1 0 011-1z"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>',
    cobros: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5"/><path d="M6 11l6-6 6 6"/></svg>',
    gastos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M18 13l-6 6-6-6"/></svg>',
    presupuestos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v2h6V3"/><path d="M8 11h8M8 15h5"/></svg>',
    clientes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/></svg>',
    proveedores: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="8" width="13" height="10" rx="1"/><path d="M15 11h3l3 3v4h-6"/><circle cx="6.5" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/></svg>',
    proyectos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
    analisis: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19h16"/><path d="M7 15l4-5 3 3 5-7"/></svg>',
    pregunta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>'
  };

  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var CLOSE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  var VIEWS = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'facturas', label: 'Facturas' },
    { id: 'cobros', label: 'Cobros' },
    { id: 'gastos', label: 'Gastos' },
    { id: 'presupuestos', label: 'Presupuestos' },
    { id: 'clientes', label: 'Clientes' },
    { id: 'proveedores', label: 'Proveedores' },
    { id: 'proyectos', label: 'Proyectos' },
    { id: 'analisis', label: 'Análisis' },
    { id: 'pregunta', label: 'Pregunta a Finanzas' }
  ];

  var NAV_GROUPS = [
    { label: 'Día a día', items: ['dashboard', 'facturas', 'cobros', 'gastos'] },
    { label: 'Negocio', items: ['presupuestos', 'clientes', 'proveedores', 'proyectos'] },
    { label: 'Inteligencia', items: ['analisis', 'pregunta'] }
  ];

  var state = { invoiceFilter: 'all', quoteFilter: 'all', ask: [] };

  // ---------------------------------------------------------------
  // Utilidades de formato
  // ---------------------------------------------------------------
  function fmtDate(s) {
    if (!s) return '—';
    var d = new Date(s + 'T00:00:00');
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  }
  function badgeClass(status) {
    var map = { Pagada: 'st-pagada', Pendiente: 'st-pendiente', Vencida: 'st-vencida', Borrador: 'st-borrador', Aceptado: 'st-aceptado', Enviado: 'st-enviado', Rechazado: 'st-rechazado' };
    return map[status] || 'st-borrador';
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }

  // ---------------------------------------------------------------
  // Navegación (sidebar desktop + tabbar móvil)
  // ---------------------------------------------------------------
  function navItemHtml(v) {
    return '<a href="#' + v.id + '" class="fdemo-nav-item" data-nav="' + v.id + '">' + ICONS[v.id] + '<span>' + v.label + '</span></a>';
  }
  function viewById(id) { return VIEWS.filter(function (v) { return v.id === id; })[0]; }
  function groupedNavHtml() {
    return NAV_GROUPS.map(function (g) {
      return '<div class="fdemo-nav-group"><span class="fdemo-nav-group-label">' + g.label + '</span>' +
        g.items.map(function (id) { return navItemHtml(viewById(id)); }).join('') + '</div>';
    }).join('');
  }
  if (sidebarNav) sidebarNav.innerHTML = groupedNavHtml();
  if (tabbarNav) tabbarNav.innerHTML = VIEWS.map(navItemHtml).join('');

  function setActiveNav(viewId) {
    document.querySelectorAll('.fdemo-nav-item').forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-nav') === viewId);
    });
  }

  // ---------------------------------------------------------------
  // Router
  // ---------------------------------------------------------------
  function currentView() {
    var h = (location.hash || '#dashboard').replace('#', '');
    return VIEWS.some(function (v) { return v.id === h; }) ? h : 'dashboard';
  }

  function render() {
    var viewId = currentView();
    setActiveNav(viewId);
    var view = VIEWS.filter(function (v) { return v.id === viewId; })[0];
    if (titleEl) titleEl.textContent = view.label + ' · D-Code Finance (demo)';
    var renderer = RENDERERS[viewId];
    root.innerHTML = renderer ? renderer() : '';
    root.scrollTop = 0;
    closeDrawer();
  }
  window.addEventListener('hashchange', render);

  // ---------------------------------------------------------------
  // Charts — SVG generado en JS, sin librerías externas
  // ---------------------------------------------------------------
  function barChart(series) {
    var w = 560, h = 170, pad = 24, gap = 14;
    var n = series.length;
    var barW = (w - pad * 2 - gap * (n - 1)) / n;
    var maxVal = Math.max.apply(null, series.map(function (m) { return Math.max(m.collected, m.spent); }).concat([1]));
    var bars = series.map(function (m, i) {
      var x = pad + i * (barW + gap);
      var hCollected = (m.collected / maxVal) * (h - 40);
      var hSpent = (m.spent / maxVal) * (h - 40);
      var subW = (barW - 4) / 2;
      return '<rect class="bar" x="' + x + '" y="' + (h - 24 - hCollected) + '" width="' + subW + '" height="' + hCollected + '" rx="2"/>' +
        '<rect class="bar neg" x="' + (x + subW + 4) + '" y="' + (h - 24 - hSpent) + '" width="' + subW + '" height="' + hSpent + '" rx="2"/>' +
        '<text x="' + (x + barW / 2) + '" y="' + (h - 6) + '" text-anchor="middle">' + esc(m.label) + '</text>';
    }).join('');
    return '<svg class="fdemo-chart-bars" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid meet">' +
      '<defs><linearGradient id="fdemo-bar-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--cyan)"/><stop offset="100%" stop-color="var(--blue)"/></linearGradient></defs>' +
      bars + '</svg>';
  }

  function lineChart(series) {
    var w = 560, h = 170, pad = 24;
    var n = series.length;
    var stepX = (w - pad * 2) / (n - 1 || 1);
    var maxVal = Math.max.apply(null, series.map(function (m) { return Math.max(m.collected, m.spent); }).concat([1]));
    function pts(key) {
      return series.map(function (m, i) {
        var x = pad + i * stepX;
        var y = (h - 30) - (m[key] / maxVal) * (h - 50);
        return x + ',' + y;
      }).join(' ');
    }
    function dots(key, cls) {
      return series.map(function (m, i) {
        var x = pad + i * stepX;
        var y = (h - 30) - (m[key] / maxVal) * (h - 50);
        return '<circle class="' + cls + '" cx="' + x + '" cy="' + y + '" r="3"/>';
      }).join('');
    }
    var labels = series.map(function (m, i) {
      var x = pad + i * stepX;
      return '<text x="' + x + '" y="' + (h - 6) + '" text-anchor="middle">' + esc(m.label) + '</text>';
    }).join('');
    return '<svg class="fdemo-chart-line" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid meet">' +
      '<polyline class="line-collected" points="' + pts('collected') + '"/>' +
      '<polyline class="line-spent" points="' + pts('spent') + '"/>' +
      dots('collected', 'line-collected') + dots('spent', 'line-spent') + labels + '</svg>';
  }

  // ---------------------------------------------------------------
  // Renderers por vista
  // ---------------------------------------------------------------
  var RENDERERS = {};

  RENDERERS.dashboard = function () {
    var d = FS.dashboard();
    var delta = d.billedLastMonth > 0 ? Math.round(((d.billedThisMonth - d.billedLastMonth) / d.billedLastMonth) * 100) : 0;
    var overBudget = d.expensesThisMonth > d.expenseBudget;

    var upcomingHtml = d.upcoming.concat(d.overdue).length === 0
      ? '<div class="fdemo-empty"><p>No hay vencimientos próximos ni facturas vencidas.</p></div>'
      : d.overdue.concat(d.upcoming).map(function (inv) {
        var note = inv.status === 'Vencida' ? ('Vencida hace ' + inv.overdueDays + ' día' + (inv.overdueDays === 1 ? '' : 's')) : ('Vence en ' + inv.dueInDays + ' día' + (inv.dueInDays === 1 ? '' : 's'));
        return rowHtml({ id: inv.id, title: inv.client.name, sub: note, amount: inv.total, date: fmtDate(inv.dueDate), status: inv.status, action: 'open-invoice', target: inv.id });
      }).join('');

    var projectsHtml = d.activeProjects.map(function (p) {
      return '<div class="fdemo-row" data-action="open-project" data-id="' + p.id + '" role="button" tabindex="0" style="grid-template-columns:1fr auto;">' +
        '<div class="fdemo-row-main"><div class="fdemo-row-title">' + esc(p.name) + '</div><div class="fdemo-row-sub">' + esc(p.client.name) + '</div></div>' +
        '<div class="fdemo-row-amount">' + p.marginPct + '% margen</div></div>';
    }).join('') || '<div class="fdemo-empty"><p>No hay proyectos activos ahora mismo.</p></div>';

    var insightHtml = '<div class="fdemo-insight"><p class="fdemo-insight-headline">' + esc(d.insight.text) + '</p>' +
      (d.insight.bullets.length ? '<ul class="fdemo-insight-bullets">' + d.insight.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' : '') +
      '</div>';

    var todoHtml = d.todos.length
      ? d.todos.map(function (t) {
        return '<div class="fdemo-todo-item" data-action="goto" data-id="' + t.view + '" role="button" tabindex="0" style="cursor:pointer;">' +
          '<div class="fdemo-todo-main"><span class="fdemo-todo-dot ' + t.severity + '"></span>' +
          '<div><div class="fdemo-todo-label">' + esc(t.label) + '</div><div class="fdemo-todo-note">' + esc(t.note) + '</div></div></div>' +
          '<div class="fdemo-todo-amount">' + EUR(t.amount) + '<span>' + t.count + '</span></div></div>';
      }).join('')
      : '<div class="fdemo-todo-empty">Nada pendiente de atención ahora mismo.</div>';

    var agingTotal = d.aging.current + d.aging.d1_30 + d.aging.d31_60 + d.aging.d60plus;
    function agingPct(v) { return agingTotal > 0 ? Math.round((v / agingTotal) * 100) : 0; }
    var agingHtml = '<p class="fdemo-aging-total">' + EUR(agingTotal) + '</p>' +
      '<p class="fdemo-aging-sub">pendiente de cobro, por antigüedad</p>' +
      '<div class="fdemo-aging-bar">' +
      '<span class="current" style="width:' + agingPct(d.aging.current) + '%"></span>' +
      '<span class="d1-30" style="width:' + agingPct(d.aging.d1_30) + '%"></span>' +
      '<span class="d31-60" style="width:' + agingPct(d.aging.d31_60) + '%"></span>' +
      '<span class="d60plus" style="width:' + agingPct(d.aging.d60plus) + '%"></span>' +
      '</div>' +
      '<div class="fdemo-aging-legend">' +
      '<div class="fdemo-aging-row"><span class="fdemo-aging-row-label"><i class="current"></i>Al corriente</span><span class="fdemo-aging-row-amount">' + EUR(d.aging.current) + '</span></div>' +
      '<div class="fdemo-aging-row"><span class="fdemo-aging-row-label"><i class="d1-30"></i>1–30 días</span><span class="fdemo-aging-row-amount">' + EUR(d.aging.d1_30) + '</span></div>' +
      '<div class="fdemo-aging-row"><span class="fdemo-aging-row-label"><i class="d31-60"></i>31–60 días</span><span class="fdemo-aging-row-amount">' + EUR(d.aging.d31_60) + '</span></div>' +
      '<div class="fdemo-aging-row"><span class="fdemo-aging-row-label"><i class="d60plus"></i>60+ días</span><span class="fdemo-aging-row-amount">' + EUR(d.aging.d60plus) + '</span></div>' +
      '</div>';

    return '' +
      '<div class="fdemo-view-head"><span class="fdemo-view-eyebrow">Situación</span>' +
      '<h1 class="fdemo-view-title">Panel financiero</h1></div>' +

      insightHtml +

      '<div class="fdemo-view-head" style="margin:26px 0 14px;"><span class="fdemo-view-eyebrow">El dinero</span>' +
      '<h2 class="fdemo-panel-title" style="font-size:1.05rem;">Qué ha entrado, qué te deben y qué se ha pasado de fecha</h2></div>' +
      '<div class="fdemo-kpi-grid" style="grid-template-columns:repeat(3,1fr); margin-bottom:14px;">' +
      kpi('Cobrado', EUR(d.collectedTotalAllTime), 'dinero que ya ha entrado · todo el histórico', '') +
      kpi('Pendiente de cobro', EUR(d.pendingTotal), 'emitido y todavía sin cobrar', '') +
      kpi('Vencido', EUR(d.overdueTotal), 'pasado de fecha · reclámalo', d.overdueTotal > 0 ? 'down' : 'up') +
      '</div>' +
      '<div class="fdemo-kpi-grid">' +
      kpi('Facturado', EUR(d.billedTotalAllTime), 'todo el histórico', '') +
      kpi('Gastos', EUR(d.expensesTotalAllTime), 'todo el histórico', '') +
      kpi('Margen sobre facturado', EUR(d.marginTotalAllTime), 'sin descontar ' + EUR(d.pendingTotal) + ' sin cobrar', '') +
      kpi('Este mes: facturado', EUR(d.billedThisMonth), delta >= 0 ? ('▲ ' + delta + '% vs. mes anterior') : ('▼ ' + Math.abs(delta) + '% vs. mes anterior'), delta >= 0 ? 'up' : 'down') +
      '</div>' +

      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">Cobrado vs. gastado — últimos 6 meses</h2></div>' +
      barChart(d.series) +
      '<div class="fdemo-chart-legend"><span><i style="background:var(--cyan)"></i>Cobrado</span><span><i style="background:var(--amber)"></i>Gastado</span></div></div>' +

      '<div class="fdemo-view-head" style="margin:26px 0 14px;"><span class="fdemo-view-eyebrow">Qué hay que hacer</span>' +
      '<h2 class="fdemo-panel-title" style="font-size:1.05rem;">Lo que está esperando a alguien, por orden de urgencia</h2></div>' +
      '<div class="fdemo-panel-row">' +
      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">Requiere tu atención</h2></div>' + todoHtml + '</div>' +
      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">Antigüedad de la deuda</h2></div>' + agingHtml + '</div>' +
      '</div>' +

      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">Vencimientos y facturas vencidas</h2></div>' +
      '<div class="fdemo-rows">' + upcomingHtml + '</div></div>' +

      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">Proyectos activos</h2></div>' +
      '<div class="fdemo-rows">' + projectsHtml + '</div></div>' +

      '<div class="fdemo-panel" data-action="goto" data-id="pregunta" role="button" tabindex="0" style="cursor:pointer; display:flex; align-items:center; justify-content:space-between; gap:16px;">' +
      '<div><h2 class="fdemo-panel-title" style="margin-bottom:4px;">¿Cómo está mi empresa este mes?</h2><p style="margin:0; color:var(--stone); font-size:.86rem;">Pregúntaselo a Finanzas — respuestas calculadas sobre estos mismos datos.</p></div>' +
      '<span style="color:var(--cyan); flex-shrink:0;">' + ARROW + '</span></div>';
  };

  function kpi(label, value, caption, trend) {
    return '<div class="fdemo-kpi"><span class="fdemo-kpi-label">' + esc(label) + '</span>' +
      '<div class="fdemo-kpi-value">' + esc(value) + '</div>' +
      (caption ? '<div class="fdemo-kpi-caption' + (trend ? ' fdemo-kpi-delta ' + trend : '') + '">' + esc(caption) + '</div>' : '') +
      '</div>';
  }

  function rowHtml(o) {
    return '<div class="fdemo-row" data-action="' + o.action + '" data-id="' + o.target + '" role="button" tabindex="0">' +
      '<div class="fdemo-row-main"><div class="fdemo-row-title">' + esc(o.title) + '</div><div class="fdemo-row-sub">' + esc(o.sub) + '</div></div>' +
      '<div class="fdemo-row-id">' + esc(o.id) + '</div>' +
      '<div class="fdemo-row-amount">' + EUR(o.amount) + '</div>' +
      '<div class="fdemo-row-date">' + esc(o.date) + '</div>' +
      '<span class="fdemo-badge ' + badgeClass(o.status) + '">' + esc(o.status) + '</span>' +
      '</div>';
  }

  RENDERERS.facturas = function () {
    var all = FS.invoices().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    var filters = ['all', 'Pagada', 'Pendiente', 'Vencida', 'Borrador'];
    var labels = { all: 'Todas', Pagada: 'Pagadas', Pendiente: 'Pendientes', Vencida: 'Vencidas', Borrador: 'Borrador' };
    var list = state.invoiceFilter === 'all' ? all : all.filter(function (i) { return i.status === state.invoiceFilter; });
    var rows = list.map(function (inv) {
      return rowHtml({ id: inv.id, title: inv.client.name, sub: inv.lines[0].desc, amount: inv.total, date: fmtDate(inv.date), status: inv.status, action: 'open-invoice', target: inv.id });
    }).join('') || '<div class="fdemo-empty"><p>No hay facturas con este filtro.</p></div>';

    return viewHead('Facturas', 'Documento de cobro por cada venta: numeración, estado y vencimiento de un vistazo.') +
      '<div class="fdemo-panel"><div class="fdemo-tabs">' + filters.map(function (f) {
        return '<button class="fdemo-tab' + (state.invoiceFilter === f ? ' is-active' : '') + '" data-action="filter-invoices" data-id="' + f + '">' + labels[f] + '</button>';
      }).join('') + '</div><div class="fdemo-rows" style="margin-top:16px;">' + rows + '</div></div>';
  };

  RENDERERS.cobros = function () {
    var pending = FS.pendingCollections();
    var payments = FS.payments();
    var pendingTotal = pending.reduce(function (s, i) { return s + i.total; }, 0);
    var vencidoTotal = pending.filter(function (i) { return i.status === 'Vencida'; }).reduce(function (s, i) { return s + i.total; }, 0);

    var pendingRows = pending.map(function (inv) {
      var note = inv.status === 'Vencida' ? ('Vencida hace ' + inv.overdueDays + ' d.') : ('Vence ' + fmtDate(inv.dueDate));
      return rowHtml({ id: inv.id, title: inv.client.name, sub: note, amount: inv.total, date: fmtDate(inv.dueDate), status: inv.status, action: 'open-invoice', target: inv.id });
    }).join('') || '<div class="fdemo-empty"><p>No hay cobros pendientes.</p></div>';

    var paymentRows = payments.slice(0, 10).map(function (p) {
      return rowHtml({ id: p.invoice.id, title: p.client.name, sub: 'Cobrado', amount: p.amount, date: fmtDate(p.date), status: 'Pagada', action: 'open-invoice', target: p.invoice.id });
    }).join('');

    return viewHead('Cobros', 'Qué te deben, qué ya has cobrado, y qué está a punto de vencer.') +
      '<div class="fdemo-kpi-grid" style="grid-template-columns:repeat(3,1fr);">' +
      kpi('Pendiente de cobro', EUR(pendingTotal), pending.length + ' facturas', '') +
      kpi('Vencido', EUR(vencidoTotal), vencidoTotal > 0 ? 'requiere seguimiento' : 'al día', vencidoTotal > 0 ? 'down' : 'up') +
      kpi('Cobrado este mes', EUR(FS.dashboard().collectedThisMonth), '', '') +
      '</div>' +
      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">Próximos cobros</h2></div><div class="fdemo-rows">' + pendingRows + '</div></div>' +
      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">Historial de cobros</h2></div><div class="fdemo-rows">' + paymentRows + '</div></div>';
  };

  RENDERERS.gastos = function () {
    var expenses = FS.expenses();
    var byCat = FS.expensesByCategory();
    var maxCat = Math.max.apply(null, byCat.map(function (c) { return c.total; }).concat([1]));
    var d = FS.dashboard();
    var overBudget = d.expensesThisMonth > d.expenseBudget;

    var catRows = byCat.map(function (c) {
      return '<div class="fdemo-cat-row"><span class="fdemo-cat-label">' + esc(c.category) + '</span>' +
        '<div class="fdemo-cat-track"><span style="width:' + Math.round((c.total / maxCat) * 100) + '%;"></span></div>' +
        '<span class="fdemo-cat-amount">' + EUR(c.total) + '</span></div>';
    }).join('');

    var rows = expenses.map(function (e) {
      return rowHtml({ id: e.id, title: e.concept, sub: e.category + (e.supplier ? ' · ' + e.supplier.name : ''), amount: e.amount, date: fmtDate(e.date), status: e.category === 'Freelance' ? 'Pendiente' : 'Pagada', action: 'open-expense', target: e.id });
    }).join('');

    return viewHead('Gastos', 'Lo que sale de la cuenta, categorizado, con alerta si te pasas del presupuesto mensual.') +
      '<div class="fdemo-kpi-grid" style="grid-template-columns:repeat(2,1fr);">' +
      kpi('Gasto de este mes', EUR(d.expensesThisMonth), (overBudget ? '▲ por encima del' : '✓ dentro del') + ' presupuesto (' + EUR(d.expenseBudget) + ')', overBudget ? 'down' : 'up') +
      kpi('Gasto acumulado (6 meses)', EUR(byCat.reduce(function (s, c) { return s + c.total; }, 0)), byCat.length + ' categorías', '') +
      '</div>' +
      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">Distribución por categoría</h2></div>' + catRows + '</div>' +
      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">Movimientos recientes</h2></div><div class="fdemo-rows">' + rows + '</div></div>';
  };

  RENDERERS.presupuestos = function () {
    var all = FS.quotes().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    var filters = ['all', 'Aceptado', 'Enviado', 'Rechazado', 'Borrador'];
    var labels = { all: 'Todos', Aceptado: 'Aceptados', Enviado: 'Enviados', Rechazado: 'Rechazados', Borrador: 'Borrador' };
    var list = state.quoteFilter === 'all' ? all : all.filter(function (q) { return q.status === state.quoteFilter; });
    var rows = list.map(function (q) {
      return rowHtml({ id: q.id, title: q.client.name, sub: q.title, amount: q.amount, date: fmtDate(q.date), status: q.status, action: 'open-quote', target: q.id });
    }).join('') || '<div class="fdemo-empty"><p>No hay presupuestos con este filtro.</p></div>';

    return viewHead('Presupuestos', 'La oferta antes de facturar. Al aceptarse, se convierte en factura.') +
      '<div class="fdemo-panel"><div class="fdemo-tabs">' + filters.map(function (f) {
        return '<button class="fdemo-tab' + (state.quoteFilter === f ? ' is-active' : '') + '" data-action="filter-quotes" data-id="' + f + '">' + labels[f] + '</button>';
      }).join('') + '</div><div class="fdemo-rows" style="margin-top:16px;">' + rows + '</div></div>';
  };

  RENDERERS.clientes = function () {
    var clients = FS.clients();
    var rows = clients.map(function (c) {
      return rowHtml({ id: c.invoiceCount + ' fact.', title: c.name, sub: c.sector, amount: c.billedTotal, date: '', status: c.pendingTotal > 0 ? 'Pendiente' : 'Pagada', action: 'open-client', target: c.id });
    }).join('');

    return viewHead('Clientes', 'A quién le facturas: historial y estado de cobro por cliente.') +
      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">' + clients.length + ' clientes activos</h2></div><div class="fdemo-rows">' + rows + '</div></div>';
  };

  RENDERERS.proveedores = function () {
    var suppliers = FS.suppliers();
    var rows = suppliers.map(function (s) {
      return rowHtml({ id: s.expenseCount + ' gastos', title: s.name, sub: s.category, amount: s.total, date: '', status: 'Pagada', action: 'open-supplier', target: s.id });
    }).join('');

    return viewHead('Proveedores', 'A quién le pagas: gasto acumulado por proveedor.') +
      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">' + suppliers.length + ' proveedores</h2></div><div class="fdemo-rows">' + rows + '</div></div>';
  };

  RENDERERS.proyectos = function () {
    var projects = FS.projects();
    var rows = projects.map(function (p) {
      return '<div class="fdemo-row" data-action="open-project" data-id="' + p.id + '" role="button" tabindex="0">' +
        '<div class="fdemo-row-main"><div class="fdemo-row-title">' + esc(p.name) + '</div><div class="fdemo-row-sub">' + esc(p.client.name) + '</div></div>' +
        '<div class="fdemo-row-id">' + esc(p.status) + '</div>' +
        '<div class="fdemo-row-amount">' + EUR(p.revenue) + '</div>' +
        '<div class="fdemo-row-date">margen ' + p.marginPct + '%</div>' +
        '<span class="fdemo-badge ' + (p.status === 'Completado' ? 'st-pagada' : 'st-pendiente') + '">' + esc(p.status) + '</span></div>';
    }).join('');

    return viewHead('Proyectos', 'El trabajo vinculado a la facturación: ingresos, gastos y margen por proyecto.') +
      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">' + projects.length + ' proyectos</h2></div><div class="fdemo-rows">' + rows + '</div></div>';
  };

  RENDERERS.analisis = function () {
    var series = FS.monthlySeries(6);
    var projects = FS.projects().slice().sort(function (a, b) { return b.marginPct - a.marginPct; });
    var maxMargin = Math.max.apply(null, projects.map(function (p) { return p.marginPct; }).concat([1]));

    var projectBars = projects.map(function (p) {
      return '<div class="fdemo-cat-row"><span class="fdemo-cat-label">' + esc(p.name) + '</span>' +
        '<div class="fdemo-cat-track"><span style="width:' + Math.round((p.marginPct / maxMargin) * 100) + '%;"></span></div>' +
        '<span class="fdemo-cat-amount">' + p.marginPct + '%</span></div>';
    }).join('');

    return viewHead('Análisis', 'La evolución del negocio, sin abrir una hoja de cálculo.') +
      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">Evolución mensual — cobrado vs. gastado</h2></div>' +
      lineChart(series) +
      '<div class="fdemo-chart-legend"><span><i style="background:var(--cyan)"></i>Cobrado</span><span><i style="background:var(--amber)"></i>Gastado</span></div></div>' +
      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">Rentabilidad por proyecto</h2></div>' + projectBars + '</div>';
  };

  RENDERERS.pregunta = function () {
    var suggestions = FS.askQuestions();
    var thread = state.ask.map(function (msg) {
      if (msg.role === 'user') {
        return '<div class="fdemo-ask-msg user"><div class="fdemo-ask-bubble">' + esc(msg.text) + '</div></div>';
      }
      var refs = (msg.refs || []).map(function (r) {
        return '<button class="fdemo-ask-ref" data-action="open-' + r.type + '" data-id="' + r.id + '">' + esc(r.id) + '</button>';
      }).join('');
      return '<div class="fdemo-ask-msg bot"><div class="fdemo-ask-bubble">' + esc(msg.text) + (refs ? '<div class="fdemo-ask-refs">' + refs + '</div>' : '') + '</div></div>';
    }).join('');

    return viewHead('Pregunta a Finanzas', 'Pregunta en lenguaje natural. Cada respuesta se calcula en el momento a partir de los datos de esta demo — nunca es texto inventado.') +
      '<div class="fdemo-panel">' +
      '<div class="fdemo-ask-suggestions">' + suggestions.map(function (s, i) {
        return '<button class="fdemo-ask-chip" data-action="ask" data-id="' + i + '">' + esc(s.q) + '</button>';
      }).join('') + '</div>' +
      '<div class="fdemo-ask-thread" id="fdemo-ask-thread">' + (thread || '<p class="fdemo-ask-empty-hint">Elige una pregunta de arriba para ver cómo respondería el asistente.</p>') + '</div>' +
      '</div>';
  };

  function viewHead(title, sub) {
    return '<div class="fdemo-view-head"><span class="fdemo-view-eyebrow">D-Code Finance · Demo</span>' +
      '<h1 class="fdemo-view-title">' + esc(title) + '</h1>' +
      '<p class="fdemo-view-sub">' + esc(sub) + '</p>' +
      '<span class="fdemo-demo-note"><span class="dot"></span>Entorno de demostración · Datos ficticios</span></div>';
  }

  // ---------------------------------------------------------------
  // Drawer de detalle
  // ---------------------------------------------------------------
  function openDrawer(html) {
    drawerEl.innerHTML = '<button class="fdemo-drawer-close" data-action="close-drawer" aria-label="Cerrar">' + CLOSE_ICON + '</button>' + html;
    drawerEl.classList.add('is-open');
    drawerOverlay.classList.add('is-open');
    drawerEl.setAttribute('aria-hidden', 'false');
  }
  function closeDrawer() {
    drawerEl.classList.remove('is-open');
    drawerOverlay.classList.remove('is-open');
    drawerEl.setAttribute('aria-hidden', 'true');
  }

  function invoiceDrawer(id) {
    var inv = FS.invoice(id);
    if (!inv) return;
    var lines = inv.lines.map(function (l) {
      return '<div class="fdemo-kv"><span>' + esc(l.desc) + ' × ' + l.qty + '</span><span>' + EUR(l.qty * l.price) + '</span></div>';
    }).join('');
    openDrawer(
      '<span class="fdemo-drawer-eyebrow">Factura</span>' +
      '<h3 class="fdemo-drawer-title">' + esc(inv.id) + '</h3>' +
      '<div class="fdemo-drawer-meta"><span class="fdemo-badge ' + badgeClass(inv.status) + '">' + esc(inv.status) + '</span></div>' +
      '<div class="fdemo-drawer-section"><h4>Líneas</h4>' + lines + '<div class="fdemo-kv" style="border-top:1px solid var(--border); margin-top:6px; padding-top:10px; font-weight:700;"><span>Total</span><span>' + EUR(inv.total) + '</span></div></div>' +
      '<div class="fdemo-drawer-section"><h4>Fechas</h4>' +
      '<div class="fdemo-kv"><span>Emisión</span><span>' + fmtDate(inv.date) + '</span></div>' +
      '<div class="fdemo-kv"><span>Vencimiento</span><span>' + fmtDate(inv.dueDate) + '</span></div>' +
      (inv.paidDate ? '<div class="fdemo-kv"><span>Cobrada</span><span>' + fmtDate(inv.paidDate) + '</span></div>' : '') + '</div>' +
      '<div class="fdemo-drawer-section"><h4>Cliente</h4><button class="fdemo-drawer-link" data-action="open-client" data-id="' + inv.client.id + '">' + esc(inv.client.name) + ARROW + '</button></div>' +
      (inv.project ? '<div class="fdemo-drawer-section"><h4>Proyecto</h4><button class="fdemo-drawer-link" data-action="open-project" data-id="' + inv.project.id + '">' + esc(inv.project.name) + ARROW + '</button></div>' : '')
    );
  }

  function expenseDrawer(id) {
    var e = FS.expenses().filter(function (x) { return x.id === id; })[0];
    if (!e) return;
    openDrawer(
      '<span class="fdemo-drawer-eyebrow">Gasto</span>' +
      '<h3 class="fdemo-drawer-title">' + esc(e.concept) + '</h3>' +
      '<div class="fdemo-drawer-meta"><span class="fdemo-badge st-pendiente">' + esc(e.category) + '</span></div>' +
      '<div class="fdemo-drawer-section"><h4>Detalle</h4>' +
      '<div class="fdemo-kv"><span>Importe</span><span>' + EUR(e.amount) + '</span></div>' +
      '<div class="fdemo-kv"><span>Fecha</span><span>' + fmtDate(e.date) + '</span></div>' +
      (e.supplier ? '<div class="fdemo-kv"><span>Proveedor</span><span>' + esc(e.supplier.name) + '</span></div>' : '') + '</div>' +
      (e.project ? '<div class="fdemo-drawer-section"><h4>Proyecto</h4><button class="fdemo-drawer-link" data-action="open-project" data-id="' + e.project.id + '">' + esc(e.project.name) + ARROW + '</button></div>' : '')
    );
  }

  function quoteDrawer(id) {
    var q = FS.quote(id);
    if (!q) return;
    openDrawer(
      '<span class="fdemo-drawer-eyebrow">Presupuesto</span>' +
      '<h3 class="fdemo-drawer-title">' + esc(q.title) + '</h3>' +
      '<div class="fdemo-drawer-meta"><span class="fdemo-badge ' + badgeClass(q.status) + '">' + esc(q.status) + '</span></div>' +
      '<div class="fdemo-drawer-section"><h4>Detalle</h4>' +
      '<div class="fdemo-kv"><span>Importe</span><span>' + EUR(q.amount) + '</span></div>' +
      '<div class="fdemo-kv"><span>Fecha</span><span>' + fmtDate(q.date) + '</span></div></div>' +
      '<div class="fdemo-drawer-section"><h4>Cliente</h4><button class="fdemo-drawer-link" data-action="open-client" data-id="' + q.client.id + '">' + esc(q.client.name) + ARROW + '</button></div>' +
      (q.project ? '<div class="fdemo-drawer-section"><h4>Proyecto generado</h4><button class="fdemo-drawer-link" data-action="open-project" data-id="' + q.project.id + '">' + esc(q.project.name) + ARROW + '</button></div>' : '')
    );
  }

  function clientDrawer(id) {
    var c = FS.clients().filter(function (x) { return x.id === id; })[0];
    if (!c) return;
    var invs = FS.invoicesByClient(id).sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    var rows = invs.map(function (i) {
      return '<div class="fdemo-kv"><span>' + esc(i.id) + ' — ' + fmtDate(i.date) + '</span><span>' + EUR(i.total) + '</span></div>';
    }).join('');
    openDrawer(
      '<span class="fdemo-drawer-eyebrow">Cliente</span>' +
      '<h3 class="fdemo-drawer-title">' + esc(c.name) + '</h3>' +
      '<div class="fdemo-drawer-meta"><span class="fdemo-badge st-pagada">' + esc(c.sector) + '</span></div>' +
      '<div class="fdemo-drawer-section"><h4>Contacto</h4>' +
      '<div class="fdemo-kv"><span>Email</span><span>' + esc(c.email) + '</span></div>' +
      '<div class="fdemo-kv"><span>Cliente desde</span><span>' + fmtDate(c.since) + '</span></div></div>' +
      '<div class="fdemo-drawer-section"><h4>Facturación total</h4>' +
      '<div class="fdemo-kv"><span>Facturado</span><span>' + EUR(c.billedTotal) + '</span></div>' +
      '<div class="fdemo-kv"><span>Pendiente</span><span>' + EUR(c.pendingTotal) + '</span></div></div>' +
      '<div class="fdemo-drawer-section"><h4>Facturas (' + invs.length + ')</h4>' + rows + '</div>'
    );
  }

  function supplierDrawer(id) {
    var s = FS.suppliers().filter(function (x) { return x.id === id; })[0];
    if (!s) return;
    var exps = FS.expenses().filter(function (e) { return e.supplierId === id; });
    var rows = exps.map(function (e) {
      return '<div class="fdemo-kv"><span>' + esc(e.concept) + ' — ' + fmtDate(e.date) + '</span><span>' + EUR(e.amount) + '</span></div>';
    }).join('');
    openDrawer(
      '<span class="fdemo-drawer-eyebrow">Proveedor</span>' +
      '<h3 class="fdemo-drawer-title">' + esc(s.name) + '</h3>' +
      '<div class="fdemo-drawer-meta"><span class="fdemo-badge st-pendiente">' + esc(s.category) + '</span></div>' +
      '<div class="fdemo-drawer-section"><h4>Gasto acumulado</h4><div class="fdemo-kv"><span>Total</span><span>' + EUR(s.total) + '</span></div></div>' +
      '<div class="fdemo-drawer-section"><h4>Gastos (' + exps.length + ')</h4>' + rows + '</div>'
    );
  }

  function projectDrawer(id) {
    var p = FS.project(id);
    if (!p) return;
    var invs = FS.invoicesByProject(id);
    var rows = invs.map(function (i) {
      return '<div class="fdemo-kv"><span>' + esc(i.id) + ' — ' + fmtDate(i.date) + '</span><span>' + EUR(i.total) + '</span></div>';
    }).join('');
    openDrawer(
      '<span class="fdemo-drawer-eyebrow">Proyecto</span>' +
      '<h3 class="fdemo-drawer-title">' + esc(p.name) + '</h3>' +
      '<div class="fdemo-drawer-meta"><span class="fdemo-badge ' + (p.status === 'Completado' ? 'st-pagada' : 'st-pendiente') + '">' + esc(p.status) + '</span></div>' +
      '<div class="fdemo-drawer-section"><h4>Cliente</h4><button class="fdemo-drawer-link" data-action="open-client" data-id="' + p.client.id + '">' + esc(p.client.name) + ARROW + '</button></div>' +
      '<div class="fdemo-drawer-section"><h4>Rentabilidad</h4>' +
      '<div class="fdemo-kv"><span>Ingresos</span><span>' + EUR(p.revenue) + '</span></div>' +
      '<div class="fdemo-kv"><span>Gastos</span><span>' + EUR(p.cost) + '</span></div>' +
      '<div class="fdemo-kv" style="border-top:1px solid var(--border); padding-top:8px; font-weight:700;"><span>Margen</span><span>' + EUR(p.margin) + ' (' + p.marginPct + '%)</span></div></div>' +
      '<div class="fdemo-drawer-section"><h4>Facturas vinculadas (' + invs.length + ')</h4>' + (rows || '<p style="color:var(--stone-soft); font-size:.84rem;">Ninguna todavía.</p>') + '</div>'
    );
  }

  // ---------------------------------------------------------------
  // Delegación de eventos
  // ---------------------------------------------------------------
  function handleAction(el) {
    var action = el.getAttribute('data-action');
    var id = el.getAttribute('data-id');
    switch (action) {
      case 'open-invoice': invoiceDrawer(id); break;
      case 'open-expense': expenseDrawer(id); break;
      case 'open-quote': quoteDrawer(id); break;
      case 'open-client': clientDrawer(id); break;
      case 'open-supplier': supplierDrawer(id); break;
      case 'open-project': projectDrawer(id); break;
      case 'close-drawer': closeDrawer(); break;
      case 'goto': location.hash = '#' + id; break;
      case 'filter-invoices': state.invoiceFilter = id; render(); break;
      case 'filter-quotes': state.quoteFilter = id; render(); break;
      case 'ask': {
        var q = FS.askQuestions()[Number(id)];
        if (!q) return;
        var answer = q.a();
        state.ask.push({ role: 'user', text: q.q });
        state.ask.push({ role: 'bot', text: answer.text, refs: answer.refs });
        render();
        location.hash = '#pregunta';
        setTimeout(function () {
          var thread = document.getElementById('fdemo-ask-thread');
          if (thread) thread.scrollTop = thread.scrollHeight;
        }, 30);
        break;
      }
    }
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]');
    if (el) { e.preventDefault(); handleAction(el); return; }
    if (e.target === drawerOverlay) closeDrawer();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
    if (e.key === 'Enter' && document.activeElement && document.activeElement.hasAttribute('data-action')) {
      handleAction(document.activeElement);
    }
  });

  render();
})();
