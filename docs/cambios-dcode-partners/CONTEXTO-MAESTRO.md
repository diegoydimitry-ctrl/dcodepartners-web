# CONTEXTO MAESTRO — D-Code Partners

> Contexto estable. No usar este archivo para información que cambia constantemente
> (eso vive en `ESTADO-ACTUAL.md`, `CAMBIOS-ABIERTOS.md`, `ROADMAP.md`).
> Todo lo marcado [NO VERIFICADO] o [PENDIENTE DE DEFINIR] debe confirmarse con
> Dirección o con herramientas antes de tratarse como hecho.

Última actualización: 2026-08-14 (auditoría AUD-20260814-001, primera con acceso en
vivo a n8n y Gmail — ver `AUDITORIAS.md`). Varias secciones marcadas [NO VERIFICADO]
en la versión del 2026-08-08 quedan confirmadas o corregidas más abajo.

## 1. Qué es D-Code Partners

[EVIDENCIA DIRECTA — README.md, footer/HTML del sitio] D-Code Partners se define en
el propio sitio como "Growth Partners & especialistas en automatización con
Inteligencia Artificial". Sitio público: dcodepartners.com.

Propósito, misión y modelo empresarial narrativo más allá de lo que dice el propio
sitio: [PENDIENTE DE DEFINIR] — no verificable únicamente desde el código del
repositorio.

## 2. Modelo de negocio (evidencia disponible desde la web)

[EVIDENCIA DIRECTA] La web organiza la oferta en "Departamentos IA" y "Servicios":

- Departamentos (`departamentos/*.html`): Dirección, Administración, Clientes,
  Finanzas, Marketing, Producción, Soporte, Comercial.
- Servicios (`servicios/*.html`): Agentes IA, Automatización IA, Integraciones.
- Blog (`blog/*.html`): contenido educativo sobre automatización/IA (ej.
  "Automatización vs Agentes IA", "Qué es la automatización con IA").

Esto es la propuesta de valor tal como se presenta públicamente, no necesariamente
el catálogo de servicios interno real, precios, o qué se vende hoy activamente.

Precios, planes, pilotos, condiciones comerciales reales: [PENDIENTE DE DEFINIR].
(Existen páginas legales — `condiciones-contratacion.html`, `garantias.html` — que
pueden contener información relevante pero no han sido volcadas aquí; léelas
directamente si se necesita ese detalle.)

## 3. Sistemas principales

[EVIDENCIA DIRECTA — n8n MCP, `search_workflows`, 2026-08-14] La cuenta n8n real
(`diegoydimitry2.app.n8n.cloud`) tiene **38 workflows**, no solo los 2 documentados
en `automation/n8n/` de este repositorio. Bloques identificados (prefijo del
nombre):

| Prefijo | Área | Ejemplos |
|---|---|---|
| `MK/` | Marketing | Lead IA 360, Contenido IA Redes Sociales, SEO IA |
| `CM/` | Comercial | Detección de Respuestas, Seguimiento Comercial IA, Generador de Propuestas IA, CRM Inteligente, Recordatorio Comercial, Plantilla de Email |
| `AAA/` | Prospección | Radar Comercial IA, AI Factory Orchestrator (inactivo) |
| `DIR/` | Dirección / meta-negocio | Executive Board (Auditor Interno, Director Estratégico IA, Recolector Externo), Informe Diario/Semanal/Mensual, Dashboard Ejecutivo, KPIs Empresa |
| `PRD/` | Producción/Proyectos | Gestión de Proyectos, Asignación Automática, Control de Entregas, Seguimiento de Tareas |
| `CLS/` | Clientes | Onboarding, Bienvenida, Renovaciones, Encuestas |
| `FNZ/` | Finanzas | Facturación IA (sin disparador aún), Cobros y Recordatorios, Control de Gastos |
| `SP/` | Soporte | Tickets IA, Chat IA Clientes |
| `ADM/` | Administración | Monitorización n8n, Gestión Documental, Copias de Seguridad |

Sistemas base:

| Sistema | Rol | Evidencia |
|---|---|---|
| Sitio web (HTML estático + Vercel) | Presencia comercial, formulario de contacto, asistente de IA embebido | `index.html`, resto de páginas, `vercel.json` |
| n8n Cloud | Motor de automatización de toda la empresa (38 workflows) | MCP n8n, verificado en vivo 2026-08-14 |
| Airtable | Almacén de Leads, Clientes y otras tablas de negocio | Esquema de `Leads` confirmado vía nodos n8n (base `app5JfVEjK4JiMXEm`, tabla `tblfQXOCLlEf9cJUa`). **El conector Airtable MCP de esta sesión no tiene bases visibles (0 bases)** — no se ha podido leer Airtable directamente, solo a través de n8n. |
| Gmail (OAuth2 vía n8n) | Bandeja `dcodedepartment@gmail.com`: recibe respuestas de leads, envía informes internos, alertas de error | Verificado en vivo, MCP Gmail |
| Gemini API | Análisis/scoring de leads y radar, generación de contenido y propuestas | Múltiples workflows |
| Anthropic (Claude) | Genera el informe ejecutivo de "DIR/Executive Board - Director Estratégico IA" | Descripción del workflow, MCP n8n |
| Cloudflare Turnstile | Anti-spam del formulario de contacto | `automation/n8n/lead-ia-360/README.md` |
| LinkedIn / Instagram / Facebook / X | Publicación de contenido (ahora vía "MK/Contenido IA Redes Sociales", no solo LinkedIn) | Email "[Contenido IA] Nuevo contenido pendiente de revisión", 2026-08-14 |

