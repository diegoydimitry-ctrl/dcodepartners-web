# AUDITORÍAS — D-Code Partners

> Registro de auditorías realizadas por el rol "Cambios D-Code Partners". Una
> auditoría no debe confundirse con una ejecución de cambios.

Última actualización: 2026-08-08.

## Protocolo de cada futura auditoría

Cuando Dirección pida una revisión (p. ej. "revisa D-Code Partners", "haz una
auditoría completa", "¿qué cambios tenemos pendientes?"), la sesión debe seguir
estas 7 fases:

**FASE 1 — Cargar contexto.** Leer, en este orden: `CLAUDE.md` →
`CONTEXTO-MAESTRO.md` → `ESTADO-ACTUAL.md` → `CAMBIOS-ABIERTOS.md` →
`DECISIONES-DIRECCION.md` → `ROADMAP.md` → `ARQUITECTURA-DCP.md` →
`INCIDENCIAS.md`.

**FASE 2 — Comprobar realidad.** Usar las herramientas disponibles en esa sesión
(MCP de n8n, Airtable, Gmail, GitHub, lectura del repositorio) para verificar el
estado actual. No confiar únicamente en la documentación — puede estar
desactualizada. Si una herramienta no está disponible, marcar esa área como [NO
VERIFICABLE CON LA INFORMACIÓN DISPONIBLE] en vez de asumir nada.

**FASE 3 — Comparar.** Estado documentado (lo leído en Fase 1) vs. estado real (lo
verificado en Fase 2).

**FASE 4 — Detectar cambios.** Problemas resueltos, problemas nuevos, problemas que
empeoraron, cambios de prioridad, nuevas dependencias, decisiones pendientes.

**FASE 5 — Priorizar.** No entregar una lista plana de N recomendaciones
equivalentes. Reducir a TOP 1 / TOP 2 / TOP 3 y el resto por debajo.

**FASE 6 — Informar.** Entregar: resumen ejecutivo, cambios desde la última
revisión, problemas críticos, top prioridades, dependencias, decisiones que
necesita Dirección, riesgos, siguiente acción recomendada.

**FASE 7 — Actualizar memoria.** Tras una auditoría autorizada, actualizar
`ESTADO-ACTUAL.md`, `CAMBIOS-ABIERTOS.md`, `HISTORIAL-CAMBIOS.md` y registrar la
propia auditoría en este archivo (plantilla abajo).

## Plantilla de auditoría

```
ID: AUD-AAAAMMDD-XXX
FECHA:
ALCANCE:
SISTEMAS REVISADOS:
HALLAZGOS:
INCIDENCIAS:
CAMBIOS PROPUESTOS:
CAMBIOS EJECUTADOS:
CAMBIOS NO EJECUTADOS:
EVIDENCIA:
LIMITACIONES:
RESULTADO:
```

## Registro de auditorías

### AUD-20260808-001

- FECHA: 2026-08-08
- ALCANCE: Construcción inicial del sistema de memoria documental (no es una
  auditoría de negocio completa — ver limitaciones).
- SISTEMAS REVISADOS: Solo el repositorio `dcodepartners-web` en modo lectura
  (HTML del sitio, `automation/n8n/*/README.md` y `.workflow.json`, `api/`, `lib/`,
  `package.json`, `git log`). No se consultaron n8n, Airtable ni Gmail en vivo — los
  MCP correspondientes no estaban conectados en esta sesión en el momento de crear
  esta documentación.
- HALLAZGOS: ver `ESTADO-ACTUAL.md` para el detalle completo por área. Resumen: la
  cadena de captación de leads (formulario → n8n → Airtable → Gemini → Gmail) está
  bien documentada en el propio repositorio pero no verificada en vivo; existe un
  historial real de fallos de despliegue/configuración en el workflow de leads
  (ver patrón sistémico en `INCIDENCIAS.md`); el calendario de LinkedIn tiene fecha
  de caducidad natural (28/08/2026); el seguimiento comercial post-lead es manual y
  sin monitorización conocida.
- INCIDENCIAS: 6 incidencias históricas extraídas del changelog del workflow
  (todas marcadas como resueltas por su propia documentación) + 1 patrón sistémico
  de gobernanza de despliegue. Ver `INCIDENCIAS.md`.
- CAMBIOS PROPUESTOS: CAMBIO-001, CAMBIO-002, CAMBIO-003 (ver `CAMBIOS-ABIERTOS.md`).
- CAMBIOS EJECUTADOS: ninguno sobre producción. Se creó la arquitectura documental
  (`docs/cambios-dcode-partners/*.md`, `CLAUDE.md`) — cambio de documentación,
  autorizado explícitamente por Dirección en esta conversación.
- CAMBIOS NO EJECUTADOS: los tres CAMBIO-00X quedan como PENDIENTE, requieren
  verificación en vivo o decisión de Dirección antes de ejecutarse.
- EVIDENCIA: commits en la rama `claude/dcode-partners-changes-governance-tvyk6k`.
- LIMITACIONES: sin acceso en vivo a n8n/Airtable/Gmail en esta pasada; sin
  información sobre Dirección, finanzas, operaciones o un eventual "Radar Comercial
  IA" fuera de este repositorio; no se auditó en detalle el contenido de las
  páginas legales (`condiciones-contratacion.html`, `garantias.html`, etc.).
- RESULTADO: Sistema de memoria documental creado y poblado con la evidencia
  disponible desde el código. Lista para que una futura sesión con herramientas en
  vivo conectadas ejecute la Fase 2 completa y confirme o descarte los tres cambios
  propuestos.

### AUD-20260814-001

- FECHA: 2026-08-14
- ALCANCE: revisión global solicitada por Dirección (CAM-20260814-001), orientada
  a impacto comercial: "qué cambios preparan a D-Code Partners para vender a
  pymes". Primera auditoría con acceso en vivo a n8n y Gmail; el conector Airtable
  de esta sesión no tenía bases visibles.
- SISTEMAS REVISADOS: n8n (38 workflows listados, ~10 inspeccionados en detalle:
  ejecuciones, errores, código de nodos), Gmail (bandeja
  `dcodedepartment@gmail.com`, ~20 hilos recientes), repositorio
  `dcodepartners-web` (contexto de la auditoría anterior).
- HALLAZGOS: ver `ESTADO-ACTUAL.md` para el detalle completo. Resumen: (1) el
  webhook de captación de leads del sitio web nunca se ha ejecutado (0 ejecuciones
  en 12 días) y no está claro el origen de los 13 leads que muestra el informe
  interno de Airtable; (2) el workflow de detección de respuestas de leads está
  roto por un fix ya escrito pero nunca publicado (145 errores históricos); (3) el
  workflow de seguimiento comercial automático está roto por una credencial de
  Airtable inválida (7/7 días fallando); (4) el propio Auditor Interno del sistema
  diagnosticó mal la causa raíz de los errores del día (culpó a un workflow con 0
  errores en vez del que realmente concentra el 97%); (5) el Radar Comercial IA
  funciona de forma fiable y genera oportunidades HOT/WARM a diario, pero el puente
  hacia la tabla Clientes solo se ha ejecutado una vez en 12 días; (6) el sistema
  interno de auto-reporte ("Executive Board") es mucho más extenso de lo
  documentado (6+ workflows) y hoy reporta 0 clientes activos, 0 propuestas y
  ~27,6% de tasa de error como "tendencia crónica de varios días".
- INCIDENCIAS: INC-20260814-001, INC-20260814-002, INC-20260814-003 (ver
  `INCIDENCIAS.md`), más confirmación en vivo de que el patrón sistémico de
  gobernanza de despliegue (documentado en la auditoría anterior a partir de un
  changelog) sigue activo hoy.
- CAMBIOS PROPUESTOS: CAMBIO-004 a CAMBIO-010 (nuevos); CAMBIO-001 y CAMBIO-003
  actualizados con evidencia directa; CAMBIO-002 marcado obsoleto/superado. Ver
  `CAMBIOS-ABIERTOS.md`.
- CAMBIOS EJECUTADOS: ninguno sobre producción — ni en n8n, ni en Airtable, ni en
  Gmail. Solo actualización de la documentación de este repositorio.
- CAMBIOS NO EJECUTADOS: todos los CAMBIO-00X quedan pendientes de autorización
  explícita de Dirección (varios ya están "LISTO PARA EJECUTAR" en el sentido de
  que la solución técnica ya existe, solo falta la autorización — en particular
  CAMBIO-004, publicar un fix ya escrito).
- EVIDENCIA: llamadas MCP n8n (`search_workflows`, `search_executions×6`,
  `get_execution×2`, `get_workflow_details×3`) y MCP Gmail (`search_threads`,
  `get_thread×2`), todas con timestamp 2026-08-14. Commits en la rama
  `claude/dcode-partners-changes-governance-tvyk6k`.
- LIMITACIONES: conector Airtable sin bases visibles (0 bases) — ningún dato de
  Airtable se leyó directamente, solo vía nodos n8n y emails automáticos; no se
  auditaron en detalle ~28 de los 38 workflows (bloques `PRD/`, `CLS/`, `SP/`,
  `ADM/`, la mayoría de `FNZ/`); no se contrastaron las cifras agregadas del propio
  Auditor Interno (94 ejecuciones/26 errores en 24h, 38 correos sin clasificar) con
  un recuento independiente completo — se marcan como evidencia indirecta dado que
  ese mismo sistema ya demostró un error de diagnóstico en esta misma auditoría.
- RESULTADO: diagnóstico completo entregado a Dirección con TOP 10 cambios
  priorizados, separados por tipo (técnico/comercial/producto/operativo/
  estratégico), TOP 5 recomendado, "si solo pudiéramos hacer uno", y qué no tocar
  todavía. Ningún cambio ejecutado sin autorización.
