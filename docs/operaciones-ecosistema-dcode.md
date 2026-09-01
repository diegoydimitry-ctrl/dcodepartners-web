# Ecosistema D-Code — referencia operativa

**Última revisión: 31/08/2026 (auditoría nocturna AUD-20260830).**
Todo lo que hay aquí está verificado en vivo contra el sistema real en esa fecha.
Lo que no se pudo verificar se dice explícitamente. No hay nada supuesto.

---

## 1. Qué hay y dónde

| Sistema | Detalle | Notas |
|---|---|---|
| **n8n Cloud** | 87 workflows (~50 activos) | `diegoydimitry2.app.n8n.cloud` |
| **Airtable · Operaciones** | `app5JfVEjK4JiMXEm` | Leads, Radar Comercial, Propuestas Generadas, Proyectos, Gastos, Tickets, Empresas, Contactos |
| **Airtable · D-Code AI Factory** | `appbWzPA5rbx9tqOb` | **Tareas**, Facturas, Clientes, Gastos (fuente de verdad), Supresiones, EB - * |
| **Airtable · D-Code RRSS** | `appOiMREHtxGneyEt` | Fuera de alcance por decisión de Dirección |
| **Vercel** (equipo `d-code-partners`, plan Hobby) | `dcodepartners-web`, `dcode-os`, `dcode-finance` | |
| **Neon Postgres** | Base de D-Code OS | |

> **Trampa de nombres.** Hay tablas con el mismo nombre en bases distintas.
> `Gastos` existe en las dos bases y la **fuente de verdad es la de AI Factory**
> (`tbl1EkzNAFvSmtmkw`). `Tareas` **no está en Operaciones**, está en AI Factory.
> Antes de escribir un workflow, confirmar la base, no solo el nombre de la tabla.

## 2. Quién vigila a quién

Esta es la sección que más falta hacía. Hasta el 31/08 había un hueco: **nadie
vigilaba las aplicaciones web**. El login de `dcode-finance` estuvo caído nueve
días (16→25/08, NextAuth `MissingSecret`) sin que saltara ninguna alerta.

| Vigilante | Qué vigila | Cadencia | Avisa a |
|---|---|---|---|
| `ADM/Monitorización n8n` | Ejecuciones fallidas de n8n en producción | 2 h | Buzón interno |
| `ADM/Vigilancia de Aplicaciones Web` | Las 3 apps en producción | 2 h | Buzón interno |
| `GRD/Vigilante de Caminos Externos` | Nodos que envían fuera sin control | Diaria 06:30 | Buzón interno |
| `DIR/Executive Board - Auditor Interno` | Estado interno (n8n, Airtable, Gmail, GitHub) | Diaria 06:40 | Tablas EB |

Detalles que importan:

- **`ADM/Monitorización n8n` usa marca de agua**, y solo avanza si el aviso se
  entregó. Un fallo de Gmail no hace perder la alerta.
- **`ADM/Vigilancia de Aplicaciones Web`** avisa por error de conexión, HTTP 5xx, y
  —solo en D-Code OS— por un `/api/health` que no confirme `db` y `schema` (así
  detecta también una caída de Neon). **Un 401/403 NO cuenta como caída**: significa
  que el servidor está vivo y protegido, y tratarlo como fallo convertiría un cambio
  de configuración de Vercel en una alarma diaria falsa.

### El antipatrón de archivarse a sí mismo

Varios workflows enviaban su aviso y, en la misma ejecución, le quitaban la etiqueta
`INBOX`. Verificado en Gmail el 31/08: la bandeja tenía **52 mensajes** mientras la
cuenta acumulaba **274 sin leer**. La mayor parte de lo que el sistema produce nunca
llegaba a donde alguien mira.

| Etiqueta | Mensajes | Sin leer | ¿Correcto archivar? |
|---|---|---|---|
| `Comercial/Hot Leads` | 109 | 81 | **No** — son oportunidades accionables |
| `AI Factory/Workflows con Error` | 66 | 9 | **No** — son alertas |
| `Comercial/Seguimientos` | 21 | 4 | **No** — es la lista de trabajo comercial |
| `Sistema/Logs` | 114 | 93 | Sí — nadie quiere 114 logs en la bandeja |
| `Dirección/Informes Diarios` | 20 | 4 | Preferencia de Dirección |

