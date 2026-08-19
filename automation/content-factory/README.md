# D-Code Content Factory

Sistema de creación de contenido (vídeo + posts LinkedIn/Instagram) para
D-Code Partners. Construido por el rol "Cambios D-Code Partners" bajo
autorización explícita de Dirección (DCP-CONTENT-FACTORY-001, 2026-08-18),
ampliado a V2 (DCP-CONTENT-FACTORY V2: Post Engine + Memory/Diversity Gate)
y a DCP-CONTENT-FACTORY-003 (sin voz/TTS en el pipeline automático +
Diversity Score compuesto de 5 dimensiones). Ver `CONTINUATION-STATE.md`
para el checkpoint técnico más reciente y `DAILY-PLANNER.md` para el
calendario real de los 4 workflows.

## Arquitectura (resumen)

```
n8n (orquestación + LLM)              GitHub Actions (render)         Distribución
───────────────────────              ────────────────────────         ────────────
CF/Investigación
  + Ideación + Scoring
  (Gemini, diario 07:00)
        │
        ▼
CF/Memory + Diversity Gate
  (embedding + Diversity Score,
   decide formatoDecidido:
   VIDEO / POST_LINKEDIN /
   CARRUSEL_IG / CAPTION_IG /
   NO_PUBLICAR — diario 07:20)
        │
        ├── formatoDecidido = VIDEO ────┐
        │   CF/Concept → Script         │
        │   → Storyboard → Render       │
        │   (Gemini, sin voz/TTS,       │
        │    diario 08:00)              │
        │                               ▼
        │                    repository_dispatch (render-video.yml)
        │                    Remotion + FFmpeg, sin API de vídeo de pago
        │                               │
        │                               ▼
        │                    GitHub Release (mp4) — URL pública
        │
        └── formatoDecidido = POST_* ───┐
            CF/Producción de Posts      │
            (LinkedIn + Instagram,      │
             diario 08:15)              ▼
                              repository_dispatch (render-post.yml)
                              si hay carrusel/slides
                                        │
                                        ▼
                         [PENDIENTE: publicador LinkedIn/Instagram —
                          credenciales OAuth que debe aportar Dirección.
                          Hoy todo llega hasta READY_FOR_REVIEW/mp4
                          renderizado, nunca se publica solo.]
```

Por qué esta separación: n8n Cloud no puede ejecutar Chromium/FFmpeg (no
tiene runtime de código arbitrario con esos binarios), así que la
generación de vídeo no puede vivir dentro de n8n. GitHub Actions sí lo
soporta y es gratuito para este volumen. Content Creation (n8n + GitHub
Actions) queda así completamente separado de Social Publishing (todavía sin
construir, ver limitaciones), tal como pedía el encargo.

## Componentes

| Componente | Dónde vive | Qué hace |
|---|---|---|
| Modelo de datos | n8n Data Tables (`CF_Ideas`, `CF_Scripts`, `CF_Videos`, `CF_Posts`, `CF_Calendar`, `CF_Publications`, `CF_Analytics`, `CF_EditorialMemory`, `CF_Errors`) | Estado de todo el pipeline, memoria editorial anti-repetición |
| Research Engine (investigación + scoring) | n8n, workflow `CF/Investigación + Ideación + Scoring Editorial` (id `Sip8U9IyPpQ8j6NA`) | 3 fuentes RSS + autoanálisis web real + autoanálisis de historial propio → Gemini genera y puntúa 6 ideas/día, guarda top 3, notifica por email |
| Memory Engine (Diversity Gate) | n8n, workflow `CF/Memory + Diversity Gate` (id `H5b13tf9PIrlK4fQ`) | Embedding semántico vs memoria editorial histórica completa (no solo 30 días) + Diversity Score compuesto (tema/estructura/audio/CTA/formato); decide `formatoDecidido` |
| Video Engine (guion + storyboard) | n8n, workflow `CF/Concept → Script → Storyboard → Render` (id `ARLDFrmHWdpQsNTb`) | Convierte cada idea `formatoDecidido=VIDEO` en guion + diseño de audio (música/SFX, **sin voz**) + storyboard JSON, dispara el render |
| Post Engine | n8n, workflow `CF/Producción de Posts (LinkedIn + Instagram)` (id `t96QwFyZj1Tw6ubc`) | Redacta texto/caption/hashtags/CTA no genérica para ideas `formatoDecidido` de tipo post, dispara render de slides si aplica |
| Video render engine | `video-engine/` (Remotion + React + TypeScript) | Renderiza el storyboard JSON como vídeo de marca (motion graphics + música/SFX, sin voz sintética) |
| Render pipeline | `.github/workflows/render-video.yml`, `.github/workflows/render-post.yml` | Ejecutan el motor de render en CI, publican el resultado como GitHub Release |
| QA Engine | `video-engine/scripts/qa-check.mjs` + `video-engine/scripts/audio-qa.mjs` + `video-engine/QA_CHECKLIST.md` + 32 tests automáticos (`npm test`) | Automático (duración/resolución/códec/audio) + Content Review + Visual Review |
| Diversity Score | `video-engine/src/diversity/score.ts` (fuente única de verdad, sincronizada a mano en los nodos de n8n) | 5 dimensiones ponderadas, distingue `DIVERSO` / `REPETICION_PARCIAL` / `DUPLICADO_PROBABLE` / `ADAPTACION_MULTIPLATAFORMA` |

