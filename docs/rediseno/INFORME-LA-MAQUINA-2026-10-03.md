# dcodepartners-web · «La máquina»

Rediseño completo de la web y Reel nuevo · 3 de octubre de 2026

- **Rama:** `redesign/immersive-3d-v3` (no se ha tocado `main` ni Production y no hay ningún merge).
- **Preview:** https://dcodepartners-web-git-redesign-immersive-3d-v3-d-code-partners.vercel.app
- **Reel:** `reel-dcode.mp4` (con texto) y `reel-dcode-sin-texto.mp4`, entregados aparte (25 MB cada uno; no se guardan en el repositorio). La portada y los textos para publicar están en `docs/reel/portada-reel.jpg` y `docs/reel/COPY.md`.

La versión anterior («el mundo»: una sala con hojas de papel) se ha retirado entera. Esta no es un retoque de aquella: tiene otro concepto, otro motor 3D, otra entrada, otra narrativa y otro Reel.

---

## 1. Qué ha cambiado

| | Antes («el mundo») | Ahora («la máquina») |
|---|---|---|
| Idea | Una sala con hojas de papel que se ordenan. | Una máquina de precisión de más de 300 piezas: tu empresa ya tiene las piezas y D-Code las monta en un solo sistema. |
| Motor | WebGL escrito a mano, sin sombras ni materiales físicos. | three.js r186: metal con acabados (cepillado, soleado, arenado, pavonado azul), sombras, reflejos de un plató, profundidad de campo y halo. |
| Entrada | Título centrado sobre la escena. | La web empieza dentro de la máquina en marcha, pegada al muelle real; la cámara se retira y la máquina salta en piezas. El título aparece después, en el tercio inferior, como el de una película. |
| Servicios | Texto junto a la escena. | Cada área de la empresa es un módulo de la máquina (ventas, clientes, operaciones, finanzas, dirección y el motor). Las ruedas azules que los unen son lo que construye D-Code. |
| Finance | La escena acompañaba a una demo en HTML. | La máquina hace la demo: una lupa recorre la factura, los datos saltan al registro, los tambores marcan el total y un martillo da en la campana cuando se programa el pago. El importe se puede cambiar. |
| Cierre | Formulario al final. | El visitante escribe el nombre de su empresa y la máquina lo graba en la tapa. El botón lleva ese nombre al formulario de contacto. |
| Móvil | La misma escena, encogida. | La máquina se construye en vertical (2 × 3 módulos), con sus propias cámaras; se mueve arrastrando, manteniendo pulsado e inclinando el teléfono. |
| Páginas interiores | La sala en la cabecera. | La parte de la máquina que corresponde a cada página (la lupa para los agentes de IA, el registro para Finance, el módulo de cada departamento, la tapa para contacto). |
| Reel | Recorrido de 40 s que empezaba con una presentación. | Tráiler de 32 s que empieza dentro de la máquina, sin logotipo ni presentación. |

## 2. Qué se ha eliminado

- El motor anterior (`assets/v2/js/mundo.js`), su hoja de estilos, sus 16 fotos fijas y sus herramientas (`scripts/v3/`).
- El Reel anterior y su rodaje (`docs/reel/` de la versión 2).
- La portada con el título centrado, el subtítulo y los dos botones en mitad de la pantalla.
- La chapa «perlada» de la base (parecía fibra de carbono) y los puentes macizos que tapaban las ruedas.
- Dos frases de la portada que ya no existen (se quitaron también del control de textos).

No se ha eliminado ningún contenido: las nueve secciones, los precios, las demos, el chat, los formularios y todas las páginas interiores siguen ahí, en HTML.

## 3. Concepto elegido

**«Tu empresa ya tiene todas las piezas. Nosotros las conectamos en un solo sistema.»**

La web es una máquina: un mecanismo de más de 300 piezas de metal, generado entero por código. La narrativa recorre nueve capítulos y la escena cambia de estado en cada uno:

1. **Inicio.** Las piezas flotan sueltas después de que la máquina haya saltado.
2. **Hoy.** Cada pieza va por su cuenta (cuatro llevan el nombre de algo real: la hoja de pedidos, las facturas en PDF, los mensajes de los clientes, la agenda). Si se mantiene pulsado, se montan.
3. **El sistema.** Las piezas ocupan su sitio, módulo a módulo, y las ruedas azules entran las últimas. Se puede elegir un área y la cámara va a su módulo.
4. **La automatización.** Se hace de noche, la luz queda rasante, los zafiros brillan y la máquina sigue en marcha a las 03:12.
5. **La inteligencia.** Una lupa lee una factura.
6. **Finance.** La demostración completa: documento, lectura, datos, registro y acción.
7. **El resultado.** Baja la tapa: lo complejo queda dentro y a la vista quedan tres ventanas (el volante, el registro y el indicador).
8. **Pruébalo.** Las demos, con la escena atenuada.
9. **El tuyo.** El nombre de la empresa del visitante, grabado en la tapa.

