# Rediseño inmersivo de dcodepartners.com — «El mundo»

**Fecha:** 2 de octubre de 2026 · **Rama:** `redesign/immersive-3d-v2` (sale de `seo/google-optimization`, commit `af0a277`) · **Último commit:** `ba2b829`
**Estado:** subido a GitHub y desplegado solo en Preview. No hay merge, no se ha tocado `main` ni producción.
**Preview:** https://dcodepartners-web-git-redesign-immersive-3d-v2-d-code-partners.vercel.app

Cómo leer este informe: lo que lleva un número está medido en este entorno y digo con qué. Lo que no he podido medir está marcado como **NO MEDIDO**. Trabajo en un contenedor sin tarjeta gráfica: todo el 3D se ha probado con render por software, así que la fluidez real en un ordenador y en un teléfono es lo primero que tienes que comprobar tú.

---

## 1. URL de preview

- Portada en español: https://dcodepartners-web-git-redesign-immersive-3d-v2-d-code-partners.vercel.app/
- Portada en inglés: https://dcodepartners-web-git-redesign-immersive-3d-v2-d-code-partners.vercel.app/en/
- Versión sin movimiento (la que ve quien tiene «reducir movimiento», ahorro de datos o un navegador sin WebGL2): https://dcodepartners-web-git-redesign-immersive-3d-v2-d-code-partners.vercel.app/?quieta
- Cabeceras interiores con escena: https://dcodepartners-web-git-redesign-immersive-3d-v2-d-code-partners.vercel.app/sistema-financiero · https://dcodepartners-web-git-redesign-immersive-3d-v2-d-code-partners.vercel.app/servicios/agentes-de-ia · https://dcodepartners-web-git-redesign-immersive-3d-v2-d-code-partners.vercel.app/precios

Es la dirección fija de la rama: siempre enseña el último commit. La Preview está protegida con el inicio de sesión del equipo de Vercel, igual que las anteriores. Despliegue de este commit: https://dcodepartners-andkc1b1z-d-code-partners.vercel.app

## 2. Concepto creativo

**Una sala, un material, un gesto.**

D-Code no vende herramientas: ordena el trabajo de una empresa. Así que la web no enseña «tecnología» (ni redes de puntos, ni esferas, ni partículas): enseña el trabajo de una empresa tal como es, que son **documentos**. Facturas, presupuestos, correos, hojas de cálculo, albaranes, notas de «¡llamar!».

- **El material es el papel.** Unas 2.400 hojas con contenido legible, dibujadas una a una. Es lo único que hay en escena.
- **La sala es oscura y está iluminada por un solo foco**, como un plató. Blanco, negro y grises: la identidad que ya tenía la web.
- **El único color es el píxel azul de la marca** (el del logotipo). En la web significa una cosa concreta: «esto ya lo ha leído el sistema». Aparece como sello en cada hoja procesada.
- **El gesto es poner orden.** Al principio las hojas vuelan en una tormenta; al deslizar, una ola de orden las va colocando hasta que la empresa entera se ve como un plano.

La frase que tiene que quedar es la que pediste: primero «¿qué acabo de ver?» (la tormenta y el título en calma en medio) y luego «ahora entiendo qué hace esta empresa» (las mismas hojas, ordenadas, leídas y trabajando solas).

## 3. Historia de la experiencia

Nueve capítulos. Cada uno cambia la escena y cambia lo que significa; el texto de venta está siempre en HTML, encima.