El patrón no está mal en sí: para logs es correcto. **Está mal para todo aquello sobre
lo que alguien tiene que actuar.** Antes de copiar un nodo
`Gmail - Archivar … (quitar Inbox)` a un workflow nuevo, la pregunta es si el correo
pide una acción. Si la pide, no se archiva.

### La regla que hace que las alertas sirvan

> **Una alerta que grita en falso todos los días deja de leerse, y entonces
> equivale a no tener alerta.**

No es teoría. Pasó dos veces, y las dos se corrigieron el 30/08:

1. `ADM/Monitorización n8n` enviaba la alerta y, en la misma ejecución, le quitaba
   la etiqueta `INBOX`. Se archivaba a sí misma 3,5 segundos después de enviarse.
   Queda registrado en la ejecución 3266. Un fallo real de `ADM/Identidad Comercial`
   pasó **6 días** inadvertido por esto.
2. `GRD/Vigilante de Caminos Externos` avisaba cada mañana de 5 "caminos externos sin
   guardarrail" que no lo eran: su analizador solo leía la cadena literal de `sendTo`,
   y el repositorio usa el patrón "un nodo `Preparar …` calcula el destinatario". Es
   decir, marcaba en rojo justo los envíos mejor construidos.

## 3. Controles de comunicación externa

Tras el incidente legal `AUD-DCP-20260819-LEGAL-INCIDENT-001` existen **tres**
controles distintos, y el vigilante reconoce los tres:

| Control | Dónde | Para qué |
|---|---|---|
| `GRD/Guardarrail Comunicacion Externa` (`Sdh7BPxpyb9ly53g`) | Sub-workflow central | Comunicación comercial. Fail-safe: vacío/desconocido/Prueba = BLOQUEADO |
| Lista blanca de dominios internos (marca `DOMINIOS_INTERNOS`) | Dentro del propio workflow | Envíos a dominios propios |
| Tabla `Supresiones` (`tblK32EjvgcNyyzXr`) | AI Factory | Correo transaccional a quien acaba de escribirnos. Fail-safe: si no se puede consultar, **no se envía** |

`CM/Seguimiento Comercial IA` (secuencias a leads) sigue **RETIRADO** por decisión de
Dirección. No reactivar sin validación jurídica.

## 4. Cobertura de copias de seguridad

`ADM/Copias de Seguridad` (domingos 03:00) respalda **8 tablas** de Operaciones y
**verifica su propia cobertura** contra la Meta API de Airtable: si alguien crea una
tabla y no la añade aquí, el fichero sale marcado `PARCIAL` y el correo lo dice.

Ese aviso llevaba semanas activo y era correcto: faltaban `Empresas` y `Contactos`.
Se añadieron el 31/08 — **218 registros de la capa de identidad comercial no tenían
ninguna copia**. Copia verificada: 407 registros, sin prefijo PARCIAL.

**Para añadir una tabla hacen falta tres cosas**, y olvidar una deja el backup
silenciosamente incompleto: un nodo Airtable, su entrada en `Combinar Resultados`
(subir `numberInputs`) y su línea en el array `TABLAS` del constructor.

## 5. Trampas de n8n aprendidas con evidencia

Cada una costó un fallo real. Están aquí para no volver a pagarlas.

### `new URL()` NO existe en el sandbox del nodo Code
Probado en la ejecución 1917: la primera versión del validador anti-SSRF de
`DIR/Executive Board` lo usaba y **rechazaba todas las fuentes, incluidas las
legítimas**. Peor aún, en `AAA/Radar Comercial IA` estaba dentro de un `try/catch`,
así que la excepción se tragaba en silencio y la extracción de página interna
**nunca funcionó ni un solo día**. Hay que parsear las URL a mano.

### Un nodo que recibe 0 items NO se ejecuta
Y referenciarlo después con `$('Nodo')` desde un Code lanza
`ExpressionError: hasn't been executed`. Esto tumbó `ADM/Identidad Comercial`
durante 6 días. El patrón seguro:

