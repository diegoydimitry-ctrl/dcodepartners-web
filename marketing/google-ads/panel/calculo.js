/*
 * Cálculo del embudo de Google Ads para el panel (navegador y Node).
 * Entradas: export de Google Ads, export de Airtable «Leads» y, opcional,
 * export de eventos de GA4. Nada sale del ordenador de quien lo usa.
 */
(function (root) {
  'use strict';
  var ORDEN = ['Nuevo', 'Cualificado', 'Reunión programada', 'Reunión celebrada', 'Propuesta', 'Prueba', 'Cliente'];
  var GRUPO_LANDING = { GA1: '/automatizacion-procesos', GA2: '/automatizacion-seguimiento-comercial', GA3: '/automatizacion-atencion-clientes' };

  function num(v) {
    if (typeof v === 'number') return v;
    var s = String(v == null ? '' : v).replace(/[€%\s]/g, '');
    if (!s || s === '--') return 0;
    // «1.234,56» (es) o «1,234.56» (en)
    if (/,\d{1,2}$/.test(s)) s = s.replace(/\./g, '').replace(',', '.');
    else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    else s = s.replace(/,/g, '');
    var n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  }
  function col(fila, nombres) {
    for (var i = 0; i < nombres.length; i++) if (fila[nombres[i]] != null && fila[nombres[i]] !== '') return fila[nombres[i]];
    return '';
  }
  function landingDeGrupo(nombreGrupo) {
    var m = String(nombreGrupo || '').match(/GA[123]/);
    return m ? GRUPO_LANDING[m[0]] : 'otras';
  }
  function etapaIdx(e) { var i = ORDEN.indexOf(e); return i === -1 ? -1 : i; }
  function vacio() {
    return { impresiones: 0, clics: 0, coste: 0, visitas: 0, demoIniciada: 0, demo50: 0, leads: 0, cualificados: 0, reuniones: 0, propuestas: 0, pruebas: 0, clientes: 0, descartados: 0, facturacion: 0, mrr: 0, horasImplFallidas: 0, pruebasFallidas: 0 };
  }

  function calcular(ads, leads, ga4, p) {
    p = Object.assign({ costeHora: 20, horasTriaje: 0.25, horasReunion: 1.5, horasPropuesta: 2, horasImplantacionDefecto: 35, soloGoogleAds: true }, p || {});
    var g = {};
    function G(k) { return (g[k] = g[k] || vacio()); }

    (ads || []).forEach(function (f) {
      var k = landingDeGrupo(col(f, ['Grupo de anuncios', 'Ad group', 'Ad Group']));
      var x = G(k);
      x.impresiones += num(col(f, ['Impr.', 'Impresiones', 'Impressions', 'Impr']));
      x.clics += num(col(f, ['Clics', 'Clicks', 'Interacciones']));
      x.coste += num(col(f, ['Coste', 'Cost', 'Costo']));
    });
    (ga4 || []).forEach(function (f) {
      var k = String(col(f, ['Landing', 'Page path', 'Ruta de la página', 'landing'])).split('?')[0];
      var ev = String(col(f, ['Evento', 'Event name', 'Nombre del evento']));
      var n = num(col(f, ['Recuento', 'Event count', 'Número de eventos', 'Sesiones', 'Sessions']));
      var x = G(k || 'otras');
      if (ev === 'session_start' || ev === 'page_view' || ev === 'sesiones') x.visitas += n;
      if (ev === 'demo_start' || ev === 'dcode_demo_start') x.demoIniciada += n;
      if (ev === 'demo_50' || ev === 'dcode_demo_50') x.demo50 += n;
    });
    (leads || []).forEach(function (r) {
      var f = r.fields || r;
      if (p.soloGoogleAds && String(f['Fuente'] || '') !== 'google_ads') return;
      if (/TEST/i.test(String(f['Empresa'] || '')) || (f['Entorno'] && f['Entorno'] !== 'production')) return;
      var x = G(String(f['Landing'] || 'otras'));
      var e = String(f['Etapa embudo'] || 'Nuevo');
      var i = etapaIdx(e);
      x.leads++;
      if (e === 'Descartado') { x.descartados++; }
      if (i >= 1 || f['Fecha cualificado']) x.cualificados++;
      if (i >= 3 || f['Reunión celebrada']) x.reuniones++;
      if (i >= 4) x.propuestas++;
      var enPrueba = i >= 5 || num(f['Horas implantación reales']) > 0;
      if (enPrueba) x.pruebas++;
      if (e === 'Cliente') {
        x.clientes++;
        x.facturacion += num(f['Valor cliente']);
        x.mrr += num(f['Mensualidad cliente']);
      } else if (enPrueba && e === 'Descartado') {
        x.pruebasFallidas++;
        x.horasImplFallidas += num(f['Horas implantación reales']) || p.horasImplantacionDefecto;
      }
    });

    function derivar(x) {
      var horasComerciales = x.leads * p.horasTriaje + x.reuniones * p.horasReunion + x.propuestas * p.horasPropuesta;
      var noAds = horasComerciales * p.costeHora + x.horasImplFallidas * p.costeHora;
      var div = function (a, b) { return b > 0 ? a / b : null; };
      return Object.assign({}, x, {
        ctr: div(x.clics, x.impresiones), cpc: div(x.coste, x.clics),
        convClicLead: div(x.leads, x.clics), cpl: div(x.coste, x.leads),
        costeReunion: div(x.coste, x.reuniones),
        cacAnuncios: div(x.coste, x.clientes),
        cacCompleto: div(x.coste + noAds, x.clientes),
        costeNoPublicitario: noAds, horasComerciales: horasComerciales,
      });
    }
    var filas = Object.keys(g).sort().map(function (k) { return Object.assign({ landing: k }, derivar(g[k])); });
    var total = vacio();
    Object.keys(g).forEach(function (k) { Object.keys(total).forEach(function (m) { total[m] += g[k][m]; }); });
    return { filas: filas, total: Object.assign({ landing: 'TOTAL' }, derivar(total)), parametros: p };
  }

  function parseCsv(txt) {
    txt = String(txt).replace(/^﻿/, '');
    // Separador: el que más aparece en las primeras líneas (los informes de
    // Google Ads empiezan con líneas de título sin separadores).
    var cuenta = { ';': 0, ',': 0, '\t': 0 };
    txt.split(/\r?\n/).slice(0, 6).forEach(function (l) { Object.keys(cuenta).forEach(function (s) { cuenta[s] = Math.max(cuenta[s], l.split(s).length - 1); }); });
    var sep = Object.keys(cuenta).sort(function (a, b) { return cuenta[b] - cuenta[a]; })[0];
    var filas = [], fila = [], celda = '', q = false;
    for (var i = 0; i < txt.length; i++) {
      var c = txt[i];
      if (q) { if (c === '"' && txt[i + 1] === '"') { celda += '"'; i++; } else if (c === '"') q = false; else celda += c; }
      else if (c === '"') q = true;
      else if (c === sep) { fila.push(celda); celda = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && txt[i + 1] === '\n') i++; fila.push(celda); filas.push(fila); fila = []; celda = ''; }
      else celda += c;
    }
    if (celda || fila.length) { fila.push(celda); filas.push(fila); }
    filas = filas.filter(function (f) { return f.some(function (x) { return x !== ''; }); });
    // Los informes de Google Ads traen 2 líneas de título antes de la cabecera.
    var iCab = 0;
    for (var j = 0; j < Math.min(filas.length, 5); j++) if (filas[j].length > 2) { iCab = j; break; }
    var cab = filas[iCab] || [];
    return filas.slice(iCab + 1).filter(function (f) { return !/^Total/i.test(f[0] || ''); }).map(function (f) {
      var o = {}; cab.forEach(function (h, k) { o[h.trim()] = f[k] == null ? '' : f[k]; }); return o;
    });
  }

  var api = { calcular: calcular, parseCsv: parseCsv, num: num, ORDEN: ORDEN };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DCODE_PANEL = api;
})(this);
