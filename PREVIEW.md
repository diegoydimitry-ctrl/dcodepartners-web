# Preview local: D-Code Partners, remodelación completa (rev. 3)

Rama `claude/dcode-full-redesign`. Parte de `e99d61f`, que es lo que sirve producción. La explicación completa está en `REDESIGN_FULL.md`.

```bash
git fetch origin claude/dcode-full-redesign
git checkout claude/dcode-full-redesign
npm install          # solo para las herramientas de pruebas
npx serve .          # abre http://localhost:3000 (con URLs limpias)
```

Con Python (`python3 -m http.server 8080`) las URLs llevan `.html`.

## Qué mirar

- **`/` y `/en`, el héroe (estudio):**
  - Pulsa un módulo (Finance, D-Code OS, IA, Automatizaciones, Integraciones o Web) o un área: la cámara va a esa pieza y la ficha dice qué es.
  - Arrastra para girar la pieza; los mandos de la derecha giran, acercan y centran.
- **«Qué hacemos»:** baja despacio. La pieza se queda fija y cambia con cada uno de los nueve pasos.
- **Interiores:** la misma pieza, enfocada en lo que trata la página.
- **`/precios`:**
  - «Qué es cada cosa» (Finance, D-Code OS y los servicios).
  - Packs con lo que llevan.
- **Contraste:**
  - En oscuro, las cajas y las demos son blancas.
  - En claro, oscuras.

## Añadir o retocar una escena

1. La escena es una sola: `assets/js/escenas/e-sistema.js`. Sus modos son `estudio`, `pasos`, `metodo`, `casos`, `todo` y los focos (`finance`, `os`, `ia`, `auto`, `integ`, `web`, `nucleo`, `panel`, las 6 áreas y `produccion`, `soporte` y `direccion`).
2. En el HTML: `<div class="esc esc-hero" data-escena="sistema" data-modo="…" aria-hidden="true"></div>`.
3. Míralo aislado en `scripts/escenas/estudio.html?e=sistema&modo=…&paso=…&foco=…&tema=claro` (solo en local; no se despliega).
4. Regenera sus pósteres: el mismo estudio con `&tr=1&calidad=alta`, captura con fondo transparente (680×860 los interiores) y conversión a WebP en `assets/img/escenas/poster/sistema-<modo>-<oscuro|claro>.webp`.

## Antes de commitear

```bash
npm run update-asset-versions
npm run check:tema && npm run check:portada && npm run check:enlaces && npm run check:superficie
npm run check:kb    # si cambia el texto de una página: npm run generate-kb
```

Esta rama no hace merge ni deploy a producción.

## Medidas

Chromium headless sin GPU (SwiftShader), servidor local sin gzip, portada. Las cifras de carga son fiables; el primer fotograma y los FPS son varias veces peores que en un equipo con GPU.

| | Rama 1440 | Rama 390 | Producción `e99d61f` 1440 |
|---|---|---|---|
| FCP | 1,08–1,20 s | 0,66 s | 2,06 s |
| LCP | 1,1–1,6 s (póster del héroe) | 0,66 s (texto) | 2,62 s |
| CLS | 0,002 | 0,006 | 0 |
| Escenas vivas al entrar | 1 | 1 | — |
| Llamadas de dibujo / triángulos (calidad baja) | 100 / 43 k | 100 / 43 k | — |

**Pesos (gzip):**
- Three.js r180: 179 KB, pedido en idle, después del primer pintado.
- Motor: 7,8 KB.
- Escena única: unos 7 KB.
- Pósteres: 38 en WebP con alfa, 684 KB en total y unos 18 KB de media; cada página pide el suyo.

**QA:**
- **Barrido:** 179 combinaciones, sin ningún error JS, desborde horizontal ni imagen rota.
  - 74 páginas a 1440 y 390 px.
  - Las dos portadas a 375, 430, 768, 1024 y 1920 px.
  - 6 páginas en claro.
  - 3 páginas con movimiento reducido y sin WebGL.
- **Avisos:** solo las URLs limpias de la demo de Finance (`/sistema-financiero/app`), que el servidor local no resuelve y Vercel sí.
- **Pruebas de producción en verde:** `check:tema`, `check:portada`, `check:enlaces`, `check:superficie`, `check:consentimiento`, `check:chat`, `check:estado`, `check-instruments`, `check:kb`, `check:precios`, `check:og`, `check:que-hacemos` y `check:en-curso`.
- **Sin comprobar aquí:** `check:webs`, `check:fichas` y `check:capturas` necesitan `sharp`, que no está instalado en este entorno.
