/*
 * D-Code Finance — demo pública, motor de render + router.
 *
 * Esta NO es una reinterpretación de marketing del producto: cada vista
 * (Dashboard, Facturas, Presupuestos, Clientes, Cobros, Gastos, Proyectos,
 * Pregunta a Finanzas, Configuración) reproduce estructura, campos y
 * componentes de las páginas reales en src/app/(app)/*.tsx del repositorio
 * dcode-finance -- la misma jerarquía de tarjetas, las mismas columnas de
 * tabla, los mismos estados. Lo único que cambia es la capa de datos
 * (finance-demo-data.js, mock, aislada) y que la navegación por detalle es
 * una vista más dentro del mismo hash-router en vez de una ruta Next.js,
 * porque este sitio no tiene servidor de aplicación.
 *
 * Un mismo script/CSS se monta en tres sitios (Home, Departamentos →
 * Finanzas, /sistema-financiero/app): una única fuente visual, tal y como
 * pide la arquitectura "UI real + adaptador de datos DEMO/REAL". Cero
 * llamadas de red, cero fetch, cero dependencia de Airtable/n8n/webhooks
 * reales -- todo se calcula en el cliente sobre finance-demo-data.js.
 */
(function () {
  'use strict';

  var FS = window.FinanceStore;
  var EUR = window.FinanceFmt.eur;
  var FDATE = window.FinanceFmt.fecha;
  var FDATETIME = window.FinanceFmt.fechaHora;
  if (!FS) return;

  var NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'facturas', label: 'Facturas' },
    { id: 'presupuestos', label: 'Presupuestos' },
    { id: 'clientes', label: 'Clientes' },
    { id: 'cobros', label: 'Cobros' },
    { id: 'gastos', label: 'Gastos' },
    { id: 'proyectos', label: 'Proyectos' },
    { id: 'ia', label: 'Pregunta a Finanzas' },
    { id: 'configuracion', label: 'Configuración' }
  ];

  var MENU_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round"/></svg>';
  var CHEVRON_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function dash(v) { return (v === null || v === undefined || v === '') ? '—' : v; }

  // ---------------------------------------------------------------
  // estadoVisual -- mismo mapeo que src/components/ui/StatusPill.tsx
  // ---------------------------------------------------------------
  function estadoVisual(valor) {
    var v = (valor || '').toLowerCase();
    function any(list) { return list.some(function (s) { return v.indexOf(s) !== -1; }); }
    if (any(['pagada', 'pagado', 'cobrado', 'aceptada', 'aprobado', 'activo', 'entregado'])) return 'success';
    if (any(['vencido', 'vencida', 'rechazad', 'anulada', 'bloquead'])) return 'danger';
    if (any(['seguimiento', 'revision', 'revisión', 'parcial'])) return 'warning';
    if (any(['enviada', 'en curso', 'produccion', 'producción'])) return 'info';
    if (any(['borrador', 'prueba', 'prospecto'])) return 'draft';
    if (any(['pendiente'])) return 'pending';
    return 'neutral';
  }
  function pill(label) {
    if (label === null || label === undefined || label === '') return '<span style="font-size:.72rem;color:var(--dc-text-faint);">—</span>';
    var st = estadoVisual(label);
    return '<span class="fdemo-pill st-' + st + '"><span class="dot"></span>' + esc(label) + '</span>';
  }

  // ---------------------------------------------------------------
  // Instancias: un mismo script monta N instancias independientes
  // (Home, Finanzas, /sistema-financiero/app), cada una con su propio
  // estado (vista actual, filtros) y su propio contenedor DOM.
  // ---------------------------------------------------------------
  function initInstance(root) {
    var mode = root.getAttribute('data-mode') || 'embedded';
    var exitHref = root.getAttribute('data-exit-href') || '/sistema-financiero';
    var exitLabel = root.getAttribute('data-exit-label') || 'Salir de la demo';
    var useHash = mode === 'fullpage';

    root.classList.add('fdemo-app', useHash ? 'is-fullpage' : 'is-embedded');
    root.innerHTML =
      '<div class="fdemo-sidebar-overlay" data-role="overlay"></div>' +
      '<nav class="fdemo-sidebar" data-role="sidebar"></nav>' +
      '<div style="flex:1; min-width:0; display:flex; flex-direction:column;">' +
      '<div class="fdemo-topbar">' +
      '<button class="fdemo-topbar-menu-btn" type="button" data-role="menu-btn" aria-label="Abrir menu">' + MENU_ICON + '</button>' +
      '<div class="fdemo-topbar-right">' +
      '<div class="fdemo-topbar-user"><div class="fdemo-topbar-name">Cuenta Demo</div><div class="fdemo-topbar-role">Administrador</div></div>' +
      '<div class="fdemo-topbar-avatar">D</div>' +
      '<a class="fdemo-topbar-exit" href="' + exitHref + '">' + esc(exitLabel) + '</a>' +
      '</div></div>' +
      '<div class="fdemo-main" data-role="main"><div class="fdemo-page" data-role="content"></div></div>' +
      '</div>';

    var sidebarEl = root.querySelector('[data-role="sidebar"]');
    var overlayEl = root.querySelector('[data-role="overlay"]');
    var mainEl = root.querySelector('[data-role="main"]');
    var contentEl = root.querySelector('[data-role="content"]');
    var menuBtn = root.querySelector('[data-role="menu-btn"]');

    var state = { route: 'dashboard', id: null, facturaFiltro: { q: '', estado: '' }, clienteFiltro: { q: '' }, ia: { mensajes: [], enviando: false } };

    sidebarEl.innerHTML =
      '<div class="fdemo-brand">' +
      '<span class="fdemo-brand-mark">D</span>' +
      '<div><div class="fdemo-brand-name">D-Code Finance</div>' +
      '<div class="fdemo-brand-sub">D-Code Partners <span class="fdemo-brand-demo">DEMO</span></div></div>' +
      '</div>' +
      NAV_ITEMS.map(function (v) {
        return '<a href="#" class="fdemo-nav-item" data-role="nav" data-view="' + v.id + '"><span class="fdemo-nav-dot"></span>' + esc(v.label) + '</a>';
      }).join('');

    function setActiveNav(viewId) {
      sidebarEl.querySelectorAll('[data-role="nav"]').forEach(function (el) {
        el.classList.toggle('is-active', el.getAttribute('data-view') === viewId);
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

    // -------- Renderers --------
    var RENDERERS = {};

    function pageHead(title, sub) {
      return '<div><h1 class="fdemo-page-title">' + esc(title) + '</h1>' + (sub ? '<p class="fdemo-page-sub">' + esc(sub) + '</p>' : '') + '</div>';
    }
    function crumb(parentLabel, parentView, currentLabel) {
      return '<div class="fdemo-crumb"><a data-action="nav" data-view="' + parentView + '">' + esc(parentLabel) + '</a><span>/</span><span class="current">' + esc(currentLabel) + '</span></div>';
    }
    function card(headHtml, bodyHtml) {
      return '<div class="fdemo-card">' + (headHtml || '') + bodyHtml + '</div>';
    }
    function cardHead(title, subtitle) {
      return '<div class="fdemo-card-head"><div><h2 class="fdemo-card-title">' + esc(title) + '</h2>' + (subtitle ? '<p class="fdemo-card-subtitle">' + esc(subtitle) + '</p>' : '') + '</div></div>';
    }
    function empty(detail) {
      return '<div class="fdemo-empty"><div class="fdemo-empty-icon"></div><p class="fdemo-empty-title">Sin datos suficientes</p>' + (detail ? '<p class="fdemo-empty-detail">' + esc(detail) + '</p>' : '') + '</div>';
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
        return { tipo: 'Factura', id: f.id, texto: f.numero + ' · ' + (f.clienteNombre || 'Cliente') + ' · ' + EUR(f.importe), fecha: f.fechaEmision, estado: f.estado, view: 'facturas' };
      }).concat(gastos.slice(0, 5).map(function (g) {
        return { tipo: 'Gasto', id: g.id, texto: g.proveedor + ' · ' + EUR(g.importe), fecha: g.fecha, estado: g.estadoRevision || 'Registrado', view: 'gastos' };
      })).sort(function (a, b) { return (b.fecha || '').localeCompare(a.fecha || ''); }).slice(0, 8);

      if (!snap) {
        return pageHead('Dashboard', 'Sin snapshot disponible') + card(null, '<div class="fdemo-card-body">' + empty('Aún no hay un snapshot calculado.') + '</div>');
      }

      var kpis = [
        kpi('Facturado', EUR(snap.totalFacturado), '', 'blue'),
        kpi('Cobrado', EUR(snap.totalCobrado), '', 'cyan'),
        kpi('Pendiente de cobro', EUR(snap.totalPendiente), '', 'violet'),
        kpi('Vencido', EUR(snap.totalVencido), '', snap.totalVencido > 0 ? 'danger' : 'blue'),
        kpi('Gastos', EUR(snap.totalGastos), '', 'warning'),
        kpi('Proyectos activos', String(snap.proyectosActivos), '', 'cyan'),
        kpi('Previsión 30 días', EUR(snap.prevision30Dias), '', 'violet'),
        kpi('Rentabilidad estimada', EUR(snap.totalFacturado - snap.totalGastos), 'Facturado − Gastos', 'blue')
      ].join('');

      var alertasHtml = !snap.alertas.length ? '<p style="font-size:.86rem;color:var(--dc-text-muted);padding:16px;margin:0;">Sin alertas activas.</p>' :
        '<div class="fdemo-alert-list">' + snap.alertas.map(function (a) { return '<div class="fdemo-alert"><span class="dot"></span>' + esc(a) + '</div>'; }).join('') + '</div>';

      var actividadHtml = !actividad.length ? empty() :
        actividad.map(function (a) {
          return '<a class="fdemo-activity-row" href="#" data-action="nav" data-view="' + a.view + '" data-id="' + a.id + '">' +
            '<div class="fdemo-activity-main"><div class="fdemo-activity-text">' + esc(a.texto) + '</div>' +
            '<div class="fdemo-activity-meta">' + esc(a.tipo) + ' · ' + (a.fecha ? FDATETIME(a.fecha) : 'Sin fecha') + '</div></div>' +
            pill(a.estado) + '</a>';
        }).join('');

      return pageHead('Dashboard', 'Último cálculo: ' + FDATETIME(snap.fechaCalculo)) +
        '<div class="fdemo-kpi-grid">' + kpis + '</div>' +
        '<div style="display:grid; grid-template-columns:1fr 2fr; gap:16px;" class="fdemo-dash-row">' +
        card(cardHead('Alertas', 'Generadas por el cálculo de KPIs'), alertasHtml) +
        card(cardHead('Actividad reciente', 'Últimas facturas y gastos registrados'), actividadHtml) +
        '</div>';
    };

    // ---------- Facturas ----------
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

      var tableHtml = !filtradas.length ? empty(all.length === 0 ? 'Aún no hay facturas registradas.' : 'Ningún resultado con estos filtros.') :
        '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr>' +
        '<th>Nº Factura</th><th>Cliente</th><th>Proyecto</th><th>Emisión</th><th>Vencimiento</th><th class="is-right">Importe</th><th>Estado</th><th>Cobro</th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table></div>';

      return pageHead('Facturas', all.length + ' factura(s) en total') +
        '<form class="fdemo-filter-row" data-role="factura-filter">' +
        '<input class="fdemo-input" type="text" name="q" placeholder="Buscar por número, cliente o proyecto…" value="' + esc(state.facturaFiltro.q) + '">' +
        '<select class="fdemo-select" name="estado">' + ['<option value="">Todos los estados</option>'].concat(estados.map(function (e) { return '<option value="' + esc(e) + '"' + (e === estFiltro ? ' selected' : '') + '>' + esc(e) + '</option>'; })).join('') + '</select>' +
        '<button type="submit" class="fdemo-btn variant-secondary">Filtrar</button>' +
        '</form>' +
        card(null, tableHtml);
    };

    function facturaDetalle(id) {
      var f = FS.getFactura(id);
      if (!f) return empty('Factura no encontrada en la demo.');
      var cliente = f.clienteIds && f.clienteIds[0] ? FS.getCliente(f.clienteIds[0]) : null;

      var origenHtml = '';
      if (f.presupuestoOrigenId || f.proyectoOrigenId) {
        var links = [];
        if (f.presupuestoOrigenId) links.push('<div>' + linkTo('presupuestos', f.presupuestoOrigenId, 'Ver presupuesto de origen') + '</div>');
        if (f.proyectoOrigenId) links.push('<div>' + linkTo('proyectos', f.proyectoOrigenId, 'Ver proyecto de origen') + '</div>');
        origenHtml = card(cardHead('Origen', 'Trazabilidad hacia el presupuesto o proyecto que generó esta factura'), '<div class="fdemo-card-body" style="display:flex; flex-direction:column; gap:8px;">' + links.join('') + '</div>');
      }
      var clienteHtml = cliente ? card(cardHead('Cliente'), '<div class="fdemo-field-grid">' +
        field('Empresa', linkTo('clientes', cliente.id, cliente.empresa)) + field('NIF/CIF', esc(dash(cliente.nif))) + field('Email', esc(dash(cliente.email))) + '</div>') : '';
      var obsHtml = f.observaciones ? card(cardHead('Observaciones'), '<p style="padding:20px; margin:0; font-size:.86rem; color:var(--dc-text-muted);">' + esc(f.observaciones) + '</p>') : '';

      return '<div class="fdemo-page is-narrow" style="gap:20px;">' +
        crumb('Facturas', 'facturas', f.numero) +
        '<div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;"><div><h1 class="fdemo-page-title">Factura ' + esc(f.numero) + '</h1><p class="fdemo-page-sub">' + esc(dash(f.clienteNombre)) + '</p></div>' +
        '<div style="display:flex; gap:8px;">' + pill(f.estado) + (f.estadoCobro ? pill(f.estadoCobro) : '') + '</div></div>' +
        card(cardHead('Datos de la factura'), '<div class="fdemo-field-grid">' +
          field('Importe', EUR(f.importe)) + field('Importe cobrado', EUR(f.importeCobrado)) + field('Pendiente', EUR(f.importe - (f.importeCobrado || 0))) +
          field('Fecha emisión', FDATE(f.fechaEmision)) + field('Fecha vencimiento', FDATE(f.fechaVencimiento)) + field('Fecha de pago', FDATE(f.fechaPago)) +
          field('Método de pago', esc(dash(f.metodoPago))) + field('Proyecto', esc(dash(f.proyecto))) + field('Recordatorios enviados', String(f.recordatoriosEnviados || 0)) +
          '</div>') +
        origenHtml + clienteHtml + obsHtml +
        '</div>';
    }

    // ---------- Presupuestos ----------
    RENDERERS.presupuestos = function (id) {
      if (id) return presupuestoDetalle(id);
      var all = FS.listPresupuestos();
      var rows = all.map(function (p) {
        return '<tr><td>' + linkTo('presupuestos', p.id, p.empresa) + '</td>' +
          '<td class="is-muted">' + FDATE(p.fechaGeneracion) + '</td>' +
          '<td class="is-right">' + EUR(p.importe) + '</td>' +
          '<td>' + pill(p.estado) + '</td>' +
          '<td class="is-muted">' + (p.aceptadaPorCliente ? 'Aceptada ' + FDATE(p.fechaAceptacion) : 'Sin aceptar') + '</td>' +
          '<td>' + (p.facturaGeneradaId ? linkTo('facturas', p.facturaGeneradaId, 'Ver factura') : '<span style="font-size:.72rem;color:var(--dc-text-faint);">Sin facturar</span>') + '</td></tr>';
      }).join('');
      var tableHtml = !all.length ? empty('Aún no hay presupuestos generados.') :
        '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr><th>Empresa</th><th>Generado</th><th class="is-right">Importe</th><th>Estado</th><th>Aceptación</th><th>Factura</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
      return pageHead('Presupuestos', all.length + ' presupuesto(s) en total') + card(null, tableHtml);
    };

    function presupuestoDetalle(id) {
      var p = FS.getPresupuesto(id);
      if (!p) return empty('Presupuesto no encontrado en la demo.');
      var facturacionBody;
      if (p.facturaGeneradaId) facturacionBody = linkTo('facturas', p.facturaGeneradaId, 'Ver factura generada');
      else if (p.aceptadaPorCliente) facturacionBody = '<p style="margin:0; font-size:.86rem; color:var(--dc-text-muted);">Aceptado — la factura se genera automáticamente por el workflow real desde Presupuesto Aceptado.</p>';
      else facturacionBody = '<p style="margin:0; font-size:.86rem; color:var(--dc-text-faint);">Pendiente de aceptación por el cliente.</p>';

      return '<div class="fdemo-page is-narrow" style="gap:20px;">' +
        crumb('Presupuestos', 'presupuestos', p.empresa) +
        '<div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;"><h1 class="fdemo-page-title">' + esc(p.empresa) + '</h1>' + pill(p.estado) + '</div>' +
        card(cardHead('Datos del presupuesto'), '<div class="fdemo-field-grid">' +
          field('Importe', EUR(p.importe)) + field('Fecha generación', FDATE(p.fechaGeneracion)) +
          field('Aceptado por cliente', p.aceptadaPorCliente ? 'Sí, ' + FDATE(p.fechaAceptacion) : 'No') + '</div>') +
        (p.resumenEjecutivo ? card(cardHead('Resumen ejecutivo'), '<p style="padding:20px; margin:0; font-size:.86rem; color:var(--dc-text-muted);">' + esc(p.resumenEjecutivo) + '</p>') : '') +
        (p.serviciosPropuestos ? card(cardHead('Servicios propuestos'), '<p style="padding:20px; margin:0; font-size:.86rem; color:var(--dc-text-muted); white-space:pre-line;">' + esc(p.serviciosPropuestos) + '</p>') : '') +
        card(cardHead('Facturación', 'Esta acción la ejecuta el workflow real, la interfaz no duplica esa lógica'), '<div class="fdemo-card-body">' + facturacionBody + '</div>') +
        '</div>';
    }

    // ---------- Clientes ----------
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
      var tableHtml = !filtrados.length ? empty(all.length === 0 ? 'Aún no hay clientes registrados.' : 'Ningún resultado.') :
        '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr><th>Empresa</th><th>Sector</th><th>Estado</th><th class="is-right">Cuota mensual</th><th class="is-right">Facturas</th></tr></thead><tbody>' + rows + '</tbody></table></div>';

      return pageHead('Clientes', all.length + ' cliente(s) en total') +
        '<form class="fdemo-filter-row" data-role="cliente-filter">' +
        '<input class="fdemo-input" style="max-width:420px;" type="text" name="q" placeholder="Buscar por empresa, sector o email…" value="' + esc(state.clienteFiltro.q) + '">' +
        '<button type="submit" class="fdemo-btn variant-secondary">Buscar</button></form>' +
        card(null, tableHtml);
    };

    function clienteDetalle(id) {
      var c = FS.getCliente(id);
      if (!c) return empty('Cliente no encontrado en la demo.');
      var facturasCliente = FS.listFacturas().filter(function (f) { return f.clienteIds.indexOf(id) !== -1; });
      var proyectosCliente = FS.listProyectos().filter(function (p) { return p.empresa === c.empresa; });

      var facturasHtml = !facturasCliente.length ? empty() :
        '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr><th>Nº</th><th>Estado</th><th class="is-right">Importe</th></tr></thead><tbody>' +
        facturasCliente.map(function (f) { return '<tr><td>' + linkTo('facturas', f.id, f.numero) + '</td><td>' + pill(f.estado) + '</td><td class="is-right">' + EUR(f.importe) + '</td></tr>'; }).join('') +
        '</tbody></table></div>';
      var proyectosHtml = !proyectosCliente.length ? empty() :
        '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr><th>Nombre</th><th>Estado</th><th class="is-right">Rentabilidad</th></tr></thead><tbody>' +
        proyectosCliente.map(function (p) { return '<tr><td>' + linkTo('proyectos', p.id, p.nombre) + '</td><td>' + pill(p.estado) + '</td><td class="is-right">' + EUR(p.rentabilidad) + '</td></tr>'; }).join('') +
        '</tbody></table></div>';

      return '<div class="fdemo-page" style="gap:20px; max-width:900px;">' +
        crumb('Clientes', 'clientes', c.empresa) +
        '<div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;"><h1 class="fdemo-page-title">' + esc(c.empresa) + '</h1>' + pill(c.estado) + '</div>' +
        card(cardHead('Información fiscal y contacto'), '<div class="fdemo-field-grid">' +
          field('NIF/CIF', esc(dash(c.nif))) + field('Dirección fiscal', esc(dash(c.direccionFiscal))) + field('Sector', esc(dash(c.sector))) +
          field('Email', esc(dash(c.email))) + field('Teléfono', esc(dash(c.telefono))) + field('Web', c.web ? '<a class="fdemo-link" href="' + esc(c.web) + '" target="_blank" rel="noopener noreferrer">' + esc(c.web) + '</a>' : '—') +
          field('Cuota mensual', c.cuotaMensual !== null ? EUR(c.cuotaMensual) : 'Sin cuota recurrente') + field('Facturación activa', c.facturacionActiva ? 'Sí' : 'No') +
          '</div>') +
        card(cardHead('Facturas', facturasCliente.length + ' factura(s)'), facturasHtml) +
        card(cardHead('Proyectos', proyectosCliente.length + ' proyecto(s)'), proyectosHtml) +
        '</div>';
    }

    // ---------- Cobros ----------
    RENDERERS.cobros = function () {
      var cobros = FS.listCobros();
      var grupos = {
        vencidos: cobros.filter(function (c) { return c.estadoCobro === 'Vencido'; }),
        seguimiento: cobros.filter(function (c) { return c.estadoCobro === 'En seguimiento'; }),
        pendientes: cobros.filter(function (c) { return c.estadoCobro === 'Pendiente' || c.estadoCobro === 'Parcial'; }),
        cobrados: cobros.filter(function (c) { return c.estadoCobro === 'Cobrado'; })
      };
      var totalPendiente = grupos.vencidos.concat(grupos.seguimiento, grupos.pendientes).reduce(function (s, c) { return s + c.pendiente; }, 0);

      function grupoCard(titulo, lista) {
        var body = !lista.length ? empty() :
          '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr><th>Factura</th><th>Cliente</th><th>Vencimiento</th><th class="is-right">Importe</th><th class="is-right">Cobrado</th><th class="is-right">Pendiente</th></tr></thead><tbody>' +
          lista.map(function (c) {
            return '<tr><td>' + linkTo('facturas', c.facturaId, c.numeroFactura) + '</td><td class="is-muted">' + esc(dash(c.clienteNombre)) + '</td><td class="is-muted">' + FDATE(c.fechaVencimiento) + '</td>' +
              '<td class="is-right">' + EUR(c.importe) + '</td><td class="is-right">' + EUR(c.importeCobrado) + '</td><td class="is-right">' + EUR(c.pendiente) + '</td></tr>';
          }).join('') + '</tbody></table></div>';
        return card(cardHead(titulo, lista.length + ' factura(s)'), body);
      }

      return pageHead('Cobros', 'Seguimiento de cobro de facturas emitidas') +
        '<div class="fdemo-kpi-grid">' +
        kpi('Pendiente total', EUR(totalPendiente), '', 'blue') +
        kpi('Vencidas', String(grupos.vencidos.length), '', 'danger') +
        kpi('En seguimiento', String(grupos.seguimiento.length), '', 'warning') +
        kpi('Cobradas', String(grupos.cobrados.length), '', 'cyan') +
        '</div>' +
        grupoCard('Vencidas', grupos.vencidos) + grupoCard('En seguimiento', grupos.seguimiento) +
        grupoCard('Pendientes / parciales', grupos.pendientes) + grupoCard('Cobradas', grupos.cobrados);
    };

    // ---------- Gastos ----------
    RENDERERS.gastos = function (id) {
      if (id) return gastoDetalle(id);
      var all = FS.listGastos();
      var total = all.reduce(function (s, g) { return s + g.importe; }, 0);
      var rows = all.map(function (g) {
        return '<tr><td>' + linkTo('gastos', g.id, g.proveedor) + '</td><td class="is-muted">' + esc(dash(g.concepto)) + '</td><td class="is-muted">' + esc(dash(g.categoria)) + '</td>' +
          '<td class="is-muted">' + FDATE(g.fecha) + '</td><td class="is-right">' + EUR(g.importe) + '</td><td>' + pill(g.estadoRevision) + '</td></tr>';
      }).join('');
      var tableHtml = !all.length ? empty('Aún no hay gastos registrados.') :
        '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr><th>Proveedor</th><th>Concepto</th><th>Categoría</th><th>Fecha</th><th class="is-right">Importe</th><th>Revisión</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
      return pageHead('Gastos', all.length + ' gasto(s) · Total ' + EUR(total)) + card(null, tableHtml);
    };

    function gastoDetalle(id) {
      var g = FS.getGasto(id);
      if (!g) return empty('Gasto no encontrado en la demo.');
      return '<div class="fdemo-page is-narrow" style="gap:20px;">' +
        crumb('Gastos', 'gastos', g.proveedor) +
        '<div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;"><h1 class="fdemo-page-title">' + esc(g.proveedor) + '</h1>' + pill(g.estadoRevision) + '</div>' +
        card(cardHead('Datos del gasto'), '<div class="fdemo-field-grid">' +
          field('Importe', EUR(g.importe)) + field('IVA', g.iva !== null ? EUR(g.iva) : '—') + field('Fecha', FDATE(g.fecha)) +
          field('Categoría', esc(dash(g.categoria))) + field('Proyecto', g.proyectoRecordId ? linkTo('proyectos', g.proyectoRecordId, 'Ver proyecto') : 'Sin proyecto asociado') +
          '</div>') +
        (g.concepto ? card(cardHead('Concepto'), '<p style="padding:20px; margin:0; font-size:.86rem; color:var(--dc-text-muted);">' + esc(g.concepto) + '</p>') : '') +
        (g.notasRevision ? card(cardHead('Notas de revisión'), '<p style="padding:20px; margin:0; font-size:.86rem; color:var(--dc-text-muted);">' + esc(g.notasRevision) + '</p>') : '') +
        '</div>';
    }

    // ---------- Proyectos ----------
    RENDERERS.proyectos = function (id) {
      if (id) return proyectoDetalle(id);
      var all = FS.listProyectos();
      var rows = all.map(function (p) {
        return '<tr><td>' + linkTo('proyectos', p.id, p.nombre) + '</td><td class="is-muted">' + esc(dash(p.empresa)) + '</td><td>' + pill(p.estado) + '</td>' +
          '<td class="is-muted">' + FDATE(p.fechaInicio) + '</td><td class="is-right">' + EUR(p.totalFacturado) + '</td><td class="is-right">' + EUR(p.totalGastos) + '</td><td class="is-right">' + EUR(p.rentabilidad) + '</td></tr>';
      }).join('');
      var tableHtml = !all.length ? empty('Aún no hay proyectos registrados.') :
        '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr><th>Proyecto</th><th>Cliente</th><th>Estado</th><th>Inicio</th><th class="is-right">Facturado</th><th class="is-right">Gastos</th><th class="is-right">Rentabilidad</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
      return pageHead('Proyectos', all.length + ' proyecto(s) en total') + card(null, tableHtml);
    };

    function proyectoDetalle(id) {
      var p = FS.getProyecto(id);
      if (!p) return empty('Proyecto no encontrado en la demo.');
      var facturasProyecto = FS.listFacturas().filter(function (f) { return f.proyectoOrigenId === id; });
      var gastosProyecto = FS.listGastos().filter(function (g) { return g.proyectoRecordId === id; });

      function statCard(label, value) {
        return '<div class="fdemo-stat-card"><p class="fdemo-stat-label">' + esc(label) + '</p><p class="fdemo-stat-value">' + value + '</p></div>';
      }
      var facturasHtml = !facturasProyecto.length ? empty() :
        '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr><th>Nº</th><th>Estado</th><th class="is-right">Importe</th></tr></thead><tbody>' +
        facturasProyecto.map(function (f) { return '<tr><td>' + linkTo('facturas', f.id, f.numero) + '</td><td>' + pill(f.estado) + '</td><td class="is-right">' + EUR(f.importe) + '</td></tr>'; }).join('') + '</tbody></table></div>';
      var gastosHtml = !gastosProyecto.length ? empty() :
        '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr><th>Proveedor</th><th>Categoría</th><th class="is-right">Importe</th></tr></thead><tbody>' +
        gastosProyecto.map(function (g) { return '<tr><td>' + linkTo('gastos', g.id, g.proveedor) + '</td><td class="is-muted">' + esc(dash(g.categoria)) + '</td><td class="is-right">' + EUR(g.importe) + '</td></tr>'; }).join('') + '</tbody></table></div>';

      return '<div class="fdemo-page" style="gap:20px; max-width:900px;">' +
        crumb('Proyectos', 'proyectos', p.nombre) +
        '<div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;"><div><h1 class="fdemo-page-title">' + esc(p.nombre) + '</h1><p class="fdemo-page-sub">' + esc(dash(p.empresa)) + '</p></div>' + pill(p.estado) + '</div>' +
        '<div class="fdemo-stat-row">' + statCard('Facturado', EUR(p.totalFacturado)) + statCard('Cobrado', EUR(p.totalCobrado)) + statCard('Gastos', EUR(p.totalGastos)) + statCard('Rentabilidad', EUR(p.rentabilidad)) + '</div>' +
        card(cardHead('Detalle'), '<div class="fdemo-field-grid">' +
          field('Fecha inicio', FDATE(p.fechaInicio)) + field('Entrega prevista', FDATE(p.fechaEntregaPrevista)) + field('Entrega real', FDATE(p.fechaEntregaReal)) + field('Responsable', esc(dash(p.responsable))) +
          '</div>' + (p.serviciosContratados ? '<div style="border-top:1px solid var(--dc-border); padding:20px;"><p class="fdemo-field-label">Servicios contratados</p><p class="fdemo-field-value" style="white-space:pre-line;">' + esc(p.serviciosContratados) + '</p></div>' : '')) +
        card(cardHead('Facturas del proyecto', facturasProyecto.length + ' factura(s)'), facturasHtml) +
        card(cardHead('Gastos del proyecto', gastosProyecto.length + ' gasto(s)'), gastosHtml) +
        '</div>';
    }

    // ---------- Pregunta a Finanzas ----------
    RENDERERS.ia = function () {
      var sugerencias = FS.askQuestions();
      var threadHtml;
      if (!state.ia.mensajes.length) {
        threadHtml = '<div class="fdemo-ia-empty"><p>Prueba con una de estas preguntas:</p><div class="fdemo-ia-chips">' +
          sugerencias.map(function (s, i) { return '<button type="button" class="fdemo-ia-chip" data-action="ask" data-idx="' + i + '">' + esc(s.q) + '</button>'; }).join('') +
          '</div></div>';
      } else {
        threadHtml = '<div class="fdemo-ia-msgs">' + state.ia.mensajes.map(function (m) {
          if (m.autor === 'usuario') return '<div class="fdemo-ia-msg from-user"><div class="fdemo-ia-bubble">' + esc(m.texto) + '</div></div>';
          var refs = (m.refs || []).map(function (r) { return '<button type="button" class="fdemo-ia-ref" data-action="nav" data-view="' + r.type + '" data-id="' + r.id + '">' + esc(r.label) + '</button>'; }).join('');
          return '<div class="fdemo-ia-msg from-ia"><div class="fdemo-ia-bubble">' + esc(m.texto) + (refs ? '<div class="fdemo-ia-refs">' + refs + '</div>' : '') + '</div></div>';
        }).join('') + '</div>';
      }

      return pageHead('Pregunta a Finanzas', 'Responde solo con datos de la demo (facturación, cobros, gastos y proyectos). No sustituye asesoramiento fiscal.') +
        '<div class="fdemo-card fdemo-ia-card">' +
        '<div class="fdemo-ia-thread" data-role="ia-thread">' + threadHtml + '</div>' +
        '<form class="fdemo-ia-form" data-role="ia-form">' +
        '<input class="fdemo-input" type="text" name="pregunta" placeholder="Escribe tu pregunta financiera…" autocomplete="off">' +
        '<button type="submit" class="fdemo-btn variant-primary">Enviar</button>' +
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

    // ---------- Configuración ----------
    RENDERERS.configuracion = function () {
      var ROLES = ['Administrador', 'Direccion', 'Finanzas', 'Operaciones', 'Solo lectura'];
      var MATRIZ = {
        Administrador: ['ver_dashboard', 'ver_facturas', 'editar_facturas', 'ver_presupuestos', 'facturar_presupuesto', 'ver_clientes', 'editar_clientes', 'ver_cobros', 'ver_gastos', 'revisar_gastos', 'ver_proyectos', 'usar_ia_financiera', 'ver_configuracion', 'editar_configuracion'],
        Direccion: ['ver_dashboard', 'ver_facturas', 'editar_facturas', 'ver_presupuestos', 'facturar_presupuesto', 'ver_clientes', 'editar_clientes', 'ver_cobros', 'ver_gastos', 'revisar_gastos', 'ver_proyectos', 'usar_ia_financiera', 'ver_configuracion'],
        Finanzas: ['ver_dashboard', 'ver_facturas', 'editar_facturas', 'ver_presupuestos', 'facturar_presupuesto', 'ver_clientes', 'ver_cobros', 'ver_gastos', 'revisar_gastos', 'ver_proyectos', 'usar_ia_financiera'],
        Operaciones: ['ver_dashboard', 'ver_facturas', 'ver_presupuestos', 'ver_clientes', 'ver_proyectos', 'ver_gastos'],
        'Solo lectura': ['ver_dashboard', 'ver_facturas', 'ver_presupuestos', 'ver_clientes', 'ver_cobros', 'ver_gastos', 'ver_proyectos']
      };
      var rolesHtml = ROLES.map(function (r) {
        return '<div class="fdemo-role-row"><p class="fdemo-role-name">' + esc(r) + '</p><div class="fdemo-role-perms">' +
          MATRIZ[r].map(function (p) { return '<span class="fdemo-role-perm">' + esc(p) + '</span>'; }).join('') + '</div></div>';
      }).join('');

      return pageHead('Configuración', 'Ajustes disponibles en esta demo pública.') +
        card(cardHead('Sesión actual'), '<div class="fdemo-field-grid">' +
          field('Usuario', 'Cuenta Demo') + field('Empresa', 'Entorno de demostración · D-Code Finance') + field('Rol', pill('Administrador')) + '</div>') +
        card(cardHead('Origen de datos', 'Controlado por la variable de entorno DATA_SOURCE en el producto real'), '<div class="fdemo-card-body">' + pill('Datos de muestra (mock)') + '</div>') +
        card(cardHead('Roles y permisos', 'Misma matriz de permisos que el producto real'), rolesHtml) +
        card(cardHead('Sobre esta demo'), '<ul class="fdemo-pending-list">' +
          '<li>Los datos son ficticios y no se guardan ni se envían a ningún sistema real.</li>' +
          '<li>"Pregunta a Finanzas" calcula sus respuestas aquí mismo, sobre este dataset — no llama a ningún servicio externo.</li>' +
          '<li>El sistema real se conecta a Airtable/n8n de D-Code Partners; esta demo pública está completamente aislada de esa infraestructura.</li>' +
          '</ul>');
    };

    // -------- Delegación de eventos --------
    root.addEventListener('click', function (e) {
      var navEl = e.target.closest('[data-action="nav"]');
      if (navEl) {
        e.preventDefault();
        navigate(navEl.getAttribute('data-view'), navEl.getAttribute('data-id'));
        return;
      }
      var askEl = e.target.closest('[data-action="ask"]');
      if (askEl) {
        e.preventDefault();
        askIndex(Number(askEl.getAttribute('data-idx')));
        return;
      }
      var navItem = e.target.closest('[data-role="nav"]');
      if (navItem) {
        e.preventDefault();
        navigate(navItem.getAttribute('data-view'), null);
        return;
      }
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
        state.ia.mensajes.push({ autor: 'ia', texto: 'Esta demo responde a partir de las tres preguntas sugeridas, calculadas sobre el dataset ficticio. Prueba una de las sugerencias de arriba.', refs: [] });
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
