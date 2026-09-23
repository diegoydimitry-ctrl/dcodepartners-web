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

## El iPad de verdad: no era dibujar, era componer

Todo lo anterior —menos partículas, menos resolución, el campo congelado
mientras el dedo baja— se midió en el perfil `ipad` y mejoró los números. En un
iPad **real** no arregló nada: la portada seguía yendo a tirones, sobre todo en
la zona de los cuatro pasos (Analizamos, Diseñamos, Implantamos, Medimos).

Volviendo a medir, esta vez aislando el lienzo en vez de su contenido, sale por
qué. Recorriendo los estados 4 a 7 de la portada en el perfil `ipad`:

| qué se prueba | llamadas de lienzo | script | compositor |
|---|---:|---:|---:|
| como estaba | 7.319 | 7.674 ms | **1.304 ms** |
| el bucle congelado (no dibuja nada) | 0 | 8.436 ms | **1.282 ms** |
| dibujando igual, pero el lienzo oculto | 27.368 | 8.212 ms | **311 ms** |
| el lienzo fuera del documento | 0 | 7.214 ms | **426 ms** |

Congelar el bucle no quitaba nada. Ocultar el lienzo —dejándolo dibujar— quitaba
el 76 %. Es decir: **lo caro nunca fue calcular las partículas, sino que una capa
fija del tamaño de la pantalla se volviera a subir a la GPU en cada fotograma.**
A dpr 2 en un iPad eso es una textura de 2048×2732 por fotograma. Por eso bajar
densidad no se notaba: la textura pesa lo mismo con 600 partículas que con 2.100.

### Lo que se hizo

En táctil el campo no se monta. `DCP.campoVivo()` es cierto solo en la clase
`pc`, y `dcp6.js` (portada) y `dcp8.js` (el resto) se paran en la primera línea
y marcan `<html class="cielo-quieto">`.

El hueco no queda vacío: debajo del campo ya vivía **la galaxia** (`galaxia.css`),
que es el cielo del resto del sitio —mosaicos de estrellas ya pintados, unos
degradados y sus colores por tema—. Se compone una vez y no se vuelve a tocar.
Quitando el lienzo, el cielo sigue ahí, en oscuro y en claro, sin un solo byte
nuevo. Con él se apagan también las dos derivas del polvo y el titileo de las
estrellas, que es el mismo trato que ya tenía «movimiento reducido»: el mismo
cielo, sin bucles.

**Un ratón no entra aquí.** La clase la decide el puntero primario, no el ancho:
en PC, Mac y pantallas grandes no cambia absolutamente nada.

### Antes y después (mismas pasadas, mismo banco)

| perfil · recorrido | fotogramas > 50 ms | > 100 ms | p95 | compositor |
|---|---:|---:|---:|---:|
| iPad · pasos de la portada | 11 → **9** | 2 → **0** | 48 → **40** ms | 1.304 → **391** ms |
| iPad · portada entera | 17 → **11** | 1 → 2 | 59 → **52** ms | 879 → **196** ms |
| iPad · /servicios | 11 → **6** | 7 → **0** | 64 → **43** ms | 825 → **493** ms |
| Móvil · portada | 3 → **1** | 0 → 0 | 30 → **25** ms | 755 → **216** ms |
| PC · portada | 6 → 4 | 2 → 1 | 36 → 35 ms | 1.721 → 1.863 ms |

La fila del PC es la que importa al revés: el camino no cambia, y las
diferencias son el ruido de pasada a pasada de una máquina de dos núcleos.
Operaciones de lienzo al recorrer la portada en iPad: 11.066 → **0**.

Apagando además las derivas de la galaxia, en dos pares de pasadas por la zona
de los pasos: fotogramas por encima de 50 ms de 4 y 6 a **1 y 1**, p95 de 40 y
37 a **32 y 30** ms.

### Lo que se pierde

Las nueve formaciones del campo —el análisis, la construcción, el ciclo— solo
se ven con ratón. En un iPad queda el cielo. Con ellas se va el rótulo «Lo que
estás viendo», que nombraba la formación y sin campo no nombra nada.

## El cambio de tema en un dedo

Mismo patrón que el campo, y misma lección. Al invertir el tema, la página se
partía en 44 piezas y cada una recibía un nombre de transición: el navegador
tiene entonces que fotografiar 88 capas antes de mover nada. En un ratón eso va
fino. En un iPad es lo que el cliente describió como «tarda y se cambia muy
lento», y tenía razón.

Medido en el perfil `ipad` (mediana de tres pulsaciones sobre la portada):

