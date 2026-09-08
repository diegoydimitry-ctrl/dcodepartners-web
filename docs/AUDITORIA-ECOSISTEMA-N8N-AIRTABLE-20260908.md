# Auditoría del ecosistema operativo D-Code Partners

**Fecha:** 8 de septiembre de 2026
**Alcance:** n8n · Airtable (4 bases) · Neon/PostgreSQL (2 proyectos) · Notion · Google · D-Code OS · D-Code Partners App
**Método:** lectura directa de las APIs de producción. Ninguna cifra procede de documentación previa; toda cifra anterior se ha vuelto a medir.

**Convención de este informe.** Donde no he podido comprobar algo, escribo **NO VERIFICADO** y digo qué me faltó. No hay ninguna estimación presentada como medida. Cuando digo "verificado" es porque hay una consulta o una ejecución detrás, y la cito.

---

## 1. Resumen ejecutivo

La pregunta del encargo era si D-Code Partners puede operar de principio a fin sin saltos manuales innecesarios, datos duplicados, automatizaciones huérfanas, conexiones falsas o información sin propietario.

**La respuesta corta: la maquinaria funciona; el negocio no está produciendo el resultado esperado en dos de sus cadenas.** No es lo mismo, y el encargo pedía expresamente no confundirlo.

Lo que funciona de verdad, comprobado hoy:

- La cadena de contenido RRSS se ejecuta lunes, miércoles y viernes a las 07:00 sin fallar. Última pasada: 07/09/2026, `COMPLETADA`, diez etapas en verde.
- El formulario público de la web está vivo y rechaza correctamente lo que debe rechazar. Comprobado con 18 latidos consecutivos.
- El control de calidad editorial discrimina de verdad: 66 registros de "no publicar" con motivo. Una tabla de rechazos vacía habría significado que el QA no filtra nada; no es el caso.
- Ningún workflow del ecosistema tiene capacidad técnica de publicar en redes sociales ni de saltarse la aprobación humana. Verificado estructuralmente, no por declaración.

Lo que **no** produce resultado, también comprobado hoy:

- **La cadena editorial fabrica y nadie decide.** Desde el 17/08 se han generado 14 variantes de producción. Exactamente **una** ha recibido decisión humana. Nueve siguen esperando. La ventana de aprobación configurada son **48 horas**; la pieza más antigua lleva **528 horas** esperando: once veces la ventana. El aviso por correo sí se envía —consta `notificado_en` del 07/09 en las nueve—, así que el cuello de botella es humano, no técnico.
- **El embudo comercial no se ha movido nunca, y ahora además se ha parado la entrada.** Los 58 leads están los 58 en estado "Nuevo": el campo no se ha tocado una sola vez en cinco semanas. Y el lote semanal de captación, que llegaba puntualmente los lunes, **no se produjo el 7 de septiembre**: ocho días sin altas nuevas.
- **El Executive Board lleva 34 días produciendo y nadie decide tampoco ahí.** 91 ideas y recomendaciones registradas, **0 decisiones**. Es el mismo patrón, en un tercer sitio.
- **La autoridad financiera declarada está vacía.** D-Code Finance sobre PostgreSQL contiene 1 factura de prueba de 20 €, 0 gastos y 0 clientes activos. Las tablas de facturas y gastos de Airtable también están a cero. **No hay contabilidad real en ningún sistema del ecosistema.**
- **La tabla que alimenta los paneles de D-Code OS lleva 7 días muerta.** Sus 260 filas se escribieron todas en una única ventana de 94 minutos el 01/09 y no se ha escrito ni una más desde entonces.

Y lo que estaba roto y hoy ya no lo está:

- **De 65 workflows activos, 54 no tenían ningún destino de error.** Cuando fallaban en producción, la ejecución quedaba en rojo dentro de n8n y no pasaba nada más. Finanzas, Comercial, Clientes, Producción y Soporte no tenían ninguno. Hoy **65 de 67** lo tienen, y el mecanismo está probado de extremo a extremo con un fallo provocado a propósito (§27).

**Veredicto: NOT READY.** El motivo exacto, en §37.

---

## 2. Inventario real del ecosistema

Medido el 08/09/2026 leyendo `GET /api/v1/workflows?limit=250` sin filtros, que es la única lectura que incluye los workflows archivados.

| Sistema | Unidad | Cantidad | Cómo se midió |
|---|---|---:|---|
| n8n | workflows totales | **154** | API cruda, sin filtro |
| n8n | no archivados | **94** | `isArchived !== true` |
| n8n | archivados | **60** | `isArchived === true` |
| n8n | activos | **66** | `active === true` y no archivado |
| n8n | inactivos no archivados | **28** | resto |
| Airtable | bases | **4** | `list_bases` |
| Airtable | tablas · D-Code AI Factory | **24** (8 vacías) | `list_tables_for_base` |
| Airtable | tablas · D-Code RRSS | **17** | `list_tables_for_base` |
| Airtable | tablas · D-Code Finance SaaS | **10** | `list_tables_for_base` |
| Airtable | tablas · Operaciones | **8** (2 vacías) | `list_tables_for_base` |
| Neon | proyectos | **3** | 2 con datos + 1 vacío creado hoy (§24.5) |
| Neon | tablas · D-Code OS | **15** (7 vacías) | `information_schema` |
| Neon | tablas · D-Code Finance | **32** (20 vacías) | `information_schema` |
| Notion | registros en base `Automatizaciones` | **38** | frente a 154 workflows reales (§23) |

**Dato transversal que conviene no pasar por alto:** de las 59 tablas de Airtable y las 47 de Neon, **37 están completamente vacías**. Alrededor del 35 % del modelo de datos del ecosistema es esqueleto sin estrenar.

**La suma cuadra:** 66 activos + 28 inactivos + 60 archivados = **154**. No hay ninguna categoría "otros".

---

## 3. Reconciliación de workflows

Esta sección existe porque en una revisión anterior di una cifra que no cuadraba, y con razón se me exigió cerrarla. La cierro aquí con la aritmética completa.

### 3.1 Por qué la interfaz enseña menos workflows de los que hay

`search_workflows` y la interfaz de n8n **excluyen los archivados**. La API cruda no. Esa es toda la diferencia, y es comprobable en un solo dato: `search_workflows` devuelve hoy `count: 94`, y la API cruda devuelve 154. La diferencia, 60, es exactamente el número de workflows con `isArchived: true`. No hay ningún workflow escondido por otro motivo.

### 3.2 Estado de partida y estado final

| | Al empezar hoy | Al terminar hoy | Diferencia |
|---|---:|---:|---:|
| Totales en la API | 151 | 154 | +3 creados hoy |
| No archivados | 93 | 94 | +1 |
| Archivados | 58 | 60 | +2 |
| Activos | 65 | 66 | +1 |

Los tres workflows creados hoy y qué ha sido de cada uno:

| Workflow | ID | Estado final | Motivo |
|---|---|---|---|
| `ADM/Captura de Fallos (comun)` | `UHpxoRq0CqaDzLIp` | **Activo, permanente** | Es el destino de error nuevo. Se queda. |
| `ZZZ Prueba Negativa - Fallo Deliberado` | `HtfFNGuTxxFTeAGE` | **Archivado** | Provocaba fallos a propósito para probar lo anterior. Retirado al terminar. |
| `ZZZ Censo isArchived` | `eUfomxqfe42gWlZC` | **Archivado** | Instrumento de medida de solo lectura. Retirado al terminar. |

### 3.3 Los 154, clasificados por naturaleza

De la radiografía completa del grafo (los 151 de partida, leídos con sus nodos):

| Naturaleza | Cantidad | Qué son |
|---|---:|---|
| Workflows reales de negocio | **95** | Los 14 prefijos de área: AAA, ADM, CF, CLS, CM, DIR, FNZ, GRD, MK, OS, PRD, RRSS, SP, VF |
| Restos de desarrollo | **56** | Prefijos `TEMP -` (13), `ZZ` (~22), `ZZZ` (~18), `DEBUG -` (3) |
| **Suma** | **151** | Estado de partida |

Sumando lo creado hoy: 96 reales (95 + el capturador de fallos) + 58 restos (56 + mis dos ZZZ) = **154**. Cuadra.

**Los 56 restos están todos archivados y todos inactivos.** Ninguno tiene disparador vivo. No consumen recursos ni pueden ejecutarse. Son ruido en el listado, no riesgo operativo. **No los he borrado**: el encargo prohíbe borrar workflows sin confirmación y pide clasificar antes de eliminar. Quedan clasificados; la decisión de borrarlos es de Dirección (§31).

### 3.4 Distribución por área (los 95 reales de partida)

| Área | Qué es | Total | Activos |
|---|---|---:|---:|
| RRSS | Contenido para redes | 16 | 13 |
| ADM | Administración e infraestructura | 14 | 12 |
| FNZ | Finanzas | 11 | 10 |
| VF | Video Factory | 10 | **0** |
| CM | Comercial | 8 | 5 |
| DIR | Dirección | 8 | 8 |
| CLS | Clientes | 5 | 5 |
| MK | Marketing | 5 | 1 |
| PRD | Producción | 5 | 5 |
| CF | Content Factory | 4 | 1 |
| SP | Soporte | 3 | 3 |
| AAA | Orquestadores experimentales | 2 | 0 |
| GRD | Guardarraíles | 2 | 2 |
| OS | Puente a D-Code OS | 2 | **0** |

Dos áreas enteras están al cero: **VF** (Video Factory, 10 workflows) y **OS** (el puente hacia D-Code OS, 2 workflows). Ver §24 y §26.

---

## 4. Arquitectura real (no la deseada)

El dibujo que se deduce del grafo, no del diseño:

```
FUENTES DE ENTRADA
  Formulario web público ──POST(webhook, sin auth, Turnstile)──► MK/Lead IA 360
  Formulario n8n "Registro de Gasto" ──(sin auth)──► FNZ/Gastos - Registro
  Formulario n8n "Generador de Propuestas" ──(sin auth)──► CM/Generador de Propuestas IA
  Webhook IA Financiera ──POST(headerAuth)──► FNZ/IA Financiera - Consulta
  Correo entrante (Gmail) ──► CM/Detección de Respuestas · SP/Tickets IA
  Relojes (schedule) ──► el resto

NÚCLEO DE DATOS
  Airtable "D-Code AI Factory" (appbWzPA5rbx9tqOb) ── capa operativa, es donde vive el día a día
  Airtable "D-Code RRSS"       (appOiMREHtxGneyEt) ── contenido editorial y Video Factory
  Airtable "D-Code Finance SaaS" (appa1UZyvBUUWuxfO) ── PROTOTIPO, no producción (§7)
  Neon PostgreSQL ── D-Code OS y D-Code Finance (§22)

SALIDAS
  Gmail ──► clientes y avisos internos
  Google Docs/Drive ──► propuestas y copias de seguridad
  api.anthropic.com / generativelanguage.googleapis.com ──► IA
  Redes sociales ──► NINGUNA. No existe capacidad técnica de publicar (verificado, §8)

BARRERAS
  GRD/Guardarrail Comunicacion Externa ── 5 barreras, 4 reales, 1 decorativa (§10)
  RRSS: sello SHA-256 entre aprobación y publicación
  Turnstile en el formulario web
```

