# DESIGN_ENGINEERING_AUDIT — dcodepartners.com

Rama `web/dcp-cowork4` · parte de `8ff5f5b` (rev. 3 + arreglo de 320 px) · 27–28/09/2026 · Production sin tocar.

Convenciones: lo medido lleva su número y cómo se midió. **NO MEDIDO** = no se pudo medir aquí. **HIPÓTESIS** = conjetura razonada.

---

## 1. Qué pasó y por qué hay una dirección nueva

| Iteración | Qué era | Veredicto de Dirección |
|---|---|---|
| rev. 3 (`564ea00`) | Bandeja 3D de aluminio con teclas de colores, configurador con mandos de cámara, el mismo objeto en portada, nueve pasos e interiores | «No me gusta»: 3D de videojuego, abstracto, repetido, decorativo, parece demo de WebGL |
| Correo neumático (esta rama, no publicada) | Tubos de vidrio y cápsulas en una pared de hormigón | «No tiene ningún sentido» para la esencia de D-Code |
| Piezas · secuencia de Blender (`a940d2c`) | Las piezas del logotipo se unen; 72 fotogramas renderizados que avanzan con el scroll | «Va súper mal»: sombras manchadas, corte en el borde de la imagen, poca fluidez (fotogramas que faltaban mientras cargaban) |
| **Piezas · tiempo real (esta entrega)** | La misma idea, pero en 3D de verdad (three.js): geometría que se mueve con el scroll, luz de estudio, sombra de contacto, responde al puntero | Pendiente de revisión |

Qué se sacó de los dos descartes: el 3D tiene que ser **la marca misma**, no una metáfora que haya que traducir, y el realismo tiene que ser el de un **render de producto**, no el de una escena de tiempo real.

---

## 2. Herramientas: qué se comprobó, qué se instaló y qué se usó

| Herramienta | Estado | Qué se hizo con ella |
|---|---|---|
| **UI/UX Pro Max** | Instalada en el entorno de trabajo (`nextlevelbuilder/ui-ux-pro-max-skill`, clonada; no toca la cuenta del usuario) | Se ejecutó `--design-system` para «AI automation software consultancy premium dark». Propuso **morado IA + Inter + brutalismo**: exactamente el tópico que el encargo prohíbe. **Descartada como dirección**; se usó su lista de comprobación (contraste 4,5:1, objetivos 44 px, reduced motion, 375/768/1024/1440) |
| **Impeccable** | Instalada (`pbakaus/impeccable`, skill en el entorno) | `context` (sin PRODUCT.md → se escribió `PRODUCT.md` con la verdad del producto, sin preguntar, como pidió Dirección) · `concept-seed` (sin red: tirada degradada, **sin retadores**, se declara) · `detect` sobre las páginas: **contraste 3,9:1 → corregido a 5,9:1**, rótulos de 10,6 px → 11,5 px, texto largo en mayúsculas → frase normal |
| **Emil Design Engineering** | Instalada (`emilkowalski/skills`) | Reglas de movimiento aplicadas: curvas propias (`--ease-out: cubic-bezier(.23,1,.32,1)`), UI < 300 ms, `scale(.97)` al pulsar, nada desde `scale(0)`, hover solo con `(hover:hover) and (pointer:fine)`, desenfoque para enmascarar fundidos (capítulos del héroe), `@starting-style`/transiciones interrumpibles |
| **Taste** | Instalada (`senlindesign/taste-skill`) | Requiere Playwright MCP; se usó su método (medir → patrón → decisión) con Playwright directo y el navegador del equipo del usuario sobre Lusion y GetLayers |
| **Motion** (`motion` 13.4.4) | Comprobada, **no añadida** | La web es HTML/CSS/JS sin framework; lo que haría Motion (muelle, scroll, apariciones) son ~60 líneas propias (`inicio.js`, `sitio.js`). Añadirla sumaba una dependencia sin mejora real. Regla del encargo: «no instales cosas por instalar» |
| **Motion AI Kit** (`motion-ai`) | Comprobado en npm, **no instalado** | Configura servidores MCP de pago (Motion+) y skills para React; no hay licencia ni React |
| **21st MCP** | **No configurado** (necesita API key) | No se inventó ninguna clave; no bloquea |
| Referencias | GetLayers y Lusion abiertas en el navegador del equipo; el resto de referencias (Active Theory, Resn, 14islands…) **NO MEDIDO** por tiempo | Lusion: el realismo sale de materiales y luz sobre objetos simples, con un solo color fuerte. GetLayers: grano, desenfoque y una sola frase grande |