| N.º | Capítulo | Qué se ve | Qué cuenta | Qué puede hacer el visitante |
|---|---|---|---|---|
| 0 | **El claro** (portada) | Una tormenta de documentos; alrededor del título se abre un hueco en calma. | «Sistemas inteligentes para empresas»: la calma en mitad del desorden. | Mover el cursor o el dedo aparta las hojas como un viento. Dos botones: reservar llamada y ver cómo funciona. |
| 1 | **Hoy** | El tiempo casi se para. Cuatro documentos quedan delante, cada uno con su problema escrito al lado. | El presupuesto que nadie envió, la factura tecleada dos veces, el cliente sin respuesta, la hoja que solo entiende una persona. | **Mantener pulsado**: las hojas se ordenan en un muro, cada una en su casilla. Al soltar vuelven a caer. Es el juguete de la web y es exactamente la oferta. |
| 2 | **El sistema** | Cinco carriles, uno por área. Las hojas entran torcidas, pasan por un pórtico, salen alineadas y se clasifican. | Ventas, clientes, operaciones, finanzas y dirección en un solo sistema. | Elegir un área ilumina su carril y cambia el texto. |
| 3 | **La inteligencia** | El pórtico de cerca: una luz recorre la hoja y deja el píxel azul. | La IA lee cada documento y saca los datos; una persona revisa lo que no está claro. | — |
| 4 | **La automatización** | La misma sala de noche, a las 03:12. Los carriles siguen moviéndose. | El trabajo repetitivo sigue cuando no hay nadie. | — |
| 5 | **D-Code Finance** | Una factura a tamaño real. | Documento → lectura → datos → registro → respuesta. | **Pasar la factura por Finance**: la luz la recorre, cada dato salta de la hoja al registro, y luego se le puede preguntar («¿qué pagos vencen en octubre?»). |
| 6 | **El resultado** | La sala vista desde arriba: la empresa como un plano. | Productos y precios reales, los mismos que ya estaban publicados. | Enlaces a cada producto y a precios. |
| 7 | **Tócalo** | Las demos que ya existían (asistente, Finance, etc.), con la sala atenuada detrás. | Que no es un decorado: se puede probar. | Las demos funcionan igual que antes. |
| 8 | **El tuyo** | Una sola hoja en blanco con el píxel azul. | «Construyamos el tuyo.» | Reservar la llamada. |

Sobre tus dos condiciones de ayer: **se desliza poco** (nueve pantallas; no hay tramos de scroll secuestrado ni secciones «pegadas») y **no hay figuras figurativas** (nadie, ni manos, ni robots: solo papel, mesas y luz).

## 4. Referencias estudiadas

Estudiadas a través de sus casos de estudio y artículos técnicos publicados. No he podido ejecutar los sitios (no hay tarjeta gráfica), así que nada de esto es una observación directa de la experiencia funcionando.

| Proyecto | Estudio | Qué aporta |
|---|---|---|
| Igloo Inc (Site of the Year de Awwwards) | Abeto | Tres capítulos, un material (hielo) y un efecto firma repetido en todo. |
| Lando Norris (Site of the Year 2025) | OFF+BRAND | Un único momento memorable sobre un sitio por lo demás convencional. |
| Oryzo AI | Lusion | Esqueleto de tienda normal con un objeto siempre en el centro; cuatro colores; un solo tipo de letra. |
| Shopify Editions Spring '26 | Shopify | Todo el contenido en el DOM; el 3D solo pone atmósfera. Cuatro niveles de calidad, con uno estático. |
| Cartier Watches & Wonders | Immersive Garden | «Salas» con una composición cada una, en vez de un vuelo continuo. |
| Web propia de Immersive Garden | Immersive Garden | La inmersión en la portada; el contenido a un clic. |
| Portfolio de Bruno Simon | Bruno Simon | Lo que cuesta un mundo interactivo completo (un año). En móvil quita el desenfoque. |
| **Vectr** | Utsubo | El más parecido a D-Code (B2B, IA): la posición del scroll es la fase del proceso. Publica sus notas de Lighthouse. |
| IVRESS | Utsubo | Oscuridad usada como contención, no como «modo oscuro». |
| Noomo Labs | Noomo | Un material (vidrio) y nada de posproceso en la página principal. |
| The Monolith Project | Ethan Chiu | Un juego pequeño y con nombre de transiciones. |
| Coastal World | Merci-Michel | Caso B2B raro: explicar un servicio bancario con un mundo. |

