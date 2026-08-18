# Daily Content Planner — D-Code Daily Content Engine (V2)

> Calendario real de los workflows de n8n que forman la fábrica de contenido.
> Todos están **creados inactivos** — ninguno se activa sin autorización
> explícita de Dirección (ver `docs/cambios-dcode-partners/CLAUDE.md`, reglas
> de comportamiento). Este documento describe el orden y el propósito de cada
> fase, no un cambio de estado de los workflows.

## Por qué este orden

Cada fase depende de datos que produce la anterior — investigación antes que
ideación, ideación antes que decisión de formato, decisión antes que
producción. El horario deja margen entre fases (no las encadena en el mismo
minuto) porque cada llamada a Gemini y cada lectura de datos tarda unos
segundos, y porque así Dirección puede revisar `CF_Ideas` a mano entre una
fase y la siguiente si quiere descartar algo antes de que se produzca.

## Horario

| Hora  | Workflow (n8n) | Qué hace |
|---|---|---|
| 07:00 | `CF/Investigación + Ideación + Scoring Editorial` | Lee 3 fuentes RSS (tech/management/debate), autoanaliza la web real de D-Code (`knowledge-base.json`) y el historial propio (`CF_Videos`/`CF_Posts`), lee memoria editorial, genera y puntúa 6 ideas con Gemini, guarda en `CF_Ideas`, avisa a Dirección por email con las 3 mejores. |
| 07:20 | `CF/Memory + Diversity Gate` | Para cada idea `APROBADA` de hoy: calcula un embedding semántico y lo compara contra toda la memoria editorial histórica (no solo 30 días) para detectar repetición de fondo, no solo de texto. Decide `formatoDecidido`: `VIDEO`, `POST_LINKEDIN`, `CARRUSEL_IG`, `CAPTION_IG`, o `NO_PUBLICAR`. Actualiza `CF_Ideas`. |
| 08:00 | `CF/Concept → Script → Storyboard → Render` | Solo produce las ideas con `formatoDecidido = VIDEO` (o sin decidir aún, por compatibilidad). Gemini escribe guion + decide diseño de audio de esa pieza en concreto (familia musical, si lleva voz, efectos por escena). Guarda en `CF_Scripts`/`CF_Videos` y dispara el render en GitHub Actions. |
| 08:15 | `CF/Producción de Posts (LinkedIn + Instagram)` | Solo produce las ideas con `formatoDecidido` de tipo post. Gemini redacta el texto/caption, hashtags, CTA no genérica, y las slides si aplica (carrusel o tarjeta de apoyo). Guarda en `CF_Posts` y dispara el render de las piezas visuales estáticas en GitHub Actions si hay slides. |
| — | Ideas con `formatoDecidido = NO_PUBLICAR` | No entran en ningún workflow de producción. Es una decisión válida, no un error — ver `CAMBIOS-ABIERTOS.md` / sección de Format Decision en el informe V2. |

## Qué NO hay todavía (limitación explícita)

- **Publicación real**: ningún workflow publica en LinkedIn/Instagram. Todo
  llega hasta `estado = READY_FOR_REVIEW` (posts) o el vídeo renderizado en
  una Release de GitHub (vídeos). Publicar requiere credenciales que solo
  Dirección puede autorizar y crear — ver sección de dependencias externas
  del informe V2.
- **Revisión humana antes de publicar**: por diseño. El sistema decide qué
  producir, no qué publicar sin supervisión.
- **Aprendizaje con métricas reales**: `CF_Analytics` existe como tabla
  preparada, pero no hay publicación real todavía, así que no hay métricas
  reales que aprender — ver Learning Loop en el informe V2.

## "Un día perfecto" no es "3 piezas"

El Diversity Gate no fuerza cantidad. Un día con 1 solo vídeo excelente y 0
posts es un resultado válido si esa fue la decisión de formato correcta para
las ideas de ese día — igual que un día con `NO_PUBLICAR` en alguna idea no es
un fallo del sistema, es la señal funcionando.
