/* ============================================================================
   SISTEMA DE EJEMPLO · COMERCIAL
   ----------------------------------------------------------------------------
   Arvena Climatización es una empresa INVENTADA: instala y mantiene
   climatización en Madrid. Nada de lo que sale aquí es de un cliente real.

   La historia, en diez pasos:
     1  Los contactos llegan por cuatro canales a una sola bandeja.
     2  Entra un formulario nuevo y el sistema lo coge al momento.
     3  La IA lo lee y saca qué pide, dónde, para cuándo y cuánto vale.
     4  Comprueba si ya lo conocemos: se une a su ficha, no se duplica.
     5  Lo asigna con las reglas de la empresa.
     6  Prepara la respuesta con huecos reales; la envía una persona.
     7  La clienta confirma: visita en la agenda, oportunidad en el tablero.
     8  Un presupuesto lleva días parado: el seguimiento queda programado.
     9  Una venta se cierra y pasa sola a Operaciones y a Finance.
    10  El panel: nadie tuvo que acordarse de nada.
   ========================================================================= */
(function () {
  'use strict';
  var SD = window.SD, I = SD.I, esc = SD.esc;

  var EQUIPO = {
    SP: { n: 'Sergio P.', c: '#0a6e7a' },
    LM: { n: 'Laura M.', c: '#2f5fe0' },
    AT: { n: 'Andrés T.', c: '#8f5400' }
  };
  var CANAL_I = { web: 'web', correo: 'correo', anuncio: 'anuncio', tel: 'tel', wa: 'wa' };

  var T = {
    es: {
      app: 'Comercial', empresa: 'Arvena Climatización', yo: { n: 'Laura M.', ini: 'LM' },
      navK: 'Ventas', pieT: 'Sistema de ejemplo', pieD: 'Empresa ficticia de climatización. Así funcionaría en la tuya.',
      pant: { entradas: 'Entradas', oportunidades: 'Oportunidades', agenda: 'Agenda', panel: 'Panel' },
      tipos: { ia: 'IA', auto: 'Automático', ok: 'Hecho', aviso: 'Aviso', persona: 'Persona', entrada: 'Entrada' },
      canal: { web: 'Formulario web', correo: 'Correo', anuncio: 'Anuncio', tel: 'Llamada', wa: 'WhatsApp' },
      e: {
        k: 'Bandeja única', t: 'Entradas', d: 'Web, correo, anuncios y teléfono llegan aquí, ya leídos y clasificados.',
        simular: 'Simular un contacto nuevo', sel: 'Elige una entrada para ver qué ha hecho el sistema con ella.',
        leyendo: 'Leyendo…', clasif: 'Clasificado', nuevo: 'Nuevo', hace: 'hace',
        msgK: 'Lo que ha escrito', iaK: 'Lo que ha entendido la IA', listo: 'Listo',
        campos: { tipo: 'Qué pide', tam: 'Tamaño', zona: 'Zona', plazo: 'Para cuándo', valor: 'Valor estimado', prio: 'Prioridad' },
        dupK: 'Ya lo conocemos', asigK: 'Asignado',
        borrK: 'Respuesta preparada', borrD: 'Con huecos reales de la agenda. La revisa y la envía una persona.',
        enviar: 'Enviar', editar: 'Editar', enviado: 'Enviado', tuyo: 'Arvena',
        derivar: 'No es una venta', aOps: 'Pasado a Atención al cliente'
      },
      o: { k: 'Tablero', t: 'Oportunidades', d: 'Cada oportunidad con su dueño, su valor y su siguiente paso.',
        etapas: { nuevo: 'Nuevo', visita: 'Visita', presupuesto: 'Presupuesto', negociacion: 'Negociación', ganado: 'Ganado' },
        mover: 'Pasar a la siguiente etapa', verOps: 'Ver en Operaciones', verFin: 'Ver en Finance', cerrar: 'Cerrar',
        sig: 'Siguiente paso', total: 'En cartera', sinResp: 'Sin respuesta · {d} días', segProg: 'Seguimiento programado' },
      a: { k: 'Semana', t: 'Agenda', d: 'Visitas y seguimientos. Los automáticos los prepara el sistema; los hace una persona.',
        auto: 'Automático', visita: 'Visita', seguimiento: 'Seguimiento', llamada: 'Llamada' },
      p: { k: 'Este mes', t: 'Panel comercial', d: 'Salido del propio sistema, no de una hoja que alguien rellena.',
        k1: 'Primera respuesta', k1d: 'antes del sistema: <b>1,5 días</b>', k2: 'Contactos sin dueño', k2d: 'se asignan al entrar',
        k3: 'Seguimientos al día', k3d: '14 programados solos esta semana', k4: 'En cartera', k4d: 'suma de las oportunidades abiertas',
        g: 'Contactos respondidos en menos de una hora', gl: 'sem', marca: 'Sistema en marcha', ult: 'Últimas acciones automáticas' },
      pasos: [
        'Así llegan los contactos a <b>Arvena Climatización</b>, una empresa inventada: por la web, el correo, los anuncios y el teléfono. Todos a <b>la misma bandeja</b>.',
        'Entra un formulario nuevo. <b>Nadie tiene que estar mirando</b>: el sistema lo recoge en el momento.',
        'La IA lo lee y saca lo que importa: <b>qué pide, dónde, para cuándo y cuánto puede valer</b>.',
        'Comprueba si ya la conocemos. <b>Grupo Delvia ya pidió algo en 2025</b>: se une a su ficha, no se duplica.',
        'La asigna con las reglas de la empresa: <b>zona sur e instalación grande, para Sergio</b>.',
        'Prepara la respuesta con huecos reales de la agenda de Sergio. <b>La envía una persona</b>, con un clic.',
        'La clienta contesta que el jueves le va bien. <b>La visita entra en la agenda</b> y la oportunidad, en el tablero.',
        'Un presupuesto lleva ocho días sin respuesta. <b>El sistema lo ve</b> y deja el seguimiento preparado para mañana.',
        'La Clínica Veterinaria Olmo acepta. <b>La venta pasa sola a Operaciones y a Finance</b>: nadie vuelve a teclear nada.',
        'Resultado: <b>nadie tuvo que acordarse de nada</b>, y todo queda medido. Toca lo que quieras: la demo es tuya.'
      ],
      act: {
        recibido: 'Formulario recibido de <b>{q}</b>', lee: 'Lectura de «{a}»: <b>{t}</b> · prioridad {p}',
        dup: 'Unido a la ficha de <b>{e}</b> (1 presupuesto anterior)', asig: 'Asignado a <b>{n}</b> · {r}',
        borr: 'Respuesta preparada con 2 huecos de la agenda de {n}', env: 'Respuesta enviada a <b>{q}</b>', envS: 'la ha enviado una persona',
        conf: 'Visita confirmada: <b>jueves 10:00</b> con {n}', opp: 'Oportunidad creada en <b>Visita</b>', tareas: '2 tareas creadas: mediciones y presupuesto',
        parado: 'Presupuesto de <b>Oficinas Tavira Legal</b> sin respuesta 8 días', seg: 'Seguimiento preparado para mañana a las 9:00',
        acepta: '<b>Clínica Veterinaria Olmo</b> acepta el presupuesto', ot: 'Orden de trabajo <b>OT-2419</b> creada en Operaciones',
        fin: 'Factura de anticipo (30 %) preparada en <b>Finance</b>', bienv: 'Correo de bienvenida enviado al cliente',
        deriva: 'No es una venta: avería de un cliente. <b>Pasada a Atención al cliente</b>', mover: '<b>{e}</b> pasa a {s}'
      },
      reglaAsig: 'Zona sur e instalación de más de 10.000 € → <b>Sergio P.</b>',
      reglaDup: 'Mismo correo y misma empresa que un contacto de 2025',
      borrador: 'Hola, Paula:<br><br>Gracias por escribirnos. Para una nave de 800 m² lo mejor es verla antes de proponeros nada. Sergio, que lleva la zona sur, puede pasarse el <b>jueves a las 10:00</b> o el <b>viernes a las 12:30</b>. ¿Cuál os va mejor?<br><br>Un saludo,<br>Arvena Climatización',
      respuesta: 'El jueves a las 10 perfecto. ¡Gracias!',
      delvia: { q: 'Paula Serrano', e: 'Grupo Delvia', a: 'Climatizar nave en Getafe',
        msg: 'Hola, necesitamos climatizar <m data-m="1">una nave de unos 800 m²</m> en <m data-m="2">Getafe</m> <m data-m="3">antes de junio</m>. Ahora mismo <m data-m="4">no tenemos nada instalado</m>. ¿Podéis venir a verla <m data-m="5">esta semana</m>? Gracias. Paula Serrano, Grupo Delvia.',
        campos: { tipo: 'Instalación nueva', tam: 'Nave · 800 m²', zona: 'Getafe · Sur', plazo: 'Antes de junio', valor: '18.000 – 26.000 €', prio: 'Alta' },
        dup: 'Pidió un mantenimiento en 2025 · presupuesto P-0931, no cerrado' },
      pool: [
        { canal: 'correo', q: 'Jorge Almansa', e: 'Gimnasio Vértice', a: 'La sala de spinning no da abasto', msg: 'Buenas, el aire de la sala de spinning no da abasto en verano. Son unos 150 m². ¿Qué opciones hay?', campos: { tipo: 'Ampliación', tam: 'Sala · 150 m²', zona: 'Alcobendas · Norte', plazo: 'Antes del verano', valor: '4.000 – 7.000 €', prio: 'Media' }, quien: 'LM', regla: 'Zona norte → Laura M.' },
        { canal: 'anuncio', q: 'Rosa Quintero', e: 'Particular', a: 'Aire en dos habitaciones', msg: 'Quiero precio para poner aire acondicionado en dos habitaciones de un piso.', campos: { tipo: 'Instalación nueva', tam: 'Vivienda · 2 estancias', zona: 'Madrid · Centro', plazo: 'Sin fecha', valor: '1.800 – 2.600 €', prio: 'Media' }, quien: 'LM', regla: 'Vivienda → Laura M.' },
        { canal: 'tel', q: 'Hotel Ribera Alta', e: 'Hotel Ribera Alta', a: 'La máquina de recepción pierde agua', msg: 'Llamada: la máquina de la recepción pierde agua desde esta mañana. Tienen contrato de mantenimiento.', campos: { tipo: 'Avería', tam: 'Cliente con contrato', zona: 'Madrid · Centro', plazo: 'Hoy', valor: '—', prio: 'Alta' }, deriva: true }
      ],
      hace: ['hace 3 min', 'hace 18 min', 'hace 1 h', 'hace 2 h', 'ayer']
    },
    en: {
      app: 'Sales', empresa: 'Arvena Climatización', yo: { n: 'Laura M.', ini: 'LM' },
      navK: 'Sales', pieT: 'Example system', pieD: 'A fictional air-conditioning company. This is how it would work in yours.',
      pant: { entradas: 'Inbox', oportunidades: 'Pipeline', agenda: 'Schedule', panel: 'Dashboard' },
      tipos: { ia: 'AI', auto: 'Automatic', ok: 'Done', aviso: 'Alert', persona: 'Person', entrada: 'Incoming' },
      canal: { web: 'Web form', correo: 'Email', anuncio: 'Ad', tel: 'Call', wa: 'WhatsApp' },
      e: {
        k: 'One inbox', t: 'Inbox', d: 'Web, email, ads and phone all land here, already read and sorted.',
        simular: 'Simulate a new contact', sel: 'Pick an item to see what the system did with it.',
        leyendo: 'Reading…', clasif: 'Sorted', nuevo: 'New', hace: 'ago',
        msgK: 'What they wrote', iaK: 'What the AI understood', listo: 'Done',
        campos: { tipo: 'Request', tam: 'Size', zona: 'Area', plazo: 'Deadline', valor: 'Estimated value', prio: 'Priority' },
        dupK: 'We already know them', asigK: 'Assigned',
        borrK: 'Reply drafted', borrD: 'With real slots from the calendar. A person checks it and sends it.',
        enviar: 'Send', editar: 'Edit', enviado: 'Sent', tuyo: 'Arvena',
        derivar: 'Not a sale', aOps: 'Passed to Customer service'
      },
      o: { k: 'Board', t: 'Pipeline', d: 'Every opportunity with an owner, a value and a next step.',
        etapas: { nuevo: 'New', visita: 'Site visit', presupuesto: 'Quote', negociacion: 'Negotiation', ganado: 'Won' },
        mover: 'Move to the next stage', verOps: 'See it in Operations', verFin: 'See it in Finance', cerrar: 'Close',
        sig: 'Next step', total: 'In the pipeline', sinResp: 'No reply · {d} days', segProg: 'Follow-up scheduled' },
      a: { k: 'This week', t: 'Schedule', d: 'Visits and follow-ups. The system prepares the automatic ones; a person does them.',
        auto: 'Automatic', visita: 'Visit', seguimiento: 'Follow-up', llamada: 'Call' },
      p: { k: 'This month', t: 'Sales dashboard', d: 'Straight from the system itself, not from a spreadsheet someone fills in.',
        k1: 'First reply', k1d: 'before the system: <b>1.5 days</b>', k2: 'Contacts with no owner', k2d: 'assigned as they come in',
        k3: 'Follow-ups up to date', k3d: '14 scheduled on their own this week', k4: 'In the pipeline', k4d: 'total of open opportunities',
        g: 'Contacts answered within an hour', gl: 'wk', marca: 'System live', ult: 'Latest automatic actions' },
      pasos: [
        'This is how contacts reach <b>Arvena Climatización</b>, a made-up company: web, email, ads and phone. All into <b>one inbox</b>.',
        'A new web form comes in. <b>Nobody has to be watching</b>: the system picks it up straight away.',
        'The AI reads it and pulls out what matters: <b>what they want, where, by when and what it could be worth</b>.',
        'It checks whether we already know them. <b>Grupo Delvia asked for something in 2025</b>: it’s added to their record, not duplicated.',
        'It assigns it using the company’s rules: <b>south area and a large install, so it goes to Sergio</b>.',
        'It drafts the reply with real slots from Sergio’s calendar. <b>A person sends it</b>, with one click.',
        'The customer replies that Thursday works. <b>The visit goes into the schedule</b> and the opportunity onto the board.',
        'A quote has had no reply for eight days. <b>The system spots it</b> and prepares the follow-up for tomorrow.',
        'Clínica Veterinaria Olmo says yes. <b>The sale moves on to Operations and Finance by itself</b>: nobody types anything twice.',
        'The result: <b>nobody had to remember anything</b>, and it’s all measured. Try anything you like: the demo is yours.'
      ],
      act: {
        recibido: 'Web form received from <b>{q}</b>', lee: 'Read «{a}»: <b>{t}</b> · {p} priority',
        dup: 'Added to <b>{e}</b>’s record (1 earlier quote)', asig: 'Assigned to <b>{n}</b> · {r}',
        borr: 'Reply drafted with 2 slots from {n}’s calendar', env: 'Reply sent to <b>{q}</b>', envS: 'sent by a person',
        conf: 'Visit confirmed: <b>Thursday 10:00</b> with {n}', opp: 'Opportunity created in <b>Site visit</b>', tareas: '2 tasks created: measurements and quote',
        parado: '<b>Oficinas Tavira Legal</b> quote: no reply for 8 days', seg: 'Follow-up ready for tomorrow at 9:00',
        acepta: '<b>Clínica Veterinaria Olmo</b> accepts the quote', ot: 'Work order <b>OT-2419</b> created in Operations',
        fin: 'Deposit invoice (30%) ready in <b>Finance</b>', bienv: 'Welcome email sent to the customer',
        deriva: 'Not a sale: a customer’s breakdown. <b>Passed to Customer service</b>', mover: '<b>{e}</b> moves to {s}'
      },
      reglaAsig: 'South area and an install over €10,000 → <b>Sergio P.</b>',
      reglaDup: 'Same email and company as a 2025 contact',
      borrador: 'Hi Paula,<br><br>Thanks for getting in touch. For an 800 m² warehouse it’s best to see it before we suggest anything. Sergio, who covers the south area, can come by on <b>Thursday at 10:00</b> or <b>Friday at 12:30</b>. Which suits you better?<br><br>Best regards,<br>Arvena Climatización',
      respuesta: 'Thursday at 10 is perfect. Thanks!',
      delvia: { q: 'Paula Serrano', e: 'Grupo Delvia', a: 'Air-conditioning for a warehouse in Getafe',
        msg: 'Hello, we need to air-condition <m data-m="1">a warehouse of about 800 m²</m> in <m data-m="2">Getafe</m> <m data-m="3">before June</m>. Right now <m data-m="4">we have nothing installed</m>. Could you come and see it <m data-m="5">this week</m>? Thanks. Paula Serrano, Grupo Delvia.',
        campos: { tipo: 'New install', tam: 'Warehouse · 800 m²', zona: 'Getafe · South', plazo: 'Before June', valor: '€18,000 – €26,000', prio: 'High' },
        dup: 'Asked for maintenance in 2025 · quote P-0931, not closed' },
      pool: [
        { canal: 'correo', q: 'Jorge Almansa', e: 'Gimnasio Vértice', a: 'The spin studio can’t keep up', msg: 'Hi, the air in the spin studio can’t keep up in summer. It’s about 150 m². What are the options?', campos: { tipo: 'Upgrade', tam: 'Studio · 150 m²', zona: 'Alcobendas · North', plazo: 'Before summer', valor: '€4,000 – €7,000', prio: 'Medium' }, quien: 'LM', regla: 'North area → Laura M.' },
        { canal: 'anuncio', q: 'Rosa Quintero', e: 'Private customer', a: 'AC in two bedrooms', msg: 'I’d like a price for air-conditioning in two bedrooms of a flat.', campos: { tipo: 'New install', tam: 'Home · 2 rooms', zona: 'Madrid · Centre', plazo: 'No date', valor: '€1,800 – €2,600', prio: 'Medium' }, quien: 'LM', regla: 'Home → Laura M.' },
        { canal: 'tel', q: 'Hotel Ribera Alta', e: 'Hotel Ribera Alta', a: 'The reception unit is leaking', msg: 'Call: the reception unit has been leaking water since this morning. They have a maintenance contract.', campos: { tipo: 'Breakdown', tam: 'Contract customer', zona: 'Madrid · Centre', plazo: 'Today', valor: '—', prio: 'High' }, deriva: true }
      ],
      hace: ['3 min ago', '18 min ago', '1 h ago', '2 h ago', 'yesterday']
    }
  };

  /* ------------------------------------------------------------ ESTADO */
  function estado(app) {
    var t = T[app.lang], en = app.en;
    return {
      ui: { p: 'entradas', sel: 'e1', n: 0, c: { entradas: 0 }, abierta: null, pool: 0 },
      reloj: 10 * 60 + 38,
      act: [
        { t: 'ok', x: en ? 'Visit with <b>Academia Linde</b> confirmed for Monday' : 'Visita con <b>Academia Linde</b> confirmada para el lunes', s: '', h: '09:12', k: 'a-2' },
        { t: 'auto', x: en ? 'Follow-up sent to <b>Hostal Rúa Verde</b>' : 'Seguimiento enviado a <b>Hostal Rúa Verde</b>', s: en ? 'scheduled 3 days ago' : 'programado hace 3 días', h: '09:00', k: 'a-1' }
      ],
      entradas: [
        { id: 'e1', canal: 'web', q: 'Oficinas Tavira Legal', e: 'Oficinas Tavira Legal', a: en ? 'Quote for two offices' : 'Presupuesto para dos despachos', hace: t.hace[2], tipo: en ? 'Small install' : 'Instalación pequeña', prio: en ? 'Medium' : 'Media', quien: 'LM', msg: en ? 'We’d like a quote to air-condition two offices of about 20 m² each.' : 'Queremos presupuesto para climatizar dos despachos de unos 20 m² cada uno.', campos: en ? { tipo: 'Small install', tam: 'Office · 2 rooms', zona: 'Madrid · Centre', plazo: 'No date', valor: '€3,800 – €5,200', prio: 'Medium' } : { tipo: 'Instalación pequeña', tam: 'Oficina · 2 despachos', zona: 'Madrid · Centro', plazo: 'Sin fecha', valor: '3.800 – 5.200 €', prio: 'Media' }, regla: en ? 'Centre area → Laura M.' : 'Zona centro → Laura M.' },
        { id: 'e2', canal: 'correo', q: 'Academia Linde', e: 'Academia Linde', a: en ? 'Annual service of the units' : 'Revisión anual de los equipos', hace: t.hace[3], tipo: en ? 'Maintenance' : 'Mantenimiento', prio: en ? 'Low' : 'Baja', quien: 'AT', msg: en ? 'Hi, it’s time for the annual service of our three units. When could you come?' : 'Hola, toca la revisión anual de nuestros tres equipos. ¿Cuándo podríais venir?', campos: en ? { tipo: 'Maintenance', tam: '3 units', zona: 'Madrid · North', plazo: 'This month', valor: '€850', prio: 'Low' } : { tipo: 'Mantenimiento', tam: '3 equipos', zona: 'Madrid · Norte', plazo: 'Este mes', valor: '850 €', prio: 'Baja' }, regla: en ? 'Maintenance → Andrés T.' : 'Mantenimiento → Andrés T.' },
        { id: 'e3', canal: 'anuncio', q: 'Marta R.', e: en ? 'Private customer' : 'Particular', a: en ? 'AC in a 90 m² flat' : 'Aire en un piso de 90 m²', hace: t.hace[4], tipo: en ? 'New install' : 'Instalación nueva', prio: en ? 'Medium' : 'Media', quien: 'LM', msg: en ? 'I saw your ad. How much would it cost to air-condition a 90 m² flat?' : 'He visto vuestro anuncio. ¿Cuánto costaría climatizar un piso de 90 m²?', campos: en ? { tipo: 'New install', tam: 'Home · 90 m²', zona: 'Madrid · South', plazo: 'No date', valor: '€2,900 – €3,600', prio: 'Medium' } : { tipo: 'Instalación nueva', tam: 'Vivienda · 90 m²', zona: 'Madrid · Sur', plazo: 'Sin fecha', valor: '2.900 – 3.600 €', prio: 'Media' }, regla: en ? 'Home → Laura M.' : 'Vivienda → Laura M.' }
      ],
      lead: null,               // la entrada estrella, cuando llega
      opps: [
        { id: 'o1', n: 'Marta R.', d: en ? '90 m² flat' : 'Piso de 90 m²', etapa: 'nuevo', v: 3200, q: 'LM', sig: en ? 'Call to arrange a visit' : 'Llamar para ver la vivienda' },
        { id: 'o2', n: 'Academia Linde', d: en ? 'Annual service' : 'Revisión anual', etapa: 'visita', v: 850, q: 'AT', sig: en ? 'Visit on Monday' : 'Visita el lunes' },
        { id: 'o3', n: 'Oficinas Tavira Legal', d: en ? 'Two offices' : 'Dos despachos', etapa: 'presupuesto', v: 4600, q: 'LM', sig: en ? 'Waiting for a reply' : 'Esperando respuesta', dias: 8 },
        { id: 'o4', n: 'Hostal Rúa Verde', d: en ? '12 rooms' : '12 habitaciones', etapa: 'presupuesto', v: 21400, q: 'SP', sig: en ? 'Follow-up sent' : 'Seguimiento enviado' },
        { id: 'o5', n: 'Clínica Veterinaria Olmo', d: en ? '3 units' : '3 equipos', etapa: 'negociacion', v: 9800, q: 'SP', sig: en ? 'Waiting for approval' : 'Esperando aprobación' },
        { id: 'o6', n: 'Panadería Brisa', d: en ? 'Maintenance contract' : 'Contrato de mantenimiento', etapa: 'ganado', v: 1200, q: 'AT', sig: en ? 'Won last week' : 'Ganado la semana pasada' }
      ],
      agenda: [
        { d: en ? 'Mon' : 'Lun', h: '09:30', x: 'Academia Linde', tipo: 'visita', q: 'AT' },
        { d: en ? 'Tue' : 'Mar', h: '12:00', x: 'Hostal Rúa Verde', tipo: 'llamada', q: 'SP' },
        { d: en ? 'Wed' : 'Mié', h: '17:00', x: 'Marta R.', tipo: 'llamada', q: 'LM' }
      ]
    };
  }

  /* ------------------------------------------------------ AYUDANTES */
  function av(k) { var e = EQUIPO[k]; return e ? '<span class="sd-av sd-av--s" style="--c:' + e.c + '" title="' + esc(e.n) + '">' + k + '</span>' : ''; }
  function pillPrio(p) { var bad = /Alta|High/.test(p), warn = /Media|Medium/.test(p); return '<span class="sd-pill ' + (bad ? 'sd-pill--bad' : warn ? 'sd-pill--warn' : '') + '">' + esc(p) + '</span>'; }
  function f(s, o) { return s.replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? o[k] : m; }); }
  function entrada(app, id) {
    if (app.S.lead && app.S.lead.id === id) return app.S.lead;
    for (var i = 0; i < app.S.entradas.length; i++) if (app.S.entradas[i].id === id) return app.S.entradas[i];
    return null;
  }
  function opp(app, id) { for (var i = 0; i < app.S.opps.length; i++) if (app.S.opps[i].id === id) return app.S.opps[i]; return null; }

  /* ------------------------------------------------------ PANTALLAS */
  function pEntradas(app) {
    var t = app.t, e = t.e, S = app.S;
    var lista = (S.lead ? [S.lead] : []).concat(S.entradas);
    var filas = lista.map(function (x) {
      var leyendo = x.fase === 1;
      var estado = x.fase && x.fase < 2 ? '<span class="sd-pill sd-pill--ia">' + esc(e.leyendo) + '</span>'
        : x.deriva ? '<span class="sd-pill sd-pill--auto">' + esc(e.derivar) + '</span>'
        : '<span class="sd-pill sd-pill--ok"><i></i>' + esc(e.clasif) + '</span>';
      return '<li><button type="button" class="sd-fila' + (S.ui.sel === x.id ? ' is-sel' : '') + (leyendo ? ' sd-leyendo' : '') + app.esNuevo(x.id) + '" data-a="sel" data-v="' + x.id + '" data-k="' + x.id + '">' +
        '<span class="sd-canal" title="' + esc(t.canal[x.canal]) + '">' + I[CANAL_I[x.canal]] + '</span>' +
        '<span style="min-width:0"><span class="sd-fila-t">' + esc(x.q) + (x.e && x.e !== x.q ? ' <span class="sd-t3" style="font-weight:400">· ' + esc(x.e) + '</span>' : '') + '</span><span class="sd-fila-d" style="display:block">' + esc(x.a) + '</span></span>' +
        '<span class="sd-fila-m">' + estado + '<span class="sd-mono sd-t3">' + esc(x.hace) + '</span></span></button></li>';
    }).join('');
    var sel = entrada(app, S.ui.sel);
    return '<div class="sd-h"><div><p class="sd-h-k">' + esc(e.k) + '</p><h3 class="sd-h-t">' + esc(e.t) + '</h3><p class="sd-h-d">' + esc(e.d) + '</p></div>' +
      '<div class="sd-h-a"><button type="button" class="sd-btn sd-btn--ia" data-a="simular">' + I.mas + esc(e.simular) + '</button></div></div>' +
      '<div class="sd-split' + (sel && S.ui.hoja ? ' is-hoja' : '') + '">' +
        '<div class="sd-card"><ul class="sd-lista">' + filas + '</ul></div>' +
        '<div class="sd-hoja' + (app.nuevos.hoja ? ' is-abre' : '') + '" data-detalle><button type="button" class="sd-btn sd-volver" data-a="volver">← ' + esc(t.pant.entradas) + '</button>' + (sel ? detalle(app, sel) : '<div class="sd-card sd-card-b sd-t3" style="font-size:13px">' + esc(e.sel) + '</div>') + '</div>' +
      '</div>';
  }

  function detalle(app, x) {
    var t = app.t, e = t.e, f2 = x.fase == null ? 99 : x.fase;
    var msg = x.msg.replace(/<m data-m="(\d)">/g, function (m, n) { return '<span class="sd-mark' + (x.marcas >= +n || f2 >= 3 ? ' is-on' : '') + '">'; }).replace(/<\/m>/g, '</span>');
    var claves = ['tipo', 'tam', 'zona', 'plazo', 'valor', 'prio'];
    var lleno = f2 >= 3 ? 6 : (x.campos_n || 0);
    var campos = claves.map(function (k, i) {
      var v = x.campos[k];
      return '<div class="sd-campo' + (i < lleno ? ' is-lleno' : '') + '"><div class="sd-campo-k">' + esc(e.campos[k]) + '</div><div class="sd-campo-v">' + (i < lleno ? (k === 'prio' ? pillPrio(v) : esc(v)) : '—') + '</div></div>';
    }).join('');
    var h = '<div class="sd-card"><div class="sd-card-h"><div style="display:flex;align-items:center;gap:10px;min-width:0"><span class="sd-canal">' + I[CANAL_I[x.canal]] + '</span><div style="min-width:0"><p class="sd-card-t">' + esc(x.q) + '</p><p class="sd-t3" style="margin:0;font-size:12px">' + esc(t.canal[x.canal]) + ' · ' + esc(x.hace) + '</p></div></div>' +
      (x.quien && (f2 >= 5 || x.fase == null) ? '<span style="display:flex;align-items:center;gap:6px;font-size:12px">' + av(x.quien) + esc(EQUIPO[x.quien].n) + '</span>' : '') + '</div>' +
      '<div class="sd-card-b"><p class="sd-h-k" style="margin-bottom:6px">' + esc(e.msgK) + '</p><p class="sd-msg' + (f2 === 1 ? ' sd-leyendo' : '') + '" style="margin:0">' + msg + '</p></div></div>';
    h += '<div class="sd-ia" style="margin-top:10px"><div class="sd-ia-h">' + I.ia + esc(e.iaK) + (f2 >= 2 || x.fase == null ? '<span class="sd-pill sd-pill--ok"><i></i>' + esc(e.listo) + '</span>' : '<span class="sd-pill sd-pill--ia">' + esc(e.leyendo) + '</span>') + '</div><div class="sd-ia-b"><div class="sd-campos">' + campos + '</div></div></div>';
    if (x.deriva) {
      h += '<div class="sd-regla' + app.esNuevo('der') + '" style="margin-top:10px">' + I.rayo + '<span><b>' + esc(e.derivar) + '</b> · ' + esc(e.aOps) + '</span></div>';
      return h;
    }
    if (x.dup && f2 >= 4) h += '<div class="sd-regla' + app.esNuevo('dup') + '" style="margin-top:10px;background:var(--sd-accbg);color:var(--sd-acc)">' + I.enlace + '<span><b style="color:#1f3f99">' + esc(e.dupK) + '</b> · ' + esc(x.dup) + '<br><span class="sd-t3">' + esc(t.reglaDup) + '</span></span></div>';
    if (f2 >= 5 || x.fase == null) h += '<div class="sd-regla' + app.esNuevo('asig') + '" style="margin-top:8px">' + I.rayo + '<span><b>' + esc(e.asigK) + '</b> · ' + (x.id === 'lead' ? t.reglaAsig : esc(x.regla || '')) + '</span></div>';
    if (x.borrador && f2 >= 6) {
      var enviado = x.enviado;
      h += '<div class="sd-card' + app.esNuevo('borr') + '" style="margin-top:10px"><div class="sd-card-h"><div><p class="sd-card-t">' + esc(e.borrK) + '</p><p class="sd-t3" style="margin:2px 0 0;font-size:12px">' + esc(e.borrD) + '</p></div>' +
        (enviado ? '<span class="sd-pill sd-pill--ok"><i></i>' + esc(e.enviado) + ' · ' + esc(x.envH) + '</span>' : '<div style="display:flex;gap:6px"><button type="button" class="sd-btn">' + esc(e.editar) + '</button><button type="button" class="sd-btn sd-btn--pri" data-a="enviar" data-v="' + x.id + '">' + I.correo + esc(e.enviar) + '</button></div>') + '</div>' +
        '<div class="sd-card-b"><div class="sd-chat"><div class="sd-bur sd-bur--yo' + (enviado ? '' : '" style="opacity:.8') + '"><span class="sd-bur-k">' + esc(e.tuyo) + '</span>' + x.borrador + '</div>' +
        (x.respuesta ? '<div class="sd-bur sd-bur--el' + app.esNuevo('resp') + '"><span class="sd-bur-k">' + esc(x.q) + '</span>' + esc(x.respuesta) + '</div>' : '') +
        (x.escribe ? '<span class="sd-escribe" aria-hidden="true"><i></i><i></i><i></i></span>' : '') +
        '</div></div></div>';
    }
    return h;
  }

  function pOportunidades(app) {
    var t = app.t, o = t.o, S = app.S;
    var etapas = ['nuevo', 'visita', 'presupuesto', 'negociacion', 'ganado'];
    var total = 0; S.opps.forEach(function (x) { if (x.etapa !== 'ganado') total += x.v; });
    var cols = etapas.map(function (et) {
      var xs = S.opps.filter(function (x) { return x.etapa === et; });
      var suma = xs.reduce(function (a, x) { return a + x.v; }, 0);
      return '<div class="sd-col"><div class="sd-col-h">' + esc(o.etapas[et]) + '<span>' + app.eur(suma) + '</span></div><div class="sd-col-l">' +
        xs.map(function (x) {
          var alerta = x.alerta ? '<div class="sd-pill sd-pill--warn" style="margin-top:8px"><i></i>' + esc(f(o.sinResp, { d: x.dias })) + '</div>' : '';
          var seg = x.seg ? '<div class="sd-pill sd-pill--auto" style="margin-top:6px">' + I.rayo.replace('<svg', '<svg style="width:12px;height:12px"') + esc(o.segProg) + '</div>' : '';
          return '<button type="button" class="sd-tar' + (x.alerta ? ' is-alerta' : '') + app.esNuevo(x.id) + '" data-a="abrir" data-v="' + x.id + '" data-k="' + x.id + '"><div class="sd-tar-t">' + esc(x.n) + '</div><div class="sd-tar-d">' + esc(x.d) + '</div>' + alerta + seg +
            '<div class="sd-tar-m"><span class="sd-tar-v">' + app.eur(x.v) + '</span>' + av(x.q) + '</div></button>';
        }).join('') + '</div></div>';
    }).join('');
    var ab = S.ui.abierta ? opp(app, S.ui.abierta) : null;
    var panel = '';
    if (ab) {
      var i = etapas.indexOf(ab.etapa);
      panel = '<div class="sd-card is-nuevo" style="margin-top:12px"><div class="sd-card-h"><div><p class="sd-card-t">' + esc(ab.n) + ' · ' + esc(ab.d) + '</p><p class="sd-t3" style="margin:2px 0 0;font-size:12px">' + esc(o.etapas[ab.etapa]) + ' · ' + app.eur(ab.v) + ' · ' + esc(EQUIPO[ab.q].n) + '</p></div><button type="button" class="sd-btn" data-a="cerrarOpp">' + esc(o.cerrar) + '</button></div>' +
        '<div class="sd-card-b" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><span class="sd-t3" style="font-size:12.5px;margin-right:auto">' + esc(o.sig) + ': ' + esc(ab.sig) + '</span>' +
        (i < 4 ? '<button type="button" class="sd-btn sd-btn--pri" data-a="mover" data-v="' + ab.id + '">' + I.flecha + esc(o.mover) + '</button>' :
          '<a class="sd-btn" href="#sistemas" data-demo="operaciones">' + I.llave + esc(o.verOps) + '</a><a class="sd-btn" href="#sistemas" data-demo="finance">' + I.euro + esc(o.verFin) + '</a>') + '</div></div>';
    }
    return '<div class="sd-h"><div><p class="sd-h-k">' + esc(o.k) + '</p><h3 class="sd-h-t">' + esc(o.t) + '</h3><p class="sd-h-d">' + esc(o.d) + '</p></div><div class="sd-h-a"><span class="sd-pill sd-pill--acc" style="height:28px;font-size:12.5px">' + esc(o.total) + ': ' + app.eur(total) + '</span></div></div>' +
      '<div class="sd-kanban">' + cols + '</div>' + panel;
  }

  function pAgenda(app) {
    var t = app.t, a = t.a;
    var filas = app.S.agenda.map(function (x, i) {
      var ico = x.tipo === 'visita' ? I.agenda : x.tipo === 'seguimiento' ? I.correo : I.tel;
      return '<li class="sd-fila' + app.esNuevo('ag' + i) + '" style="cursor:default" data-k="ag' + i + '"><span class="sd-canal">' + ico + '</span><span style="min-width:0"><span class="sd-fila-t" style="display:block">' + esc(x.x) + '</span><span class="sd-fila-d" style="display:block">' + esc(a[x.tipo]) + (x.auto ? ' · ' + esc(a.auto) : '') + '</span></span>' +
        '<span class="sd-fila-m"><span class="sd-mono" style="font-weight:600">' + esc(x.d) + ' ' + esc(x.h) + '</span>' + av(x.q) + '</span></li>';
    }).join('');
    return '<div class="sd-h"><div><p class="sd-h-k">' + esc(a.k) + '</p><h3 class="sd-h-t">' + esc(a.t) + '</h3><p class="sd-h-d">' + esc(a.d) + '</p></div></div><div class="sd-card"><ul class="sd-lista">' + filas + '</ul></div>';
  }

  function pPanel(app) {
    var t = app.t, p = t.p, S = app.S;
    var total = 0; S.opps.forEach(function (x) { if (x.etapa !== 'ganado') total += x.v; });
    var kp = function (k, v, d) { return '<div class="sd-card sd-kpi"><p class="sd-kpi-k">' + esc(k) + '</p><p class="sd-kpi-v">' + v + '</p><p class="sd-kpi-d">' + d + '</p></div>'; };
    var barras = [22, 18, 25, 20, 84, 91, 95, 97];
    var g = barras.map(function (v, i) { return '<i class="' + (i < 4 ? 'is-a' : 'is-d') + '" style="height:' + v + '%;animation-delay:' + (i * 60) + 'ms" title="' + v + ' %"></i>'; }).join('');
    var l = barras.map(function (v, i) { return '<span>' + p.gl + (i + 1) + '</span>'; }).join('');
    var ult = S.act.slice(0, 4).map(function (a) { return '<li class="sd-check" style="align-items:flex-start"><span class="sd-mono sd-t3" style="flex:none">' + esc(a.h) + '</span><span style="font-size:12.5px">' + a.x + '</span></li>'; }).join('');
    return '<div class="sd-h"><div><p class="sd-h-k">' + esc(p.k) + '</p><h3 class="sd-h-t">' + esc(p.t) + '</h3><p class="sd-h-d">' + esc(p.d) + '</p></div></div>' +
      '<div class="sd-kpis">' + kp(p.k1, app.en ? '2 min' : '2 min', p.k1d) + kp(p.k2, '0', esc(p.k2d)) + kp(p.k3, app.en ? '100%' : '100 %', esc(p.k3d)) + kp(p.k4, app.eur(total), esc(p.k4d)) + '</div>' +
      '<div class="sd-grid2"><div class="sd-card"><div class="sd-card-h"><p class="sd-card-t">' + esc(p.g) + '</p><span class="sd-pill sd-pill--acc">' + esc(p.marca) + ': ' + p.gl + '5</span></div><div class="sd-card-b"><div class="sd-barras">' + g + '</div><div class="sd-barras-l">' + l + '</div></div></div>' +
      '<div class="sd-card sd-solo-esc"><div class="sd-card-h"><p class="sd-card-t">' + esc(p.ult) + '</p></div><div class="sd-card-b" style="padding-top:4px"><ul class="sd-lista">' + ult + '</ul></div></div></div>';
  }

  /* ------------------------------------------------------ ACCIONES */
  var acciones = {
    sel: function (app, id) { app.S.ui.sel = id; app.S.ui.hoja = true; app.nuevo('hoja'); app.refrescar(); },
    volver: function (app) { app.S.ui.hoja = false; app.refrescar(); },
    abrir: function (app, id) { app.S.ui.abierta = id; app.refrescar(); },
    cerrarOpp: function (app) { app.S.ui.abierta = null; app.refrescar(); },
    enviar: function (app, id) {
      var x = entrada(app, id); if (!x || x.enviado) return;
      x.enviado = true; x.envH = app.hora(); app.refrescar();
      app.actividad('persona', f(app.t.act.env, { q: esc(x.q) }), app.t.act.envS);
    },
    mover: function (app, id) {
      var x = opp(app, id), orden = ['nuevo', 'visita', 'presupuesto', 'negociacion', 'ganado'];
      if (!x) return; var i = orden.indexOf(x.etapa); if (i >= 4) return;
      x.etapa = orden[i + 1]; x.alerta = false;
      app.actividad('persona', f(app.t.act.mover, { e: esc(x.n), s: esc(app.t.o.etapas[x.etapa]) }));
      app.refrescar(true);
      if (x.etapa === 'ganado') app.flujo(function (a, dormir) { return ganado(a, x, dormir); });
    },
    simular: function (app) {
      app.flujo(function (a, dormir) {
        var pool = a.t.pool, base = pool[a.S.ui.pool % pool.length]; a.S.ui.pool++;
        var x = JSON.parse(JSON.stringify(base));
        x.id = 's' + a.S.ui.pool; x.hace = a.en ? 'now' : 'ahora'; x.fase = 1; x.marcas = 0; x.campos_n = 0;
        if (a.S.ui.p !== 'entradas') a.ir('entradas');
        a.S.entradas.unshift(x); a.nuevo(x.id); a.S.ui.sel = x.id; a.S.ui.hoja = true; a.nuevo('hoja'); a.refrescar();
        a.contador('entradas', (a.S.ui.c.entradas || 0) + 1);
        a.actividad('entrada', f(a.en ? 'New {c} from <b>{q}</b>' : 'Nuevo {c} de <b>{q}</b>', { c: esc(a.t.canal[x.canal].toLowerCase()), q: esc(x.q) }));
        return dormir(900).then(function () { x.fase = 2; a.refrescar(); return rellenar(a, x, dormir); })
          .then(function () {
            x.fase = null;
            a.actividad('ia', f(a.t.act.lee, { a: esc(x.a), t: esc(x.campos.tipo), p: esc(x.campos.prio.toLowerCase()) }));
            if (x.deriva) { a.nuevo('der'); a.refrescar(); a.actividad('auto', a.t.act.deriva); return; }
            a.nuevo('asig'); a.refrescar();
            a.actividad('auto', f(a.t.act.asig, { n: esc(EQUIPO[x.quien].n), r: esc(x.regla) }));
            a.S.opps.unshift({ id: 'o' + x.id, n: x.e === x.q ? x.q : x.e, d: x.a, etapa: 'nuevo', v: 3000, q: x.quien, sig: a.en ? 'First reply sent' : 'Primera respuesta enviada' });
            return dormir(700).then(function () { a.actividad('ok', a.t.act.opp.replace(/<b>.*<\/b>/, '<b>' + esc(a.t.o.etapas.nuevo) + '</b>')); });
          });
      });
    }
  };

  function rellenar(app, x, dormir) {
    var n = 0;
    function uno() {
      if (n >= 6) return Promise.resolve();
      n++; x.campos_n = n; x.marcas = n; app.refrescar();
      return dormir(260).then(uno);
    }
    return uno();
  }

  function ganado(app, x, dormir) {
    var a = app.t.act;
    app.actividad('ok', f(a.acepta, {}).replace('Clínica Veterinaria Olmo', esc(x.n)));
    return dormir(900).then(function () { app.actividad('auto', a.ot); return dormir(800); })
      .then(function () { app.actividad('auto', a.fin); return dormir(700); })
      .then(function () { app.actividad('auto', a.bienv); });
  }

  /* ------------------------------------------------------ LA HISTORIA */
  function pasos() {
    return [
      { narra: function (a) { return a.t.pasos[0]; }, pausa: 3200,
        hacer: function (app) {
          app.S.ui.sel = 'e1'; app.ir('entradas');
          return app.espera(900).then(function () { return app.cursor(app.q('[data-v="e2"]'), 500); })
            .then(function () { app.S.ui.sel = 'e2'; app.refrescar(); });
        } },
      { narra: function (a) { return a.t.pasos[1]; }, pausa: 1600,
        hacer: function (app) {
          var t = app.t, d = t.delvia;
          if (app.S.ui.p !== 'entradas') app.ir('entradas');
          app.pasa(4);
          app.toast(t.canal.web, d.q + ' · ' + d.e, 'web');
          app.S.lead = { id: 'lead', canal: 'web', q: d.q, e: d.e, a: d.a, hace: app.en ? 'now' : 'ahora', msg: d.msg, campos: d.campos, fase: 1, marcas: 0, campos_n: 0, quien: 'SP', dup: d.dup };
          app.nuevo('lead'); app.nuevo('hoja'); app.S.ui.sel = 'lead'; app.S.ui.hoja = true; app.refrescar();
          app.contador('entradas', 1);
          app.actividad('entrada', f(t.act.recibido, { q: esc(d.q) }));
          return app.espera(1200);
        } },
      { narra: function (a) { return a.t.pasos[2]; }, pausa: 2200,
        hacer: function (app) {
          var x = app.S.lead; x.fase = 2; app.refrescar();
          var n = 0;
          function uno() {
            if (n >= 6) return Promise.resolve();
            n++; x.marcas = Math.min(5, n); x.campos_n = n; app.refrescar();
            return app.espera(520).then(uno);
          }
          return app.espera(500).then(uno).then(function () {
            x.fase = 3; app.refrescar();
            app.actividad('ia', f(app.t.act.lee, { a: esc(x.a), t: esc(x.campos.tipo), p: esc(x.campos.prio.toLowerCase()) }));
          });
        } },
      { narra: function (a) { return a.t.pasos[3]; }, pausa: 2600,
        hacer: function (app) {
          var x = app.S.lead; x.fase = 4; app.nuevo('dup'); app.refrescar();
          app.actividad('auto', f(app.t.act.dup, { e: esc(x.e) }));
          return app.espera(600);
        } },
      { narra: function (a) { return a.t.pasos[4]; }, pausa: 2400,
        hacer: function (app) {
          var x = app.S.lead; x.fase = 5; app.nuevo('asig'); app.refrescar();
          app.actividad('auto', f(app.t.act.asig, { n: 'Sergio P.', r: app.en ? 'south area' : 'zona sur' }));
          return app.espera(600);
        } },
      { narra: function (a) { return a.t.pasos[5]; }, pausa: 1400,
        hacer: function (app) {
          var x = app.S.lead; x.fase = 6; x.borrador = app.t.borrador; app.nuevo('borr'); app.refrescar();
          app.actividad('ia', f(app.t.act.borr, { n: 'Sergio P.' }));
          var m = app.main;
          return app.espera(900).then(function () {
            app.mostrar(app.q('[data-a="enviar"]'));
            return app.espera(500).then(function () { return app.cursor(app.q('[data-a="enviar"]'), 300); });
          }).then(function () {
            app.pasa(1); x.enviado = true; x.envH = app.hora(); app.refrescar();
            app.actividad('persona', f(app.t.act.env, { q: esc(x.q) }), app.t.act.envS);
          });
        } },
      { narra: function (a) { return a.t.pasos[6]; }, pausa: 1800,
        hacer: function (app) {
          var x = app.S.lead;
          x.escribe = true; app.refrescar();
          return app.espera(1400).then(function () {
            app.pasa(2); x.escribe = false; x.respuesta = app.t.respuesta; app.nuevo('resp'); app.refrescar();
            app.mostrar(app.q('.sd-bur--el'));
            return app.espera(900);
          }).then(function () {
            app.actividad('ia', f(app.t.act.conf, { n: 'Sergio P.' }));
            app.S.agenda.unshift({ d: app.en ? 'Thu' : 'Jue', h: '10:00', x: 'Grupo Delvia · ' + (app.en ? 'warehouse 800 m²' : 'nave 800 m²'), tipo: 'visita', q: 'SP' });
            app.S.opps.unshift({ id: 'o0', n: 'Grupo Delvia', d: app.en ? 'Warehouse · 800 m²' : 'Nave · 800 m²', etapa: 'visita', v: 22000, q: 'SP', sig: app.en ? 'Visit on Thursday 10:00' : 'Visita el jueves a las 10:00' });
            return app.espera(900);
          }).then(function () {
            app.ir('oportunidades'); app.nuevo('o0'); app.refrescar();
            app.mostrar(app.q('[data-k="o0"]'));
            app.actividad('auto', app.t.act.opp);
            return app.espera(700);
          }).then(function () { app.actividad('auto', app.t.act.tareas); });
        } },
      { narra: function (a) { return a.t.pasos[7]; }, pausa: 2600,
        hacer: function (app) {
          if (app.S.ui.p !== 'oportunidades') app.ir('oportunidades');
          var x = opp(app, 'o3');
          return app.espera(700).then(function () {
            x.alerta = true; app.refrescar();
            app.mostrar(app.q('[data-k="o3"]'));
            app.actividad('aviso', app.t.act.parado);
            return app.espera(1400);
          }).then(function () {
            x.seg = true; app.refrescar();
            app.S.agenda.push({ d: app.en ? 'Tomorrow' : 'Mañana', h: '09:00', x: 'Oficinas Tavira Legal', tipo: 'seguimiento', q: 'LM', auto: true });
            app.actividad('auto', app.t.act.seg);
          });
        } },
      { narra: function (a) { return a.t.pasos[8]; }, pausa: 2400,
        hacer: function (app) {
          if (app.S.ui.p !== 'oportunidades') app.ir('oportunidades');
          var x = opp(app, 'o5');
          app.mostrar(app.q('[data-k="o5"]'));
          return app.espera(500).then(function () { return app.cursor(app.q('[data-v="o5"]'), 300); }).then(function () {
            app.S.ui.abierta = 'o5'; app.refrescar();
            return app.espera(900);
          }).then(function () {
            app.pasa(6); x.etapa = 'ganado'; x.sig = app.en ? 'Won today' : 'Ganado hoy'; app.refrescar(true);
            app.actividad('ok', app.t.act.acepta);
            return app.espera(700).then(function () { app.mostrar(app.q('[data-k="o5"]')); return app.espera(400); });
          }).then(function () { app.actividad('auto', app.t.act.ot); return app.espera(800); })
            .then(function () { app.actividad('auto', app.t.act.fin); return app.espera(700); })
            .then(function () { app.actividad('auto', app.t.act.bienv); });
        } },
      { narra: function (a) { return a.t.pasos[9]; }, pausa: 7000,
        hacer: function (app) { app.S.ui.abierta = null; app.ir('panel'); return app.espera(400); } }
    ];
  }

  SD.registrar('comercial', {
    textos: T,
    estado: estado,
    pantallas: [
      { id: 'entradas', icono: 'bandeja', html: pEntradas },
      { id: 'oportunidades', icono: 'embudo', html: pOportunidades },
      { id: 'agenda', icono: 'agenda', html: pAgenda },
      { id: 'panel', icono: 'panel', html: pPanel }
    ],
    acciones: acciones,
    pasos: pasos()
  });
})();
