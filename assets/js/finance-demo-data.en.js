/*
 * D-Code Finance — public demo data layer (English mirror).
 *
 * Same domain types and the same fictional dataset as
 * finance-demo-data.js, taken 1:1 from the real D-Code Finance
 * repository's mock adapter (src/lib/data/types.ts +
 * src/lib/data/mock-adapter.ts) -- the same dataset the product team
 * already uses when DATA_SOURCE=mock. Only the human-readable strings
 * (company names, statuses, categories) are translated; every ID,
 * numeric amount, date and relationship is identical to the Spanish
 * version, so both language versions stay internally coherent with
 * each other.
 *
 * Isolation: zero network calls, zero credentials, zero dependency on
 * Airtable/n8n/PostgreSQL. All email domains use ".example" (RFC 2606,
 * reserved and non-resolvable).
 */
(function (global) {
  'use strict';

  var CLIENTES = [
    { id: 'mock-cli-1', empresa: 'Nortex Logistics Ltd.', estado: 'Client', sector: 'Logistics', web: 'https://nortex-demo.example', email: 'billing@nortex-demo.example', telefono: '+34 900 000 001', nif: 'B00000001', direccionFiscal: 'Calle Ejemplo 1, Madrid', valorEstimado: 18000, valorReal: 21400, cuotaMensual: 1200, facturacionActiva: true, modo: 'Trial', facturaIds: ['mock-fac-1', 'mock-fac-2'] },
    { id: 'mock-cli-2', empresa: 'Bluewave Retail', estado: 'Client', sector: 'Retail', web: 'https://bluewave-demo.example', email: 'admin@bluewave-demo.example', telefono: '+34 900 000 002', nif: 'B00000002', direccionFiscal: 'Av. Ejemplo 22, Barcelona', valorEstimado: 9600, valorReal: 9600, cuotaMensual: 800, facturacionActiva: true, modo: 'Trial', facturaIds: ['mock-fac-3'] },
    { id: 'mock-cli-3', empresa: 'Southern Hardware Co.', estado: 'Client', sector: 'Industrial', web: null, email: 'contact@southernhw-demo.example', telefono: '+34 900 000 003', nif: 'B00000003', direccionFiscal: 'Polígono Ejemplo, Sevilla', valorEstimado: 4200, valorReal: 3900, cuotaMensual: null, facturacionActiva: true, modo: 'Trial', facturaIds: ['mock-fac-4'] },
    { id: 'mock-cli-4', empresa: 'Vera Dental Clinic', estado: 'Prospect', sector: 'Healthcare', web: 'https://veradental-demo.example', email: 'info@veradental-demo.example', telefono: '+34 900 000 004', nif: null, direccionFiscal: null, valorEstimado: 6000, valorReal: null, cuotaMensual: null, facturacionActiva: false, modo: 'Trial', facturaIds: [] },
    { id: 'mock-cli-5', empresa: 'Prat Food Group', estado: 'Client', sector: 'Food & beverage', web: 'https://pratfood-demo.example', email: 'payments@pratfood-demo.example', telefono: '+34 900 000 005', nif: 'B00000005', direccionFiscal: 'Carrer Ejemplo 5, Girona', valorEstimado: 15000, valorReal: 15000, cuotaMensual: 1500, facturacionActiva: true, modo: 'Trial', facturaIds: ['mock-fac-5', 'mock-fac-6'] }
  ];

  var FACTURAS = [
    { id: 'mock-fac-1', numero: '2026-014', clienteIds: ['mock-cli-1'], clienteNombre: 'Nortex Logistics Ltd.', proyecto: 'Route automation', fechaEmision: '2026-07-01', fechaVencimiento: '2026-07-31', importe: 1200, estado: 'Sent', pagada: false, estadoCobro: 'Overdue', importeCobrado: 0, metodoPago: null, fechaPago: null, presupuestoOrigenId: 'mock-pre-1', proyectoOrigenId: null, recordatoriosEnviados: 2, fechaUltimoRecordatorio: '2026-08-10', observaciones: null },
    { id: 'mock-fac-2', numero: '2026-021', clienteIds: ['mock-cli-1'], clienteNombre: 'Nortex Logistics Ltd.', proyecto: 'Route automation', fechaEmision: '2026-08-01', fechaVencimiento: '2026-08-31', importe: 1200, estado: 'Sent', pagada: false, estadoCobro: 'Pending', importeCobrado: 0, metodoPago: null, fechaPago: null, presupuestoOrigenId: null, proyectoOrigenId: 'mock-proy-1', recordatoriosEnviados: 0, fechaUltimoRecordatorio: null, observaciones: null },
    { id: 'mock-fac-3', numero: '2026-018', clienteIds: ['mock-cli-2'], clienteNombre: 'Bluewave Retail', proyecto: 'KPI dashboard', fechaEmision: '2026-07-15', fechaVencimiento: '2026-08-14', importe: 800, estado: 'Paid', pagada: true, estadoCobro: 'Collected', importeCobrado: 800, metodoPago: 'Bank transfer', fechaPago: '2026-08-05', presupuestoOrigenId: 'mock-pre-2', proyectoOrigenId: null, recordatoriosEnviados: 0, fechaUltimoRecordatorio: null, observaciones: null },
    { id: 'mock-fac-4', numero: '2026-011', clienteIds: ['mock-cli-3'], clienteNombre: 'Southern Hardware Co.', proyecto: 'AI inventory', fechaEmision: '2026-06-20', fechaVencimiento: '2026-07-20', importe: 3900, estado: 'Sent', pagada: false, estadoCobro: 'Following up', importeCobrado: 1000, metodoPago: null, fechaPago: null, presupuestoOrigenId: 'mock-pre-3', proyectoOrigenId: null, recordatoriosEnviados: 3, fechaUltimoRecordatorio: '2026-08-12', observaciones: 'Client has requested a payment plan.' },
    { id: 'mock-fac-5', numero: '2026-025', clienteIds: ['mock-cli-5'], clienteNombre: 'Prat Food Group', proyecto: 'Batch traceability', fechaEmision: '2026-08-05', fechaVencimiento: '2026-09-04', importe: 1500, estado: 'Sent', pagada: false, estadoCobro: 'Pending', importeCobrado: 0, metodoPago: null, fechaPago: null, presupuestoOrigenId: null, proyectoOrigenId: 'mock-proy-2', recordatoriosEnviados: 0, fechaUltimoRecordatorio: null, observaciones: null },
    { id: 'mock-fac-6', numero: '2026-006', clienteIds: ['mock-cli-5'], clienteNombre: 'Prat Food Group', proyecto: 'Batch traceability', fechaEmision: '2026-05-01', fechaVencimiento: '2026-05-31', importe: 1500, estado: 'Paid', pagada: true, estadoCobro: 'Collected', importeCobrado: 1500, metodoPago: 'Bank transfer', fechaPago: '2026-05-28', presupuestoOrigenId: null, proyectoOrigenId: 'mock-proy-2', recordatoriosEnviados: 0, fechaUltimoRecordatorio: null, observaciones: null },
    { id: 'mock-fac-7', numero: '2026-027', clienteIds: ['mock-cli-2'], clienteNombre: 'Bluewave Retail', proyecto: null, fechaEmision: null, fechaVencimiento: null, importe: 800, estado: 'Draft', pagada: false, estadoCobro: null, importeCobrado: null, metodoPago: null, fechaPago: null, presupuestoOrigenId: null, proyectoOrigenId: null, recordatoriosEnviados: null, fechaUltimoRecordatorio: null, observaciones: 'Awaiting approval to send.' }
  ];

  var PRESUPUESTOS = [
    { id: 'mock-pre-1', empresa: 'Nortex Logistics Ltd.', estado: 'Accepted', fechaGeneracion: '2026-06-15', importe: 1200, resumenEjecutivo: 'AI-assisted route assignment automation.', serviciosPropuestos: 'n8n automation + tracking dashboard', aceptadaPorCliente: true, fechaAceptacion: '2026-06-20', clienteRecordId: 'mock-cli-1', facturaGeneradaId: 'mock-fac-1' },
    { id: 'mock-pre-2', empresa: 'Bluewave Retail', estado: 'Accepted', fechaGeneracion: '2026-07-01', importe: 800, resumenEjecutivo: 'Real-time sales KPI dashboard.', serviciosPropuestos: 'Dashboard + POS integration', aceptadaPorCliente: true, fechaAceptacion: '2026-07-08', clienteRecordId: 'mock-cli-2', facturaGeneradaId: 'mock-fac-3' },
    { id: 'mock-pre-3', empresa: 'Southern Hardware Co.', estado: 'Accepted', fechaGeneracion: '2026-06-01', importe: 3900, resumenEjecutivo: 'AI-assisted inventory system.', serviciosPropuestos: 'Automatic stock classification', aceptadaPorCliente: true, fechaAceptacion: '2026-06-10', clienteRecordId: 'mock-cli-3', facturaGeneradaId: 'mock-fac-4' },
    { id: 'mock-pre-4', empresa: 'Vera Dental Clinic', estado: 'Sent', fechaGeneracion: '2026-08-10', importe: 6000, resumenEjecutivo: 'Appointment scheduling and reminder automation.', serviciosPropuestos: 'WhatsApp bot + synced calendar', aceptadaPorCliente: false, fechaAceptacion: null, clienteRecordId: 'mock-cli-4', facturaGeneradaId: null }
  ];

  var GASTOS = [
    { id: 'mock-gas-1', proveedor: 'CloudHost Servers', importe: 89.9, iva: 18.88, fecha: '2026-08-01', concepto: 'Monthly infrastructure hosting', categoria: 'Infrastructure', estadoRevision: 'Approved', proyectoRecordId: null, notasRevision: null },
    { id: 'mock-gas-2', proveedor: 'Nubla Design Studio', importe: 450, iva: 94.5, fecha: '2026-07-22', concepto: 'Brand identity for Nortex client', categoria: 'Outsourcing', estadoRevision: 'Approved', proyectoRecordId: 'mock-proy-1', notasRevision: null },
    { id: 'mock-gas-3', proveedor: 'OpenAPI Tools SL', importe: 120, iva: 25.2, fecha: '2026-08-05', concepto: 'Third-party API license', categoria: 'Software', estadoRevision: 'Pending review', proyectoRecordId: 'mock-proy-2', notasRevision: null },
    { id: 'mock-gas-4', proveedor: 'Iberia Corporate Travel', importe: 210, iva: null, fecha: '2026-07-30', concepto: 'Client meeting travel', categoria: 'Travel', estadoRevision: 'Pending review', proyectoRecordId: null, notasRevision: 'Missing ticket receipt.' }
  ];

  var PROYECTOS = [
    { id: 'mock-proy-1', nombre: 'Route automation', empresa: 'Nortex Logistics Ltd.', estado: 'In progress', fechaInicio: '2026-06-20', fechaEntregaPrevista: '2026-09-30', fechaEntregaReal: null, serviciosContratados: 'n8n automation + tracking dashboard', responsable: 'D-Code Team', totalFacturado: 2400, totalCobrado: 0, totalGastos: 450, rentabilidad: 1950 },
    { id: 'mock-proy-2', nombre: 'Batch traceability', empresa: 'Prat Food Group', estado: 'In progress', fechaInicio: '2026-04-10', fechaEntregaPrevista: '2026-08-30', fechaEntregaReal: null, serviciosContratados: 'AI traceability + quality dashboard', responsable: 'D-Code Team', totalFacturado: 3000, totalCobrado: 1500, totalGastos: 120, rentabilidad: 2880 },
    { id: 'mock-proy-3', nombre: 'AI inventory', empresa: 'Southern Hardware Co.', estado: 'Delivered', fechaInicio: '2026-05-01', fechaEntregaPrevista: '2026-06-15', fechaEntregaReal: '2026-06-18', serviciosContratados: 'Automatic stock classification', responsable: 'D-Code Team', totalFacturado: 3900, totalCobrado: 1000, totalGastos: 0, rentabilidad: 3900 }
  ];

  // ---------------------------------------------------------------
  // El "hoy" de la demo. Los datos están fijados a este día: si se usara la fecha
  // real del navegador, los vencimientos se irían alejando solos y la demo
  // enseñaría retrasos distintos cada semana sin que nadie los haya escrito.
  // ---------------------------------------------------------------
  var HOY = '2026-08-16';
  var DIA_MS = 86400000;

  function diasEntre(desde, hasta) {
    var a = Date.parse(desde), b = Date.parse(hasta);
    if (isNaN(a) || isNaN(b)) return null;
    return Math.round((b - a) / DIA_MS);
  }
  function diasDeRetraso(f) {
    if (!f.fechaVencimiento || f.pagada) return 0;
    var d = diasEntre(f.fechaVencimiento, HOY);
    return d && d > 0 ? d : 0;
  }
  function pendienteDe(f) { return (f.importe || 0) - (f.importeCobrado || 0); }
  function emitidas() {
    return FACTURAS.filter(function (f) { return f.estado !== 'Draft'; });
  }
  function suma(lista, fn) {
    return lista.reduce(function (s, x) { return s + (fn(x) || 0); }, 0);
  }
  function redondear(n) { return Math.round(n * 100) / 100; }

  // ---------------------------------------------------------------
  // El panel se calcula sobre los registros, no se escribe a mano. Es lo que
  // hace el producto real, y además evita que el panel y las tablas digan
  // cosas distintas: cualquier cambio en una factura mueve los dos.
  // ---------------------------------------------------------------
  var DASHBOARD_SNAPSHOT = (function () {
    var lista = emitidas();
    var facturado = suma(lista, function (f) { return f.importe; });
    var cobrado = suma(lista, function (f) { return f.importeCobrado; });
    var vencidas = lista.filter(function (f) { return diasDeRetraso(f) > 0 && pendienteDe(f) > 0; });
    var proximas = lista.filter(function (f) {
      if (f.pagada || pendienteDe(f) <= 0 || !f.fechaVencimiento) return false;
      var d = diasEntre(HOY, f.fechaVencimiento);
      return d !== null && d >= 0 && d <= 30;
    });
    var seguimiento = lista.filter(function (f) { return f.estadoCobro === 'Following up'; });
    var gastosPendientes = GASTOS.filter(function (g) { return g.estadoRevision === 'Pending review'; });
    var borradores = FACTURAS.filter(function (f) { return f.estado === 'Draft'; });

    var alertas = [];
    if (vencidas.length) alertas.push(vencidas.length + ' overdue invoice(s) not collected, ' + fmtEUR(suma(vencidas, pendienteDe)));
    if (seguimiento.length) alertas.push(seguimiento.length + ' invoice(s) in follow-up over repeated non-payment');
    if (gastosPendientes.length) alertas.push(gastosPendientes.length + ' expense(s) pending human review');
    if (borradores.length) alertas.push(borradores.length + ' invoice(s) in draft, never sent');

    return {
      fechaCalculo: HOY + 'T07:00:00.000Z',
      totalFacturado: redondear(facturado),
      totalCobrado: redondear(cobrado),
      totalPendiente: redondear(facturado - cobrado),
      totalVencido: redondear(suma(vencidas, pendienteDe)),
      totalGastos: redondear(suma(GASTOS, function (g) { return g.importe; })),
      proyectosActivos: PROYECTOS.filter(function (p) { return p.estado === 'In progress'; }).length,
      prevision30Dias: redondear(suma(proximas, pendienteDe)),
      alertas: alertas
    };
  })();

  // ---------------------------------------------------------------
  // Formatting -- same rules as src/lib/format.ts in the real product
  // ---------------------------------------------------------------
  function fmtEUR(value) {
    if (value === null || value === undefined) return 'Not enough data';
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR' }).format(value);
  }
  function fmtFecha(value) {
    if (!value) return '—';
    var d = new Date(value);
    if (isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
  }
  function fmtFechaHora(value) {
    if (!value) return '—';
    var d = new Date(value);
    if (isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d);
  }

  function byId(list, id) { return list.filter(function (x) { return x.id === id; })[0] || null; }
  function clienteById(id) { return byId(CLIENTES, id); }
  function facturaById(id) { return byId(FACTURAS, id); }

  function derivarCobros() {
    return FACTURAS.filter(function (f) { return f.estado === 'Sent' || f.estado === 'Paid'; })
      .map(function (f) {
        return {
          facturaId: f.id, numeroFactura: f.numero, clienteNombre: f.clienteNombre,
          importe: f.importe, importeCobrado: f.importeCobrado || 0,
          pendiente: f.importe - (f.importeCobrado || 0),
          estadoCobro: f.estadoCobro || 'Pending',
          fechaVencimiento: f.fechaVencimiento, recordatoriosEnviados: f.recordatoriosEnviados
        };
      });
  }

  var FinanceStore = {
    empresa: { nombre: 'D-Code Finance', tagline: 'Financial dashboard' },

    getDashboardSnapshot: function () { return DASHBOARD_SNAPSHOT; },

    listFacturas: function () { return FACTURAS.slice(); },
    getFactura: function (id) { return facturaById(id); },

    listPresupuestos: function () { return PRESUPUESTOS.slice(); },
    getPresupuesto: function (id) { return byId(PRESUPUESTOS, id); },

    listClientes: function () { return CLIENTES.slice(); },
    getCliente: function (id) { return clienteById(id); },

    listCobros: function () { return derivarCobros(); },

    listGastos: function () { return GASTOS.slice(); },
    getGasto: function (id) { return byId(GASTOS, id); },

    listProyectos: function () { return PROYECTOS.slice(); },
    getProyecto: function (id) { return byId(PROYECTOS, id); },

    // --- Pregunta a Finanzas ---------------------------------------
    // El sistema real responde en abierto: manda la pregunta a su webhook de
    // IA Financiera con los datos de la empresa detrás. Esta demo pública no
    // llama a nada: las seis respuestas se calculan aquí mismo, sobre el
    // dataset ficticio, para que se pueda ver cómo responde sin conectar
    // ninguna cuenta. La forma de la respuesta -- conclusión, datos, qué
    // significa y qué revisar -- es la que da el sistema real.
    askQuestions: function () {
      var self = this;

      function refFactura(f) { return { type: 'facturas', id: f.id, label: f.numero }; }

      return [
        {
          clave: 'deudores',
          pistas: ['owe', 'owes', 'owed', 'debt', 'receivable', 'who owes', 'outstanding'],
          q: 'Who owes us money right now?',
          a: function () {
            var lista = emitidas().filter(function (f) { return pendienteDe(f) > 0; });
            if (!lista.length) return { conclusion: 'There are no invoices left to collect.', datos: [], refs: [] };
            var total = suma(lista, pendienteDe);
            var fuera = lista.filter(function (f) { return diasDeRetraso(f) > 0; });
            var porCliente = {};
            lista.forEach(function (f) {
              var k = f.clienteNombre || 'Unresolved client';
              porCliente[k] = (porCliente[k] || 0) + pendienteDe(f);
            });
            var nombres = Object.keys(porCliente).sort(function (a, b) { return porCliente[b] - porCliente[a]; });
            var mayor = nombres[0];
            var cuota = Math.round((porCliente[mayor] / total) * 100);
            return {
              conclusion: 'You are owed ' + fmtEUR(total) + ' across ' + lista.length + ' invoices. ' + (fuera.length ? fmtEUR(suma(fuera, pendienteDe)) + ' is already past due.' : 'None of it is past due yet.'),
              datos: nombres.map(function (n) {
                var suyas = lista.filter(function (f) { return (f.clienteNombre || 'Unresolved client') === n; });
                var atraso = Math.max.apply(null, suyas.map(diasDeRetraso));
                return { k: n, v: fmtEUR(porCliente[n]), n: (atraso > 0 ? atraso + ' days late' : 'within terms') + (suyas.length > 1 ? ' · ' + suyas.length + ' invoices' : '') };
              }),
              significado: cuota + '% of what you are owed sits with a single client: ' + (mayor.slice(-1) === '.' ? mayor : mayor + '.'),
              refs: fuera.map(refFactura)
            };
          }
        },
        {
          clave: 'atrasadas',
          pistas: ['late', 'overdue', 'past due', 'behind', 'unpaid'],
          q: 'Which invoices are furthest behind?',
          a: function () {
            var atrasadas = emitidas().filter(function (f) { return diasDeRetraso(f) > 0 && pendienteDe(f) > 0; })
              .sort(function (a, b) { return diasDeRetraso(b) - diasDeRetraso(a); });
            if (!atrasadas.length) return { conclusion: 'No invoice is past due.', datos: [], refs: [] };
            var peor = atrasadas[0];
            return {
              conclusion: atrasadas.length + ' invoices past due, ' + fmtEUR(suma(atrasadas, pendienteDe)) + ' uncollected. The oldest is ' + diasDeRetraso(peor) + ' days late.',
              datos: atrasadas.map(function (f) {
                return {
                  k: f.numero + ' · ' + (f.clienteNombre || 'Unresolved client'),
                  v: fmtEUR(pendienteDe(f)),
                  n: diasDeRetraso(f) + ' days · due ' + fmtFecha(f.fechaVencimiento) + ' · ' + (f.recordatoriosEnviados || 0) + ' reminders'
                };
              }),
              significado: peor.observaciones ? 'The oldest, ' + peor.numero + ', has a note on it: «' + peor.observaciones + '» That is not reflected in the invoice status.' : 'The oldest, ' + peor.numero + ', has had ' + (peor.recordatoriosEnviados || 0) + ' reminders sent with nothing to show for it.',
              revisar: ['Decide what happens with ' + peor.numero + ': another reminder has already failed ' + (peor.recordatoriosEnviados || 0) + ' times.'],
              refs: atrasadas.map(refFactura)
            };
          }
        },
        {
          clave: 'gastos',
          pistas: ['expense', 'expenses', 'cost', 'costs', 'growing', 'rising', 'spend', 'supplier'],
          q: 'Which costs are growing?',
          a: function () {
            var gastos = GASTOS.filter(function (g) { return g.fecha; });
            var meses = {};
            gastos.forEach(function (g) {
              var m = g.fecha.slice(0, 7);
              meses[m] = meses[m] || { total: 0, cat: {} };
              meses[m].total += g.importe;
              var c = g.categoria || 'Uncategorised';
              meses[m].cat[c] = (meses[m].cat[c] || 0) + g.importe;
            });
            var clavesMes = Object.keys(meses).sort();
            var ultimo = clavesMes[clavesMes.length - 1];
            var previo = clavesMes[clavesMes.length - 2];
            if (!previo) {
              return { conclusion: 'Only one month of expenses is on record: there is nothing to compare against.', datos: [], refs: [] };
            }
            var difTotal = meses[ultimo].total - meses[previo].total;
            var categorias = {};
            Object.keys(meses[ultimo].cat).concat(Object.keys(meses[previo].cat)).forEach(function (c) { categorias[c] = true; });
            var filas = Object.keys(categorias).map(function (c) {
              var ahora = meses[ultimo].cat[c] || 0;
              var antes = meses[previo].cat[c] || 0;
              return { cat: c, ahora: ahora, antes: antes, dif: ahora - antes };
            }).sort(function (a, b) { return b.dif - a.dif; });
            var suben = filas.filter(function (f) { return f.dif > 0; });
            return {
              conclusion: (difTotal > 0 ? 'Spending is up ' + fmtEUR(difTotal) : 'Spending is down ' + fmtEUR(-difTotal)) + ' on the previous month (' + fmtEUR(meses[ultimo].total) + ' against ' + fmtEUR(meses[previo].total) + ').',
              datos: filas.map(function (f) {
                return { k: f.cat, v: f.ahora === 0 ? '\u2014' : fmtEUR(f.ahora), n: (f.antes === 0 ? 'new this month' : (f.ahora === 0 ? 'did not repeat (' + fmtEUR(f.antes) + ' last month)' : (f.dif >= 0 ? '+' : '') + fmtEUR(f.dif) + ' on last month')) };
              }),
              significado: 'With ' + clavesMes.length + ' months on record there is not enough of a series to call it a trend. This is what changed, not a forecast' + (suben.length ? ': ' + (suben.length === 1 ? 'the only thing going up is ' : 'what is going up is ') + suben.map(function (x) { return x.cat; }).join(' and ') + '.' : '.'),
              refs: []
            };
          }
        },
        {
          clave: 'hoy',
          pistas: ['today', 'review', 'priority', 'urgent', 'what should i', 'attention'],
          q: 'What should I look at today?',
          a: function () {
            var pendientes = [];
            var refs = [];
            emitidas().filter(function (f) { return diasDeRetraso(f) > 0 && pendienteDe(f) > 0; })
              .sort(function (a, b) { return diasDeRetraso(b) - diasDeRetraso(a); })
              .forEach(function (f) { pendientes.push(f.numero + ' (' + f.clienteNombre + '): ' + fmtEUR(pendienteDe(f)) + ', ' + diasDeRetraso(f) + ' days late.'); refs.push(refFactura(f)); });
            FACTURAS.filter(function (f) { return f.estado === 'Draft'; })
              .forEach(function (f) { pendientes.push(f.numero + ': ' + fmtEUR(f.importe) + ' sitting in draft, never sent. Nobody has been asked for it.'); refs.push(refFactura(f)); });
            var gastosPte = GASTOS.filter(function (g) { return g.estadoRevision === 'Pending review'; });
            if (gastosPte.length) pendientes.push(gastosPte.length + ' expenses waiting for review: ' + gastosPte.map(function (g) { return g.proveedor + ' (' + fmtEUR(g.importe) + ')'; }).join(', ') + '.');
            PROYECTOS.filter(function (p) { return p.estado === 'In progress' && p.fechaEntregaPrevista; })
              .forEach(function (p) {
                var quedan = diasEntre(HOY, p.fechaEntregaPrevista);
                if (quedan !== null && quedan <= 21) pendientes.push(p.nombre + ': due ' + fmtFecha(p.fechaEntregaPrevista) + ', ' + quedan + ' days left.');
              });
            return {
              conclusion: pendientes.length ? 'There are ' + pendientes.length + ' things waiting on a decision from you today.' : 'Nothing needs a decision today.',
              revisar: pendientes,
              refs: refs
            };
          }
        },
        {
          clave: 'resumen',
          pistas: ['summary', 'summarise', 'summarize', 'how are we', 'overview', 'what is happening', 'whats happening'],
          q: 'Give me today\'s financial summary.',
          a: function () {
            var s = self.getDashboardSnapshot();
            var margen = s.totalFacturado - s.totalGastos;
            var cobradoPct = s.totalFacturado > 0 ? Math.round((s.totalCobrado / s.totalFacturado) * 100) : 0;
            return {
              conclusion: 'You have invoiced ' + fmtEUR(s.totalFacturado) + ' and collected ' + fmtEUR(s.totalCobrado) + '. ' + fmtEUR(s.totalPendiente) + ' is still to come in, of which ' + fmtEUR(s.totalVencido) + ' is past due.',
              datos: [
                { k: 'Invoiced', v: fmtEUR(s.totalFacturado) },
                { k: 'Collected', v: fmtEUR(s.totalCobrado), n: cobradoPct + '%' },
                { k: 'Outstanding', v: fmtEUR(s.totalPendiente) },
                { k: 'Past due', v: fmtEUR(s.totalVencido) },
                { k: 'Expenses', v: fmtEUR(s.totalGastos) },
                { k: 'Due within 30 days', v: fmtEUR(s.prevision30Dias) }
              ],
              significado: 'The problem is not the margin (' + fmtEUR(margen) + ' between invoiced and spent): it is that only ' + cobradoPct + '% of what you invoiced has actually come in.',
              revisar: ['The ' + fmtEUR(s.totalVencido) + ' past due, before anything else.'],
              refs: []
            };
          }
        },
        {
          clave: 'proyectos',
          pistas: ['project', 'projects', 'profitab', 'margin'],
          q: 'How profitable are the active projects?',
          a: function () {
            var activos = self.listProyectos().filter(function (p) { return p.estado === 'In progress'; });
            if (!activos.length) return { conclusion: 'There are no projects in progress right now.', datos: [], refs: [] };
            var mejor = activos.slice().sort(function (a, b) { return b.rentabilidad - a.rentabilidad; })[0];
            return {
              conclusion: activos.length + ' projects in progress, ' + fmtEUR(suma(activos, function (p) { return p.rentabilidad; })) + ' of estimated profit.',
              datos: activos.map(function (p) {
                return { k: p.nombre + ' · ' + p.empresa, v: fmtEUR(p.rentabilidad), n: fmtEUR(p.totalFacturado) + ' invoiced · ' + fmtEUR(p.totalCobrado) + ' collected · ' + fmtEUR(p.totalGastos) + ' spent' };
              }),
              significado: 'The best one is ' + mejor.nombre + ', and ' + (mejor.totalFacturado - mejor.totalCobrado > 0 ? fmtEUR(mejor.totalFacturado - mejor.totalCobrado) + ' of it is still uncollected.' : 'all of it has been collected.'),
              refs: activos.map(function (p) { return { type: 'proyectos', id: p.id, label: p.nombre }; })
            };
          }
        },
        {
          clave: 'deudor',
          pistas: ['client', 'customer', 'who owes most', 'biggest debt', 'largest debt', 'worst payer'],
          q: 'Which client owes us most?',
          a: function () {
            var lista = emitidas().filter(function (f) { return pendienteDe(f) > 0; });
            if (!lista.length) return { conclusion: 'No client has invoices outstanding.', datos: [], refs: [] };
            var porCliente = {};
            lista.forEach(function (f) {
              var k = f.clienteNombre || 'Unresolved client';
              porCliente[k] = porCliente[k] || { total: 0, facturas: [] };
              porCliente[k].total += pendienteDe(f);
              porCliente[k].facturas.push(f);
            });
            var nombres = Object.keys(porCliente).sort(function (a, b) { return porCliente[b].total - porCliente[a].total; });
            var top = nombres[0];
            var suyas = porCliente[top].facturas.slice().sort(function (a, b) { return diasDeRetraso(b) - diasDeRetraso(a); });
            var totalTodos = suma(lista, pendienteDe);
            var cuota = Math.round((porCliente[top].total / totalTodos) * 100);
            var ficha = self.listClientes().filter(function (c) { return c.empresa === top; })[0];
            return {
              conclusion: top + ' owes the most: ' + fmtEUR(porCliente[top].total) + ' across ' + suyas.length + ' invoice(s), ' + cuota + '% of everything outstanding.',
              datos: suyas.map(function (f) {
                return { k: f.numero, v: fmtEUR(pendienteDe(f)), n: (diasDeRetraso(f) > 0 ? diasDeRetraso(f) + ' days late' : 'due ' + fmtFecha(f.fechaVencimiento)) + (f.importeCobrado ? ' · has already paid ' + fmtEUR(f.importeCobrado) : '') };
              }),
              significado: (ficha && ficha.cuotaMensual ? 'They are also on a ' + fmtEUR(ficha.cuotaMensual) + ' monthly fee, so the debt grows every month it goes uncollected.' : 'The risk is the concentration in a single client, not the amount.'),
              refs: (ficha ? [{ type: 'clientes', id: ficha.id, label: top }] : []).concat(suyas.map(refFactura))
            };
          }
        },
        {
          clave: 'caja',
          pistas: ['cash', 'treasury', 'liquidity', 'balance', 'runway', 'how much money'],
          q: 'How is our cash position?',
          a: function () {
            var lista = emitidas();
            var cobrado = suma(lista, function (f) { return f.importeCobrado; });
            var gastado = suma(GASTOS, function (g) { return g.importe; });
            var porEntrar = suma(lista.filter(function (f) { return pendienteDe(f) > 0; }), pendienteDe);
            var s = self.getDashboardSnapshot();
            return {
              conclusion: 'This demo does not include the Treasury module, so I cannot give you a bank balance. From what is on record: ' + fmtEUR(cobrado) + ' has come in and ' + fmtEUR(gastado) + ' has gone out.',
              datos: [
                { k: 'Collected', v: fmtEUR(cobrado) },
                { k: 'Expenses on record', v: fmtEUR(gastado) },
                { k: 'Difference', v: fmtEUR(cobrado - gastado) },
                { k: 'Still to come in', v: fmtEUR(porEntrar), n: fmtEUR(s.prevision30Dias) + ' due within 30 days' }
              ],
              significado: 'The gap between what came in and what went out is not your bank balance: it leaves out payroll, tax and whatever was already in the account. Treasury, which does cross expected receipts with expected payments, exists in the real system and not in this demo.',
              revisar: ['What is still to come in (' + fmtEUR(porEntrar) + ') is more than double everything collected so far. That is where the money is.'],
              refs: []
            };
          }
        }
      ];
    },

    // Busca la pregunta preparada que más se parece a lo que se ha escrito.
    // No es comprensión de lenguaje: son palabras clave. Cuando no encuentra
    // ninguna lo dice, en vez de inventarse una respuesta.
    matchQuestion: function (texto) {
      var t = (texto || '').toLowerCase();
      var preguntas = this.askQuestions();
      var mejor = null, mejorPuntos = 0;
      preguntas.forEach(function (p) {
        var puntos = 0;
        p.pistas.forEach(function (pista) { if (t.indexOf(pista) !== -1) puntos++; });
        if (puntos > mejorPuntos) { mejorPuntos = puntos; mejor = p; }
      });
      return mejorPuntos > 0 ? mejor : null;
    },

    hoy: HOY

  };

  global.FinanceStore = FinanceStore;
  global.FinanceFmt = { eur: fmtEUR, fecha: fmtFecha, fechaHora: fmtFechaHora };

})(window);
