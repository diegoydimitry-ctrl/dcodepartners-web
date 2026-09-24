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
    pasos: ['Your company', 'What you want to improve', 'How many people', 'What to build', 'How much tailoring']
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
    pasos: ['Tu empresa', 'Qué quieres mejorar', 'Cuánta gente', 'Qué montamos', 'Cuánto hay que adaptarlo']
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
  host.appendChild(barra); host.appendChild(cuenta);

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

  /* ------------------------------------------------------------ pintar */
  function opcion(txt, sub, puesto) {
    var b = el('button', 'cfg-op' + (puesto ? ' is-on' : ''));
    b.type = 'button';
    b.setAttribute('aria-pressed', puesto ? 'true' : 'false');
    b.appendChild(el('b', null, txt));
    if (sub) b.appendChild(el('span', null, sub));
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
        var b = opcion(tx(s), null, S.sector === s.id);
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
        var b = opcion(EN ? m[2] : m[1], null, puesto);
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
        var b = opcion(tx(g), null, S.gente === g.id);
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
        var b = opcion(tx(p), EN ? p.d_en : p.d_es, puesto);
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
        var b = opcion(tx(n), EN ? n.d_en : n.d_es, S.nivel === n.id);
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