**Estado en vivo de los 4 workflows: los 4 siguen `active: false`.** Nunca se
han ejecutado contra la cuenta real de n8n — toda la verificación hasta
ahora es local (tests + render local). Ver `CONTINUATION-STATE.md` sección
I para las dos decisiones pendientes de Dirección antes de una primera
ejecución real.

## Identidad visual (`video-engine/src/brand/`)

Extraída por análisis de fotograma de los 2 vídeos de referencia aportados
por Dirección (no copiados literalmente): fondo casi negro con resplandor
radial azul, tarjetas UI redondeadas con borde sutil, tipografía Archivo
(titulares) + Inter (UI/captions) + JetBrains Mono (URLs/técnico), acentos
azul/verde/rojo. Ver `tokens.ts` para los valores exactos.

**Logo**: `Logo.tsx` es una reconstrucción aproximada (icono "D" + dos
puntos de acento), no el archivo vectorial original — Dirección debe aportar
el SVG/PNG real para reproducción exacta de marca.

## Cómo probar en local

```bash
cd automation/content-factory/video-engine
npm install
npm run studio                 # abre Remotion Studio (preview interactivo)
npx remotion render src/index.ts test-edu-001 out/prueba.mp4 --codec=h264
node scripts/qa-check.mjs out/prueba.mp4
```

## Qué falta para producción real (ver `CONTINUATION-STATE.md` sección I para el detalle)

1. Las credenciales `Gemini - DCode Content Factory` y `GitHub - DCode
   Content Factory` **ya existen** en n8n (verificado 19/08/2026), pero
   ninguna ejecución real ha confirmado todavía que estén correctamente
   vinculadas y sean funcionales end-to-end (permisos del PAT, forma exacta
   de la respuesta de Gemini, límites de la API). Solo una ejecución
   supervisada real lo confirma — ver punto 2.
2. **Primera ejecución real supervisada** (decisión pendiente de Dirección,
   `CONTINUATION-STATE.md` I.1): ejecutar manualmente (sin activar el
   schedule) el Gate + un workflow de producción con una idea de prueba,
   revisar la fila resultante en `CF_Videos`/`CF_Posts`/`CF_EditorialMemory`,
   antes de considerar activar los schedules o probar el workflow de
   investigación completo (que envía un email real).
3. Activar (`publish_workflow`) los 4 workflows de n8n cuando Dirección lo
   autorice explícitamente — hoy los 4 siguen `active: false`.
4. Construir el publicador real (LinkedIn API / Instagram Graph API) — no
   incluido: requiere credenciales OAuth que no existen hoy en la cuenta.
   Sin autopublicación bajo ningún concepto sin autorización expresa.
5. Aportar el logo vectorial real de D-Code Partners.
6. Decidir si un `DUPLICADO_PROBABLE` detectado después de producir debe
   bloquear/regenerar automáticamente la pieza, o seguir solo registrándose
   como hoy (`CONTINUATION-STATE.md` I.2).
