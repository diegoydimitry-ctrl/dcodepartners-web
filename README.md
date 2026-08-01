# D-Code Partners — Sitio Web

Sitio corporativo multipágina de **D-Code Partners**, Growth Partners & especialistas en automatización con Inteligencia Artificial.

## Contenido del repositorio

```
index.html, metodo.html, servicios.html, ...   → Páginas del sitio (una por URL)
api/
  chat.js    → Endpoint del asistente de IA (Gemini, ver lib/providers.js)
lib/
  providers.js  → Registro de proveedores LLM (Gemini/Anthropic) para el asistente
assets/
  css/, js/    → Sistema de diseño y lógica de frontend compartidos
  data/knowledge-base.json  → Contenido real del sitio, usado como contexto del asistente de IA
scripts/
  build-knowledge-base.js  → Regenera knowledge-base.json a partir del HTML publicado
automation/
  n8n/lead-ia-360/  → Workflow de n8n que procesa el formulario de contacto (ver su propio README)
```

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

Variable de entorno necesaria en Vercel:

- `GEMINI_API_KEY3` (o `GEMINI_API_KEY`) — clave de Google AI Studio para el asistente de IA.

## Notas

- El formulario de contacto (`contacto.html`) llama directamente, desde el navegador,
  al webhook de producción del workflow de n8n **Lead IA 360**
  (`assets/js/main.js` → constante `N8N_WEBHOOK_URL`). n8n verifica Cloudflare
  Turnstile, guarda el lead en Airtable, lo analiza con Gemini y envía los emails de
  confirmación y alerta interna — no hay backend intermedio en este repositorio para
  ese formulario. Detalle completo en `automation/n8n/lead-ia-360/README.md`.
- Los teléfonos y el email de contacto están escritos directamente en el HTML
  (`contacto.html`); edítalos ahí si cambian.