Dependencias nuevas en producción: **ninguna**. Fuentes nuevas: Archivo y Martian Mono (OFL, autoalojadas, subconjunto latino: 80 KB + 34 KB).

---

## 3. Decisiones de diseño

- **Una idea por pantalla.** Portada = 4 frases + el 3D + lista de productos con precio + «tócalo» + «hablemos». Método, diagnóstico, garantías y casos viven en su página, enlazados.
- **Blanco y negro de verdad.** Oscuro `#000`/texto `#fff`; claro `#fff`/texto `#000`. El único color es el **píxel azul** del logotipo, que en el 3D es la IA. Los botones principales son el color contrario al fondo.
- **Tipografía:** Archivo (sans de grosor variable) a 560 con interletraje −0,045 em en el display; Martian Mono estrecha para rótulos. Escala fluida: display 46→122 px, H1 40→90, H2 32→67, H3 19→24, texto 16, rótulos 11,5. Nada de Inter, nada de Instrument (la rev. 3 usaba Instrument Sans + Serif).
- **Espacio en cinco ritmos** (`--ritmo-compacto/normal/aire/drama`), siempre más aire encima de un título que debajo.
- **Sin tarjetas.** Productos, precios, pruebas y FAQ son filas con filete; el producto (Finance) se enseña como producto: captura real, grande, que abre la aplicación.
- **Interiores:** cabecera (migas, etiqueta, H1, entradilla) y un capítulo por cada H2 con el título fijo a la izquierda y el texto a la derecha; legales y artículos, una columna de 72 caracteres.

## 4. Decisiones 3D

| | |
|---|---|
| Qué representa | Las 10 piezas del logotipo (6 píxeles, 2 arcos, 1 barra y el píxel azul). Sueltas = áreas y herramientas que no se hablan. Unidas = el sistema. El píxel azul se enciende = la IA |
| Técnica | **3D en tiempo real** con three.js r186 (`scripts/v2/escena/piezas.js` → `assets/v2/js/piezas3d.js`, esbuild). Sustituye a la secuencia de 72 fotogramas de Blender |
| Por qué cambió | La secuencia pesaba 4,6 MB en escritorio, dependía de la red (si faltaban fotogramas se fundían dos lejanos y el movimiento iba a saltos) y su sombra se cortaba en el borde de la imagen. En tiempo real el scroll mueve geometría: cada fotograma se dibuja al momento y el lienzo ocupa toda la escena |
| Geometría | Cubos: `RoundedBoxGeometry` (radio 2,2 cm). Arcos: **barrido** de un perfil de cantos redondeados a lo largo de su eje (recta → cuarto de círculo → recta), con normales exactas y puntas redondeadas: sin facetas ni rayas |
| Materiales | Cerámica negra con barniz (`MeshPhysicalMaterial`, rugosidad 0,3, clearcoat 0,65) + micro-relieve procedural (mapa de normales generado en el navegador). Píxel azul con barniz y emisión que sube al final |
| Luz | Entorno de **estudio generado en el navegador** (caja oscura con seis cajas de luz → PMREM): los reflejos de las cajas de luz sobre la cerámica negra son lo que la hace parecer fotografiada. Sin HDR que descargar. Tono AgX |
| Sombra | **Sombra de contacto**: una cámara mira las piezas desde el suelo, su silueta (más oscura cuanto más cerca) se difumina dos veces. En oscuro, además, un charco de luz de foco en el suelo |
| Vida | Las piezas sueltas flotan y giran despacio; la luz del estudio se desliza por la cerámica con el scroll y el puntero; el logotipo montado se inclina un poco hacia el puntero |
| Encuadre | Desplazamiento del centro óptico (`setViewOffset`): a la derecha en ancho, arriba en móvil; zoom que acompaña al montaje |
| Rendimiento | Dibuja solo cuando algo cambia; se para fuera de pantalla y con la pestaña oculta; baja la resolución sola si no llega a ~50 fps. Sombra a 512 px (256 en móvil) |
| Peso | **148 KB gzip** todo el 3D (three incluido), frente a 4.575 KB de la secuencia en escritorio y 2.583 KB en móvil (medido) |
| Sin 3D | Movimiento reducido, sin WebGL o si falla: imagen del logotipo montado (render de Blender), que solo se descarga en ese caso |