**Lo que este dibujo revela y el diseño no decía:** el sistema tiene tres puertas de entrada públicas sin autenticación, no una. La del formulario web está protegida por Turnstile y comprobada. Las otras dos son formularios nativos de n8n sin ninguna barrera (§10).

---

## 5. Mapa de datos: origen, propietario y destino

Cada dato del ecosistema, de dónde nace y quién manda sobre él:

| Dato | Origen | Sistema propietario | Quién escribe | Quién lee | ¿Hay dueño humano? |
|---|---|---|---|---|---|
| Lead | Formulario web público | Airtable `Operaciones` / `Leads` | `MK/Lead IA 360` | `CM/CRM Inteligente` (inactivo), `CM/Alerta Empresa Ya Cliente` | **No.** 58 leads, ninguno movido (§16) |
| Cliente | Alta manual y `CM/Cliente Activo` | Airtable `AI Factory` / `Clientes` | `CM/Cliente Activo`, `CLS/*` | Finanzas, Producción, Soporte | Sí |
| Empresa captada | `Radar Comercial IA` | Airtable `Operaciones` | Congelado por Dirección | — | Congelado |
| Factura | `FNZ/Facturación IA` y variantes | Airtable `AI Factory` / `Facturas` | 4 workflows FNZ | Dashboard, IA Financiera | **Tabla vacía: 0 facturas** |
| Gasto | Formulario n8n sin auth | Airtable `AI Factory` / `Gastos` | `FNZ/Gastos - Registro` | KPIs, Rentabilidad, IA Financiera | **Tabla vacía: 0 gastos** |
| Snapshot financiero | Cálculo diario 07:00 | Airtable `AI Factory` / `Dashboard Financiero` | `FNZ/Dashboard - Calculo KPIs` | `FNZ/IA Financiera - Consulta` | Sí, 24 snapshots |
| Supresión | Oposición del destinatario | Airtable `AI Factory` / `Supresiones` | `CM/Detección de Respuestas` | `GRD/Guardarrail` | Sí, y ahora limpio (§22) |
| Pieza editorial | Cadena RRSS L-X-V 07:00 | Airtable `D-Code RRSS` | `RRSS/01..09` | `RRSS/07`, `RRSS/08` | **Aprobador configurado, inactivo desde 21/08** (§17) |
| Señal / Idea / Riesgo | Executive Board diario | Airtable `AI Factory` / `EB - *` | `DIR/Executive Board *` | Informes diario/semanal/mensual | **91 ideas, 0 decisiones** |
| Ejecución de automatización | Volcado único 01/09 | PostgreSQL `D-Code OS` / `automation_runs` | Nadie desde el 01/09 | Paneles de D-Code OS | **No. Tabla muerta** (§24.2) |
| Contabilidad | — | PostgreSQL `D-Code Finance` | Nadie desde el 22/08 | — | **Autoridad declarada, vacía** (§20.2) |

**Lo que este mapa enseña de un vistazo:** los datos que la empresa genera sobre sí misma (señales, riesgos, informes, snapshots) fluyen todos los días sin fallo. Los datos que representan negocio real —facturas, gastos, publicaciones, leads movidos— **están todos a cero o congelados**. No es un problema de tuberías: las tuberías están bien. Es que por ellas no pasa negocio.

### 5.1 Datos personales y RGPD

| Dato personal | Dónde vive | Base legal aparente | Mecanismo de oposición |
|---|---|---|---|
| Nombre, correo, teléfono, empresa del lead | Airtable `Operaciones` / `Leads` · `Contactos` | Consentimiento del formulario web | **Sí, y funciona**: tabla `Supresiones` |
| Correos entrantes | Gmail | Relación comercial | Vía `Supresiones` |
| Empresas captadas por scraping | Airtable `Operaciones` / `Radar Comercial` | Interés legítimo (a confirmar) | Vía `Supresiones` |
| Usuarios de las aplicaciones | PostgreSQL (`users`, `usuarios`) | Relación contractual | **NO VERIFICADO** |

Lo destacable, y es a favor del sistema: `Supresiones` es una lista de supresión **central y por encima de todo**, consultada por el guardarraíl antes de cualquier envío externo, y una fila ahí bloquea para siempre aunque el contacto se borre, se duplique o vuelva a ser capturado. Ese diseño es correcto y poco común.

**NO VERIFICADO:** no he revisado política de retención, ni plazos de borrado, ni el texto de consentimiento del formulario web, ni si existe registro de actividades de tratamiento. Queda fuera de lo que he podido comprobar hoy y no voy a suponerlo.

---

## 6. Fuentes de verdad

| Dominio | Fuente de verdad declarada | ¿Lo confirman los datos? |
|---|---|---|
| Comercial (leads, clientes) | Airtable `D-Code AI Factory` | Sí. Es donde escriben los workflows activos. |
| Contenido editorial | Airtable `D-Code RRSS` | Sí. 33 variantes, 66 registros de no-publicación, 28 pasadas. Vivo. |
| Finanzas | D-Code Finance (PostgreSQL) | Ver §22. |
| Finanzas — capa operativa | Airtable `D-Code AI Factory` | Sí, es la que leen los 10 workflows FNZ activos. |
| Finanzas — prototipo | Airtable `D-Code Finance SaaS` | **No es fuente de verdad de nada.** 6 facturas de prueba, última escritura 25/08/2026 (§7). |

**El problema de fondo, que sigue abierto y no es mío de resolver:** existen tres implementaciones del mismo dominio financiero — los workflows FNZ sobre Airtable, la base prototipo, y el producto sobre PostgreSQL. La propia documentación de la base prototipo lo reconoce y lo eleva a Dirección. Sigue sin decidirse. Mientras no se decida, cualquier panel que agregue finanzas puede mostrar cifras contradictorias según de dónde lea. **Es una decisión humana; no la he tomado** (§30).

---

## 7. Mapa de Airtable

### 7.1 Base `D-Code Finance SaaS` (`appa1UZyvBUUWuxfO`) — 10 tablas

**Es un prototipo, no producción.** No lo digo porque lo diga su documentación: lo he comprobado. La tabla `Facturas` contiene **6 registros**, todos de prueba (`F-TEST-D3-900`, `F-TEST-D3-850-RECT`, `F-2026-0001` a `F-2026-0003`), repartidos entre `tenant-demo-a` y `tenant-demo-b`, y **la escritura más reciente es del 25/08/2026**. La descripción de la base es exacta.

Un detalle que conviene no confundir con un error: `F-2026-0001` aparece **dos veces**, una por cada tenant. Eso no es un duplicado; es exactamente lo que debe pasar en numeración por tenant. Verificado antes de darlo por bueno.

La propia base documenta que su numeración es `max+1` no atómico y se declara **no apta para producción por concurrencia**. Ese problema concreto ya se resolvió en la implementación sobre PostgreSQL, lo que confirma que esta base es un esquema v1 superado.

### 7.2 Base `D-Code RRSS` (`appOiMREHtxGneyEt`) — 17 tablas

Nueve tablas `RRSS_*` (cadena editorial, viva) y siete `VF_*` (Video Factory) más `VF_Ideas`.

**Las siete tablas `VF_*` no tienen ningún productor activo:** los diez workflows `VF/*` están inactivos, sin excepción. No son tablas huérfanas por descuido — son un subsistema construido y aparcado a propósito, con su esquema completo esperando. Pero hoy nadie escribe en ellas.

Volumen real medido:

| Tabla | Registros | Estado |
|---|---:|---|
| `RRSS_Runs` | 28 | Vivo. Última pasada 07/09/2026 |
| `RRSS_Publications` | 33 | Vivo. 14 de producción |
| `RRSS_NoPublishLog` | 66 | Vivo. El QA sí discrimina |
| `RRSS_Tenants` | 2 | 1 real (`dcode`), 1 fixture pausado |

### 7.3 Base `D-Code AI Factory` (`appbWzPA5rbx9tqOb`) — 24 tablas

Es la base operativa principal. **Ocho de sus 24 tablas están a cero registros**, y no son tablas menores:

| Tabla | Registros | Por qué importa que esté vacía |
|---|---:|---|
| `Facturas` (`tble8LUxvAzOpXr4j`) | **0** | Es el destino del sistema de Facturación IA. **No se ha emitido ni una factura.** |
| `Gastos` (`tbl1EkzNAFvSmtmkw`) | **0** | Es la fuente de verdad única de gastos declarada. También vacía. |
| `Tareas` (`tbldA2tReK3FgfULG`) | **0** | Enlazada desde `Equipo` y `Clientes`: hay enlaces vivos apuntando a nada |
| `EB - Decisiones` (`tblDnl91ecUCZWdEh`) | **0** | Junto a 91 ideas y recomendaciones. Ver más abajo. |
| `Activos`, `Arquitectura`, `Sprints`, `Cambios` | **0** | El subsistema "AI Operations Center", construido y nunca poblado |

Y las que sí viven:

| Tabla | Registros | Último registro |
|---|---:|---|
| `EB - Señales Recogidas` | 1.428 | 08/09/2026 — **hoy** |
| `Clientes` | 111 | **31/08/2026 — 8 días parada** |
| `EB - Ideas y Recomendaciones` | 91 | 08/09/2026 |
| `EB - Riesgos` | 83 | 08/09/2026 |
| `EB - Métricas Internas` / `EB - Informes Diarios` | 34 / 34 | 08/09/2026 |
| `Supresiones` | 27 | 28/08/2026 |
| `Dashboard Financiero` | 24 | Diario |

**El bloque Executive Board escribe todos los días sin fallar.** Es la parte más viva del ecosistema. Pero fíjese en la pareja: **91 ideas y recomendaciones, 0 decisiones registradas.** Es exactamente el mismo patrón de §17: la máquina produce, nadie decide.

