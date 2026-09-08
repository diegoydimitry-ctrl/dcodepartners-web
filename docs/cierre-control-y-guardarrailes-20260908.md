# Cierre de control, calidad y guardarraíles — 8 de septiembre de 2026

Auditoría AUD-DCP-20260908. El objetivo no era mejorar nada: era separar lo que
está **demostrado** de lo que solo está **escrito**.

Se usan cinco estados, y no son sinónimos:

| Estado | Significa |
|---|---|
| **IMPLEMENTADO** | El código existe. Nadie lo ha ejecutado. |
| **PROBADO POR PIEZAS** | Hay pruebas unitarias de sus partes. |
| **PROBADO E2E** | Se ha recorrido entero contra un sistema real. |
| **PROBADO BAJO FALLO** | Se ha visto qué hace cuando algo se rompe. |
| **PROBADO EN PRODUCCIÓN** | Ha ocurrido de verdad, con datos reales. |

---

## 1. Contraste con la auditoría anterior

Nada se ha dado por bueno porque lo fuera el 1/09. Se ha vuelto a medir.

| Item | Estado anterior | Estado actual | Evidencia | Riesgo | Siguiente acción |
|---|---|---|---|---|---|
| Workflows activos | 63 | **65** | Radiografía vía API, 151 workflows totales (57 archivados) | — | Ninguna |
| Deriva editor/producción | 0 sobre 63 | **0 sobre 65** | Ejecución 4306, 7/09 07:20 Madrid: `revisados: 65, conDeriva: []` | Bajo | Ninguna |
| Pruebas D-Code OS | 344/344 | **346/346** | `npm test` (`tsx --test`), 8/09 | — | Ninguna |
| CI web | 649 comprobaciones | **649, en verde** | 6 ejecuciones, todas `success` | Medio | Ver §8 |
| 58 leads | Intactos, «Nuevo» | **58, todos «Nuevo»**, el más reciente del 31/08 | `list_records_for_table`, `totalRecordCount: 58` | — | Ninguna |
| Formulario web | Cerrado | Cerrado; **el webhook sigue abierto y responde** | Latido cada 6 h, 28 ejecuciones desde el 3/09 | Bajo, controlado | Ver §3 |
| Promesa de 24 h | Retirada de la web | **Retirada; quedaban 3 restos internos en n8n** | Radiografía, `PROMESA_24H` | Medio → corregido 1 de 3 | Ver §3 |
| Fallos de ejecución | — | **0 en la ventana retenida (7 días)** | `search_workflow_executions status=[error,crashed]` → 0 | — | Ver §9 |
| Neon | 3 acciones pendientes | **2 de 3 son imposibles en este plan** | HTTP 404 y HTTP 422 | **Alto** | Ver §5 |
| Cierre automático | Probado por piezas | **Probado E2E; sin entrada en producción** | 24 aserciones, PostgreSQL real, 8/09 | **Alto** | Ver §4 |

**Cambios en el ecosistema que NO hice yo y que no estaban en el informe anterior:**

- `ADM/Vigilancia de Silencio` (`4e7HdP3tlcmkHROF`), creado el 3/09, activo.
- `ADM/Latido del Formulario Web` (`W1IbtDrLxiUqSCim`), creado el 3/09, activo.
- `ADM/Radiografia (auditoria temporal)` (`ET81YBXXf9nZcRCh`), creado el **8/09 a
  las 05:15 UTC**, inactivo, nunca publicado. Leí sus tres nodos línea a línea
  antes de tocarlo: un `GET /api/v1/workflows` y un nodo de código puro. No
  escribe nada. Lo ejecuté para obtener el grafo real del ecosistema.

---

## 2. Guardarraíl central: probado por primera vez

`GRD/Guardarrail Comunicacion Externa` es el control que decide si sale o no una
comunicación externa. Está descrito como *fail-safe*: vacío bloquea, desconocido
bloquea, prueba bloquea.

**Tenía CERO ejecuciones. Nunca, ni una vez, desde que se creó el 19/08.**

No es un artefacto de los sub-workflows: `CM/Plantilla de Email` tiene 34
ejecuciones con `mode: "integrated"`, así que las llamadas entre workflows sí se
registran. El guardarraíl simplemente nunca se había invocado.

Ejecuté su batería interna de 13 casos. **Ejecución 4441, 8/09/2026 05:31 UTC.**
Es seguro: el workflow no tiene nodo de envío ni credencial de correo, su única
lectura externa es un `search` en Airtable, y los destinatarios de prueba usan
dominios `.invalid`.

