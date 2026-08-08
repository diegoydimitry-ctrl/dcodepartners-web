# SISTEMAS Y INTEGRACIONES — D-Code Partners

> Inventario plano de sistemas. Nunca escribir aquí secretos, tokens, contraseñas
> ni credenciales reales — solo qué tipo de credencial se usa y dónde vive.

Última actualización: 2026-08-08.

---

### Sistema: Sitio web (dcodepartners.com)

- Tipo: Sitio estático (HTML) + funciones serverless (Vercel).
- Función: presencia comercial, formulario de contacto, asistente de IA embebido.
- Estado: 🟢 desplegado, con despliegue automático en push a `main` (README.md).
- Dependencias: Vercel, workflow n8n `lead-ia-360` (formulario), Gemini/Anthropic
  (asistente de chat).
- Credenciales: `GEMINI_API_KEY3` / `GEMINI_API_KEY`, `ANTHROPIC_*` (no
  confirmado el nombre exacto de la variable Anthropic — ver `lib/providers.js`),
  configuradas como variables de entorno en Vercel. No están en este repositorio.
- Workflows relacionados: `lead-ia-360`.
- Tablas relacionadas: ninguna directamente (Airtable lo gestiona n8n).
- Riesgos: variable de entorno de Gemini con nombre no estándar
  (`GEMINI_API_KEY3`) — riesgo de confusión si alguien la reconfigura asumiendo el
  nombre estándar `GEMINI_API_KEY`. Ya mitigado en código (acepta ambas).
- Última verificación: 2026-08-08 (lectura de código, no de la instancia real en
  Vercel).

### Sistema: n8n Cloud

- Tipo: Plataforma de automatización (SaaS).
- Función: ejecuta los workflows `lead-ia-360` y `linkedin-auto-post`.
- Estado: ⚪ NO VERIFICADO en vivo (no se consultó la cuenta real en esta pasada).
- Dependencias: Airtable, Gemini, Gmail, Cloudflare Turnstile, LinkedIn.
- Credenciales: gestionadas dentro de n8n (Airtable Token API, Header Auth de
  Gemini, Gmail OAuth2, Custom Auth de Turnstile, LinkedIn OAuth2). Ninguna vive en
  este repositorio ni en los `.workflow.json` exportados (según README).
- Workflows relacionados: `lead-ia-360` (v10 documentada), `linkedin-auto-post`.
- Tablas relacionadas: Airtable `Leads`.
- Riesgos: histórico real de fallos de configuración tras importar/reconectar
  workflows (ver `INCIDENCIAS.md` — patrón sistémico de gobernanza/despliegue).
- Última verificación: [NO VERIFICADO].

### Sistema: Airtable

- Tipo: Base de datos (SaaS).
- Función: almacén de leads (tabla `Leads`).
- Estado: ⚪ NO VERIFICADO en vivo. Esquema documentado en el README del workflow,
  confirmado como correcto en la v6 de ese documento (no en esta sesión).
- Dependencias: ninguna (es el destino final de escritura de leads).
- Credenciales: Personal Access Token, tipo "Airtable Token API", gestionado dentro
  de n8n.
- Workflows relacionados: `lead-ia-360` (dos nodos: crear/actualizar lead,
  actualizar análisis IA).
- Tablas relacionadas: `Leads` — columnas documentadas en
  `automation/n8n/lead-ia-360/README.md`.
- Riesgos: columnas `Cargo`, `Web`, `Sector`, `Pais`, `Fuente`, `Presupuesto`,
  `Fecha seguimiento`, `Notas comerciales`, `Responsable` existen en la tabla pero
  no las rellena ningún workflow — dependen enteramente de proceso manual.
- Última verificación: [NO VERIFICADO].

### Sistema: Gmail

