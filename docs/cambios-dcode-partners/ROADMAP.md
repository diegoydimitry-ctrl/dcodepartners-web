# ROADMAP — D-Code Partners

> No es una lista de ideas sin orden. Clasifica por prioridad y respeta
> dependencias: no tiene sentido priorizar un eslabón final de una cadena si el
> primero todavía no existe o no está verificado.

Última actualización: 2026-08-08.

## Clasificación

- **P0 — BLOQUEO CRÍTICO**: puede bloquear ingresos, perder clientes/datos, romper
  producción.
- **P1 — IMPACTO ALTO**: afecta directamente ventas, generación de leads,
  automatización o comunicación.
- **P2 — IMPORTANTE**: mejora eficiencia, organización, calidad, escalabilidad.
- **P3 — MEJORA**: optimización secundaria.
- **P4 — FUTURO**: ideas que no deben abordarse todavía.

## Estado actual del roadmap

Esta primera versión se deriva directamente de `CAMBIOS-ABIERTOS.md`. No se han
añadido ítems especulativos sin evidencia.

### P0 — Bloqueo crítico

Ninguno identificado con evidencia directa en esta pasada. (No confundir con "no
existe" — significa que esta sesión, con acceso de solo lectura al repositorio, no
encontró evidencia de un bloqueo crítico ya confirmado. CAMBIO-001 podría escalar a
P0 si se confirma que el webhook de leads está realmente caído.)

### P1 — Impacto alto

1. **CAMBIO-001** — Verificar que el workflow Lead IA 360 está activo y que la URL
   del webhook en el sitio coincide con la real. Dependencia: ninguna. Es la base de
   todo lo demás en la cadena comercial — sin esto verificado, cualquier prioridad
   comercial posterior es prematura.
2. **CAMBIO-003** — Decidir si el seguimiento comercial manual post-lead es
   suficiente o es un cuello de botella. Dependencia: CAMBIO-001 (verificar primero
   que los leads llegan).

### P2 — Importante

1. **CAMBIO-002** — Decidir la continuidad del calendario de LinkedIn más allá del
   28 de agosto de 2026. Dependencia: ninguna, pero tiene fecha límite natural.

### P3 — Mejora

Ninguno identificado todavía con evidencia suficiente.

### P4 — Futuro / no hacer todavía

- Cualquier automatización nueva sobre el proceso comercial (propuestas, emails de
  seguimiento automáticos) — bloqueado hasta que CAMBIO-001 y CAMBIO-003 estén
  resueltos. Automatizar un proceso comercial que todavía no está verificado ni
  decidido es exactamente el tipo de "reconstrucción prematura" que este rol debe
  evitar (ver `CONTEXTO-MAESTRO.md`, sección 6).
- Cualquier "Radar Comercial IA" o paso HOT/WARM previo al lead — no hay evidencia
  de que exista una base sobre la que construir esto en este repositorio; primero
  hay que confirmar con Dirección si ya existe en otro sistema.

## Cadena comercial conocida (para referencia de dependencias futuras)

```
Formulario web (/contacto)
   ↓ [EVIDENCIA DIRECTA]
Webhook n8n "Lead IA 360"
   ↓ [EVIDENCIA DIRECTA]
Airtable (tabla Leads, upsert por email)
   ↓ [EVIDENCIA DIRECTA]
Análisis Gemini (score, prioridad, urgencia) → vuelve a escribir en Airtable
   ↓ [EVIDENCIA DIRECTA]
Email de confirmación al lead + alerta interna si prioridad alta (Gmail)
   ↓ [NO VERIFICADO — hueco documentado]
Seguimiento comercial (manual, campos en blanco para completar a mano)
   ↓ [NO VERIFICADO]
¿Propuesta? ¿Reunión? ¿Cierre? ¿Cobro?
```

Cualquier propuesta de automatizar un eslabón debe indicar explícitamente en qué
punto de esta cadena actúa y qué eslabones previos da por sentado que ya funcionan.
