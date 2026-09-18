'use strict';
/**
 * POST /api/ads-lead — formulario de las landings de Google Ads.
 *
 * Por defecto funciona en modo «dryrun»: ejecuta toda la lógica (validación,
 * origen, deduplicación, ficha) contra un almacén en memoria y NO guarda
 * nada. Para escribir de verdad hace falta ADS_LEAD_MODE=airtable y una base
 * configurada por entorno. En Production, además, ADS_LEAD_PRODUCTION_ENABLED=1.
 * Ver marketing/google-ads/ACTIVACION.md.
 */
const { leerConfig } = require('./_lib/ads/config');
const { registrarLead } = require('./_lib/ads/service');
const { crearAirtableStore } = require('./_lib/ads/store-airtable');
const { crearMemoryStore } = require('./_lib/ads/store-memory');
const { leerWeb } = require('./_lib/ads/evidence');
const http = require('./_lib/ads/http');

function crearHandler(deps = {}) {
  return async function handler(req, res) {
    http.cabecerasSeguras(res);
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'Método no permitido' }); }
    const cfg = deps.config || leerConfig();
    if (cfg.bloqueadoProduccion) {
      return res.status(503).json({ ok: false, error: 'El formulario todavía no está activo. Escríbenos a dcodedepartment@gmail.com.' });
    }
    if (cfg.problemas.length) {
      console.error('[ads-lead] configuración no válida:', cfg.problemas.join(' | '));
      return res.status(503).json({ ok: false, error: 'Servicio no disponible. Escríbenos a dcodedepartment@gmail.com.' });
    }
    if (!(deps.saltarOrigen || http.mismoOrigen(req))) return res.status(403).json({ ok: false, error: 'Origen no permitido' });
    const ip = http.ipDe(req);
    if (http.limitado(ip)) return res.status(429).json({ ok: false, error: 'Demasiados envíos seguidos. Prueba en un minuto.' });
    const { body, error } = http.cuerpoJson(req);
    if (error) return res.status(error).json({ ok: false, error: 'Petición no válida' });
    if (!(await http.verificarTurnstile(cfg.turnstileSecret, body.turnstile_token, ip, deps.fetchImpl))) {
      return res.status(400).json({ ok: false, errors: { turnstile: 'No hemos podido verificar que no eres un robot. Recarga la página.' } });
    }

    const store = deps.store || (cfg.modo === 'airtable'
      ? crearAirtableStore({ ...cfg.airtable, fetchImpl: deps.fetchImpl })
      : crearMemoryStore());
    try {
      const r = await registrarLead({
        body, store, entorno: cfg.entorno,
        leerWeb: cfg.leerWeb ? (deps.leerWeb || leerWeb) : null,
      });
      if (!r.ok) return res.status(r.status).json({ ok: false, errors: r.errors });
      // Al navegador solo vuelve la referencia opaca; nunca la ficha interna.
      return res.status(r.status).json({ ok: true, ref: r.ref, modo: cfg.modo, duplicado: Boolean(r.duplicate) });
    } catch (e) {
      console.error('[ads-lead] fallo al guardar:', e && e.message);
      return res.status(502).json({ ok: false, error: 'No hemos podido registrar tu solicitud. Escríbenos a dcodedepartment@gmail.com.' });
    }
  };
}

module.exports = crearHandler();
module.exports.crearHandler = crearHandler;
