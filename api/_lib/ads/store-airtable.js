'use strict';
/**
 * Adaptador mínimo de la API REST de Airtable (sin dependencias).
 * El token vive SOLO en variables de entorno del servidor; nunca llega al
 * navegador ni al repositorio.
 */
const { F } = require('./schema');

function escFormula(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function crearAirtableStore({ token, baseId, table, fetchImpl = fetch, apiUrl = 'https://api.airtable.com/v0' }) {
  if (!token || !baseId || !table) throw new Error('Configuración de Airtable incompleta');
  const url = `${apiUrl}/${baseId}/${encodeURIComponent(table)}`;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  async function llamar(u, opts) {
    const res = await fetchImpl(u, { ...opts, headers });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const tipo = (body && body.error && (body.error.type || body.error)) || 'error';
      const err = new Error(`Airtable ${res.status}: ${typeof tipo === 'string' ? tipo : 'error'}`);
      err.status = res.status;
      throw err;
    }
    return body;
  }

  async function buscarPor(campo, valor) {
    const formula = `LOWER({${campo}})='${escFormula(String(valor).toLowerCase())}'`;
    const q = `${url}?maxRecords=2&filterByFormula=${encodeURIComponent(formula)}`;
    const body = await llamar(q, { method: 'GET' });
    return body.records || [];
  }

  return {
    tipo: 'airtable',
    buscarPorEmail: (email) => buscarPor(F.email, email),
    buscarPorRef: (ref) => buscarPor(F.ref, ref),
    async crear(fields) {
      // typecast SOLO para selects de nuestras columnas nuevas; «Sector» y
      // «Estado» usan siempre opciones que ya existen (ver schema.js).
      const body = await llamar(url, { method: 'POST', body: JSON.stringify({ records: [{ fields }], typecast: true }) });
      return body.records[0];
    },
    async actualizar(id, fields) {
      const body = await llamar(url, { method: 'PATCH', body: JSON.stringify({ records: [{ id, fields }], typecast: true }) });
      return body.records[0];
    },
  };
}

module.exports = { crearAirtableStore, escFormula };
