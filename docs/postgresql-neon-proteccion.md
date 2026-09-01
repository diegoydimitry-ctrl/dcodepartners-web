# PostgreSQL / Neon — protección y recuperación

Investigado el 1 de septiembre de 2026. **El conector de Neon se desconectó a
mitad del trabajo**, así que este documento distingue con precisión lo que
quedó verificado y hecho de lo que quedó preparado y sin aplicar.

## Lo que se comprobó (y corrige el informe anterior)

**No es una base de datos, son dos**, y las dos con el mismo riesgo:

| Proyecto | ID | Retención | Plan | Tamaño |
|---|---|---|---|---|
| **D-Code Finance** | `crimson-waterfall-36115744` | **6 h** (`21600 s`) | free | 34,3 MB |
| **D-Code OS** | `misty-darkness-36213098` | **6 h** (`21600 s`) | free | 33,2 MB |

El informe anterior señalaba solo Finance. **D-Code OS está igual de expuesta**,
y es la que guarda `automation_runs` y las incidencias: el registro con el que
el sistema demuestra que algo se arregló.

Otros datos verificados:

- Organización: `org-weathered-glitter-05148043`, plan **free**.
- Finance tiene dos ramas: `production` (primaria) y `Demo`.
- La rama `production` de Finance está con **`protected: false`**.
- No había **ningún** snapshot ni calendario de snapshots en Finance.

## Lo que ya está hecho

**Existe un snapshot real de D-Code Finance**, creado y confirmado por la API:

    id:     snap-wandering-credit-b28vqsow
    nombre: auditoria-20260901-finance-production
    rama:   br-restless-moon-b2o8o2up (production)
    creado: 2026-09-01T16:35:35Z

No es un plan: es un punto de restauración que existe y que **no caduca a las
seis horas**. Antes de esto, cualquier daño detectado con más de seis horas de
retraso era irrecuperable por definición.

**Y el hallazgo que más cambia las cosas: los snapshots FUNCIONAN en el plan
gratuito.** Se creía que proteger estas bases exigía pagar. No es cierto —
está demostrado por el snapshot de arriba.

## Lo que quedó preparado y no aplicado

Al intentar programar snapshots automáticos, la API rechazó el formato y
devolvió los valores válidos; el conector se cayó antes del segundo intento.
El formato correcto es:

    set_snapshot_schedule(
      project_id: "crimson-waterfall-36115744",
      branch_id:  "br-restless-moon-b2o8o2up",
      schedule:   [{ frequency: "daily" }]      // daily | weekly | monthly
    )

**Acción mínima necesaria** (tres pasos, ninguno destructivo):

1. Programar snapshots **diarios** en `production` de **D-Code Finance**.
2. Lo mismo en **D-Code OS** (`misty-darkness-36213098`), que tiene el mismo
   riesgo y no estaba en el informe anterior.
3. Marcar como **protegida** la rama `production` de las dos. Hoy está en
   `protected: false`, lo que significa que se puede borrar sin fricción.

## Por qué no se pudo hacer un backup por otra vía

Se comprobó: **n8n no tiene ninguna credencial de PostgreSQL**. Diecisiete
credenciales configuradas y ni una de base de datos. Por eso no se puede
construir un `ADM/Backup PostgreSQL` al estilo de `ADM/Backup RRSS` sin que
alguien cree antes esa credencial.

Y conviene decirlo claro: **los backups que existen hoy respaldan Airtable, no
PostgreSQL.** `ADM/Backup RRSS`, `ADM/Copias de Seguridad`, `ADM/Backup
Workflows n8n` y `ADM/Backup AI Factory` no cubren ni Finance ni D-Code OS.

Si se prefiere no depender solo de Neon, la alternativa es un volcado semanal a
Drive siguiendo el patrón que ya funciona en `ADM/Backup RRSS` —con su
verificación de cobertura y su prefijo PARCIAL—. Las bases pesan ~34 MB cada
una, así que es perfectamente viable. Requiere: crear una credencial Postgres
en n8n con la cadena de conexión de cada proyecto.

## Qué significa cada opción, en una frase

- **Snapshots programados (gratis, recomendado):** convierte «se pierde todo lo
  anterior a hace seis horas» en «se pierde como mucho un día».
- **Rama protegida (gratis):** impide el borrado accidental de producción.
- **Volcado a Drive (gratis, hay que construirlo):** una copia fuera de Neon,
  por si el problema es la propia cuenta de Neon.
- **Ampliar la retención (de pago):** recuperación a cualquier punto en el
  tiempo, no solo a los snapshots. Es la única que cuesta dinero y la única
  que decide Dirección.
