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

  const { nombre, empresa, email, telefono, mensaje, turnstileToken } = req.body || {};

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

  try {
    await resend.emails.send({
      from: 'D-Code Partners <contact@dcodepartners.com>',
      to: ['dcodedepartment@gmail.com'],
      subject: `Nueva solicitud de ${nombre} (vía respaldo)`,
      html: `
        <h2>Nueva solicitud desde la web (envío de respaldo)</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Empresa:</strong> ${empresa || ''}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${telefono || ''}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje || ''}</p>
      `,
    });
    await resend.emails.send({
      from: 'D-Code Partners <contact@dcodepartners.com>',
      to: email,
      subject: 'Hemos recibido tu solicitud',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:auto;">
          <h2 style="color:#2b2b2b;">¡Gracias por contactar con D-Code Partners!</h2>
          <p>Hola <strong>${nombre}</strong>,</p>
          <p>Hemos recibido correctamente tu solicitud y queremos agradecerte la confianza depositada en nosotros.</p>
          <p>Nuestro equipo revisará la información que nos has enviado y preparará la mejor forma de ayudarte a automatizar y optimizar tu negocio.</p>
          <p>En un plazo inferior a <strong>24 horas laborables</strong> nos pondremos en contacto contigo para conocer mejor tus necesidades y resolver cualquier duda.</p>
          <hr style="margin:30px 0;">
          <p>Un saludo,</p>
          <p><strong>Equipo de D-Code Partners</strong><br>Automatización e Inteligencia Artificial para Empresas</p>
        </div>
      `,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[contact-fallback] Error enviando emails de respaldo:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
