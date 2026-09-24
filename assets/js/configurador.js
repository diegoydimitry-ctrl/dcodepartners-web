/* ============================================================================
   D-CODE PARTNERS — EL CONFIGURADOR
   ----------------------------------------------------------------------------
   Antes esto era un formulario de quince campos. Rellenarlo era trabajo, y el
   trabajo lo hacía la persona que todavía no sabe si le interesamos.

   Aquí se elige, no se escribe: tarjetas, chips y un paso por pregunta. Cada
   respuesta cambia la siguiente —a una clínica no se le pregunta por las
   reservas de mesa—, el resumen se va montando a la vista y al final sale una
   ESTIMACIÓN, dicha como lo que es: una horquilla inicial, no un presupuesto.

   Lo que NO hace, a propósito:
   · no pide un solo dato personal hasta el final;
   · no inventa productos: todo lo que propone sale de catalogo.json, que es
     de donde salen también los precios de /precios (window.DCP_CATALOGO);
   · no sustituye al formulario de contacto: lo rellena. El envío, el
     consentimiento y la verificación siguen siendo exactamente los de antes,
     sin tocar una línea. Quien prefiera escribir a mano, baja y escribe.

   Accesible: cada paso es un <fieldset> con su <legend>, las opciones son
   botones de verdad con aria-pressed, el foco viaja al paso nuevo y el
   progreso se anuncia una sola vez por paso.
   ========================================================================= */