| Caso | Esperado | Obtenido |
|---|---|---|
| A modo vacío | bloquear | `BLOQUEO_MODO_VACIO` |
| B modo desconocido («Piloto») | bloquear | `BLOQUEO_MODO_DESCONOCIDO` |
| C modo prueba | bloquear | `BLOQUEO_MODO_PRUEBA` |
| D producción sin autorización | bloquear | `BLOQUEO_SIN_AUTORIZACION` |
| E producción con autorización | permitir | `PERMITIDO` |
| F email inválido | bloquear | `BLOQUEO_EMAIL_INVALIDO` |
| G estado no cliente | bloquear | `BLOQUEO_ESTADO_NO_CLIENTE` |
| H espacios y mayúsculas | permitir | `PERMITIDO` |
| I oposición expresa | bloquear | `BLOQUEO_SUPRIMIDO` |
| J la misma, con otra caja | bloquear | `BLOQUEO_SUPRIMIDO` |
| K dominio suprimido entero | bloquear | `BLOQUEO_SUPRIMIDO_DOMINIO` |
| L buzón no comercial | bloquear | `BLOQUEO_SUPRIMIDO` |
| M control negativo | permitir | `PERMITIDO` |

13 de 13. Lista de supresiones leída en vivo: **26 supresiones activas**.

### El defecto que esto destapa

El guardarraíl exige `autorizacionHumana === 'true'`. **Ese valor lo declara
quien llama, y en todos los casos es una constante escrita en el workflow:**

| Quien llama | Valor | Efecto real |
|---|---|---|
| `FNZ/Cobros - Seguimiento` | `'true'` | siempre pasa |
| `FNZ/Facturación IA` | `'true'` | siempre pasa |
| `CLS/Bienvenida Cliente` | `'false'` | **nunca pasa** |
| `CLS/Onboarding Cliente IA` | `'false'` | **nunca pasa** |
| `CLS/Encuestas Automaticas` | `'false'` | **nunca pasa** |

Una condición que no puede ser falsa no es un control. Para las dos rutas que
tocan dinero, «autorización humana» es un literal. Y para las tres de cliente,
el bloqueo es permanente: **si hoy se diera de alta un cliente real, su correo
de bienvenida no saldría.**

Lo que sí está bien hecho: no falla en silencio. `CLS/Bienvenida` tiene la rama
`Guardarrail Permite? → no → Avisar Retención (interno)`, que manda a Dirección
el código de bloqueo y las instrucciones para levantarlo.

**No lo he cambiado.** Decidir si un alta de cliente debe requerir autorización
humana es una decisión de Dirección, no un defecto inequívoco.

Lo que **no** está probado: la rama `BLOQUEO_SUPRESIONES_NO_CONSULTABLE`. Para
ejercitarla habría que hacer fallar la lectura de Airtable, y eso exige tocar la
configuración de un workflow activo. Prueba diseñada, no ejecutada (§7).

---

## 3. MK/Lead IA 360 y la promesa de «contacto en 24h»

### Veredicto por sitio

| Dónde | Clasificación | Evidencia |
|---|---|---|
| Correo de confirmación al cliente (producción) | **VERIFICADO — retirada** | El nodo `Preparar Confirmacion Cliente` bifurca por origen y no compromete plazo |
| Web pública, ES y EN | **VERIFICADO — retirada** | `grep` sobre 64 páginas: 0 promesas de plazo |
| Menciones a «chat 24 horas» en Soporte | **FALSA ALARMA** | Describen disponibilidad de un producto, no un plazo de respuesta |
| «Nuevos Leads (24h)» en informes DIR | **FALSA ALARMA** | Nombre de una métrica |
| Alerta interna `Alertar Lead Perdido` | **INCORRECTO** → corregido hoy | Decía «Al cliente ya se le ha confirmado que le contactaremos en 24h» |
| `siguienteAccion` de reserva (nodo `Interpretar Análisis IA`, ×2) | **RIESGO menor** — no corregido | Escribe «contactar en menos de 24h» en el campo *Próximo paso* de Airtable |
| `automation/n8n/lead-ia-360/lead-ia-360.workflow.json` (este repo) | **RIESGO — regresión latente** → marcado hoy | La plantilla de despliegue conserva el correo con «24 horas laborables» |

### ¿Puede alguien enviar mientras el sistema está pausado?

