/* ==========================================================================
   EMAILS DEL FORMULARIO DE CONTACTO — una sola fuente de verdad
   --------------------------------------------------------------------------
   - Al cliente: humano, sin etiquetas internas ([DCP], [CLIENT]…), sin IDs,
     sin nombres de sistemas. Lo firman personas.
   - Interno (dcodedepartment@gmail.com): «NUEVA SOLICITUD DESDE LA WEB»,
     reconocible de un vistazo y separado de monitorización, errores, etc.
   Lo usa api/contact-fallback.js. El workflow de n8n (Cowork 3) debe enviar
   exactamente estos textos: ver docs/HANDOFF-FORMULARIO-COWORK3.md.
   Todo lo que viene del formulario se escapa antes de entrar en el HTML.
   ========================================================================== */
'use strict';

const esc = (v, max = 2000) => String(v == null ? '' : v).slice(0, max)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const primerNombre = (n) => String(n || '').trim().split(/\s+/)[0] || '';
const FUENTE = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

/* ------------------------------------------------------------- cliente */
const TXT = {
  es: {
    asunto: (n) => `Gracias por escribirnos${n ? ', ' + n : ''}`,
    previa: 'Tu mensaje ya está con nosotros. Te escribimos cuanto antes.',
    saludo: (n) => `Hola${n ? ', ' + n : ''}:`,
    p: [
      'Gracias por escribirnos. Tu mensaje ya está con nosotros y lo vamos a leer con calma.',
      'Antes de proponerte nada, queremos entender bien tu caso: cómo trabajáis hoy, dónde se os va el tiempo y qué te gustaría que funcionara solo. En cuanto lo hayamos revisado, te escribiremos —o te llamaremos, si nos has dejado teléfono— para hablarlo contigo.',
      'Si mientras tanto quieres añadir algo (un documento, una captura, un detalle que se te haya quedado fuera), responde a este correo: lo recibimos nosotros directamente.',
    ],
    cierre: 'Un saludo,',
    firma: 'Diego Siñeriz y Dimitry Sosenko',
  },
  en: {
    asunto: (n) => `Thanks for writing to us${n ? ', ' + n : ''}`,
    previa: 'Your message is with us. We will write back as soon as we can.',
    saludo: (n) => `Hi${n ? ' ' + n : ''},`,
    p: [
      'Thank you for getting in touch. Your message is with us and we will read it carefully.',
      'Before proposing anything, we want to understand your case properly: how you work today, where your time goes and what you would like to run on its own. As soon as we have reviewed it, we will write to you — or call you, if you left a phone number — to talk it through.',
      'If you want to add anything in the meantime (a document, a screenshot, a detail you left out), just reply to this email: it comes straight to us.',
    ],
    cierre: 'Best regards,',
    firma: 'Diego Siñeriz and Dimitry Sosenko',
  },
};