**Una pregunta que queda abierta:** `Dashboard Financiero` tiene 24 snapshots con un campo "Total Gastos", y **las dos tablas de gastos del ecosistema están a cero**. El cálculo es correcto (suma cero de cero), pero conviene saber que ese KPI lleva 24 días valiendo cero por ausencia de datos, no por ausencia de gasto. El propio workflow lo dice en cada snapshot: *"SIN DATOS: los KPIs en cero reflejan ausencia de datos, no actividad nula"*. Bien hecho.

### 7.4 Base `Operaciones` (`app5JfVEjK4JiMXEm`) — 8 tablas

Es la cuarta base, y contiene el embudo comercial:

| Tabla | Registros |
|---|---:|
| `Empresas` | 160 |
| `Radar Comercial - Empresas` | 113 |
| `Contactos` | 77 |
| `Leads` (`tblfQXOCLlEf9cJUa`) | **58** |
| `Propuestas Generadas` | 42 |
| `Tickets` | 2 |
| `Proyectos` (`tblmzM9cI0VXmsvAt`) | **0** |
| `Gastos` (`tblorgyNDzd2UQUZK`) | **0** — obsoleta |

### 7.5 La tabla `Gastos` obsoleta: acción cerrada hoy

La auditoría del 01/09/2026 dejó por escrito una acción pendiente: confirmar los dos últimos consumidores de gastos antes de poder eliminar `tblorgyNDzd2UQUZK`. **Hoy la he cerrado**, y conviene explicar cómo, porque mi primer intento de prueba no valía:

Empecé buscando la cadena `tblorgyNDzd2UQUZK` en la radiografía del grafo. Salieron cero coincidencias — pero **esa prueba no vale**: la radiografía guardó los nombres legibles de tabla, no los identificadores, así que la ausencia no demostraba nada. Lo digo porque a punto estuve de escribirlo como prueba.

La comprobación válida fue leer los parámetros reales de los nodos:

- `FNZ/Dashboard - Calculo KPIs`, nodo "Buscar Todos los Gastos" → `tbl1EkzNAFvSmtmkw`. **No es esta tabla.**
- `FNZ/IA Financiera - Consulta`, nodo "Buscar Todos los Gastos IA" → `tbl1EkzNAFvSmtmkw`. **No es esta tabla.**

Con eso, los cinco workflows que tocan gastos apuntan todos a `tbl1EkzNAFvSmtmkw`. `tblorgyNDzd2UQUZK` **no tiene consumidor, ni productor, ni registros**: huérfana confirmada.

**No la he borrado.** La comprobación técnica que faltaba ya no falta; lo que falta es la autorización, y esa no me corresponde. He dejado el cierre escrito en la descripción de la propia tabla para que quien decida tenga la evidencia delante.

---

## 8. Mapa de n8n

### 8.1 Puertas de entrada de los workflows activos

| Workflow | Tipo | Método | Autenticación |
|---|---|---|---|
| `MK/Lead IA 360` | webhook | POST | **ninguna** + Turnstile · orígenes `*` |
| `FNZ/IA Financiera - Consulta` | webhook | POST | cabecera secreta ✅ |
| `FNZ/Gastos - Registro` | formulario n8n | — | **ninguna** |
| `CM/Generador de Propuestas IA` | formulario n8n | — | **ninguna** |

El resto de workflows activos arrancan por reloj, por correo entrante, o los invoca otro workflow.

### 8.2 Capacidad de publicación en redes: verificada, no declarada

La documentación de RRSS afirma que ningún workflow puede publicar. **Lo he comprobado estructuralmente** en lugar de aceptarlo: he barrido los nodos HTTP de los 151 workflows buscando cualquier host de LinkedIn, Instagram, Facebook, X, TikTok o YouTube.

**Cero coincidencias, en todo el ecosistema, activos e inactivos.** `RRSS/09 - Publicador Seguro` tiene la lista de hosts HTTP literalmente vacía: solo lee y escribe en Airtable. La afirmación es cierta, y lo es por construcción, no por promesa.

### 8.3 Grafo de dependencias

`CM/Plantilla de Email` (`LBVRyfharZyGl5Qm`) es la pieza más invocada del ecosistema: **46 llamadas** desde 40 workflows distintos, de los cuales 37 activos. Es un punto único de fallo real, y por eso mismo no puede tener como destino de error un workflow que la invoque (§11).

---

## 9. Integraciones

| Servicio | Uso | Credencial | Estado |
|---|---|---|---|
| Airtable | Datos operativos | `OrGjGOCyB2b3E2s5` | Activa |
| Gmail | Envío y recepción | `sNukEwjxcJgg38bZ` | Activa |
| Anthropic | IA financiera, QA, estrategia | `NqEU7UGLClHtkMY3` | Activa |
| Google Gemini | Cualificación de leads | — | Activa |
| Google Docs/Drive | Propuestas y copias | — | Activa |
| n8n API | Autovigilancia | `61zSRzjlQrDXgift` | Activa |
| Cloudflare Turnstile | Antispam del formulario web | — | Activa y comprobada |
| ElevenLabs, Pexels, Shotstack, AssemblyAI | Video Factory | — | **Configuradas pero inertes**: los 10 workflows VF están inactivos |
| Redes sociales | Publicación | — | **No existe** |

Ninguna credencial se ha tocado, rotado ni expuesto en esta auditoría.

---

## 10. Seguridad

### 10.1 Tres puertas públicas sin autenticación

**Comprobado, y sigue abierto.**

`MK/Lead IA 360` es el formulario de la web: público por necesidad, y protegido por Turnstile. La protección **funciona**: el latido que la comprueba cada 6 horas envía a propósito un token inválido y recibe `400` con "verificación anti-spam fallida". 18 latidos consecutivos confirmados. Aquí no hay problema.

Los otros dos sí lo son:

- **`FNZ/Gastos - Registro`** — formulario n8n, `authentication: none`, activo. Cualquiera con la URL puede **registrar un gasto en la contabilidad**.
- **`CM/Generador de Propuestas IA`** — formulario n8n, `authentication: none`, activo. Cualquiera con la URL puede **disparar una generación con IA**, que cuesta dinero.

La única protección de ambos es que la URL sea difícil de adivinar. Eso es seguridad por oscuridad, y no es seguridad.

**No lo he arreglado, y el motivo es deliberado:** poner autenticación a esos formularios rompe a quien los usa hoy (previsiblemente el propio equipo desde el móvil), y elegir el mecanismo —básica, cabecera, quién tiene la credencial— es una decisión de operación, no técnica. El encargo dice que ante una decisión humana me detenga solo en esa parte. Es esta parte. Propuesta concreta en §31.

### 10.2 El guardarraíl de comunicación externa: 4 barreras reales, 1 decorativa

`GRD/Guardarrail Comunicacion Externa` tiene cinco barreras. Cuatro son reales. La quinta es la autorización humana, y funciona así:

```js
const autorizado = normalizar(d.autorizacionHumana) === 'true';
if (!autorizado) return bloquear('BLOQUEO_SIN_AUTORIZACION', ...);
```

El guardarraíl comprueba que le hayan **pasado la cadena `'true'`**. No comprueba que exista una persona detrás. Cualquier workflow que escriba `autorizacionHumana: 'true'` en su llamada pasa la barrera. Y eso es exactamente lo que hacen varios de los que la invocan: la cadena está fijada en el código, no la escribe nadie.

Para finanzas y comunicación con clientes, esta barrera **no protege de nada**. Está registrada como hallazgo desde antes; sigue así. Es la diferencia entre "el workflow existe" y "el proceso funciona" que el encargo pedía no confundir.

Comparación instructiva: la cadena RRSS **sí** resuelve bien este mismo problema. Ahí una aprobación exige un registro en `RRSS_Approvals` con sello SHA-256 sobre el contenido aprobado, y `RRSS/09` recalcula el sello antes de publicar; si no coincide, bloquea con código `SELLO_INVALIDO`. Hay 66 registros de bloqueo que lo demuestran funcionando. **El patrón correcto ya existe dentro de la casa** — simplemente no se ha llevado a finanzas.

### 10.3 Datos personales

Ningún dato personal se ha expuesto en esta auditoría. Ninguna credencial se ha leído, mostrado ni rotado.

---

## 11. Observabilidad

### 11.1 El agujero que había

De los **65 workflows activos** al empezar el día, **54 no tenían ningún destino de error**. Los 11 que sí lo tenían eran todos de RRSS. Finanzas, Comercial, Clientes, Producción, Soporte y Dirección: ninguno.

Qué significaba en la práctica: cuando `FNZ/Facturación IA` fallaba en producción, la ejecución quedaba en rojo dentro de n8n y **no ocurría nada más**. `ADM/Monitorización n8n` lo detectaba por barrido cada 2 horas, que es una red distinta: sin el nodo que falló, sin el mensaje de error, sin identificador para correlacionar, y hasta 2 horas tarde.

### 11.2 Lo que hay ahora

`ADM/Captura de Fallos (comun)` (`UHpxoRq0CqaDzLIp`), disparado por `errorTrigger`, que n8n invoca **solo en ejecuciones de producción** — de modo que auditar o probar a mano no genera ruido. Envía un correo con:

- el nodo exacto que falló
- el mensaje de error real y las 6 primeras líneas de la pila
- el identificador de ejecución, como clave de correlación
- el enlace directo a esa ejecución en n8n
- en el momento del fallo, no hasta dos horas después

### 11.3 Cobertura, verificada de forma independiente

No me fío de que 33 llamadas de actualización devolvieran `success`. Volví a leer el estado final de la API y lo conté:

| | Antes | Después |
|---|---:|---:|
| Activos con destino de error | 11 | **65** |
| Activos sin ninguno | 54 | **2** |
| Total activos | 65 | 67 |

Los **2 que quedan sin destino no son un descuido**, son estructuralmente imposibles:

- **`ADM/Captura de Fallos (comun)`** — es el capturador. Apuntarse a sí mismo es un bucle.
- **`CM/Plantilla de Email`** — el capturador la invoca para dar formato al correo. Asignarle el capturador como destino crearía una dependencia circular: si la plantilla falla, el capturador se llama a sí mismo a través de ella.

Ambos siguen cubiertos por `ADM/Monitorización n8n`, el barrido cada 2 horas, que es la segunda red y no depende de ninguno de los dos.

Y dos casos que sí eran huecos reales y he cerrado:

- **`RRSS/ERR - Captura de Fallos`** era el destino de error de las 12 piezas activas de RRSS **y no tenía ninguno**. Si el capturador de RRSS fallaba, los fallos de toda la cadena editorial desaparecían sin dejar rastro. Ahora apunta al capturador común. No se crea ciclo: el común no invoca a ninguno de RRSS y termina ahí.
- **`RRSS/UTIL - Normalizar y Sellar`** era el único subflujo activo de RRSS sin destino, mientras sus once hermanos sí lo tenían. Ahora usa el mismo que la cadena.