**No verificado:** makemepulse (solo encontré un caso de 2020), Active Theory (la fuente principal no cargó; lo que sé es de una fuente secundaria), Unseen Studio (sin datos de rendimiento ni móvil). Webby Awards, CSS Design Awards y el escaparate del foro de Three.js no se estudiaron directamente. Las fuentes están al final.

## 5. Qué he aprendido

1. **Un material y un efecto, no un catálogo de efectos.** Los sitios premiados eligen una metáfora física y la repiten. Aquí: papel y la ola de orden.
2. **La posición del scroll tiene que ser la fase del proceso** (Vectr). Aquí cada capítulo es un paso de lo que hace D-Code.
3. **Todo el texto de venta, en HTML** (Shopify). Es lo que salva el SEO y la accesibilidad sin esfuerzo extra.
4. **Pocos capítulos y scroll nativo.** El secuestro del scroll es lo que más penalizan los jurados y lo que más molesta.
5. **Un juguete de verdad, ligado a la oferta**, y el resto pasivo. Aquí: mantener pulsado para ordenar, y pasar la factura por Finance.
6. **Los niveles de calidad se diseñan primero**, incluido uno estático. La mayoría de sitios premiados no documenta qué hacen con «reducir movimiento»: hacerlo bien es una forma de destacar.
7. **Nadie publica datos de conversión.** Que una web inmersiva convierta mejor no está demostrado por ninguna fuente. Por eso los botones, los precios y el formulario siguen exactamente donde estaban.
8. **Lo que hace perder es la usabilidad**: 18 fps en un Android medio, seis segundos hasta ver algo, texto ilegible. Es el riesgo real de este rediseño y es lo que queda por medir (punto 10).

## 6. Qué he creado específicamente para D-Code

Nada de esto viene de una plantilla ni de una librería:

- **El motor «mundo»**: un motor 3D propio en WebGL2, escrito para esta web (unas 42 KB, 16,8 KB comprimido).
- **Dieciséis documentos de empresa** dibujados por código en español y en inglés: factura, presupuesto, correo, chat, hoja de cálculo, calendario, albarán, contrato, ficha de cliente, nota, extracto, formulario, gráfico, pedido, informe y hoja en blanco.
- **La tormenta, el muro, los carriles, el pórtico de lectura, la noche, la factura y el plano**: nueve estados de la misma sala, con sus cámaras para pantalla horizontal y vertical.
- **El «mantén pulsado»**: el visitante ordena la empresa con el dedo.
- **La demo de Finance dentro de la escena**: los datos salen de su sitio exacto en la factura 3D y vuelan al registro en HTML.
- **El píxel azul como sello** de «procesado por el sistema».
- **La sala en las cabeceras interiores**: en ordenador, cada página abre con el rincón que le corresponde (Finance con la factura, agentes de IA con el pórtico, automatizaciones con la noche, cada departamento con su carril iluminado, precios con el plano, contacto con la hoja en blanco, el blog con la tormenta).
- **El rodaje del Reel**: un sistema que graba la web cuadro a cuadro con el tiempo detenido (punto 17).

## 7. Arquitectura técnica

```
scripts/v3/mundo/          el motor (fuente)
  mat.js                   matrices y cuaterniones
  atlas.js                 dibuja los 16 documentos en un lienzo 2D (el «atlas»)
  sombras.js               los programas de la tarjeta gráfica (hojas, sombras, suelo, mesas, bruma)
  mundo.js                 la sala: simulación, cámaras, luz, capítulos
scripts/v3/portada.mjs     genera el <main> de las dos portadas (ES y EN) con todos sus textos
scripts/v3/construir.mjs   empaqueta el motor, genera las portadas, versiona los recursos, pasa el SEO y el sitemap
scripts/v3/fotos.mjs       hace las fotos fijas de cada capítulo (para la versión sin movimiento)
scripts/v3/reel/           rodaje y montaje del Reel
assets/v2/js/mundo.js      el motor empaquetado (se carga solo si hace falta)
assets/v2/js/portada.js    el director de la portada: scroll → capítulo, demos, niveles de calidad
assets/v2/js/cabecera3d.js la sala en la cabecera de las páginas interiores
assets/v2/mundo.css        la maqueta de la portada
assets/v2/img/mundo/       16 fotos fijas (8 capítulos × horizontal y vertical)
```

