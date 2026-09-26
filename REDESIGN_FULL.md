# REDESIGN_FULL: la remodelación completa de dcodepartners.com

Rama `claude/dcode-full-redesign`, que parte de `e99d61f`: el commit que
sirve hoy producción, según los deploys de Vercel. Esta rama no toca
producción.

## 1. Dirección (revisión 3)

Correcciones de la revisión de la preview 2:
- **Una sola escena 3D, completa y conectada.** Se retiran todas las figuras sueltas: datos, integración, laboratorio de pantallas, departamentos, método, precios y contacto.
- **Contrastes de producción.** En oscuro, las cajas y demos son papel blanco; en claro, cajas oscuras (grafito). El texto vuelve a leerse en el diagnóstico, en el explicador y en las demos.
- **Minimalismo.** Fuera el capítulo «Ocho áreas» y las bandas; la portada es la de producción más dos momentos 3D con sentido.
- **Finance, D-Code OS y los packs, con nombre propio** (ver §4).

## 2. El sistema D-Code (`assets/js/escenas/e-sistema.js`)

Un único objeto fabricado como un producto: una bandeja de aluminio mecanizado (con una placa interior anodizada encastrada) sobre la que vive la empresa entera.

| Pieza | Material | Qué es |
|---|---|---|
| 6 teclas | Aluminio anodizado en el color de cada área, con el icono grabado y un LED | Comercial, Marketing, Clientes, Operaciones, Finanzas y Administración (las áreas del explicador de producción) |
| Núcleo | Bloque de grafito con el logotipo de D-Code en aluminio; el píxel azul es vidrio con luz dentro | D-Code OS · un solo dato; el píxel azul es la IA |
| 3 palancas en cadena | Acero y aluminio | Automatizaciones: cada una dispara la siguiente |
| Pantalla | Marco de grafito y cristal | Panel de dirección (ilustrativo, sin datos de clientes) y, en el configurador, las capturas reales de Finance, D-Code OS y una web |
| Puerto con dos cables | Acero, aluminio y caucho | Integraciones con las herramientas de fuera |
| Pistas grabadas | Surco oscuro con luz y pulsos | Por donde corre el dato |

Sus tres usos:
- **Héroe · estudio (configurador).** Adaptación original de la referencia de Dribbble (ThreadLab): un banco de trabajo con rejilla y escuadras.
  - A la izquierda, la tarjeta del titular y una ficha.
  - En el centro, la pieza; se puede arrastrar para girarla.
  - A la derecha, los mandos: girar, acercar, alejar y centrar.
  - Abajo, la barra de módulos (Finance, D-Code OS, Agentes de IA, Automatizaciones, Integraciones y Páginas web) y la de áreas, con el botón «Hablemos».
  - Elegir un módulo o un área mueve la cámara a esa pieza y la ficha dice qué es, con el texto del catálogo o de la página del área y un enlace.
- **Qué hacemos · los nueve pasos.** El esquema 2D del explicador se sustituye por la pieza, fija a un lado mientras pasan los nueve pasos, con el texto de producción. Cada paso es un estado de la misma pieza:
  1. Áreas sueltas en ámbar.
  2. Parpadeo de problema.
  3. Escaneo de luz.
  4. La huella del núcleo, trazada.
  5. El núcleo sube y las pistas se encienden.
  6. Las palancas en cadena.
  7. La IA se enciende.
  8. El panel mide.
  9. Vista completa.
- **Interiores.** La misma pieza, enfocada en lo que trata cada página:
  - Departamentos: su tecla.
  - Agentes: la IA.
  - Automatizaciones: las palancas.
  - Integraciones: el puerto.
  - Páginas web: la pantalla con una web real.
  - Finance: la pantalla con Finance.
  - Sistemas a medida: el núcleo.
  - Método: los nueve pasos en bucle.
  - Casos: antes y después.
  - El resto: la pieza entera.

## 3. El motor (`assets/js/escenas/motor.js`)

- **Un solo `WebGLRenderer`** sobre un lienzo fijo y transparente para toda la página. Cada escena se dibuja con *scissor* en el rectángulo de su hueco `[data-escena]`: no hay un contexto WebGL por sección.
- **Carga en tres tiempos:**
  1. El HTML y el CSS pintan primero. El LCP es el titular.
  2. `app.js` (1,6 KB) espera a `requestIdleCallback` y entonces importa el motor y Three.js.
  3. La escena se importa cuando su hueco está a menos de un 70 % de pantalla. Se compila con `compileAsync` antes de entrar, así no hay tirones al hacer scroll.
