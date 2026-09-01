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

---

## Registro de copias (actualizado 01/09/2026)

| Concepto | Estado real |
|---|---|
| **Snapshot que existe** | `snap-wandering-credit-b28vqsow` — «auditoria-20260901-finance-production» |
| **Qué base protege** | D-Code Finance (`crimson-waterfall-36115744`), rama `production` |
| **Fecha** | 2026-09-01T16:35:35Z |
| **Frecuencia** | **Ninguna: es manual y de una sola vez.** No hay calendario |
| **Retención** | Un snapshot manual de Neon no caduca con la ventana de 6 h: persiste hasta que se borre |
| **D-Code OS** | **Sin ningún snapshot.** Misma exposición, sin cubrir |
| **Cobertura de los backups a Drive** | Airtable únicamente. Ninguna de las dos bases PostgreSQL |

### Cómo se recuperaría

Restaurar en Neon **no sobrescribe**: crea una rama nueva a partir del
snapshot, y solo después se decide si se promociona. Por eso es una operación
segura de ensayar.

1. `list_snapshots(project_id)` — localizar el snapshot por su id.
2. `restore_snapshot(project_id, snapshot_id)` — Neon crea una rama con el
   estado guardado. La rama `production` sigue intacta mientras tanto.
3. Comprobar los datos en la rama nueva con su propia cadena de conexión
   (`get_connection_string`).
4. Solo si los datos son correctos, promocionar con `set_default_branch`, o
   copiar a mano lo que haga falta.

**Lo que no se ha hecho: ensayar la restauración.** Un backup que nunca se ha
restaurado es una hipótesis, no una copia de seguridad — y decir lo contrario
sería exactamente el tipo de afirmación sin verificar que esta auditoría
existe para evitar. El ensayo es seguro (crea una rama aparte, no toca
producción) y debería hacerse antes de darlo por bueno.

---

# LAS TRES ACCIONES PENDIENTES, EXACTAS

Autorizadas por Dirección. Ninguna cuesta dinero, ninguna es destructiva,
todas son reversibles. Requieren el conector de Neon, que a 01/09/2026 está
intermitente: volvió unos segundos y se cayó de nuevo antes de poder aplicarlas.

**No se han inventado alternativas ni se ha modificado la arquitectura.**

### Identificadores verificados en vivo

| Proyecto | `project_id` | Rama `production` | `protected` |
|---|---|---|---|
| D-Code Finance | `crimson-waterfall-36115744` | `br-restless-moon-b2o8o2up` | `false` |
| D-Code OS | `misty-darkness-36213098` | `br-fancy-star-b1bgqwr7` | `false` |

### Acción 1 · Snapshots diarios en D-Code Finance

    set_snapshot_schedule(
      project_id: "crimson-waterfall-36115744",
      branch_id:  "br-restless-moon-b2o8o2up",
      schedule:   [{ frequency: "daily" }]
    )

`frequency` solo admite `daily`, `weekly` o `monthly` — verificado contra la
API, que rechazó `interval`/`max_snapshots` y devolvió los valores válidos.

### Acción 2 · Snapshots diarios en D-Code OS

    set_snapshot_schedule(
      project_id: "misty-darkness-36213098",
      branch_id:  "br-fancy-star-b1bgqwr7",
      schedule:   [{ frequency: "daily" }]
    )

D-Code OS **no tiene ningún snapshot todavía**, así que conviene crear uno
manual además del calendario, igual que se hizo con Finance:

    create_snapshot(
      project_id: "misty-darkness-36213098",
      branch_id:  "br-fancy-star-b1bgqwr7",
      name:       "manual-inicial-dcode-os"
    )

### Acción 3 · Proteger las dos ramas de producción