```js
function itemsDe(nombreNodo) {
  try { return $(nombreNodo).all().map(i => (i && i.json) || {}); }
  catch (e) { return []; }
}
```

### El cuerpo de una respuesta HTTP llega en `data`, no en `body`
Con `fullResponse: true`, el cuerpo va a la propiedad de salida por defecto, que es
`data`. Leer `body` da `undefined`. Conviene fijar `outputPropertyName`
explícitamente para que el contrato entre nodos sea inequívoco.

### Un nodo Airtable que falla NO lanza excepción
Con `onError: continueRegularOutput` devuelve un item con `.error`. Sin comprobarlo,
una tabla que falló se registra como `0 registros` — un backup incompleto con
aspecto de backup correcto, que es el peor fallo posible.

### Airtable limita a 5 peticiones/segundo y por base
Un `429 RATE_LIMIT_REACHED` sin reintento pierde el trabajo hecho. Costó 6
generaciones de propuesta: el documento se generó, Gemini se pagó, y no se guardó.
**Todo nodo externo necesita `retryOnFail` con espera > 0.**

### `alwaysOutputData` es un arma de doble filo
Hace que una tabla vacía emita un item `{}`. Útil cuando el caso vacío tiene su
propia rama; peligroso cuando aguas abajo se leen campos que no existen.

### Guardar un workflow NO lo publica

La trampa más cara encontrada hasta la fecha, porque no produce ningún error:
la ejecución sigue saliendo verde mientras produccion corre codigo viejo.

n8n mantiene dos versiones de cada workflow: el **borrador** (lo que se ve y
se edita) y la **version activa** (lo que ejecutan los disparadores). Guardar
escribe el borrador. Publicar es un paso aparte. En `get_workflow_details` se
ven como `versionId` frente a `activeVersionId`, y el campo `activeVersion.
sameAsDraft: false` lo dice directamente.

**Las ejecuciones manuales corren el BORRADOR; las programadas, la version
activa.** Por eso una prueba a mano puede salir perfecta y el disparador de
la manana seguir fallando: no estan ejecutando lo mismo. Este detalle fue lo
que permitio diagnosticarlo el 01/09/2026, al ver que la misma fuente RSS
devolvia items reales a las 23:05 (manual) y "NO VERIFICADO" a las 04:30
(programada).

Casos reales encontrados el 01/09/2026, los dos en workflows activos:

- `DIR/Executive Board - Recolector Externo` — el borrador sustituia el nodo
  `rssFeedRead` por un HTTP Request con `followRedirects:false` y parser XML
  propio, es decir **cerraba un agujero de SSRF**. Guardado el 31/08 a las
  23:00, sin publicar. Produccion llevaba un dia entero con el agujero
  abierto y el propio codigo activo lo admitia en un comentario.
- `FNZ/Dashboard - Calculo KPIs` — borrador sin publicar desde el 24/08, ocho
  dias. Anadia la declaracion, decidida por Direccion, de que la autoridad
  financiera es D-Code Finance y no Airtable. Sin cambiar ni un importe.

Comprobacion: recorrer los workflows activos y comparar `versionId` con
`activeVersionId`. Antes de publicar un borrador ajeno, **ejecutarlo y medir
lo que produce** — y si toca dinero, comparar las dos versiones linea a linea
antes de tocar nada.

### Coincidencia de subcadena sobre texto de terceros

El 01/09/2026, nueve de las veintisiete filas de la tabla Supresiones eran
boletines de proveedores -Airtable cinco veces, Neon cuatro- clasificados como
"Oposicion expresa" porque la palabra `unsubscribe` aparece en su pie. La lista
`oposicionKeywords` de `CM/Deteccion de Respuestas` se buscaba como subcadena
sobre el CUERPO COMPLETO del correo.

Y una de esas filas llego a suprimir el propio buzon operativo de D-Code: un
aviso interno generado a partir de un boletin volvio a la bandeja y se leyo
como la oposicion de un tercero.