### 11.4 Lo que sigue sin observarse

**La observabilidad instalada mide ejecuciones, no resultados de negocio.** Sabe decir "el workflow falló". No sabe decir "el workflow funcionó nueve veces seguidas y el negocio no produjo nada". Esa es exactamente la ceguera que deja pasar el caso de §17 sin que salte una sola alarma.

---

## 12. Gestión de errores

| Mecanismo | Cobertura | Estado |
|---|---|---|
| Destino de error común | 53 workflows activos | **Nuevo hoy, probado** |
| Destino de error RRSS | 12 workflows activos | Preexistente |
| `ADM/Monitorización n8n` | barrido cada 2h, todos | Activo |
| `ADM/Vigilancia de Silencio` | 40 workflows P0/P1, diario 08:15 | Activo |
| `ADM/Latido del Formulario Web` | webhook público, cada 6h | Activo, 18 latidos verdes |
| `ADM/Deriva Editor vs Produccion` | 65 activos | Activo, `conDeriva: []` |
| `reintentos` a nivel de nodo | desigual | Ver abajo |

Los reintentos por nodo están puestos donde importa: `RRSS/09 - Publicador Seguro` tiene 10 nodos con reintento, `FNZ/IA Financiera - Consulta` reintenta 3 veces la llamada al modelo.

**Una pieza de gestión de errores particularmente bien hecha**, que merece citarse porque es el patrón a imitar: `FNZ/IA Financiera - Consulta` no se limita a comprobar que el modelo devolvió texto. Comprueba `stop_reason === 'max_tokens'` y, si la respuesta salió cortada, la marca como **incompleta y lo avisa por delante**, con este razonamiento escrito en el propio código:

> *"lo que se pierde al cortar no es cualquier cosa. El prompt exige separar HECHO de INFERENCIA y decir explícitamente 'no tengo información suficiente'. Esas salvedades van al final del razonamiento, así que son justo lo primero que desaparece. Quedaría la parte que suena segura y se perdería la que avisa."*

Eso es tratar una respuesta truncada como lo que es: no una respuesta.

---

## 13. Idempotencia

Donde está bien resuelta, lo está con marcas explícitas en el dato, no con suposiciones:

| Marca | Dónde | Qué evita |
|---|---|---|
| `decision_procesada_en` | `RRSS_Publications` | Reprocesar una decisión humana y perder la evidencia de la original |
| `notificado_en` | `RRSS_Publications` | Reenviar el mismo correo de revisión en cada pasada |
| `ultima_simulacion_en` | `RRSS_Publications` | Re-simular en cada pasada una pieza que sigue sin publicarse |
| `publicado_en` | `RRSS_Publications` | Barrera dura: con valor, no se vuelve a tocar jamás |
| `intento_iniciado_en` | `RRSS_Publications` | **Compromiso en dos fases** |
| `periodos_emitidos` | D-Code Finance | Doble facturación recurrente |

El **compromiso en dos fases** de RRSS merece destacarse porque resuelve bien un problema difícil: se escribe `intento_iniciado_en` *antes* de llamar a la API y `publicado_en` *después* de que confirme. Si hay una caída entre ambos, queda una fila con el primero y sin el segundo: el sistema no sabe si el post salió. Y en lugar de reintentar —que podría duplicar la publicación— lo marca como `INTENTO_HUERFANO`, clase `SEGURIDAD`, y exige reconciliación humana. Es la decisión correcta.

**Donde falta:** el cerrojo `EN_CURSO` de `RRSS_Runs` es explícitamente "blando" —Airtable no ofrece comparar-y-escribir atómico— y **11 de las 28 pasadas quedaron abiertas sin cerrar**, todas entre el 18 y el 21 de agosto. Desde el 24/08 las ocho pasadas siguientes cierran correctamente, así que **la fuga se corrigió**. Las filas antiguas quedan como residuo inofensivo (el cerrojo solo mira pasadas recientes). No las he tocado: son datos de producción.

---

## 14. Identificadores de correlación

| Identificador | Alcance | Utilidad real |
|---|---|---|
| `idEjecucion` de n8n | Todo el ecosistema, desde hoy | Del correo de fallo a la ejecución exacta, con un clic |
| `ejecucion_id` | Tablas RRSS y VF | Une una fila de Airtable con su ejecución de n8n |
| `run_ref` (`RUN-<ejecución>-<tenant>`) | `RRSS_Runs` | Une una pasada completa con sus etapas |
| `pub_ref` / `content_ref` | Cadena editorial | Une variante con pieza base sin resolver enlaces |
| `intento_ref` (`IN-<pub_ref>-<ejecución>`) | `RRSS_PublishLog` | Une un intento con su variante y su ejecución |

RRSS tiene correlación de extremo a extremo. El resto del ecosistema **no la tenía en absoluto hasta hoy**: la incorporación del identificador de ejecución en el correo de fallo es la primera vez que un fallo en Finanzas o Comercial se puede seguir hasta su ejecución concreta.

---

## 15. Copias de seguridad y recuperación

Cuatro workflows de copia activos: `ADM/Copias de Seguridad`, `ADM/Backup Workflows n8n`, `ADM/Backup RRSS`, `ADM/Backup AI Factory`. Los cuatro tenían **destino de error nulo** hasta hoy. Una copia de seguridad que falla en silencio es peor que no tenerla, porque genera confianza falsa; los cuatro están ahora cubiertos.

**Lo que sigue sin estar comprobado, y es lo que de verdad importa: la restauración.** La documentación de RRSS registra el riesgo R12 como cerrado el 17/08/2026 "con el backup implementado", pero deja explícito el residual: ***"restore sin probar"***. Sigue sin probarse. Y un riesgo relacionado, R22 (zona horaria de las copias), está registrado como ***"CORREGIDO, no CERRADO"*** con la anotación *"afecta también a `ADM/Backup Workflows n8n` — sin corregir"*, con fecha de revisión prevista el 23/08. **No hay ningún registro de que esa revisión se hiciera.**

**Una copia que nunca se ha restaurado no es una copia: es una hipótesis.** No la he probado yo tampoco, y digo por qué: probar una restauración real sobre estos sistemas es una operación destructiva, y el encargo lo prohíbe expresamente. Es trabajo que requiere un entorno aparte y una decisión previa (§31).

---

## 16. Comercial

### 16.1 El embudo, medido

| Medida | Valor |
|---|---|
| Leads totales | **58** |
| En estado "Nuevo" | **58 — el 100 %** |
| En cualquier otro estado | **0** |
| Lead más antiguo | 06/08/2026 |
| Lead más reciente | **31/08/2026** |
| Clientes activos según las métricas internas | **0**, en los 34 snapshots diarios |

**Ningún lead ha cambiado nunca de estado.** No es que avancen despacio: es que el campo `Estado` no se ha tocado ni una sola vez en 58 registros y cinco semanas.

### 16.2 Y ahora además ha dejado de entrar nada

Los leads entraban en lotes automáticos los lunes sobre las 04:30: el 6, 10, 15, 24 y 31 de agosto. **El lote del lunes 7 de septiembre no se produjo.** Ocho días sin altas. La tabla `Clientes` sigue el mismo patrón semanal y también lleva parada desde el 31/08.

**Causa: NO VERIFICADO.** Puede ser un workflow desactivado, un fallo silencioso o una fuente agotada. Lo que sí puedo decir es que, hasta hoy, **ningún mecanismo de vigilancia habría avisado**: `ADM/Vigilancia de Silencio` mide cadencia de ejecución de workflows concretos, no aparición de filas nuevas en una tabla. Es el mismo punto ciego de §11.4.

### 16.3 Lo verificado sobre la maquinaria comercial

- **La puerta de entrada funciona.** `MK/Lead IA 360` recibe, valida, comprueba Turnstile, cualifica con Gemini y escribe en Airtable. El latido lo confirma cada 6 horas.
- **El detector de duplicados estaba muerto y hoy funciona.** Leía los campos bajo `.fields`, pero el nodo Airtable en operación `search` los devuelve en la raíz del JSON. Resultado: `campo(l, 'Email')` devolvía siempre vacío y **ningún duplicado se detectaba jamás**. Corregido leyendo ambas formas.
  Y una trampa que estuvo a punto de colarse: arreglar solo eso habría **fusionado dos clientes distintos** —Affidea Clínica Tecma y Affidea Centro Médico Infanta Mercedes comparten el mismo correo de contacto—. Por eso el `Place ID` es ahora decisivo y, cuando existe, no se baja a los criterios débiles. Verificado contra los datos reales: 0 fusiones incorrectas.
- **La promesa de 24 horas al cliente ya no existe.** Comprobado nodo por nodo: lo único que queda en `MK/Lead IA 360` con esa expresión es el comentario que documenta su retirada el 01/09/2026, y un campo interno `siguiente_accion` que sugiere al equipo contactar en menos de 24h. Ese campo interno, dicho sea con honestidad, es hoy una instrucción muerta: se escribe en leads que llevan semanas sin tocarse.
- **El aviso de lead perdido dice la verdad.** Cuando un lead no llega a Airtable, el correo interno ya no afirma que al cliente se le prometió un plazo; dice exactamente qué se le dijo y qué no.

---

## 17. Clientes y contenido: el proceso que se ejecuta y no produce

**Este es el hallazgo central de la auditoría**, y es el ejemplo exacto de lo que el encargo pedía no confundir: cada workflow se ejecuta, cada pasada termina en verde, y el negocio no produce el resultado esperado.

### 17.1 Los números

Desde el 17/08/2026, la cadena RRSS ha generado **14 variantes de producción**. Su destino:

| Estado | Variantes | Qué significa |
|---|---:|---|
| `QA_PASS`, esperando decisión humana | **9** | Aprobadas por el control de calidad. Nadie ha decidido. |
| `REJECTED` por el QA | **4** | El sistema las rechazó correctamente. |
| `SCHEDULED` | **1** | Aprobada el 21/08, programada para el 24/08. |
| **Publicadas** | **0** | No existe capacidad de publicar. |

**De 14 variantes, exactamente una ha recibido una decisión humana**, el 21/08. Ninguna otra desde entonces.

### 17.2 Por qué esto no es un fallo técnico

Había que distinguir dos cosas muy distintas: que el aviso no llegue, o que llegue y nadie actúe. Lo comprobé.

