---
name: D-Code Partners · v9 mínima
version: 9.1
updated: 2026-10-16
colors:
  ground: "#F4F4F0"     # fondo de todas las páginas
  field: "#E7E7E1"      # superficies: formulario, etiquetas, fondo de imágenes
  ink: "#121211"        # texto y barras de separación
  ink-2: "#57574F"      # texto secundario
  blue: "#0A5CF5"       # el único acento: botones, pieza azul de la marca, estado
  blue-2: "#0849C4"     # hover del azul
  night: "#121211"      # pie de página
  on-night: "#F4F4F0"
typography:
  sans: "Schibsted Grotesk (OFL), 400–900"   # títulos, botones, navegación, etiquetas
  serif: "Newsreader (OFL), 200–800"         # texto corrido y frases de apoyo
  h1-home: "clamp(2.7rem, 7.6vw, 8.6rem) / 800 / -0.055em / 0.9"
  h1-page: "clamp(2.6rem, 6.4vw, 7.2rem) / 800 / -0.055em / 0.92"
  row-title: "clamp(1.7rem, 2.9vw, 3rem) / 760 / -0.04em"
  sub: "clamp(1.25rem, 1.75vw, 1.7rem) serif / 1.3"
  body: "1.1875rem serif / 1.5"
spacing:
  gutter: "clamp(18px, 3vw, 44px)"
  max-width: 1440px
  section: "clamp(104px, 11vw, 196px)"
  grid: "12 columnas; gap clamp(16px, 2vw, 32px)"
radius: 4px
rules: 3px de tinta (nunca líneas finas)
---

# D-Code Partners — sistema de diseño (versión mínima)

## 1. Idea

Poquísima información, directa y que se entienda. Cada bloque dice una sola cosa.
El visitante no necesita saber de tecnología: lee un problema cotidiano y lo que
pasa cuando un sistema lo hace solo.

## 2. Estructura de página

1. **Cabecera** (`.mh` en portada, `.mp` en el resto): un título, una frase y un botón.
2. **Bloques** (`.ms`): el título del bloque a la izquierda (columnas 1–3), el
   contenido a la derecha (5–12). En tableta y teléfono, uno encima del otro.
3. **Cierre** (`.me`): «¿Hablamos?», una frase, el botón y tres garantías.
4. **Pie** oscuro con contacto, un único listado de enlaces y la marca en grande.

Como máximo cinco bloques por página. Lo que sobra va a su propia página, enlazada.

## 3. Piezas

| Pieza | Clase | Uso |
|---|---|---|
| Filas | `.mq` (`.mq--s` pequeña) | Lista de cosas con título, una línea y enlace o etiqueta de estado |
| Pasos | `.mc` (`--n` columnas) | Proceso de 3–4 pasos, el último marcado en azul |
| Antes / después | `.ad` | Lo que pasa hoy frente a lo que hace el sistema, fila a fila |
| Figura | `.mfig` | Capturas reales de D-Code Finance (demo con datos ficticios) |
| Personas | `.mper` | Los dos fundadores, con su foto real |
| Etiqueta | `.mp-chip`, `.mq-tag` | Estado real: Disponible, En validación, Activo… |

## 4. Reglas de la casa

- Un solo acento: el azul de la pieza azul de la marca. Sin degradados ni sombras en reposo.
- Sin etiquetas pequeñas encima de los títulos, sin numeración decorativa, sin monoespaciada.
- Separadores de 3px de tinta; nada de líneas finas.
- Títulos de dos líneas como máximo en escritorio.
- Texto honesto: todas las frases salen de lo que D-Code ya publica; nada de cifras,
  clientes, testimonios ni resultados inventados.

## 5. Movimiento

- La marca se monta al cargar la portada: las piezas encajan en la D y la azul llega la última.
- Los bloques aparecen al hacer scroll (opacidad y 24px), escalonados 75ms.
- Con `prefers-reduced-motion`, todo aparece quieto.

## 6. Funcionalidad que no se toca

- Asistente (`#chat-widget`, `assets/js/main.js`).
- Formulario de contacto en 4 pasos (`#contact-form`, Turnstile, webhook de n8n y respaldo).
- Reserva con Cal.com (`#booking-cta-btn`, espacio `reunion-30min`).
- `<head>` de producción: SEO, hreflang, Open Graph, JSON-LD, CookieYes y GA4.

## 7. Generación

Las páginas se generan con `python3 scripts/v9/build.py` (sin argumentos: todo, ES y EN).
Los textos se leen del commit de producción `9994abe` y de `scripts/v9/datos.py`.
