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
    { id: 'documentos', label: 'Documents', grupo: 'dia' },
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
    documentos: '<path d="M6 2.75h8L19.25 8v13.25a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75V3.5A.75.75 0 0 1 6 2.75Z"/><path d="M13.5 3v5h5.25"/><path d="M9 13.5h6M9 17h3.5" stroke-linecap="round"/>',
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
    var useHash = mode === 'fullpage';

    root.classList.add('fdemo-app', useHash ? 'is-fullpage' : 'is-embedded');
    root.innerHTML =
      '<div class="fdemo-sidebar-overlay" data-role="overlay"></div>' +
      '<nav class="fdemo-sidebar" data-role="sidebar"></nav>' +
      '<div class="fdemo-shell">' +
      '<div class="fdemo-topbar">' +
      '<button class="fdemo-topbar-menu-btn" type="button" data-role="menu-btn" aria-label="Open menu">' + MENU_ICON + '</button>' +
      '<div class="fdemo-topbar-right">' +
      /* EL RECORRIDO. Si no lo toca nadie, la demo se recorre sola los
         módulos; en cuanto alguien interactúa, se para y manda el usuario.
         El indicador está aquí y no escondido: quien ve moverse la pantalla
         tiene que saber por qué se mueve y cómo pararlo. */
      '<button type="button" class="fdemo-tour" data-role="tour" aria-live="polite">' +
      '<span class="fdemo-tour-dot" aria-hidden="true"></span>' +
      '<span class="fdemo-tour-txt" data-role="tour-txt">Guided tour</span>' +
      '</button>' +
      '<div class="fdemo-topbar-user"><div class="fdemo-topbar-name">D-Code Partners</div><div class="fdemo-topbar-role">Demo account</div></div>' +
      '<div class="fdemo-topbar-avatar">D</div>' +
      (useHash ? '<a class="fdemo-topbar-exit" href="' + (root.getAttribute('data-exit-href') || '/en/sistema-financiero') + '">' + esc(root.getAttribute('data-exit-label') || 'Exit') + '</a>' : '') +
      '</div>' +
      '<div class="fdemo-tour-bar" data-role="tour-bar" aria-hidden="true"><i></i></div>' +
      '</div>' +
      // The DEMO mark shows in BOTH modes. It used to be full-screen only, so
      // the instance embedded in the home page showed amounts, clients and due
      // dates with nothing visible saying they are made up.
      '<div class="fdemo-demo-banner" role="status"><span class="fdemo-demo-banner-dot" aria-hidden="true"></span><span class="fdemo-demo-banner-label">Demo</span><span class="fdemo-demo-banner-text">fictional data, does not reflect real D-Code Partners information</span></div>' +
      '<div class="fdemo-main" data-role="main"><div class="fdemo-page" data-role="content"></div></div>' +
      '</div>' +
      /* LA MANO DEL RECORRIDO. Vive fuera del contenido porque se mueve
         sobre la aplicación entera —del menú a la pantalla— y porque así
         no la borra ningún re-render. No recibe eventos: es un dibujo. */
      '<span class="fdemo-mano" data-role="mano" aria-hidden="true"><i></i></span>';

    var sidebarEl = root.querySelector('[data-role="sidebar"]');
    var overlayEl = root.querySelector('[data-role="overlay"]');
    var mainEl = root.querySelector('[data-role="main"]');
    var contentEl = root.querySelector('[data-role="content"]');
    var menuBtn = root.querySelector('[data-role="menu-btn"]');

    var state = { doc: { fase: 'inicio', archivo: null, t: 0 }, gastoNuevo: null, route: 'ia', id: null, facturaFiltro: { q: '', estado: '' }, clienteFiltro: { q: '' }, ia: { mensajes: [], enviando: false } };

    // La conversación no empieza en blanco. Quien llega a la demo ve una
    // pregunta ya respondida -- con sus cifras y sus enlaces -- antes de
    // escribir nada: es lo que hay que entender de este sistema, y pedirle al
    // visitante que lo descubra escribiendo es pedirle demasiado.
    (function () {
      var inicial = FS.askQuestions().filter(function (q) { return q.clave === 'resumen'; })[0];
      if (!inicial) return;
      state.ia.mensajes.push({ autor: 'usuario', texto: inicial.q });
      state.ia.mensajes.push({ autor: 'ia', resp: inicial.a() });
    })();

    /* LA NAVEGACIÓN ES LA DEL PRODUCTO, EMPOTRADA O NO.

       La versión empotrada usaba una lista plana sin iconos «para no tocar el
       escaparate aprobado». El escaparate era el problema: alguien que entra
       en la web tiene que ver la misma barra lateral que verá el día que
       entre en el sistema, con sus grupos y sus iconos. En un teléfono el
       CSS la aplana en una tira horizontal (display:contents), así que el
       mismo HTML sirve para las dos. */
    var navIndicatorEl = null;
    if (true) {
      sidebarEl.innerHTML =
        /* El trazado es el de MarcaFinance.tsx, literal. El píxel central
           va en --dc-mark-accent: es IDENTIDAD, no acción ni estado. */
        '<div class="fdemo-brand fdemo-brand--full">' +
        '<span class="fdemo-brand-mark">' +
        '<svg viewBox="0 0 120 100" width="26" height="22" fill="none" aria-hidden="true" focusable="false">' +
        '<g fill="currentColor">' +
        '<rect x="26" y="1" width="16" height="16" rx="2"/><rect x="1" y="27" width="13" height="13" rx="2"/>' +
        '<rect x="35" y="26" width="13" height="13" rx="2"/><rect x="2" y="64" width="12" height="12" rx="2"/>' +
        '<rect x="35" y="64" width="13" height="13" rx="2"/><rect x="26" y="83" width="16" height="16" rx="2"/>' +
        '<path d="M48 1H86A32 32 0 0 1 118 33V38H102V33A16 16 0 0 0 86 17H48Z"/>' +
        '<rect x="102" y="43" width="16" height="16" rx="2"/>' +
        '<path d="M48 99H86A32 32 0 0 0 118 67V63H102V67A16 16 0 0 1 86 83H48Z"/>' +
        '</g>' +
        '<rect x="16" y="45" width="15" height="15" rx="2" fill="var(--dc-mark-accent)"/>' +
        '</svg></span>' +
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
        // En un movil el menu es una tira horizontal: si el modulo activo se
        // queda fuera de la tira, nadie sabe donde esta. Se acerca solo, y sin
        // scrollIntoView, que arrastraria tambien la pagina.
        if (active && sidebarEl.scrollWidth > sidebarEl.clientWidth + 4) {
          var izq = el.offsetLeft - 12;
          var der = el.offsetLeft + el.offsetWidth + 12 - sidebarEl.clientWidth;
          if (izq < sidebarEl.scrollLeft) sidebarEl.scrollLeft = izq;
          else if (der > sidebarEl.scrollLeft) sidebarEl.scrollLeft = der;
        }
      });
    }
    function closeMobileMenu() { sidebarEl.classList.remove('is-open'); overlayEl.classList.remove('is-open'); }

    function parseRoute() {
      if (!useHash) return { view: state.route, id: state.id };
      var h = (location.hash || '#ia').replace('#', '');
      var parts = h.split('/');
      var view = NAV_ITEMS.some(function (v) { return v.id === parts[0]; }) ? parts[0] : 'ia';
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

    /* En un telefono una tabla de seis columnas con min-width 640 es una tabla
       que se lee de lado, y eso no lo hace nadie. Cada celda se lleva el
       titulo de su columna en `data-col` y el CSS convierte cada fila en una
       ficha por debajo de 720 px. Se hace aqui, despues de pintar, y no en
       cada renderizador: son nueve modulos y el HTML de las tablas no cambia. */
    function etiquetarTablas() {
      contentEl.querySelectorAll('.fdemo-table').forEach(function (tabla) {
        var cabeceras = [].map.call(tabla.querySelectorAll('thead th'), function (th) { return th.textContent.trim(); });
        if (!cabeceras.length) return;
        tabla.querySelectorAll('tbody tr').forEach(function (fila) {
          [].forEach.call(fila.children, function (celda, i) {
            if (cabeceras[i]) celda.setAttribute('data-col', cabeceras[i]);
          });
        });
      });
    }

    function render() {
      var r = parseRoute();
      setActiveNav(r.view);
      var renderer = RENDERERS[r.view] || RENDERERS.dashboard;
      contentEl.innerHTML = renderer(r.id);
      etiquetarTablas();
      mainEl.scrollTop = 0;
    }

    if (useHash) window.addEventListener('hashchange', render);

    var RENDERERS = {};

    function pageHead(title, sub) {
      return '<div><h1 class="fdemo-page-title">' + esc(title) + '</h1>' + (sub ? '<p class="fdemo-page-sub">' + esc(sub) + '</p>' : '') + '</div>';
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
        '<div class="fdemo-dash-row">' +
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
        '<div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;"><div><h1 class="fdemo-page-title">Invoice ' + esc(f.numero) + '</h1><p class="fdemo-page-sub">' + esc(dash(f.clienteNombre)) + '</p></div>' +
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
        '<div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;"><h1 class="fdemo-page-title">' + esc(p.empresa) + '</h1>' + pill(p.estado) + '</div>' +
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
        '<div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;"><h1 class="fdemo-page-title">' + esc(c.empresa) + '</h1>' + pill(c.estado) + '</div>' +
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
      /* The dashboard and Ask Finance count what is overdue BY DATE. This
         screen counted it BY STATUS, so the same demo showed two different
         numbers: 2026-011 is 27 days late and sits in "Following up", so it
         never showed up as overdue. Counted by date, which is what matters to
         whoever is chasing the money; the groups below stay by status, which
         is how the system works. */
      var hoy = FS.hoy || '';
      var fueraDePlazo = cobros.filter(function (c) { return c.pendiente > 0 && c.fechaVencimiento && c.fechaVencimiento < hoy; });

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
        kpi('Past due', String(fueraDePlazo.length), 'By due date', 'danger') +
        kpi('Following up', String(grupos.seguimiento.length), '', 'warning') +
        kpi('Collected', String(grupos.cobrados.length), '', 'cyan') +
        '</div>' +
        grupoCard('Overdue', grupos.vencidos) + grupoCard('Following up', grupos.seguimiento) +
        grupoCard('Pending / partial', grupos.pendientes) + grupoCard('Collected', grupos.cobrados);
    };

    // ---------- Expenses ----------
    RENDERERS.gastos = function (id) {
      if (id) return gastoDetalle(id);
      /* El gasto que acaba de salir de un PDF va el primero y marcado: sin
         eso, «crear gasto» es un botón que no se sabe si ha hecho algo. */
      var all = (state.gastoNuevo ? [state.gastoNuevo] : []).concat(FS.listGastos());
      var total = all.reduce(function (s, g) { return s + g.importe; }, 0);
      var rows = all.map(function (g) {
        return '<tr' + (g.documento ? ' class="is-nuevo"' : '') + '><td>' + linkTo('gastos', g.id, g.proveedor) +
          (g.documento ? '<span class="fdemo-nuevo-pill">New</span><span class="fdemo-doc-mini">' + esc(g.documento) + '</span>' : '') +
          '</td><td class="is-muted">' + esc(dash(g.concepto)) + '</td><td class="is-muted">' + esc(dash(g.categoria)) + '</td>' +
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
        '<div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;"><h1 class="fdemo-page-title">' + esc(g.proveedor) + '</h1>' + pill(g.estadoRevision) + '</div>' +
        card(cardHead('Expense details'), '<div class="fdemo-field-grid">' +
          field('Amount', EUR(g.importe)) + field('VAT', g.iva !== null ? EUR(g.iva) : '—') + field('Date', FDATE(g.fecha)) +
          field('Category', esc(dash(g.categoria))) + field('Project', g.proyectoRecordId ? linkTo('proyectos', g.proyectoRecordId, 'View project') : 'No project linked') +
          '</div>') +
        (g.concepto ? card(cardHead('Concept'), '<p style="padding:20px; margin:0; font-size:.86rem; color:var(--dc-text-muted);">' + esc(g.concepto) + '</p>') : '') +
        (g.notasRevision ? card(cardHead('Review notes'), '<p style="padding:20px; margin:0; font-size:.86rem; color:var(--dc-text-muted);">' + esc(g.notasRevision) + '</p>') : '') +
        '</div>';
    }


    /* ══════════════════ DOCUMENTOS · LO QUE HACE UN PDF ══════════════════

       Comprobado en el sistema real antes de escribir esto: Gastos → «Desde
       PDF» sube la factura del proveedor, detecta los campos y ENSEÑA EL
       FRAGMENTO DEL DOCUMENTO DEL QUE HA SALIDO CADA UNO. Se revisa, se
       corrige y se confirma; hasta entonces no se guarda nada. Si el PDF es
       un escaneado, lo dice y guarda el documento igual.

       Eso es lo que se reproduce aquí, con un documento de ejemplo y con sus
       dos finales, porque los dos son reales. Lo que el sistema NO hace —dar
       de alta varias facturas solas desde un PDF— no aparece. */
    var DOC_CAMPOS = [
      { k: 'Total amount', v: '498,52 €', frag: '…mponible: 412,00 EUR  IVA 21%: 86,52 EUR  TOTAL FACTURA: 498,52 EUR' },
      { k: 'Date', v: '12 ago 2026', frag: '…de factura: FP-2026-0441  Fecha de emision: 12/08/2026  Fecha de vencimient…' },
      { k: 'Invoice number', v: 'FP-2026-0441', frag: '…Pradillo 42, 28002 Madrid  FACTURA  Numero de factura: FP-2026-0441…' },
      { k: 'Net amount', v: '412,00 €', frag: '…y consumibles de agosto  Base imponible: 412,00 EUR  IVA 21%: 86,52 E…' },
      { k: 'VAT', v: '86,52 €', frag: '…Base imponible: 412,00 EUR  IVA 21%: 86,52 EUR  TOTAL FACTURA: 4…' },
      { k: 'Tax ID found (no supplier record matches it)', v: 'B84213977', frag: 'SUMINISTROS BELMONTE SL  CIF B84213977 - Calle Pradillo 42…' }
    ];

    function docPaso(fase) {
      state.doc.fase = fase;
      render();
    }

    RENDERERS.documentos = function () {
      var f = state.doc.fase;
      var cuerpo;

      if (f === 'analizando') {
        cuerpo = '<div class="fdemo-doc-run"><span class="fdemo-doc-spin" aria-hidden="true"></span>' +
          '<p class="fdemo-doc-run-t">' + 'Uploading and analysing' + ' <b>' + esc(state.doc.archivo) + '</b>…</p></div>';
      } else if (f === 'detectado') {
        cuerpo = '<div class="fdemo-doc-out">' +
          '<p class="fdemo-doc-out-t">' + 'Detected in' + ' «<b>' + esc(state.doc.archivo) + '</b>»</p>' +
          '<p class="fdemo-doc-out-s">' + 'Every value shows the fragment of the PDF it came from. Review it, correct whatever needs correcting and confirm: nothing is saved until then.' + '</p>' +
          '<ul class="fdemo-doc-campos">' + DOC_CAMPOS.map(function (c) {
            return '<li><span class="fdemo-doc-k">' + esc(c.k) + '</span>' +
              '<span class="fdemo-doc-v">' + esc(c.v) + '</span>' +
              '<span class="fdemo-doc-frag">' + esc(c.frag) + '</span></li>';
          }).join('') + '</ul>' +
          '<div class="fdemo-doc-acts">' +
          '<button type="button" class="fdemo-btn variant-primary" data-action="doc" data-doc="crear">' + 'Create expense' + '</button>' +
          '<button type="button" class="fdemo-btn" data-action="doc" data-doc="inicio">' + 'Cancel' + '</button>' +
          '</div></div>';
      } else if (f === 'escaneado') {
        cuerpo = '<div class="fdemo-doc-out is-warn">' +
          '<p class="fdemo-doc-out-t">«<b>' + esc(state.doc.archivo) + '</b>»</p>' +
          '<p class="fdemo-doc-out-s">' + 'The PDF has no readable text (most likely a scan or a photo). You can type the data in by hand: the document is already stored and will be attached to the expense.' + '</p>' +
          '<div class="fdemo-doc-acts">' +
          '<button type="button" class="fdemo-btn variant-primary" data-action="nav" data-view="gastos">' + 'Fill it in by hand' + '</button>' +
          '<button type="button" class="fdemo-btn" data-action="doc" data-doc="inicio">' + 'Try another document' + '</button>' +
          '</div></div>';
      } else if (f === 'creado') {
        cuerpo = '<div class="fdemo-doc-out is-ok">' +
          '<p class="fdemo-doc-out-s">' + 'Expense created with the document attached. It is at the top of Expenses, pending review.' + '</p>' +
          '<div class="fdemo-doc-acts">' +
          '<button type="button" class="fdemo-btn variant-primary" data-action="nav" data-view="gastos">' + 'See the expense in Expenses' + '</button>' +
          '<button type="button" class="fdemo-btn" data-action="doc" data-doc="inicio">' + 'Try another document' + '</button>' +
          '</div></div>';
      } else {
        cuerpo = '<p class="fdemo-doc-explica">' + 'Upload the supplier invoice as a PDF. If the PDF is digital, the fields are detected on their own and you just review them. If it is a scan, the document is stored and you fill the data in by hand.' + '</p>' +
          '<div class="fdemo-doc-acts">' +
          '<button type="button" class="fdemo-btn variant-primary" data-action="doc" data-doc="digital">' + 'Try it with a digital invoice' + '</button>' +
          '<button type="button" class="fdemo-btn" data-action="doc" data-doc="escaneado">' + 'Try it with a scan' + '</button>' +
          '</div>';
      }

      var archivo = [
        { n: state.gastoNuevo ? 'FP-2026-0441-belmonte.pdf' : 'delivery-note-ALB-2026-0007.pdf', t: state.gastoNuevo ? 'Factura' : 'Delivery note', o: state.gastoNuevo ? 'Expense from PDF' : 'Manual upload', d: state.gastoNuevo ? '12 ago 2026' : '02 ago 2026' },
        { n: 'contract-nortex-2026.pdf', t: 'Other', o: 'Manual upload', d: '21 jul 2026' }
      ];

      return pageHead('Documents', 'Every file is stored once and stays protected: it can only be downloaded from here, with your session and your permission checked on each attempt.') +
        card('<div class="fdemo-card-head"><div><h2 class="fdemo-card-title">' + 'New expense from a PDF' + '</h2>' +
             '<p class="fdemo-card-subtitle">' + 'You can also create it by hand — this path only saves you the typing.' + '</p></div></div>',
             '<div class="fdemo-doc-body">' + cuerpo +
             '<p class="fdemo-doc-nota">' + 'This is how the real system works. Here you see it with a sample document: this demo uploads no file of yours and saves nothing.' + '</p></div>') +
        card(cardHead('Files', 'Uploaded documents, with their type and where they came from'),
             '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr><th>' + 'Document' + '</th><th>' + 'Type' + '</th><th>' + 'Source' + '</th><th>' + 'Date' + '</th></tr></thead><tbody>' +
             archivo.map(function (a) {
               return '<tr><td>' + esc(a.n) + '</td><td>' + pill(a.t) + '</td><td class="is-muted">' + esc(a.o) + '</td><td class="is-muted">' + esc(a.d) + '</td></tr>';
             }).join('') + '</tbody></table></div>' +
             '<p class="fdemo-doc-nota">' + 'Types the system recognises: quote, order, delivery note, invoice, expense, receipt, proof of payment and other.' + '</p>');
    };

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
        '<div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;"><div><h1 class="fdemo-page-title">' + esc(p.nombre) + '</h1><p class="fdemo-page-sub">' + esc(dash(p.empresa)) + '</p></div>' + pill(p.estado) + '</div>' +
        '<div class="fdemo-stat-row">' + statCard('Billed', EUR(p.totalFacturado)) + statCard('Collected', EUR(p.totalCobrado)) + statCard('Expenses', EUR(p.totalGastos)) + statCard('Profitability', EUR(p.rentabilidad)) + '</div>' +
        card(cardHead('Detail'), '<div class="fdemo-field-grid">' +
          field('Start date', FDATE(p.fechaInicio)) + field('Expected delivery', FDATE(p.fechaEntregaPrevista)) + field('Actual delivery', FDATE(p.fechaEntregaReal)) + field('Owner', esc(dash(p.responsable))) +
          '</div>' + (p.serviciosContratados ? '<div style="border-top:1px solid var(--dc-border); padding:20px;"><p class="fdemo-field-label">Contracted services</p><p class="fdemo-field-value" style="white-space:pre-line;">' + esc(p.serviciosContratados) + '</p></div>' : '')) +
        card(cardHead('Project invoices', facturasProyecto.length + ' invoice(s)'), facturasHtml) +
        card(cardHead('Project expenses', gastosProyecto.length + ' expense(s)'), gastosHtml) +
        '</div>';
    }

    // ---------- Pregunta a Finanzas ----------
    // Es la vista con la que abre la demo, en las dos modalidades. El resto de
    // módulos siguen ahí, en el menú, pero lo primero que se ve es una
    // pregunta contestada: un panel de cifras no explica por sí solo para qué
    // sirve el sistema, y una respuesta sí.
    function datoHtml(d) {
      return '<div class="fdemo-dato"><span class="fdemo-dato-k">' + esc(d.k) + '</span>' +
        '<span class="fdemo-dato-v">' + esc(d.v) + '</span>' +
        (d.n ? '<span class="fdemo-dato-n">' + esc(d.n) + '</span>' : '') + '</div>';
    }

    function respuestaHtml(r) {
      var partes = ['<div class="fdemo-ans">'];
      /* Un documento leído se anuncia antes de la conclusión: lo primero que
         quiere saber quien acaba de adjuntar algo es si se ha entendido. */
      if (r.chip) partes.push(chipHtml(r.chip));
      if (r.grupoT) partes.push('<p class="fdemo-ans-grupo-t">' + esc(r.grupoT) + '</p>');
      partes.push('<p class="fdemo-ans-conclusion">' + esc(r.conclusion) + '</p>');
      if (r.datos && r.datos.length) {
        partes.push('<div class="fdemo-ans-datos">' + r.datos.map(datoHtml).join('') + '</div>');
      }
      if (r.significado) {
        partes.push('<p class="fdemo-ans-sig"><b>What it means.</b> ' + esc(r.significado) + '</p>');
      }
      if (r.revisar && r.revisar.length) {
        partes.push('<div class="fdemo-ans-rev"><p class="fdemo-ans-rev-t">What to check</p><ul>' +
          r.revisar.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>');
      }
      if (r.refs && r.refs.length) {
        partes.push('<div class="fdemo-ia-refs"><span class="fdemo-ia-refs-t">Taken from:</span>' +
          r.refs.map(function (ref) {
            return '<button type="button" class="fdemo-ia-ref" data-action="nav" data-view="' + ref.type + '" data-id="' + ref.id + '">' + esc(ref.label) + '</button>';
          }).join('') + '</div>');
      }
      if (r.motor) partes.push('<p class="fdemo-ans-motor">' + esc(r.motor) + '</p>');
      partes.push('</div>');
      return partes.join('');
    }

    function chipHtml(c) {
      return '<span class="fdemo-doc-chip"><span class="fdemo-doc-chip-n">' + esc(c.nombre) + '</span>' +
        '<span class="fdemo-doc-chip-k">' + esc(c.peso) + '</span>' +
        '<span class="fdemo-doc-chip-ok">' + esc(c.leido) + '</span></span>';
    }

    function mensajeHtml(m) {
      if (m.autor === 'usuario') {
        return '<div class="fdemo-ia-msg from-user">' + (m.chip ? chipHtml(m.chip) : '') +
          '<div class="fdemo-ia-bubble">' + esc(m.texto) + '</div></div>';
      }
      if (m.resp) {
        return '<div class="fdemo-ia-msg from-ia">' + respuestaHtml(m.resp) + '</div>';
      }
      return '<div class="fdemo-ia-msg from-ia"><div class="fdemo-ia-bubble">' + esc(m.texto || '') + '</div></div>';
    }


    /* ══════════════ UN DOCUMENTO DENTRO DE LA CONVERSACIÓN ════════════════

       Probado contra el sistema real con un CSV de tres líneas. Lo que hace
       —y lo que se reproduce aquí— es: leerlo en local, decir qué estructura
       tiene, sumarlo, agruparlo por la columna que identifica al proveedor y
       contrastarlo con lo que ya hay registrado. Y decir lo que NO puede
       concluir, que es lo que separa una herramienta de un adivino. */
    var DOC_FILAS = [
      { p: 'Transportes Ferrer', v: 1240 },
      { p: 'Hosting Arnal', v: 890 },
      { p: 'Suministros Belmonte S.L.', v: 412 }
    ];
    function adjuntarDocumento() {
      var chip = { nombre: 'supplier-invoices-august.csv', peso: '1 KB', leido: '✓ ' + 'CSV table (3 rows, 7 columns)' };
      var totalDoc = DOC_FILAS.reduce(function (s, f) { return s + f.v; }, 0);
      var registrado = FS.listGastos().reduce(function (s, g) { return s + g.importe; }, 0);
      state.ia.mensajes.push({ autor: 'usuario', texto: 'What does this file contain and how does it fit the company data?', chip: chip });
      state.ia.mensajes.push({ autor: 'ia', resp: {
        chip: chip,
        grupoT: 'By “supplier”' + ' · ' + 'supplier-invoices-august.csv',
        conclusion: 'The document adds up to €2,542.00. On record here there is ' + EUR(registrado) + ' of expense. Its categories do not match the ones Finance uses, so I cannot cross them line by line. And I do not know whether it is already recorded or additional: if it is additional, those amounts would add to the expense; if it is an extract of what is already there, it is useful to check against.',
        datos: DOC_FILAS.map(function (f) {
          return { k: f.p, v: EUR(f.v), n: Math.round(f.v / totalDoc * 1000) / 10 + ' % · ' + '1 row' };
        }),
        significado: 'The reader opens the file, works out its structure, adds it up, groups it by the column that identifies the supplier and checks it against what is recorded. What it does not do is create those lines: that happens in Documents, one invoice at a time and with review.',
        revisar: ['If the document is additional, those €2,542.00 would add to the recorded expense.'],
        refs: [{ type: 'documentos', id: '', label: 'Documents' }],
        motor: 'Read right here, in your browser'
      } });
      render();
      var hilo = root.querySelector('[data-role="ia-thread"]');
      if (hilo) hilo.scrollTop = hilo.scrollHeight;
      mainEl.scrollTop = mainEl.scrollHeight;
    }

    RENDERERS.ia = function () {
      var sugerencias = FS.askQuestions();
      var hechas = state.ia.mensajes.filter(function (m) { return m.autor === 'usuario'; }).map(function (m) { return m.texto; });
      var chips = sugerencias.map(function (s, i) {
        if (hechas.indexOf(s.q) !== -1) return '';
        return '<button type="button" class="fdemo-ia-chip" data-action="ask" data-idx="' + i + '">' + esc(s.q) + '</button>';
      }).join('');

      return '<div class="fdemo-ask">' +
        '<header class="fdemo-ask-head">' +
        '<p class="fdemo-ask-kicker">Financial intelligence</p>' +
        '<h1 class="fdemo-ask-title">Ask Finance</h1>' +
        '<p class="fdemo-ask-sub">Ask the system what is going on in your company. <span class="fdemo-ask-sub-extra">It answers from your own data and shows where every figure came from.</span></p>' +
        '</header>' +
        '<div class="fdemo-ask-thread" data-role="ia-thread"><div class="fdemo-ia-msgs">' +
        state.ia.mensajes.map(mensajeHtml).join('') +
        '</div></div>' +
        '<form class="fdemo-ask-form" data-role="ia-form">' +
        '<input class="fdemo-input" type="text" name="pregunta" aria-label="Type your question" placeholder="What is going on?" autocomplete="off" maxlength="200">' +
        '<button type="submit" class="fdemo-btn variant-primary">Ask</button>' +
        '</form>' +
        '<button type="button" class="fdemo-ask-clip" data-action="adjuntar">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M21 11.5 12.5 20a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '<span>Attach a document</span><i>PDF, Excel, CSV or images</i></button>' +
        (chips ? '<div class="fdemo-ask-chips"><p class="fdemo-ask-chips-t">Or try one of these:</p><div class="fdemo-ia-chips">' + chips + '</div></div>' : '') +
        '<p class="fdemo-ask-foot">Fictional data. In this demo the answers are computed right here in your browser; the real system answers over your company’s data.</p>' +
        '</div>';
    };

    function empujarPregunta(q) {
      state.ia.mensajes.push({ autor: 'usuario', texto: q.q });
      state.ia.mensajes.push({ autor: 'ia', resp: q.a() });
      render();
      var thread = root.querySelector('[data-role="ia-thread"]');
      if (thread) thread.scrollTop = thread.scrollHeight;
      /* El hilo se mueve, pero la respuesta nueva puede quedar por debajo del
         borde del marco: la aplicación también baja hasta el final. */
      mainEl.scrollTop = mainEl.scrollHeight;
    }

    function askIndex(idx) {
      var q = FS.askQuestions()[idx];
      if (q) empujarPregunta(q);
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
      var docEl = e.target.closest('[data-action="doc"]');
      if (docEl) {
        e.preventDefault();
        var q = docEl.getAttribute('data-doc');
        if (q === 'digital' || q === 'escaneado') {
          state.doc.archivo = q === 'digital' ? 'FP-2026-0441-belmonte.pdf' : 'receipt-viajes-meridiano.pdf';
          docPaso('analizando');
          clearTimeout(state.doc.t);
          state.doc.t = setTimeout(function () { docPaso(q === 'digital' ? 'detectado' : 'escaneado'); }, 1400);
        } else if (q === 'crear') {
          state.gastoNuevo = {
            id: 'doc-gas-1', proveedor: 'Suministros Belmonte S.L.', importe: 498.52, iva: 86.52,
            fecha: '2026-08-12', concepto: 'Office supplies and consumables', categoria: 'Office supplies',
            estadoRevision: 'Pending review', proyectoRecordId: null, notasRevision: null,
            documento: 'FP-2026-0441-belmonte.pdf'
          };
          docPaso('creado');
        } else {
          clearTimeout(state.doc.t);
          docPaso('inicio');
        }
        return;
      }
      var clipEl = e.target.closest('[data-action="adjuntar"]');
      if (clipEl) {
        e.preventDefault();
        adjuntarDocumento();
        return;
      }
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
        input.value = '';
        var encontrada = FS.matchQuestion ? FS.matchQuestion(texto) : null;
        if (encontrada) {
          state.ia.mensajes.push({ autor: 'usuario', texto: texto });
          state.ia.mensajes.push({ autor: 'ia', resp: encontrada.a() });
        } else {
          // Sin coincidencia no se improvisa: se dice lo que esta demo puede
          // contestar y lo que hace el sistema real, que no es lo mismo.
          state.ia.mensajes.push({ autor: 'usuario', texto: texto });
          state.ia.mensajes.push({ autor: 'ia', resp: { conclusion: 'This demo has six prepared questions and that one does not look like any of them, so I am not going to make it up. The real system answers openly over your company data. Try one of the ones below.', datos: [], refs: [] } });
        }
        render();
        var thread = root.querySelector('[data-role="ia-thread"]');
        if (thread) thread.scrollTop = thread.scrollHeight;
      /* El hilo se mueve, pero la respuesta nueva puede quedar por debajo del
         borde del marco: la aplicación también baja hasta el final. */
      mainEl.scrollTop = mainEl.scrollHeight;
      }
    });


    /* ════════════════════════ EL RECORRIDO AUTOMÁTICO ═══════════════════

       Una aplicación parada en su pantalla de inicio no enseña que sea una
       aplicación: enseña una captura. Si no la toca nadie, esta se recorre
       sola los módulos, se para en cada uno el tiempo que cuesta leerlo y
       vuelve a empezar. En cuanto alguien la toca, se calla y manda él.

       Lo que NO hace, que es la mitad del trabajo: no corre fuera de la
       pantalla, no corre con movimiento reducido y no corre en la pantalla
       completa —ahí se ha entrado a usarla, no a mirarla—. */
    var TOUR = [
      { v: 'dashboard',  ms: 7200 },
      { v: 'facturas',   ms: 6400 },
      { v: 'cobros',     ms: 6400 },
      { v: 'gastos',     ms: 6400 },
      { v: 'clientes',   ms: 6000 },
      { v: 'proyectos',  ms: 6400 },
      { v: 'documentos', ms: 9500 },
      { v: 'ia',         ms: 10500 }
    ];
    var REANUDA_MS = 25000;
    var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var tour = { on: false, i: 0, t0: 0, dur: 1, timer: 0, raf: 0, vuelta: 0, visible: false, mano: false };
    var tourTxtEl = root.querySelector('[data-role="tour-txt"]');
    var tourBtnEl = root.querySelector('[data-role="tour"]');
    var tourBarEl = root.querySelector('[data-role="tour-bar"] i');


    /* ══════════════ LA MANO ══════════════
       Lleva el puntero hasta el ítem del menú que toca, lo pulsa y avisa.
       Si el ítem no está en pantalla —un menú desplazado, un ancho raro— no
       se inventa nada: se hace el cambio sin ceremonia. */
    var manoEl = root.querySelector('[data-role="mano"]');
    var manoT = [0, 0, 0];
    function manoLimpia() {
      for (var i = 0; i < manoT.length; i++) clearTimeout(manoT[i]);
      if (manoEl) manoEl.classList.remove('is-ahi', 'is-pulsa');
    }
    function llevaLaMano(vista, hecho) {
      var destino = sidebarEl.querySelector('[data-role="nav"][data-view="' + vista + '"]');
      if (!manoEl || !destino || reducido) { hecho(); return null; }
      var caja = destino.getBoundingClientRect(), marco = root.getBoundingClientRect();
      if (!caja.width || caja.bottom < marco.top || caja.top > marco.bottom) { hecho(); return null; }
      manoEl.style.transform = 'translate(' + (caja.left - marco.left + Math.min(26, caja.width * 0.5)) +
        'px,' + (caja.top - marco.top + caja.height * 0.5) + 'px)';
      manoEl.classList.add('is-ahi');
      /* 560 ms de viaje, la pulsación encima, y el cambio de pantalla 180 ms
         después: el orden importa, porque lo que convence es ver el efecto
         DESPUÉS de la causa. */
      manoT[0] = setTimeout(function () { manoEl.classList.add('is-pulsa'); }, 540);
      manoT[1] = setTimeout(function () { hecho(); }, 720);
      manoT[2] = setTimeout(function () { manoEl.classList.remove('is-pulsa'); }, 1020);
      return true;
    }

    function pintaTour() {
      root.classList.toggle('is-tour', tour.on);
      if (tourTxtEl) tourTxtEl.textContent = tour.on ? 'Guided tour' : 'You are driving';
      if (tourBtnEl) tourBtnEl.setAttribute('title', tour.on ? 'Stop the tour and navigate yourself' : 'Resume the guided tour');
      if (!tour.on && tourBarEl) tourBarEl.style.transform = 'scaleX(0)';
    }
    function pasoTour() {
      var paso = TOUR[tour.i % TOUR.length];
      tour.i++;
      /* La cuenta atrás del paso empieza CUANDO SE VE LA PANTALLA, no cuando
         arranca la mano: si no, el viaje se come un segundo de lectura. */
      llevaLaMano(paso.v, function () {
        if (!tour.on) return;
        state.route = paso.v; state.id = null;
        render();
        tour.t0 = Date.now(); tour.dur = paso.ms;
        clearTimeout(tour.timer);
        tour.timer = setTimeout(function () { if (tour.on) pasoTour(); }, paso.ms);
      });
    }
    function marcaBarra() {
      tour.raf = 0;
      if (!tour.on) return;
      if (tourBarEl) {
        var p = Math.min(1, (Date.now() - tour.t0) / (tour.dur || 1));
        tourBarEl.style.transform = 'scaleX(' + p.toFixed(3) + ')';
      }
      tour.raf = requestAnimationFrame(marcaBarra);
    }
    function arrancaTour(inmediato) {
      if (tour.on || reducido || useHash || !tour.visible || tour.mano) return;
      tour.on = true;
      pintaTour();
      if (!tour.raf) tour.raf = requestAnimationFrame(marcaBarra);
      if (inmediato) pasoTour();
      else { tour.t0 = Date.now(); tour.dur = 2600; clearTimeout(tour.timer); tour.timer = setTimeout(function () { if (tour.on) pasoTour(); }, 2600); }
    }
    function paraTour(porMano) {
      tour.on = false;
      manoLimpia();
      clearTimeout(tour.timer);
      if (tour.raf) { cancelAnimationFrame(tour.raf); tour.raf = 0; }
      if (porMano) {
        tour.mano = true;
        clearTimeout(tour.vuelta);
        tour.vuelta = setTimeout(function () { tour.mano = false; arrancaTour(true); }, REANUDA_MS);
      }
      pintaTour();
    }
    /* Cualquier gesto sobre la aplicación se la entrega al usuario. El
       movimiento del ratón entra con umbral: pasar por encima de camino a
       otra cosa no debería contar, pero moverse DENTRO sí. */
    var ratonX = -1, ratonY = -1;
    function manoEncima() { if (tour.on) paraTour(true); else if (tour.mano) { clearTimeout(tour.vuelta); tour.vuelta = setTimeout(function () { tour.mano = false; arrancaTour(true); }, REANUDA_MS); } }
    ['pointerdown', 'keydown', 'wheel', 'focusin', 'touchstart'].forEach(function (ev) {
      root.addEventListener(ev, manoEncima, { passive: true });
    });
    root.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      if (ratonX < 0) { ratonX = e.clientX; ratonY = e.clientY; return; }
      if (Math.abs(e.clientX - ratonX) + Math.abs(e.clientY - ratonY) > 24) { ratonX = e.clientX; ratonY = e.clientY; manoEncima(); }
    }, { passive: true });
    if (tourBtnEl) {
      tourBtnEl.addEventListener('click', function (e) {
        e.stopPropagation();
        if (tour.on) { paraTour(true); }
        else { tour.mano = false; clearTimeout(tour.vuelta); arrancaTour(true); }
      });
    }
    if (!useHash && !reducido && window.IntersectionObserver) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          tour.visible = e.isIntersecting && e.intersectionRatio > 0.3;
          if (tour.visible) arrancaTour(false);
          else paraTour(false);
        });
      }, { threshold: [0, 0.3, 0.6] }).observe(root);
    }
    if (useHash || reducido) { if (tourBtnEl) tourBtnEl.hidden = true; }
    pintaTour();

    render();
  }

  function init() {
    document.querySelectorAll('[data-fdemo-mount]').forEach(initInstance);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
