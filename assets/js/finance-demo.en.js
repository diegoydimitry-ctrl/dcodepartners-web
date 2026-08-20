/*
 * D-Code Finance — demo app shell (router + render). English mirror.
 *
 * Single-page app, hash-routed (#dashboard, #invoices...), reading ALL
 * its content through FinanceStore (finance-demo-data.en.js). No build
 * step, no framework: DOM generated with template strings and a single
 * delegated listener per view, following the same vanilla-JS pattern
 * already used across the rest of the site in main.js. Zero network
 * calls, zero data writes: everything the visitor "does" (filter, open
 * a detail, ask a question) is a read-only operation on the mock,
 * never a real mutation.
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
    { id: 'facturas', label: 'Invoices' },
    { id: 'cobros', label: 'Collections' },
    { id: 'gastos', label: 'Expenses' },
    { id: 'presupuestos', label: 'Quotes' },
    { id: 'clientes', label: 'Clients' },
    { id: 'proveedores', label: 'Suppliers' },
    { id: 'proyectos', label: 'Projects' },
    { id: 'analisis', label: 'Analysis' },
    { id: 'pregunta', label: 'Ask Finance' }
  ];

  var NAV_GROUPS = [
    { label: 'Day to day', items: ['dashboard', 'facturas', 'cobros', 'gastos'] },
    { label: 'Business', items: ['presupuestos', 'clientes', 'proveedores', 'proyectos'] },
    { label: 'Intelligence', items: ['analisis', 'pregunta'] }
  ];

  var state = { invoiceFilter: 'all', quoteFilter: 'all', ask: [] };

  // ---------------------------------------------------------------
  // Format utilities
  // ---------------------------------------------------------------
  function fmtDate(s) {
    if (!s) return '—';
    var d = new Date(s + 'T00:00:00');
    return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
  }
  function badgeClass(status) {
    var map = { Paid: 'st-pagada', Pending: 'st-pendiente', Overdue: 'st-vencida', Draft: 'st-borrador', Accepted: 'st-aceptado', Sent: 'st-enviado', Rejected: 'st-rechazado' };
    return map[status] || 'st-borrador';
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }

  // ---------------------------------------------------------------
  // Navigation (desktop sidebar + mobile tabbar)
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
  // Charts — SVG generated in JS, no external libraries
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
  // Per-view renderers
  // ---------------------------------------------------------------
  var RENDERERS = {};

  RENDERERS.dashboard = function () {
    var d = FS.dashboard();
    var delta = d.billedLastMonth > 0 ? Math.round(((d.billedThisMonth - d.billedLastMonth) / d.billedLastMonth) * 100) : 0;
    var overBudget = d.expensesThisMonth > d.expenseBudget;

    var upcomingHtml = d.upcoming.concat(d.overdue).length === 0
      ? '<div class="fdemo-empty"><p>No upcoming due dates or overdue invoices.</p></div>'
      : d.overdue.concat(d.upcoming).map(function (inv) {
        var note = inv.status === 'Overdue' ? ('Overdue by ' + inv.overdueDays + ' day' + (inv.overdueDays === 1 ? '' : 's')) : ('Due in ' + inv.dueInDays + ' day' + (inv.dueInDays === 1 ? '' : 's'));
        return rowHtml({ id: inv.id, title: inv.client.name, sub: note, amount: inv.total, date: fmtDate(inv.dueDate), status: inv.status, action: 'open-invoice', target: inv.id });
      }).join('');

    var projectsHtml = d.activeProjects.map(function (p) {
      return '<div class="fdemo-row" data-action="open-project" data-id="' + p.id + '" role="button" tabindex="0" style="grid-template-columns:1fr auto;">' +
        '<div class="fdemo-row-main"><div class="fdemo-row-title">' + esc(p.name) + '</div><div class="fdemo-row-sub">' + esc(p.client.name) + '</div></div>' +
        '<div class="fdemo-row-amount">' + p.marginPct + '% margin</div></div>';
    }).join('') || '<div class="fdemo-empty"><p>No active projects right now.</p></div>';

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
      : '<div class="fdemo-todo-empty">Nothing needs attention right now.</div>';

    var agingTotal = d.aging.current + d.aging.d1_30 + d.aging.d31_60 + d.aging.d60plus;
    function agingPct(v) { return agingTotal > 0 ? Math.round((v / agingTotal) * 100) : 0; }
    var agingHtml = '<p class="fdemo-aging-total">' + EUR(agingTotal) + '</p>' +
      '<p class="fdemo-aging-sub">pending collection, by age</p>' +
      '<div class="fdemo-aging-bar">' +
      '<span class="current" style="width:' + agingPct(d.aging.current) + '%"></span>' +
      '<span class="d1-30" style="width:' + agingPct(d.aging.d1_30) + '%"></span>' +
      '<span class="d31-60" style="width:' + agingPct(d.aging.d31_60) + '%"></span>' +
      '<span class="d60plus" style="width:' + agingPct(d.aging.d60plus) + '%"></span>' +
      '</div>' +
      '<div class="fdemo-aging-legend">' +
      '<div class="fdemo-aging-row"><span class="fdemo-aging-row-label"><i class="current"></i>Current</span><span class="fdemo-aging-row-amount">' + EUR(d.aging.current) + '</span></div>' +
      '<div class="fdemo-aging-row"><span class="fdemo-aging-row-label"><i class="d1-30"></i>1–30 days</span><span class="fdemo-aging-row-amount">' + EUR(d.aging.d1_30) + '</span></div>' +
      '<div class="fdemo-aging-row"><span class="fdemo-aging-row-label"><i class="d31-60"></i>31–60 days</span><span class="fdemo-aging-row-amount">' + EUR(d.aging.d31_60) + '</span></div>' +
      '<div class="fdemo-aging-row"><span class="fdemo-aging-row-label"><i class="d60plus"></i>60+ days</span><span class="fdemo-aging-row-amount">' + EUR(d.aging.d60plus) + '</span></div>' +
      '</div>';

    return '' +
      '<div class="fdemo-view-head"><span class="fdemo-view-eyebrow">Status</span>' +
      '<h1 class="fdemo-view-title">Financial overview</h1></div>' +

      insightHtml +

      '<div class="fdemo-view-head" style="margin:26px 0 14px;"><span class="fdemo-view-eyebrow">The money</span>' +
      '<h2 class="fdemo-panel-title" style="font-size:1.05rem;">What came in, what you’re owed, and what’s overdue</h2></div>' +
      '<div class="fdemo-kpi-grid" style="grid-template-columns:repeat(3,1fr); margin-bottom:14px;">' +
      kpi('Collected', EUR(d.collectedTotalAllTime), 'money already in · full history', '') +
      kpi('Pending collection', EUR(d.pendingTotal), 'issued and not yet collected', '') +
      kpi('Overdue', EUR(d.overdueTotal), 'past due · follow up on it', d.overdueTotal > 0 ? 'down' : 'up') +
      '</div>' +
      '<div class="fdemo-kpi-grid">' +
      kpi('Billed', EUR(d.billedTotalAllTime), 'full history', '') +
      kpi('Expenses', EUR(d.expensesTotalAllTime), 'full history', '') +
      kpi('Margin on billed', EUR(d.marginTotalAllTime), 'not deducting ' + EUR(d.pendingTotal) + ' still uncollected', '') +
      kpi('This month: billed', EUR(d.billedThisMonth), delta >= 0 ? ('▲ ' + delta + '% vs. last month') : ('▼ ' + Math.abs(delta) + '% vs. last month'), delta >= 0 ? 'up' : 'down') +
      '</div>' +

      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">Collected vs. spent — last 6 months</h2></div>' +
      barChart(d.series) +
      '<div class="fdemo-chart-legend"><span><i style="background:var(--cyan)"></i>Collected</span><span><i style="background:var(--amber)"></i>Spent</span></div></div>' +

      '<div class="fdemo-view-head" style="margin:26px 0 14px;"><span class="fdemo-view-eyebrow">What needs attention</span>' +
      '<h2 class="fdemo-panel-title" style="font-size:1.05rem;">What’s waiting on someone, in order of urgency</h2></div>' +
      '<div class="fdemo-panel-row">' +
      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">Needs your attention</h2></div>' + todoHtml + '</div>' +
      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">Debt aging</h2></div>' + agingHtml + '</div>' +
      '</div>' +

      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">Due dates and overdue invoices</h2></div>' +
      '<div class="fdemo-rows">' + upcomingHtml + '</div></div>' +

      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">Active projects</h2></div>' +
      '<div class="fdemo-rows">' + projectsHtml + '</div></div>' +

      '<div class="fdemo-panel" data-action="goto" data-id="pregunta" role="button" tabindex="0" style="cursor:pointer; display:flex; align-items:center; justify-content:space-between; gap:16px;">' +
      '<div><h2 class="fdemo-panel-title" style="margin-bottom:4px;">How is my company doing this month?</h2><p style="margin:0; color:var(--stone); font-size:.86rem;">Ask Finance — answers computed on this same data.</p></div>' +
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
    var filters = ['all', 'Paid', 'Pending', 'Overdue', 'Draft'];
    var labels = { all: 'All', Paid: 'Paid', Pending: 'Pending', Overdue: 'Overdue', Draft: 'Draft' };
    var list = state.invoiceFilter === 'all' ? all : all.filter(function (i) { return i.status === state.invoiceFilter; });
    var rows = list.map(function (inv) {
      return rowHtml({ id: inv.id, title: inv.client.name, sub: inv.lines[0].desc, amount: inv.total, date: fmtDate(inv.date), status: inv.status, action: 'open-invoice', target: inv.id });
    }).join('') || '<div class="fdemo-empty"><p>No invoices match this filter.</p></div>';

    return viewHead('Invoices', 'The billing document for every sale: numbering, status and due date at a glance.') +
      '<div class="fdemo-panel"><div class="fdemo-tabs">' + filters.map(function (f) {
        return '<button class="fdemo-tab' + (state.invoiceFilter === f ? ' is-active' : '') + '" data-action="filter-invoices" data-id="' + f + '">' + labels[f] + '</button>';
      }).join('') + '</div><div class="fdemo-rows" style="margin-top:16px;">' + rows + '</div></div>';
  };

  RENDERERS.cobros = function () {
    var pending = FS.pendingCollections();
    var payments = FS.payments();
    var pendingTotal = pending.reduce(function (s, i) { return s + i.total; }, 0);
    var overdueTotal = pending.filter(function (i) { return i.status === 'Overdue'; }).reduce(function (s, i) { return s + i.total; }, 0);

    var pendingRows = pending.map(function (inv) {
      var note = inv.status === 'Overdue' ? ('Overdue by ' + inv.overdueDays + ' d.') : ('Due ' + fmtDate(inv.dueDate));
      return rowHtml({ id: inv.id, title: inv.client.name, sub: note, amount: inv.total, date: fmtDate(inv.dueDate), status: inv.status, action: 'open-invoice', target: inv.id });
    }).join('') || '<div class="fdemo-empty"><p>No pending collections.</p></div>';

    var paymentRows = payments.slice(0, 10).map(function (p) {
      return rowHtml({ id: p.invoice.id, title: p.client.name, sub: 'Collected', amount: p.amount, date: fmtDate(p.date), status: 'Paid', action: 'open-invoice', target: p.invoice.id });
    }).join('');

    return viewHead('Collections', 'What’s owed to you, what you’ve already collected, and what’s about to fall due.') +
      '<div class="fdemo-kpi-grid" style="grid-template-columns:repeat(3,1fr);">' +
      kpi('Pending collection', EUR(pendingTotal), pending.length + ' invoices', '') +
      kpi('Overdue', EUR(overdueTotal), overdueTotal > 0 ? 'needs follow-up' : 'all clear', overdueTotal > 0 ? 'down' : 'up') +
      kpi('Collected this month', EUR(FS.dashboard().collectedThisMonth), '', '') +
      '</div>' +
      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">Upcoming collections</h2></div><div class="fdemo-rows">' + pendingRows + '</div></div>' +
      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">Collection history</h2></div><div class="fdemo-rows">' + paymentRows + '</div></div>';
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
      return rowHtml({ id: e.id, title: e.concept, sub: e.category + (e.supplier ? ' · ' + e.supplier.name : ''), amount: e.amount, date: fmtDate(e.date), status: e.category === 'Freelance' ? 'Pending' : 'Paid', action: 'open-expense', target: e.id });
    }).join('');

    return viewHead('Expenses', 'What goes out of the account, categorized, with an alert if you go over the monthly budget.') +
      '<div class="fdemo-kpi-grid" style="grid-template-columns:repeat(2,1fr);">' +
      kpi('Spend this month', EUR(d.expensesThisMonth), (overBudget ? '▲ over the' : '✓ within') + ' budget (' + EUR(d.expenseBudget) + ')', overBudget ? 'down' : 'up') +
      kpi('Accumulated spend (6 months)', EUR(byCat.reduce(function (s, c) { return s + c.total; }, 0)), byCat.length + ' categories', '') +
      '</div>' +
      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">Distribution by category</h2></div>' + catRows + '</div>' +
      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">Recent movements</h2></div><div class="fdemo-rows">' + rows + '</div></div>';
  };

  RENDERERS.presupuestos = function () {
    var all = FS.quotes().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    var filters = ['all', 'Accepted', 'Sent', 'Rejected', 'Draft'];
    var labels = { all: 'All', Accepted: 'Accepted', Sent: 'Sent', Rejected: 'Rejected', Draft: 'Draft' };
    var list = state.quoteFilter === 'all' ? all : all.filter(function (q) { return q.status === state.quoteFilter; });
    var rows = list.map(function (q) {
      return rowHtml({ id: q.id, title: q.client.name, sub: q.title, amount: q.amount, date: fmtDate(q.date), status: q.status, action: 'open-quote', target: q.id });
    }).join('') || '<div class="fdemo-empty"><p>No quotes match this filter.</p></div>';

    return viewHead('Quotes', 'The offer before billing. Once accepted, it becomes an invoice.') +
      '<div class="fdemo-panel"><div class="fdemo-tabs">' + filters.map(function (f) {
        return '<button class="fdemo-tab' + (state.quoteFilter === f ? ' is-active' : '') + '" data-action="filter-quotes" data-id="' + f + '">' + labels[f] + '</button>';
      }).join('') + '</div><div class="fdemo-rows" style="margin-top:16px;">' + rows + '</div></div>';
  };

  RENDERERS.clientes = function () {
    var clients = FS.clients();
    var rows = clients.map(function (c) {
      return rowHtml({ id: c.invoiceCount + ' inv.', title: c.name, sub: c.sector, amount: c.billedTotal, date: '', status: c.pendingTotal > 0 ? 'Pending' : 'Paid', action: 'open-client', target: c.id });
    }).join('');

    return viewHead('Clients', 'Who you bill: history and collection status by client.') +
      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">' + clients.length + ' active clients</h2></div><div class="fdemo-rows">' + rows + '</div></div>';
  };

  RENDERERS.proveedores = function () {
    var suppliers = FS.suppliers();
    var rows = suppliers.map(function (s) {
      return rowHtml({ id: s.expenseCount + ' expenses', title: s.name, sub: s.category, amount: s.total, date: '', status: 'Paid', action: 'open-supplier', target: s.id });
    }).join('');

    return viewHead('Suppliers', 'Who you pay: accumulated spend by supplier.') +
      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">' + suppliers.length + ' suppliers</h2></div><div class="fdemo-rows">' + rows + '</div></div>';
  };

  RENDERERS.proyectos = function () {
    var projects = FS.projects();
    var rows = projects.map(function (p) {
      return '<div class="fdemo-row" data-action="open-project" data-id="' + p.id + '" role="button" tabindex="0">' +
        '<div class="fdemo-row-main"><div class="fdemo-row-title">' + esc(p.name) + '</div><div class="fdemo-row-sub">' + esc(p.client.name) + '</div></div>' +
        '<div class="fdemo-row-id">' + esc(p.status) + '</div>' +
        '<div class="fdemo-row-amount">' + EUR(p.revenue) + '</div>' +
        '<div class="fdemo-row-date">margin ' + p.marginPct + '%</div>' +
        '<span class="fdemo-badge ' + (p.status === 'Completed' ? 'st-pagada' : 'st-pendiente') + '">' + esc(p.status) + '</span></div>';
    }).join('');

    return viewHead('Projects', 'The work tied to billing: revenue, expenses and margin per project.') +
      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">' + projects.length + ' projects</h2></div><div class="fdemo-rows">' + rows + '</div></div>';
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

    return viewHead('Analysis', 'The evolution of the business, without opening a spreadsheet.') +
      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">Monthly trend — collected vs. spent</h2></div>' +
      lineChart(series) +
      '<div class="fdemo-chart-legend"><span><i style="background:var(--cyan)"></i>Collected</span><span><i style="background:var(--amber)"></i>Spent</span></div></div>' +
      '<div class="fdemo-panel"><div class="fdemo-panel-head"><h2 class="fdemo-panel-title">Profitability by project</h2></div>' + projectBars + '</div>';
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

    return viewHead('Ask Finance', 'Ask in plain language. Every answer is computed on the spot from this demo’s data — never invented text.') +
      '<div class="fdemo-panel">' +
      '<div class="fdemo-ask-suggestions">' + suggestions.map(function (s, i) {
        return '<button class="fdemo-ask-chip" data-action="ask" data-id="' + i + '">' + esc(s.q) + '</button>';
      }).join('') + '</div>' +
      '<div class="fdemo-ask-thread" id="fdemo-ask-thread">' + (thread || '<p class="fdemo-ask-empty-hint">Pick a question above to see how the assistant would answer.</p>') + '</div>' +
      '</div>';
  };

  function viewHead(title, sub) {
    return '<div class="fdemo-view-head"><span class="fdemo-view-eyebrow">D-Code Finance · Demo</span>' +
      '<h1 class="fdemo-view-title">' + esc(title) + '</h1>' +
      '<p class="fdemo-view-sub">' + esc(sub) + '</p>' +
      '<span class="fdemo-demo-note"><span class="dot"></span>Demo environment · Fictional data</span></div>';
  }

  // ---------------------------------------------------------------
  // Detail drawer
  // ---------------------------------------------------------------
  function openDrawer(html) {
    drawerEl.innerHTML = '<button class="fdemo-drawer-close" data-action="close-drawer" aria-label="Close">' + CLOSE_ICON + '</button>' + html;
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
      '<span class="fdemo-drawer-eyebrow">Invoice</span>' +
      '<h3 class="fdemo-drawer-title">' + esc(inv.id) + '</h3>' +
      '<div class="fdemo-drawer-meta"><span class="fdemo-badge ' + badgeClass(inv.status) + '">' + esc(inv.status) + '</span></div>' +
      '<div class="fdemo-drawer-section"><h4>Line items</h4>' + lines + '<div class="fdemo-kv" style="border-top:1px solid var(--border); margin-top:6px; padding-top:10px; font-weight:700;"><span>Total</span><span>' + EUR(inv.total) + '</span></div></div>' +
      '<div class="fdemo-drawer-section"><h4>Dates</h4>' +
      '<div class="fdemo-kv"><span>Issued</span><span>' + fmtDate(inv.date) + '</span></div>' +
      '<div class="fdemo-kv"><span>Due date</span><span>' + fmtDate(inv.dueDate) + '</span></div>' +
      (inv.paidDate ? '<div class="fdemo-kv"><span>Collected</span><span>' + fmtDate(inv.paidDate) + '</span></div>' : '') + '</div>' +
      '<div class="fdemo-drawer-section"><h4>Client</h4><button class="fdemo-drawer-link" data-action="open-client" data-id="' + inv.client.id + '">' + esc(inv.client.name) + ARROW + '</button></div>' +
      (inv.project ? '<div class="fdemo-drawer-section"><h4>Project</h4><button class="fdemo-drawer-link" data-action="open-project" data-id="' + inv.project.id + '">' + esc(inv.project.name) + ARROW + '</button></div>' : '')
    );
  }

  function expenseDrawer(id) {
    var e = FS.expenses().filter(function (x) { return x.id === id; })[0];
    if (!e) return;
    openDrawer(
      '<span class="fdemo-drawer-eyebrow">Expense</span>' +
      '<h3 class="fdemo-drawer-title">' + esc(e.concept) + '</h3>' +
      '<div class="fdemo-drawer-meta"><span class="fdemo-badge st-pendiente">' + esc(e.category) + '</span></div>' +
      '<div class="fdemo-drawer-section"><h4>Detail</h4>' +
      '<div class="fdemo-kv"><span>Amount</span><span>' + EUR(e.amount) + '</span></div>' +
      '<div class="fdemo-kv"><span>Date</span><span>' + fmtDate(e.date) + '</span></div>' +
      (e.supplier ? '<div class="fdemo-kv"><span>Supplier</span><span>' + esc(e.supplier.name) + '</span></div>' : '') + '</div>' +
      (e.project ? '<div class="fdemo-drawer-section"><h4>Project</h4><button class="fdemo-drawer-link" data-action="open-project" data-id="' + e.project.id + '">' + esc(e.project.name) + ARROW + '</button></div>' : '')
    );
  }

  function quoteDrawer(id) {
    var q = FS.quote(id);
    if (!q) return;
    openDrawer(
      '<span class="fdemo-drawer-eyebrow">Quote</span>' +
      '<h3 class="fdemo-drawer-title">' + esc(q.title) + '</h3>' +
      '<div class="fdemo-drawer-meta"><span class="fdemo-badge ' + badgeClass(q.status) + '">' + esc(q.status) + '</span></div>' +
      '<div class="fdemo-drawer-section"><h4>Detail</h4>' +
      '<div class="fdemo-kv"><span>Amount</span><span>' + EUR(q.amount) + '</span></div>' +
      '<div class="fdemo-kv"><span>Date</span><span>' + fmtDate(q.date) + '</span></div></div>' +
      '<div class="fdemo-drawer-section"><h4>Client</h4><button class="fdemo-drawer-link" data-action="open-client" data-id="' + q.client.id + '">' + esc(q.client.name) + ARROW + '</button></div>' +
      (q.project ? '<div class="fdemo-drawer-section"><h4>Resulting project</h4><button class="fdemo-drawer-link" data-action="open-project" data-id="' + q.project.id + '">' + esc(q.project.name) + ARROW + '</button></div>' : '')
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
      '<span class="fdemo-drawer-eyebrow">Client</span>' +
      '<h3 class="fdemo-drawer-title">' + esc(c.name) + '</h3>' +
      '<div class="fdemo-drawer-meta"><span class="fdemo-badge st-pagada">' + esc(c.sector) + '</span></div>' +
      '<div class="fdemo-drawer-section"><h4>Contact</h4>' +
      '<div class="fdemo-kv"><span>Email</span><span>' + esc(c.email) + '</span></div>' +
      '<div class="fdemo-kv"><span>Client since</span><span>' + fmtDate(c.since) + '</span></div></div>' +
      '<div class="fdemo-drawer-section"><h4>Total billing</h4>' +
      '<div class="fdemo-kv"><span>Billed</span><span>' + EUR(c.billedTotal) + '</span></div>' +
      '<div class="fdemo-kv"><span>Pending</span><span>' + EUR(c.pendingTotal) + '</span></div></div>' +
      '<div class="fdemo-drawer-section"><h4>Invoices (' + invs.length + ')</h4>' + rows + '</div>'
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
      '<span class="fdemo-drawer-eyebrow">Supplier</span>' +
      '<h3 class="fdemo-drawer-title">' + esc(s.name) + '</h3>' +
      '<div class="fdemo-drawer-meta"><span class="fdemo-badge st-pendiente">' + esc(s.category) + '</span></div>' +
      '<div class="fdemo-drawer-section"><h4>Accumulated spend</h4><div class="fdemo-kv"><span>Total</span><span>' + EUR(s.total) + '</span></div></div>' +
      '<div class="fdemo-drawer-section"><h4>Expenses (' + exps.length + ')</h4>' + rows + '</div>'
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
      '<span class="fdemo-drawer-eyebrow">Project</span>' +
      '<h3 class="fdemo-drawer-title">' + esc(p.name) + '</h3>' +
      '<div class="fdemo-drawer-meta"><span class="fdemo-badge ' + (p.status === 'Completed' ? 'st-pagada' : 'st-pendiente') + '">' + esc(p.status) + '</span></div>' +
      '<div class="fdemo-drawer-section"><h4>Client</h4><button class="fdemo-drawer-link" data-action="open-client" data-id="' + p.client.id + '">' + esc(p.client.name) + ARROW + '</button></div>' +
      '<div class="fdemo-drawer-section"><h4>Profitability</h4>' +
      '<div class="fdemo-kv"><span>Revenue</span><span>' + EUR(p.revenue) + '</span></div>' +
      '<div class="fdemo-kv"><span>Cost</span><span>' + EUR(p.cost) + '</span></div>' +
      '<div class="fdemo-kv" style="border-top:1px solid var(--border); padding-top:8px; font-weight:700;"><span>Margin</span><span>' + EUR(p.margin) + ' (' + p.marginPct + '%)</span></div></div>' +
      '<div class="fdemo-drawer-section"><h4>Linked invoices (' + invs.length + ')</h4>' + (rows || '<p style="color:var(--stone-soft); font-size:.84rem;">None yet.</p>') + '</div>'
    );
  }

  // ---------------------------------------------------------------
  // Event delegation
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
