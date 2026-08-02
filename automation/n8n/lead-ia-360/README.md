# Lead IA 360 — Plantilla n8n

Cualificación automática de leads con IA. Stack: **n8n Cloud + Airtable + Gemini API + Gmail**.

Diseñada como plantilla reutilizable: para desplegarla en un cliente nuevo se
cambian credenciales + el nodo "Configuración" + base de Airtable — **no
se toca ningún nodo de lógica**. Sin Variables de n8n ni `$env`: funciona
igual en el plan Cloud Starter que en Pro.

> **v10 — sin Variables de n8n (plan Cloud Starter, sin features de Pro).**
> Las 8 referencias `$vars.X` se sustituyeron por la herramienta correcta
> para cada caso, sin depender de ninguna feature de pago:
> - **`TURNSTILE_SECRET_KEY`** (secreto real) → credencial n8n de tipo
>   **Custom Auth**, adjunta al nodo `Verificar Turnstile`. Las credenciales
>   son una feature base de n8n disponible en cualquier plan — el secreto
>   nunca queda en texto plano en el JSON del workflow.
> - **`AIRTABLE_BASE_ID` / `AIRTABLE_TABLE_NAME`** (config, no secreto) →
>   el `resourceLocator` de Base/Tabla en ambos nodos Airtable pasa a modo
>   **"From list"**: se eligen de un desplegable dentro de n8n tras
>   importar, sin ninguna expresión.
> - **`GEMINI_MODEL`, `SERVICES_CATALOG`, `COMPANY_NAME`, `SENDER_NAME`,
>   `SALES_TEAM_EMAIL`** (config, no secreto) → nuevo nodo **"Configuración"**
>   (Set/Edit Fields), justo después del Webhook. Un único lugar editable
>   para adaptar el workflow a otro cliente, con un nodo Set estándar.
> - **`WEBHOOK_SECRET`** (secreto, nunca activo) → eliminado: nunca llegó a
>   configurarse y no aportaba protección real sin backend que lo
>   verificara aparte de Turnstile.
>
> Como "Configuración" ya no es garantía de traer los datos del formulario
> (solo aporta config), `Normalizar y Validar Lead` pasó a leer el body
> directamente de `$('Webhook - Recepción de Lead')` en vez de su propio
> `$json` — sigue funcionando sin importar qué nodo lo precede.
>
> **v9 — cuenta de n8n reconectada vía MCP; Gmail y Airtable corregidos
> contra la instancia real.** Al conectar este workflow directamente por
> API (conector oficial de n8n) aparecieron dos bugs más que el import/export
> manual no mostraba: (1) el campo `message` de ambos nodos Gmail no tenía
> el prefijo `=` requerido por n8n para interpretar expresiones `{{ }}` —
> los emails se habrían enviado con los placeholders literales en vez de
> los datos del lead; (2) el nodo `Airtable - Crear o Actualizar Lead`
> había perdido su Base/Tabla/columnas (probablemente al navegar por las
> columnas manualmente en el editor). Ambos corregidos directamente contra
> la cuenta real. También se confirmó que la URL de producción del webhook
> incluye el ID del webhook como parte del path, no solo `/lead-ia-360` —
> `assets/js/main.js` apuntaba a un dominio de n8n distinto (una cuenta ya
> abandonada) y por eso el workflow no había recibido ninguna ejecución.
>
> **v8 — corregido el 500 "Unused Respond to Webhook node found in the
> workflow".** Fallo real confirmado en producción (visible ya en el propio
> mensaje del formulario tras la v7 de `assets/js/main.js`, que expone el
> cuerpo de la respuesta HTTP): el nodo `Interpretar Análisis IA` era el
> único de los nodos "activos" del flujo sin `onError` ni try/catch propio.
> Si `$('Normalizar y Validar Lead').item` o
> `$('Airtable - Crear o Actualizar Lead').item` lanzaban una excepción —
> algo que puede ocurrir cuando un nodo anterior falla y continúa vía
> `continueRegularOutput`, dejando el seguimiento de "paired item" roto,
> una limitación conocida de n8n — la ejecución se detenía por completo
> ahí mismo, **antes** de llegar a ningún nodo `Respond to Webhook`. n8n
> entonces responde ese 500 genérico en vez de propagar el error real.
> Arreglado envolviendo todo el nodo en try/catch, con recuperación
> defensiva del lead directamente desde el body crudo del Webhook si la
> referencia al nodo `Normalizar y Validar Lead` falla, y añadiendo
> `onError: continueRegularOutput` como red de seguridad adicional. Con
> este cambio, cualquier fallo interno del nodo cae en los valores de
> reserva (Score 50 / Prioridad Media) y la ejecución **siempre** llega a
> `Responder Éxito al Formulario` — el formulario nunca vuelve a quedarse
> sin respuesta por este motivo.
>
> **v7 — columna "Prioridad" dedicada.** El cliente añadió el campo
> `Prioridad` (Single select: Alta/Media/Baja) a la tabla `Leads` real, así
> que deja de incrustarse como texto en "Motivo score" y se escribe
> directamente en su propia columna. "Motivo score" ahora solo lleva la
> Probabilidad de Compra.
>
> **v6 — columnas de Airtable remapeadas al esquema real del cliente.**
> La tabla `Leads` real (confirmada en n8n) no coincide con el esquema
> genérico documentado más abajo en versiones anteriores de este archivo:
> usa `Telefono` sin tilde, `Servicio interesado`, y no tiene columnas
> `Lead ID`, `Prioridad`, `Probabilidad de Compra`, `Servicio
> Recomendado` ni `Error de Análisis IA`. Los dos nodos Airtable se
> remapearon en consecuencia (ver "Esquema real" más abajo) y se activó
> `options.typecast: true` para que Airtable acepte valores nuevos en
> columnas de tipo Select (`Estado`, `Urgencia`) sin rechazarlos.
>
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
  → Configuración                                [Set · valores no sensibles del cliente]
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