**La correccion no fue tocar la lista de palabras.** Debilitar la deteccion
arriesga perder una oposicion real, que es mucho peor que un falso positivo.
Lo que fallaba era el detector de correo masivo: solo miraba `Precedence: bulk`,
la convencion vieja. Las plataformas de marketing actuales usan
`List-Unsubscribe` (RFC 2369 / RFC 8058), que no se estaba mirando.

Un mensaje con `List-Unsubscribe` **es por definicion** correo de lista, y esa
cabecera la pone el gestor de listas del remitente, no la persona: alguien que
contesta "no estoy interesado" desde su buzon jamas la lleva. Anadirla al
bloque que ya descartaba `Precedence: bulk` elimina los falsos positivos sin
poder perder ni un positivo real.

REGLA GENERAL: cuando haya que distinguir texto escrito por una persona de
texto generado por una maquina, buscar la senal en los METADATOS del mensaje,
no en su cuerpo. El cuerpo lo controla el remitente; las cabeceras de lista
las pone su infraestructura.

### Lo que el sistema sabe decir y lo que no

Este ecosistema tiene un vocabulario excelente para la incertidumbre:
`NO VERIFICADO`, `SIN DATOS`, el prefijo `PARCIAL` en los ficheros de backup,
el `(INCOMPLETO)` en el asunto de los correos. En toda la auditoria del
01/09/2026 no se encontro ni un solo cero inventado ocupando el sitio de un
fallo.

No tiene ninguna palabra para decir "esto lleva seis dias roto y nadie ha
hecho nada". Cada aviso cuenta un fallo suelto; ninguno cuenta la racha. Por
eso el backup pudo gritar PARCIAL cada domingo, el informe ejecutivo llegar
marcado (INCOMPLETO) doce dias seguidos y la sincronizacion de identidad caer
cinco madrugadas, sin que nada de eso escalara.

El sistema mide la VERDAD de cada dato. No mide el TIEMPO QUE LLEVA ABIERTO
un problema. `lib/automatizaciones/rachas.ts` en D-Code OS ya cuenta rachas
-y define bien el corte: el primer exito- pero solo se pintan en pantalla, y
mirar una pantalla es justamente lo que fallo.

## 6. Cadencias

Ver `AUD-20260830-CADENCIAS-001` para el análisis completo. Lo esencial:

- **`SP/Seguimiento de Tickets` corre cada hora y así debe seguir.** El SLA
  documentado en la tabla `Tickets` es **Crítica 2 h**, y el aviso debe salir *antes*
  de vencer. Una pasada horaria da como mucho una oportunidad de avisar. No es
  despilfarro: está dimensionado al compromiso que la empresa se fijó.
- **No hay ninguna automatización de Airtable en `Operaciones`.** Nada avisa a n8n de
  que se ha creado un ticket o una tarea, así que el sondeo es la única forma de
  enterarse — y por eso bajar la frecuencia sube directamente la latencia.
- **Regla de seguridad:** una tabla vacía nunca justifica por sí sola ralentizar una
  automatización. La señal válida es si hay clientes en `Modo = Producción`.

## 7. Construido y sin uso

Conviene saberlo antes de prometerlo o de buscar por qué no pasa nada:

- **Video Factory completa** (`VF/00`–`VF/10`, 11 workflows): 100 % inactiva.
- `MK/SEO IA`: desactivado. **Retirado del catálogo comercial** (v1.2 del documento
  de monetización) mientras siga así.
- `MK/Newsletter IA`, `MK/Contenido IA Redes Sociales`, `CF/Memory + Diversity Gate`:
  inactivos.
- `AAA/AI Factory Orchestrator`: contenedor vacío, 0 nodos. Se conserva por la regla
  **DESACTIVAR > BORRAR**.
- `OS/Reloj de Verificaciones`: el puente n8n ↔ D-Code OS está construido pero **sin
  conectar** — le falta el dominio de producción y el secreto HMAC.
- `MK/Lead IA 360`: activo y correcto, pero **sin ejecuciones en ≥12 días**. El
  workflow no tiene ningún defecto; simplemente nadie ha enviado el formulario.

