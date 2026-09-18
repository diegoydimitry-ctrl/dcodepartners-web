# Migración de la tabla «Leads» real (ADITIVA) — PENDIENTE DE APROBACIÓN

**No se ha aplicado.** La tabla real (`app5JfVEjK4JiMXEm / tblfQXOCLlEf9cJUa`) no se ha tocado.
Todo lo de abajo está ya creado y probado en la base de PRUEBAS
`appwMWJvQPpu0Ypvg` («D-Code · Leads PRUEBAS (Google Ads Fase 0) — NO PRODUCCIÓN»).

## Qué cambia y qué no

- **No** se renombra, borra ni cambia de tipo ninguna columna existente.
- **No** se cambian las opciones de «Estado». El embudo nuevo vive en «Etapa embudo».
- En «Fuente» hay que añadir la opción `google_ads` (el código escribe con typecast; si se prefiere, crearla antes a mano).
- «Sector»: el formulario SOLO usa opciones que ya existen (ver `api/_lib/ads/schema.js → SECTORES`).
- La fórmula «Tipo de registro» ya clasifica `google_ads` como «Formulario web» (comprobado leyendo su fórmula): la regla «Lead = solo formulario web» se mantiene sin tocarla.
- Registros de prueba: empresa con «TEST» → la fórmula existente los marca «Prueba interna».

## Columnas nuevas en «Leads» (37)

| Columna | Tipo | Opciones | Nota |
|---|---|---|---|
| Ref lead | singleLineText |  | Referencia opaca del lead (L-…). Enlaza la reserva de Cal.com y la URL de gracias sin datos personales. |
| Tamaño empresa | singleSelect | Solo yo, 2-9, 10-49, 50-249, 250 o más |  |
| Etapa embudo | singleSelect | Nuevo, Cualificado, Reunión programada, Reunión celebrada, Propuesta, Prueba, Cliente, Descartado | Embudo de las landings. No sustituye a «Estado». |
| Motivo descarte | singleSelect | Spam, Estudiante / formación, Busca empleo, Busca software barato o gratis, Fuera de zona / país, Sin necesidad real, Sin presupuesto, Duplicado, Otro |  |
| GCLID | singleLineText |  | Identificador del PRIMER clic de Google Ads. No se sobrescribe. |
| GBRAID | singleLineText |  |  |
| WBRAID | singleLineText |  |  |
| Click IDs histórico | multilineText |  | Identificadores de clics posteriores del mismo lead. |
| UTM source | singleLineText |  |  |
| UTM medium | singleLineText |  |  |
| UTM campaign | singleLineText |  |  |
| UTM content | singleLineText |  |  |
| UTM term | singleLineText |  |  |
| Keyword | singleLineText |  |  |
| Matchtype | singleLineText |  |  |
| Dispositivo | singleLineText |  |  |
| Landing | singleLineText |  |  |
| Consentimiento privacidad | checkbox |  |  |
| Consentimiento fecha | dateTime |  |  |
| Consentimiento versión | singleLineText |  |  |
| Consentimiento anuncios | singleSelect | granted, denied, sin_banner |  |
| Primer envío | dateTime |  |  |
| Último envío | dateTime |  |  |
| Nº envíos | number |  |  |
| Último envío ID | singleLineText |  |  |
| Ficha cualificación | multilineText |  | Ficha automática: HECHO / INFERENCIA / HIPÓTESIS separados. |
| Producto candidato | singleLineText |  |  |
| Confianza ficha | singleSelect | Alta, Media, Baja |  |
| Fecha cualificado | dateTime |  |  |
| Reunión programada | dateTime |  |  |
| Reunión celebrada | dateTime |  |  |
| Valor cliente | currency |  |  |
| Mensualidad cliente | currency |  | Cuota mensual acordada (solo si hay trabajo recurrente real). Para MRR. |
| Horas implantación reales | number |  | Horas reales de implantación (también si la prueba no acaba en cliente). Para el CAC completo. |
| Fecha cliente | dateTime |  |  |
| Conversiones enviadas | multipleSelects | lead_cualificado, reunion_celebrada, cliente |  |
| Entorno | singleSelect | preview, production, development, test |  |

## Columnas nuevas en «Propuestas Generadas» (origen del lead)

| Columna | Tipo |
|---|---|
| Fuente lead | singleLineText |
| GCLID lead | singleLineText |
| Ref lead | singleLineText |
| Campaña lead | singleLineText |
| Keyword lead | singleLineText |
Y una opción nueva en «Estado» de Propuestas: `Borrador interno (pendiente de diagnóstico)`.

## Fechas que tiene que rellenar el equipo (o una automatización de Airtable)

Las conversiones offline necesitan la FECHA de cada paso:

| Cuando «Etapa embudo» pasa a… | Rellenar |
|---|---|
| Cualificado | «Fecha cualificado» |
| Reunión celebrada | «Reunión celebrada» (fecha y hora) |
| Cliente | «Fecha cliente», «Valor cliente» y, si hay cuota real, «Mensualidad cliente» |
| Prueba (aunque luego no sea cliente) | «Horas implantación reales» |

Recomendación: tres automatizaciones de Airtable «When record matches conditions → Update record (NOW())». No se han creado (producción).

## Cómo aplicarla (cuando se apruebe)

1. Copia de seguridad de la base (lo hace ADM/Backup AI Factory; comprobar que la última ejecución es de hoy).
2. Crear las columnas de la tabla de arriba, con los mismos nombres exactos (el código los usa literalmente).
3. Añadir `google_ads` a «Fuente».
4. `node --test tests/ads/backend.test.mjs` sigue en verde (no depende de la base).
5. Crear un token personal de Airtable con acceso SOLO a esa base y SOLO a `data.records:read` y `data.records:write`.
6. Variables en Vercel (ver `SEGURIDAD.md`). Primero Preview contra la base de PRUEBAS; Production solo el día de activación.
