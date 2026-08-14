# DECISIONES DE DIRECCIÓN — D-Code Partners

> Registro de decisiones estratégicas tomadas por Dirección. Una decisión no debe
> perderse simplemente porque cambie de sesión de Claude Code. Este archivo es la
> fuente de verdad para "¿ya decidimos esto o no?".

Última actualización: 2026-08-14.

Plantilla de cada decisión:

```
DECISIÓN:
FECHA:
MOTIVO:
CONTEXTO:
OPCIONES CONSIDERADAS:
DECISIÓN FINAL:
IMPACTO:
SISTEMAS AFECTADOS:
ESTADO:
```

## Decisiones registradas

### DEC-20260814-001 — Cambio de modo operativo: de "auditor completo" a "sistema de control estratégico de cambios"

- DECISIÓN: a partir de CAM-20260814-002, el rol "Cambios D-Code Partners" deja de
  ejecutar una auditoría completa de la empresa en cada mensaje. Pasa a operar como
  sistema de control estratégico: comprobar estado actual → detectar qué cambió →
  qué sigue abierto → qué prioridades son nuevas → qué prioridades ya se resolvieron
  → ordenar próximas acciones por impacto.
- FECHA: 2026-08-14.
- MOTIVO: Dirección ya revisó el TOP 10 de la auditoría AUD-20260814-001 y quiere
  evitar dispersión — no más hallazgos nuevos por defecto, sino seguimiento de los
  ya identificados.
- CONTEXTO: primera auditoría completa (AUD-20260814-001) entregó 10 cambios
  priorizados; Dirección los revisó y pide pasar a modo seguimiento.
- OPCIONES CONSIDERADAS: (a) seguir auditando la empresa entera en cada turno; (b)
  pasar a un modo de control incremental centrado en lo ya abierto en
  `CAMBIOS-ABIERTOS.md`.
- DECISIÓN FINAL: opción (b).
- CRITERIO DE PRIORIZACIÓN a partir de ahora: ¿este cambio acerca a D-Code Partners
  a conseguir y atender clientes reales? Prioriza ventas, producto, estabilidad,
  demostrabilidad y ROI para clientes. Penaliza complejidad, automatización interna
  innecesaria, dashboards y sistemas sin valor comercial validado. No proponer
  sistemas nuevos salvo necesidad empresarial demostrada.
- FORMATO DE RESPUESTA por defecto a "¿qué hacemos ahora?": exactamente 3 acciones
  numeradas por impacto, sin desarrollo adicional salvo que haya una dependencia
  crítica que deba explicarse.
- IMPACTO: cambia el comportamiento por defecto de este rol en todas las sesiones
  futuras de este repositorio (reflejado en `CLAUDE.md`).
- SISTEMAS AFECTADOS: ninguno de producción — solo el propio comportamiento del rol
  "Cambios D-Code Partners".
- ESTADO: VIGENTE.

Decisiones pendientes ya identificadas por el análisis de `CAMBIOS-ABIERTOS.md` que
requieren que Dirección se pronuncie:

- CAMBIO-003: ¿el seguimiento comercial manual tras la creación del lead en
  Airtable es una decisión deliberada, o se considera un hueco a resolver?
- CAMBIO-007: ¿qué debe pasar con una empresa HOT/WARM del Radar Comercial?
  (¿contacto manual, propuesta automática, o nada todavía?)
- CAMBIO-002 (obsoleto desde 2026-08-14, ver `CAMBIOS-ABIERTOS.md`): ya no requiere
  decisión de Dirección en su forma original — el calendario fijo de LinkedIn fue
  sustituido por "MK/Contenido IA Redes Sociales". Puede quedar una decisión nueva
  pendiente sobre ese sistema, no verificada todavía.
