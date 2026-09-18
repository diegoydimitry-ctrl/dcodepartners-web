'use strict';
/**
 * Genera las filas de conversiones offline para Google Ads a partir de los
 * registros de la tabla Leads (export CSV o JSON de Airtable).
 *
 * Plantilla de la interfaz de Google Ads (subida manual):
 *   Parameters:TimeZone=Europe/Madrid
 *   Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency
 *
 * Reglas:
 *  · Solo registros con GCLID (GBRAID/WBRAID no van en esta plantilla:
 *    quedan listados aparte para hacerlo por Data Manager).
 *  · Cada conversión se exporta UNA vez: se salta si ya figura en
 *    «Conversiones enviadas».
 *  · Ventana de 90 días desde el clic. No guardamos la hora exacta del clic;
 *    se usa «Primer envío» como aproximación (el clic es anterior), así que
 *    se exige que la conversión sea como mucho 88 días posterior.
 *  · Registros de prueba (Entorno ≠ production o empresa con «TEST») nunca.
 */
const path = require('node:path');
const { F, CONVERSIONES } = require(path.join(__dirname, '../../../api/_lib/ads/schema.js'));

const VENTANA_DIAS = 88;
const ETIQUETA = { cualificado: 'lead_cualificado', reunion: 'reunion_celebrada', cliente: 'cliente' };

function fechaMadrid(iso) {
  const d = new Date(iso);
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).formatToParts(d).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day} ${p.hour === '24' ? '00' : p.hour}:${p.minute}:${p.second}`;
}

function enviadas(v) {
  if (Array.isArray(v)) return v.map(String);
  return String(v || '').split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
}

/**
 * @param {Array<{id?:string, fields:object}>} registros
 * @param {{incluirPruebas?:boolean}} opts
 * @returns {{filas:Array, avisos:string[], paraMarcar:Array<{id:string, conversion:string}>, braid:Array}}
 */
function generarConversiones(registros, { incluirPruebas = false } = {}) {
  const filas = [];
  const avisos = [];
  const paraMarcar = [];
  const braid = [];
  for (const r of registros) {
    const f = r.fields || r;
    const id = r.id || f.id || '';
    const empresa = String(f[F.empresa] || '');
    const esPrueba = (f[F.entorno] && f[F.entorno] !== 'production') || /TEST/i.test(empresa);
    if (esPrueba && !incluirPruebas) continue;
    const gclid = String(f[F.gclid] || '').trim();
    const ya = enviadas(f[F.conversionesEnviadas]);
    const candidatas = [
      ['cualificado', f[F.fechaCualificado], ''],
      ['reunion', f[F.reunionCelebrada], ''],
      ['cliente', f[F.fechaCliente], f[F.valorCliente]],
    ];
    for (const [clave, fecha, valor] of candidatas) {
      if (!fecha || ya.includes(ETIQUETA[clave])) continue;
      if (!gclid) {
        if (f[F.gbraid] || f[F.wbraid]) braid.push({ id, empresa, conversion: CONVERSIONES[clave] });
        continue;
      }
      const inicio = f[F.primerEnvio] ? new Date(f[F.primerEnvio]) : null;
      const cuando = new Date(fecha);
      if (Number.isNaN(cuando.getTime())) { avisos.push(`${empresa}: fecha no válida en ${clave}`); continue; }
      if (inicio && cuando < inicio) { avisos.push(`${empresa}: ${clave} es anterior al primer envío; revisar`); continue; }
      if (inicio && (cuando - inicio) / 864e5 > VENTANA_DIAS) { avisos.push(`${empresa}: ${clave} fuera de la ventana de 90 días del clic; no se puede subir`); continue; }
      if (clave === 'cliente' && !(Number(valor) > 0)) avisos.push(`${empresa}: cliente sin «${F.valorCliente}»; se sube sin valor`);
      filas.push({
        gclid,
        nombre: CONVERSIONES[clave],
        hora: fechaMadrid(cuando.toISOString()),
        valor: clave === 'cliente' && Number(valor) > 0 ? Number(valor).toFixed(2) : '',
        moneda: clave === 'cliente' && Number(valor) > 0 ? 'EUR' : '',
      });
      paraMarcar.push({ id, empresa, conversion: ETIQUETA[clave] });
    }
  }
  return { filas, avisos, paraMarcar, braid };
}

function aCsv(filas) {
  const q = (s) => (/[",\n]/.test(String(s)) ? `"${String(s).replace(/"/g, '""')}"` : String(s));
  return ['Parameters:TimeZone=Europe/Madrid',
    'Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency',
    ...filas.map((r) => [r.gclid, r.nombre, r.hora, r.valor, r.moneda].map(q).join(','))].join('\n') + '\n';
}

module.exports = { generarConversiones, aCsv, fechaMadrid, ETIQUETA, VENTANA_DIAS };
