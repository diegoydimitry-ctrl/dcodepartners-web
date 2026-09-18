'use strict';
/**
 * Construye los campos de Airtable a partir del lead validado, el origen
 * del clic y la ficha. Solo columnas del contrato (schema.js).
 */
const { F, FUENTE_GOOGLE_ADS } = require('./schema');

function camposNuevoLead({ lead, attr, ficha, ref, ahora, entorno }) {
  const f = {
    [F.nombre]: lead.nombre,
    [F.empresa]: lead.empresa,
    [F.email]: lead.email,
    [F.sector]: lead.sector,
    [F.tamano]: lead.tamano,
    [F.necesidad]: lead.necesidad,
    [F.fuente]: attr.fuente,
    [F.estado]: 'Nuevo',
    [F.etapa]: 'Nuevo',
    [F.ref]: ref,
    [F.landing]: attr.landing,
    [F.consentPrivacidad]: true,
    [F.consentFecha]: ahora,
    [F.consentVersion]: lead.consentVersion,
    [F.consentAnuncios]: lead.consentAnuncios,
    [F.primerEnvio]: ahora,
    [F.ultimoEnvio]: ahora,
    [F.numEnvios]: 1,
    [F.ultimoEnvioId]: lead.submissionId || '',
    [F.ficha]: ficha.texto,
    [F.productoCandidato]: ficha.producto,
    [F.confianzaFicha]: ficha.confianza,
    [F.proximoPaso]: ficha.proximoPaso,
    [F.entorno]: entorno,
  };
  if (lead.web) f[F.web] = lead.web;
  if (lead.telefono) f[F.telefono] = lead.telefono;
  const origen = {
    [F.gclid]: attr.gclid, [F.gbraid]: attr.gbraid, [F.wbraid]: attr.wbraid,
    [F.utmSource]: attr.utm_source, [F.utmMedium]: attr.utm_medium,
    [F.utmCampaign]: attr.utm_campaign, [F.utmContent]: attr.utm_content, [F.utmTerm]: attr.utm_term,
    [F.keyword]: attr.keyword, [F.matchtype]: attr.matchtype, [F.dispositivo]: attr.device,
  };
  for (const [k, v] of Object.entries(origen)) if (v) f[k] = v;
  // «Origen campaña» ya existe en la tabla real: se rellena igual que lo usa
  // Lead IA 360 (texto libre), con la campaña o, si no hay, con la landing.
  f[F.origenCampana] = attr.utm_campaign ? `google_ads:${attr.utm_campaign}` : `landing:${attr.landing || 'desconocida'}`;
  return f;
}

/**
 * Reenvío de alguien que ya existe (mismo email). No se crea un segundo
 * registro: se anota el nuevo envío y se CONSERVA el origen del primer clic.
 * Si el nuevo envío trae un identificador de clic distinto, se añade al
 * histórico para no perderlo.
 */
function camposReenvio(existente, { lead, attr, ahora }) {
  const e = existente.fields || {};
  const f = {
    [F.ultimoEnvio]: ahora,
    [F.numEnvios]: (Number(e[F.numEnvios]) || 1) + 1,
    [F.ultimoEnvioId]: lead.submissionId || '',
  };
  const nota = `[${ahora.slice(0, 16).replace('T', ' ')}] Nuevo envío desde ${attr.landing || 'landing'}: «${lead.necesidad}»`;
  f[F.notas] = e[F.notas] ? `${e[F.notas]}\n${nota}` : nota;

  // Primer clic: se rellena solo si estaba vacío.
  for (const [campo, valor] of [[F.gclid, attr.gclid], [F.gbraid, attr.gbraid], [F.wbraid, attr.wbraid]]) {
    if (valor && !e[campo]) f[campo] = valor;
  }
  const nuevos = [attr.gclid && `gclid:${attr.gclid}`, attr.gbraid && `gbraid:${attr.gbraid}`, attr.wbraid && `wbraid:${attr.wbraid}`]
    .filter(Boolean)
    .filter((id) => !String(e[F.clickIdsHistorico] || '').includes(id) && id.split(':')[1] !== e[F.gclid]);
  if (nuevos.length) {
    f[F.clickIdsHistorico] = [e[F.clickIdsHistorico], ...nuevos.map((id) => `${ahora.slice(0, 10)} ${id}`)].filter(Boolean).join('\n');
  }
  // Un lead que entra por Google Ads y antes venía sin fuente de anuncio pasa
  // a google_ads (el anuncio es lo que lo ha traído de vuelta). Nunca al revés.
  if (attr.fuente === FUENTE_GOOGLE_ADS && e[F.fuente] !== FUENTE_GOOGLE_ADS) f[F.fuente] = FUENTE_GOOGLE_ADS;
  if (lead.telefono && !e[F.telefono]) f[F.telefono] = lead.telefono;
  if (lead.web && !e[F.web]) f[F.web] = lead.web;
  return f;
}

module.exports = { camposNuevoLead, camposReenvio };
