# Lead IA 360 — Plantilla n8n

Cualificación automática de leads con IA. Stack: **n8n Cloud + Airtable + Gemini API + Gmail**.

Diseñada como plantilla reutilizable: para desplegarla en un cliente nuevo se
cambian credenciales + variables de n8n + base de Airtable — **no se toca
ningún nodo**.

> **v5 — el formulario de dcodepartners.com llama a este webhook
> directamente desde el navegador** (`fetch()` en `assets/js/main.js`,
> ya no existe `/api/send` ni ningún backend intermedio). Eso traslada dos
> responsabilidades que antes cubría esa función serverless al propio
> workflow:
> 1. **Verificación de Cloudflare Turnstile** — nodos nuevos "Verificar
>    Turnstile" (llama a `siteverify` de Cloudflare) y "¿Turnstile
>    Válido?". Falla cerrado: token inválido, caducado, o un fallo de red
>    hacia Cloudflare bloquean el envío igual que antes.
> 2. **CORS** — el nodo Webhook restringe `options.allowedOrigins` a
>    `https://dcodepartners.com` y `https://www.dcodepartners.com` (antes
>    no hacía falta, la llamada era same-origin vía `/api/send`).
>
> También se relajó la validación de `mensaje` a opcional (con valor por
> defecto "Sin mensaje adicional.") para que coincida con el HTML real del
> formulario, donde ese campo nunca fue `required`.
>
> **v4 — verificado contra n8n Cloud real.** El body de la petición a
> Gemini (prompt + `responseSchema`) ya no se construye como expresión
> `{{ {...} }}` inline en el nodo HTTP Request: ese patrón, con un objeto
> anidado tan grande, produce `[invalid syntax]` en el editor de n8n (el
> parser de expresiones, basado en `jsep`, no soporta de forma fiable
> objetos JS de ese tamaño). Ahora el body completo se construye y
> serializa con `JSON.stringify()` dentro del Code node "Normalizar y
> Validar Lead" (`geminiRequestBody`), y el nodo HTTP solo referencia ese
> string ya válido — además maneja correctamente comillas y saltos de
> línea que pudiera traer el mensaje del lead.
>
> **v3 — post-auditoría.** Se sustituyó `$env` por `$vars` en todas las
> referencias de configuración: `$env` lee variables de entorno del proceso
> del sistema operativo, algo que en n8n Cloud (multi-tenant) no es
> configurable por el cliente y que además está bloqueado por defecto
> dentro de nodos `Code`. `$vars` es la feature "Variables" de n8n
> (Settings/Overview → Variables), pensada exactamente para este caso de
> uso y accesible sin flags de infraestructura. También se añadieron:
> `webhookId` explícito en el nodo Webhook, IDs de nodo como UUID v4,
> flags `attemptToConvertTypes`/`convertFieldsToString` en los nodos
> Airtable, y se eliminó una cabecera `Content-Type` redundante en la
> llamada a Gemini.
>
> **Si al abrir el workflow ves avisos (▲) en los nodos Airtable o
> Gmail**, no son un bug del JSON: significa que las Variables de n8n de
> la sección siguiente aún no existen en tu cuenta (se confirma viendo que
> cualquier campo con `$vars.X` resuelve a "undefined" en la vista previa
> del nodo). Créalas y el aviso desaparece solo, sin tocar nada más.

## Arquitectura

```
Webhook (POST /lead-ia-360, CORS restringido a dcodepartners.com)
  → Normalizar y Validar Lead                    [Code]
  → ¿Lead Válido?                                [If]
      ✗ → Responder Error de Validación          [Respond to Webhook · 400/500]
      ✓ → Verificar Turnstile                    [HTTP Request · Cloudflare siteverify]
        → ¿Turnstile Válido?                     [If]
            ✗ → Responder Error de Validación (reuso)
            ✓ → Airtable - Crear o Actualizar Lead [Airtable · upsert por Email]
              → Gemini - Analizar Lead             [HTTP Request · Gemini API, JSON estructurado]
              → Interpretar Análisis IA            [Code · parseo + fallback + logs]
                  → ¿Registro CRM Disponible?           [If]
                      ✓ → Airtable - Actualizar Análisis IA [Airtable · update]
                  → Responder Éxito al Formulario                [Respond to Webhook · 200]
                  → Gmail - Email de Confirmación al Cliente     [Gmail]
                  → ¿Prioridad Alta?                             [If]
                      ✓ → Gmail - Alerta Interna Lead Prioritario [Gmail]
```

15 nodos funcionales + 4 sticky notes de arquitectura (documentación visual
por etapa en el propio canvas). Todos los nodos llevan `notes` con su
función; el código de los nodos `Code` lleva comentarios explicando el
porqué. Decisiones de diseño relevantes:

- **Deduplicación por email sin lógica custom**: `Airtable - Crear o
  Actualizar Lead` usa la operación nativa `upsert` con `matchingColumns:
  ["Email"]` — crea el lead si no existe, actualiza sus datos de contacto si
  ya existía. Cero nodos de búsqueda/comparación manual, cero condición de
  carrera entre "buscar" y "crear".