No hay ningún otro objeto 3D en el sitio: el resto del peso lo llevan la tipografía y el producto real.

## 5. Motion

| Qué | Cómo | Por qué |
|---|---|---|
| Piezas | Geometría en tiempo real; muelle críticamente amortiguado (k=90) sobre el progreso del scroll; cada pieza con su retraso y curva quíntica | Sigue al dedo sin rebotar ni ir a saltos; nunca falta un fotograma |
| Puntero | La luz del estudio gira y el logotipo se inclina (suavizado exponencial) | La escena responde: es un objeto, no un vídeo |
| Capítulos | Opacidad + 16 px + desenfoque 6 px → 0, 520–620 ms, `ease-out` fuerte | El desenfoque une los dos estados (Emil) |
| Apariciones | Una vez, 700 ms, escalonado 60 ms | Solo lo que entra por primera vez |
| Botones | `scale(.97)` 160 ms | Respuesta al pulsar |
| Tema | View Transition de 420 ms | El cambio de tema como cambio de luz |
| Reducido | Sin fijar el héroe: pieza montada quieta y los tres capítulos en lista | `prefers-reduced-motion` y sin JS |

## 6. Rendimiento, SEO, accesibilidad, responsive

- Rendimiento: ver **PERFORMANCE_AUDIT.md** (portada en móvil lento: primer pintado 5,96 s → 1,06 s).
- SEO: ver **SEO_AUDIT.md** (84 páginas, 0 fallos).
- Accesibilidad: un H1 por página, jerarquía sin saltos, foco visible, `aria-live` en diagnóstico y formulario, diálogo nativo para las demos, contraste AA tras el detector, objetivos ≥ 40 px, menú móvil con foco atrapado y Escape.
- Responsive: capturas en 390 y 1440 sin desbordamiento horizontal (medido: `scrollWidth − innerWidth = 0` en todas las páginas capturadas).

## 7. Problemas de la Preview anterior que desaparecen

| Rev. 3 | Ahora |
|---|---|
| Objeto metálico repetido en portada, nueve pasos e interiores | Un único 3D, solo en la portada, que es la marca |
| Mandos de cámara, esferas de materiales, «arrastra para girar» | Nada que manejar: se entiende bajando |
| 11 hojas de estilo por página (~800 KB sin comprimir) | 2–3 hojas propias (dc.css + la de la página) |
| Portada de 20.600 px | 8.000 px |
| Demos montadas dentro de la portada | Páginas propias que se abren en un visor al pedirlas |
| Instrument Sans + Instrument Serif (compartidas con Sánchez Rubio) | Archivo + Martian Mono; Sánchez Rubio pasa a Caslon + Hanken |

## 8. Lo que queda abierto

- Las visualizaciones interactivas propias de cada departamento de la rev. 2/3 **no** pasan al sistema nuevo (eran decoración dentro de páginas de texto). El contenido está entero.
- La demo de D-Code OS conserva su aspecto propio (es el producto); el de Finance también.
- Retadores de la tirada de Impeccable: no hubo (sin red); se declara.
