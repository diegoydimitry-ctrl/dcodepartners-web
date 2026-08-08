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
