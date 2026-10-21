# Daddy Pan — plantilla de demostración

Prototipo visual de la web de un bar/restaurante (Daddy Pan), pensado para
**presentar el diseño al cliente**, no como producto final. Sitio estático
independiente del resto de `dcodepartners-web`: vive en `daddy-pan/` y no
toca ninguna página del sitio corporativo.

## Ver en local

```bash
cd daddy-pan
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Qué incluye

- Home completa: hero, carta (con pestañas), galería, reseñas de Google,
  ubicación y CTA de reserva.
- Chatbot flotante con un flujo de reserva **simulado** (nombre → teléfono →
  fecha → hora → personas → confirmación), sin backend real.
- Diseño responsive de móvil a escritorio.

## Qué falta por conectar (a propósito)

Todo lo que depende de datos o credenciales reales del negocio queda como
placeholder en **`assets/js/config.js`**:

| Constante | Para qué sirve |
|---|---|
| `MENU_URL` | PDF o página con la carta completa |
| `GOOGLE_REVIEW_URL` | Ficha de Google Business (reseñas) |
| `GOOGLE_MAPS_URL` | "Cómo llegar" y, más adelante, el mapa embebido real |
| `GOOGLE_SHEETS_ENDPOINT` | Recepción real de las reservas del chatbot |

El resumen de reserva del chatbot llama a `submitBooking()` en
`assets/js/chatbot.js`: hoy simula el envío con una espera artificial y una
referencia falsa. Conectarlo a un backend real (Google Sheets vía Apps
Script, n8n, etc.) es sustituir esa función por un `fetch()` a
`GOOGLE_SHEETS_ENDPOINT` — el resto del chatbot no necesita cambios.

Las fotografías son marcadores de posición en CSS (no hay imágenes reales
todavía) — se sustituyen directamente en `index.html` / `style.css` cuando
haya sesión de fotos.
