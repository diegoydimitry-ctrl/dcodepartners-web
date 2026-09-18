'use strict';
/**
 * Origen del clic. Todo lo que llega aquí viene del navegador, así que se
 * trata como no fiable: se valida con listas cerradas y expresiones
 * estrictas, y lo que no cumple se descarta (no se «arregla»).
 */
const { FUENTE_GOOGLE_ADS, FUENTE_FORMULARIO } = require('./schema');
const { LANDINGS } = require('./landings');

// Los identificadores de clic de Google son base64url largos. No se
// documenta un formato cerrado, así que se valida por alfabeto y longitud.
const CLICK_ID = /^[A-Za-z0-9_\-]{10,256}$/;
const MATCHTYPES = { e: 'exacta', p: 'frase', b: 'amplia' };
const DEVICES = { c: 'ordenador', m: 'móvil', t: 'tablet' };
const PAID_MEDIUMS = new Set(['cpc', 'ppc', 'paid', 'paidsearch', 'paid_search', 'sem']);

function clean(v, max) {
  if (typeof v !== 'string') return '';
  // Fuera caracteres de control y espacios sobrantes; nada de HTML.
  const s = v.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/[<>]/g, '').trim();
  return s.slice(0, max);
}

function clickId(v) {
  const s = clean(v, 256);
  return CLICK_ID.test(s) ? s : '';
}

/**
 * @param {object} raw  campos ocultos enviados por el formulario
 * @returns {{fuente:string, gclid:string, gbraid:string, wbraid:string,
 *   utm_source:string, utm_medium:string, utm_campaign:string, utm_content:string,
 *   utm_term:string, keyword:string, matchtype:string, device:string, landing:string,
 *   descartados:string[]}}
 */
function parseAttribution(raw = {}) {
  const descartados = [];
  const out = {
    gclid: clickId(raw.gclid),
    gbraid: clickId(raw.gbraid),
    wbraid: clickId(raw.wbraid),
    utm_source: clean(raw.utm_source, 100).toLowerCase(),
    utm_medium: clean(raw.utm_medium, 100).toLowerCase(),
    utm_campaign: clean(raw.utm_campaign, 150),
    utm_content: clean(raw.utm_content, 150),
    utm_term: clean(raw.utm_term, 150),
    keyword: clean(raw.keyword, 150),
    matchtype: '',
    device: '',
    landing: '',
  };
  for (const k of ['gclid', 'gbraid', 'wbraid']) {
    if (raw[k] && !out[k]) descartados.push(k);
  }
  const mt = clean(raw.matchtype, 20).toLowerCase();
  out.matchtype = MATCHTYPES[mt] || (Object.values(MATCHTYPES).includes(mt) ? mt : '');
  if (mt && !out.matchtype) descartados.push('matchtype');
  const dv = clean(raw.device, 20).toLowerCase();
  out.device = DEVICES[dv] || (Object.values(DEVICES).includes(dv) ? dv : '');
  if (dv && !out.device) descartados.push('device');

  const landing = clean(raw.landing, 120).split('?')[0].replace(/\/+$/, '');
  out.landing = Object.prototype.hasOwnProperty.call(LANDINGS, landing) ? landing : '';
  if (raw.landing && !out.landing) descartados.push('landing');

  // {keyword} de ValueTrack llega en utm_term; si no vino aparte, se copia.
  if (!out.keyword && out.utm_term) out.keyword = out.utm_term;

  out.fuente = detectarFuente(out);
  out.descartados = descartados;
  return out;
}

/**
 * google_ads si hay cualquier identificador de clic de Google, o si la UTM
 * declara google + medio de pago. Todo lo demás es el formulario web normal.
 */
function detectarFuente(a) {
  if (a.gclid || a.gbraid || a.wbraid) return FUENTE_GOOGLE_ADS;
  if (a.utm_source === 'google' && PAID_MEDIUMS.has(a.utm_medium)) return FUENTE_GOOGLE_ADS;
  return FUENTE_FORMULARIO;
}

module.exports = { parseAttribution, detectarFuente, CLICK_ID };