Cómo funciona:

- **El HTML manda.** Las portadas son HTML completo, con sus nueve secciones, sus títulos, sus enlaces y sus botones. El lienzo 3D es un fondo fijo detrás, marcado como decorativo.
- **El scroll no se toca.** `portada.js` solo mira qué sección está en pantalla y le dice al motor a qué capítulo ir; el motor interpola cámara, luz y posición de cada hoja.
- **La tormenta es una función del tiempo**, no una simulación acumulada: se puede ir adelante y atrás sin que se descoloque nada.
- **Sin posproceso.** El desenfoque se calcula hoja a hoja, las sombras son proyecciones planas, el reflejo del suelo es un segundo dibujo en espejo y la bruma se calcula por rayos. Son unas pocas llamadas de dibujo por cuadro.
- **Carga diferida.** El motor no está en el HTML: se importa después de que la página ya se puede leer.
- **Niveles de calidad.** Estático (foto fija por capítulo) → móvil (650–900 hojas, sin reflejo, documentos a media resolución) → ordenador justo (1.500 hojas) → ordenador (2.400 hojas con reflejo). Si los cuadros tardan más de 30 ms, baja de nivel sola; se para cuando la pestaña no se ve.

## 8. Tecnologías

- **WebGL2 a mano, sin librerías.** No hay Three.js, ni GSAP, ni Lenis, ni nada nuevo en `package.json` para la web publicada.
- HTML, CSS y JavaScript del propio sitio (estático en Vercel, como antes).
- Canvas 2D para dibujar los documentos.
- Animaciones de interfaz con CSS y la API de animación del navegador.
- Para construir y probar (no se publican): esbuild, Playwright con Chromium, ffmpeg y Python con numpy para el sonido del Reel.

Por qué sin Three.js: la escena es un solo tipo de objeto repetido miles de veces. Con una librería general el peso se multiplicaba por diez y no ganaba nada. Si más adelante quieres modelos 3D de verdad (un producto, un edificio), entonces sí compensa.

## 9. Assets

**No he usado ningún recurso de terceros.** Ni modelos, ni texturas, ni fotos, ni vídeos, ni música, ni fuentes nuevas.

| Recurso | Origen | Licencia |
|---|---|---|
| Documentos de las hojas | Dibujados por código (`atlas.js`) | Propio |
| Fotos fijas de cada capítulo (16 archivos WebP, 409 KB en total) | Capturas del propio motor | Propio |
| Tipos de letra | Archivo y Martian Mono, los que ya usaba la web | Los que ya tenías |
| Logotipo y píxel azul | Los de la marca | Propio |
| Sonido del Reel | Generado por código | Propio |

Qué mejoraría con recursos que tendrías que darme tú: ver el punto 16.

## 10. Performance

**Medido** (tamaño de lo que se descarga, sobre los archivos del despliegue):

| Recurso | Tamaño | Comprimido (gzip) |
|---|---|---|
| HTML de la portada | 51,3 KB | 10,9 KB |
| `mundo.css` | 22,4 KB | 5,5 KB |
| `portada.js` | 13,1 KB | 4,7 KB |
| `mundo.js` (el motor entero) | 42,3 KB | 16,8 KB |
| `cabecera3d.js` (páginas interiores) | 4,6 KB | 2,0 KB |
| Foto fija de un capítulo (solo en la versión sin movimiento) | 7–74 KB cada una | — |

