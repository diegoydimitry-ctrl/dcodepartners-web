# Portada «el banco de trabajo» (v7)

La portada es una sola escena fotografiada que se recorre con el scroll. No hay 3D en tiempo real: las imágenes se pintan antes, con trazado de rayos, y la página las va enseñando.

## Qué cuenta

Un teléfono, una tableta con las tareas, un portátil y una factura llegan cada uno por su lado (personas, procesos, herramientas, datos) y encajan en una base azul, que es D-Code. Al encajar, la línea de la base se enciende y el dato de la factura pasa solo al portátil, a las tareas y al teléfono. Lo que se ve en las pantallas es un ejemplo con datos inventados, y la página lo dice.

| Acto | Qué se ve |
|---|---|
| 0 Inicio | Las cuatro cosas en el aire, sobre la base vacía |
| 1 Hoy | Cada una a lo suyo: mensajes sin responder, tareas sin asignar, la factura tecleándose a mano |
| 2 El sistema | Encajan una a una; se enciende la línea |
| 3 La automatización | Las tareas pasan a hechas y el teléfono avisa |
| 4 La inteligencia | Una línea azul lee la factura |
| 5 D-Code Finance | El portátil de frente; el registro es HTML de verdad puesto sobre su pantalla |
| 6 El resultado · 7 Demos | El conjunto terminado |
| 8 El tuyo | La placa de la base, con el nombre que escriba el visitante (HTML sobre la placa) |

## Piezas

- `texturas.py` — lo que enseñan las pantallas y la factura (PIL + Inter) → `tex/`.
- `escena.py` — la escena (Blender como módulo de Python, `bpy` 4.2, Cycles en CPU, OIDN, AgX): modelado, materiales, luces, las nueve cámaras de escritorio (`CAMARAS["h"]`, 16:9, con la escena a la derecha) y las nueve del móvil (`CAMARAS["v"]`, imagen cuadrada), y `poner(E, c)`, que coloca todo para el momento `c` (−1…8).
  - `python3 escena.py --c 2 --salida foto.png [--res 1600x900] [--spp 48] [--vertical]`
  - `python3 escena.py --lote lote.json` — una lista de `{c, f, res, spp, v}`; salta lo que ya existe, así que se puede relanzar.
  - `python3 escena.py --anclas anclas.json` — sin pintar: dónde caen en la imagen la pantalla del portátil, la placa y cada cosa.
- `imagenes.py <carpeta>` — pasa los PNG a WebP en `assets/v2/img/escena/` y escribe `datos.json`.
- `portada.mjs` — el `<main>` de `index.html` y `en/index.html` (textos en los dos idiomas).
- `construir.mjs` — mete `datos.json` y la versión de las imágenes en `assets/v2/js/portada.js`, genera las portadas, pone los `?v=` y repasa SEO y sitemap. **Es lo que hay que ejecutar tras cualquier cambio:** `node scripts/v7/construir.mjs`.

## Imágenes

- `h-<acto>.webp` (1600×900) y `v-<acto>.webp` (1080×1080): la fotografía de cada acto.
- `t-<acto>-<nn>.webp` (960×540) y `u-<acto>-<nn>.webp` (640×640): los fotogramas del viaje entre un acto y el siguiente. En el móvil solo hay viaje en la entrada y hasta que todo encaja; el resto son fundidos entre fotografías.

## En la página

`assets/v2/js/portada.js` dibuja en un lienzo 2D la fotografía que toca y funde con la siguiente; con movimiento reducido o ahorro de datos no pide los viajes; sin JavaScript, `assets/v2/escena.css` pone la fotografía de cada acto como fondo. Las páginas interiores abren con una de estas fotografías (`assets/v2/js/cabecera3d.js`).

## Límites conocidos

- Las pantallas y los rótulos grabados en la base están en español también en `/en`.
- Pintar todo de nuevo lleva alrededor de hora y media en dos núcleos.
