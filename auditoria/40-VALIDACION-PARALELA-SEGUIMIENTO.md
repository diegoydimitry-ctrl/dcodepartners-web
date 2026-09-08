# Validación paralela MK/ vs RRSS Converged — seguimiento semanal

Expediente **AUD-20260821-014**, abierto el 21/08/2026.

Una entrada por semana. **No se reescriben las anteriores**: el valor de este
fichero es poder mirar hacia atrás y ver cuándo empezó algo.

> **Nota sobre las entradas que faltan.** Este fichero se crea el 01/09/2026.
> La rutina semanal existía desde el 21/08 y pedía escribir aquí, pero el
> fichero no estaba en ningún repositorio ni en el historial de ninguno: las
> comprobaciones de las semanas del 21 y del 24 de agosto, si se hicieron, se
> escribieron en un contenedor efímero y se perdieron con él. Por eso vive
> ahora en el repositorio y no en disco temporal.

---

## Semana del 25 al 31 de agosto de 2026 · comprobado el 01/09/2026

### Pasadas del orquestador RRSS/00

Las tres pasadas Lun/Mié/Vie se ejecutaron y **cerraron COMPLETADA**:

| Fecha | Ejecución | Estado | Etapas |
|---|---|---|---|
| Mié 26/08 07:00 | RUN-2853-dcode | COMPLETADA | 01→09 todas OK |
| Vie 28/08 07:00 | RUN-3069-dcode | COMPLETADA | 01→09 todas OK |
| Lun 31/08 07:00 | RUN-3439-dcode | COMPLETADA | 01→09 todas OK |

Todas en `modo: Produccion`, `modo_ejecucion: DRY_RUN`. Publicaciones reales: 0,
como corresponde a la fase actual.

### RRSS_NoPublishLog — 6 registros

Ninguno de severidad **SEGURIDAD**. Sin sellos inválidos, sin intentos
huérfanos, sin saltos de aprobación ni de QA.

- **26/08 y 28/08 — SIN_TEMA** (RRSS/02, Producción). El pilar asignado fue
  *Actualidad* y el sistema se negó a fabricar una pseudo-noticia sin novedad
  real que comentar. Comportamiento correcto y bien argumentado.
- **31/08 — QA_FALLIDO** (RRSS/06 QA-B, Producción). La variante de Instagram
  era un muro de texto trasladado casi literal de LinkedIn; puntuación 52 frente
  al umbral de 70. Bloqueada. Es exactamente el fallo que QA-B existe para
  detectar.
- **26/08, 28/08 y 31/08 — QA_A_NO_PASS** (RRSS/09, `modo: Prueba`,
  INFORMATIVO). Los tres apuntan al **mismo** registro `rectxZ2KjSBBqPGNm`.

### RRSS/ERR — Captura de Fallos

Cero ejecuciones en la semana. Ningún error real capturado.

### Comparación con el ritmo de MK/ — no procede

**`MK/Contenido IA Redes Sociales` está `active: false`** (desactivado el
20/08/2026). Su Data Table *Contenido IA Redes Sociales* no recibe una escritura
desde el **21/08/2026 07:01**.

Es decir: **no hay validación paralela**. El sistema antiguo se apagó el mismo
día en que arrancó la comparación, así que desde el 21/08 solo corre RRSS
Converged. La comparación semanal que pide esta rutina no puede hacerse, y
seguir pidiéndola da una falsa sensación de que dos sistemas se están
contrastando.

### Hallazgos

