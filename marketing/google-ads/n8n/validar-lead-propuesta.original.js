// OJO: la forma de salida del nodo Airtable depende de su typeVersion.
// v2.1 devuelve los campos planos; v2.2 los anida bajo 'fields'.
// 'Buscar Lead por ID' y 'Buscar Propuesta Existente' son v2.1;
// 'Consultar Supresiones (Propuestas)' es v2.2.
function campo(rec, nombre) {
  const f = (rec && rec.fields) || rec || {};
  return f[nombre];
}
function normEmail(v) {
  return String(v == null ? '' : v).trim().toLowerCase();
}

const propuestaExistente = $('Buscar Propuesta Existente por Lead').first().json;
const lead = $('Buscar Lead por ID').first().json;

const prioridad = campo(lead, 'Prioridad') || '';
const email = campo(lead, 'Email') || '';
const telefono = campo(lead, 'Telefono') || '';
const empresa = campo(lead, 'Empresa') || '(sin nombre)';

// --- Lista de supresion. FAIL-SAFE: si no se puede consultar, no se genera. ---
let filas = [];
let supresionOk = false;
try {
  filas = $('Consultar Supresiones (Propuestas)').all().map(i => (i && i.json) || {});
  supresionOk = filas.length > 0 && !filas.some(f => f && f.error !== undefined);
} catch (e) {
  supresionOk = false;
}

let motivoSupresion = null;
if (supresionOk) {
  const e = normEmail(email);
  const dom = e.indexOf('@') === -1 ? '' : e.split('@').pop();
  for (const f of filas) {
    if (!f || !f.id || campo(f, 'Activa') !== true) continue;
    const alcance = String(campo(f, 'Alcance') || '').toLowerCase();
    if (alcance.indexOf('dominio') !== -1) {
      if (dom && normEmail(campo(f, 'Dominio')) === dom) { motivoSupresion = campo(f, 'Motivo') || 'supresion por dominio'; break; }
    } else if (e && normEmail(campo(f, 'Email normalizado')) === e) {
      motivoSupresion = campo(f, 'Motivo') || 'supresion'; break;
    }
  }
}

const prioridadOk = prioridad === 'Alta';
const contactoOk = !!(email || telefono);
const yaExisteId = (propuestaExistente && propuestaExistente.id) ? propuestaExistente.id : null;
const sinPropuestaPrevia = !yaExisteId;
const noSuprimido = supresionOk && !motivoSupresion;

const motivos = [];
if (!lead.id) motivos.push('No se ha encontrado el Lead por su ID (posible ID invalido o registro eliminado)');
if (!prioridadOk) motivos.push('Prioridad actual: "' + (prioridad || 'vacia') + '" (se requiere "Alta")');
if (!contactoOk) motivos.push('Sin Email ni Telefono registrados');
if (!sinPropuestaPrevia) motivos.push('Ya existe una propuesta previa para este Lead (registro ' + yaExisteId + ')');
if (!supresionOk) motivos.push('NO se ha podido consultar la lista de supresiones. Por regla de Direccion no se genera nada cuando no se puede comprobar.');
else if (motivoSupresion) motivos.push('CONTACTO SUPRIMIDO (' + motivoSupresion + '). No se genera propuesta para ' + email + ' con independencia de su estado en el CRM.');

return [{
  json: {
    leadRecordId: lead.id || $('Trigger - Lead Nuevo (Automatico)').first().json.leadRecordId,
    empresa,
    pasaValidaciones: !!lead.id && prioridadOk && contactoOk && sinPropuestaPrevia && noSuprimido,
    motivos
  }
}];