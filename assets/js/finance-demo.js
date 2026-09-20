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
    { id: 'dashboard', label: 'Dashboard', grupo: 'dia' },
    { id: 'facturas', label: 'Facturas', grupo: 'dia' },
    { id: 'presupuestos', label: 'Presupuestos', grupo: 'negocio' },
    { id: 'clientes', label: 'Clientes', grupo: 'negocio' },
    { id: 'cobros', label: 'Cobros', grupo: 'dia' },
    { id: 'gastos', label: 'Gastos', grupo: 'dia' },
    { id: 'documentos', label: 'Documentos', grupo: 'dia' },
    { id: 'proyectos', label: 'Proyectos', grupo: 'negocio' },
    { id: 'ia', label: 'Pregunta a Finanzas', grupo: 'inteligencia' },
    { id: 'configuracion', label: 'Configuración', grupo: 'administracion' }
  ];

  // Solo se usa en modo fullpage (la vista embebida de Home/Finanzas no
  // cambia): grupos y trazos de icono tomados 1:1 de nav-items.ts y
  // NavIcono.tsx del repositorio real, limitados a los módulos que esta
  // demo realmente tiene construidos (sin Proveedores/Auditoría/Usuarios/
  // Clientes D-Code, que existen en el producto real pero aún no tienen
  // vista propia aquí).
  var NAV_GROUPS = [
    { clave: 'dia', titulo: 'Día a día' },
    { clave: 'negocio', titulo: 'Negocio' },
    { clave: 'inteligencia', titulo: 'Inteligencia' },
    { clave: 'administracion', titulo: 'Administración' }
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
    var useHash = mode === 'fullpage';

    root.classList.add('fdemo-app', useHash ? 'is-fullpage' : 'is-embedded');
    root.innerHTML =
      '<div class="fdemo-sidebar-overlay" data-role="overlay"></div>' +
      '<nav class="fdemo-sidebar" data-role="sidebar"></nav>' +
      '<div class="fdemo-shell">' +
      '<div class="fdemo-topbar">' +
      '<button class="fdemo-topbar-menu-btn" type="button" data-role="menu-btn" aria-label="Abrir menu">' + MENU_ICON + '</button>' +
      '<div class="fdemo-topbar-right">' +
      /* EL RECORRIDO. Si no lo toca nadie, la demo se recorre sola los
         módulos; en cuanto alguien interactúa, se para y manda el usuario.
         El indicador está aquí y no escondido: quien ve moverse la pantalla
         tiene que saber por qué se mueve y cómo pararlo. */
      '<button type="button" class="fdemo-tour" data-role="tour" aria-live="polite">' +
      '<span class="fdemo-tour-dot" aria-hidden="true"></span>' +
      '<span class="fdemo-tour-txt" data-role="tour-txt">Recorrido automático</span>' +
      '</button>' +
      '<div class="fdemo-topbar-user"><div class="fdemo-topbar-name">D-Code Partners</div><div class="fdemo-topbar-role">Cuenta de demostración</div></div>' +
      '<div class="fdemo-topbar-avatar">D</div>' +
      /* La salida vuelve, pero SOLO en pantalla completa. Ahí la aplicación
         es la ventana entera y sin ella no hay manera de volver a la web.
         Empotrada no hace falta: la demo ya está entera donde está. */
      (useHash ? '<a class="fdemo-topbar-exit" href="' + (root.getAttribute('data-exit-href') || '/sistema-financiero') + '">' + esc(root.getAttribute('data-exit-label') || 'Salir') + '</a>' : '') +
      '</div>' +
      '<div class="fdemo-tour-bar" data-role="tour-bar" aria-hidden="true"><i></i></div>' +
      '</div>' +
      // La marca DEMO va en las DOS modalidades. Antes solo la llevaba la
      // pantalla completa, así que la instancia empotrada en la Home enseñaba
      // importes, clientes y vencimientos sin que nada visible dijera que son
      // inventados. Quien cae en la Home la ve igual que quien abre la demo.
      '<div class="fdemo-demo-banner" role="status"><span class="fdemo-demo-banner-dot" aria-hidden="true"></span><span class="fdemo-demo-banner-label">Demostración</span><span class="fdemo-demo-banner-text">datos ficticios, no reflejan información real de D-Code Partners</span></div>' +
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

    // La vista embebida (Home, Departamentos → Finanzas) mantiene exactamente
    // el escaparate aprobado: marca simple, lista plana, sin iconos. Solo el
    // modo fullpage (pantalla completa) adopta la marca real (mismo logo que
    // la web), la navegación agrupada con iconos y el indicador deslizante
    // del repositorio dcode-finance actual (rama finance-product-rebuild).
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
        '<div class="fdemo-dash-row">' +
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
      /* El panel y «Pregunta a Finanzas» cuentan lo vencido por FECHA. Esta
         pantalla lo contaba por ESTADO, y salían números distintos en la misma
         demo: 2026-011 lleva 27 días de retraso y está marcada «En
         seguimiento», así que no aparecía como vencida. Se cuenta por fecha,
         que es lo que le importa a quien cobra, y las agrupaciones de abajo
         siguen siendo las del estado, que es como trabaja el sistema. */
      var hoy = FS.hoy || '';
      var fueraDePlazo = cobros.filter(function (c) { return c.pendiente > 0 && c.fechaVencimiento && c.fechaVencimiento < hoy; });

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
        kpi('Fuera de plazo', String(fueraDePlazo.length), 'Por fecha de vencimiento', 'danger') +
        kpi('En seguimiento', String(grupos.seguimiento.length), '', 'warning') +
        kpi('Cobradas', String(grupos.cobrados.length), '', 'cyan') +
        '</div>' +
        grupoCard('Vencidas', grupos.vencidos) + grupoCard('En seguimiento', grupos.seguimiento) +
        grupoCard('Pendientes / parciales', grupos.pendientes) + grupoCard('Cobradas', grupos.cobrados);
    };

    // ---------- Gastos ----------
    RENDERERS.gastos = function (id) {
      if (id) return gastoDetalle(id);
      /* El gasto que acaba de salir de un PDF va el primero y marcado: sin
         eso, «crear gasto» es un botón que no se sabe si ha hecho algo. */
      var all = (state.gastoNuevo ? [state.gastoNuevo] : []).concat(FS.listGastos());
      var total = all.reduce(function (s, g) { return s + g.importe; }, 0);
      var rows = all.map(function (g) {
        return '<tr' + (g.documento ? ' class="is-nuevo"' : '') + '><td>' + linkTo('gastos', g.id, g.proveedor) +
          (g.documento ? '<span class="fdemo-nuevo-pill">Nuevo</span><span class="fdemo-doc-mini">' + esc(g.documento) + '</span>' : '') +
          '</td><td class="is-muted">' + esc(dash(g.concepto)) + '</td><td class="is-muted">' + esc(dash(g.categoria)) + '</td>' +
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
      { k: 'Importe total', v: '498,52 €', frag: '…mponible: 412,00 EUR  IVA 21%: 86,52 EUR  TOTAL FACTURA: 498,52 EUR' },
      { k: 'Fecha', v: '12 ago 2026', frag: '…de factura: FP-2026-0441  Fecha de emision: 12/08/2026  Fecha de vencimient…' },
      { k: 'Nº de factura', v: 'FP-2026-0441', frag: '…Pradillo 42, 28002 Madrid  FACTURA  Numero de factura: FP-2026-0441…' },
      { k: 'Base imponible', v: '412,00 €', frag: '…y consumibles de agosto  Base imponible: 412,00 EUR  IVA 21%: 86,52 E…' },
      { k: 'Cuota de IVA', v: '86,52 €', frag: '…Base imponible: 412,00 EUR  IVA 21%: 86,52 EUR  TOTAL FACTURA: 4…' },
      { k: 'NIF detectado (sin ficha de proveedor que coincida)', v: 'B84213977', frag: 'SUMINISTROS BELMONTE SL  CIF B84213977 - Calle Pradillo 42…' }
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
          '<p class="fdemo-doc-run-t">' + 'Subiendo y analizando' + ' <b>' + esc(state.doc.archivo) + '</b>…</p></div>';
      } else if (f === 'detectado') {
        cuerpo = '<div class="fdemo-doc-out">' +
          '<p class="fdemo-doc-out-t">' + 'Detectado en' + ' «<b>' + esc(state.doc.archivo) + '</b>»</p>' +
          '<p class="fdemo-doc-out-s">' + 'Cada valor enseña el fragmento del PDF del que salió. Revisa, corrige lo que haga falta y confirma: no se guarda nada hasta entonces.' + '</p>' +
          '<ul class="fdemo-doc-campos">' + DOC_CAMPOS.map(function (c) {
            return '<li><span class="fdemo-doc-k">' + esc(c.k) + '</span>' +
              '<span class="fdemo-doc-v">' + esc(c.v) + '</span>' +
              '<span class="fdemo-doc-frag">' + esc(c.frag) + '</span></li>';
          }).join('') + '</ul>' +
          '<div class="fdemo-doc-acts">' +
          '<button type="button" class="fdemo-btn variant-primary" data-action="doc" data-doc="crear">' + 'Crear gasto' + '</button>' +
          '<button type="button" class="fdemo-btn" data-action="doc" data-doc="inicio">' + 'Cancelar' + '</button>' +
          '</div></div>';
      } else if (f === 'escaneado') {
        cuerpo = '<div class="fdemo-doc-out is-warn">' +
          '<p class="fdemo-doc-out-t">«<b>' + esc(state.doc.archivo) + '</b>»</p>' +
          '<p class="fdemo-doc-out-s">' + 'El PDF no contiene texto legible (probablemente es un escaneado o una foto). Puedes introducir los datos a mano: el documento ya queda guardado y se adjuntará al gasto.' + '</p>' +
          '<div class="fdemo-doc-acts">' +
          '<button type="button" class="fdemo-btn variant-primary" data-action="nav" data-view="gastos">' + 'Rellenar a mano' + '</button>' +
          '<button type="button" class="fdemo-btn" data-action="doc" data-doc="inicio">' + 'Probar con otro documento' + '</button>' +
          '</div></div>';
      } else if (f === 'creado') {
        cuerpo = '<div class="fdemo-doc-out is-ok">' +
          '<p class="fdemo-doc-out-s">' + 'Gasto creado con el documento adjunto. Lo tienes arriba del todo en Gastos, pendiente de revisión.' + '</p>' +
          '<div class="fdemo-doc-acts">' +
          '<button type="button" class="fdemo-btn variant-primary" data-action="nav" data-view="gastos">' + 'Ver el gasto en Gastos' + '</button>' +
          '<button type="button" class="fdemo-btn" data-action="doc" data-doc="inicio">' + 'Probar con otro documento' + '</button>' +
          '</div></div>';
      } else {
        cuerpo = '<p class="fdemo-doc-explica">' + 'Sube la factura del proveedor en PDF. Si el PDF es digital, los campos se detectan solos y tú solo revisas. Si es un escaneado, el documento queda guardado y rellenas los datos a mano.' + '</p>' +
          '<div class="fdemo-doc-acts">' +
          '<button type="button" class="fdemo-btn variant-primary" data-action="doc" data-doc="digital">' + 'Probar con una factura digital' + '</button>' +
          '<button type="button" class="fdemo-btn" data-action="doc" data-doc="escaneado">' + 'Probar con un escaneado' + '</button>' +
          '</div>';
      }

      var archivo = [
        { n: state.gastoNuevo ? 'FP-2026-0441-belmonte.pdf' : 'albaran-ALB-2026-0007.pdf', t: state.gastoNuevo ? 'Factura' : 'Albarán', o: state.gastoNuevo ? 'Gasto desde PDF' : 'Subida manual', d: state.gastoNuevo ? '12 ago 2026' : '02 ago 2026' },
        { n: 'contrato-nortex-2026.pdf', t: 'Otro', o: 'Subida manual', d: '21 jul 2026' }
      ];

      return pageHead('Documentos', 'Cada archivo se guarda una vez y queda protegido: solo se descarga desde aquí, con tu sesión y tu permiso comprobados en cada intento.') +
        card('<div class="fdemo-card-head"><div><h2 class="fdemo-card-title">' + 'Nuevo gasto desde PDF' + '</h2>' +
             '<p class="fdemo-card-subtitle">' + 'También puedes crearlo a mano — este camino solo te ahorra teclear.' + '</p></div></div>',
             '<div class="fdemo-doc-body">' + cuerpo +
             '<p class="fdemo-doc-nota">' + 'Así funciona en el sistema real. Aquí lo ves con un documento de ejemplo: esta demo no sube ningún fichero tuyo ni guarda nada.' + '</p></div>') +
        card(cardHead('Archivo', 'Los documentos subidos, con su tipo y su origen'),
             '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr><th>' + 'Documento' + '</th><th>' + 'Tipo' + '</th><th>' + 'Origen' + '</th><th>' + 'Fecha' + '</th></tr></thead><tbody>' +
             archivo.map(function (a) {
               return '<tr><td>' + esc(a.n) + '</td><td>' + pill(a.t) + '</td><td class="is-muted">' + esc(a.o) + '</td><td class="is-muted">' + esc(a.d) + '</td></tr>';
             }).join('') + '</tbody></table></div>' +
             '<p class="fdemo-doc-nota">' + 'Tipos que reconoce el sistema: presupuesto, pedido, albarán, factura, gasto, ticket, justificante y otro.' + '</p>');
    };

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
        partes.push('<p class="fdemo-ans-sig"><b>Qué significa.</b> ' + esc(r.significado) + '</p>');
      }
      if (r.revisar && r.revisar.length) {
        partes.push('<div class="fdemo-ans-rev"><p class="fdemo-ans-rev-t">Qué revisar</p><ul>' +
          r.revisar.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>');
      }
      if (r.refs && r.refs.length) {
        partes.push('<div class="fdemo-ia-refs"><span class="fdemo-ia-refs-t">Sale de:</span>' +
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
      var chip = { nombre: 'facturas-proveedor-agosto.csv', peso: '1 KB', leido: '✓ ' + 'Tabla CSV (3 filas, 7 columnas)' };
      var totalDoc = DOC_FILAS.reduce(function (s, f) { return s + f.v; }, 0);
      var registrado = FS.listGastos().reduce(function (s, g) { return s + g.importe; }, 0);
      state.ia.mensajes.push({ autor: 'usuario', texto: '¿Qué contiene este fichero y cómo encaja con los datos de la empresa?', chip: chip });
      state.ia.mensajes.push({ autor: 'ia', resp: {
        chip: chip,
        grupoT: 'Por «proveedor»' + ' · ' + 'facturas-proveedor-agosto.csv',
        conclusion: 'El documento suma 2.542,00 €. Aquí hay registrados ' + EUR(registrado) + ' de gasto. Sus categorías no coinciden con las que usa Finance, así que no puedo cruzarlas línea a línea. Y no sé si ya está registrado o si es adicional: si es adicional, esos importes se sumarían al gasto; si es un extracto de lo que ya hay, sirve para contrastar.',
        datos: DOC_FILAS.map(function (f) {
          return { k: f.p, v: EUR(f.v), n: Math.round(f.v / totalDoc * 1000) / 10 + ' % · ' + '1 fila' };
        }),
        significado: 'El lector abre el fichero, entiende su estructura, suma, agrupa por la columna que identifica al proveedor y lo contrasta con lo registrado. Lo que no hace es dar de alta esas líneas: eso se hace en Documentos, factura a factura y con revisión.',
        revisar: ['Si el documento es adicional, esos 2.542,00 € se sumarían al gasto registrado.'],
        refs: [{ type: 'documentos', id: '', label: 'Documentos' }],
        motor: 'Leído aquí mismo, en tu navegador'
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
        '<p class="fdemo-ask-kicker">Inteligencia financiera</p>' +
        '<h1 class="fdemo-ask-title">Pregunta a Finanzas</h1>' +
        '<p class="fdemo-ask-sub">Pregúntale al sistema qué está pasando en tu empresa. <span class="fdemo-ask-sub-extra">Contesta con tus propios datos y enseña de dónde ha sacado cada cifra.</span></p>' +
        '</header>' +
        '<div class="fdemo-ask-thread" data-role="ia-thread"><div class="fdemo-ia-msgs">' +
        state.ia.mensajes.map(mensajeHtml).join('') +
        '</div></div>' +
        '<form class="fdemo-ask-form" data-role="ia-form">' +
        '<input class="fdemo-input" type="text" name="pregunta" aria-label="Escribe tu pregunta" placeholder="¿Qué está pasando?" autocomplete="off" maxlength="200">' +
        '<button type="submit" class="fdemo-btn variant-primary">Preguntar</button>' +
        '</form>' +
        '<button type="button" class="fdemo-ask-clip" data-action="adjuntar">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M21 11.5 12.5 20a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '<span>Adjuntar un documento</span><i>PDF, Excel, CSV o imágenes</i></button>' +
        (chips ? '<div class="fdemo-ask-chips"><p class="fdemo-ask-chips-t">O prueba con una de estas:</p><div class="fdemo-ia-chips">' + chips + '</div></div>' : '') +
        '<p class="fdemo-ask-foot">Datos ficticios. En esta demo las respuestas se calculan aquí mismo, en tu navegador; el sistema real responde sobre los datos de tu empresa.</p>' +
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
      var docEl = e.target.closest('[data-action="doc"]');
      if (docEl) {
        e.preventDefault();
        var q = docEl.getAttribute('data-doc');
        if (q === 'digital' || q === 'escaneado') {
          state.doc.archivo = q === 'digital' ? 'FP-2026-0441-belmonte.pdf' : 'ticket-viajes-meridiano.pdf';
          docPaso('analizando');
          clearTimeout(state.doc.t);
          state.doc.t = setTimeout(function () { docPaso(q === 'digital' ? 'detectado' : 'escaneado'); }, 1400);
        } else if (q === 'crear') {
          state.gastoNuevo = {
            id: 'doc-gas-1', proveedor: 'Suministros Belmonte S.L.', importe: 498.52, iva: 86.52,
            fecha: '2026-08-12', concepto: 'Material de oficina y consumibles', categoria: 'Material de oficina',
            estadoRevision: 'Pendiente revisión', proyectoRecordId: null, notasRevision: null,
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
        input.value = '';
        var encontrada = FS.matchQuestion ? FS.matchQuestion(texto) : null;
        if (encontrada) {
          state.ia.mensajes.push({ autor: 'usuario', texto: texto });
          state.ia.mensajes.push({ autor: 'ia', resp: encontrada.a() });
        } else {
          // Sin coincidencia no se improvisa: se dice lo que esta demo puede
          // contestar y lo que hace el sistema real, que no es lo mismo.
          state.ia.mensajes.push({ autor: 'usuario', texto: texto });
          state.ia.mensajes.push({ autor: 'ia', resp: { conclusion: 'Esta demo tiene seis preguntas preparadas y esa no se le parece, así que no me la invento. El sistema real responde en abierto sobre los datos de tu empresa. Prueba con una de las de abajo.', datos: [], refs: [] } });
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
      if (tourTxtEl) tourTxtEl.textContent = tour.on ? 'Recorrido automático' : 'Lo llevas tú';
      if (tourBtnEl) tourBtnEl.setAttribute('title', tour.on ? 'Parar el recorrido y navegar tú' : 'Volver al recorrido automático');
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