1. **Las 8 tablas de Video Factory estaban fuera de la copia de seguridad.**
   `VF_Ideas`, `VF_Runs`, `VF_Scripts`, `VF_Assets`, `VF_Videos`,
   `VF_Approvals`, `VF_NoPublishLog` y `VF_PublishLog` se crearon el 21/08 y
   nunca se añadieron a `ADM/Backup RRSS`. `VF_Ideas` ya acumula **39 registros
   en modo Producción**.
   La verificación de cobertura contra la Meta API **sí lo detectaba** y marcaba
   el fichero como `backup-rrss-PARCIAL-*.json` cada domingo, con el detalle en
   el correo. El mecanismo funcionó; lo que falló fue que nadie leyó el aviso.
   **Corregido y verificado el 01/09/2026**: 8 nodos Airtable añadidos,
   `Combinar Tablas` pasa de 10 a 18 entradas, las 8 líneas incorporadas a
   `TABLAS`, versión publicada y ejecución de prueba (id 3586) completada en 21
   segundos. Resultado: `backup-rrss-2026-09-01.json` — **sin el prefijo
   PARCIAL por primera vez** —, `completo: true`, `coberturaVerificada: true`,
   `tablasSinRespaldar: []`, 0 tablas con error, **422 registros en 17 tablas**.
   De esos 422, **253 (el 60%) eran los que estaban quedando fuera**:
   VF_Assets 102, VF_NoPublishLog 62, VF_Scripts 41, VF_Ideas 39, VF_Runs 4,
   VF_Videos 2, VF_PublishLog 2 y VF_Approvals 1.

2. **Pasada FALLIDA del 24/08 que nadie revisó.** `RUN-2633-dcode` (lunes 24/08)
   cerró **FALLIDA** con `09:FALLO` — *"Your request is invalid or could not be
   processed by the service"*. Las pasadas posteriores (26, 28 y 31) superaron
   la etapa 09 sin problema, así que fue transitorio y se recuperó solo. Queda
   anotado porque estuvo ocho días sin que nadie lo mirara.

3. **`RUN-2141-dcode` lleva EN_CURSO desde el 21/08.** En modo Producción, sin
   `fin`. El estado EN_CURSO actúa como cerrojo blando contra pasadas
   solapadas; no ha bloqueado ninguna pasada posterior, pero es un registro
   abierto que falsea cualquier recuento de pasadas en curso.

4. **Ruido de fixture en una tabla que es indicador de salud.** Los tres
   QA_A_NO_PASS de la semana son el mismo fixture (`modo: Prueba`) reevaluado en
   cada pasada. La documentación de `RRSS_NoPublishLog` dice que una tabla
   permanentemente vacía significa que el QA no discrimina; el reverso también
   importa: si se llena de repeticiones de un fixture, la señal se degrada.
   Conviene comprobar si `ultima_simulacion_en` (idempotencia añadida el 23/08)
   cubre también esta ruta de bloqueo, o solo la de simulación.

5. **Posible inanición en la rotación de pilares — sin confirmar.** *Actualidad*
   salió elegido el 24, el 26 y el 28, y las tres veces terminó en SIN_TEMA. La
   rotación elige el pilar activo con el `ultimo_uso` más antiguo; si un pilar
   que no publica no actualiza `ultimo_uso`, seguiría siendo el más antiguo para
   siempre. El 31/08 sí salió otro pilar (Autoridad), lo que contradice una
   inanición total. **No está demostrado**: se anota como hipótesis a verificar,
   no como defecto.

### Veredicto

Las tres pasadas de la semana corrieron y cerraron bien, el QA discriminó de
verdad en dos ocasiones y **no hay ni un solo registro de severidad SEGURIDAD**.
El sistema hace lo que debe. Lo que falla está alrededor: avisos correctos que
nadie lee, y una rutina de validación paralela que compara contra un sistema
apagado.

---

## Semana del 1 al 7 de septiembre de 2026 · comprobado el 08/09/2026

### Pasadas del orquestador RRSS/00

Las tres pasadas Mié/Vie/Lun se ejecutaron y **cerraron COMPLETADA**, verificado
tanto en `RRSS_Runs` como en las ejecuciones de n8n del propio `RRSS/00 -
Orquestador`:

| Fecha | Ejecución | Estado | Etapas |
|---|---|---|---|
| Mié 02/09 07:00 | RUN-3714-dcode | COMPLETADA | 01→09 todas OK |
| Vie 04/09 07:00 | RUN-3958-dcode | COMPLETADA | 01→09 todas OK |
| Lun 07/09 07:00 | RUN-4326-dcode | COMPLETADA | 01→09 todas OK |

Todas en `modo: Produccion`, `modo_ejecucion: DRY_RUN`. Publicaciones reales: 0.

### RRSS_NoPublishLog — 5 registros

