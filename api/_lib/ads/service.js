'use strict';
/**
 * Orquestación: validar → origen → deduplicar → ficha → guardar.
 * No sabe nada de HTTP; la función /api/ads-lead solo la envuelve.
 */
const crypto = require('node:crypto');
const { F, ETAPAS } = require('./schema');
const { validateLead } = require('./validate');
const { parseAttribution } = require('./attribution');
const { construirFicha } = require('./ficha');
const { camposNuevoLead, camposReenvio } = require('./record');
const { puedeTransicionar } = require('./crm-rules');

const nuevoRef = () => `L-${crypto.randomBytes(9).toString('base64url')}`;
const REF = /^L-[A-Za-z0-9_-]{12}$/;

/**
 * @param {object} p
 * @param {object} p.body        cuerpo JSON recibido
 * @param {object} p.store       almacén (Airtable o memoria)
 * @param {string} p.entorno     'production' | 'preview' | 'development' | 'test'
 * @param {Function} [p.leerWeb] lector de evidencia web (opcional)
 * @param {Function} [p.now]
 */
async function registrarLead({ body, store, entorno, leerWeb = null, now = () => new Date() }) {
  const v = validateLead(body || {});
  if (!v.ok) return { ok: false, status: 400, errors: v.errors };
  if (v.spam) {
    // A un bot no se le da ninguna pista: respuesta de éxito, nada guardado.
    return { ok: true, status: 200, spam: true, ref: nuevoRef(), duplicate: false, guardado: false };
  }
  const lead = v.lead;
  const attr = parseAttribution((body && body.attribution) || {});
  const ahora = now().toISOString();

  const existentes = await store.buscarPorEmail(lead.email);
  if (existentes.length > 0) {
    const e = existentes[0];
    // Doble clic o reintento de red: el mismo envío no cuenta dos veces.
    if (lead.submissionId && e.fields[F.ultimoEnvioId] === lead.submissionId) {
      return { ok: true, status: 200, ref: e.fields[F.ref] || '', duplicate: true, idempotente: true, recordId: e.id, fuente: e.fields[F.fuente], guardado: false };
    }
    let ref = e.fields[F.ref];
    const campos = camposReenvio(e, { lead, attr, ahora });
    if (!ref) { ref = nuevoRef(); campos[F.ref] = ref; }
    const r = await store.actualizar(e.id, campos);
    return { ok: true, status: 200, ref, duplicate: true, recordId: r.id, fuente: r.fields[F.fuente], guardado: true };
  }

  let web = null;
  if (leerWeb && lead.web) web = await leerWeb(lead.web);
  const ficha = construirFicha(lead, attr, web);
  const ref = nuevoRef();
  const r = await store.crear(camposNuevoLead({ lead, attr, ficha, ref, ahora, entorno }));
  return { ok: true, status: 201, ref, duplicate: false, recordId: r.id, fuente: attr.fuente, ficha, guardado: true };
}

/**
 * Eventos posteriores al formulario que llegan desde la web (hoy: reserva
 * confirmada en Cal.com). Solo avanzan la etapa si la transición es válida.
 */
async function registrarEvento({ body, store, now = () => new Date() }) {
  const tipo = String((body && body.tipo) || '');
  const ref = String((body && body.ref) || '');
  if (tipo !== 'reserva') return { ok: false, status: 400, errors: { tipo: 'Evento no soportado' } };
  if (!REF.test(ref)) return { ok: false, status: 400, errors: { ref: 'Referencia no válida' } };
  const inicio = String((body && body.inicio) || '');
  const fechaInicio = inicio && !Number.isNaN(Date.parse(inicio)) ? new Date(inicio).toISOString() : '';

  const [e] = await store.buscarPorRef(ref);
  if (!e) return { ok: false, status: 404, errors: { ref: 'Lead no encontrado' } };
  const etapa = e.fields[F.etapa] || 'Nuevo';
  const campos = { [F.reunionProgramada]: fechaInicio || now().toISOString() };
  // Reservar desde la web no salta la cualificación humana, pero sí deja
  // constancia de la reunión. Desde «Nuevo» se anota la fecha sin mover la
  // etapa: la persona que cualifica decide si pasa a «Reunión programada».
  if (etapa === 'Cualificado' && puedeTransicionar(etapa, 'Reunión programada')) {
    campos[F.etapa] = 'Reunión programada';
  }
  const nota = `[${now().toISOString().slice(0, 16).replace('T', ' ')}] Reserva de diagnóstico desde la web${fechaInicio ? ` para ${fechaInicio.slice(0, 16).replace('T', ' ')} UTC` : ''}.`;
  campos[F.notas] = e.fields[F.notas] ? `${e.fields[F.notas]}\n${nota}` : nota;
  const r = await store.actualizar(e.id, campos);
  return { ok: true, status: 200, ref, etapa: r.fields[F.etapa] || etapa };
}

module.exports = { registrarLead, registrarEvento, nuevoRef, REF, ETAPAS };
