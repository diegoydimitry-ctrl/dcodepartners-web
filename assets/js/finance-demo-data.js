/*
 * D-Code Finance — capa de datos de la demo pública.
 *
 * Este archivo NO es una interfaz inventada para marketing: los tipos de
 * dominio (Cliente/Factura/Presupuesto/Gasto/Proyecto/Cobro/DashboardSnapshot)
 * y el propio dataset ficticio están tomados 1:1 del adaptador "mock" que ya
 * existe en el repositorio real de D-Code Finance
 * (src/lib/data/types.ts + src/lib/data/mock-adapter.ts), el mismo que el
 * producto real usa cuando DATA_SOURCE=mock. No se han inventado clientes,
 * facturas, cifras ni relaciones nuevas para la web -- es la misma "empresa
 * ficticia que parece estar funcionando realmente" que ya usa el equipo de
 * producto para desarrollar y probar la interfaz.
 *
 * Aislamiento: cero llamadas de red, cero credenciales, cero dependencia de
 * Airtable/n8n/PostgreSQL. Ningún dato aquí es real; todos los dominios de
 * email usan ".example" (RFC 2606, reservado y no resoluble).
 *
 * Capa de acceso (FinanceStore): expone exactamente los mismos métodos que
 * la interfaz DataAdapter real (getDashboardSnapshot, listFacturas,
 * getFactura, listPresupuestos, getPresupuesto, listClientes, getCliente,
 * listCobros, listGastos, getGasto, listProyectos, getProyecto), más
 * askQuestions() para "Pregunta a Finanzas" -- calculado en el cliente sobre
 * este mismo dataset, sin llamar nunca al webhook real de IA Financiera.
 */
