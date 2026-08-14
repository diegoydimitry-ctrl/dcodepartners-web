# ROADMAP — D-Code Partners

> No es una lista de ideas sin orden. Clasifica por prioridad y respeta
> dependencias: no tiene sentido priorizar un eslabón final de una cadena si el
> primero todavía no existe o no está verificado.

Última actualización: 2026-08-14 (auditoría AUD-20260814-001, con acceso en vivo a
n8n y Gmail).

## Clasificación

- **P0 — BLOQUEO CRÍTICO**: puede bloquear ingresos, perder clientes/datos, romper
  producción.
- **P1 — IMPACTO ALTO**: afecta directamente ventas, generación de leads,
  automatización o comunicación.
- **P2 — IMPORTANTE**: mejora eficiencia, organización, calidad, escalabilidad.
- **P3 — MEJORA**: optimización secundaria.
- **P4 — FUTURO**: ideas que no deben abordarse todavía.

## Estado actual del roadmap

Actualizado con evidencia directa de n8n/Gmail en vivo (auditoría
AUD-20260814-001). Ver `AUDITORIAS.md` para el detalle completo y
`CAMBIOS-ABIERTOS.md` para cada cambio.

### P0 — Bloqueo crítico

1. **CAMBIO-001** — Confirmar por qué "MK/Lead IA 360" nunca se ha ejecutado (0
   ejecuciones en 12 días) y el origen real de los 13 leads que muestra Airtable.
   Dependencia: ninguna. Es la base de toda la cadena comercial.
2. **CAMBIO-004** — Publicar el fix ya escrito de "CM/Detección de Respuestas"
   (145 errores históricos, fix sin publicar). Dependencia: ninguna.
3. **CAMBIO-005** — Renovar la credencial Airtable rota de "CM/Seguimiento
   Comercial IA" (7/7 días fallando). Dependencia: ninguna.

### P1 — Impacto alto

1. **CAMBIO-008** — Congelar nueva automatización hasta resolver los tres P0.
   Dependencia: ninguna (decisión inmediata).
2. **CAMBIO-006** — Corregir el diagnóstico erróneo del Auditor Interno (culpa al
   workflow equivocado). Dependencia: ninguna.
3. **CAMBIO-007** — Cerrar el hueco Radar Comercial (HOT/WARM) → acción comercial
   real. Dependencia: CAMBIO-001, CAMBIO-004, CAMBIO-005.
4. **CAMBIO-003** — Decidir si el resto del proceso comercial post-lead debe seguir
   siendo manual. Dependencia: CAMBIO-001, CAMBIO-004, CAMBIO-005.

### P2 — Importante

1. **CAMBIO-009** — Resolver la saturación de correo sin clasificar (38 sin
   clasificar). Dependencia: ninguna.

### P3 — Mejora

1. **CAMBIO-010** — Decidir el destino del workflow "AI Factory Orchestrator"
   inactivo. Dependencia: ninguna.

### P4 — Futuro / no hacer todavía

- Decidir si el "D-Code AI Factory" (la capa interna de Executive Board) es un
  producto vendible a clientes — prematuro mientras la base comercial esté rota
  (ver CAMBIO-008 y sección "NO HACER TODAVÍA" del informe de la auditoría
  AUD-20260814-001).
- Cualquier automatización de contacto comercial saliente sobre el Radar
  (propuestas automáticas, emails a HOT/WARM) sin que Dirección decida antes el
  proceso correcto (CAMBIO-007) — riesgo de dañar reputación con negocios reales.
- Activar "FNZ/Facturación IA" — coherente dejarlo así mientras haya 0 clientes
  activos.

## Cadena comercial conocida (actualizada con lo verificado en vivo)

```
Formulario web (/contacto)
   ↓ [EVIDENCIA DIRECTA — pero 0 ejecuciones registradas, ver CAMBIO-001]
Webhook n8n "MK/Lead IA 360"
   ↓
Airtable (tabla Leads, upsert por email) — [EVIDENCIA INDIRECTA] 13 leads según informe interno
   ↓
Análisis Gemini (score, prioridad, urgencia) → vuelve a escribir en Airtable
   ↓
Email de confirmación al lead + alerta interna si prioridad alta (Gmail)
   ↓
CM/Seguimiento Comercial IA (día 3/7/14) — [ROTO, CAMBIO-005, 7/7 días fallando]
   ↓
CM/Detección de Respuestas — [ROTO, CAMBIO-004, fix sin publicar]
   ↓
¿Propuesta? ¿Reunión? ¿Cierre? ¿Cobro? — [NO VERIFICADO, sin automatización
   conocida entre "lead respondió" y "propuesta enviada"]
```

```
AAA/Radar Comercial IA (diario, 0 errores) → genera HOT/WARM
   ↓
CM/CRM Inteligente (semanal, 1 sola ejecución en 12 días — CAMBIO-007)
   ↓
Tabla Clientes (como prospecto)
   ↓
¿Contacto comercial? ¿Propuesta? — [NO VERIFICADO, sin automatización conocida]
```

Son dos cadenas de entrada distintas (formulario web vs. prospección activa por
Radar) que convergen, en teoría, en el mismo proceso comercial posterior — pero ese
proceso posterior no está confirmado en ninguna de las dos. Cualquier propuesta de
automatizar un eslabón debe indicar explícitamente en qué punto de estas cadenas
actúa y qué eslabones previos da por sentado que ya funcionan.
