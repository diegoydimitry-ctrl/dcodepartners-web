// Pruebas del servidor de las landings (node --test). Sin red real.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const { validateLead } = require('../../api/_lib/ads/validate.js');
const { parseAttribution } = require('../../api/_lib/ads/attribution.js');
const { registrarLead, registrarEvento } = require('../../api/_lib/ads/service.js');
const { crearMemoryStore } = require('../../api/_lib/ads/store-memory.js');
const { crearAirtableStore, escFormula } = require('../../api/_lib/ads/store-airtable.js');
const { politicaPropuesta, origenParaPropuesta, puedeTransicionar, PROPUESTA_BORRADOR } = require('../../api/_lib/ads/crm-rules.js');
const { leerConfig } = require('../../api/_lib/ads/config.js');
const { construirFicha } = require('../../api/_lib/ads/ficha.js');
const { leerWeb, ipPrivada } = require('../../api/_lib/ads/evidence.js');
const { F, PRODUCTION_BASE_ID } = require('../../api/_lib/ads/schema.js');
const { crearHandler } = require('../../api/ads-lead.js');
const { crearHandler: crearHandlerEvento } = require('../../api/ads-lead-event.js');
const httpLib = require('../../api/_lib/ads/http.js');
const { generarConversiones, aCsv } = require('../../marketing/google-ads/offline-conversions/conversiones.cjs');

const GCLID = 'Cj0KCQjw_TEST-gclid-000001';
const base = (extra = {}) => ({
  nombre: 'Laura Prueba', empresa: 'Reformas Ejemplo', email: 'Laura@Ejemplo.es', web: 'ejemplo.es',
  telefono: '', sector: 'Construcción / reformas', tamano: '2-9',
  necesidad: 'Enviamos presupuestos y nadie hace seguimiento', privacidad: true, fill_ms: 9000,
  submission_id: 'sub-00000001', ad_consent: 'granted',
  attribution: { gclid: GCLID, utm_source: 'google', utm_medium: 'cpc', utm_campaign: '123456', utm_content: '789', utm_term: 'automatizar seguimiento de presupuestos', matchtype: 'p', device: 'm', landing: '/automatizacion-seguimiento-comercial' },
  ...extra,
});
const fijo = () => new Date('2026-09-20T10:00:00Z');

/* ───────── validación ───────── */
test('validación: un envío correcto se normaliza', () => {
  const v = validateLead(base());
  assert.equal(v.ok, true);
  assert.equal(v.lead.email, 'laura@ejemplo.es');
  assert.equal(v.lead.web, 'https://ejemplo.es');
  assert.equal(v.lead.sector, 'Construcción', 'se mapea a una opción que YA existe en Airtable');
});
test('validación: faltan obligatorios y privacidad', () => {
  const v = validateLead({});
  assert.equal(v.ok, false);
  for (const k of ['nombre', 'empresa', 'email', 'sector', 'tamano', 'necesidad', 'privacidad']) assert.ok(v.errors[k], k);
});
test('validación: teléfono inválido, web inválida, sector inventado', () => {
  const v = validateLead(base({ telefono: '12', web: 'javascript:alert(1)', sector: 'Hackers' }));
  assert.ok(v.errors.telefono && v.errors.web && v.errors.sector);
});
test('validación: trampa anti-bot y envío demasiado rápido', () => {
  assert.equal(validateLead(base({ website_confirm: 'x' })).spam, true);
  assert.equal(validateLead(base({ fill_ms: 400 })).spam, true);
});
test('validación: se ignoran campos no previstos y se quita HTML', () => {
  const v = validateLead(base({ empresa: '<b>Reformas</b> Ejemplo', dni: '00000000T', tarjeta: '4111' }));
  assert.equal(v.lead.empresa, 'bReformas/b Ejemplo');
  assert.equal(v.lead.dni, undefined);
  assert.equal(v.lead.tarjeta, undefined);
});

