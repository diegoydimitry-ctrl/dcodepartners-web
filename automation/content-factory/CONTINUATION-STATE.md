# CONTINUATION-STATE — D-Code Content Factory

> Checkpoint técnico de DCP-CONTENT-FACTORY-003. Cuando Dirección escriba
> "CONTINÚA": lee este archivo entero, comprueba `git status` / `git log` /
> la rama actual, y confirma el estado real de los 4 workflows de n8n
> (deben seguir `active: false`) antes de asumir que algo sigue como aquí se
> describe. No repitas trabajo ya hecho.

## A. Estado actual

**COMPLETADO** — las 15 prioridades de la orden de trabajo de esta noche
(DCP-CONTENT-FACTORY-003, sección 10) están hechas y verificadas. No hay
trabajo a medias ni módulos en un estado inconsistente. El sistema queda
donde estaba (D-Code Daily Content Engine V2) más:

- sin voz/TTS en el pipeline automático,
- con un Diversity Score compuesto real (5 dimensiones, no solo tema),
- integrado en los 3 workflows de n8n relevantes (Gate + 2 de producción),
- con 32 pruebas automáticas en verde,
- con 2 bugs reales encontrados y corregidos (ver sección H).

Los 4 workflows de n8n siguen **inactivos** (`active: false`), verificado
explícitamente con `get_workflow_details` justo antes de escribir este
checkpoint — no solo asumido.

## B. Qué estaba intentando hacer

Ejecutar, en orden, la lista de 15 prioridades de DCP-CONTENT-FACTORY-003
sección 10: quitar la voz del pipeline automático, implementar un Diversity
Score compuesto real (estructura/audio/CTA/formato, no solo similitud de
tema), integrarlo en el Memory + Diversity Gate y en los workflows de
producción, distinguir duplicado real de adaptación multiplataforma, cubrir
todo con pruebas automáticas, regenerar el lote de prueba y volver a pasar
QA.

## C. Qué se ha terminado

1. **TTS eliminado del pipeline automático** (prioridad 1-2):
   - `src/schema/storyboard.ts`: `audio.voice` ya no existe en el schema.
   - `src/templates/BrandVideo.tsx`: ya no renderiza `<Audio>` de voz.
   - `scripts/generate-tts.sh`: borrado (obsoleto).
   - `.github/workflows/render-video.yml`: quitados los pasos de
     `espeak-ng` (instalación + generación).
   - n8n `ARLDFrmHWdpQsNTb` (CF/Concept→Script→Storyboard→Render): el
     prompt de Gemini ya no pide `useVoice`/`voiceText`; `Construir
     Storyboard + IDs` ya no construye `audio.voice`.
   - `test-opinion-003` reescrito sin voz (familia `opinion`, `bedVolume`
     subido de 0.16 a 0.32 ya que no hay que dejar hueco a una locución) y
     **re-renderizado** (`out/test-opinion-003.mp4`, 2.2 MB) — Audio QA
     PASA (sin clipping -8.3 dB, no silencioso -25.9 dB, 1 solo stream de
     audio confirmado con `ffprobe`).

2. **Diversity Score compuesto** (prioridad 3, 5-9):
   - Nuevo `src/diversity/score.ts` — fuente única de verdad. 5
     dimensiones ponderadas (tema 0.45, estructura 0.20, audio 0.15, CTA
     0.10, formato 0.10), regla de "estructura clonada" (≥0.9 de
     similitud de esqueleto de escenas fuerza como mínimo
     `REPETICION_PARCIAL` aunque el resto del score sea bajo — evita que
     el peso del tema diluya un clonado evidente de plantilla), y
     detección explícita de `ADAPTACION_MULTIPLATAFORMA` (mismo `ideaId`)
     frente a `DUPLICADO_PROBABLE`/`REPETICION_PARCIAL`/`DIVERSO`.
   - 4 clasificaciones cubiertas con pruebas reales, no solo con el happy
     path.

