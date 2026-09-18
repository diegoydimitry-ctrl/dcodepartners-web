'use strict';
/** Utilidades HTTP compartidas por /api/ads-lead y /api/ads-lead-event. */

const VENTANA_MS = 60_000;
const MAX_POR_VENTANA = 8;
const registro = new Map();

function ipDe(req) {
  const xff = req.headers['x-forwarded-for'];
  return (typeof xff === 'string' && xff.split(',')[0].trim()) || (req.socket && req.socket.remoteAddress) || 'desconocida';
}

function limitado(ip, ahora = Date.now()) {
  const t = (registro.get(ip) || []).filter((x) => ahora - x < VENTANA_MS);
  t.push(ahora);
  registro.set(ip, t);
  if (registro.size > 5000) registro.clear();
  return t.length > MAX_POR_VENTANA;
}

/** Solo se aceptan peticiones del mismo sitio que sirve la landing. */
function mismoOrigen(req) {
  const origin = req.headers.origin;
  if (!origin) return false;
  try {
    const o = new URL(origin);
    const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
    return o.host === host;
  } catch { return false; }
}

function cabecerasSeguras(res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Robots-Tag', 'noindex');
}

function cuerpoJson(req, maxBytes = 16 * 1024) {
  const ct = String(req.headers['content-type'] || '');
  if (!ct.includes('application/json')) return { error: 415 };
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch { return { error: 400 }; } }
  if (!b || typeof b !== 'object' || Array.isArray(b)) return { error: 400 };
  if (JSON.stringify(b).length > maxBytes) return { error: 413 };
  return { body: b };
}

async function verificarTurnstile(secret, token, ip, fetchImpl = fetch) {
  if (!secret) return true; // no configurado: no se exige (Preview)
  if (!token || typeof token !== 'string' || token.length > 2048) return false;
  try {
    const res = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }).toString(),
    });
    const j = await res.json();
    return j && j.success === true;
  } catch { return false; } // falla cerrado
}

module.exports = { ipDe, limitado, mismoOrigen, cabecerasSeguras, cuerpoJson, verificarTurnstile, _registro: registro };