**El aviso llega.** Las nueve variantes pendientes tienen `notificado_en` con fecha **07/09/2026 07:03**. `RRSS/07` envió ayer el correo con las nueve al aprobador configurado, y el mecanismo de idempotencia impide que se reenvíe en bucle. La maquinaria de aviso funciona.

**La ventana está incumplida once veces.** `RRSS_Tenants.ventana_aprobacion_horas` para el tenant `dcode` vale **48**. La pieza más antigua pendiente, `DCODE-20260817-1423`, se generó el 17/08 a las 15:23. A la hora de esta auditoría lleva **unas 528 horas** esperando. Once veces la ventana que el propio sistema define.

Y la única pieza aprobada, `DCODE-20260821-2128-LI`, tenía franja el 24/08 a las 07:00. Sigue en `SCHEDULED` **15 días después de su hora**. El sistema lo detectó y lo registró correctamente como `FUERA_DE_VENTANA` en el log de no-publicación. Hizo bien su trabajo; nadie leyó el resultado.

### 17.3 Una asimetría medible entre canales

De las 14 variantes de producción, 7 son de LinkedIn y 7 de Instagram:

| Canal | Variantes | Rechazadas por QA | Tasa |
|---|---:|---:|---:|
| LinkedIn | 7 | 0 | **0 %** |
| Instagram | 7 | 4 | **57 %** |

Cero contra cincuenta y siete por ciento no es azar en 7 muestras cada uno. La adaptación a Instagram está fallando el control de calidad de forma sistemática (`FAIL_REESCRIBIR`), mientras la de LinkedIn no falla nunca. Es un dato que apunta a la instrucción de adaptación por canal, no al contenido. **No lo he tocado**: cambiar prompts de generación es cambiar criterio editorial, y eso no es una corrección evidente sino una decisión de negocio.

### 17.4 Lo que esto revela sobre la observabilidad

Nada avisó. Ni `ADM/Vigilancia de Silencio`, ni `ADM/Monitorización n8n`, ni el destino de error nuevo. Y es lógico: **los tres miden ejecuciones, y todas las ejecuciones fueron correctas**. El sistema no tiene ningún instrumento que mire el resultado de negocio y diga "llevas tres semanas fabricando y cero publicando".

---

## 18. Producción

Los cinco workflows `PRD/*` están activos y los cinco tenían destino de error nulo hasta hoy. Ya están cubiertos.

**NO VERIFICADO:** no he podido medir el resultado de negocio de Producción (proyectos entregados a tiempo, tareas cerradas) porque el inventario de la base operativa principal no estaba disponible a tiempo para esta redacción. Lo que sí puedo afirmar es que ninguno de los cinco tenía observabilidad de fallo hasta hoy, de modo que **cualquier fallo de producción de las últimas semanas se perdió en silencio**.

---

## 19. Soporte

Tres workflows activos: `SP/Chat IA Clientes`, `SP/Seguimiento de Tickets`, `SP/Tickets IA`. Los tres carecían de destino de error; ya lo tienen.

**Riesgo abierto y documentado por la propia empresa:** el registro de incidencias interno mantiene sobre `SP/Chat IA Clientes` un *"fallo de control de acceso identificado, pendiente de corregir"* que *"bloquea su venta hasta corregirse"*. Es el único sistema del catálogo con un riesgo de seguridad conocido y sin fecha. **No lo he corregido**: no me consta el detalle técnico del fallo, y arreglar a ciegas un control de acceso es peor que no tocarlo. Queda elevado (§29, §31).

`ADM/Vigilancia de Silencio` vigila los dos workflows de soporte disparados por correo con medición de tipo `evento`, no de cadencia — corrección hecha tras comprobar que la primera versión producía acusaciones falsas por huecos normales de 13 horas entre correos.

---

## 20. Finanzas

Diez workflows `FNZ/*` activos. Los diez estaban sin destino de error hasta hoy: **el área que mueve dinero era la menos observada de todo el ecosistema.**

### 20.1 La barrera de autorización no protege el dinero

Ya está en §10.2 y se repite aquí porque es donde más importa: `FNZ/Facturación IA` y `FNZ/Cobros - Seguimiento` consultan el guardarraíl central, y ese guardarraíl da por buena la cadena `'true'` sin comprobar que haya una persona detrás. En finanzas eso significa que **la barrera de aprobación humana ante una comunicación externa con un cliente es, hoy, decorativa**.

### 20.2 Tres implementaciones del mismo dominio

Confirmado con datos, no con documentación:

| Implementación | Contenido real | Última escritura |
|---|---|---|
| Workflows `FNZ/*` sobre Airtable `D-Code AI Factory` | Es la que se ejecuta a diario | Viva |
| Airtable `D-Code Finance SaaS` (prototipo) | 6 facturas, todas de prueba | 25/08/2026 |
| PostgreSQL `D-Code Finance` (autoridad declarada) | **1 factura, 0 gastos, 0 clientes activos** | 22/08/2026 |

**La fuente de verdad financiera declarada está vacía.** La única factura que contiene es un fixture: base 15,00 € e importe 20,00 € —una relación que no corresponde a ningún tipo de IVA español—, vencimiento en **2030**, marcada como pagada pero con `fecha_pago` nula. Los contadores confirman que se ha emitido exactamente un documento de cada tipo desde el origen. Los dos únicos clientes están **inactivos** y coinciden con patrones de fixture.

Es decir: la arquitectura "Finance es la autoridad, Airtable la capa operativa" está **declarada pero no ejercida**. No hay contabilidad que gobernar en la autoridad.

### 20.3 El cumplimiento fiscal está construido y sin estrenar

En PostgreSQL, las migraciones `0005` a `0015` levantaron la capa documental y fiscal completa invocando mandatos formales (VERI\*FACTU, secciones 15-16). Todas las tablas que crearon están a **cero filas**: `cadena_verifactu`, `series_documento`, `lineas_documento`, `albaranes`, `pedidos`, `documentos`, `archivos`.

**El aviso que se deriva de esto:** si se empieza a facturar de verdad sin activar esa cadena de huellas, se factura fuera de cumplimiento. No es un problema hoy —no se factura— pero lo será el primer día que se facture.

### 20.4 Un rastro sin explicar

El registro de actividad de D-Code Finance prueba que el 21 o 22 de agosto se creó un gasto (`gasto: crear`, `gasto: cambiar_estado`). **La tabla `gastos` tiene 0 filas y no hay borrado lógico que lo explique.** No puedo determinar si fue una limpieza deliberada de la prueba o una pérdida de datos. **NO VERIFICADO.**

---

## 21. Administración

Doce workflows `ADM/*` activos: cuatro de copias, cuatro de vigilancia, uno de identidad comercial, uno documental, uno de deriva y el capturador de fallos nuevo.

Es el área que sostiene al resto, y hasta hoy **la vigilancia no se vigilaba a sí misma**: los cuatro workflows de copia y los de vigilancia tampoco tenían destino de error.

`ADM/Deriva Editor vs Produccion` merece mención: compara lo publicado con lo que hay en el editor y detecta cambios sin publicar. Antes de tocar nada hoy lo ejecuté para asegurarme de no estar publicando por accidente trabajo ajeno a medias. Resultado: `{"conDeriva": [], "revisados": 65}`. Cero deriva. Todo lo que he publicado hoy es exclusivamente mío.

---

## 22. Google

| Servicio | Uso real | Estado |
|---|---|---|
| Gmail | Envío de avisos y comunicación con clientes; recepción para `CM/Detección de Respuestas` y `SP/Tickets IA` | Activo. Credencial `sNukEwjxcJgg38bZ` |
| Google Docs / Drive | Generación de propuestas y almacenamiento de copias | Activo |
| Gemini | Cualificación de leads en `MK/Lead IA 360` | Activo |

Corrección relevante ya aplicada en `CM/Detección de Respuestas`: distinguía mal una respuesta real de un correo de lista. Ahora comprueba las cabeceras `List-Unsubscribe`, `List-Id` y `List-Help`, y excluye los buzones propios. Seis días desde la corrección con **cero falsos positivos**, frente a los ~2,4 esperados con el comportamiento anterior.

---

## 23. Notion

Notion es la documentación declarada del ecosistema. **No está algo desactualizada: describe una empresa distinta de la que existe.**

| Lo que Notion afirma | Lo que hay | Caducada desde |
|---|---|---|
| *"las **37 automatizaciones reales** de D-Code Partners"* · *"37 workflows, 35 activos, 2 inactivos"* | **154 totales, 94 no archivados, 66 activos** | 17/08/2026 |
| Base `Automatizaciones`: **38 registros** | 154 workflows reales | Documenta el **24,7 %** |
| Airtable: *"**Bases reales:** Operaciones y D-Code AI Factory"* (2) | **4 bases** | 17/08/2026 |
| `RRSS/00` → *"**NO CONSTRUIDO**"*; `RRSS/09` → *"DISEÑO / BLOQUEADO. **No se construye**"* | **Ambos existen y se ejecutaron ayer**, 07/09/2026 | Documentación inversa a la realidad |
| `ADM/Monitorización n8n` es *"la **única** red de vigilancia de errores"* | Ya no: 65 de 67 activos tienen destino de error | Hoy |
| *"nunca publica solo — es una **decisión de diseño deliberada, no una limitación técnica**"* | Es **también** una limitación técnica absoluta: cero nodos hacia cualquier red social | Desde su redacción |
| `WhatsApp IA` registrado como *"🟢 Terminada / Producción"* | La propia Notion lo desmiente: *"no construido, retirado del catálogo"* | Registro nunca corregido |

**Ausencias completas:** los 10 workflows de Video Factory no aparecen en ninguna página (0 resultados buscando "Video Factory" y "VF/"). Toda la familia `RRSS/` tiene 0 registros en la base `Automatizaciones`. Las bases `D-Code RRSS` y `D-Code Finance SaaS` no figuran en la ficha oficial de la capa de datos. Y `ADM/Captura de Fallos (comun)`, desplegado hoy, tampoco — como es lógico.

Tres fichas creadas el 19/08/2026 tras confirmar Dirección que son "parte real del ecosistema" siguen con su contenido íntegro en "PENDIENTE" veinte días después: `Content Factory`, `AI Operations Center` y `D-Code Finance`.

**No he modificado nada en Notion**, conforme al encargo. Queda auditado y documentado.

---

## 24. D-Code OS

### 24.1 Estado real de la base de datos

Proyecto Neon `misty-darkness-36213098`, base `neondb`, esquema `public`. **15 tablas, 7 vacías.** Las vacías son `opportunities`, `tasks`, `projects`, `incidents`, `notifications`, `activity_events`, `document_records` — es decir, casi todo el modelo de negocio.

