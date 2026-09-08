-- ============================================================================
-- EVIDENCIA DE QUE UNA RESTAURACION HA FUNCIONADO
--
-- Se ejecuta DOS veces: primero contra produccion (para tomar la referencia)
-- y despues contra la rama restaurada. Las dos salidas se comparan.
--
-- Es de SOLO LECTURA. No modifica nada. Se puede ejecutar contra produccion
-- sin ningun riesgo.
--
-- POR QUE ESTAS CONSULTAS Y NO OTRAS: no basta con que la base "responda".
-- Una restauracion puede dejar el esquema bien y los datos a medias, o los
-- datos bien y las migraciones descuadradas. Cada bloque comprueba una cosa
-- distinta que puede fallar por separado.
-- ============================================================================

\echo '=== 1. ESQUEMA: cuantas tablas hay ==='
-- Si este numero no coincide, la restauracion trajo un esquema distinto y
-- nada de lo que siga tiene valor.
SELECT count(*) AS tablas_publicas
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

\echo '=== 2. MIGRACIONES: la ultima aplicada ==='
-- Prisma lleva su propio registro. Si la ultima migracion no coincide, la
-- copia es de otro momento del esquema, aunque las tablas cuadren.
SELECT migration_name, finished_at
FROM _prisma_migrations
WHERE finished_at IS NOT NULL
ORDER BY finished_at DESC
LIMIT 3;

\echo '=== 3. VOLUMEN: filas por tabla critica ==='
-- El numero de filas es la comprobacion mas directa de "estan los datos".
-- Se cuentan las tablas que sostienen el negocio y el sistema de incidencias.
SELECT 'organizations' AS tabla, count(*) AS filas FROM organizations
UNION ALL SELECT 'users',           count(*) FROM users
UNION ALL SELECT 'incidents',       count(*) FROM incidents
UNION ALL SELECT 'automation_runs', count(*) FROM automation_runs
UNION ALL SELECT 'tasks',           count(*) FROM tasks
ORDER BY tabla;

\echo '=== 4. FRONTERA TEMPORAL: el dato mas reciente de cada tabla ==='
-- Esto es lo que revela CUANTO se perderia al restaurar. Si el registro mas
-- reciente de la copia es de hace tres dias, restaurar cuesta tres dias de
-- trabajo: ese numero es la respuesta real a "cuanto margen tenemos".
SELECT 'incidents' AS tabla, max("createdAt") AS mas_reciente FROM incidents
UNION ALL SELECT 'automation_runs', max("startedAt") FROM automation_runs
UNION ALL SELECT 'tasks',           max("createdAt") FROM tasks
ORDER BY tabla;

\echo '=== 5. INTEGRIDAD REFERENCIAL: huerfanos ==='
-- Una restauracion parcial puede dejar filas apuntando a padres que ya no
-- existen. Las tres consultas deben devolver 0.
SELECT count(*) AS incidencias_sin_organizacion
FROM incidents i LEFT JOIN organizations o ON o.id = i."organizationId"
WHERE o.id IS NULL;

SELECT count(*) AS usuarios_sin_organizacion
FROM users u LEFT JOIN organizations o ON o.id = u."organizationId"
WHERE o.id IS NULL;

\echo '=== 6. EL SISTEMA DE CIERRE, INTACTO ==='
-- Comprueba que las columnas anadidas el 01/09/2026 existen en la copia:
-- si la restauracion es anterior a esa migracion, faltarian.
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'incidents'
  AND column_name IN ('source','problemStartedAt','recoveryExecutionId','closureMechanism','recoveredAt','streakAtOpen')
ORDER BY column_name;
