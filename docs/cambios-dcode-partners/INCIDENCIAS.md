# INCIDENCIAS — D-Code Partners

> Registro central de incidencias. Antes de crear una nueva, comprobar si ya existe
> una relacionada y actualizarla en vez de duplicar. Categorías: BUG · FALTA DE
> IMPLEMENTACIÓN · CONFIGURACIÓN INCORRECTA · CREDENCIAL · DESPLIEGUE · DISEÑO ·
> DEPENDENCIA · ERROR HUMANO · DATOS · INTEGRACIÓN · GOBERNANZA · DESCONOCIDO

Última actualización: 2026-08-14 (auditoría AUD-20260814-001, con acceso en vivo).

## Incidencias activas

### INC-20260814-001

- Categoría: DESPLIEGUE / GOBERNANZA
- Área: Comercial / n8n
- Fecha de detección: 2026-08-14
- Descripción: "CM/Detección de Respuestas - Seguimiento Comercial IA" falla en
  casi el 100% de sus ejecuciones desde al menos el 8 de agosto (145 errores
  históricos). Causa confirmada: el editor de n8n contiene un fix ya escrito para
  el nodo "Filtrar Autorrespuestas y OOO" que nunca se publicó a producción.
- Evidencia: [EVIDENCIA DIRECTA] traza de error completa vía `get_execution`
  (n8n MCP); comparación código borrador vs. código activo del mismo workflow.
- ¿Relacionada con incidencia existente?: sí — es una **recurrencia exacta** del
  patrón sistémico documentado más abajo (fix hecho, no publicado).
- Impacto: la secuencia automática de seguimiento sigue escribiendo a leads que ya
  respondieron.
- Estado: PENDIENTE DE AUTORIZACIÓN PARA PUBLICAR (ver CAMBIO-004 en
  `CAMBIOS-ABIERTOS.md`).
- Responsable: quien tenga acceso de publicación en n8n.

### INC-20260814-002

- Categoría: CREDENCIAL
- Área: Comercial / n8n / Airtable
- Fecha de detección: 2026-08-14
- Descripción: "CM/Seguimiento Comercial IA" falla cada día a las 06:30 desde el 8
  de agosto (7/7 días) con `401 Invalid authentication token` sobre la credencial
  Airtable "Airtable Personal Access Token account" (`OrGjGOCyB2b3E2s5`).
- Evidencia: [EVIDENCIA DIRECTA] traza de error vía `get_execution` (n8n MCP).
- ¿Relacionada con incidencia existente?: no, es una causa distinta a INC-001
  (credencial vs. código), aunque ambas incidencias rompen la misma función de
  negocio (seguimiento comercial automático).
- Impacto: los emails de seguimiento a 3/7/14 días no se han enviado en una semana.
- Estado: PENDIENTE DE AUTORIZACIÓN PARA REGENERAR CREDENCIAL (ver CAMBIO-005).
- Responsable: administrador de la cuenta Airtable/n8n.

### INC-20260814-003

- Categoría: GOBERNANZA / DATOS
- Área: Comercial / Auditoría interna
- Fecha de detección: 2026-08-14
- Descripción: el propio "DIR/Executive Board - Auditor Interno" diagnosticó mal la
  causa raíz de los errores del día, señalando a un workflow (`GZ3w0M3oLzZzgceB`)
  que tiene 0 errores confirmados, en vez del que realmente concentra el 97% de los
  errores del periodo (`ujkXnsEtzySHr00l`, ver INC-001).
- Evidencia: [EVIDENCIA DIRECTA] `search_executions` filtrado por workflow y
  estado, 2026-08-14.
- ¿Relacionada con incidencia existente?: no.
- Impacto: riesgo de que se actúe sobre el workflow equivocado si no se contrasta.
- Estado: PENDIENTE (ver CAMBIO-006).
- Responsable: equipo técnico (n8n).

## Incidencias históricas (extraídas del changelog del workflow Lead IA 360)

Estas ya están **resueltas según su propia documentación** — se listan aquí no como
trabajo pendiente, sino como base para el patrón sistémico de abajo. [EVIDENCIA
DIRECTA: `automation/n8n/lead-ia-360/README.md`]

| Versión | Categoría | Resumen |
|---|---|---|
| v9 | DESPLIEGUE / CREDENCIAL | Webhook de producción apuntaba a una cuenta n8n abandonada — cero ejecuciones hasta detectarlo. |
| v9 | CONFIGURACIÓN INCORRECTA | Campo `message` de los nodos Gmail sin prefijo `=`, habría enviado placeholders literales en vez de datos reales. |
| v9 | CONFIGURACIÓN INCORRECTA | Nodo Airtable "Crear o Actualizar Lead" perdió Base/Tabla/columnas, probablemente al navegar manualmente en el editor. |
| v8 | DISEÑO | Nodo sin manejo de errores (`onError`) rompía toda la ejecución antes de llegar a "Respond to Webhook" → 500 genérico sin información real del fallo. |
| v6 | DATOS | El esquema de Airtable documentado no coincidía con el esquema real de la tabla del cliente. |
| v3 | CONFIGURACIÓN INCORRECTA | Uso de `$env` en vez de `$vars`, incompatible con n8n Cloud multi-tenant / bloqueado en nodos Code. |

## Patrón sistémico detectado

**PATRÓN SISTÉMICO: gobernanza de despliegue / configuración tras edición manual en
el editor de n8n.**

Cuatro de las seis incidencias históricas (v9 ×2, v8, v6) comparten una causa raíz
común: cambios hechos directamente en el editor visual de n8n (reconexión de
cuenta, remapeo de columnas, navegación manual) rompieron algo que no era visible
hasta una verificación explícita contra la instancia real. Esto no es un bug
puntual del workflow — es un riesgo estructural de cualquier workflow n8n mientras
no exista una checklist de verificación post-edición o un monitoreo de ejecuciones
fallidas.

Esto es una observación basada en el propio changelog documentado por versiones
anteriores del workflow (no inventada), pero la causalidad exacta ("por qué sigue
pasando") es [INFERENCIA] — no se ha confirmado con Dirección si existe o no un
proceso de verificación post-cambio.

**Confirmación en vivo (2026-08-14, INC-20260814-001):** el patrón se ha repetido,
esta vez verificado directamente contra la instancia real de n8n, no solo leído en
un changelog: existe un fix ya escrito para "CM/Detección de Respuestas" que nunca
se publicó, y ha estado fallando en producción durante al menos 6 días. Esto sube la
confianza en la causalidad de [INFERENCIA] a [EVIDENCIA DIRECTA] — el patrón
sistémico es real y sigue activo, no es solo una lectura del pasado.

**Recomendación derivada** (propuesta, no ejecutada): antes de dar por buena
cualquier edición manual futura en n8n (reconexión de credenciales, remapeo de
campos), verificar con una ejecución de prueba real y revisar `n8n → Executions`
antes de considerar el cambio terminado. Esto es una propuesta de proceso, no una
automatización — no se recomienda automatizar la verificación todavía sin validar
primero que este proceso manual de verificación se sigue de forma consistente.

## Plantilla de incidencia nueva

```
ID:
Categoría:
Área:
Fecha de detección:
Descripción:
Evidencia:
¿Relacionada con incidencia existente?:
Impacto:
Estado:
Responsable:
```
