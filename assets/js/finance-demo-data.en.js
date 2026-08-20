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

  var DASHBOARD_SNAPSHOT = {
    fechaCalculo: '2026-08-16T07:00:00.000Z',
    totalFacturado: 9100,
    totalCobrado: 3800,
    totalPendiente: 5300,
    totalVencido: 1200,
    totalGastos: 869.9,
    proyectosActivos: 2,
    prevision30Dias: 2700,
    alertas: [
      '1 overdue invoice(s) not yet collected',
      '1 invoice(s) in follow-up over repeated non-payment',
      '2 expense(s) pending human review',
      '1 invoice(s) in Draft pending approval to send'
    ]
  };

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

    // --- Ask Finance: same 3 suggestions as the real product
    // (src/app/(app)/ia/page.tsx), computed here over the demo dataset
    // instead of calling the real Finance AI webhook. ---
    askQuestions: function () {
      var self = this;
      return [
        {
          q: 'How much am I owed in total, and which invoices are overdue?',
          a: function () {
            var cobros = self.listCobros();
            var pendientes = cobros.filter(function (c) { return c.pendiente > 0; });
            var totalPendiente = pendientes.reduce(function (s, c) { return s + c.pendiente; }, 0);
            var vencidas = cobros.filter(function (c) { return c.estadoCobro === 'Overdue'; });
            var text = 'You are owed ' + fmtEUR(totalPendiente) + ' in total, across ' + pendientes.length + ' invoice(s).';
            if (vencidas.length) {
              text += ' Of those, ' + vencidas.length + ' ' + (vencidas.length === 1 ? 'is' : 'are') + ' already overdue: ' +
                vencidas.map(function (c) { return c.numeroFactura + ' (' + (c.clienteNombre || 'unresolved client') + ')'; }).join(', ') + '.';
            }
            return { text: text, refs: vencidas.map(function (c) { return { type: 'facturas', id: c.facturaId, label: c.numeroFactura }; }) };
          }
        },
        {
          q: 'What is the profitability of active projects?',
          a: function () {
            var activos = self.listProyectos().filter(function (p) { return p.estado === 'In progress'; });
            if (!activos.length) return { text: 'There are no projects in progress right now.', refs: [] };
            var text = activos.map(function (p) {
              return p.nombre + ' (' + p.empresa + '): ' + fmtEUR(p.rentabilidad) + ' of profit on ' + fmtEUR(p.totalFacturado) + ' billed.';
            }).join(' ');
            return { text: text, refs: activos.map(function (p) { return { type: 'proyectos', id: p.id, label: p.nombre }; }) };
          }
        },
        {
          q: 'Which category have we spent the most on this month?',
          a: function () {
            var gastos = self.listGastos();
            var porCategoria = {};
            gastos.forEach(function (g) {
              var cat = g.categoria || 'Uncategorized';
              porCategoria[cat] = (porCategoria[cat] || 0) + g.importe;
            });
            var categorias = Object.keys(porCategoria).sort(function (a, b) { return porCategoria[b] - porCategoria[a]; });
            var top = categorias[0];
            var total = gastos.reduce(function (s, g) { return s + g.importe; }, 0);
            var pct = total > 0 ? Math.round((porCategoria[top] / total) * 100) : 0;
            return {
              text: 'The category with the most spend is "' + top + '", at ' + fmtEUR(porCategoria[top]) + ' (' + pct + '% of total recorded spend).',
              refs: []
            };
          }
        }
      ];
    }
  };

  global.FinanceStore = FinanceStore;
  global.FinanceFmt = { eur: fmtEUR, fecha: fmtFecha, fechaHora: fmtFechaHora };

})(window);
