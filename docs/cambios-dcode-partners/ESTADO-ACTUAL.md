# ESTADO ACTUAL — D-Code Partners

> Responde a: "¿Cómo está D-Code Partners AHORA?"
> Este archivo se reescribe/actualiza en cada auditoría (ver `AUDITORIAS.md`).
> No es un histórico — para histórico ver `HISTORIAL-CAMBIOS.md`.

Última actualización: 2026-08-14 (auditoría AUD-20260814-001).
Fuente de esta versión: acceso en vivo a n8n (MCP, 38 workflows) y Gmail (MCP,
bandeja `dcodedepartment@gmail.com`), más lectura del código de este repositorio.
**El conector Airtable de esta sesión no tenía bases visibles (0 bases)** — los
datos de Airtable se verifican solo indirectamente, vía nodos de n8n y los informes
automáticos que el propio sistema envía por email. Ver limitaciones al final.

## Leyenda de estados

🟢 OPERATIVO · 🟡 PARCIAL · 🟠 REQUIERE ATENCIÓN · 🔴 BLOQUEADO ·
⚪ NO VERIFICADO · 🔵 PENDIENTE DE DECISIÓN

## Leyenda de evidencia

[EVIDENCIA DIRECTA] observado directamente en n8n/Gmail en vivo o en código del
repo · [EVIDENCIA INDIRECTA] deducido de artefactos relacionados (p. ej. informes
automáticos que no se han contrastado con la fuente original) · [INFERENCIA]
conclusión razonada sin confirmación directa · [NO VERIFICADO] no se pudo
comprobar con las herramientas de esta sesión

## Resumen ejecutivo

🔴 **BLOQUEADO** — D-Code Partners está hoy, según su propio sistema interno de
monitorización, en "día crítico de continuidad de crisis operativa": ~27,6% de
tasa de error en n8n (26 errores / 94 ejecuciones en 24h, el peor dato de su
historial), 0 clientes activos, 0 propuestas generadas en 24h, y un canal de
seguimiento comercial completamente roto en sus dos mitades desde hace al menos
una semana. Al mismo tiempo, existe una infraestructura de automatización mucho
más amplia de lo documentado en la versión anterior de este archivo (38 workflows
de n8n, no 2), incluyendo un sistema de prospección activa (Radar Comercial) que
sí funciona de forma fiable. Ver `CAMBIOS-ABIERTOS.md` para el detalle de cada
hallazgo (CAMBIO-001 a CAMBIO-010) y el informe completo en `AUDITORIAS.md`
(AUD-20260814-001).

## Dirección

⚪ NO VERIFICADO — Sin `DECISIONES-DIRECCION.md` poblado todavía. El propio sistema
interno ("DIR/Executive Board") generó hoy una "Decisión Ejecutiva del Día"
automática (freeze + reasignación técnica) — es una **propuesta generada por IA**,
no una decisión real de Dirección, y no debe tratarse como tal hasta que Dirección
la confirme o la descarte.

## Modelo de negocio

🟡 PARCIAL — sin cambios respecto a la versión anterior: propuesta de valor pública
coherente en el sitio, precios/planes reales [PENDIENTE DE DEFINIR].

## Comercial / Radar / Leads

🔴 REQUIERE ATENCIÓN — cadena mixta: partes que funcionan bien, partes rotas.

- ⚪→🔴 **Captación web ("MK/Lead IA 360")**: [EVIDENCIA DIRECTA] 0 ejecuciones
  registradas desde su creación (12 días), pese a estar activo y con la URL del
  webhook correctamente configurada. No se ha confirmado si es un fallo real o
  ausencia de tráfico. Ver CAMBIO-001.
- 🟢 **Prospección activa ("AAA/Radar Comercial IA")**: [EVIDENCIA DIRECTA] corre a
  diario, 0 errores en 8 ejecuciones verificadas, genera HOT/WARM reales (hoy: 35
  empresas analizadas, 31 HOT).
- 🔴 **Seguimiento comercial ("CM/Seguimiento Comercial IA" +
  "CM/Detección de Respuestas")**: [EVIDENCIA DIRECTA] ambos workflows están rotos
  — uno por credencial de Airtable inválida (7/7 días), otro por un fix sin
  publicar (145 errores históricos). El sistema de seguimiento automático no ha
  funcionado en ninguna dirección en al menos una semana. Ver CAMBIO-004 y
  CAMBIO-005.
