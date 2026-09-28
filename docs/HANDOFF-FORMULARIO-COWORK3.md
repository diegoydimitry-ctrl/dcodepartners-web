# HANDOFF → COWORK 3 · Emails del formulario de contacto de dcodepartners.com

De: Cowork 4 (webs) · 28/09/2026 · Rama web: `web/dcp-cowork4`
**Cowork 4 no ha modificado ningún workflow de n8n.** Todo lo de n8n que aparece aquí se ha leído, no se ha tocado.

---

## 1. Qué pasa hoy (comprobado leyendo el código y los workflows)

```
Navegador (/contacto, /en/contacto)
  └─ POST application/x-www-form-urlencoded
     https://diegoydimitry2.app.n8n.cloud/webhook/lead-ia-360-v2
        └─ n8n · «MK/Lead IA 360» (id 0NQvFFWYj3cNI6Zo, activo)
             Configuración → Normalizar y Validar Lead → ¿Lead Válido? → Verificar Turnstile
             → Preparar Búsqueda Lead → Airtable (buscar / crear o actualizar) → Gemini
             → Interpretar Análisis IA ─┬─ Responder Éxito al Formulario (200 JSON)
                                        ├─ Preparar Confirmacion Cliente → Aplicar Plantilla Confirmacion
                                        │    (sub-workflow «CM/Plantilla de Email», id LBVRyfharZyGl5Qm)
                                        │    → Consultar Supresiones → Decidir Envio → Gmail al cliente
                                        └─ ¿Prioridad Alta? ── solo si «Alta» ──→ Preparar Alerta Lead Prioritario
                                             → Aplicar Plantilla Alerta → Gmail a dcodedepartment@gmail.com
  └─ Si el POST principal falla: POST a /api/contact-fallback (función de Vercel del propio sitio, Resend).
     Solo envía los dos emails; no guarda en Airtable.
```

### Payload que envía la web

| Campo | Antes | Desde `web/dcp-cowork4` | Notas |
|---|---|---|---|
| `nombre` | sí | sí | obligatorio |
| `empresa` | sí | sí | obligatorio en la web (en n8n es opcional) |
| `email` | sí | sí | obligatorio |
| `telefono` | sí | sí | opcional |
| `mensaje` | sí | sí | opcional. Si el visitante usó el configurador, empieza por «Configuración hecha en el configurador:» y lista sector, mejoras, personas, piezas, adaptación y estimación |
| `turnstileToken` | sí | sí | token de Cloudflare Turnstile, de un solo uso |
| `idioma` | — | **`es` / `en`** | **nuevo**. Hoy n8n lo ignora (el nodo «Normalizar y Validar Lead» solo lee los campos que conoce). Sirve para mandar el email en el idioma de la página |
| `pagina` | — | **`/contacto` o `/en/contacto`** | **nuevo**. Para el aviso interno («Origen: Web · /contacto») |

`origen` **no** se envía a propósito: n8n lo pone por defecto a `formulario_web`, y enviar otro valor podría chocar con el campo de Airtable.

### Los tres problemas que ha visto Dirección y de dónde vienen

1. **«ahora mismo no estamos aceptando proyectos nuevos»**
   - Nodo «Preparar Confirmacion Cliente», rama que no es de reserva.
   - Texto literal actual: `Gracias por escribir a D-Code Partners. Preferimos decirtelo claro: <strong>ahora mismo no estamos aceptando proyectos nuevos</strong>, asi que no podemos comprometer un plazo de respuesta.`
   - Se escribió por la decisión de Dirección del 01/09/2026 (captación pausada). **Dirección ha revocado esa decisión: D-Code SÍ está disponible.**
2. **`[DCP]`, `[CLIENT]` y textos internos en el correo del cliente**
   - Los añade el sub-workflow «CM/Plantilla de Email»: `asuntoFinal: '[DCP][' + categoriaFinal + '] ' + asunto`.
   - Además pone un pie interno: «Este es un mensaje automático del sistema D-Code AI Factory. Por favor no reenvíe este correo con información sensible.»
   - La confirmación al cliente pasa por esa plantilla con `categoria: 'CLIENT'`.
