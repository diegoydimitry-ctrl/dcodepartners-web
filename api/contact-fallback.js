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

/**
 * Escapa texto antes de incrustarlo en el HTML de un correo.
 *
 * Este endpoint es público y no puede verificar el token de Turnstile (ver
 * más abajo), así que TODO lo que llega aquí es texto no confiable. Sin
 * escapar, un valor como `<a href="...">` en el campo "nombre" se
 * renderizaba como enlace real dentro de un correo enviado desde un dominio
 * verificado de D-Code. AUD-20260830.
 */
function escaparHtml(valor) {
  return String(valor == null ? '' : valor)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Texto para una cabecera de correo (asunto). No lleva escapado HTML —una
 * cabecera no es HTML y escaparla mostraría "&amp;" literal—, pero sí se le
 * quitan los saltos de línea, que en una cabecera son un vector de inyección.
 */
function textoPlanoSeguro(valor, maxLongitud) {
  return String(valor == null ? '' : valor)
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, maxLongitud);
}

/** Formato de email mínimamente válido, para no usar basura como replyTo. */
function esEmailValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor == null ? '' : valor).trim());
}

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

  const emailValido = esEmailValido(email);

  try {
    // AUD-20260830 — SOLO se envía el aviso INTERNO, a una dirección fija.
    //
    // Antes se enviaba también una confirmación a `email`, es decir, a una
    // dirección que elige quien llama a este endpoint. Como aquí no se puede
    // verificar el token de Turnstile (ver arriba), eso convertía a
    // /api/contact-fallback en un RELAY DE CORREO ABIERTO: bastaba un POST
    // con `turnstileToken` no vacío para que dcodepartners.com —un dominio
    // verificado— enviase un correo a cualquier destinatario, con contenido
    // parcialmente controlado por el atacante. Riesgo real de phishing y de
    // quemar la reputación del dominio.
    //
    // El destinatario fijo elimina el vector por completo: lo peor que puede
    // conseguir un abusador ahora es llenar nuestro propio buzón.
    //
    // Qué pierde un visitante legítimo cuyo envío principal falló: el correo
    // de "hemos recibido tu solicitud". Sigue viendo la confirmación en la
    // propia página, y el equipo recibe el aviso con sus datos, así que la
    // solicitud NO se pierde — que es lo único que este respaldo prometía.
    //
    // Para recuperar la confirmación al visitante de forma segura hay que
    // verificar el token contra Cloudflare aceptando el error
    // `timeout-or-duplicate` (token real ya consumido por el intento
    // principal) y rechazando `invalid-input-response` (token inventado).
    // Requiere TURNSTILE_SECRET_KEY en el entorno del sitio; hoy ese secreto
    // vive en n8n, no aquí, así que no se hace desde este endpoint.
    await resend.emails.send({
      from: 'D-Code Partners <contact@dcodepartners.com>',
      to: ['dcodedepartment@gmail.com'],
      // El asunto NO es HTML: escaparlo aquí mostraría "&amp;" literal al
      // leer el correo. Lo que sí hay que quitar son los saltos de línea,
      // que en una cabecera de correo son un vector de inyección.
      replyTo: emailValido ? email : undefined,
      subject: `Nueva solicitud de ${textoPlanoSeguro(nombre, 120)} (vía respaldo)`,
      html: `
        <h2>Nueva solicitud desde la web (envío de respaldo)</h2>
        <p><strong>Nombre:</strong> ${escaparHtml(nombre)}</p>
        <p><strong>Empresa:</strong> ${escaparHtml(empresa)}</p>
        <p><strong>Email:</strong> ${escaparHtml(email)}</p>
        <p><strong>Teléfono:</strong> ${escaparHtml(telefono)}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${escaparHtml(mensaje)}</p>
        <hr>
        <p style="font-size:12px;color:#888;">Llegó por la vía de respaldo, así que este lead
        <strong>no está en Airtable ni ha pasado por el análisis de Lead IA 360</strong>.
        Hay que darlo de alta a mano. Los datos de arriba son texto sin verificar
        enviado desde el formulario público.</p>
      `,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[contact-fallback] Error enviando emails de respaldo:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