(function () {
  'use strict';

  var host = document.getElementById('configurador');
  if (!host) return;
  var D = document;
  var EN = (D.documentElement.lang || 'es').slice(0, 2) === 'en';
  var CAT = window.DCP_CATALOGO || null;

  /* ------------------------------------------------------------ palabras */
  var L = EN ? {
    kicker: 'Configurator', titulo: 'Let’s design your system.',
    sub: 'Five questions, no typing. At the end you get what you would need and roughly what it would cost.',
    de: 'of', atras: 'Back', seguir: 'Continue', empezar: 'Start again',
    saltar: 'I’d rather just write to you',
    resumen: 'Your configuration', estimacion: 'Initial estimate',
    setup: 'to roll it out', mes: 'per month', entre: 'between',
    nada: 'Pick at least one option to keep going.',
    enviar: 'Send this configuration', enviarSub: 'We read it, and we answer with what we would build and what it would cost — in writing.',
    aviso: 'Initial estimate, not a quote. The final price depends on the scope; we agree it in writing before anything starts.',
    listo: 'Your configuration is in the form. Now just your details.',
    pasos: ['Your company', 'What you want to improve', 'How many people', 'What to build', 'How much tailoring'],
    animos: ['', 'Good. Now, where does it hurt?', 'Noted. This changes what you need.',
             'Halfway there.', 'Last one, and we are done.'],
    animoFin: 'Done. This is what we would build.'
  } : {
    kicker: 'Configurador', titulo: 'Vamos a diseñar tu sistema.',
    sub: 'Cinco preguntas, sin escribir. Al final sale qué te haría falta y cuánto costaría, aproximadamente.',
    de: 'de', atras: 'Atrás', seguir: 'Continuar', empezar: 'Empezar de nuevo',
    saltar: 'Prefiero escribiros directamente',
    resumen: 'Tu configuración', estimacion: 'Estimación inicial',
    setup: 'de implantación', mes: 'al mes', entre: 'entre',
    nada: 'Elige al menos una opción para seguir.',
    enviar: 'Enviar esta configuración', enviarSub: 'La leemos y te contestamos con qué construiríamos y qué costaría, por escrito.',
    aviso: 'Estimación inicial, no un presupuesto. El precio final depende del alcance; lo cerramos por escrito antes de empezar.',
    listo: 'Tu configuración ya está en el formulario. Ahora solo faltan tus datos.',
    pasos: ['Tu empresa', 'Qué quieres mejorar', 'Cuánta gente', 'Qué montamos', 'Cuánto hay que adaptarlo'],
    animos: ['', 'Bien. Ahora, ¿dónde duele?', 'Anotado. Esto cambia lo que te hace falta.',
             'Vas por la mitad.', 'La última, y ya está.'],
    animoFin: 'Listo. Esto es lo que construiríamos.'
  };

  /* ------------------------------------------------------------- sectores */
  var SECTORES = [
    { id: 'inmobiliaria', es: 'Inmobiliaria', en: 'Real estate', i: 'llave' },
    { id: 'restaurante',  es: 'Restauración', en: 'Restaurants', i: 'plato' },
    { id: 'clinica',      es: 'Clínica',      en: 'Clinic',      i: 'pulso' },
    { id: 'asesoria',     es: 'Asesoría',     en: 'Accounting',  i: 'papel' },
    { id: 'gimnasio',     es: 'Gimnasio',     en: 'Gym',         i: 'pesa' },
    { id: 'ecommerce',    es: 'Ecommerce',    en: 'Ecommerce',   i: 'caja' },
    { id: 'agencia',      es: 'Agencia',      en: 'Agency',      i: 'chispa' },
    { id: 'industria',    es: 'Industria y obra', en: 'Industry and trades', i: 'tuerca' },
    { id: 'otro',         es: 'Otro',         en: 'Something else', i: 'mas' }
  ];

  /* Lo que se pregunta en el paso 2 CAMBIA con el sector. No es decorado: a
     una clínica preguntarle por las reseñas de Google y por las reservas de
     mesa la misma pregunta es lo que hace que un formulario parezca tonto. */
  var MEJORAS = {
    inmobiliaria: [['leads','Captación de leads','Lead capture'],['visitas','Seguimiento de visitas','Viewing follow-up'],['docs','Documentación y contratos','Paperwork and contracts'],['portales','Publicación en portales','Listing portals'],['cobros','Cobros y facturación','Payments and invoicing'],['fuera','Atender fuera de horario','Answering out of hours']],
    restaurante: [['reservas','Reservas','Bookings'],['resenas','Reseñas','Reviews'],['proveedores','Pedidos y proveedores','Orders and suppliers'],['whatsapp','WhatsApp','WhatsApp'],['fideliza','Fidelización','Loyalty'],['cobros','Facturación','Invoicing']],
    clinica: [['citas','Citas y recordatorios','Appointments and reminders'],['docs','Historia y documentos','Records and documents'],['cobros','Cobros y facturación','Payments and invoicing'],['whatsapp','Atención por WhatsApp','WhatsApp support'],['seguros','Seguros y mutuas','Insurers']],
    asesoria: [['docs','Documentos de clientes','Client documents'],['impuestos','Impuestos y plazos','Taxes and deadlines'],['cobros','Facturación','Invoicing'],['recordar','Recordatorios de cobro','Payment reminders'],['repetidas','Consultas repetidas','Repeated questions']],
    gimnasio: [['altas','Altas y bajas','Sign-ups and cancellations'],['cuotas','Cuotas y recibos','Fees and receipts'],['reservas','Reservas de clase','Class bookings'],['recuperar','Recuperar a quien deja de venir','Winning back lapsed members'],['whatsapp','WhatsApp','WhatsApp']],
    ecommerce: [['pedidos','Pedidos y stock','Orders and stock'],['devoluciones','Devoluciones','Returns'],['atencion','Atención al cliente','Customer support'],['cobros','Facturación','Invoicing'],['conectar','Conectar la tienda con el resto','Connecting the shop to the rest']],
    agencia: [['propuestas','Propuestas y presupuestos','Proposals and quotes'],['horas','Partes de horas','Timesheets'],['cobros','Facturación por proyecto','Project invoicing'],['clientes','Seguimiento de clientes','Client follow-up'],['informes','Informes','Reporting']],
    industria: [['partes','Partes de trabajo','Work orders'],['avisos','Avisos y averías','Call-outs and breakdowns'],['albaranes','Albaranes y facturación','Delivery notes and invoicing'],['compras','Compras y proveedores','Purchasing and suppliers'],['planifica','Planificación','Scheduling']],
    otro: [['cobros','Facturar y cobrar','Invoicing and getting paid'],['repetido','Trabajo repetido','Repeated work'],['atencion','Atención al cliente','Customer support'],['conectar','Herramientas que no se hablan','Tools that don’t talk'],['datos','Saber qué está pasando','Knowing what’s going on'],['otro','Otra cosa','Something else']]
  };

  var GENTE = [
    { id: '1-3',  es: '1 a 3 personas',  en: '1 to 3 people' },
    { id: '4-10', es: '4 a 10 personas', en: '4 to 10 people' },
    { id: '11-25',es: '11 a 25 personas',en: '11 to 25 people' },
    { id: '25+',  es: 'Más de 25',       en: 'More than 25' }
  ];

  var PIEZAS = [
    { id: 'finance', es: 'El sistema financiero', en: 'The financial system', d_es: 'Facturas, cobros, gastos, tesorería e impuestos.', d_en: 'Invoices, payments, expenses, cash flow and taxes.' },
    { id: 'auto',    es: 'Automatizaciones',      en: 'Automations',          d_es: 'Lo que hoy se hace a mano cada semana.', d_en: 'What is done by hand every week.' },
    { id: 'agente',  es: 'Un agente de IA',       en: 'An AI agent',          d_es: 'Que atienda, cualifique y responda con tus datos.', d_en: 'To answer, qualify and reply with your data.' },
    { id: 'integra', es: 'Conectar herramientas', en: 'Connect tools',        d_es: 'Que el dato entre una vez y aparezca donde toca.', d_en: 'Data entered once, showing up where it should.' },
    { id: 'os',      es: 'La capa que lo conecta todo', en: 'The layer that connects it all', d_es: 'D-Code OS: el mapa, la actividad y el rastro.', d_en: 'D-Code OS: the map, the activity and the trail.' },
    { id: 'medida',  es: 'Algo hecho a medida',   en: 'Something tailored',   d_es: 'Cuando lo que necesitas no se compra hecho.', d_en: 'When what you need cannot be bought ready-made.' }
  ];

  var NIVEL = [
    { id: 'estandar', es: 'Tal cual viene',     en: 'As it comes',        d_es: 'Lo estándar me vale.', d_en: 'Standard works for me.', k: 1 },
    { id: 'ajustes',  es: 'Con algunos ajustes',en: 'With some tweaks',   d_es: 'Mis campos y mis formas de trabajar.', d_en: 'My fields and my way of working.', k: 1.25 },
    { id: 'medida',   es: 'A mi medida',        en: 'Fully tailored',     d_es: 'Mi negocio no se parece a ninguno.', d_en: 'My business is not like any other.', k: 1.6 }
  ];

  var el = function (t, c, x) { var e = D.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };

  /* ─────────────────── LAS FIGURAS QUE CRUZAN LA PANTALLA ───────────────────
     Elegir «Cobros y facturación» hace que un billete con piernas salga
     corriendo de lado a lado. Cada opción tiene la suya: el calendario da
     saltos, el engranaje rueda, la caja da tumbos, la estrella gira.

     Por qué esto y no confeti: el confeti dice «has pulsado algo»; una
     figura que cruza dice QUÉ has pulsado, y engancha lo suficiente como
     para querer ver la siguiente. Que es exactamente lo que se le pide a un
     formulario que nadie tiene ganas de rellenar.

     Son SVG de 2 KB dibujados aquí, no imágenes: pesan nada, heredan el
     color del tema y se animan con transform, que es lo único que no cuesta
     fotogramas. */
  var TRAZO = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  /* Todas llevan patas: el momento en que le salen es el que hace gracia, y
     un reloj con patas corriendo es mejor chiste que un reloj sin ellas. */
  function svg(cuerpo) {
    return '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">' + cuerpo +
      '<g class="cfg-pies"><path d="M19 41v5" ' + TRAZO + '/><path d="M29 41v5" ' + TRAZO + '/></g>' +
      '</svg>';
  }
  var ICONOS = {
    /* dinero: el billete con piernas, que es el que pidió el encargo */
    dinero:   { paso: 'corre', svg: svg('<rect x="7" y="12" width="34" height="21" rx="3" ' + TRAZO + '/><circle cx="24" cy="22.5" r="5.5" ' + TRAZO + '/><path d="M13 18v9M35 18v9" ' + TRAZO + '/>') },
    calendario:{ paso: 'salta', svg: svg('<rect x="8" y="11" width="32" height="28" rx="4" ' + TRAZO + '/><path d="M8 20h32M17 7v8M31 7v8" ' + TRAZO + '/><circle cx="18" cy="28" r="2" fill="currentColor"/><circle cx="27" cy="28" r="2" fill="currentColor"/>') },
    estrella: { paso: 'gira',  svg: svg('<path d="M24 8l4.9 9.9 10.9 1.6-7.9 7.7 1.9 10.9-9.8-5.2-9.8 5.2 1.9-10.9-7.9-7.7 10.9-1.6z" ' + TRAZO + '/>') },
    chat:     { paso: 'salta', svg: svg('<path d="M40 24c0 7.7-7.2 14-16 14-2.3 0-4.5-.4-6.4-1.2L8 40l3.4-8.3C9.2 29.5 8 26.9 8 24c0-7.7 7.2-14 16-14s16 6.3 16 14z" ' + TRAZO + '/><circle cx="18" cy="24" r="1.8" fill="currentColor"/><circle cx="24" cy="24" r="1.8" fill="currentColor"/><circle cx="30" cy="24" r="1.8" fill="currentColor"/>') },
    papel:    { paso: 'vuela', svg: svg('<path d="M13 6h14l9 9v27H13z" ' + TRAZO + '/><path d="M27 6v9h9M19 26h12M19 33h9" ' + TRAZO + '/>') },
    caja:     { paso: 'rueda', svg: svg('<path d="M24 7l17 8v18l-17 8-17-8V15z" ' + TRAZO + '/><path d="M7 15l17 8 17-8M24 23v18" ' + TRAZO + '/>') },
    reloj:    { paso: 'salta', svg: svg('<circle cx="24" cy="24" r="16" ' + TRAZO + '/><path d="M24 14v10l7 4" ' + TRAZO + '/>') },
    engranaje:{ paso: 'rueda', svg: svg('<circle cx="24" cy="24" r="7" ' + TRAZO + '/><path d="M24 5v6M24 37v6M43 24h-6M11 24H5M37.4 10.6l-4.2 4.2M14.8 33.2l-4.2 4.2M37.4 37.4l-4.2-4.2M14.8 14.8l-4.2-4.2" ' + TRAZO + '/>') },
    chispa:   { paso: 'vuela', svg: svg('<path d="M26 5L12 27h10l-2 16 16-23H26z" ' + TRAZO + '/>') },
    enchufe:  { paso: 'corre', svg: svg('<path d="M18 6v10M30 6v10M12 16h24v6a12 12 0 0 1-24 0z" ' + TRAZO + '/><path d="M24 34v8" ' + TRAZO + '/>') },
    lupa:     { paso: 'salta', svg: svg('<circle cx="21" cy="21" r="12" ' + TRAZO + '/><path d="M30 30l11 11" ' + TRAZO + '/>') },
    gente:    { paso: 'corre', svg: svg('<circle cx="24" cy="15" r="6" ' + TRAZO + '/><path d="M12 38c0-6.6 5.4-11 12-11s12 4.4 12 11" ' + TRAZO + '/>') },
    pantalla: { paso: 'salta', svg: svg('<rect x="6" y="10" width="36" height="24" rx="3" ' + TRAZO + '/><path d="M18 40h12M24 34v6" ' + TRAZO + '/>') },
    llave:    { paso: 'gira',  svg: svg('<circle cx="17" cy="31" r="8" ' + TRAZO + '/><path d="M23 25L40 8M34 14l4 4M30 18l4 4" ' + TRAZO + '/>') },
    carro:    { paso: 'rueda', svg: svg('<path d="M7 9h5l5 21h19l4-14H14" ' + TRAZO + '/><circle cx="20" cy="38" r="3" ' + TRAZO + '/><circle cx="34" cy="38" r="3" ' + TRAZO + '/>') },
    grafica:  { paso: 'salta', svg: svg('<path d="M8 38V10M8 38h32" ' + TRAZO + '/><path d="M15 31l7-8 6 5 9-12" ' + TRAZO + '/>') },
  };

  /* Qué figura le toca a cada opción. Las que no estén aquí salen con la de
     su paso, que nunca es ninguna. */
  var DE = {
    /* sectores */
    inmobiliaria:'llave', restaurante:'calendario', clinica:'reloj', asesoria:'papel',
    gimnasio:'gente', ecommerce:'carro', agencia:'grafica', industria:'caja', otro:'lupa',
    /* lo que se quiere mejorar */
    leads:'lupa', visitas:'calendario', docs:'papel', portales:'pantalla', cobros:'dinero',
    fuera:'chat', reservas:'calendario', resenas:'estrella', proveedores:'caja',
    whatsapp:'chat', fideliza:'estrella', citas:'reloj', seguros:'papel',
    impuestos:'papel', recordar:'reloj', repetidas:'chat', altas:'gente', cuotas:'dinero',
    recuperar:'gente', pedidos:'caja', devoluciones:'caja', atencion:'chat',
    conectar:'enchufe', propuestas:'papel', horas:'reloj', clientes:'gente', informes:'grafica',
    partes:'papel', avisos:'chispa', albaranes:'papel', compras:'caja', planifica:'calendario',
    repetido:'engranaje', datos:'grafica',
    /* piezas */
    finance:'dinero', auto:'engranaje', agente:'chat', integra:'enchufe',
    os:'pantalla', medida:'llave', web:'pantalla',
    /* tamaño y nivel */
    '1-3':'gente', '4-10':'gente', '11-25':'gente', '25+':'gente',
    estandar:'engranaje', ajustes:'engranaje', 'a-medida':'llave',
  };
  var POR_PASO = ['lupa', 'chispa', 'gente', 'engranaje', 'llave'];

  /* ══════════════════ EL BICHO QUE SALE DE LA TARJETA ══════════════════
     Al elegir una opción NO aparece un adorno: se abre la tarjeta, asoma
     por detrás la figura de eso que acabas de elegir, mira alrededor, le
     salen dos patitas y se va corriendo por la página hasta que se cansa y
     se marcha de un salto.

     Cinco actos, y cada uno existe por algo:
       1 · la tapa se abre       — dice de dónde sale, y engancha
       2 · asoma y mira          — le da un segundo de vida antes de correr
       3 · le salen las patitas  — se dibujan de cero; es el momento gracioso
       4 · corre por la página   — recorrido propio, rebota y cambia de altura
       5 · salta y se va         — con su polvareda

     Todo con transform y opacity y con la API de animaciones del navegador,
     que las hace en el compositor: ni un reflow en los tres segundos. Uno
     cada vez, y ninguno para quien pide menos movimiento. */

  var QUIETO = window.matchMedia('(prefers-reduced-motion: reduce)');
  var TACTIL = window.matchMedia('(pointer:coarse)').matches;
  var hayBicho = false;

  function capa() {
    var c = D.getElementById('cfg-pista');
    if (!c) {
      c = el('div', 'cfg-pista'); c.id = 'cfg-pista';
      c.setAttribute('aria-hidden', 'true');
      D.body.appendChild(c);
    }
    return c;
  }

  /* Tres rastros: la mota de polvo de siempre, una chispa que sale
     disparada y una estela que se estira y se apaga. Cada andar lleva el
     suyo, así que por lo que deja detrás ya se sabe qué ha pasado. */
  function polvo(x, y, tipo) {
    var p = el('i', 'cfg-polvo' + (tipo && tipo !== 'polvo' ? ' es-' + tipo : ''));
    p.style.left = x + 'px'; p.style.top = y + 'px';
    if (tipo === 'chispa') {
      p.style.setProperty('--dx', (Math.random() * 44 - 22).toFixed(0) + 'px');
      p.style.setProperty('--dy', (18 + Math.random() * 30).toFixed(0) + 'px');
    }
    if (tipo === 'estela') p.style.setProperty('--gir', (Math.random() * 40 - 20).toFixed(0) + 'deg');
    capa().appendChild(p);
    window.setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 820);
  }

  /* El recorrido: cuatro o cinco tramos que rebotan entre los bordes y
     cambian de altura. No es una línea recta de lado a lado porque una línea
     recta se mira una vez; esto se sigue con la vista. */
  /* CADA BICHO, SU RECORRIDO.
     Antes todos salían y rebotaban igual: la segunda vez ya no sorprendía a
     nadie. Ahora la forma del recorrido la decide el propio icono, así que
     el del dinero siempre va como el dinero y el del reloj como el reloj, y
     cambiar de respuesta cambia lo que cruza la pantalla. */
  var ANDARES = {
    /* de rebote, tocando arriba y abajo */
    saltos: function (x0, y0, W, H) {
      var p = [], x = x0, arriba = true;
      for (var i = 0; i < 4; i++) {
        x = Math.min(W - 70, x + 200 + Math.random() * 190);
        p.push({ x: x, y: arriba ? 110 + Math.random() * 60 : H - 170 - Math.random() * 60, dir: 1 });
        arriba = !arriba;
      }
      return p;
    },
    /* una curva larga y limpia, de lado a lado */
    curva: function (x0, y0, W, H) {
      var p = [], d = x0 < W / 2 ? 1 : -1;
      for (var i = 1; i <= 4; i++) {
        p.push({ x: x0 + d * (W * 0.26) * i, y: y0 - Math.sin(i / 4 * Math.PI) * 230, dir: d });
      }
      return p;
    },
    /* zigzag corto y nervioso */
    nervio: function (x0, y0, W, H) {
      var p = [], x = x0, y = y0, d = 1;
      for (var i = 0; i < 6; i++) {
        d = i % 2 ? -1 : 1;
        x = Math.max(50, Math.min(W - 70, x + d * (130 + Math.random() * 120)));
        y = Math.max(100, Math.min(H - 150, y - 55 - Math.random() * 60));
        p.push({ x: x, y: y, dir: d });
      }
      return p;
    },
    /* da la vuelta entera a la pantalla */
    vuelta: function (x0, y0, W, H) {
      return [{ x: W - 90, y: y0, dir: 1 },
              { x: W - 90, y: 130, dir: 1 },
              { x: 70, y: 130, dir: -1 },
              { x: 70, y: H - 170, dir: -1 },
              { x: W * 0.5, y: H - 170, dir: 1 }];
    },
    /* se deja caer y sube de golpe */
    caida: function (x0, y0, W, H) {
      var d = x0 < W / 2 ? 1 : -1;
      return [{ x: x0 + d * 170, y: H - 160, dir: d },
              { x: x0 + d * 380, y: y0 - 60, dir: d },
              { x: x0 + d * 560, y: H - 190, dir: d },
              { x: x0 + d * 760, y: 150, dir: d }];
    },
  };
  /* Qué anda cómo. Lo que no esté aquí, curva. */
  var ANDA = {
    dinero: 'saltos', carro: 'saltos', caja: 'saltos',
    chispa: 'nervio', enchufe: 'nervio', engranaje: 'nervio',
    reloj: 'vuelta', calendario: 'vuelta',
    grafica: 'caida', papel: 'caida', estrella: 'caida',
    lupa: 'curva', chat: 'curva', gente: 'curva', pantalla: 'curva', llave: 'curva',
  };
  /* Y qué va dejando detrás: polvo, chispas o una estela. */
  var RASTRO = { saltos: 'polvo', nervio: 'chispa', vuelta: 'estela', caida: 'estela', curva: 'polvo' };

  function ruta(x0, y0, id) {
    var W = window.innerWidth, H = window.innerHeight;
    var andar = ANDA[id] || 'curva';
    var pasos = ANDARES[andar](x0, y0, W, H).map(function (p) {
      return { x: Math.max(40, Math.min(W - 70, p.x)), y: Math.max(90, Math.min(H - 130, p.y)), dir: p.dir };
    });
    var u = pasos[pasos.length - 1];
    /* y se larga por arriba */
    pasos.push({ x: u.x + (u.dir > 0 ? 260 : -260), y: -140, dir: u.dir, salto: true });
    pasos.rastro = RASTRO[andar];
    return pasos;
  }

  /* ══════════════════ LOS PERSONAJES ══════════════════
     Al elegir una opción entra en escena UN PERSONAJE, distinto en cada
     familia, y le hace algo al bloque que acabas de pulsar: lo revienta, lo
     tira de un zarpazo, se lo lleva volando, lo arranca con una pinza o sale
     por debajo rompiéndolo en dos.

     Están dibujados a mano en SVG —con sus degradados, su luz de canto y su
     sombra—, no son iconos de línea: la gracia está en que se reconozca al
     bicho, no en que se adivine. Y cada uno entra, hace lo suyo y se va en
     menos de un segundo y medio; ninguno se queda por ahí.

     Un solo personaje a la vez, y ninguno para quien pide menos movimiento. */

  var DEFS =
    '<defs>' +
    /* pelo de gato */
    '<linearGradient id="pgato" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#6b6f7e"/><stop offset=".45" stop-color="#4a4e5c"/><stop offset="1" stop-color="#2e313c"/></linearGradient>' +
    '<radialGradient id="pyema" cx=".35" cy=".3" r=".8">' +
      '<stop offset="0" stop-color="#ffa8b4"/><stop offset="1" stop-color="#d4697c"/></radialGradient>' +
    /* metal */
    '<linearGradient id="pmetal" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#e8eefb"/><stop offset=".35" stop-color="#9fb0cf"/>' +
      '<stop offset=".55" stop-color="#5d6b8a"/><stop offset="1" stop-color="#8fa0c0"/></linearGradient>' +
    '<linearGradient id="pmetal2" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#b9c6e2"/><stop offset="1" stop-color="#48536e"/></linearGradient>' +
    /* topo */
    '<radialGradient id="ptopo" cx=".35" cy=".25" r=".9">' +
      '<stop offset="0" stop-color="#6c5a53"/><stop offset=".55" stop-color="#43372f"/><stop offset="1" stop-color="#241c17"/></radialGradient>' +
    /* pájaro */
    '<linearGradient id="pave" x1=".1" y1="0" x2=".9" y2="1">' +
      '<stop offset="0" stop-color="#3b4c7a"/><stop offset=".5" stop-color="#1e2742"/><stop offset="1" stop-color="#0d1222"/></linearGradient>' +
    /* madera del mazo */
    '<linearGradient id="pmadera" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#c79a63"/><stop offset=".5" stop-color="#9a703f"/><stop offset="1" stop-color="#6b4b27"/></linearGradient>' +
    '<linearGradient id="pguante" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#fdfefe"/><stop offset="1" stop-color="#c8d2e4"/></linearGradient>' +
    '<filter id="psombra" x="-40%" y="-40%" width="180%" height="180%">' +
      '<feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#04070f" flood-opacity=".55"/></filter>' +
    '</defs>';

  /* Cada dibujo mira a la derecha y tiene su «punto de contacto» donde la
     escena lo coloca. Van con filtro de sombra para que no parezcan pegatinas. */
  var DIBUJO = {
    /* LA ZARPA. Almohadillas, uñas fuera y pelo de verdad en el canto. */
    zarpa:
      '<g filter="url(#psombra)">' +
      '<path d="M18 86c-8-14-9-30-2-43C24 28 44 18 66 20c22 2 38 16 41 35 3 18-8 34-27 41-20 7-49 4-62-10z" fill="url(#pgato)"/>' +
      '<path d="M22 80c-6-12-6-26 0-37 8-14 25-22 43-21" fill="none" stroke="#8a90a3" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>' +
      '<ellipse cx="62" cy="76" rx="24" ry="17" fill="url(#pyema)"/>' +
      '<ellipse cx="33" cy="45" rx="10" ry="12" fill="url(#pyema)" transform="rotate(-22 33 45)"/>' +
      '<ellipse cx="56" cy="34" rx="10" ry="12" fill="url(#pyema)" transform="rotate(-6 56 34)"/>' +
      '<ellipse cx="79" cy="39" rx="10" ry="12" fill="url(#pyema)" transform="rotate(12 79 39)"/>' +
      '<ellipse cx="96" cy="56" rx="9" ry="11" fill="url(#pyema)" transform="rotate(28 96 56)"/>' +
      '<path d="M28 33c-4-6-4-12-1-16M52 20c-2-7-1-13 2-16M78 25c0-7 2-12 6-14M99 44c2-6 5-10 9-11" fill="none" stroke="#f4f7ff" stroke-width="4.6" stroke-linecap="round"/>' +
      '</g>',
    /* EL TOPO. Hocico rosa, ojillos cerrados y dos manazas de cavar. */
    topo:
      '<g filter="url(#psombra)">' +
      '<ellipse cx="60" cy="64" rx="42" ry="38" fill="url(#ptopo)"/>' +
      '<ellipse cx="60" cy="52" rx="30" ry="24" fill="#57483f" opacity=".5"/>' +
      '<ellipse cx="60" cy="72" rx="17" ry="13" fill="#e9a0aa"/>' +
      '<ellipse cx="60" cy="70" rx="11" ry="8" fill="#d4707f"/>' +
      '<circle cx="54" cy="68" r="2.3" fill="#3a2520"/><circle cx="66" cy="68" r="2.3" fill="#3a2520"/>' +
      '<path d="M42 50c4-3 9-3 12 0M66 50c3-3 8-3 12 0" fill="none" stroke="#1d1611" stroke-width="3" stroke-linecap="round"/>' +
      '<g fill="#e9a0aa">' +
      '<path d="M20 74c-7 2-11 8-9 14 2 5 9 7 15 4l10-6-3-13z"/>' +
      '<path d="M100 74c7 2 11 8 9 14-2 5-9 7-15 4l-10-6 3-13z"/></g>' +
      '<path d="M14 82l-6 4M16 88l-7 2M104 82l7 4M104 88l8 2" stroke="#f0dfe2" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
      '</g>',
    /* EL BRAZO. Tres tramos, pistón y pinza de dos dedos. */
    brazo:
      '<g filter="url(#psombra)">' +
      '<rect x="48" y="0" width="26" height="34" rx="5" fill="url(#pmetal2)"/>' +
      '<circle cx="61" cy="36" r="11" fill="url(#pmetal)"/><circle cx="61" cy="36" r="4" fill="#2b3348"/>' +
      '<rect x="50" y="42" width="22" height="34" rx="6" fill="url(#pmetal2)"/>' +
      '<rect x="55" y="46" width="4" height="26" rx="2" fill="#dbe5fb" opacity=".7"/>' +
      '<circle cx="61" cy="80" r="10" fill="url(#pmetal)"/><circle cx="61" cy="80" r="3.5" fill="#2b3348"/>' +
      '<path d="M46 88c-10 6-14 16-11 26l9-3c-2-7 1-13 8-17z" fill="url(#pmetal)"/>' +
      '<path d="M76 88c10 6 14 16 11 26l-9-3c2-7-1-13-8-17z" fill="url(#pmetal)"/>' +
      '<rect x="52" y="84" width="18" height="8" rx="3" fill="#39415a"/>' +
      '<circle cx="61" cy="30" r="2.6" fill="#43e0ff"/>' +
      '</g>',
    /* EL PÁJARO. Alas abiertas, pico abierto y un ojo con brillo. */
    ave:
      '<g filter="url(#psombra)">' +
      '<path d="M64 48c16-20 44-30 60-22-10 6-14 16-14 24 12-2 22 2 26 10-14 0-24 8-28 18-8 20-32 28-52 20-16-6-24-22-20-38 3-10 12-16 22-16z" fill="url(#pave)"/>' +
      '<path d="M60 46c-14-14-36-18-50-10 8 4 12 12 12 20-10 0-18 4-22 12 12-2 22 4 26 12" fill="url(#pave)" opacity=".85"/>' +
      '<path d="M96 58l26-6-26 14z" fill="#f5a524"/>' +
      '<path d="M96 60l24 2-24 6z" fill="#c9781a"/>' +
      '<circle cx="88" cy="54" r="6" fill="#f4f7ff"/><circle cx="89" cy="55" r="3.1" fill="#101627"/>' +
      '<circle cx="87.4" cy="53.4" r="1.1" fill="#fff"/>' +
      '<path d="M46 86l-10 16M58 92l-6 18" stroke="#1a2138" stroke-width="5" stroke-linecap="round" fill="none"/>' +
      '</g>',
    /* EL MAZO. Cabeza de acero, mango de madera y un guante sujetándolo. */
    mazo:
      '<g filter="url(#psombra)">' +
      '<rect x="6" y="14" width="58" height="46" rx="9" fill="url(#pmetal)"/>' +
      '<rect x="6" y="14" width="58" height="12" rx="6" fill="#f0f5ff" opacity=".45"/>' +
      '<rect x="12" y="22" width="9" height="30" rx="4" fill="#39415a" opacity=".5"/>' +
      '<rect x="60" y="28" width="58" height="17" rx="8" fill="url(#pmadera)"/>' +
      '<path d="M66 33h46M66 40h40" stroke="#5c3f22" stroke-width="1.6" stroke-linecap="round" opacity=".5"/>' +
      '<path d="M86 22c12-2 22 4 24 14 2 10-6 19-18 19-9 0-16-5-17-12l3-9z" fill="url(#pguante)"/>' +
      '<path d="M88 30c7-2 14 1 15 7M88 40c7 2 14 0 16-5" fill="none" stroke="#93a1bc" stroke-width="2.2" stroke-linecap="round"/>' +
      '</g>',
  };

  function figura(nombre, ancho) {
    var g = el('i', 'cfg-bicho2 es-' + nombre);
    g.innerHTML = '<svg viewBox="0 0 130 120" width="' + ancho + '" aria-hidden="true" focusable="false">' +
      DEFS + DIBUJO[nombre] + '</svg>';
    capa().appendChild(g);
    return g;
  }

  /* ══════════════════ MICROESCENAS ══════════════════
     Al elegir una opción NO sale un icono con patas a correr por la
     pantalla. Le pasa algo AL BLOQUE que acabas de pulsar: se parte, sale
     despedido, se cae, se deshoja o implosiona. La reacción nace del propio
     bloque y de lo que has elegido —el dinero sale disparado, los papeles se
     deshojan, el tiempo se cae, las conexiones se rompen, la gente se junta
     hacia dentro—, así que no es la misma animación con otro dibujo: es otra
     cosa cada vez.

     Cómo funciona: se clona el bloque en la capa fija, en su sitio exacto y
     a su tamaño, y la escena ocurre sobre el clon. Así el repintado del paso
     —que borra el botón a los pocos milisegundos— no la corta. Entre 0,6 y
     1,2 segundos, con transform y opacity, y nada que estorbe al ratón. */

  /* Qué le pasa a cada cosa. La familia manda sobre el icono: lo que se
     elige decide la reacción física que tiene sentido. */
  var REACCION = {
    dinero: 'expulsa', cobros: 'expulsa', cuotas: 'expulsa', carro: 'expulsa',
    pedidos: 'expulsa', compras: 'expulsa', finance: 'expulsa',
    papel: 'deshoja', docs: 'deshoja', albaranes: 'deshoja', partes: 'deshoja',
    impuestos: 'deshoja', seguros: 'deshoja', propuestas: 'deshoja',
    reloj: 'cae', calendario: 'cae', citas: 'cae', horas: 'cae', visitas: 'cae',
    reservas: 'cae', recordar: 'cae', planifica: 'cae',
    enchufe: 'parte', engranaje: 'parte', integra: 'parte', conectar: 'parte',
    auto: 'parte', repetido: 'parte', portales: 'parte', llave: 'parte',
    gente: 'implosiona', clientes: 'implosiona', altas: 'implosiona', chat: 'implosiona',
    agente: 'implosiona', atencion: 'implosiona', fuera: 'implosiona', whatsapp: 'implosiona',
  };
  /* Los nueve sectores del primer paso van repartidos a mano: en una
     rejilla de tres en tres, dos personajes iguales pegados se notan más
     que cualquier otra cosa, así que ninguna casilla repite con la de al
     lado ni con la de abajo. */
  var SECTOR = {
    inmobiliaria: 'parte',   restaurante: 'cae',      clinica: 'implosiona',
    asesoria: 'deshoja',     gimnasio: 'expulsa',     ecommerce: 'parte',
    agencia: 'cae',          industria: 'deshoja',    otro: 'implosiona',
  };
  var FAMILIAS = ['parte', 'expulsa', 'cae', 'deshoja', 'implosiona'];
  /* Lo que no esté en la tabla reparte por su nombre, no al azar: la misma
     opción hace siempre lo mismo, que es lo que la vuelve memorable. */
  function reaccionDe(id, paso) {
    if (SECTOR[id]) return SECTOR[id];
    if (REACCION[id]) return REACCION[id];
    var n = 0, t = String(id || paso);
    for (var k = 0; k < t.length; k++) n = (n * 31 + t.charCodeAt(k)) >>> 0;
    return FAMILIAS[n % FAMILIAS.length];
  }

  /* El clon: mismo sitio, mismo tamaño, misma pinta, pero suelto en la capa
     fija y sin poder recibir un clic. */
  function clona(tarjeta, r) {
    var c = tarjeta.cloneNode(true);
    c.className = tarjeta.className + ' cfg-esc';
    c.removeAttribute('id'); c.setAttribute('aria-hidden', 'true'); c.tabIndex = -1;
    c.style.cssText = 'left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width +
                      'px;height:' + r.height + 'px;';
    capa().appendChild(c);
    return c;
  }
  function quita() {
    var c = capa();
    while (c.firstChild) c.removeChild(c.firstChild);
    hayBicho = false;
  }
  function trozo(clase, r, estilo) {
    var t = el('i', clase);
    t.style.cssText = 'left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width +
                      'px;height:' + r.height + 'px;' + (estilo || '');
    capa().appendChild(t);
    return t;
  }

  var ESCENAS = {
    /* EL MAZO. Entra por arriba a la derecha, cae de golpe sobre el bloque,
       lo revienta, rebota y se retira. El bloque se parte donde golpea. */
    parte: function (tarjeta, r) {
      var m = figura('mazo', 150);
      var cx = r.left + r.width * .5, cy = r.top + r.height * .5;
      m.style.cssText = 'left:' + (cx - 30) + 'px;top:' + (cy - 150) + 'px;transform-origin:88% 66%;';
      m.animate([
        { transform: 'translate(70px,-90px) rotate(-64deg)', opacity: 0 },
        { transform: 'translate(30px,-40px) rotate(-46deg)', opacity: 1, offset: .22 },
        { transform: 'translate(0,34px) rotate(16deg)', offset: .42 },
        { transform: 'translate(-4px,24px) rotate(6deg)', offset: .54 },
        { transform: 'translate(60px,-80px) rotate(-56deg)', opacity: 0 },
      ], { duration: 1150, easing: 'cubic-bezier(.35,.02,.3,1)', fill: 'both' });

      var a = clona(tarjeta, r), b = clona(tarjeta, r);
      var q = 46 + Math.random() * 8;
      a.style.clipPath = 'polygon(0 0,' + q + '% 0,' + (q - 9) + '% 36%,' + (q + 7) + '% 64%,' + (q - 4) + '% 100%,0 100%)';
      b.style.clipPath = 'polygon(' + q + '% 0,100% 0,100% 100%,' + (q - 4) + '% 100%,' + (q + 7) + '% 64%,' + (q - 9) + '% 36%)';
      var luz = trozo('cfg-luz', r);
      luz.style.left = (r.left + r.width * q / 100 - 2) + 'px'; luz.style.width = '4px';
      luz.animate([{ opacity: 0 }, { opacity: 0, offset: .38 }, { opacity: 1, offset: .46 }, { opacity: 0 }],
        { duration: 1000, easing: 'ease-out' });
      var golpe = { delay: 430, easing: 'cubic-bezier(.15,.9,.3,1)', fill: 'forwards' };
      a.animate([{ transform: 'none' }, { transform: 'translate(-30px,12px) rotate(-7deg)', opacity: 0 }],
        Object.assign({ duration: 620 }, golpe));
      var f = b.animate([{ transform: 'none' }, { transform: 'translate(34px,16px) rotate(8deg)', opacity: 0 }],
        Object.assign({ duration: 620 }, golpe));
      for (var i = 0; i < 5; i++) (function (i) {
        var t = trozo('cfg-astilla', { left: cx - 8 + (i - 2) * 9, top: cy - 6, width: 9 + i * 3, height: 6 + i * 2 });
        t.animate([{ transform: 'none', opacity: 0 }, { transform: 'none', opacity: 1, offset: .4 },
                   { transform: 'translate(' + ((i - 2) * 34) + 'px,' + (58 + i * 14) + 'px) rotate(' + ((i - 2) * 90) + 'deg)', opacity: 0 }],
          { duration: 1000, easing: 'cubic-bezier(.3,.05,.6,1)', fill: 'forwards' });
      })(i);
      return f.finished;
    },

    /* LA ZARPA. Asoma por la izquierda, engancha el bloque y lo manda de un
       zarpazo fuera de la pantalla, girando. */
    expulsa: function (tarjeta, r) {
      var z = figura('zarpa', 130);
      z.style.cssText = 'left:' + (r.left - 150) + 'px;top:' + (r.top + r.height * .5 - 70) + 'px;transform-origin:20% 60%;';
      z.animate([
        { transform: 'translate(-80px,20px) rotate(-26deg)', opacity: 0 },
        { transform: 'translate(20px,0) rotate(-6deg)', opacity: 1, offset: .26 },
        { transform: 'translate(86px,-10px) rotate(16deg)', offset: .44 },
        { transform: 'translate(-90px,26px) rotate(-30deg)', opacity: 0 },
      ], { duration: 1080, easing: 'cubic-bezier(.3,.05,.3,1)', fill: 'both' });

      var c = clona(tarjeta, r);
      var f = c.animate([
        { transform: 'none' },
        { transform: 'none', offset: .3 },
        { transform: 'translateX(-9px) skewX(5deg) scaleX(.93)', offset: .37 },
        { transform: 'translate(180px,-14px) rotate(9deg)', offset: .62 },
        { transform: 'translate(' + (window.innerWidth - r.left + 120) + 'px,50px) rotate(28deg)', opacity: .08 },
      ], { duration: 1080, easing: 'cubic-bezier(.4,.02,.2,1)', fill: 'forwards' });
      window.setTimeout(function () {
        for (var i = 0; i < 5; i++) polvo(r.left + 16 + i * 18, r.top + r.height - 4, 'chispa');
      }, 330);
      return f.finished;
    },

    /* EL TOPO. Sale por debajo reventando el bloque, asoma el hocico, mira y
       se vuelve a meter con su polvareda. */
    cae: function (tarjeta, r) {
      var t = figura('topo', 120);
      var cx = r.left + r.width * .42;
      t.style.cssText = 'left:' + (cx - 60) + 'px;top:' + (r.top + r.height - 58) + 'px;';
      t.animate([
        { transform: 'translateY(58px) scale(.7)', opacity: 0 },
        { transform: 'translateY(-26px) scale(1.06)', opacity: 1, offset: .3 },
        { transform: 'translateY(-34px) rotate(-7deg)', offset: .5 },
        { transform: 'translateY(-30px) rotate(6deg)', offset: .66 },
        { transform: 'translateY(64px) scale(.72)', opacity: 0 },
      ], { duration: 1250, easing: 'cubic-bezier(.3,.8,.3,1)', fill: 'both' });

      var a = clona(tarjeta, r), b = clona(tarjeta, r);
      a.style.clipPath = 'polygon(0 0,44% 0,38% 40%,48% 70%,42% 100%,0 100%)';
      b.style.clipPath = 'polygon(44% 0,100% 0,100% 100%,42% 100%,48% 70%,38% 40%)';
      a.animate([{ transform: 'none' }, { transform: 'translate(-40px,10px) rotate(-11deg)', opacity: 0 }],
        { duration: 760, delay: 210, easing: 'cubic-bezier(.2,.9,.3,1)', fill: 'forwards' });
      var f = b.animate([{ transform: 'none' }, { transform: 'translate(44px,14px) rotate(12deg)', opacity: 0 }],
        { duration: 760, delay: 210, easing: 'cubic-bezier(.2,.9,.3,1)', fill: 'forwards' });
      window.setTimeout(function () {
        for (var i = 0; i < 7; i++) polvo(cx - 30 + i * 10, r.top + r.height - 6, 'polvo');
      }, 240);
      return f.finished;
    },

    /* EL PÁJARO. Baja en picado, agarra el bloque con el pico y se lo lleva
       hacia arriba a la derecha. */
    deshoja: function (tarjeta, r) {
      var p = figura('ave', 150);
      p.style.cssText = 'left:' + (r.left + r.width * .5 - 120) + 'px;top:' + (r.top - 70) + 'px;';
      p.animate([
        { transform: 'translate(-220px,-140px) scale(.7) rotate(-12deg)', opacity: 0 },
        { transform: 'translate(-40px,-12px) scale(1) rotate(6deg)', opacity: 1, offset: .3 },
        { transform: 'translate(10px,14px) scale(1.03) rotate(2deg)', offset: .44 },
        { transform: 'translate(300px,-260px) scale(.72) rotate(-18deg)', opacity: 0 },
      ], { duration: 1250, easing: 'cubic-bezier(.35,.05,.3,1)', fill: 'both' });

      var c = clona(tarjeta, r);
      c.style.transformOrigin = '50% 0%';
      var f = c.animate([
        { transform: 'none' },
        { transform: 'none', offset: .36 },
        { transform: 'translateY(-14px) rotate(-3deg)', offset: .48 },
        { transform: 'translate(300px,-280px) rotate(22deg) scale(.62)', opacity: 0 },
      ], { duration: 1250, easing: 'cubic-bezier(.4,.02,.25,1)', fill: 'forwards' });
      return f.finished;
    },

    /* EL BRAZO. Baja del techo, pinza el bloque, lo levanta y lo sube con él.
       Queda la onda del pistón al soltar el aire. */
    implosiona: function (tarjeta, r) {
      var b = figura('brazo', 110);
      var cx = r.left + r.width * .5;
      b.style.cssText = 'left:' + (cx - 46) + 'px;top:' + (r.top - 200) + 'px;';
      b.animate([
        { transform: 'translateY(-140px)', opacity: 0 },
        { transform: 'translateY(118px)', opacity: 1, offset: .3 },
        { transform: 'translateY(126px)', offset: .44 },
        { transform: 'translateY(-200px)', opacity: 0 },
      ], { duration: 1200, easing: 'cubic-bezier(.4,.05,.3,1)', fill: 'both' });

      var c = clona(tarjeta, r);
      c.style.transformOrigin = '50% 0%';
      var f = c.animate([
        { transform: 'none' },
        { transform: 'none', offset: .36 },
        { transform: 'scale(.97) rotate(-1.5deg)', offset: .46 },
        { transform: 'translateY(-260px) scale(.7) rotate(4deg)', opacity: 0 },
      ], { duration: 1200, easing: 'cubic-bezier(.45,.02,.25,1)', fill: 'forwards' });
      var onda = trozo('cfg-onda', { left: cx - 14, top: r.top + r.height * .5 - 14, width: 28, height: 28 });
      onda.animate([{ transform: 'scale(.3)', opacity: 0 }, { transform: 'scale(.6)', opacity: .8, offset: .42 },
                    { transform: 'scale(' + (r.width / 13).toFixed(1) + ')', opacity: 0 }],
        { duration: 1000, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' });
      return f.finished;
    },
  };

  function corre(id, paso) {
    if (QUIETO.matches || hayBicho) return;
    var tarjeta = ultimaTarjeta;
    if (!tarjeta || !tarjeta.getBoundingClientRect) return;
    var r = tarjeta.getBoundingClientRect();
    if (!r.width || !r.height) return;
    hayBicho = true;
    quita();
    capa().setAttribute('data-escena', reaccionDe(id, paso));
    var seguro = window.setTimeout(quita, 2900);
    var fin = (ESCENAS[reaccionDe(id, paso)] || ESCENAS.parte)(tarjeta, r);
    Promise.resolve(fin).then(function () {
      window.clearTimeout(seguro);
      window.setTimeout(quita, 120);
    }).catch(function () { window.clearTimeout(seguro); quita(); });
  }


  function late(nodo) {
    if (QUIETO.matches || !nodo) return;
    nodo.classList.remove('es-late');
    void nodo.offsetWidth;
    nodo.classList.add('es-late');
  }
  var tx = function (o) { return EN ? (o.en || o[1]) : (o.es || o[0]); };

  /* ------------------------------------------------------------- estado */
  var S = { sector: '', mejoras: [], gente: '', piezas: [], nivel: '' };
  var paso = 0;
  var TOTAL = 5;

  /* ---------------------------------------------------------- estructura */
  host.innerHTML = '';
  var cab = el('div', 'cfg-cab');
  cab.appendChild(el('span', 'eyebrow', L.kicker));
  var h2 = el('h2', 'h-sec', L.titulo); h2.id = 'cfg-t'; cab.appendChild(h2);
  cab.appendChild(el('p', 'cfg-sub', L.sub));
  host.appendChild(cab);

  var barra = el('div', 'cfg-barra');
  var barraIn = el('i'); barra.appendChild(barraIn);
  var cuenta = el('p', 'cfg-cuenta');
  cuenta.setAttribute('aria-live', 'polite');
  /* Un empujón por paso. No es adorno: quien va por el tercero de cinco se
     merece saber que va bien y cuánto queda. Se anuncia con aria-live para
     quien no lo está viendo. */
  var animo = el('p', 'cfg-animo');
  animo.setAttribute('aria-live', 'polite');
  host.appendChild(barra); host.appendChild(cuenta); host.appendChild(animo);

  function di(txt) {
    if (!txt) { animo.textContent = ''; animo.classList.remove('es-pone'); return; }
    animo.textContent = txt;
    animo.classList.remove('es-pone');
    void animo.offsetWidth;
    animo.classList.add('es-pone');
  }

  var caja = el('div', 'cfg-caja');
  host.appendChild(caja);

  var pie = el('div', 'cfg-pie');
  var bAtras = el('button', 'btn btn-ghost btn-sm cfg-atras', L.atras); bAtras.type = 'button';
  var bSeguir = el('button', 'btn btn-primary cfg-seguir', L.seguir); bSeguir.type = 'button';
  pie.appendChild(bAtras); pie.appendChild(bSeguir);
  host.appendChild(pie);

  var saltar = el('p', 'cfg-saltar');
  var aSalta = el('a', null, L.saltar); aSalta.href = '#contact-form';
  saltar.appendChild(aSalta);
  host.appendChild(saltar);

  /* ──────────────────── EL FORMULARIO ESPERA SU TURNO ────────────────────
     Antes debajo del configurador había otro formulario pidiendo lo mismo de
     la manera aburrida. Ahora solo hay uno: el configurador pregunta, y los
     datos de contacto aparecen cuando ya hay algo que enviar.

     Se esconde desde AQUÍ y no desde la hoja de estilos a propósito: si este
     guion no llega a ejecutarse —falla, no carga, el navegador es viejo— el
     formulario se queda visible y funcionando, que es lo único que no puede
     romperse en esta página. */
  var tarjeta = D.querySelector('.form-card');
  if (tarjeta) tarjeta.classList.add('es-espera');
  function abreFormulario() {
    if (!tarjeta) return;
    tarjeta.classList.remove('es-espera');
    tarjeta.classList.add('es-llega');
  }
  aSalta.addEventListener('click', abreFormulario);

  /* ------------------------------------------------------------ pintar */
  var ultimaTarjeta = null;

  function opcion(txt, sub, puesto, id) {
    var b = el('button', 'cfg-op' + (puesto ? ' is-on' : ''));
    b.type = 'button';
    b.setAttribute('aria-pressed', puesto ? 'true' : 'false');
    b.appendChild(el('b', null, txt));
    if (sub) b.appendChild(el('span', null, sub));
    /* El salto va en captura y antes que la lógica: si repintamos el paso,
       el botón ya no existe cuando llega el click normal. */
    b.addEventListener('click', function () {
      ultimaTarjeta = b;
      /* Se pasa el id de la opción, no el de su dibujo: la reacción la
         decide lo que has elegido, y el mapa de arriba va por ids. */
      if (b.getAttribute('aria-pressed') !== 'true') corre(id, paso);
      late(b);
    }, true);
    return b;
  }

  function pregunta(titulo, ayuda) {
    var fs = el('fieldset', 'cfg-paso');
    var lg = el('legend', 'cfg-preg', titulo);
    fs.appendChild(lg);
    if (ayuda) fs.appendChild(el('p', 'cfg-ayuda', ayuda));
    return fs;
  }

  function pinta() {
    caja.innerHTML = '';
    var fs, rej, i;
    if (paso === 0) {
      fs = pregunta(EN ? 'What kind of company do you have?' : '¿Qué tipo de empresa tienes?');
      rej = el('div', 'cfg-rej cfg-rej--sector');
      SECTORES.forEach(function (s) {
        var b = opcion(tx(s), null, S.sector === s.id, s.id);
        b.addEventListener('click', function () { S.sector = s.id; S.mejoras = []; pinta(); });
        rej.appendChild(b);
      });
      fs.appendChild(rej);
    } else if (paso === 1) {
      var lista = MEJORAS[S.sector] || MEJORAS.otro;
      fs = pregunta(EN ? 'What would you like to improve?' : '¿Qué quieres mejorar?',
        EN ? 'Pick as many as you like.' : 'Puedes elegir las que quieras.');
      rej = el('div', 'cfg-rej cfg-rej--chips');
      lista.forEach(function (m) {
        var puesto = S.mejoras.indexOf(m[0]) >= 0;
        var b = opcion(EN ? m[2] : m[1], null, puesto, m[0]);
        b.className = 'cfg-chip' + (puesto ? ' is-on' : '');
        b.addEventListener('click', function () {
          var k = S.mejoras.indexOf(m[0]);
          if (k >= 0) S.mejoras.splice(k, 1); else S.mejoras.push(m[0]);
          pinta();
        });
        rej.appendChild(b);
      });
      fs.appendChild(rej);
    } else if (paso === 2) {
      fs = pregunta(EN ? 'How many people will use it?' : '¿Cuánta gente lo va a usar?');
      rej = el('div', 'cfg-rej cfg-rej--gente');
      GENTE.forEach(function (g) {
        var b = opcion(tx(g), null, S.gente === g.id, g.id);
        b.addEventListener('click', function () { S.gente = g.id; pinta(); });
        rej.appendChild(b);
      });
      fs.appendChild(rej);
    } else if (paso === 3) {
      fs = pregunta(EN ? 'What should we build?' : '¿Qué montamos?',
        EN ? 'Pick as many as you like. You can change it later.' : 'Puedes elegir varias. Esto no te compromete a nada.');
      rej = el('div', 'cfg-rej');
      PIEZAS.forEach(function (p) {
        var puesto = S.piezas.indexOf(p.id) >= 0;
        var b = opcion(tx(p), EN ? p.d_en : p.d_es, puesto, p.id);
        b.addEventListener('click', function () {
          var k = S.piezas.indexOf(p.id);
          if (k >= 0) S.piezas.splice(k, 1); else S.piezas.push(p.id);
          pinta();
        });
        rej.appendChild(b);
      });
      fs.appendChild(rej);
    } else if (paso === 4) {
      fs = pregunta(EN ? 'How much does it need to fit your business?' : '¿Cuánto hay que adaptarlo a tu negocio?');
      rej = el('div', 'cfg-rej');
      NIVEL.forEach(function (n) {
        var b = opcion(tx(n), EN ? n.d_en : n.d_es, S.nivel === n.id, n.id);
        b.addEventListener('click', function () { S.nivel = n.id; pinta(); });
        rej.appendChild(b);
      });
      fs.appendChild(rej);
    } else {
      pintaResumen();
      return;
    }
    caja.appendChild(fs);
    if (resumenVivo()) caja.appendChild(resumenVivo());
    barraIn.style.width = Math.round(((paso) / TOTAL) * 100) + '%';
    cuenta.textContent = (paso + 1) + ' ' + L.de + ' ' + TOTAL + ' · ' + L.pasos[paso];
    di(L.animos[paso]);
    bAtras.hidden = paso === 0;
    bSeguir.disabled = !puedeSeguir();
    bSeguir.textContent = paso === TOTAL - 1 ? (EN ? 'See my configuration' : 'Ver mi configuración') : L.seguir;
    pie.hidden = false;
    saltar.hidden = false;
    var foco = caja.querySelector('legend');
    if (foco && paso > 0) { foco.setAttribute('tabindex', '-1'); foco.focus({ preventScroll: true }); }
  }

  function puedeSeguir() {
    if (paso === 0) return !!S.sector;
    if (paso === 1) return S.mejoras.length > 0;
    if (paso === 2) return !!S.gente;
    if (paso === 3) return S.piezas.length > 0;
    if (paso === 4) return !!S.nivel;
    return true;
  }

  /* El resumen se va montando a la vista: a partir del segundo paso se ve lo
     que ya has dicho, para que nadie tenga que acordarse de lo que eligió. */
  function resumenVivo() {
    if (paso === 0) return null;
    var d = el('div', 'cfg-vivo');
    var t = [];
    var s = SECTORES.filter(function (x) { return x.id === S.sector; })[0];
    if (s) t.push(tx(s));
    if (S.mejoras.length) t.push(S.mejoras.length + (EN ? ' goals' : (S.mejoras.length === 1 ? ' objetivo' : ' objetivos')));
    var g = GENTE.filter(function (x) { return x.id === S.gente; })[0];
    if (g) t.push(tx(g));
    if (S.piezas.length) t.push(S.piezas.length + (EN ? ' pieces' : (S.piezas.length === 1 ? ' pieza' : ' piezas')));
    t.forEach(function (x) { d.appendChild(el('span', 'cfg-vivo-p', x)); });
    return d;
  }

  /* ------------------------------------------------------ la estimación */
  /* Se suma lo que vale cada pieza en el catálogo —el mismo fichero del que
     vive /precios—, se ajusta por tamaño y por cuánto hay que adaptarlo, y se
     enseña como HORQUILLA. Un número exacto aquí sería mentira. */
  function piezaElegida(id) {
    if (!CAT) return null;
    var busca = function (k) { return CAT.productos.filter(function (p) { return p.id === k; })[0] || null; };
    if (id === 'finance') return busca(S.gente === '1-3' ? 'finance-1' : S.gente === '4-10' ? 'finance-2' : 'finance-3');
    if (id === 'auto') return busca(S.nivel === 'medida' ? 'auto-3' : S.nivel === 'ajustes' ? 'auto-2' : 'auto-1');
    if (id === 'agente') return busca(S.nivel === 'estandar' ? 'agente-1' : 'agente-2');
    if (id === 'integra') return busca(S.nivel === 'estandar' ? 'integra-1' : 'integra-2');
    if (id === 'os') return busca('os');
    if (id === 'medida') return busca('medida-1');
    return null;
  }

  /* Los miles se separan a mano y no con toLocaleString: el resultado de
     Intl depende de los datos que traiga el navegador —medido: en un
     Chromium sin ICU completo, 2130 se queda en «2130»— y un precio mal
     escrito en la pantalla del precio es lo último que uno quiere. */
  function miles(n, sep) {
    var s = String(Math.round(n)), out = '', c = 0;
    for (var i = s.length - 1; i >= 0; i--) {
      out = s[i] + out;
      if (++c % 3 === 0 && i > 0) out = sep + out;
    }
    return out;
  }
  function euros(n) {
    var s = Math.round(n / 10) * 10;
    return EN ? '€' + miles(s, ',') : miles(s, '.') + ' €';
  }

  function estimar() {
    if (!CAT) return null;
    var setup = 0, mes = 0, elegidas = [];
    S.piezas.forEach(function (id) {
      var p = piezaElegida(id);
      if (!p) return;
      elegidas.push(p);
      setup += p.setup; mes += p.mes;
    });
    if (!elegidas.length) return null;
    var k = (NIVEL.filter(function (n) { return n.id === S.nivel; })[0] || { k: 1 }).k;
    /* Más gente no multiplica el precio del software, pero sí el trabajo de
       ponerlo en marcha: más casos, más formación, más datos que traer. */
    var kg = S.gente === '11-25' ? 1.15 : S.gente === '25+' ? 1.3 : 1;
    setup = setup * k * kg;
    return { elegidas: elegidas, bajo: setup * 0.9, alto: setup * 1.25, mes: mes };
  }

  function pintaResumen() {
    caja.innerHTML = '';
    barraIn.style.width = '100%';
    cuenta.textContent = TOTAL + ' ' + L.de + ' ' + TOTAL + ' · ' + L.resumen;
    di(L.animoFin);
    var e = estimar();
    var box = el('div', 'cfg-res');
    box.appendChild(el('span', 'eyebrow', L.resumen));

    var lista = el('ul', 'cfg-res-l');
    var s = SECTORES.filter(function (x) { return x.id === S.sector; })[0];
    var g = GENTE.filter(function (x) { return x.id === S.gente; })[0];
    var n = NIVEL.filter(function (x) { return x.id === S.nivel; })[0];
    if (e) e.elegidas.forEach(function (p) {
      var li = el('li');
      li.appendChild(el('b', null, EN ? p.en.nombre : p.es.nombre));
      li.appendChild(el('span', null, (EN ? p.en.precio : p.es.precio) + ((EN ? p.en.precio_mes : p.es.precio_mes) ? ' + ' + (EN ? p.en.precio_mes : p.es.precio_mes) + '/' + (EN ? 'mo' : 'mes') : '')));
      lista.appendChild(li);
    });
    box.appendChild(lista);

    if (e) {
      var est = el('div', 'cfg-est');
      est.appendChild(el('span', 'cfg-est-t', L.estimacion));
      var cifra = el('p', 'cfg-est-n');
      cifra.appendChild(el('b', null, L.entre + ' ' + euros(e.bajo) + ' – ' + euros(e.alto)));
      cifra.appendChild(el('i', null, L.setup));
      est.appendChild(cifra);
      if (e.mes > 0) {
        var cif2 = el('p', 'cfg-est-n cfg-est-n--mes');
        cif2.appendChild(el('b', null, EN ? 'from €' + miles(e.mes, ',') : 'desde ' + miles(e.mes, '.') + ' €'));
        cif2.appendChild(el('i', null, L.mes));
        est.appendChild(cif2);
      }
      est.appendChild(el('p', 'cfg-est-aviso', L.aviso));
      box.appendChild(est);
    }

    var ctx = el('p', 'cfg-res-ctx');
    ctx.textContent = [s ? tx(s) : '', g ? tx(g) : '', n ? tx(n) : ''].filter(Boolean).join(' · ');
    box.appendChild(ctx);

    var b = el('button', 'btn btn-primary btn-block cfg-enviar', L.enviar);
    b.type = 'button';
    b.addEventListener('click', function () { volcar(e); });
    box.appendChild(b);
    box.appendChild(el('p', 'cfg-res-sub', L.enviarSub));

    var reinicia = el('button', 'cfg-reinicia', L.empezar);
    reinicia.type = 'button';
    reinicia.addEventListener('click', function () {
      S = { sector: '', mejoras: [], gente: '', piezas: [], nivel: '' }; paso = 0; pinta();
    });
    box.appendChild(reinicia);

    caja.appendChild(box);
    pie.hidden = true;
    saltar.hidden = true;
    box.setAttribute('tabindex', '-1');
    box.focus({ preventScroll: true });
  }

  /* --------------------------------------------- volcar en el formulario */
  /* El formulario de contacto no se toca: se rellena. Su envío, su
     consentimiento y su verificación siguen siendo los de siempre. */
  function volcar(e) {
    var txtArea = D.getElementById('mensaje');
    var s = SECTORES.filter(function (x) { return x.id === S.sector; })[0];
    var g = GENTE.filter(function (x) { return x.id === S.gente; })[0];
    var n = NIVEL.filter(function (x) { return x.id === S.nivel; })[0];
    var lista = MEJORAS[S.sector] || MEJORAS.otro;
    var mejoras = S.mejoras.map(function (id) {
      var m = lista.filter(function (x) { return x[0] === id; })[0];
      return m ? (EN ? m[2] : m[1]) : id;
    });
    var lineas = [];
    lineas.push((EN ? 'Configuration from the configurator' : 'Configuración hecha en el configurador') + ':');
    lineas.push('· ' + (EN ? 'Sector' : 'Sector') + ': ' + (s ? tx(s) : '—'));
    lineas.push('· ' + (EN ? 'To improve' : 'Quiere mejorar') + ': ' + (mejoras.join(', ') || '—'));
    lineas.push('· ' + (EN ? 'People' : 'Personas') + ': ' + (g ? tx(g) : '—'));
    if (e) lineas.push('· ' + (EN ? 'Pieces' : 'Piezas') + ': ' + e.elegidas.map(function (p) { return EN ? p.en.nombre : p.es.nombre; }).join(', '));
    lineas.push('· ' + (EN ? 'Tailoring' : 'Adaptación') + ': ' + (n ? tx(n) : '—'));
    if (e) lineas.push('· ' + L.estimacion + ': ' + L.entre + ' ' + euros(e.bajo) + ' – ' + euros(e.alto) + ' ' + L.setup + (e.mes ? ' · ' + (EN ? 'from €' : 'desde ') + e.mes + (EN ? '' : ' €') + ' ' + L.mes : ''));
    if (txtArea) {
      txtArea.value = lineas.join('\n');
      try { txtArea.dispatchEvent(new Event('input', { bubbles: true })); } catch (err) {}
    }
    var form = D.getElementById('contact-form');
    if (form && !form.querySelector('input[name="configuracion"]')) {
      var oculto = D.createElement('input');
      oculto.type = 'hidden'; oculto.name = 'configuracion';
      form.appendChild(oculto);
    }
    var oc = form && form.querySelector('input[name="configuracion"]');
    if (oc) oc.value = JSON.stringify(S);

    var aviso = D.getElementById('cfg-listo');
    if (!aviso && form) {
      aviso = el('p', 'cfg-listo', L.listo);
      aviso.id = 'cfg-listo';
      aviso.setAttribute('role', 'status');
      form.insertBefore(aviso, form.firstChild);
    }
    abreFormulario();
    /* Al enviar la configuración sale la gráfica del botón de enviar, que es
       el último que se ha pulsado. «b» aquí era el botón de otra función:
       ReferenceError, y con él se caía el volcado entero. Lo cazó qa:precios. */
    ultimaTarjeta = D.querySelector('.cfg-enviar') || ultimaTarjeta;
    corre('grafica', 4);

    var destino = D.getElementById('contact-form');
    if (destino) {
      destino.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      var primero = D.getElementById('nombre');
      if (primero) window.setTimeout(function () { try { primero.focus({ preventScroll: true }); } catch (err) {} }, 420);
    }
  }

  bAtras.addEventListener('click', function () { if (paso > 0) { paso--; pinta(); } });
  bSeguir.addEventListener('click', function () { if (puedeSeguir()) { paso++; pinta(); } });

  /* Si se llega desde /precios con una pieza ya elegida, se entra con ella
     puesta: no se hace repetir lo que ya se dijo pulsando un botón. */
  try {
    var q = new URLSearchParams(location.search).get('quiero');
    if (q) {
      var mapa = { 'finance-1': 'finance', 'finance-2': 'finance', 'finance-3': 'finance', 'finance-persona': 'finance',
        'auto-1': 'auto', 'auto-2': 'auto', 'auto-3': 'auto', 'auto-mant': 'auto',
        'agente-1': 'agente', 'agente-2': 'agente', 'integra-1': 'integra', 'integra-2': 'integra',
        'os': 'os', 'medida-1': 'medida', 'diagnostico': '',
        'pack-empezar': 'finance', 'pack-operar': 'finance', 'pack-sistema': 'os' };
      if (mapa[q]) S.piezas = [mapa[q]];
      if (q.indexOf('pack-') === 0) S.piezas = q === 'pack-sistema' ? ['os', 'finance', 'auto', 'agente', 'integra'] : ['finance', 'auto'];
    }
  } catch (err) {}

  pinta();
})();