- **Lead ID determinista** (`hashEmail`) en vez de aleatorio: el mismo
  email siempre produce el mismo Lead ID, coherente con el upsert y
  trazable entre reenvíos del mismo lead.
- **Un único nodo de validación** hace normalización de campos (ES/EN),
  validación y construcción del prompt de Gemini — evita nodos Set/Function
  intermedios.
- **Salida estructurada de Gemini** (`responseSchema` + `responseMimeType:
  application/json`) en vez de parseo de texto libre: respuesta siempre
  parseable, sin prompts frágiles de "responde solo en JSON".
- **Modelo `gemini-2.5-flash`** por defecto (configurable): coste mínimo
  para un caso de uso de clasificación/resumen, no requiere el modelo `pro`.
- **Manejo completo de errores, sin puntos únicos de fallo**: los 4 nodos
  externos (Airtable ×2, Gemini, Gmail ×2) tienen `retryOnFail` +
  `onError: continueRegularOutput` — un fallo transitorio no rompe la
  ejecución. `Interpretar Análisis IA` detecta fallos de Gemini (`aiError`)
  y del upsert de Airtable (`crmError`) y aplica valores de reserva
  (Score 50 / Prioridad Media) para que ningún lead se quede sin
  seguimiento. `¿Registro CRM Disponible?` evita un segundo intento de
  escritura contra un registro que nunca se creó.
- **4 ramas en paralelo tras el análisis**: respuesta al formulario,
  actualización de Airtable, email al cliente y alerta interna no se
  bloquean entre sí — el webhook responde en cuanto hay score, sin esperar
  a Gmail ni al guardado final en el CRM.
- **Logs estructurados** (`console.log`/`console.error` en JSON) en los
  puntos clave: lead recibido, lead inválido, error de normalización,
  error de análisis IA, error de CRM y resumen final por lead
  (`evento`, `leadId`, timestamps) — visibles en n8n → Executions → cada
  nodo `Code`, y reenviables a un colector de logs externo si se conecta
  uno a la instancia de n8n.

## Requisitos previos

1. Cuenta n8n Cloud.
2. Base de Airtable con una tabla `Leads` (ver esquema abajo).
3. API key de Gemini (Google AI Studio).
4. Cuenta de Gmail conectada vía OAuth2 en n8n.

## Esquema de la tabla Airtable `Leads`

`Email` es la columna de coincidencia del upsert: debe existir y tener un
único registro por dirección de email (marca el campo como único en
Airtable si quieres reforzarlo a nivel de base).

| Campo                    | Tipo                                   |
|---------------------------|-----------------------------------------|
| Lead ID                   | Single line text                        |
| Nombre                    | Single line text                        |
| Empresa                   | Single line text                        |
| Email                      | Email (recomendado: valor único)         |
| Teléfono                  | Phone number                            |
| Servicio de Interés        | Single line text                        |
| Mensaje                    | Long text                               |
| Origen                    | Single line text                        |
| Última Actualización        | Date (con hora)                         |
| Estado                    | Single select: Análisis IA en curso, Analizado, Contactado, Ganado, Perdido |
| Score IA                  | Number (entero)                         |
| Prioridad                 | Single select: Alta, Media, Baja        |
| Probabilidad de Compra     | Number (entero, %)                      |
| Urgencia                  | Single select: Alta, Media, Baja        |
| Servicio Recomendado       | Single line text                        |
| Resumen Comercial IA        | Long text                               |
| Siguiente Acción           | Long text                               |
| Error de Análisis IA        | Checkbox                                |

## Variables de n8n (Overview / Settings → Variables)

Se leen con `$vars.NOMBRE` — **no** con `$env` (ver nota de la v3 arriba).
Crear cada una como Variable de n8n, con estos nombres exactos:

| Variable              | Obligatoria | Descripción                                                              |
|-----------------------|:-----------:|---------------------------------------------------------------------------|
| `AIRTABLE_BASE_ID`     | Sí          | ID de la base de Airtable del cliente (`appXXXXXXXXXXXXXX`).             |
| `AIRTABLE_TABLE_NAME`  | No          | Nombre de la tabla de leads. Por defecto `Leads`.                        |
| `GEMINI_MODEL`         | No          | Modelo de Gemini a usar. Por defecto `gemini-2.5-flash`.                  |
| `SERVICES_CATALOG`     | Recomendada | Lista de servicios del cliente, en texto libre. Se inyecta en el prompt.  |
| `COMPANY_NAME`         | Recomendada | Nombre de la empresa, usado en el email al cliente.                       |
| `SENDER_NAME`          | No          | Cómo se autodenomina el remitente en el email ("nuestro equipo", "Diego"…). |
| `SALES_TEAM_EMAIL`     | Sí          | Bandeja del equipo comercial para la alerta de leads prioritarios.        |
| `TURNSTILE_SECRET_KEY` | Sí          | Secret key de Cloudflare Turnstile (Cloudflare Dashboard → Turnstile → tu widget). Sin esto, `Verificar Turnstile` rechaza todos los leads. |
| `WEBHOOK_SECRET`       | No          | Si se define, el formulario debe enviar la cabecera `x-webhook-secret` con este valor. Déjala vacía para desactivar la comprobación. |