## 4. Por qué este concepto

- **Explica lo que hace D-Code sin leer.** «Piezas sueltas que se montan en un sistema» se entiende mirando. La sala con papeles pedía una explicación.
- **Los servicios viven dentro del mundo.** Cada área es un módulo con su mecanismo: la carraca de ventas (lo que avanza no vuelve atrás), la campana de clientes (el aviso), la leva y la cremallera de operaciones (el trabajo que se repite), los tambores de finanzas (el registro) y el indicador de dirección. No hay una sección de «servicios» con seis tarjetas.
- **Respeta la identidad.** Es blanco, negro y grises, con un único azul (tornillos pavonados, zafiros y transmisiones). No hay neón, ni estética de videojuego, ni figuras humanas.
- **Cada efecto dice algo.** La explosión es «hoy cada pieza va por su cuenta»; el montaje es el servicio; las ruedas azules son lo que construye D-Code; la noche es la automatización; la lupa es la IA; la tapa es «lo complejo queda dentro»; el grabado es «esto será tuyo».
- **Da el momento de impacto en los tres primeros segundos** y lo da antes de que haya nada que leer.

## 5. Referencias investigadas

Se han estudiado experiencias WebGL premiadas y cómo las explican quienes las hicieron, no para copiarlas sino para sacar principios:

- **Shader.se** (caso publicado en Codrops): transiciones continuas entre escenas y la idea de que «una transición puede ser técnicamente correcta durante días antes de sentirse bien». De ahí sale que entre capítulos la cámara no vaya en línea recta, sino con un arco de grúa.
- **Metabole** (estudio): defender una sola idea y pensar en escenas, no en páginas. De ahí sale que haya una sola máquina para toda la web.
- **Guía de narrativa interactiva de Utsubo:** estructura en cinco actos, primera animación impactante, uso del giroscopio y pocas escenas. De ahí salen la entrada y el gesto de inclinar el teléfono.
- **VAHL** (mecanismo de reloj hecho por código): acabados generados en el sombreador, lupa, cámaras distintas en móvil e imágenes fijas para quien pide menos movimiento. La máquina de D-Code no es un reloj: es una máquina de empresa con módulos por área, registro, lupa y tapa con nombre.
- **Criterios de jurado de premios web:** dirección de arte, movimiento dirigido y fluidez en móviles de gama media.
- **three.js en 2026:** `WebGPURenderer` cae a WebGL2 cuando no hay WebGPU; se ha quedado en `WebGLRenderer` porque es lo que funciona igual en todos los navegadores actuales.
- **Reels:** el dato que más pesa es cuánta gente se va en los tres primeros segundos; por eso no hay logotipos ni presentaciones al principio y el primer cuadro ya tiene contraste, movimiento y sonido. Zonas seguras de Instagram en 1080 × 1920: unos 270 px arriba, 670 px abajo y 65 px a los lados.

## 6. Qué hace distinta a la experiencia nueva

- **La geometría y los materiales son código.** No hay ni un modelo 3D, ni una textura fotográfica, ni un vídeo: las ruedas, los puentes, los tornillos, los zafiros, los tambores, la campana y la lupa se generan al cargar. El grabado de la tapa y la factura se dibujan en un lienzo.
- **La máquina funciona de verdad.** Los trenes de ruedas se resuelven desde el barrilete con sus relaciones y sus fases, así que los dientes engranan; el volante oscila, el áncora bate, la leva empuja al seguidor y este a la cremallera.
- **Cambio de escala.** Se empieza a cuatro centímetros del muelle y se acaba viendo la máquina entera sobre una mesa de plató, con su sombra.
- **El final es personal.** El nombre que escribe el visitante queda grabado en el metal y viaja hasta el formulario.

## 7. Qué partes son interactivas

| Dónde | Qué se puede hacer |
|---|---|
| Toda la portada | Bajar con el scroll: la película avanza de capítulo en capítulo. Arrastrar: la cámara gira alrededor de la máquina y vuelve sola. |
| Inicio y «Hoy» | Mover el ratón: las piezas sueltas se apartan a su paso. Mantener pulsado: las piezas se montan. |
| El sistema | Elegir un área (ventas, clientes, operaciones, finanzas, dirección): la cámara va a su módulo, el resto se atenúa y cambia el texto. |
| Finance | Cambiar la base imponible y pasar la factura: la lupa la lee, los datos saltan al registro, los tambores marcan el total, suena el aviso y se puede preguntar por los pagos. |
| El tuyo | Escribir el nombre de la empresa: se graba en la tapa. Marcar lo que hoy no encaja: el botón lleva ambas cosas al formulario de contacto, que llega relleno. |
| Móvil | Deslizar en horizontal para girar la escena, botón de mantener pulsado e inclinar el teléfono (en los navegadores que lo dan sin pedir permiso; en iOS no se pide). |
| Páginas interiores | La parte de la máquina de cada página sigue al ratón. |

