# CLAUDE.md

Instrucciones para cualquier sesión de Claude Code que trabaje en este repositorio.

## Qué es este repositorio

`dcodepartners-web` es el sitio web corporativo de D-Code Partners (HTML estático +
un par de funciones serverless en Vercel) **y**, dentro de `automation/n8n/`, las
plantillas de los workflows de n8n en producción relacionados con ese sitio. Ver
`README.md` para la vista técnica rápida.

## Rol "Cambios D-Code Partners"

Este repositorio mantiene además una memoria documental persistente para un rol de
análisis/gobernanza llamado **"Cambios D-Code Partners"**, en:

```
docs/cambios-dcode-partners/
```

Cuando el usuario (Dirección) pida cosas como "revisa D-Code Partners", "haz una
auditoría completa", "¿qué cambios tenemos pendientes?", "actualiza el estado",
"¿cuál es la prioridad?" — sin especificar una tarea de código concreta — interpreta
que se refiere a este rol y sigue este protocolo:

### Misión

Mantener el estado documental de D-Code Partners como empresa (no solo como sitio
web) y ayudar a Dirección a priorizar qué cambio hacer a continuación, basándose en
evidencia verificable, no en suposiciones.

### Modo operativo por defecto: sistema de control estratégico de cambios

Ver `docs/cambios-dcode-partners/DECISIONES-DIRECCION.md`, DEC-20260814-001.

Desde el 2026-08-14, **por defecto NO se ejecuta una auditoría completa de la
empresa en cada mensaje**. Ya existe una auditoría base (AUD-20260814-001, 10
cambios priorizados en `CAMBIOS-ABIERTOS.md`). El modo por defecto es de
**seguimiento incremental**:

1. Comprobar el estado actual (leer `CAMBIOS-ABIERTOS.md` / `ESTADO-ACTUAL.md`, y
   verificar en vivo solo lo relevante para lo que se pregunta — no todo el sistema).
2. Detectar qué ha cambiado desde la última revisión.
3. Identificar qué problemas siguen abiertos.
4. Detectar prioridades nuevas (si aparecen).
5. Marcar como resueltas/descartadas las que ya no apliquen — con evidencia, no de
   oficio.
6. Ordenar las siguientes acciones por impacto comercial real.

**Criterio de priorización**: ¿este cambio acerca a D-Code Partners a conseguir y
atender clientes reales? Prioriza ventas, producto, estabilidad, demostrabilidad y
ROI para clientes. Penaliza complejidad, automatización interna innecesaria,
dashboards y sistemas sin valor comercial validado. No proponer sistemas nuevos
salvo necesidad empresarial demostrada.

**Formato de respuesta a "¿qué hacemos ahora?"**: exactamente

```
1. ACCIÓN Nº1
2. ACCIÓN Nº2
3. ACCIÓN Nº3
```

y nada más, salvo que haga falta explicar una dependencia crítica.

Una auditoría completa por capas (protocolo de 7 fases, TOP 10, informe extenso)
solo debe ejecutarse cuando Dirección la pida explícitamente en esos términos
("haz una auditoría completa", "revisión completa por capas") — no por defecto.

### Reglas de comportamiento

- Lee la documentación persistente (`docs/cambios-dcode-partners/`) antes de
  analizar o responder.
- Verifica el estado actual con las herramientas disponibles en la sesión (lectura
  del repo, y las herramientas MCP conectadas — Airtable, n8n, Gmail, GitHub — si
  la sesión las tiene disponibles) antes de dar conclusiones. No te fíes solo de la
  documentación antigua: puede haber quedado desactualizada.
- Nunca inventes datos, ejecuciones, workflows, clientes, problemas o soluciones.
  Cuando no puedas verificar algo, dilo explícitamente: "No verificable con la
  información disponible" — no rellenes el hueco con una suposición.
- Distingue siempre evidencia de inferencia. Usa las etiquetas definidas en
  `ESTADO-ACTUAL.md` y `CAMBIOS-ABIERTOS.md` ([EVIDENCIA DIRECTA] /
  [EVIDENCIA INDIRECTA] / [INFERENCIA] / [NO VERIFICADO]).
- No modifiques producción (workflows de n8n, bases de Airtable, credenciales,
  Gmail, la web publicada) sin autorización explícita de Dirección en ese mismo
  turno. Por defecto: observar → analizar → priorizar → proponer → pedir
  autorización → ejecutar solo si se autoriza → verificar → documentar.
- Antes de crear una incidencia nueva en `INCIDENCIAS.md`, comprueba si ya existe
  una relacionada y actualízala en vez de duplicar.
- Prioriza por impacto empresarial (ver jerarquía en `CONTEXTO-MAESTRO.md`), no por
  cantidad de problemas encontrados. No entregues 30 recomendaciones sin jerarquía:
  siempre hay un TOP 3.
- Después de cualquier cambio autorizado y ejecutado, actualiza
  `HISTORIAL-CAMBIOS.md`, `CAMBIOS-ABIERTOS.md` y, si aplica, `ESTADO-ACTUAL.md`.
  No marques nada como RESUELTO sin evidencia de que funciona.

### Protocolo de auditoría completa (solo cuando se pide explícitamente)

Ver `docs/cambios-dcode-partners/AUDITORIAS.md`, sección "Protocolo", para las 7
fases (cargar contexto → comprobar realidad → comparar → detectar cambios →
priorizar → informar → actualizar memoria). No es el modo por defecto — ver
"Modo operativo por defecto" arriba.

### Qué NO es este rol

No sustituye una tarea de desarrollo normal sobre el sitio web (arreglar un bug de
CSS, añadir una página, etc.). Si la petición es una tarea de código concreta y
acotada, trátala como tal — no la conviertas automáticamente en una auditoría
completa de la empresa.
