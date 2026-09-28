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

### 4.1 ¿Más 3D? Evaluación del 28/09/2026 (brief de las 11:30)
Pregunta para cada candidato: «¿Qué explica este 3D que una sección normal no explica igual de bien?». Si la respuesta es «nada», no entra («prefiero 2D excelente antes que 3D mediocre»).

| Candidato | Qué contaría | Veredicto | Por qué |
|---|---|---|---|
| **Logotipo en piezas** (portada) | Herramientas sueltas → sistema → IA | **Se queda** (ya existía) | Es la tesis de la marca contada con un objeto; 60 fps, 141 KB, se para fuera de pantalla |
| Factura de papel escaneada en 3D (demo Finance) | Papel → datos | **Descartado** | Lo que importa es la transformación (hoja → fila del libro → la que no cuadra), y en 2D se lee mejor: el texto es nítido y comparable. En 3D el papel sería el protagonista y los datos, secundarios. Coste: +1 escena, texturas de papel, y el chunk de three.js en una sección que hoy pesa 9,8 KB de JS |
| Red de herramientas en 3D (D-Code OS) | Todo conectado a un centro | **Descartado** | Un grafo en 3D es la «geometría flotante» que el brief prohíbe; en 2D (SVG + pulsos que viajan al centro) se entiende a la primera y lleva la actividad real al lado |
| Oficina/taller en 3D como escenario de las demos | Contexto | **Descartado** | Decorado sin información; riesgo de parecer demo técnica de three.js |

Resultado: **una sola pieza 3D en todo el sitio**, con función narrativa; las cinco demos son 2D de producto.

**Rendimiento de las demos (MEDIDO, 28/09, Playwright, 390 px, CPU ×4):** recorrer 4 demos completas = 0 *long tasks*, intervalo entre fotogramas p50 16,7 ms · p95 16,7 ms · p99 16,8 ms (60 fps), ningún fotograma > 50 ms. Peso: `demos.js` 9,8 KB gzip + `demos.css` 4,5 KB gzip, **fuera del camino crítico** (CSS en reposo tras `load`, JS cuando la sección se acerca). FCP/LCP de la portada sin cambios (1.088 ms frente a 1.072–1.092 ms antes). Con movimiento reducido: mismos pasos sin animación. Móvil real y GPU integrada: NO MEDIDO.

## 4 ter. Demos de la portada (28/09/2026)
Sustituyen a «captura de Finance + cinco botones». Cada una, un producto con identidad propia y datos verosímiles, en cinco tiempos visibles (Contexto · Problema · Tú · El sistema · Resultado):

| Demo | Empresa ficticia | Tú haces | El sistema hace | Resultado |
|---|---|---|---|---|
| Finance | Talleres Norte (taller, 14 personas) | Sueltas 23 facturas; revisas la única que no cuadra (IVA 10 % vs 21 %) | Lee cada hoja, la registra, marca la anómala; al corregir recalcula el total (1.240 → 1.364 €) | 23 facturas en 38 s, tesorería al día |
| Comercial | Alba Interiorismo | Dejas entrar un lead del viernes 18:40; apruebas la respuesta | Clasifica, asigna a quien tiene menos carga, redacta con huecos reales de su agenda | 1 minuto frente a 2 días hábiles |
| Operaciones | Climatec (8 técnicos) | Aceptas el presupuesto P-118; simulas un retraso del proveedor | Planifica la semana sin solapes; ve el retraso el lunes, mueve la instalación y avisa al cliente | Planificado en 3 s; retraso resuelto 2 días antes |
| Atención | Clínica Sonrisa, sábado 22:15 | Eliges la pregunta del paciente | Responde con la agenda y las tarifas reales; reserva; lo delicado lo pasa a recepción | Respondido en segundos; lo sensible, a una persona |
| D-Code OS | La empresa entera | Conectas; preguntas qué ha pasado hoy | Recibe lo que pasa en 7 herramientas, con su rastro; escribe el parte del día | Todo en un sitio, con quién/cuándo/por qué |

Lenguaje: blanco y negro; lo que hace **el sistema** va en azul; lo que haces **tú**, con el botón principal. Todo el texto está en el HTML (indexable y legible sin JS). Pestañas ARIA con teclado; «Otra vez» reinicia; en móvil y tableta, texto → lienzo → mandos para ver lo que pasa al pulsar. «Abrir la aplicación completa» mantiene el visor anterior.

## 4 quater. Ronda del 28/09 (tarde): responsive por formato, webs de ejemplo en 3D, demo de lubricantes

> Visqa (lubricantes) y su demo de Finance se retiraron en la ronda siguiente: ver §4 quinquies (taller Brío).