**Sí.** El webhook `POST /webhook/lead-ia-360-v2` sigue activo, con
`allowedOrigins: "*"` y sin autenticación. Es deliberado: la orden fue no perder
solicitudes.

Lo que ocurre si alguien envía:

1. Turnstile valida. Sin token válido → rechazo, no se crea nada.
2. Con token válido → el lead **se guarda** en Airtable y se le responde por
   correo que no estamos aceptando proyectos nuevos y que no hay plazo.

**Caché:** `vercel.json` sirve todo el HTML con
`Cache-Control: public, max-age=0, must-revalidate`. No hay una versión antigua
cacheada por CDN. Sí puede quedar una pestaña abierta desde antes del cambio.

**En 7 días, cero envíos no solicitados han pasado.** 58 leads, el último del
31/08, todos en «Nuevo».

### ¿Y si el SLA no se cumple?

No existe. No hay ningún workflow que mida el tiempo de respuesta a un lead ni
que escale por incumplimiento. Nunca lo hubo: la frase «en 24 h» **nunca tuvo
nada detrás**. La única maquinaria de SLA real es la de tickets de soporte
(`SP/Seguimiento de Tickets`), que no toca leads.

---

## 4. Cierre automático de incidencias: el mapa completo

| Etapa | Estado | Detalle |
|---|---|---|
| **Entrada** | **PARCIAL** | Dos de tres canales están muertos |
| Clasificación | PROBADO E2E | `diagnosticar()` → racha / intermitente / callado / sano |
| Condiciones | PROBADO E2E | 5 condiciones; `EXITOS_PARA_CERRAR = 2` |
| Decisión | PROBADO E2E | `decidirCierre()` |
| Acción | PROBADO E2E | Abre / mantiene / cierra |
| Registro | PROBADO E2E | `executionId`, `recoveredAt`, `closureMechanism` |
| Estado final | PROBADO E2E | `RESUELTA` |
| **Notificación** | **NO EXISTE** | Ni al abrir ni al cerrar |
| Cierre | PROBADO E2E | Idempotente |

### La entrada, con nombre y apellidos

| Canal | Estado |
|---|---|
| `OS/Reportar Fallo a D-Code OS` (empuje HMAC) | **INACTIVO** — le falta el secreto |
| `OS/Reloj de Verificaciones` (reloj horario) | **INACTIVO** — URL placeholder + secreto |
| Sincronización al abrir la pantalla | **ACTIVO — es el único** |

Y hay un dato peor: **de los 65 workflows activos, 54 no tienen ningún
`errorWorkflow` configurado.** Los 11 que sí lo tienen apuntan todos a
`RRSS/ERR - Captura de Fallos`, es decir, solo la familia RRSS.
`OS/Reportar Fallo a D-Code OS` **no está designado como destino de error por
ningún workflow**, aparte de estar inactivo.

La conciliación se dispara desde `lib/departamentos/historialDatos.ts:50`, dentro
de `historialDe()`, que se ejecuta **cuando una persona abre la pantalla de
historial de un departamento**. Además va envuelta en `.catch(() => null)`: si
falla, falla en silencio.

Traducido: **una racha de fallos se detecta, se abre incidencia y se cierra sola
con evidencia — pero solo si alguien entra a mirar, y sin que nadie reciba
ningún aviso.**

### Prueba E2E ejecutada hoy

`scripts/prueba-cierre-extremo-a-extremo.ts` contra PostgreSQL 16 real
(`127.0.0.1:55432/dcodeos_test`, base local desechable; el script **aborta** si
`DATABASE_URL` apunta a otro sitio). 20 migraciones aplicadas, 5 fases,
**24 aserciones, todas verdes**:

- Fase 1 — tres fallos de producción seguidos abren incidencia, con
  `problemStartedAt` en el **primer** fallo, no en la fecha de apertura.
- Fase 2 — volver a conciliar **no** duplica.
- Fase 3 — dos éxitos **manuales** NO cierran. Motivo devuelto textual.
- Fase 4 — dos éxitos **de producción** sí cierran, guardando
  `executionId: exec-0.4-trigger`, `recoveredAt` y
  `closureMechanism: RECUPERACION_VERIFICADA`.
- Fase 5 — una vez cerrada, no se vuelve a tocar.

**Lo que esto NO demuestra:** que funcione en producción. Nunca se ha ejecutado
contra la base real de Neon con datos reales de n8n, porque en 7 días **no ha
fallado ni una sola ejecución** en todo el ecosistema y no hay racha que cerrar.
Es una buena noticia y a la vez la razón por la que el ciclo sigue sin estrenarse.

