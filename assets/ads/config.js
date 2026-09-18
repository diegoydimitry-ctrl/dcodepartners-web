/*
 * Configuración PÚBLICA de las landings de Google Ads.
 * Aquí no hay (ni puede haber) ningún secreto: todo lo que hay en este
 * fichero lo ve cualquier visitante. Los valores null significan
 * «todavía no existe / no activado».
 */
window.DCODE_ADS_CONFIG = {
  // Dominios donde se cargan CookieYes y las etiquetas de Google.
  produccionHosts: ['dcodepartners.com', 'www.dcodepartners.com'],

  // ID de la etiqueta de Google Ads (AW-XXXXXXXXXX). null = cuenta no creada.
  googleAdsId: null,

  // Conversión PRINCIPAL de Google Ads. Solo el formulario enviado.
  // Formato: 'AW-XXXXXXXXXX/etiqueta'. null = sin conversión configurada.
  conversionFormulario: null,

  // Microconversiones: se registran como eventos, NUNCA como conversión
  // principal. Si algún día se importan en Google Ads, como SECUNDARIAS.
  eventosSecundarios: ['demo_start', 'demo_25', 'demo_50', 'demo_90', 'cta_diagnostico', 'cta_caso', 'reserva', 'whatsapp'],

  // Reserva del diagnóstico: el mismo evento de Cal.com que usa /contacto.
  calLink: 'dimitry-y-diego-y9tbqp/30min',
  calNamespace: 'diagnostico-ads',

  // WhatsApp: no existe todavía. null = no se muestra ningún botón.
  whatsapp: null,

  // Turnstile: solo se pinta en producción (la clave de sitio está ligada
  // al dominio). En Preview el servidor no lo exige.
  turnstileSiteKey: '0x4AAAAAAD0dueh5OBC9Zdkm',

  // Días que se conserva el origen del clic (solo con consentimiento).
  diasAtribucion: 90,

  // Versión del texto de privacidad (debe coincidir con el servidor).
  consentVersion: 'ads-landing-2026-09-18'
};
