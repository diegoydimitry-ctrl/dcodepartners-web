# Cómo probar el formulario de contacto de verdad

Este documento existe porque el flujo de captación de leads **no se puede
verificar de extremo a extremo desde el entorno de desarrollo agentado**, y
decirlo es más útil que fingir lo contrario.

Aquí está exactamente qué está probado, qué no, por qué, y qué hay que hacer
para cerrar el punto.

---

## 1. Qué está verificado y cómo

Todo lo siguiente se ha reproducido en un navegador real (Chromium), forzando
cada rama con la red interceptada y el widget de Turnstile simulado. Son
pruebas ejecutables, no lecturas del código.

| Escenario | Cómo se fuerza | Resultado verificado |
|---|---|---|
| El servidor no responde nunca | La ruta de red se congela y no resuelve jamás | A los ~24 s se han lanzado los **dos** intentos (principal y respaldo), el botón se desbloquea y el aviso explica qué ha pasado |
| Principal y respaldo devuelven 500 | Ambas rutas responden 500 | Error claro, botón restaurado, se conserva lo escrito |
| El principal cae y el respaldo funciona | n8n → 503, respaldo → 200 | Panel de confirmación, formulario oculto |
| Turnstile no ha cargado al pulsar | No se define `window.turnstile` | Espera 8 s diciéndolo; luego un mensaje que **no** manda recargar |
| Turnstile carga 4 s tarde | Se define con `setTimeout` | **Envía correctamente** tras la espera |
| Turnstile presente pero sin marcar | `getResponse()` devuelve `''` | Espera 5 s; luego pide marcar la verificación |
| Triple pulsación rápida en enviar | Tres clics con 60 ms de separación | **Una sola** petición |
| Enter con un obligatorio vacío | `press('Enter')` en el paso 1 | No avanza ni envía |
| Validación por pasos | Recorrido de los 4 pasos | No deja avanzar en blanco, lleva el foco al campo que falta, rechaza un correo mal escrito |
| Volver atrás | Botón «Atrás» tras rellenar | Conserva lo escrito |

También verificado contra **producción real**, sin enviar ningún correo:

- `GET /api/contact-fallback` → **HTTP 405** con
  `{"success":false,"error":"Método no permitido"}`.
  Esto demuestra que la función serverless está desplegada, se ejecuta y su
  guarda de método funciona.

---

## 2. Qué NO está verificado, y por qué

### 2.1 El envío real a n8n

**No se puede alcanzar n8n desde este entorno.** El proxy de salida deniega la
conexión:

```
diegoydimitry2.app.n8n.cloud:443 — connect_rejected
gateway answered 403 to CONNECT (policy denial or upstream failure)
```

Ni siquiera un `GET` inofensivo (el webhook solo acepta `POST`, así que un GET
no crea nada) llega a salir. No es una limitación del formulario: es de la red
del entorno.

### 2.2 El envío real del respaldo

Se podría hacer un `POST` a `/api/contact-fallback`, pero **enviaría correos de
verdad**: uno al equipo (`dcodedepartment@gmail.com`) y otro a la dirección que
se pusiera en el formulario. Eso es contaminar datos reales, así que no se ha
hecho.

### 2.3 Dónde termina el lead

Que el lead llegue a Airtable, que el análisis con IA se ejecute y que los dos
correos salgan **solo puede comprobarse mirando Airtable y las bandejas**. No
es observable desde el navegador.

---

## 3. Estrategia concreta para cerrar el punto

Tres opciones, de menos a más esfuerzo. La 1 basta para la mayoría de los
casos; la 3 es la que deja el punto cerrado de forma permanente.

### Opción 1 — Prueba manual controlada (30 minutos, hoy)

La más rápida y no necesita tocar nada.

1. Abrir <https://dcodepartners.com/contacto> en un móvil real y en un
   escritorio.
2. Rellenar con datos marcados como prueba:
   - Nombre: `PRUEBA — no atender`
   - Empresa: `PRUEBA`
   - Email: una dirección propia (un alias tipo
     `tucorreo+prueba1@gmail.com` sirve y es fácil de filtrar después)
   - Mensaje: `Prueba de verificación del formulario — <fecha y hora>`
3. Enviar y anotar:
   - qué dice el botón mientras envía;
   - qué mensaje aparece al terminar;
   - si aparece el panel de confirmación.
4. Comprobar, en este orden:
   - **Airtable**: que existe el registro y que todos los campos han llegado
     completos (nombre, empresa, email, teléfono, mensaje).
   - **Bandeja del equipo**: que ha llegado el aviso interno.
   - **Bandeja del remitente**: que ha llegado la confirmación.
   - Que **NO** han llegado dos de cada (eso indicaría que el respaldo se
     disparó además del principal).
5. Borrar el registro de prueba de Airtable.

Repetir una vez con el móvil en **modo avión durante el envío** para ver el
camino de error: debe aparecer el mensaje de fallo y el botón debe
desbloquearse. No debe quedarse en «Enviando…».

### Opción 2 — Un entorno de pruebas separado (medio día)

Para poder repetirlo cuantas veces haga falta sin ensuciar nada:

1. En n8n, **duplicar** el workflow «Lead IA 360» como
   `Lead IA 360 — PRUEBAS`, con:
   - una tabla de Airtable distinta (o la misma con un campo `entorno=prueba`);
   - los correos redirigidos a una dirección de pruebas.
2. Publicarlo en una ruta distinta, p. ej. `/webhook/lead-ia-360-pruebas`.
3. En el sitio, leer la URL del webhook de una variable en vez de tenerla fija:
   en la Preview de Vercel apunta a la de pruebas; en producción, a la real.
4. Con eso, cualquier despliegue de Preview se puede probar de punta a punta
   sin tocar datos reales.

> Esto **modifica n8n**, así que requiere tu aprobación explícita. No se ha
> hecho.

### Opción 3 — Prueba automática en cada despliegue (1–2 días)

Sobre la opción 2, añadir una comprobación que se ejecute sola:

1. Un script Playwright que rellene los cuatro pasos en la URL de Preview.
2. Turnstile en modo de prueba: Cloudflare publica claves de test que siempre
   pasan (`1x00000000000000000000AA` para el sitio,
   `1x0000000000000000000000000000000AA` para el secreto). En la Preview se usa
   esa clave; en producción, la real.
3. El script envía, espera el panel de confirmación y consulta la tabla de
   pruebas de Airtable para comprobar que el registro ha llegado con todos los
   campos.
4. Se ejecuta en cada despliegue de Preview y falla el despliegue si el lead no
   llega.

Esto es lo único que convierte «el formulario funciona» en un hecho verificado
de forma continua en vez de una comprobación puntual.

---

## 4. Riesgo conocido que queda abierto

**Un correo de confirmación puede llegar duplicado.** El respaldo se lanza
siempre que el intento principal no termina bien, y eso incluye el caso
ambiguo: que n8n **sí** haya procesado el lead pero su respuesta se haya
perdido (red caída después de enviar, o más de 12 segundos sin contestar).

Es una contrapartida elegida a conciencia: **un correo duplicado es mejor que
un lead perdido**. Si algún día molesta, la forma de cerrarlo sin perder esa
garantía es enviar una clave de idempotencia generada en el navegador —el mismo
valor en los dos intentos— y que n8n descarte el segundo si ya vio esa clave.
No se ha hecho porque implica tocar el workflow.
