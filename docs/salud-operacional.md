# Salud operacional: qué se vigila, qué se demuestra y qué no

Este documento existe para que nadie tenga que deducir el estado del sistema
mirando 92 workflows uno a uno. Dice qué instrumentos hay, **qué prueba cada
uno**, y —sobre todo— **dónde termina la prueba**.

La regla que lo gobierna todo: *ejecución correcta no es lo mismo que
resultado correcto*. Un workflow puede terminar en verde sin haber producido
ningún efecto. Cuando algo no se puede comprobar, aquí se dice NO VERIFICADO;
nunca se cuenta como correcto.

Fecha de la revisión: **3 de septiembre de 2026**.

---

## 1. Los cinco instrumentos, y qué ve cada uno

| Instrumento | Cadencia | Ve | NO ve |
|---|---|---|---|
| `ADM/Monitorización n8n` | cada 2 h | Ejecuciones que **fallan** en producción | Un workflow que deja de ejecutarse: no falla, luego no aparece |
| `ADM/Vigilancia de Silencio` *(nuevo)* | diaria 08:15 | 40 workflows P0/P1: cuáles están **detenidos** o llevan más tiempo del esperado sin correr | Lo que ocurre *dentro* de una ejecución |
| `ADM/Latido del Formulario Web` *(nuevo)* | cada 6 h | Que el webhook del formulario **existe, responde y rechaza** correctamente | Todo lo posterior a la guardia anti-spam |
| `ADM/Vigilancia de Aplicaciones Web` | cada 2 h | Que las tres aplicaciones responden | Si responden *bien* |
| `ADM/Deriva Editor vs Producción` | diaria 07:20 | Workflows cuyo borrador difiere de lo publicado | — |

Los dos nuevos existen porque faltaban justo los dos modos de fallo más
silenciosos: **dejar de ejecutarse** y **dejar de recibir**.

### Por qué hacía falta vigilar el silencio

El 1 de septiembre, `AAA/Radar Comercial IA` quedó desactivado. Es la única
fuente que ha producido leads en toda la historia del sistema: **58 de 58**.
Con él se apagaron `CM/CRM Inteligente` —el único camino que convierte una
empresa HOT en Lead— y `CM/Recordatorio Comercial`, el aviso diario de
propuestas sin enviar.

Dos días de silencio comercial completo **sin una sola alerta**, porque la
vigilancia existente solo miraba los fallos, y un workflow apagado no falla.

---

## 2. Tres varas de medir, no una

`ADM/Vigilancia de Silencio` clasifica cada workflow crítico en una de tres
categorías, y esto no es un detalle: en su primera ejecución real (id 3887)
midió a todos por cadencia y acusó a `CM/Detección de Respuestas` y
`SP/Tickets IA` de llevar 6,6 h calladas. Era **falso**: los dos arrancan con
un disparador de correo entrante y solo corren cuando alguien escribe. Sus
huecos reales llegan a 13 h sin que pase nada.

Un vigilante que acusa a diario a quien no ha hecho nada se deja de leer, y
entonces tampoco se lee el aviso del día que sí importa.

- **cadencia** — corre solo, cada pocas horas o a diario. *Callar es síntoma.*
- **evento** — webhook, correo entrante o sub-workflow. Solo corre si algo
  llega, así que callar **no** es síntoma; lo único comprobable es que siga
  activo. Su avería típica (credencial caducada) sí produce ejecuciones con
  error, y de esas avisa la vigilancia de fallos.
- **soloActivo** — semanal o mensual. La ventana de 250 ejecuciones que expone
  la API cubre unas 50 h y no llega tan atrás, así que decir NO VERIFICADO
  cada día sería ruido. Se comprueba solo que siga activo, que es exactamente
  como se apagan estas cosas.

---

## 3. El recorrido del lead: hasta dónde llega la prueba

```
navegador → validación → Turnstile → envío a n8n → [ guardia anti-spam ]
                                                          │
                                     ─────────────────────┴─────────────────────
                                     ▲ hasta aquí: VERIFICADO cada 6 h
                                                          │
                              Airtable → IA → correo al lead + aviso interno
                                     ▼ desde aquí: NO VERIFICADO de forma automática
```

**Verificado y reproducible.** El latido envía cada 6 horas una petición real
al webhook de producción con un token anti-spam **inválido a propósito**.
Recorre DNS y TLS, el webhook registrado y activo, el arranque del workflow,
la normalización y validación de campos, y la guardia de Turnstile. Y se
detiene ahí: no crea ningún Lead, no llama a la IA y no envía ningún correo.