- **Descarga:** a más de tres pantallas de distancia, la escena libera su geometría y sus luces.
- **Pausa:** fuera de pantalla, con la pestaña oculta o cuando todo está quieto.
- **Calidad:**

  | Nivel | Cuándo | DPR | Vidrio | Sombra de luz |
  |---|---|---|---|---|
  | alta | Escritorio con 8 GB o más | 1,8 | transmisión | sí |
  | media | Táctil, pantalla estrecha o ≤4 GB | 1,4 | transparencia | no |
  | baja | ≤2 GB o 2 núcleos | 1,0 | transparencia | no |

  Si la mediana del fotograma pasa de 24 ms, el DPR baja solo. `?calidad=` fuerza un nivel.
- **Recursos compartidos:** geometrías y materiales se crean una vez y los pulsos de dato son una sola `InstancedMesh` por escena.
- **Pósteres:** cada hueco lleva de fondo un fotograma real de la pieza en su modo, en WebP y por tema. Pinta al instante, queda como respaldo sin WebGL y el lienzo vivo lo sustituye. El de los nueve pasos solo se pide al acercarse.
- **Movimiento reducido:** un fotograma fijo por escena, sin animación.
- **Sin WebGL:** se queda el póster.

## 4. Precios, Finance y D-Code OS

- Portada: «Dos productos y un sistema a medida». Se añade D-Code OS con su precio de catálogo («Desde 2.900 € de implantación, según cuántos sistemas»).
- `/precios`: nueva sección «Qué es cada cosa». Finance (producto propio) y D-Code OS (la capa operativa), y los cinco servicios con el resumen del catálogo.
- Packs con el nombre de lo que llevan y una línea «Lleva: …» generada desde `catalogo.json`:
  - «Pack Finance + automatizaciones».
  - «Pack Finance con inteligencia + agente».
  - «Pack D-Code OS completo».
- Ningún precio cambia.

## 5. Sistema de diseño

Solo se redefinen tokens y revestimientos: el HTML de los componentes de
producción no se ha reescrito, así que sus pruebas siguen siendo válidas.

- **Oscuro:**
  - Fondos `#07080a`, `#0c0d10` y `#111317`.
  - Tinta `#eceef1`, `#a7abb3` y `#7c818b`.
  - Acento `#5b8cff`.
- **Claro:** hueso `#eeebe5`, tinta grafito y acento `#2b57f5`.
- **Tipos:**
  - Instrument Sans (display y texto).
  - Instrument Serif en cursiva como voz editorial.
  - Mono para las etiquetas técnicas.
- **Cabecera:** se oculta al bajar y reaparece al subir. El selector de tema va integrado en la navegación.
- **Superficies de producto** (demos, D-Code OS, diagnóstico, explicador y tarjetas): contraste con la página, como en producción. En oscuro, papel blanco con tinta oscura; en claro, grafito con tinta clara.

## 6. Qué se conserva de producción

Se conservan:
- Todo el contenido y las rutas.
- Los precios de `/precios`, sin cambiar una cifra.
- Las cuatro demos, D-Code OS, el diagnóstico, el formulario por pasos y el chatbot.
- ES/EN, SEO (títulos, meta, OG, JSON-LD, sitemap y canonical), el consentimiento y la analítica.
- La lista blanca de despliegue (`.vercelignore`).

No se ha inventado ninguna métrica, cliente, resultado, precio ni función.

## 7. Activos externos y licencias

| Activo | Origen | Licencia |
|---|---|---|
| Three.js r180 (build y 2 addons) | npm `three@0.180.0` | MIT (`docs/THREEJS-LICENSE.txt`) |
| Instrument Sans | npm `@fontsource-variable/instrument-sans` | OFL (`docs/FONTS-INSTRUMENT-SANS-OFL.txt`) |
| Instrument Serif | npm `@fontsource/instrument-serif` | OFL (`docs/FONTS-INSTRUMENT-SERIF-OFL.txt`) |
| Texturas de torneado, moleteado, uso y grano | Generadas por procedimiento | Propias |
| Pantallas de las escenas | Capturas de las demos y webs que ya están en producción | Propias |

Se retiran el HDRI, el postprocesado y los loaders que usaba el Núcleo.

## 8. Medido

Ver la sección «Medidas» de `PREVIEW.md`.

## 9. Limitaciones

- El sandbox no tiene GPU (SwiftShader). Las cifras de carga son fiables, pero los FPS y el tiempo al primer fotograma son varias veces peores que en un equipo real y hay que medirlos en hardware físico.
- La maquetación interna de las secciones de producto (demos, D-Code OS, diagnóstico y tablas de precios) es la de producción, revestida con el sistema nuevo.
- Los pósteres son fotogramas a 1× y se regeneran a mano tras tocar una escena (ver `PREVIEW.md`).
