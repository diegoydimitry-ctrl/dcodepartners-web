# Pruebas de la web

Todas se ejecutan en local, sin red ni secretos. Las de navegador levantan el
sitio como lo sirve Vercel y bloquean cualquier petición a terceros.

| Orden | Qué comprueba | Tiempo aprox. |
|---|---|---|
| `npm run check:estado` | Estado de VERI\*FACTU y conciliación: prueba por estado, regiones generadas al día, ninguna afirmación prohibida en lo publicado (con meta-prueba) | 1 s |
| `npm run test:estado` | Que el estado no se puede adelantar sin prueba (10 casos sobre copia temporal) | 3 s |
| `npm run check:superficie` | Que nada interno llega al despliegue | 1 s |
| `npm run check:enlaces` | Enlaces internos, pares ES/EN, sitemap y JSON-LD | 2 s |
| `npm run check:precios` | Que los precios «desde» de la web coinciden con `precios.json` | 1 s |
| `npm run check:og` | Que existen las imágenes para compartir (`assets/og-image*.png`) | 1 s |
| `npm run check:kb` | Que el asistente sabe exactamente lo que dice la web | 1 s |
| `npm run check:consentimiento` | Consentimiento y analítica solo en el dominio real y en orden | 1 s |
| `npm run check:demo` | Cómo se monta la demo de Finance en cada página | 1 s |
| `npm run check-instruments` | Referencias de instrumentos y composiciones | 1 s |
| `npm run qa:ds` | Reglas del Design System en 72 páginas × 5 anchos | 3 min |
| `npm run qa:solapes` | Texto pisado, cortado, botones pegados, secciones vacías, scroll horizontal y errores JS en 72 páginas × 8 anchos (320–1440), con meta-prueba | 8 min |
| `npm run qa:demo` | Las 25 pantallas de la demo en ES y EN (1440, 1024, 390, 320): contenido, idioma, solapes, errores. `-- --recorrido` añade una vuelta entera del recorrido automático | 3 min (+3 min) |
| `npm run qa:carga` | Qué ficheros se piden en cada aparato y cuándo: el campo de partículas solo con ratón, lo de más abajo en un hueco y siempre, y la página entera en los tres | 1 min |
| `npm run qa:dispositivos` | 13 páginas × 5 aparatos × 2 temas: desborde, texto visible, campos de formulario apagados, imágenes rotas, el cielo quieto donde toca y errores JS | 4 min |
| `npm run qa:formulario` | Los cuatro pasos del formulario de contacto rellenados de verdad en 6 aparatos × 2 temas × ES/EN. No envía nada | 2 min |

### Por qué `qa:dispositivos` y `qa:formulario` miran otra cosa

Las demás pruebas miran **anchos de ventana**. Desde que el campo de partículas
se apaga con el puntero grueso, un iPad de 1024 px y una ventana de escritorio
de 1024 px **ya no son la misma web**, y hubo un fallo que lo demostró: una
regla sobre `.field` —que es a la vez el campo de partículas y el campo de un
formulario— dejó todos los campos en `display:none` en cuanto el puntero era
grueso. En un iPad no se podía escribir nada en el formulario de contacto.

No lo cazó nada: `qa:solapes` mira anchos, no dedos; axe no incumple nada con
un campo oculto; y `check:tema` vigilaba ese choque de nombres en `tema.css`
pero no en `dcp7.css`. Ahora lo vigilan las tres: la regla de nombres está en
`check:tema` para los dos ficheros, `qa:formulario` escribe de verdad en cada
campo con dedo y con ratón, y `qa:dispositivos` comprueba en cada carga que no
hay ningún campo del paso activo apagado.

`npm run sync-content` regenera lo derivado (estado de producto, demo en
inglés, precios, imágenes para compartir, `?v=` de los estáticos y base de
conocimiento) y va antes de
cualquier commit que toque contenido.

Fuera del repositorio, en la entrega de cada ronda, se pasan además
accesibilidad con axe-core (WCAG 2.2 AA) **con ratón y con dedo** —las dos
pasadas, porque el árbol de la página no es el mismo—, impresión de las 68
páginas en A4, y el banco de rendimiento por dispositivo
(`docs/RENDIMIENTO-POR-DISPOSITIVO.md`).

## Contraste y velos: medir píxeles, no CSS

Un auditor que deduce el contraste del CSS se rinde en cuanto un antepasado
tiene degradado —y aquí casi todas las tarjetas lo tienen—, y no ve nada de
lo que se pinta ENCIMA del texto: los velos llevan `pointer-events:none`, así
que tampoco los encuentra el hit-testing. Dos fallos reales se colaron por
ahí (el velo del esquema sobre el titular de la portada y el filtro de
`.field` sobre los formularios en claro), y los dos se encontraron igual:
comparando píxeles.

El procedimiento, cuando se sospeche de una zona:

1. Se cine el texto con `Range.getClientRects()` (la caja del elemento sobra
   por los lados y falsea la medida).
2. Dentro de esa caja: mediana = fondo, extremo 12 % = tinta, y de ahí el
   contraste real.
3. Para saber si algo se pinta encima, se apaga SOLO ese velo
   (`[data-velo="…"]::before{background:none}`) y se mira si los glifos
   recuperan luz.

`npm run check:tema` deja cerrada la puerta del segundo fallo: falla si vuelve
una regla sobre `.field` a secas, porque `.field` es a la vez el campo de
partículas y el campo de un formulario.
