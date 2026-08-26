/**
 * Daddy Pan — configuración central del prototipo.
 *
 * Este sitio es una PLANTILLA VISUAL. Nada de lo de aquí abajo llama a un
 * backend real: son placeholders pensados para que, cuando el cliente
 * apruebe el diseño, conectar cada pieza sea cuestión de rellenar un valor
 * y tocar una sola función (ver assets/js/chatbot.js → submitBooking).
 */
window.DADDY_PAN_CONFIG = {
  // --- Identidad / contenido básico (placeholder, editar con datos reales) ---
  NAME: 'Daddy Pan',
  TAGLINE: 'Buena mesa, buena compañía, buena noche.',
  CITY: 'Madrid',
  ADDRESS: 'Calle de la Reina, 12 · 28004 Madrid',
  PHONE_DISPLAY: '+34 910 000 000',
  PHONE_TEL: '+34910000000',
  EMAIL: 'reservas@daddypan.es',
  HOURS: [
    { days: 'Lunes a jueves', time: '13:00–16:30 y 20:00–00:00' },
    { days: 'Viernes y sábado', time: '13:00–16:30 y 20:00–01:30' },
    { days: 'Domingo', time: '13:00–17:00' },
  ],
  RATING_VALUE: 4.8,
  RATING_COUNT: 128,

  // --- Integraciones pendientes de conectar ---
  // URL del PDF o página con la carta completa.
  MENU_URL: '#',
  // URL pública de la ficha de Google Business (reseñas).
  GOOGLE_REVIEW_URL: '#',
  // URL de Google Maps para "Cómo llegar" (y, más adelante, embed real).
  GOOGLE_MAPS_URL: '#',
  // Enlace directo de WhatsApp (wa.me/...) como vía alternativa de reserva.
  WHATSAPP_URL: '#',
  // Endpoint que recibirá las reservas (Google Apps Script / n8n / Sheets API).
  // Mientras esté vacío, el chatbot simula el envío en el propio navegador.
  GOOGLE_SHEETS_ENDPOINT: '',
};
