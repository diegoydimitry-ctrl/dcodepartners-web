'use strict';
// Tipos de Airtable de cada columna del contrato (schema.js). Lo usan:
//  · la creación de la base de PRUEBAS (idéntica a la real + columnas nuevas)
//  · MIGRACION-LEADS.md (qué hay que añadir a la tabla real)
//  · la prueba de contrato (todas las columnas que escribe el código existen)
const path = require('node:path');
const { F, ETAPAS, TAMANOS, MOTIVOS_DESCARTE, SECTORES } = require(path.join(__dirname, '../../../api/_lib/ads/schema.js'));

const dt = { dateFormat: { name: 'iso' }, timeFormat: { name: '24hour' }, timeZone: 'Europe/Madrid' };
const sel = (xs) => ({ choices: xs.map((name) => ({ name })) });

// EXISTENTES: ya están en la tabla Leads real (no se crean en producción).
const EXISTENTES = [
  { name: F.email, type: 'email' },
  { name: F.nombre, type: 'singleLineText' },
  { name: F.empresa, type: 'singleLineText' },
  { name: F.telefono, type: 'phoneNumber' },
  { name: F.web, type: 'url' },
  { name: F.sector, type: 'singleSelect', options: sel([...new Set(Object.values(SECTORES))]) },
  { name: F.fuente, type: 'singleSelect', options: sel(['formulario_web', 'google_ads', 'Radar Comercial IA', 'Web', 'Otro']) },
  { name: F.necesidad, type: 'multilineText' },
  { name: F.estado, type: 'singleSelect', options: sel(['Nuevo', 'En seguimiento', 'Propuesta enviada', 'Cerrado ganado', 'Cerrado perdido', 'En proceso']) },
  { name: F.origenCampana, type: 'singleLineText' },
  { name: F.proximoPaso, type: 'multilineText' },
  { name: F.notas, type: 'multilineText' },
];

// NUEVAS: aditivas. Son las que hay que crear en la tabla real el día de activación.
const NUEVAS = [
  { name: F.ref, type: 'singleLineText', description: 'Referencia opaca del lead (L-…). Enlaza la reserva de Cal.com y la URL de gracias sin datos personales.' },
  { name: F.tamano, type: 'singleSelect', options: sel(TAMANOS) },
  { name: F.etapa, type: 'singleSelect', options: sel(ETAPAS), description: 'Embudo de las landings. No sustituye a «Estado».' },
  { name: F.motivoDescarte, type: 'singleSelect', options: sel(MOTIVOS_DESCARTE) },
  { name: F.gclid, type: 'singleLineText', description: 'Identificador del PRIMER clic de Google Ads. No se sobrescribe.' },
  { name: F.gbraid, type: 'singleLineText' },
  { name: F.wbraid, type: 'singleLineText' },
  { name: F.clickIdsHistorico, type: 'multilineText', description: 'Identificadores de clics posteriores del mismo lead.' },
  { name: F.utmSource, type: 'singleLineText' },
  { name: F.utmMedium, type: 'singleLineText' },
  { name: F.utmCampaign, type: 'singleLineText' },
  { name: F.utmContent, type: 'singleLineText' },
  { name: F.utmTerm, type: 'singleLineText' },
  { name: F.keyword, type: 'singleLineText' },
  { name: F.matchtype, type: 'singleLineText' },
  { name: F.dispositivo, type: 'singleLineText' },
  { name: F.landing, type: 'singleLineText' },
  { name: F.consentPrivacidad, type: 'checkbox', options: { icon: 'check', color: 'greenBright' } },
  { name: F.consentFecha, type: 'dateTime', options: dt },
  { name: F.consentVersion, type: 'singleLineText' },
  { name: F.consentAnuncios, type: 'singleSelect', options: sel(['granted', 'denied', 'sin_banner']) },
  { name: F.primerEnvio, type: 'dateTime', options: dt },
  { name: F.ultimoEnvio, type: 'dateTime', options: dt },
  { name: F.numEnvios, type: 'number', options: { precision: 0 } },
  { name: F.ultimoEnvioId, type: 'singleLineText' },
  { name: F.ficha, type: 'multilineText', description: 'Ficha automática: HECHO / INFERENCIA / HIPÓTESIS separados.' },
  { name: F.productoCandidato, type: 'singleLineText' },
  { name: F.confianzaFicha, type: 'singleSelect', options: sel(['Alta', 'Media', 'Baja']) },
  { name: F.fechaCualificado, type: 'dateTime', options: dt },
  { name: F.reunionProgramada, type: 'dateTime', options: dt },
  { name: F.reunionCelebrada, type: 'dateTime', options: dt },
  { name: F.valorCliente, type: 'currency', options: { precision: 2, symbol: '€' } },
  { name: F.mensualidadCliente, type: 'currency', options: { precision: 2, symbol: '€' }, description: 'Cuota mensual acordada (solo si hay trabajo recurrente real). Para MRR.' },
  { name: F.horasImplantacion, type: 'number', options: { precision: 1 }, description: 'Horas reales de implantación (también si la prueba no acaba en cliente). Para el CAC completo.' },
  { name: F.fechaCliente, type: 'dateTime', options: dt },
  { name: F.conversionesEnviadas, type: 'multipleSelects', options: sel(['lead_cualificado', 'reunion_celebrada', 'cliente']) },
  { name: F.entorno, type: 'singleSelect', options: sel(['preview', 'production', 'development', 'test']) },
];

// Propuestas Generadas: columnas nuevas para no perder el origen.
const PROPUESTAS_NUEVAS = [
  { name: 'Fuente lead', type: 'singleLineText' },
  { name: 'GCLID lead', type: 'singleLineText' },
  { name: 'Ref lead', type: 'singleLineText' },
  { name: 'Campaña lead', type: 'singleLineText' },
  { name: 'Keyword lead', type: 'singleLineText' },
];

module.exports = { EXISTENTES, NUEVAS, PROPUESTAS_NUEVAS };