(function (global) {
  'use strict';

  var CLIENTES = [
    { id: 'mock-cli-1', empresa: 'Nortex Logística S.L.', estado: 'Cliente', sector: 'Logística', web: 'https://nortex-demo.example', email: 'facturacion@nortex-demo.example', telefono: '+34 900 000 001', nif: 'B00000001', direccionFiscal: 'Calle Ejemplo 1, Madrid', valorEstimado: 18000, valorReal: 21400, cuotaMensual: 1200, facturacionActiva: true, modo: 'Prueba', facturaIds: ['mock-fac-1', 'mock-fac-2'] },
    { id: 'mock-cli-2', empresa: 'Bluewave Retail', estado: 'Cliente', sector: 'Retail', web: 'https://bluewave-demo.example', email: 'admin@bluewave-demo.example', telefono: '+34 900 000 002', nif: 'B00000002', direccionFiscal: 'Av. Ejemplo 22, Barcelona', valorEstimado: 9600, valorReal: 9600, cuotaMensual: 800, facturacionActiva: true, modo: 'Prueba', facturaIds: ['mock-fac-3'] },
    { id: 'mock-cli-3', empresa: 'Ferretera del Sur', estado: 'Cliente', sector: 'Industrial', web: null, email: 'contacto@ferreterasur-demo.example', telefono: '+34 900 000 003', nif: 'B00000003', direccionFiscal: 'Polígono Ejemplo, Sevilla', valorEstimado: 4200, valorReal: 3900, cuotaMensual: null, facturacionActiva: true, modo: 'Prueba', facturaIds: ['mock-fac-4'] },
    { id: 'mock-cli-4', empresa: 'Clínica Dental Vera', estado: 'Prospecto', sector: 'Salud', web: 'https://clinicavera-demo.example', email: 'info@clinicavera-demo.example', telefono: '+34 900 000 004', nif: null, direccionFiscal: null, valorEstimado: 6000, valorReal: null, cuotaMensual: null, facturacionActiva: false, modo: 'Prueba', facturaIds: [] },
    { id: 'mock-cli-5', empresa: 'Grupo Alimentario Prat', estado: 'Cliente', sector: 'Alimentación', web: 'https://alimentariaprat-demo.example', email: 'pagos@alimentariaprat-demo.example', telefono: '+34 900 000 005', nif: 'B00000005', direccionFiscal: 'Carrer Ejemplo 5, Girona', valorEstimado: 15000, valorReal: 15000, cuotaMensual: 1500, facturacionActiva: true, modo: 'Prueba', facturaIds: ['mock-fac-5', 'mock-fac-6'] }
  ];

  var FACTURAS = [
    { id: 'mock-fac-1', numero: '2026-014', clienteIds: ['mock-cli-1'], clienteNombre: 'Nortex Logística S.L.', proyecto: 'Automatización de rutas', fechaEmision: '2026-07-01', fechaVencimiento: '2026-07-31', importe: 1200, estado: 'Enviada', pagada: false, estadoCobro: 'Vencido', importeCobrado: 0, metodoPago: null, fechaPago: null, presupuestoOrigenId: 'mock-pre-1', proyectoOrigenId: null, recordatoriosEnviados: 2, fechaUltimoRecordatorio: '2026-08-10', observaciones: null },
    { id: 'mock-fac-2', numero: '2026-021', clienteIds: ['mock-cli-1'], clienteNombre: 'Nortex Logística S.L.', proyecto: 'Automatización de rutas', fechaEmision: '2026-08-01', fechaVencimiento: '2026-08-31', importe: 1200, estado: 'Enviada', pagada: false, estadoCobro: 'Pendiente', importeCobrado: 0, metodoPago: null, fechaPago: null, presupuestoOrigenId: null, proyectoOrigenId: 'mock-proy-1', recordatoriosEnviados: 0, fechaUltimoRecordatorio: null, observaciones: null },
    { id: 'mock-fac-3', numero: '2026-018', clienteIds: ['mock-cli-2'], clienteNombre: 'Bluewave Retail', proyecto: 'Panel de KPIs', fechaEmision: '2026-07-15', fechaVencimiento: '2026-08-14', importe: 800, estado: 'Pagada', pagada: true, estadoCobro: 'Cobrado', importeCobrado: 800, metodoPago: 'Transferencia', fechaPago: '2026-08-05', presupuestoOrigenId: 'mock-pre-2', proyectoOrigenId: null, recordatoriosEnviados: 0, fechaUltimoRecordatorio: null, observaciones: null },
    { id: 'mock-fac-4', numero: '2026-011', clienteIds: ['mock-cli-3'], clienteNombre: 'Ferretera del Sur', proyecto: 'Inventario IA', fechaEmision: '2026-06-20', fechaVencimiento: '2026-07-20', importe: 3900, estado: 'Enviada', pagada: false, estadoCobro: 'En seguimiento', importeCobrado: 1000, metodoPago: null, fechaPago: null, presupuestoOrigenId: 'mock-pre-3', proyectoOrigenId: null, recordatoriosEnviados: 3, fechaUltimoRecordatorio: '2026-08-12', observaciones: 'Cliente ha solicitado plan de pagos.' },
    { id: 'mock-fac-5', numero: '2026-025', clienteIds: ['mock-cli-5'], clienteNombre: 'Grupo Alimentario Prat', proyecto: 'Trazabilidad de lotes', fechaEmision: '2026-08-05', fechaVencimiento: '2026-09-04', importe: 1500, estado: 'Enviada', pagada: false, estadoCobro: 'Pendiente', importeCobrado: 0, metodoPago: null, fechaPago: null, presupuestoOrigenId: null, proyectoOrigenId: 'mock-proy-2', recordatoriosEnviados: 0, fechaUltimoRecordatorio: null, observaciones: null },
    { id: 'mock-fac-6', numero: '2026-006', clienteIds: ['mock-cli-5'], clienteNombre: 'Grupo Alimentario Prat', proyecto: 'Trazabilidad de lotes', fechaEmision: '2026-05-01', fechaVencimiento: '2026-05-31', importe: 1500, estado: 'Pagada', pagada: true, estadoCobro: 'Cobrado', importeCobrado: 1500, metodoPago: 'Transferencia', fechaPago: '2026-05-28', presupuestoOrigenId: null, proyectoOrigenId: 'mock-proy-2', recordatoriosEnviados: 0, fechaUltimoRecordatorio: null, observaciones: null },
    { id: 'mock-fac-7', numero: '2026-027', clienteIds: ['mock-cli-2'], clienteNombre: 'Bluewave Retail', proyecto: null, fechaEmision: null, fechaVencimiento: null, importe: 800, estado: 'Borrador', pagada: false, estadoCobro: null, importeCobrado: null, metodoPago: null, fechaPago: null, presupuestoOrigenId: null, proyectoOrigenId: null, recordatoriosEnviados: null, fechaUltimoRecordatorio: null, observaciones: 'Pendiente de aprobación para envío.' }
  ];

  var PRESUPUESTOS = [
    { id: 'mock-pre-1', empresa: 'Nortex Logística S.L.', estado: 'Aceptada', fechaGeneracion: '2026-06-15', importe: 1200, resumenEjecutivo: 'Automatización de asignación de rutas con IA.', serviciosPropuestos: 'Automatización n8n + panel de seguimiento', aceptadaPorCliente: true, fechaAceptacion: '2026-06-20', clienteRecordId: 'mock-cli-1', facturaGeneradaId: 'mock-fac-1' },
    { id: 'mock-pre-2', empresa: 'Bluewave Retail', estado: 'Aceptada', fechaGeneracion: '2026-07-01', importe: 800, resumenEjecutivo: 'Panel de KPIs de ventas en tiempo real.', serviciosPropuestos: 'Dashboard + integración TPV', aceptadaPorCliente: true, fechaAceptacion: '2026-07-08', clienteRecordId: 'mock-cli-2', facturaGeneradaId: 'mock-fac-3' },
    { id: 'mock-pre-3', empresa: 'Ferretera del Sur', estado: 'Aceptada', fechaGeneracion: '2026-06-01', importe: 3900, resumenEjecutivo: 'Sistema de inventario asistido por IA.', serviciosPropuestos: 'Clasificación automática de stock', aceptadaPorCliente: true, fechaAceptacion: '2026-06-10', clienteRecordId: 'mock-cli-3', facturaGeneradaId: 'mock-fac-4' },
    { id: 'mock-pre-4', empresa: 'Clínica Dental Vera', estado: 'Enviada', fechaGeneracion: '2026-08-10', importe: 6000, resumenEjecutivo: 'Automatización de agenda y recordatorios de citas.', serviciosPropuestos: 'Bot de WhatsApp + calendario sincronizado', aceptadaPorCliente: false, fechaAceptacion: null, clienteRecordId: 'mock-cli-4', facturaGeneradaId: null }
  ];

  var GASTOS = [
    { id: 'mock-gas-1', proveedor: 'CloudHost Servers', importe: 89.9, iva: 18.88, fecha: '2026-08-01', concepto: 'Hosting mensual infraestructura', categoria: 'Infraestructura', estadoRevision: 'Aprobado', proyectoRecordId: null, notasRevision: null },
    { id: 'mock-gas-2', proveedor: 'Estudio Diseño Nubla', importe: 450, iva: 94.5, fecha: '2026-07-22', concepto: 'Identidad visual cliente Nortex', categoria: 'Subcontratación', estadoRevision: 'Aprobado', proyectoRecordId: 'mock-proy-1', notasRevision: null },
    { id: 'mock-gas-3', proveedor: 'OpenAPI Tools SL', importe: 120, iva: 25.2, fecha: '2026-08-05', concepto: 'Licencia API terceros', categoria: 'Software', estadoRevision: 'Pendiente revisión', proyectoRecordId: 'mock-proy-2', notasRevision: null },
    { id: 'mock-gas-4', proveedor: 'Viajes Iberia Corp', importe: 210, iva: null, fecha: '2026-07-30', concepto: 'Desplazamiento reunión cliente', categoria: 'Viajes', estadoRevision: 'Pendiente revisión', proyectoRecordId: null, notasRevision: 'Falta justificante de billete.' }
  ];

  var PROYECTOS = [
    { id: 'mock-proy-1', nombre: 'Automatización de rutas', empresa: 'Nortex Logística S.L.', estado: 'En curso', fechaInicio: '2026-06-20', fechaEntregaPrevista: '2026-09-30', fechaEntregaReal: null, serviciosContratados: 'Automatización n8n + panel de seguimiento', responsable: 'Equipo D-Code', totalFacturado: 2400, totalCobrado: 0, totalGastos: 450, rentabilidad: 1950 },
    { id: 'mock-proy-2', nombre: 'Trazabilidad de lotes', empresa: 'Grupo Alimentario Prat', estado: 'En curso', fechaInicio: '2026-04-10', fechaEntregaPrevista: '2026-08-30', fechaEntregaReal: null, serviciosContratados: 'Trazabilidad IA + panel de calidad', responsable: 'Equipo D-Code', totalFacturado: 3000, totalCobrado: 1500, totalGastos: 120, rentabilidad: 2880 },
    { id: 'mock-proy-3', nombre: 'Inventario IA', empresa: 'Ferretera del Sur', estado: 'Entregado', fechaInicio: '2026-05-01', fechaEntregaPrevista: '2026-06-15', fechaEntregaReal: '2026-06-18', serviciosContratados: 'Clasificación automática de stock', responsable: 'Equipo D-Code', totalFacturado: 3900, totalCobrado: 1000, totalGastos: 0, rentabilidad: 3900 }
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
      '1 factura(s) vencida(s) sin cobrar',
      '1 factura(s) en seguimiento por impago reiterado',
      '2 gasto(s) pendiente(s) de revisión humana',
      '1 factura(s) en Borrador pendiente(s) de aprobación para envío'
    ]
  };

  // ---------------------------------------------------------------
  // Formato -- mismas reglas que src/lib/format.ts del producto real
  // ---------------------------------------------------------------
  function fmtEUR(value) {
    if (value === null || value === undefined) return 'Sin datos suficientes';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
  }
  function fmtFecha(value) {
    if (!value) return '—';
    var d = new Date(value);
    if (isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
  }
  function fmtFechaHora(value) {
    if (!value) return '—';
    var d = new Date(value);
    if (isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d);
  }

  function byId(list, id) { return list.filter(function (x) { return x.id === id; })[0] || null; }
  function clienteById(id) { return byId(CLIENTES, id); }
  function facturaById(id) { return byId(FACTURAS, id); }

  function derivarCobros() {
    return FACTURAS.filter(function (f) { return f.estado === 'Enviada' || f.estado === 'Pagada'; })
      .map(function (f) {
        return {
          facturaId: f.id, numeroFactura: f.numero, clienteNombre: f.clienteNombre,
          importe: f.importe, importeCobrado: f.importeCobrado || 0,
          pendiente: f.importe - (f.importeCobrado || 0),
          estadoCobro: f.estadoCobro || 'Pendiente',
          fechaVencimiento: f.fechaVencimiento, recordatoriosEnviados: f.recordatoriosEnviados
        };
      });
  }

  // ---------------------------------------------------------------
  // FinanceStore -- mismo contrato que DataAdapter (src/lib/data/adapter.ts)
  // ---------------------------------------------------------------
  var FinanceStore = {
    empresa: { nombre: 'D-Code Finance', tagline: 'Panel financiero' },

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

    // --- Pregunta a Finanzas: mismas 3 sugerencias que en el producto
    // real (src/app/(app)/ia/page.tsx), calculadas aquí sobre el dataset
    // de la demo en vez de llamar al webhook real de IA Financiera. ---
    askQuestions: function () {
      var self = this;
      return [
        {
          q: '¿Cuánto me deben en total y qué facturas están vencidas?',
          a: function () {
            var cobros = self.listCobros();
            var pendientes = cobros.filter(function (c) { return c.pendiente > 0; });
            var totalPendiente = pendientes.reduce(function (s, c) { return s + c.pendiente; }, 0);
            var vencidas = cobros.filter(function (c) { return c.estadoCobro === 'Vencido'; });
            var text = 'En total te deben ' + fmtEUR(totalPendiente) + ' repartidos en ' + pendientes.length + ' factura(s).';
            if (vencidas.length) {
              text += ' De ellas, ' + vencidas.length + ' ya está' + (vencidas.length === 1 ? '' : 'n') + ' vencida' + (vencidas.length === 1 ? '' : 's') + ': ' +
                vencidas.map(function (c) { return c.numeroFactura + ' (' + (c.clienteNombre || 'cliente sin resolver') + ')'; }).join(', ') + '.';
            }
            return { text: text, refs: vencidas.map(function (c) { return { type: 'facturas', id: c.facturaId, label: c.numeroFactura }; }) };
          }
        },
        {
          q: '¿Cuál es la rentabilidad de los proyectos activos?',
          a: function () {
            var activos = self.listProyectos().filter(function (p) { return p.estado === 'En curso'; });
            if (!activos.length) return { text: 'No hay proyectos en curso ahora mismo.', refs: [] };
            var text = activos.map(function (p) {
              return p.nombre + ' (' + p.empresa + '): ' + fmtEUR(p.rentabilidad) + ' de rentabilidad sobre ' + fmtEUR(p.totalFacturado) + ' facturados.';
            }).join(' ');
            return { text: text, refs: activos.map(function (p) { return { type: 'proyectos', id: p.id, label: p.nombre }; }) };
          }
        },
        {
          q: '¿En qué categoría hemos gastado más este mes?',
          a: function () {
            var gastos = self.listGastos();
            var porCategoria = {};
            gastos.forEach(function (g) {
              var cat = g.categoria || 'Sin categoría';
              porCategoria[cat] = (porCategoria[cat] || 0) + g.importe;
            });
            var categorias = Object.keys(porCategoria).sort(function (a, b) { return porCategoria[b] - porCategoria[a]; });
            var top = categorias[0];
            var total = gastos.reduce(function (s, g) { return s + g.importe; }, 0);
            var pct = total > 0 ? Math.round((porCategoria[top] / total) * 100) : 0;
            return {
              text: 'La categoría con más gasto es "' + top + '", con ' + fmtEUR(porCategoria[top]) + ' (' + pct + '% del gasto total registrado).',
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
