'use strict';
/**
 * Reglas del CRM para leads de las landings.
 *
 * REGLA DE NEGOCIO (Dirección, 18/09/2026): si la fuente es google_ads, la
 * propuesta NUNCA se envía sola. Nace como BORRADOR INTERNO y solo puede
 * salir después de que una persona haya hecho el diagnóstico. Esto protege
 * la secuencia PROBLEMA → SISTEMA → DEMO → PROPUESTA.
 */
const { ETAPAS, FUENTE_GOOGLE_ADS } = require('./schema');

const PROPUESTA_BORRADOR = 'Borrador interno (pendiente de diagnóstico)';

// Transiciones permitidas. «Descartado» se puede alcanzar desde cualquier
// etapa abierta; «Cliente» solo desde «Prueba» o «Propuesta».
const TRANSICIONES = Object.freeze({
  'Nuevo': ['Cualificado', 'Descartado'],
  'Cualificado': ['Reunión programada', 'Descartado'],
  'Reunión programada': ['Reunión celebrada', 'Cualificado', 'Descartado'],
  'Reunión celebrada': ['Propuesta', 'Descartado'],
  'Propuesta': ['Prueba', 'Cliente', 'Descartado'],
  'Prueba': ['Cliente', 'Descartado'],
  'Cliente': [],
  'Descartado': ['Nuevo'],
});

function puedeTransicionar(desde, hasta) {
  if (!ETAPAS.includes(desde) || !ETAPAS.includes(hasta)) return false;
  return (TRANSICIONES[desde] || []).includes(hasta);
}

/**
 * Decide qué se puede hacer con una propuesta para un lead.
 * @param {{fuente?:string, etapa?:string, reunionCelebrada?:string|null}} lead
 */
function politicaPropuesta(lead = {}) {
  const esAds = lead.fuente === FUENTE_GOOGLE_ADS;
  const diagnosticoHecho = Boolean(lead.reunionCelebrada) ||
    ['Reunión celebrada', 'Propuesta', 'Prueba', 'Cliente'].includes(lead.etapa);
  if (esAds && !diagnosticoHecho) {
    return {
      generarAutomatica: false,
      envioAutomatico: false,
      estadoPropuesta: PROPUESTA_BORRADOR,
      motivo: 'Lead de Google Ads sin diagnóstico humano: la propuesta queda como borrador interno.',
    };
  }
  return {
    generarAutomatica: false, // en ningún caso se dispara sola desde una landing
    envioAutomatico: false,
    estadoPropuesta: esAds ? 'Pendiente de revisión humana' : 'Según flujo existente',
    motivo: esAds
      ? 'Diagnóstico hecho: se puede preparar la propuesta, que sigue requiriendo revisión humana antes de enviarse.'
      : 'Fuente distinta de Google Ads: aplica el flujo comercial existente.',
  };
}

/** Datos que una propuesta debe heredar del lead para no perder el origen. */
function origenParaPropuesta(leadFields = {}) {
  return {
    'Fuente lead': leadFields['Fuente'] || '',
    'GCLID lead': leadFields['GCLID'] || '',
    'Ref lead': leadFields['Ref lead'] || '',
    'Campaña lead': leadFields['UTM campaign'] || leadFields['Origen campaña'] || '',
    'Keyword lead': leadFields['Keyword'] || '',
  };
}

module.exports = { puedeTransicionar, politicaPropuesta, origenParaPropuesta, PROPUESTA_BORRADOR, TRANSICIONES };
