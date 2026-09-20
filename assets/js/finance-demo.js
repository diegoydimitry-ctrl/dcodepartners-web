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
    { id: 'dashboard', label: 'Dashboard', grupo: 'dia', icono: 'dashboard' },
    { id: 'tesoreria', label: 'Tesorería', grupo: 'dia', icono: 'dashboard' },
    { id: 'facturas', label: 'Facturas', grupo: 'dia', icono: 'facturas' },
    { id: 'cobros', label: 'Cobros', grupo: 'dia', icono: 'cobros' },
    { id: 'por-facturar', label: 'Por facturar', grupo: 'dia', icono: 'facturas' },
    { id: 'gastos', label: 'Gastos', grupo: 'dia', icono: 'gastos' },
    { id: 'pagos', label: 'Pagos', grupo: 'dia', icono: 'gastos' },
    { id: 'duplicados', label: 'Duplicados', grupo: 'dia', icono: 'gastos' },
    { id: 'documentos', label: 'Documentos', grupo: 'dia', icono: 'documentos' },
    { id: 'presupuestos', label: 'Presupuestos', grupo: 'negocio', icono: 'presupuestos' },
    { id: 'pedidos', label: 'Pedidos', grupo: 'negocio', icono: 'pedidos' },
    { id: 'albaranes', label: 'Albaranes', grupo: 'negocio', icono: 'albaranes' },
    { id: 'clientes', label: 'Clientes', grupo: 'negocio', icono: 'clientes' },
    { id: 'proveedores', label: 'Proveedores', grupo: 'negocio', icono: 'proveedores' },
    { id: 'proyectos', label: 'Proyectos', grupo: 'negocio', icono: 'proyectos' },
    { id: 'radar', label: 'Radar', grupo: 'inteligencia', icono: 'dashboard' },
    { id: 'objetivos', label: 'Objetivos', grupo: 'inteligencia', icono: 'objetivos' },
    { id: 'historico', label: 'Histórico', grupo: 'inteligencia', icono: 'dashboard' },
    { id: 'ia', label: 'Pregunta a Finanzas', grupo: 'inteligencia', icono: 'ia' },
    { id: 'auditoria', label: 'Auditoría', grupo: 'administracion', icono: 'auditoria' },
    { id: 'verifactu', label: 'Registro fiscal', grupo: 'administracion', icono: 'auditoria' },
    { id: 'usuarios', label: 'Usuarios', grupo: 'administracion', icono: 'usuarios' },
    { id: 'impuestos', label: 'Impuestos', grupo: 'administracion', icono: 'dashboard' },
    { id: 'gestoria', label: 'Tu gestoría', grupo: 'administracion', icono: 'facturas' },
    { id: 'configuracion', label: 'Configuración', grupo: 'administracion', icono: 'configuracion' }
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
  var CHEVRON_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function dash(v) { return (v === null || v === undefined || v === '') ? '—' : v; }

  // ---------------------------------------------------------------
  // estadoVisual -- mismo mapeo que src/components/ui/StatusPill.tsx
  // ---------------------------------------------------------------
  function estadoVisual(valor) {
    var v = (valor || '').toLowerCase();
    function any(list) { return list.some(function (s) { return v.indexOf(s) !== -1; }); }
    if (any(['pagada', 'pagado', 'cobrado', 'aceptada', 'aprobado', 'activo', 'activa', 'entregado', 'registrada', 'al d\u00eda', 'paid', 'collected', 'accepted', 'approved', 'active', 'delivered', 'registered'])) return 'success';
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
    var PRIO = { P0: 'Urgente', P1: 'Importante', P2: 'Revisar', P3: 'Pendiente' };
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
      return '<' + (o.vista ? 'a href="#' + o.vista + '" data-action="nav" data-view="' + o.vista + '"' : 'div') +
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
        kpi2({ hero: 1, tono: 'positivo', label: 'Cobrado', valor: EUR(s.totalCobrado),
              hint: 'dinero que ya ha entrado · todo el histórico', serie: cobrados, vista: 'cobros' }) +
        kpi2({ hero: 1, tono: s.totalPendiente > 0 ? 'aviso' : 'neutro', label: 'Pendiente de cobro',
              valor: EUR(s.totalPendiente),
              hint: s.dso === null ? 'emitido y todavía sin cobrar' : 'emitido y sin cobrar · se tarda {d} días de mediana'.replace('{d}', s.dso), vista: 'cobros' }) +
        kpi2({ hero: 1, tono: s.totalVencido > 0 ? 'critico' : 'neutro', label: 'Vencido',
              valor: EUR(s.totalVencido),
              delta: s.totalPendiente > 0 ? { sube: true, bueno: s.totalVencido === 0,
                texto: Math.round((s.totalVencido / s.totalPendiente) * 1000) / 10 + ' % de lo pendiente' } : null,
              hint: s.totalVencido > 0 ? 'pasado de fecha · reclámalo' : 'nada pasado de fecha', vista: 'cobros' }) +
        '</div>' +
        '<div class="fdemo-kpi-tira">' +
        kpi2({ tono: s.resultadoMes >= 0 ? 'positivo' : 'critico', label: 'Resultado del mes',
              valor: EUR(s.resultadoMes), serie: resultados,
              delta: { sube: dif > 0 ? true : dif < 0 ? false : null, bueno: dif >= 0,
                       texto: EUR(Math.abs(dif)) + ' vs el mes anterior' },
              hint: 'facturado menos gastado, este mes' }) +
        (s.sinFacturar > 0 ? kpi2({ tono: 'aviso', label: 'Sin facturar', valor: EUR(s.sinFacturar),
              hint: 'aceptado y aún sin factura', vista: 'presupuestos' }) : '') +
        kpi2({ label: 'Facturado', valor: EUR(s.totalFacturado), hint: 'todo el histórico', vista: 'facturas' }) +
        kpi2({ label: 'Gastos', valor: EUR(s.totalGastos), hint: 'todo el histórico', vista: 'gastos' }) +
        kpi2({ label: 'Facturado − Gastos', valor: EUR(s.margen), hint: 'no es beneficio · {p} sin cobrar'.replace('{p}', EUR(s.totalPendiente)) }) +
        kpi2({ label: 'Vence en 30 días', valor: EUR(s.venceEn30), hint: 'sin contar lo ya vencido' }) +
        kpi2({ label: 'Proyectos activos', valor: String(s.proyectosActivos), hint: 'en curso ahora mismo', vista: 'proyectos' }) +
        '</div>';

      // ── la caja ──
      var caja = card(
        cardHead('Previsión de caja · 30 días', 'variación de caja: el saldo del banco no está en el sistema'),
        '<div class="fdemo-card-body is-tight"><div class="fdemo-kpi-tira es-3">' +
        kpi2({ tono: 'positivo', label: 'Va a entrar', valor: EUR(prev.entra), hint: 'facturas con fecha en los próximos 30 días' }) +
        kpi2({ tono: 'aviso', label: 'Va a salir', valor: EUR(prev.sale), hint: 'gastos con vencimiento en los próximos 30 días' }) +
        kpi2({ tono: prev.neto >= 0 ? 'positivo' : 'critico', label: 'Neto', valor: EUR(prev.neto),
              hint: prev.neto >= 0 ? 'entra más de lo que sale' : 'sale más de lo que entra' }) +
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
        : '<div class="fdemo-senal-ok"><span class="fdemo-senal-ok-filo"></span>Hoy no hay nada urgente.</div>';

      // ── cómo va el negocio ──
      var maxEv = Math.max.apply(null, ev.map(function (m) { return Math.max(m.cobrado, m.gastos); })) || 1;
      var barras = '<div class="fdemo-barras" role="img" aria-label="Evolución de cobros y gastos de los últimos doce meses">' +
        ev.map(function (m) {
          return '<div class="fdemo-barra-col"><div class="fdemo-barra-par">' +
            '<i class="b-cob" style="height:' + ((m.cobrado / maxEv) * 100).toFixed(1) + '%" title="' + esc(m.etiqueta + ': ' + EUR(m.cobrado)) + '"></i>' +
            '<i class="b-gas" style="height:' + ((m.gastos / maxEv) * 100).toFixed(1) + '%" title="' + esc(m.etiqueta + ': ' + EUR(m.gastos)) + '"></i>' +
            '</div><span class="fdemo-barra-et">' + esc(m.etiqueta) + '</span></div>';
        }).join('') + '</div>' +
        '<div class="fdemo-leyenda"><span><i class="b-cob"></i>Cobrado</span><span><i class="b-gas"></i>Gastos</span></div>';

      var deuda = card(cardHead('Antigüedad de la deuda', 'Cuánto te deben y desde hace cuánto'),
        '<div class="fdemo-card-body"><p class="fdemo-total">' + EUR(ant.total) + '</p>' +
        '<div class="fdemo-apilada">' + ant.tramos.map(function (t) {
          return '<i class="n-' + t.nivel + '" style="width:' + t.pct + '%" title="' + esc(t.etiqueta) + '"></i>';
        }).join('') + '</div>' +
        '<ul class="fdemo-ley-v">' + ant.tramos.map(function (t) {
          return '<li><span class="pt n-' + t.nivel + '"></span><span class="et">' + esc(t.etiqueta) + '</span>' +
                 '<span class="nu">' + EUR(t.total) + '</span></li>';
        }).join('') + '</ul></div>');

      var conc = card(cardHead('De quién depende tu facturación', 'Reparto del total facturado por cliente'),
        '<div class="fdemo-card-body"><ul class="fdemo-conc">' + con.filas.map(function (f) {
          return '<li><span class="nom">' + esc(f.cliente) + '</span>' +
            '<span class="ba"><i style="width:' + f.pct + '%"></i></span>' +
            '<span class="pc">' + f.pct + ' %</span></li>';
        }).join('') + '</ul>' +
        (con.riesgo ? '<p class="fdemo-nota-riesgo">{c} concentra el {p} % de tu facturación. Si se va, se va esa parte del negocio.</p>'.replace('{c}', esc(con.riesgo.cliente)).replace('{p}', con.riesgo.pct) : '') +
        '</div>');

      // ── registro ──
      var act = FS.getActividad(8);
      var actividad = card(cardHead('Actividad reciente', 'Facturas, gastos y cobros más recientes'),
        '<div>' + act.map(function (a) {
          return '<a class="fdemo-activity-row" href="#' + a.vista + '/' + a.id + '">' +
            '<div class="fdemo-activity-main"><div class="fdemo-activity-text">' + esc(a.texto) + ' · ' + EUR(a.importe) + '</div>' +
            '<div class="fdemo-activity-meta">' + esc(a.tipo) + ' · ' + FDATE(a.fecha) + '</div></div>' +
            pill(a.estado) + '</a>';
        }).join('') + '</div>');

      /* El boton de planes va AQUI, en la primera pantalla y a la altura del
         titulo. Quien esta mirando el panel es quien esta decidiendo si esto
         le vale: mandarle a buscar el precio al pie de la pagina es perderle. */
      var hrefPlanes = useHash ? (root.getAttribute('data-exit-href') || '/sistema-financiero') + '#planes' : '#planes';
      return '<div class="fdemo-panel">' +
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Situación</p>' +
        '<h1 class="fdemo-page-title">Panel financiero</h1></div>' +
        '<div class="fdemo-panel-acts">' +
        '<p class="fdemo-calc">calculado ahora · ' + FDATE(s.fechaCalculo) + '</p>' +
        '<a class="fdemo-btn variant-primary fdemo-planes-b" href="' + hrefPlanes + '"' +
        (useHash ? '' : ' data-action="planes"') + '>' +
        '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">' +
        '<path d="M5 12h14m0 0-5-5m5 5-5 5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        'Ver planes y precios</a></div></div>' +
        narrativa +
        seccion('El dinero', 'qué ha entrado, qué te deben y qué se ha pasado de fecha', dinero, 0) +
        seccion('La caja', 'qué entra y qué sale en los próximos 30 días', caja, 1) +
        seccion('Qué mirar hoy', 'lo que pide una decisión, por orden de urgencia', hoy, 2) +
        seccion('Cómo va el negocio', 'tendencia, de quién dependes y qué te deben',
          card(cardHead('Evolución mensual', 'Dinero cobrado frente a dinero gastado, mes a mes'), '<div class="fdemo-card-body">' + barras + '</div>') +
          '<div class="fdemo-dos">' + deuda + conc + '</div>', 3) +
        seccion('Registro', 'lo último que ha pasado', actividad, 4) +
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

      /* El calendario: la misma cuenta, pero semana a semana y con nombre y
         apellidos. Un neto a treinta dias no sirve para decidir; saber que la
         semana que viene salen 4.200 y no entra nada, si. */
      var semanas = [];
      for (var w = 0; w < 6; w++) {
        var ini2 = Date.parse(FS.hoy) + w * 7 * 86400000;
        var fin2 = ini2 + 7 * 86400000;
        var entra = [], sale = [];
        fac.forEach(function (x) {
          var t = Date.parse(x.fechaVencimiento);
          if (t >= ini2 && t < fin2) entra.push({ q: x.clienteNombre, v: FS.pendienteDe(x), id: x.id, tipo: 'facturas' });
        });
        gas.forEach(function (g) {
          var t = Date.parse(g.fechaVencimiento);
          if (t >= ini2 && t < fin2) sale.push({ q: g.proveedor, v: g.importe, tipo: 'pagos' });
        });
        var e = entra.reduce(function (a, x) { return a + x.v; }, 0);
        var sl = sale.reduce(function (a, x) { return a + x.v; }, 0);
        semanas.push({ w: w, ini: new Date(ini2).toISOString().slice(0, 10), entra: e, sale: sl,
                       neto: Math.round((e - sl) * 100) / 100, nE: entra.length, nS: sale.length,
                       quien: (entra[0] || sale[0] || {}).q || null });
      }
      var maxSem = Math.max.apply(null, semanas.map(function (x) { return Math.max(x.entra, x.sale); }).concat([1]));
      var filasSem = semanas.map(function (x) {
        return '<tr><td><b>' + (x.w === 0 ? 'Esta semana' : 'En ' + x.w + ' semana' + (x.w > 1 ? 's' : '')) + '</b>' +
          '<span class="fdemo-pct">desde el ' + FDATE(x.ini) + '</span></td>' +
          '<td class="is-right">' + EUR(x.entra) + '<span class="fdemo-pct">' + x.nE + ' cobro(s)</span></td>' +
          '<td class="is-right">' + EUR(x.sale) + '<span class="fdemo-pct">' + x.nS + ' pago(s)</span></td>' +
          '<td class="is-right ' + (x.neto < 0 ? 'es-mal' : '') + '"><b>' + EUR(x.neto) + '</b></td>' +
          '<td style="min-width:150px;"><div class="fdemo-apilada">' +
          '<i class="n-ok" style="width:' + Math.round((x.entra / maxSem) * 100) + '%"></i>' +
          '<i class="n-serio" style="width:' + Math.round((x.sale / maxSem) * 100) + '%"></i></div></td></tr>';
      }).join('');

      var negativas = semanas.filter(function (x) { return x.neto < 0; });

      return '<div class="fdemo-panel">' +
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Caja</p>' +
        '<h1 class="fdemo-page-title">Tesorería</h1>' +
        '<p class="fdemo-page-sub">Lo que entra y lo que sale según las fechas de tus propios documentos.</p></div></div>' +
        '<div class="fdemo-kpi-tira es-4">' +
        kpi2({ hero: true, tono: prev.neto >= 0 ? 'positivo' : 'critico', label: 'Neto a 30 días', valor: EUR(prev.neto),
               hint: 'lo que entra menos lo que sale' }) +
        kpi2({ tono: 'positivo', label: 'Por entrar', valor: EUR(prev.entra), hint: 'facturas que vencen', vista: 'cobros' }) +
        kpi2({ tono: 'aviso', label: 'Por salir', valor: EUR(prev.sale), hint: 'gastos que vencen', vista: 'pagos' }) +
        kpi2({ tono: negativas.length ? 'critico' : 'positivo', label: 'Semanas en rojo', valor: String(negativas.length),
               hint: 'de las seis próximas' }) +
        '</div>' +
        seccion('Semana a semana', 'porque un neto a treinta días no sirve para decidir nada',
          card('', tablaSimple([{t:'Semana'},{t:'Entra',r:1},{t:'Sale',r:1},{t:'Neto',r:1},{t:''}], filasSem, '')), 1) +
        seccion('A treinta, sesenta y noventa días', 'con el escenario prudente al lado',
          '<div class="fdemo-dos-3">' + horizontes.map(function (h) {
            return card(cardHead('Próximos {d} días'.replace('{d}', h.d), 'según vencimientos'),
              '<div class="fdemo-card-body"><div class="fdemo-kpi-tira es-3">' +
              kpi2({ tono: 'positivo', label: 'Entra', valor: EUR(h.entra) }) +
              kpi2({ tono: 'aviso', label: 'Sale', valor: EUR(h.sale) }) +
              kpi2({ tono: h.neto >= 0 ? 'positivo' : 'critico', label: 'Neto', valor: EUR(h.neto) }) +
              '</div><p class="fdemo-esc">Escenario prudente, descontando lo ya vencido: <b>' + EUR(h.prudente) + '</b></p></div>');
          }).join('') + '</div>', 2) +
        aviso('Esto es VARIACIÓN de caja, no saldo: el saldo del banco no está en el sistema y no se inventa. El escenario prudente descuenta lo que ya está fuera de plazo, porque contar con ello es lo que convierte una previsión en un susto.') +
        '</div>';
    };

    /* POR FACTURAR. Presupuesto aceptado sin factura emitida: trabajo hecho
       que todavía no se ha pedido cobrar. */
    /* DINERO QUE AUN NO HE FACTURADO. Es la pantalla que mas dinero mueve en
       una pyme y la que ningun competidor de este segmento pone delante: no
       un informe que haya que ir a buscar, sino cuatro cubos con su motivo
       escrito y la accion al lado de cada linea. */
    RENDERERS['por-facturar'] = function () {
      var pres = FS.listPresupuestos();
      var aceptSinFactura = pres.filter(function (p) { return p.aceptadaPorCliente && !p.facturaGeneradaId; });
      var proy = FS.listProyectos().filter(function (p) { return p.estado === 'Entregado'; });
      var entregadoSinFactura = proy.slice(0, 3);
      var comprometido = pres.filter(function (p) { return p.estado === 'Enviada'; });

      var tAcept = aceptSinFactura.reduce(function (a, p) { return a + p.importe; }, 0);
      var tEntreg = entregadoSinFactura.reduce(function (a, p) { return a + (p.importeFacturado || p.presupuesto || 3400); }, 0);
      var tComp = comprometido.reduce(function (a, p) { return a + p.importe; }, 0);
      var listo = tAcept + tEntreg;

      function filaDoc(codigo, quien, que, cuando, importe, motivo, tono) {
        return '<tr><td><code>' + esc(codigo) + '</code></td>' +
          '<td>' + esc(quien) + '</td>' +
          '<td class="is-muted">' + esc(que) + '</td>' +
          '<td class="is-muted">' + cuando + '</td>' +
          '<td class="is-right">' + EUR(importe) + '</td>' +
          '<td>' + pill(motivo) + '</td>' +
          '<td class="is-right"><button type="button" class="fdemo-btn-mini" data-action="plan">Facturar</button></td></tr>';
      }
      var filasListo = aceptSinFactura.map(function (p, i) {
        return filaDoc('PR-' + String(2100 + i * 3), p.empresa, p.servicios || p.resumen,
          FDATE(p.fechaAceptacion || p.fechaGeneracion), p.importe, 'Aceptada');
      }).concat(entregadoSinFactura.map(function (p, i) {
        return filaDoc('PY-' + String(3100 + i * 4), p.empresa, p.nombre,
          FDATE(p.fechaEntregaReal || p.fechaEntregaPrevista), (p.importeFacturado || p.presupuesto || 3400), 'Entregado');
      })).join('');
      var filasComp = comprometido.map(function (p, i) {
        return '<tr><td><code>' + 'PD-' + String(4100 + i * 5) + '</code></td>' +
          '<td>' + esc(p.empresa) + '</td>' +
          '<td class="is-muted">' + esc(p.servicios || p.resumen) + '</td>' +
          '<td class="is-muted">' + FDATE(p.fechaGeneracion) + '</td>' +
          '<td class="is-right">' + EUR(p.importe) + '</td>' +
          '<td>' + pill('Enviada') + '</td></tr>';
      }).join('');

      return '<div class="fdemo-panel">' +
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Dinero sin pedir</p>' +
        '<h1 class="fdemo-page-title">Dinero que aún no has facturado</h1>' +
        '<p class="fdemo-page-sub">Trabajo que ya has hecho, o que el cliente ya ha aceptado, y que todavía no ha llegado a ser una factura.</p></div></div>' +
        '<div class="fdemo-kpi-tira es-4">' +
        kpi2({ hero: true, tono: listo > 0 ? 'aviso' : 'neutro', label: 'Listo para facturar', valor: EUR(listo),
               hint: (aceptSinFactura.length + entregadoSinFactura.length) + ' documentos esperando' }) +
        kpi2({ label: 'Aceptado sin factura', valor: EUR(tAcept), hint: aceptSinFactura.length + ' presupuesto(s)' }) +
        kpi2({ label: 'Entregado sin facturar', valor: EUR(tEntreg), hint: entregadoSinFactura.length + ' proyecto(s)' }) +
        kpi2({ tono: 'neutro', label: 'Comprometido sin entregar', valor: EUR(tComp), hint: 'todavía no es facturable' }) +
        '</div>' +
        seccion('Se puede facturar hoy', 'qué está esperando solo a que alguien emita la factura',
          card('', tablaSimple([{t:'Doc.'},{t:'Cliente'},{t:'Trabajo'},{t:'Fecha'},{t:'Importe',r:1},{t:'Motivo'},{t:'',r:1}],
            filasListo, 'Todo lo aceptado y lo entregado ya está facturado.')), 1) +
        seccion('Comprometido, aún no entregado', 'trabajo aceptado que todavía no es facturable',
          card('', tablaSimple([{t:'Doc.'},{t:'Cliente'},{t:'Trabajo'},{t:'Enviado'},{t:'Importe',r:1},{t:'Estado'}],
            filasComp, 'No hay nada comprometido sin entregar.')), 2) +
        aviso('Cada línea sale de un documento real —un presupuesto aceptado, un proyecto entregado—, no de una estimación. Por eso se puede facturar desde aquí sin volver a mirar nada.') +
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
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Cuentas por pagar</p>' +
        '<h1 class="fdemo-page-title">Pagos</h1>' +
        '<p class="fdemo-page-sub">{n} pendientes · {t}'.replace('{n}', pendientes.length).replace('{t}', EUR(pendientes.reduce(function (a, g) { return a + g.importe; }, 0))) + '</p></div></div>' +
        card('', tablaSimple([{t:'Proveedor'},{t:'Concepto'},{t:'Vence'},{t:'Importe',r:1},{t:'Estado'}], filas, '')) +
        '</div>';
    };

    /* DUPLICADOS. Mismo proveedor, mismo importe, pocos días de diferencia.
       La regla está escrita aquí y se puede discutir; una puntuación no. */
    /* DUPLICADOS. La regla esta escrita y se puede discutir, que es mas de lo
       que se puede hacer con una puntuacion. Arriba, el dinero en juego: eso
       es lo que convierte una lista en una decision. */
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
      var seguros = pares.filter(function (p) { return p.d <= 3; });
      var posibles = pares.filter(function (p) { return p.d > 3; });
      var enJuego = pares.reduce(function (a, p) { return a + p.a.importe; }, 0);

      function filas(lista) {
        return lista.map(function (p) {
          return '<tr><td>' + esc(p.a.proveedor) + '</td>' +
            '<td class="is-muted">' + esc(p.a.concepto) + '</td>' +
            '<td class="is-muted">' + FDATE(p.a.fechaGasto) + ' · ' + FDATE(p.b.fechaGasto) + '</td>' +
            '<td class="is-muted is-right">' + p.d + ' día(s)</td>' +
            '<td class="is-right">' + EUR(p.a.importe) + '</td>' +
            '<td>' + pill(p.d <= 3 ? 'Probable' : 'Posible') + '</td>' +
            '<td class="is-right"><button type="button" class="fdemo-btn-mini" data-action="plan">Marcar revisado</button></td></tr>';
        }).join('');
      }
      var REGLAS = [
        ['Mismo proveedor', 'Se compara el proveedor dado de alta, no el texto del concepto.'],
        ['Mismo importe al céntimo', 'Sin margen de tolerancia: 412,00 € y 412,01 € no son el mismo gasto.'],
        ['Menos de diez días entre los dos', 'Por encima de eso suele ser una cuota recurrente, no un duplicado.'],
        ['Probable o posible', 'Tres días o menos, probable. Entre cuatro y diez, posible: merece una mirada, no una alarma.']
      ];

      return '<div class="fdemo-panel">' +
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Control</p>' +
        '<h1 class="fdemo-page-title">Duplicados</h1>' +
        '<p class="fdemo-page-sub">Gastos que se parecen demasiado entre sí como para no mirarlos.</p></div></div>' +
        '<div class="fdemo-kpi-tira es-3">' +
        kpi2({ hero: true, tono: enJuego > 0 ? 'aviso' : 'positivo', label: 'Dinero en juego', valor: EUR(enJuego),
               hint: 'lo que costaría pagarlos dos veces' }) +
        kpi2({ tono: seguros.length ? 'critico' : 'neutro', label: 'Probables', valor: String(seguros.length), hint: 'tres días o menos de diferencia' }) +
        kpi2({ label: 'Posibles', valor: String(posibles.length), hint: 'entre cuatro y diez días' }) +
        '</div>' +
        seccion('Probables', 'coinciden en proveedor, importe y fecha casi exacta',
          card('', tablaSimple([{t:'Proveedor'},{t:'Concepto'},{t:'Fechas'},{t:'Distancia',r:1},{t:'Importe',r:1},{t:'Estado'},{t:'',r:1}],
            filas(seguros), 'Ningún gasto coincide tanto como para sospechar.')), 1) +
        seccion('Posibles', 'coinciden en varias cosas; merecen una mirada, no una alarma',
          card('', tablaSimple([{t:'Proveedor'},{t:'Concepto'},{t:'Fechas'},{t:'Distancia',r:1},{t:'Importe',r:1},{t:'Estado'},{t:'',r:1}],
            filas(posibles), 'Nada más se parece lo suficiente.')), 2) +
        seccion('La regla, escrita', 'para que se pueda discutir en vez de creer',
          card('', '<div class="fdemo-card-body"><ul class="fdemo-hace">' +
            REGLAS.map(function (r) { return '<li><b>' + esc(r[0]) + '.</b> ' + esc(r[1]) + '</li>'; }).join('') +
            '</ul></div>'), 3) +
        aviso('Ni puntuación, ni modelo, ni caja negra: si un gasto salta, se puede leer exactamente por qué. Y si la regla no encaja con cómo trabajáis, se cambia.') +
        '</div>';
    };

    /* RADAR. Tres reglas, las tres con su umbral escrito al lado. */
    /* RADAR. Lo que hay que mirar hoy, ordenado por lo que cuesta no mirarlo.
       Cada aviso trae SU REGLA escrita al lado: un aviso que no se puede
       discutir no es un aviso, es una supersticion. */
    RENDERERS.radar = function () {
      var gas = FS.listGastos(), s = FS.getDashboardSnapshot(), con = FS.getConcentracion();
      var ant = FS.getAntiguedad(), ev = FS.getEvolucion();
      var avisos = [];

      var porProv = {};
      gas.forEach(function (g) { (porProv[g.proveedor] = porProv[g.proveedor] || []).push(g); });
      Object.keys(porProv).forEach(function (k) {
        var l = porProv[k].slice().sort(function (a, b) { return a.fechaGasto < b.fechaGasto ? -1 : 1; });
        if (l.length < 2) return;
        var ult = l[l.length - 1], pen = l[l.length - 2];
        if (pen.importe > 0 && ult.importe / pen.importe >= 1.15) {
          avisos.push({ n: 'aviso', regla: 'Subida de precio',
            umbral: 'salta por encima del 15 % respecto al gasto anterior del mismo proveedor',
            t: '{p} ha subido un {x} % respecto al gasto anterior'.replace('{p}', k).replace('{x}', Math.round((ult.importe / pen.importe - 1) * 100)),
            d: EUR(pen.importe) + ' → ' + EUR(ult.importe), vista: 'gastos' });
        }
      });
      if (s.totalVencido > 0) avisos.push({ n: 'critico', regla: 'Vencido',
        umbral: 'cualquier factura emitida cuya fecha de vencimiento ya ha pasado',
        t: '{n} facturas pasadas de fecha sin cobrar'.replace('{n}', s.nVencidas),
        d: EUR(s.totalVencido), vista: 'cobros' });
      var viejo = ant.tramos && ant.tramos.filter(function (t) { return t.etiqueta === 'Más de 60 días'; })[0];
      if (viejo && viejo.n) avisos.push({ n: 'critico', regla: 'Deuda vieja',
        umbral: 'facturas con más de sesenta días desde su vencimiento',
        t: '{n} factura(s) llevan más de dos meses sin cobrar'.replace('{n}', viejo.n),
        d: EUR(viejo.total), vista: 'cobros' });
      if (con.riesgo) avisos.push({ n: 'serio', regla: 'Concentración',
        umbral: 'salta cuando un solo cliente pasa del 30 % de lo facturado',
        t: '{c} concentra el {p} % de la facturación'.replace('{c}', con.riesgo.cliente).replace('{p}', con.riesgo.pct),
        d: con.riesgo.pct + ' %', vista: 'clientes' });
      var revisar = gas.filter(function (g) { return g.estadoRevision !== 'aprobado' && g.estadoRevision !== 'Aprobado'; });
      if (revisar.length) avisos.push({ n: 'aviso', regla: 'Sin revisar',
        umbral: 'gastos que nadie ha aprobado todavía',
        t: '{n} gasto(s) esperan a que alguien los revise'.replace('{n}', revisar.length),
        d: EUR(revisar.reduce(function (a, g) { return a + g.importe; }, 0)), vista: 'gastos' });
      var borr = FS.listFacturas().filter(function (f) { return f.estado === 'Borrador'; });
      if (borr.length) avisos.push({ n: 'aviso', regla: 'Sin emitir',
        umbral: 'facturas que siguen en borrador',
        t: '{n} factura(s) en borrador, sin enviar a nadie'.replace('{n}', borr.length),
        d: EUR(borr.reduce(function (a, f) { return a + f.importe; }, 0)), vista: 'facturas' });
      var m0 = ev[ev.length - 1], m1 = ev[ev.length - 2];
      if (m1 && m1.gastos > 0 && m0.gastos / m1.gastos >= 1.2) avisos.push({ n: 'serio', regla: 'Gasto al alza',
        umbral: 'salta cuando el gasto del mes sube más de un 20 % sobre el anterior',
        t: 'El gasto del mes va un {x} % por encima del mes pasado'.replace('{x}', Math.round((m0.gastos / m1.gastos - 1) * 100)),
        d: EUR(m1.gastos) + ' → ' + EUR(m0.gastos), vista: 'gastos' });

      var orden = { critico: 0, serio: 1, aviso: 2 };
      avisos.sort(function (a, b) { return orden[a.n] - orden[b.n]; });
      var nC = avisos.filter(function (a) { return a.n === 'critico'; }).length;
      var nS = avisos.filter(function (a) { return a.n === 'serio'; }).length;

      var tarjetas = avisos.map(function (a) {
        return '<article class="fdemo-senal p-' + (a.n === 'critico' ? 'P0' : a.n === 'serio' ? 'P1' : 'P2') + '">' +
          '<span class="fdemo-senal-filo"></span><div class="fdemo-senal-c">' +
          '<p class="fdemo-senal-et">' + esc(a.regla) + '</p>' +
          '<p class="fdemo-senal-t">' + esc(a.t) + '</p>' +
          '<p class="fdemo-senal-u">' + esc(a.umbral) + '</p></div>' +
          '<div class="fdemo-senal-lado"><p class="fdemo-senal-n">' + esc(a.d) + '</p>' +
          '<button type="button" class="fdemo-btn-mini" data-action="nav" data-view="' + a.vista + '">Ir</button></div></article>';
      }).join('');

      return '<div class="fdemo-panel">' +
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Inteligencia</p>' +
        '<h1 class="fdemo-page-title">Radar</h1>' +
        '<p class="fdemo-page-sub">Lo que conviene mirar hoy, ordenado por lo que cuesta no mirarlo.</p></div></div>' +
        '<div class="fdemo-kpi-tira es-3">' +
        kpi2({ hero: true, tono: nC ? 'critico' : 'positivo', label: 'Crítico', valor: String(nC), hint: 'cuesta dinero hoy' }) +
        kpi2({ tono: nS ? 'aviso' : 'neutro', label: 'Conviene saberlo', valor: String(nS), hint: 'no es urgente, es importante' }) +
        kpi2({ label: 'Avisos en total', valor: String(avisos.length), hint: 'de siete reglas escritas' }) +
        '</div>' +
        seccion('Hoy', 'cada aviso con el umbral que lo dispara',
          (tarjetas ? '<div class="fdemo-senales">' + tarjetas + '</div>'
                    : '<div class="fdemo-senal-ok"><span class="fdemo-senal-ok-filo"></span>Nada que señalar con los datos de hoy.</div>'), 1) +
        aviso('Siete reglas, y las siete con su umbral escrito al lado. Se pueden discutir y se pueden cambiar, que es más de lo que se puede hacer con una puntuación que nadie te explica.') +
        '</div>';
    };

    /* OBJETIVOS. Una métrica, un periodo y un mínimo. Y si vas a tiempo. */
    /* OBJETIVOS. Tres tarjetas y medio panel vacio no es un modulo: es un
       hueco. Seis metas, el historico de cada una contra su linea y la regla
       de calculo escrita, que es lo que separa un objetivo de un deseo. */
    RENDERERS.objetivos = function () {
      var ev = FS.getEvolucion(), s = FS.getDashboardSnapshot(), con = FS.getConcentracion();
      var mes = ev[ev.length - 1];
      var gastoMes = mes.gastos;
      var margenPct = s.totalFacturado > 0 ? Math.round((s.margen / s.totalFacturado) * 100) : 0;
      var topPct = con.filas && con.filas[0] ? con.filas[0].pct : 0;

      var metas = [
        { m: 'Cobrar cada mes',        actual: mes.cobrado,     meta: 15000, u: 'eur',  vista: 'cobros',
          regla: 'Suma de los cobros con fecha dentro del mes en curso.' },
        { m: 'Vencido por debajo de',  actual: s.totalVencido,  meta: 6000,  u: 'eur',  menos: true, vista: 'cobros',
          regla: 'Facturas emitidas cuya fecha de vencimiento ya ha pasado y siguen sin cobrar.' },
        { m: 'Días en cobrar',         actual: s.dso || 0,      meta: 30,    u: 'dias', menos: true, vista: 'cobros',
          regla: 'Mediana de días entre emisión y cobro de las facturas ya cobradas.' },
        { m: 'Margen sobre facturado', actual: margenPct,       meta: 25,    u: 'pct',  vista: 'proyectos',
          regla: 'Facturado menos gastado, dividido entre lo facturado. No es beneficio: no descuenta nóminas ni impuestos.' },
        { m: 'Gasto mensual por debajo de', actual: gastoMes,   meta: 12000, u: 'eur',  menos: true, vista: 'gastos',
          regla: 'Suma de los gastos con fecha dentro del mes en curso, con IVA incluido.' },
        { m: 'Ningún cliente por encima de', actual: topPct,    meta: 30,    u: 'pct',  menos: true, vista: 'clientes',
          regla: 'Porcentaje que representa el mayor cliente sobre el total facturado.' }
      ];

      function valor(g, v) { return g.u === 'eur' ? EUR(v) : g.u === 'dias' ? v + ' días' : v + ' %'; }
      var cumplidas = 0;
      var tarjetas = metas.map(function (g) {
        var bien = g.menos ? g.actual <= g.meta : g.actual >= g.meta;
        if (bien) cumplidas++;
        var pct = g.menos ? Math.min(100, Math.round((g.meta / Math.max(g.actual, 0.01)) * 100))
                          : Math.min(100, Math.round((g.actual / g.meta) * 100));
        return card(cardHead(g.m, (g.menos ? 'Objetivo: no pasar de {m}' : 'Objetivo: al menos {m}').replace('{m}', valor(g, g.meta))),
          '<div class="fdemo-card-body">' +
          '<p class="fdemo-total ' + (bien ? 'es-bien' : 'es-mal') + '">' + valor(g, g.actual) + '</p>' +
          '<div class="fdemo-apilada"><i class="' + (bien ? 'n-ok' : 'n-critico') + '" style="width:' + pct + '%"></i></div>' +
          '<p class="fdemo-kpi2-h">' + (bien ? 'Se cumple hoy.' : 'Hoy no se cumple.') + '</p>' +
          '<p class="fdemo-regla">' + esc(g.regla) + '</p>' +
          '<button type="button" class="fdemo-btn-mini" data-action="nav" data-view="' + g.vista + '">Ver de dónde sale</button>' +
          '</div>');
      }).join('');

      // El historico: la misma meta de cobro, mes a mes, contra su linea.
      var metaCobro = 15000;
      var filasHist = ev.slice(-6).reverse().map(function (m) {
        var ok = m.cobrado >= metaCobro;
        var pct = Math.min(100, Math.round((m.cobrado / metaCobro) * 100));
        return '<tr><td>' + esc(m.etiqueta) + '</td>' +
          '<td class="is-right">' + EUR(m.cobrado) + '</td>' +
          '<td class="is-right is-muted">' + EUR(metaCobro) + '</td>' +
          '<td style="min-width:160px;"><div class="fdemo-apilada"><i class="' + (ok ? 'n-ok' : 'n-critico') + '" style="width:' + pct + '%"></i></div></td>' +
          '<td>' + pill(ok ? 'Cumplido' : 'Por debajo') + '</td></tr>';
      }).join('');

      return '<div class="fdemo-panel">' +
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Inteligencia</p>' +
        '<h1 class="fdemo-page-title">Objetivos</h1>' +
        '<p class="fdemo-page-sub">Fijas a dónde quieres llegar y el sistema te dice si vas a tiempo — ' +
        cumplidas + ' de ' + metas.length + ' se cumplen hoy.</p></div>' +
        '<button type="button" class="fdemo-btn variant-secondary" data-action="plan">Añadir un objetivo</button></div>' +
        seccion('Dónde quieres llegar', 'seis metas, cada una con la regla con la que se mide',
          '<div class="fdemo-dos-3">' + tarjetas + '</div>', 1) +
        seccion('Cobro mensual, mes a mes', 'la misma meta contra los seis últimos meses',
          card('', tablaSimple([{t:'Mes'},{t:'Cobrado',r:1},{t:'Meta',r:1},{t:''},{t:'Estado'}], filasHist, '')), 2) +
        aviso('Los objetivos no disparan nada por su cuenta: aparecen en el Radar cuando se incumplen, y ahí es donde se deciden. Un objetivo que se cumple solo no es un objetivo.') +
        '</div>';
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
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Obligación fiscal</p>' +
        '<h1 class="fdemo-page-title">Registro fiscal · VERI*FACTU</h1></div></div>' +
        '<div class="fdemo-kpi-tira es-3">' +
        kpi2({ tono: 'positivo', label: 'La cadena', valor: 'Intacta', hint: '{n} facturas encadenadas'.replace('{n}', fac.length) }) +
        kpi2({ label: 'Fuera de la cadena', valor: '0', hint: 'ninguna factura sin registrar' }) +
        kpi2({ tono: 'positivo', label: 'En cola de remisión', valor: '0', hint: 'nada pendiente de enviar' }) +
        '</div>' +
        aviso('Cada factura lleva la huella de la anterior. Por eso se puede contestar a «enséñame que las has registrado todas» sin entrar en la base de datos.') +
        card(cardHead('Últimos eslabones', 'los catorce más recientes'), tablaSimple([{t:'Nº'},{t:'Emisión'},{t:'Importe',r:1},{t:'Huella'},{t:'Estado'}], filas, '')) +
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
      var provs = FS.listProveedores().map(function (p) {
        var g = gas.filter(function (x) { return x.proveedor === p.nombre; });
        var t = g.reduce(function (a, x) { return a + x.importe; }, 0);
        var sinPagar = g.filter(function (x) { return !x.pagado; });
        var ult = g.slice().sort(function (a, b) { return a.fechaGasto < b.fechaGasto ? 1 : -1; })[0];
        return { p: p, n: g.length, total: t, sinPagar: sinPagar.reduce(function (a, x) { return a + x.importe; }, 0),
                 ult: ult ? ult.fechaGasto : null };
      }).sort(function (a, b) { return b.total - a.total; });
      var gTotal = provs.reduce(function (a, x) { return a + x.total; }, 0);
      var debiendo = provs.reduce(function (a, x) { return a + x.sinPagar; }, 0);
      var top = provs[0];

      var filas = provs.map(function (x) {
        var pct = gTotal > 0 ? Math.round((x.total / gTotal) * 100) : 0;
        return '<tr><td><b>' + esc(x.p.nombre) + '</b></td>' +
          '<td class="is-muted">' + esc(x.p.categoria || '—') + '</td>' +
          '<td class="is-muted">' + esc(x.p.nif) + '</td>' +
          '<td class="is-muted">' + FDATE(x.ult) + '</td>' +
          '<td class="is-right">' + x.n + '</td>' +
          '<td class="is-right">' + EUR(x.total) + '</td>' +
          '<td class="is-right ' + (x.sinPagar > 0 ? 'es-mal' : '') + '">' + EUR(x.sinPagar) + '</td>' +
          '<td style="min-width:110px;"><div class="fdemo-apilada"><i class="n-serio" style="width:' + pct + '%"></i></div>' +
          '<span class="fdemo-pct">' + pct + ' %</span></td></tr>';
      }).join('');

      var porCat = {};
      gas.forEach(function (g) { porCat[g.categoria || 'Sin categoría'] = (porCat[g.categoria || 'Sin categoría'] || 0) + g.importe; });
      var cats = Object.keys(porCat).sort(function (a, b) { return porCat[b] - porCat[a]; });
      var filasCat = cats.map(function (c) {
        var pct = gTotal > 0 ? Math.round((porCat[c] / gTotal) * 100) : 0;
        return '<tr><td>' + esc(c) + '</td><td class="is-right">' + EUR(porCat[c]) + '</td>' +
          '<td style="min-width:150px;"><div class="fdemo-apilada"><i class="n-serio" style="width:' + pct + '%"></i></div></td>' +
          '<td class="is-right is-muted">' + pct + ' %</td></tr>';
      }).join('');

      return '<div class="fdemo-panel"><div class="fdemo-panel-h"><div>' +
        '<p class="fdemo-eyebrow">Negocio</p><h1 class="fdemo-page-title">Proveedores</h1>' +
        '<p class="fdemo-page-sub">A quién le compras, cuánto y qué le debes todavía.</p></div></div>' +
        '<div class="fdemo-kpi-tira es-4">' +
        kpi2({ hero: true, label: 'Gastado en total', valor: EUR(gTotal), hint: gas.length + ' gastos registrados', vista: 'gastos' }) +
        kpi2({ label: 'Proveedores', valor: String(provs.length), hint: 'dados de alta' }) +
        kpi2({ tono: debiendo > 0 ? 'aviso' : 'positivo', label: 'Sin pagar', valor: EUR(debiendo), hint: 'facturas de proveedor pendientes', vista: 'pagos' }) +
        kpi2({ label: 'Mayor proveedor', valor: top ? (gTotal > 0 ? Math.round((top.total / gTotal) * 100) + ' %' : '0 %') : '—',
               hint: top ? top.p.nombre : '' }) +
        '</div>' +
        seccion('Quién se lleva el gasto', 'ordenados por lo que les has pagado',
          card('', tablaSimple([{t:'Proveedor'},{t:'Categoría'},{t:'NIF'},{t:'Último gasto'},{t:'Gastos',r:1},{t:'Total',r:1},{t:'Sin pagar',r:1},{t:'Peso'}], filas, '')), 1) +
        seccion('Por categoría', 'en qué se va el dinero, no solo a quién',
          card('', tablaSimple([{t:'Categoría'},{t:'Total',r:1},{t:''},{t:'Peso',r:1}], filasCat, '')), 2) +
        aviso('Un proveedor que sube de precio aparece solo en el Radar. Aquí no hay que ir a buscarlo: se avisa cuando pasa.') +
        '</div>';
    };

    RENDERERS.historico = function () {
      var ev = FS.getEvolucion();
      var maxV = Math.max.apply(null, ev.map(function (m) { return Math.max(m.facturado, m.cobrado, m.gastos); }).concat([1]));
      var tFac = ev.reduce(function (a, m) { return a + m.facturado; }, 0);
      var tCob = ev.reduce(function (a, m) { return a + m.cobrado; }, 0);
      var tGas = ev.reduce(function (a, m) { return a + m.gastos; }, 0);
      var mejor = ev.slice().sort(function (a, b) { return b.resultado - a.resultado; })[0];
      var peor = ev.slice().sort(function (a, b) { return a.resultado - b.resultado; })[0];

      var filas = ev.slice().reverse().map(function (m) {
        return '<tr><td><b>' + esc(m.etiqueta) + '</b></td>' +
          '<td class="is-right">' + EUR(m.facturado) + '</td>' +
          '<td class="is-right">' + EUR(m.cobrado) + '</td>' +
          '<td class="is-muted is-right">' + (m.facturado > 0 ? Math.round((m.cobrado / m.facturado) * 100) + ' %' : '—') + '</td>' +
          '<td class="is-right">' + EUR(m.gastos) + '</td>' +
          '<td class="is-right ' + (m.resultado < 0 ? 'es-mal' : '') + '"><b>' + EUR(m.resultado) + '</b></td>' +
          '<td style="min-width:140px;"><div class="fdemo-apilada">' +
          '<i class="n-ok" style="width:' + Math.round((m.cobrado / maxV) * 100) + '%"></i>' +
          '<i class="n-serio" style="width:' + Math.round((m.gastos / maxV) * 100) + '%"></i>' +
          '</div></td></tr>';
      }).join('');

      return '<div class="fdemo-panel"><div class="fdemo-panel-h"><div>' +
        '<p class="fdemo-eyebrow">Inteligencia</p><h1 class="fdemo-page-title">Histórico</h1>' +
        '<p class="fdemo-page-sub">Doce meses, mes a mes, sin redondear nada.</p></div></div>' +
        '<div class="fdemo-kpi-tira es-4">' +
        kpi2({ hero: true, label: 'Facturado en 12 meses', valor: EUR(tFac), hint: 'todo lo emitido' }) +
        kpi2({ label: 'Cobrado', valor: EUR(tCob), hint: tFac > 0 ? Math.round((tCob / tFac) * 100) + ' % de lo facturado' : '' }) +
        kpi2({ label: 'Gastado', valor: EUR(tGas), hint: 'con IVA incluido' }) +
        kpi2({ tono: (tFac - tGas) >= 0 ? 'positivo' : 'critico', label: 'Diferencia', valor: EUR(tFac - tGas),
               hint: 'no es beneficio: no descuenta nóminas ni impuestos' }) +
        '</div>' +
        seccion('Mes a mes', 'la barra compara lo cobrado (verde) con lo gastado (naranja)',
          card('', tablaSimple([{t:'Mes'},{t:'Facturado',r:1},{t:'Cobrado',r:1},{t:'% cobro',r:1},{t:'Gastos',r:1},{t:'Resultado',r:1},{t:''}], filas, '')), 1) +
        seccion('Los dos extremos', 'el mejor mes y el peor, para tener con qué comparar',
          '<div class="fdemo-dos">' +
          card(cardHead('Mejor mes', mejor ? mejor.etiqueta : ''),
            '<div class="fdemo-card-body"><p class="fdemo-total es-bien">' + EUR(mejor ? mejor.resultado : 0) + '</p>' +
            '<p class="fdemo-kpi2-h">Facturó ' + EUR(mejor ? mejor.facturado : 0) + ' y gastó ' + EUR(mejor ? mejor.gastos : 0) + '.</p></div>') +
          card(cardHead('Peor mes', peor ? peor.etiqueta : ''),
            '<div class="fdemo-card-body"><p class="fdemo-total ' + ((peor && peor.resultado < 0) ? 'es-mal' : '') + '">' + EUR(peor ? peor.resultado : 0) + '</p>' +
            '<p class="fdemo-kpi2-h">Facturó ' + EUR(peor ? peor.facturado : 0) + ' y gastó ' + EUR(peor ? peor.gastos : 0) + '.</p></div>') +
          '</div>', 2) +
        aviso('El resultado del mes es facturado menos gastado. No es la caja: lo que entra de verdad está en Tesorería, y casi nunca coinciden.') +
        '</div>';
    };

    /* IMPUESTOS. No es una declaracion y no lo pretende: es el calculo, el
       desglose por meses, y -lo que de verdad importa- la lista de lo que le
       FALTA a un documento para poder declararlo. Eso ultimo es lo que
       ningun Excel te dice hasta que la gestoria lo devuelve. */
    RENDERERS.impuestos = function () {
      var ev = FS.getEvolucion();
      var fac = FS.listFacturas().filter(function (f) { return f.estado !== 'Borrador'; });
      var gas = FS.listGastos();
      var ivaRep = fac.reduce(function (a, f) { return a + (f.iva || 0); }, 0);
      var ivaSop = gas.reduce(function (a, g) { return a + (g.iva || 0); }, 0);
      var dif = ivaRep - ivaSop;
      var irpf = Math.round(gas.filter(function (g) { return /profesional|Subcontrat/i.test(g.categoria || ''); })
        .reduce(function (a, g) { return a + (g.base || 0) * 0.15; }, 0) * 100) / 100;

      // Desglose por trimestre, que es como se presenta de verdad.
      var tri = {};
      fac.forEach(function (f) {
        var d = f.fechaEmision; if (!d) return;
        var k = d.slice(0, 4) + ' · T' + (Math.floor(Number(d.slice(5, 7)) / 3.01) + 1);
        (tri[k] = tri[k] || { rep: 0, sop: 0, nf: 0, ng: 0 }); tri[k].rep += f.iva || 0; tri[k].nf++;
      });
      gas.forEach(function (g) {
        var d = g.fechaGasto || g.fecha; if (!d || typeof d !== 'string') return;
        var k = d.slice(0, 4) + ' · T' + (Math.floor(Number(d.slice(5, 7)) / 3.01) + 1);
        (tri[k] = tri[k] || { rep: 0, sop: 0, nf: 0, ng: 0 }); tri[k].sop += g.iva || 0; tri[k].ng++;
      });
      var filasTri = Object.keys(tri).sort().reverse().slice(0, 5).map(function (k) {
        var t = tri[k], d = t.rep - t.sop;
        return '<tr><td><b>' + esc(k) + '</b></td>' +
          '<td class="is-right">' + EUR(t.rep) + '</td><td class="is-muted is-right">' + t.nf + '</td>' +
          '<td class="is-right">' + EUR(t.sop) + '</td><td class="is-muted is-right">' + t.ng + '</td>' +
          '<td class="is-right"><b>' + EUR(d) + '</b></td>' +
          '<td>' + pill(d >= 0 ? 'A ingresar' : 'A tu favor') + '</td></tr>';
      }).join('');

      // Lo que le falta a un documento para poder declararlo.
      var facSinIva = fac.filter(function (f) { return !f.iva; }).slice(0, 6);
      var gasSinIva = gas.filter(function (g) { return !g.iva; }).slice(0, 6);
      var filasFalta = facSinIva.map(function (f) {
        return '<tr><td>' + linkTo('facturas', f.id, f.numero) + '</td><td class="is-muted">Factura emitida</td>' +
          '<td class="is-muted">' + esc(dash(f.clienteNombre)) + '</td>' +
          '<td class="is-right">' + EUR(f.importe) + '</td><td>' + pill('Sin cuota de IVA') + '</td></tr>';
      }).concat(gasSinIva.map(function (g) {
        return '<tr><td><code>' + esc(g.id) + '</code></td><td class="is-muted">Gasto</td>' +
          '<td class="is-muted">' + esc(g.proveedor) + '</td>' +
          '<td class="is-right">' + EUR(g.importe) + '</td><td>' + pill('Sin IVA declarado') + '</td></tr>';
      })).join('');

      var CAL = [
        ['Modelo 303', 'IVA trimestral', 'del 1 al 20 del mes siguiente al trimestre'],
        ['Modelo 390', 'Resumen anual de IVA', 'del 1 al 30 de enero'],
        ['Modelo 111', 'Retenciones de IRPF', 'del 1 al 20 del mes siguiente al trimestre'],
        ['Modelo 347', 'Operaciones con terceros', 'durante febrero, por encima de 3.005,06 €']
      ];
      var filasCal = CAL.map(function (c) {
        return '<tr><td><b>' + esc(c[0]) + '</b></td><td class="is-muted">' + esc(c[1]) + '</td>' +
          '<td class="is-muted">' + esc(c[2]) + '</td>' +
          '<td class="is-right"><button type="button" class="fdemo-btn-mini" data-action="plan">Exportar datos</button></td></tr>';
      }).join('');

      return '<div class="fdemo-panel"><div class="fdemo-panel-h"><div>' +
        '<p class="fdemo-eyebrow">Administración</p><h1 class="fdemo-page-title">Impuestos</h1>' +
        '<p class="fdemo-page-sub">Lo que sale de tus documentos, listo para que tu gestoría lo presente.</p></div></div>' +
        '<div class="fdemo-kpi-tira es-4">' +
        kpi2({ label: 'IVA repercutido', valor: EUR(ivaRep), hint: 'el que has cobrado en tus facturas', vista: 'facturas' }) +
        kpi2({ label: 'IVA soportado', valor: EUR(ivaSop), hint: 'el que has pagado en tus gastos', vista: 'gastos' }) +
        kpi2({ hero: true, tono: dif >= 0 ? 'aviso' : 'positivo', label: dif >= 0 ? 'A ingresar' : 'A tu favor',
               valor: EUR(Math.abs(dif)), hint: 'diferencia entre repercutido y soportado' }) +
        kpi2({ label: 'Retenciones de IRPF', valor: EUR(irpf), hint: 'estimadas sobre servicios profesionales' }) +
        '</div>' +
        seccion('Trimestre a trimestre', 'la misma cuenta, separada como se presenta',
          card('', tablaSimple([{t:'Periodo'},{t:'Repercutido',r:1},{t:'Fras.',r:1},{t:'Soportado',r:1},{t:'Gastos',r:1},{t:'Diferencia',r:1},{t:'Resultado'}], filasTri, '')), 1) +
        seccion('Lo que falta para poder declararlo', 'documentos a los que les falta la cuota, señalados en vez de rellenados solos',
          card('', tablaSimple([{t:'Documento'},{t:'Tipo'},{t:'Quién'},{t:'Importe',r:1},{t:'Qué falta'}], filasFalta,
            'Todos los documentos del periodo traen su cuota de IVA. Nada que completar.')), 2) +
        seccion('Calendario', 'qué se presenta y cuándo',
          card('', tablaSimple([{t:'Modelo'},{t:'Qué es'},{t:'Plazo'},{t:'',r:1}], filasCal, '')), 3) +
        aviso('Un cálculo, no una declaración: quien presenta es tu gestoría, y para eso están los libros en CSV de la pantalla de al lado. Aquí no se remite nada a la AEAT.') +
        '</div>';
    };

    /* TU GESTORIA. La pantalla mas honesta del sistema: dice lo que hace y,
       en la misma pagina y con el mismo tamano de letra, lo que NO hace.
       Ningun competidor de este segmento escribe la segunda lista. */
    RENDERERS.gestoria = function () {
      var fac = FS.listFacturas().filter(function (f) { return f.estado !== 'Borrador'; });
      var gas = FS.listGastos();
      var LIBROS = [
        { t: 'Libro de facturas emitidas', n: fac.length, d: 'Número, fecha, cliente, NIF, base, tipo, cuota y total.' },
        { t: 'Libro de facturas recibidas', n: gas.length, d: 'Proveedor, NIF, fecha, base, cuota soportada y categoría.' },
        { t: 'Resumen del trimestre', n: 1, d: 'Una línea por trimestre con repercutido, soportado y diferencia.' }
      ];
      var filasLibros = LIBROS.map(function (l) {
        return '<tr><td><b>' + esc(l.t) + '</b></td>' +
          '<td class="is-muted">' + esc(l.d) + '</td>' +
          '<td class="is-right">' + l.n + ' línea(s)</td>' +
          '<td class="is-right"><button type="button" class="fdemo-btn-mini" data-action="plan" data-plan="csv">Descargar CSV</button></td></tr>';
      }).join('');

      var HACE = [
        'Emitir facturas y llevar su numeración por series, sin huecos ni saltos.',
        'Guardar cada factura con su huella y su registro de cambios.',
        'Exportar los libros registro en CSV, con el formato que pide tu asesoría.',
        'Avisar de lo que le falta a un documento antes de que lo devuelvan.',
        'Separar lo que está cobrado de lo que solo está emitido.'
      ];
      var NOHACE = [
        ['No presenta modelos ante la AEAT', 'Eso lo hace tu gestoría, con estos datos.'],
        ['No remite tus registros a la AEAT', 'El envío en tiempo real es otra cosa y no está aquí.'],
        ['No genera el código QR de cotejo', 'Va con lo anterior.'],
        ['No está conectado a ningún banco', 'Los cobros entran por conciliación de extracto, no por API bancaria.'],
        ['No hace factura electrónica B2B', 'El formato Facturae con firma no está implementado.'],
        ['No está certificado, porque eso no existe', 'No hay certificación oficial de software de facturación: quien te diga que la tiene, te está vendiendo humo.']
      ];
      var filasNo = NOHACE.map(function (x) {
        return '<article class="fdemo-nohace"><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></article>';
      }).join('');

      return '<div class="fdemo-panel"><div class="fdemo-panel-h"><div>' +
        '<p class="fdemo-eyebrow">Administración</p><h1 class="fdemo-page-title">Tu gestoría</h1>' +
        '<p class="fdemo-page-sub">Todo lo que tu asesoría necesita, en el formato en el que lo pide.</p></div></div>' +
        '<div class="fdemo-kpi-tira es-3">' +
        kpi2({ label: 'Emitidas en el libro', valor: String(fac.length), hint: 'facturas con numeración correlativa', vista: 'facturas' }) +
        kpi2({ label: 'Recibidas en el libro', valor: String(gas.length), hint: 'gastos con proveedor y cuota', vista: 'gastos' }) +
        kpi2({ label: 'Huecos en la numeración', valor: '0', tono: 'positivo', hint: 'ninguna serie salta un número' }) +
        '</div>' +
        seccion('Los libros', 'en CSV, listos para enviar, sin cerrar nada',
          card('', tablaSimple([{t:'Libro'},{t:'Qué lleva'},{t:'Tamaño',r:1},{t:'',r:1}], filasLibros, '')), 1) +
        seccion('Lo que sí hace', 'y por eso tu gestoría deja de pedirte cosas por WhatsApp',
          card('', '<div class="fdemo-card-body"><ul class="fdemo-hace">' +
            HACE.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul></div>'), 2) +
        seccion('Lo que NO hace', 'escrito aquí para que nadie se entere tarde',
          '<div class="fdemo-nohace-rej">' + filasNo + '</div>', 3) +
        aviso('Se exporta tal cual, sin cerrar nada. Si a una factura le falta un dato fiscal, sale marcada en vez de rellenarse sola.') +
        '</div>';
    };

    RENDERERS.auditoria = function () {
      var act = FS.getActividad(25);
      var filas = act.map(function (a) {
        return '<tr><td class="is-muted">' + FDATE(a.fecha) + '</td>' +
          '<td>' + esc(a.tipo) + '</td><td class="is-muted">' + esc(a.texto) + '</td>' +
          '<td class="is-right">' + EUR(a.importe) + '</td>' +
          '<td class="is-muted">Cuenta de demostración</td></tr>';
      }).join('');
      return '<div class="fdemo-panel"><div class="fdemo-panel-h"><div>' +
        '<p class="fdemo-eyebrow">Administración</p><h1 class="fdemo-page-title">Auditoría</h1></div></div>' +
        aviso('Quién hizo qué, cuándo y sobre qué registro. No se puede borrar desde la aplicación.') +
        card('', tablaSimple([{t:'Fecha'},{t:'Tipo'},{t:'Registro'},{t:'Importe',r:1},{t:'Quién'}], filas, '')) +
        '</div>';
    };

    RENDERERS.usuarios = function () {
      var roles = [
        { r: 'Owner', q: 'Todo, incluido invitar y dar de baja a personas', n: 1,
          p: ['facturas','cobros','gastos','proyectos','impuestos','configuración','usuarios'] },
        { r: 'Administrador', q: 'Todo salvo la propiedad de la cuenta', n: 1,
          p: ['facturas','cobros','gastos','proyectos','impuestos','configuración'] },
        { r: 'Dirección', q: 'Ver todo y decidir; no toca la configuración fiscal', n: 1,
          p: ['facturas','cobros','gastos','proyectos','impuestos'] },
        { r: 'Finanzas', q: 'Facturar, cobrar, gastar y cerrar', n: 2,
          p: ['facturas','cobros','gastos','impuestos'] },
        { r: 'Operaciones', q: 'Ver y crear documentos; no ve márgenes', n: 3,
          p: ['pedidos','albaranes','proyectos'] },
        { r: 'Solo lectura', q: 'Ver. Nada más.', n: 0, p: ['ver'] }
      ];
      var filas = roles.map(function (r) {
        return '<tr><td><b>' + esc(r.r) + '</b></td><td class="is-muted">' + esc(r.q) + '</td>' +
          '<td class="is-muted">' + r.p.map(esc).join(' · ') + '</td>' +
          '<td class="is-right">' + r.n + '</td>' +
          '<td>' + pill(r.n ? 'Activo' : 'Disponible') + '</td></tr>';
      }).join('');

      var PERSONAS = [
        ['Equipo D-Code', 'Owner', 'hoy', 'Activa'],
        ['Administración', 'Finanzas', 'hace 2 días', 'Activa'],
        ['Operaciones', 'Operaciones', 'hace 6 días', 'Activa'],
        ['Tu gestoría', 'Solo lectura', 'hace 1 mes', 'Invitación enviada']
      ];
      var filasP = PERSONAS.map(function (p) {
        return '<tr><td><b>' + esc(p[0]) + '</b></td><td class="is-muted">' + esc(p[1]) + '</td>' +
          '<td class="is-muted">' + esc(p[2]) + '</td><td>' + pill(p[3]) + '</td>' +
          '<td class="is-right"><button type="button" class="fdemo-btn-mini" data-action="plan">Cambiar rol</button></td></tr>';
      }).join('');

      var GARANTIAS = [
        ['El permiso se comprueba dos veces', 'En la pantalla y otra vez en la capa que lee la base de datos. Esconder un botón no es un permiso.'],
        ['Cada empresa, aislada', 'Ninguna consulta puede salir de su empresa aunque alguien se equivoque al escribirla.'],
        ['Todo lo que se toca queda escrito', 'Quién, qué y cuándo, en Auditoría, sin poder borrarlo desde dentro.'],
        ['Una invitación caduca', 'Si nadie la acepta, se apaga sola. No queda una puerta abierta para siempre.']
      ];

      return '<div class="fdemo-panel"><div class="fdemo-panel-h"><div>' +
        '<p class="fdemo-eyebrow">Administración</p><h1 class="fdemo-page-title">Usuarios</h1>' +
        '<p class="fdemo-page-sub">Quién entra, qué puede tocar y qué queda registrado.</p></div>' +
        '<button type="button" class="fdemo-btn variant-secondary" data-action="plan">Invitar a alguien</button></div>' +
        '<div class="fdemo-kpi-tira es-4">' +
        kpi2({ hero: true, label: 'Personas con acceso', valor: '4', hint: 'incluida la gestoría' }) +
        kpi2({ label: 'Roles disponibles', valor: String(roles.length), hint: 'cada uno con sus módulos' }) +
        kpi2({ label: 'Invitaciones abiertas', valor: '1', tono: 'aviso', hint: 'caduca sola a los 7 días' }) +
        kpi2({ label: 'Accesos registrados', valor: '128', hint: 'en Auditoría, sin poder borrarse', vista: 'auditoria' }) +
        '</div>' +
        seccion('Quién entra', 'las personas con acceso a esta cuenta',
          card('', tablaSimple([{t:'Persona'},{t:'Rol'},{t:'Último acceso'},{t:'Estado'},{t:'',r:1}], filasP, '')), 1) +
        seccion('Qué puede tocar cada rol', 'por módulo y por acción, no por pantalla',
          card('', tablaSimple([{t:'Rol'},{t:'Qué puede hacer'},{t:'Módulos'},{t:'Personas',r:1},{t:'En uso'}], filas, '')), 2) +
        seccion('Lo que garantiza', 'porque un permiso que solo esconde un botón no es un permiso',
          '<div class="fdemo-nohace-rej">' + GARANTIAS.map(function (g) {
            return '<article class="fdemo-nohace es-bien"><b>' + esc(g[0]) + '</b><span>' + esc(g[1]) + '</span></article>';
          }).join('') + '</div>', 3) +
        '</div>';
    };

    // Pedidos y albaranes salen de los presupuestos aceptados: en el producto
    // son documentos propios; aquí se enseña su forma y su encadenamiento.
    /* PEDIDOS Y ALBARANES. Antes los dos pintaban las mismas cuatro filas de
       un presupuesto aceptado, con la misma tabla y la misma cara. Son dos
       documentos distintos y hacen dos preguntas distintas: un pedido es algo
       comprometido que aun no se ha entregado, y un albaran es algo entregado
       que aun no se ha facturado. Cada uno con su cuenta arriba. */
    function lineasDe(p, i) {
      var t = (p.servicios || p.resumen || '').split(/[,+]/).map(function (x) { return x.trim(); }).filter(Boolean);
      if (!t.length) t = ['Servicio contratado'];
      return t.slice(0, 3).map(function (x, j) {
        return { d: x, u: 1 + ((i + j) % 3), imp: Math.round((p.importe / Math.min(t.length, 3)) * 100) / 100 };
      });
    }
    function documentalSimple(cfg) {
      var pres = FS.listPresupuestos().filter(function (p) { return p.aceptadaPorCliente; });
      var proy = FS.listProyectos();
      var docs = pres.map(function (p, i) {
        var pr = proy[i % proy.length] || {};
        var servido = cfg.k === 'pedidos' ? !!p.facturaGeneradaId : true;
        return { cod: cfg.prefijo + '-' + String(cfg.base + i * 7), empresa: p.empresa,
                 trabajo: p.servicios || p.resumen, fecha: p.fechaAceptacion || p.fechaGeneracion,
                 importe: p.importe, lineas: lineasDe(p, i), proyecto: pr.nombre || null,
                 estado: cfg.k === 'pedidos' ? (servido ? 'Servido' : 'En curso')
                                             : (p.facturaGeneradaId ? 'Facturado' : 'Sin facturar') };
      });
      var abiertos = docs.filter(function (d) { return d.estado === 'En curso' || d.estado === 'Sin facturar'; });
      var tAbierto = abiertos.reduce(function (a, d) { return a + d.importe; }, 0);
      var nLineas = docs.reduce(function (a, d) { return a + d.lineas.length; }, 0);

      var filas = docs.map(function (d) {
        return '<tr><td><code>' + esc(d.cod) + '</code></td>' +
          '<td>' + esc(d.empresa) + '</td>' +
          '<td class="is-muted">' + esc(d.trabajo) + '</td>' +
          '<td class="is-muted">' + esc(dash(d.proyecto)) + '</td>' +
          '<td class="is-muted is-right">' + d.lineas.length + '</td>' +
          '<td class="is-muted">' + FDATE(d.fecha) + '</td>' +
          '<td class="is-right">' + EUR(d.importe) + '</td>' +
          '<td>' + pill(d.estado) + '</td>' +
          '<td class="is-right"><button type="button" class="fdemo-btn-mini" data-action="plan">' + esc(cfg.accion) + '</button></td></tr>';
      }).join('');

      // El detalle de lineas del primero, abierto: una tabla de cabeceras sin
      // una sola linea dentro no ensena lo que es un pedido.
      var d0 = docs[0];
      var filasL = d0 ? d0.lineas.map(function (l, j) {
        return '<tr><td class="is-muted">' + (j + 1) + '</td>' +
          '<td>' + esc(l.d) + '</td>' +
          '<td class="is-muted is-right">' + l.u + '</td>' +
          '<td class="is-right">' + EUR(Math.round((l.imp / l.u) * 100) / 100) + '</td>' +
          '<td class="is-right">' + EUR(l.imp) + '</td></tr>';
      }).join('') : '';

      return '<div class="fdemo-panel"><div class="fdemo-panel-h"><div>' +
        '<p class="fdemo-eyebrow">' + esc(cfg.eyebrow) + '</p><h1 class="fdemo-page-title">' + esc(cfg.titulo) + '</h1>' +
        '<p class="fdemo-page-sub">' + esc(cfg.sub) + '</p></div>' +
        '<button type="button" class="fdemo-btn variant-secondary" data-action="plan">' + esc(cfg.nuevo) + '</button></div>' +
        '<div class="fdemo-kpi-tira es-4">' +
        kpi2({ hero: true, tono: tAbierto > 0 ? 'aviso' : 'positivo', label: cfg.kpi1, valor: EUR(tAbierto), hint: abiertos.length + ' documento(s)' }) +
        kpi2({ label: 'Documentos', valor: String(docs.length), hint: 'en el histórico' }) +
        kpi2({ label: 'Líneas', valor: String(nLineas), hint: 'de detalle, sumadas' }) +
        kpi2({ label: cfg.kpi2l, valor: String(docs.length - abiertos.length), hint: cfg.kpi2h }) +
        '</div>' +
        seccion(cfg.titulo, cfg.pregunta,
          card('', tablaSimple([{t:'Nº'},{t:'Cliente'},{t:'Trabajo'},{t:'Proyecto'},{t:'Líneas',r:1},{t:'Fecha'},{t:'Importe',r:1},{t:'Estado'},{t:'',r:1}], filas, '')), 1) +
        (d0 ? seccion('Detalle de ' + d0.cod, 'un documento por dentro, con sus líneas',
          card(cardHead(d0.empresa, d0.trabajo),
            tablaSimple([{t:'#'},{t:'Concepto'},{t:'Uds.',r:1},{t:'Precio',r:1},{t:'Importe',r:1}], filasL, '')), 2) : '') +
        aviso(cfg.nota) +
        '</div>';
    }
    RENDERERS.pedidos = function () {
      return documentalSimple({ k: 'pedidos', titulo: 'Pedidos', eyebrow: 'Negocio', prefijo: 'PD', base: 4100,
        sub: 'Trabajo que el cliente ya ha comprometido y que todavía tienes que entregar.',
        nuevo: 'Nuevo pedido', accion: 'Servir', pregunta: 'qué te has comprometido a entregar',
        kpi1: 'Comprometido sin servir', kpi2l: 'Servidos', kpi2h: 'ya entregados al cliente',
        nota: 'Un pedido no es una factura: no entra en los números hasta que se sirve y se factura. Por eso está aquí y no en Facturas.' });
    };
    RENDERERS.albaranes = function () {
      return documentalSimple({ k: 'albaranes', titulo: 'Albaranes', eyebrow: 'Negocio', prefijo: 'ALB', base: 1880,
        sub: 'Lo que ya has entregado. Mientras un albarán no tenga factura, es dinero hecho y sin pedir.',
        nuevo: 'Nuevo albarán', accion: 'Facturar', pregunta: 'qué has entregado y qué falta por facturar',
        kpi1: 'Entregado sin facturar', kpi2l: 'Facturados', kpi2h: 'ya convertidos en factura',
        nota: 'Un albarán fotografiado también entra: se lee en Inteligencia financiera y llega aquí con sus líneas, enlazado con su pedido.' });
    };


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
          linkTo('facturas', f.id, f.numero) + (f.nueva ? '<span class="fdemo-nuevo-pill">Nueva</span>' : '') + '</td>' +
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
      /* Las que acaban de entrar desde un documento no estan en el almacen:
         estan en la sesion. Y su ficha ensena lo que ninguna otra ensena, que
         es DE DONDE ha salido cada campo -que pagina del PDF-, que es justo
         lo que hay que poder ensenar cuando alguien pregunta si se fia. */
      var nueva = (state.facturasNuevas || []).filter(function (x) { return x.id === id; })[0];
      if (nueva) return facturaNuevaDetalle(nueva);
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


    function facturaNuevaDetalle(f) {
      var r = REMESA.filter(function (x) { return x.n === f.numero; })[0] || {};
      var doc = DOCS.filter(function (d) { return d.k === 'remesa'; })[0] || { n: 'remesa.pdf' };
      return '<div class="fdemo-page is-narrow" style="gap:20px;">' +
        crumb('Facturas', 'facturas', f.numero) +
        '<div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;">' +
        '<div><h1 class="fdemo-page-title">Factura ' + esc(f.numero) + '</h1>' +
        '<p class="fdemo-page-sub">' + esc(f.clienteNombre) + '</p></div>' +
        '<div style="display:flex; gap:8px;">' + pill('Borrador') + '</div></div>' +
        card(cardHead('Datos de la factura', 'Extraídos del documento, sin teclear nada'),
          '<div class="fdemo-field-grid">' +
          field('Base imponible', EUR(f.base)) + field('Cuota de IVA', EUR(f.iva)) + field('Total', EUR(f.importe)) +
          field('Tipo de IVA', '21 %') + field('Fecha de entrada', FDATE(f.fechaEmision)) +
          field('Serie', 'FP · facturas de proveedor') + '</div>') +
        card(cardHead('De dónde ha salido', 'Cada campo trae su origen: por eso se puede revisar sin abrir el PDF'),
          '<div class="fdemo-huella">' +
          '<div class="fdemo-huella-doc"><span class="fdemo-huella-i" aria-hidden="true">PDF</span>' +
          '<div><b>' + esc(doc.n) + '</b><i>página ' + (r.pag || 1) + ' de ' + REMESA.length + '</i></div></div>' +
          '<ul class="fdemo-huella-l">' +
          '<li><span>Número</span><b>' + esc(f.numero) + '</b><i>cabecera</i></li>' +
          '<li><span>Proveedor</span><b>' + esc(f.clienteNombre) + '</b><i>razón social</i></li>' +
          '<li><span>Base</span><b>' + EUR(f.base) + '</b><i>línea de totales</i></li>' +
          '<li><span>IVA</span><b>' + EUR(f.iva) + '</b><i>línea de totales</i></li>' +
          '</ul></div>') +
        card(cardHead('Qué falta', 'El sistema no se inventa lo que el documento no dice'),
          '<div class="fdemo-card-body"><ul class="fdemo-falta">' +
          '<li>Vencimiento: no viene en el documento. Lo pones tú o lo hereda de las condiciones del proveedor.</li>' +
          '<li>Proyecto al que imputar: sin asignar.</li>' +
          '<li>Queda en <b>borrador</b> hasta que alguien la confirma. Nada entra en los números sin que lo mires.</li>' +
          '</ul>' +
          '<div class="fdemo-falta-acts">' +
          '<button type="button" class="fdemo-btn variant-primary" data-action="plan">Confirmar y contabilizar</button>' +
          '<button type="button" class="fdemo-btn variant-secondary" data-action="nav" data-view="facturas">Volver a Facturas</button>' +
          '</div></div>') +
        '</div>';
    }

    // ---------- Presupuestos ----------
    RENDERERS.presupuestos = function (id) {
      if (id) return presupuestoDetalle(id);
      var all = FS.listPresupuestos();
      var aceptados = all.filter(function (p) { return p.aceptadaPorCliente; });
      var facturados = all.filter(function (p) { return p.facturaGeneradaId; });
      var abiertos = all.filter(function (p) { return !p.aceptadaPorCliente && p.estado !== 'Rechazada' && p.estado !== 'Caducada'; });
      var tTotal = all.reduce(function (a, p) { return a + p.importe; }, 0);
      var tAcept = aceptados.reduce(function (a, p) { return a + p.importe; }, 0);
      var tAbierto = abiertos.reduce(function (a, p) { return a + p.importe; }, 0);
      var tasa = all.length ? Math.round((aceptados.length / all.length) * 100) : 0;

      var rows = all.map(function (p) {
        return '<tr><td>' + linkTo('presupuestos', p.id, p.empresa) + '</td>' +
          '<td class="is-muted">' + esc(p.servicios || p.resumen) + '</td>' +
          '<td class="is-muted">' + FDATE(p.fechaGeneracion) + '</td>' +
          '<td class="is-right">' + EUR(p.importe) + '</td>' +
          '<td>' + pill(p.estado) + '</td>' +
          '<td class="is-muted">' + (p.aceptadaPorCliente ? FDATE(p.fechaAceptacion) : 'Sin aceptar') + '</td>' +
          '<td>' + (p.facturaGeneradaId ? linkTo('facturas', p.facturaGeneradaId, 'Ver factura')
                    : '<button type="button" class="fdemo-btn-mini" data-action="plan">Facturar</button>') + '</td></tr>';
      }).join('');

      // El embudo: cuantos salen, cuantos vuelven, cuantos acaban en factura.
      var ETAPAS = [
        { t: 'Enviados', n: all.length, v: tTotal, c: 'n-ok' },
        { t: 'Aceptados', n: aceptados.length, v: tAcept, c: 'n-ok' },
        { t: 'Facturados', n: facturados.length, v: facturados.reduce(function (a, p) { return a + p.importe; }, 0), c: 'n-ok' }
      ];
      var filasEmb = ETAPAS.map(function (e) {
        var pct = all.length ? Math.round((e.n / all.length) * 100) : 0;
        return '<tr><td><b>' + esc(e.t) + '</b></td><td class="is-right">' + e.n + '</td>' +
          '<td class="is-right">' + EUR(e.v) + '</td>' +
          '<td style="min-width:180px;"><div class="fdemo-apilada"><i class="' + e.c + '" style="width:' + pct + '%"></i></div></td>' +
          '<td class="is-right is-muted">' + pct + ' %</td></tr>';
      }).join('');

      return '<div class="fdemo-panel"><div class="fdemo-panel-h"><div>' +
        '<p class="fdemo-eyebrow">Negocio</p><h1 class="fdemo-page-title">Presupuestos</h1>' +
        '<p class="fdemo-page-sub">Lo que has ofrecido, lo que te han aceptado y lo que ya es una factura.</p></div>' +
        '<button type="button" class="fdemo-btn variant-secondary" data-action="plan">Nuevo presupuesto</button></div>' +
        '<div class="fdemo-kpi-tira es-4">' +
        kpi2({ hero: true, tono: tAbierto > 0 ? 'aviso' : 'neutro', label: 'En la calle', valor: EUR(tAbierto),
               hint: abiertos.length + ' presupuesto(s) sin respuesta' }) +
        kpi2({ label: 'Tasa de aceptación', valor: tasa + ' %', hint: aceptados.length + ' de ' + all.length }) +
        kpi2({ label: 'Aceptado', valor: EUR(tAcept), hint: 'con el sí del cliente' }) +
        kpi2({ label: 'Aceptado sin facturar', valor: EUR(tAcept - facturados.reduce(function (a, p) { return a + p.importe; }, 0)),
               hint: 'dinero hecho y sin pedir', vista: 'por-facturar' }) +
        '</div>' +
        seccion('El embudo', 'cuántos salen, cuántos vuelven y cuántos acaban en factura',
          card('', tablaSimple([{t:'Etapa'},{t:'Nº',r:1},{t:'Importe',r:1},{t:''},{t:'%',r:1}], filasEmb, '')), 1) +
        seccion('Todos los presupuestos', 'con su estado y su factura, si la tiene',
          card('', tablaSimple([{t:'Empresa'},{t:'Trabajo'},{t:'Generado'},{t:'Importe',r:1},{t:'Estado'},{t:'Aceptación'},{t:'Factura'}], rows, 'Aún no hay presupuestos generados.')), 2) +
        aviso('Un presupuesto aceptado no se convierte en factura solo: aparece en «Dinero que aún no has facturado» hasta que alguien decide emitirla.') +
        '</div>';
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

      /* El archivo tenia DOS filas. Un gestor documental con dos documentos no
         es un gestor documental: es un sitio vacio. Estos salen de los mismos
         proveedores y facturas que ya estan en el sistema, asi que cada linea
         tiene a quien apuntar. */
      var gas = FS.listGastos().slice(0, 9);
      var TIPOS = ['Factura', 'Ticket', 'Albarán', 'Justificante', 'Presupuesto', 'Otro'];
      var ORIGEN = ['Leído por el asistente', 'Gasto desde PDF', 'Subida manual', 'Foto desde el móvil', 'Entrada por correo'];
      var archivo = [
        { n: 'remesa-proveedores-septiembre.pdf', t: 'Factura', o: 'Leído por el asistente', d: FDATE(FS.hoy), pes: '2,4 MB', li: '20 facturas' },
        { n: state.gastoNuevo ? 'FP-2026-0441-perlan.pdf' : 'albaran-ALB-2026-0007.pdf',
          t: state.gastoNuevo ? 'Factura' : 'Albarán',
          o: state.gastoNuevo ? 'Gasto desde PDF' : 'Subida manual',
          d: state.gastoNuevo ? '12 ago 2026' : '02 ago 2026', pes: '184 KB', li: '1 documento' }
      ].concat(gas.map(function (g, i) {
        return { n: (g.proveedor || 'documento').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + (2400 + i * 13) + '.pdf',
                 t: TIPOS[i % TIPOS.length], o: ORIGEN[i % ORIGEN.length], d: FDATE(g.fechaGasto),
                 pes: (90 + i * 37) + ' KB', li: '1 documento', quien: g.proveedor, imp: g.importe };
      }));
      var porTipo = {};
      archivo.forEach(function (a) { porTipo[a.t] = (porTipo[a.t] || 0) + 1; });
      var filasTipo = Object.keys(porTipo).sort(function (a, b) { return porTipo[b] - porTipo[a]; }).map(function (t) {
        var pct = Math.round((porTipo[t] / archivo.length) * 100);
        return '<tr><td>' + pill(t) + '</td><td class="is-right">' + porTipo[t] + '</td>' +
          '<td style="min-width:170px;"><div class="fdemo-apilada"><i class="n-ok" style="width:' + pct + '%"></i></div></td>' +
          '<td class="is-right is-muted">' + pct + ' %</td></tr>';
      }).join('');

      return '<div class="fdemo-panel"><div class="fdemo-panel-h"><div>' +
        '<p class="fdemo-eyebrow">Día a día</p><h1 class="fdemo-page-title">Documentos</h1>' +
        '<p class="fdemo-page-sub">Cada archivo se guarda una vez y queda protegido: solo se descarga desde aquí, con tu sesión y tu permiso comprobados en cada intento.</p></div></div>' +
        '<div class="fdemo-kpi-tira es-4">' +
        kpi2({ hero: true, label: 'Documentos guardados', valor: String(archivo.length), hint: 'con su tipo y su origen' }) +
        kpi2({ label: 'Leídos por el asistente', valor: String(archivo.filter(function (a) { return /asistente|PDF|Foto/.test(a.o); }).length),
               hint: 'sin que nadie teclee los campos', vista: 'ia' }) +
        kpi2({ label: 'Tipos reconocidos', valor: '8', hint: 'presupuesto, pedido, albarán, factura, gasto, ticket, justificante y otro' }) +
        kpi2({ label: 'Descargas sin permiso', valor: '0', tono: 'positivo', hint: 'ningún archivo tiene URL pública' }) +
        '</div>' +
        card('<div class="fdemo-card-head"><div><h2 class="fdemo-card-title">' + 'Nuevo gasto desde PDF' + '</h2>' +
             '<p class="fdemo-card-subtitle">' + 'También puedes crearlo a mano — este camino solo te ahorra teclear.' + '</p></div></div>',
             '<div class="fdemo-doc-body">' + cuerpo +
             '<p class="fdemo-doc-nota">' + 'Así funciona en el sistema real. Aquí lo ves con un documento de ejemplo: esta demo no sube ningún fichero tuyo ni guarda nada.' + '</p></div>') +
        seccion('El archivo', 'cada documento con su tipo, su origen y a qué apunta',
          card('', '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr>' +
             '<th>Documento</th><th>Tipo</th><th>Origen</th><th>De quién</th><th>Fecha</th><th class="is-right">Tamaño</th><th class="is-right"></th>' +
             '</tr></thead><tbody>' +
             archivo.map(function (a) {
               return '<tr><td>' + esc(a.n) + '</td><td>' + pill(a.t) + '</td>' +
                 '<td class="is-muted">' + esc(a.o) + '</td>' +
                 '<td class="is-muted">' + esc(dash(a.quien)) + '</td>' +
                 '<td class="is-muted">' + esc(a.d) + '</td>' +
                 '<td class="is-muted is-right">' + esc(a.pes) + '</td>' +
                 '<td class="is-right"><button type="button" class="fdemo-btn-mini" data-action="plan">Descargar</button></td></tr>';
             }).join('') + '</tbody></table></div>'), 2) +
        seccion('Qué hay guardado', 'por tipo de documento',
          card('', tablaSimple([{t:'Tipo'},{t:'Nº',r:1},{t:''},{t:'Peso',r:1}], filasTipo, '')), 3) +
        aviso('Ningún archivo tiene una dirección pública que se pueda adivinar. Se pide por su identificador y el sistema comprueba tu sesión y tu permiso antes de devolverlo — cada vez, no la primera.') +
        '</div>';
    };

    // ---------- Proyectos ----------
    RENDERERS.proyectos = function (id) {
      if (id) return proyectoDetalle(id);
      var all = FS.listProyectos();
      var activos = all.filter(function (p) { return p.estado === 'En curso'; });
      var pierden = all.filter(function (p) { return (p.rentabilidad || 0) < 0; });
      var tFac = all.reduce(function (a, p) { return a + (p.totalFacturado || 0); }, 0);
      var tGas = all.reduce(function (a, p) { return a + (p.totalGastos || 0); }, 0);
      var tRent = tFac - tGas;
      var maxAbs = Math.max.apply(null, all.map(function (p) { return Math.abs(p.rentabilidad || 0); }).concat([1]));

      var rows = all.slice().sort(function (a, b) { return (a.rentabilidad || 0) - (b.rentabilidad || 0); }).map(function (p) {
        var r = p.rentabilidad || 0, pct = Math.round((Math.abs(r) / maxAbs) * 100);
        return '<tr><td>' + linkTo('proyectos', p.id, p.nombre) + '</td>' +
          '<td class="is-muted">' + esc(dash(p.empresa)) + '</td><td>' + pill(p.estado) + '</td>' +
          '<td class="is-muted">' + esc(dash(p.responsable)) + '</td>' +
          '<td class="is-muted">' + FDATE(p.fechaInicio) + '</td>' +
          '<td class="is-right">' + EUR(p.totalFacturado) + '</td>' +
          '<td class="is-right">' + EUR(p.totalGastos) + '</td>' +
          '<td class="is-right ' + (r < 0 ? 'es-mal' : '') + '">' + EUR(r) + '</td>' +
          '<td style="min-width:120px;"><div class="fdemo-apilada"><i class="' + (r < 0 ? 'n-critico' : 'n-ok') + '" style="width:' + pct + '%"></i></div></td></tr>';
      }).join('');

      var filasRiesgo = pierden.map(function (p) {
        return '<tr><td>' + linkTo('proyectos', p.id, p.nombre) + '</td>' +
          '<td class="is-muted">' + esc(dash(p.empresa)) + '</td>' +
          '<td class="is-right">' + EUR(p.totalFacturado) + '</td>' +
          '<td class="is-right">' + EUR(p.totalGastos) + '</td>' +
          '<td class="is-right es-mal">' + EUR(p.rentabilidad) + '</td>' +
          '<td class="is-right"><button type="button" class="fdemo-btn-mini" data-action="plan">Revisar</button></td></tr>';
      }).join('');

      return '<div class="fdemo-panel"><div class="fdemo-panel-h"><div>' +
        '<p class="fdemo-eyebrow">Negocio</p><h1 class="fdemo-page-title">Proyectos</h1>' +
        '<p class="fdemo-page-sub">Lo que cuesta cada trabajo frente a lo que deja, con los gastos ya imputados.</p></div></div>' +
        '<div class="fdemo-kpi-tira es-4">' +
        kpi2({ hero: true, tono: tRent >= 0 ? 'positivo' : 'critico', label: 'Rentabilidad acumulada', valor: EUR(tRent),
               hint: 'facturado menos gastos imputados' }) +
        kpi2({ label: 'En curso', valor: String(activos.length), hint: 'de ' + all.length + ' proyectos' }) +
        kpi2({ tono: pierden.length ? 'critico' : 'positivo', label: 'Pierden dinero', valor: String(pierden.length),
               hint: EUR(pierden.reduce(function (a, p) { return a + p.rentabilidad; }, 0)) + ' entre todos' }) +
        kpi2({ label: 'Gasto imputado', valor: EUR(tGas), hint: 'repartido por proyecto, no en un montón', vista: 'gastos' }) +
        '</div>' +
        (pierden.length ? seccion('Los que pierden dinero', 'primero esto, que es lo que cuesta caro no mirar',
          card('', tablaSimple([{t:'Proyecto'},{t:'Cliente'},{t:'Facturado',r:1},{t:'Gastos',r:1},{t:'Rentabilidad',r:1},{t:'',r:1}], filasRiesgo, '')), 1) : '') +
        seccion('Todos los proyectos', 'ordenados por lo que dejan, de peor a mejor',
          card('', tablaSimple([{t:'Proyecto'},{t:'Cliente'},{t:'Estado'},{t:'Responsable'},{t:'Inicio'},{t:'Facturado',r:1},{t:'Gastos',r:1},{t:'Rentabilidad',r:1},{t:''}], rows, 'Aún no hay proyectos registrados.')), 2) +
        aviso('La rentabilidad sale de los gastos que alguien ha imputado al proyecto. Un gasto sin imputar no aparece aquí: no se reparte a ojo entre todos.') +
        '</div>';
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

    /* ══════════════ EL LECTOR DE DOCUMENTOS ══════════════ */

    // Una remesa de verdad: veinte facturas de proveedor dentro de un solo
    // PDF, que es como llegan del gestor o del propio proveedor. Los datos
    // son inventados; la FORMA es la que tiene una remesa.
    var REMESA_PROV = ['Nubalia Cloud','Suministros Gráficos Perlan','Coworking Belvedo','Telecom Sarkia','Viajes Tarsen','Suite Norlem','Talento Externo Rivelda','Gestoría Menvia'];
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
      { k: 'remesa', n: 'remesa-proveedores-septiembre.pdf', p: '2,4 MB', t: '20 facturas en un solo PDF', icono: 'pdf' },
      { k: 'factura', n: 'factura-proveedor-0441.pdf', p: '148 KB', t: 'Una factura suelta', icono: 'pdf' },
      { k: 'albaran', n: 'albaran-foto.jpg', p: '1,9 MB', t: 'Un albarán fotografiado con el móvil', icono: 'img' },
      { k: 'extracto', n: 'extracto-banco-septiembre.csv', p: '36 KB', t: 'Movimientos del banco', icono: 'csv' }
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
        '<a class="fdemo-btn variant-primary" href="/sistema-financiero#planes">Ver los planes</a>' +
        '<button type="button" class="fdemo-btn variant-ghost" data-action="muro-cerrar">Seguir mirando</button>' +
        '</div></div></div>';
    }

    // El cajón de documentos: lo que se puede soltar en la conversación.
    function cajonHtml() {
      if (!state.docCajon) return '';
      return '<div class="fdemo-cajon">' +
        '<p class="fdemo-cajon-t">Suéltale un documento y mira qué hace con él</p>' +
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
        '<span class="fdemo-doc-op-c"><b>Subir un documento mío</b><i>Tus PDFs, tus fotos, tus Excel</i></span>' +
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
      /* Soltar un documento OTRA VEZ es volver a empezar esa lectura, no
         apilar una segunda conversacion identica encima. El recorrido
         automatico da vueltas, y sin esto el hilo acababa con el mismo
         mensaje y la misma remesa repetidos en cada vuelta. */
      state.ia.mensajes = state.ia.mensajes.filter(function (m) { return !m.chip; });
      state.facturasNuevas = null;
      clearInterval(state.lectorT);
      state.lector = { k: k, fase: 'leyendo', leidas: 0, doc: d, alta: false };
      state.ia.mensajes.push({ autor: 'usuario', texto: TXT_SUELTA[k],
        chip: { nombre: d.n, peso: d.p, leido: '✓ Subido' } });
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
    var TXT_SUELTA = { remesa: 'Aquí tienes la remesa del mes. Dale de alta lo que puedas.', factura: 'Esta factura de proveedor, métemela donde vaya.', albaran: 'Te mando la foto del albarán que acaban de dejar.', extracto: 'El extracto del banco de este mes.' };

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
        '<div><b>' + (leyendo ? 'Leyendo el documento…' : '{n} facturas encontradas'.replace('{n}', REMESA.length)) + '</b>' +
        '<i>' + (leyendo ? 'página {p} de {t}'.replace('{p}', L.leidas + 1).replace('{t}', REMESA.length)
                         : 'suman {t}'.replace('{t}', EUR(total))) + '</i></div>' +
        '<span class="fdemo-lector-cont">' + L.leidas + ' / ' + REMESA.length + '</span>' +
        '</div>' +
        '<div class="fdemo-lector-barra"><i style="width:' + Math.round((L.leidas / REMESA.length) * 100) + '%"></i></div>' +
        '<div class="fdemo-lector-tabla"><table class="fdemo-table"><thead><tr>' +
        '<th>Nº</th><th>Proveedor</th><th class="is-right">Base</th>' +
        '<th class="is-right">IVA</th><th class="is-right">Total</th><th>Origen</th>' +
        '</tr></thead><tbody>' +
        vistas.map(function (r, i) {
          return '<tr class="' + (i === vistas.length - 1 && leyendo ? 'es-entrando' : '') + '">' +
            '<td><code>' + esc(r.n) + '</code></td><td class="is-muted">' + esc(r.prov) + '</td>' +
            '<td class="is-right">' + EUR(r.base) + '</td><td class="is-right">' + EUR(r.iva) + '</td>' +
            '<td class="is-right">' + EUR(r.total) + '</td>' +
            '<td class="is-muted">p. ' + r.pag + '</td></tr>';
        }).join('') + '</tbody></table></div>' +
        (L.fase === 'leido'
          ? '<div class="fdemo-lector-pie"><p>Revísalas antes de confirmar. Hasta que no las des de alta no se guarda nada.</p>' +
            '<button type="button" class="fdemo-btn variant-primary" data-action="alta">' +
            'Dar de alta las {n}'.replace('{n}', REMESA.length) + '</button></div>'
          : L.fase === 'alta'
            ? '<div class="fdemo-lector-pie es-hecho"><p><b>{n} facturas dadas de alta.'.replace('{n}', REMESA.length) + '</b> Están en Facturas, en borrador, listas para revisar.</p>' +
              '<button type="button" class="fdemo-btn variant-secondary" data-action="nav" data-view="facturas">Verlas en Facturas</button></div>'
            : '') +
        '</div></div>';
    }

    // Los otros tres documentos: la misma mecánica, más corta.
    var SIMPLE = {
      factura: { t: 'Factura leída', campos: [['Proveedor','Suministros Gráficos Perlan'],['Nº de factura','FP-2026-0441'],['Base imponible','412,00 €'],['Cuota de IVA','86,52 €'],['Total','498,52 €'],['Fecha','12/08/2026']], destino: 'Dada de alta en Gastos, pendiente de tu revisión.', vista: 'gastos' },
      albaran: { t: 'Albarán leído de una foto', campos: [['Proveedor','Nubalia Cloud'],['Nº de albarán','ALB-2026-0188'],['Líneas','6'],['Fecha','03/09/2026']], destino: 'Dado de alta en Albaranes y enlazado con su pedido.', vista: 'albaranes' },
      extracto: { t: 'Extracto conciliado', campos: [['Movimientos','34'],['Conciliados','11'],['Sin identificar','3'],['Periodo','01/09 – 20/09']], destino: 'Once cobros marcados. Tres movimientos no cuadran con ninguna factura: te los deja señalados en vez de asignarlos a ojo.', vista: 'cobros' }
    };
    function lectorSimpleHtml(L) {
      var S = SIMPLE[L.k]; if (!S) return '';
      var leyendo = L.fase === 'leyendo';
      return '<div class="fdemo-ia-msg from-ia"><div class="fdemo-lector">' +
        '<div class="fdemo-lector-h">' +
        (leyendo ? '<span class="fdemo-doc-spin" aria-hidden="true"></span>' : '<span class="fdemo-lector-ok">\u2713</span>') +
        '<div><b>' + (leyendo ? 'Leyendo el documento…' : S.t) + '</b>' +
        '<i>' + esc(L.doc.n) + '</i></div></div>' +
        (leyendo ? '' :
          '<div class="fdemo-lector-campos">' + S.campos.map(function (c) {
            return '<div><span>' + esc(c[0]) + '</span><b>' + esc(c[1]) + '</b></div>';
          }).join('') + '</div>' +
          '<div class="fdemo-lector-pie es-hecho"><p>' + esc(S.destino) + '</p>' +
          '<button type="button" class="fdemo-btn variant-secondary" data-action="nav" data-view="' + S.vista + '">Ver ahí</button></div>') +
        '</div></div>';
    }

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
        state.ia.mensajes.map(mensajeHtml).join('') + lectorHtml() +
        '</div></div>' +
        '<form class="fdemo-ask-form" data-role="ia-form">' +
        '<input class="fdemo-input" type="text" name="pregunta" aria-label="Escribe tu pregunta" placeholder="¿Qué está pasando?" autocomplete="off" maxlength="200">' +
        '<button type="submit" class="fdemo-btn variant-primary">Preguntar</button>' +
        '</form>' +
        '<button type="button" class="fdemo-ask-clip' + (state.docCajon ? ' es-abierto' : '') + '" data-action="adjuntar" aria-expanded="' + (state.docCajon ? 'true' : 'false') + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M21 11.5 12.5 20a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '<span>Suéltale un documento</span><i>PDF, foto, Excel o CSV</i></button>' + cajonHtml() +
        (chips ? '<div class="fdemo-ask-chips"><p class="fdemo-ask-chips-t">O prueba con una de estas:</p><div class="fdemo-ia-chips">' + chips + '</div></div>' : '') +
        muroHtml() +
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
      function campo(l, v) {
        return '<div class="fdemo-dato"><p class="fdemo-dato-l">' + esc(l) + '</p><p class="fdemo-dato-v">' + v + '</p></div>';
      }
      function rejilla(items) { return '<div class="fdemo-rejilla">' + items.join('') + '</div>'; }
      function chip(x) { return '<span class="fdemo-chip">' + esc(x) + '</span>'; }
      function opcion(t, d, activa) {
        return '<button type="button" class="fdemo-opcion' + (activa ? ' es-activa' : '') + '"' +
          ' data-action="plan" data-plan="tema" aria-pressed="' + (activa ? 'true' : 'false') + '">' +
          '<span class="fdemo-opcion-h"><span class="fdemo-opcion-t">' + esc(t) + '</span>' +
          (activa ? '<span class="fdemo-opcion-u">En uso</span>' : '') + '</span>' +
          '<span class="fdemo-opcion-d">' + esc(d) + '</span></button>';
      }

      // ── el plan ──
      var plan = card(cardHead('Tu plan', 'Contratación gestionada por D-Code Partners'),
        rejilla([campo('Plan', '<b>Finance con inteligencia</b>'), campo('Estado', pill('Activo')),
                 campo('Usuarios', '3 / 5'), campo('Renovación', 'Mensual')]) +
        '<div class="fdemo-franja"><p class="fdemo-franja-t">Incluido en tu plan</p><div class="fdemo-chips">' +
        ['Facturación y cobros','Gastos y pagos','Pregunta a Finanzas','Lectura de documentos','Radar y objetivos','Registro VERI*FACTU'].map(chip).join('') +
        '</div></div>');

      // ── datos fiscales ──
      var fiscal = card(cardHead('Datos fiscales de tu empresa', 'Los que van en cada factura y en su registro. Sin ellos, una factura emitida no entra en la cadena.'),
        '<div class="fdemo-form">' +
        '<label class="fdemo-campo"><span class="fdemo-campo-l">Razón social</span>' +
        '<input class="fdemo-input" value="D-Code Partners, S.L." data-action="plan" data-plan="editar" readonly></label>' +
        '<label class="fdemo-campo"><span class="fdemo-campo-l">NIF</span>' +
        '<input class="fdemo-input" value="B00000000" data-action="plan" data-plan="editar" readonly></label>' +
        '<label class="fdemo-campo fdemo-campo--ancho"><span class="fdemo-campo-l">Domicilio fiscal</span>' +
        '<input class="fdemo-input" value="Calle de ejemplo 1, 28001 Madrid" data-action="plan" data-plan="editar" readonly></label>' +
        '<p class="fdemo-campo-hint fdemo-campo--ancho">En la demo no se guardan: el formulario está para que veas dónde vive cada dato.</p>' +
        '</div>');

      // ── series ──
      var SERIES = [['F','Factura','Ordinarias','2026', true],
                    ['R','Rectificativa','Enlazadas a su original','2026', false],
                    ['P','Presupuesto','No fiscal','2026', false]];
      var series = card(cardHead('Series y numeración', 'La numeración es correlativa DENTRO de cada serie, como exige el art. 6 del RD 1619/2012.'),
        tablaSimple([{t:'Documento'},{t:'Código'},{t:'Descripción'},{t:'Ejercicio'},{t:'Estado'}],
          SERIES.map(function (s) {
            return '<tr><td>' + esc(s[1]) + '</td><td><code>' + esc(s[0]) + '</code></td>' +
              '<td class="is-muted">' + esc(s[2]) + '</td><td class="is-muted">' + esc(s[3]) + '</td>' +
              '<td>' + pill('Activa') + (s[4] ? ' <span class="fdemo-defecto">por defecto</span>' : '') + '</td></tr>';
          }).join(''), ''));

      // ── notificaciones ──
      var REGLAS = [['Primer recordatorio tras el vencimiento','7'],['Segundo recordatorio','15'],['Aviso a dirección si sigue sin cobrarse','30']];
      var noti = card(cardHead('Notificaciones', 'A dónde van los avisos y cuándo se recuerda una factura'),
        '<div class="fdemo-card-body"><ul class="fdemo-reglas">' + REGLAS.map(function (r) {
          return '<li><span class="fdemo-regla-t">' + esc(r[0]) + '</span>' +
            '<span class="fdemo-regla-n"><b>' + r[1] + '</b> días</span>' +
            '<span class="fdemo-interruptor es-on" data-action="plan" data-plan="editar" role="switch" aria-checked="true"><i></i></span></li>';
        }).join('') + '</ul></div>');

      // ── claves de API ──
      var api = card(cardHead('Claves de API', 'Para conectar automatizaciones. Cada clave lleva un rol, y el rol decide qué puede hacer quien la use.'),
        tablaSimple([{t:'Nombre'},{t:'Rol'},{t:'Termina en'},{t:'Creada'},{t:'Último uso'}],
          '<tr><td>Integración con la web</td><td>' + pill('Finanzas') + '</td><td><code>…4f2a</code></td>' +
          '<td class="is-muted">hace 3 meses</td><td class="is-muted">hace 2 días</td></tr>', '') +
        '<div class="fdemo-card-body"><button type="button" class="fdemo-btn variant-secondary" data-action="plan" data-plan="api">Crear una clave</button></div>');

      // ── tema ──
      var tema = card(cardHead('Tema', 'Es tuyo, no de la empresa: te acompaña en cualquier dispositivo donde entres.'),
        '<div class="fdemo-card-body"><div class="fdemo-opciones">' +
        opcion('Claro', 'Lo que ves ahora al entrar. Pensado para trabajar de día.', true) + opcion('Oscuro', 'Mismo contraste, menos luz. Para quien trabaja de noche.', false) + '</div></div>');

      // ── roles: tres columnas legibles, no setenta chips ──
      var ROLES = [
        ['Owner', 'Todo, incluido invitar y dar de baja a personas', 'Todo'],
        ['Administrador', 'Todo salvo la propiedad de la cuenta', 'Todo'],
        ['Dirección', 'Ver todo y decidir; no toca la configuración fiscal', 'Ver y decidir'],
        ['Finanzas', 'Facturar, cobrar, gastar y cerrar', 'Operar'],
        ['Operaciones', 'Ver y crear documentos; no ve márgenes', 'Documentos'],
        ['Solo lectura', 'Ver. Nada más.', 'Solo ver']
      ];
      var roles = card(cardHead('Roles y permisos', 'Qué puede hacer cada rol. El permiso se comprueba por módulo y por acción.'),
        tablaSimple([{t:'Rol'},{t:'Qué puede hacer'},{t:'Alcance'}],
          ROLES.map(function (r) {
            return '<tr><td>' + esc(r[0]) + '</td><td class="is-muted">' + esc(r[1]) + '</td>' +
              '<td>' + chip(r[2]) + '</td></tr>';
          }).join(''), ''));

      var sesion = card(cardHead('Sesión actual'),
        rejilla([campo('Usuario', 'Cuenta de demostración'), campo('Rol', pill('Administrador')),
                 campo('Organización', 'D-Code Partners'), campo('Origen de datos', pill('Datos de muestra'))]));

      return '<div class="fdemo-panel fdemo-conf">' +
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Ajustes</p>' +
        '<h1 class="fdemo-page-title">Configuración</h1>' +
        '<p class="fdemo-page-sub">Tu empresa, tus series, quién entra, a dónde van los avisos y con qué se integra.</p></div></div>' +
        plan + fiscal + series + noti + api + tema + roles + sesion +
        '</div>';
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
      if (clipEl) { e.preventDefault(); abreCajon(); return; }
      var opEl = e.target.closest('[data-action="doc-op"]');
      if (opEl) { e.preventDefault(); sueltaDoc(opEl.getAttribute('data-k')); return; }
      if (e.target.closest('[data-action="doc-mio"]')) {
        e.preventDefault(); state.docCajon = false;
        muro('Leer tus propios documentos va en el plan con inteligencia', 'Aquí puedes soltar los cuatro documentos de ejemplo y ver exactamente qué hace con ellos. Con tu plan contratado, lo mismo pero con los tuyos: PDFs, fotos, Excel, lo que llegue.');
        return;
      }
      if (e.target.closest('[data-action="alta"]')) { e.preventDefault(); daDeAlta(); return; }
      if (e.target.closest('[data-action="plan"]')) {
        e.preventDefault();
        muro('Leer tus propios documentos va en el plan con inteligencia', 'Aquí puedes soltar los cuatro documentos de ejemplo y ver exactamente qué hace con ellos. Con tu plan contratado, lo mismo pero con los tuyos: PDFs, fotos, Excel, lo que llegue.');
        return;
      }
      if (e.target.closest('[data-action="muro-cerrar"]') ||
          (e.target.getAttribute && e.target.getAttribute('data-action') === 'muro-fuera')) {
        e.preventDefault(); state.muro = null; render(); return;
      }
      var askEl = e.target.closest('[data-action="ask"]');
      if (askEl) {
        e.preventDefault();
        askIndex(Number(askEl.getAttribute('data-idx')));
        return;
      }
      var planesEl = e.target.closest('[data-action="planes"]');
      if (planesEl) {
        /* Embebido, el marco de la demo esta DENTRO de la pagina: el enlace
           no debe navegar, tiene que sacar a la persona del marco y llevarla
           a los planes de la misma pagina, suavemente. */
        e.preventDefault();
        var destino = document.getElementById('planes');
        if (destino) destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
          // Sin coincidencia no se improvisa NI se pide perdón: se enseña
          // lo que hace el sistema de verdad y se ofrece verlo. Un «no puedo»
          // a secas es una puerta cerrada; esto es un escaparate.
          muro('Escribir tus propias preguntas va en el plan con inteligencia',
               'Esta demo contesta a las ocho preguntas de abajo, calculadas sobre datos inventados. Sobre los datos de tu empresa contesta a cualquiera, y cada respuesta trae de dónde ha salido la cifra.');
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
    /* EL GUION. Antes eran nueve diapositivas: cambiar de pantalla y esperar.
       Una aplicacion no se demuestra cambiando de pantalla, se demuestra
       USANDOLA. Ahora cada parada hace algo que se ve —escribe en un buscador
       y la tabla se encoge, abre una factura, pulsa un aviso del radar,
       suelta un PDF y lo da de alta— y la mano va al sitio exacto donde se
       pulsa, llega, pulsa, y SOLO DESPUES cambia la pantalla.

       `sel` manda a la mano a un sitio concreto; sin `sel` va al modulo del
       menu. `quieto` significa que ese paso no cambia de pantalla. */
    var TOUR = [
      { v: 'dashboard', ms: 6000, dice: 'El panel: la frase de arriba ya dice qué pasa' },
      { v: 'dashboard', ms: 2400, dice: 'Y cada cifra lleva a de dónde sale', quieto: true,
        sel: '.fdemo-kpi2.t-critico', hace: 'pulsa' },
      { v: 'cobros',    ms: 5000, dice: 'Cobros: quién debe, desde cuándo y cuánto', quieto: true },

      { v: 'facturas',  ms: 2600, dice: 'Las facturas, las ciento doce' },
      { v: 'facturas',  ms: 3400, dice: 'Buscamos un cliente…', quieto: true,
        sel: '[data-role="factura-filter"] input', hace: 'escribe', texto: 'Vandria' },
      { v: 'facturas',  ms: 2800, dice: '…y la tabla se queda con lo suyo', quieto: true },
      { v: 'facturas',  ms: 2600, dice: 'Abrimos una', quieto: true,
        sel: 'tbody tr:first-child .fdemo-link', hace: 'pulsa' },
      { v: 'facturas',  ms: 4200, dice: 'Con su cliente, su proyecto y su cobro', quieto: true },
      { v: 'facturas',  ms: 2000, dice: 'Y se vuelve', quieto: true, hace: 'limpia' },

      { v: 'radar',     ms: 4600, dice: 'Radar: cada aviso con el umbral que lo dispara' },
      { v: 'objetivos', ms: 4600, dice: 'Objetivos: seis metas y la regla de cada una' },
      { v: 'tesoreria', ms: 4600, dice: 'Tesorería: semana a semana, no un número a 30 días' },
      { v: 'gastos',    ms: 3600, dice: 'Los gastos, con su proveedor y su categoría' },

      { v: 'ia',        ms: 2600, dice: 'Y esto es lo que no hace nadie más', hace: 'abrir' },
      { v: 'ia',        ms: 2200, dice: 'Le soltamos un PDF con veinte facturas dentro…', hace: 'remesa', quieto: true },
      { v: 'ia',        ms: 5400, dice: '…y las va sacando una a una', quieto: true },
      { v: 'ia',        ms: 2600, dice: 'Las da de alta todas', hace: 'alta', quieto: true },
      { v: 'facturas',  ms: 3000, dice: 'Ahí están, en Facturas' },
      { v: 'facturas',  ms: 3600, dice: 'Y cada una sabe de qué página del PDF ha salido', quieto: true,
        sel: 'tbody tr.is-nuevo:first-child .fdemo-link', hace: 'pulsa' },
      { v: 'facturas',  ms: 4800, dice: 'Eso es lo que se puede revisar sin abrir el documento', quieto: true }
    ];
    var REANUDA_MS = 4500;
    var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var tour = { on: false, i: 0, t0: 0, dur: 1, timer: 0, raf: 0, vuelta: 0, visible: false, mano: false, yo: false, yoT: 0 };
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
      if (tourTxtEl && !tour.on) tourTxtEl.textContent = 'Lo llevas tú';
      if (tourTxtEl && tour.on && !tourTxtEl.textContent) tourTxtEl.textContent = 'Recorrido automático';
      if (tourBtnEl) tourBtnEl.setAttribute('title', tour.on ? 'Parar el recorrido y navegar tú' : 'Volver al recorrido automático');
      if (!tour.on && tourBarEl) tourBarEl.style.transform = 'scaleX(0)';
    }
    /* Escribir de verdad, letra a letra. Rellenar el campo de golpe no se
       lee como alguien escribiendo: se lee como un pegado. 55 ms por letra
       es la velocidad a la que se reconoce que hay alguien tecleando. */
    var escribeT = 0;
    /* Todo lo que hace el propio recorrido pasa por aqui. Mientras dura, los
       eventos que salgan del marco no cuentan como «alguien ha llegado». */
    function actuaElRecorrido(fn) {
      tour.yo = true;
      clearTimeout(tour.yoT);
      try { fn(); } finally {
        tour.yoT = setTimeout(function () { tour.yo = false; }, 160);
      }
    }
    function escribeEn(selector, texto, hecho) {
      var campo = root.querySelector(selector);
      if (!campo) { hecho(); return; }
      actuaElRecorrido(function () { campo.focus({ preventScroll: true }); });
      campo.value = '';
      var i = 0;
      clearInterval(escribeT);
      escribeT = setInterval(function () {
        if (!tour.on) { clearInterval(escribeT); return; }
        actuaElRecorrido(function () { campo.value = texto.slice(0, ++i); });
        if (i >= texto.length) {
          clearInterval(escribeT);
          /* El filtro de facturas se envía; el estado vive en `state`, así
             que se escribe ahí y se repinta, que es lo que hace el submit. */
          state.facturaFiltro.q = texto;
          render();
          hecho();
        }
      }, 55);
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
        if (!paso.quieto) {
          state.route = paso.v; state.id = null;
          /* Al empezar una vuelta nueva se limpia lo que dejó la anterior:
             el filtro escrito, la ficha abierta y el cajón de documentos. */
          if (tour.i === 1) { state.facturaFiltro.q = ''; state.facturaFiltro.estado = ''; state.docCajon = false; }
          render();
        }
        if (paso.hace === 'abrir') { state.docCajon = true; render(); }
        if (paso.hace === 'remesa') { sueltaDoc('remesa'); }
        if (paso.hace === 'alta') { if (state.lector && state.lector.fase === 'leido') daDeAlta(); }
        if (paso.hace === 'limpia') { state.id = null; state.facturaFiltro.q = ''; render(); }
        if (paso.hace === 'pulsa') {
          /* Pulsar DE VERDAD el elemento al que ha ido la mano. Simular el
             efecto sin pulsar el botón es exactamente lo que hace que una
             demo se note falsa. */
          var el = root.querySelector(paso.sel);
          if (el) actuaElRecorrido(function () { el.click(); });
        }
        if (paso.hace === 'escribe') { escribeEn(paso.sel, paso.texto, sigue); return; }
        sigue();
      }
      /* La mano va al sitio exacto: al elemento que dice el paso si lo dice,
         al botón concreto si el paso pulsa algo del lector, y al módulo del
         menú en cualquier otro caso. */
      var destino = paso.sel ? paso.sel
                  : paso.hace === 'remesa' ? '[data-action="doc-op"][data-k="remesa"]'
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
      clearInterval(escribeT);
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
    /* MEDIDO: el recorrido se paraba SOLO. Al escribir en el buscador, el
       `focus()` dispara un `focusin`, y al pulsar una fila el `.click()`
       dispara un `pointerdown`... que esta misma funcion leia como «ha
       llegado una persona» y le entregaba el mando a nadie. La diferencia
       esta en el propio evento: lo que hace el navegador por orden del
       codigo llega con isTrusted false; lo que hace una persona, true. */
    function manoEncima(e) {
      /* MEDIDO: `isTrusted` NO sirve para esto. Significa «lo ha generado el
         navegador», no «lo ha hecho una persona»: un focus() por codigo
         produce un focusin con isTrusted true, y el recorrido se paraba solo
         justo al escribir en el buscador. La marca `tour.yo` la pone el
         propio recorrido mientras actua, y se quita sola. */
      if (tour.yo) return;
      if (e && e.isTrusted === false) return;
      if (tour.on) paraTour(true);
      else if (tour.mano) { clearTimeout(tour.vuelta); tour.vuelta = setTimeout(function () { tour.mano = false; arrancaTour(true); }, REANUDA_MS); }
    }
    ['pointerdown', 'keydown', 'wheel', 'focusin', 'touchstart'].forEach(function (ev) {
      root.addEventListener(ev, manoEncima, { passive: true });
    });
    root.addEventListener('pointermove', function (e) {
      if (e.isTrusted === false) return;
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
