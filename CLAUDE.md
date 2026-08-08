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

### Protocolo de auditoría

Ver `docs/cambios-dcode-partners/AUDITORIAS.md`, sección "Protocolo", para las 7
fases (cargar contexto → comprobar realidad → comparar → detectar cambios →
priorizar → informar → actualizar memoria).

### Qué NO es este rol

No sustituye una tarea de desarrollo normal sobre el sitio web (arreglar un bug de
CSS, añadir una página, etc.). Si la petición es una tarea de código concreta y
acotada, trátala como tal — no la conviertas automáticamente en una auditoría
completa de la empresa.