function emailCliente({ nombre, idioma }) {
  const t = TXT[idioma === 'en' ? 'en' : 'es'];
  const n = primerNombre(nombre);
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f4f4f2;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(t.previa)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f2;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;">
<tr><td style="padding:36px 36px 8px;font-family:${FUENTE};">
<p style="margin:0 0 28px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#111;"><span style="display:inline-block;width:9px;height:9px;background:#111;border-radius:2px;margin-right:4px;"></span><span style="display:inline-block;width:9px;height:9px;background:#2f5fe8;border-radius:2px;margin-right:10px;"></span>D-Code Partners</p>
<p style="margin:0 0 18px;font-size:17px;line-height:1.55;color:#111;">${esc(t.saludo(n))}</p>
${t.p.map((x) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#333;">${esc(x)}</p>`).join('')}
<p style="margin:26px 0 4px;font-size:16px;color:#333;">${esc(t.cierre)}</p>
<p style="margin:0 0 2px;font-size:16px;font-weight:600;color:#111;">${esc(t.firma)}</p>
<p style="margin:0 0 30px;font-size:14px;color:#6b6b6b;">D-Code Partners · Madrid · <a href="https://dcodepartners.com" style="color:#111;">dcodepartners.com</a></p>
</td></tr></table></td></tr></table></body></html>`;
  const text = [t.saludo(n), '', ...t.p.flatMap((x) => [x, '']), t.cierre, t.firma, 'D-Code Partners · Madrid · https://dcodepartners.com'].join('\n');
  return { asunto: t.asunto(n), html, text };
}

/* ------------------------------------------------------------- interno */
function fechaMadrid(d = new Date()) {
  return new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', dateStyle: 'full', timeStyle: 'short' }).format(d);
}

function emailInterno({ nombre, empresa, email, telefono, mensaje, idioma, pagina, via, extra = [] }) {
  const fecha = fechaMadrid();
  const quien = [nombre, empresa && `(${empresa})`].filter(Boolean).join(' ');
  const asunto = `NUEVA SOLICITUD DESDE LA WEB · ${String(quien).slice(0, 120)}`;
  const tel = String(telefono || '').replace(/[^\d+]/g, '');
  const filas = [
    ['Nombre', esc(nombre, 120)],
    ['Empresa', esc(empresa, 120) || '—'],
    ['Email', email ? `<a href="mailto:${esc(email, 160)}" style="color:#111;">${esc(email, 160)}</a>` : '—'],
    ['Teléfono', telefono ? `<a href="tel:${esc(tel, 30)}" style="color:#111;">${esc(telefono, 40)}</a>` : '—'],
    ['Fecha', esc(fecha)],
    ['Origen', `Web${pagina ? ' · ' + esc(pagina, 80) : ''}${idioma ? ' · ' + esc(String(idioma).toUpperCase(), 4) : ''}`],
    ...extra.map(([k, v]) => [esc(k, 60), esc(v, 400)]),
  ];
  const aviso = via === 'respaldo'
    ? '<tr><td style="padding:14px 28px;background:#fff4d6;font-family:' + FUENTE + ';font-size:14px;color:#5a4300;"><strong>Llegó por la vía de respaldo</strong> (el flujo principal no respondió): este lead <strong>no está en Airtable</strong>. Hay que darlo de alta a mano.</td></tr>'
    : '';
  const respuesta = email ? `mailto:${esc(email, 160)}?subject=${encodeURIComponent('Tu mensaje a D-Code Partners')}` : '';
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#eeeeec;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eeeeec;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:10px;overflow:hidden;">
<tr><td style="padding:22px 28px;background:#0a0a0a;font-family:${FUENTE};">
<p style="margin:0 0 6px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#8fb0ff;">● Nueva solicitud desde la web</p>
<p style="margin:0;font-size:24px;font-weight:600;color:#ffffff;line-height:1.2;">Ha entrado un lead nuevo: ${esc(quien, 160)}</p>
</td></tr>${aviso}
<tr><td style="padding:22px 28px 6px;font-family:${FUENTE};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${filas.map(([k, v]) => `<tr><td style="padding:9px 0;border-bottom:1px solid #ececec;width:120px;font-size:13px;color:#6b6b6b;vertical-align:top;">${k}</td><td style="padding:9px 0;border-bottom:1px solid #ececec;font-size:15px;color:#111;">${v}</td></tr>`).join('')}
</table>
<p style="margin:22px 0 8px;font-size:13px;color:#6b6b6b;">Mensaje</p>
<div style="padding:16px 18px;background:#f6f6f4;border-radius:8px;font-size:15px;line-height:1.6;color:#111;white-space:pre-wrap;">${esc(mensaje, 5000) || '—'}</div>
${respuesta ? `<p style="margin:24px 0 26px;"><a href="${respuesta}" style="display:inline-block;padding:12px 20px;background:#111;color:#fff;border-radius:999px;text-decoration:none;font-size:15px;">Responder a ${esc(primerNombre(nombre) || 'este lead', 60)}</a>${tel ? ` &nbsp; <a href="tel:${esc(tel, 30)}" style="display:inline-block;padding:11px 19px;border:1px solid #111;color:#111;border-radius:999px;text-decoration:none;font-size:15px;">Llamar</a>` : ''}</p>` : ''}
</td></tr></table></td></tr></table></body></html>`;
  const text = ['NUEVA SOLICITUD DESDE LA WEB', `Ha entrado un lead nuevo: ${quien}`, '', ...filas.map(([k, v]) => `${k}: ${String(v).replace(/<[^>]+>/g, '')}`), '', 'Mensaje:', String(mensaje || '—'), via === 'respaldo' ? '\nLlegó por la vía de respaldo: no está en Airtable.' : ''].join('\n');
  return { asunto, html, text };
}

module.exports = { emailCliente, emailInterno, esc, fechaMadrid };
