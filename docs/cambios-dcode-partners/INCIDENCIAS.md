# INCIDENCIAS — D-Code Partners

> Registro central de incidencias. Antes de crear una nueva, comprobar si ya existe
> una relacionada y actualizarla en vez de duplicar. Categorías: BUG · FALTA DE
> IMPLEMENTACIÓN · CONFIGURACIÓN INCORRECTA · CREDENCIAL · DESPLIEGUE · DISEÑO ·
> DEPENDENCIA · ERROR HUMANO · DATOS · INTEGRACIÓN · GOBERNANZA · DESCONOCIDO

Última actualización: 2026-08-08.

## Incidencias activas

Ninguna incidencia activa registrada todavía en este sistema documental — las
observaciones de esta primera pasada están en `CAMBIOS-ABIERTOS.md` como cambios
propuestos, no como incidencias confirmadas en vivo (requieren verificación con
herramientas conectadas a n8n/Airtable/Gmail antes de clasificarse como incidencia
real).

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