16 nodos funcionales + 4 sticky notes de arquitectura (documentación visual
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

## Esquema real de la tabla Airtable `Leads` (D-Code Partners)

Esto es lo que el workflow **realmente** lee/escribe, confirmado contra la
tabla ya existente en la cuenta — no un esquema genérico de referencia.
`Email` es la columna de coincidencia del upsert: debe existir y tener un
único registro por dirección de email (marca el campo como único en
Airtable si quieres reforzarlo a nivel de base).

| Campo                | Usado por                        | Origen del valor |
|-----------------------|-----------------------------------|-------------------|
| Email                  | Crear/Actualizar Lead (match)      | `lead.email` |
| Nombre                 | Crear/Actualizar Lead              | `lead.nombre` |
| Empresa                | Crear/Actualizar Lead              | `lead.empresa` |
| Telefono               | Crear/Actualizar Lead              | `lead.telefono` |
| Servicio interesado    | Crear/Actualizar Lead              | `lead.servicioInteres` |
| Necesidad              | Crear/Actualizar Lead              | `lead.mensaje` (mensaje del formulario) |
| Origen campaña         | Crear/Actualizar Lead              | `lead.origen` |
| Estado (select)        | Ambos nodos Airtable               | `"Análisis IA en curso"` al crear, `"Analizado"` tras el análisis |
| Score IA               | Actualizar Análisis IA             | `scoreIA` (0-100) |
| Prioridad (select)     | Actualizar Análisis IA             | `prioridad` (Alta/Media/Baja) |
| Urgencia (select)      | Actualizar Análisis IA             | `urgencia` (Alta/Media/Baja) |
| Resumen IA             | Actualizar Análisis IA             | `"Servicio recomendado: X — "` + `resumenComercial` |
| Motivo score           | Actualizar Análisis IA             | `"Probabilidad de compra: Y%"` |
| Próximo paso           | Actualizar Análisis IA             | `siguienteAccion` |

Campos que existen en tu tabla pero que el workflow **no** rellena (no hay
dato de origen en el formulario): `Cargo`, `Web`, `Sector`, `Pais`,
`Fuente`, `Presupuesto`, `Fecha seguimiento`, `Notas comerciales`,
`Responsable`. Quedan en blanco para que el equipo comercial los complete
a mano.

> **Probabilidad de Compra no tiene columna propia** en tu tabla actual —
> se incrusta como texto dentro de "Motivo score" para no perder el dato.
> Si en algún momento añades un campo `Probabilidad de Compra` (Number),
> avísame y lo separo en su propia columna igual que se hizo con
> "Prioridad".

## Configuración (sin Variables de n8n — compatible con el plan Starter)

Esta plantilla **no usa la feature "Variables"** de n8n (exclusiva de
planes de pago superiores) ni `$env`. Toda la configuración vive en
credenciales o en nodos, con estos 3 mecanismos:

### 1. Nodo "Configuración" (Set) — valores no sensibles

Justo después del Webhook. Ábrelo tras importar y edita los 5 campos
directamente ahí — es el único sitio que hay que tocar para adaptar el
workflow a otro cliente:

| Campo                     | Valor por defecto | Descripción |
|----------------------------|--------------------|--------------|
| `config.geminiModel`        | `gemini-2.5-flash` | Modelo de Gemini a usar. |
| `config.servicesCatalog`    | (catálogo de D-Code Partners) | Se inyecta en el prompt de análisis. |
| `config.companyName`        | `D-Code Partners`  | Usado en el email al cliente. |
| `config.senderName`         | `nuestro equipo`   | Cómo se autodenomina el remitente en el email. |
| `config.salesTeamEmail`     | `dcodedepartment@gmail.com` | Bandeja del equipo comercial para la alerta de leads prioritarios. |

### 2. Base y Tabla de Airtable — modo lista, sin expresiones

En **ambos** nodos Airtable (`Airtable - Crear o Actualizar Lead` y
`Airtable - Actualizar Análisis IA`), los campos **Base** y **Table**
están en modo "From list": ábrelos y elige tu base/tabla del desplegable
— n8n las resuelve por su Personal Access Token, sin necesitar el ID a
mano ni escribir ninguna expresión.

### 3. Secret de Cloudflare Turnstile — credencial Custom Auth

El único valor realmente sensible (`TURNSTILE_SECRET_KEY`) vive en una
**credencial de n8n**, no en una Variable ni en un nodo Set — así nunca
queda en texto plano dentro del JSON del workflow (que, además, en este
proyecto se versiona en un repositorio Git). Las credenciales son
funcionalidad base de n8n, disponible en cualquier plan incluido Starter.

Para crearla:
1. n8n → Credentials → **Add Credential** → busca **"Custom Auth"**
   (a veces aparece como "HTTP Custom Auth").
2. En el campo JSON, pega:
   ```json
   {
     "body": {
       "secret": "TU_SECRET_KEY_DE_CLOUDFLARE_TURNSTILE"
     }
   }
   ```
3. Guárdala con un nombre reconocible, p. ej. `Turnstile Secret (Custom Auth)`.
4. Ábrela y enlázala al nodo **Verificar Turnstile** (Credential → selecciona la que acabas de crear).

> Si tras probarlo Cloudflare sigue devolviendo `missing-input-secret`
> (revisa la ejecución en n8n → Executions → nodo "Verificar Turnstile"),
> es que esta credencial no está inyectando el campo `body.secret` como se
> espera. Alternativa igual de válida si prefieres no depender de Custom
> Auth: pega el secret directamente como valor fijo del parámetro `secret`
> en el nodo "Verificar Turnstile" (Body Parameters) — pierdes que quede
> fuera del JSON versionado, pero sigue sin depender de ninguna feature de
> pago. Dímelo si llegas a este punto y lo dejo así en el JSON.

## Credenciales a configurar tras importar

El export no incluye secretos. Al importar el JSON, n8n marcará estos
nodos como "credencial no configurada" — hay que enlazarlos manualmente:

1. **Airtable - Crear o Actualizar Lead** / **Airtable - Actualizar Análisis
   IA** → credencial `Airtable Token API` (Personal Access Token con acceso
   de lectura/escritura a la base). Después, en cada nodo, selecciona Base
   y Tabla del desplegable (ver punto 2 de la sección anterior).
2. **Gemini - Analizar Lead**
   → credencial genérica `Header Auth`, con:
   - Name: `x-goog-api-key`
   - Value: tu API key de Gemini
3. **Gmail - Email de Confirmación al Cliente** / **Gmail - Alerta Interna
   Lead Prioritario**
   → credencial `Gmail OAuth2`.
4. **Verificar Turnstile**
   → credencial `Custom Auth` con el secret de Turnstile (ver sección
   anterior, punto 3).

## Integración con el formulario web (dcodepartners.com)

El formulario de `/contacto` (`assets/js/main.js`, constante
`N8N_WEBHOOK_URL`) llama directamente a la Production URL real del nodo
Webhook — incluye el ID único del webhook, no es solo
`/webhook/lead-ia-360`. Si reactivas el workflow o lo mueves de cuenta/
instancia, n8n genera una Production URL nueva: cópiala del nodo Webhook y
actualiza `N8N_WEBHOOK_URL` en `assets/js/main.js`, o el envío nunca
llegará a n8n aunque el resto esté bien configurado (síntoma: 0
ejecuciones en n8n → Executions pase lo que pase). Ya no existe `/api/send`
como envío principal; `api/contact-fallback.js` sigue existiendo como
respaldo automático si el envío directo a n8n falla.

## Puesta en producción

1. Importar `lead-ia-360.workflow.json` en n8n (Workflows → Import from
   File).
2. Enlazar las 4 credenciales (Airtable, Header Auth de Gemini, Gmail,
   Custom Auth de Turnstile — ver sección "Credenciales" arriba).
3. Seleccionar Base y Tabla del desplegable en ambos nodos Airtable.
4. Abrir el nodo "Configuración" y revisar/editar los 5 valores (al menos
   `salesTeamEmail`, si no quieres usar el que trae por defecto).
5. Activar el workflow (`Active: ON`). Copia la **Production URL** que
   muestra n8n para el nodo Webhook (incluye un ID único, no es solo
   `/webhook/lead-ia-360`) y actualiza `N8N_WEBHOOK_URL` en
   `assets/js/main.js` si no coincide exactamente.
7. **Probar desde el formulario real** en `https://dcodepartners.com/contacto`
   (no por curl): el token de Turnstile solo lo genera el widget en un
   navegador real, así que una petición curl con un `turnstileToken`
   inventado siempre será rechazada por el nodo "Verificar Turnstile" —
   eso es el comportamiento correcto, no un fallo.
8. Verificar: registro creado en Airtable, email recibido en la cuenta de
   prueba, y (si el lead califica como Alta prioridad) alerta interna en
   `config.salesTeamEmail`.
9. Reenviar el formulario con el mismo email: debe **actualizar** el mismo
   registro de Airtable en vez de crear uno nuevo — así se valida la
   deduplicación por email.
10. Revisar en n8n → Executions los logs de los nodos `Code` (salida
    `console.log`/`console.error` en JSON) y confirmar que no haya
    ejecuciones recurrentes con `aiError: true` o `crmError: true` (indicaría
    un problema de cuota/credenciales de Gemini o de permisos de Airtable).
11. Si el envío falla en el navegador con un error de red/CORS (visible en
    la consola del navegador, no en el mensaje mostrado al usuario),
    revisa `options.allowedOrigins` en el nodo Webhook — debe incluir el
    origen exacto desde el que se sirve la web.

### Probar la lógica sin un token real de Turnstile

Para probar Airtable/Gemini/Gmail de forma aislada sin pasar por
Cloudflare, en el editor de n8n abre el nodo "Verificar Turnstile" y usa
"Execute step" con datos de prueba (mock data) que devuelvan
`{ "success": true }` — así avanza el flujo sin necesitar un token real.

## Replicar para un cliente nuevo

No se edita ningún nodo de lógica — solo el de "Configuración", las
credenciales y los desplegables de Airtable. Funciona igual en cualquier
plan de n8n Cloud, incluido Starter. Para vender/desplegar esta plantilla
a otro cliente:

1. Duplicar el workflow (o importar el mismo JSON) en la instancia n8n del
   cliente.
2. Crear su base de Airtable con el mismo esquema de tabla `Leads`.
3. Enlazar sus credenciales propias: Airtable, Gemini (Header Auth),
   Gmail, y una credencial Custom Auth nueva con **su** secret de
   Cloudflare Turnstile.
4. Seleccionar su Base/Tabla en el desplegable de ambos nodos Airtable.
5. Editar el nodo "Configuración" con los datos del cliente
   (`servicesCatalog`, `companyName`, `senderName`, `salesTeamEmail`,
   `geminiModel` si procede).
6. Cambiar `options.allowedOrigins` en el nodo Webhook al dominio real del
   sitio del cliente (si su formulario llama al webhook directamente desde
   el navegador, como en dcodepartners.com).
7. Activar y apuntar su formulario a la Production URL real de su webhook
   (incluye el ID único — cópiala del nodo Webhook, no la inventes).