Hoy las dos están en `protected: false`, lo que significa que se pueden borrar
sin fricción.

    update_branch(project_id: "crimson-waterfall-36115744",
                  branch_id: "br-restless-moon-b2o8o2up", protected: true)

    update_branch(project_id: "misty-darkness-36213098",
                  branch_id: "br-fancy-star-b1bgqwr7",   protected: true)

---

# ENSAYO DE RESTAURACIÓN

Un backup que nunca se ha restaurado es una hipótesis. Esto es el
procedimiento para convertirlo en un hecho **sin tocar producción**.

## Antes de nada: la comprobación que decide si esto es seguro

**No ejecutes `restore_snapshot` sin haber resuelto esto primero.**

No está verificado si en esta versión de la API `restore_snapshot` restaura
**sobre la rama de origen** (destructivo) o **crea una rama nueva** (inocuo).
La diferencia lo es todo, y suponerlo sería exactamente el tipo de afirmación
sin comprobar que esta auditoría existe para evitar.

Cómo resolverlo, en orden de preferencia:

1. **Ensayar sobre una rama que no sea producción.** Finance tiene una rama
   `Demo` (`br-frosty-thunder-b2d3uxhi`) y D-Code OS tiene dos ramas viejas de
   trabajo. Crear un snapshot de una de ellas, restaurarlo, y observar qué
   ocurre. Si la restauración es en sitio, el daño se queda en una rama
   prescindible. **Esta es la vía recomendada.**
2. Consultar la documentación de Neon para la versión de API en uso.
3. Si tras 1 y 2 sigue habiendo duda, no ejecutarlo y decirlo.

## Qué se restaura, y dónde

- **Qué:** el snapshot `snap-wandering-credit-b28vqsow` («auditoria-20260901-finance-production», 2026-09-01T16:35:35Z).
- **Dónde:** en una **rama nueva y desechable**, nunca sobre `production`.
- **Qué NO se toca:** la rama `production` de ninguno de los dos proyectos, y
  ningún dato de negocio.

## Pasos

1. `list_snapshots(project_id: "crimson-waterfall-36115744")` — confirmar que
   el snapshot sigue ahí y anotar su id.
2. Resolver la comprobación de arriba.
3. Restaurar a una rama nueva, con un nombre que diga lo que es:
   `ensayo-restauracion-YYYYMMDD`.
4. `get_connection_string` de **esa rama**, no de producción.
5. Ejecutar la verificación (abajo) contra la rama restaurada.
6. `delete_branch` de la rama de ensayo. Es lo único que se borra, y es algo
   que se acaba de crear.

## Cómo se verifica, y qué evidencia sirve

`scripts/verificar-restauracion.sql`, de solo lectura, se ejecuta **dos veces**:
primero contra producción para tomar la referencia, después contra la rama
restaurada.

    psql "$URL_PRODUCCION"  -f scripts/verificar-restauracion.sql > /tmp/ref-produccion.txt
    psql "$URL_RESTAURADA"  -f scripts/verificar-restauracion.sql > /tmp/ensayo-restauracion.txt
    diff /tmp/ref-produccion.txt /tmp/ensayo-restauracion.txt

Comprueba seis cosas que pueden fallar por separado: número de tablas, última
migración de Prisma, filas por tabla crítica, el dato más reciente de cada
tabla, integridad referencial y la presencia de las columnas del sistema de
cierre.

**La evidencia que demuestra que funcionó** son cuatro hechos, no una
impresión:

1. El bloque 1 da el **mismo número de tablas** que producción.
2. El bloque 2 muestra la **misma última migración**.
3. El bloque 5 devuelve **cero huérfanos** en las dos consultas.
4. El bloque 4 da fechas **coherentes con el momento del snapshot** — nunca
   posteriores.

Las diferencias del bloque 3 (número de filas) **no son un fallo**: son la
medida exacta de lo que se perdería al restaurar. Ese número es la respuesta
real a «cuánto margen tenemos», y conviene anotarlo.

Guardar los dos ficheros y el `diff` como prueba del ensayo.
