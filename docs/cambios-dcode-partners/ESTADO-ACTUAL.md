# ESTADO ACTUAL — D-Code Partners

> Responde a: "¿Cómo está D-Code Partners AHORA?"
> Este archivo se reescribe/actualiza en cada auditoría (ver `AUDITORIAS.md`).
> No es un histórico — para histórico ver `HISTORIAL-CAMBIOS.md`.

Última actualización: 2026-08-08.
Fuente de esta versión: inspección de solo lectura del código de este repositorio
(`dcodepartners-web`, rama `claude/dcode-partners-changes-governance-tvyk6k`). No se
consultaron n8n/Airtable/Gmail en vivo en esta pasada — ver limitaciones al final.

## Leyenda de estados

🟢 OPERATIVO · 🟡 PARCIAL · 🟠 REQUIERE ATENCIÓN · 🔴 BLOQUEADO ·
⚪ NO VERIFICADO · 🔵 PENDIENTE DE DECISIÓN

## Leyenda de evidencia

[EVIDENCIA DIRECTA] observado directamente en código/documentación del repo ·
[EVIDENCIA INDIRECTA] deducido de artefactos relacionados · [INFERENCIA] conclusión
razonada sin confirmación directa · [NO VERIFICADO] no se pudo comprobar con las
herramientas de esta sesión

## Dirección

⚪ NO VERIFICADO — Sin acceso a documentación de estrategia/decisiones desde este
repositorio. Ver `DECISIONES-DIRECCION.md` (vacío por ahora).

## Modelo de negocio

