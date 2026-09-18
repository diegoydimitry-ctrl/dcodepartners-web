'use strict';
/**
 * Configuración del servidor para /api/ads-lead. SOLO variables de entorno;
 * ningún valor sensible en el código.
 *
 *   ADS_LEAD_MODE                'dryrun' (por defecto) | 'airtable'
 *   ADS_LEAD_PRODUCTION_ENABLED  '1' para aceptar leads en Production (hoy: NO)
 *   AIRTABLE_ADS_TOKEN           token personal con acceso SOLO a la base destino
 *   AIRTABLE_ADS_BASE_ID         base destino (en Preview: la base de PRUEBAS)
 *   AIRTABLE_ADS_TABLE           tabla (por defecto «Leads»)
 *   ADS_FICHA_LEER_WEB           '1' para leer la portada de la web del lead
 *   TURNSTILE_SECRET_KEY         si existe, se exige y verifica Turnstile
 */
const { PRODUCTION_BASE_ID } = require('./schema');

function leerConfig(env = process.env) {
  const entorno = env.VERCEL_ENV || (env.NODE_ENV === 'test' ? 'test' : 'development');
  const modo = (env.ADS_LEAD_MODE || 'dryrun').toLowerCase();
  const cfg = {
    entorno,
    modo,
    produccionActivada: env.ADS_LEAD_PRODUCTION_ENABLED === '1',
    airtable: {
      token: env.AIRTABLE_ADS_TOKEN || '',
      baseId: env.AIRTABLE_ADS_BASE_ID || '',
      table: env.AIRTABLE_ADS_TABLE || 'Leads',
    },
    leerWeb: env.ADS_FICHA_LEER_WEB === '1',
    turnstileSecret: env.TURNSTILE_SECRET_KEY || '',
    problemas: [],
  };
  if (!['dryrun', 'airtable'].includes(modo)) cfg.problemas.push(`ADS_LEAD_MODE desconocido: ${modo}`);
  if (modo === 'airtable') {
    if (!cfg.airtable.token || !cfg.airtable.baseId) cfg.problemas.push('Faltan AIRTABLE_ADS_TOKEN o AIRTABLE_ADS_BASE_ID');
    // Barrera dura: fuera de Production no se escribe NUNCA en la base real.
    if (entorno !== 'production' && cfg.airtable.baseId === PRODUCTION_BASE_ID) {
      cfg.problemas.push('Un entorno que no es Production apunta a la base de PRODUCCIÓN: bloqueado');
    }
  }
  // Production no acepta leads de las landings hasta que se active a mano.
  cfg.bloqueadoProduccion = entorno === 'production' && !cfg.produccionActivada;
  return cfg;
}

module.exports = { leerConfig };
