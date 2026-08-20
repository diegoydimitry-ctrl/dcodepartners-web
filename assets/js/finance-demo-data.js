/*
 * D-Code Finance — demo data layer.
 *
 * Este archivo es la ÚNICA fuente de datos de la demo pública de
 * D-Code Finance. Es una capa de datos deliberadamente separada de la
 * capa de render (finance-demo.js) y aislada del sistema financiero
 * real que construye Auditor n8n/Airtable: no hay ninguna llamada de
 * red, ninguna credencial, ningún workflow n8n, ninguna tabla Airtable
 * ni ninguna base de datos real involucrada en este archivo. Todo son
 * arrays JS estáticos con una empresa ficticia coherente (Estudio
 * Nortia, un estudio de diseño/branding) y sus clientes, proveedores,
 * proyectos, presupuestos, facturas y gastos -- ningún nombre, email,
 * teléfono o NIF es real; los dominios de email usan ".example"
 * (RFC 2606, reservado y no resoluble) precisamente para que no puedan
 * confundirse con una empresa real.
 *
 * DEMO_TODAY fija la fecha "actual" de la demo para que las preguntas
 * relativas ("este mes", "próximos vencimientos") sean deterministas.
 *
 * Capa de acceso (FinanceStore): todas las vistas (finance-demo.js)
 * leen los datos EXCLUSIVAMENTE a través de los métodos de
 * FinanceStore, nunca tocando los arrays crudos directamente. El día
 * que exista una integración real con D-Code Finance, sustituir el
 * cuerpo de estos métodos por llamadas a la API real (o por lectura de
 * un JSON servido por backend) es el único cambio necesario -- ninguna
 * vista tendría que reescribirse.
 */