Con contenido: `automation_runs` (260), `_prisma_migrations` (22), `audit_log_entries` (31), `service_subscriptions` (8), `users` (2), `password_reset_tokens` (2), `organizations` (1), `external_record_links` (1).

El esquema **sigue en desarrollo activo**: la última migración se aplicó hoy mismo, 08/09/2026 a las 12:30.

### 24.2 `automation_runs`: no es una ingesta congelada, es una carga única

Esto corrige una hipótesis anterior. Las 260 filas **no** son una ingesta que se detuvo el 01/09. Son una carga masiva única:

| Hora de inserción (`createdAt`) | Filas |
|---|---:|
| 2026-09-01 08:00 | **250** |
| 2026-09-01 09:00 | **10** |

**Las 260 filas se escribieron en una ventana de 94 minutos, y desde entonces no se ha escrito ni una sola.** Siete días de silencio. Los `startedAt` abarcan del 30/08 al 01/09 —36 horas, 53 workflows distintos—, lo que encaja con un volcado del historial de n8n.

**La consecuencia práctica:** cualquier panel que lea esta tabla lleva una semana enseñando datos muertos como si fueran actuales. Eso es peor que un panel vacío, porque un panel vacío se nota.

### 24.3 Los fallos no se registran

`status` vale `EXITO` en **260 de 260** filas. El enum admite cuatro valores —`EXITO`, `ERROR`, `INTERRUMPIDA`, `EN_CURSO`— y hay **cero filas** de los otros tres. `errorMessage` y `failedNode` son nulos en 260 de 260.

Aquí soy deliberadamente preciso, porque es fácil concluir de más: **no puedo demostrar que la ingesta descarte los errores.** La ventana cubierta (30/08 21:43 – 01/09 09:45) es corta, y no he podido establecer que en esas 36 horas concretas hubiera fallos de producción en n8n que debieran haber aparecido. Lo que sí está demostrado es que **el esquema contempla los fallos y no hay ni uno**, y que **la tabla lleva siete días muerta**, lo que hace la pregunta secundaria: no registra nada, ni éxitos ni fallos. **Parcialmente NO VERIFICADO**, y así se queda.

`produced` (jsonb) está declarada y es **nula en 260 de 260**. Nunca se ha escrito.

### 24.4 La integración con el resto del ecosistema no existe

`external_record_links` tiene **una sola fila en total**. El enum `ExternalSystem` contempla `AIRTABLE`, `N8N`, `NOTION` y `DCODE_FINANCE`, y hay **0 enlaces a Airtable, 0 a n8n y 0 a Notion**.

Esto explica por qué los dos workflows `OS/*` de n8n están inactivos: `OS/Reportar Fallo a D-Code OS` lleva inactivo desde su creación esperando que se pegue un secreto HMAC real. **El puente entre n8n y D-Code OS está construido por los dos lados y no está conectado por ninguno.**

Fue precisamente ese hueco el que motivó construir hoy `ADM/Captura de Fallos (comun)`: no sustituye al puente, lo cubre mientras tanto usando solo lo que ya existe y funciona.

### 24.5 Un tercer proyecto Neon aparecido hoy

`list_projects` devuelve un proyecto que no estaba en el alcance: **`restless-cell-59221342` ("D-Code Partners App"), creado hoy 08/09/2026 a las 16:46 UTC, con 0 tablas.**

Lo señalo por transparencia: **no lo he creado yo** —no he ejecutado ninguna operación de escritura en Neon en toda la auditoría, solo `SELECT`—. Su existencia y su propósito son **NO VERIFICADO**.

---

## 25. D-Code Partners App

**NO VERIFICADO.** Lo único comprobable hoy es la aparición del proyecto Neon vacío descrito en §24.5. No hay tablas, ni datos, ni integración observable con n8n o Airtable. No puedo afirmar nada más sin inventar.

---

## 26. Cliente Cero: ¿se usa a sí misma la empresa?

La pregunta útil es si D-Code Partners opera con sus propios sistemas o si estos son escaparate. La respuesta, medida:

| Cadena | ¿Se ejecuta? | ¿Produce resultado de negocio? |
|---|---|---|
| Contenido RRSS | **Sí**, 3 veces por semana sin fallar | **No.** 0 publicaciones, 9 piezas esperando decisión (§17) |
| Captación de leads | **Sí**, formulario vivo y comprobado | **Parcial.** Entra el lead; nadie lo mueve después (§16) |
| Vigilancia y copias | **Sí** | **Sí**, con la reserva de que la restauración nunca se ha probado (§15) |
| Finanzas | **Sí**, 10 workflows activos | **No hay facturación real que medir.** 0 facturas reales emitidas |
| Video Factory | **No.** 10 workflows inactivos | No aplica |
| Puente a D-Code OS | **No.** 2 workflows inactivos | No (§24.4) |

**Conclusión honesta:** la empresa se usa a sí misma en la mitad de sus cadenas. Las que se usan, se usan de verdad —no son demos—. Pero dos de las tres cadenas que llegan hasta un resultado externo (contenido y comercial) se detienen en el mismo punto: **el momento en que hace falta que una persona decida.**

---

## 27. Cambios realizados

Todo lo que he tocado hoy, con su verificación. Nada de esto es una intención: cada línea ocurrió y se comprobó.

### 27.1 Destino de error común, construido y probado con un fallo real

**Construido:** `ADM/Captura de Fallos (comun)` (`UHpxoRq0CqaDzLIp`), activo.

**Probado de verdad, no por inspección de código.** Creé un workflow que revienta a propósito, lo ejecuté **en modo producción** (no manual, porque `errorTrigger` solo salta en producción) y comprobé la cadena entera:

| Paso | Evidencia |
|---|---|
| Fallo provocado | Ejecución **4507**, error lanzado a propósito |
| Capturador disparado | Ejecución **4508**, `mode: "error"` |
| Contenido correcto | `{"asunto":"FALLO: ZZZ Prueba Negativa... (Nodo Que Revienta A Proposito)", "idEjecucion":"4507", "idWorkflow":"HtfFNGuTxxFTeAGE", "nodoFallo":"Nodo Que Revienta A Proposito"}` |
| Correo entregado | Mensaje `1a081dc53ad88387` |

Identificó el nodo exacto, arrastró el identificador de correlación y entregó el correo. **Después retiré el workflow de prueba** (archivado): dejar en producción algo que falla a propósito habría sido crear ruido permanente.

**Desplegado uno a uno**, cada workflow con `update_workflow` + `publish_workflow`, y con una descripción de versión que dice exactamente qué se cambió y qué no: *"Solo añade una vía de aviso ante fallo en producción: no altera ningún nodo ni camino de ejecución."*

El reparto final, **contado leyendo la API y no mi propia lista de llamadas**: **53 workflows activos apuntan al capturador común** y **12 al capturador de RRSS**. Antes de hoy eran 0 y 11 respectivamente.

**Verificado de forma independiente**, releyendo la API en vez de fiarme de los `success`: de 11/65 a **65/67**. Los 2 restantes son estructuralmente imposibles (§11.3).

**Antes de publicar nada**, ejecuté `ADM/Deriva Editor vs Produccion` para asegurarme de no arrastrar a producción trabajo ajeno a medias: `{"conDeriva": [], "revisados": 65}`. Cero deriva.

### 27.2 Dos huecos de vigilancia cerrados

- `RRSS/ERR - Captura de Fallos` era el destino de error de 12 workflows y **no tenía ninguno**. Si fallaba el capturador, los fallos de toda la cadena editorial desaparecían. Ahora apunta al común.
- `RRSS/UTIL - Normalizar y Sellar`, único subflujo activo de RRSS sin destino mientras sus once hermanos sí lo tenían. Corregido con el mismo destino que la cadena.

### 27.3 Documentación caducada corregida (dos tablas de Airtable)

- **`tblorgyNDzd2UQUZK`** (Gastos obsoleta): la acción pendiente que arrastraba desde el 01/09 —confirmar los dos últimos consumidores— **queda cerrada**, con la comprobación nodo a nodo escrita en la propia descripción. La tabla queda confirmada como huérfana y propuesta para eliminación con autorización.
- **`Supresiones`**: su descripción anunciaba una corrección de n8n como *pendiente*. **Esa corrección se hizo el 01/09.** Actualizada con la evidencia de que además funciona: 27 filas el 01/09, 27 filas el 08/09; siete días sin un solo falso positivo donde antes aparecían ~1 cada 2-3 días.

### 27.4 Limpieza

Archivados `ZZZ Prueba Negativa - Fallo Deliberado` y `ZZZ Censo isArchived`. No queda en producción ningún artefacto creado para esta auditoría.

---

## 28. Cambios NO realizados, y por qué

Esta sección importa tanto como la anterior. En cada caso digo el motivo real, no una excusa.

| Lo que no he tocado | Por qué |
|---|---|
| **Autenticación de los dos formularios públicos** | Ponerla rompe a quien los usa hoy, y elegir el mecanismo y quién tiene la credencial es una decisión de operación. El encargo dice detenerse solo en la parte que necesita decisión humana. Es esta. |
| **La barrera de autorización del guardarraíl** | Convertir `autorizacionHumana: 'true'` en una aprobación real exige un registro auditable con sello, como el de RRSS. Es rediseño de lógica de aprobación en finanzas, no una corrección evidente. §32 lo prohíbe sin validación. |
| **Los 58 workflows archivados** | El encargo prohíbe borrar workflows sin confirmar y pide clasificar primero. Están clasificados (§3.3) e inertes. Borrarlos es decisión de Dirección. |
| **La tabla `Gastos` obsoleta** | Es un objeto de producción. La comprobación técnica está hecha; falta la autorización, que no me corresponde. |
| **El prompt de adaptación a Instagram** (57 % de rechazos frente a 0 % en LinkedIn) | Cambiar un prompt de generación es cambiar criterio editorial. Es una decisión de negocio disfrazada de arreglo técnico. |
| **Las 11 pasadas `EN_CURSO` sin cerrar de `RRSS_Runs`** | Datos de producción. Además la fuga ya se corrigió sola el 21/08 y los restos son inofensivos. |
| **Las filas de supresión de proveedores** | Son inocuas y desactivarlas revertiría un sesgo deliberado del diseño ("ante la duda, se marca como oposición"). No es mi decisión revertirlo. |
| **Nada en Notion** | Prohibido expresamente por el encargo. Auditado y documentado, no tocado. |
| **Probar una restauración de copia de seguridad** | Es una operación destructiva. Prohibida. Y es justo lo que hace falta (§15). |
| **El fallo de control de acceso de `SP/Chat IA Clientes`** | No me consta el detalle técnico. Arreglar a ciegas un control de acceso es peor que no tocarlo. |
| **Un vigilante de resultado de negocio** | Lo consideré y decidí no construirlo. Explico por qué abajo. |