## 9. Redirecciones sin reabrir el SSRF

El recolector del Executive Board no sigue redirecciones, y es deliberado: su
validacion anti-SSRF comprueba la URL ANTES de pedirla, asi que un 302 hacia
`http://169.254.169.254/` llevaria a un destino que nunca paso por el filtro.

El efecto colateral apareció el 01/09/2026: **un 301 legitimo se lee como
fuente caida**. Le pasaba a Google AI Blog, que solo habia cambiado de
direccion.

La tentacion es activar `followRedirects`. No se hace. Lo que abre el agujero
no es seguir una redireccion: es seguir una redireccion SIN REVALIDARLA. La
propiedad que hay que conservar es que **toda URL que alguna vez se pida haya
pasado por el validador**.

De ahi `ADM/Salud de Fuentes de Vigilancia`, que resuelve el caso sin tocar el
recolector:

1. Pide la URL con `followRedirects:false`, `fullResponse:true` y
   `neverError:true`. Asi puede LEER la cabecera `Location` sin seguirla.
2. Si es 301 o 308, resuelve el destino y **lo pasa por el mismo validador**.
   Una `Location` relativa se resuelve solo contra el origen original;
   cualquier otra forma se rechaza e informa.
3. Solo entonces corrige la URL en la tabla, dejando la anterior en `Notas`.

Un 301 permanente significa que la direccion guardada esta caducada, y eso se
arregla UNA VEZ en la configuracion, no siguiendo la redireccion cada dia para
siempre. El recolector sigue igual de estricto que antes.

Un 302/303/307 es TEMPORAL y no se toca: el servidor esta diciendo que la URL
canonica sigue siendo la guardada, y cambiarla seria lo contrario de lo que
pide.

### Una fuente que no responde no es una fuente muerta

Verificado el 01/09/2026 sobre las 11 fuentes activas:

| Codigo | Significa | Accion |
|---|---|---|
| 410 | Retirada para siempre | Desactivar |
| 404 | Responde, pero ahi ya no hay nada | Buscar URL nueva o desactivar |
| 301/308 | Direccion caducada | Corregir la URL (automatico) |
| 302/307 | Desvio temporal | No tocar |
| 429 | Limitando el ritmo | No tocar |
| 5xx | Problema del servidor ajeno | No tocar, suele ser pasajero |
| 200 sin `<item>` | Responde pero no es un feed | Revisar |

De cinco fuentes que se daban por caidas, **solo una lo estaba**. Google era
un 301, Hacker News un 502 pasajero. Y de las dos con 404 —Anthropic y Meta—
se comprobo ademas por busqueda web que **ninguna de las dos publica feed RSS
oficial**: la URL guardada era una suposicion sobre una ruta convencional que
nunca existio. No habia nada que reparar.

## 10. El patron que rompio el Executive Board, y donde mas estaba

El informe ejecutivo llego truncado diez de doce dias. La causa no fue el
modelo: fue como se le pedia la respuesta. Cuatro cosas a la vez:

1. `max_tokens` por debajo de lo que la respuesta necesitaba.
2. Un esquema de salida sin ningun tope.
3. Arrays sin limite de elementos.
4. **El campo mas importante declarado casi al final.** Cuando la respuesta se
   cortaba, lo primero que se perdia era la decision ejecutiva.

El 01/09/2026 se reviso si el mismo patron estaba en otros procesos de IA.

### Lo que hay que mirar, en este orden

**Primero, la DIRECCION DEL FALLO, no la forma del esquema.** Un array sin
limite no es un defecto por si solo. Lo que importa es que pasa cuando la
respuesta llega recortada:

- Si el consumidor no puede parsearla y **bloquea**, el esquema sin topes es
  aceptable. `RRSS/06 QA-A` es asi: tiene arrays sin limite y campos criticos
  detras de ellos, pero si el QA no devuelve veredicto valido la pieza se
  marca REJECTED con el motivo *"un QA caido nunca equivale a un PASS"*. Falla
  hacia el lado seguro.
- Si el consumidor **sigue adelante con datos incompletos**, hay defecto,
  aunque el esquema parezca inofensivo.

