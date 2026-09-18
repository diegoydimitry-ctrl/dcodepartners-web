# Guarda «Google Ads → propuesta = borrador interno» en n8n

**No aplicada en n8n.** Preparada y probada.

## Situación actual (export de n8n del 13/09/2026)
- `MK/Lead IA 360` (ACTIVO) guarda los leads del formulario y **no** dispara propuestas.
- `CM/Generador de Propuestas IA` (ACTIVO) tiene un disparador «Lead Nuevo (Automático)» que solo invoca `CM/CRM Inteligente`, que está **INACTIVO**.
- Conclusión: hoy un lead de las landings no recibe propuesta automática. La guarda es para que siga siendo así aunque alguien reactive CRM Inteligente o conecte otro disparador.

## Qué cambia
En el nodo `Validar Lead para Propuesta Automatica` del Generador:
- `validar-lead-propuesta.original.js`: código actual, copiado del export.
- `validar-lead-propuesta.v2.js`: el mismo código + la guarda. Si `Fuente = google_ads` y «Etapa embudo» no es «Reunión celebrada» o posterior → `pasaValidaciones = false` con motivo, y `estadoPropuestaSiGoogleAds = "Borrador interno (pendiente de diagnóstico)"`. Si no se puede leer el lead, falla cerrado.
- Prueba: `tests/ads/backend.test.mjs` → «n8n · la guarda…» ejecuta el código v2 como lo haría n8n.

## Cómo aplicarla (cuando se apruebe)
1. Exportar el workflow actual (copia).
2. Abrir el nodo `Validar Lead para Propuesta Automatica` y sustituir su código por `validar-lead-propuesta.v2.js`.
3. Ejecutarlo en manual con un lead de PRUEBA (empresa con «TEST»).
4. Guardar. No hace falta tocar ningún otro nodo.

El envío de la propuesta siempre es humano (revisión en «Propuestas Generadas»).
