# CAMBIOS ABIERTOS — D-Code Partners

> Estados permitidos: PENDIENTE · EN INVESTIGACIÓN · BLOQUEADO · LISTO PARA EJECUTAR
> · EN EJECUCIÓN · VERIFICACIÓN · RESUELTO · DESCARTADO
> No marcar RESUELTO sin evidencia de que funciona en producción.

Última actualización: 2026-08-08.

Plantilla de cada cambio:

```
ID:
Estado:
Área:
Prioridad: (P0/P1/P2/P3, ver ROADMAP.md)
Impacto:
Urgencia:
Dependencias:
Problema:
Causa:
Evidencia:
Solución propuesta:
Riesgo:
Acción requerida:
Responsable:
Bloqueado por:
Fecha de detección:
Última revisión:
Estado de verificación:
```

---

## CAMBIO-001

- ID: CAMBIO-001
- Estado: PENDIENTE
- Área: Automatizaciones / n8n
- Prioridad: P1
- Impacto: Si el workflow Lead IA 360 no está activo o tiene el webhook
  desactualizado, **todos** los leads del sitio se pierden en silencio — es el único
  canal de entrada de leads verificado en este repositorio.
- Urgencia: Alta — es un supuesto no verificado sobre el sistema que sostiene el
  único canal comercial conocido.
- Dependencias: ninguna.
- Problema: no se ha verificado en vivo si el workflow "Lead IA 360" está
  actualmente **activo** en la cuenta n8n real, ni si la Production URL configurada
  en `assets/js/main.js` (`N8N_WEBHOOK_URL`) coincide con la URL real del nodo
  Webhook.
- Causa: [EVIDENCIA DIRECTA — README del workflow] esto ya ha ocurrido antes: la v9
  documenta que el webhook apuntaba a "una cuenta ya abandonada" y por eso "el
  workflow no había recibido ninguna ejecución" durante un tiempo no especificado.
  Es un fallo con precedente real, no solo hipotético.
- Evidencia: [EVIDENCIA DIRECTA] `automation/n8n/lead-ia-360/README.md`, changelog
  v9. [NO VERIFICADO] si la situación actual es correcta.
- Solución propuesta: verificar en n8n (cuando haya herramienta conectada con
  acceso) que el workflow está `Active: ON` y que la Production URL coincide
  exactamente con `N8N_WEBHOOK_URL` en `assets/js/main.js`. Si no coincide,
  actualizar la constante y confirmarlo con un envío de prueba real desde
  `/contacto` (no `curl`, Turnstile lo bloquea — así lo indica el propio README).
- Riesgo de no actuar: pérdida silenciosa de leads sin ninguna alerta — el
  formulario probablemente seguiría mostrando éxito al usuario si el fallo es de
  red/URL y hay fallback (`api/contact-fallback.js`), pero eso no está confirmado.
- Acción requerida: verificación (lectura), no requiere autorización de cambio en
  producción salvo que se detecte una URL desactualizada.
- Responsable: [PENDIENTE DE DEFINIR]
- Bloqueado por: acceso en vivo a la cuenta n8n (MCP de n8n u otra herramienta).
- Fecha de detección: 2026-08-08.
- Última revisión: 2026-08-08.
- Estado de verificación: [NO VERIFICADO]

## CAMBIO-002

- ID: CAMBIO-002
- Estado: PENDIENTE
- Área: Marketing / n8n
- Prioridad: P2
- Impacto: Sin post nuevo, el calendario de LinkedIn deja de publicar contenido
  automáticamente a partir del 29 de agosto de 2026 sin ningún aviso — el workflow
  simplemente no hace nada ("Sin Publicación Hoy") ese día y todos los siguientes.
- Urgencia: Media — quedan ~3 semanas desde la fecha de este documento (2026-08-08).
- Dependencias: ninguna.
- Problema: el calendario de contenido del workflow "LinkedIn Auto-Post" está
  embebido y cubre solo 12 posts (3–28 de agosto de 2026, 3 posts/semana).
- Causa: diseño intencional documentado — el calendario vive dentro del Code node
  porque n8n Cloud no tiene acceso al repositorio.
- Evidencia: [EVIDENCIA DIRECTA] `automation/n8n/linkedin-auto-post/README.md`.
- Solución propuesta: decidir con antelación (antes del 28 de agosto de 2026) si se
  extiende el calendario con más semanas, o se deja que la publicación automática
  se detenga y pase a manual. Requiere editar el array `CALENDARIO` del Code node
  en n8n directamente (según el propio README).
- Riesgo de no actuar: silencio en LinkedIn sin que nadie lo note, ya que no hay
  alerta configurada para "no queda contenido programado".
- Acción requerida: decisión de Dirección + ejecución en n8n (modificación de
  producción, requiere autorización explícita).
- Responsable: [PENDIENTE DE DEFINIR]
- Bloqueado por: decisión de Dirección sobre si continuar la cadencia de LinkedIn.
- Fecha de detección: 2026-08-08.
- Última revisión: 2026-08-08.
- Estado de verificación: [EVIDENCIA DIRECTA] (el hecho de que el calendario termine
  el 28/08 está confirmado leyendo el propio Code node; lo no verificado es si ya
  existe un plan para extenderlo).

## CAMBIO-003

- ID: CAMBIO-003
- Estado: PENDIENTE
- Área: Comercial / Gobernanza
- Prioridad: P1
- Impacto: Si no hay proceso definido de seguimiento comercial tras la creación del
  lead en Airtable, los leads cualificados como prioritarios podrían no convertirse
  — información generada pero sin acción garantizada después.
- Urgencia: Alta si el volumen de leads es significativo; [NO VERIFICADO] volumen
  actual.
- Dependencias: CAMBIO-001 (de nada sirve resolver el seguimiento si los leads ni
  siquiera están llegando de forma fiable).
- Problema: el workflow deja explícitamente en blanco los campos `Notas
  comerciales`, `Responsable` y `Fecha seguimiento` en Airtable "para que el equipo
  comercial los complete a mano" — es decir, el paso posterior al lead cualificado
  es manual y no está automatizado ni, hasta donde se puede verificar aquí,
  monitorizado.
- Causa: ausencia de automatización de seguimiento comercial (por diseño, no es un
  bug) — pendiente confirmar si es una decisión deliberada de Dirección o un hueco
  no decidido todavía.
- Evidencia: [EVIDENCIA DIRECTA] `automation/n8n/lead-ia-360/README.md`, tabla de
  esquema de Airtable.
- Solución propuesta: no proponer automatización todavía sin antes confirmar con
  Dirección si el proceso comercial manual actual es intencional y suficiente, o si
  se considera un cuello de botella. (Ver regla "diseñar → validar → estabilizar →
  automatizar" antes de automatizar un proceso comercial sensible.)
- Riesgo: automatizar prematuramente el contacto/seguimiento comercial sin validar
  el proceso podría generar emails duplicados o mal timing con clientes reales.
- Acción requerida: DECISIÓN DE DIRECCIÓN antes de cualquier propuesta técnica.
- Responsable: Dirección (decisión) → [PENDIENTE DE DEFINIR] (ejecución).
- Bloqueado por: decisión de Dirección.
- Fecha de detección: 2026-08-08.
- Última revisión: 2026-08-08.
- Estado de verificación: [EVIDENCIA DIRECTA] sobre el hueco; [NO VERIFICADO] si es
  intencional.

---

Ver también `INCIDENCIAS.md` para el patrón sistémico detectado en el historial de
versiones del workflow Lead IA 360 (gobernanza de despliegue), que es distinto de
estos cambios puntuales.