| cómo se hace el cambio | peor fotograma | p95 | el gesto entero |
|---|---:|---:|---:|
| 44 piezas (como estaba) | 527 ms | 189 ms | 1.678 ms |
| una sola foto de la pantalla | 765 ms | 59 ms | 1.249 ms |
| **el barrido (lo que se hizo)** | **296 ms** | **23 ms** | **~540 ms** |

Lo que sorprende es la fila del medio: quitar las piezas y dejar una sola
captura de pantalla completa **empeora** el peor fotograma. Fotografiar 2048×2732
píxeles de una vez cuesta más que fotografiar 88 trozos pequeños. La conclusión
es la misma que con el campo: en un aparato táctil, lo caro es la imagen, no el
cálculo.

Así que en táctil no se fotografía nada. Va el barrido —una franja que cruza la
pantalla, un solo elemento compuesto en la GPU— y el tema cambia cuando la
franja cubre la pantalla, de modo que el repintado, que es inevitable, queda
detrás de ella en vez de a la vista. 230 ms de entrada, 300 de salida.

En un ratón no cambia nada: las piezas siguen ahí.

Medido después: iPad p95 21 ms, peor fotograma 391; móvil p95 23 ms, peor
fotograma 348. PC igual que antes (ready 291→349 ms, gesto 1.412→1.451: ruido
de pasada).

## Lo que queda

- `/sistema-financiero` recorriéndose en el perfil `ipad` se queda en ~34 ms de
  fotograma mediano. Ahí ya no manda el JavaScript (el perfil de CPU da 2,2 %
  para el bucle más caro): manda pintar y componer una página con la aplicación
  de Finance dentro. Quitarle las sombras a la demo bajaba de 35 a 27 ms, pero
  eso cambia cómo se ve el producto y no se ha tocado sin decidirlo.
- **NO MEDIDO**: los números de arriba salen del perfil simulado, no de un iPad
  real con Safari. La primera tanda de mejoras ya enseñó que eso no basta: el
  banco daba mejoras que en el aparato no se notaron, y hizo falta volver a
  medir aislando la capa. Lo de ahora es estructural —en táctil no hay ningún
  lienzo a pantalla completa— pero la cifra hay que verla allí.
- **NO MEDIDO (anterior)**: nada de la primera tanda está medido en un iPad real con Safari. Las
  mejoras son estructurales (94 % menos operaciones de lienzo al desplazarse,
  ningún bucle de fondo en táctil, sin invalidar el estilo del documento
  entero), así que deberían notarse más aún en un aparato real, pero la cifra
  hay que verla allí.

## En un teléfono, las aplicaciones no se montan

Lo que se ve en 390 px no es lo mismo que lo que se ve en un iPad, y no por
rendimiento: por **tamaño**. Una aplicación de gestión apretada en un teléfono
enseña algo peor de lo que es, que es justo lo contrario de lo que estas
secciones quieren demostrar. Así que por debajo de 900 px:

| | en un teléfono |
|---|---|
| D-Code Finance | ficha de lectura con foto real del panel + «Abrirla aquí igualmente» |
| Comercial, Operaciones, Atención | ficha de lectura con foto real de cada demo |
| **Centro operativo de D-Code OS** | ficha de lectura con foto real + «Abrirlo aquí igualmente» |

La del centro operativo es nueva: hasta ahora el panel —menú, KPIs, mapa,
actividad en vivo y una decisión de la IA esperando aprobación— se montaba
entero en el teléfono. Lo esconde el CSS (para que sin JavaScript tampoco
aparezca) y `dcode-os.js` se ahorra además todo su trabajo: los cables, el
reloj de 1,4 s y las animaciones no llegan a existir.

Tres cosas más que se encontraron mirando la web a 393 px:

1. **La foto de la ficha no tenía estilo en `/sistema-financiero`.** Sus
   reglas vivían en `dcp10.css`, que solo cargan la portada y Departamentos:
   en la página de Finance se veían LAS DOS fotos —la del tema oscuro y la
   del claro—, enteras, una debajo de otra y a 350 px de ancho. Ahora viven
   en `dcp7.css`, que carga toda la web.
2. **La tira de «hoy / con el sistema» quedaba cortada.** Con cuatro pasos
   era una tira que se desliza; con dos, media caja cortada en el filo
   derecho parece un fallo. En teléfono se apilan.
3. **Una frase de la consola de OS no se leía**: 1,65:1 en oscuro y 1,61:1
   en claro, medido en píxeles. La caja lleva la paleta contraria a la de la
   página y un `<p>` dentro suyo no hereda su tinta —se la pisa la regla
   global `p{color:…}`—. Ahora la tinta se nombra con los tokens de la caja.

Y la clase de dispositivo **se vuelve a mirar** cuando cambia el puntero o el
tamaño: se decidía una sola vez al cargar, así que al activar el modo teléfono
de las herramientas de desarrollo la página seguía creyéndose un PC.
