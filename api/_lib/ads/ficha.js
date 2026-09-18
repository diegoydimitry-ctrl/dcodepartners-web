'use strict';
/**
 * FICHA INTERNA DE CUALIFICACIÓN
 *
 * Regla: HECHO ≠ INFERENCIA. Cada línea lleva su etiqueta y su origen.
 *   HECHO (declarado)  → lo escribió el lead en el formulario.
 *   HECHO (web)        → aparece literalmente en su web, con fecha.
 *   HECHO (origen)     → dato técnico del clic (landing, keyword…).
 *   INFERENCIA         → deducción de reglas; puede ser falsa.
 *   HIPÓTESIS          → lo que habría que comprobar en el diagnóstico.
 * Nunca se escribe una inferencia con redacción de hecho.
 *
 * El producto candidato solo puede salir del catálogo «vendible ahora»
 * (Notion · CATÁLOGO 16/08/2026 + PRICING OFICIAL 19/08/2026). Si no hay
 * señales suficientes, la ficha lo dice en vez de inventar.
 */
const { LANDINGS } = require('./landings');

const CATALOGO = [
  {
    producto: 'Comercial IA · núcleo (CRM + Propuestas + Recordatorio)',
    senales: ['seguimiento', 'presupuesto', 'presupuestos', 'propuesta', 'propuestas', 'crm', 'leads', 'lead', 'clientes potenciales', 'ventas', 'comercial', 'olvid', 'contestan', 'responden'],
    landing: '/automatizacion-seguimiento-comercial',
  },
  {
    producto: 'Soporte IA · Tickets IA',
    senales: ['consulta', 'consultas', 'correo', 'correos', 'email', 'emails', 'atención', 'atencion', 'incidencia', 'incidencias', 'soporte', 'ticket', 'tickets', 'responder', 'bandeja'],
    landing: '/automatizacion-atencion-clientes',
  },
  {
    producto: 'Producción IA (proyectos, tareas y plazos)',
    senales: ['proyecto', 'proyectos', 'tarea', 'tareas', 'plazo', 'plazos', 'entrega', 'entregas', 'equipo', 'asignar', 'carga de trabajo'],
    landing: null,
  },
  {
    producto: 'Automatización individual · Básica (recordatorios, copias, encuestas)',
    senales: ['recordatorio', 'recordatorios', 'cobro', 'cobros', 'impagad', 'copia de seguridad', 'copias', 'encuesta', 'encuestas'],
    landing: null,
  },
  {
    producto: 'Marketing IA · SEO IA',
    senales: ['seo', 'posicionamiento', 'google maps', 'aparecer en google', 'visibilidad web'],
    landing: null,
  },
];