## 8. Cómo funciona en móvil

No es la versión de escritorio encogida:

- La máquina se **construye en vertical** (dos columnas por tres filas) para que llene una pantalla de teléfono.
- Cada capítulo tiene **su propia cámara** para vertical: la escena ocupa la mitad superior y el texto, la inferior.
- Se interactúa con el dedo: deslizar en horizontal gira la escena, hay un botón para mantener pulsado, y al inclinar el teléfono la cámara se mueve y las piezas sueltas reaccionan.
- El coste se ajusta al aparato: menos píxeles, sombras a 1024, 12 muestras de desenfoque y, si los cuadros tardan más de 30 ms, la calidad baja sola (primero resolución, luego desenfoque, al final sombras).
- En las páginas interiores el teléfono no monta la escena (taparía el título): lleva una foto fija del mismo capítulo.

## 9. Cómo se ha protegido el SEO

- Todo el contenido sigue en **HTML**: un solo `h1` («Sistemas inteligentes para empresas.»), los `h2` de cada capítulo, los textos, los precios, los enlaces y los formularios. El lienzo 3D va detrás, con `aria-hidden`.
- El motor **no bloquea la carga**: se pide con `import()` cuando la página ya está pintada.
- Sin JavaScript, con movimiento reducido, con ahorro de datos o sin WebGL2, la portada enseña **una foto fija de cada capítulo** y todo el texto.
- No se ha tocado ningún título, descripción, canónica, `hreflang`, dato estructurado ni URL. El mapa del sitio tiene las mismas 72 URL.
- Comprobaciones pasadas: `qa:seo` (86 páginas, 72 indexables, 0 fallos y 0 avisos), `check:enlaces` (6.288 enlaces y recursos internos, 76 bloques JSON-LD), `check:textos` (0 problemas) y `check:superficie` (nada interno llega al despliegue).

## 10. Rendimiento

Lo medido:

| | Antes | Ahora |
|---|---|---|
| HTML de la portada (comprimido) | 10,9 KB | 11,8 KB |
| Estilos de la escena (comprimidos) | 5,5 KB | 6,0 KB |
| Motor 3D (comprimido), carga diferida | 16,8 KB | 172 KB |
| Modelos 3D, texturas y vídeos | 0 | 0 |
| Fotos fijas (solo las ve quien no carga el motor) | 16 · 409 KB | 16 · 1,15 MB (entre 18 y 109 KB cada una) |
| Geometría | — | 312 piezas, 75 geometrías distintas, unos 225.000 triángulos; se dibujan por instancias (unas 80 llamadas de dibujo) |

- **El motor pesa más (P2).** Pasar de WebGL a mano a three.js cuesta 155 KB comprimidos más. Es el precio de las sombras, los materiales físicos y el posproceso. Se carga después del primer pintado y no bloquea el texto.
- **Qué se ha hecho para que cueste lo mínimo:** piezas por instancias (una llamada de dibujo por tipo de pieza), acabados calculados en el sombreador en vez de texturas, tope de píxeles por dispositivo, sombras de 1024 en móvil, calidad que baja sola, y el motor se para cuando la escena no se ve o la pestaña está detrás.
- **El título no espera a la película:** aparece mientras las piezas aún vuelan y, si el motor tarda, sale solo a los 2,6 s.
- **Si el teléfono se queda sin contexto gráfico**, la portada pasa a las fotos fijas en vez de quedarse en negro.
- **NO MEDIDO:** los cuadros por segundo y las Core Web Vitals en aparatos reales. Este entorno no tiene tarjeta gráfica (todo se calcula por software), así que cualquier cifra de fluidez tomada aquí sería falsa. Hay que medirlo en la Preview con un portátil normal, un iPhone y un Android de gama media. **HIPÓTESIS:** en un Android de gama media la calidad bajará uno o dos escalones de forma automática.

Pruebas funcionales pasadas en la página real (escritorio, inglés y móvil): el motor arranca, el título se abre, las áreas enfocan su módulo, Finance calcula con otra base (2.000,00 € → 2.420,00 €), registra, avisa y responde, el cierre lleva el nombre al formulario, que llega relleno, inclinar el teléfono mueve la escena y no hay errores de consola.

