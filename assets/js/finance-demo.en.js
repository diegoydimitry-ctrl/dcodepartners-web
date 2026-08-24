/*
 * D-Code Finance — public demo, render engine + router (English mirror).
 * See finance-demo.js for the full rationale: every view mirrors the
 * real product's pages 1:1; only the data layer is mock and isolated.
 */
(function () {
  'use strict';

  var FS = window.FinanceStore;
  var EUR = window.FinanceFmt.eur;
  var FDATE = window.FinanceFmt.fecha;
  var FDATETIME = window.FinanceFmt.fechaHora;
  if (!FS) return;

  var NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', grupo: 'dia' },
    { id: 'facturas', label: 'Invoices', grupo: 'dia' },
    { id: 'presupuestos', label: 'Quotes', grupo: 'negocio' },
    { id: 'clientes', label: 'Clients', grupo: 'negocio' },
    { id: 'cobros', label: 'Collections', grupo: 'dia' },
    { id: 'gastos', label: 'Expenses', grupo: 'dia' },
    { id: 'proyectos', label: 'Projects', grupo: 'negocio' },
    { id: 'ia', label: 'Ask Finance', grupo: 'inteligencia' },
    { id: 'configuracion', label: 'Settings', grupo: 'administracion' }
  ];

  // Fullpage mode only — mirrors the real repo's nav-items.ts groups and
  // NavIcono.tsx icon strokes, limited to the modules this demo actually
  // has built.
  var NAV_GROUPS = [
    { clave: 'dia', titulo: 'Day to day' },
    { clave: 'negocio', titulo: 'Business' },
    { clave: 'inteligencia', titulo: 'Intelligence' },
    { clave: 'administracion', titulo: 'Administration' }
  ];
  var NAV_ICONS = {
    dashboard: '<rect x="3" y="3" width="7.5" height="8.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="5" rx="1.5"/><rect x="13.5" y="11" width="7.5" height="10" rx="1.5"/><rect x="3" y="14.5" width="7.5" height="6.5" rx="1.5"/>',
    facturas: '<path d="M6 2.75h9.5L19.5 7v13.5a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75V3.5A.75.75 0 0 1 6 2.75Z"/><path d="M14.75 3v4.25H19"/><path d="M8.5 12.5h7M8.5 16.5h4.5" stroke-linecap="round"/>',
    cobros: '<rect x="2.75" y="5.75" width="18.5" height="12.5" rx="2"/><circle cx="12" cy="12" r="2.75"/><path d="M6.25 12h.01M17.75 12h.01" stroke-linecap="round"/>',
    gastos: '<path d="M3.25 8.5h17.5v10a1.75 1.75 0 0 1-1.75 1.75H5a1.75 1.75 0 0 1-1.75-1.75v-10Z"/><path d="M3.25 8.5 5.6 4.4A1.5 1.5 0 0 1 6.9 3.65h10.2a1.5 1.5 0 0 1 1.3.75l2.35 4.1"/><path d="M9.5 13h5" stroke-linecap="round"/>',
    presupuestos: '<rect x="4.25" y="2.75" width="15.5" height="18.5" rx="2"/><path d="M8 7.5h8M8 11.5h8M8 15.5h4.5" stroke-linecap="round"/>',
    clientes: '<circle cx="9" cy="8" r="3.25"/><path d="M2.75 20.25a6.25 6.25 0 0 1 12.5 0"/><path d="M16.25 5.1a3.25 3.25 0 0 1 0 5.8M18 20.25a6.3 6.3 0 0 0-1.4-3.95" stroke-linecap="round"/>',
    proyectos: '<rect x="2.75" y="6.75" width="18.5" height="13.5" rx="2"/><path d="M8.5 6.75V5A1.75 1.75 0 0 1 10.25 3.25h3.5A1.75 1.75 0 0 1 15.5 5v1.75"/><path d="M2.75 12.5h18.5"/>',
    ia: '<path d="M12 3.25 13.9 8.4a2 2 0 0 0 1.2 1.2l5.15 1.9-5.15 1.9a2 2 0 0 0-1.2 1.2L12 19.75l-1.9-5.15a2 2 0 0 0-1.2-1.2L3.75 11.5l5.15-1.9a2 2 0 0 0 1.2-1.2L12 3.25Z" stroke-linejoin="round"/>',
    configuracion: '<circle cx="12" cy="12" r="3"/><path d="M19.5 12a7.6 7.6 0 0 0-.12-1.35l2-1.55-2-3.46-2.36.95a7.5 7.5 0 0 0-2.34-1.35L14.3 2.75h-4l-.38 2.49a7.5 7.5 0 0 0-2.34 1.35l-2.36-.95-2 3.46 2 1.55a7.6 7.6 0 0 0 0 2.7l-2 1.55 2 3.46 2.36-.95a7.5 7.5 0 0 0 2.34 1.35l.38 2.49h4l.38-2.49a7.5 7.5 0 0 0 2.34-1.35l2.36.95 2-3.46-2-1.55c.08-.44.12-.89.12-1.35Z" stroke-linejoin="round"/>'
  };

  var MENU_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round"/></svg>';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function dash(v) { return (v === null || v === undefined || v === '') ? '—' : v; }

  function estadoVisual(valor) {
    var v = (valor || '').toLowerCase();
    function any(list) { return list.some(function (s) { return v.indexOf(s) !== -1; }); }
    if (any(['paid', 'collected', 'accepted', 'approved', 'active', 'delivered'])) return 'success';
    if (any(['overdue', 'rejected', 'cancelled', 'blocked'])) return 'danger';
    if (any(['follow-up', 'follow up', 'review', 'partial'])) return 'warning';
    if (any(['sent', 'in progress', 'production'])) return 'info';
    if (any(['draft', 'trial', 'prospect'])) return 'draft';
    if (any(['pending'])) return 'pending';
    return 'neutral';
  }
  function pill(label) {
    if (label === null || label === undefined || label === '') return '<span style="font-size:.72rem;color:var(--dc-text-faint);">—</span>';
    var st = estadoVisual(label);
    return '<span class="fdemo-pill st-' + st + '"><span class="dot"></span>' + esc(label) + '</span>';
  }

  function initInstance(root) {
    var mode = root.getAttribute('data-mode') || 'embedded';
    var exitHref = root.getAttribute('data-exit-href') || '/en/sistema-financiero';
    var exitLabel = root.getAttribute('data-exit-label') || 'Exit demo';
    var useHash = mode === 'fullpage';

    root.classList.add('fdemo-app', useHash ? 'is-fullpage' : 'is-embedded');
    root.innerHTML =
      '<div class="fdemo-sidebar-overlay" data-role="overlay"></div>' +
      '<nav class="fdemo-sidebar" data-role="sidebar"></nav>' +
      '<div style="flex:1; min-width:0; display:flex; flex-direction:column;">' +
      '<div class="fdemo-topbar">' +
      '<button class="fdemo-topbar-menu-btn" type="button" data-role="menu-btn" aria-label="Open menu">' + MENU_ICON + '</button>' +
      '<div class="fdemo-topbar-right">' +
      '<div class="fdemo-topbar-user"><div class="fdemo-topbar-name">Demo Account</div><div class="fdemo-topbar-role">Administrator</div></div>' +
      '<div class="fdemo-topbar-avatar">D</div>' +
      '<a class="fdemo-topbar-exit" href="' + exitHref + '">' + esc(exitLabel) + '</a>' +
      '</div></div>' +
      (useHash ? '<div class="fdemo-demo-banner" role="status"><span class="fdemo-demo-banner-dot" aria-hidden="true"></span><span class="fdemo-demo-banner-label">Demo</span><span class="fdemo-demo-banner-text">fictional data, does not reflect real D-Code Partners information</span></div>' : '') +
      '<div class="fdemo-main" data-role="main"><div class="fdemo-page" data-role="content"></div></div>' +
      '</div>';

    var sidebarEl = root.querySelector('[data-role="sidebar"]');
    var overlayEl = root.querySelector('[data-role="overlay"]');
    var mainEl = root.querySelector('[data-role="main"]');
    var contentEl = root.querySelector('[data-role="content"]');
    var menuBtn = root.querySelector('[data-role="menu-btn"]');

    var state = { route: 'dashboard', id: null, facturaFiltro: { q: '', estado: '' }, clienteFiltro: { q: '' }, ia: { mensajes: [] } };

    var navIndicatorEl = null;
    if (useHash) {
      sidebarEl.innerHTML =
        '<div class="fdemo-brand fdemo-brand--full">' +
        '<img src="/assets/logo/dcode-icon-sm.png" alt="" width="24" height="20" class="fdemo-brand-logo">' +
        '<div class="fdemo-brand-word"><span class="fdemo-brand-d">D-Code</span><span class="fdemo-brand-suffix">FINANCE</span></div>' +
        '</div>' +
        '<div class="fdemo-nav-groups" data-role="nav-groups">' +
        '<div class="fdemo-nav-indicator" data-role="nav-indicator"><span class="fdemo-nav-indicator-notch"></span></div>' +
        NAV_GROUPS.map(function (g, gi) {
          var entradas = NAV_ITEMS.filter(function (v) { return v.grupo === g.clave; });
          if (!entradas.length) return '';
          return (gi > 0 ? '<div class="fdemo-nav-divider"></div>' : '') +
            '<p class="fdemo-nav-group-title">' + esc(g.titulo) + '</p>' +
            '<div class="fdemo-nav-group-items">' +
            entradas.map(function (v) {
              return '<a href="#" class="fdemo-nav-item fdemo-nav-item--icon" data-role="nav" data-view="' + v.id + '">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="fdemo-nav-icon" aria-hidden="true">' + (NAV_ICONS[v.id] || '') + '</svg>' +
                esc(v.label) + '</a>';
            }).join('') +
            '</div>';
        }).join('') +
        '</div>';
      navIndicatorEl = sidebarEl.querySelector('[data-role="nav-indicator"]');
    } else {
      sidebarEl.innerHTML =
        '<div class="fdemo-brand">' +
        '<span class="fdemo-brand-mark">D</span>' +
        '<div><div class="fdemo-brand-name">D-Code Finance</div>' +
        '<div class="fdemo-brand-sub">D-Code Partners <span class="fdemo-brand-demo">DEMO</span></div></div>' +
        '</div>' +
        NAV_ITEMS.map(function (v) {
          return '<a href="#" class="fdemo-nav-item" data-role="nav" data-view="' + v.id + '"><span class="fdemo-nav-dot"></span>' + esc(v.label) + '</a>';
        }).join('');
    }

    function setActiveNav(viewId) {
      sidebarEl.querySelectorAll('[data-role="nav"]').forEach(function (el) {
        var active = el.getAttribute('data-view') === viewId;
        el.classList.toggle('is-active', active);
        if (active && navIndicatorEl) {
          navIndicatorEl.style.transform = 'translateY(' + el.offsetTop + 'px)';
          navIndicatorEl.style.height = el.offsetHeight + 'px';
          navIndicatorEl.style.opacity = '1';
        }
      });
    }
    function closeMobileMenu() { sidebarEl.classList.remove('is-open'); overlayEl.classList.remove('is-open'); }

    function parseRoute() {
      if (!useHash) return { view: state.route, id: state.id };
      var h = (location.hash || '#dashboard').replace('#', '');
      var parts = h.split('/');
      var view = NAV_ITEMS.some(function (v) { return v.id === parts[0]; }) ? parts[0] : 'dashboard';
      return { view: view, id: parts[1] || null };
    }
    function navigate(view, id) {
      if (useHash) {
        location.hash = '#' + view + (id ? '/' + id : '');
      } else {
        state.route = view; state.id = id || null;
        render();
      }
      closeMobileMenu();
    }

    function render() {
      var r = parseRoute();
      setActiveNav(r.view);
      var renderer = RENDERERS[r.view] || RENDERERS.dashboard;
      contentEl.innerHTML = renderer(r.id);
      mainEl.scrollTop = 0;
    }

    if (useHash) window.addEventListener('hashchange', render);

    var RENDERERS = {};

    function pageHead(title, sub) {
      return '<div><h2 class="fdemo-page-title">' + esc(title) + '</h2>' + (sub ? '<p class="fdemo-page-sub">' + esc(sub) + '</p>' : '') + '</div>';
    }
    function crumb(parentLabel, parentView, currentLabel) {
      return '<div class="fdemo-crumb"><a data-action="nav" data-view="' + parentView + '">' + esc(parentLabel) + '</a><span>/</span><span class="current">' + esc(currentLabel) + '</span></div>';
    }
    function card(headHtml, bodyHtml) { return '<div class="fdemo-card">' + (headHtml || '') + bodyHtml + '</div>'; }
    function cardHead(title, subtitle) {
      return '<div class="fdemo-card-head"><div><h2 class="fdemo-card-title">' + esc(title) + '</h2>' + (subtitle ? '<p class="fdemo-card-subtitle">' + esc(subtitle) + '</p>' : '') + '</div></div>';
    }
    function empty(detail) {
      return '<div class="fdemo-empty"><div class="fdemo-empty-icon"></div><p class="fdemo-empty-title">Not enough data</p>' + (detail ? '<p class="fdemo-empty-detail">' + esc(detail) + '</p>' : '') + '</div>';
    }
    function kpi(label, value, hint, accent) {
      return '<div class="fdemo-kpi accent-' + (accent || 'blue') + '"><div class="fdemo-kpi-row"><span class="fdemo-kpi-label">' + esc(label) + '</span></div>' +
        '<div class="fdemo-kpi-value">' + esc(value) + '</div>' + (hint ? '<div class="fdemo-kpi-hint">' + esc(hint) + '</div>' : '') + '</div>';
    }
    function field(label, valueHtml) {
      return '<div><p class="fdemo-field-label">' + esc(label) + '</p><p class="fdemo-field-value">' + valueHtml + '</p></div>';
    }
    function linkTo(view, id, label) {
      return '<a class="fdemo-link" href="#" data-action="nav" data-view="' + view + '" data-id="' + id + '">' + esc(label) + '</a>';
    }

    // ---------- Dashboard ----------
    RENDERERS.dashboard = function () {
      var snap = FS.getDashboardSnapshot();
      var facturas = FS.listFacturas();
      var gastos = FS.listGastos();

      var actividad = facturas.slice(0, 5).map(function (f) {
        return { tipo: 'Invoice', id: f.id, texto: f.numero + ' · ' + (f.clienteNombre || 'Client') + ' · ' + EUR(f.importe), fecha: f.fechaEmision, estado: f.estado, view: 'facturas' };
      }).concat(gastos.slice(0, 5).map(function (g) {
        return { tipo: 'Expense', id: g.id, texto: g.proveedor + ' · ' + EUR(g.importe), fecha: g.fecha, estado: g.estadoRevision || 'Recorded', view: 'gastos' };
      })).sort(function (a, b) { return (b.fecha || '').localeCompare(a.fecha || ''); }).slice(0, 8);

      if (!snap) return pageHead('Dashboard', 'No snapshot available') + card(null, '<div class="fdemo-card-body">' + empty('No snapshot has been computed yet.') + '</div>');

      var kpis = [
        kpi('Billed', EUR(snap.totalFacturado), '', 'blue'),
        kpi('Collected', EUR(snap.totalCobrado), '', 'cyan'),
        kpi('Pending collection', EUR(snap.totalPendiente), '', 'violet'),
        kpi('Overdue', EUR(snap.totalVencido), '', snap.totalVencido > 0 ? 'danger' : 'blue'),
        kpi('Expenses', EUR(snap.totalGastos), '', 'warning'),
        kpi('Active projects', String(snap.proyectosActivos), '', 'cyan'),
        kpi('30-day forecast', EUR(snap.prevision30Dias), '', 'violet'),
        kpi('Estimated profitability', EUR(snap.totalFacturado - snap.totalGastos), 'Billed − Expenses', 'blue')
      ].join('');

      var alertasHtml = !snap.alertas.length ? '<p style="font-size:.86rem;color:var(--dc-text-muted);padding:16px;margin:0;">No active alerts.</p>' :
        '<div class="fdemo-alert-list">' + snap.alertas.map(function (a) { return '<div class="fdemo-alert"><span class="dot"></span>' + esc(a) + '</div>'; }).join('') + '</div>';

      var actividadHtml = !actividad.length ? empty() :
        actividad.map(function (a) {
          return '<a class="fdemo-activity-row" href="#" data-action="nav" data-view="' + a.view + '" data-id="' + a.id + '">' +
            '<div class="fdemo-activity-main"><div class="fdemo-activity-text">' + esc(a.texto) + '</div>' +
            '<div class="fdemo-activity-meta">' + esc(a.tipo) + ' · ' + (a.fecha ? FDATETIME(a.fecha) : 'No date') + '</div></div>' +
            pill(a.estado) + '</a>';
        }).join('');

      return pageHead('Dashboard', 'Last computed: ' + FDATETIME(snap.fechaCalculo)) +
        '<div class="fdemo-kpi-grid">' + kpis + '</div>' +
        '<div style="display:grid; grid-template-columns:1fr 2fr; gap:16px;" class="fdemo-dash-row">' +
        card(cardHead('Alerts', 'Generated by the KPI calculation'), alertasHtml) +
        card(cardHead('Recent activity', 'Latest invoices and expenses recorded'), actividadHtml) +
        '</div>';
    };

    // ---------- Invoices ----------
    RENDERERS.facturas = function (id) {
      if (id) return facturaDetalle(id);
      var all = FS.listFacturas();
      var estados = Array.from(new Set(all.map(function (f) { return f.estado; }))).sort();
      var q = state.facturaFiltro.q.toLowerCase();
      var estFiltro = state.facturaFiltro.estado;
      var filtradas = all.filter(function (f) {
        var texto = (f.numero + ' ' + (f.clienteNombre || '') + ' ' + (f.proyecto || '')).toLowerCase();
        return (!q || texto.indexOf(q) !== -1) && (!estFiltro || f.estado === estFiltro);
      });

      var rows = filtradas.map(function (f) {
        return '<tr><td>' + linkTo('facturas', f.id, f.numero) + '</td>' +
          '<td class="is-muted">' + esc(dash(f.clienteNombre)) + '</td>' +
          '<td class="is-muted">' + esc(dash(f.proyecto)) + '</td>' +
          '<td class="is-muted">' + FDATE(f.fechaEmision) + '</td>' +
          '<td class="is-muted">' + FDATE(f.fechaVencimiento) + '</td>' +
          '<td class="is-right">' + EUR(f.importe) + '</td>' +
          '<td>' + pill(f.estado) + '</td>' +
          '<td>' + pill(f.estadoCobro) + '</td></tr>';
      }).join('');

      var tableHtml = !filtradas.length ? empty(all.length === 0 ? 'No invoices recorded yet.' : 'No results for these filters.') :
        '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr>' +
        '<th>Invoice #</th><th>Client</th><th>Project</th><th>Issued</th><th>Due</th><th class="is-right">Amount</th><th>Status</th><th>Collection</th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table></div>';

      return pageHead('Invoices', all.length + ' invoice(s) in total') +
        '<form class="fdemo-filter-row" data-role="factura-filter">' +
        '<input class="fdemo-input" type="text" name="q" placeholder="Search by number, client or project…" value="' + esc(state.facturaFiltro.q) + '">' +
        '<select class="fdemo-select" name="estado">' + ['<option value="">All statuses</option>'].concat(estados.map(function (e) { return '<option value="' + esc(e) + '"' + (e === estFiltro ? ' selected' : '') + '>' + esc(e) + '</option>'; })).join('') + '</select>' +
        '<button type="submit" class="fdemo-btn variant-secondary">Filter</button>' +
        '</form>' +
        card(null, tableHtml);
    };

    function facturaDetalle(id) {
      var f = FS.getFactura(id);
      if (!f) return empty('Invoice not found in the demo.');
      var cliente = f.clienteIds && f.clienteIds[0] ? FS.getCliente(f.clienteIds[0]) : null;

      var origenHtml = '';
      if (f.presupuestoOrigenId || f.proyectoOrigenId) {
        var links = [];
        if (f.presupuestoOrigenId) links.push('<div>' + linkTo('presupuestos', f.presupuestoOrigenId, 'View source quote') + '</div>');
        if (f.proyectoOrigenId) links.push('<div>' + linkTo('proyectos', f.proyectoOrigenId, 'View source project') + '</div>');
        origenHtml = card(cardHead('Origin', 'Traceability to the quote or project that generated this invoice'), '<div class="fdemo-card-body" style="display:flex; flex-direction:column; gap:8px;">' + links.join('') + '</div>');
      }
      var clienteHtml = cliente ? card(cardHead('Client'), '<div class="fdemo-field-grid">' +
        field('Company', linkTo('clientes', cliente.id, cliente.empresa)) + field('Tax ID', esc(dash(cliente.nif))) + field('Email', esc(dash(cliente.email))) + '</div>') : '';
      var obsHtml = f.observaciones ? card(cardHead('Notes'), '<p style="padding:20px; margin:0; font-size:.86rem; color:var(--dc-text-muted);">' + esc(f.observaciones) + '</p>') : '';

      return '<div class="fdemo-page is-narrow" style="gap:20px;">' +
        crumb('Invoices', 'facturas', f.numero) +
        '<div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;"><div><h2 class="fdemo-page-title">Invoice ' + esc(f.numero) + '</h2><p class="fdemo-page-sub">' + esc(dash(f.clienteNombre)) + '</p></div>' +
        '<div style="display:flex; gap:8px;">' + pill(f.estado) + (f.estadoCobro ? pill(f.estadoCobro) : '') + '</div></div>' +
        card(cardHead('Invoice details'), '<div class="fdemo-field-grid">' +
          field('Amount', EUR(f.importe)) + field('Collected', EUR(f.importeCobrado)) + field('Pending', EUR(f.importe - (f.importeCobrado || 0))) +
          field('Issue date', FDATE(f.fechaEmision)) + field('Due date', FDATE(f.fechaVencimiento)) + field('Payment date', FDATE(f.fechaPago)) +
          field('Payment method', esc(dash(f.metodoPago))) + field('Project', esc(dash(f.proyecto))) + field('Reminders sent', String(f.recordatoriosEnviados || 0)) +
          '</div>') +
        origenHtml + clienteHtml + obsHtml +
        '</div>';
    }

    // ---------- Quotes ----------
    RENDERERS.presupuestos = function (id) {
      if (id) return presupuestoDetalle(id);
      var all = FS.listPresupuestos();
      var rows = all.map(function (p) {
        return '<tr><td>' + linkTo('presupuestos', p.id, p.empresa) + '</td>' +
          '<td class="is-muted">' + FDATE(p.fechaGeneracion) + '</td>' +
          '<td class="is-right">' + EUR(p.importe) + '</td>' +
          '<td>' + pill(p.estado) + '</td>' +
          '<td class="is-muted">' + (p.aceptadaPorCliente ? 'Accepted ' + FDATE(p.fechaAceptacion) : 'Not accepted') + '</td>' +
          '<td>' + (p.facturaGeneradaId ? linkTo('facturas', p.facturaGeneradaId, 'View invoice') : '<span style="font-size:.72rem;color:var(--dc-text-faint);">Not invoiced</span>') + '</td></tr>';
      }).join('');
      var tableHtml = !all.length ? empty('No quotes generated yet.') :
        '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr><th>Company</th><th>Generated</th><th class="is-right">Amount</th><th>Status</th><th>Acceptance</th><th>Invoice</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
      return pageHead('Quotes', all.length + ' quote(s) in total') + card(null, tableHtml);
    };

    function presupuestoDetalle(id) {
      var p = FS.getPresupuesto(id);
      if (!p) return empty('Quote not found in the demo.');
      var facturacionBody;
      if (p.facturaGeneradaId) facturacionBody = linkTo('facturas', p.facturaGeneradaId, 'View generated invoice');
      else if (p.aceptadaPorCliente) facturacionBody = '<p style="margin:0; font-size:.86rem; color:var(--dc-text-muted);">Accepted — the invoice is generated automatically by the real workflow once a quote is accepted.</p>';
      else facturacionBody = '<p style="margin:0; font-size:.86rem; color:var(--dc-text-faint);">Awaiting client acceptance.</p>';

      return '<div class="fdemo-page is-narrow" style="gap:20px;">' +
        crumb('Quotes', 'presupuestos', p.empresa) +
        '<div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;"><h2 class="fdemo-page-title">' + esc(p.empresa) + '</h2>' + pill(p.estado) + '</div>' +
        card(cardHead('Quote details'), '<div class="fdemo-field-grid">' +
          field('Amount', EUR(p.importe)) + field('Generated on', FDATE(p.fechaGeneracion)) +
          field('Accepted by client', p.aceptadaPorCliente ? 'Yes, ' + FDATE(p.fechaAceptacion) : 'No') + '</div>') +
        (p.resumenEjecutivo ? card(cardHead('Executive summary'), '<p style="padding:20px; margin:0; font-size:.86rem; color:var(--dc-text-muted);">' + esc(p.resumenEjecutivo) + '</p>') : '') +
        (p.serviciosPropuestos ? card(cardHead('Proposed services'), '<p style="padding:20px; margin:0; font-size:.86rem; color:var(--dc-text-muted); white-space:pre-line;">' + esc(p.serviciosPropuestos) + '</p>') : '') +
        card(cardHead('Invoicing', 'This action is carried out by the real workflow — the interface never duplicates that logic'), '<div class="fdemo-card-body">' + facturacionBody + '</div>') +
        '</div>';
    }

    // ---------- Clients ----------
    RENDERERS.clientes = function (id) {
      if (id) return clienteDetalle(id);
      var all = FS.listClientes();
      var q = state.clienteFiltro.q.toLowerCase();
      var filtrados = all.filter(function (c) {
        var texto = (c.empresa + ' ' + (c.sector || '') + ' ' + (c.email || '')).toLowerCase();
        return !q || texto.indexOf(q) !== -1;
      });
      var rows = filtrados.map(function (c) {
        return '<tr><td>' + linkTo('clientes', c.id, c.empresa) + '</td>' +
          '<td class="is-muted">' + esc(dash(c.sector)) + '</td>' +
          '<td>' + pill(c.estado) + '</td>' +
          '<td class="is-right">' + (c.cuotaMensual !== null ? EUR(c.cuotaMensual) : '—') + '</td>' +
          '<td class="is-right">' + c.facturaIds.length + '</td></tr>';
      }).join('');
      var tableHtml = !filtrados.length ? empty(all.length === 0 ? 'No clients recorded yet.' : 'No results.') :
        '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr><th>Company</th><th>Sector</th><th>Status</th><th class="is-right">Monthly fee</th><th class="is-right">Invoices</th></tr></thead><tbody>' + rows + '</tbody></table></div>';

      return pageHead('Clients', all.length + ' client(s) in total') +
        '<form class="fdemo-filter-row" data-role="cliente-filter">' +
        '<input class="fdemo-input" style="max-width:420px;" type="text" name="q" placeholder="Search by company, sector or email…" value="' + esc(state.clienteFiltro.q) + '">' +
        '<button type="submit" class="fdemo-btn variant-secondary">Search</button></form>' +
        card(null, tableHtml);
    };

    function clienteDetalle(id) {
      var c = FS.getCliente(id);
      if (!c) return empty('Client not found in the demo.');
      var facturasCliente = FS.listFacturas().filter(function (f) { return f.clienteIds.indexOf(id) !== -1; });
      var proyectosCliente = FS.listProyectos().filter(function (p) { return p.empresa === c.empresa; });

      var facturasHtml = !facturasCliente.length ? empty() :
        '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr><th>#</th><th>Status</th><th class="is-right">Amount</th></tr></thead><tbody>' +
        facturasCliente.map(function (f) { return '<tr><td>' + linkTo('facturas', f.id, f.numero) + '</td><td>' + pill(f.estado) + '</td><td class="is-right">' + EUR(f.importe) + '</td></tr>'; }).join('') +
        '</tbody></table></div>';
      var proyectosHtml = !proyectosCliente.length ? empty() :
        '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr><th>Name</th><th>Status</th><th class="is-right">Profitability</th></tr></thead><tbody>' +
        proyectosCliente.map(function (p) { return '<tr><td>' + linkTo('proyectos', p.id, p.nombre) + '</td><td>' + pill(p.estado) + '</td><td class="is-right">' + EUR(p.rentabilidad) + '</td></tr>'; }).join('') +
        '</tbody></table></div>';

      return '<div class="fdemo-page" style="gap:20px; max-width:900px;">' +
        crumb('Clients', 'clientes', c.empresa) +
        '<div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;"><h2 class="fdemo-page-title">' + esc(c.empresa) + '</h2>' + pill(c.estado) + '</div>' +
        card(cardHead('Tax and contact information'), '<div class="fdemo-field-grid">' +
          field('Tax ID', esc(dash(c.nif))) + field('Registered address', esc(dash(c.direccionFiscal))) + field('Sector', esc(dash(c.sector))) +
          field('Email', esc(dash(c.email))) + field('Phone', esc(dash(c.telefono))) + field('Website', c.web ? '<a class="fdemo-link" href="' + esc(c.web) + '" target="_blank" rel="noopener noreferrer">' + esc(c.web) + '</a>' : '—') +
          field('Monthly fee', c.cuotaMensual !== null ? EUR(c.cuotaMensual) : 'No recurring fee') + field('Active billing', c.facturacionActiva ? 'Yes' : 'No') +
          '</div>') +
        card(cardHead('Invoices', facturasCliente.length + ' invoice(s)'), facturasHtml) +
        card(cardHead('Projects', proyectosCliente.length + ' project(s)'), proyectosHtml) +
        '</div>';
    }

    // ---------- Collections ----------
    RENDERERS.cobros = function () {
      var cobros = FS.listCobros();
      var grupos = {
        vencidos: cobros.filter(function (c) { return c.estadoCobro === 'Overdue'; }),
        seguimiento: cobros.filter(function (c) { return c.estadoCobro === 'Following up'; }),
        pendientes: cobros.filter(function (c) { return c.estadoCobro === 'Pending' || c.estadoCobro === 'Partial'; }),
        cobrados: cobros.filter(function (c) { return c.estadoCobro === 'Collected'; })
      };
      var totalPendiente = grupos.vencidos.concat(grupos.seguimiento, grupos.pendientes).reduce(function (s, c) { return s + c.pendiente; }, 0);

      function grupoCard(titulo, lista) {
        var body = !lista.length ? empty() :
          '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr><th>Invoice</th><th>Client</th><th>Due</th><th class="is-right">Amount</th><th class="is-right">Collected</th><th class="is-right">Pending</th></tr></thead><tbody>' +
          lista.map(function (c) {
            return '<tr><td>' + linkTo('facturas', c.facturaId, c.numeroFactura) + '</td><td class="is-muted">' + esc(dash(c.clienteNombre)) + '</td><td class="is-muted">' + FDATE(c.fechaVencimiento) + '</td>' +
              '<td class="is-right">' + EUR(c.importe) + '</td><td class="is-right">' + EUR(c.importeCobrado) + '</td><td class="is-right">' + EUR(c.pendiente) + '</td></tr>';
          }).join('') + '</tbody></table></div>';
        return card(cardHead(titulo, lista.length + ' invoice(s)'), body);
      }

      return pageHead('Collections', 'Collection tracking for issued invoices') +
        '<div class="fdemo-kpi-grid">' +
        kpi('Total pending', EUR(totalPendiente), '', 'blue') +
        kpi('Overdue', String(grupos.vencidos.length), '', 'danger') +
        kpi('Following up', String(grupos.seguimiento.length), '', 'warning') +
        kpi('Collected', String(grupos.cobrados.length), '', 'cyan') +
        '</div>' +
        grupoCard('Overdue', grupos.vencidos) + grupoCard('Following up', grupos.seguimiento) +
        grupoCard('Pending / partial', grupos.pendientes) + grupoCard('Collected', grupos.cobrados);
    };

    // ---------- Expenses ----------
    RENDERERS.gastos = function (id) {
      if (id) return gastoDetalle(id);
      var all = FS.listGastos();
      var total = all.reduce(function (s, g) { return s + g.importe; }, 0);
      var rows = all.map(function (g) {
        return '<tr><td>' + linkTo('gastos', g.id, g.proveedor) + '</td><td class="is-muted">' + esc(dash(g.concepto)) + '</td><td class="is-muted">' + esc(dash(g.categoria)) + '</td>' +
          '<td class="is-muted">' + FDATE(g.fecha) + '</td><td class="is-right">' + EUR(g.importe) + '</td><td>' + pill(g.estadoRevision) + '</td></tr>';
      }).join('');
      var tableHtml = !all.length ? empty('No expenses recorded yet.') :
        '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr><th>Supplier</th><th>Concept</th><th>Category</th><th>Date</th><th class="is-right">Amount</th><th>Review</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
      return pageHead('Expenses', all.length + ' expense(s) · Total ' + EUR(total)) + card(null, tableHtml);
    };

    function gastoDetalle(id) {
      var g = FS.getGasto(id);
      if (!g) return empty('Expense not found in the demo.');
      return '<div class="fdemo-page is-narrow" style="gap:20px;">' +
        crumb('Expenses', 'gastos', g.proveedor) +
        '<div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;"><h2 class="fdemo-page-title">' + esc(g.proveedor) + '</h2>' + pill(g.estadoRevision) + '</div>' +
        card(cardHead('Expense details'), '<div class="fdemo-field-grid">' +
          field('Amount', EUR(g.importe)) + field('VAT', g.iva !== null ? EUR(g.iva) : '—') + field('Date', FDATE(g.fecha)) +
          field('Category', esc(dash(g.categoria))) + field('Project', g.proyectoRecordId ? linkTo('proyectos', g.proyectoRecordId, 'View project') : 'No project linked') +
          '</div>') +
        (g.concepto ? card(cardHead('Concept'), '<p style="padding:20px; margin:0; font-size:.86rem; color:var(--dc-text-muted);">' + esc(g.concepto) + '</p>') : '') +
        (g.notasRevision ? card(cardHead('Review notes'), '<p style="padding:20px; margin:0; font-size:.86rem; color:var(--dc-text-muted);">' + esc(g.notasRevision) + '</p>') : '') +
        '</div>';
    }

    // ---------- Projects ----------
    RENDERERS.proyectos = function (id) {
      if (id) return proyectoDetalle(id);
      var all = FS.listProyectos();
      var rows = all.map(function (p) {
        return '<tr><td>' + linkTo('proyectos', p.id, p.nombre) + '</td><td class="is-muted">' + esc(dash(p.empresa)) + '</td><td>' + pill(p.estado) + '</td>' +
          '<td class="is-muted">' + FDATE(p.fechaInicio) + '</td><td class="is-right">' + EUR(p.totalFacturado) + '</td><td class="is-right">' + EUR(p.totalGastos) + '</td><td class="is-right">' + EUR(p.rentabilidad) + '</td></tr>';
      }).join('');
      var tableHtml = !all.length ? empty('No projects recorded yet.') :
        '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr><th>Project</th><th>Client</th><th>Status</th><th>Start</th><th class="is-right">Billed</th><th class="is-right">Expenses</th><th class="is-right">Profitability</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
      return pageHead('Projects', all.length + ' project(s) in total') + card(null, tableHtml);
    };

    function proyectoDetalle(id) {
      var p = FS.getProyecto(id);
      if (!p) return empty('Project not found in the demo.');
      var facturasProyecto = FS.listFacturas().filter(function (f) { return f.proyectoOrigenId === id; });
      var gastosProyecto = FS.listGastos().filter(function (g) { return g.proyectoRecordId === id; });

      function statCard(label, value) {
        return '<div class="fdemo-stat-card"><p class="fdemo-stat-label">' + esc(label) + '</p><p class="fdemo-stat-value">' + value + '</p></div>';
      }
      var facturasHtml = !facturasProyecto.length ? empty() :
        '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr><th>#</th><th>Status</th><th class="is-right">Amount</th></tr></thead><tbody>' +
        facturasProyecto.map(function (f) { return '<tr><td>' + linkTo('facturas', f.id, f.numero) + '</td><td>' + pill(f.estado) + '</td><td class="is-right">' + EUR(f.importe) + '</td></tr>'; }).join('') + '</tbody></table></div>';
      var gastosHtml = !gastosProyecto.length ? empty() :
        '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr><th>Supplier</th><th>Category</th><th class="is-right">Amount</th></tr></thead><tbody>' +
        gastosProyecto.map(function (g) { return '<tr><td>' + linkTo('gastos', g.id, g.proveedor) + '</td><td class="is-muted">' + esc(dash(g.categoria)) + '</td><td class="is-right">' + EUR(g.importe) + '</td></tr>'; }).join('') + '</tbody></table></div>';

      return '<div class="fdemo-page" style="gap:20px; max-width:900px;">' +
        crumb('Projects', 'proyectos', p.nombre) +
        '<div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;"><div><h2 class="fdemo-page-title">' + esc(p.nombre) + '</h2><p class="fdemo-page-sub">' + esc(dash(p.empresa)) + '</p></div>' + pill(p.estado) + '</div>' +
        '<div class="fdemo-stat-row">' + statCard('Billed', EUR(p.totalFacturado)) + statCard('Collected', EUR(p.totalCobrado)) + statCard('Expenses', EUR(p.totalGastos)) + statCard('Profitability', EUR(p.rentabilidad)) + '</div>' +
        card(cardHead('Detail'), '<div class="fdemo-field-grid">' +
          field('Start date', FDATE(p.fechaInicio)) + field('Expected delivery', FDATE(p.fechaEntregaPrevista)) + field('Actual delivery', FDATE(p.fechaEntregaReal)) + field('Owner', esc(dash(p.responsable))) +
          '</div>' + (p.serviciosContratados ? '<div style="border-top:1px solid var(--dc-border); padding:20px;"><p class="fdemo-field-label">Contracted services</p><p class="fdemo-field-value" style="white-space:pre-line;">' + esc(p.serviciosContratados) + '</p></div>' : '')) +
        card(cardHead('Project invoices', facturasProyecto.length + ' invoice(s)'), facturasHtml) +
        card(cardHead('Project expenses', gastosProyecto.length + ' expense(s)'), gastosHtml) +
        '</div>';
    }

    // ---------- Ask Finance ----------
    RENDERERS.ia = function () {
      var sugerencias = FS.askQuestions();
      var threadHtml;
      if (!state.ia.mensajes.length) {
        threadHtml = '<div class="fdemo-ia-empty"><p>Try one of these questions:</p><div class="fdemo-ia-chips">' +
          sugerencias.map(function (s, i) { return '<button type="button" class="fdemo-ia-chip" data-action="ask" data-idx="' + i + '">' + esc(s.q) + '</button>'; }).join('') +
          '</div></div>';
      } else {
        threadHtml = '<div class="fdemo-ia-msgs">' + state.ia.mensajes.map(function (m) {
          if (m.autor === 'usuario') return '<div class="fdemo-ia-msg from-user"><div class="fdemo-ia-bubble">' + esc(m.texto) + '</div></div>';
          var refs = (m.refs || []).map(function (r) { return '<button type="button" class="fdemo-ia-ref" data-action="nav" data-view="' + r.type + '" data-id="' + r.id + '">' + esc(r.label) + '</button>'; }).join('');
          return '<div class="fdemo-ia-msg from-ia"><div class="fdemo-ia-bubble">' + esc(m.texto) + (refs ? '<div class="fdemo-ia-refs">' + refs + '</div>' : '') + '</div></div>';
        }).join('') + '</div>';
      }

      return pageHead('Ask Finance', 'Answers only with data from the demo (billing, collections, expenses and projects). Not a substitute for tax advice.') +
        '<div class="fdemo-card fdemo-ia-card">' +
        '<div class="fdemo-ia-thread" data-role="ia-thread">' + threadHtml + '</div>' +
        '<form class="fdemo-ia-form" data-role="ia-form">' +
        '<input class="fdemo-input" type="text" name="pregunta" placeholder="Type your financial question…" autocomplete="off">' +
        '<button type="submit" class="fdemo-btn variant-primary">Send</button>' +
        '</form></div>';
    };

    function askIndex(idx) {
      var q = FS.askQuestions()[idx];
      if (!q) return;
      var a = q.a();
      state.ia.mensajes.push({ autor: 'usuario', texto: q.q });
      state.ia.mensajes.push({ autor: 'ia', texto: a.text, refs: a.refs });
      render();
      var thread = root.querySelector('[data-role="ia-thread"]');
      if (thread) thread.scrollTop = thread.scrollHeight;
    }

    // ---------- Settings ----------
    RENDERERS.configuracion = function () {
      var ROLES = ['Administrator', 'Leadership', 'Finance', 'Operations', 'Read only'];
      var MATRIZ = {
        Administrator: ['view_dashboard', 'view_invoices', 'edit_invoices', 'view_quotes', 'invoice_from_quote', 'view_clients', 'edit_clients', 'view_collections', 'view_expenses', 'review_expenses', 'view_projects', 'use_finance_ai', 'view_settings', 'edit_settings'],
        Leadership: ['view_dashboard', 'view_invoices', 'edit_invoices', 'view_quotes', 'invoice_from_quote', 'view_clients', 'edit_clients', 'view_collections', 'view_expenses', 'review_expenses', 'view_projects', 'use_finance_ai', 'view_settings'],
        Finance: ['view_dashboard', 'view_invoices', 'edit_invoices', 'view_quotes', 'invoice_from_quote', 'view_clients', 'view_collections', 'view_expenses', 'review_expenses', 'view_projects', 'use_finance_ai'],
        Operations: ['view_dashboard', 'view_invoices', 'view_quotes', 'view_clients', 'view_projects', 'view_expenses'],
        'Read only': ['view_dashboard', 'view_invoices', 'view_quotes', 'view_clients', 'view_collections', 'view_expenses', 'view_projects']
      };
      var rolesHtml = ROLES.map(function (r) {
        return '<div class="fdemo-role-row"><p class="fdemo-role-name">' + esc(r) + '</p><div class="fdemo-role-perms">' +
          MATRIZ[r].map(function (p) { return '<span class="fdemo-role-perm">' + esc(p) + '</span>'; }).join('') + '</div></div>';
      }).join('');

      return pageHead('Settings', 'Settings available in this public demo.') +
        card(cardHead('Current session'), '<div class="fdemo-field-grid">' +
          field('User', 'Demo Account') + field('Company', 'Demo environment · D-Code Finance') + field('Role', pill('Administrator')) + '</div>') +
        card(cardHead('Data source', 'Controlled by the DATA_SOURCE environment variable in the real product'), '<div class="fdemo-card-body">' + pill('Sample data (mock)') + '</div>') +
        card(cardHead('Roles and permissions', 'Same permission matrix as the real product'), rolesHtml) +
        card(cardHead('About this demo'), '<ul class="fdemo-pending-list">' +
          '<li>The data is fictional and is never saved or sent to any real system.</li>' +
          '<li>"Ask Finance" computes its answers right here, on this dataset — it never calls an external service.</li>' +
          '<li>The real system connects to D-Code Partners\' Airtable/n8n; this public demo is fully isolated from that infrastructure.</li>' +
          '</ul>');
    };

    root.addEventListener('click', function (e) {
      var navEl = e.target.closest('[data-action="nav"]');
      if (navEl) { e.preventDefault(); navigate(navEl.getAttribute('data-view'), navEl.getAttribute('data-id')); return; }
      var askEl = e.target.closest('[data-action="ask"]');
      if (askEl) { e.preventDefault(); askIndex(Number(askEl.getAttribute('data-idx'))); return; }
      var navItem = e.target.closest('[data-role="nav"]');
      if (navItem) { e.preventDefault(); navigate(navItem.getAttribute('data-view'), null); return; }
      if (e.target === overlayEl) closeMobileMenu();
    });
    menuBtn.addEventListener('click', function () {
      sidebarEl.classList.add('is-open');
      overlayEl.classList.add('is-open');
    });

    root.addEventListener('submit', function (e) {
      var form = e.target;
      if (form.matches('[data-role="factura-filter"]')) {
        e.preventDefault();
        state.facturaFiltro.q = form.q.value;
        state.facturaFiltro.estado = form.estado.value;
        render();
      } else if (form.matches('[data-role="cliente-filter"]')) {
        e.preventDefault();
        state.clienteFiltro.q = form.q.value;
        render();
      } else if (form.matches('[data-role="ia-form"]')) {
        e.preventDefault();
        var input = form.pregunta;
        var texto = input.value.trim();
        if (!texto) return;
        state.ia.mensajes.push({ autor: 'usuario', texto: texto });
        state.ia.mensajes.push({ autor: 'ia', texto: 'This demo answers the three suggested questions, computed over the fictional dataset. Try one of the suggestions above.', refs: [] });
        input.value = '';
        render();
        var thread = root.querySelector('[data-role="ia-thread"]');
        if (thread) thread.scrollTop = thread.scrollHeight;
      }
    });

    render();
  }

  function init() {
    document.querySelectorAll('[data-fdemo-mount]').forEach(initInstance);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