Ninguno de severidad **SEGURIDAD**. Sin sellos inválidos, sin intentos
huérfanos, sin saltos de aprobación ni de QA.

- **02/09 — QA_FALLIDO** (RRSS/06 QA-A, Producción). Puntuación 55/70: la pieza
  afirmaba «la empresa empieza a liberar horas desde el primer mes» como hecho
  general sin condicionarlo ni acotarlo a un caso concreto. Bloqueada antes de
  llegar a adaptar ningún canal.
- **04/09 — QA_FALLIDO** (RRSS/06 QA-B, Producción, variante Instagram).
  Puntuación 52/70: contenido fiel a la pieza base, pero formato de «muro de
  texto» sin los saltos visuales que exige el canal. La variante de LinkedIn de
  esa misma pieza **sí pasó** (88/100).
- **02/09, 04/09 y 07/09 — QA_A_NO_PASS** (RRSS/09, `modo: Prueba`,
  INFORMATIVO). Los tres apuntan al mismo registro fixture `rectxZ2KjSBBqPGNm`
  de siempre — ruido ya señalado en la entrada anterior, sigue sin resolverse.

### Hallazgo nuevo: por primera vez hay contenido esperando una decisión humana

**07/09 es la primera pasada de todo el expediente en la que la pieza base y
las dos variantes superan el QA completo el mismo día**: pieza base 88/100,
LinkedIn 93/100, Instagram 76/100. Sumada a la variante de LinkedIn del 04/09
(88/100, que había quedado huérfana porque su hermana de Instagram falló),
**hay dos piezas de LinkedIn en `QA_PASS` con `notificado_en` cumplimentado** —
es decir, ya incluidas en el dossier que `RRSS/07 - Aprobacion` envía al
aprobador — y la de Instagram del 07/09 igual.

Comprobado contra `RRSS_Approvals`: **cero decisiones humanas registradas en
toda la semana**. No es un fallo — `RRSS/07` exige precisamente esa aprobación
sellada antes de dejar pasar nada, y aquí no ha hecho falta bloquear nada
porque nadie ha decidido todavía — pero es la primera vez que hay contenido
real, en `Produccion`, aprobado por QA y esperando a una persona. Vale la pena
que el aprobador (`email_aprobador` del Tenant) revise el dossier: son los
primeros candidatos genuinos que ha producido el sistema desde que arrancó.

### RRSS/ERR — Captura de Fallos

Cero ejecuciones en la semana. Ningún error real capturado.

### Comparación con el ritmo de MK/ — sigue sin proceder

`MK/Contenido IA Redes Sociales` sigue `active: false`. Su Data Table
*Contenido IA Redes Sociales* no ha recibido ninguna escritura nueva: sigue
congelada en **2026-08-21T07:01:00Z**, la misma marca que la semana pasada.
Nada que comparar.

### Seguimiento de lo anotado la semana anterior

1. **`ADM/Backup RRSS`** — sigue corregido; no se ha vuelto a comprobar esta
   semana porque no era el objeto de este chequeo.
2. **`RUN-2141-dcode`** — sigue **EN_CURSO desde el 21/08**, ya van 18 días.
   Sigue sin bloquear pasadas nuevas (las tres de esta semana corrieron y
   cerraron con normalidad), pero como cerrojo blando contra solapes es un
   registro que ya no representa nada real y sigue falseando cualquier
   recuento de pasadas abiertas.
3. **Inanición de pilares** — no verificable esta semana: el pilar *Actualidad*
   no volvió a salir elegido, así que no hay nueva evidencia ni a favor ni en
   contra de la hipótesis.

### Veredicto

Tres pasadas, tres COMPLETADA, cero SEGURIDAD, cero errores técnicos. El QA
volvió a discriminar de verdad dos veces (55/70 y 52/70) y, por primera vez,
dejó pasar contenido real completo: dos piezas de LinkedIn y una de Instagram
esperan hoy una decisión humana que todavía no se ha tomado. Nada de esto
requiere aviso inmediato — es exactamente el comportamiento para el que se
construyó la cadena —, pero es el primer punto de la validación paralela en el
que "qué pasaría si se aprobara" deja de ser hipotético.