El 3D completo de la portada pesa **menos de 22 KB comprimidos** de JavaScript. No descarga modelos ni texturas: los documentos se dibujan en el navegador.

**NO MEDIDO** (y es lo importante):

- **Cuadros por segundo en un equipo real.** Aquí solo hay render por software (entre 0,7 y 11 s por cuadro según el tamaño), que no dice nada de una tarjeta gráfica. HIPÓTESIS: fluido en un portátil de los últimos cinco años y en un teléfono de gama media, porque son pocas llamadas de dibujo y la calidad baja sola. Hay que comprobarlo en tu ordenador, en tu teléfono y en un Android medio.
- **Core Web Vitals (LCP, INP, CLS)** con datos de campo o Lighthouse en dispositivo real.
- **Consumo de batería y temperatura** en móvil tras un minuto en la portada.

Riesgo conocido: el coste por cuadro depende de cuántas hojas desenfocadas se solapan (la tormenta de la portada es el peor caso). Si en móvil va justo, la palanca es bajar hojas y resolución en ese capítulo; está preparado (`calidad()`).

## 11. SEO preservado

La rama sale de la del SEO (`af0a277`) y conserva todo aquel trabajo.

| Comprobación | Resultado |
|---|---|
| `npm run qa:seo` (86 páginas, 72 indexables, sitemap con 72 URLs) | **0 fallos, 0 avisos** |
| `npm run check:enlaces` (6.286 enlaces y recursos internos, idiomas, sitemap, 76 JSON-LD) | Correcto |
| `<title>`, descripción, canónica, `hreflang`, datos estructurados de la portada | Los mismos que dejó la auditoría SEO |
| `<h1>` de la portada | «Sistemas inteligentes para empresas.» en HTML |
| Texto de los nueve capítulos, productos, precios y enlaces internos | En HTML, fuera del lienzo |
| Rutas | Ninguna cambia. No hay URL nuevas ni eliminadas. |

El lienzo no contiene ningún texto que no esté también en el HTML. Un buscador o un lector de pantalla ve una página normal y completa.

## 12. Responsive

- **Ordenador:** el texto ocupa una columna y la escena el resto; cada capítulo tiene su encuadre horizontal.
- **Teléfono:** no es la versión de ordenador encogida. Cada capítulo tiene su **cámara vertical** propia, la escena ocupa la parte alta y el texto la baja; menos hojas, sin reflejo y documentos a media resolución.
- **Táctil:** mantener pulsado ordena las hojas (con su aviso en pantalla); el dedo mueve el viento; las pestañas de áreas y los botones de Finance tienen tamaño de dedo.
- En teléfono, las cabeceras interiores **no** llevan escena: no hay sitio libre y taparía el título.

Probado en este entorno a 1440 × 900, 1280 × 800, 1280 × 720, 390 × 844 y 360 × 640, con render por software. **NO MEDIDO:** tabletas, pantallas ultrapanorámicas y Safari de iPhone real.

## 13. Accesibilidad

- **«Reducir movimiento»**: no se carga el motor. Cada capítulo muestra su foto fija y todo el contenido funciona igual (incluida la demo de Finance, que rellena el registro sin animación).
- **Sin WebGL2, con ahorro de datos o si el motor falla**: lo mismo, la versión con fotos.
- **Teclado**: todo lo interactivo es un botón o un enlace de verdad (pestañas de áreas, Finance, preguntas, demos). El lienzo no recibe el foco.
- **Lectores de pantalla**: el lienzo está marcado como decorativo; el registro de Finance y la respuesta se anuncian al cambiar.
- **Contraste**: el texto va siempre sobre un velo oscuro, no directamente sobre las hojas. En el teléfono reforcé el velo de la portada en esta pasada, porque el párrafo quedaba encima de papel gris.
- **Tema claro**: la portada mantiene la sala oscura (es su identidad); las páginas interiores en tema claro no montan la escena.

**NO MEDIDO:** auditoría con lector de pantalla real (VoiceOver, NVDA) y medición automática de contraste sobre el fondo en movimiento.

