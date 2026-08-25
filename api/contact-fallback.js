const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Respaldo del formulario de contacto: solo se llama desde el navegador
 * cuando el envío principal falla, para que una solicitud legítima nunca
 * se pierda por un problema puntual del servicio principal. No sustituye
 * a ese servicio (no guarda el lead en ningún CRM ni lo analiza) — solo
 * garantiza que el equipo y el cliente reciben el aviso por email.
 */

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const requestLog = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  if (requestLog.size > 5000) requestLog.clear(); // salvaguarda anti fuga de memoria
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// El SDK de Resend no expone aquí un timeout propio configurable: sin este
// envoltorio, una llamada realmente colgada (fallo de red intermedio que
// nunca resuelve ni rechaza) bloquearía la función hasta el límite de la
// plataforma, sin poder reintentar ni devolver un error controlado — el
// mismo fallo real ya visto y corregido en el chatbot (ver
// REQUEST_TIMEOUT_MS en lib/providers.js), aplicado aquí sin tocar el
// SDK: Promise.race funciona igual sea cual sea la promesa que envuelve.
const PER_CALL_TIMEOUT_MS = 8_000;
function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Envío de email sin respuesta tras ${ms}ms`)), ms);
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (error) => { clearTimeout(timer); reject(error); }
    );
  });
}

// AUD-DCP 23/08/2026 (ronda 2): mismo problema que ya se corrigió en el
// chatbot (lib/providers.js) — un único intento sin reintento convertía
// cualquier fallo TRANSITORIO de Resend (el propio historial de incidentes
// de proveedores de este proyecto son justo eso: picos de 5xx puntuales)
// en un lead perdido de verdad, siendo esta precisamente la vía de
// respaldo que se supone que no debe perder ningún lead. Solo se aplica al
// envío interno (crítico); la confirmación al cliente sigue siendo de un
// único intento porque ya es "best effort" por diseño (ver más abajo).
// Presupuesto de tiempo (ver maxDuration exportado al final del archivo):
// hasta 3 intentos x 8s + ~2s de backoff = 26s en el peor caso para el
// envío crítico.
async function sendWithRetry(payload, { attempts = 3, delaysMs = [500, 1500] } = {}) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await withTimeout(resend.emails.send(payload), PER_CALL_TIMEOUT_MS);
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) await sleep(delaysMs[attempt] || delaysMs[delaysMs.length - 1]);
    }
  }
  throw lastError;
}

// AUD-DCP 23/08/2026 (ronda 2): este endpoint es público y no reenvía por
// CORS estricto — cualquiera puede saltarse el formulario (y su maxlength
// del navegador) y hacer POST directo. Antes no había NINGÚN límite de
// longitud en ningún campo: un mensaje de varios MB se habría interpolado
// entero en el HTML del email enviado a través de Resend (coste, abuso,
// y riesgo de que Resend rechace el envío por tamaño y se pierda el lead
// real). Los mismos límites que ya usa el formulario de contacto en el
// navegador (ver contacto.html), aplicados también aquí en servidor.
const MAX_FIELD_LENGTHS = { nombre: 120, empresa: 120, email: 200, telefono: 40, mensaje: 4000 };
// Validación básica de formato, no exhaustiva (RFC 5322 completo no aporta
// nada aquí): solo descarta valores que claramente no son un email antes
// de intentar enviar la confirmación a esa dirección.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// AUD-DCP 23/08/2026 (ronda 2): 'nombre' se usa tal cual dentro del
// `subject` del email interno (ver más abajo). escapeHtml() protege el
// CUERPO del email (HTML), pero no elimina \r\n — un salto de línea ahí
// es una inyección de cabeceras de email clásica (permite falsificar
// cabeceras SMTP adicionales, p. ej. un Bcc: propio, incluso si el
// proveedor no lo explota, es el tipo de dato que nunca debe llegar
// crudo a una cabecera). Se eliminan aquí, en el saneado común a todos
// los campos, no solo en 'nombre': ningún campo de este formulario tiene
// un uso legítimo para caracteres de control.
function stripControlChars(value) {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\r\n\t\x00-\x1F\x7F]/g, ' ').replace(/\s+/g, ' ').trim();
}

function truncateFields(fields) {
  const out = {};
  for (const [key, maxLen] of Object.entries(MAX_FIELD_LENGTHS)) {
    const value = fields[key];
    out[key] = typeof value === 'string' ? stripControlChars(value).slice(0, maxLen) : value;
  }
  return out;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido' });
  }

  const forwardedFor = req.headers['x-forwarded-for'];
  const ip =
    (typeof forwardedFor === 'string' && forwardedFor.split(',')[0].trim()) ||
    req.socket?.remoteAddress ||
    'unknown';

  if (isRateLimited(ip)) {
    return res.status(429).json({ success: false, error: 'Demasiadas solicitudes. Inténtalo de nuevo en un minuto.' });
  }

  const { turnstileToken } = req.body || {};
  const { nombre, empresa, email, telefono, mensaje } = truncateFields(req.body || {});

  // Validación mínima: campos realmente obligatorios en el formulario
  // público (contacto.html) y presencia de un token de Turnstile — no se
  // re-verifica contra Cloudflare porque, al ser una vía de respaldo, el
  // token ya pudo consumirse en el intento principal (los tokens de
  // Turnstile son de un solo uso). La comprobación real de humano/bot ya
  // la hizo el navegador al generar el token; aquí solo se exige que
  // exista, para descartar peticiones que se salten el formulario por
  // completo.
  if (!nombre || !email || !turnstileToken) {
    return res.status(400).json({ success: false, error: 'Faltan datos obligatorios.' });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ success: false, error: 'El email no tiene un formato válido.' });
  }

  // Los datos del formulario se insertan en HTML de email: sin escapar, un
  // campo (típicamente "mensaje") con `<`/`>`/`&` puede romper el layout
  // del email o inyectar marcado no deseado en el cliente de correo de
  // destino. No es XSS contra el sitio (el email se renderiza fuera de
  // dcodepartners.com), pero sí hay que sanear antes de interpolar.
  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  const safe = {
    nombre: escapeHtml(nombre),
    empresa: escapeHtml(empresa),
    email: escapeHtml(email),
    telefono: escapeHtml(telefono),
    mensaje: escapeHtml(mensaje),
  };

  // El aviso interno al equipo es lo único crítico para no perder el lead:
  // si falla, hay que decirlo. La confirmación al cliente es un extra —
  // si el equipo ya recibió el aviso pero la confirmación falla, seguimos
  // devolviendo éxito (el lead está a salvo) en vez de hacer que el
  // visitante reintente y duplique su propio aviso interno.
  try {
    await sendWithRetry({
      from: 'D-Code Partners <contact@dcodepartners.com>',
      to: ['dcodedepartment@gmail.com'],
      subject: `Nueva solicitud de ${safe.nombre} (vía respaldo)`,
      html: `
        <h2>Nueva solicitud desde la web (envío de respaldo)</h2>
        <p><strong>Nombre:</strong> ${safe.nombre}</p>
        <p><strong>Empresa:</strong> ${safe.empresa}</p>
        <p><strong>Email:</strong> ${safe.email}</p>
        <p><strong>Teléfono:</strong> ${safe.telefono}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${safe.mensaje}</p>
      `,
    });
  } catch (error) {
    console.error('[contact-fallback] Error enviando aviso interno al equipo (lead en riesgo de perderse), reintentos agotados:', error);
    return res.status(500).json({ success: false, error: error.message });
  }

  try {
    // Un único intento (sin retry): "best effort" a propósito, ver el
    // comentario junto al try del aviso interno más arriba.
    await withTimeout(resend.emails.send({
      from: 'D-Code Partners <contact@dcodepartners.com>',
      to: email,
      subject: 'Hemos recibido tu solicitud',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:auto;">
          <h2 style="color:#2b2b2b;">¡Gracias por contactar con D-Code Partners!</h2>
          <p>Hola <strong>${safe.nombre}</strong>,</p>
          <p>Hemos recibido correctamente tu solicitud y queremos agradecerte la confianza depositada en nosotros.</p>
          <p>Nuestro equipo revisará la información que nos has enviado y preparará la mejor forma de ayudarte a automatizar y optimizar tu negocio.</p>
          <p>En un plazo inferior a <strong>24 horas laborables</strong> nos pondremos en contacto contigo para conocer mejor tus necesidades y resolver cualquier duda.</p>
          <hr style="margin:30px 0;">
          <p>Un saludo,</p>
          <p><strong>Equipo de D-Code Partners</strong><br>Automatización e Inteligencia Artificial para Empresas</p>
        </div>
      `,
    }), PER_CALL_TIMEOUT_MS);
  } catch (error) {
    // El equipo YA tiene el lead (email interno enviado con éxito): esto
    // es un fallo de cortesía, no de negocio. Se registra pero no se
    // reporta como error al visitante.
    console.error('[contact-fallback] Aviso interno enviado OK, pero falló la confirmación al cliente:', error);
  }

  return res.status(200).json({ success: true });
};

// Presupuesto explícito de duración (mismo criterio que api/chat.js, ver
// AUD-DCP en lib/providers.js): sin esto, el límite real dependía
// implícitamente del plan/proyecto — arriesgado ahora que el envío
// crítico puede reintentar hasta 3 veces. Peor caso: 3 intentos x 8s +
// ~2s de backoff (crítico) + 1 intento x 8s (confirmación) = 34s, con
// margen bajo el límite de 60s del plan Hobby.
module.exports.config = { maxDuration: 45 };