/* ───────── atribución ───────── */
test('atribución: gclid válido ⇒ google_ads', () => {
  const a = parseAttribution(base().attribution);
  assert.equal(a.fuente, 'google_ads');
  assert.equal(a.gclid, GCLID);
  assert.equal(a.matchtype, 'frase');
  assert.equal(a.device, 'móvil');
  assert.equal(a.keyword, 'automatizar seguimiento de presupuestos', '{keyword} se toma de utm_term');
});
test('atribución: utm google/cpc sin gclid también es google_ads; orgánico no', () => {
  assert.equal(parseAttribution({ utm_source: 'google', utm_medium: 'cpc' }).fuente, 'google_ads');
  assert.equal(parseAttribution({ utm_source: 'google', utm_medium: 'organic' }).fuente, 'formulario_web');
  assert.equal(parseAttribution({}).fuente, 'formulario_web');
});
test('atribución: identificadores y landings manipulados se descartan', () => {
  const a = parseAttribution({ gclid: '<script>x</script>', landing: '/admin', matchtype: 'zzz' });
  assert.equal(a.gclid, '');
  assert.equal(a.landing, '');
  assert.deepEqual(a.descartados.sort(), ['gclid', 'landing', 'matchtype']);
});

/* ───────── negocio: registro, duplicados, origen ───────── */
test('NEGOCIO · un lead entra → se registra correctamente', async () => {
  const store = crearMemoryStore();
  const r = await registrarLead({ body: base(), store, entorno: 'preview', now: fijo });
  assert.equal(r.ok, true); assert.equal(r.duplicate, false);
  assert.equal(store.registros.length, 1);
  const f = store.registros[0].fields;
  assert.equal(f[F.email], 'laura@ejemplo.es');
  assert.equal(f[F.fuente], 'google_ads');
  assert.equal(f[F.gclid], GCLID);
  assert.equal(f[F.utmCampaign], '123456');
  assert.equal(f[F.keyword], 'automatizar seguimiento de presupuestos');
  assert.equal(f[F.landing], '/automatizacion-seguimiento-comercial');
  assert.equal(f[F.consentPrivacidad], true);
  assert.equal(f[F.consentFecha], '2026-09-20T10:00:00.000Z');
  assert.equal(f[F.etapa], 'Nuevo');
  assert.equal(f[F.estado], 'Nuevo');
  assert.equal(f[F.entorno], 'preview');
  assert.match(f[F.ref], /^L-[A-Za-z0-9_-]{12}$/);
  assert.match(f[F.ficha], /HECHO \(declarado\)/);
  assert.equal(f[F.tamano], '2-9');
  assert.equal(f[F.sector], 'Construcción');
});
test('NEGOCIO · un lead repetido → no duplica y conserva el primer clic', async () => {
  const store = crearMemoryStore();
  await registrarLead({ body: base(), store, entorno: 'preview', now: fijo });
  const segundo = base({ email: ' laura@EJEMPLO.es ', submission_id: 'sub-00000002', attribution: { ...base().attribution, gclid: 'Cj0KCQjw_TEST-gclid-000002' } });
  const r = await registrarLead({ body: segundo, store, entorno: 'preview', now: fijo });
  assert.equal(r.duplicate, true);
  assert.equal(store.registros.length, 1, 'sigue habiendo un solo registro');
  const f = store.registros[0].fields;
  assert.equal(f[F.numEnvios], 2);
  assert.equal(f[F.gclid], GCLID, 'el GCLID del primer clic no se pisa');
  assert.match(f[F.clickIdsHistorico], /gclid:Cj0KCQjw_TEST-gclid-000002/);
  assert.match(f[F.notas], /Nuevo envío/);
});
test('NEGOCIO · doble clic en «enviar» (mismo submission_id) no cuenta dos veces', async () => {
  const store = crearMemoryStore();
  await registrarLead({ body: base(), store, entorno: 'preview', now: fijo });
  await registrarLead({ body: base(), store, entorno: 'preview', now: fijo });
  const r = await registrarLead({ body: base(), store, entorno: 'preview', now: fijo });
  assert.equal(r.idempotente, true);
  assert.equal(store.registros[0].fields[F.numEnvios], 1);
});
test('NEGOCIO · un envío de bot no se guarda pero recibe respuesta normal', async () => {
  const store = crearMemoryStore();
  const r = await registrarLead({ body: base({ website_confirm: 'http://spam' }), store, entorno: 'preview' });
  assert.equal(r.ok, true); assert.equal(r.guardado, false);
  assert.equal(store.registros.length, 0);
});
test('NEGOCIO · un lead de Google Ads NO dispara propuesta automática', () => {
  const p = politicaPropuesta({ fuente: 'google_ads', etapa: 'Nuevo' });
  assert.equal(p.generarAutomatica, false);
  assert.equal(p.envioAutomatico, false);
  assert.equal(p.estadoPropuesta, PROPUESTA_BORRADOR);
  const tras = politicaPropuesta({ fuente: 'google_ads', etapa: 'Reunión celebrada' });
  assert.equal(tras.envioAutomatico, false, 'ni siquiera tras el diagnóstico se envía sola');
  assert.equal(politicaPropuesta({ fuente: 'formulario_web' }).envioAutomatico, false);
});
test('NEGOCIO · una propuesta conserva el origen del lead', async () => {
  const store = crearMemoryStore();
  await registrarLead({ body: base(), store, entorno: 'preview', now: fijo });
  const o = origenParaPropuesta(store.registros[0].fields);
  assert.equal(o['Fuente lead'], 'google_ads');
  assert.equal(o['GCLID lead'], GCLID);
  assert.equal(o['Keyword lead'], 'automatizar seguimiento de presupuestos');
  assert.match(o['Ref lead'], /^L-/);
});
test('NEGOCIO · un cliente conserva el GCLID y sale en la conversión offline con su valor', async () => {
  const store = crearMemoryStore();
  await registrarLead({ body: base(), store, entorno: 'production', now: fijo });
  const rec = store.registros[0];
  // Avance humano por el embudo (lo haría la App / Airtable).
  const pasos = ['Cualificado', 'Reunión programada', 'Reunión celebrada', 'Propuesta', 'Prueba', 'Cliente'];
  let etapa = rec.fields[F.etapa];
  for (const p of pasos) { assert.ok(puedeTransicionar(etapa, p), `${etapa} → ${p}`); etapa = p; }
  await store.actualizar(rec.id, {
    [F.etapa]: 'Cliente', [F.fechaCualificado]: '2026-09-21T09:00:00Z', [F.reunionCelebrada]: '2026-09-24T16:00:00Z',
    [F.fechaCliente]: '2026-10-30T12:00:00Z', [F.valorCliente]: 2600,
  });
  assert.equal(rec.fields[F.gclid], GCLID);
  const { filas, paraMarcar } = generarConversiones(store.registros);
  assert.equal(filas.length, 3);
  const cliente = filas.find((f) => f.nombre === 'DCODE - Cliente');
  assert.equal(cliente.gclid, GCLID); assert.equal(cliente.valor, '2600.00'); assert.equal(cliente.moneda, 'EUR');
  assert.equal(cliente.hora, '2026-10-30 13:00:00', 'hora local de Madrid');
  assert.equal(paraMarcar.length, 3);
  const csv = aCsv(filas);
  assert.match(csv, /^Parameters:TimeZone=Europe\/Madrid\nGoogle Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency\n/);
  // Una vez marcadas como enviadas, no se repiten.
  rec.fields[F.conversionesEnviadas] = ['lead_cualificado', 'reunion_celebrada', 'cliente'];
  assert.equal(generarConversiones(store.registros).filas.length, 0);
});
test('conversiones offline: pruebas y registros sin gclid no se exportan; fuera de ventana avisa', () => {
  const r = generarConversiones([
    { id: 'a', fields: { [F.empresa]: 'X', [F.entorno]: 'preview', [F.gclid]: GCLID, [F.fechaCualificado]: '2026-09-21T09:00:00Z' } },
    { id: 'b', fields: { [F.empresa]: 'Y', [F.entorno]: 'production', [F.wbraid]: 'wbraid_ABCDEFGHIJ', [F.fechaCualificado]: '2026-09-21T09:00:00Z' } },
    { id: 'c', fields: { [F.empresa]: 'Z', [F.entorno]: 'production', [F.gclid]: GCLID, [F.primerEnvio]: '2026-01-01T00:00:00Z', [F.fechaCliente]: '2026-09-01T00:00:00Z', [F.valorCliente]: 800 } },
  ]);
  assert.equal(r.filas.length, 0);
  assert.equal(r.braid.length, 1);
  assert.ok(r.avisos.some((a) => a.includes('90 días')));
});

