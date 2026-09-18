'use strict';
/**
 * CONTRATO DE DATOS — Leads de Google Ads → Airtable «Leads»
 * ─────────────────────────────────────────────────────────────────────────
 * Único sitio donde viven los nombres de columna. Lo usan la función
 * /api/ads-lead, el adaptador de Airtable, las pruebas, el exportador de
 * conversiones offline y el panel. Si cambia un nombre, cambia aquí.
 *
 * EXISTENTES  = columnas que ya existen hoy en la tabla Leads real
 *               (app5JfVEjK4JiMXEm / tblfQXOCLlEf9cJUa, leídas el 18/09/2026).
 * NUEVAS      = columnas ADITIVAS que hay que crear en la tabla real el día
 *               que Dirección lo apruebe (ver marketing/google-ads/airtable/
 *               MIGRACION-LEADS.md). No sustituyen ni renombran nada.
 */

const F = Object.freeze({
  // ── existentes ──
  nombre: 'Nombre',
  empresa: 'Empresa',
  email: 'Email',
  telefono: 'Telefono',
  web: 'Web',
  sector: 'Sector',
  fuente: 'Fuente',
  necesidad: 'Necesidad',
  estado: 'Estado',
  origenCampana: 'Origen campaña',
  proximoPaso: 'Próximo paso',
  notas: 'Notas comerciales',
  // ── nuevas (aditivas) ──
  ref: 'Ref lead',
  tamano: 'Tamaño empresa',
  etapa: 'Etapa embudo',
  motivoDescarte: 'Motivo descarte',
  gclid: 'GCLID',
  gbraid: 'GBRAID',
  wbraid: 'WBRAID',
  clickIdsHistorico: 'Click IDs histórico',
  utmSource: 'UTM source',
  utmMedium: 'UTM medium',
  utmCampaign: 'UTM campaign',
  utmContent: 'UTM content',
  utmTerm: 'UTM term',
  keyword: 'Keyword',
  matchtype: 'Matchtype',
  dispositivo: 'Dispositivo',
  landing: 'Landing',
  consentPrivacidad: 'Consentimiento privacidad',
  consentFecha: 'Consentimiento fecha',
  consentVersion: 'Consentimiento versión',
  consentAnuncios: 'Consentimiento anuncios',
  primerEnvio: 'Primer envío',
  ultimoEnvio: 'Último envío',
  numEnvios: 'Nº envíos',
  ultimoEnvioId: 'Último envío ID',
  ficha: 'Ficha cualificación',
  productoCandidato: 'Producto candidato',
  confianzaFicha: 'Confianza ficha',
  fechaCualificado: 'Fecha cualificado',
  reunionProgramada: 'Reunión programada',
  reunionCelebrada: 'Reunión celebrada',
  valorCliente: 'Valor cliente',
  mensualidadCliente: 'Mensualidad cliente',
  horasImplantacion: 'Horas implantación reales',
  fechaCliente: 'Fecha cliente',
  conversionesEnviadas: 'Conversiones enviadas',
  entorno: 'Entorno',
});

/** Etapas del embudo (columna NUEVA «Etapa embudo»; no toca «Estado»). */
const ETAPAS = Object.freeze([
  'Nuevo',
  'Cualificado',
  'Reunión programada',
  'Reunión celebrada',
  'Propuesta',
  'Prueba',
  'Cliente',
  'Descartado',
]);

/** Valor de «Fuente» para todo lo que llega de un clic de Google Ads. */
const FUENTE_GOOGLE_ADS = 'google_ads';
/** Valor de «Fuente» del formulario web sin clic de anuncio (ya existe). */
const FUENTE_FORMULARIO = 'formulario_web';

/** Rangos de tamaño que ofrece el formulario. */
const TAMANOS = Object.freeze(['Solo yo', '2-9', '10-49', '50-249', '250 o más']);

/**
 * Sectores del formulario → opción EXISTENTE de «Sector» en la tabla real.
 * Solo se usan opciones que ya existen, para no crear opciones nuevas en
 * producción por accidente (el adaptador NO usa typecast en «Sector»).
 */
const SECTORES = Object.freeze({
  'Servicios profesionales / despacho': 'despachos profesionales',
  'Asesoría / gestoría': 'asesorías',
  'Inmobiliaria': 'inmobiliarias',
  'Construcción / reformas': 'Construcción',
  'Salud / clínica': 'centros médicos',
  'Comercio / retail': 'Retail',
  'Hostelería / turismo': 'Turismo',
  'Industria / fabricación': 'Industria',
  'Logística / transporte': 'Logística',
  'Educación / formación': 'Educación',
  'Tecnología': 'Tecnología',
  'Otro': 'Otro',
});

const MOTIVOS_DESCARTE = Object.freeze([
  'Spam',
  'Estudiante / formación',
  'Busca empleo',
  'Busca software barato o gratis',
  'Fuera de zona / país',
  'Sin necesidad real',
  'Sin presupuesto',
  'Duplicado',
  'Otro',
]);

const CONVERSIONES = Object.freeze({
  cualificado: 'DCODE - Lead cualificado',
  reunion: 'DCODE - Reunion celebrada',
  cliente: 'DCODE - Cliente',
});

/** Base de PRODUCCIÓN: ningún entorno que no sea Production puede escribir en ella. */
const PRODUCTION_BASE_ID = 'app5JfVEjK4JiMXEm';

/** Versión del texto de privacidad/consentimiento mostrado en el formulario. */
const CONSENT_VERSION = 'ads-landing-2026-09-18';

module.exports = {
  F, ETAPAS, FUENTE_GOOGLE_ADS, FUENTE_FORMULARIO, TAMANOS, SECTORES,
  MOTIVOS_DESCARTE, CONVERSIONES, PRODUCTION_BASE_ID, CONSENT_VERSION,
};