3. **Integrado en los 3 workflows de n8n** (prioridad 4):
   - `H5b13tf9PIrlK4fQ` (CF/Memory + Diversity Gate): el nodo `Calcular
     Similitud y Decidir Formato` ahora calcula el Diversity Score
     compuesto (a esta altura del pipeline solo la dimensión "tema" tiene
     datos reales del candidato — ver limitación en sección K) y lo
     guarda en `CF_Ideas.diversityScore` / `diversityClasificacion`. Un
     `DUPLICADO_PROBABLE` por score compuesto fuerza `NO_PUBLICAR` igual
     que la similitud de tema aislada ya hacía.
   - `ARLDFrmHWdpQsNTb` (vídeo): nuevo par de nodos `Leer Memoria para
     Diversity Check` → `Calcular Diversity Score de la Pieza`, insertado
     DESPUÉS de construir el storyboard real — aquí sí hay estructura de
     escenas, familia de audio y CTA reales que comparar. El resultado se
     guarda en la fila de `CF_EditorialMemory` de esa pieza.
   - `t96QwFyZj1Tw6ubc` (posts): mismo patrón, `Leer Memoria para
     Diversity Check (Posts)` → `Calcular Diversity Score del Post`
     (versión sin dimensión de audio, con `tipoPost` como proxy de
     estructura).
   - Columnas nuevas: `CF_Ideas.diversityScore` (number),
     `CF_Ideas.diversityClasificacion` (string),
     `CF_EditorialMemory.ideaId` (string, necesaria para distinguir
     adaptación de duplicado — antes no existía, así que esa distinción
     era imposible de verificar contra memoria real),
     `CF_EditorialMemory.diversityClasificacion` (string — `diversityScore`
     ya existía de la sesión anterior pero nunca se rellenaba).

4. **32 pruebas automáticas** (`node --test`, prioridad 10) +
   `npm run typecheck` (`tsc --noEmit`), ambos en verde:
   - `tests/diversity-score.test.ts` — cosine similarity, adaptación vs
     duplicado, los 4 casos de clasificación.
   - `tests/schemas.test.ts` — Storyboard/Post Zod schemas sobre el lote
     de prueba real + regresión explícita "ningún storyboard lleva voz".
   - `tests/variety-batch.test.ts` — el Diversity Score aplicado a las 5
     piezas reales del lote de prueba (incluye el hallazgo ya conocido de
     que test-edu-001 y test-pain-002-li comparten esqueleto de escenas).
   - `package.json`: arreglado el script `render` (apuntaba a
     `scripts/render.mjs`, que nunca existió — deuda técnica real
     encontrada y corregida), añadidos `typecheck` y `test`, `tsx` añadido
     como devDependency real (antes solo se resolvía por `npx` al vuelo).

5. **Lote de prueba regenerado + QA** (prioridad 11-12, 14): los 5 vídeos
   (`out/*.mp4`) pasan Audio QA 5/5. Los 6 posts y los 5 storyboards
   validan contra sus schemas Zod (parte de la suite de tests, no un
   chequeo manual aparte).

## D. Qué tests han pasado

```
$ npm run typecheck   -> OK, sin errores
$ npm test             -> 32/32 tests, 10/10 suites, 0 fail
$ node scripts/audio-qa.mjs out/*.mp4   -> 5/5 PASA
```

Detalle del último `npm test` (resumen): schemas.test.ts (13 casos),
diversity-score.test.ts (14 casos), variety-batch.test.ts (5 casos, incluye
el chequeo de estructura clonada sobre datos reales del lote).

## E. Qué tests faltan

- **No hay ejecución en vivo de ningún workflow de n8n** todavía. Toda la
  lógica del Gate/producción está probada con datos sintéticos (tests) y
  con el lote de prueba renderizado localmente — no con una corrida real
  del pipeline n8n → Gemini → GitHub Actions de punta a punta. Ver sección
  I (decisión pendiente).
- No hay prueba automatizada de "duplicado real detectado y bloqueado en
  vivo" contra la tabla `CF_EditorialMemory` real de n8n (solo contra
  datos sintéticos locales) — porque esa tabla hoy no tiene filas reales
  (ningún workflow se ha ejecutado nunca en producción).
- Sigue sin existir una forma de verificar "el audio se escucha bien" por
  escucha real (limitación ya documentada en `DCP-CONTENT-FACTORY-V2`, sin
  cambios esta noche).