/* ───────── reserva ───────── */
test('reserva: anota la reunión; solo mueve la etapa si ya estaba cualificado', async () => {
  const store = crearMemoryStore();
  const r = await registrarLead({ body: base(), store, entorno: 'preview', now: fijo });
  let e = await registrarEvento({ body: { tipo: 'reserva', ref: r.ref, inicio: '2026-09-25T09:30:00Z' }, store, now: fijo });
  assert.equal(e.ok, true);
  assert.equal(store.registros[0].fields[F.reunionProgramada], '2026-09-25T09:30:00.000Z');
  assert.equal(store.registros[0].fields[F.etapa], 'Nuevo', 'no se salta la cualificación humana');
  store.registros[0].fields[F.etapa] = 'Cualificado';
  e = await registrarEvento({ body: { tipo: 'reserva', ref: r.ref }, store, now: fijo });
  assert.equal(store.registros[0].fields[F.etapa], 'Reunión programada');
  assert.equal((await registrarEvento({ body: { tipo: 'reserva', ref: 'L-inexistente0' }, store })).status, 404);
  assert.equal((await registrarEvento({ body: { tipo: 'reserva', ref: 'x' }, store })).status, 400);
  assert.equal((await registrarEvento({ body: { tipo: 'borrar', ref: r.ref }, store })).status, 400);
});

