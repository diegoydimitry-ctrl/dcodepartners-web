'use strict';
/**
 * Almacén en memoria con la MISMA interfaz que el de Airtable.
 * Se usa en las pruebas y en el modo «dryrun» (Preview sin base de pruebas
 * configurada): se ejecuta toda la lógica, pero nada sale del proceso.
 */
const { F } = require('./schema');

function crearMemoryStore(inicial = []) {
  const registros = inicial.map((r) => ({ id: r.id, fields: { ...r.fields } }));
  let n = registros.length;
  const nuevoId = () => `recMEM${String(++n).padStart(11, '0')}`;
  const por = (campo, valor) => registros.filter((r) => String(r.fields[campo] || '').toLowerCase() === String(valor).toLowerCase());
  return {
    tipo: 'memoria',
    registros,
    async buscarPorEmail(email) { return por(F.email, email).slice(0, 2); },
    async buscarPorRef(ref) { return por(F.ref, ref).slice(0, 2); },
    async crear(fields) { const r = { id: nuevoId(), fields: { ...fields } }; registros.push(r); return r; },
    async actualizar(id, fields) {
      const r = registros.find((x) => x.id === id);
      if (!r) { const e = new Error('Airtable 404: NOT_FOUND'); e.status = 404; throw e; }
      Object.assign(r.fields, fields);
      return r;
    },
  };
}
module.exports = { crearMemoryStore };