- No se ha vuelto a probar el mecanismo de "reforzar detección de
  repetición" (`embeddingJson` ahora sí llega a `CF_EditorialMemory`) con
  una llamada real a la API de embeddings — solo con la lógica portada y
  sus pruebas unitarias.

## F. Qué archivos se han modificado

Commit `f573e23` (ver `git show f573e23 --stat` para la lista exacta):

- `.github/workflows/render-video.yml` (quitados pasos de TTS)
- `automation/content-factory/DAILY-PLANNER.md` (nota sobre sin voz)
- `automation/content-factory/video-engine/package.json` /
  `package-lock.json` (scripts arreglados, `tsx` como devDependency real)
- `automation/content-factory/video-engine/tsconfig.json` (incluye
  `tests/**/*`)
- `automation/content-factory/video-engine/scripts/generate-tts.sh`
  (borrado)
- `automation/content-factory/video-engine/src/schema/storyboard.ts`
  (quita `audio.voice`)
- `automation/content-factory/video-engine/src/templates/BrandVideo.tsx`
  (quita el `<Audio>` de voz)
- `automation/content-factory/video-engine/src/storyboards/testBatch.ts`
  (test-opinion-003 sin voz, `voice: null` quitado de los otros 3)
- `automation/content-factory/video-engine/src/diversity/score.ts`
  (nuevo)
- `automation/content-factory/video-engine/tests/*.test.ts` (nuevos, 3
  archivos)

No versionado en git (por diseño, igual que el resto del proyecto):
`out/*.mp4` renderizados localmente (se envían directo al usuario, ver
`QA_CHECKLIST.md` para el porqué).

## G. Qué workflows se han modificado

Todos siguen `active: false` (verificado explícitamente antes de este
checkpoint):

| Workflow | ID | Cambio esta noche |
|---|---|---|
| CF/Investigación + Ideación + Scoring Editorial | `Sip8U9IyPpQ8j6NA` | Ninguno (sin cambios esta sesión) |
| CF/Memory + Diversity Gate | `H5b13tf9PIrlK4fQ` | Diversity Score compuesto integrado en `Calcular Similitud y Decidir Formato`; nuevas columnas escritas en `CF_Ideas` |
| CF/Concept → Script → Storyboard → Render | `ARLDFrmHWdpQsNTb` | Sin voz en el prompt/storyboard; nuevo chequeo `Leer Memoria para Diversity Check` → `Calcular Diversity Score de la Pieza`; `Registrar en CF_EditorialMemory` ahora también escribe `ideaId`/`embeddingJson`/`diversityScore`/`diversityClasificacion` |
| CF/Producción de Posts (LinkedIn + Instagram) | `t96QwFyZj1Tw6ubc` | Mismo patrón que el de vídeo; además se corrigió que `Registrar Post en CF_EditorialMemory` usaba `$json` tras un nodo HTTP (roto en la rama con slides) — ahora usa referencias explícitas por nombre de nodo |

Columnas nuevas en tablas de datos de n8n (proyecto `bMGsonawUS50GlAR`):
`CF_Ideas.diversityScore` (number), `CF_Ideas.diversityClasificacion`
(string), `CF_EditorialMemory.ideaId` (string),
`CF_EditorialMemory.diversityClasificacion` (string).

## H. Qué queda pendiente

- Ejecutar el sistema en vivo por primera vez, supervisado (ver sección
  I) — no se ha hecho esta noche por decisión deliberada, no por falta de
  tiempo.
- El Gate (idea-level) solo puede evaluar la dimensión "tema" del
  Diversity Score con datos reales (estructura/audio/CTA del guion no
  existen todavía en ese punto del pipeline) — está documentado como
  comportamiento honesto, no un bug, pero si en el futuro se quiere que el
  Gate anticipe mejor la repetición estructural antes de gastar una
  llamada a Gemini para el guion, haría falta un rediseño mayor (ver
  sección I).
- `diversityScore`/`diversityClasificacion` en producción hoy solo
  **registran** la señal — no bloquean ni regeneran automáticamente una
  pieza que salga `DUPLICADO_PROBABLE` después de escrito el guion/post.
  Eso sería un bucle de reintento, deliberadamente fuera de alcance esta
  noche (ver sección I).
