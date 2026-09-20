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
    return FACTURAS.filter(function (f) { return f.estado !== 'Borrador'; });
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
    var seguimiento = lista.filter(function (f) { return f.estadoCobro === 'En seguimiento'; });
    var gastosPendientes = GASTOS.filter(function (g) { return g.estadoRevision === 'Pendiente revisión'; });
    var borradores = FACTURAS.filter(function (f) { return f.estado === 'Borrador'; });

    var alertas = [];
    if (vencidas.length) alertas.push(vencidas.length + ' factura(s) vencida(s) sin cobrar, ' + fmtEUR(suma(vencidas, pendienteDe)));
    if (seguimiento.length) alertas.push(seguimiento.length + ' factura(s) en seguimiento por impago reiterado');
    if (gastosPendientes.length) alertas.push(gastosPendientes.length + ' gasto(s) pendiente(s) de revisión humana');
    if (borradores.length) alertas.push(borradores.length + ' factura(s) en borrador, sin enviar');

    return {
      fechaCalculo: HOY + 'T07:00:00.000Z',
      totalFacturado: redondear(facturado),
      totalCobrado: redondear(cobrado),
      totalPendiente: redondear(facturado - cobrado),
      totalVencido: redondear(suma(vencidas, pendienteDe)),
      totalGastos: redondear(suma(GASTOS, function (g) { return g.importe; })),
      proyectosActivos: PROYECTOS.filter(function (p) { return p.estado === 'En curso'; }).length,
      prevision30Dias: redondear(suma(proximas, pendienteDe)),
      alertas: alertas
    };
  })();

  // ---------------------------------------------------------------
  // Formato -- mismas reglas que src/lib/format.ts del producto real
  // ---------------------------------------------------------------
  function fmtEUR(value) {
    if (value === null || value === undefined) return 'Sin datos suficientes';
    // useGrouping 'always': es-ES no agrupa los enteros de CUATRO cifras, y
    // casi todos los importes de esta demo lo son. Sin esto se enseñaba
    // «1200,00 €» al lado de «28.442,50 €» en la misma columna, que es justo
    // lo que el producto real corrige en src/lib/format.ts — el fichero que
    // el comentario de arriba dice estar copiando.
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', useGrouping: 'always' }).format(value);
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
          pistas: ['deben', 'debe', 'deuda', 'deudor', 'cobrar', 'pendiente', 'quién nos debe', 'quien nos debe'],
          q: '¿Quién nos debe dinero ahora mismo?',
          a: function () {
            var lista = emitidas().filter(function (f) { return pendienteDe(f) > 0; });
            if (!lista.length) return { conclusion: 'No hay ninguna factura pendiente de cobro.', datos: [], refs: [] };
            var total = suma(lista, pendienteDe);
            var fuera = lista.filter(function (f) { return diasDeRetraso(f) > 0; });
            var porCliente = {};
            lista.forEach(function (f) {
              var k = f.clienteNombre || 'Cliente sin resolver';
              porCliente[k] = (porCliente[k] || 0) + pendienteDe(f);
            });
            var nombres = Object.keys(porCliente).sort(function (a, b) { return porCliente[b] - porCliente[a]; });
            var mayor = nombres[0];
            var cuota = Math.round((porCliente[mayor] / total) * 100);
            return {
              conclusion: 'Te deben ' + fmtEUR(total) + ' en ' + lista.length + ' facturas. ' + (fuera.length ? fmtEUR(suma(fuera, pendienteDe)) + ' ya están fuera de plazo.' : 'Ninguna está fuera de plazo todavía.'),
              datos: nombres.map(function (n) {
                var suyas = lista.filter(function (f) { return (f.clienteNombre || 'Cliente sin resolver') === n; });
                var atraso = Math.max.apply(null, suyas.map(diasDeRetraso));
                return { k: n, v: fmtEUR(porCliente[n]), n: (atraso > 0 ? atraso + ' días de retraso' : 'dentro de plazo') + (suyas.length > 1 ? ' · ' + suyas.length + ' facturas' : '') };
              }),
              significado: 'El ' + cuota + '% de lo que te deben es de un solo cliente: ' + mayor + '.',
              refs: fuera.map(refFactura)
            };
          }
        },
        {
          clave: 'atrasadas',
          pistas: ['atrasad', 'retras', 'vencid', 'fuera de plazo', 'impag'],
          q: '¿Qué facturas están más atrasadas?',
          a: function () {
            var atrasadas = emitidas().filter(function (f) { return diasDeRetraso(f) > 0 && pendienteDe(f) > 0; })
              .sort(function (a, b) { return diasDeRetraso(b) - diasDeRetraso(a); });
            if (!atrasadas.length) return { conclusion: 'Ninguna factura está fuera de plazo.', datos: [], refs: [] };
            var peor = atrasadas[0];
            return {
              conclusion: atrasadas.length + ' facturas fuera de plazo, ' + fmtEUR(suma(atrasadas, pendienteDe)) + ' sin cobrar. La más antigua lleva ' + diasDeRetraso(peor) + ' días.',
              datos: atrasadas.map(function (f) {
                return {
                  k: f.numero + ' · ' + (f.clienteNombre || 'Cliente sin resolver'),
                  v: fmtEUR(pendienteDe(f)),
                  n: diasDeRetraso(f) + ' días · venció el ' + fmtFecha(f.fechaVencimiento) + ' · ' + (f.recordatoriosEnviados || 0) + ' recordatorios'
                };
              }),
              significado: peor.observaciones ? 'La más antigua, ' + peor.numero + ', tiene una nota puesta: «' + peor.observaciones + '» Eso no está reflejado en el estado de la factura.' : 'La más antigua, ' + peor.numero + ', acumula ' + (peor.recordatoriosEnviados || 0) + ' recordatorios enviados sin resultado.',
              revisar: ['Decidir qué se hace con ' + peor.numero + ': otro recordatorio ya no ha funcionado ' + (peor.recordatoriosEnviados || 0) + ' veces.'],
              refs: atrasadas.map(refFactura)
            };
          }
        },
        {
          clave: 'gastos',
          pistas: ['gasto', 'gastos', 'cost', 'creciendo', 'crecer', 'subiendo', 'proveedor'],
          q: '¿Qué gastos están creciendo?',
          a: function () {
            var gastos = GASTOS.filter(function (g) { return g.fecha; });
            var meses = {};
            gastos.forEach(function (g) {
              var m = g.fecha.slice(0, 7);
              meses[m] = meses[m] || { total: 0, cat: {} };
              meses[m].total += g.importe;
              var c = g.categoria || 'Sin categoría';
              meses[m].cat[c] = (meses[m].cat[c] || 0) + g.importe;
            });
            var clavesMes = Object.keys(meses).sort();
            var ultimo = clavesMes[clavesMes.length - 1];
            var previo = clavesMes[clavesMes.length - 2];
            if (!previo) {
              return { conclusion: 'Solo hay un mes de gastos registrado: no hay con qué comparar.', datos: [], refs: [] };
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
              conclusion: (difTotal > 0 ? 'El gasto ha subido ' + fmtEUR(difTotal) : 'El gasto ha bajado ' + fmtEUR(-difTotal)) + ' respecto al mes anterior (' + fmtEUR(meses[ultimo].total) + ' frente a ' + fmtEUR(meses[previo].total) + ').',
              datos: filas.map(function (f) {
                return { k: f.cat, v: f.ahora === 0 ? '\u2014' : fmtEUR(f.ahora), n: (f.antes === 0 ? 'nuevo este mes' : (f.ahora === 0 ? 'no se ha repetido (' + fmtEUR(f.antes) + ' el mes anterior)' : (f.dif >= 0 ? '+' : '') + fmtEUR(f.dif) + ' respecto al mes anterior')) };
              }),
              significado: 'Con ' + clavesMes.length + ' meses registrados no hay serie suficiente para hablar de tendencia. Esto es lo que ha cambiado, no una previsión' + (suben.length ? ': ' + (suben.length === 1 ? 'lo único que sube es ' : 'lo que sube es ') + suben.map(function (x) { return x.cat; }).join(' y ') + '.' : '.'),
              refs: []
            };
          }
        },
        {
          clave: 'hoy',
          pistas: ['revisar', 'hoy', 'prioridad', 'urgente', 'qué hago', 'que hago', 'pendiente de mí'],
          q: '¿Qué debería revisar hoy?',
          a: function () {
            var pendientes = [];
            var refs = [];
            emitidas().filter(function (f) { return diasDeRetraso(f) > 0 && pendienteDe(f) > 0; })
              .sort(function (a, b) { return diasDeRetraso(b) - diasDeRetraso(a); })
              .forEach(function (f) { pendientes.push(f.numero + ' (' + f.clienteNombre + '): ' + fmtEUR(pendienteDe(f)) + ' con ' + diasDeRetraso(f) + ' días de retraso.'); refs.push(refFactura(f)); });
            FACTURAS.filter(function (f) { return f.estado === 'Borrador'; })
              .forEach(function (f) { pendientes.push(f.numero + ': ' + fmtEUR(f.importe) + ' en borrador, sin enviar. No está reclamado a nadie.'); refs.push(refFactura(f)); });
            var gastosPte = GASTOS.filter(function (g) { return g.estadoRevision === 'Pendiente revisión'; });
            if (gastosPte.length) pendientes.push(gastosPte.length + ' gastos esperando revisión: ' + gastosPte.map(function (g) { return g.proveedor + ' (' + fmtEUR(g.importe) + ')'; }).join(', ') + '.');
            PROYECTOS.filter(function (p) { return p.estado === 'En curso' && p.fechaEntregaPrevista; })
              .forEach(function (p) {
                var quedan = diasEntre(HOY, p.fechaEntregaPrevista);
                if (quedan !== null && quedan <= 21) pendientes.push(p.nombre + ': entrega prevista el ' + fmtFecha(p.fechaEntregaPrevista) + ', quedan ' + quedan + ' días.');
              });
            return {
              conclusion: pendientes.length ? 'Hay ' + pendientes.length + ' cosas que dependen de una decisión tuya hoy.' : 'No hay nada que requiera una decisión hoy.',
              revisar: pendientes,
              refs: refs
            };
          }
        },
        {
          clave: 'resumen',
          pistas: ['resumen', 'resume', 'cómo vamos', 'como vamos', 'situación', 'situacion', 'general', 'está pasando', 'esta pasando'],
          q: 'Hazme un resumen financiero de hoy.',
          a: function () {
            var s = self.getDashboardSnapshot();
            var margen = s.totalFacturado - s.totalGastos;
            var cobradoPct = s.totalFacturado > 0 ? Math.round((s.totalCobrado / s.totalFacturado) * 100) : 0;
            return {
              conclusion: 'Has facturado ' + fmtEUR(s.totalFacturado) + ' y has cobrado ' + fmtEUR(s.totalCobrado) + '. Quedan ' + fmtEUR(s.totalPendiente) + ' por cobrar, de los que ' + fmtEUR(s.totalVencido) + ' están fuera de plazo.',
              datos: [
                { k: 'Facturado', v: fmtEUR(s.totalFacturado) },
                { k: 'Cobrado', v: fmtEUR(s.totalCobrado), n: cobradoPct + '%' },
                { k: 'Pendiente', v: fmtEUR(s.totalPendiente) },
                { k: 'Fuera de plazo', v: fmtEUR(s.totalVencido) },
                { k: 'Gastos', v: fmtEUR(s.totalGastos) },
                { k: 'Vence en 30 días', v: fmtEUR(s.prevision30Dias) }
              ],
              significado: 'El problema no es el margen (' + fmtEUR(margen) + ' entre lo facturado y lo gastado): es que solo ha entrado el ' + cobradoPct + '% de lo que has facturado.',
              revisar: ['Los ' + fmtEUR(s.totalVencido) + ' fuera de plazo, antes que cualquier otra cosa.'],
              refs: []
            };
          }
        },
        {
          clave: 'proyectos',
          pistas: ['proyecto', 'rentab', 'margen', 'obra'],
          q: '¿Cuál es la rentabilidad de los proyectos activos?',
          a: function () {
            var activos = self.listProyectos().filter(function (p) { return p.estado === 'En curso'; });
            if (!activos.length) return { conclusion: 'No hay proyectos en curso ahora mismo.', datos: [], refs: [] };
            var mejor = activos.slice().sort(function (a, b) { return b.rentabilidad - a.rentabilidad; })[0];
            return {
              conclusion: activos.length + ' proyectos en curso, ' + fmtEUR(suma(activos, function (p) { return p.rentabilidad; })) + ' de rentabilidad estimada.',
              datos: activos.map(function (p) {
                return { k: p.nombre + ' · ' + p.empresa, v: fmtEUR(p.rentabilidad), n: fmtEUR(p.totalFacturado) + ' facturados · ' + fmtEUR(p.totalCobrado) + ' cobrados · ' + fmtEUR(p.totalGastos) + ' de gasto' };
              }),
              significado: 'El que más deja es ' + mejor.nombre + ', y de él ' + (mejor.totalFacturado - mejor.totalCobrado > 0 ? 'todavía hay ' + fmtEUR(mejor.totalFacturado - mejor.totalCobrado) + ' sin cobrar.' : 'ya está todo cobrado.'),
              refs: activos.map(function (p) { return { type: 'proyectos', id: p.id, label: p.nombre }; })
            };
          }
        },
        {
          clave: 'deudor',
          pistas: ['cliente', 'quien debe mas', 'quién debe más', 'mayor deuda', 'mas deuda', 'más deuda', 'peor pagador'],
          q: '¿Qué cliente nos debe más?',
          a: function () {
            var lista = emitidas().filter(function (f) { return pendienteDe(f) > 0; });
            if (!lista.length) return { conclusion: 'Ningún cliente tiene facturas pendientes.', datos: [], refs: [] };
            var porCliente = {};
            lista.forEach(function (f) {
              var k = f.clienteNombre || 'Cliente sin resolver';
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
              conclusion: top + ' es quien más debe: ' + fmtEUR(porCliente[top].total) + ' en ' + suyas.length + ' factura(s), el ' + cuota + '% de todo lo pendiente.',
              datos: suyas.map(function (f) {
                return { k: f.numero, v: fmtEUR(pendienteDe(f)), n: (diasDeRetraso(f) > 0 ? diasDeRetraso(f) + ' días de retraso' : 'vence el ' + fmtFecha(f.fechaVencimiento)) + (f.importeCobrado ? ' · ya ha pagado ' + fmtEUR(f.importeCobrado) : '') };
              }),
              significado: (ficha && ficha.cuotaMensual ? 'Además tiene cuota mensual de ' + fmtEUR(ficha.cuotaMensual) + ', así que la deuda sigue creciendo cada mes que pasa sin cobrar.' : 'Concentrar la deuda en un solo cliente es el riesgo, no el importe.'),
              refs: (ficha ? [{ type: 'clientes', id: ficha.id, label: top }] : []).concat(suyas.map(refFactura))
            };
          }
        },
        {
          clave: 'caja',
          pistas: ['caja', 'tesoreria', 'tesorería', 'liquidez', 'saldo', 'cuanto dinero hay', 'cuánto dinero hay'],
          q: '¿Cómo está nuestra caja?',
          a: function () {
            var lista = emitidas();
            var cobrado = suma(lista, function (f) { return f.importeCobrado; });
            var gastado = suma(GASTOS, function (g) { return g.importe; });
            var porEntrar = suma(lista.filter(function (f) { return pendienteDe(f) > 0; }), pendienteDe);
            var s = self.getDashboardSnapshot();
            return {
              conclusion: 'Esta demo no trae el módulo de Tesorería, así que no te puedo dar un saldo bancario. Con lo que sí está registrado: han entrado ' + fmtEUR(cobrado) + ' y han salido ' + fmtEUR(gastado) + '.',
              datos: [
                { k: 'Cobrado', v: fmtEUR(cobrado) },
                { k: 'Gastos registrados', v: fmtEUR(gastado) },
                { k: 'Diferencia', v: fmtEUR(cobrado - gastado) },
                { k: 'Por entrar', v: fmtEUR(porEntrar), n: fmtEUR(s.prevision30Dias) + ' vencen en 30 días' }
              ],
              significado: 'La diferencia entre lo que ha entrado y lo que ha salido no es el saldo de tu banco: no incluye nóminas, impuestos ni lo que ya estaba en la cuenta. Tesorería, que sí cruza cobros y pagos previstos, existe en el sistema real y no en esta demo.',
              revisar: ['Lo que está por entrar (' + fmtEUR(porEntrar) + ') es más del doble de todo lo cobrado hasta ahora. Ahí está el dinero.'],
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
