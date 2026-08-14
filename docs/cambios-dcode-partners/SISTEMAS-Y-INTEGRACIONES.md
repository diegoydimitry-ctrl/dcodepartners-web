# SISTEMAS Y INTEGRACIONES — D-Code Partners

> Inventario plano de sistemas. Nunca escribir aquí secretos, tokens, contraseñas
> ni credenciales reales — solo qué tipo de credencial se usa y dónde vive.

Última actualización: 2026-08-14 (añadido bloque de n8n en producción, 38
workflows — ver auditoría AUD-20260814-001).

---

### Sistema: n8n Cloud — inventario completo de workflows (verificado en vivo)

- Tipo: plataforma de automatización, cuenta `diegoydimitry2.app.n8n.cloud`.
- Estado: 🔴 en crisis operativa reportada por el propio sistema (~27,6% tasa de
  error el 2026-08-14), con 3 workflows críticos confirmados rotos (ver
  `CAMBIOS-ABIERTOS.md` CAMBIO-004, CAMBIO-005) y 1 nunca ejecutado (CAMBIO-001).
- Workflows por bloque, 38 total (`search_workflows`, 2026-08-14):
  - **MK/** (Marketing): Lead IA 360 (0 ejecuciones, CAMBIO-001), Contenido IA
    Redes Sociales, SEO IA, Newsletter IA (inactivo).
  - **CM/** (Comercial): Detección de Respuestas (roto, CAMBIO-004), Seguimiento
    Comercial IA (roto, CAMBIO-005), Generador de Propuestas IA, CRM Inteligente
    (casi sin uso, CAMBIO-007), Recordatorio Comercial, Cliente Activo
    (Orquestador), Plantilla de Email (sub-workflow compartido por 18+ workflows).
  - **AAA/** (Prospección): Radar Comercial IA (sano, 0 errores), AI Factory
    Orchestrator (inactivo, CAMBIO-010).
  - **DIR/** (Dirección / meta-negocio): Executive Board - Auditor Interno
    (diagnóstico con error confirmado, CAMBIO-006), Executive Board - Director
    Estratégico IA (usa Claude/Anthropic), Executive Board - Recolector Externo,
    Informe Diario/Semanal/Mensual, Dashboard Ejecutivo, KPIs Empresa
    (sub-workflow).
  - **PRD/** (Proyectos): Gestión de Proyectos, Asignación Automática (0 errores,
    ver CAMBIO-006), Control de Entregas, Seguimiento de Tareas.
  - **CLS/** (Clientes): Onboarding Cliente IA, Bienvenida Cliente, Renovaciones,
    Encuestas Automáticas.
  - **FNZ/** (Finanzas): Facturación IA (0 ejecuciones, sin disparador todavía),
    Disparador de Facturación Recurrente, Cobros y Recordatorios de Pago, Control
    de Gastos.
  - **SP/** (Soporte): Tickets IA, Chat IA Clientes.
  - **ADM/** (Administración): Monitorización n8n (probable origen de las alertas
    `[DCP][ERROR]` cada ~2h), Gestión Documental, Copias de Seguridad.
- Riesgos: patrón sistémico de "fix hecho, no publicado" confirmado en vivo
  (CAMBIO-004); credenciales que expiran sin alerta proactiva (CAMBIO-005); un
  sistema de auto-diagnóstico (Auditor Interno) que puede equivocarse de causa raíz
  (CAMBIO-006).
- Última verificación: 2026-08-14 (en vivo, MCP n8n).

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

### Sistema: n8n Cloud (resumen — ver inventario completo de 38 workflows arriba)

- Tipo: Plataforma de automatización (SaaS).
- Función: ejecuta toda la automatización de la empresa, no solo `lead-ia-360` y
  `linkedin-auto-post` (esos dos son los únicos versionados en este repositorio;
  hay 36 más solo en la cuenta n8n — ver arriba).
- Estado: 🔴 REQUIERE ATENCIÓN — verificado en vivo el 2026-08-14, ~27,6% de tasa
  de error reportada, 3 workflows críticos rotos/nunca ejecutados.
- Dependencias: Airtable, Gemini, Anthropic (Claude), Gmail, Cloudflare Turnstile,
  LinkedIn/Instagram/Facebook/X, Google Places (Radar), Google Drive.
- Credenciales: gestionadas dentro de n8n. Al menos una confirmada **inválida**:
  "Airtable Personal Access Token account" (`OrGjGOCyB2b3E2s5`), usada por
  `CM/Seguimiento Comercial IA` — ver CAMBIO-005.
- Riesgos: histórico real y **confirmado en vivo hoy** de fallos de configuración
  tras editar sin publicar (ver `INCIDENCIAS.md` — patrón sistémico de
  gobernanza/despliegue, INC-20260814-001); el propio sistema de auto-diagnóstico
  (Auditor Interno) puede señalar la causa equivocada (CAMBIO-006).
- Última verificación: 2026-08-14, en vivo (MCP n8n).

### Sistema: Airtable

- Tipo: Base de datos (SaaS).
- Función: almacén de leads (tabla `Leads`) y, según nombres de workflows vistos en
  n8n, también de `Clientes`, `Proyectos`, `Gastos`, `Facturas` y otras tablas de
  negocio no confirmadas en detalle.
- Estado: 🟠 REQUIERE ATENCIÓN — **el conector Airtable MCP de esta sesión no tiene
  ninguna base visible** (`list_bases` → `[]`, y `list_tables_for_base` sobre
  `app5JfVEjK4JiMXEm` devolvió 403). No se ha podido leer Airtable directamente en
  ninguna auditoría hasta ahora — solo se conoce lo que revelan los parámetros de
  los nodos n8n y los informes automáticos por email. Esto es una limitación de
  herramienta a resolver antes de la próxima auditoría (conectar un token de
  Airtable con acceso real a las bases de D-Code Partners).
- Dependencias: ninguna (es el destino final de escritura de leads).
- Credenciales: Personal Access Token, tipo "Airtable Token API", gestionado dentro
  de n8n. Al menos una copia de esta credencial (id `OrGjGOCyB2b3E2s5`) está
  **confirmada inválida** desde al menos el 8 de agosto (401 en cada ejecución de
  `CM/Seguimiento Comercial IA`) — ver CAMBIO-005. No se ha verificado si otros
  workflows que también usan Airtable comparten esta misma credencial rota.
- Workflows relacionados: `lead-ia-360`/`MK/Lead IA 360`, `CM/Detección de
  Respuestas`, `CM/Seguimiento Comercial IA`, `CM/CRM Inteligente`, y
  probablemente varios más de los bloques `PRD/`, `FNZ/`, `CLS/`.
- Tablas relacionadas: `Leads` (base `app5JfVEjK4JiMXEm`, tabla
  `tblfQXOCLlEf9cJUa`) — columnas documentadas en
  `automation/n8n/lead-ia-360/README.md` y confirmadas como referenciadas
  activamente por los nodos n8n inspeccionados el 2026-08-14.
- Riesgos: columnas `Cargo`, `Web`, `Sector`, `Pais`, `Fuente`, `Presupuesto`,
  `Fecha seguimiento`, `Notas comerciales`, `Responsable` existen en la tabla pero
  no las rellena ningún workflow — dependen enteramente de proceso manual.
- Última verificación: 2026-08-14 — intento en vivo, sin acceso vía el conector
  MCP de esta sesión.

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
