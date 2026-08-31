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