Detalle de cada integración: ver `SISTEMAS-Y-INTEGRACIONES.md` y `ARQUITECTURA-DCP.md`.

## 4. Arquitectura de asistentes/agentes

[EVIDENCIA DIRECTA — corrige la versión anterior, que lo marcaba NO VERIFICADO]
Los asistentes "Director" y "Auditor" **sí existen**, pero no como chats separados
sino como workflows de n8n dentro del bloque `DIR/Executive Board`:

- **DIR/Executive Board - Auditor Interno**: revisa n8n/Airtable/Gmail/GitHub a
  diario y calcula métricas del negocio.
- **DIR/Executive Board - Director Estratégico IA**: lee esas señales, llama a
  Claude (Anthropic) para redactar el informe ejecutivo, y lo envía por email
  (asunto `[DCP][DASHBOARD] Executive Board`).
- **DIR/Executive Board - Recolector Externo**: alimenta señales externas
  (RSS/web) al Director Estratégico.

Producen el email diario "[DCP][DASHBOARD] Executive Board" — verificado en vivo el
2026-08-14. **Advertencia de fiabilidad**: en la auditoría de hoy se detectó que el
Auditor Interno diagnosticó mal la causa raíz de los errores del día (ver
`CAMBIOS-ABIERTOS.md`, CAMBIO-005) — sus conclusiones no deben tomarse como
verificación independiente sin contrastar.

No hay evidencia de un "Auditor n8n y Airtable" como entidad separada — puede ser
otro nombre para el mismo Auditor Interno, o vivir fuera de n8n. [NO VERIFICADO].

Este repositorio define además un rol propio: **"Cambios D-Code Partners"**,
descrito en `CLAUDE.md`. Su responsabilidad: detectar, analizar, priorizar,
proponer y coordinar — no ejecutar por defecto.

## 5. Terminología interna

- **Lead**: registro en la tabla Airtable `Leads`, cualificado por Gemini (score,
  prioridad, urgencia). [EVIDENCIA DIRECTA]
- **HOT / WARM**: clasificación que asigna "AAA/Radar Comercial IA" a empresas
  encontradas por sector en Google Places, auditadas automáticamente (diseño, UX,
  digitalización). **Confirmado en producción** (verificado en vivo 2026-08-14: 0
  errores en 8 ejecuciones diarias, genera HOT reales — ej. "Ichikani Madrid",
  "Rosi La Loca" el 14/08). Corrige la versión anterior de este documento, que lo
  marcaba [NO VERIFICADO].
- **CRM Inteligente**: workflow que sincroniza semanalmente empresas HOT/WARM del
  Radar hacia la tabla `Clientes` como prospectos. Existe pero solo se ha ejecutado
  una vez en 12 días — ver CAMBIO-006.
- Cualquier otro término de negocio (propuesta, seguimiento, cierre, ticket, etc.):
  [PENDIENTE DE DEFINIR] mientras no se confirme su significado operativo exacto.

## 6. Principios de gobierno para el rol "Cambios D-Code Partners"

Jerarquía de priorización (de mayor a menor peso al decidir qué cambio importa más):

1. Ingresos
2. Clientes
3. Proceso comercial
4. Automatización
5. Operaciones
6. Fiabilidad
7. Datos
8. Escalabilidad
9. Eficiencia
10. Optimización y perfeccionamiento

Reglas duras:

- No ejecutar cambios en producción sin autorización explícita de Dirección en ese
  turno (ver `CLAUDE.md`).
- No inventar información. Usar siempre las categorías de evidencia definidas en
  `ESTADO-ACTUAL.md`.
- No confundir auditoría con ejecución.
- No tratar como resuelto lo que no tiene evidencia de estarlo.
- No priorizar por volumen de hallazgos: siempre reducir a un TOP 3 accionable.

## 7. Huecos de contexto conocidos (a rellenar por Dirección)

- [PENDIENTE DE DEFINIR] Estructura de precios/planes reales.
- ~~Si existe un Radar Comercial IA~~ — RESUELTO 2026-08-14: existe y funciona
  ("AAA/Radar Comercial IA", 0 errores).
- ~~Si existen los asistentes Director/Auditor~~ — RESUELTO 2026-08-14: existen como
  workflows n8n del bloque `DIR/Executive Board` (ver sección 4). Queda
  [PENDIENTE DE DEFINIR] si "Auditor n8n y Airtable" es una entidad distinta.
- [PENDIENTE DE DEFINIR] Proceso de facturación/cobro real — el workflow
  `FNZ/Facturación IA` existe pero confirma él mismo que no tiene disparador de
  negocio automático todavía (0 clientes activos hace que esto no sea urgente).
- [PENDIENTE DE DEFINIR] Quién es responsable operativo de cada sistema (n8n,
  Airtable, Gmail, web) para poder rellenar "Responsable" en cambios/incidencias.
- [NO VERIFICADO — CRÍTICO] Origen real de los 13 leads que muestra el informe
  diario en Airtable, dado que el webhook de captación web nunca se ha ejecutado.
  Ver CAMBIO-001 (actualizado) en `CAMBIOS-ABIERTOS.md`.