> Si tu plan de n8n Cloud no incluye la feature "Variables", como
> alternativa se puede fijar estos valores como literales directamente en
> cada nodo (perdiendo la reutilización entre clientes) — avisa si es el
> caso y se adapta el JSON.

## Credenciales a configurar tras importar

El export no incluye secretos. Al importar el JSON, n8n marcará estos
nodos como "credencial no configurada" — hay que enlazarlos manualmente:

1. **Airtable - Crear o Actualizar Lead** / **Airtable - Actualizar Análisis
   IA** → credencial `Airtable Token API` (Personal Access Token con acceso
   de lectura/escritura a la base). Base y tabla ya se resuelven vía
   `AIRTABLE_BASE_ID` / `AIRTABLE_TABLE_NAME`, no hace falta reseleccionarlas
   en el desplegable.
2. **Gemini - Analizar Lead**
   → credencial genérica `Header Auth`, con:
   - Name: `x-goog-api-key`
   - Value: tu API key de Gemini
3. **Gmail - Email de Confirmación al Cliente** / **Gmail - Alerta Interna
   Lead Prioritario**
   → credencial `Gmail OAuth2`.

**Verificar Turnstile** no lleva credencial propia: el secret se lee de la
Variable `TURNSTILE_SECRET_KEY` (ver arriba), no de un credential de n8n.

## Integración con el formulario web (dcodepartners.com)

El formulario de `/contacto` (`assets/js/main.js`) llama directamente a
`https://diegoydimitry.app.n8n.cloud/webhook/lead-ia-360` — ya no existe
`/api/send` ni ningún backend intermedio. Si cambias el path del webhook o
lo despliegas en otra instancia, actualiza la constante `N8N_WEBHOOK_URL`
en ese archivo.

## Puesta en producción

1. Importar `lead-ia-360.workflow.json` en n8n (Workflows → Import from
   File).
2. Enlazar las 3 credenciales (Airtable, Header Auth de Gemini, Gmail —
   ver sección anterior).
3. Configurar las Variables de n8n, incluyendo `AIRTABLE_BASE_ID` y
   `TURNSTILE_SECRET_KEY`.
4. Activar el workflow (`Active: ON`). El path de producción debe
   coincidir con `N8N_WEBHOOK_URL` en `assets/js/main.js`
   (`/webhook/lead-ia-360`).
5. **Probar desde el formulario real** en `https://dcodepartners.com/contacto`
   (no por curl): el token de Turnstile solo lo genera el widget en un
   navegador real, así que una petición curl con un `turnstileToken`
   inventado siempre será rechazada por el nodo "Verificar Turnstile" —
   eso es el comportamiento correcto, no un fallo.
6. Verificar: registro creado en Airtable, email recibido en la cuenta de
   prueba, y (si el lead califica como Alta prioridad) alerta interna en
   `SALES_TEAM_EMAIL`.
7. Reenviar el formulario con el mismo email: debe **actualizar** el mismo
   registro de Airtable en vez de crear uno nuevo — así se valida la
   deduplicación por email.
8. Revisar en n8n → Executions los logs de los nodos `Code` (salida
   `console.log`/`console.error` en JSON) y confirmar que no haya
   ejecuciones recurrentes con `aiError: true` o `crmError: true` (indicaría
   un problema de cuota/credenciales de Gemini o de permisos de Airtable).
9. Si el envío falla en el navegador con un error de red/CORS (visible en
   la consola del navegador, no en el mensaje mostrado al usuario),
   revisa `options.allowedOrigins` en el nodo Webhook — debe incluir el
   origen exacto desde el que se sirve la web.

### Probar la lógica sin un token real de Turnstile

Para probar Airtable/Gemini/Gmail de forma aislada sin pasar por
Cloudflare, en el editor de n8n abre el nodo "Verificar Turnstile" y usa
"Execute step" con datos de prueba (mock data) que devuelvan
`{ "success": true }` — así avanza el flujo sin necesitar un token real.

## Replicar para un cliente nuevo

No se edita ningún nodo. Para vender/desplegar esta plantilla a otro
cliente:

1. Duplicar el workflow (o importar el mismo JSON) en la instancia n8n del
   cliente.
2. Crear su base de Airtable con el mismo esquema de tabla `Leads`.
3. Enlazar sus credenciales propias (Airtable, Gemini, Gmail).
4. Ajustar las Variables de n8n (`SERVICES_CATALOG`, `COMPANY_NAME`,
   `SALES_TEAM_EMAIL`, `TURNSTILE_SECRET_KEY` con el secret de **su**
   widget de Cloudflare Turnstile, etc.) a los datos del cliente.
5. Cambiar `options.allowedOrigins` en el nodo Webhook al dominio real del
   sitio del cliente (si su formulario llama al webhook directamente desde
   el navegador, como en dcodepartners.com).
6. Activar y apuntar su formulario al nuevo webhook.
