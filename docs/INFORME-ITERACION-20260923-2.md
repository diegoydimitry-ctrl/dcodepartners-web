# Iteración 23/09/2026 (segunda) — transición entre secciones, lectura y precios

Rama `diseno/dcode-design-system`. `main` sigue en `9994abe`; Production no se
toca. Preview: https://dcodepartners-egzziwbqq-d-code-partners.vercel.app
(commit `d2be9bd`).

## 1. Cambiar de sección se ve

Pulsar «Método» —o cualquier botón que lleve a otra página— ya no corta en
seco: la página que se va se rompe en piezas y es aspirada hacia la
izquierda, y la que llega entra desde la derecha detrás de la costura de luz.
Es la misma coreografía que la inversión de tema, con los mismos tiempos y la
misma curva, para que el gesto se reconozca.

Cómo está hecho:

- `@view-transition { navigation: auto }` ya estaba: lo que cambia es la
  coreografía (bloque `html.nav-vt` en `assets/css/tema.css`).
- `pageswap` nombra las piezas visibles del documento que se va y guarda sus
  rectángulos; `pagereveal` nombra las del que llega y anima las dos tandas.
  Los prefijos son distintos (`tv-o-*` y `tv-n-*`) para que el navegador no
  empareje una pieza de una página con otra de la siguiente.
- El aviso lo recoge el script del `<head>`: `pagereveal` se dispara antes de
  que corran los scripts con `defer`, así que `tema.js` llegaba tarde.
- Sin piezas en móvil, táctil y movimiento reducido: ahí queda el barrido de
  la página entera, que es una sola capa en la GPU.
- Red de seguridad a 1,2 s: con las piezas animadas a mano, `finished` puede
  quedarse pendiente y la clase `nav-vt` se quedaba puesta. Medido.

| Escenario | Con efecto | Sin efecto |
|---|---|---|
| Escritorio, CPU x1 | 1,21 s | 1,00 s |
| iPad, CPU x4 | 1,18 s | 1,16 s |
| Móvil, CPU x6 | 0,92 s | 0,93 s |

## 2. Tres fallos de lectura, medidos en píxeles

El auditor que deduce el contraste del CSS no veía ninguno de los tres: dos
estaban tapados por velos con `pointer-events:none` y el tercero por un
filtro. El procedimiento nuevo está en `docs/QA-WEB.md`.

1. **El titular de «Qué hacemos».** El velo de `.arq-lienzo` sangraba un 10 %
   de su altura (59 px con el esquema alto) y se pintaba encima de la última
   línea: se veía gris a media altura. El sangrado se mide ahora con tope en
   píxeles.
2. **Los formularios en claro.** `.field` es el campo de partículas y también
   el campo de un formulario: la regla que invierte el campo en claro apagaba
   todos los formularios de la web. Las etiquetas daban **1,8:1** medido;
   ahora **7,3:1**. `check:tema` falla si vuelve una regla sobre `.field` a
   secas (probado: con la regla mala, falla).
3. **El eje de Conócenos.** Su tono viaja como tripleta suelta
   (`--tono:46,216,240`), que el derivado del tema claro no sabe leer: cian
   sobre blanco a 1,4:1. En claro van los dos tonos hondos del tema.

Además, `--stone-soft` sube un escalón (#8c95aa → #a6afc4) y las
micro-etiquetas pasan de 11 px a 12 px.

## 3. La demo de Finance: subir fotos y archivos

El botón de adjuntar no tenía área propia en la rejilla de la pantalla: a
partir de 1.200 px se estiraba hasta ser un rectángulo punteado vacío y el
cajón se iba encima de la columna de atajos. Ahora es una tarjeta con su
sitio, dice qué admite (foto del móvil, PDF, Excel o CSV, hasta 10 MB) y
explica lo que hace con cada cosa: del PDF digital saca los datos; de una
foto o un escaneado guarda el documento y lo deja listo para rellenar. Es lo
que hace el sistema real (`/documentos` acepta PDF, PNG, JPEG, WEBP y TIFF
hasta 10 MB; el PDF digital se lee campo a campo y el escaneado se guarda),
comprobado en su repositorio.

## 4. Precios

Referencia de mercado (septiembre de 2026): Holded 15/29/59/99/199 €/mes,
Quipu 17/30/59 €/mes. La entrada se queda en el mismo escalón.

| Plan | Puesta en marcha | Al mes | Personas |
|---|---|---|---|
| Finance | 390 € | 29 € | hasta 3 |
| Finance con inteligencia | 690 € | 79 € | hasta 10 |
| Finance a medida | desde 1.500 € | desde 190 € | sin límite |

Primer año: de 738 € a 3.780 €, y eso es lo que dice la comparativa de
mercado. En la portada y en Servicios, «Desde 29 €/mes más 390 € de puesta en
marcha», «Desde 1.500 €» y «Desde 750 €», escritos desde `precios.json` por
`build:precios`. Un solo precio en toda la web: `check:precios` lo vigila.

## 5. Datos legales

Fuera los marcadores «dato pendiente» de Aviso Legal, Privacidad, Condiciones
de Contratación y Acuerdo de Encargado de Tratamiento, en ES y EN. Queda lo
que existe: marca, responsables, ámbito (Madrid, España) y contacto. El fuero
es Madrid capital.

## 6. Menos texto

- La portada pierde los cuatro pasos delante de cada demo: quedan dos líneas
  (hoy y con el sistema).
- Las nueve etapas del esquema bajan a una línea cada una.
- Párrafos recortados en portada, sistema financiero, servicios, conócenos y
  finanzas. La portada baja de 3.207 a ~2.800 palabras.

## 7. Comprobaciones

- axe-core WCAG 2.2 AA: 70 páginas × 2 temas → **0**.
- `qa:solapes`: 70 páginas × 5 anchos = 350 cargas → **0**.
- `qa:demo`: 25 pantallas en ES y EN a 1440/1024/390/320 → sin incidencias.
- `check:estado`, `check:precios`, `check:og`, `check:enlaces`, `check:kb`,
  `check:consentimiento`, `check:demo`, `check:tema`, `check:superficie`: en
  verde.
- Detector de velos sobre texto: 10 páginas × (claro y oscuro) × 1440 y 390 →
  0 casos tras los arreglos.
- Preview desplegado comprobado por HTTP: precios, planes, legales sin
  marcadores y el script de `pagereveal` en el `<head>`.
