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

`npm run sync-content` regenera lo derivado (estado de producto, demo en
inglés, precios, imágenes para compartir, `?v=` de los estáticos y base de
conocimiento) y va antes de
cualquier commit que toque contenido.

Fuera del repositorio, en la entrega de cada ronda, se pasan además
accesibilidad con axe-core (WCAG 2.2 AA), impresión de las 68 páginas en A4,
navegación y formulario de contacto sin envío, y rendimiento de laboratorio.

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
