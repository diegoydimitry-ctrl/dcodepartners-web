# QA Engine — D-Code Content Factory

Ningún vídeo pasa a `READY` sin pasar por los tres niveles. Si falla alguno:
**corregir, no publicar.** "1 vídeo excelente antes que 5 mediocres."

## Nivel 1 — Automático (`scripts/qa-check.mjs`)

Ejecutar: `node scripts/qa-check.mjs out/mi-video.mp4`

Comprueba mecánicamente lo verificable sin criterio humano:
duración (6-60s), resolución de marca válida, dimensiones pares (requisito
de códec), códec h264, tamaño de archivo razonable. Corre automáticamente en
el pipeline de GitHub Actions antes de publicar la Release.

## Nivel 2 — Content Review (humano o agente revisor independiente)

Las 20 preguntas del encargo original, agrupadas:

**Guion y hook**
1. ¿El hook funciona en el primer segundo?
2. ¿Hay errores ortográficos?
3. ¿Hay errores gramaticales?
4. ¿Existe un cierre claro?
5. ¿La CTA es adecuada y no suena forzada?

**Ritmo y lectura**
6. ¿El texto se corta o queda ilegible en algún fotograma?
7. ¿Hay demasiado texto para el tiempo que está en pantalla?
8. ¿La velocidad de lectura es razonable (ni muy rápida ni muy lenta)?
9. ¿El ritmo general se sostiene, o hay tramos muertos?

**Veracidad (Brand Safety — bloqueante, no solo "nota")**
10. ¿Se han inventado datos, cifras o resultados de negocio?
11. ¿Se han inventado logos?
12. ¿Se han inventado clientes o testimonios presentados como reales?
13. Si hay un ejemplo, ¿está identificado explícitamente como ejemplo?

Si falla 10-13: **no es una revisión de estilo, es un bloqueo automático de
publicación**, sin excepción.

## Nivel 3 — Visual Review (humano o agente revisor independiente)

14. ¿Las transiciones entre escenas tienen sentido narrativo?
15. ¿Cada escena aporta algo, o hay relleno?
16. ¿Hay elementos fuera de la zona segura (safe area) de la red destino?
    — Instagram Reels reserva ~12% superior y ~20% inferior para su propia UI.
17. ¿Los colores coinciden con la identidad D-Code (`src/brand/tokens.ts`)?
18. ¿Hay consistencia tipográfica (Archivo para titulares, Inter para UI)?
19. ¿El vídeo parece profesional, o se nota "plantilla"/"AI slop"?
20. ¿Hay algún elemento visual absurdo o que rompa la inmersión?

## Final Gate

```
Nivel 1 (automático) PASA
        Y
Nivel 2 (Content Review) APROBADO
        Y
Nivel 3 (Visual Review) APROBADO
        ↓
   estado = READY
```

Si cualquiera falla → `REVISION`, se corrige el storyboard/guion y se
vuelve a renderizar. Nunca se marca `READY` con un nivel pendiente.

## Registro

Cada vídeo en `CF_Videos` (n8n Data Table) guarda:
- `qaAutomaticoJson` — salida de `qa-check.mjs`.
- `qaContentReviewJson` — quién revisó, resultado, notas.
- `qaVisualReviewJson` — ídem.

Ver `automation/content-factory/README.md` para cómo se conecta esto con el
resto del pipeline.

## Precedente real (por qué este gate existe)

Durante la construcción de este sistema, la primera versión del logo (`Logo.tsx`)
pasó el nivel automático pero fallaba visualmente: el trazo del icono "D" se
renderizaba como una columna de puntos ilegible por un error de espaciado en
la rejilla SVG. Se detectó en la revisión visual antes de aprobar el primer
vídeo, se corrigió, y se volvió a renderizar. Es exactamente el caso que este
checklist existe para atrapar — un fallo real, no un ejemplo hipotético.