3. **No todos los envíos generan aviso interno**
   - El aviso a `dcodedepartment@gmail.com` solo sale si Gemini clasifica el lead como `prioridad === "Alta"`.
   - El asunto es `[DCP][HOT LEAD] Nuevo lead prioridad alta - …`.
   - Un lead normal no avisa a nadie por correo.

---

## 2. Qué debe cambiar en n8n (solo en «MK/Lead IA 360»)

> **No tocar «CM/Plantilla de Email»**: la usan más de 18 workflows. El correo al cliente **no debe pasar por ella**.

### 2.1 Email al cliente
- **Nodo:** «Preparar Confirmacion Cliente».
- **Rama de reserva** (`origen === 'calendario_reservas'`): **se deja igual**.
- **Resto:** sustituir el cuerpo y el asunto por el texto de abajo. Elegir el idioma con `body.idioma === 'en'`: leer `$('Webhook - Recepción de Lead').item.json.body.idioma`, porque «Normalizar» no lo copia.
- **Quitar del camino del cliente** «Aplicar Plantilla Confirmacion». «Decidir Envio Confirmacion» debe leer asunto y cuerpo directamente de «Preparar Confirmacion Cliente». El HTML ya va completo; ver la función `emailCliente()` en `api/_lib/emails-lead.js` de este repo, que es la plantilla exacta.
- **Gmail al cliente:** `Reply-To: dcodedepartment@gmail.com`. Sin prefijos en el asunto.
- **Se mantienen:** el escapado, la consulta de supresiones y el fail-safe tal como están.

**ES**
- **Asunto:** `Gracias por escribirnos, {Nombre}` (solo el primer nombre)
- **Texto previo** (preheader): `Tu mensaje ya está con nosotros. Te escribimos cuanto antes.`
- **Cuerpo:**
```
Hola, {Nombre}:

Gracias por escribirnos. Tu mensaje ya está con nosotros y lo vamos a leer con calma.

Antes de proponerte nada, queremos entender bien tu caso: cómo trabajáis hoy, dónde se os va el tiempo y qué te gustaría que funcionara solo. En cuanto lo hayamos revisado, te escribiremos —o te llamaremos, si nos has dejado teléfono— para hablarlo contigo.

Si mientras tanto quieres añadir algo (un documento, una captura, un detalle que se te haya quedado fuera), responde a este correo: lo recibimos nosotros directamente.

Un saludo,
Diego Siñeriz y Dimitry Sosenko
D-Code Partners · Madrid · dcodepartners.com
```

**EN**
- **Subject:** `Thanks for writing to us, {Name}`
- **Body:**
```
Hi {Name},

Thank you for getting in touch. Your message is with us and we will read it carefully.

Before proposing anything, we want to understand your case properly: how you work today, where your time goes and what you would like to run on its own. As soon as we have reviewed it, we will write to you — or call you, if you left a phone number — to talk it through.

If you want to add anything in the meantime (a document, a screenshot, a detail you left out), just reply to this email: it comes straight to us.

Best regards,
Diego Siñeriz and Dimitry Sosenko
D-Code Partners · Madrid · dcodepartners.com
```

**Prohibido en este correo:**
- `[DCP]` y `[CLIENT]`;
- IDs de lead o de Airtable;
- nombres de workflows, de n8n o de «AI Factory»;
- score o prioridad;
- «no aceptamos proyectos»;
- «solicitud registrada correctamente»;
- «según disponibilidad».

### 2.2 Aviso interno: uno por cada lead válido
- **Nodo nuevo:** «Preparar Aviso Interno Lead Web». Cuelga de «Interpretar Análisis IA», igual que las otras ramas, y se ejecuta **siempre**, no solo con prioridad Alta.
  - Si Gemini falla, el aviso debe salir igualmente con los datos del formulario, sin la parte de IA.
  - La plantilla exacta es la función `emailInterno()` de `api/_lib/emails-lead.js`, con `via: 'principal'` y estas filas extra:
    - `Score IA`, `Prioridad`, `Servicio recomendado`, `Resumen IA`, `Siguiente acción`;
    - enlace «Ver en Airtable» (mismo `recIdSeguro` que ya usa el nodo actual).