---

## 5. Recuperación: Neon

El conector volvió hoy. Las tres acciones que quedaron «pendientes de
intervención manual» el 1/09 **se intentaron las tres**. Resultado en
`docs/postgresql-neon-proteccion.md`; en resumen:

- Calendarios de copia automáticos: **HTTP 404, no existen en el plan `free_v3`**.
- Protección de rama: **HTTP 422, límite del plan alcanzado (es 0)**.
- Snapshot manual de D-Code OS, que **no tenía ninguno**: **hecho** —
  `snap-super-term-b13k6r24`, 8/09 05:36 UTC.
- Refrescar el snapshot de Finance (del 1/09): **HTTP 422, un snapshot por
  proyecto**. Habría que borrar el único que existe. **No lo he hecho.**

Ventana de recuperación a un punto en el tiempo: **6 horas** (`21600 s`) en las
dos bases. Si el daño se detecta tarde, lo único que queda es un snapshot manual
que envejece un día por día.

**El ensayo de restauración sigue sin hacerse.** Un backup que nunca se ha
restaurado es una hipótesis. `scripts/verificar-restauracion.sql` —de solo
lectura— estaba **referenciado por la documentación y no existía en ningún
repositorio**; se añade hoy.

---

## 6. Guardarraíles: qué protege cada uno y si se ha ejercitado

| Guardarraíl | Protege de | Falla | ¿Probado? | ¿Ejercitado? | Evidencia |
|---|---|---|---|---|---|
| `GRD/Guardarrail Comunicacion Externa` | envío a quien no toca | **cerrado** | **sí, hoy** | 8/09 | Ejec. 4441, 13/13 |
| Turnstile en el formulario | spam y bots | **cerrado** | **sí** | cada 6 h | Ejec. 4425, `statusCode 400` |
| `Decidir Envio Confirmacion` (supresiones) | escribir a un opuesto | **cerrado** | por piezas | nunca | — |
| Deduplicación de facturas | cobrar dos veces | cerrado | no | nunca | `FNZ/Facturación IA`: **0 ejecuciones** |
| Exigir NIF/CIF antes de facturar | factura inválida | cerrado | no | nunca | idem |
| `GRD/Vigilante de Caminos Externos` | envíos sin guardarraíl | **detectivo, no preventivo** | por piezas | diario | activo |
| Cardinalidad en `CF/Investigación` | 3 ideas de 6 que no llegaron | cerrado | por piezas | 3×/semana | corregido 1/09 |
| `stop_reason` en `FNZ/IA Financiera` | respuesta truncada | cerrado | por piezas | por webhook | corregido 1/09 |
| Escapado HTML en `MK/Lead IA 360` | inyección en correo saliente | cerrado | por piezas | cada 6 h | — |
| Validación SSRF en Recolector Externo | descargar de donde no se debe | cerrado | por piezas | diario | — |
| Detector de deriva | publicar ≠ guardar | **abierto**: si la API no da `activeVersionId`, dice NO VERIFICADO | sí | diario | Ejec. 4306 |
| Verificación estática (CI) | romper el sitio | **abierto**: `main` no está protegido | sí, rompiendo el sitio a propósito | 6 veces | §8 |
| Formulario de gastos (n8n) | — | **NO HAY** | — | — | `auth: none`, escribe en Airtable |
| Formulario de propuestas (n8n) | — | **NO HAY** | — | — | `auth: none`, gasta Gemini y crea Docs |

Los dos últimos son formularios públicos de n8n, activos, sin autenticación. Su
única protección es que la URL no se conozca. El de gastos **escribe en la tabla
de gastos que alimenta el control financiero**.

---

## 7. Casos adversos

**Ejecutados:**

| Caso | Dónde | Resultado |
|---|---|---|
| Dato inválido (email sin `@`) | Guardarraíl, caso F | bloqueado |
| Dato faltante (modo vacío) | Guardarraíl, caso A | bloqueado |
| Valor desconocido («Piloto») | Guardarraíl, caso B | bloqueado |
| Duplicado con otra caja | Guardarraíl, caso J | bloqueado igual |
| Ejecución repetida | E2E cierre, fases 2 y 5 | idempotente |
| Estado inconsistente (éxitos manuales sobre racha) | E2E cierre, fase 3 | no cierra |
| Token anti-spam inválido | Latido, producción | HTTP 400, no crea lead |
| Menos elementos de los esperados | `CF/Investigación` | corregido el 1/09 |
| Respuesta truncada | `FNZ/IA Financiera` | corregido el 1/09 |

