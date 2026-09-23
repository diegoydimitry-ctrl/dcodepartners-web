# Rendimiento por dispositivo

> Una sesión entera midiendo por qué la web iba mal en un iPad y bien en un PC,
> y qué se cambió. Todas las cifras de aquí están medidas; lo que no se ha
> podido medir, se dice.

## Cómo se mide

`scratchpad/perf/banco.mjs` carga una página con el perfil de un dispositivo
(tamaño, densidad de pantalla, freno de CPU), la recorre **como la recorre una
persona** —26 tirones de scroll con 140 ms entre ellos— o la deja **quieta**
cuatro segundos, y anota:

- el ritmo real de fotogramas (mediana, percentil 95, cuántos pasan de 50 ms);
- el trabajo del hilo principal por categoría, de la traza del navegador;
- **cuánto JavaScript gasta cada bucle de animación por separado** (se envuelve
  `requestAnimationFrame` y se mide cada callback);
- cuántas operaciones de lienzo se piden.

Perfiles: `pc` 1440×900 dpr 1 sin freno · `ipad` 1024×1366 dpr 2 CPU ×4 ·
`movil` 390×844 dpr 3 CPU ×6.

Aislar una capa se hace bloqueando su fichero (`--sin=dcp8`) o sirviéndolo
parcheado al vuelo (`--parche=dcp6§buscar§reemplazar`), que es la única forma
honesta de saber lo que cuesta: esconder un lienzo deja su bucle corriendo.

**Lo que este banco NO es:** un iPad de verdad. Es Chromium con la CPU frenada
en una máquina de dos núcleos; Safari compone distinto y la GPU de un iPad es
mucho mejor que la de este contenedor. Las cifras absolutas no son las del
aparato; las **relaciones** (qué capa cuesta y cuánto baja al quitarla) sí, y
son las que han guiado cada cambio.

## Lo que se encontró

Midiendo la portada en el perfil `ipad` y apagando capas una a una:

| Capa | Al quitarla, fotograma mediano |
|---|---|
| Campo de partículas de la portada (`dcp6`, 2.100 puntos, 8,3 ms de JS por fotograma) | 40 ms → **18 ms** |
| Cielo (`.gx`) | sin cambio apreciable |
| Orbes | sin cambio apreciable |

Y en una página interior (`/servicios`), leyendo quieto:

| Capa | Al quitarla |
|---|---|
| Instrumento de fondo (`dcp8`, ~5.000 operaciones de lienzo por dibujo, a pantalla completa) | 48 ms → **18 ms** |
| Composición de bloque (`dcp9`) | 27 ms → 17 ms (recorriendo) |

Dos hallazgos que cambiaron el enfoque:

1. **Bajarle los fotogramas por segundo al instrumento no servía de nada.** A 15
   y a 8 por segundo seguía en 53 ms de fotograma mediano. Lo caro es CADA
   dibujo, no cuántos haya. Por eso la solución no es «menos fotogramas» sino
   «que no anime en bucle».
2. **La atmósfera escribía tres variables CSS en `<html>`.** Cada cambio de
   sección invalidaba el estilo del documento entero: 1.184 ms de recálculo de
   estilo en un recorrido de cinco segundos por `/sistema-financiero`, unos
   95 ms de tirón por sección. Escritas en la capa que las usa: **372 ms**.

Y un agujero: `dcp5` creaba su lienzo a `devicePixelRatio` sin tope en táctil,
es decir **2x en un iPad** — 5,6 millones de píxeles a la GPU por fotograma.

## Lo que se hizo

### `window.DCP`, el presupuesto de fotograma (en `main.js`)

Tres clases, decididas **por el lado mayor de la pantalla**, no por el ancho de
la ventana: un iPad en vertical mide 834 px y con la regla anterior se llevaba
el trato de un móvil, y al girarlo cambiaba de clase a mitad de visita.