## 14. Tests

| Prueba | Resultado |
|---|---|
| `npm run qa:seo` | 0 fallos, 0 avisos |
| `npm run check:enlaces` | Correcto |
| `npm run check:textos` | 0 problemas |
| `npm run check:superficie` (que nada interno llegue al despliegue) | Correcto |
| Portada ES y EN, ordenador y teléfono, los nueve capítulos (capturas con Chromium) | Sin errores de consola |
| Versión sin movimiento y sin WebGL | Se ven las fotos, Finance funciona, pestañas con teclado |
| Tema claro | La portada sigue oscura; nada ilegible |
| Cabeceras interiores (7 tipos de página, ordenador) | Sin errores. La escena queda a la derecha del título; no se monta en teléfono, en tema claro ni con movimiento reducido. |
| Chat, demos de «Tócalo» y formulario de contacto | Presentes y sin errores de consola: el chat carga, «Tócalo» conserva sus 25 controles y el formulario de contacto sus 7 campos. No he enviado el formulario ni he hablado con el chat (no quiero generar contactos falsos). |

Ocho comprobaciones antiguas del repositorio (`check:chat`, `kb`, `precios`, `fichas`, `en-curso`, `estado`, `portada`, `tema`) **ya fallaban igual antes de empezar**, en la rama de partida. No las he tocado. `check:portada` y `check:tema` comprueban la portada anterior, así que habrá que reescribirlas si este rediseño se aprueba.

## 15. Problemas pendientes

| Prioridad | Problema | Impacto | Esfuerzo |
|---|---|---|---|
| **P1** | Fluidez real sin medir en equipos con tarjeta gráfica (ordenador, iPhone, Android medio). | Es la condición para publicar. | 30 min tuyos mirando la Preview; ajustes de 1–3 h según lo que salga. |
| **P1** | Core Web Vitals sin medir. | SEO y sensación de rapidez. | 1 h con Lighthouse en la Preview. |
| P2 | El capítulo de noche es el más plano de los nueve: poca diferencia de composición con el de los carriles. | Menos impacto en mitad del recorrido. | 2–4 h. |
| P2 | En teléfono, la tormenta de la portada queda detrás de un velo para que se lea el texto; el «claro» físico solo se aprecia bien en ordenador. | La primera impresión móvil es menos espectacular que la de ordenador. | 3–5 h (rediseñar la portada móvil con el título arriba y la tormenta abajo). |
| P2 | `check:portada` y `check:tema` describen la portada anterior. | Fallan (ya fallaban). | 1–2 h, cuando apruebes. |
| P3 | El proveedor de la factura de ejemplo («Suministros Arce, S.L.») es un nombre inventado; no he comprobado que no exista una empresa real con ese nombre. | Mínimo, pero prefiero que lo decidas tú. | 15 min + volver a rodar dos planos del Reel si cambia. |
| P3 | El sonido del Reel está medido pero no escuchado. | Puede no gustarte. | 5 min tuyos. |
| P3 | Sin probar en Safari real, tabletas ni con lector de pantalla. | Compatibilidad. | 1–2 h. |
| P3 | Los dos vídeos del Reel (60 MB) están dentro del repositorio, como pediste. No se despliegan, pero pesan en cada clonado. | Tamaño del repositorio. | 10 min si prefieres sacarlos a Drive. |
| P4 | Las páginas interiores en teléfono no tienen escena. | Coherencia de la experiencia. | 3–4 h si la quieres (habría que rehacer la cabecera móvil). |

## 16. Qué necesitaría de ti

Para aprobar:

1. **Abrir la Preview en tu ordenador y en tu teléfono** y decirme si va fluida. Es lo único que no puedo ver yo.
2. **Escuchar el Reel** y decirme si el sonido vale.
3. Decidir si el nombre del proveedor de la factura de ejemplo se queda.

