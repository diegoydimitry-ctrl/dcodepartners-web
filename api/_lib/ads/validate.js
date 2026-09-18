'use strict';
/**
 * Validación y normalización del formulario de las landings.
 * Principio: guardar SOLO lo necesario. Todo campo que no esté aquí se
 * ignora aunque el navegador lo envíe.
 */
const { TAMANOS, SECTORES, CONSENT_VERSION } = require('./schema');

const EMAIL = /^[^\s@<>()[\]\\,;:"]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
const MIN_FILL_MS = 2500; // menos que esto no lo rellena una persona

function text(v, max) {
  if (typeof v !== 'string') return '';
  return v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim()
    .slice(0, max);
}

function normalizarWeb(v) {
  let s = text(v, 200).replace(/\s/g, '');
  if (!s) return '';
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  try {
    const u = new URL(s);
    if (!/^https?:$/.test(u.protocol)) return '';
    if (!u.hostname.includes('.') || u.username || u.password) return '';
    return `${u.protocol}//${u.hostname.toLowerCase()}${u.pathname === '/' ? '' : u.pathname}`;
  } catch {
    return '';
  }
}

function normalizarTelefono(v) {
  const s = text(v, 30);
  if (!s) return '';
  const digits = s.replace(/[^\d+]/g, '');
  const soloDigitos = digits.replace(/\D/g, '');
  if (soloDigitos.length < 9 || soloDigitos.length > 15) return null; // inválido
  return digits;
}

/**
 * @returns {{ok:boolean, errors:Object<string,string>, spam:boolean, lead?:object}}
 */
function validateLead(body = {}) {
  const errors = {};
  let spam = false;

  // Trampas anti-bot: campo invisible relleno o envío demasiado rápido.
  if (text(body.website_confirm, 200)) spam = true;
  const fillMs = Number(body.fill_ms);
  if (Number.isFinite(fillMs) && fillMs >= 0 && fillMs < MIN_FILL_MS) spam = true;

  const nombre = text(body.nombre, 100);
  const empresa = text(body.empresa, 120);
  const email = text(body.email, 254).toLowerCase();
  const web = normalizarWeb(body.web);
  const telefono = normalizarTelefono(body.telefono);
  const sectorForm = text(body.sector, 60);
  const tamano = text(body.tamano, 20);
  const necesidad = text(body.necesidad, 1500);
  const privacidad = body.privacidad === true || body.privacidad === 'true' || body.privacidad === 'on';

  if (nombre.length < 2) errors.nombre = 'Escribe tu nombre.';
  if (empresa.length < 2) errors.empresa = 'Escribe el nombre de la empresa.';
  if (!EMAIL.test(email)) errors.email = 'Revisa el email.';
  if (body.web && text(body.web, 200) && !web) errors.web = 'Revisa la web (ej. tuempresa.com).';
  if (telefono === null) errors.telefono = 'Revisa el teléfono o déjalo vacío.';
  if (!Object.prototype.hasOwnProperty.call(SECTORES, sectorForm)) errors.sector = 'Elige un sector.';
  if (!TAMANOS.includes(tamano)) errors.tamano = 'Elige el tamaño de la empresa.';
  if (necesidad.length < 10) errors.necesidad = 'Cuéntanos en una frase qué proceso os quita tiempo.';
  if (!privacidad) errors.privacidad = 'Necesitamos tu aceptación de la política de privacidad.';

  const ok = Object.keys(errors).length === 0;
  if (!ok) return { ok, errors, spam };

  return {
    ok,
    errors,
    spam,
    lead: {
      nombre,
      empresa,
      email,
      web,
      telefono: telefono || '',
      sectorForm,
      sector: SECTORES[sectorForm],
      tamano,
      necesidad,
      privacidad: true,
      consentVersion: CONSENT_VERSION,
      // id de envío generado por el navegador: evita dobles registros por
      // doble clic o reintento de red.
      submissionId: /^[A-Za-z0-9-]{8,64}$/.test(String(body.submission_id || '')) ? String(body.submission_id) : '',
      consentAnuncios: ['granted', 'denied', 'sin_banner'].includes(body.ad_consent) ? body.ad_consent : 'sin_banner',
    },
  };
}

module.exports = { validateLead, normalizarWeb, normalizarTelefono, EMAIL, MIN_FILL_MS };