Un fallo encontrado al revisar el Reel y ya corregido en la web: las cifras de los tambores del registro salían en espejo y una posición desplazadas. Ahora el registro marca el total de la factura y se lee del derecho.

## 11. Qué se ha hecho para que el Reel retenga

- **Los tres primeros segundos son el mejor plano de la web:** dentro de la máquina, pegado al muelle azul, con las ruedas girando; al segundo salta en piezas hacia la cámara. No hay logotipo, ni nombre, ni presentación.
- **Suena desde el primer cuadro:** el escape acelera, sube el zumbido de los engranajes y el estallido cae en el segundo 1.
- **La frase llega cuando ya se ha mirado:** «Esto es una web.» aparece en el segundo 2,7, sobre la página real, y un dedo empieza a deslizar.
- **Ritmo de tráiler:** trece planos en 32 segundos, con los cortes sobre un pulso de 120 ppm. Alternan planos generales y de detalle, hay cambios de escala y de luz (la noche) y dos momentos en los que alguien toca la pantalla.
- **Demuestra que no es solo diseño:** un dedo pulsa «Pasar la factura por Finance» y la web la lee y la registra.
- **El pico está al final:** baja la tapa, alguien escribe «Talleres Luna» y la máquina lo graba letra a letra.
- **Texto mínimo y dentro de las zonas seguras** de Instagram; cada rótulo es una frase entera.
- **Dura 32 segundos**, no 40: lo que no aportaba se ha quitado.
- **Cierre con llamada:** «¿Quieres una web así?», la marca y «Escríbenos · dcodepartners.com».

El sonido está sintetizado entero (no hay música ni muestras de terceros, así que no hay derechos de nadie).

Se revisó como lo haría un director creativo y se rehízo lo que no pasaba: el estallido (la cámara se quedaba pegada a la base y no se veía saltar nada; ahora sale despedida hacia atrás con las piezas), el plano de la noche (la máquina quedaba arrinconada), el del registro (las cifras no llegaban a la cantidad y estaban en espejo), el cierre (la máquina se quedaba pequeña y oscura) y los rótulos que pisaban el título de la página o la factura.

**NO MEDIDO:** la retención real. Solo se sabrá con las estadísticas de Instagram cuando se publique; lo anterior son decisiones de montaje, no resultados.

| Plano | Segundos | Qué se ve |
|---|---|---|
| Dentro | 0,0 – 2,5 | El muelle real en marcha; al segundo, la máquina salta en piezas. |
| Es una web | 2,5 – 5,0 | La portada real con su título; un dedo empieza a deslizar. |
| Se monta | 5,0 – 7,0 | Las piezas ocupan su sitio, módulo a módulo. |
| Las ruedas azules | 7,0 – 8,0 | Entran las transmisiones y engranan. |
| En marcha | 8,0 – 9,5 | La máquina entera funcionando. |
| La leva | 9,5 – 10,5 | Detalle de la leva, el seguidor y la cremallera. |
| La noche | 10,5 – 12,5 | Se va la luz; los zafiros brillan y la máquina sigue. |
| Finance | 12,5 – 17,5 | Un dedo pasa la factura: la lupa la lee y el registro se rellena. |
| El registro | 17,5 – 18,5 | Los tambores giran hasta 1.500,40. |
| La campana | 18,5 – 19,5 | El martillo da el aviso. |
| La tapa | 19,5 – 22,0 | Baja y cierra: lo complejo queda dentro. |
| Tu nombre | 22,0 – 26,5 | Alguien escribe «Talleres Luna» y la máquina lo graba. |
| Cierre | 26,5 – 32,0 | La tapa con «Tu empresa» y la llamada. |

---

## Lo que queda en tus manos

1. **Mirar la Preview en aparatos reales** (portátil, iPhone y Android) y decir qué plano o qué capítulo no está a la altura.
2. **Medir la fluidez** en esos aparatos: aquí no se puede.
3. **Decidir si se publica.** No se ha hecho merge ni despliegue de Production.

## Cómo se reproduce

```
node scripts/v4/construir.mjs                 # empaqueta el motor, genera la portada (ES y EN), versiones, SEO y mapa del sitio
node scripts/v4/fotos.mjs --rehacer           # fotos fijas de cada capítulo (con el sitio servido en local)
node scripts/v4/reel/director.mjs <cuadros>   # rodaje del Reel, plano a plano; se puede reanudar
node scripts/v4/reel/capas.mjs <rótulos>      # rótulos
python3 scripts/v4/reel/audio.py reel.wav     # sonido
scripts/v4/reel/montar.sh <cuadros> <rótulos> reel.wav docs/reel
```