- README.md de `automation/content-factory/` no se ha actualizado con el
  detalle de esta sesión (solo `DAILY-PLANNER.md` recibió una nota).

## I. Qué decisión técnica está pendiente

**Dos preguntas para Dirección, no decisiones que un agente deba tomar
solo:**

1. **¿Autorizo una primera ejecución real supervisada de al menos un
   workflow?** El mensaje de esta noche indica que Gemini y el PAT de
   GitHub ya están configurados, pero yo no los he verificado ni he
   ejecutado nada en vivo — las instrucciones de seguridad de esta noche
   prohíben explícitamente activar workflows/schedules y enviar mensajes,
   y el workflow de investigación manda un email real a Dirección como
   parte de su flujo normal. Antes de una corrida real recomiendo:
   ejecutar manualmente (sin activar el schedule) el Gate + un workflow
   de producción con una idea de prueba, revisar la fila resultante en
   `CF_Videos`/`CF_Posts`/`CF_EditorialMemory`, y solo después considerar
   probar el workflow de investigación completo (que sí envía email).
2. **¿Se quiere que un `DUPLICADO_PROBABLE` post-producción bloquee o
   regenere automáticamente la pieza?** Hoy solo se registra. Añadir un
   bucle de reintento (pedir a Gemini un guion distinto si el primero sale
   duplicado) es una extensión razonable pero no trivial — implica
   controlar cuántos reintentos, qué pasa si todos fallan, y cómo se
   informa a Dirección. No implementado esta noche por alcance.

## J. Próximo paso exacto

Si Dirección escribe "CONTINÚA" sin más contexto, el siguiente paso técnico
razonable (no ejecutar sin más instrucción, solo el candidato más obvio) es
**actualizar `automation/content-factory/README.md`** con el resumen de lo
hecho en DCP-CONTENT-FACTORY-003 (hoy el README solo refleja V1/V2), y
después preguntar explícitamente por la decisión I.1 (primera ejecución
real supervisada) antes de tocar nada en producción.

## K. Riesgos

- El Gate no puede prevenir hoy una repetición estructural/de audio/de CTA
  *antes* de gastar una llamada a Gemini para escribir el guion completo —
  esa señal solo llega DESPUÉS de producir. En el peor caso esto significa
  gastar una llamada a Gemini en una pieza que luego se marca
  `DUPLICADO_PROBABLE` y queda registrada pero sin bloquear el render. El
  coste es marginal (una llamada de texto a Gemini) pero es un riesgo real
  a vigilar si el volumen de producción crece.
- Nunca se ha ejecutado ninguno de los 4 workflows contra la cuenta real de
  n8n desde que se escribieron — toda la verificación es local (tests +
  render local). La primera ejecución real es, por definición, la primera
  vez que se sabrá si algo falla que las pruebas locales no pudieron
  simular (p. ej. límites de la API de Gemini, forma exacta de la
  respuesta HTTP, permisos de la credencial GitHub PAT).
- Los feeds RSS nuevos (MIT Sloan, Hacker News vía `hnrss.org`) siguen sin
  verificarse en vivo desde ninguna sesión (bloqueo de red saliente de este
  entorno) — heredado de `DCP-CONTENT-FACTORY-V2`, sin cambios.

## L. Último comando ejecutado

```
npm run typecheck && npm test
```
(en `automation/content-factory/video-engine/`, justo antes de escribir
este checkpoint)

## M. Resultado del último test

```
# tests 32
# suites 10
# pass 32
# fail 0
# cancelled 0
# skipped 0
# todo 0
```
`npm run typecheck` sin salida (sin errores).

## N. Commit actual

`f573e23` — "DCP-CONTENT-FACTORY-003: eliminar TTS del pipeline automático
+ Diversity Score compuesto" — pusheado a `origin`. Working tree limpio
(`git status` sin cambios pendientes) en el momento de escribir este
checkpoint.

## O. Rama actual

`claude/dcode-partners-changes-governance-tvyk6k` (la única rama de trabajo
para el Content Factory — no se ha tocado `main`, no se ha hecho merge).
