'use strict';
/**
 * POST /api/ads-lead-event — eventos posteriores al formulario.
 * Hoy solo «reserva»: Cal.com confirma una reserva en la página de gracias
 * y aquí se anota la reunión programada en el lead (por su referencia).
 */
const { leerConfig } = require('./_lib/ads/config');
const { registrarEvento } = require('./_lib/ads/service');
const { crearAirtableStore } = require('./_lib/ads/store-airtable');
const { crearMemoryStore } = require('./_lib/ads/store-memory');
const http = require('./_lib/ads/http');

function crearHandler(deps = {}) {
  return async function handler(req, res) {
    http.cabecerasSeguras(res);
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false }); }
    const cfg = deps.config || leerConfig();
    if (cfg.bloqueadoProduccion || cfg.problemas.length) return res.status(503).json({ ok: false });
    if (!(deps.saltarOrigen || http.mismoOrigen(req))) return res.status(403).json({ ok: false });
    if (http.limitado(http.ipDe(req))) return res.status(429).json({ ok: false });
    const { body, error } = http.cuerpoJson(req, 2048);
    if (error) return res.status(error).json({ ok: false });
    if (cfg.modo !== 'airtable' && !deps.store) {
      // dryrun: no hay dónde anotar; se confirma sin guardar.
      return res.status(200).json({ ok: true, modo: 'dryrun', guardado: false });
    }
    const store = deps.store || crearAirtableStore({ ...cfg.airtable, fetchImpl: deps.fetchImpl });
    try {
      const r = await registrarEvento({ body, store });
      return res.status(r.status).json(r.ok ? { ok: true, modo: cfg.modo } : { ok: false, errors: r.errors });
    } catch (e) {
      console.error('[ads-lead-event] fallo:', e && e.message);
      return res.status(502).json({ ok: false });
    }
  };
}

module.exports = crearHandler();
module.exports.crearHandler = crearHandler;