/* ───────── ficha: HECHO ≠ INFERENCIA ───────── */
test('ficha: hechos, inferencias e hipótesis separados y etiquetados', () => {
  const v = validateLead(base());
  const a = parseAttribution(base().attribution);
  const f = construirFicha(v.lead, a, { ok: true, hechos: ['La web ejemplo.es responde (HTTP 200) a 2026-09-20.', 'Título de la portada: «Reformas Ejemplo»'] });
  assert.ok(f.hechos.every((h) => h.startsWith('HECHO')));
  assert.ok(f.inferencias.every((h) => h.startsWith('INFERENCIA')));
  assert.ok(f.hipotesis.every((h) => h.startsWith('HIPÓTESIS')));
  assert.ok(f.evidencia.every((h) => h.startsWith('HECHO (web)')));
  assert.equal(f.producto, 'Comercial IA · núcleo (CRM + Propuestas + Recordatorio)');
  assert.ok(!/HECHO[^\n]*(candidato|encaja|probablemente)/i.test(f.texto), 'ninguna inferencia redactada como hecho');
});
test('ficha: sin señales no inventa producto concreto', () => {
  const v = validateLead(base({ necesidad: 'Queremos hablar con vosotros sobre varias cosas' }));
  const f = construirFicha(v.lead, parseAttribution({}), null);
  assert.equal(f.confianza, 'Baja');
  assert.match(f.producto, /Sin candidato claro/);
});

/* ───────── evidencia web (SSRF) ───────── */
test('evidencia: bloquea IPs privadas, IP literal, redirecciones y no-HTML', async () => {
  assert.equal(ipPrivada('10.0.0.1'), true); assert.equal(ipPrivada('192.168.1.2'), true); assert.equal(ipPrivada('169.254.169.254'), true);
  assert.equal(ipPrivada('8.8.8.8'), false);
  const priv = async () => [{ address: '127.0.0.1' }];
  assert.equal((await leerWeb('https://interno.ejemplo.es', { lookup: priv })).ok, false);
  assert.equal((await leerWeb('http://169.254.169.254/latest', { lookup: priv })).ok, false);
  assert.equal((await leerWeb('https://ejemplo.es:8080', { lookup: async () => [{ address: '8.8.8.8' }] })).ok, false);
  const pub = async () => [{ address: '93.184.216.34' }];
  const redir = async () => ({ status: 302, ok: false, headers: new Headers({ location: 'http://127.0.0.1' }) });
  assert.match((await leerWeb('https://ejemplo.es', { lookup: pub, fetchImpl: redir })).motivo, /redirige/);
  const pdf = async () => new Response('x', { status: 200, headers: { 'content-type': 'application/pdf' } });
  assert.equal((await leerWeb('https://ejemplo.es', { lookup: pub, fetchImpl: pdf })).ok, false);
  const html = async () => new Response('<html><title>Reformas Ejemplo</title><meta name="description" content="Reformas en Madrid"><h1>Reformamos tu baño</h1></html>', { status: 200, headers: { 'content-type': 'text/html' } });
  const w = await leerWeb('https://ejemplo.es', { lookup: pub, fetchImpl: html });
  assert.equal(w.ok, true);
  assert.ok(w.hechos.some((h) => h.includes('Reformas Ejemplo')));
});

