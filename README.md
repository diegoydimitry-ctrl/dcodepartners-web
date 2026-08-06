# D-Code Partners — Sitio Web

Sitio corporativo multipágina de **D-Code Partners**, Growth Partners & especialistas en automatización con Inteligencia Artificial.

## Contenido del repositorio

```
index.html, metodo.html, servicios.html, ...   → Páginas del sitio (una por URL)
aviso-legal.html, privacidad.html, cookies.html,
condiciones-contratacion.html, seguridad.html,
acuerdo-encargado-tratamiento.html             → Páginas legales (ver nota más abajo)
api/
  chat.js               → Endpoint del asistente de IA (Gemini/Anthropic, ver lib/providers.js)
  contact-fallback.js   → Envío de respaldo del formulario de contacto vía Resend (ver nota más abajo)
lib/
  providers.js  → Registro de proveedores LLM (Gemini/Anthropic) para el asistente
assets/
  css/, js/    → Sistema de diseño y lógica de frontend compartidos
  data/knowledge-base.json  → Contenido real del sitio, usado como contexto del asistente de IA
scripts/
  build-knowledge-base.js  → Regenera knowledge-base.json a partir del HTML publicado
automation/
  n8n/lead-ia-360/  → Copia de referencia del workflow de n8n que procesa el formulario de contacto
                       (ver su propio README). Es un snapshot exportado, no el workflow en vivo:
                       el workflow real en n8n Cloud puede haber evolucionado desde la última
                       exportación — no asumas que este JSON refleja el comportamiento actual.
```

### Páginas legales

`aviso-legal.html`, `privacidad.html` y `cookies.html` están enlazadas desde el footer de todo
el sitio. `condiciones-contratacion.html`, `seguridad.html` y `acuerdo-encargado-tratamiento.html`
son documentos añadidos posteriormente (contratación de servicios, seguridad de la información y
encargo de tratamiento RGPD art. 28) — existen y están en el sitemap, pero **todavía no están
enlazadas desde el menú ni el footer**, a la espera de decidir dónde encajarlas visualmente sin
tocar la estructura compartida del sitio.

## Ver la web en local

Las páginas estáticas se pueden servir con cualquier servidor estático simple:

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000
```

El endpoint `/api/chat` (asistente de IA) es una función serverless de Vercel y **no
funciona** con un servidor estático — para probarlo en local hace falta `vercel dev`
(o desplegar directamente en Vercel) con las variables de entorno correspondientes.

## Despliegue

El sitio está desplegado en **Vercel**, no en GitHub Pages: `vercel.json` configura
las cabeceras y el proyecto depende de la función serverless `/api/chat`, que GitHub
Pages no puede ejecutar (solo sirve archivos estáticos). El despliegue se dispara
automáticamente al hacer push a `main`, a través de la integración de Vercel con este
repositorio de GitHub.

Variables de entorno usadas en Vercel:

- `GEMINI_API_KEY3` (o `GEMINI_API_KEY`) — clave de Google AI Studio para el asistente de IA.
  Proveedor principal; si falta, `lib/providers.js` intenta `ANTHROPIC_API_KEY` como alternativa.
- `ANTHROPIC_API_KEY` (opcional) — clave de Anthropic, proveedor de respaldo del asistente de IA
  si Gemini no está disponible o no tiene clave configurada. Ninguno de los dos es estrictamente
  obligatorio por separado, pero **al menos uno de los dos debe estar configurado** para que el
  asistente de IA funcione.
- `RESEND_API_KEY` — clave de Resend, usada únicamente por `api/contact-fallback.js` como vía de
  respaldo del formulario de contacto cuando el envío principal al webhook de n8n falla. Sin esta
  clave, un fallo del webhook de n8n haría que la solicitud del formulario se pierda sin aviso.

## Notas

- El formulario de contacto (`contacto.html`) llama directamente, desde el navegador,
  al webhook de producción del workflow de n8n **Lead IA 360**
  (`assets/js/main.js` → constante `N8N_WEBHOOK_URL`). n8n verifica Cloudflare
  Turnstile, guarda el lead en Airtable, lo analiza con Gemini y envía los emails de
  confirmación y alerta interna — no hay backend intermedio en este repositorio para
  ese formulario. Detalle completo en `automation/n8n/lead-ia-360/README.md`.
- Los teléfonos y el email de contacto están escritos directamente en el HTML
  (`contacto.html`); edítalos ahí si cambian.