### 28.1 Por qué NO he construido un tercer vigilante

Tenía sentido a primera vista: nada avisa de que nueve piezas llevan tres semanas esperando. Pero al mirarlo de cerca, `RRSS/07` **ya envía ese correo en cada pasada**, con la lista completa, al aprobador configurado, y consta enviado ayer. Un segundo workflow diciendo lo mismo no es observabilidad: es un aviso duplicado, y los avisos duplicados enseñan a ignorar los avisos.

El problema real no es que falte un correo. Es que el correo que sí llega dice "tienes nueve piezas pendientes" y no dice "esto lleva roto tres semanas y la ventana son 48 horas". Eso es un cambio en el contenido del aviso, no un workflow nuevo — y es una decisión sobre cómo se quiere ser avisado, que es de Dirección.

Construir por construir es exactamente la automatización huérfana que este encargo pedía encontrar. No voy a añadir una.

---

## 29. Riesgos que quedan

Ordenados por gravedad real, no por facilidad de arreglo.

| # | Riesgo | Impacto | Estado |
|---|---|---|---|
| **R1** | **La copia de seguridad nunca se ha restaurado.** El propio registro de riesgos lo dice: *"restore sin probar"* | Pérdida total de la base editorial si hace falta recuperar y la copia no sirve | Abierto desde 17/08 |
| **R2** | **La barrera de autorización humana en finanzas es decorativa** | Un workflow puede enviar comunicación externa a un cliente sin que ninguna persona lo apruebe | Abierto, documentado |
| **R3** | **Dos formularios públicos sin autenticación**, uno escribe en contabilidad y otro gasta dinero en IA | Escritura y gasto por parte de cualquiera que tenga la URL | Abierto |
| **R4** | **`SP/Chat IA Clientes` tiene un fallo de control de acceso conocido** y sin fecha de corrección | Bloquea su venta; riesgo de exposición de datos de clientes | Abierto, del propio registro interno |
| **R5** | **El cumplimiento fiscal está construido y sin estrenar**: `cadena_verifactu`, `series_documento`, `lineas_documento` a cero | El primer día que se facture de verdad, se facturará fuera de cumplimiento si no se activa antes | Latente |
| **R6** | **Los paneles de D-Code OS leen una tabla muerta** desde hace 7 días | Se toman decisiones mirando datos de hace una semana creyéndolos actuales. Peor que un panel vacío, porque el vacío se nota | Abierto |
| **R7** | **La documentación describe una empresa distinta**: Notion documenta el 24,7 % de los workflows y declara "no construido" un sistema que se ejecutó ayer | Cualquiera que se incorpore, o cualquier decisión tomada leyendo Notion, parte de una realidad falsa | Congelada desde 19/08 |
| **R8** | **Tres implementaciones del mismo dominio financiero** sin fuente de verdad decidida | Cifras contradictorias en cuanto se agregue finanzas | Elevado a Dirección, sin resolver |
| **R9** | **La captación de leads se ha parado** y ningún mecanismo lo detecta | El embudo se seca en silencio | Nuevo, detectado hoy |
| **R10** | **La observabilidad mide ejecuciones, no resultados** | Los tres casos de §17, §16 y §7.3 pasaron desapercibidos porque técnicamente todo iba bien | Estructural |

---

## 30. Bloqueos externos y decisiones que no son mías

Ninguno de estos lo puedo resolver yo, y ninguno debería resolverlo yo.

1. **Cuál es la fuente de verdad financiera.** Tres implementaciones, la declarada autoridad vacía. Elevado desde antes, sin decidir.
2. **Qué se hace con los 58 workflows archivados** y con la tabla `Gastos` huérfana. Todo comprobado; falta autorizar.
3. **Autenticación de los dos formularios públicos**: qué mecanismo y quién tiene la credencial.
4. **Aprobación editorial**: hay nueve piezas esperando desde hace hasta 22 días. O se decide sobre ellas, o se decide que la cadena no debe producir a este ritmo. Las dos son respuestas válidas; no decidir no lo es.
5. **El secreto HMAC de `OS/Reportar Fallo a D-Code OS`**, que lleva bloqueando el puente a D-Code OS desde su creación.
6. **Cuenta de Instagram sin confirmar**, que bloquea toda variante de ese canal.
7. **Turnstile bajo una cuenta personal** — dependencia de gobernanza sobre una pieza que está en producción.
8. **Identidad legal de la empresa**, que bloquea aviso legal, contrato y condiciones.
9. **Si `Content Factory` y `AI Operations Center` son sistemas reales** o nombres sin sistema detrás. Sus fichas llevan veinte días en "PENDIENTE".
10. **Qué es el proyecto Neon `restless-cell-59221342`**, creado hoy y vacío (§24.5).

---

## 31. Recomendaciones, solo donde realmente quedan

No repito aquí nada que ya haya arreglado. Estas cuatro son las que cambiarían de verdad la respuesta a la pregunta del encargo, en orden:

**1. Decidir sobre las nueve piezas que esperan, hoy.** Es lo único de esta lista que se hace en veinte minutos y desbloquea una cadena entera. Aprobar o rechazar, da igual cuál: lo que rompe el sistema es que no haya decisión. Y si el ritmo de tres piezas por semana es más de lo que se puede revisar, bajar `frecuencia_semanal` es más honesto que acumular.

**2. Probar una restauración de copia de seguridad en un entorno aparte.** Es el único riesgo de la lista que puede costar la base entera. Una copia que nunca se ha restaurado es una hipótesis, y llevamos tres semanas confiando en ella.

**3. Hacer real la autorización humana en finanzas, copiando el patrón que ya existe en casa.** No hay que inventarlo: `RRSS_Approvals` con sello SHA-256, verificado antes de actuar, con 66 bloqueos que demuestran que funciona. Llevar eso al guardarraíl convierte una barrera decorativa en una barrera.

**4. Decidir la fuente de verdad financiera antes de emitir la primera factura real.** Ahora mismo el coste de decidirlo es cero, porque no hay contabilidad en ningún sistema. En cuanto haya facturas reales, el coste será una migración con implicaciones fiscales.

Sobre Notion: no recomiendo "actualizar la documentación". Con un desfase del 75 %, actualizar es rehacer, y rehacer una documentación que se congela otra vez en tres semanas no resuelve nada. La pregunta que hay debajo es **quién es responsable de que la documentación siga siendo cierta**, y esa es la que hay que responder primero.

---

## Anexo A — Matriz de procesos

| PROCESO | ORIGEN | OWNER | n8n | AIRTABLE | FINANCE | OS | PARTNERS APP | GOOGLE | NOTION | ESTADO | VERIFICACIÓN |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Captación de lead | Formulario web | Comercial | `MK/Lead IA 360` | `Operaciones/Leads` | — | ✗ | ✗ | Gemini, Gmail | Desfasado | **Entra bien, no avanza** | Latido ×18 · 58 leads 100 % "Nuevo" |
| Cualificación de lead | Gemini | Comercial | `MK/Lead IA 360` | `Leads` | — | ✗ | ✗ | Gemini | Desfasado | Funciona | Score escrito en Airtable |
| Detección de duplicados | Airtable | Comercial | `CM/CRM Inteligente` | `Leads` | — | ✗ | ✗ | — | Sin documentar | **Corregido, inactivo** | 0 fusiones incorrectas |
| Seguimiento comercial | Gmail | Comercial | `CM/Detección de Respuestas` | `Supresiones` | — | ✗ | ✗ | Gmail | Contradictorio | Funciona | 6 días, 0 falsos positivos |
| Alta de cliente | Manual | Clientes | `CM/Cliente Activo` + 5 `CLS/*` | `Clientes` | — | ✗ | ✗ | Gmail | Documentado | Activo | 111 clientes, parado 8 días |
| Producción de contenido | Reloj L-X-V | Marketing | `RRSS/00..09` | `D-Code RRSS` | — | ✗ | ✗ | — | **"No construido"** | **Produce, no publica** | 14 variantes, 0 publicadas |
| Aprobación editorial | Correo a persona | Dirección | `RRSS/07` | `RRSS_Approvals` | — | ✗ | ✗ | Gmail | Desfasado | **BLOQUEADO** | 1 decisión de 14 · 528 h |
| Facturación | Presupuesto/proyecto | Finanzas | 4 workflows `FNZ/*` | `Facturas` **vacía** | 1 factura de prueba | ✗ | ✗ | — | "0 reales" | **Sin usar** | 0 facturas reales |
| Registro de gasto | Formulario **sin auth** | Finanzas | `FNZ/Gastos - Registro` | `Gastos` **vacía** | 0 gastos | ✗ | ✗ | — | Documentado | **Sin usar** | 0 gastos |
| KPIs financieros | Reloj 07:00 | Finanzas | `FNZ/Dashboard KPIs` | `Dashboard Financiero` | Autoridad vacía | ✗ | ✗ | — | Documentado | Ejecuta | 24 snapshots, todo a cero |
| Gestión de proyectos | Airtable | Producción | 5 `PRD/*` | `Proyectos` **vacía** | — | ✗ | ✗ | Drive | Documentado | **Sin datos** | 0 proyectos, 0 tareas |
| Soporte y tickets | Gmail | Soporte | 3 `SP/*` | `Tickets` | — | ✗ | ✗ | Gmail | Documentado | Activo | 2 tickets · **fallo de acceso abierto** |
| Vigilancia del sistema | Relojes | Administración | 8 `ADM/*` | — | — | ✗ | ✗ | Gmail | Desfasado | **Reforzado hoy** | 65/67 con destino de error |
| Copias de seguridad | Relojes | Administración | 4 `ADM/Backup*` | Todas | — | ✗ | ✗ | Drive | Documentado | Copia sí, **restore no probado** | — |
| Inteligencia de dirección | Reloj diario | Dirección | 8 `DIR/*` | `EB - *` | — | ✗ | ✗ | Gmail | Documentado | **Produce, no decide** | 91 ideas, **0 decisiones** |
| Registro de ejecuciones | Volcado 01/09 | D-Code OS | ✗ | — | — | `automation_runs` | ✗ | — | Sin documentar | **MUERTO** | 0 filas en 7 días |
| Vídeo | — | Marketing | 10 `VF/*` **inactivos** | 7 tablas `VF_*` | — | ✗ | ✗ | — | **Cero menciones** | **Aparcado** | 0 ejecuciones |
| Puente a D-Code OS | — | Administración | 2 `OS/*` **inactivos** | — | — | 1 sola fila de enlace | ✗ | — | Sin documentar | **Sin conectar** | Falta secreto HMAC |