/* ───────── configuración y seguridad ───────── */
test('config: Production bloqueado por defecto; Preview no puede escribir en la base real', () => {
  assert.equal(leerConfig({ VERCEL_ENV: 'production' }).bloqueadoProduccion, true);
  assert.equal(leerConfig({ VERCEL_ENV: 'production', ADS_LEAD_PRODUCTION_ENABLED: '1' }).bloqueadoProduccion, false);
  const c = leerConfig({ VERCEL_ENV: 'preview', ADS_LEAD_MODE: 'airtable', AIRTABLE_ADS_TOKEN: 't', AIRTABLE_ADS_BASE_ID: PRODUCTION_BASE_ID });
  assert.ok(c.problemas.some((p) => p.includes('PRODUCCIÓN')));
  assert.ok(leerConfig({ VERCEL_ENV: 'preview', ADS_LEAD_MODE: 'airtable' }).problemas.length > 0);
  assert.equal(leerConfig({}).modo, 'dryrun');
});

function fakeRes() {
  const r = { statusCode: 200, headers: {}, body: null };
  r.setHeader = (k, v) => { r.headers[k.toLowerCase()] = v; };
  r.status = (c) => { r.statusCode = c; return r; };
  r.json = (o) => { r.body = o; return r; };
  return r;
}
const req = (body, extra = {}) => ({
  method: 'POST', body,
  headers: { 'content-type': 'application/json', origin: 'https://preview.vercel.app', host: 'preview.vercel.app', 'x-forwarded-for': extra.ip || '1.1.1.1', ...(extra.headers || {}) },
  ...extra.req,
});
const cfgTest = { entorno: 'preview', modo: 'airtable', problemas: [], bloqueadoProduccion: false, leerWeb: false, turnstileSecret: '' };

test('handler: método, origen, tipo, tamaño, límite de ritmo', async () => {
  httpLib._registro.clear();
  const h = crearHandler({ store: crearMemoryStore(), config: cfgTest });
  let r = fakeRes(); await h({ ...req(base()), method: 'GET' }, r); assert.equal(r.statusCode, 405);
  r = fakeRes(); await h(req(base(), { headers: { origin: 'https://atacante.es' } }), r); assert.equal(r.statusCode, 403);
  r = fakeRes(); await h(req(base(), { headers: { 'content-type': 'text/plain' }, ip: '2.2.2.2' }), r); assert.equal(r.statusCode, 415);
  r = fakeRes(); await h(req({ ...base(), necesidad: 'x'.repeat(20000) }, { ip: '3.3.3.3' }), r); assert.equal(r.statusCode, 413);
  for (let i = 0; i < 8; i++) { r = fakeRes(); await h(req(base({ submission_id: `sub-rl-${i}000` }), { ip: '9.9.9.9' }), r); }
  r = fakeRes(); await h(req(base(), { ip: '9.9.9.9' }), r); assert.equal(r.statusCode, 429);
});
test('handler: éxito devuelve SOLO la referencia (nada de la ficha interna)', async () => {
  httpLib._registro.clear();
  const h = crearHandler({ store: crearMemoryStore(), config: cfgTest });
  const r = fakeRes(); await h(req(base()), r);
  assert.equal(r.statusCode, 201);
  assert.deepEqual(Object.keys(r.body).sort(), ['duplicado', 'modo', 'ok', 'ref']);
  assert.equal(r.headers['cache-control'], 'no-store');
});
test('handler: Production sin activar responde 503 y no guarda', async () => {
  const store = crearMemoryStore();
  const h = crearHandler({ store, config: { ...cfgTest, entorno: 'production', bloqueadoProduccion: true } });
  const r = fakeRes(); await h(req(base()), r);
  assert.equal(r.statusCode, 503); assert.equal(store.registros.length, 0);
});
test('handler: con Turnstile configurado, sin token no pasa (falla cerrado)', async () => {
  httpLib._registro.clear();
  const h = crearHandler({ store: crearMemoryStore(), config: { ...cfgTest, turnstileSecret: 's' }, fetchImpl: async () => { throw new Error('red'); } });
  const r = fakeRes(); await h(req(base({ turnstile_token: 'tok' })), r);
  assert.equal(r.statusCode, 400);
});
test('handler de evento: dryrun confirma sin guardar', async () => {
  httpLib._registro.clear();
  const h = crearHandlerEvento({ config: { ...cfgTest, modo: 'dryrun' } });
  const r = fakeRes(); await h(req({ tipo: 'reserva', ref: 'L-abcdefghijkl' }), r);
  assert.equal(r.statusCode, 200); assert.equal(r.body.guardado, false);
});