Para subir un escalón (no es imprescindible; hoy todo es propio y no hay nada de licencia dudosa):

- **Documentos reales anonimizados** de D-Code o de un cliente que lo autorice (una factura, un presupuesto, un correo). Sustituirían a los genéricos y harían la escena más vuestra.
- **Un caso real con cifras** para el capítulo de resultado. No he inventado ninguna.
- Si algún día quieres modelos 3D de verdad: los modelos en formato glTF con textura PBR y licencia comercial clara. No hace falta para este concepto.
- **Música** para el Reel si prefieres una pista de la biblioteca de Instagram o una con licencia que ya tengas.

## 17. Vídeo final

| | |
|---|---|
| Archivo | `docs/reel/reel-dcode.mp4` |
| Sin texto | `docs/reel/reel-dcode-sin-texto.mp4` |
| Formato | 1080 × 1920 (9:16), 30 fps, H.264 + AAC |
| Duración | 40 s |
| Peso | 30,4 MB con rótulos · 30,3 MB sin texto (6 Mb/s) |

No es una grabación de pantalla: es la propia web dirigida plano a plano, con el tiempo detenido para que cada cuadro salga completo. Guion y rótulos, en `docs/reel/README.md`.

Estructura: 0–2,5 s gancho dentro de la tormenta · 2,5–6 s «esto no es un vídeo, es una página web» · 6–19 s el visitante desliza, mantiene pulsado y el caos se ordena · 19–25,5 s la IA lee y el sistema trabaja de noche · 25,5–34 s Finance en directo y la empresa como un plano · 34–40 s llamada a la acción.

Sonido: diseño sonoro propio generado por código, sin música ni muestras de terceros. Medido en el archivo final: −14,7 LUFS, pico −0,9 dB. **No lo he escuchado** (aquí no hay altavoces): necesita tu oído antes de publicar.

Segunda pasada sobre el vídeo. Monté una primera versión, la miré plano a plano con la pregunta «¿se pararía alguien que no conoce D-Code?» y rehíce esto:

- El plano de la portada se volvió a rodar: el párrafo no se leía sobre el papel (era el mismo fallo de la web en móvil; se arregló en la web y luego se rodó).
- El plano de Finance se volvió a rodar: al pulsar, el botón saltaba y el dedo se quedaba tocando el registro. Era un fallo real de la web; arreglado allí. Además quité la pregunta final: ocurría fuera de pantalla y en un segundo no se podía leer.
- «Esto no es un vídeo / Es una página web» tapaba los botones de la portada → arriba, y más grande.
- «Todo lo que ves funciona» tapaba la cabecera de la factura → entre la factura y el botón.
- El rótulo del cierre quedaba tachado por la línea del horizonte de la escena → recolocado bajo la línea; el botón falso «Escríbenos» pasó a ser una etiqueta con la dirección.
- El primer rótulo no se leía sobre el papel claro → velo oscuro detrás.
- Sin fundido de entrada: el primer cuadro ya es la tormenta.
- Curva de contraste suave en todo el vídeo (los negros del Reel son algo más profundos que los de la web).

Lo que sigue siendo lo más flojo del vídeo: el tramo 13,5–19 s es sobre todo texto de la web, y el plano de noche se mueve poco.

## 18. Copy del Reel

> Esto no es un vídeo. Es nuestra nueva web.
>
> Así llega el trabajo a casi cualquier empresa: facturas, correos, presupuestos y hojas de cálculo, cada uno por su lado. Al deslizar se ve cómo un sistema los lee, los ordena y sigue trabajando de madrugada.
>
> Todo lo que aparece funciona en el navegador, también en el móvil. Entra en dcodepartners.com, mantén pulsado sobre los documentos y pásale una factura a D-Code Finance.
>
> Si quieres una web así para tu empresa, o el sistema que hay detrás, escríbenos por mensaje directo.

