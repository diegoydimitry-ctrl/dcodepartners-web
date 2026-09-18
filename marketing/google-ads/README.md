# Google Ads · Fase 0 — infraestructura comercial y de medición

**Estado:** GOOGLE ADS NO ACTIVADO · GASTO 0 € · CUENTA NO CREADA · PROMOCIÓN NO CANJEADA · PRODUCCIÓN INTACTA.
Comprobación completa: `npm run fase0:ads` (imprime `FASE_0_GOOGLE_ADS_READY`).

```
Google Search → anuncio → landing → DEMO → formulario → /api/ads-lead → Airtable «Leads»
   → ficha de cualificación (HECHO ≠ INFERENCIA) → reunión (Cal.com) → propuesta = BORRADOR INTERNO
   → conversiones offline (GCLID) → Google Ads
```

## Qué hay en el repositorio
| Pieza | Ficheros |
|---|---|
| 3 landings + gracias | `/automatizacion-procesos.html`, `/automatizacion-seguimiento-comercial.html`, `/automatizacion-atencion-clientes.html`, `/gracias-diagnostico.html` (generadas por `landings/generar.mjs` desde `landings/contenido.mjs`) |
| Demo y vídeo | `assets/ads/demos.js` (guiones, datos inventados), `demo-player.js`, `assets/ads/video/*.mp4|.vtt|.jpg` (grabados con `demos/grabar-videos.mjs`) |
| Tracking y consentimiento | `assets/ads/ads.js`, `assets/ads/config.js` (público), puerta de CookieYes + Consent Mode v2 en el `<head>` |
| Servidor | `api/ads-lead.js`, `api/ads-lead-event.js`, `api/_lib/ads/*` (validación, origen, deduplicación, ficha, reglas CRM, Airtable) |
| Airtable | `airtable/esquema-campos.cjs`, `airtable/MIGRACION-LEADS.md`; base de PRUEBAS `appwMWJvQPpu0Ypvg` |
| n8n | `n8n/validar-lead-propuesta.v2.js` + `n8n/README.md` |
| Conversiones offline | `offline-conversions/conversiones.cjs`, `exportar.mjs`, `PROCESO.md` |
| Keywords, negativas, anuncios | `03_…csv`, `04_…csv`, `07_…csv` (del estudio, sin tocar), `07b_…csv` (complemento con motivo), `campana/` (mapa y ficheros de Google Ads Editor, todo PAUSADO) |
| Panel del embudo | `panel/panel.html` + `panel/calculo.js` (local, no se publica) |
| Pruebas | `tests/ads/backend.test.mjs` (node), `tests/ads/e2e.test.mjs` (Playwright) |
| Día de activación | `ACTIVACION.md` · Seguridad: `SEGURIDAD.md` · Decisiones: `DECISIONES-PENDIENTES.md` · Afirmaciones: `demos/AFIRMACIONES.md` |
| Estudio original | `estudio/` |

## Comandos
```
npm run ads:landings      # regenera las 4 páginas
npm run ads:borradores    # regenera mapa y ficheros de Google Ads Editor
npm run ads:servidor      # servidor local con /api en memoria (http://localhost:4173)
npm run ads:videos        # regraba los vídeos (necesita ads:servidor en marcha)
npm run test:ads          # pruebas de servidor
npm run test:ads:e2e      # pruebas de extremo a extremo (Chromium)
npm run fase0:ads         # comprobación FASE_0_GOOGLE_ADS_READY
```
