# DESIGN_AUDIT — dcodepartners.com

Resumen para revisar el diseño. El detalle de herramientas, 3D, motion y rendimiento está en **DESIGN_ENGINEERING_AUDIT.md**.

## Principios
1. **La marca es el 3D.** Las piezas del logotipo, como objetos reales, cuentan lo que hace D-Code: unir y, al final, poner inteligencia.
2. **Blanco y negro.** Un solo color: el píxel azul (la IA).
3. **Poquísimo texto en la portada**; todo el contenido completo, en su página.
4. **El producto como producto**: Finance se enseña con su captura real y se abre.
5. **Nada inventado**: textos de producción, precios de `catalogo.json`, demos marcadas como ficticias.

## Tipografía
| Rol | Fuente | Tamaño | Grosor | Interlínea | Interletraje |
|---|---|---|---|---|---|
| Display | Archivo | clamp(46 px, 6,2 vw, 122 px) | 560 | 0,94 | −0,045 em |
| H1 | Archivo | clamp(40, 4,4 vw, 90) | 560 | 0,96 | −0,04 em |
| H2 | Archivo | clamp(32, 3 vw, 67) | 560 | 1 | −0,038 em |
| H3 | Archivo | clamp(19, 0,45 vw, 24) | 560 | 1,2 | −0,018 em |
| Entradilla | Archivo | clamp(17, 0,3 vw, 20) | 400 | 1,5 | 0 |
| Texto | Archivo | 16 px | 400 | 1,6 | 0 |
| Rótulo / dato | Martian Mono estrecha (82 %) | 11,5 px / 12,5 px | 520 / 460 | 1,4 | 0,09 em / 0,03 em, mayúsculas |
| Navegación / botones | Archivo | 15 px | 540 | 1 | −0,005 em |

## Espacio
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 144 · 200 px, y cinco ritmos de sección (compacto 48–80, normal 80–140, aire 112–220, drama 140–280). Márgenes laterales 20–72 px; rejilla de 12 columnas hasta 1.440 px.

## Revisión anti-«hecho por IA» (resultado)
| Busca | Resultado |
|---|---|
| Tarjetas repetidas / cards dentro de cards | Ninguna: filas con filete |
| Iconos en círculos, gradientes, glass | Ninguno (el visor usa `backdrop-filter` solo en el fondo del diálogo) |
| Todo centrado / mismo padding | Composición a la izquierda y asimétrica; cinco ritmos |
| CTA repetidos | Uno por pantalla: «Hablemos» / «Reservar una llamada» |
| Mismo 3D repetido | Un solo 3D, solo en la portada |
| Fuentes por defecto (Inter, Instrument, Space Grotesk…) | No se usan en el sitio (solo dentro de las demos de producto, que son el producto) |
| Detector de Impeccable | Contraste y tamaños corregidos; quedan filetes «a ras» de listas (decisión: son reglas de tabla) y rótulos cortos en mayúsculas (decisión) |
