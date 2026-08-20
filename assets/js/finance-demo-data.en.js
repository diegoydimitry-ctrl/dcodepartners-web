/*
 * D-Code Finance — demo data layer (English mirror).
 *
 * Same structure, same underlying figures and dates as
 * finance-demo-data.js (the Spanish original) -- only labels,
 * categories, statuses and descriptions are translated, so both
 * language versions of the demo tell the exact same coherent story.
 * See finance-demo-data.js for the full architecture note: this is a
 * static mock-data layer, fully isolated from the real financial
 * system Auditor n8n/Airtable is building -- no network calls, no
 * credentials, no real data.
 */
(function (global) {
  'use strict';

  var DEMO_TODAY = new Date(2026, 7, 20); // Aug 20, 2026

  var CLIENTS = [
    { id: 'cli-001', name: 'El Roble Bakery', sector: 'Food & beverage', email: 'hello@elroble-bakery.example', phone: '+34 900 100 201', nif: 'B00100201', since: '2026-03-01' },
    { id: 'cli-002', name: 'Aurora Dental Clinic', sector: 'Healthcare', email: 'admin@auroradental.example', phone: '+34 900 100 202', nif: 'B00100202', since: '2026-04-01' },
    { id: 'cli-003', name: 'Cabrera Hardware', sector: 'Retail', email: 'orders@cabrerahardware.example', phone: '+34 900 100 203', nif: 'B00100203', since: '2026-03-01' },
    { id: 'cli-004', name: 'Vértice Gym', sector: 'Sports & wellness', email: 'info@verticegym.example', phone: '+34 900 100 204', nif: 'B00100204', since: '2026-04-01' },
    { id: 'cli-005', name: 'Larra & Associates Law Firm', sector: 'Legal services', email: 'contact@larralaw.example', phone: '+34 900 100 205', nif: 'B00100205', since: '2026-03-01' },
    { id: 'cli-006', name: 'Meridian Optics', sector: 'Healthcare', email: 'hello@meridianoptics.example', phone: '+34 900 100 206', nif: 'B00100206', since: '2026-04-01' }
  ];

  var SUPPLIERS = [
    { id: 'prov-001', name: 'Cloudbyte Hosting', category: 'Hosting', email: 'billing@cloudbyte.example', nif: 'B00200001' },
    { id: 'prov-002', name: 'Solvento Print Shop', category: 'Marketing', email: 'orders@solventoprint.example', nif: 'B00200002' },
    { id: 'prov-003', name: 'Marta Ibáñez — Freelance Illustration', category: 'Freelance', email: 'marta.ibanez@freelance.example', nif: '00200003X' },
    { id: 'prov-004', name: 'SoftLicencias SL', category: 'Software', email: 'sales@softlicencias.example', nif: 'B00200004' }
  ];

  var PROJECTS = [
    { id: 'proj-001', name: 'Brand redesign', clientId: 'cli-001', status: 'Completed', start: '2026-03-01', end: '2026-04-10' },
    { id: 'proj-002', name: 'Website + SEO', clientId: 'cli-002', status: 'In progress', start: '2026-04-05', end: null },
    { id: 'proj-003', name: 'Launch campaign', clientId: 'cli-004', status: 'In progress', start: '2026-04-10', end: null },
    { id: 'proj-004', name: 'Visual identity', clientId: 'cli-005', status: 'Completed', start: '2026-03-10', end: '2026-04-18' },
    { id: 'proj-005', name: 'Product catalog', clientId: 'cli-003', status: 'Completed', start: '2026-03-15', end: '2026-03-30' }
  ];

  var QUOTES = [
    { id: 'P260001', clientId: 'cli-001', title: 'Brand redesign', amount: 2400, status: 'Accepted', date: '2026-02-20', projectId: 'proj-001' },
    { id: 'P260002', clientId: 'cli-005', title: 'Visual identity', amount: 1800, status: 'Accepted', date: '2026-02-25', projectId: 'proj-004' },
    { id: 'P260003', clientId: 'cli-003', title: 'Product catalog', amount: 950, status: 'Accepted', date: '2026-03-02', projectId: 'proj-005' },
    { id: 'P260004', clientId: 'cli-002', title: 'Website + SEO (3 milestones)', amount: 3600, status: 'Accepted', date: '2026-03-25', projectId: 'proj-002' },
    { id: 'P260005', clientId: 'cli-004', title: 'Launch campaign (3 milestones)', amount: 4800, status: 'Accepted', date: '2026-04-01', projectId: 'proj-003' },
    { id: 'P260006', clientId: 'cli-006', title: 'Monthly graphic assets', amount: 480, status: 'Accepted', date: '2026-04-10', projectId: null },
    { id: 'P260007', clientId: 'cli-006', title: 'Social media expansion', amount: 850, status: 'Sent', date: '2026-08-12', projectId: null },
    { id: 'P260008', clientId: 'cli-003', title: '2027 catalog renewal', amount: 1100, status: 'Rejected', date: '2026-07-15', projectId: null },
    { id: 'P260009', clientId: 'cli-001', title: 'New packaging line', amount: 1350, status: 'Draft', date: '2026-08-18', projectId: null }
  ];

  var INVOICES = [
    { id: 'F260001', clientId: 'cli-001', projectId: 'proj-001', date: '2026-03-15', dueDate: '2026-04-14', status: 'Paid', paidDate: '2026-04-10', lines: [{ desc: 'Brand identity design', qty: 1, price: 2400 }] },
    { id: 'F260002', clientId: 'cli-005', projectId: 'proj-004', date: '2026-03-22', dueDate: '2026-04-21', status: 'Paid', paidDate: '2026-04-18', lines: [{ desc: 'Full visual identity', qty: 1, price: 1800 }] },
    { id: 'F260003', clientId: 'cli-003', projectId: 'proj-005', date: '2026-03-30', dueDate: '2026-04-29', status: 'Paid', paidDate: '2026-04-25', lines: [{ desc: 'Product catalog — design and layout', qty: 1, price: 950 }] },
    { id: 'F260004', clientId: 'cli-002', projectId: 'proj-002', date: '2026-04-10', dueDate: '2026-05-10', status: 'Paid', paidDate: '2026-05-05', lines: [{ desc: 'Website + SEO — Milestone 1: design and architecture', qty: 1, price: 1200 }] },
    { id: 'F260005', clientId: 'cli-004', projectId: 'proj-003', date: '2026-04-18', dueDate: '2026-05-18', status: 'Paid', paidDate: '2026-05-12', lines: [{ desc: 'Launch campaign — Milestone 1: strategy and assets', qty: 1, price: 1600 }] },
    { id: 'F260006', clientId: 'cli-006', projectId: null, date: '2026-04-25', dueDate: '2026-05-25', status: 'Paid', paidDate: '2026-04-30', lines: [{ desc: 'Graphic assets — April', qty: 1, price: 480 }] },
    { id: 'F260007', clientId: 'cli-002', projectId: 'proj-002', date: '2026-05-12', dueDate: '2026-06-11', status: 'Paid', paidDate: '2026-05-30', lines: [{ desc: 'Website + SEO — Milestone 2: development', qty: 1, price: 1200 }] },
    { id: 'F260008', clientId: 'cli-004', projectId: 'proj-003', date: '2026-05-20', dueDate: '2026-06-19', status: 'Paid', paidDate: '2026-06-08', lines: [{ desc: 'Launch campaign — Milestone 2: production', qty: 1, price: 1600 }] },
    { id: 'F260009', clientId: 'cli-001', projectId: null, date: '2026-06-01', dueDate: '2026-07-01', status: 'Paid', paidDate: '2026-06-20', lines: [{ desc: 'Brand maintenance — June', qty: 1, price: 300 }] },
    { id: 'F260010', clientId: 'cli-006', projectId: null, date: '2026-06-08', dueDate: '2026-07-08', status: 'Paid', paidDate: '2026-06-25', lines: [{ desc: 'Graphic assets — June', qty: 1, price: 480 }] },
    { id: 'F260011', clientId: 'cli-002', projectId: 'proj-002', date: '2026-06-15', dueDate: '2026-07-15', status: 'Paid', paidDate: '2026-07-02', lines: [{ desc: 'Website + SEO — Milestone 3: launch and on-page SEO', qty: 1, price: 1200 }] },
    { id: 'F260012', clientId: 'cli-001', projectId: null, date: '2026-07-01', dueDate: '2026-07-31', status: 'Paid', paidDate: '2026-07-22', lines: [{ desc: 'Brand maintenance — July', qty: 1, price: 300 }] },
    { id: 'F260013', clientId: 'cli-004', projectId: 'proj-003', date: '2026-07-10', dueDate: '2026-08-09', status: 'Paid', paidDate: '2026-07-28', lines: [{ desc: 'Launch campaign — Milestone 3: close-out and results', qty: 1, price: 1600 }] },
    { id: 'F260014', clientId: 'cli-006', projectId: null, date: '2026-07-12', dueDate: '2026-08-11', status: 'Paid', paidDate: '2026-08-01', lines: [{ desc: 'Graphic assets — July', qty: 1, price: 480 }] },
    { id: 'F260015', clientId: 'cli-003', projectId: null, date: '2026-07-20', dueDate: '2026-08-19', status: 'Overdue', paidDate: null, lines: [{ desc: 'Catalog maintenance — July', qty: 1, price: 350 }] },
    { id: 'F260016', clientId: 'cli-001', projectId: null, date: '2026-08-01', dueDate: '2026-08-27', status: 'Pending', paidDate: null, lines: [{ desc: 'Brand maintenance — August', qty: 1, price: 300 }] },
    { id: 'F260017', clientId: 'cli-005', projectId: null, date: '2026-08-05', dueDate: '2026-09-04', status: 'Pending', paidDate: null, lines: [{ desc: 'Corporate stationery — design and production', qty: 1, price: 620 }] },
    { id: 'F260018', clientId: 'cli-006', projectId: null, date: '2026-08-12', dueDate: '2026-09-11', status: 'Pending', paidDate: null, lines: [{ desc: 'Graphic assets — August', qty: 1, price: 480 }] },
    { id: 'F260019', clientId: 'cli-002', projectId: 'proj-002', date: '2026-08-18', dueDate: '2026-09-17', status: 'Draft', paidDate: null, lines: [{ desc: 'Website support — August', qty: 1, price: 250 }] }
  ];

  var EXPENSES = [
    { id: 'G260001', concept: 'Web hosting — March', category: 'Hosting', supplierId: 'prov-001', date: '2026-03-15', amount: 45, projectId: null },
    { id: 'G260002', concept: 'Design software license (annual)', category: 'Software', supplierId: 'prov-004', date: '2026-03-18', amount: 120, projectId: null },
    { id: 'G260003', concept: 'Office supplies', category: 'Office', supplierId: null, date: '2026-03-22', amount: 65, projectId: null },
    { id: 'G260004', concept: 'Illustration — El Roble Bakery', category: 'Freelance', supplierId: 'prov-003', date: '2026-03-28', amount: 300, projectId: 'proj-001' },
    { id: 'G260005', concept: 'Web hosting — April', category: 'Hosting', supplierId: 'prov-001', date: '2026-04-15', amount: 45, projectId: null },
    { id: 'G260006', concept: 'Printed materials — Vértice campaign', category: 'Marketing', supplierId: 'prov-002', date: '2026-04-20', amount: 180, projectId: 'proj-003' },
    { id: 'G260007', concept: 'Office supplies', category: 'Office', supplierId: null, date: '2026-04-25', amount: 40, projectId: null },
    { id: 'G260008', concept: 'Web hosting — May', category: 'Hosting', supplierId: 'prov-001', date: '2026-05-15', amount: 45, projectId: null },
    { id: 'G260009', concept: 'Illustration — Aurora Dental Clinic', category: 'Freelance', supplierId: 'prov-003', date: '2026-05-22', amount: 250, projectId: 'proj-002' },
    { id: 'G260010', concept: 'Additional software license', category: 'Software', supplierId: 'prov-004', date: '2026-05-30', amount: 60, projectId: null },
    { id: 'G260011', concept: 'Web hosting — June', category: 'Hosting', supplierId: 'prov-001', date: '2026-06-15', amount: 45, projectId: null },
    { id: 'G260012', concept: 'Printed materials — Vértice campaign', category: 'Marketing', supplierId: 'prov-002', date: '2026-06-18', amount: 210, projectId: 'proj-003' },
    { id: 'G260013', concept: 'Office supplies', category: 'Office', supplierId: null, date: '2026-06-25', amount: 55, projectId: null },
    { id: 'G260014', concept: 'Web hosting — July', category: 'Hosting', supplierId: 'prov-001', date: '2026-07-15', amount: 45, projectId: null },
    { id: 'G260015', concept: 'Illustration — assorted assets', category: 'Freelance', supplierId: 'prov-003', date: '2026-07-20', amount: 280, projectId: null },
    { id: 'G260016', concept: 'Web hosting — August', category: 'Hosting', supplierId: 'prov-001', date: '2026-08-15', amount: 45, projectId: null },
    { id: 'G260017', concept: 'Office supplies', category: 'Office', supplierId: null, date: '2026-08-10', amount: 70, projectId: null }
  ];

  var EXPENSE_MONTHLY_BUDGET = 250;

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

  var FinanceStore = {

    today: function () { return DEMO_TODAY; },

    company: { name: 'Nortia Studio', tagline: 'Design and branding for small businesses', sector: 'Design / Branding' },

    clients: function () {
      return CLIENTS.map(function (c) {
        var invs = INVOICES.filter(function (i) { return i.clientId === c.id; });
        var billed = invs.filter(function (i) { return i.status !== 'Draft'; })
          .reduce(function (s, i) { return s + invoiceTotal(i); }, 0);
        var pending = invs.filter(function (i) { return i.status === 'Pending' || i.status === 'Overdue'; })
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

    quotes: function () {
      return QUOTES.map(function (q) {
        return Object.assign({}, q, { client: clientById(q.clientId), project: q.projectId ? projectById(q.projectId) : null });
      });
    },
    quote: function (id) {
      return this.quotes().filter(function (q) { return q.id === id; })[0] || null;
    },

    invoices: function () {
      return INVOICES.map(function (inv) {
        var total = invoiceTotal(inv);
        var due = parseDate(inv.dueDate);
        var overdueDays = inv.status === 'Overdue' ? daysBetween(due, DEMO_TODAY) : 0;
        var dueInDays = (inv.status === 'Pending') ? daysBetween(DEMO_TODAY, due) : null;
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

    payments: function () {
      return this.invoices().filter(function (i) { return i.status === 'Paid'; })
        .map(function (i) { return { invoice: i, date: i.paidDate, amount: i.total, client: i.client }; })
        .sort(function (a, b) { return parseDate(b.date) - parseDate(a.date); });
    },
    pendingCollections: function () {
      return this.invoices().filter(function (i) { return i.status === 'Pending' || i.status === 'Overdue'; })
        .sort(function (a, b) {
          if (a.status === 'Overdue' && b.status !== 'Overdue') return -1;
          if (b.status === 'Overdue' && a.status !== 'Overdue') return 1;
          return parseDate(a.dueDate) - parseDate(b.dueDate);
        });
    },
    upcomingDue: function (days) {
      days = days || 7;
      return this.invoices().filter(function (i) {
        return i.status === 'Pending' && i.dueInDays !== null && i.dueInDays >= 0 && i.dueInDays <= days;
      });
    },

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

    monthlySeries: function (n) {
      n = n || 6;
      var months = [];
      for (var i = n - 1; i >= 0; i--) {
        var ref = addMonths(DEMO_TODAY, -i);
        var key = monthKey(ref);
        var billed = INVOICES.filter(function (inv) { return inv.status !== 'Draft' && isSameMonth(inv.date, ref); })
          .reduce(function (s, inv) { return s + invoiceTotal(inv); }, 0);
        var collected = INVOICES.filter(function (inv) { return inv.status === 'Paid' && isSameMonth(inv.paidDate, ref); })
          .reduce(function (s, inv) { return s + invoiceTotal(inv); }, 0);
        var spent = EXPENSES.filter(function (e) { return isSameMonth(e.date, ref); })
          .reduce(function (s, e) { return s + e.amount; }, 0);
        months.push({
          key: key,
          label: ref.toLocaleDateString('en-US', { month: 'short' }),
          billed: billed, collected: collected, spent: spent, result: collected - spent
        });
      }
      return months;
    },

    dashboard: function () {
      var series = this.monthlySeries(6);
      var thisMonth = series[series.length - 1];
      var lastMonth = series[series.length - 2];
      var pending = this.pendingCollections();
      var pendingTotal = pending.reduce(function (s, i) { return s + i.total; }, 0);
      var expensesThisMonth = EXPENSES.filter(function (e) { return isSameMonth(e.date, DEMO_TODAY); })
        .reduce(function (s, e) { return s + e.amount; }, 0);
      var projects = this.projects().filter(function (p) { return p.status === 'In progress'; });
      var upcoming = this.upcomingDue(7);
      var overdue = this.invoices().filter(function (i) { return i.status === 'Overdue'; });
      return {
        billedThisMonth: thisMonth.billed, billedLastMonth: lastMonth.billed,
        collectedThisMonth: thisMonth.collected,
        pendingTotal: pendingTotal, pendingCount: pending.length,
        expensesThisMonth: expensesThisMonth, expenseBudget: EXPENSE_MONTHLY_BUDGET,
        upcoming: upcoming, overdue: overdue,
        activeProjects: projects,
        series: series
      };
    },

    askQuestions: function () {
      var self = this;
      return [
        {
          q: 'How much have we collected this month?',
          a: function () {
            var m = self.monthlySeries(1)[0];
            var paidThisMonth = self.payments().filter(function (p) { return isSameMonth(p.date, DEMO_TODAY); });
            return {
              text: 'This month you’ve collected ' + fmtEUR(m.collected) + ', across ' + paidThisMonth.length + ' invoice' + (paidThisMonth.length === 1 ? '' : 's') + '.',
              refs: paidThisMonth.map(function (p) { return { type: 'invoice', id: p.invoice.id }; })
            };
          }
        },
        {
          q: 'Which invoices are pending?',
          a: function () {
            var pending = self.pendingCollections();
            var total = pending.reduce(function (s, i) { return s + i.total; }, 0);
            var overdue = pending.filter(function (i) { return i.status === 'Overdue'; });
            return {
              text: 'There are ' + pending.length + ' invoices pending collection for ' + fmtEUR(total) + (overdue.length ? ', of which ' + overdue.length + ' ' + (overdue.length === 1 ? 'is' : 'are') + ' already overdue.' : '.'),
              refs: pending.map(function (i) { return { type: 'invoice', id: i.id }; })
            };
          }
        },
        {
          q: 'What was our best month?',
          a: function () {
            var series = self.monthlySeries(6);
            var best = series.reduce(function (a, b) { return b.result > a.result ? b : a; });
            return {
              text: 'The best month in this period was ' + best.label + ', with a result of ' + fmtEUR(best.result) + ' (' + fmtEUR(best.collected) + ' collected against ' + fmtEUR(best.spent) + ' spent).',
              refs: []
            };
          }
        },
        {
          q: 'Where are we spending the most?',
          a: function () {
            var byCat = self.expensesByCategory();
            var top = byCat[0];
            var total = byCat.reduce(function (s, c) { return s + c.total; }, 0);
            var pct = Math.round((top.total / total) * 100);
            return {
              text: 'The category with the most accumulated spend is "' + top.category + '", at ' + fmtEUR(top.total) + ' (' + pct + '% of total recorded spend).',
              refs: []
            };
          }
        },
        {
          q: 'Which project is the most profitable?',
          a: function () {
            var projects = self.projects().filter(function (p) { return p.revenue > 0; });
            var best = projects.reduce(function (a, b) { return b.marginPct > a.marginPct ? b : a; });
            return {
              text: '"' + best.name + '" (' + best.client.name + ') has the highest margin: ' + fmtEUR(best.margin) + ' of profit on ' + fmtEUR(best.revenue) + ' billed (' + best.marginPct + '%).',
              refs: [{ type: 'project', id: best.id }]
            };
          }
        }
      ];
    }
  };

  function fmtEUR(n) {
    return '€' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  global.FinanceStore = FinanceStore;
  global.FinanceFmt = { eur: fmtEUR };

})(window);