**Ojo:** este texto invita a entrar en dcodepartners.com. Hoy la web nueva solo existe en Preview. O publicas el Reel después de pasarla a producción, o usas la variante que está en `docs/reel/README.md`.

## 19. CTA

- En pantalla: «¿Quieres una web así para tu empresa?» → «La construimos nosotros.» → la marca y «Escríbenos · dcodepartners.com».
- En el texto: «escríbenos por mensaje directo».

## 20. Cover del Reel

`docs/reel/reel-dcode-portada.jpg` (1080 × 1920). Es el muro de documentos ordenados (rodado sin el dedo), con el titular «Esto no es un vídeo. Es una web.» y la marca. Todo lo importante cabe en el recorte 4:5 de la cuadrícula del perfil.

---

## Crítica propia y segunda pasada

Primera versión (commit `22642f0`) y lo que cambié después de mirarla como la miraría una agencia:

- Las hojas parecían grises y lavadas → curva de tono, menos bruma, desenfoque que conserva la energía.
- Los cuatro documentos de «Hoy» salían borrosos → se colocan en el plano de enfoque de la cámara.
- No había nada que tocar de verdad → el «mantén pulsado» y el selector de áreas.
- El móvil era la escena de ordenador recortada → cámaras verticales propias.
- No había alternativa sin movimiento → fotos fijas por capítulo.

Esta pasada (commit `ba2b829`):

- En teléfono, el párrafo de la portada quedaba sobre papel gris → velo más amplio.
- Al pulsar «Pasar la factura por Finance» el registro crecía y el botón saltaba bajo el dedo → el registro enseña sus casillas vacías desde el principio.
- La etiqueta «Base imponible» de la factura se montaba con su importe → recolocada.
- Las páginas interiores no tenían nada de la sala → escena en la cabecera, en una ventana a la derecha que no pisa el título.

La prueba que pedías («si al apagar el WebGL la web es la misma pero más bonita, no has hecho el rediseño»): con el WebGL apagado se pierde la transformación, que es el argumento. Quedan nueve fotos y el texto. La página se entiende, pero ya no se *ve* lo que hace D-Code. Lo considero la respuesta correcta: el 3D aquí no decora, cuenta.

Lo que una agencia premium todavía me criticaría: el capítulo de noche, la portada móvil y que nadie lo ha visto aún a 60 cuadros por segundo.

## Fuentes de la investigación

- https://www.awwwards.com/igloo-inc-case-study.html
- https://www.awwwards.com/annual-awards/winners
- https://www.itsoffbrand.com/our-work/lando-norris
- https://blog.lusion.co/oryzo-bts-part-1-7-concept-and-creative-direction
- https://blog.lusion.co/oryzo-bts-part-2-7-3d-design-and-motion-graphics
- https://blog.lusion.co/oryzo-bts-part-3-7-website-ux-ui-and-illustrations
- https://tympanus.net/codrops/2026/06/26/engineering-the-web-experience-behind-shopifys-spring-26-edition-everywhere/
- https://www.awwwards.com/watches-wonders-immersive-experience-for-cartier.html
- https://www.awwwards.com/case-study-immersive-gardens-new-website.html
- https://www.awwwards.com/brunos-portfolio-case-study.html
- https://www.utsubo.com/blog/vectr-ai-startup-branding-case-study
- https://www.webgpu.com/showcase/ivress-utsubo-webgpu-story/
- https://www.utsubo.com/blog/award-winning-website-design-guide
- https://www.awwwards.com/noomo-labs-a-hub-for-cutting-edge-immersive-experiences.html
- https://tympanus.net/codrops/2025/11/29/building-the-monolith-composable-rendering-systems-for-a-13-scene-webgl-epic/
- https://mercimichel.medium.com/coastal-world-8f23b945823b
- https://tympanus.net/codrops/2026/07/20/the-craft-behind-memorable-digital-experiences-inside-unseen-studio/
- https://www.awwwards.com/about-evaluation/
- https://frontendchecklist.io/rules/accessibility/scrolljacking
