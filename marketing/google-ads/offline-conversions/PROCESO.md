# Conversiones offline → Google Ads (proceso manual inicial)

**No conectado.** Esto es lo que se hará cuando exista la cuenta.

## Conversiones que hay que crear en Google Ads (tipo «Importar → Otras fuentes → Clics»)

| Nombre EXACTO (lo usa el exportador) | Categoría | Principal / secundaria | Valor |
|---|---|---|---|
| `DCODE - Lead cualificado` | Cliente potencial cualificado | Secundaria al inicio | Sin valor |
| `DCODE - Reunion celebrada` | Cliente potencial convertido | Secundaria → principal cuando haya volumen | Sin valor |
| `DCODE - Cliente` | Compra | Secundaria (observación) | Valor = «Valor cliente» (EUR) |

La conversión PRINCIPAL al empezar es el formulario (etiqueta web). Cambiar la principal a «Reunión celebrada» es una decisión posterior (cuando haya ~30 al mes; con menos, el Smart Bidding no aprende — ver estudio, sección 2).

## Mapeo

| Columna Google Ads | Origen (Airtable Leads) |
|---|---|
| Google Click ID | `GCLID` (primer clic; nunca se sobrescribe) |
| Conversion Name | según la etapa |
| Conversion Time | `Fecha cualificado` / `Reunión celebrada` / `Fecha cliente`, en hora de Madrid (`Parameters:TimeZone=Europe/Madrid`) |
| Conversion Value | `Valor cliente` (solo «Cliente») |
| Conversion Currency | `EUR` |

## Cada semana (lunes)

1. Airtable → Leads → vista «Google Ads · conversiones» (Fuente = google_ads, GCLID no vacío) → Descargar CSV.
2. `node marketing/google-ads/offline-conversions/exportar.mjs leads.csv conversiones.csv`
3. Leer los avisos (fuera de 90 días, cliente sin valor, GBRAID/WBRAID).
4. Google Ads → Objetivos → Conversiones → Subidas → subir `conversiones.csv`. Revisar el informe de errores de Google.
5. Marcar en Airtable «Conversiones enviadas» lo que lista el script (así no se sube dos veces).

## Límites conocidos
- Ventana de 90 días desde el clic (fuente oficial). Usamos «Primer envío» como aproximación del clic y dejamos 2 días de margen.
- GBRAID/WBRAID (iOS) no caben en esta plantilla: el script los lista aparte. Van por Data Manager.
- Desde el 15/06/2026 la subida por API pasa a Data Manager API (fuente oficial). La automatización futura se hará ahí, no con `UploadClickConversion`.
- Conversiones mejoradas para leads: la etiqueta web ya envía el email (cifrado por gtag) solo con consentimiento. Activarlas en la cuenta es un paso del día de activación.