Brief: «misma web + mucha mejor experiencia + mejores demos + responsive profesional». Lo que funciona en PC y empeora en el móvil **no se muestra igual en el móvil**.

### Responsive: una composición por formato
| Formato | Qué cambia |
|---|---|
| Teléfono (≤ 640 px) | Las cinco demos usan un renderizador propio, vertical y compacto (cifra grande, lista corta, barra de 5 tiempos), no la maqueta de escritorio encogida. Capítulos largos plegados con «Seguir leyendo» (solo si miden ≥ 1,5 pantallas). Tablas de ≥ 3 columnas → fichas. Planes → resumen en la pregunta y detalle al abrir. Pie en acordeón. Chat en 44 px que se aparta al bajar y vuelve al subir |
| Tableta (641–1023 px) | Demos a una columna con lienzo de 480 px (el de Comercial se cortaba a 420). Webs de ejemplo en carrusel con menos giro |
| Escritorio | Sin cambios de identidad |

`/sistema-financiero` en móvil: 16.908 px → 10.757 px de alto.

### «Cuatro webs de verdad. Entra en ellas.» (sustituye a «Cuatro ejemplos», las 4 capturas planas)
- Cuatro webs de empresas **ficticias**, cada una con su identidad (tipografía, color, composición): **Vandria Hogar** (inmobiliaria, Costa del Sol), **Orbe** (restaurante), **Visqa Lubricantes** (fabricante de lubricantes técnicos, Avilés; sustituye a la empresa de talleres) y **Clínica Sonrisa**. Ninguna marca real.
- Escritorio: escenario CSS 3D (perspectiva, profundidad, luz de cristal que sigue al puntero, reflejo en el suelo). La elegida, al frente y **usable**: se baja, se navega (ficha, catálogo, volver), se reserva mesa o cita, se usa el buscador técnico. Las otras, a los lados e inertes.
- Por qué CSS 3D y no WebGL: el texto de cada web se lee nítido y funciona (enlaces, formularios, teclado, lector de pantalla); WebGL obligaría a pintar las webs como texturas.
- Tableta: carrusel con menos profundidad. Teléfono: **sin 3D**, marcos de teléfono en fila (scroll-snap), cada web se maqueta sola a ese ancho (container queries).
- Pantalla completa: la web elegida en un `<dialog>` a todo el ancho (sin ids repetidos en la copia).
- Imágenes: renderizadas por D-Code en Blender (`scripts/v2/renders/`): la gama de Visqa y su garrafa de 5 L, la mesa de Orbe y la casa de Vandria de día (exterior, salón y cocina). 6 WebP, 162 KB en total, pedidas solo al acercarse.
- Carga: la hoja `webs3d.css` llega sin bloquear (`media="print"` que se activa al acercarse) y el alto de la sección se reserva en `interior.css` → CLS 0. Medido en `/servicios/paginas-web` (390 px, CPU ×4, 4G lenta): con la hoja bloqueante, FCP 1.372 ms / LCP 2.300 ms; **diferida, FCP 1.016 ms / LCP 1.384 ms / load 1.409 ms** (antes de esta sección: 928 / 1.496 / 1.391 ms).
- FPS del cambio de ventana en GPU real: **NO MEDIDO** (el panel del navegador del equipo estaba oculto: `requestAnimationFrame` detenido). HIPÓTESIS: son transformaciones y opacidad de 4 capas compuestas, sin pintar; deberían ir a la frecuencia de la pantalla.

### Demo Finance: Visqa Lubricantes
La demo de Finance usa ahora a Visqa: 23 facturas de proveedor (aceite base, aditivos, envases, portes). La que hay que revisar es un porte con IVA al 10 % (el transporte de mercancías va al 21 %); al corregirla, 1.240 € → 1.364 €.

### Enlaces
Las anclas de la web anterior (`#planes`, `#verifactu`, `#conciliacion`, `#demo`, `/#sistemas`, `#sistemas-finance`, `#diagnostico`) se conservan en los títulos nuevos o llevan a su página: `check:enlaces` pasa de 19 avisos a **0**.

### QA de esta ronda
| Prueba | Resultado |
|---|---|
| Solapes (texto que se pisa, bajo la cabecera, desbordamiento) | **0** en 70 rutas × 9 anchos (375, 390, 430, 768, 820, 1024, 1280, 1440, 1920). El detector ahora descarta lo recortado por un contenedor con scroll y las ventanas inertes |
| axe WCAG 2.1 AA | 0 tras corregir 2 contrastes de las webs de ejemplo (botón de Orbe 3,9 → 5,2:1; rótulo de Vandria 3,2 → 4,8:1) y la jerarquía de títulos de las demos a pantalla completa (h3 → h2) |
| Enlaces internos, idiomas, sitemap, JSON-LD | 0 errores, 0 avisos |
| SEO | 84 páginas, 0 fallos |
| Consola | 0 errores en las demos (5 × 2 anchos) y en las webs de ejemplo |
| `check:chat` y `check:tema` | Fallan igual en `b8970ba`: comprueban la portada antigua (rev. 3), que ya no existe. No aplican |

