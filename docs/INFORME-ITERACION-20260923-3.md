# Iteración del 23 de septiembre (3) — la transición, las formaciones y el tema

Tres encargos, uno de diseño y dos de rendimiento. Los tres tocan lo mismo por
debajo: **cuándo vale la pena fotografiar la pantalla y cuándo no**.

---

## 1. Cambiar de sección: fuera el efecto anterior

> «El cambio entre secciones y pestañas en la web va fatal, no me gusta. Innova
> y cámbialo por completo.»

Lo que había era la coreografía del cambio de tema reutilizada: al pulsar
«Método» la página se rompía en decenas de trozos que salían volando hacia la
izquierda y la siguiente llegaba desde la derecha. Se ha quitado entero, con su
maquinaria: los rectángulos guardados en `sessionStorage`, el renombrado de
piezas en `pageswap`, las dos tandas de animaciones a mano en `pagereveal`. Unas
120 líneas de JavaScript menos.

### Lo que hay ahora

La web de D-Code enseña sistemas, y un sistema no se deshace cada vez que miras
otra cosa. **Se queda el bastidor y cambia el panel.**

1. **La cabecera no se mueve.** Tiene nombre propio de transición, así que el
   navegador la reconoce como la misma pieza en las dos páginas y la deja
   quieta. Es el detalle que hace que esto se lea como una aplicación y no como
   una página que se recarga.
2. **Lo que se va se archiva**: encoge un 5,5 % hacia el fondo y se apaga, en
   260 ms. No huye.
3. **Lo que llega se monta**: entra desde un 2,6 % más abajo y algo más grande,
   y se asienta en 400 ms. Es opaco a los 170 ms de la pulsación, cuando la
   página anterior todavía está al 70 %: nunca hay un hueco en negro.
4. **Una línea de luz recorre la pantalla de arriba abajo** mientras tanto. La
   sección nueva no aparece: se monta.

Todo es `transform` y `opacity` sobre dos capturas y una línea de 2 px. Sin
recortes animados, sin filtros, sin una pieza por elemento. **Cuesta lo mismo
en un ratón que en un dedo**, que es la razón de que aquí no haya dos versiones.

### Dos cosas que salieron mal y cómo se vieron

- **El cielo tapaba la página que se iba.** Al principio la galaxia también
  llevaba nombre propio, para que se quedara quieta como la cabecera. Al
  nombrar un elemento, el navegador lo saca del grupo `root` y lo pinta **por
  encima** de él; como el cielo ocupa la pantalla entera y es opaco, la sección
  de salida no se veía en ningún fotograma. Medido poniendo las animaciones a
  1/50 de velocidad: solo cabecera y estrellas. Se le quitó el nombre; dentro
  de `root`, el cielo viaja con la página y encoge un pelo, que además da
  profundidad.
- **La línea no salía.** Se creaba desde `tema.js`, y `pagereveal` avisa antes
  de que corran los scripts con `defer`: llegaba tarde a la foto de la página
  nueva. Ahora está en el HTML de las 66 páginas (la pone
  `scripts/aplicar-tema.mjs`), oculta, y el CSS solo la enseña mientras dura la
  transición. Comprobada fotograma a fotograma sobre el vídeo real: baja por la
  pantalla en los fotogramas 94 a 100 (y ≈ 112 → 742 px).

### Coste

| perfil | peor tarea | estilo | pintado | navegación |
|---|---:|---:|---:|---:|
| PC · antes | 82 ms | 77 ms | 184 ms | 730 ms |
| PC · después | **67 ms** | **54 ms** | **161 ms** | **705 ms** |
| iPad · antes | 124 ms | 143 ms | 273 ms | 1.019 ms |
| iPad · después | 152 ms | **132 ms** | **271 ms** | **972 ms** |

En el iPad apenas cambia porque allí el efecto de piezas ya estaba apagado: lo
que cambia es lo que se ve, que es lo que se pedía.

---

## 2. Los cuatro pasos ya no están vacíos en un iPad

> «En el iPad ya va bien, pero la zona de "1. Analizamos, 2. Implantamos,
> Diseñamos, etc." ahora está muy vacía. Implanta al lado de cada una una imagen
> relacionada con lo que se dice y con el diseño de la web.»

Con el campo de partículas apagado en táctil (iteración anterior), los cuatro
pasos del método se quedaban con media pantalla a oscuras. **La imagen no se
busca fuera ni se inventa: se saca del propio motor.**

Cada paso ya tenía asignada su formación en `dcp6.js`:

| paso | formación | qué dibuja |
|---|---|---|
| 01 Analizamos | `F_LUPA` | la lupa sobre el ruido, con el hallazgo acotado |
| 02 Diseñamos | `F_PLANO` | el plano: las partes definidas y cómo se conectan |
| 03 Implantamos | `F_MOTOR` | el ciclo cerrado que, puesto en marcha, sigue solo |
| 04 Medimos | `F_GRAFICA` | lo mismo, cada vez con menos desperdicio |

`scripts/build-pasos.mjs` abre la portada con ratón y pantalla grande —la única
forma de que el campo se monte con toda su densidad—, para en cada paso, espera
4,2 s a que la formación termine de montarse y guarda el lienzo con su
transparencia. Después recorta a lo que tiene tinta y lo deja en WebP.

Lo que se ve en un iPad **es exactamente lo que dibuja la web en un ordenador**,
congelado: mismo dibujo, mismo color, mismo sitio.

- 33–152 KB cada una, `loading="lazy"`, decorativas (`aria-hidden` y `alt`
  vacío): lo que cuentan ya está escrito al lado.
- En claro se invierten igual que se invertía el campo.
- A partir de 760 px van al lado del texto, alternando lado con el paso; por
  debajo, tamaño pequeño y debajo del texto.
- `check:tema` falla si falta un fichero o una referencia (probado quitando uno).

---

## 3. El cambio de tema en táctil

> «Optimiza el cambio oscuro↔claro en iPad y teléfono; en PC cambia superfluido
> pero en los demás tarda y se cambia muy lento.»

Ver la tabla y el razonamiento en
[RENDIMIENTO-POR-DISPOSITIVO.md](RENDIMIENTO-POR-DISPOSITIVO.md#el-cambio-de-tema-en-un-dedo).
En resumen: en táctil no se fotografía la pantalla. Va el barrido —una franja
que cruza y esconde el repintado— y el gesto pasa de **1.678 ms a ~540**, el p95
de **189 a 21 ms** y el peor fotograma de **527 a 391**. En un ratón no cambia
nada.

---

## Verificación

Nueve checks · `qa:demo` sin incidencias · `qa:solapes` 70 páginas × 10 anchos
· axe-core WCAG 2.2 AA con ratón y con dedo · banco de tema en los tres
perfiles, tres pulsaciones cada uno · banco de navegación en PC e iPad, tres
pasadas · la transición revisada fotograma a fotograma sobre el vídeo real ·
capturas de los cuatro pasos a 1024, 1112 y 393 px en los dos temas.

**NO MEDIDO**: nada de esto está medido en un iPad real con Safari.