**Diseñados y NO ejecutados, con el motivo exacto:**

| Caso | Por qué no |
|---|---|
| Supresiones ilegibles → `BLOQUEO_SUPRESIONES_NO_CONSULTABLE` | Exige romper la lectura de Airtable en un workflow activo |
| Airtable caído en `MK/Lead IA 360` → `Alertar Lead Perdido` | Igual; y enviaría un correo real |
| Restauración de un snapshot de Neon | No autorizado; y no está verificado si `restore_snapshot` restaura **sobre** la rama o crea una nueva |
| Fallo real de un workflow → racha → incidencia → cierre en producción | Requiere provocar 3 fallos reales seguidos |
| Ejecución paralela de la conciliación | Requiere dos cargas simultáneas de la pantalla contra la base real |

---

## 8. CI: qué cubre y qué no

Las **649 comprobaciones son 4 clases de riesgo**, no 649 riesgos:

| Clase | Nº | Qué detecta |
|---|---|---|
| Sintaxis JavaScript | 8 | un `.js` que no compila |
| Estructura HTML | 64 | etiquetas descuadradas |
| Respaldo de contacto | 1 | que no vuelva a ser un relay de correo abierto |
| Referencias locales | **576** | un `src`/`href` que apunta a un fichero inexistente |

**Qué NO cubre:** que el formulario siga pausado; que ninguna página vuelva a
prometer un plazo; que las rutas de `cleanUrls` resuelvan; que
`knowledge-base.json` sea JSON válido; nada de CSS, accesibilidad,
comportamiento en navegador ni chatbot; y **nada de la divergencia entre este
repositorio y n8n**.

**Clasificación real, hoy:**

| Comprobación | Debería ser | **Es** | Por qué |
|---|---|---|---|
| Verificación estática | BLOCKER | **INFORMATIVE** | `main` está `protected: false`: un check en rojo no impide nada |
| `qa-preview` (PR) | BLOCKER | **INFORMATIVE** | mismo motivo |
| `smoke-produccion` (push a main) | WARNING | **WARNING** | corre después del despliegue, por diseño |

La CI se ha ejecutado 6 veces, todas en verde, **todas en mi rama. Ninguna en
`main`.** El guardarraíl existe y todavía no ha guardado una sola promoción a
producción.

Redundancia: ninguna de las cuatro clases se solapa. No hay nada que quitar.

---

## 9. Observabilidad

| Pregunta | Respuesta |
|---|---|
| ¿Queda registrado un fallo? | En n8n sí, **7 días** (no hay ejecuciones anteriores al 1/09) |
| ¿Se identifica la ejecución? | Sí, `executionId` |
| ¿Se sabe qué entidad se procesaba? | **A veces.** Depende del workflow |
| ¿Se sabe en qué etapa falló? | Sí, `failedNode` |
| ¿Hay correlation ID entre workflows? | **No.** Una cadena de 3 sub-workflows deja 3 ejecuciones sin identificador común |
| ¿Se puede reconstruir? | Dentro de los 7 días, sí |
| ¿Se avisa a alguien? | `ADM/Monitorización n8n` cada 2 h **para fallos de ejecución**. El cierre de incidencias **no avisa a nadie** |
| ¿Hay retry? | 59 de 65 activos tienen `retryOnFail` en algún nodo |
| ¿Hay fallback? | Sí en los caminos de IA; el patrón es «no verificado» en vez de un cero falso |
| ¿Queda el sistema en estado ambiguo? | En el cierre de incidencias, no: hay mecanismo y evidencia |

**La memoria del sistema son 7 días.** Todo lo anterior al 1/09 ya no existe en
n8n. Esa es exactamente la razón por la que se construyó el canal hacia D-Code
OS — y ese canal es el que sigue inactivo.

---

## 10. Matrices finales

### Controles