- 🔴 **Radar → Clientes ("CM/CRM Inteligente")**: [EVIDENCIA DIRECTA] solo 1
  ejecución en 12 días, pese a estar configurado semanalmente. Ver CAMBIO-007.
- ⚪ **Propuestas ("CM/Generador de Propuestas IA")**: existe como workflow, pero no
  se ha verificado su disparador real en esta pasada. [EVIDENCIA INDIRECTA — informe
  interno] "Propuestas generadas (24h): 0".
- [EVIDENCIA INDIRECTA — informe interno, no contrastado con Airtable directamente]
  Total leads: 13 (11 "Nuevo", 2 "Sin definir"), 0 clientes activos, tasa de
  conversión "N/D (sin cierres todavía)".

## Automatizaciones / n8n

🔴 REQUIERE ATENCIÓN — **38 workflows activos** [EVIDENCIA DIRECTA], no 2 como
documentaba la versión anterior de este archivo. Organizados en bloques: `MK/`
(marketing), `CM/` (comercial), `AAA/` (prospección), `DIR/` (dirección/meta-
negocio), `PRD/` (proyectos), `CLS/` (clientes), `FNZ/` (finanzas), `SP/`
(soporte), `ADM/` (administración). Detalle completo en
`SISTEMAS-Y-INTEGRACIONES.md`.

Estado general reportado por el propio sistema (`DIR/Executive Board - Auditor
Interno`, email de hoy): **~27,6% de tasa de error** (26 errores / 94 ejecuciones
en 24h), "el peor dato reportado hasta la fecha, superando incluso los máximos
relativos previos (22-22,4%)". [EVIDENCIA INDIRECTA — informe interno, pero
consistente con la verificación directa de errores concentrados en
`ujkXnsEtzySHr00l`].

**Importante**: el propio Auditor Interno diagnosticó mal la causa — culpó a
`GZ3w0M3oLzZzgceB` (0 errores confirmados) en vez de `ujkXnsEtzySHr00l` (32 de 33
errores del periodo verificados directamente). Ver CAMBIO-006. No tomar el
diagnóstico del Auditor Interno como verificación independiente sin contrastar.

Workflows verificados sanos hoy: Radar Comercial IA (0 errores/8 ejecuciones).
Workflows verificados rotos hoy: Detección de Respuestas (145 errores), Seguimiento
Comercial IA (7/7 días fallando a las 06:30). Workflow nunca ejecutado: Lead IA
360. Workflow inactivo sin decidir: AI Factory Orchestrator.

## Airtable

⚪ NO VERIFICADO DIRECTAMENTE — el conector MCP de Airtable de esta sesión no tiene
bases visibles (`list_bases` → `[]`). Todo lo que se sabe de Airtable en esta
pasada viene de (a) los parámetros de los nodos n8n (base `app5JfVEjK4JiMXEm`,
tabla `Leads` = `tblfQXOCLlEf9cJUa`, confirmado que existe y n8n la referencia
activamente) y (b) los informes automáticos por email, no de una lectura directa
de los registros. La credencial Airtable usada por al menos un workflow
(`CM/Seguimiento Comercial IA`) está confirmada **inválida** (401).

## Gmail

🟡 PARCIAL — [EVIDENCIA DIRECTA] la bandeja `dcodedepartment@gmail.com` está activa
y recibe tráfico real: alertas de error cada ~2h, informes diarios/dashboard,
notificaciones de HOT leads, contenido pendiente de revisión, y correos externos
sin relación con el negocio (LinkedIn, Google). 38 correos sin clasificar según el
informe interno, cerca de su máximo histórico (39). Ver CAMBIO-009.

## Marketing / Web

🟢 OPERATIVO (sitio) — sin cambios sustanciales respecto a la versión anterior.

🟡 PARCIAL (contenido) — [EVIDENCIA DIRECTA] "MK/Contenido IA Redes Sociales" genera
4 publicaciones/día (LinkedIn, Instagram, Facebook, X) pendientes de revisión
humana — sustituye o amplía lo que documentaba la versión anterior sobre el
calendario fijo de LinkedIn de 12 posts (ver actualización en CAMBIO-002,
`CAMBIOS-ABIERTOS.md`). No verificado si ese contenido generado realmente se está
publicando tras la revisión.

