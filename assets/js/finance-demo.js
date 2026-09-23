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

  // Lo que el producto puede decir HOY de VERI*FACTU y de la conciliación.
  // Lo escribe scripts/build-estado.mjs a partir de estado-producto.json y
  // check:estado falla si alguien lo toca a mano: el estado no se redacta,
  // se demuestra.
  /*estado:constante*/var ESTADO_PRODUCTO = {"verifactu":"preparado","conciliacion":"planificada","qr":false};/*/estado:constante*/
  var VF_N = { "preparado": 1, "en-validacion": 2, "integrado": 3, "operativo": 4 }[ESTADO_PRODUCTO.verifactu] || 1;
  var VF_ETIQUETA = ['Preparado para VERI*FACTU', 'Integración VERI*FACTU en validación', 'VERI*FACTU integrado', 'VERI*FACTU operativo'][VF_N - 1];
  var CONC_LISTA = ESTADO_PRODUCTO.conciliacion === "disponible";
  var CONC_CUANDO = { "planificada": 'llega próximamente', "en-desarrollo": 'se está construyendo', "en-pruebas": 'está en pruebas', "disponible": 'ya está' }[ESTADO_PRODUCTO.conciliacion];
  var CONC_ETIQUETA = { "planificada": 'Próximamente', "en-desarrollo": 'En desarrollo', "en-pruebas": 'En pruebas', "disponible": 'Disponible' }[ESTADO_PRODUCTO.conciliacion];
  // La remisión a la AEAT, contada según el estado: nunca «al día» si no se remite.
  var REMISION = [
    { tono: '', valor: 'Siguiente paso', hint: 'todavía no se envía nada a la AEAT', pill: 'Aún no se remite' },
    { tono: '', valor: 'En pruebas', hint: 'solo al entorno de pruebas de la AEAT', pill: 'Solo en pruebas' },
    { tono: 'positivo', valor: 'Validada', hint: 'falta el paso a producción', pill: 'Pendiente de producción' },
    { tono: 'positivo', valor: 'Al día', hint: 'nada pendiente de enviar', pill: 'Remitida' }
  ][VF_N - 1];

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
      '<button type="button" class="fdemo-buscar" data-action="paleta" aria-label="Buscar en todo (Ctrl o ⌘ + K)">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5" stroke-linecap="round"/></svg>' +
      '<span>Buscar</span><kbd>⌘K</kbd></button>' +
      '<button type="button" class="fdemo-campana" data-action="avisos" aria-label="Avisos">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2H4.5l1.5-2Z" stroke-linejoin="round"/><path d="M10 20.5a2 2 0 0 0 4 0" stroke-linecap="round"/></svg>' +
      '<b data-role="campana-n" hidden></b></button>' +
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
      '<div class="fdemo-toast" data-role="toast" role="status" aria-live="polite"><i aria-hidden="true"></i><span></span></div>' +
      '<div class="fdemo-capa" data-role="capa"></div>' +
      '</div>' +
      /* LA MANO DEL RECORRIDO. Vive fuera del contenido porque se mueve
         sobre la aplicación entera —del menú a la pantalla— y porque así
         no la borra ningún re-render. No recibe eventos: es un dibujo. */
      '<span class="fdemo-foco" data-role="foco" aria-hidden="true"></span>' +
      '<span class="fdemo-mano" data-role="mano" aria-hidden="true">' +
      '<i class="fdemo-mano-estela"></i><i class="fdemo-mano-nucleo"></i></span>';

    var sidebarEl = root.querySelector('[data-role="sidebar"]');
    var overlayEl = root.querySelector('[data-role="overlay"]');
    var mainEl = root.querySelector('[data-role="main"]');
    var contentEl = root.querySelector('[data-role="content"]');
    var menuBtn = root.querySelector('[data-role="menu-btn"]');

    var state = { doc: { fase: 'inicio', archivo: null, t: 0 }, gastoNuevo: null, route: 'dashboard', id: null, facturaFiltro: { q: '', estado: '', chip: 'todas' },
      tabs: {}, cobrados: {}, enviados: {}, eventos: {}, te: { h: 60, e: 'base', saldo: '' }, orden: {}, capa: null,
      paleta: { q: '', sel: 0, rs: [] }, leidos: {}, vistaRapida: null, borrador: null, clienteFiltro: { q: '' }, ia: { mensajes: [], enviando: false },
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
      state.vistaRapida = null;
      if (state.capa) { state.capa = null; pintaCapa(); }
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
        tabla.querySelectorAll('thead th').forEach(function (th) {
          if (th.textContent.trim() && tabla.querySelectorAll('tbody tr').length > 1) { th.classList.add('es-ordenable'); th.tabIndex = 0; }
        });
        if (!cabeceras.length) return;
        tabla.querySelectorAll('tbody tr').forEach(function (fila) {
          [].forEach.call(fila.children, function (celda, i) {
            if (cabeceras[i]) celda.setAttribute('data-col', cabeceras[i]);
          });
        });
      });
    }

    function render(quieto) {
      var r = parseRoute();
      setActiveNav(r.view);
      var renderer = RENDERERS[r.view] || RENDERERS.dashboard;
      /* Una accion DENTRO de una pantalla —cambiar de pestaña, conciliar un
         movimiento, reclamar una factura— repinta, pero no puede devolver a
         la persona arriba del todo: pierde el sitio y parece que la pagina
         se ha recargado. Solo el cambio de pantalla vuelve arriba. */
      var y = mainEl.scrollTop;
      contentEl.innerHTML = renderer(r.id);
      etiquetarTablas();
      ordenaTablas();
      pintaCampana();
      mainEl.scrollTop = quieto ? y : 0;
    }
    function repinta() { render(true); }

    /* LOS AVISOS. Cada accion que no navega tiene que contestar algo: un
       boton que no dice nada al pulsarlo es un boton roto. */
    var toastT = 0;
    function toast(texto, tono) {
      var t = root.querySelector('[data-role="toast"]');
      if (!t) return;
      t.className = 'fdemo-toast is-on t-' + (tono || 'ok');
      t.querySelector('span').textContent = texto;
      clearTimeout(toastT);
      toastT = setTimeout(function () { t.className = 'fdemo-toast'; }, 2600);
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

    /* EL DONUT. Parte de un todo, así que es un donut y no unas barras;
       seis porciones como mucho y el resto en «Otras» —un séptimo color
       inventado no se distingue de nada—. Paleta validada con el comprobador
       de daltonismo (pasa; el par más justo, 6,9, va con huecos de 2 px
       entre porciones y cada una con su nombre y su cifra en la leyenda,
       así que nunca depende solo del color). */
    /* Nombre de archivo a partir de un nombre con tildes: «Gestoría» tiene
       que dar «gestoria», no «gestor-a». */
    function slug(t) {
      return String(t || 'documento').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    var DONUT_COL = ['#2f5fe0', '#eb6834', '#1a9aa6', '#d55181', '#6337c9', '#e0a100'];
    function donut(datos, opc) {
      opc = opc || {};
      var orden = datos.slice().sort(function (a, b) { return b.v - a.v; });
      var top = orden.slice(0, 6), resto = orden.slice(6);
      if (resto.length) top.push({ k: 'Otras', v: resto.reduce(function (a, d) { return a + d.v; }, 0), otras: true });
      var total = top.reduce(function (a, d) { return a + d.v; }, 0) || 1;
      var R = 62, r = 40, C = 80, a0 = -Math.PI / 2, GAP = 0.018;
      var arcos = top.map(function (d, i) {
        var ang = (d.v / total) * Math.PI * 2;
        var ini = a0 + GAP / 2, fin = a0 + ang - GAP / 2;
        a0 += ang;
        if (fin <= ini) return '';
        var g = fin - ini > Math.PI ? 1 : 0;
        var p = function (rad, t) { return (C + Math.cos(t) * rad).toFixed(2) + ' ' + (C + Math.sin(t) * rad).toFixed(2); };
        var col = d.otras ? '#a3a6ad' : DONUT_COL[i % DONUT_COL.length];
        return '<path class="fdemo-donut-s" d="M ' + p(R, ini) + ' A ' + R + ' ' + R + ' 0 ' + g + ' 1 ' + p(R, fin) +
          ' L ' + p(r, fin) + ' A ' + r + ' ' + r + ' 0 ' + g + ' 0 ' + p(r, ini) + ' Z" fill="' + col + '">' +
          '<title>' + esc(d.k) + ': ' + EUR(d.v) + ' · ' + Math.round(d.v / total * 100) + ' %</title></path>';
      }).join('');
      var leyenda = top.map(function (d, i) {
        var col = d.otras ? '#a3a6ad' : DONUT_COL[i % DONUT_COL.length];
        return '<li><span class="pt" style="background:' + col + '"></span><span class="et">' + esc(d.k) + '</span>' +
          '<b>' + EUR(d.v) + '</b><i>' + Math.round(d.v / total * 100) + ' %</i></li>';
      }).join('');
      return '<div class="fdemo-donut">' +
        '<svg viewBox="0 0 160 160" role="img" aria-label="' + esc(opc.titulo || 'Reparto') + '">' + arcos +
        '<text x="80" y="76" text-anchor="middle" class="fdemo-donut-k">' + esc(opc.centro || 'Total') + '</text>' +
        '<text x="80" y="94" text-anchor="middle" class="fdemo-donut-v">' + esc(EUR(total).replace(/,\d\d(?=\s?€)/, '')) + '</text></svg>' +
        '<ul class="fdemo-donut-l">' + leyenda + '</ul></div>';
    }

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
         semana que viene salen 4.200 y no entra nada, si.

         MEDIDO: con solo los documentos ya emitidos, tres de cada seis
         semanas salian a 0,00 €, porque lo que se cobra y se paga cada mes
         todavia no tiene factura. Eso es exactamente lo que hace una
         prevision de tesoreria de verdad: proyectar lo RECURRENTE —las cuotas
         mensuales de los clientes y los gastos fijos— a partir de su propio
         historial. Va marcado como «previsto» para que no se confunda con lo
         que ya esta emitido. */
      var DIA = 86400000, H0 = Date.parse(FS.hoy);
      var previstos = [];
      var cuotasCli = FS.listClientes().filter(function (c) { return c.cuotaMensual > 0 && c.estado === 'cliente'; });
      var totalCuotas = cuotasCli.reduce(function (a, c) { return a + c.cuotaMensual; }, 0);
      var ultimaCuota = FS.listFacturas().filter(function (x) { return x.fechaEmision; })
        .map(function (x) { return x.fechaVencimiento; }).sort().pop() || FS.hoy;
      [1, 2, 3].forEach(function (k) {
        var d = new Date(H0); d.setUTCMonth(d.getUTCMonth() + k); d.setUTCDate(2);
        var iso = d.toISOString().slice(0, 10);
        if (iso > ultimaCuota) previstos.push({ fecha: iso, importe: totalCuotas, tipo: 'entra', n: cuotasCli.length, q: cuotasCli.length + ' cuotas mensuales' });
      });
      var fijos = {};
      FS.listGastos().filter(function (g) { return /cuota mensual/.test(g.concepto || ''); }).forEach(function (g) {
        var k = g.proveedor;
        if (!fijos[k] || g.fechaGasto > fijos[k].fechaGasto) fijos[k] = g;
      });
      Object.keys(fijos).forEach(function (k) {
        var g = fijos[k], plazo = Math.round((Date.parse(g.fechaVencimiento) - Date.parse(g.fechaGasto)) / DIA);
        for (var m = 1; m <= 3; m++) {
          var d = new Date(Date.parse(g.fechaGasto)); d.setUTCMonth(d.getUTCMonth() + m);
          var v = new Date(d.getTime() + plazo * DIA).toISOString().slice(0, 10);
          if (v > FS.hoy) previstos.push({ fecha: v, importe: g.importe, tipo: 'sale', q: k });
        }
      });

      /* LA CURVA DE CAJA. Es la pantalla del producto: 30, 60 o 90 días;
         escenario base (cada compromiso el día que dice su documento) o
         prudente (cada cliente cobra con el retraso que se le ha medido); y
         el saldo del banco SOLO si lo declara quien lo sabe. Sin saldo, la
         curva es VARIACIÓN de caja y lo dice: fabricar un saldo en un sistema
         financiero es inaceptable, y el producto se niega a hacerlo. */
      var TE = state.te;
      var retCache = {};
      function retCli(cid) { if (!(cid in retCache)) retCache[cid] = retrasoMedido(cid); return retCache[cid]; }
      var retsCuota = cuotasCli.map(function (c) { return retCli(c.id); }).filter(function (x) { return x != null; }).sort(function (a, b) { return a - b; });
      var retGlobal = retsCuota.length ? retsCuota[Math.floor(retsCuota.length / 2)] : 0;
      var eventos = [], sinFecha = [];
      fac.forEach(function (x) {
        if (state.cobrados[x.id]) return;
        var p = FS.pendienteDe(x); if (p <= 0) return;
        var r = retCli(x.clienteIds[0]);
        var ya = x.fechaVencimiento < FS.hoy;
        var fecha = x.fechaVencimiento;
        if ((ya || TE.e === 'prudente') && r) fecha = masDias(x.fechaVencimiento, r);
        if (ya && (!r || fecha < FS.hoy)) { sinFecha.push(x); return; }
        eventos.push({ f: fecha, v: p, q: x.numero });
      });
      gas.forEach(function (g) {
        var fecha = g.fechaVencimiento || g.fechaGasto;
        if (fecha <= FS.hoy) fecha = masDias(FS.hoy, 1);
        eventos.push({ f: fecha, v: -g.importe, q: g.proveedor });
      });
      previstos.forEach(function (p) {
        var fecha = p.tipo === 'entra' && TE.e === 'prudente' && retGlobal ? masDias(p.fecha, retGlobal) : p.fecha;
        eventos.push({ f: fecha, v: p.tipo === 'entra' ? p.importe : -p.importe, q: p.q, previsto: true });
      });
      var HZ = TE.h, saldo0 = String(TE.saldo || '').trim() === '' ? null : numeroDe(TE.saldo);
      var serieC = [], accC = saldo0 || 0, entraC = 0, saleC = 0, nEC = 0, nSC = 0;
      for (var dd = 0; dd <= HZ; dd++) {
        var isoD = masDias(FS.hoy, dd);
        eventos.forEach(function (e) {
          if (e.f !== isoD) return;
          accC += e.v;
          if (e.v > 0) { entraC += e.v; nEC++; } else { saleC -= e.v; nSC++; }
        });
        serieC.push({ f: isoD, v: r2(accC) });
      }
      var minC = serieC.reduce(function (a, x) { return x.v < a.v ? x : a; }, serieC[0]);
      var finC = serieC[serieC.length - 1].v;
      var tSinFecha = sinFecha.reduce(function (a, x) { return a + FS.pendienteDe(x); }, 0);

      function curvaSvg() {
        /* El ancho del dibujo es el del hueco donde se pinta: con un
           viewBox fijo, el texto de los ejes crecía con la pantalla. */
        var W = Math.max(520, Math.min(1400, (contentEl.clientWidth || 900) - 70)), Hh = 250, L = 70, R = 20, T = 24, B = 32;
        var vals = serieC.map(function (x) { return x.v; });
        var lo = Math.min.apply(null, vals.concat(saldo0 == null ? [0] : [])), hi = Math.max.apply(null, vals.concat(saldo0 == null ? [0] : []));
        var paso = Math.pow(10, Math.floor(Math.log10(Math.max(1, (hi - lo) / 4))));
        [1, 2, 2.5, 5, 10].some(function (m) { if ((hi - lo) / (paso * m) <= 4) { paso = paso * m; return true; } return false; });
        lo = Math.floor(lo / paso) * paso; hi = Math.ceil(hi / paso) * paso; if (hi === lo) hi = lo + paso;
        function X(i) { return L + i / (serieC.length - 1) * (W - L - R); }
        function Y(v) { return T + (1 - (v - lo) / (hi - lo)) * (Hh - T - B); }
        var linea = serieC.map(function (x, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(x.v).toFixed(1); }).join(' ');
        var area = linea + ' L' + X(serieC.length - 1).toFixed(1) + ' ' + (Hh - B) + ' L' + L + ' ' + (Hh - B) + ' Z';
        var y0 = Y(0), rejilla = '';
        for (var v = lo; v <= hi + 0.001; v += paso) {
          rejilla += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) + '" class="' + (Math.abs(v) < 0.001 ? 'es-cero' : '') + '"/>' +
            '<text x="' + (L - 8) + '" y="' + (Y(v) + 4).toFixed(1) + '" text-anchor="end">' + esc(EUR(v).replace(/,00(?=\s?€)/, '')) + '</text>';
        }
        var cada = HZ <= 30 ? 7 : 15, ejeX = '';
        for (var i = 0; i < serieC.length; i += cada) {
          ejeX += '<text x="' + X(i).toFixed(1) + '" y="' + (Hh - 9) + '" text-anchor="' + (i === 0 ? 'start' : 'middle') + '">' + (i === 0 ? 'Hoy' : fechaCorta(serieC[i].f)) + '</text>';
        }
        var iMin = serieC.indexOf(minC), xm = X(iMin), ym = Y(minC.v);
        var etiq = 'Punto más bajo · ' + EUR(minC.v) + ' · ' + (minC.f === FS.hoy ? 'hoy' : fechaCorta(minC.f));
        var anch = xm > W * 0.72 ? 'end' : xm < W * 0.28 ? 'start' : 'middle';
        var neg = y0 >= T && y0 <= Hh - B;
        return '<svg class="fdemo-curva-svg" viewBox="0 0 ' + W + ' ' + Hh + '" role="img" aria-label="' + esc((saldo0 == null ? 'Variación de caja' : 'Saldo de caja') + ' día a día durante ' + HZ + ' días; ' + etiq) + '"' +
          ' data-serie="' + esc(JSON.stringify(serieC.map(function (x) { return x.v; }))) + '" data-f0="' + FS.hoy + '" data-l="' + L + '" data-r="' + R + '" data-t="' + T + '" data-b="' + B + '" data-lo="' + lo + '" data-hi="' + hi + '">' +
          '<defs><linearGradient id="fdemoCurvaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f5fe0" stop-opacity=".22"/><stop offset="1" stop-color="#2f5fe0" stop-opacity="0"/></linearGradient>' +
          (neg ? '<clipPath id="fdemoSobre"><rect x="0" y="0" width="' + W + '" height="' + y0.toFixed(1) + '"/></clipPath><clipPath id="fdemoBajo"><rect x="0" y="' + y0.toFixed(1) + '" width="' + W + '" height="' + (Hh - y0).toFixed(1) + '"/></clipPath>' : '') +
          '</defs>' +
          '<g class="fdemo-curva-rej">' + rejilla + '</g>' +
          '<path d="' + area + '" fill="url(#fdemoCurvaG)"/>' +
          (neg ? '<path d="' + linea + '" class="fdemo-curva-l" clip-path="url(#fdemoSobre)"/><path d="' + linea + '" class="fdemo-curva-l es-neg" clip-path="url(#fdemoBajo)"/>'
               : '<path d="' + linea + '" class="fdemo-curva-l' + (hi <= 0 ? ' es-neg' : '') + '"/>') +
          '<g class="fdemo-curva-x">' + ejeX + '</g>' +
          '<circle cx="' + xm.toFixed(1) + '" cy="' + ym.toFixed(1) + '" r="5" class="fdemo-curva-min"/>' +
          '<text x="' + xm.toFixed(1) + '" y="' + (ym > T + 26 ? ym - 12 : ym + 20).toFixed(1) + '" text-anchor="' + anch + '" class="fdemo-curva-et">' + esc(etiq) + '</text>' +
          '<g class="fdemo-curva-hover" data-role="curva-hover" style="display:none"><line y1="' + T + '" y2="' + (Hh - B) + '"/><circle r="5"/>' +
          '<rect rx="6" height="40" width="150"/><text class="a"></text><text class="b"></text></g>' +
          '<rect class="fdemo-curva-hit" x="' + L + '" y="' + T + '" width="' + (W - L - R) + '" height="' + (Hh - T - B) + '" fill="transparent"/>' +
          '</svg>';
      }
      var curvaHtml =
        '<div class="fdemo-te-ctrl">' +
        '<div class="fdemo-seg" role="group" aria-label="Horizonte">' + [30, 60, 90].map(function (h) {
          return '<button type="button" class="' + (h === HZ ? 'is-on' : '') + '" aria-pressed="' + (h === HZ) + '" data-action="te-h" data-h="' + h + '">' + h + ' días</button>';
        }).join('') + '</div>' +
        '<div class="fdemo-seg" role="group" aria-label="Escenario">' + [['base', 'Base'], ['prudente', 'Prudente']].map(function (e) {
          return '<button type="button" class="' + (e[0] === TE.e ? 'is-on' : '') + '" aria-pressed="' + (e[0] === TE.e) + '" data-action="te-e" data-e="' + e[0] + '">' + e[1] + '</button>';
        }).join('') + '</div>' +
        '<label class="fdemo-te-saldo"><span>Saldo en banco hoy</span><input class="fdemo-input" data-role="te-saldo" inputmode="decimal" autocomplete="off" placeholder="Escríbelo tú, si quieres" value="' + esc(TE.saldo || '') + '"></label>' +
        '</div>' +
        '<div class="fdemo-kpi-tira es-4">' +
        kpi2({ hero: true, tono: finC >= 0 ? 'positivo' : 'critico', label: saldo0 == null ? 'Variación de caja a ' + HZ + ' días' : 'Saldo dentro de ' + HZ + ' días', valor: EUR(finC), hint: saldo0 == null ? 'lo que entra menos lo que sale' : 'saldo declarado más lo que se mueve' }) +
        kpi2({ tono: minC.v < 0 ? 'critico' : 'neutro', label: 'Punto más bajo', valor: EUR(minC.v), hint: minC.f === FS.hoy ? 'hoy' : 'el ' + FDATE(minC.f) }) +
        kpi2({ tono: 'positivo', label: 'Entra', valor: EUR(r2(entraC)), hint: nEC + ' cobros con fecha', vista: 'cobros' }) +
        kpi2({ tono: 'aviso', label: 'Sale', valor: EUR(r2(saleC)), hint: nSC + ' pagos con fecha', vista: 'pagos' }) +
        '</div>' +
        card(cardHead(saldo0 == null ? 'Variación de caja, día a día' : 'Saldo de caja, día a día', 'Pasa el ratón por la curva para ver cada día'),
          '<div class="fdemo-curva" data-role="curva">' + curvaSvg() + '</div>') +
        '<ul class="fdemo-supuestos">' +
        '<li>' + (saldo0 == null ? 'No hay saldo declarado: la curva es la <b>variación</b> de caja, no el dinero que habrá en el banco. Escríbelo arriba y la curva pasa a ser saldo.' : 'Saldo declarado por ti: ' + EUR(saldo0) + '. No está verificado con el banco y va rotulado como tal.') + '</li>' +
        '<li>' + (TE.e === 'prudente' ? 'Escenario prudente: cada cliente con historial cobra con el retraso que se le ha medido, no el día del vencimiento.' : 'Escenario base: cada compromiso entra o sale el día que le corresponde por documento.') + '</li>' +
        (sinFecha.length ? '<li>' + sinFecha.length + ' factura' + (sinFecha.length > 1 ? 's vencidas no aparecen' : ' vencida no aparece') + ' en la curva (' + EUR(tSinFecha) + '): llevan vencidas más de lo que ese cliente tarda nunca. Se siguen reclamando, pero contarlas como caja sería una previsión optimista.</li>' : '') +
        '<li>Las cuotas mensuales de los clientes y los gastos fijos se proyectan desde su propio historial y cuentan como previstos.</li>' +
        '</ul>';

      var semanas = [];
      for (var w = 0; w < 8; w++) {
        var ini2 = H0 + w * 7 * DIA, fin2 = ini2 + 7 * DIA;
        var entra = 0, sale = 0, nE = 0, nS = 0, nP = 0;
        fac.forEach(function (x) {
          var t = Date.parse(x.fechaVencimiento);
          if (t >= ini2 && t < fin2) { entra += FS.pendienteDe(x); nE++; }
        });
        gas.forEach(function (g) {
          var t = Date.parse(g.fechaVencimiento);
          if (t >= ini2 && t < fin2) { sale += g.importe; nS++; }
        });
        previstos.forEach(function (p) {
          var t = Date.parse(p.fecha);
          if (t >= ini2 && t < fin2) { if (p.tipo === 'entra') { entra += p.importe; nE += p.n || 1; } else { sale += p.importe; nS++; } nP++; }
        });
        semanas.push({ w: w, ini: new Date(ini2).toISOString().slice(0, 10), entra: Math.round(entra * 100) / 100,
                       sale: Math.round(sale * 100) / 100, neto: Math.round((entra - sale) * 100) / 100, nE: nE, nS: nS, nP: nP });
      }
      var acum = 0;
      semanas.forEach(function (x) { acum += x.neto; x.acum = Math.round(acum * 100) / 100; });
      var maxSem = Math.max.apply(null, semanas.map(function (x) { return Math.max(x.entra, x.sale); }).concat([1]));
      var filasSem = semanas.map(function (x) {
        var quieta = !x.nE && !x.nS;
        return '<tr' + (quieta ? ' class="is-quieta"' : '') + '><td><b>' + (x.w === 0 ? 'Esta semana' : 'En ' + x.w + ' semana' + (x.w > 1 ? 's' : '')) + '</b>' +
          '<span class="fdemo-pct">desde el ' + FDATE(x.ini) + (x.nP ? ' · ' + x.nP + ' previsto' + (x.nP > 1 ? 's' : '') : '') + '</span></td>' +
          (quieta
            ? '<td colspan="4" class="is-muted">Semana sin vencimientos: ni cobros ni pagos con fecha en estos siete días.</td>'
            : '<td class="is-right">' + (x.nE ? EUR(x.entra) + '<span class="fdemo-pct">' + x.nE + ' cobro' + (x.nE === 1 ? '' : 's') + '</span>' : '<span class="fdemo-pct">sin cobros</span>') + '</td>' +
              '<td class="is-right">' + (x.nS ? EUR(x.sale) + '<span class="fdemo-pct">' + x.nS + ' pago' + (x.nS === 1 ? '' : 's') + '</span>' : '<span class="fdemo-pct">sin pagos</span>') + '</td>' +
              '<td class="is-right ' + (x.neto < 0 ? 'es-mal' : '') + '"><b>' + EUR(x.neto) + '</b></td>' +
              '<td style="min-width:150px;"><div class="fdemo-apilada">' +
              '<i class="n-ok" style="width:' + Math.round((x.entra / maxSem) * 100) + '%"></i>' +
              '<i class="n-serio" style="width:' + Math.round((x.sale / maxSem) * 100) + '%"></i></div></td>') +
          '<td class="is-right ' + (x.acum < 0 ? 'es-mal' : '') + '">' + EUR(x.acum) + '</td></tr>';
      }).join('');
      var negativas = semanas.filter(function (x) { return x.neto < 0; });

      return '<div class="fdemo-panel">' +
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Caja</p>' +
        '<h1 class="fdemo-page-title">Tesorería</h1>' +
        '<p class="fdemo-page-sub">Lo que entra y lo que sale según las fechas de tus propios documentos. Elige el horizonte, el escenario y, si quieres, el saldo.</p></div></div>' +
        curvaHtml +
        seccion('Ocho semanas, una a una', 'lo emitido más lo recurrente previsto, con el acumulado al lado',
          card('', tablaSimple([{t:'Semana'},{t:'Entra',r:1},{t:'Sale',r:1},{t:'Neto',r:1},{t:''},{t:'Acumulado',r:1}], filasSem, '')), 1) +
        aviso('El saldo del banco no se inventa: o lo declaras tú, o la curva es variación de caja y lo dice. El escenario prudente usa lo que cada cliente tarda de verdad en pagar, porque contar con el día del vencimiento es lo que convierte una previsión en un susto.') +
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
    /* DUPLICADOS. La regla era correcta y la pantalla salia vacia: en los
       gastos YA CONTABILIZADOS no hay ningun duplicado, porque el sistema los
       para antes. Ese es justo el punto. Lo que se enseña aqui es la puerta:
       los documentos que han LLEGADO —por el buzon de correo, por una foto,
       dentro de una remesa— y que coinciden con un gasto que ya esta dentro.
       Se quedan retenidos y no entran en los numeros hasta que alguien
       decide. Por eso los totales del resto de la demo no cambian. */
    function sospechosos() {
      if (state.sospechas) return state.sospechas;
      var gas = FS.listGastos().slice().sort(function (a, b) { return a.fechaGasto < b.fechaGasto ? 1 : -1; });
      var CANAL = [
        { c: 'correo', t: 'Buzón de gastos', i: '✉' },
        { c: 'foto', t: 'Foto desde el móvil', i: '◉' },
        { c: 'remesa', t: 'Dentro de una remesa PDF', i: '▤' },
        { c: 'correo', t: 'Buzón de gastos', i: '✉' },
        { c: 'foto', t: 'Foto desde el móvil', i: '◉' }
      ];
      var vistos = {}, out = [];
      for (var i = 0; i < gas.length && out.length < 5; i++) {
        var g = gas[i];
        if (vistos[g.proveedor] || g.importe < 40) continue;
        vistos[g.proveedor] = 1;
        var k = out.length, prob = k < 3;
        var dias = prob ? (1 + k) : (k === 3 ? 6 : 8);
        var llega = new Date(Date.parse(g.fechaGasto) + dias * 86400000).toISOString().slice(0, 10);
        out.push({
          id: 'dup' + k, gasto: g, canal: CANAL[k], dias: dias, llega: llega,
          archivo: slug(g.proveedor) + '-' + (prob ? 'factura' : 'ticket') + '.pdf',
          importe: g.importe, prob: prob,
          motivos: prob ? ['mismo proveedor', 'mismo importe al céntimo', dias + ' día' + (dias > 1 ? 's' : '') + ' después']
                        : ['mismo proveedor', 'mismo importe', dias + ' días después'],
          estado: 'Retenido'
        });
      }
      state.sospechas = out;
      return out;
    }
    RENDERERS.duplicados = function () {
      var lista = sospechosos();
      var abiertos = lista.filter(function (d) { return d.estado === 'Retenido'; });
      var descartados = lista.filter(function (d) { return d.estado === 'Descartado'; });
      var enJuego = lista.filter(function (d) { return d.estado !== 'Dado de alta'; })
        .reduce(function (a, d) { return a + d.importe; }, 0);
      function fila(d) {
        var abierto = d.estado === 'Retenido';
        return '<tr class="' + (abierto ? '' : 'is-resuelta') + '">' +
          '<td><div class="fdemo-doc-en"><span class="fdemo-canal c-' + d.canal.c + '" aria-hidden="true">' + d.canal.i + '</span>' +
          '<div><b>' + esc(d.archivo) + '</b><i>' + esc(d.canal.t) + ' · llegó el ' + FDATE(d.llega) + '</i></div></div></td>' +
          '<td><span class="fdemo-coincide">' + esc(d.gasto.concepto) + '</span><span class="fdemo-pct">ya registrado el ' + FDATE(d.gasto.fechaGasto) + '</span></td>' +
          '<td class="is-muted">' + esc(d.gasto.proveedor) + '</td>' +
          '<td class="is-right"><b>' + EUR(d.importe) + '</b></td>' +
          '<td><div class="fdemo-chips">' + d.motivos.map(function (m) { return '<span>' + esc(m) + '</span>'; }).join('') + '</div></td>' +
          '<td>' + pill(abierto ? (d.prob ? 'Probable' : 'Posible') : d.estado) + '</td>' +
          '<td class="is-right">' + (abierto
            ? '<div class="fdemo-acts-mini">' +
              '<button type="button" class="fdemo-btn-mini es-accion" data-action="dup-descarta" data-id="' + d.id + '">Es el mismo</button>' +
              '<button type="button" class="fdemo-btn-mini" data-action="dup-alta" data-id="' + d.id + '">Es otro</button></div>'
            : '<span class="fdemo-hecho">' + (d.estado === 'Descartado' ? 'No se paga dos veces' : 'Dado de alta') + '</span>') +
          '</td></tr>';
      }
      var REGLAS = [
        ['Mismo proveedor', 'Se compara el proveedor dado de alta, no el texto del concepto.'],
        ['Mismo importe al céntimo', 'Sin tolerancia: 412,00 € y 412,01 € no son el mismo gasto.'],
        ['Menos de diez días', 'Por encima de eso suele ser una cuota recurrente, no un duplicado.'],
        ['Se para en la puerta', 'Lo que coincide no entra en los números hasta que alguien decide. No hay que ir a deshacer nada.']
      ];
      return '<div class="fdemo-panel">' +
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Control</p>' +
        '<h1 class="fdemo-page-title">Duplicados</h1>' +
        '<p class="fdemo-page-sub">Documentos que han llegado y se parecen demasiado a un gasto que ya está dentro. Se quedan en la puerta.</p></div></div>' +
        '<div class="fdemo-kpi-tira es-4">' +
        kpi2({ hero: true, tono: 'aviso', label: 'Dinero retenido en la puerta', valor: EUR(enJuego), hint: 'lo que costaría pagarlo dos veces' }) +
        kpi2({ tono: abiertos.length ? 'critico' : 'positivo', label: 'Por decidir', valor: String(abiertos.length), hint: 'retenidos hasta que alguien mire' }) +
        kpi2({ label: 'Probables', valor: String(lista.filter(function (d) { return d.prob; }).length), hint: 'tres días o menos' }) +
        kpi2({ tono: 'positivo', label: 'Canales vigilados', valor: '3', hint: descartados.length ? descartados.length + ' ya descartados' : 'correo, fotos y remesas' }) +
        '</div>' +
        seccion('Retenidos en la puerta', 'cada uno con el gasto con el que coincide y por qué',
          card('', tablaSimple([{t:'Documento que ha llegado'},{t:'Coincide con'},{t:'Proveedor'},{t:'Importe',r:1},{t:'Por qué'},{t:'Estado'},{t:'',r:1}],
            lista.map(fila).join(''), '')), 1) +
        seccion('La regla, escrita', 'para que se pueda discutir en vez de creer',
          '<div class="fdemo-nohace-rej">' + REGLAS.map(function (r) {
            return '<article class="fdemo-nohace es-bien"><b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + '</span></article>';
          }).join('') + '</div>', 2) +
        aviso('Ni puntuación, ni modelo, ni caja negra: si un documento se queda retenido, se puede leer exactamente por qué. Y si la regla no encaja con cómo trabajáis, se cambia.') +
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
    /* VERI*FACTU. Dos tarjetas decian «0» —fuera de la cadena, en cola— y un
       cero se lee como vacio aunque sea la mejor noticia de la pantalla. Se
       cuenta al derecho: cuantas estan registradas de cuantas, y un boton que
       COMPRUEBA la cadena delante de quien mira, eslabon a eslabon. */
    RENDERERS.verifactu = function () {
      var fac = FS.listFacturas().filter(function (f) { return f.estado !== 'Borrador'; })
        .slice().sort(function (a, b) { return a.fechaEmision < b.fechaEmision ? -1 : 1; });
      var ult = fac.slice(-12);
      var comp = state.vfComprobado || 0;            // cuántos eslabones lleva comprobados
      var hecho = comp >= ult.length;
      var prev = null;
      var filas = ult.map(function (f, i) {
        var h = huella(f.numero + f.importe), ha = prev || huella('inicio' + f.serie);
        prev = h;
        var ok = i < comp;
        return '<tr class="' + (ok ? 'is-ok' : '') + '"><td><code>' + esc(f.numero) + '</code></td>' +
          '<td class="is-muted">' + FDATE(f.fechaEmision) + '</td>' +
          '<td class="is-right">' + EUR(f.importe) + '</td>' +
          '<td class="is-muted"><code>' + ha + '</code></td>' +
          '<td><code class="fdemo-hash">' + h + '</code></td>' +
          '<td>' + (ok ? '<span class="fdemo-hecho">✓ Enlaza</span>' : pill('Registrada')) + '</td></tr>';
      }).join('');
      var u = fac[fac.length - 1];
      var REG = [
        ['NIF del emisor', 'B00000000'], ['Número y serie', u.numero + ' · serie ' + u.serie],
        ['Fecha de expedición', FDATE(u.fechaEmision)], ['Tipo de factura', 'F1 · completa'],
        ['Cuota total', EUR(u.iva)], ['Importe total', EUR(u.importe)],
        ['Huella anterior', huella(fac[fac.length - 2].numero + fac[fac.length - 2].importe)],
        ['Huella de este registro', huella(u.numero + u.importe)]
      ];
      return '<div class="fdemo-panel">' +
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Obligación fiscal</p>' +
        '<h1 class="fdemo-page-title">Registro fiscal · VERI*FACTU</h1>' +
        '<p class="fdemo-vf-estado" data-vf="' + VF_N + '"><span aria-hidden="true"></span>' + esc(VF_ETIQUETA) + '</p>' +
        '<p class="fdemo-page-sub">Cada factura queda encadenada a la anterior con su huella. Se puede comprobar aquí, delante de quien lo pregunte.</p></div>' +
        '<button type="button" class="fdemo-btn variant-primary" data-action="vf-comprobar">' + (hecho ? 'Volver a comprobar' : 'Comprobar la cadena') + '</button></div>' +
        '<div class="fdemo-kpi-tira es-4">' +
        kpi2({ hero: true, tono: 'positivo', label: 'Registradas', valor: fac.length + ' de ' + fac.length, hint: 'todas las emitidas, sin excepción' }) +
        kpi2({ tono: 'positivo', label: 'La cadena', valor: hecho ? 'Comprobada' : 'Intacta', hint: hecho ? ult.length + ' eslabones revisados ahora' : 'cada huella apunta a la anterior' }) +
        kpi2({ tono: REMISION.tono, label: 'Remisión a la AEAT', valor: REMISION.valor, hint: REMISION.hint }) +
        kpi2({ label: 'Series', valor: 'F · R', hint: 'ordinarias y rectificativas' }) +
        '</div>' +
        (comp > 0 && !hecho ? '<div class="fdemo-progreso"><i style="width:' + Math.round(comp / ult.length * 100) + '%"></i><span>Comprobando eslabón ' + comp + ' de ' + ult.length + '…</span></div>' : '') +
        (hecho ? '<div class="fdemo-ok-banda">✓ ' + ult.length + ' eslabones comprobados · ninguna huella rota · ninguna factura fuera de la cadena</div>' : '') +
        seccion('Los últimos eslabones', 'la huella de cada una apunta a la de la anterior',
          card('', tablaSimple([{t:'Nº'},{t:'Emisión'},{t:'Importe',r:1},{t:'Huella anterior'},{t:'Huella'},{t:'Estado'}], filas, '')), 1) +
        seccion('Un registro por dentro', 'lo que queda guardado de ' + u.numero,
          card(cardHead(u.numero, u.clienteNombre), '<div class="fdemo-field-grid">' +
            REG.map(function (r) { return field(r[0], '<code>' + esc(r[1]) + '</code>'); }).join('') + '</div>'), 2) +
        aviso('Cada factura lleva la huella de la anterior. Por eso se puede contestar a «enséñame que las has registrado todas» sin entrar en la base de datos: si alguien borrara o cambiara una, la cadena se rompe en ese punto y se ve.') +
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
        var serie = [];
        var ev = FS.getEvolucion();
        ev.slice(-6).forEach(function (m) {
          serie.push(g.filter(function (x) { return (x.fechaGasto || '').slice(0, 7) === m.mes; }).reduce(function (a, x) { return a + x.importe; }, 0));
        });
        return { p: p, n: g.length, total: t, sinPagar: sinPagar.reduce(function (a, x) { return a + x.importe; }, 0),
                 ult: ult ? ult.fechaGasto : null, serie: serie };
      }).sort(function (a, b) { return b.total - a.total; });
      var gTotal = provs.reduce(function (a, x) { return a + x.total; }, 0);
      var debiendo = provs.reduce(function (a, x) { return a + x.sinPagar; }, 0);
      var top = provs[0];

      var filas = provs.map(function (x) {
        var pct = gTotal > 0 ? Math.round((x.total / gTotal) * 100) : 0;
        return '<tr><td><b>' + esc(x.p.nombre) + '</b><span class="fdemo-pct">' + esc(x.p.email) + '</span></td>' +
          '<td>' + pill(x.p.categoria || 'Sin categoría') + '</td>' +
          '<td class="is-muted">' + esc(x.p.nif) + '</td>' +
          '<td class="is-muted">' + (x.ult ? FDATE(x.ult) : '<span class="fdemo-pendiente">Recién dado de alta</span>') + '</td>' +
          '<td class="is-right">' + (x.n || '—') + '</td>' +
          '<td style="min-width:90px;">' + (x.n ? chispa(x.serie) : '<span class="fdemo-pct">sin compras aún</span>') + '</td>' +
          '<td class="is-right"><b>' + (x.n ? EUR(x.total) : '—') + '</b></td>' +
          '<td class="is-right">' + (!x.n ? '—' : x.sinPagar > 0 ? '<span class="es-mal">' + EUR(x.sinPagar) + '</span>' : '<span class="fdemo-hecho">Al día</span>') + '</td>' +
          '<td style="min-width:110px;"><div class="fdemo-apilada"><i class="n-serio" style="width:' + pct + '%"></i></div>' +
          '<span class="fdemo-pct">' + pct + ' %</span></td></tr>';
      }).join('');

      var porCat = {};
      gas.forEach(function (g) { porCat[g.categoria || 'Sin categoría'] = (porCat[g.categoria || 'Sin categoría'] || 0) + g.importe; });
      var cats = Object.keys(porCat).sort(function (a, b) { return porCat[b] - porCat[a]; });

      return '<div class="fdemo-panel"><div class="fdemo-panel-h"><div>' +
        '<p class="fdemo-eyebrow">Negocio</p><h1 class="fdemo-page-title">Proveedores</h1>' +
        '<p class="fdemo-page-sub">A quién le compras, cuánto, cómo evoluciona y qué le debes todavía.</p></div>' +
        '<button type="button" class="fdemo-btn variant-secondary" data-action="plan">Nuevo proveedor</button></div>' +
        '<div class="fdemo-kpi-tira es-4">' +
        kpi2({ hero: true, label: 'Gastado en total', valor: EUR(gTotal), hint: gas.length + ' gastos registrados', vista: 'gastos' }) +
        kpi2({ label: 'Proveedores activos', valor: String(provs.length), hint: 'dados de alta con su NIF' }) +
        kpi2({ tono: debiendo > 0 ? 'aviso' : 'positivo', label: 'Por pagar', valor: EUR(debiendo), hint: 'facturas de proveedor pendientes', vista: 'pagos' }) +
        kpi2({ label: 'Mayor proveedor', valor: top ? (gTotal > 0 ? Math.round((top.total / gTotal) * 100) + ' %' : '—') : '—',
               hint: top ? top.p.nombre : '' }) +
        '</div>' +
        '<div class="fdemo-dos">' +
        seccion('En qué se va el dinero', 'por categoría, de todo el histórico', card('', donut(cats.map(function (c) { return { k: c, v: porCat[c] }; }))), 1) +
        seccion('Quién más pesa', 'los cinco primeros', card('', '<div class="fdemo-card-body"><ol class="fdemo-top">' +
          provs.slice(0, 5).map(function (x) {
            var pct = gTotal > 0 ? Math.round((x.total / gTotal) * 100) : 0;
            return '<li><span>' + esc(x.p.nombre) + '</span><div class="fdemo-apilada"><i class="n-serio" style="width:' + pct + '%"></i></div><b>' + EUR(x.total) + '</b></li>';
          }).join('') + '</ol></div>'), 2) +
        '</div>' +
        seccion('Todos los proveedores', 'con su tendencia de los últimos seis meses',
          card('', tablaSimple([{t:'Proveedor'},{t:'Categoría'},{t:'NIF'},{t:'Último gasto'},{t:'Gastos',r:1},{t:'6 meses'},{t:'Total',r:1},{t:'Por pagar',r:1},{t:'Peso'}], filas, '')), 3) +
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
        ['No presenta modelos ante la AEAT', 'Eso lo hace tu gestoría, con estos datos.']
      ];
      if (VF_N < 4) NOHACE.push([
        ['Todavía no remite tus registros a la AEAT', 'Es el siguiente paso de VERI*FACTU: el registro ya se genera y se encadena.'],
        ['Solo remite al entorno de pruebas de la AEAT', 'La remisión real llega cuando esté validada.'],
        ['Todavía no remite en producción', 'La remisión está validada; falta el paso a producción.']
      ][VF_N - 1]);
      if (!ESTADO_PRODUCTO.qr) NOHACE.push(['Todavía no imprime el código QR de cotejo', 'Depende de la especificación oficial de la AEAT.']);
      NOHACE.push(CONC_LISTA
        ? ['No se conecta a tu banco por API', 'El extracto entra como fichero y se concilia contra tus facturas y tus gastos.']
        : ['No está conectado a ningún banco', 'Los cobros se registran en la aplicación. La conciliación bancaria ' + CONC_CUANDO + '.']);
      NOHACE.push(['No hace factura electrónica B2B', 'El formato Facturae con firma no está implementado.']);
      if (VF_N < 4) NOHACE.push(['La declaración responsable, todavía sin firmar', 'Es lo que el fabricante firma sobre su propio sistema, y llega con la remisión real.']);
      var filasNo = NOHACE.map(function (x) {
        return '<article class="fdemo-nohace"><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></article>';
      }).join('');

      return '<div class="fdemo-panel"><div class="fdemo-panel-h"><div>' +
        '<p class="fdemo-eyebrow">Administración</p><h1 class="fdemo-page-title">Tu gestoría</h1>' +
        '<p class="fdemo-page-sub">Todo lo que tu asesoría necesita, en el formato en el que lo pide.</p></div></div>' +
        '<div class="fdemo-kpi-tira es-3">' +
        kpi2({ label: 'Emitidas en el libro', valor: String(fac.length), hint: 'facturas con numeración correlativa', vista: 'facturas' }) +
        kpi2({ label: 'Recibidas en el libro', valor: String(gas.length), hint: 'gastos con proveedor y cuota', vista: 'gastos' }) +
        kpi2({ label: 'Numeración', valor: 'Sin huecos', tono: 'positivo', hint: 'ninguna serie salta un número' }) +
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
      /* Las que acaban de entrar —desde una remesa o desde el editor— van
         las primeras y marcadas: sin eso, «dar de alta» es un botón del que
         no se sabe si ha hecho algo. */
      var all = todasLasFacturas();
      var estados = Array.from(new Set(all.map(function (f) { return vivaDe(f).estado; }))).sort();
      var q = state.facturaFiltro.q.toLowerCase();
      var estFiltro = state.facturaFiltro.estado;
      var chip = state.facturaFiltro.chip || 'todas';
      var hoy = FS.hoy;
      function grupo(f) {
        var v = vivaDe(f);
        if (v.estado === 'Borrador') return 'borrador';
        if (v.pend <= 0) return 'cobradas';
        if (f.fechaVencimiento && f.fechaVencimiento < hoy) return 'fuera';
        return 'pendientes';
      }
      var cuenta = { todas: all.length, pendientes: 0, fuera: 0, cobradas: 0, borrador: 0 };
      all.forEach(function (f) { cuenta[grupo(f)]++; });
      var filtradas = all.filter(function (f) {
        var texto = (f.numero + ' ' + (f.clienteNombre || '') + ' ' + (f.proyecto || '')).toLowerCase();
        return (!q || texto.indexOf(q) !== -1) && (!estFiltro || vivaDe(f).estado === estFiltro) && (chip === 'todas' || grupo(f) === chip);
      });
      var anio = hoy.slice(0, 4), mes = hoy.slice(0, 7);
      var emitidas = all.filter(function (f) { return vivaDe(f).estado !== 'Borrador'; });
      var facturadoAnio = emitidas.filter(function (f) { return (f.fechaEmision || '').slice(0, 4) === anio; }).reduce(function (a, f) { return a + f.importe; }, 0);
      var pendiente = emitidas.reduce(function (a, f) { return a + vivaDe(f).pend; }, 0);
      var fuera = emitidas.filter(function (f) { return grupo(f) === 'fuera'; }).reduce(function (a, f) { return a + vivaDe(f).pend; }, 0);
      var cobradoMes = FS.listCobros().filter(function (c) { return (c.fecha || '').slice(0, 7) === mes; }).reduce(function (a, c) { return a + c.importe; }, 0) +
        Object.keys(state.cobrados).reduce(function (a, k) { return a + state.cobrados[k]; }, 0);

      var rows = filtradas.map(function (f) {
        var v = vivaDe(f);
        return '<tr class="' + (f.nueva ? 'is-nuevo ' : '') + 'es-abrible" data-fid="' + f.id + '"><td>' +
          linkTo('facturas', f.id, f.numero) + (f.nueva ? '<span class="fdemo-nuevo-pill">Nueva</span>' : '') + '</td>' +
          '<td class="is-muted">' + esc(dash(f.clienteNombre)) + '</td>' +
          '<td class="is-muted">' + esc(dash(f.proyecto)) + '</td>' +
          '<td class="is-muted">' + FDATE(f.fechaEmision) + '</td>' +
          '<td class="is-muted">' + FDATE(f.fechaVencimiento) + '</td>' +
          '<td class="is-right">' + EUR(f.importe) + '</td>' +
          '<td>' + pill(v.estado) + '</td>' +
          '<td>' + pill(v.cobro) + '</td></tr>';
      }).join('');

      var tableHtml = !filtradas.length ? '<div class="fdemo-explica"><p><b>Ninguna factura con estos filtros.</b> Prueba con otro nombre o quita el filtro.</p>' +
          '<button type="button" class="fdemo-btn variant-secondary" data-action="fa-limpia">Quitar filtros</button></div>' :
        '<div class="fdemo-table-wrap"><table class="fdemo-table"><thead><tr>' +
        '<th>Nº Factura</th><th>Cliente</th><th>Proyecto</th><th>Emisión</th><th>Vencimiento</th><th class="is-right">Importe</th><th>Estado</th><th>Cobro</th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table></div>';

      var CHIPS = [['todas', 'Todas'], ['pendientes', 'En plazo'], ['fuera', 'Fuera de plazo'], ['cobradas', 'Cobradas'], ['borrador', 'Borradores']];
      return '<div class="fdemo-panel">' +
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Ventas</p><h1 class="fdemo-page-title">Facturas</h1>' +
        '<p class="fdemo-page-sub">' + all.length + ' facturas. Pulsa una fila para verla sin salir de la lista; el número abre la ficha entera.</p></div>' +
        '<button type="button" class="fdemo-btn variant-primary" data-action="fa-nueva">+ Nueva factura</button></div>' +
        '<div class="fdemo-kpi-tira es-4">' +
        kpi2({ hero: true, label: 'Facturado en ' + anio, valor: EUR(facturadoAnio), hint: emitidas.filter(function (f) { return (f.fechaEmision || '').slice(0, 4) === anio; }).length + ' facturas emitidas' }) +
        kpi2({ tono: 'aviso', label: 'Pendiente de cobro', valor: EUR(pendiente), hint: (cuenta.pendientes + cuenta.fuera) + ' facturas', vista: 'cobros' }) +
        kpi2({ tono: fuera > 0 ? 'critico' : 'positivo', label: 'Fuera de plazo', valor: fuera > 0 ? EUR(fuera) : 'Nada', hint: cuenta.fuera + ' facturas vencidas' }) +
        kpi2({ tono: 'positivo', label: 'Cobrado en ' + MESES[Number(mes.slice(5, 7)) - 1], valor: EUR(cobradoMes), hint: 'entradas registradas' }) +
        '</div>' +
        '<div class="fdemo-filtros-chip" role="group" aria-label="Filtrar por situación">' + CHIPS.map(function (c) {
          return '<button type="button" class="fdemo-chip-f' + (chip === c[0] ? ' is-on' : '') + '" data-action="fa-chip" data-k="' + c[0] + '" aria-pressed="' + (chip === c[0]) + '">' +
            esc(c[1]) + '<span>' + cuenta[c[0]] + '</span></button>';
        }).join('') + '</div>' +
        '<form class="fdemo-filter-row" data-role="factura-filter">' +
        '<input class="fdemo-input" type="search" name="q" placeholder="Buscar por número, cliente o proyecto…" value="' + esc(state.facturaFiltro.q) + '" autocomplete="off">' +
        '<select class="fdemo-select" name="estado" aria-label="Filtrar por estado">' + ['<option value="">Todos los estados</option>'].concat(estados.map(function (e) { return '<option value="' + esc(e) + '"' + (e === estFiltro ? ' selected' : '') + '>' + esc(e) + '</option>'; })).join('') + '</select>' +
        '<button type="submit" class="fdemo-btn variant-secondary">Filtrar</button>' +
        '</form>' +
        card(null, tableHtml) +
        (state.vistaRapida ? vistaRapida(state.vistaRapida) : '') +
        '</div>';
    };

    /* LA VISTA RÁPIDA. Pulsar una fila abre la factura en un panel lateral,
       encima de la lista, y se cierra con la X, con Escape o pulsando fuera:
       mirar una factura no debería costar perder la búsqueda. */
    function vistaRapida(id) {
      var f = facturaPorId(id);
      if (!f) return '';
      var v = vivaDe(f), cli = clienteDeFactura(f);
      var ret = state.cobrados[f.id] ? 0 : FS.diasDeRetraso(f);
      return '<div class="fdemo-rapida-velo" data-action="vr-cierra"></div>' +
        '<aside class="fdemo-rapida" role="dialog" aria-label="Factura ' + esc(f.numero) + '">' +
        '<div class="fdemo-rapida-h"><div><p class="fdemo-eyebrow">Vista rápida</p><p class="fdemo-rapida-t">' + esc(f.numero) + ' · ' + EUR(f.importe) + '</p>' +
        '<p class="fdemo-page-sub">' + esc(cli ? cli.empresa : f.clienteNombre) + '</p></div>' +
        '<button type="button" class="fdemo-rapida-x" data-action="vr-cierra" aria-label="Cerrar la vista rápida">×</button></div>' +
        '<div class="fdemo-rapida-pills">' + pill(v.estado) + (v.cobro ? pill(v.cobro) : '') +
        (ret > 0 ? '<span class="fdemo-rapida-ret">' + ret + ' días de retraso</span>' : '') + '</div>' +
        '<div class="fdemo-rapida-doc">' + documentoFactura(f) + '</div>' +
        '<div class="fdemo-ficha-acts">' +
        '<button type="button" class="fdemo-btn variant-primary" data-action="nav" data-view="facturas" data-id="' + f.id + '">Abrir la ficha</button>' +
        (v.pend > 0 && v.estado !== 'Borrador' ? '<button type="button" class="fdemo-btn variant-secondary" data-action="fa-cobro" data-id="' + f.id + '">Registrar cobro</button>' : '') +
        (v.estado !== 'Borrador' ? '<button type="button" class="fdemo-btn variant-secondary" data-action="fa-enviar" data-id="' + f.id + '">' + (ret > 0 ? 'Recordatorio' : 'Enviar') + '</button>' : '') +
        '</div></aside>';
    }

    /* ═══════════════════════ LAS FICHAS, POR DENTRO ═══════════════════════

       Una ficha con todo en una columna obliga a bajar hasta dar con lo que
       se busca. Las pestañas son las del producto: la misma factura, cinco
       preguntas —qué es, cómo es el documento, qué se ha cobrado, cómo quedó
       registrada y qué ha pasado con ella—, y la pestaña abierta se recuerda
       mientras dura la visita. */
    function pestanas(clave, lista, activa) {
      return '<div class="fdemo-tabs" role="tablist" aria-label="Secciones de la ficha">' + lista.map(function (t) {
        var on = t.k === activa;
        return '<button type="button" role="tab" aria-selected="' + on + '" class="fdemo-tab' + (on ? ' is-on' : '') +
          '" data-action="tab" data-clave="' + esc(clave) + '" data-tab="' + t.k + '">' + esc(t.l) +
          (t.n ? '<span class="fdemo-tab-n">' + t.n + '</span>' : '') + '</button>';
      }).join('') + '</div>';
    }
    function tabDe(clave, def) { return state.tabs[clave] || def; }

    var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    function mesDe(iso) { var d = new Date(iso + 'T00:00:00Z'); return MESES[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); }
    function fechaCorta(iso) { var d = new Date(iso + 'T00:00:00Z'); return d.getUTCDate() + ' ' + ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'][d.getUTCMonth()]; }
    function masDias(iso, n) { return new Date(Date.parse(iso) + n * 86400000).toISOString().slice(0, 10); }
    function diasEntreIso(a, b) { return Math.round((Date.parse(b) - Date.parse(a)) / 86400000); }
    function r2(n) { return Math.round(n * 100) / 100; }

    /* Lo que la visita ha hecho con cada factura —un cobro registrado, un
       envío, una rectificativa— vive en la sesión y se ve en la ficha, en la
       lista y en la actividad. Un botón que no cambia nada visible es un
       botón roto. */
    function vivaDe(f) {
      if (state.cobrados[f.id]) return { estado: f.estado === 'Borrador' ? 'Borrador' : 'Pagada', cobro: 'Cobrado', cobrado: f.importe, pend: 0 };
      var p = FS.pendienteDe(f);
      return { estado: f.estado, cobro: f.estadoCobro, cobrado: r2(f.importe - p), pend: p };
    }
    function anota(id, texto, tono) {
      (state.eventos[id] = state.eventos[id] || []).unshift({ t: texto, tono: tono || 'info', f: FS.hoy, ahora: true });
    }
    function todasLasFacturas() { return (state.facturasNuevas || []).concat(FS.listFacturas()); }
    function facturaPorId(id) {
      return (state.facturasNuevas || []).filter(function (x) { return x.id === id; })[0] || FS.getFactura(id);
    }
    function clienteDeFactura(f) { return f.clienteIds && f.clienteIds[0] ? FS.getCliente(f.clienteIds[0]) : null; }

    /* Cuánto tarda de verdad este cliente en pagar: la mediana de los días
       entre emisión y cobro de lo que ya ha pagado. Es la cifra que el
       producto enseña en la ficha del cliente y la que usa el escenario
       prudente de tesorería. */
    function tardaEnPagar(cid) {
      var d = FS.listFacturas().filter(function (f) { return f.clienteIds.indexOf(cid) !== -1 && f.fechaPago && f.fechaEmision; })
        .map(function (f) { return diasEntreIso(f.fechaEmision, f.fechaPago); }).sort(function (a, b) { return a - b; });
      if (d.length < 2) return null;
      return d[Math.floor(d.length / 2)];
    }
    function retrasoMedido(cid) {
      var d = FS.listFacturas().filter(function (f) { return f.clienteIds.indexOf(cid) !== -1 && f.fechaPago && f.fechaVencimiento; })
        .map(function (f) { return Math.max(0, diasEntreIso(f.fechaVencimiento, f.fechaPago)); }).sort(function (a, b) { return a - b; });
      if (d.length < 2) return null;
      return d[Math.floor(d.length / 2)];
    }

    /* Las líneas del documento. Las que se crean en el editor traen las
       suyas; las del histórico se reconstruyen de su proyecto o de la cuota
       del cliente, y la última línea absorbe el redondeo para que la suma
       cuadre al céntimo con la base. */
    function lineasFactura(f) {
      if (f.lineas) return f.lineas;
      var base = f.base != null ? f.base : r2(f.importe / 1.21);
      var cli = clienteDeFactura(f);
      var proy = f.proyectoId ? FS.getProyecto(f.proyectoId) : null;
      var mes = mesDe(f.fechaEmision || FS.hoy);
      var cs;
      if (proy && (proy.serviciosContratados || proy.servicios)) {
        cs = String(proy.serviciosContratados || proy.servicios).split(/\s*[+,]\s*/).filter(Boolean).slice(0, 3)
          .map(function (x) { return { c: x.charAt(0).toUpperCase() + x.slice(1), d: 'Proyecto «' + proy.nombre + '»' }; });
      } else if (cli && cli.cuotaMensual && Math.abs(cli.cuotaMensual - base) < 1) {
        cs = [{ c: 'Cuota mensual de servicio', d: 'Periodo: ' + mes }];
      } else {
        cs = [{ c: 'Servicios profesionales', d: 'Periodo: ' + mes }];
      }
      var pesos = cs.length === 3 ? [0.5, 0.3, 0.2] : cs.length === 2 ? [0.6, 0.4] : [1];
      var acum = 0;
      return cs.map(function (x, i) {
        var imp = i === cs.length - 1 ? r2(base - acum) : r2(base * pesos[i]);
        acum = r2(acum + imp);
        return { c: x.c, d: x.d, cant: 1, precio: imp, dto: 0, iva: 21 };
      });
    }
    function totalesDe(lineas, iva, irpf) {
      var base = r2(lineas.reduce(function (a, l) { return a + (Number(l.cant) || 0) * (Number(l.precio) || 0) * (1 - (Number(l.dto) || 0) / 100); }, 0));
      var cuota = r2(base * iva / 100);
      var ret = irpf ? r2(base * 0.15) : 0;
      return { base: base, cuota: cuota, ret: ret, total: r2(base + cuota - ret) };
    }

    /* EL DOCUMENTO, tal y como sale. Misma estructura que DocumentoFiscal.tsx
       del producto: emisor, número y fechas; destinatario; tabla con
       Concepto · Cant. · Precio · Dto. · IVA · Importe; base, desglose de
       IVA, retención si la hay y total.

       EL QR. Una factura expedida por un sistema VERI*FACTU lleva un QR
       arriba y la leyenda «Factura verificable en la sede electrónica de la
       AEAT» (Orden HAC/1177/2024, que desarrolla el artículo 7 del RD
       1007/2023). El QR de verdad es de COTEJO: lleva el NIF del emisor, el
       número de factura, la fecha y el importe a la sede de la AEAT, que
       responde si esa factura le consta. Aquí los datos son inventados y no
       se remite nada, así que un QR de cotejo mentiría: el de la demo lleva
       a la página oficial de VERI*FACTU, donde está la normativa. Se dice
       debajo del documento, no se deja adivinar. */
    var VF_URL = 'https://sede.agenciatributaria.gob.es/Sede/iva/sistemas-informaticos-facturacion-verifactu.html';
    function selloVerifactu() {
      return '<a class="fdemo-hoja-qr" href="' + VF_URL + '" target="_blank" rel="noopener noreferrer">' +
        '<img src="/assets/img/verifactu-qr.svg" width="108" height="108" loading="lazy" decoding="async" alt="' +
        'Código QR a la página oficial de VERI*FACTU de la Agencia Tributaria' + '">' +
        '<span class="fdemo-hoja-qr-t"><b>VERI*FACTU</b>' +
        '<i>' + 'Factura verificable en la sede electrónica de la AEAT' + '</i></span></a>';
    }
    function documentoFactura(f, extra) {
      extra = extra || {};
      var cli = extra.cliente || clienteDeFactura(f);
      var ls = extra.lineas || lineasFactura(f);
      var ivaT = extra.iva != null ? extra.iva : (ls[0] && ls[0].iva != null ? ls[0].iva : 21);
      var t = extra.tot || { base: f.base != null ? f.base : r2(f.importe / 1.21), cuota: f.iva != null ? f.iva : r2(f.importe - (f.base || f.importe / 1.21)), ret: f.irpf ? r2((f.base || 0) * 0.15) : 0, total: f.importe };
      var rect = f.tipo === 'rectificativa';
      return '<div class="fdemo-hoja' + (extra.vivo ? ' es-vivo' : '') + '">' +
        '<div class="fdemo-hoja-cab"><div class="fdemo-hoja-emi">' + selloVerifactu() + '<div>' +
        '<p class="fdemo-hoja-emisor">D-Code Partners, S.L.</p>' +
        '<p class="fdemo-hoja-peq">NIF: B00000000</p><p class="fdemo-hoja-peq">Calle de ejemplo 1, 28001 Madrid</p></div></div>' +
        '<div class="fdemo-hoja-der"><p class="fdemo-hoja-tipo">' + (rect ? 'FACTURA RECTIFICATIVA' : 'FACTURA') + '</p>' +
        '<p class="fdemo-hoja-emisor">' + esc(f.numero) + '</p>' +
        '<p class="fdemo-hoja-peq">Fecha: ' + FDATE(f.fechaEmision) + '</p>' +
        '<p class="fdemo-hoja-peq">Vencimiento: ' + FDATE(f.fechaVencimiento) + '</p></div></div>' +
        '<div class="fdemo-hoja-sec"><p class="fdemo-hoja-eti">Destinatario</p>' +
        '<p class="fdemo-hoja-nom">' + esc(cli ? cli.empresa : (f.clienteNombre || 'Elige un cliente')) + '</p>' +
        (cli && cli.nif ? '<p class="fdemo-hoja-peq">NIF: ' + esc(cli.nif) + '</p>' : '') +
        (cli && cli.direccionFiscal ? '<p class="fdemo-hoja-peq">' + esc(cli.direccionFiscal) + '</p>' : '') + '</div>' +
        (rect && f.motivo ? '<div class="fdemo-hoja-rect"><p class="fdemo-hoja-nom">Rectificación</p><p>' + esc(f.motivo) + '</p></div>' : '') +
        '<div class="fdemo-hoja-tabla"><table><thead><tr><th>Concepto</th><th class="n">Cant.</th><th class="n">Precio</th><th class="n">Dto.</th><th class="n">IVA</th><th class="n">Importe</th></tr></thead><tbody>' +
        ls.map(function (l) {
          var imp = r2((Number(l.cant) || 0) * (Number(l.precio) || 0) * (1 - (Number(l.dto) || 0) / 100));
          return '<tr><td>' + esc(l.c || 'Concepto sin escribir') + (l.d ? '<span class="fdemo-hoja-desc">' + esc(l.d) + '</span>' : '') + '</td>' +
            '<td class="n">' + esc(String(l.cant)) + '</td><td class="n">' + EUR(Number(l.precio) || 0) + '</td>' +
            '<td class="n">' + (Number(l.dto) > 0 ? l.dto + ' %' : '—') + '</td><td class="n">' + (l.iva != null ? l.iva : ivaT) + ' %</td>' +
            '<td class="n">' + EUR(imp) + '</td></tr>';
        }).join('') + '</tbody></table></div>' +
        '<div class="fdemo-hoja-tot" data-role="bf-tot">' +
        '<div><span>Base imponible</span><b>' + EUR(t.base) + '</b></div>' +
        '<div><span>IVA ' + ivaT + ' % sobre ' + EUR(t.base) + '</span><b>' + EUR(t.cuota) + '</b></div>' +
        (t.ret ? '<div><span>Retención IRPF 15 %</span><b>−' + EUR(t.ret) + '</b></div>' : '') +
        '<div class="es-final"><span>Total</span><b>' + EUR(t.total) + '</b></div></div>' +
        '<p class="fdemo-hoja-peq fdemo-hoja-pago">Forma de pago: ' + esc(f.metodoPago || 'Transferencia bancaria') + '</p>' +
        '<div class="fdemo-hoja-pie"><span>' + (f.estado === 'Borrador' || extra.vivo ? 'Borrador: no entra en la cadena de registro hasta que se emite' : 'Registro ' + huella(f.numero + f.importe) + ' · encadenado al anterior') + '</span>' +
        '<span>Página 1 de 1</span></div></div>';
    }

    /* La actividad sale de las propias fechas del documento —emisión,
       envío, vencimiento, recordatorios, cobros— más lo que la visita acaba
       de hacer, que va arriba y marcado. */
    function actividadFactura(f) {
      var ev = [];
      var cli = clienteDeFactura(f);
      var email = cli && cli.email ? cli.email : 'el cliente';
      if (f.fechaEmision) {
        ev.push({ f: f.fechaEmision, t: f.estado === 'Borrador' ? 'Borrador creado' : 'Emitida y registrada con huella ' + huella(f.numero + f.importe), tono: 'info' });
        if (f.estado !== 'Borrador') ev.push({ f: f.fechaEmision, t: 'Enviada por correo a ' + email, tono: 'info', o: 1 });
      }
      var n = f.recordatoriosEnviados || 0;
      for (var k = 1; k <= n; k++) {
        var fr = masDias(f.fechaVencimiento, 3 + (k - 1) * 7);
        if (fr <= FS.hoy) ev.push({ f: fr, t: 'Recordatorio ' + k + ' enviado automáticamente', tono: 'aviso' });
      }
      if (f.fechaVencimiento && f.fechaVencimiento < FS.hoy && FS.pendienteDe(f) > 0 && !state.cobrados[f.id]) {
        ev.push({ f: f.fechaVencimiento, t: 'Vencida sin cobrar · ' + FS.diasDeRetraso(f) + ' días de retraso hoy', tono: 'mal' });
      }
      FS.listCobros().filter(function (c) { return c.facturaId === f.id; }).forEach(function (c) {
        ev.push({ f: c.fecha, t: 'Cobro de ' + EUR(c.importe) + ' por ' + (c.metodo || 'transferencia').toLowerCase() + (c.referencia ? ' · ' + c.referencia : ''), tono: 'bien' });
      });
      if (f.fechaPago && f.pagada) ev.push({ f: f.fechaPago, t: 'Cobrada por completo en ' + diasEntreIso(f.fechaEmision, f.fechaPago) + ' días', tono: 'bien', o: 1 });
      ev.sort(function (a, b) { return a.f === b.f ? (b.o || 0) - (a.o || 0) : (a.f < b.f ? 1 : -1); });
      return (state.eventos[f.id] || []).concat(ev);
    }
    function lineaDeTiempo(ev) {
      return '<ol class="fdemo-linea">' + ev.map(function (e) {
        return '<li class="t-' + e.tono + (e.ahora ? ' es-ahora' : '') + '"><span class="fdemo-linea-p" aria-hidden="true"></span>' +
          '<div><p>' + esc(e.t) + '</p><span>' + (e.ahora ? 'Ahora mismo, en esta visita' : FDATE(e.f)) + '</span></div></li>';
      }).join('') + '</ol>';
    }

    function facturaDetalle(id) {
      if (id === 'nueva') return facturaEditor();
      var nueva = (state.facturasNuevas || []).filter(function (x) { return x.id === id; })[0];
      if (nueva && !nueva.manual) return facturaNuevaDetalle(nueva);
      var f = nueva || FS.getFactura(id);
      if (!f) return empty('Factura no encontrada en la demo.');
      return facturaFicha(f);
    }

    function facturaFicha(f) {
      var v = vivaDe(f);
      var cli = clienteDeFactura(f);
      var ret = state.cobrados[f.id] ? 0 : FS.diasDeRetraso(f);
      var cobros = FS.listCobros().filter(function (c) { return c.facturaId === f.id; });
      if (state.cobrados[f.id]) cobros = [{ fecha: FS.hoy, importe: state.cobrados[f.id], metodo: 'Transferencia', referencia: 'Registrado en esta visita', nuevo: true }].concat(cobros);
      var act = actividadFactura(f);
      var clave = 'factura:' + f.id;
      var tab = tabDe(clave, 'resumen');
      var borrador = f.estado === 'Borrador';

      var acciones = '<div class="fdemo-ficha-acts">' +
        (borrador ? '<button type="button" class="fdemo-btn variant-primary" data-action="fa-emitir" data-id="' + f.id + '">Emitir y registrar</button>' : '') +
        (!borrador && v.pend > 0 ? '<button type="button" class="fdemo-btn variant-primary" data-action="fa-cobro" data-id="' + f.id + '">Registrar cobro</button>' : '') +
        (!borrador ? '<button type="button" class="fdemo-btn variant-secondary" data-action="fa-enviar" data-id="' + f.id + '">' + (v.pend > 0 && ret > 0 ? 'Enviar recordatorio' : 'Enviar por correo') + '</button>' : '') +
        '<button type="button" class="fdemo-btn variant-secondary" data-action="tab" data-clave="' + clave + '" data-tab="documento">Ver el PDF</button>' +
        (!borrador && f.tipo !== 'rectificativa' ? '<button type="button" class="fdemo-btn variant-ghost" data-action="fa-rect" data-id="' + f.id + '">Rectificar</button>' : '') +
        '</div>';

      var pct = f.importe ? Math.round(v.cobrado / f.importe * 100) : 0;
      var cuerpo = '';
      if (tab === 'resumen') {
        var tarda = cli ? tardaEnPagar(cli.id) : null;
        cuerpo =
          '<div class="fdemo-cobro-barra"><div class="fdemo-cobro-barra-h"><span>Cobrado <b>' + EUR(v.cobrado) + '</b></span><span>' +
          (v.pend > 0 ? 'Pendiente <b>' + EUR(v.pend) + '</b>' : '<b>Cobrada entera</b>') + '</span></div>' +
          '<div class="fdemo-cobro-barra-t" role="img" aria-label="Cobrado el ' + pct + ' %"><i style="width:' + pct + '%"></i></div></div>' +
          '<div class="fdemo-kpi-tira es-4">' +
          kpi2({ hero: true, tono: v.pend > 0 ? (ret > 0 ? 'critico' : 'aviso') : 'positivo', label: v.pend > 0 ? 'Pendiente' : 'Total cobrado', valor: EUR(v.pend > 0 ? v.pend : f.importe), hint: v.pend > 0 ? 'de ' + EUR(f.importe) : 'sin nada pendiente' }) +
          kpi2({ label: 'Base imponible', valor: EUR(f.base != null ? f.base : r2(f.importe / 1.21)), hint: 'IVA ' + EUR(f.iva != null ? f.iva : 0) }) +
          kpi2({ tono: ret > 0 ? 'critico' : 'neutro', label: ret > 0 ? 'Retraso' : borrador ? 'Estado' : v.pend > 0 ? 'Vence' : 'Cobrada en', valor: ret > 0 ? ret + ' días' : borrador ? 'Borrador' : v.pend > 0 ? FDATE(f.fechaVencimiento) : (f.fechaPago ? diasEntreIso(f.fechaEmision, f.fechaPago) + ' días' : 'Hoy'), hint: ret > 0 ? 'desde el ' + FDATE(f.fechaVencimiento) : borrador ? 'no entra en los números' : v.pend > 0 ? 'en ' + Math.max(0, diasEntreIso(FS.hoy, f.fechaVencimiento)) + ' días' : 'desde la emisión' }) +
          kpi2({ label: 'Recordatorios', valor: String((f.recordatoriosEnviados || 0) + (state.enviados[f.id] || 0)), hint: (f.recordatoriosEnviados || state.enviados[f.id]) ? 'enviados solos, sin que nadie escriba' : 'no ha hecho falta ninguno' }) +
          '</div>' +
          card(cardHead('Datos de la factura'), '<div class="fdemo-field-grid">' +
            field('Serie', esc(f.serie || 'F') + ' · ' + (f.tipo === 'rectificativa' ? 'rectificativa' : 'ordinaria')) + field('Fecha emisión', FDATE(f.fechaEmision)) + field('Fecha vencimiento', FDATE(f.fechaVencimiento)) +
            field('Método de pago', esc(f.metodoPago || 'Transferencia')) + field('Proyecto', f.proyectoId ? linkTo('proyectos', f.proyectoId, f.proyecto || 'Ver proyecto') : esc(dash(f.proyecto))) + field('Fecha de pago', state.cobrados[f.id] ? FDATE(FS.hoy) : FDATE(f.fechaPago)) +
            '</div>') +
          (cli ? card(cardHead('Cliente', 'Lo que dice su historial, no una impresión'), '<div class="fdemo-field-grid">' +
            field('Empresa', linkTo('clientes', cli.id, cli.empresa)) + field('NIF/CIF', esc(dash(cli.nif))) + field('Email de facturación', esc(dash(cli.email))) +
            field('Tarda en pagar', tarda != null ? tarda + ' días de mediana' : 'Sin historial suficiente') + field('Facturas suyas', String(cli.facturaIds.length)) + field('Cuota mensual', cli.cuotaMensual ? EUR(cli.cuotaMensual) : 'Sin cuota recurrente') +
            '</div>') : '') +
          (f.presupuestoOrigenId || f.proyectoOrigenId ? card(cardHead('Origen', 'De dónde ha salido esta factura'), '<div class="fdemo-card-body" style="display:flex; flex-direction:column; gap:8px;">' +
            (f.presupuestoOrigenId ? '<div>' + linkTo('presupuestos', f.presupuestoOrigenId, 'Ver presupuesto de origen') + '</div>' : '') +
            (f.proyectoOrigenId ? '<div>' + linkTo('proyectos', f.proyectoOrigenId, 'Ver proyecto de origen') + '</div>' : '') + '</div>') : '');
      } else if (tab === 'documento') {
        cuerpo = '<div class="fdemo-hoja-marco">' + documentoFactura(f) + '</div>' +
          '<p class="fdemo-nota-doc">Es el documento que recibe el cliente. En la demo no se descarga ni se envía nada: con tu cuenta, el mismo botón genera el PDF y lo manda desde tu dominio. ' +
          'El QR de aquí abre la página oficial de VERI*FACTU de la AEAT, porque estos datos son inventados; el QR de cotejo —el que lleva el NIF, el número, la fecha y el importe de tu factura— se imprime cuando el sistema remita de verdad.</p>';
      } else if (tab === 'cobros') {
        cuerpo = (v.pend > 0 && !borrador ? '<div class="fdemo-pend-banda"><div><p class="fdemo-pend-l">Falta por cobrar</p><p class="fdemo-pend-v">' + EUR(v.pend) + '</p>' +
            '<p class="fdemo-pend-h">' + (ret > 0 ? 'vencida hace ' + ret + ' días' : 'vence el ' + FDATE(f.fechaVencimiento)) + '</p></div>' +
            '<div class="fdemo-ficha-acts"><button type="button" class="fdemo-btn variant-primary" data-action="fa-cobro" data-id="' + f.id + '">Registrar cobro</button>' +
            '<button type="button" class="fdemo-btn variant-secondary" data-action="fa-enviar" data-id="' + f.id + '">' + (ret > 0 ? 'Enviar recordatorio' : 'Enviar por correo') + '</button></div></div>' : '') +
          (cobros.length ? card(cardHead('Cobros de esta factura', cobros.length === 1 ? 'Un cobro' : cobros.length + ' cobros'),
            tablaSimple([{ t: 'Fecha' }, { t: 'Importe', r: 1 }, { t: 'Método' }, { t: 'Referencia' }],
              cobros.map(function (c) {
                return '<tr' + (c.nuevo ? ' class="is-nuevo"' : '') + '><td>' + FDATE(c.fecha) + (c.nuevo ? '<span class="fdemo-nuevo-pill">Ahora</span>' : '') + '</td><td class="is-right">' + EUR(c.importe) + '</td>' +
                  '<td class="is-muted">' + esc(c.metodo || 'Transferencia') + '</td><td class="is-muted"><code>' + esc(c.referencia || '—') + '</code></td></tr>';
              }).join(''), '')) :
            '<div class="fdemo-explica"><p><b>' + (borrador ? 'Un borrador no se cobra.' : 'Todavía no ha entrado ningún pago.') + '</b> ' +
            (borrador ? 'Cuando la emitas, aquí aparecerá cada cobro con su fecha, su método y su referencia bancaria.' : 'Cuando entre, se registra aquí con su referencia y la factura cambia de estado sola, en la lista, en Cobros y en el panel.') + '</p></div>') +
          card(cardHead('Cómo se reclama', 'Lo hace el sistema; tú decides el tono y el calendario'),
            '<ul class="fdemo-pasos-rec">' +
            '<li><b>Día 0</b><span>Se envía la factura con el enlace al PDF.</span></li>' +
            '<li><b>Vencimiento + 3</b><span>Primer recordatorio, amable.</span></li>' +
            '<li><b>Vencimiento + 10</b><span>Segundo recordatorio, con el importe y los días.</span></li>' +
            '<li><b>Vencimiento + 20</b><span>Aviso a ti para llamar: ya no es cosa de correos.</span></li></ul>');
      } else if (tab === 'registro') {
        var ord = FS.listFacturas().filter(function (x) { return x.estado !== 'Borrador'; }).sort(function (a, b) { return a.fechaEmision < b.fechaEmision ? -1 : 1; });
        var ix = ord.indexOf(f), ant = ix > 0 ? ord[ix - 1] : ix === -1 ? ord[ord.length - 1] : null;
        var hA = ant ? huella(ant.numero + ant.importe) : huella('inicio' + (f.serie || 'F'));
        var h = huella(f.numero + f.importe);
        var tipo = f.tipo === 'rectificativa' ? 'R1' : 'F1';
        var fe = (f.fechaEmision || FS.hoy).split('-').reverse().join('-');
        cuerpo = borrador ?
          '<div class="fdemo-explica"><p><b>Un borrador no se registra.</b> Entra en la cadena en el momento en que se emite: se le calcula la huella con la de la factura anterior y desde ese instante no se puede cambiar sin una rectificativa.</p>' +
          '<button type="button" class="fdemo-btn variant-primary" data-action="fa-emitir" data-id="' + f.id + '">Emitir y registrar</button></div>' :
          card(cardHead('Registro de alta', 'Lo que queda guardado de ' + f.numero + ' y cómo se engancha con la anterior'), '<div class="fdemo-field-grid">' +
            field('NIF del emisor', '<code>B00000000</code>') + field('Número y serie', '<code>' + esc(f.numero) + '</code>') + field('Tipo de factura', '<code>' + tipo + '</code> · ' + (tipo === 'R1' ? 'rectificativa' : 'completa')) +
            field('Cuota total', EUR(f.iva != null ? f.iva : 0)) + field('Importe total', EUR(f.importe)) + field('Anterior en la cadena', ant ? '<code>' + esc(ant.numero) + '</code>' : 'Primera de la serie') +
            field('Huella anterior', '<code>' + hA + '</code>') + field('Huella de este registro', '<code class="fdemo-hash">' + h + '</code>') + field('Remisión a la AEAT', pill(REMISION.pill)) +
            '</div>') +
          card(cardHead('El registro, tal cual', VF_N < 3 ? 'Borrador del formato de remisión, pendiente de contrastar con los esquemas oficiales' : 'Formato del registro de alta'),
            '<pre class="fdemo-xml">' + esc('<RegistroAlta>\n  <IDFactura>\n    <IDEmisorFactura>B00000000</IDEmisorFactura>\n    <NumSerieFactura>' + f.numero + '</NumSerieFactura>\n    <FechaExpedicionFactura>' + fe + '</FechaExpedicionFactura>\n  </IDFactura>\n  <TipoFactura>' + tipo + '</TipoFactura>\n  <CuotaTotal>' + (f.iva != null ? f.iva : 0).toFixed(2) + '</CuotaTotal>\n  <ImporteTotal>' + f.importe.toFixed(2) + '</ImporteTotal>\n  <Encadenamiento>\n    <RegistroAnterior>\n      <NumSerieFactura>' + (ant ? ant.numero : '—') + '</NumSerieFactura>\n      <Huella>' + hA + '…</Huella>\n    </RegistroAnterior>\n  </Encadenamiento>\n  <Huella>' + h + '…</Huella>\n</RegistroAlta>') + '</pre>');
      } else {
        cuerpo = card(cardHead('Todo lo que ha pasado con ' + f.numero, act.length + ' momentos, del más reciente al primero'), '<div class="fdemo-card-body">' + lineaDeTiempo(act) + '</div>');
      }

      return '<div class="fdemo-page fdemo-ficha" style="gap:18px; max-width:1060px;">' +
        crumb('Facturas', 'facturas', f.numero) +
        '<div class="fdemo-ficha-h"><div><p class="fdemo-eyebrow">' + (f.tipo === 'rectificativa' ? 'Factura rectificativa' : 'Factura') + '</p>' +
        '<h1 class="fdemo-page-title">' + esc(f.numero) + ' <span class="fdemo-ficha-imp">' + EUR(f.importe) + '</span></h1>' +
        '<p class="fdemo-page-sub">' + (cli ? linkTo('clientes', cli.id, cli.empresa) : esc(dash(f.clienteNombre))) + ' · emitida el ' + FDATE(f.fechaEmision) + '</p></div>' +
        '<div class="fdemo-ficha-pills">' + pill(v.estado) + (v.cobro ? pill(v.cobro) : '') + '</div></div>' +
        acciones +
        pestanas(clave, [
          { k: 'resumen', l: 'Resumen' }, { k: 'documento', l: 'Documento' },
          { k: 'cobros', l: 'Cobros', n: cobros.length }, { k: 'registro', l: 'Registro fiscal' },
          { k: 'actividad', l: 'Actividad', n: act.length }], tab) +
        '<div class="fdemo-tab-cuerpo" role="tabpanel">' + cuerpo + '</div>' +
        '</div>';
    }

    /* ══════════════ NUEVA FACTURA ══════════════
       El editor del producto (facturas/nuevo): cliente, líneas con
       cantidad, precio y descuento, IVA, retención y vencimiento, y el
       documento al lado cambiando con cada tecla. Guardar crea el borrador
       de verdad —aparece en la lista, en la ficha y en la actividad—, y
       emitirlo le da número, huella y sitio en la cadena. */
    function borradorNuevo(cid) {
      var cli = FS.listClientes().filter(function (c) { return c.estado === 'cliente'; });
      return { clienteId: cid || (cli[0] && cli[0].id), vence: 30, iva: 21, irpf: false,
               lineas: [{ c: '', d: '', cant: 1, precio: 0, dto: 0 }] };
    }
    function siguienteNumero() {
      var max = 0;
      todasLasFacturas().forEach(function (f) {
        var m = /^F-(\d{4})-(\d{4})$/.exec(f.numero || '');
        if (m && Number(m[1]) === 2026) max = Math.max(max, Number(m[2]));
      });
      return 'F-2026-' + String(max + 1).padStart(4, '0');
    }
    function facturaEditor() {
      var b = state.borrador || (state.borrador = borradorNuevo());
      var cli = FS.getCliente(b.clienteId);
      var t = totalesDe(b.lineas, b.iva, b.irpf);
      var numero = siguienteNumero();
      var clientes = FS.listClientes().filter(function (c) { return c.estado === 'cliente'; });
      var f = { numero: numero, fechaEmision: FS.hoy, fechaVencimiento: masDias(FS.hoy, b.vence), clienteNombre: cli && cli.empresa, estado: 'Borrador', importe: t.total };
      var filas = b.lineas.map(function (l, i) {
        return '<div class="fdemo-bf-linea" data-i="' + i + '">' +
          '<label class="fdemo-bf-c"><span>Concepto</span><input class="fdemo-input" data-bf="c" data-i="' + i + '" value="' + esc(l.c) + '" placeholder="Qué facturas" autocomplete="off"></label>' +
          '<label class="fdemo-bf-n"><span>Cant.</span><input class="fdemo-input" data-bf="cant" data-i="' + i + '" value="' + esc(String(l.cant)) + '" inputmode="decimal"></label>' +
          '<label class="fdemo-bf-p"><span>Precio</span><input class="fdemo-input" data-bf="precio" data-i="' + i + '" value="' + (l.precio ? esc(String(l.precio).replace('.', ',')) : '') + '" placeholder="0,00" inputmode="decimal"></label>' +
          '<label class="fdemo-bf-n"><span>Dto. %</span><input class="fdemo-input" data-bf="dto" data-i="' + i + '" value="' + esc(String(l.dto || 0)) + '" inputmode="decimal"></label>' +
          (b.lineas.length > 1 ? '<button type="button" class="fdemo-bf-x" data-action="bf-quita" data-i="' + i + '" aria-label="Quitar la línea ' + (i + 1) + '">×</button>' : '<span class="fdemo-bf-x" aria-hidden="true"></span>') +
          '</div>';
      }).join('');
      return '<div class="fdemo-page fdemo-bf">' +
        crumb('Facturas', 'facturas', 'Nueva factura') +
        '<div class="fdemo-ficha-h"><div><p class="fdemo-eyebrow">Nueva factura</p><h1 class="fdemo-page-title">' + numero + '</h1>' +
        '<p class="fdemo-page-sub">El número lo pone la serie: no se salta ninguno y no se repite ninguno.</p></div></div>' +
        '<div class="fdemo-bf-rejilla">' +
        '<div class="fdemo-card fdemo-bf-form"><div class="fdemo-card-body">' +
        '<div class="fdemo-bf-fila">' +
        '<label class="fdemo-campo"><span class="fdemo-campo-l">Cliente</span><select class="fdemo-select" data-bf="cliente">' +
        clientes.map(function (c) { return '<option value="' + c.id + '"' + (c.id === b.clienteId ? ' selected' : '') + '>' + esc(c.empresa) + '</option>'; }).join('') + '</select></label>' +
        '<label class="fdemo-campo"><span class="fdemo-campo-l">Vence a</span><select class="fdemo-select" data-bf="vence">' +
        [15, 30, 45, 60].map(function (d) { return '<option value="' + d + '"' + (d === b.vence ? ' selected' : '') + '>' + d + ' días</option>'; }).join('') + '</select></label></div>' +
        '<p class="fdemo-bf-t">Líneas</p>' + filas +
        '<button type="button" class="fdemo-btn variant-ghost fdemo-bf-mas" data-action="bf-linea">+ Añadir línea</button>' +
        '<div class="fdemo-bf-fila">' +
        '<label class="fdemo-campo"><span class="fdemo-campo-l">IVA</span><select class="fdemo-select" data-bf="iva">' +
        [21, 10, 4, 0].map(function (x) { return '<option value="' + x + '"' + (x === b.iva ? ' selected' : '') + '>' + x + ' %</option>'; }).join('') + '</select></label>' +
        '<label class="fdemo-bf-check"><input type="checkbox" data-bf="irpf"' + (b.irpf ? ' checked' : '') + '><span>Retención IRPF del 15 %<i>si facturas como profesional</i></span></label></div>' +
        '<div class="fdemo-bf-tot" data-role="bf-resumen">' + resumenBorrador(t) + '</div>' +
        '<div class="fdemo-ficha-acts">' +
        '<button type="button" class="fdemo-btn variant-primary" data-action="bf-guardar" data-emitir="1">Emitir y registrar</button>' +
        '<button type="button" class="fdemo-btn variant-secondary" data-action="bf-guardar">Guardar borrador</button>' +
        '<button type="button" class="fdemo-btn variant-ghost" data-action="nav" data-view="facturas">Cancelar</button></div>' +
        '</div></div>' +
        '<div class="fdemo-bf-prev"><p class="fdemo-bf-t">Así la recibe el cliente <span class="fdemo-vivo-dot" aria-hidden="true"></span></p><div data-role="bf-prev">' +
        documentoFactura(f, { cliente: cli, lineas: b.lineas, iva: b.iva, tot: t, vivo: true }) + '</div></div>' +
        '</div></div>';
    }
    function resumenBorrador(t) {
      return '<div><span>Base imponible</span><b>' + EUR(t.base) + '</b></div>' +
        '<div><span>IVA</span><b>' + EUR(t.cuota) + '</b></div>' +
        (t.ret ? '<div><span>Retención IRPF</span><b>−' + EUR(t.ret) + '</b></div>' : '') +
        '<div class="es-final"><span>Total</span><b>' + EUR(t.total) + '</b></div>';
    }
    /* Cada tecla cambia el documento, sin repintar el formulario: repintarlo
       le quitaría el foco a quien está escribiendo. */
    function refrescaBorrador() {
      var b = state.borrador; if (!b) return;
      var cli = FS.getCliente(b.clienteId);
      var t = totalesDe(b.lineas, b.iva, b.irpf);
      var numero = siguienteNumero();
      var f = { numero: numero, fechaEmision: FS.hoy, fechaVencimiento: masDias(FS.hoy, b.vence), clienteNombre: cli && cli.empresa, estado: 'Borrador', importe: t.total };
      var prev = contentEl.querySelector('[data-role="bf-prev"]');
      if (prev) prev.innerHTML = documentoFactura(f, { cliente: cli, lineas: b.lineas, iva: b.iva, tot: t, vivo: true });
      var res = contentEl.querySelector('[data-role="bf-resumen"]');
      if (res) res.innerHTML = resumenBorrador(t);
    }
    /* Un número escrito en España: «24.000» son veinticuatro mil, no
       veinticuatro; «1.250,50» lleva los dos separadores. */
    function numeroDe(txt) {
      var s = String(txt || '').trim().replace(/[\s€]/g, '');
      if (/,/.test(s)) s = s.replace(/\./g, '').replace(',', '.');
      else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
      var n = parseFloat(s);
      return isFinite(n) ? n : 0;
    }
    function guardaBorrador(emitir) {
      var b = state.borrador; if (!b) return null;
      var cli = FS.getCliente(b.clienteId);
      var lineas = b.lineas.filter(function (l) { return (l.c || '').trim() || l.precio; })
        .map(function (l) { return { c: (l.c || '').trim() || 'Servicios profesionales', d: '', cant: l.cant, precio: l.precio, dto: l.dto, iva: b.iva }; });
      if (!lineas.length) return null;
      var t = totalesDe(lineas, b.iva, b.irpf);
      if (t.total <= 0) return null;
      var numero = siguienteNumero();
      var f = { id: 'nm' + Date.now().toString(36), numero: numero, manual: true, nueva: true, lineas: lineas, irpf: b.irpf,
        clienteIds: [cli.id], clienteNombre: cli.empresa, fechaEmision: FS.hoy, fechaVencimiento: masDias(FS.hoy, b.vence),
        base: t.base, iva: t.cuota, importe: t.total, importeCobrado: 0, recordatoriosEnviados: 0, serie: 'F',
        metodoPago: 'Transferencia', estado: emitir ? 'Enviada' : 'Borrador', estadoCobro: emitir ? 'Pendiente' : null, proyecto: null };
      state.facturasNuevas = [f].concat(state.facturasNuevas || []);
      anota(f.id, emitir ? 'Emitida y registrada en esta visita · huella ' + huella(f.numero + f.importe) : 'Borrador guardado en esta visita', emitir ? 'bien' : 'info');
      state.borrador = null;
      return f;
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

    /* LA FICHA DEL CLIENTE. La del producto abre con «Comportamiento de este
       cliente» —facturado histórico, lo que debe ahora, lo que tarda en
       pagar y su tendencia— porque es lo que se quiere saber antes de
       llamarle. Aquí, igual, y con pestañas para lo demás. */
    function clienteDetalle(id) {
      var c = FS.getCliente(id);
      if (!c) return empty('Cliente no encontrado en la demo.');
      var fac = todasLasFacturas().filter(function (f) { return f.clienteIds && f.clienteIds.indexOf(id) !== -1; })
        .sort(function (a, b) { return a.fechaEmision < b.fechaEmision ? 1 : -1; });
      var emit = fac.filter(function (f) { return vivaDe(f).estado !== 'Borrador'; });
      var proy = FS.listProyectos().filter(function (p) { return p.empresa === c.empresa; });
      var hist = emit.reduce(function (a, f) { return a + f.importe; }, 0);
      var debe = emit.reduce(function (a, f) { return a + vivaDe(f).pend; }, 0);
      var vencido = emit.filter(function (f) { return vivaDe(f).pend > 0 && f.fechaVencimiento < FS.hoy; });
      var tarda = tardaEnPagar(id), retr = retrasoMedido(id);
      // Doce meses, de más antiguo a más reciente, y la tendencia: los tres
      // últimos contra los tres anteriores.
      var meses = [];
      for (var k = 11; k >= 0; k--) {
        var d = new Date(Date.parse(FS.hoy)); d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() - k);
        meses.push(d.toISOString().slice(0, 7));
      }
      var serie = meses.map(function (m) { return r2(emit.filter(function (f) { return (f.fechaEmision || '').slice(0, 7) === m; }).reduce(function (a, f) { return a + f.importe; }, 0)); });
      var ult3 = serie.slice(-3).reduce(function (a, x) { return a + x; }, 0), ant3 = serie.slice(-6, -3).reduce(function (a, x) { return a + x; }, 0);
      var tend = ant3 ? Math.round((ult3 - ant3) / ant3 * 100) : null;
      var maxS = Math.max.apply(null, serie.concat([1]));
      var clave = 'cliente:' + id;
      var tab = tabDe(clave, 'resumen');
      var ev = [];
      emit.forEach(function (f) {
        ev.push({ f: f.fechaEmision, t: 'Factura ' + f.numero + ' emitida · ' + EUR(f.importe), tono: 'info' });
        if (state.cobrados[f.id]) ev.push({ f: FS.hoy, t: 'Cobro de ' + f.numero + ' registrado', tono: 'bien' });
        else if (f.fechaPago) ev.push({ f: f.fechaPago, t: 'Pagó ' + f.numero + ' en ' + diasEntreIso(f.fechaEmision, f.fechaPago) + ' días', tono: 'bien' });
        for (var r = 1; r <= (f.recordatoriosEnviados || 0); r++) {
          var fr = masDias(f.fechaVencimiento, 3 + (r - 1) * 7);
          if (fr <= FS.hoy) ev.push({ f: fr, t: 'Recordatorio ' + r + ' de ' + f.numero, tono: 'aviso' });
        }
      });
      proy.forEach(function (p) {
        if (p.fechaInicio) ev.push({ f: p.fechaInicio, t: 'Arranca el proyecto «' + p.nombre + '»', tono: 'info' });
        if (p.fechaEntregaReal) ev.push({ f: p.fechaEntregaReal, t: 'Entregado «' + p.nombre + '»', tono: 'bien' });
      });
      ev.sort(function (a, b) { return a.f < b.f ? 1 : -1; });
      ev = (state.eventos[id] || []).concat(ev).slice(0, 18);

      var cuerpo = '';
      if (tab === 'resumen') {
        cuerpo = '<div class="fdemo-kpi-tira es-4">' +
          kpi2({ hero: true, label: 'Facturado histórico', valor: EUR(hist), hint: emit.length + ' facturas emitidas' }) +
          kpi2({ tono: debe > 0 ? (vencido.length ? 'critico' : 'aviso') : 'positivo', label: 'Te debe ahora', valor: debe > 0 ? EUR(debe) : 'Nada', hint: debe > 0 ? (vencido.length ? vencido.length + ' fuera de plazo' : 'todo dentro de plazo') : 'está al día' }) +
          kpi2({ tono: retr != null && retr > 7 ? 'aviso' : 'neutro', label: 'Tarda en pagar', valor: tarda != null ? tarda + ' días' : 'Sin historial', hint: retr != null ? (retr > 0 ? retr + ' días más allá del vencimiento' : 'paga dentro de plazo') : 'hacen falta dos cobros' }) +
          kpi2({ tono: tend == null ? 'neutro' : tend >= 0 ? 'positivo' : 'aviso', label: 'Tendencia 12 meses', valor: tend == null ? 'Nuevo' : (tend > 0 ? '+' : '') + tend + ' %', hint: 'últimos 3 meses contra los 3 anteriores', serie: serie }) +
          '</div>' +
          card(cardHead('Lo que te ha facturado, mes a mes', 'Los últimos doce meses'),
            '<div class="fdemo-card-body"><div class="fdemo-barras-mes" role="img" aria-label="Facturación mensual de ' + esc(c.empresa) + '">' +
            serie.map(function (x, i) {
              return '<div class="fdemo-barra-mes' + (i === 11 ? ' es-actual' : '') + '"><i style="height:' + Math.max(2, Math.round(x / maxS * 100)) + '%" title="' + esc(MESES[Number(meses[i].slice(5, 7)) - 1] + ': ' + EUR(x)) + '"></i>' +
                '<span>' + MESES[Number(meses[i].slice(5, 7)) - 1].slice(0, 3) + '</span></div>';
            }).join('') + '</div></div>') +
          (vencido.length ? card(cardHead('Lo que tiene fuera de plazo', 'Para la próxima llamada'),
            tablaSimple([{ t: 'Factura' }, { t: 'Venció' }, { t: 'Días', r: 1 }, { t: 'Pendiente', r: 1 }, { t: '', r: 1 }],
              vencido.map(function (f) {
                return '<tr><td>' + linkTo('facturas', f.id, f.numero) + '</td><td class="is-muted">' + FDATE(f.fechaVencimiento) + '</td>' +
                  '<td class="is-right">' + FS.diasDeRetraso(f) + '</td><td class="is-right">' + EUR(vivaDe(f).pend) + '</td>' +
                  '<td class="is-right"><button type="button" class="fdemo-btn-mini es-accion" data-action="fa-enviar" data-id="' + f.id + '">Recordatorio</button></td></tr>';
              }).join(''), '')) : '');
      } else if (tab === 'facturas') {
        cuerpo = card(cardHead('Sus facturas', fac.length + ' en total, de la más reciente a la primera'),
          tablaSimple([{ t: 'Nº' }, { t: 'Emisión' }, { t: 'Vencimiento' }, { t: 'Importe', r: 1 }, { t: 'Pendiente', r: 1 }, { t: 'Estado' }],
            fac.map(function (f) {
              var v = vivaDe(f);
              return '<tr class="es-abrible" data-fid="' + f.id + '"><td>' + linkTo('facturas', f.id, f.numero) + '</td><td class="is-muted">' + FDATE(f.fechaEmision) + '</td>' +
                '<td class="is-muted">' + FDATE(f.fechaVencimiento) + '</td><td class="is-right">' + EUR(f.importe) + '</td>' +
                '<td class="is-right">' + (v.pend > 0 ? EUR(v.pend) : '<span class="fdemo-pct">al día</span>') + '</td><td>' + pill(v.cobro || v.estado) + '</td></tr>';
            }).join(''), ''));
      } else if (tab === 'proyectos') {
        cuerpo = card(cardHead('Sus proyectos', proy.length + ' con este cliente'),
          tablaSimple([{ t: 'Proyecto' }, { t: 'Estado' }, { t: 'Facturado', r: 1 }, { t: 'Gastos', r: 1 }, { t: 'Rentabilidad', r: 1 }],
            proy.map(function (p) {
              return '<tr><td>' + linkTo('proyectos', p.id, p.nombre) + '</td><td>' + pill(p.estado) + '</td>' +
                '<td class="is-right">' + EUR(p.totalFacturado || 0) + '</td><td class="is-right">' + EUR(p.totalGastos || 0) + '</td>' +
                '<td class="is-right ' + ((p.rentabilidad || 0) < 0 ? 'es-mal' : '') + '">' + EUR(p.rentabilidad || 0) + '</td></tr>';
            }).join(''), ''));
      } else if (tab === 'actividad') {
        cuerpo = card(cardHead('Toda la relación, en orden', 'Facturas, cobros, recordatorios y proyectos'), '<div class="fdemo-card-body">' + lineaDeTiempo(ev) + '</div>');
      } else {
        cuerpo = card(cardHead('Información fiscal y contacto'), '<div class="fdemo-field-grid">' +
          field('NIF/CIF', esc(dash(c.nif))) + field('Dirección fiscal', esc(dash(c.direccionFiscal))) + field('Sector', esc(dash(c.sector))) +
          field('Email', esc(dash(c.email))) + field('Teléfono', esc(dash(c.telefono))) + field('Web', c.web ? esc(c.web) : '—') +
          field('Cuota mensual', c.cuotaMensual ? EUR(c.cuotaMensual) : 'Sin cuota recurrente') + field('Facturación activa', c.facturacionActiva === false ? 'No' : 'Sí') + field('Condiciones de pago', '30 días, transferencia') +
          '</div>');
      }
      var tabs = [{ k: 'resumen', l: 'Comportamiento' }, { k: 'facturas', l: 'Facturas', n: fac.length }];
      if (proy.length) tabs.push({ k: 'proyectos', l: 'Proyectos', n: proy.length });
      tabs.push({ k: 'actividad', l: 'Actividad' }, { k: 'datos', l: 'Datos fiscales' });

      return '<div class="fdemo-page fdemo-ficha" style="gap:18px; max-width:980px;">' +
        crumb('Clientes', 'clientes', c.empresa) +
        '<div class="fdemo-ficha-h"><div><p class="fdemo-eyebrow">Cliente · ' + esc(dash(c.sector)) + '</p>' +
        '<h1 class="fdemo-page-title">' + esc(c.empresa) + '</h1>' +
        '<p class="fdemo-page-sub">' + esc(dash(c.email)) + ' · ' + esc(dash(c.telefono)) + '</p></div>' +
        '<div class="fdemo-ficha-pills">' + pill(c.estado === 'cliente' ? 'Activo' : c.estado) + '</div></div>' +
        '<div class="fdemo-ficha-acts">' +
        '<button type="button" class="fdemo-btn variant-primary" data-action="fa-nueva" data-cliente="' + id + '">+ Factura para este cliente</button>' +
        (vencido.length ? '<button type="button" class="fdemo-btn variant-secondary" data-action="cl-reclama" data-id="' + id + '">Reclamar lo vencido</button>' : '') +
        '</div>' +
        pestanas(clave, tabs, tab) +
        '<div class="fdemo-tab-cuerpo" role="tabpanel">' + cuerpo + '</div>' +
        '</div>';
    }

    // ---------- Cobros ----------
    /* COBROS. La version anterior leia `listCobros()` —los PAGOS recibidos—
       y los filtraba por un `estadoCobro` que los pagos no tienen: salia
       todo a cero y cuatro tarjetas de «Sin datos suficientes». Lo que se
       cobra son FACTURAS, y cada una sabe cuanto le falta y desde cuando. */
    RENDERERS.cobros = function () {
      var hoy = FS.hoy;
      var fac = FS.listFacturas().filter(function (f) { return f.estado !== 'Borrador'; });
      var pend = fac.filter(function (f) { return FS.pendienteDe(f) > 0; });
      var venc = pend.filter(function (f) { return f.fechaVencimiento && f.fechaVencimiento < hoy; })
        .sort(function (a, b) { return FS.diasDeRetraso(b) - FS.diasDeRetraso(a); });
      var enPlazo = pend.filter(function (f) { return venc.indexOf(f) < 0; })
        .sort(function (a, b) { return a.fechaVencimiento < b.fechaVencimiento ? -1 : 1; });
      var pagos = FS.listCobros().slice().sort(function (a, b) { return a.fecha < b.fecha ? 1 : -1; });
      var mesActual = hoy.slice(0, 7);
      var cobradoMes = pagos.filter(function (c) { return (c.fecha || '').slice(0, 7) === mesActual; })
        .reduce(function (a, c) { return a + c.importe; }, 0);
      var tPend = pend.reduce(function (a, f) { return a + FS.pendienteDe(f); }, 0);
      var tVenc = venc.reduce(function (a, f) { return a + FS.pendienteDe(f); }, 0);
      var s = FS.getDashboardSnapshot();
      var ant = FS.getAntiguedad();
      var rec = state.reclamados || {};

      function dias(f) {
        var d = FS.diasDeRetraso(f);
        var t = d > 60 ? 'Más de 60 días' : d > 30 ? '31 a 60 días' : '1 a 30 días';
        return '<span class="fdemo-dias ' + (d > 60 ? 'd-3' : d > 30 ? 'd-2' : 'd-1') + '">' + d + ' días</span>' +
          '<span class="fdemo-pct">' + t + '</span>';
      }
      var filasV = venc.map(function (f) {
        var r = rec[f.id];
        return '<tr' + (r ? ' class="is-reclamada"' : '') + '><td>' + linkTo('facturas', f.id, f.numero) + '</td>' +
          '<td>' + linkTo('clientes', (f.clienteIds || [])[0] || '', f.clienteNombre) + '</td>' +
          '<td class="is-muted">' + FDATE(f.fechaVencimiento) + '</td>' +
          '<td>' + dias(f) + '</td>' +
          '<td class="is-right is-muted">' + ((f.recordatoriosEnviados || 0) + (r ? 1 : 0)) + '</td>' +
          '<td class="is-right"><b>' + EUR(FS.pendienteDe(f)) + '</b></td>' +
          '<td class="is-right">' + (r
            ? '<span class="fdemo-hecho">Reclamada hoy</span>'
            : '<button type="button" class="fdemo-btn-mini es-accion" data-action="reclamar" data-id="' + f.id + '">Reclamar</button>') +
          '</td></tr>';
      }).join('');
      var filasP = enPlazo.map(function (f) {
        var dd = Math.round((Date.parse(f.fechaVencimiento) - Date.parse(hoy)) / 86400000);
        return '<tr><td>' + linkTo('facturas', f.id, f.numero) + '</td>' +
          '<td class="is-muted">' + esc(f.clienteNombre) + '</td>' +
          '<td class="is-muted">' + FDATE(f.fechaVencimiento) + '</td>' +
          '<td><span class="fdemo-dias d-0">en ' + dd + ' días</span></td>' +
          '<td class="is-right">' + EUR(FS.pendienteDe(f)) + '</td>' +
          '<td>' + pill(f.estadoCobro === 'En seguimiento' ? 'En seguimiento' : 'Pendiente') + '</td></tr>';
      }).join('');
      var filasC = pagos.slice(0, 10).map(function (c) {
        return '<tr><td class="is-muted">' + FDATE(c.fecha) + '</td>' +
          '<td>' + linkTo('facturas', c.facturaId, c.numero) + '</td>' +
          '<td class="is-muted">' + esc(c.cliente) + '</td>' +
          '<td class="is-muted">' + esc(c.metodo) + '</td>' +
          '<td class="is-muted"><code>' + esc(c.referencia) + '</code></td>' +
          '<td class="is-right"><b>' + EUR(c.importe) + '</b></td>' +
          '<td>' + pill('Cobrado') + '</td></tr>';
      }).join('');
      var tramos = ant.tramos || [];

      return '<div class="fdemo-panel">' +
        '<div class="fdemo-panel-h"><div><p class="fdemo-eyebrow">Día a día</p>' +
        '<h1 class="fdemo-page-title">Cobros</h1>' +
        '<p class="fdemo-page-sub">Quién te debe, desde cuándo y qué hay que hacer hoy con cada factura.</p></div>' +
        '<button type="button" class="fdemo-btn variant-primary" data-action="reclamar-todo">Reclamar todo lo vencido</button></div>' +
        '<div class="fdemo-kpi-tira es-4">' +
        kpi2({ hero: true, tono: 'aviso', label: 'Pendiente de cobro', valor: EUR(tPend), hint: pend.length + ' facturas emitidas sin cobrar' }) +
        kpi2({ tono: 'critico', label: 'Fuera de plazo', valor: EUR(tVenc), hint: venc.length + ' facturas · reclamar primero' }) +
        kpi2({ label: 'Vence en 30 días', valor: EUR(s.venceEn30), hint: s.nVence30 + ' facturas' }) +
        kpi2({ tono: 'positivo', label: 'Cobrado este mes', valor: EUR(cobradoMes), hint: 'se tarda ' + s.dso + ' días de mediana' }) +
        '</div>' +
        seccion('Antigüedad de la deuda', 'cuánto te deben y desde hace cuánto',
          card('', '<div class="fdemo-card-body">' +
            '<div class="fdemo-apilada es-alta">' + tramos.map(function (t) {
              return '<i class="n-' + t.nivel + '" style="width:' + t.pct + '%" title="' + esc(t.etiqueta) + '"></i>';
            }).join('') + '</div>' +
            '<ul class="fdemo-ley-h">' + tramos.map(function (t) {
              return '<li><span class="pt n-' + t.nivel + '"></span><span class="et">' + esc(t.etiqueta) + '</span>' +
                '<b>' + EUR(t.total) + '</b><i>' + t.n + ' fact. · ' + t.pct + ' %</i></li>';
            }).join('') + '</ul></div>'), 1) +
        seccion('Fuera de plazo', 'ordenadas por lo que cuesta no reclamarlas',
          card('', tablaSimple([{t:'Factura'},{t:'Cliente'},{t:'Venció'},{t:'Retraso'},{t:'Recordat.',r:1},{t:'Pendiente',r:1},{t:'',r:1}], filasV, '')), 2) +
        seccion('Vence pronto', 'lo que está dentro de plazo, por fecha',
          card('', tablaSimple([{t:'Factura'},{t:'Cliente'},{t:'Vence'},{t:'Cuándo'},{t:'Pendiente',r:1},{t:'Estado'}], filasP, '')), 3) +
        seccion('Últimos cobros', 'lo que ha entrado, con su referencia bancaria',
          card('', tablaSimple([{t:'Fecha'},{t:'Factura'},{t:'Cliente'},{t:'Método'},{t:'Referencia'},{t:'Importe',r:1},{t:'Banco'}], filasC, '')), 4) +
        aviso('Un recordatorio no sale solo: se prepara y lo envías tú. Aquí queda contado cuántos lleva cada factura, porque a partir del tercero ya no es un recordatorio, es una conversación.') +
        '</div>';
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
        return { n: slug(g.proveedor) + '-' + (2400 + i * 13) + '.pdf',
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
        kpi2({ label: 'Enlaces públicos', valor: 'Ninguno', tono: 'positivo', hint: 'cada descarga comprueba tu permiso' }) +
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

      /* El avance del plazo: de la fecha de inicio a la de entrega prevista,
         cuánto se ha consumido. Es lo que dice si un proyecto que todavía no
         factura va a tiempo o se está comiendo el margen esperando. */
      function avance(p) {
        var tot = (p.inicio || 0) - (p.prevista || 0);
        if (tot <= 0) return 100;
        var hecho = p.estado === 'Entregado' ? tot : (p.inicio || 0);
        return Math.max(0, Math.min(100, Math.round(hecho / tot * 100)));
      }
      var rows = all.slice().sort(function (a, b) { return (a.rentabilidad || 0) - (b.rentabilidad || 0); }).map(function (p) {
        var r = p.rentabilidad || 0, pct = Math.round((Math.abs(r) / maxAbs) * 100), av = avance(p);
        return '<tr><td>' + linkTo('proyectos', p.id, p.nombre) + '<span class="fdemo-pct">' + esc(dash(p.serviciosContratados || p.servicios)) + '</span></td>' +
          '<td class="is-muted">' + esc(dash(p.empresa)) + '</td><td>' + pill(p.estado) + '</td>' +
          '<td style="min-width:120px;"><div class="fdemo-apilada"><i class="' + (av > 100 ? 'n-critico' : av > 85 ? 'n-aviso' : 'n-ok') + '" style="width:' + av + '%"></i></div>' +
          '<span class="fdemo-pct">' + (p.estado === 'Entregado' ? 'entregado ' + FDATE(p.fechaEntregaReal) : av + ' % del plazo · entrega ' + FDATE(p.fechaEntregaPrevista)) + '</span></td>' +
          '<td class="is-right">' + (p.totalFacturado > 0 ? EUR(p.totalFacturado) : '<span class="fdemo-pendiente">Sin facturar aún</span>') + '</td>' +
          '<td class="is-right">' + EUR(p.totalGastos) + '</td>' +
          '<td class="is-right ' + (r < 0 ? 'es-mal' : '') + '"><b>' + EUR(r) + '</b></td>' +
          '<td style="min-width:110px;"><div class="fdemo-apilada"><i class="' + (r < 0 ? 'n-critico' : 'n-ok') + '" style="width:' + pct + '%"></i></div></td></tr>';
      }).join('');

      var filasRiesgo = pierden.map(function (p) {
        return '<tr><td>' + linkTo('proyectos', p.id, p.nombre) + '</td>' +
          '<td class="is-muted">' + esc(dash(p.empresa)) + '</td>' +
          '<td class="is-right">' + (p.totalFacturado > 0 ? EUR(p.totalFacturado) : '<span class="fdemo-pendiente">Sin facturar aún</span>') + '</td>' +
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
          card('', tablaSimple([{t:'Proyecto'},{t:'Cliente'},{t:'Estado'},{t:'Plazo'},{t:'Facturado',r:1},{t:'Gastos',r:1},{t:'Rentabilidad',r:1},{t:''}], rows, 'Aún no hay proyectos registrados.')), 2) +
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
    // extracto del banco. El extracto se lee, pero cruzarlo con las facturas
    // es la conciliación bancaria, y eso solo se enseña hecho cuando el
    // estado de producto dice que existe (ESTADO_PRODUCTO.conciliacion).
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
        '<p class="fdemo-cajon-t">Prueba con uno de estos</p>' +
        '<p class="fdemo-cajon-p">Del PDF digital saca los datos y te los deja revisables. De una foto o un escaneado guarda el documento y lo deja listo para rellenar.</p>' +
        '<div class="fdemo-cajon-rej">' +
        DOCS.map(function (d) {
          return '<button type="button" class="fdemo-doc-op" data-action="doc-op" data-k="' + d.k + '">' +
            '<span class="fdemo-doc-op-i"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
            ICONO_DOC[d.icono] + '</svg></span>' +
            '<span class="fdemo-doc-op-c"><b>' + esc(d.n) + '</b><i>' + esc(d.t) + '</i></span>' +
            '<span class="fdemo-doc-op-p">' + esc(d.p) + '</span></button>';
        }).join('') + '</div>' +
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
      extracto: CONC_LISTA
        ? { t: 'Extracto conciliado', campos: [['Movimientos','34'],['Conciliados','11'],['Sin identificar','3'],['Periodo','01/09 – 20/09']], destino: 'Once cobros marcados. Tres movimientos no cuadran con ninguna factura: te los deja señalados en vez de asignarlos a ojo.', vista: 'cobros' }
        : { t: 'Extracto del banco reconocido', campos: [['Movimientos','34'],['Periodo','01/09 – 20/09'],['Conciliación bancaria', CONC_ETIQUETA]], destino: 'Cruzar cada movimiento con su factura es la conciliación bancaria, y ' + CONC_CUANDO + '. Hasta entonces no lo reparto a ojo: no asigno ningún movimiento.', vista: null, pronto: true }
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
          '<div class="fdemo-lector-pie ' + (S.pronto ? 'es-pronto' : 'es-hecho') + '"><p>' + esc(S.destino) + '</p>' +
          (S.vista ? '<button type="button" class="fdemo-btn variant-secondary" data-action="nav" data-view="' + S.vista + '">Ver ahí</button>' : '') + '</div>') +
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
        '<div class="fdemo-ask-sube">' +
        '<button type="button" class="fdemo-ask-clip' + (state.docCajon ? ' es-abierto' : '') + '" data-action="adjuntar" aria-expanded="' + (state.docCajon ? 'true' : 'false') + '">' +
        '<span class="fdemo-ask-clip-i" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">' +
        '<rect x="3.5" y="4.5" width="17" height="13.5" rx="2.5"/><circle cx="8.8" cy="10" r="1.7"/>' +
        '<path d="m4.5 16.5 4.6-4 3.6 3 2.7-2.3 4.1 3.3" stroke-linejoin="round"/></svg></span>' +
        '<span class="fdemo-ask-clip-c"><b>Sube fotos y archivos</b>' +
        '<i>Foto del móvil, PDF, Excel o CSV \u00b7 hasta 10 MB</i></span>' +
        '<span class="fdemo-ask-clip-x" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="m7 10 5 5 5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</span></button>' + cajonHtml() + '</div>' +
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
            '<span class="fdemo-interruptor es-on" data-action="plan" data-plan="editar" role="switch" aria-checked="true" aria-label="' + esc(r[0]) + '"><i></i></span></li>';
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

    /* ═══════════════ BUSCAR EN TODO Y LOS AVISOS ═══════════════
       Dos cosas que tiene cualquier aplicación que se usa a diario y que
       una demo de escaparate se ahorra: un buscador que encuentra una
       factura, un cliente, un módulo o una pregunta desde cualquier
       pantalla (Ctrl/⌘ K), y una campana con lo que ha pasado sin que
       nadie lo mire. Cada aviso lleva al sitio donde se resuelve. */
    function resultadosPaleta(q) {
      q = (q || '').toLowerCase().trim();
      var out = [];
      if (!q) {
        out.push({ tipo: 'Acción', t: 'Nueva factura', s: 'con el documento al lado', accion: 'fa-nueva' });
        out.push({ tipo: 'Acción', t: 'Preguntar a Finanzas', s: 'en lenguaje normal', v: 'ia' });
        out.push({ tipo: 'Acción', t: 'Reclamar todo lo vencido', s: 'un recordatorio a cada uno', v: 'cobros' });
        out.push({ tipo: 'Acción', t: 'Comprobar la cadena fiscal', s: 'eslabón a eslabón', v: 'verifactu' });
        ['dashboard', 'tesoreria', 'facturas', 'cobros', 'clientes'].forEach(function (id) {
          var m = NAV_ITEMS.filter(function (x) { return x.id === id; })[0];
          if (m) out.push({ tipo: 'Módulo', t: m.label, v: m.id });
        });
        return out;
      }
      var grupos = { c: [], f: [], p: [], m: [], q: [] };
      FS.listClientes().forEach(function (c) {
        if ((c.empresa + ' ' + (c.sector || '')).toLowerCase().indexOf(q) !== -1)
          grupos.c.push({ tipo: 'Cliente', t: c.empresa, s: c.sector || '', v: 'clientes', id: c.id });
      });
      todasLasFacturas().forEach(function (f) {
        if ((f.numero + ' ' + (f.clienteNombre || '')).toLowerCase().indexOf(q) !== -1)
          grupos.f.push({ tipo: 'Factura', t: f.numero + ' · ' + (f.clienteNombre || ''), s: EUR(f.importe), v: 'facturas', id: f.id });
      });
      FS.listProyectos().forEach(function (p) {
        if ((p.nombre + ' ' + p.empresa).toLowerCase().indexOf(q) !== -1)
          grupos.p.push({ tipo: 'Proyecto', t: p.nombre, s: p.empresa, v: 'proyectos', id: p.id });
      });
      NAV_ITEMS.forEach(function (m) {
        if (m.label.toLowerCase().indexOf(q) !== -1) grupos.m.push({ tipo: 'Módulo', t: m.label, v: m.id });
      });
      FS.askQuestions().forEach(function (p, i) {
        var hit = p.q.toLowerCase().indexOf(q) !== -1 || p.pistas.some(function (x) { return x.indexOf(q) !== -1 || q.indexOf(x) !== -1; });
        if (hit) grupos.q.push({ tipo: 'Pregunta a Finanzas', t: p.q, v: 'ia', ask: i });
      });
      return grupos.c.slice(0, 3).concat(grupos.f.slice(0, 4), grupos.p.slice(0, 2), grupos.m.slice(0, 3), grupos.q.slice(0, 2)).slice(0, 10);
    }
    function listaPaleta() {
      var rs = state.paleta.rs = resultadosPaleta(state.paleta.q);
      if (state.paleta.sel >= rs.length) state.paleta.sel = Math.max(0, rs.length - 1);
      if (!rs.length) return '<li class="fdemo-paleta-nada">Nada con «' + esc(state.paleta.q) + '». Prueba con un cliente, un número de factura o una palabra como «cobros».</li>';
      var ult = '';
      return rs.map(function (r, i) {
        var cab = r.tipo !== ult ? '<li class="fdemo-paleta-g" role="presentation">' + esc(r.tipo) + '</li>' : '';
        ult = r.tipo;
        return cab + '<li role="option" aria-selected="' + (i === state.paleta.sel) + '" class="fdemo-paleta-r' + (i === state.paleta.sel ? ' is-sel' : '') + '" data-action="paleta-ir" data-i="' + i + '">' +
          '<span class="t">' + esc(r.t) + '</span>' + (r.s ? '<span class="s">' + esc(r.s) + '</span>' : '') + '</li>';
      }).join('');
    }
    function avisosDe() {
      var hoy = FS.hoy, lista = [];
      var emit = FS.listFacturas().filter(function (f) { return f.estado !== 'Borrador' && vivaDe(f).pend > 0; });
      var venc = emit.filter(function (f) { return f.fechaVencimiento < hoy; });
      if (venc.length) {
        var maxD = Math.max.apply(null, venc.map(function (f) { return FS.diasDeRetraso(f); }));
        lista.push({ k: 'venc', tono: 'mal', t: venc.length + ' facturas fuera de plazo', d: EUR(venc.reduce(function (a, f) { return a + vivaDe(f).pend; }, 0)) + ' sin cobrar · la más antigua lleva ' + maxD + ' días', v: 'cobros', cuando: 'Hoy, 08:00' });
      }
      var semana = emit.filter(function (f) { return f.fechaVencimiento >= hoy && f.fechaVencimiento <= masDias(hoy, 7); });
      if (semana.length) lista.push({ k: 'semana', tono: 'aviso', t: semana.length === 1 ? 'Vence esta semana una factura' : 'Vencen esta semana ' + semana.length + ' facturas', d: semana[0].numero + ' de ' + semana[0].clienteNombre + ' · ' + EUR(vivaDe(semana[0]).pend), v: 'facturas', id: semana[0].id, cuando: 'Hoy, 08:00' });
      var sos = sospechosos().filter(function (s) { return s.estado === 'Retenido'; });
      if (sos.length) lista.push({ k: 'dup', tono: 'aviso', t: 'Retenida una posible factura duplicada', d: sos[0].gasto.proveedor + ' · ' + EUR(sos[0].importe) + ' · llegó por ' + sos[0].canal.t.toLowerCase(), v: 'duplicados', cuando: 'Ayer, 17:42' });
      var rev = FS.listGastos().filter(function (g) { return g.estadoRevision === 'Pendiente revisión'; });
      if (rev.length) lista.push({ k: 'rev', tono: 'info', t: rev.length + ' gastos leídos esperan tu visto bueno', d: 'Nada cuenta como coste cerrado hasta que alguien lo mira', v: 'gastos', cuando: 'Ayer, 09:15' });
      var ultCobro = FS.listCobros().slice().sort(function (a, b) { return a.fecha < b.fecha ? 1 : -1; })[0];
      if (ultCobro) lista.push({ k: 'cobro', tono: 'bien', t: 'Cobro recibido: ' + EUR(ultCobro.importe), d: ultCobro.cliente + ' · ' + ultCobro.numero + ' queda cobrada', v: 'facturas', id: ultCobro.facturaId, cuando: FDATE(ultCobro.fecha) });
      lista.push({ k: 'vf', tono: 'bien', t: 'La cadena del registro fiscal, entera', d: 'Todas las facturas emitidas, encadenadas · ninguna huella rota', v: 'verifactu', cuando: 'Cada noche' });
      return lista;
    }
    function sinLeer() { return avisosDe().filter(function (a) { return !state.leidos[a.k]; }).length; }
    function pintaCampana() {
      var n = sinLeer(), b = root.querySelector('[data-role="campana-n"]');
      if (b) { b.textContent = n; b.hidden = !n; }
    }
    function pintaCapa() {
      var capa = root.querySelector('[data-role="capa"]');
      if (!capa) return;
      if (state.capa === 'paleta') {
        capa.innerHTML = '<div class="fdemo-capa-velo" data-action="capa-cierra"></div>' +
          '<div class="fdemo-paleta" role="dialog" aria-label="Buscar en todo">' +
          '<div class="fdemo-paleta-in"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5" stroke-linecap="round"/></svg>' +
          '<input data-role="paleta-q" type="text" autocomplete="off" spellcheck="false" aria-label="Buscar" placeholder="Una factura, un cliente, un módulo o una pregunta…" value="' + esc(state.paleta.q) + '"><kbd>Esc</kbd></div>' +
          '<ul class="fdemo-paleta-l" role="listbox" data-role="paleta-l">' + listaPaleta() + '</ul>' +
          '<p class="fdemo-paleta-pie"><span>↑ ↓ para moverte</span><span>Enter para abrir</span><span>Ctrl/⌘ K desde cualquier pantalla</span></p></div>';
        capa.className = 'fdemo-capa is-on';
      } else if (state.capa === 'avisos') {
        var av = avisosDe();
        capa.innerHTML = '<div class="fdemo-capa-velo es-claro" data-action="capa-cierra"></div>' +
          '<div class="fdemo-avisos" role="dialog" aria-label="Avisos">' +
          '<div class="fdemo-avisos-h"><p>Avisos</p><button type="button" class="fdemo-link" data-action="avisos-leidos">Marcar todo como leído</button></div>' +
          '<ul>' + av.map(function (a) {
            return '<li class="t-' + a.tono + (state.leidos[a.k] ? ' es-leido' : '') + '"><button type="button" data-action="aviso-ir" data-k="' + a.k + '">' +
              '<span class="fdemo-avisos-p" aria-hidden="true"></span><span class="fdemo-avisos-c"><b>' + esc(a.t) + '</b><i>' + esc(a.d) + '</i></span>' +
              '<span class="fdemo-avisos-w">' + esc(a.cuando) + '</span></button></li>';
          }).join('') + '</ul>' +
          '<p class="fdemo-avisos-pie">Los mismos avisos llegan por correo o a tu canal, con el umbral que elijas.</p></div>';
        capa.className = 'fdemo-capa is-on es-avisos';
      } else {
        capa.innerHTML = '';
        capa.className = 'fdemo-capa';
      }
      pintaCampana();
    }
    function abrePaleta(q) {
      state.capa = 'paleta'; state.paleta = { q: q || '', sel: 0, rs: [] };
      pintaCapa();
      var inp = root.querySelector('[data-role="paleta-q"]');
      if (inp) actuaElRecorrido(function () { inp.focus({ preventScroll: true }); });
    }
    function cierraCapa() { state.capa = null; pintaCapa(); }
    function irAResultado(r) {
      cierraCapa();
      if (!r) return;
      if (r.accion === 'fa-nueva') { state.borrador = borradorNuevo(); navigate('facturas', 'nueva'); return; }
      if (r.ask != null) { navigate('ia'); askIndex(r.ask); return; }
      navigate(r.v, r.id || null);
    }

    /* ORDENAR POR CUALQUIER COLUMNA. Todas las tablas de la aplicación se
       ordenan pulsando su cabecera —importe, fecha, días, texto— y el orden
       se recuerda en esa pantalla mientras dura la visita. */
    function claveOrden() { var r = parseRoute(); return r.view + '/' + (r.id || '') + '/' + JSON.stringify(state.tabs); }
    function valorCelda(td) {
      var t = (td.getAttribute('data-orden') || td.textContent || '').trim();
      var m = /^(−?-?[\d.]+,\d{2})\s?€/.exec(t);
      if (m) return parseFloat(m[1].replace('−', '-').replace(/\./g, '').replace(',', '.'));
      var d = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(t);
      if (d) return Date.parse(d[3] + '-' + d[2] + '-' + d[1]);
      var d2 = /^(\d{1,2}) (ene|feb|mar|abr|may|jun|jul|ago|sept?|oct|nov|dic)\w* (\d{4})/.exec(t);
      if (d2) return Date.UTC(+d2[3], ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'].indexOf(d2[2].slice(0, 3)), +d2[1]);
      var n = /^-?\d+(?:[.,]\d+)?(?=\s|$|%)/.exec(t);
      if (n) return parseFloat(n[0].replace(',', '.'));
      return t.toLowerCase();
    }
    function ordenaTablas() {
      var o = state.orden[claveOrden()];
      var tablas = contentEl.querySelectorAll('.fdemo-table');
      contentEl.querySelectorAll('.fdemo-table th.es-ordenable').forEach(function (th) {
        th.removeAttribute('aria-sort'); th.classList.remove('ord-asc', 'ord-desc');
      });
      if (!o || !tablas[o.t]) return;
      var tabla = tablas[o.t], th = tabla.querySelectorAll('thead th')[o.c];
      if (!th) return;
      th.setAttribute('aria-sort', o.d > 0 ? 'ascending' : 'descending');
      th.classList.add(o.d > 0 ? 'ord-asc' : 'ord-desc');
      var tbody = tabla.querySelector('tbody');
      var filas = [].slice.call(tbody.children);
      filas.sort(function (a, b) {
        var ca = a.children[o.c], cb = b.children[o.c];
        if (!ca || !cb || a.children.length !== b.children.length) return 0;
        var va = valorCelda(ca), vb = valorCelda(cb);
        if (typeof va === typeof vb) return (va < vb ? -1 : va > vb ? 1 : 0) * o.d;
        return typeof va === 'number' ? -1 : 1;
      });
      filas.forEach(function (f) { tbody.appendChild(f); });
    }

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
      var accEl = e.target.closest('[data-action]');
      var acc = accEl ? accEl.getAttribute('data-action') : '';
      /* ── Pestañas, fichas, editor, tesorería, buscador y avisos ── */
      if (acc === 'tab') {
        e.preventDefault();
        state.tabs[accEl.getAttribute('data-clave')] = accEl.getAttribute('data-tab');
        repinta();
        var tabsEl = contentEl.querySelector('.fdemo-tabs');
        if (tabsEl && tabsEl.getBoundingClientRect().top < mainEl.getBoundingClientRect().top) mainEl.scrollTop += tabsEl.getBoundingClientRect().top - mainEl.getBoundingClientRect().top - 12;
        return;
      }
      if (acc === 'fa-cobro') {
        e.preventDefault();
        var fc = facturaPorId(accEl.getAttribute('data-id'));
        if (fc) {
          var pc = vivaDe(fc).pend;
          state.cobrados[fc.id] = pc;
          anota(fc.id, 'Cobro de ' + EUR(pc) + ' registrado · la factura queda cobrada', 'bien');
          if (fc.clienteIds && fc.clienteIds[0]) anota(fc.clienteIds[0], 'Cobro de ' + fc.numero + ' registrado · ' + EUR(pc), 'bien');
          repinta();
          toast('Cobro registrado: ' + EUR(pc) + ' · ' + fc.numero + ' pasa a cobrada en todo el sistema');
        }
        return;
      }
      if (acc === 'fa-enviar') {
        e.preventDefault();
        var fe = facturaPorId(accEl.getAttribute('data-id'));
        if (fe) {
          var retE = FS.diasDeRetraso(fe) > 0 && !state.cobrados[fe.id];
          var cliE = clienteDeFactura(fe);
          state.enviados[fe.id] = (state.enviados[fe.id] || 0) + (retE ? 1 : 0);
          state.reclamados = state.reclamados || {}; if (retE) state.reclamados[fe.id] = true;
          anota(fe.id, (retE ? 'Recordatorio enviado' : 'Factura enviada') + ' a ' + (cliE && cliE.email ? cliE.email : 'el cliente'), retE ? 'aviso' : 'info');
          repinta();
          toast((retE ? 'Recordatorio preparado para ' : 'Factura preparada para ') + (cliE ? cliE.empresa : 'el cliente') + ' · en la demo no sale ningún correo', 'info');
        }
        return;
      }
      if (acc === 'fa-rect') {
        e.preventDefault();
        var fo = facturaPorId(accEl.getAttribute('data-id'));
        if (fo) {
          var nR = (state.facturasNuevas || []).filter(function (x) { return x.tipo === 'rectificativa'; }).length + 1;
          var rf = { id: 'rc' + nR + fo.id, numero: 'R-2026-' + String(nR).padStart(4, '0'), manual: true, nueva: true, tipo: 'rectificativa', serie: 'R',
            motivo: 'Rectifica la factura ' + fo.numero + ' de ' + FDATE(fo.fechaEmision) + ': anulación total por error en el importe facturado.',
            lineas: lineasFactura(fo).map(function (l) { return { c: l.c, d: 'Rectifica ' + fo.numero, cant: -1, precio: l.precio, dto: l.dto, iva: l.iva != null ? l.iva : 21 }; }),
            clienteIds: fo.clienteIds, clienteNombre: fo.clienteNombre, fechaEmision: FS.hoy, fechaVencimiento: FS.hoy,
            base: -(fo.base != null ? fo.base : r2(fo.importe / 1.21)), iva: -(fo.iva != null ? fo.iva : 0), importe: -fo.importe, importeCobrado: -fo.importe,
            recordatoriosEnviados: 0, metodoPago: fo.metodoPago, estado: 'Borrador', estadoCobro: null, proyecto: fo.proyecto };
          state.facturasNuevas = [rf].concat(state.facturasNuevas || []);
          anota(rf.id, 'Rectificativa preparada en borrador desde ' + fo.numero, 'info');
          anota(fo.id, 'Rectificativa ' + rf.numero + ' preparada en borrador', 'aviso');
          navigate('facturas', rf.id);
          toast('Rectificativa ' + rf.numero + ' en borrador: lleva el motivo y las líneas en negativo', 'info');
        }
        return;
      }
      if (acc === 'fa-emitir') {
        e.preventDefault();
        var fb = facturaPorId(accEl.getAttribute('data-id'));
        if (fb && fb.manual) {
          fb.estado = 'Enviada'; fb.estadoCobro = fb.tipo === 'rectificativa' ? null : 'Pendiente';
          anota(fb.id, 'Emitida y registrada · huella ' + huella(fb.numero + fb.importe), 'bien');
          repinta();
          toast(fb.numero + ' emitida y encadenada en el registro fiscal');
        }
        return;
      }
      if (acc === 'fa-nueva') {
        e.preventDefault();
        state.borrador = borradorNuevo(accEl.getAttribute('data-cliente'));
        state.vistaRapida = null;
        navigate('facturas', 'nueva');
        return;
      }
      if (acc === 'fa-chip') {
        e.preventDefault();
        state.facturaFiltro.chip = accEl.getAttribute('data-k');
        repinta();
        return;
      }
      if (acc === 'fa-limpia') {
        e.preventDefault();
        state.facturaFiltro = { q: '', estado: '', chip: 'todas' };
        repinta();
        return;
      }
      if (acc === 'vr-cierra') { e.preventDefault(); state.vistaRapida = null; repinta(); return; }
      if (acc === 'bf-linea') {
        e.preventDefault();
        state.borrador.lineas.push({ c: '', d: '', cant: 1, precio: 0, dto: 0 });
        repinta();
        var nuevos = contentEl.querySelectorAll('[data-bf="c"]');
        if (nuevos.length) nuevos[nuevos.length - 1].focus({ preventScroll: true });
        return;
      }
      if (acc === 'bf-quita') {
        e.preventDefault();
        state.borrador.lineas.splice(Number(accEl.getAttribute('data-i')), 1);
        repinta();
        return;
      }
      if (acc === 'bf-guardar') {
        e.preventDefault();
        var emite = accEl.getAttribute('data-emitir') === '1';
        var nf = guardaBorrador(emite);
        if (!nf) { toast('Falta algo: una línea con concepto y precio', 'aviso'); return; }
        navigate('facturas', nf.id);
        toast(emite ? nf.numero + ' emitida por ' + EUR(nf.importe) + ' · registrada con su huella' : 'Borrador ' + nf.numero + ' guardado · ' + EUR(nf.importe));
        return;
      }
      if (acc === 'cl-reclama') {
        e.preventDefault();
        var cidR = accEl.getAttribute('data-id'), nRc = 0, tRc = 0;
        state.reclamados = state.reclamados || {};
        FS.listFacturas().forEach(function (x) {
          if (x.clienteIds.indexOf(cidR) !== -1 && vivaDe(x).pend > 0 && x.fechaVencimiento < FS.hoy && x.estado !== 'Borrador') {
            state.reclamados[x.id] = true; state.enviados[x.id] = (state.enviados[x.id] || 0) + 1;
            anota(x.id, 'Recordatorio enviado desde la ficha del cliente', 'aviso'); nRc++; tRc += vivaDe(x).pend;
          }
        });
        anota(cidR, nRc + ' recordatorios enviados · ' + EUR(tRc), 'aviso');
        repinta();
        toast(nRc + ' recordatorio' + (nRc === 1 ? '' : 's') + ' preparado' + (nRc === 1 ? '' : 's') + ' · ' + EUR(tRc) + ' por reclamar', 'info');
        return;
      }
      if (acc === 'te-h') { e.preventDefault(); state.te.h = Number(accEl.getAttribute('data-h')); repinta(); return; }
      if (acc === 'te-e') { e.preventDefault(); state.te.e = accEl.getAttribute('data-e'); repinta(); return; }
      if (acc === 'paleta') { e.preventDefault(); abrePaleta(''); return; }
      if (acc === 'avisos') { e.preventDefault(); state.capa = state.capa === 'avisos' ? null : 'avisos'; pintaCapa(); return; }
      if (acc === 'capa-cierra') { e.preventDefault(); cierraCapa(); return; }
      if (acc === 'paleta-ir') { e.preventDefault(); irAResultado(state.paleta.rs[Number(accEl.getAttribute('data-i'))]); return; }
      if (acc === 'avisos-leidos') { e.preventDefault(); avisosDe().forEach(function (a) { state.leidos[a.k] = true; }); pintaCapa(); return; }
      if (acc === 'aviso-ir') {
        e.preventDefault();
        var av = avisosDe().filter(function (a) { return a.k === accEl.getAttribute('data-k'); })[0];
        if (av) { state.leidos[av.k] = true; cierraCapa(); navigate(av.v, av.id || null); }
        return;
      }
      /* Una fila de factura, pulsada fuera de su número, abre la vista
         rápida; el número sigue llevando a la ficha entera. */
      var filaF = e.target.closest('tr.es-abrible[data-fid]');
      if (filaF && !e.target.closest('a, button, input, select')) {
        e.preventDefault();
        state.vistaRapida = filaF.getAttribute('data-fid');
        if (parseRoute().view !== 'facturas') { navigate('facturas', filaF.getAttribute('data-fid')); state.vistaRapida = null; return; }
        repinta();
        return;
      }
      /* Ordenar cualquier tabla pulsando su cabecera. */
      var thO = e.target.closest('.fdemo-table th.es-ordenable');
      if (thO) {
        e.preventDefault();
        var tablaO = thO.closest('table'), idxT = [].indexOf.call(contentEl.querySelectorAll('.fdemo-table'), tablaO);
        var col = [].indexOf.call(thO.parentNode.children, thO);
        var clvO = claveOrden();
        var prevO = state.orden[clvO];
        state.orden[clvO] = { t: idxT, c: col, d: prevO && prevO.t === idxT && prevO.c === col ? -prevO.d : (thO.classList.contains('is-right') ? -1 : 1) };
        ordenaTablas();
        return;
      }
      if (acc === 'reclamar') {
        e.preventDefault();
        state.reclamados = state.reclamados || {};
        state.reclamados[accEl.getAttribute('data-id')] = true;
        var fr = FS.listFacturas().filter(function (x) { return x.id === accEl.getAttribute('data-id'); })[0];
        repinta();
        toast('Recordatorio preparado para ' + (fr ? fr.clienteNombre : 'el cliente') + ' · ' + (fr ? EUR(FS.pendienteDe(fr)) : ''));
        return;
      }
      if (acc === 'reclamar-todo') {
        e.preventDefault();
        state.reclamados = state.reclamados || {};
        var nV = 0, tV = 0;
        FS.listFacturas().forEach(function (x) {
          if (x.estado !== 'Borrador' && FS.pendienteDe(x) > 0 && x.fechaVencimiento < FS.hoy) { state.reclamados[x.id] = true; nV++; tV += FS.pendienteDe(x); }
        });
        repinta();
        toast(nV + ' recordatorios preparados · ' + EUR(tV) + ' por reclamar');
        return;
      }
      if (acc === 'dup-descarta' || acc === 'dup-alta') {
        e.preventDefault();
        var dd = (state.sospechas || []).filter(function (x) { return x.id === accEl.getAttribute('data-id'); })[0];
        if (dd) dd.estado = acc === 'dup-descarta' ? 'Descartado' : 'Dado de alta';
        repinta();
        toast(acc === 'dup-descarta' ? 'Descartado: ' + EUR(dd.importe) + ' que no se pagan dos veces' : 'Dado de alta como gasto nuevo', acc === 'dup-descarta' ? 'ok' : 'info');
        return;
      }
      if (acc === 'vf-comprobar') {
        e.preventDefault();
        state.vfComprobado = 0;
        clearInterval(state.vfT);
        state.vfT = setInterval(function () {
          state.vfComprobado++;
          if (state.vfComprobado >= 12) { clearInterval(state.vfT); toast('Cadena comprobada: 12 eslabones, ninguna huella rota'); }
          repinta();
        }, 170);
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
        /* En la portada no hay planes: el botón no puede quedarse mudo, lleva
           a la página de Finance, a sus planes. */
        else location.href = ((document.documentElement.getAttribute('lang') || 'es').slice(0, 2) === 'en' ? '/en' : '') + '/sistema-financiero#planes';
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

    /* Escribir en un campo que filtra no puede obligar a pulsar «Filtrar»:
       la lista responde a cada letra. El foco y el cursor se devuelven al
       campo, porque repintar se los quitaría. */
    function devuelveFoco(sel, pos) {
      var inp = contentEl.querySelector(sel);
      if (!inp) return;
      actuaElRecorrido(function () { inp.focus({ preventScroll: true }); });
      try { inp.setSelectionRange(pos, pos); } catch (err) { /* type=search en algunos navegadores */ }
    }
    root.addEventListener('input', function (e) {
      var t = e.target;
      if (t.matches('[data-role="factura-filter"] input[name="q"]')) {
        state.facturaFiltro.q = t.value;
        var p1 = t.selectionStart;
        repinta(); devuelveFoco('[data-role="factura-filter"] input[name="q"]', p1);
      } else if (t.matches('[data-role="cliente-filter"] input[name="q"]')) {
        state.clienteFiltro.q = t.value;
        var p2 = t.selectionStart;
        repinta(); devuelveFoco('[data-role="cliente-filter"] input[name="q"]', p2);
      } else if (t.matches('[data-role="te-saldo"]')) {
        state.te.saldo = t.value;
        var p3 = t.selectionStart;
        repinta(); devuelveFoco('[data-role="te-saldo"]', p3);
      } else if (t.matches('[data-role="paleta-q"]')) {
        state.paleta.q = t.value; state.paleta.sel = 0;
        var l = root.querySelector('[data-role="paleta-l"]');
        if (l) l.innerHTML = listaPaleta();
      } else if (t.matches('[data-bf]')) {
        var b = state.borrador; if (!b) return;
        var k = t.getAttribute('data-bf'), i = Number(t.getAttribute('data-i'));
        if (k === 'c') b.lineas[i].c = t.value;
        else if (k === 'cant' || k === 'precio' || k === 'dto') b.lineas[i][k] = numeroDe(t.value);
        refrescaBorrador();
      }
    });
    root.addEventListener('change', function (e) {
      var t = e.target;
      if (!t.matches('[data-bf]') || !state.borrador) return;
      var k = t.getAttribute('data-bf');
      if (k === 'cliente') state.borrador.clienteId = t.value;
      else if (k === 'vence') state.borrador.vence = Number(t.value);
      else if (k === 'iva') state.borrador.iva = Number(t.value);
      else if (k === 'irpf') state.borrador.irpf = t.checked;
      else return;
      refrescaBorrador();
    });
    root.addEventListener('keydown', function (e) {
      if (state.capa === 'paleta' && e.target.matches('[data-role="paleta-q"]')) {
        var rs = state.paleta.rs || [];
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          state.paleta.sel = (state.paleta.sel + (e.key === 'ArrowDown' ? 1 : -1) + rs.length) % Math.max(1, rs.length);
          var l = root.querySelector('[data-role="paleta-l"]');
          if (l) { l.innerHTML = listaPaleta(); var s = l.querySelector('.is-sel'); if (s) s.scrollIntoView({ block: 'nearest' }); }
        } else if (e.key === 'Enter') { e.preventDefault(); irAResultado(rs[state.paleta.sel]); }
      }
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('th.es-ordenable')) { e.preventDefault(); e.target.click(); return; }
      if (e.key === 'Escape') {
        if (state.capa) { cierraCapa(); return; }
        if (state.vistaRapida) { state.vistaRapida = null; repinta(); }
      }
    });
    /* Ctrl/⌘ K abre el buscador cuando la demo es donde está la persona:
       con el foco dentro o el ratón encima. Fuera, el atajo es del
       navegador y no se toca. */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !root.contains(document.activeElement) && (state.capa || state.vistaRapida)) {
        if (state.capa) cierraCapa(); else { state.vistaRapida = null; repinta(); }
        return;
      }
      if (!(e.metaKey || e.ctrlKey) || String(e.key).toLowerCase() !== 'k') return;
      if (!(root.contains(document.activeElement) || root.matches(':hover'))) return;
      e.preventDefault();
      if (state.capa === 'paleta') cierraCapa(); else abrePaleta('');
    });
    /* La curva se lee con el ratón: una línea vertical sigue al puntero y
       dice la fecha y el saldo de ese día. */
    root.addEventListener('pointermove', function (e) {
      var svg = e.target.closest && e.target.closest('.fdemo-curva-svg');
      var g = svg && svg.querySelector('[data-role="curva-hover"]');
      if (!g) return;
      var serie = JSON.parse(svg.getAttribute('data-serie'));
      var box = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
      var L = +svg.getAttribute('data-l'), R = +svg.getAttribute('data-r'), T = +svg.getAttribute('data-t'), B = +svg.getAttribute('data-b');
      var lo = +svg.getAttribute('data-lo'), hi = +svg.getAttribute('data-hi');
      var x = (e.clientX - box.left) / box.width * vb.width;
      var i = Math.round((x - L) / (vb.width - L - R) * (serie.length - 1));
      if (i < 0 || i >= serie.length) { g.style.display = 'none'; return; }
      var X = L + i / (serie.length - 1) * (vb.width - L - R), Y = T + (1 - (serie[i] - lo) / (hi - lo)) * (vb.height - T - B);
      g.style.display = '';
      var ln = g.querySelector('line'); ln.setAttribute('x1', X); ln.setAttribute('x2', X);
      var c = g.querySelector('circle'); c.setAttribute('cx', X); c.setAttribute('cy', Y);
      var izq = X > vb.width - 180, rx = izq ? X - 160 : X + 10, ry = Math.max(T, Math.min(Y - 20, vb.height - B - 40));
      var rc = g.querySelector('rect'); rc.setAttribute('x', rx); rc.setAttribute('y', ry);
      var ta = g.querySelector('text.a'), tb = g.querySelector('text.b');
      ta.setAttribute('x', rx + 10); ta.setAttribute('y', ry + 16); ta.textContent = i === 0 ? 'Hoy' : FDATE(masDias(svg.getAttribute('data-f0'), i));
      tb.setAttribute('x', rx + 10); tb.setAttribute('y', ry + 32); tb.textContent = EUR(serie[i]);
    });
    root.addEventListener('pointerleave', function () {
      var g = root.querySelector('[data-role="curva-hover"]');
      if (g) g.style.display = 'none';
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
    /* EL GUION. Una aplicación no se demuestra cambiando de pantalla: se
       demuestra USÁNDOLA. La mano va al sitio exacto, llega, pulsa o
       escribe letra a letra, y SOLO DESPUÉS pasa lo que tiene que pasar. Se
       empieza por lo más llamativo —preguntarle a Finanzas en
       lenguaje normal— y se sigue por donde lleva la respuesta: la factura,
       sus pestañas, un recordatorio, el cobro, la lista, una factura nueva
       escrita delante, la caja, los duplicados, el registro fiscal, los
       avisos, el buscador y el lector de documentos.

       `sel` es a dónde va la mano; sin `sel`, al módulo del menú. `quieto`
       significa que el paso no cambia de pantalla por su cuenta. */
    var TOUR = [
      { v: 'ia', ms: 1500, dice: 'Le preguntamos a Finanzas, como a una persona' },
      { v: 'ia', ms: 700, dice: 'Escribimos la pregunta…', quieto: true,
        sel: '[data-role="ia-form"] input', hace: 'escribe', texto: '¿Quién nos debe dinero ahora mismo?' },
      { v: 'ia', ms: 5600, dice: '…y contesta con las cifras y de dónde sale cada una', quieto: true,
        sel: '[data-role="ia-form"] button[type="submit"]', hace: 'pulsa' },
      { v: 'ia', ms: 2600, dice: 'Cada respuesta lleva a su factura', quieto: true,
        sel: '.fdemo-ia-msgs > .fdemo-ia-msg:last-child .fdemo-ia-ref', hace: 'pulsa' },
      { v: 'facturas', ms: 3400, dice: 'Así la recibe el cliente', quieto: true,
        sel: '.fdemo-tab[data-tab="documento"]', hace: 'pulsa' },
      { v: 'facturas', ms: 3200, dice: 'Todo lo que ha pasado con ella', quieto: true,
        sel: '.fdemo-tab[data-tab="actividad"]', hace: 'pulsa' },
      { v: 'facturas', ms: 3000, dice: 'Un recordatorio, sin escribir ningún correo', quieto: true,
        sel: '.fdemo-ficha-acts [data-action="fa-enviar"]', hace: 'pulsa' },
      { v: 'facturas', ms: 1500, dice: 'Y el día que paga…', quieto: true,
        sel: '.fdemo-tab[data-tab="resumen"]', hace: 'pulsa' },
      { v: 'facturas', ms: 3600, dice: '…se registra y cambia en todo el sistema', quieto: true,
        sel: '.fdemo-ficha-acts [data-action="fa-cobro"]', hace: 'pulsa' },
      { v: 'facturas', ms: 1800, dice: 'Volvemos a la lista', quieto: true,
        sel: '.fdemo-crumb a', hace: 'pulsa' },
      { v: 'facturas', ms: 2600, dice: 'Solo lo que está fuera de plazo', quieto: true,
        sel: '.fdemo-chip-f[data-k="fuera"]', hace: 'pulsa' },
      { v: 'facturas', ms: 2400, dice: 'Ordenado por importe', quieto: true,
        sel: '.fdemo-table th:nth-child(6)', hace: 'pulsa' },
      { v: 'facturas', ms: 3800, dice: 'Una fila se abre sin salir de la lista…', quieto: true,
        sel: '.fdemo-table tbody tr:first-child td:nth-child(2)', hace: 'pulsa' },
      { v: 'facturas', ms: 1500, dice: '…y se cierra', quieto: true,
        sel: '.fdemo-rapida-x', hace: 'pulsa' },
      { v: 'facturas', ms: 1400, dice: 'Una factura nueva', quieto: true,
        sel: '.fdemo-panel-h [data-action="fa-nueva"]', hace: 'pulsa' },
      { v: 'facturas', ms: 400, dice: 'Se escribe el concepto…', quieto: true,
        sel: '[data-bf="c"]', hace: 'escribe', texto: 'Mantenimiento web · octubre' },
      { v: 'facturas', ms: 2600, dice: '…el precio, y el documento cambia con cada tecla', quieto: true,
        sel: '[data-bf="precio"]', hace: 'escribe', texto: '1250' },
      { v: 'facturas', ms: 2600, dice: 'Emitida: con su número y su registro', quieto: true,
        sel: '[data-action="bf-guardar"][data-emitir="1"]', hace: 'pulsa' },
      { v: 'facturas', ms: 3600, dice: 'Encadenada a la anterior con su huella', quieto: true,
        sel: '.fdemo-tab[data-tab="registro"]', hace: 'pulsa' },

      { v: 'tesoreria', ms: 2400, dice: 'Tesorería: la caja de los próximos días' },
      { v: 'tesoreria', ms: 2200, dice: 'A noventa días…', quieto: true,
        sel: '[data-action="te-h"][data-h="90"]', hace: 'pulsa' },
      { v: 'tesoreria', ms: 3000, dice: '…con lo que tarda de verdad cada cliente', quieto: true,
        sel: '[data-action="te-e"][data-e="prudente"]', hace: 'pulsa' },
      { v: 'tesoreria', ms: 3400, dice: 'Y con tu saldo, si quieres darlo', quieto: true,
        sel: '[data-role="te-saldo"]', hace: 'escribe', texto: '24.000' },

      { v: 'duplicados', ms: 2400, dice: 'Duplicados: retenidos antes de pagarse' },
      { v: 'duplicados', ms: 3000, dice: 'Es el mismo: no se paga dos veces', quieto: true,
        sel: '[data-action="dup-descarta"]', hace: 'pulsa' },
      { v: 'verifactu', ms: 1600, dice: 'El registro fiscal, comprobable delante de quien sea' },
      { v: 'verifactu', ms: 3600, dice: 'Eslabón a eslabón', quieto: true,
        sel: '[data-action="vf-comprobar"]', hace: 'pulsa' },
      { v: 'verifactu', ms: 3000, dice: 'Los avisos de lo que ha pasado sin mirar', quieto: true,
        sel: '[data-action="avisos"]', hace: 'pulsa' },
      { v: 'verifactu', ms: 2400, dice: 'Cada aviso lleva a donde se resuelve', quieto: true,
        sel: '.fdemo-avisos li:first-child button', hace: 'pulsa' },
      { v: 'cobros', ms: 700, dice: 'Y todo se encuentra desde cualquier pantalla', quieto: true,
        sel: '[data-action="paleta"]', hace: 'pulsa' },
      { v: 'cobros', ms: 1300, dice: 'Y todo se encuentra desde cualquier pantalla', quieto: true,
        sel: '[data-role="paleta-q"]', hace: 'escribe', texto: 'vandria' },
      { v: 'cobros', ms: 2400, dice: 'Un cliente, al momento', quieto: true,
        sel: '.fdemo-paleta-r.is-sel', hace: 'paleta-ir' },
      { v: 'clientes', ms: 3400, dice: 'Toda la relación con él, en orden', quieto: true,
        sel: '.fdemo-tab[data-tab="actividad"]', hace: 'pulsa' },

      { v: 'ia', ms: 2400, dice: 'Y ahora, un documento de verdad', hace: 'abrir' },
      { v: 'ia', ms: 2200, dice: 'Le soltamos un PDF con veinte facturas dentro…', hace: 'remesa', quieto: true },
      { v: 'ia', ms: 5400, dice: '…y las va sacando una a una', quieto: true },
      { v: 'ia', ms: 2600, dice: 'Las da de alta todas', hace: 'alta', quieto: true },
      { v: 'facturas', ms: 2600, dice: 'Ahí están, en Facturas' },
      { v: 'facturas', ms: 3600, dice: 'Y cada una sabe de qué página del PDF ha salido', quieto: true,
        sel: 'tbody tr.is-nuevo .fdemo-link[data-id^="nv"]', hace: 'pulsa' },
      { v: 'facturas', ms: 4400, dice: 'Eso se revisa sin abrir el documento', quieto: true },
      { v: 'dashboard', ms: 6000, dice: 'Y todo acaba aquí: el panel dice qué pasa hoy' }
    ];
    var REANUDA_MS = 6000;   // seis segundos sin tocar nada y el recorrido vuelve solo
    var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var tour = { on: false, i: 0, t0: 0, dur: 1, timer: 0, raf: 0, vuelta: 0, visible: false, mano: false, yo: false, yoT: 0, vueltas: 0, perdidos: 0 };
    var tourTxtEl = root.querySelector('[data-role="tour-txt"]');
    var tourBtnEl = root.querySelector('[data-role="tour"]');
    var tourBarEl = root.querySelector('[data-role="tour-bar"] i');

    /* Al empezar una vuelta completa se deja la demo como estaba: lo que
       hizo la vuelta anterior —el cobro, la factura nueva, el duplicado
       descartado— no puede seguir ahí, o la segunda vuelta enseñaría una
       aplicación distinta de la primera. Lo que ha hecho una PERSONA no se
       toca: solo se limpia cuando el propio recorrido da la vuelta. */
    function limpiaLaVisita() {
      state.cobrados = {}; state.enviados = {}; state.eventos = {}; state.reclamados = {};
      state.facturasNuevas = null; state.sospechas = null; state.vfComprobado = 0; clearInterval(state.vfT);
      state.tabs = {}; state.orden = {}; state.te = { h: 60, e: 'base', saldo: '' };
      state.borrador = null; state.vistaRapida = null; state.leidos = {}; state.capa = null;
      state.facturaFiltro = { q: '', estado: '', chip: 'todas' }; state.clienteFiltro = { q: '' };
      state.docCajon = false; state.lector = null; clearTimeout(state.lectorT);
      state.ia.mensajes = state.ia.mensajes.slice(0, 2);
      pintaCapa();
    }


    /* ══════════════ LA MANO ══════════════
       Un puntero de verdad: flecha, sombra y onda al pulsar. Un punto sin
       forma se lee como un adorno; una flecha se lee como alguien usando la
       aplicación, que es justo lo que está pasando. */
    var manoEl = root.querySelector('[data-role="mano"]');
    var focoEl = root.querySelector('[data-role="foco"]');
    var manoT = [0, 0, 0, 0, 0];
    var manoP = null;   // dónde está ahora la luz, para saber de dónde viene
    function manoLimpia() {
      for (var i = 0; i < manoT.length; i++) clearTimeout(manoT[i]);
      if (manoEl) manoEl.classList.remove('is-ahi', 'is-pulsa', 'is-viaja');
      if (focoEl) focoEl.classList.remove('is-ahi');
      manoP = null;
    }
    /* Si el sitio al que va la mano está fuera de la vista —debajo de la
       tabla, al fondo del hilo—, primero se desplaza el contenedor que lo
       tiene, y solo el contenedor: nunca la página que envuelve la demo. */
    function asoma(el) {
      var movio = false, p = el.parentElement;
      while (p && p !== root) {
        var st = getComputedStyle(p);
        if (/(auto|scroll)/.test(st.overflowY) && p.scrollHeight > p.clientHeight + 2) {
          var c = p.getBoundingClientRect(), e = el.getBoundingClientRect();
          if (e.top < c.top + 8 || e.bottom > c.bottom - 8) {
            var destino = p.scrollTop + (e.top - c.top) - Math.max(24, (c.height - e.height) * 0.4);
            p.scrollTo({ top: Math.max(0, destino), behavior: 'smooth' });
            movio = true;
          }
        }
        p = p.parentElement;
      }
      return movio;
    }
    function llevaLaManoA(selector, hecho) {
      var destino = root.querySelector(selector);
      if (!manoEl || !destino || reducido) { hecho(); return; }
      var espera = asoma(destino) ? 520 : 0;
      manoT[3] = setTimeout(function () {
        if (!tour.on) return;
        var caja = destino.getBoundingClientRect(), marco = root.getBoundingClientRect();
        if (!caja.width || caja.bottom < marco.top - 40 || caja.top > marco.bottom + 40) { hecho(); return; }
        var dx0 = caja.left - marco.left + Math.min(34, caja.width * 0.5);
        var dy0 = caja.top - marco.top + caja.height * 0.5;
        /* La luz deja estela: se orienta según de dónde viene y se alarga con
           la distancia recorrida. No es un puntero de ratón prestado; es el
           propio sistema encendiendo lo que va a usar. */
        if (manoP) {
          var vx = dx0 - manoP[0], vy = dy0 - manoP[1], dist = Math.hypot(vx, vy);
          if (dist > 14) {
            manoEl.style.setProperty('--ang', (Math.atan2(vy, vx) * 180 / Math.PI).toFixed(1) + 'deg');
            manoEl.style.setProperty('--len', Math.round(Math.min(150, 26 + dist * 0.42)) + 'px');
            manoEl.classList.add('is-viaja');
            manoT[4] = setTimeout(function () { manoEl.classList.remove('is-viaja'); }, 620);
          }
        }
        manoP = [dx0, dy0];
        manoEl.style.transform = 'translate(' + dx0 + 'px,' + dy0 + 'px)';
        manoEl.classList.add('is-ahi');
        /* Y el destino se enmarca: se ve QUÉ va a tocar antes de tocarlo. */
        if (focoEl) {
          focoEl.style.transform = 'translate(' + (caja.left - marco.left) + 'px,' + (caja.top - marco.top) + 'px)';
          focoEl.style.width = Math.round(caja.width) + 'px';
          focoEl.style.height = Math.round(caja.height) + 'px';
          focoEl.style.borderRadius = getComputedStyle(destino).borderRadius || '10px';
          focoEl.classList.add('is-ahi');
        }
        /* El orden importa: primero llega, después pulsa, y SOLO DESPUÉS
           cambia la pantalla. Lo que convence es ver el efecto detrás de la
           causa, no a la vez. */
        manoT[0] = setTimeout(function () { manoEl.classList.add('is-pulsa'); }, 560);
        manoT[1] = setTimeout(function () { hecho(); }, 760);
        manoT[2] = setTimeout(function () {
          manoEl.classList.remove('is-pulsa');
          if (focoEl) focoEl.classList.remove('is-ahi');
        }, 1060);
      }, espera);
    }

    function pintaTour() {
      root.classList.toggle('is-tour', tour.on);
      if (tourTxtEl && !tour.on) tourTxtEl.textContent = 'Lo llevas tú';
      if (tourTxtEl && tour.on && !tourTxtEl.textContent) tourTxtEl.textContent = 'Recorrido automático';
      if (tourBtnEl) tourBtnEl.setAttribute('title', tour.on ? 'Parar el recorrido y navegar tú' : 'Volver al recorrido automático');
      if (!tour.on && tourBarEl) tourBarEl.style.transform = 'scaleX(0)';
    }
    /* Escribir de verdad, letra a letra, y con los mismos eventos que una
       persona: cada letra dispara `input`, así que el buscador filtra, el
       documento se rehace y la curva se mueve mientras se escribe. 55 ms por
       letra es la velocidad a la que se reconoce que hay alguien tecleando.
       El campo se vuelve a buscar en cada letra porque algunos repintan la
       pantalla y el campo de antes ya no existe. */
    var escribeT = 0;
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
      actuaElRecorrido(function () { campo.focus({ preventScroll: true }); campo.value = ''; campo.dispatchEvent(new Event('input', { bubbles: true })); });
      var i = 0;
      clearInterval(escribeT);
      escribeT = setInterval(function () {
        if (!tour.on) { clearInterval(escribeT); return; }
        var c = root.querySelector(selector);
        if (!c) { clearInterval(escribeT); hecho(); return; }
        actuaElRecorrido(function () {
          c.value = texto.slice(0, ++i);
          c.dispatchEvent(new Event('input', { bubbles: true }));
        });
        if (i >= texto.length) { clearInterval(escribeT); hecho(); }
      }, 55);
    }

    /* MEDIDO: el fallo que se veía en la demo. Casi todos los pasos son
       `quieto`: no cambian de pantalla, pulsan algo de la pantalla en la que
       ya están. Si un paso anterior no pudo pulsar —porque la persona había
       dejado la aplicación en otro sitio—, los siguientes seguían corriendo
       sobre una pantalla que no era la suya: la barra avanzaba y el rótulo
       contaba cosas, pero no pasaba nada. Ahora, en cuanto un paso no
       encuentra su sitio, la visita empieza de nuevo desde el principio, que
       es el único estado que el recorrido sabe reconstruir. */
    function reengancha() {
      if (!tour.on) return;
      if (tour.perdidos++ > 2) {
        /* Tres intentos perdidos: la aplicación se deja como recién abierta
           —sin fichas, sin filtros, sin capas— y la visita arranca de ahí. */
        tour.perdidos = 0;
        actuaElRecorrido(function () { limpiaLaVisita(); state.route = 'dashboard'; state.id = null; render(); });
      }
      tour.i = 0; tour.limpiar = true;
      clearTimeout(tour.timer);
      tour.timer = setTimeout(function () { if (tour.on) pasoTour(); }, 420);
    }
    function pasoTour() {
      if (tour.i > 0 && tour.i % TOUR.length === 0) { tour.vueltas++; tour.limpiar = true; }
      var paso = TOUR[tour.i % TOUR.length];
      var primero = tour.i % TOUR.length === 0;
      /* Un paso quieto que va a pulsar algo tiene que tener ese algo delante. */
      if (paso.quieto && paso.sel && paso.hace === 'pulsa' && !root.querySelector(paso.sel)) { reengancha(); return; }
      tour.i++;
      if (tourTxtEl && paso.dice) tourTxtEl.textContent = paso.dice;

      function sigue() {
        if (!tour.on) return;
        if (tour.i > 3) tour.perdidos = 0;   // la visita va por buen camino
        tour.t0 = Date.now(); tour.dur = paso.ms;
        clearTimeout(tour.timer);
        tour.timer = setTimeout(function () { if (tour.on) pasoTour(); }, paso.ms);
      }
      function aplica() {
        if (!tour.on) return;
        var perdido = false;
        actuaElRecorrido(function () {
          if (!paso.quieto) {
            state.route = paso.v; state.id = null;
            if (primero && tour.limpiar) { limpiaLaVisita(); tour.limpiar = false; }
            if (state.capa) { state.capa = null; pintaCapa(); }
            state.vistaRapida = null;
            /* Cada vez que el recorrido ENTRA en una pantalla, la encuentra
               limpia: sin el filtro ni el orden que dejó un paso anterior. */
            if (paso.v === 'facturas') { state.facturaFiltro = { q: '', estado: '', chip: 'todas' }; state.orden = {}; }
            render();
          }
          if (paso.hace === 'abrir') { state.docCajon = true; render(); }
          if (paso.hace === 'remesa') { sueltaDoc('remesa'); }
          if (paso.hace === 'alta') { if (state.lector && state.lector.fase === 'leido') daDeAlta(); }
          if (paso.hace === 'pulsa') {
            /* Pulsar DE VERDAD el elemento al que ha ido la mano. Simular el
               efecto sin pulsar el botón es exactamente lo que hace que una
               demo se note falsa. */
            var el = root.querySelector(paso.sel);
            if (el) el.click(); else perdido = true;
          }
          if (paso.hace === 'paleta-ir') { irAResultado((state.paleta.rs || [])[state.paleta.sel]); }
        });
        if (perdido) { reengancha(); return; }
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
        /* Y empieza LIMPIA: lo que dejó abierto la persona (una ficha, un
           filtro, una capa) no puede quedarse debajo del recorrido nuevo. */
        tour.limpiar = true;
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
    ['pointerdown', 'keydown', 'focusin'].forEach(function (ev) {
      root.addEventListener(ev, manoEncima, { passive: true });
    });
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
