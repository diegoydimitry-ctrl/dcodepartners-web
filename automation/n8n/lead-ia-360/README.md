# Lead IA 360 — Plantilla n8n

Cualificación automática de leads con IA. Stack: **n8n Cloud + Airtable + Gemini API + Gmail**.

Diseñada como plantilla reutilizable: para desplegarla en un cliente nuevo se
cambian credenciales + variables de entorno + base de Airtable — **no se toca
ningún nodo**.

## Arquitectura

```
Webhook (POST /lead-ia-360)
  → Normalizar y Validar Lead            [Code]
  → ¿Lead Válido?                        [If]
      ✗ → Responder Error de Validación  [Respond to Webhook · 400]
      ✓ → Airtable - Crear Lead          [Airtable · create]
        → Gemini - Analizar Lead         [HTTP Request · Gemini API, JSON estructurado]
        → Interpretar Análisis IA        [Code · parseo + fallback]
        → Airtable - Actualizar Análisis IA [Airtable · update]
            → Responder Éxito al Formulario          [Respond to Webhook · 200]
            → Gmail - Email de Confirmación al Cliente [Gmail]
            → ¿Prioridad Alta?                        [If]
                ✓ → Gmail - Alerta Interna Lead Prioritario [Gmail]
```

12 nodos. Decisiones de diseño relevantes:

- **Un único nodo de validación** hace normalización de campos (ES/EN),
  validación y construcción del prompt de Gemini — evita nodos Set/Function
  intermedios.
- **Salida estructurada de Gemini** (`responseSchema` + `responseMimeType:
  application/json`) en vez de parseo de texto libre: respuesta siempre
  parseable, sin prompts frágiles de "responde solo en JSON".
- **Modelo `gemini-2.5-flash`** por defecto (configurable): coste mínimo
  para un caso de uso de clasificación/resumen, no requiere el modelo `pro`.
- **La respuesta al formulario se envía antes de los correos**: el
  webhook no espera a que Gmail entregue el email, así el frontend recibe
  respuesta rápida y el envío de correos no bloquea la latencia percibida.
- **Fallback si Gemini falla**: `Interpretar Análisis IA` nunca deja un lead
  sin score — si la llamada falla o el JSON viene incompleto, asigna
  Prioridad "Media" / Score 50 y marca `Error de Análisis IA` para revisión
  manual, en vez de romper el workflow.
- **Reintentos automáticos** en el nodo de Gemini (3 intentos, 2s de
  espera) para absorber errores transitorios de red/cuota.

## Requisitos previos

1. Cuenta n8n Cloud.
2. Base de Airtable con una tabla `Leads` (ver esquema abajo).
3. API key de Gemini (Google AI Studio).
4. Cuenta de Gmail conectada vía OAuth2 en n8n.

## Esquema de la tabla Airtable `Leads`

| Campo                    | Tipo                                   |
|---------------------------|-----------------------------------------|
| Lead ID                   | Single line text                        |
| Nombre                    | Single line text                        |
| Empresa                   | Single line text                        |
| Email                      | Email                                    |
| Teléfono                  | Phone number                            |
| Servicio de Interés        | Single line text                        |
| Mensaje                    | Long text                               |
| Origen                    | Single line text                        |
| Fecha de Recepción         | Date (con hora)                         |
| Estado                    | Single select: Nuevo, Análisis IA en curso, Analizado, Contactado, Ganado, Perdido |
| Score IA                  | Number (entero)                         |
| Prioridad                 | Single select: Alta, Media, Baja        |
| Probabilidad de Compra     | Number (entero, %)                      |
| Urgencia                  | Single select: Alta, Media, Baja        |
| Servicio Recomendado       | Single line text                        |
| Resumen Comercial IA        | Long text                               |
| Siguiente Acción           | Long text                               |
| Error de Análisis IA        | Checkbox                                |

## Variables de entorno (n8n Cloud → Settings → Environments)

| Variable            | Obligatoria | Descripción                                                              |
|---------------------|:-----------:|---------------------------------------------------------------------------|
| `GEMINI_MODEL`       | No          | Modelo de Gemini a usar. Por defecto `gemini-2.5-flash`.                  |
| `SERVICES_CATALOG`   | Recomendada | Lista de servicios del cliente, en texto libre. Se inyecta en el prompt.  |
| `COMPANY_NAME`       | Recomendada | Nombre de la empresa, usado en el email al cliente.                       |
| `SENDER_NAME`        | No          | Cómo se autodenomina el remitente en el email ("nuestro equipo", "Diego"…). |
| `SALES_TEAM_EMAIL`   | Sí          | Bandeja del equipo comercial para la alerta de leads prioritarios.        |
| `WEBHOOK_SECRET`     | No          | Si se define, el formulario debe enviar la cabecera `x-webhook-secret` con este valor. Déjala vacía para desactivar la comprobación. |

## Credenciales a configurar tras importar

El export no incluye secretos. Al importar el JSON, n8n marcará estos 3
nodos como "credencial no configurada" — hay que enlazarlos manualmente:

1. **Airtable - Crear Lead** / **Airtable - Actualizar Análisis IA**
   → credencial `Airtable Token API` (Personal Access Token con acceso a la
   base). Además hay que abrir cada nodo y seleccionar la Base/Tabla reales
   desde el desplegable (el JSON trae un ID de base de ejemplo).
2. **Gemini - Analizar Lead**
   → credencial genérica `Header Auth`, con:
   - Name: `x-goog-api-key`
   - Value: tu API key de Gemini
3. **Gmail - Email de Confirmación al Cliente** / **Gmail - Alerta Interna
   Lead Prioritario**
   → credencial `Gmail OAuth2`.

## Puesta en producción

1. Importar `lead-ia-360.workflow.json` en n8n (Workflows → Import from
   File).
2. Enlazar las 3 credenciales (paso anterior) y confirmar Base/Tabla de
   Airtable en ambos nodos Airtable.
3. Configurar las variables de entorno.
4. Activar el workflow (`Active: ON`). n8n mostrará la URL del webhook de
   producción — apuntar el formulario web a esa URL.
5. Probar con una petición real:

```bash
curl -X POST "https://<tu-instancia>.app.n8n.cloud/webhook/lead-ia-360" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ana Torres",
    "empresa": "Torres Consulting",
    "email": "ana@torresconsulting.com",
    "telefono": "+34 600 111 222",
    "servicio_interes": "Automatización de procesos",
    "mensaje": "Necesitamos automatizar la gestión de facturas cuanto antes, se nos acumulan cada mes."
  }'
```

6. Verificar: registro creado y actualizado en Airtable, email recibido en
   la cuenta de prueba, y (si el lead califica como Alta prioridad) alerta
   interna en `SALES_TEAM_EMAIL`.
7. Revisar en n8n → Executions que no haya ejecuciones marcadas con
   `aiError: true` de forma recurrente (indicaría un problema de cuota o de
   configuración de la API key de Gemini).

## Replicar para un cliente nuevo

No se edita ningún nodo. Para vender/desplegar esta plantilla a otro
cliente:

1. Duplicar el workflow (o importar el mismo JSON) en la instancia n8n del
   cliente.
2. Crear su base de Airtable con el mismo esquema de tabla `Leads`.
3. Enlazar sus credenciales propias (Airtable, Gemini, Gmail).
4. Ajustar las variables de entorno (`SERVICES_CATALOG`, `COMPANY_NAME`,
   `SALES_TEAM_EMAIL`, etc.) a los datos del cliente.
5. Activar y apuntar su formulario al nuevo webhook.