| Control | Existe | Probado | E2E | Bajo fallo | Observable | Recuperable | Riesgo |
|---|---|---|---|---|---|---|---|
| Guardarraíl comunicación externa | sí | **sí, hoy** | sí | **parcial** | sí | sí | **Medio** |
| Turnstile del formulario | sí | sí | sí | **sí, en producción** | sí | sí | Bajo |
| Detector de deriva | sí | sí | sí | sí | sí | n/a | Bajo |
| Cierre automático de incidencias | sí | sí | **sí** | sí | **no avisa** | sí | **Alto** |
| Canal n8n → D-Code OS | sí | no | **no** | no | no | no | **Alto** |
| Destinos de error por workflow | **11 de 65** | n/a | no | no | parcial | no | **Alto** |
| Copias de Neon | parcial | no | **no** | no | no | **sin ensayar** | **Alto** |
| CI web | sí | sí | sí | sí | sí | n/a | **Medio** |
| Autorización humana | **aparente** | sí | sí | sí | sí | n/a | **Medio** |
| Formularios n8n públicos | **no** | — | — | — | — | — | **Medio** |
| Deduplicación de facturas | sí | por piezas | **no** | no | sí | sí | Medio |
| Pausa de captación | sí | sí | **sí, 7 días** | sí | sí | sí | Bajo |

### Problemas

| Problema | Prioridad | Impacto | Acción | ¿Cambio? | ¿Bloquea producción? |
|---|---|---|---|---|---|
| 54 de 65 activos sin `errorWorkflow` | **P0** | Un fallo no llega a ningún sitio salvo el vigilante de 2 h | Designar `OS/Reportar Fallo` y activarlo | Sí | No |
| `OS/Reportar Fallo` inactivo, sin secreto | **P0** | El cierre automático no tiene entrada | Pegar el secreto y activar | Sí (humano) | No |
| Neon: 6 h de retención, 1 snapshot, sin protección | **P0** | Pérdida de datos irrecuperable | Subir de plan o automatizar snapshots | Decisión | No |
| Restauración nunca ensayada | **P0** | El backup es una hipótesis | Ensayar sobre rama prescindible | Sí, autorizado | No |
| `autorizacionHumana` es un literal | **P1** | El control más fuerte es siempre verdadero en dinero | Decidir qué debe significar | Decisión | No |
| Bienvenida/onboarding/encuestas bloqueadas siempre | **P1** | Un cliente nuevo no recibiría nada | Decidir si es intencionado | Decisión | **Sí para altas** |
| El cierre no notifica a nadie | **P1** | Se abre y se cierra a oscuras | Añadir aviso al abrir y al cerrar | Sí | No |
| Conciliación colgada de una carga de pantalla | **P1** | Si nadie mira, no ocurre | Colgarla del reloj cuando exista | Sí | No |
| Rama de dcode-os 37 commits por detrás de `main` | **P1** | El cierre de incidencias no está en producción y diverge | Integrar con `main` | Sí | No |
| `main` sin protección: CI informativa | **P1** | Un push rojo llega a producción | Marcar el check como requerido | Config | No |
| Plantilla `lead-ia-360` con la promesa de 24 h | **P2** | Reimportarla la reintroduce | Marcada hoy; reexportar al usar | Hecho (aviso) | No |
| Dos formularios n8n públicos sin auth | **P2** | Gasto e inyección de gastos | Basic Auth en el form trigger | Sí | No |
| Sin correlation ID entre sub-workflows | **P2** | Reconstruir una cadena es manual | Propagar un id | Sí | No |
| `siguienteAccion` con «24h» (×2) | **P3** | Instrucción interna obsoleta | Una línea en `Interpretar Análisis IA` | Sí | No |

---

## 11. Cambios realmente ejecutados hoy

1. **`MK/Lead IA 360`** — nodo `Alertar Lead Perdido`: se retira la afirmación
   falsa «Al cliente ya se le ha confirmado que le contactaremos en 24h».
   Publicado: `activeVersionId = d430e5ab-e178-47e1-a31a-192b2fd75884`, igual al
   borrador, sin deriva.
2. **Neon** — snapshot de D-Code OS: `snap-super-term-b13k6r24`. Primer punto de
   restauración que ha tenido esa base.
3. **`scripts/verificar-restauracion.sql`** — añadido al repositorio: la
   documentación lo mandaba ejecutar y no existía.
4. **`docs/postgresql-neon-proteccion.md`** — corregido con el resultado real de
   las tres acciones (404 / 422) y el límite de un snapshot por proyecto.
5. **`automation/n8n/lead-ia-360/README.md`** — aviso de divergencia con
   producción.
6. **Este documento.**

Nada más. No se ha borrado ningún dato, no se ha movido ningún lead, no se ha
reactivado la captación, no se ha tocado ninguna credencial y no se ha enviado
ningún correo a nadie.
