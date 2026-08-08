# CONTEXTO MAESTRO — D-Code Partners

> Contexto estable. No usar este archivo para información que cambia constantemente
> (eso vive en `ESTADO-ACTUAL.md`, `CAMBIOS-ABIERTOS.md`, `ROADMAP.md`).
> Todo lo marcado [NO VERIFICADO] o [PENDIENTE DE DEFINIR] debe confirmarse con
> Dirección o con herramientas antes de tratarse como hecho.

Última actualización: 2026-08-08 (creación inicial de esta memoria documental).

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

## 3. Sistemas principales (verificados en este repositorio)

| Sistema | Rol | Evidencia |
|---|---|---|
| Sitio web (HTML estático + Vercel) | Presencia comercial, formulario de contacto, asistente de IA embebido | `index.html`, resto de páginas, `vercel.json` |
| n8n Cloud | Motor de automatización: cualificación de leads, publicación en LinkedIn | `automation/n8n/*/README.md` + `*.workflow.json` |
| Airtable | Almacén de leads (tabla `Leads`) | `automation/n8n/lead-ia-360/README.md` (esquema real documentado) |
| Gmail (OAuth2 vía n8n) | Envío de email de confirmación al lead + alerta interna al equipo comercial | ídem |
| Gemini API | Análisis/scoring del lead (workflow) y asistente de chat del sitio (`api/chat.js`) | `automation/n8n/lead-ia-360/README.md`, `lib/providers.js` |
| Anthropic API | Proveedor alternativo del asistente de chat del sitio | `lib/providers.js` |
| Cloudflare Turnstile | Anti-spam del formulario de contacto | `automation/n8n/lead-ia-360/README.md` |
| LinkedIn (OAuth2 vía n8n) | Publicación automática de contenido | `automation/n8n/linkedin-auto-post/README.md` |

Detalle de cada integración: ver `SISTEMAS-Y-INTEGRACIONES.md` y `ARQUITECTURA-DCP.md`.

**No verificado en este repositorio** (puede existir fuera de él): Radar Comercial
IA, clasificación/HOT/WARM de leads previa a Airtable, CRM de operaciones,
automatización de propuestas comerciales, facturación/cobros. No hay evidencia en
este repo de que existan — no se debe asumir ni que existen ni que no existen.

## 4. Arquitectura de asistentes/agentes

[NO VERIFICADO desde este repositorio] La existencia de otros asistentes
("Director D-Code Partners", "Auditor D-Code Partners", "Auditor n8n y Airtable")
ha sido mencionada por Dirección en conversación, pero este repositorio no contiene
evidencia de su configuración, alcance real ni estado. Si esos asistentes vivos en
otra plataforma (p. ej. proyectos de claude.ai, Slack) definen responsabilidades
que deban respetarse desde aquí, deben documentarse explícitamente en este archivo
cuando Dirección las confirme.

Este repositorio define un único rol propio: **"Cambios D-Code Partners"**, descrito
en `CLAUDE.md` y en el resto de esta carpeta. Su responsabilidad: detectar,
analizar, priorizar, proponer y coordinar cambios — no ejecutar por defecto.

## 5. Terminología interna

- **Lead**: registro creado en la tabla Airtable `Leads` a partir del formulario de
  contacto del sitio, cualificado automáticamente por Gemini (score, prioridad,
  urgencia). [EVIDENCIA DIRECTA]
- **HOT / WARM / Radar Comercial**: terminología mencionada por Dirección en
  conversación para un proceso de prospección previo al Lead. [NO VERIFICADO] — no
  hay evidencia en este repositorio de que este paso exista o esté implementado.
- Cualquier otro término de negocio (propuesta, seguimiento, cierre, ticket, etc.):
  [PENDIENTE DE DEFINIR] mientras no se confirme su significado operativo exacto en
  D-Code Partners.

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
- [PENDIENTE DE DEFINIR] Si existe un Radar Comercial IA y en qué sistema vive.
- [PENDIENTE DE DEFINIR] Si existen los asistentes "Director", "Auditor" y "Auditor
  n8n y Airtable" fuera de este repositorio, y cuál es su alcance exacto.
- [PENDIENTE DE DEFINIR] Proceso de facturación/cobro y sistema donde vive.
- [PENDIENTE DE DEFINIR] Quién es responsable operativo de cada sistema (n8n,
  Airtable, Gmail, web) para poder rellenar "Responsable" en cambios/incidencias.