| | lienzo | densidad | fotogramas | fondo ambiente | al desplazar |
|---|---|---|---|---|---|
| `pc` | hasta 1,75x | 100 % | libres | animado | sigue |
| `tableta` | 1x | 55 % | 30 | **no anima en bucle** | quieto 700 ms |
| `telefono` | 1x | 50 % | 30 | **no anima en bucle** | quieto 700 ms |

Encima va un **gobernador**: mide los fotogramas de verdad en ventanas de 45 y
compara el percentil 90 con el presupuesto. Dos ventanas malas bajan un escalón
de calidad (una sola si es catastrófica); cuatro buenas suben uno; como mucho un
cambio cada ocho segundos, porque cada cambio reconstruye el campo. Hay suelo
por clase y no oscila: medido en el perfil `ipad`, baja a 0,75 a los ~3 s y se
queda ahí. Un iPad viejo acabará con menos densidad que uno nuevo sin que nadie
lo decida aquí. Y si el gobernador ya ha tenido que bajar, el campo de la
portada pasa a 16 fotogramas cuando hace más de 1,8 s que nadie toca la
pantalla: leyendo, el fotograma mediano baja de 35 a 21 ms.

### En cada módulo

- **`dcp6`** (campo de la portada): densidad y lienzo del presupuesto; **quieto
  mientras el dedo baja** (antes bajaba a 12 fotogramas, ahora no dibuja); se
  reconstruye cuando el gobernador cambia de escalón.
- **`dcp8`** (instrumento de fondo): en táctil deja de ser una animación
  continua y pasa a ser una imagen que responde — se queda quieta al
  desplazarse y, cuando el dedo para, alcanza el punto del scroll y se detiene.
  La despiertan el scroll, el cambio de tamaño, el cambio de tema y el
  gobernador.
- **`dcp9`** (composición de bloque): lo mismo, con veinte fotogramas para
  armar la idea antes de pararse.
- **`dcp5`**: tope de lienzo en táctil (era 2x sin tope) y la atmósfera pasa a
  escribirse en su propia capa (`.amb-aurora`) en vez de en `<html>`.

En escritorio no cambia nada: mismas partículas, mismo lienzo, mismo fondo vivo.

## Antes y después (mediana de tres pasadas)

**iPad (1024×1366, dpr 2, CPU ×4)**

| | antes | después |
|---|---|---|
| Portada, bajando | 60 ms · p95 125 · 63 fotogramas > 50 ms | **19 ms · p95 63 · 13** |
| Portada, leyendo | 54 ms · p95 83 · 53 | **21 ms · p95 63 · 21** |
| Servicios, bajando | 28 ms · p95 82 · 40 | **19 ms · p95 68 · 18** |
| Servicios, leyendo | 60 ms · p95 80 · 63 | **22 ms · p95 53 · 11** |

Operaciones de lienzo en un recorrido de la portada: **121.826 → 7.177** (−94 %).

**Teléfono (390×844, dpr 3, CPU ×6)**

| | antes | después |
|---|---|---|
| Portada, bajando | 20 ms · p95 75 · 17 | **17 ms · p95 32 · 4** |
| Servicios, leyendo | 44 ms · p95 65 · 28 | **17 ms · p95 25 · 1** |

**PC (1440×900, sin freno)** — sin cambios: 22 → 21 ms bajando, 17 → 17 leyendo.

## Lo que queda

- `/sistema-financiero` recorriéndose en el perfil `ipad` se queda en ~34 ms de
  fotograma mediano. Ahí ya no manda el JavaScript (el perfil de CPU da 2,2 %
  para el bucle más caro): manda pintar y componer una página con la aplicación
  de Finance dentro. Quitarle las sombras a la demo bajaba de 35 a 27 ms, pero
  eso cambia cómo se ve el producto y no se ha tocado sin decidirlo.
- **NO MEDIDO**: nada de esto está medido en un iPad real con Safari. Las
  mejoras son estructurales (94 % menos operaciones de lienzo al desplazarse,
  ningún bucle de fondo en táctil, sin invalidar el estilo del documento
  entero), así que deberían notarse más aún en un aparato real, pero la cifra
  hay que verla allí.
