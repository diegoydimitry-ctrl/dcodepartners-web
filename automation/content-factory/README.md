# D-Code Content Factory

Sistema de creación de contenido audiovisual para D-Code Partners. Construido
por el rol "Cambios D-Code Partners" bajo autorización explícita de Dirección
(DCP-CONTENT-FACTORY-001, 2026-08-18). Ver el informe completo
`DCP-CONTENT-FACTORY-FINAL` para el estado detallado, limitaciones y
próximos pasos.

## Arquitectura (resumen)

```
n8n (orquestación + LLM)              GitHub Actions (render)         Distribución
───────────────────────              ────────────────────────         ────────────
CF/Investigación                      render-video.yml
  + Ideación + Scoring    ──┐         (Remotion + FFmpeg,
  (Gemini, diario 07:00)    │          sin API de vídeo de pago)
                            │                  │
CF/Concept → Script         │                  │
  → Storyboard → Render   ──┴─── repository_dispatch ──┐
  (Gemini, diario 08:00,                                │
   dispara el render)                                   ▼
                                              GitHub Release (mp4)
                                              URL pública (repo público)
                                                          │
                                                          ▼
                                         [PENDIENTE: publicador LinkedIn/
                                          Instagram — credenciales que
                                          debe aportar Dirección]
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
| Modelo de datos | n8n Data Tables (`CF_Ideas`, `CF_Scripts`, `CF_Videos`, `CF_Calendar`, `CF_Publications`, `CF_Analytics`, `CF_EditorialMemory`, `CF_Errors`) | Estado de todo el pipeline, memoria editorial anti-repetición |
| Content Engine (investigación + scoring) | n8n, workflow `CF/Investigación + Ideación + Scoring Editorial` | RSS + memoria editorial → Gemini genera y puntúa 6 ideas/día, guarda top 3 |
| Content Engine (guion + storyboard) | n8n, workflow `CF/Concept → Script → Storyboard → Render` | Convierte cada idea aprobada en guion + storyboard JSON, dispara el render |
| Video Engine | `video-engine/` (Remotion + React + TypeScript) | Renderiza el storyboard JSON como vídeo de marca (motion graphics) |
| Render pipeline | `.github/workflows/render-video.yml` | Ejecuta el Video Engine en CI, publica el mp4 como GitHub Release |
| QA Engine | `video-engine/scripts/qa-check.mjs` + `video-engine/QA_CHECKLIST.md` | Automático (duración/resolución/códec) + Content Review + Visual Review |

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

## Qué falta para producción real (ver informe final para el detalle)

1. Vincular manualmente la credencial `Header Auth account` (Gemini, ya
   existe) a los 2 nodos HTTP Request de los workflows n8n.
2. Crear el Personal Access Token de GitHub y añadirlo en n8n como credencial
   `GitHub PAT - Content Factory` (permiso `repo` sobre este repositorio).
3. Activar (`publish_workflow`) los 2 workflows de n8n cuando Dirección lo
   autorice.
4. Construir el publicador real (LinkedIn API / Instagram Graph API) — no
   incluido: requiere credenciales OAuth que no existen hoy en la cuenta.
5. Aportar el logo vectorial real de D-Code Partners.
