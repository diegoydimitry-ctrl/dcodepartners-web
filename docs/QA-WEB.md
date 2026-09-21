# Pruebas de la web

Todas se ejecutan en local, sin red ni secretos. Las de navegador levantan el
sitio como lo sirve Vercel y bloquean cualquier petición a terceros.

| Orden | Qué comprueba | Tiempo aprox. |
|---|---|---|
| `npm run check:estado` | Estado de VERI\*FACTU y conciliación: prueba por estado, regiones generadas al día, ninguna afirmación prohibida en lo publicado (con meta-prueba) | 1 s |
| `npm run test:estado` | Que el estado no se puede adelantar sin prueba (10 casos sobre copia temporal) | 3 s |
| `npm run check:superficie` | Que nada interno llega al despliegue | 1 s |
| `npm run check:enlaces` | Enlaces internos, pares ES/EN, sitemap y JSON-LD | 2 s |
| `npm run check:kb` | Que el asistente sabe exactamente lo que dice la web | 1 s |
| `npm run check:consentimiento` | Consentimiento y analítica solo en el dominio real y en orden | 1 s |
| `npm run check:demo` | Cómo se monta la demo de Finance en cada página | 1 s |
| `npm run check-instruments` | Referencias de instrumentos y composiciones | 1 s |
| `npm run qa:ds` | Reglas del Design System en 72 páginas × 5 anchos | 3 min |
| `npm run qa:solapes` | Texto pisado, cortado, botones pegados, secciones vacías, scroll horizontal y errores JS en 72 páginas × 8 anchos (320–1440), con meta-prueba | 8 min |
| `npm run qa:demo` | Las 25 pantallas de la demo en ES y EN (1440, 1024, 390, 320): contenido, idioma, solapes, errores. `-- --recorrido` añade una vuelta entera del recorrido automático | 3 min (+3 min) |

`npm run sync-content` regenera lo derivado (estado de producto, demo en
inglés, `?v=` de los estáticos y base de conocimiento) y va antes de
cualquier commit que toque contenido.

Fuera del repositorio, en la entrega de cada ronda, se pasan además
accesibilidad con axe-core (WCAG 2.2 AA), impresión de las 68 páginas en A4,
navegación y formulario de contacto sin envío, y rendimiento de laboratorio.