Distingue cuatro averías distintas, no una:

| Respuesta | Veredicto |
|---|---|
| 400 + «Verificación anti-spam fallida» | Correcto |
| 404 | El webhook no existe: el workflow está desactivado o cambió la ruta |
| 400 con otros errores | El contrato de campos entre la web y n8n se ha roto |
| 2xx | **La guardia anti-spam no está rechazando** — el formulario estaría abierto a bots |
| Sin respuesta | No se alcanza n8n |

Ambos caminos están probados de verdad: la ejecución 3897 dio el rechazo
esperado sin enviar correo, y la 3899 —apuntando a propósito a una ruta
inexistente— produjo el veredicto correcto y **entregó el aviso**. Un
vigilante cuyo camino de aviso no se ha probado no es un vigilante.

**Lo que sigue sin verificarse.** Que el lead llegue a Airtable, que el
análisis con IA se ejecute y que salgan los dos correos. Eso exige un entorno
de pruebas separado: ver `probar-el-formulario-de-contacto.md`, opción 2.

**Del lado del navegador**, la web ya no pierde un envío en silencio: hay
límite de 12 s por intento, envío de respaldo, y una bandeja de salida en
`localStorage` que reintenta desde cualquier página durante 7 días. Es
idempotente porque n8n hace *upsert* por email.

---

## 4. Efectos reales: dónde está el hueco

La tabla `automation_runs` de D-Code OS tiene una columna `produced` (jsonb)
pensada exactamente para guardar **el efecto** de cada ejecución.

Estado medido el 3 de septiembre:

- **260 registros**, todos con estado `EXITO`.
- **`produced` es NULL en los 260.** El efecto no se registra nunca.
- El último registro es del **1 de septiembre a las 09:45**. Lleva más de dos
  días sin escribirse.

El estado `ERROR` existe en el enum, pero en la ventana cubierta no hubo
ningún fallo en n8n, así que **no se puede afirmar** que la ingesta descarte
los errores: eso queda NO VERIFICADO.

Corregir esto significa tocar D-Code OS, que está fuera del área de
infraestructura operativa. Va como hallazgo para su Director.

---

## 5. Si se decide reactivar el motor comercial

`CM/CRM Inteligente` sigue **desactivado a propósito**: reactivarlo genera
propuestas y correos hacia empresas reales, y esa decisión no es técnica.

Antes de encenderlo, conviene saber tres cosas:

1. **Corre los lunes a las 06:30, no a diario.** El Radar detecta cada
   mañana pero la conversión a Lead espera al lunes siguiente.
2. **Su detector de duplicados estaba muerto** y se ha corregido. Leía los
   leads existentes como `l.fields['Email']`, pero el nodo de Airtable
   devuelve los campos en la raíz —como ya hacían los otros tres bloques del
   mismo workflow—, así que nunca encontraba nada y nunca impidió un
   duplicado. Prueba de ello: `Li-Onna Madrid / hola@lionna.es` está dos
   veces en Leads (`rec0umCkMxIUK7mqZ` del 6/08 y `recX0NmSf24Iv9osu` del
   10/08).
3. **El Place ID ahora decide.** Arreglar solo la lectura habría roto otra
   cosa: `Affidea Clínica Tecma` y `Affidea Centro Médico Infanta Mercedes`
   son dos sedes distintas que comparten el buzón `Es_info@affidea.com`, y la
   segunda se habría descartado como duplicada. Si el candidato trae Place ID
   y ninguno coincide, son locales distintos y no se sigue mirando.

---

## 6. Lo que este sistema todavía no puede responder

Dicho sin adornos, porque es lo más útil de este documento:

- **Si un lead real llega hasta el final.** Se verifica hasta la guardia
  anti-spam; lo demás, no.
- **Si una copia de seguridad se puede restaurar.** Hay cuatro backups
  semanales activos, pero la restauración **nunca se ha probado**. Un backup
  no verificado es una hipótesis.
- **Qué efecto produjo cada ejecución.** Mientras `produced` siga vacía, el
  sistema sabe que algo corrió, no qué cambió.
- **Por qué se apagó el motor comercial el 1 de septiembre.** No hay ningún
  registro de la decisión. A partir de ahora, al menos, se avisará al día
  siguiente.