- **Gmail a** `dcodedepartment@gmail.com`:
  - **Asunto:** `NUEVA SOLICITUD DESDE LA WEB · {Nombre} ({Empresa})`. Si la prioridad es Alta, se añade ` · PRIORIDAD ALTA` al final.
  - **Reply-To:** el email del lead, para que «Responder» le escriba a él.
  - **No pasa por «CM/Plantilla de Email»**: nada de `[DCP][HOT LEAD]`, para que no se mezcle con monitorización, errores, LinkedIn ni informes.
- **Contenido** (en este orden):
  1. Cabecera negra: «Ha entrado un lead nuevo: {Nombre} ({Empresa})».
  2. Nombre, Empresa, Email (mailto), Teléfono (tel) y Fecha en hora de Madrid.
  3. Origen `Web · {pagina} · {IDIOMA}`.
  4. Mensaje completo, respetando los saltos de línea; incluye el resumen del configurador si lo hay.
  5. Los datos de IA.
  6. Botones «Responder a {Nombre}» y «Llamar».
- **Decisión de Dirección:** la alerta actual «HOT LEAD» sobra si se hace esto (se duplicaría). La recomendación es retirarla y dejar solo el aviso nuevo con ` · PRIORIDAD ALTA` en el asunto.
- **Recomendación para Gmail:** un filtro por asunto que contenga `NUEVA SOLICITUD DESDE LA WEB`, con etiqueta «Leads web» y marca de importante.

### 2.3 Pruebas que debe pasar Cowork 3
1. **Lead normal (prioridad Media o Baja):**
   - el cliente recibe el correo nuevo, sin corchetes y con Reply-To al equipo;
   - `dcodedepartment@gmail.com` recibe «NUEVA SOLICITUD DESDE LA WEB».
2. **Lead de prioridad Alta:** el mismo aviso, con « · PRIORIDAD ALTA» en el asunto, y ninguna alerta duplicada.
3. **Envío desde `/en/contacto`** (`idioma=en`): correo en inglés.
4. **Email en la lista de supresiones:** el cliente no recibe nada y el aviso interno sí sale.
5. **Nombre con `<script>`:** aparece escapado en los dos correos.
6. **«ADM/Latido del Formulario Web»:** sigue funcionando. Envía un token inválido y se detiene en Turnstile, así que no le afecta.

---

## 3. Lo que ya ha hecho Cowork 4 en la web (rama `web/dcp-cowork4`, sin Production)

- **Confirmación en pantalla, nueva y personal:**
  - «Perfecto, {Nombre}. Tu mensaje ya está con nosotros», con el correo al que escribiremos;
  - tres pasos (lo leemos → te escribimos → si encaja, hablamos), con foco y anuncio para lectores de pantalla.
- **Carga:** el botón dice «Enviando tu mensaje…», muestra un indicador y el formulario queda `aria-busy`.
- **Error:** mensaje humano con alternativas (correo y teléfono). El detalle técnico va solo a la consola; antes se mostraba al cliente («principal 500: …»).
- **Payload:** se añaden `idioma` y `pagina` (ver arriba).
- **`/api/contact-fallback`** (la vía de respaldo, responsabilidad de la web) ya envía:
  - al cliente, el correo nuevo en su idioma, con Reply-To al equipo;
  - al equipo, «NUEVA SOLICITUD DESDE LA WEB», con aviso destacado de que llegó por respaldo y **no está en Airtable**, y Reply-To al lead.
  - Todo sale escapado; antes el respaldo metía el texto del formulario sin escapar en el HTML.

## 4. Pendiente de decisión humana
- La web promete «Respondemos en menos de 24h» en la ficha de contacto. Los correos nuevos dicen «cuanto antes». Hay que decidir si se mantiene la promesa de 24 h, y entonces se añade a los correos, o se quita de la web.
- Retirar la alerta «HOT LEAD» actual (recomendado) o mantenerla.
