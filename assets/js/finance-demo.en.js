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
    { id: 'dashboard', label: 'Dashboard', grupo: 'dia', icono: 'dashboard' },
    { id: 'tesoreria', label: 'Treasury', grupo: 'dia', icono: 'dashboard' },
    { id: 'facturas', label: 'Invoices', grupo: 'dia', icono: 'facturas' },
    { id: 'cobros', label: 'Collections', grupo: 'dia', icono: 'cobros' },
    { id: 'por-facturar', label: 'Ready to invoice', grupo: 'dia', icono: 'facturas' },
    { id: 'gastos', label: 'Expenses', grupo: 'dia', icono: 'gastos' },
    { id: 'pagos', label: 'Payments', grupo: 'dia', icono: 'gastos' },
    { id: 'duplicados', label: 'Duplicates', grupo: 'dia', icono: 'gastos' },
    { id: 'documentos', label: 'Documents', grupo: 'dia', icono: 'documentos' },
    { id: 'presupuestos', label: 'Quotes', grupo: 'negocio', icono: 'presupuestos' },
    { id: 'pedidos', label: 'Orders', grupo: 'negocio', icono: 'pedidos' },
    { id: 'albaranes', label: 'Delivery notes', grupo: 'negocio', icono: 'albaranes' },
    { id: 'clientes', label: 'Clients', grupo: 'negocio', icono: 'clientes' },
    { id: 'proveedores', label: 'Suppliers', grupo: 'negocio', icono: 'proveedores' },
    { id: 'proyectos', label: 'Projects', grupo: 'negocio', icono: 'proyectos' },
    { id: 'radar', label: 'Radar', grupo: 'inteligencia', icono: 'dashboard' },
    { id: 'objetivos', label: 'Targets', grupo: 'inteligencia', icono: 'objetivos' },
    { id: 'historico', label: 'History', grupo: 'inteligencia', icono: 'dashboard' },
    { id: 'ia', label: 'Ask Finance', grupo: 'inteligencia', icono: 'ia' },
    { id: 'auditoria', label: 'Audit', grupo: 'administracion', icono: 'auditoria' },
    { id: 'verifactu', label: 'Tax register', grupo: 'administracion', icono: 'auditoria' },
    { id: 'usuarios', label: 'Users', grupo: 'administracion', icono: 'usuarios' },
    { id: 'impuestos', label: 'Taxes', grupo: 'administracion', icono: 'dashboard' },
    { id: 'gestoria', label: 'Your accountant', grupo: 'administracion', icono: 'facturas' },
    { id: 'configuracion', label: 'Settings', grupo: 'administracion', icono: 'configuracion' }
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
    pedidos: '<path d="M3.25 6.5h13.5l-1.1 8.25a1.5 1.5 0 0 1-1.5 1.3H5.85a1.5 1.5 0 0 1-1.5-1.3L3.25 6.5Z" stroke-linejoin="round"/><path d="M3.25 6.5 2.4 3.5H.9" stroke-linecap="round"/><circle cx="7" cy="19.5" r="1.4"/><circle cx="14" cy="19.5" r="1.4"/>',
    albaranes: '<path d="M5.75 2.75h9l4.5 4.5v13a.75.75 0 0 1-.75.75H5.75a.75.75 0 0 1-.75-.75V3.5a.75.75 0 0 1 .75-.75Z"/><path d="M14.5 3v4.25h4.5"/><path d="m8.5 13.5 2 2 4.5-4.5" stroke-linecap="round" stroke-linejoin="round"/>',
    proveedores: '<path d="M2.75 9.75 12 4.5l9.25 5.25" stroke-linejoin="round"/><path d="M4.75 11v8.5a.75.75 0 0 0 .75.75h13a.75.75 0 0 0 .75-.75V11"/><path d="M9.5 20.25V14h5v6.25"/>',
    auditoria: '<path d="M12 2.75 4.25 5.6v6.15c0 4.2 3.1 7.9 7.75 9.5 4.65-1.6 7.75-5.3 7.75-9.5V5.6L12 2.75Z" stroke-linejoin="round"/><path d="m9 11.75 2.1 2.1L15 10" stroke-linecap="round" stroke-linejoin="round"/>',
    usuarios: '<circle cx="12" cy="7.5" r="3.5"/><path d="M4.75 20.5a7.25 7.25 0 0 1 14.5 0"/>',
    objetivos: '<circle cx="12" cy="12" r="8.25"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.75"/>',
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
      '<span class="fdemo-mano" data-role="mano" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 3.2 18.4 11.6a.55.55 0 0 1-.22 1L12.9 13.5l2.6 5.4a.55.55 0 0 1-.27.74l-1.9.9a.55.55 0 0 1-.73-.27l-2.55-5.35-3.7 3.5a.55.55 0 0 1-.93-.4V3.66a.55.55 0 0 1 .86-.46Z"/></svg>' +
      '<i></i></span>';

    var sidebarEl = root.querySelector('[data-role="sidebar"]');
    var overlayEl = root.querySelector('[data-role="overlay"]');
    var mainEl = root.querySelector('[data-role="main"]');
    var contentEl = root.querySelector('[data-role="content"]');
    var menuBtn = root.querySelector('[data-role="menu-btn"]');

    var state = { doc: { fase: 'inicio', archivo: null, t: 0 }, gastoNuevo: null, route: 'dashboard', id: null, facturaFiltro: { q: '', estado: '' }, clienteFiltro: { q: '' }, ia: { mensajes: [], enviando: false },
      /* El lector de documentos, el cajón que lo abre, el muro de planes y
         las facturas que entran desde una remesa. */
      docCajon: false, lector: null, lectorT: 0, muro: null, facturasNuevas: null };

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
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="fdemo-nav-icon" aria-hidden="true">' + (NAV_ICONS[v.icono] || NAV_ICONS[v.id] || '') + '</svg>' +
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
    var PRIO = { P0: 'Urgent', P1: 'Important', P2: 'Check', P3: 'Pending' };
    /* ══════════════════ EL PANEL ══════════════════ */

    // El encabezado de sección: rayita, rótulo en versalitas y la pregunta
    // que esa sección contesta. La pregunta es la mitad del invento: dice
    // para qué sirve mirar lo de abajo.
    function seccion(titulo, pregunta, cuerpo, orden) {
      return '<section class="fdemo-sec" style="--o:' + (orden || 0) + '">' +
        '<div class="fdemo-sec-h"><span class="fdemo-sec-r" aria-hidden="true"></span>' +
        '<h2 class="fdemo-sec-t">' + esc(titulo) + '</h2>' +
        (pregunta ? '<p class="fdemo-sec-q">— ' + esc(pregunta) + '</p>' : '') +
        '</div>' + cuerpo + '</section>';
    }

    // La chispa: 26 px de alto, sin ejes, sin rejilla y sin leyenda. Hereda
    // el color de la cifra. No es un gráfico: es la forma de la serie.
    function chispa(serie) {
      if (!serie || serie.length < 2) return '';
      var min = Math.min.apply(null, serie), max = Math.max.apply(null, serie);
      var rango = (max - min) || 1, W = 100, H = 26;
      var d = serie.map(function (v, i) {
        var x = (i / (serie.length - 1)) * W;
        var y = H - 2 - ((v - min) / rango) * (H - 4);
        return (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1);
      }).join(' ');
      var ux = W, uy = H - 2 - ((serie[serie.length - 1] - min) / rango) * (H - 4);
      return '<svg class="fdemo-chispa" viewBox="0 0 ' + W + ' ' + H + '" height="' + H + '" ' +
        'preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
        '<path d="' + d + '" fill="none" stroke="currentColor" stroke-width="1.5" ' +
        'stroke-linejoin="round" stroke-linecap="round" opacity="0.75" vector-effect="non-scaling-stroke"/>' +
        '<circle cx="' + ux + '" cy="' + uy.toFixed(1) + '" r="2" fill="currentColor" vector-effect="non-scaling-stroke"/>' +
        '</svg>';
    }

    // La tarjeta de cifra. El estado NO cambia el borde: lo llevan el filete
    // de la izquierda, un tinte de fondo muy tenue y el color del número. Un
    // borde de color en cada tarjeta convierte la pantalla en un semáforo.
    function kpi2(o) {
      var hero = !!o.hero, tono = o.tono || 'neutro';
      var val = String(o.valor);
      return '<' + (o.vista ? 'a href="#' + o.vista + '"' : 'div') +
        ' class="fdemo-kpi2 t-' + tono + (hero ? ' es-hero' : '') + (o.vista ? ' es-link' : '') + '"' +
        ' style="--n:' + Math.max(val.length, 1) + '">' +
        '<span class="fdemo-kpi2-filo" aria-hidden="true"></span>' +
        '<p class="fdemo-kpi2-l">' + esc(o.label) + '</p>' +
        '<p class="fdemo-kpi2-v">' + esc(val) + '</p>' +
        (o.delta ? '<p class="fdemo-kpi2-d"><span class="' + (o.delta.bueno ? 'es-bien' : o.delta.bueno === false ? 'es-mal' : '') + '">' +
          (o.delta.sube ? '\u2191' : o.delta.sube === false ? '\u2193' : '\u2013') + '</span> ' + esc(o.delta.texto) + '</p>' : '') +
        (o.serie ? chispa(o.serie) : '') +
        (o.hint ? '<p class="fdemo-kpi2-h">' + esc(o.hint) + '</p>' : '') +
        '</' + (o.vista ? 'a' : 'div') + '>';
    }

    RENDERERS.dashboard = function () {
      var s = FS.getDashboardSnapshot(), ev = FS.getEvolucion();
      var r = FS.getResumenEjecutivo(), prev = FS.getPrevision();
      var ant = FS.getAntiguedad(), con = FS.getConcentracion();
      var cobrados = ev.map(function (m) { return m.cobrado; });
      var resultados = ev.map(function (m) { return m.resultado; });
      var dif = s.resultadoMes - s.resultadoMesPrevio;

      // ── la frase de arriba ──
      var narrativa =
        '<div class="fdemo-narra n-' + r.principal.nivel + '">' +
        '<span class="fdemo-narra-filo" aria-hidden="true"></span>' +
        '<p class="fdemo-narra-p">' + esc(r.principal.texto) + '</p>' +
        (r.frases.length ? '<ul class="fdemo-narra-l">' + r.frases.map(function (f) {
          return '<li class="n-' + f.nivel + '"><span class="fdemo-narra-pt" aria-hidden="true"></span>' +
                 '<a href="#' + f.vista + '">' + esc(f.texto) + '</a></li>';
        }).join('') + '</ul>' : '') +
        '</div>';

      // ── el dinero ──
      var dinero =
        '<div class="fdemo-kpi-hero">' +
        kpi2({ hero: 1, tono: 'positivo', label: 'Collected', valor: EUR(s.totalCobrado),
              hint: 'money already in · all time', serie: cobrados, vista: 'cobros' }) +
        kpi2({ hero: 1, tono: s.totalPendiente > 0 ? 'aviso' : 'neutro', label: 'Outstanding',
              valor: EUR(s.totalPendiente),
              hint: s.dso === null ? 'issued and still unpaid' : 'issued and unpaid · {d} days median to collect'.replace('{d}', s.dso), vista: 'cobros' }) +
        kpi2({ hero: 1, tono: s.totalVencido > 0 ? 'critico' : 'neutro', label: 'Overdue',
              valor: EUR(s.totalVencido),
              delta: s.totalPendiente > 0 ? { sube: true, bueno: s.totalVencido === 0,
                texto: Math.round((s.totalVencido / s.totalPendiente) * 1000) / 10 + ' % of what is outstanding' } : null,
              hint: s.totalVencido > 0 ? 'past its date · chase it' : 'nothing past its date', vista: 'cobros' }) +
        '</div>' +
        '<div class="fdemo-kpi-tira">' +
        kpi2({ tono: s.resultadoMes >= 0 ? 'positivo' : 'critico', label: 'Result this month',
              valor: EUR(s.resultadoMes), serie: resultados,
              delta: { sube: dif > 0 ? true : dif < 0 ? false : null, bueno: dif >= 0,
                       texto: EUR(Math.abs(dif)) + ' vs last month' },
              hint: 'invoiced minus spent, this month' }) +
        (s.sinFacturar > 0 ? kpi2({ tono: 'aviso', label: 'Not invoiced yet', valor: EUR(s.sinFacturar),
              hint: 'accepted and still without an invoice', vista: 'presupuestos' }) : '') +
        kpi2({ label: 'Invoiced', valor: EUR(s.totalFacturado), hint: 'all time', vista: 'facturas' }) +
        kpi2({ label: 'Expenses', valor: EUR(s.totalGastos), hint: 'all time', vista: 'gastos' }) +
        kpi2({ label: 'Invoiced − Expenses', valor: EUR(s.margen), hint: 'not profit · {p} still unpaid'.replace('{p}', EUR(s.totalPendiente)) }) +
        kpi2({ label: 'Due in 30 days', valor: EUR(s.venceEn30), hint: 'not counting what is already overdue' }) +
        kpi2({ label: 'Active projects', valor: String(s.proyectosActivos), hint: 'running right now', vista: 'proyectos' }) +
        '</div>';

      // ── la caja ──
      var caja = card(
        cardHead('Cash forecast · 30 days', 'change in cash: the bank balance is not in the system'),
        '<div class="fdemo-card-body is-tight"><div class="fdemo-kpi-tira es-3">' +
        kpi2({ tono: 'positivo', label: 'Coming in', valor: EUR(prev.entra), hint: 'invoices due over the next 30 days' }) +
        kpi2({ tono: 'aviso', label: 'Going out', valor: EUR(prev.sale), hint: 'expenses due over the next 30 days' }) +
        kpi2({ tono: prev.neto >= 0 ? 'positivo' : 'critico', label: 'Net', valor: EUR(prev.neto),
              hint: prev.neto >= 0 ? 'more comes in than goes out' : 'more goes out than comes in' }) +
        '</div></div>');

      // ── qué mirar hoy ──
      var senales = FS.getSenales();
      var hoy = senales.length
        ? '<div class="fdemo-senales">' + senales.map(function (x) {
            return '<article class="fdemo-senal p-' + x.p + '">' +
              '<span class="fdemo-senal-filo" aria-hidden="true"></span>' +
              '<div class="fdemo-senal-c"><p class="fdemo-senal-et">' + PRIO[x.p] + '</p>' +
              '<p class="fdemo-senal-t">' + esc(x.titulo) + '</p>' +
              '<p class="fdemo-senal-p">' + esc(x.porque) + '</p></div>' +
              '<p class="fdemo-senal-n">' + esc(x.cifra) + '</p></article>';
          }).join('') + '</div>'
        : '<div class="fdemo-senal-ok"><span class="fdemo-senal-ok-filo"></span>Nothing urgent today.</div>';

      // ── cómo va el negocio ──
      var maxEv = Math.max.apply(null, ev.map(function (m) { return Math.max(m.cobrado, m.gastos); })) || 1;
      var barras = '<div class="fdemo-barras" role="img" aria-label="Collections and expenses over the last twelve months">' +
        ev.map(function (m) {
          return '<div class="fdemo-barra-col"><div class="fdemo-barra-par">' +
            '<i class="b-cob" style="height:' + ((m.cobrado / maxEv) * 100).toFixed(1) + '%" title="' + esc(m.etiqueta + ': ' + EUR(m.cobrado)) + '"></i>' +
            '<i class="b-gas" style="height:' + ((m.gastos / maxEv) * 100).toFixed(1) + '%" title="' + esc(m.etiqueta + ': ' + EUR(m.gastos)) + '"></i>' +
            '</div><span class="fdemo-barra-et">' + esc(m.etiqueta) + '</span></div>';
        }).join('') + '</div>' +
        '<div class="fdemo-leyenda"><span><i class="b-cob"></i>Collected</span><span><i class="b-gas"></i>Expenses</span></div>';

      var deuda = card(cardHead('Debt by age', 'How much you are owed and for how long'),
        '<div class="fdemo-card-body"><p class="fdemo-total">' + EUR(ant.total) + '</p>' +
        '<div class="fdemo-apilada">' + ant.tramos.map(function (t) {
          return '<i class="n-' + t.nivel + '" style="width:' + t.pct + '%" title="' + esc(t.etiqueta) + '"></i>';
        }).join('') + '</div>' +
        '<ul class="fdemo-ley-v">' + ant.tramos.map(function (t) {
          return '<li><span class="pt n-' + t.nivel + '"></span><span class="et">' + esc(t.etiqueta) + '</span>' +
                 '<span class="nu">' + EUR(t.total) + '</span></li>';
        }).join('') + '</ul></div>');

      var conc = card(cardHead('Who your invoicing depends on', 'Share of total invoiced by client'),
        '<div class="fdemo-card-body"><ul class="fdemo-conc">' + con.filas.map(function (f) {
          return '<li><span class="nom">' + esc(f.cliente) + '</span>' +
            '<span class="ba"><i style="width:' + f.pct + '%"></i></span>' +
            '<span class="pc">' + f.pct + ' %</span></li>';
        }).join('') + '</ul>' +
        (con.riesgo ? '<p class="fdemo-nota-riesgo">{c} accounts for {p} % of your invoicing. If they leave, that part of the business leaves.</p>'.replace('{c}', esc(con.riesgo.cliente)).replace('{p}', con.riesgo.pct) : '') +
        '</div>');

      // ── registro ──
      var act = FS.getActividad(8);
      var actividad = card(cardHead('Recent activity', 'Most recent invoices, expenses and payments'),
        '<div>' + act.map(function (a) {
          return '<a class="fdemo-activity-row" href="#' + a.vista + '/' + a.id + '">' +
            '<div class="fdemo-activity-main"><div class="fdemo-activity-text">' + esc(a.texto) + ' · ' + EUR(a.importe) + '</div>' +
            '<div class="fdemo-activity-meta">' + esc(a.tipo) + ' · ' + FDATE(a.fecha) + '</div></div>' +
            pill(a.estado) + '</a>';
        }).join('') + '</div>');

      return '<div class="fdemo-panel">' +
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Situation</p>' +
        '<h1 class="fdemo-page-title">Financial dashboard</h1></div>' +
        '<p class="fdemo-calc">calculated now · ' + FDATE(s.fechaCalculo) + '</p></div>' +
        narrativa +
        seccion('The money', 'what came in, what you are owed and what is past its date', dinero, 0) +
        seccion('Cash', 'what comes in and what goes out over the next 30 days', caja, 1) +
        seccion('What to look at today', 'what needs a decision, most urgent first', hoy, 2) +
        seccion('How the business is doing', 'trend, who you depend on and what you are owed',
          card(cardHead('Monthly evolution', 'Money collected against money spent, month by month'), '<div class="fdemo-card-body">' + barras + '</div>') +
          '<div class="fdemo-dos">' + deuda + conc + '</div>', 3) +
        seccion('Log', 'the latest thing that happened', actividad, 4) +
        '</div>';
    };


    /* ══════════════ EL RESTO DEL SISTEMA ══════════════ */

    function tablaSimple(cabeceras, filas, vacio) {
      if (!filas) return empty(vacio);
      return '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr>' +
        cabeceras.map(function (c) {
          return '<th' + (c.r ? ' class="is-right"' : '') + '>' + esc(c.t) + '</th>';
        }).join('') + '</tr></thead><tbody>' + filas + '</tbody></table></div>';
    }
    function aviso(texto) {
      return '<p class="fdemo-aviso-modulo">' + esc(texto) + '</p>';
    }

    /* TESORERÍA. Tres horizontes y dos escenarios. El prudente descuenta lo
       que ya está fuera de plazo, porque contar con ello es lo que hace que
       una previsión de caja se convierta en un susto. */
    RENDERERS.tesoreria = function () {
      var prev = FS.getPrevision(), s = FS.getDashboardSnapshot();
      var fac = FS.listFacturas().filter(function (f) { return f.estado !== 'Borrador' && FS.pendienteDe(f) > 0; });
      var gas = FS.listGastos().filter(function (g) { return !g.pagado; });
      function enPlazo(lista, dias, campo, valor) {
        var t = 0;
        lista.forEach(function (x) {
          var f = x[campo]; if (!f) return;
          var d = Math.round((Date.parse(f) - Date.parse(FS.hoy)) / 86400000);
          if (d >= -30 && d <= dias) t += valor(x);
        });
        return Math.round(t * 100) / 100;
      }
      var horizontes = [30, 60, 90].map(function (d) {
        var e = enPlazo(fac, d, 'fechaVencimiento', FS.pendienteDe);
        var sa = enPlazo(gas, d, 'fechaVencimiento', function (g) { return g.importe; });
        var prud = Math.round((e - s.totalVencido) * 100) / 100;
        return { d: d, entra: e, sale: sa, neto: Math.round((e - sa) * 100) / 100,
                 prudente: Math.round((prud - sa) * 100) / 100 };
      });
      return '<div class="fdemo-panel">' +
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Cash</p>' +
        '<h1 class="fdemo-page-title">Treasury</h1></div></div>' +
        aviso('This is the CHANGE in cash, not a balance: the bank balance is not in the system and is not invented. What you see is what comes in and goes out according to the dates on your own documents.') +
        '<div class="fdemo-dos-3">' + horizontes.map(function (h) {
          return card(cardHead('Next {d} days'.replace('{d}', h.d), 'by due date'),
            '<div class="fdemo-card-body"><div class="fdemo-kpi-tira es-3">' +
            kpi2({ tono: 'positivo', label: 'In', valor: EUR(h.entra) }) +
            kpi2({ tono: 'aviso', label: 'Out', valor: EUR(h.sale) }) +
            kpi2({ tono: h.neto >= 0 ? 'positivo' : 'critico', label: 'Net', valor: EUR(h.neto) }) +
            '</div><p class="fdemo-esc">Cautious scenario, discounting what is already overdue: <b>' + EUR(h.prudente) + '</b></p></div>');
        }).join('') + '</div></div>';
    };

    /* POR FACTURAR. Presupuesto aceptado sin factura emitida: trabajo hecho
       que todavía no se ha pedido cobrar. */
    RENDERERS['por-facturar'] = function () {
      var pend = FS.listPresupuestos().filter(function (p) { return p.estado === 'Aceptada' && !p.facturaId; });
      var total = pend.reduce(function (a, p) { return a + p.importe; }, 0);
      var filas = pend.map(function (p) {
        return '<tr><td>' + esc(p.empresa) + '</td><td class="is-muted">' + esc(p.servicios || '—') + '</td>' +
          '<td class="is-muted">' + FDATE(p.fechaGeneracion) + '</td>' +
          '<td class="is-right">' + EUR(p.importe) + '</td>' +
          '<td>' + pill('Aceptada') + '</td></tr>';
      }).join('');
      return '<div class="fdemo-panel">' +
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Money not yet asked for</p>' +
        '<h1 class="fdemo-page-title">Ready to invoice</h1>' +
        '<p class="fdemo-page-sub">{n} accepted jobs with no invoice issued · {t}'.replace('{n}', pend.length).replace('{t}', EUR(total)) + '</p></div></div>' +
        card('', tablaSimple([{t:'Client'},{t:'Work'},{t:'Accepted'},{t:'Amount',r:1},{t:'Status'}], filas, 'Everything accepted has been invoiced.')) +
        '</div>';
    };

    /* PAGOS. Lo que hay que pagar y cuándo. */
    RENDERERS.pagos = function () {
      var gas = FS.listGastos().slice().sort(function (a, b) {
        return (a.fechaVencimiento || '') < (b.fechaVencimiento || '') ? -1 : 1;
      });
      var pendientes = gas.filter(function (g) { return !g.pagado; });
      var filas = gas.slice(0, 40).map(function (g) {
        return '<tr><td>' + esc(g.proveedor) + '</td><td class="is-muted">' + esc(g.concepto) + '</td>' +
          '<td class="is-muted">' + FDATE(g.fechaVencimiento) + '</td>' +
          '<td class="is-right">' + EUR(g.importe) + '</td>' +
          '<td>' + pill(g.pagado ? 'Pagado' : 'Pendiente') + '</td></tr>';
      }).join('');
      return '<div class="fdemo-panel">' +
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Accounts payable</p>' +
        '<h1 class="fdemo-page-title">Payments</h1>' +
        '<p class="fdemo-page-sub">{n} outstanding · {t}'.replace('{n}', pendientes.length).replace('{t}', EUR(pendientes.reduce(function (a, g) { return a + g.importe; }, 0))) + '</p></div></div>' +
        card('', tablaSimple([{t:'Supplier'},{t:'Description'},{t:'Due'},{t:'Amount',r:1},{t:'Status'}], filas, '')) +
        '</div>';
    };

    /* DUPLICADOS. Mismo proveedor, mismo importe, pocos días de diferencia.
       La regla está escrita aquí y se puede discutir; una puntuación no. */
    RENDERERS.duplicados = function () {
      var gas = FS.listGastos(), pares = [];
      for (var i = 0; i < gas.length; i++) {
        for (var j = i + 1; j < gas.length; j++) {
          if (gas[i].proveedor !== gas[j].proveedor) continue;
          if (Math.abs(gas[i].importe - gas[j].importe) > 0.01) continue;
          var d = Math.abs(Math.round((Date.parse(gas[i].fechaGasto) - Date.parse(gas[j].fechaGasto)) / 86400000));
          if (d <= 10) pares.push({ a: gas[i], b: gas[j], d: d });
        }
      }
      var filas = pares.map(function (p) {
        return '<tr><td>' + esc(p.a.proveedor) + '</td>' +
          '<td class="is-muted">' + esc(p.a.concepto) + '</td>' +
          '<td class="is-muted">' + FDATE(p.a.fechaGasto) + ' · ' + FDATE(p.b.fechaGasto) + '</td>' +
          '<td class="is-right">' + EUR(p.a.importe) + '</td>' +
          '<td>' + pill(p.d <= 3 ? 'Probable' : 'Posible') + '</td></tr>';
      }).join('');
      return '<div class="fdemo-panel">' +
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Control</p>' +
        '<h1 class="fdemo-page-title">Duplicates</h1></div></div>' +
        aviso('The rule is written down: same supplier, same amount to the cent, fewer than ten days apart. No score, no model, no black box: if it fires, you can read why.') +
        card('', tablaSimple([{t:'Supplier'},{t:'Description'},{t:'Dates'},{t:'Amount',r:1},{t:'Status'}], filas, 'No expense matches the rule.')) +
        '</div>';
    };

    /* RADAR. Tres reglas, las tres con su umbral escrito al lado. */
    RENDERERS.radar = function () {
      var gas = FS.listGastos(), s = FS.getDashboardSnapshot(), con = FS.getConcentracion();
      var avisos = [];
      var porProv = {};
      gas.forEach(function (g) { (porProv[g.proveedor] = porProv[g.proveedor] || []).push(g); });
      Object.keys(porProv).forEach(function (k) {
        var l = porProv[k].slice().sort(function (a, b) { return a.fechaGasto < b.fechaGasto ? -1 : 1; });
        if (l.length < 2) return;
        var ult = l[l.length - 1], pen = l[l.length - 2];
        if (pen.importe > 0 && ult.importe / pen.importe >= 1.15) {
          avisos.push({ n: 'aviso', regla: 'Price rise',
            t: '{p} has gone up {x} % on the previous expense'.replace('{p}', k).replace('{x}', Math.round((ult.importe / pen.importe - 1) * 100)),
            d: EUR(pen.importe) + ' → ' + EUR(ult.importe) });
        }
      });
      if (con.riesgo) avisos.push({ n: 'serio', regla: 'Concentration',
        t: '{c} accounts for {p} % of invoicing'.replace('{c}', con.riesgo.cliente).replace('{p}', con.riesgo.pct), d: con.riesgo.pct + ' %' });
      if (s.totalVencido > 0) avisos.push({ n: 'critico', regla: 'Overdue',
        t: '{n} invoices past their date and unpaid'.replace('{n}', s.nVencidas), d: EUR(s.totalVencido) });
      var filas = avisos.map(function (a) {
        return '<article class="fdemo-senal p-' + (a.n === 'critico' ? 'P0' : a.n === 'serio' ? 'P1' : 'P2') + '">' +
          '<span class="fdemo-senal-filo"></span><div class="fdemo-senal-c">' +
          '<p class="fdemo-senal-et">' + esc(a.regla) + '</p>' +
          '<p class="fdemo-senal-t">' + esc(a.t) + '</p></div>' +
          '<p class="fdemo-senal-n">' + esc(a.d) + '</p></article>';
      }).join('');
      return '<div class="fdemo-panel">' +
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Intelligence</p>' +
        '<h1 class="fdemo-page-title">Radar</h1></div></div>' +
        aviso('Three rules, each with its threshold written next to it. You can argue with them, which is more than you can do with a score.') +
        '<div class="fdemo-senales">' + (filas || '<div class="fdemo-senal-ok"><span class="fdemo-senal-ok-filo"></span>No rule has fired.</div>') + '</div>' +
        '</div>';
    };

    /* OBJETIVOS. Una métrica, un periodo y un mínimo. Y si vas a tiempo. */
    RENDERERS.objetivos = function () {
      var ev = FS.getEvolucion(), s = FS.getDashboardSnapshot();
      var mes = ev[ev.length - 1];
      var metas = [
        { m: 'Collect every month', actual: mes.cobrado, meta: 15000, u: 'eur' },
        { m: 'Overdue below', actual: s.totalVencido, meta: 6000, u: 'eur', menos: true },
        { m: 'Days to get paid', actual: s.dso || 0, meta: 30, u: 'dias', menos: true }
      ];
      return '<div class="fdemo-panel">' +
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Intelligence</p>' +
        '<h1 class="fdemo-page-title">Targets</h1></div></div>' +
        '<div class="fdemo-dos-3">' + metas.map(function (g) {
          var pct = g.menos ? Math.min(100, Math.round((g.meta / Math.max(g.actual, 0.01)) * 100))
                            : Math.min(100, Math.round((g.actual / g.meta) * 100));
          var bien = g.menos ? g.actual <= g.meta : g.actual >= g.meta;
          var v = g.u === 'eur' ? EUR(g.actual) : g.actual + ' days';
          var mv = g.u === 'eur' ? EUR(g.meta) : g.meta + ' days';
          return card(cardHead(g.m, (g.menos ? 'Target: stay under {m}' : 'Target: at least {m}').replace('{m}', mv)),
            '<div class="fdemo-card-body">' +
            '<p class="fdemo-total ' + (bien ? 'es-bien' : 'es-mal') + '">' + v + '</p>' +
            '<div class="fdemo-apilada"><i class="' + (bien ? 'n-ok' : 'n-critico') + '" style="width:' + pct + '%"></i></div>' +
            '<p class="fdemo-kpi2-h">' + (bien ? 'On track.' : 'Not met today.') + '</p></div>');
        }).join('') + '</div></div>';
    };

    /* REGISTRO FISCAL. La cadena, eslabón a eslabón: cada factura lleva la
       huella de la anterior, y por eso se puede enseñar que no falta ninguna. */
    RENDERERS.verifactu = function () {
      var fac = FS.listFacturas().filter(function (f) { return f.estado !== 'Borrador'; })
        .slice().sort(function (a, b) { return a.fechaEmision < b.fechaEmision ? -1 : 1; });
      var filas = fac.slice(-14).map(function (f, i) {
        var h = huella(f.numero + f.importe);
        return '<tr><td><code>' + esc(f.numero) + '</code></td>' +
          '<td class="is-muted">' + FDATE(f.fechaEmision) + '</td>' +
          '<td class="is-right">' + EUR(f.importe) + '</td>' +
          '<td class="is-muted"><code>' + h + '</code></td>' +
          '<td>' + pill('Registrada') + '</td></tr>';
      }).join('');
      return '<div class="fdemo-panel">' +
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Tax obligation</p>' +
        '<h1 class="fdemo-page-title">Tax register · VERI*FACTU</h1></div></div>' +
        '<div class="fdemo-kpi-tira es-3">' +
        kpi2({ tono: 'positivo', label: 'The chain', valor: 'Intact', hint: '{n} invoices chained'.replace('{n}', fac.length) }) +
        kpi2({ label: 'Outside the chain', valor: '0', hint: 'no unregistered invoice' }) +
        kpi2({ tono: 'positivo', label: 'Queued for filing', valor: '0', hint: 'nothing waiting to be sent' }) +
        '</div>' +
        aviso('Every invoice carries the fingerprint of the previous one. That is how you answer «show me you registered them all» without opening the database.') +
        card(cardHead('Latest links', 'the fourteen most recent'), tablaSimple([{t:'No.'},{t:'Issued'},{t:'Amount',r:1},{t:'Fingerprint'},{t:'Status'}], filas, '')) +
        '</div>';
    };
    // Huella corta y determinista: aquí solo tiene que PARECER lo que es
    // -un resumen que encadena una factura con la anterior- y serlo de
    // verdad exigiría el algoritmo fiscal entero en el navegador.
    function huella(s) {
      var h = 0;
      for (var i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; }
      return (h >>> 0).toString(16).toUpperCase().padStart(8, '0').slice(0, 8);
    }

    RENDERERS.proveedores = function () {
      var gas = FS.listGastos();
      var filas = FS.listProveedores().map(function (p) {
        var g = gas.filter(function (x) { return x.proveedor === p.nombre; });
        var t = g.reduce(function (a, x) { return a + x.importe; }, 0);
        return '<tr><td>' + esc(p.nombre) + '</td><td class="is-muted">' + esc(p.categoria || '—') + '</td>' +
          '<td class="is-muted">' + esc(p.nif) + '</td>' +
          '<td class="is-right">' + g.length + '</td><td class="is-right">' + EUR(t) + '</td></tr>';
      }).join('');
      return '<div class="fdemo-panel"><div class="fdemo-panel-h"><div>' +
        '<p class="fdemo-eyebrow">Business</p><h1 class="fdemo-page-title">Suppliers</h1></div></div>' +
        card('', tablaSimple([{t:'Supplier'},{t:'Category'},{t:'NIF'},{t:'Expenses',r:1},{t:'Total',r:1}], filas, '')) +
        '</div>';
    };

    RENDERERS.historico = function () {
      var ev = FS.getEvolucion();
      var filas = ev.slice().reverse().map(function (m) {
        return '<tr><td>' + esc(m.etiqueta) + '</td>' +
          '<td class="is-right">' + EUR(m.facturado) + '</td>' +
          '<td class="is-right">' + EUR(m.cobrado) + '</td>' +
          '<td class="is-right">' + EUR(m.gastos) + '</td>' +
          '<td class="is-right">' + EUR(m.resultado) + '</td></tr>';
      }).join('');
      return '<div class="fdemo-panel"><div class="fdemo-panel-h"><div>' +
        '<p class="fdemo-eyebrow">Intelligence</p><h1 class="fdemo-page-title">History</h1></div></div>' +
        card('', tablaSimple([{t:'Month'},{t:'Invoiced',r:1},{t:'Collected',r:1},{t:'Expenses',r:1},{t:'Result',r:1}], filas, '')) +
        '</div>';
    };

    RENDERERS.impuestos = function () {
      var ev = FS.getEvolucion().slice(-3);
      var fac = FS.listFacturas().filter(function (f) { return f.estado !== 'Borrador'; });
      var gas = FS.listGastos();
      var ivaRep = fac.reduce(function (a, f) { return a + (f.iva || 0); }, 0);
      var ivaSop = gas.reduce(function (a, g) { return a + (g.iva || 0); }, 0);
      return '<div class="fdemo-panel"><div class="fdemo-panel-h"><div>' +
        '<p class="fdemo-eyebrow">Administration</p><h1 class="fdemo-page-title">Taxes</h1></div></div>' +
        '<div class="fdemo-kpi-tira es-3">' +
        kpi2({ label: 'VAT charged', valor: EUR(ivaRep), hint: 'what you charged on your invoices' }) +
        kpi2({ label: 'VAT paid', valor: EUR(ivaSop), hint: 'what you paid on your expenses' }) +
        kpi2({ tono: ivaRep - ivaSop >= 0 ? 'aviso' : 'positivo', label: 'Difference',
               valor: EUR(ivaRep - ivaSop), hint: 'what would come out to pay or offset' }) +
        '</div>' + aviso('A calculation, not a filing: your accountant files, and that is what the CSV books on the next screen are for.') + '</div>';
    };

    RENDERERS.gestoria = function () {
      return '<div class="fdemo-panel"><div class="fdemo-panel-h"><div>' +
        '<p class="fdemo-eyebrow">Administration</p><h1 class="fdemo-page-title">Your accountant</h1></div></div>' +
        card(cardHead('VAT books', 'As CSV, ready to send'),
          '<div class="fdemo-card-body"><div class="fdemo-descargas">' +
          ['Issued', 'Received', 'Quarter summary'].map(function (x) {
            return '<button type="button" class="fdemo-btn variant-secondary" data-action="plan" data-plan="csv">' +
              '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7">' +
              '<path d="M12 3.5v11m0 0 4-4m-4 4-4-4" stroke-linecap="round" stroke-linejoin="round"/>' +
              '<path d="M4.5 17.5v2a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-2" stroke-linecap="round"/></svg>' +
              esc(x) + '</button>';
          }).join('') + '</div>' + aviso('They export as they are, closing nothing. If a tax field is missing on an invoice, it comes out flagged instead of filled in for you.') + '</div>') +
        '</div>';
    };

    RENDERERS.auditoria = function () {
      var act = FS.getActividad(25);
      var filas = act.map(function (a) {
        return '<tr><td class="is-muted">' + FDATE(a.fecha) + '</td>' +
          '<td>' + esc(a.tipo) + '</td><td class="is-muted">' + esc(a.texto) + '</td>' +
          '<td class="is-right">' + EUR(a.importe) + '</td>' +
          '<td class="is-muted">Demo account</td></tr>';
      }).join('');
      return '<div class="fdemo-panel"><div class="fdemo-panel-h"><div>' +
        '<p class="fdemo-eyebrow">Administration</p><h1 class="fdemo-page-title">Audit</h1></div></div>' +
        aviso('Who did what, when and on which record. It cannot be deleted from the application.') +
        card('', tablaSimple([{t:'Date'},{t:'Type'},{t:'Record'},{t:'Amount',r:1},{t:'Who'}], filas, '')) +
        '</div>';
    };

    RENDERERS.usuarios = function () {
      var roles = [
        ['Owner', 'Everything, including inviting and removing people'], ['Administrador', 'Everything except ownership of the account'], ['Dirección', 'See everything and decide; does not touch tax settings'],
        ['Finanzas', 'Invoice, collect, spend and close'], ['Operaciones', 'See and create documents; does not see margins'], ['Solo lectura', 'Look. That is all.']
      ];
      var filas = roles.map(function (r) {
        return '<tr><td>' + esc(r[0]) + '</td><td class="is-muted">' + esc(r[1]) + '</td>' +
          '<td>' + pill(r[0] === 'Owner' ? 'Activo' : 'Disponible') + '</td></tr>';
      }).join('');
      return '<div class="fdemo-panel"><div class="fdemo-panel-h"><div>' +
        '<p class="fdemo-eyebrow">Administration</p><h1 class="fdemo-page-title">Users</h1></div></div>' +
        aviso('Permission is checked per module AND per action, in the same layer that reads the database. A role cannot see what is not theirs even if a screen gets it wrong.') +
        card('', tablaSimple([{t:'Role'},{t:'What they can do'},{t:'In use'}], filas, '')) +
        '</div>';
    };

    // Pedidos y albaranes salen de los presupuestos aceptados: en el producto
    // son documentos propios; aquí se enseña su forma y su encadenamiento.
    function documentalSimple(titulo, eyebrow, prefijo, estadoOk) {
      var pres = FS.listPresupuestos().filter(function (p) { return p.aceptadaPorCliente; });
      var filas = pres.map(function (p, i) {
        return '<tr><td><code>' + prefijo + '-' + String(1000 + i * 7) + '</code></td>' +
          '<td>' + esc(p.empresa) + '</td><td class="is-muted">' + esc(p.servicios || '—') + '</td>' +
          '<td class="is-muted">' + FDATE(p.fechaGeneracion) + '</td>' +
          '<td class="is-right">' + EUR(p.importe) + '</td>' +
          '<td>' + pill(p.facturaId ? estadoOk : 'Pendiente') + '</td></tr>';
      }).join('');
      return '<div class="fdemo-panel"><div class="fdemo-panel-h"><div>' +
        '<p class="fdemo-eyebrow">' + esc(eyebrow) + '</p><h1 class="fdemo-page-title">' + esc(titulo) + '</h1></div></div>' +
        card('', tablaSimple([{t:'No.'},{t:'Client'},{t:'Work'},{t:'Date'},{t:'Amount',r:1},{t:'Status'}], filas, '')) +
        '</div>';
    }
    RENDERERS.pedidos = function () { return documentalSimple('Orders', 'Business', 'P', 'Cobrado'); };
    RENDERERS.albaranes = function () { return documentalSimple('Delivery notes', 'Business', 'A', 'Cobrado'); };

    RENDERERS.facturas = function (id) {
      if (id) return facturaDetalle(id);
      /* Las que acaban de entrar desde una remesa van las primeras y
         marcadas: sin eso, «dar de alta» es un botón del que no se sabe
         si ha hecho algo. */
      var all = (state.facturasNuevas || []).concat(FS.listFacturas());
      var estados = Array.from(new Set(all.map(function (f) { return f.estado; }))).sort();
      var q = state.facturaFiltro.q.toLowerCase();
      var estFiltro = state.facturaFiltro.estado;
      var filtradas = all.filter(function (f) {
        var texto = (f.numero + ' ' + (f.clienteNombre || '') + ' ' + (f.proyecto || '')).toLowerCase();
        return (!q || texto.indexOf(q) !== -1) && (!estFiltro || f.estado === estFiltro);
      });

      var rows = filtradas.map(function (f) {
        return '<tr' + (f.nueva ? ' class="is-nuevo"' : '') + '><td>' +
          (f.nueva ? '<code>' + esc(f.numero) + '</code><span class="fdemo-nuevo-pill">New</span>' : linkTo('facturas', f.id, f.numero)) + '</td>' +
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

    /* ══════════════ EL LECTOR DE DOCUMENTOS ══════════════ */

    // Una remesa de verdad: veinte facturas de proveedor dentro de un solo
    // PDF, que es como llegan del gestor o del propio proveedor. Los datos
    // son inventados; la FORMA es la que tiene una remesa.
    var REMESA_PROV = ['Nubalia Cloud','Perlan Graphic Supplies','Belvedo Coworking','Sarkia Telecom','Tarsen Travel','Norlem Suite','Rivelda External Talent','Menvia Accountants'];
    var REMESA = (function () {
      var out = [], sem = 7;
      function r() { sem = (sem * 1103515245 + 12345) & 0x7fffffff; return sem / 0x7fffffff; }
      for (var i = 0; i < 20; i++) {
        var base = Math.round((80 + r() * 1400) * 100) / 100;
        var iva = Math.round(base * 0.21 * 100) / 100;
        out.push({
          n: 'FP-2026-' + String(4100 + i * 7),
          prov: REMESA_PROV[i % REMESA_PROV.length],
          base: base, iva: iva, total: Math.round((base + iva) * 100) / 100,
          pag: i + 1
        });
      }
      return out;
    })();

    // Los documentos que se pueden probar. Cada uno enseña una forma distinta
    // de entrar: una remesa que se da de alta entera, una factura suelta que
    // acaba en Gastos, un albarán FOTOGRAFIADO -que es el caso difícil- y un
    // extracto del banco que se concilia contra lo que ya hay.
    var DOCS = [
      { k: 'remesa', n: 'supplier-batch-september.pdf', p: '2,4 MB', t: '20 invoices in a single PDF', icono: 'pdf' },
      { k: 'factura', n: 'supplier-invoice-0441.pdf', p: '148 KB', t: 'A single invoice', icono: 'pdf' },
      { k: 'albaran', n: 'delivery-note-photo.jpg', p: '1,9 MB', t: 'A delivery note photographed on a phone', icono: 'img' },
      { k: 'extracto', n: 'bank-statement-september.csv', p: '36 KB', t: 'Bank movements', icono: 'csv' }
    ];
    var ICONO_DOC = {
      pdf: '<path d="M6 2.75h8L19.25 8v13.25a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75V3.5A.75.75 0 0 1 6 2.75Z"/><path d="M13.5 3v5h5.25"/>',
      img: '<rect x="3" y="4.75" width="18" height="14.5" rx="2"/><circle cx="8.5" cy="10" r="1.6"/><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5" stroke-linejoin="round"/>',
      csv: '<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M3.5 9h17M9 3.5v17" stroke-linecap="round"/>'
    };

    function abreCajon() { state.docCajon = !state.docCajon; render(); }

    // El muro. No es un «no puedes»: es un «esto va en el plan que lee
    // documentos», con el botón para ir a verlo. Un muro que no explica nada
    // es una puerta cerrada; este es un escaparate.
    function muro(titulo, texto) {
      state.muro = { titulo: titulo, texto: texto };
      render();
    }
    function muroHtml() {
      if (!state.muro) return '';
      return '<div class="fdemo-muro" data-action="muro-fuera">' +
        '<div class="fdemo-muro-c" role="dialog" aria-modal="true">' +
        '<span class="fdemo-muro-ic" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' +
        '<rect x="4.5" y="10.5" width="15" height="10" rx="2"/>' +
        '<path d="M8 10.5V7.75a4 4 0 0 1 8 0v2.75" stroke-linecap="round"/></svg></span>' +
        '<h3 class="fdemo-muro-t">' + esc(state.muro.titulo) + '</h3>' +
        '<p class="fdemo-muro-p">' + esc(state.muro.texto) + '</p>' +
        '<div class="fdemo-muro-b">' +
        '<a class="fdemo-btn variant-primary" href="/en/sistema-financiero#planes">See the plans</a>' +
        '<button type="button" class="fdemo-btn variant-ghost" data-action="muro-cerrar">Keep looking</button>' +
        '</div></div></div>';
    }

    // El cajón de documentos: lo que se puede soltar en la conversación.
    function cajonHtml() {
      if (!state.docCajon) return '';
      return '<div class="fdemo-cajon">' +
        '<p class="fdemo-cajon-t">Drop it a document and watch what it does with it</p>' +
        DOCS.map(function (d) {
          return '<button type="button" class="fdemo-doc-op" data-action="doc-op" data-k="' + d.k + '">' +
            '<span class="fdemo-doc-op-i"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
            ICONO_DOC[d.icono] + '</svg></span>' +
            '<span class="fdemo-doc-op-c"><b>' + esc(d.n) + '</b><i>' + esc(d.t) + '</i></span>' +
            '<span class="fdemo-doc-op-p">' + esc(d.p) + '</span></button>';
        }).join('') +
        '<button type="button" class="fdemo-doc-op es-bloq" data-action="doc-mio">' +
        '<span class="fdemo-doc-op-i"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
        '<path d="M12 16.5V6m0 0 4 4m-4-4-4 4" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M4.5 16v2.5a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V16" stroke-linecap="round"/></svg></span>' +
        '<span class="fdemo-doc-op-c"><b>Upload a document of mine</b><i>Your PDFs, your photos, your spreadsheets</i></span>' +
        '<span class="fdemo-candado" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">' +
        '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" stroke-linecap="round"/></svg>' +
        '</span></button>' +
        '</div>';
    }

    // ── el proceso de lectura ──
    function sueltaDoc(k) {
      var d = null;
      for (var i = 0; i < DOCS.length; i++) if (DOCS[i].k === k) d = DOCS[i];
      if (!d) return;
      state.docCajon = false;
      state.lector = { k: k, fase: 'leyendo', leidas: 0, doc: d, alta: false };
      state.ia.mensajes.push({ autor: 'usuario', texto: TXT_SUELTA[k],
        chip: { nombre: d.n, peso: d.p, leido: '✓ Uploaded' } });
      render();
      var mainEl2 = root.querySelector('[data-role="main"]'); if (mainEl2) mainEl2.scrollTop = mainEl2.scrollHeight;
      // Las facturas aparecen UNA A UNA. Enseñar las veinte de golpe sería
      // más rápido y no se entendería: lo que convence es ver que las está
      // sacando del documento mientras lo lee.
      clearInterval(state.lectorT);
      if (k === 'remesa') {
        state.lectorT = setInterval(function () {
          state.lector.leidas++;
          if (state.lector.leidas >= REMESA.length) {
            clearInterval(state.lectorT);
            state.lector.fase = 'leido';
          }
          render();
        }, 190);
      } else {
        setTimeout(function () { if (state.lector) { state.lector.fase = 'leido'; render(); } }, 1500);
      }
    }
    var TXT_SUELTA = { remesa: 'Here is this month\u2019s batch. File whatever you can.', factura: 'This supplier invoice — put it wherever it goes.', albaran: 'Sending you a photo of the delivery note they just dropped off.', extracto: 'This month\u2019s bank statement.' };

    function daDeAlta() {
      // Aquí es donde el sistema hace lo que nadie más hace: las facturas no
      // se quedan en una bandeja, entran en Facturas con su número y su
      // proveedor, listas para revisar.
      state.facturasNuevas = REMESA.map(function (r, i) {
        return { id: 'nv' + i, numero: r.n, cliente: r.prov, clienteNombre: r.prov,
                 proyecto: null, fechaEmision: FS.hoy, fechaVencimiento: null,
                 importe: r.total, base: r.base, iva: r.iva, estado: 'Borrador',
                 estadoCobro: null, importeCobrado: 0, nueva: true };
      });
      state.lector.alta = true;
      state.lector.fase = 'alta';
      render();
    }

    function lectorHtml() {
      var L = state.lector;
      if (!L) return '';
      if (L.k !== 'remesa') return lectorSimpleHtml(L);
      var vistas = REMESA.slice(0, L.leidas);
      var leyendo = L.fase === 'leyendo';
      var total = vistas.reduce(function (a, r) { return a + r.total; }, 0);
      return '<div class="fdemo-ia-msg from-ia"><div class="fdemo-lector">' +
        '<div class="fdemo-lector-h">' +
        (leyendo ? '<span class="fdemo-doc-spin" aria-hidden="true"></span>' : '<span class="fdemo-lector-ok">\u2713</span>') +
        '<div><b>' + (leyendo ? 'Reading the document…' : '{n} invoices found'.replace('{n}', REMESA.length)) + '</b>' +
        '<i>' + (leyendo ? 'page {p} of {t}'.replace('{p}', L.leidas + 1).replace('{t}', REMESA.length)
                         : 'adding up to {t}'.replace('{t}', EUR(total))) + '</i></div>' +
        '<span class="fdemo-lector-cont">' + L.leidas + ' / ' + REMESA.length + '</span>' +
        '</div>' +
        '<div class="fdemo-lector-barra"><i style="width:' + Math.round((L.leidas / REMESA.length) * 100) + '%"></i></div>' +
        '<div class="fdemo-lector-tabla"><table class="fdemo-table"><thead><tr>' +
        '<th>No.</th><th>Supplier</th><th class="is-right">Net</th>' +
        '<th class="is-right">VAT</th><th class="is-right">Total</th><th>From</th>' +
        '</tr></thead><tbody>' +
        vistas.map(function (r, i) {
          return '<tr class="' + (i === vistas.length - 1 && leyendo ? 'es-entrando' : '') + '">' +
            '<td><code>' + esc(r.n) + '</code></td><td class="is-muted">' + esc(r.prov) + '</td>' +
            '<td class="is-right">' + EUR(r.base) + '</td><td class="is-right">' + EUR(r.iva) + '</td>' +
            '<td class="is-right">' + EUR(r.total) + '</td>' +
            '<td class="is-muted">p. ' + r.pag + '</td></tr>';
        }).join('') + '</tbody></table></div>' +
        (L.fase === 'leido'
          ? '<div class="fdemo-lector-pie"><p>Review them before confirming. Nothing is saved until you file them.</p>' +
            '<button type="button" class="fdemo-btn variant-primary" data-action="alta">' +
            'File all {n}'.replace('{n}', REMESA.length) + '</button></div>'
          : L.fase === 'alta'
            ? '<div class="fdemo-lector-pie es-hecho"><p><b>{n} invoices filed.'.replace('{n}', REMESA.length) + '</b> They are in Invoices, as drafts, ready to review.</p>' +
              '<a class="fdemo-btn variant-secondary" href="#facturas">See them in Invoices</a></div>'
            : '') +
        '</div></div>';
    }

    // Los otros tres documentos: la misma mecánica, más corta.
    var SIMPLE = {
      factura: { t: 'Invoice read', campos: [['Supplier','Perlan Graphic Supplies'],['Invoice number','FP-2026-0441'],['Net amount','412,00 €'],['VAT','86,52 €'],['Total','498,52 €'],['Date','12/08/2026']], destino: 'Filed under Expenses, waiting for your review.', href: '#gastos' },
      albaran: { t: 'Delivery note read from a photo', campos: [['Supplier','Nubalia Cloud'],['Note number','ALB-2026-0188'],['Lines','6'],['Date','03/09/2026']], destino: 'Filed under Delivery notes and linked to its order.', href: '#albaranes' },
      extracto: { t: 'Statement reconciled', campos: [['Movements','34'],['Reconciled','11'],['Unidentified','3'],['Period','01/09 – 20/09']], destino: 'Eleven payments matched. Three movements match no invoice: it flags them instead of assigning them by eye.', href: '#cobros' }
    };
    function lectorSimpleHtml(L) {
      var S = SIMPLE[L.k]; if (!S) return '';
      var leyendo = L.fase === 'leyendo';
      return '<div class="fdemo-ia-msg from-ia"><div class="fdemo-lector">' +
        '<div class="fdemo-lector-h">' +
        (leyendo ? '<span class="fdemo-doc-spin" aria-hidden="true"></span>' : '<span class="fdemo-lector-ok">\u2713</span>') +
        '<div><b>' + (leyendo ? 'Reading the document…' : S.t) + '</b>' +
        '<i>' + esc(L.doc.n) + '</i></div></div>' +
        (leyendo ? '' :
          '<div class="fdemo-lector-campos">' + S.campos.map(function (c) {
            return '<div><span>' + esc(c[0]) + '</span><b>' + esc(c[1]) + '</b></div>';
          }).join('') + '</div>' +
          '<div class="fdemo-lector-pie es-hecho"><p>' + esc(S.destino) + '</p>' +
          '<a class="fdemo-btn variant-secondary" href="' + S.href + '">See it there</a></div>') +
        '</div></div>';
    }

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
        state.ia.mensajes.map(mensajeHtml).join('') + lectorHtml() +
        '</div></div>' +
        '<form class="fdemo-ask-form" data-role="ia-form">' +
        '<input class="fdemo-input" type="text" name="pregunta" aria-label="Type your question" placeholder="What is going on?" autocomplete="off" maxlength="200">' +
        '<button type="submit" class="fdemo-btn variant-primary">Ask</button>' +
        '</form>' +
        '<button type="button" class="fdemo-ask-clip' + (state.docCajon ? ' es-abierto' : '') + '" data-action="adjuntar" aria-expanded="' + (state.docCajon ? 'true' : 'false') + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M21 11.5 12.5 20a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '<span>Drop it a document</span><i>PDF, photo, spreadsheet or CSV</i></button>' + cajonHtml() +
        (chips ? '<div class="fdemo-ask-chips"><p class="fdemo-ask-chips-t">Or try one of these:</p><div class="fdemo-ia-chips">' + chips + '</div></div>' : '') +
        muroHtml() +
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
      function campo(l, v) {
        return '<div class="fdemo-dato"><p class="fdemo-dato-l">' + esc(l) + '</p><p class="fdemo-dato-v">' + v + '</p></div>';
      }
      function rejilla(items) { return '<div class="fdemo-rejilla">' + items.join('') + '</div>'; }
      function chip(x) { return '<span class="fdemo-chip">' + esc(x) + '</span>'; }
      function opcion(t, d, activa) {
        return '<button type="button" class="fdemo-opcion' + (activa ? ' es-activa' : '') + '"' +
          ' data-action="plan" data-plan="tema" aria-pressed="' + (activa ? 'true' : 'false') + '">' +
          '<span class="fdemo-opcion-h"><span class="fdemo-opcion-t">' + esc(t) + '</span>' +
          (activa ? '<span class="fdemo-opcion-u">In use</span>' : '') + '</span>' +
          '<span class="fdemo-opcion-d">' + esc(d) + '</span></button>';
      }

      // ── el plan ──
      var plan = card(cardHead('Your plan', 'Contract managed by D-Code Partners'),
        rejilla([campo('Plan', '<b>Finance with intelligence</b>'), campo('Status', pill('Activo')),
                 campo('Users', '3 / 5'), campo('Renewal', 'Monthly')]) +
        '<div class="fdemo-franja"><p class="fdemo-franja-t">Included in your plan</p><div class="fdemo-chips">' +
        ['Invoicing and collections','Expenses and payments','Ask Finance','Document reading','Radar and targets','VERI*FACTU register'].map(chip).join('') +
        '</div></div>');

      // ── datos fiscales ──
      var fiscal = card(cardHead('Your company tax details', 'The ones that go on every invoice and into its register. Without them an issued invoice does not enter the chain.'),
        '<div class="fdemo-form">' +
        '<label class="fdemo-campo"><span class="fdemo-campo-l">Legal name</span>' +
        '<input class="fdemo-input" value="D-Code Partners, S.L." data-action="plan" data-plan="editar" readonly></label>' +
        '<label class="fdemo-campo"><span class="fdemo-campo-l">NIF</span>' +
        '<input class="fdemo-input" value="B00000000" data-action="plan" data-plan="editar" readonly></label>' +
        '<label class="fdemo-campo fdemo-campo--ancho"><span class="fdemo-campo-l">Registered address</span>' +
        '<input class="fdemo-input" value="1 Example Street, 28001 Madrid" data-action="plan" data-plan="editar" readonly></label>' +
        '<p class="fdemo-campo-hint fdemo-campo--ancho">Nothing is saved in the demo: the form is here so you can see where each field lives.</p>' +
        '</div>');

      // ── series ──
      var SERIES = [['F','Invoice','Ordinary','2026', true],
                    ['R','Credit note','Linked to the original','2026', false],
                    ['P','Quote','Not fiscal','2026', false]];
      var series = card(cardHead('Series and numbering', 'Numbering is consecutive WITHIN each series, as art. 6 of RD 1619/2012 requires.'),
        tablaSimple([{t:'Document'},{t:'Code'},{t:'Description'},{t:'Year'},{t:'Status'}],
          SERIES.map(function (s) {
            return '<tr><td>' + esc(s[1]) + '</td><td><code>' + esc(s[0]) + '</code></td>' +
              '<td class="is-muted">' + esc(s[2]) + '</td><td class="is-muted">' + esc(s[3]) + '</td>' +
              '<td>' + pill('Activa') + (s[4] ? ' <span class="fdemo-defecto">default</span>' : '') + '</td></tr>';
          }).join(''), ''));

      // ── notificaciones ──
      var REGLAS = [['First reminder after the due date','7'],['Second reminder','15'],['Alert management if it is still unpaid','30']];
      var noti = card(cardHead('Notifications', 'Where alerts go and when an invoice gets a reminder'),
        '<div class="fdemo-card-body"><ul class="fdemo-reglas">' + REGLAS.map(function (r) {
          return '<li><span class="fdemo-regla-t">' + esc(r[0]) + '</span>' +
            '<span class="fdemo-regla-n"><b>' + r[1] + '</b> days</span>' +
            '<span class="fdemo-interruptor es-on" data-action="plan" data-plan="editar" role="switch" aria-checked="true"><i></i></span></li>';
        }).join('') + '</ul></div>');

      // ── claves de API ──
      var api = card(cardHead('API keys', 'To connect automations. Each key carries a role, and the role decides what whoever uses it can do.'),
        tablaSimple([{t:'Name'},{t:'Role'},{t:'Ends in'},{t:'Created'},{t:'Last used'}],
          '<tr><td>Website integration</td><td>' + pill('Finance') + '</td><td><code>…4f2a</code></td>' +
          '<td class="is-muted">3 months ago</td><td class="is-muted">2 days ago</td></tr>', '') +
        '<div class="fdemo-card-body"><button type="button" class="fdemo-btn variant-secondary" data-action="plan" data-plan="api">Create a key</button></div>');

      // ── tema ──
      var tema = card(cardHead('Theme', 'It is yours, not the company\u2019s: it follows you on any device you sign in from.'),
        '<div class="fdemo-card-body"><div class="fdemo-opciones">' +
        opcion('Light', 'What you see when you come in. Made for working by day.', true) + opcion('Dark', 'Same contrast, less light. For whoever works at night.', false) + '</div></div>');

      // ── roles: tres columnas legibles, no setenta chips ──
      var ROLES = [
        ['Owner', 'Everything, including inviting and removing people', 'Everything'],
        ['Administrador', 'Everything except ownership of the account', 'Everything'],
        ['Dirección', 'See everything and decide; does not touch tax settings', 'See and decide'],
        ['Finanzas', 'Invoice, collect, spend and close', 'Operate'],
        ['Operaciones', 'See and create documents; does not see margins', 'Documents'],
        ['Solo lectura', 'Look. That is all.', 'View only']
      ];
      var roles = card(cardHead('Roles and permissions', 'What each role can do. Permission is checked per module and per action.'),
        tablaSimple([{t:'Role'},{t:'What they can do'},{t:'Scope'}],
          ROLES.map(function (r) {
            return '<tr><td>' + esc(r[0]) + '</td><td class="is-muted">' + esc(r[1]) + '</td>' +
              '<td>' + chip(r[2]) + '</td></tr>';
          }).join(''), ''));

      var sesion = card(cardHead('Current session'),
        rejilla([campo('User', 'Cuenta de demostración'), campo('Role', pill('Administrador')),
                 campo('Organisation', 'D-Code Partners'), campo('Data source', pill('Sample data'))]));

      return '<div class="fdemo-panel fdemo-conf">' +
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Settings</p>' +
        '<h1 class="fdemo-page-title">Settings</h1>' +
        '<p class="fdemo-page-sub">Your company, your series, who gets in, where alerts go and what it connects to.</p></div></div>' +
        plan + fiscal + series + noti + api + tema + roles + sesion +
        '</div>';
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
      if (clipEl) { e.preventDefault(); abreCajon(); return; }
      var opEl = e.target.closest('[data-action="doc-op"]');
      if (opEl) { e.preventDefault(); sueltaDoc(opEl.getAttribute('data-k')); return; }
      if (e.target.closest('[data-action="doc-mio"]')) {
        e.preventDefault(); state.docCajon = false;
        muro('Reading your own documents is in the intelligence plan', 'Here you can drop the four sample documents and see exactly what it does with them. With a plan, the same but with yours: PDFs, photos, spreadsheets, whatever turns up.');
        return;
      }
      if (e.target.closest('[data-action="alta"]')) { e.preventDefault(); daDeAlta(); return; }
      if (e.target.closest('[data-action="plan"]')) {
        e.preventDefault();
        muro('Reading your own documents is in the intelligence plan', 'Here you can drop the four sample documents and see exactly what it does with them. With a plan, the same but with yours: PDFs, photos, spreadsheets, whatever turns up.');
        return;
      }
      if (e.target.closest('[data-action="muro-cerrar"]') ||
          (e.target.getAttribute && e.target.getAttribute('data-action') === 'muro-fuera')) {
        e.preventDefault(); state.muro = null; render(); return;
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
          // Sin coincidencia no se improvisa NI se pide perdón: se enseña
          // lo que hace el sistema de verdad y se ofrece verlo. Un «no puedo»
          // a secas es una puerta cerrada; esto es un escaparate.
          muro('Writing your own questions is in the intelligence plan',
               'This demo answers the eight questions below, calculated over made-up data. Over your company’s data it answers any of them, and every answer brings where the figure came from.');
          return;
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
    /* El guion de la visita. Cada paso puede, además de cambiar de pantalla,
       EJECUTAR algo: abrir el cajón, elegir un documento, pulsar el alta. Eso
       es lo que separa una visita de un pase de diapositivas. */
    var TOUR = [
      { v: 'dashboard', ms: 7000, dice: 'The dashboard: the sentence on top already says what is going on' },
      { v: 'tesoreria', ms: 5200, dice: 'Treasury: what comes in and what goes out' },
      { v: 'cobros',    ms: 5200, dice: 'Collections: who owes and since when' },
      { v: 'radar',     ms: 5200, dice: 'Radar: the alerts, each with its threshold written down' },
      { v: 'ia',        ms: 2600, dice: 'We drop it a PDF with twenty invoices…', hace: 'abrir' },
      { v: 'ia',        ms: 2200, dice: 'We drop it a PDF with twenty invoices…', hace: 'remesa', quieto: true },
      { v: 'ia',        ms: 5200, dice: '…it is pulling them out one by one', quieto: true },
      { v: 'ia',        ms: 2600, dice: 'And it files them', hace: 'alta', quieto: true },
      { v: 'facturas',  ms: 6400, dice: 'There they are, in Invoices' }
    ];
    /* Cuatro segundos y medio. Es el tiempo que alguien tarda en leer la
       pantalla y decidir que no va a tocar nada; más que eso y la demo
       parece apagada, menos y le quita el ratón de las manos. */
    var REANUDA_MS = 4500;
    var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var tour = { on: false, i: 0, t0: 0, dur: 1, timer: 0, raf: 0, vuelta: 0, visible: false, mano: false };
    var tourTxtEl = root.querySelector('[data-role="tour-txt"]');
    var tourBtnEl = root.querySelector('[data-role="tour"]');
    var tourBarEl = root.querySelector('[data-role="tour-bar"] i');


    /* ══════════════ LA MANO ══════════════
       Un puntero de verdad: flecha, sombra y onda al pulsar. Un punto sin
       forma se lee como un adorno; una flecha se lee como alguien usando la
       aplicación, que es justo lo que está pasando. */
    var manoEl = root.querySelector('[data-role="mano"]');
    var manoT = [0, 0, 0];
    function manoLimpia() {
      for (var i = 0; i < manoT.length; i++) clearTimeout(manoT[i]);
      if (manoEl) manoEl.classList.remove('is-ahi', 'is-pulsa');
    }
    function llevaLaManoA(selector, hecho) {
      var destino = root.querySelector(selector);
      if (!manoEl || !destino || reducido) { hecho(); return; }
      var caja = destino.getBoundingClientRect(), marco = root.getBoundingClientRect();
      if (!caja.width || caja.bottom < marco.top - 40 || caja.top > marco.bottom + 40) { hecho(); return; }
      manoEl.style.transform = 'translate(' + (caja.left - marco.left + Math.min(28, caja.width * 0.5)) +
        'px,' + (caja.top - marco.top + caja.height * 0.5) + 'px)';
      manoEl.classList.add('is-ahi');
      /* El orden importa: primero llega, después pulsa, y SOLO DESPUÉS
         cambia la pantalla. Lo que convence es ver el efecto detrás de la
         causa, no a la vez. */
      manoT[0] = setTimeout(function () { manoEl.classList.add('is-pulsa'); }, 560);
      manoT[1] = setTimeout(function () { hecho(); }, 760);
      manoT[2] = setTimeout(function () { manoEl.classList.remove('is-pulsa'); }, 1060);
    }

    function pintaTour() {
      root.classList.toggle('is-tour', tour.on);
      if (tourTxtEl && !tour.on) tourTxtEl.textContent = 'You are driving';
      if (tourTxtEl && tour.on && !tourTxtEl.textContent) tourTxtEl.textContent = 'Guided tour';
      if (tourBtnEl) tourBtnEl.setAttribute('title', tour.on ? 'Stop the tour and navigate yourself' : 'Resume the guided tour');
      if (!tour.on && tourBarEl) tourBarEl.style.transform = 'scaleX(0)';
    }
    function pasoTour() {
      var paso = TOUR[tour.i % TOUR.length];
      tour.i++;
      if (tourTxtEl && paso.dice) tourTxtEl.textContent = paso.dice;

      function sigue() {
        if (!tour.on) return;
        tour.t0 = Date.now(); tour.dur = paso.ms;
        clearTimeout(tour.timer);
        tour.timer = setTimeout(function () { if (tour.on) pasoTour(); }, paso.ms);
      }
      function aplica() {
        if (!tour.on) return;
        if (!paso.quieto) { state.route = paso.v; state.id = null; render(); }
        if (paso.hace === 'abrir') { state.docCajon = true; render(); }
        if (paso.hace === 'remesa') { sueltaDoc('remesa'); }
        if (paso.hace === 'alta') { if (state.lector && state.lector.fase === 'leido') daDeAlta(); }
        sigue();
      }
      /* La mano va al sitio que corresponde: al módulo del menú si el paso
         cambia de pantalla, y al botón concreto si el paso pulsa algo. */
      var destino = paso.hace === 'remesa' ? '[data-action="doc-op"][data-k="remesa"]'
                  : paso.hace === 'alta' ? '[data-action="alta"]'
                  : paso.hace === 'abrir' ? '[data-action="adjuntar"]'
                  : '[data-role="nav"][data-view="' + paso.v + '"]';
      llevaLaManoA(destino, aplica);
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
        /* MEDIDO: al reanudar se seguia por el paso donde se habia quedado, y
           cuatro de los nueve pasos son `quieto` —no cambian de pantalla—.
           Reanudar en uno de ellos dejaba el rotulo contando lo del lector
           mientras la pantalla era la que habia abierto la persona, y la mano
           pulsando botones que no estaban. La visita se cuenta desde el
           principio, que ademas es donde empieza a entenderse. */
        tour.i = 0;
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