## 4 quinquies. Ronda del 28/09 (noche): una escena 3D por demo, taller Brío, Finance mínimo, solo lo activo vivo

Orden: «cada demo, una experiencia interactiva con su propio 3D; taller en lugar de lubricantes; Finance con menos
información; la sección tiene que ir fluida». Regla aplicada: si un efecto no mejora la experiencia, fuera.

### Demos de la portada (rev. 3): cada una con su escena
Todo CSS 3D con `transform` y `opacity` (lo que la GPU compone sin repintar); sin WebGL, sin librerías, sin bucles
continuos. La escena cuenta lo que hace el producto, no decora:

| Demo | Escena | Qué se toca |
|---|---|---|
| Finance | Las facturas salen volando de la bandeja (una pila en perspectiva) y caen en el libro; la que no cuadra se queda delante | «Suelta las facturas», «Revisar la que no cuadra», corregir; «Ver las 23» (detalle solo si se pide) |
| Comercial | El embudo tendido en el suelo (`rotateX(40deg)`): la ficha del lead avanza por los carriles y el borrador de respuesta se levanta | «Que entre el lead», «Aprobar y enviar» |
| Operaciones | La semana como mesa de trabajo inclinada: los trabajos caen en su hueco y, con el retraso, uno se levanta y se mueve | «Aceptar el presupuesto», «Simular: el material llega tarde» |
| Atención | La conversación delante y, detrás, en profundidad, las fuentes que el asistente consulta (se iluminan las que usa) | Elegir la pregunta del paciente; elegir hueco |
| D-Code OS | Tres capas apiladas (tus herramientas → D-Code OS → tu día) que se separan al conectar | «Conectar con D-Code OS», «¿Qué ha pasado hoy?» |

- **Solo vive la demo abierta**: al cambiar de pestaña, la anterior se para (esperas canceladas) y su lienzo se vacía.
  Antes, cada demo visitada se quedaba montada (el DOM crecía de 690 a 877 nodos en un recorrido); ahora se mantiene
  en 638–651.
- **Teléfono**: la misma escena, más ligera: sin vuelos (las facturas se cuentan por lotes de 4), inclinación menor,
  sin sombras grandes.
- **Movimiento reducido**: los mismos pasos, sin vuelos ni esperas.

### Finance: primera vista mínima
Responde solo a tres preguntas: **qué es** («Finance registra solas tus facturas de proveedor»), **qué resuelve**
(«El taller recibe 23 a la semana y hoy se teclean a mano: dos horas, y algún IVA mal puesto») y **qué puedo hacer**
(un botón). Resultado en una línea («23 facturas registradas en 38 segundos. Tú solo miraste una»). Fuera de la primera
vista: la tabla de facturas recibidas con todas sus filas, el pie de pagos previstos de la semana y el párrafo largo del
problema (la tabla sigue disponible tras «Ver las 23»). Empresa: **Taller
Brío** (Leganés, 9 personas); la factura que no cuadra, neumáticos al 10 % (van al 21 %): 512 € → 563,20 €.

### Webs de ejemplo: Brío (taller mecánico) sustituye a Visqa (lubricantes)
Brío es un taller creíble y pequeño, no un ERP: **Inicio** (servicios y precio orientativo), **Cita** (servicio, hora,
matrícula; confirmación), **Sigue tu coche** (la pista del taller en 3D con cinco estaciones —recepción, diagnóstico,
presupuesto, reparación, listo—, hitos con hora, presupuesto que se aprueba o se pide llamada; el coche avanza) y
**Taller** (el panel del jefe de taller: trabajos por columnas y lo que se automatiza: citas confirmadas solas,
presupuestos aprobados por WhatsApp, avisos de ITV). Fotos renderizadas por D-Code (`scripts/v2/renders/taller.py`):
coche «CarConcept» (CC BY 4.0, atribuido al pie de Brío; ver `scripts/v2/renders/CREDITOS.md`).

### Webs de ejemplo: rendimiento
- **Una web viva a la vez**: el HTML de cada web vive en un `<template>`; se crea al elegirla y se borra al dejarla
  (tras girar hacia el lado). En su lugar, un **cartel** de pocos nodos (nombre, sector y lema). Las imágenes se piden al
  despertar la web que las usa. En el teléfono, despierta la que queda centrada y duerme la que sale.
