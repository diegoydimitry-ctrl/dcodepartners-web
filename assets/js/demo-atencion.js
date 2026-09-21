/* ============================================================================
   SISTEMA DE EJEMPLO · ATENCIÓN AL CLIENTE
   ----------------------------------------------------------------------------
   Arvena Climatización (inventada) otra vez. Aquí se ve el asistente que
   atiende el teléfono, el correo y el WhatsApp con los datos de la empresa:
   contesta lo que sabe, reserva lo que puede y pasa a una persona lo
   delicado, con el resumen hecho.

     1  Todo llega a una bandeja; el asistente contesta primero.
     2  Entra una llamada: identifica al cliente por el número.
     3  Entiende la avería, mira su contrato y ofrece huecos reales.
     4  Reserva la cita, deja el parte previo y confirma por WhatsApp.
     5  Un correo pide una factura: la busca en Finance y la envía.
     6  Una queja: no la contesta sola. La pasa a una persona con resumen.
     7  Qué sabe y qué no hace: sus fuentes y sus límites.
     8  Pregúntale tú.
     9  El panel.
   ========================================================================= */
(function () {
  'use strict';
  var SD = window.SD, I = SD.I, esc = SD.esc;
  function f(s, o) { return s.replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? o[k] : m; }); }

  var T = {
    es: {
      app: 'Atención al cliente', empresa: 'Arvena Climatización', yo: { n: 'Nuria S.', ini: 'NS' },
      navK: 'Clientes', pieT: 'Sistema de ejemplo', pieD: 'Empresa ficticia de climatización. Así funcionaría en la tuya.',
      pant: { bandeja: 'Bandeja', pregunta: 'Pregúntale', saber: 'Lo que sabe', panel: 'Panel' },
      tipos: { ia: 'IA', auto: 'Automático', ok: 'Hecho', aviso: 'Aviso', persona: 'Persona', entrada: 'Entrada' },
      canal: { tel: 'Llamada', correo: 'Correo', wa: 'WhatsApp', web: 'Chat web' },
      est: { sola: 'Resuelta sola', persona: 'Con una persona', curso: 'En curso', espera: 'Esperando' },
      b: { k: 'Todos los canales', t: 'Bandeja', d: 'Teléfono, correo, WhatsApp y chat en un solo sitio. El asistente contesta primero.',
        vivo: 'Llamada en curso', ident: 'Identificado por el número', hecho: 'Lo que ha hecho el asistente', resumen: 'Resumen para la persona', sugerida: 'Respuesta sugerida',
        enviar: 'Enviar', editar: 'Editar', enviada: 'Enviada por Nuria', adjunto: 'Adjunto', volver: 'Bandeja', asis: 'Asistente', prio: 'Prioridad alta' },
      q: { k: 'Pruébalo', t: 'Pregúntale', d: 'Escríbele como lo haría un cliente de Arvena. Contesta con los datos ficticios de la demo.',
        ph: 'Escribe una pregunta…', enviar: 'Enviar', aviso: 'Asistente de demostración: sus respuestas salen de los datos inventados de Arvena.',
        sug: ['¿Me mandáis la factura de marzo?', 'El aire no enfría, ¿podéis venir?', '¿Cuánto cuesta instalar un aire?', '¿Abrís el sábado?'],
        hola: 'Hola, soy el asistente de Arvena Climatización. Puedo buscar facturas, dar citas y contarte lo que tienes contratado. Lo que no sé, lo paso a una persona.' },
      s: { k: 'Sus fuentes y sus límites', t: 'Lo que sabe', d: 'Contesta con los datos de la empresa. Si no están ahí, no se los inventa.',
        fk: 'De dónde saca las respuestas', lk: 'Lo que no hace nunca',
        fuentes: [['Clientes, contratos y equipos instalados', 'Operaciones', 'doc'], ['Facturas y cobros', 'Finance', 'euro'], ['Agenda de los técnicos', 'Operaciones', 'agenda'], ['Preguntas frecuentes aprobadas por la empresa', '42 respuestas', 'libro']],
        limites: ['Dar precios de trabajos nuevos: eso lo hace una persona después de ver la instalación.', 'Dar un diagnóstico definitivo por teléfono.', 'Prometer fechas que la agenda no tiene.', 'Seguir hablando con alguien que está enfadado: pasa a una persona.'] },
      p: { k: 'Este mes', t: 'Panel de atención', d: 'Salido de la propia bandeja.',
        k1: 'Resueltas sin esperar', k1d: 'facturas, citas y dudas de siempre', k2: 'Primera respuesta', k2d: 'antes del sistema: <b>4 horas</b>', k3: 'Pasadas a una persona', k3d: 'todas con el resumen hecho', k4: 'Llamadas fuera de horario', k4d: 'atendidas y con cita',
        g: 'Llamadas que interrumpen a un técnico, por semana', gl: 'sem', marca: 'Sistema en marcha' },
      pasos: [
        'A <b>Arvena Climatización</b> (inventada) le llegan llamadas, correos y WhatsApp. Todo cae aquí y <b>el asistente contesta primero</b>.',
        'Entra una llamada. <b>El asistente la coge</b> y reconoce el número: es el Restaurante Casa Brenda, con contrato de mantenimiento.',
        'Entiende la avería, mira su equipo y su contrato, y <b>ofrece huecos reales</b> de la agenda de los técnicos.',
        'Reserva la cita, deja al técnico <b>un parte previo con el diagnóstico</b> y manda la confirmación por WhatsApp. Nadie del equipo se ha levantado de la silla.',
        'Un correo pide la factura de marzo. <b>La busca en Finance y la envía</b> a su titular. Resuelto en 40 segundos.',
        'Llega una queja. <b>Esta no la contesta sola</b>: la pasa a Nuria con el historial, el resumen y una respuesta sugerida. Contesta una persona.',
        'Qué sabe y qué no hace: <b>contesta con los datos de la empresa</b> y, lo que no está ahí, no se lo inventa.',
        'Y ahora, <b>pregúntale tú</b>. Lo que sabe, lo contesta con datos; lo que no, lo pasa a una persona.',
        'Resultado: <b>los técnicos dejan de coger el teléfono</b> y nadie espera horas una respuesta. Toca lo que quieras: la demo es tuya.'
      ],
      llamada: [
        ['ia', 'Arvena Climatización, buenos días. Soy el asistente automático. ¿En qué te ayudo?'],
        ['el', 'Hola, el aire del comedor no enfría y en la pantalla sale un E4.'],
        ['ia', 'Veo que sois el Restaurante Casa Brenda y tenéis contrato de mantenimiento. El E4 suele indicar un problema de presión: mejor no reiniciarlo más. Puede ir un técnico mañana a las 9:00 o a las 12:30. ¿Qué os viene mejor?'],
        ['el', 'A las 9, antes de abrir.'],
        ['ia', 'Hecho: mañana a las 9:00 con Iván. Os llega la confirmación por WhatsApp. ¿Algo más?'],
        ['el', 'Nada más, gracias.']
      ],
      pasosLlamada: ['Cliente reconocido: Restaurante Casa Brenda', 'Contrato de mantenimiento y equipo de conductos 10 kW (2023)', 'Hueco reservado: mañana 9:00 con Iván R.', 'Parte previo creado con el diagnóstico', 'Confirmación enviada por WhatsApp'],
      correo: { q: 'Academia Linde', a: '¿Me podéis mandar la factura de marzo?', msg: 'Hola, ¿me podéis mandar la factura de marzo? La necesita nuestra gestoría. Gracias.',
        resp: 'Hola: te adjunto la factura de marzo, <b>F-2026-0211</b>. Si necesitas cualquier otra, pídela por aquí mismo. Un saludo, Arvena Climatización.', adj: 'F-2026-0211.pdf' },
      queja: { q: 'Hostal Rúa Verde', a: 'Es la segunda vez este mes', msg: 'Es la segunda vez este mes que se para la máquina. Así no se puede trabajar.',
        resumen: ['Segunda avería en 30 días: el compresor se cambió la semana pasada (OT-2408).', 'Cliente molesto. Tiene 12 habitaciones y temporada alta.', 'La reparación está en garantía.'],
        sug: 'Hola, soy Nuria, de Arvena. Tienes toda la razón y lo siento. Mañana a primera hora va Iván a revisarlo, en garantía y sin coste. Te llamo yo misma después para contarte qué ha pasado.' },
      act: {
        llamada: 'Llamada entrante de <b>+34 600 000 000</b>', ident: 'Cliente reconocido: <b>Restaurante Casa Brenda</b>', cita: 'Cita reservada: <b>mañana 9:00</b> con Iván R.',
        parte: 'Parte previo creado en Operaciones con el diagnóstico', wa: 'Confirmación enviada por <b>WhatsApp</b>', fin: 'Llamada resuelta sin pasar a nadie · <b>2 min 14 s</b>',
        correo: 'Correo de <b>Academia Linde</b>: pide una factura', busca: 'Factura <b>F-2026-0211</b> encontrada en Finance', envia: 'Factura enviada a su titular · <b>40 s</b>',
        queja: 'WhatsApp de <b>Hostal Rúa Verde</b>: queja, prioridad alta', pasa: 'Pasado a <b>Nuria S.</b> con historial y resumen', responde: 'Nuria responde al cliente', garantia: 'Revisión en garantía creada en Operaciones',
        pregunta: 'Pregunta desde la demo', persona: 'Pasado a una persona'
      },
      conv: [
        { id: 'c1', canal: 'web', q: 'Marta R.', a: '¿Hacéis revisiones de aire en casa?', est: 'sola', hace: '09:12' },
        { id: 'c2', canal: 'correo', q: 'Panadería Brisa', a: 'Cambio de fecha de la revisión', est: 'sola', hace: '09:40' },
        { id: 'c3', canal: 'wa', q: 'Oficinas Tavira Legal', a: 'Dudas sobre el presupuesto', est: 'persona', hace: '10:05' }
      ]
    },
    en: {
      app: 'Customer service', empresa: 'Arvena Climatización', yo: { n: 'Nuria S.', ini: 'NS' },
      navK: 'Customers', pieT: 'Example system', pieD: 'A fictional air-conditioning company. This is how it would work in yours.',
      pant: { bandeja: 'Inbox', pregunta: 'Ask it', saber: 'What it knows', panel: 'Dashboard' },
      tipos: { ia: 'AI', auto: 'Automatic', ok: 'Done', aviso: 'Alert', persona: 'Person', entrada: 'Incoming' },
      canal: { tel: 'Call', correo: 'Email', wa: 'WhatsApp', web: 'Web chat' },
      est: { sola: 'Solved on its own', persona: 'With a person', curso: 'In progress', espera: 'Waiting' },
      b: { k: 'Every channel', t: 'Inbox', d: 'Phone, email, WhatsApp and chat in one place. The assistant answers first.',
        vivo: 'Call in progress', ident: 'Recognised by the number', hecho: 'What the assistant did', resumen: 'Summary for the person', sugerida: 'Suggested reply',
        enviar: 'Send', editar: 'Edit', enviada: 'Sent by Nuria', adjunto: 'Attachment', volver: 'Inbox', asis: 'Assistant', prio: 'High priority' },
      q: { k: 'Try it', t: 'Ask it', d: 'Write to it the way an Arvena customer would. It answers with the demo’s fictional data.',
        ph: 'Type a question…', enviar: 'Send', aviso: 'Demo assistant: its answers come from Arvena’s made-up data.',
        sug: ['Can you send me March’s invoice?', 'The AC isn’t cooling, can you come?', 'How much is it to install AC?', 'Are you open on Saturday?'],
        hola: 'Hi, I’m Arvena Climatización’s assistant. I can find invoices, book appointments and tell you what you have under contract. Whatever I don’t know, I pass to a person.' },
      s: { k: 'Its sources and its limits', t: 'What it knows', d: 'It answers with the company’s data. If it isn’t there, it doesn’t make it up.',
        fk: 'Where its answers come from', lk: 'What it never does',
        fuentes: [['Customers, contracts and installed units', 'Operations', 'doc'], ['Invoices and payments', 'Finance', 'euro'], ['Technicians’ schedule', 'Operations', 'agenda'], ['FAQs approved by the company', '42 answers', 'libro']],
        limites: ['Price new jobs: a person does that after seeing the site.', 'Give a final diagnosis over the phone.', 'Promise dates the schedule doesn’t have.', 'Keep talking to someone who is upset: it hands over to a person.'] },
      p: { k: 'This month', t: 'Customer service dashboard', d: 'Straight from the inbox itself.',
        k1: 'Solved without waiting', k1d: 'invoices, appointments and the usual questions', k2: 'First reply', k2d: 'before the system: <b>4 hours</b>', k3: 'Handed to a person', k3d: 'all with the summary ready', k4: 'Out-of-hours calls', k4d: 'answered and booked',
        g: 'Calls interrupting a technician, per week', gl: 'wk', marca: 'System live' },
      pasos: [
        '<b>Arvena Climatización</b> (made up) gets calls, emails and WhatsApps. It all lands here and <b>the assistant answers first</b>.',
        'A call comes in. <b>The assistant picks up</b> and recognises the number: it’s Restaurante Casa Brenda, with a maintenance contract.',
        'It understands the fault, checks their unit and contract, and <b>offers real slots</b> from the technicians’ schedule.',
        'It books the visit, leaves the technician <b>a pre-visit note with the diagnosis</b> and sends the confirmation on WhatsApp. Nobody on the team got up from their chair.',
        'An email asks for March’s invoice. <b>It finds it in Finance and sends it</b> to the account holder. Solved in 40 seconds.',
        'A complaint comes in. <b>It doesn’t answer this one alone</b>: it hands it to Nuria with the history, a summary and a suggested reply. A person answers.',
        'What it knows and what it won’t do: <b>it answers with the company’s data</b> and doesn’t make up what isn’t there.',
        'Now <b>ask it yourself</b>. What it knows, it answers with data; what it doesn’t, it passes to a person.',
        'The result: <b>technicians stop answering the phone</b> and nobody waits hours for a reply. Try anything you like: the demo is yours.'
      ],
      llamada: [
        ['ia', 'Arvena Climatización, good morning. I’m the automated assistant. How can I help?'],
        ['el', 'Hi, the AC in the dining room isn’t cooling and the display shows E4.'],
        ['ia', 'I can see you’re Restaurante Casa Brenda and you have a maintenance contract. E4 usually means a pressure problem, so best not to restart it again. A technician can come tomorrow at 9:00 or 12:30. Which works better?'],
        ['el', 'At 9, before we open.'],
        ['ia', 'Done: tomorrow at 9:00 with Iván. You’ll get the confirmation on WhatsApp. Anything else?'],
        ['el', 'No, that’s all, thanks.']
      ],
      pasosLlamada: ['Customer recognised: Restaurante Casa Brenda', 'Maintenance contract and 10 kW ducted unit (2023)', 'Slot booked: tomorrow 9:00 with Iván R.', 'Pre-visit note created with the diagnosis', 'Confirmation sent on WhatsApp'],
      correo: { q: 'Academia Linde', a: 'Can you send me March’s invoice?', msg: 'Hi, could you send me March’s invoice? Our accountant needs it. Thanks.',
        resp: 'Hi, here is March’s invoice, <b>F-2026-0211</b>. If you need any other, just ask here. Best regards, Arvena Climatización.', adj: 'F-2026-0211.pdf' },
      queja: { q: 'Hostal Rúa Verde', a: 'Second time this month', msg: 'This is the second time this month the unit has stopped. We can’t work like this.',
        resumen: ['Second breakdown in 30 days: the compressor was replaced last week (OT-2408).', 'Upset customer. 12 rooms and high season.', 'The repair is under warranty.'],
        sug: 'Hi, this is Nuria from Arvena. You’re absolutely right and I’m sorry. Iván will be there first thing tomorrow to check it, under warranty and at no cost. I’ll call you myself afterwards to explain what happened.' },
      act: {
        llamada: 'Incoming call from <b>+34 600 000 000</b>', ident: 'Customer recognised: <b>Restaurante Casa Brenda</b>', cita: 'Visit booked: <b>tomorrow 9:00</b> with Iván R.',
        parte: 'Pre-visit note created in Operations with the diagnosis', wa: 'Confirmation sent on <b>WhatsApp</b>', fin: 'Call solved without handing over · <b>2 min 14 s</b>',
        correo: 'Email from <b>Academia Linde</b>: asks for an invoice', busca: 'Invoice <b>F-2026-0211</b> found in Finance', envia: 'Invoice sent to the account holder · <b>40 s</b>',
        queja: 'WhatsApp from <b>Hostal Rúa Verde</b>: complaint, high priority', pasa: 'Handed to <b>Nuria S.</b> with history and summary', responde: 'Nuria replies to the customer', garantia: 'Warranty visit created in Operations',
        pregunta: 'Question from the demo', persona: 'Handed to a person'
      },
      conv: [
        { id: 'c1', canal: 'web', q: 'Marta R.', a: 'Do you service home AC units?', est: 'sola', hace: '09:12' },
        { id: 'c2', canal: 'correo', q: 'Panadería Brisa', a: 'Changing the service date', est: 'sola', hace: '09:40' },
        { id: 'c3', canal: 'wa', q: 'Oficinas Tavira Legal', a: 'Questions about the quote', est: 'persona', hace: '10:05' }
      ]
    }
  };

  /* Respuestas del «Pregúntale»: palabras clave → respuesta. Es una demo:
     no hay modelo detrás, y lo dice. Lo que no reconoce, lo pasa a una
     persona, que es exactamente lo que haría el sistema de verdad. */
  var RESP = {
    es: [
      [/factura|recibo|pdf/i, 'Claro. La de marzo es la <b>F-2026-0211</b> (312,40 €). Te la envío ahora al correo que tenemos de tu empresa.', 'ok'],
      [/enfr[ií]a|aver[ií]a|no funciona|t[eé]cnico|venir|e4|gotea|agua/i, 'Lo siento. Puedo mandarte un técnico <b>mañana a las 9:00 o a las 12:30</b>. ¿Cuál te viene mejor? Mientras, mejor no reiniciar el equipo.', 'ok'],
      [/precio|cu[aá]nto|cuesta|presupuesto|tarifa/i, 'Los precios de trabajos nuevos <b>los da una persona</b> después de ver la instalación, para no darte una cifra que luego cambie. ¿Te llamamos hoy?', 'persona'],
      [/s[aá]bado|domingo|horario|abr[ií]s|abierto|hora/i, 'De lunes a viernes, de 8:00 a 18:00. Las urgencias de clientes con contrato se atienden también <b>los sábados de 9:00 a 14:00</b>.', 'ok'],
      [/mantenimiento|revisi[oó]n|contrato/i, 'Tienes <b>contrato de mantenimiento</b> con dos revisiones al año. La próxima está prevista para dentro de tres meses. ¿Quieres adelantarla?', 'ok'],
      [/queja|harto|enfad|fatal|mal servicio|reclam/i, 'Lo siento de verdad. <b>Te paso con Nuria</b>, que lleva tu cuenta; ya tiene el resumen de lo que ha pasado y te contesta enseguida.', 'persona'],
      [/hola|buenas|gracias/i, '¡Hola! Pregúntame por una factura, una cita o lo que tienes contratado.', 'ok']
    ],
    en: [
      [/invoice|receipt|pdf|bill/i, 'Of course. March’s is <b>F-2026-0211</b> (€312.40). I’m sending it now to your company’s email on file.', 'ok'],
      [/cool|broken|not working|technician|come|e4|leak|water|fault/i, 'Sorry about that. I can send a technician <b>tomorrow at 9:00 or 12:30</b>. Which suits you? In the meantime, best not to restart the unit.', 'ok'],
      [/price|how much|cost|quote|rate/i, 'Prices for new jobs <b>are given by a person</b> after seeing the site, so we don’t give you a figure that changes later. Shall we call you today?', 'persona'],
      [/saturday|sunday|hours|open|time/i, 'Monday to Friday, 8:00 to 18:00. Emergencies for contract customers are also covered <b>on Saturdays from 9:00 to 14:00</b>.', 'ok'],
      [/maintenance|service|contract/i, 'You have a <b>maintenance contract</b> with two services a year. The next one is due in three months. Would you like to bring it forward?', 'ok'],
      [/complain|fed up|angry|terrible|awful|bad service/i, 'I’m really sorry. <b>I’m passing you to Nuria</b>, who looks after your account; she already has a summary of what happened and will reply shortly.', 'persona'],
      [/hello|hi\b|hey|thanks/i, 'Hi! Ask me about an invoice, an appointment or what you have under contract.', 'ok']
    ]
  };
  var NO_SE = {
    es: 'Eso prefiero que te lo confirme <b>una persona</b>, para no decirte algo que no sé seguro. ¿Te llamamos o te escribimos?',
    en: 'I’d rather <b>a person</b> confirmed that, so I don’t tell you something I’m not sure of. Shall we call or write to you?'
  };

  function estado(app) {
    var t = app.t;
    return {
      ui: { p: 'bandeja', sel: 'c1', hoja: false, n: 0, c: {} },
      reloj: 10 * 60 + 18,
      act: [
        { t: 'ok', x: app.en ? 'Web chat from <b>Marta R.</b> solved on its own' : 'Chat web de <b>Marta R.</b> resuelto solo', s: '', h: '09:12', k: 'a-2' },
        { t: 'persona', x: app.en ? '<b>Oficinas Tavira Legal</b> handed to Laura M.' : '<b>Oficinas Tavira Legal</b> pasado a Laura M.', s: '', h: '10:05', k: 'a-1' }
      ],
      convs: t.conv.map(function (c) { return JSON.parse(JSON.stringify(c)); }),
      llamada: null, correo: null, queja: null,
      chat: [{ de: 'ia', x: t.q.hola }], escribe: false
    };
  }
  function conv(app, id) {
    var S = app.S;
    if (S.llamada && S.llamada.id === id) return S.llamada;
    if (S.correo && S.correo.id === id) return S.correo;
    if (S.queja && S.queja.id === id) return S.queja;
    for (var i = 0; i < S.convs.length; i++) if (S.convs[i].id === id) return S.convs[i];
    return null;
  }
  function pillEst(app, e) {
    var cls = { sola: 'sd-pill--ok', persona: 'sd-pill--acc', curso: 'sd-pill--ia', espera: 'sd-pill--warn' }[e] || '';
    return '<span class="sd-pill ' + cls + '"><i></i>' + esc(app.t.est[e]) + '</span>';
  }

  /* ------------------------------------------------------ PANTALLAS */
  function pBandeja(app) {
    var t = app.t, b = t.b, S = app.S;
    var lista = [S.queja, S.correo, S.llamada].filter(Boolean).concat(S.convs);
    var filas = lista.map(function (c) {
      return '<li><button type="button" class="sd-fila' + (S.ui.sel === c.id ? ' is-sel' : '') + app.esNuevo(c.id) + '" data-a="sel" data-v="' + c.id + '" data-k="' + c.id + '">' +
        '<span class="sd-canal">' + I[c.canal] + '</span><span style="min-width:0"><span class="sd-fila-t" style="display:block">' + esc(c.q) + '</span><span class="sd-fila-d" style="display:block">' + esc(c.a) + '</span></span>' +
        '<span class="sd-fila-m">' + pillEst(app, c.est) + '<span class="sd-mono sd-t3">' + esc(c.hace) + '</span></span></button></li>';
    }).join('');
    var sel = conv(app, S.ui.sel);
    return '<div class="sd-h"><div><p class="sd-h-k">' + esc(b.k) + '</p><h3 class="sd-h-t">' + esc(b.t) + '</h3><p class="sd-h-d">' + esc(b.d) + '</p></div></div>' +
      '<div class="sd-split' + (S.ui.hoja ? ' is-hoja' : '') + '"><div class="sd-card"><ul class="sd-lista">' + filas + '</ul></div>' +
      '<div class="sd-hoja' + (app.nuevos.hoja ? ' is-abre' : '') + '"><button type="button" class="sd-btn sd-volver" data-a="volver">← ' + esc(b.volver) + '</button>' + (sel ? detalle(app, sel) : '') + '</div></div>';
  }

  function detalle(app, c) {
    var t = app.t, b = t.b, h = '';
    h += '<div class="sd-card"><div class="sd-card-h"><div style="display:flex;gap:10px;align-items:center;min-width:0"><span class="sd-canal">' + I[c.canal] + '</span><div style="min-width:0"><p class="sd-card-t">' + esc(c.q) + '</p><p class="sd-t3" style="margin:2px 0 0;font-size:12px">' + esc(t.canal[c.canal]) + ' · ' + esc(c.hace) + '</p></div></div>' + pillEst(app, c.est) + '</div>';
    if (c.tipo === 'llamada') {
      h += '<div class="sd-card-b">' + (c.ident ? '<div class="sd-regla' + app.esNuevo('ident') + '" style="margin-bottom:10px">' + I.persona + '<span><b>' + esc(b.ident) + '</b> · Restaurante Casa Brenda</span></div>' : '') +
        '<div class="sd-chat">' + c.lineas.map(function (l, i) {
          return '<div class="sd-bur ' + (l[0] === 'ia' ? 'sd-bur--ia' : 'sd-bur--el') + app.esNuevo('l' + i) + '"><span class="sd-bur-k">' + esc(l[0] === 'ia' ? b.asis : c.q) + '</span>' + esc(l[1]) + '</div>';
        }).join('') + (c.escribe ? '<span class="sd-escribe" aria-hidden="true" style="align-self:' + (c.escribe === 'ia' ? 'flex-end' : 'flex-start') + '"><i></i><i></i><i></i></span>' : '') + '</div></div></div>';
      if (c.hechos && c.hechos.length) {
        h += '<div class="sd-card" style="margin-top:10px"><div class="sd-card-h"><p class="sd-card-t">' + esc(b.hecho) + '</p></div><div class="sd-card-b" style="padding-top:4px">' +
          c.hechos.map(function (x, i) { return '<div class="sd-check is-ok' + app.esNuevo('h' + i) + '"><span class="sd-caja" aria-hidden="true"></span><span>' + esc(x) + '</span></div>'; }).join('') + '</div></div>';
      }
      return h;
    }
    if (c.tipo === 'correo') {
      var cc = t.correo;
      h += '<div class="sd-card-b"><div class="sd-chat"><div class="sd-bur sd-bur--el"><span class="sd-bur-k">' + esc(c.q) + '</span>' + esc(cc.msg) + '</div>' +
        (c.fase >= 2 ? '<div class="sd-bur sd-bur--ia' + app.esNuevo('resp') + '"><span class="sd-bur-k">' + esc(b.asis) + '</span>' + cc.resp + '<span style="display:flex;align-items:center;gap:6px;margin-top:8px;padding:6px 8px;border-radius:8px;background:rgba(255,255,255,.6);font-size:12px;font-weight:600">' + I.doc.replace('<svg', '<svg style="width:14px;height:14px"') + esc(cc.adj) + '</span></div>' : '') +
        '</div></div></div>';
      if (c.fase >= 1) h += '<div class="sd-regla' + app.esNuevo('busca') + '" style="margin-top:10px">' + I.euro + '<span><b>Finance</b> · F-2026-0211 · ' + (app.en ? 'March' : 'marzo') + '</span></div>';
      return h;
    }
    if (c.tipo === 'queja') {
      var q = t.queja;
      h += '<div class="sd-card-b"><div class="sd-chat"><div class="sd-bur sd-bur--el"><span class="sd-bur-k">' + esc(c.q) + '</span>' + esc(q.msg) + '</div>' +
        (c.enviada ? '<div class="sd-bur sd-bur--yo' + app.esNuevo('env') + '"><span class="sd-bur-k">Nuria S.</span>' + esc(q.sug) + '</div>' : '') + '</div></div></div>';
      if (c.fase >= 1) {
        h += '<div class="sd-ia' + app.esNuevo('res') + '" style="margin-top:10px"><div class="sd-ia-h">' + I.ia + esc(b.resumen) + '<span class="sd-pill sd-pill--bad"><i></i>' + esc(b.prio) + '</span></div><div class="sd-ia-b"><ul style="margin:0;padding-left:18px;display:grid;gap:4px;font-size:13px">' +
          q.resumen.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></div></div>';
      }
      if (c.fase >= 2 && !c.enviada) {
        h += '<div class="sd-card' + app.esNuevo('sug') + '" style="margin-top:10px"><div class="sd-card-h"><p class="sd-card-t">' + esc(b.sugerida) + '</p><div style="display:flex;gap:6px"><button type="button" class="sd-btn">' + esc(b.editar) + '</button><button type="button" class="sd-btn sd-btn--pri" data-a="enviarQueja">' + I.wa + esc(b.enviar) + '</button></div></div>' +
          '<div class="sd-card-b"><p class="sd-msg" style="margin:0">' + esc(q.sug) + '</p></div></div>';
      }
      if (c.enviada) h += '<div class="sd-regla" style="margin-top:10px">' + I.persona + '<span><b>' + esc(b.enviada) + '</b></span></div>';
      return h;
    }
    h += '<div class="sd-card-b"><div class="sd-chat"><div class="sd-bur sd-bur--el"><span class="sd-bur-k">' + esc(c.q) + '</span>' + esc(c.a) + '</div></div></div></div>';
    return h;
  }

  function pPregunta(app) {
    var q = app.t.q, S = app.S;
    var chat = S.chat.map(function (m, i) {
      return '<div class="sd-bur ' + (m.de === 'yo' ? 'sd-bur--yo' : 'sd-bur--ia') + app.esNuevo('m' + i) + '"' + (m.de === 'ia' ? ' style="align-self:flex-start"' : '') + '>' + (m.de === 'ia' ? '<span class="sd-bur-k">' + esc(app.t.b.asis) + '</span>' : '') + m.x +
        (m.persona ? '<span class="sd-pill sd-pill--acc" style="margin-top:6px">' + I.persona.replace('<svg', '<svg style="width:12px;height:12px"') + esc(app.t.act.persona) + '</span>' : '') + '</div>';
    }).join('') + (S.escribe ? '<span class="sd-escribe" aria-hidden="true"><i></i><i></i><i></i></span>' : '');
    return '<div class="sd-h"><div><p class="sd-h-k">' + esc(q.k) + '</p><h3 class="sd-h-t">' + esc(q.t) + '</h3><p class="sd-h-d">' + esc(q.d) + '</p></div></div>' +
      '<div class="sd-card"><div class="sd-card-b" style="min-height:250px"><div class="sd-chat" role="log" aria-live="polite">' + chat + '</div></div>' +
      '<div class="sd-card-b" style="border-top:1px solid var(--sd-b);display:grid;grid-template-columns:minmax(0,1fr);gap:10px">' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap">' + q.sug.map(function (s, i) { return '<button type="button" class="sd-btn sd-sug" data-a="sug" data-v="' + i + '">' + esc(s) + '</button>'; }).join('') + '</div>' +
        '<form data-preg style="display:flex;gap:8px"><label class="sd-sr" for="sd-preg-' + app.lang + '">' + esc(q.ph) + '</label><input id="sd-preg-' + app.lang + '" type="text" maxlength="160" autocomplete="off" placeholder="' + esc(q.ph) + '" style="flex:1 1 0;width:0;min-width:0;height:44px;padding:0 12px;border-radius:8px;border:1px solid #83868f;font:inherit;color:inherit;background:#fff"><button type="submit" class="sd-btn sd-btn--pri" style="min-height:44px">' + esc(q.enviar) + '</button></form>' +
        '<p class="sd-t3" style="margin:0;font-size:12px">' + esc(q.aviso) + '</p></div></div>';
  }
  function trasPregunta(app) {
    var form = app.main.querySelector('[data-preg]');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var inp = form.querySelector('input'), v = (inp.value || '').trim();
      if (!v) return;
      preguntar(app, v, true);
    });
    var log = app.main.querySelector('.sd-chat');
    var card = log && log.parentElement;
    if (card && card.scrollHeight > card.clientHeight) card.scrollTop = card.scrollHeight;
  }
  function responder(app, texto) {
    var lista = RESP[app.lang];
    for (var i = 0; i < lista.length; i++) if (lista[i][0].test(texto)) return { x: lista[i][1], persona: lista[i][2] === 'persona' };
    return { x: NO_SE[app.lang], persona: true };
  }
  function preguntar(app, texto, porUsuario) {
    var S = app.S;
    var run = function (a, esperar) {
      S.chat.push({ de: 'yo', x: esc(texto) }); a.nuevo('m' + (S.chat.length - 1)); S.escribe = true;
      if (S.chat.length > 9) S.chat.splice(1, 2);
      a.refrescar(); a.mostrar(a.main.querySelector('.sd-escribe'));
      return esperar(900).then(function () {
        var r = responder(a, texto);
        S.escribe = false; S.chat.push({ de: 'ia', x: r.x, persona: r.persona }); a.nuevo('m' + (S.chat.length - 1));
        a.refrescar(); a.mostrar(a.main.querySelector('.sd-bur:last-of-type'));
        a.actividad(r.persona ? 'persona' : 'ia', esc(a.t.act.pregunta) + ': «' + esc(texto.slice(0, 60)) + '»', r.persona ? a.t.act.persona : '');
      });
    };
    if (porUsuario) app.flujo(run);
    else return run(app, function (ms) { return app.espera(ms); });
  }

  function pSaber(app) {
    var s = app.t.s;
    return '<div class="sd-h"><div><p class="sd-h-k">' + esc(s.k) + '</p><h3 class="sd-h-t">' + esc(s.t) + '</h3><p class="sd-h-d">' + esc(s.d) + '</p></div></div>' +
      '<div class="sd-grid2"><div class="sd-card"><div class="sd-card-h"><p class="sd-card-t">' + esc(s.fk) + '</p></div><ul class="sd-lista">' +
        s.fuentes.map(function (x, i) { return '<li class="sd-fila' + app.esNuevo('f' + i) + '" style="cursor:default"><span class="sd-canal">' + I[x[2]] + '</span><span class="sd-fila-t" style="white-space:normal">' + esc(x[0]) + '</span><span class="sd-pill sd-pill--auto">' + esc(x[1]) + '</span></li>'; }).join('') + '</ul></div>' +
      '<div class="sd-card"><div class="sd-card-h"><p class="sd-card-t">' + esc(s.lk) + '</p><span class="sd-canal" style="background:var(--sd-badbg);color:var(--sd-bad)">' + I.candado + '</span></div><div class="sd-card-b" style="padding-top:4px">' +
        s.limites.map(function (x, i) { return '<div class="sd-check' + app.esNuevo('lim' + i) + '" style="align-items:flex-start"><span style="color:var(--sd-bad);font-weight:700;flex:none">✕</span><span>' + esc(x) + '</span></div>'; }).join('') + '</div></div></div>';
  }

  function pPanel(app) {
    var p = app.t.p;
    var kp = function (k, v, d) { return '<div class="sd-card sd-kpi"><p class="sd-kpi-k">' + esc(k) + '</p><p class="sd-kpi-v">' + v + '</p><p class="sd-kpi-d">' + d + '</p></div>'; };
    var barras = [23, 27, 21, 25, 6, 4, 3, 2];
    var g = barras.map(function (v, i) { return '<i class="' + (i < 4 ? 'is-a' : 'is-d') + '" style="height:' + (v / 27 * 100) + '%;animation-delay:' + (i * 60) + 'ms" title="' + v + '"></i>'; }).join('');
    var l = barras.map(function (v, i) { return '<span>' + p.gl + (i + 1) + '</span>'; }).join('');
    return '<div class="sd-h"><div><p class="sd-h-k">' + esc(p.k) + '</p><h3 class="sd-h-t">' + esc(p.t) + '</h3><p class="sd-h-d">' + esc(p.d) + '</p></div></div>' +
      '<div class="sd-kpis">' + kp(p.k1, app.en ? '64%' : '64 %', esc(p.k1d)) + kp(p.k2, '38 s', p.k2d) + kp(p.k3, app.en ? '36%' : '36 %', esc(p.k3d)) + kp(p.k4, app.en ? '100%' : '100 %', esc(p.k4d)) + '</div>' +
      '<div class="sd-grid2"><div class="sd-card"><div class="sd-card-h"><p class="sd-card-t">' + esc(p.g) + '</p><span class="sd-pill sd-pill--acc">' + esc(p.marca) + ': ' + p.gl + '5</span></div><div class="sd-card-b"><div class="sd-barras">' + g + '</div><div class="sd-barras-l">' + l + '</div></div></div>' +
      '<div class="sd-card sd-solo-esc"><div class="sd-card-h"><p class="sd-card-t">' + esc(app.u.act) + '</p></div><div class="sd-card-b" style="padding-top:4px"><ul class="sd-lista">' +
      app.S.act.slice(0, 4).map(function (a) { return '<li class="sd-check" style="align-items:flex-start"><span class="sd-mono sd-t3" style="flex:none">' + esc(a.h) + '</span><span style="font-size:12.5px">' + a.x + '</span></li>'; }).join('') + '</ul></div></div></div>';
  }

  var acciones = {
    sel: function (app, id) { app.S.ui.sel = id; app.S.ui.hoja = true; app.nuevo('hoja'); app.refrescar(); },
    volver: function (app) { app.S.ui.hoja = false; app.refrescar(); },
    sug: function (app, i) { preguntar(app, app.t.q.sug[+i], true); },
    enviarQueja: function (app) {
      var c = app.S.queja; if (!c || c.enviada) return;
      c.enviada = true; c.est = 'persona'; app.nuevo('env'); app.refrescar();
      app.actividad('persona', app.t.act.responde);
    }
  };

  /* ------------------------------------------------------ LA HISTORIA */
  var pasos = [
    { narra: function (a) { return a.t.pasos[0]; }, pausa: 3000,
      hacer: function (app) { app.ir('bandeja'); return app.espera(500); } },
    { narra: function (a) { return a.t.pasos[1]; }, pausa: 1200,
      hacer: function (app) {
        var t = app.t;
        app.toast(t.b.vivo, '+34 600 000 000', 'tel');
        app.actividad('entrada', t.act.llamada);
        app.S.llamada = { id: 'll', tipo: 'llamada', canal: 'tel', q: '+34 600 000 000', a: t.b.vivo, est: 'curso', hace: app.hora(), lineas: [], hechos: [] };
        app.nuevo('ll'); app.nuevo('hoja'); app.S.ui.sel = 'll'; app.S.ui.hoja = true; app.refrescar();
        return app.espera(1000).then(function () {
          var c = app.S.llamada; c.q = 'Restaurante Casa Brenda'; c.ident = true; app.nuevo('ident'); app.refrescar();
          app.actividad('ia', t.act.ident);
          return linea(app, 0);
        }).then(function () { return linea(app, 1); });
      } },
    { narra: function (a) { return a.t.pasos[2]; }, pausa: 800,
      hacer: function (app) {
        var c = app.S.llamada;
        c.hechos.push(app.t.pasosLlamada[0], app.t.pasosLlamada[1]); app.nuevo('h0'); app.nuevo('h1'); app.refrescar();
        return linea(app, 2).then(function () { return linea(app, 3); });
      } },
    { narra: function (a) { return a.t.pasos[3]; }, pausa: 2200,
      hacer: function (app) {
        var c = app.S.llamada, t = app.t;
        return linea(app, 4).then(function () {
          c.hechos.push(t.pasosLlamada[2]); app.nuevo('h2'); app.refrescar(); app.actividad('auto', t.act.cita);
          return app.espera(700);
        }).then(function () {
          c.hechos.push(t.pasosLlamada[3]); app.nuevo('h3'); app.refrescar(); app.actividad('auto', t.act.parte);
          return app.espera(700);
        }).then(function () {
          c.hechos.push(t.pasosLlamada[4]); app.nuevo('h4'); app.refrescar(); app.actividad('auto', t.act.wa);
          app.mostrar(app.q('.sd-check:last-child'));
          return linea(app, 5);
        }).then(function () {
          app.pasa(2); c.est = 'sola'; c.a = t.canal.tel + ' · 2:14'; app.refrescar(); app.actividad('ok', t.act.fin);
        });
      } },
    { narra: function (a) { return a.t.pasos[4]; }, pausa: 2400,
      hacer: function (app) {
        var t = app.t;
        app.pasa(3);
        app.S.correo = { id: 'co', tipo: 'correo', canal: 'correo', q: t.correo.q, a: t.correo.a, est: 'curso', hace: app.hora(), fase: 0 };
        app.nuevo('co'); app.nuevo('hoja'); app.S.ui.sel = 'co'; app.S.ui.hoja = true; app.refrescar();
        app.actividad('entrada', t.act.correo);
        return app.espera(1200).then(function () {
          app.S.correo.fase = 1; app.nuevo('busca'); app.refrescar(); app.actividad('ia', t.act.busca);
          return app.espera(1200);
        }).then(function () {
          app.S.correo.fase = 2; app.S.correo.est = 'sola'; app.nuevo('resp'); app.refrescar(); app.actividad('ok', t.act.envia);
        });
      } },
    { narra: function (a) { return a.t.pasos[5]; }, pausa: 2200,
      hacer: function (app) {
        var t = app.t;
        app.pasa(6);
        app.S.queja = { id: 'qu', tipo: 'queja', canal: 'wa', q: t.queja.q, a: t.queja.a, est: 'espera', hace: app.hora(), fase: 0 };
        app.nuevo('qu'); app.nuevo('hoja'); app.S.ui.sel = 'qu'; app.S.ui.hoja = true; app.refrescar();
        app.actividad('aviso', t.act.queja);
        return app.espera(1300).then(function () {
          app.S.queja.fase = 1; app.nuevo('res'); app.refrescar(); app.actividad('auto', t.act.pasa);
          return app.espera(1500);
        }).then(function () {
          app.S.queja.fase = 2; app.nuevo('sug'); app.refrescar();
          app.mostrar(app.q('[data-a="enviarQueja"]'));
          return app.espera(900).then(function () { return app.cursor(app.q('[data-a="enviarQueja"]'), 300); });
        }).then(function () {
          acciones.enviarQueja(app);
          return app.espera(700).then(function () { app.actividad('auto', t.act.garantia); });
        });
      } },
    { narra: function (a) { return a.t.pasos[6]; }, pausa: 4200,
      hacer: function (app) {
        app.S.ui.hoja = false;
        for (var i = 0; i < 8; i++) { app.nuevo('f' + i); app.nuevo('lim' + i); }
        app.ir('saber'); return app.espera(400);
      } },
    { narra: function (a) { return a.t.pasos[7]; }, pausa: 2600,
      hacer: function (app) {
        app.ir('pregunta');
        var sug = app.t.q.sug;
        return app.espera(900).then(function () { return app.cursor(app.q('[data-a="sug"][data-v="1"]'), 200); })
          .then(function () { return preguntar(app, sug[1], false); })
          .then(function () { return app.espera(1800); })
          .then(function () { return app.cursor(app.q('[data-a="sug"][data-v="2"]'), 200); })
          .then(function () { return preguntar(app, sug[2], false); });
      } },
    { narra: function (a) { return a.t.pasos[8]; }, pausa: 7000,
      hacer: function (app) { app.ir('panel'); return app.espera(400); } }
  ];

  function linea(app, i) {
    var c = app.S.llamada, l = app.t.llamada[i];
    c.escribe = l[0]; app.refrescar(); app.mostrar(app.q('.sd-escribe'));
    return app.espera(l[0] === 'ia' ? 1100 : 900).then(function () {
      c.escribe = false; c.lineas.push(l); app.nuevo('l' + (c.lineas.length - 1)); app.refrescar();
      app.mostrar(app.q('.sd-chat .sd-bur:last-of-type'));
      return app.espera(Math.min(2600, 700 + l[1].length * 16));
    });
  }

  SD.registrar('atencion', {
    textos: T,
    estado: estado,
    pantallas: [
      { id: 'bandeja', icono: 'bandeja', html: pBandeja },
      { id: 'pregunta', icono: 'ia', html: pPregunta, tras: trasPregunta },
      { id: 'saber', icono: 'libro', html: pSaber },
      { id: 'panel', icono: 'panel', html: pPanel }
    ],
    acciones: acciones,
    pasos: pasos
  });
})();