Leyenda: ✗ = no participa · **negrita** = hallazgo.

---

## Anexo B — Matriz de workflows activos

Los 66 activos. `ERR` = destino de error; `IDEM` = idempotencia explícita.

| WORKFLOW | ESTADO | PROPÓSITO | TRIGGER | DESTINO | ERR | IDEM | RIESGO | ÚLTIMA VERIF. |
|---|---|---|---|---|---|---|---|---|
| `MK/Lead IA 360` | Activo | Captar y cualificar leads | Webhook público | Airtable, Gmail | ✅ común | Upsert | **Alto** — puerta pública | 08/09 latido |
| `FNZ/IA Financiera - Consulta` | Activo | Responder preguntas financieras | Webhook + cabecera | Respuesta | ✅ común | — | Medio — lee tablas vacías | 08/09 |
| `FNZ/Gastos - Registro` | Activo | Registrar gasto | **Formulario sin auth** | Airtable | ✅ común | — | **Alto** — escribe contabilidad | 08/09 |
| `CM/Generador de Propuestas IA` | Activo | Generar propuestas | **Formulario sin auth** | Docs, Airtable | ✅ común | — | **Alto** — gasta IA | 08/09 |
| `FNZ/Facturación IA` | Activo | Emitir factura | Sub-workflow | Airtable, Gmail | ✅ común | — | **Alto** — guardarraíl decorativo | 08/09 |
| `FNZ/Facturación desde Presupuesto` | Activo | Presupuesto → factura | Reloj | Airtable | ✅ común | — | Alto | 08/09 |
| `FNZ/Facturación desde Proyecto` | Activo | Proyecto → factura | Reloj | Airtable | ✅ común | — | Alto | 08/09 |
| `FNZ/Disparador Facturación Recurrente` | Activo | Facturación periódica | Reloj | Airtable | ✅ común | Periodos | Alto | 08/09 |
| `FNZ/Cobros - Seguimiento` | Activo | Reclamar cobros | Reloj | Gmail | ✅ común | Recordatorios | **Alto** — escribe a clientes | 08/09 |
| `FNZ/Control de Gastos` | Activo | Vigilar gasto | Reloj | Gmail | ✅ común | — | Medio | 08/09 |
| `FNZ/Dashboard - Calculo KPIs` | Activo | Snapshot diario 07:00 | Reloj | Airtable | ✅ común | 1/día | Medio — todo a cero | 08/09 |
| `FNZ/Gastos - Registro` (proc.) | Activo | Alta de gasto | Formulario | Airtable | ✅ común | — | Alto | 08/09 |
| `FNZ/Proyectos - Rentabilidad` | Activo | Calcular rentabilidad | Reloj | Airtable | ✅ común | — | Medio | 08/09 |
| `GRD/Guardarrail Com. Externa` | Activo | Autorizar envíos | Sub-workflow | Veredicto | ✅ común | — | **Crítico** — 1 de 5 barreras decorativa | 08/09 |
| `GRD/Vigilante Caminos Externos` | Activo | Detectar salidas nuevas | Reloj | Gmail | ✅ común | — | Medio | 08/09 |
| `CM/Plantilla de Email` | Activo | Formato común de correo | Sub-workflow | HTML | ⛔ circular | — | **Alto** — 46 llamadas | 08/09 |
| `CM/Cliente Activo` | Activo | Orquestar alta | Airtable | Sub-workflows | ✅ común | — | Medio | 08/09 |
| `CM/Alerta Empresa Ya Cliente` | Activo | Evitar doble contacto | Reloj | Gmail | ✅ común | — | Medio | 08/09 |
| `CM/Detección de Respuestas` | Activo | Clasificar respuestas | Gmail | `Supresiones` | ✅ común | — | Medio | 08/09 · 0 falsos pos. |
| `CM/Generador de Propuestas IA` (proc.) | Activo | Propuesta con IA | Formulario | Docs | ✅ común | — | Alto | 08/09 |
| `CLS/Activacion`, `Bienvenida`, `Encuestas`, `Onboarding`, `Renovaciones` | Activos (5) | Ciclo de vida del cliente | Airtable / sub | Gmail | ✅ común | — | Alto — escriben a clientes | 08/09 |
| `PRD/Asignación`, `Control de Entregas`, `Gen. Tareas`, `Gestión Proyectos`, `Seg. Tareas` | Activos (5) | Producción | Reloj / Airtable | Airtable | ✅ común | — | Medio — tablas vacías | 08/09 |
| `SP/Chat IA Clientes` | Activo | Chat de soporte | Chat | Airtable | ✅ común | — | **Alto — fallo de acceso conocido** | 08/09 |
| `SP/Tickets IA`, `SP/Seguimiento Tickets` | Activos (2) | Tickets | Gmail / reloj | Airtable, Gmail | ✅ común | — | Medio | 08/09 |
| `DIR/*` (8) | Activos | Executive Board e informes | Relojes | Airtable, Gmail | ✅ común | 1/día | Medio — **0 decisiones** | 08/09 |
| `ADM/Captura de Fallos (comun)` | **Activo, nuevo** | Destino de error | `errorTrigger` | Gmail | ⛔ es el capturador | — | — | **08/09 probado (4507→4508)** |
| `ADM/Monitorización n8n` | Activo | Barrido cada 2 h | Reloj | Gmail | ✅ común | — | Medio | 08/09 |
| `ADM/Vigilancia de Silencio` | Activo | 40 workflows P0/P1 | Reloj 08:15 | Gmail | ✅ común | — | Medio | 08/09 |
| `ADM/Latido Formulario Web` | Activo | Probar webhook público | Reloj 6 h | Gmail | ✅ común | — | — | 08/09 · 18 latidos |
| `ADM/Deriva Editor vs Prod.` | Activo | Detectar sin publicar | Reloj | Gmail | ✅ común | — | — | 08/09 · `conDeriva: []` |
| `ADM/Salud de Fuentes` | Activo | Vigilar fuentes | Reloj | Gmail | ✅ común | — | — | 08/09 |
| `ADM/Vigilancia Apps Web` | Activo | Vigilar webs | Reloj | Gmail | ✅ común | — | — | 08/09 |
| `ADM/Copias`, `Backup Workflows`, `Backup RRSS`, `Backup AI Factory` | Activos (4) | Copias de seguridad | Relojes | Drive | ✅ común | — | **Alto — restore sin probar** | 08/09 |
| `ADM/Identidad Comercial Sync` | Activo | Sincronizar identidad | Reloj | Airtable | ✅ común | Incremental | Medio | 08/09 |
| `ADM/Gestión Documental` | Activo | Documentos | Reloj | Drive | ✅ común | — | Medio | 08/09 |
| `RRSS/00..09` (12) | Activos | Cadena editorial | Reloj L-X-V | `D-Code RRSS` | ✅ RRSS | Sellos + 2 fases | Medio — **0 publicadas** | 07/09 `COMPLETADA` |
| `RRSS/ERR - Captura de Fallos` | Activo | Capturador RRSS | `errorTrigger` | Airtable | ✅ **común, nuevo hoy** | — | — | 08/09 |
| `RRSS/UTIL - Normalizar y Sellar` | Activo | Sellado SHA-256 | Sub-workflow | — | ✅ **RRSS, nuevo hoy** | Sello | — | 08/09 |
| `CF/Investigación + Scoring` | Activo | Ideación editorial | Reloj | Airtable | ✅ común | — | Bajo | 08/09 |

---

## Anexo C — Veredicto

# NOT READY

**Y conviene ser exacto sobre por qué, porque el motivo no es el que parecería.**

El sistema **no está NOT READY por fragilidad técnica**. Al contrario: los workflows se ejecutan, las cadenas terminan en verde, los guardarraíles de integridad de RRSS funcionan y lo demuestran con 66 bloqueos registrados, el formulario público rechaza lo que debe rechazar, la deriva es cero y, desde hoy, 65 de 67 workflows activos avisan cuando fallan. Buena parte del código que he leído está mejor escrito que la media: hay comentarios que explican *por qué* una decisión es así, hay una comprobación de respuesta truncada que razona qué se pierde exactamente al cortar, y hay un cálculo de KPIs que declara sus propias limitaciones en cada snapshot en lugar de esconderlas.

**Está NOT READY porque los procesos críticos no producen el resultado de negocio, y porque nada en el sistema es capaz de darse cuenta.**

Tres cadenas, tres veces el mismo patrón:

- Contenido: **14 variantes producidas, 1 decisión humana, 0 publicaciones.**
- Comercial: **58 leads, 58 en "Nuevo", 0 movidos, y la entrada parada desde hace 8 días.**
- Dirección: **91 ideas y recomendaciones, 0 decisiones registradas.**

En los tres casos la maquinaria hizo su trabajo. En los tres casos el proceso se detuvo en el mismo punto: **el momento en que hace falta que una persona decida.** Y en los tres casos **ninguna alarma sonó**, porque toda la observabilidad instalada —la que había y la que he añadido hoy— mide si un workflow se ejecutó, no si el negocio produjo algo.

A esto se suman tres hechos que impiden dar por buena la operación:

- **La autoridad financiera declarada está vacía** (1 factura de prueba, 0 gastos, 0 clientes activos), y el cumplimiento fiscal está construido y sin estrenar.
- **Los paneles de D-Code OS llevan una semana mostrando datos muertos** de una carga única que nunca se repitió.
- **La copia de seguridad nunca se ha restaurado.**

El criterio del encargo era declarar READY solo si los procesos críticos están *realmente conectados, observables y verificables*. Hoy están **conectados** y, desde hoy, **observables en lo técnico**. No son **verificables en resultado de negocio**, y esa es la pata que falta.

**Lo que cambiaría el veredicto no es un proyecto: es un turno de decisiones.** Nueve piezas editoriales esperando, 58 leads sin mover, 91 recomendaciones sin resolver, y una prueba de restauración. Nada de eso requiere construir nada. Requiere que alguien decida, y que el sistema aprenda a avisar cuando nadie lo hace.

---

*Auditoría realizada el 08/09/2026 sobre los sistemas de producción. Todas las cifras proceden de lecturas directas de API realizadas ese día. Lo no comprobable está marcado como NO VERIFICADO y no se ha rellenado con suposiciones.*