## Finanzas

🔵 PENDIENTE DE DECISIÓN — [EVIDENCIA DIRECTA] existe "FNZ/Facturación IA" pero con
0 ejecuciones nunca; su propia descripción indica "sin disparador de negocio
automático todavía — pendiente decisión sobre qué evento debe generarlas".
Coherente con 0 clientes activos: no es urgente hoy, pero es una decisión de
diseño pendiente. También existen "FNZ/Cobros y Recordatorios de Pago" y
"FNZ/Control de Gastos" (no auditados en detalle en esta pasada).

## Operaciones

⚪ PARCIALMENTE VERIFICADO — [EVIDENCIA DIRECTA] existe un bloque completo `PRD/`
(Gestión de Proyectos, Asignación Automática, Control de Entregas, Seguimiento de
Tareas) y `CLS/` (Onboarding, Bienvenida, Renovaciones, Encuestas), todos activos
según `search_workflows`. No se ha verificado su salud individual en esta pasada
más allá de `PRD/Asignación Automática` (0 errores, ver CAMBIO-006). Dado que hay
0 clientes activos, gran parte de esta capa (onboarding, renovaciones, encuestas)
no tiene todavía nada real que procesar.

## IA (asistente del sitio + resto del sistema)

🟢 OPERATIVO (asistente del sitio) — sin cambios respecto a la versión anterior.

🟡 PARCIAL (capa de "Executive Board" / meta-negocio) — [EVIDENCIA DIRECTA] existen
al menos 6 workflows dedicados a auto-reportar el estado de la empresa (Auditor
Interno, Director Estratégico IA vía Claude, Recolector Externo, Informes
Diario/Semanal/Mensual, Dashboard Ejecutivo, KPIs Empresa), generando varios
emails al día. Funciona técnicamente (genera y envía los informes), pero su
contenido de diagnóstico no siempre es fiable (ver CAMBIO-006) y no está claro que
esté generando ACCIÓN, solo información. Ver CAMBIO-008.

## Seguridad

🟡 PARCIAL — sin cambios respecto a la versión anterior sobre Turnstile. Nuevo
hallazgo: al menos una credencial de producción (Airtable PAT usado por
`CM/Seguimiento Comercial IA`) está actualmente inválida — no es un riesgo de
exposición, pero sí de fiabilidad operativa (ver CAMBIO-005).

## Documentación

🟢 OPERATIVO — esta arquitectura documental, actualizada hoy con la segunda
auditoría (AUD-20260814-001). La primera versión (8 de agosto) quedó desactualizada
en varios puntos clave (existencia de Radar Comercial, de los asistentes Director/
Auditor, del sistema real de contenido de redes) — ver CAMBIO-008 sobre por qué
esto importa para la calidad de las decisiones futuras.

## Otros

⚪ NO VERIFICADO — soporte (`SP/Tickets IA`, `SP/Chat IA Clientes`) existe como
workflow activo pero no se ha auditado en esta pasada; administración (`ADM/`)
igual.

---

## Limitaciones de esta pasada

- El conector MCP de Airtable no tenía bases visibles — cualquier cifra atribuida a
  Airtable que no venga de un nodo n8n concreto es [EVIDENCIA INDIRECTA] (informes
  automáticos del propio sistema), no lectura directa.
- No se ha abierto el contenido completo de todos los 38 workflows — el análisis se
  centró en los que aparecían como fuente de error o como eslabones críticos de la
  cadena comercial. Workflows de `PRD/`, `CLS/`, `SP/`, `ADM/`, `FNZ/` (salvo
  Facturación) no se han auditado en detalle individual.
- Las cifras de "94 ejecuciones / 26 errores en 24h" y "38 correos sin clasificar"
  vienen del informe automático del Auditor Interno, no de un recuento propio
  exhaustivo — dado que ya se confirmó que este mismo sistema erró en su diagnóstico
  de causa raíz (CAMBIO-006), sus cifras agregadas se marcan [EVIDENCIA INDIRECTA],
  no [EVIDENCIA DIRECTA], hasta que se contrasten.
