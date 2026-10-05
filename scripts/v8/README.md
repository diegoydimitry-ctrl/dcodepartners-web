# Portada «el conjunto» (v8)

La portada son cinco escenas fotografiadas que se recorren con el scroll. Cada
una explica una sola cosa y lleva escrito encima, en HTML, qué es cada objeto.

| Acto | Escena | Qué explica |
| --- | --- | --- |
| 0 · Inicio | A · cuatro placas que se alinean y dejan pasar la luz | Personas, procesos, datos y herramientas, alineados |
| 1 · Hoy | B · cuatro cabos sueltos | Hoy cada parte va por su lado |
| 2 · El sistema | B · los cuatro cabos trenzados en un cable | Las unimos en un solo sistema |
| 3 · La automatización | C · una fila de piezas que cae sola | Cada paso empuja al siguiente |
| 4 · La inteligencia | D · un líquido sin forma que toma una forma exacta | La IA lee lo desordenado y devuelve datos exactos |
| 5 · D-Code Finance | E · una llave y una cerradura de cuatro pasadores | Los cuatro datos de la factura encajan y queda registrada |
| 6–7 · El resultado y las demos | A · la luz pasando por las cuatro placas | El trabajo pasa sin detenerse |
| 8 · El tuyo | A · la primera placa, de cerca | El nombre de quien visita, grabado |

## Cómo se hace

1. Desde la carpeta donde se quieran los PNG,
   `python3 <repo>/scripts/v8/escenas.py --lote <repo>/scripts/v8/lote.json`
   (se salta los que ya existen, así que se puede interrumpir y seguir) pinta las imágenes con
   Blender (Cycles, como módulo de Python: `pip install bpy==4.2.0`). Todo el
   modelado es por código (`comun.py` y `escenas.py`); no hay ficheros `.blend`.
   Cada tarea del lote es `{"e": "A…E", "p": {parámetros}, "f": "nombre.png",
   "res": [1920, 1080], "spp": 64}`. `--anclas anclas.json` exporta dónde cae en
   cada fotografía cada cosa que lleva nombre. La carpeta necesita también una
   copia de `plan.json` (cuántos fotogramas tiene cada tramo). En una máquina
   de dos núcleos el lote completo son unas dos horas.
2. `python3 scripts/v8/imagenes.py <carpeta>` pasa los PNG a WebP en
   `assets/v2/img/escena/` y escribe `scripts/v8/datos.json` (los tramos, las
   anclas, el tono de fondo de cada fotografía y el encuadre del teléfono).
3. `node scripts/v8/construir.mjs` mete esos datos en `assets/v2/js/portada.js`,
   genera el `<main>` de `index.html` y `en/index.html` (`portada.mjs`), pone a
   cada recurso su `?v=` por contenido y vuelve a aplicar el SEO y el sitemap.
4. `npm run check:portada` comprueba que las dos portadas llevan lo mismo y que
   todas las imágenes que la página va a pedir existen.

## Nombres de las imágenes

- `h-N.webp` — la fotografía del acto N (1920 × 1080). `e-fin.webp`, la
  cerradura ya girada.
- `t-N-KK.webp` — el fotograma KK del paso del acto N al N+1 (960 × 540).
  `t--1-KK` es la entrada: las placas alineándose.
- `e-KK.webp` — la llave entrando en la cerradura; no va con el scroll, se
  reproduce al pulsar «Pasar la factura por Finance».

Los textos están en `portada.mjs` (español e inglés). Los datos de la factura
de ejemplo son inventados y la página lo dice.