/* ───────── adaptador Airtable (contrato REST) ───────── */
test('Airtable: busca por email con fórmula escapada y crea con typecast; el token no sale en errores', async () => {
  const llamadas = [];
  const fetchImpl = async (u, o) => {
    llamadas.push({ u, o });
    if (o.method === 'GET') return new Response(JSON.stringify({ records: [] }), { status: 200 });
    if (o.method === 'POST') return new Response(JSON.stringify({ records: [{ id: 'recX', fields: JSON.parse(o.body).records[0].fields }] }), { status: 200 });
    return new Response(JSON.stringify({ error: { type: 'INVALID_PERMISSIONS' } }), { status: 403 });
  };
  const s = crearAirtableStore({ token: 'patSECRETO', baseId: 'appTEST0000000000', table: 'Leads', fetchImpl });
  await s.buscarPorEmail("o'brien@ejemplo.es");
  assert.match(decodeURIComponent(llamadas[0].u), /LOWER\(\{Email\}\)='o\\'brien@ejemplo\.es'/);
  assert.equal(llamadas[0].o.headers.Authorization, 'Bearer patSECRETO');
  const r = await s.crear({ Email: 'a@b.es' });
  assert.equal(r.id, 'recX');
  assert.equal(JSON.parse(llamadas[1].o.body).typecast, true);
  await assert.rejects(s.actualizar('recX', {}), (e) => !String(e.message).includes('patSECRETO') && e.status === 403);
  assert.equal(escFormula("a'b\\c"), "a\\'b\\\\c");
});

/* ───────── contrato con la base de PRUEBAS de Airtable ───────── */
test('contrato Airtable (datos reales de la base de pruebas): exporta solo lo no enviado', async () => {
  const { readFileSync } = await import('node:fs');
  const regs = JSON.parse(readFileSync(new URL('./fixtures/airtable-pruebas-registro.json', import.meta.url), 'utf8'));
  const sinPruebas = generarConversiones(regs);
  assert.equal(sinPruebas.filas.length, 0, 'los registros de prueba nunca se exportan por defecto');
  const r = generarConversiones(regs, { incluirPruebas: true });
  assert.deepEqual(r.filas.map((f) => f.nombre), ['DCODE - Reunion celebrada', 'DCODE - Cliente']);
  assert.ok(r.filas.every((f) => f.gclid === 'Cj0KCQjw_CONTRATO-0001'));
});

test('contrato: toda columna que escribe el código existe en el esquema de Airtable', async () => {
  const { EXISTENTES, NUEVAS } = require('../../marketing/google-ads/airtable/esquema-campos.cjs');
  const nombres = new Set([...EXISTENTES, ...NUEVAS].map((f) => f.name));
  const store = crearMemoryStore();
  await registrarLead({ body: base(), store, entorno: 'preview', now: fijo });
  await registrarLead({ body: base({ submission_id: 'sub-99999999', telefono: '600000000' }), store, entorno: 'preview', now: fijo });
  await registrarEvento({ body: { tipo: 'reserva', ref: store.registros[0].fields[F.ref] }, store, now: fijo });
  for (const k of Object.keys(store.registros[0].fields)) assert.ok(nombres.has(k), `columna sin definir: ${k}`);
});

/* ───────── panel de medición ───────── */
test('panel: separa CAC anuncios de CAC completo y cuenta el embudo por landing', () => {
  const P = require('../../marketing/google-ads/panel/calculo.js');
  const ads = P.parseCsv('Informe de grupos de anuncios\n"1 sept. 2026 - 30 sept. 2026"\nGrupo de anuncios;Impr.;Clics;Coste\nGA2 Seguimiento comercial;1.000;50;"125,00 €"\nTotal: cuenta;1.000;50;"125,00 €"\n');
  assert.equal(ads.length, 1);
  const leads = [
    { Fuente: 'google_ads', Entorno: 'production', Empresa: 'A', Landing: '/automatizacion-seguimiento-comercial', 'Etapa embudo': 'Cliente', 'Valor cliente': 2600, 'Mensualidad cliente': 280, 'Horas implantación reales': 40 },
    { Fuente: 'google_ads', Entorno: 'production', Empresa: 'B', Landing: '/automatizacion-seguimiento-comercial', 'Etapa embudo': 'Descartado', 'Horas implantación reales': 30 },
    { Fuente: 'google_ads', Entorno: 'production', Empresa: 'C', Landing: '/automatizacion-seguimiento-comercial', 'Etapa embudo': 'Nuevo' },
    { Fuente: 'formulario_web', Entorno: 'production', Empresa: 'D', Landing: '/automatizacion-seguimiento-comercial', 'Etapa embudo': 'Cliente' },
    { Fuente: 'google_ads', Entorno: 'preview', Empresa: 'E', Landing: '/automatizacion-seguimiento-comercial', 'Etapa embudo': 'Cliente' },
  ];
  const r = P.calcular(ads, leads, [], { costeHora: 20, horasTriaje: 0.25, horasReunion: 1.5, horasPropuesta: 2 });
  const t = r.total;
  assert.equal(t.clics, 50); assert.equal(t.coste, 125); assert.equal(t.cpc, 2.5); assert.equal(t.ctr, 0.05);
  assert.equal(t.leads, 3, 'solo google_ads de producción');
  assert.equal(t.clientes, 1); assert.equal(t.facturacion, 2600); assert.equal(t.mrr, 280);
  assert.equal(t.cacAnuncios, 125);
  // horas comerciales: 3 leads×0,25 + 1 reunión×1,5 + 1 propuesta×2 = 4,25 h → 85 €; prueba fallida 30 h → 600 €
  assert.equal(t.costeNoPublicitario, 685);
  assert.equal(t.cacCompleto, 810);
});

/* ───────── guarda en n8n (Generador de Propuestas) ───────── */
test('n8n · la guarda impide la propuesta automática para google_ads sin diagnóstico', async () => {
  const { readFileSync } = await import('node:fs');
  const codigo = readFileSync(new URL('../../marketing/google-ads/n8n/validar-lead-propuesta.v2.js', import.meta.url), 'utf8');
  const ejecutar = (leadFields) => {
    const nodos = {
      'Buscar Propuesta Existente por Lead': [{ json: {} }],
      'Buscar Lead por ID': [{ json: { id: 'recL', ...leadFields } }],
      'Consultar Supresiones (Propuestas)': [{ json: { id: 'recS', Activa: false } }],
      'Trigger - Lead Nuevo (Automatico)': [{ json: { leadRecordId: 'recL' } }],
    };
    const $ = (n) => ({ first: () => nodos[n][0], all: () => nodos[n] });
    // Mismo entorno que un nodo Code de n8n: $ y return al nivel superior.
    return new Function('$', codigo)($)[0].json;
  };
  const baseLead = { Prioridad: 'Alta', Email: 'x@ejemplo.es', Empresa: 'X' };
  const ads = ejecutar({ ...baseLead, Fuente: 'google_ads', 'Etapa embudo': 'Nuevo' });
  assert.equal(ads.pasaValidaciones, false);
  assert.match(ads.motivos.join(' '), /BORRADOR INTERNO/);
  assert.equal(ads.estadoPropuestaSiGoogleAds, 'Borrador interno (pendiente de diagnóstico)');
  assert.equal(ejecutar({ ...baseLead, Fuente: 'google_ads', 'Etapa embudo': 'Reunión celebrada' }).pasaValidaciones, true);
  assert.equal(ejecutar({ ...baseLead, Fuente: 'formulario_web' }).pasaValidaciones, true, 'el resto de fuentes no cambia');
  assert.equal(ejecutar({ ...baseLead, Fuente: { name: 'google_ads' } }).pasaValidaciones, false, 'formato de select v2.2');
});