🟡 PARCIAL — [EVIDENCIA DIRECTA] La propuesta de valor pública (departamentos IA +
servicios) está publicada y coherente en el sitio (8 páginas de departamento, 3 de
servicio, navegación unificada según `git log`: "Unificar navegación: sustituir
'Servicios' por 'Departamentos'"). Precios/planes/condiciones comerciales reales no
se han volcado a esta documentación — [PENDIENTE DE DEFINIR].

## Comercial / Radar / Leads

🟡 PARCIAL — [EVIDENCIA DIRECTA] Existe un único punto de entrada de leads
verificado: el formulario de `/contacto`, que llama directamente (fetch desde el
navegador) al workflow n8n `lead-ia-360-v2`. El workflow cualifica el lead con
Gemini y lo guarda en Airtable (tabla `Leads`, upsert por email).
[NO VERIFICADO] Estado real de ejecución en producción (¿está el workflow activo
ahora mismo? ¿cuántas ejecuciones recientes, cuántas fallidas?) — requiere consultar
n8n en vivo, no disponible en esta pasada.
⚪ NO VERIFICADO — Existencia de un "Radar Comercial IA" o de un paso HOT/WARM
previo al lead. No hay rastro de ello en este repositorio.
⚪ NO VERIFICADO — Qué ocurre después de que un lead entra en Airtable (¿se genera
propuesta? ¿hay seguimiento comercial manual o automático?). El README del workflow
documenta que los campos `Notas comerciales`, `Responsable`, `Fecha seguimiento`
quedan en blanco para que el equipo comercial los complete a mano — es decir, el
seguimiento posterior al lead es, como mínimo en parte, manual. [EVIDENCIA DIRECTA]

## Automatizaciones / n8n

🟡 PARCIAL — Dos workflows documentados en el repo:

1. **Lead IA 360** (`automation/n8n/lead-ia-360/`) — cualificación de leads.
   [EVIDENCIA DIRECTA] El propio README documenta un historial de versiones (v3 a
   v10) con múltiples bugs reales encontrados y corregidos en producción
   (credenciales mal enlazadas, expresiones sin `=`, webhook apuntando a una cuenta
   n8n abandonada, columnas de Airtable perdidas, error 500 por nodo sin manejo de
   errores). Esto es evidencia directa de que este workflow ha tenido fallos de
   despliegue/configuración repetidos en el pasado — ver patrón sistémico en
   `INCIDENCIAS.md`. Estado *actual* de activación en la cuenta n8n real: [NO
   VERIFICADO].
2. **LinkedIn Auto-Post** (`automation/n8n/linkedin-auto-post/`) — publica un
   calendario de 12 posts embebido en el propio nodo (3–28 de agosto de 2026).
   [EVIDENCIA DIRECTA] Es autocontenido (n8n Cloud no tiene acceso al repo). El
   calendario definido cubre hasta el 28 de agosto de 2026 — pasada esa fecha no
   publicará nada más salvo que se extienda. Estado de activación real: [NO
   VERIFICADO]. Dado que hoy es 2026-08-08, quedan ~3 semanas de calendario
   programado.

## Airtable

⚪ NO VERIFICADO en vivo — El esquema de la tabla `Leads` está documentado (ver
`SISTEMAS-Y-INTEGRACIONES.md`), confirmado como correcto en la v6 del workflow
según su propio README, pero esta sesión no consultó Airtable directamente para
confirmar que sigue siendo así.

## Gmail

⚪ NO VERIFICADO en vivo — Integración vía OAuth2 en n8n, usada para confirmación al
cliente y alerta interna de leads prioritarios. No verificado si la cuenta OAuth
sigue conectada/válida.

## Marketing / Web

🟢 OPERATIVO (como sitio estático) — [EVIDENCIA DIRECTA] Sitio publicado en Vercel,
despliegue automático al hacer push a `main` (README.md). Blog con 3 artículos +
índice. Historial de commits reciente (`git log`) muestra actividad constante:
nuevas páginas de departamento, unificación de navegación, auditoría de footer/CSS
muerto.
🟡 PARCIAL — LinkedIn: automatización de publicación existe pero solo como texto
(sin imágenes/carrusel) y desde perfil personal, no página de empresa (limitación
documentada explícitamente por el propio README del workflow).

## Finanzas

⚪ NO VERIFICADO — No hay artefactos de finanzas/cobros en este repositorio.

## Operaciones

⚪ NO VERIFICADO — No hay artefactos de gestión de proyectos/clientes en este
repositorio.

## IA (asistente del sitio)

🟢 OPERATIVO (con fallback) — [EVIDENCIA DIRECTA] `api/chat.js` + `lib/providers.js`
implementan un asistente con selección automática de proveedor (Gemini o Anthropic,
según qué API key esté configurada en Vercel) y modo de recuperación si no hay
ninguna clave. Comentarios en el propio código documentan fallos reales ya resueltos
(modelo Gemini fijo dado de baja → alias `-latest`; token de "thinking" agotando el
límite de salida → límite ampliado).

## Seguridad

🟡 PARCIAL — [EVIDENCIA DIRECTA] Turnstile protege el formulario; el secreto vive en
una credencial n8n (no en el JSON versionado). El README del workflow indica
explícitamente que el propio repositorio de automatizaciones se versiona en Git, lo
que hace relevante que no haya secretos en los `.workflow.json` — no se ha auditado
en esta pasada si eso se cumple realmente en los ficheros `.workflow.json`
versionados. [NO VERIFICADO]

## Documentación

🟢 OPERATIVO (recién creada) — Esta misma arquitectura documental
(`docs/cambios-dcode-partners/` + `CLAUDE.md`), creada en esta sesión.

## Otros

⚪ NO VERIFICADO — Cualquier sistema no listado arriba (CRM, facturación,
propuestas, tickets) no tiene evidencia ni a favor ni en contra en este repo.

---

## Limitaciones de esta pasada

Esta versión de `ESTADO-ACTUAL.md` se construyó **solo con lectura del código de
este repositorio**. No se consultaron en vivo: n8n (ejecuciones reales, si los
workflows están activos), Airtable (registros reales), Gmail (bandeja real), ni
ningún sistema fuera de este repositorio. Antes de tomar decisiones basadas en este
documento, una futura sesión con esas herramientas conectadas debe ejecutar la Fase
2 ("Comprobar realidad") del protocolo en `AUDITORIAS.md`.