**Segundo, si el consumidor DA POR HECHO un tamano.** Este es el fallo
silencioso, y es el que se encontro en `CF/Investigacion`: el prompt pide
"EXACTAMENTE 6 ideas" y el codigo reparte estados con `i < 3 ? APROBADA :
DESCARTADA`. Ese corte solo tiene sentido si hay seis candidatas. Con una
respuesta recortada de dos ideas, las DOS salian aprobadas y el correo
anunciaba su "top 3 por score editorial". Un top 3 de dos candidatas no es una
seleccion: es todo lo que habia, presentado como si se hubiera elegido.

Corregido verificando el recuento antes de repartir estados.

**Tercero, el orden de los campos.** Lo que decide algo va PRIMERO. Si la
respuesta se corta, que se pierda el detalle, no el veredicto.

### La regla, para lo que se construya despues

> Si un proceso pide a un modelo una respuesta estructurada, el consumidor
> tiene que **verificar que recibio lo que pidio** antes de usarlo. No basta
> con que el JSON parsee: si se pidieron seis elementos y llegan dos, eso es
> un fallo, no un dia flojo.

Y el corolario que evita el otro error: **poner un `max_tokens` bajo no es la
solucion, es la causa original.** El limite debe ser holgado respecto a la
salida esperada; la garantia la da la comprobacion en el consumidor.

### Estado de la revision

| Workflow | Riesgo de truncamiento | Veredicto |
|---|---|---|
| `DIR/EB Director Estrategico` | Era el origen | **Implementacion de referencia** (ver abajo) |
| `CF/Investigacion` | Array sin topes + consumidor asumia 6 | **Defecto, corregido** |
| `FNZ/IA Financiera` | Texto libre sin comprobar `stop_reason` | **Defecto, corregido** |
| `RRSS/06 QA-A` | Arrays sin topes, campos criticos detras | Seguro: falla en cerrado |
| `SP/Tickets IA` | Esquema de 2 campos, critico el primero | Seguro |
| `MK/Lead IA 360` | 7 campos planos, critico el primero, fallback explicito | Seguro |

### El patron tambien existe en texto libre

`FNZ/IA Financiera` no devuelve JSON: devuelve prosa. Parecia fuera del
patron, y no lo estaba. El consumidor solo comprobaba que HUBIERA texto, sin
mirar `stop_reason`, asi que una respuesta cortada se entregaba como si
estuviera entera.

Y lo que se pierde al cortar no es cualquier cosa. El prompt exige separar
HECHO de INFERENCIA y decir explicitamente "no tengo informacion suficiente
para responder esto con precision porque...". Esas salvedades van al final del
razonamiento: son justo lo primero que desaparece. Quedaria la parte que suena
segura y se perderia la que avisa.

Corregido comprobando `stop_reason` y anteponiendo el aviso al texto -delante,
no al final, porque si algo se lee por encima se lee el principio-.

### Que hace bien el Executive Board, para copiarlo

Es la referencia porque hace las cuatro cosas a la vez:

1. `stop_reason === 'max_tokens'` se comprueba y provoca el modo degradado,
   con `(INCOMPLETO)` en el asunto del correo.
2. Los dos arrays llevan `maxItems` (5 riesgos, 4 ideas).
3. **`decision_ejecutiva_dia` se declara ANTES de los arrays.** El modelo emite
   el JSON en el orden del esquema, asi que lo que se corta es siempre la cola:
   el campo que da sentido al informe ya no puede ser el primero en caer.
4. `max_tokens` holgado (16000 para una salida real de 5-6k), con la salida
   acotada por construccion y tambien pedida en palabras dentro del prompt.

Sin revisar todavia: `RRSS/02`, `RRSS/03`, `RRSS/04`, `RRSS/06-B`,
`CM/Generador de Propuestas IA`, `FNZ/Gastos - Registro` y `SP/Chat IA
Clientes`. Ninguno se ha declarado seguro sin mirarlo. (`DIR/EB Auditor
Interno` no llama a ningun modelo: mide y escribe, asi que el patron no le
aplica.)