function normaliza(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function puntuar(texto) {
  const t = normaliza(texto);
  return CATALOGO.map((c) => ({
    ...c,
    aciertos: c.senales
      .filter((s) => t.includes(normaliza(s)))
      // «presupuesto» y «presupuestos» son la misma señal: se cuenta una vez.
      .filter((s, _i, arr) => !arr.some((o) => o !== s && normaliza(s).includes(normaliza(o)))),
  })).sort((a, b) => b.aciertos.length - a.aciertos.length);
}

/**
 * @param {object} lead   salida de validateLead().lead
 * @param {object} attr   salida de parseAttribution()
 * @param {{ok:boolean,hechos:string[],motivo?:string,url?:string}|null} web  salida de leerWeb() o null
 */
function construirFicha(lead, attr = {}, web = null) {
  const hechos = [
    `HECHO (declarado): empresa «${lead.empresa}», sector elegido «${lead.sectorForm}», tamaño «${lead.tamano}».`,
    `HECHO (declarado): proceso que les quita tiempo: «${lead.necesidad}».`,
  ];
  if (lead.web) hechos.push(`HECHO (declarado): web ${lead.web}.`);
  if (attr.landing) hechos.push(`HECHO (origen): llegó por la landing ${attr.landing}.`);
  if (attr.keyword) hechos.push(`HECHO (origen): palabra clave «${attr.keyword}»${attr.matchtype ? ` (concordancia ${attr.matchtype})` : ''}.`);
  if (attr.fuente) hechos.push(`HECHO (origen): fuente ${attr.fuente}.`);

  const evidencia = [];
  if (web && web.ok) web.hechos.forEach((h) => evidencia.push(`HECHO (web): ${h}`));
  else if (lead.web && web) evidencia.push(`SIN EVIDENCIA WEB: ${web.motivo || 'no se pudo leer'} (se comprueba en el diagnóstico).`);
  else if (lead.web) evidencia.push('SIN EVIDENCIA WEB: la lectura de la web no está activada en este entorno.');
  else evidencia.push('SIN EVIDENCIA WEB: el lead no ha dado web.');

  const ranking = puntuar(`${lead.necesidad} ${web && web.ok ? web.hechos.join(' ') : ''}`);
  const mejor = ranking[0];
  const landingInfo = LANDINGS[attr.landing] || null;
  const coincideLanding = mejor.aciertos.length > 0 && mejor.landing && mejor.landing === attr.landing;

  let producto;
  let confianza;
  const inferencias = [];
  if (mejor.aciertos.length >= 2 || coincideLanding) {
    producto = mejor.producto;
    confianza = mejor.aciertos.length >= 2 && (coincideLanding || !mejor.landing) ? 'Alta' : 'Media';
    inferencias.push(`INFERENCIA: por las palabras «${mejor.aciertos.join('», «')}» del texto, el sistema candidato es ${mejor.producto}.`);
  } else if (mejor.aciertos.length === 1) {
    producto = mejor.producto;
    confianza = 'Baja';
    inferencias.push(`INFERENCIA DÉBIL: una sola señal («${mejor.aciertos[0]}») apunta a ${mejor.producto}.`);
  } else if (landingInfo) {
    producto = landingInfo.productoPorDefecto;
    confianza = 'Baja';
    inferencias.push(`INFERENCIA DÉBIL: el texto no contiene señales claras; se toma el producto de la landing (${attr.landing}).`);
  } else {
    producto = 'Sin candidato claro — se decide en el diagnóstico';
    confianza = 'Baja';
    inferencias.push('INFERENCIA: no hay señales suficientes para proponer un sistema concreto.');
  }
  if (mejor.aciertos.length > 0 && landingInfo && mejor.landing && mejor.landing !== attr.landing) {
    inferencias.push(`INFERENCIA: el texto apunta a otro problema distinto al de la landing por la que entró (${attr.landing}).`);
  }
  if (web && !web.ok) confianza = confianza === 'Alta' ? 'Media' : confianza;

  const hipotesis = [
    `HIPÓTESIS: el proceso descrito ocurre con frecuencia suficiente para que automatizarlo compense (comprobar volumen semanal en el diagnóstico).`,
    `HIPÓTESIS: las herramientas que usan hoy permiten conectarse (comprobar cuáles son en el diagnóstico).`,
  ];
  if (['Solo yo', '2-9'].includes(lead.tamano)) {
    hipotesis.push('HIPÓTESIS: con este tamaño, una automatización individual puede encajar mejor que un Departamento completo.');
  }

  const proximoPaso = 'Revisión humana en menos de 24 h laborables. Si encaja: diagnóstico de 30 min. La propuesta NO se prepara hasta después del diagnóstico.';

  const texto = [
    'FICHA DE CUALIFICACIÓN (generada automáticamente; revisar antes de usar)',
    '',
    '— HECHOS —', ...hechos,
    '',
    '— EVIDENCIA ENCONTRADA —', ...evidencia,
    '',
    '— SISTEMA CANDIDATO —',
    `${producto} · confianza ${confianza}`,
    ...inferencias,
    '',
    '— HIPÓTESIS A COMPROBAR —', ...hipotesis,
    '',
    '— PRÓXIMO PASO —', proximoPaso,
  ].join('\n');

  return { hechos, evidencia, producto, confianza, inferencias, hipotesis, proximoPaso, texto };
}

module.exports = { construirFicha, CATALOGO, puntuar };