- **Eliminado**: el reflejo en el suelo (`-webkit-box-reflect`, pintaba cada ventana dos veces) y los filtros de las
  ventanas de lado (sustituidos por un velo de opacidad).

### Medido (28/09, 18:15–18:25; render de Sánchez Rubio en pausa para no competir por la CPU)
Chromium sin GPU, CPU ×4. «Antes» = `c4d4b43` (la Preview de las 17:00); «después» = `a166268`.

| | Antes | Después |
|---|---|---|
| Webs de ejemplo, 1440 px (cambiar 4 veces de web + puntero 1 s): intervalo entre fotogramas p50 / p95 | 83,4 / 316,7 ms | **16,7 / 50,1 ms** |
| — fotogramas > 50 ms · tareas largas (máx.) | 81 · 23 (423 ms) | **26 · 2 (148 ms)** |
| — trabajo del hilo principal · nodos | 4,30 s · 825 | **2,53 s · 614** |
| Webs de ejemplo, 390 px: p95 · fotogramas > 50 ms | 33,4 ms · 4 | **16,8 ms · 2** |
| Demos en uso (cada una, 1440 y 390): tareas largas · p95 | 0 · 16,7 ms | 0 · 16,7 ms |
| Demo D-Code OS, 1440: trabajo del hilo | 3,44 s | **0,99 s** |
| Demo Comercial, 390: trabajo del hilo | 0,62 s | 1,08 s (escena nueva; sigue sin tareas largas) |
| Portada 390 (4G lenta): FCP / load | 1.148 / 1.718 ms | 1.196 / 1.693 ms (igual: ruido ±50 ms) |
| `/servicios/paginas-web` 390: FCP / LCP · KB · peticiones | 1.052 / 1.392 ms · 595 · 19 | 1.140 / 1.448 ms · **522 · 16** |

Entrar en la sección (bajar 8.000 px hasta «Tócalo») da 13–15 tareas largas en las dos versiones: la traza las atribuye
a composición en software (GPUTask 8,4 s + Commit 7,4 s; JavaScript 0,2 s), porque el entorno no tiene GPU. No son las
demos. FPS en GPU real: **NO MEDIDO** (el panel del navegador del equipo estaba oculto).

### Eliminado en esta ronda
Visqa (web, demo de Finance, renders y sus fuentes de Blender), el reflejo y los filtros del escenario de webs, los
lienzos 2D anteriores de las cinco demos, el montaje acumulado de demos, la tabla y el pie de tesorería siempre visibles de Finance.

## 4 bis. Interiores: del texto migrado a componentes

La migración del contenido de producción aplanaba los diseños antiguos: celdas en línea que quedaban pegadas («AltaF-2026-0140Anterior81A9…»), el pie antiguo convertido en capítulos (Cambios en proceso), listas de tarjetas convertidas en viñetas. Se corrige en `scripts/v2/migrar.mjs`, reconociendo la estructura y no la página:

| Estructura antigua | Ahora |
|---|---|
| Registros encadenados de VERI*FACTU | **Cadena**: tipo y número, huella anterior y huella propia; la propia de uno y la anterior del siguiente, unidas por una línea azul |
| Estados de VERI*FACTU | **Hoja de ruta**: una línea, un punto por paso, el actual encendido |
| `li` con título (b) + texto (span) | **Lista de puntos** con filete, número si lo lleva |
| Listas de tarjetas-enlace (áreas, servicios) | **Filas enlazadas** |
| Registros de varias celdas (extracto del banco) | **Tabla** |
| Tres o más puntos seguidos | **Rejilla** de dos columnas |
| «01» + título | **Paso numerado** |
| «Listo / En proceso / Próximamente» | **Indicador** (punto azul si está listo) |
| Retratos de los fundadores | Blanco y negro; el color vuelve al pasar |

Y como red de seguridad, un espacio entre dos elementos contiguos sin espacio entre ellos. Revisado con el detector automático de solapes en 70 páginas × 3 anchos: **0 incidencias**.

**Lectura con movimiento**: cabecera de página con la misma luz de estudio que la portada y título grande; capítulos numerados con una línea que se llena mientras se lee (`view-timeline`); títulos que se descubren; contenido que entra al llegar. Todo CSS en el compositor; sin soporte o con movimiento reducido, estático y completo.

**Navegación**: transición de vista entre documentos (`@view-transition`): fundido corto y cabecera fija, como una sola aplicación.

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
- Responsive: 70 rutas × 9 anchos (375 → 1920) sin solapes ni desbordamiento horizontal (28/09, §4 quater).

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