(function (global) {
  'use strict';

  var DEMO_TODAY = new Date(2026, 7, 20); // 20 agosto 2026 (mes 7 = agosto, 0-indexado)

  // ---------------------------------------------------------------
  // Clientes
  // ---------------------------------------------------------------
  var CLIENTS = [
    { id: 'cli-001', name: 'Panadería El Roble', sector: 'Alimentación', email: 'hola@elroble-panaderia.example', phone: '+34 900 100 201', nif: 'B00100201', since: '2026-03-01' },
    { id: 'cli-002', name: 'Clínica Dental Aurora', sector: 'Salud', email: 'administracion@dentalaurora.example', phone: '+34 900 100 202', nif: 'B00100202', since: '2026-04-01' },
    { id: 'cli-003', name: 'Ferretería Cabrera', sector: 'Comercio', email: 'pedidos@ferreteriacabrera.example', phone: '+34 900 100 203', nif: 'B00100203', since: '2026-03-01' },
    { id: 'cli-004', name: 'Gimnasio Vértice', sector: 'Deporte y bienestar', email: 'info@gimnasiovertice.example', phone: '+34 900 100 204', nif: 'B00100204', since: '2026-04-01' },
    { id: 'cli-005', name: 'Bufete Larra & Asociados', sector: 'Servicios legales', email: 'contacto@bufetelarra.example', phone: '+34 900 100 205', nif: 'B00100205', since: '2026-03-01' },
    { id: 'cli-006', name: 'Óptica Meridian', sector: 'Salud', email: 'hola@opticameridian.example', phone: '+34 900 100 206', nif: 'B00100206', since: '2026-04-01' }
  ];

  // ---------------------------------------------------------------
  // Proveedores
  // ---------------------------------------------------------------
  var SUPPLIERS = [
    { id: 'prov-001', name: 'Cloudbyte Hosting', category: 'Hosting', email: 'facturacion@cloudbyte.example', nif: 'B00200001' },
    { id: 'prov-002', name: 'Imprenta Solvento', category: 'Marketing', email: 'pedidos@imprentasolvento.example', nif: 'B00200002' },
    { id: 'prov-003', name: 'Marta Ibáñez — Ilustración Freelance', category: 'Freelance', email: 'marta.ibanez@freelance.example', nif: '00200003X' },
    { id: 'prov-004', name: 'SoftLicencias SL', category: 'Software', email: 'ventas@softlicencias.example', nif: 'B00200004' }
  ];

  // ---------------------------------------------------------------
  // Proyectos
  // ---------------------------------------------------------------
  var PROJECTS = [
    { id: 'proj-001', name: 'Rediseño de marca', clientId: 'cli-001', status: 'Completado', start: '2026-03-01', end: '2026-04-10' },
    { id: 'proj-002', name: 'Web + SEO', clientId: 'cli-002', status: 'En curso', start: '2026-04-05', end: null },
    { id: 'proj-003', name: 'Campaña de lanzamiento', clientId: 'cli-004', status: 'En curso', start: '2026-04-10', end: null },
    { id: 'proj-004', name: 'Identidad visual', clientId: 'cli-005', status: 'Completado', start: '2026-03-10', end: '2026-04-18' },
    { id: 'proj-005', name: 'Catálogo de producto', clientId: 'cli-003', status: 'Completado', start: '2026-03-15', end: '2026-03-30' }
  ];

  // ---------------------------------------------------------------
  // Presupuestos — Borrador / Enviado / Aceptado / Rechazado / Caducado
  // ---------------------------------------------------------------
  var QUOTES = [
    { id: 'P260001', clientId: 'cli-001', title: 'Rediseño de marca', amount: 2400, status: 'Aceptado', date: '2026-02-20', projectId: 'proj-001' },
    { id: 'P260002', clientId: 'cli-005', title: 'Identidad visual', amount: 1800, status: 'Aceptado', date: '2026-02-25', projectId: 'proj-004' },
    { id: 'P260003', clientId: 'cli-003', title: 'Catálogo de producto', amount: 950, status: 'Aceptado', date: '2026-03-02', projectId: 'proj-005' },
    { id: 'P260004', clientId: 'cli-002', title: 'Web + SEO (3 hitos)', amount: 3600, status: 'Aceptado', date: '2026-03-25', projectId: 'proj-002' },
    { id: 'P260005', clientId: 'cli-004', title: 'Campaña de lanzamiento (3 hitos)', amount: 4800, status: 'Aceptado', date: '2026-04-01', projectId: 'proj-003' },
    { id: 'P260006', clientId: 'cli-006', title: 'Piezas gráficas mensuales', amount: 480, status: 'Aceptado', date: '2026-04-10', projectId: null },
    { id: 'P260007', clientId: 'cli-006', title: 'Ampliación de redes sociales', amount: 850, status: 'Enviado', date: '2026-08-12', projectId: null },
    { id: 'P260008', clientId: 'cli-003', title: 'Renovación de catálogo 2027', amount: 1100, status: 'Rechazado', date: '2026-07-15', projectId: null },
    { id: 'P260009', clientId: 'cli-001', title: 'Nueva línea de packaging', amount: 1350, status: 'Borrador', date: '2026-08-18', projectId: null }
  ];

  // ---------------------------------------------------------------
  // Facturas — cada una con sus líneas. estado: Borrador / Pendiente /
  // Vencida / Pagada. paidDate solo si estado === 'Pagada'.
  // ---------------------------------------------------------------
  var INVOICES = [
    { id: 'F260001', clientId: 'cli-001', projectId: 'proj-001', date: '2026-03-15', dueDate: '2026-04-14', status: 'Pagada', paidDate: '2026-04-10', lines: [{ desc: 'Diseño de identidad de marca', qty: 1, price: 2400 }] },
    { id: 'F260002', clientId: 'cli-005', projectId: 'proj-004', date: '2026-03-22', dueDate: '2026-04-21', status: 'Pagada', paidDate: '2026-04-18', lines: [{ desc: 'Identidad visual completa', qty: 1, price: 1800 }] },
    { id: 'F260003', clientId: 'cli-003', projectId: 'proj-005', date: '2026-03-30', dueDate: '2026-04-29', status: 'Pagada', paidDate: '2026-04-25', lines: [{ desc: 'Catálogo de producto — diseño y maquetación', qty: 1, price: 950 }] },
    { id: 'F260004', clientId: 'cli-002', projectId: 'proj-002', date: '2026-04-10', dueDate: '2026-05-10', status: 'Pagada', paidDate: '2026-05-05', lines: [{ desc: 'Web + SEO — Hito 1: diseño y arquitectura', qty: 1, price: 1200 }] },
    { id: 'F260005', clientId: 'cli-004', projectId: 'proj-003', date: '2026-04-18', dueDate: '2026-05-18', status: 'Pagada', paidDate: '2026-05-12', lines: [{ desc: 'Campaña de lanzamiento — Hito 1: estrategia y piezas', qty: 1, price: 1600 }] },
    { id: 'F260006', clientId: 'cli-006', projectId: null, date: '2026-04-25', dueDate: '2026-05-25', status: 'Pagada', paidDate: '2026-04-30', lines: [{ desc: 'Piezas gráficas — abril', qty: 1, price: 480 }] },
    { id: 'F260007', clientId: 'cli-002', projectId: 'proj-002', date: '2026-05-12', dueDate: '2026-06-11', status: 'Pagada', paidDate: '2026-05-30', lines: [{ desc: 'Web + SEO — Hito 2: desarrollo', qty: 1, price: 1200 }] },
    { id: 'F260008', clientId: 'cli-004', projectId: 'proj-003', date: '2026-05-20', dueDate: '2026-06-19', status: 'Pagada', paidDate: '2026-06-08', lines: [{ desc: 'Campaña de lanzamiento — Hito 2: producción', qty: 1, price: 1600 }] },
    { id: 'F260009', clientId: 'cli-001', projectId: null, date: '2026-06-01', dueDate: '2026-07-01', status: 'Pagada', paidDate: '2026-06-20', lines: [{ desc: 'Mantenimiento de marca — junio', qty: 1, price: 300 }] },
    { id: 'F260010', clientId: 'cli-006', projectId: null, date: '2026-06-08', dueDate: '2026-07-08', status: 'Pagada', paidDate: '2026-06-25', lines: [{ desc: 'Piezas gráficas — junio', qty: 1, price: 480 }] },
    { id: 'F260011', clientId: 'cli-002', projectId: 'proj-002', date: '2026-06-15', dueDate: '2026-07-15', status: 'Pagada', paidDate: '2026-07-02', lines: [{ desc: 'Web + SEO — Hito 3: lanzamiento y SEO on-page', qty: 1, price: 1200 }] },
    { id: 'F260012', clientId: 'cli-001', projectId: null, date: '2026-07-01', dueDate: '2026-07-31', status: 'Pagada', paidDate: '2026-07-22', lines: [{ desc: 'Mantenimiento de marca — julio', qty: 1, price: 300 }] },
    { id: 'F260013', clientId: 'cli-004', projectId: 'proj-003', date: '2026-07-10', dueDate: '2026-08-09', status: 'Pagada', paidDate: '2026-07-28', lines: [{ desc: 'Campaña de lanzamiento — Hito 3: cierre y resultados', qty: 1, price: 1600 }] },
    { id: 'F260014', clientId: 'cli-006', projectId: null, date: '2026-07-12', dueDate: '2026-08-11', status: 'Pagada', paidDate: '2026-08-01', lines: [{ desc: 'Piezas gráficas — julio', qty: 1, price: 480 }] },
    { id: 'F260015', clientId: 'cli-003', projectId: null, date: '2026-07-20', dueDate: '2026-08-19', status: 'Vencida', paidDate: null, lines: [{ desc: 'Mantenimiento de catálogo — julio', qty: 1, price: 350 }] },
    { id: 'F260016', clientId: 'cli-001', projectId: null, date: '2026-08-01', dueDate: '2026-08-27', status: 'Pendiente', paidDate: null, lines: [{ desc: 'Mantenimiento de marca — agosto', qty: 1, price: 300 }] },
    { id: 'F260017', clientId: 'cli-005', projectId: null, date: '2026-08-05', dueDate: '2026-09-04', status: 'Pendiente', paidDate: null, lines: [{ desc: 'Papelería corporativa — diseño y producción', qty: 1, price: 620 }] },
    { id: 'F260018', clientId: 'cli-006', projectId: null, date: '2026-08-12', dueDate: '2026-09-11', status: 'Pendiente', paidDate: null, lines: [{ desc: 'Piezas gráficas — agosto', qty: 1, price: 480 }] },
    { id: 'F260019', clientId: 'cli-002', projectId: 'proj-002', date: '2026-08-18', dueDate: '2026-09-17', status: 'Borrador', paidDate: null, lines: [{ desc: 'Soporte web — agosto', qty: 1, price: 250 }] }
  ];

  // ---------------------------------------------------------------
  // Gastos — Hosting / Software / Marketing / Oficina / Freelance
  // ---------------------------------------------------------------
  var EXPENSES = [
    { id: 'G260001', concept: 'Hosting web — marzo', category: 'Hosting', supplierId: 'prov-001', date: '2026-03-15', amount: 45, projectId: null },
    { id: 'G260002', concept: 'Licencia software de diseño (anual)', category: 'Software', supplierId: 'prov-004', date: '2026-03-18', amount: 120, projectId: null },
    { id: 'G260003', concept: 'Material de oficina', category: 'Oficina', supplierId: null, date: '2026-03-22', amount: 65, projectId: null },
    { id: 'G260004', concept: 'Ilustración — Panadería El Roble', category: 'Freelance', supplierId: 'prov-003', date: '2026-03-28', amount: 300, projectId: 'proj-001' },
    { id: 'G260005', concept: 'Hosting web — abril', category: 'Hosting', supplierId: 'prov-001', date: '2026-04-15', amount: 45, projectId: null },
    { id: 'G260006', concept: 'Impresión de materiales — campaña Vértice', category: 'Marketing', supplierId: 'prov-002', date: '2026-04-20', amount: 180, projectId: 'proj-003' },
    { id: 'G260007', concept: 'Material de oficina', category: 'Oficina', supplierId: null, date: '2026-04-25', amount: 40, projectId: null },
    { id: 'G260008', concept: 'Hosting web — mayo', category: 'Hosting', supplierId: 'prov-001', date: '2026-05-15', amount: 45, projectId: null },
    { id: 'G260009', concept: 'Ilustración — Clínica Dental Aurora', category: 'Freelance', supplierId: 'prov-003', date: '2026-05-22', amount: 250, projectId: 'proj-002' },
    { id: 'G260010', concept: 'Licencia software adicional', category: 'Software', supplierId: 'prov-004', date: '2026-05-30', amount: 60, projectId: null },
    { id: 'G260011', concept: 'Hosting web — junio', category: 'Hosting', supplierId: 'prov-001', date: '2026-06-15', amount: 45, projectId: null },
    { id: 'G260012', concept: 'Impresión de materiales — campaña Vértice', category: 'Marketing', supplierId: 'prov-002', date: '2026-06-18', amount: 210, projectId: 'proj-003' },
    { id: 'G260013', concept: 'Material de oficina', category: 'Oficina', supplierId: null, date: '2026-06-25', amount: 55, projectId: null },
    { id: 'G260014', concept: 'Hosting web — julio', category: 'Hosting', supplierId: 'prov-001', date: '2026-07-15', amount: 45, projectId: null },
    { id: 'G260015', concept: 'Ilustración — piezas varias', category: 'Freelance', supplierId: 'prov-003', date: '2026-07-20', amount: 280, projectId: null },
    { id: 'G260016', concept: 'Hosting web — agosto', category: 'Hosting', supplierId: 'prov-001', date: '2026-08-15', amount: 45, projectId: null },
    { id: 'G260017', concept: 'Material de oficina', category: 'Oficina', supplierId: null, date: '2026-08-10', amount: 70, projectId: null }
  ];

  var EXPENSE_MONTHLY_BUDGET = 250; // umbral de alerta de gasto mensual (config demo)

  // ---------------------------------------------------------------
  // Utilidades internas
  // ---------------------------------------------------------------
  function parseDate(s) { return new Date(s + 'T00:00:00'); }
  function monthKey(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); }
  function isSameMonth(dateStr, ref) {
    var d = parseDate(dateStr);
    return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
  }
  function addMonths(d, n) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }
  function invoiceTotal(inv) { return inv.lines.reduce(function (s, l) { return s + l.qty * l.price; }, 0); }
  function daysBetween(a, b) { return Math.round((b - a) / 86400000); }

  function clientById(id) { return CLIENTS.filter(function (c) { return c.id === id; })[0] || null; }
  function supplierById(id) { return SUPPLIERS.filter(function (s) { return s.id === id; })[0] || null; }
  function projectById(id) { return PROJECTS.filter(function (p) { return p.id === id; })[0] || null; }
  function invoiceById(id) { return INVOICES.filter(function (i) { return i.id === id; })[0] || null; }

  // ---------------------------------------------------------------
  // FinanceStore — capa de acceso pública. Ninguna vista debe leer
  // CLIENTS/INVOICES/etc. directamente; siempre a través de aquí.
  // ---------------------------------------------------------------
  var FinanceStore = {

    today: function () { return DEMO_TODAY; },

    company: { name: 'Estudio Nortia', tagline: 'Diseño y branding para pymes', sector: 'Diseño / Branding' },

    // --- Contactos ---
    clients: function () {
      return CLIENTS.map(function (c) {
        var invs = INVOICES.filter(function (i) { return i.clientId === c.id; });
        var billed = invs.filter(function (i) { return i.status !== 'Borrador'; })
          .reduce(function (s, i) { return s + invoiceTotal(i); }, 0);
        var pending = invs.filter(function (i) { return i.status === 'Pendiente' || i.status === 'Vencida'; })
          .reduce(function (s, i) { return s + invoiceTotal(i); }, 0);
        return Object.assign({}, c, { invoiceCount: invs.length, billedTotal: billed, pendingTotal: pending });
      });
    },
    client: function (id) { return clientById(id); },

    suppliers: function () {
      return SUPPLIERS.map(function (s) {
        var exps = EXPENSES.filter(function (e) { return e.supplierId === s.id; });
        var total = exps.reduce(function (sum, e) { return sum + e.amount; }, 0);
        return Object.assign({}, s, { expenseCount: exps.length, total: total });
      });
    },
    supplier: function (id) { return supplierById(id); },

    // --- Proyectos ---
    projects: function () {
      return PROJECTS.map(function (p) {
        var invs = INVOICES.filter(function (i) { return i.projectId === p.id; });
        var revenue = invs.reduce(function (s, i) { return s + invoiceTotal(i); }, 0);
        var exps = EXPENSES.filter(function (e) { return e.projectId === p.id; });
        var cost = exps.reduce(function (s, e) { return s + e.amount; }, 0);
        var margin = revenue - cost;
        var marginPct = revenue > 0 ? Math.round((margin / revenue) * 100) : 0;
        return Object.assign({}, p, {
          client: clientById(p.clientId),
          revenue: revenue, cost: cost, margin: margin, marginPct: marginPct,
          invoiceCount: invs.length
        });
      });
    },
    project: function (id) {
      var list = this.projects();
      return list.filter(function (p) { return p.id === id; })[0] || null;
    },

    // --- Presupuestos ---
    quotes: function () {
      return QUOTES.map(function (q) {
        return Object.assign({}, q, { client: clientById(q.clientId), project: q.projectId ? projectById(q.projectId) : null });
      });
    },
    quote: function (id) {
      return this.quotes().filter(function (q) { return q.id === id; })[0] || null;
    },

    // --- Facturas ---
    invoices: function () {
      return INVOICES.map(function (inv) {
        var total = invoiceTotal(inv);
        var due = parseDate(inv.dueDate);
        var overdueDays = inv.status === 'Vencida' ? daysBetween(due, DEMO_TODAY) : 0;
        var dueInDays = (inv.status === 'Pendiente') ? daysBetween(DEMO_TODAY, due) : null;
        return Object.assign({}, inv, {
          client: clientById(inv.clientId),
          project: inv.projectId ? projectById(inv.projectId) : null,
          total: total, overdueDays: overdueDays, dueInDays: dueInDays
        });
      });
    },
    invoice: function (id) {
      return this.invoices().filter(function (i) { return i.id === id; })[0] || null;
    },
    invoicesByClient: function (clientId) {
      return this.invoices().filter(function (i) { return i.clientId === clientId; });
    },
    invoicesByProject: function (projId) {
      return this.invoices().filter(function (i) { return i.projectId === projId; });
    },

    // --- Cobros (derivados de facturas Pagadas + pendientes) ---
    payments: function () {
      return this.invoices().filter(function (i) { return i.status === 'Pagada'; })
        .map(function (i) { return { invoice: i, date: i.paidDate, amount: i.total, client: i.client }; })
        .sort(function (a, b) { return parseDate(b.date) - parseDate(a.date); });
    },
    pendingCollections: function () {
      return this.invoices().filter(function (i) { return i.status === 'Pendiente' || i.status === 'Vencida'; })
        .sort(function (a, b) {
          if (a.status === 'Vencida' && b.status !== 'Vencida') return -1;
          if (b.status === 'Vencida' && a.status !== 'Vencida') return 1;
          return parseDate(a.dueDate) - parseDate(b.dueDate);
        });
    },
    upcomingDue: function (days) {
      days = days || 7;
      return this.invoices().filter(function (i) {
        return i.status === 'Pendiente' && i.dueInDays !== null && i.dueInDays >= 0 && i.dueInDays <= days;
      });
    },

    // --- Gastos ---
    expenses: function () {
      return EXPENSES.map(function (e) {
        return Object.assign({}, e, {
          supplier: e.supplierId ? supplierById(e.supplierId) : null,
          project: e.projectId ? projectById(e.projectId) : null
        });
      }).sort(function (a, b) { return parseDate(b.date) - parseDate(a.date); });
    },
    expensesByCategory: function () {
      var byCategory = {};
      EXPENSES.forEach(function (e) {
        byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
      });
      return Object.keys(byCategory).map(function (cat) { return { category: cat, total: byCategory[cat] }; })
        .sort(function (a, b) { return b.total - a.total; });
    },
    monthlyExpenseBudget: function () { return EXPENSE_MONTHLY_BUDGET; },

    // --- Series mensuales (últimos N meses hasta DEMO_TODAY) ---
    monthlySeries: function (n) {
      n = n || 6;
      var months = [];
      for (var i = n - 1; i >= 0; i--) {
        var ref = addMonths(DEMO_TODAY, -i);
        var key = monthKey(ref);
        var billed = INVOICES.filter(function (inv) { return inv.status !== 'Borrador' && isSameMonth(inv.date, ref); })
          .reduce(function (s, inv) { return s + invoiceTotal(inv); }, 0);
        var collected = INVOICES.filter(function (inv) { return inv.status === 'Pagada' && isSameMonth(inv.paidDate, ref); })
          .reduce(function (s, inv) { return s + invoiceTotal(inv); }, 0);
        var spent = EXPENSES.filter(function (e) { return isSameMonth(e.date, ref); })
          .reduce(function (s, e) { return s + e.amount; }, 0);
        months.push({
          key: key,
          label: ref.toLocaleDateString('es-ES', { month: 'short' }).replace('.', ''),
          billed: billed, collected: collected, spent: spent, result: collected - spent
        });
      }
      return months;
    },

    // --- Dashboard ---
    dashboard: function () {
      var self = this;
      var series = this.monthlySeries(6);
      var thisMonth = series[series.length - 1];
      var lastMonth = series[series.length - 2];
      var pending = this.pendingCollections();
      var pendingTotal = pending.reduce(function (s, i) { return s + i.total; }, 0);
      var overdueList = pending.filter(function (i) { return i.status === 'Vencida'; });
      var overdueTotal = overdueList.reduce(function (s, i) { return s + i.total; }, 0);
      var expensesThisMonth = EXPENSES.filter(function (e) { return isSameMonth(e.date, DEMO_TODAY); })
        .reduce(function (s, e) { return s + e.amount; }, 0);
      var projects = this.projects().filter(function (p) { return p.status === 'En curso'; });
      var upcoming = this.upcomingDue(7);
      var overdue = overdueList;
      var allProjects = this.projects();
      var draftInvoices = this.invoices().filter(function (i) { return i.status === 'Borrador'; });
      var sentQuotes = this.quotes().filter(function (q) { return q.status === 'Enviado'; });
      var billedTotalAllTime = this.invoices().filter(function (i) { return i.status !== 'Borrador'; }).reduce(function (s, i) { return s + i.total; }, 0);
      var collectedTotalAllTime = this.payments().reduce(function (s, p) { return s + p.amount; }, 0);
      var expensesTotalAllTime = EXPENSES.reduce(function (s, e) { return s + e.amount; }, 0);

      // --- Deudor principal (mayor importe pendiente por cliente) ---
      var byClient = {};
      pending.forEach(function (i) {
        byClient[i.clientId] = (byClient[i.clientId] || 0) + i.total;
      });
      var topDebtorId = Object.keys(byClient).sort(function (a, b) { return byClient[b] - byClient[a]; })[0];
      var topDebtor = topDebtorId ? { client: clientById(topDebtorId), total: byClient[topDebtorId] } : null;

      // --- Proyecto con menor margen (entre los que facturan) ---
      var billingProjects = allProjects.filter(function (p) { return p.revenue > 0; });
      var lowestMarginProject = billingProjects.length
        ? billingProjects.reduce(function (a, b) { return b.marginPct < a.marginPct ? b : a; })
        : null;

      // --- Insight: frase única en lenguaje natural ---
      var diff = thisMonth.collected - thisMonth.spent;
      var insightText = 'Este mes has cobrado ' + fmtEUR(thisMonth.collected) + ' y gastado ' + fmtEUR(thisMonth.spent) + ': vas ' + fmtEUR(Math.abs(diff)) + ' ' + (diff >= 0 ? 'por encima' : 'por debajo') + '.';
      var insightBullets = [];
      if (pendingTotal > 0) {
        var b1 = 'Te deben ' + fmtEUR(pendingTotal) + ', de los que ' + fmtEUR(overdueTotal) + ' ya han vencido';
        if (topDebtor) b1 += '; ' + fmtEUR(topDebtor.total) + ' los debe ' + topDebtor.client.name + '.';
        else b1 += '.';
        insightBullets.push(b1);
      }
      if (lowestMarginProject) {
        insightBullets.push('El proyecto con menor margen es "' + lowestMarginProject.name + '", con un ' + lowestMarginProject.marginPct + '% de rentabilidad.');
      }

      // --- Qué hay que hacer ---
      var todos = [];
      if (overdueList.length) {
        todos.push({ id: 'overdue', label: 'Facturas vencidas sin cobrar', count: overdueList.length, amount: overdueTotal, note: 'Reclama el cobro o acuerda un plan de pago.', view: 'cobros', severity: 'high' });
      }
      if (draftInvoices.length) {
        var draftTotal = draftInvoices.reduce(function (s, i) { return s + i.total; }, 0);
        todos.push({ id: 'drafts', label: 'Facturas en borrador sin emitir', count: draftInvoices.length, amount: draftTotal, note: 'Hasta que no se emiten, no generan derecho de cobro.', view: 'facturas', severity: 'medium' });
      }
      if (sentQuotes.length) {
        var sentTotal = sentQuotes.reduce(function (s, q) { return s + q.amount; }, 0);
        todos.push({ id: 'quotes', label: 'Presupuestos enviados sin respuesta', count: sentQuotes.length, amount: sentTotal, note: 'Haz seguimiento antes de que el cliente los olvide.', view: 'presupuestos', severity: 'low' });
      }

      // --- Antigüedad de la deuda ---
      var aging = { current: 0, d1_30: 0, d31_60: 0, d60plus: 0 };
      pending.forEach(function (i) {
        if (i.status !== 'Vencida') { aging.current += i.total; return; }
        if (i.overdueDays <= 30) aging.d1_30 += i.total;
        else if (i.overdueDays <= 60) aging.d31_60 += i.total;
        else aging.d60plus += i.total;
      });

      return {
        billedThisMonth: thisMonth.billed, billedLastMonth: lastMonth.billed,
        collectedThisMonth: thisMonth.collected,
        pendingTotal: pendingTotal, pendingCount: pending.length,
        overdueTotal: overdueTotal,
        expensesThisMonth: expensesThisMonth, expenseBudget: EXPENSE_MONTHLY_BUDGET,
        upcoming: upcoming, overdue: overdue,
        activeProjects: projects,
        activeProjectsCount: projects.length,
        series: series,
        billedTotalAllTime: billedTotalAllTime,
        collectedTotalAllTime: collectedTotalAllTime,
        expensesTotalAllTime: expensesTotalAllTime,
        marginTotalAllTime: billedTotalAllTime - expensesTotalAllTime,
        insight: { text: insightText, bullets: insightBullets },
        todos: todos,
        aging: aging
      };
    },

    // --- Pregunta a Finanzas: preguntas predefinidas con respuesta
    // calculada en vivo a partir de los datos anteriores, nunca texto
    // suelto sin relación con las cifras reales de la demo. ---
    askQuestions: function () {
      var self = this;
      return [
        {
          q: '¿Cuánto hemos cobrado este mes?',
          a: function () {
            var m = self.monthlySeries(1)[0];
            var paidThisMonth = self.payments().filter(function (p) { return isSameMonth(p.date, DEMO_TODAY); });
            return {
              text: 'Este mes se han cobrado ' + fmtEUR(m.collected) + ', repartidos en ' + paidThisMonth.length + ' factura' + (paidThisMonth.length === 1 ? '' : 's') + '.',
              refs: paidThisMonth.map(function (p) { return { type: 'invoice', id: p.invoice.id }; })
            };
          }
        },
        {
          q: '¿Qué facturas están pendientes?',
          a: function () {
            var pending = self.pendingCollections();
            var total = pending.reduce(function (s, i) { return s + i.total; }, 0);
            var overdue = pending.filter(function (i) { return i.status === 'Vencida'; });
            return {
              text: 'Hay ' + pending.length + ' facturas pendientes de cobro por ' + fmtEUR(total) + (overdue.length ? ', de las cuales ' + overdue.length + ' ya está' + (overdue.length === 1 ? '' : 'n') + ' vencida' + (overdue.length === 1 ? '' : 's') + '.' : '.'),
              refs: pending.map(function (i) { return { type: 'invoice', id: i.id }; })
            };
          }
        },
        {
          q: '¿Cuál ha sido nuestro mejor mes?',
          a: function () {
            var series = self.monthlySeries(6);
            var best = series.reduce(function (a, b) { return b.result > a.result ? b : a; });
            return {
              text: 'El mejor mes de este periodo fue ' + best.label + ', con un resultado de ' + fmtEUR(best.result) + ' (' + fmtEUR(best.collected) + ' cobrados frente a ' + fmtEUR(best.spent) + ' de gasto).',
              refs: []
            };
          }
        },
        {
          q: '¿Dónde estamos gastando más?',
          a: function () {
            var byCat = self.expensesByCategory();
            var top = byCat[0];
            var total = byCat.reduce(function (s, c) { return s + c.total; }, 0);
            var pct = Math.round((top.total / total) * 100);
            return {
              text: 'La categoría con más gasto acumulado es "' + top.category + '", con ' + fmtEUR(top.total) + ' (' + pct + '% del gasto total registrado).',
              refs: []
            };
          }
        },
        {
          q: '¿Qué proyecto es más rentable?',
          a: function () {
            var projects = self.projects().filter(function (p) { return p.revenue > 0; });
            var best = projects.reduce(function (a, b) { return b.marginPct > a.marginPct ? b : a; });
            return {
              text: '"' + best.name + '" (' + best.client.name + ') tiene el margen más alto: ' + fmtEUR(best.margin) + ' de rentabilidad sobre ' + fmtEUR(best.revenue) + ' facturados (' + best.marginPct + '%).',
              refs: [{ type: 'project', id: best.id }]
            };
          }
        }
      ];
    }
  };

  function fmtEUR(n) {
    return n.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' €';
  }

  global.FinanceStore = FinanceStore;
  global.FinanceFmt = { eur: fmtEUR };

})(window);