- Tipo: Correo (Google Workspace/Gmail), vía OAuth2 en n8n.
- Función: email de confirmación al lead + alerta interna al equipo comercial
  (`config.salesTeamEmail`, por defecto `dcodedepartment@gmail.com` según el README
  del workflow).
- Estado: ⚪ NO VERIFICADO en vivo.
- Dependencias: n8n (workflow `lead-ia-360`).
- Credenciales: OAuth2, gestionada dentro de n8n.
- Workflows relacionados: `lead-ia-360`.
- Riesgos: precedente real de expresiones mal formadas (`message` sin prefijo `=`)
  que habrían enviado placeholders literales en vez de datos reales del lead — ya
  corregido según el README (v9), pero es la clase de fallo que puede repetirse tras
  ediciones manuales en el editor de n8n.
- Última verificación: [NO VERIFICADO].

### Sistema: Gemini API (Google AI Studio)

- Tipo: LLM, vía API.
- Función: (1) análisis/scoring de leads en el workflow n8n; (2) proveedor por
  defecto del asistente de chat del sitio.
- Estado: 🟡 con precedente de fallos (modelo dado de baja, respuesta vacía por
  límite de tokens de "thinking") — ambos mitigados en código según comentarios de
  `lib/providers.js`.
- Dependencias: clave de API válida.
- Credenciales: (n8n) Header Auth `x-goog-api-key`; (web) `GEMINI_API_KEY3` /
  `GEMINI_API_KEY` en Vercel.
- Riesgos: Google retira versiones concretas de modelos sin aviso — mitigado
  usando el alias `-latest` en el sitio; el workflow n8n usa `gemini-2.5-flash`
  configurable pero no confirmado si usa alias o versión fija.
- Última verificación: [NO VERIFICADO] (solo lectura de código).

### Sistema: Anthropic API

- Tipo: LLM, vía API.
- Función: proveedor alternativo del asistente de chat del sitio (usado si no hay
  clave de Gemini, o si `AI_PROVIDER=anthropic`).
- Estado: [NO VERIFICADO] si hay clave configurada actualmente en Vercel.
- Credenciales: variable de entorno en Vercel (nombre exacto no confirmado en esta
  pasada — revisar `lib/providers.js` completo si se necesita).
- Última verificación: [NO VERIFICADO].

### Sistema: Cloudflare Turnstile

- Tipo: Anti-spam / verificación humana.
- Función: proteger el formulario de contacto de envíos automatizados.
- Estado: 🟡 diseño documentado como "falla cerrado" (token inválido/caducado o
  fallo de red bloquea el envío).
- Credenciales: `TURNSTILE_SECRET_KEY`, en credencial n8n tipo Custom Auth (o, como
  alternativa documentada, hardcodeado en el nodo — a confirmar cuál de las dos
  opciones está realmente en uso).
- Última verificación: [NO VERIFICADO].

### Sistema: LinkedIn

- Tipo: Red social, vía OAuth2 en n8n.
- Función: publicación automática de contenido programado.
- Estado: ⚪ NO VERIFICADO en vivo. Limitaciones conocidas y documentadas: solo
  texto, solo perfil personal (no página de empresa), sin resharing automático.
- Credenciales: LinkedIn OAuth2 API, gestionada en n8n.
- Workflows relacionados: `linkedin-auto-post`.
- Riesgos: calendario embebido termina el 28/08/2026 (ver CAMBIO-002).
- Última verificación: [NO VERIFICADO].

### Sistema: Vercel

- Tipo: Hosting/despliegue.
- Función: sirve el sitio estático y las funciones serverless (`api/chat.js`,
  `api/contact-fallback.js`).
- Estado: 🟢 según README (despliegue automático en push a `main`).
- Credenciales: variables de entorno (`GEMINI_API_KEY3`/`GEMINI_API_KEY`, y las que
  requiera `resend` para `contact-fallback.js` — no confirmado en esta pasada).
- Última verificación: [NO VERIFICADO] (no se consultó el dashboard real de Vercel).
