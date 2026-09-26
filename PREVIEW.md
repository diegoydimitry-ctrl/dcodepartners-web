# Preview local: D-Code Partners, remodelación completa (rev. 2)

Rama `claude/dcode-full-redesign`. Parte de `e99d61f`, que es lo que sirve producción. La explicación completa está en `REDESIGN_FULL.md`.

```bash
git fetch origin claude/dcode-full-redesign
git checkout claude/dcode-full-redesign
npm install          # solo para las herramientas de pruebas
npx serve .          # abre http://localhost:3000 (con URLs limpias)
```

Con Python (`python3 -m http.server 8080`) las URLs llevan `.html`.

## Qué mirar

- **`/` y `/en`:**
  - Héroe: el logotipo de D-Code se fabrica al llegar. Mueve el ratón para inclinarlo.
  - Al bajar, cada capítulo tiene su escena: el problema (datos), qué hacemos (integración), el laboratorio (pantallas reales), las ocho áreas, el método, los precios y el contacto.
- **Interiores:**
  - `/servicios/*`, `/departamentos/*` (8), `/que-hacemos`, `/sistema-financiero`, `/metodo`, `/casos-exito`, `/precios`, `/conocenos` y `/contacto` tienen la escena de su página en el héroe.
  - Garantías, FAQ, en curso, blog y legales no llevan escena, a propósito.
- **Tema:** el botón redondo de la navegación. Oscuro por defecto; el cambio relanza la luz de las escenas vivas.
- **Calidad:** `?calidad=alta|media|baja` fuerza un nivel del motor. `window.__motor.info` da el nivel, las escenas vivas, las llamadas de dibujo, los triángulos, el DPR y la mediana del fotograma.

## Añadir o retocar una escena

1. Crea o edita `assets/js/escenas/e-<nombre>.js`. Exporta `(K, o) => ({ scene, camera, update, luces })` y usa el kit `K` (materiales, geometrías, sombras, pulsos e iconos).
2. En el HTML: `<div class="esc esc-hero" data-escena="<nombre>" data-modo="…" aria-hidden="true"></div>`.
3. Míralo aislado en `scripts/escenas/estudio.html?e=<nombre>&modo=…&tema=claro` (solo en local; no se despliega).
4. Regenera sus pósteres: el mismo estudio con `&tr=1&calidad=alta`, captura con fondo transparente a 900×800 (héroe) o al ancho de su banda y conversión a WebP en `assets/img/escenas/poster/<clave>[-banda]-<oscuro|claro>.webp`.

## Antes de commitear

```bash
npm run update-asset-versions
npm run check:tema && npm run check:portada && npm run check:enlaces && npm run check:superficie
npm run check:kb    # si cambia el texto de una página: npm run generate-kb
```

Esta rama no hace merge ni deploy a producción.

## Medidas

Chromium headless sin GPU (SwiftShader), servidor local sin gzip. Las cifras de carga son fiables; el primer fotograma y los FPS son varias veces peores que en un equipo con GPU.

| | Portada 1440 | Portada 390 | /departamentos/finanzas 1440 | /servicios/paginas-web 390 |
|---|---|---|---|---|
| FCP | 728 ms | 476 ms | 808 ms | 628 ms |
| LCP | 984 ms (póster del héroe) | 620 ms | 1488 ms | 628 ms (texto) |
| CLS | 0,016 | 0,014 | 0,001 | 0,001 |
| Evento `load` | 823 ms | 504 ms | 874 ms | 657 ms |
| El motor empieza (idle) | 829 ms | 511 ms | 877 ms | 771 ms |
| Escenas vivas al cargar | 2 de 8 | 1 de 8 | 1 | 1 |
| Llamadas de dibujo / triángulos | 29 / 18 k (56 / 45 k en «Ocho áreas») | 29 / 18 k | 37 / 28 k | 21 / 9 k |

**Pesos (gzip):**
- Three.js r180 (core y módulo): 179 KB.
- Addons: 2 (RoundedBox y RoomEnvironment).
- Motor: 7,8 KB.
- `app.js`: 1,6 KB.
- Cada escena: 1,1–3,0 KB.
- Texturas: 58 KB.
- Pósteres: 56 en WebP con alfa, 1,1 MB en total y unos 20 KB de media. Cada página pide el de su héroe y, al acercarse, los de sus bandas.

**Frente a la preview anterior (Núcleo, `7e056a3`):**
- Fuera el HDRI (111 KB), el postprocesado (bloom y composer) y el EXRLoader.
- Al entrar solo se montan una o dos escenas (las que están en pantalla o cerca), no la pieza entera.
- La portada pasa de 118 llamadas y 106 k triángulos por fotograma a 29–56 llamadas y 18–45 k triángulos.
- El motor ya no bloquea: se importa en `requestIdleCallback` y cada escena se compila con `compileAsync` antes de entrar.

**QA:**
- **Barrido:** 179 combinaciones, sin ningún error JS, desborde horizontal ni imagen rota.
  - 74 páginas a 1440 y 390 px.
  - Las dos portadas a 375, 430, 768, 1024 y 1920 px.
  - 6 páginas en claro a 1440 y 390 px.
  - 3 páginas con movimiento reducido y sin WebGL.
- **Avisos:** solo las URLs limpias de la demo de Finance (`/sistema-financiero/app`), que el servidor local no resuelve y Vercel sí.
- **Pruebas de producción en verde:** `check:tema`, `check:portada`, `check:enlaces`, `check:superficie`, `check:consentimiento`, `check:chat`, `check:estado`, `check-instruments`, `check:kb`, `check:precios`, `check:og`, `check:que-hacemos` y `check:en-curso`.
- **Sin comprobar aquí:** `check:webs`, `check:fichas` y `check:capturas` necesitan `sharp`, que no está instalado en este entorno.
