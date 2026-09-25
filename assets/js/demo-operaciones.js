/* ============================================================================
   SISTEMA DE EJEMPLO · OPERACIONES
   ----------------------------------------------------------------------------
   La misma empresa inventada (Arvena Climatización). Aquí se ve lo que pasa
   DESPUÉS de vender: del sí del cliente al trabajo hecho y facturado, sin que
   nadie vuelva a teclear nada.

     1  Antes: WhatsApp y hoja de cálculo. Ahora: una orden de trabajo.
     2  Llega el sí desde Comercial y la orden se crea sola, con su plantilla.
     3  Falta material: pedido al proveedor preparado, con fecha de llegada.
     4  La IA propone quién y cuándo; lo aprueba una persona.
     5  El cliente recibe el día y la hora por WhatsApp.
     6  El proveedor se retrasa: el sistema ve el choque y reorganiza.
     7  El técnico lleva el parte en el móvil, con fotos y firma.
     8  Parte firmado: factura en Finance, próxima revisión y encuesta.
     9  El panel.
   ========================================================================= */
(function () {
  'use strict';
  var SD = window.SD, I = SD.I, esc = SD.esc;

  var TEC = {
    IR: { n: 'Iván R.', c: '#0a6e7a' },
    MG: { n: 'Marta G.', c: '#6337c9' },
    OL: { n: 'Óscar L.', c: '#8f5400' }
  };
  function av(k) { var e = TEC[k]; return e ? '<span class="sd-av sd-av--s" style="--c:' + e.c + '" title="' + esc(e.n) + '">' + k + '</span>' : ''; }
  function f(s, o) { return s.replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? o[k] : m; }); }

  var T = {
    es: {
      app: 'Operaciones', empresa: 'Arvena Climatización', yo: { n: 'Carmen V.', ini: 'CV' },
      navK: 'Trabajo', pieT: 'Sistema de ejemplo', pieD: 'Empresa ficticia de climatización. Así funcionaría en la tuya.',
      pant: { trabajos: 'Trabajos', plan: 'Planificación', material: 'Material', panel: 'Panel' },
      tipos: { ia: 'IA', auto: 'Automático', ok: 'Hecho', aviso: 'Aviso', persona: 'Persona', entrada: 'Entrada' },
      estados: { nueva: 'Nueva', material: 'Esperando material', plan: 'Planificada', curso: 'En curso', hecha: 'Terminada', fact: 'Facturada' },
      dias: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
      tr: { k: 'Órdenes de trabajo', t: 'Trabajos', d: 'Cada trabajo con sus tareas, su material, su gente y su fecha.',
        origen: 'Viene de', tareas: 'Tareas', material: 'Material', fecha: 'Cuándo y quién', avisos: 'Avisos al cliente', sinFecha: 'Sin fecha todavía',
        simular: 'Simular un retraso', tecnico: 'Así lo ve el técnico', firma: 'Firma del cliente', fotos: '2 fotos adjuntas', parte: 'Parte', volver: 'Trabajos' },
      pl: { k: 'Semana', t: 'Planificación', d: 'Quién está dónde. Lo que propone el sistema se ve distinto hasta que alguien lo aprueba.',
        tec: 'Técnico', prop: 'Propuesta', porque: 'Por qué', aprobar: 'Aprobar', aprobado: 'Aprobado' },
      ma: { k: 'Almacén', t: 'Material', d: 'Lo que hay, lo que hace falta y lo que ya está pedido.', art: 'Artículo', hay: 'En almacén', falta: 'Falta', ok: 'Hay', pedidos: 'Pedidos a proveedor', llega: 'llega' },
      pa: { k: 'Este mes', t: 'Panel de operaciones', d: 'Salido de los partes y de la agenda, no de una hoja aparte.',
        k1: 'Trabajos a tiempo', k1d: '2 retrasos, los dos avisados antes', k2: 'Horas planificando', k2d: 'antes del sistema: <b>9 h a la semana</b>', k3: 'Partes sin facturar', k3d: 'la factura sale del parte', k4: 'Material que faltó en obra', k4d: 'se pide antes de planificar',
        g: 'Días entre el trabajo terminado y la factura', gl: 'sem', marca: 'Sistema en marcha' },
      pasos: [
        'Antes, un presupuesto aceptado acababa en un WhatsApp y una hoja de cálculo. <b>Aquí acaba en una orden de trabajo.</b>',
        'Llega el sí de la <b>Clínica Veterinaria Olmo</b> desde Comercial. La orden de trabajo <b>se crea sola</b>, con las tareas de su plantilla.',
        'Comprueba el material: <b>falta una unidad exterior</b>. Deja preparado el pedido al proveedor y apunta cuándo llega.',
        'Propone quién y cuándo: <b>Iván y Marta, el jueves</b>, porque el material llega el miércoles y están cerca. <b>Lo aprueba una persona.</b>',
        'Avisa al cliente por WhatsApp con el día y la hora. <b>Nadie tiene que llamar para confirmarlo.</b>',
        'El proveedor se retrasa al viernes. <b>El sistema ve el choque</b> y propone mover el trabajo y adelantar otro para no perder el jueves.',
        'El día del trabajo, el técnico lo lleva en el móvil: tareas, fotos y <b>la firma del cliente en el mismo parte</b>.',
        'Con el parte firmado, <b>la factura queda preparada en Finance</b>, la próxima revisión en la agenda y la encuesta enviada.',
        'Resultado: <b>ningún trabajo sin fecha, ningún parte sin factura</b>. Toca lo que quieras: la demo es tuya.'
      ],
      act: {
        llega: 'Presupuesto <b>P-1187</b> aceptado en Comercial', crea: 'Orden <b>OT-2419</b> creada con la plantilla «Instalación de 3 equipos»',
        falta: 'Falta <b>1 unidad exterior de 5 kW</b> en almacén', pedido: 'Pedido <b>PC-332</b> preparado · llega el miércoles',
        propone: 'Propuesta: <b>jueves 8:00–14:00</b> con Iván R. y Marta G.', aprueba: 'Planificación aprobada por <b>Carmen V.</b>',
        wa: 'WhatsApp al cliente: <b>jueves de 8:00 a 14:00</b>', retraso: 'El proveedor retrasa el pedido <b>PC-332</b> al viernes',
        choque: 'Choque detectado: el trabajo del jueves no tendría material', reorg: 'Propuesta: Olmo al <b>viernes</b> y Panadería Brisa al <b>jueves</b>',
        reorgOk: 'Cambios aprobados · <b>2 clientes avisados</b>', parte: 'Parte firmado por el cliente · <b>5 h 40 min</b>',
        factura: 'Factura <b>F-2026-0418</b> preparada en Finance a partir del parte', revision: 'Próxima revisión programada · <b>dentro de 6 meses</b>',
        encuesta: 'Encuesta de satisfacción enviada', simula: 'Simulado: el proveedor avisa de un retraso'
      },
      ot: { nombre: 'Instalación de 3 equipos', cliente: 'Clínica Veterinaria Olmo', origen: 'Comercial · presupuesto P-1187',
        tareas: ['Replanteo y medidas', 'Preparar el material', 'Montaje de las unidades', 'Puesta en marcha y prueba', 'Parte firmado por el cliente'],
        material: [['Unidad interior 3,5 kW', 3, 5], ['Unidad exterior 5 kW', 1, 0], ['Tubería frigorífica (m)', 15, 40], ['Soportes', 3, 12]],
        prov: 'Suministros Térmicos Balda', razones: ['El material llega el miércoles', 'Iván (frigorista) y Marta (electricista) libres el jueves por la mañana', 'Vienen de un trabajo a 12 minutos'],
        razones2: ['El material llega ahora el viernes', 'Iván y Marta siguen libres el viernes por la mañana', 'Panadería Brisa tenía hueco el jueves y su revisión no necesita material'],
        wa: 'Hola, somos Arvena Climatización: la instalación será el <b>{d} de 8:00 a 14:00</b>. Os escribimos el día antes.' },
      otros: [
        { id: 'OT-2412', c: 'Academia Linde', n: 'Revisión anual · 3 equipos', e: 'plan', d: 0, t: ['OL'] },
        { id: 'OT-2415', c: 'Panadería Brisa', n: 'Mantenimiento trimestral', e: 'plan', d: 1, t: ['OL'] },
        { id: 'OT-2408', c: 'Hostal Rúa Verde', n: 'Cambio de compresor', e: 'fact', d: null, t: ['IR'] }
      ]
    },
    en: {
      app: 'Operations', empresa: 'Arvena Climatización', yo: { n: 'Carmen V.', ini: 'CV' },
      navK: 'Work', pieT: 'Example system', pieD: 'A fictional air-conditioning company. This is how it would work in yours.',
      pant: { trabajos: 'Jobs', plan: 'Scheduling', material: 'Stock', panel: 'Dashboard' },
      tipos: { ia: 'AI', auto: 'Automatic', ok: 'Done', aviso: 'Alert', persona: 'Person', entrada: 'Incoming' },
      estados: { nueva: 'New', material: 'Waiting for parts', plan: 'Scheduled', curso: 'In progress', hecha: 'Done', fact: 'Invoiced' },
      dias: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      tr: { k: 'Work orders', t: 'Jobs', d: 'Every job with its tasks, parts, people and date.',
        origen: 'From', tareas: 'Tasks', material: 'Parts', fecha: 'When and who', avisos: 'Customer updates', sinFecha: 'No date yet',
        simular: 'Simulate a delay', tecnico: 'What the technician sees', firma: 'Customer signature', fotos: '2 photos attached', parte: 'Job sheet', volver: 'Jobs' },
      pl: { k: 'This week', t: 'Scheduling', d: 'Who is where. What the system proposes looks different until someone approves it.',
        tec: 'Technician', prop: 'Proposal', porque: 'Why', aprobar: 'Approve', aprobado: 'Approved' },
      ma: { k: 'Warehouse', t: 'Stock', d: 'What we have, what we need and what is already ordered.', art: 'Item', hay: 'In stock', falta: 'Short', ok: 'Available', pedidos: 'Supplier orders', llega: 'arrives' },
      pa: { k: 'This month', t: 'Operations dashboard', d: 'Straight from the job sheets and the schedule, not a separate spreadsheet.',
        k1: 'Jobs on time', k1d: '2 delays, both flagged in advance', k2: 'Hours spent scheduling', k2d: 'before the system: <b>9 h a week</b>', k3: 'Job sheets not invoiced', k3d: 'the invoice comes from the job sheet', k4: 'Parts missing on site', k4d: 'ordered before scheduling',
        g: 'Days between finishing a job and invoicing it', gl: 'wk', marca: 'System live' },
      pasos: [
        'An accepted quote used to end up in a WhatsApp and a spreadsheet. <b>Here it becomes a work order.</b>',
        '<b>Clínica Veterinaria Olmo</b>’s yes arrives from Sales. The work order <b>creates itself</b>, with the tasks from its template.',
        'It checks the parts: <b>one outdoor unit is missing</b>. It prepares the supplier order and notes when it arrives.',
        'It proposes who and when: <b>Iván and Marta, on Thursday</b>, because the parts arrive Wednesday and they’re nearby. <b>A person approves it.</b>',
        'It tells the customer the day and time on WhatsApp. <b>Nobody has to call to confirm it.</b>',
        'The supplier slips to Friday. <b>The system spots the clash</b> and proposes moving the job and bringing another one forward so Thursday isn’t wasted.',
        'On the day, the technician has it on their phone: tasks, photos and <b>the customer’s signature on the same job sheet</b>.',
        'Once the sheet is signed, <b>the invoice is ready in Finance</b>, the next service is in the schedule and the survey has gone out.',
        'The result: <b>no job without a date, no job sheet without an invoice</b>. Try anything you like: the demo is yours.'
      ],
      act: {
        llega: 'Quote <b>P-1187</b> accepted in Sales', crea: 'Order <b>OT-2419</b> created from the “3-unit install” template',
        falta: '<b>1 outdoor 5 kW unit</b> is out of stock', pedido: 'Order <b>PC-332</b> prepared · arrives Wednesday',
        propone: 'Proposal: <b>Thursday 8:00–14:00</b> with Iván R. and Marta G.', aprueba: 'Schedule approved by <b>Carmen V.</b>',
        wa: 'WhatsApp to the customer: <b>Thursday 8:00 to 14:00</b>', retraso: 'Supplier pushes order <b>PC-332</b> to Friday',
        choque: 'Clash detected: Thursday’s job would have no parts', reorg: 'Proposal: Olmo to <b>Friday</b>, Panadería Brisa to <b>Thursday</b>',
        reorgOk: 'Changes approved · <b>2 customers notified</b>', parte: 'Job sheet signed by the customer · <b>5 h 40 min</b>',
        factura: 'Invoice <b>F-2026-0418</b> ready in Finance from the job sheet', revision: 'Next service scheduled · <b>in 6 months</b>',
        encuesta: 'Satisfaction survey sent', simula: 'Simulated: the supplier reports a delay'
      },
      ot: { nombre: '3-unit install', cliente: 'Clínica Veterinaria Olmo', origen: 'Sales · quote P-1187',
        tareas: ['Survey and measurements', 'Prepare the parts', 'Mount the units', 'Commission and test', 'Job sheet signed by the customer'],
        material: [['Indoor unit 3.5 kW', 3, 5], ['Outdoor unit 5 kW', 1, 0], ['Refrigerant pipe (m)', 15, 40], ['Brackets', 3, 12]],
        prov: 'Suministros Térmicos Balda', razones: ['Parts arrive on Wednesday', 'Iván (refrigeration) and Marta (electrician) are free on Thursday morning', 'They’re coming from a job 12 minutes away'],
        razones2: ['The parts now arrive on Friday', 'Iván and Marta are still free on Friday morning', 'Panadería Brisa had a Thursday slot and its service needs no parts'],
        wa: 'Hi, this is Arvena Climatización: the install will be on <b>{d} from 8:00 to 14:00</b>. We’ll message you the day before.' },
      otros: [
        { id: 'OT-2412', c: 'Academia Linde', n: 'Annual service · 3 units', e: 'plan', d: 0, t: ['OL'] },
        { id: 'OT-2415', c: 'Panadería Brisa', n: 'Quarterly maintenance', e: 'plan', d: 1, t: ['OL'] },
        { id: 'OT-2408', c: 'Hostal Rúa Verde', n: 'Compressor replacement', e: 'fact', d: null, t: ['IR'] }
      ]
    }
  };


  /* ═════════════ UN TALLER CON TRABAJO, NO CON TRES PARTES ═════════════
     Había tres órdenes de trabajo y cinco bloques en la planificación: una
     empresa de climatización con tres trabajos en la semana no enseña un
     sistema de operaciones. Las tres de arriba se quedan a mano —el
     recorrido guiado las nombra por su id— y estas dieciséis se montan de
     una tabla. Cada fila: id · cliente · qué es [ES,EN] · estado · día
     (0 = lunes, null = sin planificar) · técnicos. */
  var MAS_OT = [
    ['OT-2416','Óptica Bendaña',['Avería · no enfría','Breakdown · not cooling'],'curso',0,['IR']],
    ['OT-2417','Gimnasio Ardal',['Ruido en unidad exterior','Outdoor unit noise'],'curso',0,['MG']],
    ['OT-2418','Notaría Alcaraz',['Instalación sala de espera','Waiting room install'],'plan',1,['IR','MG']],
    ['OT-2419','Supermercados Trena',['Revisión cámaras · tienda 1','Cold room service · shop 1'],'plan',1,['OL']],
    ['OT-2420','Supermercados Trena',['Revisión cámaras · tienda 2','Cold room service · shop 2'],'plan',2,['OL']],
    ['OT-2421','Autoescuela Vinca',['Aula y recepción','Classroom and front desk'],'plan',2,['MG']],
    ['OT-2422','Residencia El Torcal',['Revisión de nueve equipos','Nine-unit service'],'plan',3,['OL','IR']],
    ['OT-2423','Inmobiliaria Sarela',['Oficina de 70 m²','70 m² office'],'plan',3,['MG']],
    ['OT-2424','Cafetería Nerva',['Dos splits','Two split units'],'plan',4,['IR']],
    ['OT-2425','Clínica Dental Sorela',['Retirada de equipos viejos','Remove old units'],'plan',4,['MG','OL']],
    ['OT-2426','Talleres Marbeny',['Toma de medidas en nave','Workshop survey'],'nueva',null,[]],
    ['OT-2427','Colegio Arantes',['Seis aulas · agosto','Six classrooms · August'],'nueva',null,[]],
    ['OT-2428','Hotel Vegalta',['Arranque del contrato anual','Annual contract kick-off'],'material',null,['OL']],
    ['OT-2429','Bar La Espiga',['Terraza cerrada','Enclosed terrace'],'material',null,['IR']],
    ['OT-2410','Panadería Brisa',['Cambio de filtros','Filter replacement'],'hecha',null,['OL']],
    ['OT-2409','Marta R.',['Piso de 90 m²','90 m² flat'],'fact',null,['IR','MG']]
  ];
  function masOts(en) {
    var i = en ? 1 : 0;
    return MAS_OT.map(function (r) { return { id: r[0], c: r[1], n: r[2][i], e: r[3], d: r[4], t: r[5].slice() }; });
  }
  /* La semana de los tres técnicos, no cinco huecos. */
  var MAS_BLOQ = [
    ['IR',0,['Óptica Bendaña','Óptica Bendaña'],'8:00–9:30','trab'],
    ['MG',0,['Gimnasio Ardal','Gimnasio Ardal'],'10:00–13:00','trab'],
    ['OL',0,['Ruta de mantenimiento · centro','Maintenance route · centre'],'13:00–15:00','mant'],
    ['IR',1,['Notaría Alcaraz','Notaría Alcaraz'],'8:30–13:00','trab'],
    ['MG',1,['Notaría Alcaraz','Notaría Alcaraz'],'8:30–13:00','trab'],
    ['OL',1,['Supermercados Trena · tienda 1','Trena supermarkets · shop 1'],'10:00–13:00','mant'],
    ['OL',2,['Supermercados Trena · tienda 2','Trena supermarkets · shop 2'],'9:00–12:00','mant'],
    ['MG',2,['Autoescuela Vinca','Vinca driving school'],'9:00–14:00','trab'],
    ['OL',3,['Residencia El Torcal','El Torcal care home'],'8:00–14:00','mant'],
    ['IR',3,['Residencia El Torcal','El Torcal care home'],'8:00–14:00','mant'],
    ['MG',3,['Inmobiliaria Sarela','Sarela estate agents'],'9:30–13:00','trab'],
    ['IR',4,['Cafetería Nerva','Nerva coffee shop'],'8:30–11:00','trab'],
    ['MG',4,['Clínica Dental Sorela','Sorela dental clinic'],'9:00–13:00','trab'],
    ['OL',4,['Ruta de mantenimiento · sur','Maintenance route · south'],'9:00–13:00','mant']
  ];
  function masBloques(en) {
    var i = en ? 1 : 0;
    return MAS_BLOQ.map(function (r) { return { tec: r[0], d: r[1], x: r[2][i], h: r[3], tipo: r[4] }; });
  }
  var MAS_PED = [
    ['PC-330','Climatiza Ibérica',['Split 3,5 kW ×4','3.5 kW split ×4'],1,true],
    ['PC-331','Suministros Térmicos Balda',['Tubería de cobre 60 m','Copper pipe 60 m'],1,true],
    ['PC-332','Climatiza Ibérica',['Compresor de repuesto','Spare compressor'],3,false],
    ['PC-333','Frigoveca',['Gas R-32 ×6','R-32 gas ×6'],2,true],
    ['PC-334','Suministros Térmicos Balda',['Rejillas ×20','Grilles ×20'],4,false]
  ];
  function masPedidos(en) {
    var D = en ? ['Mon','Tue','Wed','Thu','Fri'] : ['Lun','Mar','Mié','Jue','Vie'], i = en ? 1 : 0;
    return MAS_PED.map(function (r) { return { id: r[0], prov: r[1], x: r[2][i], llega: D[r[3]], ok: r[4] }; });
  }

  function estado(app) {
    var t = app.t;
    return {
      ui: { p: 'trabajos', sel: 'OT-2412', hoja: false, n: 0, c: {} },
      reloj: 8 * 60 + 5,
      act: [
        { t: 'ok', x: app.en ? 'Invoice for <b>Hostal Rúa Verde</b> ready from its job sheet' : 'Factura de <b>Hostal Rúa Verde</b> preparada desde su parte', s: '', h: '07:58', k: 'a-1' }
      ],
      ots: t.otros.map(function (o) { return JSON.parse(JSON.stringify(o)); }).concat(masOts(app.en)),
      olmo: null,
      bloques: [
        { tec: 'OL', d: 0, x: 'Academia Linde', h: '9:00–12:00', tipo: 'mant' },
        { tec: 'OL', d: 1, x: 'Panadería Brisa', h: '8:00–10:00', tipo: 'mant' },
        { tec: 'IR', d: 0, x: 'Hostal Rúa Verde', h: '8:00–13:00', tipo: 'trab' },
        { tec: 'MG', d: 1, x: app.en ? 'Office electrics' : 'Cuadro eléctrico oficina', h: '9:00–12:00', tipo: 'trab' },
        { tec: 'IR', d: 2, x: app.en ? 'Stock pick-up' : 'Recogida de material', h: '12:00–13:00', tipo: 'trab' }
      ].concat(masBloques(app.en)),
      pedidos: [{ id: 'PC-329', prov: 'Suministros Térmicos Balda', x: app.en ? 'Brackets ×12' : 'Soportes ×12', llega: app.en ? 'Mon' : 'Lun', ok: true }].concat(masPedidos(app.en)),
      prop: null
    };
  }

  function olmo(app) { return app.S.olmo; }
  function otSel(app) {
    var id = app.S.ui.sel;
    if (app.S.olmo && app.S.olmo.id === id) return app.S.olmo;
    for (var i = 0; i < app.S.ots.length; i++) if (app.S.ots[i].id === id) return app.S.ots[i];
    return null;
  }
  function pillEstado(app, e) {
    var cls = { nueva: 'sd-pill--acc', material: 'sd-pill--warn', plan: 'sd-pill--auto', curso: 'sd-pill--ia', hecha: 'sd-pill--ok', fact: 'sd-pill--ok' }[e] || '';
    return '<span class="sd-pill ' + cls + '"><i></i>' + esc(app.t.estados[e]) + '</span>';
  }

  /* ------------------------------------------------------ PANTALLAS */
  function pTrabajos(app) {
    var t = app.t, tr = t.tr, S = app.S;
    var lista = (S.olmo ? [S.olmo] : []).concat(S.ots);
    var filas = lista.map(function (o) {
      var dia = o.d != null ? t.dias[o.d] : '—';
      return '<li><button type="button" class="sd-fila' + (S.ui.sel === o.id ? ' is-sel' : '') + app.esNuevo(o.id) + '" data-a="sel" data-v="' + o.id + '" data-k="' + o.id + '">' +
        '<span class="sd-canal">' + I.llave + '</span><span style="min-width:0"><span class="sd-fila-t" style="display:block">' + esc(o.c) + '</span><span class="sd-fila-d" style="display:block">' + esc(o.id) + ' · ' + esc(o.n) + '</span></span>' +
        '<span class="sd-fila-m">' + pillEstado(app, o.e) + '<span style="display:flex;gap:4px;align-items:center"><span class="sd-mono sd-t3">' + esc(dia) + '</span>' + (o.t || []).map(av).join('') + '</span></span></button></li>';
    }).join('');
    var sel = otSel(app);
    return '<div class="sd-h"><div><p class="sd-h-k">' + esc(tr.k) + '</p><h3 class="sd-h-t">' + esc(tr.t) + '</h3><p class="sd-h-d">' + esc(tr.d) + '</p></div>' +
      '<div class="sd-h-a"><button type="button" class="sd-btn sd-btn--ia" data-a="simular">' + I.camion + esc(tr.simular) + '</button></div></div>' +
      '<div class="sd-split' + (S.ui.hoja ? ' is-hoja' : '') + '"><div class="sd-card"><ul class="sd-lista">' + filas + '</ul></div>' +
      '<div class="sd-hoja' + (app.nuevos.hoja ? ' is-abre' : '') + '"><button type="button" class="sd-btn sd-volver" data-a="volver">← ' + esc(tr.volver) + '</button>' + (sel ? detalle(app, sel) : '') + '</div></div>';
  }

  function detalle(app, o) {
    var t = app.t, tr = t.tr, h = '';
    h += '<div class="sd-card"><div class="sd-card-h"><div style="min-width:0"><p class="sd-card-t">' + esc(o.c) + '</p><p class="sd-t3" style="margin:2px 0 0;font-size:12px">' + esc(o.id) + ' · ' + esc(o.n) + '</p></div>' + pillEstado(app, o.e) + '</div>';
    if (o.origen) h += '<div class="sd-card-b" style="padding-bottom:0"><div class="sd-regla" style="background:var(--sd-accbg);color:var(--sd-acc)">' + I.enlace + '<span><b style="color:#1f3f99">' + esc(tr.origen) + '</b> · ' + esc(o.origen) + '</span></div></div>';
    if (o.tareas) {
      h += '<div class="sd-card-b"><p class="sd-h-k" style="margin-bottom:4px">' + esc(tr.tareas) + '</p>' + o.tareas.map(function (x, i) {
        return '<div class="sd-check' + (i < (o.hechas || 0) ? ' is-ok' : '') + app.esNuevo('t' + i) + '"><span class="sd-caja" aria-hidden="true"></span><span class="sd-check-t">' + esc(x) + '</span></div>';
      }).join('') + '</div>';
    }
    h += '</div>';
    if (o.material) {
      h += '<div class="sd-card' + app.esNuevo('mat') + '" style="margin-top:10px"><div class="sd-card-h"><p class="sd-card-t">' + esc(tr.material) + '</p>' + (o.pedido ? '<span class="sd-pill sd-pill--auto">' + esc(o.pedido) + '</span>' : '') + '</div><div class="sd-card-b" style="padding-top:4px">' +
        o.material.map(function (m) {
          var ok = m[2] >= m[1];
          return '<div class="sd-check' + (ok ? ' is-ok' : '') + '" style="justify-content:space-between"><span style="display:flex;gap:10px;align-items:center"><span class="sd-caja" aria-hidden="true"' + (ok ? '' : ' style="border-color:var(--sd-warn)"') + '></span><span>' + esc(m[0]) + ' ×' + m[1] + '</span></span>' +
            (ok ? '<span class="sd-pill sd-pill--ok">' + esc(t.ma.ok) + '</span>' : '<span class="sd-pill sd-pill--warn">' + esc(t.ma.falta) + '</span>') + '</div>';
        }).join('') + '</div></div>';
    }
    if (o.id === 'OT-2419') {
      h += '<div class="sd-card" style="margin-top:10px"><div class="sd-card-h"><p class="sd-card-t">' + esc(tr.fecha) + '</p>' + (o.d != null ? '<span class="sd-mono" style="font-weight:600">' + esc(t.dias[o.d]) + ' 8:00–14:00</span>' : '<span class="sd-t3" style="font-size:12.5px">' + esc(tr.sinFecha) + '</span>') + '</div>' +
        (o.t && o.t.length ? '<div class="sd-card-b" style="display:flex;gap:14px;flex-wrap:wrap">' + o.t.map(function (k) { return '<span style="display:flex;align-items:center;gap:6px;font-size:13px">' + av(k) + esc(TEC[k].n) + '</span>'; }).join('') + '</div>' : '') + '</div>';
      if (o.avisos && o.avisos.length) {
        h += '<div class="sd-card' + app.esNuevo('wa') + '" style="margin-top:10px"><div class="sd-card-h"><p class="sd-card-t">' + esc(tr.avisos) + '</p><span class="sd-canal">' + I.wa + '</span></div><div class="sd-card-b"><div class="sd-chat">' +
          o.avisos.map(function (w) { return '<div class="sd-bur sd-bur--yo">' + w + '</div>'; }).join('') + '</div></div></div>';
      }
      if (o.tel) h += tecnico(app, o);
    }
    return h;
  }

  function tecnico(app, o) {
    var tr = app.t.tr;
    var firma = o.firma ? '<svg viewBox="0 0 200 60" style="width:100%;height:56px" aria-hidden="true"><path d="M8 42c14-22 22-26 26-14s-6 18 4 6 18-24 22-10-8 20 6 8 16-18 24-6 10 10 20 0 14-12 22-4 18 6 30 2" fill="none" stroke="#15161a" stroke-width="2.2" stroke-linecap="round" style="stroke-dasharray:420;stroke-dashoffset:' + (o.firma > 1 ? 0 : 420) + ';transition:stroke-dashoffset 1.4s ease"/></svg>' : '';
    return '<div class="sd-card' + app.esNuevo('tel') + '" style="margin-top:10px"><div class="sd-card-h"><p class="sd-card-t">' + esc(tr.tecnico) + '</p><span style="display:flex;gap:4px">' + av('IR') + av('MG') + '</span></div><div class="sd-card-b" style="display:flex;justify-content:center;background:var(--sd-s3)">' +
      '<div class="sd-tel"><div class="sd-tel-p"><div class="sd-tel-h"><p style="margin:0;font-weight:600;font-size:13px">' + esc(o.c) + '</p><p class="sd-t3" style="margin:2px 0 0;font-size:12px">' + esc(o.id) + ' · ' + esc(app.t.dias[o.d]) + ' 8:00</p></div>' +
      '<div class="sd-tel-b">' + o.tareas.map(function (x, i) { return '<div class="sd-check' + (i < (o.hechas || 0) ? ' is-ok' : '') + '" style="font-size:12.5px"><span class="sd-caja" aria-hidden="true"></span><span class="sd-check-t">' + esc(x) + '</span></div>'; }).join('') +
      (o.fotos ? '<div style="display:flex;gap:6px;margin-top:4px"><span style="flex:1;height:44px;border-radius:6px;background:linear-gradient(135deg,#d7dde6,#b9c3d1)"></span><span style="flex:1;height:44px;border-radius:6px;background:linear-gradient(135deg,#cfd8cf,#aab8ab)"></span><span class="sd-t3" style="font-size:12px;align-self:center">' + esc(tr.fotos) + '</span></div>' : '') +
      (o.firma ? '<div style="margin-top:6px;border:1px dashed var(--sd-b2);border-radius:8px;padding:4px 6px"><p class="sd-t3" style="margin:0;font-size:12px">' + esc(tr.firma) + '</p>' + firma + '</div>' : '') +
      '</div></div></div></div></div>';
  }

  function pPlan(app) {
    var t = app.t, pl = t.pl, S = app.S;
    var filas = ['IR', 'MG', 'OL'].map(function (k) {
      var celdas = [0, 1, 2, 3, 4].map(function (d) {
        var bs = S.bloques.filter(function (b) { return b.tec === k && b.d === d; });
        return '<div class="sd-plan-d">' + bs.map(function (b) {
          var cls = b.tipo === 'mant' ? ' sd-bloque--mant' : b.tipo === 'prop' ? ' sd-bloque--prop' : b.tipo === 'aviso' ? ' sd-bloque--aviso' : '';
          return '<div class="sd-bloque' + cls + (b.nuevo ? ' is-nuevo' : '') + '" data-k="b-' + b.x + '-' + k + '">' + esc(b.x) + '<small>' + esc(b.h) + '</small></div>';
        }).join('') + '</div>';
      }).join('');
      return '<div class="sd-plan-p">' + av(k) + '<span>' + esc(TEC[k].n) + '</span></div>' + celdas;
    }).join('');
    S.bloques.forEach(function (b) { b.nuevo = false; });
    var prop = '';
    if (S.prop) {
      prop = '<div class="sd-ia is-nuevo" style="margin-top:12px"><div class="sd-ia-h">' + I.ia + esc(pl.prop) + (S.prop.ok ? '<span class="sd-pill sd-pill--ok"><i></i>' + esc(pl.aprobado) + '</span>' : '') + '</div><div class="sd-ia-b" style="display:grid;gap:10px">' +
        '<p style="margin:0;font-weight:600">' + S.prop.titulo + '</p><div><p class="sd-h-k" style="margin-bottom:4px">' + esc(pl.porque) + '</p><ul class="sd-sis-t" style="list-style:none;margin:0;padding:0;display:grid;gap:4px">' +
        S.prop.razones.map(function (r) { return '<li style="font-size:12.5px;display:flex;gap:8px"><span style="color:var(--sd-ia)">•</span>' + esc(r) + '</li>'; }).join('') + '</ul></div>' +
        (S.prop.ok ? '' : '<div><button type="button" class="sd-btn sd-btn--pri" data-a="aprobar">' + I.ok + esc(pl.aprobar) + '</button></div>') + '</div></div>';
    }
    return '<div class="sd-h"><div><p class="sd-h-k">' + esc(pl.k) + '</p><h3 class="sd-h-t">' + esc(pl.t) + '</h3><p class="sd-h-d">' + esc(pl.d) + '</p></div></div>' +
      '<div class="sd-plan" tabindex="0" role="region" aria-label="' + esc(app.t.pant.plan) + '"><div class="sd-plan-c">' + esc(pl.tec) + '</div>' + t.dias.map(function (d) { return '<div class="sd-plan-c">' + esc(d) + '</div>'; }).join('') + filas + '</div>' + prop;
  }

  function pMaterial(app) {
    var t = app.t, ma = t.ma, S = app.S, o = S.olmo;
    var mat = (o && o.material ? o.material : t.ot.material).map(function (m) {
      var ok = m[2] >= m[1];
      return '<li class="sd-fila" style="cursor:default;grid-template-columns:minmax(0,1fr) auto auto"><span class="sd-fila-t">' + esc(m[0]) + '</span><span class="sd-mono sd-t3">' + esc(ma.hay) + ': ' + m[2] + '</span>' + (ok ? '<span class="sd-pill sd-pill--ok">' + esc(ma.ok) + '</span>' : '<span class="sd-pill sd-pill--warn">' + esc(ma.falta) + '</span>') + '</li>';
    }).join('');
    var ped = S.pedidos.map(function (p) {
      return '<li class="sd-fila' + app.esNuevo(p.id) + '" style="cursor:default" data-k="' + p.id + '"><span class="sd-canal">' + I.camion + '</span><span style="min-width:0"><span class="sd-fila-t" style="display:block">' + esc(p.id) + ' · ' + esc(p.x) + '</span><span class="sd-fila-d" style="display:block">' + esc(p.prov) + '</span></span><span class="sd-fila-m">' + (p.tarde ? '<span class="sd-pill sd-pill--warn"><i></i>' + esc(ma.llega) + ' ' + esc(p.llega) + '</span>' : '<span class="sd-pill sd-pill--auto">' + esc(ma.llega) + ' ' + esc(p.llega) + '</span>') + '</span></li>';
    }).join('');
    return '<div class="sd-h"><div><p class="sd-h-k">' + esc(ma.k) + '</p><h3 class="sd-h-t">' + esc(ma.t) + '</h3><p class="sd-h-d">' + esc(ma.d) + '</p></div></div>' +
      '<div class="sd-grid2"><div class="sd-card"><div class="sd-card-h"><p class="sd-card-t">OT-2419 · ' + esc(t.ot.nombre) + '</p></div><ul class="sd-lista">' + mat + '</ul></div>' +
      '<div class="sd-card"><div class="sd-card-h"><p class="sd-card-t">' + esc(ma.pedidos) + '</p></div><ul class="sd-lista">' + ped + '</ul></div></div>';
  }

  function pPanel(app) {
    var t = app.t, p = t.pa;
    var kp = function (k, v, d) { return '<div class="sd-card sd-kpi"><p class="sd-kpi-k">' + esc(k) + '</p><p class="sd-kpi-v">' + v + '</p><p class="sd-kpi-d">' + d + '</p></div>'; };
    var barras = [11, 9, 12, 10, 2, 1, 1, 0.5];
    var g = barras.map(function (v, i) { return '<i class="' + (i < 4 ? 'is-a' : 'is-d') + '" style="height:' + Math.max(4, v / 12 * 100) + '%;animation-delay:' + (i * 60) + 'ms" title="' + v + '"></i>'; }).join('');
    var l = barras.map(function (v, i) { return '<span>' + p.gl + (i + 1) + '</span>'; }).join('');
    return '<div class="sd-h"><div><p class="sd-h-k">' + esc(p.k) + '</p><h3 class="sd-h-t">' + esc(p.t) + '</h3><p class="sd-h-d">' + esc(p.d) + '</p></div></div>' +
      '<div class="sd-kpis">' + kp(p.k1, app.en ? '96%' : '96 %', esc(p.k1d)) + kp(p.k2, '2 h', p.k2d) + kp(p.k3, '0', esc(p.k3d)) + kp(p.k4, '0', esc(p.k4d)) + '</div>' +
      '<div class="sd-grid2"><div class="sd-card"><div class="sd-card-h"><p class="sd-card-t">' + esc(p.g) + '</p><span class="sd-pill sd-pill--acc">' + esc(p.marca) + ': ' + p.gl + '5</span></div><div class="sd-card-b"><div class="sd-barras">' + g + '</div><div class="sd-barras-l">' + l + '</div></div></div>' +
      '<div class="sd-card sd-solo-esc"><div class="sd-card-h"><p class="sd-card-t">' + esc(app.u.act) + '</p></div><div class="sd-card-b" style="padding-top:4px"><ul class="sd-lista">' +
      app.S.act.slice(0, 4).map(function (a) { return '<li class="sd-check" style="align-items:flex-start"><span class="sd-mono sd-t3" style="flex:none">' + esc(a.h) + '</span><span style="font-size:12.5px">' + a.x + '</span></li>'; }).join('') + '</ul></div></div></div>';
  }

  /* ------------------------------------------------------ ACCIONES */
  function crearOlmo(app) {
    var t = app.t;
    app.S.olmo = { id: 'OT-2419', c: t.ot.cliente, n: t.ot.nombre, e: 'nueva', d: null, t: [], origen: t.ot.origen, tareas: t.ot.tareas.slice(), hechas: 1, avisos: [] };
    return app.S.olmo;
  }
  var acciones = {
    sel: function (app, id) { app.S.ui.sel = id; app.S.ui.hoja = true; app.nuevo('hoja'); app.refrescar(); },
    volver: function (app) { app.S.ui.hoja = false; app.refrescar(); },
    aprobar: function (app) {
      var S = app.S; if (!S.prop || S.prop.ok) return;
      S.prop.ok = true;
      S.bloques.forEach(function (b) { if (b.tipo === 'prop') { b.tipo = 'trab'; b.nuevo = true; } });
      app.actividad('persona', app.t.act.aprueba);
      app.refrescar();
    },
    simular: function (app) {
      app.flujo(function (a, dormir) {
        var p = a.S.pedidos[0];
        a.ir('material');
        p.tarde = true; p.llega = a.en ? 'Fri' : 'Vie'; a.refrescar();
        a.actividad('aviso', a.t.act.simula);
        return dormir(900).then(function () { a.actividad('ia', a.t.act.choque); });
      });
    }
  };

  function proponer(app, dia, razones, extra) {
    var S = app.S, t = app.t;
    S.bloques = S.bloques.filter(function (b) { return b.tipo !== 'prop'; });
    ['IR', 'MG'].forEach(function (k) { S.bloques.push({ tec: k, d: dia, x: 'Clínica Veterinaria Olmo', h: '8:00–14:00', tipo: 'prop', nuevo: true }); });
    if (extra) S.bloques.push(extra);
    S.prop = { titulo: (app.en ? 'Clínica Veterinaria Olmo · ' : 'Clínica Veterinaria Olmo · ') + t.dias[dia] + ' 8:00–14:00 · Iván R. + Marta G.', razones: razones, ok: false };
  }

  /* ------------------------------------------------------ LA HISTORIA */
  var pasos = [
    { narra: function (a) { return a.t.pasos[0]; }, pausa: 3000,
      hacer: function (app) { app.ir('trabajos'); return app.espera(600); } },
    { narra: function (a) { return a.t.pasos[1]; }, pausa: 1800,
      hacer: function (app) {
        app.toast(app.en ? 'Quote accepted' : 'Presupuesto aceptado', 'Clínica Veterinaria Olmo · P-1187', 'ok');
        app.actividad('entrada', app.t.act.llega);
        return app.espera(900).then(function () {
          var o = crearOlmo(app); app.nuevo(o.id); app.nuevo('hoja'); app.S.ui.sel = o.id; app.S.ui.hoja = true; app.refrescar();
          app.contador('trabajos', 1);
          app.actividad('auto', app.t.act.crea);
          var i = 1;
          function tarea() { if (i >= 5) return Promise.resolve(); app.nuevo('t' + i); i++; return app.espera(160).then(tarea); }
          return tarea();
        });
      } },
    { narra: function (a) { return a.t.pasos[2]; }, pausa: 2200,
      hacer: function (app) {
        var o = olmo(app), t = app.t;
        o.material = t.ot.material.map(function (m) { return m.slice(); });
        o.e = 'material'; app.nuevo('mat'); app.refrescar();
        app.mostrar(app.q('.sd-card:nth-of-type(2)'));
        app.actividad('aviso', app.t.act.falta);
        return app.espera(1300).then(function () {
          o.pedido = 'PC-332'; o.hechas = 2;
          app.S.pedidos.unshift({ id: 'PC-332', prov: t.ot.prov, x: app.en ? 'Outdoor unit 5 kW ×1' : 'Unidad exterior 5 kW ×1', llega: app.en ? 'Wed' : 'Mié' });
          app.refrescar();
          app.actividad('auto', app.t.act.pedido);
          return app.espera(900);
        }).then(function () { app.ir('material'); app.nuevo('PC-332'); app.refrescar(); });
      } },
    { narra: function (a) { return a.t.pasos[3]; }, pausa: 1600,
      hacer: function (app) {
        app.ir('plan');
        return app.espera(700).then(function () {
          proponer(app, 3, app.t.ot.razones); app.refrescar();
          app.actividad('ia', app.t.act.propone);
          return app.espera(1600);
        }).then(function () {
          app.mostrar(app.q('[data-a="aprobar"]'));
          return app.espera(400).then(function () { return app.cursor(app.q('[data-a="aprobar"]'), 300); });
        }).then(function () {
          var o = olmo(app); o.d = 3; o.t = ['IR', 'MG']; o.e = 'plan';
          acciones.aprobar(app);
        });
      } },
    { narra: function (a) { return a.t.pasos[4]; }, pausa: 2200,
      hacer: function (app) {
        var o = olmo(app);
        app.S.ui.sel = o.id; app.S.ui.hoja = true; app.ir('trabajos');
        return app.espera(700).then(function () {
          o.avisos.push(f(app.t.ot.wa, { d: app.en ? 'Thursday' : 'jueves' })); app.nuevo('wa'); app.refrescar();
          app.mostrar(app.q('.sd-bur--yo'));
          app.actividad('auto', app.t.act.wa);
        });
      } },
    { narra: function (a) { return a.t.pasos[5]; }, pausa: 1400,
      hacer: function (app) {
        var S = app.S, o = olmo(app);
        app.ir('material');
        return app.espera(600).then(function () {
          S.pedidos[0].tarde = true; S.pedidos[0].llega = app.en ? 'Fri' : 'Vie'; app.refrescar();
          app.actividad('aviso', app.t.act.retraso);
          return app.espera(1200);
        }).then(function () {
          app.ir('plan');
          S.bloques.forEach(function (b) { if (b.x === 'Clínica Veterinaria Olmo') b.tipo = 'aviso'; });
          app.refrescar();
          app.actividad('ia', app.t.act.choque);
          return app.espera(1400);
        }).then(function () {
          S.bloques = S.bloques.filter(function (b) { return b.x !== 'Clínica Veterinaria Olmo' && !(b.x === 'Panadería Brisa'); });
          proponer(app, 4, app.t.ot.razones2, { tec: 'OL', d: 3, x: 'Panadería Brisa', h: '8:00–10:00', tipo: 'prop', nuevo: true });
          app.refrescar();
          app.actividad('ia', app.t.act.reorg);
          return app.espera(1600);
        }).then(function () {
          app.mostrar(app.q('[data-a="aprobar"]'));
          return app.espera(400).then(function () { return app.cursor(app.q('[data-a="aprobar"]'), 300); });
        }).then(function () {
          o.d = 4;
          acciones.aprobar(app);
          S.bloques.forEach(function (b) { if (b.x === 'Panadería Brisa') b.tipo = 'mant'; });
          app.refrescar();
          o.avisos.push(f(app.t.ot.wa, { d: app.en ? 'Friday' : 'viernes' }));
          app.actividad('auto', app.t.act.reorgOk);
        });
      } },
    { narra: function (a) { return a.t.pasos[6]; }, pausa: 1200,
      hacer: function (app) {
        var o = olmo(app);
        app.S.diaTxt = app.t.dias[4]; app.S.reloj = 8 * 60 + 12;
        o.e = 'curso'; o.tel = true; o.hechas = 2;
        app.S.ui.sel = o.id; app.S.ui.hoja = true; app.nuevo('tel'); app.ir('trabajos');
        return app.espera(500).then(function () {
          app.mostrar(app.q('.sd-tel'));
          function tick() {
            if (o.hechas >= 4) return Promise.resolve();
            o.hechas++; app.refrescar(); app.mostrar(app.q('.sd-tel'));
            return app.espera(900).then(tick);
          }
          return tick();
        }).then(function () {
          o.fotos = true; app.refrescar(); return app.espera(900);
        }).then(function () {
          o.firma = 1; app.refrescar(); app.mostrar(app.q('.sd-tel'));
          return app.espera(80).then(function () { o.firma = 2; var p = app.q('.sd-tel path'); if (p) p.style.strokeDashoffset = '0'; return app.espera(1500); });
        }).then(function () {
          o.hechas = 5; o.e = 'hecha'; app.pasa(340); app.refrescar();
          app.actividad('ok', app.t.act.parte);
        });
      } },
    { narra: function (a) { return a.t.pasos[7]; }, pausa: 2400,
      hacer: function (app) {
        var o = olmo(app);
        return app.espera(700).then(function () { app.actividad('auto', app.t.act.factura); o.e = 'fact'; app.refrescar(); return app.espera(900); })
          .then(function () { app.actividad('auto', app.t.act.revision); return app.espera(800); })
          .then(function () { app.actividad('auto', app.t.act.encuesta); });
      } },
    { narra: function (a) { return a.t.pasos[8]; }, pausa: 7000,
      hacer: function (app) { app.S.ui.hoja = false; app.ir('panel'); return app.espera(400); } }
  ];

  SD.registrar('operaciones', {
    textos: T,
    estado: estado,
    pantallas: [
      { id: 'trabajos', icono: 'llave', html: pTrabajos },
      { id: 'plan', icono: 'agenda', html: pPlan },
      { id: 'material', icono: 'caja', html: pMaterial },
      { id: 'panel', icono: 'panel', html: pPanel }
    ],
    acciones: acciones,
    pasos: pasos
  });
})();
