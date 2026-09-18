# Registro de afirmaciones de las landings y las demos

Regla: **nada que no se pueda enseñar funcionando en el diagnóstico.** Cada frase que describe lo que hace un sistema tiene aquí su evidencia. Si la evidencia cambia, se cambia la frase.

Fuentes: Notion · CATÁLOGO (16/08/2026) y PRICING OFICIAL (19/08/2026); export de n8n del 13/09/2026 (`dcode-n8n-workflows/n8n-workflows-2026-09-13.json`); descripciones de tablas de Airtable (leídas el 18/09/2026).

| Afirmación (landing / demo) | Evidencia | Estado |
|---|---|---|
| Cada solicitud entra sola en un CRM, con su origen | Catálogo: Comercial IA núcleo «centraliza el pipeline»; MK/Lead IA 360 ACTIVO escribe en Leads | OK |
| El sistema prepara un borrador de propuesta; una persona la revisa | CM/Generador de Propuestas IA ACTIVO; tabla Propuestas: «pendiente de revisión humana antes de enviar» | OK |
| Si no hay respuesta, el responsable recibe un aviso | Catálogo: «Recordatorio» dentro de Comercial IA núcleo (vendible ahora). **Ojo:** CM/Recordatorio Comercial figura INACTIVO en el export del 13/09 | VERIFICAR antes de activar anuncios del GA2 |
| NO se afirma seguimiento automático al cliente (3/7/14 días) | Catálogo: Seguimiento Comercial IA NO VIGENTE | Excluido a propósito |
| Cada email de cliente se convierte en ticket con prioridad | SP/Tickets IA ACTIVO; tabla Tickets: «filtro de relevancia por IA» | OK |
| Se asigna a quien tiene menos carga | Tabla Tickets: «asigna por menor carga del Equipo» (SP/Seguimiento de Tickets ACTIVO) | OK |
| Aviso antes del plazo y escalado si se incumple | Tabla Tickets: aviso antes de vencer el SLA y escalado a Dirección; SLA Crítica 2 h, Alta 8 h, Media 24 h, Baja 48 h | OK |
| «No es un chatbot» / la IA no responde a clientes | SP/Chat IA Clientes NO VIGENTE (fallo de seguridad pendiente) | Excluido a propósito |
| Al ganar un cliente se crea el proyecto y se reparten tareas por carga; se vigilan plazos | Catálogo: Producción IA «crea el proyecto automáticamente al ganar un cliente, reparte tareas según carga real del equipo y vigila plazos»; PRD/* ACTIVOS | OK |
| Recordatorios, copias de seguridad, encuestas | Pricing: ejemplos de Automatización Básica | OK |
| Auditoría de la web y recomendaciones | Catálogo: Marketing IA · SEO IA (vendible ahora). MK/SEO IA figura INACTIVO en el export del 13/09 | VERIFICAR antes de nombrarlo en anuncios |
| Diagnóstico de 30 min por videollamada | Web actual (/metodo, /contacto): «Una llamada de 30 minutos»; Cal.com `30min` | OK |
| «Gratuito» | No publicado en la web | NO SE USA hasta decisión |
| «30 días de prueba sin factura» | La web actual: condiciones «caso a caso» | NO SE USA hasta decisión |
| Precios | Pricing sin reconciliar (19/08 vs criterios 18/09) | NO SE USA hasta decisión |
| «Cuánto se paga al principio y después; cuota solo si hay trabajo recurrente real» | Criterios de pricing de Dirección 18/09/2026 | OK |

## Datos de las demos
Empresas (Reformas Ribera, Clínica Arce, Talleres Norte), personas (Laura, Marta, Jorge, Ana, Luis, Pablo), pedidos, fechas: **inventados**. La demo lleva la marca permanente «DATOS DE DEMOSTRACIÓN» y el texto «Demostración con datos inventados». Ningún dato de Sánchez Rubio, Finance ni otro cliente.

## El vídeo
Se genera con `marketing/google-ads/demos/grabar-videos.mjs`, que graba el mismo reproductor animado de la landing (no el sistema real) y le añade subtítulos .vtt. No es una grabación del producto en funcionamiento y no se presenta así.
