# ARQUITECTURA — D-Code Partners

> Cómo se relacionan los sistemas entre sí. Para el inventario plano de cada
> sistema individual, ver `SISTEMAS-Y-INTEGRACIONES.md`.

Última actualización: 2026-08-08.

## Cadena: captación de leads

```
Visitante en dcodepartners.com/contacto
        ↓  fetch() directo desde el navegador (sin backend intermedio)
Webhook n8n — workflow "Lead IA 360" (Production URL, incluye ID único)
        ↓
Verificar Turnstile (Cloudflare siteverify)  — falla cerrado
        ↓
Airtable · Crear o Actualizar Lead (upsert por Email)
        ↓
Gemini · Analizar Lead (score 0-100, prioridad, urgencia, resumen — JSON estructurado)
        ↓
Airtable · Actualizar Análisis IA (mismo registro)
        ↓ (en paralelo, sin bloquearse entre sí)
   ├─ Respond to Webhook → confirmación al formulario
   ├─ Gmail · Email de confirmación al cliente
   └─ Gmail · Alerta interna al equipo comercial (solo si Prioridad Alta)
```

Para cada tramo:

| Tramo | Origen | Destino | Mecanismo | Trigger | Condiciones | Resultado esperado | Estado |
|---|---|---|---|---|---|---|---|
| 1 | Formulario `/contacto` | Webhook n8n | HTTP POST (fetch navegador) | Envío del formulario | CORS restringido a dominios dcodepartners.com | Lead recibido por n8n | ⚪ NO VERIFICADO en vivo |
| 2 | Webhook | Turnstile | HTTP Request a Cloudflare | Automático tras webhook | Token de Turnstile válido | Bloquea spam/bots | 🟡 EVIDENCIA DIRECTA de diseño, no verificado en vivo |
| 3 | n8n | Airtable (`Leads`) | Upsert nativo, match por `Email` | Automático | — | Registro creado/actualizado sin duplicados | ⚪ NO VERIFICADO en vivo |
| 4 | n8n | Gemini API | HTTP Request, JSON estructurado | Automático | Requiere credencial Header Auth válida | Score/prioridad/urgencia/resumen | ⚪ NO VERIFICADO en vivo |
| 5 | n8n | Airtable | Update | Automático, si el registro CRM está disponible | — | Campos de análisis IA rellenos | ⚪ NO VERIFICADO en vivo |
| 6 | n8n | Gmail | OAuth2 | Automático | — | Email de confirmación + alerta si Alta prioridad | ⚪ NO VERIFICADO en vivo |
| 7 | Airtable (post-lead) | Equipo comercial | Manual | — | — | Seguimiento, notas, responsable asignado | 🟠 REQUIERE ATENCIÓN — confirmado manual, sin automatización ni monitorización conocida (ver CAMBIO-003) |

Riesgos conocidos en esta cadena (con precedente real, ver `INCIDENCIAS.md`):
Production URL del webhook desincronizada entre n8n y `assets/js/main.js`;
credenciales de Gmail/Airtable perdidas o mal enlazadas tras ediciones manuales en
el editor de n8n; nodo sin manejo de errores rompiendo toda la ejecución.

## Cadena: publicación de contenido (LinkedIn)

```
Schedule Trigger (08:30 Europe/Madrid, diario)
        ↓
Code node "Calendario de Contenido" (12 posts embebidos, 3–28 ago 2026)
        ↓
¿Hay post programado hoy?
    ✓ → Publicar en LinkedIn (perfil personal, solo texto)
    ✗ → No hace nada
```

Autocontenido: no depende de este repositorio en tiempo de ejecución (n8n Cloud no
lee `assets/data/`). Riesgo conocido: sin aviso automático cuando se agote el
calendario (ver CAMBIO-002).

## Cadena: asistente de IA del sitio

```
Usuario en el chat del sitio
        ↓
api/chat.js (función serverless Vercel)
        ↓
lib/providers.js → getProvider()
        ↓ (según qué API key esté configurada en Vercel)
   ├─ Gemini (por defecto si su clave está presente)
   ├─ Anthropic (alternativa)
   └─ Sin clave → modo de recuperación (respuesta basada en knowledge-base.json)
```

`assets/data/knowledge-base.json` se regenera desde el HTML publicado mediante
`scripts/build-knowledge-base.js` (`npm run generate-kb`) — es contenido del sitio,
no datos de negocio en vivo.

## Cadenas no verificadas / posiblemente inexistentes

No hay evidencia en este repositorio de una cadena Radar → HOT → Lead previa a la
entrada del formulario, ni de una cadena Lead → Propuesta → Cierre → Cobro
posterior. Si Dirección confirma que existen en otro sistema, deben documentarse
aquí con el mismo nivel de detalle antes de asumir nada sobre ellas.
